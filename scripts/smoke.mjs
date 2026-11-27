// Smoke check: run after `npm run build`. Verifies expected routes were generated.
import { readFileSync, existsSync } from 'node:fs';
import { brokenLinks } from './links.mjs';

const checks = [
  ['dist/index.html', 'Portfolio'],
  ['dist/example-project/index.html', 'synthetic fixture'],
];
let failed = false;
for (const [file, text] of checks) {
  if (!existsSync(file)) { console.error(`MISSING ${file}`); failed = true; continue; }
  const html = readFileSync(file, 'utf8');
  if (!html.includes(text)) { console.error(`${file} lacks "${text}"`); failed = true; continue; }
  if (file.includes('example-project') && !/<h1[^>]*>Example project<\/h1>/.test(html)) {
    console.error(`${file}: MDX heading not rendered`); failed = true; continue;
  }
  const broken = brokenLinks(html);
  if (broken.length) { console.error(`${file}: navigation or footer links with no built page: ${broken.join(', ')}`); failed = true; continue; }
  console.log(`ok ${file}`);
}
process.exit(failed ? 1 : 0);
