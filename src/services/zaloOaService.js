// ====================================================================
// FASTHUNT RECRUITMENT AGENT - PERSONAL ZALO RECRUITER SERVICE
// 100% Free Personal Zalo (Nick Thường) - Direct Chat, Scripts & AI Matching
// ====================================================================

import { classifyZaloMessage, analyzeAndMatchCv, generateZaloJobBroadcastPitch, generateZaloAutoReply } from './aiMatchingService.js';
import { extractCandidateEntities } from './cvExtractor.js';

export const ZALO_PERSONAL_CONFIG_STORAGE_KEY = 'fasthunt_zalo_personal_config';
export const ZALO_OA_CONFIG_STORAGE_KEY = ZALO_PERSONAL_CONFIG_STORAGE_KEY; // Backward-compatibility
export const ZALO_MESSAGES_STORAGE_KEY = 'fasthunt_zalo_messages';
export const ZALO_BROADCAST_QUEUE_KEY = 'fasthunt_zalo_broadcast_queue';

export const DEFAULT_PERSONAL_ZALO_CONFIG = {
  recruiterName: 'Huỳnh Minh Nhựt (HR FastHunt)',
  zaloPhone: '0901234567',
  zaloChatUrl: 'https://zalo.me/0901234567',
  ctvGroupName: 'Nhóm Tuyển Dụng & CTV FastHunt Toàn Quốc',
  ctvGroupUrl: 'https://zalo.me/g/fasthunt_ctv_recruitment',
  companyName: 'FASTHUNT Tuyển Dụng & Nhân Tài',
  accountType: 'PERSONAL_NICK', // Nick Thường Cá Nhân (Không cần OA)
  defaultGreeting: 'Chào bạn, mình là HR bên FASTHUNT, mình liên hệ với bạn về cơ hội công việc nhé!',
  isActive: true,
  // Backward-compatibility keys
  oaName: 'Huỳnh Minh Nhựt (Zalo Tuyển Dụng)',
  appId: 'Nick Cá Nhân'
};

export const DEFAULT_ZALO_CONFIG = DEFAULT_PERSONAL_ZALO_CONFIG;

/**
 * Standard Personal Zalo Recruitment Message Templates
 */
export const PERSONAL_ZALO_TEMPLATES = [
  {
    id: 'INTERVIEW_INVITE',
    name: '🎯 Thư Mời Phỏng Vấn (1-1)',
    description: 'Mời ứng viên tham gia phỏng vấn online qua Meet hoặc trực tiếp tại văn phòng',
    generate: (c = {}, j = {}, config = DEFAULT_PERSONAL_ZALO_CONFIG) => {
      const name = c.name || 'bạn';
      const position = c.position || j.title || 'Vị trí ứng tuyển';
      const company = c.company || j.company || config.companyName;
      const date = c.interviewDate || 'ngày mai';
      const time = c.interviewTime || '09:00';
      const location = c.interviewLocation || 'Phòng Họp Online / Văn phòng Công ty';
      const hrContact = config.recruiterName || 'Ban Tuyển Dụng';
      const phone = config.zaloPhone || 'Hotline Zalo';

      return `Chào bạn ${name}, mình là ${hrContact} bên ${company}.

🎉 Chúc mừng bạn đã vượt qua vòng sơ loại hồ sơ cho vị trí **${position}**!

Bộ phận Tuyển dụng trân trọng mời bạn tham gia buổi Phỏng vấn trao đổi công việc:
⏰ **Thời gian:** ${time} - Ngày ${date}
📍 **Địa điểm / Hình thức:** ${location}
👔 **Trang phục:** Lịch sự, chuyên nghiệp

Bạn vui lòng phản hồi tin nhắn này để xác nhận tham gia buổi phỏng vấn nhé. Nếu cần hỗ trợ đổi khung giờ, bạn hãy nhắn lại ngay cho mình qua Zalo này nhé!

Trân trọng,
${hrContact} • Hotline/Zalo: ${phone}`;
    }
  },
  {
    id: 'OFFER_LETTER',
    name: '🏆 Chúc Mừng & Gửi Thư Mời Nhận Việc (Offer)',
    description: 'Thông báo kết quả trúng tuyển, mức lương và ngày bắt đầu làm việc',
    generate: (c = {}, j = {}, config = DEFAULT_PERSONAL_ZALO_CONFIG) => {
      const name = c.name || 'bạn';
      const position = c.position || j.title || 'Vị trí làm việc';
      const company = c.company || j.company || config.companyName;
      const salary = j.salary || 'Thỏa thuận hấp dẫn';
      const startDate = c.onboardDate || 'Thứ 2 tuần tới';
      const address = j.location || 'Trụ sở công ty';
      const hrContact = config.recruiterName || 'Phòng Nhân Sự';

      return `Chào bạn ${name},

🎊 Ban Tuyển Dụng ${company} xin chúc mừng bạn đã xuất sắc vượt qua các vòng phỏng vấn và chính thức được tiếp nhận vào vị trí **${position}**!

📌 **Thông tin tiếp nhận công việc:**
• **Vị trí:** ${position}
• **Mức thu nhập:** ${salary}
• **Ngày bắt đầu nhận việc:** ${startDate}
• **Địa chỉ làm việc:** ${address}

📑 **Hồ sơ cần chuẩn bị ngày đầu nhận việc:**
1. 01 bản photo CCCD/CMND (công chứng)
2. 01 Sơ yếu lý lịch tự thuật
3. Bản sao văn bằng, chứng chỉ liên quan
4. 02 ảnh thẻ 3x4

Bạn phản hồi tin nhắn này để xác nhận đồng ý nhận việc nhé! Chúc bạn có một hành trình làm việc thật tuyệt vời tại ${company}! ✨`;
    }
  },
  {
    id: 'INTERVIEW_REMINDER',
    name: '⏰ Nhắc Lịch Phỏng Vấn (Trước 2 Tiếng)',
    description: 'Nhắc ứng viên chuẩn bị chu đáo trước giờ hẹn phỏng vấn',
    generate: (c = {}, j = {}, config = DEFAULT_PERSONAL_ZALO_CONFIG) => {
      const name = c.name || 'bạn';
      const position = c.position || j.title || 'Vị trí ứng tuyển';
      const time = c.interviewTime || '14:00 hôm nay';
      const location = c.interviewLocation || 'Phòng Họp Online (Google Meet) / Văn phòng';

      return `Chào bạn ${name}, mình là ${config.recruiterName} đây!

⏰ Nhắc nhẹ bạn lịch hẹn Phỏng vấn vị trí **${position}** của chúng mình sẽ diễn ra vào lúc **${time}** tại **${location}**.

💡 **Một vài lưu ý nhỏ:**
- Bạn vào trước phòng họp hoặc đến trước 10 phút nhé.
- Chuẩn bị sẵn kết nối mạng ổn định và trang phục chỉn chu.

Chúc bạn có một buổi phỏng vấn thật tự tin và đạt kết quả tốt nhất nhé! 💪`;
    }
  },
  {
    id: 'REQUEST_CV_INFO',
    name: '📄 Hỏi Thăm & Xin CV Ứng Viên Mới',
    description: 'Kết nối ứng viên tiềm năng trên Zalo và xin file CV cập nhật',
    generate: (c = {}, j = {}, config = DEFAULT_PERSONAL_ZALO_CONFIG) => {
      const name = c.name || 'bạn';
      const position = j.title || 'các vị trí hấp dẫn';
      const company = j.company || config.companyName;

      return `Chào bạn ${name}, mình là ${config.recruiterName} bên ${company}.

Mình thấy hồ sơ của bạn rất tiềm năng và hiện bên mình đang có cơ hội việc làm vị trí **${position}** với mức thu nhập và chế độ đãi ngộ rất tốt.

Không biết bạn có đang quan tâm tìm kiếm cơ hội công việc mới không ạ? Nếu có, bạn có thể gửi cho mình xin bản CV cập nhật nhất qua Zalo này để mình tư vấn chi tiết hơn nhé! Cảm ơn bạn! 😊`;
    }
  },
  {
    id: 'CTV_JOB_PUSH',
    name: '🎁 Giới Thiệu Job & Bonus Hoa Hồng Cho CTV',
    description: 'Gửi riêng cho cộng tác viên hoặc nhóm Zalo để đẩy tuyển dụng',
    generate: (c = {}, j = {}, config = DEFAULT_PERSONAL_ZALO_CONFIG) => {
      const jobTitle = j.title || 'VỊ TRÍ TUYỂN DỤNG GẤP';
      const company = j.company || 'Doanh Nghiệp Đối Tác';
      const bonus = j.bonus || '1.875.000 ₫';
      const salary = j.salary || 'Lương hấp dẫn';
      const warranty = j.warrantyPeriod || '30 Ngày';
      const location = j.location || 'Hà Nội / TP.HCM';

      return `🔥 [TUYỂN GẤP - BONUS KHỦNG] **${jobTitle.toUpperCase()}**
🏢 **Công ty:** ${company}
📍 **Địa điểm:** ${location}
💰 **Mức thu nhập:** ${salary}
🎁 **HOA HỒNG CTV:** **${bonus}**
🛡️ **Bảo hành:** ${warranty}

👉 Anh/chị CTV có ứng viên phù hợp gửi ngay qua Zalo ${config.zaloPhone} (${config.recruiterName}) để nhận hoa hồng liền tay nhé! 🚀`;
    }
  },
  {
    id: 'RESULT_REJECT_GENTLE',
    name: '💌 Thông Báo Kết Quả Phỏng Vấn (Lưu Hồ Sơ)',
    description: 'Phản hồi từ chối lịch sự, giữ mối quan hệ tốt đẹp cho tương lai',
    generate: (c = {}, j = {}, config = DEFAULT_PERSONAL_ZALO_CONFIG) => {
      const name = c.name || 'bạn';
      const position = c.position || j.title || 'Vị trí ứng tuyển';
      const company = c.company || j.company || config.companyName;

      return `Chào bạn ${name},

Lời đầu tiên, ${config.recruiterName} xin cảm ơn bạn đã dành thời gian tham gia buổi phỏng vấn vị trí **${position}** tại ${company}.

Hội đồng tuyển dụng đánh giá rất cao năng lực và tinh thần của bạn. Tuy nhiên, ở giai đoạn hiện tại, tiêu chí tuyển dụng của vị trí này có một số điểm đặc thù cần ưu tiên hơn nên bên mình chưa thể đồng hành cùng bạn lần này.

Bên mình xin phép lưu lại hồ sơ của bạn và sẽ chủ động liên hệ ngay khi có cơ hội việc làm khác phù hợp hơn. Chúc bạn luôn thành công và phát triển trên con đường sự nghiệp! 🌟`;
    }
  }
];

/**
 * Loads stored Personal Zalo configuration
 * @returns {Object}
 */
export function getStoredZaloConfig() {
  try {
    const raw = localStorage.getItem(ZALO_PERSONAL_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_PERSONAL_ZALO_CONFIG;
    return { ...DEFAULT_PERSONAL_ZALO_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PERSONAL_ZALO_CONFIG;
  }
}

/**
 * Saves Personal Zalo configuration
 * @param {Object} config
 */
export function saveZaloConfig(config) {
  localStorage.setItem(ZALO_PERSONAL_CONFIG_STORAGE_KEY, JSON.stringify(config));
}

// Initial Mock Seed Messages for Personal Zalo Chat Hub
const MOCK_SEED_MESSAGES = [
  {
    id: 'msg_zalo_101',
    senderId: 'zalo_ctv_56718',
    senderName: 'Huỳnh Minh Nhựt (CTV 56718)',
    phone: '0988123456',
    groupName: 'Nhóm CTV FASTHUNT Toàn Quốc',
    eventType: 'user_send_file',
    content: 'Em gửi CV ứng viên Nguyễn Văn An ứng tuyển vị trí Sales Tư Vấn bên New Space ạ. Ứng viên có 3 năm kinh nghiệm nội thất.',
    attachmentUrl: 'https://docs.google.com/document/d/sample-cv-nguyen-van-an.docx',
    attachmentType: 'docx',
    category: 'CV_NEW',
    aiSummary: 'CV mới: Nguyễn Văn An - Vị trí Sales Tư Vấn (New Space) - Điểm match 92%',
    aiClassificationConfidence: 0.96,
    extractedCandidateId: 'cand_ai_101',
    replyContent: 'Đã nhận thông tin CV bạn An! Mình đang kiểm tra đối soát với Job New Space và xếp lịch phỏng vấn nhé.',
    status: 'PROCESSED',
    receivedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_zalo_102',
    senderId: 'zalo_client_eway',
    senderName: 'Chị Mai (HR EWAY Corporation)',
    phone: '0912345678',
    groupName: 'Nhóm Khách Hàng EWAY',
    eventType: 'user_send_text',
    content: 'Bên mình đã phỏng vấn xong ứng viên Trần Thị Bình hôm nay, kết quả PASS nhé. Thứ 2 tuần sau bạn ấy đi làm.',
    attachmentUrl: null,
    attachmentType: 'none',
    category: 'STATUS_UPDATE',
    aiSummary: 'Cập nhật trạng thái: Trần Thị Bình PASS Phỏng Vấn (EWAY) - Lịch Onboarding Thứ 2 tuần sau.',
    aiClassificationConfidence: 0.94,
    extractedCandidateId: null,
    replyContent: 'Dạ tuyệt vời quá chị Mai ơi! Em đã cập nhật trạng thái PASS Onboard trên hệ thống CRM rồi ạ.',
    status: 'PROCESSED',
    receivedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_zalo_103',
    senderId: 'zalo_ctv_47293',
    senderName: 'Lê Hoàng Long (CTV 47293)',
    phone: '0977654321',
    groupName: 'Nhóm CTV FASTHUNT Hà Nội',
    eventType: 'user_send_text',
    content: 'Anh Nhựt ơi cho em hỏi vị trí Kỹ Thuật Spa bên NEST SPA mức hoa hồng là bao nhiêu và thời gian bảo hành mấy ngày ạ?',
    attachmentUrl: null,
    attachmentType: 'none',
    category: 'SUPPORT_QUERY',
    aiSummary: 'Hỏi về hoa hồng và bảo hành: Kỹ Thuật Spa (NEST SPA)',
    aiClassificationConfidence: 0.91,
    extractedCandidateId: null,
    replyContent: 'Vị trí Kỹ Thuật Spa tại NEST SPA có mức Bonus CTV là 1.875.000 ₫, bảo hành 35 ngày em nhé!',
    status: 'REPLIED',
    receivedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString()
  }
];

/**
 * Loads stored Zalo messages
 * @returns {Array}
 */
export function getStoredZaloMessages() {
  try {
    const raw = localStorage.getItem(ZALO_MESSAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ZALO_MESSAGES_STORAGE_KEY, JSON.stringify(MOCK_SEED_MESSAGES));
      return MOCK_SEED_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_SEED_MESSAGES;
  }
}

/**
 * Stores updated Zalo messages list
 * @param {Array} messages
 */
export function saveZaloMessages(messages) {
  localStorage.setItem(ZALO_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
}

// Initial Mock Seed Broadcast Queue Items
const MOCK_SEED_BROADCAST_QUEUE = [
  {
    id: 'bcast_001',
    jobId: 'job_1',
    jobTitle: 'SALES TƯ VẤN DỊCH VỤ TK THI CÔNG KIẾN TRÚC NỘI THẤT',
    company: 'New Space',
    targetType: 'ALL_CTV',
    targetGroupName: 'Nhóm Tuyển Dụng & CTV FastHunt Toàn Quốc (Zalo Cá Nhân)',
    draftTitle: '🔥 ĐẨY JOB TUYỂN GẤP - SALES TƯ VẤN NỘI THẤT (NEW SPACE)',
    draftContent: `🔥 [TUYỂN GẤP - BONUS KHỦNG] **SALES TƯ VẤN THIẾT KẾ NỘI THẤT**
🏢 **Công ty đối tác:** New Space
📍 **Khu vực:** Hà Nội
💰 **Thu nhập:** 12 - 25 Triệu / Tháng (Lương cứng + Hoa hồng dự án)
🎁 **HOA HỒNG (BONUS) CHO CTV:** **1.875.000 ₫**
🛡️ **Thời gian bảo hành:** 35 Ngày

👉 Anh/chị CTV có ứng viên gửi ngay cho mình qua Zalo này để duyệt hồ sơ và nhận thưởng liền tay nhé! 🚀`,
    bonusHighlight: '1.875.000 ₫',
    status: 'PENDING_APPROVAL',
    aiGenerated: true,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    reviewedBy: null,
    reviewedAt: null,
    sentAt: null,
    recipientsCount: 450
  },
  {
    id: 'bcast_002',
    jobId: 'job_6',
    jobTitle: 'TRƯỞNG PHÒNG MARKETING',
    company: 'EWAY',
    targetType: 'ALL_CTV',
    targetGroupName: 'Nhóm CTV FASTHUNT HN & HCM',
    draftTitle: '⭐ JOB VIP HOA HỒNG CAO - TRƯỞNG PHÒNG MARKETING (EWAY)',
    draftContent: `⭐ [JOB MỚI] **TRƯỞNG PHÒNG MARKETING**
🏢 **Công ty đối tác:** EWAY Corporation
📍 **Khu vực:** Hà Nội
💰 **Thu nhập:** 25 - 40 Triệu / Tháng
🎁 **HOA HỒNG CHO CTV:** **5.250.000 ₫ (CỰC HẤP DẪN)**
🛡️ **Thời gian bảo hành:** 60 Ngày

👉 Vị trí cấp quản lý, cơ hội nhận hoa hồng khủng. Xem JD chi tiết và nộp CV ngay qua Zalo!`,
    bonusHighlight: '5.250.000 ₫',
    status: 'SENT',
    aiGenerated: true,
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    reviewedBy: 'Huỳnh Minh Nhựt (HR)',
    reviewedAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 145 * 60 * 1000).toISOString(),
    recipientsCount: 450
  }
];

/**
 * Loads the CTV Broadcast Push Queue
 * @returns {Array}
 */
export function getStoredBroadcastQueue() {
  try {
    const raw = localStorage.getItem(ZALO_BROADCAST_QUEUE_KEY);
    if (!raw) {
      localStorage.setItem(ZALO_BROADCAST_QUEUE_KEY, JSON.stringify(MOCK_SEED_BROADCAST_QUEUE));
      return MOCK_SEED_BROADCAST_QUEUE;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_SEED_BROADCAST_QUEUE;
  }
}

/**
 * Saves the CTV Broadcast Push Queue
 * @param {Array} queue
 */
export function saveBroadcastQueue(queue) {
  localStorage.setItem(ZALO_BROADCAST_QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Normalizes phone number for Zalo direct chat link (https://zalo.me/...)
 * @param {string} phone
 * @returns {string}
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+84')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('84') && cleaned.length >= 10) {
    cleaned = '0' + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * 1-Click: Copies message to clipboard and opens direct Personal Zalo Chat (https://zalo.me/{phone})
 * @param {string} phone
 * @param {string} [messageText='']
 */
export function openPersonalZaloChat(phone, messageText = '') {
  const cleaned = cleanPhoneNumber(phone);
  if (messageText && navigator.clipboard) {
    navigator.clipboard.writeText(messageText).catch(() => {});
  }
  if (cleaned) {
    window.open(`https://zalo.me/${cleaned}`, '_blank');
  } else {
    window.open('https://chat.zalo.me', '_blank');
  }
}

/**
 * 1-Click: Copies message and opens CTV Zalo Group
 * @param {string} groupUrl
 * @param {string} [messageText='']
 */
export function openZaloGroup(groupUrl, messageText = '') {
  if (messageText && navigator.clipboard) {
    navigator.clipboard.writeText(messageText).catch(() => {});
  }
  const url = groupUrl || 'https://chat.zalo.me';
  window.open(url, '_blank');
}

/**
 * Simulates receiving or ingesting a chat message from Personal Zalo
 * @param {Object} eventPayload
 * @param {Array} jobs
 * @returns {Promise<Object>}
 */
export async function processZaloWebhookEvent(eventPayload, jobs = []) {
  const currentMessages = getStoredZaloMessages();
  const content = eventPayload.content || '';
  const attachmentType = eventPayload.attachmentType || 'none';

  const classification = classifyZaloMessage(content, attachmentType);
  let aiSummary = classification.summary;
  let replyContent = '';
  let candidateData = null;

  if (classification.category === 'CV_NEW') {
    try {
      const matchResult = await analyzeAndMatchCv(content, jobs);
      candidateData = matchResult;
      aiSummary = `CV Mới: ${matchResult.candidate.name} - Match ${matchResult.matchScore}% với "${matchResult.matchedJob?.title || 'Vị trí phù hợp'}" (${matchResult.matchedJob?.company || ''})`;
      replyContent = `FASTHUNT AI: Đã nhận CV của ứng viên ${matchResult.candidate.name}. Điểm tương thích với vị trí ${matchResult.matchedJob?.title || ''} là ${matchResult.matchScore}%. Hồ sơ đã được lưu vào hệ thống!`;
    } catch (err) {
      console.warn('AI Matching fallback', err);
      replyContent = 'FASTHUNT AI: Đã tiếp nhận tệp CV của bạn và chuyển tới Recruiter xử lý.';
    }
  } else if (classification.category === 'SUPPORT_QUERY') {
    replyContent = generateZaloAutoReply(content, jobs);
  } else {
    replyContent = `FASTHUNT AI: Đã ghi nhận thông tin trao đổi từ ${eventPayload.senderName || 'bạn'}. Cảm ơn bạn!`;
  }

  const newMessage = {
    id: `msg_zalo_${Date.now()}`,
    senderId: eventPayload.senderId || `user_${Date.now()}`,
    senderName: eventPayload.senderName || 'Ứng viên Zalo',
    phone: eventPayload.phone || '0988123456',
    groupName: eventPayload.groupName || 'Zalo Cá Nhân',
    eventType: eventPayload.eventType || (attachmentType !== 'none' ? 'user_send_file' : 'user_send_text'),
    content,
    attachmentUrl: eventPayload.attachmentUrl || null,
    attachmentType,
    category: classification.category,
    aiSummary,
    aiClassificationConfidence: classification.confidence,
    extractedCandidateId: candidateData ? `cand_${Date.now()}` : null,
    replyContent,
    status: 'PROCESSED',
    receivedAt: new Date().toISOString()
  };

  const updatedMessages = [newMessage, ...currentMessages];
  saveZaloMessages(updatedMessages);
  return { message: newMessage, candidateData };
}

/**
 * Creates an AI-drafted Job Push item for Personal Zalo / CTV Group
 * @param {Object} job
 * @param {string} [targetType='ALL_CTV']
 * @returns {Object}
 */
export function createJobBroadcastDraft(job, targetType = 'ALL_CTV') {
  if (!job) throw new Error('Vui lòng chọn công việc để tạo tin đẩy.');

  const queue = getStoredBroadcastQueue();
  const draftContent = generateZaloJobBroadcastPitch(job, targetType);

  const newDraft = {
    id: `bcast_${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    targetType,
    targetGroupName: targetType === 'ALL_CTV' ? 'Nhóm Tuyển Dụng & CTV FastHunt Toàn Quốc' : 'Nhóm CTV ' + (job.location || 'Toàn quốc'),
    draftTitle: `🔥 [ĐẨY JOB ZALO] ${job.title.toUpperCase()} (${job.company})`,
    draftContent,
    bonusHighlight: job.bonus || '1.875.000 ₫',
    status: 'PENDING_APPROVAL',
    aiGenerated: true,
    createdAt: new Date().toISOString(),
    reviewedBy: null,
    reviewedAt: null,
    sentAt: null,
    recipientsCount: targetType === 'ALL_CTV' ? 450 : 120
  };

  const updatedQueue = [newDraft, ...queue];
  saveBroadcastQueue(updatedQueue);
  return newDraft;
}

/**
 * Recruiter Approves and marks Broadcast sent
 * @param {string} draftId
 * @param {string} [reviewerName='Huỳnh Minh Nhựt (HR)']
 * @returns {Object}
 */
export function approveAndSendBroadcast(draftId, reviewerName = 'Huỳnh Minh Nhựt (HR)') {
  const queue = getStoredBroadcastQueue();
  const item = queue.find(q => q.id === draftId);
  if (!item) throw new Error('Không tìm thấy bản tin cần phê duyệt.');

  item.status = 'SENT';
  item.reviewedBy = reviewerName;
  item.reviewedAt = new Date().toISOString();
  item.sentAt = new Date().toISOString();

  saveBroadcastQueue(queue);
  return item;
}

/**
 * Recruiter Rejects a Broadcast draft
 * @param {string} draftId
 * @param {string} [reason='Nội dung chưa phù hợp']
 * @returns {Object}
 */
export function rejectBroadcast(draftId, reason = 'Nội dung chưa phù hợp') {
  const queue = getStoredBroadcastQueue();
  const item = queue.find(q => q.id === draftId);
  if (!item) throw new Error('Không tìm thấy bản tin.');

  item.status = 'REJECTED';
  item.rejectionReason = reason;
  item.reviewedAt = new Date().toISOString();

  saveBroadcastQueue(queue);
  return item;
}

/**
 * Updates a broadcast draft content
 * @param {string} draftId
 * @param {string} newTitle
 * @param {string} newContent
 * @returns {Object}
 */
export function updateBroadcastDraft(draftId, newTitle, newContent) {
  const queue = getStoredBroadcastQueue();
  const item = queue.find(q => q.id === draftId);
  if (!item) throw new Error('Không tìm thấy bản tin.');

  if (newTitle) item.draftTitle = newTitle;
  if (newContent) item.draftContent = newContent;

  saveBroadcastQueue(queue);
  return item;
}
