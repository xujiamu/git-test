function LinkedList() {
  function Node(data) {
    this.data = data
    this.next = null
  }
  this.head = null
  this.length = 0
  //链表最后添加元素
  LinkedList.prototype.append = function (data) {
    const newNode = new Node(data)
    //如果链表中没有元素，将指针指向新元素
    if (this.length === 0) {
      this.head = newNode
    } else {
      //如果链表中已有元素，将头指针的指向，赋给current
      let current = this.head
      //循环改变current 的指向，直到其下一次的指向为空时停止
      while (current.next) {
        current = current.next
      }
      //将新元素保存在链表最后一个元素的next中
      current.next = newNode
    }
    this.length += 1
    return true
  }
  //链表元素转字符串
  LinkedList.prototype.toString = function () {
    //将头指针的指向，赋给current
    let current = this.head
    //创建变量用于保存转换后的字符串
    let listString = ''
    //循环改变循环改变current 的指向，直到它的指向为空时停止
    // 并且再每一次循环中将对应的data取出，拼接到listString
    while (current) {
      listString += current.data+' '
      current = current.next
    }
    //返回字符串
    return listString
  }
  //链表任意位置插入元素
  LinkedList.prototype.inserted = function (position,data) {
    //越界判断
    if (position >=0 && position<=this.length) {
      const newNode = new Node(data)
      //插到第一个位置
      if (position === 0) {
        newNode.next = this.head
        this.head = newNode
      } else {
        //插到其他位置
        index = 0
        prev = null
        current = this.head
        //循环index直到 index不小于position时停止 这时
        // prev指向要插入元素的前一个元素，current指向要插入元素的后一个元素
        // index++ 是执行完表达式以后执行自增 这里不能写++index ++index 是执行完自增执行表达式
        while (index++ < position) {
          prev = current
          current = current.next
          //index++ 就相当于 在这里执行
        }
        prev.next = newNode
        newNode.next = current
      }
      this.length += 1
      return true
    }
    return false
  }
  //获取指定位置的元素
  LinkedList.prototype.get = function (position) {
    if (position < 0 || position>=this.length) return null
    let current = this.head
    let index = 0
    while (index++ < position) {
      current = current.next
    }
    return current.data
  }
  //获取指定元素的位置
  LinkedList.prototype.indexOf = function (data) {
    let current = this.head
    let index = 0
    while (current) {
      if (current.data === data) {
        return index
      }
      current = current.next
      index += 1
    }
    return -1
  }
  //更新指定元素
  LinkedList.prototype.update = function (position,data) {
    if (position<0 || position>=this.length) return false
    let current = this.head
    let index = 0
    while (index++ < position) {
      current = current.next
    }
    current.data = data
    return true
  }
  //删除指定位置的元素
  LinkedList.prototype.removeAt = function (position) {
    if (position<0 || position>=this.length) return null
    let current = this.head
    if (position === 0) {
      this.head = this.head.next
    } else {
      let prev = null
      let index = 0
      while (index++ < position) {
        prev = current
        current = current.next
      }
      prev.next = current.next
    }
    this.length -= 1
    return current.data
  }
  //删除元素
  LinkedList.prototype.remove = function (data) {
    this.removeAt(this.indexOf(data))
  }
  //判断是否为空
  LinkedList.prototype.isEmpty = function () {
    return this.length === 0
  }
  //返回链表长度
  LinkedList.prototype.size = function () {
    return this.length
  }
}
const linkedList = new LinkedList()
linkedList.append('eg')
linkedList.append(25)
linkedList.append('215')
console.log(linkedList.toString());
linkedList.inserted(2,'test')
console.log(linkedList.toString());
console.log(linkedList.get(3));
console.log(linkedList.indexOf('215'));
linkedList.update(3,'581')
console.log(linkedList.toString());
linkedList.removeAt(1)
console.log(linkedList.toString());
linkedList.append(51)
linkedList.append(37)
console.log(linkedList.toString());
linkedList.remove('eg')
linkedList.remove(37)
console.log(linkedList.toString());
console.log(linkedList.isEmpty())
console.log(linkedList.size())
