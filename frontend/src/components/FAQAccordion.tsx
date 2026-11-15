import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Are my uploaded documents stored permanently on your servers?',
    answer: 'No. CrazyPDF operates under a strict zero permanent storage policy. Uploaded files and generated results are saved only in an isolated temporary job directory, and are permanently wiped by an automated server cleanup task within sixty minutes.',
  },
  {
    question: 'Do I need to sign up or create an account to use the tools?',
    answer: 'No. CrazyPDF requires zero registration or sign-in. You can use all thirty-four PDF tools immediately with zero personal information, emails, or passwords collected.',
  },
  {
    question: 'Can I use CrazyPDF tools without creating an account?',
    answer: 'Yes. All basic tools including Merge, Split, Compress, and Conversion are available immediately to guests with zero friction. Signing in with Google gives you access to a personal processing dashboard, usage analytics, and higher rate limits.',
  },
  {
    question: 'What is the maximum file size limit?',
    answer: 'Standard document processing supports files up to 50 MB per file, which comfortably accommodates long books, high resolution scans, and large presentations.',
  },
  {
    question: 'How does PDF compression work without ruining quality?',
    answer: 'We provide three distinct compression tiers: Extreme (downsampled images for smallest email size), Recommended (lossless object stream compression with crisp text readability at 130 DPI), and Low (minimal size reduction preserving print fidelity).',
  },
  {
    question: 'Is redaction permanent or can blacked-out text be uncovered?',
    answer: 'Redaction in CrazyPDF is truly permanent. It sanitizes and irreversibly purges the underlying text streams, vector paths, and metadata, rather than merely drawing a black rectangle over the page.',
  },
  {
    question: 'How do the AI PDF tools work?',
    answer: 'Our AI summarizer, translator, and document chat extract text blocks directly from your document pages to produce executive summaries, key takeaways, and question responses with verifiable page references.',
  },
  {
    question: 'Do you sell or share document metadata?',
    answer: 'Never. Document metadata and file contents are never sold, shared, or retained beyond the sixty minute temporary processing lifecycle.',
  },
];

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#181818] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen ? 'rotate-180 text-brand-600 dark:text-electric-400' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-[#272727]/60 animate-in fade-in duration-200">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
