import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: November 2026
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Service Description</h2>
          <p>
            CrazyPDF provides web-based document processing, conversion, compression, organization, editing, and security utilities. The service is provided on an "as-is" and "as-available" basis.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Acceptable Use</h2>
          <p>
            Users agree not to use the service to process, distribute, or generate malware, copyrighted materials without authorization, unlawful content, or to execute denial-of-service or SSRF probe attacks against internal networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Temporary Storage Notice</h2>
          <p>
            Because CrazyPDF does not maintain permanent document backups, users are solely responsible for retaining original copies of their files before processing. We bear no liability for documents purged pursuant to our 60-minute automatic ephemeral lifecycle policy.
          </p>
        </section>
      </div>
    </div>
  );
};
