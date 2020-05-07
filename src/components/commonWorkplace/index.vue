<template>
    <div>
        <workplace-header style="margin:-23px -16px 0px -15px;">
            <span slot="footer">
                <a-radio-group v-model="startTime1" buttonStyle="solid" @change="onButtonChange">
                    <a-radio-button v-for="start in startTimeList" :key="start.time" :value="start.label">{{ start.label }}</a-radio-button>
                </a-radio-group>
                <a-range-picker v-model="range"></a-range-picker>
            </span>

        </workplace-header>
        <a-row :gutter="20" style="margin-top:20px;">
            <a-col :span='12'>
                <a-card title="待办事项" :bordered="false" style="" class="todo">
                    <template v-if="isRole('接待员') || isRole('管理员')">
                        <a-skeleton :title="false" style="margin-bottom:-6px" />
                    </template>
                    <template v-if="isRole('销售经理')">
                        <a-card-grid style="width:25%;cursor:pointer" :hoverable="true" @click="$router.push({path:'/receiptManage',query:{status:reviewStatusList.find(r=>r.name==='等待审核').id}})">
                            <div class="title">待审核收据</div>
                            <div class="number">{{sellerManagerTodo.toReviewReceipt || 0}}</div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;cursor:pointer" :hoverable="true" @click="$router.push({path:'/contractManage',query:{status:reviewStatusList.find(r=>r.name==='等待审核').id}})">
                            <div class="title">待审核合同</div>
                            <div class="number">{{sellerManagerTodo.toReviewContract || 0}}</div>
                        </a-card-grid>
                        <a-card-grid style="width:50%;" :hoverable="false">
                            <a-skeleton :title="false" style="margin-bottom:-6px" />
                        </a-card-grid>
                    </template>
                    <template v-if="isRole('销售员')">
                        <a-card-grid style="width:25%;cursor:pointer" :hoverable="true" @click="$router.push({path:'/customManage',query:{seller:user.account,status:customStatusList.find(r=>r.name==='新客户').id}})">
                            <div class="title">新客户</div>
                            <div class="number">{{sellerTodo.newCustom || 0}}</div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;cursor:pointer" :hoverable="true" @click="$router.push({path:'/customManage',query:{seller:user.account}})">
                            <div class="title">待更进</div>
                            <div class="number">{{sellerTodo.tofollow || 0}}</div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;cursor:pointer" @click="$router.push({path:'/customManage',query:{seller:user.account}})">
                            <div class="title">跟进中</div>
                            <div class="number">{{sellerTodo.following || 0}}</div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;cursor:pointer" @click="$router.push({path:'/customManage',query:{seller:user.account,status:customStatusList.find(r=>r.name==='已成交').id}})">
                            <div class="title">已成交</div>
                            <div class="number">{{sellerTodo.haddeal || 0}}</div>
                        </a-card-grid>
                    </template>
                    <template v-if="isRole('售后经理')">
                        <a-card-grid style="width:25%;cursor:pointer" :hoverable="true" @click="$router.push({path:'/orderManage'})">
                            <div class="title">待分配订单</div>
                            <div class="number">{{aftersaleManagerTodo.toAllocOrder || 0}} 单</div>
                        </a-card-grid>
                        <a-card-grid style="width:75%;" :hoverable="false">
                            <a-skeleton :title="false" style="margin-bottom:-6px" />
                        </a-card-grid>
                    </template>
                    <template v-if="isRole('售后员')">
                        <!-- <a-card-grid style="width:25%;cursor:pointer" :hoverable="true">
                            <div class="title">新订单</div>
                            <div class="number">32</div>
                        </a-card-grid> -->
                        <a-card-grid style="width:25%;cursor:pointer" :hoverable="true" @click="$router.push({path:'/orderManage',query:{executor:user.account}})">
                            <div class="title">待更进</div>
                            <div class="number">{{aftersaleTodo.tofollow || 0}}</div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;cursor:pointer" @click="$router.push({path:'/orderManage',query:{executor:user.account}})">
                            <div class="title">跟进中</div>
                            <div class="number">{{aftersaleTodo.following || 0}}</div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;cursor:pointer" @click="$router.push({path:'/aftersaleManage',query:{executor:user.account,isEnd:1}})">
                            <div class="title">已完成</div>
                            <div class="number">{{aftersaleTodo.done || 0}}</div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;" :hoverable="false">
                            <a-skeleton :title="false" style="margin-bottom:-6px" />
                        </a-card-grid>
                    </template>
                </a-card>
            </a-col>
            <a-col :span="6">
                <chart-card :loading="loading" title="总业绩" total="￥126,560元">
                    <span slot="total">
                        ￥{{achievementData.total | numformat}}元
                        <!-- <trend flag="up" style="font-size:14px;margin-right: 16px;">
                            <span slot="term">同比</span>
                            12%
                        </trend> -->
                    </span>
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div style="display:flex;justify-content:space-around;align-items:center">
                        <span style="font-size:14px;font-weight:bold;">审核通过:{{achievementData.reviewPassed | numformat}}元</span>
                        <a-divider type="vertical"></a-divider>
                        <span style="font-size:14px;font-weight:bold;">未审核/驳回:{{(achievementData.noReview + achievementData.reviewReject) | numformat}}元</span>
                    </div>
                </chart-card>
            </a-col>
            <a-col :span="6">
                <chart-card :loading="loading" title="成交率">
                    <span slot="total">
                        {{customData.totalNumber?Number(customData.dealNumber/customData.totalNumber * 100).toFixed(2):0}}%
                        <!-- <trend flag="up" style="font-size:14px;margin-right: 16px;">
                            <span slot="term">同比</span>
                            12%
                        </trend> -->
                    </span>
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div style="display:flex;justify-content:space-around;align-items:center">
                        <span style="font-size:14px;font-weight:bold;">成交客户数:{{customData.dealNumber}}</span>
                        <a-divider type="vertical"></a-divider>
                        <span style="font-size:14px;font-weight:bold;">总客户数:{{customData.totalNumber}}</span>
                    </div>
                </chart-card>
            </a-col>
        </a-row>

        <a-card title="业绩详情" :bordered="false" style="margin-top:20px;">
            <chart :options="archivementOptions" style="width:100%" :key="2" :autoresize="true"></chart>
        </a-card>

        <a-card title="开单详情" :bordered="false" style="margin-top:20px;">
            <chart :options="orderOptions" style="width:100%" :key="2" :autoresize="true"></chart>
        </a-card>

        <a-row :gutter="20">
            <a-col :xs="24" :md="24" :lg="12" :xl="12" :xxl="12" style="margin-top:20px">
                <a-card title="客户来源" :bordered="false" style="">
                    <chart :options="fromOptions" style="width:100%" :key="1" :autoresize="true"></chart>
                </a-card>
            </a-col>
            <a-col :xs="24" :md="24" :lg="12" :xl="12" :xxl="12" style="margin-top:20px">
                <a-card title="时间段分析" :bordered="false" style="">
                    <chart :options="timeOptions" style="width:100%" :key="2" :autoresize="true"></chart>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import WorkplaceHeader from "@/commonItems/WorkplaceHeader.vue";
import ChartCard from "./ChartCard.vue";
import Trend from "./Trend.vue";
import { mapState } from "vuex";
import {
    getSellerManageTodo, //获取销售经理待办
    getSellerTodo, //获取销售待办
    getAftersaleManagerTodo, //获取售后经理待办
    getAftersaleTodo,
    getAchievementData, //获取业绩数据
    getCustomData,
    getAchievementOverview,
    getAchievementEvery,
    getOrderEvery,
    getReceiptCustoms,
    getCustomFrom,
    getCustomTime
} from "@/myapi/dashboard.js";
// 折线
import "echarts/lib/chart/line";
// 柱状图
import "echarts/lib/chart/pie";
// 柱状图
import "echarts/lib/chart/bar";

// 提示
import "echarts/lib/component/tooltip";
// 图例
import "echarts/lib/component/legend";
// 标题
import "echarts/lib/component/title";
// 标题
import "echarts/lib/component/toolbox";

export default {
    components: { WorkplaceHeader, ChartCard, Trend },
    computed: {
        ...mapState({
            roleList: state => state.appconfig.appRoleList,
            user: state => state.user,
            reviewStatusList: state => state.appconfig.reviewStatusList,
            customStatusList: state => state.appconfig.customStatusList
        })
    },
    data() {
        return {
            loading: false,
            receiptData: {}, //接待客户信息
            fromOptions: {},
            timeOptions: {},
            archivementOptions: {},
            orderOptions: {},
            achievementData: {},
            customData: {},
            sellerManagerTodo: {},
            sellerTodo: {},
            aftersaleManagerTodo: {},
            aftersaleTodo: {},
            startTime1: "今天",
            range: [
                this.$moment().startOf("date"),
                this.$moment().endOf("date")
            ],
            startTimeList: [
                {
                    label: "今天",
                    range: [
                        this.$moment().startOf("date"),
                        this.$moment().endOf("date")
                    ]
                },
                {
                    label: "本周",
                    range: [
                        this.$moment().startOf("week"),
                        this.$moment().endOf("week")
                    ]
                },
                {
                    label: "本月",
                    range: [
                        this.$moment().startOf("month"),
                        this.$moment().endOf("month")
                    ]
                },
                {
                    label: "本年",
                    range: [
                        this.$moment().startOf("year"),
                        this.$moment().endOf("year")
                    ]
                }
            ]
        };
    },
    created() {
        console.log("created");
        this.getTodo(); //获取待办信息
        this.getCalcData(); //获取统计信息
    },
    mounted() {
        this.orderOptions = {
            // 工具提示
            tooltip: {
                trigger: "item",
                formatter: "{b} : {c}"
            },
            // 工具箱
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true, name: "开单详情" }
                }
            },
            yAxis: {
                type: "value",
                minInterval: 1
            },
            xAxis: {
                type: "category",
                data: [],
                axisTick: {
                    interval: 0,
                    alignWithLabel: true
                },
                axisLabel: {
                    interval: 0,
                    rotate: 45
                }
            },
            series: [
                {
                    name: "开单详情",
                    data: [],
                    type: "bar",
                    label: {
                        show: true,
                        fontSize: 18,
                        fontStyle: "normal",
                        formatter: ({ data }) => {
                            return data.value
                                ? `${this.$numformat(data.value)}单`
                                : "";
                        }
                    },
                    barMinHeight: 10
                }
            ]
        };
        this.archivementOptions = {
            xAxis: {
                type: "category",
                data: [],
                axisTick: {
                    interval: 0,
                    alignWithLabel: true
                },
                axisLabel: {
                    interval: 0,
                    rotate: 45
                }
            },
            legend: {
                data: ["等待审核", "审核通过", "审核驳回"]
            },
            // 工具提示
            tooltip: {
                trigger: "item",
                formatter: "{a} : {b} : {c}"
            },
            // 工具箱
            toolbox: {
                show: true,
                feature: {
                    //   dataZoom: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true, name: "业绩详情" }
                }
            },
            yAxis: {
                type: "value",
                minInterval: 1
            },
            series: [
                {
                    name: "等待审核",
                    data: [],
                    type: "bar",
                    stack: "archivement",
                    barMinHeight: 15,
                    label: {
                        show: true,
                        // position: "top",
                        fontStyle: "normal",
                        formatter: ({ data }) => {
                            return data.value
                                ? `${this.$numformat(data.value)}`
                                : "";
                        }
                    }
                },
                {
                    name: "审核通过",
                    data: [],
                    type: "bar",
                    stack: "archivement",
                    barMinHeight: 15,
                    label: {
                        show: true,
                        // position: "top",
                        fontStyle: "normal",
                        formatter: ({ data }) => {
                            return data.value
                                ? `${this.$numformat(data.value)}`
                                : "";
                        }
                    }
                },
                {
                    name: "审核驳回",
                    data: [],
                    type: "bar",
                    stack: "archivement",
                    barMinHeight: 15,
                    label: {
                        show: true,
                        // position: "top",
                        fontStyle: "normal",
                        formatter: ({ data }) => {
                            return data.value
                                ? `${this.$numformat(data.value)}`
                                : "";
                        }
                    }
                }
            ]
        };
        this.timeOptions = {
            // 工具提示
            tooltip: {
                trigger: "item",
                formatter: "{b} : {c}"
            },
            // 工具箱
            toolbox: {
                show: true,
                feature: {
                    //   dataZoom: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true, name: "客户时间段" }
                }
            },
            yAxis: {
                type: "value",
                minInterval: 1
            },
            xAxis: {
                type: "category",
                data: []
            },
            series: [
                {
                    name: "客户时间段",
                    data: [],
                    type: "line"
                }
            ]
        };
        this.fromOptions = {
            legend: {
                orient: "vertical",
                left: "left",
                top: "30%",
                data: ["53接入", "主动联系", "测评网站"]
            },
            // 工具提示
            tooltip: {
                trigger: "item",
                formatter: "{b} : {c}"
            },
            // 工具箱
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true, name: "客户来源" }
                }
            },
            series: [
                {
                    name: "访问来源",
                    type: "pie",
                    radius: "60%",
                    center: ["50%", "50%"],
                    minAngle: 10,
                    startAngle: 0,
                    data: [],
                    color: [],
                    label: {
                        position: "outer",
                        alignTo: "labelLine",
                        bleedMargin: 5,
                        fontSize: 16
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            ]
        };
    },
    watch: {
        range() {
            this.getCalcData(); //获取统计图表信息
        }
    },
    methods: {
        isRole(roleName) {
            //判断角色
            return (
                this.roleList.find(r => r.id === this.user.role).name ===
                roleName
            );
        },

        onButtonChange({ target: { value } }) {
            //切换时间范围
            this.range = this.startTimeList.find(t => t.label === value).range;
        },
        getTodo() {
            //获取待办数据
            this.getSellerManageTodo();
            if (this.isRole("销售经理")) {
                this.getSellerManageTodo();
            } else if (this.isRole("销售员")) {
                this.getSellerTodo();
            } else if (this.isRole("售后经理")) {
                this.getAftersaleManagerTodo();
            } else if (this.isRole("售后员")) {
                this.getAftersaleTodo();
            } else {
            }
        },
        async getSellerManageTodo() {
            try {
                let result = await getSellerManageTodo();
                this.sellerManagerTodo = result.data || {};
            } catch (error) {}
        },
        async getSellerTodo() {
            try {
                let result = await getSellerTodo({
                    account: this.user.account
                });
                this.sellerTodo = result.data || {};
            } catch (error) {}
        },
        async getAftersaleManagerTodo() {
            try {
                let result = await getAftersaleManagerTodo();
                this.aftersaleManagerTodo = result.data || {};
            } catch (error) {}
        },
        async getAftersaleTodo() {
            try {
                let result = await getAftersaleTodo({
                    account: this.user.account
                });
                this.aftersaleTodo = result.data || {};
            } catch (error) {}
        },
        getCalcData() {
            //获取统计图表的数据
            console.log("getCalcData");
            this.getAchievementData(); //获取业绩卡片信息
            this.getCustomData(); //获取成交率卡片信息
            this.getAchievementEvery(); //获取业绩详情
            this.getOrderEvery();
            this.getCustomFrom(); //获取客户来源分析
            this.getCustomTime(); //获取客户时间段分析
        },
        async getAchievementData() {
            try {
                let result = await getAchievementOverview({
                    startTime: this.range[0].valueOf(),
                    endTime: this.range[1].valueOf()
                });
                this.achievementData = result.data;
                console.log(result);
            } catch (error) {}
        },
        async getCustomData() {
            try {
                let result = await getCustomData({
                    startTime: this.range[0].valueOf(),
                    endTime: this.range[1].valueOf()
                });
                this.customData = result.data || {};
            } catch (error) {}
        },
        async getAchievementEvery() {
            try {
                let result = await getAchievementEvery({
                    startTime: this.range[0].valueOf(),
                    endTime: this.range[1].valueOf()
                });
                if (result.status == 200) {
                    this.archivementOptions.xAxis.data = result.data.map(
                        i => i.name
                    );
                    this.archivementOptions.series[0].data = result.data.map(
                        r => {
                            return { ...r, value: r.toReview };
                        }
                    );
                    console.log(
                        "this.archivementOptions.series[0].data;",
                        this.archivementOptions.series[0].data
                    );
                    this.archivementOptions.series[1].data = result.data.map(
                        r => {
                            return { ...r, value: r.reviewPassed };
                        }
                    );
                    this.archivementOptions.series[2].data = result.data.map(
                        r => {
                            return { ...r, value: r.reviewReject };
                        }
                    );
                }
            } catch (error) {}
        },
        async getOrderEvery() {
            try {
                let result = await getOrderEvery({
                    startTime: this.range[0].valueOf(),
                    endTime: this.range[1].valueOf()
                });
                if (result.status == 200) {
                    this.orderOptions.xAxis.data = result.data.map(i => i.name);
                    this.orderOptions.series[0].data = result.data;
                }
            } catch (error) {}
        },
        async getReceiptCustoms() {
            try {
                let result = await getReceiptCustoms({
                    startTime: this.range[0].valueOf(),
                    endTime: this.range[1].valueOf()
                });
                if (result.status == 200) {
                    this.receiptData = result.data;
                }
            } catch (error) {}
        },
        async getCustomFrom() {
            try {
                let result = await getCustomFrom({
                    startTime: this.range[0].valueOf(),
                    endTime: this.range[1].valueOf()
                });

                if (result.status == 200) {
                    this.fromOptions.legend.data = result.data.map(r => r.name);
                    this.fromOptions.series[0].data = result.data;
                }
            } catch (error) {}
        },
        async getCustomTime() {
            try {
                let result = await getCustomTime({
                    startTime: this.range[0].valueOf(),
                    endTime: this.range[1].valueOf()
                });

                if (result.status == 200) {
                    this.timeOptions.xAxis.data = Object.keys(result.data[0]);
                    this.timeOptions.series[0].data = Object.values(
                        result.data[0]
                    );
                }
            } catch (error) {}
        }
    }
};
</script>
<style lang="less" scoped>
.todo {
    .number {
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
        color: #000;
        text-align: center;
        margin-top: 4px;
        margin-bottom: -8px;
        font-size: 30px;
        line-height: 38px;
        height: 38px;
    }
}
.calcitem {
    font-size: 18px;
}
</style>
