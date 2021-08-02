function median(left,right,arr) {
  let mid = Math.floor((left+right) / 2)
  if (arr[left] > arr[mid]) {
    [arr[left],arr[mid]] = [arr[mid],arr[left]]
  }
  if (arr[left] > arr[right]) {
    [arr[left],arr[right]] = [arr[right],arr[left]]
  }
  if (arr[mid] > arr[right]) {
    [arr[mid],arr[right]] = [arr[right],arr[mid]]
  }
  [arr[mid],arr[right-1]] = [arr[right-1],arr[mid]]
  return arr[right-1]
}


function quickSort(arr) {
  quick(0,arr.length-1,arr)
  return arr
}

function quick(left,right,arr) {
  //1.结束条件
  if (left >= right) return
  //2.获取基准值
  const basic = median(left,right,arr)
  //3.定义变量，用于记录当前找到的位置
  let i = left
  let j = right - 1
  //4.开始进行交换
  //这里只能设为i<j,为了避免i=j时进入循环 ，++i出现问题
  // 比如 1 5两个元素 这两个元素基准是1    ij 原本都在1处
  // 如果i再加1，底下的第五步操作，基准位置就会改变，那么最终的排序变为5,1
  while (i < j) {
    while (arr[++i] < basic) {}
    while (arr[--j] > basic) {}
    if (i < j) {
      [arr[i],arr[j]] = [arr[j],arr[i]]
    } else {
      break
    }
  }
  //5.将基准放在正确的i位置上
  [arr[i],arr[right-1]] = [arr[right-1],arr[i]]
  //6.分而治之
  quick(left, i-1,arr)
  quick(i+1, right,arr)
}


console.log(quickSort([24, 512,5,1,78]));

// function median(left,right,arr) {
//   let mid = Math.floor((left+right) / 2)
//   if (arr[left] > arr[mid]) {
//     [arr[left],arr[mid]] = [arr[mid],arr[left]]
//   }
//   if (arr[left] > arr[right]) {
//     [arr[left],arr[right]] = [arr[right],arr[left]]
//   }
//   if (arr[mid] > arr[right]) {
//     [arr[mid],arr[right]] = [arr[right],arr[mid]]
//   }
//   [arr[mid],arr[right-1]] = [arr[right-1],arr[mid]]
//   return arr[right]
// }
//
//
// function quickSort (array) {
//   const leftArr = [],rightArr = []
//   if (array.length < 2) return array
//   const basic = median(0,array.length-1,array)
//   for (let i=0; i<array.length-1;i++) {
//     array[i] >= basic && rightArr.push(array[i])
//     array[i] < basic && leftArr.push(array[i])
//   }
//   return quickSort(leftArr).concat(basic,quickSort(rightArr))
// }


