import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Mail,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Zap
} from 'lucide-react';

export default function UrgentAlertSection({
  urgentCandidates,
  onOpenEmail,
  onOpenDetail,
  sheet2ViewUrl
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  if (!urgentCandidates || urgentCandidates.length === 0) return null;

  const handleCopyZaloQuick = (c) => {
    const text = `[CẦN XỬ LÝ GẤP - TUYỂN DỤNG]
Họ tên UV: ${c.name}
Mã CTV: ${c.ctvCode}
Vị trí: ${c.positionCompany}
Ngày nộp CV: ${c.timestamp}
Trạng thái CV hiện tại: ${c.cvResultRaw || 'Chờ phản hồi'}
${c.interviewDate ? `Ngày Hẹn PV: ${c.interviewDate} ${c.interviewTime || ''}` : ''}
Link CV: ${c.cvUrl || 'N/A'}`;

    navigator.clipboard.writeText(text);
    const phone = c.phone || c.sdt || '';
    if (phone) {
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      window.open(`https://zalo.me/${cleanPhone}`, '_blank');
    }
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };


  return (
    <div className="mengto-card mengto-card-amber overflow-hidden">
      {/* Shimmer sweep overlay for urgency */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.3) 50%, transparent 100%)',
            backgroundSize: '200% auto',
            animation: 'shimmer 3.5s linear infinite'
          }}
        />
      </div>

      <div className="relative p-4 sm:p-5 space-y-4">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Pulse-ring amber alert icon */}
            <div className="relative flex-shrink-0">
              {/* Outer pulse ring */}
              <div
                className="absolute inset-0 rounded-2xl opacity-60"
                style={{ animation: 'pulseRing 2s ease-out infinite', background: 'rgba(245,158,11,0.4)' }}
              />
              <div className="relative w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/35 border border-amber-400/40 z-10">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">
                  Trung Tâm Xử Lý Gấp
                  <span className="font-mono ml-1 text-amber-600 dark:text-amber-400">({urgentCandidates.length} Hồ Sơ)</span>
                </h3>
                {/* Animated urgency badge */}
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white"
                  style={{
                    background: 'linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b)',
                    backgroundSize: '200% auto',
                    animation: 'shimmer 2s linear infinite'
                  }}
                >
                  <Zap className="w-2.5 h-2.5" />
                  Ưu tiên cao
                </span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400/80 mt-0.5">
                Cần thúc giục DN / CTV hoặc phản hồi ứng viên để tránh trễ hạn phản hồi.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-amber-800 dark:text-amber-300 hover:bg-amber-200/40 dark:hover:bg-white/5 transition-all cursor-pointer flex-shrink-0"
          >
            {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Urgent Cards Grid ── */}
        {!collapsed && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 animate-fade-in">
            {urgentCandidates.map((c, idx) => (
              <div
                key={c.id}
                className="relative group mengto-card rounded-2xl p-4 space-y-3 flex flex-col justify-between overflow-hidden"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Left border accent */}
                <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 opacity-70 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-1.5 pl-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        onClick={() => onOpenDetail(c)}
                        className="text-xs font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors leading-tight"
                      >
                        {c.name}
                      </h4>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/8">
                        CTV: {c.ctvCode || 'N/A'}
                      </span>
                    </div>
                    <span className="status-badge status-badge-amber flex-shrink-0">{c.cvResultRaw || 'Chờ duyệt'}</span>
                  </div>

                  <p className="text-[11.5px] text-slate-600 dark:text-slate-300 line-clamp-1">
                    <strong className="font-semibold">Vị trí:</strong> {c.positionCompany}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    <span>Nộp ngày: {c.timestamp}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-2.5 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => onOpenEmail(c)}
                    id={`urgent-email-${c.id}`}
                    className="btn-shiny flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-500/25 cursor-pointer transition-all"
                  >
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span>Tạo Email</span>
                  </button>

                  <button
                    onClick={() => handleCopyZaloQuick(c)}
                    id={`urgent-zalo-${c.id}`}
                    className="btn-shiny flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/8 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-white/8 cursor-pointer transition-all"
                    title="Copy tin nhắn tóm tắt Zalo"
                  >
                    {copiedId === c.id
                      ? <Check className="w-3 h-3 text-emerald-500" />
                      : <Copy className="w-3 h-3" />
                    }
                    <span>Zalo</span>
                  </button>

                  <button
                    onClick={() => onOpenDetail(c)}
                    id={`urgent-detail-${c.id}`}
                    className="btn-shiny p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/8 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/8 cursor-pointer transition-all"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {c.cvUrl && (
                    <a
                      href={c.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200/60 dark:border-indigo-500/25 transition-all"
                      title="Mở Google Drive CV"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
