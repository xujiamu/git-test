function PriorityQueue() {
  function QueueElement(element, priority) {
    this.element = element
    this.priority = priority
  }

  this.items = []
  PriorityQueue.prototype.enQueue = function (element, priority) {
    const queueElement = new QueueElement(element, priority)
    if (this.items.length === 0) {
      this.items.push(queueElement)
    } else {
      let select = false
      this.items.find((item,index) => {
        if (queueElement.priority < item.priority) {
          this.items.splice(index,0,queueElement)
          select = true
          return item
        }
      })
      if (!select) {
        this.items.push(queueElement)
      }
    }
  }
  //删除队列首端元素
  PriorityQueue.prototype.deQueue = function () {
    return this.items.shift()
  }
  //查看队列首端元素
  PriorityQueue.prototype.front = function () {
    return this.items[0]
  }
  //判断队列是否为空
  PriorityQueue.prototype.isEmpty = function () {
    return this.items.length === 0
  }
  //查看队列元素个数
  PriorityQueue.prototype.size = function () {
    return this.items.length
  }
  //队列的toString方法
  PriorityQueue.prototype.toString = function () {
    return this.items.join(' ')
  }
}
const priorityQueue = new PriorityQueue()
priorityQueue.enQueue('张三',51)
priorityQueue.enQueue('李四',164)
priorityQueue.enQueue('王五',146)
priorityQueue.enQueue('赵六',14)
priorityQueue.enQueue('林七',23)

console.log(priorityQueue);
