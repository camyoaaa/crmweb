<template>
    <a-layout id="components-layout-demo-custom-trigger" style="height:100%" class="layout">
        <a-layout-sider :trigger="null" collapsible v-model="collapsed" style="box-shadow:2px 0 6px rgba(0,21,41,.35)">
            <!-- <div class="logo"></div> -->
            <!-- <h1>Kdd CRM</h1> -->
            <div class="logo" style="background:#002140;margin:0px;padding-left:28px;height:64px;overflow:hidden">
                <img src="@/assets/logo.png" alt="" width="128px" height="32px" style="margin-top:15px;" />
            </div>
            <main-menu></main-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0;box-shadow: 0 1px 4px rgba(0,21,41,.08);">
                <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
                <div class="header" style="float:right;">
                    <main-header></main-header>
                </div>
            </a-layout-header>
            <a-layout-content :style="{
          margin: '24px 16px',
          minHeight: '280px'
        }">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
import MainHeader from "./MainHeader";
import MainMenu from "./MainMenu";

export default {
    components: { MainHeader, MainMenu },
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
