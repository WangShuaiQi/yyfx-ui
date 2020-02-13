<template>
  <div class="app">
    <el-container class="appBox">
      <el-header>
        <top-header></top-header>
      </el-header>
      <el-container>
          <el-aside width="200px">
            <leftAside></leftAside>
          </el-aside>
          <el-main class="main">
            <router-view/>
          </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TopHeader from "../znbk/common/TopHeader";
import leftAside from "../znbk/common/leftAside";
export default {
  name: "LayoutZnbk",
  components: { TopHeader, leftAside }
};
</script>
<style lang="scss" scoped>
.app {
  height: 100%;
  width: 100%;
  .el-container {
    height: 100%;
    width: 100%;
  }
  .el-header {
    padding-left: 0px;
  }
  .el-container > .el-main {
    padding: 15px 5px;
  }
  .el-aside {
    background: #2b3541;
  }
  .app-header {
    height: 60px;
    width: 100%;
  }
  .el-main {
    height: calc(100% - 30px);
    width: 100%;
  }
  .el-aside {
    width: 12.5rem !important;
  }
}
.appBox > .el-header {
  height: 4rem !important;
  padding-right: 0px;
}
</style>
 <style lang="scss">
//设置公共
$path-public-asserts: "../../assets";
//引入wxj统一样式
@import "../znbk/assets/style/common";
 </style>
