import TurndownService from 'turndown';

/**
 * HTML 转 Markdown 转换器
 */
export class MarkdownConverter {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '*',
    });

    // 自定义规则:处理微信特有的样式
    this.addCustomRules();
  }

  /**
   * 添加自定义转换规则
   */
  private addCustomRules(): void {
    // 移除 section 标签但保留内容
    this.turndownService.addRule('removeSection', {
      filter: 'section',
      replacement: (content) => content,
    });

    // 处理图片,保留 alt 和 src
    this.turndownService.addRule('images', {
      filter: 'img',
      replacement: (content, node) => {
        const img = node as HTMLImageElement;
        const alt = img.alt || '图片';
        const src = img.getAttribute('data-src') || img.src;
        return src ? `![${alt}](${src})` : '';
      },
    });
  }

  /**
   * 将 HTML 转换为 Markdown
   */
  convert(html: string): string {
    return this.turndownService.turndown(html);
  }

  /**
   * 替换 Markdown 中的图片链接为本地路径
   * @param markdown Markdown 内容
   * @param imageMap 图片映射(原始URL -> 文件名)
   * @param articleDirName 文章目录名
   */
  replaceImageUrls(markdown: string, imageMap: Map<string, string>, articleDirName: string): string {
    let result = markdown;

    imageMap.forEach((localPath, originalUrl) => {
      // 替换图片 URL 为相对路径: ../images/文章目录/图片文件名
      const relativePath = `../images/${articleDirName}/${localPath}`;
      result = result.replace(
        new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        relativePath
      );
    });

    return result;
  }
}
