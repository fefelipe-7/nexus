# Nexus - Your Personal Command Center

Nexus is a comprehensive personal life management system designed to be the central core of your digital life. It organizes, contextualizes, and interprets your personal data across multiple life domains.

## Features

- **Multi-Domain Tracking**: Personal state, actions, events, goals, routines, knowledge, and reflections
- **Offline-First**: Full functionality without internet connection
- **AI-Assisted Insights**: Pattern detection, correlations, and contextual summaries
- **Privacy-Focused**: Local-first data storage with user control
- **Beautiful UI**: Calm, neutral interface with progressive depth
- **Cross-Platform**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Local Storage**: Dexie (IndexedDB wrapper)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Architecture

Nexus follows a local-first architecture with:
- Client-side data persistence using IndexedDB
- Modular domain structure
- AI interpretation layer for insights
- Eventual consistency synchronization model

## Philosophy

Nexus is designed to:
- Reduce cognitive load and fragmentation
- Provide temporal continuity across your life
- Amplify awareness and clarity
- Adapt to your preferred level of engagement
- Maintain privacy by design

## License

Private - All rights reserved
