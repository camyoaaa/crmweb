<template>
    <a-modal title="新增客户" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form" ref="form">
                <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="[
              'name',
              {
                initialValue: '客户',
                rules: [
                  {
                    required: true,
                    message: '请输入客户名称'
                  }
                ]
              }
            ]" />
                </a-form-item>
                <a-form-item label="客户来源" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="visible">
                    <custom-from-select preselect v-decorator="['from']" />
                </a-form-item>
                <a-form-item label="分配销售" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="visible">
                    <staff-select role-name="销售员" v-decorator="['seller']" detail />
                </a-form-item>
                <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <id-input v-decorator="['phone']" placeholder="请输入客户手机" />
                </a-form-item>
                <a-form-item label="客户微信" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="['wx']" placeholder="请输入客户微信" />
                </a-form-item>
                <a-form-item label="客户 Q Q" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <id-input v-decorator="['qq']" placeholder="请输入客户 Q Q" />
                </a-form-item>
                <a-form-item label=" 客户备注 " :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-textarea v-decorator="['remark']" placeholder="请输入客户备注" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
import { add } from "@/myapi/custom.js";
import { mapState } from "vuex";
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
            confirmLoading: false
        };
    },
    computed: {
        ...mapState({
            receptionist: state => state.user.account,
            receptionistName: state => state.user.name,
            roleList: state => state.appconfig.appRoleList
        }),
        sellerRole() {
            return;
        }
    },
    beforeCreate() {
        this.form = this.$form.createForm(this, {
            name: "customized_form_controls"
        });
    },
    methods: {
        open() {
            this.visible = true;
        },
        handleSubmit() {
            const {
                form: { validateFields }
            } = this;
            validateFields(async (errors, values) => {
                let { phone, wx, qq } = values;
                let hasContact = phone || wx || qq;
                if (!hasContact) {
                    this.$notification.error({
                        message: "缺少必填项",
                        description: "请至少输入一种联系方式"
                    });
                    return;
                }
                if (!errors) {
                    values.receptionist = this.receptionist;
                    try {
                        this.confirmLoading = true;
                        let addresult = await add({
                            ...values,
                            receptionist: this.receptionist
                        });
                        if (addresult.status == 200) {
                            this.$notification.success({
                                message: "成功",
                                description: "新增客户成功"
                            });
                        } else {
                            throw new Error();
                        }
                    } catch (error) {
                        this.$notification.success({
                            message: "失败",
                            description: "新增客户失败"
                        });
                    } finally {
                        this.confirmLoading = false;
                        this.handleCancel();
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
