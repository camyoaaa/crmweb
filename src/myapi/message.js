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
    url: '/message/list',
    method: 'get',
    params: parameter
  })
}

export function addMessage(parameter) {
  return kaxios({
    url: '/message/add',
    method: 'post',
    data: parameter
  })
}

export function updateMessage(parameter) {
  return kaxios({
    url: '/message/update',
    method: 'put',
    data: parameter
  })
}

export function deleteMessage(parameter) {
  return kaxios({
    // url: api.SendSms,
    url: '/message/delete',
    method: 'delete',
    data: parameter
  })
}
