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
                        <a-form-item label="接待人员">
                            <staff-select v-model="queryParam.receptionist" :did="did" :pid="pid" :querypchilren="false" :admin="isadmin" placeholder="请选择销售人员" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" @click="queryTable" icon="search">查询</a-button>
            <a-button type="primary" @click="resetQueryparams" icon="redo">重置</a-button>
            <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新增客户</a-button>
            <a-dropdown v-if="selectedRowKeys.length > 0">
                <a-menu slot="overlay">
                    <a-menu-item key="1">
                        <a-popconfirm title="确定删除已选中的客户吗" placement="right" @confirm="deleteMany" @cancel="() => {}" okText="Yes" cancelText="No">
                            <a-icon type="delete" />删除
                        </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item key="2">
                        <a-icon type="lock" />锁定</a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>
        <a-spin :spinning="queryLoading">
            <s-table ref="table" :rowKey="record => record.cid" :alert="false" :columns="columns" :data="loadData" :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }" showPagination="auto" :pagination="pagination">
                <span slot="cid" slot-scope="text, record">
                    <router-link :to="{path:'/customDetail',query:{cid:text}}">{{text}}</router-link>
                </span>
                <span slot="name" slot-scope="text, record">
                    <a-input size="small" v-if="record.editing" v-model="record.name" />
                    <div v-else>{{ text }}</div>
                </span>
                <span slot="phone" slot-scope="text, record">
                    <id-input size="small" v-if="record.editing" v-model="record.phone" />
                    <div v-else>{{ text }}</div>
                </span>
                <span slot="wx" slot-scope="text, record">
                    <a-input size="small" v-if="record.editing" v-model="record.wx" />
                    <div v-else>{{ text }}</div>
                </span>
                <span slot="qq" slot-scope="text, record">
                    <id-input size="small" v-if="record.editing" v-model="record.qq" />
                    <div v-else>{{ text }}</div>
                </span>
                <span slot="receptionistremark" slot-scope="text, record">
                    <a-input size="small" v-if="record.editing" v-model="record.receptionistremark" />
                    <div v-else>{{ text }}</div>
                </span>
                <span slot="receptionist" slot-scope="text">
                    {{ text | dateformat }}
                </span>
                <span slot="receptTime" slot-scope="text">
                    {{ text | dateformat }}
                </span>
                <span slot="status" slot-scope="text, record">
                    <a-badge :color="record.status_doc.color" :text="record.status_doc.name" />
                </span>
                <span slot="action" slot-scope="text, record">
                    <template v-if="record.editing">
                        <a-button @click="updateCustom(record)" size="small" type="primary">保存</a-button>
                        <a-divider type="vertical" />
                        <a-button @click="cancelEdit(record)" size="small" type="dashed">取消</a-button>
                    </template>
                    <template v-else>
                        <a-button @click="editCustom(record)" size="small" type="primary" :disabled="Object.keys(editingCache).length > 0">编辑</a-button>
                        <a-divider type="vertical" />
                        <a-popconfirm title="确定删除这个客户吗" @confirm="deleteCustom([record.cid])" @cancel="() => {}" okText="Yes" cancelText="No">
                            <a-button size="small" type="dashed">删除</a-button>
                        </a-popconfirm>
                    </template>
                </span>
            </s-table>
        </a-spin>
        <create-form ref="createModal" @ok="queryTable" />
    </a-card>
</template>

<script>
import Ellipsis from "@/commonItems/Ellipsis";
import CreateForm from "./CreateForm";
import { getList, deleteCustom, modify } from "@/myapi/custom.js";
import { mapState } from "vuex";
export default {
    name: "TableList",
    components: {
        Ellipsis,
        CreateForm
    },
    computed: {
        ...mapState({
            did: state => state.user.department,
            pid: state => state.user.post,
            isadmin: state => state.user.isadmin
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
                    width: "100px",
                    scopedSlots: { customRender: "cid" }
                },
                {
                    title: "姓名",
                    dataIndex: "name",
                    width: "150px",
                    scopedSlots: { customRender: "name" }
                },
                {
                    title: "来源",
                    dataIndex: "from_doc.name",
                    width: "120px"
                },
                {
                    title: "手机",
                    dataIndex: "phone",
                    width: "200px",
                    scopedSlots: { customRender: "phone" }
                },
                {
                    title: "微信",
                    dataIndex: "wx",
                    width: "200px",
                    scopedSlots: { customRender: "wx" }
                },
                {
                    title: "QQ",
                    dataIndex: "qq",
                    width: "200px",
                    scopedSlots: { customRender: "qq" }
                },
                {
                    title: "备注",
                    dataIndex: "remark",
                    width: "200px",
                    scopedSlots: { customRender: "remark" }
                },
                {
                    title: "接待员",
                    dataIndex: "receptionist_doc.name",
                    width: "150px"
                },
                {
                    title: "接待时间",
                    dataIndex: "receptTime",
                    width: "200px",
                    scopedSlots: { customRender: "receptTime" }
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    width: "100px",
                    scopedSlots: { customRender: "status" }
                },
                {
                    title: "操作",
                    dataIndex: "action",
                    width: "180px",
                    scopedSlots: { customRender: "action" }
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
        //更新客户
        async updateCustom(record) {
            record.editing = false;
            this.editingCache = {};
            try {
                let modifySuccess = await modify(record);
                this.$notification.success({
                    $message: "成功",
                    description: "客户更新成功"
                });
                this.queryTable(false);
            } catch (error) {}
        },
        //删除客户
        async deleteCustom(cids) {
            try {
                let deleteSuccess = await deleteCustom(cids);
                this.$notification.success({
                    $message: "成功",
                    description: "客户删除成功"
                });
                this.queryTable(false);
            } catch (error) {
                console.log(error);
            }
        },
        queryTable(toFirst = true) {
            this.editingCache = {};
            this.$refs.table.refresh(toFirst);
        },
        resetQueryparams() {
            this.queryParam = {};
            this.queryTable();
        },
        deleteMany() {
            this.deleteCustom(this.selectedRowKeys);
            this.selectedRowKeys = [];
        },
        //编辑客户
        editCustom(record) {
            this.editingCache = { ...record };
            record.editing = true;
        },
        //取消编辑
        cancelEdit(record) {
            for (const key in record) {
                if (record.hasOwnProperty(key)) {
                    record[key] = this.editingCache[key];
                }
            }
            this.editingCache = {};
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
        }
    }
};
</script>
