<template>
    <a-card title="跟进记录">
        <a-comment v-if="replyable">
            <a-avatar slot="avatar" :src="userAvatar" />
            <div slot="content">
                <a-form-item>
                    <a-textarea :rows="4" v-model="followRecord" :placeholder="placeholder"></a-textarea>
                </a-form-item>
                <a-form-item>
                    <a-button htmlType="submit" icon="edit" size="large" type="primary" block :loading="submitting" @click="handleSubmit">
                        提交
                    </a-button>
                </a-form-item>
            </div>
        </a-comment>
        <a-list :dataSource="followList" size="small" :header="followList.length > 0 ?`${followList.length}条跟踪记录`:''" itemLayout="horizontal">
            <a-list-item slot="renderItem" slot-scope="item, index">
                <a-comment :avatar="item.recordUser.avatar" :content="item.comment" :datetime="$moment(item.createTime).fromNow()">
                    <span slot="author">{{ item.recordUser.name }}
                        <a-tag v-if="item.recordUser.departmentpostZn">{{
              item.recordUser.departmentpostZn
            }}</a-tag>
                    </span>
                </a-comment>
            </a-list-item>
        </a-list>
    </a-card>
</template>

<script>
import { getList, add } from "@/myapi/followRecord.js";
import { mapState } from "vuex";
export default {
    name: "FollowRecord",
    props: {
        cid: Number,
        oid: Number,
        placeholder: {
            type: String,
            default: `请按 更新"信息字段":"原值"=>"新值" 的格式填写跟进记录,例如:更新 客户状态:新客户=>微信通过;更新手机:18428369147=>18428369146`
        },
        replyable: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapState({
            userAvatar: state => state.user.avatar,
            userAccount: state => state.user.account,
            userName: state => state.user.name,
            departmentpostZn: state => state.user.departmentpostZn
        })
    },
    data() {
        return {
            followRecord: "",
            followList: [],
            submitting: false
        };
    },
    created() {
        this.getList();
    },
    watch: {
        cid() {
            this.getList();
        }
    },
    methods: {
        async getList(cid = this.cid, oid = this.oid) {
            try {
                let result = await getList({
                    cid,
                    oid,
                    pageSize: 500,
                    pageNo: 1
                });
                this.followList = result.result.data;
            } catch (error) {}
        },
        async handleSubmit() {
            if (!this.followRecord) {
                this.$notification.error({
                    message: "请填写跟进记录",
                    description: "没有跟进记录不能更新用户信息"
                });
                return;
            }
            try {
                this.submitting = true;
                this.$emit("submit");
                let result = await add({
                    cid: this.cid,
                    oid: this.oid,
                    uid: this.userAccount,
                    comment: this.followRecord
                });
                if (result.status == 200) {
                    this.getList();
                    this.$notification.success({
                        message: "更新成功",
                        description: `更新内容:${this.followRecord}`
                    });
                } else {
                    throw new Error("更新失败");
                }
            } catch (error) {
                this.$notification.error({
                    message: "更新失败",
                    description: `请检查网络,或者重试`
                });
            } finally {
                this.submitting = false;
            }
        }
    }
};
</script>

<style lang="less" scoped></style>
