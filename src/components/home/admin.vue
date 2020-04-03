<template>
  <a-layout id="components-layout-demo-custom-trigger" style="height:100%">
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed"
      style="background:white
    "
    >
      <div class="logo" />
      <!-- <div class="logo" style="background:#1890ff;margin:0px;height:64px">
        <img src="@/assets/logo.png" alt="" width="168px" height="64px" />
      </div> -->
      <a-menu mode="inline" :defaultSelectedKeys="['1']">
        <a-menu-item key="1">
          <a-icon type="user" />
          <span>工作台</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="video-camera" />
          <span>员工分配</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="upload" />
          <span>nav 3</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <div style="float:right;margin-right:20px">
          <a-dropdown>
            <span class="action ant-dropdown-link user-dropdown-menu">
              <a-avatar
                style="backgroundColor:#87d068;"
                icon="user"
                size="small"
              />
              <span style="margin-left:10px;font-size:14px">曹勇</span>
            </span>
            <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
              <a-menu-item key="0">
                <router-link :to="{ name: 'center' }">
                  <a-icon type="user" />
                  <span>个人中心</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="1">
                <router-link :to="{ name: 'settings' }">
                  <a-icon type="setting" />
                  <span>账户设置</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="2" disabled>
                <a-icon type="setting" />
                <span>测试</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3">
                <a href="javascript:;">
                  <a-icon type="logout" @click="" />
                  <span>退出登录</span>
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          minHeight: '280px'
        }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false
    };
  }
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
