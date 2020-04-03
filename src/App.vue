<template>
    <a-config-provider :locale="zh_CN">
        <div id="app">
            <!-- <img src="./assets/logo.png"> -->
            <socket-control />
            <router-view />
        </div>
    </a-config-provider>
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import SocketControl from "./SockectControl";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export default {
    name: "App",
    components: { SocketControl },
    data() {
        return {
            zh_CN
        };
    }
};
</script>

<style lang="less">
@import "./global.less";
html,
body {
    height: 100%;
    margin: 0px;
    padding: 0px;
}
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;
    height: 100%;
}
</style>
