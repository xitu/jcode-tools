# JCode Tools

## 简介

这是为[码上掘金](https://code.juejin.cn/)提供的JS工具库，用它来增强码上掘金的能力和弥补它的不足。

## 模块列表

### 1. exec-script.js

它可以解决在 Markup 编辑窗口中嵌入 `<script>` 标签，其中的代码不运行的问题。

## 使用方式

可以直接通过 CDN 引入 `https://unpkg.com/jcode-tools`

<img src="assets/jcode-tools.jpg" width="480">

## JCode精选

http://collection.juejin.fun/

在 Docs 文件夹下收录 JCode 精选代码。

添加自己的代码合辑到 JCode 精选，只需要编辑 `./collections/<your_collection_name>.docrc.js` 文件，然后提交 PR 即可。

通过 `http://collection.juejin.fun/?<your_collection_name>` 进行访问。

## 如何贡献代码

Clone 本项目，`npm install` 安装依赖，然后运行 `npm run dev`。

设置 `http://localhost:8000/dist/jcode-tools.js` 到码上掘金项目的依赖资源中即可调试运行。
