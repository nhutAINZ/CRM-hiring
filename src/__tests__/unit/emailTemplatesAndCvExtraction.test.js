import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  extractEmailFromText,
  extractCandidateEmail,
  generateCandidateEmailFromName,
  removeVietnameseAccents,
  EMAIL_REGEX
} from '../../utils/cvEmailExtractor.js';
import {
  DEFAULT_TEMPLATES,
  renderTemplate
} from '../../utils/emailTemplates.js';

describe('Unit Tests: CV Email Extraction & Email Studio Template Defaults', () => {
  it('should match valid email addresses with regex', () => {
    const text = 'Ứng viên: Nguyễn Văn An, Email liên hệ: an.nguyen.dev@gmail.com, SĐT: 0966383750';
    const email = extractEmailFromText(text);

    assert.strictEqual(email, 'an.nguyen.dev@gmail.com');
  });

  it('should prioritize email near contact section keywords when multiple emails exist', () => {
    const cvText = `
      CÔNG TY CỔ PHẦN CÔNG NGHỆ ABC
      Support email: support@abccompany.vn (do not reply)
      
      THÔNG TIN LIÊN HỆ ỨNG VIÊN:
      Họ và tên: Trần Thị Bích
      Email cá nhân: bich.tran2026@gmail.com
      Số điện thoại: 0912345678
      
      Tham chiếu: hr_reference@oldcompany.com
    `;

    const email = extractEmailFromText(cvText);
    assert.strictEqual(email, 'bich.tran2026@gmail.com');
  });

  it('should extract email from candidate object or raw row fields', () => {
    const candidate = {
      name: 'Lê Văn Cường',
      email: 'cuong.le@techhub.io',
      positionCompany: 'Java Backend Engineer'
    };

    const res = extractCandidateEmail(candidate);
    assert.strictEqual(res.isAutoExtracted, true);
    assert.strictEqual(res.email, 'cuong.le@techhub.io');
    assert.strictEqual(res.badgeText, 'Tự động trích từ CV');
  });

  it('should automatically generate clean candidate email fallback from Vietnamese name when no email is provided', () => {
    const candidate1 = {
      name: 'Lý Tiến Mạnh',
      positionCompany: 'Nhân viên vận hành sàn TMĐT'
    };

    const res1 = extractCandidateEmail(candidate1);
    assert.strictEqual(res1.isAutoExtracted, true);
    assert.strictEqual(res1.email, 'lytienmanh@gmail.com');
    assert.strictEqual(res1.badgeText, 'Tự động điền theo tên');

    const candidate2 = {
      name: 'Lê Thị Ngọc',
      positionCompany: 'Nhân viên in sơ đồ'
    };

    const res2 = extractCandidateEmail(candidate2);
    assert.strictEqual(res2.isAutoExtracted, true);
    assert.strictEqual(res2.email, 'lethingoc@gmail.com');
  });

  it('should render default contact person and hotline across all 4 email templates', () => {
    const defaultVariables = {
      TEN_UNG_VIEN: 'Lý Tiến Mạnh',
      VI_TRI: 'Nhân viên vận hành sàn TMĐT',
      CONG_TY: 'Ultimate Sup',
      NGUOI_LIEN_HE: 'Anh Võ - Bộ phận Tuyển Dụng',
      SDT: '0966 383 750',
      MA_CTV: 'CTV_99',
      TRANG_THAI_CV: 'Pass CV',
      KET_QUA_PV: 'Pass PV',
      NGAY_BAT_DAU: 'CÓ THỂ ĐI LÀM NGAY',
      GIO_PV: '09h00',
      NGAY_PV: '30/08/2026',
      DIA_DIEM_PV: 'Hà Nội',
      HAN_CHOT_PV: '29/08/2026',
      HAN_CHOT: '17h00 ngày 24/08/2026',
      LUONG_THU_VIEC: '8.500.000',
      LUONG_CHINH_THUC: '10.000.000',
      DIA_CHI: '18 Ngõ 55 Dịch Vọng, Cầu Giấy, Hà Nội'
    };

    // Template A (Offer Letter)
    const offer = renderTemplate(DEFAULT_TEMPLATES.templateA, defaultVariables);
    assert.ok(offer.includes('Phụ trách tuyển dụng: Anh Võ - Bộ phận Tuyển Dụng'));
    assert.ok(offer.includes('Hotline / Zalo: 0966 383 750'));

    // Template B (Interview Invite)
    const interview = renderTemplate(DEFAULT_TEMPLATES.templateB, defaultVariables);
    assert.ok(interview.includes('Người liên hệ đón tiếp: Anh Võ - Bộ phận Tuyển Dụng - Hotline / Zalo: 0966 383 750'));

    // Template C (Rejection / Thank you)
    const rejection = renderTemplate(DEFAULT_TEMPLATES.templateC, defaultVariables);
    assert.ok(rejection.includes('Phụ trách tuyển dụng: Anh Võ - Bộ phận Tuyển Dụng'));
    assert.ok(rejection.includes('Hotline / Zalo: 0966 383 750'));

    // Template D (CTV Report)
    const ctvReport = renderTemplate(DEFAULT_TEMPLATES.templateD, defaultVariables);
    assert.ok(ctvReport.includes('Phụ trách điều phối: Anh Võ - Bộ phận Tuyển Dụng (Hotline/Zalo: 0966 383 750)'));
  });
});
