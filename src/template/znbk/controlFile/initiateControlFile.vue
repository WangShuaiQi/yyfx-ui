<template>
    <el-container id="initiateControlFile">
      <el-header>
        <el-page-header content="已发起的申请"></el-page-header>
        <el-form ref="filter" :model="metadata.filter" :inline="true">
          <el-form-item label="档案状态">
            <el-select v-model="metadata.filter.status" size="mini">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in  select.status" :key="index" :label="item.statusName" :value="item.statusValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审批批次">
              <el-select v-model="metadata.filter.batchId" size="mini">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in  select.batches" :key="index" :label="item" :value="item"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="布控对象">
            <el-select v-model="metadata.filter.bkdxType" size="mini">
              <el-option label="全部" value=""></el-option>
              <el-option label="身份证" value="SFZH"></el-option>
              <el-option label="车牌号" value="CPH"></el-option>
              <el-option label="手机号" value="SJH"></el-option>
              <el-option label="mac地址" value="MAC"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="metadata.filter.bkdxType">
            <el-input type="text" size="mini" v-model="metadata.filter.bkdxValue"></el-input>
          </el-form-item>
          <el-form-item class="float_right">
            <el-button type="primary" size="mini"  @click="getList(1)">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="btnBox">
          <span>布控档案数:{{bkdaNum}}个,批次数{{batchNum}}个</span>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableList" size="mini">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="scope.row.bkdas" align="center" stripe="" size="mini">
                <el-table-column label="是否个人">
                  <template slot-scope="scope">
                    {{scope.row.sfgr |sfgr}}
                  </template>
                </el-table-column>
                <el-table-column label="布控对象" prop="bkdx">
                  <template slot-scope="scope">
                      <el-button type="text" size="mini" @click="view(scope.row)"> {{scope.row.bkdxValue}}({{scope.row.bkdxType |bkdxType}})</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status=='BKSPZ'||scope.row.status=='CXSPZ'" size="mini" type="text" @click="getProcessImg(scope.row.processId)">查看流程</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="审批批次" prop="batch"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="审批类型">
              <template slot-scope="scope">
                 {{scope.row.applyType | applyType}}
              </template> 
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="布控档案数" prop="bkdags">
             <template slot-scope="scope">
                 {{scope.row.bkdas.length}}
             </template> 
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="布控部门" prop="orgName"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="申请人" prop="userName"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="备注" prop="reason"></el-table-column>
        </el-table>  
        <el-pagination 
          :current-page="metadata.paginationParam.page"
          :page-size="metadata.paginationParam.pageSize"
          :total="metadata.paginationParam.totalCount"
           @current-change="currentChange"
          layout="total,prev,pager,next,jumper" >
        </el-pagination>
         <el-dialog :visible.sync="imgFlag" width="750px">
            <div slot="title">
              <span class="el-dialog__title">流程图</span>
            </div>
            <img :src="imgurl" alt="" width="100%">
        </el-dialog>
      </el-main>
    </el-container>
</template>
<script>
import SelectTree from "@/template/common/selectTree";
import {
  getInitiatingList,
  getZnbkStatus,
  getInitiatingCount,
  getProcessImg,
  getBatches
} from "../../znbk/api/znbkServiceApi";

export default {
  data() {
    return {
      metadata: {
        paginationParam: {
          page: 1,
          pageSize: 10
        },
        filter: {
          status: "",
          batchId: "",
          bkdxType: "",
          bkdxValue: ""
        }
      },
      tableList: [],
      select: {
        dept: [],
        status: [],
        batches: []
      },
      batchNum: 0,
      bkdaNum: 0,
      imgurl: "",
      imgFlag: false
    };
  },
  mounted() {
    this.getList(1);
    this.getSelect();
  },
  components: { SelectTree },
  methods: {
    async getProcessImg(processId) {
      let img = await getProcessImg(processId);
      this.imgurl = "data:image/png;base64," + img;
      this.imgFlag = true;
    },
    async getList(page) {
      let metadata = {};
      metadata.page = page;
      metadata.pageSize = this.metadata.paginationParam.pageSize;
      metadata.status = this.metadata.filter.status;
      metadata.batchId = this.metadata.filter.batchId;
      metadata.bkdxType = this.metadata.filter.bkdxType;
      metadata.bkdxValue = this.metadata.filter.bkdxValue;
      let tableList = await getInitiatingList(metadata);
      this.tableList = tableList.resultSet;
      this.metadata.paginationParam = tableList.metadata.paginationParam;
      this.getInitiatingCount();
    },
    async getInitiatingCount() {
      let metadata = {};
      metadata.status = this.metadata.filter.status;
      metadata.batchId = this.metadata.filter.batchId;
      metadata.bkdxType = this.metadata.filter.bkdxType;
      metadata.bkdxValue = this.metadata.filter.bkdxValue;
      let count = await getInitiatingCount(metadata);
      console.log(count)
      this.batchNum = count.batchNum 
      this.bkdaNum = count.bkdaNum
    },
    async getSelect() {
      this.select.status = await getZnbkStatus();
      this.select.batches = await getBatches();
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
          batchId: "",
          bkdxType: "",
          bkdxValue: ""
        }
      };
      this.getList(1);
    },
    // 分页
    currentChange(value) {
      this.getList(value);
    },
    view(row) {
      this.$router.push({
        name: "查看多维档案",
        params: {
          id: row.oid
        },
        query: {
          sfgr: row.sfgr,
          val: row.bkdxValue,
          type: row.bkdxType
        }
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
    applyType(v) {
      if (v == "bk") {
        return "布控";
      } else if (v == "xk") {
        return "续控";
      } else {
        return "撤控";
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
    }
  }
};
</script>
<style lang="scss" scoped>
#initiateControlFile {
  max-height: 580px;
  .el-header {
    height: 140px !important;
    .el-page-header {
      margin-bottom: 15px;
    }
    .btnBox {
      margin-bottom: 15px;
      span {
        font-size: 14px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
<style lang="scss">
#initiateControlFile {
  .el-form-item__content {
    width: calc(100% - 68px);
  }
  .el-page-header {
  }
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
  .el-page-header {
  }
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
  //   .el-table__body,
  //   .el-table__footer,
  //   .el-table__header {
  //     table-layout: auto;
  //     border-collapse: separate;
  //   }
}
</style>


