<template>
  <el-container id="controlFileList">
    <el-header>
      <el-page-header content="出货单列表"></el-page-header>
      <el-form ref="filter" :model="metadata.filter" :inline="true" size="mini">
        <el-form-item label="购买公司">
          <el-input v-model="metadata.filter.company" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="metadata.filter.productName" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="发货人"  v-if="user.isAdmin">
          <el-input v-model="metadata.filter.shipper" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="起止时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="metadata.filter.startTime"
              style="width: 100%;"
              value-format="timestamp"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="metadata.filter.endtTime"
              style="width: 100%;"
              value-format="timestamp"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="add">出货单打印</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="tableList" size="mini">
        <el-table-column label="购货单位" :show-overflow-tooltip="true" prop="purchasingUnit"></el-table-column>
        <el-table-column label="购货时间" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{scope.row.createTime|formatTime}}</template>
        </el-table-column>
        <el-table-column label="购货金额" :show-overflow-tooltip="true" prop="moneyReceived"></el-table-column>
        <el-table-column label="发货人" :show-overflow-tooltip="true" prop="shipper"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="view(scope.row)">查看</el-button>
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
    </el-main>
  </el-container>
</template>
<script>
import moment from "moment";
import {
  invoiceList,
  invoiceDelete,
  getuser
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
          startTime: "",
          endtTime: "",
          company: "",
          productName: "",
          shipper: ""
        }
      },
      tableList: [],
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
      metadata.page = page;
      metadata.pageSize = this.metadata.paginationParam.pageSize;
      metadata.startTime = this.metadata.filter.startTime;
      metadata.endtTime = this.metadata.filter.endtTime;
      metadata.company = this.metadata.filter.company;
      metadata.productName = this.metadata.filter.productName;
      metadata.shipper = this.metadata.filter.shipper;

      let tableList = await invoiceList(metadata);
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
          startTime: "",
          endtTime: "",
          company: "",
          productName: "",
          shipper: ""
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
    // 删除
    del(row) {
      this.$confirm("是否确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        invoiceDelete(row.id).then(res => {
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
    // 查看
    view(row) {
      this.$router.push({
        name: "出货单详情",
        params: {
          id: row.id
        }
      });
    },
    // 打印出货单
    add() {
      this.$router.push({
        name: "出货单打印"
      });
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


