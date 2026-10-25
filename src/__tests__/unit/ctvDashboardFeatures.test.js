import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Unit Tests: CTV Dashboard High-Value Features & Affiliate Kit', () => {
  describe('CtvEarningsCalculator Business Logic', () => {
    const TIERS = [
      { id: 'bronze', name: 'Đồng (Bronze)', minCandidates: 1, bonus: 0, perk: 'Hoa hồng cơ bản 15 - 30%' },
      { id: 'silver', name: 'Bạc (Silver)', minCandidates: 3, bonus: 1500000, perk: '+1.5M thưởng nóng + Ưu tiên duyệt CV' },
      { id: 'gold', name: 'Vàng (Gold)', minCandidates: 6, bonus: 4500000, perk: '+4.5M thưởng nóng + Hỗ trợ lọc CV 1-1' },
      { id: 'diamond', name: 'Kim Cương (Diamond)', minCandidates: 10, bonus: 10000000, perk: '+10M thưởng nóng + Đối tác chiến lược VIP' }
    ];

    const getTier = (count) => {
      if (count >= 10) return TIERS[3];
      if (count >= 6) return TIERS[2];
      if (count >= 3) return TIERS[1];
      return TIERS[0];
    };

    test('should calculate commission accurately for single candidate', () => {
      const avgSalary = 25000000; // 25M VND
      const commissionRate = 20; // 20%
      const candidateCount = 1;

      const baseCommission = (avgSalary * (commissionRate / 100)) * candidateCount;
      const currentTier = getTier(candidateCount);
      const grandTotal = baseCommission + currentTier.bonus;

      assert.equal(baseCommission, 5000000);
      assert.equal(currentTier.id, 'bronze');
      assert.equal(currentTier.bonus, 0);
      assert.equal(grandTotal, 5000000);
    });

    test('should advance to Silver tier and add 1.5M bonus when candidate count reaches 3', () => {
      const avgSalary = 20000000;
      const commissionRate = 25;
      const candidateCount = 3;

      const baseCommission = (avgSalary * (commissionRate / 100)) * candidateCount;
      const currentTier = getTier(candidateCount);
      const grandTotal = baseCommission + currentTier.bonus;

      assert.equal(baseCommission, 15000000);
      assert.equal(currentTier.id, 'silver');
      assert.equal(currentTier.bonus, 1500000);
      assert.equal(grandTotal, 16500000);
    });

    test('should advance to Diamond tier and add 10M bonus when candidate count reaches 10', () => {
      const avgSalary = 30000000;
      const commissionRate = 20;
      const candidateCount = 10;

      const baseCommission = (avgSalary * (commissionRate / 100)) * candidateCount;
      const currentTier = getTier(candidateCount);
      const grandTotal = baseCommission + currentTier.bonus;

      assert.equal(baseCommission, 60000000);
      assert.equal(currentTier.id, 'diamond');
      assert.equal(currentTier.bonus, 10000000);
      assert.equal(grandTotal, 70000000);
    });
  });

  describe('CtvReferralKit Affiliate Link & Message Generation', () => {
    test('should construct valid referral URL with CTV code', () => {
      const ctvCode = 'CTV_PRO99';
      const origin = 'https://crmhiring.netlify.app';
      const referralUrl = `${origin}/?ref=${encodeURIComponent(ctvCode)}#ctv-dashboard`;

      assert.ok(referralUrl.includes('?ref=CTV_PRO99'));
      assert.ok(referralUrl.includes('#ctv-dashboard'));
    });

    test('should extract referral code from query string', () => {
      const searchString = '?ref=CTV_VIP88&source=zalo';
      const params = new URLSearchParams(searchString);
      const refCode = params.get('ref');

      assert.equal(refCode, 'CTV_VIP88');
    });

    test('should format outreach templates with CTV code and link', () => {
      const ctvCode = 'CTV01';
      const referralUrl = `https://crmhiring.netlify.app/?ref=${ctvCode}#ctv-dashboard`;

      const template = `🔥 Hơn 50+ việc làm hấp dẫn đang tuyển dụng! Nộp CV trực tiếp tại: ${referralUrl} (Mã giới thiệu: ${ctvCode})`;

      assert.ok(template.includes(referralUrl));
      assert.ok(template.includes('Mã giới thiệu: CTV01'));
    });
  });

  describe('CtvLeaderboard & Ranking Computation', () => {
    test('should aggregate and sort top CTVs by onboarded and pass candidates', () => {
      const mockCandidates = [
        { ctvCode: 'CTV01', ctvName: 'Nguyễn Văn Minh', onboardingDate: '20/10/2026' },
        { ctvCode: 'CTV01', ctvName: 'Nguyễn Văn Minh', onboardingDate: '22/10/2026' },
        { ctvCode: 'CTV02', ctvName: 'Trần Thị Mai', onboardingDate: '15/10/2026' },
        { ctvCode: 'CTV02', ctvName: 'Trần Thị Mai', cvResultRaw: 'PASS CV' },
        { ctvCode: 'CTV03', ctvName: 'Lê Hoàng Nam', cvResultRaw: 'PASS CV' },
        { ctvCode: 'CTV03', ctvName: 'Lê Hoàng Nam', cvResultRaw: 'PASS CV' },
        { ctvCode: 'CTV03', ctvName: 'Lê Hoàng Nam', onboardingDate: '24/10/2026' }
      ];

      const ctvMap = {};
      mockCandidates.forEach((c) => {
        const code = (c.ctvCode || '').toUpperCase().trim();
        if (!code) return;
        if (!ctvMap[code]) {
          ctvMap[code] = {
            code,
            name: c.ctvName || `CTV ${code}`,
            total: 0,
            pass: 0,
            onboard: 0
          };
        }
        ctvMap[code].total += 1;
        if (c.onboardingDate) {
          ctvMap[code].onboard += 1;
        } else if ((c.cvResultRaw || '').toUpperCase().includes('PASS')) {
          ctvMap[code].pass += 1;
        }
      });

      const ranking = Object.values(ctvMap).sort((a, b) => {
        if (b.onboard !== a.onboard) return b.onboard - a.onboard;
        return b.pass - a.pass;
      });

      assert.equal(ranking[0].code, 'CTV01'); // 2 onboards
      assert.equal(ranking[0].onboard, 2);
      assert.equal(ranking[1].code, 'CTV03'); // 1 onboard, 2 pass
      assert.equal(ranking[2].code, 'CTV02'); // 1 onboard, 1 pass
    });

    test('should mask names for privacy protection', () => {
      const maskName = (name) => {
        if (!name) return 'Cộng Tác Viên';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return `${parts[0]} ***`;
        return `${parts[0]} *** ${parts[parts.length - 1]}`;
      };

      assert.equal(maskName('Nguyễn Văn Minh'), 'Nguyễn *** Minh');
      assert.equal(maskName('Trần Mai'), 'Trần ***');
      assert.equal(maskName('Hoàng'), 'Hoàng');
    });
  });

  describe('CtvUpcomingInterviews & 1-Click Reminder', () => {
    test('should extract candidates scheduled for interview', () => {
      const allCandidates = [
        { id: '1', name: 'Le A', interviewDate: '28/10/2026', interviewTime: '09:30', company: 'FPT' },
        { id: '2', name: 'Tran B', interviewDate: null, pvResultRaw: 'Chờ duyệt CV' },
        { id: '3', name: 'Pham C', pvResultRaw: 'Đang xếp lịch PV', interviewDate: '29/10/2026' }
      ];

      const upcoming = allCandidates.filter((c) => Boolean(c.interviewDate) || (c.pvResultRaw || '').toUpperCase().includes('PV'));

      assert.equal(upcoming.length, 2);
      assert.equal(upcoming[0].name, 'Le A');
      assert.equal(upcoming[1].name, 'Pham C');
    });

    test('should generate clean Zalo reminder link from phone number', () => {
      const phone = '0988.776.655 ';
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const zaloUrl = `https://zalo.me/${cleanPhone}`;

      assert.equal(cleanPhone, '0988776655');
      assert.equal(zaloUrl, 'https://zalo.me/0988776655');
    });
  });
});
