// ====================================================================
// FASTHUNT RECRUITMENT AGENT - AI MATCHING & CLAUDE PROMPT SERVICE
// Module: Zalo AI Assistant (CV Intelligence, Classification & Matching)
// ====================================================================

import { extractCandidateEntities } from './cvExtractor.js';

/**
 * Classifies an incoming Zalo message into one of 4 categories:
 * - 'CV_NEW': Message contains a CV file or candidate submission
 * - 'SUPPORT_QUERY': Client or CTV asking a question about jobs, salary, policies
 * - 'STATUS_UPDATE': Feedback about interview results or candidate onboarding
 * - 'OTHER': General chat or greeting
 *
 * @param {string} content
 * @param {string} attachmentType
 * @returns {{ category: string, label: string, confidence: number, summary: string }}
 */
export function classifyZaloMessage(content = '', attachmentType = 'none') {
  const text = (content || '').toLowerCase().trim();

  // 1. Check for CV attachment or keywords
  if (
    attachmentType === 'pdf' ||
    attachmentType === 'docx' ||
    text.includes('gửi cv') ||
    text.includes('nộp cv') ||
    text.includes('hồ sơ ứng viên') ||
    text.includes('ứng tuyển vị trí') ||
    text.includes('cv của em') ||
    text.includes('cv em') ||
    text.includes('hồ sơ xin việc')
  ) {
    return {
      category: 'CV_NEW',
      label: 'CV Mới',
      confidence: 0.95,
      summary: 'Ứng viên hoặc CTV gửi hồ sơ CV ứng tuyển vị trí công việc'
    };
  }

  // 2. Status update keywords
  if (
    text.includes('kết quả pv') ||
    text.includes('kết quả phỏng vấn') ||
    text.includes('pass cv') ||
    text.includes('fail cv') ||
    text.includes('đã nhận việc') ||
    text.includes('onboard') ||
    text.includes('hủy lịch') ||
    text.includes('đổi lịch pv') ||
    text.includes('đi làm ngày')
  ) {
    return {
      category: 'STATUS_UPDATE',
      label: 'Cập Nhật Trạng Thái',
      confidence: 0.92,
      summary: 'Thông báo kết quả phỏng vấn / duyệt hồ sơ / lịch đi làm'
    };
  }

  // 3. Support query keywords
  if (
    text.includes('còn tuyển không') ||
    text.includes('mức lương') ||
    text.includes('hoa hồng') ||
    text.includes('bonus') ||
    text.includes('thưởng ctv') ||
    text.includes('yêu cầu kinh nghiệm') ||
    text.includes('jd công việc') ||
    text.includes('xin jd') ||
    text.includes('địa điểm làm việc') ||
    text.includes('thời gian làm việc') ||
    text.includes('hỏi về job') ||
    text.includes('cho em hỏi') ||
    text.includes('ctv được hưởng')
  ) {
    return {
      category: 'SUPPORT_QUERY',
      label: 'Câu Hỏi Hỗ Trợ',
      confidence: 0.89,
      summary: 'Thắc mắc của CTV/Khách hàng về JD, quyền lợi hoặc chính sách'
    };
  }

  // 4. Other fallback
  return {
    category: 'OTHER',
    label: 'Khác / Trao Đổi Chung',
    confidence: 0.75,
    summary: 'Tin nhắn giao tiếp chào hỏi hoặc trao đổi chung'
  };
}

/**
 * Analyzes CV text and computes AI Match Score against available Job openings
 * @param {string} cvText
 * @param {Array} jobList
 * @param {string} [targetJobId]
 * @returns {Promise<Object>} Comprehensive matching report
 */
export async function analyzeAndMatchCv(cvText, jobList = [], targetJobId = null) {
  if (!cvText) {
    throw new Error('Vui lòng cung cấp nội dung CV để phân tích.');
  }

  // 1. Extract Candidate Profile
  const profile = extractCandidateEntities(cvText);
  const cvLower = cvText.toLowerCase();

  // 2. Score candidate against all jobs
  const scoredJobs = jobList.map((job) => {
    let score = 30; // base score

    const titleLower = (job.title || '').toLowerCase();
    const indLower = (job.industry || '').toLowerCase();
    const compLower = (job.company || '').toLowerCase();
    const reqLower = (job.requirements || '').toLowerCase();

    // Industry / Keyword match
    profile.skills.forEach((skill) => {
      const sLower = skill.toLowerCase();
      if (titleLower.includes(sLower) || reqLower.includes(sLower) || indLower.includes(sLower)) {
        score += 15;
      }
    });

    // Experience match
    if (job.status === 'TUYỂN GẤP') score += 5;
    if (profile.experienceYears >= 2 && (titleLower.includes('senior') || titleLower.includes('lead'))) {
      score += 15;
    } else if (profile.experienceYears >= 1) {
      score += 10;
    }

    // Direct title keyword overlap
    const titleWords = titleLower.split(' ').filter(w => w.length > 2);
    titleWords.forEach(word => {
      if (cvLower.includes(word)) score += 4;
    });

    // Clamp score between 35% and 98%
    score = Math.min(98, Math.max(35, score));

    return {
      job,
      score
    };
  });

  // Sort jobs by highest match score
  scoredJobs.sort((a, b) => b.score - a.score);

  // Determine Primary Matched Job
  let primaryMatch = scoredJobs[0];
  if (targetJobId) {
    const specified = scoredJobs.find(item => item.job.id === targetJobId);
    if (specified) primaryMatch = specified;
  }

  const primaryJob = primaryMatch?.job || null;
  const matchScore = primaryMatch?.score || 65;

  // 3. AI Strengths & Weaknesses Generation
  const strengths = [];
  const weaknesses = [];

  if (profile.skills.length > 0) {
    strengths.push(`Sở hữu các kỹ năng chuyên môn trọng tâm: ${profile.skills.slice(0, 4).join(', ')}.`);
  }
  if (profile.experienceYears >= 2) {
    strengths.push(`Thời gian kinh nghiệm tích lũy (${profile.experienceYears} năm) phù hợp với yêu cầu thực tế của doanh nghiệp.`);
  } else {
    strengths.push('Hồ sơ trẻ, năng động, có tiềm năng phát triển và thích ứng nhanh với môi trường làm việc mới.');
  }

  if (primaryJob) {
    strengths.push(`Độ tương thích cao với vị trí "${primaryJob.title}" tại ${primaryJob.company}.`);
  }

  // Weaknesses
  if (profile.experienceYears < 1.5 && primaryJob?.title?.includes('TRƯỞNG PHÒNG')) {
    weaknesses.push('Kinh nghiệm quản lý có thể chưa thực sự vững đối với vị trí cấp Trưởng phòng / Lead.');
  }
  if (!profile.phone || !profile.email) {
    weaknesses.push('Thông tin liên hệ trực tiếp chưa đầy đủ trong tệp CV, cần liên hệ CTV để bổ sung.');
  } else {
    weaknesses.push('Nên xác minh lại mức lương mong muốn cụ thể trước buổi phỏng vấn trực tiếp.');
  }

  // Alternative suggested jobs (excluding primary)
  const suggestedAlternatives = scoredJobs
    .filter(item => item.job?.id !== primaryJob?.id && item.score >= 55)
    .slice(0, 3)
    .map(item => ({
      id: item.job.id,
      title: item.job.title,
      company: item.job.company,
      salary: item.job.salary,
      bonus: item.job.bonus,
      score: item.score,
      sheetRowUrl: item.job.sheetRowUrl
    }));

  return {
    candidate: profile,
    matchedJob: primaryJob,
    matchScore,
    strengths,
    weaknesses,
    aiEvaluation: `Ứng viên ${profile.name} đạt mức độ tương thích **${matchScore}%** cho vị trí **${primaryJob?.title || 'Chưa định danh'}** tại **${primaryJob?.company || 'Doanh nghiệp đối tác'}**. Hồ sơ sở hữu năng lực chuyên môn phù hợp, đề xuất gửi hồ sơ sang bộ phận tuyển dụng để xếp lịch phỏng vấn.`,
    suggestedAlternativeJobs: suggestedAlternatives,
    analyzedAt: new Date().toISOString()
  };
}

/**
 * Generates compelling Zalo Job Broadcast pitch for CTV network
 * @param {Object} job
 * @param {string} [targetAudience='ALL_CTV']
 * @returns {string} Formatted Zalo message
 */
export function generateZaloJobBroadcastPitch(job, targetAudience = 'ALL_CTV') {
  if (!job) return '';

  const isUrgent = (job.status || '').toUpperCase().includes('GẤP');
  const icon = isUrgent ? '🔥 [TUYỂN GẤP]' : '⭐ [JOB MỚI]';

  return `${icon} **${job.title.toUpperCase()}**
🏢 **Công ty đối tác:** ${job.company}
📍 **Khu vực:** ${job.location || 'Hà Nội / TP.HCM'}
💼 **Ngành nghề:** ${job.industry}
💰 **Thu nhập:** ${job.salary || 'Lương hấp dẫn + Thưởng'}
🎁 **HOA HỒNG (BONUS) CHO CTV:** **${job.bonus || '1.875.000 ₫'}**
🛡️ **Thời gian bảo hành:** ${job.warrantyPeriod || '35 Ngày'}
🎯 **Số lượng tuyển:** ${job.headcount || '1'} nhân sự

📝 **Yêu cầu & JD tóm tắt:**
- ${job.requirements || 'Trao đổi chi tiết khi nhận hồ sơ. Đầy đủ JD đính kèm.'}
- File JD gốc: ${job.jdFile || 'Sale-tư-vấn.docx'}

👉 **Gửi CV ứng tuyển ngay để nhận hoa hồng liền tay!**
🔗 **Chi tiết Job Sheet:** ${job.sheetRowUrl || 'https://docs.google.com/spreadsheets/d/1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko/edit'}`;
}

/**
 * Generates an automated assistant reply to a Zalo query
 * @param {string} queryContent
 * @param {Array} jobs
 * @returns {string}
 */
export function generateZaloAutoReply(queryContent = '', jobs = []) {
  const q = queryContent.toLowerCase();

  if (q.includes('bonus') || q.includes('hoa hồng') || q.includes('thưởng')) {
    const highBonusJobs = jobs.filter(j => j.bonus && j.bonus.includes('₫')).slice(0, 3);
    let msg = `Chào bạn! Chính sách hoa hồng CTV tại FASTHUNT vô cùng hấp dẫn (lên đến 5.250.000 ₫ / ứng viên pass):\n`;
    highBonusJobs.forEach((j, i) => {
      msg += `${i + 1}. **${j.title}** (${j.company}): 🎁 **${j.bonus}**\n`;
    });
    msg += `\nBạn muốn nhận thêm thông tin chi tiết của vị trí nào không ạ?`;
    return msg;
  }

  if (q.includes('còn tuyển') || q.includes('job mới') || q.includes('vị trí')) {
    const openJobs = jobs.filter(j => j.status === 'TUYỂN GẤP' || j.status === 'MỚI').slice(0, 3);
    let msg = `Hiện tại FASTHUNT đang mở tuyển gấp các vị trí sau:\n`;
    openJobs.forEach((j, i) => {
      msg += `• **${j.title}** - ${j.company} (Lương: ${j.salary}) | Bonus: **${j.bonus}**\n`;
    });
    msg += `\nBạn có ứng viên phù hợp hãy gửi ngay qua khung chat này để bot tiếp nhận nhé!`;
    return msg;
  }

  return `Cảm ơn bạn đã nhắn tin cho FASTHUNT Tuyển Dụng! Trợ lý AI đã ghi nhận yêu cầu và đội ngũ Recruiter sẽ phản hồi bạn trong ít phút. Nếu bạn cần gửi CV ứng tuyển, vui lòng đính kèm file trực tiếp tại đây!`;
}
