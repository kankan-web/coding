import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import type { Page } from '@playwright/test';

/**
 * 清理文件名,移除不安全字符
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}

/**
 * 确保目录存在
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * 下载图片到本地
 */
export async function downloadImage(
  page: Page,
  imageUrl: string,
  savePath: string
): Promise<void> {
  try {
    const response = await page.request.get(imageUrl, {
      headers: {
        'Referer': 'https://mp.weixin.qq.com/',
      },
    });

    if (response.ok()) {
      const buffer = await response.body();
      await fs.writeFile(savePath, buffer);
      console.log(`✓ 下载图片: ${path.basename(savePath)}`);
    } else {
      console.error(`✗ 下载失败 (${response.status()}): ${imageUrl}`);
    }
  } catch (error) {
    console.error(`✗ 下载图片出错: ${imageUrl}`, error);
  }
}

/**
 * 生成图片文件名(使用 URL hash)
 */
export function generateImageFilename(imageUrl: string): string {
  const hash = crypto.createHash('md5').update(imageUrl).digest('hex').substring(0, 8);
  const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
  return `img-${hash}${ext}`;
}

/**
 * 滚动页面到底部,触发懒加载
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
