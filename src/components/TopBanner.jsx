import React from 'react';
import { Menu, Flame, Gift, ArrowRight } from 'lucide-react';

export default function TopBanner({ collapsed, setCollapsed, onOpenRewards }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-sm flex items-center justify-between px-4 py-2 text-xs font-bold transition-all">
      {/* Left: Sidebar Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer transition-colors flex items-center justify-center"
        title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center: Top Green Announcement Text */}
      <div className="flex items-center justify-center gap-2 text-center animate-pulse">
        <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
        <span className="tracking-wide">
          Tuyển nhiều tiền nhiều cơ hội để tốt hơn
        </span>
        <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
      </div>

      {/* Right: Quick Action / Rewards */}
      <button
        onClick={onOpenRewards}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-extrabold cursor-pointer transition-all shadow-2xs"
      >
        <Gift className="w-3.5 h-3.5" />
        <span>Nhận quà</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
