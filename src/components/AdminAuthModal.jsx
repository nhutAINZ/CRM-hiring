import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function AdminAuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  currentPassword = 'nhut2206',
  onChangePassword
}) {
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanInput = (inputPassword || '').trim();
    const cleanCurrent = (currentPassword || 'nhut2206').trim();

    if (!cleanInput) {
      setErrorMsg('Vui lòng nhập mật khẩu quản trị');
      return;
    }

    // Accept matching current password or master key 'nhut2206'
    if (cleanInput === cleanCurrent || cleanInput === 'nhut2206') {
      setErrorMsg('');
      setChangeSuccess(true);
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Ignore confetti if canvas is not supported in env
      }
      setTimeout(() => {
        setInputPassword('');
        setChangeSuccess(false);
        if (onLoginSuccess) onLoginSuccess();
        if (onClose) onClose();
      }, 400);
    } else {
      setErrorMsg('Mật khẩu không chính xác! Vui lòng thử lại.');
    }
  };

  const handleResetToDefault = () => {
    if (onChangePassword) {
      onChangePassword('nhut2206');
    }
    setInputPassword('nhut2206');
    setErrorMsg('');
    setChangeSuccess(true);
    setTimeout(() => {
      setChangeSuccess(false);
    }, 1500);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    const cleanOld = (oldPwd || '').trim();
    const cleanCurrent = (currentPassword || 'nhut2206').trim();
    const cleanNew = (newPwd || '').trim();
    const cleanConfirm = (confirmPwd || '').trim();

    if (cleanOld !== cleanCurrent && cleanOld !== 'nhut2206') {
      setErrorMsg('Mật khẩu cũ không đúng');
      return;
    }
    if (!cleanNew || cleanNew.length < 4) {
      setErrorMsg('Mật khẩu mới phải từ 4 ký tự trở lên');
      return;
    }
    if (cleanNew !== cleanConfirm) {
      setErrorMsg('Mật khẩu xác nhận không khớp');
      return;
    }

    if (onChangePassword) {
      onChangePassword(cleanNew);
    }
    setChangeSuccess(true);
    setErrorMsg('');
    setTimeout(() => {
      setChangeSuccess(false);
      setIsChangingPwd(false);
      setOldPwd('');
      setNewPwd('');
      setConfirmPwd('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header Icon & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20 mb-3 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isChangingPwd ? 'Đổi Mật Khẩu Quản Trị' : 'Đăng Nhập Quản Trị'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isChangingPwd
                ? 'Cập nhật mật khẩu bảo vệ quyền quản trị hệ thống'
                : 'Nhập mật khẩu để mở khóa toàn bộ tính năng CRM nội bộ'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-sm font-medium animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {changeSuccess && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thành công! Đang xử lý...</span>
            </div>
          )}

          {!isChangingPwd ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Mật khẩu Quản trị
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={inputPassword}
                    onChange={(e) => {
                      setInputPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Nhập mật khẩu quản trị..."
                    autoFocus
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-end mt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPwd(true);
                      setErrorMsg('');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Ở lại chế độ CTV
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Mở Khóa Quản Trị</span>
                </button>
              </div>
            </form>
          ) : (
            /* Change Password Form */
            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Mật khẩu mới (tối thiểu 4 ký tự)..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPwd(false);
                    setErrorMsg('');
                  }}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
                >
                  Lưu Mật Khẩu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
