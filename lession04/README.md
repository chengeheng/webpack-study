# 处理 js 资源

原因是 Webpack 对 js 处理是有限的，只能编译 js 中 ES 模块化语法，不能编译其他语法，导致 js 不能在 IE 等浏览器运行，所以我们希望做一些兼容性处理。

其次开发中，团队对代码格式是有严格要求的，我们不能由肉眼去检测代码格式，需要使用专业的工具来检测。

- 针对 js 兼容性处理，我们使用 Babel 来完成
- 针对代码格式，我们使用 Eslint 来完成

我们先完成 Eslint，检测代码格式无误后，在由 Babel 做代码兼容性处理

## Eslint

可组装的 JavaScript 和 JSX 检查工具

1. 配置文件

   - `.eslintrc.*`：新建文件，位于项目目录

     - `.eslintrc`
     - `.eslintrc.js`
     - `.eslintrc.json`

     区别在于配置格式不一样

   - `package.json`中`eslintConfig`：不需要创建文件，在原有文件基础上写

2. 具体配置

   ```js
   module.exports = {
   	// 解析选项
   	parserOptions: {
   		ecmaVersion: 6, // ES 语法版本
   		sourceType: "module", // ES 模块化
   		ecmaFeatures: {
   			// ES 其他特性
   			jsx: true, // 如果是 React 项目，就需要开启 jsx 语法
   		},
   	},
   	// 具体检查规则
   	rules: {},
   	// 继承其他规则
   	extends: ["react-app"],
   	// 其他规则详见：https://eslint.bootcss.com/docs/user-guide/configuring
   };
   ```

3. 在 webpack 中使用

   1. 下载

   ```commandLint
   npm i eslint-webpack-plugin eslint -D
   ```

   2. 定义 Eslint 配置文件

   3. 修改 webpack 配置

   ```js
   const path = require("path");
   const ESLintWebpackPlugin = require("eslint-webpack-plugin");

   module.exports = {
   	plugins: [
   		new ESLintWebpackPlugin({
   			// 指定检查文件的根目录
   			context: path.resolve(__dirname, "src"),
   		}),
   	],
   };
   ```

4. vsCode 插件

   打开 VSCode，下载 Eslint 插件，即可不用编译就能看到错误，可以提前解决

   但是此时就会对项目所有文件默认进行 Eslint 检查了，我们 dist 目录下的打包后文件就会报错。但是我们只需要检查 src 下面的文件，不需要检查 dist 下面的文件。

   所以可以使用 Eslint 忽略文件解决。在项目根目录新建下面文件:

   ```
   # .eslintignore
   # 忽略dist目录下所有文件
   dist
   ```

## Babel

JavaScript 编译器。

主要用于将 ES6 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中

1. 配置文件

- `babel.config.*`：新建文件，位于项目根目录

  - `babel.config.js`
  - `babel.config.json`

- `.babelrc.*`：新建文件，位于项目根目录
  - `.babelrc`
  - `.babelrc.js`
  - `.babelrc.json`

package.json 中 babel：不需要创建文件，在原有文件基础上写
Babel 会查找和自动读取它们，所以以上配置文件只需要存在一个即可

2. 具体配置
   `babal.config.js`

```js
module.exports = {
	// 预设
	presets: [],
};
```

简单理解：就是一组 Babel 插件, 扩展 Babel 功能

- @babel/preset-env: 一个智能预设，允许您使用最新的 JavaScript。
- @babel/preset-react：一个用来编译 React jsx 语法的预设
- @babel/preset-typescript：一个用来编译 TypeScript 语法的预设

3.  在 webpack 中使用

    1. 下载包

    ```commandLine
    npm i babel-loader @babel/core @babel/preset-env -D
    ```

    2. 定义 Babel 配置文件

    ```js
    module.exports = {
    	presets: ["@babel/preset-env"],
    };
    ```

    3. 配置

    webapck.config.js

    ```js
    module.exports = {
    	module: {
    		rules: [
    			{
    				test: /\.js$/,
    				exclude: /node_modules/, // 排除node_modules代码不编译
    				loader: "babel-loader",
    			},
    		],
    	},
    };
    ```

## 开发服务器配置

**webpack-dev-server**

1. 下载

```commandLine
npm i webpack-dev-server -D
```

2. 配置

```js
module.exports = {
	// 开发服务器
	// 开发服务器是不会输出资源，是在内存中编译打包的
	devServer: {
		host: "localhost", // 启动服务器域名
		port: "3000", // 启动服务器端口号
		open: true, // 是否自动打开浏览器
	},
};
```

3. 启动

```commandLine
npx webpack server
```
