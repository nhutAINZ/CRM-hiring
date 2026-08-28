// ====================================================================
// FASTHUNT RECRUITMENT AGENT - MOBILE BOTTOM NAVIGATION BAR
// iOS / Android Native-style 1-Thumb Touch Navigation
// ====================================================================

import React from 'react';
import {
  Users,
  Briefcase,
  MessageCircle,
  Building,
  LayoutDashboard,
  Menu,
  AlertTriangle
} from 'lucide-react';

export default function MobileBottomNav({
  activeView,
  setActiveView,
  candidateCount = 0,
  urgentCount = 0,
  onOpenMobileMenu,
  onOpenComponentSelector
}) {
  const navItems = [
    {
      id: 'table',
      label: 'Ứng viên',
      icon: Users,
      badge: candidateCount > 0 ? (candidateCount > 99 ? '99+' : candidateCount) : null,
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      id: 'jobs',
      label: 'Jobs Hot',
      icon: Briefcase,
      badge: 'Hot',
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'zalo',
      label: 'Zalo Nick',
      icon: MessageCircle,
      badge: 'Free',
      badgeColor: 'bg-sky-500 text-white'
    },
    {
      id: 'clients',
      label: 'Khách hàng',
      icon: Building
    },
    {
      id: 'urgent',
      label: 'Gấp',
      icon: AlertTriangle,
      badge: urgentCount > 0 ? urgentCount : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around gap-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl min-w-[52px] transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/70 shadow-xs'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                </div>

                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black leading-tight shadow-xs ${
                      item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5 shadow-xs animate-fade-in" />
              )}
            </button>
          );
        })}

        {/* Menu Drawer Toggle Button on Mobile */}
        <button
          onClick={onOpenComponentSelector || onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl min-w-[52px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors cursor-pointer"
        >
          <div className="p-1 rounded-xl">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Tất cả</span>
        </button>
      </div>
    </nav>
  );
}
