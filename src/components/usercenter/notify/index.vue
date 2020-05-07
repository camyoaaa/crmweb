<template>
    <a-row :gutter="20">
        <a-col :span="24">
            <a-card>
                <div slot="title">
                    <a-radio-group v-model="status" buttonStyle="solid">
                        <a-radio-button value="">全部{{notify.messageList.length}}</a-radio-button>
                        <a-radio-button :value="1">未读{{notify.unreadList.length}}</a-radio-button>
                        <a-radio-button :value="2">已读{{notify.readList.length}}</a-radio-button>
                    </a-radio-group>
                    <a-button v-if="isRole('管理员')" @click="addingMessage = !addingMessage">{{addingMessage?'取消发布':'发布系统通知'}}</a-button>
                </div>
                <div slot="extra">
                    <a-button icon="reload" @click="GetMessage">刷新</a-button>
                    <a-button icon="check" @click="markReaded(notify.messageList.map(m=>m.mid))">全部已读</a-button>
                    <a-button icon="delete" @click="deleteMessage(notify.messageList.map(m=>m.mid))">清空</a-button>
                </div>

                <a-comment v-if="addingMessage">
                    <a-avatar slot="avatar" :src="user.avatar" />
                    <div slot="content">
                        <a-form-item>
                            <a-textarea :rows="4" v-model="message" placeholder="通知内容"></a-textarea>
                        </a-form-item>
                        <a-form-item>
                            <a-button :disabled="!message" htmlType="submit" icon="thunderbolt" size="large" type="primary" block @click="addMessage">
                                发布
                            </a-button>
                        </a-form-item>
                    </div>
                </a-comment>
                <a-list size="small" :pagination="pagination" :dataSource="matchList">
                    <a-list-item slot="renderItem" slot-scope="item, index" key="item.title" style="cursor:pointer" @click="item.status === 1 && markReaded([item.mid])">
                        <a-button v-if="item.status === 1" type="link" slot="actions" size="small" icon="check-circle" @click="markReaded([item.mid])">已读</a-button>
                        <a-button slot="actions" type="link" size="small" icon="close-circle" @click="deleteMessage([item.mid])">删除</a-button>
                        <!-- <span slot="extra">{{item.time | dateformat}}</span> -->
                        <a-list-item-meta :description="item.message">
                            <span slot="title" :href="item.href">{{ item.fromInfo.name }}
                                <em style="margin-left:10px"> {{$moment(item.time).fromNow()}}</em>
                            </span>
                            <a-badge v-if="item.status === 1" slot="avatar" status="success">
                                <a-avatar :src="item.fromInfo.avatar" />
                            </a-badge>
                            <a-avatar v-else slot="avatar" :src="item.fromInfo.avatar" />
                        </a-list-item-meta>
                    </a-list-item>
                </a-list>
            </a-card>
        </a-col>
    </a-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
    getList,
    deleteMessage,
    updateMessage,
    addMessage
} from "@/myapi/message.js";
export default {
    data() {
        return {
            addingMessage: false,
            message: "",
            status: "",
            pagination: {
                onChange: page => {
                    console.log(page);
                },
                pageSize: 10,
                size: "medium"
            }
        };
    },
    computed: {
        ...mapState({
            user: state => state.user,
            roleList: state => state.appconfig.appRoleList,
            notify: state => state.notify
        }),
        matchList() {
            if (this.status === 1) {
                return this.notify.unreadList;
            } else if (this.status === 2) {
                return this.notify.readList;
            } else {
                return this.notify.messageList;
            }
        }
    },
    methods: {
        ...mapActions(["GetMessage"]),
        isRole(roleName) {
            //判断角色
            return (
                this.roleList.find(r => r.id === this.user.role).name ===
                roleName
            );
        },
        async markReaded(mids) {
            try {
                let result = await updateMessage({
                    mids,
                    status: 2
                });
                result.status == 200 && this.GetMessage();
            } catch (error) {}
        },
        async deleteMessage(mids) {
            try {
                let result = await deleteMessage({
                    mids
                });
                result.status == 200 && this.GetMessage();
            } catch (error) {}
        },
        async addMessage() {
            try {
                let result = await addMessage({
                    from: this.user.account,
                    message: this.message,
                    to: 0 //系统通知所有人
                });
                if (result.status === 200) {
                    this.$notification.success({
                        message: "成功",
                        description: "系统消息发布成功"
                    });
                    this.GetMessage();
                    this.addingMessage = false;
                }
            } catch (error) {}
        }
    }
};
</script>

<style lang="less" scoped></style>
