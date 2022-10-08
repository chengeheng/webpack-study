// import { Configuration } from "webpack";
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

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
				test: /\.js$/,
				exclude: /node_modules/, // 排除node_modules代码不编译
				loader: "babel-loader",
			},
		],
	},
	// 插件
	plugins: [],
	// 模式
	mode: "development",
	plugins: [
		new ESLintWebpackPlugin({
			// 指定检查文件的根目录
			context: path.resolve(__dirname, "src"),
		}),
	],
};

module.exports = config;
