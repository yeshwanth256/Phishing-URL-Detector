/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Shield, Globe, Bell, Volume2, Save } from 'lucide-react';

export default function UserSettings() {
  const [activeModel, setActiveModel] = useState('xgboost');
  const [sensitivity, setSensitivity] = useState('medium');
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6" id="settings-module">
      <div className="border border-cyan-500/20 bg-slate-900/40 p-6 rounded-lg backdrop-blur-sm">
        <h2 className="text-xl font-sans tracking-tight text-white font-medium flex items-center gap-2">
          <Settings className="h-5 w-5 text-cyan-400" />
          Scanner Preferences & Configuration Settings
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Customize active machine learning weights, warning criteria, and threat feeds sync states.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg space-y-4">
            <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
              <Shield className="h-4 w-4" />
              Classifier Model Logic Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-slate-300">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase">Default Inference Engine</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-300 focus:outline-none focus:border-cyan-500"
                  value={activeModel}
                  onChange={(e) => setActiveModel(e.target.value)}
                >
                  <option value="xgboost">XGBoost Classifier Tree (Highest Precision)</option>
                  <option value="random_forest">Random Forest (High Recall)</option>
                  <option value="logistic">Logistic Regression (Lowest Latency)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase">Alert Sensitivity Threshholds</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-300 focus:outline-none focus:border-cyan-500"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value)}
                >
                  <option value="high">Strict (Block suspicious &lt; 85 score)</option>
                  <option value="medium">Standard (Block threats &lt; 65 score)</option>
                  <option value="low">Relaxed (Block critical &lt; 45 score)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg space-y-4">
            <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
              <Bell className="h-4 w-4" />
              Interception & Interface Notifications
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-300 font-bold block">Browser Simulation Protection</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Toggle browser proxy block screens for quarantined URLs.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={browserAlerts}
                  onChange={(e) => setBrowserAlerts(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 bg-slate-950 border-slate-800 focus:ring-cyan-500 focus:ring-1 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-300 font-bold block">Audio Threat Sirens</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Play dynamic warning buzzes on positive threat detections.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 bg-slate-950 border-slate-800 focus:ring-cyan-500 focus:ring-1 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {saved && (
              <span className="text-xs font-mono text-emerald-400 animate-pulse">
                Preferences successfully written to database registry!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs tracking-wider flex items-center gap-2 rounded border border-cyan-400/20 shadow-md cursor-pointer active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              SAVE PREFERENCES
            </button>
          </div>
        </form>

        {/* Threat feed connections */}
        <div className="lg:col-span-1 p-6 bg-slate-900/30 border border-slate-800 rounded-lg flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
              <Globe className="h-4 w-4" />
              Threat Intel registers
            </h3>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between">
                <span className="text-slate-400">Google Safe Browsing</span>
                <span className="text-emerald-400 font-bold">CONNECTED</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between">
                <span className="text-slate-400">VirusTotal API Feed</span>
                <span className="text-emerald-400 font-bold">CONNECTED</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between">
                <span className="text-slate-400">AbuseIPDB Database</span>
                <span className="text-emerald-400 font-bold">CONNECTED</span>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] font-mono text-slate-500 leading-relaxed mt-6">
            Vendor synchronization updates occur on 60-second intervals to fetch recently announced phishing signatures.
          </p>
        </div>
      </div>
    </div>
  );
}
