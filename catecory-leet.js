//  new
function newOperator(ctor){
    if(typeof ctor !== 'function'){
      throw 'newOperator function the first param must be a function';
    }
    newOperator.target = ctor;
    var newObj = Object.create(ctor.prototype);
    var argsArr = [].slice.call(arguments, 1);
    var ctorReturnResult = ctor.apply(newObj, argsArr);
    var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
    var isFunction = typeof ctorReturnResult === 'function';
    if(isObject || isFunction){
        return ctorReturnResult;
    }
    return newObj;
}
// bind
Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') throw TypeError('必须使用函数调用bind')
    var args = Array.prototype.slice.call(arguments, 1)
    var self = this, fNop = function() {},
        fBound = function() {
            return self.apply(this instanceof fNop ? this : oThis, 
                              args.concat(Array.prototype.slice.call(arguments)))
        }
    fNop.prototype = this.prototype
    fBound.prototype = new fNop()
    return fBound
}
// softBind
Function.prototype.softBind = function(oThis) {
    if (typeof this !== 'function') throw TypeError('必须使用函数调用softBind')
     var fn = this,
         args = Array.prototype.slice.call(arguments, 1),
         bound = function() {
             return fn.apply(!this || this === (window || global) ? oThis : this,
                            args.concat(Array.prototype.slice.call(arguments)))
         }
     bound.prototype = Object.create(fn.prototype)
     return bound
 }


 //! 数字
// 1.两数之和
var twoSum = function(nums, target) {
    const map = new Map()
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i])) {
            return [map.get(nums[i]), i]
        } else {
            map.set(target - nums[i], i)
        }
    }
};
/*  2.输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。
与第一道类似只不过他是有序的 ， 
*/

var twoSum = function(nums, target) {
    let l = 0, r = nums.length - 1;
    while(l < r){
        if(nums[l] + nums[r] === target) return [nums[l], nums[r]];
        else if (nums[l] + nums[r] > target) r--;
        else l++;
    }
    return null;
};
// 3.回文数 
var isPalindrome = function(x) {
    // 特殊情况：
    // 如上所述，当 x < 0 时，x 不是回文数。
    // 同样地，如果数字的最后一位是 0，为了使该数字为回文，
    // 则其第一位数字也应该是 0
    // 只有 0 满足这一属性
    if (x < 0 || (x % 10 === 0 && x !== 0)) {
        return false;
    }

    let revertedNumber = 0;
    while (x > revertedNumber) {
        revertedNumber = revertedNumber * 10 + x % 10;
        x = Math.floor(x / 10);
    }

    // 当数字长度为奇数时，我们可以通过 revertedNumber/10 去除处于中位的数字。
    // 例如，当输入为 12321 时，在 while 循环的末尾我们可以得到 x = 12，revertedNumber = 123，
    // 由于处于中位的数字不影响回文（它总是与自己相等），所以我们可以简单地将其去除。
    return x === revertedNumber || x === Math.floor(revertedNumber / 10);
};
// 4.罗马数字
var romanToInt = function(s) {
    const symbolValues = new Map();
    symbolValues.set('I', 1);
    symbolValues.set('V', 5);
    symbolValues.set('X', 10);
    symbolValues.set('L', 50);
    symbolValues.set('C', 100);
    symbolValues.set('D', 500);
    symbolValues.set('M', 1000);  
    let ans = 0;
    const n = s.length;
    for (let i = 0; i < n; ++i) {
        const value = symbolValues.get(s[i]);
        if (i < n - 1 && value < symbolValues.get(s[i + 1])) {
            ans -= value;
        } else {
            ans += value;
        }
    }
    return ans;
};
/* 
5.x的平方根
*/
var mySqrt = function (x) {
    // 整数x的平方根一定是在1到x的范围内
    let left = 1,
      right = x;
    while (left <= right) {
      // 中间值  下面这样写是防止溢出
      let mid = left + ((right - left) >> 1);
      // 判断mid的平方是否小于或等于x，如果mid的平方小于x
      if (mid <= x / mid) {
        // 判断(mid+1)的平方是否大于x，如果(mid+1)的平方大于x，那么mid就是x的平方根
        if (mid + 1 > x / (mid + 1)) {
          return mid;
        }
        // 如果mid的平方小于x并且(mid+1)的平方小于x，那么x的平方根比mid大，接下来搜索从mid+1到x的范围
        left = mid + 1;
      } else {
        // 如果mid的平方大于x，则x的平方根小于mid，接下来搜索1到mid-1的范围
        right = mid - 1;
      }
    }
    // 如果输入参数是0，left等于1而right等于0，就直接返回0
    return 0;
  };


/* 6.二进制中1的个数 
n & (n−1)，其预算结果恰为把 nn 的二进制位中的最低位的 11 变为 00 之后的结果。
*/
var hammingWeight = function(n) {
    let ret = 0;
    while (n) {
        n &= n - 1;
        ret++;
    }
    return ret;
};


/* 
7.打印从1到最大的n位数
比如输入 3，则打印出 1、2、3 一直到最大的 3 位数 999。
*/
var printNumbers = function(n) {
    let result = [];
    const dfs = (str, len) => {
        // 到达指定长度，返回
        if(str.length === len) {
            return result.push(str * 1);
        }

        for(let i = 0; i <= 9; i++) {
            // 例如 1，加 0 以后变成 10，然后继续 dfs ，然后撤销变成 1，方便下次变成 11 ，再下次变成 12，一直递归 + 回溯，深度优先搜索下去直到等于 len
            str += i;
            dfs(str, len);
            str = str.substring(0, str.length - 1);
        }

    }

    // 外层 i 控制长度，即 11 是两位，111 是三位     内层 j 控制该字符串第一位是什么，即首位
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j <= 9; j++)
            dfs(j.toString(), i);
    }

    return result;
};


  /* 
 8. 输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）
  */
 var findContinuousSequence = function(target) {
    let l=1
    let r=2
    let sum = 3
    let res=[]
    // 滑动窗口框架
    while(l<r){
        if(sum===target){
            let ans =[]
            for(let k=l;k<=r;k++){
                ans[k-l]=k
            }
            res.push(ans)
            // 等于的情况 我们可以继续窗口往右搜索 同时缩小左边的
             sum=sum-l
             l++
        } else if(sum>target){
            // 大于的条件 缩小窗口 sum已经加过了
            sum=sum-l
            l++
        } else {
            // 小于的情况 滑动窗口继续扩大
            r++
            sum=sum+r
        }
    }
    return res
};

    /* 
   9.爬楼梯 = 青蛙跳台阶
  假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
  */
var climbStairs = function(n) {
    const dp = [];
    dp[0] = 1;
    dp[1] = 1;
    for(let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
};
var climbStairs = function(n) {
    let p = 0, q = 0, r = 1;
    for (let i = 1; i <= n; ++i) {
        p = q;
        q = r;
        r = p + q;
    }
    return r;
};
 /* 
  10.股票买卖问题
 输入：[7,1,5,3,6,4]
输出：5  最大利润 = 6-1 = 5
 */
var maxProfit = function(prices) {
    let min = Infinity,
        money = 0
    for (let i = 0; i < prices.length; i++) {
        min = Math.min(min, prices[i])
        money = Math.max(money, prices[i] - min)
    }
    return money
};


/* 11.扑克牌中的顺子 即这n张牌是不是连续的 
说明5张牌里最大值和最小值的差必须不能大于等于5，因为5张牌得连着，假如说(1, 2, 3, 4, 6)，少了一张5，连不上，因为差值已经高达5了
说明不能有重复牌，因为5张牌如果有比如一张重复的，这个顺子的长度只能是4，而不是题目要求的5
大小王由于可以看成任何数字，所以上面这两个条件都可以不用遵从
*/

var isStraight = function(nums) {
    let map = new Map(), i, len = nums.length, max = 0, min = 14;
    for(i = 0; i < len; i++) {
        // 如果是大小王，可以当做赖子，直接跳过就行
        if(nums[i] === 0) continue;
        // 如果有重复，不可能连成对
        if(map.has(nums[i]))
            return false;
        map.set(nums[i], 1);
        max = Math.max(max, nums[i]);
        min = Math.min(min, nums[i]);
    }
    return max - min < 5;
};


/* 
12. 圆圈中最后剩下的数字
0,1,···,n-1这n个数字排成一个圆圈，
从数字0开始，每次从这个圆圈里删除第m个数字（删除后从下一个数字开始计数）。
求出这个圆圈里剩下的最后一个数字。
*/
var lastRemaining = function (n, m) {
    // base case 最终活下来那个人的初始位置 当i为1时，当然是索引0啦
    let pos = 0;
    for (let i = 2; i <= n; i++) {
      pos = (pos + m) % i;
    }
    return pos;
  };


  /* 
13. 不用加减乘除做加法
*/
var add = function (a, b) {
    let sum, carry;
    do {
      // 第一步  相加不考虑进位
      sum = a ^ b;
      // 第二步  进位
      carry = (a & b) << 1;
      // 第三步 把前两步的结果相加
      a = sum;
      b = carry;
    } while (b != 0);
    return a;
  };

//! 字符串 
// 1.最长公共前缀
var longestCommonPrefix = function (strs) {
    if (!strs.length) return ''
    let res = strs[0]
    for (ch of strs) {
        for (let i = 0; i < res.length; i++) {
            if (ch[i] !== res[i]) {
                res = res.slice(0, i)
                break
            }
        }
    }
    return res
};
// 2.有效的括号
var isValid = function(s) {
    const n = s.length;
    if (n % 2 === 1) {
        return false;
    }
    const pairs = new Map([
        [')', '('],
        [']', '['],
        ['}', '{']
    ]);
    const stk = [];
    for (let ch of s){
        if (pairs.has(ch)) {
            if (!stk.length || stk[stk.length - 1] !== pairs.get(ch)) {
                return false;
            }
            stk.pop();
        } 
        else {
            stk.push(ch);
        }
    };
    return !stk.length;
};
// 3.实现字符串indexOf

var strStr = function(haystack, needle) {
    const n = haystack.length, m = needle.length;
    for (let i = 0; i + m <= n; i++) {
        let flag = true;
        for (let j = 0; j < m; j++) {
            if (haystack[i + j] != needle[j]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            return i;
        }
    }
    return -1;
};

/* 4.最后一个单词的长度 也就是最后一个空格后面的词*/

var lengthOfLastWord = function(s) {
    let index = s.length - 1;
    while (s[index] === ' ') {
        index--;
    }
    let wordLength = 0;
    while (index >= 0 && s[index] !== ' ') {
        wordLength++;
        index--;
    }
    return wordLength;
};

/* 
5.给你两个二进制字符串，返回它们的和（用二进制表示）。 
*/
var addBinary = function(a, b) {
    let ans = "";
    let ca = 0;
    for(let i = a.length - 1, j = b.length - 1;i >= 0 || j >= 0; i--, j--) {
        let sum = ca;
        sum += i >= 0 ? parseInt(a[i]) : 0;
        sum += j >= 0 ? parseInt(b[j]) : 0;
        ans += sum % 2;
        ca = Math.floor(sum / 2);
    }
    if (ca === 1) {
        ans += 1
    }
    return ans.split('').reverse().join('');
};

/* 6. 判断回文，只考虑字母和数字

非字母和数字部分排除出去
忽略大小写
空字符串算回文
*/

var isPalindrome = function(s) {
    let a=s.toLocaleLowerCase().match(/[a-z0-9]+/g);
    if(!a) return true
     let str=a.join('')
    // 双指针
    let left=0;
    let right=str.length-1
    while(left<right){
        if(str[left]===str[right]){
            left++
            right--
        } else {
            return false
        }
    }
    return true
 };


 
/* 7.无重复字符的最长子串  滑动窗口， 不重复不动左指针*/
var lengthOfLongestSubstring = function(s) {
    let set = new Set(),
        max = 0, // 默认为0,可能是空串
        left = 0,
        right = -1
    for (left; left < s.length; left++) {
        if (left !== 0) {
            set.delete(s[left - 1]) // 删除左起点前一位的字符
        }
        while(right + 1 < s.length && !set.has(s[right + 1])) {
            set.add(s[right + 1])
            right++ // 因为只要进入循环，就一定会执行一次right++ ，所以需要right + 1作为条件判断,因为right默认值为-1
        }
        max = Math.max(max, right - left + 1)
    }
    return max
        
};

/*  8. 最长回文子串 中心扩展法 */
var longestPalindrome = function(s) {
    if (s.length <= 0) {
        return ''
    }
    let max = 0, str = ''
    for (let i = 0; i < s.length; i++) {
        let one = center(i, i, s)
        let two = center(i, i + 1, s)
        if (max <= Math.max(one, two)) {
            max = Math.max(one, two)
            str = s.slice(i - Math.floor((max -1) / 2), i + Math.floor(max  / 2) + 1)
        }
        
    }
    return str
};
var center = function (left, right, s) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        --left
        ++right
    }
    return right - left - 1
}

/* 
 9. 请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
*/
var replaceSpace = function(s) {
    s = s.split("");
    let oldLen = s.length;
    let spaceCount = 0;
    for (let i = 0; i < oldLen; i++) {
        if (s[i] === ' ') spaceCount++;
    }
    s.length += spaceCount * 2;
    for (let i = oldLen - 1, j = s.length - 1; i >= 0; i--, j--) {
        if (s[i] !== ' ') s[j] = s[i];
        else {
            s[j - 2] = '%';
            s[j - 1] = '2';
            s[j] = '0';
            j -= 2;
        }
    }
    return s.join('');
};


/* 10. 第一个只出现一次的字符 或者 通过 indexOf 查找两次*/
var firstUniqChar = function (s) {
    // 这次我们利用有序哈希表的方式 这里value存的是只有出现次数为1的时候才会为true
    let map = new Map();
    for (let c of s) {
      // 没有的话就存的是true  有了存的就是false
      map.set(c, !map.has(c));
    }
    // 如果s很多的话  那么 利用有序哈希表的性质更快一些
    for (let [key, val] of map.entries()) {
      if (val) return key;
    }
    return " ";
  };
 

/* 11. 翻转单词顺序 
例如输入字符串"I am a student. "，则输出"student. a am I"
原生api
*/
var reverseWords = function(s) {
    return s.trim().split(/\s+/).reverse().join(' ');
};

/* 12. 左旋转字符串  "abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"。 */
const reverseLeftWords = (s, k) => {
    const len = s.length;
    const n = k % len;
    const double = `${s}${s}`;
    return double.slice(n, n + len);
};


//! 链表
// 1.合并两个有序链表
var mergeTwoLists = function(l1, l2) {
    const prehead = new ListNode(-1);

    let prev = prehead;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            prev.next = l1;
            l1 = l1.next;
        } else {
            prev.next = l2;
            l2 = l2.next;
        }
        prev = prev.next;
    }

    // 合并后 l1 和 l2 最多只有一个还未被合并完，我们直接将链表末尾指向未合并完的链表即可
    prev.next = l1 === null ? l2 : l1;

    return prehead.next;
};
/* 
 2.删除链表中的重复元素
*/

var deleteDuplicates = function(head) {
    if (!head) {
        return head;
    }

    let cur = head;
    while (cur.next) {
        if (cur.val === cur.next.val) {
            cur.next = cur.next.next;
        } else {
            cur = cur.next;
        }
    }
    return head;
};

/* 3. 链表 两数之和 */
var addTwoNumbers = function(l1, l2) {
    let next = 0,
        move = ret = new ListNode(),
        sum, l1Val, l2Val
    while(l1 || l2) {
        l1Val = l1 ? l1.val : 0
        l2Val = l2 ? l2.val : 0
        sum  = l1Val + l2Val + next
        move.val = sum % 10
        next = Math.floor(sum / 10)
        l1 = l1 ? l1.next : l1
        l2 = l2 ? l2.next : l2
        if (l1 || l2) {
         move.next = new ListNode()
         move = move.next
        }
   
    }
    if (next) move.next = new ListNode(next)
    return ret
};

/*
4.  从尾到头打印链表 输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回， unshift）。
  */

/*  5. 链表倒数第k个节点*/
// 双指针
/* 先让快指针移动k步，慢指针是快指针的倒数第k个节点
循环到快指针到链表尾部，则慢指针是链表的倒数第k个节点
返回慢指针即是结果 */
var getKthFromEnd = function(head, k) {
    if(head == null) return head
    let slow = head;
    let fast = head;
    while(k-- > 0) {
        if(fast == null) {
            return null
        }
        fast = fast.next
    }

    while(fast != null) {
        fast = fast.next
        slow = slow.next
    }
    return slow
};


/* 
 6. 删除链表节点 remove 方法
*/
var deleteNode = function(head, val) {
    if(!head) return head;

    let newHead = new ListNode(0, head), p = newHead;
    while(p.next) {
        if(p.next.val === val) {
            // 删除后直接返回就行了，减少点时间
            p.next = p.next.next;
            return newHead.next;
        }
        p = p.next;
    }
    return null;
};

/* 
 7. 反转链表
*/
var reverseList = function(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
};


  /* 8. 两个链表的第一个公共节点 */
  var getIntersectionNode = function(headA, headB) {
    if (headA === null || headB === null) {
        return null;
    }
    let pA = headA, pB = headB;
    while (pA !== pB) {
        pA = pA === null ? headB : pA.next;
        pB = pB === null ? headA : pB.next;
    }
    return pA;
};


//! 数组
// 1. 删除 有序 数组中的重复项， 要求原地删除， 返回最终不重复的位置
var removeDuplicates = function(nums) {
    const n = nums.length;
    if (n === 0) {
        return 0;
    }
    let fast = 1, slow = 1;
    while (fast < n) {
        if (nums[fast] !== nums[fast - 1]) {
            nums[slow] = nums[fast];
            ++slow;
        }
        ++fast;
    }
    return slow;
};
// 2. 删除指定元素，输出去掉指定元素后的数组位置 ：无序所以从两边开始

var removeElement = function(nums, val) {
    let left = 0, right = nums.length;
    while (left < right) {
        if (nums[left] === val) {
            nums[left] = nums[right - 1];
            right--;
        } else {
            left++;
        }
    }
    return left;
};

/* 
3. 搜索插入位置
给定一个排序数组和一个目标值，在数组中找到目标值，
并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。 

使用二分查找
*/
var searchInsert = function (nums, target) {
    if (nums == null || !nums.length) {
      return -1;
    }
    // 左闭右闭区间
    let begin = 0,
      end = nums.length-1;
    while (begin <= end) {
      // 下面这样写是考虑大数情况下避免溢出
      let mid = begin + ((end - begin) >> 1);
      if (nums[mid] > target) {
        // 在左半区间中查找
        end = mid - 1;
      } else if (nums[mid] < target) {
        // 在右半区间中查找
        begin = mid + 1;
      } else {
        // 正好就是
        return mid;
      }
    }
    // 查找的是左边界，所以返回begin
    return begin;
  };


  /* 4. 最大子数组和
给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和

*/
var maxSubArray = function(nums) {
    let pre = 0, maxAns = nums[0];
    nums.forEach((x) => {
        pre = Math.max(pre + x, x);
        maxAns = Math.max(maxAns, pre);
    });
    return maxAns;
};


/* 
5.  加1
给定一个由 整数 组成的 非空 数组所表示的非负整数，在该数的基础上加一。
*/

var plusOne = function(digits) {
    const len = digits.length;
    for(let i = len - 1; i >= 0; i--) {
        digits[i]++;
        digits[i] %= 10;
        if(digits[i]!=0)
            return digits;
    }
    digits.splice(0, 0, 1)
    return digits;
};


/* 
6. 合并两个有序数组 arr[包括0]
 */
var merge = function(nums1, m, nums2, n) {
    let i = nums1.length - 1
     m--
     n--
     while (n >= 0) {
         while (m >= 0 && nums1[m] > nums2[n]) {
             nums1[i--] = nums1[m--]
         }
         nums1[i--] = nums2[n--]
     }
 };


  /* 
 7. 请找出数组中任意一个重复的数字。
 */
 var findRepeatNumber = function(nums) {
    const set = new Set()
    for (let num of nums) {
        if (set.has(num)) {
            return num
        }
        set.add(num)
    }
};

/* 
8. 旋转数组的最小数字

*/
var minArray = function(numbers) {
    let low = 0;
    let high = numbers.length - 1;
    while (low < high) {
        const pivot = low + Math.floor((high - low) / 2);
        if (numbers[pivot] < numbers[high]) {
            high = pivot;
        } else if (numbers[pivot] > numbers[high]) {
            low = pivot + 1;
        } else {
            high -= 1;
        }
    }
    return numbers[low];
};


/* 
9. 调整数组顺序使奇数位于偶数前面
*/
var exchange = function(nums) {
    const res = []
    for(const num of nums) {
      // 偶数的话，push()
      if(num % 2 == 0) {
        res.push(num)
      } else {
      // 奇数的话unshift()
      res.unshift(num)
      }
    }
    return res
  };
  // 或者

  var exchange = function(nums) {
    let i, j, temp;
    for(i = 0, j = nums.length - 1; i < j; i++, j--) {
        // i 循环找到偶数为止，因为要把偶数换到后面去
        while(i < j && nums[i] % 2 !== 0)
            i++;
        // j 循环找到奇数为止，因为要把奇数换到前面去
        while(i < j && nums[j] % 2 === 0)
            j--;
        temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
    return nums;
};


/*  10. 数组中出现次数超过一半的数字 也叫 多数元素 */
var majorityElement = function(nums) {
    let ans = 0, count = 0;
    for(let i = 0; i < nums.length; i++){
        if(!count) {
            ans = nums[i];
            count++;
        }else {
            if (nums[i] === ans) {
                count += 1
            } else {
                count += -1
            }
        }
    }
    return ans;
};


/* 11. 输入整数数组 arr ，找出其中最小的 k 个数  */
function quickSort(arr) {
    return quick(arr, 0, arr.length - 1)
    // 这里在用 arr.slice返回
}
function quick(arr, left, right) {
    if (arr.length > 1) {
        const index = partition(arr, left, right)
        if (index - 1 > left) {
            quick(arr, left, index - 1)
        }
        if (index < right) {
            quick(arr, index, right)
        }
    }
    return arr
}
function partition(arr, left, right) {
    const pivod = arr[Math.floor((left + right) / 2)]
    let i = left, j = right
    while (i <= j) {
        while (arr[i] < pivod) {
            i++
        }
        while (arr[j] > pivod) {
            j--
        }
        if (i <= j) {
            [arr[i], arr[j]] = [arr[j], arr[i]]
            i++
            j--
        }
    }
    return i
}

/* 
 12. 顺时针打印矩阵  时间复杂度：O(mn)O(mn)  空间复杂度：O(1)O(1)
*/

var spiralOrder = function(matrix) {
    if (!matrix.length || !matrix[0].length) {
        return [];
    }

    const rows = matrix.length, columns = matrix[0].length;
    const order = [];
    let left = 0, right = columns - 1, top = 0, bottom = rows - 1;
    while (left <= right && top <= bottom) {
        for (let column = left; column <= right; column++) {
            order.push(matrix[top][column]);
        }
        for (let row = top + 1; row <= bottom; row++) {
            order.push(matrix[row][right]);
        }
        if (left < right && top < bottom) {
            for (let column = right - 1; column > left; column--) {
                order.push(matrix[bottom][column]);
            }
            for (let row = bottom; row > top; row--) {
                order.push(matrix[row][left]);
            }
        }
        [left, right, top, bottom] = [left + 1, right - 1, top + 1, bottom - 1];
    }
    return order;
};


/*  13. 统计一个数字在排序数组中出现的次数。
等同
排序数组中查找元素的第一个和最后一个位置， 仅返回值不同

通过二分查找
寻找leftIdx 即为在数组中寻找第一个大于等于target 的下标，
寻找 rightIdx 即为在数组中寻找第一个大于 target 的下标

*/
const binarySearch = (nums, target, lower) => {
    let left = 0, right = nums.length - 1, ans = nums.length;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] > target || (lower && nums[mid] >= target)) {
            right = mid - 1;
            ans = mid;
        } else {
            left = mid + 1;
        }
    }
    return ans;
}

var search = function(nums, target) {
    let ans = 0;
    const leftIdx = binarySearch(nums, target, true);
    const rightIdx = binarySearch(nums, target, false) - 1;
    if (leftIdx <= rightIdx && rightIdx < nums.length && nums[leftIdx] === target && nums[rightIdx] === target) {
        ans = rightIdx - leftIdx + 1;
    } 
    return ans;
};



 // ! 树
  /*1.  相同的树 */
  var isSameTree = function(p, q) {
    if(p == null && q == null) 
        return true;
    if(p == null || q == null) 
        return false;
    if(p.val != q.val) 
        return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};
/* 
 2. 二叉树的镜像 也叫 反转二叉树
*/
var mirrorTree = function(root) {
    if (root === null) {
        return null;
    }
    const left = mirrorTree(root.left);
    const right = mirrorTree(root.right);
    root.left = right;
    root.right = left;
    return root;
};
/* 
3. 判断是不是对称的二叉树 它们的两个根结点具有相同的值  每个树的右子树都与另一个树的左子树镜像对称
*/
const check = (p, q) => {
    if (!p && !q) return true;
    if (!p || !q) return false;
    return p.val === q.val && check(p.left, q.right) && check(p.right, q.left);
}
var isSymmetric = function(root){
    return check(root, root);
};

/* 4 . 从上到下，从左到右打印二叉树  广度优先遍历*/
// return [3,9,20,15,7] 形式
var levelOrder = root => {
    if (!root) return [];
    // 创建队列，并将根节点入队
    const queue = [root];
    const res = [];
    while (queue.length) {
        // 获取根节点，根节点出队
        const n = queue.shift();
        // 访问队头
        res.push(n.val);
        // 队头的子节点依次入队
        n.left && queue.push(n.left);
        n.right && queue.push(n.right);
    }
    return res;
};

// 5. 打印二叉树每层打印一行： 下一层是上面所有层数 + 1 [[],[],[]] 形式
var levelOrder = function(root) {
    const ret = [];
    if (!root) {
        return ret;
    }

    const q = [];
    q.push(root);
    while (q.length !== 0) {
        const currentLevelSize = q.length;
        ret.push([]);
        for (let i = 1; i <= currentLevelSize; ++i) {
            const node = q.shift();
            ret[ret.length - 1].push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
    }
        
    return ret;
};


/* 
 6. 二叉搜索树的第K大节点 ，二叉树中序
[5,3,6,2,4,null,null,1], k = 3
*/
var kthLargest = function (root, k) {
    let node;
    if (!root) return node;
    const dfs = (root) => {
      if (!root) return null;
      // 正常是左中右， 为了方便倒着计数，所以 右中左
      dfs(root.right);
      k--;
      if (!k) return (node = root.val);
      dfs(root.left);
    };
    dfs(root);
    return node;
  };


/*   7. 二叉树的最大深度 getHegiht */
var maxDepth = function (root) {
    // 定义：输入一个节点，返回以该节点为根的二叉树的最大深度
    if (root == null) return 0; //  在数据结构中这里写的-1
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};
/*8. 是否是平衡二叉树 getBalanceFactor  它的结果判断是否大于2 */


  /* 
   9. 二叉搜索树的最近公共祖先
  */
  var lowestCommonAncestor = function (root, p, q) {
    if (root == null) return null;
    if (p.val > q.val) {
      // 保证 p.val <= q.val，便于后续情况讨论
      return lowestCommonAncestor(root, q, p);
    }
    if (root.val >= p.val && root.val <= q.val) {
      // p <= root <= q，也就是说 p 和 q 分别在 root 的左右子树，那么 root 就是 LCA
      return root;
    }
    if (root.val > q.val) {
      // p 和 q 都在 root 的左子树，那么 LCA 在左子树\
      return lowestCommonAncestor(root.left, p, q);
    }
    if (root.val < p.val) {
      // p 和 q 都在 root 的右子树，那么 LCA 在右子树
      return lowestCommonAncestor(root.right, p, q);
    }
  };
  

    /* 
  10. 二叉树的最近公共祖先 不是搜索树， 没有顺序
  */
var lowestCommonAncestor = function (root, p, q) {
    // 遇到null，返回null 没有LCA
    if (root == null) return null;
  
    // 遇到p或q，直接返回当前节点
    if (root == q || root == p) return root;
  
    // 非null 非q 非p，则递归左右子树
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    // 根据递归的结果，决定谁是LCA
    if (left && right) return root;
    if (left == null && right == null) return null;
    return left == null ? right : left;
  };
  


// ! 栈
/* 
 1. 用两个栈实现队列
*/

var CQueue = function() {
    this.inStack = [];
    this.outStack = [];
};

CQueue.prototype.appendTail = function(value) {
    this.inStack.push(value);
};

CQueue.prototype.deleteHead = function() {
    if (!this.outStack.length) {
        if (!this.inStack.length) {
            return -1;
        }
        this.in2out();
    }
    return this.outStack.pop();
};

CQueue.prototype.in2out = function() {
    while (this.inStack.length) {
        this.outStack.push(this.inStack.pop());
    }
};

/*2.  包含min函数的栈

 */
var MinStack = function() {
    this.x_stack = [];
    this.min_stack = [Infinity];
};

MinStack.prototype.push = function(x) {
    this.x_stack.push(x);
    this.min_stack.push(Math.min(this.min_stack[this.min_stack.length - 1], x));
};

MinStack.prototype.pop = function() {
    this.x_stack.pop();
    this.min_stack.pop();
};

MinStack.prototype.top = function() {
    return this.x_stack[this.x_stack.length - 1];
};

MinStack.prototype.min = function() {
    return this.min_stack[this.min_stack.length - 1];
};