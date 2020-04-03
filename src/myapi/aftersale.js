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
    url: '/aftersale/list',
    method: 'get',
    params: parameter
  })
}
export function getOne(parameter) {

  return kaxios({
    url: '/aftersale/',
    method: 'get',
    params: parameter
  })
}
export function add(parameter) {
  return kaxios({
    url: '/aftersale/add',
    method: 'post',
    data: parameter
  })
}

export function modify(parameter) {

  console.log('modify', parameter)
  return kaxios({
    url: '/aftersale/update',
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


export function uploadPayshot(orderid, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append('orderid', orderid);
  return kaxios.post("/aftersale/payshot", formData, {
    contentType: false,
    processData: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}
