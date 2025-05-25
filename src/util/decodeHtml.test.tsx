import { decodeHtml } from './decodeHtml';

// src/util/decodeHtml.test.tsx

describe('decodeHtml', () => {
  it('decodes &amp; to &', () => {
    expect(decodeHtml('&amp;')).toBe('&');
  });

  it('decodes &lt; and &gt; to < and >', () => {
    expect(decodeHtml('&lt;div&gt;')).toBe('<div>');
  });

  it('decodes &quot; and &#39; to " and \'', () => {
    expect(decodeHtml('&quot;Hello&#39;')).toBe('"Hello\'');
  });

  it('returns the same string if there are no entities', () => {
    expect(decodeHtml('plain text')).toBe('plain text');
  });

  it('decodes mixed content', () => {
    expect(decodeHtml('Tom &amp; Jerry &lt;3')).toBe('Tom & Jerry <3');
  });

  it('returns empty string when input is null', () => {
    expect(decodeHtml(null)).toBe('');
  });

  it('returns empty string when input is undefined', () => {
    expect(decodeHtml(undefined)).toBe('');
  });

  it('returns empty string when input is an empty string', () => {
    expect(decodeHtml('')).toBe('');
  });
});