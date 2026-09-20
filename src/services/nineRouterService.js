/**
 * 9Router AI Routing & Proxy Service
 * 
 * Provides unified OpenAI-compatible connection to 9Router (local proxy or remote gateway).
 * Manages health checks, model discovery, token optimization, failover, and chat completions.
 */

export const DEFAULT_9ROUTER_CONFIG = {
  enabled: true,
  endpoint: 'http://localhost:20128/v1',
  apiKey: '9router-default-key',
  model: 'auto',
  temperature: 0.7,
  maxTokens: 2048,
  tokenSaver: true,       // Token Saver (RTK / Rust Token Killer) compression
  autoFailover: true,     // Automatic failover between LLM providers
  timeoutMs: 15000        // Request timeout
};

export const PRESET_9ROUTER_ENDPOINTS = [
  {
    id: 'local_20128',
    label: '9Router Mặc Định (Localhost:20128)',
    endpoint: 'http://localhost:20128/v1',
    description: 'Cổng proxy 9Router mặc định chạy trên máy cục bộ'
  },
  {
    id: 'local_127',
    label: '9Router Loopback (127.0.0.1:20128)',
    endpoint: 'http://127.0.0.1:20128/v1',
    description: 'IP Loopback trực tiếp tránh lỗi phân giải localhost'
  },
  {
    id: 'openrouter',
    label: 'OpenRouter Cloud Gateway',
    endpoint: 'https://openrouter.ai/api/v1',
    description: 'Dịch vụ định tuyến đám mây OpenRouter'
  },
  {
    id: 'ollama_local',
    label: 'Ollama Local (Port 11434)',
    endpoint: 'http://localhost:11434/v1',
    description: 'Chạy LLM offline cục bộ qua Ollama'
  },
  {
    id: 'custom',
    label: 'Custom AI Gateway Endpoint',
    endpoint: '',
    description: 'Tùy chỉnh máy chủ proxy / vLLM / LiteLLM riêng'
  }
];

export const POPULAR_9ROUTER_MODELS = [
  { id: 'auto', name: '⚡ Auto / Best Fit (9Router Tự Chọn)', provider: '9Router Smart Router' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Tốc độ cực nhanh)', provider: 'Google' },
  { id: 'gpt-4o', name: 'GPT-4o (Đa nhiệm & Phân tích sâu)', provider: 'OpenAI' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Tiết kiệm token)', provider: 'OpenAI' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet (Lập luận tuyển dụng xuất sắc)', provider: 'Anthropic' },
  { id: 'deepseek-chat', name: 'DeepSeek Chat (V3 / R1 - Tối ưu chi phí)', provider: 'DeepSeek' },
  { id: 'qwen-2.5-coder', name: 'Qwen 2.5 Coder 32B', provider: 'Alibaba' }
];

const STORAGE_KEY_9ROUTER = 'fasthunt_9router_config';

/**
 * Load 9Router configuration from LocalStorage
 */
export function get9RouterConfig() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_9ROUTER);
      if (saved) {
        return { ...DEFAULT_9ROUTER_CONFIG, ...JSON.parse(saved) };
      }
    }
  } catch (e) {
    console.error('Failed to parse 9Router config from storage:', e);
  }
  return { ...DEFAULT_9ROUTER_CONFIG };
}

/**
 * Save 9Router configuration to LocalStorage
 */
export function save9RouterConfig(newConfig) {
  try {
    const merged = { ...get9RouterConfig(), ...newConfig };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_9ROUTER, JSON.stringify(merged));
    }
    return merged;
  } catch (e) {
    console.error('Failed to save 9Router config:', e);
    return newConfig;
  }
}

/**
 * Formats base endpoint URL to ensure proper /v1 suffix without trailing slashes
 */
export function normalize9RouterUrl(rawUrl = '') {
  let url = (rawUrl || '').trim();
  if (!url) return 'http://localhost:20128/v1';
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/v1') && !url.includes('/chat/completions') && !url.includes('/models')) {
    url = `${url}/v1`;
  }
  return url;
}

/**
 * Live connection health check to 9Router
 * Tests endpoint response time, ping latency, and model availability.
 */
export async function test9RouterConnection(configOverride = null) {
  const cfg = configOverride || get9RouterConfig();
  const baseUrl = normalize9RouterUrl(cfg.endpoint);
  const modelsUrl = baseUrl.endsWith('/v1') ? `${baseUrl}/models` : `${baseUrl.replace(/\/chat\/completions$/, '')}/models`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const headers = {
      'Content-Type': 'application/json'
    };
    if (cfg.apiKey) {
      headers['Authorization'] = `Bearer ${cfg.apiKey}`;
    }

    const response = await fetch(modelsUrl, {
      method: 'GET',
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json().catch(() => ({ data: [] }));
      const modelList = Array.isArray(data.data) ? data.data.map(m => m.id || m.name || m) : [];
      return {
        success: true,
        latency,
        status: response.status,
        models: modelList.length > 0 ? modelList : POPULAR_9ROUTER_MODELS.map(m => m.id),
        message: `Kết nối 9Router thành công (${latency}ms)! Tìm thấy ${modelList.length > 0 ? modelList.length : 'các'} mô hình khả dụng.`
      };
    } else {
      // If /models returns 404 or 401, try a lightweight chat completion ping
      const pingResult = await testChatPing(baseUrl, cfg);
      if (pingResult.success) {
        return pingResult;
      }
      return {
        success: false,
        latency: Date.now() - startTime,
        status: response.status,
        message: `9Router phản hồi mã lỗi HTTP ${response.status}: ${response.statusText}. Vui lòng kiểm tra API Key hoặc cổng proxy.`
      };
    }
  } catch (err) {
    const latency = Date.now() - startTime;
    let errMsg = err.message || 'Không thể kết nối đến 9Router';
    if (err.name === 'AbortError') {
      errMsg = 'Quá thời gian chờ phản hồi (Timeout 6s). Cổng 9Router chưa mở hoặc bị tường lửa chặn.';
    } else if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError') || errMsg.includes('ECONNREFUSED')) {
      errMsg = `Không tìm thấy dịch vụ 9Router tại "${baseUrl}". Vui lòng đảm bảo 9Router đang chạy (ví dụ: port 20128) hoặc kiểm tra cài đặt CORS.`;
    }
    return {
      success: false,
      latency,
      error: err,
      message: errMsg
    };
  }
}

/**
 * Fallback lightweight ping via /chat/completions
 */
async function testChatPing(baseUrl, cfg) {
  const chatUrl = baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey || '9router'}`
      },
      body: JSON.stringify({
        model: cfg.model || 'auto',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return {
        success: true,
        latency: Date.now() - startTime,
        status: res.status,
        models: POPULAR_9ROUTER_MODELS.map(m => m.id),
        message: `Kết nối 9Router qua Chat Completions thành công (${Date.now() - startTime}ms)!`
      };
    }
    return { success: false, status: res.status, message: `Chat Ping thất bại (HTTP ${res.status})` };
  } catch {
    return { success: false, message: 'Chat Ping thất bại' };
  }
}

/**
 * Execute a Chat Completion request through 9Router OpenAI-compatible API
 */
export async function call9RouterChat({
  messages = [],
  systemPrompt = '',
  model = null,
  temperature = null,
  maxTokens = null,
  onChunk = null,
  signal = null
}) {
  const cfg = get9RouterConfig();
  const baseUrl = normalize9RouterUrl(cfg.endpoint);
  const chatUrl = baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;

  const finalModel = model || cfg.model || 'auto';
  const finalTemp = temperature !== null ? temperature : (cfg.temperature || 0.7);
  const finalMaxTokens = maxTokens || cfg.maxTokens || 2048;

  const payloadMessages = [];
  if (systemPrompt) {
    payloadMessages.push({ role: 'system', content: systemPrompt });
  }
  payloadMessages.push(...messages);

  const requestBody = {
    model: finalModel,
    messages: payloadMessages,
    temperature: finalTemp,
    max_tokens: finalMaxTokens,
    stream: Boolean(onChunk)
  };

  const headers = {
    'Content-Type': 'application/json'
  };
  if (cfg.apiKey) {
    headers['Authorization'] = `Bearer ${cfg.apiKey}`;
  }

  if (cfg.tokenSaver) {
    headers['X-9Router-Token-Saver'] = 'true';
    headers['X-9Router-Failover'] = cfg.autoFailover ? 'true' : 'false';
  }

  const response = await fetch(chatUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
    signal
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`9Router Error HTTP ${response.status} (${response.statusText}): ${errorBody || 'Yêu cầu không thành công'}`);
  }

  // Handle SSE Streaming
  if (onChunk && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed === 'data: [DONE]') continue;

        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              onChunk(delta, fullText);
            }
          } catch {
            // Skip unparseable chunks
          }
        }
      }
    }

    return {
      content: fullText,
      model: finalModel
    };
  }

  // Standard JSON response
  const json = await response.json();
  const choice = json.choices?.[0];
  const content = choice?.message?.content || '';

  return {
    content,
    model: json.model || finalModel,
    usage: json.usage,
    raw: json
  };
}

/**
 * High-level helper: Generate intelligent Swarm Orchestration reasoning via 9Router
 */
export async function generateSwarmReasoningWith9Router(prompt, context = {}) {
  const { candidates = [], jobs = [] } = context;

  const candidateSummary = candidates.slice(0, 10).map((c, i) => 
    `${i+1}. ${c.name || c.hoTen} (${c.position || c.viTri || 'N/A'}, Exp: ${c.experience || c.kinhNghiem || 'N/A'}, CTV: ${c.ctv || 'Trực tiếp'}, CV: ${c.cvResult || 'Chưa xét'}, PV: ${c.pvResult || 'Chưa PV'})`
  ).join('\n');

  const jobSummary = jobs.slice(0, 8).map((j, i) =>
    `${i+1}. ${j.title || j.viTri} (Công ty: ${j.company || 'N/A'}, Lương: ${j.salary || 'Thương lượng'}, Bonus: ${j.bonus || j.bounty || 'Có'})`
  ).join('\n');

  const systemPrompt = `Bạn là Master Supervisor Orchestrator thuộc hệ thống FastHunt Multi-Agent Recruitment Swarm (kết nối qua 9Router AI Gateway).
Bạn điều phối 5 chuyên gia:
- Screener Agent: Chấm điểm & lọc CV
- Scheduler Agent: Soạn thư mời & tối ưu lịch phỏng vấn
- SLA Auditor Agent: Bắt nghẽn hồ sơ >48h (Kaizen)
- CTV Partner Agent: Khớp nối thưởng hoa hồng Bounty CTV
- Copilot Agent: Tư vấn & giải đáp

DỮ LIỆU HIỆN TẠI:
[DANH SÁCH ỨNG VIÊN HIỆN TẠI]:
${candidateSummary || 'Chưa có hồ sơ'}

[DANH SÁCH VIỆC LÀM ĐANG MỞ]:
${jobSummary || 'Chưa có job'}

Nhiệm vụ: Trả lời ngắn gọn, chuyên nghiệp, súc tích, theo định dạng Markdown phong phú (sử dụng emoji, bullet points, code blocks mẫu nếu có).`;

  return call9RouterChat({
    systemPrompt,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    maxTokens: 2048
  });
}

/**
 * High-level helper: Run live Multi-Agent Debate via 9Router
 */
export async function generateDebateWith9Router(candidate, job) {
  const candidateInfo = JSON.stringify({
    name: candidate.name || candidate.hoTen,
    position: candidate.position || candidate.viTri,
    experience: candidate.experience || candidate.kinhNghiem,
    cvResult: candidate.cvResult || candidate.ketQuaCv,
    pvResult: candidate.pvResult || candidate.ketQuaPv,
    ctv: candidate.ctv || candidate.nguon
  }, null, 2);

  const jobInfo = job ? JSON.stringify({
    title: job.title || job.viTri,
    company: job.company || job.khachHang,
    requirements: job.requirements || job.moTa,
    salary: job.salary
  }, null, 2) : 'Vị trí tuyển dụng chuẩn';

  const systemPrompt = `Bạn là Trọng tài Tối cao (Supervisor Verdict) điều hành phiên tranh luận đa tác nhân (Multi-Agent Debate Arena) giữa:
1. Screener Agent (Luật sư Bênh vực / Advocate): Nêu bật điểm mạnh và khuyến khích mời PV.
2. Auditor Agent (Phản biện Rủi ro / Risk Analyst): Chỉ ra các điểm cảnh báo (Red Flags), nguy cơ fail và rủi ro chi phí.
3. Supervisor Agent (Phán quyết Trọng tài): Đưa ra điểm số (0-100) và quyết định cuối cùng (PASS SƠ LOẠI / CONDITIONAL PASS / TẠM DỪNG).

Hãy phân tích ứng viên sau theo đúng cấu trúc 3 phần rõ ràng:`;

  const userPrompt = `ỨNG VIÊN:
${candidateInfo}

YÊU CẦU CÔNG VIỆC:
${jobInfo}

Hãy đưa ra luận điểm từ Screener Agent, Auditor Agent và Phán quyết của Supervisor!`;

  return call9RouterChat({
    systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.6,
    maxTokens: 1500
  });
}
