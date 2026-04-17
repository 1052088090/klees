import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOTS = ['public/images/klee', 'public/images/characters'];
const EXTS = new Set(['.png', '.jpg', '.jpeg']);
const MAX_WIDTH = 1600;
const QUALITY = 78;

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const files = ROOTS.flatMap((r) => walk(r)).filter((f) => EXTS.has(path.extname(f).toLowerCase()));
let totalBefore = 0;
let totalAfter = 0;

for (const src of files) {
  const before = fs.statSync(src).size;
  totalBefore += before;
  const out = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  const img = sharp(src);
  const meta = await img.metadata();
  const pipeline = meta.width && meta.width > MAX_WIDTH ? img.resize({ width: MAX_WIDTH }) : img;
  await pipeline.webp({ quality: QUALITY }).toFile(out + '.tmp');
  fs.renameSync(out + '.tmp', out);
  if (out !== src) fs.unlinkSync(src);

  const after = fs.statSync(out).size;
  totalAfter += after;
  console.log(`${path.relative('.', src).padEnd(60)} ${(before / 1024).toFixed(0).padStart(6)} KB → ${(after / 1024).toFixed(0).padStart(6)} KB  (${((1 - after / before) * 100).toFixed(0)}%)`);
}

console.log(`\nTotal: ${(totalBefore / 1048576).toFixed(1)} MB → ${(totalAfter / 1048576).toFixed(1)} MB  (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}% saved)`);

// Update .png/.jpg references to .webp in source files
const SRC_GLOBS = ['data', 'components', 'pages', 'content', 'lib', 'contexts', 'hooks'];
const SRC_EXTS = new Set(['.ts', '.tsx', '.mdx', '.md']);

function walkSrc(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walkSrc(p, acc);
    else if (SRC_EXTS.has(path.extname(p))) acc.push(p);
  }
  return acc;
}

const sources = SRC_GLOBS.flatMap((d) => walkSrc(d));
const pattern = /(\/images\/(?:klee|characters)\/[^"'\s)]+?)\.(png|jpg|jpeg)\b/gi;
let changedFiles = 0;
for (const f of sources) {
  const orig = fs.readFileSync(f, 'utf8');
  const next = orig.replace(pattern, '$1.webp');
  if (next !== orig) {
    fs.writeFileSync(f, next);
    changedFiles++;
    console.log(`updated refs in ${f}`);
  }
}
console.log(`Updated ${changedFiles} source files.`);
