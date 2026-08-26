---
name: sirishatoram-ui-ux-crm
description: >-
  Enterprise CRM & Dashboard UI/UX Design System based on sirishatoram/UI-UX- principles.
  Focuses on clean high-legibility light-first surfaces, executive dashboard landing,
  modular CRM pipeline navigation, structured customer/candidate lifecycle management,
  and elimination of visual clutter/fatigue.
---

# Enterprise CRM & Dashboard UI/UX Design System

Based on [sirishatoram/UI-UX-](https://github.com/sirishatoram/UI-UX-), this skill establishes principles for modern, clean, and highly functional CRM Web Applications.

---

## 1. Core Principles

1. **Light-First & High-Clarity Visual Surfaces**:
   - Primary surface backgrounds should use crisp whites (`#ffffff`), soft neutral tints (`#f8fafc`, `#f1f5f9`), and clean border definitions (`#e2e8f0`).
   - Avoid heavy dark murky backgrounds or low-contrast text on primary workspaces.
   - Text hierarchy must provide crystal-clear contrast (slate-900 `#0f172a` for headers, slate-700 `#334155` for body, slate-500 `#64748b` for metadata).

2. **Dedicated Executive Dashboard Landing (Trang Đầu Tiên)**:
   - The primary default view is an **Executive CRM Dashboard** that gives stakeholders an immediate 360-degree pulse of the business:
     - Top KPI Metrics Cards (Total volume, conversion rates, completed stages, revenue/onboarding).
     - Visual funnel flow & analytical trends.
     - Top Partner / Collaborator Performance Leaderboard.
     - Actionable "High Priority & Urgent" summary queue.
   - Heavy data tables and management tools reside in dedicated navigation modules rather than cluttering the initial landing view.

3. **Structured CRM Modular Architecture**:
   - Clear separation of concerns via CRM Navigation Tabs:
     1. 📊 **Tổng Quan CRM (Executive Dashboard)** — Overview, KPI cards, Funnel, Charts, Leaderboard, Urgent Alert Queue.
     2. 👥 **Quản Lý Ứng Viên (Candidate Management)** — Advanced Filterable Data Grid with bulk actions, sorting, and inline status badges.
     3. 📋 **Kanban Pipeline (Tuyển Dụng Workflow)** — Stage-by-stage visual board (Applied → Pass CV → Interviewing → Onboarded → Rejected).
     4. ⚡ **Cần Xử Lý Gấp (Urgent Queue)** — Dedicated queue for follow-ups, pending client feedback, and urgent reminders.
     5. 📈 **Báo Cáo & Phân Tích (Analytics Deep-Dive)** — In-depth breakdown charts, CTV efficiency metrics, and position distribution.

4. **Micro-Interactions & Accessible Component Design**:
   - Clean 1px border lines, soft neutral shadows (`0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0,0,0,0.04)`).
   - High-contrast pill badges (15% background + 30% border + status indicator dot).
   - Smooth responsive interactions with tactile feedback.
