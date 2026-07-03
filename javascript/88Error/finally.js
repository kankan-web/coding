function foo(){
  try{
    if(true){
      console.log("try code execute")
      return "foo function return value"
    }
    throw new Error("error message")
  } catch (err) {
    console.log("catch code execute", err)
  } finally {
    console.log("finally code execute")
  }
}

foo()