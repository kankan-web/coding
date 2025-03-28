async function run() {
    console.log('1')
    await func()
    console.log('2')
}

async function func() {
    console.log('3')
}

setTimeout(function () {
    console.log('4')
})

new Promise( (resolve)=> {
    console.log('5')
    resolve()
})
    .then(function () {
    console.log('6')
})

run()
console.log('7')
//5
//1
//3
//7
//6
//2
//4
