function decToBin(decimal) {
  const stack = new Stack()
  while(decimal > 0) {
    stack.push(decimal%2)
    decimal = Math.floor(decimal/2)
  }
  var  binary = ''
  while(!stack.isEmpty()) {
    binary += stack.pop()
  }
  return Number(binary)
}

console.log(decToBin(24));


function Stack() {
  //这里的方法我们全部写在Stack类的原型上 因为我们要求这里的方法是每个Stack实例都通用的 ，如果单纯创建构造在函数中，每个实例之间的方法都不会产生联系，而且每次创建实例，都会重新创建方法，消耗了不必要的资源，所以我们需要将方法定义在原型里

  this.items = []
  //将元素压入栈
  Stack.prototype.push = function (element) {
    return this.items.push(element)
  }
  //将元素取出栈
  Stack.prototype.pop = function () {
    return this.items.pop()
  }
  //查看栈顶元素
  Stack.prototype.peek = function () {
    return this.items[length-1]
  }
  //判断栈是否为空
  Stack.prototype.isEmpty = function () {
    return this.items.length === 0
  }
  //查看栈中元素数量
  Stack.prototype.size = function () {
    return this.items.length
  }
  //栈的toString方法
  Stack.prototype.toString = function () {
    return this.items.join(' ')
  }
}

