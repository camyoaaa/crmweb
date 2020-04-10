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
                        <a-form-item label="分配时间">
                            <a-input v-model="queryParam.cid" placeholder="" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" @click="queryTable">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQueryparam">重置</a-button>
            <a-dropdown v-if="selectedRowKeys.length > 0">
                <a-menu slot="overlay">
                    <a-menu-item key="1">
                        <a-icon type="delete" />删除</a-menu-item>
                    <a-menu-item key="2">
                        <a-icon type="lock" />锁定</a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>

        <s-table ref="table" size="default" rowKey="oid" :columns="columns" :data="loadData" :rowSelection="{selectedRowKeys,onChange:onSelectChange}" showPagination="auto" :pagination="pagination">
            <span slot="oid" slot-scope="text, record">
                <router-link :to="{path:'/orderDetail',query:{oid:text}}">{{text}}</router-link>
            </span>
            <span slot="cid" slot-scope="text, record">
                <router-link :to="{path:'/customDetail',query:{cid:text}}">{{text}}</router-link>
            </span>
            <span slot="amount" slot-scope="text, record">
                {{text | numformat}}
            </span>
            <span slot="receivedMoney" slot-scope="text, record">
                {{(record.payreceiptList.reduce((pay1,pay2)=>pay1.money||0 + pay2.money || 0,0)) | numformat}}
            </span>
            <span slot="hasContract" slot-scope="text, record">
                {{record.contractList.length > 0? getContractName(record.contractList[0].way):'无'}}
            </span>
            <span slot="allocTime" slot-scope="text, record">
                {{ text | dateformat }}
            </span>
            <span slot="action" slot-scope="text, record">
                <a-button size="small" type="primary" @click="followCustom(record)">跟进</a-button>
            </span>
        </s-table>
    </a-card>
</template>

<script>
import Ellipsis from "@/commonItems/Ellipsis";
import { getPaidPassedOrderList } from "@/myapi/order.js";
import { getAftersaleList, deleteCustom, modify } from "@/myapi/custom.js";
import { mapState } from "vuex";

export default {
    name: "TableList",
    components: {
        Ellipsis
    },
    computed: {
        ...mapState({
            aftersale: state => state.user.account
        })
    },
    data() {
        return {
            // 高级搜索 展开/关闭
            advanced: false,
            // 查询参数
            queryParam: {},
            fuzzies: ["name", "phone", "wx", "keywords"],
            // 表头
            columns: [
                {
                    title: "订单编号",
                    dataIndex: "oid",
                    width: "100px",
                    scopedSlots: { customRender: "oid" }
                },
                {
                    title: "客户编号",
                    dataIndex: "cid",
                    width: "100px",
                    scopedSlots: { customRender: "cid" }
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
                    title: "分配时间",
                    dataIndex: "allocTime",
                    width: "200px",
                    scopedSlots: { customRender: "allocTime" }
                },
                {
                    title: "操作",
                    dataIndex: "action",
                    width: "200px",
                    scopedSlots: { customRender: "action" }
                }
                // {
                //     title: "客户编号",
                //     dataIndex: "cid",
                //     width: "100px"
                // },
                // {
                //     title: "名称",
                //     dataIndex: "name",

                //     scopedSlots: { customRender: "name" }
                // },
                // {
                //     title: "店铺PC地址",
                //     dataIndex: "pcshopName"
                // },
                // {
                //     title: "店铺手机地址",
                //     dataIndex: "mbshopName",
                //     scopedSlots: { customRender: "mbshopName" }
                // },
                // {
                //     title: "教学阶段",
                //     dataIndex: "teachStep",
                //     scopedSlots: { customRender: "teachStep" }
                // },
                // {
                //     title: "活动次数",
                //     dataIndex: "activityStep",
                //     scopedSlots: { customRender: "activityStep" }
                // },
                // {
                //     title: "活动状态",
                //     dataIndex: "activityStatus"
                // },
                // {
                //     title: "备注",
                //     dataIndex: "remark",
                //     scopedSlots: { customRender: "remark" }
                // },
                // {
                //     title: "分配时间",
                //     dataIndex: "allocTime",
                //     scopedSlots: { customRender: "allocTime" }
                // },
                // {
                //     title: "状态",
                //     dataIndex: "status",
                //     scopedSlots: { customRender: "status" }
                // },
                // {
                //     title: "跟进记录",
                //     dataIndex: "followList",
                //     scopedSlots: { customRender: "followList" }
                // },
                // {
                //     title: "操作",
                //     dataIndex: "action",
                //     width: "200px",
                //     scopedSlots: { customRender: "action" }
                // }
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
        followCustom(record) {
            this.$router.push({
                path: "/orderFollow",
                query: { oid: record.oid }
            });
        },
        async updateStaff(record) {
            record.editing = false;
            try {
                let modifySuccess = await modify(record);
                this.$notification.success({
                    $message: "成功",
                    description: "客户更新成功"
                });
            } catch (error) {}
        },
        async deleteCustom(record) {
            try {
                let deleteSuccess = await deleteCustom({
                    cid: record.cid
                });
                this.$notification.success({
                    $message: "成功",
                    description: "客户删除成功"
                });
                this.$refs.table.refresh();
            } catch (error) {
                console.log(error);
            }
        },
        getContractName(way) {
            return way == 1 ? "法大大电子合同" : "现场签约";
        },
        handleEdit(record) {
            console.log(record);
            this.$refs.modal.edit(record);
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
