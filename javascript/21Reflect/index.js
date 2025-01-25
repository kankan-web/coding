  const p1 = {
    lastName: '张',
    firstName: '三',
    
    get fullName() {
      return this.lastName + this.firstName
    }
  }

  const p2 = {
    lastName: '李',
    firstName: '四',
    
    get fullName() {
      return this.lastName + this.firstName
    }
  }

  console.log(p1.fullName) 
  console.log(Reflect.get(p1, 'fullName')) 
  
  console.log(Reflect.get(p1, 'fullName', p2)) 

  