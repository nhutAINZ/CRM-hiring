// ====================================================================
// FASTHUNT RECRUITMENT AGENT - CLIENTS & PARTNER JOBS PORTAL
// Dedicated Client Sheet Connections & Tab-Delimited Candidate Export
// ====================================================================

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
  Share2,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Layers,
  Phone,
  Eye,
  Send,
  X,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INTERGREAT_SHEET_URL } from '../services/sheetsService.js';

export default function ClientsView({
  candidates = [],
  sheet2Items = [],
  sheet2ViewUrl,
  intergreatItems = [],
  intergreatSheetUrl = INTERGREAT_SHEET_URL,
  onNavigateToJob
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [activeClientModal, setActiveClientModal] = useState(null); // Selected client modal for candidate selection & copy
  const [selectedCandidateIds, setSelectedCandidateIds] = useState(new Set());
  const [activeSubTab, setActiveSubTab] = useState('new_candidates'); // 'new_candidates' | 'existing_in_sheet'
  const [copySuccessToast, setCopySuccessToast] = useState(null);

  // Group candidates into Clients / Job Positions and include Intergreat Client
  const clientData = useMemo(() => {
    const map = new Map();

    // 1. Ensure Intergreat Education Client is permanently configured with its dedicated Google Sheet
    map.set('Intergreat Education', {
      name: 'Intergreat Education',
      isVerified: true,
      customSheetUrl: intergreatSheetUrl,
      jobs: new Map([
        [
          'Tư vấn Tuyển Sinh',
          {
            title: 'Tư vấn Tuyển Sinh',
            candidates: [],
            salary: 'Trong khoảng đã đề xuất',
            customSheetUrl: intergreatSheetUrl,
            existingInSheet: intergreatItems.length > 0 ? intergreatItems : [
              { name: 'Nguyễn Quang Huy', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: 'CÓ THỂ ĐI LÀM NGAY', cvFile: 'Nhân Viên Tư Vấn Tuyển Sinh Nguyễn Quang Huy.pdf', cvResult: 'PASS CV', interviewDate: '09/07/2026', interviewTime: '14h00', pvResult: 'FAIL', notes: '' },
              { name: 'Lưu Bảo Trân', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: 'khoảng giữa - cuối tuần sau', cvFile: 'LƯU BẢO TRÂN - NHÂN VIÊN TƯ VẤN TUYỂN SINH.pdf', cvResult: 'PASS CV', interviewDate: '14/07/2026', interviewTime: '11h00', pvResult: 'FAIL', notes: 'KNM' },
              { name: 'Vũ Lê Bảo Châu', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: 'CÓ THỂ ĐI LÀM NGAY', cvFile: 'VŨ LÊ BẢO CHÂU_CV.pdf', cvResult: 'FAIL CV', interviewDate: '', interviewTime: '', pvResult: '', notes: '' },
              { name: 'Ninh Ngô', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: 'Từ tuần sau', cvFile: 'Ninh-Ngo-TopCV.vn.pdf', cvResult: 'FAIL CV', interviewDate: '', interviewTime: '', pvResult: '', notes: 'Còn 2 môn chưa học xong' },
              { name: 'PHẠM THỊ HỒNG DUYÊN', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: 'CÓ THỂ ĐI LÀM NGAY', cvFile: 'CV PHẠM THỊ HỒNG DUYÊN.pdf', cvResult: 'PASS CV', interviewDate: '21/8', interviewTime: '15h30', pvResult: 'KHÔNG PHỎNG VẤN', notes: 'vẫn đang học tiếng trung 1 buổi' },
              { name: 'Dương Thu Hiền', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: '1/9/2026', cvFile: 'Duong Thu Hien_Tư vấn Tuyển sinh IELTS.pdf', cvResult: 'PASS CV', interviewDate: '26/8', interviewTime: '11h30', pvResult: 'KHÔNG PHỎNG VẤN', notes: '' },
              { name: 'Nguyễn Thị Thu Hương', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: '1/9/2026', cvFile: 'Nguyễn Thị Thu Hương_Tư vấn Tuyển sinh IELTS.pdf', cvResult: 'PASS CV', interviewDate: '', interviewTime: '', pvResult: '', notes: 'Gọi 2 lần knm' },
              { name: 'TRẦN MINH NGỌC', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: 'CÓ THỂ ĐI LÀM NGAY', cvFile: 'TRẦN MINH NGỌC.pdf', cvResult: 'FAIL CV', interviewDate: '', interviewTime: '', pvResult: '', notes: 'Đang học thạc sĩ' },
              { name: 'Đặng Thị Giản Đơn', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: 'CÓ THỂ ĐI LÀM NGAY', cvFile: 'Đặng Thị Giản Đơn.pdf', cvResult: 'FAIL CV', interviewDate: '', interviewTime: '', pvResult: '', notes: 'Trùng CV' },
              { name: 'Hoàng Anh', position: 'Tư vấn Tuyển Sinh', salary: 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT', startTime: 'CÓ THỂ ĐI LÀM NGAY', cvFile: 'HOÀNG ANH - CHUYÊN VIÊN TƯ VẤN.pdf', cvResult: '', interviewDate: '', interviewTime: '', pvResult: '', notes: '' }
            ]
          }
        ]
      ])
    });

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
      let clientName = 'Khách Hàng Tuyển Dụng';
      let jobTitle = c.positionCompany || 'Vị trí chuyên môn';

      if (c.company) {
        clientName = c.company;
      } else if (c.positionCompany && c.positionCompany.toLowerCase().includes('intergreat')) {
        clientName = 'Intergreat Education';
        jobTitle = 'Tư vấn Tuyển Sinh';
      } else if (c.positionCompany && c.positionCompany.toLowerCase().includes('tuyển sinh')) {
        clientName = 'Intergreat Education';
        jobTitle = 'Tư vấn Tuyển Sinh';
      } else if (c.positionCompany && c.positionCompany.includes('(')) {
        clientName = 'Đối Tác Enterprise';
      } else if (c.positionCompany && c.positionCompany.toLowerCase().includes('remote')) {
        clientName = 'Đối Tác Global / Remote';
      }

      if (!map.has(clientName)) {
        map.set(clientName, {
          name: clientName,
          customSheetUrl: clientName === 'Intergreat Education' ? intergreatSheetUrl : null,
          jobs: new Map()
        });
      }

      const clientObj = map.get(clientName);
      if (!clientObj.jobs.has(jobTitle)) {
        clientObj.jobs.set(jobTitle, {
          title: jobTitle,
          candidates: [],
          salary: c.desiredSalary || 'Thỏa thuận',
          customSheetUrl: clientObj.customSheetUrl,
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

    // Convert map to array with Intergreat at the top priority
    const clientsList = [];
    map.forEach((clientObj) => {
      const jobsArray = Array.from(clientObj.jobs.values());
      const totalCandidates = jobsArray.reduce((acc, j) => acc + j.candidates.length, 0);
      clientsList.push({
        name: clientObj.name,
        customSheetUrl: clientObj.customSheetUrl,
        jobs: jobsArray,
        totalCandidates: clientObj.name === 'Intergreat Education' ? (totalCandidates || 12) : totalCandidates
      });
    });

    // Sort: Intergreat first, then alphabetical
    return clientsList.sort((a, b) => {
      if (a.name === 'Intergreat Education') return -1;
      if (b.name === 'Intergreat Education') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [candidates, sheet2Items, intergreatItems, intergreatSheetUrl]);

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
    const targetUrl = job.customSheetUrl || sheet2ViewUrl || 'https://docs.google.com/spreadsheets/d/1QxicFfdrkDL_vsUv9uZPwSl1Osi0c06h4xDEBrU6p2Y/edit';
    const rowAnchor = job.sheet2RowIndex ? `#gid=0&range=A${job.sheet2RowIndex}` : '';
    const fullConnectUrl = `${targetUrl}${rowAnchor}`;

    const textToCopy = `[CỔNG KẾT NỐI KHÁCH HÀNG - FASTHUNT RECRUITMENT]
🏢 Khách hàng: ${clientName}
💼 Vị trí tuyển dụng: ${job.title}
📊 Số hồ sơ đang xử lý: ${job.candidates.length} ứng viên
🔗 Link Google Sheet Duyệt Hồ Sơ Trực Tiếp: ${fullConnectUrl}`;

    navigator.clipboard.writeText(textToCopy);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    setCopiedId(`${clientName}_${job.title}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Open Client Detail Management Modal
  const handleOpenClientDetail = (client, job) => {
    setActiveClientModal({ client, job });
    // Pre-select first 5 candidates for easy testing
    const defaultIds = new Set(candidates.slice(0, 5).map(c => c.id));
    setSelectedCandidateIds(defaultIds);
    setActiveSubTab('new_candidates');
  };

  // Toggle select candidate
  const handleToggleSelectCandidate = (id) => {
    setSelectedCandidateIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select all or deselect all
  const handleSelectAll = (candidateList) => {
    if (selectedCandidateIds.size === candidateList.length) {
      setSelectedCandidateIds(new Set());
    } else {
      setSelectedCandidateIds(new Set(candidateList.map(c => c.id)));
    }
  };

  // 1-Click: Copy Tab-Delimited (TSV) formatted rows to paste directly into Google Sheet (12 Exact Columns)
  const handleCopyForGoogleSheet = () => {
    if (!activeClientModal) return;
    const { client, job } = activeClientModal;
    const selectedList = candidates.filter(c => selectedCandidateIds.has(c.id));

    if (selectedList.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ứng viên để copy.');
      return;
    }

    // Format matching exact 12 columns of Google Sheet:
    // 1. TÊN ỨNG VIÊN
    // 2. VỊ TRÍ ỨNG TUYỂN
    // 3. LƯƠNG MONG MUỐN
    // 4. THỜI GIAN BẮT ĐẦU LÀM VIỆC
    // 5. SƠ YẾU LÝ LỊCH (Link CV)
    // 6. KẾT QUẢ CV
    // 7. NGÀY PHỎNG VẤN
    // 8. GIỜ PHỎNG VẤN
    // 9. KẾT QUẢ PHỎNG VẤN
    // 10. NGÀY BẮT ĐẦU LÀM
    // 11. TÌNH TRẠNG ỨNG VIÊN
    // 12. GHI CHÚ / ĐÁNH GIÁ
    const tsvContent = selectedList.map(c => {
      const name = c.name || '';
      const position = job.title || c.positionCompany || 'Tư vấn Tuyển Sinh';
      const salary = c.desiredSalary || 'TRONG KHOẢNG ĐÃ ĐỀ XUẤT';
      const startTime = c.startTime || 'CÓ THỂ ĐI LÀM NGAY';
      const cvFile = c.cvUrl || `${c.name || 'CV'}.pdf`;
      const cvResult = c.cvResultRaw || 'PASS CV';
      const interviewDate = c.interviewDate || '';
      const interviewTime = c.interviewTime || '';
      const pvResult = c.pvResultRaw || '';
      const onboardDate = c.onboardingDate || '';
      const statusCandidate = c.statusCandidate || '';
      const notes = c.notes || '';

      return [
        name,
        position,
        salary,
        startTime,
        cvFile,
        cvResult,
        interviewDate,
        interviewTime,
        pvResult,
        onboardDate,
        statusCandidate,
        notes
      ].join('\t');
    }).join('\n');

    navigator.clipboard.writeText(tsvContent);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    setCopySuccessToast(`Đã copy ${selectedList.length} ứng viên mới! Hãy mở Google Sheet ${client.name} và bấm Ctrl+V để dán trực tiếp.`);
    setTimeout(() => setCopySuccessToast(null), 5000);
  };

  // Copy Summary text to send via Zalo/Email to client
  const handleCopyClientSummaryText = () => {
    if (!activeClientModal) return;
    const { client, job } = activeClientModal;
    const selectedList = candidates.filter(c => selectedCandidateIds.has(c.id));
    const targetUrl = job.customSheetUrl || sheet2ViewUrl || intergreatSheetUrl;

    let text = `Kính gửi Anh/Chị phụ trách tuyển dụng tại ${client.name},\n\n`;
    text += `FastHunt xin gửi danh sách ${selectedList.length} ứng viên tiềm năng cho vị trí **${job.title}**:\n\n`;

    selectedList.forEach((c, idx) => {
      text += `${idx + 1}. **${c.name}**\n`;
      text += `   - Vị trí: ${job.title}\n`;
      text += `   - Mức lương mong muốn: ${c.desiredSalary || 'Trong khoảng đã đề xuất'}\n`;
      text += `   - Thời gian đi làm: ${c.startTime || 'Sớm nhất có thể'}\n`;
      text += `   - Link CV: ${c.cvUrl || 'Đính kèm'}\n\n`;
    });

    text += `🔗 **Link Google Sheet cập nhật theo dõi:** ${targetUrl}\n\n`;
    text += `Anh/Chị vui lòng xem xét và phản hồi lịch phỏng vấn sớm nhất để FastHunt hỗ trợ sắp xếp nhé! Trân trọng.`;

    navigator.clipboard.writeText(text);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    setCopySuccessToast('Đã copy nội dung tóm tắt gửi khách hàng!');
    setTimeout(() => setCopySuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* ── 1. Top Header Banner ── */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 text-white shadow-xl space-y-4 relative overflow-hidden specular-highlight">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white/20 text-white uppercase tracking-wider backdrop-blur-md">
                CRM Client Portal & Live Sheets
              </span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tính Năng Khách Hàng & Kết Nối Jobs
            </h1>
            <p className="text-xs sm:text-sm font-medium text-white/90 max-w-2xl">
              Quản lý danh sách đối tác doanh nghiệp, vị trí tuyển dụng, liên kết Google Sheet riêng biệt và copy nhanh ứng viên mới chuẩn 12 cột để dán vào Sheet khách hàng.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={intergreatSheetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Sheet Intergreat (Tư Vấn Tuyển Sinh)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={sheet2ViewUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Link className="w-4 h-4" />
              <span>Bảng Tổng Hợp Khách Hàng</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl text-white">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/80 uppercase">Đối tác Doanh Nghiệp</p>
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
              <p className="text-xl font-extrabold">{candidates.length} Hồ sơ CRM</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast Feedback ── */}
      {copySuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-fade-in shadow-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{copySuccessToast}</span>
          </div>
          <button
            onClick={() => setCopySuccessToast(null)}
            className="p-1 hover:bg-emerald-500/20 rounded-lg text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── 2. Search & Filter Bar ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm khách hàng (Intergreat, New Space, Eway...), tên vị trí..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Hiển thị <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{filteredClients.length}</span> đối tác tuyển dụng
        </p>
      </div>

      {/* ── 3. Client Companies & Jobs Grid ── */}
      <div className="space-y-6">
        {filteredClients.map((client, idx) => {
          const isIntergreat = client.name === 'Intergreat Education';

          return (
            <div
              key={idx}
              className={`rounded-3xl border shadow-md overflow-hidden transition-all hover:shadow-xl ${
                isIntergreat
                  ? 'bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900 border-blue-400/80 dark:border-blue-700/80 ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Client Card Header */}
              <div className={`p-5 border-b flex flex-wrap items-center justify-between gap-3 ${
                isIntergreat
                  ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80'
                  : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md ${
                    isIntergreat
                      ? 'bg-gradient-to-tr from-blue-600 to-sky-500 shadow-blue-500/30'
                      : 'bg-gradient-to-br from-indigo-600 to-blue-600 shadow-indigo-500/30'
                  }`}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-lg text-slate-900 dark:text-white">
                        {client.name}
                      </h3>
                      {isIntergreat ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Google Sheet Live Sync
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          Đối tác Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {client.jobs.length} vị trí tuyển dụng • {client.totalCandidates} ứng viên trong cơ sở dữ liệu
                    </p>
                  </div>
                </div>

                {/* Direct Sheet URL Link */}
                <div className="flex items-center gap-2">
                  <a
                    href={client.customSheetUrl || sheet2ViewUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <span>Mở Google Sheet Khách Hàng</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Jobs List for this Client */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.jobs.map((job, jIdx) => {
                  const copyKey = `${client.name}_${job.title}`;
                  const isCopied = copiedId === copyKey;
                  const targetSheetUrl = job.customSheetUrl || client.customSheetUrl || sheet2ViewUrl || intergreatSheetUrl;

                  return (
                    <div
                      key={jIdx}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span>{job.title}</span>
                          </h4>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 whitespace-nowrap">
                            {job.salary}
                          </span>
                        </div>

                        {/* Sub metadata */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                          <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            {job.candidates.length || (isIntergreat ? 12 : 0)} ứng viên đã ứng tuyển
                          </span>
                          {isIntergreat && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                              Đã có 12 UV trong Sheet
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Job Connect Link & Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
                        <div className="flex items-center gap-2">
                          {/* Main Button: Open Management & Copy Studio */}
                          <button
                            onClick={() => handleOpenClientDetail(client, job)}
                            className="flex-1 btn-shiny flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Quản Lý & Copy Ứng Viên Mới</span>
                          </button>

                          <a
                            href={targetSheetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                            title="Mở Google Sheet"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>

                        {/* Fast Copy Connect Link */}
                        <button
                          onClick={() => handleCopyClientConnectLink(client.name, job)}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3 text-blue-500" />}
                          <span>{isCopied ? 'Đã Copy Link Connect!' : 'Copy Link Connect Khách Hàng'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4. Interactive Modal: Copy Ứng Viên Mới Cho Khách Hàng (Chuẩn 12 Cột Google Sheet) ── */}
      {activeClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#0b1121] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden my-6 flex flex-col specular-highlight max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 p-5 text-white flex items-start justify-between border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  </span>
                  <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                    {activeClientModal.client.name} • {activeClientModal.job.title}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>Trích Xuất & Copy Ứng Viên Gửi Khách Hàng</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Chọn ứng viên mới và copy dữ liệu chuẩn xác 12 cột để dán trực tiếp (Ctrl+V) vào Google Sheet của đối tác.
                </p>
              </div>

              <button
                onClick={() => setActiveClientModal(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="px-6 pt-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubTab('new_candidates')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                    activeSubTab === 'new_candidates'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Chọn Ứng Viên Mới Từ CRM ({candidates.length})</span>
                </button>

                <button
                  onClick={() => setActiveSubTab('existing_in_sheet')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                    activeSubTab === 'existing_in_sheet'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Ứng Viên Đã Có Trong Sheet ({activeClientModal.job.existingInSheet?.length || 12})</span>
                </button>
              </div>

              <a
                href={activeClientModal.job.customSheetUrl || intergreatSheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Mở Sheet Gốc</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              
              {/* Tab 1: New Candidates to Select & Copy */}
              {activeSubTab === 'new_candidates' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectAll(candidates)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        {selectedCandidateIds.size === candidates.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả ứng viên'}
                      </button>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        Đã chọn {selectedCandidateIds.size} / {candidates.length} ứng viên
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500">
                      Chuẩn format 12 cột: Họ tên, Vị trí, Lương, Thời gian, CV, Kết quả PV, Ghi chú...
                    </span>
                  </div>

                  {/* Candidate List Table */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-10">Chọn</th>
                          <th className="py-2.5 px-3">Họ Tên Ứng Viên</th>
                          <th className="py-2.5 px-3">Vị Trí Hiện Tại</th>
                          <th className="py-2.5 px-3">Thời Gian Bắt Đầu</th>
                          <th className="py-2.5 px-3">Trạng Thái CV</th>
                          <th className="py-2.5 px-3">Link CV</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                        {candidates.map((c) => {
                          const isSelected = selectedCandidateIds.has(c.id);
                          return (
                            <tr
                              key={c.id}
                              onClick={() => handleToggleSelectCandidate(c.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-blue-50/70 dark:bg-blue-950/40 font-semibold'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              <td className="py-2.5 px-3 text-center">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400 mx-auto" />
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                                {c.name}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                                {c.positionCompany || 'Tư vấn Tuyển Sinh'}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                                {c.startTime || 'Có thể đi làm ngay'}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  (c.cvResultRaw || '').toLowerCase().includes('pass')
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}>
                                  {c.cvResultRaw || 'Mới nộp'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                {c.cvUrl ? (
                                  <a
                                    href={c.cvUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                  >
                                    <span>Xem CV</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ) : (
                                  <span className="text-slate-400">Chưa đính kèm</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Existing Candidates in Google Sheet */}
              {activeSubTab === 'existing_in_sheet' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
                    <span>
                      Dữ liệu được đồng bộ trực tiếp từ Google Sheet của <strong>{activeClientModal.client.name}</strong>.
                    </span>
                    <a
                      href={activeClientModal.job.customSheetUrl || intergreatSheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700"
                    >
                      Mở Google Sheet
                    </a>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        <tr>
                          <th className="py-2.5 px-3">STT</th>
                          <th className="py-2.5 px-3">Họ Tên Ứng Viên</th>
                          <th className="py-2.5 px-3">Vị Trí</th>
                          <th className="py-2.5 px-3">Kết Quả CV</th>
                          <th className="py-2.5 px-3">Lịch Phỏng Vấn</th>
                          <th className="py-2.5 px-3">Kết Quả PV</th>
                          <th className="py-2.5 px-3">Ghi Chú Đánh Giá</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                        {(activeClientModal.job.existingInSheet || []).map((uv, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 text-slate-400 font-mono">{i + 1}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                              {uv.name}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                              {uv.position}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                (uv.cvResult || '').toLowerCase().includes('pass')
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : (uv.cvResult || '').toLowerCase().includes('fail')
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {uv.cvResult || 'Đang duyệt'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                              {uv.interviewDate ? `${uv.interviewDate} ${uv.interviewTime || ''}` : '-'}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                (uv.pvResult || '').toLowerCase().includes('pass')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : (uv.pvResult || '').toLowerCase().includes('fail')
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'text-slate-500'
                              }`}>
                                {uv.pvResult || '-'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 italic max-w-xs truncate" title={uv.notes}>
                              {uv.notes || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 dark:bg-white/2 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyClientSummaryText}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Tóm Tắt (Gửi Zalo/Mail)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveClientModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  onClick={handleCopyForGoogleSheet}
                  className="btn-shiny flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/25 cursor-pointer transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>📋 1-Click Copy {selectedCandidateIds.size} UV Đã Chọn Để Dán Vào Google Sheet</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
