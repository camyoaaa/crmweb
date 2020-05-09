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
              <a-input
                v-model="queryParam.contact"
                placeholder="QQ/手机/微信号"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="接待人员">
              <staff-select
                v-model="queryParam.receptionist"
                role-name="接待员"
                placeholder="请选择接待人员"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="上一销售">
              <staff-select
                v-model="queryParam.lastSeller"
                role-name="销售员"
                placeholder="请选择销售人员"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售人员">
              <staff-select
                v-model="queryParam.seller"
                role-name="销售员"
                placeholder="请选择销售人员"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="客户状态">
              <custom-status-select
                v-model="queryParam.status"
                placeholder="请选择客户状态"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="接待时间">
              <a-range-picker
                style="width:100%"
                v-model="queryParam.range"
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
        </a-row>
      </a-form>
    </div>

    <div class="table-operator" style="margin-bottom:18px">
      <a-button type="primary" @click="queryTable" icon="search">查询</a-button>
      <a-button type="primary" @click="resetQueryparam" icon="redo"
        >重置</a-button
      >
      <a-button
        type="primary"
        @click="openNewModal"
        icon="plus"
        :disabled="!$auth('customManage.add')"
        >添加</a-button
      >
    </div>
    <a-spin :spinning="queryLoading">
      <!-- <s-table size="middle" ref="table" rowKey="cid" :alert="false" :columns="columns" :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }" :data="loadData" showPagination="auto" :pagination="pagination"> -->
      <s-table
        size="middle"
        ref="table"
        rowKey="cid"
        :alert="false"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :pagination="pagination"
      >
        <span slot="receptTime" slot-scope="text">
          {{ text | dateformat }}
        </span>
        <span slot="lastSellerName" slot-scope="text">
          {{ text || "无" }}
        </span>
        <span slot="phone" slot-scope="text">
          <!-- <a-icon type="phone" :style="{color:'#1890ff'}" /> -->
          <ellipsis :length="11" tooltip>{{ text || "无" }}</ellipsis>
        </span>
        <span slot="qq" slot-scope="text">
          <!-- <a-icon type="qq" :style="{color:'rgb(168,168,168)'}" /> -->
          {{ text || "无" }}
        </span>
        <span slot="wx" slot-scope="text">
          <!-- <a-icon type="wechat" :style="{color:'rgb(42,162,70)'}" /> -->
          {{ text || "无" }}
        </span>
        <span slot="cid" slot-scope="text">
          <router-link :to="{ path: '/customDetail', query: { cid: text } }">{{
            text
          }}</router-link>
        </span>
        <span slot="status" slot-scope="text, record">
          <!-- <custom-status-select
            size="small"
            v-model="record.status"
            :disabledDeal="$auth('customManage.changestatus')"
            :disabled="!$auth('customManage.changestatus')"
          ></custom-status-select> -->
          <!-- <custom-status-badge :status="text" /> -->
          <div style="display:flex;align-items:center">
            <custom-status-badge :status="text" style="display:inline-block" />
            <a-dropdown
              placement="bottomLeft"
              style="display:inline-block"
              v-if="$auth('customManage.changestatus')"
            >
              <a-icon type="edit" />
              <a-menu
                slot="overlay"
                @click="
                  menu => {
                    statusChange(menu, record);
                  }
                "
              >
                <a-menu-item
                  v-for="s in statusList"
                  :key="s.id"
                  :value="s.id"
                  :disabled="s.name === '已成交' || s.id === record.status"
                >
                  <a-badge
                    :color="s.color"
                    :text="
                      s.name === '已成交' ? `${s.name}/签单自动更新` : s.name
                    "
                  ></a-badge>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
        <span slot="filterOrderList" slot-scope="text, { filterOrderList }">
          <div v-if="filterOrderList.length === 0">暂无订单</div>
          <div v-else>
            <a-dropdown>
              <div>
                <router-link
                  :to="{
                    path: '/orderDetail',
                    query: { oid: filterOrderList[0].oid }
                  }"
                >
                  <ellipsis :length="10" tooltip>{{
                    filterOrderList[0].meal.name
                  }}</ellipsis>
                </router-link>
                <a v-if="filterOrderList.length > 1"
                  >+ {{ filterOrderList.length - 1 }}</a
                >
              </div>
              <a-menu slot="overlay" v-if="filterOrderList.length > 1">
                <a-menu-item v-for="order in filterOrderList" :key="order.oid">
                  <router-link
                    :to="{ path: '/orderDetail', query: { oid: order.oid } }"
                  >
                    <div>{{ order.meal.name }}</div>
                  </router-link>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
        <span slot="remark" slot-scope="text, record">
          <ellipsis :length="8" tooltip>{{ record.remark || "无" }}</ellipsis>
        </span>
        <span slot="followList" slot-scope="text, record">
          <ellipsis :length="8" tooltip>{{
            getNewestRecord(record.followList)
          }}</ellipsis>
        </span>
        <span slot="sellerName" slot-scope="text, record">
          <staff-select
            size="small"
            v-if="record.editing"
            style="width:150px"
            v-model="record.seller"
            detail
            role-name="销售员"
            :disabled-staff="editingCache.seller"
          />
          <div v-else>{{ text }}</div>
        </span>
        <span slot="action" slot-scope="text, record">
          <div v-if="record.editing">
            <a-button
              size="small"
              icon="check"
              @click="transCustom(record)"
              :disabled="!record.seller || record.seller == editingCache.seller"
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
              @click="followCustom(record.cid)"
              :disabled="
                !$auth('customManage.follow') ||
                  Object.keys(editingCache).length > 0
              "
              >跟进</a-button
            >
            <a-button
              size="small"
              @click="openOrderModal(record)"
              :disabled="
                !$auth('customManage.order') ||
                  Object.keys(editingCache).length > 0
              "
              >签单</a-button
            >
            <a-button
              size="small"
              @click="transCustom1(record)"
              :disabled="
                !$auth('customManage.alloc') ||
                  Object.keys(editingCache).length > 0
              "
              >转移</a-button
            >
          </div>
        </span>
      </s-table>
    </a-spin>
    <create-custom ref="createCustom" @ok="queryTable" />
    <create-order ref="createOrder" @ok="queryTable" />
    <sign-order ref="signOrder" @ok="queryTable" />
    <trans-custom ref="transCustom" @ok="transCustom" @cancel="cancelTrans" />
  </a-card>
</template>

<script>
import CreateCustom from "./CreateCustom.vue";
import CreateOrder from "./CreateOrder.vue";
import signOrder from "./signOrder.vue";
import TransCustom from "./TransCustom.vue";
import { getList, updateCustom } from "@/myapi/custom.js";
import { mapState } from "vuex";
export default {
  name: "TableList",
  components: { CreateCustom, CreateOrder, signOrder, TransCustom },
  computed: {
    ...mapState({
      roleList: state => state.appconfig.appRoleList,
      role: state => state.user.role,
      statusList: state => state.appconfig.customStatusList
    })
  },
  created() {
    let preQuery = this.$route.query;
    let toNumber = ["cid", "receptionist", "lastSeller", "seller", "status"];
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
          title: "编号",
          dataIndex: "cid",
          scopedSlots: { customRender: "cid" },
          width: "80px"
        },
        {
          title: "名称",
          dataIndex: "name",
          width: "80px",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "来源",
          dataIndex: "fromZn",
          width: "100px"
        },
        {
          title: "手机",
          dataIndex: "phone",
          width: "150px",
          scopedSlots: { customRender: "phone" }
        },
        {
          title: "微信",
          dataIndex: "wx",
          width: "150px",
          scopedSlots: { customRender: "wx" }
        },
        {
          title: "QQ",
          dataIndex: "qq",
          width: "150px",
          scopedSlots: { customRender: "qq" }
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: "120px",
          scopedSlots: { customRender: "remark" }
        },
        {
          title: "添加时间",
          dataIndex: "receptTime",
          width: "200px",
          scopedSlots: { customRender: "receptTime" }
        },
        {
          title: "状态",
          dataIndex: "status",
          width: "120px",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "成交订单",
          dataIndex: "filterOrderList",
          width: "200px",
          scopedSlots: { customRender: "filterOrderList" }
        },
        {
          title: "跟进记录",
          dataIndex: "followList",
          width: "120px",
          scopedSlots: { customRender: "followList" }
        },
        {
          title: "分配员",
          dataIndex: "receptionistName",
          width: "100px"
        },
        {
          title: "上一销售",
          dataIndex: "lastSellerName",
          scopedSlots: { customRender: "lastSellerName" },
          width: "120px"
        },
        {
          title: "当前销售",
          dataIndex: "sellerName",
          scopedSlots: { customRender: "sellerName" },
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
    async statusChange({ item, key, keyPath }, record) {
      try {
        let result = await updateCustom({
          cids: [record.cid],
          status: key
        });
        this.$notification.success({
          message: "成功",
          description: "客户状态更新成功"
        });
        this.queryTable();
      } catch (error) {
        console.log(error);
      } finally {
        this.editingCache = {};
      }
    },
    openNewModal() {
      this.$refs.createCustom.open();
    },
    openOrderModal(custom) {
      console.log("openOrderModal", custom);
      this.$refs.signOrder.open(custom);
    },
    openTransModal(record) {
      this.editingCache = { ...record };
      this.$refs.transCustom.open(record.sellerName, record.seller);
    },
    cancelTrans(record) {
      for (const key in record) {
        if (record.hasOwnProperty(key)) {
          record[key] = this.editingCache[key];
        }
      }
      this.editingCache = {};
    },
    transCustom1(custom) {
      this.editingCache = { ...custom };
      custom.editing = true;
    },
    getNewestRecord(followList) {
      return Array.isArray(followList) && followList.length > 0
        ? followList[followList.length - 1].comment
        : "无";
    },
    async transCustom(record) {
      try {
        let result = await updateCustom({
          cids: [this.editingCache.cid],
          lastSeller: this.editingCache.seller,
          seller: record.seller
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
      this.$router.push({ path: "/customFollow", query: { cid } });
    },
    queryTable(toFirst = true) {
      this.editingCache = {};
      this.$refs.table.refresh(toFirst);
    },
    resetQueryparam() {
      this.queryParam = {};
      this.queryTable();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    }
  }
};
</script>
