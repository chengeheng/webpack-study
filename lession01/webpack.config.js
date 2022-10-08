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
		],
	},
	// 插件
	plugins: [],
	// 模式
	mode: "development",
};

module.exports = config;
