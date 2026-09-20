// ====================================================================
// FASTHUNT RECRUITMENT AGENT - ARCHIFY ARCHITECTURE & UML STUDIO
// Interactive System Architecture, C4 Models, Component UML, Sequence Flows,
// Database ERD & Candidate Lifecycle State Machine Engine
// ====================================================================

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Cpu,
  GitBranch,
  Database,
  Workflow,
  Code2,
  Copy,
  Check,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  Server,
  Smartphone,
  Globe,
  Bot,
  MessageCircle,
  FileSpreadsheet,
  Zap,
  ArrowRight,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ArchifyView({ onExportMarkdown }) {
  const [activeTab, setActiveTab] = useState('c4'); // 'c4' | 'components' | 'sequence' | 'erd' | 'statemachine' | 'modules'
  const [activeSequenceFlow, setActiveSequenceFlow] = useState('etl'); // 'etl' | 'aimatch' | 'zalo' | 'ctv'
  const [diagramMode, setDiagramMode] = useState('visual'); // 'visual' | 'code'
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  
  // Interactive State Machine Simulator State
  const [simulatedState, setSimulatedState] = useState('NEW');
  const [simHistory, setSimHistory] = useState(['Hồ sơ mới nộp (NEW)']);

  // Tab definitions
  const tabs = [
    { id: 'c4', label: 'C4 System Topology', icon: Layers, badge: 'System' },
    { id: 'components', label: 'Component UML Hierarchy', icon: Cpu, badge: 'React 19' },
    { id: 'sequence', label: 'Sequence Flow Diagrams', icon: GitBranch, badge: '4 Flows' },
    { id: 'erd', label: 'Database Schema & ERD', icon: Database, badge: '7 Entities' },
    { id: 'statemachine', label: 'Candidate State Machine', icon: Workflow, badge: 'Interactive' },
    { id: 'modules', label: 'Module Code & API Specs', icon: Code2, badge: 'TypeScript/JS' }
  ];

  // Mermaid Specs for copy & code view
  const mermaidSpecs = {
    c4: `graph TB
    subgraph Client_Tier ["Client Tier (Browser & Mobile)"]
        SPA["React 19 Single Page App\\n(Vite, Tailwind CSS, Lucide Icons, Recharts)"]
        ServiceWorker["Offline Cache & LocalStorage\\n(State Persistence, Offline Fallback)"]
    end

    subgraph Gateway_Tier ["Backend & Gateway Tier (Node.js)"]
        ExpressServer["Express.js Gateway Server (Port 3001)"]
        ZaloWebhookHandler["Zalo OA Webhook Controller (HMAC SHA256)"]
        AuthMiddleware["CORS & Request Validator"]
    end

    subgraph Service_Tier ["Application Service Layer"]
        SheetsService["sheetsService.js (GViz CSV ETL)"]
        AIMatchingService["aiMatchingService.js (Cosine Matcher)"]
        CVExtractorService["cvExtractor.js (NLP Skill Parser)"]
        ZaloOAService["zaloOaService.js (Zalo API Token & Broadcast)"]
        DataNormalizer["dataNormalizer.js (2-Pointer Fast Filter)"]
        EmailTemplateEngine["emailTemplates.js (Placeholder Engine)"]
    end

    subgraph Data_Tier ["Persistence & Cloud"]
        GoogleSheets[("Google Sheets Ecosystem\\n- Sheet1: Candidates\\n- Sheet2: Clients\\n- Sheet3: Jobs\\n- Sheet4: CTV")]
        RelationalDB[("PostgreSQL / SQLite Database")]
        MongoNoSQL[("MongoDB Document Store")]
    end

    SPA -->|GViz CSV Fetches| SheetsService
    SPA -->|REST API Calls| ExpressServer
    SPA -->|Offline Storage| ServiceWorker
    ExpressServer --> AuthMiddleware
    AuthMiddleware --> ZaloWebhookHandler
    ZaloWebhookHandler --> ZaloOAService
    SheetsService --> GoogleSheets
    SPA --> AIMatchingService
    SPA --> CVExtractorService
    SPA --> DataNormalizer
    SPA --> EmailTemplateEngine
    ExpressServer --> RelationalDB
    ExpressServer --> MongoNoSQL`,

    components: `classDiagram
    class App {
        +state darkMode: boolean
        +state activeView: string
        +state candidates: Candidate[]
        +state jobItems: Job[]
        +state ctvItems: CTV[]
        +state intergreatItems: Client[]
        +refreshData()
        +handleViewChange(view: string)
        +handleFilterChange(filters: FilterState)
    }

    class Header {
        +props activeView: string
        +props candidateCount: number
        +props isRefreshing: boolean
        +props onRefresh: function
    }

    class Sidebar {
        +props activeView: string
        +props collapsed: boolean
        +props mobileOpen: boolean
        +handleNavClick(viewId: string)
    }

    class CandidateTable {
        +props candidates: Candidate[]
        +onSelectCandidate()
        +onOpenEmail()
        +onAnalyzeCv()
    }

    class KanbanBoard {
        +props candidates: Candidate[]
        +onCandidateMove(id, status)
    }

    class JobsView {
        +props jobItems: Job[]
        +onAssignCandidate()
    }

    class ZaloAssistantView {
        +props candidates: Candidate[]
        +onSendZaloMessage()
    }

    App *-- Header
    App *-- Sidebar
    App *-- CandidateTable
    App *-- KanbanBoard
    App *-- JobsView
    App *-- ZaloAssistantView`,

    sequence_etl: `sequenceDiagram
    autonumber
    actor Recruiter as Recruiter / User
    participant App as App.jsx (React UI)
    participant SheetsSvc as sheetsService.js
    participant GoogleGViz as Google Sheets GViz Endpoint
    participant Normalizer as dataNormalizer.js
    participant State as Local React State

    Recruiter->>App: Clicks "Làm mới dữ liệu" / Page Load
    App->>SheetsSvc: fetchAllData(config)
    par Ingestion Sheet 1 (Candidates)
        SheetsSvc->>GoogleGViz: GET /gviz/tq?tqx=out:csv&sheet=Sheet1
        GoogleGViz-->>SheetsSvc: CSV Raw Text Data
    and Ingestion Sheet 2 (Intergreat CRM)
        SheetsSvc->>GoogleGViz: GET /gviz/tq?tqx=out:csv&gid=IntergreatGid
        GoogleGViz-->>SheetsSvc: CSV Raw Text Data
    and Ingestion Sheet 3 (Jobs Board)
        SheetsSvc->>GoogleGViz: GET /gviz/tq?tqx=out:csv&gid=JobsGid
        GoogleGViz-->>SheetsSvc: CSV Raw Text Data
    and Ingestion Sheet 4 (CTV List)
        SheetsSvc->>GoogleGViz: GET /gviz/tq?tqx=out:csv&gid=CtvGid
        GoogleGViz-->>SheetsSvc: CSV Raw Text Data
    end
    SheetsSvc->>Normalizer: normalizeCandidateData(rawItems)
    Normalizer->>Normalizer: Clean phone, parse VN dates, normalize status
    Normalizer-->>App: Sanitized Candidate[] & Metric objects
    App->>State: setCandidates(), setJobItems(), setLastUpdated(now)
    State-->>Recruiter: Render High-Contrast Table / KPI Cards`,

    sequence_aimatch: `sequenceDiagram
    autonumber
    actor Recruiter as Recruiter
    participant JobModal as JobDetailModal / CandidateModal
    participant AIMatcher as aiMatchingService.js
    participant CVExtractor as cvExtractor.js
    participant GeminiAI as Gemini LLM Engine

    Recruiter->>JobModal: Clicks "AI Match Candidate"
    JobModal->>AIMatcher: calculateJobCandidateMatches(job, candidateList)
    loop For Each Candidate
        AIMatcher->>CVExtractor: parseSkillsAndExperience(cvText)
        CVExtractor-->>AIMatcher: SkillVector {skills, expYears, level}
        AIMatcher->>AIMatcher: Weighted Score: 40% Skills + 25% Exp + 20% Level + 15% Loc
    end
    opt Deep AI Analysis
        AIMatcher->>GeminiAI: POST /generateContent (CV Summary + JD)
        GeminiAI-->>AIMatcher: Pros/Cons & Interview Question Recommendations
    end
    AIMatcher-->>JobModal: Sorted MatchList[] (Ranked by Match Score % desc)
    JobModal-->>Recruiter: Display Top Matching Candidates with Score Pills`,

    sequence_zalo: `sequenceDiagram
    autonumber
    actor Candidate as Candidate (Zalo App)
    participant ZaloOA as Zalo Official Account Server
    participant Gateway as Express Server (zaloServer.js)
    participant ZaloSvc as zaloOaService.js
    participant RecruiterUI as ZaloAssistantView.jsx

    Candidate->>ZaloOA: Sends Message "Lịch phỏng vấn vị trí Frontend"
    ZaloOA->>Gateway: POST /webhook/zalo (Payload + X-Zalo-Signature)
    Gateway->>Gateway: Verify HMAC SHA256 Signature
    alt Signature Valid
        Gateway->>ZaloSvc: processInboundEvent(event)
        ZaloSvc->>Gateway: Store message in memory / DB log
        Gateway-->>ZaloOA: HTTP 200 OK
        Gateway->>RecruiterUI: Push notification / WebSocket Update
    else Invalid Signature
        Gateway-->>ZaloOA: HTTP 403 Forbidden
    end`,

    sequence_ctv: `sequenceDiagram
    autonumber
    actor CTV as CTV Partner
    participant Sheet as Google Sheets (Sheet 4)
    participant App as App.jsx
    participant CtvView as CtvManagementView.jsx
    participant Normalizer as dataNormalizer.js

    CTV->>Sheet: Enters Candidate with CTV Code "CTV-08"
    App->>App: Polling / Refresh triggers ETL
    Normalizer->>Normalizer: Link Candidate.ctv_code == CTV.code
    Normalizer-->>CtvView: Update CTV Stats (Total Candidates, Passed, Commission)
    CtvView-->>CTV: Display Performance Dashboard & Payout Summary`,

    erd: `erDiagram
    CANDIDATES ||--o{ INTERVIEWS : "schedules"
    CANDIDATES ||--o{ ZALO_MESSAGES : "receives"
    CANDIDATES }o--|| JOBS : "applies for"
    CANDIDATES }o--o| CTV_PARTNERS : "referred by"
    JOBS }o--|| CLIENTS : "belong to"

    CANDIDATES {
        string id PK
        string full_name
        string phone
        string email
        string applied_position
        string job_id FK
        string ctv_code FK
        string cv_status
        string interview_status
        string overall_status
        float ai_match_score
    }
    JOBS {
        string id PK
        string title
        string client_id FK
        string department
        string salary_range
        int headcount_target
        text required_skills
    }
    CLIENTS {
        string id PK
        string company_name
        string contact_person
        string contract_tier
    }
    CTV_PARTNERS {
        string ctv_code PK
        string full_name
        string phone
        float commission_rate
        int total_referred
    }`,

    statemachine: `stateDiagram-v2
    [*] --> NEW: Nộp hồ sơ
    NEW --> SCREENED: Duyệt CV đạt tiêu chí
    NEW --> REJECTED: CV không phù hợp
    SCREENED --> INTERVIEW: Chốt lịch phỏng vấn
    SCREENED --> WITHDRAWN: Ứng viên rút hồ sơ
    INTERVIEW --> OFFER: Pass các vòng PV
    INTERVIEW --> REJECTED: Phỏng vấn không đạt
    OFFER --> HIRED: Đồng ý nhận việc (Onboarding)
    OFFER --> REJECTED: Từ chối offer
    HIRED --> [*]
    REJECTED --> [*]`
  };

  // Copy code handler
  const handleCopyCode = () => {
    let codeToCopy = '';
    if (activeTab === 'sequence') {
      codeToCopy = mermaidSpecs[`sequence_${activeSequenceFlow}`] || mermaidSpecs.sequence_etl;
    } else {
      codeToCopy = mermaidSpecs[activeTab] || mermaidSpecs.c4;
    }
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // State Machine Simulator Actions
  const handleSimAction = (action, nextState, label) => {
    setSimulatedState(nextState);
    setSimHistory((prev) => [
      `[${new Date().toLocaleTimeString('vi-VN')}] ${label} ➔ Chuyển trạng thái: ${nextState}`,
      ...prev.slice(0, 7)
    ]);
  };

  const handleSimReset = () => {
    setSimulatedState('NEW');
    setSimHistory(['[Khởi tạo lại] Trở về trạng thái MỚI ỨNG TUYỂN (NEW)']);
  };

  // Database Schema Details
  const dbEntities = [
    {
      name: 'candidates',
      displayName: 'Ứng Viên (Candidates)',
      type: 'Core Table',
      records: '10,000+ Scalable',
      columns: [
        { name: 'id', type: 'VARCHAR(64)', key: 'PK', desc: 'Mã định danh duy nhất (UUID)' },
        { name: 'full_name', type: 'VARCHAR(255)', key: 'REQ', desc: 'Họ và tên ứng viên' },
        { name: 'phone', type: 'VARCHAR(20)', key: 'INDEX', desc: 'Số điện thoại chuẩn hóa (+84/0)' },
        { name: 'email', type: 'VARCHAR(255)', key: 'REQ', desc: 'Email liên hệ' },
        { name: 'applied_position', type: 'VARCHAR(255)', key: 'REQ', desc: 'Vị trí công việc ứng tuyển' },
        { name: 'job_id', type: 'VARCHAR(64)', key: 'FK', desc: 'Khóa ngoại tham chiếu jobs.id' },
        { name: 'ctv_code', type: 'VARCHAR(64)', key: 'FK', desc: 'Mã CTV giới thiệu (ctv_partners)' },
        { name: 'cv_status', type: 'VARCHAR(50)', key: '', desc: 'PASS | FAIL | PENDING' },
        { name: 'interview_status', type: 'VARCHAR(50)', key: '', desc: 'PASS | FAIL | CHỜ PV | ĐÃ HẸN' },
        { name: 'overall_status', type: 'VARCHAR(50)', key: '', desc: 'NEW | SCREENED | INTERVIEW | OFFER | HIRED' },
        { name: 'ai_match_score', type: 'FLOAT', key: '', desc: 'Điểm tương thích AI (0.0 - 100.0)' },
        { name: 'cv_file_url', type: 'TEXT', key: '', desc: 'Link Google Drive / Lưu trữ file CV' }
      ]
    },
    {
      name: 'jobs',
      displayName: 'Vị Trí Tuyển Dụng (Jobs)',
      type: 'Core Table',
      records: '50+ Active Jobs',
      columns: [
        { name: 'id', type: 'VARCHAR(64)', key: 'PK', desc: 'Mã Job (e.g. JOB-104)' },
        { name: 'title', type: 'VARCHAR(255)', key: 'REQ', desc: 'Tiêu đề vị trí công việc' },
        { name: 'client_id', type: 'VARCHAR(64)', key: 'FK', desc: 'Khóa ngoại tham chiếu clients.id' },
        { name: 'department', type: 'VARCHAR(100)', key: '', desc: 'Phòng ban / Khối chuyên môn' },
        { name: 'location', type: 'VARCHAR(100)', key: '', desc: 'Hà Nội / TP.HCM / Remote' },
        { name: 'salary_range', type: 'VARCHAR(100)', key: '', desc: 'Khung lương đề xuất' },
        { name: 'headcount_target', type: 'INTEGER', key: '', desc: 'Chỉ tiêu số lượng tuyển' },
        { name: 'required_skills', type: 'TEXT (JSON)', key: '', desc: 'Bộ kỹ năng yêu cầu' },
        { name: 'status', type: 'VARCHAR(50)', key: '', desc: 'ACTIVE | PAUSED | CLOSED' }
      ]
    },
    {
      name: 'clients',
      displayName: 'Khách Hàng / Đối Tác (Clients)',
      type: 'CRM Table',
      records: 'Enterprise Clients',
      columns: [
        { name: 'id', type: 'VARCHAR(64)', key: 'PK', desc: 'Mã khách hàng (e.g. CL-01)' },
        { name: 'company_name', type: 'VARCHAR(255)', key: 'REQ', desc: 'Tên pháp nhân công ty' },
        { name: 'contact_person', type: 'VARCHAR(255)', key: '', desc: 'Người phụ trách nhân sự' },
        { name: 'contact_email', type: 'VARCHAR(255)', key: '', desc: 'Email nhận CV đối tác' },
        { name: 'contract_tier', type: 'VARCHAR(50)', key: '', desc: 'VIP | STANDARD | ENTERPRISE' },
        { name: 'status', type: 'VARCHAR(50)', key: '', desc: 'ACTIVE | PROSPECT | INACTIVE' }
      ]
    },
    {
      name: 'ctv_partners',
      displayName: 'Cộng Tác Viên (CTV Partners)',
      type: 'Affiliate Table',
      records: 'Affiliate Network',
      columns: [
        { name: 'ctv_code', type: 'VARCHAR(64)', key: 'PK', desc: 'Mã CTV định danh (e.g. CTV-001)' },
        { name: 'full_name', type: 'VARCHAR(255)', key: 'REQ', desc: 'Họ và tên CTV' },
        { name: 'phone', type: 'VARCHAR(20)', key: 'INDEX', desc: 'Số điện thoại nhận thông báo' },
        { name: 'commission_rate', type: 'FLOAT', key: '', desc: 'Tỷ lệ hoa hồng thỏa thuận (%)' },
        { name: 'bank_account', type: 'VARCHAR(100)', key: '', desc: 'Số tài khoản chuyển thưởng' },
        { name: 'total_referred', type: 'INTEGER', key: '', desc: 'Tổng số ứng viên đã giới thiệu' },
        { name: 'status', type: 'VARCHAR(50)', key: '', desc: 'ACTIVE | SUSPENDED' }
      ]
    }
  ];

  // Code Modules Specification
  const codeModules = [
    {
      name: 'sheetsService.js',
      path: 'src/services/sheetsService.js',
      category: 'ETL & Ingestion Layer',
      tech: 'Google Visualization (GViz) + PapaParse',
      methods: [
        { signature: 'fetchSheet1Data(config)', returnType: 'Promise<Candidate[]>', desc: 'Tải và phân tích dữ liệu bảng ứng viên từ Google Sheets GViz CSV' },
        { signature: 'fetchJobSheetData(config)', returnType: 'Promise<Job[]>', desc: 'Tải danh sách vị trí tuyển dụng đang mở từ Sheet Jobs' },
        { signature: 'fetchCtvSheetData(config)', returnType: 'Promise<CTV[]>', desc: 'Tải danh bạ CTV và lịch sử giới thiệu ứng viên' },
        { signature: 'fetchIntergreatSheetData(config)', returnType: 'Promise<Client[]>', desc: 'Tải thông tin khách hàng đối tác từ CRM sheet' }
      ]
    },
    {
      name: 'dataNormalizer.js',
      path: 'src/utils/dataNormalizer.js',
      category: 'Data Normalization & Filter',
      tech: 'Two-Pointer Algorithm + Regex Parser',
      methods: [
        { signature: 'twoPointerFilter(items, predicate, limit)', returnType: 'Array<T>', desc: 'Lọc 10,000+ hồ sơ với thuật toán 2 con trỏ O(N/2) siêu tốc' },
        { signature: 'normalizeCvResult(rawStatus)', returnType: "'PASS' | 'FAIL' | 'PENDING'", desc: 'Chuẩn hóa trạng thái duyệt CV tự động theo từ điển chuẩn' },
        { signature: 'normalizePvResult(rawStatus)', returnType: "'PASS' | 'FAIL' | 'CHỜ PV' | 'ĐÃ HẸN'", desc: 'Chuẩn hóa trạng thái phỏng vấn' },
        { signature: 'calculateMetrics(candidates)', returnType: 'KPIObject', desc: 'Tính toán tỷ lệ Pass, tỷ lệ PV, phễu tuyển dụng tức thì' }
      ]
    },
    {
      name: 'aiMatchingService.js',
      path: 'src/services/aiMatchingService.js',
      category: 'AI & Semantic Matching',
      tech: 'TF-IDF Vectorization + Gemini LLM',
      methods: [
        { signature: 'calculateJobCandidateMatches(job, candidates)', returnType: 'Array<MatchResult>', desc: 'Tính toán điểm tương quan đa chiều (Kỹ năng, Kinh nghiệm, Địa điểm)' },
        { signature: 'extractSkillsFromText(text)', returnType: 'string[]', desc: 'Trích xuất từ khóa chuyên môn (React, Node, SQL, Python, Java)' },
        { signature: 'generateMatchFeedback(candidate, job)', returnType: 'Promise<Feedback>', desc: 'Sinh nhận xét ưu nhược điểm và câu hỏi phỏng vấn gợi ý qua AI' }
      ]
    },
    {
      name: 'zaloServer.js',
      path: 'server/zaloServer.js',
      category: 'Gateway & Webhook Controller',
      tech: 'Express.js + HMAC SHA256 + Zalo Open API',
      methods: [
        { signature: 'POST /webhook/zalo', returnType: 'HTTP 200 / 403', desc: 'Nhận webhook từ Zalo OA, xác thực chữ ký số HMAC SHA256' },
        { signature: 'GET /api/status', returnType: 'JSON Health Status', desc: 'Kiểm tra trạng thái kết nối Zalo OA Token và Gateway' },
        { signature: 'POST /api/send-message', returnType: 'JSON Delivery Status', desc: 'Phát tin nhắn thông báo phỏng vấn / OTP qua Zalo CS API' }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── 1. Archify Studio Header Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 border border-slate-700/60 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-48 -mb-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              Archify System Architecture & UML Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              FastHunt Architecture & UML Engine
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono">
                v2.5.0 Production
              </span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Mô hình hóa toàn diện kiến trúc phần mềm C4, cây thành phần React 19, luồng tuần tự Sequence Diagrams, cơ sở dữ liệu ERD và máy trạng thái ứng viên (State Machine).
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyCode}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-md cursor-pointer hover:scale-102 active:scale-98 shadow-sm"
              title="Sao chép mã Mermaid Diagram"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-300" />}
              {copiedCode ? 'Đã sao chép Mermaid!' : 'Copy Mermaid UML'}
            </button>

            {onExportMarkdown && (
              <button
                onClick={onExportMarkdown}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30 cursor-pointer hover:scale-102 active:scale-98"
                title="Tải toàn bộ tài liệu kiến trúc ARCHIFY_SYSTEM_ARCHITECTURE.md"
              >
                <Download className="w-4 h-4" />
                Tải Báo Cáo Markdown
              </button>
            )}
          </div>
        </div>

        {/* Metric Chips */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white">29 UI Components</div>
              <div className="text-[11px] text-slate-300">React 19 Core</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white">4 Services / Gateway</div>
              <div className="text-[11px] text-slate-300">Node.js + GViz ETL</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white">100% Quality Gate</div>
              <div className="text-[11px] text-slate-300">211 Tests Passed</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white">7 Data Entities</div>
              <div className="text-[11px] text-slate-300">SQL & Mongo Schema</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Tab Navigation & Mode Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-[#0c1222] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: Visual vs Mermaid Code */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setDiagramMode('visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                diagramMode === 'visual'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Visual Diagrams
            </button>
            <button
              onClick={() => setDiagramMode('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                diagramMode === 'code'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Mermaid Code
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Tab Contents ── */}

      {/* ── TAB 1: C4 System Architecture ── */}
      {activeTab === 'c4' && (
        <div className="space-y-6">
          {diagramMode === 'visual' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Layer 1: Client Tier */}
              <div className="rounded-2xl p-5 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">1. Client Tier (SPA)</h3>
                      <p className="text-[11px] text-slate-400">Desktop & Mobile Dual Engine</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    React 19
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>CandidateTable & Kanban</span>
                      <span className="text-[10px] text-blue-500 font-mono">2-Pointer O(N/2)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Render bảng dữ liệu 10,000+ bản ghi với tốc độ lọc tức thì không giật lag.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="font-bold text-slate-800 dark:text-slate-200">Mobile Vertical Dock & FAB</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Taskbar nổi dọc và thanh điều hướng đáy hỗ trợ thao tác 1 tay trên điện thoại.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="font-bold text-slate-800 dark:text-slate-200">Offline Fallback Cache</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tự động lưu trữ state vào LocalStorage khi mất kết nối mạng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Layer 2: Gateway & Application Services */}
              <div className="rounded-2xl p-5 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">2. Gateway & Services</h3>
                      <p className="text-[11px] text-slate-400">Node.js + Express Gateway</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    ES Modules
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>sheetsService.js</span>
                      <span className="text-[10px] text-indigo-500 font-mono">GViz CSV</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Kết nối đồng thời 4 Google Sheets: Ứng viên, CRM Khách hàng, Jobs và CTV.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>aiMatchingService.js</span>
                      <span className="text-[10px] text-purple-500 font-mono">TF-IDF Vector</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Thuật toán chấm điểm độ khớp ứng viên theo kỹ năng, năm kinh nghiệm và cấp bậc.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>zaloServer.js (Gateway)</span>
                      <span className="text-[10px] text-sky-500 font-mono">HMAC SHA256</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Xác thực webhook Zalo OA và điều hướng tin nhắn ứng viên tự động.
                    </p>
                  </div>
                </div>
              </div>

              {/* Layer 3: Persistence & External Cloud */}
              <div className="rounded-2xl p-5 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">3. Data & Cloud Tier</h3>
                      <p className="text-[11px] text-slate-400">Google Cloud + Zalo OA API</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Cloud Native
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>Google Sheets & Drive</span>
                      <span className="text-[10px] text-emerald-500 font-mono">Spreadsheet</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Nơi lưu trữ nguồn dữ liệu tuyển dụng cộng tác viên và hồ sơ CV ứng viên.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>PostgreSQL & MongoDB</span>
                      <span className="text-[10px] text-cyan-500 font-mono">Hybrid DB</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Cơ sở dữ liệu lưu log tương tác, phân quyền người dùng và lịch sử phỏng vấn.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>Google Gemini 1.5 Pro</span>
                      <span className="text-[10px] text-violet-500 font-mono">LLM NLP</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Phân tích sâu ưu nhược điểm CV và sinh câu hỏi phỏng vấn chuẩn hóa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-950 p-5 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto">
              <pre>{mermaidSpecs.c4}</pre>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: Component UML Hierarchy ── */}
      {activeTab === 'components' && (
        <div className="space-y-6">
          {diagramMode === 'visual' ? (
            <div className="space-y-6">
              {/* Root App Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                      App
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">Root Application Component (App.jsx)</h3>
                      <p className="text-xs text-blue-200">Quản lý Global State, Theme Dark/Light, Lọc dữ liệu & Điều hướng View</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-blue-500/30 border border-blue-400/40 font-mono">
                    State Controller
                  </span>
                </div>
              </div>

              {/* Sub-Components Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Header.jsx',
                    tag: 'Navigation Bar',
                    color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800/60',
                    props: ['activeView', 'candidateCount', 'urgentCount', 'isRefreshing', 'onRefresh'],
                    desc: 'Thanh điều hướng trên cùng, hiển thị KPI nhanh, nút refresh và chuyển đổi dark mode.'
                  },
                  {
                    name: 'Sidebar.jsx',
                    tag: 'Drawer & Rail',
                    color: 'from-indigo-500/10 to-purple-500/10 border-indigo-200 dark:border-indigo-800/60',
                    props: ['collapsed', 'mobileOpen', 'candidateCount', 'urgentCount', 'jobCount'],
                    desc: 'Thanh menu bên trái hỗ trợ thu gọn, danh mục tuyển dụng, khách hàng và công cụ tiện ích.'
                  },
                  {
                    name: 'CandidateTable.jsx',
                    tag: 'Data Grid',
                    color: 'from-cyan-500/10 to-blue-500/10 border-cyan-200 dark:border-cyan-800/60',
                    props: ['candidates', 'onSelectCandidate', 'onOpenEmail', 'onAnalyzeCv'],
                    desc: 'Bảng dữ liệu ứng viên 2 chế độ (Desktop Bảng rộng / Mobile Thẻ chạm) với 2-Pointer Filter.'
                  },
                  {
                    name: 'KanbanBoard.jsx',
                    tag: 'Visual Pipeline',
                    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800/60',
                    props: ['candidates', 'onCandidateMove', 'onSelectCandidate'],
                    desc: 'Phễu tuyển dụng 5 cột Kanban kéo thả trực quan theo từng giai đoạn ứng viên.'
                  },
                  {
                    name: 'JobsView.jsx',
                    tag: 'Job Board',
                    color: 'from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800/60',
                    props: ['jobItems', 'candidates', 'onSelectJob', 'onAssignCandidate'],
                    desc: 'Bảng tin việc làm, xem JD chi tiết, liên kết khách hàng và đề xuất ứng viên phù hợp.'
                  },
                  {
                    name: 'ZaloAssistantView.jsx',
                    tag: 'Omnichannel Chat',
                    color: 'from-sky-500/10 to-blue-500/10 border-sky-200 dark:border-sky-800/60',
                    props: ['candidates', 'onSendZaloMessage', 'onBroadcast'],
                    desc: 'Trợ lý Zalo cá nhân & OA, gửi tin nhắn phỏng vấn tức thì và gửi tin hàng loạt (Broadcast).'
                  },
                  {
                    name: 'AiRecruiterBot.jsx',
                    tag: 'AI Assistant',
                    color: 'from-violet-500/10 to-purple-500/10 border-violet-200 dark:border-violet-800/60',
                    props: ['candidates', 'jobItems', 'isOpen', 'onClose'],
                    desc: 'Bot tuyển dụng AI thông minh hỗ trợ phân tích tỷ lệ Pass và đề xuất chiến lược tuyển dụng.'
                  },
                  {
                    name: 'CtvManagementView.jsx',
                    tag: 'Affiliate Hub',
                    color: 'from-rose-500/10 to-pink-500/10 border-rose-200 dark:border-rose-800/60',
                    props: ['ctvItems', 'candidates', 'onSelectCtv'],
                    desc: 'Quản lý mã CTV, thống kê số lượng hồ sơ giới thiệu, tỷ lệ tuyển dụng và tính hoa hồng.'
                  },
                  {
                    name: 'MobileVerticalTaskbar.jsx',
                    tag: 'Mobile Dock',
                    color: 'from-teal-500/10 to-emerald-500/10 border-teal-200 dark:border-teal-800/60',
                    props: ['activeView', 'setActiveView', 'candidateCount', 'urgentCount'],
                    desc: 'Thanh dock dọc nổi hỗ trợ chuyển đổi màn hình nhanh bằng một ngón tay cái trên thiết bị di động.'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4.5 bg-gradient-to-br ${item.color} bg-white dark:bg-[#0c1222] border shadow-xs space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-blue-500" />
                        {item.name}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Key Props & Hooks
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.props.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700/60"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-950 p-5 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto">
              <pre>{mermaidSpecs.components}</pre>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: Sequence Flow Diagrams ── */}
      {activeTab === 'sequence' && (
        <div className="space-y-6">
          {/* Sequence Flow Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'etl', label: '1. GViz Multi-Sheet ETL Pipeline', badge: 'Sheets Ingestion' },
              { id: 'aimatch', label: '2. AI Candidate-Job Matching Flow', badge: 'TF-IDF + Gemini' },
              { id: 'zalo', label: '3. Zalo OA Webhook & Messaging Flow', badge: 'HMAC SHA256' },
              { id: 'ctv', label: '4. CTV Affiliate Referral Flow', badge: 'Commission Tracking' }
            ].map((flow) => (
              <button
                key={flow.id}
                onClick={() => setActiveSequenceFlow(flow.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeSequenceFlow === flow.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-[#0c1222] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{flow.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    activeSequenceFlow === flow.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {flow.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Sequence Content */}
          {diagramMode === 'visual' ? (
            <div className="rounded-2xl p-6 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-indigo-500" />
                  {activeSequenceFlow === 'etl' && 'Quy trình Ingestion Dữ Liệu Đa Nguồn (Google Sheets GViz ETL)'}
                  {activeSequenceFlow === 'aimatch' && 'Quy trình Chấm Điểm & Phân Tích Độ Phù Hợp Bằng AI'}
                  {activeSequenceFlow === 'zalo' && 'Quy trình Xử Lý Webhook Zalo OA & Gửi Lịch Phỏng Vấn Tự Động'}
                  {activeSequenceFlow === 'ctv' && 'Quy trình Tiếp Nhận Hồ Sơ CTV & Tính Thưởng Hoa Hồng Tuyển Dụng'}
                </h3>
              </div>

              {/* Step by Step Visual Pipeline */}
              {activeSequenceFlow === 'etl' && (
                <div className="space-y-3">
                  {[
                    { step: '01', actor: 'Recruiter UI (App.jsx)', action: 'Gọi lệnh fetchAllData() khi khởi động hoặc nhấn Refresh', target: 'sheetsService.js' },
                    { step: '02', actor: 'sheetsService.js', action: 'Gửi 4 request song song (Promise.all) tới Google Sheets GViz CSV Endpoint', target: 'Google Cloud' },
                    { step: '03', actor: 'Google GViz', action: 'Trả về chuỗi CSV chứa danh sách Ứng viên, CRM, Jobs và CTV', target: 'PapaParse' },
                    { step: '04', actor: 'dataNormalizer.js', action: 'Chuẩn hóa số điện thoại, ngày tháng DD/MM/YYYY, gán mã CTV và khử trùng lặp', target: 'Candidate State' },
                    { step: '05', actor: 'React State', action: 'Cập nhật candidates[], jobItems[], tính toán KPI Cards và render bảng dữ liệu', target: 'UI Display' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {s.step}
                      </span>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{s.actor}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{s.target}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{s.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSequenceFlow === 'aimatch' && (
                <div className="space-y-3">
                  {[
                    { step: '01', actor: 'Job Detail Modal', action: 'Recruiter nhấn nút "AI Match Ứng Viên" cho một Job cụ thể', target: 'aiMatchingService.js' },
                    { step: '02', actor: 'cvExtractor.js', action: 'Trích xuất từ khóa kỹ năng (Tech Stack), năm kinh nghiệm, học vấn từ CV text', target: 'Skill Vector' },
                    { step: '03', actor: 'Matching Engine', action: 'Tính trọng số: 40% Kỹ năng + 25% Kinh nghiệm + 20% Level + 15% Địa điểm', target: 'Score (0-100%)' },
                    { step: '04', actor: 'Gemini LLM (Opt)', action: 'Sinh tóm tắt ưu nhược điểm và bộ câu hỏi phỏng vấn gợi ý', target: 'AI Insights' },
                    { step: '05', actor: 'UI Match List', action: 'Hiển thị danh sách ứng viên xếp hạng theo điểm tương thích kèm nhãn gap kỹ năng', target: 'Recruiter View' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {s.step}
                      </span>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{s.actor}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold text-purple-600 dark:text-purple-400">{s.target}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{s.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSequenceFlow === 'zalo' && (
                <div className="space-y-3">
                  {[
                    { step: '01', actor: 'Ứng viên (Zalo App)', action: 'Gửi tin nhắn hoặc nhấn nút tương tác trên Zalo OA FastHunt', target: 'Zalo Server' },
                    { step: '02', actor: 'Zalo OA Cloud', action: 'Bắn Webhook POST /webhook/zalo kèm Header X-Zalo-Signature', target: 'zaloServer.js' },
                    { step: '03', actor: 'zaloServer.js Gateway', action: 'Xác thực chữ ký HMAC SHA256 với App Secret, đảm bảo an toàn tuyệt đối', target: 'Security Gate' },
                    { step: '04', actor: 'zaloOaService.js', action: 'Khớp số điện thoại / Zalo UID của ứng viên và cập nhật thread hội thoại', target: 'ZaloAssistantView' },
                    { step: '05', actor: 'Recruiter / Auto Bot', action: 'Gửi phản hồi nhanh hoặc gửi thư mời phỏng vấn qua Zalo CS API', target: 'Candidate Mobile' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {s.step}
                      </span>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{s.actor}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold text-sky-600 dark:text-sky-400">{s.target}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{s.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSequenceFlow === 'ctv' && (
                <div className="space-y-3">
                  {[
                    { step: '01', actor: 'Cộng Tác Viên (CTV)', action: 'Nộp CV ứng viên kèm mã CTV định danh (ví dụ: CTV-08)', target: 'Form / Sheets' },
                    { step: '02', actor: 'sheetsService.js', action: 'ETL tải hồ sơ mới và tự động map với danh sách CTV hợp lệ', target: 'dataNormalizer' },
                    { step: '03', actor: 'Recruiter Review', action: 'Recruiter tiến hành phỏng vấn và cập nhật trạng thái tuyển dụng', target: 'Pipeline' },
                    { step: '04', actor: 'CtvManagementView', action: 'Tự động tính toán tổng số hồ sơ, tỷ lệ Pass và hoa hồng theo % thỏa thuận', target: 'CTV Dashboard' },
                    { step: '05', actor: 'Thanh Toán Hoa Hồng', action: 'Xuất danh sách quyết toán thưởng và gửi thông báo cho CTV qua Zalo/Email', target: 'Payout' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {s.step}
                      </span>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{s.actor}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold text-rose-600 dark:text-rose-400">{s.target}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{s.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-950 p-5 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto">
              <pre>{mermaidSpecs[`sequence_${activeSequenceFlow}`] || mermaidSpecs.sequence_etl}</pre>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: Database Schema & ERD ── */}
      {activeTab === 'erd' && (
        <div className="space-y-6">
          {diagramMode === 'visual' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {dbEntities.map((entity, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                  >
                    {/* Entity Header */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                          <Database className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white font-mono">{entity.name}</h4>
                          <p className="text-[11px] text-slate-400">{entity.displayName}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                        {entity.type}
                      </span>
                    </div>

                    {/* Columns Table */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {entity.columns.map((col, cIdx) => (
                        <div key={cIdx} className="p-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{col.name}</span>
                            {col.key === 'PK' && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                PK
                              </span>
                            )}
                            {col.key === 'FK' && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700">
                                FK
                              </span>
                            )}
                            {col.key === 'REQ' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                                NOT NULL
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-right">
                            <span className="font-mono text-[11px] text-slate-400">{col.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-950 p-5 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto">
              <pre>{mermaidSpecs.erd}</pre>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: Candidate State Machine & Simulator ── */}
      {activeTab === 'statemachine' && (
        <div className="space-y-6">
          {diagramMode === 'visual' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: State Diagram Stages */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-blue-500" />
                    Mô Hình 5 Giai Đoạn Vòng Đời Ứng Viên (Candidate Lifecycle Stages)
                  </h3>

                  <div className="space-y-3">
                    {[
                      {
                        stage: '1. Mới Ứng Tuyển (NEW)',
                        statusKey: 'NEW',
                        color: 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20',
                        desc: 'Hồ sơ mới nộp từ Google Sheets / Form / Zalo. Chờ AI trích xuất kỹ năng và chấm điểm sơ loại.',
                        actions: ['Duyệt CV Đạt', 'Loại Hồ Sơ']
                      },
                      {
                        stage: '2. Đã Duyệt CV (SCREENED)',
                        statusKey: 'SCREENED',
                        color: 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20',
                        desc: 'CV đạt chuẩn yêu cầu công việc. Recruiter liên hệ phỏng vấn sơ vấn qua điện thoại/Zalo.',
                        actions: ['Chốt Lịch Phỏng Vấn', 'Ứng Viên Rút Hồ Sơ']
                      },
                      {
                        stage: '3. Phỏng Vấn (INTERVIEW)',
                        statusKey: 'INTERVIEW',
                        color: 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20',
                        desc: 'Phỏng vấn chuyên môn Vòng 1 và Vòng 2 với Doanh nghiệp khách hàng.',
                        actions: ['Pass Phỏng Vấn', 'Phỏng Vấn Không Đạt']
                      },
                      {
                        stage: '4. Đề Nghị Nhận Việc (OFFER)',
                        statusKey: 'OFFER',
                        color: 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/20',
                        desc: 'Gửi thư mời nhận việc (Offer Letter) qua Email & Zalo. Chờ ứng viên xác nhận.',
                        actions: ['Ứng Viên Đồng Ý (Accept)', 'Từ Chối Offer']
                      },
                      {
                        stage: '5. Tuyển Dụng Thành Công (HIRED)',
                        statusKey: 'HIRED',
                        color: 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
                        desc: 'Ứng viên chính thức Onboarding đi làm. Tính hoa hồng quyết toán cho Cộng tác viên (CTV).',
                        actions: ['Quyết Toán CTV & Đóng Hồ Sơ']
                      }
                    ].map((st, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border-l-4 border ${st.color} transition-all ${
                          simulatedState === st.statusKey ? 'ring-2 ring-blue-500 shadow-md' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">{st.stage}</span>
                          {simulatedState === st.statusKey && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white animate-pulse">
                              Trạng Thái Hiện Tại
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{st.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Interactive State Simulator */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-emerald-500" />
                    Trình Giả Lập Trạng Thái
                  </h4>
                  <button
                    onClick={handleSimReset}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Khởi tạo lại từ đầu"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Current State Badge */}
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Current Candidate State</div>
                  <div className="text-xl font-black font-mono text-emerald-400">{simulatedState}</div>
                </div>

                {/* Action Buttons based on current state */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Hành động chuyển bước hợp lệ:</div>

                  {simulatedState === 'NEW' && (
                    <>
                      <button
                        onClick={() => handleSimAction('PASS_CV', 'SCREENED', 'Duyệt CV Đạt Tiêu Chuẩn')}
                        className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Duyệt CV Đạt</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSimAction('REJECT_CV', 'REJECTED', 'Từ Chối Hồ Sơ CV')}
                        className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Loại CV Không Đạt</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {simulatedState === 'SCREENED' && (
                    <>
                      <button
                        onClick={() => handleSimAction('SCHEDULE_PV', 'INTERVIEW', 'Chốt Lịch Phỏng Vấn')}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Lên Lịch Phỏng Vấn</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSimAction('WITHDRAW', 'WITHDRAWN', 'Ứng Viên Rút Hồ Sơ')}
                        className="w-full py-2 px-3 rounded-xl bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Ứng Viên Rút Lui</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {simulatedState === 'INTERVIEW' && (
                    <>
                      <button
                        onClick={() => handleSimAction('PASS_PV', 'OFFER', 'Phỏng Vấn Thành Công (Pass)')}
                        className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Pass PV ➔ Gửi Offer</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSimAction('FAIL_PV', 'REJECTED', 'Phỏng Vấn Không Đạt')}
                        className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Đánh Giá Không Đạt</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {simulatedState === 'OFFER' && (
                    <>
                      <button
                        onClick={() => handleSimAction('ACCEPT_OFFER', 'HIRED', 'Ứng Viên Đồng Ý Nhận Việc')}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Đồng Ý Offer (Hired)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSimAction('DECLINE_OFFER', 'REJECTED', 'Ứng Viên Từ Chối Offer')}
                        className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Từ Chối Offer</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {(simulatedState === 'HIRED' || simulatedState === 'REJECTED' || simulatedState === 'WITHDRAWN') && (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center space-y-2">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {simulatedState === 'HIRED' ? '🎉 Tuyển dụng thành công!' : 'Trạng thái kết thúc.'}
                      </div>
                      <button
                        onClick={handleSimReset}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 cursor-pointer"
                      >
                        Khởi Tạo Lại Quy Trình
                      </button>
                    </div>
                  )}
                </div>

                {/* History Log */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Nhật ký chuyển trạng thái:</div>
                  <div className="space-y-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 max-h-40 overflow-y-auto">
                    {simHistory.map((h, hIdx) => (
                      <div key={hIdx} className="truncate">
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-950 p-5 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto">
              <pre>{mermaidSpecs.statemachine}</pre>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 6: Module Code & API Specs ── */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Tìm kiếm hàm, module, service..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {codeModules
              .filter((m) => m.name.toLowerCase().includes(searchFilter.toLowerCase()) || m.category.toLowerCase().includes(searchFilter.toLowerCase()))
              .map((mod, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white font-mono">{mod.name}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">{mod.path}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                      {mod.category}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Công nghệ: </span>
                    {mod.tech}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Exported Functions & Signatures
                    </div>
                    {mod.methods.map((meth, mIdx) => (
                      <div key={mIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                        <div className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          {meth.signature}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{meth.desc}</span>
                          <span className="font-mono text-emerald-500 font-semibold">{meth.returnType}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
