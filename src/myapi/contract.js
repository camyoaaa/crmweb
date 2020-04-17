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
    url: '/contract/list',
    method: 'get',
    params: parameter
  })
}

export function add(parameter) {
  return kaxios({
    url: '/contract/add',
    method: 'post',
    data: parameter
  })
}

export function modify(parameter) {
  return kaxios({
    url: '/contract/update',
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


export function uploadshot({
  ctid,
  shot
}) {
  const formData = new FormData();
  formData.append("file", shot);
  formData.append('ctid', ctid);
  return kaxios.post("/contract/shot", formData, {
    contentType: false,
    processData: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}
