import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  GitBranch,
  Network,
  PackageCheck,
  BookOpen,
  Presentation,
  CheckCircle,
  Database,
  Cpu,
  Layers,
  FileCode,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ShowcasePackageModalProps {
  onClose: () => void;
  onOpenSlideDeck: () => void;
}

export const ShowcasePackageModal: React.FC<ShowcasePackageModalProps> = ({
  onClose,
  onOpenSlideDeck,
}) => {
  const [activeTab, setActiveTab] = useState<
    'architecture' | 'diagram' | 'dependencies' | 'ethics'
  >('architecture');

  const dependencies = [
    {
      name: '@google/genai',
      version: '^2.4.0',
      category: 'AI & Machine Learning',
      role: 'Direct server-side interface to Gemini 3.8 Flash for multi-step sequence reasoning and executive summary synthesis.',
    },
    {
      name: 'express',
      version: '^4.21.2',
      category: 'Backend Pipeline',
      role: 'Node.js REST server handling secure API proxying, data pipeline normalization, and Firestore synchronization.',
    },
    {
      name: 'recharts',
      version: '^2.15.1',
      category: 'Data Visualization',
      role: 'Declarative SVG charting library powering the attribution comparison bars and sequence step progression volume.',
    },
    {
      name: 'react & react-dom',
      version: '^19.0.1',
      category: 'Frontend UI',
      role: 'Modern reactive component engine powering instant UI state transitions and live filtering.',
    },
    {
      name: 'lucide-react',
      version: '^0.546.0',
      category: 'Design System',
      role: 'Standardized accessible icon system for dashboard KPIs, channels, and timeline nodes.',
    },
    {
      name: 'motion',
      version: '^12.23.24',
      category: 'Animation',
      role: 'Fluid transition physics for modal displays and state updates.',
    },
    {
      name: 'canvas-confetti',
      version: '^1.9.4',
      category: 'UX Delight',
      role: 'Interactive feedback celebration when reviewing presentations and completing audits.',
    },
    {
      name: 'tsx & esbuild',
      version: 'Dev Tooling',
      category: 'Build Pipeline',
      role: 'Zero-config TypeScript runtime execution for local server development and bundled production CJS builds.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  Level 2 Deliverables Showcase Package
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Audit Ready
                </span>
              </div>
              <p className="text-xs text-indigo-200/70 mt-0.5">
                Architecture Specification, Data Pipeline, Dependency List, and Ethics Reflection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50 px-5 flex overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Cleaned Code Repository</span>
          </button>
          <button
            onClick={() => setActiveTab('diagram')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diagram'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Architecture Diagram</span>
          </button>
          <button
            onClick={() => setActiveTab('dependencies')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dependencies'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Dependency Manifest</span>
          </button>
          <button
            onClick={() => setActiveTab('ethics')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ethics'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ethics Reflection Paper</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Tab 1: Cleaned Code Repository */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  Cleaned Codebase Architecture Overview
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  The project follows a decoupled, modular full-stack architecture designed for reliable ingestion of Campaign Manager 360 conversion sequences and real-time multi-touch attribution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-2">
                    <FileCode className="w-4 h-4" />
                    <span>Data & Calculation Layer</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>
                      <strong>/src/utils/attributionEngine.ts:</strong> Core mathematical engine computing First-Touch, Last-Touch, Linear, Time-Decay (7-day half-life exponential formula), and Position-Based U-Shaped (40/20/40) credit shares.
                    </li>
                    <li>
                      <strong>/src/data/groundTruthP2C.ts:</strong> Robust CSV ingestion and parsing engine conforming to Google Campaign Manager 360 Floodlight specifications.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-2">
                    <Database className="w-4 h-4" />
                    <span>Backend & Cloud Pipeline</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>
                      <strong>server.ts:</strong> Node.js Express server hosting the secure AI analytical endpoint (<code>/api/gemini/analyze</code>) using the modern <code>@google/genai</code> SDK, with built-in analytical heuristics fallback.
                    </li>
                    <li>
                      <strong>/src/services/firestoreClient.ts:</strong> Firestore document persistence and sync manager storing collections in <code>cm360_p2c_touchpoints</code>.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Architecture Diagram */}
          {activeTab === 'diagram' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                End-to-end data pipeline from Campaign Manager 360 raw log export to AI reasoning and stakeholder presentation generation:
              </p>

              {/* Visual Flow Diagram */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-5">
                {/* Step 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div className="flex-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">
                        CM360 Data Export & Floodlight Tracking
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        FLC_8849201 Master Lookback
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Raw touchpoint logs (Impressions, Clicks, Placements, GCLID, days_prior 1-90) collected via Floodlight conversion activities.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-2 text-indigo-400">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div className="flex-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        Firestore & BigQuery Ingestion Layer
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        cm360_p2c_touchpoints
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Structured NoSQL / document storage preserving user pseudo-IDs, sequencing timestamps, and conversion revenue.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-2 text-indigo-400">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div className="flex-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">
                        Node.js Server & Multi-Touch Engine
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Express 4.21 + tsx
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Aggregates multi-touch journeys, applies attribution models (First, Last, Linear, Time Decay, Position-Based), and generates metric payloads.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-2 text-indigo-400">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-sm shrink-0">
                    4
                  </div>
                  <div className="flex-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-violet-400">
                        Gemini 3.8 Flash Multi-Step Reasoning
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        @google/genai SDK
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Synthesizes sequence friction points, evaluates channel synergies, recommends budget deltas, and generates presentation slide structures.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-2 text-indigo-400">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* Step 5 */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center font-bold text-sm shrink-0">
                    5
                  </div>
                  <div className="flex-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-400">
                        React Dashboard & Slide Deck Generator
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Vite + Tailwind + Recharts
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Interactive visualization, sequence drill-downs, and automated Google Slides / .pptx export deliverables.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Dependency List */}
          {activeTab === 'dependencies' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Verified dependency manifest with functional justifications:
              </p>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Package</th>
                      <th className="py-2.5 px-3">Version</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Role & Justification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {dependencies.map((dep, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-900">
                          {dep.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          {dep.version}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {dep.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 leading-relaxed">{dep.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Ethics Reflection Paper */}
          {activeTab === 'ethics' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  Ethics Reflection: Multi-Touch Attribution & Privacy in the Cookieless Era
                </h3>
                <p className="text-xs text-amber-800 mt-1">
                  Author: Marketing Attribution Science & AI Systems Governance Group
                </p>
              </div>

              <div className="space-y-3 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-sm">
                  1. Pseudonymization and User Privacy Boundaries
                </h4>
                <p>
                  In this application, raw Campaign Manager 360 data handles user trajectories exclusively through <code>user_id_pseudo</code> tokens and ephemeral GCLID click parameters. At no point are Personally Identifiable Information (PII) elements (such as plain-text emails, IP addresses, or phone numbers) ingested or transmitted to Gemini AI reasoning models. This adheres strictly to the European General Data Protection Regulation (GDPR Article 4(5)) and the California Consumer Privacy Act (CCPA).
                </p>

                <h4 className="font-bold text-slate-900 text-sm pt-2">
                  2. Algorithmic Bias in Single-Touch Attribution Models
                </h4>
                <p>
                  A critical ethical dimension of marketing analytics is algorithmic allocation bias. Traditional "Last-Touch" attribution creates a systemic distortion by allocating 100% of revenue credit to closing capture channels (e.g. Branded Search). This starves informative, educational, and creative top-of-funnel channels (CTV/Video and journalism/publisher display) of funding. By implementing Position-Based (U-Shaped) and Time-Decay modeling, we restore ethical equity to media partner compensation and respect the multifaceted nature of human decision-making.
                </p>

                <h4 className="font-bold text-slate-900 text-sm pt-2">
                  3. Lookback Window Restraint & Consent Mode v2
                </h4>
                <p>
                  While CM360 permits up to 90-day lookback windows, persistent tracking across long periods must be balanced with consumer autonomy. Modern implementations must honor Google Consent Mode v2 (specifically <code>ad_user_data</code> and <code>ad_personalization</code> signals). If consent is denied, deterministic cookie matching is replaced by differential privacy and aggregate modeled conversion estimates to protect individual anonymity.
                </p>

                <h4 className="font-bold text-slate-900 text-sm pt-2">
                  4. Responsible AI Synthesis & Transparent Decision Support
                </h4>
                <p>
                  When deploying Gemini models to propose multi-million dollar marketing reallocations, AI must function as an explainable decision-support tool rather than an opaque black box. In this application, every recommendation includes explicit data-backed evidence (e.g., citing exact dormancy gaps in days and specific channel frequency pairings) so human media directors can audit the underlying causality before executing budget changes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onOpenSlideDeck}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Generate Google Slides</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition cursor-pointer"
          >
            Close Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
