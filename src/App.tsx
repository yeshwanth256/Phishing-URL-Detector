/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, ScanResult } from './types.js';
import UrlScanner from './components/UrlScanner.jsx';
import ThreatIntelDashboard from './components/ThreatIntelDashboard.jsx';
import ScanHistory from './components/ScanHistory.jsx';
import IpDomainReputation from './components/IpDomainReputation.jsx';
import SecurityReports from './components/SecurityReports.jsx';
import AdvancedFeatures from './components/AdvancedFeatures.jsx';
import AiSecurityAssistant from './components/AiSecurityAssistant.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import UserSettings from './components/UserSettings.jsx';
import UserAuth from './components/UserAuth.jsx';
import { 
  ShieldAlert, 
  Cpu, 
  Layers, 
  Globe, 
  FileText, 
  Settings, 
  Lock, 
  MessageSquare, 
  Clock, 
  Sliders, 
  Activity,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'scanner' | 'dashboard' | 'history' | 'threat-intel' | 'reports' | 'premium' | 'assistant' | 'admin' | 'settings' | 'auth'
  >('scanner');
  const [currentScanContext, setCurrentScanContext] = useState<ScanResult | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleAuthSuccess = (newUser: User, newToken: string) => {
    setCurrentUser(newUser);
    setToken(newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', newToken);
    setActiveTab('scanner'); // Redirect to main scanner on successful authentication
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setActiveTab('auth');
  };

  const handleScanCompleted = (result: ScanResult) => {
    setCurrentScanContext(result);
    // Trigger history table refresh
    setHistoryRefresh(prev => prev + 1);
  };

  const handleOpenChatWithContext = (result: ScanResult) => {
    setCurrentScanContext(result);
    setActiveTab('assistant');
  };

  const selectScanFromHistory = (scan: ScanResult) => {
    setCurrentScanContext(scan);
    setActiveTab('scanner'); // jump back to scanner to inspect detailed widgets
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Cybernetic Status bar */}
      <header className="border-b border-slate-850 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center border border-cyan-400/30 shadow-md shadow-cyan-500/10">
            <Cpu className="h-5 w-5 text-cyan-200 animate-[pulse_2s_infinite]" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base tracking-tight text-white flex items-center gap-2">
              PHISHING DEFENSE GATEWAY
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-mono font-medium tracking-normal">AI v2.5</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Secure Threat Intelligence Console</p>
          </div>
        </div>

        {/* Desktop Profile bar */}
        <div className="hidden md:flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span>DB ENGINE: SECURE</span>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Analyst: <span className="text-cyan-400 font-bold">{currentUser.username}</span></span>
              <button 
                onClick={handleLogout}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded hover:text-rose-400 cursor-pointer transition-all"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setActiveTab('auth')}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider rounded transition-all cursor-pointer"
            >
              AUTHENTICATE GATEWAY
            </button>
          )}
        </div>

        {/* Mobile menu hamburger toggle */}
        <button 
          className="md:hidden p-1 text-slate-400 hover:text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Main split viewport workspace */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Navigation Sidebar Panel */}
        <nav className={`md:w-64 border-r border-slate-850 bg-slate-950/40 p-4 space-y-1.5 shrink-0 z-30 transition-all ${
          sidebarOpen ? 'absolute inset-y-0 left-0 bg-slate-950 w-full' : 'hidden md:block'
        }`}>
          <div className="text-[10px] font-mono text-slate-550 uppercase tracking-widest px-3 py-2">Incident Audit Modules</div>
          
          {/* 1. URL Scanner */}
          <button
            onClick={() => { setActiveTab('scanner'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'scanner' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="h-4 w-4" />
              <span>URL HEURISTIC SCANNER</span>
            </div>
          </button>

          {/* 2. Interactive Dashboards */}
          <button
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4" />
              <span>INDICATORS DASHBOARD</span>
            </div>
          </button>

          {/* 3. Scan Archive logs */}
          <button
            onClick={() => { setActiveTab('history'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4" />
              <span>LOGS & SCAN ARCHIVE</span>
            </div>
          </button>

          {/* 4. Threat Intel lookup */}
          <button
            onClick={() => { setActiveTab('threat-intel'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'threat-intel' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="h-4 w-4" />
              <span>IP & REPUTATION QUERY</span>
            </div>
          </button>

          {/* 5. PDF/TXT Advisory Reports */}
          <button
            onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'reports' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4" />
              <span>INCIDENT REPORT PDF</span>
            </div>
          </button>

          <div className="text-[10px] font-mono text-slate-550 uppercase tracking-widest px-3 py-2 pt-4">Advanced Cybersecurity</div>

          {/* 6. AI Assistant Chatbot */}
          <button
            onClick={() => { setActiveTab('assistant'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'assistant' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4" />
              <span>AI SECURITY ASSISTANT</span>
            </div>
          </button>

          {/* 7. Advanced Utilities */}
          <button
            onClick={() => { setActiveTab('premium'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'premium' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4" />
              <span>PREMIUM SHIELD PACK</span>
            </div>
          </button>

          {/* 8. Admin Control Retraining Panel */}
          <button
            onClick={() => { setActiveTab('admin'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'admin' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="h-4 w-4" />
              <span>ADMIN RETRAINING PANEL</span>
            </div>
          </button>

          <div className="text-[10px] font-mono text-slate-550 uppercase tracking-widest px-3 py-2 pt-4">Operator session</div>

          {/* 9. Portal Settings */}
          <button
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="h-4 w-4" />
              <span>PREFERENCES SETTINGS</span>
            </div>
          </button>

          {/* 10. Credentials portal Auth */}
          <button
            onClick={() => { setActiveTab('auth'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs transition-all cursor-pointer ${
              activeTab === 'auth' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Lock className="h-4 w-4" />
              <span>OPERATOR GATEWAY</span>
            </div>
          </button>
        </nav>

        {/* Viewport content area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'scanner' && (
            <UrlScanner 
              onScanCompleted={handleScanCompleted} 
              openChatWithContext={handleOpenChatWithContext}
              initialResult={currentScanContext}
            />
          )}

          {activeTab === 'dashboard' && <ThreatIntelDashboard />}

          {activeTab === 'history' && (
            <ScanHistory 
              onSelectScan={selectScanFromHistory} 
              selectedScanId={currentScanContext?.id}
              refreshTrigger={historyRefresh}
            />
          )}

          {activeTab === 'threat-intel' && <IpDomainReputation />}

          {activeTab === 'reports' && <SecurityReports currentScanContext={currentScanContext} />}

          {activeTab === 'premium' && <AdvancedFeatures onScanCompleted={handleScanCompleted} />}

          {activeTab === 'assistant' && <AiSecurityAssistant currentScanContext={currentScanContext} />}

          {activeTab === 'admin' && (
            <AdminPanel 
              currentUser={currentUser} 
              onAuthSuccess={handleAuthSuccess} 
            />
          )}

          {activeTab === 'settings' && <UserSettings />}

          {activeTab === 'auth' && (
            <UserAuth 
              onAuthSuccess={handleAuthSuccess} 
              currentUser={currentUser} 
              onLogout={handleLogout} 
            />
          )}
        </main>
      </div>

      {/* Corporate Compliance footer */}
      <footer className="border-t border-slate-850 bg-slate-950 p-4 text-center text-[10px] font-mono text-slate-500">
        AI-Powered Phishing URL Detector • Distributed Sandbox Environment • Standard Security Directives Enforced H1 2026.
      </footer>
    </div>
  );
}
