import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ALL_TOOLS, TOOL_CATEGORIES, type ToolCategory 
} from '../types/tools';
import { ToolCard } from '../components/ToolCard';
import { TaglineReveal } from '../components/TaglineReveal';
import { FAQAccordion } from '../components/FAQAccordion';
import { 
  ArrowRight, ShieldCheck, Zap, Lock, Sparkles, 
  Trash2, Cpu, CheckCircle2, Search, FileText, 
  Layers, KeyRound, Clock, ShieldAlert, X
} from 'lucide-react';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDraggingHero, setIsDraggingHero] = useState(false);
  const navigate = useNavigate();

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesSearch = 
        !searchQuery.trim() ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.acceptedFileTypes.some((ext) => ext.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleHeroDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingHero(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Default to compress-pdf for instant processing
      navigate('/tools/compress-pdf');
    }
  };

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      navigate('/tools/compress-pdf');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* ─── 1. HERO SECTION (Above the fold) ─────────────────────────── */}
      <section className="pt-10 sm:pt-16 pb-6 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#272727] text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Thirty-four professional tools</span>
            <span className="text-slate-400">•</span>
            <span className="text-brand-600 dark:text-electric-400">Zero permanent storage</span>
          </div>

          {/* Headline (Skill B5: max 680px, left-to-right text gradient, meaningful line break) */}
          <h1
            className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1] max-w-[680px] mx-auto hero-heading-gradient"
            style={{ textWrap: 'balance' }}
          >
            Every PDF tool you need. <br />
            Zero permanent storage.
          </h1>

          {/* Subheadline (Skill B5: max 680px, outcome-driven, no hyphens) */}
          <p
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-[680px] mx-auto leading-relaxed"
            style={{ textWrap: 'pretty' }}
          >
            Convert, compress, edit, merge, sign, and secure your documents with single click simplicity. 
            All files are processed in isolated memory and automatically shredded within sixty minutes.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#toolkit-section"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
            >
              <span>Explore All 34 Tools</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#181818] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1f1f1f] font-semibold text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.9.7 5.5 1.9 7.9l3.7-2.9z" />
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
              </svg>
              <span>Continue with Google</span>
            </Link>
          </div>

          {/* Interactive Fast Dropzone */}
          <div className="pt-4 max-w-xl mx-auto">
            <label
              onDragOver={(e) => { e.preventDefault(); setIsDraggingHero(true); }}
              onDragLeave={() => setIsDraggingHero(false)}
              onDrop={handleHeroDrop}
              className={`block border-2 border-dashed rounded-3xl p-8 sm:p-10 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isDraggingHero
                  ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/30 scale-[1.01]'
                  : 'border-slate-300 dark:border-[#272727] bg-white dark:bg-[#181818] hover:border-brand-500/70 hover:shadow-md'
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleHeroFileChange}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    Drop your PDF here for instant processing
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Or select any of our specialized tools below
                  </p>
                </div>
                <div className="pt-1 text-xs font-semibold text-brand-600 dark:text-electric-400 flex items-center gap-1">
                  <span>Browse files on your device</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </label>
          </div>

          {/* Quick-Start Tool Chips */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-slate-400 mr-1">Popular right now:</span>
            {[
              { slug: 'merge-pdf', title: 'Merge PDF' },
              { slug: 'compress-pdf', title: 'Compress PDF' },
              { slug: 'pdf-to-word', title: 'PDF to Word' },
              { slug: 'edit-pdf', title: 'Edit PDF' },
              { slug: 'ocr-pdf', title: 'OCR PDF' },
            ].map((t) => (
              <Link
                key={t.slug}
                to={`/tools/${t.slug}`}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-electric-400 transition-colors"
              >
                {t.title}
              </Link>
            ))}
          </div>

          {/* Trust Points Row */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Ephemeral Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand-500" />
              <span>Google OAuth Single Sign On</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Auto-Shredded After 60 Mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-electric-500" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. COMPLETE PDF TOOLKIT (Interactive Explorer) ──────────── */}
      <section id="toolkit-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-electric-400">
            Complete Toolkit
          </p>
          <h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white"
            style={{ textWrap: 'balance' }}
          >
            Thirty-four tools for every document task
          </h2>
          <p
            className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
            style={{ textWrap: 'pretty' }}
          >
            Organize pages, compress file size, convert across formats, edit content, and secure confidential data.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Live Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all 34 tools by name, action or format (e.g. merge, word, compress, ocr, password)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs with Item Counts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              All Tools ({ALL_TOOLS.length})
            </button>
            {TOOL_CATEGORIES.map((cat) => {
              const count = ALL_TOOLS.filter((t) => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {cat.title} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3 bg-white dark:bg-[#181818] rounded-2xl border border-slate-200 dark:border-[#272727] max-w-lg mx-auto">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No tools matched "{searchQuery}"</p>
            <p className="text-xs text-slate-500">Try searching for compress, split, docx, excel, or rotate.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-1.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 text-xs font-semibold"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* ─── 3. MANDATORY TAGLINE REVEAL (Skill B11 specification) ────── */}
      <TaglineReveal
        text="All your documents are automatically shredded within sixty minutes. Zero permanent storage, zero data tracking, and zero subscription traps."
        subtext="Built from the ground up on modern cryptographic principles and C-accelerated document processing engines."
      />

      {/* ─── 4. THE PROBLEM TO SOLUTION (Comparison Matrix) ──────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#181818] p-8 sm:p-12 space-y-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-electric-400">
              Honest Architecture
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white"
              style={{ textWrap: 'balance' }}
            >
              Why professionals switch from legacy PDF tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Most online PDF services silently retain your private files on third party servers, sell your metadata, or hit you with recurring subscription traps. Here is how CrazyPDF is fundamentally different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Cloud PDF Converters */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131209] border border-slate-200/80 dark:border-[#272727] space-y-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>Traditional PDF Websites</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Documents stored indefinitely on shared cloud buckets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Require email and password accounts susceptible to leaks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Deceptive paywalls charging recurring fees for basic file saves</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Fake black-box redaction that merely paints a rectangle over text</span>
                </li>
              </ul>
            </div>

            {/* CrazyPDF Standard */}
            <div className="p-6 rounded-2xl bg-brand-50/40 dark:bg-[#1f1f1f] border border-brand-200/80 dark:border-brand-800/40 space-y-4">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>The CrazyPDF Standard</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Zero permanent storage: automated 60-minute shredder purges all files</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Official Google OAuth with OpenID Connect: zero stored passwords</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Free, instantaneous access to all basic tools with no credit cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>True cryptographic redaction: vector streams and text permanently wiped</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. HOW IT WORKS (3 Concrete Steps) ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-electric-400">
            Simple Workflow
          </p>
          <h2
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white"
            style={{ textWrap: 'balance' }}
          >
            Three steps. Zero waiting.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Engineered so you never have to wait through slow queues or complex configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Drop or Select Your Files
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload your documents to any tool. Files are assigned a random UUID and stored exclusively in an isolated ephemeral execution sandbox.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-electric-50 text-electric-600 dark:bg-electric-950/60 dark:text-electric-400 font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Configure & Process Instantly
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Adjust compression ratio, reorder pages, stamp watermarks, or extract searchable text. Processing completes in milliseconds using C-accelerated PyMuPDF.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Download & Automatic Shred
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Retrieve your clean output document via secure token. The background lifecycle worker automatically shreds and purges both input and output files.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 6. BENEFIT DEEP-DIVES (3 Outcome-Driven Benefits) ────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-electric-400">
            Engineered For Excellence
          </p>
          <h2
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white"
            style={{ textWrap: 'balance' }}
          >
            Built for security-minded teams and everyday users
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              High-Speed Native Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Powered by PyMuPDF and modern C routines, providing sub-second conversions, lossless compression, and accurate vector rendering without cloud round-trip latency.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              AES-256 Military Encryption
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Lock sensitive documents with standard 256-bit AES encryption, or perform true permanent redaction that purges underlying object streams from memory forever.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              AI Document Intelligence
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Summarize multi-page legal agreements, translate across twelve international languages, and interrogate complex reports with interactive question answering.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 7. FREQUENTLY ASKED QUESTIONS (Accordion) ───────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-electric-400">
            Clear Answers
          </p>
          <h2
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white"
            style={{ textWrap: 'balance' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Everything you need to know about document security, file limits, and privacy.
          </p>
        </div>

        <FAQAccordion />
      </section>

      {/* ─── 8. FINAL CONVERSION BANNER (A2 & Risk Reversal) ─────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#181818] p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white"
              style={{ textWrap: 'balance' }}
            >
              Start processing your documents today
            </h2>
            <p
              className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
              style={{ textWrap: 'pretty' }}
            >
              No downloads, no subscriptions, and zero permanent storage. Pick any tool and get your work done in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#toolkit-section"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
            >
              Explore All 34 Tools
            </a>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#272727] bg-slate-50 dark:bg-[#1f1f1f] text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-[#272727] transition-all duration-300"
            >
              Sign In with Google
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
