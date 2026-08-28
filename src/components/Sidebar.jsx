// ====================================================================
// FASTHUNT RECRUITMENT AGENT - RESPONSIVE SIDEBAR & MOBILE DRAWER
// Desktop Sticky + Mobile Slide-Over Drawer with Backdrop
// ====================================================================

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
  mobileOpen = false,
  setMobileOpen = () => {},
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

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* ── Mobile Backdrop Overlay (Visible only on mobile when drawer is open) ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden transition-opacity animate-fade-in"
        />
      )}

      {/* ── Main Sidebar / Mobile Drawer Container ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-[#090d16] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col ${
          /* Mobile Drawer Translation */
          mobileOpen ? 'translate-x-0 shadow-2xl w-72' : '-translate-x-full md:translate-x-0'
        } ${
          /* Desktop Width */
          collapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        {/* ── 1. Top Logo Header ── */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => handleNavClick('table')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* FastHunt Logo Badge */}
            <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <span className="font-serif italic tracking-tighter">F</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-[#090d16] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              </div>
            </div>

            {(!collapsed || mobileOpen) && (
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

          {/* Mobile Close Button (Visible on mobile) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Quick Header Badges */}
            {(!collapsed && !mobileOpen) && (
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={onOpenUpdates}
                  className="relative p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                  title="Cập nhật mới"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 px-1 rounded-full text-[9px] font-bold bg-blue-600 text-white min-w-[16px] text-center shadow-xs">
                    99+
                  </span>
                </button>
                <button
                  onClick={onOpenTemplates}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                  title="Mẫu Thư Tuyển Dụng"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── 2. User Profile Card ── */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-xs">
                HN
              </div>
              {(!collapsed || mobileOpen) && (
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
            {(!collapsed || mobileOpen) && (
              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 cursor-pointer" />
            )}
          </div>
        </div>

        {/* ── 3. Navigation Links List ── */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {/* Vị trí ứng tuyển (Main Active View) */}
          <button
            onClick={() => handleNavClick('table')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeView === 'table'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 shadow-2xs font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              {(!collapsed || mobileOpen) && <span>Vị trí ứng tuyển</span>}
            </div>
            {(!collapsed || mobileOpen) && candidateCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
                {candidateCount}
              </span>
            )}
          </button>

          {/* Bảng Tin & Link Jobs */}
          <button
            onClick={() => handleNavClick('jobs')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeView === 'jobs'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/50 shadow-2xs font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              {(!collapsed || mobileOpen) && <span>Bảng Tin & Link Jobs</span>}
            </div>
            {(!collapsed || mobileOpen) && (
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
                if (collapsed && !mobileOpen) setCollapsed(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-500" />
                {(!collapsed || mobileOpen) && <span>Ứng viên</span>}
              </div>
              {(!collapsed || mobileOpen) && (
                expandedMenus.ungVien ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )
              )}
            </button>

            {(!collapsed || mobileOpen) && expandedMenus.ungVien && (
              <div className="ml-7 my-1 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1">
                <button
                  onClick={() => handleNavClick('table')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    activeView === 'table'
                      ? 'text-blue-600 font-bold dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Tất cả hồ sơ
                </button>
                <button
                  onClick={() => handleNavClick('kanban')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    activeView === 'kanban'
                      ? 'text-blue-600 font-bold dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Kanban Pipeline
                </button>
                <button
                  onClick={() => handleNavClick('urgent')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    activeView === 'urgent'
                      ? 'text-blue-600 font-bold dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>Hồ sơ gấp</span>
                  {urgentCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-bold">
                      {urgentCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Khách hàng & Jobs */}
          <button
            onClick={() => handleNavClick('clients')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeView === 'clients'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold border border-blue-200/80 dark:border-blue-800/50'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-slate-500" />
              {(!collapsed || mobileOpen) && <span>Khách hàng & Jobs</span>}
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white">
                Intergreat
              </span>
            )}
          </button>

          {/* Trợ lý Zalo Cá Nhân (Nick Thường) */}
          <button
            onClick={() => handleNavClick('zalo')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeView === 'zalo'
                ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 font-bold border border-sky-200/80 dark:border-sky-800/50'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-sky-500" />
              {(!collapsed || mobileOpen) && <span>Trợ lý Zalo Cá Nhân</span>}
            </div>
            {(!collapsed || mobileOpen) && (
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
                if (collapsed && !mobileOpen) setCollapsed(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-slate-500" />
                {(!collapsed || mobileOpen) && <span>Tiện ích</span>}
              </div>
              {(!collapsed || mobileOpen) && (
                expandedMenus.tienIch ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )
              )}
            </button>

            {(!collapsed || mobileOpen) && expandedMenus.tienIch && (
              <div className="ml-7 my-1 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1">
                {/* Cấu hình Google Sheet */}
                <button
                  onClick={() => {
                    onOpenSettings();
                    if (setMobileOpen) setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Cấu hình Google Sheet</span>
                </button>

                {/* Mẫu Email & Thư */}
                <button
                  onClick={() => {
                    onOpenTemplates();
                    if (setMobileOpen) setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Mẫu Email & Thư</span>
                </button>

                {/* Xuất Excel / CSV */}
                <button
                  onClick={() => {
                    onExportCsv();
                    if (setMobileOpen) setMobileOpen(false);
                  }}
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
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {(!collapsed || mobileOpen) && <span>Dashboard Tổng quan</span>}
          </button>

          {/* Báo cáo & Phân tích */}
          <button
            onClick={() => handleNavClick('analytics')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'analytics'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            {(!collapsed || mobileOpen) && <span>Báo cáo & Phân tích</span>}
          </button>

          {/* Cập nhật các thay đổi mới */}
          <button
            onClick={() => {
              onOpenUpdates();
              if (setMobileOpen) setMobileOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-blue-600 animate-pulse" />
            {(!collapsed || mobileOpen) && <span>Cập nhật các thay đổi mới</span>}
          </button>

          {/* Quản lý bonus & Mã CTV */}
          <button
            onClick={() => handleNavClick('ctv')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'ctv'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold border border-blue-200/80 dark:border-blue-800/50'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Gift className="w-4 h-4 text-blue-600" />
            {(!collapsed || mobileOpen) && <span>Quản lý bonus & Mã CTV</span>}
          </button>
        </div>

        {/* ── 4. Sidebar Footer ── */}
        {(!collapsed || mobileOpen) && (
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
                <span>⭐ Bảng Link Job (Sheet)</span>
              </a>
              <a
                href="https://docs.google.com/spreadsheets/d/11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk/edit?gid=497830992#gid=497830992"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-1 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                <span>🔗 Bảng Mã CTV (Sheet)</span>
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
