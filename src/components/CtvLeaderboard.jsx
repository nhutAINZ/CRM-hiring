import React from 'react';
import {
  Trophy,
  Award,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function CtvLeaderboard({ leaderboard = [], activeCtvCode }) {
  const getMedalBadge = (rank) => {
    switch (rank) {
      case 1:
        return { icon: '🥇', label: 'Quán Quân', bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' };
      case 2:
        return { icon: '🥈', label: 'Á Quân', bg: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300' };
      case 3:
        return { icon: '🥉', label: 'Hạng Ba', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400' };
      default:
        return { icon: `#${rank}`, label: `Top ${rank}`, bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' };
    }
  };

  // Mask name for privacy (e.g. "Nguyen Van A" -> "Nguyễn V***")
  const maskName = (name = '') => {
    if (!name || name.startsWith('CTV')) return name;
    const parts = name.trim().split(' ');
    if (parts.length <= 1) return name;
    const first = parts.slice(0, -1).join(' ');
    const last = parts[parts.length - 1];
    return `${first} ${last.charAt(0)}***`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* 🏆 Leaderboard (7 cols) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Bảng Vinh Danh Top CTV Năng Động Trong Tháng
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tuyên dương các đối tác có nhiều ứng viên trúng tuyển và hoạt động tích cực nhất
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hidden sm:inline">
            Realtime Google Sheets
          </span>
        </div>

        {leaderboard.length > 0 ? (
          <div className="space-y-2.5">
            {leaderboard.map((ctv, index) => {
              const rank = index + 1;
              const medal = getMedalBadge(rank);
              const isMe = activeCtvCode && ctv.ctvCode.toLowerCase() === activeCtvCode.toLowerCase();

              return (
                <div
                  key={ctv.ctvCode}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isMe
                      ? 'bg-blue-50/80 border-blue-400 dark:bg-blue-950/40 dark:border-blue-700 shadow-xs'
                      : 'bg-slate-50/60 dark:bg-slate-850 border-slate-200/70 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0 w-8 text-center">{medal.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {maskName(ctv.name)}
                        </span>
                        <span className="px-2 py-0.2 rounded-md font-mono text-[10px] font-extrabold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {ctv.ctvCode}
                        </span>
                        {isMe && (
                          <span className="px-2 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                            Bạn
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tổng {ctv.total} hồ sơ gửi | {ctv.passCv} CV đạt sơ vấn
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 font-black text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                      <span>{ctv.onboard}</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Onboard 🎉</span>
                    </div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                      {medal.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs text-slate-500">Đang đồng bộ dữ liệu bảng xếp hạng CTV tháng này...</p>
          </div>
        )}
      </div>

      {/* 💳 Payout Schedule & Policies (5 cols) */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Lịch Trình Chi Trả Hoa Hồng CTV
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Minh bạch, tự động đối soát và chuyển khoản định kỳ
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {/* Kỳ 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  10
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Kỳ Thanh Toán 1 (Ngày 10)</h5>
                  <p className="text-[11px] text-slate-400">Cho các hồ sơ onboard từ ngày 16 đến cuối tháng trước</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200">
                Đúng hạn
              </span>
            </div>

            {/* Kỳ 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                  25
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Kỳ Thanh Toán 2 (Ngày 25)</h5>
                  <p className="text-[11px] text-slate-400">Cho các hồ sơ onboard từ ngày 01 đến ngày 15 cùng tháng</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200">
                Đúng hạn
              </span>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Cam Kết Minh Bạch 100% Của FastHunt:</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              • Chuyển khoản trực tiếp vào tài khoản ngân hàng do CTV đăng ký.<br />
              • Có bảng đối soát chi tiết họ tên ứng viên, vị trí và công ty.<br />
              • Hỗ trợ khiếu nại và tra soát 24/7 qua Zalo Admin.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400">
          Mọi thắc mắc về đối soát vui lòng liên hệ Admin qua tab Zalo
        </div>
      </div>
    </div>
  );
}
