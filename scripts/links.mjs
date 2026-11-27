// Link check helpers for the smoke test: nav and footer links must resolve to built pages.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Internal hrefs found inside <nav>, <header> and <footer> elements.
export function frameLinks(html) {
  const hrefs = new Set();
  for (const block of html.match(/<(nav|header|footer)\b[\s\S]*?<\/\1>/g) ?? []) {
    for (const m of block.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
      if (m[1].startsWith('/') && !m[1].startsWith('//')) hrefs.add(m[1]);
    }
  }
  return [...hrefs];
}

// The built file a path resolves to, or null when none exists. Query and hash are ignored.
export function resolveBuilt(href, dist = 'dist') {
  const p = href.split(/[?#]/)[0];
  const candidates = p.endsWith('/') ? [join(dist, p, 'index.html')] : [join(dist, p), join(dist, p, 'index.html')];
  return candidates.find((c) => existsSync(c)) ?? null;
}

export function brokenLinks(html, dist = 'dist') {
  return frameLinks(html).filter((h) => !resolveBuilt(h, dist));
}
