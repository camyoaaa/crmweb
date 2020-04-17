<template>
  <audio :src="noticeMp3" preload="preload" ref="notice" id="bgMusic"></audio>
</template>

<script>
import io from "socket.io-client";
import noticeMp3 from "@/assets/notice.mp3";
export default {
  name: "SocketControl",
  data() {
    return {
      websock: null,
      salesManager: null,
      text: "xxxxxxxxxxxxxxxxxxxxx",
      noticeMp3
    };
  },
  mounted() {
    let salesManager = io("localhost:3000/salesManager");
    this.salesManager = salesManager;
    let Vmcontext = this;
    salesManager.on("connect", () => {
      console.log("salesManager connect");
      Vmcontext.isSupportNotify();
    });
    salesManager.on("connect_error", function(error) {
      console.log("connect_error", error);
    });
    salesManager.on("error", function(error) {
      console.log("error", error);
    });
    salesManager.on("disconnect", function(error) {
      console.log("disconnect", error);
    });
    salesManager.on("test", function(data) {
      this.isSupportNotify();
    });
  },
  destroyed() {
    // this.websock = null;
    this.salesManager.close();
    this.salesManager = null;
  },
  methods: {
    isSupportNotify() {
      if (window.Notification) {
        // 支持
        // console.log("支持"+"Web Notifications API");
        this.isAllowNotify();
      } else {
        // 不支持
        console.log("不支持" + "Web Notifications API");
      }
    },
    //通知功能 有骚扰用户的嫌疑，让用户根据自己喜好选择是否开启通知权限
    isAllowNotify() {
      var _this = this;
      if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
          if (status === "granted") {
            _this.setNotification();
          } else {
            var n = new Notification(
              "拒绝通知就看不到精彩资讯了哦！如要接受请在设置中选择允许接收通知。"
            );
          }
        });
      }
    },
    //编辑通知内容并加上各个点击事件等  后期控制点击通知跳转到文章
    setNotification() {
      var notify = new Notification("金牛数据，我们快人一步！", {
        body: "这是我的测试通知，等接口好了以后再控制显示新消息",
        lang: "zh-CN",
        icon: "./assets/logo.png"
      });
      let Vmcontext = this;
      notify.onshow = function() {
        console.log("Notification showning!");
        // Vmcontext.$refs.notice.addEventListener("canplay", () => {
        //   Vmcontext.$refs.notice.play();
        // });
        Vmcontext.$refs.notice.play();
      };
      notify.onclick = function() {
        console.log("Notification have be click!");
      };
      notify.onerror = function() {
        console.log("error!");
        // 手动关闭
        notify.close();
      };
      notify.onclose = function() {
        console.log("close");
      };
    }
  }
};
</script>
