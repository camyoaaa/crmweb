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

//获取客户列表
export function getList(parameter) {
  return kaxios({
    url: '/custom/list',
    method: 'get',
    params: parameter
  })
}

//分配客户
export function alloc({
  cid,
  seller,
  sellerManager
}) {
  return kaxios({
    url: '/custom/alloc',
    method: 'post',
    data: {
      cid,
      seller,
      sellerManager
    }
  })
}

export function getOne(cid) {
  return kaxios({
    url: '/custom/',
    method: 'get',
    params: {
      cid
    }
  })
}

export function getCustomDetail(cid) {
  return kaxios({
    url: '/custom/detail',
    method: 'get',
    params: {
      cid
    }
  })
}

//新增客户
export function add(parameter) {
  return kaxios({
    url: '/custom/add',
    method: 'post',
    data: parameter
  })
}

//更新客户
export function updateCustom(parameter) {
  return kaxios({
    url: '/custom/update',
    method: 'put',
    data: parameter
  })
}

//删除一个或者多个
export function deleteCustom(cids) {
  return kaxios({
    url: '/custom/delete',
    method: 'delete',
    data: {
      cids
    }
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
