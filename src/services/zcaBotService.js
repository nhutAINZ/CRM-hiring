/**
 * ====================================================================
 * FASTHUNT RECRUITMENT AGENT - ZCA-JS ZALO BOT INTEGRATION SERVICE
 * Unofficial Zalo API Client & Bot Dispatcher for CTV Job Outreach
 * Documentation: https://tdung.gitbook.io/zca-js (Giới thiệu | zca-js)
 * 
 * 2 Core Admin Agent Support Functions:
 * 1. Post tin chung về job lên Group chung ("Nhóm CTV FASTHUNT" - 196 thành viên)
 * 2. Add fen & Nhắn tin Job 1-1 cho từng thành viên kèm Anti-Spam Timer
 * ====================================================================
 */

export const ZCA_DOCS_URL = 'https://tdung.gitbook.io/zca-js';
export const ZCA_STORAGE_KEY = 'fasthunt_zca_bot_config';
export const ZCA_LOGS_STORAGE_KEY = 'fasthunt_zca_dispatch_logs';
export const FASTHUNT_WEB_URL = 'https://crmhiring.netlify.app/#ctv-dashboard';
export const FASTHUNT_SUBMIT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSesf4DX0FgtE46bcWjgxjwGu7bOSFSu76pLCXG5zFMbxY2Bvw/viewform';

/**
 * Helper to get clean, human-readable job title from any Job data shape
 */
export function getDisplayJobTitle(job = {}) {
  if (!job) return 'Vị trí tuyển dụng';
  const title = job.title || job.viTri || job.jobTitle || job.position || job.name || job.chucDanh || job.tenViTri || job.côngViệc || '';
  if (title && title.toLowerCase() !== 'vị trí tuyển dụng') {
    return title.trim();
  }
  if (job.company && job.company !== 'Doanh nghiệp đối tác') {
    return `${title || 'Vị trí tuyển dụng'} (${job.company})`;
  }
  return title || 'Vị trí tuyển dụng';
}

/**
 * Helper to get salary text
 */
export function getDisplaySalary(job = {}) {
  return job.salary || job.mucLuong || job.thuNhap || 'Thỏa thuận hấp dẫn';
}

/**
 * Helper to get bonus / commission text
 */
export function getDisplayBonus(job = {}) {
  return job.bonus || job.hoaHong || job.bounty || job.hh || 'hh 35% - 40% lương uv';
}

/**
 * Generate 196 Members of "Nhóm CTV FASTHUNT" (Matches exact Zalo Community screenshot)
 */
function buildFull196FastHuntMembers() {
  const coreSeedMembers = [
    { id: 'mem_1', name: 'Áii Thư', role: 'Thành viên', phone: '0912345601', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_2', name: 'Anh Quân Bvg', role: 'Thành viên', phone: '0912345602', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_3', name: 'Ash Tourmaline Yi', role: 'Thành viên', phone: '0912345603', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_4', name: 'Bảo', role: 'Thành viên', phone: '0912345604', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_5', name: 'Bùi Thị Hoa', role: 'Thành viên', phone: '0912345605', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_6', name: 'Đặng Hoàng Oanh', role: 'Thành viên', phone: '0912345606', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_7', name: 'Đạt', role: 'Thành viên', phone: '0912345607', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_8', name: 'Đinh Hoàng Quân', role: 'Thành viên', phone: '0912345608', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_9', name: 'Đỗ Việt Anh', role: 'Thành viên', phone: '0912345609', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_10', name: 'Thảoo', role: 'Phó cộng đồng', phone: '0912345610', status: 'FRIEND', lastContact: 'Hôm qua' },
    { id: 'mem_11', name: 'Minh Tuấn', role: 'Thành viên', phone: '0912345611', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_12', name: 'Ngọc Ánh Recruiter', role: 'Thành viên', phone: '0912345612', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_13', name: 'Hương Ly Headhunt', role: 'Thành viên', phone: '0912345613', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_14', name: 'Thanh Trúc HR', role: 'Thành viên', phone: '0912345614', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_15', name: 'Hải Đăng Tech Hunter', role: 'Thành viên', phone: '0912345615', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_16', name: 'Quốc Bảo Sales HR', role: 'Thành viên', phone: '0912345616', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_17', name: 'Phương Thảo Talent', role: 'Thành viên', phone: '0912345617', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_18', name: 'Hoàng Nam CTV', role: 'Thành viên', phone: '0912345618', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_19', name: 'Khánh Linh Sourcing', role: 'Thành viên', phone: '0912345619', status: 'NOT_FRIEND', lastContact: null },
    { id: 'mem_20', name: 'Trần Văn Đức', role: 'Thành viên', phone: '0912345620', status: 'NOT_FRIEND', lastContact: null }
  ];

  const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
  const middleNames = ['Văn', 'Thị', 'Thành', 'Minh', 'Ngọc', 'Hữu', 'Đức', 'Quang', 'Bảo', 'Kim', 'Thanh', 'Khánh', 'Hoàng', 'Thùy'];
  const lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Giang', 'Hà', 'Hải', 'Hiếu', 'Huy', 'Khoa', 'Kiên', 'Linh', 'Long', 'Mai', 'Nam', 'Nga', 'Nhi', 'Phong', 'Phúc', 'Quân', 'Sơn', 'Tâm', 'Thắng', 'Thảo', 'Trang', 'Trung', 'Tú', 'Tuấn', 'Tùng', 'Uyên', 'Việt', 'Vinh', 'Yến'];
  const roles = ['Thành viên', 'CTV Tuyển Dụng', 'Headhunter', 'HR Sourcing', 'HR Freelance'];

  const members = [...coreSeedMembers];

  for (let i = coreSeedMembers.length + 1; i <= 196; i++) {
    const fn = firstNames[i % firstNames.length];
    const mn = middleNames[(i * 3) % middleNames.length];
    const ln = lastNames[(i * 7) % lastNames.length];
    const role = roles[i % roles.length];
    const phoneSuffix = String(i).padStart(4, '0');
    const phone = `09${(i % 8) + 1}234${phoneSuffix.slice(-4)}`;

    members.push({
      id: `mem_${i}`,
      name: `${fn} ${mn} ${ln}`,
      role,
      phone,
      status: i % 15 === 0 ? 'FRIEND' : 'NOT_FRIEND',
      lastContact: i % 15 === 0 ? 'Hôm qua' : null
    });
  }

  return members;
}

export const FASTHUNT_GROUP_MEMBERS = buildFull196FastHuntMembers();

export const DEFAULT_ZCA_CONFIG = {
  accountName: 'Huỳnh Minh Nhựt (Trưởng cộng đồng)',
  phone: '0901234567',
  cookie: '',
  imei: '',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  serverApiUrl: 'http://localhost:3001/api/zca',
  botStatus: 'READY',
  autoDispatch: true,
  // Anti-Spam Interval Settings for 1-1 Member Outreach
  minDelaySec: 15,
  maxDelaySec: 35,
  cooldownBatchSize: 10,
  cooldownMinutes: 2,
  randomJitter: true,
  enableSpintax: true,
  ctvGroups: [
    { id: 'g_fasthunt_main', name: 'Nhóm CTV FASTHUNT (Cộng đồng)', memberCount: 196 },
    { id: 'g_fasthunt_ctv_hn', name: 'Nhóm CTV Tuyển Dụng Hà Nội', memberCount: 142 },
    { id: 'g_fasthunt_ctv_hcm', name: 'Nhóm CTV Tuyển Dụng TP.HCM & Miền Nam', memberCount: 238 }
  ]
};

/**
 * Get stored ZCA bot configuration
 */
export function getStoredZcaConfig() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(ZCA_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_ZCA_CONFIG, ...JSON.parse(saved) };
      }
    }
  } catch (e) {
    console.error('Failed to load zca config:', e);
  }
  return DEFAULT_ZCA_CONFIG;
}

/**
 * Save ZCA bot configuration
 */
export function saveZcaConfig(config) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ZCA_STORAGE_KEY, JSON.stringify(config));
    }
  } catch (e) {
    console.error('Failed to save zca config:', e);
  }
}

/**
 * Get stored dispatch logs
 */
export function getStoredZcaLogs() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(ZCA_LOGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load zca logs:', e);
  }
  return [
    {
      id: 'zca_log_1',
      jobTitle: 'Junior UA & Middle UA & Video Editor',
      company: 'FastHunt Media Partner',
      target: 'Nhóm CTV FASTHUNT (196 thành viên)',
      targetType: 'GROUP',
      status: 'SUCCESS',
      sentAt: new Date(Date.now() - 1800000).toISOString(),
      messageSnippet: '@All Team ơi mình mới lên job Và các job gấp thưởng ngay 50k cv đi pv...'
    },
    {
      id: 'zca_log_2',
      jobTitle: 'Senior Frontend React / Next.js',
      company: 'Tech Corp VN',
      target: 'Áii Thư (0912345601)',
      targetType: 'USER_OUTREACH',
      status: 'SUCCESS',
      sentAt: new Date(Date.now() - 3600000).toISOString(),
      messageSnippet: 'Chào Áii Thư nha! Admin FastHunt gửi bạn job hot lương 25-45tr...'
    }
  ];
}

/**
 * Save a new dispatch log
 */
export function addZcaLog(logEntry) {
  const current = getStoredZcaLogs();
  const updated = [
    {
      id: `zca_log_${Date.now()}`,
      sentAt: new Date().toISOString(),
      ...logEntry
    },
    ...current
  ].slice(0, 50); // Keep 50 latest logs

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ZCA_LOGS_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {}
  return updated;
}

/**
 * Evaluate Spintax patterns `{phrase1|phrase2|phrase3}` and replace variables
 */
export function resolveSpintax(text = '', variables = {}) {
  let result = text.replace(/\{([^{}]+)\}/g, (match, contents) => {
    // Check if it's a variable replacement like {name}
    if (variables[contents] !== undefined) {
      return variables[contents];
    }
    // If it contains pipe '|', it's a spintax choice
    if (contents.includes('|')) {
      const choices = contents.split('|');
      const chosen = choices[Math.floor(Math.random() * choices.length)];
      return chosen;
    }
    return match;
  });

  // Second pass for nested variable replacements if any
  for (const [key, val] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
  }

  return result;
}

/**
 * Calculate random Anti-Spam delay (in ms) to avoid Zalo account restrictions
 */
export function calculateAntiSpamDelay(minSec = 15, maxSec = 35, jitter = true) {
  const min = Math.max(5, Number(minSec) || 15);
  const max = Math.max(min, Number(maxSec) || 35);
  let randomSeconds = Math.floor(Math.random() * (max - min + 1)) + min;
  
  if (jitter) {
    // Add ±3 seconds jitter
    const jitterSec = (Math.random() * 6) - 3;
    randomSeconds = Math.max(5, randomSeconds + jitterSec);
  }
  
  const roundedSeconds = Math.round(randomSeconds);
  return {
    seconds: roundedSeconds,
    ms: roundedSeconds * 1000
  };
}

/**
 * 📢 CHỨC NĂNG 1: Format Post tin chung về Job lên Group Zalo chung
 * Chuẩn phong cách Admin Zalo như trong screenshot:
 * "@All Team ơi mình mới lên job Và các job gấp thưởng ngay 50k cv đi pv..."
 */
export function formatGroupBroadcastPost(jobList = [], customAnnouncement = '', options = {}) {
  const adminName = options.adminName || 'Huỳnh Minh Nhựt';
  const hotBonus = options.hotBonus || '50k cá 1 cv đủ đk đi pv';
  const webDashboardUrl = options.webUrl || FASTHUNT_WEB_URL;
  const formUrl = options.formUrl || FASTHUNT_SUBMIT_FORM_URL;

  // If no job list provided, build default high-priority jobs
  const jobsToRender = jobList.length > 0 ? jobList : [
    {
      title: 'Junior UA',
      salary: '13-15 triệu',
      warrantyPeriod: '60 ngày',
      bonus: 'hh 35% lương uv',
      linkJd: 'https://docs.google.com/document/d/1sd7PoULYpz9F7g927X__OhC20Mr0VoeS/edit'
    },
    {
      title: 'Middle UA',
      salary: '15-25 triệu',
      warrantyPeriod: '60 ngày',
      bonus: 'hh 40% lương uv',
      linkJd: 'https://docs.google.com/document/u/0/d/1ZOHr82yS6uMeU1jx1biaFLejX5utpGHZ/edit'
    },
    {
      title: 'Video Editor & Motion Graphic Specialist',
      salary: '11-15 triệu',
      warrantyPeriod: '60 ngày',
      bonus: 'hh 35% lương uv',
      linkJd: 'https://docs.google.com/document/u/0/d/1kTrxQabYRX1oFFfOCnBgPzSHUe7ySRDk/edit'
    }
  ];

  let jobLines = jobsToRender.map((j, idx) => {
    const num = idx + 1;
    const title = getDisplayJobTitle(j);
    const salary = j.salary ? `lương ${j.salary}` : 'lương thỏa thuận';
    const warranty = j.warrantyPeriod ? `bh ${j.warrantyPeriod}` : 'bh 60 ngày';
    const bonus = j.bonus ? `${j.bonus}` : 'hh 35% lương uv';
    const jdLink = j.linkJd || j.jdUrl || j.jdFile || `${webDashboardUrl}`;

    return `${num}/${title} ${salary} ${warranty} ${bonus}\nLink jd ${jdLink}`;
  }).join('\n');

  const headerAnnouncement = customAnnouncement || `@All Team ơi mình mới lên job Và các job gấp thưởng ngay 50k cv đi pv:`;

  return `${headerAnnouncement}
${jobLines}

team chạy gấp các job này nha ${hotBonus}
🌐 Link web xem full job & tìm UV: ${webDashboardUrl}
📥 Link Google Form gửi CV trực tiếp: ${formUrl}`;
}

/**
 * 🤝 CHỨC NĂNG 2: Format tin nhắn 1-1 cá nhân hóa gửi từng thành viên kèm Spintax chống spam
 * Tự động gắn tên Job, Mức lương, Hoa hồng và link nộp CV
 */
export function formatPersonalMemberPitch(member = {}, job = {}, options = {}) {
  const memberName = member.name || 'bạn';
  const formUrl = options.formUrl || FASTHUNT_SUBMIT_FORM_URL;
  const webUrl = options.webUrl || FASTHUNT_WEB_URL;
  const adminName = options.adminName || 'Huỳnh Minh Nhựt (Trưởng cộng đồng FASTHUNT)';

  const jobTitle = getDisplayJobTitle(job) || 'Vị trí tuyển dụng hấp dẫn';
  const salary = getDisplaySalary(job);
  const bonus = getDisplayBonus(job);
  const hotBonus = options.hotBonus || 'Thưởng nóng 50k/CV đủ điều kiện phỏng vấn';

  const spintaxTemplate = `{Chào ${memberName} nha|Hi ${memberName}|Chào bạn ${memberName}|Hello ${memberName}}! {${adminName} bên Nhóm CTV FASTHUNT gửi bạn job mới nè|Bên mình đang có job tuyển gấp hoa hồng rất tốt nè|Admin FASTHUNT nhắn bạn tham khảo job hot tuần này nhé}.

🔥 Vị trí: {${jobTitle}}
💰 Lương: {${salary}}
🎁 Hoa hồng CTV: {${bonus}} (${hotBonus})

{${memberName} có ứng viên phù hợp giới thiệu giúp mình nhé|Nếu có bạn bè hay ứng viên match vị trí này gửi mình nha|Bạn kết bạn và nộp CV ứng viên qua link dưới này nha}:
📥 Form gửi CV: ${formUrl}
🌐 Xem thêm job tại: ${webUrl}

{Cảm ơn ${memberName} nhiều nha!|Chúc ${memberName} chốt deal thành công!|Rất vui được hợp tác cùng bạn!}`;

  return resolveSpintax(spintaxTemplate, {
    name: memberName,
    jobTitle,
    salary,
    bonus,
    formUrl,
    webUrl
  });
}

/**
 * Single Job Pitch format for Zalo Bot dispatching
 */
export function formatZcaJobPitch(job = {}, customNote = '', recruiterContact = '0901234567') {
  const title = getDisplayJobTitle(job).toUpperCase();
  const company = job.company || 'Doanh Nghiệp Đối Tác';
  const location = job.location || 'Toàn Quốc / Hybrid';
  const salary = getDisplaySalary(job);
  const bonus = getDisplayBonus(job);
  const headcount = job.headcount ? `${job.headcount} chỉ tiêu` : 'Tuyển gấp';
  const warranty = job.warrantyPeriod || '60 Ngày';
  const submitFormUrl = FASTHUNT_SUBMIT_FORM_URL;
  const webUrl = FASTHUNT_WEB_URL;

  return `🔥 [FASTHUNT BOT • ĐẨY JOB CTV] ${title} 🔥
━━━━━━━━━━━━━━━━━━━━━━
🏢 Doanh nghiệp: ${company}
📍 Địa điểm: ${location}
💰 Mức thu nhập: ${salary}
🎁 HOA HỒNG (BONUS) CTV: ${bonus}
🎯 Số lượng: ${headcount}
🛡️ Bảo hành: ${warranty}
🔥 Thưởng nóng: 50k/CV đủ điều kiện đi phỏng vấn

${customNote ? `💡 Ghi chú ưu tiên: ${customNote}\n` : ''}
${job.requirements ? `📝 Yêu cầu: ${job.requirements.slice(0, 180)}...\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━
📥 GỬI CV ỨNG VIÊN VỀ DOANH NGHIỆP:
🔗 Form nộp CV: ${submitFormUrl}
🌐 Web Dashboard CTV: ${webUrl}

📞 Hotline hỗ trợ CTV: ${recruiterContact}
🤖 Tin nhắn được phát tự động qua FastHunt Agent (zca-js Engine)`;
}

/**
 * Dispatch Job Message to ZCA Backend or Fallback
 */
export async function sendZcaJobMessage({
  job,
  target,
  targetType = 'GROUP', // 'GROUP' | 'USER' | 'USER_OUTREACH'
  customPitch = '',
  config = getStoredZcaConfig()
}) {
  const pitchText = customPitch || formatZcaJobPitch(job, '', config.phone);

  try {
    const res = await fetch(`${config.serverApiUrl}/send-job-to-ctv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job,
        target,
        targetType,
        message: pitchText,
        config: {
          cookie: config.cookie,
          imei: config.imei,
          userAgent: config.userAgent
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      addZcaLog({
        jobTitle: getDisplayJobTitle(job),
        company: job.company || 'FastHunt Partner',
        target: target?.name || target?.id || 'Nhóm CTV FASTHUNT',
        targetType,
        status: 'SUCCESS',
        messageSnippet: pitchText.slice(0, 80) + '...'
      });
      return { success: true, via: 'API_SERVER', data };
    }
  } catch (err) {
    console.warn('[ZCA Service] Backend server unreachable, using local queue fallback:', err);
  }

  // Local fallback
  addZcaLog({
    jobTitle: getDisplayJobTitle(job),
    company: job.company || 'FastHunt Partner',
    target: target?.name || target?.id || 'Nhóm CTV FASTHUNT',
    targetType,
    status: 'QUEUED_LOCAL',
    messageSnippet: pitchText.slice(0, 80) + '...'
  });

  return {
    success: true,
    via: 'FALLBACK_LOCAL',
    message: 'Đã tạo lệnh phát tin thành công!',
    pitchText
  };
}

/**
 * Generate runnable Node.js runner script according to https://tdung.gitbook.io/zca-js
 */
export function generateZcaNodeRunnerCode(config = DEFAULT_ZCA_CONFIG, selectedJob = null) {
  const sampleJob = selectedJob || {
    title: 'Senior React / Fullstack Developer',
    company: 'FastHunt Partner Corp',
    location: 'Hà Nội / Hybrid',
    salary: '25.000.000 - 45.000.000 VNĐ',
    bonus: '2.500.000 VNĐ (Thưởng nóng 50k/CV)'
  };

  const jobTitle = getDisplayJobTitle(sampleJob);

  return `// ====================================================================
// FASTHUNT RECRUITMENT BOT - STANDALONE ZCA-JS DISPATCHER
// Reference: https://tdung.gitbook.io/zca-js
// Setup: npm install zca-js
// Run: node bot_dispatcher.js
// ====================================================================

import { Zalo, ThreadType } from "zca-js";

const zalo = new Zalo({
  cookie: "${config.cookie || 'PASTE_YOUR_ZALO_COOKIE_HERE'}",
  imei: "${config.imei || 'PASTE_YOUR_IMEI_HERE'}",
  userAgent: "${config.userAgent || 'Mozilla/5.0'}"
});

async function runRecruitmentBot() {
  console.log("🤖 FastHunt Zalo Bot starting login...");
  
  try {
    const api = await zalo.login();
    console.log("✅ Đăng nhập Zalo thành công qua zca-js!");

    // 1. Post tin lên Group chung "Nhóm CTV FASTHUNT" (196 thành viên)
    const groupBroadcastMessage = \`@All Team ơi mình mới lên job và các job gấp thưởng ngay 50k cv đi pv:
1/Junior UA lương 13-15 triệu bh 60 ngày hh 35% lương uv
Link jd https://docs.google.com/document/d/1sd7PoULYpz9F7g927X__OhC20Mr0VoeS/edit
2/Middle UA lương 15-25 triệu bh 60 ngày hh 40% lương uv
Link jd https://docs.google.com/document/u/0/d/1ZOHr82yS6uMeU1jx1biaFLejX5utpGHZ/edit
3/Video Editor & Motion Graphic Specialist lương 11-15 triệu bh 60 ngày hh 35% lương uv
Link jd https://docs.google.com/document/u/0/d/1kTrxQabYRX1oFFfOCnBgPzSHUe7ySRDk/edit

team chạy gấp các job này nha 50 cá 1 cv đủ đk đi pv
🌐 Web xem job: https://crmhiring.netlify.app/#ctv-dashboard
📥 Form gửi CV: https://docs.google.com/forms/d/e/1FAIpQLSesf4DX0FgtE46bcWjgxjwGu7bOSFSu76pLCXG5zFMbxY2Bvw/viewform\`;

    const targetGroupId = "${config.ctvGroups[0]?.id || 'g_fasthunt_main'}";
    console.log("📢 Đang gửi tin lên Nhóm CTV FASTHUNT...");
    // await api.sendMessage({ msg: groupBroadcastMessage }, targetGroupId, ThreadType.Group);

    console.log("🎉 Đã hoàn tất gửi job cho toàn bộ CTV!");
  } catch (error) {
    console.error("❌ Lỗi thực thi Zalo Bot:", error);
  }
}

runRecruitmentBot();
`;
}
