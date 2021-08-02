//导入队列构造函数
const Queue = require('./03-队列.js')


//Map构造函数
function Map() {
  this.items = {}
  //增加键值对 set
  Map.prototype.set = function(key,value) {
    if (this.has(key)) return false
    this.items[key] = value
    return true
  }
  //判断是否存在指定key has
  Map.prototype.has = function(key) {
    return this.items.hasOwnProperty(key)
  }
  //查询指定key的value get
  Map.prototype.get = function(key) {
    return this.has(key) ? this.items[key] : undefined
  }
  //删除指定key的value delete
  Map.prototype.delete = function(key) {
    if (this.has(key)) return false
    delete this.items[key]
    return true
  }
  //删除全部的键值对 clear
  Map.prototype.clear = function(key) {
    this.items = {}
  }
  //查询键值对的数量 size
  Map.prototype.size = function() {
    return Object.keys(this.items).length
  }
  //查询全部的key  keys
  Map.prototype.keys = function() {
    return Object.keys(this.items)
  }
  //查询全部的value values
  Map.prototype.values = function() {
    return Object.values(this.items)
  }
}


function Graph() {
  //顶点
  this.vertexes = []
  //边 通过创建之前实现的Map函数实例，保存边
  this.edges = new Map()
   //增加顶点方法
  Graph.prototype.addVertex = function (v) {
    this.vertexes.push(v)
    this.edges.set(v,[])
  }
  //增加边方法
  Graph.prototype.addEdge = function (v1,v2) {
    this.edges.get(v1).push(v2)
    this.edges.get(v2).push(v1)
  }
  //toString方法
  Graph.prototype.toString = function () {
    let graphStr = ''
    this.vertexes.forEach(item => {
      graphStr += item + '-> '
      for (const i of this.edges.get(item)) {
        graphStr += i + ' '
      }
      graphStr += '\n'
    })
    return graphStr
  }

  //初始化顶点颜色
  Graph.prototype.initialize = function () {
    const color = {}
    for (const i of this.vertexes) {
      color[i] = 'white'
    }
    return color
  }

  //广度排序
  Graph.prototype.BFS = function (vFist,callback) {
    //1.初始化顶点颜色
    const color = this.initialize()
    //2.创建队列实例
    const queue = new Queue()
    //3.将第一个顶点加入队列
    queue.enQueue(vFist)
    //3.1 改变该顶点颜色
    color[vFist] = 'gray'
    //4.遍历队列,为空时退出循环
    while (!queue.isEmpty()) {
      //4.1 出队 并得到出队顶点
      const v = queue.deQueue()
      //4.2 得到该顶点的其他邻接顶点数组
      const otherV = this.edges.get(v)
      //4.3 对数组进行遍历
      for (const i of otherV) {
        //4.4 判断顶点的颜色
        if (color[i] === 'white') {
          //4.5 是白色将其加入队列
          queue.enQueue(i)
          //4.6 加入队列的变为灰色 注：因为如果不变色之后其他元素遍历时可能会重复添加同一顶点
          color[i] = 'gray'
        }
      }
      //5.此顶点完全搜索完毕，将顶点变为黑色
      color[v] = 'black'
      //6.将顶点通过回调发送出去
      callback(v)
    }
  }

  //深度排序
  Graph.prototype.DFS = function (vFist,callback) {
    //1.初始化顶点颜色
    const color = this.initialize()
    //2.调用DFSList
    this.DFSList(vFist,color,callback)

  }
  Graph.prototype.DFSList = function (vertex,color,callback) {
    //1.改变顶点颜色
    color[vertex] = 'gray'
    //2.将顶点通过回调发送出去
    callback(vertex)
    //3.得到该顶点的其他邻接顶点数组
    const otherV = this.edges.get(vertex)
    //4.递归遍历其余顶点
    for (const i of otherV) {
      if (color[i] === 'white') {
        this.DFSList(i,color,callback)
      }
    }
    //5.将遍历完毕后的顶点设为黑色
    color[vertex] = 'black'
  }
}


const graph = new Graph()

graph.addVertex('A')
graph.addVertex('B')
graph.addVertex('C')
graph.addVertex('D')
graph.addVertex('E')
graph.addVertex('F')
graph.addVertex('G')
graph.addVertex('H')
graph.addVertex('I')

graph.addEdge('A','B')
graph.addEdge('A','C')
graph.addEdge('A','D')
graph.addEdge('C','D')
graph.addEdge('C','G')
graph.addEdge('D','G')
graph.addEdge('D','H')
graph.addEdge('B','E')
graph.addEdge('B','F')
graph.addEdge('E','I')

console.log(graph.toString());

graph.BFS('A',(vertex) => {console.log(vertex)})
console.log('----------')
graph.DFS('A',(vertex) => {console.log(vertex)})

