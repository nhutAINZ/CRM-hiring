// ====================================================================
// FASTHUNT RECRUITMENT AGENT - CV AI ANALYSIS & JOB MATCH MODAL
// Displays entity breakdown, Match % score, pros/cons, & job alternatives
// ====================================================================

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  User,
  Phone,
  Mail,
  Award,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CvAnalysisDetailModal({
  analysisData,
  onClose,
  onOpenCandidateDetail,
  onOpenEmail
}) {
  const [copied, setCopied] = useState(false);

  if (!analysisData) return null;

  const { candidate, matchedJob, matchScore, strengths, weaknesses, aiEvaluation, suggestedAlternativeJobs } = analysisData;

  const handleCopySummary = () => {
    const text = `[FASTHUNT AI - KẾT QUẢ THẨM ĐỊNH CV]
👤 Ứng viên: ${candidate.name}
📞 SĐT: ${candidate.phone || 'Chưa có'} | ✉️ Email: ${candidate.email || 'Chưa có'}
🎯 Vị trí đề xuất: ${matchedJob ? `${matchedJob.title} (${matchedJob.company})` : 'Chưa định danh'}
⭐ Điểm Match: ${matchScore}%
💡 Đánh giá: ${aiEvaluation}
🎁 Bonus CTV: ${matchedJob?.bonus || 'Theo quy định'}`;

    navigator.clipboard.writeText(text);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color code based on match score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30';
    return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0b1121] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden my-6 flex flex-col specular-highlight max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-5 sm:p-6 text-white flex items-start justify-between border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </span>
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Kết Quả Thẩm Định & Match CV Bằng AI (Claude Engine)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {candidate.name}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-0.5">
              {candidate.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" /> {candidate.phone}
                </span>
              )}
              {candidate.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" /> {candidate.email}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" /> {candidate.experienceYears} năm KN
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Primary Job Match Showcase Banner */}
          {matchedJob && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Vị Trí Phù Hợp Nhất: {matchedJob.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Doanh nghiệp: <strong>{matchedJob.company}</strong> • Thu nhập: {matchedJob.salary}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono">
                    🎁 Bonus CTV: {matchedJob.bonus}
                  </span>
                  <a
                    href={matchedJob.sheetRowUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Xem Dòng {matchedJob.rowIndex} trong Sheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Match Score Gauge */}
              <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${getScoreColor(matchScore)} min-w-[100px]`}>
                <span className="text-2xl sm:text-3xl font-black font-mono">{matchScore}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Độ Phù Hợp</span>
              </div>
            </div>
          )}

          {/* AI Executive Evaluation */}
          <div className="mengto-card p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Đánh Giá Tổng Quan Của AI (Claude FastHunt)</span>
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {aiEvaluation}
            </p>
          </div>

          {/* Skills & Candidate Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kỹ Năng & Từ Khóa Trích Xuất
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10"
                >
                  ⚡ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Strengths */}
            <div className="mengto-card mengto-card-emerald p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Điểm Mạnh Nổi Bật ({strengths.length})</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="mengto-card mengto-card-amber p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Điểm Cần Lưu Ý / Bổ Sung ({weaknesses.length})</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Alternative Suggested Job Openings */}
          {suggestedAlternativeJobs && suggestedAlternativeJobs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                <span>Vị Trí Tuyển Dụng Khác Có Thể Phù Hợp ({suggestedAlternativeJobs.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {suggestedAlternativeJobs.map((altJob) => (
                  <div key={altJob.id} className="mengto-card p-3 space-y-1.5 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {altJob.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                          {altJob.score}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{altJob.company}</p>
                      <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400">🎁 {altJob.bonus}</p>
                    </div>
                    {altJob.sheetRowUrl && (
                      <a
                        href={altJob.sheetRowUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold pt-1"
                      >
                        <span>Mở Sheet</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-white/2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-3">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã Copy Báo Cáo' : 'Copy Tóm Tắt Gửi Khách / CTV'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
