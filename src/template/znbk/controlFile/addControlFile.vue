<template>
  <div id="addControlFile">
    <el-page-header content="创建布控档案" @back="back"></el-page-header>
    <div class="form">
      <el-form :model="formObj">
        <el-form-item label="布控对象类型" >
          <el-select v-model="formObj.type" size="mini">
            <el-option label="身份证" value="SFZH"></el-option>
            <el-option label="车牌号" value="CPH"></el-option>
            <el-option label="手机号" value="SJH"></el-option>
            <el-option label="mac地址" value="MAC"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="布控对象">
          <el-input type="text" size="mini" v-model="formObj.value"></el-input>
        </el-form-item>
        <el-form-item class="btnBox">
          <el-button size="mini" type="primary" @click="addControlFile">保存</el-button>
          <el-button size="mini" type="primary" plain @click="moveControlFile">补全多维档案</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>  
</template>
<script>
import { addControlFile } from "../../znbk/api/znbkServiceApi";

export default {
  data() {
    return {
      formObj: {
        sfgr: false,
        type: "",
        value: ""
      }
    };
  },
  mounted() {
    this.formObj.type = this.$route.query.type;
    this.formObj.value = this.$route.query.value;
  },
  methods: {
    // 直接布控
    async addControlFile() {
      if (this.formObj.type == "SFZH") {
        this.formObj.sfgr = true;
      }
      let addTrue = await addControlFile(this.formObj);
      if (addTrue == 200) {
        this.$message({
          type: "success",
          message: "添加成功！"
        });
        this.$router.push({
          name: "布控档案列表"
        });
      } else {
        this.$message.error("添加失败！");
      }
    },
    // 返回
    back() {
      this.$router.push({
        name: "布控档案列表"
      });
    },
    // 补全多维档案
    moveControlFile() {
      this.$router.push({
        name: "补全多维档案",
        query: {
          value: this.formObj.value,
          type: this.formObj.type
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#addControlFile {
  .form {
    padding: 30px;
  }
}
</style>
<style lang="scss">
#addControlFile {
  .el-form-item__label {
    width: 100px;
  }
  .el-form-item__content {
    width: 215px;
    display: inline-block;
  }
  .btnBox {
    padding-left: 115px;
    .el-form-item__content {
      width: 100%;
    }
  }
}
</style>



