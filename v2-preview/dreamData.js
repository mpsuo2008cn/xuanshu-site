(function () {
  const dreamData = [
    { id: "snake", title: "梦见蛇", keywords: ["蛇", "大蛇", "黑蛇", "蛇咬", "被蛇追"], category: "动物", traditional: "蛇在传统梦象中多主变化、隐伏与警觉，亦有财气暗动之象。若梦中惊惧，宜防小事牵动心神。", psychology: "多与压力、边界感、未知变化有关，也可能是近期对某人某事保持戒备的反映。", advice: "今日凡事先看清来龙去脉，不急着表态。", related: ["梦见黑蛇", "梦见蛇咬人", "梦见大蛇"] },
    { id: "black-snake", title: "梦见黑蛇", keywords: ["黑蛇", "黑色的蛇"], category: "动物", traditional: "黑蛇多有暗处之象，传统上主隐忧、暗财或未明之事。", psychology: "可能代表被压住的担心，或对某个不确定关系的敏感。", advice: "今日宜少做猜测，多求证事实。", related: ["梦见蛇", "梦见被蛇追", "梦见蛇咬人"] },
    { id: "snake-bite", title: "梦见蛇咬人", keywords: ["蛇咬", "被蛇咬", "蛇咬人"], category: "动物", traditional: "蛇咬之梦，传统多作冲动、惊扰、财动或口舌之象。", psychology: "常见于情绪被触动、关系中有压迫感，或担心被某件事伤到。", advice: "今日说话留余地，不把小摩擦放大。", related: ["梦见蛇", "梦见黑蛇", "梦见虫子"] },
    { id: "pregnant", title: "梦见怀孕", keywords: ["怀孕", "有孕", "孕妇", "怀了孩子"], category: "身体", traditional: "怀孕之梦多主孕育、成形、事有新机，未必专指胎孕。", psychology: "可能象征一个计划、关系或新身份正在形成。", advice: "今日适合耐心培养，不必急着求结果。", related: ["梦见孩子", "梦见婴儿", "梦见结婚"] },
    { id: "dead-relative", title: "梦见已故亲人", keywords: ["已故亲人", "去世亲人", "过世亲人", "亡人", "去世的人"], category: "亲人", traditional: "亡亲入梦，多为思念牵系，也有提醒慎言慎行、珍惜当下之意。", psychology: "常与怀念、未说完的话、生活转折时的情感依靠有关。", advice: "今日可整理心绪，给家人一句问候。", related: ["梦见父母", "梦见老人", "梦见哭"] },
    { id: "ex", title: "梦见前任", keywords: ["前任", "前男友", "前女友", "旧爱", "旧情人"], category: "情感", traditional: "旧人入梦，传统多作旧事未尽、心绪回响之象。", psychology: "不一定是旧情复燃，也可能是你在比较过去与现在的关系模式。", advice: "今日不宜被回忆牵走，先安顿当下。", related: ["梦见结婚", "梦见吵架", "梦见喜欢的人"] },
    { id: "teeth", title: "梦见掉牙", keywords: ["掉牙", "牙掉", "牙齿掉", "牙齿松"], category: "身体", traditional: "齿牙在传统梦象中常连亲缘、口舌与根基，掉牙多主牵挂或言语需慎。", psychology: "常见于紧张、焦虑、表达受阻，也可能与身体不适有关。", advice: "今日少言多听，照顾身体与家人。", related: ["梦见流血", "梦见生病", "梦见吵架"] },
    { id: "water", title: "梦见水", keywords: ["水", "大水", "清水", "浑水", "涨水"], category: "自然", traditional: "水主流动与财气，清则顺，浊则扰，涨水多主事势渐起。", psychology: "水常代表情绪流动，梦中水势反映近期心境强弱。", advice: "今日顺势而行，避免情绪化决定。", related: ["梦见河", "梦见海", "梦见下雨"] },
    { id: "river", title: "梦见河流", keywords: ["河", "河流", "过河", "河水"], category: "自然", traditional: "河流多主行程、财路与阶段转换，过河则有渡关之象。", psychology: "可能表示你正在经历一段变化，需要寻找稳定路径。", advice: "今日宜一步一步过，不急着跳到终点。", related: ["梦见水", "梦见桥", "梦见船"] },
    { id: "sea", title: "梦见大海", keywords: ["海", "大海", "海浪", "海边"], category: "自然", traditional: "海象广大，传统多主胸怀、远行、财气或大势未定。", psychology: "可能表示情绪容量变大，也可能是对未知未来的想象。", advice: "今日把大事拆小，心就稳了。", related: ["梦见水", "梦见船", "梦见风浪"] },
    { id: "rain", title: "梦见下雨", keywords: ["下雨", "大雨", "小雨", "淋雨"], category: "自然", traditional: "雨有润泽之意，小雨多主缓和，大雨则主情绪与事务冲刷。", psychology: "可能与释放压力、清理旧情绪有关。", advice: "今日适合把积压的事慢慢说开。", related: ["梦见水", "梦见伞", "梦见洪水"] },
    { id: "fire", title: "梦见火", keywords: ["火", "着火", "大火", "火灾"], category: "自然", traditional: "火主明照与旺气，也主躁动。火势可控则吉，失控则宜慎。", psychology: "常与欲望、怒气、行动力或焦灼感有关。", advice: "今日有热情是好事，但别让急火伤人。", related: ["梦见灯", "梦见爆炸", "梦见房子着火"] },
    { id: "house-fire", title: "梦见房子着火", keywords: ["房子着火", "家里着火", "屋里着火"], category: "居所", traditional: "宅中见火，传统多作家事有动、气象转旺或情绪需调之象。", psychology: "可能反映家庭压力、空间安全感被触动。", advice: "今日处理家事宜温和，不要把话说满。", related: ["梦见火", "梦见房子", "梦见搬家"] },
    { id: "money", title: "梦见钱", keywords: ["钱", "现金", "捡钱", "很多钱"], category: "财物", traditional: "钱财入梦多主得失心、财气动，也有提醒守财之意。", psychology: "可能与价值感、安全感、现实压力有关。", advice: "今日适合整理账目，少做冲动消费。", related: ["梦见捡钱", "梦见丢钱", "梦见金子"] },
    { id: "lost-money", title: "梦见丢钱", keywords: ["丢钱", "钱丢了", "钱包丢了"], category: "财物", traditional: "丢钱之梦，传统多为破耗提醒，亦可作舍旧得新之象。", psychology: "反映你对损失、错过或掌控感下降的担心。", advice: "今日看好细节，重要信息再确认一次。", related: ["梦见钱", "梦见钱包", "梦见被偷"] },
    { id: "gold", title: "梦见金子", keywords: ["金子", "黄金", "金条", "金饰"], category: "财物", traditional: "金为贵重之物，传统多主机会、名利与得失并见。", psychology: "可能代表你正在重估自身价值，或期待外界认可。", advice: "今日有机会也要稳住，不露锋芒更好。", related: ["梦见钱", "梦见首饰", "梦见宝石"] },
    { id: "wedding", title: "梦见结婚", keywords: ["结婚", "婚礼", "嫁人", "娶妻"], category: "情感", traditional: "婚嫁入梦，多主关系合和、身份转变，也有责任将至之象。", psychology: "可能反映你对承诺、合作、亲密关系的思考。", advice: "今日适合沟通关系边界，少用试探。", related: ["梦见前任", "梦见喜欢的人", "梦见怀孕"] },
    { id: "quarrel", title: "梦见吵架", keywords: ["吵架", "争吵", "骂人", "被骂"], category: "情绪", traditional: "争吵之梦，多主口舌之气外显，醒后宜和缓。", psychology: "可能是白天压住的情绪在梦里释放。", advice: "今日先听完再回应，别急着争输赢。", related: ["梦见哭", "梦见打架", "梦见前任"] },
    { id: "cry", title: "梦见哭", keywords: ["哭", "大哭", "流泪", "哭醒"], category: "情绪", traditional: "哭有宣泄之象，传统也有忧去喜来之说。", psychology: "常见于情绪积累，需要被看见和安慰。", advice: "今日给自己留一点安静时间。", related: ["梦见吵架", "梦见已故亲人", "梦见雨"] },
    { id: "fight", title: "梦见打架", keywords: ["打架", "打人", "被打", "斗殴"], category: "情绪", traditional: "打斗之梦多主冲突、竞争、气不相让。", psychology: "可能反映现实中有压抑的攻击性或自我保护需求。", advice: "今日先退一步，胜在不被情绪牵动。", related: ["梦见吵架", "梦见被追", "梦见刀"] },
    { id: "chased", title: "梦见被追", keywords: ["被追", "追赶", "逃跑", "被人追"], category: "情绪", traditional: "被追多主心有牵迫，事有未解。", psychology: "常与逃避压力、截止期限或关系压力有关。", advice: "今日把最怕面对的一件事拆成小步。", related: ["梦见迷路", "梦见蛇", "梦见打架"] },
    { id: "lost", title: "梦见迷路", keywords: ["迷路", "找不到路", "走丢"], category: "行路", traditional: "迷路之梦，多主方向未明，行事需问路择向。", psychology: "可能表示你对选择、未来或身份定位感到犹豫。", advice: "今日不急着定终局，先找到下一步。", related: ["梦见路", "梦见桥", "梦见考试"] },
    { id: "flying", title: "梦见飞行", keywords: ["飞", "飞行", "飞起来", "在天上飞"], category: "行路", traditional: "飞行多主心气上扬、欲越旧境。飞得稳则顺，坠落则宜收。", psychology: "代表自由感、突破欲，也可能是想摆脱束缚。", advice: "今日可以立愿，但要记得落地。", related: ["梦见坠落", "梦见高处", "梦见天空"] },
    { id: "falling", title: "梦见坠落", keywords: ["坠落", "掉下去", "从高处掉", "摔下去"], category: "行路", traditional: "坠落多主失衡之象，行事宜稳。", psychology: "常与失控感、焦虑或睡眠中的身体反应有关。", advice: "今日别把自己逼太紧，先恢复节奏。", related: ["梦见飞行", "梦见高处", "梦见楼梯"] },
    { id: "exam", title: "梦见考试", keywords: ["考试", "考卷", "考场", "迟到考试"], category: "事务", traditional: "考试之梦，多主检验、压力与名分。", psychology: "常见于责任感较强或近期被评价压力牵动。", advice: "今日按清单推进，不要临时慌乱。", related: ["梦见上学", "梦见迟到", "梦见老师"] },
    { id: "late", title: "梦见迟到", keywords: ["迟到", "赶不上", "误点", "错过车"], category: "事务", traditional: "迟到错过，多主时机之忧，宜守时守信。", psychology: "可能反映你担心错失机会或没有准备好。", advice: "今日重要安排提前十分钟。", related: ["梦见考试", "梦见坐车", "梦见迷路"] },
    { id: "car", title: "梦见坐车", keywords: ["坐车", "开车", "汽车", "公交", "火车"], category: "行路", traditional: "车为行运之象，车稳则事顺，车乱则节奏不稳。", psychology: "代表人生方向、节奏感与控制权。", advice: "今日看清谁在掌舵，自己的节奏要稳。", related: ["梦见迟到", "梦见路", "梦见车祸"] },
    { id: "accident", title: "梦见车祸", keywords: ["车祸", "撞车", "翻车"], category: "行路", traditional: "车祸之梦，多作惊扰与失衡提醒，出行宜谨慎。", psychology: "可能是对冲突、失控或高压节奏的担心。", advice: "今日慢行慢言，重要决定不抢一时。", related: ["梦见坐车", "梦见流血", "梦见被追"] },
    { id: "blood", title: "梦见流血", keywords: ["流血", "出血", "血"], category: "身体", traditional: "血主气血与耗损，也有财气流动之象。", psychology: "可能与精力透支、受伤感或强烈情绪有关。", advice: "今日先补精神，再谈效率。", related: ["梦见掉牙", "梦见受伤", "梦见刀"] },
    { id: "illness", title: "梦见生病", keywords: ["生病", "发烧", "医院", "看病"], category: "身体", traditional: "病梦多为身心提醒，未必真病，宜调养。", psychology: "可能反映疲惫、焦虑或对健康的关注。", advice: "今日别硬撑，身体的小信号要听见。", related: ["梦见医院", "梦见流血", "梦见医生"] },
    { id: "hospital", title: "梦见医院", keywords: ["医院", "医生", "打针", "住院"], category: "身体", traditional: "医院多主修复、调理，也主对损耗的觉察。", psychology: "可能表示你希望某件事被处理、被疗愈。", advice: "今日适合修补关系或处理旧问题。", related: ["梦见生病", "梦见流血", "梦见亲人"] },
    { id: "child", title: "梦见孩子", keywords: ["孩子", "小孩", "儿童", "儿子", "女儿"], category: "亲人", traditional: "孩子多主新生、牵挂、未成之事。", psychology: "可能代表内在柔软的一面，或一个需要照顾的新计划。", advice: "今日对新事多一点耐心。", related: ["梦见婴儿", "梦见怀孕", "梦见家人"] },
    { id: "baby", title: "梦见婴儿", keywords: ["婴儿", "宝宝", "抱小孩", "新生儿"], category: "亲人", traditional: "婴儿为新机初生，亦主柔弱需护。", psychology: "可能代表新想法、新关系，或内在需要被照顾。", advice: "今日不求快，先把基础护好。", related: ["梦见孩子", "梦见怀孕", "梦见哭"] },
    { id: "parents", title: "梦见父母", keywords: ["父母", "爸爸", "妈妈", "母亲", "父亲"], category: "亲人", traditional: "父母入梦，多主根基、牵挂与家运。", psychology: "可能与安全感、责任感或亲密关系模式有关。", advice: "今日给家里一个问候，也给自己一点安稳。", related: ["梦见已故亲人", "梦见家", "梦见吵架"] },
    { id: "home", title: "梦见家", keywords: ["家", "老家", "回家", "家里"], category: "居所", traditional: "家宅之梦，主根基、归处与内心安定。", psychology: "可能反映安全感需求，或对过去生活状态的回望。", advice: "今日整理居所，也是在整理心。", related: ["梦见房子", "梦见搬家", "梦见父母"] },
    { id: "house", title: "梦见房子", keywords: ["房子", "屋子", "楼房", "新房"], category: "居所", traditional: "房屋多主自身格局与家宅气象，新旧破整各有所象。", psychology: "常代表自我空间、身份边界或生活结构。", advice: "今日适合整理空间，明确界限。", related: ["梦见家", "梦见搬家", "梦见房子着火"] },
    { id: "move", title: "梦见搬家", keywords: ["搬家", "搬走", "换房"], category: "居所", traditional: "搬家多主变动迁移，旧局将改。", psychology: "可能说明你正在准备离开旧习惯或旧关系。", advice: "今日可先做小改变，不必一步到位。", related: ["梦见房子", "梦见家", "梦见迷路"] },
    { id: "cat", title: "梦见猫", keywords: ["猫", "小猫", "黑猫", "白猫"], category: "动物", traditional: "猫多主机敏、暗事与人情微妙。", psychology: "可能反映独立、敏感，或对关系距离的拿捏。", advice: "今日看破不说破，留一点余地。", related: ["梦见狗", "梦见老鼠", "梦见蛇"] },
    { id: "dog", title: "梦见狗", keywords: ["狗", "小狗", "被狗咬", "狗叫"], category: "动物", traditional: "狗多主守护、朋友、忠信，也可能提示口舌。", psychology: "可能与信任、安全感、伙伴关系有关。", advice: "今日识人看行动，不只听言语。", related: ["梦见猫", "梦见被咬", "梦见朋友"] },
    { id: "mouse", title: "梦见老鼠", keywords: ["老鼠", "耗子", "鼠"], category: "动物", traditional: "鼠多主暗耗、小扰、细事侵心。", psychology: "可能代表你对琐事、漏洞或被消耗的敏感。", advice: "今日先补小漏洞，别让小事拖大。", related: ["梦见猫", "梦见虫子", "梦见被偷"] },
    { id: "fish", title: "梦见鱼", keywords: ["鱼", "抓鱼", "很多鱼", "金鱼"], category: "动物", traditional: "鱼有余庆之意，多主财气、顺水与机缘。", psychology: "可能代表机会、情感流动和内在资源。", advice: "今日机会在流动中出现，宜主动但不贪。", related: ["梦见水", "梦见钱", "梦见河"] },
    { id: "bird", title: "梦见鸟", keywords: ["鸟", "飞鸟", "鸟叫", "鸟飞"], category: "动物", traditional: "鸟主消息、远意与轻灵。", psychology: "可能表示想表达、想离开束缚或期待新消息。", advice: "今日适合传递消息，但言辞宜清。", related: ["梦见飞行", "梦见天空", "梦见树"] },
    { id: "flower", title: "梦见花", keywords: ["花", "鲜花", "花开", "桃花"], category: "植物", traditional: "花开多主喜象、人缘与美事，但花谢则宜惜时。", psychology: "可能代表被看见、被喜欢或对美好关系的期待。", advice: "今日温柔待人，人缘自来。", related: ["梦见树", "梦见草", "梦见结婚"] },
    { id: "tree", title: "梦见树", keywords: ["树", "大树", "树木", "爬树"], category: "植物", traditional: "树主根基、生长与家业。树茂则旺，树枯则需养。", psychology: "可能反映成长、支持系统和长期目标。", advice: "今日少求速成，多护根本。", related: ["梦见花", "梦见山", "梦见家"] },
    { id: "mountain", title: "梦见山", keywords: ["山", "高山", "爬山", "山路"], category: "自然", traditional: "山主阻隔、靠山与目标。登山则主进取。", psychology: "可能代表挑战、压力，也代表你正在寻找支撑。", advice: "今日难事慢走，也能到顶。", related: ["梦见迷路", "梦见树", "梦见路"] },
    { id: "bridge", title: "梦见桥", keywords: ["桥", "过桥", "桥断"], category: "行路", traditional: "桥为通达之象，过桥主转换，桥断则需谨慎。", psychology: "可能表示你正在跨越一个阶段或关系界线。", advice: "今日沟通是桥，别轻易拆桥。", related: ["梦见河", "梦见路", "梦见迷路"] },
    { id: "knife", title: "梦见刀", keywords: ["刀", "拿刀", "被刀伤"], category: "器物", traditional: "刀主决断、锋芒与冲突。见刀宜慎言行。", psychology: "可能反映攻击性、防御心或想切断某事。", advice: "今日做决定可以果断，但不要伤人。", related: ["梦见流血", "梦见打架", "梦见剪刀"] },
    { id: "toilet", title: "梦见厕所", keywords: ["厕所", "上厕所", "找厕所", "卫生间"], category: "居所", traditional: "厕所多主排浊去秽，也有隐私与尴尬之象。", psychology: "可能代表想释放压力，或需要处理不愿面对的小事。", advice: "今日把该清理的清理掉，心会轻。", related: ["梦见水", "梦见脏东西", "梦见迷路"] },
    { id: "coffin", title: "梦见棺材", keywords: ["棺材", "棺木", "出殡"], category: "仪象", traditional: "棺材在传统梦象中常取“官财”谐意，也主旧事收束。", psychology: "可能表示一个阶段结束，或你正在告别旧压力。", advice: "今日适合收尾，不必害怕结束。", related: ["梦见已故亲人", "梦见坟墓", "梦见哭"] },
    { id: "grave", title: "梦见坟墓", keywords: ["坟", "坟墓", "墓地", "上坟"], category: "仪象", traditional: "坟墓多主追远、旧事、根脉与收藏。", psychology: "可能与怀旧、告别、家族记忆或压住的情绪有关。", advice: "今日把旧事安放好，向前走。", related: ["梦见棺材", "梦见已故亲人", "梦见山"] }
  ];

  function normalize(input) {
    return String(input || "").trim().toLowerCase().replace(/\s+/g, "");
  }

  function findDreamResult(input) {
    const text = normalize(input);
    if (!text) return null;
    const matches = [];
    dreamData.forEach(item => {
      item.keywords.forEach(keyword => {
        const key = normalize(keyword);
        if (key && text.includes(key)) matches.push({ item, length: key.length });
      });
    });
    matches.sort((a, b) => b.length - a.length);
    return matches[0]?.item || null;
  }

  function getHotDreamTags(limit = 5) {
    const preferred = ["snake", "ex", "teeth", "pregnant", "dead-relative"];
    return preferred.map(id => dreamData.find(item => item.id === id)).filter(Boolean).slice(0, limit);
  }

  window.dreamData = dreamData;
  window.findDreamResult = findDreamResult;
  window.getHotDreamTags = getHotDreamTags;
})();
