<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="客户编号">
              <a-input v-model="queryParam.cid" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="客户姓名">
              <a-input v-model="queryParam.name" placeholder="" />
            </a-form-item>
          </a-col>

          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="手机号码">
                <a-input v-model="queryParam.phone" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="客户微信">
                <a-input v-model="queryParam.wx"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="客户 Q Q">
                <a-input v-model="queryParam.qq"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属售后">
                <staff-select
                  v-model="queryParam.aftersale"
                  :did="did"
                  :pid="pid"
                ></staff-select>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator" style="margin-bottom:18px">
      <a-button type="primary" @click="$refs.table.refresh(true)"
        >查询</a-button
      >
      <a-button style="margin-left: 8px" @click="resetSearchForm"
        >重置</a-button
      >
    </div>

    <s-table
      ref="table"
      rowKey="cid"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
      :pagination="pagination"
    >
      <a-card slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-timeline>
          <a-timeline-item
            color="green"
            v-for="order in record.orderList"
            :key="order.oid"
          >
            <a-divider style="margin:5px 0px"></a-divider>
            <a-descriptions size="default" :column="6">
              <a-descriptions-item label="套餐">{{
                order.mealInfo.name
              }}</a-descriptions-item>
              <a-descriptions-item label="套餐阶段">
                {{
                  order.mealProcess == 1
                    ? "定金"
                    : order.mealProcess == 2
                    ? "中款"
                    : "尾款"
                }}
              </a-descriptions-item>

              <a-descriptions-item label="付款金额">{{
                order.paymoney
              }}</a-descriptions-item>
              <a-descriptions-item label="付款方式">{{
                order.payway == 1
                  ? "支付宝支付"
                  : order.payway == 2
                  ? "微信支付"
                  : "银行卡"
              }}</a-descriptions-item>

              <a-descriptions-item label="备注" :span="1">
                {{ order.remark }}
              </a-descriptions-item>
              <a-descriptions-item label="付款截图" :span="1">
                <img :src="order.payshot" alt="" height="100px" />
              </a-descriptions-item>
            </a-descriptions>
          </a-timeline-item>
        </a-timeline>
      </a-card>

      <span slot="aftersale" slot-scope="text, record">
        <div v-if="record.editing" style="display:flex;align-items:center">
          <staff-select
            style="flex:1;width:150px"
            :did="did"
            :pid="pid"
            :admin="isadmin"
            onduty
            placeholder="请选择售后人员"
            v-model="record.aftersale"
            size="small"
          />
          <a-button
            @click="updateCustom(record)"
            size="small"
            type="primary"
            :disabled="!record.aftersale"
            >确定</a-button
          >
          <a-button @click="cancelEdit(record)" size="small" type="dashed"
            >取消</a-button
          >
        </div>
        <div v-else>
          <div v-if="record.aftersale_doc[0] && record.aftersale_doc[0].name">
            {{ record.aftersale_doc[0].name }}
            <a-button @click="editCustom(record)" size="small" type="primary"
              >转移</a-button
            >
          </div>
          <a-button
            v-else
            @click="editCustom(record)"
            size="small"
            type="primary"
            >分配售后</a-button
          >
        </div>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import Ellipsis from "@/commonItems/Ellipsis";
import { getOrderedList, deleteCustom, modify } from "@/myapi/custom.js";
import { mapState } from "vuex";
export default {
  name: "TableList",
  components: {
    Ellipsis
  },
  computed: {
    ...mapState({
      did: state => state.user.department,
      pid: state => state.user.post
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
          title: "客户编号",
          dataIndex: "cid",
          width: "100px"
        },
        {
          title: "姓名",
          dataIndex: "name"
        },
        {
          title: "手机",
          dataIndex: "phone"
        },
        {
          title: "微信",
          dataIndex: "wx"
        },
        {
          title: "QQ",
          dataIndex: "qq"
        },
        {
          title: "已签合同(份)",
          dataIndex: "phone"
        },
        {
          title: "最新合同",
          dataIndex: "phone"
        },
        {
          title: "合同套餐",
          dataIndex: "phone"
        },
        {
          title: "套餐阶段",
          dataIndex: "phone"
        },
        {
          title: "分配售后",
          dataIndex: "aftersale",
          width: "200px",
          scopedSlots: { customRender: "aftersale" }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getOrderedList(
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
      }
    };
  },
  methods: {
    resetSearchForm() {
      this.queryParam = {};
      this.$refs.table.refresh(true);
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
