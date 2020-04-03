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
    url: '/followRecord/list',
    method: 'get',
    params: parameter
  })
}

export function add(parameter) {
  return kaxios({
    url: '/followRecord/add',
    method: 'post',
    data: parameter
  })
}
