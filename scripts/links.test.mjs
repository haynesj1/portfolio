import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { frameLinks, brokenLinks } from './links.mjs';
import { NAV_ITEMS, routesFromFiles, visibleItems } from '../src/navigation.mjs';

const html = '<header><nav><a href="/#projects">P</a><a href="/about/">A</a></nav></header><main><a href="/nope/">x</a></main><footer><a href="https://x.com">e</a><a href="/contact/">C</a></footer>';

test('frameLinks reads internal nav, header and footer links only', () => {
  assert.deepEqual(frameLinks(html).sort(), ['/#projects', '/about/', '/contact/']);
});

test('brokenLinks flags links with no built page', () => {
  const dist = mkdtempSync(join(tmpdir(), 'dist-'));
  writeFileSync(join(dist, 'index.html'), '');
  mkdirSync(join(dist, 'about'));
  writeFileSync(join(dist, 'about', 'index.html'), '');
  assert.deepEqual(brokenLinks(html, dist), ['/contact/']);
});

test('navigation leaves out items whose page does not exist', () => {
  const routes = routesFromFiles(['/x/src/pages/index.astro', '/x/src/pages/about/index.mdx', '/x/src/pages/contact.astro']);
  assert.deepEqual(visibleItems(NAV_ITEMS, routes).map((i) => i.label), ['Projects', 'About', 'Contact']);
  assert.deepEqual(visibleItems(NAV_ITEMS, new Set(['/'])).map((i) => i.label), ['Projects']);
});
