<template>
  <div id="moveControlFile">
    <el-page-header content="编辑多维档案" @back="back"></el-page-header>
    <div class="main">
      <div>
        <p>布控对象:</p>
        <p>{{formObj.value}}({{formObj.type |bkdxType}})</p>
      </div>
      <el-collapse v-model="collapse">
        <el-collapse-item name="1">
          <template slot="title">
            <div class="top-t">
              <p class="title">
                <span>1</span>
                <span>实名制信息</span>
              </p>
            </div>
          </template>
          <el-row class="personInfo">
            <el-col :span="3">
              <img :src="imgUrl" alt="" height="100%" @error="imgerror($event)">
            </el-col>
            <el-col :span="5">
              <h3>{{formObj.multi.name}}</h3>
              <p>身份证号:<span>{{formObj.multi.certid}}</span></p>
              <p>民族:<span>{{formObj.multi.nation}}</span></p>
              <p>籍贯:<span>{{formObj.multi.jgcsd}}</span></p>
            </el-col>
            <el-col :span="6">
              <p>性别:
                <span>{{formObj.multi.sex}}</span>
              </p>
              <p>是否重点人员:
                <span>{{formObj.multi.sfzdry |sfgr}}</span>
                <a  v-if="formObj.multi.sfzdry" class="el-button el-button--text el-button--mini" :href="dimensionsUrl+'/workObject/workManagementDetail/'+formObj.multi.zdryId+'?name='+formObj.name" target="_blank">查看详情</a>
              </p>
              <p>是否僧尼:
                <span>{{formObj.multi.sfsr |sfgr}}</span>
                <a  v-if="formObj.multi.sfsr" class="el-button el-button--text el-button--mini" :href="dimensionsUrl+'/place-manage/faculty-detail/'+formObj.multi.jzryId+'?name='+formObj.name" target="_blank">查看详情</a>
              </p>
            </el-col>
            <el-col :span="10">
              <p>标签:</p>
              <div>
                <el-tag v-for="(item,index) in formObj.multi.mark" :key="index">#{{item}}</el-tag>
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <div class="top-t">
              <p class="title">
                <span>2</span>
                <span>手机号</span>
              </p>
            </div>
          </template>
          <div>
            <span class="el-tag el-tag--light" v-for="(item,index) in phoneList" :key="index">
                <el-checkbox-group v-model="basicInfo.sjh">
                  <el-checkbox :label="item.value"></el-checkbox>
                </el-checkbox-group>
                <i v-if="item.isDel" class="el-tag__close el-icon-close" @click="remove(phoneList,index,'sjh')"></i>
            </span>
           </div>
          <div class="tagBtnBox">
            <el-button type="primary" size="mini" @click="openTagDialog('手机号')"><i  class="el-icon-plus"></i>添加手机号</el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <div class="top-t">
              <p class="title">
                <span>3</span>
                <span>车牌车辆</span>
              </p>
            </div>
          </template>
          <div>
            <span class="el-tag el-tag--light" v-for="(item,index) in carList" :key="index">
              <el-checkbox-group v-model="basicInfo.cph">
                  <el-checkbox :label="item.value"></el-checkbox>
              </el-checkbox-group>
              <i v-if="item.isDel" class="el-tag__close el-icon-close" @click="remove(carList,index,'cph')"></i>
            </span>
           </div>
          <div class="tagBtnBox">
            <el-button type="primary" size="mini" @click="openTagDialog('车辆')"><i class="el-icon-plus"></i>添加车辆</el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            <div class="top-t">
              <p class="title">
                <span>4</span>
                <span>MAC地址</span>
              </p>
            </div>
          </template>
          <div>
            <span class="el-tag el-tag--light" v-for="(item,index) in macList" :key="index">
              <el-checkbox-group v-model="basicInfo.mac">
                <el-checkbox :label="item.value"></el-checkbox>
              </el-checkbox-group>
              <i v-if="item.isDel" class="el-tag__close el-icon-close" @click="remove(macList,index,'mac')"></i>
            </span>
           </div>
          <div class="tagBtnBox">
            <el-button type="primary" size="mini" @click="openTagDialog('MAC地址')"><i class="el-icon-plus"></i>添加MAC地址</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="btnBox">
        <el-button size="mini" type="primary" @click="save">布控</el-button>
        <el-button size="mini" type="primary" plain @click="back">返回</el-button>
      </div>
    </div>
    <el-dialog width="450px" :visible.sync="addTagDialog" @closed="tagDialogClose()">
      <div slot="title">
        <span class="el-dialog__title">添加{{TagDialogTitle}}</span>
      </div>
      <el-form>
        <el-form-item>
          <el-input :placeholder="'请输入'+TagDialogTitle" v-model="newTag.value"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" size="mini" @click="addTag()">确认</el-button>
        <el-button type="primary" size="mini" plain @click="addTagDialog=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getmoveControlFile,
  getBasicInfo,
  editControlFile,
  getPersonImg
} from "../../znbk/api/znbkServiceApi";

export default {
  data() {
    return {
      dimensionsUrl: "http://80.205.2.124:8087", //多维档案ip端口（华云207对应环境）
      addTagDialog: false,
      TagDialogTitle: "",
      collapse: ["1", "2", "3", "4"],
      formObj: {
        multi: {
          certid: "",
          cph: [],
          jgcsd: "",
          mac: [],
          mark: "",
          name: "",
          nation: "",
          sex: "",
          sfsr: "",
          sjh: [],
          type: ""
        },
        sfgr: true,
        type: "",
        value: ""
      },
      basicInfo: {
        cph: [],
        mac: [],
        sjh: []
      },
      phoneList: [],
      carList: [],
      macList: [],
      newTag: {
        value: "",
        isDel: true
      },
      imgUrl: "/static/znbk/img/default-Per.png"
    };
  },
  mounted() {
    this.formObj.type = this.$route.query.type;
    this.formObj.value = this.$route.query.value;
    this.getmoveControlFile();
  },
  methods: {
    // 获取详情
    async getBasicInfo() {
      this.basicInfo = await getBasicInfo(this.$route.query.id);
      let sjhflag = true;
      let cphflag = true;
      let macflag = true;

      this.basicInfo.sjh.map(item => {
        sjhflag = true;
        this.formObj.multi.sjh.map(items => {
          if (item == items) {
            sjhflag = false;
          }
        });
        if (sjhflag) {
          this.phoneList.push({ value: item, isDel: true });
        }
      });
      this.basicInfo.cph.map(item => {
        cphflag = true;
        this.formObj.multi.cph.map(items => {
          if (item == items) {
            cphflag = false;
          }
        });
        if (cphflag) {
          this.carList.push({ value: item, isDel: true });
        }
      });
      this.basicInfo.mac.map(item => {
        macflag = true;
        this.formObj.multi.mac.map(items => {
          if (item == items) {
            macflag = false;
          }
        });
        if (macflag) {
          this.macList.push({ value: item, isDel: true });
        }
      });
    },
    // 获取多维档案
    async getmoveControlFile() {
      let metadata = {};
      metadata.type = this.formObj.type;
      metadata.value = this.formObj.value;
      let moveControlFile = await getmoveControlFile(metadata);
      this.formObj.multi = moveControlFile;

      moveControlFile.sjh.map(item => {
        this.phoneList.push({ value: item, isDel: false });
      });
      moveControlFile.cph.map(item => {
        this.carList.push({ value: item, isDel: false });
      });
      moveControlFile.mac.map(item => {
        this.macList.push({ value: item, isDel: false });
      });

      this.getPersonImg(this.formObj.multi.certid);
      if (this.$route.query.id) {
        this.getBasicInfo();
      }
    },
    // 获取头像
    async getPersonImg(certid) {
      this.imgUrl = await getPersonImg(certid);
    },
    // 开启弹窗
    openTagDialog(title) {
      this.TagDialogTitle = title;
      this.addTagDialog = true;
    },
    // 添加手机号，车辆，MAC地址
    addTag() {
      if (this.TagDialogTitle == "手机号") {
        this.phoneList.push(this.newTag);
      } else if (this.TagDialogTitle == "车辆") {
        this.carList.push(this.newTag);
      } else if (this.TagDialogTitle == "MAC地址") {
        this.macList.push(this.newTag);
      }
      this.addTagDialog = false;
    },
    // 关闭弹窗
    tagDialogClose() {
      this.newTag = {
        value: "",
        isDel: true
      };
      this.TagDialogTitle = "";
    },
    // 删除添加的手机号，车辆，MAC地址
    remove(item, index, type) {
      if (this.basicInfo[type].indexOf(item[index].value) != -1) {
        this.basicInfo[type].splice(
          this.basicInfo[type].indexOf(item[index].value),
          1
        );
      }
      item.splice(index, 1);
    },
    // 返回
    back() {
      this.$router.push({
        name: "布控档案列表"
      });
    },
    // 保存布控
    async save() {
      let editObj = {};
      editObj.sjh = this.basicInfo.sjh;
      editObj.cph = this.basicInfo.cph;
      editObj.mac = this.basicInfo.mac;
      let addTrue = await editControlFile(editObj, this.basicInfo.oid);
      console.log(addTrue);
      if (addTrue == 200) {
        this.$message({
          type: "success",
          message: "修改成功！"
        });
        this.$router.push({
          name: "布控档案列表"
        });
      } else {
        this.$message.error("修改失败！");
      }
    },
    imgerror(event) {
      event.srcElement.src = "/static/znbk/img/default-Per.png";
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
    }
  }
};
</script>
<style lang="scss" scoped>
#moveControlFile {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  .main {
    padding: 20px;
  }
  .main > div:nth-child(1) {
    padding: 5px 10px;
    background: #e8effb;
  }
  .top-t {
    display: flex;
    justify-content: space-between;
    .title {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      cursor: auto;
      span {
        display: inline-block;
        &:nth-child(1) {
          background: #409eff;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          margin-right: 10px;
          color: #fff;
          border-radius: 50%;
        }
      }
    }
    .add {
      font-size: 34px;
      color: #409eff;
      margin-right: 30px;
      margin-top: -4px;
    }
  }
  .personInfo {
    height: 145px;
    .el-col-3 {
      height: 100%;
      text-align: center;
    }
    .el-col-5 {
      span {
        margin-left: 10px;
      }
    }
    .el-col-6,
    .el-col-10 {
      padding-top: 34px;
      span {
        margin-left: 10px;
        margin-right: 5px;
      }
      .el-tag {
        margin-bottom: 5px;
      }
    }
  }
  .el-tag {
    margin-left: 10px;
    .el-checkbox-group {
      display: inline-block;
    }
    .el-checkbox {
      margin-right: 5px;
    }
  }
  .tagBtnBox {
    margin-top: 10px;
    padding-left: 10px;
  }
  .btnBox {
    margin-top: 10px;
    text-align: center;
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



