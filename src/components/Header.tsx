import React from 'react';
import {
  Database,
  Layers,
  Sparkles,
  Presentation,
  RotateCcw,
  ShieldCheck,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import { FirestoreStatus } from '../types';
import { FLOODLIGHT_CONFIG_META } from '../data/groundTruthP2C';

interface HeaderProps {
  firestoreStatus: FirestoreStatus;
  totalConversions: number;
  totalTouchpoints: number;
  onOpenShowcase: () => void;
  onOpenGoogleSlides: () => void;
  onResetData: () => void;
  onOpenFirebaseDetails?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  firestoreStatus,
  totalConversions,
  totalTouchpoints,
  onOpenShowcase,
  onOpenGoogleSlides,
  onResetData,
  onOpenFirebaseDetails,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  AI-Driven Path to Conversion Insights
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  CM360 P2C
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>Multi-Touch Attribution Engine & Sequence Diagnostics</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-slate-600">
                  {FLOODLIGHT_CONFIG_META.configId}
                </span>
              </p>
            </div>
          </div>

          {/* Status Indicators & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Firestore Status Pill */}
            <button
              id="header-firestore-status-btn"
              onClick={onOpenFirebaseDetails}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 shadow-2xs transition cursor-pointer"
              title={`Firestore Database: ${firestoreStatus.databaseId} (${firestoreStatus.documentCount} docs) - Click for Project Details & Console link`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Firestore Sync</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Lookback Window Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              <span>90-Day Window</span>
            </div>

            {/* Generate Google Slides Modal Button */}
            <button
              id="header-google-slides-btn"
              onClick={onOpenGoogleSlides}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition shadow-xs cursor-pointer ring-1 ring-amber-600/30"
              title="Generate real Google Slides presentation from P2C data & Gemini insights"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Generate Google Slides</span>
            </button>

            {/* Level 2 Deliverables Showcase Package */}
            <button
              id="header-showcase-btn"
              onClick={onOpenShowcase}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition shadow-2xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Project Showcase</span>
            </button>

            {/* Reset Data Button */}
            <button
              id="header-reset-btn"
              onClick={onResetData}
              title="Reset to original 10-journey ground truth dataset"
              className="inline-flex items-center p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
