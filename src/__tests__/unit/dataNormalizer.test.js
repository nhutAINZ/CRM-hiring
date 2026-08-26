import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  normalizeCvResult,
  normalizePvResult,
  getCandidateStage,
  parseVietnameseDate,
  calculateMetrics,
  isWithinDateRange
} from '../../utils/dataNormalizer.js';

describe('Unit Tests: dataNormalizer', () => {

  describe('normalizeCvResult()', () => {
    it('should classify PASS CV keywords correctly', () => {
      assert.strictEqual(normalizeCvResult('PASS CV').key, 'PASS');
      assert.strictEqual(normalizeCvResult('Duyệt CV').key, 'PASS');
      assert.strictEqual(normalizeCvResult('Đạt CV').key, 'PASS');
    });

    it('should classify FAIL CV keywords correctly', () => {
      assert.strictEqual(normalizeCvResult('FAIL CV').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('Loại').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('Không đạt').key, 'FAIL');
      assert.strictEqual(normalizeCvResult('Từ chối').key, 'FAIL');
    });

    it('should classify PENDING CV keywords correctly', () => {
      assert.strictEqual(normalizeCvResult('Chờ phản hồi').key, 'PENDING');
      assert.strictEqual(normalizeCvResult('Đang xử lý').key, 'PENDING');
      assert.strictEqual(normalizeCvResult(null).key, 'PENDING');
    });
  });

  describe('normalizePvResult()', () => {
    it('should classify NONE when rawStr and date are empty', () => {
      assert.strictEqual(normalizePvResult(null, null).key, 'NONE');
    });

    it('should classify PASS PV keywords correctly', () => {
      assert.strictEqual(normalizePvResult('Pass phỏng vấn').key, 'PASS');
      assert.strictEqual(normalizePvResult('Đạt PV').key, 'PASS');
      assert.strictEqual(normalizePvResult('Nhận việc').key, 'PASS');
    });

    it('should classify FAIL / HỦY PV keywords correctly', () => {
      assert.strictEqual(normalizePvResult('Fail PV').key, 'FAIL');
      assert.strictEqual(normalizePvResult('Không phỏng vấn').key, 'FAIL');
      assert.strictEqual(normalizePvResult('Hủy PV').key, 'FAIL');
    });

    it('should classify PENDING PV when interview date is scheduled', () => {
      assert.strictEqual(normalizePvResult(null, '20/06/2026').key, 'PENDING');
    });
  });

  describe('getCandidateStage()', () => {
    it('should identify onboarded stage', () => {
      const candidate = {
        cvResultRaw: 'Pass',
        pvResultRaw: 'Pass',
        interviewDate: '15/06/2026',
        onboardingDate: '01/07/2026'
      };
      assert.strictEqual(getCandidateStage(candidate), 'onboarded');
    });

    it('should identify rejected stage', () => {
      const candidate = { cvResultRaw: 'Fail', pvResultRaw: '' };
      assert.strictEqual(getCandidateStage(candidate), 'rejected');
    });

    it('should identify interviewing stage', () => {
      const candidate = { cvResultRaw: 'Pass', interviewDate: '20/06/2026' };
      assert.strictEqual(getCandidateStage(candidate), 'interviewing');
    });

    it('should identify cv_pass stage', () => {
      const candidate = { cvResultRaw: 'Pass CV', pvResultRaw: '', interviewDate: '' };
      assert.strictEqual(getCandidateStage(candidate), 'cv_pass');
    });

    it('should default to applied stage', () => {
      const candidate = { cvResultRaw: 'Chờ duyệt', pvResultRaw: '' };
      assert.strictEqual(getCandidateStage(candidate), 'applied');
    });
  });

  describe('parseVietnameseDate()', () => {
    it('should parse DD/MM/YYYY correctly', () => {
      const d = parseVietnameseDate('18/06/2026 22:54');
      assert.ok(d instanceof Date);
      assert.strictEqual(d.getDate(), 18);
      assert.strictEqual(d.getMonth(), 5); // June is 0-indexed month 5
      assert.strictEqual(d.getFullYear(), 2026);
    });

    it('should return null for invalid date string', () => {
      assert.strictEqual(parseVietnameseDate(null), null);
      assert.strictEqual(parseVietnameseDate('abc'), null);
    });
  });

  describe('calculateMetrics()', () => {
    it('should calculate global metrics summary accurately', () => {
      const testCandidates = [
        { id: 1, name: 'A', cvResultRaw: 'Pass', pvResultRaw: 'Pass', interviewDate: '10/06/2026', onboardingDate: '15/06/2026' },
        { id: 2, name: 'B', cvResultRaw: 'Fail', pvResultRaw: '' },
        { id: 3, name: 'C', cvResultRaw: 'Pass', pvResultRaw: '', interviewDate: '' },
        { id: 4, name: 'D', cvResultRaw: 'Chờ duyệt', pvResultRaw: '' }
      ];

      const m = calculateMetrics(testCandidates);
      assert.strictEqual(m.total, 4);
      assert.strictEqual(m.cvPass, 2);
      assert.strictEqual(m.cvFail, 1);
      assert.strictEqual(m.onboardedCount, 1);
    });
  });
});
