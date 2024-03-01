let arrOfNumbers: number[] = [1, 2, 3];
arrOfNumbers.push(4);
function test() {
  console.log(arguments); //类数组
  // arguments.length//可行
  // arguments.push(1)//不可行
}

let user: [string, number] = ["viking", 20]; //只能这种格式
user.push(3); //可以打破固有格式
