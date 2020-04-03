<template>
    <a-card :bordered="false">
        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新增套餐</a-button>
            <a-button type="dashed" @click="tableOption">{{ (optionAlertShow && "关闭") || "开启" }} alert</a-button>
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
            <span slot="price" slot-scope="text, record">
                <div v-if="!record.editing">{{ text }}</div>
                <a-input-number v-else :value="record.price" @change="
            value => {
              record.price = value;
            }
          " />
            </span>
            <span slot="minDeposit" slot-scope="text, record">
                <div v-if="!record.editing">{{ text }}</div>
                <a-input-number v-else :value="record.minDeposit" @change="
            value => {
              record.minDeposit = value;
            }
          " />
            </span>
            <span slot="content" slot-scope="text, record">
                <div v-if="!record.editing">
                    <a-tag v-for="(t, index) in String(text).split(',')" :key="index">
                        {{ businiseeMap[t] }}
                    </a-tag>
                </div>
                <a-select v-else mode="multiple" :value="record.content" @change="
            value => {
              record.content = value;
            }
          ">
                    <a-select-option value="0">
                        店铺注册
                    </a-select-option>
                    <a-select-option value="1">
                        货源提供
                    </a-select-option>
                    <a-select-option value="2">
                        店铺装修
                    </a-select-option>
                    <a-select-option value="3">
                        店铺运营
                    </a-select-option>
                </a-select>
            </span>
            <span slot="action" slot-scope="text, record">
                <template>
                    <a v-if="!record.editing" @click="record.editing = true">编辑</a>
                    <a v-else @click="updateMeal(record)">保存</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除这个套餐吗" @confirm="deleteMeal(record)" @cancel="() => {}" okText="Yes" cancelText="No">
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
import Ellipsis from "@/commonItems/Ellipsis";
import CreateForm from "./CreateForm";
import { getList, modify, add, deleteMeal } from "@/myapi/meal.js";

const businiseeMap = {
    "0": "店铺注册",
    "1": "货源提供",
    "2": "店铺装修",
    "3": "店铺运营"
};

export default {
    name: "TableList",
    components: {
        Ellipsis,
        CreateForm
    },
    data() {
        return {
            businiseeMap,
            // 查询参数
            queryParam: {},
            // 表头
            columns: [
                {
                    title: "套餐名称",
                    dataIndex: "name"
                },
                {
                    title: "套餐价格",
                    dataIndex: "price",
                    scopedSlots: { customRender: "price" }
                },
                {
                    title: "最低套餐定金",
                    dataIndex: "minDeposit",
                    scopedSlots: { customRender: "minDeposit" }
                },
                {
                    title: "套餐业务",
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
        addMeal() {
            const {
                form: { validateFields }
            } = this;
            this.confirmLoading = true;
            validateFields(async (errors, values) => {
                if (!errors) {
                    try {
                        let addresult = await add(values);
                        console.log("addresult", addresult);
                        if (addresult.status == 200) {
                            this.$notification.success({
                                message: "成功",
                                description: "新增套餐成功"
                            });
                            this.$refs.table.refresh();
                        } else {
                            throw new Error();
                        }
                    } catch (error) {
                        this.$notification.success({
                            message: "失败",
                            description: "新增套餐失败"
                        });
                    } finally {
                        this.visible = false;
                        this.confirmLoading = false;
                        this.$emit("ok", values);
                    }
                } else {
                    this.confirmLoading = false;
                }
            });
        },
        async updateMeal(record) {
            record.editing = false;
            try {
                let modifySuccess = await modify(record);
                this.$notification.success({
                    $message: "成功",
                    description: "套餐更新成功"
                });
            } catch (error) {}
        },
        async deleteMeal(record) {
            try {
                let deleteSuccess = await deleteMeal({ mid: record.mid });
                this.$notification.success({
                    $message: "成功",
                    description: "套餐删除成功"
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
