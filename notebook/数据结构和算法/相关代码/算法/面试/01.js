//获取相反数，并得到相反数和原数的和
function reverseNum(num) {
  const reverse =  parseInt(num.toString().split('').reverse().join(''))
  return reverse + num

}

console.log(reverseNum(1325));
