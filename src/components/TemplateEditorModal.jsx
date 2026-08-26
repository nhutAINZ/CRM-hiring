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
    { id: 'templateA', label: '🎉 Thư Mời Nhận Việc (Mẫu A)' },
    { id: 'templateB', label: '📅 Thư Mời Phỏng Vấn (Mẫu B)' },
    { id: 'templateC', label: '✉️ Cảm Ơn / Từ Chối Khéo (Mẫu C)' },
    { id: 'templateD', label: '📊 Báo Cáo CTV (Mẫu D)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Quản Lý & Tùy Biến Mẫu Thư Tuyển Dụng</h2>
              <p className="text-xs text-slate-400">
                Nội dung lưu tại trình duyệt (localStorage), tự động áp dụng khi tạo email.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto flex-1">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center flex-wrap gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-semibold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Khôi Phục Mặc Định</span>
            </button>
          </div>

          {/* Placeholders helper legend */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Các biến thẻ tự động có thể chèn vào nội dung:</span>
            </div>
            <p className="font-mono text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              {"{{TEN_UNG_VIEN}}"}, {"{{VI_TRI}}"}, {"{{CONG_TY}}"}, {"{{CHI_NHANH}}"}, {"{{SO_NGAY_THU_VIEC}}"}, {"{{LUONG_THU_VIEC}}"}, {"{{LUONG_CHINH_THUC}}"}, {"{{NGAY_BAT_DAU}}"}, {"{{GIO_BAT_DAU}}"}, {"{{DIA_CHI}}"}, {"{{CA_SANG}}"}, {"{{CA_CHIEU}}"}, {"{{HAN_CHOT}}"}, {"{{SDT}}"}, {"{{NGUOI_LIEN_HE}}"}, {"{{NGAY_PV}}"}, {"{{GIO_PV}}"}, {"{{DIA_DIEM_PV}}"}, {"{{MA_CTV}}"}
            </p>
          </div>

          {/* Editor Area */}
          <div>
            <textarea
              rows={15}
              value={templates[activeTab]}
              onChange={(e) => {
                const val = e.target.value;
                setTemplates((prev) => ({ ...prev, [activeTab]: val }));
              }}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Đã lưu thành công!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Toàn Bộ Mẫu Thư</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
