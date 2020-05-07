<template>
    <audio :src="noticeMp3" preload="preload" ref="notice" id="bgMusic"></audio>
</template>

<script>
import io from "socket.io-client";
import noticeMp3 from "@/assets/notice.wav";
import { mapState, mapMutations, mapActions } from "vuex";
import { updateMessage } from "@/myapi/message.js";
export default {
    name: "SocketControl",
    computed: {
        ...mapState({
            userid: state => state.user.userid,
            role: state => state.user.role,
            roleList: state => state.appconfig.appRoleList
        }),
        roleEn() {
            if (this.userid && this.role && this.roleList.length !== 0) {
                return this.roleList.find(r => r.id === this.role).en;
            } else {
                return null;
            }
        }
    },
    data() {
        return {
            noticeMp3,
            systemSocket: null,
            userSocket: null
        };
    },
    watch: {
        roleEn(roleEn) {
            let vthis = this;
            if (roleEn) {
                let userSocket = io("localhost:3000/user", {
                    query: {
                        role: roleEn,
                        userid: this.userid
                    }
                });
                userSocket.on("connect", () => {});
                userSocket.on("message", data => {
                    this.GetMessage();
                    let { type, ...payload } = data;
                    switch (type) {
                        case "allocCustom":
                            payload.onclick = () => {
                                this.$router.push({
                                    replace: true,
                                    path: "/customManage",
                                    query: {
                                        seller: payload.messageBody.to,
                                        cid: payload.id
                                    }
                                });
                            };
                            break;
                        case "newAftersale":
                            payload.onclick = () => {
                                this.$router.push({
                                    replace: true,
                                    path: "/aftersaleManage",
                                    query: {
                                        orderid: payload.id
                                    }
                                });
                            };
                            break;
                        case "newOrder":
                            payload.onclick = () => {
                                this.$router.push({
                                    replace: true,
                                    path: "/orderManage",
                                    query: {
                                        oid: payload.id
                                    }
                                });
                            };
                            break;
                        case "newReceipt":
                            payload.onclick = () => {
                                this.$router.push({
                                    replace: true,
                                    path: "/receiptManage",
                                    query: {
                                        payreceiptid: payload.id
                                    }
                                });
                            };
                            break;
                        case "newContract":
                            payload.onclick = () => {
                                this.$router.push({
                                    replace: true,
                                    path: "/contractManage",
                                    query: {
                                        ctid: payload.id
                                    }
                                });
                            };
                            break;
                    }
                    vthis.openNotice(payload);
                });
                this.userSocket = userSocket;
            }
        }
    },
    mounted() {
        let uuid = Date.now();
        let systemSocket = io("localhost:3000", {
            query: { uuid }
        });
        this.$store.commit("SET_SOCKET_UUID", uuid);
        this.systemSocket = systemSocket;
        let vthis = this;
        systemSocket.on("connect", () => {});
        systemSocket.on("disconnect", () => {});
        systemSocket.on("reconnect", () => {});
        systemSocket.on("reconnect_error", () => {});
        systemSocket.on("reconnect_error", () => {});
        systemSocket.on("message", data => {
            this.GetMessage();
            let { permission, ...payload } = data;
            this.openNotice(payload);
            this.$emit("messagecoming");
        });
    },
    destroyed() {
        this.systemSocket && this.systemSocket.close();
        this.userSocket && this.userSocket.close();
        this.systemSocket = null;
        this.userSocket = null;
    },
    methods: {
        ...mapActions(["GetMessage"]), //获取消息

        openNotice(notifyOptions) {
            let vthis = this;
            if (window.Notification) {
                //浏览器支持系统通知
                if (Notification.permission === "granted") {
                    //并且有权限
                    this.sysNotice(notifyOptions);
                } else {
                    Notification.requestPermission(function(permission) {
                        if (permission === "granted") {
                            vthis.sysNotice(notifyOptions);
                        } else {
                            vthis.vueNotice(notifyOptions);
                        }
                    });
                }
            } else {
                this.vueNotice(notifyOptions);
            }
        },
        vueNotice({
            message = "",
            description = "",
            icon = "",
            onclick = () => {},
            onclose = () => {},
            messageBody = {}
        }) {
            this.$refs.notice.play();
            this.$notification.info({
                message,
                description,
                duration: null, //只可手动关闭
                onClick: async () => {
                    let result = await updateMessage({
                        mids: [messageBody.mid],
                        status: 2 //标记已读
                    });
                    result.status == 200 && this.GetMessage();
                    onclick();
                },
                onClose: onclose,
                placement: "bottomRight",
                icon: <a-avatar src="../static/kdd-favicon.ico" />
                // icon: (
                //     <a-avatar
                //         src={`${icon ? icon : "../static/kdd-favicon.ico"}`}
                //     />
                // )
            });
        },
        sysNotice({
            message = "",
            description = "",
            icon = "",
            onshow = () => {},
            onclick = () => {},
            onerror = () => {},
            onclose = () => {},
            messageBody = {}
        }) {
            let vthis = this;
            var notify = new Notification(message, {
                body: description,
                lang: "zh-CN",
                // icon: icon || "../static/kdd-favicon.ico",
                icon: "../static/kdd-favicon.ico",
                silent: false
            });
            notify.onshow = function() {
                vthis.$refs.notice.play();
                onshow();
            };
            notify.onclick = async () => {
                onclick();
                let result = await updateMessage({
                    mids: [messageBody.mid],
                    status: 2 //标记已读
                });
                result.status == 200 && this.GetMessage();
                notify.close();
            };
            notify.onerror = function() {
                notify.close(); // 手动关闭
                onerror();
            };
            notify.onclose = onclose;
        }
    }
};
</script>
