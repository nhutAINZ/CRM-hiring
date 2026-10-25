import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Flame,
  DollarSign,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
  Search,
  FileText,
  Clock,
  Building,
  MapPin,
  Zap,
  ArrowRight,
  Upload,
  Copy,
  Check,
  Send,
  X,
  FileUp,
  UserCheck,
  LogIn,
  LogOut,
  Calendar,
  AlertCircle,
  Filter,
  Eye,
  Calculator,
  Trophy,
  Target,
  LayoutGrid
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CTV_SUBMIT_CV_FORM_URL } from '../services/sheetsService';
import CtvSubmitCandidateModal from './CtvSubmitCandidateModal';
import CtvEarningsCalculator from './CtvEarningsCalculator';
import CtvReferralKit from './CtvReferralKit';
import CtvLeaderboard from './CtvLeaderboard';
import CtvUpcomingInterviews from './CtvUpcomingInterviews';

export default function CtvDashboardView({
  jobItems = [],
  candidates = [],
  ctvItems = [],
  currentCtv = null,
  onOpenCtvAuth = () => {},
  onLogoutCtv = () => {},
  onSubmitCandidate = () => {},
  onNavigateToJobs,
  onNavigateToContentGen,
  onNavigateToGroupFinder,
  onOpenJobDetail,
  onOpenCandidateDetail
}) {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedJobForSubmit, setSelectedJobForSubmit] = useState(null);
  const [copiedFormLink, setCopiedFormLink] = useState(false);
  const [myCandidateSearch, setMyCandidateSearch] = useState('');
  const [myCandidateStageFilter, setMyCandidateStageFilter] = useState('all');
  const [manualLookupCode, setManualLookupCode] = useState('');
  const [activeSection, setActiveSection] = useState('all');

  // Determine active CTV code for tracking
  const activeCtvCode = (currentCtv?.ctvCode || manualLookupCode || '').trim();

  // Filter active jobs
  const activeJobs = useMemo(() => {
    return jobItems.filter((job) => {
      const st = (job.status || '').toLowerCase();
      return !st.includes('đóng') && !st.includes('tạm dừng') && !st.includes('close');
    });
  }, [jobItems]);

  // Urgent or New jobs
  const urgentOrNewJobs = useMemo(() => {
    return activeJobs.filter((job) => {
      const st = (job.status || '').toLowerCase();
      return st.includes('gấp') || st.includes('mới') || st.includes('lại');
    });
  }, [activeJobs]);

  // High bonus jobs
  const highBonusJobs = useMemo(() => {
    return activeJobs.slice(0, 6);
  }, [activeJobs]);

  // Group by industry
  const industryDistribution = useMemo(() => {
    const counts = {};
    activeJobs.forEach((j) => {
      const ind = j.industry || 'Khác';
      counts[ind] = (counts[ind] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [activeJobs]);

  // Filter candidates belonging to active CTV
  const myCandidates = useMemo(() => {
    if (!activeCtvCode) return [];
    const cleanCode = activeCtvCode.toLowerCase();
    return candidates.filter((c) => {
      const code = (c.ctvCode || '').toLowerCase().trim();
      return code === cleanCode;
    });
  }, [candidates, activeCtvCode]);

  // Upcoming interviews for this CTV's candidates
  const upcomingInterviews = useMemo(() => {
    return myCandidates.filter((c) => {
      const pv = (c.pvResultRaw || '').toUpperCase();
      return Boolean(c.interviewDate) || pv.includes('LỊCH') || pv.includes('PV') || pv.includes('PHỎNG VẤN');
    });
  }, [myCandidates]);

  // Compute Top CTV Leaderboard from candidate data
  const ctvLeaderboard = useMemo(() => {
    const ctvMap = new Map();

    candidates.forEach((c) => {
      const code = (c.ctvCode || '').trim();
      if (!code || code === 'N/A' || code === '-' || code.length < 2) return;
      const upperCode = code.toUpperCase();

      if (!ctvMap.has(upperCode)) {
        const matchedItem = ctvItems.find((item) => (item.ctvCode || '').toUpperCase().trim() === upperCode);
        ctvMap.set(upperCode, {
          ctvCode: upperCode,
          name: matchedItem?.name || `CTV ${upperCode}`,
          total: 0,
          passCv: 0,
          onboard: 0
        });
      }

      const entry = ctvMap.get(upperCode);
      entry.total++;

      const cvRes = (c.cvResultRaw || '').toUpperCase();
      const pvRes = (c.pvResultRaw || '').toUpperCase();

      if (cvRes.includes('PASS')) entry.passCv++;
      if (c.onboardingDate || pvRes.includes('PASS') || pvRes.includes('ONBOARD') || cvRes.includes('ONBOARD')) {
        entry.onboard++;
      }
    });

    return Array.from(ctvMap.values())
      .sort((a, b) => {
        if (b.onboard !== a.onboard) return b.onboard - a.onboard;
        if (b.passCv !== a.passCv) return b.passCv - a.passCv;
        return b.total - a.total;
      })
      .slice(0, 5);
  }, [candidates, ctvItems]);

  // Compute CTV personal stats with funnel metrics
  const ctvStats = useMemo(() => {
    let passCvCount = 0;
    let onboardCount = 0;
    let interviewCount = 0;

    myCandidates.forEach((c) => {
      const cvRes = (c.cvResultRaw || '').toUpperCase();
      const pvRes = (c.pvResultRaw || '').toUpperCase();

      if (cvRes.includes('PASS')) passCvCount++;
      if (c.onboardingDate || pvRes.includes('PASS') || pvRes.includes('ONBOARD') || cvRes.includes('ONBOARD')) {
        onboardCount++;
      } else if (c.interviewDate || pvRes.includes('LỊCH') || pvRes.includes('PV')) {
        interviewCount++;
      }
    });

    const passRate = myCandidates.length > 0 ? Math.round((passCvCount / myCandidates.length) * 100) : 0;
    const interviewRate = passCvCount > 0 ? Math.round((interviewCount / passCvCount) * 100) : 0;
    const onboardRate = interviewCount > 0 ? Math.round((onboardCount / interviewCount) * 100) : (passCvCount > 0 ? Math.round((onboardCount / passCvCount) * 100) : 0);
    const estimatedEarnings = onboardCount * 2500000;

    return {
      total: myCandidates.length,
      passCv: passCvCount,
      interview: interviewCount,
      onboard: onboardCount,
      passRate,
      interviewRate,
      onboardRate,
      estimatedEarnings
    };
  }, [myCandidates]);

  // Filtered personal candidates
  const filteredMyCandidates = useMemo(() => {
    return myCandidates.filter((c) => {
      const matchSearch =
        !myCandidateSearch ||
        (c.name && c.name.toLowerCase().includes(myCandidateSearch.toLowerCase())) ||
        (c.position && c.position.toLowerCase().includes(myCandidateSearch.toLowerCase())) ||
        (c.company && c.company.toLowerCase().includes(myCandidateSearch.toLowerCase()));

      let matchStage = true;
      const cvRes = (c.cvResultRaw || '').toUpperCase();
      const pvRes = (c.pvResultRaw || '').toUpperCase();

      if (myCandidateStageFilter === 'pass') {
        matchStage = cvRes.includes('PASS');
      } else if (myCandidateStageFilter === 'interview') {
        matchStage = Boolean(c.interviewDate) || pvRes.includes('LỊCH') || pvRes.includes('PV');
      } else if (myCandidateStageFilter === 'onboard') {
        matchStage = Boolean(c.onboardingDate) || pvRes.includes('ONBOARD');
      } else if (myCandidateStageFilter === 'fail') {
        matchStage = cvRes.includes('FAIL') || pvRes.includes('FAIL') || cvRes.includes('LOẠI');
      }

      return matchSearch && matchStage;
    });
  }, [myCandidates, myCandidateSearch, myCandidateStageFilter]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {}
  };

  const handleCopyFormLink = () => {
    navigator.clipboard.writeText(CTV_SUBMIT_CV_FORM_URL);
    setCopiedFormLink(true);
    triggerCelebration();
    setTimeout(() => setCopiedFormLink(false), 2500);
  };

  const handleOpenSubmitForJob = (job) => {
    setSelectedJobForSubmit(job);
    setIsSubmitModalOpen(true);
  };

  const scrollToMyCandidates = () => {
    const el = document.getElementById('my-candidates-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 🌟 1. EXECUTIVE HERO BANNER (Harmonious Royal Blue & Crisp White) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-900 dark:via-slate-850 dark:to-blue-950 text-white p-6 sm:p-8 md:p-10 border border-blue-500/20 dark:border-slate-800 shadow-xl shadow-blue-500/5">
        {/* Subtle ambient lighting mesh */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 dark:bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-16 w-72 h-72 rounded-full bg-sky-400/10 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left: Headline & Pitch */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 dark:border-slate-700/80 text-xs font-semibold text-white dark:text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Cổng Thông Tin Tuyển Dụng & Hoa Hồng CTV FastHunt</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Giới Thiệu Ứng Viên — <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-sky-200 to-amber-200 dark:from-blue-400 dark:via-indigo-300 dark:to-amber-300">
                Nhận Hoa Hồng Tới 30% Lương
              </span>
            </h1>

            <p className="text-sm sm:text-base text-blue-50 dark:text-slate-300 leading-relaxed font-normal">
              Kết nối ứng viên tài năng đến hàng chục doanh nghiệp uy tín. Nhận thưởng nóng và hoa hồng lên đến <strong className="text-amber-300 font-semibold">1.200.000₫ – 30% lương onboard</strong>. Minh bạch, nộp CV trực tiếp và theo dõi trạng thái phỏng vấn realtime!
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSelectedJobForSubmit(null);
                  setIsSubmitModalOpen(true);
                  triggerCelebration();
                }}
                className="px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 font-bold text-xs sm:text-sm shadow-lg shadow-black/10 dark:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <FileUp className="w-4 h-4 text-blue-600 dark:text-white" />
                <span>NỘP CV ỨNG VIÊN MỚI</span>
              </button>

              <button
                onClick={() => {
                  if (activeCtvCode) {
                    scrollToMyCandidates();
                  } else {
                    onOpenCtvAuth();
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-blue-800/70 hover:bg-blue-800 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-white dark:text-slate-200 border border-blue-400/30 dark:border-slate-700 font-semibold text-xs sm:text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-sky-300 dark:text-blue-400" />
                <span>{activeCtvCode ? `Hồ Sơ CV Của Tôi (${myCandidates.length})` : 'Tra Cứu CV Của Tôi'}</span>
              </button>

              <button
                onClick={() => onNavigateToJobs && onNavigateToJobs()}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white dark:text-slate-300 border border-white/15 dark:border-white/10 font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-blue-200 dark:text-slate-400" />
                <span>Xem {activeJobs.length} Job Mở</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-200 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right: Personal CTV Status & Identity Box */}
          <div className="w-full lg:w-80 shrink-0">
            {currentCtv ? (
              <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-850/95 border border-white/40 dark:border-slate-700/80 shadow-2xl backdrop-blur-md space-y-3.5 text-slate-800 dark:text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      {currentCtv.name ? currentCtv.name.slice(0, 2).toUpperCase() : 'CTV'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cộng Tác Viên</p>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentCtv.name}</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 text-[11px] font-extrabold font-mono">
                    {currentCtv.ctvCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/80">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">CV Đã Gửi</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{myCandidates.length}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 text-center">
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">CV Đạt (Pass)</span>
                    <p className="text-lg font-black text-blue-700 dark:text-blue-400">{ctvStats.passCv}</p>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <button
                    onClick={scrollToMyCandidates}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem chi tiết hồ sơ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onLogoutCtv}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium text-[11px] cursor-pointer"
                  >
                    Thoát
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-850/95 border border-white/40 dark:border-slate-700/80 shadow-2xl backdrop-blur-md space-y-3.5 text-slate-800 dark:text-white">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bạn Là Cộng Tác Viên?</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Đăng nhập để theo dõi hồ sơ của riêng bạn</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualLookupCode}
                      onChange={(e) => setManualLookupCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã CTV (VD: CTV01)"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono uppercase focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (manualLookupCode.trim()) {
                          scrollToMyCandidates();
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Tra cứu
                    </button>
                  </div>

                  <button
                    onClick={onOpenCtvAuth}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Đăng Nhập / Tạo Mã CTV Nhanh</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📊 2. CTV REALTIME METRICS (Soft, High-Contrast Light/Dark Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Việc làm đang mở</span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{activeJobs.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">vị trí</span>
          </div>
          <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đang tiếp nhận CV hôm nay</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tuyển gấp / Thưởng nóng</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{urgentOrNewJobs.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">job hot</span>
          </div>
          <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ưu tiên gửi sớm duyệt nhanh</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hoa hồng tối đa</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">30%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">lương onboard</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hoặc tới 2.500.000₫ / ứng viên
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nhóm ngành đa dạng</span>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{industryDistribution.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">lĩnh vực</span>
          </div>
          <p className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
            IT, Kinh Doanh, Marketing, Vận Hành...
          </p>
        </div>
      </div>

      {/* 🧭 Quick CTV Dashboard Section Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'Tất Cả Dashboard', icon: LayoutGrid },
          { id: 'my-candidates', label: `Hồ Sơ Của Tôi (${myCandidates.length})`, icon: Users },
          { id: 'interviews', label: `Lịch Phỏng Vấn (${upcomingInterviews.length})`, icon: Calendar },
          { id: 'calculator', label: 'Bảng Tính Hoa Hồng', icon: Calculator },
          { id: 'referral', label: 'Link Tiếp Thị & Mẫu Tin', icon: Share2 },
          { id: 'leaderboard', label: 'Bảng Vinh Danh', icon: Trophy },
          { id: 'jobs', label: `Việc Làm Mở (${activeJobs.length})`, icon: Briefcase }
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* 📅 Lịch phỏng vấn sắp tới & Nhắc hẹn Zalo 1-Click */}
      {(activeSection === 'all' || activeSection === 'interviews') && (
        <CtvUpcomingInterviews
          upcomingInterviews={upcomingInterviews}
          onOpenCandidateDetail={onOpenCandidateDetail}
        />
      )}

      {/* 📂 3. PERSONAL CANDIDATE TRACKER (COI CV THEO TỪNG CTV) */}
      {(activeSection === 'all' || activeSection === 'my-candidates') && (
        <div id="my-candidates-section" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Hồ Sơ Ứng Viên & Tiến Độ Hoa Hồng Của Tôi
                </h2>
                {activeCtvCode && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs font-mono">
                    Mã: {activeCtvCode}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Theo dõi trực tiếp kết quả duyệt CV, lịch phỏng vấn và trạng thái trúng tuyển của các ứng viên do bạn gửi
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentCtv ? (
                <button
                  onClick={() => {
                    setSelectedJobForSubmit(null);
                    setIsSubmitModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Nộp Thêm CV</span>
                </button>
              ) : (
                <button
                  onClick={onOpenCtvAuth}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập CTV Để Quản Lý</span>
                </button>
              )}
            </div>
          </div>

          {/* If Active CTV is identified */}
          {activeCtvCode ? (
            <div className="space-y-5">
              {/* Quick KPI stats for this CTV */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Tổng CV Đã Nộp</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{ctvStats.total}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">Đã Duyệt (PASS CV)</span>
                  <p className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">{ctvStats.passCv}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Đang Phỏng Vấn</span>
                  <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1">{ctvStats.interview}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Trúng Tuyển (Onboard)</span>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{ctvStats.onboard}</p>
                </div>
              </div>

              {/* Phễu Chuyển Đổi Tuyển Dụng & Tiến Độ Mục Tiêu Tháng */}
              {ctvStats.total > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 dark:from-slate-850 dark:via-slate-850 dark:to-blue-950/40 border border-blue-200/60 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-800 dark:text-white">Phễu Chuyển Đổi Tuyển Dụng Của Tôi:</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
                      <span>Duyệt CV: <strong className="text-blue-600 dark:text-blue-400">{ctvStats.passRate}%</strong></span>
                      <span>•</span>
                      <span>Phỏng vấn: <strong className="text-indigo-600 dark:text-indigo-400">{ctvStats.interviewRate}%</strong></span>
                      <span>•</span>
                      <span>Trúng tuyển: <strong className="text-emerald-600 dark:text-emerald-400">{ctvStats.onboardRate}%</strong></span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                    <div style={{ width: `${Math.min(100, Math.max(10, ctvStats.passRate))}%` }} className="bg-blue-600 h-full transition-all" title={`Tỷ lệ duyệt CV: ${ctvStats.passRate}%`} />
                    <div style={{ width: `${Math.min(100, Math.max(5, ctvStats.onboardRate))}%` }} className="bg-emerald-500 h-full transition-all" title={`Tỷ lệ trúng tuyển: ${ctvStats.onboardRate}%`} />
                  </div>

                  {/* Monthly Milestone Target */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Mục tiêu tháng: <strong className="text-slate-800 dark:text-white">{ctvStats.onboard}/5 Onboard</strong> {ctvStats.onboard >= 5 ? '🎉 Hoàn thành xuất sắc!' : `(Còn ${Math.max(0, 5 - ctvStats.onboard)} CV để đạt mốc thưởng Bạc)`}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      Ước tính hoa hồng tích lũy: ~{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ctvStats.estimatedEarnings)}
                    </span>
                  </div>
                </div>
              )}

            {/* Filter and Search Bar for this CTV */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={myCandidateSearch}
                  onChange={(e) => setMyCandidateSearch(e.target.value)}
                  placeholder="Tìm ứng viên, vị trí, công ty..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {/* Stage Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'all', label: `Tất cả (${myCandidates.length})` },
                  { id: 'pass', label: 'Pass CV' },
                  { id: 'interview', label: 'Phỏng vấn' },
                  { id: 'onboard', label: 'Onboard 🎉' },
                  { id: 'fail', label: 'Chưa phù hợp' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMyCandidateStageFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      myCandidateStageFilter === tab.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidates Table / Card Grid */}
            {filteredMyCandidates.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Ứng Viên</th>
                      <th className="py-3 px-4">Vị Trí & Doanh Nghiệp</th>
                      <th className="py-3 px-4">Ngày Gửi</th>
                      <th className="py-3 px-4">Trạng Thái Tuyển Dụng</th>
                      <th className="py-3 px-4">Lịch Phỏng Vấn / Onboard</th>
                      <th className="py-3 px-4 text-right">Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredMyCandidates.map((c) => {
                      const cvRes = (c.cvResultRaw || '').toUpperCase();
                      const pvRes = (c.pvResultRaw || '').toUpperCase();
                      const isPassCv = cvRes.includes('PASS');
                      const isOnboard = Boolean(c.onboardingDate) || pvRes.includes('ONBOARD');
                      const isFail = cvRes.includes('FAIL') || pvRes.includes('FAIL') || cvRes.includes('LOẠI');

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                            {c.desiredSalary && (
                              <div className="text-[11px] text-slate-400">Lương mong muốn: {c.desiredSalary}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{c.position || 'N/A'}</div>
                            <div className="text-[11px] text-slate-400">{c.company || 'Doanh nghiệp đối tác'}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {c.timestamp || 'Mới cập nhật'}
                          </td>
                          <td className="py-3.5 px-4">
                            {isOnboard ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Trúng tuyển (Onboard)</span>
                              </span>
                            ) : isFail ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-medium text-[11px]">
                                <X className="w-3 h-3 text-rose-500" />
                                <span>{c.cvResultRaw || 'Không phù hợp'}</span>
                              </span>
                            ) : isPassCv ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold text-[11px]">
                                <Check className="w-3 h-3 text-blue-600" />
                                <span>PASS CV (Đã duyệt)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium text-[11px]">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>{c.cvResultRaw || 'Mới tiếp nhận'}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {c.onboardingDate ? (
                              <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                                Onboard: {c.onboardingDate}
                              </div>
                            ) : c.interviewDate ? (
                              <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                                Lịch PV: {c.interviewDate} {c.interviewTime || ''}
                              </div>
                            ) : (
                              <div className="text-slate-400 text-[11px]">Đang xếp lịch</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {c.cvUrl ? (
                              <a
                                href={c.cvUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                                title="Xem file CV"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                <span>Xem CV</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Chưa tìm thấy hồ sơ ứng viên nào
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {myCandidates.length === 0
                    ? `Mã CTV [${activeCtvCode}] hiện chưa gửi hồ sơ nào lên hệ thống. Hãy gửi CV ứng viên đầu tiên để kích hoạt hoa hồng!`
                    : 'Không có ứng viên nào khớp với bộ lọc tìm kiếm hiện tại.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedJobForSubmit(null);
                    setIsSubmitModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Nộp CV Ứng Viên Đầu Tiên</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Prompt State when no CTV is identified */
          <div className="p-8 text-center bg-slate-50/80 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900/50">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tra Cứu Hồ Sơ & Hoa Hồng Theo Từng CTV
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Nhập Mã CTV của bạn (ví dụ: CTV01, CTV02...) hoặc bấm Đăng Nhập để xem toàn bộ danh sách ứng viên, lịch phỏng vấn và trạng thái hoa hồng của riêng bạn.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="text"
                value={manualLookupCode}
                onChange={(e) => setManualLookupCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã CTV của bạn..."
                className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold font-mono uppercase focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  if (manualLookupCode.trim()) {
                    triggerCelebration();
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Tra Cứu Ngay
              </button>
              <button
                onClick={onOpenCtvAuth}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer"
              >
                Đăng Nhập CTV
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* 🧮 BẢNG TÍNH HOA HỒNG & THƯỞNG BẬC CỘNG TÁC VIÊN */}
      {(activeSection === 'all' || activeSection === 'calculator') && (
        <CtvEarningsCalculator
          onOpenSubmitCv={() => {
            setSelectedJobForSubmit(null);
            setIsSubmitModalOpen(true);
          }}
        />
      )}

      {/* 🔗 BỘ CÔNG CỤ TIẾP THỊ & LINK GIỚI THIỆU CTV */}
      {(activeSection === 'all' || activeSection === 'referral') && (
        <CtvReferralKit
          activeCtvCode={activeCtvCode}
          currentCtv={currentCtv}
        />
      )}

      {/* 🏆 BẢNG VINH DANH CỘNG TÁC VIÊN XUẤT SẮC */}
      {(activeSection === 'all' || activeSection === 'leaderboard') && (
        <CtvLeaderboard
          leaderboard={ctvLeaderboard}
          activeCtvCode={activeCtvCode}
        />
      )}

      {/* 🚀 4. QUY TRÌNH 3 BƯỚC HỢP TÁC KIẾM HOA HỒNG (Refined Aesthetics) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Quy Trình 3 Bước Giới Thiệu & Nhận Hoa Hồng
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Đơn giản, minh bạch và nhận tiền hoa hồng chuyển khoản ngay sau khi ứng viên hoàn tất thử việc
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-800/40 w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Cam kết bảo mật & quyền lợi CTV</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-md shadow-blue-500/20">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Chọn Việc Làm Phù Hợp</h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Duyệt danh sách các việc làm đang mở tại tab <strong>"Việc Làm Đang Tuyển"</strong>. Chọn các vị trí phù hợp với bạn bè, mạng lưới hoặc thế mạnh của bạn.
            </p>
          </div>

          <div className="relative p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Đăng Tin & Sơ Vấn Ứng Viên</h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dùng công cụ <strong>"Gen Content Tuyển Dụng"</strong> để tạo bài đăng hấp dẫn và <strong>"Tìm Group Đăng Tin"</strong> để chia sẻ lên các nhóm Facebook/Zalo.
            </p>
          </div>

          <div className="relative p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-md shadow-emerald-500/20">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Gửi CV & Nhận Hoa Hồng</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Nộp CV trực tiếp trên web với mã CTV của bạn. Khi ứng viên nhận việc (onboard), bạn nhận ngay hoa hồng chuyển khoản 100%!
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedJobForSubmit(null);
                setIsSubmitModalOpen(true);
              }}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Nộp CV Ứng Viên Ngay</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 5. TOP JOBS TUYỂN GẤP & HOA HỒNG CAO */}
      {(activeSection === 'all' || activeSection === 'jobs') && (
        <>
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Việc Làm Tuyển Gấp & Hoa Hồng Cao Tuần Này
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Những vị trí đang cần gấp ứng viên với mức thưởng hấp dẫn nhất
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateToJobs && onNavigateToJobs()}
                className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem tất cả ({activeJobs.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {highBonusJobs.map((job) => {
                const isUrgent = (job.status || '').toLowerCase().includes('gấp');
                return (
                  <div
                    key={job.id}
                    className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-blue-400/50 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top tags */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {job.industry || 'Ngành nghề'}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isUrgent
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60'
                              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/60'
                          }`}
                        >
                          {isUrgent && <Flame className="w-3 h-3 text-rose-500" />}
                          <span>{job.status || 'Đang tuyển'}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onOpenJobDetail && onOpenJobDetail(job)}
                        className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {job.title}
                      </h3>

                      {/* Company & Location */}
                      <div className="mt-2.5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{job.company || 'Doanh nghiệp đối tác'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{job.location || 'Toàn quốc'}</span>
                        </div>
                      </div>

                      {/* Salary & Bonus Box */}
                      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800">
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400">Mức lương: </span>
                          <strong className="text-slate-800 dark:text-slate-200">{job.salary || 'Thỏa thuận'}</strong>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Hoa hồng CTV:</span>
                          </span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                            {job.bonus || 'Thỏa thuận'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenSubmitForJob(job)}
                        className="py-2 px-3 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                        title="Nộp CV ứng viên cho vị trí này"
                      >
                        <FileUp className="w-3.5 h-3.5 text-white" />
                        <span>Nộp CV</span>
                      </button>
                      <button
                        onClick={() => onNavigateToContentGen && onNavigateToContentGen(job)}
                        className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Gen Bài Đăng</span>
                      </button>
                      <button
                        onClick={() => onOpenJobDetail && onOpenJobDetail(job)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Xem chi tiết JD"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🏷️ 6. INDUSTRY DISTRIBUTION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              Khám Phá Việc Làm Theo Nhóm Ngành
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {industryDistribution.map(([ind, count]) => (
                <button
                  key={ind}
                  onClick={() => onNavigateToJobs && onNavigateToJobs(ind)}
                  className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{ind}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── 7. POPUP MODAL NỘP CV TRỰC TIẾP (DIRECT IN-APP MODAL) ── */}
      <CtvSubmitCandidateModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        jobItems={activeJobs}
        initialJob={selectedJobForSubmit}
        currentCtv={currentCtv}
        onSubmitCandidate={onSubmitCandidate}
        onOpenCtvAuth={onOpenCtvAuth}
      />
    </div>
  );
}
