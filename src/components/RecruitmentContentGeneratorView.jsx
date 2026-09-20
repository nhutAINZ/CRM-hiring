import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Share2,
  Send,
  MessageSquare,
  Smartphone,
  Flame,
  CheckCircle2,
  FileText,
  Sliders,
  UserCheck,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  EyeOff,
  Eye,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom Social SVG Icons
const FacebookIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export default function RecruitmentContentGeneratorView({
  jobItems = [],
  selectedJobContext = null,
  onNavigateToGroupFinder
}) {
  // Preselect job if passed via context
  const [selectedJobId, setSelectedJobId] = useState(() => {
    return selectedJobContext?.id || (jobItems[0]?.id || 'custom');
  });

  const [channel, setChannel] = useState('facebook'); // facebook | linkedin | zalo | threads
  const [tone, setTone] = useState('hot'); // hot | professional | urgent | genz
  const [ctvCode, setCtvCode] = useState(() => localStorage.getItem('fasthunt_ctv_code') || 'CTV_01');
  const [contactPhone, setContactPhone] = useState(() => localStorage.getItem('fasthunt_ctv_phone') || '');
  const [contactZalo, setContactZalo] = useState(() => localStorage.getItem('fasthunt_ctv_zalo') || '');
  
  // 🔒 Feature: Bỏ tên doanh nghiệp (Chế độ Headhunter / CTV bảo mật tránh ứng viên bypass)
  const [hideCompanyName, setHideCompanyName] = useState(() => {
    const stored = localStorage.getItem('fasthunt_hide_company');
    return stored !== null ? stored === 'true' : true; // Mặc định TRUE: Bỏ tên doanh nghiệp
  });

  const [copied, setCopied] = useState(false);
  const [variationIndex, setVariationIndex] = useState(0);

  // Custom job fields if 'custom' selected
  const [customJob, setCustomJob] = useState({
    title: 'Nhân Viên Kinh Doanh B2B',
    company: 'Tập đoàn Công nghệ & Thương mại',
    location: 'Hà Nội',
    salary: '12.000.000đ - 25.000.000đ/tháng',
    bonus: '2.000.000đ',
    requirements: `- Tốt nghiệp Cao đẳng/Đại học\n- Có kinh nghiệm 6 tháng trở lên\n- Giao tiếp nhanh nhẹn, ham học hỏi`,
    warrantyPeriod: '30 ngày'
  });

  // Keep local storage synced
  useEffect(() => {
    if (ctvCode) localStorage.setItem('fasthunt_ctv_code', ctvCode);
    if (contactPhone) localStorage.setItem('fasthunt_ctv_phone', contactPhone);
    if (contactZalo) localStorage.setItem('fasthunt_ctv_zalo', contactZalo);
    localStorage.setItem('fasthunt_hide_company', hideCompanyName ? 'true' : 'false');
  }, [ctvCode, contactPhone, contactZalo, hideCompanyName]);

  // Update selected job when context changes
  useEffect(() => {
    if (selectedJobContext?.id) {
      setSelectedJobId(selectedJobContext.id);
    }
  }, [selectedJobContext]);

  // Resolve active job object
  const currentJob = useMemo(() => {
    if (selectedJobId === 'custom') return customJob;
    const found = jobItems.find((j) => j.id === selectedJobId);
    return found || customJob;
  }, [selectedJobId, jobItems, customJob]);

  // Content Generation Logic
  const generatedContent = useMemo(() => {
    const title = currentJob.title || 'Vị trí Tuyển Dụng';
    const rawCompany = currentJob.company || 'Doanh nghiệp đối tác';
    // When hideCompanyName is true, do not reveal the real company name
    const company = hideCompanyName ? '' : rawCompany;
    const location = currentJob.location || 'Hà Nội / Toàn quốc';
    const salary = currentJob.salary || 'Lương thỏa thuận hấp dẫn';
    const requirements = currentJob.requirements || '- Năng động, có tinh thần trách nhiệm\n- Trao đổi cụ thể khi phỏng vấn';
    const ctvFootnote = ctvCode ? ` (Mã giới thiệu CTV: ${ctvCode})` : '';
    const phoneInfo = contactPhone || contactZalo || '09xx.xxx.xxx';

    if (channel === 'facebook') {
      if (tone === 'urgent') {
        const companyHook = hideCompanyName
          ? `⚡ CƠ HỘI ĐI LÀM NGAY THÁNG NÀY: ${title.toUpperCase()} ⚡\n💵 Thu nhập: ${salary}\n📍 Địa điểm: ${location}`
          : `⚡ CƠ HỘI ĐI LÀM NGAY THÁNG NÀY: ${title.toUpperCase()} ⚡\n🏢 Công ty: ${company}\n💵 Thu nhập: ${salary}`;

        const hooks = [
          `🔥 [TUYỂN GẤP ĐI LÀM NGAY] - ${title.toUpperCase()} 🔥\n📍 Địa điểm: ${location}\n💰 Thu nhập: ${salary}`,
          `🚨 CẦN GẤP ỨNG VIÊN PHỎNG VẤN TRONG TUẦN - ${title.toUpperCase()} 🚨\n👉 Nhận việc ngay, không chờ đợi lâu!\n💵 Thu nhập: ${salary}`,
          companyHook
        ];
        const chosenHook = hooks[variationIndex % hooks.length];
        return `${chosenHook}

🎯 QUYỀN LỢI & ĐÃI NGỘ:
- Mức thu nhập: ${salary} (Lương cứng + Thưởng KPI rõ ràng)
- Đóng BHXH, BHYT đầy đủ theo quy định nhà nước
- Thưởng các dịp Lễ, Tết, lương tháng 13 + Du lịch hàng năm
- Môi trường làm việc năng động, lộ trình thăng tiến minh bạch

📌 YÊU CẦU CÔNG VIỆC:
${requirements}

📩 CÁCH THỨC ỨNG TUYỂN:
- Gửi CV trực tiếp qua Zalo/Inbox: ${phoneInfo}${ctvFootnote}
- Hoặc để lại [Comment/Chấm "."] bên dưới, mình sẽ inbox gửi JD chi tiết ngay nhé!

#tuyendung #vieclam #${location.toLowerCase().replace(/\s+/g, '')} #job #hiring #${title.toLowerCase().replace(/\s+/g, '')}`;
      } else if (tone === 'hot') {
        const hotHook1 = hideCompanyName
          ? `💎 VIỆC XỊN LƯƠNG CAO — GIA NHẬP DOANH NGHIỆP HÀNG ĐẦU 💎\n🚀 Vị trí: ${title.toUpperCase()}\n💸 Thu nhập: ${salary}`
          : `💎 VIỆC XỊN LƯƠNG CAO — GIA NHẬP ĐỘI NGŨ ${company.toUpperCase()} 💎\n🚀 Vị trí: ${title.toUpperCase()}\n💸 Thu nhập: ${salary}`;

        const hooks = [
          hotHook1,
          `✨ TÌM KIẾM ĐỒNG ĐỘI TÀI NĂNG: ${title.toUpperCase()} ✨\n🔥 Chế độ đãi ngộ top đầu ngành: ${salary}`,
          `🌟 BẬT CHẾ ĐỘ "SĂN JOB": ${title.toUpperCase()} — THU NHẬP LÊN TỚI ${salary} 🌟`
        ];
        const chosenHook = hooks[variationIndex % hooks.length];

        const companySection = hideCompanyName ? '' : `\n🏢 Doanh nghiệp: ${company}`;

        return `${chosenHook}

📍 Địa điểm làm việc: ${location}${companySection}

✨ VÌ SAO BẠN NÊN ỨNG TUYỂN NGAY?
✅ Thu nhập cực cạnh tranh: ${salary}
✅ Môi trường chuyên nghiệp, đồng nghiệp nhiệt tình hỗ trợ
✅ Cơ hội học hỏi & phát triển chuyên môn vượt bậc
✅ Đầy đủ chế độ phúc lợi, thưởng dự án & quà sinh nhật

📋 YÊU CẦU ỨNG VIÊN:
${requirements}

📩 Ứng tuyển nhanh:
- Nhắn tin qua Zalo/SĐT: ${phoneInfo}${ctvFootnote}
- Hoặc cmt/inbox nhận JD đầy đủ trong 5 phút!

#tuyendung #tuyendung${location.toLowerCase().replace(/\s+/g, '')} #vieclamhot #cohoivieclam #career`;
      } else if (tone === 'genz') {
        return `👋 Alo alo, team mình đang tìm 1 bạn ${title} siêu chất về chung một nhà đâyyy!

✨ Về với team bạn được gì?
🌱 Thu nhập xịn xò: ${salary}
🌱 Đồng nghiệp siêu đáng iu, sếp tâm lý, không drama
🌱 Trà sữa, bánh ngọt liên hoan không thiếu ngày nào
🌱 Học hỏi cực nhiều kinh nghiệm thực chiến

📍 Địa bàn hoạt động: ${location}
📌 Chỉ cần bạn:
${requirements}

Gửi gắm CV ngay qua Zalo ${phoneInfo}${ctvFootnote} hoặc inbox trực tiếp cho mình để nhận JD full HD không che nha! 🚀

#vieclamgenz #tuyendung #genz #jobhunting #teamwork`;
      } else {
        // Professional
        const companyHeader = hideCompanyName ? '' : `Doanh nghiệp: ${company}\n`;
        return `THÔNG BÁO TUYỂN DỤNG: ${title.toUpperCase()}
${companyHeader}Địa điểm công tác: ${location}
Mức thu nhập: ${salary}

I. MÔ TẢ & QUYỀN LỢI:
- Thu nhập cạnh tranh theo năng lực: ${salary}
- Đầy đủ chế độ bảo hiểm, phép năm và phúc lợi doanh nghiệp
- Môi trường làm việc chuyên nghiệp, văn minh, đánh giá công bằng
- Lộ trình phát triển và cơ hội thăng tiến rõ ràng

II. TIÊU CHUẨN TUYỂN CHỌN:
${requirements}

III. PHƯƠNG THỨC LIÊN HỆ & NỘP HỒ SƠ:
Ứng viên quan tâm vui lòng gửi hồ sơ/CV về:
- Hotline/Zalo tuyển dụng: ${phoneInfo}${ctvFootnote}
- Bộ phận nhân sự sẽ liên hệ phỏng vấn trong vòng 24-48 giờ làm việc.

Trân trọng!`;
      }
    } else if (channel === 'linkedin') {
      const linkedinHiringTitle = hideCompanyName
        ? `We are hiring: ${title} (Confidential Opportunity) 🚀`
        : `We are hiring: ${title} at ${company} 🚀`;

      const linkedinTeamDesc = hideCompanyName
        ? `We are actively seeking an ambitious and talented ${title} to join our client's growing enterprise team. If you are looking for an environment where your impact is recognized and your skills are nurtured, this role is for you!`
        : `We are actively seeking an ambitious and talented ${title} to join our growing team at ${company}. If you are looking for an environment where your impact is recognized and your skills are nurtured, this role is for you!`;

      return `${linkedinHiringTitle}

📍 Location: ${location}
💰 Compensation: ${salary}

About the Opportunity:
${linkedinTeamDesc}

Key Requirements:
${requirements}

What We Offer:
• Competitive package: ${salary}
• Professional, innovative, and transparent work environment
• Comprehensive healthcare & standard statutory benefits
• Clear career progression roadmap

👉 How to Apply:
Please connect or reach out directly via LinkedIn message, or contact our recruitment partner at:
📱 Phone/Zalo: ${phoneInfo}${ctvFootnote}

#Hiring #JobOpening #Recruitment #${title.replace(/\s+/g, '')} #VietnamJobs #CareerOpportunity`;
    } else if (channel === 'zalo') {
      const zaloCompany = hideCompanyName ? '' : `\n🏢 Doanh nghiệp: ${company}`;
      return `[TUYỂN DỤNG] ${title.toUpperCase()} - ${location}${zaloCompany}
💵 Thu nhập: ${salary}

📌 Quyền lợi:
- Lương thưởng minh bạch, thanh toán đúng hạn
- Đầy đủ BHXH + phụ cấp, du lịch, thưởng Lễ Tết
- Môi trường trẻ, hỗ trợ nhiệt tình

📌 Yêu cầu:
${requirements}

👉 Bạn nào hoặc người quen quan tâm nhắn Zalo mình: ${phoneInfo}${ctvFootnote} để nhận JD chi tiết và hẹn lịch phỏng vấn nhé!`;
    } else {
      // Threads / TikTok
      return `Bắt quả tang một job ${title} lương ${salary} tại ${location} đang mở tuyển gấp nè mọi người ơi! 🫣

Không yêu cầu quá gắt, môi trường siêu dễ thở, sếp bao tâm lý.
Ai đang tìm việc hoặc bạn bè đang thất nghiệp thì tag gấp vô đây nha! Hoặc nhắn qua Zalo ${phoneInfo}${ctvFootnote} mình gửi JD liền tay ✨

#tuyendung #vieclam #timviec #cohoinghenghiep`;
    }
  }, [currentJob, channel, tone, ctvCode, contactPhone, contactZalo, hideCompanyName, variationIndex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (e) {}
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextVariation = () => {
    setVariationIndex((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-blue-200/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Recruitment Content Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Trợ Lý Tạo Bài Đăng Tuyển Dụng Đa Kênh
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chọn vị trí, chọn kênh mạng xã hội, tạo bài viết giật tít thu hút ứng viên chỉ trong 1 click
          </p>
        </div>

        <button
          onClick={() => onNavigateToGroupFinder && onNavigateToGroupFinder(currentJob)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold text-xs sm:text-sm border border-indigo-200/60 dark:border-indigo-800/40 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Share2 className="w-4 h-4 text-indigo-500" />
          <span>Tìm Group đăng bài cho Job này</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 🛠️ LEFT COLUMN: CONTROLS & SETTINGS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Chọn Job */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>1. Chọn Vị Trí Cần Đăng Tin</span>
              </label>
            </div>

            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <optgroup label="📋 Các Job đang tuyển từ Google Sheet">
                {jobItems.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.company} ({j.salary})
                  </option>
                ))}
              </optgroup>
              <optgroup label="✏️ Tự nhập tùy biến">
                <option value="custom">+ Tự nhập thông tin công việc khác</option>
              </optgroup>
            </select>

            {/* Custom job input fields if custom is selected */}
            {selectedJobId === 'custom' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Tên vị trí:</label>
                  <input
                    type="text"
                    value={customJob.title}
                    onChange={(e) => setCustomJob({ ...customJob, title: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Mức lương:</label>
                    <input
                      type="text"
                      value={customJob.salary}
                      onChange={(e) => setCustomJob({ ...customJob, salary: e.target.value })}
                      className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Địa điểm:</label>
                    <input
                      type="text"
                      value={customJob.location}
                      onChange={(e) => setCustomJob({ ...customJob, location: e.target.value })}
                      className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 🔒 TOGGLE: BỎ TÊN DOANH NGHIỆP (HEADHUNTER CONFIDENTIAL MODE) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              hideCompanyName
                ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                    hideCompanyName
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {hideCompanyName ? <ShieldCheck className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Bỏ tên doanh nghiệp</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        hideCompanyName
                          ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {hideCompanyName ? '🔒 Bảo mật CTV' : 'Hiển thị'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {hideCompanyName
                        ? 'Tên công ty được giấu kín để tránh ứng viên nộp thẳng, bảo đảm 100% hoa hồng CTV.'
                        : 'Đang hiển thị tên công ty thực tế trong nội dung bài đăng.'}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                  <input
                    type="checkbox"
                    checked={hideCompanyName}
                    onChange={(e) => setHideCompanyName(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>

            {/* Job Summary Banner */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Doanh nghiệp:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  {hideCompanyName ? (
                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Đã bỏ tên trong bài đăng (Bảo mật)</span>
                    </span>
                  ) : (
                    <span>{currentJob.company}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Địa điểm:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentJob.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mức lương:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{currentJob.salary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hoa hồng CTV:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentJob.bonus || 'Thỏa thuận'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Chọn Kênh Đăng Tin */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>2. Kênh Mạng Xã Hội</span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setChannel('facebook')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  channel === 'facebook'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                <FacebookIcon className="w-4 h-4" />
                <span>Facebook Group</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('linkedin')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  channel === 'linkedin'
                    ? 'bg-sky-700 text-white border-sky-700 shadow-md shadow-sky-600/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-300'
                }`}
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn Recruiter</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('zalo')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  channel === 'zalo'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Zalo Post / Group</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('threads')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  channel === 'threads'
                    ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Threads / TikTok</span>
              </button>
            </div>
          </div>

          {/* Card 3: Chọn Phong Cách / Tone Giọng */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-600" />
              <span>3. Phong Cách Bài Viết (Tone Giọng)</span>
            </label>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'hot', label: '🔥 Lương cao & Hấp dẫn', desc: 'Nhấn mạnh thu nhập' },
                { id: 'urgent', label: '⚡ Tuyển gấp & Đi làm ngay', desc: 'Tạo tính cấp bách' },
                { id: 'genz', label: '🌱 Thân thiện & Gen Z', desc: 'Văn phong trẻ trung' },
                { id: 'professional', label: '💼 Chuyên nghiệp & Chuẩn mực', desc: 'Phù hợp cấp quản lý' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    tone === t.id
                      ? 'bg-violet-50 dark:bg-violet-950/50 border-violet-500 text-violet-700 dark:text-violet-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold">{t.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Card 4: Thông tin cá nhân hóa CTV */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <label className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>4. Thông Tin Người Giới Thiệu (CTV)</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 dark:text-slate-400">Mã CTV của bạn:</label>
                <input
                  type="text"
                  value={ctvCode}
                  onChange={(e) => setCtvCode(e.target.value)}
                  placeholder="Ví dụ: CTV_NAM01"
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="text-slate-500 dark:text-slate-400">Số Zalo / Hotline:</label>
                <input
                  type="text"
                  value={contactZalo}
                  onChange={(e) => setContactZalo(e.target.value)}
                  placeholder="0988.xxx.xxx"
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 📱 RIGHT COLUMN: LIVE PREVIEW & 1-CLICK COPY (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Top Preview Bar */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
                  Xem Trước Bài Đăng ({channel.toUpperCase()})
                </span>
                {hideCompanyName && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200/50">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Đã ẩn tên DN</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextVariation}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  title="Tạo biến thể câu chữ khác"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đổi bản mẫu ({variationIndex + 1})</span>
                </button>

                <button
                  onClick={handleCopy}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép Nội Dung'}</span>
                </button>
              </div>
            </div>

            {/* Simulated Post Surface */}
            <div className="p-6 flex-1 bg-white dark:bg-slate-900 overflow-y-auto max-h-[600px]">
              {/* Header simulation */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  FH
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>FastHunt Recruitment Partner</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Vừa xong • Đăng công khai 🌐
                  </div>
                </div>
              </div>

              {/* Formatted Text Content */}
              <div className="whitespace-pre-line text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans select-all p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                {generatedContent}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                💡 <span className="font-semibold">Mẹo:</span> {hideCompanyName ? 'Bài đăng đã ẩn tên doanh nghiệp giúp CTV giữ độc quyền ứng viên.' : 'Bạn có thể bật toggle "Bỏ tên doanh nghiệp" nếu không muốn để lộ tên khách hàng.'}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Đã Copy Xong!' : 'Copy Toàn Bộ Bài Viết'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
