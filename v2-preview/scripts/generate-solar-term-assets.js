const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'assets');

const terms = [
  ['term-01-lichun.svg', '立春', '#b9d6b0', '#7fa56a', 'willow'],
  ['term-02-yushui.svg', '雨水', '#b8cdd3', '#6f94a0', 'rain'],
  ['term-03-jingzhe.svg', '惊蛰', '#c5d8a8', '#8a9d48', 'bamboo'],
  ['term-04-chunfen.svg', '春分', '#e3c1c1', '#c27078', 'peach'],
  ['term-05-qingming.svg', '清明', '#b8d0bd', '#6f987a', 'rain'],
  ['term-06-guyu.svg', '谷雨', '#bfd4aa', '#7f9d55', 'tea'],
  ['term-07-lixia.svg', '立夏', '#bfd4bd', '#d98a9a', 'lotus'],
  ['term-08-xiaoman.svg', '小满', '#ded1a5', '#b88942', 'wheat'],
  ['term-09-mangzhong.svg', '芒种', '#d6c18e', '#a97e37', 'field'],
  ['term-10-xiazhi.svg', '夏至', '#bed9c5', '#cc7684', 'lotus'],
  ['term-11-xiaoshu.svg', '小暑', '#c5d6b9', '#9a7b45', 'fan'],
  ['term-12-dashu.svg', '大暑', '#bfd1af', '#d07868', 'shade'],
  ['term-13-liqiu.svg', '立秋', '#dbc18b', '#b77a36', 'leaf'],
  ['term-14-chushu.svg', '处暑', '#d8c697', '#a9853e', 'grain'],
  ['term-15-bailu.svg', '白露', '#c8d2c9', '#78906e', 'reeds'],
  ['term-16-qiufen.svg', '秋分', '#dfc489', '#c08c38', 'moon'],
  ['term-17-hanlu.svg', '寒露', '#d2c1a6', '#9e7745', 'chrysanthemum'],
  ['term-18-shuangjiang.svg', '霜降', '#d6b49a', '#b4533a', 'maple'],
  ['term-19-lidong.svg', '立冬', '#c6cfcf', '#806c4a', 'pine'],
  ['term-20-xiaoxue.svg', '小雪', '#d6dde0', '#728a95', 'snow'],
  ['term-21-daxue.svg', '大雪', '#d8e0e4', '#b8453d', 'plum'],
  ['term-22-dongzhi.svg', '冬至', '#d8cbbd', '#b27b40', 'lantern'],
  ['term-23-xiaohan.svg', '小寒', '#cbd5d8', '#8c6f5a', 'plum'],
  ['term-24-dahan.svg', '大寒', '#cfd8db', '#6f806b', 'pine']
];

function defs(id, tint, accent) {
  return `<defs>
    <linearGradient id="${id}-paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffaf1"/>
      <stop offset=".56" stop-color="#f8efe1"/>
      <stop offset="1" stop-color="#fff8ef"/>
    </linearGradient>
    <filter id="${id}-blur"><feGaussianBlur stdDeviation="6"/></filter>
    <style>
      .wash{fill:${tint};opacity:.23;filter:url(#${id}-blur)}
      .ink{fill:none;stroke:#657069;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;opacity:.28}
      .accent{fill:${accent};opacity:.48}
      .line{stroke:${accent};stroke-width:3;stroke-linecap:round;fill:none;opacity:.48}
      .thin{stroke:#657069;stroke-width:1.7;stroke-linecap:round;fill:none;opacity:.3}
    </style>
  </defs>`;
}

function mountains() {
  return `<path class="wash" d="M0 560 C90 480 156 538 238 442 C318 350 370 520 468 422 C592 300 718 468 860 378 L860 860 L0 860 Z"/>
  <path class="ink" d="M20 552 C88 492 154 536 230 450 C310 360 368 518 462 428 C584 310 704 470 838 386"/>
  <path class="thin" d="M182 610 C282 542 350 596 452 534 C546 476 648 546 806 500"/>`;
}

function subject(kind, accent) {
  const leaf = (x, y, r = 0) => `<path d="M${x} ${y} C${x + 45} ${y - 18} ${x + 58} ${y - 8} ${x + 18} ${y + 22}" fill="${accent}" opacity=".25" transform="rotate(${r} ${x} ${y})"/>`;
  if (kind === 'lotus') return `<g transform="translate(480 430)">${leaf(40,70,-12)}${leaf(118,86,8)}<path class="line" d="M112 92 C132 18 150 -24 176 -88"/><path class="line" d="M190 94 C206 38 224 4 254 -42"/><path d="M176 -92 C146 -128 168 -158 178 -120 C190 -166 218 -118 176 -92" class="accent"/><path d="M254 -48 C232 -80 254 -104 262 -72 C276 -110 296 -70 254 -48" class="accent" opacity=".35"/></g>`;
  if (kind === 'willow') return `<g transform="translate(542 60)">${Array.from({length:10},(_,i)=>`<path class="thin" d="M${i*24} 0 C${i*20+8} ${80+i*10} ${i*18-18} ${132+i*16}"/><path d="M${i*20+2} ${66+i*12} C${i*20+42} ${i*12+55} ${i*20+48} ${i*12+66} ${i*20+18} ${i*12+84}" fill="${accent}" opacity=".22"/>`).join('')}</g>`;
  if (kind === 'rain') return `<g transform="translate(536 126)">${Array.from({length:13},(_,i)=>`<path class="thin" d="M${i*24} ${i%3*16} l-18 42"/>`).join('')}<path class="ink" d="M-30 210 C70 176 136 206 242 164"/></g>`;
  if (kind === 'bamboo') return `<g transform="translate(566 166)"><path class="line" d="M20 0 C4 128 24 202 6 312"/><path class="line" d="M72 -16 C56 108 78 220 58 336"/>${Array.from({length:9},(_,i)=>leaf(34+i*7, 34+i*31, i%2?18:-14)).join('')}</g>`;
  if (kind === 'peach') return `<g transform="translate(522 176)"><path class="line" d="M0 240 C80 172 122 78 214 0"/>${Array.from({length:9},(_,i)=>`<circle cx="${62+i*18}" cy="${174-i*19}" r="13" class="accent"/>`).join('')}</g>`;
  if (kind === 'tea') return `<g transform="translate(518 310)">${leaf(80,60,-12)}${leaf(132,82,14)}<path class="line" d="M72 164 C130 108 168 54 210 -22"/><ellipse cx="170" cy="176" rx="72" ry="20" fill="${accent}" opacity=".18"/></g>`;
  if (kind === 'wheat' || kind === 'grain' || kind === 'field') return `<g transform="translate(544 210)">${Array.from({length:8},(_,i)=>`<path class="line" d="M${i*28} 220 C${i*28+8} 138 ${i*28+6} 78 ${i*28+30} 0"/>${Array.from({length:5},(_,j)=>`<ellipse cx="${i*28+30+j*2}" cy="${20+j*26}" rx="7" ry="17" fill="${accent}" opacity=".35" transform="rotate(${j%2?28:-28} ${i*28+30+j*2} ${20+j*26})"/>`).join('')}`).join('')}</g>`;
  if (kind === 'fan') return `<g transform="translate(548 304)"><path d="M0 190 C42 34 164 22 242 190 Z" fill="${accent}" opacity=".20"/><path class="line" d="M20 174 L120 48 L220 174 M60 174 L120 48 L180 174 M100 174 L120 48 L140 174"/><path class="ink" d="M0 190 C74 224 170 222 242 190"/></g>`;
  if (kind === 'shade') return `<g transform="translate(500 156)">${leaf(50,100,-8)}${leaf(150,84,10)}${leaf(84,178,12)}<circle cx="230" cy="28" r="34" fill="${accent}" opacity=".18"/></g>`;
  if (kind === 'leaf' || kind === 'maple') return `<g transform="translate(550 184)"><path class="line" d="M0 260 C86 180 128 82 216 0"/>${Array.from({length:10},(_,i)=>`<path d="M${72+i*16} ${178-i*15} C${118+i*10} ${146-i*16} ${128+i*9} ${172-i*15} ${88+i*15} ${200-i*11}" fill="${accent}" opacity="${kind==='maple'?'.42':'.28'}"/>`).join('')}</g>`;
  if (kind === 'moon') return `<g transform="translate(548 172)"><circle cx="160" cy="40" r="58" fill="${accent}" opacity=".18"/><path class="line" d="M10 270 C86 196 128 82 216 0"/>${Array.from({length:8},(_,i)=>`<circle cx="${66+i*18}" cy="${206-i*20}" r="9" class="accent"/>`).join('')}</g>`;
  if (kind === 'chrysanthemum') return `<g transform="translate(560 290)"><path class="line" d="M80 210 C98 104 112 58 140 0"/>${Array.from({length:16},(_,i)=>`<ellipse cx="140" cy="0" rx="12" ry="42" fill="${accent}" opacity=".32" transform="rotate(${i*22.5} 140 0)"/>`).join('')}</g>`;
  if (kind === 'pine') return `<g transform="translate(530 190)"><path class="line" d="M130 330 C116 210 124 116 150 0"/>${Array.from({length:5},(_,i)=>`<path d="M${150-i*8} ${48+i*45} C${70-i*6} ${76+i*40} ${70+i*8} ${110+i*38} ${146-i*4} ${84+i*44} C${222+i*8} ${58+i*38} ${224-i*6} ${96+i*38} ${150-i*4} ${84+i*44}" fill="${accent}" opacity=".22"/>`).join('')}</g>`;
  if (kind === 'snow') return `<g transform="translate(520 130)">${Array.from({length:24},(_,i)=>`<circle cx="${(i*47)%300}" cy="${(i*83)%360}" r="${2+i%4}" fill="#7d9198" opacity=".25"/>`).join('')}</g>`;
  if (kind === 'plum') return `<g transform="translate(518 174)"><path class="line" d="M0 260 C72 190 128 92 226 0"/>${Array.from({length:9},(_,i)=>`<circle cx="${70+i*18}" cy="${186-i*19}" r="11" fill="${accent}" opacity=".48"/>`).join('')}</g>`;
  if (kind === 'lantern') return `<g transform="translate(596 198)"><path class="line" d="M90 0 L90 54"/><rect x="40" y="54" width="100" height="118" rx="34" fill="${accent}" opacity=".22" stroke="${accent}" stroke-width="3"/><path class="line" d="M58 92 H122 M90 172 L90 226"/><circle cx="90" cy="118" r="26" fill="#fff3dc" opacity=".42"/></g>`;
  if (kind === 'reeds') return `<g transform="translate(548 180)">${Array.from({length:10},(_,i)=>`<path class="line" d="M${i*28} 280 C${i*28+6} 186 ${i*28+2} 70 ${i*28+42} 0"/><ellipse cx="${i*28+42}" cy="0" rx="9" ry="42" fill="${accent}" opacity=".28" transform="rotate(${i%2?18:-16} ${i*28+42} 0)"/>`).join('')}</g>`;
  return `<g transform="translate(548 220)"><circle cx="120" cy="120" r="92" fill="${accent}" opacity=".18"/></g>`;
}

function makeSvg([file, name, tint, accent, kind], idx) {
  const id = `t${idx}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1600" viewBox="0 0 900 1600">
  ${defs(id, tint, accent)}
  <rect width="900" height="1600" fill="url(#${id}-paper)"/>
  <circle cx="720" cy="150" r="78" fill="${accent}" opacity=".12"/>
  ${mountains()}
  ${subject(kind, accent)}
  <path class="thin" d="M88 720 C188 668 270 712 360 654"/>
  <path class="thin" d="M580 1000 C672 960 742 1010 832 952"/>
  <text x="80" y="210" font-family="serif" font-size="96" fill="#222b2b" opacity=".92">${name}</text>
  <rect x="84" y="246" width="178" height="52" rx="26" fill="#fff7ea" stroke="${accent}" stroke-width="2" opacity=".76"/>
  <text x="112" y="282" font-family="serif" font-size="28" fill="${accent}" opacity=".9">二十四节气</text>
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });
terms.forEach((term, idx) => {
  fs.writeFileSync(path.join(outDir, term[0]), makeSvg(term, idx), 'utf8');
});
console.log(`generated ${terms.length} solar term assets in ${outDir}`);
