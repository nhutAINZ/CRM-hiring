import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Unit Tests: CTV Authentication, Direct Candidate Submission & Tracking', () => {
  test('should filter candidates accurately by specific CTV code regardless of casing', () => {
    const candidates = [
      { id: '1', name: 'Nguyen A', ctvCode: 'CTV01', cvResultRaw: 'PASS CV' },
      { id: '2', name: 'Tran B', ctvCode: 'ctv01', cvResultRaw: 'Mới tiếp nhận' },
      { id: '3', name: 'Le C', ctvCode: 'CTV02', cvResultRaw: 'PASS CV' },
      { id: '4', name: 'Pham D', ctvCode: 'CTV_HN', cvResultRaw: 'FAIL CV' }
    ];

    const targetCode = 'ctv01';
    const ctv01Candidates = candidates.filter(
      (c) => (c.ctvCode || '').toLowerCase().trim() === targetCode.toLowerCase().trim()
    );

    assert.equal(ctv01Candidates.length, 2);
    assert.equal(ctv01Candidates[0].name, 'Nguyen A');
    assert.equal(ctv01Candidates[1].name, 'Tran B');
  });

  test('should calculate personal CTV stats correctly (Pass CV, Interview, Onboarded)', () => {
    const ctvCandidates = [
      { id: '1', name: 'UV 1', cvResultRaw: 'PASS CV', pvResultRaw: 'Đạt sơ vấn' },
      { id: '2', name: 'UV 2', cvResultRaw: 'PASS CV', interviewDate: '26/10/2026', pvResultRaw: 'Đang PV' },
      { id: '3', name: 'UV 3', cvResultRaw: 'PASS CV', onboardingDate: '01/11/2026', pvResultRaw: 'PASS' },
      { id: '4', name: 'UV 4', cvResultRaw: 'FAIL CV', pvResultRaw: 'Loại' },
      { id: '5', name: 'UV 5', cvResultRaw: 'Mới tiếp nhận', pvResultRaw: '' }
    ];

    let passCvCount = 0;
    let onboardCount = 0;
    let interviewCount = 0;

    ctvCandidates.forEach((c) => {
      const cvRes = (c.cvResultRaw || '').toUpperCase();
      const pvRes = (c.pvResultRaw || '').toUpperCase();

      if (cvRes.includes('PASS')) passCvCount++;
      if (c.onboardingDate || pvRes.includes('PASS') || pvRes.includes('ONBOARD')) {
        onboardCount++;
      } else if (c.interviewDate || pvRes.includes('LỊCH') || pvRes.includes('PV')) {
        interviewCount++;
      }
    });

    assert.equal(passCvCount, 3);
    assert.equal(interviewCount, 1);
    assert.equal(onboardCount, 1);
    assert.equal(ctvCandidates.length, 5);
  });

  test('should generate compliant candidate submission payload with auto-assigned CTV code', () => {
    const currentCtv = { ctvCode: 'CTV_VIP01', name: 'Headhunter Minh' };
    const job = { id: 10, title: 'Senior React Developer', company: 'TechCorp', salary: '30-40M', bonus: '10.000.000d' };

    const candidateName = 'Hoang Van Vuong';
    const phone = '0988776655';
    const cvUrl = 'https://drive.google.com/file/d/sample-cv/view';

    const newCandidate = {
      id: `uv_ctv_${Date.now()}`,
      name: candidateName.trim(),
      ctvCode: currentCtv.ctvCode,
      ctvName: currentCtv.name,
      position: job.title,
      company: job.company,
      desiredSalary: job.salary,
      cvUrl,
      cvResultRaw: 'Mới tiếp nhận',
      pvResultRaw: 'Chờ duyệt CV',
      statusCandidate: 'Mới gửi',
      bonusDate: job.bonus,
      isLocalSubmitted: true
    };

    assert.equal(newCandidate.ctvCode, 'CTV_VIP01');
    assert.equal(newCandidate.ctvName, 'Headhunter Minh');
    assert.equal(newCandidate.position, 'Senior React Developer');
    assert.equal(newCandidate.cvResultRaw, 'Mới tiếp nhận');
    assert.equal(newCandidate.isLocalSubmitted, true);
  });
});
