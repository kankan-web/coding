import _ from 'lodash';
function component(){
  const element = document.createElement('div')
  const btn = document.createElement('button')
  //lodash
  element.innerHTML=_.join(['Hello','webpack'],'')

  btn.innerHTML='click me and check the console'
  element.appendChild(btn)
  return element
}
document.body.appendChild(component())