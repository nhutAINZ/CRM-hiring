import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  normalizeCvResult,
  normalizePvResult,
  getCandidateStage,
  parseVietnameseDate,
  formatVietnameseDate,
  isWithinDateRange,
  calculateMetrics,
  getCtvLeaderboard,
  exportCandidatesToCsv,
  twoPointerFilter
} from '../../utils/dataNormalizer.js';
import {
  DEFAULT_CONFIG,
  CTV_SHEET_URL,
  getCsvUrl,
  getSheet2ViewUrl,
  getCtvSheetViewUrl,
  getStoredConfig,
  saveStoredConfig
} from '../../services/sheetsService.js';
import {
  DEFAULT_TEMPLATES,
  renderTemplate
} from '../../utils/emailTemplates.js';

describe('MASTER UNIT TESTING (UT) SUITE: ALL CODEBASE FUNCTIONS', () => {

  /* =========================================================================
     MODULE 1: dataNormalizer.js - Status Normalization Units
     ========================================================================= */
  describe('UT Module 1: dataNormalizer.js - Status Normalization', () => {

    it('UT-DN-01: normalizeCvResult PASS keywords ("Pass CV", "DUYỆT", "ĐẠT")', () => {
      assert.strictEqual(normalizeCvResult('Pass CV').key, 'PASS');
      assert.strictEqual(normalizeCvResult('DUYỆT CV').key, 'PASS');
      assert.strictEqual(normalizeCvResult('ĐẠT VÒNG 1').key, 'PASS');
    });

    it('UT-DN-02: normalizeCvResult FAIL keywords ("Fail", "LOẠI", "KHÔNG ĐẠT", "REJECT")', () => {
      assert.strictEqual(normalizeCvResult('Fail CV').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('LOẠI HỒ SƠ').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('KHÔNG ĐẠT YÊU CẦU').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('REJECTED').key, 'FAIL');
    });

    it('UT-DN-03: normalizeCvResult PENDING keywords ("Chờ", "Đang xem xét")', () => {
      assert.strictEqual(normalizeCvResult('Chờ phản hồi').key, 'PENDING');
      assert.strictEqual(normalizeCvResult('ĐANG DỰ DỊNH').key, 'PENDING');
    });

    it('UT-DN-04: normalizeCvResult Fallbacks (empty, null, numeric, object)', () => {
      assert.strictEqual(normalizeCvResult(null).key, 'PENDING');
      assert.strictEqual(normalizeCvResult(undefined).key, 'PENDING');
      assert.strictEqual(normalizeCvResult('').key, 'PENDING');
      assert.strictEqual(normalizeCvResult('Random Text').key, 'OTHER');
    });

    it('UT-DN-05: normalizePvResult NONE category (no raw string and no interview date)', () => {
      assert.strictEqual(normalizePvResult('', '').key, 'NONE');
      assert.strictEqual(normalizePvResult(null, null).key, 'NONE');
    });

    it('UT-DN-06: normalizePvResult PENDING category (interview date scheduled)', () => {
      const res = normalizePvResult('', '25/06/2026');
      assert.strictEqual(res.key, 'PENDING');
      assert.ok(res.raw.includes('25/06/2026'));
    });

    it('UT-DN-07: normalizePvResult PASS category ("Pass PV", "NHẬN VIỆC")', () => {
      assert.strictEqual(normalizePvResult('Pass PV', '').key, 'PASS');
      assert.strictEqual(normalizePvResult('NHẬN VIỆC', '').key, 'PASS');
    });

    it('UT-DN-08: normalizePvResult FAIL category ("HỦY", "BỎ", "KHÔNG")', () => {
      assert.strictEqual(normalizePvResult('HỦY PV', '').key, 'FAIL');
      assert.strictEqual(normalizePvResult('BỎ PHỎNG VẤN', '').key, 'FAIL');
      assert.strictEqual(normalizePvResult('KHÔNG ĐẠT', '').key, 'FAIL');
    });
  });

  /* =========================================================================
     MODULE 2: dataNormalizer.js - Date & Stage Units
     ========================================================================= */
  describe('UT Module 2: dataNormalizer.js - Date Parsing & Stage Logic', () => {

    it('UT-DN-09: parseVietnameseDate parses valid "DD/MM/YYYY" format', () => {
      const d = parseVietnameseDate('20/06/2026 15:30');
      assert.ok(d instanceof Date);
      assert.strictEqual(d.getDate(), 20);
      assert.strictEqual(d.getMonth(), 5);
      assert.strictEqual(d.getFullYear(), 2026);
    });

    it('UT-DN-10: parseVietnameseDate returns null for invalid formats', () => {
      assert.strictEqual(parseVietnameseDate(null), null);
      assert.strictEqual(parseVietnameseDate('invalid-date'), null);
      assert.strictEqual(parseVietnameseDate('32/13/2026'), null);
    });

    it('UT-DN-11: formatVietnameseDate formats Date object to "DD/MM/YYYY"', () => {
      const d = new Date(2026, 5, 20); // June 20, 2026
      assert.strictEqual(formatVietnameseDate(d), '20/06/2026');
      assert.strictEqual(formatVietnameseDate(null), '');
    });

    it('UT-DN-12: getCandidateStage identifies "onboarded" stage', () => {
      assert.strictEqual(getCandidateStage({ onboardingDate: '01/07/2026' }), 'onboarded');
    });

    it('UT-DN-13: getCandidateStage identifies "rejected" stage', () => {
      assert.strictEqual(getCandidateStage({ cvResultRaw: 'Fail CV' }), 'rejected');
      assert.strictEqual(getCandidateStage({ pvResultRaw: 'Hủy PV' }), 'rejected');
    });

    it('UT-DN-14: getCandidateStage identifies "interviewing" stage', () => {
      assert.strictEqual(getCandidateStage({ cvResultRaw: 'Pass CV', interviewDate: '25/06/2026' }), 'interviewing');
    });

    it('UT-DN-15: getCandidateStage identifies "cv_pass" stage', () => {
      assert.strictEqual(getCandidateStage({ cvResultRaw: 'Pass CV' }), 'cv_pass');
    });

    it('UT-DN-16: getCandidateStage defaults to "applied" stage', () => {
      assert.strictEqual(getCandidateStage({ cvResultRaw: 'Chờ duyệt' }), 'applied');
    });
  });

  /* =========================================================================
     MODULE 3: dataNormalizer.js - Metrics, Leaderboard & Filtering Units
     ========================================================================= */
  describe('UT Module 3: Metrics, Leaderboard & Filtering', () => {

    const sampleDataset = [
      { id: 1, ctvCode: 'CTV-47293', cvResultRaw: 'Pass CV', pvResultRaw: 'Pass PV', onboardingDate: '01/07/2026', timestamp: '15/06/2026' },
      { id: 2, ctvCode: 'CTV-47293', cvResultRaw: 'Fail CV', timestamp: '16/06/2026' },
      { id: 3, ctvCode: 'CTV-56718', cvResultRaw: 'Pass CV', pvResultRaw: '', interviewDate: '25/06/2026', timestamp: '17/06/2026' }
    ];

    it('UT-DN-17: calculateMetrics computes totals and pass rates', () => {
      const m = calculateMetrics(sampleDataset);
      assert.strictEqual(m.total, 3);
      assert.strictEqual(m.cvPass, 2);
      assert.strictEqual(m.cvFail, 1);
      assert.strictEqual(m.onboardedCount, 1);
      assert.strictEqual(m.cvPassRate, 67);
    });

    it('UT-DN-18: getCtvLeaderboard groups candidate submissions by CTV code', () => {
      const board = getCtvLeaderboard(sampleDataset);
      assert.strictEqual(board.length, 2);
      assert.strictEqual(board.find(c => c.code === 'CTV-47293').total, 2);
      assert.strictEqual(board.find(c => c.code === 'CTV-56718').total, 1);
    });

    it('UT-DN-19: twoPointerFilter executes O(N/2) dual pointer matching', () => {
      const matched = twoPointerFilter(sampleDataset, c => c.ctvCode === 'CTV-47293');
      assert.strictEqual(matched.length, 2);
    });

    it('UT-DN-20: exportCandidatesToCsv generates valid CSV formatted string', () => {
      const csv = exportCandidatesToCsv(sampleDataset);
      assert.ok(typeof csv === 'string');
      assert.ok(csv.includes('Họ và Tên Ứng Viên'));
      assert.ok(csv.includes('CTV-47293'));
    });
  });

  /* =========================================================================
     MODULE 4: sheetsService.js - Configuration & URL Generators
     ========================================================================= */
  describe('UT Module 4: sheetsService.js - Configuration & URLs', () => {

    it('UT-SS-21: DEFAULT_CONFIG defines valid default Sheet IDs & GIDs', () => {
      assert.strictEqual(DEFAULT_CONFIG.sheet1Id, '1ij2ivwCd4-hI69XBGIhkhb_jPWbkc5J1oAGtlKwjLXc');
      assert.strictEqual(DEFAULT_CONFIG.sheet1Gid, '1557540072');
      assert.strictEqual(DEFAULT_CONFIG.ctvSheetId, '11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk');
      assert.strictEqual(DEFAULT_CONFIG.ctvSheetGid, '497830992');
    });

    it('UT-SS-22: CTV_SHEET_URL points to official CTV sheet link', () => {
      assert.strictEqual(
        CTV_SHEET_URL,
        'https://docs.google.com/spreadsheets/d/11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk/edit?gid=497830992#gid=497830992'
      );
    });

    it('UT-SS-23: getCsvUrl constructs correct GViz CSV output URL', () => {
      assert.strictEqual(
        getCsvUrl('sheet_id', 'gid_123'),
        'https://docs.google.com/spreadsheets/d/sheet_id/gviz/tq?tqx=out:csv&gid=gid_123'
      );
    });

    it('UT-SS-24: getSheet2ViewUrl constructs Sheet 2 view URL', () => {
      assert.strictEqual(
        getSheet2ViewUrl('sheet2_id'),
        'https://docs.google.com/spreadsheets/d/sheet2_id/edit'
      );
    });

    it('UT-SS-25: getCtvSheetViewUrl constructs CTV Sheet view URL with Gid', () => {
      assert.strictEqual(
        getCtvSheetViewUrl('ctv_id', '497830992'),
        'https://docs.google.com/spreadsheets/d/ctv_id/edit?gid=497830992#gid=497830992'
      );
    });
  });

  /* =========================================================================
     MODULE 5: emailTemplates.js - Template Engine & Variable Interpolation
     ========================================================================= */
  describe('UT Module 5: emailTemplates.js - Email Template Engine', () => {

    it('UT-ET-26: DEFAULT_TEMPLATES contains Offer Letter, Interview Invite, Rejection templates', () => {
      assert.ok(DEFAULT_TEMPLATES.templateA.includes('THƯ MỜI NHẬN VIỆC'));
      assert.ok(DEFAULT_TEMPLATES.templateB.includes('THƯ MỜI PHỎNG VẤN'));
      assert.ok(DEFAULT_TEMPLATES.templateC.includes('THƯ CẢM ƠN VÀ THÔNG BÁO'));
    });

    it('UT-ET-27: renderTemplate replaces variable placeholders accurately', () => {
      const template = 'Xin chào {{TEN_UNG_VIEN}}, vị trí {{VI_TRI}} tại {{CONG_TY}}';
      const rendered = renderTemplate(template, {
        TEN_UNG_VIEN: 'Phan Hoài An',
        VI_TRI: 'Fullstack Developer',
        CONG_TY: 'FastHunt'
      });
      assert.strictEqual(rendered, 'Xin chào Phan Hoài An, vị trí Fullstack Developer tại FastHunt');
    });

    it('UT-ET-28: renderTemplate handles missing variables by preserving tag', () => {
      const template = 'Xin chào {{TEN_UNG_VIEN}}, mã {{MA_UNKNOWN}}';
      const rendered = renderTemplate(template, { TEN_UNG_VIEN: 'Hoài An' });
      assert.strictEqual(rendered, 'Xin chào Hoài An, mã {{MA_UNKNOWN}}');
    });
  });
});
