// ====================================================================
// FASTHUNT RECRUITMENT AGENT - ZALO CTV JOB BROADCAST MODAL
// Human-in-the-Loop Job Push Creation, Review & Dispatch Modal
// ====================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Users,
  Copy,
  Check,
  Edit3,
  Flame,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateZaloJobBroadcastPitch } from '../services/aiMatchingService.js';

export default function ZaloBroadcastModal({
  job,
  jobsList = [],
  draftItem = null,
  onClose,
  onSaveDraft,
  onApproveAndSend
}) {
  const [selectedJobId, setSelectedJobId] = useState(job?.id || jobsList[0]?.id || '');
  const [targetType, setTargetType] = useState('ALL_CTV');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const activeJob = jobsList.find(j => j.id === selectedJobId) || job || jobsList[0];

  // Initialize or regenerate AI draft pitch when job or draft changes
  useEffect(() => {
    if (draftItem) {
      setTitle(draftItem.draftTitle || '');
      setContent(draftItem.draftContent || '');
      setTargetType(draftItem.targetType || 'ALL_CTV');
      if (draftItem.jobId) setSelectedJobId(draftItem.jobId);
    } else if (activeJob) {
      setTitle(`🔥 [DUYỆT ĐẨY JOB] ${activeJob.title.toUpperCase()} (${activeJob.company})`);
      setContent(generateZaloJobBroadcastPitch(activeJob, targetType));
    }
  }, [activeJob, draftItem, targetType]);

  const handleRegenerateAi = () => {
    if (!activeJob) return;
    const pitch = generateZaloJobBroadcastPitch(activeJob, targetType);
    setContent(pitch);
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleApprove = () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung tin nhắn trước khi duyệt.');
      return;
    }
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    if (onApproveAndSend) {
      onApproveAndSend({
        draftId: draftItem?.id,
        jobId: activeJob?.id,
        title,
        content,
        targetType
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b1121] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden my-6 flex flex-col specular-highlight">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 p-5 text-white flex items-start justify-between border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
                <Flame className="w-4 h-4 text-orange-400" />
              </span>
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                Quy Trình Duyệt Đẩy Job Cho CTV (Human-in-the-Loop)
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Soạn & Duyệt Tin Tuyển Dụng Zalo OA
            </h2>
            <p className="text-xs text-slate-300">
              Kiểm tra và chỉnh sửa nội dung tin nhắn trước khi phát sóng tới cộng tác viên qua Zalo Official Account.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Job Selector Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Vị Trí Cần Đẩy Job
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {jobsList.map((j) => (
                  <option key={j.id} value={j.id}>
                    [{j.company}] {j.title} (Bonus: {j.bonus})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Đối Tượng Nhận Tin Zalo
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL_CTV">Toàn Bộ Mạng Lưới CTV (450 CTV)</option>
                <option value="ACTIVE_CTV">Nhóm CTV Đang Hoạt Động Cao (120 CTV)</option>
                <option value="HN_CTV">Nhóm CTV Khu Vực Hà Nội</option>
                <option value="HCM_CTV">Nhóm CTV Khu Vực TP.HCM</option>
              </select>
            </div>
          </div>

          {/* Job Metadata Callout */}
          {activeJob && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeJob.title} - {activeJob.company}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Lương: {activeJob.salary} • Bảo hành: {activeJob.warrantyPeriod} • JD: {activeJob.jdFile || 'Kèm theo'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono">
                🎁 {activeJob.bonus}
              </span>
            </div>
          )}

          {/* Message Content Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                Nội Dung Tin Nhắn Gửi Zalo OA (Có Thể Chỉnh Sửa)
              </label>
              <button
                type="button"
                onClick={handleRegenerateAi}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Soạn Lại</span>
              </button>
            </div>

            <textarea
              rows={9}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              placeholder="Nhập nội dung tin nhắn tuyển dụng..."
            />
          </div>

          {/* Policy & Safety Notice */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Bảo đảm an toàn Zalo OA:</strong> Tin nhắn được gửi trực tiếp qua Zalo Official Account OpenAPI v3 chính thức. Việc bạn bấm "Duyệt & Phát Sóng" sẽ ghi nhận lịch sử kiểm duyệt của Recruiter.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-white/2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyPreview}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Text</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Hủy
            </button>

            <button
              onClick={handleApprove}
              className="btn-shiny flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Duyệt & Phát Sóng Zalo OA Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
