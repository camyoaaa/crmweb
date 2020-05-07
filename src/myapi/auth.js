import kaxios from '@/http'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {

  return kaxios({
    url: '/auth/login',
    method: 'post',
    data: parameter
  })
}

export function regist(parameter) {
  return kaxios({
    url: '/auth/regist',
    method: 'post',
    data: parameter
  })
}

export function isRegist(phone) {
  return kaxios({
    url: '/auth/isRegist',
    method: 'post',
    data: {
      phone
    }
  })
}

export function sendSmsCaptcha(parameter) {
  return kaxios({
    // url: api.SendSms,
    url: '/auth/captcha',
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return kaxios({
    url: '/auth/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav(token) {
  return kaxios({
    url: '/user/nav',
    method: 'get'
  })
}

export function logout(account) {
  return kaxios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: {
      account
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step(parameter) {
  return kaxios({
    url: '/auth/promote',
    method: 'post',
    data: parameter
  })
}

export function getPromoteData() {
  return kaxios({
    url: '/auth/promote',
    method: 'get'
  })
}

export function getSysNow() {
  return laxios({
    url: '/api/sys_now',
    method: 'get',
  })
}

export function changePassword(data) {
  return kaxios({
    url: '/auth/changePassword',
    method: 'put',
    data
  })
}

export function changeTradePassword(data) {
  return kaxios({
    url: '/auth/changeTradePassword',
    method: 'put',
    data
  })
}

export function changePhone(data) {
  return kaxios({
    url: '/auth/changePhone',
    method: 'put',
    data
  })
}

export function updateUserinfo(data) {
  return kaxios({
    url: '/auth/modinfo',
    method: 'put',
    data
  })
}
