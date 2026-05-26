/**
 * 玄枢八字合婚 - 应用逻辑
 */
(function() {
  'use strict';

  // ===== 状态 =====
  var state = { mCalendar: 'solar', fCalendar: 'solar' };

  // ===== Splash =====
  setTimeout(function() {
    var s = document.getElementById('splash');
    if (s) s.classList.add('hide');
    var a = document.getElementById('app');
    if (a) a.classList.add('show');
  }, 900);

  // ===== 初始化下拉菜单 =====
  function populateSelects() {
    var now = new Date(), cy = now.getFullYear();
    ['m','f'].forEach(function(pf) {
      var y = document.getElementById(pf+'Year');
      for (var i = cy; i >= 1900; i--) { var o = document.createElement('option'); o.value = i; o.textContent = i; if(i===(pf==='m'?1990:1992)) o.selected = true; y.appendChild(o); }
      var mo = document.getElementById(pf+'Month');
      for (var i = 1; i <= 12; i++) { var o = document.createElement('option'); o.value = i; o.textContent = i + '月'; if(i===(pf==='m'?5:8)) o.selected = true; mo.appendChild(o); }
      updateDaySelect(pf);
      var h = document.getElementById(pf+'Hour');
      for (var i = 0; i <= 23; i++) { var o = document.createElement('option'); o.value = i; o.textContent = i + '时'; if(i===(pf==='m'?10:14)) o.selected = true; h.appendChild(o); }
      var mi = document.getElementById(pf+'Minute');
      for (var i = 0; i <= 59; i++) { var o = document.createElement('option'); o.value = i; o.textContent = i + '分'; mi.appendChild(o); }
      refreshDateInfo(pf);
    });
  }
  populateSelects();

  function updateDaySelect(pf) {
    var y = parseInt(document.getElementById(pf+'Year').value) || 2000;
    var m = parseInt(document.getElementById(pf+'Month').value) || 1;
    var days = new Date(y, m, 0).getDate();
    var curD = parseInt(document.getElementById(pf+'Day').value) || 1;
    if (curD > days) curD = days;
    var dd = document.getElementById(pf+'Day'); dd.innerHTML = '';
    for (var i = 1; i <= days; i++) { var o = document.createElement('option'); o.value = i; o.textContent = i; if(i===curD) o.selected = true; dd.appendChild(o); }
  }

  // ===== 历法切换 =====
  document.querySelectorAll('.segmented').forEach(function(sg) {
    sg.addEventListener('click', function(e) {
      var btn = e.target.closest('.seg');
      if (!btn) return;
      sg.querySelectorAll('.seg').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var pf = sg.id === 'mCalendarGroup' ? 'm' : 'f';
      state[pf + 'Calendar'] = btn.dataset.calendar;
      refreshDateInfo(pf);
    });
  });

  // 年月日 change 时更新天数+刷新日期信息
  ['m','f'].forEach(function(pf) {
    document.getElementById(pf+'Year').addEventListener('change', function() { updateDaySelect(pf); refreshDateInfo(pf); });
    document.getElementById(pf+'Month').addEventListener('change', function() { updateDaySelect(pf); refreshDateInfo(pf); });
    document.getElementById(pf+'Day').addEventListener('change', function() { refreshDateInfo(pf); });
    document.getElementById(pf+'Hour').addEventListener('change', function() { refreshDateInfo(pf); });
    document.getElementById(pf+'Minute').addEventListener('change', function() { refreshDateInfo(pf); });
  });

  // ===== 读取表单值 =====
  function getVal(prefix) {
    var cal = state[prefix + 'Calendar'];
    var y = parseInt(document.getElementById(prefix+'Year').value);
    var m = parseInt(document.getElementById(prefix+'Month').value);
    var d = parseInt(document.getElementById(prefix+'Day').value);
    var h = parseInt(document.getElementById(prefix+'Hour').value);
    var mi = parseInt(document.getElementById(prefix+'Minute').value) || 0;

    var solarDate, lunarDate;
    if (cal === 'lunar') {
      var ln = Lunar.fromYmdHms(y, m, d, h, mi, 0);
      var sd = ln.getSolar();
      solarDate = { year: sd.getYear(), month: sd.getMonth(), day: sd.getDay(), hour: h, minute: mi };
      lunarDate = { year: y, month: m, day: d, hour: h, minute: mi, cnText: ln.getYearInChinese() + '年' + ln.getMonthInChinese() + '月' + ln.getDayInChinese() + '日 ' + ln.getTimeZhi() + '时' };
    } else {
      var sd = Solar.fromYmdHms(y, m, d, h, mi, 0);
      var ln = sd.getLunar();
      solarDate = { year: y, month: m, day: d, hour: h, minute: mi };
      lunarDate = { year: ln.getYear(), month: ln.getMonth(), day: ln.getDay(), hour: h, minute: mi, cnText: ln.getYearInChinese() + '年' + ln.getMonthInChinese() + '月' + ln.getDayInChinese() + '日 ' + ln.getTimeZhi() + '时' };
    }

    return {
      name: document.getElementById(prefix + 'Name').value || (prefix === 'm' ? '男方' : '女方'),
      year: solarDate.year, month: solarDate.month, day: solarDate.day, hour: solarDate.hour, minute: solarDate.minute,
      calendar: cal === 'lunar' ? '农历' : '公历',
      solarText: solarDate.year + '年' + solarDate.month + '月' + solarDate.day + '日 ' + solarDate.hour + '时' + solarDate.minute + '分',
      lunarText: lunarDate.cnText,
    };
  }

  function refreshDateInfo(pf) {
    var di = document.getElementById(pf + 'DateInfo');
    if (!di) return;
    try {
      var v = getVal(pf);
      di.innerHTML = '📅 ' + v.calendar + '：' + v.solarText + '<br>🌙 农历：' + v.lunarText;
      di.classList.add('show');
    } catch(e) {
      di.innerHTML = '';
      di.classList.remove('show');
    }
  }

  // ===== 引擎 =====
  var eng = new BaZiHeHunEngine();

  // ===== 按钮事件 =====
  document.getElementById('calcBtn').addEventListener('click', function() {
    if (typeof trackEvent === 'function') trackEvent('xuanshu_hehun_click', '八字合婚');
    try {
      var m = getVal('m'), f = getVal('f');
      if (!m.year || isNaN(m.year) || !f.year || isNaN(f.year)) { alert('请完整填写双方出生年月日'); return; }
      m.birthInfo = { solarText: m.solarText, lunarText: m.lunarText };
      f.birthInfo = { solarText: f.solarText, lunarText: f.lunarText };
      var result = eng.heHun(m, f);
      renderAll(result);
      document.getElementById('resultArea').className = 'result-show';
      document.getElementById('resultArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch(e) {
      console.error('合婚错误:', e);
      document.getElementById('resultArea').className = 'result-show';
      document.getElementById('resultArea').innerHTML = '<div class="card" style="padding:20px;text-align:center;color:#c0392b">❌ 计算出错：' + (e.message || '未知错误') + '<br><small>请检查输入是否完整，或刷新重试</small></div>';
    }
  });

  // ===== 渲染 =====
  function renderAll(r) {
    renderLayer1(r);
    renderLayer2(r);
    renderLayer3(r);
  }

  function renderLayer1(r) {
    var bx = r.baXing;
    var icon = bx.info.type === '吉' ? '⭐' : bx.info.type === '中' ? '✨' : '💔';
    var bgClass = bx.info.type === '吉' ? 'layer1-icon-bg-ji' : bx.info.type === '中' ? 'layer1-icon-bg-zhong' : 'layer1-icon-bg-xiong';

    var h = '<div class="layer1-card ' + bgClass + '">';
    h += '<div class="star-icon">' + icon + '</div>';
    h += '<div class="star-name">' + bx.starName + '婚</div>';
    h += '<div class="star-level">' + bx.info.label + ' · ' + bx.info.desc + '</div>';
    h += '<div class="koujue-box">' + (bx.koujue || '') + '</div>';
    h += '<div class="dongxi-info">';
    h += '男方：' + bx.maleDongXi + '（' + r.maleGua.guaName + '卦） | 女方：' + bx.femaleDongXi + '（' + r.femaleGua.guaName + '卦）<br>';
    h += bx.dongXiMatch ? '✅ 东西四命一致，基调相容' : '⚠️ 东西四命不一致，需八字五行强补';
    h += '</div></div>';
    document.getElementById('layer1Card').innerHTML = h;
  }

  function renderLayer2(r) {
    var h = '<div class="detail-card">';

    // 出生信息（公历+农历）
    h += '<h3>📅 出生信息</h3>';
    h += '<div class="birth-info-grid">';
    h += '<div class="birth-info-box"><span class="birth-label">♂ 男方</span><span class="birth-text">' + r.maleBirthInfo.solarText + '</span><span class="birth-lunar">农历：' + r.maleBirthInfo.lunarText + '</span></div>';
    h += '<div class="birth-info-box"><span class="birth-label">♀ 女方</span><span class="birth-text">' + r.femaleBirthInfo.solarText + '</span><span class="birth-lunar">农历：' + r.femaleBirthInfo.lunarText + '</span></div>';
    h += '</div>';

    // 八字排盘
    h += '<h3>📋 双方八字排盘</h3>';
    h += '<div class="bazi-grid">';
    h += makeBaziTable(r.maleBazi, r.maleShiShen, '♂ 男方');
    h += makeBaziTable(r.femaleBazi, r.femaleShiShen, '♀ 女方');
    h += '</div>';

    // 生肖
    h += '<h3>🐾 生肖关系</h3>';
    h += '<div class="result-row"><span class="rv">' + r.shengXiao.detail + '</span></div>';

    // 纳音
    h += '<h3>🔥 纳音五行</h3>';
    h += '<div class="result-row"><span class="rv">男方年柱纳音：' + eng.getNaYin(r.maleBazi.nian.ganZhi) + ' | 女方年柱纳音：' + eng.getNaYin(r.femaleBazi.nian.ganZhi) + '</span></div>';

    // 日主关系
    h += '<h3>☀️ 日主关系</h3>';
    h += '<div class="result-row"><span class="rv">' + r.riZhuGuanXi.detail + '</span></div>';

    // 日干详情
    h += '<div class="result-row">';
    h += '<span class="rl">男方日干：</span><span class="rv">' + r.maleBazi.ri.gan + '（' + BaZiData.tianGanWuXing[r.maleBazi.ri.gan] + '）</span> | ';
    h += '<span class="rl">女方日干：</span><span class="rv">' + r.femaleBazi.ri.gan + '（' + BaZiData.tianGanWuXing[r.femaleBazi.ri.gan] + '）</span>';
    h += '</div>';

    // 夫妻宫
    h += '<h3>🏮 夫妻宫（日支）</h3>';
    h += '<div class="result-row"><span class="rl">男方日支：</span><span class="rv">' + r.maleBazi.ri.zhi + '</span>';
    h += ' | <span class="rl">女方日支：</span><span class="rv">' + r.femaleBazi.ri.zhi + '</span></div>';
    h += '<div class="result-row"><span class="rv">' + r.fuQiGong.detail + '</span>';
    var fqTag = r.fuQiGong.good ? '<span class="tag tag-ji">吉</span>' : '<span class="tag tag-xiong">注意</span>';
    h += fqTag + '</div>';

    // 十神
    h += '<h3>🪷 十神分析</h3>';
    h += '<div class="result-row"><span class="rv">' + r.shiShenMatch.matchDesc + '</span></div>';
    var mSS = r.maleShiShen, fSS = r.femaleShiShen;
    h += '<div class="result-row" style="font-size:0.82em;color:var(--muted)">';
    h += '男方财星(' + r.shiShenMatch.maleDetails.caiCount + '个): ' + r.shiShenMatch.maleDetails.caiList.join('、') + ' | ';
    h += '女方官星(' + r.shiShenMatch.femaleDetails.guanCount + '个): ' + r.shiShenMatch.femaleDetails.guanList.join('、');
    h += '</div>';

    // 全局地支合冲
    h += '<h3>🌏 全局地支合冲刑害</h3>';
    var g = r.globalDiZhi;
    h += '<div class="stats-row">';
    h += '<div class="stat-item good"><span class="num">' + g.he.length + '</span><span class="lbl">六合</span></div>';
    h += '<div class="stat-item good"><span class="num">' + g.sanhe.length + '</span><span class="lbl">三合</span></div>';
    h += '<div class="stat-item bad"><span class="num">' + g.chong.length + '</span><span class="lbl">六冲</span></div>';
    h += '<div class="stat-item bad"><span class="num">' + g.hai.length + '</span><span class="lbl">六害</span></div>';
    h += '<div class="stat-item bad"><span class="num">' + g.xing.length + '</span><span class="lbl">三刑</span></div>';
    h += '<div class="stat-item ' + (g.balance >= 0 ? 'good' : 'bad') + '"><span class="num">' + (g.balance > 0 ? '+' : '') + g.balance + '</span><span class="lbl">合冲差</span></div>';
    h += '</div>';
    h += '<div style="font-size:0.8em;color:var(--muted);margin-top:6px">';
    if (g.he.length) h += '六合：' + g.he.join('、') + ' ';
    if (g.sanhe.length) h += '三合：' + g.sanhe.join('、') + ' ';
    if (g.chong.length) h += '六冲：' + g.chong.join('、') + ' ';
    if (g.hai.length) h += '六害：' + g.hai.join('、') + ' ';
    if (g.xing.length) h += '三刑：' + g.xing.join('、') + ' ';
    h += '</div>';

    // 五行统计
    h += '<h3>🌳 五行分布</h3>';
    h += '<div class="result-row"><span class="rv">男方：' + Object.entries(r.maleWuXing).sort(function(a,b){return b[1]-a[1]}).map(function(p){return p[0]+p[1]}).join(' ') + '</span></div>';
    h += '<div class="result-row"><span class="rv">女方：' + Object.entries(r.femaleWuXing).sort(function(a,b){return b[1]-a[1]}).map(function(p){return p[0]+p[1]}).join(' ') + '</span></div>';

    // 旺衰
    h += '<h3>⚖️ 日主旺衰</h3>';
    h += '<div class="result-row"><span class="rv">男方：' + r.maleWangShuai.status + '（得分 ' + r.maleWangShuai.score + '）</span></div>';
    h += '<div class="result-row"><span class="rv">女方：' + r.femaleWangShuai.status + '（得分 ' + r.femaleWangShuai.score + '）</span></div>';
    h += '<div class="disclaimer" style="font-size:0.78em;color:var(--gold);margin-top:4px">' + r.maleWangShuai.confidence + '</div>';

    h += '</div>';
    document.getElementById('layer2Card').innerHTML = h;
  }

  function makeBaziTable(bazi, shiShen, title) {
    var h = '<div style="margin-bottom:8px">';
    h += '<div style="font-size:0.85em;color:var(--muted);margin-bottom:4px;text-align:center">' + title + '</div>';
    h += '<table class="bazi-table">';
    h += '<tr><th></th><th>年柱</th><th>月柱</th><th>日柱</th><th>时柱</th></tr>';
    h += '<tr><td style="font-weight:bold">天干</td>';
    h += '<td class="gz">' + bazi.nian.gan + '</td><td class="gz">' + bazi.yue.gan + '</td><td class="gz">' + bazi.ri.gan + '</td><td class="gz">' + bazi.shi.gan + '</td>';
    h += '</tr><tr><td style="font-weight:bold">地支</td>';
    h += '<td class="gz">' + bazi.nian.zhi + '</td><td class="gz">' + bazi.yue.zhi + '</td><td class="gz">' + bazi.ri.zhi + '</td><td class="gz">' + bazi.shi.zhi + '</td>';
    h += '</tr><tr><td style="font-weight:bold">十神</td>';
    h += '<td class="ss">' + shiShen.nian + '</td><td class="ss">' + shiShen.yue + '</td><td class="ss">' + shiShen.ri + '</td><td class="ss">' + shiShen.shi + '</td>';
    h += '</tr><tr><td style="font-weight:bold">纳音</td>';
    h += '<td class="ny">' + eng.getNaYin(bazi.nian.ganZhi) + '</td><td class="ny">' + eng.getNaYin(bazi.yue.ganZhi) + '</td><td class="ny">' + eng.getNaYin(bazi.ri.ganZhi) + '</td><td class="ny">' + eng.getNaYin(bazi.shi.ganZhi) + '</td>';
    h += '</tr></table></div>';
    return h;
  }

  function renderLayer3(r) {
    var h = '<div class="final-card">';
    h += '<h3>📊 综合评定</h3>';

    // 评级
    h += '<div class="grade-display">';
    h += '<div class="stars">' + Array(r.stars + 1).join('⭐') + '</div>';
    h += '<div class="grade-text">' + r.grade + '</div>';
    h += '<div class="score">综合评分：' + r.totalScore + '/100</div>';
    h += '</div>';

    // 权重表
    h += '<table class="weight-table">';
    h += '<tr><th>维度</th><th>得分</th><th>权重</th></tr>';
    var bxScore = r.baXing.info.type==='吉' ? 8 : r.baXing.info.type==='中' ? 4 : 0;
    h += '<tr><td>九星合婚</td><td>' + bxScore + '/8</td><td>8%</td></tr>';
    var rzScore = r.riZhuGuanXi.type === '天干五合' ? 10 : r.riZhuGuanXi.type === '相生' ? 8 : r.riZhuGuanXi.type === '比和' ? 5 : 2;
    h += '<tr><td>日主关系</td><td>' + rzScore + '/10</td><td>10%</td></tr>';
    h += '<tr><td>夫妻宫</td><td>' + (r.fuQiGong.good ? '30/30' : '0/30') + '</td><td>30%</td></tr>';
    var sxScore = (r.shengXiao.type==='六合'||r.shengXiao.type==='三合') ? 1 : (r.shengXiao.type==='六冲'||r.shengXiao.type==='六害') ? -1 : 0;
    h += '<tr><td>生肖</td><td>' + (sxScore > 0 ? '+' : '') + sxScore + '/1</td><td>1%</td></tr>';
    var ssScore = r.shiShenMatch.matchLevel === '上' ? 5 : r.shiShenMatch.matchLevel === '中' ? 2 : 0;
    h += '<tr><td>十神匹配</td><td>' + ssScore + '/5</td><td>5%</td></tr>';
    var dzScore = r.globalDiZhi.balance >= 2 ? 15 : r.globalDiZhi.balance >= 0 ? 10 : r.globalDiZhi.balance >= -2 ? 5 : 0;
    h += '<tr><td>全局地支</td><td>' + dzScore + '/15</td><td>15%</td></tr>';
    var wxScore = r.wxHubu.complementLevel === '上' ? 3 : r.wxHubu.complementLevel === '中' ? 1 : 0;
    h += '<tr><td>五行互补</td><td>' + wxScore + '/3</td><td>3%</td></tr>';
    h += '<tr><td>喜用神</td><td>12/25</td><td>25%</td></tr>';
    h += '</table>';

    // 五行互补
    h += '<div class="info-box">';
    h += '<div class="ib-label">🔄 五行互补倾向</div>';
    h += '<div class="ib-value">' + r.wxHubu.complement + '</div>';
    h += '</div>';

    // 喜用神
    h += '<div class="info-box">';
    h += '<div class="ib-label">☯️ 喜用神建议</div>';
    h += '<div class="ib-value">男方日主' + r.maleXiYong.riWx + '（' + r.maleXiYong.wangShuai + '），喜用神：' + r.maleXiYong.xiYong + '</div>';
    h += '<div class="ib-value">女方日主' + r.femaleXiYong.riWx + '（' + r.femaleXiYong.wangShuai + '），喜用神：' + r.femaleXiYong.xiYong + '</div>';
    h += '<div class="disclaimer">' + r.maleXiYong.confidence + '</div>';
    h += '</div>';

    // 最终评语
    var verdict = '', verdictClass = '';
    if (r.totalScore >= 80) {
      verdict = '🎉 上上等婚配！九星得吉，夫妻宫安泰，八字相合，家业昌盛。天作之合，白头偕老。';
      verdictClass = 'good';
    } else if (r.totalScore >= 65) {
      verdict = '👍 上等婚配！整体运势良好，虽有瑕疵但无大碍。互相理解包容，可得美满姻缘。';
      verdictClass = 'good';
    } else if (r.totalScore >= 50) {
      verdict = '👌 中等婚配。根基尚可，需注意冲克之处。多沟通、多包容，可化解。';
      verdictClass = 'good';
    } else if (r.totalScore >= 35) {
      verdict = '⚠️ 需谨慎考虑。九星和八字均有不足，建议咨询专业命理师综合分析，切勿草率。';
      verdictClass = 'caution';
    } else {
      verdict = '❌ 不建议此婚配。多项指标不佳，日支相冲，九星凶配，长期风险较高。';
      verdictClass = 'caution';
    }
    h += '<div class="verdict-box ' + verdictClass + '">' + verdict + '</div>';

    h += '</div>';
    document.getElementById('layer3Card').innerHTML = h;
  }

})();
