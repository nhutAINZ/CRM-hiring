// ====================================================================
// FASTHUNT / RECRUITCRM PRO - MOBILE FILTER BOTTOM SHEET
// Touch-First Sliding Drawer for Search & Multi-Criteria Filtering
// ====================================================================

import React from 'react';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Calendar,
  Briefcase,
  UserCheck,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';

export default function MobileFilterBottomSheet({
  isOpen,
  onClose,
  filters,
  setFilters,
  ctvOptions = [],
  positionOptions = [],
  onResetFilters,
  totalResults = 0
}) {
  if (!isOpen) return null;

  const datePresets = [
    { id: 'all', label: 'Tất cả' },
    { id: 'today', label: 'Hôm nay' },
    { id: 'this_week', label: 'Tuần này' },
    { id: 'this_month', label: 'Tháng này' },
    { id: 'last_30_days', label: '30 ngày qua' }
  ];

  const cvStatusOptions = [
    { id: 'all', label: 'Tất cả', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    { id: 'PASS', label: 'Pass CV', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
    { id: 'FAIL', label: 'Fail CV', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' },
    { id: 'PENDING', label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' }
  ];

  const pvStatusOptions = [
    { id: 'all', label: 'Tất cả', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    { id: 'PASS', label: 'Pass PV', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
    { id: 'FAIL', label: 'Fail / Hủy', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' },
    { id: 'PENDING', label: 'Chờ PV', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' }
  ];

  const activeFilterCount =
    (filters.datePreset !== 'all' ? 1 : 0) +
    (filters.ctv !== 'all' ? 1 : 0) +
    (filters.position !== 'all' ? 1 : 0) +
    (filters.cvStatus !== 'all' ? 1 : 0) +
    (filters.pvStatus !== 'all' ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Modal Container */}
      <div
        className="relative w-full max-h-[88vh] bg-white dark:bg-[#0c1222] border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up z-10"
      >
        {/* Header with Handle */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex-shrink-0">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Bộ Lọc Ứng Viên
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Đang hiển thị {totalResults} hồ sơ phù hợp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={onResetFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer min-h-[36px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xóa lọc ({activeFilterCount})</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Filter Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin text-slate-900 dark:text-slate-100 pb-8">
          {/* 1. Vị trí ứng tuyển */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Vị trí tuyển dụng</span>
            </label>
            <select
              value={filters.position}
              onChange={(e) => setFilters({ ...filters, position: e.target.value })}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              style={{ fontSize: '16px' }}
            >
              <option value="all">Tất cả vị trí</option>
              {positionOptions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Trạng thái Duyệt CV */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Trạng thái CV</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cvStatusOptions.map((opt) => {
                const isSelected = filters.cvStatus === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFilters({ ...filters, cvStatus: opt.id })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600'
                        : `${opt.color} hover:opacity-90`
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Trạng thái Phỏng vấn (PV) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Trạng thái Phỏng vấn</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {pvStatusOptions.map((opt) => {
                const isSelected = filters.pvStatus === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFilters({ ...filters, pvStatus: opt.id })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600'
                        : `${opt.color} hover:opacity-90`
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Mã CTV giới thiệu */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Mã CTV Giới thiệu</span>
            </label>
            <select
              value={filters.ctv}
              onChange={(e) => setFilters({ ...filters, ctv: e.target.value })}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              style={{ fontSize: '16px' }}
            >
              <option value="all">Tất cả CTV ({ctvOptions.length} CTV)</option>
              {ctvOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Thời gian nộp hồ sơ */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Khoảng thời gian</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {datePresets.map((preset) => {
                const isSelected = filters.datePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setFilters({ ...filters, datePreset: preset.id })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/80 flex items-center gap-3 flex-shrink-0 pb-safe">
          <button
            onClick={onResetFilters}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold min-h-[48px] cursor-pointer"
          >
            Đặt lại
          </button>
          <button
            onClick={onClose}
            className="flex-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30 min-h-[48px] cursor-pointer"
          >
            Áp dụng ({totalResults} kết quả)
          </button>
        </div>
      </div>
    </div>
  );
}
