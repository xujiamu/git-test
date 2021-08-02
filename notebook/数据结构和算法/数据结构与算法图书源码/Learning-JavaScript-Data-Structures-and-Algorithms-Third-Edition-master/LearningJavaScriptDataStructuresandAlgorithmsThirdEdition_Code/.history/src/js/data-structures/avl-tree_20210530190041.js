import { Compare, defaultCompare } from '../util';
import BinarySearchTree from './binary-search-tree';
import { Node } from './models/node';

const BalanceFactor = {
  UNBALANCED_RIGHT: 1,
  SLIGHTLY_UNBALANCED_RIGHT: 2,
  BALANCED: 3,
  SLIGHTLY_UNBALANCED_LEFT: 4,
  UNBALANCED_LEFT: 5
};

export default class AVLTree extends BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    super(compareFn);
    this.compareFn = compareFn;
    this.root = null;
  }
  getNodeHeight(node) {
    if (node == null) {
      return -1;
    }
    return Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right)) + 1;
  }
  /**
   * Left left case: rotate right
   *
   *       b                           a
   *      / \                         / \
   *     a   e -> rotationLL(b) ->   c   b
   *    / \                         /   / \
   *   c   d                       f   d   e
   *  /
   * f
   * @param node Node<T>
   */
  rotationLL(node) {
    const tmp = node.left;
    node.left = tmp.right;
    tmp.right = node;
    return tmp;
  }
  /**
   * Right right case: rotate left
   *
   *     a                              b
   *    / \                            / \
   *   c   b   -> rotationRR(a) ->    a   e
   *      / \                        / \   \
   *     d   e                      c   d   f
   *          \
   *           f
   * @param node Node<T>
   */
  rotationRR(node) {
    const tmp = node.right;
    node.right = tmp.left;
    tmp.left = node;
    return tmp;
  }
  /**
   * Left right case: rotate left then right
   *       b                           b                           d
   *      / \                         / \                         / \
   *     a   e -> rotationRR(a) ->   d   e   -> rotationLL(b)    a   b
   *    / \                         / \                         /   / \
   *   c   d                       a   f                       c   f   e
   *        \                     /
   *         f                   c
   * @param node Node<T>
   */
  rotationLR(node) {
    node.left = this.rotationRR(node.left);
    return this.rotationLL(node);
  }
  /**
   * Right left case: rotate right then left
   *     a                              a                           d
   *    / \                            / \                         / \
   *   c   b   -> rotationLL(b) ->    c   d    -> rotationRR(a)   a   b
   *      / \                            / \                     / \   \
   *     d   e                          f   b                   c   f   e
   *    /                                    \
   *   f                                      e
   * @param node Node<T>
   */
  rotationRL(node) {
    node.right = this.rotationLL(node.right);
    return this.rotationRR(node);
  }
  getBalanceFactor(node) {
    const heightDifference = this.getNodeHeight(node.left) - this.getNodeHeight(node.right);
    switch (heightDifference) {
      case -2:
        return BalanceFactor.UNBALANCED_RIGHT; //! 1
      case -1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT; //! 2
      case 1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT; //! 4
      case 2:
        return BalanceFactor.UNBALANCED_LEFT; //! 5
      default:
        return BalanceFactor.BALANCED; //! 3
    }
  }
  insert(key) {
    this.root = this.insertNode(this.root, key);
  }
  insertNode(node, key) {
    if (node == null) {
      return new Node(key);
    } else if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      node.left = this.insertNode(node.left, key);
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      node.right = this.insertNode(node.right, key);
    } else {
      return node; // duplicated key
    }
    // verify if tree is balanced  //! 平衡 0
    const balanceFactor = this.getBalanceFactor(node);
    if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) { //! 5 --> 2
      if (this.compareFn(key, node.left.key) === Compare.LESS_THAN) {
        // Left left case
        node = this.rotationLL(node);
      } else {
        // Left right case
        return this.rotationLR(node);
      }
    }
    if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {  //! 1  --> -2 
      if (this.compareFn(key, node.right.key) === Compare.BIGGER_THAN) {
        // Right right case
        node = this.rotationRR(node);
      } else {
        // Right left case
        return this.rotationRL(node);
      }
    }
    return node;
  }
  removeNode(node, key) {
    node = super.removeNode(node, key); // {1}
    if (node == null) {
      return node;
    }
    // verify if tree is balanced //! 平衡 0
    const balanceFactor = this.getBalanceFactor(node);
    if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) { //! 5 --> 2
      // Left left case
      if (
        this.getBalanceFactor(node.left) === BalanceFactor.BALANCED ||  //! 平衡 0
        this.getBalanceFactor(node.left) === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT //! 4 --> 1
      ) {
        return this.rotationLL(node);
      }
      // Left right case
      if (this.getBalanceFactor(node.left) === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {  //! 2  --> -1
        return this.rotationLR(node.left);
      }
    }
    if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {  //! 1  --> -2 
      // Right right case
      if (
        this.getBalanceFactor(node.right) === BalanceFactor.BALANCED || //! 平衡 0
        this.getBalanceFactor(node.right) === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT    //! 2  --> -1
      ) {
        return this.rotationRR(node);
      }
      // Right left case
      if (this.getBalanceFactor(node.right) === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT) { //! 4 --> 1
        return this.rotationRL(node.right);
      }
    }
    return node;
  }
}
