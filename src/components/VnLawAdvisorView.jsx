// ====================================================================
// FASTHUNT RECRUITMENT AGENT - VN LAW ADVISOR & LEGAL COMPLIANCE HUB
// Tham chiếu kiến trúc tri thức: CTU-LinguTechies/VN-Law-Advisor
// Thiết kế: Chuẩn Enterprise Legal-Tech & HR B2B Dashboard
// ====================================================================

import React, { useState, useMemo } from 'react';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  FileText,
  Search,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Coins,
  Clock,
  RotateCcw,
  Check,
  Copy,
  Info
} from 'lucide-react';
import {
  auditJobDescription,
  generateCompliantRewrite,
  CORE_LABOR_LAW_RULES,
  VIETNAM_MINIMUM_WAGE_2024,
  VN_LABOR_LAW_QA_DATABASE
} from '../services/vnLaborLawService';

export default function VnLawAdvisorView({ jobItems = [] }) {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'qa' | 'minimum_wage' | 'rules'
  
  // Scanner state
  const [selectedJobId, setSelectedJobId] = useState('');
  const [inputContent, setInputContent] = useState(
    'Tuyển dụng: Nhân viên Kinh doanh B2B\n- Địa điểm: Hà Nội\n- Yêu cầu: Nữ độ tuổi từ 22-28, ưu tiên độc thân, chưa lập gia đình để tập trung công việc.\n- Thử việc: 3 tháng, lương thử việc 70% lương chính thức.\n- Khi nhận việc cần nộp bằng đại học gốc để làm tin.'
  );
  const [auditResult, setAuditResult] = useState(() => auditJobDescription(inputContent));
  const [copiedText, setCopiedText] = useState(false);

  // Q&A state
  const [qaSearch, setQaSearch] = useState('');
  const [selectedQaCategory, setSelectedQaCategory] = useState('ALL');

  // Handle job pre-fill
  const handleSelectJobToScan = (jobId) => {
    setSelectedJobId(jobId);
    if (!jobId) return;
    const found = jobItems.find((j) => String(j.id) === String(jobId) || String(j.rowIndex) === String(jobId));
    if (found) {
      const jdText = `Vị trí: ${found.title || 'N/A'}\nCông ty: ${found.company || 'Doanh nghiệp đối tác'}\nĐịa điểm: ${found.location || 'Toàn quốc'}\nMức lương: ${found.salary || 'Thỏa thuận'}\nYêu cầu công việc:\n${found.requirements || 'Trao đổi chi tiết khi phỏng vấn'}`;
      setInputContent(jdText);
      setAuditResult(auditJobDescription(jdText));
    }
  };

  const handleRunAudit = () => {
    const res = auditJobDescription(inputContent);
    setAuditResult(res);
  };

  const handleApplyRewrite = () => {
    const cleaned = generateCompliantRewrite(inputContent, auditResult);
    setInputContent(cleaned);
    setAuditResult(auditJobDescription(cleaned));
  };

  const handleCopyCleaned = () => {
    navigator.clipboard.writeText(inputContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Filtered QA
  const filteredQa = useMemo(() => {
    return VN_LABOR_LAW_QA_DATABASE.filter((qa) => {
      const matchCat = selectedQaCategory === 'ALL' || qa.category === selectedQaCategory;
      const q = qaSearch.toLowerCase().trim();
      const matchSearch = !q || qa.question.toLowerCase().includes(q) || qa.answer.toLowerCase().includes(q) || qa.reference.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [qaSearch, selectedQaCategory]);

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans text-slate-900 dark:text-slate-100">
      
      {/* ── 1. ENTERPRISE HEADER (LEGAL-TECH SAAS STYLE) ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Scale className="w-3.5 h-3.5" />
              <span>Cố Vấn Pháp Luật Tuyển Dụng & Lao Động Việt Nam</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Trung Tâm Kiểm Định & Tuân Thủ Pháp Luật Lao Động
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Hệ thống rà soát tự động, cảnh báo vi phạm và đề xuất chỉnh sửa chuẩn **Bộ luật Lao động 2019**, **Nghị định 12/2022/NĐ-CP** và **Nghị định 74/2024/NĐ-CP**. Tham chiếu kiến trúc tri thức pháp điển mở từ <a href="https://github.com/CTU-LinguTechies/VN-Law-Advisor" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5">CTU-LinguTechies/VN-Law-Advisor <ExternalLink className="w-3 h-3" /></a>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Căn cứ pháp lý</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">BLLĐ 2019 & NĐ 74/2024</p>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cơ chế xử phạt</p>
              <p className="text-xs font-black text-rose-600 dark:text-rose-400">Nghị định 12/2022/NĐ-CP</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          {[
            { id: 'scanner', label: 'Quét & Kiểm Định JD / Tin Đăng', icon: ShieldCheck },
            { id: 'qa', label: 'Hỏi Đáp Luật Lao Động (Q&A)', icon: HelpCircle },
            { id: 'minimum_wage', label: 'Bảng Lương Tối Thiểu Vùng 2024 - 2026', icon: Coins },
            { id: 'rules', label: 'Quy Định Tuyển Dụng Trọng Yếu', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: SCANNER & AUDIT COMPLIANCE TOOL ── */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Input Form (Columns 1-7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Văn Bản JD hoặc Tin Tuyển Dụng Cần Kiểm Tra</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dán nội dung bất kỳ hoặc chọn nhanh từ danh mục Jobs đang tuyển để kiểm định
                </p>
              </div>

              {jobItems.length > 0 && (
                <div className="shrink-0">
                  <select
                    value={selectedJobId}
                    onChange={(e) => handleSelectJobToScan(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate"
                  >
                    <option value="">-- Nạp từ Job đang tuyển --</option>
                    {jobItems.map((j) => (
                      <option key={j.id || j.rowIndex} value={j.id || j.rowIndex}>
                        {j.title} ({j.company || 'Đối tác'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <textarea
              rows={9}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Nhập nội dung mô tả công việc (JD), yêu cầu tuyển dụng hoặc bài đăng mạng xã hội..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-xs font-mono leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunAudit}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kiểm Định Pháp Lý Ngay</span>
                </button>

                {!auditResult.isFullyCompliant && (
                  <button
                    type="button"
                    onClick={handleApplyRewrite}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
                    title="Thay thế các từ ngữ vi phạm bằng câu từ hợp chuẩn pháp luật"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Tự Động Sửa Sang Chuẩn Luật</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopyCleaned}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-blue-500" />}
                <span>{copiedText ? 'Đã Copy!' : 'Sao Chép Văn Bản'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Audit Score & Findings (Columns 8-12) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Compliance Score Card */}
            <div className={`p-6 rounded-3xl border shadow-xs space-y-3 ${
              auditResult.isFullyCompliant
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                : auditResult.violations.length > 0
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {auditResult.isFullyCompliant ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  ) : auditResult.violations.length > 0 ? (
                    <AlertOctagon className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  )}
                  <span className="font-extrabold text-sm uppercase tracking-wider">
                    {auditResult.isFullyCompliant ? 'Đạt Chuẩn Pháp Lý' : 'Cần Xử Lý Pháp Lý'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black">{auditResult.complianceScore}</span>
                  <span className="text-xs font-bold text-slate-400">/100</span>
                </div>
              </div>

              <p className="text-xs font-medium leading-relaxed">
                {auditResult.statusLabel}
              </p>
            </div>

            {/* Detailed Findings List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Chi Tiết Các Điểm Cần Chỉnh Sửa
              </h3>

              {auditResult.violations.length === 0 && auditResult.warnings.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs space-y-2">
                  <p className="font-bold">✓ Văn bản không phát hiện từ ngữ vi phạm các điều cấm trong BLLĐ 2019.</p>
                  <ul className="text-[11px] list-disc pl-4 space-y-1 text-emerald-700 dark:text-emerald-300">
                    <li>Không phân biệt đối xử về giới tính, hôn nhân (Điều 8).</li>
                    <li>Không yêu cầu đặt cọc tiền hay giữ văn bằng gốc (Điều 17).</li>
                    <li>Thời giờ làm việc và quy chế thử việc trong giới hạn pháp luật.</li>
                  </ul>
                </div>
              ) : null}

              {/* Violations */}
              {auditResult.violations.map((v, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-black text-rose-700 dark:text-rose-300 uppercase tracking-wide">
                      🔴 {v.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100">
                      Mức phạt: {v.fineRange}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>Căn cứ:</strong> {v.law} ({v.article}) & {v.decree}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    <strong>Từ khóa bị phát hiện:</strong> {v.matchedWords.map(w => `"${w}"`).join(', ')}
                  </p>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900 text-[11px] text-slate-800 dark:text-slate-200">
                    <strong className="text-emerald-600 dark:text-emerald-400">Đề xuất sửa:</strong> {v.replacement}
                  </div>
                </div>
              ))}

              {/* Warnings */}
              {auditResult.warnings.map((w, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-amber-800 dark:text-amber-300">
                      🟡 {w.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                      Lưu ý tuân thủ
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                    <strong>Căn cứ:</strong> {w.law} ({w.article})
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {w.description}
                  </p>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900 text-[11px] text-slate-800 dark:text-slate-200">
                    <strong className="text-emerald-600 dark:text-emerald-400">Đề xuất:</strong> {w.replacement}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 2: LEGAL Q&A DATABASE ── */}
      {activeTab === 'qa' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Tra Cứu Tình Huống Pháp Luật Tuyển Dụng & Lao Động
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Giải đáp nhanh các thắc mắc pháp lý phổ biến dành cho nhà tuyển dụng, CTV và HR doanh nghiệp
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={qaSearch}
                onChange={(e) => setQaSearch(e.target.value)}
                placeholder="Tìm câu hỏi, điều luật, từ khóa..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQa.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    {item.reference}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  {item.question}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: MINIMUM WAGE TABLE ── */}
      {activeTab === 'minimum_wage' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500" />
              <span>Bảng Mức Lương Tối Thiểu Vùng (Áp dụng theo Nghị định 74/2024/NĐ-CP)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Có hiệu lực thi hành từ ngày 01 tháng 07 năm 2024 và duy trì ổn định. Mọi mức lương thỏa thuận trong hợp đồng lao động không được thấp hơn bảng dưới đây.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Vùng Áp Dụng</th>
                  <th className="p-3.5">Mức Lương Tháng (VNĐ)</th>
                  <th className="p-3.5">Mức Lương Giờ (VNĐ)</th>
                  <th className="p-3.5">Phạm Vi Địa Bàn Tiêu Biểu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {Object.values(VIETNAM_MINIMUM_WAGE_2024).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400">{row.region}</td>
                    <td className="p-3.5 font-mono font-black text-slate-900 dark:text-white">
                      {row.monthly.toLocaleString('vi-VN')} đ/tháng
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {row.hourly.toLocaleString('vi-VN')} đ/giờ
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: CORE RULES REFERENCE ── */}
      {activeTab === 'rules' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Các Điều Khoản Bắt Buộc Trong Luật Tuyển Dụng Lao Động</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trích lục từ Bộ luật Lao động 2019 và Nghị định 12/2022/NĐ-CP xử phạt vi phạm hành chính
            </p>
          </div>

          <div className="space-y-4">
            {CORE_LABOR_LAW_RULES.map((rule) => (
              <div key={rule.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>{rule.title}</span>
                  </h3>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    Phạt tiền: {rule.fineRange}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500">
                  Căn cứ: {rule.law} ({rule.article}) | {rule.decree}
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {rule.description}
                </p>
                <div className="pt-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                  <strong>Khuyến nghị soạn thảo:</strong> {rule.recommendedReplacement}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER CITATION: ACKNOWLEDGE CTU-LINGUTECHIES / VN-LAW-ADVISOR ── */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          Cơ sở dữ liệu pháp lý tích hợp mô hình tri thức pháp điển Việt Nam mở (Open Legal Knowledge System).
        </span>
        <a
          href="https://github.com/CTU-LinguTechies/VN-Law-Advisor"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
        >
          <span>Tham chiếu CTU-LinguTechies/VN-Law-Advisor (GPL-3.0)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
}
