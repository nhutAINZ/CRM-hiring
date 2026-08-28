// ====================================================================
// FASTHUNT / RECRUITCRM PRO - MOBILE CANDIDATE CARD COMPONENT
// Touch-Optimized Vertical Card for Mobile-First Candidate Feed (375-430px)
// ====================================================================

import React, { useState, memo } from 'react';
import {
  Phone,
  Mail,
  ExternalLink,
  Clock,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  MessageCircle,
  FileText,
  CheckCircle2,
  XCircle,
  Gift
} from 'lucide-react';
import { normalizeCvResult, normalizePvResult } from '../utils/dataNormalizer';

function CandidateMobileCardComponent({
  candidate,
  isSelected,
  onToggleSelect,
  onOpenDetail,
  onOpenEmail,
  onQuickApprove,
  onQuickReject,
  storedNote = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const cvNorm = normalizeCvResult(candidate.cvResultRaw);
  const pvNorm = normalizePvResult(candidate.pvResultRaw, candidate.interviewDate);

  // Status Badge formatting
  const renderStatusBadge = () => {
    if (candidate.onboardingDate) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Nhận việc</span>
        </span>
      );
    }
    if (cvNorm.key === 'FAIL' || pvNorm.key === 'FAIL') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs">
          <XCircle className="w-3.5 h-3.5" />
          <span>Review Fail</span>
        </span>
      );
    }
    if (cvNorm.key === 'PASS' || pvNorm.key === 'PASS') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Pass CV</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
        <Clock className="w-3.5 h-3.5" />
        <span>Pending</span>
      </span>
    );
  };

  // Helper for relative time (e.g. "2 ngày trước")
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return 'Gần đây';
    try {
      const parts = dateStr.trim().split(' ')[0].split(/[/-]/);
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        let year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;
        const submitDate = new Date(year, month, day);
        const now = new Date();
        const diffMs = now - submitDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return 'Hôm nay';
        if (diffDays === 1) return 'Hôm qua';
        if (diffDays < 30) return `${diffDays} ngày trước`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
        return `${Math.floor(diffDays / 365)} năm trước`;
      }
    } catch {
      // Fallback
    }
    return dateStr;
  };

  // Extract phone & clean phone
  const rawPhone = candidate.phone || (candidate.rawRow ? candidate.rawRow['Số điện thoại'] || '' : '');
  const cleanPhone = (p) => {
    if (!p) return '';
    let digits = String(p).replace(/\D/g, '');
    if (digits.startsWith('84') && digits.length > 9) digits = '0' + digits.slice(2);
    return digits;
  };
  const phone = cleanPhone(rawPhone);

  const email = candidate.email || (candidate.rawRow ? candidate.rawRow['Email'] || '' : '');

  // Copy to clipboard with visual check
  const handleCopy = (text, type, e) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Touch Swipe Gesture handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    if (Math.abs(diff) < 90) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 50 && onQuickApprove) {
      onQuickApprove(candidate);
    } else if (swipeOffset < -50 && onQuickReject) {
      onQuickReject(candidate);
    }
    setSwipeOffset(0);
  };

  const note = storedNote || candidate.notes || '';

  return (
    <div
      className={`relative rounded-2xl border transition-all overflow-hidden cursor-pointer shadow-xs ${
        isSelected
          ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-400 dark:border-blue-600'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
      onClick={() => onOpenDetail(candidate)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none'
      }}
    >
      <div className="p-3.5 sm:p-4 space-y-2.5">
        {/* ── DÒNG 1: Tên ứng viên + Trạng thái (badge màu căn phải) ── */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(candidate.id);
              }}
              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer flex-shrink-0 ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-500'
              }`}
            >
              {isSelected && <Check className="w-4 h-4" />}
            </button>

            <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
              {candidate.name}
            </h3>
          </div>

          <div className="flex-shrink-0">
            {renderStatusBadge()}
          </div>
        </div>

        {/* ── DÒNG 2: Vị trí ứng tuyển + Mức thưởng / CTV ── */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <p className="font-bold text-blue-600 dark:text-blue-400 truncate">
            {candidate.positionCompany || 'Vị trí tuyển dụng'}
          </p>

          {candidate.ctvCode && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/80 dark:border-amber-800/50 flex-shrink-0">
              <Gift className="w-3 h-3 text-amber-600" />
              <span>CTV: {candidate.ctvCode}</span>
            </span>
          )}
        </div>

        {/* ── DÒNG 3: SĐT, Email (rút gọn, có thể bấm để gọi / copy) ── */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          {phone ? (
            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${phone}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors min-h-[36px]"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{phone}</span>
              </a>

              <a
                href={`https://zalo.me/${phone}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800/60 min-h-[36px]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Zalo</span>
              </a>
            </div>
          ) : null}

          {email ? (
            <button
              onClick={(e) => handleCopy(email, 'email', e)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors min-h-[36px] max-w-[200px] truncate"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="truncate">{email}</span>
              {copiedField === 'email' ? (
                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400 flex-shrink-0" />
              )}
            </button>
          ) : null}
        </div>

        {/* ── DÒNG 4: Thời gian ứng tuyển + Nút "Xem CV" / "Chi tiết" ── */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{getRelativeTime(candidate.timestamp)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {candidate.cvUrl && (
              <a
                href={candidate.cvUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 text-xs transition-colors min-h-[36px]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem CV</span>
              </a>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenEmail(candidate);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 text-xs transition-colors min-h-[36px]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Gửi Mail</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Xem đánh giá"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── ĐÁNH GIÁ / NOTE (Hiển thị 1-2 dòng, có thể expand) ── */}
        {(note || isExpanded) && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 transition-all ${
              isExpanded ? 'block' : 'line-clamp-2'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span>📝 Ghi chú & Đánh giá:</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400">Chạm để xem chi tiết</span>
            </div>
            <p className={`font-normal leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
              {note || 'Chưa có ghi chú đánh giá.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CandidateMobileCardComponent);
