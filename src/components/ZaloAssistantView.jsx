// ====================================================================
// FASTHUNT RECRUITMENT AGENT - ZALO AI ASSISTANT EXECUTIVE VIEW
// Realtime Webhook Logs, AI CV Match Studio, CTV Push Approval Queue
// ====================================================================

import React, { useState, useMemo } from 'react';
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
  FileCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getStoredZaloConfig,
  getStoredZaloMessages,
  getStoredBroadcastQueue,
  processZaloWebhookEvent,
  approveAndSendBroadcast,
  rejectBroadcast,
  createJobBroadcastDraft
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
  const [activeSubTab, setActiveSubTab] = useState('messages'); // 'messages' | 'approval_queue' | 'cv_studio' | 'templates'
  const [messages, setMessages] = useState(getStoredZaloMessages);
  const [broadcastQueue, setBroadcastQueue] = useState(getStoredBroadcastQueue);
  const [oaConfig] = useState(getStoredZaloConfig);

  // Search & Filter state for messages
  const [msgFilterCategory, setMsgFilterCategory] = useState('ALL');
  const [msgSearchQuery, setMsgSearchQuery] = useState('');

  // CV Studio state
  const [studioCvText, setStudioCvText] = useState('');
  const [studioTargetJobId, setStudioTargetJobId] = useState(jobItems[0]?.id || '');
  const [isAnalyzingCv, setIsAnalyzingCv] = useState(false);
  const [studioAnalysisResult, setStudioAnalysisResult] = useState(null);

  // Webhook Simulator state
  const [simSenderName, setSimSenderName] = useState('Nguyễn Văn An (CTV 56718)');
  const [simContent, setSimContent] = useState('Em gửi CV ứng viên Sales tư vấn bên New Space nhé.');
  const [simAttachmentType, setSimAttachmentType] = useState('docx');
  const [isSimulating, setIsSimulating] = useState(false);

  // Metrics summary
  const pendingApprovals = useMemo(() => {
    return broadcastQueue.filter(b => b.status === 'PENDING_APPROVAL');
  }, [broadcastQueue]);

  const sentBroadcasts = useMemo(() => {
    return broadcastQueue.filter(b => b.status === 'SENT');
  }, [broadcastQueue]);

  const cvMessagesCount = useMemo(() => {
    return messages.filter(m => m.category === 'CV_NEW').length;
  }, [messages]);

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (msgFilterCategory !== 'ALL' && m.category !== msgFilterCategory) return false;
      if (msgSearchQuery) {
        const q = msgSearchQuery.toLowerCase();
        const matchSender = m.senderName && m.senderName.toLowerCase().includes(q);
        const matchContent = m.content && m.content.toLowerCase().includes(q);
        const matchSummary = m.aiSummary && m.aiSummary.toLowerCase().includes(q);
        if (!matchSender && !matchContent && !matchSummary) return false;
      }
      return true;
    });
  }, [messages, msgFilterCategory, msgSearchQuery]);

  // Handle Approve Broadcast Item (Human-in-the-Loop)
  const handleApprove = (draftId) => {
    try {
      const updated = approveAndSendBroadcast(draftId, 'Admin FastHunt');
      setBroadcastQueue(getStoredBroadcastQueue());
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      alert(`🚀 Đã duyệt và gửi thành công tin tuyển dụng "${updated.draftTitle}" qua Zalo OA!`);
    } catch (err) {
      alert('Lỗi phê duyệt: ' + err.message);
    }
  };

  // Handle Reject Broadcast Item
  const handleReject = (draftId) => {
    const reason = prompt('Nhập lý do từ chối bản tin:', 'Nội dung chưa tối ưu hoặc đã đủ ứng viên');
    if (reason !== null) {
      rejectBroadcast(draftId, reason);
      setBroadcastQueue(getStoredBroadcastQueue());
    }
  };

  // Handle Webhook Simulation
  const handleSimulateWebhook = async (e) => {
    e.preventDefault();
    if (!simContent.trim()) return;

    setIsSimulating(true);
    try {
      const eventPayload = {
        senderId: `user_${Date.now()}`,
        senderName: simSenderName,
        groupName: 'Nhóm CTV FASTHUNT Toàn Quốc',
        content: simContent,
        attachmentType: simAttachmentType,
        attachmentUrl: simAttachmentType !== 'none' ? 'https://docs.google.com/sample_cv_file' : null
      };

      const result = await processZaloWebhookEvent(eventPayload, jobItems);
      setMessages(getStoredZaloMessages());
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });

      if (result.candidateData && onOpenAnalysisModal) {
        onOpenAnalysisModal(result.candidateData);
      }
    } catch (err) {
      alert('Lỗi mô phỏng webhook: ' + err.message);
    } finally {
      setIsSimulating(false);
    }
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
      alert('Vui lòng nhập hoặc tải file CV để phân tích.');
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

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ── 1. Top Zalo OA Connection Status Bar ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-[#0c142b] to-slate-950 border border-blue-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 specular-highlight">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Zalo AI Assistant - Trợ Lý Tuyển Dụng Zalo OA</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  OA API v3 Đã Kết Nối
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Official Account: <strong>{oaConfig.oaName}</strong> • App ID: <span className="font-mono text-blue-300">{oaConfig.appId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenBroadcastModal && onOpenBroadcastModal(jobItems[0])}
            className="btn-shiny flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer transition-all"
          >
            <Flame className="w-4 h-4" />
            <span>Tạo Tin Đẩy Job Cho CTV</span>
          </button>
        </div>
      </div>

      {/* ── 2. 4 Core KPI Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Tổng tin nhắn nhận */}
        <div className="mengto-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Tin Nhắn Nhận</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {messages.length}
          </p>
          <span className="text-[11px] text-slate-500">Qua Webhook Zalo OA</span>
        </div>

        {/* Card 2: CV Đã Thẩm Định */}
        <div className="mengto-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">CV Đã Phân Tích</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {cvMessagesCount}
          </p>
          <span className="text-[11px] text-emerald-600/80 font-semibold">Tự động match điểm Job</span>
        </div>

        {/* Card 3: Chờ Phê Duyệt Đẩy Job */}
        <div className="mengto-card mengto-card-amber p-4 space-y-1">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300">
            <span className="text-xs font-bold uppercase tracking-wider">Chờ Duyệt Đẩy Job</span>
            <Clock className="w-4 h-4 text-amber-500 animate-spin-slow" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-800 dark:text-amber-300 font-mono">
            {pendingApprovals.length}
          </p>
          <span className="text-[11px] text-amber-700/80 font-bold">Cần duyệt thủ công</span>
        </div>

        {/* Card 4: Tin Tuyển Dụng Đã Gửi */}
        <div className="mengto-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Đã Phát Sóng CTV</span>
            <Send className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {sentBroadcasts.length}
          </p>
          <span className="text-[11px] text-slate-500">Mạng lưới 450+ CTV</span>
        </div>
      </div>

      {/* ── 3. Sub-Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('messages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'messages'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Nhật Ký Webhook & Tin Nhắn ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('approval_queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'approval_queue'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Hàng Đợi Duyệt Đẩy Job ({pendingApprovals.length})</span>
          {pendingApprovals.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
              {pendingApprovals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('cv_studio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'cv_studio'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Studio Thẩm Định CV & Match Điểm</span>
        </button>
      </div>

      {/* ── 4. Tab 1: Nhật Ký Tin Nhắn & Webhook Feed ── */}
      {activeSubTab === 'messages' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Controls Bar: Category Filter & Search */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'ALL', label: 'Tất Cả Tin Nhắn' },
                { id: 'CV_NEW', label: '📄 CV Mới' },
                { id: 'STATUS_UPDATE', label: '⚡ Cập Nhật Trạng Thái' },
                { id: 'SUPPORT_QUERY', label: '💬 Câu Hỏi Hỗ Trợ' },
                { id: 'OTHER', label: 'Khác' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setMsgFilterCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    msgFilterCategory === tab.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={msgSearchQuery}
                onChange={(e) => setMsgSearchQuery(e.target.value)}
                placeholder="Tìm người gửi, nội dung..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Webhook Event Stream List */}
          <div className="space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center text-slate-400 mengto-card rounded-2xl">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-bold text-sm">Chưa có tin nhắn nào trong danh mục này.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="mengto-card p-4 sm:p-5 rounded-2xl space-y-3 transition-all hover:border-blue-500/40"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                        {msg.senderName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {msg.senderName}
                          </span>
                          {msg.groupName && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-white/5">
                              {msg.groupName}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(msg.receivedAt).toLocaleTimeString('vi-VN')} - {new Date(msg.receivedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>

                    {/* Category Tag */}
                    <div className="flex items-center gap-2">
                      {msg.category === 'CV_NEW' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          📄 CV Mới Đính Kèm
                        </span>
                      )}
                      {msg.category === 'STATUS_UPDATE' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                          ⚡ Cập Nhật Kết Quả
                        </span>
                      )}
                      {msg.category === 'SUPPORT_QUERY' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          💬 Câu Hỏi Hỗ Trợ
                        </span>
                      )}
                      {msg.category === 'OTHER' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Trao Đổi Chung
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    "{msg.content}"
                  </p>

                  {/* Attachment File Box */}
                  {msg.attachmentUrl && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          File CV đính kèm ({msg.attachmentType.toUpperCase()})
                        </span>
                      </div>
                      <a
                        href={msg.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold text-[11px]"
                      >
                        <span>Mở Tệp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* AI Summary and Auto-Reply */}
                  <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/40 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>AI Tóm Tắt & Phản Hồi:</span>
                    </div>
                    <p className="text-[11.5px] text-slate-700 dark:text-slate-300">
                      {msg.aiSummary}
                    </p>
                    {msg.replyContent && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        🤖 Đã trả lời: "{msg.replyContent}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Webhook Simulator Action Panel */}
          <div className="mengto-card p-5 rounded-2xl space-y-3.5 mt-6 border-dashed border-2 border-blue-300 dark:border-blue-700/50">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500 text-white shadow-xs">
                <Play className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  Mô Phỏng Nhận Sự Kiện Webhook Zalo OA (Testing Console)
                </h4>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400">
                  Gửi thử nghiệm một tin nhắn Zalo mô phỏng để kiểm tra luồng AI Phân loại & Đối soát CV.
                </p>
              </div>
            </div>

            <form onSubmit={handleSimulateWebhook} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={simSenderName}
                  onChange={(e) => setSimSenderName(e.target.value)}
                  placeholder="Tên CTV / Khách hàng gửi"
                  className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={simAttachmentType}
                  onChange={(e) => setSimAttachmentType(e.target.value)}
                  className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">Không có file (Tin nhắn văn bản)</option>
                  <option value="docx">Đính kèm file CV (.DOCX)</option>
                  <option value="pdf">Đính kèm file CV (.PDF)</option>
                </select>

                <button
                  type="submit"
                  disabled={isSimulating}
                  className="btn-shiny px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSimulating ? 'Đang Xử Lý AI...' : 'Bắn Webhook Thử Nghiệm'}</span>
                </button>
              </div>

              <textarea
                rows={2}
                value={simContent}
                onChange={(e) => setSimContent(e.target.value)}
                placeholder="Nội dung tin nhắn nhận từ Zalo..."
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>
        </div>
      )}

      {/* ── 5. Tab 2: Hàng Đợi Phê Duyệt Đẩy Job Cho CTV (Human-in-the-Loop) ── */}
      {activeSubTab === 'approval_queue' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-amber-900 dark:text-amber-200">
                  Quy Trình Kiểm Duyệt Trước Khi Phát Sóng Zalo (Human-in-the-Loop)
                </h4>
                <p className="text-[11.5px] text-amber-700 dark:text-amber-400">
                  Mọi tin nhắn AI soạn để push job tới CTV bắt buộc phải được người dùng xác nhận và duyệt nội dung.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenBroadcastModal && onOpenBroadcastModal(jobItems[0])}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              + Soạn Tin Mới
            </button>
          </div>

          {/* Broadcast Queue List */}
          <div className="space-y-3">
            {broadcastQueue.length === 0 ? (
              <div className="p-12 text-center text-slate-400 mengto-card rounded-2xl">
                <Flame className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-bold text-sm">Hàng đợi trống. Chưa có tin đẩy job nào.</p>
              </div>
            ) : (
              broadcastQueue.map((item) => (
                <div
                  key={item.id}
                  className={`mengto-card p-5 rounded-2xl space-y-3.5 transition-all ${
                    item.status === 'PENDING_APPROVAL'
                      ? 'border-amber-400/60 dark:border-amber-500/40 bg-amber-500/5'
                      : 'border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {item.draftTitle}
                        </span>
                        {item.status === 'PENDING_APPROVAL' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-500/40 animate-pulse">
                            ⏳ CHỜ PHÊ DUYỆT
                          </span>
                        )}
                        {item.status === 'SENT' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40">
                            ✓ ĐÃ PHÁT SÓNG
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-500/40">
                            ✕ TỪ CHỐI
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Gửi tới: <strong>{item.targetGroupName}</strong> • Thưởng CTV: <span className="font-bold text-rose-600 dark:text-rose-400">{item.bonusHighlight}</span>
                      </p>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      Tạo lúc: {new Date(item.createdAt).toLocaleTimeString('vi-VN')} {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Pre-formatted Message Content */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {item.draftContent}
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {item.status === 'SENT' ? `Đã gửi tới ${item.recipientsCount} CTV qua Zalo OA` : 'Kiểm tra nội dung trước khi duyệt phát sóng.'}
                    </span>

                    {item.status === 'PENDING_APPROVAL' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 text-xs font-bold cursor-pointer transition-colors"
                        >
                          Từ Chối
                        </button>

                        <button
                          onClick={() => onOpenBroadcastModal && onOpenBroadcastModal(jobItems.find(j => j.id === item.jobId), item)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                        >
                          Chỉnh Sửa
                        </button>

                        <button
                          onClick={() => handleApprove(item.id)}
                          className="btn-shiny flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Duyệt & Phát Sóng Zalo Ngay</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── 6. Tab 3: Studio Thẩm Định CV AI & Match Điểm ── */}
      {activeSubTab === 'cv_studio' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Input Form Column (1/3) */}
            <div className="mengto-card p-5 space-y-4 rounded-3xl">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500 text-white shadow-xs">
                  <Upload className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Nạp Hồ Sơ CV Cần Thẩm Định
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tải Lên Tệp CV (PDF / DOCX / TXT)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-300 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Đối Soát Với Vị Trí Cụ Thể (Tùy Chọn)
                </label>
                <select
                  value={studioTargetJobId}
                  onChange={(e) => setStudioTargetJobId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- AI Tự Tìm Job Phù Hợp Nhất --</option>
                  {jobItems.map((j) => (
                    <option key={j.id} value={j.id}>
                      [{j.company}] {j.title} (Bonus: {j.bonus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nội Dung Văn Bản CV (Trích Xuất Hoặc Dán Trực Tiếp)
                </label>
                <textarea
                  rows={8}
                  value={studioCvText}
                  onChange={(e) => setStudioCvText(e.target.value)}
                  placeholder="Dán nội dung tóm tắt kinh nghiệm, kỹ năng của ứng viên tại đây..."
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleExecuteStudioAnalysis}
                disabled={isAnalyzingCv}
                className="btn-shiny w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzingCv ? 'Đang Phân Tích & Match Điểm...' : 'Bắt Đầu Thẩm Định AI'}</span>
              </button>
            </div>

            {/* Results Column (2/3) */}
            <div className="lg:col-span-2 space-y-4">
              {studioAnalysisResult ? (
                <div className="mengto-card p-6 rounded-3xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                        Kết Quả Thẩm Định Hoàn Tất
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {studioAnalysisResult.candidate.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {studioAnalysisResult.candidate.phone || 'Chưa rõ SĐT'} • {studioAnalysisResult.candidate.email || 'Chưa rõ email'} • {studioAnalysisResult.candidate.experienceYears} năm KN
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 min-w-[90px]">
                      <span className="text-3xl font-black font-mono">{studioAnalysisResult.matchScore}%</span>
                      <span className="text-[10px] font-bold uppercase">Điểm Match</span>
                    </div>
                  </div>

                  {/* Matched Job */}
                  {studioAnalysisResult.matchedJob && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 border border-indigo-500/20 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Vị Trí Đề Xuất Phù Hợp Nhất</span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        {studioAnalysisResult.matchedJob.title} - {studioAnalysisResult.matchedJob.company}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Mức lương: {studioAnalysisResult.matchedJob.salary} • 🎁 Bonus CTV: <strong className="text-rose-600 dark:text-rose-400">{studioAnalysisResult.matchedJob.bonus}</strong>
                      </p>
                    </div>
                  )}

                  {/* AI Evaluation */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {studioAnalysisResult.aiEvaluation}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block">✓ Điểm Mạnh:</span>
                      <ul className="space-y-1 text-[11.5px]">
                        {studioAnalysisResult.strengths.map((s, i) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold text-amber-800 dark:text-amber-300 block">⚠ Điểm Cần Lưu Ý:</span>
                      <ul className="space-y-1 text-[11.5px]">
                        {studioAnalysisResult.weaknesses.map((w, i) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center text-slate-400 mengto-card rounded-3xl space-y-2">
                  <Sparkles className="w-10 h-10 mx-auto text-indigo-400 opacity-60 animate-bounce-subtle" />
                  <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                    Sẵn Sàng Thẩm Định Hồ Sơ Ứng Viên
                  </h4>
                  <p className="text-xs max-w-md mx-auto">
                    Tải file CV hoặc dán nội dung ở cột bên trái và bấm "Bắt Đầu Thẩm Định AI" để chấm điểm tương thích với 37+ vị trí tuyển dụng.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
