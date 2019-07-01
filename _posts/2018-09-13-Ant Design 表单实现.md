---
layout:     post
title:      Ant Design表单实现
subtitle:   Ant Design表单实现
date:       2018-09-13
author:     SkioFox
header-img: img/post-sample-image.jpg
catalog: true
tags:
- React
- 组件化
- Ant Design
- 表单
---

>Ant Design表单实现

## ant design 表单

```js
import React from 'react';
import { Form, Icon, Input, Button } from "antd";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
 
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only show error after a field is touched.
    const userNameError =
      isFieldTouched("userName") && getFieldError("userName");
    const passwordError =
      isFieldTouched("password") && getFieldError("password");
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item
          validateStatus={userNameError ? "error" : ""}
          help={userNameError || ""}
        >
          {getFieldDecorator("userName", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item
          validateStatus={passwordError ? "error" : ""}
          help={passwordError || ""}
        >
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const WrappedHorizontalLoginForm = Form.create({ name: "horizontal_login" })(
  HorizontalLoginForm
);

export default WrappedHorizontalLoginForm
```

## 表单实现

```js
import React, { Component } from "react";
import { Icon } from "antd";

// HOC：包装用户表单，增加数据管理能力、校验
function kFormCreate(Comp) {
  return class NewComp extends Component {
    constructor(props) {
      super(props);
      this.options = {}; //字段选项设置
      this.state = {}; //各字段值
    }

    // 处理表单项输入事件
    handleChange = e => {
      const { name, value } = e.target;
      // setState是异步，在回调函数中去做校验
      this.setState(
        {
          [name]: value
        },
        () => {
          // 数值变化后再校验
          this.validateField(name);
        }
      );
    };

    // 表单项校验
    validateField = field => {
      const rules = this.options[field].rules;
      //只要任何一项失败就失败
      const ret = rules.some(rule => {
        if (rule.required) {
          //仅验证必填项
          if (!this.state[field]) {
            // 校验失败
            this.setState({
              [field + "Message"]: rule.message
            });
            return true; // 若有校验失败，返回true
          }
        }
      });
      if (!ret) {
        // 没失败，校验成功
        this.setState({ [field + "Message"]: "" });
      }
      return !ret;
    };

    // 校验所有字段(传入回调函数做校检)
    validate = cb => {
      // Object.keys()方法会返回一个由一个给定对象的自身可枚举属性组成的数组
      const rets = Object.keys(this.options).map(field =>
        this.validateField(field)
      );
      // 如果校验结果数组中全部为true，则校验成功
      const ret = rets.every(v => v === true);
      cb(ret);
    };
    // 利用HOC高阶组件对input组件进行封装扩展功能
    getFieldDec = (field, option, InputComp) => {
      // 保存配置项
      this.options[field] = option;
      // 返回包装后的input组件
      return (
        <div>
          {React.cloneElement(InputComp, {
            name: field, //控件name
            value: this.state[field] || "", //控件值
            onChange: this.handleChange, //change事件处理,在表单层级处理状态变化
            onFocus: this.handleFocus // 判断控件是否获得焦点, 在表单层级处理状态变化
          })}
          {/* {this.state[field + "Message"] && (
            <p style={{ color: "red" }}>{this.state[field + "Message"]}</p>
          )} */}
        </div>
      );
    };

    //
    handleFocus = e => {
      const field = e.target.name;
      this.setState({
        [field + "Focus"]: true
      });
    };
    // 判断组件是否被用户点击过
    isFieldTouched = field => !!this.state[field + "Focus"];

    getFieldError = field => this.state[field + "Message"];

    render() {
      return (
        // 传递所有的属性
        <Comp
          {...this.props}
          getFieldDec={this.getFieldDec}
          value={this.state}
          validate={this.validate}
          isFieldTouched={this.isFieldTouched}
          getFieldError={this.getFieldError}
        />
      );
    }
  };
}
class FormItem extends Component {
  render() {
    return (
      <div className="formItem">
        {this.props.children}
        {this.props.validateStatus === "error" && (
          <p style={{ color: "red" }}>{this.props.help}</p>
        )}
      </div>
    );
  }
}

class KInput extends Component {
  render() {
    return (
      <div>
        {/* 前缀图标 */}
        {this.props.prefix}
        <input {...this.props} />
      </div>
    );
  }
}
// 调用kFormCreate高阶组件包装KFormSample，高阶组件扩展了KFormSample的状态管理,数据管理
@kFormCreate
class KFormSample extends Component {
  onSubmit = () => {
    this.props.validate(isValid => {
      if (isValid) {
        alert("校验成功，提交登录");
        console.log(this.props.value);
      } else {
        alert("校验失败");
      }
    });
  };

  render() {
    // 接收通过属性传递的函数组件和属性
    const { getFieldDec, isFieldTouched, getFieldError } = this.props;

    const userNameError = isFieldTouched("uname") && getFieldError("uname");
    const passwordError = isFieldTouched("pwd") && getFieldError("pwd");

    return (
      <div>
        <FormItem
          validateStatus={userNameError ? "error" : ""}
          help={userNameError || ""}
        >
          {/* {封装input,扩展input功能} */}
          {getFieldDec(
            "uname",
            {
              rules: [{ required: true, message: "请填写用户名" }]
            },
            <KInput type="text" prefix={<Icon type="user" />} />
          )}
        </FormItem>
        <FormItem
          validateStatus={passwordError ? "error" : ""}
          help={passwordError || ""}
        >
          {getFieldDec(
            "pwd",
            {
              rules: [{ required: true, message: "请填写用户名" }]
            },
            <KInput type="password" prefix={<Icon type="lock" />} />
          )}
        </FormItem>

        <button onClick={this.onSubmit}>登录</button>
      </div>
    );
  }
}
// @kFormCreate不能和export default连用
// 实际导出的是经过kFormCreate包装的KFormSample
export default KFormSample;

```
>利用高阶组件和属性传递不断对组件进行封装和扩展功能，利用状态提升在父级进行数据和状态管理

> 本文首次发布于 [SkioFox Blog](http://skiofox.top), 作者 [SkioFox](https://github.com/LoverFancy/) ,转载请保留原文链接.