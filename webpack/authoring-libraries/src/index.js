/**
 * 用于将数字 1 到 5 转换为文本表示，反之亦然，例如将 2 转换为 'two'
 */
import _ from 'lodash'
import numRef from './ref.json'
export function numToWord(num){
  return _.reduce(
    numRef,
    (accum,ref)=>{
      return ref.num===num?ref.word:accum
    }
  )
}
export function wordToNum(word){
  return _.reduce(
    numRef,
    (accum,ref)=>{
      return ref.word===word&&word.toLowerCase()?ref.num:accum
    }
  )
}