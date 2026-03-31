# Resume Builder

一个基于 Gatsby 的在线简历编辑与预览项目。

它的目标很直接：用配置驱动的方式编辑简历内容，再用不同模板快速生成可打印、可导出的简历页面。

## 特性

- 5 套简历模板，覆盖经典、简洁、商务等不同风格
- 配置驱动表单，模块和字段都可以按配置扩展
- 中英文切换，支持国际化简历
- 列表模块支持新增、编辑、删除、拖拽排序
- 浏览器自动保存到 `localStorage`
- 支持导出 JSON 配置
- 支持浏览器打印导出 PDF

## 在线体验

- 在线地址：[Resume Builder](https://beyondlong.github.io/resume-builder/)

## 项目预览

### 编辑页

![编辑页预览](docs/images/edit-pages.png)

- 模块列表 + 表单编辑
- 列表模块支持新增、编辑、删除、拖拽排序
- 所有修改自动写入浏览器本地存储

### 预览页

| 模板预览 | 模板预览 | 模板预览 |
| --- | --- | --- |
| ![模板预览1](docs/images/preview-pages1.png) | ![模板预览2](docs/images/preview-pages2.png) | ![模板预览3](docs/images/preview-pages3.png) |

- 支持 5 套模板切换
- 支持导出 JSON 配置
- 支持浏览器打印 PDF

## 模板

| 模板 ID | 名称 | 说明 |
| --- | --- | --- |
| `template1` | 经典模板 | 双栏布局，信息密度较高 |
| `template2` | 简易模板 | 结构轻量，适合一页纸 |
| `template3` | 多页模板 | 分区块展示，层次更清晰 |
| `template4` | 现代简洁模板 | 当前默认模板 |
| `template5` | 商务模板 | 左侧边栏风格，更偏正式 |

## 模板预览

| 模板 | 风格 | 预览入口 |
| --- | --- | --- |
| `template1` | 经典双栏 | `/preview?template=template1` |
| `template2` | 简洁一页 | `/preview?template=template2` |
| `template3` | 分区多页 | `/preview?template=template3` |
| `template4` | 现代简洁 | `/preview?template=template4` |
| `template5` | 商务边栏 | `/preview?template=template5` |

本地开发时可以直接在浏览器打开这些地址切换预览。

预览页通过 URL 参数切换模板：

```text
/preview?template=template4
```

## 技术栈

- Gatsby 2
- React 17
- TypeScript
- Ant Design 4
- Less
- react-intl
- react-dnd

## 当前架构

当前有效主链已经收敛为：

`src/pages/index.tsx -> src/contexts/ResumeConfigContext.tsx -> src/components/ResumeEditor/*`

预览链路为：

`src/pages/preview.tsx -> src/components/Resume/*`

你可以把这个项目理解成三段式：

1. 编辑页维护一份 `ResumeConfig`
2. 配置变化后自动写入浏览器本地存储
3. 预览页读取这份配置并按模板渲染

## 目录结构

```text
src/
├── components/
│   ├── Avatar/                  # 头像组件
│   ├── FormCreator/             # 配置驱动表单
│   ├── Resume/                  # 模板渲染层
│   │   ├── Template1/
│   │   ├── Template2/
│   │   ├── Template3/
│   │   ├── Template4/
│   │   ├── Template5/
│   │   ├── shared.ts            # 模板共享视图数据
│   │   ├── shared-sections.tsx  # 模板共享内容块
│   │   └── shared-layouts.tsx   # 模板共享布局片段
│   ├── ResumeEditor/            # 编辑器主界面
│   └── types.ts                 # ResumeConfig / ThemeConfig
├── config/
│   ├── resume-fields.tsx        # 模块字段配置
│   ├── resume-modules.tsx       # 模块定义
│   └── types.ts                 # 配置层类型
├── contexts/
│   └── ResumeConfigContext.tsx  # 全局简历配置状态
├── data/
│   ├── constant.ts              # 默认标题映射
│   └── resume.ts                # 默认简历数据
├── helpers/
│   ├── resume-config.ts         # 配置加载与合并
│   ├── resume-dates.ts          # 时间字段归一化/格式化
│   └── storage.ts               # localStorage 读写
├── i18n/
├── layout/
└── pages/
    ├── index.tsx                # 编辑页
    ├── preview.tsx              # 预览页
    └── 404.tsx                  # 404 页面
```

## 页面说明

### 编辑页

文件：
[src/pages/index.tsx](/Users/yangxinglong/zayne/resume-builder/src/pages/index.tsx)

职责：

- 读取本地简历配置
- 初始化国际化
- 注入 `ResumeConfigProvider`
- 渲染 `ResumeEditor`

### 预览页

文件：
[src/pages/preview.tsx](/Users/yangxinglong/zayne/resume-builder/src/pages/preview.tsx)

职责：

- 读取已保存的简历配置
- 根据 `template` 参数切换模板
- 预览、导出 JSON、打印 PDF

## 数据流

### 编辑链路

1. [index.tsx](/Users/yangxinglong/zayne/resume-builder/src/pages/index.tsx) 加载初始配置
2. [ResumeConfigContext.tsx](/Users/yangxinglong/zayne/resume-builder/src/contexts/ResumeConfigContext.tsx) 管理全局状态
3. [ResumeEditor/index.tsx](/Users/yangxinglong/zayne/resume-builder/src/components/ResumeEditor/index.tsx) 负责模块切换
4. [ModuleForm.tsx](/Users/yangxinglong/zayne/resume-builder/src/components/ResumeEditor/ModuleForm.tsx) 负责当前模块编辑
5. [FormCreator/index.tsx](/Users/yangxinglong/zayne/resume-builder/src/components/FormCreator/index.tsx) 按配置动态生成表单
6. 配置更新后写入 `localStorage`

### 预览链路

1. [preview.tsx](/Users/yangxinglong/zayne/resume-builder/src/pages/preview.tsx) 读取配置
2. [Resume/index.tsx](/Users/yangxinglong/zayne/resume-builder/src/components/Resume/index.tsx) 根据模板 ID 分发
3. 各 `TemplateX` 渲染最终简历页面

## 本地开发

### 环境建议

- Node.js 20
- npm 10

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm start
```

说明：

- 启动脚本会清理 `public` 和开发缓存
- 会自动补建项目 `.cache`
- 这是为了兼容当前 Gatsby 2 开发环境，避免 `.cache` 缺失和旧 hash 资源错位问题

### 生产构建

```bash
npm run build
```

### 其他命令

```bash
# 清理 Gatsby 缓存
npm run clean

# 导出国际化文案
npm run extract
```

## 配置驱动编辑

编辑器是配置驱动的，不是手写一套固定表单：

- [resume-modules.tsx](/Users/yangxinglong/zayne/resume-builder/src/config/resume-modules.tsx) 决定左侧有哪些模块
- [resume-fields.tsx](/Users/yangxinglong/zayne/resume-builder/src/config/resume-fields.tsx) 决定右侧表单有哪些字段
- [types.ts](/Users/yangxinglong/zayne/resume-builder/src/components/types.ts) 定义真实数据结构

新增一个模块时，通常需要改这几层：

1. `src/components/types.ts`
2. `src/config/resume-modules.tsx`
3. `src/config/resume-fields.tsx`
4. `src/data/resume.ts`
5. 对应模板渲染文件

## 简历配置结构

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
- 修复 Gatsby 2 兼容依赖、Less 配置和开发启动脚本

## 已知情况

- Gatsby 2 + React 17 +旧插件组合仍会有一些历史 warning
- `npm run build` 当前可以通过
- 开发环境在依赖或页面结构变动后，建议重启一次 `npm start`

## License

MIT
