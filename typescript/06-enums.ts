enum Direction {
  Up,
  Down,
  Left,
  Right,
}
console.log(Direction.Up); //0
console.log(Direction[0]); //'Up'

enum Direction2 {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
const value = "UP";
if (value === Direction2.Up) {
  console.log("go up!");
}
