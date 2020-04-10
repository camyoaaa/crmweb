<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-form-item label="订单编号">
                            <a-input v-model="queryParam.oid" placeholder="" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="客户编号">
                            <a-input v-model="queryParam.cid" placeholder="" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="售后人员">
                            <staff-select :did="did" :pid="pid" :admin="isadmin" placeholder="请选择售后人员" v-model="queryParam.executor" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQueryparam">重置</a-button>
        </div>

        <s-table ref="table" rowKey="oid" :columns="columns" :data="loadData" showPagination="auto" :pagination="pagination">
            <span slot="amount" slot-scope="text, record">
                {{text | numformat}}
            </span>
            <span slot="hasContract" slot-scope="text, record">
                {{record.contractList.length > 0? getContractName(record.contractList[0].way):'无'}}
            </span>
            <span slot="receivedMoney" slot-scope="text, record">
                {{(record.payreceiptList.reduce((pay1,pay2)=>pay1.money||0 + pay2.money || 0,0)) | numformat}}
            </span>
            <span slot="createTime" slot-scope="text, record">
                <div v-if="record.payreceiptList.length > 0">{{record.payreceiptList[0].createTime | dateformat}}</div>
                <div v-else> -- </div>
            </span>
            <span slot="executor" slot-scope="text, record">
                <div v-if="record.editing" style="display:flex;align-items:center">
                    <staff-select style="flex:1;width:150px" :did="did" :pid="pid" :admin="isadmin" onduty placeholder="请选择售后人员" v-model="record.executor" size="small" />
                    <a-button @click="updateOrder(record)" size="small" type="primary" :disabled="!record.executor">确定</a-button>
                    <a-button @click="cancelEdit(record)" size="small" type="dashed">取消</a-button>
                </div>
                <div v-else>
                    <div v-if="record.executorInfo[0] && record.executorInfo[0].name">
                        {{ record.executorInfo[0].name }}
                        <a-button @click="editCustom(record)" size="small" type="primary" :disabled="Object.keys(editingCache).length > 0">转移</a-button>
                    </div>
                    <a-button v-else @click="editCustom(record)" size="small" type="primary" :disabled="Object.keys(editingCache).length > 0">分配售后</a-button>
                </div>
            </span>
        </s-table>
    </a-card>
</template>

<script>
import { getPaidPassedOrderList, afterAlloc } from "@/myapi/order.js";
import { mapState } from "vuex";
export default {
    name: "TableList",
    computed: {
        ...mapState({
            did: state => state.user.department,
            pid: state => state.user.post,
            isadmin: state => state.user.isadmin,
            distributor: state => state.user.account
        })
    },
    data() {
        return {
            // 查询参数
            queryParam: {},
            fuzzies: ["name"],
            editingCache: {},
            columns: [
                {
                    title: "订单编号",
                    dataIndex: "oid",
                    width: "100px"
                },
                {
                    title: "客户编号",
                    dataIndex: "cid",
                    width: "100px"
                },
                {
                    title: "手机",
                    dataIndex: "customInfo.phone"
                },
                {
                    title: "微信",
                    dataIndex: "customInfo.wx"
                },
                {
                    title: "QQ",
                    dataIndex: "customInfo.qq"
                },
                {
                    title: "订单购套餐",
                    dataIndex: "mealInfo.name",
                    width: "150px"
                },
                {
                    title: "订单金额",
                    dataIndex: "amount",
                    scopedSlots: { customRender: "amount" },
                    width: "150px"
                },
                {
                    title: "已收金额",
                    scopedSlots: { customRender: "receivedMoney" },
                    width: "150px"
                },
                {
                    title: "有无合同",
                    dataIndex: "hasContract",
                    scopedSlots: { customRender: "hasContract" }
                },
                {
                    title: "首付款时间",
                    dataIndex: "createTime",
                    width: "200px",
                    scopedSlots: { customRender: "createTime" }
                },
                {
                    title: "分配售后",
                    dataIndex: "executor",
                    width: "250px",
                    scopedSlots: { customRender: "executor" }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                return getPaidPassedOrderList(
                    Object.assign(parameter, this.queryParam, {
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
            pagination: {
                pageSizeOptions: ["10", "20", "30", "40", "50"],
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条数据`
            }
        };
    },
    methods: {
        queryTable(toFirst = true) {
            this.editingCache = {};
            this.$refs.table.refresh(toFirst);
        },
        resetQueryparam() {
            this.queryParam = {};
            this.queryTable();
        },
        getContractName(way) {
            return way == 1 ? "法大大电子合同" : "现场签约";
        },
        //编辑客户
        editCustom(record) {
            record.editing = true;
            this.editingCache = { ...record };
        },
        //取消编辑
        cancelEdit(record) {
            for (const key in record) {
                if (record.hasOwnProperty(key)) {
                    record[key] = this.editingCache[key];
                }
            }
            record.editing = false;
            this.editingCache = {};
        },
        //
        async updateOrder(order) {
            let { oid, executor, cid, remark } = order;
            try {
                let result = await afterAlloc({
                    oid,
                    executor,
                    distributor: this.distributor,
                    cid,
                    remark
                });

                if (result.status == 200) {
                    this.$notification.success({
                        message: "分配成功",
                        description: `订单${oid}已分配到售后人员`
                    });
                    this.queryTable();
                }
            } catch (error) {}
        }
    }
};
</script>
