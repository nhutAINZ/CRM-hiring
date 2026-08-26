---
name: codegraph
description: Pre-indexed code knowledge graph for instant codebase structure, symbol relationships, and call graph queries (powered by @colbymchenry/codegraph). Use to recall file structure, symbol dependencies, function call paths, and codebase architecture without consuming tokens on redundant file reads.
---

# CodeGraph Skill - Pre-indexed Code Structure & Call Graph Intelligence

CodeGraph builds a local structural knowledge graph (`.codegraph/`) indexing every symbol, import, call edge, and dependency in the codebase.

## 🚀 Quick Usage Commands

- **Initialize / Build Graph**:
  ```bash
  npx -y @colbymchenry/codegraph init
  ```
- **Query Symbol or Architecture**:
  ```bash
  npx -y @colbymchenry/codegraph explore "How do candidates get filtered and normalized?"
  ```
- **Check Status / Sync**:
  ```bash
  npx -y @colbymchenry/codegraph status
  ```

## 📐 Primary Architecture Map for FastHunt RecruitCRM Suite

- **Core Data Normalizer (`src/utils/dataNormalizer.js`)**:
  - `normalizeCvResult()`: Status classification (PASS / FAIL / PENDING) with cache map.
  - `normalizePvResult()`: Interview status classification.
  - `getCandidateStage()`: Kanban stage mapper (applied, cv_pass, interviewing, onboarded, rejected).
  - `twoPointerFilter()`: $O(N/2)$ dual-pointer scanning array filter algorithm.
  - `fastSortCandidates()`: $O(1)$ chronological & Vietnamese locale-aware array sorting.
  - `calculateMetrics()`: Metric calculation & conversion funnel aggregation.

- **Data Services (`src/services/sheetsService.js`)**:
  - `fetchSheet1Data()`: Live GViz CSV sync for Candidate Dataset.
  - `fetchSheet2Data()`: Live GViz CSV sync for Client Jobs Portal Dataset.
  - `fetchCtvSheetData()`: Live GViz CSV sync for CTV Registration & Bank Accounts (`gid=497830992`).

- **UI Views & Components (`src/components/`)**:
  - `Header.jsx`: Top navigation, theme controls, live sheet sync chip.
  - `Sidebar.jsx`: FastHunt navigation, CTV sheet link, expandable `Tiện ích` sub-menu, `Cập nhật các thay đổi mới`.
  - `CandidateTable.jsx`: Fast table, multiselect, inline note editing, sorting.
  - `KanbanBoard.jsx`: Drag-and-drop pipeline management.
  - `ClientsView.jsx`: Enterprise client & open jobs portal links with `$O(N+M)$` HashMap pre-indexing.
  - `CtvManagementView.jsx`: CTV registry & bonus bank account search with `twoPointerFilter`.
  - `AiRecruiterBot.jsx`: AI assistant for report generation & Zalo/Telegram dispatch.
  - `UpdatesModal.jsx`: Release notes and system changelog modal.
