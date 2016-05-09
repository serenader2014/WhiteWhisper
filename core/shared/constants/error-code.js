/**
 * response code:
 * 0: 请求成功
 * -1: 权限不足
 * -2: 数据不全
 * -3: 数据格式错误
 * -4: 数据已存在
 * -5: 数据不存在
 * 1: 系统错误
 */

export const getError = type => ({ code: -5, msg: `获取${type}数据失败！` });

export const emailExist = () => ({ code: -4, msg: '该Email已注册。' });

export const formInvalid = data => ({ code: -3, msg: '表单数据有误。', data });

export const alreadyLogin = user => ({ code: -1, msg: '已经登陆。', data: user });

export const internalError = error => ({ code: 1, msg: error });

export const authError = error => ({ code: -5, msg: error });

export const emailNotExist = () => ({ code: -6, msg: 'email尚未注册' });

export const notLogin = () => ({ code: -7, msg: '尚未登录' });

export const userNotExist = () => ({ code: -6, msg: '用户不存在' });

export const passwordError = () => ({ code: -8, msg: '密码不正确' });

export const captchaError = () => ({ code: -9, msg: '验证码验证失败' });

export const categoryExist = () => ({ code: -10, msg: '分类名称已存在。' });

export const categoryNotExist = () => ({ code: -11, msg: '分类不存在' });

export const categoryNotEmpty = () => ({ code: -12, msg: '无法删除仍有文章的分类。' });

export const idFormatError = type => ({ code: -13, msg: `${type || ''}ID格式错误` });

export const noPermission = () => ({ code: -14, msg: '权限不足' });

export const postStatusError = () => ({ code: -15, msg: '文章状态不合法。' });
