/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { retrainModels, getAuditLogs, loginUser } from '../api.js';
import { TrainingResult, AuditLog, User } from '../types.js';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  Cpu, 
  Play, 
  RefreshCw, 
  Table, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  Sliders,
  Lock,
  Key
} from 'lucide-react';

interface AdminPanelProps {
  currentUser?: User | null;
  onAuthSuccess?: (user: User, token: string) => void;
}

export default function AdminPanel({ currentUser, onAuthSuccess }: AdminPanelProps) {
  const [trainingHistory, setTrainingHistory] = useState<TrainingResult[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [trainingSize, setTrainingSize] = useState('50000');
  const [retraining, setRetraining] = useState(false);
  const [activeModel, setActiveModel] = useState('XGBoost (Active Classifier)');
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);
  const [quickLoginError, setQuickLoginError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!currentUser || currentUser.role !== 'admin') {
      setLoadingLogs(false);
      return;
    }
    try {
      // In our server DB state, training history is inside the root, let's load it from dashboard stats or mock,
      // Or simply populate standard history. Let's load the audit logs and initial training results.
      const logs = await getAuditLogs();
      setAuditLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchHistory();
    } else {
      setLoadingLogs(false);
    }
    
    // Seed some initial training curves
    const seedTraining: TrainingResult = {
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      datasetSize: 45000,
      metrics: {
        randomForest: { accuracy: 0.968, precision: 0.971, recall: 0.964, f1Score: 0.967, rocAuc: 0.985 },
        xgboost: { accuracy: 0.981, precision: 0.983, recall: 0.979, f1Score: 0.981, rocAuc: 0.993 },
        logisticRegression: { accuracy: 0.924, precision: 0.918, recall: 0.931, f1Score: 0.924, rocAuc: 0.958 }
      },
      confusionMatrix: { truePositive: 21852, falsePositive: 388, trueNegative: 22254, falseNegative: 506 },
      featureImportances: [
        { feature: 'HTTPS Encryption Usage', importance: 0.28 },
        { feature: 'Domain Reputation Match', importance: 0.22 },
        { feature: 'Url Obfuscation Character (@)', importance: 0.15 },
        { feature: 'URL Length Penalty', importance: 0.12 },
        { feature: 'Shannon Entropy Level', importance: 0.09 },
        { feature: 'Suspicious Semantic Keywords', importance: 0.08 },
        { feature: 'Subdomain / Dots Depth', importance: 0.06 }
      ]
    };
    setTrainingHistory([seedTraining]);
    setLoadingHistory(false);
  }, [currentUser]);

  const handleQuickAdminLogin = async () => {
    setQuickLoginLoading(true);
    setQuickLoginError(null);
    try {
      const res = await loginUser('admin@phishingdefense.ai', 'AdminSecure2026!');
      if (onAuthSuccess) {
        onAuthSuccess(res.user, res.token);
      }
    } catch (err: any) {
      setQuickLoginError(err.message || 'Quick login failed');
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const result = await retrainModels(parseInt(trainingSize) || 50000);
      setTrainingHistory(prev => [result, ...prev]);
      
      // Update local active classifier label
      const active = result.metrics.xgboost.accuracy > result.metrics.randomForest.accuracy ? 'XGBoost (Active Classifier)' : 'Random Forest (Active Classifier)';
      setActiveModel(active);
      
      // Reload Audit Logs
      await fetchHistory();
    } catch (e) {
      console.error(e);
    } finally {
      setRetraining(false);
    }
  };

  const activeResult = trainingHistory[0];

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-12" id="admin-auth-guard">
        <div className="border border-rose-500/30 bg-slate-900/60 p-8 rounded-lg backdrop-blur-sm text-center space-y-6 shadow-xl elegant-glow-threat">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30 mx-auto">
            <Lock className="h-8 w-8 text-rose-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-display font-bold tracking-tight text-white">
              ADMINISTRATIVE PRIVILEGES REQUIRED
            </h2>
            <p className="text-slate-400 text-xs font-mono leading-relaxed">
              ACCESS LEVEL: SECURE SANDBOX LEVEL 4 (CLASSIFIER DEPLOYMENT)
            </p>
            <p className="text-slate-400 text-xs">
              Only authenticated administrators are authorized to retrain ML models and inspect full audit logs.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-850 p-4 rounded text-left space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-850 pb-2 text-slate-550">
              <span>SANDBOX OPERATOR CREDENTIALS</span>
              <span className="text-emerald-400">ACTIVE SEED</span>
            </div>
            <div className="text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-550">Username / Email:</span>
                <span className="text-cyan-400 select-all font-semibold">admin@phishingdefense.ai</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-550">Password:</span>
                <span className="text-cyan-400 select-all font-semibold">AdminSecure2026!</span>
              </div>
            </div>
          </div>

          {quickLoginError && (
            <p className="text-xs text-rose-400 font-mono bg-rose-950/20 border border-rose-950 px-3 py-1.5 rounded">
              {quickLoginError}
            </p>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleQuickAdminLogin}
              disabled={quickLoginLoading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] transition-all"
            >
              {quickLoginLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  ELEVATING SESSION...
                </>
              ) : (
                <>
                  <Key className="h-3.5 w-3.5" />
                  QUICK AUTHENTICATE AS ADMIN
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-500 font-mono">
              Note: This bypasses authentication for rapid feature validation within the Sandbox.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="admin-module">
      <div className="border border-cyan-500/20 bg-slate-900/40 p-6 rounded-lg backdrop-blur-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-sans tracking-tight text-white font-medium flex items-center gap-2">
            <Sliders className="h-5 w-5 text-cyan-400" />
            Cyber Threat Classification Retraining Panel
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Specify dataset volume sizes and trigger training updates on Scikit-Learn based Random Forest, Logistic Regression, and XGBoost networks.
          </p>
        </div>
        <div className="hidden md:block bg-cyan-950/30 border border-cyan-500/20 rounded px-4 py-2 font-mono text-xs text-right">
          <span className="text-slate-500 block text-[10px]">CURRENT CLASSIFIER MODE</span>
          <span className="text-cyan-400 font-bold">{activeModel}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retraining Form Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 bg-slate-900/30 border border-slate-850 rounded-lg">
            <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">
              Model Control Console
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Training Dataset Size</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                  value={trainingSize}
                  onChange={(e) => setTrainingSize(e.target.value)}
                  disabled={retraining}
                >
                  <option value="10000">10,000 annotated URLs</option>
                  <option value="25000">25,000 annotated URLs</option>
                  <option value="50000">50,000 annotated URLs (standard)</option>
                  <option value="100000">100,000 annotated URLs (full)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Target Classifier Weights</label>
                <div className="space-y-2 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>XGBoost</span>
                    <span className="text-cyan-400 font-bold">Standard Gradient Boost</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Random Forest</span>
                    <span className="text-slate-500">Heuristics Entropy Tree</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Logistic Regression</span>
                    <span className="text-slate-500">L2 Ridge Regulator</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRetrain}
                disabled={retraining}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
              >
                {retraining ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    RETRAINING NETWORKS...
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    TRAIN NEW CLASSIFIERS
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Training metrics overview */}
        <div className="lg:col-span-2 space-y-6">
          {activeResult && (
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg animate-fadeIn space-y-6">
              {/* Comparative evaluation Table */}
              <div>
                <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
                  ML Model Benchmark Comparison
                </h3>
                <div className="overflow-x-auto border border-slate-850 rounded">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 text-slate-500 text-[11px]">
                        <th className="py-2 px-3">CLASSIFIER MODEL</th>
                        <th className="py-2 px-3">ACCURACY</th>
                        <th className="py-2 px-3">PRECISION</th>
                        <th className="py-2 px-3">RECALL</th>
                        <th className="py-2 px-3">F1-SCORE</th>
                        <th className="py-2 px-3">ROC-AUC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40 text-slate-300 text-[11px]">
                      <tr className="bg-cyan-500/5 font-semibold text-cyan-400">
                        <td className="py-2.5 px-3">XGBoost Net</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.xgboost.accuracy * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.xgboost.precision * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.xgboost.recall * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.xgboost.f1Score * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.xgboost.rocAuc * 100).toFixed(3)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3">Random Forest</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.randomForest.accuracy * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.randomForest.precision * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.randomForest.recall * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.randomForest.f1Score * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.randomForest.rocAuc * 100).toFixed(3)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3">Logistic Regression</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.logisticRegression.accuracy * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.logisticRegression.precision * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.logisticRegression.recall * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.logisticRegression.f1Score * 100).toFixed(2)}%</td>
                        <td className="py-2.5 px-3">{(activeResult.metrics.logisticRegression.rocAuc * 100).toFixed(3)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Horizontal Recharts bar chart showing Feature importance */}
                <div>
                  <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
                    Active Feature Importance (XGBoost)
                  </h3>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={activeResult.featureImportances} 
                        layout="vertical"
                        margin={{ top: 0, right: 10, left: 30, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis type="number" stroke="#64748b" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                        <YAxis type="category" dataKey="feature" stroke="#64748b" style={{ fontSize: '8px', fontFamily: 'monospace' }} width={80} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#fff' }}
                        />
                        <Bar dataKey="importance" name="Weight Importance" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Confusion Matrix visualizer */}
                <div>
                  <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
                    Confusion Matrix Grid ({activeResult.datasetSize.toLocaleString()} samples)
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] text-center text-slate-300">
                    {/* Empty cell */}
                    <div />
                    <div className="p-1.5 bg-slate-950 font-semibold border border-slate-850">ACTUAL SAFE</div>
                    <div className="p-1.5 bg-slate-950 font-semibold border border-slate-850">ACTUAL PHISH</div>

                    <div className="p-1.5 bg-slate-950 font-semibold flex items-center justify-center border border-slate-850">PREDICT SAFE</div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20">
                      <span className="block text-xs font-bold text-emerald-400">{activeResult.confusionMatrix.trueNegative.toLocaleString()}</span>
                      <span className="text-[8px] text-slate-500">True Neg (TN)</span>
                    </div>
                    <div className="p-3 bg-rose-500/5 border border-rose-500/15">
                      <span className="block text-xs font-bold text-rose-400">{activeResult.confusionMatrix.falseNegative.toLocaleString()}</span>
                      <span className="text-[8px] text-slate-500">False Neg (FN)</span>
                    </div>

                    <div className="p-1.5 bg-slate-950 font-semibold flex items-center justify-center border border-slate-850">PREDICT PHISH</div>
                    <div className="p-3 bg-rose-500/5 border border-rose-500/15">
                      <span className="block text-xs font-bold text-rose-400">{activeResult.confusionMatrix.falsePositive.toLocaleString()}</span>
                      <span className="text-[8px] text-slate-500">False Pos (FP)</span>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20">
                      <span className="block text-xs font-bold text-emerald-400">{activeResult.confusionMatrix.truePositive.toLocaleString()}</span>
                      <span className="text-[8px] text-slate-500">True Pos (TP)</span>
                    </div>
                  </div>
                  
                  <p className="text-[9px] font-mono text-slate-500 mt-3 leading-relaxed">
                    Sensitivity rate describes the percentage of actual phishing attacks correctly caught. False negative represents attacks that evaded classification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs History list */}
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-lg">
            <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
              <Clock className="h-4 w-4" />
              Administrative Incident & Audit Logs
            </h3>

            {loadingLogs ? (
              <div className="text-center py-5">
                <RefreshCw className="h-5 w-5 animate-spin mx-auto text-cyan-400" />
              </div>
            ) : (
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-slate-950/60 border border-slate-850 rounded flex flex-col md:flex-row md:items-center justify-between text-[11px] font-mono gap-1.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-semibold">{log.action.toUpperCase()}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                          {log.user} ({log.role})
                        </span>
                      </div>
                      <p className="text-slate-400 font-sans text-xs">{log.details}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`font-semibold ${log.status === 'Success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {log.status.toUpperCase()}
                      </span>
                      <span className="block text-[10px] text-slate-600">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
