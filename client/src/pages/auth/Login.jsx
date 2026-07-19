import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-emerald-50 via-teal-50 to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 px-4">
      {/* Background blobs for premium depth */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-300 dark:bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-300 dark:bg-teal-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>

      <div className="w-full max-w-md glass-premium p-8 rounded-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/30 text-white mb-3">
            <Sprout className="h-8 w-8 animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">AgriVision AI</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Smart Crop Disease Detection</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="farmer@agrivision.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
