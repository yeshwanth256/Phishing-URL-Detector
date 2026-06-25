/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { scanSingleUrl } from '../api.js';
import { ScanResult } from '../types.js';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Info, 
  ChevronRight, 
  AlertOctagon, 
  Clock, 
  Cpu, 
  Server, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface UrlScannerProps {
  onScanCompleted: (result: ScanResult) => void;
  openChatWithContext: (result: ScanResult) => void;
  initialResult?: ScanResult | null;
}

export default function UrlScanner({ onScanCompleted, openChatWithContext, initialResult }: UrlScannerProps) {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState<ScanResult | null>(initialResult || null);
  const [error, setError] = useState<string | null>(null);

  // Synchronize with external changes (like scans selected from history)
  React.useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
    }
  }, [initialResult]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate cyber-heuristics engine analysis updates for portfolio-worthy feel
    const stages = [
      'Deconstructing URL parameters and checking string length...',
      'Calculating Shannon character entropy and structural depth...',
      'Interrogating blacklists & threat intelligence feeds (VirusTotal, Safe Browsing)...',
      'Running machine learning classification tree prediction...'
    ];

    let stageIdx = 0;
    setStatusMessage(stages[0]);
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setStatusMessage(stages[stageIdx]);
      }
    }, 450);

    try {
      // Add standard http protocol prefix if missing to satisfy server validator
      let targetUrl = urlInput.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }
      
      const scanData = await scanSingleUrl(targetUrl);
      clearInterval(interval);
      setStatusMessage('Parsing classification results...');
      
      // Artificial slight delay for maximum visual feedback of analysis
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setResult(scanData);
      onScanCompleted(scanData);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'Scan failed. Please verify the URL syntax.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' };
    if (score >= 65) return { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' };
    if (score >= 45) return { text: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/20' };
    return { text: 'text-rose-500', border: 'border-rose-500/30', bg: 'bg-rose-500/10', glow: 'shadow-rose-500/20' };
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Low':
        return <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LOW RISK</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">SUSPICIOUS</span>;
      case 'High':
        return <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">HIGH RISK</span>;
      case 'Critical':
        return <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">CRITICAL THREAT</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6" id="url-scanner-module">
      {/* Title block */}
      <div className="border border-cyan-500/20 bg-slate-900/40 p-6 rounded-lg backdrop-blur-sm">
        <h2 className="text-xl font-sans tracking-tight text-white font-medium flex items-center gap-2">
          <Cpu className="h-5 w-5 text-cyan-400" />
          Heuristic & Machine Learning Analyzer
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Perform a real-time, hybrid sandbox scan on suspicious web links. Our engine deconstructs the URL string, assesses entropy, audits HTTPS configurations, and executes multi-agent threat database lookup queries.
        </p>

        {/* Scan Input Form */}
        <form onSubmit={handleScan} className="mt-5 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              id="scanner-url-input"
              className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-md text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
              placeholder="https://example-banking.com/signin"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            id="scanner-submit-btn"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white rounded-md font-mono font-semibold text-sm tracking-wider flex items-center justify-center gap-2 border border-cyan-400/20 transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98]"
          >
            {loading ? 'ANALYZING...' : 'SCAN URL'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded font-mono flex items-center gap-2" id="scanner-error-box">
            <AlertOctagon className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading / Stage progress */}
        {loading && (
          <div className="mt-5 p-4 border border-cyan-500/20 bg-slate-950/50 rounded-md space-y-3" id="scanner-loading-box">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 animate-pulse flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                CORE ENGAGED: SCANNING URL
              </span>
              <span className="text-slate-500">EST: 2.2s</span>
            </div>
            <div className="h-1 w-full bg-slate-850 rounded-full overflow-hidden relative">
              <div className="h-full bg-cyan-400 rounded-full w-4/5 animate-[pulse_1.5s_infinite]" />
            </div>
            <p className="text-xs font-mono text-slate-400 italic">
              &gt;&gt; {statusMessage}
            </p>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn" id="scanner-results-container">
          {/* Main Score Widget */}
          <div className={`lg:col-span-1 p-6 bg-slate-900/30 border rounded-lg flex flex-col items-center justify-between text-center backdrop-blur-sm ${getScoreColor(result.securityScore).border} ${getScoreColor(result.securityScore).glow} shadow-md`}>
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono text-slate-400">THREAT STATUS</span>
              {getRiskBadge(result.riskLevel)}
            </div>

            <div className="relative my-4 flex items-center justify-center">
              {/* Outer Glow ring */}
              <div className={`absolute w-36 h-36 rounded-full border-2 border-dashed ${getScoreColor(result.securityScore).text} opacity-20 animate-spin`} />
              
              <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-slate-950 border border-slate-800 shadow-inner z-10">
                <span className={`text-4xl font-mono font-bold ${getScoreColor(result.securityScore).text}`}>
                  {result.securityScore}
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-1">SECURITY SCORE</span>
              </div>
            </div>

            <div className="space-y-1 mt-2">
              <h3 className="text-lg font-sans text-white font-medium">
                {result.prediction}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Model Classifier Confidence: <span className="text-slate-300 font-semibold">{result.confidence}%</span>
              </p>
            </div>

            <div className="w-full border-t border-slate-800 pt-4 mt-4 text-left space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Domain Registration</span>
                <span className="text-slate-300">{result.threatIntel.domainAgeDays > 365 ? `${Math.floor(result.threatIntel.domainAgeDays / 365)} years` : `${result.threatIntel.domainAgeDays} days`}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">SSL Connection</span>
                <span className={result.features.isHttps ? 'text-emerald-400' : 'text-rose-400'}>{result.features.isHttps ? 'HTTPS Valid' : 'HTTP Insecure'}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">DNS Records</span>
                <span className={result.threatIntel.dnsRecordsAvailable ? 'text-emerald-400' : 'text-rose-400'}>{result.threatIntel.dnsRecordsAvailable ? 'Online' : 'Not Found'}</span>
              </div>
            </div>

            {/* Quick Contextual Chat Button */}
            <button
              onClick={() => openChatWithContext(result)}
              className="mt-4 w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded font-mono text-xs text-cyan-400 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              ASK AI DETAILED AUDIT
            </button>
          </div>

          {/* Explainable AI & Feature Extraction */}
          <div className="lg:col-span-2 space-y-6">
            {/* Explainable AI indicators - Why was it flagged */}
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg backdrop-blur-sm">
              <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2 mb-4">
                <Info className="h-4 w-4" />
                Explainable AI Threat Attribution
              </h3>
              
              <ul className="space-y-3">
                {result.explanations.map((exp, index) => {
                  const isSafe = result.securityScore >= 85;
                  return (
                    <li 
                      key={index}
                      className={`p-3 rounded text-xs font-mono border flex items-start gap-2.5 ${isSafe ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400/90' : 'bg-rose-500/5 border-rose-500/20 text-rose-400/90'}`}
                    >
                      {isSafe ? (
                        <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                      )}
                      <span>{exp}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Real extracted features table */}
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg backdrop-blur-sm">
              <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4" />
                Heuristic Feature Extractions
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-950/60 rounded border border-slate-850">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">URL Length</span>
                  <span className="text-sm font-mono text-slate-300 font-bold">{result.features.urlLength} characters</span>
                  <span className="block text-[9px] font-mono text-slate-600 mt-1">Normal: &lt; 75</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded border border-slate-850">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Shannon Character Entropy</span>
                  <span className="text-sm font-mono text-slate-300 font-bold">{result.features.entropy.toFixed(3)} bits</span>
                  <span className="block text-[9px] font-mono text-slate-600 mt-1">Obfuscation alert: &gt; 4.5</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded border border-slate-850">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Dots & Domains Depth</span>
                  <span className="text-sm font-mono text-slate-300 font-bold">{result.features.dotsCount} sub-levels</span>
                  <span className="block text-[9px] font-mono text-slate-600 mt-1">Subdomain nesting count</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded border border-slate-850">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Suspicious Keywords</span>
                  <span className="text-sm font-mono text-slate-300 font-bold">{result.features.suspiciousKeywordsCount} matches</span>
                  <span className="block text-[9px] font-mono text-slate-600 mt-1">Trust semantic abuse checks</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded border border-slate-850">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Raw IP Hostname</span>
                  <span className={`text-sm font-mono font-bold ${result.features.hasIPAddress ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {result.features.hasIPAddress ? 'YES' : 'NO'}
                  </span>
                  <span className="block text-[9px] font-mono text-slate-600 mt-1">IP instead of domain</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded border border-slate-850">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Obfuscation @ Mark</span>
                  <span className={`text-sm font-mono font-bold ${result.features.hasAtSymbol ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {result.features.hasAtSymbol ? 'YES' : 'NO'}
                  </span>
                  <span className="block text-[9px] font-mono text-slate-600 mt-1">Visual spoofing character</span>
                </div>
              </div>
            </div>

            {/* Threat Intelligence Integrations */}
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg backdrop-blur-sm">
              <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2 mb-4">
                <Server className="h-4 w-4" />
                Threat Intelligence Indicators
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Safe Browsing */}
                <div className="p-4 bg-slate-950/50 rounded border border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">Google Safe Browsing</span>
                    <span className={`text-xs font-mono font-semibold mt-1 block ${
                      result.threatIntel.safeBrowsingStatus === 'safe' ? 'text-emerald-400' : 
                      result.threatIntel.safeBrowsingStatus === 'malicious' ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                    }`}>
                      {result.threatIntel.safeBrowsingStatus.toUpperCase()}
                    </span>
                  </div>
                  <Shield className={`h-8 w-8 ${result.threatIntel.safeBrowsingStatus === 'safe' ? 'text-emerald-500/20' : 'text-rose-500/20'}`} />
                </div>

                {/* VirusTotal */}
                <div className="p-4 bg-slate-950/50 rounded border border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">VirusTotal Lookups</span>
                    <span className={`text-xs font-mono font-semibold mt-1 block ${result.threatIntel.virusTotalScore > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {result.threatIntel.blacklistCount} Vendor Flags
                    </span>
                  </div>
                  <AlertOctagon className={`h-8 w-8 ${result.threatIntel.virusTotalScore > 5 ? 'text-rose-500/20 animate-bounce' : 'text-emerald-500/20'}`} />
                </div>

                {/* AbuseIPDB */}
                <div className="p-4 bg-slate-950/50 rounded border border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">AbuseIPDB Threat Score</span>
                    <span className={`text-xs font-mono font-semibold mt-1 block ${result.threatIntel.abuseIpScore > 40 ? 'text-orange-400' : 'text-emerald-400'}`}>
                      {result.threatIntel.abuseIpScore}% Confidence
                    </span>
                  </div>
                  <Clock className="h-8 w-8 text-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
