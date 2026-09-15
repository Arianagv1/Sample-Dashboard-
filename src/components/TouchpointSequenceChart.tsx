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
} from 'recharts';
import { SequenceStepBreakdown, TouchpointRecord } from '../types';

interface TouchpointSequenceChartProps {
  stepBreakdown: SequenceStepBreakdown[];
  touchpoints: TouchpointRecord[];
}

export const TouchpointSequenceChart: React.FC<TouchpointSequenceChartProps> = ({
  stepBreakdown,
  touchpoints,
}) => {
  const [metricMode, setMetricMode] = useState<'channels' | 'interactionType'>('channels');

  // Channel breakdown by step
  const channelData = stepBreakdown.map((item) => {
    return {
      stepLabel: `Step ${item.step}`,
      total: item.totalTouches,
      'CTV/Video': item.byChannel['CTV/Video'] || 0,
      Display: item.byChannel['Display'] || 0,
      Social: (item.byChannel['Social'] || 0) + (item.byChannel['Paid Social'] || 0),
      'Paid Search': item.byChannel['Paid Search'] || 0,
      'Audio/Podcast': item.byChannel['Audio/Podcast'] || 0,
    };
  });

  // Interaction type breakdown by step
  const typeData = stepBreakdown.map((item) => {
    const total = item.totalTouches || 1;
    const impPct = Math.round((item.byInteractionType.Impression / total) * 100);
    const clickPct = Math.round((item.byInteractionType.Click / total) * 100);

    return {
      stepLabel: `Step ${item.step}`,
      Impressions: item.byInteractionType.Impression,
      Clicks: item.byInteractionType.Click,
      impPct,
      clickPct,
    };
  });

  return (
    <div
      id="touchpoint-sequence-card"
      className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Touchpoint Volume by Sequence Step
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200/60">
              P2C Funnel Progression
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Progression from initial upper-funnel discovery to mid-funnel nurture and closing
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium border border-slate-200/70">
          <button
            onClick={() => setMetricMode('channels')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              metricMode === 'channels'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Channel Grouping
          </button>
          <button
            onClick={() => setMetricMode('interactionType')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              metricMode === 'interactionType'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Impressions vs Clicks
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metricMode === 'channels' ? (
            <BarChart
              data={channelData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="stepLabel"
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="circle"
              />
              <Bar dataKey="CTV/Video" stackId="a" fill="#6366f1" />
              <Bar dataKey="Display" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Social" stackId="a" fill="#ec4899" />
              <Bar dataKey="Audio/Podcast" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Paid Search" stackId="a" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart
              data={typeData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="stepLabel"
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="circle"
              />
              <Bar dataKey="Impressions" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Clicks" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Sequence Step Context Cards */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-100 text-xs">
        {stepBreakdown.map((s) => (
          <div
            key={s.step}
            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Step {s.step}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                {s.totalTouches} {s.totalTouches === 1 ? 'touch' : 'touches'}
              </span>
            </div>
            <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Impressions:</span>
                <span className="font-medium text-slate-900">
                  {s.byInteractionType.Impression}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Clicks:</span>
                <span className="font-medium text-slate-900">
                  {s.byInteractionType.Click}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
