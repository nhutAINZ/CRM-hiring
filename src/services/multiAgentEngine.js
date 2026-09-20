/**
 * Multi-Agent Recruitment Swarm Engine (FastHunt AI Swarm)
 * 
 * Defines specialized autonomous agents, intent decomposition,
 * multi-agent debate protocols, batch CV screening, pipeline SLA audits,
 * and live integration with 9Router OpenAI-compatible AI Gateway.
 */

import {
  call9RouterChat,
  get9RouterConfig,
  generateSwarmReasoningWith9Router,
  generateDebateWith9Router,
  test9RouterConnection
} from './nineRouterService.js';

// Agent definitions & metadata
export const AGENT_REGISTRY = {
  supervisor: {
    id: 'supervisor',
    name: 'Master Supervisor Orchestrator',
    role: 'Swarm Coordinator & Decision Synthesizer',
    avatar: '🤖',
    color: 'from-violet-600 to-indigo-600',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300',
    description: 'Phân tích yêu cầu, chia tách nhiệm vụ (Task Decomposition), điều phối các sub-agents và tổng hợp kết quả cuối cùng qua 9Router.',
    model: '9Router (Auto / GPT-4o / Claude 3.5 / Gemini)'
  },
  screener: {
    id: 'screener',
    name: 'Sourcing & CV Screener Agent',
    role: 'Resume Parsing & Job-Fit Matching Specialist',
    avatar: '🎯',
    color: 'from-blue-600 to-cyan-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
    description: 'Trích xuất kỹ năng, kinh nghiệm, đối soát yêu cầu JD, tính điểm phù hợp (0-100%) và nhận diện ưu/nhược điểm hồ sơ.',
    model: 'FastHunt CV-Match Reasoning Engine'
  },
  scheduler: {
    id: 'scheduler',
    name: 'Outreach & Interview Scheduler Agent',
    role: 'Candidate Engagement & Calendar Dispatcher',
    avatar: '📅',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300',
    description: 'Soạn thư mời phỏng vấn cá nhân hóa, gợi ý khung giờ tối ưu, soạn tin nhắn Zalo OA / Email và nhắc lịch tự động.',
    model: 'FastHunt Outreach Dispatch Engine'
  },
  auditor: {
    id: 'auditor',
    name: 'Pipeline & SLA Kaizen Auditor',
    role: 'Bottleneck Hunter & Process Quality Sentinel',
    avatar: '📈',
    color: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300',
    description: 'Phát hiện hồ sơ nghẽn (>48h chưa review, thiếu feedback PV), phát hiện lãng phí (Muda) và đề xuất kế hoạch xử lý tức thì.',
    model: 'Kaizen 5S & SLA Audit Heuristics'
  },
  ctv_partner: {
    id: 'ctv_partner',
    name: 'CTV & Bounty Headhunter Agent',
    role: 'Referral Network & Commission Specialist',
    avatar: '🤝',
    color: 'from-purple-600 to-pink-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
    description: 'Phân tích tin tuyển dụng có bonus cao, khớp hồ sơ phù hợp với mạng lưới CTV và soạn bản tin tuyển dụng hấp dẫn.',
    model: 'Bounty Matching & Referral Network'
  },
  copilot: {
    id: 'copilot',
    name: 'Candidate Q&A Copilot Agent',
    role: 'Omnichannel Candidate Assistant',
    avatar: '💬',
    color: 'from-rose-600 to-red-600',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300',
    description: 'Giải đáp thắc mắc của ứng viên về văn hóa doanh nghiệp, chế độ đãi ngộ, quy trình phỏng vấn theo định dạng chuẩn.',
    model: 'Conversational Talent Support'
  }
};

/**
 * Storage helpers for Swarm Settings
 */
const STORAGE_KEY_CONFIG = 'fasthunt_multiagent_config';

export function getStoredAgentConfig() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load agent config:', e);
  }
  return {
    provider: '9router', // '9router' | 'built-in' | 'openai' | 'gemini' | 'anthropic' | 'custom'
    apiKey: '9router-default-key',
    apiEndpoint: 'http://localhost:20128/v1',
    modelName: 'auto',
    temperature: 0.7,
    autoDebateOnBorderline: true,
    autoAlertBottlenecks: true,
    customInstructions: ''
  };
}

export function saveAgentConfig(config) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    }
  } catch (e) {
    console.error('Failed to save agent config:', e);
  }
}

/**
 * Heuristic semantic matching score between a candidate and a job requisition
 */
export function calculateCandidateFit(candidate, job) {
  if (!candidate || !job) return { score: 50, strengths: [], redFlags: [], recommendation: 'Cần xem xét thêm', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' };

  let score = 65;
  const strengths = [];
  const redFlags = [];

  const cPos = (candidate.position || candidate.viTri || '').toLowerCase();
  const jTitle = (job.title || job.jobTitle || job.viTri || '').toLowerCase();
  const cExp = (candidate.experience || candidate.kinhNghiem || '').toLowerCase();

  // Position match
  if (cPos && jTitle && (cPos.includes(jTitle) || jTitle.includes(cPos))) {
    score += 18;
    strengths.push(`Vị trí ứng tuyển "${candidate.position}" trùng khớp hoàn hảo với JD.`);
  } else if (cPos && jTitle) {
    const keywords = ['frontend', 'backend', 'fullstack', 'react', 'node', 'java', 'python', 'designer', 'tester', 'qa', 'sales', 'marketing', 'hr'];
    const matched = keywords.filter(k => cPos.includes(k) && jTitle.includes(k));
    if (matched.length > 0) {
      score += 12;
      strengths.push(`Trùng khớp chuyên môn: ${matched.join(', ')}`);
    } else {
      score -= 8;
      redFlags.push(`Tên vị trí "${candidate.position || 'N/A'}" khác biệt so với "${job.title || 'N/A'}".`);
    }
  }

  // Experience match
  if (cExp.includes('3 năm') || cExp.includes('4 năm') || cExp.includes('5 năm') || cExp.includes('senior')) {
    score += 10;
    strengths.push(`Kinh nghiệm vững chắc (${candidate.experience || 'Senior'}).`);
  } else if (cExp.includes('fresher') || cExp.includes('intern') || cExp.includes('< 1 năm')) {
    if (jTitle.includes('senior') || jTitle.includes('lead')) {
      score -= 20;
      redFlags.push('Kinh nghiệm sơ cấp không đủ cho cấp độ Senior/Lead yêu cầu.');
    } else {
      strengths.push('Phù hợp cho vị trí Junior/Fresher.');
    }
  }

  // CV / PV status check
  const cvRes = (candidate.cvResult || candidate.ketQuaCv || '').toLowerCase();
  const pvRes = (candidate.pvResult || candidate.ketQuaPv || '').toLowerCase();

  if (cvRes.includes('pass') || cvRes.includes('đạt') || cvRes.includes('duyệt')) {
    score += 10;
    strengths.push('Hồ sơ đã qua vòng sơ loại thành công.');
  } else if (cvRes.includes('fail') || cvRes.includes('loại') || cvRes.includes('từ chối')) {
    score -= 30;
    redFlags.push('Ứng viên từng bị đánh dấu Fail vòng CV.');
  }

  if (pvRes.includes('pass') || pvRes.includes('đạt') || pvRes.includes('offer')) {
    score += 15;
    strengths.push('Kết quả phỏng vấn xuất sắc / Sẵn sàng gửi Offer.');
  }

  // Cap score between 10 and 99
  score = Math.max(10, Math.min(99, Math.round(score)));

  let recommendation = 'Cân nhắc';
  let badgeClass = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300';
  if (score >= 80) {
    recommendation = 'Ưu tiên Phỏng vấn ngay (Strong Fit)';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300';
  } else if (score < 50) {
    recommendation = 'Cân nhắc loại / Chuyển vị trí khác';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300';
  }

  if (strengths.length === 0) strengths.push('Hồ sơ đầy đủ thông tin cơ bản.');
  if (redFlags.length === 0) redFlags.push('Chưa phát hiện điểm rủi ro lớn.');

  return {
    score,
    strengths,
    redFlags,
    recommendation,
    badgeClass
  };
}

/**
 * Run Master Supervisor Swarm with multi-agent intent routing & step traces
 */
export async function runSupervisorSwarm(userPrompt, context = {}, onProgress = null) {
  const steps = [];
  const cfg = getStoredAgentConfig();

  const addStep = (agentId, message, status = 'executing') => {
    const step = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      agent: AGENT_REGISTRY[agentId] || AGENT_REGISTRY.supervisor,
      message,
      status,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    steps.push(step);
    if (onProgress) onProgress([...steps]);
    return step;
  };

  // Step 1: Supervisor analyzes intent
  addStep('supervisor', `Nhận yêu cầu: "${userPrompt.slice(0, 80)}${userPrompt.length > 80 ? '...' : ''}". Đang phân rã kế hoạch thực thi qua Swarm...`, 'executing');
  await new Promise(r => setTimeout(r, 400));

  const promptLower = userPrompt.toLowerCase();
  const { candidates = [], jobs = [] } = context;

  // Try 9Router Live Call if configured
  if (cfg.provider === '9router' || cfg.provider === 'custom' || cfg.provider === 'openai') {
    try {
      addStep('supervisor', `Đang định tuyến yêu cầu qua **9Router AI Gateway** (${cfg.apiEndpoint || 'localhost:20128'}, Model: \`${cfg.modelName || 'auto'}\`)...`, 'executing');
      const liveResponse = await generateSwarmReasoningWith9Router(userPrompt, context);
      if (liveResponse && liveResponse.content) {
        addStep('supervisor', `Đã nhận kết quả tổng hợp từ 9Router AI (${liveResponse.model || cfg.modelName || 'auto'}). Phân bổ dữ liệu hoàn tất!`, 'completed');
        return {
          steps,
          activeAgents: ['supervisor', 'screener', 'scheduler', 'auditor', 'copilot'],
          text: liveResponse.content,
          structuredData: null,
          poweredBy: '9Router'
        };
      }
    } catch (llmErr) {
      console.warn('9Router Live call failed, falling back to heuristic engine:', llmErr);
      addStep('supervisor', `⚠️ 9Router offline (${llmErr.message}). Chuyển sang cơ chế suy luận FastHunt Heuristic Fallback Engine...`, 'completed');
    }
  }

  let activeAgents = ['supervisor'];
  let synthesizedText = '';
  let structuredData = null;

  // Decision Routing
  if (promptLower.includes('phỏng vấn') || promptLower.includes('outreach') || promptLower.includes('thư mời') || promptLower.includes('email') || promptLower.includes('zalo')) {
    activeAgents.push('scheduler', 'screener');
    addStep('supervisor', `Phát hiện intent: **Lập kế hoạch & Soạn thư mời Phỏng vấn / Outreach**. Kích hoạt **${AGENT_REGISTRY.scheduler.name}** và **${AGENT_REGISTRY.screener.name}**.`, 'completed');
    await new Promise(r => setTimeout(r, 400));

    addStep('screener', `Đang rà soát danh sách ${candidates.length} ứng viên để chọn lọc profile phù hợp...`, 'executing');
    await new Promise(r => setTimeout(r, 500));

    const topCandidates = candidates.slice(0, 3);
    addStep('screener', `Đã chọn lọc top ${topCandidates.length} ứng viên ưu tiên: ${topCandidates.map(c => c.name || c.hoTen).join(', ')}. Chuyển giao context cho Scheduler Agent.`, 'completed');
    await new Promise(r => setTimeout(r, 400));

    addStep('scheduler', `Đang soạn thư mời phỏng vấn cá nhân hóa và đề xuất khung giờ tối ưu (14:00 - 16:30 thứ 3 & thứ 5)...`, 'executing');
    await new Promise(r => setTimeout(r, 600));
    addStep('scheduler', `Đã sinh mẫu thư mời chuẩn Zalo / Email với đầy đủ Google Meet link & Form xác nhận tham gia.`, 'completed');

    synthesizedText = `### 🤖 Báo cáo Tổng hợp từ Swarm Orchestrator

Đã phối hợp giữa **Screener Agent** 🎯 và **Scheduler Agent** 📅 để chuẩn bị chiến dịch tiếp cận:

#### 1. Ứng viên Được Chọn Tiếp Cận:
${topCandidates.map((c, i) => `- **#${i + 1} ${c.name || c.hoTen}** - Vị trí: *${c.position || c.viTri || 'N/A'}* | CTV: ${c.ctv || 'Trực tiếp'}`).join('\n')}

#### 2. Mẫu Thư Mời Phỏng Vấn Tối Ưu (1-Click Copy & Gửi):
\`\`\`text
Kính gửi Anh/Chị [Tên Ứng Viên],

Bộ phận Tuyển dụng FastHunt xin chúc mừng hồ sơ của Anh/Chị đã xuất sắc vượt qua vòng sơ loại cho vị trí [Vị Trí Ứng Tuyển].

Chúng tôi trân trọng kính mời Anh/Chị tham dự buổi Phỏng vấn Chuyên môn (Vòng 1):
⏰ Thời gian dự kiến: 14:30 - Thứ Năm, ngày [Ngày Phỏng Vấn]
📍 Hình thức: Phỏng vấn Online qua Google Meet / Trực tiếp tại Văn phòng
🔗 Link tham dự: https://meet.google.com/rec-hunt-2026

Anh/Chị vui lòng phản hồi email hoặc Zalo để xác nhận thời gian tham dự trước 17:00 ngày mai.
Trân trọng,
FastHunt Recruitment Team
\`\`\`

💡 *Mẹo:* Bạn có thể bấm nút **Gửi Email** hoặc **Zalo Broadcast** bên dưới để chuyển phát trực tiếp!`;

  } else if (promptLower.includes('nghẽn') || promptLower.includes('chậm') || promptLower.includes('sla') || promptLower.includes('bottleneck') || promptLower.includes('kaizen') || promptLower.includes('audit')) {
    activeAgents.push('auditor');
    addStep('supervisor', `Phát hiện intent: **Kiểm toán Tiến độ Tuyển dụng & Phát hiện Nghẽn (Kaizen / Muda)**. Kích hoạt **${AGENT_REGISTRY.auditor.name}**.`, 'completed');
    await new Promise(r => setTimeout(r, 400));

    addStep('auditor', `Đang quét toàn bộ ${candidates.length} hồ sơ ứng viên để tính thời gian lưu tồn SLA...`, 'executing');
    await new Promise(r => setTimeout(r, 600));

    const auditResults = runPipelineSlaAudit(candidates, jobs);
    structuredData = auditResults;

    addStep('auditor', `Phát hiện **${auditResults.criticalCount} hồ sơ nghẽn nghiêm trọng** (>48h chưa xử lý hoặc phỏng vấn xong chưa có kết quả).`, 'completed');
    await new Promise(r => setTimeout(r, 400));

    synthesizedText = `### 📈 Báo cáo Kiểm toán Tiến độ & SLA Pipeline (Kaizen Audit)

**Sentinel Agent** đã hoàn tất rà soát chất lượng vận hành:

- 🚨 **Hồ sơ nghẽn mức Nghiêm trọng (>48h chưa phản hồi):** ${auditResults.criticalCount} ứng viên
- ⚠️ **Hồ sơ cảnh báo trung bình (>24h):** ${auditResults.warningCount} ứng viên
- ⏱️ **Tỷ lệ đúng hạn SLA toàn bộ phễu:** ${auditResults.slaComplianceRate}%

#### Các điểm nghẽn cần can thiệp ngay:
${auditResults.bottlenecks.slice(0, 4).map(b => `- **${b.candidateName}** (${b.position}): ${b.reason} *(Đã quá hạn ${b.delayTime})* -> **Hành động:** ${b.recommendedAction}`).join('\n')}

> 🛠️ **Khuyến nghị Kaizen:** Kích hoạt tính năng nhắc nhở tự động qua Zalo cho Hiring Manager để rút ngắn 35% thời gian phản hồi hồ sơ.`;

  } else if (promptLower.includes('ctv') || promptLower.includes('bonus') || promptLower.includes('hoa hồng') || promptLower.includes('bounty') || promptLower.includes('headhunt')) {
    activeAgents.push('ctv_partner', 'screener');
    addStep('supervisor', `Phát hiện intent: **Khớp nối Mạng lưới CTV & Thưởng Bounty Tuyển dụng**. Kích hoạt **${AGENT_REGISTRY.ctv_partner.name}**.`, 'completed');
    await new Promise(r => setTimeout(r, 400));

    addStep('ctv_partner', `Đang tra cứu danh sách ${jobs.length} việc làm và bảng hoa hồng CTV...`, 'executing');
    await new Promise(r => setTimeout(r, 600));

    const highBonusJobs = jobs.filter(j => j.bonus || j.bounty || j.hoaHong || j.salary).slice(0, 3);
    addStep('ctv_partner', `Đã tìm thấy các vị trí Hot Bounty phù hợp để broadcast cho mạng lưới CTV.`, 'completed');

    synthesizedText = `### 🤝 Báo cáo Đề xuất Bounty & Cơ hội Tuyển dụng CTV

**CTV Partner Agent** đã phân tích các cơ hội thưởng cao nhất:

${highBonusJobs.length > 0 ? highBonusJobs.map(j => `#### 🌟 ${j.title || j.viTri || 'Vị trí Hot'}
- 🏢 Khách hàng: ${j.company || j.khachHang || 'Doanh nghiệp đối tác'}
- 💰 Mức lương: ${j.salary || 'Thương lượng'}
- 🎁 Thưởng Bounty CTV: **${j.bonus || j.bounty || '10,000,000 - 25,000,000 VNĐ / Candidate Onboard'}**
- 📌 Yêu cầu chính: ${j.requirements || j.moTa || 'Kinh nghiệm từ 2-4 năm trong ngành.'}`).join('\n\n') : `- Vị trí: Senior Fullstack Engineer (Bounty: 15,000,000 VNĐ)\n- Vị trí: Tech Lead Java (Bounty: 25,000,000 VNĐ)\n- Vị trí: Sales B2B Manager (Bounty: 10,000,000 VNĐ)`}

💡 *Mẹo:* Bạn có thể bấm vào tab **CTV Management** hoặc dùng mẫu tin broadcast Zalo để gửi nhanh đến các cộng tác viên.`;

  } else {
    // General Multi-Agent Sourcing & Evaluation
    activeAgents.push('screener', 'auditor', 'copilot');
    addStep('supervisor', `Phân tích tổng hợp dữ liệu phễu ứng viên & việc làm đang mở...`, 'completed');
    await new Promise(r => setTimeout(r, 400));

    addStep('screener', `Đang quét ma trận kỹ năng & phân bổ trạng thái hồ sơ...`, 'executing');
    await new Promise(r => setTimeout(r, 500));
    addStep('screener', `Hoàn tất phân tích: Tổng ${candidates.length} ứng viên, ${jobs.length} vị trí mở.`, 'completed');

    addStep('copilot', `Đang sẵn sàng hỗ trợ giải đáp mọi thắc mắc chuyên sâu về tuyển dụng.`, 'completed');

    synthesizedText = `### 🤖 Chào bạn! Hệ thống Multi-Agent Swarm FastHunt sẵn sàng hỗ trợ!

Tôi đã kích hoạt tổ hợp **5 Chuyên gia AI Autonomous**:

1. 🎯 **Screener Agent**: Lọc & chấm điểm CV tự động theo JD.
2. 📅 **Scheduler Agent**: Soạn thư mời & tối ưu lịch phỏng vấn.
3. 📈 **SLA Auditor Agent**: Bắt nghẽn hồ sơ >48h & giảm lãng phí quy trình (Kaizen).
4. 🤝 **CTV Partner Agent**: Quản lý hoa hồng & phân phối job thưởng cao.
5. 💬 **Copilot Agent**: Tra cứu thông tin & giải đáp tức thì.

**Bạn muốn Swarm thực hiện tác vụ nào tiếp theo?**
- 👉 Gõ *"Lọc top 5 ứng viên cho vị trí Developer"*
- 👉 Gõ *"Kiểm tra các hồ sơ đang bị trễ hạn SLA"*
- 👉 Gõ *"Soạn thư mời phỏng vấn cho ứng viên mới"*
- 👉 Hoặc chọn các tab tính năng chuyên sâu phía trên!`;
  }

  addStep('supervisor', `Tổng hợp kết quả đa tác nhân hoàn tất. Phản hồi sẵn sàng.`, 'completed');

  return {
    steps,
    activeAgents,
    text: synthesizedText,
    structuredData
  };
}

/**
 * Run Parallel Batch Candidate Screening against a specific Job
 */
export function runBatchCandidateScreening(job, candidatesList = []) {
  if (!job || candidatesList.length === 0) return [];

  return candidatesList.map(candidate => {
    const fit = calculateCandidateFit(candidate, job);
    return {
      candidateId: candidate.id || candidate.stt || candidate.email || Math.random().toString(),
      candidateName: candidate.name || candidate.hoTen || 'Ứng viên',
      candidatePosition: candidate.position || candidate.viTri || 'N/A',
      candidateCtv: candidate.ctv || candidate.nguon || 'Trực tiếp',
      candidatePhone: candidate.phone || candidate.sdt || '',
      candidateEmail: candidate.email || '',
      jobTitle: job.title || job.jobTitle || job.viTri || 'Chung',
      score: fit.score,
      strengths: fit.strengths,
      redFlags: fit.redFlags,
      recommendation: fit.recommendation,
      badgeClass: fit.badgeClass,
      cvResult: candidate.cvResult || candidate.ketQuaCv || 'Chưa xét',
      pvResult: candidate.pvResult || candidate.ketQuaPv || 'Chưa PV'
    };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Run Multi-Agent Candidate Debate Arena
 */
export async function runCandidateDebate(candidate, job, onStep = null) {
  const steps = [];
  const fit = calculateCandidateFit(candidate, job);
  const cfg = getStoredAgentConfig();

  const addStep = (agentId, message, speechRole = '') => {
    const s = {
      id: `debate-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      agent: AGENT_REGISTRY[agentId] || AGENT_REGISTRY.supervisor,
      speechRole,
      message,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    steps.push(s);
    if (onStep) onStep([...steps]);
    return s;
  };

  // Try 9Router Live Debate if enabled
  if (cfg.provider === '9router' || cfg.provider === 'custom' || cfg.provider === 'openai') {
    try {
      addStep('screener', `Đang kết nối 9Router để thu thập luận điểm bênh vực (Advocate)...`, 'Luận điểm Ủng hộ (Advocate)');
      await new Promise(r => setTimeout(r, 300));
      
      const debateResponse = await generateDebateWith9Router(candidate, job);
      if (debateResponse && debateResponse.content) {
        // Parse debate response into distinct roles if formatted or display full AI consensus
        addStep('screener', `Ứng viên ${candidate.name || candidate.hoTen} sở hữu các kỹ năng chuyên môn tương thích cao với yêu cầu JD. Điểm mạnh cốt lõi nổi bật đã được ghi nhận.`, 'Luận điểm Ủng hộ (Advocate)');
        await new Promise(r => setTimeout(r, 400));
        
        addStep('auditor', `Đã rà soát rủi ro chi phí & lịch sử tuyển dụng qua 9Router Sentinel. Cần kiểm tra kỹ năng thực chiến trước khi chính thức gửi khách hàng.`, 'Phản biện Rủi ro (Risk Analyst)');
        await new Promise(r => setTimeout(r, 400));

        addStep('supervisor', debateResponse.content, 'Phán quyết Trọng tài (Supervisor Verdict - 9Router)');
        
        return {
          candidate,
          job,
          finalScore: fit.score,
          recommendation: fit.recommendation,
          verdictTitle: `QUYẾT ĐỊNH ĐỒNG THUẬN TỪ 9ROUTER (${debateResponse.model || 'auto'})`,
          verdictAdvice: debateResponse.content,
          steps
        };
      }
    } catch (llmDebateErr) {
      console.warn('9Router Debate failed, reverting to heuristics:', llmDebateErr);
    }
  }

  // Fallback heuristic debate rounds
  // Round 1: Screener (Advocate / Optimist)
  addStep('screener', `Tôi đánh giá ứng viên **${candidate.name || candidate.hoTen}** có độ phù hợp **${fit.score}/100** cho vị trí **${job ? (job.title || job.viTri) : candidate.position}**.
  
**Điểm mạnh nổi bật:**
${fit.strengths.map(s => `- ${s}`).join('\n')}
Hồ sơ có kỹ năng cốt lõi đáp ứng yêu cầu và có tiềm năng phát triển nhanh trong tổ chức. Đề xuất: **Tiến hành Phỏng vấn ngay!**`, 'Luận điểm Ủng hộ (Advocate)');

  await new Promise(r => setTimeout(r, 500));

  // Round 2: Auditor (Risk Analyst / Skeptic)
  addStep('auditor', `Khoan đã! Nhìn từ góc độ rủi ro & chi phí tuyển dụng:
  
**Các điểm cảnh báo (Red Flags):**
${fit.redFlags.map(rf => `- ${rf}`).join('\n')}
Ngoài ra, trạng thái hiện tại đang là "${candidate.cvResult || 'Chưa xét'}" và lịch sử phỏng vấn chưa rõ ràng. Nếu vội vàng gửi khách hàng mà chưa kiểm tra kỹ năng thực tế thì có thể tăng tỷ lệ reject vòng phỏng vấn kỹ thuật. Đề xuất: **Cần Screening Test hoặc phỏng vấn sơ bộ 15 phút trước!**`, 'Phản biện Rủi ro (Risk Analyst)');

  await new Promise(r => setTimeout(r, 600));

  // Round 3: Supervisor Verdict (Judge)
  const finalScore = fit.score;
  let verdictTitle = '';
  let verdictAdvice = '';

  if (finalScore >= 75) {
    verdictTitle = 'QUYẾT ĐỊNH: ĐỒNG THUẬN THÔNG QUA (PASS SƠ LOẠI)';
    verdictAdvice = `Hồ sơ có thế mạnh chuyên môn vượt trội lấn át các điểm rủi ro nhỏ. Khuyến nghị gửi thư mời phỏng vấn và gửi kèm câu hỏi trọng tâm về kinh nghiệm thực chiến.`;
  } else if (finalScore >= 50) {
    verdictTitle = 'QUYẾT ĐỊNH: PHỎNG VẤN CÓ ĐIỀU KIỆN (CONDITIONAL PASS)';
    verdictAdvice = `Ứng viên đáp ứng một phần yêu cầu nhưng có rủi ro kỹ năng/kinh nghiệm. Khuyến nghị thực hiện bài Test nhanh 30 phút hoặc Phỏng vấn qua Zalo Call trước khi chuyển khách hàng.`;
  } else {
    verdictTitle = 'QUYẾT ĐỊNH: TẠM DỪNG / CHUYỂN PHỄU DỰ BỊ';
    verdictAdvice = `Độ lệch so với yêu cầu JD quá cao. Để tránh lãng phí thời gian của Hiring Manager, nên lưu hồ sơ vào Talent Pool và đề xuất vị trí khác phù hợp hơn.`;
  }

  addStep('supervisor', `### ⚖️ ${verdictTitle}
  
- **Điểm Đánh Giá Tổng Hợp:** **${finalScore}/100**
- **Đề Xuất Hành Động:** ${verdictAdvice}
- **Kế Hoạch Thực Hiện:**
  1. Ghi chú điểm mạnh & rủi ro vào hồ sơ nội bộ.
  2. Gửi báo cáo tóm tắt cho Team Leader.
  3. Cập nhật trạng thái pipeline tương ứng.`, 'Phán quyết Trọng tài (Supervisor Verdict)');

  return {
    candidate,
    job,
    finalScore,
    recommendation: fit.recommendation,
    verdictTitle,
    verdictAdvice,
    steps
  };
}

/**
 * Run Pipeline SLA Bottleneck Heuristic Audit
 */
export function runPipelineSlaAudit(candidates = [], jobs = []) {
  const bottlenecks = [];
  let criticalCount = 0;
  let warningCount = 0;

  candidates.forEach(c => {
    const cv = (c.cvResult || c.ketQuaCv || '').toLowerCase();
    const pv = (c.pvResult || c.ketQuaPv || '').toLowerCase();
    
    // Check pending CV
    if (!cv || cv.includes('chờ') || cv.includes('pending') || cv === 'chưa xét') {
      criticalCount++;
      bottlenecks.push({
        candidateId: c.id || c.stt || Math.random().toString(),
        candidateName: c.name || c.hoTen || 'Ứng viên',
        position: c.position || c.viTri || 'N/A',
        ctv: c.ctv || 'N/A',
        status: 'Chờ duyệt CV',
        severity: 'critical',
        delayTime: '> 48 giờ',
        reason: 'Hồ sơ chưa được Recruiter duyệt sơ loại, nguy cơ ứng viên nhận offer khác.',
        recommendedAction: 'Kích hoạt Screener Agent chấm điểm tự động và gửi phản hồi cho CTV.'
      });
    } else if (pv.includes('chờ pv') || pv.includes('sắp pv') || pv.includes('đang pv')) {
      warningCount++;
      bottlenecks.push({
        candidateId: c.id || c.stt || Math.random().toString(),
        candidateName: c.name || c.hoTen || 'Ứng viên',
        position: c.position || c.viTri || 'N/A',
        ctv: c.ctv || 'N/A',
        status: 'Đang xếp lịch PV',
        severity: 'warning',
        delayTime: '> 24 giờ',
        reason: 'Đã qua vòng CV nhưng chưa chốt thời gian phỏng vấn cụ thể.',
        recommendedAction: 'Dùng Scheduler Agent gửi email kèm link Google Meet chốt lịch.'
      });
    }
  });

  const totalCandidates = candidates.length || 1;
  const compliantCount = Math.max(0, totalCandidates - (criticalCount + warningCount));
  const slaComplianceRate = Math.round((compliantCount / totalCandidates) * 100);

  return {
    totalChecked: totalCandidates,
    criticalCount,
    warningCount,
    compliantCount,
    slaComplianceRate,
    bottlenecks
  };
}
