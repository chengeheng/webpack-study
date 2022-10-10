// import { Configuration } from "webpack";
const path = require("path");
const os = require("os");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// CPU核数
const threads = os.cpus().length;

/**
 * @type {Configuration}
 */
const config = {
	// 入库
	entry: "./src/main.js", // 相对路径
	// 输出
	output: {
		// 所有文件的输出路径
		// 开发环境不需要配置
		path: undefined,
		// 文件名
		// * 入口文件打包输出文件名
		filename: "static/js/main.js",
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
						use: [
							// 执行顺序从右到左或是从下到上
							"style-loader", // 将js中css通过创建style标签添加到html文件中生效
							"css-loader", // 将css资源编译撑commonjs的模块到js中
						],
					},
					{
						test: /\.less$/, // 只检测.less文件
						// loader只能使用一个loader
						// use可以使用多个loader
						use: [
							"style-loader", // 将js中css通过创建style标签添加到html文件中生效
							"css-loader", // 将css资源编译撑commonjs的模块到js中
							"less-loader", // 将less编译成css
						],
					},
					{
						test: /\.s[ac]ss$/, // 只检测.scss/.sass文件
						// loader只能使用一个loader
						// use可以使用多个loader
						use: [
							"style-loader", // 将js中css通过创建style标签添加到html文件中生效
							"css-loader", // 将css资源编译撑commonjs的模块到js中
							"sass-loader", // 将sass/scss编译成css
						],
					},
					{
						test: /\.styl$/, // 只检测.stylus文件
						// loader只能使用一个loader
						// use可以使用多个loader
						use: [
							"style-loader", // 将js中css通过创建style标签添加到html文件中生效
							"css-loader", // 将css资源编译撑commonjs的模块到js中
							"stylus-loader", // 将stylus编译成css
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
	// 模式
	// 模式设置production才会压缩文件
	mode: "development",
	plugins: [
		new ESLintWebpackPlugin({
			// 指定检查文件的根目录
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules",
			cache: true, // 开启缓存
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
	],
	// 开发服务器
	devServer: {
		host: "localhost", // 启动服务器域名
		port: "3000", // 启动服务器端口号
		open: true, // 是否自动打开浏览器
	},
	// source-map
	devtool: "cheap-module-source-map",
};

module.exports = config;
