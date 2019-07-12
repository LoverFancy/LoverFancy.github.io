---
layout:     post
title:      generator生成器
subtitle:   generator生成器
date:       2017-07-25
author:     SkioFox
header-img: img/post-bg-coffee.jpeg
catalog: true
tags:
- generator
---

## generator生成器
> 可以控制函数内部代码块的执行，起到异步控制的作用
```js
// function* g() {
//   yield "a";
//   yield "b";
//   yield "c";
//   return "ending";
// }
// console.log(g()); //返回迭代器Iterator
// 持有返回的迭代器Iterator实例
// const gen = g();
// console.log(gen.next()) // 返回结果对象{ value: 'a', done: false } value是yield后面表达式的结果
// console.log(gen.next()) // { value: 'b', done: false }
// console.log(gen.next()) // { value: 'c', done: false }
// console.log(gen.next()) // { value: 'ending', done: true }
// console.log(gen.next()) // { value: undefined, done: true }
// 使用递归函数执行生成器里面所有步骤
// function next(){
//   let { value, done } = gen.next() // 启动
//   console.log(value) // 依次打印输出 a b c ending
//   if(!done) next() // 直到迭代完成
// }
// next()

// 如何传值 next()只执行yield函数右边的内容就停止，即使左边有赋值也会停止
// a的值是由第二个next()进行传参而得到=>参数是第一个yield '1' 的结果

// function* say() {
//   let a = yield '1'
//   console.log(a)
//   let b = yield '2'
//   console.log(b)
// }

// let it = say() // 返回迭代器

// console.log(it.next()) 
// // 输出 { value: '1', done: false }
// // a的值并非该返回值，而是下次next参数

// console.log(it.next('我是被传进来的1'))
// // 输出'我是被传进来的1'
// // 输出{ value: '2', done: false }

// console.log(it.next('我是被传进来的2'))
// // 输出'我是被传进来的2'
// // 输出{ value: undefined, done: true }

// 使用Generator顺序执行两次异步操作
function* r(num) {
  const r1 = yield compute(num);
  yield compute(r1);
}

// compute为异步操作，结合Promise使用可以轻松实现异步操作队列
function compute(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      const ret = num * num;
      console.log(ret); // 输出处理结果
      resolve(ret); // 操作成功,将结果ret作为返回值
    }, 1000);
  });
}

// 不使用递归函数调用
let it = r(2);
// {value:Promise,done:false}
// it.next().value.then(num => it.next(num));

// 修改为可处理Promise的next
function next(data) {
  let { value, done } = it.next(data); // 启动
  if (!done) {
    value.then(num => {
      next(num);
    });
  }
}

next();
```
> 本文首次发布于 [SkioFox Blog](http://blog.skiofox.top), 作者 [SkioFox](https://github.com/LoverFancy/) ,转载请保留原文链接.