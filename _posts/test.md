<!-- 1. fastclick解决移动端300ms延时的问题
    fastclick.attach(document.body)
2. babel-runtime是对ES6语法进行转义
3. babel-polyfill对ES6语法进行补丁
4. 使用stylus（可以定义变量和函数=>reset.styl/variable.styl/mixin.styl/base.styl/icon.styl）需要安装stylus/stylus-loader
5. jsonp原理=>解决跨域问题
> 动态创建script标签，将src指向请求的服务端地址
6. Object.assign(target, ...sources)=>浅拷贝，利用Object.assign可以对只有一层的对象实现深拷贝
>  函数参数为一个目标对象（该对象作为最终的返回值）,源对象(此处可以为任意多个)。通过调用该函数可以拷贝所有可被枚举的自有属性值到目标对象中。
- 这里我们需要强调的三点是：

    - 可被枚举的属性
    - 自有属性
    - string或者Symbol类型是可以被直接分配的
    - 拷贝过程中将调用源对象的getter方法，并在target对象上使用setter方法实现目标对象的拷贝。
> 拷贝过程中将调用源对象的getter方法，并在target对象上使用setter方法实现目标对象的拷贝。
```js
// 我们参考上面的原型函数说明即可知道其最开始的o1因为设置为target，则调用其setter方法设置了其他对象的属性到自身。
var o1 = { a: 1 };
var o2 = { b: 2 };
var o3 = { c: 3 };

var obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
console.log(o1);  // { a: 1, b: 2, c: 3 }, target object itself is changed.

// 我们自定义了一些对象，这些对象有一些包含了不可枚举的属性,另外注意使用 Object.defineProperty 初始化的对象默认是不可枚举的属性。对于可枚举的对象我们可以直接使用Object.keys()获得,或者使用for-in循环遍历出来.
// 对于不可枚举的属性，使用Object.assign的时候将被自动忽略。
var obj = Object.create({ foo: 1 }, { // foo is an inherit property.
  bar: {
    value: 2  // bar is a non-enumerable property.
  },
  baz: {
    value: 3,
    enumerable: true  // baz is an own enumerable property.
  }
});

var copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }  

// 对于只读的属性，当分配新的对象覆盖他的时候，将抛出异常:

var target = Object.defineProperty({}, 'foo', {
  value: 1,
  writable: false
}); 

Object.assign(target, { bar: 2 })

//{bar: 2, foo: 1}

Object.assign(target, { foo: 2 })
//Uncaught TypeError: Cannot assign to read only property 'foo' of object '#<Object>'(…)
```
> 实现es5版本的Object.assign：
- 实现步骤：

    - 判断是否原生支持该函数，如果不存在的话创建一个立即执行函数，该函数将创建一个assign函数绑定到Object上。
    - 判断参数是否正确(目的对象不能为空，我们可以直接设置{}传递进去,但必须设置该值)
    - 使用Object在原有的对象基础上返回该对象，并保存为out
    - 使用for…in循环遍历出所有的可枚举的自有对象。并复制给新的目标对象(hasOwnProperty返回非原型链上的属性)
```js
if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
        'use strict';
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        
        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
        };
    })();
}
```
> 如何实现深拷贝，使用原始的递归函数
- 浅拷贝：浅拷贝只复制了指向对象的指针，新旧对象共用同一块内存，修改某一个对象的同时也会把另一个都一并修改了
- 跟浅拷贝最简单明了的区别就是修改拷贝的对象，不会改变源对象
```js
function deepClone (sourceObj, targetObj) {
    let cloneObj = targetObj || {}
    if(!sourceObj || typeof sourceObj !== "object" || sourceObj.length === undefined){
        return sourceObj
    }
    if(sourceObj instanceof Array){
        cloneObj = sourceObj.concat()
    } else {
        for(let i in sourceObj){
            if (typeof sourceObj[i] === 'object') {
                cloneObj[i] = deepClone(sourceObj[i], {})
            } else {
                cloneObj[i] = sourceObj[i]
            }
        }
    }
    return cloneObj
}
```
- 介绍两个用来做深拷贝的库
```js
**jquery**
//使用方法：
let targetObj = $.extent(true,{},sourceObj)
//**lodash函数库**
//使用方法：
//npm install lodash
//**es5写法**
let lodash = require('lodash')
//**es6写法**
import lodash from 'lodash'

let targetOj = lodash.cloneDeep(sourceObj)
```

7. better-scroll实现轮播，slider、scroll vue组件封装，实现轮播和上下滚动列表
    - 注意轮播和歌曲数据的异步，scroll的刷新，宽高的变化
    - flex布局的应用
    ```css
    .text
        display: flex
        // flex方向
        flex-direction: column
        // 主轴方向的对齐方式
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
      // 类似圣杯布局? 什么是圣杯布局，什么是双飞布局。横向和纵向的常见布局方式
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
    ```
    - lex属性

        - flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值
        - flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
        - flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
        - flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

8. 图片懒加载vue-lazyload
9. 处理请求获取的数据，将json对象转化为多层嵌套的数组列表（forEach便利对象,map对象存储遍历后的数据）
10. 对相同逻辑的封装=>面向对象的思想，将其封装成类，需要使用的使用实例化即可
11. 上下滚动歌曲列表如何盖住图片、根据滚动缩放和方法图片
12. 播放器的开发和设计
13. vue动画
定义name为normal
```css
.normal-enter-active, &.normal-leave-active
    transition: all 0.4s
    .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    .normal-enter, &.normal-leave-to
    opacity: 0
    .top
        transform: translate3d(0, -100px, 0)
    .bottom
        transform: translate3d(0, 100px, 0)
```
14. 用js钩子的方式创建css3动画：create-keyframe-animation
```js
 import animations from 'create-keyframe-animation'
 // enter/afterEnter等四个函数是vue中transition动画的钩子
    enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
            0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            60: {
            transform: `translate3d(0,0,0) scale(1.1)`
            },
            100: {
            transform: `translate3d(0,0,0) scale(1)`
            }
        }

        animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
            duration: 400,
            easing: 'linear'
            }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
    animations.unregisterAnimation('move')
    this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
    this.$refs.cdWrapper.style.transition = 'all 0.4s'
    const {x, y, scale} = this._getPosAndScale()
    this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
    this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
    this.$refs.cdWrapper.style.transition = ''
    this.$refs.cdWrapper.style[transform] = ''
    },
```
15. 播放功能实现
audio标签
16. Vue.nextTick
- Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。
- Vue.nextTick用于延迟执行一段代码，它接受2个参数（回调函数和执行回调函数的上下文环境），如果没有提供回调函数，那么将返回promise对象。
    - 用法
        - 在Vue生命周期的created()钩子函数进行的DOM操作一定要放在Vue.nextTick()的回调函数中
        - 在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候，这个操作都应该放进Vue.nextTick()的回调函数中。
17. 函数防抖与节流
    - 函数节流: 频繁触发,但只在特定的时间内才执行一次代码
    - 函数防抖: 频繁触发,但只在特定的时间内没有触发执行条件才执行一次代码 
```js
// 函数防抖：延时执行：需要间隔delay时间触发才会生效
// 函数防抖的应用场景：输入框搜索自动补全事件，频繁操作点赞和取消点赞等等，滚动事件，resize窗口变化

export function debounce(func, delay) {
  let timer
  // 返回一个函数
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 函数节流 throttle
// 原理：当达到了一定的时间间隔就会执行一次；可以理解为是缩减执行频率，即每隔多少事件执行一次
// 应用场景：如果想要每隔一段时间发送一次请求，而不是等到客户触发最后一次操作才发送请求，可以这样实现
// 鼠标不断点击触发，mousedown(单位时间内只触发一次)
// 监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断
// 函数节流 throttle
// 方法一：定时器实现
const throttle = function(fn,delay) {
  let timer = null

  return function() {
    const context = this
    let args = arguments
    if(!timer) {
      timer = setTimeout(() => {
        fn.apply(context,args) 
        clearTimeout(timer) 
      },delay)
    }
  }
}
```
18. js-base64=>用于base64位的解码或者字符串转base64
    Base64.encode('string');Base64.decode('sdy82fk2hf');
19. 移动端touchstart，touchmove，touchend响应触摸事件，实现滑动（如左右页面/上下页面切换，进度条的拖动）
20. 底部播放器使用mixin来编码共同的功能代码，在需要是要引用的组件引入
21. 搜索功能(搜索首页=>热门搜索和历史)(搜索结果页)
    - 结果依据上啦刷新进行page++获取更多服务端数据，从而实现数据刷新
    - 搜索到的歌曲插入播放列表
    - 搜索结果缓存到localStorage(good-storage库)
22. 上拉加载，下拉刷新功能实现
    - better-scroll的pullup属性
23. 数组的几个方法（包括操作每个项，增删改查）
24. localStorage的存储时间和应用场景
25. 父子方法调用
    - vue 父组件调用子组件方法：his.$refs.rightmenu7.add();// add子组件方法
    - 第一种方法是直接在子组件中通过this.$parent.event来调用父组件的方法
    - 第二种方法是在子组件里用$emit向父组件触发一个事件，父组件监听这个事件就行了。
26. vue之mixin理解与使用=>共享组件之间共同的js逻辑，如
> 使用Mixin。Vue 中的Mixin对编写函数式风格的代码很有用，因为函数式编程就是通过减少移动的部分让代码更好理解（引自 Michael Feathers ）。Mixin允许你封装一块在应用的其他组件中都可以使用的函数。
- 示例
```js
//我们有一对不同的组件，它们的作用是通过切换状态（Boolean类型）来展示或者隐藏模态框或提示框。这些提示框和模态框除了功能相似以外，没有其他共同点：它们看起来不一样，用法不一样，但是逻辑一样。
// 模态框
      const Modal = {
        template: '#modal',
        data() {
          return {
            isShowing: false
          }
        },
        methods: {
          toggleShow() {
            this.isShowing = !this.isShowing;
          }
        },
        components: {
          appChild: Child
        }
      }

      // 提示框
      const Tooltip = {
        template: '#tooltip',
        data() {
          return {
            isShowing: false
          }
        },
        methods: {
          toggleShow() {
            this.isShowing = !this.isShowing;
          }
        },
        components: {
          appChild: Child
        }
      }
```
```js
//我们可以在这里提取逻辑并创建可以被重用的项：
const toggle = {
      data() {
        return {
          isShowing: false
        }
      },
      methods: {
        toggleShow() {
          this.isShowing = !this.isShowing;
        }
      }
    }

    const Modal = {
      template: '#modal',
      mixins: [toggle],
      components: {
        appChild: Child
      }
    };

    const Tooltip = {
      template: '#tooltip',
      mixins: [toggle],
      components: {
        appChild: Child
      }
    };
```
- 用法

```js
// 建立mixin
// mixin/toggle.js
export default toggle={
    data(){
        return {
            isShowing:false
        }
    },
    methods: {
        toggleShow() {
            this.isShowing = ! this.isShowing
        }
    }
}

```
```js
// 组件中引用
import Child from './Child'
import { toggle } from './mixins/toggle'

export default {
    name: 'modal',
    mixins: [toggle],
    components: {
        appChild: Child
    }
}
// 即便我们使用的是一个对象而不是一个组件，生命周期函数对我们来说仍然是可用的，理解这点很重要。我们也可以这里使用mounted()钩子函数，它将被应用于组件的生命周期上。
```
- 在下面的这个例子，我们可以看到，我们不仅仅是实现了自己想要的功能，并且Mixin中的生命周期的钩子也同样是可用的。因此，当我们在组件上应用Mixin的时候，有可能组件与Mixin中都定义了相同的生命周期钩子，这时候钩子的执行顺序的问题凸显了出来。默认Mixin上会首先被注册，组件上的接着注册，这样我们就可以在组件中按需要重写Mixin中的语句。组件拥有最终发言权。

```js
//mixin
  const hi = {
    mounted() {
      console.log('hello from mixin!')
    }
  }

  //vue instance or component
  new Vue({
    el: '#app',
    mixins: [hi],
    mounted() {
      console.log('hello from Vue instance!')
    }
  });

  //Output in console
  > hello from mixin!
  > hello from Vue instance!
```
> 如果这两个冲突了，我们看看 Vue实例或组件是如何决定输赢的：
```js
//mixin
      const hi = {
        methods: {
          sayHello: function() {
            console.log('hello from mixin!')
          }
        },
        mounted() {
          this.sayHello()
        }
      }

      //vue instance or component
      new Vue({
        el: '#app',
        mixins: [hi],
        methods: {
          sayHello: function() {
            console.log('hello from Vue instance!')
          }
        },
        mounted() {
          this.sayHello()
        }
      })

      // Output in console
      > hello from Vue instance!
      > hello from Vue instance!
```
> 混入methods, components 和 directives(自定义指令)时，将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。
```js
methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```
27. js的捕获和冒泡原理以及使用
比如父子组件都绑定了click事件，但是不希望自己子元素的click事件冒泡到父元素执行，就需要阻止click的冒泡： @click.stop
28. 处理增删操作的各种边界问题，会影响组件的显示或者数据的变化
29. vue的动画使用原理和改善
30. 如何在移动端调试(微信的vconsole重写了console)和抓包(charles主要用于mac,windows用fiddler)
31. 如何在手机上连接电脑本地的项目进行调试，设置手机的代理指向电脑的ip和端口
32. 跨域解决方案
33. vue新旧版的插槽，具名插槽，作用域插槽
34. PM2作为node服务器的管理工具 pm2 start pm2.yml
35. 七牛云空间加快静态资源CDN
36. vue ssr node ssr mongodb实现公众号和小程序(很全面)
37. Vue全家桶+SSR+Koa2全栈开发美团网：vue全家桶+koa2+Nuxt(SSR框架)+POI(摒弃Mock数据，最大程度使
用真实数据)+Element-UI+Redis(据缓存工具)+MongoDB+Mongose(对象模型工具)
任务：小程序（mvpue,taro）/ vue / react / node (koa/express/egg) 数据结构与算法
开发顺序：
38. 移动端1px边框实现（由于手机端的dpr原因会导致1px显示成2px，3px等等）=>通过伪类的方式实现=>如下是下边框实现
```css
/* mixin.styl */
border-1px($color)
  position: relative
  &:after
    display: block
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    border-top: 1px solid $color
    content: ' '
```
```css
/*  base.styl */
@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)
  .border-1px
    &::after
      -webkit-transform: scaleY(0.7)
      transform: scaleY(0.7)

@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2)
  .border-1px
    &::after
      -webkit-transform: scaleY(0.5)
      transform: scaleY(0.5)
```
类似的其他边框也可以用同样的方法实现

38. webpack dev配置和接口mock
39. stylus基本使用，sass基本使用
40. 图标字体的使用  
41. css sticky footer布局
      Sass 和 SCSS 有什么区别？
      Sass 和 SCSS 其实是同一种东西，我们平时都称之为 Sass，两者之间不同之处有以下两点：
      文件扩展名不同，Sass 是以“.sass”后缀为扩展名，而 SCSS 是以“.scss”后缀为扩展名
      语法书写方式不同，Sass 是以严格的缩进式语法规则来书写，不带大括号({})和分号(;)，而 SCSS 的语法书写和我们的 CSS 语法书写方式非常类似。
      先来看一个示例：
      Sass 语法
      $font-stack: Helvetica, sans-serif  //定义变量
      $primary-color: #333 //定义变量
      body
        font: 100% $font-stack
        color: $primary-color
      SCSS 语法
      $font-stack: Helvetica, sans-serif;
      $primary-color: #333;
      body {
        font: 100% $font-stack;
        color: $primary-color;
      }
42. babel-runtime 和 babel-polyfill的区别
43. css spirit精灵图合成一张可减少图片请求个数，从未性能优化。但是在webpack中建议使用多张的小图片，webpack的url-loader 会将图片转化成base64打包成js，不会有请求
44. SVG矢量图可以收缩，放大缩小不会影响图片质量，代码中如何使用SVG图片？=>使用图标字体工具将SVG图片转化成font-icon(https://icomoon.io/)，一些小图标字体使用阿里的iconfont:https://www.iconfont.cn/
45. 很多移动端设计稿都是按照iphone 6 的大小设计的=>iphone 6 dpr为2,其设备像素为375，物理像素是750.所以设计稿标注尺寸为两倍,说明设计稿是按照物理像素。
46. vue-loader引用了postcss插件,会将vue中的css加上对应浏览器的前缀进行兼容
47. webpack alias 路径配置 path.resolve(_dirname,'../')
48. pc开发移动端项目如何实时预览（简单方法：找到pc电脑的ip=>cli.im 草料网输入网址生成二维码，微信扫描打开即可。前提：手机和电脑在一个局域网内。）
49. vue中data为什么需要是个函数？因为组件会被复用，组件中的data也会被复用，如果使用对象在复用修改时会互相影响。使用函数每次调用该组件返回的是一个独立的数据，互相复用不会影响。
50. Promise的深度解析和理解
51. 父元素font-size设为0可以去除两个inline-block或者两个span之间的留白间隙，或者两个span不换行也会消除间歇
52. 水平垂直居中的通用方案，双飞和圣杯等等布局怎么做, flex布局，移动端vw/vh解决方案
- flex布局左边固定，右边自适应
> flex 属性是 flex-grow、flex-shrink 和 flex-basis 属性的简写属性。(flex-grow等分块/flex-shrink剩余空间分配/ flex-basis占位)
> flex:1 flex:auto flex:none
>flex: 1 1 auto flex:0 1 auto flex: 0 0 auto
```html
  <div class="goods">
    <div class="menu-wrapper">
    <div class="foods-wrapper">
  </div>
```
```css
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      // 解决android浏览器兼容问题
      width: 80px
      background: #f3f5f7
    .foods-wrapper
      flex: 1
```
- 垂直居中（.father{display:table} .child{display:ceil}）
```css
.menu-item
    display: table
    height: 54px
    width: 56px
    padding: 0 12px
    line-height: 14px
    .text
      display: table-cell
      width: 56px
      vertical-align: middle
      font-size: 12px
```
53. chrome是无法显示12px以下的，但是手机上可以正常显示
54. 背景图在底部且具有的模糊效果(需要结合上层的透明和下层的背景图filter实现)：
```html
    <header class="header">
      <div class="background">
        <img :src="seller.avatar" width="100%" height="100%">
      </div>
    </header>

```
```css
  .header
    position: relative
    overflow: hidden
    color: #fff
    background: rgba(7, 17, 27, 0.5)
    .background
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        filter: blur(10px)
```
55. css sticky-footer 布局
> 在网页设计中，Sticky footers设计是最古老和最常见的效果之一，大多数人都曾经经历过。它可以概括如下：如果页面内容不够长的时候，页脚块粘贴在视窗底部；如果内容足够长时，页脚块会被内容向下推送。
- 固定高度的解决方案
```html
<header> 
  <h1>Site name</h1>
</header>
<main> 
  <p>Bacon Ipsum dolor sit amet...</p>
</main> 
<footer> 
  <p>© 2015 No rights reserved.</p> <p>Made with ♥ by an anonymous pastafarian.</p> 
</footer>
```
> 如果我们假定页脚文本不会溢出容器，我们可以为容器推算出其高度：

```css
main { min-height: calc(100vh - 2.5em - 7em); /* Avoid padding/borders screwing up our height: */
box-sizing: border-box; }
```
- flex布局解决方案
  - 示例1
```html
<div v-show="detailShow" class="detail" transition="fade">
  <div class="detail-wrapper clearfix">
    <div class="detail-main">
      <h1 class="name">{{seller.name}}</h1>
      <div class="star-wrapper">
      </div>
      <div class="title">
        <div class="line"></div>
        <div class="text">优惠信息</div>
        <div class="line"></div>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li class="support-item" v-for="item in seller.supports">
          <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
          <span class="text">{{seller.supports[$index].description}}</span>
        </li>
      </ul>
      <div class="title">
        <div class="line"></div>
        <div class="text">商家公告</div>
        <div class="line"></div>
      </div>
      <div class="bulletin">
        <p class="content">{{seller.bulletin}}</p>
      </div>
    </div>
  </div>
  <div class="detail-close" @click="hideDetail">
    <i class="icon-close"></i>
  </div>
</div>
```
```css
.detail
  position: fixed
  z-index: 100
  top: 0
  left: 0
  width: 100%
  height: 100%
  overflow: auto
  transition: all 0.5s
  backdrop-filter: blur(10px)
  &.fade-transition
    opacity: 1
    background: rgba(7, 17, 27, 0.8)
  &.fade-enter, &.fade-leave
    opacity: 0
    background: rgba(7, 17, 27, 0)
  .detail-wrapper
    width: 100%
    min-height: 100%
    .detail-main
      margin-top: 64px
      padding-bottom: 64px
      .name
        line-height: 16px
        text-align: center
        font-size: 16px
        font-weight: 700
      .star-wrapper
        margin-top: 18px
        padding: 2px 0
        text-align: center
      .title
        display: flex
        width: 80%
        margin: 28px auto 24px auto
        .line
          flex: 1
          position: relative
          top: -6px
          border-bottom: 1px solid rgba(255, 255, 255, 0.2)
        .text
          padding: 0 12px
          font-weight: 700
          font-size: 14px

      .supports
        width: 80%
        margin: 0 auto
        .support-item
          padding: 0 12px
          margin-bottom: 12px
          font-size: 0
          &:last-child
            margin-bottom: 0
          .icon
            display: inline-block
            width: 16px
            height: 16px
            vertical-align: top
            margin-right: 6px
            background-size: 16px 16px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_2')
            &.discount
              bg-image('discount_2')
            &.guarantee
              bg-image('guarantee_2')
            &.invoice
              bg-image('invoice_2')
            &.special
              bg-image('special_2')
          .text
            line-height: 16px
            font-size: 12px
      .bulletin
        width: 80%
        margin: 0 auto
        .content
          padding: 0 12px
          line-height: 24px
          font-size: 12px
  .detail-close
    position: relative
    width: 32px
    height: 32px
    margin: -64px auto 0 auto
    clear: both
    font-size: 32px
```
  - 示例2
```html
<header> 
  <h1>Site name</h1>
</header>
<main> 
  <p>Bacon Ipsum dolor sit amet... </p>
</main> 
<footer> 
  <p>© 2015 No rights reserved.</p> <p>Made with ♥ by an anonymous pastafarian.</p> 
</footer>
```
```css
body { display: flex; flex-flow: column; min-height: 100vh; } 
main { flex: 1; }
```
56. 打分五星的实现(v-for循环span,定义每个星星的off/half/on状态，依据成绩获取样式名，依据传入的type决定星星的大小)
57. postcss=>(postcss-px-to-viewport/postcss-pxtorem)
57. vue实现购物车(父：goods.vue/子：shopcart.vue/子：cartControll)=>实现小球动画需要将当前添加的el从cartControll传递到goods再到shopcart以获取小球的起始位置。通过事件派发和父组件触发子组件方法去传递，显得很复杂，体现了vue中事件传递的复杂性。没有react清晰，那么react是如何传递的呢？
58. 函数柯里化

```js
// 封装 axios 用函数柯里化的方法将参数提前固化在内部
export function get(url) {
  return function(params = {}) {
    // 返回的是promise
    return axios.get(baseUrl + url, {
      params
    }).then((res) => {
      const {errno, data} = res.data
      if (errno === ERR_OK) {
        return data
      }
    }).catch((e) => {
    })
  }
}
```
59. axios如何封装get/post/put 上传？
60. 原生组件的开发，以及组件的抽象和封装
61. 更改第三方库的css在scope内  >>> 或者  不用scope写css
62. monent.js 基础库进行时间戳的换算，query-string可以解析浏览器后面的字符串为对象，也可以将对象解析为字符串    (queryString.parse(url);queryString.stringify(string)) 需要细化
63. create-api和cube-ui的主要原理
64. asset是js中的断言
65. webpack打包文件名中的hash作用：为了实现浏览器缓存，提高用户体验。当打包文件内的内容内有发生变化时，hash值不会变化，再次发布资源时，用户如果访问过该js就会使用缓存的内容，而不需要再次请求。Gzipped的打包优化
66. vue cli 3 npm run report可以将打包后的文件大小内容可视化，可查询和优化内容大小；查看webpack 配置 vue inspect >> output.js 从而审查webpack配置
67. linux上下载和配置node简单方法
- 获取操作系统版本 uname -a
- 上node官网查找对应版本：https://npm.taobao.org/mirrors/node/v10.16.0/node-v10.16.0-linux-x64.tar.xz
- 执行命令：
  - cd /usr/local/  
  - wget https://npm.taobao.org/mirrors/node/v10.16.0/node-v10.16.0-linux-x64.tar.xz 
  - 从远端拉去到服务器并保存到 /usr/local/ 
- 解压：tar -xvf node-v10.16.0-linux-x64.tar.xz
- 重命名：mv node-v10.16.0-linux-x64 nodejs
- cd nodejs/bin
- node -v 可显示版本说明下载成功
- 将服务器旧版本替换：通过软链的方式将新的可执行程序添加到环境变量中npm和node：
- ln -s /usr/local/nodejs/bin/node /usr/local/bin
- ln -s /usr/local/nodejs/bin/npm /usr/local/bin
- vim /etc/profile=>更改PATH：export PATH=/usr/local/bin:$PATH
- source /etc/profile =>执行node -v 检查
- 克隆项目到服务器上(注意克隆要切换到正确分支) npm install（解决权限问题 chmod  777 ./xxxx）
- 跑node让进程长链接：nohup node prod.server.js
68. 配置nginx跑多个项目(不是二级域名，是端口转发=>原理：通过访问不同路径进行反向代理到不同的端口)
  - 对于build的项目加载资源和接口会失败，因为在代码中接口和css等资源都是从根路径获取，但是经过转发后我们需要从 域名/sell/ 获取，所以对于css需要修改vue.config.js中的baseUrl: '' 替代默认的 '/'。对于接口更改api下的url进行拼接
69. node后台运行
pm2(推荐)
官网地址：http://pm2.io/
npm install -g pm2
pm2 start app.js        // 启动
pm2 start app.js -i max //启动 使用所有CPU核心的集群
pm2 stop app.js         // 停止
pm2 stop all            // 停止所有
pm2 restart app.js      // 重启
pm2 restart all         // 重启所有
pm2 delete  app.js      // 关闭

现在最流行的工具是 PM2：https://github.com/Unitech/pm2

你可以简单地在全局安装 npm install -g pm2，然后用 PM2 启动应用即可。

可以使用 PM2 命令直接启动应用，或者使用 process.json：

{
    "name": "your-app",
    "script": "inde.js",
    "watch": true,
    "ignore_watch": ["logs", "assets", "views"],
    "env": {
        "NODE_ENV": "production",
        },
    "instances": 1,
    "log_date_format": "YYYY-MM-DD hh:mm:ss",
}
然后用 pm2 start process.json 来启动

几个常用命令：

pm2 list：显示所有应用
pm2 monit：显示应用监控面板
pm2 logs：显示实时 log
pm2 restart [id]：重启应用
pm2 stop [id]：停止应用
pm2 kill [id]：关闭应用


nohup
nohup node app.js &

forever
github地址： https://github.com/nodejitsu/forever
npm install forever -g
forever start app.js    //启动
forever stop app.js     //关闭
forever stopall         //关闭全部
forever restart app.js  //重启
forever restartall      //重启全部


  1. 全网首发mpvue课程小程序全栈开发
  2. 06 9小时搞定微信小程序开发（完结）
  3. Webpack-四大维度解锁 Webpack 3(1).0 前端工程化
  4. Vue.js 2.5 + cube-ui 重构饿了么 App(有四个分支1.0/2.0/mater/next)
  5. Vue-开发微信全家桶项目Vue-Node-MongoDB高级技术栈全覆盖(可选)/ 美团项目（可选）
  6. node项目上线部署
  7. 01.React全家桶+AntD 共享单车后台管理系统开发
  8. 03.APP开发之实战美团外卖
  9. 05.React16+React-Router4 从零打造企业级电商后台管理系统（全）(可选)
  10. 06.React高级实战 打造大众点评 WebApp（移动端）
  11. 09.React.js入门与实战（开发适配PC端及移动端新闻头条平台）
  12. 14.React Native快速开发 厕所在哪App LBS定位 框架封装(可选)
   -->