import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { evaluate, discoverPages } from './quality.mjs';

const good = { lcp: 1000, inp: 50, cls: 0, overflow: false, axeViolations: 0, performance: 100, accessibility: 100, bestPractices: 100 };

test('passes when within budgets', () => assert.deepEqual(evaluate(good), []));
test('fails each exceeded budget', () => {
  assert.equal(evaluate({ ...good, lcp: 2501 }).length, 1);
  assert.equal(evaluate({ ...good, lcp: null }).length, 1);
  assert.equal(evaluate({ ...good, inp: 201 }).length, 1);
  assert.equal(evaluate({ ...good, cls: 0.11 }).length, 1);
  assert.equal(evaluate({ ...good, overflow: true }).length, 1);
  assert.equal(evaluate({ ...good, axeViolations: 2 }).length, 1);
  assert.equal(evaluate({ ...good, performance: 89 }).length, 1);
  assert.equal(evaluate({ ...good, accessibility: 89 }).length, 1);
  assert.equal(evaluate({ ...good, bestPractices: 89 }).length, 1);
});
test('boundary values pass', () => assert.deepEqual(evaluate({ ...good, lcp: 2500, inp: 200, cls: 0.1, performance: 90 }), []));

function tree(files) {
  const d = mkdtempSync(join(tmpdir(), 'q-'));
  for (const f of files) {
    const p = join(d, f);
    mkdirSync(join(p, '..'), { recursive: true });
    writeFileSync(p, 'x');
  }
  return d;
}
test('discoverPages finds nested routes in a stable order', () => {
  const d = tree(['projects/b/index.html', 'index.html', 'projects/a/index.html', 'about/index.html']);
  assert.deepEqual(discoverPages(d), ['/', '/about/', '/projects/a/', '/projects/b/']);
});
test('discoverPages ignores non-page files and 404.html', () => {
  const d = tree(['index.html', '404.html', '_astro/x.js', 'a.css', 'sitemap.xml', 'img/p.png', 'docs/guide.html']);
  assert.deepEqual(discoverPages(d), ['/', '/docs/guide.html']);
});
test('discoverPages returns nothing for an empty build', () => assert.deepEqual(discoverPages(tree(['_astro/x.js'])), []));
