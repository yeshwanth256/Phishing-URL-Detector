/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getScanHistory } from '../api.js';
import { ScanResult } from '../types.js';
import { 
  Search, 
  Trash2, 
  Clock, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle 
} from 'lucide-react';

interface ScanHistoryProps {
  onSelectScan: (scan: ScanResult) => void;
  selectedScanId?: string;
  refreshTrigger?: number;
}

export default function ScanHistory({ onSelectScan, selectedScanId, refreshTrigger }: ScanHistoryProps) {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [filteredScans, setFilteredScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'safe' | 'suspicious' | 'malicious'>('all');

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getScanHistory();
        setScans(history);
        setFilteredScans(history);
      } catch (e) {
        console.error('Failed to load history:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [refreshTrigger]);

  // Handle Search and Filter transformations
  useEffect(() => {
    let result = scans;

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.url.toLowerCase().includes(q) || s.prediction.toLowerCase().includes(q));
    }

    // Filter categorization check
    if (filterType === 'safe') {
      result = result.filter(s => s.securityScore >= 85);
    } else if (filterType === 'suspicious') {
      result = result.filter(s => s.securityScore >= 65 && s.securityScore < 85);
    } else if (filterType === 'malicious') {
      result = result.filter(s => s.securityScore < 65);
    }

    setFilteredScans(result);
  }, [searchQuery, filterType, scans]);

  const getScoreBadge = (score: number) => {
    if (score >= 85) return <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/20">{score}/100</span>;
    if (score >= 65) return <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-mono border border-amber-500/20">{score}/100</span>;
    return <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[10px] font-mono border border-rose-500/20">{score}/100</span>;
  };

  const getStatusIcon = (score: number) => {
    if (score >= 85) return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
    if (score >= 65) return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    return <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />;
  };

  return (
    <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-lg backdrop-blur-sm" id="scan-history-module">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
        <div>
          <h2 className="text-lg font-sans text-white font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-400" />
            Security Incident Logs & Scan Archive
          </h2>
          <p className="text-xs text-slate-500 mt-1">Audit historical web telemetry indices and threat ratings.</p>
        </div>
        
        {/* Quick filters */}
        <div className="flex gap-1.5 bg-slate-950 p-1 border border-slate-850 rounded">
          <button 
            onClick={() => setFilterType('all')} 
            className={`px-3 py-1 text-[10px] font-mono rounded transition-all ${filterType === 'all' ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            ALL
          </button>
          <button 
            onClick={() => setFilterType('safe')} 
            className={`px-3 py-1 text-[10px] font-mono rounded transition-all ${filterType === 'safe' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            SAFE
          </button>
          <button 
            onClick={() => setFilterType('suspicious')} 
            className={`px-3 py-1 text-[10px] font-mono rounded transition-all ${filterType === 'suspicious' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            SUSPICIOUS
          </button>
          <button 
            onClick={() => setFilterType('malicious')} 
            className={`px-3 py-1 text-[10px] font-mono rounded transition-all ${filterType === 'malicious' ? 'bg-rose-500/20 text-rose-400 font-semibold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            THREATS
          </button>
        </div>
      </div>

      {/* Search query block */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
          <Search className="h-3.5 w-3.5" />
        </span>
        <input
          type="text"
          id="history-search-input"
          className="w-full pl-9 pr-4 py-2 bg-slate-950/75 border border-slate-855 rounded text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs transition-all"
          placeholder="Search logs by URL string or prediction label..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabular Archive */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-800 rounded bg-slate-950/20 font-mono text-xs text-slate-600">
          No audit logs matching search/filter thresholds.
        </div>
      ) : (
        <div className="overflow-x-auto" id="history-table-container">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 bg-slate-950/50">
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">TARGET DOMAIN / URL</th>
                <th className="py-2.5 px-3">CLASSIFIER RATING</th>
                <th className="py-2.5 px-3">SCORE</th>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.map((scan) => {
                const isSelected = selectedScanId === scan.id;
                return (
                  <tr 
                    key={scan.id} 
                    className={`border-b border-slate-850/40 hover:bg-slate-950/40 transition-colors ${isSelected ? 'bg-cyan-500/5' : ''}`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(scan.securityScore)}
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-300 font-semibold" title={scan.url}>
                      {scan.url}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-medium">
                      {scan.prediction}
                    </td>
                    <td className="py-3 px-3">
                      {getScoreBadge(scan.securityScore)}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {new Date(scan.timestamp).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectScan(scan)}
                        className="px-2.5 py-1 text-[10px] font-sans font-semibold rounded bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20 border border-cyan-500/20 hover:border-cyan-400/40 transition-all"
                      >
                        AUDIT DETAILS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
