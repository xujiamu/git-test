// function get(url,callBack) {
//   const XML = new XMLHttpRequest()
//   XML.open('get',url,true)
//   XML.onreadystatechange = function () {
//     if (XML.readyState === 4) {
//       if (XML.status > 200 && XML.status < 300 || XML.status === 304) {
//         callBack(XML.responseText)
//       }
//     }
//   }
// }

//冒泡排序
/*function BubbleSort(arr) {
  const {length} = arr
  for (let i=0; i<length-1; i++) {
    for (let j=0; j<length-1-i;j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j],arr[j+1]] = [arr[j+1],arr[j]]
      }
    }
  }
  return arr
}
const arr = [4,61,71,16,25,31,6]
console.log(BubbleSort(arr));*/

//选择排序
/*function SelectedSort(arr) {
  const {length} = arr
  for (let i=0; i<length-1; i++) {
    let min = i
    for (let j=i+1; j<length; j++) {
      if (arr[min] > arr[j]) {
        min = j
      }
    }
    [arr[i],arr[min]] = [arr[min],arr[i]]
  }
  return arr
}
const arr = [4,61,71,16,25,31,6]
console.log(SelectedSort(arr));*/

//插入排序
/*function InsertedSort(arr) {
  const {length} = arr
  for (let i=1; i<length; i++) {
    let j = i
    let temp = arr[i]
    while (arr[j-1] > temp && j>0) {
      arr[j] = arr[j-1]
      j--
    }
    arr[j] =  temp
  }
  return arr
}
const arr = [4,61,71,16,25,31,6]
console.log(InsertedSort(arr));*/


/*

function test() {
  let a = 1
  function b() {
    return a
  }
  return b()
}
const a = test
console.log(typeof a);
*/

// for (var i=0; i<5; i++) {
//   setTimeout(function () {
//     console.log(i);
//   },1000)
// }
// console.log(i);

/*
let b = 1
function a() {
  while (b++<  2) {
    console.log(b);
    a()
  }
}

a()
console.log(b);
*/

/*let a = 5
function f() {
  let a
  console.log(a);

}
f()*/

/*function Car() {
  this.make = "Lamborghini";
  return { make: "Maserati" };
}

const myCar = new Car();
console.log(myCar);*/

/*const test = {a:1,b:2}
const {c,a} = test
console.log(c, a); //undefined 1

const test1 = [1,2]
const [h,r] = test1  //1 2
console.log(h, r);*/

/*let number = 10
const increasePassedNumber = number => number++;
const increaseNumber = () => number++;
console.log(increasePassedNumber(number));
console.log(number);
console.log(increaseNumber());
console.log(number);*/

function sum(...args) {
  console.log([...args]);
  console.log({...args});
  console.log(...args);
  console.log(args);
  return args.reduce((pre,current) => {
    return pre+current
  })
}

console.log(sum(1, 2, 3, 4, 5));  //15

console.log(...[12, 5, 61]);
