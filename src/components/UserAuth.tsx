/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { loginUser, registerUser } from '../api.js';
import { User } from '../types.js';
import { 
  ShieldAlert, 
  Lock, 
  User as UserIcon, 
  Mail, 
  Key, 
  CheckCircle,
  LogIn,
  LogOut
} from 'lucide-react';

interface UserAuthProps {
  onAuthSuccess: (user: User, token: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export default function UserAuth({ onAuthSuccess, currentUser, onLogout }: UserAuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const data = await loginUser(email, password);
        onAuthSuccess(data.user, data.token);
        setSuccess('Authentication approved. Launching SOC console...');
      } else {
        if (!username) {
          setError('Username is required for register.');
          setLoading(false);
          return;
        }
        const data = await registerUser(username, email, password);
        onAuthSuccess(data.user, data.token);
        setSuccess('User successfully registered & authorized!');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="max-w-md mx-auto p-6 bg-slate-900/30 border border-slate-800 rounded-lg text-center font-mono text-xs space-y-4 shadow-md backdrop-blur-sm" id="auth-profile-box">
        <div className="w-16 h-16 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
          <UserIcon className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{currentUser.username}</h3>
          <p className="text-slate-500 text-[10px]">{currentUser.email}</p>
        </div>

        <div className="p-3 bg-slate-950/60 rounded border border-slate-850 space-y-2 text-left">
          <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
            <span className="text-slate-500 text-[10px]">AUTH ROLE</span>
            <span className="text-cyan-400 font-bold uppercase">{currentUser.role}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-[10px]">AUTHORIZED AT</span>
            <span className="text-slate-400">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 rounded font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <LogOut className="h-3.5 w-3.5" />
          TERMINATE SECURE SESSION
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900/30 border border-slate-850 rounded-lg shadow-lg backdrop-blur-sm" id="auth-gateway-box">
      <div className="text-center space-y-1 mb-6 border-b border-slate-850 pb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 mb-2">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest">
          {mode === 'login' ? 'SOC OPERATOR INGRESS' : 'REGISTER ANALYST'}
        </h2>
        <p className="text-[10px] font-mono text-slate-500">
          Argon2 Password Verified • JWT Authentication
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        {mode === 'register' && (
          <div className="space-y-1">
            <label className="text-[10px] text-slate-550 uppercase">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-650">
                <UserIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                id="auth-username"
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-cyan-500 placeholder-slate-700"
                placeholder="e.g. cyber_operator"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] text-slate-550 uppercase">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-650">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              id="auth-email"
              required
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-cyan-500 placeholder-slate-700"
              placeholder="e.g. operator@phishingdefense.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-550 uppercase">Secured Key / Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-650">
              <Key className="h-4 w-4" />
            </span>
            <input
              type="password"
              id="auth-password"
              required
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-cyan-500 placeholder-slate-700"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          id="auth-submit-btn"
          disabled={loading}
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold tracking-wider flex items-center justify-center gap-2 rounded transition-all cursor-pointer shadow-md active:scale-[0.98]"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              AUTHORIZING...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              {mode === 'login' ? 'INSTRUCT INGRESS' : 'REGISTER PROFILE'}
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
            setSuccess(null);
          }}
          className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
        >
          {mode === 'login' ? 'Request analyst credentials entry register' : 'Return to secure portal entry'}
        </button>
      </div>
    </div>
  );
}

// Minimal loading placeholder helper icon
function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.72 2.78L21 8" />
      <polyline points="21 3 21 8 16 8" />
    </svg>
  );
}
