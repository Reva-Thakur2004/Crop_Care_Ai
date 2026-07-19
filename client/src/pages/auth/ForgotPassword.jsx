import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Key, Mail, Lock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { forgotPassword, verifyOtp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setMessage(result.message);
      setStep(2);
    } else {
      setError(result.error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await verifyOtp(email, otp);
    setLoading(false);

    if (result.success) {
      setMessage(result.message);
      setStep(3);
    } else {
      setError(result.error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email, otp, password);
    setLoading(false);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-emerald-50 via-teal-50 to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 px-4">
      {/* Background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-300 dark:bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-300 dark:bg-teal-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>

      <div className="w-full max-w-md glass-premium p-8 rounded-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/30 text-white mb-3">
            <Key className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Verify Code'}
            {step === 3 && 'New Password'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">
            {step === 1 && "Enter your email, and we'll log a recovery OTP code on the server terminal."}
            {step === 2 && 'Check the Node.js backend console logs for the 6-digit OTP code.'}
            {step === 3 && 'Choose a strong new password for your account.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-medium">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="farmer@agrivision.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Sending Code...' : 'Get OTP Code'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-medium">6-Digit OTP Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                className="w-full py-3 text-center tracking-[1em] text-2xl font-bold bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-medium">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-medium">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        )}

        <div className="mt-6 flex justify-center">
          <Link to="/login" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
