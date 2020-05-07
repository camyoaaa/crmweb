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

//获取header的统计数据
export function getHeadData(parameter) {

  return kaxios({
    url: '/dashboard/headerData',
    method: 'get',
    params: parameter
  })
}

//获取部门岗位数据
export function getOrganization(account) {
  return kaxios({
    url: '/dashboard/organization',
    method: 'get',
    params: {
      account
    }
  })
}

//获取销售经理的待办信息
export function getSellerManageTodo(parameter) {
  return kaxios({
    url: '/dashboard/sellerManageTodo',
    method: 'get',
    params: parameter
  })
}

export function getAchievementData(parameter) {
  return kaxios({
    url: '/dashboard/achievementData',
    method: 'get',
    params: parameter
  })
}


//获取接待客户数据   --- 接待员
export function getReceiptCustoms(parameter) {
  return kaxios({
    url: '/dashboard/receiptCustoms',
    method: 'get',
    params: parameter
  })
}

//获取接待客户来源数据   --- 接待员
export function getCustomFrom(parameter) {
  return kaxios({
    url: '/dashboard/customfrom',
    method: 'get',
    params: parameter
  })
}

//获取接待客户各时间段数据   --- 接待员
export function getCustomTime(parameter) {
  return kaxios({
    url: '/dashboard/customtime',
    method: 'get',
    params: parameter
  })
}

//获取销售经理的待办数据
export function getSellerManagerTodo() {
  return kaxios({
    url: '/dashboard/sellerManagerTodo',
    method: 'get'
  })
}
//获取销售员的待办数据
export function getSellerTodo(parameter) {
  return kaxios({
    url: '/dashboard/sellerTodo',
    method: 'get',
    params: parameter
  })
}


//获取售后经理的待办数据
export function getAftersaleManagerTodo(parameter) {
  return kaxios({
    url: '/dashboard/aftersaleManagerTodo',
    method: 'get',
    params: parameter
  })
}

//获取售后经理的待办数据
export function getAftersaleTodo(parameter) {
  return kaxios({
    url: '/dashboard/aftersaleTodo',
    method: 'get',
    params: parameter
  })
}

//获取成交的客户及下单数 数据
export function getDealData(parameter) {
  return kaxios({
    url: '/dashboard/dealData',
    method: 'get',
    params: parameter
  })
}

//获取业绩总览 数据
export function getAchievementOverview(parameter) {
  return kaxios({
    url: '/dashboard/achievementOverview',
    method: 'get',
    params: parameter
  })
}

export function getCustomData(parameter) {
  return kaxios({
    url: '/dashboard/customData',
    method: 'get',
    params: parameter
  })
}

//获取业绩详情 数据
export function getAchievementEvery(parameter) {
  return kaxios({
    url: '/dashboard/achievementEvery',
    method: 'get',
    params: parameter
  })
}


//获取开单详情 数据
export function getOrderEvery(parameter) {
  return kaxios({
    url: '/dashboard/orderEvery',
    method: 'get',
    params: parameter
  })
}

export function add(parameter) {
  return kaxios({
    url: '/meal/add',
    method: 'post',
    data: parameter
  })
}

export function modify(parameter) {
  return kaxios({
    url: '/meal/update',
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
