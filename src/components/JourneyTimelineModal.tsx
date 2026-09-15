import React from 'react';
import {
  X,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  KeyRound,
  DollarSign,
  Tag,
} from 'lucide-react';
import { JourneyPathSummary, TouchpointRecord } from '../types';

interface JourneyTimelineModalProps {
  journey: JourneyPathSummary | null;
  onClose: () => void;
}

export const JourneyTimelineModal: React.FC<JourneyTimelineModalProps> = ({
  journey,
  onClose,
}) => {
  if (!journey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                {journey.conversion_id}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Customer Sequence Journey Audit
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Pseudo ID: <code className="font-mono text-slate-700">{journey.user_id_pseudo}</code></span>
              <span>•</span>
              <span>Type: <strong className="text-slate-800">{journey.conversion_type}</strong></span>
              <span>•</span>
              <span>Revenue: <strong className="text-emerald-700">${journey.conversion_revenue.toFixed(2)}</strong></span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Journey Path Ribbon */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Path summary pills */}
          <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-indigo-900">Sequence Path:</span>
            {journey.touchpoints.map((tp, idx) => (
              <React.Fragment key={idx}>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-indigo-800 border border-indigo-200 shadow-2xs">
                  <span>Step {tp.interaction_number}:</span>
                  <span className="font-bold">{tp.channel_grouping}</span>
                  <span className="text-[10px] text-slate-400">({tp.interaction_type})</span>
                </span>
                {idx < journey.touchpoints.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Detailed Timeline Steps */}
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
            {journey.touchpoints.map((tp, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === journey.touchpoints.length - 1;

              return (
                <div key={idx} className="relative z-10 flex items-start gap-4">
                  {/* Step Node Icon */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs ring-4 ring-white ${
                      isLast
                        ? 'bg-emerald-600'
                        : isFirst
                        ? 'bg-indigo-600'
                        : 'bg-slate-500'
                    }`}
                  >
                    {tp.interaction_number}
                  </div>

                  {/* Card content */}
                  <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {tp.channel_grouping}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            tp.interaction_type === 'Click'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {tp.interaction_type}
                        </span>
                        {isFirst && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                            First Discovery Touch
                          </span>
                        )}
                        {isLast && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                            Converting Touch
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tp.days_prior_to_conversion} days prior</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-[11px]">
                          {tp.interaction_timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Site / Placement
                        </span>
                        <span className="font-medium text-slate-800">
                          {tp.site_placement_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Campaign & Creative
                        </span>
                        <span className="font-medium text-slate-800">
                          {tp.campaign_name}
                        </span>
                        <span className="text-slate-500 block text-[11px]">
                          {tp.creative_type}
                        </span>
                      </div>
                    </div>

                    {tp.gclid && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <KeyRound className="w-3 h-3 text-amber-500" />
                        <span>GCLID Click Identifier:</span>
                        <code className="font-mono text-slate-700 text-[10px] bg-slate-50 px-1 py-0.5 rounded border">
                          {tp.gclid}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition cursor-pointer"
          >
            Close Journey Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
