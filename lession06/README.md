# SourceMap

## 原因

开发时的代码是经过 webpack 编译的，如果运行出错是没法定位位置的，一旦将来开发代码文件很多，那么很难去发现错误出现在哪里

## 定义

`SourceMap`（源代码映射）是一个用来生成源代码与构建后代码一一映射的文件的方案。

它会生成一个 xxx.map 文件，里面包含源代码和构建后代码每一行、每一列的映射关系。当构建后代码出错了，会通过 xxx.map 文件，从构建后代码出错位置找到映射后源代码出错位置，从而让浏览器提示源代码文件出错位置，帮助我们更快的找到错误根源。

## 使用

- 开发模式：`cheap-module-source-map`

  - 优点：打包编译速度快，只包含行映射
  - 缺点：没有列映射

```js
module.exports = {
	// 其他省略
	mode: "development",
	devtool: "cheap-module-source-map",
};
```

- 生产模式；`source-map`

  - 优点：包含行/列映射
  - 缺点：打包编译速度更慢

```js
module.exports = {
	// 其他省略
	mode: "production",
	devtool: "source-map",
};
```
