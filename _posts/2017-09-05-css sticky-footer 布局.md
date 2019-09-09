---
layout:     post
title:      css sticky-footer 布局
subtitle:   css sticky-footer 布局
date:       2017-09-05
author:     SkioFox
header-img: img/home-bg-geek.jpg
catalog: true
tags:
- css
- 布局
---
## css sticky-footer 布局

> 什么是 css sticky-footer 布局 ？
> 在页面展示中如果页面内容不够长的时候，页脚块粘贴在视窗底部；如果内容足够长时，页脚块会被内容向下推送。保证footer永远在页面底部位置。

1. 方法1：将内容部分的底部外边距设为负数
> 这是个比较主流的用法，把内容部分最小高度设为100%，再利用内容部分的负底部外边距值来达到当高度不满时，页脚保持在窗口底部，当高度超出则随之推出的效果。

```
<body>
  <div class="wrapper">
      content
    <div class="push"></div>
  </div>
  <footer class="footer"></footer>
</body>
```

```css
html, body {
  height: 100%;
  margin: 0;
}
.wrapper {
  min-height: 100%;
  /* 等于footer的高度 */
  margin-bottom: -50px;
}
.footer,
.push {
  height: 50px;
}
```
> 这个方法需要容器里有额外的占位元素（如 .push）。需要注意的是 .wrapper的margin-bottom值需要和 .footer的负的height值保持一致。
2. 将页脚的顶部外边距设为负数（同第一种方法，缺点都是要添加不必要的html元素作为填充）
> 以上两种方法的footer高度都是固定的，通常来说这不利于网页布局：内容会改变，它们都是弹性的，一旦内容超出固定高度就会破坏布局。
3. flexbox弹性盒布局

 ```
 <body>
  <div class="content">
    content
  </div>
  <footer class="footer"></footer>
</body>
```

```css
html {
  height: 100%;
}
body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
}
```
> 你还可以在上面添加header或在下面添加更多元素。核心：flex:1 可以使内容自动伸缩。
4. absolute
> 通过绝对定位处理应该是常见的方案，只要使得页脚一直定位在主容器预留占位位置。

```
<div class="wrapper">
    <div class="content"><!-- 页面主体内容区域 --></div>
    <div class="footer"><!-- 需要做到 Sticky Footer 效果的页脚 --></div>
</div>
```

```css
html, body {
    height: 100%;
}
.wrapper {
    position: relative;
    min-height: 100%;
    padding-bottom: 50px;
    box-sizing: border-box;
}
.footer {
    position: absolute;
    bottom: 0;
    height: 50px;
}
```
> 这个方案需指定 html、body 100% 的高度，且 content 的 padding-bottom 需要与 footer 的 height 一致。
5. calc
> 通过计算函数 calc 计算（视窗高度 - 页脚高度）赋予内容区最小高度，不需要任何额外样式处理，代码量最少、最简单。

```
<div class="wrapper">
    <div class="content"><!-- 页面主体内容区域 --></div>
    <div class="footer"><!-- 需要做到 Sticky Footer 效果的页脚 --></div>
</div>
```

```css
.content {
    min-height: calc(100vh - 50px);
}
.footer {
    height: 50px;
}
```
> 如果不需考虑 calc() 以及 vh 单位的兼容情况，这是个很理想的实现方案。同样的问题是 footer 的高度值需要与 content 其中的计算值一致。
6. Grid网格布局

```
<body>
  <div class="content">
    content
  </div>
  <footer class="footer"></footer>
</body>
```
```css
html {
  height: 100%;
}
body {
  min-height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
}
.footer {
  grid-row-start: 2;
  grid-row-end: 3;
}
```
缺点： 网格布局（Grid layout）目前仅支持Chrome Canary和Firefox Developer Edition版本。
> 本文首次发布于 [SkioFox Blog](http://blog.skiofox.top),转载请保留原文链接.