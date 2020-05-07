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
//合同列表
export function getList(parameter) {

  return kaxios({
    url: '/contract/list',
    method: 'get',
    params: parameter
  })
}
//添加合同
export function add(parameter) {
  const {
    shot,
    ...otherFields
  } = parameter;
  console.log(otherFields);
  const formData = new FormData();
  formData.append("file", shot);
  for (const key in otherFields) {
    formData.append(key, otherFields[key]);
  }
  return kaxios.post("/contract/add", formData, {
    contentType: false,
    processData: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}
//更新合同
export function updateContract(parameter) {
  return kaxios({
    url: '/contract/update',
    method: 'put',
    data: parameter
  })
}


//更新合同
export function reviewContract(parameter) {
  return kaxios({
    url: '/contract/review',
    method: 'put',
    data: parameter
  })
}

//上传合同截图
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
