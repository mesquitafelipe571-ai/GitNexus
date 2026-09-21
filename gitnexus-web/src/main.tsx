import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';
import { speedInsightsBeforeSend } from './lib/speed-insights';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    {/* Vite SPA → `/react` entry (not `/next`). beforeSend strips `?repo=…&server=…` before telemetry leaves the browser. */}
    <SpeedInsights beforeSend={speedInsightsBeforeSend} />
  </React.StrictMode>,
);
