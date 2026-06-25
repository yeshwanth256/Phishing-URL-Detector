/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { searchThreatIntel } from '../api.js';
import { ThreatIntelData } from '../types.js';
import { 
  Globe, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Database, 
  AlertTriangle, 
  Terminal, 
  FileCheck 
} from 'lucide-react';

export default function IpDomainReputation() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Clean query (strip protocol if accidentally typed for raw domain lookup)
      const cleanQuery = query.trim().replace(/^https?:\/\//i, '').split('/')[0];
      const data = await searchThreatIntel(cleanQuery);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Threat intelligence query failed.');
    } finally {
      setLoading(false);
    }
  };

  const getReputationLabel = (score: number) => {
    if (score >= 80) return { text: 'HIGH TRUST', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (score >= 50) return { text: 'SUSPICIOUS REPUTATION', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    return { text: 'DANGEROUS / MALICIOUS', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
  };

  return (
    <div className="space-y-6" id="threat-intel-module">
      <div className="border border-cyan-500/20 bg-slate-900/40 p-6 rounded-lg backdrop-blur-sm">
        <h2 className="text-xl font-sans tracking-tight text-white font-medium flex items-center gap-2">
          <Globe className="h-5 w-5 text-cyan-400" />
          IP & Domain Reputation lookup
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Directly audit domains, subdomains, and host IP addresses across commercial threat registers.
        </p>

        {/* Lookup bar */}
        <form onSubmit={handleLookup} className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <Terminal className="h-4 w-4" />
            </span>
            <input
              type="text"
              id="intel-search-input"
              className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-md text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
              placeholder="e.g. 192.168.1.104 or malicious-login-portal.net"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            id="intel-submit-btn"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white rounded-md font-mono font-semibold text-sm tracking-wider flex items-center justify-center gap-2 border border-cyan-400/20 transition-all transition-colors cursor-pointer active:scale-[0.98]"
          >
            {loading ? 'LOOKING UP...' : 'QUERY REPUTATION'}
          </button>
        </form>

        {error && (
          <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded font-mono flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-400 mt-4">FETCHING THREAT INTELLIGENCE AGGREGATIONS...</p>
        </div>
      )}

      {/* Result Metrics */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn" id="intel-results-container">
          {/* Summary Column */}
          <div className={`lg:col-span-1 p-6 bg-slate-900/30 border rounded-lg flex flex-col items-center text-center justify-between shadow-md ${getReputationLabel(result.threatIntel.reputationScore).border}`}>
            <div className="w-full border-b border-slate-800 pb-3 mb-4 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">OBJECT CLASSIFICATION</span>
              <span className="text-cyan-400 font-semibold">{result.type.toUpperCase()}</span>
            </div>

            <div className="my-4">
              <div className="text-5xl font-mono font-bold text-white mb-2">{result.threatIntel.reputationScore}%</div>
              <span className={`px-3 py-1 rounded text-[10px] font-mono font-bold border ${getReputationLabel(result.threatIntel.reputationScore).bg} ${getReputationLabel(result.threatIntel.reputationScore).color} ${getReputationLabel(result.threatIntel.reputationScore).border}`}>
                {getReputationLabel(result.threatIntel.reputationScore).text}
              </span>
            </div>

            <div className="w-full border-t border-slate-800 pt-4 mt-4 text-left space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Query Target</span>
                <span className="text-slate-300 truncate max-w-[150px] font-semibold" title={result.query}>{result.query}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">DNS State</span>
                <span className={result.threatIntel.dnsRecordsAvailable ? 'text-emerald-400' : 'text-rose-400'}>
                  {result.threatIntel.dnsRecordsAvailable ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Safe Browsing</span>
                <span className={result.threatIntel.safeBrowsingStatus === 'safe' ? 'text-emerald-400' : 'text-rose-400'}>
                  {result.threatIntel.safeBrowsingStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed breakdown metrics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg">
              <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2 mb-4">
                <Database className="h-4 w-4" />
                Aggregated Reputation Registers
              </h3>

              <div className="space-y-4">
                {/* VirusTotal */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-300 font-semibold block">VirusTotal Multi-Engine Lookup</span>
                    <span className="text-[11px] font-mono text-slate-500 block mt-0.5">Scans URL against 70+ commercial antivirus vendor signatures.</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-mono font-bold block ${result.threatIntel.virusTotalScore > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {result.threatIntel.blacklistCount} vendor alarms
                    </span>
                    <span className="text-[9px] font-mono text-slate-600 block">Detections: {result.threatIntel.virusTotalScore}%</span>
                  </div>
                </div>

                {/* AbuseIPDB */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-300 font-semibold block">AbuseIPDB Abuse Confidence Index</span>
                    <span className="text-[11px] font-mono text-slate-500 block mt-0.5">Correlates active firewall logs and user incident reporting streams.</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-mono font-bold block ${result.threatIntel.abuseIpScore > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {result.threatIntel.abuseIpScore}% confidence
                    </span>
                    <span className="text-[9px] font-mono text-slate-600 block">Malicious score weight</span>
                  </div>
                </div>

                {/* Domain Registration Profile */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-300 font-semibold block">WHOIS Registration Age Profiles</span>
                    <span className="text-[11px] font-mono text-slate-500 block mt-0.5">Phishing sites are overwhelmingly host-active for short durations.</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-mono font-bold block ${result.threatIntel.domainAgeDays < 90 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {result.threatIntel.domainAgeDays} Active Days
                    </span>
                    <span className="text-[9px] font-mono text-slate-600 block">Reg Length: {result.threatIntel.domainRegistrationLengthYears} Year(s)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg">
              <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2 mb-3">
                <FileCheck className="h-4 w-4" />
                Network Security Advisory Action
              </h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                {result.threatIntel.reputationScore >= 80 ? (
                  'Advisory status GREEN: This object possesses clean certificates and a solid historical domain lease length. Standard routing permissions are recommended.'
                ) : result.threatIntel.reputationScore >= 50 ? (
                  'Advisory status AMBER: Obfuscated naming layers or short registrar durations were parsed. Implement temporary transport auditing controls or quarantine until explicit administrator review completes.'
                ) : (
                  'Advisory status RED: CRITICAL security risk detected. Instantly activate router-level blocking rules on corporate firewalls. Alert DNS directory controllers to blacklist resolve lookups for corporate sub-networks immediately.'
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
