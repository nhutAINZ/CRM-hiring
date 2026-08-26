---
name: ui-ux-design
description: >-
  Expert guidelines and design system standards for crafting world-class, modern,
  and highly functional web applications and dashboards. Covers design tokens,
  modern color palettes, glassmorphism, micro-animations, typography, data tables,
  kanban pipelines, and recruitment SaaS UI/UX patterns.
---

# UI/UX Design System & Experience Guidelines

This skill provides comprehensive instructions and best practices for creating stunning, human-centered, and high-performing web applications.

---

## 1. Visual Hierarchy & Aesthetics Principles

1. **First Impression "Wow" Factor**:
   - Use curated color palettes (deep slates, vibrant emeralds, cyber cyans, royal indigos, warm ambers).
   - Avoid flat, dull, or standard primary colors. Combine rich gradients with subtle borders and glowing backdrops.
   - Employ **Glassmorphism & Depth**: Multi-layer elevation, subtle 1px border highlights (`border-white/10` or `border-slate-800`), frosted glass (`backdrop-blur-xl bg-slate-900/80`).

2. **Typography Hierarchy**:
   - Preferred fonts: `Plus Jakarta Sans`, `Inter`, `Geist`, `Outfit`.
   - Clear scale: Display (`text-2xl` / `text-3xl` bold/extrabold), Section headers (`text-lg` / `text-xl` font-bold), Body (`text-sm` / `text-xs` font-normal / medium), Meta/Tags (`text-[11px]` / `text-[10px]` uppercase tracking-wider).
   - Use tabular numbers (`font-mono` / `tabular-nums`) for metrics, currency, and IDs.

3. **Micro-Interactions & Motion**:
   - Smooth transitions (`transition-all duration-200 ease-out`).
   - Interactive feedback: Card hover lifts (`hover:-translate-y-0.5 hover:shadow-lg`), button active presses (`active:scale-95`), loading spinners, confetti on success.
   - Status indicators: Pulse animation for urgent items and live sync indicators.

---

## 2. Recruitment & SaaS Dashboard UX Patterns

1. **Dual / Multi-Mode Views**:
   - **Data Table View**: Dense, high-information-density table with sorting, bulk selection, column filtering, and quick action icons.
   - **Kanban Pipeline View**: Visual stages (Applied → CV Approved → Interviewing → Offered / Onboarding → Archived) for high-level workflow tracking.
   - **Analytics & Insights View**: Conversion funnels, leaderboards, donut breakdowns, and trend charts.
   - **Urgent Action Center**: Focused view of tasks requiring immediate recruiter attention (e.g. pending candidate responses).

2. **Information Scannability & Badges**:
   - Status badges must have distinctive color coding:
     - **PASS / Success**: Emerald / Green (`bg-emerald-500/15 text-emerald-400 border-emerald-500/30`)
     - **FAIL / Rejected**: Rose / Crimson (`bg-rose-500/15 text-rose-400 border-rose-500/30`)
     - **PENDING / In Progress**: Amber / Warning (`bg-amber-500/15 text-amber-400 border-amber-500/30`)
     - **INTERVIEW / Special**: Cyan / Sky (`bg-cyan-500/15 text-cyan-400 border-cyan-500/30`)
     - **ONBOARDED / Hired**: Purple / Violet (`bg-purple-500/15 text-purple-400 border-purple-500/30`)

3. **High Productivity Features**:
   - **1-Click Actions**: Quick copy to clipboard (Zalo format, Client summary format, plain text) with instant toast/feedback.
   - **Bulk Actions**: Select all / select subset, bulk export to CSV/Excel, bulk copy emails.
   - **Candidate Drawer / Quick Peek**: Inspect details, view timeline, and navigate Next/Previous without losing context or scroll position.
   - **Internal Notes & Tags**: Enable recruiters to attach quick offline notes to records.
   - **Automated Offer & Email Studio**: Side-by-side variable editor and formatted live email preview with 1-click Gmail launch.

---

## 3. Dark & Light Mode Harmonization

- **Dark Mode**: High contrast, rich dark navy/slate (`#0b0f19`, `#111827`, `#1e293b`), soft text (`#f8fafc`, `#94a3b8`), luminous accents.
- **Light Mode**: Crisp white/slate (`#f8fafc`, `#ffffff`), subtle borders (`#e2e8f0`), sharp text (`#0f172a`, `#475569`), saturated accents.
