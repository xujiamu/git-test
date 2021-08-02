// function isPrimeNum(num) {
//   for (let i=2; i<num; i++) {
//     if (num % i === 0) {
//       return false
//     }
//   }
//   return true
// }
//
// console.log(isPrimeNum(35));
// console.log(isPrimeNum(17));
// console.log(isPrimeNum(21));
// console.log(isPrimeNum(23));


function isPrimeNum(num) {
  const temp = Math.floor(Math.sqrt(num))
  for (let i=2; i<=temp; i++) {
    if (num % i === 0) {
      return false
    }
  }
  return true
}

console.log(isPrimeNum(35));
console.log(isPrimeNum(17));
console.log(isPrimeNum(21));
console.log(isPrimeNum(23));

