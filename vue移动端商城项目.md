# 项目开发全流程

## 连接远程仓库

```shell
git remote add origin 仓库地址
git push -u origin master
```

## 划分目录结构

- 主要是对`src`目录的划分
- assets 存放资源
  - img 图片
  - css
- common  一些公共的可复用的js 文件， 比如 常量js文件 工具js文件
- components 存放公用的组件
  - common 完全公共，其他项目也可以使用的组件
  - content 只在当前项目的组件中公共
- network 网络请求相关的封装
- router 路由相关封装
- store   状态管理的`vuex`封装
- view 项目的功能组件 内部一个文件夹存放一个对应页面的所有组件
  - home 主页相关的所有组件
  - ......

![project01](G:\笔记\img\mall project\project01.png)

## 引用两个css文件

两个文件设置的基本的css样式

- `normalize.css` github上找到相关网址下载

- `base.css` 自行编写  

## 为文件夹路径取别名

在项目根目录下新建 `vue.config.js` 在里面写入要使用的别名

```javascript
module.exports = {
  configureWebpack: {
    resolve:{
      alias:{
        'assets' : '@/assets',
        'common' : '@/common',
        'components' : '@/components',
        'network' : '@/network',
        'views' : '@/views'
      }
    }
  }
}
```

## 代码风格统一

在一个完整的项目中，统一的代码风格是非常重要的，`vue cli3`删除了`.editorconfig`文件 所以我们需要自行创建，在这个项目中，我直接使用了`vue cli2`的配置

## 项目模块划分

- 将已经封装好的`tabbar`放入对应位置

- `tabbar`的注意点

  - 在`vue-router`3.0版本使用`replace，`连续切换同一个路由，会抛出promise的错误.可以通过以下方法解决

  - 一：可以将`vue-router`版本改为3.0

  - 二：也可以在replace，push 方法后面加上catch 抛出异常

    - ```javascript
      this.$router.replace(this.path).catch(err => { })
      ```

  - 或者在main.js中加入

  - ```javascript
    import Router from 'vue-router'
     
    const originalPush = Router.prototype.push
    Router.prototype.push = function push(location) {
      return originalPush.call(this, location).catch(err => err)
    ```

- 设计好对应的路由

## home页设计

### 设置导航栏图标

- 图标放在public目录中 因为<%= BASE_URL %>是当前目录的意思

```
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
```

### 封装一个`nav-bar` 用于页面头部导航栏

- 在`network`中封装`request.js` 

- 在`network`创建一个专用于存放`Home.vue`请求的文件`home.js`

- 请求用于轮播图和推荐图的数据

- 将其引入到`Home.vue`
- 在 `created`钩子函数中调用
- 在`data`中创建`banner` `recommend`保存数据

### 封装一个轮播图组件`swiper`

#### 因为轮播图可以看做一个单独的功能，为了保证`Home.vue`结构的清晰，我们在`home`文件夹中新建一个`childComps`文件夹，用于保存`Home.vue`的子组件，在这里面新建`HomeSwiper.vue`在这里完成轮播图功能，之后将其引入`Home.vue`

- 轮播图中出现的错误
- 页面第一次加载不会播放
- 原因：后台数据还没请求过来，轮播图组件就先完成了渲染
- 解决方法：在轮播图组件的最外层加上判定，没有数据不渲染
- `v-if="banner.length"`
- pc端全屏播放图片切换不正常，如果从切到过pc端，在切回移动端，移动端也会不正常
- 原因：图片组件封装时图片大小，及移动距离的原因，当初就没有考虑pc端，这是纯移动端

### 封装一个`Home.vue`的子组件`RecommmendView`

### 封装一个`Home.vue`的子组件`FeatureView`

- 滚动出现了一些问题不能完全显示，之后解决
- 头部`nab-bar`会一起移动，方案：将其设为`display:flex`

### 一个`在content`文件夹下封装一个`tabControl`组件，将其引入`Home.vue`使用

#### 使用flex布局设置样式 显示的文字数据通过props 从Home组件传到`tabControl`

#### 状态栏滚动固定效果，通过 `position:sticky`实现

### 在`network` `home.js`文件夹下新建`getHomeGoodS`函数，用于请求商品数据

- `Home.vue`中引入
- 为了保持`created`钩子函数功能的明确，将先前执行请求的函数`1.7,3.3`,和这次的一起，包装成多个方法，放入`methods`中，通过在`created`里面调用方法执行数据
- 在`data`中定义数据`goods`用于保存接收到的数据和发起请求的条件

### 在`content`文件夹下创建`goods`文件夹

- 在`goods`文件夹中新建`GoodesList.vue` `GoodsListItem.vue`组件
- 将`GoodListItems.vue`作为`GoodsList.vue`子组件引入
- 将`GoodsList.vue`作为`Home.vue`子组件引入
- 通过`props`将商品数据由`Home.vue`经`GoodsList.vue`至`GoodListItems.vue`逐层传递
- 在`TabControl.vue`组件中获取`index`标识，通过`emit`传递至`Home`组件，在`Home`中通过相应事件，实现商品数据栏的单击切换

### 使用`better-scroll`优化滚动条

- `webstorm`中· 快捷编写代码`{}`中表示标签内部文本 `$`自动编号 其他相关的还有`> + * . #`

- 原生实现滚动`给父元素class设置一个指定高度·`然后给他的`css`添加`overflow-y:scroll` 缺点：移动端卡顿较为严重

#### `better-scroll`的具体使用

- `better-scroll`目前分为1.x 和最新的 2.x版本

- 注意 ==better-scroll 使用时，在外部必须有额外的 一个div 名称不需要固定 但必须有==

- ```html
  <div class= "wrapper">
      <!-- ul 外部必有一个div 这里是 wrapper 且 wrapper 中第一层子标签也只能有一个-->
      <ul>
          <li>
          </li>
      </ul>
  </div>
  ```

- 区别: 2.0 的设计中引入了插件。提取了 `1.x` 版本的核心滚动能力，其余的 feature，诸如 pulldown、pullup 等等，都将通过插件来增强。

- 1.x 文档 https://ustbhuangyi.github.io/better-scroll/#/

- 1.x下载：

- ```javascript
  npm install better-scroll -S
  ```

- 2.x文档 https://better-scroll.github.io/docs/zh-CN/

- 2.x下载 

- ```javascript
  
  npm install better-scroll@next -S
  
  //包含全功能插件 它的使用方式与 1.0 版本一模一样
  //但是体积会相对大很多，推荐按需引入
  //使用
  import BScroll from 'better-scroll'
  let wrapper = document.querySelector('.wrapper')
  
  let bs = new BScroll('.wrapper', {
    // ...
      //默认为falase 当设置为true时，可以开启上拉加载 1.1
    pullUpLoad: true,
    //默认值0 不触发scroll事件 2.1
    //1 非实时，即屏幕滑动超过一定时间出发scroll事件
    //2  实时，但手指的惯性滑动不会侦测
    //3 实时，手指的惯性操作也会侦测
    probeType:3
    //click 默认false 阻止浏览器 click 事件 
     //设为true 为不阻止  (实际上经过测试发现 为false时 button可以点击 但div的click事件会失效)  3.1
    click: true
    wheel: true,
    //开启滚动条
    scrollbar: true,
    // and so on
  })
  
  
  //pullUpLoad对应的设置 1.2
  bs.on('pullingUp,',() => {
      console.log('上拉加载更多')
     //在这里发送请求，请求更多数据
      setTimeOut(() => {
          //...
          //在得到数据，并处理完毕后
         //结束这次上拉加载使得可以继续显示新的上拉加载 1.3
          bs.finishPullUp()
      },2000)
  })
  
  //probeType 对应的设置 2.2
  bs.on('scroll', position => {
      console.log(position)  //实时获取滚动的位置
  })
  //click 对应的设置 3.2
  document.querSelector('.btn').addEventListener('click',() => {
      console.log('-----------')
  })
  ```

- 2.x只需要基本滚动功能

- ```javascript
  npm install @better-scroll/core@next -S
  
  //使用
  import BScroll from '@better-scroll/core'
  let bs = new BScroll('.wrapper')
  ```

- 如果在下载只包含基本滚动功能的情况下需要增强功能

- ```javascript
  npm install @better-scroll/core@next -S
  npm install @better-scroll/pull-up@next -S
  npm install @better-scroll/scroll-bar@next -S
  
  //使用
  import BScroll from '@better-scroll/core'
  import Pullup from '@better-scroll/pull-up'
  import ScrollBar from '@better-scroll/scroll-bar'
  
  //!!! 这种写法需要注册插件
  // 注册插件  
  BScroll.use(Pullup)
  BScroll.use(ScrollBar)
  
  
  let bs = new BScroll('.wrapper', {
    probeType: 3,
    pullUpLoad: true
  })
  ```
  
  补充：
  
  - `bs.scrollTo(0,0,latertime)方法 `可以设置返回位置，可以用来实现返回顶部

#### 在Home 组件中使用

- 在`components`的`common`文件夹下新建`scroll`文件夹，新建`Scroll.vue`

- 注意：需要在`mounted`中使用  ,因为`created`无法获取`dom` 对象
- 为了之后代码的后期的可维护性，这里将`better-scroll`做了进一步的封装  使用的是`1.x`的版本
- 封装完毕后，如果想要自适应高度有两种方式
  - 通过设置父元素高度为`height: 100vh (视口高度)` `position:absolute` 设置`top: **px  bottom:**px` 
    - `position:absolute`父元素需要设置高度的原因，因为它的`top bottom`是基于父元素设置的，如果父元素不明确高度，他会按照整个加载商品后的页面自适应高度，引发错误
    - 再次强调：这种写法和下一种写法，都必须有==overflow:hidden== 如果我在scroll组件中默认设置了==overflow:hidden==则不用再有，但如果没设置，必须有！
- 通过设置父元素高度为`height: 100vh (视口高度)` 子元素高度`hegiht:calc(100%-**px)`即通过`calc函数进行实时计算`
  
- 上述的思路： 原本的父元素不用设值高度，因为默认滚动是根据屏幕窗口来算的，屏幕窗口显示不全，自动出现滚动条，这个滚动条在移动端用户体验不好—---—>用better-scroll解决->scroll 必须有一个高度参数，必须有`overflow：hidden` 因为他的原理相当于是在一块指定高度的空间内，来滚动----->为了这个参数能够适应不同的窗口大小------>给他的父元素设置具体高度（不能不设置，不设置的问题上面已经表述过）------>scroll通过上述两种方式之一，即可

- 注意:先前通过==position:sticky==设置的`tab-control`悬停已经失效，因为这里被`better-scroll`管理后原生的悬停不会正常生效，后面会通过其他方法实现相同效果

### 返回顶部按钮的实现

#### 返回功能的实现

- 在`content`文件夹中新建`goBackTop`文件夹 新建`GoBackTop.vue`组件 
- 将组件引入`Home.vue`通过`事件.native`的方式，绑定组件方法
- 为了提高代码可读性，在`Scroll中`封装返回顶部的方法`scrollTo`
- 在`Home`组件，将刚刚绑定的组件方法，通过`this.$refs.名称`的方式得到`Scroll`子组件对象  然后使用返回顶部的方法

#### 按钮隐藏显示的实现

- 解决切换商品栏失效问题，`better-scroll`中`click`事件想要生效，需要在实例的参数对象中加上`click:true`

- 通过实例的参数对象中`probeType`可以获取滚动位置，为了保证选项的灵活复用性，可以将值设为变量，接收一个`props`中的参数,来灵活复用该组件

- 同样在`mounted`中的处理回调

- ```javascript
  //为了保证复用性，也将position传出去，想要使用的父组件，自行通过事件接收
  this.scroll.on('scroll',position => {
      this.$emit('scroll',position)
  })
  ```

- 这里我在`Home.vue`组件中传递和接收

- 先在按钮上使用v-show 并创建对应变量，之后在接收后的事件里，使用 `position.y `纵向的值，操作变量的`true false`来实现按钮的显示隐藏

### 上拉加载更多的实现

- 通过在`Scroll.vue`中的`BScroll`实例参数对象中，传入`pullUpLoad`属性实现，为了复用性，将其的值通过`props`传入

- 同样在`mounted`中的处理回调

- ```javascript
  //为了保证复用性，也将事件传出去，想要使用的父组件，自行通过事件接收
  this.scroll.on('pullingUp',() => {
     this.$emit('pullUp')
  })
  ```

- 这里我在`Home.vue`组件中传递和接收

- 在接收的事件里，调用`getHomeGoods方法`将动态的type值`this.show`作为参数传递  这样就实现了单次的上拉加载更多

- 要实现多次，只需要在`getHomeGoods`方法的最后通过`this.$refs`调用`Scroll.vue`中封装好的`finishPullUp`

- 目前新出现的问题:由于异步请求图片的原因，`better-scroll`有时会在图片没有请求完成后，就将滚动距离计算完成，这就导致了滚动条距离过短，滚动不到底部的bug `可以通过在控制台打印BScroll 对象 观察它的scrollerHeight属性值发现这个问题`

### 滚动bug的解决

- `better-scroll`实例对象中自有一个`refresh()`用于重新计算高度

- 通过监听每一张图片是否加载完成，每加载完成一张，执行一次`refresh`即可实时更新滚动高度

- 如何监听图片是否加载完成

- 原生js方法`img.onload = function() {}`

- vue方法通过 在图片对应标签中使用`@load='方法名'`来监听

- 之后我们就需要考虑如何在`GoodsListItem`中拿到`Scroll`组件，并使用其中`refresh`方法

- ==使用事件总线拿== 

- 步骤：

- 在`main.js`中

- ```javascript
  //创建一个事件总线
  Vue.prototype.$bus = new Vue()
  ```

- 在`GoodsListItem.vue`中发射事件

- ```javascript
     this.$bus.$emit('loadImg')
  ```

- 在`Home.vue`中接收事件，并调用`Scroll.vue`的方法

- ```javascript
  //为了保证渲染完成 此处写在mounted中
  mounted() {
        //通过事件总线下的$on接收指定事件
        this.$bus.$on('loadImg',() => {
          //调用Scroll组件的refresh方法
          //添加判定避免拿不到refresh时，产生的报错
          this.$refs.scroll && this.$refs.scroll.refresh()
        })
      },
  ```

- 在`Scroll.vue`中注册事件

  ```javascript
  refresh() {
          this.scroll.refresh && 		        this.scroll.refresh()
  }
  ```

### 刷新频繁使用到的防抖函数

- 因为`1.7.12`中`refresh`执行次数很多（加载一组图，执行30次），而实际需求我们不需要这么频繁的刷新，所以我们可以通过封装一个防抖函数来减少执行次数(输入框查询等类似情况都可以使用防抖函数)

- ```javascript
  //防抖函数的封装
  
  //执行流程 首先传入一个需要防抖的函数和延迟时间， 然后执行函数，将其返回值赋值到fresh上得到一个可执行的函数，如果是第一次执行fresh()，clearTimeout不会生效,但如果在延迟时间没有结束，再次执行这个函数，clearTimeout就会清空上一次的setTimeout，setTimeout中的回调就因此不会执行,从而达到的效果
  function debounce(fun,delay) {
      let timer = null
      //...args 可变参数
      return function (...args) {
         //这里的timer实际上是一个闭包，他在函数执行完毕后也没有销毁
          clearTimeout(timer)
          timer = setTimeout(()=>{
              //因为这里传来的只是独立的一个函数，为了确定他执行的作用域，需要一个this ,我这里使用了箭头函数,所以this会往上层查找,如果不使用箭头函数,this就需要写在外面才能达到预期效果了
              fun.apply(this,args)
          },delay)
      }
  }
  //使用
  //1
  const fresh = debounce(this.$refs.scroll.refresh,500)
  //2
  fresh(可传递参数)
  ```

- 为了保证防抖函数复用性，在`common`中新建`utils.js`中将提取出来的防抖函数放进去

临时出现的问题：

![project02](G:\笔记\img\mall project\project02.png)

原因:如果是在开发环境，网络环境变更导致，比如你切换无线网络，导致开发服务器的IP地址换了，这样开发服务器会不知道如何确定访问源。开发环境中重新npm run serve重新构建服务环境就可以
如果是生产环境，很大可能是应该是域名和ip映射出问题，重启node，检查重新配置域名和ip映射就可以了 https://segmentfault.com/q/1010000005045512

注意！！！==以上项目代码的编写中，大部分回调里使用的this都是因为使用了箭头函数的方式，所以才能拿到当前组件对象，使用组件对象里的方法和属性，要是当时使用的是function(){}的方法，则有些回调函数中的this根本就不是组件对象了,要特别注意==

### `tabControl`吸顶效果的重新实现

#### 获取`tabControl`距离顶部的具体值

- 由于先前的`position:sticky`效果已经失效，所以我们在这里将他的相关样式删除

- 要实现吸顶，实际上就是要实现当`tabControl`达到一定位置时，悬挂

- 这时我们就可以通过`element.offsetTop`（相对于父元素`offsetParent`距离网页上面的距离）这一属性来获取，`tabControl`距离顶部的具体值

- ```javascript
  //先给组件绑定ref为tabControl
  //this.$refs.tabControl 访问的是组件对象是不能拿到offsetTop的
  //而 $el 属性可以拿到组件中的元素对象，
  //所以这里使用$el.offsetTop
  this.$refs.tabControl.$el.offsetTop
  ```

- 因为异步请求图片，未加载完全的原因，上述`offsetTop`拿到的往往是比实际要小的高度

- 解决方法：

- 通过测试发现轮播图的加载是影响高度的最主要因素，其余图片加载速度很快，基本无影响，所以我们选择在`HomeSwiper.vue`组件中添加监听事件

- 在对应图片的标签中加入`@load='imgLoad'`

- ```javascript
  //HomeSwiper组件
   data() {
        return {
          isLoad: false
        }
      },
  
  imgLoad() {
          if (!this.isLoad) {
              //发送事件
            this.$emit('swiperImgLoad')
            this.isLoad = true
          }
        }
  
  //Home组件
  //使用事件
    swiperImgLoad() {
         //打印这时的高度发现会打印四次，这是因为一共有四张轮播图，实际上我们等到一张轮播图加载完毕后就可以得到准确高度，所以没必要执行四次，所以才会在HomeSwiper组件中设置变量,如果有一张图加载完毕，并顺利发送事件后，改变变量值，下一次就不会再发送事件了(注：这里不用防抖，因为防抖是执行一次后下一次根据延迟时间判断，在时间过后继续监听，这里我们是执行一次就够了，不需要再执行)
        console.log(this.$refs.tabControl.$el.offsetTop);
        }
  ```

#### 实现吸顶效果

- 在上面的基础上使用`offsetTop`变量保存 得到的距离值
- 新建变量`isTabTop`默认值为false
- 在监听滚动距离`contentScroll`方法中，通过滚动距离与·`offsetTop`的对比，动态改变`isTabTop`的值

第一次失败尝试：试图通过`isTabTop`给`tab-control`组件动态添加移除class

- ```javascript
  <tab-control
            :title="['流行','新款','精选']"
            @ChangeIndex="ChangeIndex"
            ref="tabControl"
  			//这里动态添加移除			
            :class="{fixed:isTabTop}"/>
  
  .fixed {
      position: fixed;
      top: 44px;
      left: 0;
      right: 0;
    }
  ```

- 但是页面出现如下问题：

- 1.商品图片上移一截

- 2.移动到指定位置后 `tab-control`消失

- 原因：

- 1.上移原因：设置fixed 后  `tab-control` `z-index`变大，于是脱标 商品自动向上填补产生位移 注:==z-index只能 给设置过position的元素设置==

- 2.消失原因：`better-scroll`采用改变`transfrom:translate`的方式移动，而`transfrom:translate`能够移动`position:fixed`的元素，所以`tab-control`被移动到了页面看不到的上方

使用第二种方法：另外新建一个`tab-control组件`

- ```css
  //对注释掉的css进行删除，因为最初默认原生滚动时，为了保证nav-bar固定所以使用fixed 现在使用better-scroll后不再需要这些样式
   #home {
      /*padding-top: 44px;*/
      position: relative;
      height: 100vh;
    }
  .nav-bar {
      background: var(--color-tint);
      color: #fff;
  /*    position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 19;  */
    }
  ```

- ```javascript
  <tab-control
            :title="['流行','新款','精选']"
            @ChangeIndex="ChangeIndex"
  //将原来tab-control 的ref值改为tabControl1
            ref="tabControl1" />
          <goods-list :goods="goodsShow" />
     //赋值一个同样的组件 ref值改为tabControl2  
     //绑定fixed样式
     //通过v-show 来使其在tabControl1 显示tabControl2 达到平滑的切换效果
              
  <tab-control
        :title="['流行','新款','精选']"
        @ChangeIndex="ChangeIndex"
        ref="tabControl2"
        class="fixed"
        v-show="isTabTop"/>
            
  .fixed {
      position: fixed;
      top: 44px;
      left: 0;
      right: 0;
      z-index: 2;
    }
  ```

- 问题：两个组件之间的样式没有同步 需要让他们两个的`currentIndex`统一

- ```javascript
  //在Home组价的 切换商品栏 方法中 用传递过来的Index来统一
  
  //在这里统一的原因：可以这么理解
  // 一个屋子里的灯 有两个智能开关， 按下任意一个，灯都会亮，但是没按的另一个开关，不知道这个状态，它不但不会显示灯已开，并且再按下，它做的也是开灯操作，这时灯本来就是亮的，于是就不会发生变化，反之亦然，那么我们就可以假设屋子里有一个通知系统，不管任何一个开关按下，它都会通知其他开关，让它们也属于按下状态，这样统一状态后，就可实现开关灯的同步 这也就是currentIndex同步的原理
        ChangeIndex(index) {
          switch (index) {
            case 0: this.show = 'pop'
              break
            case 1: this.show = 'new'
              break
            case 2: this.show = 'sell'
          }
          //统一两个tab-control的Index
          this.$refs.tabControl1.currentIndex = index
          this.$refs.tabControl2.currentIndex = index
        },
  ```

### 保存`Home`组件的状态

- 通过将`keep-alive`加在<router-view>标签上，保存路由状态
- 出现的问题:
- 由于`better-scroll`的原因，有时会出现状态无法保存的状况
- 解决方法:
- 因为使用了`keep-alive`所以`activated deactivated`变得可以使用
- 在`Home`组件的`deactivted`状态中，保存离开时滚动状态`this.scrolly` 将这个值，在组件活跃时同步，这样就完成了Home状态的保存，且为了防止滚动条高度出现问题，在`activted`里面，我们再次执行了`refresh`方法重新计算了高度



## detail页面设计

### 配置路由，传递iid

- 在views中新建`detail`文件夹新建组件`detail.vue`
- 配置路由信息
- 在`goodsListItem`中设置跳转事件，跳转到详情页
- 在详情页中通过`this.$route.params`获取对应iid

### 设计导航栏

- 新建`childDetail`文件夹
- 新建`DetailNavBar`子组件

- 左侧返回按钮
- 中间切换导航

### 设计轮播图

- `Detail`不需要保存路由状态，在`App.vue`的`keep-alive`标签中使用`exclude='Detail'`
- 新建`DetailScroll`子组件
- 在该子组件中使用封装好的`swiper`
- 在`network`中新建`Detail.js`封装`Detail.vue`的网络请求
- 在`Detail`中使用网络请求，将请求到的数据中的图片数据抽离出来传到`DetailScroll`子组件供其使用

注意：这里轮播图同样需要处理两个问题

- 传递的插槽需要用`<template #default></template>`包裹
- 最外层的<swiper>需要用`v-if='topImages.length'`来判定，解决网络请求延迟的问题,
  - 为什么用`v-if`不用`v-show`
  - 因为`v-show`相当于改变`display`不会重新渲染元素 ，所以如果一开始图片就没加载过来，使用`v-show`也不会重新加载
  - 而使用`v-if`能够重新渲染，所以使用`v-if`

### 商品基本信息栏设计

- 由于接口数据十分复杂，为了方便管理这一栏的数据，在`network`下的`detail.js`中新建`Goods`类

  ```javascript
  //统一管理基本信息的数据
  export class Goods {
    constructor(itemInfo, columns, services) {
      this.title = itemInfo.title
      this.desc = itemInfo.desc
      this.newPrice = itemInfo.price
      this.oldPrice = itemInfo.oldPrice
      this.discount = itemInfo.discountDesc
      this.columns = columns
      this.services = services
      this.realPrice = itemInfo.lowNowPrice
    }
  }
  //在Detail.vue中getDetail方法下新建实例对象，传入需要的数据参数，得到包含各个数据的对象，将其保存下来
      //商品基本信息数据
            this.goods = new Goods(result.itemInfo, result.columns, result.shopInfo.services)
  //之后新建`DetailBaseInfo组件，将数据传递过去，按需调用...
  ```

### 商家信息栏的设计

```javascript

 //获取商家信息数据
          this.shop = result.shopInfo
//新建DetailShopInfo组件在组件中展示信息
```

### 覆盖底部`maintabbar`

- 在详情页面中，我们不在需要`maintabbar`的显示，可以通过提升`detail`组件的z-index 覆盖`maintabbar`

### detail 滚动效果的实现

- 在`Detail`组件中引入封装好`Scroll`组件
- 之后设置各部分样式即可

```css
 .detail {
   //calch函数中的100%值由父组件决定
    height: 100vh;
  }
.detail-scroll{
      //scroll 必须传入一个高度
    height: calc(100% - 44px);
  }
//为了使nav-bar能够显示出来需要给他设置z-index
//这里不需要设置position为fixed等脱标属性值了，因为better-scroll管理滚动条后,nav-bar不显示不再是因为浏览器自身的滚动，自身被滚上去，而是因为自身被better-scroll所覆盖
 .detail-nav-bar {
    position: relative;
    z-index: 1;
    background-color: #fff;
  }
```

### 商品详情组件的设计

注:这里在后面改为防抖 刷新频率更高，用户体验好

```javascript
 //1.在detail.vue中   商品详情数据
          this.detailInfo= result.detailInfo
//2.在新建组件DetailGoodsInfo 中 并通props接收数据并处理 并在detail组件中展示
//3.解决图片加载不完全滚动条长度不够的问题
//子组件 通过创建变量，将执行次数变为一次  所以不需要使用防抖
 data() {
			return {
				counter: 0,
        imagesLength: 0
      }
    },
    methods: {
	    imgLoad() {
        // 通过判断, 所有的图片都加载完了, 执行一次回调
        if (++this.counter === this.imagesLength) {
          this.$emit('imageLoad');
        }
	    }
    },
    watch: {
	    detailInfo() {
	      // 实时监听获取图片的个数
	    	this.imagesLength = this.detailInfo.detailImage[0].list.length
	    }
    }
//父组件，接收事件重新计算滚动条
imgLoad() {
        this.$refs.scroll.refresh()
      }
```

### 商品参数组件的设计

```javascript
//1. 在detail.js中新建商品参数类 
export class GoodsParam {
  constructor(info, rule) {
    // 注: images可能没有值(某些商品有值, 某些没有值)
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}

//2.在Detail.vue拿到并保存商品参数数据 
          this.paramInfo = new GoodsParam(result.itemParams.info, result.itemParams.rule)
//3.新建DetailParamInfo组件 并通过props接收数据并处理 并在detail组件中展示
```

### 商品评价组件的设计

```javascript
 //1.获取评论数据  cRate 中保存着评论数,如果数目不为0才进行赋值操作
          if (result.rate.cRate !== 0) {
            this.commentInfo = result.rate.list[0]
          }
//2.新建DetailCommentInfo组件 并通过props接收数据并处理 并在detail组件中展示
//3.关于评论中的时间
//3.1 由于需求的不同，所以服务器中不会保存，某一特定格式的时间，通常保存的都是时间戳，我们需要通过对时间戳进行处理，得到符合要求的时间格式
//value在这里代表获得的时间戳，单位一般是秒， Date构造函数接收的数据需要为毫秒 所以这里乘1000
let date = new Date(value * 1000)
const newdata = date.getFullYear()+'/'data.getMonth()+'/'+data.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
//3.2 因为时间格式化较为常用 ，所以我们通常会通过调用工具方法来处理时间戳
//这里我们在utils.js中封装了一个formatDate用来处理时间戳
//注意：utils.js中的padLeftZero函数是用来补全缺0的日期时间,虽然它没有导出，但可以这么理解：在formatDate要被导出时，他会现在先将自身中所有涉及的函数都编译完毕，之后在导出去，在使用过程中，相当于已经有了padLeftZero
```

### 推荐商品图的设计

```javascript
//1.在detail.js中设计网络请求方法
export function getRecommend() {
  return request({
    url: '/api/v1/recommend'
  })
}
//2.在Detail组价中引入方法
//在created中调用methods中定义的getRecommend()
     this.getRecommend()

//3.在getRecommend()中使用网络请求方法，得到数据，给变量赋值
 getRecommend() {
        getRecommend().then((res) => {
          //推荐商品图数据
          this.recommend = res.data.list
        })
     
//4.复用之前封装好的`goodsList`组件 将参数传递过去
  //在goodListItem组件中新建计算属性 imgSrc用于获取不同路径的图片数据
   computed: {
      imgSrc () {
        return this.item.image || this.item.show.img
      }
    },
```

###  详情页商品图滚动条的刷新

####  第一种方法:首页和详情页共有同一个事件

- 共用一个事件的问题，因为发出的只有一个事件，比如我在a组件中使用了事件，没有关闭的情况下，又在b组件中用，那么如果b触发了，a也会触发，这是没有意义的，所以在离开a前，应该把a关闭，回到a后，再把b关闭

```javascript
//可以通过 
this.$bus.$off(事件名,回调) //关闭指定事件 

//流程：
//1.发出事件
this.$bus.$emit('test')
//2.组件a接收 在create函数接收使用
const fun = function() {}
this.$bus.$on('test',fun)
//假设组件a 是缓存路由`keep-alive` 关闭就在 deactivted 函数中
this.$bus.$off('text',fun)
//3.组件b接收 在create函数接收使用
const fun = function() {}
this.$bus.$on('test',fun)
//假设组件b 不是缓存路由`keep-alive` 关闭就在 destoryed 函数中
this.$bus.$off('text',fun)




//具体实现
//GoodsListItem
  loadImg() {
        //通过事件总线下的$emit 将图片加载完成的事件 发送出去
          this.$bus.$emit('LoadImg')

      },
//Home
   //1.定义 imgLoad 变量 默认为null
   //2.使用
 mounted() {
      //将Scroll组件的refresh方法放入防抖方法
      const fresh = debounce(this.$refs.scroll.refresh,100)
      //通过事件总线下的$on接收指定事件
      this.loadImg = () => {
        //调用封装好的fresh
        fresh()
      }
      this.$bus.$on('LoadImg',this.loadImg)
    },  
   //3.销毁
deactivated(){
      //关闭LoadImg方法
      this.$bus.$on('LoadImg',this.loadImg)
    },        
//Detail
   //1.定义 imgLoad 变量 默认为null
   //2.使用
 mounted() {
      //将Scroll组件的refresh方法放入防抖方法
      const fresh = debounce(this.$refs.scroll.refresh,100)
     this.loadImg = () => {
       //调用封装好的fresh
       fresh()
     }
      //通过事件总线下的$on接收指定事件
      this.$bus.$on('LoadImg',this.loadImg)
    },
   //3.销毁
   destroyed () {
      this.$bus.$off('LoadImg',this.loadImg)
    },

```

#### 第二种方法:传递多个事件 首页和详情页一个页面对应一个事件

```javascript
//在GoodsListItem发送两个事件 通过
loadImg() {
        //通过事件总线下的$emit 将图片加载完成的事件 发送出去
        if(this.$route.path.includes('home')) {
          this.$bus.$emit('HomeLoadImg')
        } else if (this.$route.path.includes('detail')) {
          this.$bus.$emit('DetailLoadImg')
        }
      },
     //使用时各用各的事件互不影响
 //Home
     mounted() {
      //将Scroll组件的refresh方法放入防抖方法
      const fresh = debounce(this.$refs.scroll.refresh,100)

      //通过事件总线下的$on接收指定事件
      this.$bus.$on('HomeLoadImg',() => {
        //调用封装好的fresh
        fresh()
      })
    },         
 //Detail
          
    mounted() {
      //将Scroll组件的refresh方法放入防抖方法
      const fresh = debounce(this.$refs.scroll.refresh,100)

      //通过事件总线下的$on接收指定事件
      this.$bus.$on('DetailLoadImg',() => {
        //调用封装好的fresh
        fresh()
      })
    },
```

区别:第一个方法不用更改封装好的`GoodsListItem`,第二个方法不需要使用·`$off`

#### 通过观察第一个方法，可以看出他的代码重复性较高，我们可以通过`混入mixin`来解决这个问题

```javascript
//混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。
//1.定义混入对象 这里我们在comment 文件夹下新建 mixin.js 将要混入的对象暴露出去
export const imgLoadMixin =  {
  data () {
    return {
      loadImg: null
    }
  },
  mounted () {
    const fresh = debounce(this.$refs.scroll.refresh,100)
    this.loadImg = () => {
      //调用封装好的fresh
      fresh()
    }
    //通过事件总线下的$on接收指定事件
    this.$bus.$on('LoadImg',this.loadImg)
    console.log(1);
  }
}
//2. 之后在Home.vue Detail.vue中直接将mixin导入
//实例参数对象内部，也就是 vue.extent里面  
//局部注册mixin即可
mixins: [imgLoadMixin]
//补充:同名数据对象会在内部进行合并，相同数据会优先使用组件内部自带的;  同名钩子函数会合并成一个数组，优先执行混入的钩子函数;  方法组件指令等，对象会合并为一个对象，相同的方法会优先使用组件内部
//混入可以全局注册 但因为会影响所有Vue实例所有需要谨慎使用
Vue.mixin({
    //....
})
```

###  保存`滚动条防抖函数`

- 因为1.8.12中将防抖函数提取到了`mixin`中
- 所以我们可以将滚动条防抖保存为一个变量，1.8.8中的防抖就可以直接使用这个变量了

```javascript
//mixin
 fresh: null

this.fresh = debounce(this.$refs.scroll.refresh,100)
//Detail
  imgLoad() {
        this.fresh()
      }
```

### 点击标题滚动到对应内容

```javascript
//1.在detailNavBar中
changeIndex(index) {
        this.currentIndex = index
        //将currentIndex传递给父组件
        this.$emit('changeIndex',index)
 }
 //2.点击标题滚动到对应内容
      changeIndex(index) {
        this.$refs.scroll.scrollTo(0,-this.detailScrollY[index],100)
      }
//3.在data中定义变量数组detailScrollY
//4.定义防抖函数 debounceScrollY  在created钩子中保存对数组的防抖
//注意:由于offsetTop基于父元素计算 所以要将detail-scroll设为position:relative
this.debounceScrollY = debounce(() => {
        this.detailScrollY = []
        this.detailScrollY.push(0)
        this.detailScrollY.push(this.$refs.param.$el.offsetTop)
        this.detailScrollY.push(this.$refs.comment.$el.offsetTop)
        this.detailScrollY.push(this.$refs.recommend.$el.offsetTop)
      },100)
//5.在imgload中 执行防抖
 imgLoad() {
        //重新计算详情页滚动条事件
        this.fresh()
        //重新给debounceScrollY赋值
        this.debounceScrollY()
      },
          
          
 //这里尝试的一些方法：1. detailScrollY 不能再created中直接赋值，因为还没有渲染 2.mounted this.$nextTick 两个同样如此 因为图片的原因，DOM元素渲染了，但是图片未加载完毕
```

### 滚动内容切换标题样式

```javascript
//1.接收scroll组件中的事件 
<scroll
    class="detail-scroll"
    ref="scroll"
    :probeType="3"
    @scroll="contentScroll">
        
//2.
        //复杂写法多了最后一个超出的判定
this.currentIndex !== i && (this.detailScrollY[i]<= -position.y && this.detailScrollY[i+1]> -position.y  || this.detailScrollY[i] >= -position.y)
        
        
//编程思路 2.1 .detailScrollY中存放着不同的位置，每个position都应该大于等于前一个detailScrollY的元素小于后一个detailScrollY的元素,最后一个除外，最后一个只需要大于就行，但如果最后一个只大于，我们就又多出了一个判断条件，if判断变得过于复杂于是我们可以在
        this.detailScrollY.push(Number.MAX_VALUE)
//detailScrollY在加入一个数字最大值，来作为结尾解决，先前一个元素只大于不小于的问题，由此得到最后的判断表达式
//this.currentIndex !== i  为了防止navBar.currentIndex被赋值次数过多设定的，有了他，如果i没有新值，就不会重新赋值
//注意:这里length-1是因为,多了一个数字最大值，这个最大值不用循环，所以减1 如果是最初的复杂判断 则不用减一
    //监听滚动位置
      contentScroll(position) {
        let length = this.detailScrollY.length
        //滚动内容切换标题
        for (let i=0; i<length-1; i++) {
          if (this.currentIndex !== i && (this.detailScrollY[i]<= -position.y && this.detailScrollY[i+1]> -position.y)) {
            this.currentIndex = i
            this.$refs.navBar.currentIndex = this.currentIndex
          }
        }
      }
```

### 底部bottom-bar的设计

- 新建`DetailBottomBar`组件

- 将其引入`Detail`中并使用 注意;该组件不滚动，所以放在scroll组件外

- 注意

- ```javascript
  //由于底部多出购物车，所以滚动条高度需要改变
  .detail-scroll{
      height: calc(100% - 44px-58px);
      position: relative;
    }
  ```

### Detail返回顶部按钮

由于返回顶部已经多次使用，复用性较高，所以可以用混入将相同代码提取出来

```javascript
//在mixin.js中导出如下对象，
//再Detail引入gobackTop组件并挂载后，将此方法混入到实例中，
//注意showBackTop方法需要在contentScroll方法中执行
export const backTopMixin =  {
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods:  {
    backTop() {
      this.$refs.scroll.scrollTo(0,0,200)
    },
    showBackTop(position) {
      //返回顶部按钮的显示与隐藏
      this.isShowBackTop = -position.y > 1000
    }
  }
}
```

###  添加购物车的设计

```javascript
//在DetailBottomBar中将事件发送出去 
<div class="cart" @click="addToCart">加入购物车</div>
 addToCart() {
        this.$emit('addToCart')
      }
 //处理接收到的事件
//将商品相关信息加入购物车
      addToCart() {
        const product = {}
        product.iid = this.iid
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.realPrice = this.goods.realPrice
        product.image = this.topImages[0]
          //调用actions中同名方法，并将参数传入
        this.$store.dispatch('addCart',product)
      }
//注意点 1.这里为了方便管理购物车的对象，引入了vuex管理状态
//2.为了方便为之后维护，将目录划分为 index.js mutations.js getters.js actions mutations-types
//3.在index.js state对象中保存cartList 数组形式，用于保存之后的商品对象
const state = {
  cartList: []
}
//4.先前通过actions调用方法实际上可以通过commit直接调用mutations方法，但没有这样做，是因为
//4.1通过分析发现 添加购物车有两种情况，一种本来没有同类商品直接加入，一种本来有同类型商品，于是只加数量
//4.2  mutations推荐一个方法能清晰表明一种状态，所以这里虽然可以直接掉，但通过actions划分情况更好
//4.3 于是现在actions 中设计方法

 addCart({commit,state},payload) {
     //先通过find判断cartList中是否已有相同iid的商品
     //并将返回值赋给oldProuduct 该返回值有相同商品时是商品对象，没有相同返回空
    const oldProduct = state.cartList.find(item => item.iid === payload.iid)
    //如果有，将商品对象oldProduct 通过commit（ADD_COUNT该名称与下面的名都通过，mutations_types管理）发送给mutations
    if (oldProduct) {
      commit(ADD_COUNT,oldProduct)
    } else {
        //如果没有通过commit将新对象payload发送给mutations
       commit(ADD_TO_CART,payload)
    }
  }
//4.4 在mutations 中处理
//旧商品count增加
  [ADD_COUNT] (state,oldProduct) {
    oldProduct.count += 1
  },
//新商品添加count属性设默认值为1 ,并将其添加到cartList数组中
  [ADD_TO_CART] (state,payload) {
    payload.count = 1
    state.cartList.push(payload)
  }
```

## cart 页面

### 导航栏设计

- 引入navbar组件 
- 在navbar中显示商品的种类数量，由于这个数据被vuex管理了，所以通过getters显示更为严谨，那么可以通过如下方式将快捷使用getters的方法

```javascript
//1.cart中
import {mapGetters} from 'vuex'
//2.
//2.1 cart
购物车({{cartListLength}})
//2.2 getters
cartListLength(state) {
    return state.cartList.length
  }
//3 cart
computed: {
      ...mapGetters(['cartListLength'])
    }
```

### 购物车列表的设计

```javascript
//1.新建CartList组件
//注意点 1.1 !!!它引入了scroll组件，scroll的父元素需要高度~~  这个高度设置在了Cart.vue中
 .cart {
    height: 100vh;
  }
//1.2.由此每次添加之后，滚动高度都会发生变化，所以要注意在activted钩子函数中使用 refresh 刷新滚动
 activated() {
      this.$refs.scroll.refresh()
    }
//2.新建CartListItem组件 将数据引入其中并做相应的布局
//3.选中框的设计 在componets/content 下新建CheckButton组件 
//3.1.将组件引入CartListItem中
//3.2 接下来我们要考虑选中框的切换，因为他的选择不选中与商品接下来的结算息息相关，所以不能单纯用变量切换，我们应该将他存为CartList的属性
//3.2.1 在mutations.js中新增
payload.checked = true
//3.2.2 之后在CartListItem中通过props将属性传递给CheckButton来控制他的样式 然后创建clilck事件切换样式
<CheckButton :is-checked="itemInfo.checked" @click.native="changeChecked"></CheckButton>

```

### 底部结算`CartBottomBar`的设计

```javascript
//1.新建CartBottomBar.vue
//2.引入CheckButton.vue
//3.设计CartBottomBar的样式
//4.合计金额的计算  totalPrice
//5.结算数量 totalCount
//6.全选按钮的设计
//6.1
//选中全部商品，全选按钮被选中，有一个商品不选中，全选按钮不选中 在CartBottomBar 中通过isSelectAll方法
    isSelectAll() {
        if (!this.$store.state.cartList.length) return false
        if (this.$store.state.cartList.find(item => !item.checked)) {
          return false
        } else {
          return true
        }
      }
//6.2 单击选中按钮，切换选中不选中的状态，
     checkedAll () {
        if (this.isSelectAll) {
          this.$store.state.cartList.forEach(item => item.checked = false)
        } else {
          this.$store.state.cartList.forEach(item => item.checked = true)
        }
      }

//注意：this.$store.state.cartList.forEach(item => item.checked = !this.isSelectAll) 该简便写法是错误的！！！
//因为 该写法中，要求this.isSelectAll是固定不变的，但是，实际上this.isSelectAll计算方法的值，是受item.checked 影响的，所以this.isSelectAll是变值，不能像这样简写，只能用上述else写法
```

### 弹窗 Toast组件设计

```javascript
//新建组件Toast
//前置条件，在actions中通过new Promise 包裹请求事件 在Detail的addToCart方法中，`.then`接收响应
//三种方法实现效果
//1.在Toast中 用props接收 显示的消息message  组件的显示隐藏ishow  
//1.1 在Detail，引入Toast组件，定义message,isShow两个变量，addToCart中 '.then'回调里面改变变量的值，之后使用定时器，将isShow变为flase

//2.在Toast中定义message,isShow两个变量，并定义方法
 data() {
      return {
        message: '',
        isShow: false
      }
    },
    methods: {
      show(message,duration = 1500) {
        this.message = message
        this.isShow = true
        setTimeout(() => {
          this.isShow = false
        },duration)
      }
    }
//2.1在Detail中，引入Toast组件,给组件标签加上ref 之后在事件中调用子组件方法
 <toast ref="toast"/>

  this.$store.dispatch('addCart',product).then(res => {
          //添加后商品后弹出的信息
          this.$refs.toast.show(res)
        })
//3插件方法
//新建插件将其挂载到main.js上 这样在项目任意位置都可以直接使用该Toast
//3.1 在toast文件夹下新建index.js
import Toast from './Toast'

const obj = {}

obj.install = (Vue) => {
  const toastConstructor  = Vue.extend(Toast)
  const toast = new toastConstructor()
  toast.$mount(document.createElement('div'))
  document.body.appendChild(toast.$el)
  Vue.prototype.$toast = toast
}

export default obj
//3.2 在main.js中 挂载
import toast from './components/common/toast'

Vue.use(toast)
//3.3 之后即可在Detail CartBottomBar组件中使用
//Detail addToCart方法中
  this.$toast.show(res)
//CartBottomBar 中 payClick方法
  payClick () {
        if (!this.cartList.length) {
          this.$toast.show('购物车为空请添加商品')
        }
      }
```

## 解决移动端点击300毫秒延迟

- 延迟的原因：为了检查用户是否在做双击
- 解决办法：FastClick
- 注意：谷歌中会报错，暂时先不用

```javascript
//1.
npm install fastclick
//2.
import FastClick from 'fastclick'
//3.
FastClick.attach('document.body')
```

## 图片懒加载的实现

- 当前的项目:Home页的图片，我设置的是每次加载30条，但如果想要实现，每次只加载视窗显示出来的图片，就需要用到图片的懒加载
- `vue-lazyload`可以实现

```javascript
//1.
npm i vue-lazyload
//2.
import VueLazyLoad from 'vue-lazyload'
//3. 正常使用传递一个参数即可，第二个参数对象为可选的配置对象 loading属性为图片加载时的占位图片，图片加载完成后会将其替换
Vue.use(VueLazyLoad,{
    //官网上的实例代码是直接 loading:'./test.png' 暂未测试是否可行
   loading : require('./test.png')
})
//4. 使用时直接将原本图片中的src替换为 v-lazy即可
 <img v-lazy="img.src" >
```

## px->rem单位转换插件 和px->vw转换插件

- 这里使用的是`postcss-px-to-viewport`

```javascript
// 使用步骤
//1.
npm i postcss-px-to-viewport --save-dev
//2.在postcss.config.js文件中进行配置
module.exports = {
  plugins: {
    autoprefixer: {},
	  "postcss-px-to-viewport": {
 // 视窗的宽度，对应的是我们设计稿的宽度.
 //补充：一般现在的设计稿给的是750的宽度，因为现在的设备 一个retina(视网膜屏)中有两个像素点，所以这里视窗宽度为375 （也就是说一般写代码时，如果是750设计稿，你写时都要将设计稿数据除以2）
		  viewportWidth: 375, 
 // 视窗的高度，对应的是我们设计稿的高度.(也可以不配置 )
 // 补充：375*667 iphone6 屏幕宽高 iphone6分辨率 750*1334 
		  viewportHeight: 667, 
 // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
          //这里保留五位小数
		  unitPrecision: 5, 
 // 指定需要转换成的视窗单位，建议使用vw（宽度）
		  viewportUnit: 'vw', 
// 指定不需要转换的类 ignore这里作为一个备用的类，哪个class不想转换，直接在原有class上，在加上ignore 就不会再转化 tab-bar，tab-bar-item也是按照正则匹配的,class名称中包含这两个也不会被转换 如:tab-bar-ase这样的就不会被转换
		  selectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item'], 
  //最小转化单位
  // 小于或等于`1px`不转换为视窗单位.
		  minPixelValue: 1,
 // 是否在媒体查询中转换`px` 
 //false不允许使用媒体查询转换px
		  mediaQuery: false ,
  //exclude 排除指定文件夹 要求使用正则
          exclude: [/TabBar/]
	  },
  }
}
```

## nginx项目在服务器的部署

- nginx 是一个类似于tomcat的服务器
  - 是使用c语言开发的高性能的http服务器及反向代理服务器

- 服务器：一台电脑(一般没有显示屏，只有主机) 24小时开机
- 一般的中小型公司都租赁服务器，大型公司才自己建造服务器

### njinx下载

`Mainline version`开发版

`Stable version` 稳定版

`Legacy versions` 老版本

官网：http://nginx.org/

==windows环境==

### 安装

- 解压到任意文件，注意解压的文件夹最好不包含中文
- 双击安装文件夹下的`nginx.exe`启动接口
- 在浏览器中输入`localhost `看到`welcome nginx`界面即安装成功 注：默认端口号为80 ，如果被占用，关闭占用的应用即可正常使用



### 使用

- 将dist文件夹里的内容沾到 nginx目录的html文件夹下
- 删除之前的示例网页，再运行就会出现想要的网页

- 也可以在conf文件下 修改`nginx.conf`配置文件，来指定显示的网页等
- 比如这里`root`后面改为dist之后访问就会访问dist文件夹

![project03](G:\笔记\img\mall project\project03.png)

==Linux 系统==

常见的Linux系统 `linux ubuntu` (这个版本方便学习使用`linux`)

`linux centos `（稳定性较高，可用于搭建服务器）

部署服务器过程

远程服务器->安装`linux centos`操作系统->nginx安装（终端命令）

- `yum install nginx` 下载nginx ·  `yum`是一个类似于`npm `的包管理工具，一般会随着`linux`系统的安装一并安装
- `systemctl start nginx.service `开启nginx服务
- `systemctl enable nginx.service` 设置服务跟随系统启动

补充：

- windows与远程主机交互文件的软件`WinSCP`
- windows想要用命令操作远程主机需要安装SSH，或者使用`SecureCRT`软件

## 响应式原理

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
<!--
  1.app.message修改数据,Vue内是如何监听message数据的改变
    1.1使用了 Object.defineProperty
  2.当数据发生改变，Vue是如何知道要通知哪些人 界面发生改变
    2.1使用了发布订阅者模式


-->
<script>
  const obj = {
    message: '哈哈哈',
    name: 'why'
  }
  //Object.keys遍历指定对象的可枚举属性，返回属性名组成的数组
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    //定义属性 obj 定义属性的对象 key 属性名 {} 配置
    //get 返回值为属性值 也就是读属性 set监听属性的改变 也就是写属性
    Object.defineProperty(obj,key,{
      //也就是key属性值一改变就执行这个函数
      set(newVaule) {
        console.log('监听'+key+'改变')
        value = newVaule
      },
      //一读取key属性，就执行这个函数
      get() {
        //通过解析html代码模板，找到对应属性
        return value
      }
    })
  })

  //发布者订阅者

  //发布者
  class Dep {
    constructor() {
      this.subs = []
    }
    addSub(watcher) {
      this.subs.push(watcher)
    }
    notify() {
      this.subs.forEach(item => {
        item.update()
      })
    }
  }
  //订阅者
  class Watcher {
    constructor(name) {
      this.name = name
    }
    update() {
      console.log(this.name + '发生update');
    }
  }
  const dep = new Dep()

  const w1 = new Watcher('张三')
  dep.addSub(w1)   //这里相当于get中执行的

  //之后如果修改值，就执行dep.notify 这里相当于 set中执行的

  const w2 = new Watcher('李四')
  dep.addSub(w2)

  const w3 = new  Watcher('王五')
  dep.addSub(w3)
</script>
<div id="app">
  {{message}}
  {{message}}
  {{message}}
  {{message}}
</div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '哈哈哈'
    }
  })
</script>
</body>
</html>

```

<img src="G:\笔记\img\mall project\project04.png" alt="project04" style="zoom: 67%;" />

图的个人理解：

new vue 实例 ->解析el模板指令->初始化view->data中的数据被Observer监听劫持->通知变化给dep->dep将变化交由watcher发布->watcher交由view更新页面-> el发生变化->告诉watcher ->watcher给Dep添加订阅者->Dep得到消息将其变化发布给watcher->更新视图





bug:  `Detail.vue` 滚动条联动的bug :

```css
.detail-scroll{
    height: calc(100% - 102px);
    <!--offsetTop 需要offparent， offsetparent是该class所以这里设置position-->
    position: relative;
  }
```

