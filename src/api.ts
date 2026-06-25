/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  AuthResponse, 
  ScanResult, 
  DashboardStats, 
  TrainingResult, 
  AuditLog 
} from './types.js';

const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  return res.json();
}

export async function registerUser(username: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Registration failed');
  }
  return res.json();
}

export async function scanSingleUrl(url: string, userId?: string): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/scan-url`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ url, userId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Scan failed');
  }
  return res.json();
}

export async function getScanHistory(): Promise<ScanResult[]> {
  const res = await fetch(`${API_BASE}/history`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to retrieve history');
  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to retrieve dashboard stats');
  return res.json();
}

export async function searchThreatIntel(query: string): Promise<any> {
  const res = await fetch(`${API_BASE}/threat-intelligence?query=${encodeURIComponent(query)}`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Threat intel lookup failed');
  }
  return res.json();
}

export async function retrainModels(datasetSize: number): Promise<TrainingResult> {
  const res = await fetch(`${API_BASE}/train-model`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ datasetSize })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Retraining failed');
  }
  return res.json();
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/audit-logs`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to retrieve audit logs');
  return res.json();
}

export async function queryAiAssistant(message: string, history: any[], urlContext?: ScanResult | null): Promise<{ text: string }> {
  const res = await fetch(`${API_BASE}/ai-assistant`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message, history, urlContext })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'AI Assistant query failed');
  }
  return res.json();
}
