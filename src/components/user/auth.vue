<template>
  <div style="height:100%;">
    <div class="log_main" style="height:100%;padding-top:60px">
      <!-- <h1>5分钟<br />生成一份惊艳的简历</h1> -->
      <h1>5分钟<br />帮助一个客户实现开店梦想</h1>

      <div class="rygl_up">
        <ul id="tab">
          <!-- <li :class="{ current: mode != 'regist' }" @click="mode = 'regist'">
                        注册
                    </li> -->
          <li @click="mode = 'login'">
            登录
          </li>
        </ul>
        <div id="content">
          <ul style="display:block;">
            <div class="zhuce">
              <input
                type="text"
                v-model="account"
                placeholder="请输入员工号"
                class="zhuce_num"
              />
              <input
                v-model="password"
                type="password"
                :placeholder="
                  mode == 'login' ? '请输入密码' : '请设置密码（6-16位）'
                "
                class="zhuce_psd"
              />
              <!-- <org-tree-select v-if="mode == 'regist'" single-select v-model="departmentPost" style="width:100%;margin-bottom:20px" /> -->
              <div class="denglu_zidong" v-if="mode == 'login'">
                <a-checkbox v-model="rememberMe">下次自动登录</a-checkbox>
                <span style=" float:right">忘记密码?请联系管理员</span>
              </div>
              <input
                @click="mysubmit"
                type="button"
                :value="mode == 'login' ? '立即登录' : '立即注册'"
                class="zhuce_btn"
                style="cursor:pointer"
              />
            </div>
          </ul>
        </div>
      </div>
    </div>
    <div style=" clear:both"></div>
  </div>
</template>

<script>
import md5 from "md5";
import { mapActions } from "vuex";
import { regist } from "@/myapi/auth";
import { timeFix } from "@/commonFunc.js";

export default {
  name: "Auth",
  data() {
    return {
      mode: "login", //regist
      account: "",
      role: "none",
      departmentPost: {
        ids: "",
        labels: ""
      },
      password: "",
      rememberMe: true
    };
  },
  methods: {
    ...mapActions(["Login", "Logout"]),
    //注册
    async regist() {
      if (!this.account || !this.password || !this.departmentPost.ids) {
        this.$notification.error({
          message: "请填写完整的注册信息"
        });
        return;
      }

      try {
        let res = await regist({
          account: this.account,
          password: this.password,
          department: this.departmentPost.ids.split("-")[0],
          role: this.departmentPost.ids.split("-")[1]
        });

        this.$notification.success({
          message: "提示",
          description: "注册成功!",
          duration: 2
        });
        this.mode = "login";
      } catch (error) {}
    },
    login() {
      if (!this.account || !this.password) {
        this.$notification.error({
          message: "请填写完整的登录信息"
        });
        return;
      }

      this.Login({
        account: this.account,
        password: this.password,
        rememberMe: this.rememberMe
      })
        .then(res => this.loginSuccess(res))
        .catch(err => this.requestFailed(err));
    },
    mysubmit() {
      if (this.mode == "login") {
        this.login();
      } else {
        this.regist();
      }
    },
    loginSuccess(res) {
      try {
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$router.push({ name: "Home" });
          this.$notification.success({
            message: "欢迎",
            description: `${timeFix()}，欢迎回来`
          });
        }, 1000);
        this.isLoginError = false;
      } catch (error) {
        console.log(error);
      }
    },
    requestFailed(err) {
      console.log(err);
      this.isLoginError = true;
      this.$notification["error"]({
        message: "错误",
        description:
          ((err.response || {}).data || {}).message ||
          `请求出现错误，请稍后再试`,
        duration: 4
      });
    }
  }
};
</script>

<style lang="css" scoped>
@import "./login.css";
.log_main {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
