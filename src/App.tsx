import React, { useState, useEffect, useMemo } from 'react';
import {
  TouchpointRecord,
  AttributionModelId,
  AIParameterConfig,
  GeminiInsightsResult,
  FirestoreStatus,
} from './types';
import {
  GROUND_TRUTH_TOUCHPOINTS,
  FLOODLIGHT_CONFIG_META,
} from './data/groundTruthP2C';
import {
  calculateAttributionMetrics,
  calculateSequenceStepBreakdown,
  filterTouchpoints,
  groupJourneys,
} from './utils/attributionEngine';
import {
  getInitialFirestoreStatus,
  getInitialTouchpoints,
  loadTouchpointsFromFirestore,
  resetToGroundTruth,
  saveTouchpointsToFirestore,
} from './services/firestoreClient';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { RevenueContributionChart } from './components/RevenueContributionChart';
import { TouchpointSequenceChart } from './components/TouchpointSequenceChart';
import { AiParameterEngine } from './components/AiParameterEngine';
import { GeminiInsightsOutput } from './components/GeminiInsightsOutput';
import { RawTouchpointStream } from './components/RawTouchpointStream';
import { JourneyTimelineModal } from './components/JourneyTimelineModal';
import { GoogleSlidesGeneratorModal } from './components/GoogleSlidesGeneratorModal';
import { ShowcasePackageModal } from './components/ShowcasePackageModal';
import { FirebaseDetailsModal } from './components/FirebaseDetailsModal';

export default function App() {
  // Touchpoint records state
  const [touchpoints, setTouchpoints] = useState<TouchpointRecord[]>(() =>
    getInitialTouchpoints()
  );

  // Firestore status
  const [firestoreStatus, setFirestoreStatus] = useState<FirestoreStatus>(() =>
    getInitialFirestoreStatus()
  );

  // AI Parameter config
  const [aiConfig, setAiConfig] = useState<AIParameterConfig>({
    lookbackDays: 90,
    attributionModel: 'position_based',
    conversionTypeFilter: 'ALL',
    focusArea: 'frictions',
    customGuidance: '',
    reasoningDepth: 'deep',
  });

  // Gemini insights state
  const [geminiInsights, setGeminiInsights] =
    useState<GeminiInsightsResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Modals state
  const [selectedConversionId, setSelectedConversionId] = useState<string | null>(
    null
  );
  const [showGoogleSlidesModal, setShowGoogleSlidesModal] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);

  // Load from live Cloud Firestore on startup
  useEffect(() => {
    loadTouchpointsFromFirestore().then(({ records, status }) => {
      setTouchpoints(records);
      setFirestoreStatus(status);
    });
  }, []);

  // Filter touchpoints based on lookback and conversion type
  const filteredTouchpoints = useMemo(() => {
    return filterTouchpoints(
      touchpoints,
      aiConfig.lookbackDays,
      aiConfig.conversionTypeFilter
    );
  }, [touchpoints, aiConfig.lookbackDays, aiConfig.conversionTypeFilter]);

  // Group into journeys
  const journeys = useMemo(() => {
    return groupJourneys(filteredTouchpoints);
  }, [filteredTouchpoints]);

  // Calculate Attribution metrics
  const attributionData = useMemo(() => {
    return calculateAttributionMetrics(journeys, aiConfig.attributionModel);
  }, [journeys, aiConfig.attributionModel]);

  // Sequence steps breakdown
  const sequenceSteps = useMemo(() => {
    return calculateSequenceStepBreakdown(filteredTouchpoints);
  }, [filteredTouchpoints]);

  // Unique conversion types for dropdown
  const uniqueConversionTypes = useMemo(() => {
    return Array.from(new Set(touchpoints.map((tp) => tp.conversion_type))).filter(
      Boolean
    );
  }, [touchpoints]);

  // Determine top closing & initiating channels
  const topClosingChannel = useMemo(() => {
    const lastTouchChannel = attributionData.channelMetrics.reduce(
      (prev, curr) => (curr.lastTouchCount > prev.lastTouchCount ? curr : prev),
      attributionData.channelMetrics[0]
    );
    return lastTouchChannel ? lastTouchChannel.channel : 'Paid Search';
  }, [attributionData]);

  const topInitiatingChannel = useMemo(() => {
    const firstTouchChannel = attributionData.channelMetrics.reduce(
      (prev, curr) => (curr.firstTouchCount > prev.firstTouchCount ? curr : prev),
      attributionData.channelMetrics[0]
    );
    return firstTouchChannel ? firstTouchChannel.channel : 'CTV/Video';
  }, [attributionData]);

  // Selected journey for inspection modal
  const selectedJourney = useMemo(() => {
    if (!selectedConversionId) return null;
    return (
      journeys.find((j) => j.conversion_id === selectedConversionId) || null
    );
  }, [journeys, selectedConversionId]);

  // Run Gemini analysis
  const handleRunGeminiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          touchpoints: filteredTouchpoints,
          config: aiConfig,
          metrics: attributionData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: GeminiInsightsResult = await response.json();
      setGeminiInsights(data);
    } catch (err: any) {
      console.error('Failed to run Gemini analysis:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run initial analysis once on mount
  useEffect(() => {
    handleRunGeminiAnalysis();
  }, []);

  // Handlers
  const handleResetData = async () => {
    const { records, status } = await resetToGroundTruth();
    setTouchpoints(records);
    setFirestoreStatus(status);
  };

  const handleUploadCSV = async (newTouchpoints: TouchpointRecord[]) => {
    setTouchpoints(newTouchpoints);
    const { status } = await saveTouchpointsToFirestore(newTouchpoints);
    setFirestoreStatus(status);
  };

  const handleModelChange = (model: AttributionModelId) => {
    setAiConfig((prev) => ({ ...prev, attributionModel: model }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Header */}
      <Header
        firestoreStatus={firestoreStatus}
        totalConversions={attributionData.totalConversions}
        totalTouchpoints={filteredTouchpoints.length}
        onOpenShowcase={() => setShowShowcase(true)}
        onOpenGoogleSlides={() => setShowGoogleSlidesModal(true)}
        onResetData={handleResetData}
        onOpenFirebaseDetails={() => setShowFirebaseModal(true)}
      />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Metric Highlights */}
        <KpiCards
          totalConversions={attributionData.totalConversions}
          totalRevenue={attributionData.totalRevenue}
          avgSequenceLength={attributionData.avgSequenceLength}
          avgSalesLagDays={attributionData.avgSalesLagDays}
          assistedRatio={attributionData.assistedRatio}
          topClosingChannel={topClosingChannel}
          topInitiatingChannel={topInitiatingChannel}
        />

        {/* AI Parameter Engine */}
        <AiParameterEngine
          config={aiConfig}
          onChangeConfig={(newCfg) =>
            setAiConfig((prev) => ({ ...prev, ...newCfg }))
          }
          onRunAnalysis={handleRunGeminiAnalysis}
          isLoading={isAiLoading}
          conversionTypes={uniqueConversionTypes}
        />

        {/* Gemini Insights Level 1 Output */}
        <GeminiInsightsOutput
          insights={geminiInsights}
          isLoading={isAiLoading}
          onOpenSlideDeck={() => setShowGoogleSlidesModal(true)}
        />

        {/* Visual Charts Grid: Revenue Contribution by Channel + Touchpoint Sequence Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueContributionChart
            channelMetrics={attributionData.channelMetrics}
            selectedModel={aiConfig.attributionModel}
            onSelectModel={handleModelChange}
            totalRevenue={attributionData.totalRevenue}
          />

          <TouchpointSequenceChart
            stepBreakdown={sequenceSteps}
            touchpoints={filteredTouchpoints}
          />
        </div>

        {/* Raw CM360 P2C Touchpoint Stream */}
        <RawTouchpointStream
          touchpoints={touchpoints}
          onSelectConversion={(id) => setSelectedConversionId(id)}
          onUploadCSV={handleUploadCSV}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              CM360 Path to Conversion (P2C) Analytics
            </span>
            <span>•</span>
            <span>Google AI Studio Full-Stack Deliverable</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Lookback: 90 Days</span>
            <span>Floodlight: {FLOODLIGHT_CONFIG_META.configId}</span>
            <span>Node.js / Express + Firestore Sync</span>
          </div>
        </div>
      </footer>

      {/* Journey Timeline Inspection Modal */}
      {selectedJourney && (
        <JourneyTimelineModal
          journey={selectedJourney}
          onClose={() => setSelectedConversionId(null)}
        />
      )}

      {/* Google Slides API Generator Modal */}
      {showGoogleSlidesModal && (
        <GoogleSlidesGeneratorModal
          touchpoints={filteredTouchpoints}
          metrics={{
            totalConversions: attributionData.totalConversions,
            totalRevenue: attributionData.totalRevenue,
            avgTouchpointsPerJourney: attributionData.avgSequenceLength,
            avgDaysToConvert: attributionData.avgSalesLagDays,
          }}
          channelAttribution={attributionData.channelMetrics}
          geminiInsights={geminiInsights}
          config={aiConfig}
          onClose={() => setShowGoogleSlidesModal(false)}
        />
      )}

      {/* Level 2 Deliverables Showcase Package Modal */}
      {showShowcase && (
        <ShowcasePackageModal
          onClose={() => setShowShowcase(false)}
          onOpenSlideDeck={() => {
            setShowShowcase(false);
            setShowGoogleSlidesModal(true);
          }}
        />
      )}

      {/* Firebase Cloud Console & Project Registry Modal */}
      {showFirebaseModal && (
        <FirebaseDetailsModal
          status={firestoreStatus}
          onClose={() => setShowFirebaseModal(false)}
        />
      )}
    </div>
  );
}
