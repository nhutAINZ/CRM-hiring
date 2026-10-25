import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Sparkles,
  TrendingUp,
  Award,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  FileUp,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CtvEarningsCalculator({ onOpenSubmitCv }) {
  const [salary, setSalary] = useState(20000000); // 20 million VND
  const [rate, setRate] = useState(20); // 20%
  const [candidates, setCandidates] = useState(3); // 3 candidates/month

  const formatVnd = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const calculation = useMemo(() => {
    const basePerCandidate = Math.round((salary * rate) / 100);
    const totalBase = basePerCandidate * candidates;

    let tier = {
      id: 'bronze',
      name: 'Đồng (Bronze)',
      badge: '🥉',
      bonusPerCandidate: 200000,
      nextTarget: 'Đạt 3 ứng viên để thăng hạng Bạc (+500k/CV)',
      perks: ['Thưởng nóng 200.000₫/CV', 'Báo cáo duyệt hồ sơ trong ngày']
    };

    if (candidates >= 10) {
      tier = {
        id: 'diamond',
        name: 'Kim Cương (Diamond Club)',
        badge: '💎',
        bonusPerCandidate: 2000000,
        quarterlyBonus: 10000000,
        nextTarget: 'Cấp bậc tối đa - Thành viên VIP FastHunt',
        perks: [
          'Thưởng nóng 2.000.000₫/CV onboard',
          'Thưởng quý 10.000.000₫ khi duy trì',
          'Chuyên viên HR Lead 1-1 chăm sóc riêng',
          'Ưu tiên độc quyền nguồn Job kín'
        ]
      };
    } else if (candidates >= 5) {
      tier = {
        id: 'gold',
        name: 'Vàng (Gold)',
        badge: '🥇',
        bonusPerCandidate: 1000000,
        nextTarget: 'Đạt 10 ứng viên để thăng hạng Kim Cương (+2tr/CV)',
        perks: [
          'Thưởng nóng 1.000.000₫/CV onboard',
          'Hỗ trợ sơ vấn & chỉnh sửa CV chuyên nghiệp',
          'Ưu tiên lịch phỏng vấn doanh nghiệp trong 24h'
        ]
      };
    } else if (candidates >= 3) {
      tier = {
        id: 'silver',
        name: 'Bạc (Silver)',
        badge: '🥈',
        bonusPerCandidate: 500000,
        nextTarget: 'Đạt 5 ứng viên để thăng hạng Vàng (+1tr/CV)',
        perks: [
          'Thưởng nóng 500.000₫/CV onboard',
          'Thông báo lịch phỏng vấn realtime qua Zalo'
        ]
      };
    }

    const totalBonus = (tier.bonusPerCandidate || 0) * candidates;
    const grandTotal = totalBase + totalBonus;

    return {
      basePerCandidate,
      totalBase,
      totalBonus,
      grandTotal,
      tier
    };
  }, [salary, rate, candidates]);

  const handleCalculateCelebration = () => {
    try {
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.8 } });
    } catch (e) {}
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Bảng Tính Dự Tính Hoa Hồng & Bậc Thưởng CTV
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mô phỏng thu nhập thực nhận dựa trên mức lương ứng viên và số lượng onboard trong tháng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold w-fit">
          <Gift className="w-3.5 h-3.5" />
          <span>Thưởng nóng lũy tiến theo số lượng</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Mức lương ứng viên */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                1. Mức lương trung bình của ứng viên:
              </label>
              <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                {formatVnd(salary)}
              </span>
            </div>
            <input
              type="range"
              min="10000000"
              max="60000000"
              step="1000000"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>10 triệu</span>
              <span>25 triệu</span>
              <span>40 triệu</span>
              <span>60 triệu</span>
            </div>
          </div>

          {/* 2. Tỷ lệ hoa hồng */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              2. Tỷ lệ hoa hồng theo thỏa thuận việc làm:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 20, 25, 30].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setRate(pct)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    rate === pct
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pct}% Lương
                </button>
              ))}
            </div>
          </div>

          {/* 3. Số lượng ứng viên onboard */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                3. Số lượng ứng viên trúng tuyển (Onboard) dự kiến trong tháng:
              </label>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                {candidates} ứng viên
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 5, 8, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => {
                    setCandidates(cnt);
                    handleCalculateCelebration();
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    candidates === cnt
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Bậc danh hiệu CTV */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Bậc thành viên & Đặc quyền CTV FastHunt:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl border text-center transition-all ${
                calculation.tier.id === 'bronze'
                  ? 'bg-amber-50/80 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-500'
              }`}>
                <span className="text-base">🥉</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Đồng</p>
                <span className="text-[10px] text-slate-400">1 - 2 CV (+200k)</span>
              </div>

              <div className={`p-2.5 rounded-xl border text-center transition-all ${
                calculation.tier.id === 'silver'
                  ? 'bg-slate-200/80 border-slate-400 dark:bg-slate-800 dark:border-slate-600 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-500'
              }`}>
                <span className="text-base">🥈</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Bạc</p>
                <span className="text-[10px] text-slate-400">3 - 4 CV (+500k)</span>
              </div>

              <div className={`p-2.5 rounded-xl border text-center transition-all ${
                calculation.tier.id === 'gold'
                  ? 'bg-amber-100/80 border-amber-400 dark:bg-amber-950/60 dark:border-amber-600 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-500'
              }`}>
                <span className="text-base">🥇</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Vàng</p>
                <span className="text-[10px] text-slate-400">5 - 9 CV (+1tr)</span>
              </div>

              <div className={`p-2.5 rounded-xl border text-center transition-all ${
                calculation.tier.id === 'diamond'
                  ? 'bg-blue-100/80 border-blue-400 dark:bg-blue-950/60 dark:border-blue-600 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-500'
              }`}>
                <span className="text-base">💎</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Kim Cương</p>
                <span className="text-[10px] text-slate-400">10+ CV (+2tr/CV)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white shadow-xl shadow-blue-500/10 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-100">
                Ước Tính Thu Nhập Thực Nhận
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-xs font-bold text-white flex items-center gap-1">
                <span>{calculation.tier.badge}</span>
                <span>{calculation.tier.name}</span>
              </span>
            </div>

            <div className="pt-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white block">
                {formatVnd(calculation.grandTotal)}
              </span>
              <p className="text-xs text-blue-100 mt-1">
                Bao gồm hoa hồng theo tỷ lệ lương + thưởng nóng lũy tiến
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 pt-3 border-t border-white/20 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Hoa hồng gốc ({rate}% x {candidates} CV):</span>
                <strong className="text-white">{formatVnd(calculation.totalBase)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Thưởng nóng cấp bậc ({calculation.tier.name}):</span>
                <strong className="text-amber-300">+{formatVnd(calculation.totalBonus)}</strong>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-blue-200">
                <span>Mỗi ứng viên mang lại:</span>
                <strong className="text-white font-bold">
                  ~{formatVnd(calculation.basePerCandidate + calculation.tier.bonusPerCandidate)} / người
                </strong>
              </div>
            </div>

            {/* Perks list */}
            <div className="pt-2 space-y-1">
              {calculation.tier.perks.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (onOpenSubmitCv) onOpenSubmitCv();
              handleCalculateCelebration();
            }}
            className="w-full py-3 px-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <FileUp className="w-4 h-4 text-blue-700" />
            <span>Nộp CV Ngay Để Đạt Mục Tiêu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
