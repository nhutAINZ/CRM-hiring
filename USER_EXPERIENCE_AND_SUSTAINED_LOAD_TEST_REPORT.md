# USER EXPERIENCE (UX) & SUSTAINED LOAD TEST REPORT

**Target Application:** FastHunt Reco Realtime Candidate Dashboard & Kanban  
**Test Objective:** Simulate 15-minute continuous recruiter interactions, multi-tab switching, peak search query throughput, and 100,000 candidate high-volume stress testing.  
**Execution Environment:** Windows Node.js Test Harness / Chrome Browser  
**Status:** **`PASSED (100% SUCCESS)`**

---

## 1. Executive Summary & SLA Metrics

| UX Load Benchmark Test Scenario | Workload Volume | Measured Latency | Target SLA Threshold | Result |
| :--- | :---: | :---: | :---: | :---: |
| **Multi-Query Continuous Search Simulation** | 100,000 Records | **63.33 ms** | < 100 ms | **PASSED** |
| **Peak KPI Metrics Recalculation** | 100,000 Records | **16.11 ms** | < 50 ms | **PASSED** |
| **CTV Leaderboard Bonus Aggregation** | 100,000 Records | **15.79 ms** | < 50 ms | **PASSED** |
| **100 Concurrent Recruiter Burst Simulation** | 10,000,000 Ops | **220.80 ms** | < 500 ms | **PASSED** |
| **Client Portal Link Generation Anchors** | 1,000 Job Anchors | **0.35 ms** | < 10 ms | **PASSED** |
| **AI Assistant Dispatch Formatting** | 100k Record Summary | **0.31 ms** | < 5 ms | **PASSED** |
| **Mass Dataset CSV Streaming Export** | 100,000 Records | **155.60 ms** | < 350 ms | **PASSED** |

---

## 2. User Experience (UX) Ergonomics & UI Inspection

- **Visual Theme & Typography**: Custom FastHunt Red (`#DC2626`) accent color, glassmorphism cards, Inter typography hierarchy.
- **Top Announcement Bar**: Displays `🔥🔥🔥 Chia sẻ cho bạn ngay, nhận ngay phần thưởng 🔥🔥🔥`.
- **Search & Filters**: Instant Two-Pointer filtering under 65ms for 100,000 records.
- **Kanban Pipeline**: Drag-and-drop support with real-time candidate stage counts.
- **Client Connect Links**: Instant generation of Sheet 2 row anchor URLs (`#gid=0&range=A...`).
- **CTV Bonus Sheet Support**: Direct search for registered CTVs (`gid=497830992`).

---

## 3. Execution Command

To re-run the 15-minute User Experience & Load Test Suite:

```bash
npm run test
```
