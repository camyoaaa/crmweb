<template>
  <div class="page-header">
    <div class="page-header-index-wide">
      <div class="detail">
        <div class="main">
          <div class="row">
            <div class="avatar">
              <a-avatar :src="$store.state.user.avatar" />
            </div>
            <div class="headerContent">
              <div>
                <div class="title">
                  {{ timeFix }}，{{ $store.state.user.name
                  }}<span class="welcome-text">，感谢您的辛勤付出!</span>
                </div>
                <div>
                  {{ $store.state.user.account }} | {{ organization.postZn }} |
                  {{ organization.departmentZn }} | 客多达教育咨询有限公司
                </div>
              </div>
            </div>
            <div class="extra" v-if="true">
              <a-row class="more-info">
                <a-col :span="5">
                  <head-info
                    title="公司成员"
                    :content="headerData.componyMembers"
                    :bordered="true"
                  />
                </a-col>
                <a-col :span="5">
                  <head-info
                    title="今天客户"
                    :content="headerData.todayCustoms"
                    :bordered="true"
                  />
                </a-col>
                <a-col :span="5">
                  <head-info
                    title="今日签单"
                    :content="headerData.todayDealOrders"
                    :bordered="true"
                  />
                </a-col>
                <a-col :span="5">
                  <head-info
                    title="今天跟户"
                    :content="headerData.todayFollowCustoms"
                    :bordered="true"
                  />
                </a-col>
                <a-col :span="4">
                  <head-info
                    title="今日跟单"
                    :content="headerData.todayFollowOrders"
                  />
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFix } from "@/commonFunc.js";
import { getHeadData, getOrganization } from "@/myapi/dashboard.js";
export default {
  data() {
    return {
      timeFix: timeFix(),
      headerData: {}, //头部统计信息
      organization: {} //组织信息
    };
  },
  created() {
    this.getHeadData();
    this.getOrganization();
  },
  methods: {
    async getHeadData() {
      try {
        let result = await getHeadData();
        if (result.status == 200) {
          this.headerData = result.data;
        }
      } catch (error) {}
    },
    async getOrganization() {
      try {
        let result = await getOrganization(this.$store.state.user.account);
        this.organization = result.organization;
      } catch (error) {}
    }
  }
};
</script>

<style lang="less" scoped>
.page-header {
  background: #fff;
  padding: 16px 32px 0;
  padding-bottom: 15px;
  // border-bottom: 1px solid #e8e8e8;
  box-shadow: 0px 1px 4px rgba(0, 21, 41, 0.08);
  .breadcrumb {
    margin-bottom: 16px;
  }

  .detail {
    display: flex;
    // margin-bottom: 16px;

    .avatar {
      flex: 0 1 80px;
      margin: 0 24px 8px 0;

      & > span {
        border-radius: 80px;
        display: block;
        width: 80px;
        height: 80px;
      }
    }

    .main {
      width: 100%;
      flex: 0 1 auto;

      .row {
        display: flex;
        width: 100%;

        .avatar {
          // margin-bottom: 16px;
        }
      }
      .title {
        font-size: 24px;
        font-weight: 500;
        font-size: 24px;
        line-height: 28px;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 15px;
        margin-top: 10px;
        flex: auto;
      }
      .logo {
        width: 28px;
        height: 28px;
        border-radius: 4px;
        margin-right: 16px;
      }
      .content,
      .headerContent {
        flex: auto;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;

        .link {
          margin-top: 16px;
          line-height: 24px;

          a {
            font-size: 14px;
            margin-right: 32px;
          }
        }
      }
      .extra {
        flex: 0 1 auto;
        margin-left: 88px;
        margin-top: 10px;
        // min-width: 242px;
        text-align: right;
      }
      .action {
        margin-left: 56px;
        min-width: 266px;
        flex: 0 1 auto;
        text-align: right;
        &:empty {
          display: none;
        }
      }
    }
  }
}

.mobile .page-header {
  .main {
    .row {
      flex-wrap: wrap;

      .avatar {
        flex: 0 1 25%;
        margin: 0 2% 8px 0;
      }

      .content,
      .headerContent {
        flex: 0 1 70%;

        .link {
          margin-top: 16px;
          line-height: 24px;

          a {
            font-size: 14px;
            margin-right: 10px;
          }
        }
      }

      .extra {
        flex: 1 1 auto;
        margin-left: 0;
        min-width: 0;
        text-align: right;
      }

      .action {
        margin-left: unset;
        min-width: 266px;
        flex: 0 1 auto;
        text-align: left;
        margin-bottom: 12px;

        &:empty {
          display: none;
        }
      }
    }
  }
}
</style>
