const APP_VERSION = 'v1.0.0';
const FEEDBACK_EMAIL = 'feedback@example.com';
const WECHAT_ID = 'mpsuo2008cn';
const HISTORY_KEY = 'baziHistory';
const FAVORITE_KEY = 'baziFavorites';

const GAN_WUXING = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
const ZHI_WUXING = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
const GAN_YINYANG = { 甲: 1, 丙: 1, 戊: 1, 庚: 1, 壬: 1, 乙: 0, 丁: 0, 己: 0, 辛: 0, 癸: 0 };
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
const TIAN_YI = { 甲: '丑未', 戊: '丑未', 庚: '丑未', 乙: '子申', 己: '子申', 丙: '亥酉', 丁: '亥酉', 壬: '巳卯', 癸: '巳卯', 辛: '寅午' };
const TAI_JI = { 甲: '子午', 乙: '子午', 丙: '卯酉', 丁: '卯酉', 戊: '辰戌丑未', 己: '辰戌丑未', 庚: '寅亥', 辛: '寅亥', 壬: '巳申', 癸: '巳申' };
const WEN_CHANG = { 甲: '巳', 乙: '午', 丙: '申', 丁: '酉', 戊: '申', 己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯' };
const LU_SHEN = { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
const YANG_REN = { 甲: '卯', 乙: '寅', 丙: '午', 丁: '巳', 戊: '午', 己: '巳', 庚: '酉', 辛: '申', 壬: '子', 癸: '亥' };
const GROUP_RULES = [
  { name: '桃花', map: { 申子辰: '酉', 寅午戌: '卯', 巳酉丑: '午', 亥卯未: '子' } },
  { name: '驿马', map: { 申子辰: '寅', 寅午戌: '申', 巳酉丑: '亥', 亥卯未: '巳' } },
  { name: '华盖', map: { 申子辰: '辰', 寅午戌: '戌', 巳酉丑: '丑', 亥卯未: '未' } },
  { name: '将星', map: { 申子辰: '子', 寅午戌: '午', 巳酉丑: '酉', 亥卯未: '卯' } }
];
const HONG_LUAN = { 子: '卯', 丑: '寅', 寅: '丑', 卯: '子', 辰: '亥', 巳: '戌', 午: '酉', 未: '申', 申: '未', 酉: '午', 戌: '巳', 亥: '辰' };
const TIAN_XI = { 子: '酉', 丑: '申', 寅: '未', 卯: '午', 辰: '巳', 巳: '辰', 午: '卯', 未: '寅', 申: '丑', 酉: '子', 戌: '亥', 亥: '戌' };
const GU_GUA = [{ g: '亥子丑', gu: '寅', gua: '戌' }, { g: '寅卯辰', gu: '巳', gua: '丑' }, { g: '巳午未', gu: '申', gua: '辰' }, { g: '申酉戌', gu: '亥', gua: '未' }];
const TIAN_DE = { 寅: '丁', 卯: '申', 辰: '壬', 巳: '辛', 午: '亥', 未: '甲', 申: '癸', 酉: '寅', 戌: '丙', 亥: '乙', 子: '巳', 丑: '庚' };
const YUE_DE = { 寅午戌: '丙', 申子辰: '壬', 亥卯未: '甲', 巳酉丑: '庚' };

let state = { gender: 1, calendar: 'solar' };
let toastTimer = null;

document.addEventListener('DOMContentLoaded', init);

function init() {
  initSplash();
  initSelectors();
  bindEvents();
  renderHistory();
  renderFavorites();
}

function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 1100);
  }, 3000);
}

function initSelectors() {
  const now = new Date();
  fillSelect('yearSelect', 1900, now.getFullYear() + 1, now.getFullYear(), '年');
  fillSelect('monthSelect', 1, 12, now.getMonth() + 1, '月');
  updateDays();
  document.getElementById('daySelect').value = now.getDate();
  fillSelect('hourSelect', 0, 23, now.getHours(), '时');
  fillSelect('minuteSelect', 0, 59, now.getMinutes(), '分');
}

function fillSelect(id, start, end, selected, suffix) {
  const el = document.getElementById(id);
  if (!el) return;
  let html = '';
  for (let i = start; i <= end; i++) {
    const label = suffix === '年' ? `${i}${suffix}` : `${String(i).padStart(2, '0')}${suffix}`;
    html += `<option value="${i}"${i === selected ? ' selected' : ''}>${label}</option>`;
  }
  el.innerHTML = html;
}

function updateDays() {
  const y = Number(document.getElementById('yearSelect').value || new Date().getFullYear());
  const m = Number(document.getElementById('monthSelect').value || 1);
  const d = Number(document.getElementById('daySelect').value || 1);
  fillSelect('daySelect', 1, new Date(y, m, 0).getDate(), d, '日');
}

function bindEvents() {
  document.getElementById('yearSelect')?.addEventListener('change', updateDays);
  document.getElementById('monthSelect')?.addEventListener('change', updateDays);
  document.getElementById('calcBtn')?.addEventListener('click', calculate);
  document.getElementById('resultModalClose')?.addEventListener('click', closeResult);
  document.getElementById('shenshaModalClose')?.addEventListener('click', closeShensha);
  document.getElementById('resultModal')?.addEventListener('click', e => { if (e.target.id === 'resultModal') closeResult(); });
  document.getElementById('shenshaModal')?.addEventListener('click', e => { if (e.target.id === 'shenshaModal') closeShensha(); });
  document.querySelectorAll('#genderGroup .seg').forEach(btn => btn.addEventListener('click', () => {
    state.gender = Number(btn.dataset.gender);
    setActive('#genderGroup .seg', btn);
  }));
  document.querySelectorAll('#calendarGroup .seg').forEach(btn => btn.addEventListener('click', () => {
    state.calendar = btn.dataset.calendar;
    setActive('#calendarGroup .seg', btn);
  }));
  document.querySelectorAll('.bottom-nav-item').forEach(btn => btn.addEventListener('click', () => handleTab(btn.dataset.tab)));
  document.querySelectorAll('[data-mine-action]').forEach(btn => btn.addEventListener('click', () => handleMineAction(btn.dataset.mineAction)));
  document.addEventListener('click', e => {
    if (e.target.closest('[data-consult-action]')) openConsultModal();
  });
}

function setActive(selector, active) {
  document.querySelectorAll(selector).forEach(el => el.classList.toggle('active', el === active));
}

function calculate() {
  try {
    const data = buildChart();
    const html = renderResult(data);
    showResult(html);
    saveHistory(data, html);
    renderHistory();
  } catch (e) {
    console.error(e);
    showToast('排盘失败，请检查日期');
  }
}

function birth() {
  return ['yearSelect', 'monthSelect', 'daySelect', 'hourSelect', 'minuteSelect'].map(id => Number(document.getElementById(id).value));
}

function buildChart() {
  const [y, m, d, h, min] = birth();
  const name = document.getElementById('nameInput').value.trim();
  let lunar, solar;
  if (state.calendar === 'lunar') {
    lunar = Lunar.fromYmdHms(y, m, d, h, min, 0);
    solar = lunar.getSolar();
  } else {
    solar = Solar.fromYmdHms(y, m, d, h, min, 0);
    lunar = solar.getLunar();
  }
  const ec = lunar.getEightChar();
  const pillars = [
    pillar('年柱', ec.getYear(), ec.getYearShiShenGan(), ec.getYearHideGan(), ec.getYearShiShenZhi(), ec.getYearNaYin()),
    pillar('月柱', ec.getMonth(), ec.getMonthShiShenGan(), ec.getMonthHideGan(), ec.getMonthShiShenZhi(), ec.getMonthNaYin()),
    pillar('日柱', ec.getDay(), '日主', ec.getDayHideGan(), ec.getDayShiShenZhi(), ec.getDayNaYin()),
    pillar('时柱', ec.getTime(), ec.getTimeShiShenGan(), ec.getTimeHideGan(), ec.getTimeShiShenZhi(), ec.getTimeNaYin())
  ];
  const yun = ec.getYun(state.gender, 1);
  const dayun = yun.getDaYun(9).slice(1).map(x => ({
    ganZhi: x.getGanZhi(),
    shiShen: tenGod(ec.getDayGan(), x.getGanZhi()[0]),
    naYin: naYin(x.getGanZhi()),
    startYear: x.getStartYear(),
    endYear: x.getEndYear(),
    startAge: x.getStartAge(),
    endAge: x.getEndAge(),
    liuNian: x.getLiuNian(10).map(n => n.getGanZhi())
  }));
  const current = dayun.find(x => new Date().getFullYear() >= x.startYear && new Date().getFullYear() <= x.endYear);
  return {
    name,
    gender: state.gender === 1 ? '男' : '女',
    calendar: state.calendar === 'solar' ? '公历' : '农历',
    solarText: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${pad(solar.getHour())}:${pad(solar.getMinute())}`,
    lunarText: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}日 ${lunar.getTimeZhi()}时`,
    jieQiText: jieQiText(lunar, solar),
    pillars,
    shensha: shensha(pillars),
    taiYuan: ec.getTaiYuan(),
    mingGong: ec.getMingGong(),
    shenGong: ec.getShenGong(),
    yunStart: `${yun.getStartYear()}年${yun.getStartMonth()}个月${yun.getStartDay()}天起运`,
    yunDirection: yun.isForward() ? '顺行' : '逆行',
    currentDaYun: current ? current.ganZhi : '',
    dayun
  };
}

function pillar(name, gz, shi, hide, hideShi, nayin) {
  return { name, gz, gan: gz[0], zhi: gz[1], shishenGan: shi, hideGan: hide, shishenZhi: hideShi, nayin };
}

function renderResult(data) {
  return `<div class="bazi-paper">
    <div class="birth-lines">
      <div>出生时间：${data.calendar}${data.solarText}</div>
      <div>农历时间：${data.lunarText}</div>
      <div>${data.jieQiText}</div>
    </div>
    <div class="zao-line"><span>${data.gender === '男' ? '乾造' : '坤造'}：</span><span>${data.name || '未命名'}</span><span>${data.gender}</span></div>
    <div class="chart-grid bazi-columns">${data.pillars.map(p => `<div class="pillar ${p.name === '日柱' ? 'day-pillar' : ''}">
      <div class="pillar-name">${p.name}</div><div class="pillar-nayin">${p.nayin}</div><div class="pillar-shishen">${p.shishenGan}</div>
      <div class="pillar-gan">${p.gan}</div><div class="pillar-zhi">${p.zhi}</div>
      <div class="pillar-hidden">${p.hideGan.map((g, i) => `${g} ${p.shishenZhi[i] || ''}`).join('<br>')}</div>
    </div>`).join('')}</div>
    <div class="compact-info">
      <div><span>胎元：</span>${data.taiYuan}（${naYin(data.taiYuan)}）</div>
      <div><span>命宫：</span>${data.mingGong}（${naYin(data.mingGong)}）</div>
      <div><span>身宫：</span>${data.shenGong}（${naYin(data.shenGong)}）</div>
      <div><span>起运：</span>${data.yunStart}，${data.yunDirection}${data.currentDaYun ? `，当前：${data.currentDaYun}` : ''}</div>
    </div>
    <div class="result-actions">
      <button class="btn btn-light shensha-open" type="button">查看神煞</button>
      <button class="btn btn-light favorite-open" type="button">收藏命盘</button>
    </div>
    <button class="btn btn-light consult-entry" type="button" data-consult-action="bazi">专业人工解读</button>
    <div class="shensha-data" hidden>${renderShenshaDetail(data)}</div>
    <div class="result-section"><h4 class="result-section-title">大运流年</h4><div class="dayun-scroll"><div class="dayun-matrix">
      <div class="dayun-head">十神</div>${data.dayun.map(x => `<div class="dayun-cell ${x.ganZhi === data.currentDaYun ? 'current' : ''}">${x.shiShen}</div>`).join('')}
      <div class="dayun-head">大运</div>${data.dayun.map(x => `<div class="dayun-cell dayun-gz ${x.ganZhi === data.currentDaYun ? 'current' : ''}">${x.ganZhi}</div>`).join('')}
      <div class="dayun-head">虚岁</div>${data.dayun.map(x => `<div class="dayun-cell">${x.startAge}</div>`).join('')}
      <div class="dayun-head">年份</div>${data.dayun.map(x => `<div class="dayun-cell">${x.startYear}</div>`).join('')}
      <div class="dayun-head">纳音</div>${data.dayun.map(x => `<div class="dayun-cell small">${x.naYin}</div>`).join('')}
      <div class="dayun-head">流年</div>${data.dayun.map(x => `<div class="dayun-cell liunian ${x.ganZhi === data.currentDaYun ? 'current' : ''}">${x.liuNian.join('<br>')}</div>`).join('')}
    </div></div></div>
  </div>`;
}

function jieQiText(lunar, solar) {
  try {
    const prev = lunar.getPrevJie();
    const next = lunar.getNextJie();
    const ps = prev.getSolar();
    const cur = Solar.fromYmd(solar.getYear(), solar.getMonth(), solar.getDay());
    const pd = Solar.fromYmd(ps.getYear(), ps.getMonth(), ps.getDay());
    return `出生于${prev.getName()}后第${cur.subtract(pd)}日，${next.getName()}前`;
  } catch {
    return '节气：以当日节令为准';
  }
}

function shensha(pillars) {
  const yearZhi = pillars[0].zhi;
  const monthZhi = pillars[1].zhi;
  const dayGan = pillars[2].gan;
  const dayZhi = pillars[2].zhi;
  return pillars.map(p => {
    const list = [];
    add(list, TIAN_YI[dayGan]?.includes(p.zhi), '天乙贵人');
    add(list, TAI_JI[dayGan]?.includes(p.zhi), '太极贵人');
    add(list, WEN_CHANG[dayGan] === p.zhi, '文昌贵人');
    add(list, LU_SHEN[dayGan] === p.zhi, '禄神');
    add(list, YANG_REN[dayGan] === p.zhi, '羊刃');
    GROUP_RULES.forEach(r => {
      add(list, groupValue(r.map, yearZhi) === p.zhi, r.name);
      add(list, groupValue(r.map, dayZhi) === p.zhi, r.name);
    });
    add(list, HONG_LUAN[yearZhi] === p.zhi, '红鸾');
    add(list, TIAN_XI[yearZhi] === p.zhi, '天喜');
    GU_GUA.forEach(r => { if (r.g.includes(yearZhi)) { add(list, r.gu === p.zhi, '孤辰'); add(list, r.gua === p.zhi, '寡宿'); } });
    add(list, groupValue(YUE_DE, monthZhi) === p.gan, '月德贵人');
    add(list, TIAN_DE[monthZhi] === p.gan || TIAN_DE[monthZhi] === p.zhi, '天德贵人');
    return { name: p.name, gz: p.gz, items: [...new Set(list)] };
  });
}

function renderShenshaDetail(data) {
  return `<div class="bazi-paper shensha-detail">
    <div class="birth-lines">
      <div>出生时间：${data.calendar}${data.solarText}</div>
      <div>农历时间：${data.lunarText}</div>
      <div>${data.jieQiText}</div>
    </div>
    <div class="zao-line"><span>${data.gender === '男' ? '乾造' : '坤造'}：</span><span>${data.name || '未命名'}</span><span>${data.gender}</span></div>
    <div class="chart-grid bazi-columns shensha-pillars">
      ${data.pillars.map((p, i) => {
        const ss = data.shensha[i];
        return `<div class="pillar ${p.name === '日柱' ? 'day-pillar' : ''}">
          <div class="pillar-name">${p.name}</div>
          <div class="pillar-nayin">${p.nayin}</div>
          <div class="pillar-shishen">${p.shishenGan}</div>
          <div class="pillar-gan">${p.gan}</div>
          <div class="pillar-zhi">${p.zhi}</div>
          <div class="pillar-hidden">${p.hideGan.map((g, idx) => `${g} ${p.shishenZhi[idx] || ''}`).join('<br>')}</div>
          <div class="pillar-shensha">${ss.items.map(x => `<span>${x}</span>`).join('')}</div>
        </div>`;
      }).join('')}
    </div>
    <div class="compact-info">
      <div><span>胎元：</span>${data.taiYuan}（${naYin(data.taiYuan)}）</div>
      <div><span>命宫：</span>${data.mingGong}（${naYin(data.mingGong)}）</div>
      <div><span>身宫：</span>${data.shenGong}（${naYin(data.shenGong)}）</div>
      <div><span>起运：</span>${data.yunStart}，${data.yunDirection}${data.currentDaYun ? `，当前：${data.currentDaYun}` : ''}</div>
    </div>
  </div>`;
}

function add(arr, ok, value) { if (ok) arr.push(value); }
function groupValue(map, zhi) { return Object.keys(map).find(k => k.includes(zhi)) ? map[Object.keys(map).find(k => k.includes(zhi))] : ''; }
function naYin(gz) { return typeof LunarUtil !== 'undefined' && LunarUtil.NAYIN ? LunarUtil.NAYIN[gz] || '' : ''; }
function tenGod(dayGan, targetGan) {
  const a = GAN_WUXING[dayGan], b = GAN_WUXING[targetGan], same = GAN_YINYANG[dayGan] === GAN_YINYANG[targetGan];
  if (!a || !b) return '';
  if (a === b) return same ? '比肩' : '劫财';
  if (SHENG[a] === b) return same ? '食神' : '伤官';
  if (SHENG[b] === a) return same ? '偏印' : '正印';
  if (KE[a] === b) return same ? '偏财' : '正财';
  if (KE[b] === a) return same ? '七杀' : '正官';
  return '';
}

function showResult(html) {
  const inline = document.getElementById('inlineResult');
  const card = document.getElementById('inlineResultCard');
  if (inline && card) {
    inline.innerHTML = html;
    card.classList.add('show');
    inline.querySelector('.shensha-open')?.addEventListener('click', openShensha);
    inline.querySelector('.favorite-open')?.addEventListener('click', favoriteCurrent);
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    return;
  }
  document.getElementById('resultContent').innerHTML = html;
  document.getElementById('resultModal').classList.add('active');
  document.querySelector('#resultContent .shensha-open')?.addEventListener('click', openShensha);
  document.querySelector('#resultContent .favorite-open')?.addEventListener('click', favoriteCurrent);
}
function closeResult() { document.getElementById('resultModal')?.classList.remove('active'); }
function openShensha() {
  document.getElementById('shenshaContent').innerHTML =
    document.querySelector('#inlineResult .shensha-data')?.innerHTML ||
    document.querySelector('#resultContent .shensha-data')?.innerHTML ||
    '';
  document.getElementById('shenshaModal')?.classList.add('active');
}
function closeShensha() { document.getElementById('shenshaModal')?.classList.remove('active'); }

function saveHistory(data, html) {
  const list = loadHistory();
  list.unshift({ id: Date.now(), name: data.name || '未命名', date: data.solarText, gz: data.pillars.map(p => p.gz).join(' '), html });
  if (list.length > 80) list.length = 80;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}
function loadHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } }
function loadFavorites() { try { return JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]'); } catch { return []; } }
function renderHistory() {
  const list = loadHistory(), root = document.getElementById('historyList');
  if (!root) return;
  root.innerHTML = list.length ? list.map(x => `<button class="mine-row history-row" data-id="${x.id}"><span>${x.name}<br><span class="mine-row-note">${x.gz}</span></span><span class="mine-row-note">${x.date}</span></button>`).join('') : '<div class="history-empty">还没有历史排盘<br>完成一次排盘后会自动保存</div>';
  root.querySelectorAll('.history-row').forEach(btn => btn.addEventListener('click', () => {
    const item = loadHistory().find(x => String(x.id) === String(btn.dataset.id));
    if (item) showResult(item.html);
  }));
}

function favoriteCurrent() {
  const html = document.getElementById('inlineResult')?.innerHTML || document.getElementById('resultContent')?.innerHTML || '';
  const title = (document.querySelector('#inlineResult .zao-line') || document.querySelector('#resultContent .zao-line'))?.innerText.replace(/\s+/g, ' ') || '八字命盘';
  if (!html) return;
  const list = loadFavorites();
  list.unshift({ id: Date.now(), title, date: new Date().toLocaleString(), html });
  if (list.length > 60) list.length = 60;
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(list));
  renderFavorites();
  showToast('已收藏');
}

function renderFavorites() {
  const list = loadFavorites(), root = document.getElementById('favoriteList');
  if (!root) return;
  root.innerHTML = list.length ? list.map(x => `<button class="mine-row favorite-row" data-id="${x.id}"><span>${x.title}<br><span class="mine-row-note">${x.date}</span></span><span class="mine-row-note">查看</span></button>`).join('') : '<div class="history-empty">还没有收藏的命盘<br>排盘结果里点「收藏命盘」即可保存</div>';
  root.querySelectorAll('.favorite-row').forEach(btn => btn.addEventListener('click', () => {
    const item = loadFavorites().find(x => String(x.id) === String(btn.dataset.id));
    if (item) showResult(item.html);
  }));
}

function handleTab(tab) {
  document.querySelectorAll('.bottom-nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  document.getElementById('pageChart')?.classList.toggle('active', tab === 'chart');
  document.getElementById('pageHistory')?.classList.toggle('active', tab === 'history');
  document.getElementById('pageFavorites')?.classList.toggle('active', tab === 'favorites');
  document.getElementById('pageMine')?.classList.toggle('active', tab === 'mine');
  if (tab === 'history') renderHistory();
  if (tab === 'favorites') renderFavorites();
}
function handleMineAction(action) {
  if (action === 'open-calendar') return location.href = '../index.html';
  if (action === 'open-liuyao') return location.href = '../liuyao/';
  if (action === 'consult') return openConsultModal();
  if (action === 'feedback') return writeClipboard(FEEDBACK_EMAIL, '反馈邮箱已复制');
  if (action === 'email') return location.href = 'mailto:' + FEEDBACK_EMAIL + '?subject=' + encodeURIComponent('玄枢八字反馈 ' + APP_VERSION);
  if (action === 'wechat') return writeClipboard(WECHAT_ID, '微信号已复制');
  if (action === 'share-app') return shareApp();
}
function openConsult() {
  writeClipboard(WECHAT_ID, '微信号已复制，可添加咨询命盘');
}
function openConsultModal() {
  document.getElementById('consultModal')?.remove();
  const modal = document.createElement('div');
  modal.className = 'consult-modal active';
  modal.id = 'consultModal';
  modal.innerHTML = `<div class="consult-modal-panel">
    <div class="consult-modal-head">
      <h3>命盘详解咨询</h3>
      <button class="consult-modal-close" type="button">×</button>
    </div>
    <div class="consult-modal-body">
      <p>可添加微信咨询命盘详解：${WECHAT_ID}</p>
      <p>传统民俗文化参考，不替代医疗、法律、投资等专业建议。</p>
      <button class="btn btn-primary" type="button" data-consult-copy>复制微信号</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('.consult-modal-close')) modal.remove();
    if (e.target.closest('[data-consult-copy]')) openConsult();
  });
}
function writeClipboard(text, msg) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(() => fallbackCopy(text, msg));
  fallbackCopy(text, msg);
}
function fallbackCopy(text, msg) {
  const input = document.createElement('input');
  input.value = text;
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  document.body.appendChild(input);
  input.select();
  try { document.execCommand('copy'); showToast(msg); } catch { showToast(text); }
  input.remove();
}
function shareApp() {
  const url = location.href.split('?')[0];
  if (navigator.share) return navigator.share({ title: '玄枢八字', text: '玄枢八字：定四柱，观五行。', url }).catch(() => {});
  writeClipboard(url, '链接已复制');
}
function showToast(text) {
  const el = document.getElementById('appToast');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}
function pad(n) { return String(n).padStart(2, '0'); }
