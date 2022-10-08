# 处理样式资源

Webpack 本身是不能识别样式资源的，所以我们需要借助 Loader 来帮助 Webpack 解析样式资源

1. 下载

   ```commandLine
   npm i css-loader style-loader -D
   ```

2. 功能介绍

   - `css-laoder`：负责将 Css 文件编译成 Webpack 能识别的模块
   - `style-laoder`：会动态创建一个 Style 标签，里面放置 Webpack 中 Css 模块内容

3. 配置

   ```js
   const path = require("path");

   module.exports = {
   	entry: "./src/main.js",
   	output: {
   		path: path.resolve(__dirname, "dist"),
   		filename: "main.js",
   	},
   	module: {
   		rules: [
   			{
   				// 用来匹配 .css 结尾的文件
   				test: /\.css$/,
   				// use 数组里面 Loader 执行顺序是从右到左
   				use: ["style-loader", "css-loader"],
   			},
   		],
   	},
   	plugins: [],
   	mode: "development",
   };
   ```
