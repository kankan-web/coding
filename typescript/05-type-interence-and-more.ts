//type inference
let str = "str";

//union types
let numberOrString: number | string;
// numberOrString.toString()
// numberOrString.valueOf()

function getLength(input: number | string): number {
  const str = input as string;
  if (str.length) {
    return str.length;
  } else {
    const number = input as number;
    return number.toString().length;
  }
}
//type guard
function getLength2(input: string | number): number {
  if (typeof input === "string") {
    return input.length;
  } else {
    return input.toString().length;
  }
}
