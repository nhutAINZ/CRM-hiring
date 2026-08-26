import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Mail,
  Check,
  Sparkles,
  Edit3,
  ExternalLink,
  DollarSign,
  Calendar,
  Clock,
  User,
  Building
} from 'lucide-react';
import { getStoredTemplates, renderTemplate } from '../utils/emailTemplates';
import confetti from 'canvas-confetti';

export default function EmailGeneratorModal({ candidate, onClose, onOpenEditor }) {
  const templates = getStoredTemplates();
  const [activeTab, setActiveTab] = useState('templateA'); // 'templateA' | 'templateB' | 'templateC' | 'templateD'
  const [copied, setCopied] = useState(false);

  const today = new Date();
  const [formData, setFormData] = useState({
    NGAY: String(today.getDate()).padStart(2, '0'),
    THANG: String(today.getMonth() + 1).padStart(2, '0'),
    NAM: String(today.getFullYear()),
    TEN_UNG_VIEN: candidate?.name || 'Nguyễn Văn A',
    VI_TRI: candidate?.positionCompany || 'Nhân viên tư vấn',
    CONG_TY: candidate?.positionCompany?.split('-')[1]?.trim() || 'Doanh Nghiệp Đối Tác',
    CHI_NHANH: 'Chi nhánh Hà Nội',
    SO_NGAY_THU_VIEC: '30',
    THU: 'thứ Hai',
    GIO_BAT_DAU: '08h30',
    NGAY_BAT_DAU: candidate?.startTime || candidate?.onboardingDate || '25/08/2026',
    LUONG_THU_VIEC: '8.500.000',
    LUONG_CHINH_THUC: '10.000.000',
    DIA_CHI: '18 Ngõ 55 Dịch Vọng, Cầu Giấy, Hà Nội',
    CA_SANG: '08h30',
    CA_SANG_DEN: '12h00',
    CA_CHIEU: '13h30',
    CA_CHIEU_DEN: '17h30',
    HAN_CHOT: '17h00 ngày 24/08/2026',
    SDT: '0988 123 456',
    NGUOI_LIEN_HE: 'Ms. Thu - Bộ phận Tuyển Dụng',
    // Fields for Template B (Interview)
    GIO_PV: candidate?.interviewTime || '09h30',
    NGAY_PV: candidate?.interviewDate || '20/08/2026',
    DIA_DIEM_PV: 'Phòng 1101A tầng 11 tòa Lake View, Cầu Giấy, Hà Nội',
    HAN_CHOT_PV: '17h00 ngày 19/08/2026',
    // Fields for Template D (CTV Update)
    MA_CTV: candidate?.ctvCode || 'CTV01',
    TRANG_THAI_CV: candidate?.cvResultRaw || 'Đang duyệt',
    KET_QUA_PV: candidate?.pvResultRaw || 'Chờ phỏng vấn'
  });

  // Calculate 85% salary automatically
  useEffect(() => {
    if (candidate?.desiredSalary) {
      const numeric = candidate.desiredSalary.replace(/[^0-9]/g, '');
      if (numeric && numeric.length >= 6) {
        const val = parseInt(numeric, 10);
        const prob = Math.round(val * 0.85);
        setFormData((prev) => ({
          ...prev,
          LUONG_CHINH_THUC: val.toLocaleString('vi-VN'),
          LUONG_THU_VIEC: prob.toLocaleString('vi-VN')
        }));
      }
    }
  }, [candidate]);

  const currentTemplateString = templates[activeTab] || templates.templateA;
  const renderedContent = renderTemplate(currentTemplateString, formData);

  const getSubjectLine = () => {
    if (activeTab === 'templateA') return `[THƯ MỜI NHẬN VIỆC] - Vị trí ${formData.VI_TRI} - ${formData.TEN_UNG_VIEN}`;
    if (activeTab === 'templateB') return `[THƯ MỜI PHỎNG VẤN] - Vị trí ${formData.VI_TRI} - ${formData.TEN_UNG_VIEN}`;
    if (activeTab === 'templateC') return `[KẾT QUẢ PHỎNG VẤN] - Cảm ơn bạn ${formData.TEN_UNG_VIEN} - ${formData.VI_TRI}`;
    return `[CẬP NHẬT TIẾN ĐỘ ỨNG VIÊN] - ${formData.TEN_UNG_VIEN} (Mã CTV: ${formData.MA_CTV})`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedContent);
    setCopied(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenGmail = () => {
    const emailTo = candidate?.email || '';
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      emailTo
    )}&su=${encodeURIComponent(getSubjectLine())}&body=${encodeURIComponent(renderedContent)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0b1121] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden my-4 flex flex-col max-h-[90vh] specular-highlight">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Studio Tạo Thư Mời & Email Tuyển Dụng</h2>
              <p className="text-xs text-emerald-100">
                Ứng viên: <strong>{candidate?.name || 'Nguyễn Văn A'}</strong> ({formData.VI_TRI})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEditor}
              className="btn-shiny flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-all cursor-pointer"
              title="Chỉnh sửa mẫu thư mặc định"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chỉnh Sửa Mẫu</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Tab Navigation */}
        <div className="p-3 bg-slate-50 dark:bg-white/3 border-b border-slate-200 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('templateA')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'templateA'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs border border-emerald-400/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            🎉 Thư Mời Nhận Việc (Mẫu A)
          </button>
          <button
            onClick={() => setActiveTab('templateB')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'templateB'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs border border-emerald-400/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            📅 Thư Mời Phỏng Vấn (Mẫu B)
          </button>
          <button
            onClick={() => setActiveTab('templateC')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'templateC'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs border border-emerald-400/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            ✉️ Cảm Ơn / Từ Chối Khéo (Mẫu C)
          </button>
          <button
            onClick={() => setActiveTab('templateD')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'templateD'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs border border-emerald-400/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            📊 Báo Cáo Cho CTV (Mẫu D)
          </button>
        </div>

        {/* Dual Pane Studio Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/5">
          {/* Left Form Variables Inputs */}
          <div className="lg:col-span-5 p-4 sm:p-5 space-y-3.5 overflow-y-auto bg-slate-50/40 dark:bg-white/1">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Biến Điền Tự Động & Tùy Biến
            </h4>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Tên Ứng Viên</label>
                <input
                  type="text"
                  value={formData.TEN_UNG_VIEN}
                  onChange={(e) => setFormData({ ...formData, TEN_UNG_VIEN: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Vị Trí Tuyển Dụng</label>
                <input
                  type="text"
                  value={formData.VI_TRI}
                  onChange={(e) => setFormData({ ...formData, VI_TRI: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {activeTab === 'templateA' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-1 font-semibold">Lương Chính Thức</label>
                      <input
                        type="text"
                        value={formData.LUONG_CHINH_THUC}
                        onChange={(e) => setFormData({ ...formData, LUONG_CHINH_THUC: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1 font-semibold">Lương Thử Việc (85%)</label>
                      <input
                        type="text"
                        value={formData.LUONG_THU_VIEC}
                        onChange={(e) => setFormData({ ...formData, LUONG_THU_VIEC: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-1 font-semibold">Ngày Đi Làm</label>
                      <input
                        type="text"
                        value={formData.NGAY_BAT_DAU}
                        onChange={(e) => setFormData({ ...formData, NGAY_BAT_DAU: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1 font-semibold">Hạn Xác Nhận</label>
                      <input
                        type="text"
                        value={formData.HAN_CHOT}
                        onChange={(e) => setFormData({ ...formData, HAN_CHOT: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-semibold">Địa Chỉ Làm Việc</label>
                    <input
                      type="text"
                      value={formData.DIA_CHI}
                      onChange={(e) => setFormData({ ...formData, DIA_CHI: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                    />
                  </div>
                </>
              )}

              {activeTab === 'templateB' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-1 font-semibold">Ngày Phỏng Vấn</label>
                      <input
                        type="text"
                        value={formData.NGAY_PV}
                        onChange={(e) => setFormData({ ...formData, NGAY_PV: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1 font-semibold">Giờ Phỏng Vấn</label>
                      <input
                        type="text"
                        value={formData.GIO_PV}
                        onChange={(e) => setFormData({ ...formData, GIO_PV: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-semibold">Địa Điểm Phỏng Vấn</label>
                    <input
                      type="text"
                      value={formData.DIA_DIEM_PV}
                      onChange={(e) => setFormData({ ...formData, DIA_DIEM_PV: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Người Liên Hệ</label>
                  <input
                    type="text"
                    value={formData.NGUOI_LIEN_HE}
                    onChange={(e) => setFormData({ ...formData, NGUOI_LIEN_HE: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Số Hotline / Zalo</label>
                  <input
                    type="text"
                    value={formData.SDT}
                    onChange={(e) => setFormData({ ...formData, SDT: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Preview */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-white dark:bg-[#070c19]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Xem Trước Trực Tiếp (Live Preview)
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  {renderedContent.length} ký tự
                </span>
              </div>
              <div className="p-3 mb-2 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                <strong>Tiêu đề:</strong> {getSubjectLine()}
              </div>
              <textarea
                readOnly
                rows={16}
                value={renderedContent}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed resize-none focus:outline-none"
              ></textarea>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
              <button
                onClick={handleCopy}
                className="btn-shiny flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-white/10 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép Nội Dung'}</span>
              </button>

              <button
                onClick={handleOpenGmail}
                className="btn-shiny flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 border border-emerald-400/30 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Mở Trong Gmail</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
