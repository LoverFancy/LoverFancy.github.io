---
layout:     post
title:      vue-router
subtitle:   解析vue中的路由
date:       2018-05-05
author:     SkioFox
header-img: img/home-bg-geek.jpg
catalog: true
tags:
- vue router
- vue
- 路由
---

## 路由定义

- 单页面：根据url地址进行动态的dom的添加和移除操作
- 多页面：页面html的替换

## 基本使用（包含路由嵌套（子路由））

```js
// router.js
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Personal from '../components/views/Personal'
import GroupLeaderReview from '../components/views/GroupLeaderReview'
import FOBeReview from '../components/views/FOBeReview'
import FGLReview from '../components/views/FGLReview'
import FGLDispatchTask from '../components/views/FGLDispatchTask'
import TeamGroupSetting from '../components/views/TeamGroupSetting'
import PerformanceControllerSetting from '../components/views/PerformanceControllerSetting'
import PerformanceScore from '../components/views/PerformanceScore'
import UserManage from '../components/views/UserManage'
import ErrorPage from '../components/404.vue'
import Password from '../components/Password.vue'
import NoPermissionPage from '../components/403.vue'
import empty from '../components/views/empty.vue'

Vue.use(Router)

//通用路由表
export const constantRouterMap = [
        {
          path: '/',
          name: 'Login',
          component: Login
        },
        {
          path: '/home',
          name: 'Home',
          component: Home,
          children:[]
        },
        {
          path: '/password',
          name: 'Password',
          component: Password,
        },
        {
          //无权限页面
          path: '/403',
          name: 'NoPermissionPage',
          component: NoPermissionPage,
        },
        {
          path: '/views/empty',
          name: 'empty',
          component: empty
        },
]
//实例化vue的时候只挂载constantRouter
export default new Router({
  routes: constantRouterMap
});
//动态需要根据权限加载的路由表 
export const asyncRouterMap = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children:[
        {
          path: '/Personal',
          name: 'Personal',
          component: Personal,
          role:["100"],
          icon: 'el-icon-info',
          index: 'personal',
          title: '个人首页'    
        },
        {
          path: '/GroupLeaderReview',
          name: 'GroupLeaderReview',
          component: GroupLeaderReview,
          role:["200"],
          icon: 'el-icon-message',
          index: 'GroupLeaderReview',
          title: '小组考核'
        },
        {
          path: '/FOBeReview',
          name: 'FOBeReview',
          component: FOBeReview,
          role:["300"],
          icon: 'el-icon-edit',
          index: 'FOBeReview',
          title: 'FO绩效填写'
        },
        {
          path: '/FGLReview',
          name: 'FGLReview',
          component: FGLReview,
          role:["400"],
          icon: 'el-icon-edit-outline',
          index: 'FGLReview',
          title: 'FGL考核'
        },
        {
          path: '/FGLDispatchTask',
          name: 'FGLDispatchTask',
          component: FGLDispatchTask,
          role:["500"],
          icon: 'el-icon-news',
          index: 'FGLDispatchTask',
          title: '发布任务书'
        },
        {
          path: '/TeamGroupSetting',
          name: 'TeamGroupSetting',
          component: TeamGroupSetting,
          role:["600"],
          icon: 'el-icon-rank',
          index: 'TeamGroupSetting',
          title: '分组管理'
        },
        {
          path: '/PerformanceControllerSetting',
          name: 'PerformanceControllerSetting',
          component: PerformanceControllerSetting,
          role:["700"],
          icon: 'el-icon-refresh',
          index: 'PerformanceControllerSetting',
          title: '考核控制'    
        },
        {
          path: '/PerformanceScore',
          name: 'PerformanceScore',
          component: PerformanceScore,
          role:["800"],
          icon: 'el-icon-star-on',
          index: 'PerformanceScore',
          title: '考核成绩'
        },
        {
          path: '/UserManage',
          name: 'UserManage',
          component: UserManage,
          role:["900"],
          icon: 'el-icon-setting',
          index: 'UserManage',
          title: '用户管理'
        },
    ]
  },
  {
    //404页面
    path: '*',
    name: 'ErrorPage',
    component: ErrorPage,
  }
]

```
```js
// main.js

import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```
```js
// app.vue
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

```
## 路由跳转和重定向

```js
//方法一

// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')

// 方法二
<router-link to="/foo">Go to Foo</router-link>

// 重定向

{path:'/',redirect:'/dashboard/page'}

```
```html

  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>

```
## 动态路由(路由传参)

|模式|路径匹配|$route.params|
|:-|:-:|-:|
|/user/:username|/user/evan|{ username: 'evan' }|
|/user/:username/post/:post_id|/user/evan/post/123|{ username: 'evan', post_id: '123' }|

```js
// app.vue

<temppate>
  <router-link to="/page1">Go to page1</router-link>
  <!-- 超链接形式传参 -->
  <router-link to="/page2/vuejs">Go to page2</router-link>

  <!-- 查询形式传参 k可选-->
  <router-link to="/page2/1/vuejs?foo=bar">Go to page2</router-link>
</template>

// page2.vue
  <template>
    <div>
      <button @click ="gotoPage()"></button>
      // 通过参数传递
      <p>{{$route.params.id}}</p>
      <p>{{$route.params.msg}}</p>
      <p>{{$route.params.foo}}</p>
      // 通过属性传递过来
      <p>{{id}}</p>
      <p>{{msg}}</p>
      <p>{{foo}}</p>
    </div>
  </template>
  <script>
    export default {
      props:['id','msg','foo']
      methods:{
        gotoPage(){
          // 获取当前路由路径参数
          // this.$route.params.msg
          // 导航方式跳转并传参=>路由超链接传参是必传参
          // this.$router.push('/page2/vuejs')
          // 多个参数 name是路由的名字
          this.$router.push({name:'page2',params:{id:1,msg:'vuejs'}})
          //获取参数
          this.$route.params.msg
          this.$route.params.id
          // 获取查询参
          this.$route.query.foo

        }
      }
    }
  </script>
// router.js

export default new Router({
  routes: [
    {path:'/page',components:Page1},
    // 传参msg
    // {path:'/page2/:msg',components:Page1}
    // props式传参
    // {path:'/page2/:msg',components:Page1,props:true}
    // 多个参数
    // {path:'/page2/:id/:msg',components:Page2,name:'page2'}
    
    // 传递函数 设置了props必需在组件中去接收
      {path:'/page2/:id/:msg',components:Page2,name:'page2',props:func}
  ]
})

// function func(route){
//   return {
//     // 构建需要传的参数
//      id: route.params.id,
//      msg: route.params.msg,
//      foo: route.query.foo
//   }
// }

function func({params,query}){
  return {
    // 构建需要传的参数
     id: params.id,
     msg: params.msg,
     foo: query.foo
  }
}
```

- this.$route获取当前路由的内容,this.$router获取全局路由的内容

- 获取参数：this.$route.params.username/this.$route.params.post_id

- 除了 $route.params 外，$route 对象还提供了其它有用的信息，例如，$route.query (如果 URL 中有查询参数)、$route.hash 等等

- 监听路由变化

```js
// 方法一：监听路由路由对象
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
    }
  }
}
// 方法二：路由守卫

const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
}
```
## 路由守卫

- beforeEach所有路由跳转前执行，next统一跳转，例如登陆执行2秒后跳转

```js

routers.beforeEach((to,from,next)=>{
    if(to.path!='/login'){
        next();
    }else{
        setTimeout(()=>{
            next()
        },2000)
    }
})
routers.afterEach((to,from)=>{
    console.log(to,from)
})
```
## 路由在组件中的生命周期

 - 路由跳转的整个过程
    - 导航被触发
    - 调用全局的beforeEach守卫
    - 在重用的组件中调用beforeRouteUpdate守卫
    - 在路由配置中调用beforeEnter
    - 在被激活的组件中调用beforeRouterEnter
    - 调用全局的beforeResolve守卫（2.5+）
    - 导航确认
    - 调用全局afterEach钩子
    - 触发dom更新
```js
// page.vue
export default {
    props:['id'],
    beforeRouteEnter(to,from,next){
        console.log('page路由进入前')
        next()
    }
    beforeRouteUpdate(to,from,next){
        console.log('page路由参数变化')
        next()
    }
    beforeRouteLeave(to,from,next){
        console.log('page路由离开前')
        next()
    }   
}
```
## 异步组件

```js
// vue配合webpack
{
    path: '/login',
    component:()=>import('./components/Login')
}
```
## 前端实现权限管理的几种方案

### addRoutes

我们默认值定义不需要权限的路由，比如登录页，比如首页，需要权限的页面，全部使用addRouters 动态添加到页面中

1. 初始化只有公用页面
2. 用户登录后，获取当前用户的权限数据，里面有路由数据
3. 调用router.addRoutes添加动态的路由表

```js
// 路由守卫
router.beforeEach((to, from, next) => {
  if (store.getters.token) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取info
          const roles = res.data.role;
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(err => {
          console.log(err);
        });
      } else {
        next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
    } else {
      next('/login'); // 否则全部重定向到登录页
    }
  }
});
```
```js
// store/moduels/permission.js

import { asyncRouterMap, constantRouterMap } from '@/router/index'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  //匹配角色权限数组和路由权限
  if (route.role) {
    return roles.some(role => route.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  let accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap[1].children.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const  roles = data
        let accessedRouters
        //开放所有页面的管理员权限
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
          //开放某个模块的过滤函数
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
```
### 

## vue-router原理解析

```js
const routes= [
  {path:'/',component: Home},
  {path:'/book',component: Book},
  {path:'/movie',component: Movie}
]

const router=new VueRouter(Vue,{
  routes
})

new vue({
  el: '#app',
  router
})

class VueRouter {
  constructor(vue,options) {
    this.$options = options
    // path和compont的映射关系
    this.routeMap = {}
    this.app = new Vue ({
      // current变量发生变化就可以被识别到
      data: {
        // hash模式
        current: '#/'
      }
    })
    this.init()
    this.createRouteMap(this.$options)
    this.initComponent(Vue)
  }
  // 初始化hashchange
  init(){
    // 加载完对hashchange事件进行绑定，同时更改this指向当前的路由的实例
    window.addEventListener('load',this.onHashChange.bind(this),false)
    // 监听hashchange的改变事件
    window.addEventListener('hashchange',this.onHashChange.bind(this),false)
  }
  // 映射组件和path
  createRouteMap(options) {
    options.routes.forEach(item=>{
      this.routeMap[item.path]=item.component
    })
  }

  // 注册组件

  initCompent(Vue) {
    Vue.component('router-link',{
      props: {
        to: String
      },
      template: '<a :href="to"><slot></slot></a>'
    })

    const _this=this
    Vue.component('router-view',{
      // 渲染组件为虚拟dom,和真实dom映射。，当有变化才会更改
      render(h) {
        var component = _this.routeMap[_this.app.current]
        return h(component)
      }
    })
  }
  // 获取当前的hash
  getHash() {
    return window.location.hash.slice || '/'
  }
  // 设置当前路径
  onHashChange() {
    this.app.current = this.getHash()
  }
}
```

> 本文首次发布于 [SkioFox Blog](http://blog.skiofox.top),转载请保留原文链接.