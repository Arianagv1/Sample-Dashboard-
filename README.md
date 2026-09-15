# AI-Driven Path to Conversion (P2C) Insights

Transform raw Google Campaign Manager 360 (CM360) Path to Conversion (P2C) touchpoint data into multi-touch attribution analytics, sequence friction diagnostics, budget reallocation strategies, and CMO-ready executive presentation decks.

---

## 📊 Dashboard Insights Overview

The dashboard bridges the gap between raw programmatic logs and strategic media decision-making:

- **Multi-Touch Attribution Modeling**: Real-time comparative valuation across five attribution models:
  - **First Touch**: Highlights discovery channels initiating customer consideration.
  - **Last Touch**: Evaluates traditional closing credit and identifies search cannibalization.
  - **Linear**: Distributes equal credit across every path touchpoint.
  - **Time-Decay**: Exponentially weights interactions closer to conversion.
  - **Position-Based (U-Shaped)**: Allocates 40% to discovery, 40% to closing, and 20% across mid-funnel nurture touchpoints.
- **Sequence Friction Diagnostics**: Identifies systemic leaks in conversion paths:
  - **Dormancy Gaps**: Pinpoints 20–45+ day silence windows between upper-funnel video impressions and retargeting display.
  - **Creative Fatigue**: Detects excessive repeat impressions without engagement before branded search.
  - **Sales Velocity Lag**: Measures day-zero vs. 90-day consideration latency per conversion type.
- **Cross-Channel Synergies**: Discovers co-occurrence patterns (e.g., Connected TV impressions priming brand awareness and elevating downstream Paid Search conversion rates by up to 340%).
- **AI Executive Synthesis & Deck Generation**: Uses Gemini models to translate complex sequence graphs into actionable executive takeaways, optimal budget delta percentages, and a 5-slide presentation deck exportable directly to **Google Slides**.
- **Data Ingestion & Ground Truth Testing**: Pre-loaded with validated CM360 Floodlight conversion sequences, supporting CSV upload, touchpoint filtering, and Cloud Firestore synchronization.

---

## 🛠️ Toolstack & Architecture

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Tailwind CSS, Lucide Icons | Responsive single-page interface with tabbed views, KPI cards, and path sequence visualizers. |
| **Backend Server** | Node.js, Express, TSX, esbuild | Full-stack server managing secure API routes, Vite middleware, and Google Workspace integrations. |
| **AI Reasoning** | Google Gen AI SDK (`@google/genai`), Gemini 3.8 Flash | Multi-step sequence reasoning engine with built-in heuristic fallback when offline or unconfigured. |
| **Database & Sync** | Google Cloud Firestore (Firebase SDK v12) | Cloud persistence for CM360 touchpoints (`cm360_p2c_touchpoints`) and connection health checks. |
| **Workspace Export** | Google Slides API, Google Drive API, Google Identity Services | Interactive slide preview, tokenized OAuth2 authorization, and direct cloud slide deck generation. |
| **Build & Dev** | Vite, PostCSS, `@tailwindcss/vite` | Optimized development and production bundle pipelines. |

---

## 🚀 Quick Start Guide

Follow these steps to run the application locally on your machine after copying the GitHub repository link:

### 1. Clone the Repository
Open your terminal and clone the repository:
```bash
git clone <PASTE_YOUR_GITHUB_REPO_URL>
cd <REPO_FOLDER_NAME>
```

### 2. Install Dependencies
Ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed, then install project dependencies:
```bash
npm install
```

### 3. Add Vite's ambient type declarations
This project imports CSS and other static assets directly in TypeScript files (e.g. `import './index.css'` in `src/main.tsx`). TypeScript doesn't know how to type-check these imports on its own — it needs Vite's client type declarations.

Check whether `src/vite-env.d.ts` already exists. If it doesn't, create it with the following single line:
```typescript
/// <reference types="vite/client" />
```

> **Note:** This file should really live in source control so it's present for everyone who clones the repo. If it's missing after cloning, it means it wasn't committed — consider adding `src/vite-env.d.ts` to the repository itself so this manual step isn't needed in the future.

If VS Code still shows a "Cannot find module" or "Could not find a declaration file" error after adding the file, restart the TypeScript server: Command Palette (Cmd/Ctrl+Shift+P) → **"TypeScript: Restart TS Server"**.

### 4. Configure Environment Variables (Optional)
Copy the example environment configuration:
```bash
cp .env.example .env
```
Open `.env` in your text editor and add your Gemini API key for live AI reasoning:
```env
GEMINI_API_KEY="your_api_key_here"
```
*(Note: If no API key is provided, the dashboard automatically runs in analytical fallback mode using the built-in deterministic attribution engine.)*

### 5. Start the Application

#### Development Mode (with hot-reload and Express API proxy):
```bash
npm run dev
```

#### Production Mode:
```bash
npm run build
npm start
```

### 6. Access the Web Application
Open your web browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Key Project Structure

```
├── server.ts                     # Express server, API proxy, Vite middleware & Gemini endpoints
├── firebase-applet-config.json   # Cloud Firestore project & database configuration
├── firestore.rules               # Cloud Firestore security rules
├── src/
│   ├── main.tsx                  # React DOM entry point
│   ├── vite-env.d.ts             # Vite client type declarations (asset imports, import.meta.env)
│   ├── App.tsx                   # Main dashboard application shell & state orchestration
│   ├── types.ts                  # Shared TypeScript interfaces & models
│   ├── components/
│   │   ├── Header.tsx            # Navigation header, dataset switcher, and status pills
│   │   ├── MetricOverview.tsx    # High-level conversion volume, revenue, and latency metrics
│   │   ├── AttributionCompare.tsx# Attribution model comparative charts and channel value shifts
│   │   ├── SequenceExplorer.tsx  # Interactive step-by-step touchpoint journey viewer
│   │   ├── FrictionDiagnostics.tsx# Bottleneck analysis, dormancy detection, and channel synergies
│   │   ├── GeminiInsights.tsx    # AI synthesis and 5-slide Google Slides export modal
│   │   ├── DataIngestionModal.tsx# CSV upload, manual touchpoint editor, and Firestore sync controls
│   │   └── GoogleSlidesAuthModal.tsx # Google Workspace OAuth connection modal
│   ├── services/
│   │   ├── firebase.ts           # Firebase SDK initialization & error handling
│   │   ├── firestoreClient.ts    # Touchpoint persistence & Firestore CRUD operations
│   │   └── googleSlides.ts       # Google Slides API payload creation & presentation builder
│   └── data/
│       └── groundTruthP2C.ts     # Pre-loaded baseline CM360 conversion journeys
└── vite.config.ts                # Vite build and server configuration
```

---

## 🩹 Troubleshooting

- **"Could not find a declaration file for module 'react'"**: Install React's type definitions as a dev dependency: `npm install --save-dev @types/react @types/react-dom`.
- **"Cannot find module or type declarations for side effect import of './index.css'"**: Ensure `src/vite-env.d.ts` exists and contains `/// <reference types="vite/client" />` (see Step 3 above), then restart the TS Server in VS Code.
- **Mixed lockfiles**: If both `bun.lock` and `package-lock.json` are present, they may indicate the project was installed with two different package managers at different times. Pick one, delete the other lockfile and `node_modules`, then reinstall cleanly.

---

## 🔒 Security & OAuth

- **API Keys**: All Gemini API requests are proxied securely through backend endpoints in `server.ts`; keys are never exposed to browser bundles.
- **Google OAuth**: Uses client-side token authorization via Google Identity Services (`initTokenClient`) scoped strictly to Google Slides and Drive presentation creation.
