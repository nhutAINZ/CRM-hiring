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
  Download,
  Layers,
  Zap,
  Share2,
  Lock,
  Unlock,
  ShieldCheck,
  LogOut,
  Bot
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
  onOpenUpdates,
  isAdmin = false,
  onOpenAdminAuth = () => {},
  onAdminLogout = () => {}
}) {
  const [expandedMenus, setExpandedMenus] = useState({
    ungVien: true,
    khachHang: false,
    tienIch: true,
    ctvTools: true
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
      {/* ── Mobile Backdrop Overlay ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden transition-opacity animate-fade-in"
        />
      )}

      {/* ── Main Sidebar / Mobile Drawer Container ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-[#090d16] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col ${
          mobileOpen ? 'translate-x-0 shadow-2xl w-72' : '-translate-x-full md:translate-x-0'
        } ${
          collapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        {/* ── 1. Top Logo Header ── */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => handleNavClick(isAdmin ? 'dashboard' : 'ctv-dashboard')}
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
                    {isAdmin ? 'Admin' : 'CTV'}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">
                  {isAdmin ? 'Recruitment CRM' : 'Partner Portal'}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 2. User Status Card ── */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-xs ${
                isAdmin
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-700'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
                {isAdmin ? 'AD' : 'CTV'}
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {isAdmin ? 'Quản Trị Viên' : 'Cộng Tác Viên'}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <span>{isAdmin ? 'Toàn quyền hệ thống' : 'Xem job & giới thiệu CV'}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. Navigation Links List ── */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
          {/* ===================== CTV TOOLS SECTION (AVAILABLE TO EVERYONE) ===================== */}
          <div className="pb-1">
            {(!collapsed || mobileOpen) && (
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Dành Cho CTV
              </div>
            )}

            {/* CTV Dashboard */}
            <button
              onClick={() => handleNavClick('ctv-dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeView === 'ctv-dashboard'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 shadow-2xs font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span>Cổng Thông Tin CTV</span>}
              </div>
              {(!collapsed || mobileOpen) && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
                  HOT
                </span>
              )}
            </button>

            {/* Việc làm đang tuyển (Jobs) */}
            <button
              onClick={() => handleNavClick('jobs')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeView === 'jobs'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/50 shadow-2xs font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span>Việc Làm Đang Tuyển</span>}
              </div>
              {(!collapsed || mobileOpen) && jobCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300">
                  {jobCount} Jobs
                </span>
              )}
            </button>

            {/* Gen Content Tuyển Dụng */}
            <button
              onClick={() => handleNavClick('content-gen')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeView === 'content-gen'
                  ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border border-violet-200/80 dark:border-violet-800/50 shadow-2xs font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span>Tạo Bài Tuyển Dụng</span>}
              </div>
              {(!collapsed || mobileOpen) && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                  AI
                </span>
              )}
            </button>

            {/* Tìm Group Đăng Tin */}
            <button
              onClick={() => handleNavClick('group-finder')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeView === 'group-finder'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50 shadow-2xs font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span>Tìm Group Đăng Tin</span>}
              </div>
            </button>
          </div>

          {/* ===================== ADMIN SECTION (ONLY WHEN LOGGED IN AS ADMIN) ===================== */}
          {isAdmin ? (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
              {(!collapsed || mobileOpen) && (
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Khu Vực Quản Trị</span>
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                </div>
              )}

              {/* Dashboard Tổng Quan */}
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                  {(!collapsed || mobileOpen) && <span>Dashboard CRM</span>}
                </div>
              </button>

              {/* Multi-Agent Swarm Hub */}
              <button
                onClick={() => handleNavClick('multiagent')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeView === 'multiagent'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-md shadow-indigo-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 flex-shrink-0 text-amber-300" />
                  {(!collapsed || mobileOpen) && <span>Multi-Agent Swarm</span>}
                </div>
                {(!collapsed || mobileOpen) && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white">
                    6x AI
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
                    {(!collapsed || mobileOpen) && <span>Quản Lý Ứng Viên</span>}
                  </div>
                  {(!collapsed || mobileOpen) && (
                    <div className="flex items-center gap-1.5">
                      {candidateCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {candidateCount}
                        </span>
                      )}
                      {expandedMenus.ungVien ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  )}
                </button>

                {expandedMenus.ungVien && (!collapsed || mobileOpen) && (
                  <div className="pl-7 pr-1 py-1 space-y-1 animate-fade-in">
                    <button
                      onClick={() => handleNavClick('table')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        activeView === 'table'
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Bảng dữ liệu ứng viên
                    </button>
                    <button
                      onClick={() => handleNavClick('kanban')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        activeView === 'kanban'
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Kanban Pipeline
                    </button>
                    <button
                      onClick={() => handleNavClick('urgent')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                        activeView === 'urgent'
                          ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>Hồ sơ cần gấp</span>
                      {urgentCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                          {urgentCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Khách Hàng / Clients */}
              <button
                onClick={() => handleNavClick('clients')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeView === 'clients'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 flex-shrink-0" />
                  {(!collapsed || mobileOpen) && <span>Khách Hàng & CRM</span>}
                </div>
              </button>

              {/* Quản Lý Mã CTV */}
              <button
                onClick={() => handleNavClick('ctv')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeView === 'ctv'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Gift className="w-4 h-4 flex-shrink-0" />
                  {(!collapsed || mobileOpen) && <span>Quản Lý CTV</span>}
                </div>
              </button>

              {/* Archify UML */}
              <button
                onClick={() => handleNavClick('archify')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeView === 'archify'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 flex-shrink-0" />
                  {(!collapsed || mobileOpen) && <span>Kiến Trúc Archify</span>}
                </div>
              </button>
            </div>
          ) : (
            /* ===================== NOT LOGGED IN CALLOUT ===================== */
            (!collapsed || mobileOpen) && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-slate-800/60 dark:to-slate-900 border border-blue-200/60 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Khu Vực Quản Trị Viên</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Đăng nhập để mở khóa bảng ứng viên nội bộ, Kanban pipeline, và cài đặt CRM.
                </p>
                <button
                  onClick={onOpenAdminAuth}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Đăng Nhập Quản Trị</span>
                </button>
              </div>
            )
          )}
        </div>

        {/* ── 4. Bottom Footer Actions ── */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
          {isAdmin ? (
            <button
              onClick={onAdminLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold border border-rose-200/60 dark:border-rose-900/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              {(!collapsed || mobileOpen) && <span>Đăng Xuất Quản Trị</span>}
            </button>
          ) : (
            <button
              onClick={onOpenAdminAuth}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              {(!collapsed || mobileOpen) && <span>Đăng Nhập Quản Trị</span>}
            </button>
          )}

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full hidden md:flex items-center justify-center py-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-medium cursor-pointer"
          >
            {collapsed ? '→ Mở rộng' : '← Thu gọn'}
          </button>
        </div>
      </aside>
    </>
  );
}
