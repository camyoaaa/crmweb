<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-form-item label="合同编号">
                            <id-input v-model="queryParam.ctid" placeholder="输入合同编号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="关联订单">
                            <id-input v-model="queryParam.orderid" placeholder="输入订单编号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="签约客户">
                            <id-input v-model="queryParam.cid" placeholder="输入客户编号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="合同方式">
                            <a-select v-model="queryParam.way" placeholder="选择合同方式">
                                <a-select-option :value="1">
                                    法大大电子合同
                                </a-select-option>
                                <a-select-option :value="2">
                                    现场签约
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label=" 签 约 人 ">
                            <staff-select v-model="queryParam.creator" role-name="销售员" placeholder="选择签约人" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="签约时间">
                            <a-range-picker v-model="queryParam.range" style="width:100%" :showTime="{
        hideDisabledOptions: true,
        defaultValue: [$moment('00:00:00', 'HH:mm'), $moment('23:59:59', 'HH:mm')],
      }" format="YYYY-MM-DD HH:mm" />

                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="合同状态">
                            <a-select v-model="queryParam.status" allowClear placeholder="选择合同状态">
                                <a-select-option v-for=" r in reviewStatusList" :value="r.id" :key="r.id" :disabled="editingCache.status === 0">{{r.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" @click="queryTable" icon="search">查询</a-button>
            <a-button type="primary" @click="resetQueryparam" icon="redo">重置</a-button>
            <!-- <a-button type="primary" @click="openNewModal" icon="plus">添加</a-button> -->
        </div>
        <a-spin :spinning="queryLoading">
            <!-- <s-table size="middle" ref="table" rowKey="ctid" :alert="false" :columns="columns" :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }" :data="loadData" showPagination="auto" :pagination="pagination"> -->
            <s-table size="middle" ref="table" rowKey="ctid" :alert="false" :columns="columns" :data="loadData" showPagination="auto" :pagination="pagination">
                <span slot="shot" slot-scope="text">
                    <image-preview :src="text" style="height:52px;width:52px;border:none"></image-preview>
                </span>
                <span slot="url" slot-scope="text">
                    <a v-if="text" :href="text" target="_blank">{{text}}</a>
                    <div v-else>无</div>
                </span>
                <span slot="createTime" slot-scope="text">
                    {{ text | dateformat }}
                </span>
                <span slot="money" slot-scope="text">
                    {{ text | numformat }}
                </span>

                <span slot="cid" slot-scope="text,record">
                    <router-link :to="{path:'/customDetail',query:{cid:text}}">{{record.customName}}/{{record.cid}}</router-link>
                </span>
                <span slot="orderid" slot-scope="text">
                    <router-link :to="{path:'/orderDetail',query:{oid:text}}">{{text}}</router-link>
                </span>
                <span slot="meal" slot-scope="text,record">
                    {{record.orderInfo.meal.name}}
                </span>
                <span slot="reviewerName" slot-scope="text, record">
                    {{text || '无'}}
                </span>
                <span slot="remark" slot-scope="text, record">
                    <a-input v-if="record.editing" v-model="record.remark" :rows="1" size="small" />
                    <div v-else>
                        {{text || '无'}}
                    </div>
                </span>
                <span slot="reviewStatus" slot-scope="text, record">
                    <a-select v-if="record.editing" v-model="record.status" size="small">
                        <a-select-option v-for=" r in reviewStatusList" :value="r.id" :key="r.id" :disabled="editingCache.status === 0">{{r.name}}</a-select-option>
                    </a-select>
                    <div v-else>
                        {{reviewStatusList.find(r=>r.id === record.status).name}}
                    </div>
                </span>
                <span slot="executorName" slot-scope="text, record">
                    <staff-select v-if="record.editing" size="small" role-name="售后员" detail v-model="record.executor"></staff-select>
                    <div v-else> {{text || '无'}}</div>
                </span>
                <span slot="remark" slot-scope="text, record">
                    <ellipsis :length="10" tooltip>{{ record.remark || '无'}}</ellipsis>
                </span>
                <span slot="way" slot-scope="text,record">
                    {{text === 1 ? '法大大电子合同':text === 2?'现场签约':'暂未签约'}}
                </span>
                <span slot="action" slot-scope="text,record">
                    <div v-if="record.editing">
                        <a-button size="small" icon="check" @click="reviewContract(record)" :disabled="record.status === editingCache.status"></a-button>
                        <a-button size="small" icon="close" @click="cancelReview(record)"></a-button>
                    </div>
                    <div v-else>
                        <a-button v-if="record.status === 0" type="primary" size="small" @click="startReview(record)" :disabled="!$auth('contractManage.review') || Object.keys(editingCache).length > 0">审核</a-button>
                        <a-button v-else size="small" @click="editContract(record)" :disabled="!$auth('contractManage.modify') || Object.keys(editingCache).length > 0 || record.status === reviewStatusList.find(r=>r.name=='审核通过').id">更正</a-button>
                    </div>

                </span>
            </s-table>
        </a-spin>
        <edit-contract ref="editContract" @ok="queryTable" />
    </a-card>
</template>

<script>
import EditContract from "./EditContract.vue";
import { getList, updateContract, reviewContract } from "@/myapi/contract.js";
import { mapState } from "vuex";
export default {
    name: "TableList",
    components: { EditContract },
    computed: {
        ...mapState({
            roleList: state => state.appconfig.appRoleList,
            role: state => state.user.role,
            userAcconut: state => state.user.account,
            reviewStatusList: state => state.appconfig.reviewStatusList
        })
    },
    created() {
        let preQuery = this.$route.query;
        let toNumber = [
            "ctid",
            "orderid",
            "cid",
            "creator",
            "status",
            "way",
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
            queryLoading: false,
            fuzzies: ["name"], //模糊查询字段
            editingCache: {}, //用做编辑缓存
            selectedRowKeys: [],
            selectedRows: [],
            // 表头
            columns: [
                {
                    title: "合同截图",
                    dataIndex: "shot",
                    scopedSlots: { customRender: "shot" }
                },
                {
                    title: "合同编号",
                    dataIndex: "ctid"
                },
                {
                    title: "签约方式",
                    dataIndex: "way",
                    scopedSlots: { customRender: "way" }
                },
                {
                    title: "签约套餐",
                    dataIndex: "orderInfo.mealinfo.name",
                    scopedSlots: { customRender: "mealName" }
                },
                {
                    title: "关联订单",
                    dataIndex: "orderid",
                    scopedSlots: { customRender: "orderid" }
                },
                {
                    title: "签约客户",
                    dataIndex: "cid",
                    scopedSlots: { customRender: "cid" }
                },
                {
                    title: "签约链接",
                    dataIndex: "url",
                    scopedSlots: { customRender: "url" }
                },
                {
                    title: "签约时间",
                    dataIndex: "createTime",
                    scopedSlots: { customRender: "createTime" }
                },
                {
                    title: "签约人",
                    dataIndex: "creatorName"
                },
                {
                    title: "审核人",
                    dataIndex: "reviewerName",
                    scopedSlots: { customRender: "reviewerName" }
                },
                {
                    title: "审核备注",
                    dataIndex: "remark",
                    scopedSlots: { customRender: "remark" }
                },
                {
                    title: "审核状态",
                    dataIndex: "reviewStatus",
                    scopedSlots: { customRender: "reviewStatus" }
                },
                {
                    title: "操作",
                    dataIndex: "action",
                    scopedSlots: { customRender: "action" }
                }
            ],
            // 查询已录入的客户信息 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                this.queryLoading = true;
                let { range, ...otherParams } = this.queryParam;
                if (range) {
                    otherParams.startTime = range[0].valueOf();
                    otherParams.endTime = range[1].valueOf();
                }
                return getList(
                    Object.assign(parameter, otherParams, {
                        fuzzies: this.fuzzies
                    })
                )
                    .then(res => {
                        this.queryLoading = false;
                        res.result.data = res.result.data.map(x => ({
                            ...x,
                            editing: false
                        }));
                        return res.result;
                    })
                    .catch(_ => (this.queryLoading = false));
            },
            pagination: {
                pageSizeOptions: ["10", "20", "30", "40", "50"],
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条数据`
            }
        };
    },
    methods: {
        cancelReview(record) {
            for (const key in record) {
                if (record.hasOwnProperty(key)) {
                    record[key] = this.editingCache[key];
                }
            }
            this.editingCache = {};
        },
        startReview(order) {
            this.editingCache = { ...order };
            order.editing = true;
        },
        editContract(order) {
            this.$refs.editContract.open(order);
        },
        async reviewContract(record) {
            try {
                let result = await reviewContract({
                    ctid: this.editingCache.ctid,
                    status: record.status,
                    reviewer: this.userAcconut,
                    remark: record.remark
                });
                this.$notification.success({
                    message: "成功",
                    description: "客户转移成功"
                });
                this.queryTable();
            } catch (error) {
                console.log(error);
            } finally {
                this.editingCache = {};
            }
        },
        queryTable(toFirst = true) {
            this.editingCache = {};
            this.$refs.table.refresh(toFirst);
        },
        resetQueryparam() {
            this.queryParam = {};
            this.queryTable();
        },

        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
        }
    }
};
</script>
