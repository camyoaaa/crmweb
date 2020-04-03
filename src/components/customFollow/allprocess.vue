<template>
  <a-card>
    <div slot="title">
      <router-link :to="{ path: '/customerService' }">
        <a-button type="link" icon="arrow-left"></a-button>
      </router-link>
      跟进进度
    </div>
    <a-steps style="margin:0px -20px" :current="1" size="small" progressDot>
      <a-step title="新客户"> </a-step>
      <a-step title="沟通中" status="process"> </a-step>
      <a-step title="已成交"> </a-step>
      <a-step title="售后中"> </a-step>
      <a-step title="已完成"> </a-step>
    </a-steps>
  </a-card>
</template>

<script>
export default {};
</script>

<style lang="less" scoped></style>
