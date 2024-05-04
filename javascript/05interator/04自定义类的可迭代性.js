class Classroom{
  constructor(address,name,students){
    this.address = address;
    this.name = name;
    this.students = students;
  }
  entry(newStudent){
    this.students.push(newStudent)
  }
  [Symbol.iterator](){
    let index = 0
    return {
      next:()=>{
        if(index<this.students.length){
          return {
            done:false,
            value:this.students[index++]
          }
        }else{
          return {
            done:true,
            value:undefined
          }
        }
      },
      //提前终止时会触发return这个函数，告诉用户提前终止了
      return:()=>{
        console.log('停止了')
        return {done:true,value:undefined}
      }
    }
  }
}
const classroom=new Classroom('科技楼503','计算机教室',['张三','李四','王五']);
classroom.push('lilei')
for(const item of classroom){
  console.log(item)
}