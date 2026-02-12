import { chromium, type Browser, type Page } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import { MarkdownConverter } from './markdown-converter';
import {
  sanitizeFilename,
  ensureDir,
  downloadImage,
  generateImageFilename,
  scrollToBottom,
} from './utils';

/**
 * 文章数据接口
 */
interface ArticleData {
  title: string;
  author: string;
  publishTime: string;
  content: string;
  images: Map<string, string>; // 原始URL -> 本地文件名
}

/**
 * 微信公众号文章抓取器
 */
export class WeChatScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private converter: MarkdownConverter;
  private outputDir: string;
  private imagesDir: string;
  private currentArticleImageDir: string = ''; // 当前文章的图片目录

  constructor(outputDir = './output') {
    this.outputDir = path.resolve(outputDir);
    this.imagesDir = path.join(this.outputDir, 'images');
    this.converter = new MarkdownConverter();
  }

  /**
   * 初始化浏览器
   */
  async init(): Promise<void> {
    this.browser = await chromium.launch({
      headless: false, // 设置为 false 可以看到浏览器操作过程
    });
    this.page = await this.browser.newPage();

    // 设置 User-Agent
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    });

    // 确保输出目录存在
    await ensureDir(path.join(this.outputDir, 'articles'));
    await ensureDir(this.imagesDir); // 确保 images 根目录存在
  }

  /**
   * 抓取文章
   */
  async scrapeArticle(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('请先调用 init() 初始化浏览器');
    }

    console.log(`\n开始抓取文章: ${url}\n`);

    try {
      // 1. 访问页面
      await this.page.goto(url, { waitUntil: 'networkidle' });
      console.log('✓ 页面加载完成');

      // 2. 等待文章内容加载
      await this.page.waitForSelector('#js_content', { timeout: 10000 });
      console.log('✓ 文章内容已加载');

      // 3. 滚动页面触发懒加载
      await scrollToBottom(this.page);
      await this.page.waitForTimeout(2000); // 等待图片加载
      console.log('✓ 页面滚动完成');

      // 4. 提取文章数据
      const articleData = await this.extractArticleData();
      console.log(`✓ 提取文章数据: ${articleData.title}`);

      // 5. 为当前文章创建独立的图片目录
      const articleDirName = sanitizeFilename(articleData.title);
      this.currentArticleImageDir = path.join(this.imagesDir, articleDirName);
      await ensureDir(this.currentArticleImageDir);

      // 6. 下载图片
      await this.downloadImages(articleData.images);
      console.log(`✓ 下载 ${articleData.images.size} 张图片到: ${articleDirName}/`);

      // 7. 转换为 Markdown
      let markdown = this.converter.convert(articleData.content);
      markdown = this.converter.replaceImageUrls(markdown, articleData.images, articleDirName);

      // 8. 保存文件
      await this.saveMarkdown(articleData, markdown);
      console.log('✓ 保存 Markdown 文件\n');

      console.log('🎉 抓取完成!');
    } catch (error) {
      console.error('❌ 抓取失败:', error);
      throw error;
    }
  }

  /**
   * 提取文章数据
   */
  private async extractArticleData(): Promise<ArticleData> {
    if (!this.page) throw new Error('页面未初始化');

    // 提取标题
    const title = await this.page.locator('#activity-name').textContent() ||
      await this.page.locator('h1.rich_media_title').textContent() ||
      '未知标题';

    // 提取作者
    const author = await this.page.locator('#js_name').textContent() || '未知作者';

    // 提取发布时间
    const publishTime = await this.page.locator('#publish_time').textContent() ||
      await this.page.locator('.rich_media_meta_text').first().textContent() ||
      '';

    // 提取文章内容 HTML
    const contentElement = await this.page.locator('#js_content');
    const content = await contentElement.innerHTML();

    // 提取图片 URL
    const images = await this.extractImages();

    return {
      title: title.trim(),
      author: author.trim(),
      publishTime: publishTime.trim(),
      content,
      images,
    };
  }

  /**
   * 提取图片 URL
   */
  private async extractImages(): Promise<Map<string, string>> {
    if (!this.page) throw new Error('页面未初始化');

    const imageMap = new Map<string, string>();

    // 获取所有图片元素
    const imgElements = await this.page.locator('#js_content img').all();

    for (const img of imgElements) {
      // 优先使用 data-src,其次使用 src
      const dataSrc = await img.getAttribute('data-src');
      const src = await img.getAttribute('src');
      const imageUrl = dataSrc || src;

      if (imageUrl && imageUrl.startsWith('http')) {
        const filename = generateImageFilename(imageUrl);
        imageMap.set(imageUrl, filename);
      }
    }

    return imageMap;
  }

  /**
   * 下载所有图片
   */
  private async downloadImages(images: Map<string, string>): Promise<void> {
    if (!this.page) throw new Error('页面未初始化');

    const downloadPromises = Array.from(images.entries()).map(([url, filename]) => {
      // 保存到当前文章的图片目录
      const savePath = path.join(this.currentArticleImageDir, filename);
      return downloadImage(this.page!, url, savePath);
    });

    await Promise.all(downloadPromises);
  }

  /**
   * 保存 Markdown 文件
   */
  private async saveMarkdown(data: ArticleData, markdown: string): Promise<void> {
    const filename = sanitizeFilename(data.title) + '.md';
    const filepath = path.join(this.outputDir, 'articles', filename);

    const content = `# ${data.title}

**作者**: ${data.author}  
**发布时间**: ${data.publishTime}

---

${markdown}
`;

    await fs.writeFile(filepath, content, 'utf-8');
    console.log(`📄 文件已保存: ${filepath}`);
  }

  /**
   * 关闭浏览器
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

/**
 * 主函数 - 支持命令行参数
 */
async function main() {
  // 从命令行参数获取文章 URL
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ 请提供文章 URL');
    console.log('\n使用方法:');
    console.log('  npx ts-node scraper/wechat-scraper.ts <文章URL>');
    console.log('\n示例:');
    console.log('  npx ts-node scraper/wechat-scraper.ts https://mp.weixin.qq.com/s/rapjHoxkM81hpsaZNhxG5Q');
    process.exit(1);
  }

  const articleUrl = args[0];

  // 验证 URL 格式
  if (!articleUrl.startsWith('https://mp.weixin.qq.com/s/')) {
    console.error('❌ 无效的微信公众号文章 URL');
    console.log('URL 应该以 https://mp.weixin.qq.com/s/ 开头');
    process.exit(1);
  }

  const scraper = new WeChatScraper();

  try {
    await scraper.init();
    await scraper.scrapeArticle(articleUrl);
  } catch (error) {
    console.error('抓取过程中出错:', error);
    process.exit(1);
  } finally {
    await scraper.close();
  }
}

// 如果直接运行此文件,执行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
