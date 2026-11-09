import React from 'react';
import { ShieldCheck, Lock, Trash2 } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Effective Date: November 2026 • Version 1.0
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-emerald-600" />
            <span>1. Zero Permanent Document Retention</span>
          </h2>
          <p>
            CrazyPDF does not store, monetize, index, or back up the files you upload or the documents we generate. All files are written exclusively to isolated, ephemeral storage sandboxes and are permanently erased upon successful user download or after a maximum window of 60 minutes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-600" />
            <span>2. Account Information</span>
          </h2>
          <p>
            When you sign in using Google OAuth, we receive your Google Subject Identifier (`sub`), verified name, email address, and profile picture avatar. We do not receive, store, or process any password credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-electric-600" />
            <span>3. No Data Selling</span>
          </h2>
          <p>
            We never sell, rent, or trade your personal information or document contents to advertisers, third parties, or data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Encryption in Transit</h2>
          <p>
            All network communication with CrazyPDF occurs over TLS 1.3 encryption with strict HTTP Strict Transport Security (HSTS) headers enabled.
          </p>
        </section>
      </div>
    </div>
  );
};
