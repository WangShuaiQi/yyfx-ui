<template>
  <router-view v-loading.fullscreen.lock="isShowLoading" />
</template>
<style lang="scss">
@import "./assets/style/scss/common";
</style>
<script>
import { mapState } from "vuex";
import gwm from "gwm";
import { getUserIP } from "./utils/tools";
import moment from "moment";
export default {
  name: "App",
  computed: {
    ...mapState(["isShowLoading"])
  },
  mounted() {
    // this.initTopPrint();
  },
  methods: {
    // async initTopPrint() {
    //   //添加水印加载
    //   let time = moment().format("YYYY-MM-DD HH:mm:ss");
    //   let user = JSON.parse(sessionStorage.getItem("user"));
    //   let localIP = await getUserIP();
    //   if (user) {
    //     let userStr =
    //       user.name + " " + user.policeid + "<br>" + time + "<br>" + localIP;
    //     gwm.creation({
    //       txt: "甘孜智能联合作战平台<br>" + userStr,
    //       width: 240,
    //       height: 150,
    //       x: 10,
    //       y: 50,
    //       alpha: 0.12,
    //       fontSize: 18,
    //       color: "#000000",
    //       mode: "element",
    //       css: {
    //         "font-size": "18px",
    //         position: "fixed",
    //         top: 0,
    //         left: 0,
    //         "font-weight": "600",
    //         width: "100%",
    //         height: "100%",
    //         "text-shadow": "2px 2px 0px #FFFFFF"
    //       },
    //       container: document.body
    //     });
    //   }
    // }
  }
};
</script>
