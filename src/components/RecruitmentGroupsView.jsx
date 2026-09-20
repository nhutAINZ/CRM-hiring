import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  ExternalLink,
  Share2,
  MessageSquare,
  Sparkles,
  MapPin,
  CheckCircle2,
  Flame,
  Award,
  Clock,
  ShieldAlert,
  Zap,
  BookmarkCheck,
  ChevronRight,
  TrendingUp,
  Globe,
  Radio
} from 'lucide-react';

import {
  getFacebookGroupSearchUrl,
  getLinkedinGroupSearchUrl
} from '../utils/recruitmentSearchUrls';

const QUICK_FB_KEYWORDS = [
  'Tuyển dụng IT Hà Nội',
  'Việc làm Developer NodeJS ReactJS Java',
  'Tuyển dụng Sales B2B Hà Nội',
  'Tư vấn tuyển sinh giáo dục',
  'Vận hành sàn TMĐT Shopee TikTok',
  'Việc làm Marketing truyền thông',
  'Việc làm sinh viên Hà Nội part-time',
  'Cộng tác viên tuyển dụng Headhunter',
  'Việc làm KCN Bắc Ninh Bắc Giang'
];

const RECRUITMENT_GROUPS_DATA = [
  // 💻 IT & PHẦN MỀM
  {
    id: 'grp_it_1',
    name: 'Cộng Đồng IT Việc Làm - Tuyển Dụng Developer Hà Nội',
    platform: 'facebook',
    category: 'it',
    location: 'Hà Nội',
    members: '280.000+',
    activity: 'Cực cao (30+ bài/ngày)',
    searchQuery: 'tuyển dụng IT developer Hà Nội',
    url: getFacebookGroupSearchUrl('tuyển dụng IT developer Hà Nội'),
    recommendedFor: ['it', 'technical', 'developer', 'tester', 'product owner', 'ba'],
    badge: 'Group Top 1 IT'
  },
  {
    id: 'grp_it_2',
    name: 'Việc Làm IT - Lập Trình Viên Toàn Quốc (NodeJS, ReactJS, Java, Python)',
    platform: 'facebook',
    category: 'it',
    location: 'Toàn quốc',
    members: '350.000+',
    activity: 'Rất cao (50+ bài/ngày)',
    searchQuery: 'việc làm IT lập trình viên toàn quốc',
    url: getFacebookGroupSearchUrl('việc làm IT lập trình viên toàn quốc'),
    recommendedFor: ['it', 'developer', 'frontend', 'backend', 'fullstack'],
    badge: 'Tương tác khủng'
  },
  {
    id: 'grp_it_3',
    name: 'Business Analyst (BA) Vietnam - Tuyển Dụng & Chia Sẻ Nghề Nghiệp',
    platform: 'facebook',
    category: 'it',
    location: 'Toàn quốc',
    members: '120.000+',
    activity: 'Chất lượng cao',
    searchQuery: 'Business Analyst BA Vietnam tuyển dụng',
    url: getFacebookGroupSearchUrl('Business Analyst BA Vietnam tuyển dụng'),
    recommendedFor: ['technical', 'business analyst', 'ba', 'product owner'],
    badge: 'Đúng đối tượng BA'
  },
  {
    id: 'grp_it_4',
    name: 'Vietnam IT Professionals & Tech Recruiters (LinkedIn Group)',
    platform: 'linkedin',
    category: 'it',
    location: 'Toàn quốc',
    members: '65.000+',
    activity: 'Chuyên nghiệp',
    searchQuery: 'Vietnam IT recruitment recruiter',
    url: getLinkedinGroupSearchUrl('Vietnam IT recruitment recruiter'),
    recommendedFor: ['it', 'senior', 'product owner', 'middle - senior'],
    badge: 'Ứng viên Senior'
  },
  {
    id: 'grp_it_5',
    name: 'Cộng Đồng ERP / SAP / Odoo / CRM Developers & Consultants VN',
    platform: 'facebook',
    category: 'it',
    location: 'Toàn quốc',
    members: '45.000+',
    activity: 'Đặc thù ERP',
    searchQuery: 'ERP SAP Odoo CRM tuyển dụng',
    url: getFacebookGroupSearchUrl('ERP SAP Odoo CRM tuyển dụng'),
    recommendedFor: ['sales erp', 'erp product owner', 'technical', 'gts'],
    badge: 'Chuyên ngành ERP'
  },

  // 💼 SALES & KINH DOANH
  {
    id: 'grp_sale_1',
    name: 'Hội Tuyển Dụng Nhân Viên Kinh Doanh - Sales Hà Nội',
    platform: 'facebook',
    category: 'sales',
    location: 'Hà Nội',
    members: '420.000+',
    activity: 'Sôi nổi hàng ngày',
    searchQuery: 'tuyển dụng nhân viên kinh doanh sales Hà Nội',
    url: getFacebookGroupSearchUrl('tuyển dụng nhân viên kinh doanh sales Hà Nội'),
    recommendedFor: ['sale', 'tư vấn tuyển sinh', 'sales erp b2b', 'kinh doanh'],
    badge: 'Ứng viên đông đảo'
  },
  {
    id: 'grp_sale_2',
    name: 'Tuyển Dụng Sales B2B & Quản Lý Kinh Doanh Toàn Quốc',
    platform: 'facebook',
    category: 'sales',
    location: 'Toàn quốc',
    members: '190.000+',
    activity: 'Chất lượng B2B',
    searchQuery: 'tuyển dụng sales B2B quản lý kinh doanh',
    url: getFacebookGroupSearchUrl('tuyển dụng sales B2B quản lý kinh doanh'),
    recommendedFor: ['sales erp b2b', 'sale tổng hợp', 'b2b'],
    badge: 'Phù hợp B2B'
  },
  {
    id: 'grp_sale_3',
    name: 'Cộng Đồng Tuyển Sinh & Tư Vấn Giáo Dục / Du Học VN',
    platform: 'facebook',
    category: 'sales',
    location: 'Hà Nội',
    members: '85.000+',
    activity: 'Chuyên biệt giáo dục',
    searchQuery: 'tuyển dụng tư vấn tuyển sinh giáo dục du học',
    url: getFacebookGroupSearchUrl('tuyển dụng tư vấn tuyển sinh giáo dục du học'),
    recommendedFor: ['tư vấn tuyển sinh', 'nesa', 'sale tổng hợp'],
    badge: 'Tư vấn tuyển sinh'
  },
  {
    id: 'grp_sale_4',
    name: 'Zalo Community: Kết Nối Tuyển Dụng Sales & CTV Toàn Quốc',
    platform: 'zalo',
    category: 'sales',
    location: 'Toàn quốc',
    members: '1.000+ (Max room)',
    activity: 'Phản hồi tức thì',
    searchQuery: 'zalo tuyển dụng',
    url: 'https://zalo.me',
    recommendedFor: ['sale', 'ctv', 'tuyển gấp'],
    badge: 'Chốt CV trong ngày'
  },

  // 📣 MARKETING & THƯƠNG MẠI ĐIỆN TỬ
  {
    id: 'grp_mkt_1',
    name: 'Cộng Đồng Vận Hành Sàn TMĐT Shopee - TikTok Shop - Lazada VN',
    platform: 'facebook',
    category: 'marketing',
    location: 'Toàn quốc',
    members: '310.000+',
    activity: 'Rất sôi động',
    searchQuery: 'vận hành sàn thương mại điện tử shopee tiktok',
    url: getFacebookGroupSearchUrl('vận hành sàn thương mại điện tử shopee tiktok'),
    recommendedFor: ['vận hành sàn thương mại điện tử', 'marketing', 'ultimate sup'],
    badge: 'Chuẩn ngành TMĐT'
  },
  {
    id: 'grp_mkt_2',
    name: 'Việc Làm Marketing & Truyền Thông Hà Nội (Content, Ads, SEO)',
    platform: 'facebook',
    category: 'marketing',
    location: 'Hà Nội',
    members: '260.000+',
    activity: 'Tuyển dụng liên tục',
    searchQuery: 'việc làm marketing truyền thông Hà Nội',
    url: getFacebookGroupSearchUrl('việc làm marketing truyền thông Hà Nội'),
    recommendedFor: ['marketing', 'vận hành sàn', 'truyền thông'],
    badge: 'Nhiều Marketer trẻ'
  },
  {
    id: 'grp_mkt_3',
    name: 'Hội Gen Z Làm E-Commerce & Livestream Creator',
    platform: 'facebook',
    category: 'marketing',
    location: 'Hà Nội',
    members: '175.000+',
    activity: 'Gen Z năng động',
    searchQuery: 'tuyển dụng Gen Z e-commerce livestream',
    url: getFacebookGroupSearchUrl('tuyển dụng Gen Z e-commerce livestream'),
    recommendedFor: ['marketing', 'thương mại điện tử'],
    badge: 'Độ tuổi 20-26'
  },

  // 🎓 SINH VIÊN, FRESHER & THỰC TẬP SINH
  {
    id: 'grp_student_1',
    name: 'Việc Làm Sinh Viên Hà Nội - Tìm Việc Part-time & Full-time Mới Tốt Nghiệp',
    platform: 'facebook',
    category: 'student',
    location: 'Hà Nội',
    members: '520.000+',
    activity: 'Khủng nhất Hà Nội',
    searchQuery: 'việc làm sinh viên Hà Nội part time full time',
    url: getFacebookGroupSearchUrl('việc làm sinh viên Hà Nội part time full time'),
    recommendedFor: ['tư vấn tuyển sinh', 'sale', 'fresher', 'thực tập'],
    badge: 'Lượng truy cập lớn nhất'
  },
  {
    id: 'grp_student_2',
    name: 'Cộng Đồng Sinh Viên Kinh Tế & Ngoại Thương Tìm Việc',
    platform: 'facebook',
    category: 'student',
    location: 'Hà Nội',
    members: '190.000+',
    activity: 'Ứng viên chất lượng',
    searchQuery: 'sinh viên kinh tế ngoại thương tìm việc',
    url: getFacebookGroupSearchUrl('sinh viên kinh tế ngoại thương tìm việc'),
    recommendedFor: ['vận hành sàn', 'kinh tế', 'tiếng anh'],
    badge: 'Ngoại ngữ tốt'
  },

  // 🤝 HEADHUNTER & CỘNG TÁC VIÊN TUYỂN DỤNG
  {
    id: 'grp_hr_1',
    name: 'Mạng Lưới Cộng Tác Viên Tuyển Dụng & Headhunter Việt Nam',
    platform: 'facebook',
    category: 'hr',
    location: 'Toàn quốc',
    members: '145.000+',
    activity: 'Chia sẻ chia hoa hồng',
    searchQuery: 'cộng tác viên tuyển dụng CTV headhunter',
    url: getFacebookGroupSearchUrl('cộng tác viên tuyển dụng CTV headhunter'),
    recommendedFor: ['tất cả', 'ctv', 'bounty'],
    badge: 'Tìm CTV cùng chạy'
  },
  {
    id: 'grp_hr_2',
    name: 'Vietnam HR & Recruitment Community (LinkedIn)',
    platform: 'linkedin',
    category: 'hr',
    location: 'Toàn quốc',
    members: '88.000+',
    activity: 'Chuyên gia nhân sự',
    searchQuery: 'Vietnam HR Recruitment network',
    url: getLinkedinGroupSearchUrl('Vietnam HR Recruitment network'),
    recommendedFor: ['quản lý', 'senior', 'headhunter'],
    badge: 'HR Manager & Lead'
  },

  // 🏭 KHU CÔNG NGHIỆP & LAO ĐỘNG KỸ THUẬT
  {
    id: 'grp_factory_1',
    name: 'Việc Làm KCN Bắc Ninh - Bắc Giang - Hải Phòng - Vĩnh Phúc',
    platform: 'facebook',
    category: 'factory',
    location: 'Miền Bắc',
    members: '380.000+',
    activity: 'Nhanh chóng',
    searchQuery: 'việc làm khu công nghiệp Bắc Ninh Bắc Giang Hải Phòng',
    url: getFacebookGroupSearchUrl('việc làm khu công nghiệp Bắc Ninh Bắc Giang Hải Phòng'),
    recommendedFor: ['kỹ thuật', 'sản xuất', 'nhà máy'],
    badge: 'Khối nhà máy KCN'
  }
];

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

export default function RecruitmentGroupsView({
  jobItems = [],
  selectedJobContext = null,
  onNavigateToContentGen
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [targetJobId, setTargetJobId] = useState(() => selectedJobContext?.id || 'ALL');
  const [customFbQuery, setCustomFbQuery] = useState('');

  // Filter logic
  const filteredGroups = useMemo(() => {
    let targetJob = null;
    if (targetJobId !== 'ALL') {
      targetJob = jobItems.find((j) => j.id === targetJobId);
    }

    return RECRUITMENT_GROUPS_DATA.filter((group) => {
      // 1. Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = group.name.toLowerCase().includes(q);
        const matchCat = group.category.toLowerCase().includes(q);
        const matchLoc = group.location.toLowerCase().includes(q);
        const matchQuery = (group.searchQuery || '').toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchLoc && !matchQuery) return false;
      }

      // 2. Platform
      if (selectedPlatform !== 'ALL' && group.platform !== selectedPlatform) {
        return false;
      }

      // 3. Category
      if (selectedCategory !== 'ALL' && group.category !== selectedCategory) {
        return false;
      }

      // 4. Location
      if (selectedLocation !== 'ALL') {
        if (selectedLocation === 'Hà Nội' && !group.location.includes('Hà Nội') && !group.location.includes('Toàn quốc')) return false;
        if (selectedLocation === 'TP.HCM' && !group.location.includes('TP.HCM') && !group.location.includes('Toàn quốc')) return false;
        if (selectedLocation === 'Toàn quốc' && !group.location.includes('Toàn quốc')) return false;
      }

      // 5. Job context filter (if chosen)
      if (targetJob) {
        const jobTitle = (targetJob.title || '').toLowerCase();
        const jobInd = (targetJob.industry || '').toLowerCase();
        const isMatched = group.recommendedFor.some((tag) => {
          return jobTitle.includes(tag) || jobInd.includes(tag);
        });
        return isMatched || group.category === 'hr' || group.category === 'student';
      }

      return true;
    });
  }, [searchTerm, selectedPlatform, selectedCategory, selectedLocation, targetJobId, jobItems]);

  const targetJobObj = useMemo(() => {
    if (targetJobId === 'ALL') return null;
    return jobItems.find((j) => j.id === targetJobId);
  }, [targetJobId, jobItems]);

  const handleOpenLiveFbSearch = (queryOverride) => {
    const defaultTerm = targetJobObj
      ? `tuyển dụng ${targetJobObj.title} ${targetJobObj.location}`
      : 'tuyển dụng việc làm';
    const finalQuery = (typeof queryOverride === 'string' && queryOverride.trim())
      ? queryOverride.trim()
      : (customFbQuery.trim() || defaultTerm);

    const url = getFacebookGroupSearchUrl(finalQuery);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200/50">
            <Share2 className="w-3.5 h-3.5" />
            <span>Recruitment Channels & Groups Finder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Danh Bạ Kênh Tuyển Dụng & Group Đăng Tin
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Truy cập trực tiếp danh sách hàng trăm Group tuyển dụng Facebook & LinkedIn uy tín, không bao giờ bị lỗi link riêng tư
          </p>
        </div>

        {/* Target Job Quick Select */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-sm">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gợi ý Group theo Job cụ thể:</span>
          </label>
          <select
            value={targetJobId}
            onChange={(e) => setTargetJobId(e.target.value)}
            className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">🌐 Tất cả các ngành nghề & hội nhóm</option>
            {jobItems.map((j) => (
              <option key={j.id} value={j.id}>
                🎯 Gợi ý cho: {j.title} ({j.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🚀 LIVE FACEBOOK GROUP SEARCH TOOL */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider mb-2 border border-white/20">
              <FacebookIcon className="w-3.5 h-3.5 text-blue-200" />
              <span>Live Facebook Group Finder • Truy cập danh sách trực tiếp</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Tìm Kiếm Danh Sách Group Đang Mở Trên Facebook
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1 leading-relaxed">
              Mở trực tiếp trang tìm kiếm Group của Facebook để xem toàn bộ danh sách hội nhóm công khai, kiểm tra số lượng thành viên thực tế và ấn <strong>Tham gia</strong> ngay lập tức.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={customFbQuery}
              onChange={(e) => setCustomFbQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOpenLiveFbSearch();
              }}
              placeholder="Nhập từ khóa tìm nhóm Facebook (VD: việc làm IT Hà Nội, tuyển dụng sales, việc làm sinh viên)..."
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-2xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-300 shadow-inner placeholder:text-slate-400"
            />
          </div>
          <button
            type="button"
            onClick={() => handleOpenLiveFbSearch()}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <FacebookIcon className="w-4 h-4 text-blue-900" />
            <span>Mở Danh Sách Trên Facebook</span>
            <ExternalLink className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        {/* Quick keywords */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-blue-100">
          <span className="font-semibold text-[11px] text-blue-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Gợi ý từ khóa tìm nhanh:
          </span>
          {QUICK_FB_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => {
                setCustomFbQuery(kw);
                handleOpenLiveFbSearch(kw);
              }}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer border border-white/15 backdrop-blur-xs flex items-center gap-1"
            >
              <span>{kw}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </button>
          ))}
        </div>
      </div>

      {/* Target Job Notice if selected */}
      {targetJobObj && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Đang lọc nhóm phù hợp cho:</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {targetJobObj.title} — {targetJobObj.company} ({targetJobObj.location})
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenLiveFbSearch(`tuyển dụng ${targetJobObj.title} ${targetJobObj.location}`)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-blue-200" />
              <span>Tìm Group Facebook cho Job này</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateToContentGen && onNavigateToContentGen(targetJobObj)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tạo bài đăng cho job này</span>
            </button>

            <button
              type="button"
              onClick={() => setTargetJobId('ALL')}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Hủy lọc
            </button>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Lọc danh bạ theo tên group, từ khóa nghề nghiệp (IT, BA, Sales, Marketing, KCN, Sinh viên...)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1">Nền tảng:</span>
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'facebook', label: 'Facebook Groups' },
            { id: 'zalo', label: 'Zalo' },
            { id: 'linkedin', label: 'LinkedIn' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                selectedPlatform === p.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1">Ngành:</span>
          {[
            { id: 'ALL', label: 'Tất cả ngành' },
            { id: 'it', label: 'IT & Phần mềm' },
            { id: 'sales', label: 'Sales & Kinh doanh' },
            { id: 'marketing', label: 'Marketing & TMĐT' },
            { id: 'student', label: 'Sinh viên & Fresher' },
            { id: 'hr', label: 'Headhunter & HR' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGroups.map((group) => {
          return (
            <div
              key={group.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    {group.platform === 'facebook' && (
                      <span className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        <FacebookIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {group.platform === 'linkedin' && (
                      <span className="p-1 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                        <LinkedinIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {group.platform === 'zalo' && (
                      <span className="p-1 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                      {group.platform}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50">
                    {group.badge}
                  </span>
                </div>

                {/* Group Title */}
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {group.name}
                </h3>

                {/* Info Stats */}
                <div className="mt-3 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Quy mô thành viên:</span>
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200">{group.members}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mức độ hoạt động:</span>
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{group.activity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Địa bàn:</span>
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{group.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <a
                  href={group.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs group-hover:bg-blue-700 cursor-pointer"
                >
                  {group.platform === 'facebook' && <FacebookIcon className="w-3.5 h-3.5 text-blue-200" />}
                  {group.platform === 'linkedin' && <LinkedinIcon className="w-3.5 h-3.5 text-sky-200" />}
                  {group.platform === 'zalo' && <MessageSquare className="w-3.5 h-3.5 text-cyan-200" />}
                  <span>
                    {group.platform === 'facebook'
                      ? 'Mở Danh Sách Group Trên Facebook'
                      : group.platform === 'linkedin'
                      ? 'Tìm Nhóm Trên LinkedIn'
                      : 'Mở Kênh Zalo Tuyển Dụng'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {group.platform === 'facebook' && (
                  <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Mở danh sách nhóm công khai & tham gia ngay</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 📚 RECRUITER POSTING HANDBOOK / TIPS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Cẩm Nang Đăng Bài Tuyển Dụng Hiệu Quả Cho CTV
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bí quyết để bài đăng nhiều lượt tương tác, tránh bị Facebook bóp reach hoặc admin group từ chối
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
              <span>Khung Giờ Vàng Đăng Bài</span>
            </div>
            <p className="leading-relaxed">
              <strong>• Sáng (09:00 - 10:30):</strong> Ứng viên bắt đầu ngày làm việc và lướt group tìm cơ hội mới.<br />
              <strong>• Chiều (14:30 - 15:30):</strong> Khung giờ thư giãn giải lao giữa ca.<br />
              <strong>• Tối (20:00 - 21:30):</strong> Lượng người dùng online cao nhất trong ngày.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Tránh Bị Khóa Bài & Spam</span>
            </div>
            <p className="leading-relaxed">
              • Không để link ngoài (Google form, web) trực tiếp trong bài; hãy để dưới comment đầu tiên.<br />
              • Mỗi bài cách nhau tối thiểu 15-20 phút giữa các nhóm để tránh bị Facebook quét spam.<br />
              • Đăng kèm 1 ảnh JD rõ ràng hoặc ảnh môi trường làm việc để tăng 300% tương tác.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4" />
              <span>Chốt Ứng Viên Nhanh</span>
            </div>
            <p className="leading-relaxed">
              • Khi ứng viên comment "." hoặc quan tâm, hãy reply ngay trong 5 phút.<br />
              • Chủ động inbox xin CV hoặc gửi Zalo của bạn để trao đổi trực tiếp.<br />
              • Nhắc ứng viên ghi <strong>Mã CTV</strong> của bạn để hệ thống ghi nhận hoa hồng chính xác.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
