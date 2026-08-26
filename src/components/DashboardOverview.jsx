import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileText,
  Briefcase,
  Layers,
  ChevronRight,
  Mail,
  Eye,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import OverviewMetrics from './OverviewMetrics';
import AnalyticsCharts from './AnalyticsCharts';
import UrgentAlertSection from './UrgentAlertSection';

export default function DashboardOverview({
  candidates,
  metrics,
  sheet2Items,
  sheet2ViewUrl,
  jobItems = [],
  onNavigateTab,
  onOpenDetail,
  onOpenEmail,
  darkMode
}) {
  // Recent 5 candidates
  const recentCandidates = candidates.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Top Executive Welcome Banner ── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trung Tâm Quản Trị & Báo Cáo Tuyển Dụng
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            Tổng quan hiệu suất chuyển đổi toàn bộ pipeline, tình trạng hồ sơ ứng viên và cảnh báo ưu tiên xử lý trong ngày.
          </p>
        </div>

        {/* Quick Navigate Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('jobs')}
            className="btn-shiny flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/30 cursor-pointer transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bảng Tin Jobs ({jobItems.length})</span>
          </button>

          <button
            onClick={() => onNavigateTab('table')}
            className="btn-shiny flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-xs cursor-pointer transition-all"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Xem Danh Sách ({candidates.length})</span>
            <ArrowRight className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          <button
            onClick={() => onNavigateTab('kanban')}
            className="btn-shiny flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/30 cursor-pointer transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mở Pipeline Kanban</span>
          </button>
        </div>
      </div>

      {/* ── 5 Core KPI Metrics & Funnel ── */}
      <OverviewMetrics
        metrics={metrics}
        onSelectUrgent={() => onNavigateTab('urgent')}
      />

      {/* ── Highlighted Jobs Banner ── */}
      {jobItems.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-blue-500/5 to-purple-500/10 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/30 flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Bảng Tin Google Sheet Jobs: {jobItems.length} Vị Trí Tuyển Dụng Đang Mở</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  Bonus Lên Đến 5.250.000 ₫
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Xem ngay danh sách vị trí tuyển gấp, hoa hồng CTV và link JD chi tiết.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('jobs')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <span>Khám Phá Danh Sách Jobs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Urgent Alert Preview Banner (if any) ── */}
      {metrics.urgentCandidates.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-slide-down">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 flex-shrink-0">
              <AlertTriangle className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-amber-900 dark:text-amber-200">
                Có {metrics.urgentCandidates.length} hồ sơ đang ở trạng thái "Chờ phản hồi" cần xử lý gấp
              </h4>
              <p className="text-[11.5px] text-amber-700 dark:text-amber-400 mt-0.5">
                Vui lòng liên hệ CTV hoặc Doanh nghiệp để cập nhật kết quả phỏng vấn/duyệt CV kịp thời.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('urgent')}
            className="btn-shiny flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer whitespace-nowrap flex-shrink-0 transition-all"
          >
            <span>Xử lý ngay ({metrics.urgentCandidates.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Main Analytical Dashboard Row: Charts & Activity ── */}
      <div className="space-y-6">
        <AnalyticsCharts
          candidates={candidates}
          metrics={metrics}
          darkMode={darkMode}
        />
      </div>

      {/* ── Recent 5 Applications Summary Widget ── */}
      <div className="mengto-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Hồ Sơ Tiếp Nhận Gần Đây
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                5 ứng viên nộp hồ sơ mới nhất trong hệ thống
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('table')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Xem toàn bộ {candidates.length} hồ sơ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Table of Recent Candidates */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-white/2">
                <th className="py-2.5 px-3">Ngày Nộp</th>
                <th className="py-2.5 px-3">Họ & Tên</th>
                <th className="py-2.5 px-3">Mã CTV</th>
                <th className="py-2.5 px-3">Vị Trí Tuyển Dụng</th>
                <th className="py-2.5 px-3">Trạng Thái CV</th>
                <th className="py-2.5 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-200">
              {recentCandidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-white/4 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400 text-xs">
                    {c.timestamp || 'N/A'}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      onClick={() => onOpenDetail(c)}
                      className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 cursor-pointer underline-offset-2 hover:underline"
                    >
                      {c.name}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                      CTV {c.ctvCode || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[220px]">
                    {c.positionCompany || 'Chưa rõ'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`status-badge ${
                      c.cvResultRaw?.includes('PASS') || c.cvResultRaw?.includes('ĐẠT')
                        ? 'status-badge-emerald'
                        : c.cvResultRaw?.includes('FAIL') || c.cvResultRaw?.includes('LOẠI')
                        ? 'status-badge-rose'
                        : 'status-badge-amber'
                    }`}>
                      {c.cvResultRaw || 'Chờ phản hồi'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenDetail(c)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenEmail(c)}
                        className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
                        title="Tạo email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      {c.cvUrl && (
                        <a
                          href={c.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                          title="Mở CV"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
