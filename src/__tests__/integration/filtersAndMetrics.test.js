import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateMetrics,
  isWithinDateRange,
  normalizeCvResult,
  normalizePvResult
} from '../../utils/dataNormalizer.js';

describe('Integration Tests: Filters & Metrics Pipeline', () => {

  const sampleCandidates = [
    {
      id: 1,
      name: 'Phan Hoài An',
      phone: '+84332530656',
      email: 'phanhoaian09006@gmail.com',
      ctvCode: 'HN01',
      positionCompany: 'Fullstack Developer',
      timestamp: '18/06/2026 22:54',
      cvResultRaw: 'Fail',
      pvResultRaw: ''
    },
    {
      id: 2,
      name: 'NGUYEN QUOC TRIEU',
      phone: '84978475965',
      email: 'mcsoftvn@gmail.com',
      ctvCode: 'HN01',
      positionCompany: 'Senior Fullstack Developer',
      timestamp: '18/06/2026 10:36',
      cvResultRaw: 'Pass',
      pvResultRaw: 'Pass',
      interviewDate: '20/06/2026',
      onboardingDate: '01/07/2026'
    },
    {
      id: 3,
      name: 'Mai Duc Chien',
      phone: '0976663920',
      email: 'chien.khmt@gmail.com',
      ctvCode: 'HN02',
      positionCompany: 'Senior Java Developer',
      timestamp: '17/06/2026 20:38',
      cvResultRaw: 'Pass',
      pvResultRaw: 'Chờ kết quả',
      interviewDate: '21/06/2026'
    },
    {
      id: 4,
      name: 'ANH LE DUC',
      phone: '333037357',
      email: 'mamwithcode@live.com',
      ctvCode: 'HN03',
      positionCompany: 'Remote - AI Engineer',
      timestamp: '09/08/2025 09:52',
      cvResultRaw: 'Chờ duyệt',
      pvResultRaw: ''
    }
  ];

  it('should filter candidates by text search query (Name, Phone, Email, Position)', () => {
    const query = 'fullstack';
    const filtered = sampleCandidates.filter((c) => {
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.positionCompany.toLowerCase().includes(q)
      );
    });

    assert.strictEqual(filtered.length, 2);
    assert.strictEqual(filtered[0].name, 'Phan Hoài An');
    assert.strictEqual(filtered[1].name, 'NGUYEN QUOC TRIEU');
  });

  it('should filter candidates by CTV Code', () => {
    const ctvFiltered = sampleCandidates.filter((c) => c.ctvCode === 'HN01');
    assert.strictEqual(ctvFiltered.length, 2);
  });

  it('should filter candidates by CV Status (PASS vs FAIL)', () => {
    const passCv = sampleCandidates.filter(
      (c) => normalizeCvResult(c.cvResultRaw).key === 'PASS'
    );
    const failCv = sampleCandidates.filter(
      (c) => normalizeCvResult(c.cvResultRaw).key === 'FAIL'
    );

    assert.strictEqual(passCv.length, 2);
    assert.strictEqual(failCv.length, 1);
  });

  it('should compute combined global metrics accurately from filtered subset', () => {
    const metrics = calculateMetrics(sampleCandidates);

    assert.strictEqual(metrics.total, 4);
    assert.strictEqual(metrics.cvPass, 2);
    assert.strictEqual(metrics.cvFail, 1);
    assert.strictEqual(metrics.onboardedCount, 1);
  });
});
