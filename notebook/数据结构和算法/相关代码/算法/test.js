function Test() {
  function P() {
    this.a  = 1
  }
  let b = 16
  this.d = 1
  this.c = function () {
    console.log(5);
  }
  Test.prototype.f = function (d) {
    this.c()
    this.d = d
    console.log(this.d);
    //b在这里能用的原因 ，实例执行这一方法时，首先这个b没有this 所以不在实例中找，在原型本身找，然后原型本身
    //没有，于是会去 ---》原型上一层的构造函数中找，构造函数中存在于是打印成功 所以在数据结构与算法学习中的
    //构造函数内的构造函数也是如此，在原型里面创建实例，如果原型里面找不到就会找到外面的构造函数
    console.log(b);
  }
}
test1 = new Test()
test1.c()
test1.c = function() {
  console.log(3);
}
test1.c()
test2 = new Test()
test2.c()

console.log(test1.d);
test1.f(666)
test2.f(999)
