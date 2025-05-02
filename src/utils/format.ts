/**
 * 格式化工具函数
 */

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式化模板，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | number | string, format = 'YYYY-MM-DD'): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return '无效日期';
  }
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  return format
    .replace('YYYY', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('HH', hours.toString().padStart(2, '0'))
    .replace('mm', minutes.toString().padStart(2, '0'))
    .replace('ss', seconds.toString().padStart(2, '0'));
};

/**
 * 格式化金额
 * @param amount 金额数值
 * @param options 格式化选项
 * @returns 格式化后的金额字符串
 */
export const formatCurrency = (amount: number, options?: {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}): string => {
  const {
    currency = 'CNY',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options || {};
  
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};

/**
 * 格式化数字（添加千位分隔符）
 * @param num 数字
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 格式化手机号码（隐藏中间4位）
 * @param phone 手机号码
 * @returns 格式化后的手机号码
 */
export const formatPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) {
    return phone;
  }
  return `${phone.substring(0, 3)}****${phone.substring(7)}`;
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};