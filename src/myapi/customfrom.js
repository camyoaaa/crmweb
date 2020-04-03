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
    url: '/customfrom/list',
    method: 'get',
    params: parameter
  })
}

export function add(parameter) {
  return kaxios({
    url: '/customfrom/add',
    method: 'post',
    data: parameter
  })
}

export function modify(parameter) {
  return kaxios({
    url: '/customfrom/update',
    method: 'put',
    data: parameter
  })
}

export function deleteOrigin(parameter) {
  return kaxios({
    // url: api.SendSms,
    url: '/customfrom/delete',
    method: 'delete',
    data: parameter
  })
}
