<template>
    <div>
        <workplace-header style="margin:-23px -16px 0px -15px;" />
        <a-card :bordered="false" style="margin-top:20px;border-radius:10px">
            <a-row>
                <a-col :md="6" :sm="12" :xs="24">
                    <head-info title="今日接待客户数" :content="`${receiptData.todayReceipt} 个`" :bordered="true" />
                </a-col>
                <a-col :md="6" :sm="12" :xs="24">
                    <head-info title="本周接待客户数" :content="`${receiptData.weekyReceipt} 个`" :bordered="true" />
                </a-col>
                <a-col :md="6" :sm="12" :xs="24">
                    <head-info title="本月接待客户数" :content="`${receiptData.monthReceipt} 个`" :bordered="true" />
                </a-col>
                <a-col :md="6" :sm="12" :xs="24">
                    <head-info title="总接待客户数" :content="`${receiptData.totalReceipt} 个`" />
                </a-col>
            </a-row>
        </a-card>

        <a-row :gutter="20">
            <a-col :xs="24" :md="24" :lg="12" :xl="12" :xxl="12" style="margin-top:20px">
                <a-card title="客户来源" style="border-radius:10px">
                    <a-radio-group v-model="startTime1" slot="extra" buttonStyle="solid" size="small" @change="getCustomFrom">
                        <a-radio-button v-for="start in startTimeList" :key="start.time" :value="start.time">{{start.label}}</a-radio-button>
                    </a-radio-group>
                    <chart :options="echartsOptions" theme="light" style="width:100%" :key="1" :autoresize="true"></chart>
                </a-card>
            </a-col>
            <a-col :xs="24" :md="24" :lg="12" :xl="12" :xxl="12" style="margin-top:20px">
                <a-card title="时间段分析" style="border-radius:10px">
                    <a-radio-group v-model="startTime2" slot="extra" buttonStyle="solid" size="small" @change="getCustomTime">
                        <a-radio-button v-for="start in startTimeList" :key="start.time" :value="start.time">{{start.label}}</a-radio-button>
                    </a-radio-group>
                    <chart :options="echartsOptions1" theme="light" style="width:100%" :key="2" :autoresize="true"></chart>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import WorkplaceHeader from "@/commonItems/WorkplaceHeader.vue";
import {
    getReceiptCustoms,
    getCustomFrom,
    getCustomTime
} from "@/myapi/dashboard.js";
// 折线
import "echarts/lib/chart/line";
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
    data() {
        return {
            receiptData: {}, //接待客户信息
            echartsOptions: {},
            echartsOptions1: {},
            startTime1: this.$moment()
                .startOf("date")
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
                    saveAsImage: { show: true, name: "客户来源" }
                }
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    name: "客户时间段",
                    data: [],
                    type: "line"
                }
            ]
        };
        this.echartsOptions = {
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
            xAxis: {
                type: "category"
            },
            yAxis: {
                type: "value",
                minInterval: 1
            },
            series: [
                {
                    name: "客户来源",
                    data: [],
                    barWidth: "40%",
                    type: "bar",
                    label: {
                        show: true,
                        fontSize: 18,
                        fontStyle: "normal",
                        formatter: ({ data }) => {
                            return data.value ? data.value : "";
                        }
                    }
                }
            ]
        };
    },
    methods: {
        initData() {
            this.getReceiptCustoms();
            this.getCustomFrom();
            this.getCustomTime();
        },
        async getReceiptCustoms() {
            try {
                let result = await getReceiptCustoms(
                    this.$store.state.user.account
                );
                if (result.status == 200) {
                    this.receiptData = result.data;
                }
            } catch (error) {}
        },
        async getCustomFrom() {
            try {
                let result = await getCustomFrom(
                    this.$store.state.user.account,
                    this.startTime1
                );

                if (result.status == 200) {
                    this.echartsOptions.xAxis.data = result.data.map(
                        i => i.name
                    );
                    this.echartsOptions.series[0].data = result.data;
                }
            } catch (error) {}
        },
        async getCustomTime() {
            try {
                let result = await getCustomTime(
                    this.$store.state.user.account,
                    this.startTime2
                );

                if (result.status == 200) {
                    this.echartsOptions1.xAxis.data = Object.keys(
                        result.data[0]
                    );
                    this.echartsOptions1.series[0].data = Object.values(
                        result.data[0]
                    );
                }
            } catch (error) {}
        }
    }
};
</script>

