/**
 * 玄枢小卷构建脚本
 *
 * 用法:
 *   node scripts/build-scrolls.js
 *
 * 功能:
 *   1. 根据 data/scrolls.js 生成每篇小卷静态 HTML（/scrolls/{id}.html）
 *   2. 更新 /scrolls/index.html 小卷列表（读取同一份数据）
 *   3. 更新 sitemap.xml 加入所有小卷 URL
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── 读取数据 ──────────────────────────────────────────
const scrollsSrc = fs.readFileSync(path.join(ROOT, 'data', 'scrolls.js'), 'utf8');
const match = scrollsSrc.match(/var XUANSHU_SCROLLS = (\[[\s\S]*?\n\]);/);
if (!match) {
  console.error('❌ data/scrolls.js 未找到有效数据');
  process.exit(1);
}
let scrolls = eval(match[1]); // eslint-disable-line
const extraPath = path.join(ROOT, 'data', 'scrolls-extra-20260527.js');
if (fs.existsSync(extraPath)) {
  const extraSrc = fs.readFileSync(extraPath, 'utf8');
  const extraMatch = extraSrc.match(/var XUANSHU_SCROLLS_EXTRA_20260527 = (\[[\s\S]*?\n\]);/);
  if (extraMatch) {
    scrolls = scrolls.concat(eval(extraMatch[1])); // eslint-disable-line
  }
}
console.log(`📚 发现 ${scrolls.length} 篇小卷`);

// ── 构建每篇独立 HTML ─────────────────────────────────
const htmlTpl = (item, prev, next) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#f4efe4">
<meta name="description" content="${item.description}">
<meta name="keywords" content="${item.keywords}">
<meta property="og:title" content="${item.title} - 玄枢小卷">
<meta property="og:description" content="${item.description}">
<meta property="og:type" content="article">
<link rel="canonical" href="https://ixuanshu.cn/scrolls/${item.id}.html">
<link rel="manifest" href="/manifest.json">
<title>${item.title} - 玄枢小卷</title>
<style>
*{box-sizing:border-box}
:root{--paper:#fbf6ec;--ink:#1f2929;--muted:#786f63;--gold:#a36d35;--red:#c42f2d;--line:rgba(120,93,58,.18);--shadow:0 10px 30px rgba(83,63,35,.13)}
html,body{margin:0;min-height:100%;max-width:100%;overflow-x:hidden;color:var(--ink);background:var(--paper);font-family:"Noto Serif SC","Songti SC","STSong",serif}
body{display:flex;justify-content:center}
.phone{width:min(100vw,430px);min-height:100vh;padding:8px 12px 94px}
.topline{display:flex;align-items:center;gap:12px;padding:10px 4px 0;margin-bottom:14px}
.back-btn{width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:rgba(255,250,243,.8);display:grid;place-items:center;font-size:22px;cursor:pointer;color:var(--ink);text-decoration:none}
.section-title{font-size:19px;color:var(--muted);letter-spacing:1px}
.scroll-detail{margin-bottom:20px}
.scroll-detail h1{margin:0 4px 12px;color:var(--ink);font-size:28px;line-height:1.35}
.scroll-tag{display:inline-block;margin:0 4px 18px;border-radius:999px;padding:4px 14px;background:rgba(163,109,53,.12);color:var(--gold);font-size:13px;letter-spacing:1px}
.scroll-detail p{margin:0 4px 18px;color:#4f5654;font-size:16px;line-height:1.9;text-indent:2em}
.scroll-detail h3{margin:24px 4px 10px;color:var(--gold);font-size:18px}
.scroll-detail .reminder{border-left:3px solid var(--red);padding:10px 0 10px 14px;margin:0 4px 20px;color:var(--red);background:rgba(196,47,45,.05);border-radius:0 8px 8px 0}
.nav-links{display:flex;flex-wrap:wrap;gap:8px;margin:0 4px 24px}
.nav-links a{display:inline-block;border-radius:999px;padding:7px 14px;background:rgba(244,234,220,.72);color:var(--ink);text-decoration:none;font-size:14px;border:1px solid var(--line)}
.nav-links a:hover{background:rgba(163,109,53,.15);color:var(--gold)}
.recommend-section{margin:0 4px 20px}
.recommend-section h3{color:var(--gold);font-size:16px;margin-bottom:10px}
.recommend-grid{display:flex;flex-wrap:wrap;gap:8px}
.recommend-grid a{border-radius:999px;padding:7px 14px;background:rgba(244,234,220,.72);color:var(--ink);text-decoration:none;font-size:14px;border:1px solid var(--line)}
.recommend-grid a:hover{background:rgba(163,109,53,.15);color:var(--gold)}
.tools-links{display:flex;flex-wrap:wrap;gap:6px;margin:20px 4px 0;padding-top:16px;border-top:1px solid var(--line)}
.tools-links a{font-size:13px;color:var(--muted);text-decoration:none;padding:4px 10px}
.tools-links a:hover{color:var(--gold)}
.bottom-nav{position:fixed;z-index:10;left:50%;bottom:0;transform:translateX(-50%);width:min(100vw,430px);height:82px;display:grid;grid-template-columns:repeat(4,1fr);background:rgba(255,250,243,.9);border-top:1px solid rgba(120,93,58,.16);backdrop-filter:blur(12px);padding-bottom:10px}
.nav-btn{display:grid;place-items:center;align-content:center;gap:4px;color:#9b7b58;font-size:14px;opacity:.58;text-decoration:none}
.nav-btn.active{color:var(--red);font-weight:700;opacity:1}
.site-footer{margin:20px 4px 0;padding:10px;text-align:center;color:#7c756b;font-size:11px;line-height:1.65}
.site-footer a{color:#7c756b;text-decoration:none}
</style>
</head>
<body>
<main class="phone">

  <div class="topline">
    <a class="back-btn" href="/scrolls/" aria-label="返回小卷库">‹</a>
    <span class="section-title">玄枢小卷</span>
  </div>

  <article class="scroll-detail">
    <h1>${item.title}</h1>
    <span class="scroll-tag">${item.group}</span>
    <p>${item.content}</p>
    <h3>传统解释</h3>
    <p>${item.tradition}</p>
    <h3>今日提醒</h3>
    <p class="reminder">${item.reminder}</p>
  </article>

  <nav class="nav-links" aria-label="上一篇下一篇">
    ${prev ? '<a href="/scrolls/' + prev.id + '.html">← ' + prev.title + '</a>' : ''}
    ${next ? '<a href="/scrolls/' + next.id + '.html">' + next.title + ' →</a>' : ''}
    <a href="/scrolls/${scrolls[Math.floor(Math.random() * scrolls.length)].id}.html">🎲 随机一卷</a>
    <a href="/scrolls/">📚 返回小卷库</a>
  </nav>

  <section class="recommend-section">
    <h3>相关小卷</h3>
    <div class="recommend-grid">
      ${scrolls.filter(x => x.group === item.group && x.id !== item.id).slice(0, 4).map(x => '<a href="/scrolls/' + x.id + '.html">' + x.title + '</a>').join('')}
    </div>
  </section>

  <div class="tools-links">
    <span style="font-size:13px;color:var(--muted)">相关工具：</span>
    <a href="/hehun/">八字合婚</a>
    <a href="/huangli/">今日黄历</a>
    <a href="/bazi/">八字排盘</a>
    <a href="/liuyao/">六爻起卦</a>
    <a href="/zeri/">良辰吉日</a>
    <a href="/dream/">周公解梦</a>
  </div>

  <footer class="site-footer">
    <div><a href="https://beian.miit.gov.cn/" rel="noreferrer" target="_blank">陇ICP备2026004046号</a></div>
    <div>
      <a class="beian-link" href="https://beian.mps.gov.cn/#/query/webSearch?code=62010302001821" rel="noreferrer" target="_blank">
        <img src="/v2-preview/assets/beian-icon.png" alt="" width="15" height="15" loading="lazy">
        <span>甘公网安备62010302001821号</span>
      </a>
    </div>
    <div>本站内容仅供娱乐与民俗文化参考，请理性看待。</div>
  </footer>

</main>

<nav class="bottom-nav" aria-label="底部导航">
  <a class="nav-btn" href="/"><span>🏠</span><span>日历</span></a>
  <a class="nav-btn" href="/?page=discover"><span>🌿</span><span>观万象</span></a>
  <a class="nav-btn active" href="/tools/"><span>📦</span><span>工具</span></a>
  <a class="nav-btn" href="/?page=mine"><span>👤</span><span>我的</span></a>
</nav>

<script>
(function(){
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?638065057f904d8f3ed86eaa15c87734";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
</body>
</html>
`;

// ── 生成每篇 HTML ─────────────────────────────────────
const scrollsDir = path.join(ROOT, 'scrolls');
for (let i = 0; i < scrolls.length; i++) {
  const item = scrolls[i];
  const prev = i > 0 ? scrolls[i - 1] : null;
  const next = i < scrolls.length - 1 ? scrolls[i + 1] : null;
  const filePath = path.join(scrollsDir, item.id + '.html');
  fs.writeFileSync(filePath, htmlTpl(item, prev, next), 'utf8');
  console.log(`  ✅ ${item.id}.html`);
}

// ── 更新 scrolls/index.html ────────────────────────────
// 列表页模板与 scrolls/index.html 保持一致
// 如需修改样式，请同时更新 scrolls/index.html 和此模板
const indexTpl = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#f4efe4">
<meta name="description" content="玄枢小卷，每日更新玄学知识。命理入门、八字基础、六爻入门等传统文化内容。">
<meta name="keywords" content="玄枢小卷,玄学知识,命理入门,八字基础,六爻入门">
<link rel="canonical" href="https://ixuanshu.cn/scrolls/">
<link rel="manifest" href="/manifest.json">
<title>玄枢小卷｜玄学知识每日更新</title>
<style>
*{box-sizing:border-box}
:root{--paper:#fbf6ec;--ink:#1f2929;--muted:#786f63;--gold:#a36d35;--red:#c42f2d;--line:rgba(120,93,58,.18);--shadow:0 8px 22px rgba(83,63,35,.10)}
html,body{margin:0;min-height:100%;max-width:100%;overflow-x:hidden;color:var(--ink);background:var(--paper);font-family:"Noto Serif SC","Songti SC","STSong",serif}
body{display:flex;justify-content:center}

.phone{width:min(100vw,430px);min-height:100vh;padding:8px 12px 110px;position:relative}
.phone::before{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse at 86% 6%,rgba(201,87,66,.08),transparent 12%),radial-gradient(ellipse at 18% 18%,rgba(183,139,82,.05),transparent 24%);z-index:0}

/* ── 顶部 ── */
.scroll-hero{padding:20px 18px 16px;margin-bottom:10px;position:relative;z-index:1}
.scroll-hero h1{margin:0 0 6px;font-size:30px;color:var(--ink);letter-spacing:1px}
.scroll-hero p{margin:0;color:var(--muted);font-size:15px;letter-spacing:1px}

/* ── 今日小卷 ── */
.today-pick{position:relative;z-index:1;overflow:hidden;isolation:isolate;margin:0 0 18px;padding:14px 18px;background:rgba(255,251,244,.88);border-radius:16px;border:1px solid rgba(163,109,53,.14);box-shadow:0 4px 14px rgba(83,63,35,.06)}
.today-pick::before{content:"";position:absolute;inset:0;z-index:0;opacity:.35;background:var(--today-bg) center / cover no-repeat;border-radius:16px}
.today-pick>*{position:relative;z-index:1}
.today-pick-label{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--red);letter-spacing:2px;margin-bottom:8px}
.today-pick-label::before{content:"·";font-size:16px;color:var(--red)}
.today-pick a{display:block;color:var(--ink);font-size:19px;font-weight:700;text-decoration:none;line-height:1.3}
.today-pick a:hover{color:var(--gold)}
.today-pick .today-tag{display:inline-block;vertical-align:middle;border-radius:999px;padding:1px 10px;margin-right:6px;background:rgba(163,109,53,.12);color:var(--gold);font-size:12px;letter-spacing:1px;font-weight:400}
.today-pick p{margin:6px 0 0;font-size:14px;color:var(--muted);letter-spacing:0;line-height:1.6}

/* ── 分组标题 ── */
.scroll-group-title{margin:18px 0 8px;color:var(--gold);font-size:15px;letter-spacing:1px;position:relative;z-index:1}
.scroll-group-title::before{content:"卷｜";color:rgba(163,109,53,.42)}

/* ── 卡片列表 ── */
.scroll-list{display:grid;gap:10px;position:relative;z-index:1}
.scroll-card{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;width:100%;padding:14px 18px;min-height:88px;text-align:left;background:rgba(255,251,244,.86);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow);text-decoration:none;transition:box-shadow .2s;position:relative;overflow:hidden;isolation:isolate}
.scroll-card::before{content:"";position:absolute;inset:0;z-index:0;opacity:.30;background:var(--card-bg) center / cover no-repeat;border-radius:18px}
.scroll-card>*{position:relative;z-index:1}
.scroll-card:hover{box-shadow:0 12px 28px rgba(83,63,35,.16)}
.scroll-card h3{margin:0;flex:1;color:var(--ink);font-size:19px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.scroll-card h3::after{content:" ›";color:var(--red);font-weight:400;font-size:18px;margin-left:2px}
.scroll-card p{margin:0;width:100%;color:#5f574b;font-size:14px;line-height:1.6;padding-left:2px}
.scroll-tag{display:inline-block;flex-shrink:0;border-radius:999px;padding:2px 10px;background:rgba(163,109,53,.10);color:var(--gold);font-size:11px;letter-spacing:1px}

/* ── 底部 ── */
.site-footer{margin:24px 0 0;padding:10px;text-align:center;color:#7c756b;font-size:11px;line-height:1.65;position:relative;z-index:1}
.site-footer a{color:#7c756b;text-decoration:none}

/* ── 底部导航 ── */
.bottom-nav{position:fixed;z-index:10;left:50%;bottom:0;transform:translateX(-50%);width:min(100vw,430px);height:82px;display:grid;grid-template-columns:repeat(4,1fr);background:rgba(255,250,243,.9);border-top:1px solid rgba(120,93,58,.16);backdrop-filter:blur(12px);padding-bottom:10px}
.nav-btn{display:grid;place-items:center;align-content:center;gap:4px;color:#9b7b58;font-size:14px;opacity:.58;text-decoration:none}
.nav-btn.active{color:var(--red);font-weight:700;opacity:1}
</style>
</head>
<body>
<main class="phone">

  <section class="scroll-hero">
    <h1>玄枢小卷</h1>
    <p>每日一卷 · 观天时知万象</p>
  </section>

  <div class="today-pick" id="todayPick"></div>

  <div id="scrollGroups"></div>

  <section class="scroll-picks" style="margin:18px 0 0;padding:14px 18px;background:rgba(255,251,244,.86);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow)">
    <h3 style="margin:0 0 10px;color:var(--gold);font-size:16px">&#x1F4D6; 玄枢小卷精选</h3>
    <div id="scrollPicks" style="display:grid;gap:8px"></div>
    <a href="/scrolls/" style="display:block;margin-top:10px;color:var(--red);font-size:14px;text-decoration:none">进入小卷库 &#x2192;</a>
  </section>

  <footer class="site-footer">
    <div><a href="https://beian.miit.gov.cn/" rel="noreferrer" target="_blank">陇ICP备2026004046号</a></div>
    <div>
      <a class="beian-link" href="https://beian.mps.gov.cn/#/query/webSearch?code=62010302001821" rel="noreferrer" target="_blank">
        <img src="/v2-preview/assets/beian-icon.png" alt="" width="15" height="15" loading="lazy">
        <span>甘公网安备62010302001821号</span>
      </a>
    </div>
    <div>本站内容仅供娱乐与民俗文化参考，请理性看待。</div>
  </footer>

</main>

<nav class="bottom-nav" aria-label="底部导航">
  <a class="nav-btn" href="/"><span>🏠</span><span>日历</span></a>
  <a class="nav-btn" href="/?page=discover"><span>🌿</span><span>观万象</span></a>
  <a class="nav-btn active" href="/tools/"><span>📦</span><span>工具</span></a>
  <a class="nav-btn" href="/?page=mine"><span>👤</span><span>我的</span></a>
</nav>

<script src="/data/scrolls.js"></script>
<script src="/data/scrolls-extra-20260527.js"></script>
<script>
(function(){
  if (!window.XUANSHU_SCROLLS) return;
  var items = XUANSHU_SCROLLS;
  var groups = [...new Set(items.map(function(x){ return x.group; }))];

  var cardAssets = ['card-01-bamboo-ai','card-02-lotus-ai','card-03-tea-ai','card-04-plum-bridge-ai','card-05-reed-boat-ai','card-06-pine-rock-ai','card-07-orchid-stone-ai','card-08-moon-osmanthus-ai','card-09-willow-birds-ai','card-10-river-pavilion-ai'];

  // ── 今日小卷 ──
  var todaySeed = new Date().getFullYear() * 372 + (new Date().getMonth() + 1) * 31 + new Date().getDate();
  var todayItem = items[todaySeed % items.length];
  var todayBg = cardAssets[todaySeed % cardAssets.length];
  var tp = document.getElementById('todayPick');
  tp.innerHTML = '<div class="today-pick-label">今日小卷</div>' +
    '<a href="/scrolls/' + todayItem.id + '.html"><span class="today-tag">' + todayItem.group + '</span>' + todayItem.title + '</a>' +
    '<p>' + todayItem.intro + '</p>';
  tp.style.setProperty('--today-bg', "url('/v2-preview/assets/" + todayBg + ".webp)");
  var assetIdx = Math.floor(Math.random() * cardAssets.length);

  // ── 分组列表 ──
  var html = '';
  groups.forEach(function(g){
    html += '<div class="scroll-group-title">' + g + '</div><div class="scroll-list">';
    items.filter(function(x){ return x.group === g; }).forEach(function(i){
      var bg = cardAssets[assetIdx % cardAssets.length];
      assetIdx++;
      html += '<a class="scroll-card" href="/scrolls/' + i.id + '.html" style="--card-bg:url(/v2-preview/assets/' + bg + '.webp)"><span class="scroll-tag">' + i.group + '</span><h3>' + i.title + '</h3><p>' + i.intro + '</p></a>';
    });
    html += '</div>';
  });
  document.getElementById('scrollGroups').innerHTML = html;

  // ── 精选小卷 ──
  var picksEl = document.getElementById('scrollPicks');
  if (picksEl) {
    var picks = [
      items.find(function(x){return x.id==='shishen'}),
      items.find(function(x){return x.id==='bazi-rizhu'}),
      items.find(function(x){return x.id==='liuyao-dongyao'})
    ].filter(Boolean);
    picksEl.innerHTML = picks.map(function(p){return '<a href="/scrolls/'+p.id+'.html" style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--line);font-size:15px"><span>'+p.title+'</span><span style="color:var(--muted)">&#x203A;</span></a>'}).join('');
  }
})();
</script>
<script>
var _hmt=_hmt||[];
(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?638065057f904d8f3ed86eaa15c87734";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})();
</script>
</body>
</html>
`;

const indexPath = path.join(scrollsDir, 'index.html');
fs.writeFileSync(indexPath, indexTpl, 'utf8');
console.log('  ✅ scrolls/index.html (列表页)');

// ── 更新 sitemap.xml ───────────────────────────────────
const sitemapPath = path.join(ROOT, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

// 移除旧的 scrolls 条目（除列表页外）
const scrollPattern = /  <url>[\s\S]*?<loc>https:\/\/ixuanshu\.cn\/scrolls\/[^<]+\.html<\/loc>[\s\S]*?<\/url>\n/g;
sitemap = sitemap.replace(scrollPattern, '');

// 在 </urlset> 之前插入新条目
const scrollUrls = scrolls.map(item => `  <url>
    <loc>https://ixuanshu.cn/scrolls/${item.id}.html</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n');

sitemap = sitemap.replace('</urlset>', '\n' + scrollUrls + '\n</urlset>');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('  ✅ sitemap.xml');

console.log(`\n✨ 完成！生成了 ${scrolls.length} 篇小卷 + 列表页 + sitemap`);
