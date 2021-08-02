module.exports = Queue

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

const queue = new Queue()
queue.enQueue(4)
queue.enQueue(14)
queue.enQueue(45)
queue.enQueue(67)
console.log(queue);
queue.deQueue()
console.log(queue)
console.log(queue.front())
console.log(queue.size())
console.log(queue.isEmpty())
console.log(queue.toString())
