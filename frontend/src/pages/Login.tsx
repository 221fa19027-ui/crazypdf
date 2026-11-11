import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Lock, Sparkles, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

export const Login: React.FC = () => {
  const { loginWithGoogle, loginWithDemo, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('No credential received from Google.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google token validation failed.');
    } finally {
      setIsLoading(false);
    }
  };

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
          Official Google Single Sign-On • Zero password storage
        </p>
      </div>

      {/* Main Login Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="space-y-4">
          {/* Official Google Identity Services Button */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in was cancelled or encountered an error.')}
              useOneTap
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
              shape="pill"
              size="large"
              text="continue_with"
              width="360"
            />
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or fast testing</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Quick Demo Sign In Button */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-dashed border-brand-300 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/30 hover:bg-brand-100/50 text-brand-700 dark:text-brand-300 font-semibold text-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>One-Click Demo Google Account (Instant Preview)</span>
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
