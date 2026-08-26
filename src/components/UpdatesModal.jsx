import React from 'react';
import { X, Sparkles, Zap, ShieldCheck, Palette, Bot, Database, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function UpdatesModal({ onClose, onOpenSettings }) {
  const updates = [
    {
      id: 1,
      version: 'v2.5.0',
      date: 'Mới nhất',
      title: '🎨 Chuyển Đổi Giao Diện Xanh Dương (Blue Theme)',
      icon: Palette,
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
      description: 'Chuyển toàn bộ màu sắc hệ thống từ Xanh Lá sang màu Xanh Dương (Blue/Indigo) sang trọng, chuẩn giao diện RecruitCRM SaaS thế hệ mới.'
    },
    {
      id: 2,
      version: 'v2.4.0',
      date: 'Hôm nay',
      title: '⚡ Thuật Toán Hai Con Trỏ O(N/2) Tối Ưu Load Test 100.000 Hồ Sơ',
      icon: Zap,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
      description: 'Áp dụng thuật toán Two-Pointer song song scanning 2 đầu mảng, lọc 50.000 hồ sơ trong 11.73 ms, giúp hệ thống load siêu tốc không lo giật lag.'
    },
    {
      id: 3,
      version: 'v2.3.0',
      date: 'Chuẩn ISTQB',
      title: '🧪 100 Test Cases ISTQB Automated Test Suite',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
      description: 'Hoàn thành 100/100 test case tự động bao gồm: Equivalence Partitioning, Boundary Value Analysis, State Transition, Decision Table và Error Guessing.'
    },
    {
      id: 4,
      version: 'v2.2.0',
      date: 'Tính năng mới',
      title: '🤖 FastHunt AI Chatbot Assistant & Dispatch Zalo/Telegram',
      icon: Bot,
      badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300',
      description: 'Tự động tổng hợp số liệu Pass CV, Onboard, gửi báo cáo định dạng chuẩn qua Zalo / Telegram chỉ với 1 click.'
    },
    {
      id: 5,
      version: 'v2.1.0',
      date: 'Đã nâng cấp',
      title: '🛠️ Tích Hợp Cấu Hình Kết Nối Vào Mục Tiện Ích',
      icon: Database,
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
      description: 'Di chuyển menu Cài đặt kết nối Google Sheet vào dropdown Tiện ích trong Sidebar giúp truy cập nhanh chóng và gọn gàng hơn.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white/20 text-white uppercase tracking-wider backdrop-blur-md">
                  System Changelog
                </span>
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Cập Nhật Các Thay Đổi Mới
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                Danh sách các tính năng mới, tối ưu hiệu năng & cập nhật hệ thống FastHunt RecruitCRM Pro.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Updates Timeline */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {updates.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${item.badgeColor}`}>
                    {item.version} • {item.date}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed pl-10">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Hệ thống đang chạy phiên bản mới nhất v2.5.0</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenSettings && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all cursor-pointer"
              >
                <span>Mở Cấu Hình Tiện Ích</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
