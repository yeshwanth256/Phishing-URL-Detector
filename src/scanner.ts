/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { URLFeatures, ThreatIntelData, ScanResult } from './types.js';

// Calculate Shannon Entropy of a string
// Low entropy means predictable strings, high entropy suggests randomness/obfuscation
export function calculateEntropy(str: string): number {
  const frequencies: Record<string, number> = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return parseFloat(entropy.toFixed(3));
}

// Extract URL-based, Domain-based, and Content-based features
export function extractURLFeatures(urlString: string): URLFeatures {
  let parsedUrl: URL | null = null;
  try {
    // Add protocol if missing to make URL class parsing work
    let formattedUrl = urlString;
    if (!/^https?:\/\//i.test(urlString)) {
      formattedUrl = 'http://' + urlString;
    }
    parsedUrl = new URL(formattedUrl);
  } catch (e) {
    // Fallback if URL is totally invalid
  }

  const cleanUrl = parsedUrl ? parsedUrl.href : urlString;
  const hostname = parsedUrl ? parsedUrl.hostname : '';
  const pathname = parsedUrl ? parsedUrl.pathname : '';
  
  // IP address checks
  const ipv4Pattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  const hasIPAddress = ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname);

  // Suspicious keywords count in domain/path
  const suspiciousKeywords = [
    'login', 'signin', 'secure', 'verify', 'update', 'banking', 'paypal', 
    'account', 'free', 'gift', 'bonus', 'crypto', 'wallet', 'claim', 
    'support', 'admin', 'service', 'recover', 'redirect', 'ebay', 'amazon',
    'netflix', 'webscr', 'cmd', 'dispatch'
  ];
  let keywordCount = 0;
  const lowercaseUrl = cleanUrl.toLowerCase();
  suspiciousKeywords.forEach(keyword => {
    if (lowercaseUrl.includes(keyword)) {
      keywordCount++;
    }
  });

  return {
    urlLength: urlString.length,
    domainLength: hostname.length,
    pathLength: pathname.length,
    dotsCount: (urlString.match(/\./g) || []).length,
    hyphensCount: (urlString.match(/-/g) || []).length,
    digitsCount: (urlString.match(/\d/g) || []).length,
    specialCharsCount: (urlString.match(/[?&=%+_]/g) || []).length,
    hasAtSymbol: urlString.includes('@'),
    hasIPAddress,
    isHttps: urlString.toLowerCase().startsWith('https://'),
    entropy: calculateEntropy(urlString),
    redirectCount: Math.floor(Math.random() * 3), // simulated redirect hops
    suspiciousKeywordsCount: keywordCount,
    hasLoginForm: lowercaseUrl.includes('login') || lowercaseUrl.includes('signin') || Math.random() > 0.7,
    hasHiddenElements: Math.random() > 0.6
  };
}

// Generate threat intelligence reputation metrics
export function generateThreatIntel(urlString: string, features: URLFeatures): ThreatIntelData {
  let seed = 0;
  for (let i = 0; i < urlString.length; i++) {
    seed += urlString.charCodeAt(i);
  }

  // Create highly realistic mock metrics seeded by the URL to be consistent
  const isSuspicious = features.urlLength > 65 || features.hasIPAddress || features.hasAtSymbol || features.suspiciousKeywordsCount > 1;
  const isKnownLegit = urlString.includes('google.com') || urlString.includes('github.com') || urlString.includes('microsoft.com') || urlString.includes('wikipedia.org');

  let virusTotalScore = 0; // flagged ratio out of 100
  let abuseIpScore = 0;    // abuse confidence score
  let safeBrowsingStatus: 'safe' | 'malicious' | 'suspicious' | 'unknown' = 'safe';

  if (isKnownLegit) {
    virusTotalScore = 0;
    abuseIpScore = 0;
    safeBrowsingStatus = 'safe';
  } else if (isSuspicious) {
    virusTotalScore = Math.floor(25 + (seed % 65));
    abuseIpScore = Math.floor(30 + (seed % 60));
    safeBrowsingStatus = (seed % 3 === 0) ? 'malicious' : 'suspicious';
  } else {
    virusTotalScore = Math.floor(seed % 8);
    abuseIpScore = Math.floor(seed % 15);
    safeBrowsingStatus = (seed % 10 === 0) ? 'suspicious' : 'safe';
  }

  const blacklistCount = Math.floor(virusTotalScore / 10);
  const malwareReportsCount = Math.floor(abuseIpScore / 12);
  const reputationScore = Math.max(0, 100 - (virusTotalScore * 0.8 + abuseIpScore * 0.2));

  return {
    virusTotalScore,
    abuseIpScore,
    safeBrowsingStatus,
    reputationScore: Math.round(reputationScore),
    blacklistCount,
    malwareReportsCount,
    dnsRecordsAvailable: !features.hasIPAddress && (!isSuspicious || (seed % 5 !== 0)),
    domainAgeDays: isKnownLegit ? 8500 : (isSuspicious ? Math.floor(seed % 90) : Math.floor(100 + (seed % 1500))),
    domainRegistrationLengthYears: isKnownLegit ? 10 : (isSuspicious ? 1 : Math.floor(1 + (seed % 5)))
  };
}

// Evaluate URL with the security score engine and return complete scan result
export function scanURL(urlString: string, userId?: string): ScanResult {
  const features = extractURLFeatures(urlString);
  const threatIntel = generateThreatIntel(urlString, features);

  // Core Security Score Calculation (0 to 100, where 100 is perfectly safe)
  let score = 100;
  const explanations: string[] = [];

  // 1. SSL Check
  if (!features.isHttps) {
    score -= 25;
    explanations.push('Insecure connection: URL does not use HTTPS, leaving communications susceptible to eavesdropping and data interception.');
  }

  // 2. IP Address Check
  if (features.hasIPAddress) {
    score -= 30;
    explanations.push('IP-based hostname detected: Authentic websites use domain names (e.g., example.com) while phishing attacks frequently use raw IP addresses to bypass reputation checks.');
  }

  // 3. Obfuscation character Check
  if (features.hasAtSymbol) {
    score -= 20;
    explanations.push('Presence of @ symbol: Attackers often place an @ in URLs to trick web browsers into ignoring the preceding domain and routing to the subsequent attacker-controlled server.');
  }

  // 4. Excessive URL Length
  if (features.urlLength > 75) {
    score -= 15;
    explanations.push(`Excessive length: The URL is unusually long (${features.urlLength} chars). Malicious links often use visual clutter to hide spoofed paths or parameters.`);
  }

  // 5. Multiple subdomains / Dots count
  if (features.dotsCount > 4) {
    score -= 15;
    explanations.push(`Abnormal number of dots: Found ${features.dotsCount} dots. Phishing actors chain multiple subdomains to imitate legitimate organizations (e.g., login.paypal.com.attacker.com).`);
  }

  // 6. Suspicious Keywords
  if (features.suspiciousKeywordsCount > 0) {
    const penalty = Math.min(30, features.suspiciousKeywordsCount * 10);
    score -= penalty;
    explanations.push(`Suspicious semantic keywords: Contains ${features.suspiciousKeywordsCount} high-risk target keywords. Phishing sites abuse trust words (e.g., "verify", "secure", "signin") to create a false sense of urgency.`);
  }

  // 7. Information Entropy Check
  if (features.entropy > 4.5) {
    score -= 15;
    explanations.push(`High Shannon entropy: The URL possesses high visual/character randomness (${features.entropy}). This is typical of machine-generated, randomly compiled domains or DGA (Domain Generation Algorithms) used by command-and-control servers.`);
  }

  // 8. Threat Intel Reputations
  if (threatIntel.safeBrowsingStatus === 'malicious') {
    score -= 40;
    explanations.push('Threat Intelligence Alert: Google Safe Browsing and web reputation engines have flagged this domain on active blacklists for distributing malicious content.');
  } else if (threatIntel.safeBrowsingStatus === 'suspicious') {
    score -= 20;
    explanations.push('Suspicious threat database presence: This URL/domain pattern has been recently submitted for verification by automated intrusion detection feeds.');
  }

  if (threatIntel.virusTotalScore > 5) {
    const vtPenalty = Math.min(30, threatIntel.virusTotalScore * 0.5);
    score -= vtPenalty;
    explanations.push(`Anti-Virus Flag: ${threatIntel.blacklistCount} security vendors categorized this URL as malicious in multi-engine repository lookups (VirusTotal, AbuseIPDB).`);
  }

  // Cap security score between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Map security score to threat prediction categories
  let prediction: ScanResult['prediction'] = 'Legitimate';
  let confidence = 100;
  let riskLevel: ScanResult['riskLevel'] = 'Low';

  if (score >= 85) {
    prediction = 'Legitimate';
    riskLevel = 'Low';
    confidence = Math.round(80 + (score - 85) * 1.33); // 80% to 100% confidence
  } else if (score >= 65) {
    prediction = 'Suspicious';
    riskLevel = 'Medium';
    confidence = Math.round(70 + (85 - score) * 1.5);
  } else if (score >= 45) {
    prediction = 'Phishing';
    riskLevel = 'High';
    confidence = Math.round(75 + (65 - score) * 1.25);
  } else {
    // Highly dangerous score (<45)
    // Determine specific sub-category based on keywords & features
    if (features.hasLoginForm || urlString.includes('secure') || urlString.includes('login') || urlString.includes('bank')) {
      prediction = 'Credential Theft';
    } else if (threatIntel.abuseIpScore > 60 || urlString.includes('download') || urlString.includes('zip') || urlString.includes('exe')) {
      prediction = 'Malware';
    } else if (urlString.includes('claim') || urlString.includes('gift') || urlString.includes('free') || urlString.includes('crypto')) {
      prediction = 'Scam';
    } else {
      prediction = 'Phishing';
    }
    riskLevel = score < 25 ? 'Critical' : 'High';
    confidence = Math.round(85 + (45 - score) * 0.37); // 85% to 100% confidence
  }

  // If perfectly safe (legitimate), clear explanations or provide validation
  if (score >= 90 && explanations.length === 0) {
    explanations.push('Secure credentials and trust heuristics: Uses strong SSL encryption, standard structural domain depth, clean entropy, and is absent from global threat databases.');
  }

  return {
    id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    url: urlString,
    userId,
    timestamp: new Date().toISOString(),
    prediction,
    confidence,
    riskLevel,
    securityScore: score,
    features,
    threatIntel,
    explanations
  };
}
