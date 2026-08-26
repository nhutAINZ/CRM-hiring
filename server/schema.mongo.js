// ====================================================================
// FASTHUNT RECRUITMENT AGENT - MONGOOSE (MONGODB) SCHEMAS
// Module: Zalo AI Assistant & Candidate / Job Management
// ====================================================================

import mongoose from 'mongoose';

const { Schema } = mongoose;

// 1. Zalo OA Config Schema
export const ZaloOaConfigSchema = new Schema({
  appId: { type: String, required: true },
  secretKey: { type: String, required: true },
  oaId: { type: String, required: true },
  oaName: { type: String, default: 'FASTHUNT Tuyển Dụng' },
  accessToken: { type: String },
  refreshToken: { type: String },
  tokenExpiresAt: { type: Date },
  webhookSecret: { type: String },
  webhookUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// 2. Message Schema (Webhook & Ingested Chats)
export const MessageSchema = new Schema({
  oaId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  groupId: { type: String, default: null },
  groupName: { type: String, default: null },
  eventType: {
    type: String,
    enum: ['user_send_text', 'user_send_file', 'user_send_image', 'oa_send_text', 'user_received_message'],
    required: true
  },
  content: { type: String, default: '' },
  attachmentUrl: { type: String },
  attachmentType: { type: String, enum: ['pdf', 'docx', 'image', 'none'], default: 'none' },
  category: {
    type: String,
    enum: ['CV_NEW', 'SUPPORT_QUERY', 'STATUS_UPDATE', 'OTHER'],
    default: 'OTHER'
  },
  aiSummary: { type: String },
  aiClassificationConfidence: { type: Number, default: 0.0 },
  extractedCandidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', default: null },
  replyContent: { type: String },
  status: {
    type: String,
    enum: ['RECEIVED', 'PROCESSING', 'PROCESSED', 'REPLIED', 'FAILED'],
    default: 'PROCESSED'
  },
  receivedAt: { type: Date, default: Date.now }
}, { timestamps: true });

MessageSchema.index({ category: 1, receivedAt: -1 });
MessageSchema.index({ groupId: 1 });

// 3. Job Opening Schema
export const JobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  industry: { type: String, required: true },
  salary: { type: String },
  headcount: { type: Number, default: 1 },
  warrantyPeriod: { type: String },
  bonus: { type: String },
  requirements: { type: String },
  jdFile: { type: String },
  status: {
    type: String,
    enum: ['TUYỂN GẤP', 'MỚI', 'TUYỂN LẠI', 'BỊ TẠM NGƯNG', 'ĐÃ HOÀN THÀNH'],
    default: 'MỚI'
  },
  sheetRowIndex: { type: Number },
  sheetRowUrl: { type: String }
}, { timestamps: true });

// 4. Candidate Schema
export const CandidateSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  desiredSalary: { type: String },
  startTime: { type: String },
  ctvCode: { type: String },
  positionCompany: { type: String },
  matchedJobId: { type: Schema.Types.ObjectId, ref: 'Job', default: null },
  matchScore: { type: Number, min: 0, max: 100, default: 0 },
  skills: [{ type: String }],
  experienceYears: { type: Number, default: 0.0 },
  education: { type: String },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  aiEvaluation: { type: String },
  suggestedAlternativeJobs: [{ type: String }],
  cvUrl: { type: String },
  sourceMessageId: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
  stage: {
    type: String,
    enum: ['applied', 'cv_pass', 'interviewing', 'onboarded', 'rejected'],
    default: 'applied'
  }
}, { timestamps: true });

CandidateSchema.index({ matchedJobId: 1, matchScore: -1 });

// 5. CTV Broadcast Push Queue Schema (Human-in-the-Loop)
export const CtvBroadcastSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  targetType: {
    type: String,
    enum: ['ALL_CTV', 'ACTIVE_CTV', 'CUSTOM_GROUP', 'ZALO_OA_BROADCAST'],
    default: 'ALL_CTV'
  },
  targetGroupId: { type: String },
  draftTitle: { type: String, required: true },
  draftContent: { type: String, required: true },
  aiGenerated: { type: Boolean, default: true },
  bonusHighlight: { type: String },
  status: {
    type: String,
    enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SENT', 'FAILED'],
    default: 'PENDING_APPROVAL'
  },
  reviewedBy: { type: String },
  reviewedAt: { type: Date },
  rejectionReason: { type: String },
  sentAt: { type: Date },
  recipientsCount: { type: Number, default: 0 },
  zaloMsgId: { type: String }
}, { timestamps: true });

CtvBroadcastSchema.index({ status: 1, createdAt: -1 });

export const ZaloOaConfig = mongoose.models.ZaloOaConfig || mongoose.model('ZaloOaConfig', ZaloOaConfigSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
export const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
export const CtvBroadcast = mongoose.models.CtvBroadcast || mongoose.model('CtvBroadcast', CtvBroadcastSchema);
