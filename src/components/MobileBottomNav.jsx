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
  Menu,
  Briefcase,
  Zap,
  Share2
} from 'lucide-react';

export default function MobileBottomNav({
  activeView,
  setActiveView,
  candidateCount = 0,
  urgentCount = 0,
  jobCount = 0,
  onOpenMobileMenu,
  onOpenComponentSelector,
  isAdmin = false
}) {
  const ctvTabs = [
    {
      id: 'ctv-dashboard',
      label: 'Cổng CTV',
      icon: LayoutDashboard
    },
    {
      id: 'jobs',
      label: 'Việc Làm',
      icon: Briefcase,
      badge: jobCount > 0 ? String(jobCount) : null,
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'content-gen',
      label: 'Gen Content',
      icon: Zap
    },
    {
      id: 'group-finder',
      label: 'Tìm Group',
      icon: Share2
    }
  ];

  const adminTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
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
      id: 'jobs',
      label: 'Jobs Mở',
      icon: Briefcase
    }
  ];

  const currentTabs = isAdmin ? adminTabs : ctvTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-2xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.09)] px-1 py-1.5 pb-safe">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {currentTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[56px] min-h-[48px] transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/60 font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-black leading-none ${
                      tab.badgeColor || 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-semibold tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Menu Drawer Toggle */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[56px] min-h-[48px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-semibold tracking-tight">Thêm</span>
        </button>
      </div>
    </nav>
  );
}
