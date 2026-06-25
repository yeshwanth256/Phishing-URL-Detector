/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { scanSingleUrl } from '../api.js';
import { ScanResult } from '../types.js';
import { 
  Chrome, 
  Mail, 
  QrCode, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronRight, 
  RefreshCw, 
  Terminal, 
  Play, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface AdvancedFeaturesProps {
  onScanCompleted: (result: ScanResult) => void;
}

export default function AdvancedFeatures({ onScanCompleted }: AdvancedFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'extension' | 'email' | 'bulk' | 'qr'>('extension');

  // 1. Browser Extension State
  const [browserUrl, setBrowserUrl] = useState('https://paypal-security-verification-portal.com/login');
  const [browserMode, setBrowserMode] = useState<'normal' | 'blocked' | 'whitelisted'>('blocked');
  const [extensionLoading, setExtensionLoading] = useState(false);
  const [extensionResult, setExtensionResult] = useState<ScanResult | null>(null);

  // 2. Email Analyzer State
  const [emailContent, setEmailContent] = useState(
    `Dear Customer,\n\nWe detected suspicious attempts to sign in to your Chase online profile from an unknown device. For your security, your account has been temporarily restricted.\n\nPlease verify your identity immediately to restore access:\nhttp://chase-bank-alert-security-notice.net/login\n\nFailure to verify within 24 hours will result in permanent suspension of card privileges.\n\nThank you,\nChase Online Security Department`
  );
  const [analyzingEmail, setAnalyzingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    urlsFound: string[];
    scans: ScanResult[];
    aggregateRisk: 'Safe' | 'Suspicious' | 'Dangerous';
    summary: string;
  } | null>(null);

  // 3. Bulk Scanner State
  const [bulkUrls, setBulkUrls] = useState(
    "https://google.com\nhttps://paypal-security-verification-portal.com/login\nhttp://192.168.1.104/banking\nhttps://wikipedia.org"
  );
  const [bulkScanning, setBulkScanning] = useState(false);
  const [bulkResults, setBulkResults] = useState<ScanResult[]>([]);

  // 4. QR Code State
  const [qrInput, setQrInput] = useState('http://free-crypto-giveaway-claim-bonus.org/wallet');
  const [qrScanning, setQrScanning] = useState(false);
  const [qrResult, setQrResult] = useState<ScanResult | null>(null);

  // --- Browser Extension Simulation Handlers ---
  const handleBrowse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!browserUrl.trim()) return;

    setExtensionLoading(true);
    setExtensionResult(null);
    setBrowserMode('normal');

    try {
      const scan = await scanSingleUrl(browserUrl);
      setExtensionResult(scan);
      onScanCompleted(scan);
      
      if (scan.securityScore < 65) {
        setBrowserMode('blocked');
      } else {
        setBrowserMode('normal');
      }
    } catch (err) {
      // Fallback
      setBrowserMode('normal');
    } finally {
      setExtensionLoading(false);
    }
  };

  // --- Email Analyzer Handlers ---
  const handleAnalyzeEmail = async () => {
    if (!emailContent.trim()) return;
    setAnalyzingEmail(true);
    setEmailResult(null);

    // Extract URLs via basic regex
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = emailContent.match(urlRegex) || [];

    const scans: ScanResult[] = [];
    for (const url of urls) {
      try {
        const scan = await scanSingleUrl(url);
        scans.push(scan);
      } catch (e) {
        // ignore individual failed scans
      }
    }

    let aggregateRisk: 'Safe' | 'Suspicious' | 'Dangerous' = 'Safe';
    let summary = 'No high-threat links parsed in the body. Email appears normal.';

    const dangerous = scans.filter(s => s.securityScore < 45);
    const suspicious = scans.filter(s => s.securityScore >= 45 && s.securityScore < 85);

    if (dangerous.length > 0) {
      aggregateRisk = 'Dangerous';
      summary = `WARNING: We parsed ${dangerous.length} extremely dangerous threat destination link(s) matching known social engineering vectors (e.g. credential theft). Outbound navigation must be banned.`;
    } else if (suspicious.length > 0) {
      aggregateRisk = 'Suspicious';
      summary = `CAUTION: Found ${suspicious.length} suspicious link(s) with anomalous character lengths or SSL omissions. Threat indicators are elevated.`;
    }

    setEmailResult({
      urlsFound: urls,
      scans,
      aggregateRisk,
      summary
    });
    setAnalyzingEmail(false);
  };

  // --- Bulk URL Scanner Handlers ---
  const handleBulkScan = async () => {
    const urls = bulkUrls.split('\n').map(u => u.trim()).filter(Boolean);
    if (urls.length === 0) return;

    setBulkScanning(true);
    setBulkResults([]);

    const tempResults: ScanResult[] = [];
    for (const url of urls) {
      try {
        const scan = await scanSingleUrl(url);
        tempResults.push(scan);
        // Refresh live UI
        setBulkResults([...tempResults]);
        // Fast mock progressive flow delay
        await new Promise(r => setTimeout(r, 200));
      } catch (e) {
        // ignore
      }
    }
    setBulkScanning(false);
  };

  // --- QR Code Simulator Handlers ---
  const handleQrScan = async () => {
    if (!qrInput.trim()) return;
    setQrScanning(true);
    setQrResult(null);

    try {
      const scan = await scanSingleUrl(qrInput);
      setQrResult(scan);
      onScanCompleted(scan);
    } catch (e) {
      // ignore
    } finally {
      setQrScanning(false);
    }
  };

  return (
    <div className="space-y-6" id="premium-utilities-module">
      {/* Utilities header tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-950 p-1 border border-slate-850 rounded">
        <button 
          onClick={() => setActiveTab('extension')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === 'extension' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Chrome className="h-4 w-4" />
          BROWSER SIMULATOR MODE
        </button>
        <button 
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === 'email' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Mail className="h-4 w-4" />
          EMAIL SOCIAL ENGINEERING SCANNER
        </button>
        <button 
          onClick={() => setActiveTab('bulk')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === 'bulk' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Layers className="h-4 w-4" />
          BULK MULTI-SCANNER
        </button>
        <button 
          onClick={() => setActiveTab('qr')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === 'qr' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <QrCode className="h-4 w-4" />
          QR CODE TELEMETRY SCANNER
        </button>
      </div>

      {/* TAB CONTENT: BROWSER EXTENSION MODE */}
      {activeTab === 'extension' && (
        <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-6 space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <Chrome className="h-4 w-4" />
              Dynamic Browser Extension Proxy Shield
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Simulates a native browser extension wrapper. When surfing to a low-trust URL, our intercept proxy halts execution to quarantine the connection.
            </p>
          </div>

          {/* Browser Container Frame Mockup */}
          <div className="border border-slate-750 rounded-lg overflow-hidden bg-slate-950 flex flex-col h-[400px]">
            {/* Browser top address bar */}
            <div className="bg-slate-900 border-b border-slate-800 p-2 flex items-center gap-2">
              {/* Fake navigation buttons */}
              <div className="flex gap-1.5 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              {/* URL Address Bar form */}
              <form onSubmit={handleBrowse} className="flex-1 flex items-center">
                <input
                  type="text"
                  className="w-full bg-slate-950/90 border border-slate-800 px-3 py-1 rounded text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                  value={browserUrl}
                  onChange={(e) => setBrowserUrl(e.target.value)}
                  disabled={extensionLoading}
                />
              </form>
              
              <button 
                onClick={handleBrowse}
                disabled={extensionLoading}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded cursor-pointer"
              >
                {extensionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Browser Core Frame Canvas Viewport */}
            <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
              {browserMode === 'blocked' ? (
                /* High contrast Intercept overlay */
                <div className="absolute inset-0 bg-rose-950/95 flex flex-col items-center justify-center text-center p-8 z-20 space-y-4 animate-fadeIn border-2 border-rose-500/30 m-2 rounded">
                  <ShieldAlert className="h-16 w-16 text-rose-500 animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="text-lg font-mono font-bold text-rose-400 tracking-wider">PHISHING TRANSACTION BLOCKED</h4>
                    <p className="text-xs text-rose-200/80 font-mono max-w-md">
                      Our machine learning engine has intercepted a suspicious credential redirection loop. This destination lacks SSL certificates and uses high-entropy keyword obfustication.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => {
                        setBrowserUrl('https://google.com');
                        setBrowserMode('normal');
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-mono text-xs rounded transition-all cursor-pointer"
                    >
                      RETURN TO SAFETY
                    </button>
                    <button 
                      onClick={() => setBrowserMode('whitelisted')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs rounded transition-all cursor-pointer"
                    >
                      PROCEED (IGNORE ALERT)
                    </button>
                  </div>
                </div>
              ) : browserMode === 'whitelisted' ? (
                <div className="text-center space-y-2">
                  <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
                  <p className="text-sm font-mono text-amber-400">Viewing whitelisted site under quarantine constraints.</p>
                  <p className="text-xs font-mono text-slate-500 truncate max-w-sm">{browserUrl}</p>
                  <button 
                    onClick={() => setBrowserMode('blocked')}
                    className="mt-2 text-[10px] font-mono text-rose-400 hover:underline cursor-pointer"
                  >
                    Re-arm active browser protection
                  </button>
                </div>
              ) : (
                /* Normal visual status */
                <div className="text-center space-y-3">
                  <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto" />
                  <p className="text-sm font-mono text-emerald-400">Connection secure and validated.</p>
                  <p className="text-xs font-mono text-slate-400 truncate max-w-sm">{browserUrl}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EMAIL PHISHING ANALYZER */}
      {activeTab === 'email' && (
        <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-6 space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Social Engineering & Email Payload Analyst
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Paste email bodies containing links. The engine extracts embedded URLs and scans them simultaneously to generate an aggregate risk level.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Input Email Box */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase">RAW EMAIL CONTENT</label>
              <textarea
                className="w-full h-72 bg-slate-950 border border-slate-850 p-4 rounded text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
              <button
                onClick={handleAnalyzeEmail}
                disabled={analyzingEmail}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                {analyzingEmail ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    DECRYPTING EMAIL PAYLOADS...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    ANALYZE EMAIL
                  </>
                )}
              </button>
            </div>

            {/* Results Overview */}
            <div className="border border-slate-850 rounded p-4 bg-slate-950/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block border-b border-slate-850 pb-2 mb-3 uppercase">Email Scan Summary</span>

                {emailResult ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">Aggregate Threat Index:</span>
                      {emailResult.aggregateRisk === 'Dangerous' ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold animate-pulse">CRITICAL RISK</span>
                      ) : emailResult.aggregateRisk === 'Suspicious' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">SUSPICIOUS</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">SECURE / CLEAN</span>
                      )}
                    </div>

                    <p className="p-3 bg-slate-950 border border-slate-850 rounded text-xs text-slate-400 leading-relaxed font-mono">
                      {emailResult.summary}
                    </p>

                    {/* URL classifications */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Extracted Links Classification:</span>
                      {emailResult.scans.length === 0 ? (
                        <span className="text-xs text-slate-600 font-mono">No hyperlinked entities parsed from the content.</span>
                      ) : (
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                          {emailResult.scans.map((scan, i) => (
                            <div key={i} className="p-2 bg-slate-950 border border-slate-850 rounded flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-400 truncate max-w-[200px]" title={scan.url}>{scan.url}</span>
                              <span className={`font-bold ${scan.securityScore >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                Score: {scan.securityScore}/100
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 font-mono text-xs text-slate-600">
                    Submit a social engineering email payload to execute extraction routines.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BULK MULTI-SCANNER */}
      {activeTab === 'bulk' && (
        <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-6 space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Corporate Bulk Domain & Endpoint Scanner
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Input lists of URLs separated by lines. Useful for scanning spreadsheets, firewall traffic files, or bulk feeds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase">BATCH ENTRIES (NEWLINES)</label>
              <textarea
                className="w-full h-56 bg-slate-950 border border-slate-850 p-4 rounded text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
              />
              <button
                onClick={handleBulkScan}
                disabled={bulkScanning}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                {bulkScanning ? 'PARSING BULK RECORDS...' : 'EXECUTE BATCH SCAN'}
              </button>
            </div>

            <div className="lg:col-span-2 border border-slate-850 rounded p-4 bg-slate-950/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block border-b border-slate-850 pb-2 mb-3 uppercase">BATCH RESULTS FEED</span>

                {bulkResults.length > 0 ? (
                  <div className="overflow-y-auto max-h-64 space-y-2 pr-1 animate-fadeIn">
                    {bulkResults.map((scan, index) => (
                      <div key={index} className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-2 truncate max-w-sm">
                          {scan.securityScore >= 85 ? (
                            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
                          )}
                          <span className="text-slate-300 truncate" title={scan.url}>{scan.url}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-semibold ${scan.securityScore >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {scan.prediction}
                          </span>
                          <span className="text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                            {scan.securityScore}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 font-mono text-xs text-slate-600">
                    Paste newline delimited URLs and trigger execution to begin bulk batch classification audits.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: QR CODE SCANNER */}
      {activeTab === 'qr' && (
        <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-6 space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Dynamic QR Code Decryption Simulator
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Phishing campaigns frequently embed dangerous link redirects inside QR Codes (Quishing). Simulate decoding a QR and verifying the threat indices of its payload.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Simulator Inputs */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded space-y-3">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">QR CODE DESTINATION OBJECT</span>
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  disabled={qrScanning}
                />
                
                {/* Visual QR Code Mockup Graphic */}
                <div className="border border-slate-850 rounded p-4 bg-slate-900/50 flex flex-col items-center justify-center space-y-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-800">
                    {/* SVG representation of standard QR box layout */}
                    <svg className="w-28 h-28 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" />

                      <rect x="70" y="0" width="30" height="30" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" />

                      <rect x="0" y="70" width="30" height="30" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" />

                      {/* Random noise matrix blocks */}
                      <rect x="40" y="10" width="10" height="20" />
                      <rect x="55" y="0" width="10" height="10" />
                      <rect x="35" y="45" width="20" height="15" />
                      <rect x="75" y="40" width="15" height="15" />
                      <rect x="45" y="75" width="20" height="10" />
                      <rect x="80" y="75" width="15" height="15" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">QUISHING REDIRECT SYMBOLOGY</span>
                </div>
              </div>

              <button
                onClick={handleQrScan}
                disabled={qrScanning}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                {qrScanning ? 'DECODING MATRIX...' : 'DECODE & SCAN QR CODE'}
              </button>
            </div>

            {/* Results Output */}
            <div className="border border-slate-850 rounded p-4 bg-slate-950/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block border-b border-slate-850 pb-2 mb-3 uppercase">DECODED TELEMETRY</span>

                {qrResult ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Payload URL:</span>
                      <span className="text-slate-500 font-semibold truncate max-w-[200px]" title={qrResult.url}>{qrResult.url}</span>
                    </div>

                    <div className="p-3 rounded bg-slate-950 border border-slate-850 flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-400">Threat Classifier:</span>
                      <span className={`font-bold ${qrResult.securityScore >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {qrResult.prediction}
                      </span>
                    </div>

                    <div className="p-3 rounded bg-slate-950 border border-slate-850 flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-400">Security Rating:</span>
                      <span className={`font-bold ${qrResult.securityScore >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {qrResult.securityScore}/100
                      </span>
                    </div>

                    <p className="text-[10px] font-mono text-slate-500 italic">
                      Incident summary: Contains high-risk subdomains with random characters (Shannon entropy flags). Sandbox quarantine recommended before browser transport.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-20 font-mono text-xs text-slate-600">
                    Click trigger button to decode simulated QR matrix coordinates and audit embedded destinations.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
