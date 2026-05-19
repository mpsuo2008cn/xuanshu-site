/**
 * lunar.js - 农历与干支历适配层
 *
 * 完全依赖 CDN 引入的 lunar-javascript (https://cdn.jsdelivr.net/npm/lunar-javascript/lunar.js)
 * 本文件仅做适配导出模块，所有实际计算委托给该库。
 * 无任何手动农历/干支计算代码。
 *
 * 全局依赖：window.Solar, window.Lunar (从 CDN lunar.js 注入)
 */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    var o = factory();
    for (var i in o) {
      root[i] = o[i];
    }
  }
})(typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // 检测 CDN 库是否已加载
  if (typeof Solar === 'undefined' || typeof Lunar === 'undefined') {
    console.error('[lunar.js] 错误：lunar-javascript 库未加载。请确认 <head> 中 CDN 标签在 lunar.js 之前。');
    return {};
  }

  // ================================================================
  // 所有农历、干支、节气、神煞计算均委托给 CDN lunar-javascript 库
  // ================================================================
  //
  // CDN 库提供的核心 API（由 app.js 调用）：
  //
  //   Solar.fromDate(date)
  //     → Solar 对象
  //     → .getLunar() → Lunar 对象
  //
  //   以下方法均可从 Lunar 对象获得：
  //     .getYearInGanZhi()    → "甲辰"
  //     .getMonthInGanZhi()   → "丙寅"
  //     .getDayInGanZhi()     → "甲子"
  //     .getTimeInGanZhi()    → "甲子"
  //     .getDayGan()          → "甲"
  //     .getTimeZhi()         → "子"
  //     .getYearInChinese()   → "二〇二四"
  //     .getMonthInChinese()  → "正"
  //     .getDayInChinese()    → "初一"
  //     .getYearShengXiao()   → "龙"
  //     .getWeek()            → 星期索引
  //     .getWeekInChinese()   → "星期日"
  //
  // ================================================================

  // 透传 CDN 库的全局 Solar / Lunar
  return {
    Solar: Solar,
    Lunar: Lunar,
    JieQi: typeof JieQi !== 'undefined' ? JieQi : undefined
  };
});
