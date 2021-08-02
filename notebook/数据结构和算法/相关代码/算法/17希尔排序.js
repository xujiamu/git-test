function shellSort(arr) {
  //解构取出数组长度
  const {length} = arr
  //设定初始增量
  let gap = Math.floor(length / 2)
  //增量必须大于才可以进行下一步
  while(gap >= 1) {
    //从增量开始向后遍历元素
    for (let i=gap; i<length; i++) {
      //保存当前遍历元素的索引到j
      let j = i
      //保存当前元素索引对应的值到temp
      const temp = arr[i]
      //对处于对应增量的值进行比较排序
      // 注意这里的while循环条件必须写temp不能写arr[i] 因为arr[i]值会变化
      while (arr[j-gap] > temp && j > gap-1) {
        arr[j] = arr[j-gap]
        j -= gap
      }
      arr[j] = temp
    }
    //减少增量，重新开始新一轮遍历
    gap = Math.floor(gap / 2)
  }
  return arr
}

console.log(shellSort([23,512,61,621,4,12,5,6,89,81,81,4,6]));
