## yarn 和 npm配置

#### 环境安装和配置

1. 下载最新稳定版 Node.js 

2. 安装cnpm、yarn或者pnpm

```shell
# 安装yarn
npm install -g yarn 
# 安装pnpm
npm install -g pnpm
```

> npm 安装文档：https://pnpm.io/installation

#### npm修改配置

在项目根目录（package.json同一目录）中新建 `.npmrc`文件，编辑文件内容如下：

```ini
registry=https://registry.npm.taobao.org 
```

保存后再使用`npm install`下载包的速度会快很多

#### yarn修改配置

在项目根目录（package.json同一目录）中新建 `.yarnrc`文件，编辑文件内容如下：

```bash
registry "https://registry.npm.taobao.org"
```

#### 命令行修改配置

```shell
npm config set registry https://registry.npm.taobao.org

yarn config set registry https://registry.npm.taobao.org
```

#### pnpm介绍

**一、什么是pnpm**

快速的，节省磁盘空间的包管理工具。

**二、pnpm的特点**

1、快速

pnpm比其他包管理器快2倍。

2、高效

node_modules 中的文件为复制或链接自特定的内容寻址存储库。

3、支持monorepos

pnpm内置支持单仓多包。

4、严格

pnpm 默认创建了一个非平铺的 node_modules，因此代码无法访问任意包。

**pnpm使用命令**

```js
pnpm install 包名  //

pnpm i 包名

pnpm add 包名    // -S  默认写入dependencies

pnpm add -D    // -D devDependencies

pnpm add -g    // 全局安装

pnpm remove 包名 //移除

pnpm up                //更新所有依赖项

pnpm upgrade 包        //更新包

pnpm upgrade 包 --global   //更新全局包
```
