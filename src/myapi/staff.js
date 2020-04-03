import kaxios from "@/http";

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
export function getList(
  parameter = {
    pageNo: 1,
    pageSize: 500
  }
) {
  return kaxios({
    url: "/staff/list",
    method: "get",
    params: parameter
  });
}

export function add(parameter) {
  return kaxios({
    url: "/staff/add",
    method: "post",
    data: parameter
  });
}

export function updateOne(parameter) {
  return kaxios({
    url: "/staff/updateOne",
    method: "put",
    data: parameter
  });
}

export function updateMany(parameter) {
  return kaxios({
    url: "/staff/updateMany",
    method: "put",
    data: parameter
  });
}

export function deleteStaff(accounts) {
  return kaxios({
    url: "/staff/delete",
    method: "delete",
    data: {
      accounts
    }
  });
}

export function getFilterStaff(parameter) {
  return kaxios({
    url: "/staff/filter",
    method: "get",
    params: parameter
  });
}

export function getSeller(onduty) {
  return kaxios({
    url: "/staff/seller",
    method: "get",
    params: {
      onduty
    }
  });
}

export function getAfterSale(onduty) {
  return kaxios({
    url: "/staff/afterSale",
    method: "get",
    params: {
      onduty
    }
  });
}
