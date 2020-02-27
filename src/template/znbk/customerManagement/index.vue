<template>
  <el-container id="controlFileList">
    <el-header>
      <el-page-header content="客户管理"></el-page-header>
      <el-form ref="filter" :model="metadata.filter" :inline="true">
        <el-form-item label="业务员" v-if="user.isAdmin">
          <el-input v-model="metadata.filter.createrName" placeholder="请输入业务员行姓名" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="metadata.filter.customerName" placeholder="请输入公司名称" size="mini"></el-input>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" size="mini" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="dialogFlag=true">新增客户</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="delAll" v-if="user.isAdmin">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="download">导出客户信息</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="tableList" size="mini" @selection-change="tableChange">
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column label="公司名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
        <el-table-column label="地址" :show-overflow-tooltip="true" prop="address"></el-table-column>
        <el-table-column label="电话" :show-overflow-tooltip="true" prop="tel"></el-table-column>
        <el-table-column label="业务员" v-if="true" :show-overflow-tooltip="true" prop="creator"></el-table-column>
        <el-table-column label="操作" v-if="true">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="del(scope.row)" v-if="user.isAdmin">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
        :current-page="metadata.paginationParam.page"
        :page-size="metadata.paginationParam.pageSize"
        :total="metadata.paginationParam.totalCount"
        @current-change="currentChange"
        layout="total,prev,pager,next,jumper"
      ></el-pagination>
      <el-dialog :visible.sync="dialogFlag" width="450px" @closed="clientClosed">
        <div slot="title">
          <span class="el-dialog__title">{{dialogTitle}}客户</span>
        </div>
        <el-form
          ref="formObj"
          :model="formObj"
          label-width="100px"
          :inline="true"
          style="text-align: center;"
        >
          <el-form-item label="公司名称">
            <el-input v-model="formObj.name" size="mini" placeholder="请输入公司名称" ></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="formObj.tel" size="mini" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="formObj.address" size="mini"  placeholder="请输入地址"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save" size="mini">确认</el-button>
          <el-button @click="dialogFlag=false" size="mini">取消</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import moment from "moment";
import {
  getuser,
  customerList,
  customerCreate,
  customerDelete
} from "../../znbk/api/znbkServiceApi";
export default {
  data() {
    return {
      metadata: {
        paginationParam: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        filter: {
          customerName: "", //客户名字
          createrName: "" //创建者名字
        }
      },
      formObj: { name: "", address: "", tel: "" },
      tableList: [],
      checkTable: [],
      dialogTitle: "新增",
      dialogFlag: false,
      user: {}
    };
  },
  mounted() {
    this.getList(1);
    this.getuser();
  },
  methods: {
    // 获取登录用户
    async getuser() {
      this.user = await getuser();
    },
    // 获取列表
    async getList(page) {
      let metadata = {};
      metadata.page = 1;
      metadata.pageSize = 10;
      metadata.customerName = this.metadata.filter.customerName;
      metadata.createrName = this.metadata.filter.createrName;

      let tableList = await customerList(metadata);
      this.tableList = tableList.list;
      this.metadata.paginationParam.totalCount = tableList.total;
    },
    // 重置
    reset() {
      this.metadata = {
        paginationParam: {
          page: 1,
          pageSize: 10
        },
        filter: {
          customerName: "",
          createrName: ""
        }
      };
      this.getList(1);
    },
    // 搜索
    search() {
      this.getList(1);
    },
    // 分页
    currentChange(value) {
      this.getList(value);
    },
    tableChange(val) {
      this.checkTable = val;
    },
    // 批量删除
    delAll() {
      this.$confirm("是否确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.checkTable.length == 0) {
          this.$message.warning("至少选择一个客户");
        } else {
          let formObj = {};
          let ids = [];
          this.checkTable.map(item => {
            ids.push(item.id);
          });
          formObj.ids = ids.join(",");

          customerDelete(formObj).then(res => {
            if (res == 200) {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.reset();
            } else {
              this.$message.error("删除失败！");
            }
          });
        }
      });
    },
    // 删除
    del(row) {
      this.$confirm("是否确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let formObj = {
          ids: row.id
        };
        customerDelete(formObj).then(res => {
          if (res == 200) {
            this.$message({
              type: "success",
              message: "删除成功！"
            });
            this.reset();
          } else {
            this.$message.error("删除失败！");
          }
        });
      });
    },
    // 保存
    async save() {
      let status = await customerCreate(this.formObj);
      if (status == 200) {
        this.$message({
          type: "success",
          message: "保存成功！"
        });
        this.dialogFlag = false;
        this.reset();
      } else {
        this.$message.error("保存失败！");
      }
    },
    // 编辑
    edit(row) {
      this.dialogTitle = "编辑";
      this.formObj = JSON.parse(JSON.stringify(row));
      this.dialogFlag = true;
    },
    // 关闭清空
    clientClosed() {
      this.dialogTitle = "新增";
      this.formObj = {};
    },
    // 下载
    download(){
      window.open('/apis/v1/customer/downloadFile/?token='+sessionStorage.getItem('token'));

    }
  },
  filters: {
    sfgr(v) {
      if (v) {
        return "是";
      } else {
        return "否";
      }
    },
    bkdxType(v) {
      if (v == "SFZH") {
        return "身份证";
      } else if (v == "CPH") {
        return "车牌号";
      } else if (v == "SJH") {
        return "手机号";
      } else if (v == "MAC") {
        return "mac地址";
      }
    },
    getSelectOption(v, selectOption, type, values) {
      let value = "";
      selectOption.map(item => {
        if (v == item[type]) {
          value = item[values];
        }
      });
      return value;
    },
    formatTime(v) {
      if (v) {
        let time = "";
        time = moment(v).format("YYYY-MM-DD");
        return time;
      } else {
        return "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#controlFileList {
  height: 100%;
  .el-header {
    height: 100px !important;
    .el-page-header {
      margin-bottom: 15px;
    }
  }
}
</style>
<style lang="scss">
#controlFileList {
  .el-page-header__left {
    display: none;
  }
  .el-dialog__header {
    background: #409eff;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__close {
      color: #fff !important;
    }
  }
}
</style>


