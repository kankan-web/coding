📝 微信公众号文章抓取器 - 使用指南

1️⃣ 基本使用:
npx tsx scraper/wechat-scraper.ts <文章URL>

2️⃣ 示例:
npx tsx scraper/wechat-scraper.ts https://mp.weixin.qq.com/s/rapjHoxkM81hpsaZNhxG5Q

3️⃣ 查看输出:

- Markdown 文件: output/articles/
- 下载的图片: output/images/

4️⃣ 运行测试:
pnpm exec playwright test tests/wechat-scraper.spec.ts

💡 提示:

- 浏览器会自动打开,可以看到抓取过程
- 如果想要无头模式,修改 wechat-scraper.ts 中的 headless: true
- 确保使用 Node 22: nvm use 22
