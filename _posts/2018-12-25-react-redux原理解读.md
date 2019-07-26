---
layout:     post
title:      react-redux原理
subtitle:   react-redux原理
date:       2018-12-25
author:     SkioFox
header-img: img/home-bg-o.jpg
catalog: true
tags:
- react
- react-redux
- 全局数据
- 原理
---

## react-redux原理
- 使用
  - react-redux 的使用分为两步，第一步是使用 Provider 在顶层创建一个 Root 节点，将创建的 store 作为 Provider 的 props 传入
  - 在需要使用 store 的页面，使用 connect 将组件与 store 建立连接关系，需要用到的值通过 mapStateToProps 传入对应的组件中
- 原理分析
  - react-redux库提供Provider组件通过context方式向应用注入store，然后可以使用connect高阶方法，获取并监听store，然后根据store state和组件自身props计算得到新props，注入该组件，并且可以通过监听store，比较计算出的新props判断是否需要更新组件。

![avatar](/img/react/react-redux.jpg)

> Provider.js

  ```js
    // Provider传递store
    export default class Provider extends Component {
      getChildContext() {
        // 将绑定在this下面的store，以对象的方式传递给子组件
        return { store: this.store }
      }

      constructor(props, context) {
        super(props, context)
        // 将从 props 中拿到的数据放于 this 中
        this.store = props.store
      }

      render() {
        // 指定只渲染一个子节点
        return Children.only(this.props.children)
      }
    }
  ```
> connect 是一个高级组件，它接收从 Provider 中的 Context 传入的值，将其经过 mapStateToProps、mapDispatchToProps、mergeProps、options 等方法后，得到一个新值，再将其以 props 的方式传递给与它关联的组件。

  ```js
    // 默认需要合并到props上的值
    const defaultMergeProps = (stateProps, dispatchProps, parentProps) => ({
      ...parentProps,
      ...stateProps,
      ...dispatchProps
    })
    export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
        const mapState = mapStateToProps || defaultMapStateToProps
        
        const finalMergeProps = mergeProps || defaultMergeProps
        return function wrapWithConnect(WrappedComponent) {
            class Connect extends Component {
              // 判断是否需要重新渲染页面
              shouldComponentUpdate() {
                return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged
              }
        
              constructor(props, context) {
                super(props, context)
                // 将从props 以及 context 中拿到的 store，绑定于 this.store 下
                this.store = props.store || context.store
                
                // 通过调用 store 的 getState 方法拿到对应的值，将其存放于 this.state下面
                const storeState = this.store.getState()
                this.state = { storeState }
              }
              
              componentDidMount() {
                this.trySubscribe()
              }
              
              trySubscribe() {
                if (shouldSubscribe && !this.unsubscribe) {
                  // 对 store 中的数据进行监听，如果有改变，就执行 handleChange 方法
                  this.unsubscribe = this.store.subscribe(this.handleChange.bind(this))
                  this.handleChange()
                }
              }
              
              handleChange() {
                const storeState = this.store.getState()
                const prevStoreState = this.state.storeState
                if (pure && prevStoreState === storeState) {
                  return
                }
        
                if (pure && !this.doStatePropsDependOnOwnProps) {
                  const haveStatePropsChanged = tryCatch(this.updateStatePropsIfNeeded, this)
                  if (!haveStatePropsChanged) {
                    return
                  }
                  this.haveStatePropsBeenPrecalculated = true
                }
        
                // 如果 store 中的值有变化 ，就使用 state 的方式更新storeState
                this.hasStoreStateChanged = true
                this.setState({ storeState })
              }
              
              updateMergedPropsIfNeeded() {
                const nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props)
                // 对比较的值进行浅比较
                if (this.mergedProps && checkMergedEquals && shallowEqual(nextMergedProps, this.mergedProps)) {
                  return false
                }
        
                this.mergedProps = nextMergedProps
                return true
              }
              
              // 计算合并后的props
              function computeMergedProps(stateProps, dispatchProps, parentProps) {
                  const mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps)
                  return mergedProps
                }
              
              render() {
                const {
                  haveOwnPropsChanged,
                  hasStoreStateChanged,
                  haveStatePropsBeenPrecalculated,
                  renderedElement
                } = this
                
                let haveMergedPropsChanged = true
                if (
                  haveStatePropsChanged ||
                  haveDispatchPropsChanged ||
                  haveOwnPropsChanged
                ) {
                  // 根据 state、dispatch、ownProps是否改变来判断是否需要重绘页面
                  haveMergedPropsChanged = this.updateMergedPropsIfNeeded()
                } else {
                  haveMergedPropsChanged = false
                }
        
                if (!haveMergedPropsChanged && renderedElement) {
                  return renderedElement
                }
        
                if (withRef) {
                  this.renderedElement = createElement(WrappedComponent, {
                    ...this.mergedProps,
                    ref: 'wrappedInstance'
                  })
                } else {
                  this.renderedElement = createElement(WrappedComponent,
                    this.mergedProps
                  )
                }
        
                return this.renderedElement
              }
            }
        }
    }
  ```
> 在 store 发生改变时，调用updateMergedPropsIfNeeded方法更改需要传递给子组件的props值，因为在页面的componentDidmount中有注册监听store发生变化的函数，在 store 发生改变的时候，就会重新计算，高级组件还使用了shouldComponentUpdate钩子函数来监听 props 的改变，判断是否需要重新刷新，以达到渲染性能优化的效果。

## redux-thunk中间件解析
  ```js
    const thunk = ({dispatch,getState})=>next=>action=>{
      // 判断action是否是函数，是函数就执行，然后进行dispatch
      if (typeof action == 'function') {
        return action(dispatch(getState))
      }
      return next(action)
    }

    export default thunk
  ```

> 本文首次发布于 [SkioFox Blog](http://blog.skiofox.top), 作者 [SkioFox](https://github.com/LoverFancy/) ,转载请保留原文链接.