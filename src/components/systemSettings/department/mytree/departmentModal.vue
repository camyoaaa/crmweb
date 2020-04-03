<template>
  <a-modal
    title="新增部门"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="部门名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <div style="display:flex;align-items:center">
            <icon-selector v-decorator="['icon']"></icon-selector>
            <a-input
              style="flex:1"
              v-decorator="[
                'name',
                { rules: [{ required: true, message: '请输入部门名称' }] }
              ]"
            ></a-input>
          </div>
        </a-form-item>
        <a-form-item
          label="部门描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            type="textarea"
            v-decorator="['content']"
            placeholder="请输入部门描述"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addDepartment } from "@/myapi/department.js";
export default {
  name: "departmentModal",
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
    open() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
      this.form.resetFields();
    },
    async handleSubmit() {
      let {
        form: { validateFields },
        $notification,
        confirmLoading
      } = this;
      validateFields(async (errors, values) => {
        try {
          if (!errors) {
            confirmLoading = true;
            let addresult = await addDepartment(values);
            if (addresult.status == 200) {
              this.$emit("ok");
              $notification.success({
                message: "部门新增成功!"
              });
            }
          }
        } catch (error) {
          $notification.error({
            message: "部门新增失败!"
          });
        } finally {
          this.handleCancel();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
