import { useMemo, useState } from "react";
import "./App.css";

const planets = {
  Mars: {
    labelKey: "mars",
    modes: {
      surface: {
        labelKey: "surface",
        temperature: -63,
        pressure: 0.006,
        radiation: 1.0,
        water: 0.03,
        uv: 1.0,
        toxicity: 0.85,
        nutrients: 0.1,
        tempStability: 0.1,
        protection: 0.0,
      },
      subsurface: {
        labelKey: "subsurface",
        temperature: -15,
        pressure: 0.12,
        radiation: 0.45,
        water: 0.2,
        uv: 0.05,
        toxicity: 0.55,
        nutrients: 0.25,
        tempStability: 0.65,
        protection: 0.45,
      },
      water_pocket: {
        labelKey: "waterPocket",
        temperature: 2,
        pressure: 0.5,
        radiation: 0.25,
        water: 0.75,
        uv: 0.02,
        toxicity: 0.35,
        nutrients: 0.45,
        tempStability: 0.75,
        protection: 0.65,
      },
      symbiotic_biofilm: {
        labelKey: "symbioticBiofilm",
        temperature: 8,
        pressure: 0.7,
        radiation: 0.22,
        water: 0.65,
        uv: 0.03,
        toxicity: 0.25,
        nutrients: 0.6,
        tempStability: 0.8,
        protection: 0.75,
      },
      artificial_habitat: {
        labelKey: "artificialHabitat",
        temperature: 22,
        pressure: 1.0,
        radiation: 0.08,
        water: 0.85,
        uv: 0.01,
        toxicity: 0.1,
        nutrients: 0.8,
        tempStability: 0.95,
        protection: 0.9,
      },
    },
  },

  Venus: {
    labelKey: "venus",
    modes: {
      upper_clouds: {
        labelKey: "upperClouds",
        temperature: 30,
        pressure: 0.8,
        radiation: 0.55,
        water: 0.25,
        uv: 0.75,
        toxicity: 0.9,
        nutrients: 0.2,
        tempStability: 0.6,
        protection: 0.35,
      },
      lower_clouds: {
        labelKey: "lowerClouds",
        temperature: 75,
        pressure: 2.0,
        radiation: 0.45,
        water: 0.12,
        uv: 0.55,
        toxicity: 0.95,
        nutrients: 0.15,
        tempStability: 0.5,
        protection: 0.25,
      },
      artificial_habitat_venus: {
        labelKey: "venusHabitat",
        temperature: 24,
        pressure: 1.0,
        radiation: 0.15,
        water: 0.75,
        uv: 0.05,
        toxicity: 0.18,
        nutrients: 0.75,
        tempStability: 0.9,
        protection: 0.85,
      },
    },
  },
};

const organisms = {
  Staphylococcus_epidermidis: {
    labelKey: "staphylococcus",
    name: "Staphylococcus epidermidis",
    optimalTemp: 37,
    cold: 0.35,
    radiation: 0.2,
    dryness: 0.6,
    membrane: 0.55,
    biofilm: 0.9,
    dna: 0.45,
    metabolism: 0.5,
    dormancy: 0.3,
  },
  Deinococcus_radiodurans: {
    labelKey: "deinococcus",
    name: "Deinococcus radiodurans",
    optimalTemp: 30,
    cold: 0.45,
    radiation: 0.95,
    dryness: 0.75,
    membrane: 0.75,
    biofilm: 0.45,
    dna: 0.95,
    metabolism: 0.55,
    dormancy: 0.5,
  },
  Bacillus_subtilis: {
    labelKey: "bacillus",
    name: "Bacillus subtilis",
    optimalTemp: 30,
    cold: 0.5,
    radiation: 0.55,
    dryness: 0.85,
    membrane: 0.65,
    biofilm: 0.65,
    dna: 0.65,
    metabolism: 0.55,
    dormancy: 0.95,
  },
};

const translations = {
  en: {
    title: "Evolution Simulator",
    subtitle: "Simulation of possible adaptation of Earth organisms in Mars and Venus environments.",
    authorName: "Yelizaveta Bykovskaya, Grade 9 \"V\"",
    planet: "Planet",
    organism: "Organism",
    symbiosisPartner: "Symbiosis partner",
    mode: "Environment",
    generations: "Generations",
    population: "Population",
    run: "Run simulation",
    result: "Simulation result",
    scoreExplanation: "Survival percentage — shows what part of the starting population survived by the end of the simulation.",
    status: "Status",
    finalPopulation: "Final population",
    pressure: "Environment pressure summary",
    traits: "Trait changes",
    chart: "Environment score by generation",
    populationChart: "Population by generation",
    adaptations: "Likely adaptations",
    radiation: "Radiation",
    water: "Water",
    uv: "UV load",
    toxicity: "Toxicity",
    nutrients: "Nutrient scarcity",
    tempInstability: "Temperature instability",
    cold: "Cold resistance",
    dryness: "Dryness resistance",
    membrane: "Membrane stability",
    biofilm: "Biofilm formation",
    dna: "DNA repair",
    metabolism: "Metabolic flexibility",
    dormancy: "Dormancy",
    extinction: "Population became critically low in this simulation.",
    survived: "Population survived through the simulation.",
    extinctStatus: "Critical",
    highStatus: "High",
    moderateStatus: "Moderate",
    lowStatus: "Low",
    veryLowStatus: "Very low",
    mars: "Mars",
    venus: "Venus",
    surface: "Surface",
    subsurface: "Subsurface niche",
    waterPocket: "Protected water pocket",
    symbioticBiofilm: "Symbiotic biofilm niche",
    artificialHabitat: "Artificial habitat",
    upperClouds: "Upper cloud layer",
    lowerClouds: "Lower cloud layer",
    venusHabitat: "Venus artificial habitat",
    staphylococcus: "Staphylococcus epidermidis",
    deinococcus: "Deinococcus radiodurans",
    bacillus: "Bacillus subtilis",
    adapt_cold: "Increased cold resistance",
    adapt_radiation: "Increased radiation resistance",
    adapt_dryness: "Increased dryness resistance",
    adapt_membrane: "Increased membrane stability",
    adapt_biofilm: "Stronger biofilm formation",
    adapt_dna: "Improved DNA repair",
    adapt_metabolism: "More flexible metabolism",
    adapt_dormancy: "Stronger dormancy ability",
    noAdaptations: "No strong adaptation was selected in this run.",
    chartYScore: "Y: environment score, %",
    chartYPopulation: "Y: population size",
    chartX: "X: generations",
  },

  ru: {
    title: "Симулятор эволюции",
    subtitle: "Симуляция возможной адаптации земных организмов в условиях Марса и Венеры.",
    authorName: "Елизавета Быковская, 9 «В» класс",
    planet: "Планета",
    organism: "Организм",
    symbiosisPartner: "Партнёр по симбиозу",
    mode: "Среда",
    generations: "Поколения",
    population: "Популяция",
    run: "Запустить симуляцию",
    result: "Результат симуляции",
    scoreExplanation: "Процент выживания — показывает, какая часть начальной популяции сохранилась к концу симуляции.",
    status: "Статус",
    finalPopulation: "Финальная популяция",
    pressure: "Давление среды",
    traits: "Изменение признаков",
    chart: "Индекс среды по поколениям",
    populationChart: "Популяция по поколениям",
    adaptations: "Вероятные адаптации",
    radiation: "Радиация",
    water: "Вода",
    uv: "УФ-нагрузка",
    toxicity: "Токсичность",
    nutrients: "Нехватка питательных веществ",
    tempInstability: "Нестабильность температуры",
    cold: "Устойчивость к холоду",
    dryness: "Устойчивость к сухости",
    membrane: "Стабильность мембраны",
    biofilm: "Биоплёнка",
    dna: "Восстановление ДНК",
    metabolism: "Метаболическая гибкость",
    dormancy: "Способность к покою",
    extinction: "В этой симуляции популяция очень сильно сократилась.",
    survived: "Популяция сохранилась до конца симуляции.",
    extinctStatus: "Критично",
    highStatus: "Высокий",
    moderateStatus: "Средний",
    lowStatus: "Низкий",
    veryLowStatus: "Очень низкий",
    mars: "Марс",
    venus: "Венера",
    surface: "Поверхность",
    subsurface: "Подповерхностная ниша",
    waterPocket: "Защищённый водный карман",
    symbioticBiofilm: "Симбиотическая биоплёнка",
    artificialHabitat: "Искусственная среда",
    upperClouds: "Верхний облачный слой",
    lowerClouds: "Нижний облачный слой",
    venusHabitat: "Искусственная среда Венеры",
    staphylococcus: "Стафилококк эпидермальный",
    deinococcus: "Дейнококк радиоустойчивый",
    bacillus: "Сенная палочка",
    adapt_cold: "Усиление устойчивости к холоду",
    adapt_radiation: "Усиление устойчивости к радиации",
    adapt_dryness: "Усиление устойчивости к сухости",
    adapt_membrane: "Усиление стабильности мембраны",
    adapt_biofilm: "Усиление образования биоплёнки",
    adapt_dna: "Улучшение восстановления ДНК",
    adapt_metabolism: "Более гибкий метаболизм",
    adapt_dormancy: "Усиление способности к покою",
    noAdaptations: "В этом запуске сильная адаптация не выбралась.",
    chartYScore: "Y: индекс среды, %",
    chartYPopulation: "Y: размер популяции",
    chartX: "X: поколения",
  },

  kk: {
    title: "Эволюция симуляторы",
    subtitle: "Жердегі ағзалардың Марс және Шолпан жағдайларына бейімделуін модельдеу.",
    authorName: "Елизавета Быковская, 9 «В» сыныбы",
    planet: "Ғаламшар",
    organism: "Ағза",
    symbiosisPartner: "Симбиоз серіктесі",
    mode: "Орта",
    generations: "Ұрпақ саны",
    population: "Дарақтар саны",
    run: "Симуляцияны бастау",
    result: "Симуляция нәтижесі",
    scoreExplanation: "Тірі қалу пайызы — бастапқы популяцияның қанша бөлігі симуляция соңына дейін сақталғанын көрсетеді.",
    status: "Күйі",
    finalPopulation: "Соңғы популяция",
    pressure: "Орта қысымының қысқаша сипаттамасы",
    traits: "Белгілердің өзгеруі",
    chart: "Ұрпақтар бойынша орта индексі",
    populationChart: "Ұрпақтар бойынша популяция",
    adaptations: "Мүмкін бейімделулер",
    radiation: "Сәулелену",
    water: "Су",
    uv: "УК сәулесі",
    toxicity: "Улылық",
    nutrients: "Қоректік заттардың тапшылығы",
    tempInstability: "Температура тұрақсыздығы",
    cold: "Суыққа төзімділік",
    dryness: "Құрғақтыққа төзімділік",
    membrane: "Мембрана тұрақтылығы",
    biofilm: "Биоқабықша",
    dna: "ДНҚ қалпына келуі",
    metabolism: "Метаболизм икемділігі",
    dormancy: "Тыныштық күйі",
    extinction: "Бұл симуляцияда популяция өте қатты азайды.",
    survived: "Популяция симуляция соңына дейін сақталды.",
    extinctStatus: "Қауіпті",
    highStatus: "Жоғары",
    moderateStatus: "Орташа",
    lowStatus: "Төмен",
    veryLowStatus: "Өте төмен",
    mars: "Марс",
    venus: "Шолпан",
    surface: "Беткі қабат",
    subsurface: "Жер асты аймағы",
    waterPocket: "Қорғалған су қалтасы",
    symbioticBiofilm: "Симбиотикалық биоқабықша",
    artificialHabitat: "Жасанды орта",
    upperClouds: "Жоғарғы бұлт қабаты",
    lowerClouds: "Төменгі бұлт қабаты",
    venusHabitat: "Шолпанның жасанды ортасы",
    staphylococcus: "Эпидермальды стафилококк",
    deinococcus: "Радиацияға төзімді дейнококк",
    bacillus: "Пішен таяқшасы",
    adapt_cold: "Суыққа төзімділіктің артуы",
    adapt_radiation: "Радиацияға төзімділіктің артуы",
    adapt_dryness: "Құрғақтыққа төзімділіктің артуы",
    adapt_membrane: "Мембрана тұрақтылығының артуы",
    adapt_biofilm: "Биоқабықша түзу қабілетінің артуы",
    adapt_dna: "ДНҚ қалпына келуінің жақсаруы",
    adapt_metabolism: "Метаболизм икемділігінің артуы",
    adapt_dormancy: "Тыныштық күйіне өту қабілетінің артуы",
    noAdaptations: "Бұл іске қосуда күшті бейімделу таңдалмады.",
    chartYScore: "Y: орта индексі, %",
    chartYPopulation: "Y: популяция саны",
    chartX: "X: ұрпақтар",
  },

  zh: {
    title: "进化模拟器",
    subtitle: "模拟地球生物在火星和金星环境中的潜在适应。",
    authorName: "叶丽扎维塔·贝科夫斯卡娅，9 “V” 班",
    planet: "行星",
    organism: "生物",
    symbiosisPartner: "共生伙伴",
    mode: "环境",
    generations: "代数",
    population: "种群",
    run: "开始模拟",
    result: "模拟结果",
    scoreExplanation: "存活百分比 — 显示初始种群中有多少比例在模拟结束时存活下来。",
    status: "状态",
    finalPopulation: "最终种群",
    pressure: "环境压力总结",
    traits: "特征变化",
    chart: "各代环境指数",
    populationChart: "各代种群",
    adaptations: "可能适应方向",
    radiation: "辐射",
    water: "水分",
    uv: "紫外线",
    toxicity: "毒性",
    nutrients: "营养稀缺",
    tempInstability: "温度不稳定",
    cold: "耐寒性",
    dryness: "抗干燥性",
    membrane: "膜稳定性",
    biofilm: "生物膜",
    dna: "DNA 修复",
    metabolism: "代谢灵活性",
    dormancy: "休眠能力",
    extinction: "种群在本次模拟中严重减少。",
    survived: "种群完成了整个模拟。",
    extinctStatus: "临界",
    highStatus: "高",
    moderateStatus: "中等",
    lowStatus: "低",
    veryLowStatus: "非常低",
    mars: "火星",
    venus: "金星",
    surface: "表面",
    subsurface: "地下生态位",
    waterPocket: "受保护的水囊",
    symbioticBiofilm: "共生生物膜生态位",
    artificialHabitat: "人工栖息地",
    upperClouds: "上层云层",
    lowerClouds: "下层云层",
    venusHabitat: "金星人工栖息地",
    staphylococcus: "表皮葡萄球菌",
    deinococcus: "耐辐射奇球菌",
    bacillus: "枯草芽孢杆菌",
    adapt_cold: "耐寒性增强",
    adapt_radiation: "抗辐射性增强",
    adapt_dryness: "抗干燥性增强",
    adapt_membrane: "膜稳定性增强",
    adapt_biofilm: "生物膜形成增强",
    adapt_dna: "DNA 修复能力增强",
    adapt_metabolism: "代谢灵活性增强",
    adapt_dormancy: "休眠能力增强",
    noAdaptations: "本次运行中没有形成明显适应。",
    chartYScore: "Y: 环境指数, %",
    chartYPopulation: "Y: 种群数量",
    chartX: "X: 代数",
  },
};

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function scoreOrganism(org, env) {
  /*
    Multi-factor fitness model.
    The score is intentionally NOT just an average.
    Very harsh environments such as Mars surface should strongly reduce survival,
    even if the organism has one strong trait.
  */

  const tempDiff = Math.abs(env.temperature - org.optimalTemp);

  const coldOrHeatResistance =
    env.temperature < org.optimalTemp
      ? clamp(org.cold * 0.7 + org.dormancy * 0.3)
      : clamp(org.membrane * 0.65 + org.metabolism * 0.35);

  const tempFitness = clamp(1 - (tempDiff / 120) * (1 - coldOrHeatResistance));

  const pressureStress =
    env.pressure < 1
      ? clamp(1 - env.pressure)
      : clamp((env.pressure - 1) / 2);

  const pressureResistance = clamp(
    org.membrane * 0.5 + org.dormancy * 0.25 + org.biofilm * env.protection * 0.25
  );

  const pressureFitness = clamp(1 - pressureStress * (1 - pressureResistance));

  const radiationPressure = clamp(env.radiation * 0.7 + env.uv * 0.3);
  const radiationResistance = clamp(org.radiation * 0.65 + org.dna * 0.35);
  const radiationFitness = clamp(1 - radiationPressure * (1 - radiationResistance));

  const drynessStress = clamp(1 - env.water);
  const drynessResistance = clamp(org.dryness * 0.75 + org.dormancy * 0.25);
  const waterFitness = clamp(1 - drynessStress * (1 - drynessResistance));

  const toxicityResistance = clamp(org.membrane * 0.65 + org.metabolism * 0.2 + org.biofilm * 0.15);
  const toxicityFitness = clamp(1 - env.toxicity * (1 - toxicityResistance));

  const nutrientStress = clamp(1 - env.nutrients);
  const nutrientResistance = clamp(org.metabolism * 0.75 + org.dormancy * 0.25);
  const nutrientFitness = clamp(1 - nutrientStress * (1 - nutrientResistance));

  const stabilityStress = clamp(1 - env.tempStability);
  const stabilityResistance = clamp(org.cold * 0.45 + org.dormancy * 0.55);
  const stabilityFitness = clamp(1 - stabilityStress * (1 - stabilityResistance));

  const protectionBonus = clamp(env.protection * (0.45 + org.biofilm * 0.55));

  /*
    Hard environmental limit.
    This prevents impossible environments from giving 90%+ just because
    the organism is selected over many generations.
  */
  const hardStress = clamp(
    pressureStress * 0.22 +
      radiationPressure * 0.2 +
      drynessStress * 0.18 +
      env.toxicity * 0.14 +
      stabilityStress * 0.08 +
      clamp(tempDiff / 120) * 0.12 +
      nutrientStress * 0.06
  );

  const environmentCeiling = clamp(
    1 - hardStress * (1 - env.protection * 0.65) + protectionBonus * 0.18,
    0.03,
    0.98
  );

  /*
    Geometric mean makes one critical weakness matter.
    Example: almost no pressure + almost no water on Mars surface
    should strongly lower the final result.
  */
  const rawFitness =
    Math.pow(tempFitness, 0.18) *
    Math.pow(pressureFitness, 0.16) *
    Math.pow(radiationFitness, 0.18) *
    Math.pow(waterFitness, 0.16) *
    Math.pow(toxicityFitness, 0.12) *
    Math.pow(nutrientFitness, 0.08) *
    Math.pow(stabilityFitness, 0.07) *
    Math.pow(0.55 + protectionBonus * 0.45, 0.05);

  const score = rawFitness * environmentCeiling * 100;

  return Math.max(1, Math.min(100, Math.round(score)));
}

function mutate(value, strength = 0.025) {
  return clamp(value + (Math.random() * 2 - 1) * strength);
}

function createIndividual(base) {
  return {
    ...base,
    cold: mutate(base.cold, 0.08),
    radiation: mutate(base.radiation, 0.08),
    dryness: mutate(base.dryness, 0.08),
    membrane: mutate(base.membrane, 0.08),
    biofilm: mutate(base.biofilm, 0.08),
    dna: mutate(base.dna, 0.08),
    metabolism: mutate(base.metabolism, 0.08),
    dormancy: mutate(base.dormancy, 0.08),
  };
}

function average(pop, key) {
  if (!pop.length) return 0;
  return pop.reduce((sum, item) => sum + item[key], 0) / pop.length;
}

function createSymbioticOrganism(primaryOrg, partnerOrg) {
  return {
    ...primaryOrg,
    name: `${primaryOrg.name} + ${partnerOrg.name}`,
    optimalTemp: (primaryOrg.optimalTemp + partnerOrg.optimalTemp) / 2,
    cold: clamp(primaryOrg.cold * 0.7 + partnerOrg.cold * 0.3 + 0.04),
    radiation: clamp(primaryOrg.radiation * 0.65 + partnerOrg.radiation * 0.35 + 0.05),
    dryness: clamp(primaryOrg.dryness * 0.7 + partnerOrg.dryness * 0.3 + 0.04),
    membrane: clamp(primaryOrg.membrane * 0.7 + partnerOrg.membrane * 0.3 + 0.03),
    biofilm: clamp(Math.max(primaryOrg.biofilm, partnerOrg.biofilm) + 0.08),
    dna: clamp(primaryOrg.dna * 0.65 + partnerOrg.dna * 0.35 + 0.04),
    metabolism: clamp(primaryOrg.metabolism * 0.65 + partnerOrg.metabolism * 0.35 + 0.05),
    dormancy: clamp(primaryOrg.dormancy * 0.7 + partnerOrg.dormancy * 0.3 + 0.03),
  };
}

function runEvolution(baseOrg, env, generations, popSize) {
  const safeGenerations = Math.max(1, Math.min(1000, Number(generations) || 1));
  const safePopSize = Math.max(10, Math.min(2000, Number(popSize) || 10));

  let population = Array.from({ length: safePopSize }, () => createIndividual(baseOrg));
  const scoreHistory = [];
  const popHistory = [];
  const checkpoints = [];

  const initialScore = Math.round(
    average(
      population.map((org) => ({ score: scoreOrganism(org, env) })),
      "score"
    )
  );

  scoreHistory.push({ generation: 0, score: initialScore });
  popHistory.push({ generation: 0, size: safePopSize });

  let extinct = false;
  let extinctionGeneration = null;

  for (let g = 1; g <= safeGenerations; g++) {
    const scored = population
      .map((org) => ({ org, score: scoreOrganism(org, env) }))
      .sort((a, b) => b.score - a.score);

    const avgScore =
      scored.reduce((sum, item) => sum + item.score, 0) /
      Math.max(1, scored.length);

    const environmentalStress =
      env.radiation * 0.12 +
      env.uv * 0.08 +
      env.toxicity * 0.1 +
      (1 - env.water) * 0.1 +
      (1 - env.nutrients) * 0.06 +
      (1 - env.tempStability) * 0.06;

    const survivalRate = clamp(
      0.42 + (avgScore / 100) * 0.48 - environmentalStress * 0.18,
      0.12,
      0.92
    );

    const survivorsCount = Math.max(
      3,
      Math.min(scored.length, Math.floor(scored.length * survivalRate))
    );

    const survivors = scored.slice(0, survivorsCount).map((item) => item.org);

    const targetRatio = clamp(
      Math.pow(avgScore / 100, 1.45) - environmentalStress * 0.35,
      0.0,
      1
    );

    const targetSize = Math.round(safePopSize * targetRatio);
    const randomNoise = Math.round((Math.random() - 0.5) * safePopSize * 0.04);

    let nextSize = Math.round(population.length * 0.72 + targetSize * 0.28 + randomNoise);

    if (avgScore >= 70) {
      nextSize = Math.max(nextSize, Math.round(safePopSize * 0.35));
    } else if (avgScore >= 50) {
      nextSize = Math.max(nextSize, Math.round(safePopSize * 0.18));
    } else if (avgScore >= 30) {
      nextSize = Math.max(nextSize, Math.round(safePopSize * 0.06));
    }

    nextSize = Math.max(0, Math.min(nextSize, safePopSize));

    if (avgScore < 7 && nextSize < 4) {
      extinct = true;
      extinctionGeneration = g;
      population = [];
      scoreHistory.push({ generation: g, score: Math.round(avgScore) });
      popHistory.push({ generation: g, size: 0 });
      break;
    }

    nextSize = Math.max(3, nextSize);

    const next = [];

    while (next.length < nextSize) {
      const p1 = survivors[Math.floor(Math.random() * survivors.length)];
      const p2 = survivors[Math.floor(Math.random() * survivors.length)];

      next.push({
        ...p1,
        cold: mutate((p1.cold + p2.cold) / 2, 0.035),
        radiation: mutate((p1.radiation + p2.radiation) / 2, 0.035),
        dryness: mutate((p1.dryness + p2.dryness) / 2, 0.035),
        membrane: mutate((p1.membrane + p2.membrane) / 2, 0.035),
        biofilm: mutate((p1.biofilm + p2.biofilm) / 2, 0.035),
        dna: mutate((p1.dna + p2.dna) / 2, 0.035),
        metabolism: mutate((p1.metabolism + p2.metabolism) / 2, 0.035),
        dormancy: mutate((p1.dormancy + p2.dormancy) / 2, 0.035),
      });
    }

    population = next;

    const generationScore = population.length
      ? Math.round(
          average(
            population.map((org) => ({ score: scoreOrganism(org, env) })),
            "score"
          )
        )
      : 0;

    scoreHistory.push({ generation: g, score: generationScore });
    popHistory.push({ generation: g, size: population.length });

    if ([1, 10, 50, 100, 200, safeGenerations].includes(g)) {
      checkpoints.push({
        generation: g,
        cold: average(population, "cold"),
        radiation: average(population, "radiation"),
        dryness: average(population, "dryness"),
        membrane: average(population, "membrane"),
        biofilm: average(population, "biofilm"),
        dna: average(population, "dna"),
        metabolism: average(population, "metabolism"),
        dormancy: average(population, "dormancy"),
      });
    }
  }

  const finalScore = scoreHistory.length ? scoreHistory[scoreHistory.length - 1].score : 0;

  return {
    extinct,
    extinctionGeneration,
    initialPopulation: safePopSize,
    finalScore,
    finalPopulation: population.length,
    finalSurvivalPercent: Math.round((population.length / safePopSize) * 100),
    scoreHistory,
    popHistory,
    checkpoints,
    finalTraits: {
      cold: average(population, "cold"),
      radiation: average(population, "radiation"),
      dryness: average(population, "dryness"),
      membrane: average(population, "membrane"),
      biofilm: average(population, "biofilm"),
      dna: average(population, "dna"),
      metabolism: average(population, "metabolism"),
      dormancy: average(population, "dormancy"),
    },
  };
}

function getLikelyAdaptations(baseOrg, finalTraits, env) {
  const traits = [
    { key: "cold", pressure: Math.abs(env.temperature - baseOrg.optimalTemp) / 100 },
    { key: "radiation", pressure: env.radiation + env.uv },
    { key: "dryness", pressure: 1 - env.water },
    { key: "membrane", pressure: env.toxicity },
    { key: "biofilm", pressure: env.protection },
    { key: "dna", pressure: env.radiation + env.uv },
    { key: "metabolism", pressure: 1 - env.nutrients },
    { key: "dormancy", pressure: 1 - env.water + (1 - env.tempStability) },
  ];

  return traits
    .map((trait) => ({
      key: trait.key,
      value: finalTraits[trait.key],
      change: finalTraits[trait.key] - baseOrg[trait.key],
      importance: trait.pressure,
    }))
    .filter((trait) => trait.change > 0.015 || (trait.value > 0.7 && trait.importance > 0.4))
    .sort((a, b) => b.change + b.importance - (a.change + a.importance))
    .slice(0, 5);
}

function getChartScale(values) {
  const realMin = Math.min(...values);
  const realMax = Math.max(...values);

  if (realMax === realMin) {
    return {
      min: Math.max(0, realMin - 1),
      max: realMax + 1,
    };
  }

  const range = realMax - realMin;
  const padding = Math.max(1, Math.ceil(range * 0.12));

  return {
    min: Math.max(0, realMin - padding),
    max: realMax + padding,
  };
}

function simplifyChartData(data, keyName, maxPoints = 80) {
  if (data.length <= maxPoints) return data;

  const step = Math.ceil(data.length / maxPoints);
  const simplified = [];

  for (let i = 0; i < data.length; i += step) {
    simplified.push(data[i]);
  }

  const last = data[data.length - 1];
  if (simplified[simplified.length - 1]?.generation !== last.generation) {
    simplified.push(last);
  }

  return simplified;
}

function MiniChart({ data, keyName, yLabel, xLabel }) {
  if (!data.length) return null;

  const visibleData = simplifyChartData(data, keyName);
  const values = visibleData.map((p) => Number(p[keyName]) || 0);
  const scale = getChartScale(values);

  const points = visibleData
    .map((p, i) => {
      const value = Number(p[keyName]) || 0;
      const x = 8 + (i / Math.max(1, visibleData.length - 1)) * 86;
      const y =
        86 -
        ((value - scale.min) / Math.max(1, scale.max - scale.min)) * 76;

      return `${x},${Math.max(10, Math.min(86, y))}`;
    })
    .join(" ");

  const firstValue = Number(data[0]?.[keyName]) || 0;
  const lastValue = Number(data[data.length - 1]?.[keyName]) || 0;

  return (
    <div>
      <svg viewBox="0 0 100 100" className="chart">
        <line x1="8" y1="10" x2="8" y2="86" stroke="currentColor" strokeWidth="0.45" />
        <line x1="8" y1="86" x2="95" y2="86" stroke="currentColor" strokeWidth="0.45" />

        <text x="1" y="13" fontSize="4">{scale.max}</text>
        <text x="3" y="88" fontSize="4">{scale.min}</text>
        <text x="60" y="14" fontSize="4">start: {firstValue}</text>
        <text x="60" y="21" fontSize="4">end: {lastValue}</text>

        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <p className="chartNote">{yLabel}</p>
      <p className="chartNote">{xLabel}</p>
    </div>
  );
}


function getScoreChartDescription(data, lang) {
  if (!data || data.length < 2) return "";

  const start = Number(data[0]?.score) || 0;
  const end = Number(data[data.length - 1]?.score) || 0;
  const diff = end - start;

  if (lang === "ru") {
    if (end <= 5) return `Индекс среды остался критически низким: ${end}%. Это объясняет сильное сокращение популяции.`;
    if (diff > 5) return `Индекс среды вырос с ${start}% до ${end}%. Это показывает, что признаки популяции стали лучше соответствовать выбранной среде.`;
    if (diff < -5) return `Индекс среды снизился с ${start}% до ${end}%. Это значит, что условия среды всё ещё создают сильное давление на организм.`;
    return `Индекс среды почти не изменился: с ${start}% до ${end}%. Основной итог смотри по финальной популяции.`;
  }

  if (lang === "kk") {
    if (end <= 5) return `Орта индексі өте төмен деңгейде қалды: ${end}%. Бұл популяцияның қатты азаюын түсіндіреді.`;
    if (diff > 5) return `Орта индексі ${start}%-дан ${end}%-ға өсті. Бұл популяция белгілерінің таңдалған ортаға жақсырақ сәйкес келе бастағанын көрсетеді.`;
    if (diff < -5) return `Орта индексі ${start}%-дан ${end}%-ға төмендеді. Бұл орта жағдайлары ағзаға әлі де қатты әсер ететінін көрсетеді.`;
    return `Орта индексі айтарлықтай өзгермеді: ${start}%-дан ${end}%-ға дейін. Негізгі қорытындыны соңғы популяциядан қара.`;
  }

  if (lang === "zh") {
    if (end <= 5) return `环境指数仍然极低：${end}%。这解释了种群数量的大幅下降。`;
    if (diff > 5) return `环境指数从 ${start}% 上升到 ${end}%。这说明种群特征逐渐更符合所选环境。`;
    if (diff < -5) return `环境指数从 ${start}% 下降到 ${end}%。这说明环境条件仍然对该生物形成较强压力。`;
    return `环境指数变化不大：从 ${start}% 到 ${end}%。主要结果请看最终种群数量。`;
  }

  if (end <= 5) return `The environment score stayed critically low at ${end}%, explaining the strong population decrease.`;
  if (diff > 5) return `The environment score increased from ${start}% to ${end}%, showing that the population traits became better suited to the selected environment.`;
  if (diff < -5) return `The environment score decreased from ${start}% to ${end}%, meaning the environment still created strong pressure on this organism.`;
  return `The environment score stayed almost stable, changing from ${start}% to ${end}%. The main outcome is shown by the final population.`;
}

function getPopulationChartDescription(data, lang) {
  if (!data || data.length < 2) return "";

  const start = Number(data[0]?.size) || 0;
  const end = Number(data[data.length - 1]?.size) || 0;
  const diff = end - start;

  if (lang === "ru") {
    if (end === 0) return `Популяция сократилась с ${start} до 0. Это полностью совпадает с финальной популяцией в результате симуляции.`;
    if (diff > 0) return `Популяция выросла с ${start} до ${end}. Это совпадает с финальным значением популяции.`;
    if (diff < 0) return `Популяция сократилась с ${start} до ${end}. Это совпадает с финальной популяцией и показывает действие естественного отбора.`;
    return `Популяция осталась стабильной: ${end}. Это совпадает с финальным значением.`;
  }

  if (lang === "kk") {
    if (end === 0) return `Популяция ${start}-ден 0-ге дейін азайды. Бұл симуляция нәтижесіндегі соңғы популяциямен толық сәйкес келеді.`;
    if (diff > 0) return `Популяция ${start}-ден ${end}-ге өсті. Бұл соңғы популяция мәнімен сәйкес келеді.`;
    if (diff < 0) return `Популяция ${start}-ден ${end}-ге азайды. Бұл соңғы популяциямен сәйкес келеді және табиғи сұрыпталуды көрсетеді.`;
    return `Популяция тұрақты қалды: ${end}. Бұл соңғы мәнмен сәйкес келеді.`;
  }

  if (lang === "zh") {
    if (end === 0) return `种群数量从 ${start} 减少到 0。这与模拟结果中的最终种群完全一致。`;
    if (diff > 0) return `种群数量从 ${start} 增加到 ${end}。这与最终种群值一致。`;
    if (diff < 0) return `种群数量从 ${start} 减少到 ${end}。这与最终种群值一致，并体现了自然选择。`;
    return `种群数量保持稳定：${end}。这与最终值一致。`;
  }

  if (end === 0) return `The population decreased from ${start} to 0. This fully matches the final population in the simulation result.`;
  if (diff > 0) return `The population increased from ${start} to ${end}, matching the final population value.`;
  if (diff < 0) return `The population decreased from ${start} to ${end}, matching the final population and showing natural selection.`;
  return `The population stayed stable at ${end}, matching the final value.`;
}

function Bar({ label, value }) {
  const percent = Math.round(clamp(value) * 100);
  return (
    <div className="barBox">
      <div className="barTop">
        <span>{label}</span>
        <b>{percent}%</b>
      </div>
      <div className="bar">
        <div className="barFill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [planet, setPlanet] = useState("Mars");
  const [organism, setOrganism] = useState("Staphylococcus_epidermidis");
  const [symbiosisPartner, setSymbiosisPartner] = useState("Deinococcus_radiodurans");
  const [mode, setMode] = useState("subsurface");
  const [generations, setGenerations] = useState(300);
  const [population, setPopulation] = useState(200);
  const [result, setResult] = useState(null);

  const t = translations[lang] || translations.en;
  const env = planets[planet].modes[mode];
  const org = organisms[organism];

  const availablePartners = Object.keys(organisms).filter((key) => key !== organism);
  const realPartnerKey = availablePartners.includes(symbiosisPartner)
    ? symbiosisPartner
    : availablePartners[0];

  const partnerOrg = organisms[realPartnerKey];

  const simulationOrg = useMemo(() => {
    if (mode === "symbiotic_biofilm" && partnerOrg) {
      return createSymbioticOrganism(org, partnerOrg);
    }

    return org;
  }, [mode, org, partnerOrg]);

  const organismTitle =
    mode === "symbiotic_biofilm" && partnerOrg
      ? `${t[org.labelKey] || org.name} + ${t[partnerOrg.labelKey] || partnerOrg.name}`
      : t[org.labelKey] || org.name;

  const status = useMemo(() => {
    if (!result) return "";

    const survivalPercent =
      typeof result.finalSurvivalPercent === "number"
        ? result.finalSurvivalPercent
        : Math.round((result.finalPopulation / result.initialPopulation) * 100);

    if (result.extinct || survivalPercent === 0) return t.extinctStatus;
    if (survivalPercent >= 70) return t.highStatus;
    if (survivalPercent >= 40) return t.moderateStatus;
    if (survivalPercent >= 15) return t.lowStatus;
    return t.veryLowStatus;
  }, [result, t]);

  const adaptations = useMemo(() => {
    if (!result) return [];
    return getLikelyAdaptations(simulationOrg, result.finalTraits, env);
  }, [result, simulationOrg, env]);

  const run = () => {
    setResult(runEvolution(simulationOrg, env, generations, population));
  };

  return (
    <>
      <video
        className="video-bg"
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          video.currentTime = 0.7;
          video.play().catch(() => {});
        }}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;

          if (video.duration && video.currentTime >= video.duration - 2) {
            video.currentTime = 0.7;
            video.play().catch(() => {});
          }
        }}
      >
        <source src={import.meta.env.BASE_URL + "bg.mp4"} type="video/mp4" />
      </video>

      <div className="video-overlay" />

      <div className="page">
        <div className="hero card">
          <div className="top">
            <div>
              <p className="poweredBy">
                Powered by: {t.authorName}
              </p>
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
            </div>

            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="ru">Русский</option>
              <option value="kk">Қазақша</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <div className="controls">
            <label>
              {t.planet}
              <select
                value={planet}
                onChange={(e) => {
                  const newPlanet = e.target.value;
                  setPlanet(newPlanet);
                  setMode(Object.keys(planets[newPlanet].modes)[0]);
                  setResult(null);
                }}
              >
                {Object.entries(planets).map(([key, value]) => (
                  <option key={key} value={key}>
                    {t[value.labelKey] || key}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t.organism}
              <select
                value={organism}
                onChange={(e) => {
                  const newOrganism = e.target.value;
                  setOrganism(newOrganism);

                  const nextPartner = Object.keys(organisms).find(
                    (key) => key !== newOrganism
                  );

                  setSymbiosisPartner(nextPartner);
                  setResult(null);
                }}
              >
                {Object.entries(organisms).map(([key, value]) => (
                  <option key={key} value={key}>
                    {t[value.labelKey] || value.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t.mode}
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                  setResult(null);
                }}
              >
                {Object.entries(planets[planet].modes).map(([key, value]) => (
                  <option key={key} value={key}>
                    {t[value.labelKey] || value.labelKey}
                  </option>
                ))}
              </select>
            </label>

            {mode === "symbiotic_biofilm" && (
              <label>
                {t.symbiosisPartner}
                <select
                  value={realPartnerKey}
                  onChange={(e) => {
                    setSymbiosisPartner(e.target.value);
                    setResult(null);
                  }}
                >
                  {availablePartners.map((key) => (
                    <option key={key} value={key}>
                      {t[organisms[key].labelKey] || organisms[key].name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              {t.generations}
              <input
                type="number"
                min="1"
                max="1000"
                value={generations}
                onChange={(e) => setGenerations(e.target.value)}
              />
            </label>

            <label>
              {t.population}
              <input
                type="number"
                min="10"
                max="2000"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
              />
            </label>
          </div>

          <button onClick={run}>{t.run}</button>
        </div>

        <div className="grid">
          <div className="card">
            <h2>{t.pressure}</h2>
            <Bar label={t.radiation} value={env.radiation} />
            <Bar label={t.water} value={1 - env.water} />
            <Bar label={t.uv} value={env.uv} />
            <Bar label={t.toxicity} value={env.toxicity} />
            <Bar label={t.nutrients} value={1 - env.nutrients} />
            <Bar label={t.tempInstability} value={1 - env.tempStability} />
          </div>

          <div className="card">
            <h2>{organismTitle}</h2>
            <Bar label={t.cold} value={simulationOrg.cold} />
            <Bar label={t.radiation} value={simulationOrg.radiation} />
            <Bar label={t.dryness} value={simulationOrg.dryness} />
            <Bar label={t.membrane} value={simulationOrg.membrane} />
            <Bar label={t.biofilm} value={simulationOrg.biofilm} />
            <Bar label={t.dna} value={simulationOrg.dna} />
          </div>
        </div>

        {result && (
          <>
            <div className="card result">
              <h2>{t.result}</h2>
              <p>{t.scoreExplanation}</p>
              <div className="score">{result.finalSurvivalPercent}%</div>
              <h3>
                {t.status}: {status}
              </h3>
              <p>
                {t.finalPopulation}: <b>{result.finalPopulation}</b> / {result.initialPopulation}
              </p>
              <p className={result.extinct ? "danger" : "info"}>
                {result.extinct ? t.extinction : t.survived}
              </p>

              <h3>{t.adaptations}</h3>
              <div className="tags">
                {adaptations.length > 0 ? (
                  adaptations.map((adaptation) => (
                    <span key={adaptation.key}>
                      {t[`adapt_${adaptation.key}`] || adaptation.key} +
                      {Math.round(adaptation.change * 100)}%
                    </span>
                  ))
                ) : (
                  <span>{t.noAdaptations}</span>
                )}
              </div>
            </div>

            <div className="grid">
              <div className="card">
                <h2>{t.chart}</h2>
                <MiniChart
                  data={result.scoreHistory}
                  keyName="score"
                  yLabel={t.chartYScore}
                  xLabel={t.chartX}
                />
                <p className="chartNote">
                  {getScoreChartDescription(result.scoreHistory, lang)}
                </p>
              </div>

              <div className="card">
                <h2>{t.populationChart}</h2>
                <MiniChart
                  data={result.popHistory}
                  keyName="size"
                  yLabel={t.chartYPopulation}
                  xLabel={t.chartX}
                />
                <p className="chartNote">
                  {getPopulationChartDescription(result.popHistory, lang)}
                </p>
              </div>
            </div>

            <div className="card">
              <h2>{t.traits}</h2>
              <table>
                <tbody>
                  {Object.entries(result.finalTraits).map(([key, value]) => (
                    <tr key={key}>
                      <td>{t[key] || key}</td>
                      <td>{Math.round(value * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
