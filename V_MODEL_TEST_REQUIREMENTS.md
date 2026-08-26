# V-MODEL AUTOMATED TESTING & REQUIREMENTS TRACEABILITY MATRIX

## Executive Summary

This document defines the **V-Model Quality Assurance Framework** for the **FastHunt Reco Web Dashboard & Candidate Management System**. 
Every software requirement—from Business Requirements (BRS) down to Module Function Specifications—is mapped directly 1-to-1 with automated test scripts.

---

## 1. V-Model Architecture Overview

```
[LEFT SIDE: REQUIREMENTS & DESIGN]                       [RIGHT SIDE: VERIFICATION & TESTING]

1. Business Requirements (BRS)      ====================>  Level 4: User Acceptance Testing (UAT)
   - FastHunt Red Branding                                - UAT-01: CTV Sheet Connection Test
   - 10k Record Business Throughput                       - UAT-02: Peak Volume Load Benchmark

2. System Requirements (SRS)        ====================>  Level 3: System Testing (ST)
   - Candidate Lifecycle Management                       - ST-01: Lifecycle Stage Flow
   - AI Chatbot Progress Reports                          - ST-02: Telegram / Zalo Dispatch Engine

3. Architecture & Functional (FS)   ====================>  Level 2: Integration Testing (IT)
   - Filtering & KPI Metrics Sync                         - IT-01: Filter & Metric Sync Test
   - CTV Code & Submission Mapping                        - IT-02: CTV Sheet Mapping Test
   - Client Job Connect Anchors                           - IT-03: Sheet Row Anchor Generator Test

4. Component / Module Design (DS)   ====================>  Level 1: Unit Testing (UT)
   - dataNormalizer functions                            - UT-01 to UT-03: Logic Normalization Tests
   - sheetsService URL builders                           - UT-04: GViz URL Builder Test
   - emailTemplates Engine                                - UT-05: Offer & Invite Render Test
```

---

## 2. Requirements Traceability Matrix (RTM)

| Requirement ID | Module / Requirement Description | Test Level | Test Case ID | Status |
| :--- | :--- | :--- | :--- | :---: |
| **BRS-01** | Categorize raw CV statuses (Pass CV, Fail CV, Review Fail, Pending) | Level 1 (UT) | `UT-01` | **PASSED** |
| **BRS-02** | Categorize Interview statuses (Pass PV, Fail PV, Cancelled, Scheduled) | Level 1 (UT) | `UT-02` | **PASSED** |
| **BRS-03** | Parse Vietnamese dates (`DD/MM/YYYY HH:mm`) accurately | Level 1 (UT) | `UT-03` | **PASSED** |
| **BRS-04** | Construct Google Sheets GViz CSV URLs & Row Anchors | Level 1 (UT) | `UT-04` | **PASSED** |
| **BRS-05** | Interpolate variables into Offer & Interview Email templates | Level 1 (UT) | `UT-05` | **PASSED** |
| **SRS-01** | Synchronize candidate multi-criteria filters with KPI metrics | Level 2 (IT) | `IT-01` | **PASSED** |
| **SRS-02** | Map CTV Registration sheet records (`gid=497830992`) to candidates | Level 2 (IT) | `IT-02` | **PASSED** |
| **SRS-03** | Generate Client Connect direct links with Sheet 2 row anchors | Level 2 (IT) | `IT-03` | **PASSED** |
| **FS-01** | Transition candidate state across recruitment pipeline stages | Level 3 (ST) | `ST-01` | **PASSED** |
| **FS-02** | FastHunt AI Chatbot progress analysis & Telegram/Zalo payload rendering | Level 3 (ST) | `ST-02` | **PASSED** |
| **AC-01** | Connect CTV Google Sheet `11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk` | Level 4 (UAT)| `UAT-01` | **PASSED** |
| **AC-02** | 10,000+ Record high-concurrency business throughput under 150ms | Level 4 (UAT)| `UAT-02` | **PASSED** |

---

## 3. Automated Test Execution Guide

To execute the entire V-Model Automated Test Suite:

```bash
npm run test
```

This command runs all **14 Test Suites** comprising **38 Automated Tests** across Unit, Integration, System, Acceptance, and Stress levels.
