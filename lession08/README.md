# 减少代码体积

## Tree Shaking

### 原因

开发时我们定义了一些工具函数库，或者引用第三方工具函数库或组件库。

如果没有特殊处理的话我们打包时会引入整个库，但是实际上可能我们可能只用上极小部分的功能。

这样将整个库都打包进来，体积就太大了。

### 定义

Tree Shaking 是一个术语，通常用于描述移除 JavaScript 中的没有使用上的代码。

**注意：它依赖 ES Module。**

### 使用

webpack 已经默认开启了这个功能，无需其他配置。

### Babel

### 原因

Babel 为编译的每个文件都插入了辅助代码，使代码体积过大！

Babel 对一些公共方法使用了非常小的辅助代码，比如 \_extend。默认情况下会被添加到每一个需要它的文件中。

你可以将这些辅助代码作为一个独立模块，来避免重复引入。

### 定义

`@babel/plugin-transform-runtime`: 禁用了 Babel 自动对每个文件的 runtime 注入，而是引入 @babel/plugin-transform-runtime 并且使所有辅助代码从这里引用。

### 使用

1. 下载

```commandLine
npm i @babel/plugin-transform-runtime -D
```

2. 配置

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
				oneOf: [
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
									cacheCompression: false, // 缓存文件不要压缩
									plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
								},
							},
						],
					},
				],
			},
		],
	},
};
```

## Image Minimizer

> 不推荐使用

### 原因

开发如果项目中引用了较多图片，那么图片体积会比较大，将来请求速度比较慢。

我们可以对图片进行压缩，减少图片体积。

**注意：如果项目中图片都是在线链接，那么就不需要了。本地项目静态图片才需要进行压缩。**

### 定义

`image-minimizer-webpack-plugin`: 用来压缩图片的插件

### 使用

1. 下载

```commandLine
npm i image-minimizer-webpack-plugin imagemin -D
```

还有剩下包需要下载，有两种模式：

- 无损压缩

```commandLine
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
```

- 有损压缩

```commandLine
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo -D
```

> > npm 下载报错，yarn 下载也报错

2. 配置

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
	optimization: {
		minimizer: [
			// css压缩也可以写到optimization.minimizer里面，效果一样的
			new CssMinimizerPlugin(),
			// 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
			new TerserPlugin({
				parallel: threads, // 开启多进程
			}),
			// 压缩图片
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminGenerate,
					options: {
						plugins: [
							["gifsicle", { interlaced: true }],
							["jpegtran", { progressive: true }],
							["optipng", { optimizationLevel: 5 }],
							[
								"svgo",
								{
									plugins: [
										"preset-default",
										"prefixIds",
										{
											name: "sortAttrs",
											params: {
												xmlnsOrder: "alphabetical",
											},
										},
									],
								},
							],
						],
					},
				},
			}),
		],
	},
	// devServer: {
	//   host: "localhost", // 启动服务器域名
	//   port: "3000", // 启动服务器端口号
	//   open: true, // 是否自动打开浏览器
	// },
	mode: "production",
	devtool: "source-map",
};
```
