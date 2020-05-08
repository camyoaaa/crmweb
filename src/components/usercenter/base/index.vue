<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <a-form-item label="工号">
            <a-input disabled v-model="form.account" />
          </a-form-item>
          <a-form-item label="员工姓名">
            <a-input disabled v-model="form.name" />
          </a-form-item>
          <a-form-item label="登陆密码">
            <a-input-password v-model="form.password" />
          </a-form-item>
          <a-form-item label="手机">
            <a-input placeholder="phone" v-model="form.phone" />
          </a-form-item>
          <a-form-item label="Q Q">
            <a-input placeholder="qq" v-model="form.qq" />
          </a-form-item>
          <a-form-item label="微信">
            <a-input placeholder="微信" v-model="form.wx" />
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input placeholder="邮箱" v-model="form.email" />
          </a-form-item>
          <a-form-item :colon="false">
            <span slot="label"></span>
            <div style="text-align:center">
              <a-button type="primary" @click="updateUserinfo">保存</a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
          <a-icon type="cloud-upload-o" class="upload-icon" />
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img" />
        </div>
        <div class="username">{{ user.username }}</div>
      </a-col>
    </a-row>

    <avatar-modal ref="modal" @ok="setavatar" />
  </div>
</template>

<script>
import AvatarModal from "./AvatarModal";
import { mapState, mapActions } from "vuex";
import { updateUserinfo } from "@/myapi/auth.js";

export default {
  components: {
    AvatarModal
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
    itemLayout() {
      return {
        labelCol: {
          sm: { span: 24 },
          md: { span: 6 },
          lg: { span: 8 }
        },
        wrapperCol: {
          sm: { span: 24 },
          md: { span: 18 },
          lg: { span: 16 }
        }
      };
    }
  },

  created() {
    this.form.account = this.user.account;
    this.form.password = this.user.password;
    this.form.name = this.user.name;
    this.form.phone = this.user.phone;
    this.form.qq = this.user.qq;
    this.form.wx = this.user.wx;
    this.form.email = this.user.email;
    this.option.img = this.user.avatar;
  },
  data() {
    return {
      // cropper
      preview: {},
      option: {
        img: "",
        info: true,
        size: 1,
        outputType: "jpeg",
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      form: {
        account: "",
        password: "",
        name: "",
        qq: "",
        wx: "",
        email: ""
      }
    };
  },
  methods: {
    ...mapActions(["GetInfo"]),

    setavatar(url) {
      this.option.img = url;
    },
    async updateUserinfo() {
      console.log(updateUserinfo);
      try {
        let res = await updateUserinfo(this.form);
        if (res.status == 200) {
          this.$notification.success({
            message: "成功",
            description: "基本设置保存成功"
          });
          this.GetInfo();
        }
      } catch (error) {
        console.log(error);
        this.$notification.error({
          message: "失败",
          description: "基本设置保存失败,请重试"
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
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
.username {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
}
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
