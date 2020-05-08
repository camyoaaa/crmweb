<template>
    <div style="margin:-22px -16px 0px -15px;background:white;padding:16px 16px 0px 16px">
        <a-tabs>
            <a-tab-pane key="1" tab="菜单权限">
                <!-- <permission-manage /> -->
                <permissionManage />
            </a-tab-pane>
            <a-tab-pane key="2" tab="客户来源">
                <customFromManage />
            </a-tab-pane>
            <!-- <a-tab-pane key="3" tab="支付设置">
                <paywayManage />
            </a-tab-pane> -->
        </a-tabs>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import permissionManage from "./permissionManage/index.vue";
import customFromManage from "./customfrom/index.vue";
import paywayManage from "./paySetting/index.vue";
export default {
    name: "config",
    components: { permissionManage, customFromManage, paywayManage },
    computed: {
        ...mapState({
            appRoleList: state => state.appconfig.appRoleList,
            role: state => state.user.role
        })
    },
    data() {
        return {
            selectedKeys: []
        };
    },
    created() {
        if (this.appRoleList.find(r => r.id === this.role).name !== "管理员") {
            this.$router.push({ path: "/403" });
        }
    },
    watch: {},
    methods: {}
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
