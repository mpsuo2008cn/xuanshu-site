/**
 * 八字合婚 - 核心算法模块
 */

class BaZiHeHunEngine {
  constructor() {
    this.d = BaZiData;
  }

  tgIndex(tg) { return this.d.tiangan.indexOf(tg); }
  dzIndex(dz) { return this.d.dizhi.indexOf(dz); }

  isBeforeLichun(year, month, day) {
    const ls = this.d.lichunDates[year];
    if (!ls) return false;
    const [lm, ld] = ls.split('-').map(Number);
    if (month < lm) return true;
    if (month > lm) return false;
    return day < ld;
  }

  computeMingGua(birthYear, gender, birthMonth, birthDay) {
    let year = birthYear;
    if (this.isBeforeLichun(year, birthMonth, birthDay)) year -= 1;
    const lastTwo = year % 100;
    let guaNum = gender === 'male' ? (100 - lastTwo) % 9 : (lastTwo - 4) % 9;
    if (guaNum === 0) guaNum = 9;
    if (guaNum === 5) guaNum = gender === 'male' ? 2 : 8;
    return { year, guaNum, guaName: this.d.mingGuaName[guaNum], wuxing: this.d.mingGuaWuXing[guaNum], dongXi: this.d.dongXiMing[guaNum] };
  }

  getBaXingResult(maleGua, femaleGua) {
    const row = this.d.baXingIndex[maleGua], col = this.d.baXingIndex[femaleGua];
    const starName = this.d.baXingTable[row][col];
    return { starName, info: this.d.baXing[starName], koujue: this.d.koujue[starName+'婚'], maleDongXi: this.d.dongXiMing[maleGua], femaleDongXi: this.d.dongXiMing[femaleGua], dongXiMatch: this.d.dongXiMing[maleGua]===this.d.dongXiMing[femaleGua] };
  }

  getYueZhi(year, month, day) {
    const jq = {2:{d:4},3:{d:6},4:{d:5},5:{d:6},6:{d:6},7:{d:7},8:{d:7},9:{d:8},10:{d:8},11:{d:7},12:{d:7},1:{d:6}};
    let yueIndex;
    for (let m = 2; m <= 12; m++) {
      if (month === m) { yueIndex = day >= jq[m].d ? this.d.yueZhiMap[m] : this.d.yueZhiMap[m-1]; break; }
    }
    if (month === 1) yueIndex = day >= jq[1].d ? this.d.yueZhiMap[1] : this.d.yueZhiMap[12];
    if (yueIndex === undefined) yueIndex = (month + 1) % 12;
    return { index: yueIndex, name: this.d.dizhi[yueIndex] };
  }

  getNianZhu(year, month, day) {
    let ly = year;
    if (this.isBeforeLichun(year, month, day)) ly -= 1;
    const idx = (ly - 4) % 60;
    if (idx < 0) return { gan:'甲', zhi:'子', ganZhiIndex:0, ganZhi:'甲子', year:ly };
    return { gan: this.d.tiangan[idx%10], zhi:this.d.dizhi[idx%12], ganZhiIndex:idx, ganZhi:this.d.tiangan[idx%10]+this.d.dizhi[idx%12], year:ly };
  }

  getYueZhu(nianGan, month, day) {
    const yi = this.getYueZhi(0, month, day);
    const offset = (yi.index - 2 + 12) % 12;
    const gi = (this.tgIndex(this.d.wuHuDun[nianGan]) + offset) % 10;
    return { gan: this.d.tiangan[gi], zhi: yi.name, ganZhi: this.d.tiangan[gi] + yi.name };
  }

  getRiZhu(year, month, day) {
    // 基准日: 2000-01-07 = 甲子日（六十甲子序号0）
    const base = new Date(2000,0,7), target = new Date(year,month-1,day);
    const diff = Math.round((target - base) / 864e5);
    const idx = ((diff % 60) + 60) % 60;
    return { gan: this.d.tiangan[idx%10], zhi:this.d.dizhi[idx%12], ganZhi:this.d.tiangan[idx%10]+this.d.dizhi[idx%12] };
  }

  getShiChen(hour) {
    if (hour >= 23 || hour < 1) return {index:0,name:'子'};
    if (hour < 3) return {index:1,name:'丑'};
    if (hour < 5) return {index:2,name:'寅'};
    if (hour < 7) return {index:3,name:'卯'};
    if (hour < 9) return {index:4,name:'辰'};
    if (hour < 11) return {index:5,name:'巳'};
    if (hour < 13) return {index:6,name:'午'};
    if (hour < 15) return {index:7,name:'未'};
    if (hour < 17) return {index:8,name:'申'};
    if (hour < 19) return {index:9,name:'酉'};
    if (hour < 21) return {index:10,name:'戌'};
    return {index:11,name:'亥'};
  }

  getShiZhu(riGan, hour) {
    const sc = this.getShiChen(hour);
    const gi = (this.tgIndex(this.d.wuShuDun[riGan]) + sc.index) % 10;
    return { gan: this.d.tiangan[gi], zhi: sc.name, ganZhi: this.d.tiangan[gi] + sc.name };
  }

  paiBaZi(name, gender, year, month, day, hour, minute) {
    const n = this.getNianZhu(year, month, day);
    const y = this.getYueZhu(n.gan, month, day);
    const r = this.getRiZhu(year, month, day);
    const s = this.getShiZhu(r.gan, hour);
    return { name, gender, nian: n, yue: y, ri: r, shi: s, siZhu: [n.ganZhi, y.ganZhi, r.ganZhi, s.ganZhi] };
  }

  analyzeShengXiao(mDz, fDz) {
    const mSx = this.d.shengxiao[this.dzIndex(mDz)], fSx = this.d.shengxiao[this.dzIndex(fDz)];
    const r = {male:mSx,female:fSx,type:'中性',detail:''};
    if (this.d.shengxiaoLiuHe[mSx]===fSx) { r.type='六合'; r.detail=mSx+'与'+fSx+'为六合，天生一对。'; }
    else if (this.d.shengxiaoSanHe[mSx]?.includes(fSx)) { r.type='三合'; r.detail=mSx+'与'+fSx+'为三合，同局相生。'; }
    else if (this.d.shengxiaoLiuChong[mSx]===fSx) { r.type='六冲'; r.detail=mSx+'与'+fSx+'为六冲，水火不容。'; }
    else if (this.d.shengxiaoLiuHai[mSx]===fSx) { r.type='六害'; r.detail=mSx+'与'+fSx+'为六害。'+(this.d.duantouhunKoujue[mSx+'+'+fSx]||''); }
    else r.detail=mSx+'与'+fSx+'无特殊关系，中性。';
    return r;
  }

  getNaYin(gz) { return this.d.nayin[gz]||'未知'; }
  checkTianGanHe(t1,t2) { return this.d.tianGanHe[t1]===t2; }
  checkDiZhiLiuHe(d1,d2) { return this.d.diZhiLiuHe[d1]===d2; }
  checkDiZhiLiuChong(d1,d2) { return this.d.diZhiLiuChong[d1]===d2; }
  checkDiZhiLiuHai(d1,d2) { return this.d.diZhiLiuHai[d1]===d2; }
  checkDiZhiSanXing(d1,d2) { return this.d.diZhiSanXing[d1+d2]||null; }
  checkDiZhiSanHe(d1,d2) {
    for (const t of [['申','子','辰'],['亥','卯','未'],['寅','午','戌'],['巳','酉','丑']])
      if (t.includes(d1)&&t.includes(d2)&&d1!==d2) return this.d.diZhiSanHe[t.join('')];
    return null;
  }

  analyzeGlobalDiZhi(l1, l2) {
    const s={he:[],chong:[],hai:[],xing:[],sanhe:[]};
    for (const d1 of l1) for (const d2 of l2) {
      if (this.checkDiZhiLiuHe(d1,d2)) s.he.push(d1+d2+'合');
      if (this.checkDiZhiLiuChong(d1,d2)) s.chong.push(d1+d2+'冲');
      if (this.checkDiZhiLiuHai(d1,d2)) s.hai.push(d1+d2+'害');
      const x=this.checkDiZhiSanXing(d1,d2); if(x) s.xing.push(d1+d2+'刑');
      const h=this.checkDiZhiSanHe(d1,d2); if(h) s.sanhe.push(d1+d2+'三合');
    }
    for (const k of Object.keys(s)) s[k]=[...new Set(s[k])];
    const good=s.he.length+s.sanhe.length, bad=s.chong.length+s.hai.length+s.xing.length;
    s.balance=good-bad; s.total=good+bad;
    return s;
  }

  analyzeFuQiGong(rz1, rz2) {
    if (this.checkDiZhiLiuHe(rz1,rz2)) return {type:'六合',detail:'夫妻宫六合，婚姻根基牢固，最吉。',good:true};
    if (this.checkDiZhiSanHe(rz1,rz2)) return {type:'三合',detail:'夫妻宫三合，婚姻调和。',good:true};
    if (this.checkDiZhiLiuChong(rz1,rz2)) return {type:'六冲',detail:'夫妻宫六冲，婚姻根基动摇，大忌！',good:false};
    if (this.checkDiZhiLiuHai(rz1,rz2)) return {type:'六害',detail:'夫妻宫六害，暗中消耗。',good:false};
    const x=this.checkDiZhiSanXing(rz1,rz2);
    if(x) return {type:x,detail:'夫妻宫'+x+'，婚姻有消耗。',good:false};
    return {type:'中性',detail:'夫妻宫无特殊关系。',good:true};
  }

  getShiShen(rg,g) { return this.d.shiShen[rg][g]; }
  getShiShenBaZi(b) { const g=b.ri.gan; return {nian:this.getShiShen(g,b.nian.gan),yue:this.getShiShen(g,b.yue.gan),ri:this.getShiShen(g,b.ri.gan),shi:this.getShiShen(g,b.shi.gan)}; }

  checkYinYangCuoCha(rz) {
    return new Set(['丙子','丙午','丙申','丁丑','丁未','丁酉','戊申','戊寅','己酉','己卯','己未','庚辰','庚戌','庚子','辛巳','辛亥','辛卯','壬辰','壬戌','壬子','癸巳','癸亥','癸丑','癸未']).has(rz);
  }

  checkTianYiGuiRen(rg,dz) { const m={'甲':'丑未','乙':'子申','丙':'亥酉','丁':'亥酉','戊':'丑未','己':'子申','庚':'丑未','辛':'午寅','壬':'巳卯','癸':'巳卯'}; return (m[rg]||'').includes(dz); }

  checkHongLuan(nz,dz) { return this.d.hongLuan[nz]===dz; }
  checkTianXi(nz,dz) { return this.d.tianXi[nz]===dz; }

  analyzeShiShenMatch(bm, bf) {
    const mRG=bm.ri.gan, fRG=bf.ri.gan;
    const mGans=[bm.nian.gan,bm.yue.gan,bm.ri.gan,bm.shi.gan], fGans=[bf.nian.gan,bf.yue.gan,bf.ri.gan,bf.shi.gan];
    const mCai=mGans.filter(g=>['正财','偏财'].includes(this.getShiShen(mRG,g)));
    const fGuan=fGans.filter(g=>['正官','七杀'].includes(this.getShiShen(fRG,g)));
    const maleKe=this.d.wuXingKe[this.d.tianGanWuXing[mRG]];
    const isFemaleCai=this.d.tianGanWuXing[fRG]===maleKe;
    const cycle=['金','水','木','火','土'], keWo={};
    for(let i=0;i<5;i++) keWo[cycle[i]]=cycle[(i+4)%5];
    const isMaleGuan=this.d.tianGanWuXing[mRG]===keWo[this.d.tianGanWuXing[fRG]];
    let lv='下', desc='无直接正缘对应。';
    if(isFemaleCai&&isMaleGuan){lv='上';desc='最佳匹配：互为"正缘"关系。';}
    else if(isFemaleCai||isMaleGuan){lv='中';desc='部分匹配：一方为正缘关系。';}
    return {maleDetails:{riGan:mRG,caiCount:mCai.length,caiList:mCai},femaleDetails:{riGan:fRG,guanCount:fGuan.length,guanList:fGuan},matchLevel:lv,matchDesc:desc};
  }

  analyzeRiZhuRelation(r1, r2) {
    const w1=this.d.tianGanWuXing[r1], w2=this.d.tianGanWuXing[r2];
    if (this.checkTianGanHe(r1,r2)) return {type:'天干五合',detail:r1+'与'+r2+'五合。'};
    if (w1===w2) return {type:'比和',detail:r1+'('+w1+')与'+r2+'('+w2+')五行相同。'};
    if (this.d.wuXingSheng[w1]===w2) return {type:'相生',detail:r1+'('+w1+')生'+r2+'('+w2+')。'};
    if (this.d.wuXingSheng[w2]===w1) return {type:'相生',detail:r2+'('+w2+')生'+r1+'('+w1+')。'};
    if (this.d.wuXingKe[w1]===w2) return {type:'相克',detail:r1+'('+w1+')克'+r2+'('+w2+')。'};
    return {type:'相克',detail:r2+'('+w2+')克'+r1+'('+w1+')。'};
  }

  getWuXingTongJi(b) {
    const wx={金:0,木:0,水:0,火:0,土:0};
    for(let i=0;i<4;i++){wx[this.d.tianGanWuXing[b.siZhu[i][0]]]++; wx[this.d.diZhiWuXing[b.siZhu[i][1]]]++;}
    return wx;
  }

  analyzeWuXingHuBu(w1, w2) {
    const s1=Object.entries(w1).sort((a,b)=>a[1]-b[1]), s2=Object.entries(w2).sort((a,b)=>a[1]-b[1]);
    const lack1=s1[0][0], lack2=s2[0][0];
    const oneWay=(w1[lack1]<w2[lack1])||(w2[lack2]<w1[lack2]), twoWay=(w1[lack1]<w2[lack1])&&(w2[lack2]<w1[lack2]);
    let comp='无明显互补。', lv='下';
    if(twoWay){comp='双向互补，整体平衡。';lv='上';}
    else if(oneWay){comp='单向互补，一方可补另一方之缺。';lv='中';}
    return {maleWx:w1,femaleWx:w2,complement:comp,complementLevel:lv};
  }

  analyzeWangShuai(b) {
    const rWx=this.d.tianGanWuXing[b.ri.gan];
    const yueWx=this.d.diZhiWuXing[b.yue.zhi];
    let score=0;
    if(this.d.wuXingSheng[yueWx]===rWx) score+=3;
    else if(yueWx===rWx) score+=2;
    else if(this.d.wuXingKe[rWx]===yueWx) score-=2;
    else if(this.d.wuXingKe[yueWx]===rWx) score-=1;
    const rzWx=this.d.diZhiWuXing[b.ri.zhi];
    if(rzWx===rWx) score+=2; else if(this.d.wuXingSheng[rzWx]===rWx) score+=1; else if(this.d.wuXingKe[rWx]===rzWx) score-=1;
    return {score, status:score>=6?'身旺':score>=3?'偏旺':score>=-2?'中和':score>=-5?'偏弱':'身弱', confidence:'仅供参考，非确定性结论'};
  }

  getXiYongShen(b) {
    const ws=this.analyzeWangShuai(b), rWx=this.d.tianGanWuXing[b.ri.gan];
    const cy=['金','水','木','火','土'];
    const sr=cy[(cy.indexOf(rWx)+4)%5];
    let xy=[];
    if(ws.status.includes('旺')) xy=[cy[(cy.indexOf(rWx)+3)%5], cy[(cy.indexOf(rWx)+2)%5]];
    else xy=[sr, rWx];
    const wx=this.getWuXingTongJi(b);
    return {riWx:rWx, wangShuai:ws.status, xiYong:[...new Set(xy)].join('、'), wuXingTotals:Object.entries(wx).sort((a,b)=>b[1]-a[1]).map(([w,c])=>w+c).join(' '), confidence:'仅供参考，非确定性结论'};
  }

  // ====== 合婚主入口 ======
  heHun(m,f) {
    const mg=this.computeMingGua(m.year,'male',m.month,m.day);
    const fg=this.computeMingGua(f.year,'female',f.month,f.day);
    const bx=this.getBaXingResult(mg.guaNum, fg.guaNum);
    const mb=this.paiBaZi(m.name||'男方','male',m.year,m.month,m.day,m.hour,m.minute||0);
    const fb=this.paiBaZi(f.name||'女方','female',f.year,f.month,f.day,f.hour,f.minute||0);
    const sx=this.analyzeShengXiao(mb.nian.zhi, fb.nian.zhi);
    const rz=this.analyzeRiZhuRelation(mb.ri.gan, fb.ri.gan);
    const fq=this.analyzeFuQiGong(mb.ri.zhi, fb.ri.zhi);
    const ss=this.analyzeShiShenMatch(mb, fb);
    const gdz=this.analyzeGlobalDiZhi([mb.nian.zhi,mb.yue.zhi,mb.ri.zhi,mb.shi.zhi],[fb.nian.zhi,fb.yue.zhi,fb.ri.zhi,fb.shi.zhi]);
    const mw=this.getWuXingTongJi(mb), fw=this.getWuXingTongJi(fb);
    const wh=this.analyzeWuXingHuBu(mw, fw);
    const mws=this.analyzeWangShuai(mb), fws=this.analyzeWangShuai(fb);
    const mxy=this.getXiYongShen(mb), fxy=this.getXiYongShen(fb);

    // 综合评分
    let score=0;
    // 九星(8%)
    if(bx.info.type==='吉') score+=8;
    else if(bx.info.type==='中') score+=4;
    else score+=0;
    // 日主(10%)
    if(rz.type==='天干五合') score+=10;
    else if(rz.type==='相生') score+=8;
    else if(rz.type==='比和') score+=5;
    else score+=2;
    // 夫妻宫(30%)
    if(fq.good) score+=30;
    // 生肖(1%)
    if(sx.type==='六合'||sx.type==='三合') score+=1;
    else if(sx.type==='六冲'||sx.type==='六害') score-=1;
    // 十神(5%)
    if(ss.matchLevel==='上') score+=5;
    else if(ss.matchLevel==='中') score+=2;
    // 全局地支(15%)
    if(gdz.balance>=2) score+=15;
    else if(gdz.balance>=0) score+=10;
    else if(gdz.balance>=-2) score+=5;
    // 五行互补(3%)
    if(wh.complementLevel==='上') score+=3;
    else if(wh.complementLevel==='中') score+=1;
    // 喜用神(25%)
    score+=12; // 基础分，喜用神部分复杂，给个中间值

    let grade='', stars='';
    if(score>=80){grade='★★★★★ 上上等';stars=5;}
    else if(score>=65){grade='★★★★ 上等';stars=4;}
    else if(score>=50){grade='★★★ 中等';stars=3;}
    else if(score>=35){grade='★★ 需谨慎';stars=2;}
    else{grade='★ 不推荐';stars=1;}

    return {
      maleGua:mg, femaleGua:fg,
      baXing:bx,
      maleBazi:mb, femaleBazi:fb,
      maleBirthInfo: m.birthInfo || { solarText: m.year+'年'+m.month+'月'+m.day+'日 '+m.hour+'时'+m.minute+'分', lunarText: '' },
      femaleBirthInfo: f.birthInfo || { solarText: f.year+'年'+f.month+'月'+f.day+'日 '+f.hour+'时'+f.minute+'分', lunarText: '' },
      shengXiao:sx,
      riZhuGuanXi:rz,
      fuQiGong:fq,
      shiShenMatch:ss,
      maleShiShen:this.getShiShenBaZi(mb),
      femaleShiShen:this.getShiShenBaZi(fb),
      globalDiZhi:gdz,
      maleWuXing:mw, femaleWuXing:fw,
      wxHubu:wh,
      maleWangShuai:mws, femaleWangShuai:fws,
      maleXiYong:mxy, femaleXiYong:fxy,
      totalScore:Math.min(score,100),
      grade, stars,
    };
  }
}
