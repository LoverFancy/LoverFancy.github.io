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

class Father{
    constructor(name){
        this.name = name;
    }
    sayName(){
        console.log(this.name);
    }
}
class Son extends Father{  //extents后面跟表示要继承的类型
    constructor(name, age){
        super(name);  //相当于以前的：Father.call(this, name);
        this.age = age;
    }
    //子类独有的方法
    sayAge(){
        console.log(this.age);
    }
    //子类中的方法会屏蔽到父类中的同名方法。
    sayName(){
        super.sayName();  //调用被覆盖的父类中的方法。 
        console.log("我是子类的方法，我屏蔽了父类：" + this.name);
    }
}

var son1 = new Son("李四", 30);
son1.sayAge();
son1.sayName();