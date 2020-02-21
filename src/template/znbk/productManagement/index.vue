<template>
  <el-container id="controlFileList">
    <el-header>
      <el-page-header content="产品管理"></el-page-header>
      <el-form ref="filter" :model="metadata.filter" :inline="true">
        <el-form-item label="产品名称">
          <el-input v-model="metadata.filter.productName" placeholder="请输入产品名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="生产厂商">
          <el-input v-model="metadata.filter.manufacturer" placeholder="请输入生产厂商" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="dialogFlag=true">新增产品</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="tableList" size="mini" @selection-change="tableChange">
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column label="商品" :show-overflow-tooltip="true" prop="productName"></el-table-column>
        <el-table-column label="规格" :show-overflow-tooltip="true" prop="standard"></el-table-column>
        <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit"></el-table-column>
        <el-table-column label="生产许可证号" :show-overflow-tooltip="true" prop="produceLicence"></el-table-column>
        <el-table-column label="注册证号" :show-overflow-tooltip="true" prop="reginLicence"></el-table-column>
        <el-table-column label="生产厂商" :show-overflow-tooltip="true" prop="manufacturer"></el-table-column>
        <el-table-column label="库存" :show-overflow-tooltip="true" prop="storeCount"></el-table-column>
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
          <span class="el-dialog__title">{{dialogTitle}}产品</span>
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
                <el-input v-model="formObj.productName" size="mini" placeholder="请输入商品名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格">
                <el-input v-model="formObj.standard" size="mini" placeholder="请输入规格"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位">
                <el-input v-model="formObj.unit" size="mini" placeholder="请输入单位"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产许可证号">
                <el-input v-model="formObj.produceLicence " size="mini"  placeholder="请输入生产许可证号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册证号">
                <el-input v-model="formObj.reginLicence " size="mini"  placeholder="请输入注册证号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产厂商">
                <el-input v-model="formObj.manufacturer" size="mini"  placeholder="请输入生产厂商"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存">
                <el-input v-model="formObj.storeCount" size="mini" type="number" placeholder="请输入数字类型"></el-input>
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
import {
  productCreate,
  productList,
  productEdit,
  productDelete
} from "../../znbk/api/znbkServiceApi";
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
          productName: "",
          manufacturer: ""
        }
      },
      formObj: {
        manufacturer: "",
        produceLicence: "",
        productName: "",
        reginLicence: "",
        standard: "",
        storeCount: "",
        unit: ""
      },
      tableList: [],
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
      metadata.page = 1;
      metadata.pageSize = 10;
      metadata.productName = this.metadata.filter.productName;
      metadata.manufacturer = this.metadata.filter.manufacturer;

      let tableList = await productList(metadata);
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
          productName: "",
          manufacturer: ""
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
          this.$message.warning("至少选择一个商品");
        } else {
          let formObj = {};
          let ids = [];
          this.checkTable.map(item => {
            ids.push(item.id);
          });
          formObj.ids = ids.join(",");

          productDelete(formObj).then(res => {
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
        productDelete(formObj).then(res => {
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
      if (this.formObj.id) {
        let status = await productEdit(this.formObj);
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
      } else {
        let status = await productCreate(this.formObj);
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


