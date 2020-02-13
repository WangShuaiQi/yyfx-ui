<template>
  <div id="controlFileRequisition">
    <el-page-header content="撤控申请单" @back="back"></el-page-header>
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
                  size="mini"
                  @getValue="selectDept($event)"
                />
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
              <el-form-item label="撤控事由">
                <el-input type="textarea" v-model="formObj.reason" size="mini"></el-input>
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
          <el-table-column label="操作">
            <template slot-scope="scope">
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
  </div>
</template>
<script>
import SelectTree from "@/template/common/selectTree";
import {
  getBasicInfo,
  getDept,
  addApprovalFormCk,
  batchGetControlFile,
  getPolice,
  getIsZhouju
} from "../../znbk/api/znbkServiceApi";
export default {
  data() {
    return {
      metadata: {
        filter: { orgId: "" }
      },
      formObj: {
        orgId: "",
        reason: "",
        userId: "",
        userTel: "",
        branchApproveUserId: "",
        depetApproveUserId: "",
        kexinApproveUserId: ""
      },
      branchApproveUserId: "",
      depetApproveUserId: "",
      kexinApproveUserId: "",
      user: {},
      tableList: [],
      select: {
        dept: []
      },
      fileList: [],
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
    //   获取当前用户
    getUser() {
      this.user = JSON.parse(sessionStorage.getItem("user") || "{}");
      this.formObj.userId = this.user.keycloakUserId;
      this.formObj.orgId = this.user.orgid;
      this.formObj.userTel = this.user.phoneno;
    },
    // 获取下拉框
    async getSelect() {
      this.select.dept = await getDept();
    },
    // 获取表格
    async getTableList() {
      this.formObj.daIdList = [];
      let idArr = this.$route.query.ids.split(",");
      this.tableList = await batchGetControlFile(idArr);
      this.tableList.map(item => {
        let daIdObj = {};
        let rcvUserArr = [];
        daIdObj.startTime = item.bkStartTime;
        daIdObj.endTime = item.bkEndTime;
        daIdObj.daId = item.oid;
        item.yjjsmjList.map(items => {
          rcvUserArr.push(items.userId);
        });
        daIdObj.rcvUser = rcvUserArr.join(",");
        this.formObj.daIdList.push(daIdObj);
      });
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
          this.formObj.daIdList.splice(index, 1);
        })
        .catch(() => {});
    },
    // 提交
    async save() {
      let saveflag = await addApprovalFormCk(this.formObj);
      if (saveflag == 200) {
        this.$message({
          type: "success",
          message: "撤控成功！"
        });
        this.$router.push({
          name: "布控档案列表"
        });
      } else {
        this.$message.error("撤控失败！");
      }
    },
    // 返回
    back() {
      this.$router.push({
        name: "布控档案列表"
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
}
</style>
