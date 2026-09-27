// ====================================================================
// FASTHUNT RECRUITMENT AGENT - PERSONAL ZALO & ADMIN AGENT ASSISTANT
// 2 Core Admin Functions:
// 1. Post tin chung về job lên Group chung ("Nhóm CTV FASTHUNT" - 196 thành viên)
// 2. Add fen & Nhắn job cho từng thành viên kèm Anti-Spam Delay Controller
// ====================================================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Pause,
  Square,
  Flame,
  ShieldCheck,
  RefreshCw,
  Copy,
  TrendingUp,
  Layers,
  FileCode,
  Phone,
  UserCheck,
  UserPlus,
  Share2,
  Settings,
  Smile,
  QrCode,
  Sliders,
  Gift
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
import {
  getStoredZcaConfig,
  saveZcaConfig,
  getStoredZcaLogs,
  addZcaLog,
  formatZcaJobPitch,
  formatGroupBroadcastPost,
  formatPersonalMemberPitch,
  calculateAntiSpamDelay,
  FASTHUNT_GROUP_MEMBERS,
  sendZcaJobMessage,
  generateZcaNodeRunnerCode,
  FASTHUNT_SUBMIT_FORM_URL,
  FASTHUNT_WEB_URL,
  ZCA_DOCS_URL
} from '../services/zcaBotService.js';

export default function ZaloAssistantView({
  jobItems = [],
  candidates = [],
  onOpenCandidateDetail,
  onOpenEmail,
  onOpenBroadcastModal,
  onOpenAnalysisModal
}) {
  const [activeSubTab, setActiveSubTab] = useState('group_broadcast'); // 'group_broadcast' | 'member_outreach' | 'scripts' | 'cv_studio' | 'settings'
  const [config, setConfig] = useState(getStoredZaloConfig);
  const [zcaConfig, setZcaConfig] = useState(getStoredZcaConfig);
  const [zcaLogs, setZcaLogs] = useState(getStoredZcaLogs);

  // ── Chức Năng 1: Post Tin Chung Group State ──
  const [groupCustomAnnouncement, setGroupCustomAnnouncement] = useState(
    '@All Team ơi mình mới lên job Và các job gấp thưởng ngay 50k cv đi pv:'
  );
  const [selectedGroupJobIds, setSelectedGroupJobIds] = useState([]);
  const [groupPostContent, setGroupPostContent] = useState('');
  const [isCopiedGroupPost, setIsCopiedGroupPost] = useState(false);
  const [isPostingGroup, setIsPostingGroup] = useState(false);

  // ── Chức Năng 2: Add Fen & Nhắn Tin 1-1 Chống Spam State ──
  const [membersList, setMembersList] = useState(FASTHUNT_GROUP_MEMBERS);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedMemberForPitch, setSelectedMemberForPitch] = useState(FASTHUNT_GROUP_MEMBERS[0]);
  const [outreachTargetJobId, setOutreachTargetJobId] = useState(jobItems[0]?.id || '');
  const [minDelaySec, setMinDelaySec] = useState(15);
  const [maxDelaySec, setMaxDelaySec] = useState(35);
  const [enableJitter, setEnableJitter] = useState(true);
  const [enableSpintax, setEnableSpintax] = useState(true);

  // Queue runner state
  const [outreachStatus, setOutreachStatus] = useState('IDLE'); // 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED'
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [countdownSec, setCountdownSec] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [addedFriendCount, setAddedFriendCount] = useState(0);

  const timerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Script Generator State (Nick thường)
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

  // Initialize selected jobs for group post
  useEffect(() => {
    if (jobItems.length > 0 && selectedGroupJobIds.length === 0) {
      setSelectedGroupJobIds(jobItems.slice(0, 3).map(j => j.id));
    }
  }, [jobItems]);

  // Generate Group Post content when selection or announcement changes
  useEffect(() => {
    const selectedJobs = jobItems.filter(j => selectedGroupJobIds.includes(j.id));
    const generated = formatGroupBroadcastPost(selectedJobs, groupCustomAnnouncement, {
      adminName: config.recruiterName || 'Huỳnh Minh Nhựt',
      webUrl: FASTHUNT_WEB_URL,
      formUrl: FASTHUNT_SUBMIT_FORM_URL
    });
    setGroupPostContent(generated);
  }, [selectedGroupJobIds, groupCustomAnnouncement, jobItems, config.recruiterName]);

  // Selected Outreach Job
  const selectedOutreachJob = useMemo(() => {
    return jobItems.find(j => String(j.id) === String(outreachTargetJobId)) || jobItems[0] || {
      title: 'Junior UA & Middle UA (Tuyển gấp)',
      salary: '13-25 triệu',
      bonus: 'hh 35% - 40% lương uv',
      warrantyPeriod: '60 ngày'
    };
  }, [jobItems, outreachTargetJobId]);

  // Preview Pitch for Selected Member
  const memberPitchPreview = useMemo(() => {
    if (!selectedMemberForPitch) return '';
    return formatPersonalMemberPitch(selectedMemberForPitch, selectedOutreachJob, {
      adminName: config.recruiterName || 'Huỳnh Minh Nhựt (Trưởng cộng đồng)',
      webUrl: FASTHUNT_WEB_URL,
      formUrl: FASTHUNT_SUBMIT_FORM_URL
    });
  }, [selectedMemberForPitch, selectedOutreachJob, config.recruiterName]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    if (!memberSearchTerm) return membersList;
    const term = memberSearchTerm.toLowerCase();
    return membersList.filter(m => m.name.toLowerCase().includes(term) || (m.phone && m.phone.includes(term)));
  }, [membersList, memberSearchTerm]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // ── Engine: Outreach Step Processor ──
  const processNextMember = (index) => {
    if (index >= membersList.length) {
      setOutreachStatus('COMPLETED');
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      alert('🎉 Đã hoàn thành gửi Job và kết bạn cho toàn bộ thành viên trong nhóm CTV FASTHUNT!');
      return;
    }

    const member = membersList[index];
    setSelectedMemberForPitch(member);

    // Calculate next anti-spam delay
    const delay = calculateAntiSpamDelay(minDelaySec, maxDelaySec, enableJitter);
    setCountdownSec(delay.seconds);

    // Start countdown ticker
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setCountdownSec((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Schedule actual dispatch
    timerRef.current = setTimeout(() => {
      // Mark member as processed
      setMembersList((prevList) => {
        const updated = [...prevList];
        updated[index] = {
          ...updated[index],
          status: 'FRIEND_REQUESTED',
          lastContact: 'Vừa gửi qua Bot'
        };
        return updated;
      });

      setCompletedCount((prev) => prev + 1);
      setAddedFriendCount((prev) => prev + 1);

      // Add to log
      addZcaLog({
        jobTitle: selectedOutreachJob.title,
        company: selectedOutreachJob.company || 'FastHunt Partner',
        target: `${member.name} (${member.phone || 'Thành viên'})`,
        targetType: 'USER_OUTREACH',
        status: 'SUCCESS',
        messageSnippet: `Đã kết bạn & nhắn job: ${selectedOutreachJob.title}`
      });
      setZcaLogs(getStoredZcaLogs());

      // Next member
      setCurrentMemberIndex(index + 1);
      processNextMember(index + 1);
    }, delay.ms);
  };

  // Start Batch Outreach
  const handleStartOutreach = () => {
    if (membersList.length === 0) return;
    setOutreachStatus('RUNNING');
    processNextMember(currentMemberIndex);
  };

  // Pause Outreach
  const handlePauseOutreach = () => {
    setOutreachStatus('PAUSED');
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  // Resume Outreach
  const handleResumeOutreach = () => {
    setOutreachStatus('RUNNING');
    processNextMember(currentMemberIndex);
  };

  // Stop Outreach
  const handleStopOutreach = () => {
    setOutreachStatus('IDLE');
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setCurrentMemberIndex(0);
    setCountdownSec(0);
  };

  // 1-Click Single Member Outreach
  const handleSendSingleMember = (member, idx) => {
    setSelectedMemberForPitch(member);
    const pitch = formatPersonalMemberPitch(member, selectedOutreachJob, {
      adminName: config.recruiterName || 'Huỳnh Minh Nhựt',
      webUrl: FASTHUNT_WEB_URL,
      formUrl: FASTHUNT_SUBMIT_FORM_URL
    });

    if (member.phone) {
      openPersonalZaloChat(member.phone, pitch);
    } else {
      navigator.clipboard.writeText(pitch);
      alert(`Đã copy tin nhắn riêng gửi ${member.name}! Hãy dán vào chat Zalo.`);
    }

    setMembersList((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status: 'FRIEND_REQUESTED', lastContact: 'Vừa gửi 1-1' };
      return updated;
    });
    setCompletedCount((prev) => prev + 1);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  // Handle Post Group Broadcast
  const handlePostToGroup = async () => {
    setIsPostingGroup(true);
    try {
      await sendZcaJobMessage({
        job: { title: 'Tổng hợp Job Hot & Gấp', company: 'Nhóm CTV FASTHUNT' },
        target: { id: 'g_fasthunt_main', name: 'Nhóm CTV FASTHUNT (196 thành viên)' },
        targetType: 'GROUP',
        customPitch: groupPostContent,
        config: zcaConfig
      });
      setZcaLogs(getStoredZcaLogs());
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.7 } });
      alert('🚀 [Zalo Admin Agent] Đã phát thành công tin tổng hợp Job lên Nhóm CTV FASTHUNT!');
    } catch (err) {
      alert('Lỗi đăng tin: ' + err.message);
    } finally {
      setIsPostingGroup(false);
    }
  };

  const handleCopyGroupPost = () => {
    navigator.clipboard.writeText(groupPostContent);
    setIsCopiedGroupPost(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setIsCopiedGroupPost(false), 2000);
  };

  // Toggle Job selection for group post
  const toggleGroupJobSelection = (jobId) => {
    setSelectedGroupJobIds((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  // Candidate Script Selector helpers
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

  useEffect(() => {
    if (activeCandidate && activeCandidate.id) {
      setCustomCandidateName(activeCandidate.name || '');
      setCustomPhone(activeCandidate.phone || activeCandidate.sdt || '');
    }
  }, [activeCandidate]);

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

  const handleCopyAndOpenZalo = () => {
    const phoneToChat = customPhone || activeCandidate.phone || activeCandidate.sdt || '';
    openPersonalZaloChat(phoneToChat, scriptContent);
    setIsCopiedScript(true);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setIsCopiedScript(false), 2500);
  };

  const handleCopyOnly = () => {
    navigator.clipboard.writeText(scriptContent);
    setIsCopiedScript(true);
    setTimeout(() => setIsCopiedScript(false), 2000);
  };

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

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* ── 1. Top FastHunt Community Hero Bar (Matches screenshot) ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-[#0a3871] to-slate-950 border border-blue-400/30 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/40">
                FH
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Admin Bot Active" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Nhóm CTV FASTHUNT
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1">
                  <Users className="w-3 h-3 text-sky-300" />
                  Cộng đồng • 196 thành viên
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Gift className="w-3 h-3 text-amber-300" />
                  Thưởng nóng 50k/CV pv
                </span>
              </div>
              <p className="text-xs text-blue-100/80 flex items-center gap-2 mt-0.5 flex-wrap">
                <span>Quản trị viên: <strong className="text-white font-bold">{config.recruiterName || 'Huỳnh Minh Nhựt (Trưởng cộng đồng)'}</strong></span>
                <span>•</span>
                <span>Phó cộng đồng: <strong className="text-sky-300">Thảoo</strong></span>
                <span>•</span>
                <a
                  href={FASTHUNT_WEB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>crmhiring.netlify.app</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Top Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap relative z-10">
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
            href={FASTHUNT_SUBMIT_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-400/30 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>Form Gửi CV</span>
          </a>

          <a
            href={ZCA_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/30 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-300" />
            <span>zca-js GitBook</span>
          </a>
        </div>
      </div>

      {/* ── 2. Navigation Sub-Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('group_broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'group_broadcast'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span>1. Post Tin Chung Lên Group (@All)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('member_outreach')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'member_outreach'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>2. Add Fen & Nhắn Job 1-1 (Chống Spam)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-black">
            196 UV
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('scripts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'scripts'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Kịch Bản Nhắn Tin Ứng Viên CRM</span>
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
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Cấu Hình Zalo & Bot</span>
        </button>
      </div>

      {/* ── 3. CHỨC NĂNG 1: POST TIN CHUNG VỀ JOB GROUP CHUNG (@All) ── */}
      {activeSubTab === 'group_broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Left Column: Job Selector & Announcement Setup (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                    <Flame className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      1. Chọn Job Tuyển Gấp Đẩy Group
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Tự động gộp danh sách kèm Lương, Hoa Hồng, Thưởng Nóng 50k & JD
                    </p>
                  </div>
                </div>
              </div>

              {/* Announcement Header input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tiêu đề thông báo (@All)
                </label>
                <input
                  type="text"
                  value={groupCustomAnnouncement}
                  onChange={(e) => setGroupCustomAnnouncement(e.target.value)}
                  placeholder="@All Team ơi mình mới lên job..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Job Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Chọn các vị trí muốn đưa vào tin đăng:
                </label>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {jobItems.map((job, idx) => {
                    const isSelected = selectedGroupJobIds.includes(job.id);
                    return (
                      <div
                        key={job.id || idx}
                        onClick={() => toggleGroupJobSelection(job.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/70 shadow-xs'
                            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Handled by div click
                              className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                                {idx + 1}. {job.title}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Lương: <strong className="text-slate-800 dark:text-slate-200">{job.salary || '15-25 triệu'}</strong> • BH: {job.warrantyPeriod || '60 ngày'}
                              </p>
                              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                                🎁 {job.bonus || 'hh 35% - 40% lương uv'}
                              </p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-500" />
                  <span>Chính sách thưởng nóng CTV FastHunt:</span>
                </p>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Thưởng ngay <strong>50.000₫ / CV</strong> đạt yêu cầu đủ điều kiện đi phỏng vấn + Hoa hồng từ 30% - 40% lương khi ứng viên onboard!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Group Post Preview & Action Dispatch (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between h-full">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                      <Send className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Nội Dung Đăng Group "Nhóm CTV FASTHUNT"
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Chuẩn văn phong Admin, có link Google Form gửi CV & link Web Dashboard
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyGroupPost}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {isCopiedGroupPost ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedGroupPost ? 'Đã Copy!' : 'Copy Tin'}</span>
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  rows={14}
                  value={groupPostContent}
                  onChange={(e) => setGroupPostContent(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40">
                    <p className="text-[11px] text-slate-500">Link Web CTV:</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400 font-mono text-xs truncate">
                      {FASTHUNT_WEB_URL}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
                    <p className="text-[11px] text-slate-500">Link Form Gửi CV:</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs truncate">
                      {FASTHUNT_SUBMIT_FORM_URL}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handlePostToGroup}
                  disabled={isPostingGroup}
                  className="w-full sm:flex-1 btn-shiny flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{isPostingGroup ? 'Đang Đăng Tin...' : '📢 POST TIN LÊN NHÓM CTV FASTHUNT (zca-js)'}</span>
                </button>

                <a
                  href={config.ctvGroupUrl || 'https://chat.zalo.me'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleCopyGroupPost}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-sky-500" />
                  <span>Mở Zalo Dán Ngay</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ── 4. CHỨC NĂNG 2: ADD FEN & NHẮN JOB 1-1 CHỐNG SPAM ── */}
      {activeSubTab === 'member_outreach' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Anti-Spam Control & Progress Top Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 text-white shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </span>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">
                    Hệ Thống Tự Động Kết Bạn & Nhắn Tin 1-1 (Anti-Spam Delay Engine)
                  </h3>
                </div>
                <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
                  Tự động gửi lời mời kết bạn ("Add fen") và gửi kịch bản Job 1-1 cho 196 thành viên trong <strong>Nhóm CTV FASTHUNT</strong> với khoảng delay ngẫu nhiên kèm SpinTax để không bị Zalo đánh dấu spam hay khóa nick.
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {outreachStatus === 'IDLE' && (
                  <button
                    onClick={handleStartOutreach}
                    className="btn-shiny flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/25 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Bắt Đầu Gửi & Kết Bạn Hàng Loạt</span>
                  </button>
                )}

                {outreachStatus === 'RUNNING' && (
                  <button
                    onClick={handlePauseOutreach}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer"
                  >
                    <Pause className="w-4 h-4 fill-slate-950" />
                    <span>Tạm Dừng</span>
                  </button>
                )}

                {outreachStatus === 'PAUSED' && (
                  <button
                    onClick={handleResumeOutreach}
                    className="btn-shiny flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Tiếp Tục Chạy</span>
                  </button>
                )}

                {outreachStatus !== 'IDLE' && (
                  <button
                    onClick={handleStopOutreach}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Hủy Bỏ</span>
                  </button>
                )}
              </div>
            </div>

            {/* Anti-Spam Parameter Sliders */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-indigo-900/60 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 text-[11px]">Delay tối thiểu:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={minDelaySec}
                    onChange={(e) => setMinDelaySec(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                  />
                  <span className="text-xs font-bold text-sky-400">giây</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 text-[11px]">Delay tối đa:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={120}
                    value={maxDelaySec}
                    onChange={(e) => setMaxDelaySec(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                  />
                  <span className="text-xs font-bold text-sky-400">giây</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 text-[11px]">Dao động ngẫu nhiên:</span>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={enableJitter}
                    onChange={(e) => setEnableJitter(e.target.checked)}
                    className="rounded text-indigo-500 focus:ring-indigo-400"
                  />
                  <span className="font-bold text-slate-200">Random Jitter (±3s)</span>
                </label>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 text-[11px]">Biến thể SpinTax:</span>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={enableSpintax}
                    onChange={(e) => setEnableSpintax(e.target.checked)}
                    className="rounded text-indigo-500 focus:ring-indigo-400"
                  />
                  <span className="font-bold text-emerald-400">Đổi từ chống trùng lặp</span>
                </label>
              </div>
            </div>

            {/* Live Progress Bar & Countdown Ticker */}
            {outreachStatus !== 'IDLE' && (
              <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-500/40 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>
                      Đang xử lý: <strong className="text-white">{selectedMemberForPitch?.name || 'Đang nạp'}</strong> ({currentMemberIndex + 1}/{membersList.length})
                    </span>
                  </div>

                  {countdownSec > 0 ? (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold animate-pulse">
                      ⏳ Đang delay chống spam: {countdownSec}s
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                      🚀 Đang gửi...
                    </span>
                  )}
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.round((completedCount / membersList.length) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Tiến độ: {Math.round((completedCount / membersList.length) * 100)}%</span>
                  <span>Đã kết bạn & nhắn tin: {completedCount} / {membersList.length} thành viên</span>
                </div>
              </div>
            )}

          </div>

          {/* Members List & Interactive 1-1 Dispatch Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: 196 FastHunt Group Members Table (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                      <Users className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        Danh Sách Thành Viên Nhóm CTV FASTHUNT (196)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Chỉ trưởng/phó cộng đồng xem được đầy đủ danh sách
                      </p>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      placeholder="Tìm thành viên..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 w-48"
                    />
                  </div>
                </div>

                {/* Member Rows */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto pr-1">
                  {filteredMembers.map((member, idx) => {
                    const isSelected = selectedMemberForPitch?.id === member.id;
                    return (
                      <div
                        key={member.id || idx}
                        onClick={() => setSelectedMemberForPitch(member)}
                        className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-400/60'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {member.name}
                              </p>
                              <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {member.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {member.phone || 'Chưa kết bạn'} • {member.lastContact || 'Chưa gửi'}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {member.status === 'FRIEND' ? (
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Bạn bè</span>
                            </span>
                          ) : member.status === 'FRIEND_REQUESTED' ? (
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Đã gửi tin</span>
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendSingleMember(member, idx);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Kết bạn</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Right: Job Picker & Live Spintax Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Chọn Job Gửi 1-1 Cho Thành Viên
                  </label>
                  <select
                    value={outreachTargetJobId}
                    onChange={(e) => setOutreachTargetJobId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    {jobItems.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} — Lương {j.salary || '15-25tr'} ({j.bonus || 'hh 35%'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Member Info */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500">Người nhận xem trước:</span>
                    <p className="font-extrabold text-indigo-900 dark:text-indigo-200">
                      {selectedMemberForPitch?.name || 'Chưa chọn'} ({selectedMemberForPitch?.phone || '09xxx'})
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Spintax Random
                  </span>
                </div>

                {/* Pitch preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Xem trước tin nhắn 1-1 đã biến thể:
                    </label>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(memberPitchPreview);
                        alert('Đã copy tin nhắn riêng!');
                      }}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy text</span>
                    </button>
                  </div>

                  <pre className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                    {memberPitchPreview}
                  </pre>
                </div>

                {/* Direct 1-Click Send Button */}
                <button
                  onClick={() => {
                    const idx = membersList.findIndex(m => m.id === selectedMemberForPitch.id);
                    handleSendSingleMember(selectedMemberForPitch, idx >= 0 ? idx : 0);
                  }}
                  className="w-full btn-shiny flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>🚀 Add Fen & Gửi Tin Cho {selectedMemberForPitch?.name || 'Thành Viên Này'}</span>
                </button>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ── 5. Tab Kịch Bản Nhắn Tin Ứng Viên CRM ── */}
      {activeSubTab === 'scripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          <div className="lg:col-span-5 space-y-4">
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

                  <button
                    onClick={handleCopyOnly}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {isCopiedScript ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Text</span>
                  </button>
                </div>

                <textarea
                  rows={13}
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  placeholder="Nội dung kịch bản Zalo..."
                />

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

      {/* ── 6. Tab AI Bóc Tách CV từ Zalo ── */}
      {activeSubTab === 'cv_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
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

              <textarea
                rows={10}
                value={studioCvText}
                onChange={(e) => setStudioCvText(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                placeholder="Ví dụ: Ứng viên Nguyễn Văn An, SĐT: 0988123456, tốt nghiệp ĐH Kiến Trúc, có 3 năm kinh nghiệm làm Sales..."
              />

              <button
                onClick={handleExecuteStudioAnalysis}
                disabled={isAnalyzingCv}
                className="w-full btn-shiny flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzingCv ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingCv ? 'Đang Phân Tích Bằng AI...' : 'Phân Tích & Chấm Điểm Phù Hợp'}</span>
              </button>
            </div>
          </div>

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
                        Kết Quả: {studioAnalysisResult.candidate.name}
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

      {/* ── 7. Tab Cài Đặt Nick Zalo ── */}
      {activeSubTab === 'settings' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 animate-fade-in">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Cài Đặt Nick Zalo & Nhóm FastHunt
              </h3>
              <p className="text-xs text-slate-500">
                Thông tin này sẽ tự động áp dụng vào các kịch bản phát tin bot và 1-click chat
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Họ Tên Recruiter / Trưởng Cộng Đồng Zalo
              </label>
              <input
                type="text"
                value={settingsForm.recruiterName}
                onChange={(e) => setSettingsForm({ ...settingsForm, recruiterName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                placeholder="Huỳnh Minh Nhựt (Trưởng cộng đồng FASTHUNT)"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Số Điện Thoại Zalo Cá Nhân
              </label>
              <input
                type="text"
                value={settingsForm.zaloPhone}
                onChange={(e) => setSettingsForm({ ...settingsForm, zaloPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-blue-600 dark:text-blue-400"
                placeholder="0901234567"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Link Nhóm Zalo CTV FASTHUNT
              </label>
              <input
                type="text"
                value={settingsForm.ctvGroupUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, ctvGroupUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                placeholder="https://zalo.me/g/..."
              />
            </div>

            {isSavedSettings && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Đã lưu thành công cấu hình Nick Zalo!</span>
              </div>
            )}

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="btn-shiny px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all"
              >
                Lưu Cấu Hình
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
