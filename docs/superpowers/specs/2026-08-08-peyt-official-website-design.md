# PEYT Studio 官网设计

- **日期：** 2026-08-08
- **状态：** 已确认，待实现
- **目的：** PEYT Studio 官方网站落地页的技术实现设计
- **范围：** 单页落地页（5 板块）+ 3DGS 黑洞背景 + 棱镜折射彩视觉系统
- **文案来源：** [About 仓库 spec](https://github.com/PleaseEnterYourText-Studio/About/blob/main/docs/superpowers/specs/2026-08-08-official-website-copy-design.md)
- **参考实现：** `/Users/xiatian/Desktop/projects/EEGdata/showcase`

## 背景

PEYT Studio（PleaseEnterYourText Studio / 请输入文本工作室）是一个由中学生开发者组成的年轻技术社团，slogan「Type Everything」。官网承担三种职能：招新、作品展示、团队形象。

本设计使用 SHARP 单目视图合成模型从 `jd.png`（黑洞图像）生成的 3DGS 点云（`jd.ply`，63MB，1,179,648 个高斯点）作为整站背景。黑洞的引力透镜折射光为「黑白 + 棱镜折射彩」的视觉方向提供了天然的色散光源。

## 设计决策

| 决策点 | 结论 | 理由 |
|---|---|---|
| 方案 | 精简电影感（方案 B） | 复用 3DGS 基础设施但简化运镜，项目卡用横向轮播，3 次点击内可达任何板块 |
| 配色 | 黑白基底 + 棱镜折射彩 | 主体克制黑白，棱镜色散渐变（红紫蓝）用于交互态和关键 CTA；黑洞引力透镜是天然棱镜光源 |
| 3DGS 背景 | 黑洞 jd.ply，fixed 全站背景 | 用户明确要求「作为背景」 |
| 相机运动 | breathing + parallax（去掉滚动关键帧） | 黑洞是远景，安静呼吸比大幅运镜更耐看 |
| 项目板块 | 横向轮播卡片（非 6 个全屏） | 减少滚动深度，避免疲劳 |
| 成员板块 | CSS Grid 卡片墙（3×2） | spec 要求「一个人是一个 card」 |
| 技术栈 | React 18 + Vite 6 + TS 5.6 + Framer Motion 12 + gaussian-splats-3d | 复用 showcase 已验证组合 |

## 技术栈

| 层 | 选型 |
|---|---|
| 构建 | Vite 6 + TypeScript 5.6 |
| UI | React 18 + Framer Motion 12 |
| 3DGS 渲染 | `@mkkellogg/gaussian-splats-3d` + `three` |
| 样式 | CSS Modules + 设计 token（tokens.css） |
| 部署 | 静态构建，`base: './'`，需 COOP/COEP 头 |

## 目录结构

```
PEYTow/
├── run_batched.py              # 已有（SHARP 推理脚本）
├── run_half.py                 # 已有
├── jd_output/jd.ply            # 已有（黑洞 3DGS 模型）
├── package.json
├── vite.config.ts              # COOP/COEP 头
├── tsconfig.json
├── index.html
├── public/
│   └── gaussians/jd.ply        # 复制自 jd_output/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── sections/               # 5 个页面板块
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Team.tsx
│   │   ├── Join.tsx
│   │   └── Footer.tsx
│   ├── components/
│   │   ├── SceneBackground.tsx     # 3DGS 背景容器
│   │   ├── GaussianSplats3DCanvas.tsx  # 3DGS 渲染器
│   │   ├── Nav.tsx                  # 顶部导航
│   │   ├── SectionDots.tsx          # 右侧导航点
│   │   ├── ScrollProgress.tsx       # 顶部进度条
│   │   ├── ChapterMark.tsx          # 章节标号
│   │   ├── TwoCol.tsx               # 两列布局
│   │   ├── ProjectCard.tsx          # 项目卡（轮播单元）
│   │   ├── MemberCard.tsx           # 成员卡
│   │   ├── PrismText.tsx            # 棱镜渐变文字
│   │   └── PrismBorder.tsx          # 棱镜边框光晕
│   ├── hooks/
│   │   └── useCameraDolly.ts        # breathing + parallax
│   ├── data/
│   │   ├── members.ts               # 6 位成员数据
│   │   ├── projects.ts              # 6 个项目数据
│   │   └── site.ts                  # 站点常量
│   └── styles/
│       ├── tokens.css               # 设计 token
│       └── global.css               # 全局样式
```

## 视觉设计系统

### 配色

```css
:root {
  /* Canvas — 透明，不遮挡 3DGS 黑洞背景 */
  --canvas: transparent;
  --surface-elevated: rgba(10, 10, 12, 0.65);  /* 玻璃态卡片底 */
  --surface-2: #1C1C1E;
  --hairline: rgba(255, 255, 255, 0.08);

  /* 棱镜折射彩 — 色散渐变，不固定单一强调色 */
  --prism-1: #FF006E;  /* 折射红 */
  --prism-2: #8338EC;  /* 折射紫 */
  --prism-3: #3A86FF;  /* 折射蓝 */
  --prism-gradient: linear-gradient(90deg, var(--prism-1), var(--prism-2), var(--prism-3));

  /* Text hierarchy — 纯灰度 */
  --text-primary: #F5F5F7;
  --text-secondary: #A1A1A6;
  --text-tertiary: #6E6E73;

  /* Typography — Apple SF Pro */
  --font-display: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  --font-text: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  --font-mono: 'SF Mono', 'JetBrains Mono', ui-monospace, monospace;

  /* Type scale — Apple 9 级 */
  --text-hero: 96px;
  --text-display: 72px;
  --text-title: 48px;
  --text-headline: 32px;
  --text-body: 17px;
  --text-caption: 14px;

  /* Spacing — 8px grid */
  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px;
  --space-5: 48px; --space-6: 64px; --space-7: 96px;

  /* Layout */
  --container-wide: 1440px;
  --container-narrow: 760px;

  /* Motion */
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

### 棱镜效果

棱镜效果用 CSS `conic-gradient` + `background-clip: text` + `filter: hue-rotate()` 动画实现。黑洞 3DGS 背景自带的引力透镜色散是天然的棱镜光源，UI 层的棱镜效果与之呼应但克制——只在交互态（hover、focus）和关键 CTA 上出现。

### 排版原则

大面积留白、大标题小正文、8px 网格、最大内容宽度 1440px。

## 3DGS 背景系统

### 架构

```
App
├── SceneBackground (fixed, z-0)
│   ├── WebGL 检测 → 失败则返回 null
│   ├── reduced-motion 检测 → 失败则返回 null
│   └── <Suspense>
│       └── GaussianSplats3DCanvas (lazy)
│           ├── @mkkellogg/gaussian-splats-3d Viewer
│           ├── .ply 加载（jd.ply，63MB，1,179,648 个高斯点）
│           ├── SHARP OpenCV→OpenGL: rotation [1,0,0,0]
│           ├── FOV 45°，相机 [0,0,1.8] → lookAt [0,0,0]
│           └── useCameraDolly 驱动相机偏移
├── bg-veil (半透明遮罩，滚出 Hero 后淡入)
└── main (内容层，z-10)
```

### 相机运动（简化版 useCameraDolly）

- **Breathing**：6 秒周期正弦波，幅度 x=0.15 / y=0.08 / z=0.04 — 黑洞缓慢呼吸
- **Parallax**：鼠标移动驱动，strength=0.2 — 轻微视差
- **不包含**：showcase 的滚动关键帧运镜（SCROLL_KEYFRAMES）
- **Veil 遮罩**：Hero 滚出后 `bg-veil` 淡入到 0.8 不透明度，保证内容可读性

### 降级策略

- 无 WebGL2 → 不加载 3DGS，纯黑背景
- prefers-reduced-motion → 不加载 3DGS
- 加载超时 30s → 显示错误提示，降级为纯黑背景
- 移动端（width < 768px）→ 不加载 3DGS（63MB 在移动流量下过大），降级为纯黑背景

## 页面结构

```
App
├── Nav (fixed top, 玻璃态)
├── SectionDots (右侧导航点)
├── ScrollProgress (顶部进度条)
├── SceneBackground (3DGS 黑洞)
├── bg-veil (遮罩)
├── main
│   ├── 01 Hero          — 首屏
│   ├── 02 About          — 关于我们
│   ├── 03 Projects       — 项目展示（横向轮播）
│   ├── 04 Team           — 团队（卡片墙）
│   └── 05 Join           — 加入我们
└── Footer                — 署名 + 链接
```

### 01 Hero（100vh）

- 3DGS 黑洞全显（veil=0）
- 大标题：`PEYT Studio`（display 96px）
- 副标题：`PleaseEnterYourText Studio · 请输入文本工作室`
- Slogan：`Type Everything`（棱镜渐变文字，PrismText 组件）
- 一句话（中英）：`我们是一群中学生开发者。因一次研学相遇，因热爱技术走到一起。` / `We are a group of teenage developers.`
- 徽章：`members 8 · project PEYT Chat · open source`
- CTA：`加入我们`（PrismBorder 边框光晕，锚点跳转 #join）
- 滚动提示：`向下滚动 ↓`
- 滚出动画：文字上移+淡出+模糊（velocity-driven blur）

### 02 About（min-height 80vh）

- ChapterMark `02 / About`
- 标题：`我们是谁 / Who We Are`
- 正文（中文主 + 英文附）：研学起源、不是公司是社团、13-15 岁、自由开放兴趣驱动
- TwoCol 布局：左中文正文，右英文摘要

### 03 Projects（min-height 100vh）

- ChapterMark `03 / Projects`
- 主视觉句：`我们把一次研学变成了一系列真实项目。每一个都在解决真实问题。`
- **横向轮播**：每张卡 80vw，CSS scroll-snap，支持左右箭头+拖拽
- 6 张项目卡（旗舰 PEYT Chat 在前，篇幅最重）：
  1. PEYT Chat — E2EE 协作聊天，能力清单三组（聊天/协作/智能）+ 架构图
  2. EGGDataScience — 脑电数据分析平台
  3. NeuroLink-EEG — EEG BCI 心流实验平台
  4. Nervefeyn — AI 研究代理
  5. NoargueWorkspace — 时光绿径待办
  6. PeytDocs — 团队文档站
- 每张卡：项目名 + 定位句 + 亮点 + 技术栈 + GitHub 链接
- 卡片样式：玻璃态底 + 棱镜边框微光

### 04 Team（min-height 80vh）

- ChapterMark `04 / Team`
- 标题：`6 位在职成员 / Six Active Members`
- CSS Grid 卡片墙（3 列 × 2 行）
- 每张卡：圆形头像 + 名字 + 一句话活人感 + 角色/方向 + 个人站链接
- 6 位：NoWint、TiantianYZJ、CarryRao、浣芷轩、Falsw、MaherJon
- 脚注：SUKY、chenmuyun_bit 为不在职联合创始人

### 05 Join（min-height 80vh）

- ChapterMark `05 / Join Us`
- 标题：`加入我们 / Join Us`
- 正文：面向 14-18 岁、有热情有基础的年轻开发者
- 三列：关注 / 需要 / 不欢迎
- QQ 二维码图（JOINUS.jpg）+ 扫码提示
- 开源与自主可控叙事

### Footer

- `PEYT Studio — Type Everything`
- GitHub 组织链接

## 组件清单

| 组件 | 职责 | 来源 |
|---|---|---|
| `SceneBackground` | 3DGS 背景容器，lazy load + 降级 | showcase 适配 |
| `GaussianSplats3DCanvas` | 3DGS 渲染器，SHARP 坐标转换 | showcase 适配 |
| `useCameraDolly` | breathing + parallax 相机驱动 | showcase 简化 |
| `Nav` | 顶部导航，玻璃态，锚点跳转 | showcase 同款 |
| `SectionDots` | 右侧导航点 | showcase 同款 |
| `ScrollProgress` | 顶部进度条 | showcase 同款 |
| `ChapterMark` | 章节标号 | showcase 同款 |
| `TwoCol` | 两列布局 | showcase 同款 |
| `ProjectCard` | 项目卡（横向轮播单元） | 新建 |
| `MemberCard` | 成员卡（头像+信息） | 新建 |
| `PrismText` | 棱镜渐变文字 | 新建 |
| `PrismBorder` | 棱镜边框光晕 | 新建 |

## 数据与素材

### 数据文件（`src/data/`）

- `members.ts` — 6 位在职成员数据（名字、角色、方向、一句话、头像 URL、个人站 URL）
- `projects.ts` — 6 个项目数据（名称、定位、亮点、技术栈、GitHub URL、能力清单）
- `site.ts` — 站点常量（slogan、徽章、导航项）

### 素材来源

- 成员头像：`https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/members/<name>/avatar.png`（实现阶段需验证实际文件名，若不是 avatar.png 则从仓库 members/<name>/ 目录中探测）
- QQ 二维码：`https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/JOINUS.jpg`
- 3DGS 模型：本地 `public/gaussians/jd.ply`（从 `jd_output/` 复制）

### 成员数据（6 位在职）

| 成员 | 角色 | 方向 | 一句话 | 个人站 |
|---|---|---|---|---|
| NoWint | 联合创始人 | Desktop @ macOS、TUI | 「我是神」 | nowint.github.io |
| TiantianYZJ | 联合创始人 | Desktop @ Windows | 「我不是冯诺 1 曼派」 | yzjtiantian.cn |
| CarryRao | 核心成员 | Android Backend、Desktop Linux | 「前端小菜鸡，后端半吊子」 | carryrao.top |
| 浣芷轩 | 核心成员 | Desktop macOS | 「(◐‿◑) 你爹来啦」 | bilibili |
| Falsw | 核心成员 | 底层 | 「闷声修底层，偶尔冒泡整活」 | falswqwq.github.io |
| MaherJon | 核心成员 | Android Frontend | 「书写一些代码，声明一些 UI」 | MAHE |

### 项目数据（6 个）

| 项目 | 定位 | 技术栈 | GitHub |
|---|---|---|---|
| PEYT Chat | 面向开发团队的 E2EE 协作聊天 | Tauri v2 + Delta Chat Core | PleaseEnterYourTextCommunity |
| EGGDataScience | 脑电数据分析平台 | Python / FastAPI | EGGDataScience |
| NeuroLink-EEG | EEG BCI 心流实验平台 | OpenBCI / WebSocket / Node.js | NeuroLink-EEG |
| Nervefeyn | AI 研究代理 | TypeScript / Astro | Nervefeyn |
| NoargueWorkspace | 时光绿径待办 | 微信小程序 / Express / MySQL | NoargueWorkspace |
| PeytDocs | 团队文档站 | Docsify / GitHub Pages | PeytDocs |

## 性能与错误处理

### 性能

- 3DGS 渲染器 lazy import（`lazy(() => import(...))`），不进主 bundle
- PLY 文件 63MB，生产部署需 CDN/外部存储；dev server 本地加载
- COOP/COEP 头必须配置（SharedArrayBuffer 依赖）
- `prefers-reduced-motion` 降级：不加载 3DGS
- 图片素材走 GitHub raw URL（零本地存储成本）

### 错误处理

- WebGL2 不可用 → 纯黑背景，不影响内容
- 3DGS 加载超时 30s → 降级纯黑背景
- GitHub raw 图片加载失败 → CSS 占位符（首字母圆形）

### 测试

- `ProjectCard` 组件渲染测试
- `MemberCard` 组件渲染测试
- `members.ts` / `projects.ts` 数据完整性测试
