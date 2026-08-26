---
name: mengto-design-skills
description: >-
  Meng To (DesignCode) design system and agent skills for building world-class,
  Awwwards-quality, motion-rich, and premium dark/light mode interfaces. Covers
  design-first UI specs, subtle CSS border gradients, progressive blur, ambient
  lighting mesh, liquid glassmorphism, and micro-interactions.
---

# Meng To Design System & UI/UX Agent Skills

Based on [MengTo/Skills](https://github.com/MengTo/Skills), this playbook defines the standard for ultra-premium, modern web applications, SaaS dashboards, and interactive landing interfaces.

---

## 1. Core Principles (Meng To / DesignCode Philosophy)

1. **Specs Beat Vibes**:
   - Explicit constraints: Fixed color tokens, clear type hierarchy, defined border gradients, and disciplined micro-interactions.
   - Change 1–2 things only per iteration.
2. **Subtle Gradient Borders Over Flat Strokes**:
   - Rather than flat `border: 1px solid #334155`, use multi-stop linear-gradient borders (`padding-box` + `border-box`):
     ```css
     .gradient-border {
       --surface: rgba(11, 15, 25, 0.82);
       --border-a: rgba(255, 255, 255, 0.22);
       --border-b: rgba(16, 185, 129, 0.35); /* brand accent */
       --border-c: rgba(255, 255, 255, 0.05);

       border: 1px solid transparent;
       border-radius: 20px;
       background:
         linear-gradient(var(--surface), var(--surface)) padding-box,
         linear-gradient(135deg, var(--border-a), var(--border-b), var(--border-c)) border-box;
     }
     ```
3. **Ambient Light Mesh & Depth**:
   - Soft background radial light orbs (`blur-[100px]` with opacity `0.15 - 0.25`) that cast warm/cyber glows behind key surface cards.
   - Never flat grey backgrounds: use deep tinted slate/indigo (`#030712`, `#060b18`, `#0a0f1d`).
4. **Progressive Blur & Layered Glass**:
   - Multiple backdrop filter steps (`backdrop-blur-xl`, `backdrop-blur-2xl`) with specular top-edge highlights (`border-t border-white/20`).
5. **Modern Typeface Hierarchy**:
   - `Plus Jakarta Sans` / `Inter` with tight tracking on headings (`tracking-tight`) and generous line-height on descriptions.
   - Tabular monospace numbers for metrics and currency values.

---

## 2. Component Design Standards

- **Metric KPI Cards**: Ambient glowing backing, 1px gradient border, vibrant icon badge with soft glow shadow, clean progress micro-bars.
- **Data Tables & Kanban**: High contrast readable cells, pill badges with 15% opacity backgrounds and 30% borders, smooth hover row lift physics.
- **Buttons & Pills**: Shiny highlight border, active scale down (`active:scale-95`), smooth transition `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Modals & Drawers**: Deep backdrop overlay (`bg-slate-950/80 backdrop-blur-md`), floating card with specular gradient border and smooth slide-in.
