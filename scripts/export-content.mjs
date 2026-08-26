/**
 * Generates public/content.json from the bundled content.js.
 *
 * Run `npm run content:export` after editing content.js to refresh the
 * publishable JSON, then upload that file wherever you host it.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = pathToFileURL(resolve(root, 'src/data/content.js')).href;

const content = await import(source);

const payload = {
  meta: content.meta,
  hero: content.hero,
  about: content.about,
  experience: content.experience,
  skills: content.skills,
  credentials: content.credentials,
  projects: content.projects,
  contact: content.contact,
  statusLines: content.statusLines,
  sections: content.sections,
  footer: content.footer,
};

const outPath = resolve(root, 'public/content.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`Wrote ${outPath}`);
console.log('Top-level keys:', Object.keys(payload).join(', '));
