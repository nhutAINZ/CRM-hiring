import React, { useMemo } from 'react';
import {
  Briefcase,
  Flame,
  DollarSign,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
  Search,
  FileText,
  Clock,
  Building,
  MapPin,
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CtvDashboardView({
  jobItems = [],
  onNavigateToJobs,
  onNavigateToContentGen,
  onNavigateToGroupFinder,
  onOpenJobDetail
}) {
  // Filter active jobs
  const activeJobs = useMemo(() => {
    return jobItems.filter((job) => {
      const st = (job.status || '').toLowerCase();
      // Any job that is not paused or closed
      return !st.includes('đóng') && !st.includes('tạm dừng') && !st.includes('close');
    });
  }, [jobItems]);

  // Urgent or New jobs
  const urgentOrNewJobs = useMemo(() => {
    return activeJobs.filter((job) => {
      const st = (job.status || '').toLowerCase();
      return st.includes('gấp') || st.includes('mới') || st.includes('lại');
    });
  }, [activeJobs]);

  // High bonus jobs
  const highBonusJobs = useMemo(() => {
    return activeJobs.slice(0, 6);
  }, [activeJobs]);

  // Group by industry
  const industryDistribution = useMemo(() => {
    const counts = {};
    activeJobs.forEach((j) => {
      const ind = j.industry || 'Khác';
      counts[ind] = (counts[ind] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [activeJobs]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 🌟 1. HERO BANNER FOR COLLABORATORS */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 text-white p-6 sm:p-8 md:p-10 shadow-2xl shadow-blue-900/20">
        {/* Background glow effects */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-64 h-64 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100 uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Cổng Thông Tin & Cơ Hội Thu Nhập CTV</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Giới Thiệu Ứng Viên — <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-sky-200">
              Nhận Hoa Hồng Liền Tay
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
            Hàng chục việc làm tuyển dụng gấp với mức thưởng hấp dẫn từ <strong className="text-amber-300 font-bold">1.200.000đ - 30% lương</strong>. Tận dụng các công cụ tạo nội dung thông minh và danh bạ group tuyển dụng để tiếp cận ứng viên hiệu quả nhất!
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={() => {
                triggerCelebration();
                if (onNavigateToJobs) onNavigateToJobs();
              }}
              className="px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-lg shadow-blue-950/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Xem {activeJobs.length} Job Đang Tuyển</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onNavigateToContentGen && onNavigateToContentGen()}
              className="px-5 py-3 rounded-2xl bg-blue-600/40 hover:bg-blue-600/60 backdrop-blur-md border border-white/20 text-white font-semibold text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Tạo Bài Tuyển Dụng Ngay</span>
            </button>
            <button
              onClick={() => onNavigateToGroupFinder && onNavigateToGroupFinder()}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-sky-300" />
              <span>Tìm Group Đăng Tin</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 2. CTV KEY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Việc làm đang mở</span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{activeJobs.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">vị trí</span>
          </div>
          <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sẵn sàng nhận CV ngay</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tuyển gấp / Thưởng nóng</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{urgentOrNewJobs.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">job hot</span>
          </div>
          <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ưu tiên đẩy mạnh tuần này</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hoa hồng tối đa</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">30%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">lương onboard</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hoặc tới 2.500.000₫/ứng viên
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ngành nghề đa dạng</span>
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{industryDistribution.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">nhóm ngành</span>
          </div>
          <p className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
            IT, Sales, MKT, E-Commerce...
          </p>
        </div>
      </div>

      {/* 🚀 3. 3-STEP GUIDE FOR COLLABORATORS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Quy Trình 3 Bước Hợp Tác Kiếm Hoa Hồng
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Đơn giản, minh bạch và nhận tiền hoa hồng chuyển khoản ngay sau khi ứng viên hoàn tất thử việc
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-800/40 w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Cam kết bảo mật & quyền lợi CTV</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Chọn Job Phù Hợp</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Duyệt danh sách các việc làm đang mở tại tab <strong>"Việc Làm Đang Tuyển"</strong>. Lựa chọn các vị trí phù hợp với bạn bè, mạng lưới hoặc thế mạnh của bạn.
            </p>
          </div>

          <div className="relative p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Đăng Tin & Nhận CV</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Dùng công cụ <strong>"Gen Content Tuyển Dụng"</strong> để tạo bài đăng hấp dẫn và <strong>"Tìm Group Đăng Tin"</strong> để chia sẻ lên các nhóm Facebook/Zalo đông ứng viên.
            </p>
          </div>

          <div className="relative p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Nhận Thưởng Hoa Hồng</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Gửi CV cho bộ phận tuyển dụng. Khi ứng viên qua phỏng vấn và nhận việc (onboard) vượt qua bảo hành, bạn nhận ngay tiền hoa hồng chuyển khoản 100%!
            </p>
          </div>
        </div>
      </div>

      {/* 🔥 4. TOP JOBS TUYỂN GẤP & HOA HỒNG CAO */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Việc Làm Tuyển Gấp & Hoa Hồng Cao Tuần Này
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Những vị trí đang cần gấp ứng viên với mức thưởng hấp dẫn nhất
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToJobs && onNavigateToJobs()}
            className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả ({activeJobs.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highBonusJobs.map((job) => {
            const isUrgent = (job.status || '').toLowerCase().includes('gấp');
            return (
              <div
                key={job.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {job.industry || 'Ngành nghề'}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isUrgent
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/60'
                      }`}
                    >
                      {isUrgent && <Flame className="w-3 h-3 text-rose-500" />}
                      <span>{job.status || 'Đang tuyển'}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenJobDetail && onOpenJobDetail(job)}
                    className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer"
                  >
                    {job.title}
                  </h3>

                  {/* Company & Location */}
                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.company || 'Doanh nghiệp đối tác'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.location || 'Toàn quốc'}</span>
                    </div>
                  </div>

                  {/* Salary & Bonus Box */}
                  <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/40">
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Mức lương: </span>
                      <strong className="text-slate-800 dark:text-slate-200">{job.salary || 'Thỏa thuận'}</strong>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs pt-1 border-t border-blue-100/80 dark:border-blue-900/30">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Hoa hồng CTV:</span>
                      </span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        {job.bonus || 'Thỏa thuận'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToContentGen && onNavigateToContentGen(job)}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Gen Bài Đăng</span>
                  </button>
                  <button
                    onClick={() => onNavigateToGroupFinder && onNavigateToGroupFinder(job)}
                    className="py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Tìm Group phù hợp cho job này"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Group</span>
                  </button>
                  <button
                    onClick={() => onOpenJobDetail && onOpenJobDetail(job)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Xem chi tiết JD"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🏷️ 5. INDUSTRIES DISTRIBUTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Khám Phá Theo Nhóm Ngành Tuyển Dụng
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {industryDistribution.map(([ind, count]) => (
            <button
              key={ind}
              onClick={() => onNavigateToJobs && onNavigateToJobs(ind)}
              className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{ind}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
