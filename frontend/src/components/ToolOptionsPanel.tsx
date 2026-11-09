import React from 'react';
import { Sliders, Lock, ShieldAlert, Sparkles, Languages, Type, Image as ImageIcon } from 'lucide-react';

interface ToolOptionsPanelProps {
  toolSlug: string;
  options: Record<string, any>;
  onOptionsChange: (newOptions: Record<string, any>) => void;
}

export const ToolOptionsPanel: React.FC<ToolOptionsPanelProps> = ({
  toolSlug,
  options,
  onOptionsChange,
}) => {
  const updateOption = (key: string, value: any) => {
    onOptionsChange({ ...options, [key]: value });
  };

  // Compress PDF options
  if (toolSlug === 'compress-pdf') {
    const currentMode = options.mode || 'recommended';
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Sliders className="w-4 h-4 text-brand-600" />
          <span>Compression Level</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'extreme', title: 'Extreme Compression', desc: 'Smallest file size, lower image quality (72 DPI)' },
            { id: 'recommended', title: 'Recommended', desc: 'Balanced compression & crisp readability (130 DPI)' },
            { id: 'low', title: 'Low Compression', desc: 'Highest visual fidelity with modest size reduction' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => updateOption('mode', mode.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                currentMode === mode.id
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-slate-900 dark:text-white ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white">{mode.title}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{mode.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Split PDF options
  if (toolSlug === 'split-pdf') {
    const mode = options.mode || 'range';
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Split Settings</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input
              type="radio"
              name="split_mode"
              checked={mode === 'range'}
              onChange={() => updateOption('mode', 'range')}
              className="text-brand-600 focus:ring-brand-500"
            />
            <span>Extract Page Ranges</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input
              type="radio"
              name="split_mode"
              checked={mode === 'all'}
              onChange={() => updateOption('mode', 'all')}
              className="text-brand-600 focus:ring-brand-500"
            />
            <span>Split Every Page into ZIP</span>
          </label>
        </div>

        {mode === 'range' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Page Range (e.g., 1-3, 5, 7-end)
            </label>
            <input
              type="text"
              value={options.ranges || '1-end'}
              onChange={(e) => updateOption('ranges', e.target.value)}
              placeholder="1-3, 5"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        )}
      </div>
    );
  }

  // Rotate PDF options
  if (toolSlug === 'rotate-pdf') {
    const angle = options.angle || 90;
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Rotation Angle</p>
        <div className="flex gap-3">
          {[90, 180, 270].map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => updateOption('angle', deg)}
              className={`flex-1 py-3 rounded-2xl border font-bold text-sm transition-all ${
                angle === deg
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {deg}° Clockwise
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Protect PDF options
  if (toolSlug === 'protect-pdf') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Lock className="w-4 h-4 text-brand-600" />
          <span>AES-256 Document Encryption</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Set Document Password
          </label>
          <input
            type="password"
            value={options.password || ''}
            onChange={(e) => updateOption('password', e.target.value)}
            placeholder="Enter strong password..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>
    );
  }

  // Unlock PDF options
  if (toolSlug === 'unlock-pdf') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Authorized Document Decryption</p>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Current Document Password
          </label>
          <input
            type="password"
            value={options.password || ''}
            onChange={(e) => updateOption('password', e.target.value)}
            placeholder="Enter the password to remove encryption..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>
    );
  }

  // Watermark PDF options
  if (toolSlug === 'watermark-pdf') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Watermark Configuration</p>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Watermark Text
          </label>
          <input
            type="text"
            value={options.text || 'CONFIDENTIAL'}
            onChange={(e) => updateOption('text', e.target.value)}
            placeholder="CONFIDENTIAL, DRAFT, SAMPLE..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Rotation: {options.rotation || 45}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={options.rotation || 45}
              onChange={(e) => updateOption('rotation', parseInt(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Font Size: {options.font_size || 48}pt
            </label>
            <input
              type="range"
              min="20"
              max="96"
              step="4"
              value={options.font_size || 48}
              onChange={(e) => updateOption('font_size', parseInt(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>
        </div>
      </div>
    );
  }

  // Redact PDF options
  if (toolSlug === 'redact-pdf') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Permanent Content Redaction</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Words or Terms to Purge (comma-separated)
          </label>
          <input
            type="text"
            value={options.terms || ''}
            onChange={(e) => updateOption('terms', e.target.value)}
            placeholder="e.g. Confidential, Password, SSN, Secret"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Note: Content is irreversibly deleted from underlying vector streams.
          </p>
        </div>
      </div>
    );
  }

  // Translate PDF options
  if (toolSlug === 'translate-pdf') {
    const languages = ['Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Portuguese', 'Hindi', 'Arabic'];
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Languages className="w-4 h-4 text-brand-600" />
          <span>Target Language</span>
        </div>
        <select
          value={options.language || 'Spanish'}
          onChange={(e) => updateOption('language', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    );
  }

  // HTML to PDF options
  if (toolSlug === 'html-to-pdf') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Convert Web URL or Upload File</p>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Website URL (SSRF Protected)
          </label>
          <input
            type="url"
            value={options.url || ''}
            onChange={(e) => updateOption('url', e.target.value)}
            placeholder="https://example.com/article"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>
    );
  }

  // Add page numbers
  if (toolSlug === 'add-page-numbers') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Page Numbering Placement</p>
        <div className="grid grid-cols-3 gap-2">
          {['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => updateOption('position', pos)}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize ${
                (options.position || 'bottom-center') === pos
                  ? 'border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600'
              }`}
            >
              {pos.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
