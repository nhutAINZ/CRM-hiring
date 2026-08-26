import React from 'react';
import {
  Inbox,
  CheckCircle2,
  Calendar,
  Sparkles,
  XCircle,
  Mail,
  Eye,
  ExternalLink,
  Clock,
  Briefcase,
  InboxIcon
} from 'lucide-react';
import { getCandidateStage } from '../utils/dataNormalizer';

/* Column config with color tokens */
const COLUMNS = [
  {
    id: 'applied',
    title: 'Ứng Tuyển Mới',
    subtitle: 'Chờ duyệt hồ sơ',
    icon: Inbox,
    accent: '#3b82f6',
    cardVariant: 'mengto-card-blue',
    badgeClass: 'status-badge status-badge-blue'
  },
  {
    id: 'cv_pass',
    title: 'Đã Pass CV',
    subtitle: 'Chờ xếp lịch phỏng vấn',
    icon: CheckCircle2,
    accent: '#10b981',
    cardVariant: 'mengto-card-emerald',
    badgeClass: 'status-badge status-badge-emerald'
  },
  {
    id: 'interviewing',
    title: 'Đang Phỏng Vấn',
    subtitle: 'Có lịch / chờ kết quả',
    icon: Calendar,
    accent: '#06b6d4',
    cardVariant: 'mengto-card-cyan',
    badgeClass: 'status-badge status-badge-blue'
  },
  {
    id: 'onboarded',
    title: 'Trúng Tuyển & Onboard',
    subtitle: 'Đã nhận việc / có ngày đi làm',
    icon: Sparkles,
    accent: '#a855f7',
    cardVariant: 'mengto-card-purple',
    badgeClass: 'status-badge status-badge-purple'
  },
  {
    id: 'rejected',
    title: 'Không Phù Hợp',
    subtitle: 'Fail CV hoặc Fail PV',
    icon: XCircle,
    accent: '#f43f5e',
    cardVariant: 'mengto-card-rose',
    badgeClass: 'status-badge status-badge-rose'
  }
];

export default function KanbanBoard({
  candidates,
  onOpenDetail,
  onOpenEmail,
  sheet2ViewUrl
}) {
  // Group candidates into stages
  const grouped = { applied: [], cv_pass: [], interviewing: [], onboarded: [], rejected: [] };
  candidates.forEach((c) => {
    const stage = getCandidateStage(c);
    if (grouped[stage]) grouped[stage].push(c);
    else grouped.applied.push(c);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Kanban Pipeline Quy Trình Tuyển Dụng
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Theo dõi ứng viên xuyên suốt các giai đoạn từ Tiếp nhận → Phỏng vấn → Đi làm.
          </p>
        </div>
        {/* Total count */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-xs font-bold text-slate-600 dark:text-slate-300">
          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
          {candidates.length} ứng viên
        </span>
      </div>

      {/* ── 5 Column Kanban Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 items-start">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          const items = grouped[col.id] || [];

          return (
            <div
              key={col.id}
              className={`mengto-card ${col.cardVariant} flex flex-col max-h-[800px] overflow-hidden`}
            >
              {/* ── Column Header with Colored Top Bar ── */}
              <div className="relative">
                {/* Colored top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[20px]"
                  style={{ background: col.accent, boxShadow: `0 1px 8px ${col.accent}60` }}
                />
                <div className="p-3.5 pt-4 border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Icon with ambient glow */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${col.accent}18`,
                        border: `1px solid ${col.accent}35`,
                        color: col.accent
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-[11.5px] font-bold text-slate-900 dark:text-white leading-tight">
                        {col.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{col.subtitle}</p>
                    </div>
                  </div>
                  {/* Count badge */}
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-extrabold flex-shrink-0"
                    style={{
                      background: `${col.accent}15`,
                      color: col.accent,
                      border: `1px solid ${col.accent}30`
                    }}
                  >
                    {items.length}
                  </span>
                </div>
              </div>

              {/* ── Cards List ── */}
              <div className="p-2.5 space-y-2 overflow-y-auto kanban-scroll flex-1">
                {items.length === 0 ? (
                  // Illustrated empty state
                  <div className="py-10 flex flex-col items-center text-center gap-2">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center opacity-25"
                      style={{ background: `${col.accent}20`, border: `2px dashed ${col.accent}40` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: col.accent }} />
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Chưa có hồ sơ nào</p>
                  </div>
                ) : (
                  items.map((c, idx) => (
                    <div
                      key={c.id}
                      className="mengto-card rounded-xl p-3 space-y-2 relative group cursor-default"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* Left color accent */}
                      <div
                        className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full opacity-50 group-hover:opacity-90 transition-opacity"
                        style={{ background: col.accent }}
                      />

                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-1 pl-2">
                        <div>
                          <h4
                            onClick={() => onOpenDetail(c)}
                            className="text-[11.5px] font-bold text-slate-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer transition-colors leading-tight"
                          >
                            {c.name}
                          </h4>
                          <span className="inline-block mt-0.5 text-[10px] font-mono font-bold px-1.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                            CTV {c.ctvCode || 'N/A'}
                          </span>
                        </div>

                        {c.desiredSalary && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20 px-1.5 py-0.5 rounded-lg flex-shrink-0">
                            {c.desiredSalary}
                          </span>
                        )}
                      </div>

                      {/* Position */}
                      <p className="text-[10.5px] text-slate-600 dark:text-slate-400 line-clamp-1 leading-relaxed pl-2">
                        <Briefcase className="w-2.5 h-2.5 inline mr-1 text-slate-400 flex-shrink-0" />
                        {c.positionCompany || 'Chưa rõ vị trí'}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 dark:border-white/5">
                        <span className="flex items-center gap-1 font-mono text-slate-400">
                          <Clock className="w-2.5 h-2.5" />
                          {c.timestamp?.split(' ')[0] || 'N/A'}
                        </span>
                        {c.interviewDate && (
                          <span className="font-bold" style={{ color: '#06b6d4' }}>
                            PV: {c.interviewDate}
                          </span>
                        )}
                        {c.onboardingDate && (
                          <span className="font-extrabold" style={{ color: '#a855f7' }}>
                            OB: {c.onboardingDate}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-0.5 pt-0.5">
                        <button
                          onClick={() => onOpenDetail(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 cursor-pointer transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEmail(c)}
                          className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer transition-all"
                          title="Tạo Thư mời / Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        {c.cvUrl && (
                          <a
                            href={c.cvUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all"
                            title="Mở CV gốc"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
