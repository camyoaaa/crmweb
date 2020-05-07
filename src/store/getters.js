const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.username,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user,
  addRoutes: state => state.asyncRoute.addRouters,
  multiTab: state => state.app.multiTab,
  lang: state => state.i18n.lang,
  account: state => state.user.account,
  gotAppconfig1: state => state.appconfig.gotAppconfig1,
  socketUuid: state => state.socketUuid.uuid
};

export default getters;
