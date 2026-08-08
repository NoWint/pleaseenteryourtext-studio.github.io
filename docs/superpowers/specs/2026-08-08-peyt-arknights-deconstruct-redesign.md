# PEYT 官网重新设计 Spec · 明日方舟解构主义

> **For agentic workers:** 本 spec 是对现有 PEYT 官网（已实现的 3DGS 黑洞背景 + 棱镜彩色方案）的彻底推翻重做。新方案为明日方舟式解构主义、纯黑白、无 3DGS 背景。

## 背景与动机

现有官网（`/Users/xiatian/Desktop/projects/PEYTow`）已实现完整 5 板块 + 3DGS 黑洞背景 + 棱镜彩色渐变方案，但用户反馈"太丑"，要求：

1. 改为**明日方舟式解构主义**设计
2. 颜色**只有黑白**（允许黑白派生的灰阶做层次）
3. **移除 3DGS 背景**

本 spec 定义推翻重做的设计。实现时复用现有项目脚手架（Vite + React + TS + framer-motion）、数据层（`src/data/`）、板块语义，但视觉系统、组件、样式全部重写。

## 目标

一个视觉张力极致、黑白解构主义、明日方舟质感的 PEYT 工作室官网。无 3DGS，无彩色，纯 CSS + SVG 实现顶级质感。

## 全局约束（硬性，逐条适用所有任务）

- **调色板**：`#000` `#0a0a0a` `#0c0c0c` `#111` `#1C1C1E` `#222` `#333` `#444` `#666` `#888` `#999` `#bbb` `#e8e8e8` `#f4f4f4` `#fff`。**禁止任何彩色**（无 hue，无 prism 渐变，无 accent 蓝/紫/粉）。
- **字体**：Display 用 `Inter` 900（超重、`letter-spacing: -.05em`、描边镂空变体）；Subhead 用 `Inter` 200（极细斜体）；Body / Data / Label 用 `JetBrains Mono` 400/500/700。全站仅这两族。
- **缓动**：所有动效统一 `cubic-bezier(0.16, 1, 0.3, 1)`，非线性。禁止线性 `linear`、禁止 `ease` 默认值。
- **动效触发**：滚动触发 `once: true`，不反复闪。`prefers-reduced-motion: reduce` 全部降级为**瞬时渐显**（opacity 0→1，无位移、无 transform）。
- **无 3DGS**：移除 `@mkkellogg/gaussian-splats-3d`、`three` 依赖；移除 `SceneBackground`、`GaussianSplats3DCanvas`、`useCameraDolly`、`bg-veil`；移除 `public/gaussians/`；移除 `vite.config.ts` 的 COOP/COEP 头。
- **无棱镜**：移除 `PrismText`、`PrismBorder`、`--prism-*` 变量。
- **响应式**：桌面（>1024px）、平板（768-1024px）、移动（<768px）三档。移动端侧边刻度条导航隐藏，改顶部极简条。
- **内容来源不变**：`src/data/site.ts`、`members.ts`、`projects.ts` 的数据结构可保留，文案保留。QQ 二维码、成员头像仍从 GitHub `PleaseEnterYourText-Studio/About` 仓库 raw URL 加载。
- **不创建文档/README**：除非用户明确要求。
- **不引入新依赖**：除移除 3DGS 相关外，不新增 npm 包。`framer-motion`、`react`、`react-dom` 保留。

## 架构总览

```
PEYTow/
├── index.html                      # 改 title/meta 为黑白解构语言
├── vite.config.ts                  # 移除 COOP/COEP，移除 3DGS 相关
├── package.json                    # 移除 gaussian-splats-3d / three
├── public/
│   └── (gaussians/ 删除)
├── src/
│   ├── main.tsx                    # 保留
│   ├── App.tsx                     # 重写：组装新结构，无 SceneBackground/veil
│   ├── vite-env.d.ts               # 移除 gaussian-splats-3d 模块声明
│   ├── styles/
│   │   ├── tokens.css              # 重写：黑白灰阶 token，移除 prism
│   │   └── global.css              # 重写：黑白底、Inter+JetBrains、解构基础
│   ├── data/                       # 保留（site.ts / members.ts / projects.ts）
│   ├── components/
│   │   ├── SectorMark.tsx + .module.css       # 新：章节编号标记（00-04）
│   │   ├── ScanReveal.tsx + .module.css       # 新：扫描线入场动效包装
│   │   ├── SliceReveal.tsx + .module.css      # 新：斜切揭示动效包装
│   │   ├── HudFrame.tsx + .module.css         # 新：四角标记 + 网格 HUD 框
│   │   ├── DataReadout.tsx + .module.css      # 新：HUD 数据行读出
│   │   ├── SideRail.tsx + .module.css         # 新：侧边刻度条导航（替代 SectionDots）
│   │   ├── ScrollProgress.tsx + .module.css   # 重写：顶部 1px 白线 scaleX
│   │   ├── ProjectCard.tsx + .module.css      # 重写：斜切小单元卡片
│   │   ├── MemberCard.tsx + .module.css       # 重写：黑白头像 + HUD 编号
│   │   └── (删除: Nav / PrismText / PrismBorder / ChapterMark / TwoCol / SceneBackground / GaussianSplats3DCanvas)
│   ├── hooks/
│   │   ├── useActiveSection.ts                # 新：IntersectionObserver 追踪当前 sector
│   │   └── (删除: useCameraDolly.ts)
│   └── sections/
│       ├── Hero.tsx + .module.css             # 重写：Sector 00 深底 HUD 全开
│       ├── About.tsx + .module.css            # 重写：Sector 01 白底两栏咬合
│       ├── Projects.tsx + .module.css         # 重写：Sector 02 深底旗舰+横滚
│       ├── Team.tsx + .module.css             # 重写：Sector 03 白底成员网格
│       ├── Join.tsx + .module.css             # 重写：Sector 04 深底 QR+CTA
│       └── (删除: Footer.tsx，合并入 Join)
```

## 设计系统

### 调色板 token（`tokens.css` 重写）

```css
:root {
  /* 黑白灰阶（无 hue） */
  --ink:           #000000;   /* 主黑 */
  --ink-deep:      #0a0a0a;   /* 深底背景 */
  --ink-elevated:  #0c0c0c;   /* 深底卡片 */
  --ink-surface:   #111111;   /* 深底表面 */
  --ink-2:         #1C1C1E;   /* 深底分隔 */
  --line:          #2a2a2a;   /* 深底线 */
  --line-2:        #333333;
  --line-3:        #444444;

  --paper:         #ffffff;   /* 主白 */
  --paper-2:       #f4f4f4;   /* 浅底背景 */
  --paper-3:       #e8e8e8;   /* 浅底斜切块 */

  --text-on-ink:        #ffffff;
  --text-on-ink-2:      #bbbbbb;
  --text-on-ink-3:      #888888;
  --text-on-ink-4:      #666666;

  --text-on-paper:      #000000;
  --text-on-paper-2:    #444444;
  --text-on-paper-3:    #666666;
  --text-on-paper-4:    #888888;

  /* 字体 */
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:    'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  --font-text:    var(--font-mono);  /* 正文默认等宽 */

  /* 字号 */
  --text-mega:    clamp(56px, 9vw, 104px);   /* Hero 镂空标题 */
  --text-display: clamp(40px, 6vw, 72px);    /* 板块大标题 */
  --text-title:   clamp(28px, 4vw, 48px);
  --text-headline:clamp(20px, 2.5vw, 32px);
  --text-body:    15px;
  --text-caption: 13px;
  --text-label:   11px;   /* HUD label，.25em 字距，全大写 */
  --text-micro:   9px;    /* 坐标/读数 */

  /* 间距（8 基） */
  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px;
  --space-5: 48px; --space-6: 64px; --space-7: 96px; --space-8: 128px;

  --container: 1320px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-slow: 0.8s; --dur-med: 0.4s; --dur-fast: 0.2s;

  color-scheme: dark;
}
```

**字体加载**：通过 `index.html` `<link>` 引入 Google Fonts `Inter`（wght 200,400,700,900）和 `JetBrains Mono`（wght 400,500,700）。

### 解构骨架：斜切 + 深浅交替

- **斜切单元**用 CSS `clip-path: polygon(...)` 实现，不引入新依赖。
- **深浅交替节奏**（5 sector）：
  - 00 HERO — 深底（`--ink-deep`）
  - 01 ABOUT — 浅底（`--paper`，反色文字）
  - 02 PROJECTS — 深底
  - 03 TEAM — 浅底
  - 04 JOIN — 深底
- **咬合规则**：斜切线两侧的 HUD 元素自动反色——深底区用白色 HUD（角标/线条/文字），浅底区用黑色 HUD。斜切线本身是两套语言的接缝。

### HUD 视觉语言

- **四角标记**：`HudFrame` 组件，四角 L 形边框（`border` + 裁掉两条边），深底白框、浅底黑框。
- **细网格**：`background-image` 线性渐变 32px 网格，深底 `rgba(255,255,255,.05)`、浅底 `rgba(0,0,0,.06)`。
- **扫描线**：`repeating-linear-gradient` 1px/4px 间距，深底 `rgba(255,255,255,.03)`。
- **数据读出**：`DataReadout` 组件，等宽字、`.15-.25em` 字距、全大写、`LABEL → VALUE` 行式。
- **坐标条**：`LAT 00.00 · LNG 00.00 // PEYT-HQ` 风格的等宽微字。

### 字体张力规则

- Hero 标题：Inter 900，`--text-mega`，`letter-spacing: -.05em`，第二行用描边镂空（`-webkit-text-stroke: 2.5px currentColor; color: transparent`）。
- 板块标题：Inter 900，`--text-display`，配 Inter 200 斜体英文副标（`font-style: italic; font-weight: 200`）。
- 正文/数据：JetBrains Mono 400，`--text-body`。
- Label/HUD：JetBrains Mono 700，`--text-label`，`letter-spacing: .25em`，`text-transform: uppercase`。
- 反差锚点：每页至少一处 900 vs 200 的并置。

## 板块设计

### Sector 00 · HERO（深底）

- 全屏（`min-height: 100vh`）。
- 左侧斜切黑色块（`clip-path`，占 62% 宽，右缘斜切）+ 右侧白底区 + 右下浅灰斜切块。构成 B 方案骨架。
- 叠加 A 方案 HUD 层：细网格 + 扫描线 + 四角标记。
- 顶栏：`PEYT-SYS // v2.6 // SECT 04` 左、`● LIVE` 中、`● SYNC` 右（深底白字 / 浅底黑字反色）。
- 标题区（左中）：`// 00 — DESIGNATION` 前缀 + `TYPE` / `EVERY`（镂空）/ `THING` 三行 + `// PEYT Studio · 请输入文本工作室` 副标。
- 右上章戳：`EST` / `2026`（Inter 900 大字）/ `PEYT // 08` 黑底白字块。
- 右下数据表：`PROJECT → PEYT-CHAT` / `STATUS → OPEN SOURCE` / `MEMBERS → 08` 三行。
- 左下 HUD：`SYNC` 进度条（72% 填充）+ 7 格 tickrow（5 亮 2 暗）。
- CTA：右下 `加入 →` 斜切按钮（`clip-path` 切右下角）。
- 坐标条：左下 `LAT 00.00 · LNG 00.00 // PEYT-HQ`。
- 入场动效：标题区 `ScanReveal`（扫描线扫过 + 内容揭示），章戳/数据/CTA `stagger` 渐显。

### Sector 01 · ABOUT（浅底）

- 白底反色呼吸。
- 两栏咬合：左实心黑块（`--ink`）放核心信条（Inter 900 大字），右白底放展开叙事（JetBrains Mono 正文）。
- 斜切接缝处放坐标/编号：`// 01 — MANIFESTO` / `LNG 01.00`。
- 信条内容（保留现有文案）：「中学生开发者，因研学相遇，因技术走到一起」。
- 展开叙事：英文版 + 工作室定位（基于现有 `SITE` 数据）。
- `SliceReveal` 斜切揭示动效：黑块从左划入，叙事从右渐显。

### Sector 02 · PROJECTS（深底）

- 标题 `// 02 — ARSENAL` + `PROJECTS` / `/ 06 项`。
- **PEYT Chat 旗舰**：占大块斜切主位（左 60%，斜切黑块 + 镂空项目名 + tagline + tech stack + GitHub 链接 + capabilities 三组列表）。
- **其余 5 项**：横向滚动卡片阵列（右 40% 或下方横滚区）。每张 `ProjectCard` 是小斜切单元：编号（`03`-`07`）+ 名称 + tagline + tech + `↗` GitHub。
- `ProjectCard` hover：边框 `--line → #fff`，非线性 `0.2s`。
- 横滚区支持鼠标拖拽 + 滚轮 + 触摸滑动；不出现原生水平滚动条（自定义 `scrollbar-width: none`）。
- `ScanReveal` 入场。

### Sector 03 · TEAM（浅底）

- 标题 `// 03 — PERSONNEL` + `TEAM` / `/ 06 人`。
- 6 张 `MemberCard` 网格（桌面 3 列、平板 2 列、移动 1 列）。
- `MemberCard`：头像（`filter: grayscale(1) contrast(1.1)` 黑白处理）+ HUD 编号（`01`-`06`）+ 名字（Inter 900）+ role + direction + tagline + 站点链接（`↗`）。
- 卡片内部斜切角（`clip-path` 切一角）避免规整。
- 头像加载失败 fallback：黑底白字首字母。
- `SliceReveal` 入场，卡片 `stagger` 0.08s。

### Sector 04 · JOIN（深底，Footer 合并）

- 标题 `// 04 — RECRUIT` + `JOIN` / `/ 入队`。
- 左侧：大斜切 CTA `加入我们 →`（Inter 900，斜切按钮）。
- 右侧：QQ 群二维码图片（`https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/JOINUS.jpg`，`filter: grayscale(1) contrast(1.05)` 保证黑白；hover 放大 1.1x 非线性 `0.3s`）+ GitHub 组织入口（`↗`）。若 `JOINUS.jpg` 实际非二维码，实现时需从 `studio/` 目录确认正确资源，fallback 为纯文字「QQ 群：联系群主」。
- 底部 Footer 区（合并）：版权 / 坐标封口 `LAT 04.00 · LNG 04.00 // END OF TRANSMISSION` / `PEYT Studio © 2026`。
- HUD 框架收束，呼应 Sector 00 形成闭环（四角标记 + 顶栏 `SECT 04 // END`）。
- `ScanReveal` 入场。

## 导航：侧边刻度条（SideRail，B 方案）

- 桌面端（>1024px）：固定右侧垂直刻度条，5 个 item（00-04）。
- 每个 item：`LABEL`（hover/active 显现）+ `tick`（短横线）+ `num`（编号）。
- 当前 sector：tick 拉长至 28px、加粗 2px、白色；label 显现白色。
- hover：tick 拉长至 22px、白色；label 显现。
- 点击：smooth scroll 到对应 sector（`scroll-margin-top` 避开顶部进度条）。
- 顶部 `ScrollProgress`：1px 白线，`transform: scaleX` 非线性填充，`transform-origin: left`。
- 移动端（≤1024px）：`SideRail` 通过 CSS 降级为顶部水平条（`flex-direction: row`，固定顶部，5 个紧凑编号 item，label 始终隐藏，仅显编号 + 短 tick），不新增组件。点击同样 smooth scroll。
- `useActiveSection` hook：`IntersectionObserver`（`rootMargin: '-40% 0px -55% 0px'`）追踪当前 sector，返回 active id。

## 动效系统（全部非线性，统一 `--ease`）

### ScanReveal（扫描线入场）

- 包装组件，children 在扫描线扫过后揭示。
- 实现：`framer-motion` `whileInView`，一道 2px 白线从 `top:0` 移到 `top:100%`（`0.5s`），同时内容 `opacity 0→1, y:20→0`（`0.8s`，delay `0.3s`）。
- `once: true`，`viewport: { margin: '-10%' }`。
- reduced-motion：线不移动，内容瞬时渐显。

### SliceReveal（斜切揭示）

- 包装组件，斜切色块从边缘划过覆盖再退场。
- 实现：一个 `clip-path` 色块 `polygon` 从 0 宽展开到全宽再收回（`0.6s`），内容在色块退场时揭示。
- `once: true`。
- reduced-motion：色块不出现，内容瞬时渐显。

### 数据流 stagger（HUD 数据行）

- `DataReadout` 内多行 `stagger` 0.3s 左滑入场（`x:-8→0, opacity:0→1`）。
- sync bar `width: 0→72%` 非线性填充。
- reduced-motion：全部瞬时渐显。

### 禁止项

- 不做视差、3D 旋转、粒子、光效、弹跳、回弹。
- 不做 `linear` 缓动、`ease` 默认值。
- 不做反复触发（`once: true` 强制）。

## 组件接口

### SectorMark

```tsx
interface SectorMarkProps {
  num: string;      // "00" - "04"
  title: string;    // "HERO" | "ABOUT" | ...
  coord: string;    // "LAT 00.00" | "LNG 01.00"
  variant: 'ink' | 'paper';  // 深底 | 浅底
}
```
渲染：`// SECTOR` label + 大编号（Inter 900）+ coord 微字。深底白字、浅底黑字。

### ScanReveal / SliceReveal

```tsx
interface RevealProps {
  children: React.ReactNode;
  variant?: 'ink' | 'paper';  // 决定扫描线/色块颜色
  delay?: number;
}
```

### HudFrame

```tsx
interface HudFrameProps {
  children: React.ReactNode;
  variant: 'ink' | 'paper';  // 深底白框 | 浅底黑框
  corners?: boolean;          // 是否显示四角标记，默认 true
  grid?: boolean;             // 是否显示细网格，默认 true
  scan?: boolean;             // 是否显示扫描线，默认 true
}
```

### DataReadout

```tsx
interface DataReadoutProps {
  rows: { label: string; value: string; live?: boolean }[];
  variant: 'ink' | 'paper';
  label?: string;  // 顶部 "// UNIT READOUT" 之类
}
```

### SideRail

```tsx
interface SideRailProps {
  sections: { id: string; label: string; num: string }[];
  activeId: string;
  onNavigate: (id: string) => void;
}
```

### ScrollProgress

无 props。固定顶部 1px，`scaleX` 跟随 `scrollYProgress`。

### ProjectCard

```tsx
interface ProjectCardProps {
  project: Project;       // 来自 data/projects.ts
  index: number;          // 0-5，显示为 02-07 编号
  variant: 'flagship' | 'standard';
}
```

### MemberCard

```tsx
interface MemberCardProps {
  member: Member;         // 来自 data/members.ts
  index: number;          // 0-5，显示为 01-06 编号
}
```

### useActiveSection

```tsx
function useActiveSection(ids: string[]): string;
// IntersectionObserver，返回当前 active 的 id
```

## App 组装

```tsx
export function App() {
  const sections = [
    { id: 'hero', label: 'HERO', num: '00' },
    { id: 'about', label: 'ABOUT', num: '01' },
    { id: 'projects', label: 'PROJECTS', num: '02' },
    { id: 'team', label: 'TEAM', num: '03' },
    { id: 'join', label: 'JOIN', num: '04' },
  ];
  const activeId = useActiveSection(sections.map(s => s.id));

  return (
    <>
      <ScrollProgress />
      <SideRail
        sections={sections}
        activeId={activeId}
        onNavigate={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
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

## 数据层调整

`src/data/site.ts` 保留 `SITE`、`SECTIONS`、`NAV_LINKS`。`SECTIONS` 可扩展为含 `num` 字段：

```ts
export const SECTIONS = [
  { id: 'hero', label: 'HERO', num: '00' },
  { id: 'about', label: 'ABOUT', num: '01' },
  { id: 'projects', label: 'PROJECTS', num: '02' },
  { id: 'team', label: 'TEAM', num: '03' },
  { id: 'join', label: 'JOIN', num: '04' },
] as const;
```

`members.ts`、`projects.ts` 数据不变。

## 移除清单

- 依赖：`@mkkellogg/gaussian-splats-3d`、`three`、`@types/three`（从 `package.json` 删除）。
- 文件：`SceneBackground.tsx/.module.css`、`GaussianSplats3DCanvas.tsx/.module.css`、`useCameraDolly.ts`、`PrismText.tsx/.module.css`、`PrismBorder.tsx/.module.css`、`ChapterMark.tsx/.module.css`、`TwoCol.tsx/.module.css`、`Nav.tsx/.module.css`、`SectionDots.tsx/.module.css`、`Footer.tsx/.module.css`、`public/gaussians/`。
- `vite-env.d.ts` 中的 `declare module '@mkkellogg/gaussian-splats-3d'`。
- `vite.config.ts` 中的 COOP/COEP 头配置。
- `tokens.css` 中的 `--prism-*`、`--accent-*` 变量。
- `global.css` 中的 `.bg-veil`、`--accent` 引用。

## 验收标准

1. `npx tsc --noEmit` 无错误。
2. `npm run dev` 启动，页面加载无 console 错误。
3. 5 个 sector 深浅交替，斜切骨架清晰可见。
4. 字体张力：Inter 900 镂空标题 vs Inter 200 斜体副标 vs JetBrains Mono 等宽正文，反差明确。
5. 纯黑白：页面任何位置取色无 hue（HSL 的 H=0 且 S=0，或 RGB 三通道相等）。
6. 无 3DGS：`SceneBackground`/`GaussianSplats3DCanvas` 不再渲染，`public/gaussians/` 已删。
7. 侧边刻度条导航：滚动时 active item 刻度拉长加粗，点击 smooth scroll。
8. 动效：扫描线/斜切揭示/数据流三种均非线性 `cubic-bezier(0.16,1,0.3,1)`，`once: true`。
9. `prefers-reduced-motion: reduce` 下全部降级为瞬时渐显。
10. 响应式：移动端侧边刻度条隐藏，改顶部条；板块布局自适应。
11. 成员头像黑白处理（`grayscale`），加载失败有 fallback。
12. QQ 二维码加载成功（从 GitHub raw），黑白处理。

## 非目标

- 不做多语言切换（现有中英混排保留）。
- 不做暗/亮模式切换（深浅交替已是设计语言）。
- 不做 SEO 优化 beyond 基础 meta。
- 不做性能监控/analytics。
- 不做 PWA/离线支持。
