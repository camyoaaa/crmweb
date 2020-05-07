<template>
    <div style="height:100%">
        <a-row :gutter="24">
            <a-col :span="13">
                <a-card>
                    <div slot="title">
                        <a-button type="link" icon="arrow-left" @click="$router.go(-1)"></a-button>
                        {{`${form.customInfo.name}-${form.mealInfo.name} - 售后详情`}}
                    </div>
                    <!-- {{ form }} -->
                    <a-descriptions title="订单信息">
                        <a-descriptions-item label="订单编号">
                            <router-link :to="{path:'/orderDetail',query:{oid:form.oid}}">{{form.oid}}</router-link>
                        </a-descriptions-item>
                        <a-descriptions-item label="订购套餐">{{form.mealInfo.name}}</a-descriptions-item>
                        <a-descriptions-item label="订单金额">{{form.money | numformat}}</a-descriptions-item>
                        <a-descriptions-item label="已收金额">{{form.payreceiptList.reduce((p1money,p2)=>p1money + p2.money||0,0) | numformat}}</a-descriptions-item>
                        <a-descriptions-item label="订单备注">{{form.remark || '无'}}</a-descriptions-item>
                        <a-descriptions-item label="创建时间">{{form.createTime | dateformat}}</a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions title="客户信息">
                        <a-descriptions-item label="客户编号">
                            <router-link :to="{path:'/customDetail',query:{cid:form.customInfo.cid}}">{{form.customInfo.cid}}</router-link>
                        </a-descriptions-item>
                        <a-descriptions-item label="客户名称">{{form.customInfo.name}}</a-descriptions-item>
                        <a-descriptions-item label="客户手机">{{form.customInfo.phone}}</a-descriptions-item>
                        <a-descriptions-item label="客户微信">{{form.customInfo.wx}}</a-descriptions-item>
                        <a-descriptions-item label="客户Q Q">
                            {{form.customInfo.qq}}
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-divider></a-divider>
                    <a-form-model :model="form">
                        <a-row :gutter="48">
                            <a-col :span="8">
                                <a-form-model-item label="全部完成">
                                    <a-switch style="width:30%" :checked="form.isEnd == 1" @change="(checked)=>form.isEnd = checked?1:2" checkedChildren="是" unCheckedChildren="否"></a-switch>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="是否营业">
                                    <a-select v-model="form.isOpen">

                                        <a-select-option v-for="ts in shopStatusList" :key="ts.id" :value="ts.id">
                                            {{ts.name}}
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
                                        <a-select-option v-for="ts in teachStatusList" :key="ts.id" :value="ts.id">
                                            {{ts.name}}
                                        </a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item>
                                    <span slot="label">
                                        总活动次数
                                        <a-tooltip title="结合套餐活动次数及订单备注中赠送的活动次数" placement="right">
                                            <a-icon type="info-circle"></a-icon>
                                        </a-tooltip>
                                    </span>
                                    <a-input-number v-model="form.totalActivity" style="width:100%" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="当前活动次数">
                                    <a-input-number v-model="form.activityStep" style="width:100%" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-model-item label="活动状态">
                                    <a-select v-model="form.activityStatus">
                                        <a-select-option v-for="ts in activeStatusList" :key="ts.id" :value="ts.id">
                                            <a-badge :status="ts.status" :text="ts.name"></a-badge>
                                        </a-select-option>

                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="24">
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
import { getList, modify } from "@/myapi/aftersale.js";
import { mapState } from "vuex";
export default {
    name: "customDetail",
    data() {
        return {
            form: {
                customInfo: {},
                mealInfo: {},
                contractList: [],
                payreceiptList: []
            },
            followRecord: ""
        };
    },
    computed: {
        ...mapState({
            teachStatusList: state => state.appconfig.teachStatusList,
            shopStatusList: state => state.appconfig.shopStatusList,
            activeStatusList: state => state.appconfig.activeStatusList,
            role: state => state.user.role,
            roleList: state => state.appconfig.appRoleList
        }),
        oid() {
            return Number(this.$route.query.oid);
        }
    },
    created() {
        if (
            ["管理员", "售后员", "售后经理"].includes(
                this.roleList.find(r => r.id === this.role).name
            )
        ) {
            this.getAftersaleInfo();
        } else {
            this.$router.push({ path: "/403" });
        }
    },
    methods: {
        async getAftersaleInfo() {
            if (!this.oid) return;
            try {
                let result = await getList({ orderid: this.oid });
                this.form = result.result.data[0];
                console.log("this.form", this.form);
            } catch (error) {
                console.log(error);
            }
        },
        async submitAftersales() {
            try {
                if (this.form.isEnd === 1) {
                    this.form.endTime = Date.now();
                }
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
