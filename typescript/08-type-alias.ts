// type alias
let sum5: (x: number, y: number) => number;
sum5 = (x, y) => x + y;
const result4 = sum5(1, 2);
// const aaa = sum(1, 2);
type PlusType = (x: number, y: number) => number;
let sumValue: PlusType = (x, y) => x + y;
const result5 = sumValue(2, 3);

const str: "name" = "name";
const number: 1 = 1;
type Direction = "Up" | "Down" | "Left" | "Right";
let toWhere: Direction = "Left";

interface IName {
  name: string;
}
type IPerson = IName & { age: number };
let person: IPerson = { name: "123", age: 123 };
