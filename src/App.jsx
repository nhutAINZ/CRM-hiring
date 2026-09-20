import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TopBanner from './components/TopBanner';
import DashboardOverview from './components/DashboardOverview';
import FilterBar from './components/FilterBar';
import OverviewMetrics from './components/OverviewMetrics';
import UrgentAlertSection from './components/UrgentAlertSection';
import AnalyticsCharts from './components/AnalyticsCharts';
import CandidateTable from './components/CandidateTable';
import ClientsView from './components/ClientsView';
import CtvManagementView from './components/CtvManagementView';
import JobsView from './components/JobsView';
import KanbanBoard from './components/KanbanBoard';
import CandidateDetailModal from './components/CandidateDetailModal';
import JobDetailModal from './components/JobDetailModal';
import EmailGeneratorModal from './components/EmailGeneratorModal';
import TemplateEditorModal from './components/TemplateEditorModal';
import SettingsModal from './components/SettingsModal';
import UpdatesModal from './components/UpdatesModal';
import AiRecruiterBot from './components/AiRecruiterBot';
import ZaloAssistantView from './components/ZaloAssistantView';
import ZaloBroadcastModal from './components/ZaloBroadcastModal';
import CvAnalysisDetailModal from './components/CvAnalysisDetailModal';
import ArchifyView from './components/ArchifyView';
import MultiAgentHubView from './components/MultiAgentHubView';
import MobileBottomNav from './components/MobileBottomNav';
import MobileVerticalTaskbar from './components/MobileVerticalTaskbar';
import MobileComponentSelector from './components/MobileComponentSelector';
import MobileFAB from './components/MobileFAB';
import AdminAuthModal from './components/AdminAuthModal';
import CtvDashboardView from './components/CtvDashboardView';
import RecruitmentContentGeneratorView from './components/RecruitmentContentGeneratorView';
import RecruitmentGroupsView from './components/RecruitmentGroupsView';
import { Lock, Unlock } from 'lucide-react';



import {
  fetchSheet1Data,
  fetchSheet2Data,
  fetchCtvSheetData,
  fetchJobSheetData,
  fetchIntergreatSheetData,
  getStoredConfig,
  getSheet2ViewUrl,
  getCtvSheetViewUrl,
  getJobSheetViewUrl,
  getIntergreatSheetViewUrl,
  CTV_SHEET_URL,
  JOB_SHEET_URL,
  INTERGREAT_SHEET_URL
} from './services/sheetsService';

import {
  calculateMetrics,
  isWithinDateRange,
  normalizeCvResult,
  normalizePvResult,
  exportCandidatesToCsv,
  twoPointerFilter
} from './utils/dataNormalizer';

export default function App() {
  // Default to Light Mode for clean, high-contrast surfaces matching screenshot
  const [darkMode, setDarkMode] = useState(false);
  const [config, setConfig] = useState(getStoredConfig);
  
  // Admin & Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fasthunt_is_admin') === 'true';
    }
    return false;
  });
  const [adminPassword, setAdminPassword] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fasthunt_admin_pwd');
      if (stored && stored !== 'admin123') return stored;
      return 'nhut2206';
    }
    return 'nhut2206';
  });
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [selectedJobForTools, setSelectedJobForTools] = useState(null);

  // Active view: default to 'ctv-dashboard' or read from URL hash
  const [activeView, setActiveView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const validViews = [
        'ctv-dashboard', 'jobs', 'content-gen', 'group-finder',
        'multiagent', 'archify', 'table', 'dashboard', 'kanban', 'analytics', 'urgent', 'clients', 'ctv', 'zalo'
      ];
      if (validViews.includes(hash)) {
        return hash;
      }
    }
    return 'ctv-dashboard';
  });

  const handleLoginAdminSuccess = (targetView = null) => {
    setIsAdmin(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fasthunt_is_admin', 'true');
    }
    if (activeView === 'ctv-dashboard' || targetView) {
      setActiveView(targetView || 'dashboard');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fasthunt_is_admin', 'false');
    }
    setActiveView('ctv-dashboard');
  };

  const handleChangeAdminPassword = (newPwd) => {
    setAdminPassword(newPwd);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fasthunt_admin_pwd', newPwd);
    }
  };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Synchronize hash with activeView
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = activeView;
    }
  }, [activeView]);


  // Data state
  const [candidates, setCandidates] = useState([]);
  const [sheet2Items, setSheet2Items] = useState([]);
  const [ctvItems, setCtvItems] = useState([]);
  const [jobItems, setJobItems] = useState([]);
  const [intergreatItems, setIntergreatItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');


  // Modals state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastJob, setBroadcastJob] = useState(null);
  const [isCvAnalysisOpen, setIsCvAnalysisOpen] = useState(false);
  const [cvAnalysisData, setCvAnalysisData] = useState(null);
  const [isComponentSelectorOpen, setIsComponentSelectorOpen] = useState(false);
  const [isAiBotOpen, setIsAiBotOpen] = useState(false);


  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    datePreset: 'all',
    startDate: '',
    endDate: '',
    ctv: 'all',
    position: 'all',
    cvStatus: 'all',
    pvStatus: 'all'
  });

  // Apply dark mode class to root HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Data function
  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMsg('');

    try {
      const [sheet1List, sheet2List, ctvList, jobList, intergreatList] = await Promise.all([
        fetchSheet1Data(config.sheet1Id, config.sheet1Gid),
        fetchSheet2Data(config.sheet2Id, config.sheet2Gid),
        fetchCtvSheetData(config.ctvSheetId, config.ctvSheetGid),
        fetchJobSheetData(config.jobSheetId, config.jobSheetGid),
        fetchIntergreatSheetData(config.intergreatSheetId || '1Krhpgtd-l-4DK0GwIhnntatbhakC5GYHKK0jVc5Pij4', config.intergreatSheetGid || '0')
      ]);

      setCandidates(sheet1List);
      setSheet2Items(sheet2List);
      setCtvItems(ctvList);
      setJobItems(jobList);
      setIntergreatItems(intergreatList);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data from Google Sheets', err);
      setErrorMsg(err.message || 'Không thể tải dữ liệu từ Google Sheet. Vui lòng kiểm tra lại cấu hình ID.');
    } finally {
      setIsRefreshing(false);
    }
  }, [
    config.sheet1Id,
    config.sheet1Gid,
    config.sheet2Id,
    config.sheet2Gid,
    config.ctvSheetId,
    config.ctvSheetGid,
    config.jobSheetId,
    config.jobSheetGid,
    config.intergreatSheetId,
    config.intergreatSheetGid
  ]);


  // Initial Load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Auto Refresh timer setup
  useEffect(() => {
    if (config.autoRefreshInterval && config.autoRefreshInterval > 0) {
      const ms = config.autoRefreshInterval * 60 * 1000;
      const interval = setInterval(() => {
        loadAllData();
      }, ms);
      return () => clearInterval(interval);
    }
  }, [config.autoRefreshInterval, loadAllData]);

  // Unique options for filter dropdowns
  const ctvOptions = useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => {
      if (c.ctvCode && c.ctvCode !== 'N/A') set.add(c.ctvCode);
    });
    return Array.from(set).sort();
  }, [candidates]);

  const positionOptions = useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => {
      if (c.positionCompany) set.add(c.positionCompany);
    });
    return Array.from(set).sort();
  }, [candidates]);

  // Filtered Candidates list
  const filteredCandidates = useMemo(() => {
    return twoPointerFilter(candidates, (c) => {
      // 1. Search text filter
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchName = c.name && c.name.toLowerCase().includes(q);
        const matchCtv = c.ctvCode && c.ctvCode.toLowerCase().includes(q);
        const matchPos = c.positionCompany && c.positionCompany.toLowerCase().includes(q);
        const matchEmail = c.email && c.email.toLowerCase().includes(q);
        const matchPhone = c.phone && c.phone.toLowerCase().includes(q);
        if (!matchName && !matchCtv && !matchPos && !matchEmail && !matchPhone) return false;
      }

      // 2. Date range filter
      if (!isWithinDateRange(c, filters.datePreset, filters.startDate, filters.endDate)) {
        return false;
      }

      // 3. CTV filter
      if (filters.ctv !== 'all' && c.ctvCode !== filters.ctv) {
        return false;
      }

      // 4. Position filter
      if (filters.position !== 'all' && c.positionCompany !== filters.position) {
        return false;
      }

      // 5. CV status filter
      if (filters.cvStatus !== 'all') {
        const cvNorm = normalizeCvResult(c.cvResultRaw);
        if (cvNorm.key !== filters.cvStatus) return false;
      }

      // 6. PV status filter
      if (filters.pvStatus !== 'all') {
        const pvNorm = normalizePvResult(c.pvResultRaw, c.interviewDate);
        if (pvNorm.key !== filters.pvStatus) return false;
      }

      return true;
    });
  }, [candidates, filters]);

  // Metrics calculation
  const metrics = useMemo(() => {
    return calculateMetrics(filteredCandidates);
  }, [filteredCandidates]);

  // Full global metrics for dashboard
  const globalMetrics = useMemo(() => {
    return calculateMetrics(candidates);
  }, [candidates]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      datePreset: 'all',
      startDate: '',
      endDate: '',
      ctv: 'all',
      position: 'all',
      cvStatus: 'all',
      pvStatus: 'all'
    });
  };

  const handleOpenDetail = useCallback((candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  }, []);

  const handleOpenJobDetail = useCallback((job) => {
    setSelectedJob(job);
    setIsJobDetailOpen(true);
  }, []);

  const handleOpenEmail = useCallback((candidate) => {
    setSelectedCandidate(candidate);
    setIsEmailOpen(true);
  }, []);

  const handleExportCsv = useCallback(() => {
    exportCandidatesToCsv(filteredCandidates, 'danh_sach_ung_vien_tuyen_dung.csv');
  }, [filteredCandidates]);

  const handleDownloadArchitectureMarkdown = useCallback(() => {
    const markdownContent = `# 🏛️ FastHunt Recruitment Agent - Archify System Architecture & UML Specification\n\n> Version: 2.5.0\n> Status: Production-Ready & Verified\n\nXem toàn bộ mô hình C4, Sequence Flows, Database ERD, React Component UML và Candidate State Machine tại file ARCHIFY_SYSTEM_ARCHITECTURE.md.`;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ARCHIFY_SYSTEM_ARCHITECTURE.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const sheet2ViewUrl = getSheet2ViewUrl(config.sheet2Id);
  const jobSheetUrl = getJobSheetViewUrl(config.jobSheetId, config.jobSheetGid);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* ── Left Sidebar Navigation (Desktop Sticky + Mobile Slide-Over Drawer) ── */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        candidateCount={candidates.length}
        urgentCount={globalMetrics.urgentCandidates.length}
        jobCount={jobItems.length}
        jobSheetUrl={jobSheetUrl}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileDrawerOpen}
        setMobileOpen={setMobileDrawerOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTemplates={() => setIsTemplateEditorOpen(true)}
        onExportCsv={handleExportCsv}
        onOpenUpdates={() => setIsUpdatesOpen(true)}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* ── Main Layout Content Container (Zero margin on mobile, padded on desktop) ── */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ml-0 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        {/* ── Top Red Banner Announcement ("Tuyển nhiều tiền nhiều...") ── */}
        <TopBanner
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onOpenRewards={() => setIsSettingsOpen(true)}
          onOpenMobileMenu={() => setMobileDrawerOpen(true)}
        />

        {/* ── Top Auxiliary CRM Header Bar ── */}
        <Header
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={loadAllData}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTemplates={() => setIsTemplateEditorOpen(true)}
          onExportCsv={handleExportCsv}
          onOpenUpdates={() => setIsUpdatesOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          candidateCount={candidates.length}
          activeView={activeView}
          setActiveView={setActiveView}
          urgentCount={globalMetrics.urgentCandidates.length}
          onOpenMobileMenu={() => setMobileDrawerOpen(true)}
          isAdmin={isAdmin}
          onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
          onAdminLogout={handleAdminLogout}
        />

        {/* ── Main Content Area (Optimized padding for phones and desktop) ── */}
        <main className="flex-1 p-3 sm:p-6 pb-24 md:pb-8 max-w-[1600px] w-full mx-auto space-y-4 sm:space-y-6">

          
          {/* Error Notification Banner */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300 p-4 rounded-2xl text-xs flex items-center justify-between animate-slide-down shadow-xs">
              <span>⚠️ {errorMsg}</span>
              <button
                onClick={loadAllData}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer transition-all"
              >
                Thử lại ngay
              </button>
            </div>
          )}

          {/* ── 0. Cổng Thông Tin & Dashboard Dành Cho CTV ── */}
          {activeView === 'ctv-dashboard' && (
            <CtvDashboardView
              jobItems={jobItems}
              onNavigateToJobs={() => setActiveView('jobs')}
              onNavigateToContentGen={(job) => {
                setSelectedJobForTools(job);
                setActiveView('content-gen');
              }}
              onNavigateToGroupFinder={(job) => {
                setSelectedJobForTools(job);
                setActiveView('group-finder');
              }}
              onOpenJobDetail={(job) => {
                setSelectedJob(job);
                setIsJobDetailOpen(true);
              }}
            />
          )}

          {/* ── Trợ Lý Gen Content Tuyển Dụng Đa Kênh ── */}
          {activeView === 'content-gen' && (
            <RecruitmentContentGeneratorView
              jobItems={jobItems}
              selectedJobContext={selectedJobForTools}
              onNavigateToGroupFinder={(job) => {
                setSelectedJobForTools(job);
                setActiveView('group-finder');
              }}
            />
          )}

          {/* ── Danh Bạ & Gợi Ý Group Tuyển Dụng ── */}
          {activeView === 'group-finder' && (
            <RecruitmentGroupsView
              jobItems={jobItems}
              selectedJobContext={selectedJobForTools}
              onNavigateToContentGen={(job) => {
                setSelectedJobForTools(job);
                setActiveView('content-gen');
              }}
            />
          )}

          {/* ── Khóa Bảo Mật Cho Các Tính Năng Quản Trị Viên (Admin Lock Guard) ── */}
          {['table', 'dashboard', 'kanban', 'analytics', 'urgent', 'clients', 'ctv', 'zalo', 'multiagent', 'archify'].includes(activeView) && !isAdmin && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xl space-y-4 animate-fade-in my-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900/50">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Khu Vực Quản Trị Hệ Thống
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Dữ liệu ứng viên, khách hàng và cấu hình CRM nội bộ được bảo mật bằng mật khẩu quản trị. Vui lòng đăng nhập để mở khóa.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setActiveView('ctv-dashboard')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  ← Quay Lại Cổng CTV
                </button>
                <button
                  onClick={() => setIsAdminAuthOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Đăng Nhập Quản Trị</span>
                </button>
              </div>
            </div>
          )}

          {/* ── 1. Candidate Management Table View (Trang Mặc Định theo Screenshot) ── */}
          {activeView === 'table' && isAdmin && (
            <div className="space-y-4 animate-fade-in">
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                ctvOptions={ctvOptions}
                positionOptions={positionOptions}
                onResetFilters={handleResetFilters}
                totalResults={filteredCandidates.length}
              />
              <CandidateTable
                candidates={filteredCandidates}
                onOpenDetail={handleOpenDetail}
                onOpenEmail={handleOpenEmail}
                sheet2ViewUrl={sheet2ViewUrl}
                sheet2Items={sheet2Items}
                jobItems={jobItems}
              />
            </div>
          )}

          {/* ── 2. Bảng Tin & Link Jobs Tuyển Dụng View (Công khai cho cả CTV & Admin) ── */}
          {activeView === 'jobs' && (
            <JobsView
              jobItems={jobItems}
              candidates={candidates}
              jobSheetUrl={jobSheetUrl}
              onNavigateToCandidateJob={(jobTitle) => {
                if (!isAdmin) {
                  setIsAdminAuthOpen(true);
                  return;
                }
                setFilters((prev) => ({ ...prev, position: jobTitle }));
                setActiveView('table');
              }}
              onOpenJobDetail={(job) => {
                setSelectedJob(job);
                setIsJobDetailOpen(true);
              }}
              onNavigateToContentGen={(job) => {
                setSelectedJobForTools(job);
                setActiveView('content-gen');
              }}
              onNavigateToGroupFinder={(job) => {
                setSelectedJobForTools(job);
                setActiveView('group-finder');
              }}
            />
          )}

          {/* ── 3. Executive CRM Dashboard Overview ── */}
          {activeView === 'dashboard' && isAdmin && (
            <DashboardOverview
              candidates={candidates}
              metrics={globalMetrics}
              sheet2Items={sheet2Items}
              sheet2ViewUrl={sheet2ViewUrl}
              jobItems={jobItems}
              onNavigateTab={(tab) => setActiveView(tab)}
              onOpenDetail={handleOpenDetail}
              onOpenEmail={handleOpenEmail}
              darkMode={darkMode}
            />
          )}

          {/* ── 4. Kanban Pipeline View ── */}
          {activeView === 'kanban' && isAdmin && (
            <div className="animate-fade-in space-y-4">
              <KanbanBoard
                candidates={filteredCandidates}
                onOpenDetail={handleOpenDetail}
                onOpenEmail={handleOpenEmail}
                sheet2ViewUrl={sheet2ViewUrl}
              />
            </div>
          )}

          {/* ── 5. Analytics & Deep-dive Reporting View ── */}
          {activeView === 'analytics' && isAdmin && (
            <div className="animate-fade-in space-y-6">
              <OverviewMetrics
                metrics={metrics}
                onSelectUrgent={() => setActiveView('urgent')}
              />
              <AnalyticsCharts
                candidates={filteredCandidates}
                metrics={metrics}
                darkMode={darkMode}
              />
            </div>
          )}

          {/* ── 6. Urgent Action Queue View ── */}
          {activeView === 'urgent' && isAdmin && (
            <div className="space-y-6 animate-fade-in">
              <UrgentAlertSection
                urgentCandidates={globalMetrics.urgentCandidates}
                onOpenEmail={handleOpenEmail}
                onOpenDetail={handleOpenDetail}
                sheet2ViewUrl={sheet2ViewUrl}
              />
              <CandidateTable
                candidates={globalMetrics.urgentCandidates}
                onOpenDetail={handleOpenDetail}
                onOpenEmail={handleOpenEmail}
                sheet2ViewUrl={sheet2ViewUrl}
                sheet2Items={sheet2Items}
                jobItems={jobItems}
              />
            </div>
          )}

          {/* ── 7. Khách Hàng & Connect Jobs Portal View ── */}
          {activeView === 'clients' && isAdmin && (
            <ClientsView
              candidates={candidates}
              sheet2Items={sheet2Items}
              sheet2ViewUrl={sheet2ViewUrl}
              intergreatItems={intergreatItems}
              intergreatSheetUrl={getIntergreatSheetViewUrl(config.intergreatSheetId, config.intergreatSheetGid)}
              onNavigateToJob={(jobTitle) => {
                setFilters((prev) => ({ ...prev, position: jobTitle }));
                setActiveView('table');
              }}
            />
          )}

          {/* ── 8. Quản Lý & Hỗ Trợ Mã CTV View ── */}
          {activeView === 'ctv' && isAdmin && (
            <CtvManagementView
              ctvItems={ctvItems}
              candidates={candidates}
              ctvSheetUrl={getCtvSheetViewUrl(config.ctvSheetId, config.ctvSheetGid)}
              onFilterByCtv={(ctvCode) => {
                setFilters((prev) => ({ ...prev, ctv: ctvCode }));
                setActiveView('table');
              }}
            />
          )}

          {/* ── 9. Trợ Lý Tuyển Dụng Zalo Cá Nhân (Nick Thường) ── */}
          {activeView === 'zalo' && isAdmin && (
            <ZaloAssistantView
              jobItems={jobItems}
              candidates={candidates}
              onOpenCandidateDetail={handleOpenDetail}
              onOpenEmail={handleOpenEmail}
              onOpenBroadcastModal={(job) => {
                setBroadcastJob(job || jobItems[0]);
                setIsBroadcastOpen(true);
              }}
              onOpenAnalysisModal={(analysis) => {
                setCvAnalysisData(analysis);
                setIsCvAnalysisOpen(true);
              }}
            />
          )}

          {/* ── 10. Multi-Agent Swarm Command Center View ── */}
          {activeView === 'multiagent' && isAdmin && (
            <MultiAgentHubView
              candidates={candidates}
              jobItems={jobItems}
              ctvItems={ctvItems}
              onOpenEmail={handleOpenEmail}
              onOpenDetail={handleOpenDetail}
              onOpenJobDetail={handleOpenJobDetail}
              onOpenBroadcast={(job) => {
                setBroadcastJob(job || jobItems[0]);
                setIsBroadcastOpen(true);
              }}
              darkMode={darkMode}
            />
          )}

          {/* ── 11. Archify System Architecture & UML Studio ── */}
          {activeView === 'archify' && isAdmin && (
            <ArchifyView onExportMarkdown={handleDownloadArchitectureMarkdown} />
          )}
        </main>
      </div>

      {/* Modals */}
      {isDetailOpen && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          candidatesList={filteredCandidates}
          jobItems={jobItems}
          onClose={() => setIsDetailOpen(false)}
          onOpenEmail={handleOpenEmail}
          sheet2ViewUrl={sheet2ViewUrl}
          onNavigateCandidate={(nextC) => setSelectedCandidate(nextC)}
        />
      )}

      {isJobDetailOpen && (
        <JobDetailModal
          job={selectedJob}
          candidates={candidates}
          onClose={() => setIsJobDetailOpen(false)}
          onNavigateToCandidateJob={(jobTitle) => {
            setFilters((prev) => ({ ...prev, position: jobTitle }));
            setActiveView('table');
          }}
          onOpenEmailCandidate={handleOpenEmail}
        />
      )}

      {isEmailOpen && (
        <EmailGeneratorModal
          candidate={selectedCandidate}
          onClose={() => setIsEmailOpen(false)}
          onOpenEditor={() => {
            setIsEmailOpen(false);
            setIsTemplateEditorOpen(true);
          }}
        />
      )}

      {isTemplateEditorOpen && (
        <TemplateEditorModal onClose={() => setIsTemplateEditorOpen(false)} />
      )}

      {isSettingsOpen && (
        <SettingsModal
          config={config}
          onSaveConfig={(newConfig) => {
            setConfig(newConfig);
          }}
          onClose={() => setIsSettingsOpen(false)}
          onRefreshData={loadAllData}
        />
      )}

      {isUpdatesOpen && (
        <UpdatesModal
          onClose={() => setIsUpdatesOpen(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* ── Zalo Personal Broadcast & CTV Group Push Modal ── */}
      {isBroadcastOpen && (
        <ZaloBroadcastModal
          job={broadcastJob || jobItems[0]}
          jobsList={jobItems}
          onClose={() => setIsBroadcastOpen(false)}
          onApproveAndSend={() => {
            setIsBroadcastOpen(false);
          }}
        />
      )}

      {/* ── Admin Authentication Modal ── */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onLoginSuccess={handleLoginAdminSuccess}
        currentPassword={adminPassword}
        onChangePassword={handleChangeAdminPassword}
      />

      {/* ── CV Analysis Detail Modal ── */}
      {isCvAnalysisOpen && (
        <CvAnalysisDetailModal
          analysisData={cvAnalysisData}
          onClose={() => setIsCvAnalysisOpen(false)}
          onOpenCandidateDetail={handleOpenDetail}
          onOpenEmail={handleOpenEmail}
        />
      )}

      {/* ── FastHunt AI Recruitment Chatbot Assistant ── */}
      <AiRecruiterBot
        candidates={candidates}
        sheet2Items={sheet2Items}
        jobItems={jobItems}
        sheet2ViewUrl={sheet2ViewUrl}
        jobSheetUrl={jobSheetUrl}
        onOpenEmail={handleOpenEmail}
        onOpenDetail={handleOpenDetail}
        externalIsOpen={isAiBotOpen}
        setExternalIsOpen={setIsAiBotOpen}
      />

      {/* ── Mobile Vertical Floating Taskbar (Thanh task bar dọc di động) ── */}
      <MobileVerticalTaskbar
        activeView={activeView}
        setActiveView={setActiveView}
        candidateCount={candidates.length}
        urgentCount={globalMetrics.urgentCandidates.length}
        jobCount={jobItems.length}
        onOpenComponentSelector={() => setIsComponentSelectorOpen(true)}
        onOpenAiBot={() => setIsAiBotOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTemplates={() => setIsTemplateEditorOpen(true)}
        onRefreshData={loadAllData}
        isRefreshing={isRefreshing}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
      />

      {/* ── Mobile Touch Component Selector Hub (Bộ chọn từng thành phần) ── */}
      <MobileComponentSelector
        isOpen={isComponentSelectorOpen}
        onClose={() => setIsComponentSelectorOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        candidateCount={candidates.length}
        urgentCount={globalMetrics.urgentCandidates.length}
        jobCount={jobItems.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTemplates={() => setIsTemplateEditorOpen(true)}
        onExportCsv={handleExportCsv}
        onOpenUpdates={() => setIsUpdatesOpen(true)}
        onOpenAiBot={() => setIsAiBotOpen(true)}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onAdminLogout={handleAdminLogout}
        jobSheetUrl={jobSheetUrl}
      />

      {/* ── Mobile Floating Action Speed Dial (FAB) ── */}
      <MobileFAB
        onRefresh={loadAllData}
        isRefreshing={isRefreshing}
        onExportCsv={handleExportCsv}
        onOpenAiBot={() => setIsAiBotOpen(true)}
        onOpenTemplates={() => setIsTemplateEditorOpen(true)}
      />

      {/* ── Mobile Native Bottom Navigation Bar (Visible only on mobile devices) ── */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        candidateCount={candidates.length}
        urgentCount={globalMetrics.urgentCandidates.length}
        jobCount={jobItems.length}
        onOpenMobileMenu={() => setMobileDrawerOpen(true)}
        onOpenComponentSelector={() => setIsComponentSelectorOpen(true)}
        isAdmin={isAdmin}
      />
    </div>
  );
}


