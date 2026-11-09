import React from 'react';
import { HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: 'How does CrazyPDF guarantee my documents remain private?',
      a: 'We implement zero permanent storage. Files are assigned randomized UUID directories on isolated ephemeral disk space and are automatically purged after 60 minutes or immediately upon download. We never inspect, index, or store document text.',
    },
    {
      q: 'Why does CrazyPDF only use Google OAuth?',
      a: 'Traditional username/password authentication is prone to credential stuffing, weak passwords, and phishing. By delegating authentication exclusively to Google OAuth 2.0 with OpenID Connect, we guarantee enterprise-grade session security without storing user passwords.',
    },
    {
      q: 'Can I compress my PDF without losing text sharpness?',
      a: 'Yes. Our "Recommended" compression mode targets high-resolution downsampling and font/object stream deflation without sacrificing text vectors or clarity. For maximum file size reduction, "Extreme" is also available.',
    },
    {
      q: 'What is the maximum file size supported?',
      a: 'CrazyPDF supports files up to 50 MB per document on our standard tier.',
    },
    {
      q: 'What happens if a damaged or corrupted PDF is uploaded to Repair PDF?',
      a: 'Our repair processor analyzes the cross-reference table, attempts stream salvage, and rebuilds the PDF object graph. If the file cannot be salvaged, we display a clear diagnostic error.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-slate-500">
          Everything you need to know about CrazyPDF tools, security, and formats.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
          >
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
