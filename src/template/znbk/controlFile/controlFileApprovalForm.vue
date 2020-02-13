<template>
  <div id="controlFileRequisition">
    <el-page-header content="布控申请单" @back="back"></el-page-header>
    <el-row>
      <el-col :span="18">
        <el-form >
          <el-row>
            <el-col :span="8">
              <el-form-item label="申请人">
                {{user.name}}
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="申请人联系方式">
                {{user.phoneno}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请单位">
                <SelectTree 
                  :options="select.dept"
                  :value="formObj.orgId"
                  :clearable="true"
                  :accordion="false"
                  :search='true'
                  ref="child1"
                  @getValue="selectDept($event)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="布控时间">
                  <el-date-picker size="mini" v-model="formObj.startDate" type="date" value-format="timestamp"></el-date-picker>-
                  <el-date-picker size="mini" v-model="formObj.endDate" type="date" value-format="timestamp"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="!isZj">
              <el-form-item label="第一审批人">
                <el-autocomplete v-model=" depetApproveUserId" :fetch-suggestions="getUserListByName" @select="handleSelectdepetApproveUserId" size="mini"></el-autocomplete>
                 <span style="font-size: 14px;color: #868484;vertical-align: text-top;">注（第一审批人一般为部门领导审批）</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="!isZj">
              <el-form-item label="第二审批人">
                <el-autocomplete v-model="branchApproveUserId" :fetch-suggestions="getUserListByName" @select="handleSelectbranchApproveUserId" size="mini"></el-autocomplete>
                 <span style="font-size: 14px;color: #868484;vertical-align: text-top;">注（第一审批人一般为分管领导审批）</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="!isZj">
              <el-form-item label="第三审批人">
                <el-autocomplete v-model="kexinApproveUserId" :fetch-suggestions="getUserListByName" @select="handleSelectkexinApproveUserId" size="mini"></el-autocomplete>
                 <span style="font-size: 14px;color: #868484;vertical-align: text-top;">注（第一审批人一般为情指中心审批）</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="isZj">
              <el-form-item label="第一审批人">
                <el-autocomplete v-model="kexinApproveUserId" :fetch-suggestions="getUserListByName" @select="handleSelectkexinApproveUserId" size="mini"></el-autocomplete>
                 <span style="font-size: 14px;color: #868484;vertical-align: text-top;">注（第一审批人一般为情指中心审批）</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="申请手续">
                  <el-upload class="upload-demo" 
                    action="/ga-infrastructure-api/ga-infrastructure-api/api/v1/files/" 
                    :on-remove="handleRemove" 
                    :on-success="handleSuccess"
                    :file-list="fileList"
                  >
                    <el-button type="primary" size="mini">上传文件</el-button>
                  </el-upload>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="布控等级">
                <el-select size="mini">
                  <el-option label="全部" value="全部" v-model="formObj.level"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item label="布控事由">
                <el-input type="textarea" v-model="formObj.reason"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="处置措施">
                <el-input type="textarea" v-model="formObj.measure"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="24">
        <h3>布控档案列表</h3>
        <el-table :data="tableList" size="mini">
          <el-table-column label="布控类型">
              <template slot-scope="scope">
                {{scope.row.bkdxType |bkdxType}}
            </template> 
          </el-table-column>
          <el-table-column label="布控名称" prop="bkdxValue"></el-table-column>
          <el-table-column label="预警接收人数" prop="bkdxValue">
              <template slot-scope="scope">
                  <el-button  size="mini" type="text" @click="viewYjPesron(scope.row)">{{scope.row.yjArr.length}}</el-button>
              </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button  size="mini" type="text" @click="addYjPesron(scope.row,scope.$index)">添加预警接收人</el-button>
                <el-button  size="mini" type="text" @click="del(scope.row.oid,scope.$index)">删除</el-button>
            </template> 
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" style="margin-top:20px">
        <el-button size="mini" type="primary" @click="save">提交</el-button>
        <el-button size="mini" type="primary" plain>取消</el-button>
      </el-col>
    </el-row>
    <el-dialog width="450px" :visible.sync="addYjPesronFlag" @closed="addYjPesronClose()">
      <div slot="title">
        <span class="el-dialog__title">添加预警接收人</span>
      </div>
      <el-form>
        <el-form-item>
            <el-autocomplete v-model="yjPesron.name" :fetch-suggestions="getUserListByName" @select="handleSelect" size="mini"></el-autocomplete>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" size="mini" @click="saveYjPesron()">确认</el-button>
        <el-button type="primary" size="mini" plain @click="addYjPesronFlag=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog width="450px" :visible.sync="viewYjPesronFlag">
      <div slot="title">
        <span class="el-dialog__title">查看预警接收人</span>
      </div>
      <el-table :data="viewPerson" size="mini">
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button  size="mini" type="text" @click="delYj(scope.row,scope.$index)">删除</el-button>
            </template> 
          </el-table-column>
        </el-table>
      <div class="dialog-footer" slot="footer">
          <el-button size="mini" type="primary" @click="viewYjPesronFlag=false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SelectTree from "@/template/common/selectTree";
import {
  batchGetControlFile,
  getDept,
  addApprovalForm,
  getPolice,
  getYjPerson,
  getIsZhouju
} from "../../znbk/api/znbkServiceApi";
export default {
  data() {
    return {
      metadata: {
        filter: { orgId: "" }
      },
      formObj: {
        bkdaIds: [],
        endDate: "",
        measure: "",
        orgId: "",
        procedureFileId: "",
        reason: "",
        startDate: "",
        userId: "",
        userTel: "",
        userName: "",
        branchApproveUserId: "",
        depetApproveUserId: "",
        kexinApproveUserId: ""
      },
      branchApproveUserId: "",
      depetApproveUserId: "",
      kexinApproveUserId: "",
      yjPesron: {
        name: "",
        userId: ""
      },
      viewPerson: [],
      user: {},
      tableList: [],
      select: {
        dept: []
      },
      fileList: [],
      addYjPesronFlag: false,
      viewYjPesronFlag: false,
      isZj: false
    };
  },
  components: { SelectTree },
  mounted() {
    this.getTableList();
    this.getSelect();
    this.getUser();
    this.getIsZhouju();
  },
  methods: {
    // 获取档案预警人员
    getYjPerson() {
      let table = [];
      this.tableList.map(item => {
        table.push(item.oid);
      });
      getYjPerson(table).then(res => {
        this.tableList.map(items => {
          res.map(item => {
            if (items.oid == item.bkdaId && item.userId) {
              items.yjArr.push(item);
            }
          });
        });
      });
      this.tableList = JSON.parse(JSON.stringify(this.tableList));
    },
    async getIsZhouju() {
      let d = await getIsZhouju();
      this.isZj = d;
    },
    //实时获取模糊匹配结果
    async getUserListByName(queryString, cb) {
      if (queryString) {
        let data = {
          metadata: {
            paginationParam: { page: 0, pageSize: 1000 },
            filter: { name: queryString }
          }
        };
        let d = await getPolice(data);
        cb(this.searchDataTrans(d));
      } else {
        cb([]);
      }
    },
    //将获取到的结果转换成需要的格式
    searchDataTrans(data) {
      let d = data.map(n => {
        return {
          value:
            n.upmsUserAttribute.name +
            " (" +
            n.upmsUserAttribute.department.orgshortname +
            ")",
          name: n.upmsUserAttribute.name,
          userId: n.id
        };
      });
      return d;
    },
    //获取选中的值
    handleSelect(o) {
      if (o) {
        this.yjPesron.name = o.name;
        this.yjPesron.userId = o.userId;
      }
    },
    // 获取选中的审批人
    handleSelectbranchApproveUserId(o) {
      if (o) {
        this.formObj.branchApproveUserId = o.userId;
      }
    },
    // 获取选中的审批人
    handleSelectdepetApproveUserId(o) {
      if (o) {
        this.formObj.depetApproveUserId = o.userId;
      }
    },
    // 获取选中的审批人
    handleSelectkexinApproveUserId(o) {
      if (o) {
        this.formObj.kexinApproveUserId = o.userId;
      }
    },
    // 获取当前用户
    getUser() {
      this.user = JSON.parse(sessionStorage.getItem("user") || "{}");
      this.formObj.userId = this.user.keycloakUserId;
      this.formObj.orgId = this.user.orgid;
      this.formObj.userTel = this.user.phoneno;
      this.formObj.userName = this.user.name;
    },
    // 获取下拉框
    async getSelect() {
      this.select.dept = await getDept();
    },
    // 获取表格
    async getTableList() {
      let idArr = this.$route.query.ids.split(",");
      this.formObj.bkdaIds = idArr;
      this.tableList = await batchGetControlFile(idArr);
      this.tableList.map(items => {
        items.yjArr = [];
      });
      this.getYjPerson();
    },
    // 文件上传成功
    handleSuccess(response, file, fileList) {
      let fileArr = [];
      fileList.map(item => {
        fileArr.push(item.response.data.oid);
      });
      this.formObj.procedureFileId = fileArr.join(",");
    },
    // 文件上传删除
    handleRemove(file, fileList) {
      let fileArr = [];
      fileList.map(item => {
        fileArr.push(item.response.data.oid);
      });
      this.formObj.procedureFileId = fileArr.join(",");
    },
    //选择所属单位
    selectDept(id) {
      this.formObj.orgId = id;
    },
    // 删除布控人列表
    del(id, index) {
      this.$confirm("确认移除？")
        .then(() => {
          this.tableList.splice(index, 1);
          this.formObj.bkdaIds.splice(index, 1);
        })
        .catch(() => {});
    },
    // 提交
    async save() {
      if (!this.formObj.startDate) {
        this.$message.warning("请填写布控开始时间");
      } else if (!this.formObj.endDate) {
        this.$message.warning("请填写布控结束时间");
      } else if (
        new Date(this.formObj.startDate).getTime() >=
        new Date(this.formObj.endDate).getTime()
      ) {
        this.$message.warning("请填写布控开始不能大于结束时间");
      } else if (!this.formObj.kexinApproveUserId && this.isZj) {
        this.$message.warning("未写第一审批人或未选中第一审批人");
      } else if (!this.formObj.depetApproveUserId && !this.isZj) {
        this.$message.warning("未写第一审批人或未选中第一审批人");
      } else if (!this.formObj.branchApproveUserId && !this.isZj) {
        this.$message.warning("未写第二审批人或未选中第二审批人");
      } else if (!this.formObj.kexinApproveUserId && !this.isZj) {
        this.$message.warning("未写第三审批人或未选中第三审批人");
      } else {
        this.formObj.bkdaInfos = [];
        this.tableList.map(items => {
          let newYujiArr = [];
          items.yjArr.map(item => {
            newYujiArr.push(item.userId);
          });
          let yjObj = {};
          if (items.yjArr.length > 0) {
            yjObj.bkdaId = items.yjArr[0].bkdaId;
            yjObj.rcvUser = newYujiArr.join(",");
            this.formObj.bkdaInfos.push(yjObj);
          }
        });
        if (this.formObj.bkdaIds.length == this.formObj.bkdaInfos.length) {
          let saveflag = await addApprovalForm(this.formObj);
          if (saveflag == 200) {
            this.$message({
              type: "success",
              message: "布控成功！"
            });
            this.$router.push({
              name: "布控档案列表"
            });
          } else {
            this.$message.error("布控失败！");
          }
        } else {
          this.$message.warning("每个布控档案至少有一个预警接收人");
        }
      }
    },
    // 返回
    back() {
      this.$router.push({
        name: "布控档案列表"
      });
    },
    // 添加预警接收人
    addYjPesron(row, index) {
      this.addYjPesronFlag = true;
      this.yjPesron.index = index;
      this.yjPesron.bkdaId = row.oid;
    },
    // 保存预警接收人
    saveYjPesron() {
      if (this.yjPesron.userId) {
        let yjArr = {};
        yjArr.bkdaId = this.yjPesron.bkdaId;
        yjArr.name = this.yjPesron.name;
        yjArr.userId = this.yjPesron.userId;
        this.tableList[this.yjPesron.index].yjArr.push(yjArr);
        this.addYjPesronFlag = false;
      } else {
        this.$message.warning("该民警不存在请重新输入或未点击民警姓名提取");
      }
    },
    // 关闭预警接收人
    addYjPesronClose() {
      this.yjPesron = {};
    },
    // 查看预警民警
    viewYjPesron(row) {
      this.viewPerson = row.yjArr;
      this.viewYjPesronFlag = true;
    },
    // 删除预警民警
    delYj(row, index) {
      this.tableList.map(item => {
        if (item.oid == row.bkdaId) {
          item.yjArr.splice(index, 1);
        }
      });
    }
  },
  filters: {
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
    }
  }
};
</script>
<style lang="scss" scoped>
#controlFileRequisition > .el-row {
  padding: 30px;
  .el-textarea {
    width: 80%;
  }
  //   .yjPerson {
  //     .el-input {
  //       width: 13.414286rem;
  //     }
  //   }
}
#controlFileRequisition {
  .el-dialog__wrapper {
    .el-autocomplete {
      position: relative;
      display: block;
    }
  }
}
</style>
<style lang="scss">
.el-dialog__header {
  background: #409eff;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
}
</style>