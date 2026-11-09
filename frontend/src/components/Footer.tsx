import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Lock, Trash2, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#080c14] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm mt-20 transition-colors">
      {/* Privacy Banner Highlight */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 text-white py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-electric-500/20 border border-electric-400/30 flex items-center justify-center text-electric-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-100">Zero Permanent Document Storage Policy</p>
              <p className="text-xs text-slate-300">
                Your documents belong to you. We automatically shred and delete all uploaded and processed files within 60 minutes.
              </p>
            </div>
          </div>
          <Link
            to="/security"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white backdrop-blur transition-all"
          >
            <span>Learn About Our Security</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-electric-500 p-0.5 flex items-center justify-center">
                <img src="/logo.svg" alt="CrazyPDF" className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Crazy<span className="text-brand-600 dark:text-electric-400">PDF</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              The premier online workspace for converting, compressing, editing, organizing, and securing your documents. Fast, secure, and crazy-simple.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-bit AES</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5 text-brand-500" />
                <span>Auto-Purged</span>
              </div>
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/tools/merge-pdf" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Merge PDF</Link></li>
              <li><Link to="/tools/compress-pdf" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Compress PDF</Link></li>
              <li><Link to="/tools/pdf-to-word" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">PDF to Word</Link></li>
              <li><Link to="/tools/pdf-to-jpg" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">PDF to JPG</Link></li>
              <li><Link to="/tools/jpg-to-pdf" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">JPG to PDF</Link></li>
              <li><Link to="/tools/edit-pdf" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Edit PDF</Link></li>
            </ul>
          </div>

          {/* Tool Categories */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/tools?category=organize" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Organize PDF</Link></li>
              <li><Link to="/tools?category=optimize" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Optimize PDF</Link></li>
              <li><Link to="/tools?category=convert-from" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Convert from PDF</Link></li>
              <li><Link to="/tools?category=convert-to" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Convert to PDF</Link></li>
              <li><Link to="/tools?category=security" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">PDF Security</Link></li>
              <li><Link to="/tools?category=ai" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">AI PDF Tools</Link></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/security" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Security Architecture</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-brand-600 dark:hover:text-electric-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} CrazyPDF. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with precision for documents everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
