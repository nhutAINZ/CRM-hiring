import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  VIETNAM_MINIMUM_WAGE_2024,
  CORE_LABOR_LAW_RULES,
  auditJobDescription,
  generateCompliantRewrite,
  VN_LABOR_LAW_QA_DATABASE
} from '../../services/vnLaborLawService.js';

describe('Vietnam Labor Law Compliance & VN Law Advisor Test Suite', () => {

  describe('1. Regional Minimum Wage Table (Nghị định 74/2024/NĐ-CP)', () => {
    it('should have correct minimum wages for all 4 economic regions', () => {
      assert.strictEqual(VIETNAM_MINIMUM_WAGE_2024.region1.monthly, 4960000);
      assert.strictEqual(VIETNAM_MINIMUM_WAGE_2024.region1.hourly, 23800);

      assert.strictEqual(VIETNAM_MINIMUM_WAGE_2024.region2.monthly, 4410000);
      assert.strictEqual(VIETNAM_MINIMUM_WAGE_2024.region2.hourly, 21200);

      assert.strictEqual(VIETNAM_MINIMUM_WAGE_2024.region3.monthly, 3860000);
      assert.strictEqual(VIETNAM_MINIMUM_WAGE_2024.region3.hourly, 18600);

      assert.strictEqual(VIETNAM_MINIMUM_WAGE_2024.region4.monthly, 3450000);
      assert.strictEqual(VIETNAM_MINIMUM_WAGE_2024.region4.hourly, 16600);
    });
  });

  describe('2. Labor Law Core Rules & Statutory Penalties', () => {
    it('should include Điều 8 BLLĐ 2019 prohibiting recruitment discrimination', () => {
      const antiDiscriminationRule = CORE_LABOR_LAW_RULES.find((r) => r.id === 'anti_discrimination');
      assert.ok(antiDiscriminationRule);
      assert.strictEqual(antiDiscriminationRule.article, 'Điều 8, Khoản 1');
      assert.strictEqual(antiDiscriminationRule.severity, 'HIGH');
      assert.strictEqual(antiDiscriminationRule.fineRange, '5.000.000đ - 10.000.000đ');
      assert.ok(antiDiscriminationRule.unlawfulKeywords.includes('chỉ tuyển nữ'));
      assert.ok(antiDiscriminationRule.unlawfulKeywords.includes('chỉ tuyển nam'));
      assert.ok(antiDiscriminationRule.unlawfulKeywords.includes('ưu tiên độc thân'));
    });

    it('should include Điều 17 BLLĐ 2019 prohibiting ID/diploma retention and deposits', () => {
      const depositRule = CORE_LABOR_LAW_RULES.find((r) => r.id === 'no_deposit_or_id_withholding');
      assert.ok(depositRule);
      assert.strictEqual(depositRule.severity, 'CRITICAL');
      assert.strictEqual(depositRule.fineRange, '20.000.000đ - 25.000.000đ');
      assert.ok(depositRule.unlawfulKeywords.includes('giữ bằng gốc'));
      assert.ok(depositRule.unlawfulKeywords.includes('đặt cọc'));
      assert.ok(depositRule.unlawfulKeywords.includes('ký quỹ'));
    });

    it('should include Điều 25 & 26 BLLĐ 2019 on probation duration and 85% salary', () => {
      const probationRule = CORE_LABOR_LAW_RULES.find((r) => r.id === 'probation_limits');
      assert.ok(probationRule);
      assert.ok(probationRule.unlawfulKeywords.includes('thử việc 3 tháng'));
      assert.ok(probationRule.unlawfulKeywords.includes('lương thử việc 70%'));
    });
  });

  describe('3. auditJobDescription Scanner Engine', () => {
    it('should score 100 and COMPLIANT for lawful job descriptions', () => {
      const lawfulJd = `
        Tuyển dụng: Kỹ Sư Phần Mềm Fullstack
        - Địa điểm: Cầu Giấy, Hà Nội
        - Mức lương: 25.000.000đ - 35.000.000đ/tháng
        - Thử việc: 2 tháng theo quy định, hưởng 85% lương chính thức.
        - Đãi ngộ: Tham gia đầy đủ BHXH, BHYT, BHTN theo luật định.
        - Yêu cầu: Tốt nghiệp CĐ/ĐH chuyên ngành CNTT, không phân biệt giới tính.
      `;
      const result = auditJobDescription(lawfulJd);
      assert.strictEqual(result.isFullyCompliant, true);
      assert.strictEqual(result.complianceScore, 100);
      assert.strictEqual(result.status, 'COMPLIANT');
      assert.strictEqual(result.violations.length, 0);
      assert.strictEqual(result.warnings.length, 0);
    });

    it('should flag gender and marital discrimination under Điều 8 BLLĐ 2019', () => {
      const unlawfulJd = `
        Cần tuyển trợ lý giám đốc:
        - Yêu cầu: chỉ tuyển nữ, ưu tiên độc thân, chưa lập gia đình.
      `;
      const result = auditJobDescription(unlawfulJd);
      assert.strictEqual(result.isFullyCompliant, false);
      assert.strictEqual(result.status, 'VIOLATION');
      assert.ok(result.complianceScore < 100);
      const discriminationViolation = result.violations.find((v) => v.ruleId === 'anti_discrimination');
      assert.ok(discriminationViolation);
      assert.strictEqual(discriminationViolation.law, 'Bộ luật Lao động 2019');
      assert.strictEqual(discriminationViolation.fineRange, '5.000.000đ - 10.000.000đ');
      assert.ok(discriminationViolation.matchedWords.includes('chỉ tuyển nữ'));
      assert.ok(discriminationViolation.matchedWords.includes('ưu tiên độc thân'));
    });

    it('should flag illegal diploma retention and cash deposits under Điều 17 BLLĐ 2019', () => {
      const unlawfulJd = `
        Tuyển nhân viên kinh doanh:
        - Hồ sơ: giữ bằng gốc đại học và đặt cọc 5 triệu đồng tiền đồng phục.
      `;
      const result = auditJobDescription(unlawfulJd);
      assert.strictEqual(result.isFullyCompliant, false);
      assert.strictEqual(result.status, 'VIOLATION');
      const depositViolation = result.violations.find((v) => v.ruleId === 'no_deposit_or_id_withholding');
      assert.ok(depositViolation);
      assert.strictEqual(depositViolation.severity, 'CRITICAL');
      assert.strictEqual(depositViolation.fineRange, '20.000.000đ - 25.000.000đ');
      assert.ok(depositViolation.matchedWords.includes('giữ bằng gốc'));
      assert.ok(depositViolation.matchedWords.includes('đặt cọc'));
    });

    it('should flag excessive probation and sub-85% probation salary under Điều 25 & 26', () => {
      const unlawfulJd = `
        Tuyển lập trình viên:
        - Thử việc 3 tháng, lương thử việc 70% mức lương chính.
      `;
      const result = auditJobDescription(unlawfulJd);
      assert.strictEqual(result.isFullyCompliant, false);
      const probationWarning = result.warnings.find((w) => w.ruleId === 'probation_limits');
      assert.ok(probationWarning);
      assert.ok(probationWarning.matchedWords.includes('thử việc 3 tháng'));
      assert.ok(probationWarning.matchedWords.includes('lương thử việc 70%'));
    });

    it('should warn if salary is below Region 1 minimum wage under NĐ 74/2024/NĐ-CP', () => {
      const lowWageJd = `
        Tuyển nhân viên bảo vệ:
        - Mức lương: 3.200.000đ/tháng làm việc tại Hà Nội.
      `;
      const result = auditJobDescription(lowWageJd);
      const wageWarning = result.warnings.find((w) => w.ruleId === 'minimum_wage_check');
      assert.ok(wageWarning);
      assert.ok(wageWarning.description.includes('4.960.000đ/tháng'));
    });

    it('should handle empty or null text safely without crashing', () => {
      const emptyResult = auditJobDescription('');
      assert.strictEqual(emptyResult.isFullyCompliant, true);
      assert.strictEqual(emptyResult.complianceScore, 100);

      const nullResult = auditJobDescription(null);
      assert.strictEqual(nullResult.isFullyCompliant, true);
      assert.strictEqual(nullResult.complianceScore, 100);
    });
  });

  describe('4. generateCompliantRewrite Automated Legal Fixer', () => {
    it('should sanitize prohibited discrimination and illegal retention keywords', () => {
      const dirtyText = 'Yêu cầu: chỉ tuyển nữ, khi vào làm giữ bằng gốc đại học, thử việc 3 tháng.';
      const audit = auditJobDescription(dirtyText);
      const rewritten = generateCompliantRewrite(dirtyText, audit);

      assert.strictEqual(rewritten.includes('chỉ tuyển nữ'), false);
      assert.strictEqual(rewritten.includes('giữ bằng gốc'), false);
      assert.strictEqual(rewritten.includes('thử việc 3 tháng'), false);
      assert.ok(rewritten.includes('nam/nữ (không phân biệt giới tính)'));
      assert.ok(rewritten.includes('không giữ bản gốc/không thu cọc'));
      assert.ok(rewritten.includes('thử việc 2 tháng (hưởng >=85% lương)'));
    });

    it('should return original text unchanged if already compliant', () => {
      const cleanText = 'Tuyển dụng nhân viên kinh doanh không phân biệt giới tính, lương 15.000.000đ.';
      const audit = auditJobDescription(cleanText);
      const rewritten = generateCompliantRewrite(cleanText, audit);
      assert.strictEqual(rewritten, cleanText);
    });
  });

  describe('5. Vietnam Labor Law QA Knowledge Base', () => {
    it('should contain comprehensive, cited questions and answers', () => {
      assert.ok(Array.isArray(VN_LABOR_LAW_QA_DATABASE));
      assert.ok(VN_LABOR_LAW_QA_DATABASE.length >= 5);

      VN_LABOR_LAW_QA_DATABASE.forEach((qa) => {
        assert.ok(qa.id);
        assert.ok(qa.category);
        assert.ok(qa.question);
        assert.ok(qa.answer);
        assert.ok(qa.reference);
      });

      // Verify specific answers
      const depositQa = VN_LABOR_LAW_QA_DATABASE.find((q) => q.id === 'qa_02');
      assert.ok(depositQa.answer.includes('Điều 17 BLLĐ 2019'));
      assert.ok(depositQa.answer.includes('20.000.000 đồng đến 25.000.000 đồng'));
    });
  });

});
