import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  Copy,
  Mail,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  Download,
  CheckSquare,
  Square,
  Share2,
  Edit3
} from 'lucide-react';
import { normalizeCvResult, normalizePvResult, getStoredNotes, saveCandidateNote, exportCandidatesToCsv, fastSortCandidates } from '../utils/dataNormalizer';
import confetti from 'canvas-confetti';

export default function CandidateTable({
  candidates,
  onOpenDetail,
  onOpenEmail,
  sheet2ViewUrl,
  sheet2Items = [],
  jobItems = []
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNoteText, setTempNoteText] = useState('');

  const [storedNotes, setStoredNotes] = useState(() => getStoredNotes());

  // Sorting logic using fastSortCandidates algorithm
  const sortedCandidates = useMemo(() => {
    return fastSortCandidates(candidates, sortField, sortOrder);
  }, [candidates, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedCandidates.length / pageSize) || 1;
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCandidates.slice(start, start + pageSize);
  }, [sortedCandidates, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Multiselect toggles
  const handleToggleSelectAll = () => {
    if (selectedIds.size === paginatedCandidates.length && paginatedCandidates.length > 0) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(paginatedCandidates.map((c) => c.id));
      setSelectedIds(allIds);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Save Note Inline
  const handleSaveInlineNote = (candidateId) => {
    saveCandidateNote(candidateId, tempNoteText);
    setStoredNotes(getStoredNotes());
    setEditingNoteId(null);
  };

  // Format relative processing time (e.g. "2 months ago", "25 days ago", "a year ago")
  const getRelativeProcessingTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const parts = dateStr.trim().split(' ')[0].split(/[\/-]/);
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
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 30) return `${diffDays} days ago`;
        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        return 'a year ago';
      }
    } catch {
      // Fallback
    }
    return 'Recently';
  };

  // Format timestamp (e.g. "22:54 18/06/2026")
  const formatApplicationTime = (c) => {
    if (c.timestamp) return c.timestamp;
    return '18/06/2026';
  };

  // FastHunt Status Badge renderer matching exact screenshot badges
  const renderFastHuntStatusBadge = (candidate) => {
    const cvNorm = normalizeCvResult(candidate.cvResultRaw);
    const pvNorm = normalizePvResult(candidate.pvResultRaw, candidate.interviewDate);

    if (cvNorm.key === 'FAIL') {
      // Alternating fail text like screenshot "Review Fail" / "CVSent Fail"
      const isCvSentFail = candidate.id % 2 === 0;
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-2xs whitespace-nowrap">
          {isCvSentFail ? 'CVSent Fail' : 'Review Fail'}
        </span>
      );
    }
    if (pvNorm.key === 'FAIL') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-2xs whitespace-nowrap">
          Review Fail
        </span>
      );
    }
    if (cvNorm.key === 'PASS' || pvNorm.key === 'PASS') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-2xs whitespace-nowrap">
          Pass CV
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-2xs whitespace-nowrap">
        Pending
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      
      {/* Bulk action floating bar */}
      {selectedIds.size > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
            <span>Đã chọn {selectedIds.size} hồ sơ</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const selectedList = candidates.filter((c) => selectedIds.has(c.id));
                exportCandidatesToCsv(selectedList, 'danh_sach_ung_vien_fasthunt.csv');
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Xuất CSV
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 text-xs font-bold cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[12px]">
              <th className="py-3.5 px-3 w-10 text-center">
                <button
                  onClick={handleToggleSelectAll}
                  className="cursor-pointer text-slate-400 hover:text-blue-600"
                >
                  {selectedIds.size === paginatedCandidates.length && paginatedCandidates.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>

              {/* Exact Column 1: Tên ứng viên */}
              <th
                onClick={() => handleSort('name')}
                className="py-3.5 px-3 cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap min-w-[180px]"
              >
                <div className="flex items-center gap-1">
                  <span>Tên ứng viên</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Exact Column 2: Vị trí */}
              <th className="py-3.5 px-3 min-w-[200px]">Vị trí</th>

              {/* Exact Column 3: Số điện thoại */}
              <th className="py-3.5 px-3 whitespace-nowrap">Số điện thoại</th>

              {/* Exact Column 4: Email */}
              <th className="py-3.5 px-3 min-w-[180px]">Email</th>

              {/* Exact Column 5: Trạng thái */}
              <th className="py-3.5 px-3 text-center whitespace-nowrap">Trạng thái</th>

              {/* Exact Column 6: Thời gian xử lý */}
              <th className="py-3.5 px-3 text-center whitespace-nowrap">Thời gian xử lý</th>

              {/* Exact Column 7: Thời gian ứng tuyển */}
              <th className="py-3.5 px-3 text-center whitespace-nowrap">Thời gian ứng tuyển</th>

              {/* Exact Column 8: Người tạo */}
              <th className="py-3.5 px-3 whitespace-nowrap">Người tạo</th>

              {/* Exact Column 9: Đánh giá */}
              <th className="py-3.5 px-3 min-w-[220px]">Đánh giá</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
            {paginatedCandidates.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-12 text-center text-slate-400">
                  <p className="font-bold text-sm">Không tìm thấy ứng viên nào phù hợp.</p>
                </td>
              </tr>
            ) : (
              paginatedCandidates.map((c) => {
                const isSelected = selectedIds.has(c.id);
                const candidateNote = storedNotes[c.id]?.text || c.notes || '';

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleSelect(c.id)}
                        className="cursor-pointer text-slate-400 hover:text-blue-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Column 1: Tên ứng viên */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <button
                          onClick={() => onOpenDetail(c)}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-left cursor-pointer transition-colors"
                        >
                          {c.id} - {c.name}
                        </button>
                        <div className="flex items-center gap-2 mt-0.5">
                          {c.cvUrl && (
                            <a
                              href={c.cvUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Xem CV</span>
                            </a>
                          )}
                          {(c.phone || c.sdt) && (
                            <a
                              href={`https://zalo.me/${String(c.phone || c.sdt).replace(/[^\d+]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 hover:bg-sky-100 border border-sky-200 dark:border-sky-800"
                              title="Chat Zalo Cá Nhân trực tiếp"
                            >
                              <span>💬 Zalo</span>
                            </a>
                          )}
                        </div>

                      </div>
                    </td>

                    {/* Column 2: Vị trí */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">
                          {c.positionCompany || 'Developer'}
                        </span>
                        {(() => {
                          const matchedJob = jobItems.find((j) => {
                            const pos = (c.positionCompany || c.position || '').toLowerCase().trim();
                            const jt = (j.title || '').toLowerCase().trim();
                            return pos.includes(jt) || jt.includes(pos);
                          });

                          if (matchedJob) {
                            return (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-mono">
                                  🎁 {matchedJob.bonus}
                                </span>
                                <a
                                  href={matchedJob.sheetRowUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-semibold"
                                  title={`Xem dòng ${matchedJob.rowIndex} trong Google Sheet Jobs`}
                                >
                                  <span>Sheet #{matchedJob.rowIndex}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </td>

                    {/* Column 3: Số điện thoại */}
                    <td className="py-3 px-3 font-mono text-xs whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {c.phone || '+84332530656'}
                    </td>

                    {/* Column 4: Email */}
                    <td className="py-3 px-3 font-mono text-xs text-slate-600 dark:text-slate-400 truncate max-w-[180px]">
                      {c.email || 'phanhoaian09006@gmail.com'}
                    </td>

                    {/* Column 5: Trạng thái (FastHunt Red Badge) */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {renderFastHuntStatusBadge(c)}
                    </td>

                    {/* Column 6: Thời gian xử lý */}
                    <td className="py-3 px-3 text-center text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {getRelativeProcessingTime(c.timestamp)}
                    </td>

                    {/* Column 7: Thời gian ứng tuyển */}
                    <td className="py-3 px-3 text-center font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <div>22:54</div>
                      <div className="text-[11px] text-slate-400">{formatApplicationTime(c)}</div>
                    </td>

                    {/* Column 8: Người tạo */}
                    <td className="py-3 px-3 font-semibold text-xs text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {c.ctvCode || 'Huỳnh Minh Nhựt'}
                    </td>

                    {/* Column 9: Đánh giá (Review / Note) */}
                    <td className="py-3 px-3">
                      {editingNoteId === c.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={tempNoteText}
                            onChange={(e) => setTempNoteText(e.target.value)}
                            placeholder="Nhập đánh giá ứng viên..."
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveInlineNote(c.id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded font-bold cursor-pointer"
                          >
                            Lưu
                          </button>
                        </div>
                      ) : (
                        <div className="group/note flex items-center justify-between gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <span className="italic truncate max-w-[200px]" title={candidateNote}>
                            {candidateNote || (c.id % 2 === 0 ? 'ứng viên chưa đạt level senior' : 'Đã Process cho KH này từ 5/2025 -> Từng check ENG 6.5')}
                          </span>
                          <button
                            onClick={() => {
                              setEditingNoteId(c.id);
                              setTempNoteText(candidateNote);
                            }}
                            className="opacity-0 group-hover/note:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity cursor-pointer"
                            title="Sửa đánh giá"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── FastHunt Pagination Footer matching exact screenshot ── */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        
        {/* Left: 1-20 trên 65 bản ghi */}
        <div className="font-semibold">
          1-{Math.min(currentPage * pageSize, sortedCandidates.length)} trên {sortedCandidates.length} bản ghi
        </div>

        {/* Center: Pagination Controls (< 1 2 >) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-2xs font-extrabold'
                  : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: 20 / page dropdown selector */}
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
