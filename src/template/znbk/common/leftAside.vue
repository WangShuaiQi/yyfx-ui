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
      <el-menu-item index="布控档案列表">
        <!-- <i class="el-icon-menu"></i> -->
        <span slot="title">布控档案列表</span>
      </el-menu-item>
      <el-menu-item index="已发起的布控">
        <!-- <i class="el-icon-document"></i> -->
        <span slot="title">已发起的布控</span>
      </el-menu-item>
      <el-menu-item index="待审批的布控">
        <!-- <i class="el-icon-setting"></i> -->
        <span slot="title">待审批的</span>
      </el-menu-item>
    </el-menu>
  </section>
</template>
<script>
export default {
  name: "leftAside",
  data() {
    return {
      routeName: "布控档案列表",
      route: [
        "客户添加",
        "出货单打印",
        "产品管理",
        "批号管理",
        "客户查询",
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
