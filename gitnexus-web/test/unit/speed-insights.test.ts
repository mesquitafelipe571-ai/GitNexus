import { describe, expect, it } from 'vitest';
import { redactSpeedInsightsUrl, speedInsightsBeforeSend } from '../../src/lib/speed-insights';

describe('redactSpeedInsightsUrl', () => {
  it('strips the query string that carries local repo paths and server URLs', () => {
    const url =
      'https://gitnexus.vercel.app/?project=gitnexus&repo=C%3A%5CUsers%5Cme%5Ccode&server=http%3A%2F%2Flocalhost%3A4747';
    expect(redactSpeedInsightsUrl(url)).toBe('https://gitnexus.vercel.app/');
  });

  it('strips the fragment', () => {
    expect(redactSpeedInsightsUrl('https://example.com/path#section')).toBe(
      'https://example.com/path',
    );
  });

  it('keeps origin and pathname untouched', () => {
    expect(redactSpeedInsightsUrl('https://example.com/some/path')).toBe(
      'https://example.com/some/path',
    );
  });

  it('falls back to manual stripping for non-absolute URLs', () => {
    expect(redactSpeedInsightsUrl('/relative?view=ops')).toBe('/relative');
    expect(redactSpeedInsightsUrl('/relative#x')).toBe('/relative');
    expect(redactSpeedInsightsUrl('/plain')).toBe('/plain');
  });
});

describe('speedInsightsBeforeSend', () => {
  it('returns the event with a redacted url and preserves other fields', () => {
    const result = speedInsightsBeforeSend({
      type: 'vital',
      url: 'https://gitnexus.vercel.app/?repo=%2Fhome%2Fme%2Fsecret',
      route: '/',
    });
    expect(result).toEqual({ type: 'vital', url: 'https://gitnexus.vercel.app/', route: '/' });
  });

  it('drops events without a usable url', () => {
    expect(speedInsightsBeforeSend({ type: 'vital', url: undefined as unknown as string })).toBe(
      null,
    );
  });
});
