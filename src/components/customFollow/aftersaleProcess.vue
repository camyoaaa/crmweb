<template>
  <a-card title="售后进度">
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
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
          <a-form-model-item label="活动进度">
            <a-select v-model="form.activityStep">
              <a-select-option :value="1">
                第 1 次
              </a-select-option>
              <a-select-option :value="2">
                第 2 次
              </a-select-option>
              <a-select-option :value="3">
                第 3 次
              </a-select-option>
            </a-select>
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
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    };
  }
};
</script>

<style lang="less" scoped></style>
