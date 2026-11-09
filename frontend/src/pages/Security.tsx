import React from 'react';
import { 
  ShieldCheck, Lock, Trash2, Globe, Cpu, Server, 
  FileCheck2, AlertCircle, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Security: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Privacy First Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          How CrazyPDF Protects Your Documents.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          We built CrazyPDF around a non-negotiable principle: <br />
          <strong className="text-slate-900 dark:text-white">Your files are your private property. We never keep them.</strong>
        </p>
      </div>

      {/* Core Tenets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Zero Permanent Storage</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every document uploaded is assigned an isolated, randomized UUID folder in temporary volatile storage. Once your conversion is complete and downloaded—or after a maximum of 60 minutes—the input and output files are shredded permanently.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Google OAuth Authentication Only</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We eliminated traditional passwords completely. Users sign in exclusively using Google OpenID Connect with cryptographic token verification on the backend. This prevents password stuffing, rainbow tables, and credential stuffing vulnerabilities.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-electric-50 dark:bg-electric-950/50 text-electric-600 dark:text-electric-400 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">SSRF Sandboxing for Web Conversions</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Our HTML-to-PDF engine incorporates multi-layer SSRF guards. Internal IPs (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, AWS/GCP metadata endpoints like 169.254.169.254) are rejected before DNS resolution or connection establishment.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">True Irreversible Redaction</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike amateur PDF editors that simply draw a black rectangle on top of sensitive text, CrazyPDF removes the underlying vector text objects, metadata, and font glyph references completely so redactions can never be extracted.
          </p>
        </div>
      </div>

      {/* Security Headers Box */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4">
        <h3 className="text-xl font-bold">Standard Enterprise Security Headers</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Every HTTP response emitted by CrazyPDF includes Content-Security-Policy, Strict-Transport-Security (HSTS), X-Content-Type-Options: nosniff, and strict CORS headers preventing unauthorized framing or cross-site leakage.
        </p>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 hover:bg-brand-500 transition-all"
        >
          <span>Try CrazyPDF Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
