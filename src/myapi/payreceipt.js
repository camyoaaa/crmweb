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
    url: '/payreceipt/list',
    method: 'get',
    params: parameter
  })
}

export function modify(parameter) {
  return kaxios({
    url: '/payreceipt/update',
    method: 'put',
    data: parameter
  })
}
