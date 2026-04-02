# Resume Builder

简体中文 | [English](./README.en.md)

一个在线简历编辑器，支持 5 套模板、配置驱动编辑、中英文切换、AI 简历优化、JSON 导出和浏览器打印 PDF。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Gatsby](https://img.shields.io/badge/Gatsby-2.x-663399.svg)](https://www.gatsbyjs.com/)
[![React](https://img.shields.io/badge/React-17-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178c6.svg)](https://www.typescriptlang.org/)

[在线体验](https://beyondlong.github.io/resume-builder/) · [默认模板预览](https://beyondlong.github.io/resume-builder/preview?template=template4)

快速导航： [核心能力](#核心能力) · [快速开始](#快速开始) · [AI-简历优化](#ai-简历优化) · [当前架构](#当前架构) · [配置驱动开发](#配置驱动开发)

![编辑页预览](static/images/edit-pages.png)

## 目录

- [Highlights](#highlights)
- [在线体验](#在线体验)
- [核心能力](#核心能力)
- [项目预览](#项目预览)
- [模板](#模板)
- [快速开始](#快速开始)
- [AI 简历优化](#ai-简历优化)
- [技术栈](#技术栈)
- [当前架构](#当前架构)
- [目录结构](#目录结构)
- [配置驱动开发](#配置驱动开发)
- [ResumeConfig 结构](#resumeconfig-结构)
- [项目近期开过的整理](#项目近期开过的整理)
- [已知情况](#已知情况)

## Highlights

- 5 套简历模板
- 配置驱动表单编辑
- 中英文切换
- AI 优化自我介绍 / 项目描述 / 工作描述
- 浏览器自动保存到 `localStorage`
- 导出 JSON 配置
- 浏览器打印 PDF

这个项目的目标很直接：用一套可扩展的配置驱动编辑器维护 `ResumeConfig`，再用不同模板快速生成可预览、可导出、可打印的简历页面。

## 在线体验

- 在线地址：[Resume Builder](https://beyondlong.github.io/resume-builder/)
- 预览示例：[template4](https://beyondlong.github.io/resume-builder/preview?template=template4)

注意：
- GitHub Pages 只承载静态前端页面
- 线上 demo 默认不保证提供 AI 代理能力
- 如果你希望线上演示也支持 `AI优化`，需要把 AI 代理单独部署到其他服务，并通过 `GATSBY_AI_API_BASE_URL` 指向它

## 核心能力

- 5 套模板，覆盖经典、简洁、现代、商务等不同风格
- 模块化编辑，支持头像、个人信息、教育、工作、项目、技能、奖项、作品、自我介绍等模块
- 列表模块支持新增、编辑、删除、拖拽排序
- 主题设置支持自定义主色、预设主题色和恢复默认
- AI 简历优化支持字段级触发，并通过独立代理保护模型 token
- 模板预览支持切换模板、导出 JSON、打印 PDF

## 项目预览

### 编辑页

- 左侧模块列表 + 右侧动态表单
- 所有修改自动写入浏览器本地存储
- 支持 AI 优化、自定义主题和拖拽排序

### 预览页

| 模板预览 | 模板预览 | 模板预览 |
| --- | --- | --- |
| ![模板预览1](static/images/preview-pages1.png) | ![模板预览2](static/images/preview-pages2.png) | ![模板预览3](static/images/preview-pages3.png) |

- 支持 5 套模板切换
- 支持导出 JSON 配置
- 支持浏览器打印 PDF

## 模板

| 模板 ID | 名称 | 说明 |
| --- | --- | --- |
| `template1` | 经典模板 | 双栏布局，信息密度较高 |
| `template2` | 简易模板 | 结构轻量，适合一页纸 |
| `template3` | 多页模板 | 分区展示，层次更清晰 |
| `template4` | 现代简洁模板 | 当前默认模板 |
| `template5` | 商务模板 | 侧栏布局，更偏正式 |

本地开发时可以直接通过下面的地址切换模板：

```text
/preview?template=template4
```

## 快速开始

### 环境建议

- Node.js 20
- npm 10

### 安装依赖

```bash
npm install
```

### 仅启动前端

```bash
npm start
```

说明：
- 启动脚本会清理 `public` 和 Gatsby 开发缓存
- 会自动补建项目 `.cache`
- 这样做是为了尽量规避 Gatsby 2 开发环境里的旧资源错位问题

### 同时启动前端和 AI 代理

```bash
npm run dev
```

说明：
- 会并行启动前端和 AI 代理
- 前端仍然会在启动前自动清理 Gatsby 缓存
- 终端输出会带脚本标签，方便区分 `start` 和 `start:ai-proxy`

### 生产构建

```bash
npm run build
```

### 发布到 GitHub Pages

```bash
npm run deploy
```

当前 Gatsby 配置默认面向：

- `https://beyondlong.github.io/resume-builder/`
- `pathPrefix: /resume-builder`

如果你修改仓库名或部署路径，需要同步调整 [gatsby-config.js](/Users/yangxinglong/zayne/resume-builder/gatsby-config.js) 里的 `pathPrefix`。

## AI 简历优化

AI 优化能力通过独立代理服务提供，浏览器不会直接暴露模型 token。

### 当前支持

- 自我介绍优化
- 项目描述优化
- 项目主要工作优化
- 工作描述优化

### 代理模式

- 前端统一请求 `/api/ai/improve`
- 代理服务负责选择模型 provider 并转发请求
- 当前支持：
  - `dashscope`
  - `openai-compatible`

### 配置方式

1. 复制环境变量模板

```bash
cp .env.example .env
```

2. 配置 provider

DashScope 示例：

```env
AI_PROVIDER=dashscope
AI_MODEL=qwen-plus
DASHSCOPE_API_KEY=your_dashscope_api_key
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1
```

OpenAI 兼容接口示例：

```env
AI_PROVIDER=openai-compatible
AI_MODEL=gpt-4o-mini
OPENAI_COMPATIBLE_API_KEY=your_token
OPENAI_COMPATIBLE_BASE_URL=https://example.com/v1
OPENAI_COMPATIBLE_MODEL=gpt-4o-mini
```

3. 启动 AI 代理

```bash
npm run start:ai-proxy
```

默认端口：
- `http://localhost:8787`

本地开发时，编辑页里的 `AI优化` 按钮会自动请求本地代理：
- 默认走 `http://localhost:8787/api/ai/improve`
- 如果你配置了 `GATSBY_AI_API_BASE_URL`，会优先使用这个地址

### 常见提示

- `AI服务不可用，请检查代理服务是否已启动`
  说明代理服务没有启动，或前端没有连到代理
- `AI服务未配置，请检查环境变量`
  说明 `.env` 里缺少 provider 或 token 配置

## 技术栈

- Gatsby 2
- React 17
- TypeScript
- Ant Design 4
- Less
- react-intl
- react-dnd
- Node.js AI proxy

## 当前架构

当前有效主链已经收敛为：

`src/pages/index.tsx -> src/contexts/ResumeConfigContext.tsx -> src/components/ResumeEditor/*`

预览链路为：

`src/pages/preview.tsx -> src/components/Resume/*`

AI 链路为：

`FormCreator -> src/services/ai/client.ts -> /api/ai/improve -> provider adapter`

你可以把这个项目理解成四段式：

1. 编辑页维护一份 `ResumeConfig`
2. 配置变化后自动写入浏览器本地存储
3. 预览页读取配置并按模板渲染
4. AI 优化通过独立代理服务增强编辑体验

## 目录结构

```text
src/
├── components/
│   ├── Avatar/                  # 头像组件
│   ├── FormCreator/             # 配置驱动表单 + AI 优化入口
│   ├── Resume/                  # 模板渲染层
│   │   ├── Template1/
│   │   ├── Template2/
│   │   ├── Template3/
│   │   ├── Template4/
│   │   ├── Template5/
│   │   ├── shared.ts
│   │   ├── shared-sections.tsx
│   │   └── shared-layouts.tsx
│   ├── ResumeEditor/            # 编辑器主界面
│   └── types.ts                 # ResumeConfig / ThemeConfig
├── config/
│   ├── resume-fields.tsx        # 模块字段配置
│   ├── resume-modules.tsx       # 模块定义
│   └── types.ts                 # 配置层类型
├── contexts/
│   └── ResumeConfigContext.tsx
├── data/
│   ├── constant.ts
│   └── resume.ts
├── helpers/
│   ├── resume-config.ts
│   ├── resume-dates.ts
│   ├── resume-ai.ts
│   └── storage.ts
├── i18n/
├── pages/
│   ├── index.tsx
│   ├── preview.tsx
│   └── 404.tsx
└── services/
    └── ai/

server/
├── routes/
├── providers/
└── utils/
```

## 配置驱动开发

编辑器不是手写一套固定表单，而是由配置驱动：

- [src/config/resume-modules.tsx](/Users/yangxinglong/zayne/resume-builder/src/config/resume-modules.tsx) 决定左侧有哪些模块
- [src/config/resume-fields.tsx](/Users/yangxinglong/zayne/resume-builder/src/config/resume-fields.tsx) 决定右侧表单有哪些字段
- [src/components/types.ts](/Users/yangxinglong/zayne/resume-builder/src/components/types.ts) 定义真实数据结构

如果要新增一个模块，通常要改这几层：

1. `src/components/types.ts`
2. `src/config/resume-modules.tsx`
3. `src/config/resume-fields.tsx`
4. `src/data/resume.ts`
5. 对应模板渲染文件

## ResumeConfig 结构

核心数据结构是 `ResumeConfig`，主要包含：

- `avatar`
- `profile`
- `educationList`
- `workExpList`
- `projectList`
- `skillList`
- `awardList`
- `workList`
- `aboutme`
- `titleNameMap`
- `theme`

默认数据位于：

- [src/data/resume.ts](/Users/yangxinglong/zayne/resume-builder/src/data/resume.ts)
- [static/resume.json](/Users/yangxinglong/zayne/resume-builder/static/resume.json)

## 项目近期开过的整理

当前仓库已经完成这些整理：

- 废弃旧编辑链路，仅保留 `index.tsx + ResumeEditor + Context`
- 拆分旧的 `contant.tsx` 到 `src/config`
- 抽出统一的配置加载 helper
- Context 改为 reducer 驱动
- 统一时间字段归一化处理
- 模板层抽出共享 view model / section / layout
- 增加主题设置能力
- 增加 AI 优化代理层和 provider 适配结构
- 修复 Gatsby 2 兼容依赖、Less 配置和开发启动脚本

## 已知情况

- Gatsby 2 + React 17 + 旧插件组合仍会有一些历史 warning
- `npm run build` 当前可以通过
- 开发环境在依赖或页面结构变动后，建议重启一次 `npm start`
- GitHub Pages 只能承载前端静态资源，AI 代理需要单独部署

## License

MIT

## Star History

[![Star History Chart](https://api.star-history.com/image?repos=beyondlong/resume-builder&type=date&legend=top-left)](https://www.star-history.com/?repos=beyondlong%2Fresume-builder&type=date&legend=top-left)
