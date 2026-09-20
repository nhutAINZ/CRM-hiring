import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  Send,
  RefreshCw,
  Copy,
  Check,
  Flame,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  Play,
  ArrowRight,
  TrendingUp,
  Settings,
  Scale,
  MessageSquare,
  Search,
  ExternalLink,
  ChevronRight,
  Sliders,
  Award,
  Layers,
  FileText,
  Mail,
  Share2,
  Cpu,
  Radio,
  Network
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  AGENT_REGISTRY,
  runSupervisorSwarm,
  runBatchCandidateScreening,
  runCandidateDebate,
  runPipelineSlaAudit,
  getStoredAgentConfig,
  saveAgentConfig
} from '../services/multiAgentEngine';
import {
  PRESET_9ROUTER_ENDPOINTS,
  POPULAR_9ROUTER_MODELS,
  test9RouterConnection,
  get9RouterConfig,
  save9RouterConfig
} from '../services/nineRouterService';

export default function MultiAgentHubView({
  candidates = [],
  jobItems = [],
  ctvItems = [],
  onOpenEmail,
  onOpenDetail,
  onOpenJobDetail,
  onOpenBroadcast,
  darkMode = false
}) {
  const [activeTab, setActiveTab] = useState('console'); // 'console' | 'batch' | 'debate' | 'audit' | 'settings'
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Settings state
  const [config, setConfig] = useState(getStoredAgentConfig);
  const [configSaved, setConfigSaved] = useState(false);

  // 9Router Live Status State
  const [routerConfig, setRouterConfig] = useState(get9RouterConfig);
  const [routerStatus, setRouterStatus] = useState({
    tested: false,
    loading: false,
    success: false,
    latency: 0,
    message: '',
    models: []
  });

  const checkRouterHealth = async (customCfg = null) => {
    setRouterStatus(prev => ({ ...prev, loading: true }));
    const targetCfg = customCfg || routerConfig;
    const res = await test9RouterConnection(targetCfg);
    setRouterStatus({
      tested: true,
      loading: false,
      success: res.success,
      latency: res.latency,
      message: res.message,
      models: res.models || []
    });
  };

  useEffect(() => {
    checkRouterHealth();
  }, []);

  // 1. Swarm Console State
  const [promptInput, setPromptInput] = useState('');
  const [swarmSteps, setSwarmSteps] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'init-msg',
      sender: 'supervisor',
      text: `### 👋 Chào mừng bạn đến với FastHunt Multi-Agent Swarm Hub!
Hệ thống tuyển dụng đa tác nhân tự hành (Autonomous Multi-Agent Swarm) đã sẵn sàng phối hợp cùng bạn:
- 🎯 **Screener Agent**: Trích xuất kỹ năng & chấm điểm độ phù hợp JD.
- 📅 **Scheduler Agent**: Soạn thư mời, đề xuất khung giờ & điều phối phỏng vấn.
- 📈 **SLA Auditor Agent**: Bắt nghẽn hồ sơ >48h & tối ưu phễu theo chuẩn Kaizen.
- 🤝 **CTV Partner Agent**: Phân bổ job thưởng bounty cao cho mạng lưới giới thiệu.
- 💬 **Copilot Agent**: Giải đáp & tư vấn chiến lược ứng viên.

*Nhập yêu cầu vào ô bên dưới hoặc chọn các tác vụ mẫu để bắt đầu!*`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      steps: []
    }
  ]);
  const messagesEndRef = useRef(null);

  // 2. Batch Screening State
  const [selectedJobId, setSelectedJobId] = useState(jobItems[0]?.id || jobItems[0]?.stt || 'all');
  const [batchResults, setBatchResults] = useState([]);
  const [batchSearch, setBatchSearch] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0);

  // 3. Candidate Debate State
  const [debateCandidateId, setDebateCandidateId] = useState(candidates[0]?.id || candidates[0]?.stt || '');
  const [debateJobId, setDebateJobId] = useState(jobItems[0]?.id || jobItems[0]?.stt || '');
  const [debateSteps, setDebateSteps] = useState([]);
  const [debateVerdict, setDebateVerdict] = useState(null);
  const [isDebating, setIsDebating] = useState(false);

  // 4. SLA Audit State
  const [auditResult, setAuditResult] = useState(() => runPipelineSlaAudit(candidates, jobItems));

  // Sync candidate selections when candidates / jobs load
  useEffect(() => {
    if (candidates.length > 0 && !debateCandidateId) {
      setDebateCandidateId(candidates[0].id || candidates[0].stt || '');
    }
    if (jobItems.length > 0 && (!debateJobId || !selectedJobId || selectedJobId === 'all')) {
      const firstJobId = jobItems[0].id || jobItems[0].stt || '';
      if (!debateJobId) setDebateJobId(firstJobId);
      if (!selectedJobId || selectedJobId === 'all') setSelectedJobId(firstJobId);
    }
    setAuditResult(runPipelineSlaAudit(candidates, jobItems));
  }, [candidates, jobItems]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, swarmSteps]);

  // Handle Swarm Console Run
  const handleRunSwarmPrompt = async (customPrompt) => {
    const textToRun = customPrompt || promptInput;
    if (!textToRun.trim() || isExecuting) return;

    setIsExecuting(true);
    setPromptInput('');
    setSwarmSteps([]);

    // Add user message to history
    const userMsgId = `user-${Date.now()}`;
    const newChatHistory = [
      ...chatHistory,
      {
        id: userMsgId,
        sender: 'user',
        text: textToRun,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setChatHistory(newChatHistory);

    try {
      const result = await runSupervisorSwarm(
        textToRun,
        { candidates, jobs: jobItems, ctvItems },
        (updatedSteps) => setSwarmSteps(updatedSteps)
      );

      setChatHistory([
        ...newChatHistory,
        {
          id: `bot-${Date.now()}`,
          sender: 'supervisor',
          text: result.text,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          steps: result.steps
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatHistory([
        ...newChatHistory,
        {
          id: `err-${Date.now()}`,
          sender: 'supervisor',
          text: `⚠️ Đã xảy ra lỗi khi điều phối Swarm: ${err.message}`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          steps: []
        }
      ]);
    } finally {
      setIsExecuting(false);
      setSwarmSteps([]);
    }
  };

  // Handle Batch Screening Run
  const handleRunBatchScreening = () => {
    const targetJob = jobItems.find(j => (j.id || j.stt || '') === selectedJobId) || jobItems[0] || { title: 'Vị trí tuyển dụng chung' };
    setIsExecuting(true);
    setTimeout(() => {
      const res = runBatchCandidateScreening(targetJob, candidates);
      setBatchResults(res);
      setIsExecuting(false);
      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }, 600);
  };

  // Handle Multi-Agent Debate Run
  const handleRunDebate = async () => {
    const candidate = candidates.find(c => (c.id || c.stt || '') === debateCandidateId) || candidates[0];
    const job = jobItems.find(j => (j.id || j.stt || '') === debateJobId) || jobItems[0];
    if (!candidate) return;

    setIsDebating(true);
    setDebateSteps([]);
    setDebateVerdict(null);

    try {
      const res = await runCandidateDebate(candidate, job, (updatedSteps) => {
        setDebateSteps(updatedSteps);
      });
      setDebateVerdict(res);
      try {
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      console.error('Debate failed:', err);
    } finally {
      setIsDebating(false);
    }
  };

  // Handle Copy text
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveAgentConfig(config);
    save9RouterConfig({
      endpoint: config.apiEndpoint || routerConfig.endpoint,
      apiKey: config.apiKey || routerConfig.apiKey,
      model: config.modelName || routerConfig.model,
      temperature: config.temperature,
      tokenSaver: routerConfig.tokenSaver,
      autoFailover: routerConfig.autoFailover
    });
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  // Filtered batch results
  const filteredBatchResults = batchResults.filter(r => {
    const matchesSearch = !batchSearch || 
      r.candidateName.toLowerCase().includes(batchSearch.toLowerCase()) ||
      r.candidatePosition.toLowerCase().includes(batchSearch.toLowerCase()) ||
      r.candidateCtv.toLowerCase().includes(batchSearch.toLowerCase());
    const matchesScore = r.score >= minScoreFilter;
    return matchesSearch && matchesScore;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                FastHunt Autonomous Swarm Architecture
              </div>

              {/* 9Router Live Status Pill */}
              <div
                onClick={() => setActiveTab('settings')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                  routerStatus.loading
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 animate-pulse'
                    : routerStatus.success
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-rose-500/20 border-rose-400/40 text-rose-300 hover:bg-rose-500/30'
                }`}
                title={routerStatus.message || 'Nhấp để kiểm tra hoặc cấu hình 9Router'}
              >
                <Network className="w-3.5 h-3.5" />
                <span>9Router:</span>
                {routerStatus.loading ? (
                  <span>Đang dò ping...</span>
                ) : routerStatus.success ? (
                  <span className="font-bold flex items-center gap-1">
                    🟢 Online <span className="opacity-75">({routerStatus.latency}ms)</span>
                  </span>
                ) : (
                  <span className="font-bold">🔴 Disconnected (Offline Heuristics)</span>
                )}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-indigo-400" />
              Trung Tâm Điều Hành Multi-Agent Swarm
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
              Tổ hợp 5 AI Agents chuyên trách tự động hoá phễu tuyển dụng qua 9Router Gateway: Lọc CV tức thì, kiểm toán SLA nghẽn hồ sơ, tổ chức tranh biện đánh giá ứng viên và kích hoạt phỏng vấn thông minh.
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/60 flex flex-col items-center justify-center">
              <div className="text-2xl font-black text-indigo-400">6</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Agents Sẵn Sàng</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/60 flex flex-col items-center justify-center">
              <div className="text-2xl font-black text-emerald-400">{candidates.length}</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Hồ Sơ Ingested</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/60 flex flex-col items-center justify-center col-span-2 sm:col-span-1">
              <div className="text-2xl font-black text-amber-400">{auditResult.slaComplianceRate}%</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">SLA Pipeline</div>
            </div>
          </div>
        </div>

        {/* Live Swarm Topology Nodes */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.values(AGENT_REGISTRY).map(agent => (
            <div
              key={agent.id}
              className={`relative rounded-xl p-3 transition-all duration-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-400/50 flex flex-col justify-between ${
                isExecuting || isDebating ? 'ring-1 ring-indigo-500/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">{agent.avatar}</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 truncate">{agent.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{agent.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('console')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            activeTab === 'console'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Swarm Console & Orchestration
        </button>

        <button
          onClick={() => setActiveTab('batch')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            activeTab === 'batch'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          Batch Sourcing Screener
          {batchResults.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-[10px]">
              {batchResults.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('debate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            activeTab === 'debate'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Scale className="w-4 h-4" />
          Multi-Agent Debate Arena
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Kaizen SLA Bottleneck Audit
          {auditResult.criticalCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {auditResult.criticalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          Cấu Hình Swarm
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SWARM CONSOLE & REAL-TIME ORCHESTRATION */}
      {/* ========================================================================= */}
      {activeTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat / Orchestrator Stream */}
          <div className="lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[580px]">
            {/* Console Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Swarm Collaborative Execution Log
                </span>
              </div>
              <button
                onClick={() => setChatHistory([chatHistory[0]])}
                className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                title="Xóa lịch sử trò chuyện"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Làm mới phiên
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[500px]">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender !== 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                      🤖
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                  }`}>
                    {/* Execution Steps Trace */}
                    {msg.steps && msg.steps.length > 0 && (
                      <div className="mb-3 space-y-1.5 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3 h-3" />
                          Tiến trình phân phối nhiệm vụ (Task Decomposition):
                        </div>
                        {msg.steps.map((st) => (
                          <div
                            key={st.id}
                            className="flex items-start gap-2 text-xs bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800"
                          >
                            <span>{st.agent.avatar}</span>
                            <div className="flex-1">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {st.agent.name}:
                              </span>{' '}
                              <span className="text-slate-600 dark:text-slate-300">{st.message}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{st.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Markdown / text rendering */}
                    <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                      {msg.text}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span>{msg.timestamp}</span>
                      {msg.sender !== 'user' && (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedId === msg.id ? 'Đã copy' : 'Sao chép nội dung'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Active Thinking Steps Live Stream */}
              {isExecuting && swarmSteps.length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 space-y-2 animate-pulse">
                  <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Đang điều phối Swarm Agents...
                  </div>
                  {swarmSteps.map(s => (
                    <div key={s.id} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span>{s.agent.avatar}</span>
                      <span className="font-semibold">{s.agent.name}:</span>
                      <span>{s.message}</span>
                    </div>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunSwarmPrompt();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Nhập yêu cầu (VD: Lọc top 3 ứng viên tốt nhất, kiểm tra hồ sơ nghẽn SLA > 48h...)"
                  disabled={isExecuting}
                  className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  disabled={isExecuting || !promptInput.trim()}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 shrink-0"
                >
                  {isExecuting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Thực thi
                </button>
              </form>
            </div>
          </div>

          {/* Quick Prompts & Agents Capability Matrix */}
          <div className="space-y-4">
            {/* Quick Action Chips */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-500" />
                Kịch Bản Tác Vụ Nhanh (1-Click)
              </h3>
              <div className="space-y-2">
                {[
                  {
                    title: '🎯 Lọc Top 3 Ứng Viên Ưu Tiên',
                    desc: 'Screener Agent rà soát và chấm điểm hồ sơ tốt nhất',
                    prompt: 'Hãy phân tích toàn bộ ứng viên và lọc ra Top 3 hồ sơ phù hợp nhất để gửi khách hàng.'
                  },
                  {
                    title: '📈 Kiểm Toán Nghẽn SLA (>48h)',
                    desc: 'Auditor Agent quét hồ sơ trễ hạn và đề xuất Kaizen',
                    prompt: 'Kiểm tra toàn bộ hồ sơ đang bị trễ hạn SLA hoặc chưa được xử lý quá 48 giờ.'
                  },
                  {
                    title: '📅 Soạn Thư Mời Phỏng Vấn',
                    desc: 'Scheduler Agent chuẩn bị mẫu thư mời chuẩn Zalo & Email',
                    prompt: 'Soạn thư mời phỏng vấn chuẩn Zalo và Email cho các ứng viên vừa vượt qua vòng sơ loại.'
                  },
                  {
                    title: '🤝 Cơ Hội Thưởng Bounty CTV',
                    desc: 'CTV Partner Agent phân tích các Job hoa hồng cao',
                    prompt: 'Tổng hợp các vị trí tuyển dụng có thưởng Bounty cao nhất để gửi cho mạng lưới CTV.'
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunSwarmPrompt(item.prompt)}
                    disabled={isExecuting}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 hover:bg-indigo-50/60 dark:bg-slate-800/50 dark:hover:bg-indigo-950/30 transition-all group"
                  >
                    <div className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Swarm Architecture Card */}
            <div className="bg-gradient-to-br from-indigo-900/10 to-violet-900/10 dark:from-indigo-950/40 dark:to-violet-950/40 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800/40">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Cơ Chế Phối Hợp Đa Tác Nhân
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Các Agent giao tiếp qua mô hình <strong>Hierarchical Swarm Orchestration</strong>. Master Supervisor nhận diện intent, chia tách nhiệm vụ (Zero-shot CoT), kích hoạt các Sub-agent song song và tổng hợp phán quyết khách quan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BATCH SOURCING SCREENER MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'batch' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chọn Vị Trí Cần Đối Soát (Job Requisition):
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  {jobItems.map((j, i) => (
                    <option key={j.id || j.stt || i} value={j.id || j.stt || i}>
                      {j.title || j.viTri || `Vị trí #${i + 1}`} ({j.company || j.khachHang || 'Công ty'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tìm Kiếm Ứng Viên / CTV:
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={batchSearch}
                    onChange={(e) => setBatchSearch(e.target.value)}
                    placeholder="Tên, vị trí, nguồn..."
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lọc Điểm Fit Tối Thiểu: {minScoreFilter}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={minScoreFilter}
                  onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <button
              onClick={handleRunBatchScreening}
              disabled={isExecuting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 shrink-0"
            >
              {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Chạy Screening Toàn Bộ ({candidates.length} Hồ Sơ)
            </button>
          </div>

          {/* Screening Results Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                Ma Trận Xếp Hạng Ứng Viên (AI Fit Score Matrix)
              </h3>
              <span className="text-xs text-slate-500">
                Hiển thị {filteredBatchResults.length} / {batchResults.length || candidates.length} ứng viên
              </span>
            </div>

            {filteredBatchResults.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                <Bot className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-slate-600 opacity-60" />
                <p className="font-semibold text-sm">Chưa có kết quả screening.</p>
                <p className="text-xs mt-1">Bấm nút "Chạy Screening Toàn Bộ" phía trên để Screener Agent bắt đầu đối soát hồ sơ.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <th className="py-3 px-4">Ứng Viên</th>
                      <th className="py-3 px-4">Vị Trí Hiện Tại</th>
                      <th className="py-3 px-4">Điểm Phù Hợp</th>
                      <th className="py-3 px-4">Điểm Mạnh & Nhược Điểm (AI Notes)</th>
                      <th className="py-3 px-4">Khuyến Nghị</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredBatchResults.map((item, index) => (
                      <tr key={item.candidateId || index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>#{index + 1}</span>
                            <span>{item.candidateName}</span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            CTV: {item.candidateCtv}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {item.candidatePosition}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                            <span className="font-black text-xs text-slate-900 dark:text-white">{item.score}%</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                            ✓ {item.strengths[0]}
                          </div>
                          {item.redFlags.length > 0 && item.redFlags[0] !== 'Chưa phát hiện điểm rủi ro lớn.' && (
                            <div className="text-xs text-rose-600 dark:text-rose-400 mt-0.5 font-medium">
                              ⚠ {item.redFlags[0]}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${item.badgeClass}`}>
                            {item.recommendation}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setDebateCandidateId(item.candidateId);
                                setActiveTab('debate');
                              }}
                              className="px-2.5 py-1 text-xs rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1"
                              title="Tổ chức tranh biện giữa các AI Agents"
                            >
                              <Scale className="w-3 h-3" />
                              Tranh Biện
                            </button>
                            {onOpenEmail && (
                              <button
                                onClick={() => onOpenEmail({ name: item.candidateName, position: item.candidatePosition, email: item.candidateEmail })}
                                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                                title="Soạn email mời phỏng vấn"
                              >
                                <Mail className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MULTI-AGENT CANDIDATE DEBATE ARENA */}
      {/* ========================================================================= */}
      {activeTab === 'debate' && (
        <div className="space-y-6">
          {/* Candidate & Job Selection Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chọn Ứng Viên Cần Đánh Giá Tranh Biện:
                </label>
                <select
                  value={debateCandidateId}
                  onChange={(e) => setDebateCandidateId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  {candidates.map((c, i) => (
                    <option key={c.id || c.stt || i} value={c.id || c.stt || i}>
                      {c.name || c.hoTen || `Ứng viên #${i + 1}`} - {c.position || c.viTri || 'N/A'} (CTV: {c.ctv || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chọn Vị Trí Tuyển Dụng Tham Chiếu:
                </label>
                <select
                  value={debateJobId}
                  onChange={(e) => setDebateJobId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  {jobItems.map((j, i) => (
                    <option key={j.id || j.stt || i} value={j.id || j.stt || i}>
                      {j.title || j.viTri || `Vị trí #${i + 1}`} ({j.company || 'Doanh nghiệp'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleRunDebate}
              disabled={isDebating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 shrink-0 w-full md:w-auto"
            >
              {isDebating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
              Bắt Đầu Tranh Biện Đa Tác Nhân (Start Debate)
            </button>
          </div>

          {/* Debate Arena Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent 1: Screener (Advocate) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900/40 p-5 shadow-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-blue-100 dark:border-blue-900/30">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold">
                  🎯
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {AGENT_REGISTRY.screener.name}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    Vai trò: Luật sư Bênh vực / Điểm mạnh Ứng viên (Advocate)
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {debateSteps.filter(s => s.agent.id === 'screener').map(s => (
                  <div key={s.id} className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {s.message}
                  </div>
                ))}
                {!isDebating && debateSteps.filter(s => s.agent.id === 'screener').length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Chờ kích hoạt phiên tranh luận...
                  </div>
                )}
              </div>
            </div>

            {/* Agent 2: Auditor (Risk Analyst) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/40 p-5 shadow-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-amber-100 dark:border-amber-900/30">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold">
                  📈
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {AGENT_REGISTRY.auditor.name}
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    Vai trò: Phản biện Rủi ro & Điểm nghẽn Tuyển dụng (Risk Analyst)
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {debateSteps.filter(s => s.agent.id === 'auditor').map(s => (
                  <div key={s.id} className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {s.message}
                  </div>
                ))}
                {!isDebating && debateSteps.filter(s => s.agent.id === 'auditor').length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Chờ kích hoạt phiên tranh luận...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Verdict Box */}
          {debateVerdict && (
            <div className="bg-gradient-to-br from-violet-900/10 via-indigo-900/10 to-slate-900/10 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-slate-950/40 rounded-2xl p-6 border-2 border-indigo-400/40 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                  🤖
                </div>
                <div>
                  <div className="font-black text-base text-slate-900 dark:text-white">
                    Phán Quyết Đồng Thuận (Supervisor Final Consensus Verdict)
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    Tổng hợp từ lập luận đa chiều của Screener & Auditor
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {debateSteps.find(s => s.agent.id === 'supervisor')?.message || debateVerdict.verdictAdvice}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KAIZEN SLA BOTTLENECK AUDIT */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Top Audit Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Tổng Hồ Sơ Kiểm Toán</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{auditResult.totalChecked}</div>
              <div className="text-[11px] text-slate-400 mt-1">100% hồ sơ trong hệ thống</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-rose-200 dark:border-rose-900/40 shadow-sm">
              <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Nghẽn Nghiêm Trọng (&gt;48h)</div>
              <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">{auditResult.criticalCount}</div>
              <div className="text-[11px] text-rose-500 mt-1">Cần can thiệp khẩn cấp</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-amber-200 dark:border-amber-900/40 shadow-sm">
              <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Cảnh Báo Chậm (&gt;24h)</div>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{auditResult.warningCount}</div>
              <div className="text-[11px] text-amber-500 mt-1">Đang chờ phỏng vấn / feedback</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Tỷ Lệ Tuân Thủ SLA</div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{auditResult.slaComplianceRate}%</div>
              <div className="text-[11px] text-emerald-500 mt-1">Chuẩn Kaizen Lean Hiring</div>
            </div>
          </div>

          {/* Actionable Bottleneck List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Danh Sách Hồ Sơ Nghẽn Cần Khắc Phục Ngay
              </h3>
              <button
                onClick={() => setAuditResult(runPipelineSlaAudit(candidates, jobItems))}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Quét lại toàn phễu
              </button>
            </div>

            {auditResult.bottlenecks.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-900 dark:text-white">Xuất sắc! Toàn bộ phễu tuyển dụng đang đạt chuẩn SLA 100%.</p>
                <p className="text-xs text-slate-400 mt-1">Không có hồ sơ nào bị tồn đọng quá 48h.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {auditResult.bottlenecks.map((item, idx) => (
                  <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.severity === 'critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}>
                          {item.delayTime}
                        </span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{item.candidateName}</span>
                        <span className="text-xs text-slate-500">({item.position})</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        <strong>Nguyên nhân:</strong> {item.reason}
                      </div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400">
                        <strong>Khuyến nghị Kaizen:</strong> {item.recommendedAction}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onOpenEmail && (
                        <button
                          onClick={() => onOpenEmail({ name: item.candidateName, position: item.position })}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Gửi Thư Nhắc Nhở
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: 9ROUTER & SWARM INTELLIGENCE CONFIGURATION */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          {/* 9Router Live Status Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 border border-indigo-500/30 shadow-lg text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">9Router AI Proxy Gateway</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      routerStatus.success
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                    }`}>
                      {routerStatus.loading ? 'Đang kiểm tra...' : routerStatus.success ? 'Đã Kết Nối' : 'Chưa Kết Nối'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Cổng trung chuyển LLM tốc độ cao, tự động đổi failover giữa GPT-4o, Claude 3.5, Gemini & DeepSeek.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => checkRouterHealth()}
                disabled={routerStatus.loading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${routerStatus.loading ? 'animate-spin' : ''}`} />
                {routerStatus.loading ? 'Đang kiểm tra...' : 'Kiểm Tra Kết Nối (Ping)'}
              </button>
            </div>

            {/* Health readout */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400 text-[11px]">Endpoint Hiện Tại</div>
                <div className="font-mono text-indigo-300 mt-0.5 truncate">{routerConfig.endpoint || 'http://localhost:20128/v1'}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400 text-[11px]">Độ Trễ Phản Hồi (Latency)</div>
                <div className="font-bold text-emerald-300 mt-0.5">
                  {routerStatus.tested ? `${routerStatus.latency} ms` : '--'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400 text-[11px]">Trạng Thái RTK Token Saver</div>
                <div className="font-bold text-violet-300 mt-0.5">
                  {routerConfig.tokenSaver ? '✓ Kích hoạt (Giảm 30% Token)' : 'Tắt'}
                </div>
              </div>
            </div>

            {routerStatus.message && (
              <div className={`mt-3 p-3 rounded-xl text-xs border ${
                routerStatus.success
                  ? 'bg-emerald-950/40 text-emerald-200 border-emerald-800/40'
                  : 'bg-rose-950/40 text-rose-200 border-rose-800/40'
              }`}>
                {routerStatus.message}
              </div>
            )}
          </div>

          {/* Configuration Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 mb-2">
              <Sliders className="w-5 h-5 text-indigo-500" />
              Cấu Hình Tham Số Kết Nối 9Router & Swarm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Lựa chọn Preset cổng kết nối hoặc tùy chỉnh API Key, Model định tuyến và tính năng tiết kiệm token.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* Preset Endpoints Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">
                  Cổng Kết Nối Khuyến Nghị (9Router Presets):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_9ROUTER_ENDPOINTS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        const newCfg = { ...routerConfig, endpoint: p.endpoint };
                        setRouterConfig(newCfg);
                        setConfig({
                          ...config,
                          provider: p.id === 'openrouter' ? '9router' : '9router',
                          apiEndpoint: p.endpoint
                        });
                        checkRouterHealth(newCfg);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        (config.apiEndpoint || routerConfig.endpoint) === p.endpoint
                          ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{p.label}</span>
                        {(config.apiEndpoint || routerConfig.endpoint) === p.endpoint && (
                          <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {p.endpoint || 'Nhập endpoint tùy chỉnh...'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Chế Độ Hoạt Động (Engine Mode):
                  </label>
                  <select
                    value={config.provider}
                    onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="9router">⚡ 9Router AI Smart Gateway (Khuyến nghị)</option>
                    <option value="built-in">Tích hợp sẵn (FastHunt Offline Heuristics)</option>
                    <option value="openai">OpenAI Direct (GPT-4o)</option>
                    <option value="gemini">Google Gemini Direct (Gemini 2.5)</option>
                    <option value="anthropic">Anthropic Direct (Claude 3.5)</option>
                    <option value="custom">Custom OpenAI-Compatible API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Mô Hình Đích (Target Model):
                  </label>
                  <select
                    value={config.modelName || 'auto'}
                    onChange={(e) => {
                      setConfig({ ...config, modelName: e.target.value });
                      setRouterConfig({ ...routerConfig, model: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {POPULAR_9ROUTER_MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Endpoint & API Key inputs */}
              <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    9Router Endpoint URL:
                  </label>
                  <input
                    type="text"
                    value={config.apiEndpoint || routerConfig.endpoint || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig({ ...config, apiEndpoint: val });
                      setRouterConfig({ ...routerConfig, endpoint: val });
                    }}
                    placeholder="http://localhost:20128/v1"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    9Router / Provider API Key:
                  </label>
                  <input
                    type="password"
                    value={config.apiKey || routerConfig.apiKey || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig({ ...config, apiKey: val });
                      setRouterConfig({ ...routerConfig, apiKey: val });
                    }}
                    placeholder="9router-default-key hoặc sk-..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nếu chạy 9Router cục bộ không cài đặt mật khẩu, có thể giữ giá trị mặc định <code className="text-indigo-600 dark:text-indigo-400">9router-default-key</code>.
                  </p>
                </div>

                {/* Feature Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={routerConfig.tokenSaver}
                      onChange={(e) => setRouterConfig({ ...routerConfig, tokenSaver: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Bật RTK Token Saver (Nén ngữ cảnh & tiết kiệm chi phí)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={routerConfig.autoFailover}
                      onChange={(e) => setRouterConfig({ ...routerConfig, autoFailover: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Tự động Failover khi nhà cung cấp quá tải / hết quota</span>
                  </label>
                </div>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Độ Sáng Tạo Suy Luận (Temperature: {config.temperature}):
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0.0 (Chính xác / Quy chuẩn)</span>
                  <span>0.7 (Cân bằng khuyến nghị)</span>
                  <span>1.0 (Sáng tạo cao)</span>
                </div>
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Chỉ Thị Bổ Sung Toàn Swarm (Custom System Instructions):
                </label>
                <textarea
                  rows={3}
                  value={config.customInstructions || ''}
                  onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
                  placeholder="VD: Ưu tiên ứng viên có chứng chỉ tiếng Nhật N2 trở lên, nhấn mạnh văn hóa làm việc linh hoạt hybrid..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quickstart snippet */}
              <div className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs border border-slate-800 space-y-1.5">
                <div className="text-slate-400 font-sans font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  Hướng dẫn khởi chạy 9Router trên máy cục bộ (Local Terminal):
                </div>
                <div className="text-emerald-400"># 1. Cài đặt và khởi động 9Router proxy</div>
                <div>npx 9router start --port 20128</div>
                <div className="text-slate-500"># Hoặc khởi chạy qua Docker</div>
                <div>docker run -d -p 20128:20128 decolua/9router</div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {configSaved ? '✓ Đã lưu cấu hình 9Router & Swarm thành công!' : ''}
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/20"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
