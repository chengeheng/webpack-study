// import { Configuration } from "webpack";
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
		path: path.resolve(__dirname, "dist"), // 绝对路径
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
		],
	},
	// 插件
	plugins: [
		new HtmlWebpackPlugin({
			// 以 public/index.html 为模板创建文件
			// 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
			template: path.resolve(__dirname, "public/index.html"),
		}),
	],
	// 模式
	// 模式设置production才会压缩文件
	mode: "development",
};

module.exports = config;
