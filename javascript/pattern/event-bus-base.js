class EventEmeitter {
  constructor() {
    this._events = this._events || new Map(); // 储存事件/回调键值对
    this._maxListeners = this._maxListeners || 10; // 设立监听上限
  }
}
/**
 * 实现了触发事件的emit方法和监听事件的addListener方法,至此我们就可以进行简单的实践了.
 * 当参数较少时使用call性能更高，
 * 当参数较多时使用apply性能更高
 */
// 触发名为type的事件
EventEmeitter.prototype.emit = function (type, ...args) {
  let handler;
  // 从储存事件键值对的this._events中获取对应事件回调函数
  handler = this._events.get(type);
  if (args.length > 0) {
    handler.apply(this, args);
  } else {
    handler.call(this);
  }
  return true;
};

// 监听名为type的事件
EventEmeitter.prototype.addListener = function (type, fn) {
  // 将type事件以及对应的fn函数放入this._events中储存
  if (!this._events.get(type)) {
    this._events.set(type, fn);
  }
};
// 实例化
const emitter = new EventEmeitter();

// 监听一个名为arson的事件对应一个回调函数,监听事件
emitter.addListener('arson', man => {
  console.log(`expel-${man}`);
});

// 我们触发arson事件,发现回调成功执行，触发事件
emitter.emit('arson', 'low-end'); // expel low-end
