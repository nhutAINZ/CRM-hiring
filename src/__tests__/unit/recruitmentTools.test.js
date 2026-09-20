import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getFacebookGroupSearchUrl,
  getLinkedinGroupSearchUrl
} from '../../utils/recruitmentSearchUrls.js';

describe('Recruitment Groups & Content Gen Unit Tests', () => {
  describe('Facebook & LinkedIn Search URL Builders', () => {
    it('should generate official Facebook search groups query url without broken vanity slugs', () => {
      const query = 'tuyển dụng IT developer Hà Nội';
      const url = getFacebookGroupSearchUrl(query);
      assert.ok(url.startsWith('https://www.facebook.com/search/groups/?q='));
      assert.ok(url.includes(encodeURIComponent(query)));
      // Verify no broken direct slug
      assert.ok(!url.includes('/groups/itvieclamhanoi'));
    });

    it('should generate LinkedIn group search url correctly', () => {
      const query = 'Vietnam IT recruitment recruiter';
      const url = getLinkedinGroupSearchUrl(query);
      assert.ok(url.startsWith('https://www.linkedin.com/search/results/groups/?keywords='));
      assert.ok(url.includes(encodeURIComponent(query)));
    });
  });

  describe('Content Generation Company Name Omission (Bỏ tên doanh nghiệp)', () => {
    const mockJob = {
      id: 'job_test_1',
      title: 'Senior React Developer',
      company: 'Tập Đoàn Công Nghệ ABC XYZ',
      location: 'Hà Nội',
      salary: '35.000.000đ - 50.000.000đ',
      requirements: '- Có 4 năm kinh nghiệm React\n- Thành thạo Redux, Tailwind'
    };

    it('should omit real company name when hideCompanyName is true', () => {
      const hideCompanyName = true;
      const rawCompany = mockJob.company;
      const company = hideCompanyName ? '' : rawCompany;

      // Facebook Hot hook
      const hotHook1 = hideCompanyName
        ? `💎 VIỆC XỊN LƯƠNG CAO — GIA NHẬP DOANH NGHIỆP HÀNG ĐẦU 💎`
        : `💎 VIỆC XỊN LƯƠNG CAO — GIA NHẬP ĐỘI NGŨ ${company.toUpperCase()} 💎`;

      const companySection = hideCompanyName ? '' : `\n🏢 Doanh nghiệp: ${company}`;
      const postText = `${hotHook1}\n📍 Địa điểm làm việc: ${mockJob.location}${companySection}\n💰 Thu nhập: ${mockJob.salary}`;

      // Must NOT contain company name
      assert.ok(!postText.includes('Tập Đoàn Công Nghệ ABC XYZ'));
      assert.ok(!postText.includes('ABC XYZ'));
      assert.ok(postText.includes('Senior React Developer') || postText.includes('Hà Nội'));
    });

    it('should include company name when hideCompanyName is false', () => {
      const hideCompanyName = false;
      const rawCompany = mockJob.company;
      const company = hideCompanyName ? '' : rawCompany;

      const hotHook1 = hideCompanyName
        ? `💎 VIỆC XỊN LƯƠNG CAO — GIA NHẬP DOANH NGHIỆP HÀNG ĐẦU 💎`
        : `💎 VIỆC XỊN LƯƠNG CAO — GIA NHẬP ĐỘI NGŨ ${company.toUpperCase()} 💎`;

      const companySection = hideCompanyName ? '' : `\n🏢 Doanh nghiệp: ${company}`;
      const postText = `${hotHook1}\n📍 Địa điểm làm việc: ${mockJob.location}${companySection}\n💰 Thu nhập: ${mockJob.salary}`;

      // MUST contain company name
      assert.ok(postText.includes('TẬP ĐOÀN CÔNG NGHỆ ABC XYZ'));
      assert.ok(postText.includes('🏢 Doanh nghiệp: Tập Đoàn Công Nghệ ABC XYZ'));
    });

    it('should omit company in LinkedIn and Zalo posts when hideCompanyName is true', () => {
      const hideCompanyName = true;
      const rawCompany = mockJob.company;
      const company = hideCompanyName ? '' : rawCompany;

      // LinkedIn
      const linkedinHiringTitle = hideCompanyName
        ? `We are hiring: ${mockJob.title} (Confidential Opportunity) 🚀`
        : `We are hiring: ${mockJob.title} at ${company} 🚀`;
      assert.ok(!linkedinHiringTitle.includes('ABC XYZ'));
      assert.ok(linkedinHiringTitle.includes('Confidential Opportunity'));

      // Zalo
      const zaloCompany = hideCompanyName ? '' : `\n🏢 Doanh nghiệp: ${company}`;
      const zaloPost = `[TUYỂN DỤNG] ${mockJob.title.toUpperCase()} - ${mockJob.location}${zaloCompany}\n💵 Thu nhập: ${mockJob.salary}`;
      assert.ok(!zaloPost.includes('ABC XYZ'));
      assert.ok(!zaloPost.includes('🏢 Doanh nghiệp:'));
    });
  });
});
