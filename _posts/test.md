1. fastclick解决移动端300ms延时的问题
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