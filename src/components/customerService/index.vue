<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="客户编号">
              <id-input v-model="queryParam.cid" placeholder="请输入客户编号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="客户姓名">
              <a-input v-model="queryParam.name" placeholder="请输入客户姓名" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="联系方式">
              <a-input
                v-model="queryParam.contact"
                placeholder="请输入QQ/微信/手机号"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="客户状态">
              <custom-status-select v-model="queryParam.status" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator" style="margin-bottom:18px">
      <a-button type="primary" @click="queryTable">查询</a-button>
      <a-button type="primary" @click="resetQueryparams">重置</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="cid"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
      :pagination="pagination"
    >
      <span slot="sellerAllocTime" slot-scope="text, record">
        <div>{{ text | dateformat }}</div>
      </span>
      <span slot="status" slot-scope="text, record">
        <a-badge
          :color="record.status_doc.color"
          :text="record.status_doc.name"
        ></a-badge>
      </span>
      <span slot="followList" slot-scope="text, record">
        {{ getNewestRecord(record.followList) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a-button size="small" type="primary" @click="followCustom(record.cid)">
          跟进
        </a-button>
        <!-- <a-button
          v-if="record.status_doc.name == '已成交'"
          size="small"
          type="primary"
          @click="$refs.enteryeji.open(record)"
        >
          业绩录入
        </a-button>
        <a-button
          v-if="record.status_doc.name == '已成交'"
          size="small"
          type="primary"
          @click="$refs.contractdr.open(record)"
        >
          新增合同
        </a-button> -->
        <a-button
          v-if="record.status_doc.name == '已成交'"
          size="small"
          type="primary"
          @click="$refs.signOrder.open(record)"
        >
          签单
        </a-button>
        <a-button
          v-if="record.status_doc.name == '已成交'"
          size="small"
          type="primary"
          @click="$refs.ordermanage.open(record)"
        >
          订单管理
        </a-button>
      </span>
    </s-table>
    <enter-yeji ref="enteryeji"></enter-yeji>
    <contract-drawer ref="contractdr"></contract-drawer>
    <sign-order ref="signOrder"></sign-order>
    <order-manage ref="ordermanage"></order-manage>
  </a-card>
</template>

<script>
import {
  getList,
  deleteCustom,
  modify,
  getSellerCustomList
} from "@/myapi/custom.js";
import EnterYeji from "./EnterYeji";
import contractDrawer from "./contractDrawer";
import SignOrder from "./SignOrder";
import OrderManage from "./OrderManage";

import { mapState } from "vuex";

export default {
  name: "TableList",
  components: {
    EnterYeji,
    contractDrawer,
    SignOrder,
    OrderManage
  },
  computed: {
    ...mapState({
      seller: state => state.user.account
    })
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      fuzzies: ["name"],
      // 表头
      columns: [
        {
          title: "编号",
          dataIndex: "cid",
          width: "100px"
        },
        {
          title: "名称",
          dataIndex: "name",

          scopedSlots: { customRender: "name" }
        },
        {
          title: "来源",
          dataIndex: "from_doc.name"
        },
        {
          title: "手机",
          dataIndex: "phone",
          scopedSlots: { customRender: "phone" }
        },
        {
          title: "微信",
          dataIndex: "wx",
          scopedSlots: { customRender: "wx" }
        },
        {
          title: "QQ",
          dataIndex: "qq",
          scopedSlots: { customRender: "qq" }
        },

        {
          title: "售前经理",
          dataIndex: "sellerManager_doc.name"
        },

        {
          title: "分配时间",
          dataIndex: "sellerAllocTime",
          scopedSlots: { customRender: "sellerAllocTime" }
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "备注",
          dataIndex: "remark",
          scopedSlots: { customRender: "remark" }
        },
        {
          title: "跟进记录",
          dataIndex: "followList",
          scopedSlots: { customRender: "followList" }
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getSellerCustomList(
          Object.assign(parameter, this.queryParam, {
            seller: this.seller,
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
    followCustom(cid) {
      this.$router.push({ path: "/customFollow", query: { cid } });
    },
    queryTable() {
      this.$refs.table.refresh(true);
    },
    resetQueryparams() {
      this.queryParam = {};
      this.queryTable();
    },
    getNewestRecord(followList) {
      return Array.isArray(followList) && followList.length > 0
        ? followList[followList.length - 1].comment
        : "";
    }
  }
};
</script>
