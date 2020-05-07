<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-form-item label="订单编号">
                            <id-input v-model="queryParam.orderid" placeholder="请输入订单编号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="客户编号">
                            <id-input v-model="queryParam.cid" placeholder="请输入客户编号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="店铺名称">
                            <a-input v-model="queryParam.shopName" placeholder="请输入店铺名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="是否营业">
                            <a-select v-model="queryParam.isOpen" placeholder="请选择营业状态">
                                <a-select-option v-for="ts in shopStatusList" :key="ts.id" :value="ts.id">
                                    {{ts.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="店铺地址">
                            <a-input v-model="queryParam.url" placeholder="请输入店铺地址" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="教学阶段">
                            <a-select v-model="queryParam.teachStep" placeholder="请选择教学阶段">
                                <a-select-option v-for="ts in teachStatusList" :key="ts.id" :value="ts.id">
                                    {{ts.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="全部完成">
                            <a-select v-model="queryParam.isEnd" placeholder="请选择售后进度">
                                <a-select-option :value="1">
                                    是
                                </a-select-option>
                                <a-select-option :value="2">
                                    否
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="售后时间">
                            <a-range-picker v-model="queryParam.range" style="width:100%" :showTime="{
                                hideDisabledOptions: true,
                                defaultValue: [$moment('00:00:00', 'HH:mm'), $moment('23:59:59', 'HH:mm')],
                            }" format="YYYY-MM-DD HH:mm"></a-range-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="运营老师">
                            <staff-select v-model="queryParam.executor" role-name="售后员"></staff-select>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" @click="queryTable">查询</a-button>
            <a-button type="primary" style="margin-left: 8px" @click="resetQueryparam">重置</a-button>
        </div>
        <!-- <s-table ref="table" size="middle" rowKey="orderid" :columns="columns" :data="loadData" :rowSelection="{selectedRowKeys,onChange:onSelectChange}" showPagination="auto" :pagination="pagination"> -->

        <s-table ref="table" size="middle" rowKey="orderid" :columns="columns" :data="loadData" showPagination="auto" :pagination="pagination">
            <span slot="orderid" slot-scope="text, record">
                <router-link :to="{path:'/orderDetail',query:{oid:text}}">{{text}}</router-link>
            </span>
            <span slot="cid" slot-scope="text, record">
                <router-link :to="{path:'/customDetail',query:{cid:text}}">
                    {{record.customInfo.name}}/{{text}}
                </router-link>
            </span>
            <span slot="pcshopUrl" slot-scope="text">
                <a :href="text" target="_blank">
                    <ellipsis :length="10" tooltip>{{text}}</ellipsis>
                </a>
            </span>
            <span slot="mbshopUrl" slot-scope="text">
                <a :href="text" target="_blank">
                    <ellipsis :length="10" tooltip>{{text}}</ellipsis>
                </a>
            </span>
            <span slot="isOpen" slot-scope="text">
                {{shopStatusList.find(s=>s.id === text).name}}
            </span>
            <span slot="teachStep" slot-scope="text">
                {{teachStatusList.find(s=>s.id === text).name}}
            </span>
            <span slot="activityProcess" slot-scope="text,record">
                <a-badge dot :status="getStatus(record)" :text="`${record.activityStep}/${record.totalActivity}`"></a-badge>
                <!-- <a-progress :percent="getPercent(record)" :format="()=>`${record.activityStep}/${record.totalActivity}`" /> -->
            </span>
            <span slot="createTime" slot-scope="text, record">
                {{ text | dateformat }}
            </span>
            <span slot="remark" slot-scope="text">
                {{text || '无'}}
            </span>
            <span slot="executorName" slot-scope="text">
                {{text || '暂未分配'}}
            </span>
            <span slot="isEnd" slot-scope="text">
                {{text==1? '是':'否'}}
            </span>
            <span slot="followRecord" slot-scope="text, record">
                {{getNewestRecord(record.followList)}}
            </span>
            <span slot="action" slot-scope="text, record">
                <a-button size="small" type="primary" :disabled="!$auth('aftersaleManage.follow')" @click="followAftersale(record)">跟进</a-button>
            </span>
        </s-table>
    </a-card>
</template>

<script>
import { getList } from "@/myapi/aftersale.js";
import { mapState } from "vuex";

export default {
    computed: {
        ...mapState({
            aftersale: state => state.user.account,
            teachStatusList: state => state.appconfig.teachStatusList,
            shopStatusList: state => state.appconfig.shopStatusList,
            activeStatusList: state => state.appconfig.activeStatusList
        })
    },
    created() {
        let preQuery = this.$route.query;
        let toNumber = [
            "orderid",
            "cid",
            "isOpen",
            "teachStep",
            "isEnd",
            "executor"
        ];
        for (const key in preQuery) {
            if (toNumber.includes(key)) {
                let isNumber = !isNaN(Number(preQuery[key]));
                if (isNumber) {
                    this.queryParam[key] = Number(preQuery[key]);
                }
            } else {
                this.queryParam[key] = preQuery[key];
            }
        }
    },
    data() {
        return {
            // 查询参数
            queryParam: {},
            fuzzies: ["shopName", "url"], //模糊查询字段
            // 表头
            columns: [
                {
                    title: "订单编号",
                    dataIndex: "orderid",
                    scopedSlots: { customRender: "orderid" }
                },
                {
                    title: "客户",
                    dataIndex: "cid",
                    scopedSlots: { customRender: "cid" }
                },
                {
                    title: "订购套餐",
                    dataIndex: "mealInfo.name"
                },
                {
                    title: "店铺名称",
                    dataIndex: "shopName",
                    scopedSlots: { customRender: "shopName" }
                },
                {
                    title: "店铺PC地址",
                    dataIndex: "pcshopUrl",
                    scopedSlots: { customRender: "pcshopUrl" }
                },
                {
                    title: "店铺MB地址",
                    dataIndex: "mbshopUrl",
                    scopedSlots: { customRender: "mbshopUrl" }
                },
                {
                    title: "是否营业",
                    dataIndex: "isOpen",
                    scopedSlots: { customRender: "isOpen" }
                },
                {
                    title: "教学阶段",
                    dataIndex: "teachStep",
                    scopedSlots: { customRender: "teachStep" }
                },
                {
                    title: "活动进度",
                    dataIndex: "activityProcess",
                    scopedSlots: { customRender: "activityProcess" },
                    width: "120px"
                },
                {
                    title: "售后时间",
                    dataIndex: "createTime",
                    scopedSlots: { customRender: "createTime" }
                },
                {
                    title: "备注",
                    dataIndex: "remark",
                    scopedSlots: { customRender: "remark" }
                },
                {
                    title: "全部完成",
                    dataIndex: "isEnd",
                    scopedSlots: { customRender: "isEnd" }
                },
                {
                    title: "跟进记录",
                    dataIndex: "followRecord",
                    scopedSlots: { customRender: "followRecord" }
                },
                {
                    title: "运营老师",
                    dataIndex: "executorName",
                    scopedSlots: { customRender: "executorName" }
                },
                {
                    title: "操作",
                    dataIndex: "action",
                    scopedSlots: { customRender: "action" }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                let { range, ...otherParams } = this.queryParam;
                if (range) {
                    otherParams.startTime = range[0].valueOf();
                    otherParams.endTime = range[1].valueOf();
                }
                return getList(
                    Object.assign(parameter, otherParams, {
                        fuzzies: this.fuzzies
                    })
                ).then(res => {
                    res.result.data = res.result.data.map(x => ({
                        ...x,
                        editing: false
                    }));
                    return res.result;
                });
            },
            selectedRowKeys: [],
            selectedRows: [],
            pagination: {
                pageSizeOptions: ["10", "20", "30", "40", "50"],
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条数据`
            }
        };
    },
    methods: {
        getPercent(aftersale) {
            if (aftersale.totalActivity) {
                return Math.ceil(
                    (aftersale.activityStep / aftersale.totalActivity) * 100
                );
            } else {
                return 0;
            }
        },
        getStatus(aftersale) {
            return this.activeStatusList.find(
                s => s.id == aftersale.activityStatus
            ).status;
        },
        followAftersale(record) {
            this.$router.push({
                path: "/aftersaleFollow",
                query: { oid: record.orderid }
            });
        },
        getNewestRecord(followList) {
            return Array.isArray(followList) && followList.length > 0
                ? followList[followList.length - 1].comment
                : "暂未跟进";
        },
        getContractName(way) {
            return way == 1 ? "法大大电子合同" : "现场签约";
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
        },
        queryTable(toFirst = true) {
            this.$refs.table.refresh(toFirst);
        },
        resetQueryparam() {
            this.queryParam = {};
            this.queryTable();
        }
    }
};
</script>
