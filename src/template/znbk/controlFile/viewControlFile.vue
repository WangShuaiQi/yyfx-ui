<template>
  <div id="moveControlFile">
    <el-page-header content="查看多维档案" @back="back"></el-page-header>
    <div class="main">
      <h3>基本信息</h3>
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
              <img :src="imgUrl" alt="" height="100%"  @error="imgerror($event)">
            </el-col>
            <el-col :span="5">
              <h3>{{formObj.name}}</h3>
              <p>身份证号:<span>{{formObj.certid}}</span></p>
              <p>民族:<span>{{formObj.nation}}</span> </p>
              <p>籍贯:<span>{{formObj.jgcsd}}</span> </p>
            </el-col>
            <el-col :span="6">
              <p>性别:
                <span>{{formObj.sex}}</span>
              </p>
              <p>是否重点人员:
                <span>{{formObj.sfzdry |sfgr}}</span>
                <a  v-if="formObj.sfzdry" class="el-button el-button--text el-button--mini" :href="dimensionsUrl+'/workObject/workManagementDetail/'+moveControlFile.zdryId+'?name='+formObj.name" target="_blank">查看详情</a>
              </p>
              <p>是否僧尼:
                <span>{{formObj.sfsr |sfgr}}</span>
                <a  v-if="formObj.sfsr" class="el-button el-button--text el-button--mini" :href="dimensionsUrl+'/place-manage/faculty-detail/'+moveControlFile.jzryId+'?name='+formObj.name" target="_blank">查看详情</a>
              </p>
            </el-col>
            <el-col :span="10">
              <p>标签:</p>
              <div>
                <el-tag v-for="(item,index) in formObj.mark" :key="index">#{{item}}</el-tag>
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
            <span class="el-tag el-tag--light" v-for="(item,index) in formObj.sjh" :key="index">{{item}}</span>
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
            <span class="el-tag el-tag--light" v-for="(item,index) in formObj.cph" :key="index">{{item}}</span>
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
            <span class="el-tag el-tag--light" v-for="(item,index) in formObj.mac" :key="index">{{item}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
      <h3>审批历史</h3>
      <el-table :data="bckList" size="mini">
         <el-table-column label="时间" width="200">
             <template slot-scope="scope">
                 {{scope.row.appkyCreatTime | formatTime}}
             </template>
         </el-table-column>
         <el-table-column label="状态" width="150">
             <template slot-scope="scope">
                 {{scope.row.type | getSelectOption(status,"statusValue","statusName")}}
             </template>
         </el-table-column>
         <el-table-column label="申请单信息">
           <template slot-scope="scope">
              <div class="item">
               <span class="key">单位:</span>
               <span class="val">{{scope.row.applyInfo.orgName}}</span>
              </div>
              <div class="item">
               <span class="key">申请人:</span>
               <span class="val">{{scope.row.applyInfo.applyUserName}}</span>
              </div>
              <div class="item">
               <span class="key">申请人联系方式:</span>
               <span class="val">{{scope.row.applyInfo.applyUserTel}}</span>
              </div>
              <div class="item">
               <span class="key">事由:</span>
               <span class="val">{{scope.row.applyInfo.applyReson}}</span>
              </div>
              <div class="item">
               <span class="key">手续:</span>
               <span class="val">
                   <a v-for="(items,index) in scope.row.applyInfo.file" :key="index"
                   style="display: block;"
                    :href="'/ga-infrastructure-api/ga-infrastructure-api/api/v1/files/'+items.id+'/types/undefined'" 
                    :download="'/ga-infrastructure-api/ga-infrastructure-api/api/v1/files/'+items.id+'/types/undefined'"
                    :title="items.fileName"
                   >
                    {{items.fileName}}
                   </a>
                </span>
              </div>
           </template>
         </el-table-column>
         <el-table-column label="审批信息">
           <template slot-scope="scope" v-if="scope.row.processOperationHistoryDTOS">
               <div v-for="(items,index) in scope.row.processOperationHistoryDTOS" :key="index" class="itemBox">
                    <div class="item">
                        <span class="key">第{{index+1}}审批人:</span>
                        <span class="val">{{items.operator}}</span>
                    </div>
                    <div class="item">
                        <span class="key">审批时间:</span>
                        <span class="val">{{items.operateTime| formatTime}}</span>
                    </div>
                    <div class="item">
                        <span class="key">审批意见:</span>
                        <span class="val">{{items.comment}}</span>
                    </div>
                    <div class="item">
                        <span class="key">审批结果:</span>
                        <span class="val">{{items.approveResult}}</span>
                    </div>
               </div>
           </template>
         </el-table-column>
       </el-table>
      <h3>预警信息
          <el-button style="float:right" @click="dialogFlag=true" size="mini" type="primary">预警上图</el-button>
      </h3>
       <el-table :data="yjList" size="mini">
         <el-table-column label="序号" type="index" width="55"></el-table-column>
         <el-table-column label="预警时间" prop="warnDate"></el-table-column>
         <el-table-column label="活动时间" prop="activityDate"></el-table-column>
         <el-table-column label="活动区划" :show-overflow-tooltip="true" prop="activityZone"></el-table-column>
         <el-table-column label="活动场所" :show-overflow-tooltip="true" prop="activityPlace"></el-table-column>
         <el-table-column label="活动详情" :show-overflow-tooltip="true" prop="activityDetails"></el-table-column>
       </el-table>
       <el-pagination 
          :current-page="metadata.page"
          :page-size="metadata.pageSize"
          :total="metadata.totalCount"
          @current-change="currentChange"
          layout="total,prev,pager,next,jumper" ></el-pagination>
    </div>
    <div class="btnBox">
      <!-- <el-button v-if="formObj.bkStatus=='CXSPZ'" size="mini" type="primary" @click="controlFileRequisition(formObj.oid)">续控</el-button> -->
      <el-button v-if="formObj.bkStatus=='BKZ'" size="mini" type="primary"  @click="cancel(formObj.oid)" plain>撤控</el-button>
    </div>
    <el-dialog width="90%" top="3%" :visible.sync="dialogFlag" @opened="dialogOpend" @closed="dialogclose" title="预警上图">
        <div id="pgis-demo-map" ref="initialMap" v-loading="loading" element-loading-text="地图加载中...." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0,0.5)"></div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getmoveControlFile,
  getBasicInfo,
  getPersonImg,
  getBasicBcks,
  getFileInfo,
  getWarnning,
  getZnbkStatus
} from "../../znbk/api/znbkServiceApi";
import moment from "moment";
import PgisInit from "../../../components/pgis/PgisInit";

export default {
  data() {
    return {
      formObj: {},
      imgUrl: "/static/znbk/img/default-Per.png",
      collapse: ["1", "2", "3", "4", "5"],
      dimensionsUrl: "http://80.205.2.124:8087", //多维档案ip端口（华云207对应环境）
      moveControlFile: {},
      bckList: [],
      yjList: [],
      status: [
        {
          statusName: "布控",
          statusValue: "bk"
        },
        {
          statusName: "续控",
          statusValue: "xk"
        },
        {
          statusName: "撤控",
          statusValue: "ck"
        }
      ],
      dialogFlag: false,
      loading: false,
      mapInstance: null,
      mapData: [],
      metadata: {
        page: 1,
        pageSize: 10,
        totalCount: 0
      }
    };
  },
  async mounted() {
    await PgisInit.loadScript();
    this.getBasicInfo();
    this.getBasicBcks();
    this.getWarnning();
    this.getmapData();
  },
  methods: {
    // 获取详情
    async getBasicInfo() {
      this.formObj = await getBasicInfo(this.$route.params.id);
      this.getPersonImg(this.formObj.certid);
      if (this.$route.query.sfgr) {
        this.getmoveControlFile();
      }
    },
    async getmoveControlFile() {
      let metadata = {};
      metadata.type = "SFZH";
      if (this.formObj.certid) {
        metadata.value = this.formObj.certid;
      } else {
        metadata.value = this.$route.query.val;
      }
      this.moveControlFile = await getmoveControlFile(metadata);
      this.formObj.name = this.moveControlFile.name;
      this.formObj.certid = this.moveControlFile.certid;
      this.formObj.nation = this.moveControlFile.nation;
      this.formObj.sex = this.moveControlFile.sex;
      this.formObj.jgcsd = this.moveControlFile.jgcsd;
      this.formObj.mark = this.moveControlFile.mark;
      this.formObj.sfzdry = this.moveControlFile.sfzdry;
      this.formObj.sfgr = this.moveControlFile.sfgr;
      if (this.$route.query.type == "SFZH") {
        this.formObj.mac = this.moveControlFile.mac;
        this.formObj.sjh = this.moveControlFile.sjh;
        this.formObj.cph = this.moveControlFile.cph;
      }
      this.getPersonImg(this.formObj.certid);
    },
    async getBasicBcks() {
      let bckList = [];
      bckList = await getBasicBcks(this.$route.params.id);
      bckList.forEach(M => {
        M.applyInfo.fileIdArr = [];
        M.applyInfo.file = [];
        if (M.applyInfo.fileId) {
          M.applyInfo.fileIdArr = M.applyInfo.fileId.split(",");
        }
        M.applyInfo.fileIdArr.map(item => {
          getFileInfo(item).then(res => {
            let fileObj = {};
            fileObj.id = item;
            fileObj.fileName = res;
            this.$set(M.applyInfo, "fileName", res);
            M.applyInfo.file.push(fileObj);
          });
        });
        //   if (M.applyInfo.fileId) {
        //     let fileName = "";
        //     getFileInfo(M.applyInfo.fileId).then(res => {
        //       this.$set(M.applyInfo, "fileName", res);
        //     });
        //   } else {
        //     this.$set(M.applyInfo, "fileName", "");
        //   }
      });
      this.bckList = bckList;
      console.log(this.bckList, "111");
    },
    async getWarnning() {
      let yj = await getWarnning(this.$route.params.id, this.metadata);
      this.yjList = yj.lists;
      this.metadata.totalCount = yj.totalCount;
    },
    async getmapData() {
      let mapMetadata = {
        page: 1,
        pageSize: 100
      };
      let mapData = await getWarnning(this.$route.params.id, mapMetadata);
      this.mapData = mapData.lists;
    },
    currentChange(value) {
      this.metadata.page = value;
      this.getWarnning();
    },
    getFileName() {},
    // 获取头像
    async getPersonImg(certid) {
      this.imgUrl = await getPersonImg(certid);
    },
    back() {
      this.$router.push({
        name: "布控档案列表"
      });
    },
    // 发起布控
    controlFileRequisition(id) {
      //   this.$router.push({
      //     name: "发起续控",
      //     query: {
      //       ids: id
      //     }
      //   });
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
    imgerror(event) {
      event.srcElement.src = "/static/znbk/img/default-Per.png";
    },
    dialogOpend() {
      if (!this.mapInstance) {
        this.mapInstance = new PgisMapApp().loadMap("pgis-demo-map");
      }
      this.mapData.map((item, i) => {
        let html = `<div class="mapPersonBox">
                        <div class="mapCode${item.wrCode}">${item.wrTitle}</div>
                        <div>
                            <p>${item.activityDate}</p>
                            <p title="${item.activityPlace}">${
          item.activityPlace
        }</p>
                        </div>
                    </div>`;
        var marker = this.mapInstance.appMap.addOverlayPoint(
          "Coun" + i,
          item.jd,
          item.wd,
          "",
          html,
          "",
          false,
          "",
          false,
          "",
          {},
          false,
          "",
          {},
          "",
          {
            imgUrl: `/static/znbk/img/map/mapCode${item.wrCode}.png`,
            width: 25,
            height: 30
          }
        );
        marker.addListener("click", () => {});
      });
    },
    clearMap() {
      this.mapInstance.appMap.removeAllOverlay();
    },
    dialogclose() {
      this.clearMap();
    }
  },
  beforeDestroy() {
    this.mapInstance = null;
    $("#pgis-demo-map").remove();
  },
  filters: {
    sfgr(v) {
      if (v == true) {
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
        time = moment(v).format("YYYY-MM-DD HH:mm:ss");
        return time;
      } else {
        return "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#moveControlFile {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  h3 {
    margin: 5px 0;
  }
  .main {
    padding: 20px;
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
    .el-checkbox {
      margin-right: 5px;
    }
  }
  .tagBtnBox {
    margin-top: 10px;
    padding-left: 10px;
  }
  .itemBox + .itemBox {
    border-top: 1px solid #ebeef5;
  }
  .item {
    text-align: left;
  }
  .key {
    float: left;
    display: inline-block;
    text-align: left;
    color: #666;
    margin-right: 15px;
  }
  .val {
    display: inline-block;
    min-height: 17px;
    min-width: 17px;
  }
  .value {
    display: inline-block;
    width: calc(100% - 135px);
    color: #323232;
    word-wrap: break-word;
  }
  .btnBox {
    text-align: center;
  }
}
#pgis-demo-map {
  height: 600px;
  background-color: #08304b;
}
</style>
<style lang="scss">
#moveControlFile {
  .mapPersonBox {
    background: url("/static/znbk/img/map/policeDlgBg.png");
    background-size: 100% 100%;
    height: 70px;
    width: 350px;
    padding: 5px;
    div:first-child {
      height: 100%;
      width: 70px;
      background-color: #2780a6;
      line-height: 90px;
      text-align: center;
      color: #fff;
      display: inline-block;
      background-repeat: no-repeat;
      background-position: center 10px;
      background-size: 28px;
      float: left;
    }
    div:last-child {
      width: calc(100% - 70px);
      display: inline-block;
      color: #fff;
      padding: 5px;
    }
    p {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    div.mapCode1 {
      background-image: url("/static/znbk/img/map/mapCode1-white.png");
    }
    div.mapCode2 {
      background-image: url("/static/znbk/img/map/mapCode2-white.png");
    }
    div.mapCode3 {
      background-image: url("/static/znbk/img/map/mapCode3-white.png");
    }
    div.mapCode4 {
      background-image: url("/static/znbk/img/map/mapCode4-white.png");
    }
    div.mapCode5 {
      background-image: url("/static/znbk/img/map/mapCode5-white.png");
    }
    div.mapCode6 {
      background-image: url("/static/znbk/img/map/mapCode6-white.png");
    }
    div.mapCode7 {
      background-image: url("/static/znbk/img/map/mapCode7-white.png");
    }
    div.mapCode8 {
      background-image: url("/static/znbk/img/map/mapCode8-white.png");
    }
    div.mapCode9 {
      background-image: url("/static/znbk/img/map/mapCode9-white.png");
    }
    div.mapCode10 {
      background-image: url("/static/znbk/img/map/mapCode10-white.png");
    }
    div.mapCode15 {
      background-image: url("/static/znbk/img/map/mapCode15-white.png");
    }
  }
  .el-dialog__body {
    padding: 0px;
  }
  .el-dialog__header {
    background: #409eff;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
  .el-table__body,
  .el-table__footer,
  .el-table__header {
    table-layout: auto;
    border-collapse: separate;
  }
}
</style>



