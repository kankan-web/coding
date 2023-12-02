import _ from 'lodash';
import './style.css';
import Icon from './icon.png'
function component(){
  const element = document.createElement('div')
  //lodash
  element.innerHTML=_.join(['Hello','webpack'],'')
  element.classList.add('hello')
  // 将图像添加到现有的div中
  const myIcon = new Image();
  myIcon.src=Icon
  element.appendChild(myIcon)
  return element
}
document.body.appendChild(component())