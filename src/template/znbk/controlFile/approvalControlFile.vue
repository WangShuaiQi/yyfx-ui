<template>
    <el-container id="initiateControlFile">
      <el-header>
        <el-page-header content="待审批的请求"></el-page-header>
        <el-form ref="filter" :model="metadata.filter" :inline="true">
          <el-form-item label="档案状态">
            <el-select v-model="metadata.filter.status" size="mini">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in  select.status" :key="index" :label="item.statusName" :value="item.statusValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门">
            <SelectTree 
              :options="select.dept"
              :value="metadata.filter.orgId"
              :clearable="true"
              :accordion="false"
              :search='true'
              ref="child1"
              size="mini"
              @getValue="selectDept($event)"
            />
            </el-form-item>
          <el-form-item label="审批批次">
            <el-select v-model="metadata.filter.batchId" size="mini">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in  select.batches" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请人">
            <el-select v-model="metadata.filter.userId" size="mini">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in  select.user" :key="index" :label="item.userName" :value="item.userId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="float_right">
            <el-button type="primary" size="mini"  @click="getList(1)">搜索</el-button>
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
        </el-form>
        <div class="btnBox">
          <el-button type="primary" size="mini" @click="addApplication">审批</el-button>
          <span>布控档案数:{{bkdaNum}}个,批次数{{batchNum}}个</span>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableList"  @selection-change="tableChange" size="mini">
            <el-table-column type="selection"></el-table-column>
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
                        <el-button size="mini" type="text" @click="addApplicationOne(scope.row)">审批</el-button>
                        <el-button size="mini" type="text" @click="getProcessImg(scope.row.processId)">查看流程</el-button>
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
        <el-dialog width="450px" :visible.sync="dialogFlag" @close="dialogClose">
            <div slot="title">
              <span class="el-dialog__title">确认审批</span>
            </div>
            <el-form>
              <el-form-item label="审批结果">
                <el-select v-model="formObj.approveResult" size="mini">
                    <el-option label="同意" value="approved"></el-option>
                    <el-option label="拒绝" value="rejected"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审批意见">
                <el-input type="textarea" v-model="formObj.approveComment"  size="mini"></el-input>
              </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
              <el-button type="primary" size="mini" @click="submitApplication()">确认</el-button>
              <el-button type="primary" size="mini" plain @click="dialogFlag=false">取消</el-button>
            </div>
        </el-dialog>
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
  getDept,
  getZnbkStatus,
  getPendingList,
  getUserList,
  getPendingCount,
  submitApplicationBk,
  submitApplicationCk,
  submitApplicationXk,
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
          orgId: "",
          userId: "",
          bkdxType: "",
          bkdxValue: ""
        }
      },
      select: {
        dept: [],
        status: [],
        user: [],
        batches: []
      },
      tableList: [],
      batchNum: 0,
      bkdaNum: 0,
      dialogFlag: false,
      imgFlag: false,
      formObj: {
        approveResult: "",
        approveComment: "",
        applyId: ""
      },
      submitObj: [],
      imgurl: ""
    };
  },
  components: { SelectTree },
  mounted() {
    this.getSelect();
    this.getList(1);
  },
  methods: {
    // 获取下拉框
    async getSelect() {
      this.select.dept = await getDept();
      getZnbkStatus().then(res => {
        this.select.status = [];
        res.map((item, index) => {
            console.log(item)
          if (
            item.statusName == "布控审批中" ||
            item.statusName == "撤销审批中" ||
            item.statusName == "续控审批中"
          ) {
            this.select.status.push(item);
          }
        });
      });
      this.select.user = await getUserList();
      this.select.batches = await getBatches();
    },
    // 获取列表
    async getList(page) {
      let metadata = {};
      metadata.page = page;
      metadata.pageSize = this.metadata.paginationParam.pageSize;
      metadata.status = this.metadata.filter.status;
      metadata.orgId = this.metadata.filter.orgId;
      metadata.bkdxType = this.metadata.filter.bkdxType;
      metadata.bkdxValue = this.metadata.filter.bkdxValue;
      metadata.userId = this.metadata.filter.userId;
      metadata.batchId = this.metadata.filter.batchId;
      let tableList = await getPendingList(metadata);
      this.tableList = tableList.resultSet;
      this.metadata.paginationParam = tableList.metadata.paginationParam;
      this.getPendingCount();
    },
    // 分页
    currentChange(value) {
      this.getList(value);
    },
    //选择所属单位
    selectDept(id) {
      this.metadata.filter.orgId = id;
    },
    async getPendingCount() {
      let metadata = {};
      let status = "BKSPZ,CKSPZ,XKSPZ";
      if (this.metadata.filter.status) {
        status = this.metadata.filter.status;
      }
      metadata.status = status;
      metadata.orgId = this.metadata.filter.orgId;
      metadata.bkdxType = this.metadata.filter.bkdxType;
      metadata.bkdxValue = this.metadata.filter.bkdxValue;
      metadata.userId = this.metadata.filter.userId;
      metadata.batchId = this.metadata.filter.batchId;
      let count = await getPendingCount(metadata);
      this.batchNum = count.batchNum;
      this.bkdaNum = count.bkdaNum;
    },
    reset() {
      this.metadata = {
        paginationParam: {
          page: 1,
          pageSize: 10
        },
        filter: {
          status: "",
          batchId: "",
          orgId: "",
          userId: "",
          bkdxType: "",
          bkdxValue: ""
        }
      };
      this.getList(1);
    },
    async getProcessImg(processId) {
      let img = await getProcessImg(processId);
      this.imgurl = "data:image/png;base64," + img;
      this.imgFlag = true;
    },
    tableChange(val) {
      this.submitObj = [];
      console.log(val);
      val.map(item => {
        item.bkdas.map(items => {
          this.submitObj.push(items);
        });
      });
    },
    dialogClose() {
      this.formObj = {
        approveResult: "",
        approveComment: "",
        applyId: ""
      };
      this.submitObj = [];
    },
    addApplication() {
      let moveflag = true;
      if (this.submitObj.length == 0) {
        this.$message.warning("至少选择一个批次");
      } else if (this.submitObj.length > 1) {
        this.submitObj.map((item, index) => {
          if (index != 0 && item.applyId != this.submitObj[index - 1].applyId) {
            moveflag = false;
          }
        });
        if (moveflag) {
          this.dialogFlag = true;
        } else {
          this.$message.warning("一次只能操作一个批次！");
        }
      } else {
        this.dialogFlag = true;
      }
    },
    addApplicationOne(row) {
      this.submitObj = [];
      this.submitObj.push(row);
      this.dialogFlag = true;
    },
    async submitApplication() {
      let taskId = [];
      let applyType = "";
      let submitFlag = "";
      this.submitObj.map(item => {
        taskId.push(item.oid);
      });
      taskId = taskId.join(",");
      this.formObj.applyId = this.submitObj[0].applyId;
      this.tableList.map(item => {
        if (item.oid == this.formObj.applyId) {
          applyType = item.applyType;
        }
      });
      console.log(applyType);
      if (applyType == "bk") {
        submitFlag = await submitApplicationBk(taskId, this.formObj);
      } else if (applyType == "xk") {
        submitFlag = await submitApplicationXk(taskId, this.formObj);
      } else {
        submitFlag = await submitApplicationCk(taskId, this.formObj);
      }
      if (submitFlag == 200) {
        this.$message({
          type: "success",
          message: "审批成功！"
        });
        this.dialogFlag = false;
        this.getList(1);
      } else {
        this.$message.error("审批失败！");
      }
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
  height: 100%;
  .el-header {
    height: 200px !important;
    .el-page-header {
      margin-bottom: 15px;
    }
    .btnBox {
      margin-bottom: 15px;
      span {
        letter-spacing: 2px;
        font-size: 14px;
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
  //   .el-table__body,
  //   .el-table__footer,
  //   .el-table__header {
  //     table-layout: auto;
  //     border-collapse: separate;
  //   }
}
</style>



