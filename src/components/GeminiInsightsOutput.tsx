import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Zap,
  PieChart,
  Presentation,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { GeminiInsightsResult } from '../types';

interface GeminiInsightsOutputProps {
  insights: GeminiInsightsResult | null;
  isLoading: boolean;
  onOpenSlideDeck: () => void;
}

export const GeminiInsightsOutput: React.FC<GeminiInsightsOutputProps> = ({
  insights,
  isLoading,
  onOpenSlideDeck,
}) => {
  const [activeTab, setActiveTab] = useState<
    'executive' | 'frictions' | 'synergies' | 'budget' | 'slides'
  >('executive');
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div
        id="gemini-insights-loading"
        className="bg-white rounded-xl border border-indigo-200 p-8 shadow-xs text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-3 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Gemini 3.8 Flash Reasoning in Progress
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Ingesting 90-day Path to Conversion sequences, calculating cross-channel
          multi-touch weights, and diagnosing latency friction points...
        </p>
        <div className="mt-4 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
          <span
            className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
            style={{ animationDelay: '0.15s' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
            style={{ animationDelay: '0.3s' }}
          />
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const handleCopySummary = () => {
    const text = `CAMPAIGN MANAGER 360 PATH TO CONVERSION (P2C) INSIGHTS
Model: ${insights.modelUsed}
Generated: ${insights.generatedAt}

EXECUTIVE SUMMARY:
${insights.executiveSummary}

SALES LAG ANALYSIS:
${insights.salesLagAnalysis}

TOP FRICTIONS:
${insights.sequenceFrictions
  .map((f) => `- [${f.severity}] ${f.stage}: ${f.frictionPoint} (Action: ${f.recommendedAction})`)
  .join('\n')}

BUDGET REALLOCATIONS:
${insights.budgetRecommendations
  .map((b) => `- ${b.channel}: ${b.recommendedDeltaPct > 0 ? '+' : ''}${b.recommendedDeltaPct}% (Reason: ${b.strategicRationale})`)
  .join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="gemini-insights-container"
      className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden"
    >
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-white">
                Gemini Multi-Step Reasoning Insights
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Level 1 Deliverable
              </span>
            </div>
            <p className="text-xs text-indigo-200/70 mt-0.5">
              Sequence latency diagnostics, channel synergies, and marketing deliverables
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-copy-insights"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-indigo-100 border border-indigo-800/60 transition cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-300" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
          <button
            id="btn-open-slides-from-insights"
            onClick={onOpenSlideDeck}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-xs cursor-pointer ring-1 ring-amber-500/40"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Generate Google Slides</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-5 flex overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('executive')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'executive'
              ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Executive Overview & Path Dynamics</span>
        </button>
        <button
          onClick={() => setActiveTab('frictions')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'frictions'
              ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Sequence Friction Diagnostics ({insights.sequenceFrictions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('synergies')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'synergies'
              ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          <span>Channel Synergies ({insights.channelSynergies.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'budget'
              ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-3.5 h-3.5 text-emerald-600" />
          <span>Budget Reallocations</span>
        </button>
        <button
          onClick={() => setActiveTab('slides')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'slides'
              ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Presentation className="w-3.5 h-3.5 text-blue-600" />
          <span>Slide Deck Preview ({insights.presentationSlides?.length || 5})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 sm:p-6">
        {/* Tab 1: Executive Overview */}
        {activeTab === 'executive' && (
          <div className="space-y-5">
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Strategic Synthesis: Moving from "What Happened" to "Why it Happened"
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {insights.executiveSummary}
              </p>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/70">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                1-90 Day Sales Lag & Latency Dynamics
              </h3>
              <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
                {insights.salesLagAnalysis}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Sequence Friction Diagnostics */}
        {activeTab === 'frictions' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Gemini analyzed user progression across touchpoints to flag latency dead zones, creative exhaustion, and attribution blind spots:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.sequenceFrictions.map((f, i) => {
                const severityColors =
                  f.severity === 'HIGH'
                    ? 'border-rose-200 bg-rose-50/40 text-rose-800'
                    : f.severity === 'MEDIUM'
                    ? 'border-amber-200 bg-amber-50/40 text-amber-800'
                    : 'border-slate-200 bg-slate-50/40 text-slate-800';

                return (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 shadow-2xs flex flex-col justify-between ${severityColors}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-current">
                          {f.severity} SEVERITY
                        </span>
                        <span className="text-[11px] font-medium opacity-80">
                          {f.stage}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                        {f.frictionPoint}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                        <strong className="text-slate-800">Evidence:</strong> {f.evidence}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs">
                      <strong className="text-indigo-900 block mb-1">
                        Remediation Action:
                      </strong>
                      <span className="text-slate-700 leading-relaxed">
                        {f.recommendedAction}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Channel Synergies */}
        {activeTab === 'synergies' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Recurring multi-touch combinations that exhibit compounding conversion lift:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.channelSynergies.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/30 to-white p-4 shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{s.channelPair}</span>
                  </div>
                  <div className="mt-2.5 space-y-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Sequence Frequency Pattern
                      </span>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {s.frequencyPattern}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Conversion Lift & Impact
                      </span>
                      <p className="text-emerald-700 font-semibold mt-0.5">
                        {s.conversionImpact}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Lag Observation
                      </span>
                      <p className="text-slate-600 mt-0.5">{s.lagObservation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Budget Reallocations */}
        {activeTab === 'budget' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Data-backed capital reallocation from bottom-funnel single-touch bias to full-funnel incrementality:
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3 text-center">Current Budget Share</th>
                    <th className="py-2.5 px-3 text-center">Recommended Adjustment</th>
                    <th className="py-2.5 px-3">Strategic Rationale</th>
                    <th className="py-2.5 px-3">Attribution Mechanism</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {insights.budgetRecommendations.map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {b.channel}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium">
                        {b.currentSharePct}%
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            b.recommendedDeltaPct > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.recommendedDeltaPct < 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {b.recommendedDeltaPct > 0 ? '+' : ''}
                          {b.recommendedDeltaPct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-xs">{b.strategicRationale}</td>
                      <td className="py-3 px-3 text-slate-500 italic max-w-xs">
                        {b.attributionShiftReason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Slide Deck Preview */}
        {activeTab === 'slides' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Tailored Google Slides / .pptx deliverables synthesized for marketing stakeholders:
              </p>
              <button
                onClick={onOpenSlideDeck}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition cursor-pointer shadow-xs"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Generate in Google Slides</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.presentationSlides.map((slide) => (
                <div
                  key={slide.slideNumber}
                  className="rounded-xl border border-slate-300 bg-white p-4 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">
                        Slide {slide.slideNumber}
                      </span>
                      {slide.metricHighlight && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {slide.metricHighlight}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-2 line-clamp-2">
                      {slide.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 italic line-clamp-1">
                      {slide.subtitle}
                    </p>
                    <div className="mt-2.5 p-2 rounded bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-800">
                      Key Takeaway: {slide.keyTakeaway}
                    </div>
                    <ul className="mt-2.5 space-y-1 text-xs text-slate-600">
                      {slide.bulletPoints.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 mt-0.5">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400">
                    <strong className="text-slate-600 font-semibold">Speaker Notes:</strong>{' '}
                    <span className="line-clamp-2">{slide.speakerNotes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
