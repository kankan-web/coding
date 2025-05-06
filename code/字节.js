/** @file 
 * CodingMan("Hank").sleep(10).eat("dinner") 
CodingMan("Hank").sleep(10).sleep(10).sleep(10)..eat("dinner") 
输出 
Hi! This is Hank! 
//等待10秒.. 
Wake up after 10 
Eat dinner~ 
CodingMan("Hank").eat("dinner").eat("supper") 
输出 
Hi This is Hank! 
Eat dinner~ 
Eat supper~ 
CodingMan("Hank").sleepFirst(5).eat("supper") 
输出 
//等待5秒 
Wake up after 5 
Hi This is Hank! 
Eat supper 
以此类推。
 * 
 */

class _CodingMan {
  constructor(name) {
    this.name = name;
    this.taskQueue = [];
    
    // 添加初始任务：打招呼
    const sayHi = async () => {
      console.log(`Hi! This is ${this.name}!`);
    };
    this.taskQueue.push(sayHi);

    // 在下一个事件循环开始执行任务队列
    Promise.resolve().then(() => this.run());
  }

  // 执行任务队列
  async run() {
    for (const task of this.taskQueue) {
      await task();
    }
  }

  sleep(seconds) {
    const sleepTask = () => new Promise(resolve => {
      console.log(`//等待${seconds}秒..`);
      setTimeout(() => {
        console.log(`Wake up after ${seconds}`);
        resolve();
      }, seconds * 1000);
    });
    this.taskQueue.push(sleepTask);
    return this;
  }

  eat(food) {
    const eatTask = async () => {
      console.log(`Eat ${food}~`);
    };
    this.taskQueue.push(eatTask);
    return this;
  }

  sleepFirst(seconds) {
    const sleepFirstTask = () => new Promise(resolve => {
      console.log(`//等待${seconds}秒..`);
      setTimeout(() => {
        console.log(`Wake up after ${seconds}`);
        resolve();
      }, seconds * 1000);
    });
    // 将任务添加到队列开头
    this.taskQueue.unshift(sleepFirstTask);
    return this;
  }
}

// 工厂函数
function CodingMan(name) {
  return new _CodingMan(name);
}

// 测试代码
CodingMan("Hank").sleep(3).eat("dinner");
// CodingMan("Hank").eat("dinner").eat("supper") 
// setTimeout(() => {
//   CodingMan("Hank").eat("dinner").eat("supper");
// }, 5000);
// setTimeout(() => {
//   CodingMan("Hank").sleepFirst(2).eat("supper");
// }, 10000);
