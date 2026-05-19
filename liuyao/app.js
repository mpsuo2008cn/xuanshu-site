// =======================================================
// 玄枢六爻排盘核心引擎与界面逻辑
// =======================================================

// -------- 基础常量 --------
const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const WUXING_DZ = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];

const TIANGAN_WUXING = {
  "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
  "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水"
};

const BINARY_TO_TRIGRAM = {
  "111": "乾", "000": "坤", "001": "震", "110": "巽",
  "010": "坎", "101": "离", "100": "艮", "011": "兑"
};

const NAJIA_RULES = {
  "乾": { inner: { tiangan: "甲", dizhi: ["子", "寅", "辰"] }, outer: { tiangan: "壬", dizhi: ["午", "申", "戌"] } },
  "坤": { inner: { tiangan: "乙", dizhi: ["未", "巳", "卯"] }, outer: { tiangan: "癸", dizhi: ["丑", "亥", "酉"] } },
  "震": { inner: { tiangan: "庚", dizhi: ["子", "寅", "辰"] }, outer: { tiangan: "庚", dizhi: ["午", "申", "戌"] } },
  "巽": { inner: { tiangan: "辛", dizhi: ["丑", "亥", "酉"] }, outer: { tiangan: "辛", dizhi: ["未", "巳", "卯"] } },
  "坎": { inner: { tiangan: "戊", dizhi: ["寅", "辰", "午"] }, outer: { tiangan: "戊", dizhi: ["申", "戌", "子"] } },
  "离": { inner: { tiangan: "己", dizhi: ["卯", "丑", "亥"] }, outer: { tiangan: "己", dizhi: ["酉", "未", "巳"] } },
  "艮": { inner: { tiangan: "丙", dizhi: ["辰", "午", "申"] }, outer: { tiangan: "丙", dizhi: ["戌", "子", "寅"] } },
  "兑": { inner: { tiangan: "丁", dizhi: ["巳", "卯", "丑"] }, outer: { tiangan: "丁", dizhi: ["亥", "酉", "未"] } }
};

const LIUSHEN_START = { "甲": 0, "乙": 0, "丙": 1, "丁": 1, "戊": 2, "己": 3, "庚": 4, "辛": 4, "壬": 5, "癸": 5 };
const LIUSHEN_ORDER = ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"];

const HEXAGRAM_NAMES = {
  "111111": "乾为天", "000000": "坤为地", "010001": "水雷屯", "100010": "山水蒙",
  "010111": "水天需", "111010": "天水讼", "000010": "地水师", "010000": "水地比",
  "110111": "风天小畜", "111011": "天泽履", "000111": "地天泰", "111000": "天地否",
  "111101": "天火同人", "101111": "火天大有", "000100": "地山谦", "001000": "雷地豫",
  "011001": "泽雷随", "100110": "山风蛊", "000011": "地泽临", "110000": "风地观",
  "101001": "火雷噬嗑", "100101": "山火贲", "100000": "山地剥", "000001": "地雷复",
  "111001": "天雷无妄", "100111": "山天大畜", "100001": "山雷颐", "011110": "泽风大过",
  "010010": "坎为水", "101101": "离为火", "011100": "泽山咸", "001110": "雷风恒",
  "111100": "天山遁", "001111": "雷天大壮", "101000": "火地晋", "000101": "地火明夷",
  "110101": "风火家人", "101011": "火泽睽", "010100": "水山蹇", "001010": "雷水解",
  "100011": "山泽损", "110001": "风雷益", "011111": "泽天夬", "111110": "天风姤",
  "000110": "地风升", "011010": "泽水困", "010110": "水风井", "011101": "泽火革",
  "101110": "火风鼎", "001001": "震为雷", "100100": "艮为山", "110110": "巽为风",
  "011011": "兑为泽", "110010": "风水涣", "010011": "水泽节", "110011": "风泽中孚",
  "001100": "雷山小过", "010101": "水火既济", "101010": "火水未济",
  "001011": "雷泽归妹", "110100": "风山渐", "101100": "火山旅", "011000": "泽地萃",
  "001101": "雷火丰"
};

const PALACE_SHOUGUAPATTERNS = {
  "乾": "111111", "坤": "000000", "震": "001001", "巽": "110110",
  "坎": "010010", "离": "101101", "艮": "100100", "兑": "011011"
};

const LIUCHONG_GUA = new Set([
  "111111", "011011", "101101", "001001",
  "110110", "010010", "100100", "000000", "001111", "111001"
]);

const APP_VERSION = 'v1.0.0';
const FEEDBACK_EMAIL = 'feedback@example.com';
const WECHAT_ID = 'mpsuo2008cn';
let toastTimer = null;
const LIUHE_GUA = new Set([
  "111000", "000111", "000001", "100101",
  "101100", "011010", "010011", "001000"
]);

const EIGHT_PALACES = {
  "111111": ["乾", 6], "111110": ["乾", 1], "111100": ["乾", 2], "111000": ["乾", 3],
  "110000": ["乾", 4], "100000": ["乾", 5], "101000": ["乾", 4], "101111": ["乾", 3],
  "000000": ["坤", 6], "000001": ["坤", 1], "000011": ["坤", 2], "000111": ["坤", 3],
  "001111": ["坤", 4], "011111": ["坤", 5], "010111": ["坤", 4], "010000": ["坤", 3],
  "001001": ["震", 6], "001000": ["震", 1], "001010": ["震", 2], "001110": ["震", 3],
  "000110": ["震", 4], "010110": ["震", 5], "011110": ["震", 4], "011001": ["震", 3],
  "110110": ["巽", 6], "110111": ["巽", 1], "110101": ["巽", 2], "110001": ["巽", 3],
  "111001": ["巽", 4], "101001": ["巽", 5], "100001": ["巽", 4], "100110": ["巽", 3],
  "010010": ["坎", 6], "010011": ["坎", 1], "010001": ["坎", 2], "010101": ["坎", 3],
  "011101": ["坎", 4], "001101": ["坎", 5], "000101": ["坎", 4], "000010": ["坎", 3],
  "101101": ["离", 6], "101100": ["离", 1], "101110": ["离", 2], "101010": ["离", 3],
  "100010": ["离", 4], "110010": ["离", 5], "111010": ["离", 4], "111101": ["离", 3],
  "100100": ["艮", 6], "100101": ["艮", 1], "100111": ["艮", 2], "100011": ["艮", 3],
  "101011": ["艮", 4], "111011": ["艮", 5], "110011": ["艮", 4], "110100": ["艮", 3],
  "011011": ["兑", 6], "011010": ["兑", 1], "011000": ["兑", 2], "011100": ["兑", 3],
  "010100": ["兑", 4], "000100": ["兑", 5], "001100": ["兑", 4], "001011": ["兑", 3]
};

const YOUHUN_GUIHUN = {
  "101000": "游魂卦", "101111": "归魂卦", "010111": "游魂卦", "010000": "归魂卦",
  "011110": "游魂卦", "011001": "归魂卦", "100001": "游魂卦", "100110": "归魂卦",
  "000101": "游魂卦", "000010": "归魂卦", "111010": "游魂卦", "111101": "归魂卦",
  "110011": "游魂卦", "110100": "归魂卦", "001100": "游魂卦", "001011": "归魂卦"
};

const PALACE_WUXING = { "乾": "金", "坤": "土", "震": "木", "巽": "木", "坎": "水", "离": "火", "艮": "土", "兑": "金" };

const WUXING_SHENG_KE = {
  sheng: { "金": "水", "水": "木", "木": "火", "火": "土", "土": "金" },
  ke:    { "金": "木", "木": "土", "土": "水", "水": "火", "火": "金" }
};

// -------- 六亲关系 --------
function getLiuqin(palaceWuxing, yaoWuxing) {
  const { sheng, ke } = WUXING_SHENG_KE;
  if (sheng[yaoWuxing] === palaceWuxing) return "父母";
  if (sheng[palaceWuxing] === yaoWuxing) return "子孙";
  if (ke[yaoWuxing] === palaceWuxing) return "官鬼";
  if (ke[palaceWuxing] === yaoWuxing) return "妻财";
  if (palaceWuxing === yaoWuxing) return "兄弟";
  return "未知";
}

// =======================================================
// SixYaoEngine — 排盘核心引擎
// =======================================================
class SixYaoEngine {
  constructor(yaoList, dayTiangan = "甲", divinationMethod = "") {
    this.originalList = yaoList;
    this.dayTiangan = dayTiangan;
    this.divinationMethod = divinationMethod;

    // 生成本卦 / 变卦卦值
    const benGua = [...yaoList];
    const bianGua = yaoList.map(y => y === 6 ? 7 : y === 9 ? 8 : y);
    this.benGuaList = benGua;
    this.bianGuaList = bianGua;

    // 二进制键
    this.benGuaKey = this._toBinary(benGua);
    this.bianGuaKey = this._toBinary(bianGua);

    // 宫位 & 世应
    const palace = EIGHT_PALACES[this.benGuaKey] || ["乾", 6];
    this.benGuaPalace = palace[0];
    this.benGuaShiYao = palace[1];
    this.benGuaYingYao = palace[1] ? (palace[1] + 2) % 6 + 1 : null;
    this.palaceWuxing = PALACE_WUXING[this.benGuaPalace] || "金";

    // 纳甲排盘
    this.benGuaDetails = this._paipan(this.benGuaKey, true);
    this.bianGuaDetails = this._paipanBianGua();
    this.fushenInfo = this._calcFushen();
  }

  // 爻值 → 二进制卦键（从下往上, 7/9=阳=1, 6/8=阴=0）
  _toBinary(list) {
    return list.map(y => y === 7 || y === 9 ? "1" : "0").reverse().join("");
  }

  // 排盘——为某个卦配纳甲、五行、六亲、六神
  _paipan(guaKey, isBenGua) {
    const upperKey = guaKey.slice(0, 3);
    const lowerKey = guaKey.slice(3);
    const upperTri = BINARY_TO_TRIGRAM[upperKey];
    const lowerTri = BINARY_TO_TRIGRAM[lowerKey];
    if (!upperTri || !lowerTri) return null;

    const upperRules = NAJIA_RULES[upperTri];
    const lowerRules = NAJIA_RULES[lowerTri];
    const lsStart = LIUSHEN_START[this.dayTiangan] || 0;
    const details = [];

    for (let i = 0; i < 6; i++) {
      const isInner = i < 3;
      const part = isInner ? lowerRules.inner : upperRules.outer;
      const dzIdx = isInner ? i : i - 3;
      const tiangan = part.tiangan;
      const dizhi = part.dizhi[dzIdx];
      const wuxing = WUXING_DZ[DIZHI.indexOf(dizhi)];
      const liuqin = getLiuqin(this.palaceWuxing, wuxing);

      // 爻符号
      let symbol;
      if (isBenGua) {
        const v = this.originalList[i];
        symbol = v === 9 ? "Ｏ" : v === 6 ? "Ｘ" : v === 7 ? "、" : "、、";
      } else {
        symbol = this.bianGuaList[i] === 7 ? "、" : "、、";
      }

      details.push({
        yaoPos: i + 1,
        tiangan, dizhi, wuxing, liuqin,
        liushen: LIUSHEN_ORDER[(lsStart + i) % 6],
        symbol
      });
    }
    return details;
  }

  // 变卦纳甲（变爻则按变卦上/下卦重新取干支）
  _paipanBianGua() {
    if (!this.benGuaDetails) return null;
    const benUpperTri = BINARY_TO_TRIGRAM[this.benGuaKey.slice(0, 3)];
    const benLowerTri = BINARY_TO_TRIGRAM[this.benGuaKey.slice(3)];
    const bianUpperTri = BINARY_TO_TRIGRAM[this.bianGuaKey.slice(0, 3)];
    const bianLowerTri = BINARY_TO_TRIGRAM[this.bianGuaKey.slice(3)];
    const lsStart = LIUSHEN_START[this.dayTiangan] || 0;

    const getYao = (i, triRef, triCur, partKey) => {
      if (triRef === triCur) {
        return { tiangan: this.benGuaDetails[i].tiangan, dizhi: this.benGuaDetails[i].dizhi };
      }
      if (triCur && NAJIA_RULES[triCur]) {
        const part = NAJIA_RULES[triCur][partKey];
        const idx = partKey === "inner" ? i : i - 3;
        return { tiangan: part.tiangan, dizhi: part.dizhi[idx] };
      }
      return { tiangan: this.benGuaDetails[i].tiangan, dizhi: this.benGuaDetails[i].dizhi };
    };

    return this.benGuaDetails.map((_, i) => {
      const { tiangan, dizhi } = i < 3
        ? getYao(i, benLowerTri, bianLowerTri, "inner")
        : getYao(i, benUpperTri, bianUpperTri, "outer");
      const wuxing = WUXING_DZ[DIZHI.indexOf(dizhi)];
      return {
        yaoPos: i + 1,
        tiangan, dizhi, wuxing,
        liuqin: getLiuqin(this.palaceWuxing, wuxing),
        liushen: LIUSHEN_ORDER[(lsStart + i) % 6],
        symbol: this.bianGuaList[i] === 7 ? "、" : "、、"
      };
    });
  }

  // 伏神计算
  _calcFushen() {
    if (!this.benGuaDetails || !this.benGuaPalace) return {};
    const existing = new Set(this.benGuaDetails.map(d => d.liuqin));
    const all = ["父母", "兄弟", "官鬼", "妻财", "子孙"];
    const missing = all.filter(x => !existing.has(x));

    const shouguaKey = PALACE_SHOUGUAPATTERNS[this.benGuaPalace];
    if (!shouguaKey) return {};

    const shouguaDetails = this._paipan(shouguaKey, false);
    if (!shouguaDetails) return {};

    const info = {};
    for (const m of missing) {
      const found = shouguaDetails.find(d => d.liuqin === m);
      if (found) {
        info[found.yaoPos] = { liuqin: m, tiangan: found.tiangan, dizhi: found.dizhi, wuxing: found.wuxing, fuYaoPos: found.yaoPos };
      }
    }
    return info;
  }

  // 生成排盘 HTML
  getDisplayHtml() {
    if (!this.benGuaDetails || !this.bianGuaDetails) {
      return "<div class='result-error'>排盘失败，请检查算法。</div>";
    }

    const hasMoving = this.benGuaKey !== this.bianGuaKey;
    const bianPalace = (EIGHT_PALACES[this.bianGuaKey] || ["乾", 6]);
    const bianShi = bianPalace[1];
    const bianYing = bianShi ? (bianShi + 2) % 6 + 1 : null;

    const benName = HEXAGRAM_NAMES[this.benGuaKey] || "未知卦";
    const bianName = HEXAGRAM_NAMES[this.bianGuaKey] || "未知卦";

    const symClass = s => s === 'Ｏ' ? 'dong-yang' : s === 'Ｘ' ? 'dong-yin' : 'jing';
    const shiYingClass = (pos, shi, ying) =>
      shi === pos ? 'shi' : ying === pos ? 'ying' : '';
    const shiYingText = (pos, shi, ying) =>
      shi === pos ? "世" : ying === pos ? "应" : "";

    let html = "";
    if (this.divinationMethod) {
      html += `<div class='divination-method'>起卦方式：${this.divinationMethod}</div>`;
    }

    // 卦名行
    html += "<div class='gua-title-row'>";
    html += hasMoving
      ? `<span class='gua-title ben-gua-title'>${benName}</span><span class='gua-title bian-gua-title'>${bianName}</span>`
      : `<span class='gua-title single-gua-title'>${benName}</span>`;
    html += "</div>";

    html += `<div class='gua-grid${hasMoving ? "" : " single-gua-grid"}'>`;
    for (let i = 5; i >= 0; i--) {
      const b = this.benGuaDetails[i];
      const v = this.bianGuaDetails[i];
      const fushen = this.fushenInfo[i + 1];
      const fushenHtml = fushen
        ? `<span class='fushen-text'>${fushen.liuqin}${fushen.tiangan}${fushen.dizhi}${fushen.wuxing}</span>`
        : "";

      html += "<div class='gua-row'>";
      html += `<span class='yao-cell ben-yao'>
        <span class='yao-row-top'>
          <span class='liuqin'>${b.liuqin}</span>
          <span class='najia'>${b.tiangan}${b.dizhi}${b.wuxing}</span>
          <span class='symbol ${symClass(b.symbol)}'>${b.symbol}</span>
          ${shiYingText(b.yaoPos, this.benGuaShiYao, this.benGuaYingYao)
            ? `<span class='shi-ying ${shiYingClass(b.yaoPos, this.benGuaShiYao, this.benGuaYingYao)}'>${shiYingText(b.yaoPos, this.benGuaShiYao, this.benGuaYingYao)}</span>`
            : ""}
        </span>${
          fushenHtml ? `<span class='fushen-line'>${fushenHtml}</span>` : ""
        }</span>`;

      if (hasMoving) {
        html += `<span class='yao-cell bian-yao'>
          <span class='yao-row-top'>
            <span class='liuqin'>${v.liuqin}</span>
            <span class='najia'>${v.tiangan}${v.dizhi}${v.wuxing}</span>
            <span class='symbol'>${v.symbol}</span>
            ${shiYingText(v.yaoPos, bianShi, bianYing)
              ? `<span class='shi-ying ${shiYingClass(v.yaoPos, bianShi, bianYing)}'>${shiYingText(v.yaoPos, bianShi, bianYing)}</span>`
              : ""}
          </span>
        </span>`;
      }
      html += `<span class='liushen-cell'>${b.liushen}</span>`;
      html += "</div>";
    }
    html += "</div>";

    const benType = YOUHUN_GUIHUN[this.benGuaKey];
    const bianType = hasMoving ? YOUHUN_GUIHUN[this.bianGuaKey] : "";
    const tag = (set, key) => set.has(key) ? "【六冲卦】" : "【六合卦】";
    const benChongHe = LIUCHONG_GUA.has(this.benGuaKey) ? "【六冲卦】" : LIUHE_GUA.has(this.benGuaKey) ? "【六合卦】" : "";
    const bianChongHe = hasMoving ? tag(LIUCHONG_GUA.has(this.bianGuaKey) ? LIUCHONG_GUA : LIUHE_GUA, this.bianGuaKey) : "";
    // fix bianChongHe
    let bcText = "";
    if (hasMoving) {
      bcText = LIUCHONG_GUA.has(this.bianGuaKey) ? "【六冲卦】" : LIUHE_GUA.has(this.bianGuaKey) ? "【六合卦】" : "";
    }

    if (hasMoving) {
      if (benType || bianType) {
        html += `<div class='gua-type-row'>
          <span class='gua-type ben-type'>${benType || ""}</span>
          <span class='gua-type-divider'></span>
          <span class='gua-type bian-type'>${bianType || ""}</span>
        </div>`;
      }
      if (benChongHe || bcText) {
        html += `<div class='chonghe-type-row'>
          <span class='chonghe-type ben-chonghe'>${benChongHe || ""}</span>
          <span class='chonghe-type-divider'></span>
          <span class='chonghe-type bian-chonghe'>${bcText || ""}</span>
        </div>`;
      }
    } else {
      if (benType) {
        html += `<div class='gua-type-row'><span class='gua-type single-type'>${benType}</span></div>`;
      }
      if (benChongHe) {
        html += `<div class='chonghe-type-row'><span class='chonghe-type single-chonghe'>${benChongHe}</span></div>`;
      }
    }

    return html;
  }
}

// =======================================================
// 工具函数
// =======================================================

function getGanzhi(solarDate) {
  const lunar = Solar.fromDate(solarDate).getLunar();
  return {
    year: lunar.getYearInGanZhi(),
    month: lunar.getMonthInGanZhi(),
    day: lunar.getDayInGanZhi(),
    hour: lunar.getTimeInGanZhi(),
    dayGan: lunar.getDayGan()
  };
}

function getKongwang(dayGanzhi) {
  const xunList = ["甲子", "甲戌", "甲申", "甲午", "甲辰", "甲寅"];
  const xunKongwangMap = {
    "甲子": "戌亥", "甲戌": "申酉", "甲申": "午未",
    "甲午": "辰巳", "甲辰": "寅卯", "甲寅": "子丑"
  };
  if (dayGanzhi in xunKongwangMap) return { xun: dayGanzhi, kongwang: xunKongwangMap[dayGanzhi] };

  const gan = TIANGAN.indexOf(dayGanzhi[0]);
  const zhi = DIZHI.indexOf(dayGanzhi[1]);
  let xunZhiIdx = (zhi - gan) % 12;
  if (xunZhiIdx < 0) xunZhiIdx += 12;
  const xun = "甲" + DIZHI[xunZhiIdx];
  return { xun, kongwang: xunKongwangMap[xun] || "戌亥" };
}

function getLunarStr(solarDate) {
  const l = Solar.fromDate(solarDate).getLunar();
  return l.getYearInChinese() + "年" + l.getMonthInChinese() + "月" +
         l.getDayInChinese() + "日 " + l.getTimeZhi() + "时";
}

function formatSolarDate(d) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`;
}

function getTimeZhi(hour) {
  if (hour >= 23 || hour < 1) return '子';
  const map = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
  for (let i = map.length - 1; i >= 0; i--) {
    if (hour >= map[i]) return ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][i];
  }
  return '子';
}

// -------- 构建时间信息行（消除重复代码） --------
function buildTimeInfo(question) {
  const lines = [
    "占问事宜：" + (question.trim() || "未指定")
  ];

  let solarDate, ganzhi, dayTiangan;
  try {
    solarDate = parseTime();
    ganzhi = getGanzhi(solarDate);
    dayTiangan = ganzhi.dayGan;
    lines.push("公历时间：" + formatSolarDate(solarDate));
    lines.push("农历时间：" + getLunarStr(solarDate));
    const kw = getKongwang(ganzhi.day);
    lines.push("干支：" + ganzhi.year + " " + ganzhi.month + " " + ganzhi.day + " " + ganzhi.hour + "（空：" + kw.kongwang + "）");
  } catch (e) {
    solarDate = new Date();
    ganzhi = getGanzhi(solarDate);
    dayTiangan = ganzhi.dayGan;
    lines.push("已使用当前时间：" + formatSolarDate(solarDate));
    lines.push("农历时间：" + getLunarStr(solarDate));
    lines.push("干支：" + ganzhi.year + " " + ganzhi.month + " " + ganzhi.day + " " + ganzhi.hour);
  }

  return { lines, solarDate, ganzhi, dayTiangan };
}

// -------- 时间解析 --------
function parseTime() {
  const sel = id => document.getElementById(id);
  const yearS = sel('yearSelect'), monthS = sel('monthSelect'), dayS = sel('daySelect'),
        hourS = sel('hourSelect'), minuteS = sel('minuteSelect');
  if (yearS && monthS && dayS && hourS && minuteS) {
    const y = parseInt(yearS.value), m = parseInt(monthS.value) - 1,
          d = parseInt(dayS.value), h = parseInt(hourS.value), min = parseInt(minuteS.value);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && !isNaN(h) && !isNaN(min)) {
      return new Date(y, m, d, h, min);
    }
  }
  return new Date();
}

// =======================================================
// UI 状态
// =======================================================
const state = {
  yaoChoices: ["", "", "", "", "", ""],
  coinMap: { "无背": 6, "一背": 7, "二背": 8, "三背": 9 },
  selectedHexagram: null,
  movingYaoPositions: new Set()
};

// =======================================================
// 页面初始化
// =======================================================
document.addEventListener('DOMContentLoaded', init);

function init() {
  initTimeSelectors();
  updateCurrentTime();
  setInterval(updateCurrentTime, 60000);
  initSplash();
  bindEvents();
}

function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 1100);
  }, 3000);
}

function initTimeSelectors() {
  const ids = ['yearSelect', 'monthSelect', 'daySelect', 'hourSelect', 'minuteSelect'];
  const els = ids.map(id => document.getElementById(id));
  if (els.some(el => !el)) return;

  const now = new Date();
  [els[0], els[3], els[4]].forEach((sel, idx) => {
    const [start, end] = idx === 0 ? [now.getFullYear() - 100, now.getFullYear() + 50] : idx === 1 ? [0, 23] : [0, 59];
    for (let v = start; v <= end; v++) {
      sel.appendChild(new Option(String(v).padStart(2, '0'), v));
    }
  });

  for (let m = 1; m <= 12; m++) els[1].appendChild(new Option(String(m).padStart(2, '0'), m));
  updateDayOptions();

  els[1].addEventListener('change', updateDayOptions);
  els[0].addEventListener('change', updateDayOptions);
}

function updateDayOptions() {
  const yearS = document.getElementById('yearSelect');
  const monthS = document.getElementById('monthSelect');
  const dayS = document.getElementById('daySelect');
  if (!yearS || !monthS || !dayS) return;
  const daysInMonth = new Date(parseInt(yearS.value), parseInt(monthS.value), 0).getDate();
  const cur = dayS.value;
  dayS.innerHTML = '';
  for (let d = 1; d <= daysInMonth; d++) dayS.appendChild(new Option(String(d).padStart(2, '0'), d));
  if (cur && parseInt(cur) <= daysInMonth) dayS.value = cur;
}

function updateTimeDisplay() {
  const sel = id => document.getElementById(id);
  const yearS = sel('yearSelect'), monthS = sel('monthSelect'), dayS = sel('daySelect'),
        hourS = sel('hourSelect'), minuteS = sel('minuteSelect'), disp = sel('timeDisplay');
  if (yearS && monthS && dayS && hourS && minuteS && disp) {
    const y = parseInt(yearS.value), m = parseInt(monthS.value), d = parseInt(dayS.value),
          h = parseInt(hourS.value), min = parseInt(minuteS.value);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && !isNaN(h) && !isNaN(min)) {
      disp.textContent = `${y}年${m}月${d}日 ${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }
  }
}

function updateCurrentTime() {
  const now = new Date();
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('yearSelect', now.getFullYear());
  set('monthSelect', now.getMonth() + 1);
  updateDayOptions();
  set('daySelect', now.getDate());
  set('hourSelect', now.getHours());
  set('minuteSelect', now.getMinutes());
  updateTimeDisplay();
}

function bindEvents() {
  const $ = id => document.getElementById(id);

  $('openTimeModal')?.addEventListener('click', () => $('timeModal')?.classList.add('active'));
  $('confirmTime')?.addEventListener('click', () => { updateTimeDisplay(); $('timeModal')?.classList.remove('active'); });
  $('setCurrentTime')?.addEventListener('click', () => { updateCurrentTime(); updateTimeDisplay(); });
  $('clearResult')?.addEventListener('click', clearResult);
  $('showHistory')?.addEventListener('click', showHistory);
  $('clearHistory')?.addEventListener('click', clearHistory);
  $('confirmCoin')?.addEventListener('click', finalizeDivination);
  $('confirmManual')?.addEventListener('click', processManualDivination);
  $('resultModalClose')?.addEventListener('click', () => $('resultModal')?.classList.remove('active'));

  // 点击弹窗背景关闭
  $('resultModal')?.addEventListener('click', e => {
    if (e.target === $('resultModal')) $('resultModal')?.classList.remove('active');
  });

  $('divinationMethod')?.addEventListener('change', function() {
    switch (this.value) {
      case 'random': startDivination(); break;
      case 'coin': startInteractiveDivination(); break;
      case 'time': startTimeDivination(); break;
      case 'manual': showManualDivination(); break;
    }
    this.value = '';
  });

  // 关闭弹窗
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', e => e.target.closest('.modal')?.classList.remove('active'));
  });

  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.addEventListener('click', () => handleTab(btn.dataset.tab));
  });

  document.querySelectorAll('[data-mine-action]').forEach(btn => {
    btn.addEventListener('click', () => handleMineAction(btn.dataset.mineAction));
  });

  document.addEventListener('click', e => {
    const consultBtn = e.target.closest('[data-consult-action]');
    if (consultBtn) openConsultModal();
  });
}

function handleTab(tab) {
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  document.getElementById('pageDivination')?.classList.toggle('active', tab === 'divination' || tab === 'history');
  document.getElementById('pageMine')?.classList.toggle('active', tab === 'mine');

  if (tab === 'history') {
    showHistory();
  }
}

function handleMineAction(action) {
  if (action === 'open-calendar') {
    location.href = '../index.html';
    return;
  }
  if (action === 'open-bazi') {
    location.href = '../bazi/';
    return;
  }
  if (action === 'consult') {
    openConsultModal();
    return;
  }
  if (action === 'feedback') {
    writeClipboard(FEEDBACK_EMAIL, '反馈邮箱已复制');
    return;
  }
  if (action === 'email') {
    location.href = 'mailto:' + FEEDBACK_EMAIL + '?subject=' + encodeURIComponent('玄枢六爻反馈 ' + APP_VERSION);
    return;
  }
  if (action === 'wechat') {
    writeClipboard(WECHAT_ID, '微信号已复制');
    return;
  }
  if (action === 'share-app') {
    shareApp();
  }
}

function openConsult() {
  writeClipboard(WECHAT_ID, '微信号已复制，可添加咨询解卦');
}

function openConsultModal() {
  const existing = document.getElementById('consultModal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.className = 'consult-modal active';
  modal.id = 'consultModal';
  modal.innerHTML = `<div class="consult-modal-panel">
    <div class="consult-modal-head">
      <h3>命盘详解咨询</h3>
      <button class="consult-modal-close" type="button">×</button>
    </div>
    <div class="consult-modal-body">
      <p>可添加微信咨询解卦：${WECHAT_ID}</p>
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

function writeClipboard(text, successText) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(successText)).catch(() => fallbackCopy(text, successText));
    return;
  }
  fallbackCopy(text, successText);
}

function fallbackCopy(text, successText) {
  const input = document.createElement('input');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    showToast(successText);
  } catch (e) {
    showToast(text);
  }
  input.remove();
}

function shareApp() {
  const url = location.href.split('?')[0];
  const text = '玄枢六爻：心既静，卦自明。';
  if (navigator.share) {
    navigator.share({ title: '玄枢六爻', text, url }).catch(() => {});
    return;
  }
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

// =======================================================
// 起卦方式
// =======================================================

function startDivination() {
  const question = document.getElementById('question')?.value || '';
  const { lines, dayTiangan } = buildTimeInfo(question);

  const yaoMap = { 0: 6, 1: 7, 2: 8, 3: 9 };
  const yaoList = Array.from({ length: 6 }, () =>
    yaoMap[[0,1,2,3].filter(() => Math.random() > 0.5).length]
  );

  const engine = new SixYaoEngine(yaoList, dayTiangan, "随机起卦");
  displayResult(lines, engine.getDisplayHtml(), question);
}

function startTimeDivination() {
  const question = document.getElementById('question')?.value || '';
  const { lines, solarDate, dayTiangan } = buildTimeInfo(question);

  const year = solarDate.getFullYear(), month = solarDate.getMonth() + 1,
        day = solarDate.getDate(), hour = solarDate.getHours();
  const timeZhi = getTimeZhi(hour);
  const ZHI_NUMS = { '子':1,'丑':2,'寅':3,'卯':4,'辰':5,'巳':6,'午':7,'未':8,'申':9,'酉':10,'戌':11,'亥':12 };

  const upperNum = (year % 100 + month + day) % 8 || 8;
  const lowerNum = (year % 100 + month + day + ZHI_NUMS[timeZhi]) % 8 || 8;
  const movingLine = (year % 100 + month + day + ZHI_NUMS[timeZhi]) % 6 || 6;

  const numToTri = { 1:'111',2:'110',3:'101',4:'100',5:'011',6:'010',7:'001',8:'000' };
  const guaKey = numToTri[upperNum] + numToTri[lowerNum];

  const yaoList = guaKey.split('').map((bit, i) => {
    const b = parseInt(bit);
    return (i + 1 === movingLine) ? (b === 1 ? 9 : 6) : (b === 1 ? 7 : 8);
  });

  const engine = new SixYaoEngine(yaoList, dayTiangan, '🌸 时间起卦');
  displayResult(lines, engine.getDisplayHtml(), question);
}

// 铜钱起卦
function startInteractiveDivination() {
  state.yaoChoices = ["", "", "", "", "", ""];
  renderCoinYaoSelector();
  const btn = document.getElementById('confirmCoin');
  if (btn) { btn.disabled = true; btn.classList.add('disabled'); }
  document.getElementById('coinModal')?.classList.add('active');
}

function renderCoinYaoSelector() {
  const container = document.getElementById('coinYaoList');
  if (!container) return;
  container.innerHTML = '';

  const yaoNames = ["上爻", "五爻", "四爻", "三爻", "二爻", "初爻"];
  const yaoIndices = [5, 4, 3, 2, 1, 0];
  const options = ["一背", "二背", "三背", "无背"];

  for (let j = 0; j < 6; j++) {
    const i = yaoIndices[j];
    const div = document.createElement('div');
    div.className = 'yao-selector';

    const select = document.createElement('select');
    select.className = 'input yao-select';
    select.dataset.index = i;

    let html = '<option value="">请选择</option>';
    for (const choice of options) {
      const sel = state.yaoChoices[i] === choice ? ' selected' : '';
      html += `<option value="${choice}"${sel}>${choice}</option>`;
    }
    select.innerHTML = html;

    select.addEventListener('change', function() {
      const idx = parseInt(this.dataset.index);
      state.yaoChoices[idx] = this.value;
      const allDone = state.yaoChoices.every(c => c !== "");
      const btn = document.getElementById('confirmCoin');
      if (btn) { btn.disabled = !allDone; btn.classList.toggle('disabled', !allDone); }
    });

    div.innerHTML = `<span class="yao-name">${yaoNames[j]}</span>`;
    div.appendChild(select);
    container.appendChild(div);
  }
}

function finalizeDivination() {
  const question = document.getElementById('question')?.value || '';
  const { lines, dayTiangan } = buildTimeInfo(question);
  const yaoList = state.yaoChoices.map(c => state.coinMap[c] || 7);

  const engine = new SixYaoEngine(yaoList, dayTiangan, "铜钱起卦");
  displayResult(lines, engine.getDisplayHtml(), question);
  document.getElementById('coinModal')?.classList.remove('active');
}

// 手选起卦
function showManualDivination() {
  state.selectedHexagram = null;
  state.movingYaoPositions = new Set();
  renderHexagramGrid();
  renderYaoCheckboxes();
  document.getElementById('manualModal')?.classList.add('active');
}

function renderHexagramGrid() {
  const container = document.getElementById('hexGrid');
  if (!container) return;
  container.innerHTML = '';

  const palaceInfo = {
    "乾": "属金", "兑": "属金", "离": "属火", "震": "属木",
    "巽": "属木", "坎": "属水", "艮": "属土", "坤": "属土"
  };
  const palaceOrder = ["乾", "坎", "艮", "震", "巽", "离", "坤", "兑"];

  const correctOrder = {
    "乾": ["乾为天","天风姤","天山遁","天地否","风地观","山地剥","火地晋","火天大有"],
    "兑": ["兑为泽","泽水困","泽地萃","泽山咸","水山蹇","地山谦","雷山小过","雷泽归妹"],
    "离": ["离为火","火山旅","火风鼎","火水未济","山水蒙","风水涣","天水讼","天火同人"],
    "震": ["震为雷","雷地豫","雷水解","雷风恒","地风升","水风井","泽风大过","泽雷随"],
    "巽": ["巽为风","风天小畜","风火家人","风雷益","天雷无妄","火雷噬嗑","山雷颐","山风蛊"],
    "坎": ["坎为水","水泽节","水雷屯","水火既济","泽火革","雷火丰","地火明夷","地水师"],
    "艮": ["艮为山","山火贲","山天大畜","山泽损","火泽睽","天泽履","风泽中孚","风山渐"],
    "坤": ["坤为地","地雷复","地泽临","地天泰","雷天大壮","泽天夬","水天需","水地比"]
  };

  const hexNameToKey = {};
  for (const [key, name] of Object.entries(HEXAGRAM_NAMES)) hexNameToKey[name] = key;

  for (const palaceName of palaceOrder) {
    const palaceDiv = document.createElement('div');
    palaceDiv.className = 'palace-item';

    const label = document.createElement('span');
    label.className = 'palace-label-simple';
    label.textContent = palaceName + '宫 ' + palaceInfo[palaceName];
    palaceDiv.appendChild(label);

    const select = document.createElement('select');
    select.className = 'hex-select input';

    select.innerHTML = '<option value="">请选择</option>' +
      correctOrder[palaceName].map(n =>
        `<option value="${hexNameToKey[n] || ''}">${n}</option>`
      ).join('');

    select.addEventListener('change', function() {
      container.querySelectorAll('.hex-select').forEach(s => { if (s !== select) s.value = ''; });
      state.selectedHexagram = this.value || null;
    });

    palaceDiv.appendChild(select);
    container.appendChild(palaceDiv);
  }
}

function renderYaoCheckboxes() {
  const container = document.getElementById('yaoCheckboxes');
  if (!container) return;
  const labels = ["一", "二", "三", "四", "五", "六"];

  container.innerHTML = labels.map((name, i) =>
    `<label class="yao-checkbox-label">
      <input type="checkbox" class="yao-checkbox" data-yao="${i+1}">
      <span>${name}</span>
    </label>`
  ).join('');

  container.querySelectorAll('.yao-checkbox').forEach(cb => {
    cb.addEventListener('change', function() {
      const pos = parseInt(this.dataset.yao);
      if (this.checked) state.movingYaoPositions.add(pos);
      else state.movingYaoPositions.delete(pos);
    });
  });
}

function processManualDivination() {
  if (!state.selectedHexagram) { alert("请先选择一个卦象！"); return; }

  const question = document.getElementById('question')?.value || '';
  const { lines, dayTiangan } = buildTimeInfo(question);

  const yaoList = state.selectedHexagram.split('').reverse().map((bit, i) => {
    const b = parseInt(bit);
    return state.movingYaoPositions.has(i + 1) ? (b === 1 ? 9 : 6) : (b === 1 ? 7 : 8);
  });

  const engine = new SixYaoEngine(yaoList, dayTiangan, "手选起卦");
  displayResult(lines, engine.getDisplayHtml(), question);
  document.getElementById('manualModal')?.classList.remove('active');
}

// =======================================================
// 结果显示 & 历史记录
// =======================================================

function displayResult(lines, paipanHtml, question) {
  const consultHtml = getConsultHtml();
  // 同时写入右侧面板（PC 端备用）
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.innerHTML = `<div class="time-info">${
      lines.map(l => `<div class="info-row"><span class="info-value">${l}</span></div>`).join('')
    }</div><div class="gua-result">${paipanHtml}</div>${consultHtml}`;
  }

  // 写入全屏弹窗
  const modal = document.getElementById('resultModal');
  const content = document.getElementById('resultContent');
  if (modal && content) {
    content.innerHTML = `<div class="time-info">${
      lines.map(l => `<div class="info-row"><span class="info-value">${l}</span></div>`).join('')
    }</div><div class="gua-result">${paipanHtml}</div>${consultHtml}`;
    modal.classList.add('active');
  }

  saveToHistory(question, lines, paipanHtml);
}

function getConsultHtml() {
  return `<button class="btn btn-light consult-entry" type="button" data-consult-action="liuyao">专业人工解读</button>`;
}

function saveToHistory(question, lines, paipanHtml) {
  try {
    const history = JSON.parse(localStorage.getItem('liuyaoHistory') || '[]');
    history.unshift({
      id: Date.now(),
      date: new Date().toLocaleString(),
      question,
      lines,
      paipanHtml
    });
    if (history.length > 100) history.length = 100;
    localStorage.setItem('liuyaoHistory', JSON.stringify(history));
  } catch (e) {
    console.error('保存历史记录失败:', e);
  }
}

function showHistory() {
  const modal = document.getElementById('historyModal');
  const list = document.getElementById('historyList');
  if (!modal || !list) return;

  let history = [];
  try { history = JSON.parse(localStorage.getItem('liuyaoHistory') || '[]'); } catch (e) {}

  list.innerHTML = history.length === 0
    ? '<div class="history-empty">暂无历史记录</div>'
    : history.map(item =>
        `<div class="history-item">
          <div class="history-item-time">${item.date}</div>
          <div class="history-item-question">${item.question || '未指定'}</div>
        </div>`
      ).join('');

  list.querySelectorAll('.history-item').forEach((el, idx) => {
    el.addEventListener('click', () => showHistoryDetail(history[idx]));
  });

  modal.classList.add('active');
}

function showHistoryDetail(item) {
  const modal = document.getElementById('detailModal');
  const title = document.getElementById('detailTitle');
  const content = document.getElementById('detailContent');
  if (!modal || !title || !content) return;

  title.textContent = '历史记录 - ' + item.date;
  content.innerHTML = `<div class="time-info">${
    item.lines.map(l => `<div class="info-row"><span class="info-value">${l}</span></div>`).join('')
  }</div><div class="gua-result">${item.paipanHtml}</div>${getConsultHtml()}`;
  modal.classList.add('active');
}

function clearHistory() {
  if (confirm('确定要清空所有历史记录吗？')) {
    localStorage.removeItem('liuyaoHistory');
    showHistory();
  }
}

function clearResult() {
  const el = document.getElementById('result');
  if (el) {
    el.innerHTML = `<div class="welcome"><div class="welcome-text">
      <div class="welcome-title">玄枢<span class="taiji-inline">☯</span>六爻排盘</div>
      <div class="welcome-sub">请选择起卦方式，开始排盘。</div>
    </div></div>`;
  }
}
