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

export function getDepartmentTree() {
  return kaxios({
    url: '/department/tree',
    method: 'get'
  })

}
export function addDepartment(parameter) {
  return kaxios({
    url: '/department/add',
    method: 'post',
    data: parameter
  })
}

export function addPost(parameter) {
  return kaxios({
    url: '/post/add',
    method: 'post',
    data: parameter
  })
}

export function getPostList(did) {
  return kaxios({
    url: '/post/list',
    method: 'get',
    params: {
      did
    }
  })
}

export function deleteDepartment(dids) {
  return kaxios({
    url: '/department/delete',
    method: 'delete',
    data: {
      dids
    }
  })
}

export function deletePost(pids) {
  return kaxios({
    // url: api.SendSms,
    url: '/post/delete',
    method: 'delete',
    data: {
      pids
    }
  })
}
