export type InteractionType = 'Impression' | 'Click';

export type ChannelGrouping =
  | 'CTV/Video'
  | 'Display'
  | 'Social'
  | 'Paid Social'
  | 'Paid Search'
  | 'Audio/Podcast'
  | 'Email'
  | 'Direct';

export interface TouchpointRecord {
  conversion_id: string;
  user_id_pseudo: string;
  conversion_timestamp: string;
  conversion_type: string;
  conversion_revenue: number;
  conversion_currency: string;
  interaction_number: number;
  interaction_timestamp: string;
  days_prior_to_conversion: number;
  interaction_type: InteractionType;
  channel_grouping: ChannelGrouping;
  site_placement_name: string;
  campaign_name: string;
  ad_group_name: string;
  creative_type: string;
  is_converting_interaction: boolean;
  gclid?: string;
}

export type AttributionModelId =
  | 'last_touch'
  | 'first_touch'
  | 'linear'
  | 'time_decay'
  | 'position_based';

export interface AttributionModelOption {
  id: AttributionModelId;
  name: string;
  description: string;
  tagline: string;
}

export interface ChannelAttributionMetric {
  channel: ChannelGrouping;
  lastTouchRevenue: number;
  firstTouchRevenue: number;
  linearRevenue: number;
  timeDecayRevenue: number;
  positionBasedRevenue: number;
  selectedRevenue: number;
  selectedSharePct: number;
  touchpointCount: number;
  firstTouchCount: number;
  lastTouchCount: number;
  assistingCount: number;
}

export interface SequenceStepBreakdown {
  step: number;
  totalTouches: number;
  byChannel: Record<string, number>;
  byInteractionType: {
    Impression: number;
    Click: number;
  };
}

export interface JourneyPathSummary {
  conversion_id: string;
  user_id_pseudo: string;
  conversion_type: string;
  conversion_revenue: number;
  touchpoint_count: number;
  total_lag_days: number;
  path_string: string;
  channels: ChannelGrouping[];
  touchpoints: TouchpointRecord[];
}

export interface AIParameterConfig {
  lookbackDays: number;
  attributionModel: AttributionModelId;
  conversionTypeFilter: string;
  focusArea: 'frictions' | 'synergy' | 'budget' | 'presentation';
  customGuidance: string;
  reasoningDepth: 'standard' | 'deep';
}

export interface SequenceFrictionItem {
  stage: string;
  frictionPoint: string;
  evidence: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
}

export interface ChannelSynergyItem {
  channelPair: string;
  frequencyPattern: string;
  conversionImpact: string;
  lagObservation: string;
}

export interface BudgetReallocationItem {
  channel: string;
  currentSharePct: number;
  recommendedDeltaPct: number;
  strategicRationale: string;
  attributionShiftReason: string;
}

export interface PresentationSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  keyTakeaway: string;
  bulletPoints: string[];
  metricHighlight?: string;
  speakerNotes: string;
}

export interface GeminiInsightsResult {
  executiveSummary: string;
  salesLagAnalysis: string;
  sequenceFrictions: SequenceFrictionItem[];
  channelSynergies: ChannelSynergyItem[];
  budgetRecommendations: BudgetReallocationItem[];
  presentationSlides: PresentationSlide[];
  generatedAt: string;
  modelUsed: string;
  rawReasoningMarkdown?: string;
}

export interface FirestoreStatus {
  connected: boolean;
  databaseId: string;
  collectionName: string;
  documentCount: number;
  lastSynced: string;
  mode: 'cloud' | 'local_replicated';
}
