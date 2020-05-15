<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="订单编号">
              <id-input v-model="queryParam.oid" placeholder="输入订单编号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="下单客户">
              <id-input v-model="queryParam.cid" placeholder="输入客户编号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="订购套餐">
              <meal-select v-model="queryParam.mid" placeholder="选择套餐" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="创建人">
              <staff-select
                v-model="queryParam.creator"
                role-name="销售员"
                placeholder="选择创建人"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="订单状态">
              <a-select v-model="queryParam.status" placeholder="选择订单状态">
                <a-select-option :value="0">
                  未结清
                </a-select-option>
                <a-select-option :value="1">
                  已结清
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="创建时间">
              <a-range-picker
                v-model="queryParam.range"
                style="width:100%"
                :showTime="{
                  hideDisabledOptions: true,
                  defaultValue: [
                    $moment('00:00:00', 'HH:mm'),
                    $moment('23:59:59', 'HH:mm')
                  ]
                }"
                format="YYYY-MM-DD HH:mm"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="上一售后">
              <staff-select
                v-model="queryParam.lastExecutor"
                role-name="售后员"
                placeholder="选择售后员"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="售后员">
              <staff-select
                v-model="queryParam.executor"
                role-name="售后员"
                placeholder="选择售后员"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator" style="margin-bottom:18px">
      <a-button type="primary" @click="queryTable" icon="search">查询</a-button>
      <a-button type="primary" @click="resetQueryparam" icon="redo"
        >重置</a-button
      >
    </div>
    <a-spin :spinning="queryLoading">
      <!-- <s-table size="middle" ref="table" rowKey="oid" :alert="false" :columns="columns" :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }" :data="loadData" showPagination="auto" :pagination="pagination"> -->
      <s-table
        size="middle"
        ref="table"
        rowKey="oid"
        :alert="false"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :pagination="pagination"
      >
        <span slot="oid" slot-scope="text">
          <router-link :to="{ path: '/orderDetail', query: { oid: text } }">{{
            text
          }}</router-link>
        </span>
        <span slot="createTime" slot-scope="text">
          {{ text | dateformat }}
        </span>
        <span slot="money" slot-scope="text">
          {{ text | numformat }}
        </span>
        <span slot="cid" slot-scope="text, record">
          <router-link :to="{ path: '/customDetail', query: { cid: text } }"
            >{{ record.customName }}/{{ text }}</router-link
          >
        </span>
        <span slot="paidMoney" slot-scope="text, record">
          <router-link
            :to="{ path: '/receiptManage', query: { orderid: record.oid } }"
            >{{ record.paidPassed | numformat }}/{{
              record.paidTotal | numformat
            }}</router-link
          >
        </span>
        <span slot="distributorName" slot-scope="text, record">
          {{ text || "未分配" }}
        </span>
        <span slot="lastExecutorName" slot-scope="text, record">
          {{ text || "无" }}
        </span>
        <span slot="executorName" slot-scope="text, record">
          <staff-select
            v-if="record.editing"
            size="small"
            preselect
            role-name="售后员"
            detail
            v-model="record.executor"
          ></staff-select>
          <div v-else>{{ text || "无" }}</div>
        </span>
        <span slot="remark" slot-scope="text, record">
          <ellipsis :length="10" tooltip>{{ record.remark || "无" }}</ellipsis>
        </span>
        <span slot="contract" slot-scope="text, record">
          <router-link
            v-if="record.contract.way"
            :to="{
              path: '/contractManage',
              query: { ctid: record.contract.ctid }
            }"
          >
            {{ record.contract.way === 1 ? "法大大电子合同" : "现场签约" }}
          </router-link>
          <div v-else>暂未签约</div>
        </span>
        <span slot="action" slot-scope="text, record">
          <div v-if="record.editing">
            <a-button
              size="small"
              icon="check"
              @click="transOrder(record)"
              :disabled="record.executor === editingCache.executor"
            ></a-button>
            <a-button
              size="small"
              icon="close"
              @click="cancelTrans(record)"
            ></a-button>
          </div>
          <div v-else>
            <a-button
              type="primary"
              size="small"
              @click="transOrder1(record)"
              :disabled="
                !$auth('orderManage.alloc') ||
                  Object.keys(editingCache).length > 0
              "
              >{{ record.executor ? "转移" : "分配" }}</a-button
            >
            <a-button
              v-if="paidOver(record)"
              size="small"
              @click="upgradeOrder(record)"
              :disabled="
                !$auth('orderManage.upgrade') ||
                  Object.keys(editingCache).length > 0
              "
              >升级</a-button
            >
            <a-button
              v-else
              size="small"
              @click="addaReceipt(record)"
              :disabled="
                !$auth('orderManage.receipt') ||
                  Object.keys(editingCache).length > 0
              "
              >收/退款</a-button
            >
            <a-button
              size="small"
              @click="signContract(record)"
              :disabled="
                !$auth('orderManage.contract') ||
                  Object.keys(editingCache).length > 0
              "
              >合同</a-button
            >
          </div>
        </span>
      </s-table>
    </a-spin>
    <adda-receipt ref="addaReceipt" @ok="queryTable"></adda-receipt>
    <sign-contract ref="signContract" @ok="queryTable"></sign-contract>
    <upgrade-order ref="upgradeOrder" @ok="queryTable"></upgrade-order>
  </a-card>
</template>

<script>
import AllocOrder from "./AllocOrder.vue";
import UpgradeOrder from "./UpgradeOrder.vue";
import SignContract from "./SignContract.vue";
import AddaReceipt from "./AddaReceipt.vue";
import TransOrder from "./TransOrder.vue";
import { getList, updateOrder, alloc } from "@/myapi/order.js";
import { mapState } from "vuex";
export default {
  name: "TableList",
  components: { SignContract, AddaReceipt, TransOrder, UpgradeOrder },
  computed: {
    ...mapState({
      roleList: state => state.appconfig.appRoleList,
      role: state => state.user.role,
      userAcconut: state => state.user.account
    })
  },
  created() {
    if (!this.$auth("orderManage.search")) {
      this.$router.push({ path: "/403" });
      return;
    }
    let preQuery = this.$route.query;
    let toNumber = [
      "oid",
      "cid",
      "mid",
      "creator",
      "status",
      "lastExecutor",
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
          title: "订单编号",
          dataIndex: "oid",
          scopedSlots: { customRender: "oid" }
        },
        {
          title: "订购套餐",
          dataIndex: "mealName"
        },
        {
          title: "订单金额",
          dataIndex: "money",
          scopedSlots: { customRender: "money" }
        },
        {
          title: "审核通过/已收 金额",
          dataIndex: "paidMoney",
          scopedSlots: { customRender: "paidMoney" }
        },
        {
          title: "下单客户",
          dataIndex: "cid",
          scopedSlots: { customRender: "cid" }
        },
        {
          title: "下单时间",
          dataIndex: "createTime",
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "备注",
          dataIndex: "remark",
          scopedSlots: { customRender: "remark" }
        },
        {
          title: "已签合同",
          dataIndex: "contract",
          scopedSlots: { customRender: "contract" }
        },
        {
          title: "创建人",
          dataIndex: "creatorName"
        },
        {
          title: "分配人",
          dataIndex: "distributorName",
          scopedSlots: { customRender: "distributorName" }
        },
        {
          title: "上一售后",
          dataIndex: "lastExecutorName",
          scopedSlots: { customRender: "lastExecutorName" }
        },
        {
          title: "当前售后",
          dataIndex: "executorName",
          scopedSlots: { customRender: "executorName" },
          width: "150px"
        },

        {
          title: "操作",
          dataIndex: "action",
          width: "220px",
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
    paidOver(order) {
      let paidMoney = this.getPaidMoney(order);
      return paidMoney >= order.money;
    },
    getPaidMoney(order) {
      let total = order.payList.reduce((p1, p2) => {
        return p1 + (p2.money || 0);
      }, 0);
      return total;
    },
    getOrderStatus(order) {
      let paidMoney = this.getPaidMoney(order);
      let paidOver = paidMoney >= order.money;
      if (paidOver) {
        return "";
      }
    },
    openNewModal() {
      this.$refs.createform.open();
    },
    openTransModal(record) {
      this.editingCache = { ...record };
      this.$refs.transOrder.open(record.seller);
    },
    cancelTrans(record) {
      for (const key in record) {
        if (record.hasOwnProperty(key)) {
          record[key] = this.editingCache[key];
        }
      }
      this.editingCache = {};
    },
    transOrder1(order) {
      this.editingCache = { ...order };
      order.editing = true;
    },
    addaReceipt(order) {
      this.$refs.addaReceipt.open(order);
    },
    signContract(order) {
      this.$refs.signContract.open(order);
    },
    upgradeOrder(order) {
      this.$refs.upgradeOrder.open(order);
    },
    async transOrder(record) {
      try {
        let result = await alloc({
          oid: this.editingCache.oid,
          distributor: this.userAcconut,
          lastExecutor: this.editingCache.executor || undefined,
          executor: record.executor,
          allocTime: Date.now()
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
    followCustom(cid) {
      // this.$router.push({ path: "/customFollow", query: { cid } });
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
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    }
  }
};
</script>
