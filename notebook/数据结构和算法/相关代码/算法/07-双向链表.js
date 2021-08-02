function DoubleLinkedList() {
  function Node(data) {
    this.prev = null
    this.next = null
    this.data = data
  }

  this.head = null
  this.tail = null
  this.length = 0
  DoubleLinkedList.prototype.append = function (data) {
    const node = new Node(data)
    if (this.length === 0) {
      this.tail = node
      this.head = node
    } else {
      node.prev = this.tail
      this.tail.next = node
      this.tail = node
    }
    this.length += 1
  }
  DoubleLinkedList.prototype.toString = function () {
    let current = this.head
    let duString = ''
    while (current) {
      duString += current.data + ' '
      current = current.next
    }
    return duString
  }
  DoubleLinkedList.prototype.backward = function () {
    return this.toString()
  }
  DoubleLinkedList.prototype.forward = function () {
    let current = this.tail
    let duString = ''
    while (current) {
      duString += current.data + ' '
      current = current.prev
    }
    return duString
  }
  DoubleLinkedList.prototype.inserted = function (position, data) {
    if (position < 0 || position > this.length) return false
    const node = new Node(data)
    if (this.length === 0) {
      this.tail = node
      this.head = node
    } else {
      if (position === 0) {
        this.head.prev = node
        node.next = this.head
        this.head = node
      } else if (position === this.length) {
        this.tail.next = node
        node.prev = this.tail
        this.tail = node
      } else {
        let current = this.head
        let index = 0
        while (index++ < position) {
          current = current.next
        }
        node.prev = current.prev
        node.next = current
        current.prev.next = node
        current.prev = node
      }
    }
    this.length += 1
    return true
  }
  DoubleLinkedList.prototype.get = function (position) {
    if (position < 0 || position >= this.length) return null
    if (position >= Math.ceil(this.length/2)) {
      let current = this.tail
      let index = this.length-1
      while (index-- > position) {
        current = current.prev
      }
      return current.data
    } else {
      let current = this.head
      let index = 0
      while (index++ <  position) {
        current = current.next
      }
      return current.data
    }
  }
  DoubleLinkedList.prototype.indexOf = function (data) {
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
  DoubleLinkedList.prototype.update = function (position,data) {
    if (position < 0 || position >= this.length) return false
    if (position >= Math.ceil(this.length/2)) {
      let current = this.tail
      let index = this.length-1
      while (index-- > position) {
        current = current.prev
      }
      current.data = data
      return true
    } else {
      let current = this.head
      let index = 0
      while (index++ < position) {
        current = current.next
      }
      current.data = data
      return true
    }
  }
  DoubleLinkedList.prototype.removeAt = function (position) {
    //原先写了this.length === 0的判定， 后来发现不用，因为它包括在了position === 0 中
    if (position < 0 || position >= this.length) return null
    // if (position < 0 || position >= this.length || this.length === 0) return null
    let current = this.head
    if (this.length === 1) {
      this.head = null
      this.tail = null
    } else {
      if (position === 0) {
        current.next.prev = null
        this.head = current.next
      } else if (position === this.length-1) {
        current = this.tail
        current.prev.next = null
        this.tail = this.tail.prev
      } else {
        current = this.head
        let index = 0
        while (index++ < position) {
          current = current.next
        }
        current.next.prev = current.prev
        current.prev.next = current.next
      }
    }
    this.length -= 1
    return current.data
  }
  DoubleLinkedList.prototype.remove = function (data) {
    return this.removeAt(this.indexOf(data))
  }
  DoubleLinkedList.prototype.isEmpty = function () {
    return this.length === 0
  }
  DoubleLinkedList.prototype.size = function () {
    return this.length
  }
  DoubleLinkedList.prototype.getFirst = function () {
    return this.head.data
  }
  DoubleLinkedList.prototype.getEnd = function () {
    return this.tail.data
  }
}

const duList = new DoubleLinkedList()
duList.append(214)
duList.append(306)
duList.append(957)
console.log(duList.forward());
duList.inserted(0,85)
duList.inserted(4,37)
duList.inserted(2,91)
console.log(duList.toString())
console.log(duList.get(2));
console.log(duList.get(3))
console.log(duList.indexOf(306));
duList.update(1,396)
duList.update(5,618)
console.log(duList.toString());
console.log(duList.removeAt(5));
console.log(duList.removeAt(0));
console.log(duList.removeAt(1));
console.log(duList.removeAt(1));
console.log(duList.removeAt(0));
console.log(duList.removeAt(0));
console.log(duList)
console.log(duList.removeAt(0));
console.log(duList)
