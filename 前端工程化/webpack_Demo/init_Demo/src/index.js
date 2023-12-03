// function getComponenet(){
//   return import('lodash').then(({default:_})=>{
//     const element = document.createElement('div')
//     element.innerHTML=_.join(['Hello','webpack'],' ')
//     return element
//   })
//   .catch((error)=>'An error occurred while loading the component')
// }

// getComponenet().then((component)=>{
//   document.body.appendChild(component)
// })

async function getComponenet(){
  const element = document.createElement('div')
  const {default:_}=await import('lodash')
  element.innerHTML=_.join(['Hello','webpack'],' ')
  return element
}

getComponenet().then((component)=>{
  document.body.appendChild(component)
})