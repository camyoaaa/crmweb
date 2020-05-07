<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-form-item label="员工编号">
                            <id-input v-model="queryParam.account" placeholder="请输入员工编号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="员工姓名">
                            <a-input v-model="queryParam.name" placeholder="请输入员工姓名" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="员工角色">
                            <role-select v-model="queryParam.role" placeholder="请选择员工角色" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="联系方式">
                            <a-input v-model="queryParam.contact" placeholder="QQ/微信/手机/邮箱" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" @click="queryTable" icon="search">查询</a-button>
            <a-button type="primary" icon="redo" @click="resetQueryparam">重置</a-button>
            <a-button :disabled="!$auth('staffManage.add')" type="primary" icon="plus" @click="$refs.createModal.add()">新增员工</a-button>
            <a-dropdown :disabled="!$auth('staffManage.modify')" v-if="selectedRowKeys.length > 0">
                <a-menu slot="overlay">
                    <a-menu-item key="1">
                        <a-popconfirm title="确定删除已选中的员工吗" placement="right" @confirm="deleteMany" @cancel="() => {}" okText="Yes" cancelText="No">
                            <a-icon type="delete" />
                            删除
                        </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item key="2" @click="stopBusiness">
                        <a-icon type="lock" />
                        暂停业务
                    </a-menu-item>
                    <a-menu-item key="3" @click="startBusiness">
                        <a-icon type="lock" />
                        全部上线
                    </a-menu-item>
                </a-menu>

                <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>
        <s-table size="middle" ref="table" rowKey="account" :columns="columns" :data="loadData" :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }" showPagination="auto" :pagination="pagination">
            <span slot="departmentPost" slot-scope="text, record, index">
                <org-tree-select v-if="record.editing" size="small" single-select :value="{
            ids: `${record.department_doc.did}-${record.post_doc.pid}`,
            labels: ''
          }" @change="
            ({ ids, labels }) => {
              if (ids) {
                record.deparment = ids.split('-')[0];
                record.post = ids.split('-')[1];
              }
            }
          "></org-tree-select>
                <a-tag v-else>
                    <a-icon :type="record.department_doc.icon" />
                    {{ record.department_doc.name }} - {{ record.post_doc.name }}
                </a-tag>
            </span>
            <span slot="status" slot-scope="text, record">
                <a-switch v-if="record.editing" :checkedChildren="workingStatus.name" :unCheckedChildren="offWorkingStatus.name" :checked="text === workingStatus.id" size="small" @change="
            checked => {
              record.status = checked ? workingStatus.id : offWorkingStatus.id;
            }
          " />
                <a-badge v-else :status="text === workingStatus.id ? 'processing' : 'error'" :text="text == workingStatus.id ? workingStatus.name : offWorkingStatus.name" />
            </span>

            <span slot="password" slot-scope="text, record">
                <div v-if="!record.editing">********</div>
                <a-input v-else size="small" type="password" :value="record.password" @change="
            e => {
              record.password = e.target.value;
            }
          "></a-input>
            </span>
            <span slot="daily" slot-scope="text, record">
                <div v-if="!record.editing">{{ text }}</div>
                <a-input-number v-else size="small" :value="record.daily" @change="
            value => {
              record.daily = value;
            }
          " />
            </span>
            <span slot="workin" slot-scope="text, record">
                <div v-if="!record.editing">
                    {{ record.workin.join(" - ") }}
                </div>
                <work-in v-else style="width:130px" size="small" v-model="record.workin" />
            </span>
            <span slot="role" slot-scope="text,record">
                <role-select v-if="record.editing" v-model="record.role" size="small" />
                <div v-else>{{getRoleName(text)}}</div>
            </span>
            <span slot="phone" slot-scope="text, record">
                <a-input v-if="record.editing" size="small" v-model="record.phone" />
                <div v-else>{{ text || '无' }}</div>
            </span>
            <span slot="wx" slot-scope="text, record">
                <a-input v-if="record.editing" size="small" v-model="record.wx" />
                <div v-else>{{ text || '无'}}</div>
            </span>
            <span slot="qq" slot-scope="text, record">
                <a-input v-if="record.editing" size="small" v-model="record.qq" />
                <div v-else>{{ text || '无'}}</div>
            </span>
            <span slot="email" slot-scope="text, record">
                <a-input v-if="record.editing" size="small" v-model="record.email" />
                <div v-else>{{ text || '无'}}</div>
            </span>
            <span slot="action" slot-scope="text, record">
                <template v-if="record.editing">
                    <a-button @click="updateStaff(record)" size="small" type="primary">保存</a-button>
                    <a-divider type="vertical" />
                    <a-button @click="cancelEdit(record)" size="small" type="dashed">取消</a-button>
                </template>
                <template v-else>
                    <a-button @click="editStaff(record)" size="small" type="primary" :disabled="!$auth('staffManage.modify') || Object.keys(editingCache).length > 0">编辑</a-button>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除这个客户吗" :disabled="!$auth('staffManage.modify') || Object.keys(editingCache).length > 0" @confirm="deleteStaff([record.account])" @cancel="() => {}" okText="Yes" cancelText="No">
                        <a-button size="small" type="dashed" :disabled="!$auth('staffManage.delete') || Object.keys(editingCache).length > 0">删除</a-button>
                    </a-popconfirm>
                </template>
            </span>
        </s-table>
        <create-form ref="createModal" @ok="$refs.table.refresh()" />
    </a-card>
</template>

<script>
import Ellipsis from "@/commonItems/Ellipsis";
import CreateForm from "./CreateForm";
import { getList, updateStaff, deleteStaff } from "@/myapi/staff.js";
import { mapState } from "vuex";
export default {
    name: "TableList",
    components: {
        Ellipsis,
        CreateForm
    },
    computed: {
        ...mapState({
            roleList: state => state.appconfig.appRoleList,
            staffStatusList: state => state.appconfig.staffStatusList
        }),
        workingStatus() {
            return this.staffStatusList.find(s => s.name === "正在工作") || {};
        },
        offWorkingStatus() {
            return this.staffStatusList.find(s => s.name === "暂停业务") || {};
        }
    },
    data() {
        return {
            // 查询参数
            queryParam: {
                departmentPost: {
                    ids: "",
                    labels: ""
                }
            },
            editingCache: {}, //编辑缓存
            fuzzies: ["name", "phone", "wx"],
            // 表头
            columns: [
                {
                    title: "工号",
                    dataIndex: "account",
                    width: "100px"
                },
                {
                    title: "姓名",
                    dataIndex: "name",
                    width: "120px",
                    scopedSlots: { customRender: "name" }
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    scopedSlots: { customRender: "status" },
                    width: "150px"
                },
                {
                    title: "工作时间",
                    dataIndex: "workin",
                    scopedSlots: { customRender: "workin" },
                    width: "150px"
                },
                {
                    title: "密码",
                    dataIndex: "password",
                    //   sorter: true,
                    //   needTotal: true,
                    scopedSlots: { customRender: "password" },
                    width: "150px"
                },
                {
                    title: "任务量",
                    dataIndex: "daily",
                    scopedSlots: { customRender: "daily" },
                    width: "90px"
                },
                {
                    title: "角色",
                    dataIndex: "role",
                    scopedSlots: { customRender: "role" },
                    width: "180px"
                },

                {
                    title: "手机",
                    dataIndex: "phone",
                    scopedSlots: { customRender: "phone" },
                    width: "180px"
                },
                {
                    title: "微信",
                    dataIndex: "wx",
                    scopedSlots: { customRender: "wx" },
                    width: "180px"
                },
                {
                    title: "Q Q",
                    dataIndex: "qq",
                    scopedSlots: { customRender: "qq" },
                    width: "180px"
                },
                {
                    title: "邮箱",
                    dataIndex: "email",
                    scopedSlots: { customRender: "email" },
                    width: "220px"
                },
                {
                    title: "操作",
                    dataIndex: "action",
                    width: "200px",
                    scopedSlots: { customRender: "action" }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                let { departmentPost, ...queryParam } = this.queryParam;
                if (departmentPost.ids) {
                    let dp = departmentPost.ids.split("-");
                    queryParam.department = dp[0];
                    if (dp[1] != "all") {
                        queryParam.post = dp[1];
                    }
                }
                return getList(
                    Object.assign(parameter, queryParam, {
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
        getRoleName(roleid) {
            return (this.roleList.find(r => r.id === roleid) || {}).name;
        },
        async updateStaff(record) {
            record.editing = false;
            this.editingCache = {};
            try {
                let { account, ...payload } = record;
                let modifySuccess = await updateStaff({
                    accounts: [account],
                    ...payload
                });
                this.$notification.success({
                    $message: "成功",
                    description: "员工更新成功"
                });
                this.$refs.table.refresh();
            } catch (error) {}
        },
        async stopBusiness() {
            try {
                let modifySuccess = await updateStaff({
                    accounts: this.selectedRowKeys,
                    status: 2
                });
                this.$notification.success({
                    $message: "成功",
                    description: "员工已全部暂停业务"
                });
                this.$refs.table.refresh();
            } catch (error) {}
        },
        async startBusiness() {
            try {
                let modifySuccess = await updateStaff({
                    accounts: this.selectedRowKeys,
                    status: 1
                });
                this.$notification.success({
                    $message: "成功",
                    description: "员工已全部上线工作"
                });
                this.$refs.table.refresh();
            } catch (error) {}
        },
        async deleteStaff(accounts) {
            try {
                let deleteSuccess = await deleteStaff(accounts);
                this.$notification.success({
                    $message: "成功",
                    description: "员工删除成功"
                });
                this.$refs.table.refresh();
            } catch (error) {}
        },
        deleteMany() {
            this.deleteStaff(this.selectedRowKeys);
            this.selectedRowKeys = [];
        },
        //编辑客户
        editStaff(record) {
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
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
        },
        queryTable(toFirst = true) {
            this.editingCache = {};
            this.$refs.table.refresh(toFirst);
        },
        resetQueryparam() {
            this.queryParam = {};
            this.queryTable();
        }
    }
};
</script>
