<template>
  <div class="user-wrapper">
    <div class="">
      <a-switch
        :checked="userstatus == 1"
        checkedChildren="工作中"
        unCheckedChildren="暂停业务"
        @change="statusChange"
        :loading="statusloading"
      />
      <a-tooltip :title="isFullscreen ? '退出全屏' : '全屏显示'">
        <a-button
          style="margin-left:10px;"
          :icon="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
          size="small"
          @click="clickFullscreen"
        ></a-button>
      </a-tooltip>
      <notice-icon class="action" style="cursor:pointer"></notice-icon>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar style="backgroundColor:#87d068;" :src="avatar" />
          <span style="margin-left:10px;font-size:14px">{{ username }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ path: '/usercenter/base' }">
              <a-icon type="user" />
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="1">
            <a @click="logout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import screenfull from "screenfull";
import NoticeIcon from "./NoticeIcon";
import { mapActions, mapState } from "vuex";
import { updateUserinfo } from "@/myapi/auth.js";
export default {
  components: { NoticeIcon },
  computed: {
    ...mapState({
      username: state => state.user.name,
      userstatus: state => state.user.status,
      avatar: state => state.user.avatar
    })
  },
  data() {
    return {
      statusloading: false,
      isFullscreen: false
    };
  },
  methods: {
    ...mapActions(["Logout", "GetInfo"]),
    async statusChange(checked) {
      console.log(checked);
      try {
        this.statusloading = true;
        let updateStatus = await updateUserinfo({
          status: checked ? 1 : 2
        });
        this.GetInfo();
      } catch (error) {
        console.log(error);
      } finally {
        this.statusloading = false;
      }
    },
    logout() {
      console.log("logout");
      this.$confirm({
        title: "提示",
        content: "真的要注销登录吗 ?",
        onOk: () => {
          return this.Logout({})
            .then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 16);
            })
            .catch(err => {
              this.$message.error({
                title: "错误",
                description: err.message
              });
            });
        },
        onCancel() {}
      });
    },
    clickFullscreen() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: "you browser can not work",
          type: "warning"
        });
        return false;
      }
      this.isFullscreen = !this.isFullscreen;
      screenfull.toggle();
    }
  }
};
</script>
