s = "A man, a plan, a canal: Panama"

var isPalindrome = function(s) {
    const newS = s.replace(/[^a-zA-Z0-9]/g, '')
    let left = 0
    let right = s.length-1
    while(left<right){
        if(newS[left]===newS[right]){
            left++
            right--
        }else{
            return false
        }
    }
    return true
};