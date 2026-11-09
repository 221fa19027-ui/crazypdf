import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Upload, Check, RotateCcw, X } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignatureReady: (signatureData: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSignatureReady }) => {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [fontStyle, setFontStyle] = useState('font-serif italic');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (tab === 'draw' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [tab, isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleApply = () => {
    if (tab === 'draw' && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSignatureReady(dataUrl);
    } else if (tab === 'type') {
      onSignatureReady(typedName || 'Electronic Signature');
    }
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSignatureReady(event.target.result as string);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Create Your Signature</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => setTab('draw')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'draw' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-electric-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Draw
          </button>
          <button
            type="button"
            onClick={() => setTab('type')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'type' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-electric-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Type className="w-3.5 h-3.5" /> Type
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'upload' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-electric-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>

        {/* Tab 1: Draw */}
        {tab === 'draw' && (
          <div className="space-y-3">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-2 overflow-hidden flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={440}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full bg-white dark:bg-slate-900 rounded-xl cursor-crosshair border border-dashed border-slate-300 dark:border-slate-700"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Sign directly using your finger, stylus or mouse</span>
              <button
                type="button"
                onClick={clearCanvas}
                className="flex items-center gap-1 text-slate-500 hover:text-red-500"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear canvas
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Type */}
        {tab === 'type' && (
          <div className="space-y-4">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Enter your full name or initials..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <p className={`text-3xl text-brand-700 dark:text-electric-400 ${fontStyle}`}>
                {typedName || 'Your Signature'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Upload */}
        {tab === 'upload' && (
          <div className="space-y-3">
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 transition-colors">
              <Upload className="w-8 h-8 text-brand-600 mb-2" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload signature image</p>
              <p className="text-xs text-slate-400">PNG or JPG with transparent background recommended</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 max-w-[260px]">
            Visual signature overlay. Not represented as a legally certified cryptographical digital certificate.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20"
            >
              <Check className="w-3.5 h-3.5" /> Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
