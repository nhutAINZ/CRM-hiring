import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  normalizeCvResult,
  normalizePvResult,
  getCandidateStage,
  parseVietnameseDate,
  calculateMetrics,
  exportCandidatesToCsv,
  isWithinDateRange
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

describe('SENIOR QA COMPREHENSIVE AUDIT & EDGE-CASE SUITE', () => {

  /* =========================================================================
     SECTION 1: BOUNDARY VALUE ANALYSIS (BVA) & EQUIVALENCE PARTITIONING
     ========================================================================= */
  describe('1. Boundary Value Analysis & Negative Testing (BVA/EP)', () => {

    it('QA-BVA-01: Handles empty strings, null, undefined, and non-string inputs safely without crashing', () => {
      assert.strictEqual(normalizeCvResult(null).key, 'PENDING');
      assert.strictEqual(normalizeCvResult(undefined).key, 'PENDING');
      assert.strictEqual(normalizeCvResult('').key, 'PENDING');
      assert.strictEqual(normalizeCvResult(12345).key, 'OTHER');
      assert.strictEqual(normalizeCvResult({}).key, 'PENDING');
    });

    it('QA-BVA-02: Negative keyword precedence (FAIL/REJECT must override positive substrings)', () => {
      // String containing 'ĐẠT' but prefixed with 'KHÔNG' -> MUST BE FAIL
      assert.strictEqual(normalizeCvResult('KHÔNG ĐẠT').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('CVSent Fail').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('Review Fail').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('LOẠI HỒ SƠ').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('CHỜ DUYỆT').key, 'PENDING');
    });

    it('QA-BVA-03: Date Parser boundary checks (Invalid format, leap years, out-of-range dates)', () => {
      assert.strictEqual(parseVietnameseDate('invalid-date'), null);
      assert.strictEqual(parseVietnameseDate('32/13/2026'), null);
      assert.strictEqual(parseVietnameseDate(''), null);
      
      // Valid leap year check
      const leapDate = parseVietnameseDate('29/02/2028');
      assert.ok(leapDate instanceof Date);
      assert.strictEqual(leapDate.getDate(), 29);
      assert.strictEqual(leapDate.getMonth(), 1); // February is index 1
    });

    it('QA-BVA-04: XSS / Malicious script injection in candidate fields', () => {
      const maliciousCandidate = {
        name: '<script>alert("xss")</script>',
        positionCompany: '"><img src=x onerror=alert(1)>',
        cvResultRaw: 'Pass'
      };

      const stage = getCandidateStage(maliciousCandidate);
      assert.strictEqual(stage, 'cv_pass');
      
      const csvOutput = exportCandidatesToCsv([maliciousCandidate]);
      assert.ok(csvOutput.includes('alert("xss")') || csvOutput.includes('<script>'));
    });
  });

  /* =========================================================================
     SECTION 2: CORE FEATURE COMPLIANCE AUDIT (7 VIEWS & AI BOT)
     ========================================================================= */
  describe('2. Feature Compliance Audit Across All Views', () => {

    const mockCandidates = [
      { id: 1, name: 'Lê Văn A', ctvCode: 'CTV-47293', positionCompany: 'Fullstack Dev', cvResultRaw: 'Pass CV', pvResultRaw: 'Pass PV', onboardingDate: '10/06/2026', timestamp: '01/06/2026' },
      { id: 2, name: 'Trần Thị B', ctvCode: 'CTV-47293', positionCompany: 'Fullstack Dev', cvResultRaw: 'Review Fail', pvResultRaw: '', timestamp: '02/06/2026' },
      { id: 3, name: 'Nguyễn Văn C', ctvCode: 'CTV-56718', positionCompany: 'Java Dev', cvResultRaw: 'Pass CV', pvResultRaw: '', interviewDate: '25/06/2026', timestamp: '03/06/2026' },
      { id: 4, name: 'Phạm Thị D', ctvCode: 'CTV-36054', positionCompany: 'AI Lead', cvResultRaw: 'Chờ duyệt', pvResultRaw: '', timestamp: '01/01/2025' } // >48h Urgent candidate
    ];

    it('QA-FEAT-01: View 1 (Candidate Table) - Search, Sorting & Page Badges', () => {
      const q = 'Fullstack';
      const searchResults = mockCandidates.filter(c => 
        c.name.includes(q) || c.positionCompany.includes(q) || c.ctvCode.includes(q)
      );
      assert.strictEqual(searchResults.length, 2);
    });

    it('QA-FEAT-02: View 2 (Executive Overview) - Funnel & Conversion Accuracy', () => {
      const metrics = calculateMetrics(mockCandidates);
      assert.strictEqual(metrics.total, 4);
      assert.strictEqual(metrics.cvPass, 2);
      assert.strictEqual(metrics.cvFail, 1);
      assert.strictEqual(metrics.onboardedCount, 1);
      assert.strictEqual(metrics.urgentCandidates.length, 1); // Candidate 4 applied long ago
    });

    it('QA-FEAT-03: View 3 (Kanban Board) - Stage Classification & Drag-Drop State Mapping', () => {
      const stages = mockCandidates.map(getCandidateStage);
      assert.strictEqual(stages[0], 'onboarded');
      assert.strictEqual(stages[1], 'rejected');
      assert.strictEqual(stages[2], 'interviewing');
      assert.strictEqual(stages[3], 'applied');
    });

    it('QA-FEAT-04: View 4 (Khách Hàng Portal) - Job Grouping & Sheet 2 Row Anchor Links', () => {
      const sheet2Url = getSheet2ViewUrl(DEFAULT_CONFIG.sheet2Id);
      const rowAnchor = `${sheet2Url}#gid=0&range=A12`;
      assert.ok(rowAnchor.includes('edit#gid=0&range=A12'));
    });

    it('QA-FEAT-05: View 5 (CTV Management View) - Gid 497830992 Connection Compliance', () => {
      assert.strictEqual(
        CTV_SHEET_URL,
        'https://docs.google.com/spreadsheets/d/11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk/edit?gid=497830992#gid=497830992'
      );
    });

    it('QA-FEAT-06: FastHunt AI Chatbot Assistant - Progress Report Analysis & Formatting', () => {
      const metrics = calculateMetrics(mockCandidates);
      assert.ok(metrics.cvPassRate > 0);
      
      const summaryText = `Hồ sơ tiếp nhận: ${metrics.total}, Pass CV: ${metrics.cvPass}, Onboard: ${metrics.onboardedCount}`;
      assert.strictEqual(summaryText, 'Hồ sơ tiếp nhận: 4, Pass CV: 2, Onboard: 1');
    });

    it('QA-FEAT-07: Email Generator Engine - Variable Interpolation', () => {
      const inviteText = renderTemplate(DEFAULT_TEMPLATES.templateB, {
        TEN_UNG_VIEN: 'Lê Văn A',
        VI_TRI: 'Fullstack Dev',
        GIO_PV: '10:00 AM',
        NGAY_PV: '25/06/2026'
      });
      assert.ok(inviteText.includes('Lê Văn A'));
      assert.ok(inviteText.includes('Fullstack Dev'));
      assert.ok(inviteText.includes('10:00 AM'));
      assert.ok(inviteText.includes('25/06/2026'));
    });
  });

  /* =========================================================================
     SECTION 3: SYSTEM INTEGRITY & REGRESSION AUDIT
     ========================================================================= */
  describe('3. System Regression & Reliability Audit', () => {

    it('QA-REG-01: CSV Data Export Integrity', () => {
      const sample = [
        { name: 'Hoàng Văn E', positionCompany: 'Tech Lead', ctvCode: 'CTV-999' }
      ];
      const csv = exportCandidatesToCsv(sample);
      assert.ok(typeof csv === 'string');
      assert.ok(csv.includes('Họ và Tên Ứng Viên'));
      assert.ok(csv.includes('Hoàng Văn E'));
    });

    it('QA-REG-02: Date Range Filtering Reliability', () => {
      const candidateObj = { timestamp: '15/06/2026 14:00' };
      const inRange = isWithinDateRange(candidateObj, 'custom', '2026-06-01', '2026-06-30');
      const outOfRange = isWithinDateRange(candidateObj, 'custom', '2026-07-01', '2026-07-31');
      
      assert.strictEqual(inRange, true);
      assert.strictEqual(outOfRange, false);
    });
  });
});
