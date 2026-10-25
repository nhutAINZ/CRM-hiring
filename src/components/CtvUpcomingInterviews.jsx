import React from 'react';
import {
  Calendar,
  Clock,
  Building,
  Phone,
  MessageCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function CtvUpcomingInterviews({
  upcomingInterviews = [],
  onOpenCandidateDetail
}) {
  if (upcomingInterviews.length === 0) return null;

  const handleRemindZalo = (candidate) => {
    const rawPhone = (candidate.phone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '84' + rawPhone.slice(1) : rawPhone;
    const msg = encodeURIComponent(
      `Chào ${candidate.name}, mình là CTV phụ trách hồ sơ của bạn tại FastHunt. Xin nhắc bạn lịch phỏng vấn sắp tới cho vị trí "${candidate.position || 'công việc'}" tại ${candidate.company || 'Doanh nghiệp đối tác'}. Bạn nhớ chuẩn bị chu đáo trang phục, đường truyền và tự tin nhé! Chúc bạn đạt kết quả thật tốt! Cần hỗ trợ gì cứ nhắn mình nha.`
    );
    window.open(`https://zalo.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Lịch Phỏng Vấn Sắp Diễn Ra Của Ứng Viên Tôi
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
                {upcomingInterviews.length} ứng viên
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chủ động nhắn tin nhắc hẹn, dặn dò ứng viên để nâng cao tỷ lệ tham gia và trúng tuyển
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 w-fit">
          Ưu tiên chăm sóc hôm nay
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingInterviews.map((c) => {
          const rawPhone = (c.phone || '').trim();

          return (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-blue-400/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{c.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Chờ PV
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{c.position || 'Vị trí ứng tuyển'}</p>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.company || 'Doanh nghiệp đối tác'}</span>
                  </div>
                  {c.interviewDate && (
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Lịch: {c.interviewDate}</span>
                    </div>
                  )}
                  {c.pvResultRaw && !c.interviewDate && (
                    <div className="text-[11px] text-blue-500 font-medium">
                      Trạng thái: {c.pvResultRaw}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                {rawPhone ? (
                  <button
                    onClick={() => handleRemindZalo(c)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title={`Nhắn Zalo tới số ${rawPhone}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Nhắc Lịch Zalo</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Chưa có số ĐT</span>
                )}

                {onOpenCandidateDetail && (
                  <button
                    onClick={() => onOpenCandidateDetail(c)}
                    className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Xem chi tiết hồ sơ"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
