// ====================================================================
// FASTHUNT RECRUITMENT AGENT - PERSONAL ZALO RECRUITER ASSISTANT
// 100% Free Personal Zalo (Nick Thường) - Direct Chat, Templates & CV Studio
// ====================================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Briefcase,
  Users,
  Search,
  Filter,
  FileText,
  Upload,
  ExternalLink,
  Edit3,
  Check,
  X,
  Play,
  Flame,
  ShieldCheck,
  RefreshCw,
  Copy,
  TrendingUp,
  Layers,
  FileCode,
  Phone,
  UserCheck,
  Share2,
  Settings,
  Smile,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getStoredZaloConfig,
  saveZaloConfig,
  getStoredZaloMessages,
  getStoredBroadcastQueue,
  processZaloWebhookEvent,
  approveAndSendBroadcast,
  rejectBroadcast,
  createJobBroadcastDraft,
  PERSONAL_ZALO_TEMPLATES,
  openPersonalZaloChat,
  openZaloGroup,
  cleanPhoneNumber
} from '../services/zaloOaService.js';
import { extractTextFromFile } from '../services/cvExtractor.js';
import { analyzeAndMatchCv } from '../services/aiMatchingService.js';

export default function ZaloAssistantView({
  jobItems = [],
  candidates = [],
  onOpenCandidateDetail,
  onOpenEmail,
  onOpenBroadcastModal,
  onOpenAnalysisModal
}) {
  const [activeSubTab, setActiveSubTab] = useState('scripts'); // 'scripts' | 'cv_studio' | 'broadcast' | 'settings'
  const [config, setConfig] = useState(getStoredZaloConfig);
  const [messages, setMessages] = useState(getStoredZaloMessages);
  const [broadcastQueue, setBroadcastQueue] = useState(getStoredBroadcastQueue);

  // Script Generator State
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState(PERSONAL_ZALO_TEMPLATES[0].id);
  const [customPhone, setCustomPhone] = useState('');
  const [customCandidateName, setCustomCandidateName] = useState('');
  const [scriptContent, setScriptContent] = useState('');
  const [isCopiedScript, setIsCopiedScript] = useState(false);

  // CV Studio state
  const [studioCvText, setStudioCvText] = useState('');
  const [studioTargetJobId, setStudioTargetJobId] = useState(jobItems[0]?.id || '');
  const [isAnalyzingCv, setIsAnalyzingCv] = useState(false);
  const [studioAnalysisResult, setStudioAnalysisResult] = useState(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState({ ...config });
  const [isSavedSettings, setIsSavedSettings] = useState(false);

  // Find active selected candidate & active job for script generator
  const activeCandidate = useMemo(() => {
    return candidates.find(c => String(c.id) === String(selectedCandidateId)) || candidates[0] || {};
  }, [candidates, selectedCandidateId]);

  const activeJob = useMemo(() => {
    if (activeCandidate?.position) {
      const match = jobItems.find(j => j.title?.toLowerCase().includes(activeCandidate.position.toLowerCase()));
      if (match) return match;
    }
    return jobItems[0] || {};
  }, [jobItems, activeCandidate]);

  // Sync phone & name when candidate selection changes
  useEffect(() => {
    if (activeCandidate && activeCandidate.id) {
      setCustomCandidateName(activeCandidate.name || '');
      setCustomPhone(activeCandidate.phone || activeCandidate.sdt || '');
    }
  }, [activeCandidate]);

  // Auto regenerate script when template or candidate changes
  useEffect(() => {
    const template = PERSONAL_ZALO_TEMPLATES.find(t => t.id === selectedTemplateId) || PERSONAL_ZALO_TEMPLATES[0];
    const candidateData = {
      ...activeCandidate,
      name: customCandidateName || activeCandidate.name,
      phone: customPhone || activeCandidate.phone
    };
    const generated = template.generate(candidateData, activeJob, config);
    setScriptContent(generated);
  }, [selectedTemplateId, activeCandidate, activeJob, config, customCandidateName, customPhone]);

  // Handle 1-Click Copy & Open Zalo Chat
  const handleCopyAndOpenZalo = () => {
    const phoneToChat = customPhone || activeCandidate.phone || activeCandidate.sdt || '';
    openPersonalZaloChat(phoneToChat, scriptContent);
    setIsCopiedScript(true);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setIsCopiedScript(false), 2500);
  };

  // Handle Copy Only
  const handleCopyOnly = () => {
    navigator.clipboard.writeText(scriptContent);
    setIsCopiedScript(true);
    setTimeout(() => setIsCopiedScript(false), 2000);
  };

  // Handle Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updated = {
      ...settingsForm,
      zaloChatUrl: `https://zalo.me/${cleanPhoneNumber(settingsForm.zaloPhone)}`
    };
    saveZaloConfig(updated);
    setConfig(updated);
    setIsSavedSettings(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setIsSavedSettings(false), 2500);
  };

  // Handle Studio CV Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const extracted = await extractTextFromFile(file);
      setStudioCvText(extracted.text);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Execute AI Matching Studio
  const handleExecuteStudioAnalysis = async () => {
    if (!studioCvText.trim()) {
      alert('Vui lòng dán tin nhắn hoặc tải file CV để phân tích.');
      return;
    }

    setIsAnalyzingCv(true);
    try {
      const result = await analyzeAndMatchCv(studioCvText, jobItems, studioTargetJobId);
      setStudioAnalysisResult(result);
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.7 } });
      if (onOpenAnalysisModal) {
        onOpenAnalysisModal(result);
      }
    } catch (err) {
      alert('Lỗi phân tích CV: ' + err.message);
    } finally {
      setIsAnalyzingCv(false);
    }
  };

  // Broadcast handlers
  const handleApproveBroadcast = (draftId) => {
    try {
      const updated = approveAndSendBroadcast(draftId, config.recruiterName);
      setBroadcastQueue(getStoredBroadcastQueue());
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      alert(`🚀 Đã lưu tin tuyển dụng "${updated.draftTitle}". Bạn có thể mở Nhóm Zalo CTV để dán ngay!`);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleOpenGroupBroadcast = (draft) => {
    openZaloGroup(config.ctvGroupUrl, draft.draftContent);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* ── 1. Top Personal Zalo Connection Status Bar ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-[#0a3871] to-slate-950 border border-blue-400/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 specular-highlight">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/40">
                {config.recruiterName ? config.recruiterName.charAt(0).toUpperCase() : 'Z'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Sẵn sàng gửi tin Zalo" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {config.recruiterName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1">
                  <Smile className="w-3 h-3 text-blue-300" />
                  Nick Thường (Miễn Phí 100%)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Online
                </span>
              </div>
              <p className="text-xs text-blue-100/80 flex items-center gap-2 mt-0.5">
                <span>Số Zalo: <strong className="text-white font-mono">{config.zaloPhone}</strong></span>
                <span>•</span>
                <a
                  href={`https://zalo.me/${cleanPhoneNumber(config.zaloPhone)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>zalo.me/{cleanPhoneNumber(config.zaloPhone)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="https://chat.zalo.me"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-300" />
            <span>Mở Zalo Web</span>
          </a>

          <a
            href={config.ctvGroupUrl || 'https://chat.zalo.me'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-xs font-bold border border-sky-400/30 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-sky-300" />
            <span>Mở Nhóm CTV</span>
          </a>

          <button
            onClick={() => setActiveSubTab('settings')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Đổi Nick / SĐT</span>
          </button>
        </div>
      </div>

      {/* ── 2. Navigation Sub-Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('scripts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'scripts'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Kịch Bản Nhắn Tin 1-Click</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cv_studio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'cv_studio'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Bóc Tách CV từ Zalo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'broadcast'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Đẩy Job Nhóm Zalo CTV</span>
          {broadcastQueue.filter(b => b.status === 'PENDING_APPROVAL').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-500 text-white font-black">
              {broadcastQueue.filter(b => b.status === 'PENDING_APPROVAL').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Cấu Hình Nick Zalo</span>
        </button>
      </div>

      {/* ── 3. Tab 1: Kịch Bản Nhắn Tin Zalo 1-Click ── */}
      {activeSubTab === 'scripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Template Selection & Candidate Input (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Candidate Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>1. Chọn Ứng Viên Cần Nhắn</span>
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Hồ sơ ứng viên trong CRM
                </label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.position || 'UV'} ({c.phone || c.sdt || 'Chưa có SĐT'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Editable Name & Phone */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Tên ứng viên</label>
                  <input
                    type="text"
                    value={customCandidateName}
                    onChange={(e) => setCustomCandidateName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Số điện thoại / Zalo</label>
                  <input
                    type="text"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="0988123456"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Template Selector Cards */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>2. Chọn Mẫu Kịch Bản Zalo</span>
              </h3>

              <div className="space-y-2">
                {PERSONAL_ZALO_TEMPLATES.map((tmpl) => {
                  const isSelected = tmpl.id === selectedTemplateId;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-500/80 shadow-xs'
                          : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-extrabold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {tmpl.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {tmpl.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Message Preview & 1-Click Dispatch (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between h-full">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <Edit3 className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Nội Dung Tin Nhắn Gửi Zalo Cá Nhân
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Có thể chỉnh sửa trực tiếp nội dung trước khi gửi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyOnly}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {isCopiedScript ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Text</span>
                    </button>
                  </div>
                </div>

                {/* Textarea Editor */}
                <textarea
                  rows={13}
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  placeholder="Nội dung kịch bản Zalo..."
                />

                {/* Target info tag */}
                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Gửi tới: <strong>{customCandidateName || 'Ứng viên'}</strong> ({customPhone || 'Chưa nhập SĐT'})
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                    zalo.me/{cleanPhoneNumber(customPhone)}
                  </span>
                </div>
              </div>

              {/* Big Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleCopyAndOpenZalo}
                  className="w-full btn-shiny flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>🚀 1-Click Copy & Mở Chat Zalo Ứng Viên Ngay</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ── 4. Tab 2: AI Bóc Tách CV từ Tin Nhắn Zalo Cá Nhân ── */}
      {activeSubTab === 'cv_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Dán Tin Nhắn Chat / Tải CV từ Zalo
                    </h3>
                    <p className="text-xs text-slate-500">
                      AI tự động bóc tách Họ tên, SĐT, Kỹ năng và Đối soát độ phù hợp với Job
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Job Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Vị trí muốn đối soát (Job Matching)
                </label>
                <select
                  value={studioTargetJobId}
                  onChange={(e) => setStudioTargetJobId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  {jobItems.map((j) => (
                    <option key={j.id} value={j.id}>
                      [{j.company}] {j.title} (Bonus: {j.bonus || '1.875.000 ₫'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload file trigger */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tải file CV (.pdf, .docx, .txt) hoặc Paste nội dung chat
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Chọn File CV</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">hoặc dán trực tiếp vào ô dưới</span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                rows={10}
                value={studioCvText}
                onChange={(e) => setStudioCvText(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                placeholder="Ví dụ: Ứng viên Nguyễn Văn An, SĐT: 0988123456, tốt nghiệp ĐH Kiến Trúc, có 3 năm kinh nghiệm làm Sales thiết kế nội thất tại VinHomes..."
              />

              <button
                onClick={handleExecuteStudioAnalysis}
                disabled={isAnalyzingCv}
                className="w-full btn-shiny flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzingCv ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingCv ? 'Đang Phân Tích Bằng AI...' : 'Phân Tích & Đối Soát Điểm Phù Hợp'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Analysis Result */}
          <div className="lg:col-span-6 space-y-4">
            {studioAnalysisResult ? (
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        Kết Quả Thẩm Định: {studioAnalysisResult.candidate.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {studioAnalysisResult.candidate.phone} • {studioAnalysisResult.candidate.email}
                      </p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-lg">
                    {studioAnalysisResult.matchScore}% Match
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 leading-relaxed text-slate-700 dark:text-slate-300">
                    {studioAnalysisResult.aiEvaluation}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">Điểm mạnh nổi bật</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                        {studioAnalysisResult.strengths?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1">
                      <span className="font-bold text-amber-800 dark:text-amber-300">Lưu ý khi phỏng vấn</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                        {studioAnalysisResult.weaknesses?.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCustomCandidateName(studioAnalysisResult.candidate.name);
                      setCustomPhone(studioAnalysisResult.candidate.phone);
                      setActiveSubTab('scripts');
                    }}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Tạo Kịch Bản Nhắn Zalo Cho Ứng Viên Này</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Chưa Có Dữ Liệu Phân Tích
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Hãy paste đoạn chat Zalo từ ứng viên hoặc tải file CV để AI bóc tách thông tin và chấm điểm tương thích.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── 5. Tab 3: Đẩy Job Nhóm Zalo CTV (Broadcast Hub) ── */}
      {activeSubTab === 'broadcast' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Danh Sách Tin Đăng Tuyển Nhóm Zalo CTV
              </h3>
              <p className="text-xs text-slate-500">
                Soạn sẵn nội dung tuyển dụng chuẩn emoji & hoa hồng CTV, 1-click mở nhóm Zalo để dán
              </p>
            </div>

            <button
              onClick={() => onOpenBroadcastModal && onOpenBroadcastModal(jobItems[0])}
              className="btn-shiny flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>+ Soạn Tin Đẩy Job Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {broadcastQueue.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {item.company}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-mono">
                      🎁 Bonus: {item.bonusHighlight}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">
                    {item.draftTitle}
                  </h4>

                  <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                    {item.draftContent}
                  </pre>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenGroupBroadcast(item)}
                    className="flex-1 btn-shiny flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy & Mở Nhóm Zalo CTV</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.draftContent);
                      alert('Đã copy tin nhắn!');
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    title="Chỉ copy text"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. Tab 4: Cài Đặt Nick Zalo Cá Nhân ── */}
      {activeSubTab === 'settings' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Cài Đặt Nick Zalo Cá Nhân Tuyển Dụng
              </h3>
              <p className="text-xs text-slate-500">
                Thông tin này sẽ tự động điền vào các kịch bản tin nhắn và tạo link chat 1-click
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Họ Tên Recruiter / Nick Zalo hiển thị
              </label>
              <input
                type="text"
                value={settingsForm.recruiterName}
                onChange={(e) => setSettingsForm({ ...settingsForm, recruiterName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                placeholder="Huỳnh Minh Nhựt (HR FastHunt)"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Số Điện Thoại Zalo Cá Nhân (Để ứng viên / CTV chat 1-click)
              </label>
              <input
                type="text"
                value={settingsForm.zaloPhone}
                onChange={(e) => setSettingsForm({ ...settingsForm, zaloPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-blue-600 dark:text-blue-400"
                placeholder="0901234567"
                required
              />
              <p className="text-[11px] text-slate-400">
                Hệ thống tự động tạo link: <strong>https://zalo.me/{cleanPhoneNumber(settingsForm.zaloPhone)}</strong>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Link Nhóm Zalo CTV (Để 1-click mở nhóm khi đẩy Job)
              </label>
              <input
                type="text"
                value={settingsForm.ctvGroupUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, ctvGroupUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                placeholder="https://zalo.me/g/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Tên Doanh Nghiệp / Ban Tuyển Dụng
              </label>
              <input
                type="text"
                value={settingsForm.companyName}
                onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                placeholder="FASTHUNT Tuyển Dụng & Nhân Tài"
              />
            </div>

            {isSavedSettings && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Đã lưu thành công cấu hình Nick Zalo Cá Nhân!</span>
              </div>
            )}

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="btn-shiny px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all"
              >
                Lưu Cấu Hình Nick Zalo
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
