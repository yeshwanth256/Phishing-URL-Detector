/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'analyst' | 'user';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface URLFeatures {
  urlLength: number;
  domainLength: number;
  pathLength: number;
  dotsCount: number;
  hyphensCount: number;
  digitsCount: number;
  specialCharsCount: number;
  hasAtSymbol: boolean;
  hasIPAddress: boolean;
  isHttps: boolean;
  entropy: number;
  redirectCount: number;
  suspiciousKeywordsCount: number;
  hasLoginForm: boolean;
  hasHiddenElements: boolean;
}

export interface ThreatIntelData {
  virusTotalScore: number; // 0-100
  abuseIpScore: number;    // 0-100
  safeBrowsingStatus: 'safe' | 'malicious' | 'suspicious' | 'unknown';
  reputationScore: number;  // 0-100
  blacklistCount: number;
  malwareReportsCount: number;
  dnsRecordsAvailable: boolean;
  domainAgeDays: number;
  domainRegistrationLengthYears: number;
}

export interface ScanResult {
  id: string;
  url: string;
  userId?: string;
  timestamp: string;
  prediction: 'Legitimate' | 'Suspicious' | 'Phishing' | 'Malware' | 'Credential Theft' | 'Scam';
  confidence: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  securityScore: number; // 0-100 (high is safe, low is dangerous)
  features: URLFeatures;
  threatIntel: ThreatIntelData;
  explanations: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
}

export interface TrainingResult {
  timestamp: string;
  datasetSize: number;
  metrics: {
    randomForest: ModelMetrics;
    logisticRegression: ModelMetrics;
    xgboost: ModelMetrics;
  };
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  featureImportances: {
    feature: string;
    importance: number;
  }[];
}

export interface DashboardStats {
  totalScans: number;
  safeCount: number;
  suspiciousCount: number;
  phishingCount: number;
  threatTrends: {
    date: string;
    safe: number;
    suspicious: number;
    phishing: number;
  }[];
  riskDistribution: {
    name: string;
    value: number;
  }[];
  categoryBreakdown: {
    name: string;
    value: number;
  }[];
  detectionAccuracyOverTime: {
    month: string;
    accuracy: number;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  scannedUrlContext?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  role: string;
  status: 'Success' | 'Failed';
  details: string;
}
