// ====================================================================
// FASTHUNT RECRUITMENT AGENT - MOBILE VERTICAL FLOATING TASKBAR
// Sleek, Tactile Vertical Dock for 1-Hand Navigation & Component Selection
// ====================================================================

import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  MessageCircle,
  Building,
  LayoutDashboard,
  Kanban,
  AlertTriangle,
  BarChart3,
  Gift,
  Bot,
  Settings,
  Grid,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  FileText
} from 'lucide-react';

export default function MobileVerticalTaskbar({
  activeView,
  setActiveView,
  candidateCount = 0,
  urgentCount = 0,
  jobCount = 0,
  onOpenComponentSelector,
  onOpenAiBot,
  onOpenSettings,
  onOpenTemplates,
  onRefreshData,
  isRefreshing = false
}) {
  // State for vertical taskbar mode
  // 'mini': small floating pill; 'expanded': full vertical bar with labels; 'collapsed': compact icon bar
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const [dockPosition, setDockPosition] = useState('right'); // 'right' | 'left'

  // Primary task items in the vertical rail
  const primaryTasks = [
    {
      id: 'table',
      label: 'Ứng viên',
      short: 'UV',
      icon: Users,
      badge: candidateCount > 0 ? (candidateCount > 99 ? '99+' : candidateCount) : null,
      badgeColor: 'bg-blue-600 text-white',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'jobs',
      label: 'Jobs Hot',
      short: 'Job',
      icon: Briefcase,
      badge: jobCount > 0 ? jobCount : 'Hot',
      badgeColor: 'bg-indigo-600 text-white',
      color: 'from-indigo-600 to-purple-600'
    },
    {
      id: 'zalo',
      label: 'Zalo Nick',
      short: 'Zalo',
      icon: MessageCircle,
      badge: 'Free',
      badgeColor: 'bg-sky-500 text-white',
      color: 'from-sky-500 to-blue-600'
    },
    {
      id: 'kanban',
      label: 'Kanban',
      short: 'KB',
      icon: Kanban,
      color: 'from-cyan-600 to-blue-600'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      short: 'Dash',
      icon: LayoutDashboard,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'urgent',
      label: 'Hồ sơ gấp',
      short: 'Gấp',
      icon: AlertTriangle,
      badge: urgentCount > 0 ? urgentCount : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
      color: 'from-rose-500 to-amber-500'
    },
    {
      id: 'clients',
      label: 'Khách hàng',
      short: 'CRM',
      icon: Building,
      color: 'from-emerald-600 to-cyan-600'
    },
    {
      id: 'analytics',
      label: 'Báo cáo',
      short: 'Chart',
      icon: BarChart3,
      color: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'ctv',
      label: 'Mã CTV',
      short: 'CTV',
      icon: Gift,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  // Current active task info for mini pill
  const activeTask = primaryTasks.find((t) => t.id === activeView) || primaryTasks[0];
  const ActiveIcon = activeTask.icon;

  return (
    <div className="md:hidden">
      {/* ── 1. Mini Floating Trigger Pill (When Dock is hidden or minimized) ── */}
      {!isDockVisible && (
        <button
          onClick={() => setIsDockVisible(true)}
          className={`fixed top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/40 border-2 border-white dark:border-slate-800 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center ${
            dockPosition === 'right' ? 'right-2' : 'left-2'
          }`}
          title="Mở thanh Taskbar Dọc"
        >
          <div className="relative">
            <ActiveIcon className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-600" />
          </div>
        </button>
      )}

      {/* ── 2. Floating Vertical Taskbar Rail ── */}
      {isDockVisible && (
        <aside
          className={`fixed top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ease-out flex items-center ${
            dockPosition === 'right' ? 'right-1.5' : 'left-1.5'
          }`}
        >
          {/* Main Vertical Dock Container */}
          <div
            className={`relative flex flex-col items-center py-2 px-1.5 bg-white/95 dark:bg-[#0a0f1d]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-700/80 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.22)] transition-all ${
              isExpanded ? 'w-36' : 'w-12'
            }`}
          >
            {/* Top Bar Header: Component Selector Hub Trigger + Collapse Button */}
            <div className="w-full flex items-center justify-between px-1 pb-1.5 mb-1 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={onOpenComponentSelector}
                className="relative p-1.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                title="Bộ chọn thành phần"
              >
                <Grid className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
              </button>

              {/* Expand / Label Toggle Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                title={isExpanded ? 'Thu gọn nhãn' : 'Mở rộng nhãn'}
              >
                {dockPosition === 'right' ? (
                  isExpanded ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />
                ) : (
                  isExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Vertical Scrollable List of Navigation Tasks */}
            <div className="flex flex-col items-center gap-1.5 max-h-[58vh] overflow-y-auto scrollbar-none py-0.5 w-full">
              {primaryTasks.map((task) => {
                const Icon = task.icon;
                const isActive = activeView === task.id;

                return (
                  <button
                    key={task.id}
                    onClick={() => setActiveView(task.id)}
                    className={`relative group w-full flex items-center gap-2 py-1.5 px-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105 font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title={task.label}
                  >
                    {/* Icon Container */}
                    <div className="relative flex items-center justify-center flex-shrink-0 mx-auto">
                      <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

                      {/* Badge in Compact mode */}
                      {task.badge && !isExpanded && (
                        <span
                          className={`absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black leading-tight shadow-xs ${
                            task.badgeColor || 'bg-blue-600 text-white'
                          }`}
                        >
                          {task.badge}
                        </span>
                      )}
                    </div>

                    {/* Text Label (Visible when expanded) */}
                    {isExpanded && (
                      <span className="text-[11px] font-bold truncate flex-1 text-left">
                        {task.label}
                      </span>
                    )}

                    {/* Badge in Expanded mode */}
                    {isExpanded && task.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[8px] font-black ${
                          task.badgeColor || 'bg-blue-600 text-white'
                        }`}
                      >
                        {task.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Quick Tools: AI Bot, Sync, & Minimize */}
            <div className="w-full flex flex-col items-center gap-1.5 pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800">
              {/* Trigger AI Bot */}
              <button
                onClick={onOpenAiBot}
                className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center w-full"
                title="Trợ lý AI FastHunt"
              >
                <Bot className="w-4 h-4" />
                {isExpanded && <span className="text-[10px] font-extrabold ml-1.5">AI Bot</span>}
              </button>

              {/* Sync Sheet Data */}
              <button
                onClick={onRefreshData}
                disabled={isRefreshing}
                className={`p-1.5 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center w-full ${
                  isRefreshing ? 'opacity-50' : ''
                }`}
                title="Đồng bộ lại Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isExpanded && <span className="text-[10px] font-semibold ml-1.5">Đồng bộ</span>}
              </button>

              {/* Position Switcher / Hide Dock */}
              <div className="flex items-center justify-center gap-1 w-full pt-0.5">
                <button
                  onClick={() => setDockPosition(dockPosition === 'right' ? 'left' : 'right')}
                  className="text-[9px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-1 py-0.5 rounded cursor-pointer"
                  title="Đổi vị trí Trái / Phải"
                >
                  {dockPosition === 'right' ? 'Trái ⬅️' : 'Phải ➡️'}
                </button>
                <button
                  onClick={() => setIsDockVisible(false)}
                  className="text-[9px] font-bold text-rose-500 hover:text-rose-700 px-1 py-0.5 rounded cursor-pointer"
                  title="Ẩn thanh taskbar"
                >
                  Ẩn
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
