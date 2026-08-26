import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Mail,
  Share2,
  CheckCircle2,
  Clock,
  Calendar,
  Briefcase,
  Save,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Gift,
  Sparkles
} from 'lucide-react';
import {
  normalizeCvResult,
  normalizePvResult,
  getStoredNotes,
  saveCandidateNote
} from '../utils/dataNormalizer';

export default function CandidateDetailModal({
  candidate,
  candidatesList = [],
  jobItems = [],
  onClose,
  onOpenEmail,
  sheet2ViewUrl,
  onNavigateCandidate
}) {
  const candidateId = candidate?.id;
  const [noteText, setNoteText] = useState('');
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Match corresponding job from jobItems
  const matchedJob = candidate ? jobItems.find((j) => {
    const pos = (candidate.positionCompany || candidate.position || '').toLowerCase().trim();
    const jobTitle = (j.title || '').toLowerCase().trim();
    return pos.includes(jobTitle) || jobTitle.includes(pos);
  }) : null;

  // Load candidate note from localStorage
  useEffect(() => {
    if (!candidateId) return;
    const allNotes = getStoredNotes();
    setNoteText(allNotes[candidateId]?.text || '');
  }, [candidateId]);

  if (!candidate) return null;

  const currentIndex = candidatesList.findIndex((c) => c.id === candidate.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < candidatesList.length - 1;

  const cvNorm = normalizeCvResult(candidate.cvResultRaw);
  const pvNorm = normalizePvResult(candidate.pvResultRaw, candidate.interviewDate);

  const handleSaveNote = () => {
    saveCandidateNote(candidate.id, noteText);
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 2000);
  };

  const handleCopyZalo = () => {
    const text = `[HỒ SƠ ỨNG VIÊN - ${candidate.name}]
Mã CTV: ${candidate.ctvCode}
Vị trí ứng tuyển: ${candidate.positionCompany}
Mức lương mong muốn: ${candidate.desiredSalary || 'Chưa thỏa thuận'}
Thời gian nộp: ${candidate.timestamp}
Trạng thái CV: ${candidate.cvResultRaw || 'Chờ phản hồi'}
Lịch PV: ${candidate.interviewDate ? `${candidate.interviewDate} ${candidate.interviewTime || ''}` : 'Chưa xếp'}
Link CV: ${candidate.cvUrl || 'Không có'}`;

    navigator.clipboard.writeText(text);
    const phone = candidate.phone || candidate.sdt || '';
    if (phone) {
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      window.open(`https://zalo.me/${cleanPhone}`, '_blank');
    }
    setCopiedId('zalo');
    setTimeout(() => setCopiedId(null), 2000);
  };


  const handleCopyClient = () => {
    const shareUrl = sheet2ViewUrl || 'https://docs.google.com/spreadsheets/d/1QxicFfdrkDL_vsUv9uZPwSl1Osi0c06h4xDEBrU6p2Y/edit';
    const text = `[HỒ SƠ ỨNG VIÊN GỬI DOANH NGHIỆP]
- Ứng viên: ${candidate.name}
- Vị trí: ${candidate.positionCompany}
- Lương mong muốn: ${candidate.desiredSalary || 'Thỏa thuận'}
- Thời gian đi làm: ${candidate.startTime || 'Sớm nhất có thể'}
- Link CV Gốc: ${candidate.cvUrl || 'N/A'}
- Bảng tổng hợp: ${shareUrl}`;

    navigator.clipboard.writeText(text);
    setCopiedId('client');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b1121] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden my-6 flex flex-col specular-highlight">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0a0f1d] via-[#12192e] to-[#0a0f1d] p-5 sm:p-6 text-white flex items-start justify-between border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                CTV: {candidate.ctvCode || 'N/A'}
              </span>
              <span className="text-xs text-slate-400">Nộp ngày: {candidate.timestamp || 'N/A'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {candidate.name}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>{candidate.positionCompany || 'Chưa rõ vị trí'}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev / Next navigation buttons */}
            {onNavigateCandidate && (
              <div className="flex items-center bg-white/10 rounded-xl p-0.5 mr-2">
                <button
                  onClick={() => hasPrev && onNavigateCandidate(candidatesList[currentIndex - 1])}
                  disabled={!hasPrev}
                  className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Ứng viên trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-slate-400 font-mono px-1">
                  {currentIndex + 1}/{candidatesList.length}
                </span>
                <button
                  onClick={() => hasNext && onNavigateCandidate(candidatesList[currentIndex + 1])}
                  disabled={!hasNext}
                  className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Ứng viên tiếp theo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 4-Step Recruitment Timeline */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">
              Tiến Trình Ứng Tuyển & Thẩm Định
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Step 1: Nộp CV */}
              <div className="mengto-card rounded-2xl p-3">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">1. Nộp Hồ Sơ</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Đã tiếp nhận</p>
                <span className="text-[10px] text-slate-500 font-mono block truncate">{candidate.timestamp}</span>
              </div>

              {/* Step 2: Kết Quả CV */}
              <div
                className={`mengto-card rounded-2xl p-3 ${
                  cvNorm.key === 'PASS'
                    ? 'mengto-card-emerald text-emerald-800 dark:text-emerald-300'
                    : cvNorm.key === 'FAIL'
                    ? 'border-rose-400/40 text-rose-800 dark:text-rose-300'
                    : 'mengto-card-amber text-amber-800 dark:text-amber-300'
                }`}
              >
                <span className="text-[10px] opacity-75 font-bold block uppercase">2. Kết Quả CV</span>
                <p className="text-xs font-bold mt-1">{cvNorm.label}</p>
                <span className="text-[10px] block opacity-80 truncate">{candidate.cvResultRaw}</span>
              </div>

              {/* Step 3: Phỏng Vấn */}
              <div
                className={`mengto-card rounded-2xl p-3 ${
                  pvNorm.key === 'PASS'
                    ? 'mengto-card-cyan text-cyan-800 dark:text-cyan-300'
                    : pvNorm.key === 'FAIL'
                    ? 'border-rose-400/40 text-rose-800 dark:text-rose-300'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-[10px] opacity-75 font-bold block uppercase">3. Phỏng Vấn</span>
                <p className="text-xs font-bold mt-1">{pvNorm.label}</p>
                <span className="text-[10px] block opacity-80 truncate">{candidate.interviewDate || 'Chưa có lịch'}</span>
              </div>

              {/* Step 4: Onboarding */}
              <div className="mengto-card mengto-card-purple rounded-2xl p-3 text-purple-900 dark:text-purple-300">
                <span className="text-[10px] opacity-75 font-bold block uppercase">4. Onboarding</span>
                <p className="text-xs font-bold mt-1">
                  {candidate.onboardingDate ? candidate.onboardingDate : 'Chưa đi làm'}
                </p>
                <span className="text-[10px] block opacity-80">
                  {candidate.onboardingDate ? 'Đã chốt ngày' : 'Đang theo dõi'}
                </span>
              </div>
            </div>
          </div>

          {/* Details 2-Column Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="mengto-card p-4 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Thông Tin Hồ Sơ & Lương</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mức lương mong muốn:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{candidate.desiredSalary || 'Thỏa thuận'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Thời gian bắt đầu:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{candidate.startTime || 'Thỏa thuận'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email ứng viên:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{candidate.email || 'Chưa cung cấp'}</span>
              </div>
            </div>

            <div className="mengto-card p-4 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Chi Tiết Lịch Phỏng Vấn</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ngày phỏng vấn:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{candidate.interviewDate || 'Chưa hẹn'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Giờ phỏng vấn:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{candidate.interviewTime || 'Chưa có'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Kết quả PV:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{candidate.pvResultRaw || 'Chưa có'}</span>
              </div>
            </div>
          </div>

          {/* Matched Job & CTV Bonus Callout (from Google Sheet Jobs) */}
          {matchedJob && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-rose-500/10 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Vị Trí Tuyển Dụng Gốc: {matchedJob.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Doanh nghiệp: <strong>{matchedJob.company}</strong> • Khu vực: {matchedJob.location} • Bảo hành: {matchedJob.warrantyPeriod}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono">
                    🎁 Bonus CTV: {matchedJob.bonus}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Trạng thái: {matchedJob.status}
                  </span>
                </div>
              </div>

              <a
                href={matchedJob.sheetRowUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-2xs"
              >
                <span>Mở Job Sheet (Dòng {matchedJob.rowIndex})</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Recruiter Internal Notes */}
          <div className="mengto-card mengto-card-amber p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                Ghi Chú Nội Bộ Của Recruiter (Lưu trên máy)
              </span>
              {savedNoteSuccess && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Đã lưu
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Nhập ghi chú nhanh (ví dụ: Đã gọi hẹn lại chiều mai, ứng viên có kinh nghiệm Nodejs 3 năm...)"
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-500/30 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                className="btn-shiny flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Ghi Chú</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-white/2 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyZalo}
              className="btn-shiny flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              title="Copy tóm tắt tin nhắn Zalo"
            >
              {copiedId === 'zalo' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Zalo</span>
            </button>

            <button
              onClick={handleCopyClient}
              className="btn-shiny flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
              title="Copy tóm tắt gửi Khách hàng"
            >
              {copiedId === 'client' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>Copy Gửi Khách</span>
            </button>

            {candidate.cvUrl && (
              <a
                href={candidate.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-shiny flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem CV Gốc</span>
              </a>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenEmail(candidate);
            }}
            className="btn-shiny flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 border border-emerald-400/30 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Tạo Thư Mời / Email</span>
          </button>
        </div>
      </div>
    </div>
  );
}
