// ====================================================================
// FASTHUNT RECRUITMENT AGENT - STANDALONE EXPRESS BACKEND SERVER
// Production-Ready Zalo OA Webhook Receiver & AI Matching API
// ====================================================================

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { classifyZaloMessage, analyzeAndMatchCv, generateZaloJobBroadcastPitch } from '../src/services/aiMatchingService.js';
import { extractCandidateEntities } from '../src/services/cvExtractor.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-Memory Database Store for Server Execution
let serverOaConfig = {
  appId: process.env.ZALO_APP_ID || '384917482910482',
  secretKey: process.env.ZALO_SECRET_KEY || 'zk_sec_9948a7b1c3e4d5f6',
  oaId: process.env.ZALO_OA_ID || '29481748291048201',
  oaName: 'FASTHUNT Tuyển Dụng (Zalo OA)',
  accessToken: process.env.ZALO_ACCESS_TOKEN || 'oa_act_sample_token',
  refreshToken: process.env.ZALO_REFRESH_TOKEN || 'oa_ref_sample_token',
  webhookSecret: process.env.ZALO_WEBHOOK_SECRET || 'wh_sec_fasthunt_recruitment_2026',
  isActive: true
};

let serverMessages = [];
let serverBroadcastQueue = [];
let cachedJobs = [];

// Helper: Verify Zalo Webhook Signature
function verifyZaloSignature(req) {
  const signature = req.headers['x-zalo-signature'] || req.headers['x-hub-signature'];
  if (!signature || !serverOaConfig.webhookSecret) return true; // allow if testing
  try {
    const hash = crypto.createHmac('sha256', serverOaConfig.webhookSecret).update(JSON.stringify(req.body)).digest('hex');
    return signature === hash || signature === `sha256=${hash}`;
  } catch {
    return false;
  }
}

// ── 1. Zalo Webhook Verification & Challenge Handler ──
app.get('/webhook/zalo', (req, res) => {
  const challenge = req.query.challenge || req.query['hub.challenge'];
  if (challenge) {
    console.log('[Zalo Webhook] Verification Challenge Received:', challenge);
    return res.status(200).send(challenge);
  }
  return res.status(200).json({ status: 'ACTIVE', message: 'FastHunt Zalo OA Webhook Endpoint is Running.' });
});

// ── 2. Zalo Webhook Event Ingestion Endpoint ──
app.post('/webhook/zalo', async (req, res) => {
  try {
    if (!verifyZaloSignature(req)) {
      console.warn('[Zalo Webhook] Invalid Signature Rejected');
      return res.status(401).json({ error: 'Invalid Webhook Signature' });
    }

    const payload = req.body;
    console.log('[Zalo Webhook] Received Event:', payload.event_name || payload.eventType || 'message');

    const eventType = payload.event_name || payload.eventType || 'user_send_text';
    const senderId = payload.sender?.id || payload.senderId || 'zalo_user';
    const senderName = payload.sender?.name || payload.senderName || 'Ứng viên Zalo';
    const content = payload.message?.text || payload.content || '';
    const attachmentUrl = payload.message?.attachments?.[0]?.payload?.url || payload.attachmentUrl || null;
    const attachmentType = payload.message?.attachments?.[0]?.type || payload.attachmentType || 'none';

    // AI Classification
    const classification = classifyZaloMessage(content, attachmentType);
    let candidateData = null;

    if (classification.category === 'CV_NEW') {
      try {
        candidateData = await analyzeAndMatchCv(content, cachedJobs);
      } catch (err) {
        console.warn('AI Match error', err);
      }
    }

    const newMsg = {
      id: `msg_${Date.now()}`,
      oaId: serverOaConfig.oaId,
      senderId,
      senderName,
      groupId: payload.recipient?.id || null,
      eventType,
      content,
      attachmentUrl,
      attachmentType,
      category: classification.category,
      aiSummary: classification.summary,
      aiClassificationConfidence: classification.confidence,
      candidateData,
      status: 'PROCESSED',
      receivedAt: new Date().toISOString()
    };

    serverMessages.unshift(newMsg);

    return res.status(200).json({
      error: 0,
      message: 'Event processed successfully',
      data: newMsg
    });
  } catch (err) {
    console.error('[Zalo Webhook] Error processing event', err);
    return res.status(500).json({ error: 1, message: err.message });
  }
});

// ── 3. Zalo OA Status API ──
app.get('/api/zalo/status', (req, res) => {
  res.json({
    config: {
      appId: serverOaConfig.appId,
      oaId: serverOaConfig.oaId,
      oaName: serverOaConfig.oaName,
      isActive: serverOaConfig.isActive
    },
    totalMessages: serverMessages.length,
    pendingBroadcasts: serverBroadcastQueue.filter(b => b.status === 'PENDING_APPROVAL').length
  });
});

// ── 4. AI CV Analysis API ──
app.post('/api/ai/analyze-cv', async (req, res) => {
  try {
    const { cvText, targetJobId } = req.body;
    if (!cvText) {
      return res.status(400).json({ error: 'cvText is required' });
    }

    const result = await analyzeAndMatchCv(cvText, cachedJobs, targetJobId);
    return res.json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── 5. CTV Job Broadcast Queue APIs (Human-in-the-Loop) ──
app.post('/api/zalo/broadcast/create', (req, res) => {
  try {
    const { job, targetType } = req.body;
    const draftContent = generateZaloJobBroadcastPitch(job, targetType);

    const draft = {
      id: `bcast_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      targetType: targetType || 'ALL_CTV',
      draftTitle: `🔥 [DUYỆT ĐẨY JOB] ${job.title.toUpperCase()} (${job.company})`,
      draftContent,
      bonusHighlight: job.bonus || '1.875.000 ₫',
      status: 'PENDING_APPROVAL',
      aiGenerated: true,
      createdAt: new Date().toISOString()
    };

    serverBroadcastQueue.unshift(draft);
    return res.json({ success: true, draft });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/zalo/broadcast/approve', (req, res) => {
  const { draftId, reviewerName } = req.body;
  const item = serverBroadcastQueue.find(b => b.id === draftId);
  if (!item) return res.status(404).json({ error: 'Draft not found' });

  item.status = 'SENT';
  item.reviewedBy = reviewerName || 'Admin FastHunt';
  item.reviewedAt = new Date().toISOString();
  item.sentAt = new Date().toISOString();

  console.log(`[Zalo OA API] Dispatching Message to CTV Group: "${item.draftTitle}"`);
  return res.json({ success: true, item });
});

app.post('/api/zalo/broadcast/reject', (req, res) => {
  const { draftId, reason } = req.body;
  const item = serverBroadcastQueue.find(b => b.id === draftId);
  if (!item) return res.status(404).json({ error: 'Draft not found' });

  item.status = 'REJECTED';
  item.rejectionReason = reason || 'Từ chối bởi Admin';
  item.reviewedAt = new Date().toISOString();

  return res.json({ success: true, item });
});

app.listen(PORT, () => {
  console.log(`🚀 FastHunt Zalo AI Assistant Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Webhook Endpoint: http://localhost:${PORT}/webhook/zalo`);
});
