//此处返回false 可以看出 'str'本身不是对象，类似'3' true  3 都是基本数据类型（字面值）
console.log('str' instanceof String)  //false

//一个字面值能够直接调用原始类型的方法是经过了以下步骤
//1.创建了一个String类型实例 2. 在实例上调用指定方法 3.销毁实例
// (所以原始数据类型也可以叫基本包装类型，因为它们会对基本数据类型数据，进行一次包装)
//注：因为这样，所以我们不能给字面值添加方法，因为方法只存在于添加的一瞬间，之后会立即销毁
console.log('str'.slice(1));  //tr

//可以给Object实例直接插入字面值，它会根据传入的值类型，创建对应的原始类型实例
const str = new Object('124')
console.log(str instanceof String)   //true

//注意 将不同类型的字面值传入 特定的原始类型，会自动进行转化
//有new 会转化成 Number实例对象 （typeof监测返回Object)
//无new 会转化成 number字面值 （typeof监测返回number)
const str2 = new Number('124')
console.log(str2 instanceof Number); //true
console.log(typeof str2);         // Object
const str3 = Number('124')
console.log(str3 instanceof Number); //false
console.log(typeof str3);   //number

