import React from 'react';
import {
  Layers,
  Lock,
  LogIn,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Presentation,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthGate: React.FC = () => {
  const { signInWithGoogle, loading, error, clearError } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-white">
                Google Campaign Manager 360
              </span>
              <span className="text-xs text-slate-400 block">
                Path to Conversion (P2C) Insights Engine
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Secure Access Gate</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Authentication Required
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Sign in with your Google account to access Campaign Manager 360 touchpoint sequences, attribution modeling, and presentation generation.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/70 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{error}</p>
                <button
                  type="button"
                  onClick={clearError}
                  className="mt-1 text-rose-300 hover:text-white underline text-2xs cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Sign In CTA */}
          <div className="space-y-4">
            <button
              id="google-signin-btn"
              type="button"
              disabled={loading}
              onClick={signInWithGoogle}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 transition shadow-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-blue-600" />
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            <div className="text-center">
              <span className="text-2xs text-slate-500 uppercase tracking-wider font-semibold">
                Enterprise Single Sign-On
              </span>
            </div>
          </div>

          {/* Key Capabilities Checklist */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Protected Platform Features:
            </h3>

            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <BarChart3 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Multi-Touch Attribution Engine (First, Last, Linear, Time-Decay, Position-Based)</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Gemini 3.8 Multi-Step Path Reasoning & Friction Diagnostics</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <Presentation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Automated Google Slides Deck Generation & Cloud Firestore Sync</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/40 px-6 py-4 text-center text-xs text-slate-500">
        <p>
          Google Cloud Firebase Authentication • Secured with Role-Based Access Controls
        </p>
      </footer>
    </div>
  );
};
