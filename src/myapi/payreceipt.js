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
  return kaxios({
    url: '/payreceipt/add',
    method: 'post',
    data: parameter
  })
}
export function uploadshot({
  receiptid,
  shot
}) { //上传收据截图
  const formData = new FormData();
  formData.append("file", shot);
  formData.append('receiptid', receiptid);
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
