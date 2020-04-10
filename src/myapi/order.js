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
export function getList(parameter) { //获取订单列表

  return kaxios({
    url: '/order/list',
    method: 'get',
    params: parameter
  })
}

export function getOrderDetail(oid) {
  return kaxios({
    url: '/order/detail',
    method: 'get',
    params: {
      oid
    }
  })
}

export function getPaidPassedOrderList(parameter) {
  return kaxios({
    url: '/order/paidPassedOrderList',
    method: 'get',
    params: parameter
  })
}


export function add(parameter) { //新建订单
  return kaxios({
    url: '/order/add',
    method: 'post',
    data: parameter
  })
}
export function deleteOrder(orderid) {
  return kaxios({
    url: '/order/delete',
    method: 'delete',
    data: {
      orderid
    }
  })
}

export function upgradeOrder(order) {
  return kaxios({
    url: '/order/upgrade',
    method: 'put',
    data: order
  })
}

export function addContract(parameter) { //新增合同
  return kaxios({
    url: '/order/addContract',
    method: 'post',
    data: parameter
  })
}

export function addReceipt(parameter) { //新增收据
  return kaxios({
    url: '/order/addReceipt',
    method: 'post',
    data: parameter
  })
}

export function afterAlloc(parameter) {
  return kaxios({
    url: '/order/afterAlloc',
    method: 'put',
    data: parameter
  })
}

export function uploadReceiptShot({
  receiptid,
  shot
}) { //上传支付截图
  const formData = new FormData();
  formData.append("file", shot);
  formData.append('receiptid', receiptid);
  return kaxios.post("/order/payshot", formData, {
    contentType: false,
    processData: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}

export function uploadContractShot({
  ctid,
  shot
}) { //上传合同截图
  const formData = new FormData();
  formData.append("file", shot);
  formData.append('ctid', ctid);
  return kaxios.post("/order/contractshot", formData, {
    contentType: false,
    processData: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}
