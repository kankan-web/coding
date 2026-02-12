import { test, expect } from '@playwright/test';
import { WeChatScraper } from '../scraper/wechat-scraper';
import * as fs from 'fs/promises';
import * as path from 'path';

test.describe('微信公众号文章抓取器', () => {
  let scraper: WeChatScraper;

  test.beforeEach(async () => {
    scraper = new WeChatScraper('./output');
    await scraper.init();
  });

  test.afterEach(async () => {
    await scraper.close();
  });

  test('抓取示例文章并保存为 Markdown', async () => {
    const testUrl = 'https://mp.weixin.qq.com/s/rapjHoxkM81hpsaZNhxG5Q';

    // 执行抓取
    await scraper.scrapeArticle(testUrl);

    // 验证文章文件是否生成
    const articlesDir = path.resolve('./output/articles');
    const files = await fs.readdir(articlesDir);

    expect(files.length).toBeGreaterThan(0);

    // 读取生成的 Markdown 文件
    const mdFile = files.find(f => f.endsWith('.md'));
    expect(mdFile).toBeDefined();

    if (mdFile) {
      const content = await fs.readFile(
        path.join(articlesDir, mdFile),
        'utf-8'
      );

      // 验证 Markdown 内容
      expect(content).toContain('# '); // 包含标题
      expect(content).toContain('**作者**:'); // 包含作者信息
      expect(content).toContain('**发布时间**:'); // 包含发布时间

      console.log(`\n✓ 测试通过!生成的文件: ${mdFile}`);
      console.log(`✓ 文件大小: ${content.length} 字符\n`);
    }

    // 验证图片目录
    const imagesDir = path.resolve('./output/images');
    const imageFiles = await fs.readdir(imagesDir);

    console.log(`✓ 下载了 ${imageFiles.length} 张图片`);
    expect(imageFiles.length).toBeGreaterThan(0);
  });

  test('处理无效 URL', async () => {
    const invalidUrl = 'https://invalid-url.com';

    await expect(async () => {
      await scraper.scrapeArticle(invalidUrl);
    }).rejects.toThrow();
  });
});
