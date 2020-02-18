<template>
  <el-container id="controlFileList">
    <el-header>
      <el-page-header content="产品管理"></el-page-header>
      <el-form ref="filter" :model="metadata.filter" :inline="true">
        <el-form-item label="产品名称">
          <el-input v-model="metadata.filter.ywy" placeholder="请输入产品名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="生产厂商">
          <el-input v-model="metadata.filter.name" placeholder="请输入生产厂商" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="dialogFlag=true">新增产品</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="tableList" size="mini" @selection-change="tableChange">
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column label="商品" :show-overflow-tooltip="true" prop="name"></el-table-column>
        <el-table-column label="规格" :show-overflow-tooltip="true" prop="dz"></el-table-column>
        <el-table-column label="单位" :show-overflow-tooltip="true" prop="dh"></el-table-column>
        <el-table-column label="生产许可证号" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
        <el-table-column label="注册证号" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
        <el-table-column label="生产厂商" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
        <el-table-column label="库存" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="del(scope.row)">删除</el-button>
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
      <el-dialog :visible.sync="dialogFlag" width="750px" @closed="clientClosed">
        <div slot="title">
          <span class="el-dialog__title">{{dialogTitle}}客户</span>
        </div>
        <el-form
          ref="formObj"
          :model="formObj"
          label-width="140px"
          style="text-align: center;"
          size="mini"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品名称">
                <el-input v-model="formObj.name" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格">
                <el-input v-model="formObj.dh" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位">
                <el-input v-model="formObj.dz" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产许可证号">
                <el-input v-model="formObj.name" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册证号">
                <el-input v-model="formObj.dh" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产厂商">
                <el-input v-model="formObj.dz" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存">
                <el-input v-model="formObj.dz" size="mini"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
import { getZnbkList, delControlFile } from "../../znbk/api/znbkServiceApi";
export default {
  data() {
    return {
      metadata: {
        paginationParam: {
          page: 1,
          pageSize: 10,
          totalCount: 1
        },
        filter: {
          ywy: "",
          name: ""
        }
      },
      formObj: { name: "", dz: "", dh: "", ywy: "" },
      tableList: [{ name: "公司名称", dz: "地址", dh: "电话", ywy: "业务员" }],
      checkTable: [],
      dialogTitle: "新增",
      dialogFlag: false
    };
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    // 获取列表
    async getList(page) {
      let metadata = {};
      metadata.page = page;
      metadata.pageSize = this.metadata.paginationParam.pageSize;
      metadata.status = this.metadata.filter.status;
      metadata.orgId = this.metadata.filter.orgId;
      metadata.bkdxType = this.metadata.filter.bkdxType;
      metadata.bkdxValue = this.metadata.filter.bkdxValue;
      //   let tableList = await getZnbkList(metadata);
      //   this.tableList = tableList.data.data.resultSet;
      //   this.tableList.map(item => {
      //     let dealNameArr = [];
      //     if (item.yjjsmjList) {
      //       item.yjjsmjList.map(items => {
      //         dealNameArr.push(items.name);
      //       });
      //       item.dealName = dealNameArr.join(",");
      //     }
      //   });
      //   this.metadata.paginationParam =
      //     tableList.data.data.metadata.paginationParam;
    },
    // 重置
    reset() {
      this.metadata = {
        paginationParam: {
          page: 1,
          pageSize: 10
        },
        filter: {
          status: "",
          orgId: "",
          bkdxType: "",
          bkdxValue: ""
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
    tableChange(val) {},
    // 删除
    del(row) {
      this.$confirm("是否确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delControlFile(row.oid).then(res => {
          console.log(res);
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
    save() {},
    // 编辑
    edit(row) {
      this.dialogTitle = "编辑";
      this.formObj = row;
      this.dialogFlag = true;
    },
    // 关闭清空
    clientClosed() {
      this.dialogTitle = "新增";
      this.formObj = {};
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


