function hashFunc(str,size) {
  let hashCode = ''
  for (let i=0; i<str.length; i++) {
    hashCode = 37 * hashCode + str.charCodeAt(i)
  }
  return hashCode % size

}

console.log(hashFunc('abed', 7));
console.log(hashFunc('aed', 7));
console.log(hashFunc('ad', 7));
console.log(hashFunc('a', 7));
console.log(hashFunc('ed', 7));

