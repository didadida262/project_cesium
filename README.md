# Cesium 3D 地图标注系统

基于 Vue 3 + TypeScript + Cesium 构建的现代化 3D 地图标注与可视化系统。

## 🚀 在线演示

**演示地址：** [https://project-cesium.vercel.app/](https://project-cesium.vercel.app/)

## ✨ 功能特性

### 🎯 核心功能

- **3D 地图渲染**：基于 Cesium 的高性能 3D 地球渲染
- **多图层支持**：支持多种地图底图（卫星图、天地图、高德地图等）
- **实时标注**：支持多种标注工具的实时绘制和编辑

### 🛠️ 标注工具

- **基础标注**：点标注、线段绘制
- **箭头工具**：直线箭头、攻击箭头、钳形箭头
- **图标绘制**：支持自定义图标和旗帜标记
- **动画演示**：3D 模型飞行路径动画

### 🎮 交互功能

- **视角控制**：支持缩放、旋转、平移等操作
- **场景跳转**：快速定位到指定区域
- **数据导出**：支持标注数据的导出和保存
- **清除功能**：一键清除所有标注

## 🛠️ 技术栈

### 前端框架

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具

### 3D 渲染

- **Cesium** - 开源 3D 地球和地图平台
- **vite-plugin-cesium** - Cesium 集成插件

### UI 框架

- **Tailwind CSS** - 实用优先的 CSS 框架
- **DaisyUI** - Tailwind CSS 组件库

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks 管理

## 📦 项目结构

```
src/
├── components/           # 通用组件
│   ├── ButtonComponent.vue
│   ├── SelectComponent.vue
│   └── TableComponent.vue
├── views/
│   └── CesiumContainer/  # Cesium 核心模块
│       ├── CesiumMap.vue         # 主地图组件
│       ├── CesiumController.ts   # 地图控制器
│       ├── CesiumUtils.ts        # 工具函数
│       ├── components/           # 地图相关组件
│       ├── tools/               # 标注工具
│       └── animation/           # 动画模块
└── main.ts              # 应用入口
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

## 🎯 使用说明

### 基础操作

1. **地图导航**：使用鼠标滚轮缩放，拖拽平移，右键拖拽旋转视角
2. **场景跳转**：点击"跳转至目标地点"快速定位到预设区域
3. **标注绘制**：选择标注模式，在地图上点击绘制各种图形

### 标注工具

- **点标注**：点击地图任意位置添加点标记
- **线段**：点击两个点绘制连接线
- **箭头工具**：支持直线箭头、攻击箭头、钳形箭头等军事标图
- **图标绘制**：选择旗帜图标在地图上标记

### 动画演示

- 选择"动效演示"模式
- 点击预设的动画场景
- 观看 3D 模型沿路径飞行的动画效果

## 🔧 配置说明

### 地图底图配置

项目支持多种地图底图，可在 `CesiumController.ts` 中配置：

- ArcGIS 卫星图
- 天地图
- 高德地图
- 自定义瓦片服务

### 标注工具扩展

所有标注工具都封装在 `tools/` 目录下，支持：

- 自定义样式
- 事件回调
- 数据导出
- 批量操作

## 📄 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE.md](LICENSE.md) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**注意**：本项目仅用于学习和研究目的，请遵守相关法律法规。
