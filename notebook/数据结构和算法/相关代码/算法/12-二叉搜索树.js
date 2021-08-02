function BinarySearchTree() {
  //创建树节点
  function Node(key) {
    this.key = key
    this.left = null
    this.right = null
  }
  //root节点
  this.root = null
  //添加树节点方法
  BinarySearchTree.prototype.insert = function (key) {
    const newNode = new  Node(key)
    //判断root是否为空 如果为空 则将其指向新节点
    if (this.root === null) {
      this.root = newNode
    } else {
      //如果不为空调用insertNode方法进行判定
      this.insertNode(this.root,newNode)

    }
  }
  //左右子节点插入方法,由insert 方法自行调用
  BinarySearchTree.prototype.insertNode = function (oldNode,newNode) {
    if (oldNode.key > newNode.key) {
      if (oldNode.left === null) {
        oldNode.left = newNode
      } else {
        this.insertNode(oldNode.left,newNode)
      }
    } else {
      if (oldNode.right === null) {
        oldNode.right = newNode
      } else {
        this.insertNode(oldNode.right,newNode)
      }
    }
  }

  //先序遍历
  BinarySearchTree.prototype.preOrderTraversal = function (callBack) {
    this.preOrderTraversalNode(this.root,callBack)
  }
  BinarySearchTree.prototype.preOrderTraversalNode = function (node,callBack) {
    if (node !== null) {
      callBack(node.key)
      this.preOrderTraversalNode(node.left,callBack)
      this.preOrderTraversalNode(node.right,callBack)
    }
  }
  //中序遍历
  BinarySearchTree.prototype.inOrderTraversal = function (callBack) {
    this.inOrderTraversalNode(this.root,callBack)
  }
  BinarySearchTree.prototype.inOrderTraversalNode = function (node,callBack) {
    if (node !== null) {
      this.inOrderTraversalNode(node.left,callBack)
      callBack(node.key)
      this.inOrderTraversalNode(node.right,callBack)
    }
  }
  //后序遍历
  BinarySearchTree.prototype.postOrderTraversal = function (callBack) {
    this.postOrderTraversalNode(this.root,callBack)
  }
  BinarySearchTree.prototype.postOrderTraversalNode = function (node,callBack) {
    if (node !== null) {
      this.postOrderTraversalNode(node.left,callBack)
      this.postOrderTraversalNode(node.right,callBack)
      callBack(node.key)
    }
  }

  //得到最大值
  BinarySearchTree.prototype.max = function () {
    let node = this.root
    while (node !== null && node.right !== null) {
      node = node.right
    }
    return node.key
  }
  //得到最小值
  BinarySearchTree.prototype.min = function () {
    let node  = this.root
    while (node !== null && node.left !== null) {
      node = node.left
    }
    return node.key
  }

  //搜寻特定key
  BinarySearchTree.prototype.search = function (key) {
    return this.searchNode(this.root,key)
  }
  BinarySearchTree.prototype.searchNode = function (node,key) {
    if (node === null) return false
    if (node.key > key) {
      node = node.left
      //这里必须 ！ return 递归否则调用search会返回undefined
      //return的原因 :因为最后一次调用 searchNode返回的是上一次递归的值，而不是返回的search的值，所以为了确保search有返回值
      //需要每一层都返回，将最后一次的return层层传递上来
      return this.searchNode(node,key)
    } else if (node.key < key) {
      node = node.right
      return this.searchNode(node,key)
    } else {
      return true
    }
  }

  // 删除指定key
  BinarySearchTree.prototype.remove = function (key) {
    let current = this.root
    let parent = null
    let isLeftChild = true

    //1.找到要被删除的节点
    while (current.key != key) {
      parent = current
      if (key < current.key) {
        isLeftChild = true
        current = current.left
      } else {
        isLeftChild = false
        current = current.right
      }
      if (current == null) return false
    }
    //2.删除节点
    //2.1.删除的节点是叶子节点
    if (current.left === null && current.right === null) {
      if (current === this.root) {
        this.root = null
      } else if (isLeftChild) {
        parent.left = null
      } else {
        parent.right = null
      }
    }
    //2.2.删除的节点只有左或右其中一边有子节点
    else if(current.right === null) {
      if (current === this.root) {
        this.root = current.left
      } else if (isLeftChild) {
        parent.left = current.left
      } else {
        parent.right = current.left
      }
    } else if (current.left === null) {
      if (current === this.root) {
        this.root = current.right
      } else if (isLeftChild) {
        parent.left = current.right
      } else {
        parent.right = current.right
      }
    }
    //2.3删除的节点两边都有子节点
    else {
      //前驱 二叉搜索树任意节点的所有左子树中最接近该节点key值得点
      //后继 二叉搜索树任意节点的所有右子树中最接近该节点key值得点
      //获取后继节点
      let successor = this.getSuccessor(current)
      //判断是否是根节点
      if (current === this.root) {
        this.root = successor
      } else if (isLeftChild) {
        parent.left = successor
      } else {
        parent.right = successor
      }
    //让后继的左子树指向，被删除节点的左子树
    successor.left = current.left
    }
  }
  BinarySearchTree.prototype.getSuccessor = function (delNode) {
    let successor = delNode
    let current = delNode.right
    let successorParent = delNode

    while (current != null) {
      successorParent = successor
      successor = current
      current = current.left
    }
    //判断找到的后继是否是delNode的right节点
    if (successor != delNode.right) {
      successorParent.left = successor.right
      successor.right = delNode.right
    }
    return successor
  }

}

//测试
const bst = new BinarySearchTree()

bst.insert(11)
bst.insert(7)
bst.insert(15)
bst.insert(5)
bst.insert(3)
bst.insert(9)
bst.insert(8)
bst.insert(10)
bst.insert(13)
bst.insert(12)
bst.insert(14)
bst.insert(20)
bst.insert(18)
bst.insert(19)
bst.insert(25)
console.log(bst);


bst.preOrderTraversal((key) => {console.log(key)})
bst.inOrderTraversal((key) => {console.log(key)})
bst.postOrderTraversal((key) => {console.log(key)})
console.log('-----');
console.log(bst.max());
console.log(bst.min());
console.log(bst.search(20));
bst.remove(12)
bst.remove(14)
bst.remove(18)
bst.inOrderTraversal((key) => {console.log(key)})

