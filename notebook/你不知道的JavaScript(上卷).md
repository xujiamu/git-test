# 第一部分 作用域和闭包

## 第1章 作用域是什么

-  几乎所有编程语言最基本的功能之一，就是能够储存变量当中的值，并且能在之后对这个值进行访问或修改
- 因此需要一套设计良好的规则来存储变量，并且之后可以方便地找到这些变量。这套规则被称为作用域

### 编译原理

**程序中的一段源代码在执行之前会经历三个步骤，统称为“编译”**

- 分词/词法分析（Tokenizing/Lexing）
  - 这个过程会将由字符分解成（对编程语言来说）有意义的代码块，这些代码块被称为词法单元（token）。
  - 如，考var a = 2;。这段程序通常会被分解成为下面这些词法单元：var、a、=、2 、;。空格是否会被当作词法单元，取决于空格在这门语言中是否具有意义。
- 解析/语法分析（Parsing）
  - 将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“抽象语法树”（Abstract Syntax Tree,AST）。
  - var a = 2；的抽象语法树中可能会有一个叫作VariableDeclaration的顶级节点，接下来是一个叫作Identifier（它的值是a）的子节点，以及一个叫作AssignmentExpression的子节点。AssignmentExpression节点有一个叫作NumericLiteral（它的值是2）的子节点。
- 代码生成
  - 将AST转换为可执行代码的过程被称为代码生成
  - 简单来说就是有某种方法可以将var a = 2；的AST转化为一组机器指令，用来创建一个叫作a的变量（包括分配内存等），并将一个值储存在a中。

与其他语言不同，JavaScript的编译过程不在构建之前，大部分情况下**编译发生在代码执行前的几微秒**（甚至更短！）的时间内。JavaScript引擎用尽了各种办法（比如JIT，可以延迟编译甚至实施重编译）来保证性能最佳

### 理解作用域

**名词介绍**

- 引擎
  - 从头到尾负责整个JavaScript程序的编译及执行过程。
-  编译器
  - 负责语法分析及代码生成。
-  作用域 
  - 负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

`var a = 2 ` 的处理过程

​	1．遇到var a，编译器会询问作用域是否已经有一个该名称的变量存在于同一个作用域的集合中。如果是，编译器会忽略该声明，继续进行编译；否则它会要求作用域在当前作用域的集合中声明一个新的变量，并命名为a。

2．接下来编译器会为引擎生成运行时所需的代码，这些代码被用来处理a = 2这个赋值操作。引擎运行时会首先询问作用域，在当前的作用域集合中是否存在一个叫作a的变量。如果是，引擎就会使用这个变量；如果否，引擎会继续查找该变量（查看1.3节）。如果引擎最终找到了a变量，就会将2赋值给它。否则引擎就会抛出一个异常！

**总结**：变量的赋值操作会执行两个动作，首先编译器会在当前作用域中声明一个变量（如果之前没有声明过），然后在运行时引擎会在作用域中查找该变量，如果能够找到就会对它赋值。

**引擎查找变量的方式**

- 共有两种 LHS查询 与 RHS 查询
  - LHS查询是试图找到变量的容器本身，从而可以对其赋值
  - RHS查询与简单地查找某个变量的值别无二致
  - 当变量出现在赋值操作的左侧时进行LHS查询，出现在非左侧时进行RHS查询

```JS
// RHS
console.log(a)
// LHS
a = 2


// 注： 这里的函数声明 funciton foo 是编译阶段直接声明的，所以函数声明不是LHS查询, 但函数表达式 如： var foo = function() 是LHS查询
// 隐式赋值a = 2 LHS
function foo(a) {
    // RHS
    console.log(a) // 2
}
// 查找foo函数并执行 RHS
foo(2)
```

### 作用域嵌套

- 当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。因此，在当前作用域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量，或抵达最外层的作用域（也就是全局作用域）为止。
- 如下：对b进行的RHS引用无法在函数foo内部完成，但可以在上一级作用域（在这个例子中就是全局作用域）中完成。

```js
function foo (a) {
    console.log(a + b)
}
var b = 2
foo(2) // 4
```

### 异常

- 为什么要区分LHS和RHS
  - 因为在变量还没有声明（在任何作用域中都无法找到该变量）的情况下，这两种查询的行为是不一样的
    - 如果RHS查询在所有嵌套的作用域中遍寻不到所需的变量，引擎就会抛出ReferenceError异常
      - 如果RHS查询找到了一个变量，但是你尝试对这个变量的值进行不合理的操作，比如试图对一个非函数类型的值进行函数调用，或者引用null或undefined类型的值中的属性，那么引擎会抛出另外一种类型的异常 TypeError。
      - ReferenceError同作用域判别失败相关，而TypeError则代表作用域判别成功了，但是对结果的操作是非法或不合理的。
    - 当引擎执行LHS查询时，如果在顶层（全局作用域）中也无法找到目标变量，全局作用域中就会创建一个具有该名称的变量，并将其返还给引擎，前提是程序运行在非“严格模式”下。
      - 严格模式下也会抛出异常

```js
function foo(a) {
    // RHS
    // console.log(a + b)  // ReferenceError 错误
    // LHS
    b = a  // 非严格模式下，在全局作用域创建变量
}
foo(2)
```

## 第2章 词法作用域

- 作用域共有两种： 词法作用域 与 动态作用域 ， js采用词法作用域

### 词法阶段

- 词法作用域就是定义在词法阶段的作用域， 是由写代码时将变量和块作用域写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变（大部分情况下是这样的）

> 后文会介绍一些欺骗词法作用域的方法，这些方法在词法分析器处理过后依然可以修改作用域

有以下代码

```js
function foo(a) {
    var b = a * 2
    function bar(c) {
        console.log(a, b, c)
    }
    bar(b * 3)
}
foo(2) // 2, 4, 12
```

对应作用域：

![img](./img/作用域.png)

❶ 包含着整个全局作用域，其中只有一个标识符：foo。

❷ 包含着foo所创建的作用域，其中有三个标识符：a、bar和b。

❸ 包含着bar所创建的作用域，其中只有一个标识符：c。

> 作用域气泡由其对应的作用域块代码写在哪里决定，它们是逐级包含的, 没有任何函数的气泡可以（部分地）同时出现在两个外部作用域的气泡中，就如同没有任何函数可以部分地同时出现在两个父级函数中一样

- 作用域查找会在找到第一个匹配的标识符时停止。在多层的嵌套作用域中可以定义同名的标识符，这叫作“遮蔽效应”
- 全局变量会自动成为全局对象（比如浏览器中的window对象）的属性，因此可以不直接通过全局对象的词法名称，而是间接地通过对全局对象属性的引用来对其进行访问

```js
var a = '5'
// 等同于
window.a
```

- 非全局的变量如果被遮蔽了，无论如何都无法被访问到
- **无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。**
- 词法作用域查找只会查找一级标识符，比如代码中引用了foo.bar.baz，词法作用域查找只会试图查找foo标识符，找到这个变量后，对象属性访问规则会分别接管对bar和baz属性的访问。

### 欺骗词法

- JavaScript中有两种机制能在运行时来“修改”（也可以说欺骗）词法作用域

#### eval

- JavaScript中的eval(..)函数可以接受一个字符串为参数,并将字符串的内容当做代码来运行

如:

```js
// eval(..)调用中的"var b = 3; "这段代码会被当作本来就在那里一样来处理。由于代码声明了一个新的变量b，因此它对已经存在的foo(..)的词法作用域进行了修改
function foo(str, a) {
    eval(str) // 欺骗
    console.log(a, b)
}
var b = 2
foo("var b = 3", 1) // 1,3
```

> 实际情况中，可以根据程序逻辑动态地将字符拼接在一起之后再传递进去

-  在严格模式的程序中，eval(..)在运行时有其自己的词法作用域，意味着其中的声明无法修改所在的作用域。

```js
function foo(str) {
    "use strict"
    eval(str) 
    console.log(a) // ReferenceError: a is not defined
}
foo("var a = 3") 
```

- js中与eval相似的功能
  - setTimeout 和 setInterval 第一个参数可以是字符串,字符串的内容会被解释为动态生成的代码执行
  - new Function(..)函数的行为也很类似，最后一个参数可以接受代码字符串，并将其转化为动态生成的函数（前面的参数是这个新生成的函数的形参）

#### with

- with通常被当作重复引用同一个对象中的多个属性的快捷方式，可以不需要重复引用对象本身

```js
var obj = {
    a: 1,
    b: 2,
    c: 3
}
// 正常写法
obj.a = 2
obj.b = 3
obj.c = 4
// 通过with的快捷方式
with(obj) {
    a = 3
    b = 4
    c = 5
}
```

- 然而在使用中可能会出现以下情况

```js
function foo(obj) {
    with(obj) {
        a = 2
    }
}
var obj1 = {a:3}, obj2 = {b:1}
foo(obj1)
console.log(obj1.a) //2
foo(obj2)
// obj2.a 并没有赋值成功， a反而泄漏到了全局作用域
console.log(obj2.a) // undefined
console.log(a) // 2
```

- 原因说明：
  - 当我们传递obj1给with时，**with所声明的作用域是obj1**，而这个作用域中含有一个同obj1.a属性相符的标识符。
  - 但当我们将o2作为作用域时，其中并没有a标识符，因此进行了正常的LHS标识符查找。**o2的作用域**、**foo(..)的作用域**和**全局作用域中都没有找到标识符a**，因此当a=2执行时，**自动创建**了一个**全局变量**（因为是非严格模式）。

- 尽管with块可以将一个对象处理为词法作用域，但是这个块内部正常的var声明并不会被限制在这个**块的作用域**中，而是被添加到with所处的函数作用域中。（赋值会被限制）

```js
// 这里使用了var ，可以发现声明的变量被提前到了函数作用域中, with与es6的块作用域类似
function foo(obj) {
    with(obj) {
       var a = 2
    }
    console.log(a); // undefined
}
var obj1 = {a:3}, obj2 = {b:1}
foo(obj1)
console.log(obj1.a) //2
//不使用时var 时就不会提前，从而抛出异常
function foo(obj) {
    with(obj) {
        a = 2
    }
    console.log(a); // ReferenceError: a is not defined
}
var obj1 = {a:3}, obj2 = {b:1}
foo(obj1)
console.log(obj1.a) //由于出现异常，此处未执行
```

> eval(..)函数如果接受了含有一个或多个声明的代码，就会修改其所处的词法作用域，而with声明实际上是根据你传递给它的对象凭空创建了一个全新的词法作用域。

> 严格模式下 with被完全禁止

### 性能

- JavaScript引擎会在编译阶段进行数项的性能优化。其中有些优化依赖于能够根据代码的词法进行静态分析，并预先确定所有变量和函数的定义位置，才能在执行过程中快速找到标识符。
- 但如果引擎在代码中发现了eval(..)或with，因为无法在词法分析阶段明确知道eval(..)会接收到什么代码，这些代码会如何对作用域进行修改，也无法知道传递给with用来创建新词法作用域的对象的内容到底是什么， 所有的优化可能都是无意义的
- 因此如果代码中大量使用eval(..)或with，那么运行起来一定会变得非常慢

## 第3章 函数作用域和块作用域

### 函数中的作用域

- 函数作用域的含义是指，属于这个函数的全部变量都可以在整个函数的范围内使用及复用（事实上在嵌套的作用域中也可以使用）

- 示例

```js
// bar(..)拥有自己的作用域气泡。全局作用域也有自己的作用域气泡，它只包含了一个标识符：foo
function foo(a) {
    var b = 2
    function bar() {
        //...
    }
    c = 3
}

// 所以在全局中只能访问foo
foo(2)
// 访问其他会报错
bar() // 失败
console.log(a,b,c) // 三个都失败
```

### 隐藏内部实现

- 为什么“隐藏”变量和函数是一个有用的技术？
  - 最小授权或最小暴露原则。这个原则是指在软件设计中，应该最小限度地暴露必要内容，而将其他内容都“隐藏”起来，比如某个模块或对象的API设计
  - 如果所有变量和函数都在全局作用域中, 会破坏前面提到的最小特权原则，因为可能会暴漏过多的变量或函数，而这些变量或函数本应该是私有的

- 例

```js
function doSomething(a) {
    b = a + doSomethingElse(a * 2)
    console.log(b * 3)
}
function doSomethingElse(a) {
    return a - 1
}
var b
doSomething(2) //15
// 上面的代码 doSomethingElse 完全可以作为 doSomething的私有内容，而不应暴露在外

function doSomething(a) {
    function doSomethingElse(a) {
        return a - 1
    }
    var b
    b = a + doSomethingElse(a * 2)
    console.log(b * 3)
}
doSomething(2) //15
```

**规避冲突**

- 避免同名表示符导致的冲突

```js
function foo() {
    function bar(a) {
        // 因为这里的i 和foo中的i 同名，导致会修改for循环中i的值， 造成无限循环 ，而如果这里写var i = 3 遮蔽变量，就不会产生问题
        i = 3 
        console.log(a + i)
    }
    for (var i = 0; i < 10; i++) {
        bar(i * 2) // 无限循环
    }
}
foo()
```

**全局作用域中产生的冲突**

- 当程序中加载了多个第三方库时，如果它们没有妥善地将内部私有的函数或变量隐藏起来，就会很容易引发冲突

*全局解决方式*

1. 全局命名空间

   1. 通常会在全局作用域中声明一个名字足够独特的变量，通常是一个对象。这个对象被用作库的命名空间，所有需要暴露给外界的功能都会成为这个对象（命名空间）的属性，而不是将自己的标识符暴露在顶级的词法作用域中

   2. ```js
      var MySpecialObj = {
          name: 'zhangsan',
          doSomething:function() {
              //...
          }
      }
      ```

2. 模块管理

   1. 在众多模块管理器中挑选一个来使用 （如es6的模块）。使用这些工具，任何库都无需将标识符加入到全局作用域中，而是通过依赖管理器的机制将库的标识符显式地导入到另外一个特定的作用域中

### 函数作用域

- 如下所示，函数作用域中，函数名会污染所在作用域，并且只能显示的通过函数名来调用

```js
var = 2
function foo() {
    var a = 3
    console.log(a) // 3
}
foo() 
console.log(a) // 2
```

- 解决上面两个问题，可以通过下面的IIFE写法

```js
var a = 2;
(function foo() {
    var a = 3
    console.log(a) // 3
})()
console.log(a) // 2
```

- 上述写法中， 函数会被当作函数表达式而不是一个标准的函数声明来处理(如果function是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式)
- 函数声明和函数表达式之间最重要的区别是它们的名称标识符将会绑定在何处
  - (function foo(){ .. })作为函数表达式意味着foo只能在．．所代表的位置中被访问，外部作用域则不行，因此不会污染外部作用域

#### 匿名和具名

```js
setTimeout(function (){
    console.log('1 second')
}, 1000)
```

- 上边的代码就使用了匿名函数表达式，因为function().．没有名称标识符。函数表达式可以是匿名的，而函数声明则不可以省略函数名
- 匿名函数表达式的缺点
  - 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难。
  - 如果没有函数名，当函数需要引用自身时只能使用arguments.callee引用 （使用它时this可能会不同，比如在全局作用域中调用函数,此时this是全局对象，函数内部通过 arguments.callee递归调用，此时this就不再是全局对象）
  - 匿名函数省略了对于代码可读性/可理解性很重要的函数名。一个描述性的名称可以让代码不言自明。

*具名*

- 给函数表达式命名可以有效解决以上问题，始终给函数表达式命名是一个最佳实践

```js
setTimeout(function timeoutHandler(){
    console.log('1 second')
}, 1000)
```

#### 立即执行函数表达式

上文中我们使用了IIFE的方式，解决了函数作用域的两个问题

- IIFE，代表立即执行函数表达式（Immediately Invoked Function Expression）；
  - 函数被包含在一对()括号内部，因此成为了一个表达式，通过在末尾加上另外一个()可以立即执行这个函数

- 函数名对于IIFE不必须可省略

```js
var a = 2;
(function() {
    var a = 3
    console.log(a) //3
})()
console.log(a) // 2
```

- 也可以传递参数

```js
var a = 2;
(function(global) {
    var a = 3
    console.log(a) //3
    console.log(global.a) //2
})(window)
console.log(a) // 2
```

- 可以解决undefined标识符被错误覆盖导致的异常

```js
undefined  = true; // 绝对不要这样做
(function(undefined) {
    var a 
    // 这里的undefined没有受外面错误赋值的影响
    if (a === undefined) {
        console.log('undefined is safe here')
    }
})() // 不传值
```

- IIFE还有一种变化的用途是倒置代码的运行顺序，将需要运行的函数放在第二位， 这种模式在UMD项目中被广泛使用

```js
var a = 2
;(function(def) {
    def(window)
})(function def(gloabl) {
    var a = 3
    console.log(a)
    console.log(gloabl.a)
})
// 注意:作为参数传入的函数表达式，在全局作用域是无法调用的，如def() ，报错
```

### 块作用域

- 也就是`{...}`作用域

- 常见的块作用域

  - with
  - try/catch

  ```js
  try {
      undefined() // 制造异常
  } catch(err) {
      console.log(err)
  }
  console.log(err) // 报错 err在外部不能访问
  ```

  - es6中的 let, const

  **在垃圾收集中的作用**

  ```js
  function process(data) {
      //..
  }
  var someReallyBigData = {
      //...
  }
  process(someReallyBigData)
  
  var btn = document.getElementById('btn')
  btn.addEventListener('click', function cilck (evt) {
      console.log('btn click')
  })
  
  ```

  - click函数的点击回调并不需要someReallyBigData变量。
    - 理论上这意味着当process(..)执行后，在内存中占用大量空间的数据结构就可以被垃圾回收了。
    - 但是，由于click函数形成了一个覆盖整个作用域的闭包，JavaScript引擎极有可能依然保存着这个结构（取决于具体实现）。
    - 块作用域可以打消这种顾虑，可以让引擎清楚地知道没有必要继续保存someReallyBigData了,代码如下：

  ```js
  function process(data) {
      //..
  }
  // 在块中的内容运行完毕后被销毁
  {
  let someReallyBigData = {
      //...
  }
  process(someReallyBigData)
  }
  
  var btn = document.getElementById('btn')
  btn.addEventListener('click', function cilck (evt) {
      console.log('btn click')
  })
  ```

  **在for循环中使用**

  ```js
  for (let i = 0; i < 5; i++) {
      console.log(i)
  }
  // 外部无法访问
  console.log(i) // 报错
  ```

## 第4章 提升

- 包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理,先声明后赋值
  - 当你看到var a = 2；时，可能会认为这是一个声明。但JavaScript实际上会将其看成两个声明：var a；和a = 2;。第一个定义声明是在编译阶段进行的。第二个赋值声明会被留在原地等待执行阶段

```JS
a = 2
var a
console.log(a) // 2

// 等同于
var a
a = 2
console.log(a) // 2
```

```js
console.log(a) // undefined
var a = 2
// 等同于
var a
console.log(a)
a = 2
```

- 函数作用域也会进行提升操作

```js
foo()
function foo() {
    console.log(a) // undefined
    var a = 2 
}
//等同于
function foo() {
    var a
    console.log(a) // undefined
    a = 2
}
foo()

// 函数表达式不会被提升
foo() // 不是ReferenceError, 而是TypeError, 因为foo 标识符被提升了，函数未提升 所以是TypeError
bar() // ReferenceError,bar在函数内部作用域，更没有提升
var foo = function bar() {
    
}
// 等同于
var foo
foo() //TypeError
bar() //ReferenceError
foo = function() {
    var bar = ...self..
    //...
}

```

- 函数声明和变量声明同时存在时，优先提升函数声明，重复的var声明会被忽略掉，但是函数声明后面会覆盖前面

```js
// 函数优先
foo() // 1
function foo() {
    console.log(1)
}
var foo = function() {
    console.log(2)
}
// 声明虽然被忽略，但执行时，赋值不会被忽略
foo() // 2 
```

```js
// 后面函数声明覆盖前面
foo() // 2
function foo() {
    console.log(1)
}
function foo() {
    console.log(2)
}
```

- 块作用域中函数会被提升到块顶部

```js
foo() // TypeError, foo被提升，函数未提升
var a = true
if (a) {
    foo()  // 'a'
    function foo() {
        console.log('a')
    }
}
```

## 第5章 作用域闭包

### 闭包

**概念**

- 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行
  - 一般情况下， 函数在当前词法作用域外执行，才能更好的观测到闭包，之后介绍的例子大多如此

下面的例子中：

- 在foo()执行后，通常垃圾回收器会将foo()的整个内部作用域都销毁。但事实上内部作用域依然存在，因此没有被回收。
- 是因为bar()在使用内部作用域。拜bar()所声明的位置所赐，它拥有涵盖foo()内部作用域的闭包，使得该作用域能够一直存活，以供bar()在之后任何时间进行引用，而这个引用就叫作闭包

```js
function foo() {
    var a = 2
    function bar() {
        console.log(a)
    }
    return bar
}
var baz = foo()
baz() // 2 -->产生闭包
```

- 无论使用何种方式对函数类型的值进行传递，当函数在别处被调用时都可以观察到闭包

```js
// 将函数作为参数传递
function foo() {
    var a = 2
    function bar() {
        console.log(a)
    }
    baz(bar)
}
function baz(fn) {
    fn()
}
foo() // 2
// 间接传递
var fn
function foo() {
    var a = 2
    function bar() {
        console.log(a)
    }
    fn = bar
}
foo()
fn() // 2
```

### 常见的闭包

- 定时器中的闭包

```js
// 将一个内部函数（名为timer）传递给setTimeout(..)。timer具有涵盖wait(..)作用域的闭包，它保有对变量message的引用，timer在setTimeout中被执行
function wait(message) {
    setTimeout(function timer() {
        console.log(message)
    }, 1000)
}
wait('hello')
```

- jquery事件中的闭包

```js
function setupBot(name, selector) {
    // 这里的bot 就是形成了闭包
    $(selector).click(function bot() {
        console.log(name)
    })
}
setupBot('click bot', '#bot 1')
```

- **在定时器、事件监听器、Ajax请求、跨窗口通信、Web Workers或者任何其他的异步（或者同步）任务中，只要使用了回调函数，实际上就是在使用闭包！**

- 通常认为IIFE是典型的闭包例子， 但它不是一个明显的闭包
  - 从技术上来讲，闭包是发生在定义时的，这点符合
  - 但不明显的地方在于， IIFE并不是在它本身的词法作用域以外执行的。它在定义时所在的作用域中执行

### 循环和闭包

- 在 let出现之前， for循环就可以用来展示典型的闭包

```js
for (var i = 1; i <=5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, 1000)
}
```

- 上述代码最终输出5个6
  - 从执行角度上来说，正是因为所有的回调在循环结束后才执行，导致每次的结果都是6
  - 从作用域的角度来看，回调函数虽然是在循环中分别定义，但是他们处于同一作用域，所以最终使用同样的 i 值
- 那么下面的代码就是使用闭包创建多个作用域，从而达到预期

```js
for (var i = 1; i <= 5; i++) {
    // 创建函数作用域， 多次声明i
    (function (i){
        setTimeout(function timer() {
            console.log(i)
        }, 1000)
    }(i))
}
```

- let的实现就相当于在块作用域中多次声明了变量，从而达到了预期效果

```js
for (let i = 1; i <=5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, 1000)
}
//等同于
for (var i = 1; i <=5; i++) {
    // 多次声明
    let j = i
    setTimeout(function timer() {
        console.log(j)
    }, 1000)
}
```

### 模块

模块模式需要具备两个必要条件。

1．必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）。

2．封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态

#### 模块实例

- 下面是一个基本的模块写法
  - CoolModule()返回一个用对象字面量语法来表示的对象, 对象中含有对内部函数的引用，可以将这个对象看作本质上是模块的公共API。

```js
function CoolModule() {
    var something = 'cool'
    var another = [1,2,3]
    // doSomething()和doAnother()函数是具有模块实例内部作用域的闭包
    function doSomething() {
        console.log(something)
    }
    function doAnother() {
        console.log(another.join('!'))
    }
    return {
        doSomething,
        doAnother
    }
}
var foo = CoolModule()
foo.doSomething() // cool
foo.doAnother() // '1!2!3!'


// 通过IIFE可以将上面的写法，修改为单例的模块
var foo = (function CoolModule() {
    var something = 'cool'
    var another = [1,2,3]
    // doSomething()和doAnother()函数是具有模块实例内部作用域的闭包
    function doSomething() {
        console.log(something)
    }
    function doAnother() {
        console.log(another.join('!'))
    }
    return {
        doSomething,
        doAnother
    }
})()
foo.doSomething() // cool
foo.doAnother() // '1!2!3!'
```

> 从模块中返回一个实际的对象并不是必须的，也可以直接返回一个内部函数。jQuery就是一个很好的例子。jQuery和$标识符就是jQuery模块的公共API，但它们本身都是函数（由于函数也是对象，它们本身也可以拥有属性）

- 模块也是函数，所以可以接收参数

```js
function CoolModule(id) {
    function identify() {
        console.log(id)
    }
    return {
        identify
    }
}
var foo = CoolModule('foo')
foo.identify() // 'foo'
```

- 通过在模块实例的内部保留对象的内部引用，可以从内部对模块实例进行修改，包括添加或删除方法和属性，以及修改它们的值。

```js
var foo = (function CoolModule(id) {
    function identify1() {
        console.log(id)
    }
    function identify2() {
        console.log(id.toUpperCase())
    }
    function change() {
        publicApi.identify = identify2
    }
    var publicApi = {
        identify: identify1,
        change
    }
    return publicApi
})('foo module')
foo.identify() // foo module
// 修改identify方法
foo.change()
foo.identify() // FOO MODULE
```

#### 现代的模块机制

- 大多数模块依赖加载器/管理器本质上都是将模块定义封装进一个友好的API， 如下所示

```js
var MyModule = (function Manager() {
    var module = {}
    function define(name, deps, imp) {
        for(var i = 0; i < deps.length; i++) {
            // 读取deps中的模块名，并更新为相应模块的引用
            deps[i] = module[deps[i]]
        }
        // 通过apply执行函数，可以将 deps 作为参数传入， 最后将返回的模块存在module对象上
        module[name] = imp.apply(imp, deps)
    }
    function get(name) {
        return module[name]
    }
    return {
        define,
        get
    }
})()

MyModule.define('bar', [], function() {
    function hello(name) {
        return 'Let me introduce:' + name
    }
    return {
        hello
    }
})
MyModule.define('foo', ['bar'], function(bar) {
    var name = 'wangwu'
    function getName() {
        return console.log(bar.hello(name).toUpperCase())
    }
    return {
        getName
    }
})
var bar = MyModule.get('bar')
var foo = MyModule.get('foo')
console.log(bar.hello('zhangsan')) // 'Let me introduce:zhangsan'
foo.getName() // 'LET ME INTRODUCE:WANGWU'
```

#### 未来的模块机制

- ES6的模块 `import 、export` (这里不再展开说明)



## 附录A 动态作用域

js使用词法作用域， 下面是一个典型的例子

```js
// 词法作用域让foo()中的a通过RHS引用到了全局作用域中的a，因此会输出2
function foo() {
    console.log(a) // 2
}
function bar() {
    var a = 3
    foo()
}
var a = 2
bar()
```

而动态作用域并不关心函数和作用域是如何声明以及在何处声明的，**只关心它们从何处调用**。换句话说，作用域链是基于调用栈的，而不是代码中的作用域嵌套

```js
// 假设js是动态作用域，那么输出如下
function foo() {
    console.log(a) // 3 ， 如果是动态这里就是3
}
function bar() {
    var a = 3
    foo()
}
var a = 2
bar()
```

- 那么动态和词法作用域的区别是：
  - 词法作用域是在写代码或者说定义时确定的，词法作用域关注函数在何处声明
  - 动态作用域是在运行时确定的，而动态作用域关注函数从何处调用。
    - js的this机制与动态作用域很相似， 本书第二部分将详细说明

## 附录B 块作用域的替代方案

- 通过第3章 块作用域部分的介绍，得知在es6我们通过let,const 实现块作用域， 而在es6之前我们一般使用catch达到块作用域的效果

```js
// es6
{
    let a = 2
    console.log(a) //2
}
console.log(a) //ReferenceError
```

- 上述等同于 

```js
// catch
try {throw 2} catch(a) {
    console.log(a) // 2
}
console.log(a) //ReferenceError

// Google维护着一个名为Traceur的项目，该项目正是用来将ES6代码转换成兼容ES6之前的环境
// Traceur 转换es6代码会有如下效果
{
try {throw undefined} catch(a) {
    a = 2
    console.log(a) // 2
}
}
```

### 附录C this 语法

- 如下代码执行与预期不符
  - 可以看到 count结果不是 1而是0， 问题在于cool()函数丢失了同this之间的绑定

```js
// 需使用浏览器运行
var count = -1
var obj = {
    count: 0,
    cool: function() {
        setTimeout(function (){
            if (this.count < 1) {
                this.count++
                console.log(this.count)
            }
        }, 1000)
    }
}
obj.cool() // 0

```

**解决方案**

- `var self = this`,通过变量保存绑定

```js
var count = -1
var obj = {
    count: 0,
    cool: function() {
        var self = this
        setTimeout(function (){
            if (self.count < 1) {
                self.count++
                console.log(self.count)
            }
        }, 1000)
    }
}
obj.cool() // 1

```

- es6 箭头函数

```js
var count = -1
var obj = {
    count: 0,
    cool: function() {
        // 需要注意的是箭头函数不能使用具名函数
        setTimeout(() => {
            if (this.count < 1) {
                this.count++
                console.log(this.count)
            }
        }, 1000)
    }
}
obj.cool() // 1
```

- 使用bind

```js
var count = -1
var obj = {
    count: 0,
    cool: function() {
        setTimeout(function timer() {
            if (this.count < 1) {
                this.count++
                console.log(this.count)
            }
        }.bind(this), 1000)
    }
}
obj.cool() // 1
```

# 第二部分 this和对象原型

## 第1章 关于this

### 为什么要使用this

- this提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将API设计得更加简洁并且易于复用。

```js
// 使用this
function identify() {
    return this.name.toUpperCase()
}
function speak() {
    var greeting = 'Hello,I am ' + identify.call(this)
    console.log(greeting)
}
var me = {name: 'zhangsan'}
var you = {name: 'lisi'}
identify.call(me) // 'ZHANGSAN'
identify.call(you) // 'LISI'
speak.call(me) // 'Hello,I am ZHANGSAN'
speak.call(you) // 'Hello,I am LISI'
```

```js
// 若不用this, 则只能显示的传递一个上下文对象
function identify(context) {
    return context.name.toUpperCase()
}
function speak(context) {
    var greeting = 'Hello,I am ' + identify(context)
    console.log(greeting)
}
var me = {name: 'zhangsan'}
identify(me) // 'ZHANGSAN'
speak(me) // 'Hello,I am ZHANGSAN'
```

### 误解

**this并不指向函数本身**

```js
function foo(num) {
    console.log(num)
    //记录foo调用次数
    this.count++
}
foo.count = 0
for(var i = 0; i < 10; i++) {
    if (i > 5) { foo(i) }
}
// 6
// 7
// 8
// 9
// 由于函数中的this指向的不是自身，所以foo.count仍为0
console.log(foo.count) // 0 

// 实际上，函数会创建一个全局的count, 返回结果为NaN , 等同于 undefined++
console.log(count) // NaN
```

上面的代码如果想要达到预期， 可以使用如下方式

1. 在外部定义变量 如： `var data ={count:0}` 那么 将`this.count`替换为 `data.count` ，那么由于词法作用域，`data.count`就会正确更新
2. 直接绑定到foo自身 将`this.count`替换为 `foo.count`
3. 若依然想使用this，那么在调用时强制指定this,如`foo(i)` 修改为 `foo.call(foo, i)`

****

**this在任何情况下都不指向函数的词法作用域**

- 下面这段代码，看起来是希望访问 foo作用域中的a变量， 但显然， 通过this的调用方式并不能成功

```js
// 浏览器运行
function foo() {
    var a = 2
    this.bar()
}
function bar() {
    console.log(this.a)
}
// 若node环境执行，TypeError: this.bar is not a function
foo() // undefined  
```

### this到底是什么

- 当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。this就是这个记录的一个属性，会在函数执行的过程中用到

## 第2章 this全面解析

### 调用位置

- 在理解this的绑定过程之前，需要理解调用位置和调用栈
  - 调用位置就是函数在代码中被调用的位置（而不是声明的位置）
  - 调用栈就是为了到达当前执行位置所调用的所有函数

```js
function baz() {
    // 调用位置是全局作用域， 调用栈是 baz
    console.log('baz')
    bar() // -> bar的调用位置
}
function bar() {
    // 调用位置是 bar 调用栈是 baz->bar
    console.log('bar')
    foo() // ->foo的调用位置
}
function foo() {
    // 调用位置是bar 调用栈是 baz->bar->foo
    console.log('foo')
}
baz() // -> baz的调用位置
```

> 若代码过于复杂可通过浏览器的开发者工具， 调试查看调用栈与this绑定

### 绑定规则

#### 默认绑定

- 独立调用函数时， 一般应用this的默认绑定， this执向全局对象 （浏览器端，非严格模式）

```js
function foo() { console.log(this.a) }
var a = 2
// 调用时，this执向全局
foo() // 2
```

- 受严格模式影响(函数运行时受影响，但调用时不受)

```js
// 运行时
function foo() {
    'use strict'
    console.log(this.a) 
}
var a = 2
foo() // 报错

// 调用时 使用严格模式不受影响
function foo() {
    console.log(this.a) 
}
var a = 2;
// 用IIFE包裹，保证只有调用处受严格模式影响
(function() {
    'use strict'
	foo() // 2
})()

```

#### 隐式绑定

- 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象

```js
function foo() {
    console.log(this.a)
}
var obj = {a: 2, foo: foo}
obj.foo() // 2
```

- 对象属性引用链中只有上一层或者说最后一层在调用位置中起作用

```js
function foo() {
    console.log(this.a)
}
var obj2 = {a: 42, foo: foo}
var obj1 = {a: 2, obj2:obj2}
// 最后一层obj2为this
obj1.obj2.foo() // 42
```

**隐式丢失**

- 当将绑定对象中函数的引用, 赋予某个变量或作为回调函数传入时，会丢失原有绑定关系 (可以通过调用位置确定新的this)

```js
// 变量
function foo() {
    console.log(this.a)
}
var obj = {a: 2, foo: foo}
// bar的this是全局对象
var bar = obj.foo
var a = 'change'
obj.foo() // 2
bar() // 'change'
```

```js
// 回调函数
function foo() {
    console.log(this.a)
}
function doFoo(fn) {
    // 调用foo
    fn()
}
var obj = {a: 2, foo: foo}
var a = 'change'
doFoo(obj.foo) // 'change'


// 内置函数同理
function foo() {
    console.log(this.a)
}
var obj = {a: 2, foo: foo}
var a = 'change'
setTimeout(foo, 1000) // change

//setTimeout伪代码
function setTimeout(fn, delay) {
    //等待delay毫秒
    fn() // 调用位置
}
```

#### 显式绑定

- 隐式绑定时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把this间接（隐式）绑定到这个对象上。
- 若不想在对象中包含引用，强制绑定this，可以使用 函数的`call`和`apply`方法

```js
function foo() {
    console.log(this.a)
}
var obj = {a: 2}
var obj2 = {a: 32}
foo.call(obj) // 2
foo.apply(obj2) // 32
```

> 如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作this的绑定对象，这个原始值会被转换成它的对象形式（也就是new String(..)、newBoolean(..)或者new Number(..)）。这通常被称为“装箱”

**解决丢失绑定问题**

1.硬绑定

- 像上面那样直接使用显示绑定并不能解决丢失绑定问题，但是显式绑定的一个变种可以解决这个问题,也就是硬绑定
  - 如下所示： 硬绑定的典型应用场景就是创建一个包裹函数，负责接收参数并返回值

```js
function foo(something) {
    console.log(this.a, something)
    return this.a + something
}
var obj = {a: 2}
var bar = function bar() {
    return foo.apply(obj, arguments)
}
var b = bar(3) // 2, 3
console.log(b) // 5
```

- 创建一个可以重复使用的辅助函数

```js
function foo(something) {
    console.log(this.a, something)
    return this.a + something
}
var obj = {a: 2}
// 创建辅助函数
function bind(fn, obj) {
    return function() {
        return fn.apply(obj, arguments)
    }
}
var bar = bind(foo, obj) 
var b = bar(3) // 2, 3
console.log(b) // 5
```

- 由于硬绑定是一种非常常用的模式，所以ES5提供了内置的方法Function.prototype.bind

```js
function foo(something) {
    console.log(this.a, something)
    return this.a + something
}
var obj = {a: 2}
// bind(..)会返回一个硬编码的新函数，它会把你指定的参数设置为this的上下文并调用原始函数。
var bar = foo.bind(obj) 
var b = bar(3) // 2, 3
console.log(b) // 5
```

2.API调用的“上下文”

- js中很多内置函数提供可选参数，通常被称为“上下文”（context），其作用和bind(..)一样，确保你的回调函数使用指定的this。

```js
// 如forEach
function foo(el) {
    console.log(el, this.id)
}
var obj = {id: 'zhangsan'}
// 调用foo时this被绑定到 obj
;[1,2,3].forEach(foo, obj) 
//1 zhangsan
//2 zhangsan
//3 zhangsan
```

#### new绑定

使用new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1．创建（或者说构造）一个全新的对象。

2．这个新对象会被执行[[Prototype]]连接。

3．这个新对象会绑定到函数调用的this。

4．如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

- 基于以下， 可以得到如下代码

```js
// 使用new来调用foo(..)时，我们会构造一个新对象并把它绑定到foo(..)调用中的this上。new是最后一种可以影响函数调用时this绑定行为的方法，我们称之为new绑定。
function foo(a) {
    this.a = a
}
var bar  = new foo(2)
console.log(bar.a) // 2
```

### 优先级

- 默认绑定的优先级是四条规则中最低的
- 显示绑定优先级高于隐式绑定
  - 示例如下

```js
function foo() {
    console.log(this.name)
}
var obj1 = {name:'zhangsan',foo:foo}, obj2 = {name:'lisi',foo:foo}
obj1.foo() // 'zhangsan'
obj2.foo() // 'lisi'
// 同时使用显示和隐式绑定， 可以看到隐式被覆盖
obj1.foo.call(obj2) // 'lisi'
obj2.foo.call(obj1) // 'zhangsan'
```

- new 绑定优先级高于隐式绑定

```js
function foo(name) {
    this.name = name
}
var obj = {foo:foo}
obj.foo('zhangsan')
console.log(obj.name) // 'zhangsan'
// 同时使用隐式和new绑定， 可以看到隐式被覆盖
var bar = new obj.foo('lisi') 
console.log(bar.name) // 'lisi'
```

- new 绑定优先级高于显示绑定
  - 因为call，apply无法与 new 一同使用，所以这里用硬绑定(它是显示绑定的一种)做测试 

```js
function foo(name) {
    this.name = name
}
var obj = {}
var bar = foo.bind(obj)
bar('zhangsan') 
console.log(obj.name) // 'zhangsan'
var baz = new bar('lisi')
console.log(baz.name) // 'lisi'
// 注： new 会返回新对象，所以原对象的name不会改变
console.log(obj.name) // 'zhangsan'
```

- 上文中我们实现的bind显然不能达到被new 覆盖的要求

```js
function foo(name) {
    this.name = name
}
var obj = {}
// 上文实现的bind
function bind(fn, obj) {
    return function() {
        return fn.apply(obj, arguments)
    }
}
var cc = bind(foo, obj)
cc('wangzhang')
console.log(obj.name) // 'wangzhang'
var bbb = new cc('76')
// 未得到预期结果
console.log(bbb.name) // undefined
```

- 下面实现bind的 polyfill代码（polyfill就是我们常说的刮墙用的腻子，polyfill代码主要用于旧浏览器的兼容）

```js
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') throw TypeError('必须使用函数调用bind')
        var args = Array.prototype.slice.call(arguments, 1)
        var self = this, fNop = function() {},
            fBound = function() {
// this instanceof fNop && oThis 原书中 有&& oThis，存在此条件时，当oThis不存在，则不会采用当前this，这与预期的bind效果不符，于是这里去掉&& oThis
                return self.apply(this instanceof fNop ? this : oThis, 
                                  args.concat(Array.prototype.slice.call(arguments)))
            }
        fNop.prototype = this.prototype
        fBound.prototype = new fNop()
        return fBound
    }
}


// 可以得到预期结果， 测试时可以将if (!Function.prototype.bind)去掉
function foo(name) {
    this.name = name
}
var obj = {}
var cc =foo.bind(obj)
cc('wangzhang')
console.log(obj.name) // 'wangzhang'
var bbb = new cc('76')
console.log(bbb.name) // '76'
```

- bind(..)的功能之一就是可以把除了第一个参数（第一个参数用于绑定this）之外的其他参数都传给下层的函数（这种技术称为“部分应用”，是“柯里化”的一种）。上文中去掉`&& oThis`后的bind，也能实现这一行为

```js
function foo(name1, name2) {
    this.name = name1 + name2
}
var bar = foo.bind(null, 'zhangsan')
var baz = new bar('wangwu')
// 可以看到两个参数都被使用
console.log(baz.name) // 'zhangsanwangwu' 
```

- 根据以上试验得出如下结论（优先级由高到低）
  - 函数在new中调用, this绑定的是新创建的对象
  - 函数是否通过call、apply（显式绑定）或者硬绑定调用，this绑定的是指定的对象。
  - 函数在某个上下文对象中调用（隐式绑定）,this绑定的是那个上下文对象。
  - 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到undefined，否则绑定到全局对象。

### 绑定例外

- 介绍上文绑定规则中的例外情况

#### 被忽略的this

- 如果你把null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用时会被忽略，实际应用的是默认绑定规则

```js
function foo() {
    console.log(this.a)
}
var a = 2
foo.call(null) // 2
```

- 根据这一特点， 可以使用apply来展开一个数组， 或者使用bind对参数进行柯里化 

```js
function foo(a, b) {
    console.log(a, '---', b)
}
// apply行为与es6的扩展运算符一致
foo.apply(null, [2,3]) // 2 --- 3
var bar = foo.bind(null, 2) 
bar(3) // 2 --- 3
```

> 忽略this的缺点是，如果某个函数确实使用了this,那默认绑定规则会把this绑定到全局对象（在浏览器中这个对象是window），这将导致不可预计的后果（比如修改全局对象）

**更安全的this**

- 可以传入一个特殊的对象(“DMZ”--demilitarized zone，非军事区 对象，是一个空的非委托对象)，绑定this到这个对象不会对程序产生任何副作用

```js
function foo(a, b) {
    console.log(a, '---', b)
}
// Object.create(null) 与 {} 很像， 但它并不会创建Object.prototype这个委托，也就是无原型，所以它更空
var dmz = Object.create(null)
foo.apply(dmz, [2,3]) // 2 --- 3
var bar = foo.bind(dmz, 2) 
bar(3) // 2 --- 3
```

#### 间接引用

- 间接引用最容易在赋值时发生，在这种情况下，调用这个函数会应用默认绑定规则

```js
function foo() {
    console.log(this.a)
}
var obj1 = {a:2, foo:foo},obj2 = {a:3}, a = 4
obj1.foo() // 2
// 由于obj2.foo = obj1.foo 返回的是目标函数的引用，所以这里执行的不是obj1.foo或obj2.foo，而是这个返回的引用，这个引用的this是默认绑定 等同于 var b = obj2.foo = obj1.foo ,执行b()
;(obj2.foo = obj1.foo)() // 4
// 执行obj2.foo结果符合预期
obj2.foo() // 3
```

#### 软绑定

- 硬绑定这种方式可以把this强制绑定到指定的对象（除了使用new时），防止函数调用应用默认绑定规则。
- 问题在于，硬绑定会大大降低函数的灵活性，使用硬绑定之后就无法使用隐式绑定或者显式绑定来修改this。
- 如果可以给默认绑定指定一个全局对象和undefined以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this的能力。可以通过一种被称为软绑定的方法来实现我们想要的效果

```js
// 软绑定
if (!Function.prototype.softBind) {
    Function.prototype.softBind = function(oThis) {
       if (typeof this !== 'function') throw TypeError('必须使用函数调用softBind')
        var fn = this,
            args = Array.prototype.slice.call(arguments, 1),
            bound = function() {
                return fn.apply(!this || this === (window || global) ? oThis : this,
                               args.concat(Array.prototype.slice.call(arguments)))
            }
        bound.prototype = Object.create(fn.prototype)
        return bound
    }
}

// 测试软绑定
function foo() {
    console.log(this.name)
}
var obj1 = {name:'zhangsan'},obj2 = {name:'lisi'}, obj3 = {name: 'wangwu'}
// 使用软绑定
var bar = foo.softBind(obj1)
bar() // 'zhangsan'
// 隐式绑定调用,成功覆盖软绑定
obj2.bar = bar
obj2.bar() // 'lisi'
// 显示绑定调用，覆盖软绑定
bar.call(obj3) // 'wangwu'
// 若使用默认绑定调用（obj2.bar是间接引用），则会返回软绑定结果 
setTimeout(obj2.bar, 0) //'zhangsan'
```

### this语法

- es6中的箭头函数由外层作用域决定this

```js
// 例1：定时器
function foo() {
    setTimeout(function() {
        console.log(this.a);
    })
}
function foo2() {
    setTimeout(() => {
        console.log(this.a);
    })
}
var obj = {
    a: 2
}
var a = 3
foo.call(obj) // 3
// 外层作用域是foo，所以返回2
foo2.call(obj) // 2

// 例2: 多层this调用
function foo3() {
    return () => {
	    console.log(this.b)
    }
}
var obj2 = {b:2}, obj3 = {b:3}
var bar  = foo3.call(obj2) // 返回箭头函数
// 执行bar, 返回不是3 而是2，即上一层作用域的值 （若不使用箭头函数，这里会返回3）
bar.call(obj3) // '2'
```



## 第3章 对象

### 语法

- 两种定义方式

```js
// 对象字面量
var myObj = {key: 'value'}

// 构造函数
var myObj2 = new Object()
myObj2.key = 'value'
```

### 类型

7 种原始类型(基本类型)

- boolean;null ;number; string ;symbol;bigInt; underfined

引用类型

- js有以下内置对象(所有可通过new 创建的东西)
- 上述基本类型有对应内置对象 String  Number  Boolean 等 ,除了 null , undefined
- 以及 Function ,Array,  Date,  RegExp, Error 
- es6 Map, Set , WeakMap, WeakSet

```js
// 原始类型和引用类型行为上的区别
var str = 'abc'
typeof str // 'string'
str instanceof String // false
var strObj = new String('abc')
typeof strObj // 'object'
str instanceof String // true

// 在大多数使用中， js会将原始值转换（装箱）成一个对象
var str2 = 'efg'
// 包装成String对象，所以可以访问length方法
console.log(str2.length) //  3
```

