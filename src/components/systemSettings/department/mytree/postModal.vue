<template>
  <a-modal
    title="新增岗位"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="所属部门"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            read-only
            v-decorator="[
              'department',
              { rules: [{ required: true, message: '请输入部门名称' }] }
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item
          label="岗位名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入岗位名称' }] }
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item
          v-if="visible"
          label="上属岗位"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <post-select
            v-decorator="['parentpost', { initialValue: { id: '', name: '' } }]"
            :departmentid="department.id"
          ></post-select>
        </a-form-item>
        <a-form-item
          label="岗位描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            type="textarea"
            v-decorator="['content']"
            placeholder="请输入岗位描述"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addPost } from "@/myapi/department.js";
export default {
  created() {
    this.form = this.$form.createForm(this, {
      name: "customized_form_controls"
    });
  },
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
      department: {
        id: "",
        name: ""
      },
      form: {}
    };
  },
  methods: {
    open(department) {
      this.department = department;
      this.$nextTick().then(() => {
        this.form.setFieldsValue({ department: department.name });
      });
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
      this.department = {};
      this.form.resetFields();
    },
    async handleSubmit() {
      const {
        form: { validateFields },
        $notification
      } = this;
      this.confirmLoading = true;

      try {
        validateFields(async (errors, values) => {
          if (!errors) {
            let addresult = await addPost({
              ...values,
              did: this.department.id,
              superpid: values.parentpost.id,
              superpname: values.parentpost.name
            });
            $notification.success({
              message: "岗位新增成功!"
            });
            this.$emit("ok");
          } else {
            this.confirmLoading = false;
          }
        });
      } catch (error) {
        $notification.error({
          message: "岗位新增失败!"
        });
      } finally {
        this.handleCancel();
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
