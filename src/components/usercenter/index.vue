<template>
    <div class="page-header-index-wide" style="min-height:500px">
        <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%', minHeight: '500px' }">
            <div class="account-settings-info-main desktop">
                <div class="account-settings-info-left">
                    <a-menu mode="inline" type="inner" :selectedKeys="selectedKeys" @openChange="onOpenChange">
                        <a-menu-item v-for="(m, index) in usercenterMenu" :key="m.path">
                            <router-link :to="{ path: m.path.trim() }">
                                <a-icon :type="m.meta.icon"></a-icon> {{ m.meta.title }}
                            </router-link>
                        </a-menu-item>
                    </a-menu>
                </div>
                <div class="account-settings-info-right">
                    <div class="account-settings-info-title">
                        <span>{{ $route.meta.title }}</span>
                    </div>
                    <router-view></router-view>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import constantRoutes from "@/router/constantRoutes.js";
export default {
    name: "config",
    data() {
        return {
            selectedKeys: []
        };
    },
    created() {
        this.updateMenu();
    },
    watch: {
        $route(val) {
            this.updateMenu();
        }
    },
    computed: {
        ...mapGetters(["addRoutes"]),
        usercenterMenu() {
            return constantRoutes
                .find(r => r.path === "/")
                .children.find(u => u.path === "/usercenter").children;
        }
    },
    methods: {
        updateMenu() {
            const routes = this.$route.matched.concat();
            console.log("this.$route.matched", this.$route.matched);
            this.selectedKeys = [routes.pop().path];
        },
        onOpenChange() {}
    }
};
</script>
<style lang="less" scoped>
.account-settings-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    &.mobile {
        display: block;

        .account-settings-info-left {
            // border-right: unset;
            border-bottom: 1px solid #e8e8e8;
            width: 100%;
            height: 50px;
            overflow-x: auto;
            overflow-y: scroll;
        }
        .account-settings-info-right {
            padding: 20px 40px;
        }
    }

    .account-settings-info-left {
        // border-right: 1px solid #e8e8e8;
        width: 224px;
    }

    .account-settings-info-right {
        flex: 1 1;
        padding: 8px 40px;

        .account-settings-info-title {
            color: rgba(0, 0, 0, 0.85);
            font-size: 20px;
            font-weight: 500;
            line-height: 28px;
            margin-bottom: 12px;
        }
        .account-settings-info-view {
            padding-top: 12px;
        }
    }
}
</style>
