import React, { useState, useEffect } from 'react';
import {
  X,
  Presentation,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Copy,
  AlertCircle,
  Loader2,
  Layers,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Check,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import {
  TouchpointRecord,
  ChannelAttributionMetric,
  GeminiInsightsResult,
  AIParameterConfig,
} from '../types';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout,
} from '../services/googleAuth';
import {
  createGoogleSlidesPresentation,
  GeneratedSlidesResult,
} from '../services/googleSlidesService';

interface GoogleSlidesGeneratorModalProps {
  touchpoints: TouchpointRecord[];
  metrics: {
    totalConversions: number;
    totalRevenue: number;
    avgTouchpointsPerJourney: number;
    avgDaysToConvert: number;
  };
  channelAttribution: ChannelAttributionMetric[];
  geminiInsights: GeminiInsightsResult | null;
  config: AIParameterConfig;
  onClose: () => void;
}

export const GoogleSlidesGeneratorModal: React.FC<
  GoogleSlidesGeneratorModalProps
> = ({
  touchpoints,
  metrics,
  channelAttribution,
  geminiInsights,
  config,
  onClose,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedDeck, setGeneratedDeck] =
    useState<GeneratedSlidesResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setError(null);
    setIsAuthenticating(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(
        err.message || 'Failed to sign in with Google. Please try again.'
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
    setGeneratedDeck(null);
  };

  const handleGenerateSlides = async () => {
    let token = accessToken;
    if (!token) {
      // Prompt sign-in first
      try {
        setIsAuthenticating(true);
        const result = await googleSignIn();
        if (result) {
          token = result.accessToken;
          setCurrentUser(result.user);
          setAccessToken(result.accessToken);
        } else {
          setIsAuthenticating(false);
          return;
        }
      } catch (err: any) {
        setIsAuthenticating(false);
        setError(err.message || 'Authentication required to generate slides.');
        return;
      } finally {
        setIsAuthenticating(false);
      }
    }

    if (!token) {
      setError('Google Slides authorization token is required.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStep('Creating presentation container...');

    try {
      setGenerationStep('Formatting executive slides and KPI cards...');
      await new Promise((r) => setTimeout(r, 400));

      setGenerationStep('Injecting Gemini AI sequence insights & charts...');
      const result = await createGoogleSlidesPresentation({
        touchpoints,
        metrics,
        channelAttribution,
        geminiInsights,
        config,
        accessToken: token,
      });

      setGeneratedDeck(result);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Slides creation error:', err);
      setError(
        err.message ||
          'Failed to generate Google Slides presentation. Please check permissions and try again.'
      );
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleCopyLink = () => {
    if (generatedDeck?.presentationUrl) {
      navigator.clipboard.writeText(generatedDeck.presentationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white border border-white/30 shadow-xs">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Google Slides Deck Generator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white border border-white/30">
                  Google Slides API
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Automatically build and publish stakeholder presentations from CM360 data & Gemini insights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-100 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Error notification */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Operation Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Success Deck Banner (If Created) */}
          {generatedDeck ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-400 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      Presentation Created in Google Slides
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {generatedDeck.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      5 formatted slides generated with ground truth attribution data and Gemini AI findings
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={generatedDeck.presentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition shadow-sm cursor-pointer"
                >
                  <Presentation className="w-4 h-4" />
                  <span>Open in Google Slides</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Presentation Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleGenerateSlides}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer ml-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Re-generate with current filters</span>
                </button>
              </div>

              {/* Presentation ID Details */}
              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Google Slides ID: <code className="font-mono text-slate-700">{generatedDeck.presentationId}</code></span>
                <span className="text-emerald-700 font-medium">Ready for presenting & exporting</span>
              </div>
            </div>
          ) : null}

          {/* Account & OAuth Status Bar */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs">
                {currentUser?.email ? currentUser.email[0].toUpperCase() : 'G'}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {currentUser?.displayName || currentUser?.email || 'Google Account Authorization'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {currentUser
                    ? 'Connected with Google Slides API permissions'
                    : 'Sign in required to create presentation in your Google Drive'}
                </span>
              </div>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Ready
                </span>
                <button
                  onClick={handleLogout}
                  title="Switch Google Account"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Google Sign-in button styled according to GSI Material Guidelines */
              <button
                id="google-slides-sign-in-btn"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition cursor-pointer self-start sm:self-auto"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Planned Slide Deck Blueprint */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Generated Presentation Structure (5 Slides)
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                P2C Dataset: {metrics.totalConversions} Journeys • ${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} Attributed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Slide 1 Card */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Slide 1 • Title Deck
                  </span>
                  <Presentation className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  CM360 Path to Conversion (P2C) Insights
                </h4>
                <p className="text-[11px] text-slate-500">
                  Header, Floodlight account parameters, active attribution model, and run date.
                </p>
              </div>

              {/* Slide 2 Card */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    Slide 2 • Executive KPIs
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Executive Attribution Summary & Velocity
                </h4>
                <p className="text-[11px] text-slate-500">
                  Total conversions ({metrics.totalConversions}), revenue (${metrics.totalRevenue.toFixed(0)}), avg lag ({metrics.avgDaysToConvert}d), and core findings.
                </p>
              </div>

              {/* Slide 3 Card */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    Slide 3 • Attribution Share
                  </span>
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Channel Contribution Breakdown
                </h4>
                <p className="text-[11px] text-slate-500">
                  Position-based share for Search, Retargeting, Social, Video, Affiliate, and Organic with assist ratios.
                </p>
              </div>

              {/* Slide 4 Card */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                    Slide 4 • Gemini Diagnostics
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Sequence Synergies & Journey Frictions
                </h4>
                <p className="text-[11px] text-slate-500">
                  High-velocity sequence pairs (Search $\rightarrow$ Retargeting) and fatigue mitigations diagnosed by Gemini.
                </p>
              </div>

              {/* Slide 5 Card */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Slide 5 • Action Plan
                  </span>
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Strategic Media Budget Reallocation Roadmap
                </h4>
                <p className="text-[11px] text-slate-500">
                  Recommended budget shifts (+15% Search, +10% Retargeting, -20% Low-assist Display) and Floodlight governance steps.
                </p>
              </div>
            </div>
          </div>

          {/* User Confirmation & Disclaimer Notice */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Presentation className="w-4 h-4 text-amber-600" />
              Google Slides API Workspace Notice:
            </p>
            <p>
              Clicking <strong>Generate Presentation</strong> will invoke the Google Slides REST API on your behalf to create a new presentation deck in your Google account, with permission from the app's users. You can edit, share, or download the presentation as PPTX or PDF directly inside Google Slides.
            </p>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isGenerating ? (
              <div className="flex items-center gap-2 text-amber-700 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{generationStep || 'Generating presentation...'}</span>
              </div>
            ) : generatedDeck ? (
              <span className="text-emerald-700 font-medium">
                ✓ Ready in Google Slides
              </span>
            ) : (
              <span>Model: Position-Based 40/20/40 • 90-day window</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              Close
            </button>

            <button
              id="confirm-generate-slides-btn"
              onClick={handleGenerateSlides}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Deck...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {generatedDeck ? 'Re-generate Deck' : 'Generate Presentation in Google Slides'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
