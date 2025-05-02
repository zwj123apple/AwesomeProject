/**
 * 验证工具函数
 */

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否为有效邮箱
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号格式（中国大陆）
 * @param phone 手机号码
 * @returns 是否为有效手机号
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证密码强度
 * @param password 密码
 * @param options 选项（最小长度、是否需要特殊字符等）
 * @returns 密码强度评估结果
 */
export const validatePassword = (password: string, options?: {
  minLength?: number;
  requireSpecialChar?: boolean;
  requireNumber?: boolean;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
}): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} => {
  const {
    minLength = 8,
    requireSpecialChar = true,
    requireNumber = true,
    requireUppercase = true,
    requireLowercase = true,
  } = options || {};
  
  let strength = 0;
  const messages: string[] = [];
  
  // 检查长度
  if (password.length < minLength) {
    messages.push(`密码长度至少为${minLength}个字符`);
  } else {
    strength += 1;
  }
  
  // 检查特殊字符
  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    messages.push('密码需要包含特殊字符');
  } else if (requireSpecialChar) {
    strength += 1;
  }
  
  // 检查数字
  if (requireNumber && !/\d/.test(password)) {
    messages.push('密码需要包含数字');
  } else if (requireNumber) {
    strength += 1;
  }
  
  // 检查大写字母
  if (requireUppercase && !/[A-Z]/.test(password)) {
    messages.push('密码需要包含大写字母');
  } else if (requireUppercase) {
    strength += 1;
  }
  
  // 检查小写字母
  if (requireLowercase && !/[a-z]/.test(password)) {
    messages.push('密码需要包含小写字母');
  } else if (requireLowercase) {
    strength += 1;
  }
  
  // 评估强度
  let strengthLevel: 'weak' | 'medium' | 'strong' = 'weak';
  if (strength >= 4) {
    strengthLevel = 'strong';
  } else if (strength >= 2) {
    strengthLevel = 'medium';
  }
  
  return {
    isValid: messages.length === 0,
    strength: strengthLevel,
    message: messages.length > 0 ? messages.join('，') : '密码符合要求',
  };
};

/**
 * 验证身份证号（中国大陆）
 * @param idCard 身份证号
 * @returns 是否为有效身份证号
 */
export const isValidIdCard = (idCard: string): boolean => {
  // 简单验证18位身份证
  const idCardRegex = /(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(idCard);
};

/**
 * 验证URL格式
 * @param url URL地址
 * @returns 是否为有效URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 验证表单字段是否为空
 * @param value 字段值
 * @returns 是否为空
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
};

/**
 * 验证是否为数字
 * @param value 要验证的值
 * @returns 是否为数字
 */
export const isNumber = (value: any): boolean => {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  
  if (typeof value === 'string') {
    return !isNaN(Number(value));
  }
  
  return false;
};

/**
 * 验证是否在指定范围内
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 * @returns 是否在范围内
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};