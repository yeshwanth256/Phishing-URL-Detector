# AI-Powered Phishing URL Detector

A comprehensive, full-stack cybersecurity application designed to detect, analyze, and mitigate malicious URLs, phishing threats, and social engineering attempts. The platform combines real-time heuristic scanning, external domain/IP intelligence, and advanced machine learning classifiers with AI-driven threat reasoning.

## Key Features

- **Real-Time URL Threat Scanner**: Instantly parses target URLs for over a dozen suspicious heuristic markers, domain registry details, IP routing, and active SSL certification status.
- **Machine Learning Analysis**: Compares threat scores from multiple local model configurations (XGBoost, Random Forest, Support Vector Machines).
- **Interactive Threat Intelligence Dashboard**: Dynamic graphs and charts powered by Recharts illustrating real-time scanning volume, threat distribution by category, and regional risk indices.
- **AI Security Assistant**: Integrated chat interface powered by Gemini to parse raw emails, inspect header metadata, and review suspicious system event logs.
- **IP & Domain Reputation Center**: Direct query utility for reverse DNS verification, hosting providers, and geolocation mapping.
- **Admin Control & Model Retraining**: Secure administrator console to view live audit trails, inspect operator sessions, and configure dataset weights for classifier retraining.
- **Comprehensive PDF Reports**: Generates detailed, professional security summaries with actionable mitigation recommendations ready to share.

## Technologies Used

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion, Recharts, Lucide Icons
- **Backend**: Node.js, Express, TSX Runtime
- **Security & AI Engine**: Google Gemini API via `@google/genai`

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install the project dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables. Create a `.env` file in the root directory and define your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running the Application

To start the development server running on the required local port:
```bash
npm run dev
```

To compile and bundle the application for production:
```bash
npm run build
npm start
```
