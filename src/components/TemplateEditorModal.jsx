// ====================================================================
// FASTHUNT / RECRUITCRM PRO - TEMPLATE EDITOR MODAL
// Mobile-First Optimized Template Customization Engine
// ====================================================================

import React, { useState } from 'react';
import { X, Save, RotateCcw, Info, Check, FileText } from 'lucide-react';
import { DEFAULT_TEMPLATES, getStoredTemplates, saveStoredTemplates } from '../utils/emailTemplates';

export default function TemplateEditorModal({ onClose, onSaveSuccess }) {
  const current = getStoredTemplates();
  const [activeTab, setActiveTab] = useState('templateA');
  const [templates, setTemplates] = useState({
    templateA: current.templateA || DEFAULT_TEMPLATES.templateA,
    templateB: current.templateB || DEFAULT_TEMPLATES.templateB,
    templateC: current.templateC || DEFAULT_TEMPLATES.templateC,
    templateD: current.templateD || DEFAULT_TEMPLATES.templateD
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    saveStoredTemplates(templates);
    setSavedSuccess(true);
    if (onSaveSuccess) onSaveSuccess();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefault = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục lại toàn bộ mẫu thư mặc định ban đầu?')) {
      setTemplates({ ...DEFAULT_TEMPLATES });
      saveStoredTemplates(DEFAULT_TEMPLATES);
      if (onSaveSuccess) onSaveSuccess();
    }
  };

  const tabs = [
    { id: 'templateA', label: '🎉 Nhận Việc (Mẫu A)' },
    { id: 'templateB', label: '📅 Phỏng Vấn (Mẫu B)' },
    { id: 'templateC', label: '✉️ Cảm Ơn (Mẫu C)' },
    { id: 'templateD', label: '📊 Báo Cáo CTV (Mẫu D)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 p-3.5 sm:p-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-sm sm:text-lg font-bold truncate">Quản Lý & Tùy Biến Mẫu Thư</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Tự động lưu trình duyệt (localStorage), áp dụng khi gửi email.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleResetDefault}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 text-[11px] sm:text-xs font-semibold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer min-h-[36px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Khôi Phục Gốc</span>
            </button>
          </div>

          {/* Placeholders helper legend */}
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[11px] sm:text-xs">
              <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Các biến thẻ tự động khả dụng:</span>
            </div>
            <p className="font-mono text-[10.5px] sm:text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed break-all">
              {"{{TEN_UNG_VIEN}}"}, {"{{VI_TRI}}"}, {"{{CONG_TY}}"}, {"{{NGUOI_LIEN_HE}}"}, {"{{SDT}}"}, {"{{NGAY_BAT_DAU}}"}, {"{{LUONG_CHINH_THUC}}"}, {"{{LUONG_THU_VIEC}}"}, {"{{NGAY_PV}}"}, {"{{GIO_PV}}"}, {"{{DIA_DIEM_PV}}"}, {"{{MA_CTV}}"}
            </p>
          </div>

          {/* Editor Area */}
          <div>
            <textarea
              rows={12}
              value={templates[activeTab]}
              onChange={(e) => {
                const val = e.target.value;
                setTemplates((prev) => ({ ...prev, [activeTab]: val }));
              }}
              className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-base sm:text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed min-h-[220px]"
            ></textarea>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 flex-shrink-0 pb-safe">
          <div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Đã lưu!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer min-h-[40px]"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer min-h-[40px]"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Toàn Bộ Mẫu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
