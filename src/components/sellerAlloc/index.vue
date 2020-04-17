<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-form-item label="客户编号">
                            <id-input v-model="queryParam.cid" placeholder="输入客户编号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="客户名称">
                            <a-input v-model="queryParam.name" placeholder="输入客户名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="联系方式">
                            <a-input v-model="queryParam.contact" placeholder="QQ/手机/微信号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="销售人员">
                            <staff-select v-model="queryParam.seller" :did="did" :pid="pid" :admin="isadmin" placeholder="请选择销售人员" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" @click="queryTable" icon="search">查询</a-button>
            <a-button type="primary" @click="resetQueryparam" icon="redo">重置</a-button>
        </div>
        <a-spin :spinning="queryLoading">
            <s-table ref="table" :rowKey="record => record.cid" :alert="false" :columns="columns" :data="loadData" showPagination="auto" :pagination="pagination">
                <span slot="receptTime" slot-scope="text">
                    {{ text | dateformat }}
                </span>
                <span slot="allocTime" slot-scope="text">
                    {{ text | dateformat }}
                </span>
                <span slot="cid" slot-scope="text">
                    <router-link :to="{path:'/customDetail',query:{cid:text}}">{{text}}</router-link>
                </span>
                <span slot="status" slot-scope="text, record">
                    <a-badge :color="record.status_doc.color" :text="record.status_doc.name" />
                </span>
                <span slot="remark" slot-scope="text, record">
                    <ellipsis :length="10" tooltip>{{ record.remark }}</ellipsis>
                </span>
                <span slot="seller" slot-scope="text, record">
                    <div v-if="record.editing" style="display:flex;align-items:center">
                        <staff-select style="flex:1;width:150px" :did="did" :pid="pid" :admin="isadmin" onduty placeholder="请选择销售人员" v-model="record.seller" size="small" />
                        <a-button @click="updateCustom(record)" size="small" type="primary" :disabled="!record.seller" icon="check"></a-button>
                        <a-button @click="cancelEdit(record)" size="small" type="dashed" icon="close"></a-button>
                    </div>
                    <div v-else>
                        <div v-if="record.seller_doc && record.seller_doc.name">
                            {{ record.seller_doc.name }}
                            <a-button @click="editCustom(record)" size="small" type="primary" :disabled="Object.keys(editingCache).length > 0">转移</a-button>
                        </div>
                        <a-button v-else @click="editCustom(record)" size="small" type="primary" :disabled="Object.keys(editingCache).length > 0">分配销售</a-button>
                    </div>
                </span>
            </s-table>
        </a-spin>
    </a-card>
</template>

<script>
import Ellipsis from "@/commonItems/Ellipsis";
import { getList, modify, alloc } from "@/myapi/custom.js";
import { mapState } from "vuex";
export default {
    name: "TableList",
    components: {
        Ellipsis
    },
    computed: {
        ...mapState({
            did: state => state.user.department,
            pid: state => state.user.post,
            isadmin: state => state.user.isadmin,
            sellerManager: state => state.user.account
        })
    },
    data() {
        return {
            // 查询参数
            queryParam: {},
            queryLoading: false,
            fuzzies: ["name"], //模糊查询字段
            editingCache: {}, //用做编辑缓存
            // 表头
            columns: [
                {
                    title: "编号",
                    dataIndex: "cid",
                    scopedSlots: { customRender: "cid" },
                    width: "100px"
                },
                {
                    title: "名称",
                    dataIndex: "name",
                    width: "100px",
                    scopedSlots: { customRender: "name" }
                },
                {
                    title: "来源",
                    dataIndex: "from_doc.name",
                    width: "100px"
                },
                {
                    title: "手机",
                    dataIndex: "phone",
                    width: "120px"
                },
                {
                    title: "微信",
                    dataIndex: "wx",
                    width: "120px"
                },
                {
                    title: "QQ",
                    dataIndex: "qq",
                    width: "120px"
                },
                {
                    title: "备注",
                    dataIndex: "remark",
                    width: "120px",
                    scopedSlots: { customRender: "remark" }
                },
                {
                    title: "接待员",
                    dataIndex: "receptionist_doc.name",
                    width: "100px"
                },
                {
                    title: "接待时间",
                    dataIndex: "receptTime",
                    width: "150px",
                    scopedSlots: { customRender: "receptTime" }
                },
                {
                    title: "分配时间",
                    dataIndex: "allocTime",
                    width: "150px",
                    scopedSlots: { customRender: "allocTime" }
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    width: "100px",
                    scopedSlots: { customRender: "status" }
                },
                {
                    title: "售前人员",
                    dataIndex: "seller",
                    width: "180px",
                    scopedSlots: { customRender: "seller" }
                }
            ],
            // 查询已录入的客户信息 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                this.queryLoading = true;
                return getList(
                    Object.assign(parameter, this.queryParam, {
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
        //更新客户
        async updateCustom(record) {
            record.editing = false;
            this.editingCache = {};
            try {
                let modifySuccess = await alloc({
                    cid: record.cid,
                    seller: record.seller,
                    sellerManager: this.sellerManager
                });
                this.$notification.success({
                    $message: "成功",
                    description: "客户更新成功"
                });
                this.queryTable(false);
            } catch (error) {}
        },
        queryTable(toFirst = true) {
            this.editingCache = {};
            this.$refs.table.refresh(toFirst);
        },
        resetQueryparam() {
            this.queryParam = {};
            this.queryTable();
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
        }
    }
};
</script>
