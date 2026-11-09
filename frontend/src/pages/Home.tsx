import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ALL_TOOLS, TOOL_CATEGORIES, type ToolCategory 
} from '../types/tools';
import { ToolCard } from '../components/ToolCard';
import { 
  ArrowRight, ShieldCheck, Zap, Lock, Sparkles, 
  Trash2, FileCheck2, Cpu, CheckCircle2, ChevronRight, HelpCircle 
} from 'lucide-react';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const navigate = useNavigate();

  const popularTools = ALL_TOOLS.filter((t) => t.isPopular);
  const displayedTools = selectedCategory === 'all' 
    ? ALL_TOOLS 
    : ALL_TOOLS.filter((t) => t.category === selectedCategory);

  const handleHeroDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Navigate to compress or merge by default
      navigate('/tools/compress-pdf');
    }
  };

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-brand-500/15 via-electric-500/15 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-bold tracking-wide animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Next-Generation Online PDF Suite</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-electric-600 dark:text-electric-400">Zero Storage Policy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Everything You Need to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-electric-500 bg-clip-text text-transparent">
              Work With PDFs.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Convert, compress, edit, merge, sign and secure your documents with powerful PDF tools. 
            Everything you need in one crazy-simple workspace.
          </p>

          {/* Quick Hero Dropzone & Fast Upload */}
          <div className="pt-4 max-w-xl mx-auto">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleHeroDrop}
              onClick={() => navigate('/tools/compress-pdf')}
              className="group border-2 border-dashed border-brand-400/60 dark:border-brand-600/40 hover:border-brand-600 dark:hover:border-electric-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-electric-500 text-white flex items-center justify-center shadow-md shadow-brand-500/25 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <p className="font-extrabold text-base text-slate-900 dark:text-white">
                  Drop a PDF here to start processing instantly
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Or select any of our 34 specialized tools below
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs font-bold text-brand-600 dark:text-electric-400">
                <span>Browse Files</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Trust stats pill */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Ephemeral Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand-500" />
              <span>Google OAuth Single Sign-On</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Auto-Purged After 60 Mins</span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-electric-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Most Used Everyday</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular PDF Tools
            </h2>
          </div>
          <Link
            to="/tools"
            className="flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-electric-400 hover:gap-2.5 transition-all"
          >
            <span>View all 34 tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* COMPLETE TOOLKIT BROWSER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            The Complete Document Toolkit
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every task, every format, and every transformation. Grouped cleanly by purpose.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              All Tools (34)
            </button>
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-500/20 text-electric-300 text-xs font-bold border border-electric-500/30">
              <Zap className="w-3.5 h-3.5" />
              <span>Crazy-Simple Workflow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Three Steps. Zero Hassle.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Engineered so you never have to wait through slow uploads or complex configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-lg text-white">Upload Your Files</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drag and drop your documents into any tool. Documents are encrypted and saved only into an isolated temporary workspace.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-electric-500 text-white font-black text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-lg text-white">Select Your Options</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Configure compression ratios, reorder pages, adjust watermark parameters, or enter AI queries in real-time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-lg text-white">Download & Clean Up</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Download your transformed document via short-lived token. Inputs and outputs are automatically purged from the server.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE CRAZYPDF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Professionals Choose CrazyPDF
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Built for security-minded individuals, legal professionals, and fast-moving teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Zero Permanent Storage</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Unlike other platforms that quietly retain your PDF files on cloud buckets, CrazyPDF runs an automated lifecycle worker that permanently shreds files within 60 minutes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">High-Speed Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Powered by PyMuPDF and C-accelerated document libraries, providing sub-second conversions and compression with flawless visual fidelity.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Integrated AI Capabilities</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Summarize massive contracts, extract key action items, translate languages, and chat directly with your documents using verifiable page references.
            </p>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Have questions about document security or file limits? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Are my uploaded documents stored permanently?',
              a: 'No. CrazyPDF strictly operates under a zero permanent document retention policy. Files are kept temporarily in an isolated job sandbox and automatically shredded and deleted within 60 minutes.',
            },
            {
              q: 'What authentication methods does CrazyPDF support?',
              a: 'CrazyPDF uses Google OAuth 2.0 with OpenID Connect as its sole login method. We do not store passwords, avoiding traditional credential leaks or password reset vulnerabilities.',
            },
            {
              q: 'Can I process documents without creating an account?',
              a: 'Yes! All basic PDF tools are accessible to guest users immediately. Logging in with Google unlocks your personal dashboard, activity metadata, and higher rate limits.',
            },
            {
              q: 'Is there a file size limit?',
              a: 'Standard uploads are supported up to 50 MB per file, allowing you to comfortably merge, compress, or convert even heavy graphic-rich documents.',
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
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
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-tr from-brand-700 via-brand-600 to-electric-600 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Start Working With Your PDFs Today.
          </h2>
          <p className="text-brand-100 max-w-xl mx-auto text-sm leading-relaxed">
            Join thousands of students, developers, and professionals who rely on CrazyPDF for crazy-simple document processing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/tools"
              className="px-6 py-3 rounded-xl bg-white text-brand-900 font-extrabold text-sm shadow-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
            >
              Explore All 34 Tools
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-brand-950/40 hover:bg-brand-950/60 text-white font-extrabold text-sm border border-white/20 transition-all"
            >
              Continue with Google
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
