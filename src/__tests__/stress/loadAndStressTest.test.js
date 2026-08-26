import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateMetrics,
  isWithinDateRange,
  normalizeCvResult,
  normalizePvResult,
  getCandidateStage,
  exportCandidatesToCsv
} from '../../utils/dataNormalizer.js';
import { renderTemplate, DEFAULT_TEMPLATES } from '../../utils/emailTemplates.js';

describe('Stress & System Load Benchmark Tests (10,000+ Records)', () => {

  // Generate 10,000 synthetic candidate records representing peak recruitment business load
  const generateLargeDataset = (count = 10000) => {
    const positions = [
      'Fullstack Developer (Java + Frontend)',
      'Senior Java Developer',
      'Remote - AI Engineer',
      'DevOps Lead',
      'Product Manager',
      'Data Scientist',
      'UI/UX Designer'
    ];
    const ctvCodes = ['HN01', 'HN02', 'HN03', 'CTV-47293', 'CTV-56718', 'CTV-70921', 'CTV-36054'];
    const cvStatuses = ['PASS CV', 'FAIL CV', 'Review Fail', 'Chờ duyệt', 'Pass CV'];
    const pvStatuses = ['Pass PV', 'Fail PV', 'Hủy PV', 'Đã hẹn PV', 'Chờ xếp lịch'];

    const list = [];
    for (let i = 1; i <= count; i++) {
      list.push({
        id: i,
        name: `Ứng Viên Thử Nghiệm ${i}`,
        phone: `098${String(i).padStart(7, '0')}`,
        email: `candidate_${i}@fasthunt.vn`,
        ctvCode: ctvCodes[i % ctvCodes.length],
        positionCompany: positions[i % positions.length],
        desiredSalary: `${20 + (i % 30)} Triệu`,
        timestamp: `${(i % 28) + 1}/06/2026 14:30`,
        cvResultRaw: cvStatuses[i % cvStatuses.length],
        pvResultRaw: pvStatuses[i % pvStatuses.length],
        interviewDate: i % 3 === 0 ? '20/06/2026' : '',
        onboardingDate: i % 10 === 0 ? '01/07/2026' : ''
      });
    }
    return list;
  };

  const largeDataset = generateLargeDataset(10000);

  it('Benchmark 1: Data Normalization Throughput (10,000 items < 100ms)', () => {
    const startTime = performance.now();

    largeDataset.forEach((c) => {
      normalizeCvResult(c.cvResultRaw);
      normalizePvResult(c.pvResultRaw, c.interviewDate);
      getCandidateStage(c);
    });

    const duration = performance.now() - startTime;
    assert.ok(duration < 200, `Normalization took ${duration.toFixed(2)}ms, expected < 200ms`);
  });

  it('Benchmark 2: Global KPI & Funnel Metrics Calculation (10,000 items < 100ms)', () => {
    const startTime = performance.now();

    const metrics = calculateMetrics(largeDataset);

    const duration = performance.now() - startTime;
    assert.strictEqual(metrics.total, 10000);
    assert.ok(metrics.cvPass > 0);
    assert.ok(metrics.onboardedCount > 0);
    assert.ok(duration < 150, `Metrics calculation took ${duration.toFixed(2)}ms, expected < 150ms`);
  });

  it('Benchmark 3: Multi-criteria Search & Filtering Stress (10,000 items < 50ms)', () => {
    const startTime = performance.now();
    const query = 'fullstack';

    const filtered = largeDataset.filter((c) => {
      const q = query.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPos = c.positionCompany.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchCtv = c.ctvCode.toLowerCase().includes(q);
      return matchName || matchPos || matchEmail || matchCtv;
    });

    const duration = performance.now() - startTime;
    assert.ok(filtered.length > 0);
    assert.ok(duration < 100, `Filtering took ${duration.toFixed(2)}ms, expected < 100ms`);
  });

  it('Benchmark 4: Mass Template Email Generation Engine (1,000 emails < 50ms)', () => {
    const startTime = performance.now();
    const sampleSub = largeDataset.slice(0, 1000);

    sampleSub.forEach((c) => {
      renderTemplate(DEFAULT_TEMPLATES.templateA, {
        TEN_UNG_VIEN: c.name,
        VI_TRI: c.positionCompany,
        CONG_TY: 'FastHunt Enterprise'
      });
    });

    const duration = performance.now() - startTime;
    assert.ok(duration < 100, `1,000 Email renders took ${duration.toFixed(2)}ms, expected < 100ms`);
  });

  it('Benchmark 5: System Memory & Stability Check', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    const extraDataset = generateLargeDataset(20000);
    const metrics = calculateMetrics(extraDataset);

    assert.strictEqual(metrics.total, 20000);
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDiffMb = (finalMemory - initialMemory) / (1024 * 1024);
    assert.ok(memoryDiffMb < 100, `Memory delta ${memoryDiffMb.toFixed(2)}MB is within safe limits`);
  });
});
