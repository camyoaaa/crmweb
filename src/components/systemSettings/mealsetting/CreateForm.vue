<template>
  <a-modal
    title="新增套餐"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <!-- {{this.form.getFieldValue('content')}} -->
      <a-form :form="form" ref="form">
        <a-form-item
          label="套餐名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入套餐名称'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="套餐价格"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            style="width:100%"
            v-decorator="[
              'price',
              {
                rules: [
                  {
                    required: true,
                    message: '请设置套餐价格'
                  }
                ]
              }
            ]"
          />
        </a-form-item>

        <a-form-item
          label="套餐最低定金"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            style="width:100%"
            v-decorator="[
              'minDeposit',
              {
                initialValue: 100,
                rules: [{ required: true, message: '请输入套餐最低定金' }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="套餐业务"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <business-select
            v-decorator="[
              'content',
              { initialValue: { selects: [], labels: [] } }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="活动次数"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            style="width:100%"
            v-decorator="['activity', { initialValue: 0 }]"
          ></a-input-number>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { add } from "@/myapi/meal.js";

export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this)
    };
  },
  methods: {
    add() {
      this.visible = true;
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this;
      this.confirmLoading = true;
      validateFields(async (errors, values) => {
        if (!errors) {
          console.log("values", values);
          try {
            let { content, ...other } = values;
            other.content = content.selects;
            other.contentZn = content.labels;
            let addresult = await add(other);
            console.log("addresult", addresult);
            if (addresult.status == 200) {
              this.$notification.success({
                message: "成功",
                description: "新增套餐成功"
              });
            } else {
              throw new Error();
            }
          } catch (error) {
            this.$notification.success({
              message: "失败",
              description: "新增套餐失败"
            });
          } finally {
            this.visible = false;
            this.confirmLoading = false;
            this.$emit("ok", values);
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.form.resetFields();
    }
  }
};
</script>
