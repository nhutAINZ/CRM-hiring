import React, { useState, useEffect } from 'react';
import { X, Save, Database, ExternalLink, RefreshCw, Check, AlertCircle, Network, Cpu, Sliders } from 'lucide-react';
import { DEFAULT_CONFIG, saveStoredConfig, getCsvUrl } from '../services/sheetsService';
import {
  PRESET_9ROUTER_ENDPOINTS,
  POPULAR_9ROUTER_MODELS,
  get9RouterConfig,
  save9RouterConfig,
  test9RouterConnection
} from '../services/nineRouterService';

export default function SettingsModal({ config, onSaveConfig, onClose, onRefreshData }) {
  const [activeTab, setActiveTab] = useState('sheets'); // 'sheets' | '9router'
  const [form, setForm] = useState({ ...config });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // 9Router Settings State
  const [routerForm, setRouterForm] = useState(get9RouterConfig);
  const [routerTesting, setRouterTesting] = useState(false);
  const [routerResult, setRouterResult] = useState(null);

  const handleSave = () => {
    saveStoredConfig(form);
    save9RouterConfig(routerForm);
    onSaveConfig(form);
    if (onRefreshData) onRefreshData();
    onClose();
  };

  const handleReset = () => {
    if (activeTab === 'sheets') {
      setForm({ ...DEFAULT_CONFIG });
    } else {
      setRouterForm({
        enabled: true,
        endpoint: 'http://localhost:20128/v1',
        apiKey: '9router-default-key',
        model: 'auto',
        temperature: 0.7,
        maxTokens: 2048,
        tokenSaver: true,
        autoFailover: true,
        timeoutMs: 15000
      });
    }
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

  const handleTest9Router = async () => {
    setRouterTesting(true);
    setRouterResult(null);
    try {
      const res = await test9RouterConnection(routerForm);
      setRouterResult(res);
    } catch (e) {
      setRouterResult({
        success: false,
        message: `Lỗi kết nối 9Router: ${e.message}`
      });
    } finally {
      setRouterTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              {activeTab === 'sheets' ? <Database className="w-5 h-5" /> : <Network className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Cài Đặt Hệ Thống FastHunt</h2>
              <p className="text-xs text-slate-400">Google Sheets Data & 9Router AI Proxy Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'sheets'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Google Sheets Sync</span>
          </button>
          <button
            onClick={() => setActiveTab('9router')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === '9router'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>9Router AI Gateway</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs max-h-[65vh] overflow-y-auto">
          {/* TAB 1: GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <>
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

              {/* Job Sheet Settings */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="text-xs">Google Sheet Danh Sách Job &amp; Vị Trí Tuyển Dụng</span>
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
            </>
          )}

          {/* TAB 2: 9ROUTER CONFIGURATION */}
          {activeTab === '9router' && (
            <div className="space-y-4">
              {/* Presets */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Chọn Cổng Kết Nối 9Router Presets:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {PRESET_9ROUTER_ENDPOINTS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setRouterForm({ ...routerForm, endpoint: p.endpoint })}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        routerForm.endpoint === p.endpoint
                          ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{p.label}</span>
                        {routerForm.endpoint === p.endpoint && (
                          <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {p.endpoint || 'Tùy chỉnh Endpoint...'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Endpoint Input */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">9Router Base Endpoint URL</label>
                  <input
                    type="text"
                    value={routerForm.endpoint}
                    onChange={(e) => setRouterForm({ ...routerForm, endpoint: e.target.value.trim() })}
                    placeholder="http://localhost:20128/v1"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">API Key (hoặc mặc định 9router)</label>
                  <input
                    type="password"
                    value={routerForm.apiKey}
                    onChange={(e) => setRouterForm({ ...routerForm, apiKey: e.target.value })}
                    placeholder="9router-default-key"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Default Routing Model</label>
                  <select
                    value={routerForm.model}
                    onChange={(e) => setRouterForm({ ...routerForm, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {POPULAR_9ROUTER_MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Toggles */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={routerForm.tokenSaver}
                      onChange={(e) => setRouterForm({ ...routerForm, tokenSaver: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Kích hoạt RTK Token Saver (Nén token giảm chi phí 30%)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={routerForm.autoFailover}
                      onChange={(e) => setRouterForm({ ...routerForm, autoFailover: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Tự động Failover thông minh khi provider nghẽn</span>
                  </label>
                </div>
              </div>

              {/* 9Router Ping Result */}
              {routerResult && (
                <div
                  className={`p-3.5 rounded-2xl text-xs flex items-start gap-2 ${
                    routerResult.success
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {routerResult.success ? (
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 text-rose-500 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold">{routerResult.success ? `Kết nối 9Router thành công (${routerResult.latency}ms)` : 'Kết nối thất bại'}</div>
                    <div className="mt-0.5">{routerResult.message}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {activeTab === 'sheets' ? (
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối Sheet'}</span>
              </button>
            ) : (
              <button
                onClick={handleTest9Router}
                disabled={routerTesting}
                className="px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-800/60 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${routerTesting ? 'animate-spin' : ''}`} />
                <span>{routerTesting ? 'Đang dò ping 9Router...' : 'Kiểm tra kết nối 9Router'}</span>
              </button>
            )}

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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
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
