import {
  AttributionModelId,
  ChannelAttributionMetric,
  ChannelGrouping,
  JourneyPathSummary,
  SequenceStepBreakdown,
  TouchpointRecord,
} from '../types';

export const ATTRIBUTION_MODELS = [
  {
    id: 'last_touch' as AttributionModelId,
    name: 'Last Interaction',
    tagline: '100% credit to closing touch',
    description: 'Credits 100% of conversion value to the final touchpoint directly preceding the conversion.',
  },
  {
    id: 'first_touch' as AttributionModelId,
    name: 'First Interaction',
    tagline: '100% credit to discovery touch',
    description: 'Credits 100% to the initial brand discovery or awareness touchpoint in the lookback window.',
  },
  {
    id: 'linear' as AttributionModelId,
    name: 'Linear (Equal Share)',
    tagline: 'Equal weight across entire sequence',
    description: 'Divides revenue and conversion credit equally among all interactions in the conversion path.',
  },
  {
    id: 'time_decay' as AttributionModelId,
    name: 'Time Decay (7-day Half Life)',
    tagline: 'Higher weight closer to conversion',
    description: 'Touchpoints closer in time to the conversion event receive exponentially more attribution credit.',
  },
  {
    id: 'position_based' as AttributionModelId,
    name: 'Position-Based (U-Shaped)',
    tagline: '40% First, 40% Last, 20% Middle',
    description: 'Highlights both acquisition (40%) and conversion (40%), distributing 20% across nurture touchpoints.',
  },
];

export function groupJourneys(touchpoints: TouchpointRecord[]): JourneyPathSummary[] {
  const journeysMap = new Map<string, TouchpointRecord[]>();

  for (const tp of touchpoints) {
    if (!journeysMap.has(tp.conversion_id)) {
      journeysMap.set(tp.conversion_id, []);
    }
    journeysMap.get(tp.conversion_id)!.push(tp);
  }

  const summaries: JourneyPathSummary[] = [];

  for (const [conversion_id, items] of journeysMap.entries()) {
    // sort ascending by interaction_number
    const sorted = [...items].sort((a, b) => a.interaction_number - b.interaction_number);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const channels = sorted.map((item) => item.channel_grouping);
    const path_string = channels.join('  ');

    summaries.push({
      conversion_id,
      user_id_pseudo: first.user_id_pseudo,
      conversion_type: last.conversion_type || first.conversion_type,
      conversion_revenue: last.conversion_revenue || first.conversion_revenue || 0,
      touchpoint_count: sorted.length,
      total_lag_days: first.days_prior_to_conversion,
      path_string,
      channels,
      touchpoints: sorted,
    });
  }

  return summaries;
}

export function filterTouchpoints(
  touchpoints: TouchpointRecord[],
  lookbackDays: number,
  conversionTypeFilter: string = 'ALL'
): TouchpointRecord[] {
  return touchpoints.filter((tp) => {
    const matchesLookback = tp.days_prior_to_conversion <= lookbackDays;
    const matchesType =
      conversionTypeFilter === 'ALL' || tp.conversion_type === conversionTypeFilter;
    return matchesLookback && matchesType;
  });
}

export function calculateAttributionMetrics(
  journeys: JourneyPathSummary[],
  selectedModel: AttributionModelId
): {
  channelMetrics: ChannelAttributionMetric[];
  totalRevenue: number;
  totalConversions: number;
  avgSequenceLength: number;
  avgSalesLagDays: number;
  assistedRatio: number;
  topPath: string;
} {
  const channelData: Record<
    string,
    {
      lastTouchRev: number;
      firstTouchRev: number;
      linearRev: number;
      timeDecayRev: number;
      positionBasedRev: number;
      touches: number;
      firstCount: number;
      lastCount: number;
      assistCount: number;
    }
  > = {};

  const ensureChannel = (ch: string) => {
    if (!channelData[ch]) {
      channelData[ch] = {
        lastTouchRev: 0,
        firstTouchRev: 0,
        linearRev: 0,
        timeDecayRev: 0,
        positionBasedRev: 0,
        touches: 0,
        firstCount: 0,
        lastCount: 0,
        assistCount: 0,
      };
    }
  };

  let totalRevenue = 0;
  let totalLagSum = 0;
  let totalTouchesSum = 0;
  const pathFrequency: Record<string, number> = {};

  for (const journey of journeys) {
    const rev = journey.conversion_revenue;
    totalRevenue += rev;
    totalLagSum += journey.total_lag_days;
    totalTouchesSum += journey.touchpoint_count;

    pathFrequency[journey.path_string] = (pathFrequency[journey.path_string] || 0) + 1;

    const n = journey.touchpoints.length;

    // Time decay weights: 2 ^ (-days / 7)
    const timeDecayRaw = journey.touchpoints.map((tp) => {
      return Math.pow(2, -tp.days_prior_to_conversion / 7);
    });
    const timeDecaySum = timeDecayRaw.reduce((a, b) => a + b, 0) || 1;

    journey.touchpoints.forEach((tp, idx) => {
      ensureChannel(tp.channel_grouping);
      const ch = channelData[tp.channel_grouping];
      ch.touches += 1;

      // Linear
      ch.linearRev += rev / n;

      // Time Decay
      const tdWeight = timeDecayRaw[idx] / timeDecaySum;
      ch.timeDecayRev += rev * tdWeight;

      // Position based
      if (n === 1) {
        ch.positionBasedRev += rev;
      } else if (n === 2) {
        ch.positionBasedRev += rev * 0.5;
      } else {
        if (idx === 0) {
          ch.positionBasedRev += rev * 0.4;
        } else if (idx === n - 1) {
          ch.positionBasedRev += rev * 0.4;
        } else {
          ch.positionBasedRev += (rev * 0.2) / (n - 2);
        }
      }

      // First touch
      if (idx === 0) {
        ch.firstTouchRev += rev;
        ch.firstCount += 1;
      }

      // Last touch
      if (idx === n - 1) {
        ch.lastTouchRev += rev;
        ch.lastCount += 1;
      }

      // Assisting touch
      if (idx < n - 1) {
        ch.assistCount += 1;
      }
    });
  }

  const channels = Object.keys(channelData) as ChannelGrouping[];

  const channelMetrics: ChannelAttributionMetric[] = channels.map((channel) => {
    const d = channelData[channel];

    let selectedRevenue = 0;
    switch (selectedModel) {
      case 'first_touch':
        selectedRevenue = d.firstTouchRev;
        break;
      case 'last_touch':
        selectedRevenue = d.lastTouchRev;
        break;
      case 'linear':
        selectedRevenue = d.linearRev;
        break;
      case 'time_decay':
        selectedRevenue = d.timeDecayRev;
        break;
      case 'position_based':
        selectedRevenue = d.positionBasedRev;
        break;
    }

    const selectedSharePct = totalRevenue > 0 ? (selectedRevenue / totalRevenue) * 100 : 0;

    return {
      channel,
      lastTouchRevenue: Number(d.lastTouchRev.toFixed(2)),
      firstTouchRevenue: Number(d.firstTouchRev.toFixed(2)),
      linearRevenue: Number(d.linearRev.toFixed(2)),
      timeDecayRevenue: Number(d.timeDecayRev.toFixed(2)),
      positionBasedRevenue: Number(d.positionBasedRev.toFixed(2)),
      selectedRevenue: Number(selectedRevenue.toFixed(2)),
      selectedSharePct: Number(selectedSharePct.toFixed(1)),
      touchpointCount: d.touches,
      firstTouchCount: d.firstCount,
      lastTouchCount: d.lastCount,
      assistingCount: d.assistCount,
    };
  });

  // Sort descending by selected revenue
  channelMetrics.sort((a, b) => b.selectedRevenue - a.selectedRevenue);

  const totalConversions = journeys.length;
  const avgSequenceLength =
    totalConversions > 0 ? Number((totalTouchesSum / totalConversions).toFixed(1)) : 0;
  const avgSalesLagDays =
    totalConversions > 0 ? Number((totalLagSum / totalConversions).toFixed(1)) : 0;

  const multiTouchCount = journeys.filter((j) => j.touchpoint_count > 1).length;
  const assistedRatio =
    totalConversions > 0 ? Number(((multiTouchCount / totalConversions) * 100).toFixed(0)) : 0;

  let topPath = 'N/A';
  let maxPathCount = 0;
  for (const [p, c] of Object.entries(pathFrequency)) {
    if (c > maxPathCount) {
      maxPathCount = c;
      topPath = p;
    }
  }

  return {
    channelMetrics,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalConversions,
    avgSequenceLength,
    avgSalesLagDays,
    assistedRatio,
    topPath,
  };
}

export function calculateSequenceStepBreakdown(
  touchpoints: TouchpointRecord[]
): SequenceStepBreakdown[] {
  const stepsMap = new Map<number, SequenceStepBreakdown>();

  for (let s = 1; s <= 5; s++) {
    stepsMap.set(s, {
      step: s,
      totalTouches: 0,
      byChannel: {},
      byInteractionType: {
        Impression: 0,
        Click: 0,
      },
    });
  }

  for (const tp of touchpoints) {
    const stepNum = Math.min(tp.interaction_number, 5);
    const item = stepsMap.get(stepNum);
    if (!item) continue;

    item.totalTouches += 1;
    item.byChannel[tp.channel_grouping] = (item.byChannel[tp.channel_grouping] || 0) + 1;
    if (tp.interaction_type === 'Click') {
      item.byInteractionType.Click += 1;
    } else {
      item.byInteractionType.Impression += 1;
    }
  }

  return Array.from(stepsMap.values()).filter((s) => s.totalTouches > 0);
}
