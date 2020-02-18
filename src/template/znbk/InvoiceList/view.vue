<template>
  <el-container id="InvoiceView">
    <el-header>
      <el-page-header content="出货单详情" @back="goBack"></el-page-header>
    </el-header>
    <el-main>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="购货方信息" name="购货方信息">
          <el-form label-width="150px" size="mini">
            <el-row>
              <el-col :span="6">
                <el-form-item label="公司名称:">
                  <el-col class="line" :span="24">海王星辰</el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司地址:">
                  <el-col class="line" :span="24">成都市三环路琉璃立交</el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="开票日期:">
                  <el-col class="line" :span="24">2020-01-13</el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单据编号:">
                  <el-col class="line" :span="24">XXXXX-XXXX-XXXXX</el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="公司联系电话:">
                  <el-col class="line" :span="24">15828223645</el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="发货信息" name="发货信息">
          <el-form label-width="150px" size="mini">
            <el-row>
              <el-col :span="6">
                <el-form-item label="发货人:">
                  <el-col class="line" :span="24">发货人</el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发货仓库:">
                  <el-col class="line" :span="24">发货仓库</el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="仓库地址:">
                  <el-col class="line" :span="24">仓库地址</el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="储运条件:">
                  <el-col class="line" :span="24">储运条件</el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="商品明细" name="商品明细">
          <el-table :data="tableList" size="mini">
            <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
            <el-table-column label="规格" :show-overflow-tooltip="true" prop="dz"></el-table-column>
            <el-table-column label="单位" :show-overflow-tooltip="true" prop="dh"></el-table-column>
            <el-table-column label="生产许可证号" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
            <el-table-column label="注册证号" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
            <el-table-column label="生产厂商" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
            <el-table-column label="生产批号" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
            <el-table-column label="生产日期" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
            <el-table-column label="有效期至" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
            <el-table-column label="数量" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
            <el-table-column label="单价" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
            <el-table-column label="金额" :show-overflow-tooltip="true" prop="ywy"></el-table-column>
          </el-table>
          <el-form label-width="150px" size="mini" style="margin-top: 15px;">
            <el-row>
              <el-col :span="6">
                <el-form-item label="合计金额:">
                  <el-col class="line" :span="24">5000</el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>
<script>
import moment from "moment";
import { getZnbkList, delControlFile } from "../../znbk/api/znbkServiceApi";
export default {
  data() {
    return {
      activeNames: ["购货方信息", "发货信息", "商品明细"],
      tableList: [{ name: "公司名称", dz: "地址", dh: "电话", ywy: "业务员" }]
    };
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    // 获取列表
    async getList(page) {
      let metadata = {};
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
    // 返回
    goBack() {
      this.$router.push({
        name: "发货单列表"
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
#InvoiceView {
  height: 100%;
  .el-header {
    // height: 100px !important;
    .el-page-header {
      margin-bottom: 15px;
    }
  }
}
</style>
<style lang="scss">
#InvoiceView {
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


