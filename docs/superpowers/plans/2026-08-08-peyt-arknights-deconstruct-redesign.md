# PEYT 官网明日方舟解构主义重做 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 推翻现有 3DGS 黑洞背景 + 棱镜彩色官网，重做为明日方舟式解构主义、纯黑白、无 3DGS 的 PEYT 工作室官网。

**Architecture:** 复用现有 Vite + React + TS + framer-motion 脚手架与数据层，重写视觉系统（tokens/global）、组件（HUD 框架/动效包装/导航/卡片）、5 个板块。斜切骨架用 CSS `clip-path`，HUD 用纯 CSS 网格/扫描线/四角标记，动效用 framer-motion `whileInView` 非线性缓动。

**Tech Stack:** React 18 · TypeScript 5.6 · Vite 6 · framer-motion 12 · Inter + JetBrains Mono（Google Fonts）· 纯 CSS Modules

## Global Constraints

- 调色板仅黑白灰阶：`#000` `#0a0a0a` `#0c0c0c` `#111` `#1C1C1E` `#222` `#333` `#444` `#666` `#888` `#999` `#bbb` `#e8e8e8` `#f4f4f4` `#fff`。禁止任何彩色（无 hue）。
- 字体仅两族：`Inter`（900/200，标题/副标）+ `JetBrains Mono`（400/500/700，正文/数据/label）。
- 缓动统一 `cubic-bezier(0.16, 1, 0.3, 1)`，禁止 `linear`/`ease` 默认值。
- 动效 `once: true`，`prefers-reduced-motion: reduce` 降级为瞬时渐显（opacity 0→1 无位移）。
- 移除 3DGS：删 `@mkkellogg/gaussian-splats-3d`/`three`/`@types/three` 依赖、`SceneBackground`/`GaussianSplats3DCanvas`/`useCameraDolly`/`public/gaussians/`、vite COOP/COEP 头、`vite-env.d.ts` 模块声明。
- 移除棱镜：删 `PrismText`/`PrismBorder`/`--prism-*`/`--accent-*`。
- 响应式三档：桌面 >1024px、平板 768-1024px、移动 <768px。
- 不新增 npm 包，不创建文档/README。
- 数据层 `src/data/` 保留，`SECTIONS` 扩展 `num` 字段。

---

## File Structure

```
PEYTow/
├── index.html                      # Task 1: 加 Google Fonts link
├── vite.config.ts                  # Task 1: 移除 COOP/COEP
├── package.json                    # Task 1: 移除 3DGS 依赖
├── src/
│   ├── vite-env.d.ts               # Task 1: 移除 gaussian-splats 声明
│   ├── styles/
│   │   ├── tokens.css              # Task 2: 重写黑白灰阶 token
│   │   └── global.css              # Task 2: 重写黑白底基础
│   ├── data/site.ts                # Task 2: SECTIONS 加 num 字段
│   ├── hooks/
│   │   └── useActiveSection.ts     # Task 5: IntersectionObserver hook
│   ├── components/
│   │   ├── HudFrame.tsx + .module.css        # Task 3: 四角+网格+扫描线框
│   │   ├── SectorMark.tsx + .module.css      # Task 3: 章节编号标记
│   │   ├── DataReadout.tsx + .module.css     # Task 3: HUD 数据行
│   │   ├── ScanReveal.tsx + .module.css      # Task 4: 扫描线入场动效
│   │   ├── SliceReveal.tsx + .module.css     # Task 4: 斜切揭示动效
│   │   ├── ScrollProgress.tsx + .module.css  # Task 6: 顶部进度线
│   │   ├── SideRail.tsx + .module.css        # Task 6: 侧边刻度条导航
│   │   ├── ProjectCard.tsx + .module.css     # Task 9: 斜切项目卡
│   │   └── MemberCard.tsx + .module.css      # Task 10: 黑白成员卡
│   ├── sections/
│   │   ├── Hero.tsx + .module.css            # Task 7: Sector 00 深底
│   │   ├── About.tsx + .module.css           # Task 8: Sector 01 浅底
│   │   ├── Projects.tsx + .module.css        # Task 9: Sector 02 深底
│   │   ├── Team.tsx + .module.css            # Task 10: Sector 03 浅底
│   │   └── Join.tsx + .module.css            # Task 11: Sector 04 深底
│   └── App.tsx                               # Task 12: 组装
└── (删除: Nav/PrismText/PrismBorder/ChapterMark/TwoCol/SceneBackground/GaussianSplats3DCanvas/Footer/useCameraDolly/public/gaussians)
```

---

### Task 1: 清理 3DGS + 棱镜依赖与配置

**Files:**
- Modify: `package.json`（移除 3DGS 依赖）
- Modify: `vite.config.ts`（移除 COOP/COEP）
- Modify: `src/vite-env.d.ts`（移除 gaussian-splats 声明）
- Modify: `index.html`（加 Google Fonts）
- Delete: `public/gaussians/jd.ply`、`src/components/SceneBackground.tsx`、`src/components/SceneBackground.module.css`、`src/components/GaussianSplats3DCanvas.tsx`、`src/components/GaussianSplats3DCanvas.module.css`、`src/components/PrismText.tsx`、`src/components/PrismText.module.css`、`src/components/PrismBorder.tsx`、`src/components/PrismBorder.module.css`、`src/components/ChapterMark.tsx`、`src/components/ChapterMark.module.css`、`src/components/TwoCol.tsx`、`src/components/TwoCol.module.css`、`src/components/Nav.tsx`、`src/components/Nav.module.css`、`src/components/SectionDots.tsx`、`src/components/SectionDots.module.css`、`src/sections/Footer.tsx`、`src/sections/Footer.module.css`、`src/hooks/useCameraDolly.ts`

**Interfaces:**
- Produces: 干净的 `package.json`（无 3DGS）、`vite.config.ts`（无 COOP/COEP）、`vite-env.d.ts`（无模块声明）、`index.html`（含 Google Fonts）

- [ ] **Step 1: 重写 package.json 移除 3DGS 依赖**

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
    "framer-motion": "^12.40.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.3"
  }
}
```

- [ ] **Step 2: 重写 vite.config.ts 移除 COOP/COEP**

```typescript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
});
```

- [ ] **Step 3: 重写 vite-env.d.ts 移除 gaussian-splats 声明**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 4: 重写 index.html 加 Google Fonts**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PEYT Studio — Type Everything</title>
  <meta name="description" content="PleaseEnterYourText Studio · 请输入文本工作室 — 中学生开发者工作室" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,200;0,400;0,700;0,900;1,200&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

- [ ] **Step 5: 删除所有 3DGS / 棱镜 / 旧导航 / 旧 Footer 文件**

用 DeleteFile 删除以下 21 个文件：
- `public/gaussians/jd.ply`
- `src/components/SceneBackground.tsx`、`src/components/SceneBackground.module.css`
- `src/components/GaussianSplats3DCanvas.tsx`、`src/components/GaussianSplats3DCanvas.module.css`
- `src/components/PrismText.tsx`、`src/components/PrismText.module.css`
- `src/components/PrismBorder.tsx`、`src/components/PrismBorder.module.css`
- `src/components/ChapterMark.tsx`、`src/components/ChapterMark.module.css`
- `src/components/TwoCol.tsx`、`src/components/TwoCol.module.css`
- `src/components/Nav.tsx`、`src/components/Nav.module.css`
- `src/components/SectionDots.tsx`、`src/components/SectionDots.module.css`
- `src/sections/Footer.tsx`、`src/sections/Footer.module.css`
- `src/hooks/useCameraDolly.ts`

- [ ] **Step 6: 运行 npm install 清理 node_modules**

Run: `npm install`
Expected: 依赖树更新，无 3DGS 包

- [ ] **Step 7: 临时修复 App.tsx 使 tsc 通过（后续 Task 12 重写）**

```tsx
export function App() {
  return <div style={{ color: '#fff', background: '#000', minHeight: '100vh' }}>PEYT — rebuild in progress</div>;
}
```

- [ ] **Step 8: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "chore: remove 3DGS, prism, and legacy nav/footer; add Inter+JetBrains fonts"
```

---

### Task 2: 设计系统 tokens + global + 数据层

**Files:**
- Create: `src/styles/tokens.css`（重写）
- Create: `src/styles/global.css`（重写）
- Modify: `src/data/site.ts`（SECTIONS 加 num）

**Interfaces:**
- Produces: `--ink-*`/`--paper-*`/`--font-display`/`--font-mono`/`--ease`/`--text-mega` 等 CSS 变量；全局黑白底样式；`SECTIONS` 含 `num` 字段

- [ ] **Step 1: 重写 tokens.css**

```css
:root {
  /* 黑白灰阶（无 hue） */
  --ink:           #000000;
  --ink-deep:      #0a0a0a;
  --ink-elevated:  #0c0c0c;
  --ink-surface:   #111111;
  --ink-2:         #1C1C1E;
  --line:          #2a2a2a;
  --line-2:        #333333;
  --line-3:        #444444;

  --paper:         #ffffff;
  --paper-2:       #f4f4f4;
  --paper-3:       #e8e8e8;

  --text-on-ink:        #ffffff;
  --text-on-ink-2:      #bbbbbb;
  --text-on-ink-3:      #888888;
  --text-on-ink-4:      #666666;

  --text-on-paper:      #000000;
  --text-on-paper-2:    #444444;
  --text-on-paper-3:    #666666;
  --text-on-paper-4:    #888888;

  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:    'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  --font-text:    var(--font-mono);

  --text-mega:     clamp(56px, 9vw, 104px);
  --text-display:  clamp(40px, 6vw, 72px);
  --text-title:    clamp(28px, 4vw, 48px);
  --text-headline: clamp(20px, 2.5vw, 32px);
  --text-body:     15px;
  --text-caption:  13px;
  --text-label:    11px;
  --text-micro:    9px;

  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px;
  --space-5: 48px; --space-6: 64px; --space-7: 96px; --space-8: 128px;

  --container: 1320px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-slow: 0.8s; --dur-med: 0.4s; --dur-fast: 0.2s;

  color-scheme: dark;
}
```

- [ ] **Step 2: 重写 global.css**

```css
*,
*::before,
*::after {
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
  font-size: var(--text-body);
  color: var(--text-on-ink);
  background: var(--ink-deep);
  overflow-x: hidden;
  line-height: 1.5;
}

::selection {
  background: var(--ink);
  color: var(--paper);
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--paper);
  color: var(--ink);
  padding: 8px 16px;
  z-index: 9999;
  transition: top var(--dur-fast) var(--ease);
}
.skip-link:focus {
  top: 0;
}

:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--space-4);
  width: 100%;
}

main {
  position: relative;
  z-index: 1;
}

section {
  position: relative;
  width: 100%;
  scroll-margin-top: 0;
}

/* HUD 工具类 */
.label {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--text-label);
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.micro {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: 修改 site.ts SECTIONS 加 num 字段**

替换 `SECTIONS` 导出为：

```ts
export const SECTIONS = [
  { id: 'hero', label: 'HERO', num: '00' },
  { id: 'about', label: 'ABOUT', num: '01' },
  { id: 'projects', label: 'PROJECTS', num: '02' },
  { id: 'team', label: 'TEAM', num: '03' },
  { id: 'join', label: 'JOIN', num: '04' },
] as const;
```

保留 `SITE` 和 `NAV_LINKS` 不变。

- [ ] **Step 4: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/global.css src/data/site.ts
git commit -m "feat: rewrite design tokens to monochrome + add Inter/JetBrains globals"
```

---

### Task 3: HUD 基础组件（HudFrame + SectorMark + DataReadout）

**Files:**
- Create: `src/components/HudFrame.tsx`、`src/components/HudFrame.module.css`
- Create: `src/components/SectorMark.tsx`、`src/components/SectorMark.module.css`
- Create: `src/components/DataReadout.tsx`、`src/components/DataReadout.module.css`

**Interfaces:**
- Produces:
  - `HudFrame({ children, variant, corners?, grid?, scan? })` — 四角标记 + 网格 + 扫描线包装框
  - `SectorMark({ num, title, coord, variant })` — 章节编号标记
  - `DataReadout({ rows, variant, label? })` — HUD 数据行读出

- [ ] **Step 1: 写 HudFrame.tsx**

```tsx
import type { ReactNode } from 'react';
import styles from './HudFrame.module.css';

export interface HudFrameProps {
  children: ReactNode;
  variant: 'ink' | 'paper';
  corners?: boolean;
  grid?: boolean;
  scan?: boolean;
}

export function HudFrame({
  children,
  variant,
  corners = true,
  grid = true,
  scan = true,
}: HudFrameProps) {
  return (
    <div className={`${styles.frame} ${styles[variant]}`}>
      {grid && <div className={styles.gridLayer} aria-hidden="true" />}
      {scan && <div className={styles.scanLayer} aria-hidden="true" />}
      {corners && (
        <>
          <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
        </>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: 写 HudFrame.module.css**

```css
.frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.ink {
  background: var(--ink-deep);
  color: var(--text-on-ink);
}
.paper {
  background: var(--paper);
  color: var(--text-on-paper);
}

.gridLayer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.ink .gridLayer {
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 32px 32px;
}
.paper .gridLayer {
  background-image:
    linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: 32px 32px;
}

.scanLayer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.ink .scanLayer {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255,255,255,0.03) 0,
    rgba(255,255,255,0.03) 1px,
    transparent 1px,
    transparent 4px
  );
}
.paper .scanLayer {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.025) 0,
    rgba(0,0,0,0.025) 1px,
    transparent 1px,
    transparent 4px
  );
}

.corner {
  position: absolute;
  width: 28px;
  height: 28px;
  border: 2px solid currentColor;
}
.tl { top: 16px; left: 16px; border-right: 0; border-bottom: 0; }
.tr { top: 16px; right: 16px; border-left: 0; border-bottom: 0; }
.bl { bottom: 16px; left: 16px; border-right: 0; border-top: 0; }
.br { bottom: 16px; right: 16px; border-left: 0; border-top: 0; }

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
```

- [ ] **Step 3: 写 SectorMark.tsx**

```tsx
import styles from './SectorMark.module.css';

export interface SectorMarkProps {
  num: string;
  title: string;
  coord: string;
  variant: 'ink' | 'paper';
}

export function SectorMark({ num, title, coord, variant }: SectorMarkProps) {
  return (
    <div className={`${styles.mark} ${styles[variant]}`}>
      <div className={styles.label}>// SECTOR</div>
      <div className={styles.num}>{num}</div>
      <div className={styles.coord}>{coord} · {title}</div>
    </div>
  );
}
```

- [ ] **Step 4: 写 SectorMark.module.css**

```css
.mark {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.label {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--text-label);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.6;
}

.num {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-title);
  letter-spacing: -0.04em;
  line-height: 0.9;
}

.coord {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
}

.ink { color: var(--text-on-ink); }
.paper { color: var(--text-on-paper); }
```

- [ ] **Step 5: 写 DataReadout.tsx**

```tsx
import { motion, useReducedMotion } from 'framer-motion';
import styles from './DataReadout.module.css';

export interface DataReadoutRow {
  label: string;
  value: string;
  live?: boolean;
}

export interface DataReadoutProps {
  rows: DataReadoutRow[];
  variant: 'ink' | 'paper';
  label?: string;
}

export function DataReadout({ rows, variant, label }: DataReadoutProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className={`${styles.readout} ${styles[variant]}`}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.rows}>
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            className={styles.row}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.3 }}
          >
            <span className={styles.rowLabel}>{row.label}</span>
            <span className={styles.rowValue}>
              {row.live && <span className={styles.dot} />}
              <b>{row.value}</b>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: 写 DataReadout.module.css**

```css
.readout {
  width: 100%;
}

.label {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--text-label);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.6;
  margin-bottom: var(--space-2);
}

.rows {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-bottom: 1px solid;
}
.row:last-child {
  border-bottom: 0;
}

.ink .row { border-color: var(--line); }
.paper .row { border-color: rgba(0,0,0,0.2); }

.rowLabel { opacity: 0.6; }
.rowValue { display: flex; align-items: center; gap: var(--space-1); }
.rowValue b { font-weight: 700; }

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: blip 1.4s var(--ease) infinite;
}

@keyframes blip {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.ink { color: var(--text-on-ink); }
.paper { color: var(--text-on-paper); }
```

- [ ] **Step 7: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 8: Commit**

```bash
git add src/components/HudFrame.* src/components/SectorMark.* src/components/DataReadout.*
git commit -m "feat: add HudFrame, SectorMark, DataReadout components"
```

---

### Task 4: 动效包装组件（ScanReveal + SliceReveal）

**Files:**
- Create: `src/components/ScanReveal.tsx`、`src/components/ScanReveal.module.css`
- Create: `src/components/SliceReveal.tsx`、`src/components/SliceReveal.module.css`

**Interfaces:**
- Consumes: 无（独立动效包装）
- Produces:
  - `ScanReveal({ children, variant?, delay? })` — 扫描线扫过后揭示内容
  - `SliceReveal({ children, variant?, delay? })` — 斜切色块划过揭示内容

- [ ] **Step 1: 写 ScanReveal.tsx**

```tsx
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './ScanReveal.module.css';

export interface ScanRevealProps {
  children: ReactNode;
  variant?: 'ink' | 'paper';
  delay?: number;
}

export function ScanReveal({ children, variant = 'ink', delay = 0 }: ScanRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className={styles.wrapper}>
      {!prefersReducedMotion && (
        <motion.div
          className={`${styles.scanLine} ${styles[variant]}`}
          initial={{ top: '0%', opacity: 0 }}
          whileInView={{ top: '100%', opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
          aria-hidden="true"
        />
      )}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: prefersReducedMotion ? 0 : delay + 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: 写 ScanReveal.module.css**

```css
.wrapper {
  position: relative;
  width: 100%;
}

.scanLine {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 2;
  pointer-events: none;
}

.ink { background: var(--paper); box-shadow: 0 0 8px var(--paper); }
.paper { background: var(--ink); box-shadow: 0 0 8px var(--ink); }
```

- [ ] **Step 3: 写 SliceReveal.tsx**

```tsx
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './SliceReveal.module.css';

export interface SliceRevealProps {
  children: ReactNode;
  variant?: 'ink' | 'paper';
  delay?: number;
}

export function SliceReveal({ children, variant = 'paper', delay = 0 }: SliceRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  // 斜切块颜色与 variant 相反：paper 区用 ink 块划过，ink 区用 paper 块划过
  const sliceVariant = variant === 'ink' ? 'paper' : 'ink';
  return (
    <div className={styles.wrapper}>
      {!prefersReducedMotion && (
        <motion.div
          className={`${styles.slice} ${styles[sliceVariant]}`}
          initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          whileInView={{
            clipPath: [
              'polygon(0 0, 0 0, 0 100%, 0 100%)',
              'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
            ],
          }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay, times: [0, 0.5, 1] }}
          aria-hidden="true"
        />
      )}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: prefersReducedMotion ? 0 : delay + 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: 写 SliceReveal.module.css**

```css
.wrapper {
  position: relative;
  width: 100%;
}

.slice {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.ink { background: var(--ink); }
.paper { background: var(--paper); }
```

- [ ] **Step 5: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 6: Commit**

```bash
git add src/components/ScanReveal.* src/components/SliceReveal.*
git commit -m "feat: add ScanReveal and SliceReveal motion wrapper components"
```

---

### Task 5: useActiveSection hook

**Files:**
- Create: `src/hooks/useActiveSection.ts`

**Interfaces:**
- Produces: `useActiveSection(ids: string[]): string` — 返回当前 active 的 section id，默认返回第一个 id

- [ ] **Step 1: 写 useActiveSection.ts**

```tsx
import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
```

- [ ] **Step 2: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useActiveSection.ts
git commit -m "feat: add useActiveSection IntersectionObserver hook"
```

---

### Task 6: 导航组件（ScrollProgress + SideRail）

**Files:**
- Create: `src/components/ScrollProgress.tsx`、`src/components/ScrollProgress.module.css`
- Create: `src/components/SideRail.tsx`、`src/components/SideRail.module.css`

**Interfaces:**
- Consumes: `useActiveSection` from Task 5
- Produces:
  - `ScrollProgress()` — 顶部 1px 进度线，`scaleX` 跟随滚动
  - `SideRail({ sections, activeId, onNavigate })` — 侧边刻度条，桌面垂直/移动水平

- [ ] **Step 1: 写 ScrollProgress.tsx**

```tsx
import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './ScrollProgress.module.css';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className={styles.progress}
      style={{ transformOrigin: '0%', scaleX }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: 写 ScrollProgress.module.css**

```css
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--paper);
  z-index: 200;
}
```

- [ ] **Step 3: 写 SideRail.tsx**

```tsx
import styles from './SideRail.module.css';

export interface RailSection {
  id: string;
  label: string;
  num: string;
}

export interface SideRailProps {
  sections: RailSection[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function SideRail({ sections, activeId, onNavigate }: SideRailProps) {
  return (
    <nav className={styles.rail} aria-label="章节导航">
      {sections.map((s) => (
        <button
          key={s.id}
          className={`${styles.item} ${activeId === s.id ? styles.active : ''}`}
          onClick={() => onNavigate(s.id)}
          aria-label={s.label}
          aria-current={activeId === s.id ? 'true' : undefined}
        >
          <span className={styles.label}>{s.label}</span>
          <span className={styles.tick} />
          <span className={styles.num}>{s.num}</span>
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: 写 SideRail.module.css**

```css
.rail {
  position: fixed;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 100;
}

.item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) 0;
  background: none;
  cursor: pointer;
  color: var(--text-on-ink-4);
  transition: color var(--dur-fast) var(--ease);
}
.item:hover {
  color: var(--text-on-ink);
}

.label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease);
}
.item:hover .label,
.item.active .label {
  opacity: 1;
}

.tick {
  display: block;
  width: 14px;
  height: 1px;
  background: var(--line-3);
  transition: all var(--dur-fast) var(--ease);
}
.item:hover .tick {
  width: 22px;
  background: var(--text-on-ink);
}
.item.active .tick {
  width: 28px;
  height: 2px;
  background: var(--text-on-ink);
}

.num {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.1em;
  width: 18px;
  text-align: right;
}
.item.active .num {
  color: var(--text-on-ink);
}

/* 移动端：水平顶部条 */
@media (max-width: 1024px) {
  .rail {
    right: auto;
    top: 0;
    left: 0;
    right: 0;
    transform: none;
    flex-direction: row;
    justify-content: center;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
    padding: var(--space-1) var(--space-2);
  }
  .item {
    flex-direction: row;
    gap: var(--space-1);
    padding: 4px var(--space-1);
  }
  .label {
    display: none;
  }
  .tick {
    width: 10px;
  }
  .item:hover .tick {
    width: 14px;
  }
  .item.active .tick {
    width: 18px;
  }
  .num {
    width: auto;
    font-size: 8px;
  }
}
```

- [ ] **Step 5: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 6: Commit**

```bash
git add src/components/ScrollProgress.* src/components/SideRail.*
git commit -m "feat: add ScrollProgress and SideRail navigation"
```

---

### Task 7: Hero 板块（Sector 00 深底）

**Files:**
- Create: `src/sections/Hero.tsx`、`src/sections/Hero.module.css`

**Interfaces:**
- Consumes: `HudFrame`、`ScanReveal`、`DataReadout`、`SectorMark` from Task 3/4
- Produces: `Hero()` — 全屏深底首屏

- [ ] **Step 1: 写 Hero.tsx**

```tsx
import { motion, useReducedMotion } from 'framer-motion';
import { HudFrame } from '../components/HudFrame';
import { ScanReveal } from '../components/ScanReveal';
import { DataReadout } from '../components/DataReadout';
import { SectorMark } from '../components/SectorMark';
import styles from './Hero.module.css';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section id="hero" className={styles.hero}>
      <HudFrame variant="ink">
        {/* 斜切骨架 */}
        <div className={styles.sliceBg} aria-hidden="true" />
        <div className={styles.slicePaper} aria-hidden="true" />
        <div className={styles.slicePaper2} aria-hidden="true" />

        {/* 顶栏 */}
        <div className={styles.topbar}>
          <span className={styles.topL}>PEYT-SYS // v2.6 // SECT 00</span>
          <span className={styles.topC}>
            <span className={styles.dot} /> LIVE
          </span>
          <span className={styles.topR}>
            <span className={styles.dot} /> SYNC
          </span>
        </div>

        {/* 标题区 */}
        <div className={styles.titleArea}>
          <ScanReveal variant="ink">
            <div className={styles.pre}>// 00 — DESIGNATION</div>
            <h1 className={styles.title}>
              TYPE<br />
              <span className={styles.outline}>EVERY</span>THING
            </h1>
            <div className={styles.sub}>// PEYT Studio · 请输入文本工作室</div>
          </ScanReveal>
        </div>

        {/* 右上章戳 */}
        <motion.div
          className={styles.stamp}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          <div className={styles.stampLbl}>EST</div>
          <div className={styles.stampBig}>2026</div>
          <div className={styles.stampBlk}>PEYT // 08</div>
        </motion.div>

        {/* 右下数据表 */}
        <div className={styles.dataArea}>
          <DataReadout
            variant="paper"
            label="// UNIT READOUT"
            rows={[
              { label: 'PROJECT', value: 'PEYT-CHAT' },
              { label: 'STATUS', value: 'OPEN SOURCE', live: true },
              { label: 'MEMBERS', value: '08' },
            ]}
          />
        </div>

        {/* 左下 HUD */}
        <div className={styles.hudBl}>
          <div className={styles.bar}>
            <div className={styles.barLbl}>SYNC</div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} />
            </div>
          </div>
          <div className={styles.tickrow} aria-hidden="true">
            <i className={styles.on} /><i className={styles.on} /><i className={styles.on} />
            <i className={styles.on} /><i className={styles.on} /><i /><i />
          </div>
        </div>

        {/* CTA */}
        <motion.a
          href="#join"
          className={styles.cta}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1 }}
        >
          加入 →
        </motion.a>

        {/* 坐标 */}
        <div className={styles.coord}>LAT 00.00 · LNG 00.00 // PEYT-HQ</div>
      </HudFrame>
    </section>
  );
}
```

- [ ] **Step 2: 写 Hero.module.css**

```css
.hero {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

/* 斜切骨架 */
.sliceBg {
  position: absolute;
  top: 0;
  left: 0;
  width: 62%;
  height: 100%;
  background: var(--ink);
  clip-path: polygon(0 0, 100% 0, 68% 100%, 0 100%);
}
.slicePaper {
  position: absolute;
  top: 0;
  left: 0;
  width: 44%;
  height: 100%;
  background: var(--ink-elevated);
  clip-path: polygon(0 0, 100% 0, 58% 100%, 0 100%);
  opacity: 0.6;
}
.slicePaper2 {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 40%;
  height: 60%;
  background: var(--paper-3);
  clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);
}

/* 顶栏 */
.topbar {
  position: absolute;
  top: 20px;
  left: 60px;
  right: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  z-index: 3;
}
.topL { color: var(--text-on-ink-3); }
.topC, .topR {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ink);
}
.topC { color: var(--text-on-ink); }
.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: blip 1.4s var(--ease) infinite;
}
@keyframes blip {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* 标题区 */
.titleArea {
  position: absolute;
  left: 60px;
  top: 34%;
  transform: translateY(-50%);
  z-index: 3;
  max-width: 60%;
}
.pre {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.3em;
  color: var(--text-on-ink-3);
  text-transform: uppercase;
  margin-bottom: var(--space-2);
}
.title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-mega);
  letter-spacing: -0.05em;
  line-height: 0.84;
  color: var(--text-on-ink);
}
.outline {
  -webkit-text-stroke: 2.5px var(--text-on-ink);
  color: transparent;
}
.sub {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: var(--text-caption);
  letter-spacing: 0.22em;
  color: var(--text-on-ink-2);
  margin-top: var(--space-3);
  text-transform: uppercase;
}

/* 章戳 */
.stamp {
  position: absolute;
  right: 60px;
  top: 60px;
  text-align: right;
  z-index: 3;
}
.stampLbl {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.2em;
  color: var(--ink);
  text-transform: uppercase;
  opacity: 0.6;
}
.stampBig {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 48px;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--ink);
  margin-top: 4px;
}
.stampBlk {
  background: var(--ink);
  color: var(--paper);
  padding: 3px 8px;
  display: inline-block;
  margin-top: var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 700;
}

/* 数据表 */
.dataArea {
  position: absolute;
  right: 60px;
  bottom: 60px;
  width: 30%;
  z-index: 3;
}

/* 左下 HUD */
.hudBl {
  position: absolute;
  left: 60px;
  bottom: 60px;
  z-index: 3;
}
.bar {
  width: 150px;
  margin-bottom: var(--space-2);
}
.barLbl {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  color: var(--text-on-ink-3);
  text-transform: uppercase;
  margin-bottom: 5px;
}
.barTrack {
  height: 2px;
  background: var(--line);
  position: relative;
}
.barFill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 72%;
  background: var(--text-on-ink);
}
.tickrow {
  display: flex;
  gap: 4px;
}
.tickrow i {
  display: block;
  width: 3px;
  height: 10px;
  background: var(--line-2);
}
.tickrow .on {
  background: var(--text-on-ink);
}

/* CTA */
.cta {
  position: absolute;
  right: 60px;
  bottom: 18px;
  background: var(--ink);
  color: var(--paper);
  padding: 10px 24px;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-weight: 700;
  clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
  z-index: 3;
}

/* 坐标 */
.coord {
  position: absolute;
  left: 60px;
  bottom: 24px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--text-on-ink-4);
  letter-spacing: 0.2em;
  z-index: 3;
}
.coord b {
  color: var(--text-on-ink);
  font-weight: 400;
}

/* 响应式 */
@media (max-width: 1024px) {
  .topbar, .titleArea, .stamp, .dataArea, .hudBl, .cta, .coord {
    left: var(--space-4);
    right: var(--space-4);
  }
  .titleArea { max-width: 90%; }
  .dataArea { width: 45%; }
  .stamp { display: none; }
}
@media (max-width: 768px) {
  .topbar { font-size: var(--text-micro); }
  .title { font-size: clamp(40px, 12vw, 64px); }
  .dataArea { position: relative; width: 100%; bottom: auto; right: auto; margin-top: var(--space-7); padding: 0 var(--space-4); }
  .hudBl { bottom: var(--space-4); }
  .cta { bottom: var(--space-4); }
  .coord { display: none; }
}
```

- [ ] **Step 3: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add src/sections/Hero.*
git commit -m "feat: add Hero section (Sector 00, ink, full HUD)"
```

---

### Task 8: About 板块（Sector 01 浅底）

**Files:**
- Create: `src/sections/About.tsx`、`src/sections/About.module.css`

**Interfaces:**
- Consumes: `SliceReveal`、`SectorMark`、`SITE` from data
- Produces: `About()` — 白底两栏咬合

- [ ] **Step 1: 写 About.tsx**

```tsx
import { SliceReveal } from '../components/SliceReveal';
import { SectorMark } from '../components/SectorMark';
import { SITE } from '../data/site';
import styles from './About.module.css';

export function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.sliceInk} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.leftCol}>
          <SliceReveal variant="paper" delay={0.1}>
            <SectorMark num="01" title="MANIFESTO" coord="LNG 01.00" variant="paper" />
            <div className={styles.creed}>
              中学生开发者。<br />
              因研学相遇，<br />
              因技术走到一起。
            </div>
          </SliceReveal>
        </div>
        <div className={styles.rightCol}>
          <SliceReveal variant="paper" delay={0.3}>
            <div className={styles.lead}>
              {SITE.fullName} · {SITE.chineseName}
            </div>
            <p className={styles.body}>
              我们是一群中学生开发者。一次研学让我们相遇，对技术的热爱让我们走到一起。现在，我们一起构建真实可用的软件。
            </p>
            <p className={styles.bodyEn}>
              We are a group of teenage developers. We met at a research camp, bonded over tech — and now we build real software together.
            </p>
            <div className={styles.meta}>
              <span>EST. 2026</span>
              <span>·</span>
              <span>OPEN SOURCE</span>
              <span>·</span>
              <span>08 MEMBERS</span>
            </div>
          </SliceReveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 写 About.module.css**

```css
.about {
  background: var(--paper);
  color: var(--text-on-paper);
  padding: clamp(120px, 18vh, 200px) 0;
  position: relative;
  overflow: hidden;
}

.sliceInk {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: var(--ink);
  clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  align-items: center;
}

.leftCol {
  color: var(--text-on-ink);
  padding: var(--space-5) var(--space-5) var(--space-5) 0;
}
.rightCol {
  padding: var(--space-5) 0 var(--space-5) var(--space-5);
}

.creed {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-display);
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin-top: var(--space-5);
}

.lead {
  font-family: var(--font-display);
  font-weight: 200;
  font-style: italic;
  font-size: var(--text-headline);
  color: var(--text-on-paper-2);
  margin-bottom: var(--space-4);
  letter-spacing: 0.01em;
}

.body {
  font-family: var(--font-mono);
  font-size: var(--text-body);
  color: var(--text-on-paper);
  line-height: 1.7;
  margin-bottom: var(--space-3);
}

.bodyEn {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-on-paper-3);
  line-height: 1.7;
  margin-bottom: var(--space-5);
}

.meta {
  display: flex;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-on-paper-3);
  border-top: 1px solid rgba(0,0,0,0.15);
  padding-top: var(--space-3);
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
  .leftCol, .rightCol {
    padding: var(--space-4) 0;
  }
  .sliceInk {
    width: 100%;
    height: 40%;
    clip-path: polygon(0 0, 100% 0, 100% 60%, 0 100%);
  }
}
```

- [ ] **Step 3: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add src/sections/About.*
git commit -m "feat: add About section (Sector 01, paper, two-col bite)"
```

---

### Task 9: Projects 板块 + ProjectCard（Sector 02 深底）

**Files:**
- Create: `src/components/ProjectCard.tsx`、`src/components/ProjectCard.module.css`
- Create: `src/sections/Projects.tsx`、`src/sections/Projects.module.css`

**Interfaces:**
- Consumes: `ScanReveal`、`SectorMark`、`PROJECTS`/`Project` from data
- Produces:
  - `ProjectCard({ project, index, variant })` — 斜切项目卡
  - `Projects()` — 深底旗舰 + 横滚阵列

- [ ] **Step 1: 写 ProjectCard.tsx**

```tsx
import { Project } from '../data/projects';
import styles from './ProjectCard.module.css';

export interface ProjectCardProps {
  project: Project;
  index: number;
  variant: 'flagship' | 'standard';
}

export function ProjectCard({ project, index, variant }: ProjectCardProps) {
  const num = String(index + 2).padStart(2, '0');
  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.sliceCorner} aria-hidden="true" />
      <div className={styles.head}>
        <span className={styles.num}>{num}</span>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label={`${project.name} on GitHub`}
        >
          ↗
        </a>
      </div>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.tagline}>{project.tagline}</p>
      {variant === 'flagship' && (
        <>
          <p className={styles.desc}>{project.description}</p>
          <p className={styles.highlight}>{project.highlight}</p>
          {project.capabilities && (
            <div className={styles.caps}>
              {project.capabilities.map((cap) => (
                <div key={cap.group} className={styles.capGroup}>
                  <div className={styles.capLabel}>{cap.group}</div>
                  <ul className={styles.capItems}>
                    {cap.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div className={styles.tech}>{project.techStack}</div>
    </article>
  );
}
```

- [ ] **Step 2: 写 ProjectCard.module.css**

```css
.card {
  position: relative;
  background: var(--ink-elevated);
  border: 1px solid var(--line);
  padding: var(--space-4);
  color: var(--text-on-ink);
  transition: border-color var(--dur-fast) var(--ease);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.card:hover {
  border-color: var(--text-on-ink);
}

.sliceCorner {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: var(--text-on-ink);
  clip-path: polygon(100% 0, 100% 100%, 0 0);
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.num {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--text-label);
  letter-spacing: 0.25em;
  color: var(--text-on-ink-3);
}
.link {
  font-family: var(--font-mono);
  font-size: var(--text-body);
  color: var(--text-on-ink-2);
  transition: color var(--dur-fast) var(--ease);
}
.link:hover {
  color: var(--text-on-ink);
}

.name {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-headline);
  letter-spacing: -0.02em;
  line-height: 1;
}

.tagline {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-on-ink-2);
  letter-spacing: 0.02em;
}

.desc {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-on-ink-2);
  line-height: 1.6;
}

.highlight {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-on-ink);
  line-height: 1.6;
  border-left: 2px solid var(--text-on-ink);
  padding-left: var(--space-2);
}

.caps {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-1);
}
.capGroup {
  border-top: 1px solid var(--line);
  padding-top: var(--space-2);
}
.capLabel {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-on-ink-3);
  margin-bottom: var(--space-1);
}
.capItems {
  list-style: none;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--text-on-ink-2);
  line-height: 1.6;
}

.tech {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--text-on-ink-4);
  letter-spacing: 0.1em;
  margin-top: auto;
  padding-top: var(--space-2);
  border-top: 1px solid var(--line);
}

/* 旗舰卡更大 */
.flagship {
  padding: var(--space-5);
}
.flagship .name {
  font-size: var(--text-title);
}

/* 标准卡固定横滚宽度 */
.standard {
  min-width: 280px;
  width: 280px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .standard {
    min-width: 240px;
    width: 240px;
  }
}
```

- [ ] **Step 3: 写 Projects.tsx**

```tsx
import { useRef } from 'react';
import { ScanReveal } from '../components/ScanReveal';
import { SectorMark } from '../components/SectorMark';
import { ProjectCard } from '../components/ProjectCard';
import { PROJECTS } from '../data/projects';
import styles from './Projects.module.css';

export function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const flagship = PROJECTS.find((p) => p.isFlagship);
  const rest = PROJECTS.filter((p) => !p.isFlagship);
  const flagshipIndex = PROJECTS.findIndex((p) => p.isFlagship);

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.head}>
        <ScanReveal variant="ink">
          <SectorMark num="02" title="ARSENAL" coord="LAT 02.00" variant="ink" />
          <h2 className={styles.title}>
            PROJECTS <span className={styles.titleSub}>/ 06 项</span>
          </h2>
        </ScanReveal>
      </div>

      <div className={styles.body}>
        {flagship && (
          <div className={styles.flagshipArea}>
            <ProjectCard project={flagship} index={flagshipIndex} variant="flagship" />
          </div>
        )}

        <div className={styles.restArea}>
          <div className={styles.restLabel}>// OTHER UNITS — 横向滚动 →</div>
          <div className={styles.scrollWrap} ref={scrollRef}>
            <div className={styles.scrollTrack}>
              {rest.map((p, i) => {
                const realIndex = PROJECTS.indexOf(p);
                return (
                  <ProjectCard key={p.name} project={p} index={realIndex} variant="standard" />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 写 Projects.module.css**

```css
.projects {
  background: var(--ink-deep);
  color: var(--text-on-ink);
  padding: clamp(120px, 18vh, 200px) 0;
  position: relative;
}

.head {
  max-width: var(--container);
  margin: 0 auto var(--space-6);
  padding: 0 var(--space-4);
}

.title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-display);
  letter-spacing: -0.04em;
  line-height: 1;
  margin-top: var(--space-4);
}
.titleSub {
  font-weight: 200;
  font-style: italic;
  color: var(--text-on-ink-3);
}

.body {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: grid;
  grid-template-columns: 60% 40%;
  gap: var(--space-4);
  align-items: start;
}

.flagshipArea {
  position: relative;
}

.restArea {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.restLabel {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-on-ink-3);
}

.scrollWrap {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
}
.scrollWrap::-webkit-scrollbar {
  display: none;
}
.scrollTrack {
  display: flex;
  gap: var(--space-3);
  padding-bottom: var(--space-2);
}

@media (max-width: 1024px) {
  .body {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectCard.* src/sections/Projects.*
git commit -m "feat: add Projects section (Sector 02, flagship + horizontal scroll)"
```

---

### Task 10: Team 板块 + MemberCard（Sector 03 浅底）

**Files:**
- Create: `src/components/MemberCard.tsx`、`src/components/MemberCard.module.css`
- Create: `src/sections/Team.tsx`、`src/sections/Team.module.css`

**Interfaces:**
- Consumes: `SliceReveal`、`SectorMark`、`MEMBERS`/`Member` from data
- Produces:
  - `MemberCard({ member, index })` — 黑白头像 + HUD 编号
  - `Team()` — 白底成员网格

- [ ] **Step 1: 写 MemberCard.tsx**

```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Member } from '../data/members';
import styles from './MemberCard.module.css';

export interface MemberCardProps {
  member: Member;
  index: number;
}

export function MemberCard({ member, index }: MemberCardProps) {
  const num = String(index + 1).padStart(2, '0');
  const [avatarFailed, setAvatarFailed] = useState(false);
  const initial = member.name.charAt(0).toUpperCase();

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
    >
      <div className={styles.sliceCorner} aria-hidden="true" />
      <div className={styles.head}>
        <span className={styles.num}>{num}</span>
        <span className={styles.role}>{member.role}</span>
      </div>
      <div className={styles.avatarWrap}>
        {avatarFailed ? (
          <div className={styles.fallback}>{initial}</div>
        ) : (
          <img
            src={member.avatarUrl}
            alt={member.name}
            className={styles.avatar}
            loading="lazy"
            onError={() => setAvatarFailed(true)}
          />
        )}
      </div>
      <h3 className={styles.name}>{member.name}</h3>
      <div className={styles.direction}>{member.direction}</div>
      <p className={styles.tagline}>{member.tagline}</p>
      <a
        href={member.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.site}
      >
        {member.siteLabel} ↗
      </a>
    </motion.article>
  );
}
```

- [ ] **Step 2: 写 MemberCard.module.css**

```css
.card {
  position: relative;
  background: var(--paper-2);
  border: 1px solid rgba(0,0,0,0.12);
  padding: var(--space-3);
  color: var(--text-on-paper);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition: border-color var(--dur-fast) var(--ease);
}
.card:hover {
  border-color: var(--ink);
}

.sliceCorner {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: var(--ink);
  clip-path: polygon(100% 0, 100% 100%, 0 0);
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.num {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--text-micro);
  letter-spacing: 0.25em;
  color: var(--text-on-paper-3);
}
.role {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-on-paper-2);
  background: var(--ink);
  color: var(--paper);
  padding: 2px 6px;
}

.avatarWrap {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--ink);
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.1);
}
.fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 48px;
  color: var(--paper);
}

.name {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-headline);
  letter-spacing: -0.02em;
  line-height: 1;
}

.direction {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-on-paper-3);
}

.tagline {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-on-paper-2);
  line-height: 1.5;
  flex: 1;
}

.site {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-on-paper);
  border-top: 1px solid rgba(0,0,0,0.15);
  padding-top: var(--space-2);
  transition: color var(--dur-fast) var(--ease);
}
.site:hover {
  color: var(--ink);
  font-weight: 700;
}
```

- [ ] **Step 3: 写 Team.tsx**

```tsx
import { SliceReveal } from '../components/SliceReveal';
import { SectorMark } from '../components/SectorMark';
import { MemberCard } from '../components/MemberCard';
import { MEMBERS } from '../data/members';
import styles from './Team.module.css';

export function Team() {
  return (
    <section id="team" className={styles.team}>
      <div className={styles.head}>
        <SliceReveal variant="paper">
          <SectorMark num="03" title="PERSONNEL" coord="LNG 03.00" variant="paper" />
          <h2 className={styles.title}>
            TEAM <span className={styles.titleSub}>/ 06 人</span>
          </h2>
        </SliceReveal>
      </div>
      <div className={styles.grid}>
        {MEMBERS.map((m, i) => (
          <MemberCard key={m.name} member={m} index={i} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 写 Team.module.css**

```css
.team {
  background: var(--paper);
  color: var(--text-on-paper);
  padding: clamp(120px, 18vh, 200px) 0;
}

.head {
  max-width: var(--container);
  margin: 0 auto var(--space-6);
  padding: 0 var(--space-4);
}

.title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-display);
  letter-spacing: -0.04em;
  line-height: 1;
  margin-top: var(--space-4);
}
.titleSub {
  font-weight: 200;
  font-style: italic;
  color: var(--text-on-paper-3);
}

.grid {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 6: Commit**

```bash
git add src/components/MemberCard.* src/sections/Team.*
git commit -m "feat: add Team section (Sector 03, paper, member grid)"
```

---

### Task 11: Join 板块（Sector 04 深底，Footer 合并）

**Files:**
- Create: `src/sections/Join.tsx`、`src/sections/Join.module.css`

**Interfaces:**
- Consumes: `ScanReveal`、`SectorMark`、`HudFrame`、`SITE` from data
- Produces: `Join()` — 深底 CTA + QR + Footer 合并

- [ ] **Step 1: 写 Join.tsx**

```tsx
import { useState } from 'react';
import { ScanReveal } from '../components/ScanReveal';
import { SectorMark } from '../components/SectorMark';
import { HudFrame } from '../components/HudFrame';
import { SITE } from '../data/site';
import styles from './Join.module.css';

const QR_URL = 'https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/JOINUS.jpg';

export function Join() {
  const [qrFailed, setQrFailed] = useState(false);
  return (
    <section id="join" className={styles.join}>
      <HudFrame variant="ink" corners grid scan>
        <div className={styles.inner}>
          <div className={styles.head}>
            <ScanReveal variant="ink">
              <SectorMark num="04" title="RECRUIT" coord="LAT 04.00" variant="ink" />
              <h2 className={styles.title}>
                JOIN <span className={styles.titleSub}>/ 入队</span>
              </h2>
            </ScanReveal>
          </div>

          <div className={styles.body}>
            <div className={styles.ctaArea}>
              <div className={styles.pre}>// 04 — ENLIST</div>
              <a href={SITE.githubOrg} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                加入我们 →
              </a>
              <p className={styles.ctaSub}>
                我们是中学生开发者。如果你也对技术有热情，欢迎加入。
              </p>
            </div>

            <div className={styles.qrArea}>
              <div className={styles.qrLabel}>// CONTACT — QQ GROUP</div>
              {qrFailed ? (
                <div className={styles.qrFallback}>
                  QQ 群：联系群主
                  <a href={SITE.githubOrg} target="_blank" rel="noopener noreferrer" className={styles.qrLink}>
                    GitHub 组织 ↗
                  </a>
                </div>
              ) : (
                <a href={SITE.githubOrg} target="_blank" rel="noopener noreferrer" className={styles.qrImgWrap}>
                  <img
                    src={QR_URL}
                    alt="QQ 群二维码"
                    className={styles.qrImg}
                    loading="lazy"
                    onError={() => setQrFailed(true)}
                  />
                </a>
              )}
              <a
                href={SITE.githubOrg}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.orgLink}
              >
                {SITE.githubOrg.replace('https://', '')} ↗
              </a>
            </div>
          </div>

          <footer className={styles.footer}>
            <span className={styles.footL}>LAT 04.00 · LNG 04.00 // END OF TRANSMISSION</span>
            <span className={styles.footR}>PEYT Studio © 2026</span>
          </footer>
        </div>
      </HudFrame>
    </section>
  );
}
```

- [ ] **Step 2: 写 Join.module.css**

```css
.join {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.inner {
  width: 100%;
  max-width: var(--container);
  margin: 0 auto;
  padding: clamp(80px, 12vh, 140px) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.head {
  position: relative;
  z-index: 2;
}

.title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-display);
  letter-spacing: -0.04em;
  line-height: 1;
  margin-top: var(--space-4);
}
.titleSub {
  font-weight: 200;
  font-style: italic;
  color: var(--text-on-ink-3);
}

.body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  align-items: center;
  position: relative;
  z-index: 2;
}

.ctaArea {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.pre {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.3em;
  color: var(--text-on-ink-3);
  text-transform: uppercase;
}
.cta {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-title);
  letter-spacing: -0.02em;
  color: var(--text-on-ink);
  background: var(--ink-elevated);
  border: 1px solid var(--text-on-ink);
  padding: var(--space-3) var(--space-5);
  clip-path: polygon(0 0, 100% 0, 94% 100%, 0 100%);
  align-self: flex-start;
  transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.cta:hover {
  background: var(--text-on-ink);
  color: var(--ink);
}
.ctaSub {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-on-ink-2);
  line-height: 1.6;
  max-width: 80%;
}

.qrArea {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
}
.qrLabel {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-on-ink-3);
}
.qrImgWrap {
  display: block;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border: 1px solid var(--line-3);
}
.qrImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
  transition: transform var(--dur-med) var(--ease);
}
.qrImgWrap:hover .qrImg {
  transform: scale(1.1);
}
.qrFallback {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: var(--ink-elevated);
  border: 1px solid var(--line-3);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-on-ink-2);
  text-align: center;
  padding: var(--space-2);
}
.qrLink {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-on-ink);
  border-bottom: 1px solid var(--text-on-ink);
}
.orgLink {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-on-ink-2);
  transition: color var(--dur-fast) var(--ease);
}
.orgLink:hover {
  color: var(--text-on-ink);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--line);
  padding-top: var(--space-3);
  position: relative;
  z-index: 2;
}
.footL, .footR {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-on-ink-4);
}

@media (max-width: 768px) {
  .body {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
  .footer {
    flex-direction: column;
    gap: var(--space-1);
    text-align: center;
  }
}
```

- [ ] **Step 3: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add src/sections/Join.*
git commit -m "feat: add Join section (Sector 04, ink, CTA+QR+footer merge)"
```

---

### Task 12: App 组装 + 集成测试

**Files:**
- Modify: `src/App.tsx`（最终组装）

**Interfaces:**
- Consumes: 所有 sections、`SideRail`、`ScrollProgress`、`useActiveSection`、`SECTIONS`

- [ ] **Step 1: 重写 App.tsx**

```tsx
import { ScrollProgress } from './components/ScrollProgress';
import { SideRail } from './components/SideRail';
import { useActiveSection } from './hooks/useActiveSection';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { Team } from './sections/Team';
import { Join } from './sections/Join';
import { SECTIONS } from './data/site';
import { useMemo } from 'react';

export function App() {
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const activeId = useActiveSection(ids);
  const sections = SECTIONS.map((s) => ({ id: s.id, label: s.label, num: s.num }));

  return (
    <>
      <ScrollProgress />
      <SideRail
        sections={sections}
        activeId={activeId}
        onNavigate={(id) =>
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }
      />
      <a href="#hero" className="skip-link">跳到内容</a>
      <main>
        <Hero />
        <About />
        <Projects />
        <Team />
        <Join />
      </main>
    </>
  );
}
```

- [ ] **Step 2: 验证 tsc 通过**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 启动 dev server**

Run: `npm run dev`
Expected: Vite 启动，无编译错误

- [ ] **Step 4: curl 验证页面加载（绕过代理）**

Run: `curl -s --noproxy '*' -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/`
Expected: HTTP 200

- [ ] **Step 5: 验证 HTML 内容**

Run: `curl -s --noproxy '*' http://localhost:5173/ | grep -o '<title>[^<]*</title>'`
Expected: `<title>PEYT Studio — Type Everything</title>`

- [ ] **Step 6: 浏览器验证（用 OpenPreview）**

确认：
- 5 个 sector 深浅交替
- 斜切骨架可见
- Inter 900 镂空标题渲染
- 侧边刻度条滚动联动
- 移动端缩窄时刻度条变顶部水平条

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "feat: final App assembly — arknights deconstruct monochrome"
```

---

## Self-Review 结果

**1. Spec coverage:**
- 调色板黑白灰阶 → Task 2 tokens.css ✓
- 字体 Inter 900/200 + JetBrains Mono → Task 1 Google Fonts + Task 2 tokens ✓
- 缓动 cubic-bezier(0.16,1,0.3,1) → 所有动效组件 Task 4/5/6/9/10 ✓
- 移除 3DGS → Task 1 ✓
- 移除棱镜 → Task 1 ✓
- 响应式三档 → 各板块 CSS module media queries ✓
- 5 sector 深浅交替 → Task 7-11 ✓
- 斜切骨架 → Hero/About/Projects CSS clip-path ✓
- HUD 四角/网格/扫描线 → Task 3 HudFrame ✓
- ScanReveal/SliceReveal 动效 → Task 4 ✓
- 数据流 stagger → Task 3 DataReadout ✓
- 侧边刻度条导航 → Task 6 ✓
- useActiveSection → Task 5 ✓
- SectorMark → Task 3 ✓
- ProjectCard 旗舰+标准 → Task 9 ✓
- MemberCard 黑白头像 → Task 10 ✓
- QQ 二维码 → Task 11 ✓
- Footer 合并入 Join → Task 11 ✓
- App 组装 → Task 12 ✓
- prefers-reduced-motion 降级 → ScanReveal/SliceReveal/DataReadout 均 useReducedMotion ✓

**2. Placeholder scan:** 无 TBD/TODO，所有步骤含完整代码 ✓

**3. Type consistency:**
- `HudFrameProps.variant: 'ink' | 'paper'` 一致 ✓
- `SectorMarkProps` 一致 ✓
- `DataReadoutProps.rows` 一致 ✓
- `ScanRevealProps`/`SliceRevealProps` 一致 ✓
- `SideRailProps.sections` 含 `{id,label,num}` ✓
- `ProjectCardProps.variant: 'flagship' | 'standard'` 一致 ✓
- `MemberCardProps` 一致 ✓
- `useActiveSection(ids: string[]): string` 一致 ✓
- `SECTIONS` 含 `num` 字段，App 用 `s.num` ✓

无问题，计划完整。
