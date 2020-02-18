<template>
  <section>
    <el-menu
      :default-active="routeName"
      class="el-menu-vertical-demo"
      background-color="#2b3541"
      text-color="#fff"
      @select="menuSelected"
    >
      <el-menu-item v-for="(item,index) in  route" :key="index" :index="item">
        <!-- <i class="el-icon-menu"></i> -->
        <span slot="title">{{item}}</span>
      </el-menu-item>
    </el-menu>
  </section>
</template>
<script>
export default {
  name: "leftAside",
  data() {
    return {
      routeName: "客户管理",
      route: [
        "客户管理",
        "出货单打印",
        "产品管理",
        "批号管理",
        "发货单列表"
      ]
    };
  },
  watch: {
    $route(val) {
      this.routeName = val.meta.parents;
    }
  },
  mounted() {
    console.log(this.$route,"111")
    this.routeName = this.$route.meta.parents;
  },
  methods: {
    menuSelected(routeName) {
      this.$router.push({
        name: routeName
      });
    }
  }
};
</script>

<style scoped lang="scss">
.el-menu {
  border-right: none;
  .el-menu-item {
    font-size: 12px !important;
  }
}
</style>
