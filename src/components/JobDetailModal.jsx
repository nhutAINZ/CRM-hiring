import React, { useState, useRef } from 'react';
import {
  X,
  Briefcase,
  Building,
  MapPin,
  Flame,
  ShieldCheck,
  DollarSign,
  Gift,
  ExternalLink,
  Copy,
  Check,
  Users,
  FileText,
  Sparkles,
  Share2,
  ChevronRight,
  Info,
  Image as ImageIcon,
  Upload,
  Trash2,
  Maximize2,
  Download,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CTV_SUBMIT_CV_FORM_URL } from '../services/sheetsService';
import { getDirectJdUrl } from '../services/zcaBotService';

export default function JobDetailModal({
  job,
  candidates = [],
  onClose,
  onNavigateToCandidateJob,
  onOpenEmailCandidate
}) {
  const [copied, setCopied] = useState(false);
  const [copiedJdLink, setCopiedJdLink] = useState(false);

  // JD Poster Image State
  const storageKey = `fasthunt_jd_image_${job?.id || job?.rowIndex || 'temp'}`;
  const [jdImage, setJdImage] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || job?.imageUrl || job?.posterUrl || '';
    } catch {
      return job?.imageUrl || job?.posterUrl || '';
    }
  });
  const [isZoomImage, setIsZoomImage] = useState(false);
  const [uploadNotice, setUploadNotice] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const fileInputRef = useRef(null);

  if (!job) return null;

  // Matching candidates from Sheet 1
  const matchingCandidates = candidates.filter((c) => {
    const pos = (c.positionCompany || c.position || '').toLowerCase().trim();
    const jobTitle = (job.title || '').toLowerCase().trim();
    return pos.includes(jobTitle) || jobTitle.includes(pos);
  });

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress to max 1200px dimension with 0.82 quality to respect browser localStorage
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

        try {
          localStorage.setItem(storageKey, compressedDataUrl);
          setJdImage(compressedDataUrl);
          setUploadNotice('Đã đính kèm ảnh poster JD thành công!');
          confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
          setTimeout(() => setUploadNotice(''), 3000);
        } catch {
          alert('Không thể lưu ảnh do vượt quá dung lượng lưu trữ của trình duyệt.');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInputValue.trim()) return;
    try {
      localStorage.setItem(storageKey, urlInputValue.trim());
      setJdImage(urlInputValue.trim());
      setUrlInputValue('');
      setShowUrlInput(false);
      setUploadNotice('Đã lưu liên kết ảnh JD thành công!');
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.7 } });
      setTimeout(() => setUploadNotice(''), 3000);
    } catch {}
  };

  const handleRemoveImage = () => {
    if (window.confirm('Bạn có chắc muốn xóa ảnh poster đính kèm của JD này không?')) {
      try {
        localStorage.removeItem(storageKey);
      } catch {}
      setJdImage('');
      setUploadNotice('Đã gỡ ảnh poster JD.');
      setTimeout(() => setUploadNotice(''), 2500);
    }
  };

  const handleDownloadImage = () => {
    if (!jdImage) return;
    const a = document.createElement('a');
    a.href = jdImage;
    a.download = `JD_Poster_${(job.title || 'Vị_trí').replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCopyShare = () => {
    const text = `🔥 [THÔNG TIN TUYỂN DỤNG & HOA HỒNG CTV FASTHUNT] 🔥
🏢 Doanh nghiệp: ${job.company}
💼 Vị trí: ${job.title}
📍 Khu vực: ${job.location}
🏷️ Loại ngành: ${job.industry}
💰 Mức thu nhập: ${job.salary}
🎁 HOA HỒNG (BONUS) CTV: ${job.bonus}
🎯 Số lượng cần tuyển: ${job.headcount} chỉ tiêu
🛡️ Thời gian bảo hành: ${job.warrantyPeriod}
${job.requirements ? `📝 Ghi chú yêu cầu: ${job.requirements}\n` : ''}${job.jdFile ? `📄 File JD: ${job.jdFile}\n` : ''}${jdImage ? `🖼️ [ĐÃ ĐÍNH KÈM HÌNH ẢNH / POSTER TUYỂN DỤNG]\n` : ''}🔗 Link Dòng Google Sheet: ${job.sheetRowUrl}
⚡ Nhanh tay giới thiệu ứng viên phù hợp để nhận thưởng hoa hồng!`;

    navigator.clipboard.writeText(text);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl text-white shadow-inner">
                {job.company.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/20 text-white uppercase tracking-wider backdrop-blur-md">
                    Chi Tiết Vị Trí Tuyển Dụng
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-amber-950">
                    {job.status}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1 leading-snug">
                  {job.title}
                </h2>
                <p className="text-xs text-blue-100 font-semibold flex items-center gap-2 mt-0.5">
                  <span>{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.industry}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Highlighted Bonus & Salary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-slate-800 border border-rose-200 dark:border-rose-800/60 space-y-1">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-rose-600" />
                <span>Hoa Hồng (Bonus) CTV</span>
              </span>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {job.bonus}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Thưởng hoa hồng trực tiếp cho CTV khi ứng viên onboard thành công.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100/50 dark:from-blue-950/40 dark:to-slate-800 border border-blue-200 dark:border-blue-800/60 space-y-1">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span>Mức Thu Nhập / Lương</span>
              </span>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {job.salary}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lương cơ bản + hoa hồng doanh số theo chính sách doanh nghiệp.
              </p>
            </div>
          </div>

          {/* Job Parameters Info Table */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Thông Số Tuyển Dụng
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Số lượng cần tuyển</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{job.headcount} Chỉ tiêu</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Thời gian bảo hành</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{job.warrantyPeriod}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Vị trí dòng Sheet</p>
                <p className="font-extrabold text-blue-600 dark:text-blue-400 font-mono">Dòng #{job.rowIndex}</p>
              </div>
            </div>

            {job.requirements && (
              <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700 space-y-1 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300">Yêu Cầu & Ghi Chú Tuyển Dụng:</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {job.requirements}
                </p>
              </div>
            )}

            {(job.jdFile || job.linkJd || job.jdUrl) && (
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {job.jdFile || 'File JD Tuyển Dụng'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const directUrl = getDirectJdUrl(job);
                      if (navigator?.clipboard) {
                        navigator.clipboard.writeText(directUrl);
                      }
                      setCopiedJdLink(true);
                      confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
                      setTimeout(() => setCopiedJdLink(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer border border-blue-200 dark:border-blue-800"
                    title="Sao chép link xem JD cho CTV"
                  >
                    {copiedJdLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedJdLink ? 'Đã copy link JD!' : 'Copy link JD'}</span>
                  </button>
                  <a
                    href={getDirectJdUrl(job)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Mở link JD trong tab mới"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ── ATTACHED JD POSTER / RECRUITMENT IMAGE SECTION ── */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-200 tracking-wider">
                  Hình Ảnh & Poster JD Tuyển Dụng
                </h4>
                {jdImage && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    Đã đính kèm
                  </span>
                )}
              </div>

              {/* Upload & Link Controls */}
              <div className="flex items-center gap-1.5">
                {uploadNotice && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>{uploadNotice}</span>
                  </span>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[11px] border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                  title="Tải ảnh poster JD từ máy tính"
                >
                  <Upload className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span>{jdImage ? 'Đổi ảnh' : 'Tải ảnh JD'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput((v) => !v)}
                  className="px-2 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-[11px] transition-colors cursor-pointer"
                  title="Nhập URL liên kết ảnh"
                >
                  Link URL
                </button>
              </div>
            </div>

            {/* Optional URL input expander */}
            {showUrlInput && (
              <div className="flex items-center gap-2 pt-1 animate-fade-in">
                <input
                  type="url"
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                  placeholder="Dán đường dẫn ảnh trực tiếp (https://...)"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none focus:border-purple-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            )}

            {/* Image Preview or Upload Prompt */}
            {jdImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/5 dark:bg-slate-950 flex flex-col items-center">
                <img
                  src={jdImage}
                  alt={`JD Poster ${job.title}`}
                  className="w-full max-h-72 object-contain rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setIsZoomImage(true)}
                  title="Bấm để xem phóng to"
                />

                {/* Floating Quick Actions Bar */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/70 backdrop-blur-md shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setIsZoomImage(true)}
                    className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors"
                    title="Phóng to ảnh"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors"
                    title="Tải ảnh về máy"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/30 transition-colors"
                    title="Xóa ảnh poster này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 bg-white/50 dark:bg-slate-900/50 hover:bg-purple-50/30 dark:hover:bg-purple-950/20 text-center cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Thêm hình ảnh poster / banner cho vị trí tuyển dụng này
                </p>
                <p className="text-[11px] text-slate-400">
                  Bấm để chọn tệp hình ảnh (PNG, JPG, WEBP) từ thiết bị của bạn
                </p>
              </div>
            )}
          </div>

          {/* Matching Applicants from Sheet 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Hồ Sơ Ứng Viên Đã Nộp Cho Vị Trí Này ({matchingCandidates.length})</span>
              </h4>

              {onNavigateToCandidateJob && matchingCandidates.length > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCandidateJob(job.title);
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Mở trong bảng ứng viên</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {matchingCandidates.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-600 dark:text-slate-300">Chưa có ứng viên nào nộp cho vị trí này</p>
                <p className="text-[11px]">Hãy chia sẻ tin tuyển dụng cho CTV để nhận hồ sơ ứng tuyển mới!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                {matchingCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{cand.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Mã CTV: <span className="font-mono font-semibold text-blue-600">{cand.ctvCode}</span> • Lương: {cand.desiredSalary || 'Thỏa thuận'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {cand.cvUrl && (
                        <a
                          href={cand.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[11px] font-bold"
                        >
                          CV
                        </a>
                      )}
                      {onOpenEmailCandidate && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenEmailCandidate(cand);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Gửi Mail
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <a
            href={job.sheetRowUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span>Mở Dòng #{job.rowIndex} Trên Google Sheet</span>
          </a>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={CTV_SUBMIT_CV_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-amber-300" />
              <span>GỬI CV ỨNG VIÊN VỀ DOANH NGHIỆP</span>
            </a>

            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Đã Copy Tin!' : 'Copy Tin CTV'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── FULLSCREEN IMAGE LIGHTBOX MODAL ── */}
      {isZoomImage && jdImage && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-4xl flex items-center justify-between text-white pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold truncate">Poster JD: {job.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadImage}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh về máy</span>
              </button>
              <button
                type="button"
                onClick={() => setIsZoomImage(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="Đóng (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl flex items-center justify-center bg-black/40 border border-white/10 shadow-2xl">
            <img
              src={jdImage}
              alt={`Full size ${job.title}`}
              className="max-h-[85vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
