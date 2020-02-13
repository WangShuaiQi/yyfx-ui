<template>
    <el-container id="batchCreation">
      <el-header>
          <el-page-header content="批量创建布控档案" @back="back"></el-page-header>
          <el-form ref="filter" :model="formObj" :inline="true">
            <el-row>
              <el-col :span="6">
                <el-form-item label="姓名">
                  <el-input v-model="formObj.name" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="性别">
                  <el-select v-model="formObj.sex" size="mini">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="年龄">
                  <el-input v-model="formObj.age" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="民族">
                    <el-select  size="mini" v-model="formObj.nation">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in select.nation" :key="index" :label="item.value" :value="item.value"></el-option>
                    </el-select>    
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="户籍地">
                  <el-input type="text" size="mini" v-model="formObj.jgcsd"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身份证">
                  <el-input type="text" size="mini" v-model="formObj.sfzh"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="只查重点人员">
                  <el-switch v-model="formObj.sfzdry"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="只查僧尼人员">
                  <el-switch v-model="formObj.sfsr"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item class="float_right">
                  <el-button type="primary" size="mini" @click="search">搜索</el-button>
                </el-form-item>
              </el-col>
            </el-row>
        </el-form>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="10">
            <el-table :data="tableChildrenList" size="mini" @selection-change="addTable" height="350">
                <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="身份证号" prop="bkdaValue" width="150"></el-table-column>
                <el-table-column label="管辖派出所" prop="gxpcs"></el-table-column>
                <el-table-column label="是否在控" prop="sfzk"></el-table-column>
            </el-table>
            <el-pagination 
              @current-change="tableListPageChange"
              :current-page="tableListPage"
              :page-size="10"
              :total="tableLsitTotal"
              small
              layout="total,prev,pager,next,jumper" >
            </el-pagination>
          </el-col>
          <el-col :span="3" class="tableBtn">
            <div>
              <el-button type="primary" @click="delTableClick" :disabled="rightButtonFlag" circle icon="el-icon-d-arrow-left"></el-button>
              <el-button type="primary" @click="addTableClick" :disabled="leftButtonFlag"  circle icon="el-icon-d-arrow-right"></el-button>
            </div>
          </el-col>
          <el-col :span="11">
            <el-table :data="checkedChildrenList" size="mini" @selection-change="delTable" height="350">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="身份证号" prop="bkdaValue" width="150"></el-table-column>
                <el-table-column label="管辖派出所" prop="gxpcs"></el-table-column>
                <el-table-column label="是否在控" prop="sfzk"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="del(scope.row)">取消</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination 
            @current-change="checkedPageChange"
              :current-page="checkedPage"
              :page-size="10"
              :total="checkedList.length"
              small
              layout="total,prev,pager,next,jumper" >
            </el-pagination>
          </el-col>
          <el-col :span="24" class="btnFoot">
            <p>共选择{{checkedList.length}}人</p>
            <el-button type="primary" size="mini" @click="save">生成布控档案</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
</template>
<script>
import {
  searchPerson,
  getDictsValues,
  addControlFile
} from "../../znbk/api/znbkServiceApi";
export default {
  data() {
    return {
      tableListPage: 1,
      checkedPage: 1,
      tableLsitTotal: 0,
      formObj: {
        sfzdry: true
      },
      select: {
        nation: []
      },
      tableLsit: [],
      checkedList: [],
      tableChildrenList: [],
      checkedChildrenList: [],
      addTableList: [],
      delTableList: [],
      leftButtonFlag: true,
      rightButtonFlag: true
    };
  },
  mounted() {
    this.getSelect();
  },
  methods: {
    back() {
      this.$router.push({
        name: "布控档案列表"
      });
    },
    selectable(row, index) {
      let d = this.checkedList.filter(v => v.bkdaValue == row.bkdaValue);
      if (d.length) {
        return false;
      } else {
        return true;
      }
    },
    async search() {
      this.formObj.page = this.tableListPage;
      this.formObj.pageSize = 10;
      this.tableLsit = [];
      let person = await searchPerson(this.formObj);
      this.tableLsitTotal = person.metadata.paginationParam.totalCount;
      person.resultSet.map(item => {
        this.tableLsit.push(item);
      });
      this.tableLsit.forEach((M, i) => {
        this.$set(M, "index", i);
      });
      this.tableChildrenList = this.tableLsit;

      //   this.tableListPageChange(this.tableListPage);
    },
    async getSelect() {
      let op = {
        paginationParam: { page: 1, pageSize: 1000 },
        filter: { isDeleted: "0", keyword: "" }
      };
      this.select.nation = await getDictsValues("baseCode/MZ", op);
    },
    // 勾选添加布控对象
    addTable(val) {
      this.addTableList = val;
      if (val.length > 0) {
        this.leftButtonFlag = false;
      } else {
        this.leftButtonFlag = true;
      }
    },
    // 批量添加布控
    addTableClick() {
      this.addTableList.map(val => {
        this.checkedList.push(val);
        this.tableLsit.map((item, i) => {
          if (val.index == item.index) {
            this.tableLsit.splice(i, 1);
          }
        });
      });
      //   this.tableListPageChange(this.tableListPage);
      this.checkedPageChange(this.checkedPage);
      this.addTableList = [];
    },
    // 勾选取消布控对象
    delTable(val) {
      this.delTableList = val;
      if (val.length > 0) {
        this.rightButtonFlag = false;
      } else {
        this.rightButtonFlag = true;
      }
    },
    // 批量取消布控
    delTableClick() {
      this.delTableList.map(val => {
        this.tableLsit.splice(val.index, 0, val);
        this.checkedList.map((item, i) => {
          if (val.index == item.index) {
            this.checkedList.splice(i, 1);
          }
        });
      });
      this.tableListPageChange(this.tableListPage);
      this.checkedPageChange(this.checkedPage);
      this.delTableList = [];
    },
    // 取消布控
    del(item) {
      this.delTableList = [item];
      this.delTableClick();
    },
    // 待布控对象分页
    tableListPageChange(size) {
      this.tableListPage = size;
      this.search();
      //   this.tableChildrenList = this.tableLsit.slice((size - 1) * 10, size * 10);
      //   if (this.tableChildrenList.length == 0 && size > 1) {
      //     this.tableListPage = size - 1;
      //     this.tableChildrenList = this.tableLsit.slice(
      //       (size - 2) * 10,
      //       size * 10
      //     );
      //   }
    },
    // 已布控对象分页
    checkedPageChange(size) {
      this.checkedPage = size;
      this.checkedChildrenList = this.checkedList.slice(
        (size - 1) * 10,
        size * 10
      );
      if (this.checkedChildrenList.length == 0 && size > 1) {
        this.checkedPage = size - 1;
        this.checkedChildrenList = this.checkedList.slice(
          (size - 2) * 10,
          size * 10
        );
      }
    },
    // 保存
    async save() {
      if (this.checkedList.length == 0) {
        this.$message.warning("至少选择一个布控对象");
        return;
      }
      for (let i = 0; i < this.checkedList.length; i++) {
        let obj = {};
        obj.type = this.checkedList[i].bkdaType;
        obj.value = this.checkedList[i].bkdaValue;
        obj.sfgr = true;
        await addControlFile(obj).then(res => {
          if (res == 200) {
            // this.tableLsit.splice(this.checkedList[i].index, 1);
            this.checkedList.splice(i, 1);
            i--;
            this.checkedPageChange(1);
          }
        });
      }
      if (this.checkedList.length == 0) {
        this.$message({
          type: "success",
          message: "添加成功！"
        });
        this.$router.push({
          name: "布控档案列表"
        });
      } else {
        this.$message.error("部分添加失败！");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#batchCreation {
  height: 100%;
  .el-header {
    height: 150px !important;
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
    .tableBtn {
      height: 350px;
      position: relative;
      div {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        .el-button {
          display: block;
          margin: 0px;
        }
        .el-button + .el-button {
          margin-top: 20px;
        }
      }
    }
    .btnFoot {
      text-align: center;
      margin-top: 10px;
      background: #e8effb;
      padding: 10px;
      p {
        font-weight: 600;
        font-size: 16px;
      }
    }
  }
}
</style>
<style lang="scss">
#batchCreation {
  .el-form-item__label {
    width: 96px;
  }
  .el-form-item__content {
    width: calc(100% - 96px);
  }
}
</style>
