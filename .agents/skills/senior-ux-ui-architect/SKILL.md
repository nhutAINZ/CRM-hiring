---
name: senior-ux-ui-architect
description: >-
  Senior Design Architect & UX/UI System guidelines based on plugin87/ux-ui-agent-skills.
  Covers DTCG design tokens, WCAG 2.2 accessibility, atomic component architecture,
  high-contrast visual clarity, unified icon hierarchy, CRM SaaS workflows, and anti-slop doctrine.
---

# Senior UX/UI Design Architect & CRM Guidelines

Based on [plugin87/ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills), this skill ensures enterprise-grade usability, accessibility, visual hierarchy, and structured CRM design.

---

## 1. Core Architecture & Design Principles

1. **High Visual Legibility & Contrast (WCAG 2.2 AA Standard)**:
   - Surface background: Clean crisp whites (`#ffffff`) and soft tints (`#f8fafc`, `#f1f5f9`) in light mode; deep slate/zinc (`#0f172a`, `#090d16`) in dark mode.
   - Text contrast: Minimum 4.5:1 for body copy, 3:1 for large display headers and interactive elements.
   - High information density without visual clutter: clean 1px borders, subtle soft shadows, no muddy gradients.

2. **Unified & Consistent Iconography**:
   - Single icon family: Lucide / Solar Icons with uniform 1.75px stroke width, consistent sizing (`16px`, `18px`, `20px`), and paired semantic color badges.
   - Every action button has a clear icon + text label or accessible tooltip.

3. **CRM-Grade Modular Navigation**:
   - Top-level CRM feature tabs separating distinct jobs-to-be-done:
     - Partner / Collaborator CRM & Performance Leaderboard
     - Candidate Pipeline & Advanced Table
     - Kanban Workflow Board
     - AI Copilot & Automated Telegram Reports
     - Offer & Email Communication Studio

4. **Multi-Source Data Mapping & Omnichannel Actions**:
   - Seamlessly map collaborator codes to full names, phone numbers, and email addresses.
   - Provide 1-click omnichannel actions: Call, Zalo, Telegram, Gmail, and Google Drive attachments.

5. **AI Copilot & Executive Reporting**:
   - Real-time synthesis of pipeline metrics into structured executive briefings.
   - Telegram-formatted reports with emoji callouts, bottleneck analysis, and strategic recommendations.
