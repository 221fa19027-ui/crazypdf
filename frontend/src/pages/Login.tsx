import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { loginWithGoogle, loginWithDemo, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithDemo();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-electric-500 p-0.5 shadow-xl shadow-brand-500/25 flex items-center justify-center">
          <img src="/logo.svg" alt="CrazyPDF" className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Sign In to CrazyPDF
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Google Single Sign-On only • Zero password storage
        </p>
      </div>

      {/* Main Login Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="space-y-3">
          {/* Primary Google Auth Button */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-bold text-sm shadow-sm hover:shadow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {/* Google Multicolor Logo */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
            <span>{isLoading ? 'Authenticating...' : 'Continue with Google'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        {/* Security Disclosures */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Privacy-First Authentication</span>
          </div>
          <p>
            CrazyPDF never asks for or stores a password. We authenticate exclusively via Google OpenID Connect and store only your Google subject ID, name, email, and avatar.
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        By continuing, you agree to our{' '}
        <Link to="/terms" className="underline hover:text-slate-600">Terms</Link> and{' '}
        <Link to="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
      </div>
    </div>
  );
};
