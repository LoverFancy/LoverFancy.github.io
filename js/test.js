// 闭包
// var b;
// void function(){
    
//     var env = {b:1};
//     b = 2;
//     console.log("In function b:", b); // In function b: 2
//     with(env) {
//         // function环境中，并没有出现var b，这说明with内的var b作用到了function这个环境当中。
//         // var b = {} 这样一句对两个域产生了作用
//         var b = 3;
//         console.log("In with b:", b); // In with b: 3
//     }
// }();
// console.log("Global b:", b); // Global b: undefined

// 会产生let使用的作用域的语句：for/if/switch/try/catch/finally

// Realm

// var iframe = document.createElement('iframe')
// document.documentElement.appendChild(iframe)
// iframe.src="javascript:var b = {};"

// var b1 = iframe.contentWindow.b;
// var b2 = {};

// console.log(typeof b1, typeof b2); //object object

// console.log(b1 instanceof Object, b2 instanceof Object); //false true

// b1、 b2由同样的代码“ {} ”在不同的Realm中执行，所以表现出了不同的行为。

var b = 10;
(function b(){
    b = 20;
    console.log(b); // [Function: b]
})();