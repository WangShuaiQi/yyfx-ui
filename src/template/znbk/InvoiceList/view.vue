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
                  <el-col class="line" :span="24">{{formObj.purchasingUnit}}</el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司地址:">
                  <el-col class="line" :span="24">{{formObj.recvAdress}}</el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="开票日期:">
                  <el-col class="line" :span="24">{{formObj.createTimeL | formatTime}}</el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单据编号:">
                  <el-col class="line" :span="24">{{formObj.formId}}</el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="公司联系电话:">
                  <el-col class="line" :span="24">{{formObj.purchasingUnitTel }}</el-col>
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
                  <el-col class="line" :span="24">{{formObj.shipper}}</el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发货仓库:">
                  <el-col class="line" :span="24">{{formObj.ck}}</el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="地址:">
                  <el-col class="line" :span="24">{{formObj.saleUnitAdress}}</el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="储运条件:">
                  <el-col class="line" :span="24">{{formObj.storageCondition }}</el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="商品明细" name="商品明细">
          <el-table :data="formObj.productDetail " size="mini">
            <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="productName"></el-table-column>
            <el-table-column label="规格" :show-overflow-tooltip="true" prop="productSpecification"></el-table-column>
            <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit"></el-table-column>
            <el-table-column label="生产许可证号" :show-overflow-tooltip="true" prop="producingArea"></el-table-column>
            <el-table-column label="注册证号" :show-overflow-tooltip="true" prop="reginLicence"></el-table-column>
            <el-table-column label="生产厂商" :show-overflow-tooltip="true" prop="manufacturer"></el-table-column>
            <el-table-column label="生产批号" :show-overflow-tooltip="true" prop="batchNumber"></el-table-column>
            <el-table-column label="生产日期" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.produceTimeL|formatTime}}</template>
            </el-table-column>
            <el-table-column label="有效期至" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.validityTimeL|formatTime}}</template>
            </el-table-column>
            <el-table-column label="数量" :show-overflow-tooltip="true" prop="saleNumber"></el-table-column>
            <el-table-column label="单价" :show-overflow-tooltip="true" prop="unitPrice"></el-table-column>
            <el-table-column label="金额" :show-overflow-tooltip="true" prop="amountMoneyMount"></el-table-column>
          </el-table>
          <el-form label-width="150px" size="mini" style="margin-top: 15px;">
            <el-row>
              <el-col :span="6">
                <el-form-item label="合计金额:">
                  <el-col class="line" :span="24">{{formObj.moneyReceived}}</el-col>
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
import { invoiceView,warehouse } from "../../znbk/api/znbkServiceApi";
export default {
  data() {
    return {
      formObj: {},
      activeNames: ["购货方信息", "发货信息", "商品明细"],
      tableList: [{ name: "公司名称", dz: "地址", dh: "电话", ywy: "业务员" }]
    };
  },
  mounted() {
    this.view();
  },
  methods: {
    async view() {
      this.formObj = await invoiceView(this.$route.params.id);
      this.warehouse();
    },
    // 获取公司地址
    async warehouse() {
      let warehousearr = await warehouse();
      this.formObj.ck = warehousearr[0].warehouseName;
    },
    // 返回
    goBack() {
      this.$router.push({
        name: "出货单列表"
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


