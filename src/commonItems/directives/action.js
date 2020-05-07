import Vue from 'vue'
import store from '@/store'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    const acitonName = binding.arg;

    const roleid = store.state.user.role;
    const roleEn = store.state.appconfig.appRoleList.find(r => r.id === roleid).en;

    const rolePermission = store.state.permission.rolePermissions.find(p => p.roleEn == roleEn);
    const belong = vnode.context.$route.matched[1].path.replace('/', '');
    const belongPermission = rolePermission[belong];
    console.log('belong********************', acitonName, roleid, roleEn, rolePermission, belong, belongPermission);
    if (!belongPermission.includes(acitonName)) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})


Vue.prototype.$auth = function (menudDotAction) {
  const [belong, acitonName] = menudDotAction.split('.');
  const roleid = store.state.user.role;
  const roleEn = store.state.appconfig.appRoleList.find(r => r.id === roleid).en;
  const rolePermission = store.state.permission.rolePermissions.find(p => p.roleEn == roleEn);
  const belongPermission = rolePermission[belong];
  return belongPermission.includes(acitonName)
}

export default action
