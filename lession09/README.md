# 优化代码运行性能

## Code Split

### 原因

打包代码时会将所有 js 文件打包到一个文件中，体积太大了。我们如果只要渲染首页，就应该只加载首页的 js 文件，其他文件不应该加载。

所以我们需要将打包生成的文件进行代码分割，生成多个 js 文件，渲染哪个页面就只加载某个 js 文件，这样加载的资源就少，速度就更快。

### 定义

代码分割（Code Split）主要做了两件事：

- 分割文件：将打包生成的文件进行分割，生成多个 js 文件。
- 按需加载：需要哪个文件就加载哪个文件。

### 使用

1. 多个入口

   ```js
   // webpack.config.js
   const path = require("path");
   const HtmlWebpackPlugin = require("html-webpack-plugin");

   module.exports = {
   	// 单入口
   	// entry: './src/main.js',
   	// 多入口
   	entry: {
   		main: "./src/main.js",
   		app: "./src/app.js",
   	},
   	output: {
   		path: path.resolve(__dirname, "./dist"),
   		// [name]是webpack命名规则，使用chunk的name作为输出的文件名。
   		// 什么是chunk？打包的资源就是chunk，输出出去叫bundle。
   		// chunk的name是啥呢？ 比如： entry中xxx: "./src/xxx.js", name就是xxx。注意是前面的xxx，和文件名无关。
   		// 为什么需要这样命名呢？如果还是之前写法main.js，那么打包生成两个js文件都会叫做main.js会发生覆盖。(实际上会直接报错的)
   		filename: "js/[name].js",
   		clear: true,
   	},
   	plugins: [
   		new HtmlWebpackPlugin({
   			template: "./public/index.html",
   		}),
   	],
   	mode: "production",
   };
   ```

   此时在 dist 目录我们能看到输出了两个 js 文件。

   总结：配置了几个入口，至少输出几个 js 文件。

2. 提取重复代码

   如果多入口文件中都引用了同一份代码，我们不希望这份代码被打包到两个文件中，导致代码重复，体积更大。

   我们需要提取多入口的重复代码，只打包生成一个 js 文件，其他文件引用它就好。

   ```js
   // webpack.config.js
   const path = require("path");
   const HtmlWebpackPlugin = require("html-webpack-plugin");

   module.exports = {
   	// 单入口
   	// entry: './src/main.js',
   	// 多入口
   	entry: {
   		main: "./src/main.js",
   		app: "./src/app.js",
   	},
   	output: {
   		path: path.resolve(__dirname, "./dist"),
   		// [name]是webpack命名规则，使用chunk的name作为输出的文件名。
   		// 什么是chunk？打包的资源就是chunk，输出出去叫bundle。
   		// chunk的name是啥呢？ 比如： entry中xxx: "./src/xxx.js", name就是xxx。注意是前面的xxx，和文件名无关。
   		// 为什么需要这样命名呢？如果还是之前写法main.js，那么打包生成两个js文件都会叫做main.js会发生覆盖。(实际上会直接报错的)
   		filename: "js/[name].js",
   		clean: true,
   	},
   	plugins: [
   		new HtmlWebpackPlugin({
   			template: "./public/index.html",
   		}),
   	],
   	mode: "production",
   	optimization: {
   		// 代码分割配置
   		splitChunks: {
   			chunks: "all", // 对所有模块都进行分割
   			// 以下是默认值
   			// minSize: 20000, // 分割代码最小的大小
   			// minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
   			// minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
   			// maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
   			// maxInitialRequests: 30, // 入口js文件最大并行请求数量
   			// enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
   			// cacheGroups: { // 组，哪些模块要打包到一个组
   			//   defaultVendors: { // 组名
   			//     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
   			//     priority: -10, // 权重（越大越高）
   			//     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
   			//   },
   			//   default: { // 其他没有写的配置会使用上面的默认值
   			//     minChunks: 2, // 这里的minChunks权重更大
   			//     priority: -20,
   			//     reuseExistingChunk: true,
   			//   },
   			// },
   			// 修改配置
   			cacheGroups: {
   				// 组，哪些模块要打包到一个组
   				// defaultVendors: { // 组名
   				//   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
   				//   priority: -10, // 权重（越大越高）
   				//   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
   				// },
   				default: {
   					// 其他没有写的配置会使用上面的默认值
   					minSize: 0, // 我们定义的文件体积太小了，所以要改打包的最小文件体积
   					minChunks: 2,
   					priority: -20,
   					reuseExistingChunk: true,
   				},
   			},
   		},
   	},
   };
   ```

3. 动态导入

   除了多入口打包的方式，Code Splitting 更常见的实现方式还是结合 ES Modules 的动态导入特性，从而实现按需加载。

   ```javascript
   // ./src/test.js

   // import moment from 'moment';
   const formatTime = time => {
   	return import("moment").then(({ default: moment }) => {
   		return moment(time).format("YYYY-WW-DD HH:mm:ss");
   	});
   };

   const add = (a, b) => {
   	return a + b;
   };
   ```

4. 魔法注释

   魔法注释就是给这些动态加入的 js 命名的功能：

   ```javascript
   import(/* webpackChunkName: 'moment' */ "moment").then(
   	({ defalut: moment }) => {
   		return moment().format("HH:mm:ss");
   	}
   );
   ```

   > 设置了 output.filename 则无效

## Preload 和 Prefetch

### 原因

我们前面已经做了代码分割，同时会使用 import 动态导入语法来进行代码按需加载（我们也叫懒加载，比如路由懒加载就是这样实现的）。

但是加载速度还不够好，比如：是用户点击按钮时才加载这个资源的，如果资源体积很大，那么用户会感觉到明显卡顿效果。

我们想在浏览器空闲时间，加载后续需要使用的资源。我们就需要用上 `Preload` 或 `Prefetch`技术。

### 定义

- `Preload`：告诉浏览器立即加载资源；

- `Prefetch`：告诉浏览器在空闲时才开始加载资源。

它们共同点：

- 都只会加载资源，并不执行。
- 都有缓存。

它们区别：

- Preload 加载优先级高，Prefetch 加载优先级低。
- Preload 只能加载当前页面需要使用的资源，Prefetch 可以加载当前页面资源，也可以加载下一个页面需要使用的资源。

总结：

- 当前页面优先级高的资源用 Preload 加载。
- 下一个页面需要使用的资源用 Prefetch 加载。

它们的问题：兼容性较差。

我们可以去 Can I Use 网站查询 API 的兼容性问题。
Preload 相对于 Prefetch 兼容性好一点。

### 使用

1. 下载

```commandLine
npm i @vue/preload-webpack-plugin -D
```

2. 配置

```js
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

module.exports = {
	plugins: [
		// new CssMinimizerPlugin(),
		new PreloadWebpackPlugin({
			rel: "preload", // preload兼容性更好
			as: "script",
			// rel: 'prefetch' // prefetch兼容性更差
		}),
	],
};
```

## Network Cache

### 原因

将来开发时我们对静态资源会使用缓存来优化，这样浏览器第二次请求资源就能读取缓存了，速度很快。

但是这样的话就会有一个问题, 因为前后输出的文件名是一样的，都叫 main.js，一旦将来发布新版本，因为文件名没有变化导致浏览器会直接读取缓存，不会加载新资源，项目也就没法更新了。

所以我们从文件名入手，确保更新前后文件名不一样，这样就可以做缓存了。

### 定义

它们都会生成一个唯一的 hash 值。

- fullhash（webpack4 是 hash）

每次修改任何一个文件，所有文件名的 hash 至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。

- chunkhash

根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们 js 和 css 是同一个引入，会共享一个 hash 值。

- contenthash

根据文件内容生成 hash 值，只有文件内容变化了，hash 值才会变化。所有文件 hash 值是独享且不同的。

### 使用

```js
module.exports = {
	filename: "static/js/[name].[contenthash:8].chunk.js",
};
```

- **问题：**

当我们修改 math.js 文件再重新打包的时候，因为 contenthash 原因，math.js 文件 hash 值发生了变化（这是正常的）。

但是 main.js 文件的 hash 值也发生了变化，这会导致 main.js 的缓存失效。明明我们只修改 math.js, 为什么 main.js 也会变身变化呢？

- 原因：

更新前：math.xxx.js, main.js 引用的 math.xxx.js
更新后：math.yyy.js, main.js 引用的 math.yyy.js, 文件名发生了变化，间接导致 main.js 也发生了变化

- 解决：

将 hash 值单独保管在一个 runtime 文件中。

我们最终输出三个文件：main、math、runtime。当 math 文件发送变化，变化的是 math 和 runtime 文件，main 不变。

runtime 文件只保存文件的 hash 值和它们与文件关系，整个文件体积就比较小，所以变化重新请求的代价也小。

```js
module.exports = {
	optimization: {
		// 提取runtime文件
		runtimeChunk: {
			name: entrypoint => `runtime~${entrypoint.name}`, // runtime文件命名规则
		},
	},
};
```

## CoreJS

### 原因

过去我们使用 babel 对 js 代码进行了兼容性处理，其中使用@babel/preset-env 智能预设来处理兼容性问题。

它能将 ES6 的一些语法进行编译转换，比如箭头函数、点点点运算符等。但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理。

所以此时我们 js 代码仍然存在兼容性问题，一旦遇到低版本浏览器会直接报错。所以我们想要将 js 兼容性问题彻底解决

### 定义

`core-js`是专门用来做 ES6 以及以上 API 的 polyfill。

`polyfill`翻译过来叫做垫片/补丁。就是用社区上提供的一段代码，让我们在不兼容某些新特性的浏览器上，使用该新特性。

### 使用

1. 下载

```commandLine
npm i @babel/eslint-parser -D
```

2. 配置

```js
// .eslintrc.js
module.exports = {
	// 继承 Eslint 规则
	extends: ["eslint:recommended"],
	parser: "@babel/eslint-parser", // 支持最新的最终 ECMAScript 标准
	env: {
		node: true, // 启用node中全局变量
		browser: true, // 启用浏览器中全局变量
	},
	plugins: ["import"], // 解决动态导入import语法报错问题 --> 实际使用eslint-plugin-import的规则解决的
	parserOptions: {
		ecmaVersion: 6, // es6
		sourceType: "module", // es module
	},
	rules: {
		"no-var": 2, // 不能使用 var 定义变量
	},
};
```

3. 使用`core-js`

```commandLine
npm i core-js
```

配置；

```js
module.exports = {
	// 智能预设：能够编译ES6语法
	presets: [
		[
			"@babel/preset-env",
			// 按需加载core-js的polyfill
			{ useBuiltIns: "usage", corejs: { version: "3", proposals: true } },
		],
	],
};

// 也可以手动引入
import "core-js";
import "core-js/es/promise";
```

## PWA

### 原因

开发 Web App 项目，项目一旦处于网络离线情况，就没法访问了。

我们希望给项目提供离线体验。

### 定义

渐进式网络应用程序(progressive web application - PWA)：是一种可以提供类似于 native app(原生应用程序) 体验的 Web App 的技术。

其中最重要的是，在 离线(offline) 时应用程序能够继续运行功能。

内部通过 Service Workers 技术实现的。

### 使用

1. 下载

```commandLine
npm i workbox-webpack-plugin -D
```

2. 配置

```js
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
	plugins: [
		new WorkboxPlugin.GenerateSW({
			// 这些选项帮助快速启用 ServiceWorkers
			// 不允许遗留任何“旧的” ServiceWorkers
			clientsClaim: true,
			skipWaiting: true,
		}),
	],
};

// main.js
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then(registration => {
				console.log("SW registered: ", registration);
			})
			.catch(registrationError => {
				console.log("SW registration failed: ", registrationError);
			});
	});
}
```
