// ====================================================================
// FASTHUNT / RECRUITCRM PRO - MOBILE-FIRST FILTER & SEARCH BAR
// Sticky Compact Search + Trigger for Mobile Filter Bottom Sheet
// ====================================================================

import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  Filter,
  ChevronDown
} from 'lucide-react';
import MobileFilterBottomSheet from './MobileFilterBottomSheet';

export default function FilterBar({
  filters,
  setFilters,
  ctvOptions,
  positionOptions,
  onResetFilters,
  totalResults
}) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

  const activeFilterCount =
    (filters.datePreset !== 'all' ? 1 : 0) +
    (filters.ctv !== 'all' ? 1 : 0) +
    (filters.position !== 'all' ? 1 : 0) +
    (filters.cvStatus !== 'all' ? 1 : 0) +
    (filters.pvStatus !== 'all' ? 1 : 0);

  const hasActiveFilters = filters.search !== '' || activeFilterCount > 0;

  return (
    <div className="sticky top-[53px] sm:top-[57px] z-30 space-y-3 bg-slate-50/95 dark:bg-[#030712]/95 backdrop-blur-md py-2 -mx-3 sm:mx-0 px-3 sm:px-0">
      {/* ── Mobile Sticky Search & Filter Hub (< md) ── */}
      <div className="flex md:hidden items-center gap-2">
        {/* Expandable Search Input Container */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Tìm tên, SĐT, email UV..."
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-xs min-h-[44px]"
            style={{ fontSize: '16px' }} // Prevents iOS Safari auto-zoom
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Unified Filter Button (Opens Bottom Sheet) */}
        <button
          onClick={() => setIsBottomSheetOpen(true)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border transition-all cursor-pointer min-h-[44px] flex-shrink-0 shadow-xs ${
            activeFilterCount > 0
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 font-black'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="text-xs">Lọc</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-blue-600 font-black">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Desktop Multi-column Search & Dropdowns (>= md) ── */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {totalResults} Hồ Sơ Ứng Viên
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[36px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Input 1: Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Nhập họ tên, sđt, email UV"
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Input 2: Position Select */}
          <div className="relative flex-1">
            <select
              value={filters.position}
              onChange={(e) => setFilters({ ...filters, position: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none cursor-pointer pr-9"
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

          {/* Trigger Filter Bottom Sheet on Desktop as modal */}
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[38px] ${
              activeFilterCount > 0
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Bộ lọc nâng cao {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* ── Active Filter Summary Pills (Mobile & Desktop) ── */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">
            Đang lọc:
          </span>
          {filters.position !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex-shrink-0">
              <span>{filters.position}</span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, position: 'all' })}
              />
            </span>
          )}
          {filters.cvStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex-shrink-0">
              <span>CV: {filters.cvStatus}</span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, cvStatus: 'all' })}
              />
            </span>
          )}
          {filters.pvStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex-shrink-0">
              <span>PV: {filters.pvStatus}</span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, pvStatus: 'all' })}
              />
            </span>
          )}
          {filters.ctv !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex-shrink-0">
              <span>CTV: {filters.ctv}</span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, ctv: 'all' })}
              />
            </span>
          )}
          {filters.datePreset !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex-shrink-0">
              <span>Thời gian: {filters.datePreset}</span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, datePreset: 'all' })}
              />
            </span>
          )}
        </div>
      )}

      {/* ── Slide-up Mobile Filter Bottom Sheet ── */}
      <MobileFilterBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        filters={filters}
        setFilters={setFilters}
        ctvOptions={ctvOptions}
        positionOptions={positionOptions}
        onResetFilters={onResetFilters}
        totalResults={totalResults}
      />
    </div>
  );
}
