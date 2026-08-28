// ====================================================================
// FASTHUNT / RECRUITCRM PRO - MOBILE BOTTOM TAB BAR
// Fixed 5-Item iOS/Android Touch-First Navigation Bar
// ====================================================================

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Kanban,
  BarChart3,
  Menu
} from 'lucide-react';

export default function MobileBottomNav({
  activeView,
  setActiveView,
  candidateCount = 0,
  urgentCount = 0,
  onOpenMobileMenu,
  onOpenComponentSelector
}) {
  const mainTabs = [
    {
      id: 'dashboard',
      label: 'Trang chủ',
      icon: LayoutDashboard
    },
    {
      id: 'table',
      label: 'Ứng viên',
      icon: Users,
      badge: candidateCount > 0 ? (candidateCount > 99 ? '99+' : String(candidateCount)) : null,
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      id: 'kanban',
      label: 'Kanban',
      icon: Kanban
    },
    {
      id: 'analytics',
      label: 'Báo cáo',
      icon: BarChart3
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-2xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.09)] px-1 py-1.5 pb-safe">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl flex-1 min-h-[48px] transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-black scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/70 shadow-2xs'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                </div>

                {tab.badge && (
                  <span
                    className={`absolute -top-1 -right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-black leading-tight shadow-xs ${
                      tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5 shadow-xs animate-fade-in" />
              )}
            </button>
          );
        })}

        {/* 5th Tab: "Thêm" (Opens Drawer / Hidden Modules) */}
        <button
          onClick={onOpenMobileMenu || onOpenComponentSelector}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl flex-1 min-h-[48px] transition-all duration-200 cursor-pointer ${
            activeView !== 'dashboard' && activeView !== 'table' && activeView !== 'kanban' && activeView !== 'analytics'
              ? 'text-blue-600 dark:text-blue-400 font-black scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <div className="p-1.5 rounded-xl">
              <Menu className="w-5 h-5" />
            </div>
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">Thêm</span>
        </button>
      </div>
    </nav>
  );
}
