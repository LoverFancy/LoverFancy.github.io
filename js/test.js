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

// var b = 10;
// (function b(){
//     b = 20;
//     console.log(b); // [Function: b]
// })();
// function Animal (name) {

//     // 属性

//     this.name = name || 'Animal';

//     // 实例方法

//     this.sleep = function(){

//         console.log(this.name + '正在睡觉！');

//     }

// }

// // 原型方法

// Animal.prototype.eat = function(food) {

//     console.log(this.name + '正在吃：' + food);

// };
// function Cat(){ }
// // 子类的原型指向父类的实例
//     Cat.prototype = new Animal();
// // 重写子类的属性
//     Cat.prototype.name = 'cat';
// //　Test Code
// var cat = new Cat();
// console.log(cat.name); // cat
// console.log(cat.eat('fish')); // cat正在吃：fish
// console.log(cat.sleep()); // cat正在睡觉！
// console.log(cat instanceof Animal); //true
// console.log(cat instanceof Cat); //true

// var animal = new Animal();
// console.log(animal.name); // Animal
// console.log(animal.eat('fish')); // Animal正在吃：fish
// console.log(animal.sleep()); // Animal正在睡觉！

// function Person(name,sex){
//     this.name=name;
//     this.sex=sex;
//     this.friends = {lily:'female',lucy:'female'};
//     this.showFriends=function(){
//         var str = ''
//         for(i in this.friends){
//             str+=i +' '+this.friends[i] +',';
//         }
//         console.log('my friends:'+str);
//     }
// }
// Person.prototype.hello=function(){
//     console.log('hello:'+this.name);
// }

// var per1 =  new Person('A','male');
// per1.hello(); // hello:A
// per1.showFriends();// my friends:lily female,lucy female,


// function Student(className){
//     this.class = className;
// }

// Student.prototype = new Person('B','male');//原型继承将子对象的原型对象指向父对象的实例 ； 缺点：不能由子对象像父对象传递参数，

// var stu1 = new Student(1);//不能由子对象像父对象传递参数，
// stu1.name='C';
// stu1.hello();// hello:C
// stu1.friends.C = 'male';//2、对于引用型的属性修改之后会印象其他的实例对象；
// stu1.showFriends();//2、对于引用型的属性修改之后会印象其他的实例对象；
// // my friends:lily female,lucy female,C male,
// console.log(stu1 instanceof Student); // true
// console.log(stu1 instanceof Person); // true

// var stu2 = new Student(2);
// stu2.name='D';
// stu2.hello(); // hello:D
// stu2.showFriends();//2、对于引用型的属性修改之后会印象其他的实例对象；
// // my friends:lily female,lucy female,C male,
// console.log(stu2 instanceof Student); // true
// console.log(stu2 instanceof Person); // true

//构造函数继承
// function Teacher(name,sex,type){
//     this.type=type;
//     Person.call(this,name,sex);
// }

// var tea1 = new Teacher('E','female','数学');
// //tea1.hello(); //报错没有继承到原型上的方法
// tea1.friends.F = 'male';
// tea1.showFriends();

// var tea2 = new Teacher('G','male','语文');
// tea2.friends.H = 'male';
// tea2.showFriends();
// console.log(tea2 instanceof Teacher);
// console.log(tea2 instanceof Person);

// class Father{
//     constructor(name){
//         this.name = name;
//     }
//     sayName(){
//         console.log(this.name);
//     }
// }
// class Son extends Father{  //extents后面跟表示要继承的类型
//     constructor(name, age){
//         super(name);  //相当于以前的：Father.call(this, name);
//         this.age = age;
//     }
//     //子类独有的方法
//     sayAge(){
//         console.log(this.age);
//     }
// }

// var son1 = new Son("李四", 30);
// son1.sayAge(); // 30
// son1.sayName(); // 李四
// console.log(son1 instanceof Son);  // true
// console.log(son1 instanceof Father);  //true

// class Father{
//     constructor(name){
//         this.name = name;
//     }
//     sayName(){
//         console.log(this.name);
//     }
// }
// class Son extends Father{  //extents后面跟表示要继承的类型
//     constructor(name, age){
//         super(name);  //相当于以前的：Father.call(this, name);
//         this.age = age;
//     }
//     //子类独有的方法
//     sayAge(){
//         console.log(this.age);
//     }
//     //子类中的方法会屏蔽到父类中的同名方法。
//     sayName(){
//         super.sayName();  //调用被覆盖的父类中的方法。 
//         console.log("我是子类的方法，我屏蔽了父类：" + this.name);
//     }
// }

// var son1 = new Son("李四", 30);
// son1.sayAge();
// son1.sayName();

// let data = { price: 5, quantity: 2 }
// let target = null
// class Dep {
//     constructor () {
//         this.subscribers = []
//     }
// depend () {
//     if (target && !this.subscribers.includes(target)) {
//         this.subscribers.push(target) 
//     }
// }
// notify () {
//     this.subscribers.forEach(sub => sub())
// }
// }
// Object.keys(data).forEach(key => {
//     let internalValue = data[key]

//     const dep = new Dep()

//     Object.defineProperty(data, key, {
//         // 对象方法的简写形式
//         get() {
//             dep.depend()
//             return internalValue
//         },
//         set(newVal) {
//             internalValue = newVal
//             dep.notify()
//         }
//     })
// })
// function watcher(myFun) {
//     target = myFun
//     target()
//     target = null
// }
// watcher(() => {
//     data.total = data.price * data.quantity
// })
// console.log("total = " + data.total)
// data.price = 20
// console.log("total = " + data.total)
// data.quantity = 10
// console.log("total = " + data.total)
// let data = { price: 5, quantity: 2 }
// let deps = new Map(); // 创建一个Map对象
// // Dep class并不需要改动。单纯使用Proxy替换Object.defineProperty
// class Dep {
//     constructor () {
//         this.subscribers = []
//     }
//     depend () {
//         if (target && !this.subscribers.includes(target)) {
//             this.subscribers.push(target)
//         }
//     }
//     notify () {
//         this.subscribers.forEach(sub => sub())
//     }
// }
// Object.keys(data).forEach(key => {
//     // 为每个属性都设置一个依赖实例并放入deps 中
//     deps.set(key, new Dep());
// });
// let data_without_proxy = data; // 保存源对象
// data = new Proxy(data_without_proxy, {
// // 重写数据以在中间创建一个代理
//     get(obj, key) {
//         deps.get(key).depend(); // <-- 依旧为存储target
//         return obj[key]; // 返回原始数据
//     },
//     set(obj, key, newVal) {
//         obj[key] = newVal; // 将原始数据设置为新值
//         deps.get(key).notify(); // <-- 依旧为重新运行已存储的target
//         return true;
//     }
// });
// function watcher(myFun) {
//     target = myFun
//     target()
//     target = null
// }
// watcher(() => {
//     total = data.price * data.quantity;
// });
// console.log("total = " + total);
// data.price = 20;
// console.log("total = " + total);
// data.quantity = 10;
// console.log("total = " + total);

// let data = { price: 5, quantity: 2 };
//     let target = null;
//     class Dep {
//         constructor() {
//             this.subscribers = [];
//         }
//         depend() {
//             if (target && !this.subscribers.includes(target)) {
//                 this.subscribers.push(target);
//             }
//         }
//         notify() {
//             this.subscribers.forEach(sub => sub());
//         } 
//     }
//     // 前边的代码都没变
//     let deps = new Map(); // 创建一个Map对象
//     Object.keys(data).forEach(key => {
//     // 为每个属性都设置一个依赖实例 并放入 deps 中
//         deps.set(key, new Dep());
//     });
//     let data_without_proxy = data; // 保存源对象
//     data = new Proxy(data_without_proxy, {
//     // 重写数据以在中间创建一个代理
//         get(obj, key) {
//             deps.get(key).depend(); // <-- 依旧为存储target
//             return obj[key]; // 返回原始数据
//         },
//         set(obj, key, newVal) {
//             obj[key] = newVal; // 将原始数据设置为新值
//             deps.get(key).notify(); // <-- 依旧为重新运行已存储的targets
//             return true;
//         }
//     });
//     // 用来监听具有响应性属性的代码
//     function watcher(myFunc) {
//         target = myFunc;
//         target();
//         target = null;
//     }
//     let total = 0
//     watcher(() => {
//         total = data.price * data.quantity;
//     });
//     console.log("total = " + total); 
//     data.price = 20;
//     console.log("total = " + total);
//     data.quantity = 10;
//     console.log("total = " + total);
//     // 为dep添加一个新属性,存储依赖到Map中
//     deps.set('discount', new Dep()) 
//     // 添加不存在data中的属性
//     data['discount'] = 5;
//     let salePrice = 0;
//     // 添加监听,会增加target 对其进行监听，其中包括我们新添加的属性
//     watcher(() => {
//         salePrice = data.price - data.discount;
//     });
//     console.log("salePrice = " + salePrice); 
//     data.discount = 7.5 // 此时就会调用我们的监听函数，达到响应式的目的
//     console.log("salePrice = " + salePrice);

// var user = {
//     id: 0,
//     name: 'Brendan Eich',
//     title: 'Mr.'
// };

// // 创建用户的greeting
// function updateGreeting() {
//     user.greeting = 'Hello, ' + user.title + ' ' + user.name + '!';
// }
// updateGreeting();

// Object.observe(user, function(changes) {
//     changes.forEach(function(change) {
//         // 当name或title属性改变时, 更新greeting
//         if (change.name === 'name' || change.name === 'title') {
//             updateGreeting();
//         }
//     });
// });

// setTimeout(function(){console.log(1)},0);
// new Promise(function(resolve,reject){
//     // 同步操作
//     console.log(2);
//     // 传参给成功的函数 
//     // resolve(3); // 2,7,6,4,5,1
//     // 加入延时 2,7,6,1,5,5
//     // setTimeout(()=>{
//     //     resolve(4)
//     // },0)
//     // resolve(); // 2,7,6,NaN,5,1
//     // reject("error") // 2,7,6,error,1
//     // 没有上面resolve，reject的代码直接执行2，7，6，1,因为pending状态无法改变
// }).then(function(value){console.log(value+1) // resolve时执行
// }).then(function(){console.log(5)// resolve时执行
// }).catch(function(error){
//     console.log(error)
// })
// // process.nextTick方法指定的回调函数，总是在当前”执行栈”的尾部触发
// process.nextTick(function(){console.log(6)});
// // 同步
// console.log(7);

// function myPromise(constructor){
//     let self=this;
//     self.status="pending" //定义状态改变前的初始状态
//     self.value=undefined;//定义状态为resolved的时候的状态
//     self.reason=undefined;//定义状态为rejected的时候的状态
//     function resolve(value){
//         //两个==="pending"，保证了状态的改变是不可逆的
//         if(self.status==="pending"){
//             self.value=value;
//             self.status="resolved";
//         }
//     }
//     function reject(reason){
//         //两个==="pending"，保证了状态的改变是不可逆的
//         if(self.status==="pending"){
//             self.reason=reason;
//             self.status="rejected";
//         }
//     }
//     //捕获构造异常
//     try{
//         constructor(resolve,reject);
//     }catch(e){
//         reject(e);
//     }
// }
// // 在myPromise的原型上定义链式调用的then方法
// myPromise.prototype.then=function(onFullfilled,onRejected){
//     let self=this;
//     switch(self.status){
//         case "resolved":
//             onFullfilled(self.value);
//             break;
//         case "rejected":
//             onRejected(self.reason);
//             break;
//         default:       
//     }
// }
// // 上述就是一个初始版本的myPromise，在myPromise里发生状态改变，然后在相应的then方法里面根据不同的状态可以执行不同的操作。

// var p=new myPromise(function(resolve,reject){resolve(1)});
// p.then(function(x){console.log(x)}) // 1

// function sleep(ms){
//     var start=Date.now(),expire=start+ms;
//     while(Date.now()<expire);
//     console.log('1111');
//     return;
// }
// sleep(1000);

// function sleep(ms){
//     var temple=new Promise((resolve)=>{
//         console.log(111);
//         setTimeout(resolve,ms)
//     });
//     return temple
// }
// sleep(2000).then(function(){
//     console.log(222)
// })

// function sleep(ms){
//     return new Promise((resolve)=>setTimeout(resolve,ms));
// }
// // async函数必需返回一个promise
// async function test(){
//     // await 后面必需是个异步任务，等待异步任务返回promise结果
//     var temple=await sleep(1000);
//     console.log(1111)
//     return temple
// }
// test();

// function* sleep(ms){
//     yield new Promise(function(resolve,reject){
//         console.log(111);
//         setTimeout(resolve,ms);
//     })
// }
// sleep(2000).next().value.then(function(){console.log(2222)})

// RegExp.prototype.clone = function() {
//     var pattern = this.valueOf();
//     console.log(pattern);
//     var flags = '';
//     flags += pattern.global ? 'g' : '';
//     flags += pattern.ignoreCase ? 'i' : '';
//     flags += pattern.multiline ? 'm' : '';
//     return new RegExp(pattern.source, flags);
// };
// var reg=new RegExp('/111/');
// console.log(reg.clone());

// function unique(arr) {
//     var obj = {};
//     // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
//     return arr.filter(function(item, index, arr){
//         // console.log(obj.hasOwnProperty(typeof item + item))
//         // console.log(obj[typeof item + item] = true)
//         return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
//     })
// }
//     var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
//         console.log(unique(arr))
// //[1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}]   //所有的都去重了
// function unique(arr) {
//     var array= arr;
//     var len = array.length;

//     array.sort(function(a,b){   //排序后更加方便去重
//         return a - b;
//     })

//     function loop(index){
//         if(index >= 1){
//             if(array[index] === array[index-1]){
//                 array.splice(index,1);
//             }
//             loop(index - 1);    //递归loop，然后数组去重
//         }
//     }
//     loop(len-1);
//     return array;
// }
// var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
// console.log(unique(arr))
// function arrayNonRepeatfy(arr) {
//     // 空Map数据结构，遍历需要去重的数组，把数组的每一个元素作为key存到Map中。由于Map中不会出现相同的key值，所以最终得到的就是去重后的结果。
//     let map = new Map();
//     let array = new Array();  // 数组用于返回结果
//     for (let i = 0; i < arr.length; i++) {
//             if(map.has(arr[i])) {  // 如果有该key值
//             map.set(arr[i], true); 
//         } else { 
//             map.set(arr[i], false);   // 如果没有该key值
//             array.push(arr[i]);
//         }
//     } 
//     return array ;
// }
// var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
// console.log(arrayNonRepeatfy(arr))

// function unique(arr){
//     return arr.sort().reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
// }
// var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
// console.log(unique(arr));

// function unique (arr) {
//     return Array.from(new Set(arr))
//     // 更简练的写法
//     // return [...new Set(arr)]
// }
// var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
// console.log(unique(arr))

// class PromiseM {
//     constructor (process) {
//         this.status = 'pending'
//         this.msg = ''
//         process(this.resolve.bind(this), this.reject.bind(this))
//         console.log(this)
//         return this
//     }
//     resolve (val) {
//         this.status = 'fulfilled'
//         this.msg = val
//     }
//     reject (err) {
//         this.status = 'rejected'
//         this.msg = err
//     }
//     then (fufilled, reject) {
//         if(this.status === 'fulfilled') {
//             fufilled(this.msg)
//         }
//         if(this.status === 'rejected') {
//             reject(this.msg)
//         }
//     }
// }

// var mm=new PromiseM(function(resolve,reject){
//         resolve('123');
//     });
//     mm.then(function(success){
//         console.log(success);
//     },function(){
//         console.log('fail!');
//     });

// var arr = ['old', 1, true, ['old1', 'old2'], {old: 1,new:{new:12}}]
// var new_arr = JSON.parse( JSON.stringify(arr) );
// console.log(new_arr);
// var a = {value: 1}
// function getValue(name, age) {
//     console.log('arguments in fn = ', arguments)
//     console.log(name, age)
//     console.log(this.value)
// }
// getValue.call(a,'yandong1', 17)
// let bindFoo = getValue.bind(a, 'testBind', 45)
// console.log('bindFoo = ',bindFoo)
// bindFoo()
// getValue.apply(a,['yandong2', 18])
// var returnedFunc = getValue.bind(a,'yandong3', 19)
// console.log(returnedFunc)
// returnedFunc()
 var array1 = [5,7,1,9,4,6,2,12,3,8]
// function flatten(arr) {
//     return arr.toString().split(',').map(function(item){
//         console.log(+item)
//         return +item
//     })
// }
// function flatten(arr) {
//     return arr.reduce(function(prev, next){
//         console.log(prev,next)
//         return prev.concat(Array.isArray(next) ? flatten(next) : next)
//     }, [])
// }
// console.log(array1.toString().split(','))
// console.log(flatten(array1))

// let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

// let nameNum = names.reduce((pre,cur)=>{
//   if(cur in pre){
//     pre[cur]++
//   }else{
//     pre[cur] = 1 
//   }
//   console.log(pre,pre[cur])
//   return pre
// },{})
// console.log(nameNum); //{Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}
// console.log(array1)
// console.log(...array1)
// function bubbleSort(array) {
//     const length = array.length;
//     for (let i = 0; i < length; i++) {
//         for (let j = 0; j < length - 1 - i; j++) {
//             console.log(array)
//             console.log(array[j],array[j+1])
//             if (array[j] > array[j + 1]) {      
//            let temp = array[j + 1];
//                 array[j + 1] = array[j];
//                 array[j] = temp;
//             }
//         }
//     }
//     return array;
// }
// console.log(bubbleSort(array1))
// function insertionSort(array) {
//     for (let i = 1; i < array.length; i++) {
//         let key = array[i], left = 0, right = i - 1;
//         while (left <= right) {
//             let middle = parseInt((left + right) / 2);
//             if (key < array[middle]) {
//                 right = middle - 1;
//             } else {
//                 left = middle + 1;
//             }
//         }
//         for (let j = i - 1; j >= left; j--) {
//             // console.log(left,right)
//             array[j + 1] = array[j];
//             // console.log(array)
//         }
//         array[left] = key;
//     }
//     return array;
// }
// console.log(insertionSort(array1))

var getSingle = function (fn) { // 创建单例方法
    var result // 通过闭包保存创建过的对象
    console.log(this)
    return function () {
        console.log(this)
        return result || (result = fn.apply(this, arguments))
    }
}

var createPerson = getSingle(function (name) {
    return {name: name}
})

var person1 = createPerson('张三')
var person2 = createPerson('李四')

// console.log(person1, person2);  // {name: '张三'} {name: '张三'}