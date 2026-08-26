import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Building,
  MapPin,
  Flame,
  Clock,
  ShieldCheck,
  DollarSign,
  Gift,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  Users,
  FileText,
  Sparkles,
  ChevronRight,
  Share2,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JobsView({
  jobItems = [],
  candidates = [],
  jobSheetUrl = 'https://docs.google.com/spreadsheets/d/1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko/edit?gid=0#gid=0',
  onNavigateToCandidateJob,
  onOpenJobDetail
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [copiedId, setCopiedId] = useState(null);

  // Map candidates by normalized position/company for O(1) matching
  const candidateCountByJob = useMemo(() => {
    const map = new Map();
    candidates.forEach((c) => {
      const pos = (c.positionCompany || c.position || '').toLowerCase().trim();
      if (pos) {
        map.set(pos, (map.get(pos) || 0) + 1);
      }
    });
    return map;
  }, [candidates]);

  // Unique taxonomy options
  const statusOptions = useMemo(() => {
    const set = new Set();
    jobItems.forEach((j) => {
      if (j.status) set.add(j.status.trim().toUpperCase());
    });
    return Array.from(set).sort();
  }, [jobItems]);

  const industryOptions = useMemo(() => {
    const set = new Set();
    jobItems.forEach((j) => {
      if (j.industry && j.industry !== 'Khác') set.add(j.industry.trim());
    });
    return Array.from(set).sort();
  }, [jobItems]);

  const locationOptions = useMemo(() => {
    const set = new Set();
    jobItems.forEach((j) => {
      if (j.location) set.add(j.location.trim());
    });
    return Array.from(set).sort();
  }, [jobItems]);

  const companyOptions = useMemo(() => {
    const set = new Set();
    jobItems.forEach((j) => {
      if (j.company) set.add(j.company.trim());
    });
    return Array.from(set).sort();
  }, [jobItems]);

  // Filtered Job List
  const filteredJobs = useMemo(() => {
    return jobItems.filter((job) => {
      // 1. Search Query Filter
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const matchTitle = job.title && job.title.toLowerCase().includes(q);
        const matchCompany = job.company && job.company.toLowerCase().includes(q);
        const matchIndustry = job.industry && job.industry.toLowerCase().includes(q);
        const matchLocation = job.location && job.location.toLowerCase().includes(q);
        const matchBonus = job.bonus && job.bonus.toLowerCase().includes(q);
        const matchSalary = job.salary && job.salary.toLowerCase().includes(q);
        const matchReq = job.requirements && job.requirements.toLowerCase().includes(q);

        if (!matchTitle && !matchCompany && !matchIndustry && !matchLocation && !matchBonus && !matchSalary && !matchReq) {
          return false;
        }
      }

      // 2. Status Filter
      if (selectedStatus !== 'ALL') {
        const s = (job.status || '').trim().toUpperCase();
        if (s !== selectedStatus) return false;
      }

      // 3. Industry Filter
      if (selectedIndustry !== 'ALL' && job.industry !== selectedIndustry) {
        return false;
      }

      // 4. Location Filter
      if (selectedLocation !== 'ALL' && job.location !== selectedLocation) {
        return false;
      }

      // 5. Company Filter
      if (selectedCompany !== 'ALL' && job.company !== selectedCompany) {
        return false;
      }

      return true;
    });
  }, [jobItems, searchTerm, selectedStatus, selectedIndustry, selectedLocation, selectedCompany]);

  // Key KPI stats
  const totalJobs = jobItems.length;
  const urgentJobsCount = useMemo(() => {
    return jobItems.filter((j) => (j.status || '').toUpperCase().includes('GẤP')).length;
  }, [jobItems]);

  const newJobsCount = useMemo(() => {
    return jobItems.filter((j) => (j.status || '').toUpperCase().includes('MỚI') || (j.status || '').toUpperCase() === 'MỚI').length;
  }, [jobItems]);

  const distinctCompaniesCount = companyOptions.length;

  // Status visual badge styling
  const getStatusBadge = (status = '') => {
    const s = status.toUpperCase();
    if (s.includes('GẤP')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
          <Flame className="w-3 h-3 text-rose-600" />
          <span>TUYỂN GẤP</span>
        </span>
      );
    }
    if (s.includes('MỚI') || s === 'MỚI') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>MỚI</span>
        </span>
      );
    }
    if (s.includes('LẠI')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <RefreshCw className="w-3 h-3 text-blue-600" />
          <span>TUYỂN LẠI</span>
        </span>
      );
    }
    if (s.includes('TẠM NGƯNG') || s.includes('NGƯNG')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <PauseCircle className="w-3 h-3 text-slate-500" />
          <span>TẠM NGƯNG</span>
        </span>
      );
    }
    if (s.includes('HOÀN THÀNH')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>ĐÃ HOÀN THÀNH</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        <Briefcase className="w-3 h-3" />
        <span>{status || 'ĐANG TUYỂN'}</span>
      </span>
    );
  };

  // Helper to copy recruitment pitch
  const handleCopyJobShare = (job) => {
    const text = `🔥 [CƠ HỘI NGHỀ NGHIỆP & BONUS CTV HẤP DẪN] 🔥
🏢 Doanh nghiệp: ${job.company}
💼 Vị trí: ${job.title}
📍 Khu vực: ${job.location} | Ngành: ${job.industry}
💵 Mức thu nhập: ${job.salary}
🎁 HOA HỒNG (BONUS) CTV: ${job.bonus}
🎯 Số lượng: ${job.headcount} | Bảo hành: ${job.warrantyPeriod}
${job.requirements ? `📝 Yêu cầu: ${job.requirements}\n` : ''}${job.jdFile ? `📄 File JD: ${job.jdFile}\n` : ''}
🔗 Link Google Sheet Job Trực Tiếp: ${job.sheetRowUrl}
🚀 Giới thiệu ứng viên ngay để nhận thưởng hoa hồng FastHunt!`;

    navigator.clipboard.writeText(text);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    setCopiedId(job.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyAllJobsSummary = () => {
    const text = `🔥 [BẢNG TỔNG HỢP JOBS TUYỂN DỤNG & BONUS CTV - FASTHUNT RECO] 🔥
📊 Tổng số vị trí đang mở: ${jobItems.length} Jobs
🏢 Doanh nghiệp tuyển dụng: ${distinctCompaniesCount} Doanh nghiệp
🔗 Link Google Sheet Job Toàn Hệ Thống: ${jobSheetUrl}

Danh sách các vị trí tiêu biểu:
${jobItems.slice(0, 10).map((j, i) => `${i + 1}. [${j.company}] ${j.title} - Lương: ${j.salary} - Bonus CTV: ${j.bonus}`).join('\n')}
... và còn nhiều vị trí hấp dẫn khác!`;

    navigator.clipboard.writeText(text);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    setCopiedId('ALL_JOBS');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ── 1. Top Executive Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white uppercase tracking-wider backdrop-blur-md border border-white/20">
                ⭐ Bảng Tin & Link Jobs Tuyển Dụng
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/30 text-amber-200 border border-amber-300/40 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>{urgentJobsCount} Vị trí Tuyển Gấp</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Bảng Tổng Hợp Vị Trí Tuyển Dụng & Bonus CTV
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Dữ liệu đồng bộ trực tiếp thời gian thực từ Google Sheet Jobs. Cập nhật chi tiết chế độ hoa hồng (Bonus), mức lương, yêu cầu JD và link chia sẻ tuyển dụng cho cộng tác viên.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <a
              href={jobSheetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 text-blue-700 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <span>Mở Google Sheet Jobs Gốc</span>
            </a>

            <button
              onClick={handleCopyAllJobsSummary}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/30 hover:bg-blue-500/50 text-white border border-white/30 rounded-2xl text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer whitespace-nowrap"
              title="Copy toàn bộ danh sách jobs để gửi Zalo / Telegram"
            >
              {copiedId === 'ALL_JOBS' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'ALL_JOBS' ? 'Đã Copy Bản Tin!' : 'Copy Bản Tin CTV'}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl text-white flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Tổng Số Vị Trí</p>
              <p className="text-xl sm:text-2xl font-black">{totalJobs} Jobs</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/30 rounded-xl text-rose-200 flex-shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-rose-200 uppercase tracking-wider">Đang Tuyển Gấp</p>
              <p className="text-xl sm:text-2xl font-black">{urgentJobsCount} Vị trí</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/30 rounded-xl text-amber-200 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">Vị Trí Mới Mở</p>
              <p className="text-xl sm:text-2xl font-black">{newJobsCount} Jobs Mới</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/30 rounded-xl text-indigo-200 flex-shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">Doanh Nghiệp</p>
              <p className="text-xl sm:text-2xl font-black">{distinctCompaniesCount} Đối tác</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Search, Status Tabs & Filters Bar ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Top Search & View Mode Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm vị trí tuyển dụng, công ty, ngành nghề, mức lương, bonus CTV..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Xóa
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Tìm thấy <span className="text-blue-600 dark:text-blue-400 font-extrabold">{filteredJobs.length}</span> / {totalJobs} jobs
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Dạng lưới thẻ"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Dạng danh sách bảng"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
              selectedStatus === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Tất cả ({jobItems.length})
          </button>

          {statusOptions.map((st, idx) => {
            const count = jobItems.filter((j) => (j.status || '').trim().toUpperCase() === st).length;
            const isSelected = selectedStatus === st;
            const isUrgent = st.includes('GẤP');
            const isNew = st.includes('MỚI');

            return (
              <button
                key={idx}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? isUrgent
                      ? 'bg-rose-600 text-white shadow-xs'
                      : isNew
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isUrgent && <Flame className="w-3.5 h-3.5 text-amber-300" />}
                {isNew && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                <span>{st}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dropdown Filters (Industry, Location, Company) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Ngành nghề */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Loại Ngành Nghề</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium cursor-pointer"
            >
              <option value="ALL">Tất cả ngành nghề ({industryOptions.length})</option>
              {industryOptions.map((ind, idx) => (
                <option key={idx} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Khu vực */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Khu Vực Địa Lý</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium cursor-pointer"
            >
              <option value="ALL">Tất cả khu vực ({locationOptions.length})</option>
              {locationOptions.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Doanh nghiệp */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Doanh Nghiệp / Đối Tác</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium cursor-pointer"
            >
              <option value="ALL">Tất cả doanh nghiệp ({companyOptions.length})</option>
              {companyOptions.map((comp, idx) => (
                <option key={idx} value={comp}>{comp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. Jobs Display (Grid or Table View) ── */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Briefcase className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="font-bold text-base text-slate-700 dark:text-slate-200">
            Không tìm thấy vị trí tuyển dụng nào phù hợp với bộ lọc hiện tại.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
              setSelectedIndustry('ALL');
              setSelectedLocation('ALL');
              setSelectedCompany('ALL');
            }}
            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredJobs.map((job) => {
            const isCopied = copiedId === job.id;
            const appliedCandidatesCount = candidateCountByJob.get(job.title.toLowerCase().trim()) || 0;

            return (
              <div
                key={job.id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Company & Status */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-base shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                          <span>{job.company}</span>
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="flex items-center gap-0.5 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px]">
                            {job.industry}
                          </span>
                        </div>
                      </div>
                    </div>

                    {getStatusBadge(job.status)}
                  </div>

                  {/* Job Title */}
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                  </div>

                  {/* Compensation & CTV Bonus Box */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/80 via-rose-50/40 to-blue-50/60 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border border-amber-200/70 dark:border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mức thu nhập:</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-right">
                        {job.salary}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-amber-200/50 dark:border-slate-700">
                      <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-rose-600" />
                        <span>Bonus CTV:</span>
                      </span>
                      <span className="font-black text-sm text-rose-600 dark:text-rose-400 font-mono">
                        {job.bonus}
                      </span>
                    </div>
                  </div>

                  {/* Slots & Warranty Info */}
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      <span>Tuyển: <strong className="text-slate-800 dark:text-slate-200">{job.headcount} chỉ tiêu</strong></span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>BH: <strong className="text-slate-800 dark:text-slate-200">{job.warrantyPeriod}</strong></span>
                    </span>
                  </div>

                  {/* Requirements / Notes Snippet */}
                  {job.requirements && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 border border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-200">Ghi chú: </span>
                      {job.requirements}
                    </div>
                  )}

                  {/* JD File Attachment Tag */}
                  {job.jdFile && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{job.jdFile}</span>
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2">
                    {/* Copy Job Share Pitch */}
                    <button
                      onClick={() => handleCopyJobShare(job)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-all cursor-pointer border border-blue-200/60 dark:border-blue-800/50"
                      title="Copy tin tuyển dụng gửi CTV"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Đã Copy!' : 'Chia Sẻ CTV'}</span>
                    </button>

                    {/* Open Direct Row in Google Sheet */}
                    <a
                      href={job.sheetRowUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                      title={`Mở dòng ${job.rowIndex} trong Google Sheet`}
                    >
                      <span>Dòng {job.rowIndex}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>

                  {/* View Candidates for this Job */}
                  {onNavigateToCandidateJob && (
                    <button
                      onClick={() => onNavigateToCandidateJob(job.title)}
                      className="w-full flex items-center justify-between py-1.5 px-3 bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>Xem hồ sơ ứng viên ({appliedCandidatesCount})</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── 4. Table View Format ── */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/80 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Dòng</th>
                  <th className="py-3.5 px-4">Doanh Nghiệp & Vị Trí</th>
                  <th className="py-3.5 px-4">Khu Vực & Ngành</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4">Mức Thu Nhập</th>
                  <th className="py-3.5 px-4">Bonus CTV</th>
                  <th className="py-3.5 px-4">Số Lượng & BH</th>
                  <th className="py-3.5 px-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredJobs.map((job) => {
                  const isCopied = copiedId === job.id;
                  const appliedCandidatesCount = candidateCountByJob.get(job.title.toLowerCase().trim()) || 0;

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 font-bold">
                        #{job.rowIndex}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {job.title}
                        </p>
                        <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          {job.company}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{job.location}</p>
                        <p className="text-[11px] text-slate-400">{job.industry}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(job.status)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {job.salary}
                      </td>
                      <td className="py-3.5 px-4 font-black text-rose-600 dark:text-rose-400 font-mono">
                        {job.bonus}
                      </td>
                      <td className="py-3.5 px-4 text-[11px]">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{job.headcount} slot</p>
                        <p className="text-slate-400">BH {job.warrantyPeriod}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleCopyJobShare(job)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg transition-colors cursor-pointer"
                            title="Copy tin tuyển dụng cho CTV"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <a
                            href={job.sheetRowUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                            title="Mở dòng trên Google Sheet"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          {onNavigateToCandidateJob && (
                            <button
                              onClick={() => onNavigateToCandidateJob(job.title)}
                              className="px-2 py-1 bg-slate-100 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 hover:text-blue-600 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              title="Xem ứng viên vị trí này"
                            >
                              {appliedCandidatesCount} UV
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
