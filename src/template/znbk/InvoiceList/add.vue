<template>
  <div>
    <el-row class="template" id="templates">
      <el-col :span="24">
        <el-row>
          <el-col :span="24" class="centerText">成都赞美生物科技有限公司随货同行单</el-col>
        </el-row>
        <el-form :inline="true" size="mini">
          <el-row>
            <el-col :span="6">
              <el-form-item label="购货单位">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="12">
              <el-form-item label="收获地址">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="出库时间">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据编号">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="储运条件">
                <el-select v-model="formObj.name" placeholder="请选择活动区域">
                  <el-option label="阴凉" value="shanghai"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>商品名称</th>
                    <th>规格</th>
                    <th>单位</th>
                    <th>生产许可证号</th>
                    <th>注册证号</th>
                    <th>生产厂商</th>
                    <th>生产批号</th>
                    <th>生产日期</th>
                    <th>有效期至</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in  tableList" :key="index">
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.je}}</td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="合计金额">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="12">
              <el-form-item label="合计金额">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span class="key">第一联:</span>
              <span>财物记帐(白)</span>
            </el-col>
            <el-col :span="6">
              <span class="key">第二联:</span>
              <span>结算（粉）</span>
            </el-col>
            <el-col :span="6">
              <span class="key">第三联:</span>
              <span>客户（蓝）</span>
            </el-col>
            <el-col :span="6">
              <span class="key">第四联:</span>
              <span>存根（黄）</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="制单">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出库复核">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发货人">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收货人">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="地址">
                <el-input v-model="formObj.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div class="centerText">
      <el-button @click="printdata" size="mini" type="primary">打印票据</el-button>
    </div>
    <!--startprint1-->
    <el-row class="template" id="template">
      <el-col :span="24">
        <el-row>
          <el-col :span="24" class="centerText">成都赞美生物科技有限公司随货同行单</el-col>
        </el-row>
        <el-form :inline="true" size="mini">
          <el-row>
            <el-col :span="6">
              <span class="key">购货单位:</span>
              <span>XXXXXXXXXX</span>
            </el-col>
            <el-col :span="6" :offset="12">
              <span class="key">收获地址:</span>
              <span>XXXXXXXXXX</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span class="key">出库时间:</span>
              <span>2020-01-06</span>
            </el-col>
            <el-col :span="6">
              <span class="key">单据编号:</span>
              <span>ZM-2020-02-06-0011</span>
            </el-col>
            <el-col :span="6">
              <span class="key">联系电话:</span>
              <span>18909881234</span>
            </el-col>
            <el-col :span="6">
              <span class="key">储运条件:</span>
              <span>阴凉</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>商品名称</th>
                    <th>规格</th>
                    <th>单位</th>
                    <th>生产许可证号</th>
                    <th>注册证号</th>
                    <th>生产厂商</th>
                    <th>生产批号</th>
                    <th>生产日期</th>
                    <th>有效期至</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in  tableList" :key="index">
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.je}}</td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span class="key">合计金额:</span>
              <span>2000.00</span>
            </el-col>
            <el-col :span="6" :offset="12">
              <span class="key">合计金额:</span>
              <span>贰仟元</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span class="key">第一联:</span>
              <span>财物记帐(白)</span>
            </el-col>
            <el-col :span="6">
              <span class="key">第二联:</span>
              <span>结算（粉）</span>
            </el-col>
            <el-col :span="6">
              <span class="key">第三联:</span>
              <span>客户（蓝）</span>
            </el-col>
            <el-col :span="6">
              <span class="key">第四联:</span>
              <span>存根（黄）</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span class="key">制单:</span>
              <span>吴丹</span>
            </el-col>
            <el-col :span="6">
              <span class="key">出库复核:</span>
              <span>出库复核</span>
            </el-col>
            <el-col :span="6">
              <span class="key">发货人:</span>
              <span>当前账户</span>
            </el-col>
            <el-col :span="6">
              <span class="key">收货人:</span>
              <span>张三</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="key">地址:</span>
              <span>成都市科华中路新3号1幢11层028号码</span>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <!--endprint1-->
  </div>
</template>
<script>
import moment from "moment";
import { getZnbkList, delControlFile } from "../../znbk/api/znbkServiceApi";
export default {
  data() {
    return {
      formObj: {},
      activeNames: ["购货方信息", "发货信息", "商品明细"],
      tableList: [
        { name: "公司名称", dz: "地址", dh: "电话", ywy: "业务员", je: 10 }
      ]
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
      //     if (item.yjjxsjList) {
      //       item.yjjxsjList.map(items => {
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
    },
    printdata() {
      let k = $("#template").prop("outerHTML");
      $("body *").hide();
      $("body").append(k);
      $("body #template:last").css("display", "block");
      window.print();
      $("body *").show();
      $("body #template:last").remove();
      $("body #template:last").css("display", "none");
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
<style>
@import "bootstrap/dist/css/bootstrap.min.css";
</style>
<style lang="scss" scoped>
.centerText {
  text-align: center;
}
.key {
  display: inline-block;
  min-width: 60px;
}
.template {
  .el-row {
    margin-top: 10px;
  }
}
#InvoiceView {
  height: 100%;
  .el-header {
    // height: 100px !important;
    .el-page-header {
      margin-bottom: 15px;
    }
  }
}
#template {
  display: none;
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


