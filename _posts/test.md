<!-- 1. fastclick解决移动端300ms延时的问题
    fastclick.attach(document.body)
2. babel-runtime是对ES6语法进行转义
3. babel-polyfill对ES6语法进行补丁
4. 使用stylus（可以定义变量和函数=>reset.styl/variable.styl/mixin.styl/base.styl/icon.styl）需要安装stylus/stylus-loader
5. jsonp原理=>解决跨域问题
> 动态创建script标签，将src指向请求的服务端地址
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
    - flex属性

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
38. webpack dev配置和接口mock
39. stylus基本使用，sass基本使用
40. 图标字体的使用  
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
56. 打分五星的实现(v-for循环span,定义每个星星的off/half/on状态，依据成绩获取样式名，依据传入的type决定星星的大小)
57. postcss=>(postcss-px-to-viewport/postcss-pxtorem)
57. vue实现购物车(父：goods.vue/子：shopcart.vue/子：cartControll)=>实现小球动画需要将当前添加的el从cartControll传递到goods再到shopcart以获取小球的起始位置。通过事件派发和父组件触发子组件方法去传递，显得很复杂，体现了vue中事件传递的复杂性。没有react清晰，那么react是如何传递的呢？

59. axios如何封装get/post/put 上传？
60. 原生组件的开发，以及组件的抽象和封装
61. 更改第三方库的css在scope内  >>> 或者  不用scope写css
62. monent.js 基础库进行时间戳的换算，query-string可以解析浏览器后面的字符串为对象，也可以将对象解析为字符串    (queryString.parse(url);queryString.stringify(string)) 需要细化
63. create-api和cube-ui的主要原理
64. asset是js中的断言
65. webpack打包文件名中的hash作用：为了实现浏览器缓存，提高用户体验。当打包文件内的内容内有发生变化时，hash值不会变化，再次发布资源时，用户如果访问过该js就会使用缓存的内容，而不需要再次请求。Gzipped的打包优化
66. vue cli 3 npm run report可以将打包后的文件大小内容可视化，可查询和优化内容大小；查看webpack 配置 vue inspect >> output.js 从而审查webpack配置

68. 配置nginx跑多个项目(不是二级域名，是端口转发=>原理：通过访问不同路径进行反向代理到不同的端口)
  - 对于build的项目加载资源和接口会失败，因为在代码中接口和css等资源都是从根路径获取，但是经过转发后我们需要从 域名/sell/ 获取，所以对于css需要修改vue.config.js中的baseUrl: '' 替代默认的 '/'。对于接口更改api下的url进行拼接


任务：小程序（mvpue,taro）/ vue / react / node (koa/express/egg) 数据结构与算法
开发顺序：

  1. 全网首发mpvue课程小程序全栈开发
  2. 06 9小时搞定微信小程序开发（完结）
  3. Webpack-四大维度解锁 Webpack 3(1).0 前端工程化 ok
  4. 极客webpack4讲解课程
  4. Vue.js 2.5 + cube-ui 重构饿了么 App(有四个分支1.0/2.0/mater/next) ok
  5. Vue-开发微信全家桶项目Vue-Node-MongoDB高级技术栈全覆盖(可选)/ 美团项目（可选）
  6. node项目上线部署 ok
  7. 01.React全家桶+AntD 共享单车后台管理系统开发
  8. 03.APP开发之实战美团外卖
  9. 05.React16+React-Router4 从零打造企业级电商后台管理系统（全）(可选)
  10. 06.React高级实战 打造大众点评 WebApp（移动端）
  11. 09.React.js入门与实战（开发适配PC端及移动端新闻头条平台）(可选)
  12. 14.React Native快速开发 厕所在哪App LBS定位 框架封装(可选)
  13. 税计算百宝箱小程序和事业部公众号
  14. Koa2实现电影微信公众号前后端开发(Koa2 + MongoDB + Mongoose + Pug + Bootstrap + 微信 JS-SDK)
  15. Koa2框架搭建电影预告片网站(Node.js+Koa2+Babel+Parcel+AntDesign+Puppeter从0开始搭建完整网站)
  16. 7天搞定Node.js微信公众号
  17. 掌握Taro多端框架 快速上手小程序/H5开发
  18. 前端下一代开发语言TypeScript 从基础到axios实战(从零开始重构一个功能完整的JS库，并进行单元测试与部署发布，是学习造轮子的不二之选)
  19. Vue2.5实战微信读书 媲美原生App的企业级Web书城



  1. grid布局讲解
  2. css实现图标库
  3. calc(100vh)
  4. react-router 4中嵌套路由是用render函数去匹配
  5. react中的事件
  传参数需要箭头函数写法
  <Button type="primary" onClick={()=>this.showMessage('success')}>Success</Button>
  <Button type="primary" onClick={() =>this.handleOpen('showModal1')}>Open</Button>
  <Button type="primary" onClick={() =>this.handleOpen('showModal2')}>自定义页脚</Button>

```js
// 传递参数的事件写法和动态参数的触发事件
import React from 'react'
import { Card, Button, Modal } from 'antd'
import './ui.less'
export default class Buttons extends React.Component {

    state = {
        showModal1: false,
        showModal2: false,
        showModal3: false,
        showModal4: false
    }
 
    handleOpen = (type)=>{
        this.setState({
            // [type]会作为是一个变量设置
            // type只是简单的key
            [type]:true
        })
    }

    handleConfirm = (type)=>{
        Modal[type]({
            title:'确认？',
            content:'你确定你学会了React了吗？',
            onOk(){
                console.log('Ok')
            },
            onCancel(){
                console.log('Cancel')
            }
        })
    }
    render(){
        return (
            <div>
                <Card title="基础模态框" className="card-wrap">
                    // 不能直接使用onClick={this.handleOpen('showModal1')},因为这样写是执行该函数，而不是给事件绑定函数。我们应该使用箭头函数去绑定这个事件，在点击的时候执行箭头函数内部的事件传递参数。
                    <Button type="primary" onClick={() =>this.handleOpen('showModal1')}>Open</Button>
                    <Button type="primary" onClick={() =>this.handleOpen('showModal2')}>自定义页脚</Button>
                    <Button type="primary" onClick={() =>this.handleOpen('showModal3')}>顶部20px弹框</Button>
                    <Button type="primary" onClick={() =>this.handleOpen('showModal4')}>水平垂直居中</Button>
                </Card>
                <Card title="信息确认框" className="card-wrap">
                    <Button type="primary" onClick={() => this.handleConfirm('confirm')}>Confirm</Button>
                    <Button type="primary" onClick={() => this.handleConfirm('info')}>Info</Button>
                    <Button type="primary" onClick={() => this.handleConfirm('success')}>Success</Button>
                    <Button type="primary" onClick={() => this.handleConfirm('warning')}>Warning</Button>
                </Card>
                <Modal
                    title="React"
                    visible={this.state.showModal1}
                    onCancel={()=>{
                        this.setState({
                            showModal1:false
                        })
                    }}
                >
                    <p>React Learning</p>
                </Modal>
                <Modal
                    title="React"
                    visible={this.state.showModal2}
                    okText="好的"
                    cancelText="算了"
                    onCancel={() => {
                        this.setState({
                            showModal2: false
                        })
                    }}
                >
                    <p>React Learning</p>
                </Modal>
                <Modal
                    title="React"
                    // 自定义样式
                    style={{top:20}}
                    visible={this.state.showModal3}
                    onCancel={() => {
                        this.setState({
                            showModal3: false
                        })
                    }}
                >
                    <p>React Learning</p>
                </Modal>
                <Modal
                    title="React"
                    // 自定义样式
                    wrapClassName="vertical-center-modal"
                    visible={this.state.showModal4}
                    onCancel={() => {
                        this.setState({
                            showModal4: false
                        })
                    }}
                >
                    <p>React Learning</p>
                </Modal>
            </div>
        );
    }
}
```
6. es6 javascript的class的静态方法、属性和实例属性

```js
// 类相当于实例的原型， 所有在类中定义的方法， 都会被实例继承。 如果在一个方法前， 加上static关键字， 就表示该方法不会被实例继承， 而是直接通过类来调用， 这就称为“ 静态方法”。

class Foo {
	static classMethod() {
		return 'hello';
	}
}
Foo.classMethod() // 'hello'
var foo = new Foo();
foo.classMethod()
	// TypeError: foo.classMethod is not a function

// 上面代码中， Foo类的classMethod方法前有static关键字， 表明该方法是一个静态方法， 可以直接在Foo类上调用（ Foo.classMethod()）， 而不是在Foo类的实例上调用。 如果在实例上调用静态方法， 会抛出一个错误， 表示不存在该方法。
父类的静态方法， 可以被子类继承。

class Foo {
	static classMethod() {
		return 'hello';
	}
}
class Bar extends Foo {}
Bar.classMethod(); // 'hello'

// 上面代码中， 父类Foo有一个静态方法， 子类Bar可以调用这个方法。静态方法也是可以从super对象上调用的。

class Foo {
	static classMethod() {
		return 'hello';
	}
}
class Bar extends Foo {
	static classMethod() {
		return super.classMethod() + ', too';
	}
}
Bar.classMethod();

// 静态属性，静态属性指的是 Class 本身的属性， 即Class.propname， 而不是定义在实例对象（ this） 上的属性。

class Foo {}
Foo.prop = 1;
Foo.prop // 1

// 上面的写法为Foo类定义了一个静态属性prop。目前， 只有这种写法可行， 因为 ES6 明确规定， Class 内部只有静态方法， 没有静态属性。

//  以下两种写法都无效
class Foo {
	//  写法一
	prop: 2
		//  写法二
	static prop: 2
}
Foo.prop // undefined

// ES7 有一个静态属性的提案， 目前 Babel 转码器支持。这个提案对实例属性和静态属性， 都规定了新的写法。（ 1） 类的实例属性.类的实例属性可以用等式， 写入类的定义之中。

class MyClass {
	myProp = 42;
	constructor() {
		console.log(this.myProp); // 42
	}
}
// 上面代码中， myProp就是MyClass的实例属性。 在MyClass的实例上， 可以读取这个属性。以前， 我们定义实例属性， 只能写在类的constructor方法里面。
class ReactCounter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};
	}
}
// 上面代码中， 构造方法constructor里面， 定义了this.state属性。有了新的写法以后， 可以不在constructor方法里面定义。
class ReactCounter extends React.Component {
	state = {
		count: 0
	};
}
//这种写法比以前更清晰。为了可读性的目的， 对于那些在constructor里面已经定义的实例属性， 新写法允许直接列出。
class ReactCounter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};
	}
	state;
}
2） 类的静态属性:只要在上面的实例属性写法前面， 加上static关键字就可以了。
class MyClass {
static myStaticProp = 42;
constructor() {
    console.log(MyClass.myProp); // 42
  }
}

//  老写法
class Foo {}
Foo.prop = 1;
//  新写法
class Foo {
	static prop = 1;
}
// 上面代码中， 老写法的静态属性定义在类的外部。 整个类生成以后， 再生成静态属性。 这样让人很容易忽略这个静态属性.也不符合相关代码应该放在一起的代码组织原则。 另外， 新写法是显式声明（ declarative）， 而不是赋值处理， 语义更好。
```

   