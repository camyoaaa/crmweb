<template>
  <div style="height:100%">
    <a-row :gutter="24">
      <a-col :span="13">
        <a-card>
          <div slot="title">
            <router-link :to="{ path: '/customerAftersales' }">
              <a-button type="link" icon="arrow-left"></a-button>
            </router-link>
            <a-avatar
              shape="square"
              :style="{ backgroundColor: '#7265e6', verticalAlign: 'middle' }"
              >{{ customName }}</a-avatar
            >
            售后详情
          </div>
          <!-- {{ form }} -->
          <a-form-model :model="form">
            <a-row :gutter="48">
              <a-col :span="8">
                <a-form-model-item label="客户名称">
                  <a-input :value="customName" disabled></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="客户编号">
                  <a-input :value="cid" disabled></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="全部完成">
                  <a-switch
                    style="width:30%"
                    v-model="form.isEnd"
                    checkedChildren="是"
                    unCheckedChildren="否"
                  ></a-switch>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :span="8">
                <a-form-model-item label="是否营业">
                  <a-select v-model="form.isOpen">
                    <a-select-option :value="1">
                      营业中
                    </a-select-option>
                    <a-select-option :value="2">
                      未营业
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="店铺名称">
                  <a-input v-model="form.shopName"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="PC店铺地址">
                  <a-input v-model="form.pcshopUrl"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="手机店铺地址">
                  <a-input v-model="form.mbshopUrl"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="教学阶段">
                  <a-select v-model="form.teachStep">
                    <a-select-option :value="1">
                      初级阶段
                    </a-select-option>
                    <a-select-option :value="2">
                      中级阶段
                    </a-select-option>
                    <a-select-option :value="2">
                      高级阶段
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="活动次数">
                  <a-input-number
                    v-model="form.activityStep"
                    style="width:100%"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="活动状态">
                  <a-select v-model="form.activityStatus">
                    <a-select-option :value="1">
                      未开始
                    </a-select-option>
                    <a-select-option :value="2">
                      审核中
                    </a-select-option>
                    <a-select-option :value="3">
                      已完成
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="备注">
                  <a-input
                    type="textarea"
                    :rows="6"
                    v-model="form.remark"
                  ></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-card>
      </a-col>
      <a-col :span="11">
        <follow-record :cid="this.cid" @submit="submitCustom"></follow-record>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getOne, modify } from "@/myapi/aftersale.js";
import { mapState } from "vuex";
export default {
  name: "customDetail",
  data() {
    return {
      form: {},
      followRecord: ""
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
    },
    customName() {
      return this.$route.query.name;
    }
  },
  created() {
    this.getAftersaleInfo();
  },
  methods: {
    async getAftersaleInfo() {
      if (!this.cid) return;
      try {
        let result = await getOne({ cid: this.cid });
        this.form = result.data || {};
      } catch (error) {
        console.log(error);
      }
    },
    async submitCustom() {
      console.log("submitCustom");
      try {
        let result = await modify({ ...this.form, cid: this.cid });
        if (result.status == 200) {
          this.getAftersaleInfo();
        } else {
          throw new Error("更新失败");
        }
      } catch (error) {
        console.log("error", error);
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

<style lang="less" scoped></style>
