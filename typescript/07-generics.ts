//问题：失去类型的判断功能
function echo(arg: any): any {
  return arg;
}
const result: string = echo(123);
//要求：传入string类型，返回string类型
//传入number类型，返回number类型
function echo2<T>(arg: T): T {
  return arg;
}
const result2 = echo2(123);

function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}
const result3 = swap(["string", 123]);

function echoWidthArr<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}
const arrs = echoWidthArr([, 1, 2, 3]);

interface IWithLength {
  length: number;
}
function echoWidthArr2<T extends IWithLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}
const str1 = echoWidthArr2("str");
const obj = echoWidthArr2({ length: 10 });
const arr2 = echoWidthArr2([1, 2, 3]);

class Queue<T> {
  private data: T[] = [];
  push(item: T) {
    return this.data.push(item);
  }
  pop() {
    return this.data.shift();
  }
}
const queue = new Queue<number>();
// queue.push("1"); //会给报错提示
queue.push(1);
const poped = queue.pop();
if (poped) {
  poped.toFixed();
}
interface KeyPair<T, U> {
  key: T;
  value: U;
}
let kp1: KeyPair<number, string> = { key: 1, value: "str" };
let kp2: KeyPair<string, number> = { key: "str", value: 2 };

let arr: number[] = [1, 2, 3];
let arrTwo: Array<number> = [1, 2];
