<template>
    <div>
        <workplace-header style="margin:-23px -16px 0px -15px;" />
        <a-row :gutter="20">
            <a-col :span="12" style="margin-top:20px">
                <a-card title="待办事项">
                    <a-row>
                        <a-col :md="12" :sm="12" :xs="24">
                            <head-info title="待审核收据" :content="`${todo.toReviewPay} 单`" />
                        </a-col>
                        <a-col :md="12" :sm="12" :xs="24">
                            <head-info title="待审核合同" :content="`${todo.toReviewContract} 份`" />
                        </a-col>
                    </a-row>
                </a-card>

                <a-card title="成交情况" style="margin-top:20px">
                    <a-radio-group v-model="startTime1" slot="extra" buttonStyle="solid" size="small">
                        <a-radio-button v-for="start in startTimeList" :key="start.time" :value="start.time">{{ start.label }}</a-radio-button>
                    </a-radio-group>
                    <a-row>
                        <a-col :md="12" :sm="12" :xs="24">
                            <head-info title="成交客户数" :content="`${dealData.dealCustom || 0} 个`" />
                        </a-col>
                        <a-col :md="12" :sm="12" :xs="24">
                            <head-info title="成交订单数" :content="`${dealData.dealOrder || 0} 单`" />
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>
            <a-col :span="12" style="margin-top:20px">
                <a-card title="业绩总览">
                    <a-radio-group v-model="startTime1" slot="extra" buttonStyle="solid" size="small">
                        <a-radio-button v-for="start in startTimeList" :key="start.time" :value="start.time">{{ start.label }}</a-radio-button>
                    </a-radio-group>
                    <chart :options="echartsOptions" style="width:100%;height:242px" :key="1" :autoresize="true"></chart>
                </a-card>
            </a-col>
            <a-col :span="24" style="margin:20px 0px">
                <a-card title="业绩详情">
                    <a-radio-group v-model="startTime1" slot="extra" buttonStyle="solid" size="small">
                        <a-radio-button v-for="start in startTimeList" :key="start.time" :value="start.time">{{ start.label }}</a-radio-button>
                    </a-radio-group>
                    <chart :options="echartsOptions1" theme="light" style="width:100%" :key="2" :autoresize="true"></chart>
                </a-card>
            </a-col>

            <a-col :span="24" style="margin:20px 0px">
                <a-card title="开单详情">
                    <a-radio-group v-model="startTime1" slot="extra" buttonStyle="solid" size="small">
                        <a-radio-button v-for="start in startTimeList" :key="start.time" :value="start.time">{{ start.label }}</a-radio-button>
                    </a-radio-group>
                    <chart :options="echartsOptions2" style="width:100%" :key="2" :autoresize="true"></chart>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import WorkplaceHeader from "@/commonItems/WorkplaceHeader.vue";
import { mapState } from "vuex";
import {
    getSellerManagerTodo,
    getDealData,
    getAchievementOverview,
    getAchievementEvery,
    getOrderEvery
} from "@/myapi/dashboard.js";
// 折线
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
    components: { WorkplaceHeader },
    computed: {
        ...mapState({
            did: state => state.user.department,
            pid: state => state.user.post
        })
    },
    watch: {
        startTime1() {
            this.getDealData();
            this.getAchievementEvery();
            this.getAchievementOverview();
            this.getOrderEvery();
        }
    },
    data() {
        return {
            todo: {},
            dealData: {},
            receiptData: {}, //分配客户信息
            echartsOptions: {},
            echartsOptions1: {},
            echartsOptions2: {},
            startTime1: this.$moment()
                .startOf("week")
                .valueOf(),
            startTime2: this.$moment()
                .startOf("date")
                .valueOf(),
            startTimeList: [
                {
                    label: "今天",
                    time: this.$moment()
                        .startOf("date")
                        .valueOf()
                },
                {
                    label: "本周",
                    time: this.$moment()
                        .startOf("week")
                        .valueOf()
                },
                {
                    label: "本月",
                    time: this.$moment()
                        .startOf("month")
                        .valueOf()
                },
                { label: "所有", time: 0 }
            ]
        };
    },
    created() {
        this.initData();
    },
    mounted() {
        this.echartsOptions2 = {
            xAxis: {
                type: "category",
                data: []
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
                    //   dataZoom: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true, name: "开单详情" }
                }
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    name: "",
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
                    }
                    //   barMinHeight: 10
                }
            ]
        };
        this.echartsOptions1 = {
            xAxis: {
                type: "category",
                data: []
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
                    //   dataZoom: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true, name: "业绩详情" }
                }
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    name: "",
                    data: [],
                    type: "bar",
                    label: {
                        show: true,
                        fontSize: 18,
                        fontStyle: "normal",
                        formatter: ({ data }) => {
                            return data.value
                                ? `${this.$numformat(data.value)}元`
                                : "";
                        }
                    }
                    //   barMinHeight: 10
                }
            ]
        };
        this.echartsOptions = {
            // 工具提示
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            title: {
                text: "业绩总和",
                left: "left"
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
            legend: {
                orient: "vertical",
                data: ["等待审核", "审核通过", "审核驳回"],
                left: "0",
                top: "30%"
            },
            series: [
                {
                    name: "业绩总览",
                    radius: "70%",
                    center: ["50%", "50%"],
                    minAngle: 10,
                    startAngle: 0,
                    data: [],
                    type: "pie",
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    },
                    label: {
                        fontSize: 14,
                        formatter: ({ data, percent }) => {
                            return `${data.name}-${this.$numformat(
                                data.value
                            )}元-${percent}%`;
                        }
                    }
                }
            ]
        };
    },
    methods: {
        initData() {
            this.getSellerManagerTodo();
            this.getDealData();
            this.getAchievementEvery();
            this.getAchievementOverview();
            this.getOrderEvery();
        },
        async getSellerManagerTodo() {
            try {
                let result = await getSellerManagerTodo();
                console.log(result);
                if (result.status == 200) {
                    this.todo = result.data;
                }
            } catch (error) {}
        },
        async getDealData() {
            try {
                let result = await getDealData({ startTime: this.startTime1 });
                console.log(result);
                if (result.status == 200) {
                    this.dealData = result.data;
                }
            } catch (error) {}
        },
        async getAchievementEvery() {
            try {
                let result = await getAchievementEvery({
                    did: this.did,
                    pid: this.pid,
                    queryChildren: true,
                    startTime: this.startTime1
                });
                console.log(result);
                if (result.status == 200) {
                    this.echartsOptions1.xAxis.data = result.data.map(
                        i => i.name
                    );
                    this.echartsOptions1.series[0].data = result.data;
                }
            } catch (error) {}
        },

        async getAchievementOverview() {
            try {
                let result = await getAchievementOverview({
                    startTime: this.startTime1
                });
                console.log(result);
                if (result.status == 200) {
                    this.echartsOptions.title.text = `业绩总额 ${this.$numformat(
                        result.data.total
                    )} 元`;
                    this.echartsOptions.series[0].data = [
                        { name: "等待审核", value: result.data.noReview },
                        { name: "审核通过", value: result.data.reviewPassed },
                        { name: "审核驳回", value: result.data.reviewReject }
                    ];
                }
            } catch (error) {}
        },

        async getOrderEvery() {
            try {
                let result = await getOrderEvery({
                    did: this.did,
                    pid: this.pid,
                    queryChildren: true,
                    startTime: this.startTime1
                });
                console.log(result);
                if (result.status == 200) {
                    this.echartsOptions2.xAxis.data = result.data.map(
                        i => i.name
                    );
                    this.echartsOptions2.series[0].data = result.data;
                }
            } catch (error) {}
        }
    }
};
</script>
