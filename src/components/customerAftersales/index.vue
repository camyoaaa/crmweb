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
              <a-form-item label=" 关    键   词 ">
                <a-input v-model="queryParam.keywords"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="客户状态">
                <custom-status-select v-model="queryParam.status"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="
                (advanced && { float: 'right', overflow: 'hidden' }) || {}
              "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)"
                >查询</a-button
              >
              <a-button
                style="margin-left: 8px"
                @click="() => (queryParam = {})"
                >重置</a-button
              >
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? "收起" : "展开" }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator" style="margin-bottom:18px">
      <!-- <a-button type="primary" icon="plus" @click="$refs.createModal.add()"
        >新增客户</a-button
      > -->
      <a-button type="dashed" @click="tableOption"
        >{{ (optionAlertShow && "关闭") || "开启" }} alert</a-button
      >
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"> <a-icon type="delete" />删除</a-menu-item>
          <a-menu-item key="2"> <a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="cid"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
      :pagination="pagination"
    >
      <span slot="name" slot-scope="text, record">
        <div v-if="!record.editing">{{ text }}</div>
        <a-input
          v-else
          :value="record.name"
          @change="
            e => {
              record.name = e.target.value;
            }
          "
        ></a-input>
      </span>
      <span slot="phone" slot-scope="text, record">
        <div v-if="!record.editing">{{ text }}</div>
        <a-input
          v-else
          :value="record.phone"
          @change="
            e => {
              record.phone = e.target.value;
            }
          "
        ></a-input>
      </span>
      <span slot="wx" slot-scope="text, record">
        <div v-if="!record.editing">{{ text }}</div>
        <a-input
          v-else
          :value="record.wx"
          @change="
            e => {
              record.wx = e.target.value;
            }
          "
        ></a-input>
      </span>
      <span slot="qq" slot-scope="text, record">
        <div v-if="!record.editing">{{ text }}</div>
        <a-input
          v-else
          :value="record.qq"
          @change="
            e => {
              record.qq = e.target.value;
            }
          "
        ></a-input>
      </span>
      <span slot="allocTime" slot-scope="text, record">
        <div v-if="!record.editing">{{ text | dateformat }}</div>
        <a-input
          v-else
          :value="record.keywords"
          @change="
            e => {
              record.keywords = e.target.value;
            }
          "
        ></a-input>
      </span>
      <span slot="receptionistremark" slot-scope="text, record">
        <div v-if="!record.editing">{{ text }}</div>
        <a-input
          v-else
          :value="record.receptionistremark"
          @change="
            e => {
              record.receptionistremark = e.target.value;
            }
          "
        ></a-input>
      </span>
      <span slot="status" slot-scope="text, record">
        <a-tag :color="record.statusColor">{{ record.statusZn }}</a-tag>
      </span>
      <span slot="followList" slot-scope="text, record">
        {{
          Array.isArray(record.followList) && record.followList > 0
            ? record.followList[0].comment
            : ""
        }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a-button size="small" type="primary" @click="followCustom(record)"
          >跟进</a-button
        >
        <a-button
          v-if="record.statusZn == '已成交'"
          size="small"
          type="primary"
          @click="$refs.enteryeji.open(record)"
          >业绩录入</a-button
        >
      </span>
    </s-table>
  </a-card>
</template>

<script>
import Ellipsis from "@/commonItems/Ellipsis";
import {
  getList,
  getAftersaleList,
  deleteCustom,
  modify
} from "@/myapi/custom.js";
import { mapState } from "vuex";

export default {
  name: "TableList",
  components: {
    Ellipsis
  },
  computed: {
    ...mapState({
      aftersale: state => state.user.account
    })
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        status: {
          sid: "",
          name: ""
        }
      },
      fuzzies: ["name", "phone", "wx", "keywords"],
      // 表头
      columns: [
        {
          title: "客户编号",
          dataIndex: "cid",
          width: "100px"
        },
        {
          title: "名称",
          dataIndex: "name",

          scopedSlots: { customRender: "name" }
        },
        {
          title: "店铺PC地址",
          dataIndex: "pcshopName"
        },
        {
          title: "店铺手机地址",
          dataIndex: "mbshopName",
          scopedSlots: { customRender: "mbshopName" }
        },
        {
          title: "教学阶段",
          dataIndex: "teachStep",
          scopedSlots: { customRender: "teachStep" }
        },
        {
          title: "活动次数",
          dataIndex: "activityStep",
          scopedSlots: { customRender: "activityStep" }
        },
        {
          title: "活动状态",
          dataIndex: "activityStatus"
        },
        {
          title: "备注",
          dataIndex: "remark",
          scopedSlots: { customRender: "remark" }
        },
        {
          title: "分配时间",
          dataIndex: "allocTime",
          scopedSlots: { customRender: "allocTime" }
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "跟进记录",
          dataIndex: "followList",
          scopedSlots: { customRender: "followList" }
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
        console.log("loadData.parameter", parameter);
        let { status, ...otherQueryParam } = this.queryParam;
        if (status.sid) {
          otherQueryParam.status = status.sid;
        }
        return getAftersaleList(
          Object.assign(parameter, otherQueryParam, {
            aftersale: this.aftersale,
            fuzzies: this.fuzzies
          })
        ).then(res => {
          res.result.data = res.result.data.map(x => ({
            ...x,
            editing: false,
            wx: x.wx || "",
            qq: x.qq || "",
            phone: x.phone || "",
            keywords: x.keywords || "",
            receptionistremark: x.receptionistremark || ""
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
      optionAlertShow: false,
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条数据`
      }
    };
  },
  created() {
    this.tableOption();
  },
  methods: {
    followCustom(record) {
      this.$router.push({
        path: "/orderFollow",
        query: { cid: record.cid, name: record.name }
      });
    },
    async updateStaff(record) {
      record.editing = false;
      try {
        let modifySuccess = await modify(record);
        this.$notification.success({
          $message: "成功",
          description: "客户更新成功"
        });
      } catch (error) {}
    },
    async deleteCustom(record) {
      try {
        let deleteSuccess = await deleteCustom({
          cid: record.cid
        });
        this.$notification.success({
          $message: "成功",
          description: "客户删除成功"
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetSearchForm() {
      this.queryParam = {
        date: this.$moment(new Date())
      };
    }
  }
};
</script>
