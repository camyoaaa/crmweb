<template>
    <div>
        <a-menu mode="inline" theme="dark" :selectedKeys="selectedKeys">
            <a-menu-item v-for="(m, index) in MenuList" :key="m.path">
                <router-link :to="{ path: m.path }">
                    <a-icon :type="m.meta.icon || 'user'" />
                    <span>{{ m.meta.title }}</span>
                </router-link>
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import _CONSTANTS_ROUTERS from "../router/constantRoutes";

export default {
    data() {
        return {
            selectedKeys: []
        };
    },
    computed: {
        ...mapState({
            role: state => state.user.role,
            roleList: state => state.appconfig.appRoleList,
            department: state => state.user.department,
            post: state => state.user.post
        }),
        ...mapGetters(["addRoutes"]),
        MenuList() {
            return _CONSTANTS_ROUTERS
                .find(r => r.name === "Home")
                .children.filter(m => {
                    if (m.name === "SystemSettings") {
                        return (
                            !m.hidden &&
                            this.roleList.find(r => r.id === this.role).name ===
                                "管理员"
                        );
                    } else {
                        return !m.hidden;
                    }
                });
        }
    },
    created() {
        this.updateMenu();
    },
    watch: {
        $route(val) {
            this.updateMenu();
        }
    },
    methods: {
        updateMenu() {
            const routes = this.$route.matched.concat();
            console.log(
                "this.$route.matched111111111111111111",
                this.$route.matched
            );
            this.selectedKeys = [routes[1].path];
        },
        onOpenChange() {}
    }
};
</script>

<style lang="less" scoped></style>
