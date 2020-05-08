<template>
    <a-modal title="新增员工" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form" ref="form">
                <a-form-item label="员工姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入员工姓名'
                  }
                ]
              }
            ]" />
                </a-form-item>
                <a-form-item label="员工密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="[
              'password',
              {
                initialValue: 'my008008',
                rules: [
                  {
                    required: true,
                    message: '请设置员工初始密码'
                  }
                ]
              }
            ]" />
                </a-form-item>
                <a-form-item label="员工角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <role-select v-decorator="['role',{
                rules: [
                  {
                    required: true,
                    message: '请选择员工角色'
                  }
                ]
              }]" />
                </a-form-item>
                <a-form-item label="工作时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <work-in v-decorator="[
              'workin',
              { initialValue: [9, 18], rules: [{ required: true }] }
            ]">
                    </work-in>
                </a-form-item>
                <a-form-item label="日常任务量" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input-number v-decorator="[
              'daily',
              {
                rules: [{ required: true, message: '请输入日常任务量' }],
                initialValue: 20
              }
            ]" style="width:100%" />
                </a-form-item>
                <a-form-item label="员工手机" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="['phone']" />
                </a-form-item>
                <a-form-item label="员工微信" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="['wx']" />
                </a-form-item>
                <a-form-item label="员工Q Q" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="['qq']" />
                </a-form-item>
                <a-form-item label="员工邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="['email']" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
import { add } from "@/myapi/staff.js";

export default {
    data() {
        return {
            timepicker: 0,
            maxstaffNo: 10001,
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
                        if (addresult.status == 200) {
                            this.$notification.success({
                                message: "成功",
                                description: "新增员工成功"
                            });
                        } else {
                            throw new Error();
                        }
                    } catch (error) {
                        this.$notification.success({
                            message: "失败",
                            description: "新增员工失败"
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
