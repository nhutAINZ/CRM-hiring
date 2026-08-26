import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Gift,
  Phone,
  Mail,
  Award,
  Link,
  Sparkles,
  ChevronRight,
  Filter,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CTV_SHEET_URL } from '../services/sheetsService';
import { twoPointerFilter } from '../utils/dataNormalizer';

export default function CtvManagementView({
  ctvItems = [],
  candidates = [],
  ctvSheetUrl = CTV_SHEET_URL,
  onFilterByCtv
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Combine fetched CTV sheet items with candidates dataset to compute live stats
  const combinedCtvList = useMemo(() => {
    // Map candidate count per CTV code
    const candidateStatsMap = new Map();
    candidates.forEach((c) => {
      if (c.ctvCode) {
        const code = c.ctvCode.trim();
        if (!candidateStatsMap.has(code)) {
          candidateStatsMap.set(code, { total: 0, passCv: 0, onboarded: 0 });
        }
        const stat = candidateStatsMap.get(code);
        stat.total++;
        if (c.cvResultRaw && c.cvResultRaw.toUpperCase().includes('PASS')) stat.passCv++;
        if (c.onboardingDate) stat.onboarded++;
      }
    });

    if (ctvItems.length > 0) {
      return ctvItems.map((item) => {
        const code = item.ctvCode || 'N/A';
        const stats = candidateStatsMap.get(code) || { total: 0, passCv: 0, onboarded: 0 };
        return { ...item, stats };
      });
    }

    // Fallback: build from candidates list if sheet fetch is pending
    const listFromCandidates = Array.from(candidateStatsMap.keys()).map((code, idx) => ({
      id: `ctv_fb_${idx}`,
      ctvCode: code,
      name: `CTV (${code})`,
      email: 'Chưa cập nhật',
      bankAccount: 'Chưa cập nhật',
      bankName: 'N/A',
      phoneZalo: '',
      stats: candidateStatsMap.get(code)
    }));

    return listFromCandidates;
  }, [ctvItems, candidates]);

  // Filtered CTVs using twoPointerFilter O(N/2) dual pointer scanning
  const filteredCtvs = useMemo(() => {
    if (!searchTerm) return combinedCtvList;
    const q = searchTerm.toLowerCase().trim();
    return twoPointerFilter(combinedCtvList, (ctv) => {
      const matchCode = ctv.ctvCode && ctv.ctvCode.toLowerCase().includes(q);
      const matchName = ctv.name && ctv.name.toLowerCase().includes(q);
      const matchEmail = ctv.email && ctv.email.toLowerCase().includes(q);
      const matchPhone = ctv.phoneZalo && ctv.phoneZalo.toLowerCase().includes(q);
      return matchCode || matchName || matchEmail || matchPhone;
    });
  }, [combinedCtvList, searchTerm]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ctvSheetUrl);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    setCopiedId('sheet_link');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyCtvInfo = (ctv) => {
    const text = `[THÔNG TIN CTV - ${ctv.ctvCode}]
Họ tên: ${ctv.name}
Mã CTV: ${ctv.ctvCode}
Email: ${ctv.email || 'N/A'}
Ngân hàng: ${ctv.bankName || 'N/A'} - STK: ${ctv.bankAccount || 'N/A'}
Tổng CV đã nộp: ${ctv.stats.total} hồ sơ`;

    navigator.clipboard.writeText(text);
    setCopiedId(`copy_${ctv.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ── 1. Top Header Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 rounded-3xl p-6 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white/20 text-white uppercase tracking-wider backdrop-blur-md">
                Hệ Thống CTV & Bonus
              </span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Quản Lý Mã CTV & Hỗ Trợ Hoa Hồng
            </h1>
            <p className="text-xs sm:text-sm font-medium text-white/90 max-w-2xl">
              Kết nối trực tiếp với Bảng Google Sheet Đăng Ký Mã CTV chính thức. Tra cứu tài khoản nhận bonus, quản lý danh sách CTV tuyển dụng.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-extrabold backdrop-blur-md transition-all cursor-pointer"
            >
              {copiedId === 'sheet_link' ? <Check className="w-4 h-4 text-yellow-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'sheet_link' ? 'Đã Copy!' : 'Copy Link Bảng'}</span>
            </button>

            <a
              href={ctvSheetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Link className="w-4 h-4" />
              <span>Mở Bảng Sheet Mã CTV</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/80 uppercase">Tổng số CTV Đăng ký</p>
              <p className="text-xl font-extrabold">{combinedCtvList.length} Cộng tác viên</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl text-white">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/80 uppercase">Đã cấp Mã CTV</p>
              <p className="text-xl font-extrabold">{combinedCtvList.filter(c => c.ctvCode).length} Mã Active</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="p-2 bg-white/20 rounded-xl text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/80 uppercase">Hồ Sơ Do CTV Nộp</p>
              <p className="text-xl font-extrabold">{candidates.length} Hồ sơ</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Search & Tool Bar ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Mã CTV, Họ tên, Email, Ngân hàng..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <a
            href={ctvSheetUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Link Google Sheet Gốc (gid=497830992)</span>
          </a>
        </div>
      </div>

      {/* ── 3. CTV Data Table Grid ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[12px]">
                <th className="py-3.5 px-4 whitespace-nowrap">Mã CTV</th>
                <th className="py-3.5 px-4">Họ & Tên CTV</th>
                <th className="py-3.5 px-4">Email Liên Hệ</th>
                <th className="py-3.5 px-4">Số Zalo / SĐT</th>
                <th className="py-3.5 px-4 min-w-[200px]">Tài Khoản Ngân Hàng (Bonus)</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Số CV Đã Nộp</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Hiệu Suất</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
              {filteredCtvs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-red-500" />
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-200">
                      Không tìm thấy CTV nào khớp với từ khóa "{searchTerm}"
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCtvs.map((ctv, idx) => {
                  const copyKey = `copy_${ctv.id}`;
                  const isCopied = copiedId === copyKey;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Mã CTV */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200/80 dark:border-red-800/50">
                          {ctv.ctvCode || 'Mã chưa cấp'}
                        </span>
                      </td>

                      {/* Họ & Tên CTV */}
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {ctv.name || 'Cộng tác viên'}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {ctv.email || 'Chưa cập nhật'}
                      </td>

                      {/* Zalo / SĐT */}
                      <td className="py-3 px-4 font-mono text-xs">
                        {ctv.phoneZalo ? (
                          <a
                            href={`https://zalo.me/${ctv.phoneZalo}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-bold"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>{ctv.phoneZalo}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>

                      {/* Ngân hàng */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <div>
                            <span className="font-bold">{ctv.bankName || 'Ngân hàng'}</span>
                            {ctv.bankAccount && <span className="font-mono text-slate-500 ml-1">({ctv.bankAccount})</span>}
                          </div>
                        </div>
                      </td>

                      {/* Số CV */}
                      <td className="py-3 px-4 text-center font-extrabold text-sm text-slate-900 dark:text-white">
                        {ctv.stats ? ctv.stats.total : 0} CV
                      </td>

                      {/* Hiệu suất */}
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {ctv.stats ? ctv.stats.passCv : 0} Pass CV
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyCtvInfo(ctv)}
                            className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Copy thông tin CTV"
                          >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => onFilterByCtv(ctv.ctvCode)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                          >
                            <span>Xem UV</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
