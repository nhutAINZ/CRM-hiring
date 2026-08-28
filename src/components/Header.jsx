// ====================================================================
// FASTHUNT / RECRUITCRM PRO - RESPONSIVE HEADER
// Compact Mobile-First Header + Desktop Tab Navigation Bar
// ====================================================================

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
  Menu,
  Bell
} from 'lucide-react';

export default function Header({
  lastUpdated,
  isRefreshing,
  onRefresh,
  onOpenSettings,
  onOpenTemplates,
  onExportCsv,
  onOpenUpdates,
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
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const viewTitles = {
    dashboard: 'Trang Chủ',
    table: 'Danh Sách Ứng Viên',
    kanban: 'Kanban Pipeline',
    analytics: 'Báo Cáo & Phân Tích',
    urgent: 'Hồ Sơ Gấp',
    jobs: 'Bảng Tin & Link Jobs',
    clients: 'Khách Hàng & CRM',
    ctv: 'Quản Lý Mã CTV',
    zalo: 'Trợ Lý Zalo Cá Nhân'
  };

  const currentTitle = viewTitles[activeView] || 'FastHunt CRM';

  const navTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard Tổng Quan',
      icon: LayoutDashboard
    },
    {
      id: 'table',
      label: 'Quản Lý Ứng Viên',
      icon: Users,
      badge: candidateCount ? `${candidateCount}` : null
    },
    {
      id: 'kanban',
      label: 'Kanban Pipeline',
      icon: Kanban
    },
    {
      id: 'analytics',
      label: 'Báo Cáo & Phân Tích',
      icon: BarChart3
    },
    {
      id: 'urgent',
      label: 'Cần Xử Lý Gấp',
      icon: AlertTriangle,
      badge: urgentCount > 0 ? urgentCount : null
    }
  ];

  return (
    <header className="sticky top-0 z-40 transition-all bg-white/95 dark:bg-[#060b18]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* ── Top Navbar Row ── */}
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2">

          {/* ── Left: Small Logo & Current Page Title ── */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/25">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Current Page Title on Mobile / Full Brand on Desktop */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-lg tracking-tight text-slate-900 dark:text-white truncate">
                  {currentTitle}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                  Live Sync
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Recruitment & Candidate Pipeline
              </p>
            </div>
          </div>

          {/* ── Right: Compact Action Icons (Icon-only on mobile) ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Sync Sheet Button (Icon-only on mobile) */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs transition-all cursor-pointer min-h-[44px] min-w-[44px] justify-center"
              title="Đồng bộ dữ liệu từ Google Sheet"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isRefreshing ? 'Đang tải...' : 'Đồng bộ'}</span>
            </button>

            {/* Notification / Updates Button */}
            {onOpenUpdates && (
              <button
                onClick={onOpenUpdates}
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Cập nhật mới"
              >
                <Bell className="w-4 h-4" />
                {urgentCount > 0 && (
                  <span className="absolute 1 top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={darkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>
        </div>

        {/* ── Desktop Tab Navigation (Hidden on Mobile, Visible on md+) ── */}
        <div className="hidden md:flex items-end gap-1 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
