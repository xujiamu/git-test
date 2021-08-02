function Set() {
  this.items = {}
  Set.prototype.add = function (value) {
    if (this.has(value)) return false
    this.items[value]  = value
    return true
  }
  Set.prototype.has = function (value) {
    return this.items.hasOwnProperty(value)
  }
  Set.prototype.delete = function (value) {
    if (!this.has(value)) return false
    delete this.items[value]
    return true
  }
  Set.prototype.clear = function () {
    this.items = {}
  }
  Set.prototype.size = function () {
    return Object.keys(this.items).length
  }
  Set.prototype.values = function () {
    return Object.keys(this.items)
  }
  Set.prototype.union = function (otherSet) {
    const values =  this.values()
    let unionSet = new Set()
    for (item of values) {
      unionSet.add(item)
    }
    for (item of otherSet.values()) {
      unionSet.add(item)
    }
    return unionSet
  }
  Set.prototype.intersection = function (otherSet) {
    const values = this.values()
    let intersectionSet = new Set()
    for (item of values) {
      if (otherSet.has(item)) {
        intersectionSet.add(item)
      }
    }
    return intersectionSet
  }
  Set.prototype.difference = function (otherSet) {
    const values = this.values()
    let differenceSet = new Set()
    for (item of values) {
      if (!otherSet.has(item)) {
        differenceSet.add(item)
      }
    }
    return differenceSet
  }
  Set.prototype.subset = function (otherSet) {
    const values = this.values()
    let subset = new Set()
    for (item of values) {
      if (!otherSet.has(item)) {
        return false
      }
    }
    return true
  }
}
//
// let set = new Set()
// console.log(set.add('24'));
// console.log(set.add('36'));
// console.log(set.add('18'));
// console.log(set.add('24'));
// console.log(set.has('18'));
// console.log(set.has('17'));
// console.log(set.values());
// console.log(set.size());
// console.log(set.delete('24'))
// console.log(set.values());
// console.log(set.clear());
// console.log(set.size());

let set1 = new Set()
set1.add(24)
set1.add(15)
set1.add(38)
set1.add(99)
let set2 = new Set()
set2.add(12)
set2.add(24)
set2.add(88)
set2.add(15)
set2.add(38)
set2.add(99)
let unionSet = set1.union(set2)
console.log(unionSet.values());
let intersectionSet = set1.intersection(set2)
console.log(intersectionSet.values())
let differenceSet  = set1.difference(set2)
console.log(differenceSet.values())
let subset = set1.subset(set2)
console.log(subset);
