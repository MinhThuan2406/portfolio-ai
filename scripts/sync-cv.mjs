import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const pdfPath = path.resolve('public', 'cv.pdf');
const prefix = path.resolve('public', 'cv-page');

if (!fs.existsSync(pdfPath)) {
  console.error('public/cv.pdf not found!');
  process.exit(1);
}

console.log('Rendering pages from public/cv.pdf...');
execSync(`pdftoppm -png -r 150 "${pdfPath}" "${prefix}"`, { stdio: 'inherit' });

const files = fs.readdirSync('public').filter(f => f.startsWith('cv-page-') && f.endsWith('.png'));

for (const file of files) {
  const pageNum = file.match(/cv-page-(\d+)\.png/)?.[1];
  if (!pageNum) continue;
  const inputPng = path.resolve('public', file);
  const outputWebp = path.resolve('public', `cv-page-${pageNum}.webp`);

  console.log(`Converting ${file} -> cv-page-${pageNum}.webp...`);
  await sharp(inputPng).webp({ quality: 88 }).toFile(outputWebp);
  fs.unlinkSync(inputPng);
}

console.log('✓ Successfully synced CV pages to WebP!');
