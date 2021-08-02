function Stack() {
  //这里的方法我们全部写在Stack类的原型上 因为我们要求这里的方法是每个Stack实例都通用的 ，如果单纯创建构造在函数中，每个实例之间的方法都不会产生联系，而且每次创建实例，都会重新创建方法，消耗了不必要的内容，所以我们需要将方法定义在原型里

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
    return this.items.length>0
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

// console.log(typeof  [23, 25, 2].toString());

const stack = new Stack()

console.log(stack.push(5));
console.log(stack.items);

console.log(stack.size());

console.log(stack.pop());
console.log(stack.items);

stack.push(24)
console.log(stack.items);

console.log(stack.isEmpty());

console.log(stack.size());

console.log(stack.toString());
