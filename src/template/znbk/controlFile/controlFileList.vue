<template>
    <el-container id="controlFileList">
      <el-header>
        <el-page-header content="布控档案列表"></el-page-header>
        <el-form ref="filter" :model="metadata.filter" :inline="true">
          <el-row>
            <el-col :span="6">
              <el-form-item label="档案状态">
                <el-select v-model="metadata.filter.status" size="mini">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(item,index) in  select.status" :key="index" :label="item.statusName" :value="item.statusValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门">
                <SelectTree 
                  :options="select.dept"
                  :value="metadata.filter.orgId"
                  :clearable="true"
                  :accordion="false"
                  :search='true'
                  ref="child1"
                  @getValue="selectDept($event)"
                  size="mini"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="布控对象">
                <el-select v-model="metadata.filter.bkdxType" size="mini">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="身份证" value="SFZH"></el-option>
                  <el-option label="车牌号" value="CPH"></el-option>
                  <el-option label="手机号" value="SJH"></el-option>
                  <el-option label="mac地址" value="MAC"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item v-show="metadata.filter.bkdxType">
                <el-input type="text" size="mini" v-model="metadata.filter.bkdxValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-form-item>
                <el-button type="primary" size="mini" @click="search">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="btnBox">
          <el-button type="primary" size="mini" @click="addControlFile">创建</el-button>
          <el-button type="primary" size="mini" @click="batchCreation">批量创建</el-button>
          <el-button type="primary" size="mini" plain :disabled="btnStatus.batchDel" @click="batchDel">批量删除</el-button>
          <el-button type="primary" size="mini" plain :disabled="btnStatus.batchInitiate" @click="batchControlFileRequisition">发起布控</el-button>
          <el-button type="primary" size="mini" plain :disabled="btnStatus.control" @click="batchcontrol">发起续控</el-button>
          <el-button type="primary" size="mini" plain :disabled="btnStatus.batchCancel" @click="batchCancel">发起撤控</el-button>
          <span>总共:{{count}}个,布控中{{bkCount}}个</span>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableList" size="mini" @selection-change="tableChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="布控状态">
                <template slot-scope="scope">
                  {{scope.row.status |getSelectOption(select.status,"statusValue","statusName")}}
              </template>
          </el-table-column>
          <el-table-column label="是否个人">
              <template slot-scope="scope">
                  {{scope.row.sfgr |sfgr}}
              </template>
          </el-table-column> 
          <el-table-column label="布控对象"  :show-overflow-tooltip="true">
            <template slot-scope="scope">
               <el-button type="text" size="mini" @click="view(scope.row)">{{scope.row.bkName}} {{scope.row.bkdxValue}}({{scope.row.bkdxType|bkdxType}})</el-button>
             </template>
          </el-table-column>
          <el-table-column label="布控部门" prop="orgName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="产生预警数量" prop="warnningNum"></el-table-column>
          <el-table-column label="布控起始时间">
              <template slot-scope="scope">{{scope.row.bkStartTime|formatTime}}</template>
          </el-table-column>
          <el-table-column label="布控结束时间">
              <template slot-scope="scope">{{scope.row.bkEndTime|formatTime}}</template>
          </el-table-column>
          <el-table-column label="布控申请人" :show-overflow-tooltip="true" prop="bkApplyName"></el-table-column>
          <el-table-column label="预警接收人" :show-overflow-tooltip="true" prop="dealName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status=='WBK'||scope.row.status=='YCK'||scope.row.status=='BKBH'" size="mini" type="text" @click="controlFileRequisition(scope.row.oid)">发起布控</el-button>
              <el-button v-if="scope.row.status=='BKZ'" size="mini" type="text" @click="control(scope.row.oid)">续控</el-button>
              <el-button v-if="scope.row.status=='BKZ'" size="mini" type="text" @click="cancel(scope.row.oid)">撤控</el-button>
              <el-button v-if="scope.row.status=='WBK'||scope.row.status=='YCK'||scope.row.status=='BKBH'" size="mini" type="text" @click="del(scope.row)">删除</el-button>
              <el-button v-if="(scope.row.status=='WBK'||scope.row.status=='YCK'||scope.row.status=='BKBH')&&scope.row.sfgr" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status=='BKSPZ'||scope.row.status=='CXSPZ'||scope.row.status=='XKSPZ'" size="mini" type="text" @click="getProcessImg(scope.row.processId)">查看流程</el-button>
            </template>
          </el-table-column>
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
import moment from "moment";
import {
  getDept,
  getZnbkList,
  getZnbkStatus,
  delControlFile,
  getBkCount,
  getProcessImg
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
          orgId: "",
          bkdxType: "",
          bkdxValue: ""
        }
      },
      bkCount: 0,
      count: 0,
      tableList: [],
      btnStatus: {
        batchDel: false,
        batchInitiate: false,
        batchCancel: false,
        control: false
      },
      select: {
        dept: [],
        status: []
      },
      checkTable: [],
      imgFlag: false,
      imgurl: ""
    };
  },
  components: { SelectTree },
  mounted() {
    this.getSelect();
    this.getList(1);
    this.getBkCount();
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
      let tableList = await getZnbkList(metadata);
      this.tableList = tableList.data.data.resultSet;
      this.tableList.map(item => {
        let dealNameArr = [];
        if (item.yjjsmjList) {
          item.yjjsmjList.map(items => {
            dealNameArr.push(items.name);
          });
          item.dealName = dealNameArr.join(",");
        }
      });
      this.metadata.paginationParam =
        tableList.data.data.metadata.paginationParam;
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
    //获取布控数量
    async getBkCount() {
      this.bkCount = await getBkCount("BKZ");
      if (this.bkCount == null) {
        this.bkCount = 0;
      }
      this.count = await getBkCount("");
      if (this.count == null) {
        this.count = 0;
      }
    },
    // 搜索
    search() {
      this.getList(1);
    },
    // 分页
    currentChange(value) {
      this.getList(value);
    },
    // 获取下拉框
    async getSelect() {
      this.select.dept = await getDept();
      this.select.status = await getZnbkStatus();
    },
    //选择所属单位
    selectDept(id) {
      this.metadata.filter.orgId = id;
    },
    // 表格勾选和按钮禁用
    tableChange(val) {
      console.log(val);
      this.checkTable = val;
      this.btnStatus.batchDel = false;
      this.btnStatus.batchInitiate = false;
      this.btnStatus.batchCancel = false;
      console.log(val);
      val.map(item => {
        switch (item.status) {
          case "WBK":
            this.btnStatus.batchCancel = true;
            this.btnStatus.control = true;
            break;
          case "BKBH":
            this.btnStatus.batchCancel = true;
            this.btnStatus.control = true;
            break;
          case "BKSPZ":
            this.btnStatus.batchDel = true;
            this.btnStatus.batchInitiate = true;
            this.btnStatus.batchCancel = true;
            this.btnStatus.control = true;
            break;
          case "BKZ":
            this.btnStatus.batchDel = true;
            this.btnStatus.batchInitiate = true;
            break;
          case "CXSPZ":
            this.btnStatus.batchDel = true;
            this.btnStatus.batchInitiate = true;
            this.btnStatus.batchCancel = true;
            this.btnStatus.control = true;
            break;
          case "YCK":
            this.btnStatus.batchCancel = true;
            this.btnStatus.control = true;
            break;
        }
      });
    },
    // 查看流程
    async getProcessImg(processId) {
      let img = await getProcessImg(processId);
      this.imgurl = "data:image/png;base64," + img;
      this.imgFlag = true;
    },
    // 创建布控
    addControlFile() {
      this.$router.push({
        name: "创建布控档案"
      });
    },
    // 批量创建布控
    batchCreation() {
      this.$router.push({
        name: "批量创建布控档案"
      });
    },
    // 发起布控
    controlFileRequisition(id) {
      this.$router.push({
        name: "发起布控",
        query: {
          ids: id
        }
      });
    },
    // 批量发起布控
    batchControlFileRequisition() {
      if (this.checkTable.length > 0) {
        let delArr = [];
        this.checkTable.map(item => {
          delArr.push(item.oid);
        });
        this.$router.push({
          name: "发起布控",
          query: {
            ids: delArr.join(",")
          }
        });
      } else {
        this.$message.warning("至少选择一个布控档案");
      }
    },
    //发起续控
    control(id) {
      this.$router.push({
        name: "发起续控",
        query: {
          ids: id
        }
      });
    },
    //批量撤控
    batchcontrol() {
      if (this.checkTable.length > 0) {
        let delArr = [];
        this.checkTable.map(item => {
          delArr.push(item.oid);
        });
        this.$router.push({
          name: "发起续控",
          query: {
            ids: delArr.join(",")
          }
        });
      } else {
        this.$message.warning("至少选择一个布控档案");
      }
    },
    // 发起撤控
    cancel(id) {
      this.$router.push({
        name: "发起撤控",
        query: {
          ids: id
        }
      });
    },

    //批量撤控
    batchCancel() {
      if (this.checkTable.length > 0) {
        let delArr = [];
        this.checkTable.map(item => {
          delArr.push(item.oid);
        });
        this.$router.push({
          name: "发起撤控",
          query: {
            ids: delArr.join(",")
          }
        });
      } else {
        this.$message.warning("至少选择一个布控档案");
      }
    },
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
    // 批量删除
    batchDel() {
      if (this.checkTable.length > 0) {
        this.$confirm("是否确定删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let delArr = [];
          this.checkTable.map(item => {
            delArr.push(item.oid);
          });
          delControlFile(delArr.join(",")).then(res => {
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
      } else {
        this.$message.warning("至少选择一个布控档案");
      }
    },
    // 查看布控
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
    },
    // 编辑布控
    edit(row) {
      this.$router.push({
        name: "编辑多维档案",
        query: {
          value: row.bkdxValue,
          type: row.bkdxType,
          id: row.oid
        },
        params: {
          id: row.oid
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
    height: 180px !important;
    .el-page-header {
      margin-bottom: 15px;
    }
  }

  .el-main {
    .btnBox {
      margin-bottom: 15px;
      span {
        margin-left: 15px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
<style lang="scss">
#controlFileList {
  .el-table__header {
    table-layout: auto !important;
    border-collapse: separate;
  }
  .el-table {
    colgroup > col:nth-child(1) {
      width: 3rem !important;
    }
    colgroup > col:nth-child(2) {
      width: 4.5rem !important;
    }
    colgroup > col:nth-child(3) {
      width: 3.7rem !important;
    }
    colgroup > col:nth-child(4) {
      width: 11.5rem !important;
    }
    colgroup > col:nth-child(5) {
      width: 5.5rem !important;
    }
    colgroup > col:nth-child(6) {
      width: 5rem !important;
    }
    colgroup > col:nth-child(7) {
      width: 5rem !important;
    }
    colgroup > col:nth-child(8) {
      width: 5rem !important;
    }
    colgroup > col:nth-child(9) {
      width: 4.5rem !important;
    }
    colgroup > col:nth-child(10) {
      width: 4.5rem !important;
    }
    colgroup > col:nth-child(11) {
      width: 8.5rem !important;
    }
    .el-tooltip {
      width: 100% !important;
    }
  }
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
}
</style>


