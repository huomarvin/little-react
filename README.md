# little-react

手写一个 react

## 搭建 LReact 开发环境

```shell
yarn
yarn dev
```

## 实现

### 核心 API

`jsx`代码经过转义之后会变成 React.createElement()
可以通过[REPL](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=DwEwlgbgfAEgpgGwQewAQHVkCcEmAenGiA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.12.3&externalPlugins=)去查看一下。

第一次主要实现的 API 有两个
一个是`React.createElement`，作用是将 jsx 转换成虚拟 dom
另一个是`ReacDOM.render` 作用是将虚拟 dom 转换成真实的 dom

本次实现将`<div>Hello World</div>`挂载到 `div#root` 节点上

### 添加 props 处理和无效节点处理

目前特殊处理的 props 有事件`onXXX`与`className`

无效节点有`true`,`false`,`null`的情况

### 处理 ClassComponent 与函数式组件

函数式组件直接调用返回虚拟 dom

类组件调用实例化方法后调用 render 方法返回虚拟 dom

### 处理直接调用 ReactDOM.render 的更新操作

- 在 dom 节点上记录\_vdom
- 节点比对
  - 处理节点类型不同、
  - 节点类型相同的文本节点
  - 节点类型相同的普通节点情况
- 子节点数不同，清理子节点情况
  - 清理子节点绑定事件
  - 递归清理子节点

### 处理 React 自更新

添加生命周期

### ref(TODO)

### key 对比(TODO)
