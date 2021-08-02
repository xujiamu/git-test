'use strict'
function fibonacci(n, n1, n2) {
  if(n <= 1) {
    return n2
  }
  return fibonacci(n - 1, n2, n1 + n2)
}
console.log(fibonacci(5,1,1));

// function median(left,right,arr) {
//   const mid = Math.floor((left+right) / 2)
//   if (arr[left] > arr[right]) {
//     [arr[left],arr[right]]  = [arr[right],arr[left]]
//   }
//   if (arr[left] > arr[mid]) {
//     [arr[left],arr[mid]]  = [arr[mid],arr[left]]
//   }
//   if (arr[mid] > arr[right]) {
//     [arr[mid],arr[right]]  = [arr[right],arr[mid]]
//   }
//   [arr[mid],arr[right-1]] = [arr[right-1],arr[mid]]
//   return arr[right-1]
// }
//
// function quickSort(array) {
//   quick(0,array.length-1,array)
//   return array
// }
//
// function quick(left,right,arr) {
//   if (left >= right) return
//   const basic = median(left,right,arr)
//   let i = left
//   let j = right - 1
//   while (i < j) {
//     while (arr[++i] < basic) {}
//     while (arr[--j] > basic) {}
//     if (i < j) {
//       [arr[i],arr[j]] = [arr[j],arr[i]]
//     } else {
//       break
//     }
//   }
//   [arr[i],arr[right-1]] = [arr[right-1],arr[i]]
//   quick(left,i-1,arr)
//   quick(i+1,right,arr)
// }
// console.log(quickSort([24, 512,5,1,78]));
