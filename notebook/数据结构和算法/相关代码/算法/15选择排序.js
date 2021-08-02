
function selectionSort(arr) {
  const {length} = arr
  //从0开始循环 一直循环到length-2的位置为止
  for (let i=0; i<length-1; i++) {
    //定义一个min用于记录最小的位置
    let min = i
    // i+1 是为了排除已经排序过得最小值
    for (let j= i+1; j<length; j++) {
      // 将其余位置进行依次比较，如果最小值发生变化则记录下来
      if (arr[min] > arr[j]) {
        min = j
      }
    }
    //将比较后的最小值与开头的位置i进行交换 之后继续循环
    [arr[i],arr[min]] = [arr[min],arr[i]]
  }
  return arr
}
console.log(selectionSort([25, 138, 6, 7, 16, 72, 82, 92]));
