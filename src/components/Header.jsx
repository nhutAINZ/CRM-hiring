import React from 'react';
import {
  RefreshCw,
  Settings,
  FileText,
  Moon,
  Sun,
  Database,
  LayoutDashboard,
  Users,
  Kanban,
  BarChart3,
  AlertTriangle,
  Download,
  Sparkles,
  Menu
} from 'lucide-react';

export default function Header({
  lastUpdated,
  isRefreshing,
  onRefresh,
  onOpenSettings,
  onOpenTemplates,
  onExportCsv,
  darkMode,
  setDarkMode,
  candidateCount,
  activeView,
  setActiveView,
  urgentCount,
  onOpenMobileMenu
}) {
  const formatTime = (date) => {
    if (!date) return 'Chưa cập nhật';
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };


  const navTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard Tổng Quan',
      icon: LayoutDashboard,
      color: 'emerald'
    },
    {
      id: 'table',
      label: 'Quản Lý Ứng Viên',
      icon: Users,
      color: 'blue',
      badge: candidateCount ? `${candidateCount}` : null
    },
    {
      id: 'kanban',
      label: 'Kanban Pipeline',
      icon: Kanban,
      color: 'cyan'
    },
    {
      id: 'analytics',
      label: 'Báo Cáo & Phân Tích',
      icon: BarChart3,
      color: 'purple'
    },
    {
      id: 'urgent',
      label: 'Cần Xử Lý Gấp',
      icon: AlertTriangle,
      color: 'amber',
      badge: urgentCount > 0 ? urgentCount : null
    }
  ];

  const tabColorMap = {
    emerald: 'text-blue-600 dark:text-blue-400',
    blue:    'text-blue-600 dark:text-blue-400',
    cyan:    'text-cyan-600 dark:text-cyan-400',
    purple:  'text-purple-600 dark:text-purple-400',
    amber:   'text-amber-600 dark:text-amber-400',
  };

  return (
    <header className="sticky top-0 z-40 transition-all bg-white/95 dark:bg-[#060b18]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Top Navbar Row ── */}
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">

          {/* ── Left: Mobile Hamburger & Logo Branding ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={onOpenMobileMenu}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 md:hidden cursor-pointer"
              title="Mở menu điều hướng"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative flex-shrink-0">
              <div
                className="absolute -inset-[2px] rounded-[14px] opacity-75"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6, #6366f1, #2563eb)',
                  backgroundSize: '300% 300%',
                  animation: 'rotateGrad 4s linear infinite',
                  borderRadius: '14px'
                }}
              />
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[12px] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 z-10">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                  FastHunt
                </h1>
                <span className="hidden sm:inline-flex relative items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                  </span>
                  Live Sync
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate max-w-[280px] lg:max-w-none">
                Quản trị Tuyển dụng & Pipeline Real-time
              </p>
            </div>
          </div>


          {/* ── Action Controls ── */}
          <div className="flex items-center flex-wrap gap-2">

            {/* Sync Info Chip */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-[12px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10">
              <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>Đồng bộ: {formatTime(lastUpdated)}</span>
              {candidateCount !== undefined && (
                <>
                  <span className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-0.5" />
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{candidateCount}</span>
                  <span className="text-slate-500">UV</span>
                </>
              )}
            </div>

            {/* Button Group */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                id="btn-refresh-header"
                className="btn-shiny flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-r border-blue-400/30 transition-all disabled:opacity-60 cursor-pointer"
                title="Làm mới dữ liệu từ Google Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 flex-shrink-0 ${isRefreshing ? 'animate-spin-slow' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Đang tải...' : 'Đồng bộ Sheet'}</span>
              </button>

              {/* Export CSV */}
              <button
                onClick={onExportCsv}
                id="btn-export-csv"
                className="btn-shiny hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border-r border-slate-200 dark:border-white/8 transition-all cursor-pointer"
                title="Xuất file Excel / CSV"
              >
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="hidden md:inline">Xuất CSV</span>
              </button>

              {/* Email Templates */}
              <button
                onClick={onOpenTemplates}
                id="btn-templates"
                className="btn-shiny flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border-r border-slate-200 dark:border-white/8 transition-all cursor-pointer"
                title="Quản lý Mẫu Thư & Email"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span className="hidden md:inline">Mẫu Email</span>
              </button>

              {/* Settings */}
              <button
                onClick={onOpenSettings}
                id="btn-settings"
                className="btn-shiny p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border-r border-slate-200 dark:border-white/8 transition-all cursor-pointer"
                title="Cài đặt kết nối Google Sheet"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                id="btn-toggle-darkmode"
                className="btn-shiny p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                title={darkMode ? 'Chuyển giao diện Sáng' : 'Chuyển giao diện Tối'}
              >
                {darkMode
                  ? <Sun className="w-4 h-4 text-amber-500" />
                  : <Moon className="w-4 h-4 text-indigo-600" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── CRM View Navigation Tabs ── */}
        <div className="flex items-end gap-1 border-t border-slate-200/80 dark:border-white/5 overflow-x-auto">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveView(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer group outline-none ${
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive
                      ? tabColorMap[tab.color]
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                />
                <span>{tab.label}</span>

                {/* Badge if present */}
                {tab.badge && (
                  <span
                    className={`ml-0.5 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold leading-none ${
                      tab.id === 'urgent'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {/* Linear-style bottom border active indicator */}
                {isActive && (
                  <span
                    className="nav-tab-indicator"
                    style={{
                      height: '3px',
                      background: 'linear-gradient(90deg, #2563eb, #3b82f6)'
                    }}
                  />
                )}

                {/* Hover backdrop */}
                <span className={`absolute inset-0 rounded-t-xl transition-all ${isActive ? 'bg-slate-100/70 dark:bg-white/5' : 'group-hover:bg-slate-50 dark:group-hover:bg-white/3'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
