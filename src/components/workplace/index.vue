<template>
    <div>
        <div class="page-header" style="margin:-23px -16px 0px -15px;">
            <div class="page-header-index-wide">
                <div class="detail">
                    <div class="main">
                        <div class="row">
                            <div class="avatar">
                                <a-avatar :src="$store.state.user.avatar" />
                            </div>
                            <div class="headerContent">
                                <div>
                                    <div class="title">{{ timeFix }}，{{ $store.state.user.name }}<span class="welcome-text">，下班了!</span></div>
                                    <div>前端工程师 | 蚂蚁金服 - 某某某事业群 - VUE平台</div>
                                </div>
                            </div>
                            <div class="extra">
                                <a-row class="more-info">
                                    <a-col :span="8">
                                        <head-info title="项目" content="56" :center="false" :bordered="false" />
                                    </a-col>
                                    <a-col :span="8">
                                        <head-info title="团队排名" content="8/24" :center="false" :bordered="false" />
                                    </a-col>
                                    <a-col :span="8">
                                        <head-info title="项目数" content="2,223" :center="false" />
                                    </a-col>
                                </a-row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <a-card title="待办事项" :bordered="false" style="margin-top:20px">
            <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projects">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                    <a-card-meta>
                        <div slot="title" class="card-title">
                            <a-avatar size="small" :src="item.cover" />
                            <a>{{ item.title }}</a>
                        </div>
                        <div slot="description" class="card-description">
                            {{ item.description }}
                        </div>
                    </a-card-meta>
                    <div class="project-item">
                        <a href="/#/">科学搬砖组</a>
                        <span class="datetime">9小时前</span>
                    </div>
                </a-card>
            </a-card-grid>
        </a-card>

        <a-card style="margin-top: 24px" :bordered="false" title="标准列表">
            <div slot="extra">
                <a-radio-group v-model="status">
                    <a-radio-button value="all">全部</a-radio-button>
                    <a-radio-button value="processing">进行中</a-radio-button>
                    <a-radio-button value="waiting">等待中</a-radio-button>
                </a-radio-group>
                <a-input-search style="margin-left: 16px; width: 272px;" />
            </div>

            <div class="operate">
                <a-button type="dashed" style="width: 100%" icon="plus" @click="$refs.taskForm.add()">添加</a-button>
            </div>

            <a-list size="large" :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: 5,
          total: 50
        }">
                <a-list-item :key="index" v-for="(item, index) in data">
                    <a-list-item-meta :description="item.description">
                        <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar" />
                        <a slot="title">{{ item.title }}</a>
                    </a-list-item-meta>
                    <div slot="actions">
                        <a>编辑</a>
                    </div>
                    <div slot="actions">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item><a>编辑</a></a-menu-item>
                                <a-menu-item><a>删除</a></a-menu-item>
                            </a-menu>
                            <a>更多
                                <a-icon type="down" /></a>
                        </a-dropdown>
                    </div>
                    <div class="list-content">
                        <div class="list-content-item">
                            <span>Owner</span>
                            <p>{{ item.owner }}</p>
                        </div>
                        <div class="list-content-item">
                            <span>开始时间</span>
                            <p>{{ item.startAt }}</p>
                        </div>
                        <div class="list-content-item">
                            <a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 180px" />
                        </div>
                    </div>
                </a-list-item>
            </a-list>

            <task-form ref="taskForm" />
        </a-card>
    </div>
</template>

<script>
import HeadInfo from "./HeadInfo";
import TaskForm from "./TaskForm";
import { timeFix } from "@/commonFunc.js";

const data = [];
data.push({
    title: "Alipay",
    avatar:
        "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
    description: "那是一种内在的东西， 他们到达不了，也无法触及的",
    owner: "付晓晓",
    startAt: "2018-07-26 22:44",
    progress: {
        value: 90
    }
});
data.push({
    title: "Angular",
    avatar:
        "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png",
    description: "希望是一个好东西，也许是最好的，好东西是不会消亡的",
    owner: "曲丽丽",
    startAt: "2018-07-26 22:44",
    progress: {
        value: 54
    }
});
data.push({
    title: "Ant Design",
    avatar:
        "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png",
    description: "生命就像一盒巧克力，结果往往出人意料",
    owner: "林东东",
    startAt: "2018-07-26 22:44",
    progress: {
        value: 66
    }
});
data.push({
    title: "Ant Design Pro",
    avatar:
        "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png",
    description: "城镇中有那么多的酒馆，她却偏偏走进了我的酒馆",
    owner: "周星星",
    startAt: "2018-07-26 22:44",
    progress: {
        value: 30
    }
});
data.push({
    title: "Bootstrap",
    avatar:
        "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png",
    description: "那时候我只会想自己想要什么，从不想自己拥有什么",
    owner: "吴加好",
    startAt: "2018-07-26 22:44",
    progress: {
        status: "exception",
        value: 100
    }
});

export default {
    name: "StandardList",
    components: {
        HeadInfo,
        TaskForm
    },
    data() {
        return {
            data,
            timeFix: timeFix(),
            status: "all"
        };
    },
    methods: {
        loadError(err) {
            console.log("loadError", err);
        }
    }
};
</script>

<style lang="less" scoped>
.ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
}

.list-content-item {
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
        line-height: 20px;
    }
    p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
    }
}
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
                min-width: 242px;
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
