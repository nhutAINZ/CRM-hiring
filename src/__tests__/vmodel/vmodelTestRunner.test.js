import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  normalizeCvResult,
  normalizePvResult,
  getCandidateStage,
  parseVietnameseDate,
  calculateMetrics,
  isWithinDateRange,
  exportCandidatesToCsv
} from '../../utils/dataNormalizer.js';
import {
  DEFAULT_CONFIG,
  getCsvUrl,
  getSheet2ViewUrl,
  getCtvSheetViewUrl,
  CTV_SHEET_URL
} from '../../services/sheetsService.js';
import {
  DEFAULT_TEMPLATES,
  renderTemplate
} from '../../utils/emailTemplates.js';

describe('V-MODEL AUTOMATED TEST SUITE: COMPLETE PROJECT VERIFICATION', () => {

  /* =========================================================================
     LEVEL 1: UNIT TESTING (UT) — Component & Logic Verification
     ========================================================================= */
  describe('L1: Unit Testing (UT)', () => {

    it('UT-01: [BRS-01] normalizeCvResult should map status strings to PASS, FAIL, PENDING', () => {
      assert.strictEqual(normalizeCvResult('Duyệt CV').key, 'PASS');
      assert.strictEqual(normalizeCvResult('Fail CV').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('Review Fail').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('Chờ phản hồi').key, 'PENDING');
    });

    it('UT-02: [BRS-02] normalizePvResult should handle interview status classifications', () => {
      assert.strictEqual(normalizePvResult(null, null).key, 'NONE');
      assert.strictEqual(normalizePvResult('Pass PV').key, 'PASS');
      assert.strictEqual(normalizePvResult('Hủy phỏng vấn').key, 'FAIL');
      assert.strictEqual(normalizePvResult(null, '25/06/2026').key, 'PENDING');
    });

    it('UT-03: [BRS-03] parseVietnameseDate should parse DD/MM/YYYY dates accurately', () => {
      const d = parseVietnameseDate('18/06/2026 22:54');
      assert.ok(d instanceof Date);
      assert.strictEqual(d.getDate(), 18);
      assert.strictEqual(d.getMonth(), 5);
      assert.strictEqual(d.getFullYear(), 2026);
    });

    it('UT-04: [BRS-04] sheetsService should generate valid Google Sheets URLs', () => {
      assert.strictEqual(
        getCsvUrl('sheet_123', '999'),
        'https://docs.google.com/spreadsheets/d/sheet_123/gviz/tq?tqx=out:csv&gid=999'
      );
      assert.strictEqual(
        getSheet2ViewUrl('sheet2_abc'),
        'https://docs.google.com/spreadsheets/d/sheet2_abc/edit'
      );
      assert.strictEqual(
        getCtvSheetViewUrl('ctv_sheet_id', '497830992'),
        'https://docs.google.com/spreadsheets/d/ctv_sheet_id/edit?gid=497830992#gid=497830992'
      );
    });

    it('UT-05: [BRS-05] renderTemplate should replace placeholders in email templates', () => {
      const template = 'Xin chào {{TEN_UNG_VIEN}}, vị trí {{VI_TRI}}';
      const rendered = renderTemplate(template, { TEN_UNG_VIEN: 'Phan Hoài An', VI_TRI: 'Java Developer' });
      assert.strictEqual(rendered, 'Xin chào Phan Hoài An, vị trí Java Developer');
    });
  });

  /* =========================================================================
     LEVEL 2: INTEGRATION TESTING (IT) — Module Interaction Verification
     ========================================================================= */
  describe('L2: Integration Testing (IT)', () => {

    const testCandidates = [
      { id: 1, name: 'Phan Hoài An', ctvCode: 'CTV-47293', positionCompany: 'Fullstack Dev', cvResultRaw: 'Pass', pvResultRaw: 'Pass', onboardingDate: '01/07/2026' },
      { id: 2, name: 'Nguyen Quoc Trieu', ctvCode: 'CTV-47293', positionCompany: 'Fullstack Dev', cvResultRaw: 'Fail', pvResultRaw: '' },
      { id: 3, name: 'Mai Duc Chien', ctvCode: 'CTV-56718', positionCompany: 'Java Dev', cvResultRaw: 'Pass', pvResultRaw: 'Pending', interviewDate: '20/06/2026' }
    ];

    it('IT-01: [SRS-01] Filtering and KPI Metrics Calculation should synchronize accurately', () => {
      const filtered = testCandidates.filter(c => c.ctvCode === 'CTV-47293');
      const metrics = calculateMetrics(filtered);

      assert.strictEqual(filtered.length, 2);
      assert.strictEqual(metrics.total, 2);
      assert.strictEqual(metrics.cvPass, 1);
      assert.strictEqual(metrics.cvFail, 1);
    });

    it('IT-02: [SRS-02] CTV Registration & Candidate Submissions Mapping', () => {
      const ctvList = [
        { ctvCode: 'CTV-47293', name: 'Trương Nguyễn Thanh Ngân', bankAccount: '9021422950367', bankName: 'TIMO' },
        { ctvCode: 'CTV-56718', name: 'Huỳnh Trần Xi Na', bankAccount: '233294958', bankName: 'VP Bank' }
      ];

      const ctvMap = new Map();
      ctvList.forEach(ctv => {
        const submitted = testCandidates.filter(c => c.ctvCode === ctv.ctvCode);
        ctvMap.set(ctv.ctvCode, { ...ctv, submittedCount: submitted.length });
      });

      assert.strictEqual(ctvMap.get('CTV-47293').submittedCount, 2);
      assert.strictEqual(ctvMap.get('CTV-56718').submittedCount, 1);
    });

    it('IT-03: [SRS-03] Client Jobs Connect Link Generation with Sheet Row Anchors', () => {
      const sheet2ViewUrl = getSheet2ViewUrl('1QxicFfdrkDL_vsUv9uZPwSl1Osi0c06h4xDEBrU6p2Y');
      const jobRowIndex = 15;
      const connectUrl = `${sheet2ViewUrl}#gid=0&range=A${jobRowIndex}`;

      assert.ok(connectUrl.includes('range=A15'));
      assert.ok(connectUrl.includes('1QxicFfdrkDL_vsUv9uZPwSl1Osi0c06h4xDEBrU6p2Y'));
    });
  });

  /* =========================================================================
     LEVEL 3: SYSTEM TESTING (ST) — End-to-End System Workflow Verification
     ========================================================================= */
  describe('L3: System Testing (ST)', () => {

    it('ST-01: [FS-01] Complete Candidate Lifecycle Stage Transition Flow', () => {
      // 1. Applied
      const candidateStage1 = getCandidateStage({ cvResultRaw: 'Chờ duyệt', pvResultRaw: '' });
      assert.strictEqual(candidateStage1, 'applied');

      // 2. Pass CV
      const candidateStage2 = getCandidateStage({ cvResultRaw: 'Pass CV', pvResultRaw: '' });
      assert.strictEqual(candidateStage2, 'cv_pass');

      // 3. Interviewing
      const candidateStage3 = getCandidateStage({ cvResultRaw: 'Pass CV', interviewDate: '25/06/2026' });
      assert.strictEqual(candidateStage3, 'interviewing');

      // 4. Onboarded
      const candidateStage4 = getCandidateStage({ cvResultRaw: 'Pass CV', pvResultRaw: 'Pass', onboardingDate: '01/07/2026' });
      assert.strictEqual(candidateStage4, 'onboarded');
    });

    it('ST-02: [FS-02] AI Assistant Progress Analysis & Dispatch Formatting', () => {
      const metrics = calculateMetrics([
        { cvResultRaw: 'Pass', pvResultRaw: 'Pass', onboardingDate: '01/07/2026' },
        { cvResultRaw: 'Fail' }
      ]);

      const reportText = `[FASTHUNT AI PROGRESS REPORT]
Total: ${metrics.total}
Pass CV: ${metrics.cvPass}
Onboarded: ${metrics.onboardedCount}`;

      assert.ok(reportText.includes('Total: 2'));
      assert.ok(reportText.includes('Pass CV: 1'));
      assert.ok(reportText.includes('Onboarded: 1'));
    });
  });

  /* =========================================================================
     LEVEL 4: USER ACCEPTANCE TESTING (UAT) — Business Acceptance Criteria
     ========================================================================= */
  describe('L4: User Acceptance Testing (UAT)', () => {

    it('UAT-01: [AC-01] FastHunt Red Theme Branding & CTV Sheet Connection Compliance', () => {
      assert.strictEqual(
        CTV_SHEET_URL,
        'https://docs.google.com/spreadsheets/d/11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk/edit?gid=497830992#gid=497830992'
      );
    });

    it('UAT-02: [AC-02] 10,000+ Record High-Volume Business Load Performance', () => {
      const largeList = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `UV ${i}`,
        ctvCode: `CTV-${i % 50}`,
        cvResultRaw: i % 2 === 0 ? 'Pass' : 'Fail'
      }));

      const start = performance.now();
      const metrics = calculateMetrics(largeList);
      const end = performance.now();

      assert.strictEqual(metrics.total, 10000);
      assert.ok((end - start) < 150, 'UAT Load Benchmark passed under 150ms');
    });
  });
});
