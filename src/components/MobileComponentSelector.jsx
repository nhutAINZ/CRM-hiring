// ====================================================================
// FASTHUNT RECRUITMENT AGENT - MOBILE COMPONENT SELECTOR MODAL / SHEET
// Touch-First Visual Module & Component Navigation Hub for Mobile
// ====================================================================

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Users,
  Briefcase,
  MessageCircle,
  Building,
  LayoutDashboard,
  Kanban,
  AlertTriangle,
  BarChart3,
  Bot,
  Settings,
  FileText,
  Gift,
  Download,
  Bell,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function MobileComponentSelector({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  candidateCount = 0,
  urgentCount = 0,
  jobCount = 0,
  onOpenSettings,
  onOpenTemplates,
  onExportCsv,
  onOpenUpdates,
  onOpenAiBot,
  jobSheetUrl
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Comprehensive list of all app modules & components
  const componentSections = useMemo(() => [
    {
      title: 'Tuyển Dụng & Hồ Sơ',
      badge: 'Core Workflow',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      items: [
        {
          id: 'table',
          title: 'Quản Lý Ứng Viên',
          subtitle: 'Danh sách hồ sơ, lọc nâng cao, chế độ Thẻ & Bảng',
          icon: Users,
          iconColor: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200 dark:border-blue-800/60',
          stat: candidateCount > 0 ? `${candidateCount} hồ sơ` : '0 hồ sơ',
          statColor: 'text-blue-600 font-bold',
          type: 'view'
        },
        {
          id: 'jobs',
          title: 'Bảng Tin & Link Jobs',
          subtitle: 'Khám phá Jobs Hot, xem JD, gán ứng viên vào Job',
          icon: Briefcase,
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
          borderColor: 'border-indigo-200 dark:border-indigo-800/60',
          stat: jobCount > 0 ? `${jobCount} Jobs đang tuyển` : 'Hot Jobs',
          statColor: 'text-indigo-600 font-bold',
          type: 'view'
        },
        {
          id: 'kanban',
          title: 'Kanban Pipeline',
          subtitle: 'Quy trình 5 giai đoạn từ Ứng tuyển đến Nhận việc',
          icon: Kanban,
          iconColor: 'text-cyan-600 dark:text-cyan-400',
          bgColor: 'bg-cyan-50 dark:bg-cyan-950/50',
          borderColor: 'border-cyan-200 dark:border-cyan-800/60',
          stat: '5 Cột Pipeline',
          statColor: 'text-cyan-600 font-bold',
          type: 'view'
        },
        {
          id: 'urgent',
          title: 'Hồ Sơ Cần Xử Lý Gấp',
          subtitle: 'Ứng viên sắp phỏng vấn hoặc chờ duyệt kết quả gấp',
          icon: AlertTriangle,
          iconColor: 'text-rose-600 dark:text-rose-400',
          bgColor: 'bg-rose-50 dark:bg-rose-950/50',
          borderColor: 'border-rose-200 dark:border-rose-800/60',
          stat: urgentCount > 0 ? `${urgentCount} việc gấp` : '0 việc gấp',
          statColor: urgentCount > 0 ? 'text-rose-600 font-black animate-pulse' : 'text-slate-400',
          type: 'view'
        }
      ]
    },
    {
      title: 'Đối Tác & Khách Hàng',
      badge: 'CRM Network',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      items: [
        {
          id: 'clients',
          title: 'Khách Hàng & Doanh Nghiệp',
          subtitle: 'Bảng đối tác Intergreat & nhu cầu tuyển dụng',
          icon: Building,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
          borderColor: 'border-emerald-200 dark:border-emerald-800/60',
          stat: 'Intergreat CRM',
          statColor: 'text-emerald-600 font-bold',
          type: 'view'
        },
        {
          id: 'ctv',
          title: 'Quản Lý Mã CTV & Thưởng',
          subtitle: 'Bảng tính hoa hồng, mã CTV, thưởng giới thiệu',
          icon: Gift,
          iconColor: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-950/50',
          borderColor: 'border-amber-200 dark:border-amber-800/60',
          stat: 'Mã CTV & Bonus',
          statColor: 'text-amber-600 font-bold',
          type: 'view'
        }
      ]
    },
    {
      title: 'Trợ Lý & Tự Động Hóa',
      badge: 'AI & Automation',
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
      items: [
        {
          id: 'zalo',
          title: 'Trợ Lý Zalo Cá Nhân',
          subtitle: 'Gửi tin Zalo hàng loạt, phân tích CV, nhắc lịch PV',
          icon: MessageCircle,
          iconColor: 'text-sky-600 dark:text-sky-400',
          bgColor: 'bg-sky-50 dark:bg-sky-950/50',
          borderColor: 'border-sky-200 dark:border-sky-800/60',
          stat: 'Nick Thường Miễn Phí',
          statColor: 'text-sky-600 font-bold',
          type: 'view'
        },
        {
          id: 'action-ai',
          title: 'Trợ Lý AI FastHunt Bot',
          subtitle: 'Chatbot AI hỏi đáp số liệu, gợi ý ứng viên phù hợp',
          icon: Bot,
          iconColor: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-950/50',
          borderColor: 'border-purple-200 dark:border-purple-800/60',
          stat: 'Smart AI Agent',
          statColor: 'text-purple-600 font-bold',
          type: 'action',
          action: () => {
            if (onOpenAiBot) onOpenAiBot();
          }
        },
        {
          id: 'action-templates',
          title: 'Mẫu Thư Tuyển Dụng & Email',
          subtitle: 'Thư mời phỏng vấn, Offer Letter, Thư cảm ơn',
          icon: FileText,
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
          borderColor: 'border-indigo-200 dark:border-indigo-800/60',
          stat: 'Template Engine',
          statColor: 'text-indigo-600 font-bold',
          type: 'action',
          action: () => {
            if (onOpenTemplates) onOpenTemplates();
          }
        },
        {
          id: 'action-export',
          title: 'Xuất Dữ Liệu Excel / CSV',
          subtitle: 'Tải nhanh file danh sách ứng viên chuẩn UTF-8',
          icon: Download,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
          borderColor: 'border-emerald-200 dark:border-emerald-800/60',
          stat: 'Xuất 1 Chạm',
          statColor: 'text-emerald-600 font-bold',
          type: 'action',
          action: () => {
            if (onExportCsv) onExportCsv();
          }
        }
      ]
    },
    {
      title: 'Báo Cáo & Quản Trị Hệ Thống',
      badge: 'Admin & Analytics',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard Tổng Quan',
          subtitle: 'Chỉ số KPI, tỷ lệ chuyển đổi, top CTV xuất sắc',
          icon: LayoutDashboard,
          iconColor: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200 dark:border-blue-800/60',
          stat: 'Executive KPIs',
          statColor: 'text-blue-600 font-bold',
          type: 'view'
        },
        {
          id: 'analytics',
          title: 'Báo Cáo & Phân Tích Chuyên Sâu',
          subtitle: 'Biểu đồ trực quan, phân bố vị trí, nguồn tuyển dụng',
          icon: BarChart3,
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
          borderColor: 'border-indigo-200 dark:border-indigo-800/60',
          stat: 'Biểu đồ & Chart',
          statColor: 'text-indigo-600 font-bold',
          type: 'view'
        },
        {
          id: 'action-settings',
          title: 'Cấu Hình Google Sheet',
          subtitle: 'Đổi Sheet ID 1, Sheet 2, Job Sheet, CTV Sheet',
          icon: Settings,
          iconColor: 'text-slate-600 dark:text-slate-400',
          bgColor: 'bg-slate-100 dark:bg-slate-800/70',
          borderColor: 'border-slate-200 dark:border-slate-700',
          stat: 'Cài Đặt Kết Nối',
          statColor: 'text-slate-600 dark:text-slate-400 font-bold',
          type: 'action',
          action: () => {
            if (onOpenSettings) onOpenSettings();
          }
        },
        {
          id: 'action-updates',
          title: 'Lịch Sử Cập Nhật Mới',
          subtitle: 'Xem các tính năng vừa phát hành và ghi chú phiên bản',
          icon: Bell,
          iconColor: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200 dark:border-blue-800/60',
          stat: 'Version 2.5',
          statColor: 'text-blue-600 font-bold',
          type: 'action',
          action: () => {
            if (onOpenUpdates) onOpenUpdates();
          }
        }
      ]
    }
  ], [
    candidateCount,
    urgentCount,
    jobCount,
    onOpenSettings,
    onOpenTemplates,
    onExportCsv,
    onOpenUpdates,
    onOpenAiBot
  ]);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return componentSections;
    const q = searchQuery.toLowerCase().trim();

    return componentSections.map((sec) => {
      const matchedItems = sec.items.filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        );
      });
      return { ...sec, items: matchedItems };
    }).filter((sec) => sec.items.length > 0);
  }, [componentSections, searchQuery]);

  if (!isOpen) return null;

  const handleSelectItem = (item) => {
    if (item.type === 'view') {
      setActiveView(item.id);
      onClose();
    } else if (item.type === 'action' && item.action) {
      item.action();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full sm:max-w-2xl max-h-[88vh] sm:max-h-[85vh] bg-white dark:bg-[#0c1222] border border-slate-200/90 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
      >
        {/* ── Modal Header with Drag Handle & Search Bar ── */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          {/* Mobile Handle indicator */}
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3 sm:hidden" />

          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Bộ Chọn Thành Phần FastHunt
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Chuyển nhanh giữa các chức năng & công cụ di động
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm chức năng (ví dụ: Zalo, Kanban, CV, CTV, Job...)"
              className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Component Grid Content Area ── */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-5 scrollbar-thin">
          {filteredSections.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Không tìm thấy thành phần nào khớp với "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold"
              >
                Xóa tìm kiếm
              </button>
            </div>
          ) : (
            filteredSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-2.5">
                {/* Section Header */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {section.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${section.badgeColor}`}>
                    {section.badge}
                  </span>
                </div>

                {/* Section Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeView === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-400 dark:border-blue-600 shadow-md shadow-blue-500/10'
                            : 'bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200/90 dark:border-slate-800 shadow-xs'
                        }`}
                      >
                        {/* Icon Box */}
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.bgColor} ${item.borderColor} border shadow-2xs group-hover:scale-105 transition-transform`}
                        >
                          <Icon className={`w-5 h-5 ${item.iconColor}`} />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className={`text-xs font-extrabold truncate ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                              {item.title}
                            </h3>
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            ) : (
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                            {item.subtitle}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <span className={`text-[10px] ${item.statColor}`}>
                              {item.stat}
                            </span>
                            {item.type === 'action' && (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                Thao tác
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer Quick Links ── */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between gap-2">
          {jobSheetUrl && (
            <a
              href={jobSheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Mở Google Sheet Job</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
