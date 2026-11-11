import React from 'react';
import { Sliders, Lock, ShieldAlert, Sparkles, Languages, ScanLine, Image as ImageIcon, Scissors } from 'lucide-react';

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

  // ─────────────────────────── COMPRESS PDF ───────────────────────────
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

  // ─────────────────────────── SPLIT PDF ───────────────────────────
  if (toolSlug === 'split-pdf') {
    const mode = options.mode || 'range';
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Scissors className="w-4 h-4 text-brand-600" />
          <span>Split Settings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'range',
              title: 'Extract Page Range',
              desc: 'Extract selected pages into one PDF (e.g. 1-3, 5)',
            },
            {
              id: 'multi',
              title: 'Split by Ranges → ZIP',
              desc: 'Each comma-separated range becomes a separate PDF, all in one ZIP',
            },
            {
              id: 'all',
              title: 'Every Page → ZIP',
              desc: 'Split every single page into individual PDFs, packed in a ZIP',
            },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => updateOption('mode', m.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                mode === m.id
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white">{m.title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.desc}</p>
            </button>
          ))}
        </div>

        {(mode === 'range' || mode === 'multi') && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {mode === 'multi'
                ? 'Page Ranges (each range = one PDF) — e.g. 1-3, 4-6, 7-end'
                : 'Page Range to Extract — e.g. 1-3, 5, 7-end'}
            </label>
            <input
              type="text"
              value={options.ranges || '1-end'}
              onChange={(e) => updateOption('ranges', e.target.value)}
              placeholder={mode === 'multi' ? '1-3, 4-6, 7-end' : '1-3, 5'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-mono"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Use commas to separate ranges. <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">end</code> refers to the last page.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────── ROTATE PDF ───────────────────────────
  if (toolSlug === 'rotate-pdf') {
    const angle = options.angle || 90;
    const target = options.target || 'all';
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Rotation Settings</p>
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Rotation Angle</p>
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
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Apply To</p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Pages' },
              { id: 'odd', label: 'Odd Pages' },
              { id: 'even', label: 'Even Pages' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => updateOption('target', t.id)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  target === t.id
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────── CROP PDF ───────────────────────────
  if (toolSlug === 'crop-pdf') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Crop Margins (in points)</p>
        <div className="grid grid-cols-2 gap-4">
          {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
            <div key={side}>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 capitalize">
                {side}: {options[side] ?? 20}pt
              </label>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={options[side] ?? 20}
                onChange={(e) => updateOption(side, parseInt(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">Values are in PDF points (72 pt = 1 inch).</p>
      </div>
    );
  }

  // ─────────────────────────── PDF TO JPG / PNG ───────────────────────────
  if (toolSlug === 'pdf-to-jpg' || toolSlug === 'pdf-to-png') {
    const dpi = options.dpi || 150;
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <ImageIcon className="w-4 h-4 text-brand-600" />
          <span>Image Quality Settings</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Resolution: {dpi} DPI
          </label>
          <input
            type="range"
            min="72"
            max="300"
            step="1"
            value={dpi}
            onChange={(e) => updateOption('dpi', parseInt(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>72 DPI (small file)</span>
            <span>150 DPI (balanced)</span>
            <span>300 DPI (print quality)</span>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Multi-page PDFs are packaged into a ZIP archive. Single pages are downloaded directly.
        </p>
      </div>
    );
  }

  // ─────────────────────────── OCR PDF ───────────────────────────
  if (toolSlug === 'ocr-pdf') {
    const languages = [
      { code: 'eng', label: 'English' },
      { code: 'fra', label: 'French' },
      { code: 'deu', label: 'German' },
      { code: 'spa', label: 'Spanish' },
      { code: 'por', label: 'Portuguese' },
      { code: 'ita', label: 'Italian' },
      { code: 'jpn', label: 'Japanese' },
      { code: 'chi_sim', label: 'Chinese (Simplified)' },
      { code: 'ara', label: 'Arabic' },
      { code: 'hin', label: 'Hindi' },
    ];
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <ScanLine className="w-4 h-4 text-brand-600" />
          <span>OCR Language</span>
        </div>
        <select
          value={options.language || 'eng'}
          onChange={(e) => updateOption('language', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-400">
          Select the primary language of your scanned document for best OCR accuracy.
        </p>
      </div>
    );
  }

  // ─────────────────────────── JPG / PNG TO PDF ───────────────────────────
  if (toolSlug === 'jpg-to-pdf' || toolSlug === 'png-to-pdf') {
    const orientation = options.orientation || 'portrait';
    const pageSize = options.page_size || 'A4';
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Page Settings</p>
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Page Orientation</p>
          <div className="flex gap-3">
            {[
              { id: 'portrait', label: 'Portrait' },
              { id: 'landscape', label: 'Landscape' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => updateOption('orientation', o.id)}
                className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition-all ${
                  orientation === o.id
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Page Size</p>
          <div className="flex flex-wrap gap-2">
            {['A4', 'A3', 'Letter', 'Legal'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updateOption('page_size', size)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  pageSize === size
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/40 text-brand-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Margin: {options.margin ?? 10}pt
          </label>
          <input
            type="range"
            min="0"
            max="72"
            step="2"
            value={options.margin ?? 10}
            onChange={(e) => updateOption('margin', parseInt(e.target.value))}
            className="w-full accent-brand-600"
          />
        </div>
      </div>
    );
  }

  // ─────────────────────────── SIGN PDF ───────────────────────────
  if (toolSlug === 'sign-pdf') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Signature Placement</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Apply to Page
            </label>
            <input
              type="number"
              min="1"
              value={options.page || 1}
              onChange={(e) => updateOption('page', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Typed Signature Text
            </label>
            <input
              type="text"
              value={options.signature_data || ''}
              onChange={(e) => updateOption('signature_data', e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              X Position (pt)
            </label>
            <input
              type="number"
              value={options.x || 100}
              onChange={(e) => updateOption('x', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Y Position (pt)
            </label>
            <input
              type="number"
              value={options.y || 650}
              onChange={(e) => updateOption('y', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Position is in PDF points from the top-left of the page (72 pt = 1 inch). The signature canvas editor above also lets you draw your signature directly.
        </p>
      </div>
    );
  }

  // ─────────────────────────── PROTECT PDF ───────────────────────────
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

  // ─────────────────────────── UNLOCK PDF ───────────────────────────
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

  // ─────────────────────────── WATERMARK PDF ───────────────────────────
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
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Opacity: {Math.round((options.opacity || 0.25) * 100)}%
          </label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={Math.round((options.opacity || 0.25) * 100)}
            onChange={(e) => updateOption('opacity', parseInt(e.target.value) / 100)}
            className="w-full accent-brand-600"
          />
        </div>
      </div>
    );
  }

  // ─────────────────────────── REDACT PDF ───────────────────────────
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

  // ─────────────────────────── TRANSLATE PDF ───────────────────────────
  if (toolSlug === 'translate-pdf') {
    const languages = ['Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Portuguese', 'Hindi', 'Arabic', 'Russian', 'Korean', 'Dutch'];
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
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ─────────────────────────── HTML TO PDF ───────────────────────────
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

  // ─────────────────────────── ADD PAGE NUMBERS ───────────────────────────
  if (toolSlug === 'add-page-numbers') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <p className="font-bold text-sm text-slate-900 dark:text-white">Page Numbering Settings</p>
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Placement</p>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Starting Number
            </label>
            <input
              type="number"
              min="1"
              value={options.start || 1}
              onChange={(e) => updateOption('start', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Font Size (pt)
            </label>
            <input
              type="number"
              min="6"
              max="24"
              value={options.font_size || 10}
              onChange={(e) => updateOption('font_size', parseFloat(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Number Format
          </label>
          <select
            value={options.format || 'Page {n} of {total}'}
            onChange={(e) => updateOption('format', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="Page {n} of {total}">Page 1 of 10</option>
            <option value="{n}">1</option>
            <option value="{n} / {total}">1 / 10</option>
            <option value="- {n} -">- 1 -</option>
          </select>
        </div>
      </div>
    );
  }

  // ─────────────────────────── AI SUMMARIZER ───────────────────────────
  if (toolSlug === 'ai-summarizer') {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>Summary Options</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Summary Type</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'short', label: 'Short Summary', desc: '2-3 sentence executive overview' },
              { id: 'detailed', label: 'Detailed Summary', desc: 'Comprehensive section-by-section analysis' },
              { id: 'bullets', label: 'Key Points', desc: 'Bulleted list of main takeaways and actions' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => updateOption('summary_type', m.id)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  (options.summary_type || 'short') === m.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 ring-2 ring-purple-400/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
                }`}
              >
                <p className="font-bold text-xs text-slate-900 dark:text-white">{m.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
