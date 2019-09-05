---
layout:     post
title:      ajax与jequery与axios的封装
subtitle:   ajax与jequery与axios的封装
date:       2019-04-13
author:     SkioFox
header-img: img/post-bg-iWatch.jpg
catalog: true
tags:
- ajax
- axios
- fetch

---
### 原生ajax

- 原生ajax封装

```js
    function ajax(type,url,obj,timeout,success,error){
        //  0.将对象转换成字符串
        var str = objToString(obj); 
        //  1.创建一个异步对象xmlhttp；
        var xmlhttp,timer; 
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest(); 
        } else{// code for IE6, IE5 
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); 
        }

        //  2.设置请求方式和请求地址； 
        // 判断请求的类型是POST还是GET
        if (type === 'GET') {
            xmlhttp.open(type,url+"?t=" +str,true);
        //  3.发送请求；
            xmlhttp.send();
        }else{
                xmlhttp.open(type,url,true);
                // 注意：在post请求中，必须在open和send之间添加HTTP请求头：setRequestHeader(header,value);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded"); 
            //  3.发送请求；
                xmlhttp.send(str);

        }   

        //  4.监听状态的变化；
        xmlhttp.onreadystatechange = function(){
            clearInterval(timer);
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp.status == 304) {
                    //  5.处理返回的结果；
                    success(xmlhttp);//成功后回调；
                }else{
                    error(xmlhttp);//失败后回调；
                }                   
            }
        }
    }

        //处理obj 
        function objToString(obj){
        obj.t = new Date().getTime();
        var res =[];
        for(var key in obj){
            //需要将key和value转成非中文的形式，因为url不能有中文。使用encodeURIComponent();
            res.push(encodeURIConponent(key) + " = " +encodeURIConponent(obj.[key]));
        }
        return res.join("&");
        }
        //判断外界是否传入了超时时间
        if(timeout){
            timer = setInterval(function(){
                xmlhttp.abort();//中断请求
                clearInterval(timer);
            },timeout);
        }
```

- 将原生ajax封装成Promise

```js
var myNewAjax=function(url){
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest();
        xhr.open('get',url);
        // 传递参数
        xhr.send(data);
        xhr.onreadystatechange=function(){
            if(xhr.status==200&&readyState==4){
                var json=JSON.parse(xhr.responseText);
                resolve(json)
            }else if(xhr.readyState==4&&xhr.status!=200){
                reject('error');
            }
        }
    })
}
```
### jquery中的ajax

```js
    $.ajax({
        url: "localhost:8080/travle/news/list",
        type: "GET",
        data: { page: $("#page").val(), limit: 5 },
        dataType: "JSON",
        success: function(result) {},
        error: function(){}
    });
```
```js
    $.ajax({
        url: "localhost:8080/travle/admin/login",
        type: "POST",
        data: {
        username: $("#username").val(),
        password: $("#password".val())
        },
        dataType: "JSON",
        success: function(result) {},
        error: function(){}
    })
```

### axios

- get请求
    ```js
    axios.get('url',{
        params:{
            id:'接口配置参数（相当于url?id=xxxx）'，
        },
    }).then(function(res){
        console.log(res);//处理成功的函数 相当于success
    }).catch(function(error){
        console.log(error)//错误处理 相当于error
    })
    ```
- post请求

    ```js
        axios.post('uel',{data:xxx},{
            headers:xxxx,
        }).then(function(res){
            console.log(res);//处理成功的函数 相当于success
        }).catch(function(error){
            console.log(error)//错误处理 相当于error
        })
    ```
- axios实现

    ```js
        // 执行返回一个promise对象
        // 能够通过create方法配置初始化参数
        // 包含所有的ajax的方法并返回promise对象
        // 支持peomise.all并能用spread处理
        (function () {
            function myAxios(options = {}) {
                myAxios.createDef = myAxios.createDef || {};
                myAxios._default = {
                    method: 'GET',
                    url: '',
                    baseURL: '',
                    cache: false,
                    data: null,
                    params: null,
                    headers: {},
                    dataType: 'JSON',
                }
                let {method,url,baseURL,cache,data,params,headers,dataType}={...myAxios._default, ...myAxios.createDef,...options};
                if (/^(get|delete|head|options)$/i.test(method)) {//get系列
                    if (params) {
                        url += /\?/g.test(url) ? '&' + myAxios.paramsSerializer(params) : '?' + myAxios.paramsSerializer(params);
                    }
                    if (cache === false) {
                        url += /\?/g.test(url) ? '&_=' + new Date() : '?_=' + new Date();
                    }
                } else {
                    if (data) {
                        data = myAxios.paramsSerializer(data);
                    }
                }
                ;
                return new Promise(function (resolve, reject) {
                    let xhr = new XMLHttpRequest();
                    xhr.open(method, `${baseURL}${url}`);
                    if (headers && typeof headers == 'object') {
                        for (let attr in headers) {
                            if (!headers.hasOwnProperty(attr)) {
                                let val = /[\u4e00-\u9fa5]/.test(headers[attr]) ? encodeURIComponent(headers[attr]) : headers[attr];
                                xhr.setRequestHeader(attr, val);
                            }
                        }
                    }
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if (/2\d{2}/.test(xhr.status)) {
                                let result = xhr.responseText;
                                dataType = dataType.toUpperCase();
                                dataType === 'JSON' ? result = JSON.parse(result) : (dataType === 'XML' ? result = xhr.responseXML : null);
                                resolve(result);
                            } else {
                                reject('error');
                            }
                        }
                    }
                    xhr.send(data);
                })
            };
            myAxios.paramsSerializer = function (params) {
                if (typeof params == 'string') {
                    return params;
                }
                if (!params) {
                    return null;
                }
                if (typeof params == 'object') {
                    let res = '';
                    for (let attr in params) {
                        res += `${attr}=${params[attr]}&`;
                    }
                    res = res.substring(0, res.length - 1);
                    return res;
                }
            };
            myAxios.all = function (data) {
                return Promise.all(data);
            };
            myAxios.spread = function (callback) {
                return function (arg) {
                    callback.apply(null, arg);
                }
            };
            myAxios.create = function (options) {
                if (options && typeof options == 'object') {
                    myAxios.createDef = options;
                }
            };

            ['get', 'delete', 'head', 'options'].forEach(item => {
                myAxios[item] = function (url, options = {}) {
                    options = {
                        ...options,
                        url: url,
                        method: item.toUpperCase()
                    };
                    return myAxios(options);
                }
            });
            ['post', 'put', 'patch'].forEach(item => {
                myAxios[item] = function (url, data = {}, options = {}) {
                    options = {
                        ...options,
                        url: url,
                        method: item.toUpperCase(),
                        data: data,
                    };
                    return myAxios(options);
                }
            });
        window.myAxios=myAxios;
        })()
    ```

### fetch

> Fetch被称为下一代Ajax技术,采用Promise方式来处理数据。是一种简洁明了的API，比XMLHttpRequest更加简单易用。

- fetch请求

    - get请求

    ```js
        fetch('https://api.myjson.com/bins/of6pw')
            .then(function(response) {
                return response.json();
        })
            .then(function(myJson) {
                console.log(myJson);
        });
    ```

    - post请求

    ```JS
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                name: "ceido",
                age: 100
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json))
    ```
fetch号称是AJAX的替代品，是在ES6出现的，使用了ES6中的promise对象。Fetch是基于promise设计的。Fetch的代码结构比起ajax简单多了，参数有点像jQuery ajax。但是，一定记住fetch不是ajax的进一步封装，而是原生js，没有使用XMLHttpRequest对象。

### ajax/axios/fetch 请求方式对比

对比下ajax和axios和fetch请求

- jquery的 ajax请求

```js
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: dataType,
        success: function () {},
        error: function () {}
    });
```

传统 Ajax 指的是 XMLHttpRequest（XHR）， 最早出现的发送后端请求技术，隶属于原始js中，核心使用XMLHttpRequest对象，多个请求之间如果有先后关系的话，就会出现回调地狱。

JQuery ajax 是对原生XHR的封装，除此以外还增添了对JSONP的支持。经过多年的更新维护，真的已经是非常的方便了，优点无需多言；如果是硬要举出几个缺点，那可能只有：

    1.本身是针对MVC的编程,不符合现在前端MVVM的浪潮
    2.基于原生的XHR开发，XHR本身的架构不清晰。
    3.JQuery整个项目太大，单纯使用ajax却要引入整个JQuery非常的不合理（采取个性化打包的方案又不能享受CDN服务）
    4.不符合关注分离（Separation of Concerns）的原则
    5.配置和调用方式非常混乱，而且基于事件的异步模型不友好。
- axios请求

axios 是一个基于Promise 用于浏览器和 nodejs 的 HTTP 客户端，本质上也是对原生XHR的封装，只不过它是Promise的实现版本，符合最新的ES规范，它本身具有以下特征：

    1.从浏览器中创建 XMLHttpRequest
    2.支持 Promise API
    3.客户端支持防止CSRF
    4.提供了一些并发请求的接口（重要，方便了很多的操作）
    5.从 node.js 创建 http 请求
    6.拦截请求和响应
    7.转换请求和响应数据
    8.取消请求
    9.自动转换JSON数据

    ```js
    axios({
        method: 'post',
        url: '/user/12345',
        data: {
            firstName: 'Fred',
            lastName: 'Flintstone'
        }
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
    ```

PS:防止CSRF:就是让你的每个请求都带一个从cookie中拿到的key, 根据浏览器同源策略，假冒的网站是拿不到你cookie中得key的，这样，后台就可以轻松辨别出这个请求是否是用户在假冒网站上的误导输入，从而采取正确的策略。

fetch的优点：

    1. 语法简洁，更加语义化
    2. 基于标准 Promise 实现，支持 async/await
    3. 同构方便，使用 [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)
    4. 更加底层，提供的API丰富（request, response）
    5. 脱离了XHR，是ES规范里新的实现方式


缺点：fetch是一个低层次的API，你可以把它考虑成原生的XHR，所以使用起来并不是那么舒服，需要进行封装。

    1. fetch只对网络请求报错，对400，500都当做成功的请求，服务器返回400，500错误码时并不会reject，只有网络错误这些导致请求不能完成时，fetch才会被reject。
    2. fetch默认不会带cookie，需要添加配置项： fetch(url, {credentials: 'include'})
    3. fetch不支持abort，不支持超时控制，使用setTimeout及Promise.reject的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费
    4. fetch没有办法原生监测请求的进度，而XHR可以。

fetch发送post请求的时候，总是发送2次，第一次状态码是204，第二次才成功？

原因很简单，因为你用fetch的post请求的时候，导致fetch第一次发送了一个Options请求，询问服务器是否支持修改的请求头，如果服务器支持，则在第二次中发送真正的请求。

总结：axios既提供了并发的封装，也没有fetch的各种问题，而且体积也较小，当之无愧现在最应该选用的请求的方式。

> 本文首次发布于 [SkioFox Blog](http://blog.skiofox.top), 作者 [SkioFox](https://github.com/LoverFancy/) ,转载请保留原文链接.a