# webpack-study

完整学习 webpack

## 5 大核心概念

1.  entry（入口）

    指示 webpack 从哪个文件开始打包

2.  output（输出）

    指示 webpack 打包完的文件输出到哪里去，如何命名等

3.  loader（加载器）

    webpack 本身只能处理 js、json 等资源，其他资源需要借助 loader，webpack 才能解析

4.  plugins（插件）

    扩展 webpack 的功能

5.  mode（模式）

    主要有两种模式：

    - 开发模式：development

      编译代码，使浏览器能识别运行；代码质量检查，树立代码规范

    - 生产模式：production
