// ====================================================================
// FASTHUNT / RECRUITCRM PRO - MOBILE FLOATING ACTION BUTTON (FAB)
// Quick Action Speed Dial for Fast Mobile Operations
// ====================================================================

import React, { useState } from 'react';
import {
  Plus,
  RefreshCw,
  Download,
  Bot,
  Filter,
  X,
  Sparkles,
  FileText
} from 'lucide-react';

export default function MobileFAB({
  onRefresh,
  isRefreshing,
  onExportCsv,
  onOpenAiBot,
  onOpenFilter,
  onOpenTemplates,
  hasActiveFilters
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2.5">
      {/* Speed Dial Menu Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-slide-up mb-1">
          {/* Action 1: Refresh / Sync Sheet */}
          <button
            onClick={() => {
              onRefresh();
              setIsOpen(false);
            }}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-black hover:bg-slate-50 cursor-pointer min-h-[44px]"
          >
            <span>{isRefreshing ? 'Đang đồng bộ...' : 'Đồng bộ Sheet'}</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </div>
          </button>

          {/* Action 2: Export CSV */}
          <button
            onClick={() => {
              onExportCsv();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-black hover:bg-slate-50 cursor-pointer min-h-[44px]"
          >
            <span>Xuất file CSV</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </button>

          {/* Action 3: FastHunt AI Assistant */}
          {onOpenAiBot && (
            <button
              onClick={() => {
                onOpenAiBot();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-black hover:bg-slate-50 cursor-pointer min-h-[44px]"
            >
              <span>Hỏi Trợ lý AI</span>
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
            </button>
          )}

          {/* Action 4: Email Templates */}
          {onOpenTemplates && (
            <button
              onClick={() => {
                onOpenTemplates();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-black hover:bg-slate-50 cursor-pointer min-h-[44px]"
            >
              <span>Mẫu Thư Tuyển Dụng</span>
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
          isOpen
            ? 'bg-slate-800 dark:bg-slate-700 rotate-45'
            : 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/40 hover:scale-105'
        }`}
        title="Thao tác nhanh"
      >
        {isOpen ? <Plus className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>
    </div>
  );
}
