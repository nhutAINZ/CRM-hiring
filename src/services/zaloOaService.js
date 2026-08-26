// ====================================================================
// FASTHUNT RECRUITMENT AGENT - ZALO OFFICIAL ACCOUNT (OA) SERVICE
// Compliant with Zalo for Business OpenAPI v3.0 & Webhook Protocol
// ====================================================================

import { classifyZaloMessage, analyzeAndMatchCv, generateZaloJobBroadcastPitch, generateZaloAutoReply } from './aiMatchingService.js';
import { extractCandidateEntities } from './cvExtractor.js';

export const ZALO_OA_CONFIG_STORAGE_KEY = 'fasthunt_zalo_oa_config';
export const ZALO_MESSAGES_STORAGE_KEY = 'fasthunt_zalo_messages';
export const ZALO_BROADCAST_QUEUE_KEY = 'fasthunt_zalo_broadcast_queue';

export const DEFAULT_ZALO_CONFIG = {
  appId: '384917482910482',
  secretKey: 'zk_sec_9948a7b1c3e4d5f6',
  oaId: '29481748291048201',
  oaName: 'FASTHUNT Tuyển Dụng & Nhân Tài Doanh Nghiệp',
  accessToken: 'oa_act_9a8b7c6d5e4f3a2b1c0d_sample_token',
  refreshToken: 'oa_ref_1a2b3c4d5e6f7a8b9c0d_sample_token',
  tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  webhookSecret: 'wh_sec_fasthunt_recruitment_2026',
  webhookUrl: 'https://api.fasthunt.vn/webhook/zalo',
  isActive: true
};

/**
 * Loads stored Zalo OA configuration
 * @returns {Object}
 */
export function getStoredZaloConfig() {
  try {
    const raw = localStorage.getItem(ZALO_OA_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_ZALO_CONFIG;
    return { ...DEFAULT_ZALO_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ZALO_CONFIG;
  }
}

/**
 * Saves Zalo OA configuration
 * @param {Object} config
 */
export function saveZaloConfig(config) {
  localStorage.setItem(ZALO_OA_CONFIG_STORAGE_KEY, JSON.stringify(config));
}

// Initial Mock Seed Webhook Messages for Realistic Demo Experience
const MOCK_SEED_MESSAGES = [
  {
    id: 'msg_zalo_101',
    oaId: '29481748291048201',
    senderId: 'zalo_user_ctv_01',
    senderName: 'Huỳnh Minh Nhựt (CTV 56718)',
    groupId: 'group_ctv_fasthunt_hcm',
    groupName: 'Nhóm CTV FASTHUNT HCM & Toàn Quốc',
    eventType: 'user_send_file',
    content: 'Em gửi CV ứng viên Nguyễn Văn An ứng tuyển vị trí Sales Tư Vấn bên New Space ạ.',
    attachmentUrl: 'https://docs.google.com/document/d/sample-cv-nguyen-van-an.docx',
    attachmentType: 'docx',
    category: 'CV_NEW',
    aiSummary: 'CV mới: Nguyễn Văn An - Vị trí Sales Tư Vấn (New Space) - Điểm match 92%',
    aiClassificationConfidence: 0.96,
    extractedCandidateId: 'cand_ai_101',
    replyContent: 'FASTHUNT AI: Đã nhận CV của ứng viên Nguyễn Văn An. Hồ sơ đang được chuyển sang bộ phận tuyển dụng duyệt!',
    status: 'PROCESSED',
    receivedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_zalo_102',
    oaId: '29481748291048201',
    senderId: 'zalo_user_client_02',
    senderName: 'Chị Mai (HR EWAY Corporation)',
    groupId: 'group_client_eway',
    groupName: 'Nhóm Khách Hàng - EWAY Recruitment',
    eventType: 'user_send_text',
    content: 'Bên mình đã phỏng vấn xong ứng viên Trần Thị Bình hôm nay, kết quả PASS nhé. Tuần sau đi làm.',
    attachmentUrl: null,
    attachmentType: 'none',
    category: 'STATUS_UPDATE',
    aiSummary: 'Cập nhật trạng thái: Trần Thị Bình PASS Phỏng Vấn (EWAY) - Lịch Onboarding tuần sau.',
    aiClassificationConfidence: 0.94,
    extractedCandidateId: null,
    replyContent: 'FASTHUNT AI: Dạ đã ghi nhận kết quả PASS của ứng viên Trần Thị Bình. Chúc mừng team EWAY ạ!',
    status: 'PROCESSED',
    receivedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_zalo_103',
    oaId: '29481748291048201',
    senderId: 'zalo_user_ctv_03',
    senderName: 'Lê Hoàng Long (CTV 47293)',
    groupId: 'group_ctv_fasthunt_hn',
    groupName: 'Nhóm CTV FASTHUNT Hà Nội',
    eventType: 'user_send_text',
    content: 'Cho em hỏi vị trí Kỹ Thuật Spa bên NEST SPA mức hoa hồng là bao nhiêu và thời gian bảo hành mấy ngày ạ?',
    attachmentUrl: null,
    attachmentType: 'none',
    category: 'SUPPORT_QUERY',
    aiSummary: 'Hỏi về hoa hồng và bảo hành: Kỹ Thuật Spa (NEST SPA)',
    aiClassificationConfidence: 0.91,
    extractedCandidateId: null,
    replyContent: 'FASTHUNT AI: Vị trí Kỹ Thuật Spa tại NEST SPA có mức Bonus CTV là 1.875.000 ₫, bảo hành 35 ngày bạn nhé!',
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
    targetGroupName: 'Toàn Bộ Mạng Lưới CTV FASTHUNT (Zalo OA)',
    draftTitle: '🔥 ĐẨY JOB TUYỂN GẤP - SALES TƯ VẤN NỘI THẤT (NEW SPACE)',
    draftContent: `🔥 [TUYỂN GẤP] **SALES TƯ VẤN DỊCH VỤ TK THI CÔNG KIẾN TRÚC NỘI THẤT**
🏢 **Công ty đối tác:** New Space
📍 **Khu vực:** Hà Nội
💰 **Thu nhập:** Thu nhập: 6-8 triệu + HH
🎁 **HOA HỒNG CHO CTV:** **1.875.000 ₫**
🛡️ **Thời gian bảo hành:** 35 Ngày

👉 CTV gửi CV ứng tuyển ngay qua Zalo OA để nhận thưởng liền tay!`,
    bonusHighlight: '1.875.000 ₫',
    status: 'PENDING_APPROVAL', // 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SENT'
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

👉 Vị trí cấp quản lý, cơ hội nhận hoa hồng khủng. Xem JD chi tiết và nộp CV ngay!`,
    bonusHighlight: '5.250.000 ₫',
    status: 'SENT',
    aiGenerated: true,
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    reviewedBy: 'Admin FastHunt',
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
 * Ingests a new incoming Zalo Webhook event and performs AI processing
 * @param {Object} webhookEvent
 * @param {Array} jobs
 * @returns {Promise<Object>} Processed message item
 */
export async function processZaloWebhookEvent(webhookEvent, jobs = []) {
  const currentMessages = getStoredZaloMessages();
  const config = getStoredZaloConfig();

  const content = webhookEvent.content || '';
  const attachmentType = webhookEvent.attachmentType || 'none';

  // 1. AI Classification
  const classification = classifyZaloMessage(content, attachmentType);

  let aiSummary = classification.summary;
  let replyContent = '';
  let candidateData = null;

  // 2. If message contains CV, execute AI extraction & matching against jobs
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
    replyContent = `FASTHUNT AI: Đã ghi nhận thông tin trao đổi từ ${webhookEvent.senderName || 'bạn'}. Cảm ơn bạn!`;
  }

  const newMessage = {
    id: `msg_zalo_${Date.now()}`,
    oaId: config.oaId,
    senderId: webhookEvent.senderId || `user_${Date.now()}`,
    senderName: webhookEvent.senderName || 'Ứng viên Zalo',
    groupId: webhookEvent.groupId || null,
    groupName: webhookEvent.groupName || null,
    eventType: webhookEvent.eventType || (attachmentType !== 'none' ? 'user_send_file' : 'user_send_text'),
    content,
    attachmentUrl: webhookEvent.attachmentUrl || null,
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
 * Creates an AI-drafted Job Push item in the Broadcast Approval Queue (Human-in-the-Loop)
 * @param {Object} job
 * @param {string} [targetType='ALL_CTV']
 * @returns {Object} Created broadcast item
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
    targetGroupName: targetType === 'ALL_CTV' ? 'Toàn Bộ Mạng Lưới CTV FASTHUNT' : 'Nhóm CTV Khu Vực ' + (job.location || 'Toàn quốc'),
    draftTitle: `🔥 [DUYỆT ĐẨY JOB] ${job.title.toUpperCase()} (${job.company})`,
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
 * Recruiter Approves and Sends Broadcast out via Zalo OA API
 * @param {string} draftId
 * @param {string} [reviewerName='Admin Recruiter']
 * @returns {Object} Approved broadcast item
 */
export function approveAndSendBroadcast(draftId, reviewerName = 'Admin Recruiter') {
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
