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

export function add(parameter) { //新建订单
  return kaxios({
    url: '/order/add',
    method: 'post',
    data: parameter
  })
}

export function addContract(parameter) { //新增合同
  return kaxios({
    url: '/order/addContract',
    method: 'post',
    data: parameter
  })
}

export function addPayReceipt(parameter) { //新增收据
  return kaxios({
    url: '/order/addPayReceipt',
    method: 'post',
    data: parameter
  })
}

export function modify(parameter) {
  return kaxios({
    url: '/order/update',
    method: 'put',
    data: parameter
  })
}

export function uploadPayshot(orderid, file) { //上传支付截图
  const formData = new FormData();
  formData.append("file", file);
  formData.append('orderid', orderid);
  return kaxios.post("/order/payshot", formData, {
    contentType: false,
    processData: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}

export function uploadContractshot(orderid, file) { //上传合同截图
  const formData = new FormData();
  formData.append("file", file);
  formData.append('orderid', orderid);
  return kaxios.post("/order/contractshot", formData, {
    contentType: false,
    processData: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}
