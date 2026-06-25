/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api.js';
import { DashboardStats } from '../types.js';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Grid, 
  TrendingUp, 
  ShieldAlert 
} from 'lucide-react';

export default function ThreatIntelDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error('Failed to load dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-cyan-400">LOADING METRIC ANALYTICS...</p>
      </div>
    );
  }

  if (!stats) return null;

  // Colors mapping for Pie segments
  const COLORS = {
    'Low Risk': '#10b981',      // Emerald green
    'Medium Risk': '#f59e0b',   // Amber yellow
    'High/Critical Risk': '#f43f5e' // Rose red
  };

  const getPercentage = (count: number) => {
    if (!stats.totalScans) return '0%';
    return `${Math.round((count / stats.totalScans) * 100)}%`;
  };

  return (
    <div className="space-y-6" id="dashboard-module">
      {/* KPI Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total scans */}
        <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-lg flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">Total Scanned URLs</span>
            <span className="text-2xl font-mono font-bold text-white block mt-1">{stats.totalScans}</span>
            <span className="text-[10px] text-slate-500 font-mono">Telemetry database depth</span>
          </div>
          <Activity className="h-8 w-8 text-cyan-400/20" />
        </div>

        {/* Safe URLs */}
        <div className="p-5 bg-slate-900/30 border border-emerald-500/20 rounded-lg flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest">Legitimate / Safe</span>
            <span className="text-2xl font-mono font-bold text-emerald-400 block mt-1">{stats.safeCount}</span>
            <span className="text-[10px] text-emerald-500/50 font-mono">Ratio: {getPercentage(stats.safeCount)}</span>
          </div>
          <ShieldCheck className="h-8 w-8 text-emerald-500/20" />
        </div>

        {/* Suspicious URLs */}
        <div className="p-5 bg-slate-900/30 border border-amber-500/20 rounded-lg flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[10px] font-mono text-amber-500/80 uppercase tracking-widest">Suspicious Activity</span>
            <span className="text-2xl font-mono font-bold text-amber-400 block mt-1">{stats.suspiciousCount}</span>
            <span className="text-[10px] text-amber-500/50 font-mono">Ratio: {getPercentage(stats.suspiciousCount)}</span>
          </div>
          <AlertTriangle className="h-8 w-8 text-amber-500/20" />
        </div>

        {/* Phishing / Threats */}
        <div className="p-5 bg-slate-900/30 border border-rose-500/20 rounded-lg flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[10px] font-mono text-rose-500/80 uppercase tracking-widest">Malicious / Phishing</span>
            <span className="text-2xl font-mono font-bold text-rose-400 block mt-1">{stats.phishingCount}</span>
            <span className="text-[10px] text-rose-500/50 font-mono">Ratio: {getPercentage(stats.phishingCount)}</span>
          </div>
          <ShieldAlert className="h-8 w-8 text-rose-500/20" />
        </div>
      </div>

      {/* Primary Graphs section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Trends timelines */}
        <div className="lg:col-span-2 p-6 bg-slate-900/30 border border-slate-800 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Phishing Detection Timeline
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Live feed tracking</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.threatTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#fff' }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="safe" name="Safe URLs" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSafe)" />
                <Area type="monotone" dataKey="suspicious" name="Suspicious" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSuspicious)" />
                <Area type="monotone" dataKey="phishing" name="Phishing / Malicious" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#colorPhishing)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="lg:col-span-1 p-6 bg-slate-900/30 border border-slate-800 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Risk Index Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Heuristic breakdown</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#475569'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Embedded details label */}
            <div className="absolute text-center">
              <span className="block text-2xl font-mono font-bold text-white">{stats.totalScans}</span>
              <span className="block text-[8px] font-mono text-slate-500 uppercase">Total Items</span>
            </div>
          </div>

          {/* Color legend metrics */}
          <div className="space-y-2 mt-4">
            {stats.riskDistribution.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }} />
                  <span className="text-slate-400">{entry.name}</span>
                </div>
                <span className="text-slate-200 font-semibold">{entry.value} ({getPercentage(entry.value)})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary metrics section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Category Breakdown Bar Chart */}
        <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Attack Classification Vectors
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Threat signatures</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryBreakdown} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="value" name="Flagged Scans" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                  {stats.categoryBreakdown.map((entry, index) => {
                    const vectorColors: Record<string, string> = {
                      'Legitimate': '#10b981',
                      'Suspicious': '#f59e0b',
                      'Phishing': '#f43f5e',
                      'Malware': '#8b5cf6',
                      'Credential Theft': '#3b82f6',
                      'Scam': '#ec4899'
                    };
                    return <Cell key={`cell-${index}`} fill={vectorColors[entry.name] || '#38bdf8'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System classification Accuracy tracker */}
        <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h3 className="text-sm font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Model Classification Accuracy (H1 2026)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">ML Performance</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.detectionAccuracyOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <YAxis domain={[95, 100]} stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="accuracy" name="Classification Accuracy %" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorAccuracy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
