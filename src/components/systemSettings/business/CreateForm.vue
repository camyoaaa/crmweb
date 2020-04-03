<template>
  <a-modal
    title="新增业务"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" ref="form">
        <a-form-item
          label="业务名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="visible"
        >
          <a-input
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入业务姓名'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="业务内容"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['content']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { add } from "@/myapi/business.js";

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
          try {
            let addresult = await add(values);
            console.log("addresult", addresult);
            if (addresult.status == 200) {
              this.$notification.success({
                message: "成功",
                description: "新增业务成功"
              });
            } else {
              throw new Error();
            }
          } catch (error) {
            this.$notification.success({
              message: "失败",
              description: "新增业务失败"
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
