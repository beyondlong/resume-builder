# 简历生成器

在线简历生成器。无须 fork 仓库，即可在线预览、编辑和下载 PDF 简历。

## 功能特性

- **5 套简历模板** - 满足不同风格需求
- **自定义主题颜色** - 自由搭配个人品牌色
- **自定义模块标题** - 灵活调整简历结构
- **国际化支持** - 中/英文简历一键切换
- **模块拖拽排序** - 调整简历内容顺序
- **在线编辑** - 无需本地配置，直接网页编辑
- **本地存储** - 浏览器自动保存简历数据
- **PDF 导出** - 浏览器打印功能即可下载

## 模板预览

| 现代简洁风格（默认） | 经典商务风格 | 经典模板 |
| :---: | :---: | :---: |
| 简洁大方，留白充足 | 左侧深色边栏，稳重专业 | 经典双栏布局 |

| 简易模板 | 多页模板 |
| :---: | :---: |
| 紧凑简洁，适合一页纸 | 分区块展示，信息清晰 |

**在线体验**: [现代简洁风格](https://beyondlong.github.io/resume-builder/)

## 技术栈

- **框架**: [Gatsby](https://www.gatsbyjs.com/) - 静态站点生成
- **前端**: React 17 + TypeScript
- **UI 组件**: Ant Design 4
- **样式**: Less + CSS Modules
- **国际化**: react-intl
- **拖拽排序**: react-dnd

## 项目结构

```
src/
├── components/
│   ├── Avatar/              # 头像组件
│   ├── Drawer/              # 侧边配置抽屉
│   │   ├── ConfigTheme/     # 主题配置
│   │   └── Templates/        # 模板选择器
│   ├── FormCreator/         # 表单生成器
│   ├── LangSwitcher/        # 语言切换
│   ├── Resume/              # 简历渲染
│   │   ├── Template1/       # 经典模板
│   │   ├── Template2/       # 简易模板
│   │   ├── Template3/       # 多页模板
│   │   ├── Template4/       # 现代简洁风格
│   │   └── Template5/       # 经典商务风格
│   └── ResumeEditor/        # 简历编辑器
├── context/                 # React Context
├── data/                    # 静态数据和常量
├── helpers/                 # 工具函数
├── hooks/                   # 自定义 Hooks
├── i18n/                    # 国际化配置
│   └── locales/             # 语言包
│       ├── zh-CN.json
│       └── en-US.json
├── layouts/                 # 页面布局
└── pages/                   # 页面
    ├── index.tsx            # 编辑页
    └── preview.tsx          # 预览页
```

## 如何使用

### 在线编辑

1. 访问在线地址
2. 点击「进行配置」打开侧边栏
3. 选择模板、编辑简历信息
4. 使用浏览器打印功能（Ctrl/Cmd + P）导出 PDF


### URL 参数说明

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `user` | GitHub 用户名 | 必选 |
| `template` | 模板 ID | `template4`（现代简洁风格） |
| `branch` | 分支名 | `master` |
| `mode` | 模式：`edit` 进入编辑模式 | 只读模式 |
| `lang` | 语言：`zh-CN` 或 `en-US` | `zh-CN` |

### 可用模板 ID

| ID | 模板名称 |
| --- | --- |
| `template1` | 经典模板 |
| `template2` | 简易模板 |
| `template3` | 多页模板 |
| `template4` | 现代简洁风格（默认） |
| `template5` | 经典商务风格 |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

## 简历数据格式

```json
{
  "profile": {
    "name": "姓名",
    "email": "邮箱",
    "mobile": "手机号",
    "github": "GitHub 地址",
    "workExpYear": "工作年限"
  },
  "educationList": [{
    "school": "学校",
    "major": "专业",
    "academic_degree": "学位",
    "edu_time": ["起始时间", "结束时间"]
  }],
  "workExpList": [{
    "company_name": "公司名称",
    "department_name": "部门",
    "work_time": ["起始时间", "结束时间"],
    "work_desc": "工作描述"
  }],
  "projectList": [{
    "project_name": "项目名称",
    "project_role": "项目角色",
    "project_time": "项目时间",
    "project_desc": "项目描述",
    "project_content": "主要工作"
  }],
  "skillList": [{
    "skill_name": "技能分类",
    "skill_desc": "技能描述"
  }],
  "aboutme": {
    "aboutme_desc": "自我介绍"
  }
}
```

## License

MIT
