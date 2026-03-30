# 简历模板扩展设计方案

## 目标
新增两个简历模板：模板4（现代简洁风格）和模板5（经典商务风格）

## 设计方案

### 模板4 - 现代简洁风格
- 单栏全宽度布局
- 顶部姓名大标题 + 联系方式横排
- 内容区按顺序垂直排列：工作经历 → 项目经验 → 教育背景 → 技能
- 细线条分隔，轻量装饰，大量留白
- 配色纯净，灰黑为主，点缀主题色

### 模板5 - 经典商务风格
- 左侧深色窄栏（1/4）放置个人信息
- 右侧浅色主区域放置工作经历、项目经验、教育背景
- 经典保守、层次分明
- 配色稳重，深蓝/藏青为主色调

---

## 实施计划

### 任务1: 创建模板4 - 现代简洁风格
- [ ] 创建 `src/components/Resume/Template4/index.tsx`
- [ ] 创建 `src/components/Resume/Template4/index.less`
- [ ] 布局：单栏从上到下
- [ ] 顶部姓名 + 联系信息横排
- [ ] 各区块标题 + 内容垂直排列
- [ ] 细线条分隔装饰

### 任务2: 创建模板5 - 经典商务风格
- [ ] 创建 `src/components/Resume/Template5/index.tsx`
- [ ] 创建 `src/components/Resume/Template5/index.less`
- [ ] 布局：左侧1/4深色栏 + 右侧3/4浅色栏
- [ ] 左侧：头像 + 姓名 + 联系信息 + 技能列表
- [ ] 右侧：工作经历 + 项目经验 + 教育背景
- [ ] 经典双栏视觉效果

### 任务3: 注册模板到 Resume 组件
- [ ] 修改 `src/components/Resume/index.tsx`
- [ ] 添加 Template4 和 Template5 的 switch case

### 任务4: 添加模板预览图
- [ ] 修改 `src/components/Drawer/Templates/index.tsx`
- [ ] 在 TEMPLATES 数组中添加 template4 和 template5 的配置
- [ ] 使用与现有模板一致的 SVG 预览图格式

### 任务5: 验证功能
- [ ] 启动开发服务器
- [ ] 切换到模板4，验证渲染正常
- [ ] 切换到模板5，验证渲染正常
- [ ] 验证主题色切换功能正常
- [ ] 验证打印/导出功能正常

---

## 关键文件清单

新增文件：
- `src/components/Resume/Template4/index.tsx`
- `src/components/Resume/Template4/index.less`
- `src/components/Resume/Template5/index.tsx`
- `src/components/Resume/Template5/index.less`

修改文件：
- `src/components/Resume/index.tsx`
- `src/components/Drawer/Templates/index.tsx`
