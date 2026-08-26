import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateMetrics,
  normalizeCvResult,
  normalizePvResult,
  getCandidateStage
} from '../../utils/dataNormalizer.js';

describe('Concurrent 100 Candidate Burst Ingestion Benchmark', () => {

  it('Simulates 100 candidates submitting simultaneously at the exact same millisecond', () => {
    const timestampNow = new Date().toLocaleDateString('vi-VN') + ' 23:56:45';
    
    // Generate 100 candidate burst payload
    const burstCandidates = Array.from({ length: 100 }, (_, i) => ({
      id: `burst_${i + 1}`,
      name: `Ứng Viên Nộp Cùng Lúc ${i + 1}`,
      phone: `090${String(i + 1).padStart(7, '0')}`,
      email: `candidate_burst_${i + 1}@fasthunt.vn`,
      ctvCode: `CTV-${(i % 10) + 1}`,
      positionCompany: i % 2 === 0 ? 'Fullstack Developer' : 'Senior Java Developer',
      timestamp: timestampNow,
      cvResultRaw: i % 3 === 0 ? 'Pass CV' : i % 3 === 1 ? 'Chờ duyệt' : 'Fail CV',
      pvResultRaw: i % 6 === 0 ? 'Pass PV' : ''
    }));

    const startTime = performance.now();

    // 1. Process & Normalize all 100 records
    const normalizedList = burstCandidates.map((c) => {
      const cvNorm = normalizeCvResult(c.cvResultRaw);
      const pvNorm = normalizePvResult(c.pvResultRaw, c.interviewDate);
      const stage = getCandidateStage(c);
      return { ...c, cvNorm, pvNorm, stage };
    });

    // 2. Compute Global KPI Metrics
    const metrics = calculateMetrics(normalizedList);

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Assertions
    assert.strictEqual(normalizedList.length, 100);
    assert.strictEqual(metrics.total, 100);
    assert.ok(metrics.cvPass > 0);
    assert.ok(metrics.cvFail > 0);

    // Performance Threshold Assertions
    assert.ok(duration < 10, `Processing 100 concurrent candidates took ${duration.toFixed(2)}ms, expected < 10ms (Actual: ${duration.toFixed(2)}ms)`);
  });
});
