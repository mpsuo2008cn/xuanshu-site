const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const assetsDir = path.resolve(__dirname, '..', 'assets');
const profileDir = path.resolve(__dirname, '..', '.edge-render-profile');

function sizeFor(file) {
  if (file.startsWith('term-')) return [900, 1600];
  if (file.startsWith('hero-')) return [720, 300];
  if (file.startsWith('card-')) return [900, 360];
  return [900, 900];
}

function fileUrl(filePath) {
  return `file:///${filePath.replace(/\\/g, '/')}`;
}

fs.mkdirSync(profileDir, { recursive: true });

const svgFiles = fs.readdirSync(assetsDir)
  .filter(name => name.endsWith('.svg') && !name.endsWith('.tmp.svg'))
  .sort();

for (const file of svgFiles) {
  const input = path.join(assetsDir, file);
  const output = path.join(assetsDir, file.replace(/\.svg$/i, '.png'));
  const [width, height] = sizeFor(file);
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    '--hide-scrollbars',
    `--user-data-dir=${profileDir}`,
    `--window-size=${width},${height}`,
    `--screenshot=${output}`,
    fileUrl(input)
  ];

  const result = spawnSync(edgePath, args, { encoding: 'utf8' });
  if (!fs.existsSync(output)) {
    throw new Error(`Failed to render ${file}: ${result.stderr || result.stdout}`);
  }
  console.log(`${file} -> ${path.basename(output)}`);
}

console.log(`rendered ${svgFiles.length} PNG files`);
