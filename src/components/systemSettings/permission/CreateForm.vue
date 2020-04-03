<template>
    <a-modal title="新增菜单" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            {{this.form.getFieldValue('departmentPost')}}
            <a-form :form="form" ref="form">
                <a-form-item label="父级菜单" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="visible">
                    <parent-menu v-decorator="['pmenu',{initialValue:{mid:'',path:'',parents:[],parentsPath:''},rules:[{required:true}]}]" />
                </a-form-item>
                <a-form-item label="菜单名称" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
                    <div style="display:flex;align-items:center">
                        <icon-selector v-decorator="['icon']"></icon-selector>
                        <a-input style="flex:1" v-decorator="['name',{rules:[{required:true,message:'请输入菜单名称'}]}]" />
                    </div>
                </a-form-item>
                <a-form-item label="可见部门岗位" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="visible">
                    <org-tree-select v-decorator="['departmentPost',{initialValue:{ids:[],labels:[]},rules:[{required:true,message:'请选择可见部门岗位'}]}]" />
                </a-form-item>
                <a-form-item label="菜单路径" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
                    <a-input v-decorator="['path']" addonBefore="/" />
                </a-form-item>
                <a-form-item label="重定向子菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="['redirect']" addonBefore="/" />
                </a-form-item>
                <a-form-item label="显示菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-switch style="width:50%" checkedChildren="显示" unCheckedChildren="隐藏" :defaultChecked="true" v-decorator="['showside']" />
                </a-form-item>
                <a-form-item label="菜单描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input type="textarea" v-decorator="['content']" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>

import { add } from "@/myapi/menu.js";

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
    beforeCreate() {
        this.form = this.$form.createForm(this, {
            name: "customized_form_controls"
        });
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
                        let newMenu = {
                            ...values,
                            enableDepartmentPost: values.departmentPost.ids,
                            enableDepartmentPostTags: values.departmentPost.labels.join(
                                ","
                            ),
                            pid: values.pmenu.mid,
                            path: `${values.pmenu.path}/${values.path}`,
                            parents: values.pmenu.parents.concat([
                                values.pmenu.mid
                            ]),
                            parentsPath: `${values.pmenu.parentsPath},${values.pmenu.mid}`
                        };
                        if (values.redirect) {
                            newMenu.redirect = `${values.pmenu.path}/${values.path}/${values.redirect}`;
                        }
                        let addresult = await add(newMenu);

                        console.log("addresult", addresult);
                        if (addresult.status == 200) {
                            this.$notification.success({
                                message: "成功",
                                description: "新增菜单成功"
                            });
                        } else {
                            throw new Error();
                        }
                    } catch (error) {
                        this.$notification.success({
                            message: "失败",
                            description: "新增菜单失败"
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
