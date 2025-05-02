/**
 * 通用辅助工具函数
 * 包含日期处理、字符串操作、数组处理等实用函数
 */

/**
 * 获取当前日期时间的时间戳
 * @returns 当前时间戳（毫秒）
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * 计算两个日期之间的天数差
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 天数差值
 */
export const getDaysDifference = (startDate: Date | string | number, endDate: Date | string | number): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // 重置时间部分，只比较日期
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // 计算差值（毫秒）并转换为天数
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 检查日期是否为今天
 * @param date 要检查的日期
 * @returns 是否为今天
 */
export const isToday = (date: Date | string | number): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  
  return (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  );
};

/**
 * 获取相对时间描述（如：刚刚、5分钟前、2小时前等）
 * @param date 日期或时间戳
 * @returns 相对时间描述
 */
export const getRelativeTimeDescription = (date: Date | string | number): string => {
  const now = new Date();
  const inputDate = new Date(date);
  const diffSeconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);
  
  if (diffSeconds < 60) {
    return '刚刚';
  }
  
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}天前`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}个月前`;
  }
  
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}年前`;
};

/**
 * 字符串截断并添加省略号
 * @param str 原始字符串
 * @param maxLength 最大长度
 * @returns 截断后的字符串
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return `${str.substring(0, maxLength)}...`;
};

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 */
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 * @returns 克隆后的新对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 数组去重
 * @param array 原始数组
 * @returns 去重后的数组
 */
export const uniqueArray = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * 数组分组
 * @param array 原始数组
 * @param keyGetter 分组键获取函数
 * @returns 分组后的Map对象
 */
export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keyGetter: (item: T) => K
): Map<K, T[]> => {
  const map = new Map<K, T[]>();
  
  array.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  
  return map;
};

/**
 * 防抖函数
 * @param func 要执行的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖处理后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * 节流函数
 * @param func 要执行的函数
 * @param limit 时间限制（毫秒）
 * @returns 节流处理后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * 生成UUID
 * @returns UUID字符串
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 检查对象是否为空
 * @param obj 要检查的对象
 * @returns 是否为空对象
 */
export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * 获取URL参数
 * @param url URL字符串
 * @returns 参数对象
 */
export const getUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const queryString = url.split('?')[1];
  
  if (!queryString) {
    return params;
  }
  
  const pairs = queryString.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  
  return params;
};