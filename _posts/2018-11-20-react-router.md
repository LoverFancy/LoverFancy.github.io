---
layout:     post
title:      react-router
subtitle:   react-router
date:       2018-11-20
author:     SkioFox
header-img: img/post-bg-ioses.jpg
catalog: true
tags:
- react
- 路由
- router
---

>react-router

## react-router-dom

1. 特点：

  - 路由也是组件
  - 分布式配置
  - 包含式匹配

2. 路由的基本用法

```js
// RouterSample.js
import React, { Component } from "react";
import { BrowserRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import { connect, Provider } from "react-redux";
import { login } from "../store/user.redux";
import store from "../store";

function App(props) {
  return (
    <div>
      {/* 导航链接 */}
      <ul>
        <li>
          <Link to="/">home</Link>
        </li>
        <li>
          <Link to="/about">about</Link>
        </li>
        <li>
          <Link to="/foo">foo</Link>
        </li>
      </ul>
      {/* 路由配置 Switch代表只能配置其中一个*/}
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/about" component={About} /> */}
        <PrivateRoute path="/about" component={About} />
        <Route path="/detail/:course" component={Detail} />
        <Route path="/login" component={Login} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  );
}

// 路由守卫：定义可以验证的高阶组件
@connect(state => ({ isLogin: state.user.isLogin }))
class PrivateRoute extends Component {
  render() {
    const { isLogin, component: Component, ...rest } = this.props;
    // render和component选项二选一
    return (
      <Route
        {...rest}
        render={props =>
          isLogin ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: "/login",state: { from: props.location.pathname }}}/>
          )
        }
      />
    );
  }
}

// 接口
// const auth = {
//   isLogin: false,
//   login(cb) {
//     this.isLogin = true;
//     setTimeout(cb, 300);
//   }
// };

// 登录组件
@connect(
  state => ({ isLogin: state.user.isLogin }),
  {
    login
  }
)
class Login extends Component {
  render() {
    // 回调地址
    const from = this.props.location.state.from || "/";
    if (this.props.isLogin) {
      return <Redirect to={from} />;
    }
    return (
      <div>
        <p>请先登录</p>
        <button onClick={this.props.login}>登录</button>
      </div>
    );
  }
}

function NoMatch(props) {
  return <div>404页面</div>;
}

function Home({ location }) {
  console.log("接收参数：", location.state);
  return (
    <div>
      <ul>
        <li>
          <Link to="/detail/web">Web</Link>
        </li>
        <li>
          <Link to="/detail/python">Python</Link>
        </li>
        <li>
          <Link to="/detail/java">Java</Link>
        </li>
      </ul>
    </div>
  );
}
// { match, history, location }=>props对象的解构结果
function Detail({ match, history, location }) {
  // match - 参数获取等路由信息
  // history - 导航
  // location - url定位
  console.log(match, history, location);

  return (
    <div>
      {/* 获取参数 */}
      {match.params.course}
      {/* 命令式导航 */}
      <button onClick={history.goBack}>后退</button>
      <button
        onClick={() => history.push({ pathname: "/", state: { foo: "bar" } })}
      >
        回到首页
      </button>
    </div>
  );
}
function About() {
  return (
    <div>
      {/* 显示用户信息和订单 */}
      <h2>用户中心</h2>
      <div>
      {/*路由导航*/}
        <Link to="/about/me">个人信息</Link>
        <Link to="/about/order">订单</Link>
      </div>
      <Switch>
        <Route path="/about/me" component={() => <div>我的信息</div>} />
        <Route path="/about/order" component={() => <div>订单信息</div>} />
        {/* 重定向 */}
        <Redirect to="/about/me" />
      </Switch>
    </div>
  );
}

export default class RouteSample extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    );
  }
}
```

```js
// store/user.redux.js
const initialState = {
  isLogin: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'login':
      return {isLogin: true};

    default:
      return state;
  }
};
// for redux-thunk
export function login(){
  // 需满足redux-thunk要求。返回的是一个函数。传递dispatch,结束后执行   
    return (dispatch)=>{
        // mock一个异步登录
        setTimeout(()=>{
            dispatch({type:'login'})
        }, 1000)
    }
}

// for saga
// export function login(){
//   return {type:'login_request'}
// }
```


> 本文首次发布于 [SkioFox Blog](http://blog.skiofox.top), 作者 [SkioFox](https://github.com/LoverFancy/) ,转载请保留原文链接.