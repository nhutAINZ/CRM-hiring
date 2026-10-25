import React, { useState, useMemo } from 'react';
import {
  Share2,
  Copy,
  Check,
  Link,
  MessageSquare,
  Sparkles,
  Users,
  ShieldCheck,
  Zap,
  Send,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CtvReferralKit({ activeCtvCode, currentCtv }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState(null);

  const effectiveCode = (activeCtvCode || currentCtv?.ctvCode || 'CTV01').trim().toUpperCase();

  const referralUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin || 'https://crmhiring.netlify.app';
      return `${origin}/?ref=${encodeURIComponent(effectiveCode)}#ctv-dashboard`;
    }
    return `https://crmhiring.netlify.app/?ref=${effectiveCode}#ctv-dashboard`;
  }, [effectiveCode]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const templates = [
    {
      id: 1,
      title: 'Mẫu 1: Đăng Nhóm Zalo / Facebook Tìm Ứng Viên Nhanh',
      desc: 'Phù hợp đăng lên các hội nhóm việc làm, tuyển dụng IT, Sale, Marketing',
      text: `🔥 [CƠ HỘI NGHỀ NGHIỆP LƯƠNG TỐT - ĐỐI TÁC FASTHUNT TUYỂN DỤNG] 🔥
Doanh nghiệp đối tác đang mở tuyển gấp nhiều vị trí (IT, Kinh doanh, Marketing, Vận hành...).
💵 Mức lương hấp dẫn: 12.000.000₫ – 45.000.000₫ + Đãi ngộ cao.
👉 Xem chi tiết JD và nộp hồ sơ trực tiếp duyệt trong 24h tại:
🔗 ${referralUrl}
(Mã hỗ trợ ứng viên: ${effectiveCode})`
    },
    {
      id: 2,
      title: 'Mẫu 2: Nhắn Tin 1-1 Cho Bạn Bè / Ứng Viên Tiềm Năng',
      desc: 'Giọng điệu thân thiện, tự nhiên khi gửi qua Zalo/Messenger cá nhân',
      text: `Chào bạn, mình thấy bên mạng lưới tuyển dụng FastHunt đang có nhiều việc làm rất phù hợp với chuyên môn của bạn, đãi ngộ tốt và phỏng vấn nhanh.
Bạn xem thử danh sách các công việc đang mở tuyển ở đây nhé:
👉 ${referralUrl}
Nếu thấy vị trí nào ưng ý, bạn nộp CV trực tiếp hoặc gửi mình hỗ trợ kết nối ưu tiên sơ vấn nhé!`
    },
    {
      id: 3,
      title: 'Mẫu 3: Mời Bạn Bè Tham Gia Làm CTV Kiếm Hoa Hồng',
      desc: 'Chia sẻ cơ hội hợp tác CTV tuyển dụng nhận hoa hồng tới 30% lương',
      text: `⚡ Hợp tác tuyển dụng cùng FastHunt - Kiếm hoa hồng 5.000.000₫ – 20.000.000₫/tháng!
Chỉ cần giới thiệu bạn bè, người quen tìm việc:
- Hoa hồng tới 30% lương onboard hoặc thưởng nóng 2.500.000₫/CV
- Chi trả minh bạch ngày 10 & 25 hàng tháng
- Nộp CV và theo dõi kết quả phỏng vấn realtime trên web
👉 Bấm vào link để kích hoạt mã CTV và bắt đầu ngay:
🔗 ${referralUrl}`
    }
  ];

  const handleCopyTemplate = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateIdx(idx);
    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
    } catch (e) {}
    setTimeout(() => setCopiedTemplateIdx(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Bộ Công Cụ Tiếp Thị CTV & Link Tiếp Thị Cá Nhân
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chia sẻ link có gắn sẵn mã CTV của bạn để hệ thống tự động ghim hoa hồng không bao giờ sót
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-800/40 w-fit">
          <ShieldCheck className="w-4 h-4" />
          <span>Bảo lưu mã CTV tự động qua Cookie & LocalStorage</span>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-slate-50 dark:from-slate-850 dark:via-slate-850 dark:to-blue-950/40 border border-blue-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-white">Link Tiếp Thị Tuyển Dụng Cá Nhân Của Bạn:</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono font-extrabold text-[11px]">
              Mã: {effectiveCode}
            </span>
          </div>
          <span className="text-slate-500 text-[11px] hidden sm:inline">1 Click Copy & Chia Sẻ</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs overflow-hidden">
            <Link className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate select-all">{referralUrl}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0 ${
              copiedLink
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã Sao Chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao Chép Link Của Tôi</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          💡 Khi ứng viên mở link trên, form nộp CV và popup đăng ký sẽ <strong>tự động điền mã {effectiveCode}</strong> của bạn. Bất kể khi nào ứng viên này trúng tuyển, hoa hồng đều được tính cho bạn.
        </p>
      </div>

      {/* 3 Copyable Templates */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Mẫu Tin Tuyển Dụng Soạn Sẵn (Tự Động Gắn Link Của Bạn)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((tpl, idx) => (
            <div
              key={tpl.id}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-blue-400/50 transition-colors"
            >
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{tpl.title}</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">{tpl.desc}</p>
                <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 font-mono whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed select-all">
                  {tpl.text}
                </div>
              </div>

              <button
                onClick={() => handleCopyTemplate(tpl.text, idx)}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  copiedTemplateIdx === idx
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs'
                }`}
              >
                {copiedTemplateIdx === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã Copy Mẫu Này!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>Copy Mẫu Tin Nhắn</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
