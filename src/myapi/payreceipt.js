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

export function add(parameter) {
  const {
    shot,
    ...payload
  } = parameter;
  const formData = new FormData();
  formData.append("file", shot);
  for (const key in payload) {
    formData.append(key, payload[key]);
  }
  return kaxios.post("/payreceipt/add", formData, {
    contentType: false,
    processData: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}

export function updateReceipt(parameter) {
  return kaxios({
    url: '/payreceipt/update',
    method: 'put',
    data: parameter
  })
}

export function reviewReceipt(parameter) {
  return kaxios({
    url: '/payreceipt/review',
    method: 'put',
    data: parameter
  })
}


export function uploadshot({
  payreceiptid,
  shot
}) {
  console.log(payreceiptid);
  //上传收据截图
  const formData = new FormData();
  formData.append("file", shot);
  formData.append('payreceiptid', payreceiptid);
  return kaxios.post("/payreceipt/shot", formData, {
    contentType: false,
    processData: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}



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
