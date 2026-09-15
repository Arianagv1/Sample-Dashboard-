import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Repeat,
  Clock,
  GitFork,
  Compass,
} from 'lucide-react';

interface KpiCardsProps {
  totalConversions: number;
  totalRevenue: number;
  avgSequenceLength: number;
  avgSalesLagDays: number;
  assistedRatio: number;
  topClosingChannel: string;
  topInitiatingChannel: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalConversions,
  totalRevenue,
  avgSequenceLength,
  avgSalesLagDays,
  assistedRatio,
  topClosingChannel,
  topInitiatingChannel,
}) => {
  const cards = [
    {
      id: 'kpi-total-revenue',
      title: 'Attributed Revenue',
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Across analyzed lookback scope',
      icon: DollarSign,
      highlightColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
      badge: 'USD Confirmed',
    },
    {
      id: 'kpi-total-conversions',
      title: 'Total Conversions',
      value: totalConversions.toString(),
      subtitle: 'Floodlight conversion events',
      icon: TrendingUp,
      highlightColor: 'text-blue-700 bg-blue-50 border-blue-200/80',
      badge: '100% Verified',
    },
    {
      id: 'kpi-avg-touches',
      title: 'Interactions / Sale',
      value: `${avgSequenceLength} touches`,
      subtitle: 'Average sequence path length',
      icon: Repeat,
      highlightColor: 'text-violet-700 bg-violet-50 border-violet-200/80',
      badge: 'Multi-Touch Depth',
    },
    {
      id: 'kpi-sales-lag',
      title: 'Avg. Decision Lag',
      value: `${avgSalesLagDays} days`,
      subtitle: 'First impression to final close',
      icon: Clock,
      highlightColor: 'text-amber-700 bg-amber-50 border-amber-200/80',
      badge: '1-90 Day Window',
    },
    {
      id: 'kpi-assisted-ratio',
      title: 'Assisted Share',
      value: `${assistedRatio}%`,
      subtitle: 'Journeys with >1 touchpoint',
      icon: GitFork,
      highlightColor: 'text-indigo-700 bg-indigo-50 border-indigo-200/80',
      badge: 'Collaborative Funnel',
    },
    {
      id: 'kpi-funnel-anchors',
      title: 'Discovery vs. Close',
      value: `${topInitiatingChannel.split('/')[0]} → Search`,
      subtitle: `Open: ${topInitiatingChannel} • Close: ${topClosingChannel}`,
      icon: Compass,
      highlightColor: 'text-teal-700 bg-teal-50 border-teal-200/80',
      badge: 'Dominant Synergy',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`p-1.5 rounded-lg border flex items-center justify-center ${card.highlightColor}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xl font-bold text-slate-900 tracking-tight font-sans">
                {card.value}
              </div>
              <div className="text-xs text-slate-500 mt-1 truncate">
                {card.subtitle}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Metric Signal</span>
              <span className="font-semibold text-slate-700">{card.badge}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
