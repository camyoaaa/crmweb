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
    url: '/meal/list',
    method: 'get',
    params: parameter
  })
}

export function add(parameter) {
  return kaxios({
    url: '/meal/add',
    method: 'post',
    data: parameter
  })
}

export function modify(parameter) {
  return kaxios({
    url: '/meal/update',
    method: 'put',
    data: parameter
  })
}

export function deleteMeal(parameter) {
  return kaxios({
    // url: api.SendSms,
    url: '/meal/delete',
    method: 'delete',
    data: parameter
  })
}
