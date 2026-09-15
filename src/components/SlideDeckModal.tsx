import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  CheckCircle2,
  Presentation,
  Sparkles,
  Maximize2,
  FileText,
  Share2,
} from 'lucide-react';
import { PresentationSlide } from '../types';
import confetti from 'canvas-confetti';

interface SlideDeckModalProps {
  slides: PresentationSlide[];
  onClose: () => void;
  advertiserName?: string;
}

export const SlideDeckModal: React.FC<SlideDeckModalProps> = ({
  slides,
  onClose,
  advertiserName = 'Global CM360 Enterprise',
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      // Confetti on last slide completion!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleCopyDeck = () => {
    const deckText = slides
      .map(
        (s) => `SLIDE ${s.slideNumber}: ${s.title.toUpperCase()}
Subtitle: ${s.subtitle}
Metric Highlight: ${s.metricHighlight || 'N/A'}
Key Takeaway: ${s.keyTakeaway}

BULLET POINTS:
${s.bulletPoints.map((b) => `• ${b}`).join('\n')}

SPEAKER NOTES:
${s.speakerNotes}
--------------------------------------------------`
      )
      .join('\n\n');

    navigator.clipboard.writeText(deckText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtmlDeck = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CM360 Path to Conversion - Executive Presentation Deck</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; }
    .deck-container { max-width: 900px; margin: 0 auto; }
    .slide { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; margin-bottom: 40px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); page-break-after: always; }
    .slide-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 13px; color: #818cf8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .badge { background: #312e81; color: #c7d2fe; padding: 4px 10px; border-radius: 6px; }
    h1 { font-size: 26px; margin: 0 0 8px 0; color: #ffffff; }
    h2 { font-size: 15px; color: #94a3b8; font-weight: 400; margin: 0 0 24px 0; }
    .takeaway { background: #1e1b4b; border-left: 4px solid #6366f1; padding: 14px 18px; border-radius: 6px; font-weight: 600; color: #e0e7ff; margin-bottom: 24px; font-size: 15px; }
    ul { margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.7; color: #cbd5e1; }
    li { margin-bottom: 10px; }
    .notes { margin-top: 30px; padding-top: 15px; border-top: 1px dashed #475569; font-size: 12px; color: #64748b; font-style: italic; }
  </style>
</head>
<body>
  <div class="deck-container">
    <header style="margin-bottom: 30px; text-align: center;">
      <h1 style="color: #6366f1;">Campaign Manager 360: Path to Conversion Insights</h1>
      <p style="color: #94a3b8; font-size: 14px;">Tailored Stakeholder Deliverable • Prepared for Marketing Leadership</p>
    </header>
    ${slides
      .map(
        (s) => `
    <div class="slide">
      <div class="slide-meta">
        <span>SLIDE ${s.slideNumber} OF ${slides.length}</span>
        ${s.metricHighlight ? `<span class="badge">${s.metricHighlight}</span>` : ''}
      </div>
      <h1>${s.title}</h1>
      <h2>${s.subtitle}</h2>
      <div class="takeaway"><strong>Key Strategic Takeaway:</strong> ${s.keyTakeaway}</div>
      <ul>
        ${s.bulletPoints.map((b) => `<li>${b}</li>`).join('')}
      </ul>
      <div class="notes"><strong>Speaker Guidance:</strong> ${s.speakerNotes}</div>
    </div>`
      )
      .join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CM360_P2C_Executive_Slide_Deck_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-tight">
                CM360 Marketing Presentation Deck
              </span>
              <span className="text-[11px] text-slate-400 block">
                Slide {currentSlideIndex + 1} of {slides.length} • Tailored for C-Suite Delivery
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="deck-copy-btn"
              onClick={handleCopyDeck}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Outline</span>
                </>
              )}
            </button>

            <button
              id="deck-download-btn"
              onClick={handleDownloadHtmlDeck}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Slides (.html / print to PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Stage / Canvas */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Slide Header & Metric Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
                {advertiserName} • P2C Strategic Review
              </span>
              {currentSlide.metricHighlight && (
                <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {currentSlide.metricHighlight}
                </span>
              )}
            </div>

            {/* Slide Title & Subtitle */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h2>
              <p className="text-sm text-slate-400 mt-1 font-medium">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Core Takeaway Banner */}
            <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-100 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  Core Executive Takeaway
                </span>
                <p className="text-xs sm:text-sm font-semibold mt-0.5 leading-relaxed">
                  {currentSlide.keyTakeaway}
                </p>
              </div>
            </div>

            {/* Analytical Bullets */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Supporting Evidence & Sequence Logic
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {currentSlide.bulletPoints.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 bg-slate-800/40 p-3 rounded-lg border border-slate-800"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Speaker Notes Drawer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Speaker Guidance & Context:
              </span>
              <p className="text-slate-300 italic leading-relaxed">
                "{currentSlide.speakerNotes}"
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Ribbon */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          {/* Slide dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'bg-indigo-500 ring-2 ring-indigo-400/40 scale-125'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 transition cursor-pointer shadow-xs"
          >
            <span>
              {currentSlideIndex === slides.length - 1 ? 'Finish Presentation' : 'Next Slide'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
