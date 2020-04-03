<template>
  <div>
    <a-menu mode="inline" theme="dark" :selectedKeys="selectedKeys">
      <a-menu-item
        v-for="(m, index) in addRoutes[0].children || []"
        :key="m.path"
        v-if="m.showside"
      >
        <router-link :to="{ path: m.path }">
          <a-icon :type="m.icon" />
          <span>{{ m.title }}</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      selectedKeys: []
    };
  },
  computed: {
    ...mapState({
      role: state => state.user.role,
      department: state => state.user.department,
      post: state => state.user.post,
      isadmin: state => state.user.isadmin
    }),
    ...mapGetters(["addRoutes"])
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
      console.log("this.$route.matched111111111111111111", this.$route.matched);
      this.selectedKeys = [routes[1].path];
    },
    onOpenChange() {}
  }
};
</script>

<style lang="less" scoped></style>
