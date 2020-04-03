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
export function getMenuTree() {

  return kaxios({
    url: '/menu/tree',
    method: 'get',
  })
}

export function getMenuTreeList() {

  return kaxios({
    url: '/menu/treelist',
    method: 'get',
  })
}

export function add(parameter) {
  return kaxios({
    url: '/menu/add',
    method: 'post',
    data: parameter
  })
}

export function updateMenu(parameter) {
  return kaxios({
    url: '/menu/update',
    method: 'put',
    data: parameter
  })
}

export function deleteMenu(parameter) {
  return kaxios({
    // url: api.SendSms,
    url: '/menu/delete',
    method: 'delete',
    data: parameter
  })
}
