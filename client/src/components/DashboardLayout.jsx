import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  LayoutDashboard, 
  UploadCloud, 
  History as HistoryIcon, 
  UserCheck, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Globe,
  Store
} from 'lucide-react';
import Chatbot from './Chatbot';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  
  // Theme state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Language state
  const [lang, setLang] = useState(i18n.language || localStorage.getItem('lang') || 'en');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : lang === 'hi' ? 'mr' : 'en';
    setLang(nextLang);
    localStorage.setItem('lang', nextLang);
    i18n.changeLanguage(nextLang);
  };

  const navItems = [
    { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard, roles: ['farmer', 'expert', 'admin'] },
    { name: t('upload'), path: '/upload', icon: UploadCloud, roles: ['farmer', 'expert', 'admin'] },
    { name: t('history'), path: '/history', icon: HistoryIcon, roles: ['farmer', 'expert', 'admin'] },
    { name: t('stores'), path: '/stores', icon: Store, roles: ['farmer', 'expert', 'admin'] },
    { name: t('admin'), path: '/admin', icon: UserCheck, roles: ['admin'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeClass = "bg-emerald-600/10 text-emerald-600 border-r-4 border-emerald-500 font-semibold";
  const inactiveClass = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white";

  const getLanguageLabel = () => {
    if (lang === 'en') return 'EN';
    if (lang === 'hi') return 'हिं';
    return 'मरा';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2 bg-emerald-500 rounded-xl text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-none">AgriVision AI</h1>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Farmer Companion</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.filter(item => item.roles.includes(user?.role)).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? activeClass : inactiveClass}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-inner uppercase">
              {user?.name?.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
              {navItems.find(item => item.path === location.pathname)?.name || 'AgriVision AI'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-1.5 cursor-pointer font-semibold text-xs border border-slate-200 dark:border-slate-700"
              title="Change Language"
            >
              <Globe className="h-4 w-4" />
              <span>{getLanguageLabel()}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full animate-slide-in">
            <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
                  <Sprout className="h-5 w-5" />
                </div>
                <span className="font-bold text-slate-800 dark:text-white">AgriVision AI</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1.5">
              {navItems.filter(item => item.roles.includes(user?.role)).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? activeClass : inactiveClass}`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Floating FAQ Chatbot Assistant */}
      <Chatbot />
    </div>
  );
}
