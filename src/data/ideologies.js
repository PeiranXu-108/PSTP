export const quadrants = {
  'left-authoritarian': {
    name: '左翼威权主义',
    nameEn: 'State Socialism',
    color: '#ef4444',
    bgColor: '#ef444433',
    description:
      '经济上主张高度的国家计划、公有制和财富重分配；政治上强调集体高于个人，支持强力政府主导社会资源配置。' +
      '这一象限认为，只有通过国家力量才能实现真正的经济平等，而为了达成这一目标，适度限制个人自由是可以接受的代价。' +
      '历史上的计划经济体制和社会主义国家大多落入此象限。',
    ideologies: ['马克思列宁主义', '斯大林主义', '毛主义', '国家社会主义', '社会威权主义'],
    parties: [
      { country: '中国', flag: '🇨🇳', name: '中国共产党', wiki: 'https://zh.wikipedia.org/wiki/中国共产党' },
      { country: '古巴', flag: '🇨🇺', name: '古巴共产党', wiki: 'https://zh.wikipedia.org/wiki/古巴共产党' },
      { country: '越南', flag: '🇻🇳', name: '越南共产党', wiki: 'https://zh.wikipedia.org/wiki/越南共产党' },
    ],
    scoreRanges: {
      mild:   { range: [0, 33],  label: '温和', description: '你倾向于国家适度干预经济，同时对政府权力有一定的认同。' },
      medium: { range: [33, 66], label: '明显', description: '你较为明确地支持国家主导的经济模式，并认同集体利益优先于个人。' },
      strong: { range: [66, 100], label: '强烈', description: '你强烈认为国家应全面控制经济资源，并支持以国家权威维护社会秩序。' },
    },
  },

  'right-authoritarian': {
    name: '右翼威权主义',
    nameEn: 'Conservatism / Statism',
    color: '#3b82f6',
    bgColor: '#3b82f633',
    description:
      '经济上支持自由市场与私有制，但在社会议题上强调国家权威、传统道德、秩序与国家安全。' +
      '这一象限认为，市场竞争是创造财富的最佳方式，但社会需要强有力的权威来维持秩序和传统价值观。' +
      '保守主义政党和威权资本主义政权通常落入此象限。',
    ideologies: ['新保守主义', '威权资本主义', '国家保守主义', '右翼民粹主义', '传统保守主义'],
    parties: [
      { country: '俄罗斯', flag: '🇷🇺', name: '统一俄罗斯党', wiki: 'https://zh.wikipedia.org/wiki/统一俄罗斯' },
      { country: '土耳其', flag: '🇹🇷', name: '正义与发展党', wiki: 'https://zh.wikipedia.org/wiki/正义与发展党_(土耳其)' },
      { country: '匈牙利', flag: '🇭🇺', name: '青年民主主义者联盟', wiki: 'https://zh.wikipedia.org/wiki/青年民主主义者联盟－匈牙利公民联盟' },
    ],
    scoreRanges: {
      mild:   { range: [0, 33],  label: '温和', description: '你倾向于自由市场，同时尊重社会传统与秩序。' },
      medium: { range: [33, 66], label: '明显', description: '你明确支持市场经济，并认同强有力的国家权威和传统价值。' },
      strong: { range: [66, 100], label: '强烈', description: '你强烈主张经济自由放任与强硬的社会管控并行。' },
    },
  },

  'left-libertarian': {
    name: '左翼自由意志主义',
    nameEn: 'Libertarian Socialism',
    color: '#22c55e',
    bgColor: '#22c55e33',
    description:
      '经济上反对资本垄断，主张社会福利与平等；政治上极度反感公权力扩张，追求最大的个人与社会自由。' +
      '这一象限认为，经济平等与个人自由可以并行不悖——通过合作、自治和社会福利网络，而非国家暴力来实现公正。' +
      '北欧社会民主主义和绿色政治运动大多落入此象限。',
    ideologies: ['社会民主主义', '民主社会主义', '绿色政治', '无政府共产主义', '自由意志社会主义'],
    parties: [
      { country: '瑞典', flag: '🇸🇪', name: '瑞典社会民主工人党', wiki: 'https://zh.wikipedia.org/wiki/瑞典社会民主工人党' },
      { country: '德国', flag: '🇩🇪', name: '联盟90/绿党', wiki: 'https://zh.wikipedia.org/wiki/联盟90/绿党' },
      { country: '西班牙', flag: '🇪🇸', name: '我们能党 (Podemos)', wiki: 'https://zh.wikipedia.org/wiki/我们能_(西班牙政党)' },
      { country: '丹麦', flag: '🇩🇰', name: '社会民主党', wiki: 'https://zh.wikipedia.org/wiki/社会民主党_(丹麦)' },
    ],
    scoreRanges: {
      mild:   { range: [0, 33],  label: '温和', description: '你倾向于关注社会公平，同时重视个人权利与自由。' },
      medium: { range: [33, 66], label: '明显', description: '你明确支持福利国家和社会平等，同时坚定捍卫公民自由。' },
      strong: { range: [66, 100], label: '强烈', description: '你强烈反对资本垄断与国家权力扩张，追求彻底的经济平等与个人解放。' },
    },
  },

  'right-libertarian': {
    name: '右翼自由意志主义',
    nameEn: 'Libertarianism',
    color: '#eab308',
    bgColor: '#eab30833',
    description:
      '绝对的"小政府"甚至"无政府"主义。认为自由放任的资本主义是经济发展的根基，反对一切政府对个人生活和经济的干预。' +
      '这一象限主张个人产权神圣不可侵犯，税收即是盗窃，市场能够自我调节一切。' +
      '古典自由主义和自由意志主义政党通常落入此象限。',
    ideologies: ['古典自由主义', '自由意志主义', '无政府资本主义', '小政府保守主义', '新自由主义'],
    parties: [
      { country: '美国', flag: '🇺🇸', name: '自由意志党', wiki: 'https://zh.wikipedia.org/wiki/自由意志党_(美国)' },
      { country: '阿根廷', flag: '🇦🇷', name: '自由前进党', wiki: 'https://zh.wikipedia.org/wiki/自由前进党' },
      { country: '新西兰', flag: '🇳🇿', name: '行动党', wiki: 'https://zh.wikipedia.org/wiki/行动新西兰' },
    ],
    scoreRanges: {
      mild:   { range: [0, 33],  label: '温和', description: '你倾向于自由市场，同时重视个人自由与权利。' },
      medium: { range: [33, 66], label: '明显', description: '你明确反对政府干预经济与私人生活，主张市场与个人自治。' },
      strong: { range: [66, 100], label: '强烈', description: '你强烈主张最小化政府角色，坚信市场自由与个人自由是不可分割的。' },
    },
  },
}

export function getQuadrantKey(economicScore, authoritarianScore) {
  const xDir = economicScore <= 0 ? 'left' : 'right'
  const yDir = authoritarianScore >= 0 ? 'authoritarian' : 'libertarian'
  return `${xDir}-${yDir}`
}

export function getIntensityLevel(economicScore, authoritarianScore) {
  const distance = Math.sqrt(economicScore ** 2 + authoritarianScore ** 2)
  if (distance <= 33) return 'mild'
  if (distance <= 66) return 'medium'
  return 'strong'
}
