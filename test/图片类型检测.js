
/**
 * 解决方案演示：如何在 Chrome 中显示 HEIC 图片
 * 
 * 问题：Chrome 原生不支持 HEIC 格式，但该 URL 返回的是 HEIC 文件 (误标为 jpg)。
 * 解决：
 * 1. (推荐) 服务端转码：使用阿里云 OSS / AWS S3 等服务进行格式转换。
 * 2. (前端) 客户端转码：使用 heic2any 库。
 */

// 假设我们使用 heic2any 库
// import heic2any from "heic2any"; 

const imgUrl = 'https://video.esx.bigo.sg/as/live_file/ls4/11vmo94IZ9jJ.jpg?token=RlxSgByzo1fIeN3GRYqcGGWxDVU%3D%3AeyJidWNrZXQiOiJiaWdvbGl2ZWZpbGUtdmVyaWZ5IiwiZXhwaXJlcyI6MTc3MDE3Njk3OSwiZnNpemVMaW1pdCI6WzAsNTI0Mjg4MDBdLCJmaWxlVXJsIjoiaHR0cHM6Ly92aWRlby5lc3guYmlnby5zZy9hcy9saXZlX2ZpbGUvbHM0LzExdm1vOTRJWjlqSi5qcGcifQ%3D%3D&bucket=bigolivefile-verify&User=BigoAudit&zhixu_fe_trans=true';

async function displayHeicImage(url, imgElement) {
  try {
    // 1. 获取原始二进制数据
    const response = await fetch(url);
    const blob = await response.blob();

    // 2. 检测是否为 HEIC (检查文件头 magic number)
    // HEIC 通常以 00 00 00 18 66 74 79 70 68 65 69 63 ... 开头
    // 这里简单判断 buffer，或者直接依赖 heic2any 的转换能力

    console.log('正在转换图片格式...');

    // 3. 使用 heic2any 转换为 JPEG 或 PNG
    // 注意：需要在项目中安装 heic2any (npm install heic2any)
    const convertedBlob = await heic2any({
      blob: blob,
      toType: "image/jpeg",
      quality: 0.8
    });

    // 4. 创建可显示的 URL
    const jpgUrl = URL.createObjectURL(convertedBlob);
    imgElement.src = jpgUrl;
    console.log('转换成功，已显示图片');

  } catch (error) {
    console.error('转换失败:', error);
    // 降级处理：直接赋值 (如果浏览器支持)
    imgElement.src = url;
  }
}

// 用法示例:
// const imgTag = document.getElementById('my-image');
// displayHeicImage(imgUrl, imgTag);
