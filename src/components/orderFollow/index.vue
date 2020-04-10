<template>
    <div style="height:100%">
        <a-row :gutter="24">
            <a-col :span="13">
                <a-card>
                    <div slot="title">
                        <router-link :to="{ path: '/customerAftersales' }">
                            <a-button type="link" icon="arrow-left"></a-button>
                        </router-link>
                        {{`${(form.customInfo||{}).name}-${(form.mealInfo || {}).name} - 售后详情`}}
                    </div>
                    <!-- {{ form }} -->
                    <a-descriptions title="订单信息">
                        <a-descriptions-item label="订单编号">{{(form.orderInfo || {}).oid}}</a-descriptions-item>
                        <a-descriptions-item label="订购套餐">{{(form.mealInfo || {}).name}}</a-descriptions-item>
                        <a-descriptions-item label="订单金额">{{(form.orderInfo || {}).amount}}</a-descriptions-item>
                        <a-descriptions-item label="已收金额">{{(form.payreceiptList || []).reduce((p1,p2)=>p1.money||0 + p2.money||0,0)}}</a-descriptions-item>
                        <a-descriptions-item label="订单备注">
                            {{(form.orderInfo || {}).remark}}
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions title="客户信息">
                        <a-descriptions-item label="客户编号">{{(form.customInfo || {}).cid}}</a-descriptions-item>
                        <a-descriptions-item label="客户名称">{{(form.customInfo || {}).name}}</a-descriptions-item>
                        <a-descriptions-item label="客户手机">{{(form.customInfo || {}).phone}}</a-descriptions-item>
                        <a-descriptions-item label="客户微信">{{(form.customInfo || {}).wx}}</a-descriptions-item>
                        <a-descriptions-item label="客户Q Q">
                            {{(form.customInfo || {}).qq}}
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-divider></a-divider>
                    <a-form-model :model="form">
                        <a-row :gutter="48">
                            <a-col :span="8">
                                <a-form-model-item label="全部完成">
                                    <a-switch style="width:30%" :value="form.isEnd == 1" @change="(checked)=>form.isEnd = checked?1:2" checkedChildren="是" unCheckedChildren="否"></a-switch>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="是否营业">
                                    <a-select v-model="form.isOpen">
                                        <a-select-option :value="1">
                                            未知
                                        </a-select-option>
                                        <a-select-option :value="2">
                                            营业中
                                        </a-select-option>
                                        <a-select-option :value="3">
                                            未营业
                                        </a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="店铺名称">
                                    <a-input v-model="form.shopName"></a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="PC店铺地址">
                                    <a-input v-model="form.pcshopUrl"></a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="手机店铺地址">
                                    <a-input v-model="form.mbshopUrl"></a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="教学阶段">
                                    <a-select v-model="form.teachStep">
                                        <a-select-option :value="1">
                                            未开始
                                        </a-select-option>
                                        <a-select-option :value="2">
                                            初级阶段
                                        </a-select-option>
                                        <a-select-option :value="3">
                                            中级阶段
                                        </a-select-option>
                                        <a-select-option :value="4">
                                            高级阶段
                                        </a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="活动次数">
                                    <a-input-number v-model="form.activityStep" style="width:100%" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="活动状态">
                                    <a-select v-model="form.activityStatus">
                                        <a-select-option :value="1">
                                            未开始
                                        </a-select-option>
                                        <a-select-option :value="2">
                                            审核中
                                        </a-select-option>
                                        <a-select-option :value="3">
                                            已完成
                                        </a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="16">
                                <a-form-model-item label="备注">
                                    <a-input type="textarea" :rows="3" v-model="form.remark"></a-input>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                    </a-form-model>
                </a-card>
            </a-col>
            <a-col :span="11">
                <follow-record :oid="this.oid" @submit="submitAftersales"></follow-record>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { getOne, modify } from "@/myapi/aftersale.js";
import { mapState } from "vuex";
export default {
    name: "customDetail",
    data() {
        return {
            form: {},
            followRecord: ""
        };
    },
    computed: {
        ...mapState({
            userAvatar: state => state.user.avatar,
            userAccount: state => state.user.account,
            userName: state => state.user.name,
            departmentpostZn: state => state.user.departmentpostZn
        }),
        oid() {
            return Number(this.$route.query.oid);
        }
    },
    created() {
        this.getAftersaleInfo();
    },
    methods: {
        async getAftersaleInfo() {
            if (!this.oid) return;
            try {
                let result = await getOne({ oid: this.oid });
                this.form = result.data || {};
                console.log("this.form", this.form);
            } catch (error) {
                console.log(error);
            }
        },
        async submitAftersales() {
            try {
                let result = await modify(this.form);
                if (result.status == 200) {
                    this.getAftersaleInfo();
                } else {
                    throw new Error("更新失败");
                }
            } catch (error) {
                console.log("error", error);
                this.$notification.error({
                    message: "更新失败",
                    description: `请检查网络,或者重试`
                });
            }
        },
        handleChange(e) {
            this.value = e.target.value;
        }
    }
};
</script>
