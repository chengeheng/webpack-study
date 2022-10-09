# 处理样式外的其他资源

## 处理图片资源

过去在 Webpack4 时，我们处理图片资源通过 `file-loader` 和 `url-loader` 进行处理

现在 Webpack5 已经将两个 loader 功能内置到 Webpack 里了，我们只需要简单配置即可处理图片资源

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
			{
				test: /\.less$/,
				use: ["style-loader", "css-loader", "less-loader"],
			},
			{
				test: /\.s[ac]ss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.styl$/,
				use: ["style-loader", "css-loader", "stylus-loader"],
			},
			{
				test: /\.(png|jpe?g|gif|webp)$/,
				type: "asset",
			},
		],
	},
	plugins: [],
	mode: "development",
};
```

## 转换体积小的图片为 base64

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
			{
				test: /\.less$/,
				use: ["style-loader", "css-loader", "less-loader"],
			},
			{
				test: /\.s[ac]ss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.styl$/,
				use: ["style-loader", "css-loader", "stylus-loader"],
			},
			{
				test: /\.(png|jpe?g|gif|webp)$/,
				type: "asset",
				// 转换方法
				// 优点：减少请求数量
				// 缺点：体积会稍微大一点
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
					},
				},
			},
		],
	},
	plugins: [],
	mode: "development",
};
```

## 输出目录

```js
module.exports = {
	output: {
		// 所有文件的输出路径
		// __dirname nodejs变量，当前文件的文件夹目录
		path: path.resolve(__dirname, "dist"), // 绝对路径
		// 文件名
		// 入口文件打包输出文件名
		filename: "js/main.js",
	},
	// 加载器
	module: {
		rules: [
			// loader的配置
			{
				test: /\.(png|jpe?g|gif|webp)$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
					},
				},
				generator: {
					// 将图片文件输出到 static/images 目录中
					// 将图片文件命名 [hash:8][ext][query]
					// [hash:8]: hash值取8位
					// [ext]: 使用之前的文件扩展名
					// [query]: 添加之前的query参数
					filename: "static/images/[hash:8][ext][query]",
				},
			},
		],
	},
};
```

## 自动清空上次打包内容

```js
module.exports = {
	output: {
		// 所有文件的输出路径
		// __dirname nodejs变量，当前文件的文件夹目录
		path: path.resolve(__dirname, "dist"), // 绝对路径
		// 文件名
		// * 入口文件打包输出文件名
		filename: "js/main.js",
		// 自动清空上次打包结果
		// 原理：在打包前将path的整个目录内容清空，再进行打包
		// webpack5新增
		clean: true,
	},
	// 加载器
	module: {
		rules: [
			// loader的配置
			{
				test: /\.(png|jpe?g|gif|webp)$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
					},
				},
				generator: {
					// 将图片文件输出到 static/images 目录中
					// 将图片文件命名 [hash:8][ext][query]
					// [hash:8]: hash值取8位
					// [ext]: 使用之前的文件扩展名
					// [query]: 添加之前的query参数
					filename: "static/images/[hash:8][ext][query]",
				},
			},
		],
	},
};
```

## 处理 html 资源
