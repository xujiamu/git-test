function insertionSort(arr) {
  //解构取出数组长度
  const {length} = arr
  //遍历除第0个元素外的所有元素
  for (let i=1; i<length; i++) {
    //因为while循环需要从后向前比较，所以需要一个可变的索引值
    //保存当前遍历元素的索引到j
    let j = i
    //因为之后arr[i]得值可能发生改变
    //所以保存当前元素索引对应的值到temp
    const temp = arr[i]
    //将temp与它前面的已排序序列进行比较 如果符合大于temp 且j>0时
    while (arr[j-1] > temp && j>0) {
      //将前值赋予后值
      arr[j] = arr[j-1]
      //通过自减j的值，改变对比的值
      j--
    }
    //最后将temp中保存的值 赋予对应的空位
    arr[j] = temp
  }
  return arr
}

//第二种写法
function insertion_sort(arr) {
  const {length} = arr
  for (let i=1; i<length; i++){
    for (let j=0; j<i; j++) {
      if (arr[j] > arr[i] ) {
        arr.splice(j,0,arr[i])
        arr.splice(i+1,1)
        break
      }
    }
  }
  return arr
}


console.log(insertionSort([214,51,136,6,16,7,1]));
console.log(insertion_sort([214,51,136,6,16,7,1]));
