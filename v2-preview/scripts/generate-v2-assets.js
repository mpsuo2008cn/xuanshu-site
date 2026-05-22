const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'assets');

const heroThemes = [
  ['hero-01-spring.svg', '#d9dfc9', '#b63a32', 'crane'],
  ['hero-02-lotus.svg', '#c6d9c6', '#d89a9a', 'lotus'],
  ['hero-03-reeds.svg', '#ded2b4', '#c48d57', 'reeds'],
  ['hero-04-plum-snow.svg', '#d7dee4', '#b83b35', 'plum'],
  ['hero-05-bamboo-pavilion.svg', '#c9d8be', '#9b6a3b', 'bamboo'],
  ['hero-06-pine-cloud.svg', '#c2d0c2', '#8c6b45', 'pine'],
  ['hero-07-osmanthus-moon.svg', '#e0d0a3', '#c9924c', 'moon'],
  ['hero-08-orchid-stream.svg', '#c8d7c7', '#8d9d8a', 'orchid'],
  ['hero-09-morning-mist.svg', '#d5d7cf', '#d79373', 'mist'],
  ['hero-10-red-sun.svg', '#d4d5c6', '#c14c37', 'sun']
];

const cardThemes = [
  ['card-01-bamboo.svg', '#c6d2ba', '#9c6f42', 'bamboo'],
  ['card-02-lotus.svg', '#c7d8c7', '#d58b96', 'lotus'],
  ['card-03-tea.svg', '#c2d0bd', '#a47b4b', 'tea'],
  ['card-04-plum-bridge.svg', '#d9d1c4', '#b73a34', 'plum'],
  ['card-05-reed-boat.svg', '#ded2b5', '#9a744a', 'reeds'],
  ['card-06-pine-rock.svg', '#c0ccbd', '#786447', 'pine'],
  ['card-07-orchid-stone.svg', '#c7d3c4', '#7f936f', 'orchid'],
  ['card-08-moon-osmanthus.svg', '#ddd0a5', '#c18b42', 'moon'],
  ['card-09-willow-birds.svg', '#cdd9c2', '#8a9a66', 'willow'],
  ['card-10-river-pavilion.svg', '#cbd2cf', '#96714b', 'river']
];

function svgHeader(width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
}

function paperDefs(id, tint, accent) {
  return `
  <defs>
    <linearGradient id="${id}-paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffaf1"/>
      <stop offset=".62" stop-color="#f8efe1"/>
      <stop offset="1" stop-color="#fff9ef"/>
    </linearGradient>
    <linearGradient id="${id}-mist" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fffaf1" stop-opacity=".08"/>
      <stop offset=".38" stop-color="#fffaf1" stop-opacity=".28"/>
      <stop offset="1" stop-color="#fffaf1" stop-opacity=".02"/>
    </linearGradient>
    <filter id="${id}-soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
    <radialGradient id="${id}-sun" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${accent}" stop-opacity=".72"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <style>
      .ink-${id}{fill:none;stroke:#68716a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;opacity:.28}
      .wash-${id}{fill:${tint};opacity:.24}
      .accent-${id}{fill:${accent};opacity:.45}
      .soft-${id}{filter:url(#${id}-soft)}
    </style>
  </defs>`;
}

function mountains(id, baseY, scale = 1) {
  return `
  <path class="wash-${id} soft-${id}" d="M0 ${baseY} C72 ${baseY - 54 * scale} 122 ${baseY - 26 * scale} 184 ${baseY - 82 * scale} C244 ${baseY - 135 * scale} 292 ${baseY - 42 * scale} 348 ${baseY - 92 * scale} C422 ${baseY - 157 * scale} 512 ${baseY - 36 * scale} 620 ${baseY - 92 * scale} L620 ${baseY + 95} L0 ${baseY + 95} Z"/>
  <path class="ink-${id}" d="M20 ${baseY - 4 * scale} C88 ${baseY - 64 * scale} 126 ${baseY - 24 * scale} 176 ${baseY - 72 * scale} C236 ${baseY - 128 * scale} 286 ${baseY - 34 * scale} 340 ${baseY - 84 * scale} C410 ${baseY - 146 * scale} 486 ${baseY - 38 * scale} 585 ${baseY - 86 * scale}"/>
  <path class="ink-${id}" opacity=".18" d="M146 ${baseY + 10 * scale} C208 ${baseY - 38 * scale} 260 ${baseY + 5 * scale} 322 ${baseY - 42 * scale} C390 ${baseY - 96 * scale} 462 ${baseY - 18 * scale} 574 ${baseY - 46 * scale}"/>`;
}

function crane(id, x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity=".76">
    <path d="M0 22 C28 -6 56 -2 86 18 C56 12 34 18 12 34 Z" fill="#f8f1e8" stroke="#6e6255" stroke-width="2" opacity=".92"/>
    <path d="M80 18 C104 16 122 24 140 38" class="ink-${id}"/>
    <path d="M22 29 C36 38 56 40 84 24" fill="none" stroke="#1f2728" stroke-width="8" stroke-linecap="round" opacity=".72"/>
    <path d="M140 38 L154 34" stroke="${id ? '#b63a32' : '#b63a32'}" stroke-width="3" stroke-linecap="round"/>
  </g>`;
}

function plant(id, kind, x, y, accent) {
  const common = `stroke="#75806e" stroke-width="2" stroke-linecap="round" fill="none" opacity=".48"`;
  if (kind === 'lotus') {
    return `<g transform="translate(${x} ${y})">
      <ellipse cx="78" cy="74" rx="72" ry="18" fill="#8aa08b" opacity=".22"/>
      <path d="M92 72 C104 28 112 0 124 -34" ${common}/>
      <path d="M132 62 C146 22 158 -4 174 -28" ${common}/>
      <g transform="translate(124 -42)">
        <path d="M0 0 C-18 -24 -2 -48 0 -20 C5 -50 22 -22 0 0" fill="${accent}" opacity=".5"/>
        <path d="M0 0 C18 -22 40 -14 10 5 C38 8 16 28 0 0" fill="${accent}" opacity=".4"/>
      </g>
      <circle cx="172" cy="-34" r="12" fill="${accent}" opacity=".35"/>
    </g>`;
  }
  if (kind === 'bamboo' || kind === 'willow') {
    const leaves = Array.from({ length: 10 }, (_, i) => {
      const yy = i * 18;
      return `<path d="M${20 + i * 4} ${yy} C${54 + i * 3} ${yy - 9} ${62 + i * 2} ${yy - 4} ${35 + i * 3} ${yy + 10}" fill="#7f956f" opacity=".24"/>`;
    }).join('');
    return `<g transform="translate(${x} ${y}) rotate(${kind === 'willow' ? 8 : -5})">
      <path d="M26 -18 C20 42 28 98 18 166" ${common}/>
      <path d="M54 -24 C44 42 52 104 42 184" ${common}/>
      ${leaves}
    </g>`;
  }
  if (kind === 'plum') {
    return `<g transform="translate(${x} ${y})">
      <path d="M4 112 C42 78 58 44 92 8" ${common}/>
      ${[0,1,2,3].map((i)=>`<circle cx="${48 + i*18}" cy="${70 - i*18}" r="7" fill="${accent}" opacity=".48"/>`).join('')}
    </g>`;
  }
  if (kind === 'tea') {
    return `<g transform="translate(${x} ${y})" opacity=".58">
      <ellipse cx="95" cy="98" rx="70" ry="13" fill="#8a765e" opacity=".14"/>
      <path d="M54 58 C84 34 132 34 158 58 C150 92 68 92 54 58 Z" fill="#b8c6b4" stroke="#80684d" stroke-width="2" opacity=".7"/>
      <path d="M154 62 C184 56 184 88 152 82" fill="none" stroke="#80684d" stroke-width="4"/>
      <ellipse cx="98" cy="58" rx="45" ry="11" fill="#fff8ed" stroke="#80684d" opacity=".8"/>
      <path d="M80 18 C66 -4 104 -2 88 -26" class="ink-${id}"/>
    </g>`;
  }
  return `<g transform="translate(${x} ${y})"><circle cx="70" cy="70" r="44" fill="${accent}" opacity=".18"/></g>`;
}

function heroSvg(file, tint, accent, kind, index) {
  const id = `h${index}`;
  const flora = plant(id, kind, 432, kind === 'lotus' ? 96 : 22, accent);
  const bird = kind === 'crane' || index % 3 === 0 ? crane(id, 356, 32, .45) : '';
  return `${svgHeader(720, 300)}
  ${paperDefs(id, tint, accent)}
  <rect width="720" height="300" fill="url(#${id}-paper)"/>
  <circle cx="${560 + (index % 3) * 34}" cy="${58 + (index % 2) * 22}" r="42" fill="url(#${id}-sun)"/>
  ${mountains(id, 232, .9)}
  ${flora}
  ${bird}
  <rect width="720" height="300" fill="url(#${id}-mist)"/>
</svg>`;
}

function cardSvg(file, tint, accent, kind, index) {
  const id = `c${index}`;
  const subject = plant(id, kind, 480, kind === 'lotus' ? 88 : 35, accent);
  return `${svgHeader(900, 360)}
  ${paperDefs(id, tint, accent)}
  <rect width="900" height="360" fill="url(#${id}-paper)"/>
  <rect width="900" height="360" fill="url(#${id}-mist)"/>
  ${mountains(id, 286, .75)}
  <path class="ink-${id}" opacity=".16" d="M482 250 C546 228 604 240 670 212 C728 188 780 210 850 172"/>
  ${kind === 'reeds' || kind === 'river' ? `<path d="M514 266 C618 286 708 254 858 274" stroke="#8a765e" stroke-width="3" opacity=".18" fill="none"/>` : ''}
  ${subject}
  ${index % 2 === 0 ? crane(id, 620, 48, .34) : ''}
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });

heroThemes.forEach((theme, index) => {
  fs.writeFileSync(path.join(outDir, theme[0]), heroSvg(...theme, index), 'utf8');
});

cardThemes.forEach((theme, index) => {
  fs.writeFileSync(path.join(outDir, theme[0]), cardSvg(...theme, index), 'utf8');
});

console.log(`generated ${heroThemes.length + cardThemes.length} assets in ${outDir}`);
