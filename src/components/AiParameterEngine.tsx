import React from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  Cpu,
  Calendar,
  Filter,
  Layers,
  Send,
  Loader2,
} from 'lucide-react';
import { AIParameterConfig, AttributionModelId } from '../types';

interface AiParameterEngineProps {
  config: AIParameterConfig;
  onChangeConfig: (newConfig: Partial<AIParameterConfig>) => void;
  onRunAnalysis: () => void;
  isLoading: boolean;
  conversionTypes: string[];
}

export const AiParameterEngine: React.FC<AiParameterEngineProps> = ({
  config,
  onChangeConfig,
  onRunAnalysis,
  isLoading,
  conversionTypes,
}) => {
  return (
    <div
      id="ai-parameter-engine"
      className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-xl border border-indigo-900/60 p-5 text-white shadow-md relative overflow-hidden"
    >
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-800/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                AI Parameter Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-indigo-200/70 mt-0.5">
              Tune multi-step sequence reasoning, lookback windows, and friction hypotheses
            </p>
          </div>
        </div>

        {/* Execute Button */}
        <button
          id="btn-run-gemini-analysis"
          onClick={onRunAnalysis}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 active:scale-[0.98] transition shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed self-start sm:self-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
              <span>Synthesizing Multi-Step Reasoning...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run Gemini P2C Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Controls Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Lookback Window */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Lookback Window</span>
            </label>
            <span className="text-xs font-bold text-indigo-300 font-mono">
              {config.lookbackDays} Days
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={90}
            step={1}
            value={config.lookbackDays}
            onChange={(e) =>
              onChangeConfig({ lookbackDays: parseInt(e.target.value, 10) })
            }
            className="w-full h-1.5 bg-indigo-950/80 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
          <div className="flex items-center justify-between text-[10px] text-indigo-300/60 pt-0.5">
            <button
              onClick={() => onChangeConfig({ lookbackDays: 30 })}
              className="hover:text-indigo-200 cursor-pointer"
            >
              30D (Short)
            </button>
            <button
              onClick={() => onChangeConfig({ lookbackDays: 60 })}
              className="hover:text-indigo-200 cursor-pointer"
            >
              60D (Mid)
            </button>
            <button
              onClick={() => onChangeConfig({ lookbackDays: 90 })}
              className="hover:text-indigo-200 font-bold text-indigo-300 cursor-pointer"
            >
              90D (Full CM360)
            </button>
          </div>
        </div>

        {/* Target Conversion Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Conversion Type</span>
          </label>
          <select
            value={config.conversionTypeFilter}
            onChange={(e) =>
              onChangeConfig({ conversionTypeFilter: e.target.value })
            }
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/90 border border-indigo-800/60 text-indigo-100 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
          >
            <option value="ALL">All Conversion Types (Total Corpus)</option>
            {conversionTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-indigo-300/60 block">
            Filter touchpoint sequences by transaction goal
          </span>
        </div>

        {/* Primary Analytical Focus */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Analytical Focus</span>
          </label>
          <select
            value={config.focusArea}
            onChange={(e) =>
              onChangeConfig({ focusArea: e.target.value as any })
            }
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/90 border border-indigo-800/60 text-indigo-100 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
          >
            <option value="frictions">Sequence Friction & Latency Gaps</option>
            <option value="synergy">Channel Synergy & Cross-Platform Lift</option>
            <option value="budget">Budget Reallocation & Attribution Shift</option>
            <option value="presentation">Executive Presentation Deck</option>
          </select>
          <span className="text-[10px] text-indigo-300/60 block">
            Tailor reasoning output toward specific stakeholder decisions
          </span>
        </div>

        {/* Reasoning Depth */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reasoning Rigor</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-800/90 p-1 rounded-lg border border-indigo-800/60">
            <button
              type="button"
              onClick={() => onChangeConfig({ reasoningDepth: 'standard' })}
              className={`px-2 py-1 rounded text-xs transition cursor-pointer ${
                config.reasoningDepth === 'standard'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-indigo-300 hover:text-white'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => onChangeConfig({ reasoningDepth: 'deep' })}
              className={`px-2 py-1 rounded text-xs transition cursor-pointer ${
                config.reasoningDepth === 'deep'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-indigo-300 hover:text-white'
              }`}
            >
              Deep (Multi-Step)
            </button>
          </div>
          <span className="text-[10px] text-indigo-300/60 block">
            Multi-step sequence correlation & latency audits
          </span>
        </div>
      </div>

      {/* Custom Guidance Prompt Bar */}
      <div className="relative z-10 mt-3 pt-3 border-t border-indigo-800/40 flex flex-col sm:flex-row items-center gap-2">
        <span className="text-xs text-indigo-300 font-medium whitespace-nowrap self-start sm:self-center">
          Analyst Guidance:
        </span>
        <input
          type="text"
          value={config.customGuidance}
          onChange={(e) => onChangeConfig({ customGuidance: e.target.value })}
          placeholder="e.g. Highlight why CTV video is critical to premium purchases, or audit the 40-day mid-funnel silence..."
          className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-800/80 border border-indigo-800/60 text-white placeholder-indigo-300/40 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>
    </div>
  );
};
