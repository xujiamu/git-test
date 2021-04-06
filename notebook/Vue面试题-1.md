# Vue相关面试题-1

## 基本使用

![Vue面试01](G:\笔记\数据结构和算法图片\Vue面试01.png)

### 插值、指令

- 插值、表达式

  - 如 `{{ data }}`
  - 如  `{{data ? 'yes' : 'no'}}` （注意：这里只能是表达式，不可是js语句）

- 指令、动态属性

  - 如`:id="changeId"`    动态属性

- v-html： 会有XSS风险， 会覆盖子组件

  - ```html
    <p v-htm="<a></a>">
        <span>该子组件会被覆盖</span>
    </p>
    ```

### computed和watch及 methods

**computed和 methods的区别**

- 计算属性是基于它的响应式依赖进行缓存的（响应式依赖就是一般就是变量），只在响应式依赖改变时，它才会重新求值，但依赖没有改变时，他会直接返回之前计算的结果，不需要再次执行函数。
- 方法则是每次都会运行函数

**computed和watch的区别**

- 在大多数情况下，computed 比watch的使用更为简便
- 如：

```javascript
<div id="demo">{{ fullName }}</div>

var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
    // 这里使用watch实现，需要同时监听两个变量，根据这两个变量不断重新赋值新结果
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})

var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
    // 使用computed实现，直接计算结果，通过监听过程中的变量，达到目的，代码更简洁
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

- watch的使用环境：当直接监听某一个数据，该数据需要进行异步操作，或者开销较大时使用watch

### class 和 style

- 可以使用动态属性

  - ```html
    //对象写法 
    <p    :class="{black: isBlack}"></p>
    // 数组写法
    <p    :class="[black]"></p>
    // 直接传入对象
    <P    :style="styleData"></P>
    <script>
        export default {
            data () {
                isBlack: true,
                    
                black: 'black',
                    
                styleData: {
                    fontSize: '40px',
                    color: 'red'
                }
            }
        }
    </script>
    ```

    

### v-if 和 v-show的区别

```js
// v-if 会根据真假值 直接删除或重建 DOM元素 ，它是惰性的，只有在条件第一次为真时，才会进行局部渲染， 它的性能消耗更高，不适合频繁切换
// v-show 是根据 display 进行切换，它在任何条件下都会编译并缓存下来，并且DOM元素始终保留，它更适合用于频繁切换
```

### 列表渲染

- v-for 可以遍历数组或对象实现列表渲染
- key的重要性
  - key最好是一个与业务相关的id值，最好不要简单的是 item 或是 index
- v-for 和 v-if不建议同时使用 如： 
  - `<li v-if="change" v-for="(item, index) in items" :key="item.id">`
  - 解决方法： `可以在v-for的父(或子)标签使用 v-if`

### 事件

- event参数 (event就是原生的event对象， event.target获取触发事件的DOM, event.currentTarget获取绑定事件的DOM)

  - 两种情况

  - ```html
    <button @click="test1">
        1
    </button>
    <button @click="test2(2, $event)">
        2
    </button>
    <script>
        export default {
            methods: {
                test1(event) {
                    // 一：如果事件中调用方法没有传递event，可以直接接收event
                    console.log(event)
                },
                test(num, event) {
                    // 二： 如果事件中调用方法传递event，则需要使用 $event的方式传递，接收需要使用event
                    console.log(event)
                }
            }
        }
    </script>
    
    ```

- 自定义参数

- 观察事件被绑定到了哪里

  - 被绑定到调用事件的DOM元素 如：  `<button @click="test1">`  事件就被绑定到了button

- 事件修饰符

  ```javascript
  .stop // 阻止冒泡 可连用
  .prevent // 阻止默认行为 可连用
  .capture // 让事件在捕获阶段执行
  .self // 当前元素自身触发事件时才调用事件，即内部元素触发不算
  .once // 事件只会触发一次
  .passive // 用法 @scroll.passive 滚动事件的默认行为(滚动行为)会立刻触发，而不会等待 onScroll(滚动事件执行完成)
  ```

  - 常用按键基本上都有对应英文的按键修饰符，文档可查
  - `exact`修饰符，精确控制触发，比如 `@click.exact`那么只有单独按下click才会触发·，期间组合按下别的键则不触发。

### 表单

- v-model

- 常见的表单项 : 

  - textarea     通过v-model实现内容绑定  `<textarea v-model="desc"></textarea>`

  - checkbox   复选框，通过v-model控制，多个复选框，绑定同一个v-model，这个v-model是一个数组，当选中哪个复选框，该复选框中`value`属性的值，就会填入数组，对应的复选框就会被选中

  - radio  单选框  通过v-model控制，v-model绑定的是一个基本类型的值，将该值与每一个单选框比较，值相同的单选框才会被选中

  - select 下拉列表

    - ```html
      // 单选
      <select v-model="selected">  // selected是一个基本类型的值
          <option disabled value="">请选择</option>
          <option>A</option>
          <option>B</option>
      </select>
      // 多选
      <select v-model="selectList" multiple>  // selectList是一个数组
          <option disabled value="">请选择</option>
          <option>A</option>
          <option>B</option>
      </select>
      ```

- 表单修饰符

  - lazy  类似防抖效果，在输入完毕后，表单才会变化
  - number  输入的内容是数字类型，不再是默认的文本类型
  -  trim  截取两端空格

## Vue组件

![Vue面试02](G:\笔记\数据结构和算法图片\Vue面试02.png)

### 生命周期

![img](https://cn.vuejs.org/images/lifecycle.png)

**单个组件** 如上图所示：

一般分为三个阶段 ： 

- 挂载阶段
  - beforeCreate
  - created
  - beforeMount
  - mounted
- 更新阶段
  - beforeUpdate
  - updated
- 销毁阶段
  - beforeDestory
  - destoryed

问题1： **created 和 mounted 的区别**

- 在created中相当于，虽然初始化了Vue实例，但是并没有对页面进行渲染； 

- mounted 相当于已经基本渲染完毕（注：它不一定完全渲染完毕，因为mounted不会承诺，所有子组件也被挂载，想要完全渲染完毕需要使用 `this.$nextTick(function() {})`）

问题2：**没在图上的生命周期钩子** 

- `errorCaptured`   捕获一个来自子孙组件的错误时被调用
- `activated` 被 keep-alive 缓存的组件激活时调用
- `deactivated`     被 keep-alive 缓存的组件停用时调用

问题3： **父子组件的生命周期关系**

这里通过如图所示的父子组件来说明他们的关系，其中 index组件是input组件 和 list组件的父组件

![初级前端07](G:\笔记\数据结构和算法图片\初级前端07.png)

- 可以在父子组件的各个生命周期里写上 console.log 通过打印来观察具体关系
- 结论如下：
- 创建从外向内，渲染从内到外
  - 父组件 created -> 子组件 created -> 子组件 mounted ->  父组件 mounted
- 更新开始从外向内，更新完毕从内向外
  - 父beforeUpdate -> 子beforeUpdate -> 子updated -> 父 updated
- 销毁过程同理

### 父子组件通讯 props 和 $emit

```js
// 父向子 通讯
// 发送
:title = 'title'
// 接收
props: [title]

// 子向父 通讯  ？？ 子传父事件名不能取大写，否则打包后失效
// 发送
this.$emit('add', this.title)
// 接收
@add = 'add'

add() {
    
}
```



### 非父子组件通讯 - 自定义事件

在介绍自定义事件之前，首先介绍一下事件总线

```js
// 在购物街项目中，使用了事件总线来完成多组件传值
// 在文件入口 main.js中 创建事件总线
Vue.prototype.$bus = new Vue()
// 使用时，发送方
this.$bus.$emit('add', this.title)
// 一般在组件创建时$mounted生命周期，或者某个methods方法中监听事件， 并调用回调函数
this.$bus.$on('add',this.addTo)
// 取消监听事件，一般在组件销毁时，或离开时 如 deactivated , beforeDestory生命周期中使用
this.$bus.$off('add', this.addTo)

// 这里的回调函数一般单独提取出来,是为了保证，监听$on和取消监听$off的是一个回调函数， 如果不是同一个回调，那么就会有多余的函数没有销毁，造成内存泄露
addTo(arg) {
    console.log(arg)
}
```

上文所说的事件总线,实际上就是自定义事件，重点在于新建了一个Vue实例,只不过上面的写法和下面的写法不同而已： 

​				上面是将新Vue实例，作为本身实例的属性，这里是，将新Vue实例从外部引入

```js
// 新建一个event.js文件,在其中写
import Vue from 'vue'
export default new Vue()

/// 在需要使用的组件中引入， 因为上面的事件总线直接绑定在了入口上，所以不需要引用
import event from './event.js'
// 发送方： 创建自定义事件    
event.$emit('add', this.title)
// 接收方： 监听自定义事件
event.$on('add',this.addTo)
// 取消监听
event.$off('add', this.addTo)

addTo(arg) {
    console.log(arg)
}
```



## 高级特性

![Vue面试03](G:\笔记\数据结构和算法图片\Vue面试03.png)

### 自定义v-model

![Vue面试05](G:\笔记\数据结构和算法图片\Vue面试05.png)

![Vue面试04](G:\笔记\数据结构和算法图片\Vue面试04.png)

### $nextTick（如何获取最新的DOM?）

- 由于Vue是异步渲染，所以在 data改变之后，DOM不会立刻渲染	
  - 比如说设置某个异步事件（如点击增加元素），之后获取新的元素长度，做新的操作，这时就会发现，由于异步的原因，新增的DOM还没有渲染到页面上，这时获取的元素长度就是旧的，而$nextTick可以解决这个问题
- $nextTick会在DOM渲染之后被触发，从而获取最新的DOM节点
  - 接着用上面提到的例子，如果将获取长度，做新操作 部分的代码，写到 $nextTick的回调中，就能够保证获取的是最新的DOM节点

### refs

- 在任意一个元素或组件中写上`ref = 'test'`
- 那么在js中就可以通过`this.refs.test` 获取这个DOM元素

### slot 插槽

- 基本使用

  - ```html
    <slot> 
        直接将此处放入组件中，如果使用该组件的组件，有内容，则替换这里的内容，没有则显示这行文字
    </slot>
    ```

- 作用域插槽 -  也就是父组件想要使用插槽所在子组件中的数据

  - ```html
    <!--子组件 名称为test-->
    <slot :data='myData'>  // myData是子组件中的数据
        
    </slot>
    
    
    
    <!-- 父组件 -->
    <!-- 调用子组件 -->
    <test>
        <!-- 通过template绑定插槽 slotProps名称并不固定，它代表着接收到的所有数据组成的对象 -->
        <template v-slot="slotProps">   <!--这里也可以使用解构 {data}-->
            <!--这样成功获取到了数据-->
            {{slotProps.data}}    <!--如果上面使用了解构，这里就可以直接 {{data}}-->
        </template>
    </test>
    ```

- 具名插槽

  - ```html
    // 也就是对 多个 slot进行命名
    <slot name='header'> 
    </slot>
    <slot name='footer'> 
    </slot>
    
    // 使用时
    <test>
        <template v-slot:header></template>
        // 简写
        <template #header></template>
    </test>
    ```

### 动态组件

```js
// 用法 作为动态属性
:is = "component-name"




// 例1： 根据实际的数据，动态的加载多个组件
<div v-for="(val, index) in newData" :key="index">
    <component :is="val">
</div>

data() {
    return {
        newData: {
            //... 多个组件
        }
    }
}


// 例 2 多个组件展示其中一个
// html部分
<component :is="currentTab === 1 ? content : bookmark"></component>
// script
import EbookSlideContents from './EbookSlideContents'
import EbookSlideBookmark from './EbookSlideBookmark'

  data() {
    return {
      currentTab: 1,
      content: EbookSlideContents,
      bookmark: EbookSlideBookmark
    }
  }
```

### 异步加载组件

```js
// 通过import 函数,可以做到异步加载，根据需要在使用时发送请求，加载组件
// 在组件中
export default {
    components: {
        a: () => import('./a')
    }
}
// 在路由中
new VueRouter({
    routes: [
    {
        path: '/book',
        component: () => import('./book')
    }
    ]
})
```

### keep-alive

```js
// 缓存组件
// 频繁切换， 不需要重复渲染
// 缓存组件可以提高性能
```

### mixin

```js
// 多个组件有相同的逻辑，抽离公共部分
// minin并不是完美的解决方案，会有一些问题
// Vue3提出的Composition Api 旨在解决这些问题
import myMixin from './mixin'
export default {
    // 数组中可以有多个mixin，会自动合并起来
    mixins: [myMixin]
}



// mixin 的问题
// 1. 变量来源不明确
// 2. 引入多个mixin可能会造成命名冲突
// 3. mixin和组件可能会出现多对多的关系，复杂度较高（多对多是指，一个组件引入多个mixin，或者一个mixin被多个组件引入）
```

## Vuex知识点(用于组件通讯)

### 基本概念

- state
- mutations
- getters
- actions

### 用于Vue组件

- dispatch
- commit
- mapState
- mapGetters
- mapActions
- mapMutations

### 概念图

![vuex02](G:\笔记\img\vuex02.png)

![vuex01](G:\笔记\img\vuex01.png)

注： 异步操作必须在 Actions中完成

## Vue-router 知识点

### 路由模式

- （正常情况下一改变url地址，页面就会刷新，就会向服务器发送请求）

- ```javascript
  //href方法就是必定刷新的
  location.href = 'ineg'
  ```

- 解决方法:

- 一：改变url的hash值 （Vue-router的默认模式也是这个，在VueRouter实例中写上 `mode:history`即可配置）

- ```javascript
  //location中还有一个hash属性 改变它 url不会刷新
  //hash值会自动在你输入的值前面多出一个#号，然后生成url地址
  location.hash = 'age'
  
  ```

- 二：html5 中的history模式（该模式需要server端支持）

- ```javascript
  //html5 在 history对象 当中 新增了pushState方法也可以使页面不刷新
  //一共有三个参数 1.状态对象2.标题 3.url
  history.pushState({},'','ieng')
  
  ```

- 补充：浏览器url访问类似栈结构 每个新的url都会压入上一个url上面，而在按返回键（或者使用`history.back() ; history.go(-1)`）的时候 就会取出最近压入的url 露出上一个url

  - 前进一页：`history.go(1);history.forward()`

- 特殊：

- ```javascript
  //html 在 history对象 当中 新增的replaceState方法，就与正常的不同，使用了它之后，相当于替换了当前的页面，如果返回，不会返回替换前的页面，而会返回，再前一个页面
  //history.replaceState({},'','egeg')
  ```


### 路由配置

```js
new VueRouter({
    routes: [
        {
            // 动态路径（动态路由）
            path: '/user:id'
            // 路由懒加载
            components: () => import ('./test')
        }
    ]
})
```

## Vue原理要点图

![Vue面试06](G:\笔记\数据结构和算法图片\Vue面试06.png)

## Vue原理- 如何理解MVVM

 提到MVVM离不开一个概念，‘组件化’

- 在asp jsp php中 已经出现了组件化， nodejs中也有组件化
- 然而上述得那些传统的组件化，与Vue最大的区别在与，他们的组件化还需要依赖于操作DOM, 而Vue则是数据驱动视图

**传统mvc**  

- 视图（View）：用户界面。
- 控制器（Controller）：业务逻辑
- 模型（Model）：数据保存

![Vue面试07](G:\笔记\数据结构和算法图片\Vue面试07.png)

1. View 传送指令到 Controller
2. Controller 完成业务逻辑后，要求 Model 改变状态
3. Model 将新的数据发送到 View，用户得到反馈

**MVVM**  （ M :model  V :view   VM :viewModel）

![Vue面试题08](G:\笔记\数据结构和算法图片\Vue面试题08.png)

采用双向绑定（data-binding）：View的变动，自动反映在 ViewModel

## Vue原理- 响应式原理

核心API- Object.defineProperty （它有一些缺点，Vue3.0后 启用 Proxy解决这个问题）

![Vue面试09](G:\笔记\数据结构和算法图片\Vue面试09.png)

### 遍历方式

通过`Object.keys(obj)配合forEach遍历所有属性` （或者使用for in）

### 深度遍历的实现

- 深度遍历是指一个对象中，还有一个对象
- 可以通过重复递归调用遍历属性的方法实现`注意：遍历属性的方法开头，应该有一个是否是对象还是数组的判断，如果只是基本类型值，则不再进行重复遍历`

```js
// 重新定义属性，监听起来
function defineReactive(target, key, value) {
    // 深度监听
    observer(value)
    // 核心 API
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                // 深度监听
                observer(newValue)
                // 设置新值
                // 注意，value 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
                value = newValue

                // 触发更新视图
                updateView()
            }
        }
    })
}

// 监听对象属性
function observer(target) {
    if (typeof target !== 'object' || target === null) {
        // 不是对象或数组
        return target
    }

    if (Array.isArray(target)) {
        // 如果是数组，将改写的方法赋予数组的原型
        target.__proto__ = arrProto
    }

    // 重新定义各个属性（for in 也可以遍历数组）
    for (let key in target) {
        defineReactive(target, key, target[key])
    }
}

// 监听数据
observer(data)
```

### 处理原生数组方法

```js
// 重新定义数组原型
const oldArrayProperty = Array.prototype
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(methodName => {
    arrProto[methodName] = function () {
        updateView() // 触发视图更新
        oldArrayProperty[methodName].call(this, ...arguments)
        // Array.prototype.push.call(this, ...arguments)
    }
})
```



### Object.defineProperty的缺点

- 深度监听，需要重复的递归到底，计算量大
- 无法监听新增/删除属性 需要通过 （Vue.set  Vue.delete）
- 无法监听原生数组（需要进行处理）
  - 由于不能进行监听，所以Vue对数组的许多方法，进行了处理使其能够触发视图更新
  - 包括：`push()`   `pop()`  `shift()`   `unshift()`  `splice()`   `sort()`   `reverse()`
  - 
  - 同时对于 `filter()`、`concat()` 和 `slice()`  可以使用他们的返回值，替换原数组，完成更新

### 双向数据绑定的实现

- v-model 相当于绑定了` v-bind:value `和` oninput`事件
- 它的实现就基于Vue的响应式

<img src="G:\笔记\img\mall project\project04.png" alt="project04" style="zoom: 67%;" />



Observer数据劫持，通过`Object.keys(obj)配合forEach遍历所有属性`  通过` Object.defineProperty(obj,propertyName,{}) `中的setter，getter完成劫持，劫持所有的data属性

当属性发生变化时，会通知`Dep`

`Dep`作为一个消息管理员，它负责存储所有订阅者，当收到数据变化时，他会将这个变化通知到所有的订阅者

`Watcher`负责向`Dep`订阅中数据的变化，在收到变化时，将更改后的数据更新到视图View（也就是Dom）中

`Complice`负责对指令进行编译，通过`getAttribute`判断具体的指令，之后通过`watch`实时监听数据变化

## Vue原理-虚拟DOM(Virtual DOM ) 和 diff算法

- DOM操作非常耗费性能
- Vue是数据驱动视图， 它通过vdom有效的控制DOM操作
- **vdom的思路**
  - 因为js相比DOM执行速度更快，所以用JS模拟DOM结构，对比新旧js对象计算出区别差异，最后操作真实DOM

![Vue面试10](G:\笔记\数据结构和算法图片\Vue面试10.png)

### diff算法

- 上文提及到了js模拟DOM结构后，需要对比计算出两者的区别，这个对比计算的方式，就是diff算法
- **注意：循环列表中的key**就是diff算法的体现

树的形式体现diff算法

![Vue面试11](G:\笔记\数据结构和算法图片\Vue面试11.png)

对应树来说想要实现diff： 一：要遍历 tree1  二： 要遍历 tree2   三： 找出差别后重新排序

所以树的diff算法时间复杂度时 O(n^3^) 复杂度过高，显然不可取



**优化时间复杂度到O(n)**

- 只比较同一层级，不跨级比较

![Vue面试12](G:\笔记\数据结构和算法图片\Vue面试12.png)

- tag不相同，则直接删掉重建，不再深度比较

![Vue面试13](G:\笔记\数据结构和算法图片\Vue面试13.png)

- tag和key，两者都相同，则认为是相同节点（同一层级，只要是相同节点，哪怕两者的先后顺序不同，也可通过调整位置的方式，移动顺序，从而不需要重建节点，所以有了key能够提高性能）



### 通过snabbdom学习diff算法

- 它是一个简洁的vdom库，上手较为容易

如图所示，通过vnode 得到旧vdom，通过 newVnode 到的新的vdom，通过 patch 渲染更新

- ![Vue面试14](G:\笔记\数据结构和算法图片\Vue面试14.png)

## Vue原理-模板编译

![Vue面试16](G:\笔记\数据结构和算法图片\Vue面试16.png)

![Vue面试17](G:\笔记\数据结构和算法图片\Vue面试17.png)

该写法能够跳过模板编译的过程，直接生成vnode ，性能更好

![Vue面试18](G:\笔记\数据结构和算法图片\Vue面试18.png)

## Vue原理- 组件渲染/更新过程

- 初次渲染过程
  - 解析模板为render函数（一般在开发环境已经完成，vue-loader）
  - 触发响应式，监听data属性的getter setter
  - 执行render函数，生成vnode   ;
  - patch(elem, vnode)渲染  
- 更新过程
  - 修改data，触发setter
  - 重新执行render函数，生成 newVnode
  - patch(elem,newVnode)渲染  **（patch当中包含了 diff 算法，会比较新旧vnode的差异，选择合适方式渲染）**
- 异步渲染
  - 也就是说：vue的渲染是异步渲染，它不会在data更新之后立即渲染，而是等待所有的data更新完成之后，再渲染页面。 上文提到的`this.$nextTick`就能体现这一点，在DOM更新后，不能立即获取新的DOM,而是在`$nextTick`中获取，这样渲染能够合并data的修改，提高渲染性能

## Vue原理- 前端路由原理

![Vue面试19](G:\笔记\数据结构和算法图片\Vue面试19.png)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>hash test</title>
</head>
<body>
    <p>hash test</p>
    <button id="btn1">修改 hash</button>
    <script>
        // hash 变化，包括：
        // a. JS 修改 url
        // b. 手动修改 url 的 hash
        // c. 浏览器前进、后退
        // window.onhashchange能够监听 hash值的变化
        window.onhashchange = (event) => {
            console.log('old url', event.oldURL)
            console.log('new url', event.newURL)

            console.log('hash:', location.hash)
        }

        // 页面初次加载，获取 hash
        document.addEventListener('DOMContentLoaded', () => {
            console.log('hash:', location.hash)
        })

        // JS 修改 url
        document.getElementById('btn1').addEventListener('click', () => {
            location.href = '#/user'
        })
    </script>
</body>
</html>
```

![Vue面试20](G:\笔记\数据结构和算法图片\Vue面试20.png)

调用`history.pushState()`或者`history.replaceState()`不会触发popstate事件. `popstate`事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用`history.back()、history.forward()、history.go()`方法).

当网页加载时,各浏览器对`popstate`事件是否触发有不同的表现,Chrome 和 Safari会触发`popstate`事件, 而Firefox不会.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>history API test</title>
</head>
<body>
    <p>history API test</p>
    <button id="btn1">修改 url</button>

    <script>
        // 页面初次加载，获取 path
        document.addEventListener('DOMContentLoaded', () => {
            console.log('load', location.pathname)
        })

        // 打开一个新的路由
        // 【注意】用 pushState 方式，浏览器不会刷新页面
        document.getElementById('btn1').addEventListener('click', () => {
            const state = { name: 'page1' }
            console.log('切换路由到', 'page1')
            history.pushState(state, '', 'page1') // 重要！！
        })

        // 监听浏览器前进、后退
        window.onpopstate = (event) => { // 重要！！
            // event.state 对应  { name: 'page1' } 
            console.log('onpopstate', event.state, location.pathname)
        }

        // 需要 server 端配合，可参考
        // https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90
    </script>
</body>
</html>
```

## Vue真题解答

### v-for为何使用key

![Vue面试21](G:\笔记\数据结构和算法图片\Vue面试21.png)

### data为何是函数

```js
<!-- 因为组件具有复用性，会多次使用，如果组件中data是一个对象，多次使用组件时，共享的都是同一个数据，为了保证数据的独立性 所以要把组件data用函数封装，并每次返回一个新对象，这样每一个data都不会相互影响 -->

<script>
//js举例 上述描述就相当于
  function test () {
      return {
          a：13
      }
  }
   const demo1 = test()
   const demo2 = test()
   const demo3 = test()
   demo1.a = 25
    console.log(demo1.a)  //25
    console.log(demo2.a)  //13   不互相影响
    console.log(demo3.a)  //13   不互相影响
    
    
//如果是对象 
    const test2 = {
        a:25
    }
    const demo4 = test2
    const demo5 = test2
    demo4.a = 31
    console.log(demo5.a) //31
    
 //如果想要函数中也返回同一对象 那么可以在外部定义一个对象，传进来，不过一般情况下不推荐这样用
    const obj = {
        a:13
    }
    function test () {
      return obj
  	}
   const demo1 = test()
   const demo2 = test()
   demo1.a = 25
    console.log(demo1.a)  //25
    console.log(demo2.a)  //25   互相影响
   //根据这种方法可以看出 如果想在组件里 想返回同一对象，也只需要在外部定义一个对象 ，放在data函数的return中即可，不过这也是不推荐的写法
</script>
```

### ajax请求应当放在哪个生命周期

- mounted中 
  - 因为js是单线程的，异步在最后执行，比如放在created中 ，他也没有意义，请求不会执行，他只会在组件渲染完成后，即mounted中才会执行

### 如果将组件所有props传递给子组件

![Vue面试22](G:\笔记\数据结构和算法图片\Vue面试22.png)



### 何时使用keep-alive

- 缓存组件，不需要重复渲染
  - 如多个静态tab页保存
- 组件状态保存等
  - 如 滑动条滚动

### 何时使用 beforeDestory

- 解绑自定义事件 `event.$off`
- 清除定时器
- 解绑自定义的DOM事件

### vue常见性能优化

- 合理使用v-show ; v-if
- 合理使用computed
- v-for 选则适当的 key  ，以及避免和 v-if 同时使用(这是因为v-for的优先级高于v-if ，如果放在一起，每次执行v-for，都会重复执行v-if ，对性能有浪费)
- 自定义事件，DOM事件，定时器，及时销毁
- 合理使用异步组件
- 合理使用keep-alive
- data层级不要过深（因为响应式的时，会递归遍历所有的data）
- 使用SSR

## Vue3的Proxy

### 基本使用

![Vue面试23](G:\笔记\数据结构和算法图片\Vue面试23.png)

- proxy 的set 能够监听到新增属性
- proxy的 deleteProperty 能够监听到删除
- 下文提及了 它的深度监听，性能也更好
- 并且原生支持监听数组变化

### 实现响应式

- 注意这里有个特点，对于proxy来说，虽然我们也使用递归来枚举数据，但是他和definedProperty不同的是，不会一次性全部递归，会根据查询的具体get 属性递归指定的内容

  - 也就是 说

  - ```js
    {
        // 如果只查询 a 那么只有a  是响应式 ，b不被递归，也就不是响应式，如果查询了b 那么b是，但是b 下面的属性c d 也不是，除非在具体查询c d
        a: '1'
        b: {
            c: {
                d: 'eg'
            }
        }
    }
    ```

响应式实现

```js
// 创建响应式
function reactive(target = {}) {
    if (typeof target !== 'object' || target == null) {
        // 不是对象或数组，则返回
        return target
    }

    // 代理配置
    const proxyConf = {
        get(target, key, receiver) {
            // 只处理本身（非原型的）属性
            const ownKeys = Reflect.ownKeys(target)
            if (ownKeys.includes(key)) {
                console.log('get', key) // 监听
            }
    
            const result = Reflect.get(target, key, receiver)
        
            // 深度监听
            // 性能如何提升的？
            return reactive(result)
        },
        set(target, key, val, receiver) {
            // 重复的数据，不处理
            if (val === target[key]) {
                return true
            }
    
            const ownKeys = Reflect.ownKeys(target)
            if (ownKeys.includes(key)) {
                console.log('已有的 key', key)
            } else {
                console.log('新增的 key', key)
            }

            const result = Reflect.set(target, key, val, receiver)
            console.log('set', key, val)
            // console.log('result', result) // true
            return result // 是否设置成功
        },
        deleteProperty(target, key) {
            const result = Reflect.deleteProperty(target, key)
            console.log('delete property', key)
            // console.log('result', result) // true
            return result // 是否删除成功
        }
    }

    // 生成代理对象
    const observed = new Proxy(target, proxyConf)
    return observed
}
```

