# 深入理解ES6

## 1 块级作用域绑定

### var声明及变量声明提升(Hoisting)机制

- var 声明会被提升至当前作用域顶部（作用域为函数作用域或全局作用域），初始化操作依旧留在原处执行

```js
function getValue(condition) {
    if (condition) {
        var value = 'blue'
        return value
    } else {
        // 此处访问value ，不会报错， 而是返回 undefined
        return null
    }
}

// 上述代码相当于
function getValue(condition) {
    var value // 声明提升
    if (condition) {
        value = 'blue'
        return value
    } else {
        // 此处访问value ，不会报错， 而是返回 undefined
        return null
    }
}

```

### 块级声明

- 块级声明用于声明在指定块的作用域之外无法访问的变量。
- 块级作用域（亦被称为词法作用域）存在于：
  -  函数内部
  - 块中（字符{和}之间的区域）

#### let

- let声明的用法与var相同。用let代替var来声明变量，就可以把变量的作用域限制在当前代码块中。由于let声明不会被提升，因此通常将let声明语句放在封闭代码块的顶部，以便整个代码块都可以访问

```javascript
function getValue(condition) {
    if (condition) {
        // 变量value改由关键字let进行声明后，不再被提升至函数顶部。执行流离开if块，value立刻被销毁。如果condition的值为false，就永远不会声明并初始化value。
        let value = 'blue'
        return value
    } else {
        // 此处访问value ，会报错，抛出异常 ReferenceError: value is not defined
        return null
    }
}
```

#### 禁止重声明

```js
// 在同一作用域中若使用var可以重复声明变量， 而let则重复声明就会报错
var value = 1
let value = 1 // Uncaught SyntaxError: Identifier 'value' has already been declared

// 或
let node = {}
let node = {h:1} // 报错
```

#### const

```javascript
// 定义时必须初始化
const maxItems = 30

const name // 报错 Uncaught SyntaxError: Missing initializer in const declaration

// 与let不同之处在于不能在赋值
maxItems = 10 // 报错 Uncaught TypeError: Assignment to constant variable.

// const声明不允许修改绑定，但允许修改值。这也就意味着用const声明对象后，可以修改该对象的属性值
const 
```

- 注： 其他行为与let一致， 声明不提升， 禁止重声明

#### 临时死区 （Temporal Dead Zone）

```js
// 与var不同，let和const声明的变量不会被提升到作用域顶部，如果在声明之前访问这些变量，即使是相对安全的typeof操作符也会触发引用错误 
if (condition) {
    typeof value // 引用错误
	let value = 'blue'
}


// 正常情况下使用typeof 判断未声明的变量，会返回undefined
typeof value //  此时value不处于TDZ中， 所以返回 undefined
if (condition) {
	let value = 'blue'
}
```

### 循环中的块作用域绑定

示例1： 

```js
var funcs = []

for (var i = 0; i < 10; i++) {
    // 因为声明提升, 所以循环后 i === 10 ， 当执行函数时， 找到的i就是10
    funcs.push(function() {
        console.log(i)
    })
}
funcs.forEach(function(item) {
    item() // 打印10个 10   
})

// es5解决方式 IIFE
for (var i = 0; i < 10; i++) {
    // 通过IIFE，每次循环都将当前i的值保存在value中，value作为函数中的变量不会被覆盖
    funcs.push((function(value) {
        console.log(value)
    }(value)))
}


// let 解决了该问题

for (let i = 0; i < 10; i++) {
    // 相当于创建了10个变量，与每个console一一对应， 注意： 虽然可以用变量不提升的概念来理解这一现象，但实际上两者并没有必然关系；
    // 事实上，早期的let实现不包含这一行为，它是后来加入的。
    funcs.push(function() {
        console.log(i)
    })
}

funcs.forEach(function(item) {
    item() // 打印 0 到 9
})


// const
// 在for 循环中使用 const 会抛出错误
// 但是在 for..in 或 for...of则 使用 const 或者 let 均可
var funcs = [], object = {a: 1, b: 2, c: 3}

for (const key in object) {
    // 因为声明提升, 所以循环后 i === 10 ， 当执行函数时， 找到的i就是10
    funcs.push(function() {
        console.log(key)
    })
}
funcs.forEach(function(item) {
    item() // a b c   
})

```

示例2： 

```html
<button>
    按钮1
</button>
<button>
    按钮2
</button>
<button>
    按钮3
</button>
<script>
	var btns = document.getElemenstByTagName('button')
    //这种写法每次点击都只会显示第三个 因为该事件绑定的是回调函数，回调函数在网页加载完毕后，外部触发才会执行，而var关键字，作用域不受{}影响，它在回调函数调用之前已经将i的值修改为3 所以结果都一样，
    //es5没有块级作用域 即{}这种作用域
    //他的过程相当于  {var i=0 第一个回调（没被调用）} {i=1 第二个回调（没被调用） i=2 第三个回调(没被调用)} i最后一次++  i=3,之后循环条件不在符合 不会绑定新事件 当用户触发点击事件时，点击事件会从外部找值 这时外部的i被修改为 3 所以点不同的按钮 显示的都一样
    for (var i=0;i<btns.length;i++) {
        btns[i].addEventListener('click',function(){
            console.log('第'+i+'个按钮被点击了')
        })
    }
//闭包解决 闭包定义：当外部函数执行时，内部函数使用外部函数的变量，且这个变量被保存下来没有消失，这样产生了闭包
 // 闭包的另一种解释方式：当函数可以记住并访问所在的词法作用域，即使该函数在当前词法作用域外执行，这时就产生了闭包
    //这种写法的闭包称为立即执行函数 IIFE
    // 他的过程 var i {i=0 第一个立即执行函数接收了变量i,立即执行内部代码，执行绑定事件操作,又因为绑定事件用到了i,i=0因此被保存在内存中，不会消失，由此闭包产生。} { i= 1  第二个立即执行函数接收了新的变量i，重复上述步骤，且因为函数有自己的作用域，这个函数的i会因为闭包的原因在执行完毕后保存在另一块内存中，即使上一个函数已经销毁,但他的i由于存的位置不同,也不会受这个函数的影响 } {i=2 重复上述步骤 } i=3后循环条件不在符合 不会绑定新事件 且由于上述，i=3 也不会影响到其他绑定事件的i值
    //以上步骤执行完毕后，每个按钮的点击效果就不同了
     
    for (var i=0;i<btns.length;i++) {
        	function(i){	btns[i].addEventListener('click',function(){
           		 console.log('第'+i+1+'个按钮被点击了')
        		})
             }(i)
   	}
 
//    es6有块级作用域 即{}这种作用域
    //他相当与 
    // {let i=0 绑定函数} {let i=1 绑定函数} {let i=2 绑定函数} 这里的每个i均不会受外部影响
     for (var let=0;i<btns.length;i++) {
        btns[i].addEventListener('click',function(){
            console.log('第'i+1'个按钮被点击了')
        })
    }
</script>
```

### 全局块作用域绑定

let和const与var的另外一个区别是它们在全局作用域中的行为。

当var被用于全局作用域时，它会创建一个新的全局变量作为全局对象（浏览器环境中的window对象）的属性。这意味着用var很可能会无意中覆盖一个已经存在的全局属性，就像这样：

```js
console.log(window.RegExp) // 正则构造函数
var RegExp = 'Hello'
console.log(window.RegExp) // 被覆盖为Hello !
```

- let const 不会覆盖只会遮蔽

```js
console.log(RegExp) // 正则构造函数
console.log(window.RegExp) // 正则构造函数

// 注意下面的代码不能跟上面的代码同时执行，否则会触发TDZ
let  RegExp = 'Hello' 
console.log(window.RegExp === RegExp) // false
console.log(RegExp) // Hello 遮蔽了变量，但是没有覆盖window对象上的属性

const ncz = 'hi'

console.log('ncz' in window) //false 查看是否绑定到了window上， 返回false
```

### 块级绑定最佳实践的进化

- 默认使用const，只在确实需要改变变量的值时使用let。这样就可以在某种程度上实现代码的不可变，从而防止某些错误的产生



## 2 字符串和正则表达式

### 更好的Unicode支持

#### UTF-16

- 在es6前， js字符串基于UTF-16构建，进行构建。每16位的序列是一个编码单元（code unit），代表一个字符，length， charAt等方法都基于该编码单元构造。
- 但如果把字符长度限制在16位不足以展示所有字, 所以在es5中会出现如下情况 :
  - 注： 能展示的被称为BMP字符,不能限制的被称为非BMP字符

```js
let text = '𠮷'
console.log(text.length) // 2 
console.log(/^.$/.test(text)) // false  该正则匹配一个字符，由于 '𠮷'长度为2 所以返回false
// charAt, es5方法 从字符串中返回指定的字符。 接收一个参数， 是字符位置的索引， 不传则默认0
console.log(test.charAt()) // '\uD842' 返回与预期不符
console.log(test.charAt(1)) '\uDFB7'
// 返回 0 到 65535 之间的整数，表示给定索引处的 UTF-16 代码单元
console.log(test.charCodeAt(0)) // 55362
console.log(test.charCodeAt(1)) // 57271
```

#### codePointAt()

- es6新增方法， 使用方式与charCodeAt一致， 但是对于第一个返回的码为是一个完整的编码单元

```js
'𠮷'.codePointAt(0) //134071 完整单元
'𠮷'.codePointAt(0) // 57271 第二个与charCodeAt一致
```

#### String.fromCodePoint()

```js
// 在 es5 中通过 String.fromCharCode() 返回由 UTF-16 代码单元序列创建的字符串,大于范围的数字将被截断, 参数可以有n个
String.fromCharCode(97,98,99) // 'abc'
// String.fromCodePoint() 则可以生成超出UTF-16编码单元的文字, 参数与fromCharCode一致
String.fromCodePoint(134071) // '𠮷'
```

#### normalize()

- normalize() 用来将码位不同但含义相同的字符，以指定的方式标准化
  - 接收一个参数： 为可选标准 NFC(默认), NFD , NFKC, NFKD 
-  比如 字符“æ”和含两个字符的字符串“ae”可以互换使用，但是严格来讲它们不是等效的，除非通过某些方法把这种等效关系标准化。

```js
// 在数组排序中， 该方法可以将字符串转为统一标准后排序
// 排序原数组
values.sort(function(first, second) {
    let fnor = first.normalize(),snor = second.normalize()
    return fnor > snor ? 1 : -1
})

// 排序新数组
const newValue = values.map(function(value) {
    return value.normalize()
})
newValue.sort(function(first, second) {
    return first > second ? 1 : -1
})
```

#### 正则表达式u修饰符

- 当一个正则表达式添加了u修饰符时，它就从编码单元操作模式切换为字符模式，如此一来正则表达式就不会视代理对为两个字符，从而完全按照预期正常运行

```js
/^.$/.test('𠮷'); // false
/^.$/u.test('𠮷') // true  
```

- 通过该修饰符，就可以计算出正确的字符长度

```js
function codePointLength(str) {
    // /[\s\S]/可用于匹配所有字符， g代表全局匹配，u保证当特殊字符时得到预期结果
    const result = str.match(/[\s\S]/gu) 
    return result ? result.length : 0
}
console.log(codePointLength('𠮷ab')) // 3
```

- 检查是否支持u修饰符

```js
function hasRegExpU() {
    try {
        const res = new RegExp('.', 'u')
        return true
    } catch(ex) {
        return false
    }
}
```



### 其他字符串变更

#### includes ; startsWith ; endsWith 

- 3个方法都接受两个参数：第一个参数指定要搜索的文本；
- 第二个参数是可选的，指定一个开始搜索的位置的索引值。如果指定了第二个参数，则includes()方法和startsWith()方法会从这个索引值的位置开始匹配，endsWith()方法则是被指定搜索str的长度， 从该长度开始匹配

```js
 // includes()方法，如果在字符串中检测到指定文本则返回true，否则返回false。
'abc'.includes('a') // true
// startsWith()方法，如果在字符串的起始部分检测到指定文本则返回true，否则返回false。
'123'.includes('2') // false
// endsWith()方法，如果在字符串的结束部分检测到指定文本则返回true，否则返回false。
'12356'.endsWith('5', 4) // true  注： 搜索长度为4 数组第4为是5，符合，所以true
```

> 对于startsWith()、endsWith()及includes()这3个方法，如果你没有按照要求传入一个字符串，而是传入一个正则表达式，则会触发一个错误产生；而对于indexOf()和lastIndexOf()这两个方法，它们都会把传入的正则表达式转化为一个字符串(仅转换不是使用正则搜索)并搜索它

#### repeat

- 接受一个number类型的参数，表示该字符串的重复次数，返回值是当前字符串重复一定次数后的新字符串

```js
console.log('123'.repeat(3)) // '123123123'

// 一般可以用来创建缩进
let indent = ' '.repeat(4) // 四个空格
let i = 0
indent.repeat(i++) // 通过变更i就可以创建不同的缩进
```



### 其他正则表达式语法变更

#### 正则表达式y修饰符

- 正则实例的sticky属性， 代表当前正则具有粘滞性
  - 粘滞性是指当在字符串中开始字符匹配时，它会通知搜索从正则表达式的lastIndex属性开始进行匹配
  - lastIndex下一次匹配开始的索引
  - 产生粘滞性的条件
    - 正则当中需要有 `g` 或者 `y`修饰符,若没有 不管匹配多少次， 正则的lastIndex属性都是0
    - 只有调用exec()和test()这些正则表达式对象的方法时才会涉及lastIndex属性；调用字符串的方法，例如match()，则不会触发粘滞行为(注：当使用`g`时，match返回的结果与exec也不同，exec只会返回一个结果，若想返回多个需要多次执行直到结果为null, 这时lastIndex也会归0，而match直接返回所有)
- 由于y具有粘滞性， 所以可以通过检查正则sticky属性，判断修饰符是否存在 true存在 false不存在

```js
const reg = /123/y
console.log(reg.sticky) // true
// 无y
const reg1 = /123/
console.log(reg.sticky) // false
```

- 使用实例
  - 下方实例可以看出修饰符y的特点，当使用g时， 每次会在所有剩余字符中匹配， 而y 效果类似于 `^` 它每次都会从剩余的开头匹配，若没匹配到则返回null 且lastIndex变为0， 再次重复匹配

```js
let reg = /1/g;
let reg1 = /1/y

console.log(reg.lastIndex) // 0
reg.exec('1231') // 体现了与String.match的区别只返回  ['1']  index: 0 index是返回值的属性
console.log(reg.lastIndex) // 1
reg.exec('1231') // ['1']  index: 3
console.log(reg.lastIndex) // 4
reg.exec('1231') // 无结果 返回null
console.log(reg.lastIndex) //0 无结果所以重置为 0


console.log(reg1.lastIndex) // 0
reg1.exec('1231')
console.log(reg1.lastIndex) // 1
reg1.exec('1231')
console.log(reg1.lastIndex) // 0 无结果所以重置为0
reg1.exec('1231') // 无结果 返回null
console.log(reg1.lastIndex) //1 
```



#### 正则表达式的复制

- 在es5中将正则表达式传入RegExp构造函数作为第一个参数可以复制正则表达式， 但是如果被复制的正则包含修饰符，且RegExp构造函数也传入第二个参数，则会抛出错误。
- 在es6中解决了这个问题，新传入的修饰符会替换原有的修饰符

```js
const reg = /\d/g
const reg1 = new RegExp(reg, 'y') //  /\d/y
```



#### flags属性

- es5支持用 source属性 获取正则表达式文本， 但不支持获取修饰符， es6中添加了flags属性用于获取修饰符

```js
const reg = /\d/g
console.log(reg.source) // '\d'
console.log(reg.flags) //'g'

// es5中想要获取修饰符只能如下操作
function getFlags(reg) {
    const position = String(reg).lastIndexOf('/')
    return String(reg).slice(position + 1)
}
getFlags(reg) // g
```



### 模板字面量

#### 基础语法

```js
// 使用 `` 替换单双引号， 若想在字符串中使用 ` 用 \` 转义即可

const str = `test\``
```

#### 多行字符串

```js
// es5中 js存在一个语法bug 字符串中添加 \ 即可在下一行继续书写字符串, 虽然可以这样的是由于其本身是bug所以应尽量避免该方法 一般常用 + 号来拼接字符串

// 注意这种方式只是书写上的换行，不是实际字符的换行，实际换行需要添加\n 

// abcde
const str = 'abc\
de' 

/*
abc
de 
*/
const str1 = 'abc\n\
de'

// 模板字面量支持直接换行的写法,换行时自动添加\n , 需要注意的是，所有空白符都会成为字符的一部分，所以要小心缩进
const str2 = `a
   b`
/*a
     b */
```

#### 字符串占位符

- `${}` 占位符由一个左侧的${ 和右侧的 } 符号组成，中间可以包含任意的JavaScript表达式（变量，运算式，函数均可）
- 模板字面量本身也是JavaScript表达式，所以你可以在一个模板字面量里嵌入另外一个

```js
const str = `a${1+2}` //a3

// 在一个里面嵌入另外一个
const str1 = `a${`c${3+6}`}` //ac9
```

#### 标签模板

- 标签指的是在模板字面量第一个反撇号（`）前方标注的字符串, 如此处 标签是tag

```js
const str = tag`abc`
```

- 标签必须定义为函数（不定义会报错）， 则第一个参数是一个数组，包含JavaScript解释过后的字面量字符串，它之后的所有参数都是每一个占位符的解释值
  - 函数会在使用标签时执行,函数的返回值会成为模板字面量的最终赋值， 所以可以通过标签对模板字面量进一步做想要的处理 （若无返回值，则字符串为undefined）

```js
function tag(literals, ...substitutions) {
    // 注意： 此处虽然占位符前面没有字符串，但仍会返回一个 ''， 所以可知
    // literals.length - 1 === substitutions.length 
    console.log(literals, substitutions)  //['','b','c']   [12,9]
    return 11
}

const str = tag`${12}b${3+6}cc` // 11

```

模板字面量中使用原始值

```js
let str = `ab\nc`
// 此时不会再换行，而是显示原始的 ab\nc ，注意： 该方法只对输入\n有效，若是输入 
//`a
//  b` 则方法无效
str = String.raw`ab\nc`


// 模板标签中定义的函数中 第一个参数数组存在raw属性，该属性中保存着原始值组成的数组（相当于literals对应的原始值）， 通过这个数组可以还原String.raw方法
// node环境下测试结果
function raw(literals, ...substitutions) {
    console.log(literals,literals.raw, substitutions)  //[ '', '\nb', 'cc' ] [ '', '\\nb', 'cc' ] [ 12, 9 ]
    let res = ''
    for(let i = 0; i < substitutions.length; i++) {
        res += literals.raw[i] + substitutions[i]
    }
    // 合并最后一个raw
    res += literals.raw[literals.length - 1]
    return res
}

const str = raw`${12}\nb${3+6}cc`
console.log(str); // 12\nb9cc
```



## 3 函数

### 函数形参的默认值

#### es5中的默认参数

```js
function makeRequest(url, timeout, callback) {
    // 通过 || 来判断是否使用默认值， 但是该方法存在问题， 假如参数为 0 也会使用默认值
    timeout = timeout || 2000
    callback = callback || function() {}
}

function makeRequest(url, timeout, callback) {
    // 所以更好的方式是使用 typeof进行判断
    timeout = typeof timeout !== 'undefined' ? timeout : 2000
    callback = typeof callback !== 'undefined' callback : function() {}
}
```

#### es6中的默认参数

```js
// 定义方式如下
function makeRequest(url, timeout = 2000, callback = function() {}) {
    //...
}

// 假如默认参数在中间
function makeRequest(url, timeout = 2000, callback) {
    //...
}
// 使用时传入undefined则使用默认参数 , 如 : makeRequest('/test', undefined, function(){})
// 注意： 这里如果传入null 则不会使用默认参数,null被认为是合法值，如： makeRequest('/test', null)
```

**默认参数对arguments的影响**

> 注： 以下arguments的变化与否都是建立在传参的基础上，如果没有传参， 对应arguments的值都是undefined,也不会变化

- 无默认参数：  arguments的值会随着参数的变化而变化

```js
function mixArgs(first, second) {
    console.log(arguments[0]) // 6
    console.log(arguments[1]) // 9
    first = 7
    second = 8
    console.log(arguments[0]) // 7
    console.log(arguments[1]) // 8
}
mixArgs(6,9)
```

- 无默认参数严格模式 arguments值不变化

```js
function mixArgs(first, second) {
    "use strict"
    console.log(arguments[0]) // 6
    console.log(arguments[1]) // 9
    first = 7
    second = 8
    console.log(arguments[0]) // 6
    console.log(arguments[1]) // 9
}
mixArgs(6,9)
```

- es6 行为与es5严格模式一致,只要有一个默认参数，就与严格模式一致

```js
function mixArgs(first = 6, second) {
    console.log(arguments[0]) // 6
    console.log(arguments[1]) // 9
    first = 7
    second = 8
    console.log(arguments[0]) // 6
    console.log(arguments[1]) // 9
}
mixArgs(6,9)
```

**默认参数表达式**

- 默认参数支持非原始值传参， 除了定义函数，对象， 还可以通过执行函数来得到默认参数的值
- 并且后一个默认参数可以使用前一个参数的值(有参数时取值是传递的参数，没有时取值是默认参数)， 但是需要注意的是， 前面的不能使用后面的值

```js
function getValue(value) {
    return value + 1
}
// 调用getValue函数， 并将first作为值传入
function add(first = 5, second = getValue(first)) {
    console.log(first, second)
}
add() // 5, 6 后值使用前值默认参数
add(3) // 3, 4 后值使用前值参数
```



**默认参数的临时死区**

```js
// 上文提到了前面的默认参数，不能使用后面参数的值， 这里实际上是由于临时死区的原因

function add(first = second, second)  {} 
add() //报错

// 此处相当于执行如下代码
let first  = second // 触发了临时死区
let second = undefined 
```

> 注： 函数参数有自己的作用域和临时死区，其与函数体的作用域是各自独立的，也就是说参数的默认值不可访问函数体内声明的变量。

### 处理无命名函数

#### es5中的无命名参数

```js
// 通过arguments实现

// 这里定义一个pick函数， 作用是返回一个给定对象的副本，包含原始对象属性的特定子集
// arg1:  给定对象 , ...args 要拷贝的属性
function pick() {
    // Object.create(null) 方法创建一个对象，参数1:为对象的原型，传null代表无原型，必传，不传会报错
    // 参数2而是一个设置属性的对象与Object.definedProperties的第二个参数类似， 可选
    const result = Object.create(null)
    for (let i = 1; i < arguments.length; i++) {
        result[arguments[i]] = arguments[0][arguments[i]]
    }
    return result
}
const book = {title: 'es6', year: 2016, other: 'test'}
let bookData = pick(book, 'title', 'year')
console.log(bookData) // {title: 'es6', year: 2016}


// 该函数使用上不方便的地方
/*
1.不能第一时间发现可以接收任意数量参数
2. 由于第一个参数被用作传递对象， 所以在定义函数时， 遍历arguments需要注意不能让 i = 0
    */
```

#### es6解决方案： 不定参数

```js
// 使用...的方式表示
function pick(obj, ...props) {
    const result = Object.create(null)
    // props 就是不定参数组成的数组
    for (let i = 0; i < props.length; i++) {
        result[props[i]] = obj[props[i]]
    }
    return result
}
const book = {title: 'es6', year: 2016, other: 'test'}
let bookData = pick(book, 'title', 'year')
console.log(bookData) // {title: 'es6', year: 2016}

// 函数的length属性统计函数命名参数的数量，不定参数的加入不会影响length属性的值。在本示例中，pick()函数的length值为1
pick.length // 1
```

- 注1： 不定参数只能位于参数最后一个，若后面还有参数，会报错

```js
function test(a, ...b, c) {} // 报错
```

- 注2： 不定参数不能用在对象字面量的setter中 ,因为对象字面量setter的参数有且只能有一个。而在不定参数的定义中，参数的数量可以无限多，所以在当前上下文中不允许使用不定参数。

```js
const obj = {
    //报错
    set name(...a) {
        
    }
}
```

#### 不定参数对arguments的影响

- 当使用不定参数时， arguments会同步更新

```js
function test(a, ...b) {
    console.log(b) // ['2', '3']
    console.log(arguments) // ['1', '2', '3']
}
test('1', '2', '3')
```

### 增强的Function构造函数

- Function构造函数是JavaScript语法中很少被用到的一部分，通常我们用它来动态创建新的函数。这种构造函数接受字符串形式的参数，分别为函数的参数及函数体
- es6支持在Function构造函数中 定义默认值和不定参数

```js
// 默认值
const add = new Function('first = 5', 'second = 1', 'return first + second')
// 不定参数
const add1 = new Function('...args', 'return args[0]')

add() // 6
add1(3,6,9) // 3
```

### 展开运算符

- 在所有的新功能中，与不定参数最相似的是展开运算符。不定参数可以让你指定多个各自独立的参数，并通过整合后的数组来访问；而展开运算符可以让你指定一个数组，将它们打散后作为各自独立的参数传入函数

**es5**

```js
// 当想找出一个数组中的最大值, es5中使用apply (参数1:代表this, 参数2：代表参数数组)的方式实现
const arr = [5,17,1,61]
console.log(Math.max.apply(Math, arr)) // 61

```

**es6中可以直接使用展开运算符实现该效果**

```js
// 打散数组
const arr = [5,17,1,61]
console.log(Math.max(...arr)) // 61

// 可以与其他参数混合使用， 位置没有限制
console.log(Math.max(...arr, 89)) // 89
```

### name属性

- ECMAScript 6中为所有函数新增了name属性,方便调试与追踪函数

```js
// 下面展示不同情况下name的值

function test() {} 
console.log(test.name) // test

const test1 = function () {}
console.log(test.name) // test1


// 右侧名称权重高
const test2 = function test3() {} 
console.log(test2.name) // test3

// 作为方法
const obj = {
    get firstname() {
        return 1
    },
    sayName:function() {
    }
}
// 注： 该写法返回值与书中不符， 这里返回undefined 
console.log(obj.firstname.name) 
// 访问set get的name应使用如下方式，过了 get / set
let desc = Object.getOwnPropertyDescriptor(obj, 'firstname')
console.log(desc.get.name) // get fristname
// sayName
console.log(obj.sayName.name) 

// 使用bind 触发， 结果bound开头, bind用于改变this,第一个参数接收this,后续参数接收函数参数
console.log(test.bind().name) // bound test

// 上文提及的 new Function() 构造函数 anonymous
console.log((new Function()).name) // anonymous

```

### 明确函数的多重用途

- ECMAScript 5及早期版本中的函数具有多重功能
  - 如： 结合new使用时，函数内的this值将指向一个新对象，函数最终会返回这个新对象

```js
function Person(name) {
    this.name = name
    return 1
}
console.log(new Person()) // Person {name: undefined}  使用 new 时，返回新对象，哪怕函数中指定了return 也会被忽略
console.log(Person()) // 1
```

- JavaScript函数有两个不同的内部方法：**[[Call]]和[[Construct]]。**
  - 当通过new关键字调用函数时，执行的是[[Construct]]函数，它负责创建一个通常被称作实例的新对象，然后再执行函数体，将this绑定到实例上；具有[[Construct]]方法的函数被统称为构造函数。
  - 如果不通过new关键字调用函数，则执行[[Call]]函数，从而直接执行代码中的函数体。

#### 在es5中判断函数被调用的方法（是否new调用）

- 在es5中通过 instanceof  判断 但是存在使用 call触发函数时，无法识别的问题

```js
function Person(name) {
    if (this instanceof Person) {
	    this.name = name
    } else {
        throw new Error('必须通过new关键字调用 Person')
    }
}
Person('张三') // 抛出异常

const person = new Person('张三') // 通过new调用， 成功创建实例

// 没有使用new 但是同样调用成功， 因为在call方法中， 传入person改变了this, person是 Person的实例，所以instanceof为真，执行成功
Person.call(person, '张三') 
```

#### es6解决方案： new.target

- 当调用函数的[[Construct]]方法时，new.target被赋值为函数体内this的构造函数；如果调用[[Call]]方法，则new.target的值为undefined （call方法同样是undefined）。

> 在函数外使用new.target是一个语法错误。

```js
function Person(name) {
    // 必须new 调用
    if (new.target !== undefined) {
        this.name = name
    } else {
        throw new Error('必须通过new关键字调用 Person')
    }
}
const person = new Person('张三') // 通过new调用， 成功创建实例 
Person.call(person, '张三')  // 异常


// 注意： 由于 new.target的值受 构造函数影响， 所以可以指定target

function Person(name) {
    console.log(new.target)
    if (new.target === Person) {
        this.name = name
    } else {
        throw new Error('必须通过new关键字调用 Person')
    }
}
new Person('张三') // 成功

function AnotherPerson(name) {
    Person.call(this,name) // 这时new.target仍然是undefined，因为这里实际还是使用call调用
}
new AnotherPerson('李四')
```

### 块级函数

**es5中的块级函数**

```js
// 非严格模式下，各厂商实现不同， 不推荐使用

// 严格模式下， 声明块级函数会报错
'use strict'
if (true) {
    console.log(typeof doSomething)  // 报错
    function doSomething() {}
}
```

**es6中的块级函数(严格模式下)**

```js
'use strict'
console.log(typeof doSomething)  // undefined
if (true) {
    console.log(typeof doSomething)  // function
    function doSomething() {}
}
// 不会提升
console.log(typeof doSomething)  // undefined

```

**es6中的块级函数(非严格模式下)**

```js
console.log(typeof doSomething)  // undefined
if (true) {
    console.log(typeof doSomething)  // function
    function doSomething() {}
}
// 会提升，但是仅在代码块执行完毕后提升
console.log(typeof doSomething)  // function
```

### 箭头函数

**特点**

- 没有this、super、arguments和new.target绑定　箭头函数中的this、super、arguments及new.target这些值由外围最近一层非箭头函数决定。（super将在第4章进行讲解。）

- 不能通过new关键字调用　箭头函数没有[[Construct]]方法，所以不能被用作构造函数，如果通过new关键字调用箭头函数，程序会抛出错误。

- 没有原型　由于不可以通过new关键字调用箭头函数，因而没有构建原型的需求，所以箭头函数不存在prototype这个属性。

  - ```js
    const MyType = () => {}
    new MyType() // 报错
    ```

- 不可以改变this的绑定　函数内部的this值不可被改变，在函数的生命周期内始终保持一致。

- 不支持arguments对象　箭头函数没有arguments绑定，所以你必须通过命名参数和不定参数这两种形式访问函数的参数。

- 不支持重复的命名参数　无论在严格还是非严格模式下，箭头函数都不支持重复的命名参数；而在传统函数的规定中，只有在严格模式下才不能有重复的命名参数。

> 注： 箭头函数仍然有name属性

#### 箭头函数语法

```js
// 单一参数，直接返回
let reflect = value => value
// 相当于
let reflect = function(value) {
    return value
}

//  多个参数
let reflect = (value,key) => value
// 无参数, 括号不能省略
let reflect = () => value

// 复杂处理
let reflect = (value,key) => {
    console.log(key)
    return value
}

// 空函数
let reflect = () => {}

// 如果直接return 返回对象,则需要用括号包起来 (为了与函数体区分开)
let reflect = value => ({value:value})
```

#### 创建立即执行函数表达式

```js
// 普通写法  
// 注： 可以不加小括号, 若加小括号， 小括号可以像本例子将函数与参数包裹， 也可以光包裹函数参数放在括号外
let person = (function (name) {
    return {
        getName:function() {
            return name
        }
    }
}('张三'))
console.log(person.getName()) // 张三
// IIFE 注： 必须加括号，且参数只能放在括号外

let person = ((name)=> {
    return {
        getName:function() {
            return name
        }
    }
})('张三')
console.log(person.getName()) // 张三
```

#### 箭头函数无this绑定

- es5出现的问题与解决方案

```js
// 定义PageHandler对象,调用对象init方法，为页面绑定点击事件
let PageHandler = {
   id:'123456',
   init:function()  {
       // 第三个参数默认false代表冒泡模式(由外向内)， 若传true则事件启用捕获模式(由内向外执行事件)
       document.addEventListener('click', function(event) {
           // event.type 事件类型，这里是click
           this.doSomething(event.type) // 执行init方法,点击页面此,报错，因为此时this是document
       }, false) 
   },
    doSomething: function(type) {
        console.log(this.id + ': ' + type)
    }
}

// 通过bind改绑this,此时this是PageHandler,从而函数内this正常使用,点击时成功调用doSomething方法
let PageHandler = {
   id:'123456',
   init:function()  {
       document.addEventListener('click', (function(event) {
           this.doSomething(event.type) 
       }).bind(this), false) 
   },
    doSomething: function(type) {
        console.log(this.id + ': ' + type) // 123456: click
    }
}
// 另一种解决方式： 使用变量保存this, 在回调中不直接使用 this，而是使用变量调用方法 (写法略)

```

- es6, 由于自身没有this，直接使用上层this,解决该问题

```js
let PageHandler = {
   id:'123456',
   init:function()  {
       document.addEventListener('click', (event) => {
           this.doSomething(event.type) 
       }, false) 
   },
    doSomething: function(type) {
        console.log(this.id + ': ' + type) // 123456: click
    }
}
```

#### 箭头函数和数组

- 在数组处理中，可以用来减少代码量

```js
// 如 排序
values.sort(function (a, b) {
    return a - b 
})
// 简化
values.sort((a,b) => a-b)
```

#### 箭头函数没有arguments绑定

- 若访问arguments， 则访问的是外围函数的arguments 对象， 若没有外围函数，会报错

#### 箭头函数的识别方法

- 尽管与传统函数有许多不同，但仍然可以被识别出来

```js
const test = () => {}
typeof test // 'function'
test instanceof Function // true
```

### 尾调用优化

- 在ECMAScript 5的引擎中，尾调用的实现与其他函数调用的实现类似：创建一个新的栈帧（stack frame），将其推入调用栈来表示函数调用。也就是说，在循环调用中，每一个未用完的栈帧都会被保存在内存中，当调用栈变得过大时会造成程序问题

#### es6的尾调用优化

**使用要求**

- 严格模式
- 尾调用不访问当前栈帧的变量（也就是说函数不是一个闭包）。
- 在函数内部，尾调用是最后一条语句。
- 尾调用的结果作为函数值返回。

```js
'use strict'
function doSomething() {
    // 被优化
    return doSomethingElse()
}

function doSomething() {
    // 无法优化，不是函数
    return doSomethingElse() + 1
}

function doSomething() {
    const num = 5
    const sum = () => num
    // 无法优化，sum是一个闭包，引用了num 变量
    return sum()
}
```

#### 如何利用尾调用优化

- 实例： 优化阶乘函数

```js
function factorial(n) {
    if (n <= 1) {
        return 1
    } else {
        // 无法优化 
        return n * factorial(n - 1)
    }
}

'use strict'
function factorial(n, p = 1) {
    if (n <= 1) {
        return p * 1
    } else {
	    let res = n * p
        // 成功优化
        return factorial(n - 1, res)
    }
}
```

## 4 扩展对象的功能性

### 对象字面量语法扩展

#### 属性初始值的简写

```js
// es5 createPerson()函数创建了一个对象，其属性名称与函数的参数相同，在返回的结果中，name和age分别重复了两遍，只是其中一个是对象属性的名称，另外一个是为属性赋值的变量
function createPerson(name, age) {
    return {
        name: name,
        age: age
    }
}
// es6简写， 当变量名与属性名相同时， 只写属性名即可， JavaScript引擎会在可访问作用域中查找其同名变量
function createPerson(name, age) {
    name,
    age
}
```

#### 对象方法的简写语法

```js
// es5写法
let person = {
    name: 'zhangsan',
    sayName: function() {
        console.log(this.name)
    }
}

// es6写法， 消除了 function 和冒号
let person = {
    name: 'zhangsan',
    sayName() {
        console.log(this.name)
    }
}
```

#### 可计算属性名

```js
// 在es5中 可以通过 []的方式代替点来定义属性， 但是并不能直接写到对象字面两种
let person = {
    // es5 中不能将[]写在这里
}
// 这里属性名中有空格， 只能用[]定义， 不能使用点
person['your name'] = '张三

// es6支持在对象字面量中使用[]

let person = {
    ['your name']: 'zhangsan'
}
// []可接收变量， 可计算
const str = '$$'
let person = {
    ['your name' + str]: 'zhangsan' 
}
// {your name$$: 'zhangsan'}
```

### 新增方法

#### Object.is()方法

- 接收两个参数， 用于比较两个值是否相等

```js
// == 会触发强制类型转换
'1' == 1 // true

// === 不转换
'1' == 1 // false
// 但是 === 有一些特殊情况
+0 === -0 // true
NaN = NaN // false

// Object.is() // 除特殊情况外， 大部分行为与 === 一致
Object.is('1', 1) // false
Object.is(+0, -0) // false
Object.is(NaN, NaN) // true

```

#### Object.assgin()方法

- 用于将其他对象的属性和方法， 复制到目标对象

```js
// 在es5中， 如果想实现属性得复制，一般自行定义mixin方法 （注： 复制是浅复制， 对于方法， 只复制引用）
function mixin(target, otherObj) {
    Object.keys(otherObj).forEach((key) => {
        target[key] = otherObj[key]
    })
    return target
}

// ECMAScript 6添加了Object.assign()方法来实现相同的功能，这个方法接受一个接收对象和任意数量的源对象，最终返回接收对象
// 同名属性时，后面会覆盖前边
let target = {}, otherObj = {name: 'lisi', age: 18}, otherObj2 = {age: 23}
Object.assign(target, otherObj, otherObj2)
console.log(target) // {name: 'lisi', age: 23}
```

- 注意： Object.assign() 不复制访问器属性， 他会将其转换为对应的数据属性

```js
let target = {}, 
    otherObj = {
        get name() {
            return 'zhangsan'
        }
    }

Object.assign(target, otherObj)
// getOwnPropertyDescriptor方法获取属性详细信息
// {set: undefined, enumerable: true, configurable: true, get: ƒ} 
const oNameDesc = Object.getOwnPropertyDescriptor(otherObj, 'name')
// 这接赋值为数据属性 {value: 'zhangsan', writable: true, enumerable: true, configurable: true} 
const nameDesc = Object.getOwnPropertyDescriptor(target, 'name')
```

### 重复的对象字面量属性

```js
// es5严格模式下， 当在对象字面量中定义重复属性会报错
'use strict'
let person = {
    name: 'zhangsan',
    name: 'lisi'  // 报错
}

// es6移除了这一特性， 无论是否严格模式， 都不报错，重复属性都会选取最后一个值
'use strict'
let person = {
    name: 'zhangsan',
    name: 'lisi'
}
person.name // lisi 正常
```

### 自有属性枚举顺序

- ECMAScript 5中未定义对象属性的枚举顺序，由JavaScript引擎厂商自行决定。然而，ECMAScript 6严格规定了对象的自有属性被枚举时的返回顺序，这会影响到Object.getOwnPropertyNames()方法及Reflect.ownKeys（将在第12章讲解）返回属性的方式，Object.assign()方法处理属性的顺序也将随之改变
  - 基本规则如下： 
  - 1.所有数字键按升序排序。
  - 2.所有字符串键按照它们被加入对象的顺序排序。
  - 3.所有symbol键（在第6章详细讲解）按照它们被加入对象的顺序排序。

```js
var obj = {
    a: 1,
    0: 1,
    c: 1,
    2: 1,
    b: 1,
    1: 1
}
obj.d = 1
console.log(Object.getOwnPropertyNames(obj)) // ['0', '1', '2', 'a', 'c', 'b' , 'd']
```

> for-in ;  Object.keys ; JSON.stringify ; 方法枚举顺序并不明确， 由厂商决定

### 增强对象原型

#### 改变对象的原型

**ES5原型**

- 正常情况下，无论是通过构造函数还是Object.create()方法创建对象，其原型是在对象被创建时指定的。对象原型在实例化之后保持不变
- 一般通过  Object.getPrototypeOf()方法来返回任意指定对象的原型

ES6改变原型

- Object.setPrototypeOf()方法 , 它接受两个参数：被改变原型的对象及替代第一个参数原型的对象

```js
let person = {
    getGreeting() {
        return 'Hello'
    }
}
let dog = {
    getGreeting() {
        return 'Woof'
    }
}

// 指定原型为person
let friend = Object.create(person)
console.log(friend.getGreeting()) // Hello
console.log(Object.getPrototypeOf(friend) === person) // true

// 改变原型
Object.setPrototypeOf(friend, dog)
console.log(friend.getGreeting()) // Woof
console.log(Object.getPrototypeOf(friend) === dog) // true
```

> 对象原型的真实值被储存在内部专用属性[[Prototype]]中，调用Object.getPrototypeOf()方法返回储存在其中的值，调用Object.setPrototypeOf()方法改变其中的值。然而，这不是操作[[Prototype]]值的唯一方法

#### 简化原型访问的Super引用

- 在es5中重写对象方法， 但又要调用原型上的同名方法， 实现方式如下

```js
let person = {
    getGreeting() {
        return 'Hello'
    }
}

// 指定原型为person
let friend = Object.create(person)

friend.getGreeting = function () {
    // 通过如下方式调用
    return Object.getPrototypeOf(this).getGreeting.call(this) + ' zhang san'
}
console.log(friend.getGreeting()) // Hello zhang san
```

- 上述写法较为复杂;   es6中， 可以直接使用super代替, **但需要注意的是，super对于写法有一定要求**
  - **必须要在使用简写方法的对象中使用Super引用**

```js
// 写法1： 报错
friend.getGreeting = function () {
    return super.getGreeting() + ' zhang san'
}

let person = {
    getGreeting() {
        return 'Hello'
    }
}

let friend = {
    // 写法2； 报错
    getGreeting: function () {
        return super.getGreeting() + ' zhang san'
    }
}
Object.setPrototypeOf(friend, person)
console.log(friend.getGreeting()) 

// 成功
let friend = {
    getGreeting () {
        return super.getGreeting() + ' zhang san'
    }
}
```

**super 在多重继承的场景下十分有用**

- 若使用es5写法,最后会报错
  - 如下面的例子， 最后一行代码执行时, this是relative, relative的原型是friend对象，当执行relative的getGreeting方法时，会调用friend的getGreeting()方法，而此时的this值为relative，Object.getPrototypeOf(this)又会返回friend对象。所以就会进入递归调用直到触发栈溢出报错

```js
let person = {
    getGreeting() {
        return 'Hello'
    }
}

let friend = {
    getGreeting: function () {
        return Object.getPrototypeOf(this).getGreeting.call(this) + ' zhang san'
    }
}
Object.setPrototypeOf(friend, person)

let relative = Object.create(friend)

console.log(person.getGreeting()) // Hello zhang san
console.log(friend.getGreeting()) // Hello zhang san
console.log(relative.getGreeting()) // 报错
```

- super则不会出现该问题
  - Super引用不是动态变化的，它总是指向正确的对象，在这个示例中，无论有多少其他方法继承了getGreeting方法，super.getGreeting()始终指向person.get-Greeting()方法。

### 正式的方法定义

- 在ECMAScript 6以前从未正式定义“方法”的概念，方法仅仅是一个具有功能而非数据的对象属性。而在ECMAScript 6中正式将方法定义为一个函数，它会有一个内部的[[HomeObject]]属性来容纳这个方法从属的对象

```js
let person = {
    // 是方法有 [[HomeObject]] 属性
    getGreeting() {
        return 'Hello'
    }
}

// 没有[[HomeObject]] 属性因为是 函数
function otherGreeting() {
    return 'Hi'
}
```

- super的实现就基于[[HomeObject]] 属性
  - 第一步是通过[[HomeObject]]属性确定对象， 
  - 之后调用Object.getPrototypeOf()方法来检索原型的引用；
  - 然后搜寻原型找到同名函数；最后，设置this绑定并且调用相应的方法

```js
/*
以下面代码为例
friend.getGreeting()方法的[[HomeObject]]属性值是friend，
friend的原型是person，
所以super.getGreeting()等价于person.getGreeting.call(this)。
*/

let person = {
    getGreeting() {
        return 'Hello'
    }
}

let friend = {
    getGreeting() {
        return super.getGreeting() + ' zhang san'
    }
}
Object.setPrototypeOf(friend, person)
```

## 5 解构: 使数据访问更便捷

### 为何使用解构功能

- 在es5中，为了从对象和数组中获取数据并赋值变量，需要编写许多同质化的代码

```js
let options = {
    repeat: true,
    save: {
        value: true
    }
}
// 需要重复性的编写类似下方的代码， 若是有嵌套解构，则还会逐级访问
const repeat = options. repeat,
      value = options.save.value

console.log(repeat, value); // true true
```

### 对象解构

- 若使用var let const 等声明解构时,右侧必须有值 ；右侧表达式的值不能为 null 或 undefined

```js
let node = {
    type: 'Identifier',
    name: 'foo'
}

let {type, name} = node
console.log(type, name) // Identifier foo

```

#### 解构赋值

- 也就是可以在定义变量后使用解构的方式，修改他们得值
  - 注意： 使用这种方式时，需要用小括号包裹花括号，因为语法规定代码块不能出现在赋值语句左侧，添加小括号后，将块语句转为表达式，则解决该问题

```js
let node = {
    type: 'Identifier',
    name: 'foo'
},type = 5, name = 6
// 重新赋值 整体需要用括号包裹， 且与上一条语句需要用;号隔开
;({type, name} = node)
console.log(type, name) // Identifier foo


// 上述写法可以用在任意位置， 如给函数传值时，也可以使用
let node = {
    type: 'Identifier',
    name: 'foo'
},type = 5, name = 6
function showTime(val) {
    console.log(val === node)  // true
}
showTime({type, name} = node) // 在调用过程中完成了重新赋值
console.log(type, name) // Identifier foo

```

#### 默认值

- 当属性值不存在时 ，会赋值为undefined
- 可以给属性设置默认值， 当没有该属性或者该属性值为undefined时该值才生效

```js
let node = {
    type: 'Identifier',
    name: 'foo'
}
// 不存在
let {u, type, name} = node
console.log(type, name, u) // Identifier foo undefined
// 赋值默认值
let {d = 'default'} = node
console.log( d) // default
```

#### 为非同名局部变量赋值

- 可以使用 **冒号** 将原有名称赋值给其他名称的变量， 能够与默认值一同使用

```js
let node = {
    type: 'Identifier',
    name: 'foo'
}
let {type: tp, name, u: cc = 'default'} = node
console.log(tp, name, cc) // Identifier foo default

```

#### 嵌套对象解构

- 通过冒号与花括号共同使用的模式，可以解构更深层级的对象，且可以与上文提及的写法一同使用

```js
const obj = {
    name: {
        first: 'zhangsan',
        second: 'lisi'
    },
    age: {
        one: 16,
        two: {
            next: 1
        }
    }
}
// :{} 解构name下的对象
let {name: {first}} = obj
let {age: {two: tw}} = obj
console.log(first, tw) // zhangsan {next: 1}
```

- 注： 下面这种写法虽然不报错，但没有任何实际含义

```js
let {name:{}} = obj
```



### 数组解构

- 优点是不像对象解构一样，使用对象的命名属性，它的名称可以随意命名，值的顺序与数组顺序一致
- 且如果不想解构的值，可以直接忽略
- 使用var let const 等声明解构时,右侧必须有值 ；右侧表达式的值不能为 null 或 undefined

```js
const arr = ['zhangsan', 'lisi', 'wangwu', 'zhaoliu']
let [name1, name2] = arr
//直接跳过前三个值
let [,,,name4] = arr
console.log(name1, name2, name4) // zhangsan lisi zhaoliu
```

#### 解构赋值

- 与对象解构类型，可以赋值上下文变量，不同点是不需要加括号

```js
let arr = ['zhangsan', 'lisi', 'wangwu'], name = '777'
;[name] = arr
console.log(name) // zhangsan
```

- 基于这一特性，可以用作交换两个变量的值 

```js
// es5 交换值，需要额外变量
let a = 5, b = 6, tmp
tmp = a
a = b
b = tmp
console.log(a, b) // 6 5
let c = 5, d = 6
;[d, c] = [c, d]
console.log(c, d) // 6 5
```

#### 默认值

```js
const arr = ['zhangsan']
let [name1, name2 = 'lisi'] = arr
console.log(name1, name2) // zhangsan lisi
```

#### 嵌套数组解构

- 通过在一个数组中，插入另一个数组，可以进行嵌套解构

```js
const arr = ['zhangsan',['lisi','wangwu']]
let [name1, [name2, name3]] = arr
console.log(name1, name2, name3) // zhangsan lisi wangwu
```

#### 不定元素

- 与不定参数类似，可以通过`...`将其余元素赋予特定变量 (...必须为最后一个条目)
- 通过不定参数，可以完成数组的复制， 替代了concat方法

```js
const arr = ['zhangsan', 'lisi', 'wangwu', 'zhaoliu']
let [name1, ...name2] = arr
//concat克隆
let newname = arr.concat()
// ...克隆
let [...name] = arr

// zhangsan [ 'lisi', 'wangwu', 'zhaoliu' ] [ 'zhangsan', 'lisi', 'wangwu', 'zhaoliu' ] [ 'zhangsan', 'lisi', 'wangwu', 'zhaoliu' ]
console.log(name1, name2, newname, name)
```

### 混合解构

- 可以将对象解构和数组解构混合起来，一同使用
  - 数组嵌套 `:[]` 对象嵌套 `:{}`

```js
const obj = {
    mes: [{
        name: ['zhangsan','li'],
        age: {
            detail: 26
        } 
    }]
}
let {mes:[{name:[name1], age:{detail}}]} = obj
console.log(name1,  detail) // zhangsan 26
```



### 解构参数

- 也就是将解构用在函数传参过程中

**es5**

- 通常会将一些参数放在对象中传入，函数，但这样的问题是， 仅查看函数的声明部分，无法辨识函数的预期参数，必须通过阅读函数体才可以确定所有参数的情况

```js
function printPerson(option) {
    console.log(option.name)
    console.log(option.age)
}
printPerson({name: 'zhangsan', age:16})
```

**es6解构**

- 解构参数能够解决上述问题

```js
function printPerson({name, age}) {
    console.log(name) // zhangsan
    console.log(age) // 16
}
printPerson({name: 'zhangsan', age:16})
```

- 但是解构参数时若不传值，会报错

```js
printPerson() // 报错

// js引擎相当于在函数内执行了如下操作
function printPerson(option) {
    // 此时option为undefined 所以报错
    let {name, age} = option
    // ...
}
```

- 可通过为解构赋默认值的方式解决该问题

```js
function printPerson({name, age} = {}) {
    console.log(name) // undefined
    console.log(age) // undefined
}
printPerson() 
```

#### 解构参数的默认值

- 只需在参数后添加等号并且指定一个默认值即可
- 当与解构赋值语句一同使用时可以提取公共对象，简化代码

```js
// 解构参数默认值
function printPerson({name = 'zhangsan', age = 18}) {}

// 与解构赋值一起使用
function printPerson({name = 'zhangsan', age = 18} = {name: 'zhangsan', age: 18}) {}

// 冗余代码较多， 可以提取为默认值对象， 如果要改变默认值，可以在defaultPerson中修改，改变的数据将自动同步到所有出现过的地方。
let defaultPerson = {
    name: 'zhangsan',
    age: 18
}
function printPerson({
    name = defaultPerson.name,
    age = defaultPerson.age
} = defaultPerson) {}

```



## 6 Symbol和Symbol属性

>  在ECMAScript 5及早期版本中，语言包含5种原始类型：字符串型、数字型、布尔型、null和undefined。ECMAScript 6引入了第6种原始类型：Symbol

### 创建Symbol

- 由于Symbol是原始值，因此调用new Symbol()会导致程序抛出错误， 应直接使用Symbol() 创建
- 若想访问属性， 必须使用最初定义的Symbol访问

```js
let firstName = Symbol()
let person = {}
person[firstName] = 'Zhang'

console.log(person[firstName]) // Zhang
```

- Symbol函数接受一个可选参数， 可定义当前Symbol的描述信息, 描述被被存储在内部的[[Description]]属性中，只有当调用Symbol的toString()方法时才可以读取这个属性。在执行console.log()时隐式调用了firstName的toString()方法，所以它的描述会被打印到日志中，但不能直接在代码里访问[[Description]]
- typeof 可用作判断Symbol

```js
let firstName = Symbol('first name')
let person = {}
person[firstName] = 'Zhang'

// 注： 这里与书中描述不一致， 并未返回字符串而是直接返回相应的Symbol类型
console.log(firstName) // Symbol(first name)

console.log(typeof firstName) // 'symbol'
```

### Symbol的使用方法

- Symbol也可以用于可计算对象字面量属性名、Object.defineProperty()方法和Object.defineProperties()方法的调用过程中

```js
let firstName = Symbol('first name')
let person = {
    [firstName]: 'Zhang'
}
// Object.defineProperty 与 Object.defineProperties 可用于定义新属性，或修改对象的现有属性， 返回值为该对象 (区别是 defineProperty 定义单个属性，defineProperties 可定义多个属性 )
Object.defineProperty(person, firstName, {
    // 只读，不可写
    writable: false
})
let lastName = Symbol('last name')
Object.defineProperties(person, {
    [lastName]: {
        // 设置值
        value: 'san',
    // 只读，不可写
        writable: false
    }
})
console.log(person[firstName], person[lastName]) // Zhang san

```

### Symbol共享体系

> 有时我们会可能会在不同对象中使用相同的Symbol来定义属性， 但如果在较大的代码库中或跨文件追踪Symbol是十分困难的，与是ES6提供了一个可以随时访问的Symbol注册表

**Symbol.for()**

- 该方法创建一个可共享的Symbol, 同一接收一个参数作为描述， 同样该描述具有键的作用， 若全局Symbol注册表中，存在该键的Symbol，则返回该Symbol， 不存在则创建一个新的Symbol

```js
let uid = Symbol.for('uid')
let obj = {
    [uid]: 123456
}
// 返回已有Symbol
let uid2 = Symbol.for('uid')
console.log(obj[uid]) // 123456
console.log(uid === uid2) // true
```

**Symbol.keyFor()**

- 接受一个变量，一般传入Symbol ，返回从全局注册表中得到的键

```js
let uid = Symbol.for('uid')
let uid2 = Symbol.for('uid')
// 非全局Symbol
let uid3 = Symbol('uid')
console.log(Symbol.keyFor(uid)) // 'uid'
console.log(Symbol.keyFor(uid2)) // 'uid'
// 不在全局表中所以返回 undefined
console.log(Symbol.keyFor(uid3)) // undefined
```

### Symbol与类型强制转换

```js
// 存在toString方法， 可以通过 String   默认调用
let uid = Symbol('uid-symbol')
// 不填写描述符则返回 Symbol()
String(uid) // 'Symbol(uid-symbol)'
uid.toString()// 'Symbol(uid-symbol)'

// 不可拼接字符串
console.log('' + uid) // 报错
// 不可使用Number() 或 运算符
console.log(Number(uid)) // 报错
console.log(uid / 2) // 报错

```



### Symbol属性检索

- es5中 Object.keys()方法和Object.getOwnPropertyNames()方法可以检索对象中所有的属性名：前一个方法返回所有可枚举的属性名；后一个方法不考虑属性的可枚举性一律返回。
- 然而为了保持ECMAScript 5函数的原有功能，这两个方法都不支持Symbol属性，
- 在ECMAScript 6中添加一个Object.getOwnPropertySymbols()方法来检索对象中的Symbol属性。

```js
let uid = Symbol.for('uid')
let obj = {
    [uid]: 123456
}
let symbols = Object.getOwnPropertySymbols(obj)
console.log(symbols) // [Symbol(uid)]
```

> 所有的对象默认都不会有Symbol属性，但可以通过原型链继承， ES6中通过well-known预定义了这些属性， 下文介绍

### 通过well-known Symbol暴露内部操作

> ECMAScript 6开放了以前JavaScript中常见的内部操作，并通过预定义一些well-known Symbol来表示。每一个这类Symbol都是Symbol对象的一个属性
>
> 注： 也就是说可以通过这些开放的Symbol，改变或增强原来默认的行为

well-known Symbol包括：

Symbol.hasInstance ； Symbol.isConcatSpreadable； Symbol.iterator（第8章讲解）； Symbol.match ；Symbol.replace ； Symbol.search ； Symbol.species （第9章讲解）； Symbol.split　； Symbol.toPrimitive ；  Symbol.toStringTag ；  Symbol.unscopables

#### Symbol.hasInstance

- 每一个函数中都有一个Symbol.hasInstance方法，用于确定对象是否为函数的实例。该方法在Function.prototype中定义，所以所有函数都继承了instanceof属性的默认行为。
- 该方法接收一个参数， 即要检查的值， 在es6中， instanceof 本质上是该方法的简写语法

```js
let arr = []
console.log(arr instanceof Array) // true

// 等价于

console.log(Array[Symbol.hasInstance](arr)) // true
```

- 为了确保Symbol.hasInstance不会被意外重写，该方法被定义为不可写、不可配置并且不可枚举 

```js
// 重新赋值 ，然而打印后值未改变，证明了不可写
Array[Symbol.hasInstance] = 1
console.log(Array[Symbol.hasInstance]) // [Function: [Symbol.hasInstance]]
```

- 但能够通过Object.defineProperty 改变这种默认行为

```js
// 此处展示了改变默认行为后， 即使obj 是 MyObject的实例，也返回false

function MyObject() {
}
let obj = new MyObject()
console.log(obj instanceof MyObject) // true

// 改变行为

Object.defineProperty(MyObject, Symbol.hasInstance, {
    // 因为Symbol.hasInstance是方法，所以这里value对值是函数，函数返回值就是方法执行后的结果
    value: function (v) {
        return false
    }
})
// 行为被改变
console.log(obj instanceof MyObject) // false
```

- 基于这一特点，可以用通过在函数中任意添加条件来返回想要的结果

```js
function SpecialNumber() {}
Object.defineProperty(SpecialNumber, Symbol.hasInstance, {
    value: function (v) {
        // 判断是否是number实例， 并判断是否在范围内
        return v instanceof Number && (v >= 1 && v <= 100)
    }
})

const one = new Number(0)
const two = new Number(1)

console.log(one instanceof SpecialNumber) // false
console.log(two instanceof SpecialNumber) // true
```

> 可以重写所有内建函数（例如Date和Error函数）的默认Symbol.hasInstance属性， 但这样不推荐该写法， 最后的方式是只在必要情况下，修改自己定义的构造函数的Symbol.hasInstance

#### Symbol.isConcatSpreadable

- js 数组的concat方法可以用于拼接多个数组， 他拥有以下行为

```js
const arr = [1,3,5], arr1 = [2,4,6]
// concat 接收数组时，会将其中的每一个元素添加到新数组末尾
const arr2 = arr.concat(arr1)
console.log(arr2) // [ 1, 3, 5, 2, 4, 6 ]
// 也可以直接接收非数组元素
const arr3 = arr.concat(arr1, 3,5)
console.log(arr3) // [ 1, 3, 5, 2, 4, 6, 3, 5]


```

- es6提供了 Symbol.isConcatSpreadable
  - 属性是一个布尔值，如果该属性值为true，则表示对象有length属性和数字键
  - 这个Symbol属性默认情况下不会出现在标准对象中，它只是一个可选属性，用于给对象赋予在concat()方法中类似数组的特性

```js
const obj = {
    0: 1,
    1: 2,
    2: 3,
    length: 3,
    // 赋予特性
    [Symbol.isConcatSpreadable]: true
}
const arr = [6, 6, 6].concat(obj)
// 拼接成功
console.log(arr) // [ 6, 6, 6, 1, 2, 3 ]

```

> 将Symbol.isConcatSpreadable设置为false，就可防止元素在调用concat()方法时被分解， 第九章将会使用该方式

#### Symbol.match、Symbol.replace、Symbol.search、Symbol.split

- js  字符串的 match, replace, search, split方法， 可以接收正则表达式作为参数，但不能使用自定义的对象作为参数

在es6中， 定义了与上述四个方法相对应的Symbol， 在对象中使用后， 该对象就可以作为方法参数使用

- Symbol.match　接受一个字符串类型的参数，如果匹配成功则返回匹配元素的数组，否则返回null
-  Symbol.replace　接受一个字符串类型的参数和一个替换用的字符串，最终依然返回一个字符串。
-  Symbol.search　接受一个字符串参数，如果匹配到内容，则返回数字类型的索引位置，否则返回-1。
- Symbol.split　接受一个字符串参数，根据匹配内容将字符串分解，并返回一个包含分解后片段的数组。

```js
let hasLengthOf10 = {
    [Symbol.match]: function(value) {
        return value.length === 10 ? [value] : null
    },
    [Symbol.replace]: function(value, target) {
        return value.length === 10 ? target : value
    },
    [Symbol.search]: function(value) {
        return value.length === 10 ? 0 : -1
    },
    [Symbol.split]: function(value) {
        return value.length === 10 ? ["",""] : [value]
    }
}

let mes1 = 'Hello word', mes2 = 'Hello wangwu'
// [ 'Hello word' ] null
console.log(mes1.match(hasLengthOf10), mes2.match(hasLengthOf10))
// undefined Hello wangwu 
console.log(mes1.replace(hasLengthOf10), mes2.replace(hasLengthOf10))
// 0 -1
console.log(mes1.search(hasLengthOf10), mes2.search(hasLengthOf10))
[ '', '' ] [ 'Hello wangwu' ]
console.log(mes1.split(hasLengthOf10), mes2.split(hasLengthOf10))
```

#### Symbol.toPrimitive

- 在JavaScript引擎中，当执行特定操作时，会将对象转换到相应的原始值, 例如，比较一个字符串和一个对象，如果使用双等号（==）运算符，对象会在比较操作执行前被转换为一个原始值。到底使用哪一个原始值以前是由内部操作决定的，但在ECMAScript 6的标准中，通过Symbol.toPrimitive方法可以更改那个暴露出来的值
- Symbol.toPrimitive方法被定义在每一个标准类型的原型上，并且规定了当对象被转换为原始值时应当执行的操作。每当执行原始值转换时，总会调用Symbol.toPrimitive方法并传入一个值作为参数，这个值在规范中被称作类型提示（hint）。类型提示参数的值只有三种选择："number"、"string"或"default"，传递这些参数时，Symbol.toPrimitive返回的分别是：数字、字符串或无类型偏好的值。

- 对于大多数标准对象，数字模式有以下特性
  - 1.调用valueOf()方法，如果结果为原始值，则返回。
  - 2.否则，调用toString()方法，如果结果为原始值，则返回。
  - 3.如果再无可选值，则抛出错误。
- 同样，对于大多数标准对象，字符串模式有以下优先级排序：
  - 1.调用toString()方法，如果结果为原始值，则返回。
  - 2.否则，调用valueOf()方法，如果结果为原始值，则返回。
  - 3.如果再无可选值，则抛出错误。
- 在大多数情况下，标准对象会将默认模式按数字模式处理（除了Date对象，在这种情况下，会将默认模式按字符串模式处理）。
- 如果自定义Symbol.toPrimitive方法，则可以覆盖这些默认的强制转换特性。

> 默认模式只用于==运算、+运算及给Date构造函数传递一个参数时。在大多数的操作中，使用的都是字符串模式或数字模式。

```js
// 注： 这里将Symbol.toPrimitive写在了构造函数的原型上， 实际上直接写在对象字面量上， 也可以覆盖原有原型上的Symbo.toPrimitive方法

function Person(name) {
    this.name = name
}
Person.prototype[Symbol.toPrimitive] = function(hint) {
    switch(hint) {
      case 'string':
            return this.name + 'Symbol'
      case 'number':
            return 666
      default: 
            return this.name + 'Default'
    }
}

const person = new Person('zhangsan')
// 默认模式
console.log('' + person) // zhangsanDefault
// 数字模式
console.log(person / 2) // 666
// 字符模式
console.log(String(person)) // zhangsanSymbol

```

#### Symbol.unscopables

- 在es5 中with具有如下行为
  - 如下所示 color和values 来源于外部的局部变量

```js
var values = [1, 2, 3],
colors = ['red', 'yellow', 'blur'],
color = 'pink'
with(colors) {
    push(color)
    push(...values)
}
// [ 'red', 'yellow', 'blur', 'pink', 1, 2, 3 ]
console.log(colors);
```

- 在es6中 数组新增了values方法（第8章介绍）,因此，此时若不做处理，在上述代码中 values引用的就是数组本身的values，而不是外部的外部得变量，这显示会与原本目标不符， 因此es6 添加了Symbol.unscopables来解决这个问题，从而保证老代码继续运行不出错
- Symbol.unscopables是以对象的形式出现的，它的键是在with语句中要忽略的标识符，其对应的值必须是true
  - 示例如下

```js
// 此处代码已默认内置到了es6中
Array.prototype[Symbol.unscopables] = Object.assgin(Object.create(null), {
    // 以下标识符都将被忽略（都是es6中新增的方法）
    copyWithin: true,
    entries: true,
    fill: true,
    find: true,
    findIndex: true,
    keys: true,
    values: true
})
```



## 7 Set与Map集合

- Set集合是一种无重复元素的列表
- Map集合内含多组键值对，集合中每个元素分别存放着可访问的键名和它对应的值

### ES5中的Set集合与Map集合

```js
// 模拟Set集合
var set = Object.create(null)
set.foo = true
// 检查属性是否存在
if (set.foo) {
    // 要执行的代码
}
// 模拟Map集合
var map = Object.create(null)
map.foo = 'bar'
// 获取保存的值
var value = map.foo
console.log(value) // 'bar'
```

### 该解决方案的一些问题

- 属性名会被自动转换成字符串类型， 所以还需要确保字符串是唯一的

  - 如 `obj['5']` 和 `obj[5]`是同一个属性
  - 当使用对象作为属性名会出现同样问题 如下所示：

  ```js
  // 所有的对象作为属性值 都等于  '[object Object]' 
  const obj = Object.create(null)
  let obj1 = {}, obj2 = {}
  obj[obj1] = 'foo'
  console.log(obj[obj2]) // 'foo'
  ```

- 当属性值为 数字时， 如 0, 在使用 if验证时 ，就会强制转换为false引发问题
  - 可以通过 in  （因为会判断原型，所有最好用于无原型对象） 或 对象的hasOwnproperty（该方法从原型继承，所以要求有原型）方法 判断是否存在属性

### ECMAScript 6中的Set集合

#### 创建Set集合并添加元素

- 不存在类型转换 （在引擎内部使用Object.is检测两个值是否一致， 唯一类外的是 +0 ,-0 这两个值在Object.is中返回false，但在Set集合中，被认为相等）， 且添加多个对象时可以保持独立， 若添加相同值，则后面的调用会被忽略

````js
const set = new Set()
// 添加 : add方法
set.add(5)
set.add('5')
// set长度： size属性
// 5 和 '5'作为独立元素被添加
console.log(set.size) // 2

const key1 = {}, key2 = {}
set.add(key1)
set.add(key2)
// 不同对象保持独立
console.log(set.size) // 4

set.add(5) // 被忽略
console.log(set.size) // 4
````

- 可以通过数组直接初始化Set集合, 通过 has方法可以判断值是否存在

```js
const set = new Set([1,3,5,'666'])
console.log(set.size) // 4

console.log(set.has('3')) // false
console.log(set.has(3)) // true
```

> Set构造函数可以接受所有可迭代对象作为参数，数组、Set集合、Map集合都是可迭代的，因而都可以作为Set构造函数的参数使用；构造函数通过迭代器从参数中提取值。第8章将详细讲解可迭代协议和迭代器协议。

#### 移除元素

- clear 方法移除所有元素 , delete 方法移除指定元素

```js
const set = new Set([1,3,5])
console.log(set.has(3)) // true
console.log(set.size) // 3
set.delete(3)  
console.log(set.has(3)) // false
set.clear()
console.log(set.size) // 0

```

#### Set集合的forEach方法

- 用于遍历Set集合,接收两个参数
  - 一是回调函数接收三个参数
    - 元素值
    - 与第一个参数相同的值
    - 被遍历的Set集合本身
  - 参数二可选， 该参数会作为回调函数内的this
    - 不传递第二个参数时，回调函数默认this为 set自身，可以使用箭头函数，则this直接从外围对象读取

```js
const set = new Set([1,3,5])
const obj = {
    name: 'zhangsan'
}
set.forEach(function(value, key, ownerset) {
    console.log(key + '  ' + value)
    console.log(set === ownerset)
    console.log(this.name)
}, obj)

/* 输出结果
1  1
true
zhangsan
3  3
true
zhangsan
5  5
true
zhangsan
*/
```

#### 将Set集合转换为数组

- 可以通过展开运算符进行转换

```js
const set = new Set([1,3,5])
const arr = [...set]
console.log(arr) // [1,3,5]
```

- 展开运算与set集合使用，可以用来创建一个去重后的新数组

```js
function delRepeat(arr) {
    return [...new Set(arr)]
}
const arr = [1,3,5,6,6,6,7,8,9,9]
console.log(delRepeat(arr)) // [1, 3, 5, 6, 7, 8, 9]
```

#### Weak Set集合

- 将对象存储在Set的实例与存储在变量中完全一样，只要Set实例中的引用存在，垃圾回收机制就不能释放该对象的内存空间，于是之前提到的Set类型可以被看作是一个强引用的Set集合

```js
let set = new Set(), key = {}
// 存储key对象
set.add(key)
console.log(set.size) // 1
key = null // 移除原始引用
// set内的对象引用依然存在
console.log(set.size) // 1 
// 因为可以再次取回原始引用
key = [...set][0]
```

- 然而，有时我们会希望当其他引用不存在时， Set集合中的引用也随之消失
  - 比如，在Web页面中使用变量记录了一些DOM元素， 元素后续可能会被另一段脚本移除， 此时我们不在希望变量保留这些DOM元素的引用 (可以通过赋值变量为null，消除引用),若忘记清除引用，就会造成内存泄漏
- ES6中引入了 `Weak Set`集合，**它只保存对象的弱引用， 不可以存储原始值**，集合中的弱引用如果是对象的唯一引用，则对象会被自动回收，并释放内存

**创建Weak Set集合**

- 支持三个方法 add; has; detele

```js
let set = new WeakSet(), key = {},key2 = {}
set.add(key)
console.log(set.has(key)) // true
set.delete(key)
console.log(set.has(key)) // false

// 同样可以通过传入可迭代对象的方式创建Weak set
let set2 = new WeakSet([key, key2])
console.log(set2.has(key2)) // true
//这时移除key2的引用
key2 = null
//  set2中的引用同时被移除， 但 由于has方法需要传递一个强引用才能证明是否有引用，由于key2已被清空，所以测试难以进行， 但实际上，Weak Set一定会正确移除引用
```

**与Set集合的其他区别**

- 如果向add()方法传入非对象参数会导致程序报错，而向has()和delete()方法传入非对象参数则会返回false 。

- WeakSet不可迭代， 
  - 所以不能用于 for...of循环， 不暴露迭代器（keys和values方法）, 不支持forEach方法， 不支持Size属性，没有Clear方法

### ECMAScript 6中的Map集合

- ECMAScript 6中的Map类型是一种储存着许多键值对的有序列表，其中的键名和对应的值支持所有的数据类型，键名等价性同样通过Object.is判断

#### Map集合支持的方法

- `set(key, value)`设置 
- `get(key)` 获取   
- `has(key)` 检查是否存在
- `delete(key)`删除
- `clear(key)`清空
- `size` 属性返回数量

```js
const map = new Map(),key = {}, num = 5
map.set(key, 6)
map.set(num, 9)
console.log(map.has(key)) //true
console.log(map.size) // 2
console.log(map.get(key)) // 6
map.delete(num)
console.log(map.size) // 1
map.clear()
console.log(map.size) // 0

```

#### Map集合的初始化方法

- 一般通过二维数组批量添加数据， 原因是因为Map不会类型转换，所以为了保持键值对的类型不变化，每一组键值都用数组来保持

```js
const map = new Map([['5',6],[7,9],[{}, 'a']])
console.log(map.size) // 3
```

#### Map集合的forEach方法

- Set集合基本一致， 接收一个回调，一个this值， 回调有三个参数
  - 当前value
  - 当前key
  - 集合本身

```js
const map = new Map([['5',6],[7,9]])
map.forEach(function(value, key, ownerset) {
    console.log(key + '...' + value + ', ' + ownerset )
})
// 
```

#### Weak Map集合

- 与 Weak Set 类似 。 ，Weak Map是弱引用Map集合，也用于存储对象的弱引用。Weak Map集合中的键名必须是一个对象，如果使用非对象键名会报错，当对象不存在其他强引用时，引擎的垃圾回收机制会自动回收这个对象，同时也会移除Weak Map集合中的键值对

**使用Weak Map集合保存DOM元素**

- 支持set, get, has, delete方法， 同样不支持枚举，所以没有forEach, size,clear等方法

```js
let map = new WeakMap()
, element = document.querySelector('.element')
map.set(element, 'original')
console.log(map.get(element)) // original
//移除DOM元素，
//首先移除文档中的DOM
element.parent.removeChild(element)
// 之后移除变量上赋予的DOM
element = null
// 此时WeakMap集合为空


// WeakMap初始化方法， 与Map集合一致 ，只不过key必须是非null的对象
let key = {}, key2 = {}
let map2 = new WeakMap([[key,'Hello'],[key2,66]])
```

##### WeakMap创建私有属性

- 下划线写法，约定俗成，并不真实私有

```js
function Person(name) {
    this._name = name
}
Person.prototype.getName = function() {
    return this._name
}
```

- es5通过IIFE 使用如下写法定义私有属性
  - privateData对象储存的是每一个实例的私有信息，privateId则为每个实例生成一个独立ID。当调用Person构造函数时，属性_id的值会被加1，这个属性不可枚举、不可配置并且不可写，在IIFE外无法访问privateData对象， 即使可以访问this._id，对象依然很安全,

```js
var Person = (function() {
    var privateData = {},
        privateId = 0
    function Person(name) {
        Object.defineProperty(this, '_id', {
            value: privateId++
        })
        privateData[this._id] = {
            name:name
        }
    }
    Person.prototype.getName = function() {
        return privateData[this._id]
    }
    return Person
}())

```

> 该方式存在的问题， 如果不主动管理，由于无法获知实例是否被销毁， privateData中的数据永远不会消失



- 通过WeakMap可以解决上述问题
  - 当实例被销毁时， 数据随之消失

```js
let Person = (function() {
    let privateData = new WeakMap()
    function Person(name) {
        // 保存每个实例
        privateData.set(this, {
            name:name
        })
    }
    Person.prototype.getName = function() {
        return privateData.get(this).name
    }
    return Person
}())
```

## 8 迭代器(Iterator)和生成器(Generator)

### 循环语句问题

- 一段循环语句如下所示， 虽然语法简单， 但是如果多个循环嵌套就需要注意循环变量命名， 如果一旦变量名称错误使用就会引发程序问题

```js
var colors = ['red', 'green', 'blue']
for (var i = 0; i < colors.length; i++) {
    console.log(colors[i])
}
```

### 什么是迭代器

- 迭代器是一种特殊对象，它具有一些专门为迭代过程设计的专有接口
- 所有的迭代器对象都有一个**next()方法，每次调用都返回一个结果对象**。
- 结果对象有两个属性：一个是**value，表示下一个将要返回的值**；另一个是**done，它是一个布尔类型的值，当没有更多可返回数据时返回true**。迭代器还会保存一个内部指针，用来指向当前集合中值的位置，每调用一次next()方法，都会返回下一个可用的值。
- 如果在最后一个值返回后再调用next()方法，那么返回的对象中属性done的值为true，属性value则包含迭代器最终返回的值，这个返回值不是数据集的一部分，它与函数的返回值类似，是函数调用过程中最后一次给调用者传递信息的方法，如果没有相关数据则返回undefined。

**es5语法创建迭代器**

```js
function createIterator(items) {
    var i = 0
    return {
        next: function() {
            var done = (i >= items.length)
            var value = !done ? items[i++] : undefined
            return {
                value: value,
                done: done
            }
        }
    }
}

var iterator = createIterator([1,2,3])
console.log(iterator.next())  // {value: 1, done: false}
console.log(iterator.next())  // {value: 2, done: false}
console.log(iterator.next())  // {value: 3, done: false}
console.log(iterator.next())  // {value: undefined, done: true}
// 之后调用返回相同内容
console.log(iterator.next())  // {value: undefined, done: true}
```

> 上面这个示例很复杂，在ECMAScript 6中，迭代器的编写规则也同样复杂，但ECMAScript 6同时还引入了一个生成器对象，它可以让创建迭代器对象的过程变得更简单。

### 什么是生成器

- 生成器是一种返回迭代器的函数，通过function关键字后的星号（*）来表示，函数中会用到新的关键字yield。星号可以紧挨着function关键字，也可以在中间添加一个空格
  - 特点：每当执行完一条yield语句后函数就会自动停止执行， 直到再次调用迭代器的next()方法才会继续执行

```js
function *createIterator() {
    yield 1
    yield 2
    yield 3
}
// 生成器的调用方式与普通函数相同， 只不过返回的是迭代器
let iterator = createIterator()
console.log(iterator.next().value) // 1
console.log(iterator.next().value) // 2
console.log(iterator.next().value) // 3
```

- yield可以返回任何值或表达式，因此可以批量的为迭代器添加元素， 例如：在循环中使用yield

```js
function *createIterator(items) {
    for (let i = 0; i < items.length; i++) {
        yield items[i]
    }
}
let iterator = createIterator([1,2,3])
console.log(iterator.next().value) // 1
console.log(iterator.next().value) // 2
console.log(iterator.next().value) // 3
```

- 使用限制 , yield函数只能在生成器内部使用, 如果用在生成器内部的函数中， 同样会抛出错误

```js
function *createIterator(item) {
    item.forEach(function() {
        // 语法错误， 内部函数
        yield item + 1
    })
}
```

#### 生成器函数表达式

- 上面介绍了生成器 函数声明 的写法， 生成器函数表达式的写法与函数声明基本一致，如下所示

```js
var createIterator = function *() {
    yield 1
    yield 2
    yield 3
}
```

> 生成器不能使用箭头函数创建

#### 生成器对象的方法

- 由于生成器本身就是函数，因而可以将它们添加到对象中

**es5写法**

```js
let o = {
    createIterator: *function() {
        yield 1
    }
}
console.log(o.createIterator())
```

**es6写法**

```js
let o = {
    *createIterator() {
        yield 1
    }
}
console.log(o.createIterator())
```

### 可迭代对象和for-of循环

- 可迭代对象具有Symbol.iterator属性, 它为对象定义了默认的迭代器。
- 在ECMAScript 6中，所有的集合对象（数组、Set集合及Map集合）和字符串都是可迭代对象,这些对象中都有默认的迭代器
- ECMAScript中新加入的特性for-of循环，就会使用默认迭代器

> 由于生成器会默认为Symbol.iterator赋值， 所以所有生成器返回的迭代器,都是可迭代对象 （同样也可以用for..of循环）

- for-of循环每执行一次都会调用可迭代对象的next()方法，并将迭代器返回的结果对象的value属性存储在一个变量中， 直到done返回true为止(返回true时循环直接退出，不会赋值)

```js
const arr = [1,2,3]
for (const num of arr) {
    console.log(num)
}
/*
1
2
3
*/
```

> for...of用于 不可迭代对象 或null，undefined 会抛出错误

#### 访问默认迭代器

- 通过Symbol.iterator访问默认迭代器

```js
const arr = [1,2,3]
//调用时会返回可迭代对象
const iterator = arr[Symbol.iterator]()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }

```

- 由于可迭代对象都有Symbol.iterator属性， 所以可以用它来检测对象是否可迭代

```js
function isIterator(object) {
    return typeof object[Symbol.iterator] === 'function'
}
console.log(isIterator([1,2,3])) // true
console.log(isIterator('ab')) // true
console.log(isIterator(new Map())) // true
console.log(isIterator(new Set())) // true
console.log(isIterator(new WeakMap())) // false
console.log(isIterator(new WeakSet())) // false
```

#### 创建可迭代对象

- 默认情况下，开发者定义的对象都是不可迭代对象，但如果给Symbol.iterator属性添加一个生成器，则可以将其变为可迭代对象

```js
let obj = {
    items: [],
    *[Symbol.iterator]() {
        for (let item of this.items) {
            yield item
        }
    }
}
obj.items.push(1,3,5)
// 迭代obj对象
for (let i of obj) {
    console.log(i)
}
/*
1
3
5
*/
```

### 内建迭代器 

### 集合对象迭代器

- 数组， Map集合， Set集合,这3种对象内建了以下三种迭代器
  -  entries()　返回一个迭代器，其值为多个键值对。
  -  values()　返回一个迭代器，其值为集合的值。·
  - keys()　返回一个迭代器，其值为集合中的所有键名。

#### entries()迭代器

- 每次调用next()方法时，entries()迭代器都会返回一个数组，数组中的两个元素分别表示集合中每个元素的键与值。如果被遍历的对象是数组，则第一个元素是数字类型的索引；如果是Set集合，则第一个元素与第二个元素都是值（Set集合中的值被同时作为键与值使用）；如果是Map集合，则第一个元素为键名。

````js
let colors = ['red', 'yellow']
let map = new Map([[1, '2'], [true, 7]])
let set = new Set([56,'37'])
for (let entry of colors.entries()) {
    console.log(entry)
}
for (let entry of map.entries()) {
    console.log(entry)
}
for (let entry of set.entries()) {
    console.log(entry)
}
/*
[ 0, 'red' ]
[ 1, 'yellow' ]
[ 1, '2' ]
[ true, 7 ]
[ 56, 56 ]
[ '37', '37' ]
*/
````

#### values()迭代器

- 返回集合中所存在值

```js
let colors = ['red', 'yellow']
let map = new Map([[1, '2'], [true, 7]])
let set = new Set([56,'37'])
for (let value of colors.values()) {
    console.log(value)
}
for (let value of map.values()) {
    console.log(value)
}
for (let value of set.values()) {
    console.log(value)
}
/*
'red'
'yellow'
'2'
7
56
'37'
*/
```

#### keys()迭代器

- keys()迭代器会返回集合中存在的每一个键。如果遍历的是数组，则会返回数字类型的键，数组本身的其他属性不会被返回；如果是Set集合，由于键与值是相同的，因此keys()和values()返回的也是相同的迭代器；如果是Map集合，则keys()迭代器会返回每个独立的键

```js
let colors = ['red', 'yellow']
let map = new Map([[1, '2'], [true, 7]])
let set = new Set([56,'37'])
for (let key of colors.keys()) {
    console.log(key)
}
for (let key of map.keys()) {
    console.log(key)
}
for (let key of set.keys()) {
    console.log(key)
}
/*
0
1
1
true
56
'37'
*/
```

#### 默认迭代器

- 每个集合类型都有一个默认的迭代器，在for-of循环中，如果没有显式指定则使用默认的迭代器。数组和Set集合的默认迭代器是values()方法，Map集合的默认迭代器是entries()方法

```js
let colors = ['red', 'yellow']
let map = new Map([[1, '2'], [true, 7]])
let set = new Set([56,'37'])
for (let value of colors) {
    console.log(value)
}
for (let entry of map) {
    console.log(entry)
}
for (let value of set) {
    console.log(value)
}
/*
'red'
'yellow'
[ 1, '2' ]
[ true, 7 ]
56
'37'
*/
```

#### for...of和解构

- for...of配合解构使用可以简化entries()的迭代

```js
let map = new Map([[1, '2'], [true, 7]])
for (let [key, value] of map) {
    console.log(key + '...' + value)
}
/*
1...2
true...7
*/
```

### 字符串迭代器

- es5中规定，字符串可以通过方括号访问字符串中的字符， 但是第二章提到过，双字节字符无法正确访问

```js
var text = 'a𠮷b'
for(var i = 0; i < text.length; i++) {
    console.log(text[i])
}
/*
a
(空)
(空)
b
*/
```

- es6为字符串提供了默认迭代器， 解决了这个问题

```js
let text = 'a𠮷b'
for(let i of text) {
    console.log(i)
}
/*
a
𠮷
b
*/
```

### NodeList迭代器

- DOM标准中有一个NodeList类型，代表页面文档中所有元素的集合
- NodeList对象和数组之, 二者都使用length属性来表示集合中元素的数量，都可以通过方括号来访问集合中的独立元素；而在内部实现中，二者的表现非常不一致，因而会造成很多困扰
- 自从ECMAScript 6添加了默认迭代器后，DOM定义中的NodeList类型（定义在HTML标准而不是ECMAScript 6标准中）也拥有了默认迭代器，其行为与数组的默认迭代器完全一致。所以可以将NodeList应用于for-of循环及其他支持对象默认迭代器的地方

```js
// 通过调用getElementsByTagName()方法获取到document对象中所有<div>元素的列表，在for-of循环中遍历列表中的每一个元素并输出元素ID
var divs = document.getElementsByTagName('div')
for (let div of divs) {
    console.log(div.id)
}
```

### 展开运算符与非数组可迭代对象

- 第7章，我们通过展开运算符（...）把Set集合转换成了一个数组
- 事实上， 展开运算符可以作用于任意可迭代对象

用于Map集合

```js
let map = new Map([['zhangsan',13], ['lisi', 18]]),
    arr = [...map]
console.log(arr) // [ [ 'zhangsan', 13 ], [ 'lisi', 18 ] ]
```

在数组中重复使用

```js
let arr = [1,3], arr2 = [2,4], arr3 = [6,78],
    allArr = [...arr, ...arr2, ...arr3]
console.log(allArr) // [ 1, 3, 2, 4, 6, 78 ]
```

### 高级迭代器功能

#### 给迭代器传递参数

- 如果给迭代器的next()方法传递参数，则这个参数的值就会替代生成器内部上一条yield语句的返回值
- 注意点：
  - 第一次调用next()方法时无论传入什么参数都会被丢弃， 因为传给next()方法的参数会替代上一次yield的返回值，而在第一次调用next()方法前不会执行任何yield语句，因此在第一次调用next()方法时传递参数是毫无意义的
  - 如下例子所示， 第二次调用next， 传入8 ， 8 +6得到14， 第三次调用 next， 没有传递参数，所以second是undefined,  undefined + 5, 得到NaN

```js
function *createIterator() {
    let first = yield 1
    let second = yield first + 6
    yield second + 5
}
let iterator = createIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(8)) // { value: 14, done: false }
console.log(iterator.next()); // { value: NaN, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

- 生成器代码执行过程

```js
function *createIterator() {
    let first = yield 1
    let second = yield first + 2
    yield second + 3
}
let iterator = createIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(4)) // { value: 6, done: false }
console.log(iterator.next(5)); // { value: 8, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

![yield执行](./img/yield执行.png)



#### 在迭代器中抛出错误

- 通过throw()方法，当迭代器恢复执行时可令其抛出一个错误

```js
function *createIterator() {
    let first = yield 1
    let second = yield first + 2
    yield second + 3
}
let iterator = createIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(4)) // { value: 6, done: false }
console.log(iterator.throw(new Error('boom'))); // 抛出错误
//..后续代码不会再执行
```

![generator-error](./img/generator-error.png)

- 通过try...catch捕获错误， 捕获成功后代码会继续执行

```js
function *createIterator() {
    let first = yield 1
    let second
    try {
        // 在此处捕获错误
        second = yield first + 2
    } catch(ex) {
        // 出错时进行赋值
        second = 6
    }
    yield second + 3
}
let iterator = createIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(4)) // { value: 6, done: false }
// 错误被解决，所以依然相当于调用了next，把剩余代码都执行
console.log(iterator.throw(new Error('boom'))); // // { value: 9, done: false } 
console.log(iterator.next()); // { value: undefined, done: true }
```

#### 生成器返回语句

- 由于生成器也是函数，因此可以通过return语句提前退出函数执行，对于最后一次next()方法调用，可以主动为其指定一个返回值， value会被设置为这个值，done会被设置为true

```js
function *createIterator() {
    yield 1
    return 6
    yield 2
}
let iterator = createIterator()
console.log(iterator.next())  // { value: 1, done: false }
console.log(iterator.next()) // { value: 6, done: true }
```

> 展开运算符与for...of循环会忽略return 的返回值， 只要done变为true就会立刻停止读取其他值

#### 委托生成器

- 在某些情况下，我们需要将两个迭代器合二为一，这时可以创建一个生成器，再给yield语句添加一个星号，就可以将生成数据的过程委托给其他迭代器

```js
function *createNumIterator() {
    yield 1
    yield 2
}
function *createColorIterator() {
    yield 'red'
    yield 'yellow'
}
function *createIterator() {
    yield *createNumIterator()
    yield *createColorIterator()
    yield true
}
let iterator = createIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 'red', done: false }
console.log(iterator.next()) // { value: 'yellow', done: false }
console.log(iterator.next()) // { value: true, done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

**return 用法**

- 生成器委托时， return 不会在next中返回， 但是会将结果返回，可以通过变量保存 (若想在next中返回， 需要额外写一条yield 语句)

```js
function *createNumIterator() {
    yield 1
    return 3
}
function *createRepeatIterator(count) {
    for (let i = 0; i < count; i++) {
        yield 'repeat'
    }
}
function *createIterator() {
    // 返回结果用result保存
    let result = yield *createNumIterator()
    // 如果想得到result 需要在此处写 yield result , 返回 {value: 3, done:false}
    // 传入另一个生成器
    yield *createRepeatIterator(result)
}
let iterator = createIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 'repeat', done: false }
console.log(iterator.next()) // { value: 'repeat', done: false }
console.log(iterator.next()) // { value: 'repeat', done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

> yield * 可以直接应用于字符串， 如 yield * 'hello'  ，此时会使用字符串默认迭代器

```js
function *createIterator() {
    // yield * 和 yield相同， 必须写在生成器中
    yield *'ab'
}
console.log(iterator.next()) // { value: 'a', done: false }
console.log(iterator.next()) // { value: 'b', done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

### 异步任务执行

- 如下用 Node.js编写一段从磁盘读取文件的代码

```js
let fs = require('fs')
fs.readFile('config.json', function(err, contents) {
    if (err) {
        throw err
    }
    // 执行后续操作
    doSomethingWith(contents)
})
```

>  如果执行任务少，那么这种方式可以很好地完成任务， 如若需要嵌套回调或序列化一系列的异步操作，事情会变得非常复杂,此时就需要使用 yield和生成器

#### 简单任务执行器

- 下面的函数run()接受一个生成器函数作为参数， 借助该方法，可以自动完成所有迭代

```js
function run(taskDef) {
    // 返回迭代器
    let task = taskDef()
    // 执行第一次next
    let result = task.next()
    function step() {
        // 若done不为true，就继续迭代
        if (!result.done) {
            result = task.next()
            step()
        }
    }
    // 开始迭代执行
    step()
}
run(function *() {
    console.log(1)
    yield;
    console.log(2)
    yield;
    console.log(3)
})
/*
1
2
3
*/
```

#### 向任务执行器传递数据

- 给任务执行器传递数据，最简单的方法是把yield返回的值传入下一次next()方法的调用

```js
function run(taskDef) {
    let task = taskDef()
    let result = task.next()
    function step() {
        if (!result.done) {
            result = task.next(result.value)
            step()
        }
    }
    // 开始迭代执行
    step()
}
run(function *() {
    // 此时就能够获取到 step中next方法传递过来的值
    let value = yield 1
    console.log(value)
    value = yield value + 3
    console.log(value)
})
/*
1
4
*/
```

#### 异步任务执行器

- 经过执行器的封装， 使用时， 能够让异步代码的书写方式类似同步代码

```js
// 封装readFile
let fs = require('fs')
function readFile(filename) {
    // 返回函数,函数接收回调
    return function(callback) {
        // 执行异步操作
        fs.readFile(filename， 'utf-8', callback)
    }
}
// 封装异步任务执行器
function run(taskDef) {
    let task = taskDef()
    // 返回 function(callback){//...}
    let result = task.next()
    function step() {
        if (!result.done) {
            if (typeof result.value === 'function') {
 // result.value是函数时，执行该函数， 并传入回调，针对该例子 (函数立刻执行，回调将在异步执行完毕后执行)
                result.value(function(err, data) {
                    if (err) {
                        //返回异常，并结束执行器的执行
                        result = task.throw(err)
                        return 
                    }
                    // 将数据返回
                    result = task.next(data)
                    // 继续执行下个任务
                    step()
                })
            } else {
                // 非函数
                result = task.next(result.value)
                step()
            }
           
        }
    }
    // 开始迭代执行
    step()
}

// 使用异步任务执行器
run(function *() {
    let contents = yield readFile('config.json')
    console.log(contents)
    // 执行后续操作
    // doSomethingWith(contents)
})

/*
{
    "a":1
}
*/
```

> 在11章中，将使用promise对任务执行器进行改造

## 9 JavaScript中的类

### ECMAScript 5中的近类结构

- 通过构造函数与原型实现实现

```json
//定义构造函数
function Person(name) {
    this.name = name
}
// 定义方法赋值给原型
Person.prototype.sayName = function() {
    console.log(this.name)
}
var person = new Person('zhangsan')
person.sayName() // zhangsan
console.log(person instanceof Person)// true
// 因为在一条原型链上由于原型继承的特性，所以返回true
console.log(person instanceof Object)  // true 
```

### 类的声明

#### 基本的类声明语法

- 书写方式如下

```js
// class关键字开头
class Person {
    // 等价于Person构造函数
    constructor(name) {
        this.name = name
    }
    // 等价于在原型上定义方法
    sayName() {
        console.log(this.name)
    }
}
let person = new Person('zhangsan')
person.sayName() // zhangsan
console.log(person instanceof Person)// true
console.log(person instanceof Object)  // true 
// 可以看到 Person实际上也是一个函数， 所以class是针对构造函数写法的一种简便的语法糖
console.log(typeof Person)  // function 
console.log(typeof Person.prototype.sayName)  // function
```

#### 为何使用类语法

类语法有以下特点

- 函数声明可以被提升，而类声明与let声明类似，不能被提升；真正执行声明语句之前，它们会一直存在于临时死区中。
-  类声明中的所有代码将自动运行在严格模式下，而且无法强行让代码脱离严格模式执行。
- 在es5中，需要通过Object.defineProperty()方法手工指定某个方法为不可枚举；而在类中，所有方法都是不可枚举的。
-  每个类都有[[Construct]]的内部方法，使用除new以外的方式调用类的构造函数会导致程序抛出错误, 而当使用new调用那些不含类的方法也会导致程序抛出错误
-  在类中修改类名会导致程序报错 （修改类名值的是将原有类名赋予其他值），外部可修改

**编写上述特点的等效代码**

```js
// IIFE ,let 定义所以可修改，但是不提升
let Person = (function() {
    'use strict'   // 严格模式
    // 通过const定义不可修改
  const Person = function(name) {
      if (typeof new.target === 'undefined') {
          throw new Error('必须通过new调用构造函数')
      }
      this.name = name
  }
  Object.defineProperty(Person.prototype, 'sayName', {
      value: function() {
          if (typeof new.target !== 'undefined') {
	          throw new Error('不可使用new调用该方法')
          }
          console.log(this.name)
      },
      enumerable: false,
      writable: true,
      // 为true时，代表属性描述符可修改或删除
      configurable: true
  })
  return Person
}())
```

- 类的类名在内部为常量，不可修改， 但在外部可以重新赋值

```js
class Person{
    constructor() {
        // Person = '666' 报错
    }
}
Person = '666'
console.log(Person) // 666
```

### 类表达式

#### 基本的类表达式语法

- 两种写法均不会提升

```js
let Person = class {} // 匿名类表达式

 class Person1{} // 类声明
```

#### 命名类表达式

- 写法如下
  - 根据打印可得 命名类名为undefined,因为他相当与上面等效代码中 定义在内部的类名，在外部访问返回undefined

```js
let Person = class Person2 {}
console.log(typeof Person) // 'function'
console.log(typeof Person2) // undefined
```

### 作为一等公民的类

- 在程序中，一等公民是指一个可以传入函数，可以从函数返回，并且可以赋值给变量的值,js函数就是一等公民
- es6中 ,类同样是一等公民

**将类作为参数**

```js
function createObject(classDef) {
    return new classDef()
}
let obj = createObject(class {
    sayHi() {
        console.log('hello')
    }
})
obj.sayHi() //'hello'
```

**通过类创建单例**

- 需要用 new 调用 并配合括号

```js
let person = new class {
    sayHi() {
        console.log('hello')
    }
}();
person.sayHi() // 'hello'
```

### 访问器属性

- 类也支持直接在原型上定义访问器属性。创建getter时，需要在关键字get后紧跟一个空格和相应的标识符；创建setter时，只需把关键字get替换为set即可
  - 下面代码中的CustomHTMLElement类是一个针对现有DOM元素的包装器，并通过getter和setter方法将这个元素的innerHTML方法委托给html属性

```js
class CustomHTMLElement {
    constructor(element) {
        this.element = element
    }
    get html() {
        return this.element.innerHTML
    }
    set html(value) {
        this.element.innerHTML = value
    }
}
// 可以看到访问器被定义在原型上
let descriptor = Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype, 'html')
console.log('set' in descriptor) // true
console.log('get' in descriptor) // true
```

- 上述代码等价于以下代码

```js
let CustomHTMLElement = (function() {
    'use strict'
    const CustomHTMLElement = function(element) {
        if (typeof new.target === 'undefined') {
            throw new Error('必须通过new调用构造函数')
        }
        this.element = element
    }
    Object.defineProperty(CustomHTMLElement.prototype, 'html', {
        enumable: false,
        configurable: true,
        get: function() {
            return this.element.innerHTML
        },
        set: function(value) {
            this.element.innerHTML = value
        }
    })
    return CustomHTMLElement  
}())
```

### 可计算成员名称

- 就像在对象字面量中一样，用方括号包裹一个表达式即可使用可计算名称，例如：

```js
let name1 = 'sayName'
class Person {
    constructor(name) {
        this.name = name
    }
    [name1]() {
        console.log(this.name)
    }
};
(new Person('zhangsan')).sayName() // zhangsan
// 访问器同样可以使用
let name2 = 'html'
class CustomHTMLElement {
    constructor(element) {
        this.element = element
    }
    get [name2]() {
        return this.element.innerHTML
    }
    set [name2](value) {
        this.element.innerHTML = value
    }
}
```

### 生成器方法

- 回忆第8章，在对象字面量中，可以通过在方法名前附加一个星号（*）的方式来定义生成器，在类中亦是如此，可以将任何方法定义成生成器，示例如下

```js
class Person {
    *createIterator() {
        yield 'zhangsan'
        yield 'lisi'
        yield 'wangwu'
    }
}
let person = new Person()
let iterator = person.createIterator()
console.log(iterator.next()) // { value: 'zhangsan', done: false }
console.log(iterator.next()) // { value: 'lisi', done: false }
console.log(iterator.next()) // { value: 'wangwu', done: false }
```

- 也可以更进一步定义一个默认迭代器

```js
class Collection {
    constructor() {
        this.items = []
    }
    *[Symbol.iterator]() {
        // yield * 调用 this.items数组的 values迭代器
        yield *this.items.values()
    }
}
let collection = new Collection()
collection.items.push(1,3,5)
// 定义迭代器后支持for...of
for(let i of collection) {
    console.log(i)
}
/*
1
3
5
*/
```

### 静态成员

- 在ECMAScript 5及早期版本中，直接将方法添加到构造函数中来模拟静态成员是一种常见的模式，例如

```js
function Person(name) {
    this.name = name
}
Person.prototype.sayName = function() {
    console.log(this.name)
}
// 创建静态方法
Person.create = function(name) {
    return new Person(name)
}

// 通过静态方法创建实例
let person = Person.create('zhangsan')
```

- 静态成员的特点： 实例中不可访问，只能直接在类中访问（可以继承，下一节会进行说明）

- es6 通过 `static` 关键字创建静态成员

```js
class Person {
    constructor(name) {
        this.name = name
    }
    sayName() {
        console.log(this.name)
    }
    // 注：除了创建静态方法，也可以创建静态属性， 如 static test: 1
    static create(name) {
        return new Person(name)
    }
}
// 通过静态方法创建实例
let person = Person.create('zhangsan')
```

### 继承与派生类

- es5实现继承

```js
// 定义长方形类
function Rectangle(length, width) {
    this.length = length
    this.width = width
}
Rectangle.prototype.getArea = function() {
    return this.length * this.width
}
// 定义正方形类， 继承自 Rectangle
function Square(length) {
    // 继承构造函数部分
    Rectangle.call(this, length, length)
}
// 继承原型部分，通过Object.create方法返回对象作为Square的原型，该对象原型为Rectangle的原型，
// 并定义constructor属性， 每个原型都应有该属性
Square.prototype = Object.create(Rectangle.prototype, {
    constructor: {
        value: Square,
        writable: true,
        configurable: true,
        enumerable: true
    }
})
var square = new Square(3)
console.log(square.getArea()) // 9
console.log(square instanceof Square) // true
console.log(square instanceof Rectangle) // true
```

- 而在es6中 上述操作， 只需要通过 **extends**关键字 和 **super()**方法即可实现

```js
class Rectangle {
    constructor(length, width) {
        this.length = length
        this.width = width
    }
    getArea() {
        return this.length * this.width
    }
}
class Square extends Rectangle {
    constructor(length) {
        // 该行代码等价于 Rectangle.call(this, length, length)
        super(length, length)
    }
}
let square = new Square(3)
console.log(square.getArea()) // 9
console.log(square instanceof Square) // true
console.log(square instanceof Rectangle) // true
```

**派生类**

- 继承自其他类的类被称作派生类
  - 如果在派生类中指定了构造函数（也就是写了constructor）则必须要调用super()，如果不这样做程序就会报错。
  - 如果选择不使用构造函数(不写constructor)，则当创建新的类实例时会自动调用super()并传入所有参数, 例子如下：

```js
class Square extends Rectangle {
}
// 上面两行代码等价于下面的代码
class Square extends Rectangle {
    constructor(args) {
        super(...args)
    }
}
```

**使用super的注意点**

- 只可在派生类的构造函数中使用super()，如果尝试在非派生类（不是用extends声明的类）或函数中使用则会导致程序抛出错误。

- 在派生类构造函数中访问this之前一定要调用super()，它负责初始化this，如果在调用super()之前尝试访问this会导致程序出错。

-  如果不想调用super()，则唯一的方法是让类的构造函数返回一个对象。如下所示

  - ```js
    class Square extends Rectangle {
        constructor(length) {
            // super(length, length)
            // 这种方式就不会报错， 但是此时就不会继承Rectangle的原型,返回的对象会成为原型
            return {getArea:function(){}}
        }
    }
    ```

#### 类方法遮蔽

- 派生类中的方法总会覆盖基类中的同名方法， 但可以通过super的方式调用原型方法

```js
class Square extends Rectangle {
    constructor(length) {
        super(length, length)
    }
    // 该方法就会覆盖原型中的同名方法
    getArea() {
        // 但可以通过super调用
        return super.getArea()
    }
}
```

#### 静态成员继承

- 如果基类有静态成员，那么这些静态成员在派生类中也可用

```js
class Rectangle {
    constructor(length, width) {
        this.length = length
        this.width = width
    }
    getArea() {
        return this.length * this.width
    }
    static create(length, width) {
        return new Rectangle(length, width)
    }
}
class Square extends Rectangle {
    constructor(length){
        super(length, length)
    }
}
// create方法被继承, 创建Rectangle实例
console.log(Square.create(6, 3).getArea()) // 18
```

#### 派生自表达式的类

- 只要表达式可以被解析为一个函数（不可以使用null或生成器函数）并且具有[[Construct]]属性和原型，那么就可以用extends进行派生

**例1： 继承构造函数**

```js
function Rectangle(length, width) {
    this.length = length
    this.width = width
}
Rectangle.prototype.getArea = function() {
    return this.length * this.width
}
class Square extends Rectangle {
    constructor(length) {
        super(length, length)
    }
}
let square = new Square(3)
console.log(square.getArea()) // 9
console.log(square instanceof Rectangle) // true
```

**例2： 动态确定继承目标**

```js
function Rectangle(length, width) {
    this.length = length
    this.width = width
}
Rectangle.prototype.getArea = function() {
    return this.length * this.width
}
// 继承目标由 getBase函数返回值决定
function getBase() {
    return Rectangle
}
class Square extends getBase() {
    constructor (length) {
        super(length,length)
    }
}
let square = new Square(3)
console.log(square.getArea()) // 9
console.log(square instanceof Rectangle) // true
```

**例3：使用mixin创建继承目标**

```js
let SerializableMixin = {
    serialize() {
        return JSON.stringify(this)
    }
}
let AreaMixin = {
    getArea() {
        return this.length * this.width
    } 
}
function mixin(...mixins) {
    // 创建构造函数
    let base = function() {}
   // 将方法混入原型
    Object.assign(base.prototype, ...mixins)
    return base
}
class Rectangle extends mixin(SerializableMixin, AreaMixin) {
    constructor(length, width) {
        // 必须写super
        super()
        this.length = length
        this.width = width
    }
}
let rect = new Rectangle(3,4)
console.log(rect.getArea()) // 12
console.log(rect.serialize()) // {"length":3,"width":4}
```

#### 内建对象的继承

- 以数组为例， 内建Array具有以下特点

```js
let arr = []
arr[0] = 'red'
console.log(arr.length) // 1
arr.length = 0
// 修改length, 元素同时被清空
console.log(arr[0]) // undefined
```

- 在es5及早期版本中无法通过传统继承方式，实现内建对象的继承

```js
function MyArray() {
    // 继承构造函数
    Array.apply(this,arguments)
}
MyArray.prototype = Object.create(Array.prototype, {
    constructor: {
        value:MyArray,
        enumerable: true,
        configurable: true,
        writable: true
    }
})
var myarr = new MyArray()
myarr[0] = 'red'
// length未变化
console.log(myarr.length) // 0
myarr.length = 0
// 修改length, 元素也未清空
console.log(myarr[0]) // 'red'
```

- es6实现了内建对象的继承

```js
class MyArray extends Array {
}
let myarr = new MyArray()
myarr[0] = 'red'
console.log(myarr.length) // 1
myarr.length = 0
// 修改length, 元素被清空
console.log(myarr[0]) // 'undefined'
```

- es6继承与es5不同之处主要在于
  - 在ECMAScript 5的传统继承方式中，先由派生类型（例如，MyArray）创建this的值，然后调用基类型的构造函数（例如Array.apply()方法）。这也意味着，this的值开始指向的是MyArray的实例，但是随后会被来自Array的其他属性所修饰
  - ECMAScript 6中的类继承则与之相反，先由基类（Array）创建this的值，然后派生类的构造函数（MyArray）再修改这个值。所以一开始可以通过this访问基类的所有内建功能，然后再正确地接收所有与之相关的功能

#### Symbol.species属性

- 如下代码所示， 正常情况下，继承自Array的slice()方法应该返回Array的实例，但是在这段代码中，slice()方法返回的是MyArray的实例。在浏览器引擎背后是通过Symbol.species属性实现这一行为

```js
class MyArray extends Array {
}
let arr = new MyArray([1,3,5])
let subarr = arr.slice(0.2)
console.log(arr instanceof Array) // true
console.log(arr instanceof MyArray) // true
console.log(subarr instanceof MyArray) // true
```

- Symbol.species是诸多内部Symbol中的一个，它被用于定义返回函数的静态访问器属性。被返回的函数是一个构造函数，每当要在实例的方法中（不是在构造函数中）创建类的实例时必须使用这个构造函数。以下这些内建类型均已定义Symbol.species属性：
  - Array , Array Buffer, Map, Promise, RegExp, Set, Typed arrays

- 下面的例子是在自定义类中， 使用Symbol.species实现与内建类型相似的功能

```js
class MyArray {
    // 只定义get, 定义后不可改变
    static get [Symbol.species] () {
        return this
    }
    constructor(value) {
        this.value = value
    }
    // 在创建实例时都执行该方法， 内建类中也有类似方法
    clone() {
        return new this.constructor[Symbol.species](this.value)
    }
}
class MyArray1 extends MyArray {
}
class MyArray2 extends MyArray {
    // 覆盖继承来的静态方法
    static get [Symbol.species] () {
        return MyArray
    }
}
let arr = new MyArray1(6),
    // 在实例中调用,得到想要的实例
    clone = arr.clone(),
    arr2 = new MyArray2(5),
    clone2 = arr2.clone()
console.log(clone instanceof MyArray) // true
// arr是Myarray1实例
console.log(clone instanceof MyArray1) // true
console.log(clone2 instanceof MyArray) // true
// arr2不是Myarray2实例，因为重写的Symbol.species修改了返回值
console.log(clone2 instanceof MyArray2) // false
```

- 因为 Symbol.species 可以覆写， 所以可以直接覆写内建对象的行为

```js
class MyArray extends Array {
    static get [Symbol.species]() {
        return Array
    }
}
let arr = new MyArray([1,3,5])
let subarr = arr.slice(0.2)
console.log(arr instanceof MyArray) // true
console.log(subarr instanceof Array) // true
// 默认行为被修改
console.log(subarr instanceof MyArray) // false
```

#### 在类的构造函数中使用new.target

在类的构造函数中可以通过new.target来确定类是如何被调用的

- 一般情况下， new.target等于类的构造函数

```js
class Rectangle {
    constructor(length, width) {
        console.log(new.target === Rectangle) // true
        this.length = length
        this.width = width
    }
}
new Rectangle(5,6)
```



- 通过派生类调用基类时，情况有所不同

```js
class Rectangle {
    constructor(length, width) {
        console.log(new.target === Rectangle) 
        // 此时new.target的取值发生了改变 
        console.log(new.target === Square) 
        // 因此可以针对这一特点,创建不可实例化的抽象类
        if (new.target === Rectangle) {
            throw new Error('这个类不能直接实例化')
        }
        this.length = length
        this.width = width
    }
}
class Square extends Rectangle {
    constructor(length) {
        super(length, length)
    }
}
new Square(6) // false  true
new Rectangle(6) //true false  报错
```

> 因为类必须通过new关键字才能调用，所以在类的构造函数中，new.target属性永远不会是undefined。

## 10 改进数组的功能

### 创建数组

#### Array.of() 方法

- es5如果通过new Array传参创建数组 ，不同情况会出现不同行为

```js
// 传入一个数字参数
var a = new Array(2)  // a: [undefined, undefined]
// 传入多个数字参数 
var b = new Array(1, 3) // b; [1, 3]
// 传入一个非数字参数
var c = new Array('2') // c: ['2']
```

- es6通过 Array.of统一了行为，无论传入什么 ，都会成为数组元素

```js
const d = Array.of(2) // d: [2]
const e = Array.of(1, 3) // e: [1, 3]
```

#### Array.from 方法

- Array.from是一个将类数组(伪数组)对象转换为数组的方法
  - 类数组具有length属性，且属性是数字索引的形式。但不能调用数组的方法

es5中可以通过下面两种形式转换

- for循环

```js
function makeArray(arrayLike) {
    var result = []
    for(var i = 0, l = arrayLike.length; i < l; i++) {
        result.push(arrayLike[i])
    }
    return result
}
```

- slice + call

```js
// 改变this, 在slice方法中通过遍历this得到新数组，并不会判断this本身是否是数组
Array.prototype.slice.call(arrayLike)
```

> Array.of()方法不通过Symbol.species属性（见第9章）确定返回值的类型，它使用当前构造函数（也就是of()方法中的this值）来确定正确的返回数据的类型。

**es6 Array.from**

- 第一个参数为要转换的类数组（可以是任意可迭代的对象,map,set等）
- 第二个参数可以传入一个回调函数，回调函数接收一个参数value，该参数为遍历的value值
-  第三个参数 指定函数运行过程中的 this值

```js
const result = Array.from(arrayLike) // result即为转换后的数组
```

```js
// 转换arguments
function translate() {
    return Array.from(arguments, (value) => value + 1)
}
console.log(translate(1,3,5)) // [2,4,6]

function translate(iterator) {
    return Array.from(iterator, (value) => value + 1)
}
let iteratorObj = {
    *[Symbol.iterator]() {
        yield 1
        yield 2
        yield 3
    }
}
let set = new Set([1,3,6])
// 转换可迭代对象
console.log(translate(iteratorObj))  // [ 2, 3, 4 ]
// 转换set
console.log(translate(set)) // [ 2, 4, 7 ]
```

> Array.from()方法与Array.of相同， 也是通过this来确定返回数组的类型的

### 为所有数组添加的新方法

#### find()方法和findIndex()方法

- find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

- findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回-1
- find()方法和findIndex()方法都接受两个参数：
  - 一个是回调函数；
    - 执行回调函数时，传入的参数分别为：数组中的某个元素和该元素在数组中的索引及数组本身，与传入map()和forEach()方法的参数相同
  - 另一个是可选参数，用于指定回调函数中this的值
- 如果给定的值满足定义的标准，回调函数应返回true，一旦回调函数返回true，find()方法和findIndex()方法都会立即停止搜索数组剩余的部分

```js
let array = [1,6,78,9]
console.log(array.find((item) => item > 6)) // 78
console.log(array.findIndex((item) => item > 6)) // 2
```

#### fill() 方法

- fill()方法可以用指定的值填充一至多个数组元素。当传入一个值时，fill()方法会用这个值重写数组中的所有值
  - 当传入一个值时，fill()方法会用这个值重写数组中的所有值
  - 可选参数： 开始索引和不包含结束索引（不包含结束索引当前值）

```js
let array = [1,5,6,7,8],array1 = [1,5,6,7,8], array2 = [1,5,6,7,8]
array.fill(6)
array1.fill(6,3)
array2.fill(6, 0, 1)
console.log(array) // [6, 6, 6, 6, 6]
console.log(array1) // [1, 5, 6, 6, 6]
console.log(array2) //  [6, 5, 6, 7, 8]
```

#### copyWithin()方法

- copyWithin()方法与fill()方法相似，其也可以同时改变数组中的多个元素。fill()方法是将数组元素赋值为一个指定的值，而copyWithin()方法则是从数组中复制元素的值。
- copyWithin()方法时支持三个参数
  - 开始填充值的索引位置
  - 开始复制值的索引位置，不填默认0
  - 结束复制值的索引位置，不填则一直赋值到结尾 ，填时不包含结束索引当前值

```js
let array = [1,5,6,7,8],array1 = [1,5,6,7,8], array2 = [1,5,6,7,8]
array.copyWithin(2) 
console.log(array) //  [1,5,1,5,6]
// 复制到末尾时停止 从7开始复制 复制7,8后停止
array1.copyWithin(0,3) 
console.log(array1) // [7,8,6,7,8]
// 只复制了一个6
array2.copyWithin(0,2,3) 
console.log(array2) //  [6,5,6,7,8]
```

> fill 和 copyWithin都接收负数参数， 使用负数时，实际索引为 数组length 与 负数的和 (则 从末尾开始往前跳 负数 的绝对值个索引 )

### 定型数组

- 定型数组是一种用于处理数值类型（正如其名，不是所有类型）数据的专用数组，最早是在WebGL中使用的，WebGL是OpenGL ES 2.0的移植版，在Web页面中通过<canvas>元素来呈现它。定型数组也被一同移植而来，其可为JavaScript提供快速的按位运算。
- 在JavaScript中，数字是以64位浮点格式存储的，并按需转换为32位整数，所以算术运算非常慢，无法满足WebGL的需求。因此在ECMAScript 6中引入定型数组来解决这个问题，并提供更高性能的算术运算。所谓**定型数组，就是将任何数字转换为一个包含数字比特的数组**，随后就可以通过我们熟悉的JavaScript数组方法来进一步处理。

#### 数值数据类型

- JavaScript数字按照IEEE 754标准定义的格式存储，也就是用64个比特来存储一个浮点形式的数字。这个格式用于表示JavaScript中的整数及浮点数
- 支持以下八种类型
  - 有符号的8位整数（int8）无符号的8位整数（uint8）
  - 有符号的16位整数（int16）无符号的16位整数（uint16）
  - 有符号的32位整数（int32）无符号的32位整数（uint32）
  - 32位浮点数（float32）64位浮点数（float64）

#### 数组缓冲区

- 在使用上述数据类型之前，需要创建一个数组缓冲区存储这些数据,它是一段可以包含特定数量字节的内存地址
- 可以通过 ArrayBuffer创建数组缓冲区

```js
let buffer = new ArrayBuffer(10) // 分配10字节
// length 属性查看字节数量
console.log(buffer.length) // 10
// 支持slice方法,行为与Array中的length一致
let buffer2 = buffer.slice(4,6) // 从索引4和5提取字节
console.log(buffer.length) // 2
```

> 数组缓冲区中的数据可以改变，但大小在创建完毕后就不能修改

#### 通过视图操作数组缓冲区

- 数组缓冲区是内存中的一段地址，视图是用来操作内存的接口。视图可以操作数组缓冲区或缓冲区字节的子集，并按照其中一种数值型数据类型来读取和写入数据

- DataView类型是一种通用的数组缓冲区视图，其支持所有8种数值型数据类型。
- 要使用DataView，首先要创建一个ArrayBuffer实例，然后用这个实例来创建新的DataView
  - 下面的view对象可以访问缓冲区中的所有字节， 除了参数1接收ArrayBuffer实例， 参数2,3 可以选择传入起始索引位置和数量， 如 new Dataview(buffer, 4,2)  ，代表取索引为4,5的字节

```js
let buffer = new ArrayBuffer(10),
    view = new Dataview(buffer)
```

- 支持以下只读属性
  - buffer　视图绑定的数组缓冲区。
  - byteOffset　DataView构造函数的第二个参数，默认是0，只有传入参数时才有值。
  - byteLength　DataView构造函数的第三个参数，默认是缓冲区的长度byteLength。

```js
let buffer = new ArrayBuffer(10),
    view = new DataView(buffer),
    view2 = new DataView(buffer, 5, 2)
console.log(view.buffer === buffer) // true
console.log(view2.buffer === buffer) // true
console.log(view.byteOffset) // 0
console.log(view2.byteOffset) // 5
console.log(view.byteLength) // 10
console.log(view2.byteLength) // 2
```

**读取和写入数据**

- 用于读取和写入int8和unit8类型数据的方法 （这里只介绍了int8，除了8以外同样支持16或32，如getInt16 ）
  -  getInt8(byteOffset, littleEndian)　读取位于byteOffset后的int8类型数据。
  - setInt8(byteOffset, value, littleEndian)　在byteOffset处写入int8类型数据。
  - getUint8(byteOffset, littleEndian)　读取位于byteOffset后的uint8类型数据。
  - setUint8(byteOffset, value, littleEndian)　在byteOffset处写入uint8类型数据。
  - get方法接受两个参数：读取数据时偏移的字节数量；和一个可选的布尔值，表示是否按照小端序进行读取（小端序是指最低有效字节位于字节0的字节顺序）。set方法接受三个参数：写入数据时偏移的比特数量；写入的值；和一个可选的布尔值，表示是否按照小端序格式存储。
- 除整数方法外同样支持浮点数
  - getFloat32(byteOffset, littleEndian)　读取位于byteOffset后的float32类型数据。
  -  setFloat32(byteOffset, value, littleEndian)　在byteOffset处写入float32类型数据。
  - getFloat64(byteOffset, littleEndian)　读取位于byteOffset后的float64类型数据。
  - setFloat64(byteOffset, value, littleEndian)　在byteOffset处写入float64类型数据。

- 使用举例

```js
let buffer = new ArrayBuffer(2),
    view = new DataView(buffer)
view.setInt8(0,5)
view.setInt8(1,-1)
console.log(view.getInt8(0)) // 5
console.log(view.getInt8(1)) // -1

// 视图是独立的，无论数据之前是通过何种方式存储的，你都可在任意时刻读取或写入任意格式的数据。举个例子，写入两个int8类型的值，然后使用int16类型的方法也可以从缓冲区中读出这些值
// 注意 getInt16 只能访问0 不能访问1 ，因为一个字节8bit，两个字节只能保存一位16进制整型
console.log(view.getInt16(0)) // 1535

```

**定型数组是视图**

- ECMAScript 6定型数组实际上是用于数组缓冲区的特定类型的视图，你可以强制使用特定的数据类型，而不是使用通用的DataView对象来操作数组缓冲区
- 下图是ES6中的特定类型视图

![特定类型视图](./img/特定类型视图.png)

> Uint8ClampedArray与Uint8Array大致相同，唯一的区别在于数组缓冲区中的值如果小于0或大于255，Uint8ClampedArray会分别将其转换为0或255，例如，-1会变为0，300会变为255

**创建特定类型的视图**

```js
let buffer = new ArrayBuffer(10),
    view1 = new Int8Array(buffer),
    view2 = new Int8Array(buffer, 5, 2)
console.log(view1.buffer === buffer) // true
console.log(view2.buffer === buffer) // true
console.log(view1.byteOffset) // 0
console.log(view2.byteOffset) // 5
console.log(view1.byteLength) // 10
console.log(view2.byteLength) // 2
```

**创建定型数组的第二种方法**

- 调用构造函数时传入一个数字（不传按0处理，这时不能保存数据）。这个数字表示分配给数组的元素数量（不是字节数量），构造函数将创建一个新的缓冲区，并按照数组元素的数量来分配合理的字节数量，通过length属性可以访问数组中的元素数量

```js
let floats = new Float32Array(5)
console.log(floats.byteLength) // 20
// length属性返回数组中可访问的元素数量
console.log(floats.length) // 5 
```

**创建定型数组的第三种方法是**

- 可以将符合条件的对象作为参数传入
  - 一个定型数组　该数组中的每个元素会作为新的元素被复制到新的定型数组中。举个例子，如果将一个int8数组传入到Int16Array构造函数中，int8的值会被复制到一个新的int16数组中，新的定型数组使用新的数组缓冲区。
  - 一个可迭代对象　对象的迭代器会被调用，通过检索所有条目来选取插入到定型数组的元素，如果所有元素都是不适用于该视图类型的无效类型，构造函数将会抛出一个错误。
  - 一个数组　数组中的元素会被复制到一个新的定型数组中，如果所有元素都是不适用于该视图类型的无效类型，构造函数将会抛出一个错误。
  - 一个类数组对象　与传入数组的行为一致。

```js
let ints1 = new Int16Array([25,30]),
    ints2 = new Int32Array(ints1)
// 两者的缓冲区是完全独立的
console.log(ints1.buffer === ints2.buffer) // false
// 通过索引访问
console.log(ints1[0]) // 25
console.log(ints1[1]) // 30
console.log(ints2[0]) // 25
console.log(ints2[1]) // 30
console.log(ints1.byteLength) // 4
console.log(ints2.byteLength) // 8
```

- 可以使用BYTES_PER__ELEMENT访问每个定型数组中每个元素所占的字节数，构造函数与实例均支持

```js
console.log(Int32Array.BYTES_PER_ELEMENT) // 4
let float = new Float64Array(1)
console.log(float.BYTES_PER_ELEMENT) // 8
```

#### 定型数组与普通数组的相似之处

- 定型数组 中的length可以访问元素数量， 但是不能修改定型数组大小，若尝试修改， 严格模式下会报错， 非严格模式操作将被忽略
- 可以通过索引读取值， 也可以通过索引赋值 ，如`int1[0] = 5`

**通用方法**

以下方法均可用于定型数组

```js
copyWithin() findIndex() lastIndexOf() slice()
entries() forEach() map() some()
fill() indexOf() reduce() sort()
filter() join() 
reduceRight() //  从右侧为起点累计元素
values()
find() keys() reverse()
```

> 定型数组中的方法会额外检查数值类型是否安全，也会通过Symbol.species确认方法的返回值是定型数组而非普通数组

**相同的迭代器**

- 定型数组与普通数组有3个相同的迭代器，分别是entries()方法、keys()方法和values()方法，这意味着可以把定型数组当作普通数组一样来使用展开运算符、for-of循环

```js
let ints = new Int16Array([30, 25]),
    array = [...ints] // 可以将定型数组转换为普通数组
console.log(array instanceof Array)
```



**of()方法和from()方法**

- 这两个方法与数组行为一致， 区别是定型数组的方法返回定型数组，而普通数组的方法返回普通数组

```js
let ints = Int16Array.of(25,30),
    floats = Float32Array.from([15,30])
console.log(ints instanceof Int16Array) // true
console.log(floats instanceof Float32Array) // true
```

#### 定型数组与普通数组的差别

**不继承自Array， 使用Array.isArray返回false**

```js
let ints = new Int8Array(6)
console.log(Array.isArray(ints)) // false
```

**行为差异**

- length不可改 ; 索引赋值若超出范围被忽略 ; 非法值会用0代替（如字符串就属于非法值）
- 定型数组方法受到相同限制 若传入非法值， 用0代替

```js
let ints = new Int8Array([24,30])
console.log(ints[0], ints[2]) // 24 undefined
ints[0] = 'hello'
console.log(ints[0]) // 0
let ints2 = ints.map((v) => 'aa')
console.log(ints2[0], ints2[1]) // 0 0
```

**缺失的方法**

```js
concat() shift() pop() push() slice() unshif()
```

- 除concat()方法外，其他方法都可以改变数组的尺寸，由于定型数组的尺寸不可更改，因而这些方法不适用于定型数组。定型数组不支持concat()方法是因为两个定型数组合并后的结果（尤其当两个数组分别处理不同数据类型时）会变得不确定，这直接违背了使用定型数组的初衷

**附加方法**

- 两个没出现在普通数组中的方法： set()和subarray()。这两个方法的功能相反，set()方法将其他数组复制到已有的定型数组，subarray()提取已有定型数组的一部分作为一个新的定型数组。

- set()方法接受两个参数：一个是数组（定型数组或普通数组都支持）；一个是可选的偏移量，表示开始插入数据的位置，如果什么都不传，默认的偏移量为0
- subarray()方法接受两个参数：一个是可选的开始位置，一个是可选的结束位置，最后返回一个新的定型数组

```js
let ints = new Int16Array([5,10,15])
ints.set([6], 2)
// 支持toStirng()方法
console.log(ints.toString()) // 5,10,6
let ints2 = ints.subarray(1,2) 
console.log(ints2.toString()) // 10
```



## 11 Promise与异步编程

### 异步编程背景知识

**回调地狱问题**

```js
method1(function(err, result) {
    if (err) {
        throw err
    }
    method2(function(err, result) {
        if (err) {
            throw err
        }
        method3(function(err, result) {
            // ...
        })
    })
})
```

- 像示例中这样嵌套多个方法调用，会创建出一堆难以理解和调试的代码。
- 如果想实现复杂的功能，回调函数的局限性同样也会显现出来，
  - 例如，并行执行两个异步操作，当两个操作都结束时通知你；
  - 或者同时进行两个异步操作，只取优先完成的操作结果。在
  - 这些情况下，你需要跟踪多个回调函数并清理这些操作，而Promise就能非常好地改进这样的情况

### Promise的基础知识

- Promise相当于异步操作结果的占位符，它不会去订阅一个事件，也不会传递一个回调函数给目标函数，而是让函数返回一个Promise

```js
let promise = readFile('config.json')
```

- 在这段代码中，readFile()不会立即开始读取文件，函数会先返回一个表示异步读取操作的Promise对象，未来对这个对象的操作完全取决于Promise的生命周期

#### Promise的生命周期

- 每个Promise都会经历一个短暂的生命周期，由内部属性[[PromiseState]]， 表示三种状态：pending(等待) fulfilled(满足)rejected(拒绝)
-  在刚刚的实例中， 当readFile()函数返回Promise时它变为pending状态， 操作结束后进入以下两个状态中的一个
  -  Fulfilled　Promise异步操作成功完成。
  -  Rejected　由于程序错误或一些其他原因，Promise异步操作未能成功完成。
- 所有Promise都有then()方法，它接受两个参数：第一个是当Promise的状态变为fulfilled时要调用的函数，与异步操作相关的附加数据都会传递给这个完成函数（fulfillment function）；第二个是当Promise的状态变为rejected时要调用的函数，其与完成时调用的函数类似，所有与失败状态相关的附加数据都会传递给这个拒绝函数（rejection function）

> 如果一个对象实现了上述的then()方法，那这个对象我们称之为thenable对象。所有的Promise都是thenable对象，但并非所有thenable对象都是Promise

- then()的两个参数都是可选的，所以可以按照任意组合的方式来监听Promise,如下所示

```js
let promise = readFile('config.json')
promise.then(function(contents) {
    // 完成
    console.log(contents)
}, function(err) {
    // 拒绝
    console.error(err.message)
})
promise.then(function(contents) {
    console.log(contents)
}) 
promise.then(null, function(err) {
    console.error(err.message)
})
```

- Promise还有一个catch()方法，相当于只给其传入拒绝处理程序的then()方法

```js
promise.catch(function(err) {
    console.log(err.message)
})
// catcha与这段代码等价
promise.then(null, function(err) {
    console.error(err.message)
})
```

- 如果一个Promise处于已处理状态，在这之后添加到任务队列中的处理程序仍将执行，所以可以连续调用Promise

```js
let promise = readFile('config.json')
promise.then(function(contents) {
    console.log(contents)
    promise.then(function(conentes) {
        console.log(contents)
    })
})
```

#### 创建未完成的Promise

- 用Promise构造函数可以创建新的Promise，构造函数只接受一个参数：
  - 包含初始化Promise代码的执行器（executor）函数。
    - 执行器接受两个参数，
    - 执行器成功完成时调用resolve()函数，
    - 反之，失败时则调用reject()函数。

- 上文使用的readFile方法不是node中支持的而是经过我们包装后实现的， 实现代码如下

```js
let fs = require('fs')
function readFile(filename) {
    return new Promise(function(resolve, rejcet) {
        fs.readFile(filename, 'utf-8', function(err, contents) {
            if (err) {
                rejcet(err)
                return
            }
            resolve(contents)
        })
    })
}
```

- **Promise的执行器会立即执行,** 而**后续** 调用resolve() (包括rejcet)会触发一个异步操作，传入then()和catch()方法的函数会被添加到任务队列中并**异步执行**

```js
let promise  = new Promise(function (resolve, rejcet) {
    console.log('promise')
    resolve()
})
promise.then(function() {
    console.log('resolve')
})
console.log('hello')
/*
primise
hello
resolve
*/
```

#### 创建已处理的Promise

- 创建未处理Promise的最好方法是使用Promise的构造函数, 。但如果你想用Promise来**表示一个已知值**（包括Promise对象和thenable对象），使用构造函数过于发展，可以使用如下两种方法

**Promise.resolve()**

- Promise.resolve()方法只接受一个参数并返回一个完成态的Promise
  - 由于该Promise永远不会存在拒绝状态，因而该Promise的拒绝处理程序永远不会被调用

```js
let promise = Promise.resolve(42)
promise.then(function(value) {
    console.log(value) // 42
})
```

**Promise.reject()**

- 通过Promise.reject()方法来创建已拒绝Promise
  - 任何附加到这个Promise的拒绝处理程序都将被调用，但却不会调用完成处理程序

```js
let promise = Promise.reject(42)
promise.catch(function(value) {
    console.log(value) // 42
})
```



>  如果向Promise.resolve()方法或Promise.reject()方法**传入一个Promise，那么这个Promise会被直接返回**

**非promise的Thenable对象**

- Promise.resolve()方法和Promise.reject()方法都可以接受非Promise的Thenable对象作为参数。
- 如果传入一个非Promise的Thenable对象，则这些方法会创建一个新的Promise，并在then()函数中被调用。
- 拥有then()方法并且接受resolve和reject这两个参数的普通对象就是非Promise的Thenable对象

```JS
let thenable = {
    then: function(resolve, reject) {
        resolve(42)
    }
}
// 此时p1 是一个处于完成态的promise对象
let p1 = Promise.resolve(thenable)
p1.then(function(value) {
    console.log(value) // 42
})

let thenable2 = {
    then: function(resolve, reject) {
        reject(42)
    }
}
// 此时p1 是一个处于完成态的promise对象
let p2 = Promise.resolve(thenable2)
p2.catch(function(value) {
    console.log(value) // 42
})
```

#### 执行器错误

- 如果执行器内部抛出一个错误，则Promise的拒绝处理程序就会被调用，例如

```js
let promise = new Promise(function(resolve, reject) {
    throw new Error('Error')
})
promise.catch(function(err) {
    console.log(err.message) //Error
})

// 因为每个promise中都隐含一个try..catch 所以可以捕获错误,形如:
/*
try {
	throw new Error('Error')
} catch(ex) {
	reject(ex)
}
*/
```

### 全局的Promise拒绝程序

- 有关Promise的其中一个最具争议的问题是，如果在没有拒绝处理程序的情况下拒绝一个Promise，那么不会提示失败信息 (也就是说若出现异常， 如果不用catch接收，那么永远不能知道是否存在异常，程序也不会报错)

#### Node环境的拒绝处理

- 在Node.js中，处理Promise拒绝时会触发process对象上的两个事件：
  - unhandledRejection 在一个事件循环中，当Promise被拒绝，并且没有提供拒绝处理程序，触发该事件。 
  - rejectionHandled 在一个事件循环后，当 Promise 被拒绝，若拒绝处理程序被调用，触发该事件。

```js
let reject
// 接收两个参数， 1.错误对象 2.错误promise
process.on('unhandledRejection', function(reason, promise) {
    console.log(reason.message) // Error
    console.log(promise === reject) // true
})
reject = Promise.reject(new Error('Error')) 
```

- rejectionHandled事件在拒绝处理程序最后被调用时触发，如果在创建rejected之后直接添加拒绝处理程序，那么rejectionHandled事件不会被触发，因为rejected创建的过程与拒绝处理程序的调用在同一个事件循环中，此时rejectionHandled事件尚未生效。

```js
let rejcet
// 接收一个参数，错误promise
process.on('rejectionHandled', function(reason, promise) {
    console.log(promise === rejcet) // true
})
reject = Promise.reject(new Error('Error')) 
// 
setTimeout(function() {
    reject.catch(function(value) {
        console.log(value.message) // Error
    })
})
```

> 上述两个方法在node 12.6中使用时， 提示后续会弃用，promise将在出现错误时直接退出运行

#### 浏览器环境的拒绝处理

- unhandledRejection  ； rejectionHandled  这两个方法在window对象上触发， 与node的同名方法基本等效
  - 参数上又有不同， 只接收一个有以下属性的event对象
    -  type　事件名称（"unhandledrejection"或"rejectionhandled"）
    -  promise　被拒绝的Promise对象
    - reason　来自Promise的拒绝值 （在浏览器的实现中，两个事件都有reason属性）

- 可以通过这两个方法编写一个跟踪未处理拒绝的代码， node中的写法与下面的浏览器写法基本一致

```js
// 将promise和拒绝对象存在map集合中，之后再进行检索
let rejectMap = new Map()
window.onunhandledrejection = function (event) {
    // 不存在则添加（有处理的拒绝也有可能执行此处代码，因为可能处理代码，在下个事件循环生效，此时未生效）
    rejectMap.set(event.promise, event.reason)
}
window.onrejectionhandled = function (event) {
    // 有处理程序再进行删除
    rejectMap.delete(event.promise)
}
setInterval(function() {
    // 没过一段时间遍历map集合，处理拒绝，并清空map
    rejectMap.forEach(function(promise, reason) {
        // 做一些什么来处理这些拒绝
        handleRejection(promise, reason)
    })
    rejectMap.clear()
}, 60000)
```

### 串联Promise

- Promise支持串联使用， 每次调用then或catch方法，执行结束后， 都会返回一个新的Promise对象

```js
let promise = new Promise(function(resolve, reject) {
    resolve(42)
})
promise.then(function (value) {
    console.log(value) // 42
}).then(function() {
    console.log('finished')
})
```

#### 捕获错误

- 通过Promise链可以捕获错误

```js
let promise = new Promise(function(resolve, reject) {
    resolve(42)
})
// 如果这里是catch，同样可以继续使用catch捕获错误
promise.then(function (value) {
    // 抛出错误
    throw new Error('Error')
}).catch(function(err) {
    // 捕获错误
    console.log(err.message)
})
```

> 务必在Promise链的末尾留有一个拒绝处理程序以确保能够正确处理所有可能发生的错误。

#### Promise链的返回值

- Promise链的另一个重要特性是可以给下游Promise传递数据，我们已经看到了从执行器resolve()处理程序到Promise完成处理程序的数据传递过程，如果在完成处理程序中指定一个返回值，则可以沿着这条链继续传递数据

```js
let promise = new Promise(function(resolve, reject) {
    resolve(42)
})
// 如果这里是catch，同样可以继续使用catch传递数据
promise.then(function (value) {
    console.log(value)
    return value + 1
}).then(function(value) {
    console.log(value) // 43
})
```

#### 在Promise链中返回Promise

```js
let promise = new Promise(function(resolve, reject) {
    resolve(42)
})
// 如果这里是catch，同样可以继续使用catch返回Promise
promise.then(function (value) {
    console.log(value) // 42
    return new Promise(function(resolve, reject) {
        resolve(66)
    })
}).then(function(value) {
    console.log(value) // 66
})

// 注： 上面得处理模式，实际上相当于3个Promise
let promise2 = new Promise(function(resolve, reject) {
    resolve(42)
})
let promise3 = new Promise(function(resolve, reject) {
    resolve(66)
})
let promise4 = promise2.then(function(value) {
    console.log(value) // 42
    return promise3
})
promise4.then(function(value) {
    console.log(value) // 66
})

```

### 响应多个Promise

#### Promise.all()方法

- Promise.all()方法只接受一个参数并返回一个Promise
  - 该参数是一个含有多个受监视Promise的可迭代对象（例如，一个数组）
    - 只有当可迭代对象中所有Promise都被解决后返回的Promise才会被解决，只有当可迭代对象中所有Promise都被完成后返回的Promise才会被完成

```js
let promise1 = new Promise(function(resolve, reject) {
    resolve(12)
})
let promise2 = new Promise(function(resolve, reject) {
    resolve(42)
})
let promise3 = new Promise(function(resolve, reject) {
    resolve(66)
})
let p = Promise.all([promise1, promise2, promise3])
p.then(function(value) {
    // 处理程序的结果是包含每个解决值的数组 这些值按照传入参数数组中Promise的顺序存储
    console.log(Array.isArray(value)) // true
    /*
        12
        42
        66
        */
    for (let i of value) {
        console.log(i) 
    }
})
```

- 所有传入Promise.all()方法的Promise只要有一个被拒绝，那么返回的Promise没等所有Promise都完成就立即被拒绝, 此时接收到的值不在是数组，而是被拒绝Promise的拒绝值 （Promise.then不会执行）

```js
let promise1 = new Promise(function(resolve, reject) {
    resolve(12)
})
let promise2 = new Promise(function(resolve, reject) {
    reject(42)
})
let promise3 = new Promise(function(resolve, reject) {
    resolve(66)
})
let p = Promise.all([promise1, promise2, promise3])
p.catch(function(value) {
   console.log(Array.isArray(value)) // false
   console.log(value) // 42
})
// 不会执行
p.then(function(value) {
    console.log(666)
})
```

#### Promise.race()方法

- Promise.race()方法监听多个Promise的方法稍有不同：
  - 它也接受含多个受监视Promise的可迭代对象作为唯一参数并返回一个Promise
  - 但只要有一个Promise被解决返回的Promise就被解决，无须等到所有Promise都被完成

```js
let promise1 = new Promise(function(resolve, reject) {
    resolve(12)
})
let promise2 = new Promise(function(resolve, reject) {
    resolve(42)
})
let promise3 = new Promise(function(resolve, reject) {
    reject(66)
})
let p = Promise.race([promise1, promise2])
p.then(function(value) {
    console.log(value) // 12
})
// 当存在拒绝Promise时， 同样会进行竞选，若先解决的是已完成Promise则执行then若先解决的是以拒绝Promise则先执行catch
let p2 = Promise.race([promise1,promise2, promise3])
p2.then(function(value) {
    console.log(value) // 12
 })
// 未执行
p2.catch(function(value) {
   console.log(value) 
})

```

### 自Promise继承

- Promise与其他内建类型一样，也可以作为基类派生其他类，所以你可以定义自己的Promise变量来扩展内建Promise的功能

```js
// 此时MyPromise支持 success 和 failure 方法
class MyPromise extends Promise {
    success(resolve, reject) {
        return this.then(resolve, reject)
    }
    failure(reject) {
        return this.catch(reject)
    }
}
let p = new MyPromise(function(resolve, reject) {
    resolve(42)
})
p.success(function(value) {
    console.log(value) // 42
    return Promise.reject(66)
}).failure(function(err) {
    console.log(err) // 66
})
```

- 由于静态方法会被继承，因此派生的Promise也拥有MyPromise.resolve()、MyPromise.reject()、MyPromise.race()和MyPromise.all()这4个方法，后二者与内建方法完全一致，而前二者却稍有不同。

- 由于MyPromise.resolve()方法和MyPromise.reject()方法通过Symbol.species属性（参见第9章）来决定返回Promise的类型，故调用这两个方法时无论传入什么值都会返回一个MyPromise的实例

#### 基于Promies的异步任务执行

- 在第8章介绍了通过生成器编写任务执行器， 但编写的代码较为复杂，不便于理解，通过Promise可以进一步简化任务执行器

```js
let fs = require('fs')
function run(taskDef) {
    let task = taskDef(),
    result = task.next();
    // 这里没有通过step()调用，直接IIFE开始执行代码
    (function step() {
        if (!result.done) {
            let p = Promise.resolve(result.value)
            p.then(function(value) {
                result = task.next(value)
                step()
            }).catch(function(err) {
                result = task.throw(err)
                // 这行不能提到外面，提到外面会变成同步执行
                step()
            })
        }
    }())
}
function readFile(name) {
    return new Promise(function(resolve, reject) {
        fs.readFile(name,'utf-8', function(err, contents) {
            if (err) {
                reject(err)
                return 
            }
            resolve(contents)
        })
    })
}
run(function *() {
    let contents = yield readFile('config.json')
    console.log(contents)
    //..执行后续代码
    // doSomething(contents)
})
```

- 在step()函数中，如果有更多任务，那么result.done的值为false，此时的result.value应该是一个Promise，调用Promise.resolve()是为了防止函数不返回Promise。（记住，传入Promise.resolve()的Promise直接通过，传入的非Promise会被包裹成一个Promise。）接下来，添加完成处理程序提取Promise的值并将其传回迭代器。然后在step()函数调用自身之前结果会被赋值给下一个生成的结果

**本书的最后将补充说明await 和 async ，他们就相当于一个封装好的任务执行器**



## 12 代理(Proxy) 和反射(Reflection) API

- 代理（Proxy）是一种可以拦截并改变底层JavaScript引擎操作的包装器，在新语言中通过它暴露内部运作的对象，从而让开发者可以创建内建的对象

### 数组问题

- 在es6之前， 开发者不能通过自己定义的对象模仿数组对象的行为， 如数组中修改length属性时， 元素会受到影响（第九章内建对象继承中也提到了这一点）

### 代理和反射

- 调用new Proxy()可创建代替其他目标（target）对象的代理
- 代理可以拦截JavaScript引擎内部目标的底层对象操作，这些底层操作被拦截后会触发响应特定操作的陷阱函数。
- 反射API以Reflect对象的形式出现，对象中方法的默认特性与相同的底层操作一致，而代理可以覆写这些操作，每个代理陷阱对应一个命名和参数都相同的Reflect方法

js中的代理陷阱

![代理陷阱](./img/代理陷阱.png)

### 创建一个简单的代理

- 用Proxy构造函数创建代理需要传入两个参数：目标（target）和处理程序（handler）。
- 处理程序是定义一个或多个陷阱的对象，在代理中，除了专门为操作定义的陷阱外，其余操作均使用默认特性。不使用任何陷阱的处理程序等价于简单的转发代理

```js
let target = {}
// 创建转发代理
let proxy = new Proxy(target, {})
proxy.name = 'proxy'
console.log(proxy.name) // 'proxy'
// 属性赋值被转发
console.log(target.name) // 'proxy'
proxy.name = 'target' 
console.log(proxy.name) // 'target'
console.log(target.name) // 'target'
```

### 使用set陷阱验证属性

set陷阱接受4个参数：

-  trapTarget　用于接收属性（代理的目标）的对象。
-  key　要写入的属性键（字符串或Symbol类型）。
-  value　被写入属性的值。
-  receiver　操作发生的对象（通常是代理）

Reflect.set()是set陷阱对应的反射方法和默认特性，它和set代理陷阱一样也接受相同的4个参数

如果属性已设置陷阱应该返回true，如果未设置则返回false。（Reflect.set()方法基于操作是否成功来返回恰当的值。）

- 假设想创建一个属性值是数字的对象，对象中每新增一个属性都要加以验证，如果不是数字必须抛出错误,代理如下

```js
let target = {
    name: 'zhangsan'
}
let proxy = new Proxy(target, {
    set(trapTarget, key, value, receiver) {
        // 若是本身存在的属性，则不需要验证
        if (!Object.hasOwnProperty(key)) {
            // isNaN 判断是否是NaN，当value不是Number时， 会先转为Number类型，在判断是否为NaN
            if(isNaN(value)) {
                throw new TypeError('属性值必须是数字')
            }
        }
        return Reflect.set(trapTarget, key, value, receiver)
    }
})

proxy.count = 1
console.log(proxy.name) // 1
console.log(target.name) // 1
// 由于是已有属性，所以不报错
proxy.name = 'lisi'
console.log(proxy.name) // 'lisi'
console.log(target.name) // 'lisi'

// 非数字，报错
proxy.str = 'wangwu'

```

### 用get陷阱验证对象结构

- js对象中， 当读取一个不存在的不会抛出错误， 而是返回 `undefined`, 但如果我们希望， 某个对象始终具有指定的属性和方法，当访问不存在的属性时，就抛出错误， 这种行为就需要用get陷阱来实现
- get陷阱接收3个参数
  - trapTarget　被读取属性的源对象（代理的目标）。
  -  key　要读取的属性键（字符串或Symbol）。
  -  receiver　操作发生的对象（通常是代理）
- Reflect.get()也接受同样3个参数并返回属性的默认值

```js
let target = {name: 'zhangsan'}
let proxy = new Proxy(target, {
    get(trapTarget, key, receiver) {
        if (!(key in receiver)) {
            throw new TypeError('属性' + key + '不存在')
        }
        return Reflect.get(trapTarget,key, receiver)
    }
})
console.log(proxy.name) // 'zhangsan'
// 不存在属性， 抛出错误
console.log(proxy.na) 

```

> 这里之所以用in操作符检查receiver而不检查trapTarget，是为了防止receiver代理含有has陷阱（下一节讲解）。在这种情况下检查trapTarget可能会忽略掉has陷阱，从而得到错误结果

### 使用 has 陷阱隐藏已有属性

- 可以用in操作符来检测给定对象中是否含有某个属性，如果自有属性或原型属性匹配这个名称或Symbol就返回true。例如: 

```js
let target = {value: 42}
console.log('value' in target) // true
console.log('toString' in target) // true
```

- 在代理中使用has陷阱可以拦截 in 操作， 并返回不同得值， 每当使用in操作符时都会调用has陷阱，并传入两个参数：
  - trapTarget　读取属性的对象（代理的目标）
  -  key　要检查的属性键（字符串或Symbol）
- Reflect.has()方法也接受这些参数并返回in操作符的默认响应

```js
let target = {name: 'zhangsan', value: 42}
let proxy = new Proxy(target, {
    has(trapTarget, key) {
        if (key === 'value') {
            return false
        } else {
            return Reflect.has(trapTarget, key)
        }
    }
})
console.log('name' in proxy)  // true
// 被拦截， 返回false
console.log('value' in proxy) // false
```

### 用deleteProperty陷阱防止删除属性

- delete操作符可以从对象中移除属性，如果成功则返回true，不成功则返回false

```js
let target = {name:'zhangsan', value: 42}
console.log('name' in target) // true
let res1 = delete target.name
// 返回true
console.log(res1) // true
// 属性被删除
console.log('name' in target) // false

Object.defineProperty(target, 'value', {
    // 属性不可配置时，也不能删除
    configurable: false
})
let res2 = delete target.value
//在严格模式下，如果你尝试删除一个不可配置（nonconfigurable）属性则会导致程序抛出错误，而在非严格模式下只是返回false
console.log(res2) // false
// 仍然存在
console.log('value' in target) // true

```

- 在代理中，可以通过deleteProperty陷阱来改变这个行为，每当通过delete操作符删除对象属性时，deleteProperty陷阱都会被调用，它接受两个参数：
  -  trapTarget　要删除属性的对象（代理的目标）。
  - key　要删除的属性键（字符串或Symbol）
- Reflect.deleteProperty()方法为deleteProperty陷阱提供默认实现，并且接受同样的两个参数

```js
let target = {name:'zhangsan', value: 42}
let proxy = new Proxy(target, {
    deleteProperty(trapTarget,key) {
       // value不可删除
        if (key === 'value') {
            return false
        } else {
            return Reflect.deleteProperty(trapTarget, key)
        }
    }
})
let res1 = delete proxy.name
// 返回true
console.log(res1) // true
// 属性被删除
console.log('name' in proxy) // false

let res2 = delete proxy.value
// value未被删除
console.log(res2) // false
// 仍然存在
console.log('value' in proxy) // true
```

> 如果你希望保护属性不被删除，而且在严格模式下不抛出错误，那么这个方法非常实用。

### 原型代理陷阱

-  setPrototypeOf陷阱和getPrototypeOf陷阱,他们可以拦截Object.setPrototypeOf, Object.getPrototypeOf两个方法的执行过程
- setPrototypeOf陷阱，接收两个参数：  
  - trapTarget　接受原型设置的对象（代理的目标）
  -  proto　作为原型使用的对象
- getPrototypeOf陷阱, 只接受参数trapTarget
- Reflect上的相应方法会使用默认行为

#### 原型代理陷阱的运行机制

- getPrototypeOf陷阱 必须返回 null 或对象， 如果返回对象， Object.getPrototypeOf()便假设操作成功
- setPrototypeOf陷阱中，如果操作失败则返回的一定是false，此时Object.setPrototypeOf()会抛出错误，如果setPrototypeOf返回了任何不是false的值，那么Object.setPrototypeOf()便假设操作成功

```js
let target = {}
let proxy = new Proxy(target, {
    getPrototypeOf(trapTarget) {
        // 若使用Relect则返回默认行为
        // return Reflect.getPrototypeOf(trapTarget)
        return null
    },
    setPrototypeOf(trapTarget, proto) {
        // 若使用Relect则返回默认行为
        // return Reflect.setPrototypeOf(trapTarget,proto)
        return false
	}
})
let targetProto = Object.getPrototypeOf(target)
let proxyProto = Object.getPrototypeOf(proxy)
console.log(targetProto === Object.prototype) // true
// 结果被改变
console.log(proxyProto === Object.prototype) // false
// 成功
Object.setPrototypeOf(target, {})
Object.setPrototypeOf(proxy, {}) // 抛出错误
```

#### 为什么有两组方法

- 从上文中，可以看出陷阱方法和原本的方法操作相似， 那么为什么要添加这两个陷阱方法?
- 这是因为他们有以下不同之处：
  - Reflect.getPrototypeOf()方法和Reflect.setPrototypeOf()方法则是底层操作，赋予开发者可以访问只在内部操作的[[GetPrototypeOf]]和[[SetPrototypeOf]]的权限
  - Object.getPrototypeOf()和Object.setPrototypeOf()是高级操作，创建伊始便是给开发者使用的, 虽然也调用了[[GetPrototypeOf]]和[[SetPrototypeOf]]，但在此之前会执行一些额外步骤，并通过检查返回值来决定下一步的操作。
- 如果传入的参数不是对象，则Reflect.getPrototypeOf()方法会抛出错误，而Object.getPrototypeOf()方法则会在操作执行前先将参数强制转换为一个对象

```js
let result1 = Object.getPrototypeOf(1)
console.log(result1 === Number.prototype) // true
// Reflect会抛出错误
Reflect.getPrototypeOf(1)
```

- Reflect.setPrototypeOf()方法返回一个布尔值来表示操作是否成功，成功时返回true，失败则返回false；而Object.setPrototypeOf()方法成功返回目标对象， 失败则会抛出一个错误。

```js
let target1 = {}
let res1 = Object.setPrototypeOf(target1, {}) 
console.log(res1 === target1) // true
let target2 = {}
let res2 = Reflect.setPrototypeOf(target2, {})
console.log(res2 === target1) // false
console.log(res2) // true
```

### 对象可扩展性陷阱

es5中有如下两个方法:

- `Object.preventExtensions(obj)`方法让一个对象变的不可扩展，也就是永远不能再添加新的属性。

- `Object.isExtensible()` 方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）。

ECMAScript 6中：

- 可以通过代理中的preventExtensions和isExtensible陷阱拦截这两个方法并调用底层对象。
  - 两个陷阱都接受唯一参数trapTarget对象
  - 两个陷阱返回布尔值，表示操作是否成功
- Reflect.preventExtensions()方法和Reflect.isExtensible()方法实现了相应陷阱中的默认行为，二者都返回布尔值



**使用示例**

```js
let target = {}
let proxy = new Proxy(target, {
    isExtensible(trapTarget) {
        // 返回默认行为
      return Reflect.isExtensible(trapTarget)  
    },
    preventExtensions(trapTarget) {
        // 调用冻结陷阱都返回false
        return false
    }
})
// 返回true 代表可扩展
console.log(Object.isExtensible(target)) // true
console.log(Object.isExtensible(proxy)) // true
// 冻结proxy
Object.preventExtensions(proxy) 
console.log(Object.isExtensible(target)) // true
// 由于陷阱返回false，所以实际上没有冻结，这里仍然返回 true
console.log(Object.isExtensible(proxy)) // true
```

**重复的可扩展性方法**

- 与原型代理陷阱中提及的原因一致， 对象可扩展性陷阱更偏向于底层
  - Object.isExtensible 和 Object.preventExtensions 可以接收非对象参数， 会将参数进行类型转换，而陷阱则会直接报错

### 属性描述符陷阱

- `defineProperty`陷阱和`getOwnPropertyDescriptor`陷阱,他们可以拦截`Object.defineProperty`, `Object.getOwnPropertyDescriptor`两个方法的执行过程

- defineProperty陷阱接受以下参数 (操作成功后返回true，否则返回false):  
  - trapTarget　要定义属性的对象（代理的目标）
  -  key 属性的键（字符串或Symbol）
  -  descriptor　属性的描述符对象
- `getOwnPropertyDescriptor`陷阱只接受`trapTarget`和`key`两个参数，最终返回描述符
- `Reflect.defineProperty()`方法和`Reflect.getOwnPropertyDescriptor()`方法与对应的陷阱接受相同参数

**模拟默认行为**

```js
let proxy = new Proxy({}, {
    defineProperty(trapTarget, key, descriptor) {
        return Reflect.defineProperty(trapTarget, key, descriptor)
    },
    getOwnPropertyDescriptor(trapTarget, key) {
        return Reflect.getOwnPropertyDescriptor(trapTarget, key)
    }
})
Object.defineProperty(proxy, 'name', {
    value: 'proxy'
})
console.log(proxy.name) // 'proxy'
let desc = Object.getOwnPropertyDescriptor(proxy, 'name') 
console.log(desc.value) // 'proxy'
```

#### 给Object.defineProperty()添加限制

- defineProperty陷阱返回布尔值来表示操作是否成功。
  - 返回true时，Object.defineProperty()方法成功执行；返回false时，Object.defineProperty()方法抛出错误

- 下面的例子阻止定义Symbol属性

```js
let proxy = new Proxy({}, {
    defineProperty(trapTarget, key, descriptor) {
        if (typeof key === 'symbol') {
            return false
        }
        return Reflect.defineProperty(trapTarget, key, descriptor)
    }
})
Object.defineProperty(proxy, 'name', {
    value: 'proxy'
})
console.log(proxy.name) // 'proxy'
let symbol = Symbol('name')
// 报错
Object.defineProperty(proxy, symbol, {
    value: 'proxy'
})
```

> 如果让陷阱返回true并且不调用Reflect.defineProperty()方法，则可以让Object.defineProperty()方法静默失效，这既消除了错误又不会真正定义属性



#### 描述符对象限制

- 无论将什么对象作为第三个参数传递给Object.defineProperty()方法，都只有属性enumerable、configurable、value、writable、get和set将出现在传递给defineProperty陷阱的描述符对象中
  - 在下面这段代码中，调用Object.defineProperty()时传入包含非标准name属性的对象作为第三个参数。当defineProperty陷阱被调用时，descriptor对象有value属性却没有name属性
  - 这是因为descriptor不是实际传入Object.defineProperty()方法的第三个参数的引用，而是一个只包含那些被允许使用的属性的新对象。
  - Reflect.defineProperty()方法同样也忽略了描述符上的所有非标准属性。

```JS
let proxy = new Proxy({}, {
    defineProperty(trapTarget, key, descriptor) {
        console.log(descriptor.value) // 'proxy'
        console.log(descriptor.name) // undefined
        return Reflect.defineProperty(trapTarget, key, descriptor)
    }
})
Object.defineProperty(proxy, 'name', {
    value: 'proxy',
    name: 'custom'
})
```

- getOwnPropertyDescriptor陷阱的限制条件稍有不同，它的返回值必须是null、undefined或一个对象。
  - 如果返回对象，则对象自己的属性只能是enumerable、configurable、value、writable、get和set，在返回的对象中使用不被允许的属性会抛出一个错误

```js
let proxy = new Proxy({}, {
    getOwnPropertyDescriptor(trapTarget, key) {
        // 属性描述符中不允许有name属性，当调用Object.getOwnPropertyDescriptor()时，getOwnPropertyDescriptor的返回值会触发一个错误。这条限制可以确保无论代理中使用了什么方法，Object.getOwnPropertyDescriptor()返回值的结构总是可靠的
        return {
            name: 'proxy'
        }
    }
})
let desc = Object.getOwnPropertyDescriptor(proxy, 'name')
```

#### 重复的描述符方法

- 同样，这些陷阱方法与原来的方法基本类似，但它们有以下差异
  - Object.defineProperty()方法和Reflect.defineProperty()方法只有返回值不同：Object.defineProperty()方法返回第一个参数，而Reflect.defineProperty()的返回值与操作有关，成功则返回true，失败则返回false
  - 调用Object.getOwnPropertyDescriptor()方法时传入原始值作为第一个参数，内部会将这个值强制转换为一个对象；另一方面，若调用Reflect.getOwnProperty-Descriptor()方法时传入原始值作为第一个参数，则会抛出一个错误

### ownKeys陷阱

- ownKeys代理陷阱可以拦截内部方法[[OwnPropertyKeys]]，我们通过返回一个数组的值可以覆写其行为。
  - 这个数组被用于Object.keys()、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()和Object.assign()4个方法，Object.assign()方法用数组来确定需要复制的属性
- ownKeys陷阱唯一接受的参数是操作的目标
  - 返回值必须是一个数组或类数组对象，否则就抛出错误。
  - 当调用Object.keys()、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()或Object.assign()方法时，可以用ownKeys陷阱来过滤掉不想使用的属性键
- ownKeys陷阱通过Reflect.ownKeys()方法实现默认的行为
  - 返回的数组中包含所有自有属性的键名，字符串类型和Symbol类型的都包含在内。
  - Object.getOwnPropertyNames()方法和Object.keys()方法返回的结果将Symbol类型的属性名排除在外
  - Object.getOwnPropertySymbols()方法返回的结果将字符串类型的属性名排除在外
  - Object.assign()方法支持字符串和Symbol两种类型。
- 下面的实例中， 过滤掉所有 下划线开头的属性

```js
let proxy = new Proxy({}, {
    ownKeys(trapTarget) {
        // 首先通过ownKeys方法返回默认行为的数组， 之后通过filter返回， 类型不是字符串或是子串但是开头不是_的 key
        return Reflect.ownKeys(trapTarget).filter(key => {
            return typeof key !== 'string' || key[0] !== '_'
        })
    }
})
let nameSymbol = Symbol('name')
proxy.name = 'proxy'
proxy._name = 'private'
proxy[nameSymbol] = 'symbol'

let names = Object.getOwnPropertyNames(proxy)
	,keys = Object.getOwnPropertyNames(proxy)
	,symbols = Object.getOwnPropertySymbols(proxy)
console.log(names.length)
console.log(names[0]) // 'proxy'
console.log(keys.length)
console.log(keys[0]) // 'proxy'
console.log(symbols.length)
console.log(symbols[0]) // Symbol(name)
```

> ownKeys陷阱也会影响for-in循环，当确定循环内部使用的键时会调用陷阱

### 函数代理中的apply和construct陷阱

- 所有代理陷阱中，只有apply和construct的代理目标是一个函数。回忆第3章，函数有两个内部方法[[Call]]和[[Construct]]，apply陷阱和construct陷阱可以覆写这些内部方法。
  - 若使用new操作符调用函数，则执行[[Construct]]方法；
  - 若不用，则执行[[Call]]方法，此时会执行apply陷阱
- apply陷阱和Reflect.apply()接受以下参数：
  -  trapTarget　被执行的函数（代理的目标）。
  - thisArg　函数被调用时内部this的值。
  -  argumentsList　传递给函数的参数数组。
- construct 陷阱和 Reflect.construct()接收以下参数：
  -  trapTarget　被执行的函数（代理的目标）。
  -  argumentsList　传递给函数的参数数组。
  - newTarget (可选)，用于指定函数内部new.target的值

**模拟默认行为**

```js
let target = function() {return 42}
let proxy = new Proxy(target, {
    apply(trapTarget, thisArg, argumentsList) {
        return Reflect.apply(trapTarget, thisArg, argumentsList)
    },
    construct(trapTarget, argumentsList) {
        return Reflect.construct(trapTarget, argumentsList)
    }
})
// 通过下面结果可以看出， 代理与函数行为完全相同
console.log(typeof proxy) // 'function'
console.log(proxy()) //  42

var instance = new proxy()
console.log(instance instanceof proxy) // true
console.log(instance instanceof target) // true
```

#### 验证函数参数

- apply陷阱和construct陷阱增加了一些可能改变函数执行方式的可能性
- 例如，假设你想验证所有参数都属于特定类型

```js
function sum(...values) {
    return values.reduce((pre, curr) => pre + curr, 0)
}
// 下面的代理实现了函数参数必须是数字， 且不可以通过new调用 （注： 也可以反过来使用，如必须用new调用，参数为数字）
let proxy = new Proxy(sum, {
    apply(trapTarget, thisArg, argumentsList) {
        argumentsList.forEach(arg => {
            if (typeof arg !== 'number') {
                throw new TypeError('所有参数必须是数字')
            }
        })
        return Reflect.apply(trapTarget, thisArg, argumentsList)
    },
    construct(trapTarget, argumentsList) {
        throw new TypeError('该函数不可以通过new调用')
    }
})
console.log(proxy(1,2,3)) // 6
console.log(proxy(1,'2',3)) // 报错
console.log(new proxy()) // 报错
```

> 函数调用方式同样可以用new.target确定

#### 不用new调用构造函数

- new.target和代理都可以判断是否用new 调用函数， 但如果函数定义在无法修改的代码中， 那么这种情况，只能使用代理

  - 如， 本身函数没有设定调用方式，用代理设定 (**验证函数参数**一节的例子)
  - 如，本身用new.target 设定了调用方式，但是依然想要支持另一种方式,例子如下:

  ```js
  function Numbers(...values) {
      if (typeof new.target === 'undefined') {
          throw new TypeError('该函数必须通过new调用')
      }
      this.values = values
  }
  let proxy = new Proxy(Numbers, {
      apply(trapTarget, thisArg, argumentsList) {
          // 在apply陷阱中调用 construct方法，此时代理也能够不用new调用
          return Reflect.construct(trapTarget, argumentsList)
      }
  })
  let res = proxy(3,6,8)
  console.log(res.values) // [3,6,8]
  ```

#### 覆写抽象基类构造函数

```js
// 定义抽象类，并用new.target设定函数必须被继承，而不能使用new AbstractNumbers()的方式直接创建实例
class AbstractNumbers {
    constructor(...values) {
        if (new.target === AbstractNumbers) {
            throw new TypeError('此函数必须被继承')
        }
        this.values = values
    }
}
// 通过代理可以绕过这一限制
let AbstractNumbersProxy = new Proxy(AbstractNumbers, {
    construct(trapTarget, argumentsList) {
        // 传入第三个参数，指定new.target得值，从而绕过限制
        return Reflect.construct(trapTarget, argumentsList, function() {})
    }
})
let instance = new AbstractNumbersProxy(6,6,6)
console.log(instance.values) // [6,6,6]
```

#### 可调用的类构造函数

- 第9章解释说，必须用new来调用类构造函数，因为类构造函数的内部方法[[Call]]被指定来抛出一个错误。但是代理可以拦截对[[Call]]方法的调用，这意味着可以通过使用代理来有效地创建可调用类构造函数，创建方式如下：

```js
class Person {
    constructor(name) {
        this.name = name
    }
}
let PersonProxy = new Proxy(Person, {
    apply(trapTarget, thisArg, argumentList) {
        // 通过new调用目标对象
        return new trapTarget(...argumentList)
    }
})
// 不通过new调用
let me = PersonProxy('zhangsan')
console.log(me.name) // 'zhangsan'
console.log(me instanceof Person) // true
console.log(me instanceof PersonProxy) // true
```

### 可撤销代理

- 通常，在创建代理后，代理不能脱离其目标，上文中的例子都是不可撤销代理， 但是可能存在想撤销代理的情况
- 可以使用Proxy.revocable()方法创建可撤销的代理，该方法采用与Proxy构造函数相同的参数：目标对象和代理处理程序。返回值是具有以下属性的对象：
  - proxy　可被撤销的代理对象。
  - revoke　撤销代理要调用的函数。

```js
let target = {name: 'zhangsan'}
let {proxy, revoke} = Proxy.revocable(target,{})
console.log(proxy.name) // 'zhangsan'
//执行撤销函数
revoke()
console.log(proxy.name) // 报错，因为代理已经不存在
```

### 解决数组问题

- 下面几节讲解如何通过代理实现数组默认行为

#### 检测数组索引

- 要判断一个属性是否是一个数组索引,es6规范提供以下说明
  - 当且仅当ToString(ToUint32(P))等于P，并且ToUint32(P)不等于2^32-1时，字符串属性名称P才是一个数组索引。

```js
// toUint32()函数通过规范中描述的算法将给定的值转换为无符号32位整数；isArrayIndex()函数先将键转换为uint32结构，然后进行一次比较以确定这个键是否是数组索引
function toUnit32(value) {
    return Math.floor(Math.abs(Number(value))) % Math.pow(2,32)
}
function isArrayIndex(key) {
    let numericKey = toUnit32(key)
    return String(numericKey) == key && numericKey < (Math.pow(2,32) - 1)
}
```

#### 实现MyArray类

```js
// 这里省略了原书中通过 定义 function createMyArray() {} 返回代理的方式
// 直接实现MyArry类 (写法与createMyArray基本相同)
class MyArray {
    // 通过构造函数返回代理
    constructor(length = 0) {
        this.length = length
        return new Proxy(this, {
            set(trapTarget, key, value) {
                // 获取未更新的length值
                let currentLength = Reflect.get(trapTarget, 'length')
                if (isArrayIndex(key)) {
                    // 当添加新元素时 ,若key符合条件，则增加length值
                    let numbericKey = Number(key)
                    if (numbericKey >= currentLength) {
                        Reflect.set(trapTarget, 'length', numbericKey + 1)
                    }
                    
                } else if (key === 'length'){
                    // 当key为length时，且length在减少，则删除元素
                    if (value < currentLength) {
                        for (let i = currentLength - 1; i >= value; i--) {
                            Reflect.deleteProperty(trapTarget, key, i)
                        }
                    }
                    
                }
                // 无论哪种情况最后都执行该语句
                return Reflect.set(trapTarget, key, value)
            }
        })
    }
}

let names = new MyArray(3)
console.log(names.length) // 3
names[0] = 'zhangsan'
names[1] = 'lisi'
names[2] = 'wangwu'
names[3] = 'zhaoliu'
console.log(names.length) // 4
names.length = 2
console.log(names[1]) // 'lisi'
console.log(names[2]) // undefined
console.log(names[3]) // undefined

```

> 虽然从类构造函数返回代理很容易，但这也意味着每创建一个实例都要创建一个新代理。然而，有一种方法可以让所有实例共享一个代理：将代理用作原型。

### 将代理用作原型

- 首先需要明确： 如果代理是原型，仅当默认操作继续执行到原型上时才会调用代理陷阱
  - 如下例子所示： 创建newTarget对象，它的原型是一个代理。由于代理是透明的，所以target会成为newTarget的原型。而Object.defineProperty()这一方法不会操作对象原型，那么原型上的陷阱就永远不会调用

```js
let target = {}
let newTarget = Object.create(new Proxy(target, {
    // 不会被调用
    defineProperty(trapTarget, key, descriptor) {
        // 若被调用则会报错
        return false
    }
}))
//并没有报错
Object.defineProperty(newTarget, 'name', {
    value: 'new'
})
console.log(newTarget.value) // 'new'
console.log(newTarget.hasOwnProperty('name')) // true
```

#### 在原型上使用get陷阱

- 调用内部方法[[Get]]读取属性的操作先查找自有属性，如果未找到指定名称的自有属性，则继续到原型中查找，直到没有更多可以查找的原型过程结束。
- 如果设置一个get代理陷阱，则每当指定名称的自有属性不存在时，又由于存在以上过程，往往会调用原型上的陷阱。
- 当访问我们不能保证存在的属性时，则可以用get陷阱来预防意外的行为。只需创建一个对象，在尝试访问不存在的属性时抛出错误即可：

```js
let target = {}
let thing = Object.create(new Proxy(target, {
    get(trapTarget, key, receiver) {
        // 引用错误，代表当一个不存在的变量被引用时发生的错误。
        throw new ReferenceError(`${key} doesn't exist`)
    }
}))
thing.name = 'zhangsan'
console.log(thing.name) // 'zhangsan'
console.log(thing.age) // 报错
```

#### 在原型上使用set陷阱

- 内部方法[[Set]]同样会检查目标对象中是否含有某个自有属性，如果不存在则继续查找原型。当给对象属性赋值时，如果存在同名自有属性则赋值给它；如果不存在给定名称，则继续在原型上查找
- 但，无论原型上是否存在同名属性，给该属性赋值时都将默认在实例（不是原型）中创建该属性
  - 下面用实际例子体现以上特点

```js
let target = {}
let thing = Object.create(new Proxy(target, {
    set(trapTarget, key, value, receiver) {
        Reflect.set(trapTarget, key, value, receiver)
    }
}))
// 触发set代理陷阱,因为会在原型上寻找属性
thing.name = 'zhangsan'
console.log(thing.name) // 'zhangsan'
// 不触发陷阱，因为已经存在同名自有属性
thing.name = 'lisi'
console.log(thing.name) // 'lisi'

```

#### 在原型上使用has陷阱

- has陷阱，它可以拦截对象中的in操作符。in操作符先根据给定名称搜索对象的自有属性，如果不存在，则沿着原型链依次搜索后续对象的自有属性，直到找到给定的名称或无更多原型为止。
- 因此，只有在搜索原型链上的代理对象时才会调用has陷阱，而当你用代理作为原型时，只有当指定名称没有对应的自有属性时才会调用has陷阱

```js
let target = {}
let thing = Object.create(new Proxy(target, {
    has(trapTarget, key) {
        Reflect.has(trapTarget, key)
    }
}))
// 触发has代理陷阱,因为会在原型上寻找属性
console.log('name' in thing) // false
thing.name = 'lisi'
// 不触发陷阱，因为已经存在同名自有属性
console.log('name' in thing) // true
```

#### 将代理用作类的原型

- 由于类的prototype属性是不可写的，因此不能直接修改类来使用代理作为类的原型。
- 然而，可以通过继承的方法来让类误以为自己可以将代理用作自己的原型。
- 首先，需要用构造函数创建一个ECMAScript 5风格的类型定义

```js
function NoSuchProperty() {
}
NoSuchProperty.prototype = new Proxy({},{
    get(trapTarget, key, receiver) {
        throw new ReferenceError(`${key} doesn't exist`)
    }
})
let thing = new NoSuchProperty()
console.log(thing.name) // 报错
```

- 那么此时就可以用`NoSuchProperty`作为类将继承的基类来使用

```js
function NoSuchProperty() {
}
NoSuchProperty.prototype = new Proxy({},{
    get(trapTarget, key, receiver) {
        throw new ReferenceError(`${key} doesn't exist`)
    }
})
class Square extends NoSuchProperty {
    constructor(length,width) {
        super()
        this.length = length
        this.width = width
    }
    getArea() {
        return this.length * this.width
    }
}
let shape = new Square(3,4)
let area = shape.width * shape.length
console.log(area) // 12
// console.log(shape.w) // 报错
// 正常执行
console.log(shape.getArea()) // 12
```

- 可以看到在上述代码中， getArea()方法 虽然位于 Square.prototype上，但是能够正常执行，这是因为真正的代理是 Square.prototype的原型， 代理位于原型链上，显然我们并不希望当getArea()被调用时还抛出错误，此时的效果就是希望得到的效果

## 13 用模块封装代码

- 在ECMAScript 6以前，在应用程序的每一个JavaScript中定义的一切都共享一个全局作用域。这一做法会引起问题，如命名冲突和安全问题。ECMAScript 6的一个目标是解决作用域问题，也为了使JavaScript应用程序显得有序，于是引进了模块

### 什么是模块

- 模块是自动运行在严格模式下并且没有办法退出运行的JavaScript代码。
- 与共享一切架构相反的是，在模块顶部创建的变量**不会自动被添加到全局共享作用域**，这个变量仅在模块的顶级作用域中存在
- 模块必须导出一些外部代码可以访问的元素，如变量或函数。模块也可以从其他模块导入绑定。
- 在模块的顶部，this的值是undefined；其次，模块不支持HTML风格的代码注释

### 导出的基本语法

- 将export放在任何变量、函数或类声明的前面，以将它们从模块导出
  - 可以在声明时直接导出 ，也可在声明后导出引用（这种导出方式必须加 {}）
  - 除非用default关键字，否则不能用export导出匿名函数或类（“模块的默认值”一节中介绍default）

```js
// 声明时导出
export var color = 'red'
export let name = 'zhangsan'
export const arr = [18]
export function sum(num1, num2) {
    return num1 + num2
}
export class Person{
    constructor(name) {
        this.name = name
    }
}
// 未导出时，该函数就是私有的,无法从外部访问
function subtract(num1, num2) {
    return num1 - num2
}
// 声明后导出， 需要用 {} 包裹
function multpiy(num1,num2) {
    return num1 * num2
}
export {multpiy}

```

### 导入的基本语法

- 语句基本形式

```js
import {identifier1, identifier2} from './example.js'
```

- import后面的大括号表示从给定模块导入的绑定（binding）
- 关键字from表示从哪个模块导入给定的绑定，填写指定路径信息， 必须有后缀名

> 导入绑定的列表看起来与解构类似， 但它不是

- 当从模块中导入一个绑定时，它就好像使用const定义的一样。
  - 无法定义另一个同名变量（包括导入另一个同名绑定）
  - 也无法在import语句前使用标识符或改变绑定的值



#### 导入单个绑定

```js
// 导入单个
import {sum} from './example.js'
console.log(sum(1,2)) // 3
sum = 1 // 报错， 不能修改绑定
```

> 为了最好地兼容多个浏览器和Node.js环境，一定要在字符串之前包含/、./或../来表示要导入的文件

#### 导入多个绑定

```js
import {sum, subtract} from './example.js'
```

#### 导入整个模块

- 可以导入整个模块作为一个单一的对象。然后所有的导出都可以作为对象的属性使用
  - 这种导入格式被称作命名空间导入（namespaceimport）。因为example.js文件中不存在example对象，故而它作为example.js中所有导出成员的命名空间对象而被创建。

```js
import * as example from './example.js'
console.log(example.color) // 'red'
console.log(example.sum(1,2)) // 3
```

#### 导入只执行一次

- 不管在import语句中把一个模块写了多少次，该模块将只执行一次。导入模块的代码执行后，实例化过的模块被保存在内存中，只要另一个import语句引用它就可以重复使用它
  - 在下面的代码中， 尽管这个模块有3个import语句，但example.js将只执行一次。如果同一个应用程序中的其他模块也从example.js导入绑定，那么那些模块与此代码将使用相同的模块实例

```js
import {sum} from './example.js'
import {subtract} from './example.js'
import {color} from './example.js'
```

#### 模块语法的限制

- 必须在其他语句和函数之外使用模块的导出导入， 不能动态地导入或导出绑定

```js
// 下面两种写法都是错误的
let a = true
if (a) {
    // 错误
    export b = '6'
}
function tryImport() {
    // 错误
    import {sum} form './example.js'
}

```

#### 导入绑定的一个微妙怪异之处

- 上文中提及了导入不能修改，这是因为
  - ECMAScript 6的import语句为变量、函数和类创建的是只读绑定，而不是像正常变量一样简单地引用原始绑定 （注： 当导入的是对象时， 由于对象使用相同的引用， 所以在不同模块修改对象的属性， 在导出的模块也会发生变化）
  - 下面的例子展示了如何在模块外修改模块内的导出值，
    -  若是对象可以直接修改
    - 若是变量等类型，则需要通过模块内的方法进行修改

```js
// 导出 example.js
export let color = 'red'
export function editColor(newColor) {
    color = newColor
    console.log(color) // 'blue'
}
export let  obj = {
    a: 1
}
console.log(obj.a) // 1
setTimeout(() => {
console.log(obj.a) // 2
},2000)
```

```html
<!--test.html-->
<script type="module">
    import {color, editColor, obj} from './example.js'
    console.log(color); // red
    obj.a = 2
    console.log(obj) // {a:2}
    editColor('blue')
</script>
```

- 上面代码的打印结果顺序为

```js
/*
1
red
{a:2}
blue
2
*/
```

### 导出和导入时重命名

- 导出时使用 as 关键字 和 `{}`配合使用, as关键字来指定函数在模块外应该被称为什么名称

```js
function sum(num1, num2) {
    return num1 + num2
}
export {sum as add}

// 此时在另一个模块中导入时， 只能使用 add 导入
import {add} from './example.js'
console.log(add(2,3)) // 5
```

- 导入时，也可以使用 as关键字

```js
// 这时使用了 sum 来重命名 add函数
import {add as sum} from './example.js'
console.log(sum(2,3)) // 5
```

 ### 模块的默认值

- 诸如CommonJS（浏览器外的另一个JavaScript使用规范）的其他模块系统中，从模块中导出和导入默认值是一个常见的做法。
- es6模块的默认值指的是通过default关键字指定的单个变量、函数或类，只能为每个模块设置一个默认的导出值，导出时多次使用default关键字是一个语法错误。

#### 导出默认值

```js
// 声明时直接设置导出默认值 (可以导出匿名函数)
export default function(num1, num2) {
    return num1 + num2
}

// 声明后导出，此时可以不加{}  
function sum(num1, num2) {
    return num1 + num2
}
export default sum
```

- 在重命名导出时标识符default具有特殊含义，用来指示模块的默认值
  - 如果想在一条导出语句中同时指定多个导出（包括默认导出），这个语法非常有用

```js
function sum(num1, num2) {
    return num1 + num2
}
export  {sum as default}
```

#### 导入默认值

- 写法如下： 	
  - 导入不需要加{} 
  - 名称没有要求，只要写法正确，这里不管写 `sum` 或者是 `abcd` 都可以得到默认值

```js
import sum from './example.js'
console.log(sum(2,3)) //5

// 可以任意修改名称
import abcd from './example.js'
console.log(abcd(2,3)) //5
```

- 当默认值与非默认值同时导入时， **默认值必须排在非默认值**之前

```js
// 逗号分隔
import sum, {color} from './example.js'
```

- 与导出默认值一样， 也可以用as 来显示的重命名

```js
import {default as abcd} from './example.js'
console.log(abcd(2,3)) //5
```

### 重新导出一个绑定

- 比如，在一个模块中， 重新导出一个已经导入的值，安装前文的描述，我们可以采用如下写法

```js
import { sum } from './example.js'
export { sum }
```

- 可以将以上两种方式，融合成一行代码，完成导入与导出 

```js
// 在指定的模块中查找sum声明，然后将其导出
export { sum } from './example.js'
```

- 同样，也可以重命名

```js
export {sum as add} from './example.js'
```

- 如果想导出另一个模块中的所有值， 依然是使用 * 
  - 注意： * 导出 默认值和所有的命名导出值 ，因为可能会影响当前模块的默认导出
    - 比如导出了另一个模块的默认值， 因为一个模块只能导出一个默认值， 所以在当前模块就不能再导出默认值

```js
export * from './example.js'
```

### 无绑定导入

- 某些模块可能不导出任何东西，相反，它们可能只修改全局作用域中的对象。
- 尽管模块中的顶层变量、函数和类不会自动地出现在全局作用域中，但这并不意味着模块无法访问全局作用域。
- 内建对象（如Array和Object）的共享定义可以在模块中访问，对这些对象所做的更改将反映在其他模块中

如下面的例子

- 即使没有任何导出或导入的操作，这也是一个有效的模块。
- 这段代码既可以用作模块也可以用作脚本。

```js
// example.js
// 像所有数组添加pushAll方法
Array.prototype.pushAll = function(items) {
    if (!Array.isArray(items)) {
        // TypeError 与 Error不同， 主要用于抛出类型错误信息
        throw new TypeError('参数必须是数组')
    }
    return this.push(...items)
}
```

- 由于上面的代码不导出任何东西，因而你可以使用简化的导入操作来执行模块代码，而且不导入任何的绑定

```js
import './example.js'
let colors = ['red', 'yellow', 'blue']
let items = []
items.pushAll(colors)
console.log(items) // ['red', 'yellow', 'blue']
```

> 无绑定导入最有可能被应用于创建Polyfill和Shim

### 加载模块

- 虽然ECMAScript 6定义了模块的语法，但它并没有定义如何加载这些模块
- ECMAScript 6加载机制抽象到一个未定义的内部方法HostResolveImportedModule中， Web浏览器和Node.js开发者可以通过对各自环境的认知来决定如何实现HostResolveImportedModule。

#### 在Web浏览器中使用模块

- 在es6之前一般可以通过如下三种方式加载js
  - 在`script`元素中通过 `src`属性指定代码加载地址，来加载js
  - 将js代码内嵌到没有 `src`属性的 `script`标签中
  - 通过Web Worker 或 Service Worker方法 (**简单的说他们可以在网页上下文之外执行js代码**)
    - 使用Web Workers，Web应用程序可以在独立于主线程的后台线程中，运行一个脚本操作。这样做的好处是可以在独立线程中执行费时的处理任务，从而允许主线程（通常是UI线程）不会因此被阻塞/放慢。
    - Service worker是一个注册在指定源和路径下的事件驱动worker。它采用JavaScript控制关联的页面或者网站，拦截并修改访问和资源请求，细粒度地缓存资源。你可以完全控制应用在特定情形（最常见的情形是网络不可用）下的表现

- 在es6中为了使用模块，对上述三种方式进行了更新

**在script中使用模块**

- 通过 type= module实现

```html
<!-- 方式1 -->
<script type="module" src="module.js"></script>

<!-- 方式2 -->
<script type="module">
    // 此时可以使用模块语法
    import {sum} from './example.js'
</script>
```

> 默认情况下，当不填写 type 时，  type="text/javascript"，会作为默认类型， 此时type修改为 module，若浏览器不支持模块， 那么script 中的代码都会被忽略，从而避免错误的发生，提供了良好的向后兼容性

**Web浏览器中的模块加载顺序**

- 模块与脚本不同，可以通过import关键字来指明其所依赖的其他文件，并且这些文件必须被加载进该模块才能正确执行， 为了支持该功能，`<script type ="module">`执行时自动应用**defer属性**。
- 一旦HTML解析器遇到具有src属性的`<script type ="module">`，模块文件便开始下载，直到文档被完全解析模块才会执行。
- 模块按照它们出现在HTML文件中的顺序执行，也就是说，无论模块中包含的是内联代码还是指定src属性，第一个`<script type="module">`总是在第二个之前执行

```html
<script type="module" src="module1.js"></script>
<script type="module">
    import {sum} from './example.js'
    console.log(sum(2,3)) // 5
</script>
<script type="module" src="module2.js"></script>
```

上述代码加载顺序如下：

1.下载并解析module1.js。

2.递归下载并解析module1.js中导入的资源。

3.解析内联模块（内联不需要下载）。

4.递归下载并解析内联模块中导入的资源。

5.下载并解析module2.js。

6.递归下载并解析module2.js中导入的资源。

加载完成后，只有当文档完全被解析之后才会执行其他操作。文档解析完成后，会发生以下操作：

1.递归执行module1.js中导入的资源。

2.执行module1.js。

3.递归执行内联模块中导入的资源。

4.执行内联模块。

5.递归执行module2.js中导入的资源。

6.执行module2.js。

> `<script type="module">`元素会忽略defer属性，因为它执行时defer属性默认是存在的

**Web浏览器中的异步模块加载**

- 脚本上 使用 `async`时，脚本在下载完成后立即执行，而不必等待包含的文档完成解析
- `async`属性也可以应用在模块上，在`<script type ="module">`元素上应用`async`属性会让模块以类似于脚本的方式执行, 唯一的区别是，在模块执行前，模块中所有的导入资源都必须下载下来.

```html
<!--以下两个模块不能保证哪个先执行
如果module1.js首先完成下载（包括其所有的导入资源），它将先执行；
如果module2.js首先完成下载（包括其所有的导入资源），那么它将先执行
-->
<script type="module" async src="module1.js"></script>
<script type="module" async src="module2.js"></script>
```

**将模块作为Woker加载**

- 创建新Worker的步骤包括：创建一个新的Worker实例（或其他的类），传入JavaScript文件的地址。
- 默认的加载机制是按照脚本的方式加载文件，如下所示

```js
// 按照脚本方式加载 script.js
let worker = new Worker('script.js')
```

- 为了支持加载模块， 这些构造函数支持了第二个参数， 参数为对象， 将type属性设置为 module 可以加载模块文件

```js
let worker = new Worker('module.js', {type: 'module'})
```

Worker脚本加载和模块加载的不同之处

- Worker脚本只能从与引用的网页相同的源加载，但是Worker模块不会完全受限，虽然Worker模块具有相同的默认限制，但它们还是可以加载并访问具有适当的跨域资源共享（CORS）头的文件
- Worker脚本可以使用self.importScripts()方法将其他脚本加载到Worker中， 但 worker 模块却始终无法通过 self.importScripts() 加载资源， 因为应该使用import来导入

#### 浏览器模块说明符解析

- 在导入单个模块中提及过， 若想要正确引入模块必须使用 /或 ./ +文件名 的方式，这部分被称作 模块说明符
- 模块说明符（module specifier）使用的都是相对路径（例如，字符串"./example.js"）
- 模块说明符要求具有以下格式之一
  - 以/开头的解析为从根目录开始。
  - 以./开头的解析为从当前目录开始。
  -  以../开头的解析为从父目录开始。
  -  URL格式

> import {sum } from "example.js"写法是错误的

## 附录A  ECMAScript 6 中较小的改动

### 识别整数

- ECMAScript 6添加了Number.isInteger()方法来确定一个值是否为JavaScript整数类型
- JavaScript使用IEEE 754编码系统来表示两种类型的数字，但浮点数与整数的存储方式不同，Number.isInteger()方法则利用了这种存储的差异，当调用该方法并传入一个值时，JavaScript引擎会查看该值的底层表示方式来确定该值是否为整数

```js
console.log(Number.isInteger(25)) // true
//  有些数字看起来像浮点数，却存储为整数，Number.isInteger() 方法会返回 true 
console.log(Number.isInteger(25.0)) // true
console.log(Number.isInteger(25.1)) // false
```

### 安全整数

- IEEE 754只能准确地表示-2^53 ～ 2^53之间的整数，在这个“安全”范围之外，则通过重用二进制来表示多个数值

```js
// 两个值返回结果一致，因为此时已经超出范围
console.log(Math.pow(2,53)) // 9007199254740992
console.log(Math.pow(2,53) + 1) // 9007199254740992
```

- ECMAScript 6 引入了 `Number.isSafeInteger()`方法可以用来确保一个值是整数，并且落在整数值的安全范围内
- 添加了`Number.MAX_SAFE_INTEGER`属性和`Number.MIN_SAFE_INTEGER`属性来分别表示整数范围的上限与下限

```js
let inside = Number.MAX_SAFE_INTEGER
console.log(Number.isInteger(inside)) // true
console.log(Number.isSafeInteger(inside)) // true
// inside 是最大安全整数， 超出这个范围，它仍然是整数，但不再安全
console.log(Number.isSafeInteger(inside + 1)) // false
console.log(Number.isInteger(inside + 1)) // false
```

> 在JavaScript中进行整数计算或比较运算时，只希望处理安全的整数，因此，用Number.isSafeInteger()方法来验证输入是个好主意

### 新的Math方法

![math-method](./img/math-method.png)

![math-method](./img/math-method2.png)



### Unicode标识符

- 在ECMAScript 5中，可以将Unicode转义序列用作标识符，例如：

```js
var \u0061 = 'abc'
console.log(\u0061) // 'abc'
// 等价于
console.log(a) // 'abc'
```

- 还可以使用Unicode码位转义序列来作为标识符

```js
var \u{62} = 'efg'
console.log(\u{62}) // 'efg'
// 等价于
console.log(b) // 'efg'
```

- ECMAScript 6通过Unicode 31号标准附录“Unicode标识符和模式语法”（http://unicode.org/reports/tr31/）正式指定了有效的标识符，其中包括以下规则:
  - 第一个字符必须是$、_或任何带有ID_Start的派生核心属性的Unicode符号。_
  - _后续的每个字符必须是$、_、\ u200c（零宽度不连字，zero-width non-joiner）、\u200d（零宽度连字，zero-width joiner）或具有ID_Continue的派生核心属性的任何Unicode符号。
- ID_Start和ID_Continue派生的核心属性是在“Unicode标识符和模式语法”中定义的，用于标识适用于标识符（如变量和域名）的符号。该规范不是JavaScript特有的。

### 正式化 \_\_proto\_\_属性

- `__proto__`不是一个新属性，即使在ECMAScript 5以前，几个JavaScript引擎就已实现该自定义属性，其可用于获取和设置[[Prototype]]属性。实际上，`__proto__`是Object.getPrototypeOf()方法和Object.setPrototypeOf()方法的早期实现

- ECMAScript 6也正式添加了`__proto__`特性 （仅仅为了更好的兼容性，通常不建议使用）

- `__proto__`具有以下特征：

  - 只能在对象字面量中指定一次`__proto__`，如果指定两个`__proto__`属性则会抛出错误。这是唯一具有该限制的对象字面量属性

  ```js
  let obj = {ab:1, ab:1} // {ab:1}
  let obj2 = {__proto__:obj,__proto__:obj} // 指定两次报错
  ```

- 使用实例

```js
let person = {
    getGreeting() {
        return 'Hello'
    }
}
let dog = {
    getGreeting() {
        return 'Woof'
    }
}
let friend = {
    // 设置原型
    __proto__: person
}
console.log(friend.getGreeting()) // 'Hello'
console.log(Object.getPrototypeOf(friend) === person) // true
console.log(friend.__proto__ === person) // true
friend.__proto__ = dog // 改变原型
console.log(friend.getGreeting()) // 'Woof'
console.log(Object.getPrototypeOf(friend) === dog) // true
console.log(friend.__proto__ === dog) // true
```

## 附录B 了解ES7 (ECMAScript 2016) 



### 指数运算符

- `**` 等同于 `Math.pow()` 方法

```js
let result = 5 ** 3
console.log(result) //125
console.log(result === Math.pow(5, 3)) // true
```

- `**` 在 JavaScript 所有二元运算符中具有最高的优先级 (一元除外： 如 ++， --)

```js
// 二元先 ** 
console.log(5 * 2**3) // 40
// 有一元时先一元 ，注意： ++ -- 只能用在变量上 直接写在数字上的语法是错误的,如 ++2 报错
let i = 2
console.log(++i ** 3) // 27
```

> 一元的 +和 -不能直接与 ** 一同使用， 如， `-5**2` 会报错，一般需要配合括号使用，如 `(-5) **2`



### Array.prototype.includes方法

- 监测数组是否有指定元素，是返回 true ,否 false
  - 参数1是要查询的元素
  - 参数2是查询位置 ，如果位置大于数组长度返回false ；如果位置为负数，则 实际索引为 数组length 与 负数的和 (即从末尾开始往前跳 负数 的绝对值个索引） 然后往后搜寻 

```js
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(2,-2); // true
[1, 2, 3].includes(1,-2); // false
// 通过call可用于类数组对象
let obj  = {
	0:1,
	length: 1
}
[].includes.call(obj,1) // true
```

- includes在值的比较上的特点

```js
console.log(NaN === NaN, Object.is(NaN, NaN)) // false true
console.log(+0 === -0, Object.is(+0, -0)) // true false

let values = [+0, NaN,3]
values.includes(+0) // true
values.includes(NaN) // true
```



### 函数作用域严格模式的一处改动

- 由于实现困难，ECMAScript 2016规定在参数被解构或有默认参数的函数中禁止使用”use strict”指令。

```js
function fun(arg1, arg2) {
    "use strict"
}

// 该写法报错
function fun2(arg1 = {}, arg2) {
    "use strict"
}

// 该写法报错
function fun3({arg1, arg2}) {
    "use strict"
}
```

## 补充

### async/await

- ES2017 标准引入了 async 函数，使得异步操作变得更加方便。它实际就是 Generator 的任务执行器。
- `async`函数的返回值是 Promise 对象

```js
const fs = require('fs')
const readFile = function (fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

async function test() {
  // 类似封装好的自动执行器 await前面都是同步操作，遇到await开始执行异步，
  // 执行完成后，继续向下执行，异步得到的值会赋予 test1
  const test1 = await readFile('test1.txt')
  console.log(test1);
  const test2 = await readFile('test2.txt')
  console.log(test2);
  // 而他的返回值根据使用情况的不同效果也不同
  return 1
}
// 情况1： 因为async经过了promise包装，所以这里使用then，接收的结果就是返回值
/*
test().then(value => {
  console.log(value);
})
*/

// 情况2： 在其他async中使用，会先执行test的代码，返回值会赋予左侧变量
async function asy() {
  const test1 = await test()
  console.log(test1);
}
// asy()

// 关于async的报错
async function test3() {
  // 这里由于报错会终止继续往下执行,如果想要继续往下执行可以将错误异步用try catch包裹(注意：try catch是一对的，不能光写try)
  try {
    const test3 = await readFile('test3.txt')
  } catch (e) {
    // catch中还可以对错误情况进行一些处理，或者打印错误，在捕获到错误以后，就会执行这里的代码
  }
  const test2 = await readFile('test2.txt')
  console.log(test2);
}
// 如果上文中没有使用try catch，错误可以在这里用catch捕获，如果像上文那样使用过了，这里就不会再捕获到错误
/*
test3().catch(err => {
  console.log(err);
})
*/

// 知识点补充
// await不能单独使用

// async 函数可以保留运行堆栈。
//函数a内部运行了一个异步任务b()。当b()运行的时候，函数a()不会中断，
// 而是继续执行。等到b()运行结束，可能a()早就运行结束了，
// b()所在的上下文环境已经消失了。如果b()或c()报错，错误堆栈将不包括a()。
let a = () => {
  b().then(() => c())
}
//b()运行的时候，a()是暂停执行，上下文环境都保存着。一旦b()或c()报错，错误堆栈将包括a()。
a = async () => {
  await b();
  c();
};


// 关于并发继发
// 如果两个异步没有依赖关系，比如a异步 需要b异步的结果
async function test4() {
  // 如下两个异步就没有依赖关系
  const a = await readFile('test1.txt')
  const b = await readFile('test2.txt')
  // 那么可以对它们使用Promise.all 两个异步会并发进行，不会像上面那样等到一个异步完毕后，再执行另一个
  const [c, d] = await Promise.all([readFile('test1'), readFile('test2')])
}
// 如果我们给出了某个url数组（或者向上面那样的文件名，有多个文件名组成的数组，这时显然就不能在通过一个个填值的方式，比如arr[0],arr[1]），因为数组长度是不确定的
// 这时可以通过枚举的方式遍历URL
// 用定时器模拟异步操作
function time(text) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(text)
    }, 300 * text)
  })
}
// 首先我们考虑使用单独使用forEach(或 map等)，可以发现异步是，并发执行的因此无法保证原有顺序
arrs = [3, 2, 1]
async function report() {
  arrs.forEach(async (item) => {
    const result = await time(item)
    console.log(result); // 1 2 3
  })
}
// report()
// 解决方案 1 使用for of (内置迭代器)可以按顺序执行但是响应是继发的，每次只能执行一个请求
async function report2() {
  for (const arr of arrs) {
    const result = await time(arr)
    console.log(result); // 3 2 1
  }
}
// report2()
// 解决方案2 使用for 循环同样可以，相当于每一次执行括号里的内容，直到执行完毕，才可以执行下一次循环，响应也是继发的
async function report3() {
  for (let i = 0; i < arrs.length; i++) {
    const result = await time(arrs[i])
    console.log(result); // 3 2 1
  }
}
// report3()
// 都是循环，为何for继发 for Each 并发
// 将for each写成 for的形式相当于如下这样，在每一次循环后，都会调用函数，之后不会等待函数是否执行完毕，而是立刻执行下一次循环，所以forEach并发
async function report4() {
  const timeWrap = async (item) => {
    const result = await time(item);
    console.log(result); // 1 2 3
  };
  for (let i = 0, len = arrs.length; i < len; i++) {
    timeWrap(arrs[i]);
  }
}
// report4()

// 解决方案3. 如果我们想要有次序的并发，可以使用map与 for of(或 Promise.all) async结合的方法
async function report5() {
  // 第一次使用map让它返回promise对象数组，不直接返回结果
  const promises = arrs.map(arr => {
    return time(arr)
  })
  // 之后使用for of 生成结果
  for (let promise of promises) {
    const result = await promise
    console.log(result); // 3 2 1
  }
  // 或使用 Promise.all
  /*
  const results = await Promise.all(promises)
  console.log(results); // 返回 [3, 2, 1]
  */
}
// report5()
// 解决方案4 .不使用 async 通过promise map reduce实现
function report6() {
  const promises = arrs.map(arr => {
    return time(arr)
  })
  promises.reduce((pre, next) => {
    return pre.then(() => next).then(data => {
      console.log(data);
    })
  }, Promise.resolve())
}
report6()


// 上述方法在文件请求中的体现  注：fet fet2 并发 fet3 继发
const urls = []
async function fet(urls) {
  // 这里返回文本内容的promises对象数组
  const textPromises = urls.map(async url => {
    // 上面map中没有await 而这里多了一个是因为这里多了一次异步
    const response = await fetch(url)
    return response.text()
  })
  for (let textPromise of textPromises) {
    console.log(await textPromise);
  }
}

function fet2(urls) {
  const textPromises = urls.map(url => {
    return fetch(url).then(response => {
      return response.text()
    })
  })
  textPromises.reduce((pre, next) => {
    return pre.then(() => next).then(text => {
      console.log(text);
    })
  }, Promise.resolve())
}

async function fet3(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```

