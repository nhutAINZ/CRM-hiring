import React, { useState } from 'react';
import { X, Save, Database, ExternalLink, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { DEFAULT_CONFIG, saveStoredConfig, getCsvUrl } from '../services/sheetsService';

export default function SettingsModal({ config, onSaveConfig, onClose, onRefreshData }) {
  const [form, setForm] = useState({ ...config });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSave = () => {
    saveStoredConfig(form);
    onSaveConfig(form);
    if (onRefreshData) onRefreshData();
    onClose();
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_CONFIG });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const url = getCsvUrl(form.sheet1Id, form.sheet1Gid);
      const res = await fetch(url, { cache: 'no-cache' });
      if (res.ok) {
        setTestResult({ success: true, message: 'Kết nối Google Sheet 1 thành công!' });
      } else {
        setTestResult({
          success: false,
          message: `Lỗi kết nối (Mã phản hồi HTTP ${res.status}). Vui lòng kiểm tra quyền chia sẻ Public/Anyone with link.`
        });
      }
    } catch (e) {
      setTestResult({
        success: false,
        message: `Lỗi kết nối mạng: ${e.message}. Kiểm tra lại ID Google Sheet.`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Cài Đặt Kết Nối Google Sheet</h2>
              <p className="text-xs text-slate-400">Cấu hình Spreadsheet ID và Chu kỳ đồng bộ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Sheet 1 Settings */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="text-xs">Google Sheet 1 (Nguồn Dữ Liệu Nội Bộ)</span>
              <a
                href={`https://docs.google.com/spreadsheets/d/${form.sheet1Id}/edit#gid=${form.sheet1Gid}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Mở Sheet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Spreadsheet ID</label>
              <input
                type="text"
                value={form.sheet1Id}
                onChange={(e) => setForm({ ...form, sheet1Id: e.target.value.trim() })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Sheet GID (Mặc định THÔNG TIN ỨNG VIÊN)</label>
              <input
                type="text"
                value={form.sheet1Gid}
                onChange={(e) => setForm({ ...form, sheet1Gid: e.target.value.trim() })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Sheet 2 Settings */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="text-xs">Google Sheet 2 (Trích Xuất Gửi Khách Hàng)</span>
              <a
                href={`https://docs.google.com/spreadsheets/d/${form.sheet2Id}/edit`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Mở Sheet 2</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Spreadsheet ID Sheet 2</label>
              <input
                type="text"
                value={form.sheet2Id}
                onChange={(e) => setForm({ ...form, sheet2Id: e.target.value.trim() })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* CTV Sheet Settings */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="text-xs">Google Sheet Mã CTV (Hỗ Trợ Bonus CTV)</span>
              <a
                href={`https://docs.google.com/spreadsheets/d/${form.ctvSheetId || '11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk'}/edit?gid=${form.ctvSheetGid || '497830992'}#gid=${form.ctvSheetGid || '497830992'}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Mở Sheet CTV</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Spreadsheet ID Sheet CTV</label>
              <input
                type="text"
                value={form.ctvSheetId || '11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk'}
                onChange={(e) => setForm({ ...form, ctvSheetId: e.target.value.trim() })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Job Openings Sheet Settings */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50">
            <div className="flex items-center justify-between font-bold text-indigo-900 dark:text-indigo-200">
              <span className="text-xs flex items-center gap-1.5">
                <span>⭐ Google Sheet Jobs (Vị Trí & Bonus CTV)</span>
              </span>
              <a
                href={`https://docs.google.com/spreadsheets/d/${form.jobSheetId || '1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko'}/edit?gid=${form.jobSheetGid || '0'}#gid=${form.jobSheetGid || '0'}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Mở Sheet Jobs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Spreadsheet ID Sheet Jobs</label>
              <input
                type="text"
                value={form.jobSheetId || '1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko'}
                onChange={(e) => setForm({ ...form, jobSheetId: e.target.value.trim() })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Sheet GID (Mặc định 0)</label>
              <input
                type="text"
                value={form.jobSheetGid || '0'}
                onChange={(e) => setForm({ ...form, jobSheetGid: e.target.value.trim() })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Intergreat Client Sheet Settings */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
            <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
              <span className="text-xs flex items-center gap-1.5">
                <span>🎓 Google Sheet Khách Hàng (Intergreat - Tư Vấn Tuyển Sinh)</span>
              </span>
              <a
                href={`https://docs.google.com/spreadsheets/d/${form.intergreatSheetId || '1Krhpgtd-l-4DK0GwIhnntatbhakC5GYHKK0jVc5Pij4'}/edit?gid=${form.intergreatSheetGid || '0'}#gid=${form.intergreatSheetGid || '0'}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Mở Sheet Intergreat</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Spreadsheet ID Khách Hàng Intergreat</label>
              <input
                type="text"
                value={form.intergreatSheetId || '1Krhpgtd-l-4DK0GwIhnntatbhakC5GYHKK0jVc5Pij4'}
                onChange={(e) => setForm({ ...form, intergreatSheetId: e.target.value.trim() })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Sheet GID (Mặc định 0)</label>
              <input
                type="text"
                value={form.intergreatSheetGid || '0'}
                onChange={(e) => setForm({ ...form, intergreatSheetGid: e.target.value.trim() })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>


          {/* Auto Refresh Setting */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 text-xs">
              Tự Động Làm Mới Dữ Liệu (Auto-refresh)
            </label>
            <select
              value={form.autoRefreshInterval}
              onChange={(e) => setForm({ ...form, autoRefreshInterval: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value={0}>Thao tác thủ công (Tắt tự động)</option>
              <option value={1}>Mỗi 1 phút</option>
              <option value={3}>Mỗi 3 phút</option>
              <option value={5}>Mỗi 5 phút</option>
              <option value={15}>Mỗi 15 phút</option>
            </select>
          </div>

          {/* Test connection results */}
          {testResult && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 text-rose-500 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}</span>
            </button>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
            >
              Mặc định
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
