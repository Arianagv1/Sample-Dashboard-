import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { TouchpointRecord } from '../types';
import { parseCSVToTouchpoints, RAW_CSV_GROUND_TRUTH } from '../data/groundTruthP2C';

interface RawTouchpointStreamProps {
  touchpoints: TouchpointRecord[];
  onSelectConversion: (conversionId: string) => void;
  onUploadCSV: (newTouchpoints: TouchpointRecord[]) => void;
}

export const RawTouchpointStream: React.FC<RawTouchpointStreamProps> = ({
  touchpoints,
  onSelectConversion,
  onUploadCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [convertingFilter, setConvertingFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'days' | 'conversion' | 'step'>('conversion');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter and sort
  const filteredRecords = useMemo(() => {
    return touchpoints
      .filter((tp) => {
        const matchesSearch =
          tp.conversion_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tp.user_id_pseudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tp.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tp.site_placement_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tp.creative_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tp.gclid && tp.gclid.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesChannel =
          channelFilter === 'ALL' || tp.channel_grouping === channelFilter;
        const matchesType =
          typeFilter === 'ALL' || tp.interaction_type === typeFilter;
        const matchesConverting =
          convertingFilter === 'ALL' ||
          (convertingFilter === 'TRUE' && tp.is_converting_interaction) ||
          (convertingFilter === 'FALSE' && !tp.is_converting_interaction);

        return matchesSearch && matchesChannel && matchesType && matchesConverting;
      })
      .sort((a, b) => {
        if (sortField === 'days') {
          return sortAsc
            ? a.days_prior_to_conversion - b.days_prior_to_conversion
            : b.days_prior_to_conversion - a.days_prior_to_conversion;
        }
        if (sortField === 'step') {
          return sortAsc
            ? a.interaction_number - b.interaction_number
            : b.interaction_number - a.interaction_number;
        }
        // default by conversion_id + step
        const convCmp = a.conversion_id.localeCompare(b.conversion_id);
        if (convCmp !== 0) return sortAsc ? convCmp : -convCmp;
        return a.interaction_number - b.interaction_number;
      });
  }, [
    touchpoints,
    searchTerm,
    channelFilter,
    typeFilter,
    convertingFilter,
    sortField,
    sortAsc,
  ]);

  const handleExportCSV = () => {
    const headers = [
      'conversion_id',
      'user_id_pseudo',
      'conversion_timestamp',
      'conversion_type',
      'conversion_revenue',
      'conversion_currency',
      'interaction_number',
      'interaction_timestamp',
      'days_prior_to_conversion',
      'interaction_type',
      'channel_grouping',
      'site_placement_name',
      'campaign_name',
      'ad_group_name',
      'creative_type',
      'is_converting_interaction',
      'gclid',
    ];

    const rows = filteredRecords.map((r) => [
      r.conversion_id,
      r.user_id_pseudo,
      r.conversion_timestamp,
      r.conversion_type,
      r.conversion_revenue,
      r.conversion_currency,
      r.interaction_number,
      r.interaction_timestamp,
      r.days_prior_to_conversion,
      r.interaction_type,
      r.channel_grouping,
      `"${r.site_placement_name}"`,
      `"${r.campaign_name}"`,
      `"${r.ad_group_name}"`,
      `"${r.creative_type}"`,
      r.is_converting_interaction ? 'TRUE' : 'FALSE',
      r.gclid || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cm360_p2c_touchpoint_stream_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const parsed = parseCSVToTouchpoints(content);
        if (parsed.length > 0) {
          onUploadCSV(parsed);
        }
      }
    };
    reader.readAsText(file);
  };

  const uniqueChannels = Array.from(
    new Set(touchpoints.map((tp) => tp.channel_grouping))
  );

  return (
    <div
      id="raw-touchpoint-stream-card"
      className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Raw CM360 P2C Touchpoint Stream
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-mono">
              {filteredRecords.length} records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log stream of clicks, impressions, placements, and GCLID tokens across lookback window
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* CSV Upload */}
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition shadow-2xs cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload Custom CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, campaign, site, GCLID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 rounded-lg text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        {/* Channel Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
            Channel:
          </span>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Channels</option>
            {uniqueChannels.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
            Type:
          </span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="Impression">Impression Only</option>
            <option value="Click">Click Only</option>
          </select>
        </div>

        {/* Converting filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
            Role:
          </span>
          <select
            value={convertingFilter}
            onChange={(e) => setConvertingFilter(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="TRUE">Converting Only (Last)</option>
            <option value="FALSE">Assisting Only (Pre-conversion)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-600 uppercase tracking-wider font-semibold sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Conversion ID</th>
                <th className="py-2.5 px-3">User Pseudo ID</th>
                <th className="py-2.5 px-2 text-center">Step #</th>
                <th className="py-2.5 px-2 text-center">Days Prior</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Channel Group</th>
                <th className="py-2.5 px-3">Site Placement</th>
                <th className="py-2.5 px-3">Campaign & Creative</th>
                <th className="py-2.5 px-3 text-center">Role</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No touchpoints found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((tp, idx) => (
                  <tr
                    key={`${tp.conversion_id}-${tp.interaction_number}-${idx}`}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="py-2 px-3 font-mono font-bold text-indigo-900">
                      {tp.conversion_id}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-500">
                      {tp.user_id_pseudo}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-mono font-semibold text-[11px] text-slate-700">
                        #{tp.interaction_number}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center font-mono">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          tp.days_prior_to_conversion === 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : tp.days_prior_to_conversion > 60
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tp.days_prior_to_conversion}d
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          tp.interaction_type === 'Click'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                            : 'bg-indigo-50 text-indigo-800 border border-indigo-200/60'
                        }`}
                      >
                        {tp.interaction_type}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {tp.channel_grouping}
                    </td>
                    <td className="py-2 px-3 max-w-xs truncate text-slate-600">
                      {tp.site_placement_name}
                    </td>
                    <td className="py-2 px-3 max-w-xs truncate">
                      <div className="text-slate-800 font-medium truncate">
                        {tp.campaign_name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {tp.creative_type}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {tp.is_converting_interaction ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                          <CheckCircle className="w-3 h-3 text-amber-600" />
                          <span>Closing Touch</span>
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                          Assisting
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => onSelectConversion(tp.conversion_id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 transition cursor-pointer"
                        title="View complete customer journey"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Journey</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
