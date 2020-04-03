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
export function getList(parameter) {

  return kaxios({
    url: '/business/list',
    method: 'get',
    params: parameter
  })
}

export function add(parameter) {
  return kaxios({
    url: '/business/add',
    method: 'post',
    data: parameter
  })
}

export function modify(parameter) {
  return kaxios({
    url: '/business/update',
    method: 'put',
    data: parameter
  })
}

export function deleteBusi(parameter) {
  return kaxios({
    // url: api.SendSms,
    url: '/business/delete',
    method: 'delete',
    data: parameter
  })
}
