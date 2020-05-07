<template>
    <a-modal title="新增父级套餐" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form-model :model="form" ref="form" :rules="formRules" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-form-model-item label="套餐名称" prop="name">
                    <a-input v-model="form.name" />
                </a-form-model-item>
            </a-form-model>
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
            form: {},
            formRules: {
                name: [
                    {
                        required: true,
                        message: "请输入套餐名称",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        open() {
            this.visible = true;
        },
        handleSubmit() {
            this.$refs.form.validate(async valid => {
                if (!valid) {
                    return;
                }
                try {
                    this.confirmLoading = true;
                    let addresult = await add(this.form);
                    if (addresult.status == 200) {
                        this.$notification.success({
                            message: "成功",
                            description: "新增套餐成功"
                        });
                    } else {
                        throw new Error();
                    }
                } catch (error) {
                    this.$notification.error({
                        message: "失败",
                        description: "新增套餐失败"
                    });
                } finally {
                    this.confirmLoading = false;
                    this.handleCancel();
                    this.$emit("ok");
                }
            });
        },
        handleCancel() {
            this.visible = false;
            this.$refs.form.resetFields();
        }
    }
};
</script>
