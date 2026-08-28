import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  MessageCircle,
  Mail,
  SendHorizontal,
  X,
  RefreshCw,
  Copy,
  Check,
  Zap,
  BarChart2,
  AlertCircle,
  Share2,
  ChevronUp,
  Settings,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateMetrics, normalizeCvResult, normalizePvResult } from '../utils/dataNormalizer';

export default function AiRecruiterBot({
  candidates = [],
  sheet2Items = [],
  jobItems = [],
  sheet2ViewUrl,
  jobSheetUrl = 'https://docs.google.com/spreadsheets/d/1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko/edit?gid=0#gid=0',
  onOpenEmail,
  onOpenDetail,
  externalIsOpen,
  setExternalIsOpen
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = setExternalIsOpen || setInternalIsOpen;
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Xin chào! Tôi là **FastHunt AI Recruiter Assistant** 🤖.
Tôi có thể giúp bạn:
1. ⭐ **Tra cứu các vị trí tuyển dụng & Bonus CTV** từ Google Sheet Jobs.
2. 📊 **Phân tích tiến độ tuyển dụng** realtime & báo cáo tổng quan.
3. ⚡ **Phát hiện hồ sơ nghẽn / cần xử lý gấp**.
4. 💬 **Soạn báo cáo định dạng chuẩn Zalo, Telegram & Email** gửi Khách hàng & CTV!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  // Telegram & Integration Channel state
  const [telegramConfig, setTelegramConfig] = useState(() => {
    const saved = localStorage.getItem('fasthunt_telegram_config');
    return saved ? JSON.parse(saved) : { botToken: '', chatId: '', autoReport: false };
  });
  const [showConfig, setShowConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Save Telegram settings
  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('fasthunt_telegram_config', JSON.stringify(telegramConfig));
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  // Dispatch progress report directly to Telegram Bot API
  const handleSendToTelegram = async (reportText) => {
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      alert('Vui lòng nhập Telegram Bot Token và Chat ID trong phần Cấu hình Channel!');
      setShowConfig(true);
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramConfig.chatId,
          text: reportText,
          parse_mode: 'Markdown'
        })
      });

      const data = await res.json();
      if (data.ok) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
        alert('🚀 Đã gửi báo cáo thành công qua Telegram Bot!');
      } else {
        alert(`Không thể gửi qua Telegram: ${data.description || 'Vui lòng kiểm tra lại Bot Token/Chat ID'}`);
      }
    } catch (err) {
      console.error('Telegram dispatch error', err);
      alert('Lỗi kết nối API Telegram: ' + err.message);
    }
  };

  // Generate AI Response based on prompt logic & current recruitment metrics
  const generateAiAnalysis = (query) => {
    const q = query.toLowerCase();
    const metrics = calculateMetrics(candidates);

    // Job Sheet Query
    if (q.includes('job') || q.includes('vị trí') || q.includes('bonus') || q.includes('hoa hồng') || q.includes('tuyển')) {
      const urgentJobs = jobItems.filter((j) => (j.status || '').toUpperCase().includes('GẤP'));
      let text = `⭐ **BÁO CÁO VỊ TRÍ TUYỂN DỤNG & BONUS CTV (GOOGLE SHEET JOBS)**
📊 **Tổng số vị trí đang mở:** ${jobItems.length} Jobs
🔥 **Vị trí đang tuyển gấp:** ${urgentJobs.length} Jobs

Top các vị trí tuyển dụng tiêu biểu & hoa hồng hấp dẫn:
`;
      jobItems.slice(0, 5).forEach((j, i) => {
        text += `${i + 1}. **[${j.company}] ${j.title}**\n   • Khu vực: ${j.location} | Ngành: ${j.industry}\n   • Thu nhập: ${j.salary}\n   • 🎁 **Bonus CTV:** ${j.bonus}\n   • 🔗 Link Sheet: ${j.sheetRowUrl}\n`;
      });
      text += `\n🔗 **Link Toàn Bộ Bảng Sheet Jobs Gốc:** ${jobSheetUrl}`;
      return text;
    }

    if (q.includes('tiến độ') || q.includes('phân tích') || q.includes('báo cáo') || q.includes('tổng quan')) {
      const passCv = metrics.cvPass;
      const passPv = metrics.pvPass;
      const urgent = metrics.urgentCandidates.length;

      return `📊 **BÁO CÁO PHÂN TÍCH TIẾN ĐỘ TUYỂN DỤNG (FASTHUNT AI)**
      
- **Tổng số hồ sơ tiếp nhận:** ${metrics.total} ứng viên
- **Đã Pass CV:** ${passCv} hồ sơ (Tỷ lệ: ${metrics.cvPassRate}%)
- **Hồ sơ loại (Fail CV):** ${metrics.cvFail} ứng viên
- **Đã hẹn phỏng vấn:** ${metrics.totalInterviewScheduled} buổi
- **Đã Pass phỏng vấn / Đi làm:** ${metrics.onboardedCount} nhân sự

⚠️ **Cảnh báo tiến độ:** Hiện có **${urgent} hồ sơ** đang chờ phản hồi >48h cần xử lý ngay!`;
    }

    if (q.includes('gấp') || q.includes('nghẽn') || q.includes('chờ') || q.includes('urgent')) {
      const urgentList = metrics.urgentCandidates.slice(0, 5);
      if (urgentList.length === 0) {
        return `✅ **Tuyệt vời!** Hiện tại không có hồ sơ nào bị tồn đọng quá 48h. Tất cả tiến độ đều đạt KPI.`;
      }

      let text = `⚡ **DANH SÁCH ${urgentList.length} HỒ SƠ CẦN XỬ LÝ GẤP:**\n\n`;
      urgentList.forEach((c, idx) => {
        text += `${idx + 1}. **${c.name}** - ${c.positionCompany} (Mã CTV: ${c.ctvCode})\n   • Trạng thái: ${c.cvResultRaw || 'Chờ duyệt CV'}\n`;
      });
      text += `\n👉 *Khuyên dùng:* Hãy gửi nhắc nhở CTV hoặc phản hồi cho Khách hàng ngay hôm nay.`;
      return text;
    }

    if (q.includes('zalo') || q.includes('telegram') || q.includes('gửi khách') || q.includes('connect')) {
      return `💬 **BÁO CÁO MẪU GỬI KHÁCH HÀNG / CTV (CONNECT ZALO & TELEGRAM)**

[BÁO CÁO TIẾN ĐỘ TUYỂN DỤNG - FASTHUNT RECO]
🏢 Đối tác Khách hàng & CTV
📅 Cập nhật ngày: ${new Date().toLocaleDateString('vi-VN')}

1. Tiến độ chung:
- Hồ sơ đã tiếp nhận: ${candidates.length} UV
- Pass CV duyệt phỏng vấn: ${metrics.cvPass} UV
- Pass Phỏng vấn / Nhận việc: ${metrics.onboardedCount} UV

2. Link portal theo dõi trực tiếp:
🔗 Link Google Sheet Portal: ${sheet2ViewUrl || 'https://docs.google.com/spreadsheets/d/1QxicFfdrkDL_vsUv9uZPwSl1Osi0c06h4xDEBrU6p2Y/edit'}
🔗 Link Google Sheet Jobs: ${jobSheetUrl}

*(Copy nội dung trên để gửi ngay qua Zalo hoặc bấm nút "Gửi Telegram" bên dưới)*`;
    }

    return `🤖 **FastHunt AI:** Tôi đã ghi nhận câu hỏi "${query}". 
Hiện tại hệ thống đã tổng hợp **${candidates.length} hồ sơ** ứng viên với **${metrics.cvPass} CV Pass**.
Bạn có thể thử các lệnh gợi ý bên dưới để xem phân tích chi tiết!`;
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponseText = generateAiAnalysis(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* ── 1. Floating Action Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-18 md:bottom-5 right-4 sm:right-5 z-40 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold text-xs sm:text-sm cursor-pointer border border-blue-400/40 group"
      >
        <div className="relative">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
        </div>
        <span>FastHunt AI Bot</span>
      </button>

      {/* ── 2. AI Chatbot Drawer Modal ── */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          
          {/* Top Header */}
          <div className="p-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <span>FastHunt AI Assistant</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/25 font-bold uppercase">v2.5</span>
                </h3>
                <p className="text-[10px] text-white/80 font-medium">Phân tích tiến độ & Dispatch Zalo/Telegram</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Cấu hình Telegram / Channels"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Telegram Settings Panel */}
          {showConfig && (
            <form onSubmit={handleSaveConfig} className="p-3.5 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-white">
                <span>🤖 Cấu Hình Kết Nối Telegram Bot</span>
                {configSaved && <span className="text-emerald-600 font-bold">✓ Đã lưu</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Telegram Bot Token</label>
                <input
                  type="text"
                  value={telegramConfig.botToken}
                  onChange={(e) => setTelegramConfig({ ...telegramConfig, botToken: e.target.value })}
                  placeholder="Ví dụ: 123456789:ABCdef..."
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Telegram Chat ID / Group ID</label>
                <input
                  type="text"
                  value={telegramConfig.chatId}
                  onChange={(e) => setTelegramConfig({ ...telegramConfig, chatId: e.target.value })}
                  placeholder="Ví dụ: -100123456789"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-2xs cursor-pointer"
                >
                  Lưu cấu hình
                </button>
              </div>
            </form>
          )}

          {/* Quick Action Chips */}
          <div className="p-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            <button
              onClick={() => handleSendMessage('Phân tích tiến độ tuyển dụng')}
              className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-red-50 text-slate-700 dark:text-slate-200 rounded-full text-[11px] font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              <BarChart2 className="w-3 h-3 text-red-600" />
              <span>Phân tích tiến độ</span>
            </button>
            <button
              onClick={() => handleSendMessage('Hồ sơ cần xử lý gấp')}
              className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-red-50 text-slate-700 dark:text-slate-200 rounded-full text-[11px] font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Hồ sơ gấp</span>
            </button>
            <button
              onClick={() => handleSendMessage('Soạn báo cáo gửi Zalo Telegram')}
              className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-red-50 text-slate-700 dark:text-slate-200 rounded-full text-[11px] font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              <Share2 className="w-3 h-3 text-blue-500" />
              <span>Báo cáo Zalo/Telegram</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 scrollbar-thin bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed space-y-2 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white font-medium rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Actions for Bot Messages */}
                  {msg.sender === 'bot' && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px]">
                      <button
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-red-600 font-bold transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Đã copy!' : 'Copy nội dung'}</span>
                      </button>

                      <button
                        onClick={() => handleSendToTelegram(msg.text)}
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                      >
                        <SendHorizontal className="w-3 h-3" />
                        <span>Gửi Telegram</span>
                      </button>

                      <a
                        href={`https://zalo.me`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-bold"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Mở Zalo</span>
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl w-24 text-slate-400 text-xs shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                <span>AI đang viết...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Hỏi AI về tiến độ, hồ sơ gấp, hoặc soạn báo cáo..."
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl cursor-pointer transition-all shadow-2xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
