import _CONSTANTS_ROUTERS from '@/router/constantRoutes' //静态路由

import {
  getMenuTree
} from '@/myapi/menu.js'

const RouterStore = {
  state: {
    routers: _CONSTANTS_ROUTERS,
    addRouters: []
  },
  mutations: {
    setRouters: (state, routers) => {
      state.addRouters = routers;
      //和已经存在的路由表拼接
      state.routers = _CONSTANTS_ROUTERS.concat(routers);
    }
  },
  actions: {
    async GetMenu({
      commit
    }, userinfo) {
      try {
        let treeMenu = await getMenuTree();
        let asyncRouters = [{
            path: "/",
            redirect: "/workplace",
            name: "Home",
            component: () => import("@/components/Layout.vue"),
            children: filterAsyncRouter(buildTree(treeMenu.tree, treeMenu.rootid), userinfo)
          },
          {
            path: '*',
            redirect: '/404',
            hidden: true
          }
        ];
        // let pages = asyncRouters[0].children.find(m => m.path == '/systemSettings')
        console.log('asyncRouters********************', asyncRouters);


        commit("setRouters", asyncRouters);
        return asyncRouters;
      } catch (error) {
        console.log('GetMenu', error);
      }



    }
  }
};

function buildTree(treeData, rootKey = 100000) {
  let parentstore = {};
  let childstore = {};
  treeData.forEach(element => {
    childstore[element.mid] = element;
    if (Array.isArray(parentstore[element.pid])) {
      parentstore[element.pid].push(element);
    } else {
      parentstore[element.pid] = [element];
    }
  });

  for (let key in childstore) {
    childstore[key].children = parentstore[childstore[key].mid];
    if (!childstore[key].children) {
      delete childstore[key].children
    }
  }
  return childstore[rootKey].children;
}

function filterAsyncRouter(routers, userinfo) {
  // 遍历后台传来的路由字符串，转换为组件对象
  let accessedRouters = routers.filter(router => {
    router.meta = {};
    !router.redirect && delete router.redirect;
    router.meta.title = router.title = router.name;
    router.icon = router.icon || 'component'
    //处理组件---重点
    router.component = loadView(router.path);
    // router.RouteName = 
    //存在子集
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children, userinfo);
    }
    return haspermission(router.enableDepartmentPost, userinfo);
  });
  return accessedRouters;
}

function haspermission(enableDepartmentPost, userinfo) { //根据用户的部门或者岗位
  let {
    department: ud,
    post: up,
    isadmin,
    ...other
  } = userinfo;
  if (isadmin) {
    return true;
  }
  return enableDepartmentPost.some((dp) => {
    if (dp == 'ROOT') {
      return true;
    } else {
      let [md, mp] = dp.split('-');
      return md == ud && (mp == "all" || mp == up)
    }

  });
}

function loadView(view) {
  // 路由懒加载
  return () => import(`@/components${view}/index.vue`);
}
export default RouterStore;
