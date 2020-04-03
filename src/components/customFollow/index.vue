<template>
  <div style="height:100%">
    <a-row :gutter="24">
      <a-col :span="13">
        <a-card>
          <div slot="title">
            <router-link :to="{ path: '/customerService' }">
              <a-button type="link" icon="arrow-left"></a-button>
            </router-link>
            客户详情
          </div>
          <a-form>
            <a-row :gutter="48">
              <a-col :span="8">
                <a-form-item label="客户名称">
                  <a-input v-model="custom.name"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="客户状态">
                  <custom-status-select v-model="custom.status" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="客户来源">
                  <custom-from-select v-model="custom.from" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="真实手机">
                  <a-input v-model="custom.phone" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="真实微信">
                  <a-input v-model="custom.wx" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="真实 Q Q">
                  <a-input v-model="custom.qq" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="省/直辖市/自治区">
                  <province-select v-model="custom.province" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="市/辖区">
                  <city-select
                    v-model="custom.city"
                    :province="custom.province"
                  ></city-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="区/县">
                  <county-select
                    v-model="custom.county"
                    :province="custom.province"
                    :city="custom.city"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="16">
                <a-form-item label="详细地址">
                  <a-input v-model="custom.address" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="身份证">
                  <id-input v-model="custom.idcard" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="接待备注">
                  <a-input
                    v-model="custom.remark"
                    type="textarea"
                    :rows="6"
                  ></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-col>
      <a-col :span="11">
        <follow-record :cid="cid" @submit="handleSubmit" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getOne, modify } from "@/myapi/custom.js";
import { mapState } from "vuex";
export default {
  name: "customDetail",
  data() {
    return {
      custom: {
        followList: []
      }
    };
  },
  computed: {
    ...mapState({
      userAvatar: state => state.user.avatar,
      userAccount: state => state.user.account,
      userName: state => state.user.name,
      departmentpostZn: state => state.user.departmentpostZn
    }),
    cid() {
      return this.$route.query.cid;
    }
  },
  created() {
    this.getCustomInfo();
  },
  methods: {
    async getCustomInfo() {
      if (!this.cid) return;
      try {
        let result = await getOne(this.cid);
        this.custom = result.data || {};
      } catch (error) {}
    },
    async updateCustomInfo() {},
    async handleSubmit() {
      try {
        let result = await modify(this.custom);
        if (result.status == 200) {
          this.getCustomInfo();
        } else {
          throw new Error("更新失败");
        }
      } catch (error) {
        this.$notification.error({
          message: "更新失败",
          description: `请检查网络,或者重试`
        });
      }
    },
    handleChange(e) {
      this.value = e.target.value;
    }
  }
};
</script>
