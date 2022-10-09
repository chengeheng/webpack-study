# 生产模式配置

生产模式是开发完成代码后，我们需要得到代码将来部署上线。

这个模式下我们主要对代码进行优化，让其运行性能更好。

优化主要从两个角度出发:

- 优化代码运行性能
- 优化代码打包速度

1. 分两个文件来配置开发环境和生产环境

   - `webpack.dev.js` 开发环境
   - `webpack.prod.js` 生产环境

2. 修改`package.json`，添加运行指令

```json
// package.json
{
	// 其他省略
	"scripts": {
		"start": "npm run dev",
		"dev": "npx webpack serve --config ./config/webpack.dev.js",
		"build": "npx webpack --config ./config/webpack.prod.js"
	}
}
```

以后启动指令：

- 开发模式：`npm start` 或 `npm run dev`
- 生产模式：`npm run build`

## css 处理

Css 文件目前被打包到 js 文件中，当 js 文件加载时，会创建一个 style 标签来生成样式

这样对于网站来说，会出现闪屏现象，用户体验不好

我们应该是单独的 Css 文件，通过 link 标签加载性能才好

1. 下载包

```commandLine
npm i mini-css-extract-plugin -D
```

2. 配置

将 style-loader 替换为`MiniCssExtractPlugin.loader`

```js
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	module: {
		rules: [
			{
				// 用来匹配 .css 结尾的文件
				test: /\.css$/,
				// use 数组里面 Loader 执行顺序是从右到左
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.less$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
			},
			{
				test: /\.s[ac]ss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
			{
				test: /\.styl$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
			},
		],
	},
	plugins: [
		// 提取css成单独文件
		new MiniCssExtractPlugin({
			// 定义输出文件名和目录
			filename: "static/css/main.css",
		}),
	],

	mode: "production",
};
```

**css 兼容性处理**

1. 下载包

```commandLine
npm i postcss-loader postcss postcss-preset-env -D
```

2. 配置

```js
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
		filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
		clean: true,
	},
	module: {
		rules: [
			{
				// 用来匹配 .css 结尾的文件
				test: /\.css$/,
				// use 数组里面 Loader 执行顺序是从右到左
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									"postcss-preset-env", // 能解决大多数样式兼容性问题
								],
							},
						},
					},
				],
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									"postcss-preset-env", // 能解决大多数样式兼容性问题
								],
							},
						},
					},
					"less-loader",
				],
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									"postcss-preset-env", // 能解决大多数样式兼容性问题
								],
							},
						},
					},
					"sass-loader",
				],
			},
			{
				test: /\.styl$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									"postcss-preset-env", // 能解决大多数样式兼容性问题
								],
							},
						},
					},
					"stylus-loader",
				],
			},
			{
				test: /\.(png|jpe?g|gif|webp)$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
					},
				},
				generator: {
					// 将图片文件输出到 static/imgs 目录中
					// 将图片文件命名 [hash:8][ext][query]
					// [hash:8]: hash值取8位
					// [ext]: 使用之前的文件扩展名
					// [query]: 添加之前的query参数
					filename: "static/imgs/[hash:8][ext][query]",
				},
			},
			{
				test: /\.(ttf|woff2?)$/,
				type: "asset/resource",
				generator: {
					filename: "static/media/[hash:8][ext][query]",
				},
			},
			{
				test: /\.js$/,
				exclude: /node_modules/, // 排除node_modules代码不编译
				loader: "babel-loader",
			},
		],
	},
	plugins: [
		new ESLintWebpackPlugin({
			// 指定检查文件的根目录
			context: path.resolve(__dirname, "../src"),
		}),
		new HtmlWebpackPlugin({
			// 以 public/index.html 为模板创建文件
			// 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
			template: path.resolve(__dirname, "../public/index.html"),
		}),
		// 提取css成单独文件
		new MiniCssExtractPlugin({
			// 定义输出文件名和目录
			filename: "static/css/main.css",
		}),
	],
	// devServer: {
	//   host: "localhost", // 启动服务器域名
	//   port: "3000", // 启动服务器端口号
	//   open: true, // 是否自动打开浏览器
	// },
	mode: "production",
};
```

3. 控制兼容性

```json
{
	// 其他省略
	"browserslist": ["ie >= 8"]
}

{
	"browserslist": ["last 2 version", "> 1%", "not dead"]
}
```

## 封装样式 loader 函数

```js
// 获取处理样式的Loaders
const getStyleLoaders = preProcessor => {
	return [
		MiniCssExtractPlugin.loader,
		"css-loader",
		{
			loader: "postcss-loader",
			options: {
				postcssOptions: {
					plugins: [
						"postcss-preset-env", // 能解决大多数样式兼容性问题
					],
				},
			},
		},
		preProcessor,
	].filter(Boolean);
};

module.exports = {
	module: {
		rules: [
			{
				// 用来匹配 .css 结尾的文件
				test: /\.css$/,
				// use 数组里面 Loader 执行顺序是从右到左
				use: getStyleLoaders(),
			},
			{
				test: /\.less$/,
				use: getStyleLoaders("less-loader"),
			},
			{
				test: /\.s[ac]ss$/,
				use: getStyleLoaders("sass-loader"),
			},
			{
				test: /\.styl$/,
				use: getStyleLoaders("stylus-loader"),
			},
			{
				test: /\.(png|jpe?g|gif|webp)$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
					},
				},
				generator: {
					// 将图片文件输出到 static/imgs 目录中
					// 将图片文件命名 [hash:8][ext][query]
					// [hash:8]: hash值取8位
					// [ext]: 使用之前的文件扩展名
					// [query]: 添加之前的query参数
					filename: "static/imgs/[hash:8][ext][query]",
				},
			},
			{
				test: /\.(ttf|woff2?)$/,
				type: "asset/resource",
				generator: {
					filename: "static/media/[hash:8][ext][query]",
				},
			},
			{
				test: /\.js$/,
				exclude: /node_modules/, // 排除node_modules代码不编译
				loader: "babel-loader",
			},
		],
	},
};
```

## css 压缩

```commandLine
npm i css-minimizer-webpack-plugin -D
```

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
	plugins: [
		new ESLintWebpackPlugin({
			// 指定检查文件的根目录
			context: path.resolve(__dirname, "../src"),
		}),
		new HtmlWebpackPlugin({
			// 以 public/index.html 为模板创建文件
			// 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
			template: path.resolve(__dirname, "../public/index.html"),
		}),
		// 提取css成单独文件
		new MiniCssExtractPlugin({
			// 定义输出文件名和目录
			filename: "static/css/main.css",
		}),
		// css压缩
		new CssMinimizerPlugin(),
	],
};
```
