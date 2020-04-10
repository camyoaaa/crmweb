<template>
    <a-card :borderd="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-form-item label="合同编号">
                            <a-input v-model="queryParam.ctid" placeholder="请输入合同编号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="合同状态">
                            <a-select v-model="queryParam.status">
                                <a-select-option :value="1">待审核</a-select-option>
                                <a-select-option :value="2">通过</a-select-option>
                                <a-select-option :value="3">失败</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="签约人">
                            <staff-select :did="did" :pid="pid" :isadmin="isadmin" v-model='queryParam.creator' placeholder="选择签约人" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="审核人">
                            <staff-select :did="did" :pid="pid" :isadmin="isadmin" :querypchilren="false" v-model='queryParam.reviewer' placeholder="选择审核人" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div class="table-operator" style="margin-bottom:18px">
            <a-button type="primary" icon="search" @click="queryTable">查询</a-button>
            <a-button type="primary" icon="redo" @click="resetQueryparams">重置</a-button>
            <a-dropdown v-if="selectedRowKeys.length > 0">
                <a-menu slot="overlay">
                    <a-menu-item key="2" @click="openbatModal(2)">
                        <a-icon type="check" />
                        审核通过
                    </a-menu-item>
                    <a-menu-item key="3" @click="openbatModal(3)">
                        <a-icon type="close" />
                        审核驳回
                    </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
            <a-modal :title="`审核${batstatus == 2?'通过':'驳回'}备注`" v-model="batreviewVisible" @ok="batModify">
                <a-textarea v-model="batreviewmark" :rows="2" />
            </a-modal>
        </div>
        <s-table ref="table" rowKey="ctid" :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
        }" :columns="columns" :data="loadData" showPagination="auto" :pagination="pagination">

            <span slot="way" slot-scope="text,record">
                {{text==1?'法大大电子合同':'现场签约'}}
            </span>
            <span slot="orderid" slot-scope="text,record">
                <router-link :to="{path:'/orderDetail',query:{oid:text}}">{{text}}</router-link>
            </span>
            <span slot="url" slot-scope="text,record">
                <div style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">
                    <a-tooltip :title="text">
                        <a :href="text" target="_blank">{{text}}</a>
                    </a-tooltip>
                </div>
            </span>
            <span slot="shot" slot-scope="text,record">
                <image-preview :src="text" style="height:52px;width:52px;border:none" />
            </span>
            <span slot="createTime" slot-scope="text,record">
                {{text | dateformat}}
            </span>
            <span slot="status" slot-scope="text,record">
                <a-select v-if="record.editing" v-model="record.status" style="width:100%">
                    <a-select-option :value="1" disabled>待审核</a-select-option>
                    <a-select-option :value="2">通过</a-select-option>
                    <a-select-option :value="3">驳回</a-select-option>
                </a-select>
                <a-badge v-else :status="text==1?'warning':text==2?'success':'error'" :text="text==1?'待审核':text==2?'通过':'未通过'" />
            </span>
            <span slot="remark" slot-scope="text,record">
                <a-textarea v-if="record.editing" v-model="record.remark" size="small" />
                <div v-else style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">
                    <a-tooltip :title="text">
                        {{text}}
                    </a-tooltip>
                </div>
            </span>
            <span slot="reviewer" slot-scope="text,record">
                {{record.reviewerInfo[0]?record.reviewerInfo[0].name:'无'}}
            </span>
            <span slot="action" slot-scope="text,record">
                <template v-if="record.editing">
                    <a-button type="primary" size="small" @click="reviewReceipt(record)">确定</a-button>
                    <a-button type="dashed" size="small" @click="cancelReview(record)">取消</a-button>
                </template>
                <template v-else>
                    <a-button type="primary" size="small" @click="beforeReviewReceipt(record)" :disabled="Object.keys(editingCache).length > 0">审核</a-button>
                </template>
            </span>
        </s-table>
    </a-card>
</template>

<script>
import { getList, modify } from "@/myapi/contract.js";
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState({
            did: state => state.user.department,
            pid: state => state.user.post,
            isadmin: state => state.user.isadmin,
            reviewer: state => state.user.account
        })
    },
    data() {
        return {
            queryParam: {},
            fuzzies: [],
            editingCache: {},
            batreviewVisible: false,
            batstatus: "",
            batreviewmark: "",
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
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
            pagination: {
                pageSizeOptions: ["10", "20", "30", "40", "50"],
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条数据`
            },
            selectedRowKeys: [],
            selectedRows: [],
            columns: [
                {
                    title: "合同截图",
                    dataIndex: "shot",
                    width: "120px",
                    scopedSlots: { customRender: "shot" }
                },
                {
                    title: "合同编号",
                    width: "100px",
                    dataIndex: "ctid"
                },
                {
                    title: "订单编号",
                    width: "100px",
                    dataIndex: "orderid",
                    scopedSlots: { customRender: "orderid" }
                },
                {
                    title: "签约方式",
                    dataIndex: "way",
                    width: "150px",
                    scopedSlots: { customRender: "way" }
                },
                {
                    title: "合同链接",
                    width: "200px",
                    dataIndex: "url",
                    scopedSlots: { customRender: "url" }
                },
                {
                    title: "签约人",
                    dataIndex: "creatorInfo.name",
                    width: "100px"
                },
                {
                    title: "签约时间",
                    dataIndex: "createTime",
                    width: "180px",
                    scopedSlots: { customRender: "createTime" }
                },
                {
                    title: "审核人",
                    dataIndex: "reviewer",
                    width: "100px",
                    scopedSlots: { customRender: "reviewer" }
                },
                {
                    title: "审核状态",
                    width: "100px",
                    dataIndex: "status",
                    scopedSlots: { customRender: "status" }
                },
                {
                    title: "审核备注",
                    dataIndex: "remark",
                    width: "180px",
                    scopedSlots: { customRender: "remark" }
                },
                {
                    title: "操作",
                    dataIndex: "action",
                    width: "150px",
                    scopedSlots: { customRender: "action" }
                }
            ]
        };
    },
    methods: {
        queryTable(toFirst = true) {
            this.editingCache = {};
            this.$refs.table.refresh(toFirst);
        },
        resetQueryparams() {
            this.queryParam = {};
            this.queryTable();
        },
        beforeReviewReceipt(record) {
            this.editingCache = { ...record };
            record.editing = true;
        },
        async reviewReceipt(record) {
            let { ctid, status, remark } = record;
            record.editing = false;
            this.editingCache = {};
            try {
                let result = await modify({
                    ctids: [ctid],
                    status,
                    remark,
                    reviewer: this.reviewer
                });
                this.$notification.success({
                    message: "审核状态更新成功",
                    description:
                        status == 2
                            ? `已为${record.creatorInfo.name}添加业绩`
                            : `系统会将未通过备注通知签约人 ${record.creatorInfo.name}`
                });
                this.queryTable(false);
            } catch (error) {}
        },
        cancelReview(record) {
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
        },
        passReview() {},
        loseReview() {},
        openbatModal(status) {
            this.batstatus = status;
            console.log("openbatModal");
            this.batreviewVisible = true;
        },
        async batModify() {
            let result = await modify({
                ctids: this.selectedRowKeys,
                status: this.batstatus,
                remark: this.batreviewmark,
                reviewer: this.reviewer
            });
            this.$notification.success({
                message: "审核状态更新成功",
                description: "批量审核成功,系统会自动通知签约人"
            });
            this.$refs.table.refresh();
            this.queryTable(false);
            this.batstatus = "";
            this.batreviewmark = "";
            this.batreviewVisible = false;
            this.selectedRowKeys = [];
        }
    }
};
</script>

<style lang="less" scoped>
</style>