import kaxios from "@/http";

/**
 * @param parameter
 * @returns {*}
 */
export function getAppConfig() {
  return kaxios({
    url: "/system/config",
    method: "get"
  });
}

export function getPermissions() {
  return kaxios({
    url: "/system/permission",
    method: "get"
  });
}

export function getRolePermissions() {
  return kaxios({
    url: "/system/rolePermission",
    method: "get"
  });
}

export function setRolePermissions(parameter) {
  return kaxios({
    url: "/system/setRolePermission",
    method: "put",
    data: parameter
  });
}
