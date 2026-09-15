import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { AttributionModelId, ChannelAttributionMetric } from '../types';
import { ATTRIBUTION_MODELS } from '../utils/attributionEngine';
import { HelpCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface RevenueContributionChartProps {
  channelMetrics: ChannelAttributionMetric[];
  selectedModel: AttributionModelId;
  onSelectModel: (model: AttributionModelId) => void;
  totalRevenue: number;
}

const CHANNEL_COLORS: Record<string, string> = {
  'CTV/Video': '#6366f1', // Indigo
  Display: '#3b82f6', // Blue
  Social: '#ec4899', // Pink
  'Paid Social': '#f43f5e', // Rose
  'Paid Search': '#10b981', // Emerald
  'Audio/Podcast': '#f59e0b', // Amber
  Email: '#8b5cf6', // Violet
  Direct: '#64748b', // Slate
};

export const RevenueContributionChart: React.FC<RevenueContributionChartProps> = ({
  channelMetrics,
  selectedModel,
  onSelectModel,
  totalRevenue,
}) => {
  const [viewMode, setViewMode] = useState<'selected' | 'comparison'>('comparison');

  const currentModelMeta = ATTRIBUTION_MODELS.find((m) => m.id === selectedModel);

  // Prepare chart data
  const chartData = channelMetrics.map((m) => {
    const deltaVsLast = m.selectedRevenue - m.lastTouchRevenue;
    const deltaPct =
      m.lastTouchRevenue > 0
        ? ((deltaVsLast / m.lastTouchRevenue) * 100).toFixed(1)
        : m.selectedRevenue > 0
        ? '+100'
        : '0';

    return {
      channel: m.channel,
      'Selected Model ($)': m.selectedRevenue,
      'Last Touch ($)': m.lastTouchRevenue,
      'First Touch ($)': m.firstTouchRevenue,
      'Linear ($)': m.linearRevenue,
      'Time Decay ($)': m.timeDecayRevenue,
      'Position-Based ($)': m.positionBasedRevenue,
      share: m.selectedSharePct,
      deltaVsLast,
      deltaPct,
      color: CHANNEL_COLORS[m.channel] || '#6366f1',
    };
  });

  return (
    <div
      id="revenue-attribution-card"
      className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs"
    >
      {/* Header & Model Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Revenue Contribution by Channel
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Attribution Modeling
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare how credit shifts across upper, middle, and lower funnel touchpoints
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium border border-slate-200/70 self-start md:self-auto">
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              viewMode === 'comparison'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multi-Model Comparison
          </button>
          <button
            onClick={() => setViewMode('selected')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              viewMode === 'selected'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Single Active Focus
          </button>
        </div>
      </div>

      {/* Attribution Model Tabs */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Active Attribution Logic
          </span>
          <span className="text-xs text-slate-500 italic">
            {currentModelMeta?.tagline}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {ATTRIBUTION_MODELS.map((model) => {
            const isActive = model.id === selectedModel;
            return (
              <button
                key={model.id}
                id={`model-tab-${model.id}`}
                onClick={() => onSelectModel(model.id)}
                className={`text-left p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs ring-1 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isActive ? 'text-indigo-900' : 'text-slate-800'
                      }`}
                    >
                      {model.name}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {model.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'comparison' ? (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="channel"
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
                formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Revenue']}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar dataKey="First Touch ($)" fill="#94a3b8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Selected Model ($)" fill="#4f46e5" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Last Touch ($)" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="channel"
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
                formatter={(val: any) => [`$${Number(val).toFixed(2)}`, currentModelMeta?.name || 'Revenue']}
              />
              <Bar dataKey="Selected Model ($)" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Attribution Detail Table & Shift Analysis */}
      <div className="mt-4 border-t border-slate-100 pt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <th className="py-2 pr-3">Channel Grouping</th>
              <th className="py-2 px-3 text-right">Selected Revenue</th>
              <th className="py-2 px-3 text-right">Rev Share</th>
              <th className="py-2 px-3 text-right">Last Touch Rev</th>
              <th className="py-2 px-3 text-right">Delta vs Last Touch</th>
              <th className="py-2 px-3 text-center">First Touches</th>
              <th className="py-2 pl-3 text-center">Assisting Touches</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {channelMetrics.map((m) => {
              const delta = m.selectedRevenue - m.lastTouchRevenue;
              return (
                <tr key={m.channel} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 pr-3 font-semibold text-slate-900 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: CHANNEL_COLORS[m.channel] || '#6366f1' }}
                    />
                    <span>{m.channel}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">
                    ${m.selectedRevenue.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium">
                    {m.selectedSharePct}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500 font-mono">
                    ${m.lastTouchRevenue.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">
                    {delta > 0.01 ? (
                      <span className="text-emerald-700 inline-flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" />
                        +${delta.toFixed(2)}
                      </span>
                    ) : delta < -0.01 ? (
                      <span className="text-rose-600 inline-flex items-center gap-0.5">
                        <ArrowDownRight className="w-3 h-3" />
                        -${Math.abs(delta).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400 inline-flex items-center gap-0.5">
                        <Minus className="w-3 h-3" />
                        $0.00
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
                      {m.firstTouchCount}
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px]">
                      {m.assistingCount}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
