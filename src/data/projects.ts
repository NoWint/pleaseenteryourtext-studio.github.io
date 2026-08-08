export interface Project {
  name: string;
  tagline: string;
  description: string;
  highlight: string;
  techStack: string;
  githubUrl: string;
  isFlagship?: boolean;
  capabilities?: { group: string; items: string[] }[];
}

export const PROJECTS: Project[] = [
  {
    name: 'PEYT Chat',
    tagline: '面向开发团队的端到端加密协作聊天',
    description: '普通聊天工具不适合开发团队。所以我们自己造了一个。PEYT Chat is our end-to-end encrypted chat built for dev teams — with kanban tasks, bots, and a built-in knowledge base.',
    highlight: '基于 Delta Chat 生态深度定制，Tauri 客户端覆盖 Windows / macOS / Linux / Android。Chatmail 只是安全传输层，真正数据存在客户端，只同步状态变化事件。',
    techStack: 'Tauri v2 · Delta Chat Core · TypeScript · Rust',
    githubUrl: 'https://github.com/NoWint/PleaseEnterYourTextCommunity',
    isFlagship: true,
    capabilities: [
      { group: '聊天', items: ['workspace / channel', 'Markdown 渲染', '@成员 / #频道彩色 tag', '群组 / 已读回执 / 置顶 / 转发', '语音 · webxdc'] },
      { group: '协作', items: ['Work 页卡片任务（看板/列表/日历/时间线）', '多账号 · 收件箱', '3D 词云 / 词频分析'] },
      { group: '智能', items: ['Bot + LLM 运行时（DeepSeek / OpenAI / Claude）', '知识库 / 自动总结', 'GitHub 集成 · 插件系统'] },
    ],
  },
  {
    name: 'EGGDataScience',
    tagline: '脑电数据分析平台',
    description: '跨学科任务切换会如何破坏心流？这个问题来自我们的研学实验——受试者佩戴便携式 EEG 头环，在不同学科任务间切换，我们想量化「心流的恢复需要多久」。',
    highlight: '不是玩具 demo，是能跑通完整科研流程的分析平台——数据、统计、报告三合一。',
    techStack: 'Python 3.11+ · FastAPI · numpy · pandas · scipy · Chart.js',
    githubUrl: 'https://github.com/PleaseEnterYourText-Studio/EGGDataScience',
  },
  {
    name: 'NeuroLink-EEG',
    tagline: 'EEG BCI 心流实验平台',
    description: '心流实验不止是「记录数据」，更是一场多方协作的实时演出：主控端操控实验流程，监视端观察实时脑电，受试者端执行任务，实验控制台统一调度——四端同步同一台 OpenBCI Ganglion 头环的实时波形。',
    highlight: '一套头环 + 一个平台，四端实时同步——把科研实验从「单人记 Excel」变成「多人协作的实时系统」。',
    techStack: 'OpenBCI Ganglion · UDP · WebSocket · Node.js',
    githubUrl: 'https://github.com/PleaseEnterYourText-Studio/NeuroLink-EEG',
  },
  {
    name: 'Nervefeyn',
    tagline: 'AI 研究代理',
    description: '研究最耗时的部分不是读，而是「找」和「连」——在成百上千篇论文里检索、梳理综述、多角度调查一个问题。我们把它交给一个代理来做。',
    highlight: '不是套壳问答，而是长线自主研究——从检索到综述到多代理调查，代理真的能推着研究往前走。',
    techStack: 'TypeScript · Astro · Pi 运行时',
    githubUrl: 'https://github.com/PleaseEnterYourText-Studio/Nervefeyn',
  },
  {
    name: 'NoargueWorkspace',
    tagline: '时光绿径待办',
    description: '待办工具不缺，缺的是「能一起用」的。时光绿径是一个微信小程序 + Node.js 后端的待办管理：个人清单、组合归类、共享协作。',
    highlight: '不止是清单 App——它解决的是多端协作下最难的「同步一致性问题」，离线优先 + 冲突检测 merge。',
    techStack: '微信小程序原生 · TDesign · Express · MySQL',
    githubUrl: 'https://github.com/PleaseEnterYourText-Studio/NoargueWorkspace',
  },
  {
    name: 'PeytDocs',
    tagline: '团队文档站',
    description: '团队的知识需要一个家。PeytDocs 收录 Peyt 系列项目的技术文档、API 接入规范、架构设计——从 PEYT Chat 客户端到时光绿径 API 再到 Workspace OS 架构。',
    highlight: '零构建、纯静态，写 markdown 即发布——文档的维护成本被降到最低。',
    techStack: 'Docsify · GitHub Pages',
    githubUrl: 'https://github.com/PleaseEnterYourText-Studio/PeytDocs',
  },
];
