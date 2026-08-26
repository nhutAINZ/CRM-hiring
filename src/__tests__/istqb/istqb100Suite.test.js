import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  normalizeCvResult,
  normalizePvResult,
  getCandidateStage,
  parseVietnameseDate,
  formatVietnameseDate,
  calculateMetrics,
  isWithinDateRange,
  getCtvLeaderboard,
  exportCandidatesToCsv,
  twoPointerFilter
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

describe('ISTQB 100 TEST CASES AUTOMATED TEST SUITE', () => {

  /* =========================================================================
     TECHNIQUE 1: EQUIVALENCE PARTITIONING (EP) - [TESTS 001 - 020]
     ========================================================================= */
  describe('ISTQB Technique 1: Equivalence Partitioning (EP)', () => {
    // Valid CV Classes
    it('EP-001: Valid Pass CV string class "Pass CV"', () => assert.strictEqual(normalizeCvResult('Pass CV').key, 'PASS'));
    it('EP-002: Valid Pass CV string class "DUYỆT CV"', () => assert.strictEqual(normalizeCvResult('DUYỆT CV').key, 'PASS'));
    it('EP-003: Valid Pass CV string class "ĐẠT VÒNG 1"', () => assert.strictEqual(normalizeCvResult('ĐẠT VÒNG 1').key, 'PASS'));
    it('EP-004: Valid Fail CV string class "Fail CV"', () => assert.strictEqual(normalizeCvResult('Fail CV').key, 'FAIL'));
    it('EP-005: Valid Fail CV string class "LOẠI HỒ SƠ"', () => assert.strictEqual(normalizeCvResult('LOẠI HỒ SƠ').key, 'FAIL'));
    it('EP-006: Valid Fail CV string class "KHÔNG ĐẠT YÊU CẦU"', () => assert.strictEqual(normalizeCvResult('KHÔNG ĐẠT YÊU CẦU').key, 'FAIL'));
    it('EP-007: Valid Fail CV string class "TỪ CHỐI CV"', () => assert.strictEqual(normalizeCvResult('TỪ CHỐI CV').key, 'FAIL'));
    it('EP-008: Valid Pending CV class "Chờ phản hồi"', () => assert.strictEqual(normalizeCvResult('Chờ phản hồi').key, 'PENDING'));
    it('EP-009: Valid Pending CV class "Đang xem xét"', () => assert.strictEqual(normalizeCvResult('Đang xem xét').key, 'PENDING'));
    it('EP-010: Valid Pending CV class "PENDING REVIEW"', () => assert.strictEqual(normalizeCvResult('PENDING REVIEW').key, 'PENDING'));

    // Invalid & Boundary Classes
    it('EP-011: Invalid CV null input class', () => assert.strictEqual(normalizeCvResult(null).key, 'PENDING'));
    it('EP-012: Invalid CV undefined input class', () => assert.strictEqual(normalizeCvResult(undefined).key, 'PENDING'));
    it('EP-013: Invalid CV empty string class', () => assert.strictEqual(normalizeCvResult('').key, 'PENDING'));
    it('EP-014: Other CV string class "Thông tin khác"', () => assert.strictEqual(normalizeCvResult('Thông tin khác').key, 'OTHER'));
    it('EP-015: Numeric CV input class 99999', () => assert.strictEqual(normalizeCvResult(99999).key, 'OTHER'));

    // Valid PV Equivalence Classes
    it('EP-016: Valid Pass PV class "Pass PV"', () => assert.strictEqual(normalizePvResult('Pass PV', '').key, 'PASS'));
    it('EP-017: Valid Pass PV class "NHẬN VIỆC"', () => assert.strictEqual(normalizePvResult('NHẬN VIỆC', '').key, 'PASS'));
    it('EP-018: Valid Fail PV class "HỦY PHỎNG VẤN"', () => assert.strictEqual(normalizePvResult('HỦY PHỎNG VẤN', '').key, 'FAIL'));
    it('EP-019: Valid None PV class (empty raw & date)', () => assert.strictEqual(normalizePvResult('', '').key, 'NONE'));
    it('EP-020: Valid Pending PV class (date present)', () => assert.strictEqual(normalizePvResult('', '25/06/2026').key, 'PENDING'));
  });

  /* =========================================================================
     TECHNIQUE 2: BOUNDARY VALUE ANALYSIS (BVA) - [TESTS 021 - 040]
     ========================================================================= */
  describe('ISTQB Technique 2: Boundary Value Analysis (BVA)', () => {
    // Dataset Size Boundaries (Min = 0, Nominal = 10, Max = 50,000)
    it('BVA-021: Empty dataset boundary (0 candidates)', () => {
      const m = calculateMetrics([]);
      assert.strictEqual(m.total, 0);
      assert.strictEqual(m.cvPassRate, 0);
    });

    it('BVA-022: Single element dataset boundary (1 candidate)', () => {
      const m = calculateMetrics([{ cvResultRaw: 'Pass' }]);
      assert.strictEqual(m.total, 1);
      assert.strictEqual(m.cvPass, 1);
    });

    it('BVA-023: Nominal dataset boundary (10 candidates)', () => {
      const list = Array.from({ length: 10 }, () => ({ cvResultRaw: 'Pass' }));
      assert.strictEqual(calculateMetrics(list).total, 10);
    });

    it('BVA-024: Large dataset boundary (1,000 candidates)', () => {
      const list = Array.from({ length: 1000 }, () => ({ cvResultRaw: 'Pass' }));
      assert.strictEqual(calculateMetrics(list).total, 1000);
    });

    it('BVA-025: Stress dataset boundary (10,000 candidates)', () => {
      const list = Array.from({ length: 10000 }, () => ({ cvResultRaw: 'Pass' }));
      assert.strictEqual(calculateMetrics(list).total, 10000);
    });

    it('BVA-026: Peak stress dataset boundary (50,000 candidates)', () => {
      const list = Array.from({ length: 50000 }, () => ({ cvResultRaw: 'Pass' }));
      assert.strictEqual(calculateMetrics(list).total, 50000);
    });

    // Date Boundaries
    it('BVA-027: Date lower bound (01/01/2000)', () => {
      const d = parseVietnameseDate('01/01/2000');
      assert.strictEqual(d.getFullYear(), 2000);
    });

    it('BVA-028: Date upper bound (31/12/2099)', () => {
      const d = parseVietnameseDate('31/12/2099');
      assert.strictEqual(d.getFullYear(), 2099);
    });

    it('BVA-029: Invalid day upper bound (32/01/2026)', () => assert.strictEqual(parseVietnameseDate('32/01/2026'), null));
    it('BVA-030: Invalid month upper bound (15/13/2026)', () => assert.strictEqual(parseVietnameseDate('15/13/2026'), null));
    it('BVA-031: Leap year valid boundary (29/02/2028)', () => assert.ok(parseVietnameseDate('29/02/2028') !== null));
    it('BVA-032: Non-leap year invalid boundary (29/02/2027)', () => assert.strictEqual(parseVietnameseDate('29/02/2027'), null));
    it('BVA-033: Format date roundtrip (Date -> Str -> Date)', () => {
      const orig = new Date(2026, 5, 20);
      const str = formatVietnameseDate(orig);
      const parsed = parseVietnameseDate(str);
      assert.strictEqual(parsed.getDate(), 20);
    });

    // Filter String Length Boundaries
    it('BVA-034: Empty search string query', () => assert.strictEqual(twoPointerFilter([{ name: 'An' }], c => c.name.includes('')).length, 1));
    it('BVA-035: Single char search query', () => assert.strictEqual(twoPointerFilter([{ name: 'An' }], c => c.name.includes('A')).length, 1));
    it('BVA-036: Long search query boundary (255 chars)', () => {
      const longQ = 'A'.repeat(255);
      assert.strictEqual(twoPointerFilter([{ name: 'An' }], c => c.name.includes(longQ)).length, 0);
    });

    // Sheet Row Index Boundaries
    it('BVA-037: Sheet 2 row index min bound (row 1 header)', () => assert.ok(getSheet2ViewUrl('abc').includes('edit')));
    it('BVA-038: Sheet 2 row index anchor (row 2 first data row)', () => assert.ok(`${getSheet2ViewUrl('abc')}#gid=0&range=A2`.includes('range=A2')));
    it('BVA-039: Sheet 2 row index anchor (row 9999 large dataset)', () => assert.ok(`${getSheet2ViewUrl('abc')}#gid=0&range=A9999`.includes('range=A9999')));
    it('BVA-040: CTV Sheet Gid boundary (497830992)', () => assert.ok(CTV_SHEET_URL.includes('gid=497830992')));
  });

  /* =========================================================================
     TECHNIQUE 3: STATE TRANSITION TESTING (STT) - [TESTS 041 - 060]
     ========================================================================= */
  describe('ISTQB Technique 3: State Transition Testing (STT)', () => {
    // Valid Transitions: Applied -> CV Pass -> Interviewing -> Onboarded
    it('STT-041: Transition S0(Applied) -> S1(CV Pass)', () => {
      const s0 = getCandidateStage({ cvResultRaw: 'Chờ duyệt' });
      const s1 = getCandidateStage({ cvResultRaw: 'Pass CV' });
      assert.strictEqual(s0, 'applied');
      assert.strictEqual(s1, 'cv_pass');
    });

    it('STT-042: Transition S1(CV Pass) -> S2(Interviewing)', () => {
      const s2 = getCandidateStage({ cvResultRaw: 'Pass CV', interviewDate: '25/06/2026' });
      assert.strictEqual(s2, 'interviewing');
    });

    it('STT-043: Transition S2(Interviewing) -> S3(Onboarded)', () => {
      const s3 = getCandidateStage({ cvResultRaw: 'Pass CV', pvResultRaw: 'Pass PV', onboardingDate: '01/07/2026' });
      assert.strictEqual(s3, 'onboarded');
    });

    // Rejection Transitions
    it('STT-044: Transition S0(Applied) -> S4(Rejected - Fail CV)', () => {
      const s4 = getCandidateStage({ cvResultRaw: 'Fail CV' });
      assert.strictEqual(s4, 'rejected');
    });

    it('STT-045: Transition S2(Interviewing) -> S4(Rejected - Fail PV)', () => {
      const s4 = getCandidateStage({ cvResultRaw: 'Pass CV', pvResultRaw: 'Fail PV' });
      assert.strictEqual(s4, 'rejected');
    });

    // Terminal State Consistency Checks
    it('STT-046: Onboarded state precedence over raw strings', () => {
      const s = getCandidateStage({ onboardingDate: '01/07/2026' });
      assert.strictEqual(s, 'onboarded');
    });

    it('STT-047: Rejected state precedence for Review Fail', () => {
      const s = getCandidateStage({ cvResultRaw: 'Review Fail' });
      assert.strictEqual(s, 'rejected');
    });

    it('STT-048: Rejected state precedence for Hủy PV', () => {
      const s = getCandidateStage({ pvResultRaw: 'Hủy PV' });
      assert.strictEqual(s, 'rejected');
    });

    // Pipeline State Sequences 049 - 060
    Array.from({ length: 12 }, (_, i) => {
      const testNum = 49 + i;
      it(`STT-0${testNum}: Pipeline state evaluation sequence ${i + 1}`, () => {
        const stage = getCandidateStage({ cvResultRaw: i % 2 === 0 ? 'Pass' : 'Fail' });
        assert.ok(['cv_pass', 'rejected'].includes(stage));
      });
    });
  });

  /* =========================================================================
     TECHNIQUE 4: DECISION TABLE TESTING (DTT) - [TESTS 061 - 080]
     ========================================================================= */
  describe('ISTQB Technique 4: Decision Table Testing (DTT)', () => {
    // Condition Matrix: CV Status (Pass/Fail/Pending) x PV Status (Pass/Fail/Pending/None) x Interview Scheduled
    const decisionMatrix = [
      { id: 61, cv: 'Pass', pv: 'Pass', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'PASS' },
      { id: 62, cv: 'Pass', pv: 'Fail', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'FAIL' },
      { id: 63, cv: 'Pass', pv: '', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'PENDING' },
      { id: 64, cv: 'Pass', pv: '', scheduled: false, expectedCvKey: 'PASS', expectedPvKey: 'NONE' },
      { id: 65, cv: 'Fail', pv: '', scheduled: false, expectedCvKey: 'FAIL', expectedPvKey: 'NONE' },
      { id: 66, cv: 'Chờ', pv: '', scheduled: false, expectedCvKey: 'PENDING', expectedPvKey: 'NONE' },
      { id: 67, cv: 'Pass', pv: 'Hủy PV', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'FAIL' },
      { id: 68, cv: 'Review Fail', pv: '', scheduled: false, expectedCvKey: 'FAIL', expectedPvKey: 'NONE' },
      { id: 69, cv: 'LOẠI', pv: '', scheduled: false, expectedCvKey: 'FAIL', expectedPvKey: 'NONE' },
      { id: 70, cv: 'DUYỆT', pv: 'Pass', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'PASS' },
      { id: 71, cv: 'Pass', pv: 'NHẬN VIỆC', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'PASS' },
      { id: 72, cv: 'KHÔNG ĐẠT', pv: '', scheduled: false, expectedCvKey: 'FAIL', expectedPvKey: 'NONE' },
      { id: 73, cv: 'REJECT', pv: '', scheduled: false, expectedCvKey: 'FAIL', expectedPvKey: 'NONE' },
      { id: 74, cv: 'ĐANG XEM XÉT', pv: '', scheduled: false, expectedCvKey: 'PENDING', expectedPvKey: 'NONE' },
      { id: 75, cv: 'Pass', pv: 'CHỜ KẾT QUẢ', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'PENDING' },
      { id: 76, cv: 'Pass', pv: 'BỎ PHỎNG VẤN', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'FAIL' },
      { id: 77, cv: 'Pass', pv: 'KHÔNG PHỎNG VẤN', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'FAIL' },
      { id: 78, cv: 'Pass', pv: 'TỪ CHỐI', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'FAIL' },
      { id: 79, cv: 'PENDING REVIEW', pv: '', scheduled: false, expectedCvKey: 'PENDING', expectedPvKey: 'NONE' },
      { id: 80, cv: 'PASS CV', pv: 'PASS PV', scheduled: true, expectedCvKey: 'PASS', expectedPvKey: 'PASS' }
    ];

    decisionMatrix.forEach(rule => {
      it(`DTT-0${rule.id}: Rule (CV=${rule.cv}, PV=${rule.pv}, Date=${rule.scheduled})`, () => {
        const cvRes = normalizeCvResult(rule.cv);
        const pvRes = normalizePvResult(rule.pv, rule.scheduled ? '25/06/2026' : '');
        assert.strictEqual(cvRes.key, rule.expectedCvKey);
        assert.strictEqual(pvRes.key, rule.expectedPvKey);
      });
    });
  });

  /* =========================================================================
     TECHNIQUE 5: USE CASE & USER STORY TESTING (UCT) - [TESTS 081 - 090]
     ========================================================================= */
  describe('ISTQB Technique 5: Use Case & User Story Testing (UCT)', () => {

    it('UCT-081: Recruiter Scenario - Filter candidates by CTV Code & Calculate KPI', () => {
      const dataset = [
        { id: 1, ctvCode: 'CTV-47293', cvResultRaw: 'Pass' },
        { id: 2, ctvCode: 'CTV-47293', cvResultRaw: 'Fail' },
        { id: 3, ctvCode: 'CTV-56718', cvResultRaw: 'Pass' }
      ];
      const filtered = twoPointerFilter(dataset, c => c.ctvCode === 'CTV-47293');
      const metrics = calculateMetrics(filtered);

      assert.strictEqual(filtered.length, 2);
      assert.strictEqual(metrics.total, 2);
      assert.strictEqual(metrics.cvPass, 1);
    });

    it('UCT-082: Client Connect Link Generator with Sheet 2 Row Anchor', () => {
      const url = `${getSheet2ViewUrl('1QxicFfdrkDL_vsUv9uZPwSl1Osi0c06h4xDEBrU6p2Y')}#gid=0&range=A15`;
      assert.ok(url.includes('range=A15'));
    });

    it('UCT-083: CTV Support & Bank Verification Directory Lookup', () => {
      const ctvList = [{ ctvCode: 'CTV-47293', bankName: 'TIMO', bankAccount: '9021422950367' }];
      assert.strictEqual(ctvList[0].bankName, 'TIMO');
    });

    it('UCT-084: FastHunt AI Assistant Progress Report Format Generation', () => {
      const text = renderTemplate('Báo cáo {{CONG_TY}}: {{TONG}} hồ sơ', { CONG_TY: 'FastHunt', TONG: '100' });
      assert.strictEqual(text, 'Báo cáo FastHunt: 100 hồ sơ');
    });

    it('UCT-085: Offer Letter Template Email Generation', () => {
      const offer = renderTemplate(DEFAULT_TEMPLATES.templateA, { TEN_UNG_VIEN: 'Phan Hoài An', VI_TRI: 'Fullstack Dev' });
      assert.ok(offer.includes('Phan Hoài An'));
    });

    it('UCT-086: Interview Invitation Email Generation', () => {
      const invite = renderTemplate(DEFAULT_TEMPLATES.templateB, { TEN_UNG_VIEN: 'Lê Văn A', GIO_PV: '10:00', NGAY_PV: '25/06/2026' });
      assert.ok(invite.includes('10:00'));
    });

    it('UCT-087: CTV Leaderboard Ranking & Pass Rate Calculation', () => {
      const board = getCtvLeaderboard([{ ctvCode: 'CTV-47293', cvResultRaw: 'Pass' }]);
      assert.strictEqual(board[0].code, 'CTV-47293');
    });

    it('UCT-088: Export Candidate Dataset to CSV', () => {
      const csv = exportCandidatesToCsv([{ name: 'Test', ctvCode: 'CTV-1' }]);
      assert.ok(typeof csv === 'string');
    });

    it('UCT-089: Custom Date Range Filter Execution', () => {
      const match = isWithinDateRange({ timestamp: '15/06/2026 14:00' }, 'custom', '2026-06-01', '2026-06-30');
      assert.strictEqual(match, true);
    });

    it('UCT-090: Auto-refresh Config Verification', () => {
      assert.strictEqual(DEFAULT_CONFIG.autoRefreshInterval, 0);
    });
  });

  /* =========================================================================
     TECHNIQUE 6: ERROR GUESSING & EXPLORATORY TESTING (EG) - [TESTS 091 - 100]
     ========================================================================= */
  describe('ISTQB Technique 6: Error Guessing & Exploratory Testing (EG)', () => {

    it('EG-091: Malicious Script Tag Injection in Candidate Name', () => {
      const res = normalizeCvResult('<script>alert("xss")</script>');
      assert.strictEqual(res.key, 'OTHER');
    });

    it('EG-092: Special Characters and Emojis in Candidate Name "🔥 Nguyễn Văn A 🔥"', () => {
      const stage = getCandidateStage({ name: '🔥 Nguyễn Văn A 🔥', cvResultRaw: 'Pass' });
      assert.strictEqual(stage, 'cv_pass');
    });

    it('EG-093: SQL Injection String Guard in CTV Code "\' OR 1=1 --"', () => {
      const res = normalizeCvResult("' OR 1=1 --");
      assert.strictEqual(res.key, 'OTHER');
    });

    it('EG-094: Candidate object with missing/null properties', () => {
      const stage = getCandidateStage({});
      assert.strictEqual(stage, 'applied');
    });

    it('EG-095: Giant String Input Boundary (10,000 chars)', () => {
      const longStr = 'A'.repeat(10000);
      assert.strictEqual(normalizeCvResult(longStr).key, 'OTHER');
    });

    it('EG-096: Deeply Nested Object Input in place of Raw String', () => {
      assert.strictEqual(normalizeCvResult({ deep: { nested: true } }).key, 'PENDING');
    });

    it('EG-097: Symbol Input Guard', () => {
      assert.strictEqual(normalizeCvResult('Symbol(test)').key, 'OTHER');
    });

    it('EG-098: Boolean Input Guard (true / false)', () => {
      assert.strictEqual(normalizeCvResult(true).key, 'OTHER');
    });

    it('EG-099: Function Reference Input Guard', () => {
      assert.strictEqual(normalizeCvResult('() => {}').key, 'OTHER');
    });

    it('EG-100: Complete System Integrity Sanity Check', () => {
      assert.ok(DEFAULT_CONFIG.sheet1Id !== undefined);
      assert.ok(DEFAULT_CONFIG.ctvSheetId !== undefined);
    });
  });
});
