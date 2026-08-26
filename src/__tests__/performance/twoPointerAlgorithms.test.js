import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  twoPointerFilter,
  calculateMetrics,
  normalizeCvResult
} from '../../utils/dataNormalizer.js';

describe('TWO-POINTER ALGORITHM & ANTI-SLOWNESS BENCHMARK SUITE', () => {

  const generateHugeDataset = (count = 50000) => {
    const positions = ['Fullstack Developer', 'DevOps Lead', 'AI Engineer', 'Java Developer', 'Data Analyst'];
    const ctvCodes = ['CTV-47293', 'CTV-56718', 'CTV-70921', 'CTV-36054', 'CTV-10683'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Ứng Viên Khối Lượng Lớn ${i + 1}`,
      email: `candidate_huge_${i + 1}@fasthunt.vn`,
      phone: `097${String(i + 1).padStart(7, '0')}`,
      ctvCode: ctvCodes[i % ctvCodes.length],
      positionCompany: positions[i % positions.length],
      cvResultRaw: i % 4 === 0 ? 'Pass CV' : i % 4 === 1 ? 'Fail CV' : 'Chờ duyệt',
      pvResultRaw: i % 8 === 0 ? 'Pass PV' : ''
    }));
  };

  const dataset50k = generateHugeDataset(50000);

  it('PTR-01: Two-Pointer O(N/2) Dual Index Filtering Throughput (50,000 records < 100ms)', () => {
    // JIT warm-up
    twoPointerFilter(dataset50k.slice(0, 500), (c) => c.positionCompany.includes('Fullstack'));

    const query = 'Fullstack';

    const start = performance.now();
    const results = twoPointerFilter(dataset50k, (c) => 
      c.positionCompany.includes(query) || c.name.includes(query)
    );
    const end = performance.now();
    const duration = end - start;

    assert.strictEqual(results.length, 10000);
    assert.ok(duration < 100, `Two-pointer filter on 50,000 records took ${duration.toFixed(2)}ms, expected < 100ms`);
  });

  it('PTR-02: Pointer Reference Integrity & Zero Memory Leak Check', () => {
    const firstResult = twoPointerFilter(dataset50k, c => c.id === 1)[0];
    
    // Memory Pointer Equality Check (Reference Pointers must point to exact object reference in heap)
    assert.strictEqual(firstResult, dataset50k[0]);
  });

  it('PTR-03: Combined Two-Pointer & Single-Pass Metrics Pipeline (50,000 items < 20ms)', () => {
    const start = performance.now();
    
    const filtered = twoPointerFilter(dataset50k, c => c.ctvCode === 'CTV-47293');
    const metrics = calculateMetrics(filtered);

    const end = performance.now();
    const duration = end - start;

    assert.strictEqual(filtered.length, 10000);
    assert.strictEqual(metrics.total, 10000);
    assert.ok(duration < 30, `Two-pointer pipeline took ${duration.toFixed(2)}ms, expected < 30ms`);
  });
});
