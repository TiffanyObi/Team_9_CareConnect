import { beforeEach, describe, expect, it } from 'vitest';
import { applyPreferences } from './AuthContext';

describe('settings preference application', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-text-scale');
    document.documentElement.removeAttribute('data-high-contrast');
    document.documentElement.removeAttribute('data-reduced-motion');
  });

  it('maps saved settings to document-level accessibility attributes', () => {
    applyPreferences({ textScale: '200', highContrast: true, reducedMotion: true });
    expect(document.documentElement.dataset.textScale).toBe('200');
    expect(document.documentElement.dataset.highContrast).toBe('true');
    expect(document.documentElement.dataset.reducedMotion).toBe('true');
  });
});
