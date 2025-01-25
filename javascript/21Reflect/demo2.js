  const p1 = {
    lastName: '张',
    firstName: '三',
    
    get fullName() {
      return this.lastName + this.firstName
    }
  }

  /**
   * 使用 Proxy 拦截对象的属性访问
   * 触发了fullName，在fullName中又触发了this.lastName + this.firstName
   * 按理来说：应该触发3次，可实际上只触发了一次
   */
  const proxy = new Proxy(p1, {    
    get(target, key, receiver) {
      console.log('触发了 getter');
      // return target[key]
      return Reflect.get(target, key, receiver)
    }
  })

  console.log(proxy.fullName);
