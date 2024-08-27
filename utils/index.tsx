import axios from 'axios';

export function getJSTDate(t) {
  // 获取当前时间
  const now = t || new Date();

  // 计算JST时间的偏移量（UTC+9小时）
  const jstOffset = 9 * 60; // 9小时转为分钟

  // 获取当前时间的UTC偏移量（分钟）
  const localOffset = now.getTimezoneOffset(); // 系统本地时区相对于UTC的偏移量

  // 计算总的偏移量
  const totalOffset = jstOffset + localOffset;

  // 通过调整当前时间的毫秒数来得到JST时间
  const jstDate = now.getTime() + totalOffset * 60 * 1000;

  return jstDate;
}

export async function getServerLastModified(url) {
  try {
    // 发送HEAD请求，获取响应头信息
    const response = await axios.head(url, {
      headers: {
        'Cache-Control': 'no-cache', // 禁用缓存
      }
    });

    // 从响应头中提取Last-Modified字段
    const lastModified = response.headers['last-modified'];

    if (lastModified) {
      return getJSTDate(new Date(lastModified)); // 将Last-Modified字符串转换为Date对象
    } else {
      throw new Error('No Last-Modified information');
    }
  } catch (error) {
    console.error('Failed to fetch Last-Modified:', error.message);
    return null;
  }
}