import React, { useState, useMemo } from 'react';
import {
  Building,
  Briefcase,
  ExternalLink,
  Copy,
  Check,
  Search,
  Users,
  Link,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClientsView({
  candidates = [],
  sheet2Items = [],
  sheet2ViewUrl,
  onNavigateToJob
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Group candidates into Clients / Job Positions
  const clientData = useMemo(() => {
    const map = new Map();

    // Pre-index sheet2Items for O(1) instant lookup complexity
    const sheet2Map = new Map();
    sheet2Items.forEach((s2) => {
      if (s2.name) {
        const key = s2.name.toLowerCase().trim();
        if (!sheet2Map.has(key)) {
          sheet2Map.set(key, s2.rowIndex);
        }
      }
    });

    candidates.forEach((c) => {
      // Determine company/client name
      let clientName = 'Khách Hàng Tuyển Dụng';
      let jobTitle = c.positionCompany || 'Vị trí chuyên môn';

      if (c.company) {
        clientName = c.company;
      } else if (c.positionCompany.includes('(')) {
        clientName = 'Đối Tác Enterprise';
      } else if (c.positionCompany.toLowerCase().includes('remote')) {
        clientName = 'Đối Tác Global / Remote';
      }

      if (!map.has(clientName)) {
        map.set(clientName, {
          name: clientName,
          jobs: new Map()
        });
      }

      const clientObj = map.get(clientName);
      if (!clientObj.jobs.has(jobTitle)) {
        clientObj.jobs.set(jobTitle, {
          title: jobTitle,
          candidates: [],
          salary: c.desiredSalary || 'Thỏa thuận',
          sheet2RowIndex: null
        });
      }

      const jobObj = clientObj.jobs.get(jobTitle);
      jobObj.candidates.push(c);

      // Match sheet 2 row index in O(1) time complexity
      if (c.name && !jobObj.sheet2RowIndex) {
        const normName = c.name.toLowerCase().trim();
        if (sheet2Map.has(normName)) {
          jobObj.sheet2RowIndex = sheet2Map.get(normName);
        }
      }
    });

    // Convert map to array
    const clientsList = [];
    map.forEach((clientObj) => {
      const jobsArray = Array.from(clientObj.jobs.values());
      clientsList.push({
        name: clientObj.name,
        jobs: jobsArray,
        totalCandidates: jobsArray.reduce((acc, j) => acc + j.candidates.length, 0)
      });
    });

    return clientsList;
  }, [candidates, sheet2Items]);

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clientData;
    const q = searchTerm.toLowerCase().trim();
    return clientData.filter((client) => {
      const matchClient = client.name.toLowerCase().includes(q);
      const matchJobs = client.jobs.some((j) => j.title.toLowerCase().includes(q));
      return matchClient || matchJobs;
    });
  }, [clientData, searchTerm]);

  // Total summary metrics
  const totalClientsCount = clientData.length;
  const totalJobsCount = clientData.reduce((acc, c) => acc + c.jobs.length, 0);

  // Copy Client Direct Connection Link & Summary
  const handleCopyClientConnectLink = (clientName, job) => {
    const baseUrl = sheet2ViewUrl || 'https://docs.google.com/spreadsheets/d/1QxicFfdrkDL_vsUv9uZPwSl1Osi0c06h4xDEBrU6p2Y/edit';
    const rowAnchor = job.sheet2RowIndex ? `#gid=0&range=A${job.sheet2RowIndex}` : '';
    const fullConnectUrl = `${baseUrl}${rowAnchor}`;

    const textToCopy = `[CỔNG KẾT NỐI KHÁCH HÀNG - FASTHUNT RECO]
🏢 Khách hàng: ${clientName}
💼 Vị trí tuyển dụng: ${job.title}
📊 Số hồ sơ đang xử lý: ${job.candidates.length} ứng viên
🔗 Link Connect Duyệt Hồ Sơ Trực Tiếp: ${fullConnectUrl}`;

    navigator.clipboard.writeText(textToCopy);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    setCopiedId(`${clientName}_${job.title}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ── 1. Top Header Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white/20 text-white uppercase tracking-wider backdrop-blur-md">
                CRM Client Portal
              </span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tính Năng Khách Hàng & Kết Nối Jobs
            </h1>
            <p className="text-xs sm:text-sm font-medium text-white/90 max-w-2xl">
              Quản lý danh sách đối tác doanh nghiệp, vị trí tuyển dụng (Jobs) và chia sẻ link portal duyệt hồ sơ trực tiếp cho khách hàng.
            </p>
          </div>

          <a
            href={sheet2ViewUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Link className="w-4 h-4" />
            <span>Mở Bảng Tổng Hợp Khách Hàng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl text-white">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/80 uppercase">Đối tác Khách Hàng</p>
              <p className="text-xl font-extrabold">{totalClientsCount} Doanh nghiệp</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/80 uppercase">Vị trí Jobs tuyển dụng</p>
              <p className="text-xl font-extrabold">{totalJobsCount} Jobs Open</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="p-2 bg-white/20 rounded-xl text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/80 uppercase">Tổng UV Kết Nối</p>
              <p className="text-xl font-extrabold">{candidates.length} Hồ sơ</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Search & Filter Bar ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm khách hàng, tên vị trí job..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Hiển thị <span className="text-red-600 dark:text-red-400">{filteredClients.length}</span> đối tác tuyển dụng
        </p>
      </div>

      {/* ── 3. Client Companies & Jobs Grid ── */}
      <div className="space-y-6">
        {filteredClients.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <Building className="w-10 h-10 mx-auto opacity-40 text-red-500" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-200">
              Không tìm thấy khách hàng nào phù hợp với từ khóa "{searchTerm}"
            </p>
          </div>
        ) : (
          filteredClients.map((client, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all hover:shadow-md"
            >
              {/* Client Card Header */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white font-extrabold text-base shadow-2xs">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{client.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        Đối tác Verified
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {client.jobs.length} vị trí tuyển dụng • {client.totalCandidates} ứng viên nộp hồ sơ
                    </p>
                  </div>
                </div>

                <a
                  href={sheet2ViewUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <Link className="w-3.5 h-3.5 text-red-600" />
                  <span>Portal Khách Hàng</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>

              {/* Jobs List for this Client */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.jobs.map((job, jIdx) => {
                  const copyKey = `${client.name}_${job.title}`;
                  const isCopied = copiedId === copyKey;

                  return (
                    <div
                      key={jIdx}
                      className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span>{job.title}</span>
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {job.salary}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            {job.candidates.length} hồ sơ ứng tuyển
                          </span>
                        </div>
                      </div>

                      {/* Job Connect Link Action Bar */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleCopyClientConnectLink(client.name, job)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-red-200/60 dark:border-red-800/50"
                          title="Copy link connect dành riêng cho Khách Hàng duyệt hồ sơ"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Đã Copy Link!' : 'Copy Link Connect'}</span>
                        </button>

                        <button
                          onClick={() => onNavigateToJob(job.title)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                          title="Xem ứng viên vị trí này"
                        >
                          <span>Xem UV</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
