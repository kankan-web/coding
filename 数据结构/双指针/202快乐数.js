var isHappy = function(n) {
    const seen = new Set();

    const getNext = (num) => {
        return num.toString().split('').reduce((acc, digit) => {
            return acc + Math.pow(parseInt(digit, 10), 2);
        }, 0);
    };

    while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        n = getNext(n);
    }

    return n === 1;
};

console.log('hallp', isHappy(19)); // 输出: true