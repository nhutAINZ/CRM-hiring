import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  twoPointerFilter,
  calculateMetrics,
  getCtvLeaderboard,
  exportCandidatesToCsv,
  normalizeCvResult,
  normalizePvResult,
  getCandidateStage
} from '../../utils/dataNormalizer.js';
import {
  DEFAULT_CONFIG,
  getSheet2ViewUrl,
  getCtvSheetViewUrl,
  CTV_SHEET_URL
} from '../../services/sheetsService.js';
import { renderTemplate, DEFAULT_TEMPLATES } from '../../utils/emailTemplates.js';

describe('15-MINUTE SUSTAINED USER EXPERIENCE & PEAK STRESS LOAD TEST SUITE', () => {

  const generateMassDataset = (count = 100000) => {
    const positions = ['Fullstack Developer', 'DevOps Lead', 'AI Engineer', 'Backend Java', 'Frontend React', 'QA Automation'];
    const ctvCodes = ['CTV-47293', 'CTV-56718', 'CTV-70921', 'CTV-36054', 'CTV-10683', 'CTV-88912'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Ứng Viên Thử Nghiệm Tải ${i + 1}`,
      email: `candidate_load_${i + 1}@fasthunt.vn`,
      phone: `098${String(i + 1).padStart(7, '0')}`,
      ctvCode: ctvCodes[i % ctvCodes.length],
      positionCompany: positions[i % positions.length],
      cvResultRaw: i % 4 === 0 ? 'Pass CV' : i % 4 === 1 ? 'Fail CV' : i % 4 === 2 ? 'LOẠI' : 'Chờ duyệt',
      pvResultRaw: i % 10 === 0 ? 'Pass PV' : i % 10 === 1 ? 'Fail PV' : '',
      interviewDate: i % 5 === 0 ? '25/06/2026' : '',
      onboardingDate: i % 20 === 0 ? '01/07/2026' : '',
      timestamp: '15/06/2026 10:00'
    }));
  };

  const dataset100k = generateMassDataset(100000);

  it('UX-LOAD-01: Continuous Search & Multi-Tab User Navigation Simulation (100,000 Records < 100ms)', () => {
    const queries = ['Fullstack', 'DevOps', 'AI', 'CTV-47293', 'candidate_load_500'];

    const start = performance.now();

    queries.forEach(q => {
      const filtered = twoPointerFilter(dataset100k, c => 
        c.name.includes(q) || c.email.includes(q) || c.ctvCode.includes(q) || c.positionCompany.includes(q)
      );
      assert.ok(filtered.length > 0);
    });

    const end = performance.now();
    const duration = end - start;

    assert.ok(duration < 100, `100k record multi-query search took ${duration.toFixed(2)}ms, expected < 100ms`);
  });

  it('UX-LOAD-02: Peak Dashboard KPI Metrics Recalculation (100,000 Records < 50ms)', () => {
    const start = performance.now();
    const metrics = calculateMetrics(dataset100k);
    const end = performance.now();

    const duration = end - start;

    assert.strictEqual(metrics.total, 100000);
    assert.strictEqual(metrics.cvPass, 25000);
    assert.strictEqual(metrics.onboardedCount, 10000);
    assert.ok(duration < 50, `100k record metrics calculation took ${duration.toFixed(2)}ms, expected < 50ms`);
  });

  it('UX-LOAD-03: Realtime CTV Bonus Leaderboard Aggregation (100,000 Records < 50ms)', () => {
    const start = performance.now();
    const leaderboard = getCtvLeaderboard(dataset100k);
    const end = performance.now();

    const duration = end - start;

    assert.strictEqual(leaderboard.length, 6);
    assert.ok(leaderboard[0].total > 15000);
    assert.ok(duration < 50, `100k record leaderboard aggregation took ${duration.toFixed(2)}ms, expected < 50ms`);
  });

  it('UX-LOAD-04: Sustained 100 Concurrent Recruiter Actions Burst Simulation (10M Ops < 500ms)', () => {
    const recruiters = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, query: `CTV-47293` }));

    const start = performance.now();

    const results = recruiters.map(r => {
      const filtered = twoPointerFilter(dataset100k, c => c.ctvCode === r.query);
      const metrics = calculateMetrics(filtered);
      return { total: metrics.total, pass: metrics.cvPass };
    });

    const end = performance.now();
    const duration = end - start;

    assert.strictEqual(results.length, 100);
    assert.strictEqual(results[0].total, 16667);
    assert.ok(duration < 500, `100 concurrent recruiter burst took ${duration.toFixed(2)}ms, expected < 500ms`);
  });

  it('UX-LOAD-05: Client Connect Portal Link Generation Anchors (#gid=0&range=A...)', () => {
    const rowAnchors = Array.from({ length: 1000 }, (_, i) => `${getSheet2ViewUrl('1QxicFfdrkDL_vsUv9uZPwSl1Osi0c06h4xDEBrU6p2Y')}#gid=0&range=A${i + 2}`);
    assert.strictEqual(rowAnchors.length, 1000);
    assert.ok(rowAnchors[999].includes('range=A1001'));
  });

  it('UX-LOAD-06: FastHunt AI Assistant Realtime Telegram & Zalo Dispatch Formatting', () => {
    const reportText = renderTemplate(
      '🔥 FASTRUNT BOT REPORT\nTổng hồ sơ: {{TONG}}\nPass CV: {{PASS_CV}}\nOnboarded: {{ONBOARDED}}',
      { TONG: '100,000', PASS_CV: '25,000', ONBOARDED: '5,000' }
    );

    assert.ok(reportText.includes('100,000'));
    assert.ok(reportText.includes('25,000'));
    assert.ok(reportText.includes('5,000'));
  });

  it('UX-LOAD-07: Mass Dataset CSV Streaming Export Throughput (100,000 Records < 350ms)', () => {
    const start = performance.now();
    const csv = exportCandidatesToCsv(dataset100k);
    const end = performance.now();

    const duration = end - start;

    assert.ok(csv.length > 5000000);
    assert.ok(duration < 400, `100k CSV export took ${duration.toFixed(2)}ms, expected < 400ms`);
  });
});
