<template>
  <!-- <a-select :value="value" @change="onchange">
    <a-select-option v-for="py in paywayList" :key="py.value" :value="py.value">
      <a-icon :type="py.icon" :style="{ color: py.iconcolor }"></a-icon>
      {{ py.label }}
    </a-select-option>
  </a-select> -->

  <a-radio-group @change="onchange" :value="value">
    <a-radio-button v-for="py in paywayList" :key="py.value" :value="py.value"
      ><a-icon :type="py.icon" :style="{ color: py.iconcolor }"></a-icon>
      {{ py.label }}</a-radio-button
    >
  </a-radio-group>
</template>

<script>
export default {
  name:'PayWay',
  model: {
    event: "change",
    prop: "value"
  },
  props: ["value"],
  data() {
    return {
      paywayList: [
        {
          icon: "alipay",
          iconcolor: "rgb(22,19,255)",
          value: 1,
          label: "支付宝支付"
        },
        {
          icon: "wechat",
          iconcolor: "rgb(42,162,70)",
          value: 2,
          label: "微信支付"
        },
        {
          icon: "credit-card",
          iconcolor: "rgb(230,0,18)",
          value: 3,
          label: "银行卡"
        }
        // {
        //   icon: "money-collect",
        //   iconcolor: "rgb(114, 46, 209)",
        //   value: 4,
        //   label: "其他"
        // }
      ]
    };
  },
  methods: {
    onchange({ target: { value: select } }) {
      console.log(select);
      this.$emit("change", select);
    }
  }
};
</script>

<style lang="less" scoped></style>
