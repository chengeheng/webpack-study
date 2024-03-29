// import { Configuration } from "webpack";
const path = require("path");
const os = require("os");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// CPU核数
const threads = os.cpus().length;

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

/**
 * @type {Configuration}
 */
const config = {
	// 入库
	entry: "./src/main.js", // 相对路径
	// 输出
	output: {
		// 所有文件的输出路径
		// __dirname nodejs变量，当前文件的文件夹目录
		path: path.resolve(__dirname, "../dist"), // 绝对路径
		// 文件名
		// * 入口文件打包输出文件名
		filename: "js/main.js",
		// 自动清空上次打包结果
		// 原理：在打包前将path的整个目录内容清空，再进行打包
		clean: true,
	},
	// 加载器
	module: {
		rules: [
			{
				// 每个文件只能被其中一个loader配置处理
				oneOf: [
					// loader的配置
					{
						test: /\.css$/, // 只检测.css文件
						use: getStyleLoaders(),
					},
					{
						test: /\.less$/, // 只检测.less文件
						// loader只能使用一个loader
						// use可以使用多个loader
						use: getStyleLoaders("less-loader"),
					},
					{
						test: /\.s[ac]ss$/, // 只检测.scss/.sass文件
						// loader只能使用一个loader
						// use可以使用多个loader
						use: getStyleLoaders("sass-loader"),
					},
					{
						test: /\.styl$/, // 只检测.stylus文件
						// loader只能使用一个loader
						// use可以使用多个loader
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
							// * 将图片文件输出到 static/imgs 目录中
							// 将图片文件命名 [hash:8][ext][query]
							// [hash:8]: hash值取8位
							// [ext]: 使用之前的文件扩展名
							// [query]: 添加之前的query参数
							filename: "static/images/[hash:8][ext][query]",
						},
					},
					{
						test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
						type: "asset/resource",
						generator: {
							// * 将字体文件输出到 static/imgs 目录中
							// 将字体文件命名 [hash:8][ext][query]
							// [hash:8]: hash值取8位
							// [ext]: 使用之前的文件扩展名
							// [query]: 添加之前的query参数
							filename: "static/media/[hash:8][ext][query]",
						},
					},
					{
						test: /\.js$/,
						exclude: /node_modules/, // 排除node_modules代码不编译
						// include: path.resolve(__dirname, "../src"), // 也可以用包含
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
								},
							},
						],
					},
				],
			},
		],
	},
	// 模式
	// 模式设置production才会压缩文件
	mode: "production",
	plugins: [
		new ESLintWebpackPlugin({
			// 指定检查文件的根目录
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules",
			// 缓存目录
			cacheLocation: path.resolve(
				__dirname,
				"../node_modules/.cache/eslintcache"
			),
			threads, // 开启多进程
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
		// // css压缩
		// new CssMinimizerPlugin(),
		// new TerserPlugin({
		// 	parallel: threads, // 开启多进程
		// })
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
	// source-map
	devtool: "source-map",
};

module.exports = config;
