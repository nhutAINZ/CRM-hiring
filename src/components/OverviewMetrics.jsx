import React, { useEffect, useRef } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

/* ── Animated counter hook ── */
function useCountUp(target, duration = 800) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const start = 0;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = Math.round(start + eased * (target - start));
      if (ref.current) ref.current.textContent = current;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return ref;
}

/* ── Animated progress bar ── */
function ProgressBar({ value, color = '#10b981', delay = 0 }) {
  const barRef = useRef(null);
  useEffect(() => {
    if (!barRef.current) return;
    const timer = setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.width = `${Math.min(value, 100)}%`;
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="w-full bg-slate-200/60 dark:bg-white/8 h-1 rounded-full overflow-hidden mt-2">
      <div
        ref={barRef}
        className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
        style={{ width: '0%', backgroundColor: color, boxShadow: `0 0 6px ${color}55` }}
      />
    </div>
  );
}

/* ── KPI Card with ambient glow ── */
function KpiCard({ label, value, subValue, subLabel, icon: Icon, color, glowColor, badgeClass, barValue, barColor, children, onClick, urgency }) {
  const countRef = useCountUp(typeof value === 'number' ? value : 0, 900);
  const isNum = typeof value === 'number';

  return (
    <div
      onClick={onClick}
      className={`mengto-card ${badgeClass} p-5 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Ambient radial orb behind icon */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 dark:opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-30 dark:group-hover:opacity-35 pointer-events-none"
        style={{ background: glowColor }}
      />

      <div className="relative flex items-start justify-between gap-3">
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              ref={isNum ? countRef : null}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {isNum ? 0 : value}
            </span>
            {subValue !== undefined && (
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{subValue}</span>
            )}
          </div>
        </div>

        {/* Icon badge */}
        <div
          className={`relative flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${urgency ? 'animate-pulse-ring' : ''}`}
          style={{ background: `${glowColor}22`, border: `1px solid ${glowColor}44` }}
        >
          <Icon className="w-5 h-5" style={{ color: glowColor }} />
          {/* Inner glow */}
          <div
            className="absolute inset-0 rounded-2xl blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            style={{ background: glowColor }}
          />
        </div>
      </div>

      {/* Progress micro-bar */}
      {barValue !== undefined && (
        <ProgressBar value={barValue} color={barColor || glowColor} delay={200} />
      )}

      {/* Bottom row */}
      <div className="relative mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5">
        {children}
        {onClick && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-700 dark:text-amber-300 font-semibold">{subLabel}</span>
            <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
              Xem ngay <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        )}
        {!onClick && subLabel && (
          <span className="text-xs text-slate-500 dark:text-slate-400">{subLabel}</span>
        )}
      </div>
    </div>
  );
}

export default function OverviewMetrics({ metrics, onSelectUrgent }) {
  const {
    total,
    cvPass,
    cvFail,
    cvPending,
    cvPassRate,
    pvPass,
    pvFail,
    pvPending,
    pvPassRate,
    onboardedCount,
    overallHireRate,
    funnelSteps,
    urgentCandidates
  } = metrics;

  return (
    <div className="space-y-4">
      {/* ── 5 KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">

        {/* 1. Total */}
        <KpiCard
          label="Tổng Ứng Viên Nộp"
          value={total}
          icon={Users}
          badgeClass="mengto-card-blue"
          glowColor="#3b82f6"
          barValue={100}
          barColor="#3b82f6"
          subLabel="Toàn bộ nguồn"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Toàn bộ nguồn</span>
            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
              <TrendingUp className="w-3 h-3" /> 100% Hồ sơ
            </span>
          </div>
        </KpiCard>

        {/* 2. CV Pass Rate */}
        <KpiCard
          label="Tỉ Lệ Pass CV"
          value={cvPassRate}
          subValue={`% (${cvPass}/${total})`}
          icon={CheckCircle2}
          badgeClass="mengto-card-emerald"
          glowColor="#10b981"
          barValue={cvPassRate}
          barColor="#10b981"
        >
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{cvPass} Đạt</span>
            <span className="text-rose-500 font-semibold">{cvFail} Loại</span>
            <span className="text-amber-500 font-semibold">{cvPending} Chờ</span>
          </div>
        </KpiCard>

        {/* 3. PV Pass Rate */}
        <KpiCard
          label="Tỉ Lệ Pass Phỏng Vấn"
          value={pvPassRate}
          subValue={`% (${pvPass} Đạt)`}
          icon={Award}
          badgeClass="mengto-card-cyan"
          glowColor="#06b6d4"
          barValue={pvPassRate}
          barColor="#06b6d4"
        >
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">{pvPass} Pass</span>
            <span className="text-rose-500 font-semibold">{pvFail} Fail/Hủy</span>
            <span className="text-amber-500 font-semibold">{pvPending} Chờ PV</span>
          </div>
        </KpiCard>

        {/* 4. Onboarding */}
        <KpiCard
          label="Onboarding (Đi làm)"
          value={onboardedCount}
          subValue={`(${overallHireRate}%)`}
          icon={Sparkles}
          badgeClass="mengto-card-purple"
          glowColor="#a855f7"
          barValue={overallHireRate}
          barColor="#a855f7"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Đã chốt ngày đi làm</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">Thành công</span>
          </div>
        </KpiCard>

        {/* 5. Urgent — interactive + pulse ring */}
        <KpiCard
          label="Cần Xử Lý Gấp"
          value={urgentCandidates.length}
          icon={AlertTriangle}
          badgeClass="mengto-card-amber"
          glowColor="#f59e0b"
          urgency={urgentCandidates.length > 0}
          onClick={onSelectUrgent}
          subLabel="Chờ duyệt / phản hồi"
          barValue={urgentCandidates.length > 0 ? 100 : 0}
          barColor="#f59e0b"
        />
      </div>

      {/* ── Recruitment Funnel ── */}
      <div className="mengto-card p-4 hidden md:block overflow-hidden">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            Phễu Chuyển Đổi Tuyển Dụng
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Tỉ lệ hoàn tất:{' '}
            <strong className="text-purple-600 dark:text-purple-400 font-bold font-mono">{overallHireRate}%</strong>
          </span>
        </div>

        {/* Horizontal flow funnel */}
        <div className="flex items-stretch gap-0">
          {funnelSteps.map((step, idx) => {
            const isLast = idx === funnelSteps.length - 1;
            return (
              <React.Fragment key={step.name}>
                <div className="flex-1 relative p-3 rounded-xl bg-slate-50/80 dark:bg-white/4 border border-slate-200/60 dark:border-white/5 min-w-0">
                  {/* Colored top accent bar */}
                  <div
                    className="absolute top-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: step.color, boxShadow: `0 1px 6px ${step.color}55` }}
                  />
                  <div className="flex items-center justify-between text-[11px] mb-2 mt-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{step.name}</span>
                    <span
                      className="font-extrabold font-mono ml-1 flex-shrink-0"
                      style={{ color: step.color }}
                    >
                      {step.count}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/60 dark:bg-white/8 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${step.pct}%`, background: step.color, boxShadow: `0 0 4px ${step.color}66` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono block">{step.pct}% tổng</span>
                </div>

                {/* Connector arrow between steps */}
                {!isLast && (
                  <div className="flex items-center px-1 flex-shrink-0">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
