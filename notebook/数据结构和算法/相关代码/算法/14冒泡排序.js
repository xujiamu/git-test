function BubbleSort(arr) {
  //解构得到arr的length属性
  const {length} = arr
  //外层循环为比较轮数
  for (let i=0; i<length-1; i++) {
    //内层循环为比较次数 一次内循环结束，就会有一个大值排到后面
    // -i是避免对已经排序过的数字重复比较，减少比较次数，提高效率
    for (let j=0; j<length-1-i; j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j],arr[j+1]] = [arr[j+1],arr[j]]
      }
    }
  }
  return arr
}

console.log(BubbleSort([2, 5, 6, 7, 18, 3, 25, 8,9,17,23,1,125,65,61,37]));
