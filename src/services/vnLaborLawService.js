// ====================================================================
// FASTHUNT RECRUITMENT AGENT - VIETNAM LABOR LAW ADVISOR & AUDIT SERVICE
// Kiến trúc tri thức pháp luật tham chiếu dự án VN-Law-Advisor (CTU-LinguTechies)
// Căn cứ pháp lý: Bộ luật Lao động 2019 (Luật số 45/2019/QH14),
// Nghị định 12/2022/NĐ-CP, Nghị định 74/2024/NĐ-CP, Bộ Pháp điển (Chủ đề 26 - Lao động)
// ====================================================================

/**
 * Bảng mức lương tối thiểu vùng theo Nghị định 74/2024/NĐ-CP
 */
export const VIETNAM_MINIMUM_WAGE_2024 = {
  region1: {
    region: 'Vùng I',
    monthly: 4960000,
    hourly: 23800,
    description: 'Hà Nội, TP.HCM, Hải Phòng, Quảng Ninh, Đà Nẵng, Bình Dương, Đồng Nai, Bà Rịa - Vũng Tàu (khu vực đô thị)'
  },
  region2: {
    region: 'Vùng II',
    monthly: 4410000,
    hourly: 21200,
    description: 'Các thành phố trực thuộc tỉnh, Cần Thơ, Nha Trang, Huế, Thái Nguyên, Nam Định, v.v.'
  },
  region3: {
    region: 'Vùng III',
    monthly: 3860000,
    hourly: 18600,
    description: 'Các thị xã, huyện đồng bằng và trung du'
  },
  region4: {
    region: 'Vùng IV',
    monthly: 3450000,
    hourly: 16600,
    description: 'Khu vực địa bàn còn lại, vùng sâu vùng xa'
  }
};

/**
 * Danh mục các quy định cốt lõi của Bộ luật Lao động 2019 trong tuyển dụng
 */
export const CORE_LABOR_LAW_RULES = [
  {
    id: 'anti_discrimination',
    law: 'Bộ luật Lao động 2019',
    article: 'Điều 8, Khoản 1',
    decree: 'Nghị định 12/2022/NĐ-CP, Điều 9',
    title: 'Nghiêm cấm phân biệt đối xử trong tuyển dụng lao động',
    severity: 'HIGH',
    fineRange: '5.000.000đ - 10.000.000đ',
    description: 'Nghiêm cấm phân biệt đối xử về giới tính, dân tộc, màu da, thành phần xã hội, tình trạng hôn nhân, tín ngưỡng, tôn giáo, nhiễm HIV, khuyết tật hoặc vì lý do mang thai, nuôi con nhỏ.',
    unlawfulKeywords: [
      'chỉ tuyển nam',
      'chỉ tuyển nữ',
      'yêu cầu là nữ',
      'yêu cầu là nam',
      'ưu tiên nam',
      'ưu tiên nữ',
      'ưu tiên độc thân',
      'chưa lập gia đình',
      'chưa có gia đình',
      'chưa sinh con',
      'không tuyển người có gia đình',
      'cam kết không sinh con',
      'không vướng bận con nhỏ'
    ],
    recommendedReplacement: 'Đổi tiêu chí thành: "Tuyển dụng bình đẳng cơ hội cho mọi ứng viên đáp ứng năng lực chuyên môn và phẩm chất nghề nghiệp."'
  },
  {
    id: 'no_deposit_or_id_withholding',
    law: 'Bộ luật Lao động 2019',
    article: 'Điều 17, Khoản 1 & 2',
    decree: 'Nghị định 12/2022/NĐ-CP, Điều 9',
    title: 'Cấm giữ bản chính giấy tờ tùy thân & Cấm yêu cầu đặt cọc tiền',
    severity: 'CRITICAL',
    fineRange: '20.000.000đ - 25.000.000đ',
    description: 'Người sử dụng lao động tuyệt đối không được giữ bản chính giấy tờ tùy thân (CCCD, hộ chiếu, văn bằng, chứng chỉ gốc) hoặc yêu cầu người lao động nộp tiền hay đặt cọc tài sản.',
    unlawfulKeywords: [
      'giữ bằng gốc',
      'giữ bằng đại học gốc',
      'nộp bằng gốc',
      'giữ cccd gốc',
      'giữ chứng minh thư gốc',
      'đặt cọc',
      'tiền cọc',
      'ký quỹ',
      'nộp phí đào tạo trước',
      'nộp tiền đồng phục'
    ],
    recommendedReplacement: 'Hồ sơ chỉ yêu cầu: "Bản photo hoặc bản công chứng giấy tờ tùy thân, bằng cấp. Tuyệt đối không thu bất kỳ chi phí hay giữ giấy tờ gốc của ứng viên."'
  },
  {
    id: 'probation_limits',
    law: 'Bộ luật Lao động 2019',
    article: 'Điều 25 & Điều 26',
    decree: 'Nghị định 12/2022/NĐ-CP, Điều 10',
    title: 'Thời gian thử việc tối đa & Mức lương thử việc tối thiểu 85%',
    severity: 'MEDIUM',
    fineRange: '2.000.000đ - 5.000.000đ',
    description: 'Thử việc tối đa: 180 ngày (quản lý doanh nghiệp); 60 ngày (chuyên môn kỹ thuật CĐ/ĐH); 30 ngày (trung cấp, kỹ thuật); 6 ngày (công việc khác). Lương thử việc ít nhất bằng 85% mức lương chính thức.',
    unlawfulKeywords: [
      'thử việc 3 tháng',
      'thử việc 4 tháng',
      'thử việc 5 tháng',
      'thử việc 6 tháng',
      'thử việc nửa năm',
      'lương thử việc 50%',
      'lương thử việc 60%',
      'lương thử việc 70%',
      'không có lương thử việc'
    ],
    recommendedReplacement: 'Quy định thử việc: "Thời gian thử việc tối đa 60 ngày theo đúng Điều 25 BLLĐ; tiền lương thử việc bảo đảm tối thiểu 85% mức lương chính thức theo Điều 26 BLLĐ."'
  },
  {
    id: 'working_hours_standard',
    law: 'Bộ luật Lao động 2019',
    article: 'Điều 105 & Điều 107',
    decree: 'Nghị định 12/2022/NĐ-CP, Điều 17',
    title: 'Thời giờ làm việc bình thường & Làm thêm giờ',
    severity: 'MEDIUM',
    fineRange: '10.000.000đ - 20.000.000đ',
    description: 'Thời giờ làm việc bình thường không quá 8 giờ/ngày và không quá 48 giờ/tuần. Doanh nghiệp làm việc 6 ngày/tuần phải bố trí nghỉ tối thiểu 24 giờ liên tục/tuần.',
    unlawfulKeywords: [
      'làm 12 tiếng/ngày',
      'làm 14 tiếng/ngày',
      'không ngày nghỉ',
      'không được nghỉ tuần',
      'làm thêm không tính lương',
      'tăng ca không tính lương'
    ],
    recommendedReplacement: 'Ghi rõ: "Thời gian làm việc chuẩn 44h - 48h/tuần. Giờ làm thêm (nếu có) được tính theo đúng quy định hưởng 150% - 200% - 300% lương theo Điều 98 BLLĐ."'
  },
  {
    id: 'statutory_insurance',
    law: 'Luật Bảo hiểm Xã hội 2014 & BLLĐ 2019',
    article: 'Điều 168 BLLĐ 2019',
    decree: 'Nghị định 12/2022/NĐ-CP, Điều 39',
    title: 'Nghĩa vụ tham gia BHXH, BHYT, BHTN bắt buộc',
    severity: 'HIGH',
    fineRange: '12% - 15% tổng số tiền phải đóng',
    description: 'Hợp đồng lao động từ đủ 1 tháng trở lên thuộc diện tham gia bảo hiểm xã hội bắt buộc. Người sử dụng lao động không được từ chối đóng bảo hiểm cho người lao động ký HĐLĐ.',
    unlawfulKeywords: [
      'không đóng bảo hiểm',
      'không đóng bhxh',
      'tự đóng bhxh',
      'trừ toàn bộ bhxh vào lương ứng viên',
      'làm lâu dài không ký hợp đồng'
    ],
    recommendedReplacement: 'Chế độ đãi ngộ: "Ký kết HĐLĐ chính thức và tham gia đầy đủ BHXH, BHYT, BHTN theo luật định ngay sau khi hoàn thành thời gian thử việc."'
  }
];

/**
 * Quét và kiểm tra tuân thủ pháp luật lao động cho văn bản tuyển dụng / JD
 * @param {string} content Nội dung mô tả công việc (JD) hoặc bài đăng tuyển dụng
 * @param {object} options Tùy chọn (vùng lương, vị trí, chức danh)
 * @returns {object} Kết quả phân tích pháp lý chi tiết
 */
export function auditJobDescription(content = '', options = {}) {
  const text = String(content || '').toLowerCase();
  const violations = [];
  const warnings = [];
  const compliantRules = [];

  CORE_LABOR_LAW_RULES.forEach((rule) => {
    let matchedKeywords = [];
    rule.unlawfulKeywords.forEach((kw) => {
      if (text.includes(kw)) {
        matchedKeywords.push(kw);
      }
    });

    if (matchedKeywords.length > 0) {
      const finding = {
        ruleId: rule.id,
        law: rule.law,
        article: rule.article,
        decree: rule.decree,
        title: rule.title,
        severity: rule.severity,
        fineRange: rule.fineRange,
        matchedWords: matchedKeywords,
        description: rule.description,
        replacement: rule.recommendedReplacement
      };

      if (rule.severity === 'CRITICAL' || rule.severity === 'HIGH') {
        violations.push(finding);
      } else {
        warnings.push(finding);
      }
    } else {
      compliantRules.push({
        ruleId: rule.id,
        title: rule.title,
        law: `${rule.law} (${rule.article})`
      });
    }
  });

  // Kiểm tra mức lương tối thiểu vùng nếu văn bản có con số cụ thể
  const safeContent = String(content || '');
  const salaryMatch = safeContent.match(/(\d{1,3}(?:\.\d{3})+)\s*(?:đ|vnđ|đồng)/i);
  if (salaryMatch) {
    const rawVal = parseInt(salaryMatch[1].replace(/\./g, ''), 10);
    const region1Min = VIETNAM_MINIMUM_WAGE_2024.region1.monthly;
    if (rawVal < region1Min && rawVal > 1000000) {
      warnings.push({
        ruleId: 'minimum_wage_check',
        law: 'Nghị định 74/2024/NĐ-CP',
        article: 'Điều 3 & Danh mục địa bàn',
        title: 'Lưu ý kiểm tra Mức Lương Tối Thiểu Vùng 2024 - 2026',
        severity: 'MEDIUM',
        fineRange: '20.000.000đ - 75.000.000đ',
        matchedWords: [`${salaryMatch[0]}`],
        description: `Mức lương phát hiện (${salaryMatch[0]}) có thể thấp hơn mức tối thiểu Vùng I (4.960.000đ/tháng) nếu vị trí này đóng tại địa bàn thuộc Vùng I.`,
        replacement: 'Cần ghi rõ: "Mức lương cơ bản thỏa thuận từ 5.000.000đ trở lên, bảo đảm cao hơn lương tối thiểu vùng theo Nghị định 74/2024/NĐ-CP."'
      });
    }
  }

  const isFullyCompliant = violations.length === 0 && warnings.length === 0;
  const score = Math.max(0, 100 - violations.length * 30 - warnings.length * 15);

  return {
    isFullyCompliant,
    complianceScore: score, // Thang điểm 0 - 100
    status: isFullyCompliant ? 'COMPLIANT' : violations.length > 0 ? 'VIOLATION' : 'WARNING',
    statusLabel: isFullyCompliant
      ? 'Hợp Chuẩn Pháp Luật Tuyển Dụng (BLLĐ 2019)'
      : violations.length > 0
      ? 'Phát Hiện Dấu Hiệu Vi Phạm Pháp Luật Lao Động'
      : 'Cần Rà Soát Điều Chỉnh Theo Luật',
    violations,
    warnings,
    compliantRules,
    auditedAt: new Date().toISOString()
  };
}

/**
 * Đề xuất văn bản sửa đổi hợp chuẩn pháp lý tự động
 */
export function generateCompliantRewrite(originalText = '', auditResult) {
  if (!auditResult || auditResult.isFullyCompliant) {
    return originalText;
  }

  let cleaned = originalText;

  // Thay thế các từ khóa vi phạm bằng câu từ chuẩn
  const allIssues = [...auditResult.violations, ...auditResult.warnings];
  allIssues.forEach((issue) => {
    issue.matchedWords.forEach((word) => {
      const regex = new RegExp(word, 'gi');
      if (issue.ruleId === 'anti_discrimination') {
        cleaned = cleaned.replace(regex, 'nam/nữ (không phân biệt giới tính)');
      } else if (issue.ruleId === 'no_deposit_or_id_withholding') {
        cleaned = cleaned.replace(regex, 'bản photo hồ sơ công chứng (không giữ bản gốc/không thu cọc)');
      } else if (issue.ruleId === 'probation_limits') {
        cleaned = cleaned.replace(regex, 'thử việc 2 tháng (hưởng >=85% lương)');
      }
    });
  });

  return cleaned;
}

/**
 * Tra cứu kho tri thức pháp luật tuyển dụng (Q&A Knowledge Base)
 */
export const VN_LABOR_LAW_QA_DATABASE = [
  {
    id: 'qa_01',
    category: 'Tuyển dụng & Phân biệt đối xử',
    question: 'Doanh nghiệp đăng tuyển có được ghi "Chỉ tuyển nữ" hoặc "Ưu tiên nữ độc thân" không?',
    answer: 'Không được phép. Theo Khoản 1 Điều 8 Bộ luật Lao động 2019 và Điều 9 Nghị định 12/2022/NĐ-CP, việc phân biệt đối xử về giới tính, tình trạng hôn nhân trong tuyển dụng là hành vi bị nghiêm cấm và có thể bị phạt tiền từ 5.000.000 đồng đến 10.000.000 đồng.',
    reference: 'Điều 8 BLLĐ 2019; Điều 9 NĐ 12/2022/NĐ-CP'
  },
  {
    id: 'qa_02',
    category: 'Giấy tờ & Tài chính',
    question: 'Công ty có được quyền giữ bằng đại học gốc hoặc CCCD gốc của người lao động không?',
    answer: 'Tuyệt đối cấm. Khoản 1 Điều 17 BLLĐ 2019 nghiêm cấm người sử dụng lao động giữ bản chính giấy tờ tùy thân, văn bằng, chứng chỉ của người lao động. Hành vi này bị phạt tiền từ 20.000.000 đồng đến 25.000.000 đồng và buộc trả lại giấy tờ.',
    reference: 'Điều 17 BLLĐ 2019; Khoản 2 Điều 9 NĐ 12/2022/NĐ-CP'
  },
  {
    id: 'qa_03',
    category: 'Thử việc & Lương',
    question: 'Thời gian thử việc tối đa của nhân viên văn phòng tốt nghiệp đại học là bao lâu và lương thử việc tối thiểu là bao nhiêu?',
    answer: 'Theo Điều 25 BLLĐ 2019, thời gian thử việc tối đa là 60 ngày đối với công việc có chức danh nghề nghiệp cần trình độ chuyên môn kỹ thuật từ cao đẳng trở lên. Tiền lương của người lao động trong thời gian thử việc ít nhất phải bằng 85% mức lương của công việc đó (Điều 26 BLLĐ 2019).',
    reference: 'Điều 25, Điều 26 BLLĐ 2019'
  },
  {
    id: 'qa_04',
    category: 'Thời giờ làm việc',
    question: 'Quy định về thời giờ làm việc bình thường và làm thêm giờ (tăng ca)?',
    answer: 'Thời giờ làm việc bình thường không quá 8 giờ trong 01 ngày và không quá 48 giờ trong 01 tuần (Điều 105). Số giờ làm thêm không quá 50% số giờ làm việc bình thường/ngày, không quá 40 giờ/tháng và không quá 200 giờ/năm (trường hợp đặc biệt không quá 300 giờ) theo Điều 107.',
    reference: 'Điều 105, 107 BLLĐ 2019'
  },
  {
    id: 'qa_05',
    category: 'Mức lương tối thiểu',
    question: 'Mức lương tối thiểu vùng mới nhất áp dụng cho doanh nghiệp năm 2024 - 2026 là bao nhiêu?',
    answer: 'Theo Nghị định 74/2024/NĐ-CP áp dụng từ ngày 01/07/2024: Vùng I là 4.960.000 đồng/tháng (23.800 đ/giờ); Vùng II là 4.410.000 đồng/tháng (21.200 đ/giờ); Vùng III là 3.860.000 đồng/tháng (18.600 đ/giờ); Vùng IV là 3.450.000 đồng/tháng (16.600 đ/giờ). Doanh nghiệp không được trả lương thấp hơn mức này đối với người lao động làm đủ giờ công tiêu chuẩn.',
    reference: 'Nghị định 74/2024/NĐ-CP'
  }
];
