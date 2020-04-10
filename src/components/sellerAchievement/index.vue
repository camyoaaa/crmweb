<template>
    <a-card :borderd="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-form-item label="收款单号">
                            <a-input v-model="queryParam.payreceiptid" placeholder="请输入收据单号" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="单据状态">
                            <a-select v-model="queryParam.status">
                                <a-select-option :value="1">待审核</a-select-option>
                                <a-select-option :value="2">通过</a-select-option>
                                <a-select-option :value="3">失败</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="收款人">
                            <staff-select :did="did" :pid="pid" :isadmin="isadmin" v-model='queryParam.creator' placeholder="选择收款人" />
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
        <s-table ref="table" rowKey="payreceiptid" :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
        }" :columns="columns" :data="loadData" showPagination="auto" :pagination="pagination">

            <span slot="way" slot-scope="text,record">
                {{text==1?'支付宝支付':text==2?"微信支付":'银行卡'}}
            </span>
            <span slot="shot" slot-scope="text,record">
                <image-preview :src="text" style="height:52px;width:52px;border:none" />
            </span>
            <span slot="money" slot-scope="text,record">
                {{text | numformat}}
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
            <span slot="reviewmark" slot-scope="text,record">
                <a-textarea v-if="record.editing" v-model="record.reviewmark" size="small" />
                <ellipsis v-else tooltip :length="80" :title="text">
                    {{text}}
                </ellipsis>
            </span>
            <span slot="reviewer" slot-scope="text,record">
                {{text[0]?text[0].name:'无'}}
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
import { getList, modify } from "@/myapi/payreceipt.js";
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
                    title: "收款截图",
                    dataIndex: "shot",
                    width: "120px",
                    scopedSlots: { customRender: "shot" }
                },
                {
                    title: "收款单号",
                    width: "120px",
                    dataIndex: "payreceiptid"
                },
                {
                    title: "收款金额",
                    dataIndex: "money",
                    width: "120px",
                    scopedSlots: { customRender: "money" }
                },
                {
                    title: "收款人",
                    width: "120px",
                    dataIndex: "creatorInfo.name"
                },
                {
                    title: "收款方式",
                    dataIndex: "way",
                    width: "120px",
                    scopedSlots: { customRender: "way" }
                },
                {
                    title: "收款账号",
                    width: "150px",
                    dataIndex: "account"
                },
                {
                    title: "收款时间",
                    dataIndex: "createTime",
                    width: "180px",
                    scopedSlots: { customRender: "createTime" }
                },
                {
                    title: "审核人",
                    dataIndex: "reviewer",
                    width: "150px",
                    scopedSlots: { customRender: "reviewer" }
                },
                {
                    title: "审核状态",
                    width: "150px",
                    dataIndex: "status",
                    scopedSlots: { customRender: "status" }
                },
                {
                    title: "审核备注",
                    dataIndex: "reviewmark",
                    width: "180px",
                    scopedSlots: { customRender: "reviewmark" }
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
            let { payreceiptid, status, reviewmark } = record;
            record.editing = false;
            this.editingCache = {};
            try {
                let result = await modify({
                    payreceiptids: [payreceiptid],
                    status,
                    reviewmark,
                    reviewer: this.reviewer
                });
                this.$notification.success({
                    message: "审核状态更新成功",
                    description:
                        status == 2
                            ? `已为${record.creatorInfo.name}添加业绩`
                            : `系统会将未通过备注通知收款人 ${record.creatorInfo.name}`
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
                payreceiptids: this.selectedRowKeys,
                status: this.batstatus,
                reviewmark: this.batreviewmark,
                reviewer: this.reviewer
            });
            this.$notification.success({
                message: "审核状态更新成功",
                description: "批量审核成功,系统会自动通知收款人"
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