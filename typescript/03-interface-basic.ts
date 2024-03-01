interface Person {
  readonly id: number;
  name: string;
  age?: number;
}
let viking: Person = {
  id: 1,
  name: "kankan",
  age: 15, //可有可无
};
// viking.id=65//不可行
