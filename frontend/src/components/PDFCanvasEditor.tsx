import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Type, Square, Highlighter, Undo, Trash2 } from 'lucide-react';

interface Annotation {
  id: string;
  type: 'text' | 'highlight' | 'rect';
  x: number;
  y: number;
  text?: string;
  size?: number;
  color?: string;
  width?: number;
  height?: number;
}

interface PDFCanvasEditorProps {
  file: File;
  onAnnotationsChange?: (annotations: any[]) => void;
}

export const PDFCanvasEditor: React.FC<PDFCanvasEditorProps> = ({ file, onAnnotationsChange }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'highlight' | 'rect'>('select');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [color, setColor] = useState('#4f46e5');
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'select') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'text') {
      const newAnnot: Annotation = {
        id: Math.random().toString(),
        type: 'text',
        x,
        y,
        text: textInput || 'CrazyPDF Note',
        size: fontSize,
        color,
      };
      const updated = [...annotations, newAnnot];
      setAnnotations(updated);
      onAnnotationsChange?.(updated);
    } else if (activeTool === 'highlight') {
      const newAnnot: Annotation = {
        id: Math.random().toString(),
        type: 'highlight',
        x,
        y: y - 10,
        width: 140,
        height: 24,
        color: '#fef08a',
      };
      const updated = [...annotations, newAnnot];
      setAnnotations(updated);
      onAnnotationsChange?.(updated);
    } else if (activeTool === 'rect') {
      const newAnnot: Annotation = {
        id: Math.random().toString(),
        type: 'rect',
        x,
        y,
        width: 120,
        height: 60,
        color,
      };
      const updated = [...annotations, newAnnot];
      setAnnotations(updated);
      onAnnotationsChange?.(updated);
    }
  };

  const removeAnnotation = (id: string) => {
    const updated = annotations.filter((a) => a.id !== id);
    setAnnotations(updated);
    onAnnotationsChange?.(updated);
  };

  const clearAll = () => {
    setAnnotations([]);
    onAnnotationsChange?.([]);
  };

  return (
    <div className="w-full rounded-3xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 space-y-4">
      {/* Viewer / Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTool('select')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              activeTool === 'select' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Pointer
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('text')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors ${
              activeTool === 'text' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Type className="w-3.5 h-3.5" /> Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('highlight')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors ${
              activeTool === 'highlight' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" /> Highlight
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('rect')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors ${
              activeTool === 'rect' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Square className="w-3.5 h-3.5" /> Box
          </button>
        </div>

        {/* Text Options */}
        {activeTool === 'text' && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type annotation text..."
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none"
            />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
              title="Color"
            />
          </div>
        )}

        {/* Zoom & Rotation controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(50, z - 15))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
          <span className="font-mono text-xs w-12 text-center text-slate-700 dark:text-slate-300">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(200, z + 15))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ml-1"
            title="Rotate preview"
          >
            <RotateCw className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
          {annotations.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 ml-1"
              title="Clear all annotations"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Document View Canvas */}
      <div className="w-full overflow-auto max-h-[550px] flex items-center justify-center p-6 bg-slate-200/50 dark:bg-slate-950/80 rounded-2xl">
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative w-[500px] min-h-[680px] bg-white text-slate-900 rounded-lg shadow-2xl p-8 border border-slate-300 select-none cursor-crosshair overflow-hidden"
        >
          {/* Sample Rendered Document Content */}
          <div className="space-y-4">
            <div className="border-b pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{file.name}</h3>
                <p className="text-xs text-slate-400">CrazyPDF High-Fidelity Interactive Preview</p>
              </div>
              <div className="text-[10px] font-mono px-2 py-1 bg-slate-100 rounded text-slate-500">
                Page 1 of 1
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>

            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <p className="font-bold mb-1">Document Section Overview</p>
              <p className="text-slate-500">
                Click anywhere on this canvas with the selected tool to position custom text annotations, highlight markers, or shape boundaries.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-4/5"></div>
              <div className="h-3 bg-slate-200 rounded w-11/12"></div>
            </div>
          </div>

          {/* Rendered Annotations Overlays */}
          {annotations.map((annot) => (
            <div
              key={annot.id}
              onClick={(e) => {
                e.stopPropagation();
                removeAnnotation(annot.id);
              }}
              style={{
                position: 'absolute',
                left: annot.x,
                top: annot.y,
                color: annot.color,
                fontSize: annot.size || 14,
              }}
              className="cursor-pointer group animate-in fade-in"
              title="Click to remove"
            >
              {annot.type === 'text' && (
                <span className="font-semibold px-1.5 py-0.5 rounded bg-white/80 border border-brand-300 shadow-sm">
                  {annot.text}
                </span>
              )}
              {annot.type === 'highlight' && (
                <div
                  style={{
                    width: annot.width,
                    height: annot.height,
                    backgroundColor: 'rgba(254, 240, 138, 0.65)',
                  }}
                  className="rounded"
                />
              )}
              {annot.type === 'rect' && (
                <div
                  style={{
                    width: annot.width,
                    height: annot.height,
                    borderColor: annot.color,
                  }}
                  className="border-2 rounded bg-indigo-500/10"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
