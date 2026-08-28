// ====================================================================
// FASTHUNT / RECRUITCRM PRO - PROMOTIONAL TOP BANNER
// Compact Dismissable Marquee Banner for Mobile & Desktop
// ====================================================================

import React, { useState } from 'react';
import { Menu, Flame, Gift, ArrowRight, X } from 'lucide-react';

export default function TopBanner({ collapsed, setCollapsed, onOpenRewards, onOpenMobileMenu }) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleToggle = () => {
    if (window.innerWidth < 768 && onOpenMobileMenu) {
      onOpenMobileMenu();
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-xs flex items-center justify-between px-2.5 sm:px-4 py-1.5 text-xs font-bold transition-all relative overflow-hidden">
      {/* Left: Desktop Sidebar Toggle */}
      <button
        onClick={handleToggle}
        className="hidden md:flex p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer transition-colors items-center justify-center min-h-[32px] min-w-[32px]"
        title="Menu điều hướng"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Center: Single-line Scrolling Marquee Announcement */}
      <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden px-2">
        <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 flex-shrink-0 animate-bounce" />
        <span className="tracking-tight text-[11px] sm:text-xs truncate font-black">
          🔥 Tuyển nhiều tiền nhiều – Cơ hội thưởng nóng & bonus hấp dẫn cho CTV!
        </span>
        <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 flex-shrink-0 animate-bounce hidden sm:inline" />
      </div>

      {/* Right: Quick Action & Close button */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={onOpenRewards}
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[11px] font-extrabold cursor-pointer transition-all min-h-[28px]"
        >
          <Gift className="w-3 h-3" />
          <span>Thưởng</span>
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white cursor-pointer transition-colors flex items-center justify-center min-h-[32px] min-w-[32px]"
          title="Tắt thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
