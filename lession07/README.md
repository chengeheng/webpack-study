# 提升构建速度

## HMR（HotModuleReplacement）

### 原因

启用了 webpack server 服务之后，每次修改代码 webpack 会全部重新打包编译，速度会很慢；

需要做到修改了某个模块代码，就只有这个模块代码需要重新打包编译，其他模块不变，这样打包速度就会很快。

### 定义

HotModuleReplacement（HMR/热模块替换）：在程序运行中，替换、添加或删除模块，而无需重新加载整个页面。

### 使用

1. 配置

webpack5 中默认打开，webpack4 中需要手动打开。

在 devServer 中配置：

```js
module.exports = {
	// 其他省略
	devServer: {
		host: "localhost", // 启动服务器域名
		port: "3000", // 启动服务器端口号
		open: true, // 是否自动打开浏览器
		hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了）
	},
};
```

2. js 配置
   由于是模块热替换，所以并不是所有的 js 代码都支持这样的功能，需要指定某些模块可以：

```js
// main.js
import count from "./js/count";
import sum from "./js/sum";

// 判断是否支持HMR功能
if (module.hot) {
	module.hot.accept("./js/count.js", function (count) {
		const result1 = count(2, 1);
		console.log(result1);
	});

	module.hot.accept("./js/sum.js", function (sum) {
		const result2 = sum(1, 2, 3, 4);
		console.log(result2);
	});
}
```

react 中解决方案是使用[react-hot-loader](https://github.com/gaearon/react-hot-loader)

## OneOf

### 原因

打包时每个文件都会经过所有 loader 处理，虽然因为 test 正则原因实际没有处理上，但是都要过一遍。比较慢。

### 定义

顾名思义就是只能匹配上一个 loader, 剩下的就不匹配了。

### 使用

```js
module.exports = {
	module: {
		rules: [
			{
				oneOf: [
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
		],
	},
};
```

## Include/Exclude

### 原因

开发时我们需要使用第三方的库或插件，所有文件都下载到 node_modules 中了。而这些文件是不需要编译可以直接使用的。

所以我们在对 js 文件处理时，要排除 node_modules 下面的文件。

### 定义

- include

  包含，只处理 xxx 文件

- exclude

  排除，除了 xxx 文件以外其他文件都处理

### 使用

```js
module.exports = {
	module: {
		rules: [
			{
				oneOf: [
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
						// exclude: /node_modules/, // 排除node_modules代码不编译
						include: path.resolve(__dirname, "../src"), // 也可以用包含
						loader: "babel-loader",
					},
				],
			},
		],
	},
	plugins: [
		new ESLintWebpackPlugin({
			// 指定检查文件的根目录
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules", // 默认值
		}),
		new HtmlWebpackPlugin({
			// 以 public/index.html 为模板创建文件
			// 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
			template: path.resolve(__dirname, "../public/index.html"),
		}),
	],
};
```

## Cache

### 原因

每次打包时 js 文件都要经过 Eslint 检查 和 Babel 编译，速度比较慢。

我们可以缓存之前的 Eslint 检查 和 Babel 编译结果，这样第二次打包时速度就会更快了。

### 定义

对 Eslint 检查 和 Babel 编译结果进行缓存。

### 使用

```js
module.exports = {
	module: {
		rules: [
			{
				oneOf: [
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
						// exclude: /node_modules/, // 排除node_modules代码不编译
						include: path.resolve(__dirname, "../src"), // 也可以用包含
						loader: "babel-loader",
						options: {
							cacheDirectory: true, // 开启babel编译缓存
							cacheCompression: false, // 缓存文件不要压缩
						},
					},
				],
			},
		],
	},
	plugins: [
		new ESLintWebpackPlugin({
			// 指定检查文件的根目录
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules", // 默认值
			cache: true, // 开启缓存
			// 缓存目录
			cacheLocation: path.resolve(
				__dirname,
				"../node_modules/.cache/eslintcache"
			),
		}),
	],
};
```

## Thead

### 原因

我们想要继续提升打包速度，其实就是要提升 js 的打包速度，因为其他文件都比较少。

而对 js 文件处理主要就是 eslint 、babel、Terser 三个工具，所以我们要提升它们的运行速度。

我们可以开启多进程同时处理 js 文件，这样速度就比之前的单进程打包更快了。

### 定义

多进程打包：开启电脑的多个进程同时干一件事，速度更快。

**需要注意：请仅在特别耗时的操作中使用，因为每个进程启动就有大约为 600ms 左右开销。**

### 使用

1. 获取 CPU 的核数，因为每个电脑都不一样

```js
// nodejs核心模块，直接使用
const os = require("os");
// cpu核数
const threads = os.cpus().length;
```

2. 下载包

```commandLine
npm i thread-loader -D
```

3. webpack 配置

```js
const os = require("os");

const TerserPlugin = require("terser-webpack-plugin");

// cpu核数
const threads = os.cpus().length;

module.exports = {
	module: {
		rules: [
			{
				oneOf: [
					{
						test: /\.js$/,
						// exclude: /node_modules/, // 排除node_modules代码不编译
						include: path.resolve(__dirname, "../src"), // 也可以用包含
						use: [
							{
								loader: "thread-loader", // 开启多进程
								options: {
									workers: threads, // 数量
								},
							},
							{
								loader: "babel-loader",
								options: {
									cacheDirectory: true, // 开启babel编译缓存
								},
							},
						],
					},
				],
			},
		],
	},
	plugins: [
		new ESLintWebpackPlugin({
			// 指定检查文件的根目录
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules", // 默认值
			cache: true, // 开启缓存
			// 缓存目录
			cacheLocation: path.resolve(
				__dirname,
				"../node_modules/.cache/.eslintcache"
			),
			threads, // 开启多进程
		}),
	],
	optimization: {
		minimize: true,
		// 只要写了minimizer都会是多线程失效，需要手动配置TerserPlugin
		minimizer: [
			// css压缩也可以写到optimization.minimizer里面，效果一样的
			new CssMinimizerPlugin(),
			// 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
			new TerserPlugin({
				parallel: threads, // 开启多进程
			}),
		],
	},
};
```
