function game(arr,num) {
  const queue = new Queue()
  arr.forEach(item => {
    queue.enQueue(item)
  })
  while (queue.size() > 1) {
    for (let i=0; i<num-1; i++) {
      queue.enQueue(queue.deQueue())
    }
    queue.deQueue()
  }
  console.log(queue.size())
  console.log(queue.front())
  return arr.indexOf(queue.front())
}


const end = game(['张三','李四','王五','赵六','林七'],5)
console.log(end);

function Queue() {
  this.items = []
  //添加元素
  Queue.prototype.enQueue = function (element) {
    return this.items.push(element)
  }
  //删除队列首端元素
  Queue.prototype.deQueue = function () {
    return this.items.shift()
  }
  //查看队列首端元素
  Queue.prototype.front = function () {
    return this.items[0]
  }
  //判断队列是否为空
  Queue.prototype.isEmpty = function () {
    return this.items.length === 0
  }
  //查看队列元素个数
  Queue.prototype.size = function () {
    return this.items.length
  }
  //队列的toString方法
  Queue.prototype.toString = function () {
    return this.items.join(' ')
  }
}
