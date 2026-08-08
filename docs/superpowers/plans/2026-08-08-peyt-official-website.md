# PEYT Studio 官网 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page PEYT Studio official website with 3DGS black hole background, prism refraction color accents, and 5 content sections (Hero → About → Projects → Team → Join).

**Architecture:** React 18 + Vite 6 + TypeScript 5.6 SPA. 3DGS black hole (jd.ply) as fixed full-page background via @mkkellogg/gaussian-splats-3d. Simplified camera dolly (breathing + parallax only). Black & white base with prism gradient (red/purple/blue) accents on interactive elements. Content from GitHub About repo spec.

**Tech Stack:** React 18, Vite 6, TypeScript 5.6, Framer Motion 12, @mkkellogg/gaussian-splats-3d, three.js, CSS Modules

## Global Constraints

- COOP/COEP headers required (SharedArrayBuffer for 3DGS worker)
- `base: './'` in vite.config.ts (relative path builds)
- SHARP OpenCV→OpenGL rotation: `[1, 0, 0, 0]`
- Camera FOV: 45°, base position `[0, 0, 1.8]`, lookAt `[0, 0, 0]`
- PLY file: `public/gaussians/jd.ply` (63MB, 1,179,648 gaussians)
- Color scheme: dark, `color-scheme: dark`
- Prism colors: `#FF006E` (red), `#8338EC` (purple), `#3A86FF` (blue)
- Mobile (width < 768px): do not load 3DGS
- `prefers-reduced-motion`: do not load 3DGS
- 3DGS load timeout: 30s
- Member assets: `https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/members/<name>/`
- QQ QR: `https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/JOINUS.jpg`

---

## File Structure

```
PEYTow/
├── package.json                    # Task 1
├── vite.config.ts                  # Task 1
├── tsconfig.json                   # Task 1
├── tsconfig.node.json              # Task 1
├── index.html                      # Task 1
├── public/gaussians/jd.ply         # Task 13 (copy from jd_output/)
├── src/
│   ├── main.tsx                    # Task 1
│   ├── App.tsx                     # Task 13 (final assembly)
│   ├── vite-env.d.ts               # Task 1
│   ├── styles/
│   │   ├── tokens.css              # Task 2
│   │   └── global.css              # Task 2
│   ├── data/
│   │   ├── site.ts                 # Task 3
│   │   ├── members.ts              # Task 3
│   │   └── projects.ts             # Task 3
│   ├── hooks/
│   │   └── useCameraDolly.ts       # Task 6
│   ├── components/
│   │   ├── ChapterMark.tsx + .module.css       # Task 4
│   │   ├── TwoCol.tsx + .module.css             # Task 4
│   │   ├── PrismText.tsx + .module.css          # Task 4
│   │   ├── PrismBorder.tsx + .module.css        # Task 4
│   │   ├── Nav.tsx + .module.css                # Task 5
│   │   ├── SectionDots.tsx + .module.css        # Task 5
│   │   ├── ScrollProgress.tsx                   # Task 5
│   │   ├── GaussianSplats3DCanvas.tsx + .module.css  # Task 7
│   │   ├── SceneBackground.tsx + .module.css    # Task 7
│   │   ├── ProjectCard.tsx + .module.css        # Task 10
│   │   └── MemberCard.tsx + .module.css         # Task 11
│   └── sections/
│       ├── Hero.tsx + .module.css               # Task 8
│       ├── About.tsx + .module.css              # Task 9
│       ├── Projects.tsx + .module.css           # Task 10
│       ├── Team.tsx + .module.css               # Task 11
│       ├── Join.tsx + .module.css               # Task 12
│       └── Footer.tsx + .module.css             # Task 12
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`

**Interfaces:**
- Produces: a running Vite dev server with React + COOP/COEP headers

- [ ] **Step 1: Create package.json**

```json
{
  "name": "peyt-official-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mkkellogg/gaussian-splats-3d": "^0.4.5",
    "framer-motion": "^12.40.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.170.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.170.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.3"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
});
```

- [ ] **Step 3: Create tsconfig.json and tsconfig.node.json**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PEYT Studio — Type Everything</title>
  <meta name="description" content="PleaseEnterYourText Studio · 请输入文本工作室 — 一个由中学生开发者组成的年轻技术工作室" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

- [ ] **Step 5: Create src/main.tsx, src/App.tsx, src/vite-env.d.ts**

`src/vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />
```

`src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`src/App.tsx` (minimal placeholder):
```tsx
export function App() {
  return <div style={{ color: 'white', padding: '2rem' }}>PEYT Studio — scaffold OK</div>;
}
```

- [ ] **Step 6: Install deps and verify dev server**

Run: `cd /Users/xiatian/Desktop/projects/PEYTow && npm install && npm run dev`
Expected: Vite dev server starts at localhost:5173, page shows "PEYT Studio — scaffold OK"

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: scaffold Vite + React + TS project with COOP/COEP"
```

---

### Task 2: Design Tokens & Global Styles

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Modify: `src/main.tsx` (already imports global.css)

**Interfaces:**
- Produces: CSS custom properties for the entire design system

- [ ] **Step 1: Create tokens.css**

```css
:root {
  --canvas: transparent;
  --surface-elevated: rgba(10, 10, 12, 0.65);
  --surface-2: #1C1C1E;
  --hairline: rgba(255, 255, 255, 0.08);

  --prism-1: #FF006E;
  --prism-2: #8338EC;
  --prism-3: #3A86FF;
  --prism-gradient: linear-gradient(90deg, var(--prism-1), var(--prism-2), var(--prism-3));

  --text-primary: #F5F5F7;
  --text-secondary: #A1A1A6;
  --text-tertiary: #6E6E73;

  --font-display: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  --font-text: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  --font-mono: 'SF Mono', 'JetBrains Mono', ui-monospace, monospace;

  --text-hero: 96px;
  --text-display: 72px;
  --text-title: 48px;
  --text-headline: 32px;
  --text-body: 17px;
  --text-caption: 14px;

  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px;
  --space-5: 48px; --space-6: 64px; --space-7: 96px;

  --container-wide: 1440px;
  --container-narrow: 760px;

  --ease-apple: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-slow: 0.8s;
  --duration-medium: 0.4s;
  --duration-fast: 0.2s;

  color-scheme: dark;
}

@media (max-width: 1024px) {
  :root { --text-hero: 64px; --text-display: 48px; --text-title: 36px; }
}
@media (max-width: 768px) {
  :root { --text-hero: 48px; --text-display: 36px; --text-title: 28px; --text-headline: 24px; }
}
@media (max-width: 640px) {
  :root { --text-hero: 36px; --text-display: 28px; }
}
```

- [ ] **Step 2: Create global.css**

```css
@import './tokens.css';

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-text);
  color: var(--text-primary);
  overflow-x: hidden;
  line-height: 1.5;
  font-size: var(--text-body);
  background: #050508;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8), 0 0 24px rgba(0, 0, 0, 0.5);
}

::selection {
  background: rgba(131, 56, 236, 0.3);
  color: var(--text-primary);
}

a { color: inherit; text-decoration: none; }

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

img { display: block; max-width: 100%; height: auto; }

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--prism-2);
  color: #fff;
  padding: 8px 16px;
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus { top: 0; }

:focus-visible {
  outline: 2px solid var(--prism-3);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.container {
  max-width: var(--container-wide);
  margin: 0 auto;
  padding: 0 var(--space-4);
  width: 100%;
}

.container-narrow {
  max-width: var(--container-narrow);
  margin: 0 auto;
  padding: 0 var(--space-4);
  width: 100%;
}

main, footer {
  position: relative;
  z-index: 1;
}

.bg-veil {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: rgba(5, 5, 8, 0.82);
  -webkit-backdrop-filter: blur(28px) saturate(130%);
  backdrop-filter: blur(28px) saturate(130%);
}

.section {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: clamp(120px, 18vh, 200px) 0;
}
```

- [ ] **Step 3: Verify tokens load**

Run: `npm run dev` — open browser, inspect `:root` computed styles, confirm `--prism-1` etc. exist.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add design tokens and global styles"
```

---

### Task 3: Data Layer

**Files:**
- Create: `src/data/site.ts`, `src/data/members.ts`, `src/data/projects.ts`

**Interfaces:**
- Produces: `SITE` constant, `MEMBERS` array, `PROJECTS` array, `SECTIONS` array, `Member` type, `Project` type

- [ ] **Step 1: Create src/data/site.ts**

```typescript
export const SITE = {
  name: 'PEYT Studio',
  fullName: 'PleaseEnterYourText Studio',
  chineseName: '请输入文本工作室',
  slogan: 'Type Everything',
  badge: 'members 8 · project PEYT Chat · open source',
  githubOrg: 'https://github.com/PleaseEnterYourText-Studio',
} as const;

export const SECTIONS = [
  { id: 'hero', label: '首屏' },
  { id: 'about', label: '关于' },
  { id: 'projects', label: '项目' },
  { id: 'team', label: '团队' },
  { id: 'join', label: '加入' },
] as const;

export const NAV_LINKS = [
  { href: '#about', label: '关于' },
  { href: '#projects', label: '项目' },
  { href: '#team', label: '团队' },
  { href: '#join', label: '加入' },
] as const;
```

- [ ] **Step 2: Create src/data/members.ts**

```typescript
export interface Member {
  name: string;
  role: string;
  direction: string;
  tagline: string;
  avatarUrl: string;
  siteUrl: string;
  siteLabel: string;
}

const RAW_BASE = 'https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/members';

export const MEMBERS: Member[] = [
  {
    name: 'NoWint',
    role: '联合创始人',
    direction: 'Desktop @ macOS · TUI',
    tagline: '「我是神」',
    avatarUrl: `${RAW_BASE}/NoWint/NoWint.png`,
    siteUrl: 'https://nowint.github.io/',
    siteLabel: 'nowint.github.io',
  },
  {
    name: 'TiantianYZJ',
    role: '联合创始人',
    direction: 'Desktop @ Windows',
    tagline: '「我不是冯诺 1 曼派」',
    avatarUrl: `${RAW_BASE}/TiantianYZJ/TiantianYZJ.png`,
    siteUrl: 'https://yzjtiantian.cn/',
    siteLabel: 'yzjtiantian.cn',
  },
  {
    name: 'CarryRao',
    role: '核心成员',
    direction: 'Android Backend · Desktop Linux',
    tagline: '「前端小菜鸡，后端半吊子」',
    avatarUrl: `${RAW_BASE}/CarryRao/CarryRao.png`,
    siteUrl: 'https://carryrao.top/',
    siteLabel: 'carryrao.top',
  },
  {
    name: '浣芷轩',
    role: '核心成员',
    direction: 'Desktop macOS',
    tagline: '「(◐‿◑) 你爹来啦」',
    avatarUrl: `${RAW_BASE}/浣芷轩/浣芷轩.png`,
    siteUrl: 'https://space.bilibili.com/1716940207',
    siteLabel: 'bilibili',
  },
  {
    name: 'Falsw',
    role: '核心成员',
    direction: '底层',
    tagline: '「闷声修底层，偶尔冒泡整活」',
    avatarUrl: `${RAW_BASE}/Falsw/Falsw.png`,
    siteUrl: 'https://falswqwq.github.io/',
    siteLabel: 'falswqwq.github.io',
  },
  {
    name: 'MaherJon',
    role: '核心成员',
    direction: 'Android Frontend',
    tagline: '「书写一些代码，声明一些 UI」',
    avatarUrl: `${RAW_BASE}/MaherJon/MaherJon.png`,
    siteUrl: 'https://maherjon.github.io/MAHE/',
    siteLabel: 'MAHE',
  },
];

export const INACTIVE_MEMBERS = ['SUKY', 'chenmuyun_bit'];
```

- [ ] **Step 3: Create src/data/projects.ts**

```typescript
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
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add data layer (site, members, projects)"
```

---

### Task 4: Utility Components (ChapterMark, TwoCol, PrismText, PrismBorder)

**Files:**
- Create: `src/components/ChapterMark.tsx` + `.module.css`
- Create: `src/components/TwoCol.tsx` + `.module.css`
- Create: `src/components/PrismText.tsx` + `.module.css`
- Create: `src/components/PrismBorder.tsx` + `.module.css`

**Interfaces:**
- Produces: `ChapterMark({ num, title, total? })`, `TwoCol({ items: [ColItem, ColItem] })`, `PrismText({ children, as? })`, `PrismBorder({ children, className? })`

- [ ] **Step 1: Create ChapterMark**

`src/components/ChapterMark.tsx`:
```tsx
import { motion } from 'framer-motion';
import styles from './ChapterMark.module.css';

interface ChapterMarkProps {
  num: string;
  title: string;
  total?: number;
}

export function ChapterMark({ num, title, total = 5 }: ChapterMarkProps) {
  return (
    <div className={styles.mark}>
      <motion.div
        className={styles.line}
        initial={{ height: 0 }}
        whileInView={{ height: '100%' }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className={styles.meta}
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className={styles.num}>CHAPTER {num}</div>
        <div className={styles.progress}>
          {total} 个章节中的第 {parseInt(num, 10)} 个 · {title}
        </div>
      </motion.div>
    </div>
  );
}
```

`src/components/ChapterMark.module.css`:
```css
.mark {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}
.line {
  width: 2px;
  background: var(--prism-gradient);
  min-height: 40px;
  flex-shrink: 0;
}
.meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.num {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  letter-spacing: 0.15em;
  color: var(--text-tertiary);
}
.progress {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}
```

- [ ] **Step 2: Create TwoCol**

`src/components/TwoCol.tsx`:
```tsx
import { motion } from 'framer-motion';
import styles from './TwoCol.module.css';

export interface ColItem {
  label: string;
  text: string;
}

interface TwoColProps {
  items: [ColItem, ColItem];
}

export function TwoCol({ items }: TwoColProps) {
  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className={styles.col}
          initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
        >
          <div className={styles.label}>{item.label}</div>
          <p className={styles.text}>{item.text}</p>
        </motion.div>
      ))}
    </div>
  );
}
```

`src/components/TwoCol.module.css`:
```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  max-width: var(--container-wide);
  margin: 0 auto;
}
.col {
  padding: var(--space-4);
}
.label {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  letter-spacing: 0.15em;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
  text-transform: uppercase;
}
.text {
  font-size: var(--text-body);
  line-height: 1.7;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; gap: var(--space-3); }
}
```

- [ ] **Step 3: Create PrismText**

`src/components/PrismText.tsx`:
```tsx
import type { ElementType, ReactNode } from 'react';
import styles from './PrismText.module.css';

interface PrismTextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function PrismText({ children, as: Tag = 'span', className }: PrismTextProps) {
  return (
    <Tag className={`${styles.prism} ${className ?? ''}`}>
      {children}
    </Tag>
  );
}
```

`src/components/PrismText.module.css`:
```css
.prism {
  background: var(--prism-gradient);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: prismShift 6s ease-in-out infinite;
}
@keyframes prismShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

- [ ] **Step 4: Create PrismBorder**

`src/components/PrismBorder.tsx`:
```tsx
import type { ReactNode } from 'react';
import styles from './PrismBorder.module.css';

interface PrismBorderProps {
  children: ReactNode;
  className?: string;
}

export function PrismBorder({ children, className }: PrismBorderProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <div className={styles.border} aria-hidden="true" />
      {children}
    </div>
  );
}
```

`src/components/PrismBorder.module.css`:
```css
.wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}
.border {
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: 12px;
  background: var(--prism-gradient);
  background-size: 200% 100%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.4;
  transition: opacity var(--duration-medium) var(--ease-apple);
  animation: prismShift 6s ease-in-out infinite;
}
.wrapper:hover .border {
  opacity: 1;
}
@keyframes prismShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

- [ ] **Step 5: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add utility components (ChapterMark, TwoCol, PrismText, PrismBorder)"
```

---

### Task 5: Navigation Components (Nav, SectionDots, ScrollProgress)

**Files:**
- Create: `src/components/Nav.tsx` + `.module.css`
- Create: `src/components/SectionDots.tsx` + `.module.css`
- Create: `src/components/ScrollProgress.tsx` + `src/components/ScrollProgress.module.css`

**Interfaces:**
- Consumes: `NAV_LINKS` from `src/data/site.ts`, `SECTIONS` from `src/data/site.ts`
- Produces: `Nav()`, `SectionDots({ sections })`, `ScrollProgress()`

- [ ] **Step 1: Create Nav**

`src/components/Nav.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/site';
import styles from './Nav.module.css';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} aria-label="主导航">
      <a href="#hero" className={styles.logo}>PEYT</a>
      <ul className={styles.links}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={styles.link}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

`src/components/Nav.module.css`:
```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  transition: background var(--duration-medium) var(--ease-apple),
              backdrop-filter var(--duration-medium) var(--ease-apple);
}
.scrolled {
  background: rgba(5, 5, 8, 0.7);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--hairline);
}
.logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.05em;
}
.links {
  display: flex;
  gap: var(--space-3);
  list-style: none;
}
.link {
  font-size: var(--text-caption);
  color: var(--text-secondary);
  transition: color var(--duration-fast) var(--ease-apple);
}
.link:hover { color: var(--text-primary); }
@media (max-width: 640px) {
  .links { display: none; }
}
```

- [ ] **Step 2: Create SectionDots**

`src/components/SectionDots.tsx`:
```tsx
import styles from './SectionDots.module.css';

interface SectionDotsProps {
  sections: ReadonlyArray<{ id: string; label: string }>;
}

export function SectionDots({ sections }: SectionDotsProps) {
  return (
    <div className={styles.dots} aria-label="章节导航">
      {sections.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={styles.dot} aria-label={s.label} title={s.label} />
      ))}
    </div>
  );
}
```

`src/components/SectionDots.module.css`:
```css
.dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-tertiary);
  transition: background var(--duration-fast) var(--ease-apple), transform var(--duration-fast) var(--ease-apple);
}
.dot:hover {
  background: var(--prism-2);
  transform: scale(1.4);
}
@media (max-width: 640px) {
  .dots { display: none; }
}
```

- [ ] **Step 3: Create ScrollProgress**

`src/components/ScrollProgress.tsx`:
```tsx
import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './ScrollProgress.module.css';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={styles.bar}
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
```

`src/components/ScrollProgress.module.css`:
```css
.bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--prism-gradient);
  transform-origin: 0%;
  z-index: 200;
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add navigation components (Nav, SectionDots, ScrollProgress)"
```

---

### Task 6: 3DGS Camera Hook (useCameraDolly — simplified)

**Files:**
- Create: `src/hooks/useCameraDolly.ts`

**Interfaces:**
- Produces: `useCameraDolly(active: boolean): CameraOffset` where `CameraOffset = { x: number; y: number; z: number }`

- [ ] **Step 1: Create useCameraDolly.ts**

```typescript
import { useEffect, useRef, useState } from 'react';

export interface CameraOffset {
  x: number;
  y: number;
  z: number;
}

export const SAFE_RANGE = {
  translate: 0.8,
  push: 2.0,
};

function clampPosition(o: CameraOffset): CameraOffset {
  return {
    x: Math.max(-SAFE_RANGE.translate, Math.min(SAFE_RANGE.translate, o.x)),
    y: Math.max(-SAFE_RANGE.translate, Math.min(SAFE_RANGE.translate, o.y)),
    z: Math.max(0, Math.min(SAFE_RANGE.push, o.z)),
  };
}

/** breathing: 6s 周期正弦波 */
function breathingOffset(tSec: number, periodSec: number): CameraOffset {
  const phase = (tSec % periodSec) / periodSec;
  const twoPi = Math.PI * 2;
  return clampPosition({
    x: 0.15 * Math.sin(phase * twoPi),
    y: 0.08 * Math.sin(phase * twoPi),
    z: 0.04 * Math.sin(phase * Math.PI),
  });
}

/** parallax: 鼠标视差 */
function parallaxOffset(mouseX: number, mouseY: number, strength: number): CameraOffset {
  return clampPosition({
    x: mouseX * strength,
    y: mouseY * strength,
    z: 0,
  });
}

/**
 * 简化版相机驱动：breathing + parallax（无滚动关键帧运镜）。
 * 黑洞是远景，安静呼吸 + 轻微视差即可。
 */
export function useCameraDolly(active: boolean): CameraOffset {
  const [offset, setOffset] = useState<CameraOffset>({ x: 0, y: 0, z: 0 });
  const startRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseCacheRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseCacheRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    let raf = 0;
    const smoothMouse = () => {
      mouseRef.current.x += (mouseCacheRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseCacheRef.current.y - mouseRef.current.y) * 0.08;
      raf = requestAnimationFrame(smoothMouse);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(smoothMouse);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    startRef.current = performance.now();
    const loop = (now: number) => {
      const tSec = (now - startRef.current) / 1000;
      const breath = breathingOffset(tSec, 6);
      const parallax = parallaxOffset(mouseRef.current.x, mouseRef.current.y, 0.2);
      setOffset(clampPosition({
        x: breath.x + parallax.x,
        y: breath.y + parallax.y,
        z: breath.z + parallax.z,
      }));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return offset;
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add simplified useCameraDolly hook (breathing + parallax)"
```

---

### Task 7: 3DGS Background (GaussianSplats3DCanvas + SceneBackground)

**Files:**
- Create: `src/components/GaussianSplats3DCanvas.tsx` + `.module.css`
- Create: `src/components/SceneBackground.tsx` + `.module.css`

**Interfaces:**
- Consumes: `useCameraDolly` from `src/hooks/useCameraDolly.ts`, `CameraOffset` type
- Produces: `SceneBackground({ plyPath })` component

- [ ] **Step 1: Create GaussianSplats3DCanvas.tsx**

Adapt from showcase. Key changes: prism-colored fallback gradient instead of cyan, loading text uses prism color.

`src/components/GaussianSplats3DCanvas.tsx`:
```tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CameraOffset } from '../hooks/useCameraDolly';
import styles from './GaussianSplats3DCanvas.module.css';

export interface Props {
  plyPath: string;
  offset: CameraOffset;
}

const BASE_CAM_POS: readonly [number, number, number] = [0, 0, 1.8];
const CAM_LOOK_AT: readonly [number, number, number] = [0, 0, 0];
const CAM_FOV = 45;
const LOAD_TIMEOUT_MS = 30_000;

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const ctx = c.getContext('webgl2');
    if (ctx) {
      const lose = ctx.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    }
    return !!ctx;
  } catch {
    return false;
  }
}

type LoadState = 'idle' | 'loading' | 'ready' | 'failed';

export default function GaussianSplats3DCanvas({ plyPath, offset }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<{ dispose: () => void; camera: unknown; start: () => void; addSplatScene: (path: string, opts: Record<string, unknown>) => Promise<void> } | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [errorDetail, setErrorDetail] = useState('');
  const webglOk = useMemo(() => detectWebGL(), []);

  useEffect(() => {
    if (!webglOk || !containerRef.current || !plyPath) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    setLoadState('loading');
    setErrorDetail('');

    (async () => {
      try {
        const mod = await import('@mkkellogg/gaussian-splats-3d');
        const Viewer = (mod as { Viewer: new (opts: Record<string, unknown>) => { dispose: () => void; camera: unknown; start: () => void; addSplatScene: (path: string, opts: Record<string, unknown>) => Promise<void> } }).Viewer;
        if (!Viewer) throw new Error('Viewer export not found');

        const crossIsolated = typeof self !== 'undefined' && (self as unknown as { crossOriginIsolated?: boolean }).crossOriginIsolated === true;

        const viewer = new Viewer({
          rootElement: containerRef.current,
          initialCameraPosition: [...BASE_CAM_POS] as [number, number, number],
          initialCameraLookAt: [...CAM_LOOK_AT] as [number, number, number],
          cameraUp: [0, 1, 0],
          selfDrivenMode: true,
          useBuiltInControls: false,
          sharedMemoryForWorkers: crossIsolated,
          enableSIMDInSort: crossIsolated,
          gpuAcceleratedSort: false,
          antialiased: true,
          integerBasedSort: false,
          halfPrecisionCovariancesOnGPU: false,
          sceneFadeInRateMultiplier: 5.0,
          sphericalHarmonicsDegree: 2,
        });

        const cam = viewer.camera as { isPerspectiveCamera?: boolean; fov?: number; updateProjectionMatrix?: () => void } | undefined;
        if (cam && cam.isPerspectiveCamera && cam.fov !== undefined) {
          cam.fov = CAM_FOV;
          cam.updateProjectionMatrix?.();
        }

        viewer.start();

        timeoutId = setTimeout(() => {
          if (!cancelled && viewerRef.current === null) {
            try { viewer.dispose(); } catch { /* ignore */ }
            if (!cancelled) {
              setLoadState('failed');
              setErrorDetail('Load timed out');
            }
          }
        }, LOAD_TIMEOUT_MS);

        await viewer.addSplatScene(plyPath, {
          progressiveLoad: false,
          rotation: [1, 0, 0, 0],
          showLoadingUI: false,
        });

        if (cancelled) {
          viewer.dispose();
          return;
        }
        if (timeoutId) clearTimeout(timeoutId);
        viewerRef.current = viewer;
        setLoadState('ready');
      } catch (err) {
        const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        if (timeoutId) clearTimeout(timeoutId);
        if (!cancelled) {
          setLoadState('failed');
          setErrorDetail(msg);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
    };
  }, [plyPath, webglOk]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const cam = viewer.camera as { position: { set: (x: number, y: number, z: number) => void }; lookAt: (x: number, y: number, z: number) => void } | undefined;
    if (!cam) return;
    cam.position.set(
      BASE_CAM_POS[0] - offset.x,
      BASE_CAM_POS[1] - offset.y,
      BASE_CAM_POS[2] - offset.z,
    );
    cam.lookAt(
      CAM_LOOK_AT[0] - offset.x * 0.5,
      CAM_LOOK_AT[1] - offset.y * 0.5,
      CAM_LOOK_AT[2],
    );
  }, [offset]);

  if (!webglOk || loadState === 'failed') {
    return (
      <div className={styles.fallback}>
        {loadState === 'failed' && errorDetail && (
          <div className={styles.error}>3D LOAD FAILED: {errorDetail}</div>
        )}
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className={styles.container} aria-hidden="true" />
      {loadState === 'loading' && (
        <div className={styles.loading}>
          <span className={styles.loadingText}>LOADING 3D SCENE</span>
        </div>
      )}
    </>
  );
}
```

`src/components/GaussianSplats3DCanvas.module.css`:
```css
.container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.container canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
.fallback {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(131, 56, 236, 0.06), transparent 60%),
    linear-gradient(180deg, #050508 0%, #0a0a12 50%, #120a1a 100%);
}
.error {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #ff6b6b;
  font-size: 12px;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}
.loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.loadingText {
  color: var(--prism-2);
  font-size: 11px;
  letter-spacing: 0.3em;
  font-family: monospace;
  opacity: 0.6;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
```

- [ ] **Step 2: Create SceneBackground.tsx**

`src/components/SceneBackground.tsx`:
```tsx
import { Suspense, lazy, useEffect, useState } from 'react';
import { useCameraDolly } from '../hooks/useCameraDolly';
import styles from './SceneBackground.module.css';

const GaussianSplats3D = lazy(() => import('./GaussianSplats3DCanvas'));

interface Props {
  plyPath?: string;
}

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const ctx = c.getContext('webgl2');
    if (ctx) {
      const lose = ctx.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    }
    return !!ctx;
  } catch {
    return false;
  }
}

export function SceneBackground({ plyPath }: Props) {
  const [use3D, setUse3D] = useState(false);
  const offset = useCameraDolly(true);

  useEffect(() => {
    if (!plyPath) return;
    if (!detectWebGL()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;
    setUse3D(true);
  }, [plyPath]);

  if (use3D && plyPath) {
    return (
      <div className={styles.overlay} aria-hidden="true">
        <Suspense fallback={<div className={styles.fallback} />}>
          <GaussianSplats3D plyPath={plyPath} offset={offset} />
        </Suspense>
      </div>
    );
  }
  return <div className={styles.fallback} aria-hidden="true" />;
}
```

`src/components/SceneBackground.module.css`:
```css
.overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #050508;
}
.fallback {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(131, 56, 236, 0.06), transparent 60%),
    linear-gradient(180deg, #050508 0%, #0a0a12 50%, #120a1a 100%);
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add 3DGS background system (SceneBackground + GaussianSplats3DCanvas)"
```

---

### Task 8: Hero Section

**Files:**
- Create: `src/sections/Hero.tsx` + `.module.css`

**Interfaces:**
- Consumes: `SITE` from `src/data/site.ts`, `PrismText` from `src/components/PrismText.tsx`, `PrismBorder` from `src/components/PrismBorder.tsx`

- [ ] **Step 1: Create Hero.tsx**

```tsx
import { motion, useScroll, useTransform, useVelocity, useSpring, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { SITE } from '../data/site';
import { PrismText } from '../components/PrismText';
import { PrismBorder } from '../components/PrismBorder';
import styles from './Hero.module.css';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const velocity = useVelocity(scrollYProgress);
  const blurRaw = useTransform(velocity, [-0.5, 0, 0.5], [8, 0, 8]);
  const blurSpring = useSpring(blurRaw, { stiffness: 200, damping: 30 });
  const headlineFilter = useTransform(blurSpring, (b) => `blur(${b.toFixed(2)}px)`);

  return (
    <section id="hero" ref={ref} className={styles.hero}>
      <motion.div
        className={styles.content}
        style={{
          y: textY,
          opacity: textOpacity,
        }}
      >
        <motion.h1
          className={styles.headline}
          style={prefersReducedMotion ? undefined : { filter: headlineFilter }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          {SITE.name}
        </motion.h1>
        <motion.p
          className={styles.subhead}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          {SITE.fullName} · {SITE.chineseName}
        </motion.p>
        <motion.div
          className={styles.slogan}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        >
          <PrismText as="span" className={styles.sloganText}>{SITE.slogan}</PrismText>
        </motion.div>
        <motion.p
          className={styles.intro}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          我们是一群中学生开发者。因一次研学相遇，因热爱技术走到一起。
          <br />
          <span className={styles.introEn}>We are a group of teenage developers. We met at a research camp, bonded over tech — and now we build real software together.</span>
        </motion.p>
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          {SITE.badge}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <a href="#join">
            <PrismBorder className={styles.ctaWrapper}>
              <span className={styles.ctaText}>加入我们</span>
            </PrismBorder>
          </a>
        </motion.div>
      </motion.div>
      <motion.div
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        aria-hidden="true"
      >
        <span className={styles.scrollText}>向下滚动</span>
        <span className={styles.scrollLine} />
      </motion.div>
    </section>
  );
}
```

`src/sections/Hero.module.css`:
```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 var(--space-4);
}
.content {
  text-align: center;
  max-width: var(--container-wide);
}
.headline {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: var(--space-2);
}
.subhead {
  font-size: var(--text-body);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}
.slogan {
  margin-bottom: var(--space-5);
}
.sloganText {
  font-family: var(--font-display);
  font-size: var(--text-title);
  font-weight: 600;
  letter-spacing: 0.02em;
}
.intro {
  font-size: var(--text-body);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto var(--space-4);
  line-height: 1.7;
}
.introEn {
  color: var(--text-tertiary);
  font-size: var(--text-caption);
}
.badge {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-4);
}
.ctaWrapper {
  display: inline-block;
  padding: var(--space-2) var(--space-5);
  cursor: pointer;
}
.ctaText {
  font-size: var(--text-body);
  font-weight: 500;
  color: var(--text-primary);
}
.scrollHint {
  position: absolute;
  bottom: var(--space-5);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}
.scrollText {
  font-size: var(--text-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.1em;
}
.scrollLine {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--text-tertiary), transparent);
  animation: scrollLine 2s ease-in-out infinite;
}
@keyframes scrollLine {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}
@media (max-width: 768px) {
  .headline { font-size: var(--text-hero); }
  .sloganText { font-size: var(--text-headline); }
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Hero section"
```

---

### Task 9: About Section

**Files:**
- Create: `src/sections/About.tsx` + `.module.css`

**Interfaces:**
- Consumes: `ChapterMark` from `src/components/ChapterMark.tsx`, `TwoCol` from `src/components/TwoCol.tsx`

- [ ] **Step 1: Create About.tsx**

```tsx
import { motion } from 'framer-motion';
import { ChapterMark } from '../components/ChapterMark';
import { TwoCol } from '../components/TwoCol';
import styles from './About.module.css';

export function About() {
  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container">
        <ChapterMark num="02" title="About" />
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          我们是谁 <span className={styles.titleEn}>/ Who We Are</span>
        </motion.h2>
        <TwoCol
          items={[
            {
              label: '中文',
              text: '我们是一个由中学生开发者组成的年轻技术工作室。我们起源于深圳的 AIx脑科学研学活动。TiantianYZJ、NoWint、SUKY、chenmuyun_bit 四人在 5 天的研学中组队实验、一起完成汇报、彻夜讨论 AI 与技术。活动结束那天，大家不想就此失联——于是把一个研学小组，变成了一个长期技术工作室。我们不是公司，也不是商业创业团队，更像一个年轻开发者技术社团：因兴趣聚集，因项目合作，因技术成长。成员年龄大约 13–15 岁，自由、开放、兴趣驱动。',
            },
            {
              label: 'EN',
              text: 'We are a teenage developer studio born from an AI research camp in Shenzhen. Four strangers turned teammates in 5 days — and chose to keep going. We are not a company; we are a community of young devs who build real software together. Free, open, and driven by interest. Members are around 13–15 years old.',
            },
          ]}
        />
      </div>
    </section>
  );
}
```

`src/sections/About.module.css`:
```css
.about {
  min-height: 80vh;
  display: flex;
  align-items: center;
}
.title {
  font-family: var(--font-display);
  font-size: var(--text-title);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-6);
}
.titleEn {
  font-size: var(--text-headline);
  color: var(--text-tertiary);
  font-weight: 400;
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add About section"
```

---

### Task 10: Projects Section + ProjectCard

**Files:**
- Create: `src/components/ProjectCard.tsx` + `.module.css`
- Create: `src/sections/Projects.tsx` + `.module.css`

**Interfaces:**
- Consumes: `PROJECTS` from `src/data/projects.ts`, `Project` type, `PrismBorder` from `src/components/PrismBorder.tsx`, `ChapterMark`

- [ ] **Step 1: Create ProjectCard.tsx**

```tsx
import type { Project } from '../data/projects';
import { PrismBorder } from './PrismBorder';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <PrismBorder className={styles.cardBorder}>
        <div className={styles.cardBody}>
          <div className={styles.header}>
            <h3 className={styles.name}>{project.name}</h3>
            {project.isFlagship && <span className={styles.flagship}>旗舰</span>}
          </div>
          <p className={styles.tagline}>{project.tagline}</p>
          <p className={styles.description}>{project.description}</p>
          {project.capabilities && (
            <div className={styles.capabilities}>
              {project.capabilities.map((cap) => (
                <div key={cap.group} className={styles.capGroup}>
                  <div className={styles.capLabel}>{cap.group}</div>
                  <ul className={styles.capItems}>
                    {cap.items.map((item) => (
                      <li key={item} className={styles.capItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div className={styles.highlight}>
            <span className={styles.highlightLabel}>亮点</span>
            <p className={styles.highlightText}>{project.highlight}</p>
          </div>
          <div className={styles.footer}>
            <span className={styles.techStack}>{project.techStack}</span>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
              GitHub →
            </a>
          </div>
        </div>
      </PrismBorder>
    </div>
  );
}
```

`src/components/ProjectCard.module.css`:
```css
.card {
  flex: 0 0 80vw;
  max-width: 800px;
  scroll-snap-align: center;
}
.cardBorder {
  height: 100%;
}
.cardBody {
  padding: var(--space-5);
  background: var(--surface-elevated);
  border-radius: 12px;
}
.header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}
.name {
  font-family: var(--font-display);
  font-size: var(--text-headline);
  font-weight: 700;
}
.flagship {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(131, 56, 236, 0.2);
  color: var(--prism-2);
  border: 1px solid rgba(131, 56, 236, 0.3);
}
.tagline {
  font-size: var(--text-body);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}
.description {
  font-size: var(--text-caption);
  color: var(--text-tertiary);
  line-height: 1.7;
  margin-bottom: var(--space-3);
}
.capabilities {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.capGroup {}
.capLabel {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.capItems {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.capItem {
  font-size: var(--text-caption);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
}
.highlight {
  margin-bottom: var(--space-3);
  padding: var(--space-2);
  border-left: 2px solid var(--prism-2);
  background: rgba(131, 56, 236, 0.05);
}
.highlightLabel {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--prism-2);
}
.highlightText {
  font-size: var(--text-caption);
  color: var(--text-secondary);
  margin-top: 4px;
  line-height: 1.6;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-3);
  border-top: 1px solid var(--hairline);
}
.techStack {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
}
.githubLink {
  font-size: var(--text-caption);
  color: var(--text-primary);
  transition: color var(--duration-fast) var(--ease-apple);
}
.githubLink:hover { color: var(--prism-3); }
```

- [ ] **Step 2: Create Projects.tsx**

```tsx
import { motion } from 'framer-motion';
import { ChapterMark } from '../components/ChapterMark';
import { ProjectCard } from '../components/ProjectCard';
import { PROJECTS } from '../data/projects';
import styles from './Projects.module.css';

export function Projects() {
  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className="container">
        <ChapterMark num="03" title="Projects" />
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          我们的项目 <span className={styles.titleEn}>/ Our Projects</span>
        </motion.h2>
        <motion.p
          className={styles.intro}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          我们把一次研学变成了一系列真实项目。每一个都在解决真实问题。
        </motion.p>
      </div>
      <div className={styles.carousel}>
        {PROJECTS.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
```

`src/sections/Projects.module.css`:
```css
.projects {
  min-height: 100vh;
  overflow: hidden;
}
.title {
  font-family: var(--font-display);
  font-size: var(--text-title);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-2);
}
.titleEn {
  font-size: var(--text-headline);
  color: var(--text-tertiary);
  font-weight: 400;
}
.intro {
  font-size: var(--text-headline);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  max-width: 700px;
}
.carousel {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: var(--space-4);
  padding: var(--space-4) var(--space-4);
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--prism-2) transparent;
}
.carousel::-webkit-scrollbar {
  height: 4px;
}
.carousel::-webkit-scrollbar-track {
  background: transparent;
}
.carousel::-webkit-scrollbar-thumb {
  background: var(--prism-2);
  border-radius: 2px;
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Projects section with horizontal carousel"
```

---

### Task 11: Team Section + MemberCard

**Files:**
- Create: `src/components/MemberCard.tsx` + `.module.css`
- Create: `src/sections/Team.tsx` + `.module.css`

**Interfaces:**
- Consumes: `MEMBERS` from `src/data/members.ts`, `Member` type, `ChapterMark`

- [ ] **Step 1: Create MemberCard.tsx**

```tsx
import type { Member } from '../data/members';
import styles from './MemberCard.module.css';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <div className={styles.card}>
      <img
        src={member.avatarUrl}
        alt={member.name}
        className={styles.avatar}
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div className={styles.avatarFallback} aria-hidden="true">
        {member.name.charAt(0)}
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{member.name}</h4>
        <p className={styles.tagline}>{member.tagline}</p>
        <p className={styles.role}>{member.role} · {member.direction}</p>
        <a href={member.siteUrl} target="_blank" rel="noopener noreferrer" className={styles.site}>
          {member.siteLabel} →
        </a>
      </div>
    </div>
  );
}
```

`src/components/MemberCard.module.css`:
```css
.card {
  background: var(--surface-elevated);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: border-color var(--duration-medium) var(--ease-apple),
              transform var(--duration-medium) var(--ease-apple);
}
.card:hover {
  border-color: rgba(131, 56, 236, 0.3);
  transform: translateY(-4px);
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: var(--space-2);
  border: 2px solid var(--hairline);
}
.avatarFallback {
  display: none;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-2);
  margin-bottom: var(--space-2);
  border: 2px solid var(--hairline);
}
.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.name {
  font-family: var(--font-display);
  font-size: var(--text-body);
  font-weight: 600;
}
.tagline {
  font-size: var(--text-caption);
  color: var(--text-secondary);
  font-style: italic;
}
.role {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}
.site {
  font-size: var(--text-caption);
  color: var(--text-primary);
  margin-top: var(--space-1);
  transition: color var(--duration-fast) var(--ease-apple);
}
.site:hover { color: var(--prism-3); }
```

- [ ] **Step 2: Create Team.tsx**

```tsx
import { motion } from 'framer-motion';
import { ChapterMark } from '../components/ChapterMark';
import { MemberCard } from '../components/MemberCard';
import { MEMBERS, INACTIVE_MEMBERS } from '../data/members';
import styles from './Team.module.css';

export function Team() {
  return (
    <section id="team" className={`section ${styles.team}`}>
      <div className="container">
        <ChapterMark num="04" title="Team" />
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          6 位在职成员 <span className={styles.titleEn}>/ Six Active Members</span>
        </motion.h2>
        <motion.p
          className={styles.intro}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          一群用真实项目练习成长的年轻开发者。
          <br />
          <span className={styles.introEn}>Teenage devs leveling up through real projects.</span>
        </motion.p>
        <div className={styles.grid}>
          {MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            >
              <MemberCard member={member} />
            </motion.div>
          ))}
        </div>
        <p className={styles.footnote}>
          {INACTIVE_MEMBERS.join('、')} 为不在职联合创始人；规模计划 10 人左右，长期上限 15 人。
        </p>
      </div>
    </section>
  );
}
```

`src/sections/Team.module.css`:
```css
.team {
  min-height: 80vh;
}
.title {
  font-family: var(--font-display);
  font-size: var(--text-title);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-2);
}
.titleEn {
  font-size: var(--text-headline);
  color: var(--text-tertiary);
  font-weight: 400;
}
.intro {
  font-size: var(--text-headline);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}
.introEn {
  font-size: var(--text-body);
  color: var(--text-tertiary);
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.footnote {
  font-size: var(--text-caption);
  color: var(--text-tertiary);
  text-align: center;
}
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Team section with member cards"
```

---

### Task 12: Join Section + Footer

**Files:**
- Create: `src/sections/Join.tsx` + `.module.css`
- Create: `src/sections/Footer.tsx` + `.module.css`

**Interfaces:**
- Consumes: `ChapterMark`, `SITE` from `src/data/site.ts`, `PrismBorder`

- [ ] **Step 1: Create Join.tsx**

```tsx
import { motion } from 'framer-motion';
import { ChapterMark } from '../components/ChapterMark';
import { PrismBorder } from '../components/PrismBorder';
import styles from './Join.module.css';

const QQ_QR_URL = 'https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/JOINUS.jpg';

export function Join() {
  return (
    <section id="join" className={`section ${styles.join}`}>
      <div className="container">
        <ChapterMark num="05" title="Join Us" />
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          加入我们 <span className={styles.titleEn}>/ Join Us</span>
        </motion.h2>
        <motion.p
          className={styles.intro}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          我们正在招人，面向 14–18 岁、有热情有基础的年轻开发者。
          <br />
          <span className={styles.introEn}>We're recruiting teenage devs — 14 to 18 — who code, learn, and build.</span>
        </motion.p>
        <div className={styles.columns}>
          <div className={styles.col}>
            <div className={styles.colLabel}>关注</div>
            <p className={styles.colText}>LLM · AGI · AIGC · Agent · Harness</p>
          </div>
          <div className={styles.col}>
            <div className={styles.colLabel}>需要</div>
            <p className={styles.colText}>编程热情 · 开发能力 · Git 协作经验 · AI 兴趣</p>
          </div>
          <div className={styles.col}>
            <div className={styles.colLabel}>不欢迎</div>
            <p className={styles.colText}>混名额 · 不写代码 · 只会给 AI 下指令 · 不懂工程 · 不协作</p>
          </div>
        </div>
        <motion.div
          className={styles.qrSection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PrismBorder className={styles.qrWrapper}>
            <img src={QQ_QR_URL} alt="QQ 群二维码" className={styles.qrImg} loading="lazy" />
          </PrismBorder>
          <p className={styles.qrLabel}>扫码加入 PEYT Studio QQ 群</p>
          <p className={styles.qrLabelEn}>Scan to join our QQ group</p>
        </motion.div>
        <motion.p
          className={styles.note}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          E2EE 加密 + 自主可控 + 可自部署，是我们造 PEYT Chat 的动机，也是对外叙事的主轴。
        </motion.p>
      </div>
    </section>
  );
}
```

`src/sections/Join.module.css`:
```css
.join {
  min-height: 80vh;
  text-align: center;
}
.title {
  font-family: var(--font-display);
  font-size: var(--text-title);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-2);
}
.titleEn {
  font-size: var(--text-headline);
  color: var(--text-tertiary);
  font-weight: 400;
}
.intro {
  font-size: var(--text-headline);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}
.introEn {
  font-size: var(--text-body);
  color: var(--text-tertiary);
}
.columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}
.col {
  text-align: center;
}
.colLabel {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  letter-spacing: 0.1em;
  color: var(--prism-2);
  margin-bottom: var(--space-1);
  text-transform: uppercase;
}
.colText {
  font-size: var(--text-caption);
  color: var(--text-secondary);
  line-height: 1.6;
}
.qrSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}
.qrWrapper {
  padding: var(--space-2);
  display: inline-block;
}
.qrImg {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
}
.qrLabel {
  font-size: var(--text-body);
  color: var(--text-primary);
}
.qrLabelEn {
  font-size: var(--text-caption);
  color: var(--text-tertiary);
}
.note {
  font-size: var(--text-caption);
  color: var(--text-tertiary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}
@media (max-width: 768px) {
  .columns { grid-template-columns: 1fr; gap: var(--space-2); }
}
```

- [ ] **Step 2: Create Footer.tsx**

```tsx
import { SITE } from '../data/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.text}>
          {SITE.name} — <span className={styles.slogan}>{SITE.slogan}</span>
        </p>
        <a href={SITE.githubOrg} target="_blank" rel="noopener noreferrer" className={styles.link}>
          GitHub →
        </a>
      </div>
    </footer>
  );
}
```

`src/sections/Footer.module.css`:
```css
.footer {
  padding: var(--space-5) 0;
  text-align: center;
  border-top: 1px solid var(--hairline);
}
.text {
  font-family: var(--font-display);
  font-size: var(--text-body);
  color: var(--text-secondary);
  margin-bottom: var(--space-1);
}
.slogan {
  color: var(--text-primary);
}
.link {
  font-size: var(--text-caption);
  color: var(--text-tertiary);
  transition: color var(--duration-fast) var(--ease-apple);
}
.link:hover { color: var(--prism-3); }
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Join and Footer sections"
```

---

### Task 13: App Assembly + Copy PLY + Final Integration

**Files:**
- Modify: `src/App.tsx` (full assembly)
- Copy: `jd_output/jd.ply` → `public/gaussians/jd.ply`

**Interfaces:**
- Consumes: all sections, SceneBackground, Nav, SectionDots, ScrollProgress, SECTIONS, SITE

- [ ] **Step 1: Copy PLY file**

Run: `mkdir -p /Users/xiatian/Desktop/projects/PEYTow/public/gaussians && cp /Users/xiatian/Desktop/projects/PEYTow/jd_output/jd.ply /Users/xiatian/Desktop/projects/PEYTow/public/gaussians/jd.ply`

- [ ] **Step 2: Write final App.tsx**

```tsx
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Nav } from './components/Nav';
import { Footer } from './sections/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { SectionDots } from './components/SectionDots';
import { SceneBackground } from './components/SceneBackground';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { Team } from './sections/Team';
import { Join } from './sections/Join';
import { SECTIONS } from './data/site';

export function App() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const veilOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.9, 1],
    [0, 0.82, 0.82, 0.82],
  );

  return (
    <>
      <SceneBackground plyPath="gaussians/jd.ply" />
      <motion.div
        className="bg-veil"
        style={prefersReducedMotion ? undefined : { opacity: veilOpacity }}
        aria-hidden="true"
      />
      <a href="#hero" className="skip-link">跳到内容</a>
      <ScrollProgress />
      <Nav />
      <SectionDots sections={SECTIONS} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Team />
        <Join />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Run dev server and test**

Run: `npm run dev`
Expected: 
- Page loads at localhost:5173
- Hero shows PEYT Studio with prism slogan
- 3DGS black hole loads (or shows fallback)
- All 5 sections scroll correctly
- Nav, SectionDots, ScrollProgress work
- Project carousel scrolls horizontally
- Member cards render (avatars may fail gracefully)
- QQ QR code loads from GitHub

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: final App assembly with 3DGS background and all sections"
```
