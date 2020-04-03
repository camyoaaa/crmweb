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
    url: '/customstatus/list',
    method: 'get',
    params: parameter
  })
}

export function add(parameter) {
  return kaxios({
    url: '/customstatus/add',
    method: 'post',
    data: parameter
  })
}

export function modify(parameter) {
  return kaxios({
    url: '/customstatus/update',
    method: 'put',
    data: parameter
  })
}

export function deleteStatus(parameter) {
  return kaxios({
    // url: api.SendSms,
    url: '/customstatus/delete',
    method: 'delete',
    data: parameter
  })
}
