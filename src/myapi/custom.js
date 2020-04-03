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
    url: '/custom/list',
    method: 'get',
    params: parameter
  })
}

export function sellerAlloc({
  cid,
  seller,
  sellerManager
}) {
  return kaxios({
    url: '/custom/sellerAlloc',
    method: 'post',
    data: {
      cid,
      seller,
      sellerManager
    }
  })
}

//获取已经录入的客户   ---- 接待人员
export function getReceptList(parameter) {
  return kaxios({
    url: '/custom/receptList',
    method: 'get',
    params: parameter
  })
}

//获取已经分配和未分配的客户     ---- 售前经理
export function getSellerAllocList(parameter) {
  return kaxios({
    url: '/custom/sellerAllocList',
    method: 'get',
    params: parameter
  })
}

//获取售前经理已分配的销售客户    -----售前人员/销售
export function getSellerCustomList(parameter) {
  return kaxios({
    url: '/custom/sellerCustomList',
    method: 'get',
    params: parameter
  })
}

//获取已经下单的客户
export function getOrderedList(parameter) {
  return kaxios({
    url: '/custom/orderedlist',
    method: 'get',
    params: parameter
  })
}

//获取已经下单的客户
export function getAftersaleList(parameter) {
  return kaxios({
    url: '/custom/aftersalelist',
    method: 'get',
    params: parameter
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

export function add(parameter) {
  return kaxios({
    url: '/custom/add',
    method: 'post',
    data: parameter
  })
}

export function modify(parameter) {
  return kaxios({
    url: '/custom/update',
    method: 'put',
    data: parameter
  })
}

//删除一个或者多个
export function deleteCustom(cids) {
  return kaxios({
    // url: api.SendSms,
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
