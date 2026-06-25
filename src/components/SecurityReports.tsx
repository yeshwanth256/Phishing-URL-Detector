/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScanResult } from '../types.js';
import { 
  FileText, 
  Download, 
  ShieldAlert, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle, 
  RefreshCw,
  Eye
} from 'lucide-react';

interface SecurityReportsProps {
  currentScanContext: ScanResult | null;
}

export default function SecurityReports({ currentScanContext }: SecurityReportsProps) {
  const [downloading, setDownloading] = useState(false);

  // Generate simulated incident document contents
  const generateAdvisoryDocument = (scan: ScanResult) => {
    return `======================================================================
              AI-POWERED PHISHING URL DETECTOR - ADVISORY REPORT
======================================================================
Incident ID:       ${scan.id}
Date Generated:    ${new Date().toUTCString()}
Target URL:        ${scan.url}
======================================================================
EXECUTIVE SUMMARY:
  Threat Rating:   ${scan.prediction.toUpperCase()}
  Risk Severity:   ${scan.riskLevel.toUpperCase()}
  Security Score:  ${scan.securityScore}/100
  Confidence:      ${scan.confidence}%

DESCRIPTION:
  Our Machine Learning and heuristic classifiers analyzed the target URL 
  and flag indicators. A security score of ${scan.securityScore} was calculated 
  (where 100 indicates perfect safety).

THREAT ATTRIBUTIONS & VULNERABILITY LOGS:
${scan.explanations.map((exp, i) => `  [${i+1}] ${exp}`).join('\n')}

HEURISTIC EXTRACTS:
  * URL Length: ${scan.features.urlLength} characters
  * Shannon Entropy: ${scan.features.entropy} bits
  * Dots Count: ${scan.features.dotsCount}
  * Https Enforced: ${scan.features.isHttps ? 'TRUE' : 'FALSE'}
  * Has IP address: ${scan.features.hasIPAddress ? 'TRUE' : 'FALSE'}

RECOMMENDED MITIGATION PROCEDURES:
  1. FIREWALL QUARANTINE: Apply transport filtering rules blocking all egress 
     routing to "${scan.url}" at the perimeter router or local proxy layers.
  2. DNS BLACKLISTING: Inject blackhole DNS configurations resolving lookups 
     for domain hosts to 0.0.0.0 on internal company nameservers.
  3. CREDENTIAL FORCE-RESET: If internal telemetry suggests employee visits, 
     instantly force-expire Active Directory user credentials and active tokens.
  4. BROWSER FEEDBACK: Submit suspicious URL patterns to Google Safe Browsing 
     and Microsoft SmartScreen portals.

======================================================================
CLASSIFIER COMPILED BY AI-POWERED CYBERSECURITY SCANNER GATEWAY
======================================================================`;
  };

  const handleDownload = () => {
    if (!currentScanContext) return;
    setDownloading(true);

    setTimeout(() => {
      const documentContent = generateAdvisoryDocument(currentScanContext);
      const blob = new Blob([documentContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Incident-Advisory-Report-${currentScanContext.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="reports-module">
      <div className="border border-cyan-500/20 bg-slate-900/40 p-6 rounded-lg backdrop-blur-sm">
        <h2 className="text-xl font-sans tracking-tight text-white font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          Incident Report Generator & Advisory PDF Engine
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Export exhaustive, developer-grade incident reviews, threat profiles, and recommended firewall rule modifications.
        </p>
      </div>

      {currentScanContext ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Executive overview card */}
          <div className="lg:col-span-1 bg-slate-900/30 border border-slate-800 p-6 rounded-lg flex flex-col justify-between shadow-md">
            <div>
              <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">REPORT PROFILE</span>
                <span className="text-xs font-mono font-bold text-rose-400">{currentScanContext.id.substring(0, 12).toUpperCase()}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">INSPECTED OBJECT</span>
                  <p className="text-xs font-mono text-white truncate mt-1 font-semibold" title={currentScanContext.url}>
                    {currentScanContext.url}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded">
                    <span className="block text-[9px] font-mono text-slate-500">RATING</span>
                    <span className={`text-xs font-mono font-bold mt-1 block ${currentScanContext.securityScore >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {currentScanContext.prediction.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded">
                    <span className="block text-[9px] font-mono text-slate-500">SECURITY SCORE</span>
                    <span className="text-xs font-mono font-bold text-white mt-1 block">
                      {currentScanContext.securityScore}/100
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/40 border border-slate-850 rounded font-mono text-xs text-slate-400">
                  This file meets the administrative standard for corporate compliance audits and contains actionable threat mitigations.
                </div>
              </div>
            </div>

            {/* Download Advisory Document */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded font-mono font-bold text-xs tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
            >
              {downloading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  GENERATING REPORT...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  DOWNLOAD INCIDENT REPORT
                </>
              )}
            </button>
          </div>

          {/* Mitigation Procedures view */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg">
              <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2 mb-4">
                <Briefcase className="h-4 w-4" />
                SOC Analyst Actionable Defense Procedures
              </h3>

              <div className="space-y-4 font-mono text-xs">
                {/* 1. Perimeter block */}
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-[10px]">ADVISORY 01</span>
                    PERIMETER QUARANTINE BLOCK
                  </div>
                  <p className="text-slate-400 mt-2 leading-relaxed">
                    Deploy standard Layer-7 firewalls rules to filter outbound connections attempting to negotiate HTTP/HTTPS handshakes with domain <code className="bg-slate-900 px-1 text-slate-200">{new URL(currentScanContext.url.startsWith('http') ? currentScanContext.url : 'http://' + currentScanContext.url).hostname}</code>. This halts drive-by downloads or payload transfers.
                  </p>
                </div>

                {/* 2. DNS Sinkhole */}
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-[10px]">ADVISORY 02</span>
                    DNS SINKHOLE INJECTION
                  </div>
                  <p className="text-slate-400 mt-2 leading-relaxed">
                    Inject a static zone entry inside corporate core BIND/Active Directory domain name servers (DNS) mapping resolving lookups of the malicious host to local loopback loop <code className="bg-slate-900 px-1 text-slate-200">127.0.0.1</code> or isolated incident traps.
                  </p>
                </div>

                {/* 3. Session Invalidations */}
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-[10px]">ADVISORY 03</span>
                    CREDENTIAL INVALIDATION
                  </div>
                  <p className="text-slate-400 mt-2 leading-relaxed">
                    If intranet logs indicate employee browser interactions with this landing page, trigger automated token invalidation protocols across Single-Sign-On gateways. Prompt immediate multifactor authentication resets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 border border-dashed border-slate-800 rounded-lg text-center bg-slate-950/10 font-mono text-xs text-slate-500">
          No URL scan profile is loaded in active memory. Please execute a scan under the <span className="text-cyan-400 font-semibold uppercase">Scanner</span> view first, then navigate back to compile the threat advisory document.
        </div>
      )}
    </div>
  );
}
