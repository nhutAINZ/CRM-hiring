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


import {
  fetchSheet1Data,
  fetchSheet2Data,
  fetchCtvSheetData,
  fetchJobSheetData,
  getStoredConfig,
  getSheet2ViewUrl,
  getCtvSheetViewUrl,
  getJobSheetViewUrl,
  CTV_SHEET_URL,
  JOB_SHEET_URL
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
  
  // Default view is 'table' (Vị trí ứng tuyển matching user screenshot)
  const [activeView, setActiveView] = useState('table'); // 'table' | 'jobs' | 'dashboard' | 'kanban' | 'analytics' | 'urgent' | 'clients' | 'ctv'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data state
  const [candidates, setCandidates] = useState([]);
  const [sheet2Items, setSheet2Items] = useState([]);
  const [ctvItems, setCtvItems] = useState([]);
  const [jobItems, setJobItems] = useState([]);
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
      const [sheet1List, sheet2List, ctvList, jobList] = await Promise.all([
        fetchSheet1Data(config.sheet1Id, config.sheet1Gid),
        fetchSheet2Data(config.sheet2Id, config.sheet2Gid),
        fetchCtvSheetData(config.ctvSheetId, config.ctvSheetGid),
        fetchJobSheetData(config.jobSheetId, config.jobSheetGid)
      ]);

      setCandidates(sheet1List);
      setSheet2Items(sheet2List);
      setCtvItems(ctvList);
      setJobItems(jobList);
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
    config.jobSheetGid
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

  const handleOpenDetail = (candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  };

  const handleOpenEmail = (candidate) => {
    setSelectedCandidate(candidate);
    setIsEmailOpen(true);
  };

  const handleExportCsv = () => {
    exportCandidatesToCsv(filteredCandidates, 'danh_sach_ung_vien_tuyen_dung.csv');
  };

  const sheet2ViewUrl = getSheet2ViewUrl(config.sheet2Id);
  const jobSheetUrl = getJobSheetViewUrl(config.jobSheetId, config.jobSheetGid);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* ── Left Sidebar Navigation (FastHunt Blue Theme & Logo) ── */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        candidateCount={candidates.length}
        urgentCount={globalMetrics.urgentCandidates.length}
        jobCount={jobItems.length}
        jobSheetUrl={jobSheetUrl}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTemplates={() => setIsTemplateEditorOpen(true)}
        onExportCsv={handleExportCsv}
        onOpenUpdates={() => setIsUpdatesOpen(true)}
      />

      {/* ── Main Layout Content Container (Padded left for Sidebar) ── */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* ── Top Red Banner Announcement ("Chia sẻ cho bạn ngay, nhận ngay phần thưởng") ── */}
        <TopBanner
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onOpenRewards={() => setIsSettingsOpen(true)}
        />

        {/* ── Top Auxiliary CRM Header Bar ── */}
        <Header
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={loadAllData}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTemplates={() => setIsTemplateEditorOpen(true)}
          onExportCsv={handleExportCsv}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          candidateCount={candidates.length}
          activeView={activeView}
          setActiveView={setActiveView}
          urgentCount={globalMetrics.urgentCandidates.length}
        />

        {/* ── Main Content Area ── */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto space-y-6">
          
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

          {/* ── 1. Candidate Management Table View (Trang Mặc Định theo Screenshot) ── */}
          {activeView === 'table' && (
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

          {/* ── 2. Bảng Tin & Link Jobs Tuyển Dụng View ── */}
          {activeView === 'jobs' && (
            <JobsView
              jobItems={jobItems}
              candidates={candidates}
              jobSheetUrl={jobSheetUrl}
              onNavigateToCandidateJob={(jobTitle) => {
                setFilters((prev) => ({ ...prev, position: jobTitle }));
                setActiveView('table');
              }}
              onOpenJobDetail={(job) => {
                setSelectedJob(job);
                setIsJobDetailOpen(true);
              }}
            />
          )}

          {/* ── 3. Executive CRM Dashboard Overview ── */}
          {activeView === 'dashboard' && (
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
          {activeView === 'kanban' && (
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
          {activeView === 'analytics' && (
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
          {activeView === 'urgent' && (
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
          {activeView === 'clients' && (
            <ClientsView
              candidates={candidates}
              sheet2Items={sheet2Items}
              sheet2ViewUrl={sheet2ViewUrl}
              onNavigateToJob={(jobTitle) => {
                setFilters((prev) => ({ ...prev, position: jobTitle }));
                setActiveView('table');
              }}
            />
          )}

          {/* ── 8. Quản Lý & Hỗ Trợ Mã CTV View ── */}
          {activeView === 'ctv' && (
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
          {activeView === 'zalo' && (
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
      />
    </div>
  );
}

