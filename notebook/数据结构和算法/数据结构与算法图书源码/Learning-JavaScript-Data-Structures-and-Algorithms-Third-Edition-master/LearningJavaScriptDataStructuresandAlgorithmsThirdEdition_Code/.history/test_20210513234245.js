// 定义一个可以将指定值转为字符串的函数
function defaultToStr (target) {
    if (target === null) {
        return 'Null'
    }
    if (target === undefined) {
        return 'Undefined'
    }
    if (typeof target === 'object') {
        return JSON.stringify(target)
    }
    return target.toString()
}
// 定义单个节点
class ValuePair {
    constructor(key,val) {
        this.key = key
        this.val = val
    }
    toString() {
        return `#[${this.key}: ${this.val}]`
    }
}
class HashTable {
    constructor(toStrFn = defaultToStr) {
        // 这里使用对象保存哈希表
        this.table = {}
        this.toStrFn = toStrFn
    }
    // 定义具体哈希函数
    loseloseHashCode(key) {
        // 如果是数字，直接返回
        if (typeof key === 'number') {
            return key
        }
        let strKey = this.toStrFn(key), hashKey = 0
        for (let i = 0; i < strKey.length; i++) {
            hashKey += strKey.charCodeAt(i)
        }
        return hashKey % 37
    }
    // 通用hash函数，用于调用指定hasn
    hashCode(key) {
        return this.loseloseHashCode(key)
    }
    // 将数据存入哈希表
    put(key, value) {
        if (key !== null && value !== null) {
            let hashkey = this.hashCode(key)
            this.table[hashkey] = new ValuePair(key, value)
            return true
        }
        return false
    }
    // 查看指定数据
    get(key) {
        let hashkey = this.hashCode(key)
        return this.table[hashkey] ? this.table[hashkey].val : undefined
    }
    // 删除指定数据
    remove(key) {
        const hashkey = this.hashCode(key)
        const valuePair = this.table[hashkey]
        if (valuePair) {
	        delete this.table[hashkey]
            return true
        }
        return false
    }
    // 返回完整哈希表
    getTable() {
        return  this.table
    }
    // 判断哈希表是否为空
    isEmpty() {
        return this.size() === 0
    }
    // 查询保存键值对个数
    size() {
        return Object.keys(this.table).length
    }
    // 清空哈希表
    clear() {
        this.table = {}
    }
    // 转换字符串
    toString() {
        if (this.isEmpty()) {
            return ''
        }
        let str = ''
        Object.keys(this.table).forEach(hashKey => {
            str += `${hasKey} --${this.table[hashKey].toString()}`
        })
        return str
    }
}


const hash = new HashTable();

console.log(hash.hashCode('Gandalf') + ' - Gandalf');
console.log(hash.hashCode('John') + ' - John');
console.log(hash.hashCode('Tyrion') + ' - Tyrion');

hash.put('Ygritte', 'ygritte@email.com');
hash.put('Jonathan', 'jonathan@email.com');
hash.put('Jamie', 'jamie@email.com');
hash.put('Jack', 'jack@email.com');
hash.put('Jasmine', 'jasmine@email.com');
hash.put('Jake', 'jake@email.com');
hash.put('Nathan', 'nathan@email.com');
hash.put('Athelstan', 'athelstan@email.com');
hash.put('Sue', 'sue@email.com');
hash.put('Aethelwulf', 'aethelwulf@email.com');
hash.put('Sargeras', 'sargeras@email.com');
console.log(hash.getTable());
console.log('----');
console.log(hash.toString());