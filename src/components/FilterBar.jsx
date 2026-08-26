import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, X, CheckCircle2, Clock, Award, UserCheck, ChevronDown } from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  ctvOptions,
  positionOptions,
  onResetFilters,
  totalResults
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const datePresets = [
    { id: 'all',          label: 'Tất cả' },
    { id: 'today',        label: 'Hôm nay' },
    { id: 'this_week',    label: 'Tuần này' },
    { id: 'this_month',   label: 'Tháng này' },
    { id: 'last_30_days', label: '30 ngày' },
    { id: 'custom',       label: 'Tùy chọn' }
  ];

  const hasActiveFilters =
    filters.search !== '' ||
    filters.datePreset !== 'all' ||
    filters.ctv !== 'all' ||
    filters.position !== 'all' ||
    filters.cvStatus !== 'all' ||
    filters.pvStatus !== 'all';

  return (
    <div className="space-y-3">
      {/* ── 1. Top Section: FastHunt Search Inputs & Header ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
        
        {/* Title Count from Screenshot ("65 Hồ Sơ") */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {totalResults} Hồ Sơ
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Top Search Inputs Row matching exact FastHunt UI screenshot */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Input 1: Nhập họ tên, sđt, email UV */}
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              id="filter-search-name"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Nhập họ tên, sđt, email UV"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-2xs"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Input 2: Vị trí ứng tuyển */}
          <div className="relative flex-1 min-w-[200px]">
            <select
              value={filters.position}
              onChange={(e) => setFilters({ ...filters, position: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-2xs appearance-none cursor-pointer pr-10"
            >
              <option value="all">Vị trí ứng tuyển (Tất cả)</option>
              {positionOptions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Right Button: Tìm kiếm nâng cao */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              showAdvanced || hasActiveFilters
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Tìm kiếm nâng cao</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* ── 2. Expandable Advanced Filter Panel ── */}
      {showAdvanced && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Filter by CTV */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Người tạo (Mã CTV)
              </label>
              <select
                value={filters.ctv}
                onChange={(e) => setFilters({ ...filters, ctv: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả CTV</option>
                {ctvOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by CV Result */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Kết quả Duyệt CV
              </label>
              <select
                value={filters.cvStatus}
                onChange={(e) => setFilters({ ...filters, cvStatus: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái CV</option>
                <option value="PASS">PASS CV</option>
                <option value="FAIL">FAIL CV (Review Fail / CVSent Fail)</option>
                <option value="PENDING">Chờ phản hồi CV</option>
              </select>
            </div>

            {/* Filter by PV Result */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Kết quả Phỏng vấn
              </label>
              <select
                value={filters.pvStatus}
                onChange={(e) => setFilters({ ...filters, pvStatus: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả kết quả PV</option>
                <option value="PASS">Pass Phỏng Vấn</option>
                <option value="FAIL">Fail / Hủy Phỏng Vấn</option>
                <option value="PENDING">Đã Hẹn / Chờ Kết Quả PV</option>
              </select>
            </div>

            {/* Time Preset */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Thời gian nộp hồ sơ
              </label>
              <select
                value={filters.datePreset}
                onChange={(e) => setFilters({ ...filters, datePreset: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {datePresets.map((dp) => (
                  <option key={dp.id} value={dp.id}>
                    {dp.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Date Picker Range if Preset is Custom */}
          {filters.datePreset === 'custom' && (
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
              <span className="text-slate-400 text-xs">đến</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
