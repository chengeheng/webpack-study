// import { Configuration } from "webpack";
const path = require("path");

/**
 * @type {Configuration}
 */
const config = {
	// 入库
	entry: "./src/main.js", // 相对路径
	// 输出
	output: {
		// 文件的输出路径
		// __dirname nodejs变量，当前文件的文件夹目录
		path: path.resolve(__dirname, "dist"), // 绝对路径
		// 文件名
		filename: "main.js",
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
		],
	},
	// 插件
	plugins: [],
	// 模式
	mode: "development",
};

module.exports = config;
