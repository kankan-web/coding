# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WeChat article scraper built with Playwright and TypeScript. It extracts articles from WeChat public accounts (mp.weixin.qq.com), downloads images, and converts content to Markdown format with local image references.

## Commands

### Development
- `npm run scrape <URL>` - Run the scraper on a WeChat article URL
- `npm run dev` - Run scraper in watch mode (auto-reloads on file changes)
- `npm run convert` - Run the markdown converter utility

### Testing
- `pnpm exec playwright test` - Run all Playwright tests
- `pnpm exec playwright test tests/wechat-scraper.spec.ts` - Run specific test file
- `pnpm exec playwright test --headed` - Run tests with visible browser
- `pnpm exec playwright test --debug` - Run tests in debug mode
- `pnpm exec playwright show-report` - View HTML test report

### Setup
- `pnpm install` - Install dependencies (uses pnpm)
- `pnpm exec playwright install --with-deps` - Install Playwright browsers

## Architecture

### Core Components

**WeChatScraper** (`scraper/wechat-scraper.ts`)
- Main scraper class that orchestrates the entire scraping process
- Uses Playwright's Chromium browser (headless: false by default for visibility)
- Handles page navigation, content extraction, and file saving
- Creates article-specific subdirectories under `output/images/` for each scraped article
- Exports the class for use in tests and other modules

**MarkdownConverter** (`scraper/markdown-converter.ts`)
- Wraps TurndownService for HTML-to-Markdown conversion
- Custom rules for WeChat-specific HTML structures (sections, images with data-src)
- Handles image URL replacement to local relative paths (`../images/{article-dir}/{filename}`)

**Utils** (`scraper/utils.ts`)
- `sanitizeFilename()` - Removes unsafe characters from filenames
- `ensureDir()` - Creates directories recursively if they don't exist
- `downloadImage()` - Downloads images using Playwright's request API with proper Referer headers
- `generateImageFilename()` - Creates MD5-based filenames for images
- `scrollToBottom()` - Triggers lazy-loaded images by scrolling

### Data Flow

1. User provides WeChat article URL (must start with `https://mp.weixin.qq.com/s/`)
2. Scraper launches browser and navigates to URL
3. Waits for `#js_content` selector (article content container)
4. Scrolls page to trigger lazy-loaded images
5. Extracts article metadata (title, author, publishTime) and content HTML
6. Creates article-specific image directory: `output/images/{sanitized-title}/`
7. Downloads all images in parallel to the article directory
8. Converts HTML to Markdown and replaces image URLs with relative paths
9. Saves final Markdown to `output/articles/{sanitized-title}.md`

### Output Structure

```
output/
├── articles/
│   └── {article-title}.md
└── images/
    └── {article-title}/
        ├── img-{hash1}.jpg
        └── img-{hash2}.jpg
```

## Important Notes

- **Node Version**: Requires Node 22 (use `nvm use 22`)
- **Package Manager**: Uses pnpm, not npm
- **Browser Mode**: Scraper runs with `headless: false` by default to show browser actions
- **Image Handling**: Images use data-src attribute (WeChat lazy loading) as primary source
- **URL Validation**: Only accepts URLs starting with `https://mp.weixin.qq.com/s/`
- **CI/CD**: GitHub Actions workflow runs tests on push/PR to main/master branches

## TypeScript Configuration

- Target: ES2020
- Module: ESNext with Node resolution
- Strict mode enabled
- Output directory: `./dist` (though tsx is used for direct execution)
- Includes: `scraper/**/*` and `tests/**/*`

## Testing Strategy

Tests use Playwright's test framework with the actual WeChatScraper class. Tests verify:
- Successful article scraping and Markdown generation
- File system outputs (articles and images directories)
- Content validation (title, author, publish time in Markdown)
- Error handling for invalid URLs

The test suite uses a real WeChat article URL for integration testing.
