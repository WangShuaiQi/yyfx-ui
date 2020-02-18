<template>
  <el-container id="controlFileList">
    <el-header>
      <el-page-header content="发货单列表"></el-page-header>
      <el-form ref="filter" :model="metadata.filter" :inline="true" size="mini">
        <el-form-item label="购买公司">
          <el-input v-model="metadata.filter.ywy" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="metadata.filter.ywy" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="发货人">
          <el-input v-model="metadata.filter.ywy" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="起止时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="metadata.filter.ywy"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="metadata.filter.ywy" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="tableList" size="mini" @selection-change="tableChange">
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column label="购货单位" :show-overflow-tooltip="true" prop="name"></el-table-column>
        <el-table-column label="购货时间" :show-overflow-tooltip="true" prop="dz"></el-table-column>
        <el-table-column label="购货金额" :show-overflow-tooltip="true" prop="dh"></el-table-column>
        <el-table-column label="发货人" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="view(scope.row)">查看</el-button>
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
      checkTable: []
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
    // 查看
    view(row) {
      this.$router.push({
        name: "发货单详情"
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


