import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, Moon, ChevronDown, Sparkles, Shield, User, 
  LogOut, LayoutDashboard, Menu, X, Zap 
} from 'lucide-react';
import { TOOL_CATEGORIES } from '../types/tools';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 dark:bg-[#0b0f19]/85 backdrop-blur-md dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-electric-500 p-0.5 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <img src="/logo.svg" alt="CrazyPDF" className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight leading-none text-slate-900 dark:text-white">
              Crazy<span className="bg-gradient-to-r from-brand-600 to-electric-500 bg-clip-text text-transparent">PDF</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider uppercase text-slate-600 dark:text-slate-400">
              Workspace
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link 
            to="/" 
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              location.pathname === '/' 
                ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40' 
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Home
          </Link>

          {/* Tools Mega Dropdown */}
          <div className="relative" onMouseLeave={() => setToolsDropdownOpen(false)}>
            <button
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              All PDF Tools
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180 text-brand-600' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 w-80 mt-1 p-2 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 grid gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  to="/tools"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="p-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                >
                  <span>Explore All 34 Tools</span>
                  <Zap className="w-3.5 h-3.5" />
                </Link>
                {TOOL_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/tools?category=${cat.id}`}
                    onClick={() => setToolsDropdownOpen(false)}
                    className="p-2 rounded-xl flex items-start gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 mt-0.5">
                      <Sparkles className="w-4 h-4 text-brand-600 dark:text-electric-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{cat.title}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{cat.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/tools?category=convert-from"
            className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Convert PDF
          </Link>

          <Link
            to="/tools/edit-pdf"
            className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Edit PDF
          </Link>

          <Link
            to="/tools?category=ai"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-brand-600 dark:text-electric-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI Tools
          </Link>

          <Link
            to="/security"
            className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Security
          </Link>

          <Link
            to="/pricing"
            className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Right side controls: Theme toggle & Auth */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Authentication State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:ring-2 hover:ring-brand-500/30 transition-all"
              >
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-brand-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-600" />
                    Dashboard
                  </Link>
                  <Link
                    to="/security"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Shield className="w-4 h-4 text-electric-500" />
                    Privacy & Storage
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-brand-600 text-white font-semibold text-sm shadow-md hover:bg-slate-800 dark:hover:bg-brand-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Google G icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.9.7 5.5 1.9 7.9l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>Continue with Google</span>
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            All PDF Tools (34 Tools)
          </Link>
          <Link
            to="/tools/edit-pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Edit PDF
          </Link>
          <Link
            to="/tools?category=ai"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-brand-600 dark:text-electric-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            AI PDF Tools
          </Link>
          <Link
            to="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Security & Privacy
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Pricing
          </Link>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40"
            >
              My Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-semibold text-center bg-brand-600 text-white"
            >
              Sign In with Google
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
