import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Building,
  Wrench,
  Bell,
  Gift,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Kanban,
  AlertTriangle,
  BarChart3,
  MessageCircle,
  ShieldCheck,
  FileText,
  Menu,
  X,
  Sparkles,
  Settings,
  Download
} from 'lucide-react';

export default function Sidebar({
  activeView,
  setActiveView,
  candidateCount,
  urgentCount,
  jobCount = 0,
  zaloPendingCount = 0,
  jobSheetUrl = 'https://docs.google.com/spreadsheets/d/1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko/edit?gid=0#gid=0',
  collapsed,
  setCollapsed,
  onOpenSettings,
  onOpenTemplates,
  onExportCsv,
  onOpenUpdates
}) {
  const [expandedMenus, setExpandedMenus] = useState({
    ungVien: true,
    khachHang: false,
    tienIch: true
  });

  const toggleMenu = (key) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-[#090d16] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* ── 1. Top Logo Header ── */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div
          onClick={() => setActiveView('table')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Stylized Blue FastHunt Logo Badge */}
          <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <span className="font-serif italic tracking-tighter">F</span>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-[#090d16] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            </div>
          </div>

          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Fast<span className="text-blue-600 dark:text-blue-500">Hunt</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                  Reco
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">
                Recruitment Suite
              </span>
            </div>
          )}
        </div>

        {/* Top Right Header Action Badges */}
        {!collapsed && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSettings}
              className="relative p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              title="Cập nhật các thay đổi mới"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 px-1 rounded-full text-[9px] font-bold bg-blue-600 text-white min-w-[16px] text-center shadow-xs">
                99+
              </span>
            </button>
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              title="Tài liệu & Tiện ích"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── 2. User Profile Card ── */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-xs">
              HN
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Huỳnh Minh Nhựt
                </p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  CTV Recruitment
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 cursor-pointer" />
          )}
        </div>
      </div>

      {/* ── 3. Navigation Links List ── */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {/* Vị trí ứng tuyển (Main Active View from Screenshot) */}
        <button
          onClick={() => setActiveView('table')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeView === 'table'
              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 shadow-2xs font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
          title="Vị trí ứng tuyển"
        >
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Vị trí ứng tuyển</span>}
          </div>
          {!collapsed && candidateCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {candidateCount}
            </span>
          )}
        </button>

        {/* Bảng Tin & Link Jobs (Google Sheet Live Sync) */}
        <button
          onClick={() => setActiveView('jobs')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeView === 'jobs'
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/50 shadow-2xs font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
          title="Bảng Tin & Link Jobs Tuyển Dụng"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            {!collapsed && <span>Bảng Tin & Link Jobs</span>}
          </div>
          {!collapsed && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300">
              {jobCount > 0 ? `${jobCount} Jobs` : 'Hot'}
            </span>
          )}
        </button>

        {/* Ứng viên (Expandable) */}
        <div>
          <button
            onClick={() => {
              toggleMenu('ungVien');
              if (collapsed) setCollapsed(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-slate-500" />
              {!collapsed && <span>Ứng viên</span>}
            </div>
            {!collapsed && (
              expandedMenus.ungVien ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )
            )}
          </button>

          {!collapsed && expandedMenus.ungVien && (
            <div className="ml-7 my-1 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1">
              <button
                onClick={() => setActiveView('table')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  activeView === 'table'
                    ? 'text-blue-600 font-bold dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tất cả hồ sơ
              </button>
              <button
                onClick={() => setActiveView('kanban')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  activeView === 'kanban'
                    ? 'text-blue-600 font-bold dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Kanban Pipeline
              </button>
              <button
                onClick={() => setActiveView('urgent')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  activeView === 'urgent'
                    ? 'text-blue-600 font-bold dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Hồ sơ gấp</span>
                {urgentCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-blue-600 text-white font-bold">
                    {urgentCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Khách hàng */}
        <button
          onClick={() => setActiveView('clients')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
            activeView === 'clients'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold border border-blue-200/80 dark:border-blue-800/50'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Building className="w-4 h-4 text-slate-500" />
            {!collapsed && <span>Khách hàng & Jobs</span>}
          </div>
          {!collapsed && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white">
              Connect
            </span>
          )}
        </button>

        {/* Trợ lý Zalo Cá Nhân (Nick Thường) */}
        <button
          onClick={() => setActiveView('zalo')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
            activeView === 'zalo'
              ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 font-bold border border-sky-200/80 dark:border-sky-800/50'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-4 h-4 text-sky-500" />
            {!collapsed && <span>Trợ lý Zalo Cá Nhân</span>}
          </div>
          {!collapsed && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-300">
              Nick Thường
            </span>
          )}
        </button>


        {/* Tiện ích (Expandable) */}
        <div>
          <button
            onClick={() => {
              toggleMenu('tienIch');
              if (collapsed) setCollapsed(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Wrench className="w-4 h-4 text-slate-500" />
              {!collapsed && <span>Tiện ích</span>}
            </div>
            {!collapsed && (
              expandedMenus.tienIch ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )
            )}
          </button>

          {!collapsed && expandedMenus.tienIch && (
            <div className="ml-7 my-1 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1">
              {/* Cấu hình Google Sheet */}
              <button
                onClick={onOpenSettings}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-left cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Cấu hình Google Sheet</span>
              </button>

              {/* Mẫu Email & Thư */}
              <button
                onClick={onOpenTemplates}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>Mẫu Email & Thư</span>
              </button>

              {/* Xuất Excel / CSV */}
              <button
                onClick={onExportCsv}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Xuất file Excel / CSV</span>
              </button>
            </div>
          )}
        </div>

        <div className="my-2 border-t border-slate-100 dark:border-slate-800/80" />

        {/* Dashboard Overview */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeView === 'dashboard'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          {!collapsed && <span>Dashboard Tổng quan</span>}
        </button>

        {/* Báo cáo & Phân tích */}
        <button
          onClick={() => setActiveView('analytics')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeView === 'analytics'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          {!collapsed && <span>Báo cáo & Phân tích</span>}
        </button>

        {/* Cập nhật các thay đổi mới (Opens UpdatesModal) */}
        <button
          onClick={onOpenUpdates}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4 text-blue-600 animate-pulse" />
          {!collapsed && <span>Cập nhật các thay đổi mới</span>}
        </button>

        {/* Quản lý bonus & Mã CTV */}
        <button
          onClick={() => setActiveView('ctv')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeView === 'ctv'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold border border-blue-200/80 dark:border-blue-800/50'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Gift className="w-4 h-4 text-blue-600" />
          {!collapsed && <span>Quản lý bonus & Mã CTV</span>}
        </button>
      </div>

      {/* ── 4. Sidebar Footer ── */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 space-y-2">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-1.5">
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
              FastHunt hỗ trợ CTV & Link Job
            </p>
            <a
              href={jobSheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <span>⭐ Bảng Link Job (Sheet Gốc)</span>
            </a>
            <a
              href="https://docs.google.com/spreadsheets/d/11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk/edit?gid=497830992#gid=497830992"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <span>🔗 Bảng Mã CTV (Sheet)</span>
            </a>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-1 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[11px] font-bold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Hỗ trợ Zalo</span>
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400">
            <a href="#terms" className="hover:underline">
              Điều khoản
            </a>
            <span>|</span>
            <a href="#privacy" className="hover:underline">
              Chính sách
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}
