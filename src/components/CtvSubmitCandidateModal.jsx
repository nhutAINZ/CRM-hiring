import React, { useState, useEffect } from 'react';
import {
  FileUp,
  X,
  User,
  Phone,
  Mail,
  Briefcase,
  DollarSign,
  Calendar,
  Link2,
  FileText,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CTV_SUBMIT_CV_FORM_URL } from '../services/sheetsService';

export default function CtvSubmitCandidateModal({
  isOpen,
  onClose,
  jobItems = [],
  initialJob = null,
  currentCtv = null,
  onSubmitCandidate = () => {},
  onOpenCtvAuth = () => {}
}) {
  const [selectedJobId, setSelectedJobId] = useState('');
  const [ctvCodeInput, setCtvCodeInput] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [desiredSalary, setDesiredSalary] = useState('');
  const [startTime, setStartTime] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial job and CTV
  useEffect(() => {
    if (initialJob) {
      setSelectedJobId(String(initialJob.id));
    } else if (jobItems.length > 0 && !selectedJobId) {
      setSelectedJobId(String(jobItems[0].id));
    }
  }, [initialJob, jobItems]);

  useEffect(() => {
    if (currentCtv?.ctvCode) {
      setCtvCodeInput(currentCtv.ctvCode);
    }
  }, [currentCtv]);

  if (!isOpen) return null;

  const selectedJob = jobItems.find((j) => String(j.id) === String(selectedJobId));

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const effectiveCtvCode = (currentCtv?.ctvCode || ctvCodeInput || '').trim();
    if (!effectiveCtvCode) {
      setErrorMsg('Vui lòng nhập hoặc chọn Mã CTV để ghi nhận hoa hồng');
      return;
    }
    if (!candidateName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên ứng viên');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại ứng viên');
      return;
    }
    if (!cvUrl.trim()) {
      setErrorMsg('Vui lòng nhập Link CV của ứng viên (Google Drive, Dropbox, TopCV...)');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const formattedTimestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newCandidate = {
      id: `uv_ctv_${Date.now()}`,
      name: candidateName.trim(),
      ctvCode: effectiveCtvCode.toUpperCase(),
      ctvName: currentCtv?.name || `CTV ${effectiveCtvCode}`,
      positionCompany: selectedJob ? `${selectedJob.title} - ${selectedJob.company}` : 'Vị trí chung',
      position: selectedJob?.title || 'Chưa chọn vị trí',
      company: selectedJob?.company || 'FastHunt Partner',
      desiredSalary: desiredSalary.trim() || selectedJob?.salary || 'Thỏa thuận',
      startTime: startTime.trim() || 'Sẵn sàng ngay',
      cvUrl: cvUrl.trim(),
      email: email.trim(),
      notes: notes.trim(),
      cvResultRaw: 'Mới tiếp nhận',
      pvResultRaw: 'Chờ duyệt CV',
      statusCandidate: 'Mới gửi',
      interviewDate: '',
      interviewTime: '',
      interviewLocation: '',
      onboardingDate: '',
      onboardingSalary: '',
      bonusDate: selectedJob?.bonus || 'Theo chính sách',
      timestamp: formattedTimestamp,
      isLocalSubmitted: true
    };

    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setTimeout(() => {
      onSubmitCandidate(newCandidate);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <FileUp className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                Nộp Hồ Sơ Ứng Viên Về Doanh Nghiệp
              </h2>
              <p className="text-xs text-blue-100/90">
                Ghi nhận mã CTV tức thì • Cập nhật tiến độ & bảo lưu hoa hồng 100%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CTV Identity Badge */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {currentCtv ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Ghi nhận cho CTV:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{currentCtv.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-[11px]">
                Mã: {currentCtv.ctvCode}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Bạn chưa đăng nhập CTV. Vui lòng nhập mã CTV bên dưới để tính hoa hồng:</span>
            </div>
          )}

          {!currentCtv && (
            <button
              type="button"
              onClick={onOpenCtvAuth}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs"
            >
              Đăng nhập CTV ngay →
            </button>
          )}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* CTV Code (if not logged in) */}
          {!currentCtv && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mã CTV Nhận Hoa Hồng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={ctvCodeInput}
                onChange={(e) => setCtvCodeInput(e.target.value.toUpperCase())}
                placeholder="Ví dụ: CTV01, CTV_HN02, THAO_HR..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold font-mono uppercase focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Job Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Vị Trí Công Việc Tuyển Dụng <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                {jobItems.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} • {j.company || 'Doanh nghiệp'} ({j.salary || 'Lương thỏa thuận'} | Thưởng: {j.bonus || '30%'})
                  </option>
                ))}
              </select>
              <Briefcase className="w-4 h-4 text-blue-600 absolute left-3 top-3 pointer-events-none" />
            </div>

            {selectedJob && (
              <div className="mt-2 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Doanh nghiệp: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedJob.company}</strong>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="text-slate-500 dark:text-slate-400">Lương: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedJob.salary || 'Thỏa thuận'}</strong>
                </div>
                <div className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                  Hoa hồng: {selectedJob.bonus || 'Tới 30%'}
                </div>
              </div>
            )}
          </div>

          {/* Candidate Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Họ và Tên Ứng Viên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Ví dụ: Trần Văn Nam"
                  required
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Số Điện Thoại Ứng Viên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xx xxx xxx"
                  required
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Ứng Viên
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ungvien@gmail.com"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mức Lương Mong Muốn
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={desiredSalary}
                  onChange={(e) => setDesiredSalary(e.target.value)}
                  placeholder="Ví dụ: 15 - 20 triệu"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                />
                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* CV URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Link CV Ứng Viên (Google Drive / TopCV / Dropbox / Web) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... hoặc link xem CV"
                required
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
              <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              🔒 Hãy đảm bảo link Drive được mở quyền xem (Anyone with the link can view).
            </p>
          </div>

          {/* Notes & Pre-screening */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Đánh Giá Sơ Bộ / Ghi Chú Của CTV Về Ứng Viên
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Điểm mạnh, số năm kinh nghiệm, kỹ năng nổi bật hoặc lý do giới thiệu ứng viên..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <a
              href={CTV_SUBMIT_CV_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Mở Google Form gốc</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'Đang Gửi Hồ Sơ...' : 'Gửi Hồ Sơ Ứng Viên Về CRM'}</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500">
          FastHunt CRM cam kết bảo mật hồ sơ và gửi thông báo lịch phỏng vấn cho CTV sớm nhất.
        </div>
      </div>
    </div>
  );
}
