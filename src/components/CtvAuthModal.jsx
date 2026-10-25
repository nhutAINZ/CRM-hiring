import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  LogIn,
  LogOut,
  Phone,
  Mail,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CtvAuthModal({
  isOpen,
  onClose,
  ctvItems = [],
  candidates = [],
  currentCtv = null,
  onLoginCtv = () => {},
  onLogoutCtv = () => {}
}) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [searchOrCode, setSearchOrCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form for new CTV registration
  const [regForm, setRegForm] = useState({
    name: '',
    phoneZalo: '',
    email: '',
    bankName: '',
    bankAccount: '',
    preferredCode: ''
  });

  if (!isOpen) return null;

  // Extract all known CTV codes from ctvItems and candidates
  const knownCtvs = (() => {
    const map = new Map();

    // From ctvItems (Sheet CTV)
    ctvItems.forEach((item) => {
      if (item.ctvCode) {
        const code = item.ctvCode.trim();
        if (!map.has(code.toUpperCase())) {
          map.set(code.toUpperCase(), {
            ctvCode: code,
            name: item.name || `CTV ${code}`,
            phoneZalo: item.phoneZalo || '',
            email: item.email || '',
            bankName: item.bankName || '',
            bankAccount: item.bankAccount || ''
          });
        }
      }
    });

    // From candidates
    candidates.forEach((c) => {
      if (c.ctvCode && c.ctvCode !== 'N/A') {
        const code = c.ctvCode.trim();
        if (!map.has(code.toUpperCase())) {
          map.set(code.toUpperCase(), {
            ctvCode: code,
            name: `CTV (${code})`,
            phoneZalo: '',
            email: '',
            bankName: '',
            bankAccount: ''
          });
        }
      }
    });

    return Array.from(map.values());
  })();

  // Filter CTV list for quick selection
  const filteredQuickCtvs = knownCtvs.filter((ctv) => {
    if (!searchOrCode) return true;
    const q = searchOrCode.toLowerCase().trim();
    return (
      ctv.ctvCode.toLowerCase().includes(q) ||
      ctv.name.toLowerCase().includes(q) ||
      ctv.phoneZalo.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  const handleSelectCtv = (ctv) => {
    setErrorMsg('');
    setSuccessMsg(`Đăng nhập thành công với mã ${ctv.ctvCode}!`);
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}

    setTimeout(() => {
      onLoginCtv(ctv);
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  const handleDirectLogin = (e) => {
    if (e) e.preventDefault();
    const query = searchOrCode.trim();
    if (!query) {
      setErrorMsg('Vui lòng nhập Mã CTV hoặc Số điện thoại của bạn');
      return;
    }

    // Try finding exact or matching CTV
    const found = knownCtvs.find(
      (c) =>
        c.ctvCode.toLowerCase() === query.toLowerCase() ||
        c.phoneZalo.replace(/\s+/g, '') === query.replace(/\s+/g, '') ||
        c.name.toLowerCase() === query.toLowerCase()
    );

    if (found) {
      handleSelectCtv(found);
    } else {
      // If code is not found, offer to use it directly as temporary/new CTV session
      const customCtv = {
        ctvCode: query.toUpperCase(),
        name: `CTV ${query.toUpperCase()}`,
        phoneZalo: '',
        email: '',
        isCustom: true
      };
      handleSelectCtv(customCtv);
    }
  };

  const handleRegisterNewCtv = (e) => {
    if (e) e.preventDefault();
    if (!regForm.name.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên');
      return;
    }
    if (!regForm.phoneZalo.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại / Zalo');
      return;
    }

    const initials = regForm.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedCode =
      (regForm.preferredCode || '').trim().toUpperCase() ||
      `CTV_${initials}_${randomSuffix}`;

    const newCtv = {
      ctvCode: generatedCode,
      name: regForm.name.trim(),
      phoneZalo: regForm.phoneZalo.trim(),
      email: regForm.email.trim(),
      bankName: regForm.bankName.trim(),
      bankAccount: regForm.bankAccount.trim(),
      registeredAt: new Date().toISOString()
    };

    // Save to local registered CTV list
    try {
      const existing = JSON.parse(localStorage.getItem('fasthunt_registered_ctvs') || '[]');
      existing.unshift(newCtv);
      localStorage.setItem('fasthunt_registered_ctvs', JSON.stringify(existing));
    } catch (e) {}

    setErrorMsg('');
    setSuccessMsg(`🎉 Tạo mã CTV [${generatedCode}] thành công!`);
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    setTimeout(() => {
      onLoginCtv(newCtv);
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                Cổng Xác Thực Cộng Tác Viên
              </h2>
              <p className="text-xs text-blue-100/90">
                Đăng nhập để gửi & theo dõi hồ sơ ứng viên của riêng bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currently Logged In Banner */}
        {currentCtv && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Đang đăng nhập: {currentCtv.name}
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px]">
                  Mã: {currentCtv.ctvCode}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onLogoutCtv();
                setSuccessMsg('Đã đăng xuất tài khoản CTV');
                setTimeout(() => setSuccessMsg(''), 1500);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-900 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>
        )}

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-1.5 gap-1.5">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập Mã CTV</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng Ký Mã Mới (30s)</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="m-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="m-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Login Content */}
        {activeTab === 'login' && (
          <div className="p-5 overflow-y-auto space-y-4">
            <form onSubmit={handleDirectLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nhập Mã CTV hoặc Số Điện Thoại
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchOrCode}
                    onChange={(e) => setSearchOrCode(e.target.value)}
                    placeholder="Ví dụ: CTV01, CTV_HN, 0901234567..."
                    className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Vào Ngay
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  💡 Nhập mã CTV để hệ thống lọc ra chính xác các ứng viên và hoa hồng của bạn.
                </p>
              </div>
            </form>

            {/* Quick Pick CTV List */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                <span>Chọn Nhanh Từ Danh Sách CTV ({knownCtvs.length})</span>
                {searchOrCode && (
                  <button
                    type="button"
                    onClick={() => setSearchOrCode('')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Xem tất cả
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredQuickCtvs.map((ctv) => {
                  const isCurrent = currentCtv?.ctvCode === ctv.ctvCode;
                  return (
                    <button
                      key={ctv.ctvCode}
                      type="button"
                      onClick={() => handleSelectCtv(ctv)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">
                            {ctv.ctvCode}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-emerald-600 font-bold">
                              (Hiện tại)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
                          {ctv.name}
                        </p>
                        {ctv.phoneZalo && (
                          <p className="text-[10px] text-slate-400 truncate">
                            {ctv.phoneZalo}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Register Content */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterNewCtv} className="p-5 overflow-y-auto space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Họ và Tên CTV <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn An"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Số Điện Thoại / Zalo <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={regForm.phoneZalo}
                    onChange={(e) => setRegForm({ ...regForm, phoneZalo: e.target.value })}
                    placeholder="09xx xxx xxx"
                    required
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="ctv@gmail.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tên Ngân Hàng (Nhận Hoa Hồng)
                </label>
                <input
                  type="text"
                  value={regForm.bankName}
                  onChange={(e) => setRegForm({ ...regForm, bankName: e.target.value })}
                  placeholder="MBBank, VCB, Techcombank..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Số Tài Khoản (STK)
                </label>
                <input
                  type="text"
                  value={regForm.bankAccount}
                  onChange={(e) => setRegForm({ ...regForm, bankAccount: e.target.value })}
                  placeholder="0123456789"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mã CTV Mong Muốn (Tùy chọn)
              </label>
              <input
                type="text"
                value={regForm.preferredCode}
                onChange={(e) => setRegForm({ ...regForm, preferredCode: e.target.value.toUpperCase() })}
                placeholder="Để trống hệ thống sẽ tự sinh mã đẹp (VD: CTV_NA_88)"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Kích Hoạt Mã CTV & Bắt Đầu Ngay</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Quyền lợi CTV & hoa hồng được bảo đảm 100%</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
