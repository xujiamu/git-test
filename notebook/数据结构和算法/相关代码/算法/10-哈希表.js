function HashTable() {
  this.storage = []
  this.count = 0
  this.limit = 7
  HashTable.prototype.hashFunc = function (key,size) {
    let hashCode = ''
    for (let i=0; i<key.length; i++) {
      hashCode = 37 * hashCode + key.charCodeAt(i)
    }
    return hashCode % size
  }
  HashTable.prototype.put = function (key,value) {
    const index = this.hashFunc(key,this.limit)
    let bucket = this.storage[index]
    if (bucket === undefined) {
      bucket = []
      this.storage[index] = bucket
    }
    for (let i=0; i<bucket.length; i++) {
      const tuple = bucket[i]
      if (tuple[0] === key) {
        tuple[1] = value
        return
      }
    }
    bucket.push([key,value])
    this.count += 1

    if (this.count > this.limit * 0.75) {
      const newLimit = this.getPrimeNum(this.limit * 2)
      this.resize(newLimit)
    }
  }

  HashTable.prototype.get = function (key) {
    const index = this.hashFunc(key,this.limit)
    let bucket = this.storage[index]
    if (bucket === undefined) return null
    for (let i=0; i<bucket.length; i++) {
      const tuple = bucket[i]
      if (tuple[0] === key) {
        return tuple[1]
      }
    }
    return null
  }

  HashTable.prototype.remove = function (key) {
    const index = this.hashFunc(key,this.limit)
    let bucket = this.storage[index]
    if (bucket === undefined) return null
    for (let i=0; i<bucket.length; i++) {
      const tuple = bucket[i]
      if (tuple[0] === key) {
        bucket.splice(i,1)
        this.count -= 1

        if (this.limit >= 7 && this.count < this.limit * 0.25) {
          const newLimit = this.getPrimeNum(Math.floor(this.limit/2 ))
          this.resize(newLimit)
        }

        return tuple[1]
      }
    }
    return null
  }

  HashTable.prototype.isEntry = function(){
    return this.count === 0
  }

  HashTable.prototype.size = function() {
    return this.count
  }

  HashTable.prototype.resize = function (newLimit) {
    const oldStorage = this.storage
    this.storage = []
    this.count = 0
    this.limit = newLimit
    for (let i=0; i<oldStorage.length; i++) {
      let bucket = oldStorage[i]
      if (bucket === undefined) {
        continue
      }
      for (let j=0;j<bucket.length;j++) {
        let tuple = bucket[j]
        this.put(tuple[0],tuple[1])
      }
    }
  }

  HashTable.prototype.isPrimeNum = function (num) {
    const temp = Math.floor(Math.sqrt(num))
    for (let i=2; i<=temp; i++) {
      if (num % i === 0) {
        return false
      }
    }
    return true
  }

  HashTable.prototype.getPrimeNum = function (num) {
    while (!this.isPrimeNum(num)) {
      num++
    }
    return num
  }

}


const hashTable = new HashTable()
console.log(hashTable);
hashTable.put('abc',51)
hashTable.put('ac',61)
hashTable.put('cd',71)
hashTable.put('ae',91)
console.log(hashTable);
hashTable.remove('abc')
console.log(hashTable);
console.log(hashTable.count);
console.log(hashTable.get('ac'))
hashTable.put('b',45)
hashTable.put('f',598)
hashTable.put('c',98)
console.log(hashTable)
console.log(hashTable.count);
