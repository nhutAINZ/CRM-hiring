import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Building,
  MapPin,
  Flame,
  ShieldCheck,
  DollarSign,
  Gift,
  ExternalLink,
  Copy,
  Check,
  Users,
  FileText,
  Sparkles,
  Share2,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JobDetailModal({
  job,
  candidates = [],
  onClose,
  onNavigateToCandidateJob,
  onOpenEmailCandidate
}) {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  // Matching candidates from Sheet 1
  const matchingCandidates = candidates.filter((c) => {
    const pos = (c.positionCompany || c.position || '').toLowerCase().trim();
    const jobTitle = (job.title || '').toLowerCase().trim();
    return pos.includes(jobTitle) || jobTitle.includes(pos);
  });

  const handleCopyShare = () => {
    const text = `🔥 [THÔNG TIN TUYỂN DỤNG & HOA HỒNG CTV FASTHUNT] 🔥
🏢 Doanh nghiệp: ${job.company}
💼 Vị trí: ${job.title}
📍 Khu vực: ${job.location}
🏷️ Loại ngành: ${job.industry}
💰 Mức thu nhập: ${job.salary}
🎁 HOA HỒNG (BONUS) CTV: ${job.bonus}
🎯 Số lượng cần tuyển: ${job.headcount} chỉ tiêu
🛡️ Thời gian bảo hành: ${job.warrantyPeriod}
${job.requirements ? `📝 Ghi chú yêu cầu: ${job.requirements}\n` : ''}${job.jdFile ? `📄 File JD: ${job.jdFile}\n` : ''}
🔗 Link Dòng Google Sheet: ${job.sheetRowUrl}
⚡ Nhanh tay giới thiệu ứng viên phù hợp để nhận thưởng hoa hồng!`;

    navigator.clipboard.writeText(text);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl text-white shadow-inner">
                {job.company.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/20 text-white uppercase tracking-wider backdrop-blur-md">
                    Chi Tiết Vị Trí Tuyển Dụng
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-amber-950">
                    {job.status}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1 leading-snug">
                  {job.title}
                </h2>
                <p className="text-xs text-blue-100 font-semibold flex items-center gap-2 mt-0.5">
                  <span>{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.industry}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Highlighted Bonus & Salary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-slate-800 border border-rose-200 dark:border-rose-800/60 space-y-1">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-rose-600" />
                <span>Hoa Hồng (Bonus) CTV</span>
              </span>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {job.bonus}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Thưởng hoa hồng trực tiếp cho CTV khi ứng viên onboard thành công.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100/50 dark:from-blue-950/40 dark:to-slate-800 border border-blue-200 dark:border-blue-800/60 space-y-1">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span>Mức Thu Nhập / Lương</span>
              </span>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {job.salary}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lương cơ bản + hoa hồng doanh số theo chính sách doanh nghiệp.
              </p>
            </div>
          </div>

          {/* Job Parameters Info Table */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Thông Số Tuyển Dụng
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Số lượng cần tuyển</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{job.headcount} Chỉ tiêu</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Thời gian bảo hành</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{job.warrantyPeriod}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Vị trí dòng Sheet</p>
                <p className="font-extrabold text-blue-600 dark:text-blue-400 font-mono">Dòng #{job.rowIndex}</p>
              </div>
            </div>

            {job.requirements && (
              <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700 space-y-1 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300">Yêu Cầu & Ghi Chú Tuyển Dụng:</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {job.requirements}
                </p>
              </div>
            )}

            {job.jdFile && (
              <div className="pt-2 flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{job.jdFile}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  File JD
                </span>
              </div>
            )}
          </div>

          {/* Matching Applicants from Sheet 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Hồ Sơ Ứng Viên Đã Nộp Cho Vị Trí Này ({matchingCandidates.length})</span>
              </h4>

              {onNavigateToCandidateJob && matchingCandidates.length > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCandidateJob(job.title);
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Mở trong bảng ứng viên</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {matchingCandidates.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-600 dark:text-slate-300">Chưa có ứng viên nào nộp cho vị trí này</p>
                <p className="text-[11px]">Hãy chia sẻ tin tuyển dụng cho CTV để nhận hồ sơ ứng tuyển mới!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                {matchingCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{cand.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Mã CTV: <span className="font-mono font-semibold text-blue-600">{cand.ctvCode}</span> • Lương: {cand.desiredSalary || 'Thỏa thuận'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {cand.cvUrl && (
                        <a
                          href={cand.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[11px] font-bold"
                        >
                          CV
                        </a>
                      )}
                      {onOpenEmailCandidate && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenEmailCandidate(cand);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Gửi Mail
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <a
            href={job.sheetRowUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span>Mở Dòng #{job.rowIndex} Trên Google Sheet</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Đã Copy Tin Tuyển Dụng!' : 'Copy Tin Tuyển Dụng CTV'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
