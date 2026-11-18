// Quality gate: run after `npm run build`. Serves dist/ with `astro preview`, then at 375 px checks
// layout overflow, axe violations, Lighthouse mobile scores, and LCP / INP / CLS against the vision's budgets.
// Exits non-zero when any budget is exceeded. Writes a Markdown table to $GITHUB_STEP_SUMMARY when set.
// Set CHROME_PATH to use a specific Chrome/Chromium binary.
import { spawn } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

// Mid-range phone profile (matches Lighthouse mobile defaults): 4x CPU slowdown, slow-4G network.
export const PROFILE = { cpuSlowdown: 4, latency: 150, downloadBps: (1.6 * 1024 * 1024) / 8, uploadBps: (750 * 1024) / 8 };
export const BUDGETS = { lcp: 2500, inp: 200, cls: 0.1, score: 90 };
// Stable fixture routes: synthetic pages, independent of real project content.
const PATHS = ['/', '/example-project/'];
const PORT = 4399;
const BASE = `http://127.0.0.1:${PORT}`;
const chromePath = process.env.CHROME_PATH || undefined;

export function evaluate(m) {
  const fails = [];
  if (m.overflow) fails.push('horizontal overflow at 375 px');
  if (m.axeViolations > 0) fails.push(`${m.axeViolations} axe violation(s)`);
  if (m.lcp == null) fails.push('LCP unavailable (no sample before input)');
  else if (m.lcp > BUDGETS.lcp) fails.push(`LCP ${m.lcp} ms > ${BUDGETS.lcp}`);
  if (m.inp > BUDGETS.inp) fails.push(`INP ${m.inp} ms > ${BUDGETS.inp}`);
  if (m.cls > BUDGETS.cls) fails.push(`CLS ${m.cls} > ${BUDGETS.cls}`);
  for (const k of ['performance', 'accessibility', 'bestPractices']) {
    if (m[k] < BUDGETS.score) fails.push(`Lighthouse ${k} ${m[k]} < ${BUDGETS.score}`);
  }
  return fails;
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE + '/')).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('preview server did not start');
}

async function measureBrowser(browser, path) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: PROFILE.cpuSlowdown });
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: PROFILE.latency, downloadThroughput: PROFILE.downloadBps, uploadThroughput: PROFILE.uploadBps });
  await page.addInitScript(() => {
    window.__v = { lcp: 0, cls: 0, inp: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__v.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.interactionId) window.__v.inp = Math.max(window.__v.inp, e.duration); }).observe({ type: 'event', durationThreshold: 16, buffered: true });
  });
  await page.goto(BASE + path, { waitUntil: 'load' });
  // Loading metrics first: wait for a real LCP sample, since input ends LCP collection.
  // No sample within the timeout is reported as unavailable (null), never as 0 ms.
  const gotLcp = await page.waitForFunction(() => window.__v.lcp > 0, null, { timeout: 10000 }).then(() => true, () => false);
  // Then interact (tap and key press) so INP has real events; the page stays put.
  await page.touchscreen.tap(20, 100);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);
  const v = await page.evaluate(() => window.__v);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  const axe = await new AxeBuilder({ page }).analyze();
  await ctx.close();
  return { lcp: gotLcp ? Math.round(v.lcp) : null, cls: +v.cls.toFixed(4), inp: Math.round(v.inp), overflow, axeViolations: axe.violations.length };
}

async function measureLighthouse(path) {
  const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-sandbox'] });
  try {
    const r = await lighthouse(BASE + path, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices'], formFactor: 'mobile', screenEmulation: { mobile: true, width: 375, height: 667, deviceScaleFactor: 2, disabled: false } });
    const c = r.lhr.categories;
    return { performance: Math.round(c.performance.score * 100), accessibility: Math.round(c.accessibility.score * 100), bestPractices: Math.round(c['best-practices'].score * 100) };
  } finally { await chrome.kill(); }
}

async function main() {
  const server = spawn('npx', ['astro', 'preview', '--host', '127.0.0.1', '--port', String(PORT)], { stdio: 'ignore' });
  let failed = false;
  const rows = [];
  try {
    await waitForServer();
    const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
    for (const path of PATHS) {
      const m = { ...(await measureBrowser(browser, path)), ...(await measureLighthouse(path)) };
      const fails = evaluate(m);
      if (fails.length) failed = true;
      rows.push(`| ${path} | ${m.lcp ?? "n/a"} | ${m.inp} | ${m.cls} | ${m.performance} | ${m.accessibility} | ${m.bestPractices} | ${m.axeViolations} | ${m.overflow ? 'yes' : 'no'} | ${fails.length ? 'FAIL: ' + fails.join('; ') : 'pass'} |`);
    }
    await browser.close();
  } finally { server.kill(); }
  const table = [
    '## Preview quality at 375 px',
    `Budgets: LCP ≤ ${BUDGETS.lcp} ms, INP ≤ ${BUDGETS.inp} ms, CLS ≤ ${BUDGETS.cls}, Lighthouse ≥ ${BUDGETS.score}, zero axe violations, no overflow.`,
    '',
    '| Page | LCP ms | INP ms | CLS | Perf | A11y | Best practice | Axe | Overflow | Result |',
    '|---|---|---|---|---|---|---|---|---|---|',
    ...rows,
  ].join('\n');
  console.log(table);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, table + '\n');
  process.exit(failed ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
