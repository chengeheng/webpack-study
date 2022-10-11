// import { Configuration } from "webpack";
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// 返回处理样式loader的函数
const getStyleLoaders = pre => {
	return [
		"style-loader",
		"css-loader",
		{
			// 解决兼容性问题
			// 配合package.json中的browserslist来指定兼容性
			loader: "postcss-loader",
			options: {
				postcssOptions: {
					plugins: ["postcss-preset-env"],
				},
			},
		},
		pre,
	].filter(Boolean);
};

/**
 * @type {Configuration}
 */
const config = {
	entry: "./src/index.js",
	output: {
		path: undefined,
		filename: "static/js/[name].js",
		chunkFilename: "static/js/[name].chunk.js",
		assetModuleFilename: "static/media/[hash:10][ext][query]",
	},
	module: {
		rules: [
			{
				oneOf: [
					// 处理css
					{
						test: /\.css$/,
						use: getStyleLoaders(),
					},
					{
						// 处理less
						test: /\.less$/,
						use: getStyleLoaders("less-loader"),
					},
					{
						// 处理sass/scss
						test: /\.s[ac]ss$/,
						use: getStyleLoaders("sass-loader"),
					},
					{
						// 处理stylus
						test: /\.styl$/,
						use: getStyleLoaders("stylus-loader"),
					},
					// 处理图片
					{
						test: /\.(jpe?g|png|gif|webp|svg)/,
						type: "asset",
						parser: {
							dataUrlCondition: {
								maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
							},
						},
					},
					// 处理其他资源
					{
						test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
						type: "asset/resource",
						generator: {},
					},
					// 处理js
					{
						test: /\.jsx?$/,
						include: path.resolve(__dirname, "../src"),
						use: [
							{
								loader: "babel-loader",
								options: {
									cacheDirectory: true, // 开启babel编译缓存
									cacheCompression: false, // 缓存文件不要压缩
									plugins: ["react-refresh/babel"], // 激活js的HMR功能
								},
							},
						],
					},
				],
			},
		],
	},
	// 处理html
	plugins: [
		new ESLintWebpackPlugin({
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules",
			cache: true,
			cacheLocation: path.resolve(
				__dirname,
				"../node_modules/.cache/.eslintcache"
			),
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "../public/index.html"),
		}),
		new ReactRefreshWebpackPlugin(),
	],
	mode: "development",
	devtool: "cheap-module-source-map",
	optimization: {
		splitChunks: {
			chunks: "all",
		},
		runtimeChunk: {
			name: entrypoint => `runtime~${entrypoint.name}.js`,
		},
	},
	// webpack解析模块加载选项
	resolve: {
		// 自动补全文件扩展名
		extensions: [".jsx", ".js", ".json"],
	},
	devServer: {
		host: "localhost",
		port: 3000,
		open: true,
		hot: true,
		historyApiFallback: true, // 解决前端路由刷新404的问题
	},
};

module.exports = config;
