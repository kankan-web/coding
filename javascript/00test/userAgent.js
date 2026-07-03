const android = 'Mozilla/5.0 (Linux; Android 15; V2419A Build/AP3A.240905.015.A1_V000L1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.260 Mobile Safari/537.36 BIGO-baiguoyuan (V2419A__bigolive__2.18.0-SNAPSHOT__android__15__1__460b23206749444ed5b616cc57b3772f__1000103149__66224__CN__2)'
const ios = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 BIGO-baiguoyuan (iPhone 14 Plus__bigolive__2.12.0__iOS__16.1__1__b3c7d37f5de696249f37c32e45339d6124c752f0__1000105259__8051__PH__4)'

const isBigolive = android.match(/(bigo-baiguoyuan).*(_bigolive_)/i)
const isBigolive2 = ios.match(/(bigo-baiguoyuan).*(_bigolive_)/i)

console.log('android', isBigolive)
console.log('ios', isBigolive2)