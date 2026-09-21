/**
 * Vercel Speed Insights configuration for the GitNexus web UI.
 *
 * The SPA encodes state in the query string — `?repo=<absolute local path>`,
 * `?project=<name>`, `?server=<local backend URL>`, `?view=ops`. Those values
 * are machine-specific and can name private filesystem paths, so they must
 * never leave the browser as telemetry. `beforeSend` strips the query string
 * and fragment and keeps only origin + pathname.
 *
 * @see https://vercel.com/docs/speed-insights/package#beforesend
 */

export interface SpeedInsightsEvent {
  type: 'vital';
  url: string;
  route?: string;
}

/** Drop `?query` and `#fragment`, preserving origin + pathname only. */
export const redactSpeedInsightsUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    // Not an absolute URL (should not happen in the browser); strip manually.
    const cut = url.search(/[?#]/);
    return cut === -1 ? url : url.slice(0, cut);
  }
};

/**
 * `beforeSend` hook for `<SpeedInsights />`. Returns the event with a redacted
 * URL, or `null` to drop it when the URL is unusable.
 */
export const speedInsightsBeforeSend = <T extends SpeedInsightsEvent>(event: T): T | null => {
  if (!event || typeof event.url !== 'string') return null;
  return { ...event, url: redactSpeedInsightsUrl(event.url) };
};
