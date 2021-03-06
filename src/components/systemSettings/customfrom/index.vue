<template>
    <a-card :bordered="false">
        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新增来源</a-button>
        </div>
        <s-table ref="table" size="default" rowKey="name" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto" :pagination="pagination">
            <span slot="name" slot-scope="text, record">
                <div v-if="!record.editing">{{ text }}</div>
                <a-input v-else :value="record.name" @change="
            e => {
              record.name = e.target.value;
            }
          " />
            </span>
            <span slot="content" slot-scope="text, record">
                <div v-if="!record.editing">
                    {{ text }}
                </div>
                <a-input v-else :value="record.content" @change="
            e => {
              record.content = e.target.value;
            }
          " />
            </span>
            <span slot="action" slot-scope="text, record">
                <template>
                    <a v-if="!record.editing" @click="record.editing = true">编辑</a>
                    <a v-else @click="updateOrigin(record)">保存</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除这个来源吗" @confirm="deleteOrigin(record)" @cancel="() => {}" okText="Yes" cancelText="No">
                        <a>删除</a>
                    </a-popconfirm>
                </template>
            </span>
        </s-table>
        <create-form ref="createModal" @ok="handleOk" />
    </a-card>
</template>

<script>
import moment from "moment";
import CreateForm from "./CreateForm";
import { getList, modify, add, deleteOrigin } from "@/myapi/customfrom.js";

export default {
    name: "TableList",
    components: {
        CreateForm
    },
    data() {
        return {
            // 查询参数
            queryParam: {},
            // 表头
            columns: [
                {
                    title: "来源名称",
                    dataIndex: "name"
                },
                {
                    title: "来源内容",
                    dataIndex: "content",
                    scopedSlots: { customRender: "content" }
                },
                {
                    title: "操作",
                    dataIndex: "action",
                    width: "150px",
                    scopedSlots: { customRender: "action" }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                console.log("loadData.parameter", parameter);
                return getList(
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

            // custom table alert & rowSelection
            options: {
                alert: {
                    show: true,
                    clear: () => {
                        this.selectedRowKeys = [];
                    }
                },
                rowSelection: {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange
                }
            },
            optionAlertShow: true,
            pagination: {
                pageSizeOptions: ["10", "20", "30", "40", "50"],
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条数据`
            }
        };
    },
    filters: {
        statusFilter(type) {
            return statusMap[type].text;
        },
        statusTypeFilter(type) {
            return statusMap[type].status;
        }
    },
    created() {
        this.tableOption();
    },
    methods: {
        async updateOrigin(record) {
            record.editing = false;
            try {
                let modifySuccess = await modify(record);
                this.$notification.success({
                    $message: "成功",
                    description: "来源更新成功"
                });
            } catch (error) {}
        },
        async deleteOrigin(record) {
            try {
                let deleteSuccess = await deleteOrigin({ oid: record.oid });
                this.$notification.success({
                    $message: "成功",
                    description: "来源删除成功"
                });
                this.$refs.table.refresh();
            } catch (error) {
                console.log(error);
            }
        },
        tableOption() {
            if (!this.optionAlertShow) {
                this.options = {
                    alert: {
                        show: true,
                        clear: () => {
                            this.selectedRowKeys = [];
                        }
                    },
                    rowSelection: {
                        selectedRowKeys: this.selectedRowKeys,
                        onChange: this.onSelectChange,
                        getCheckboxProps: record => ({
                            props: {
                                disabled: record.no === "No 2", // Column configuration not to be checked
                                name: record.no
                            }
                        })
                    }
                };
                this.optionAlertShow = true;
            } else {
                this.options = {
                    alert: false,
                    rowSelection: null
                };
                this.optionAlertShow = false;
            }
        },

        handleEdit(record) {
            console.log(record);
            this.$refs.modal.edit(record);
        },
        handleSub(record) {
            if (record.status !== 0) {
                this.$message.info(`${record.no} 订阅成功`);
            } else {
                this.$message.error(`${record.no} 订阅失败，规则已关闭`);
            }
        },
        handleOk() {
            this.$refs.table.refresh();
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
        }
    }
};
</script>
