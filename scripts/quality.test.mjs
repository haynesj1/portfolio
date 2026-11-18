import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate } from './quality.mjs';

const good = { lcp: 1000, inp: 50, cls: 0, overflow: false, axeViolations: 0, performance: 100, accessibility: 100, bestPractices: 100 };

test('passes when within budgets', () => assert.deepEqual(evaluate(good), []));
test('fails each exceeded budget', () => {
  assert.equal(evaluate({ ...good, lcp: 2501 }).length, 1);
  assert.equal(evaluate({ ...good, inp: 201 }).length, 1);
  assert.equal(evaluate({ ...good, cls: 0.11 }).length, 1);
  assert.equal(evaluate({ ...good, overflow: true }).length, 1);
  assert.equal(evaluate({ ...good, axeViolations: 2 }).length, 1);
  assert.equal(evaluate({ ...good, performance: 89 }).length, 1);
  assert.equal(evaluate({ ...good, accessibility: 89 }).length, 1);
  assert.equal(evaluate({ ...good, bestPractices: 89 }).length, 1);
});
test('boundary values pass', () => assert.deepEqual(evaluate({ ...good, lcp: 2500, inp: 200, cls: 0.1, performance: 90 }), []));
