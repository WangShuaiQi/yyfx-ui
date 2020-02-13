import moment from 'moment'

let globlePointId = 102;

export default {
    data: {
        jujiPointId: [],
        yuejiePointId: [],
        fuhuiPointId: [],
        jinjingPointId: [],
        keypersonPointId: []
    },
    protoTypeDemoApp() {
        if (!window.PgisMapApp) {
            return;
        }
        //覆盖之前的原型方法；
        PgisMapApp.prototype.addPointForMsg = function (id, x, y, imageId, msg, titleName, clickId, callback) {
            if (x == 0 || x == "" || x == undefined || x == null || y == 0 || y == "" || y == undefined || y == null) {
                return "请输入正确的经纬度";
            }
            this.porintAllArray.push(id);
            return this.appMap.addOverlayPoint(id, parseFloat(x), parseFloat(y),
                imageId, msg, titleName, false, "", false, callback, { height: "0.5rem" });
        }
    },
    getPointId() {
        globlePointId++;
        return globlePointId;
    },
    addJujiPoint(mapInstance, gis, groupName, time, addr, rule, count, callback) {
        time = moment(time).format('YYYY-MM-DD HH:mm:ss')
        let msg = '<div class="bl-card-gis">' +
            '<div class="bl-inner-gis">' +
            '<div class="bl-h-gis">聚集</div>' +
            '<div class="bl-c-gis">' +
            '<div class="bl-content-gis">' +
            '<div class="innl-gis">' +
            '<div class="prh">' +
            '<label>预警名称：</label><span>' + rule + '</span>' +
            '</div>' +
            '<div class="prh">' +
            '<label>聚集人数：</label><span>' + count +
            '人</span>' +
            '</div>' +
            '<div class="prh">' +
            '<label>聚集地点：</label><span>' + addr +
            '</span>' +
            '</div>' +
            '<div class="prh">' +
            '<label>预警趋势</label>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        let myMap = mapInstance;
        let pointid = this.getPointId();
        this.data.jujiPointId.push(pointid);
        msg = null; // 置为空不显示,预防后面要使用；
        let myMarker = mapInstance.addPointForMsg(pointid, gis[0], gis[1], "juji", msg, '', "juji-point" + pointid, () => {
            //定位到作战状态
            myMap.removePoliceThree();
            myMap.setCenter(gis[0], gis[1], 15);
            //这个聚集点警力附近加载，当前有一定bug，后面完善再添加
            //myMap.loadPoliceThree(gis[2]);
            if (typeof callback == 'function') {
                callback();
            }
        });
    },
    clearJujiPoint(mapInstance) {
        this.data.jujiPointId.forEach((id, i) => {

            mapInstance.removePoints(id);
        })
        this.data.jujiPointId = [];
    },

    addJinjingLine(mapInstance) {

    },
    //重点人
    addZDRYPoint(mapInstance) {
        let that = this;
        let myMap = mapInstance;
        myMap.addZDRY({ "ID": 2, 'MC': '康定县', 'JD': '101.99432373046875', 'WD': '30.03387451171875', 'count': '412' });
        myMap.addZDRY({ "ID": 3, 'MC': 'dd', 'JD': '104.19432373046875', 'WD': '30.66387451171875', 'count': '300' });
        myMap.addZDRY({ "ID": 2, 'MC': 'dd', 'JD': '104.19432373046875', 'WD': '30.66387451171875', 'count': '300' });

        (length => Array.from({ length }, (v, k) => k))(100).forEach(i => {
            myMap.addZDRY({ "ID": that.getPointId(), 'MC': 'dd', 'JD': 104.05432373046875 + (0.05 - (Math.random() / 10)), 'WD': 30.66387451171875 + (0.05 - (Math.random() / 10)), 'count': i * 2 });

        })
    },
    addYuejiePoint(crossPointList, mapInstance) {
        for (let i = 0; i < crossPointList.length; i++) {
            let x = crossPointList[i].split(",")[0];
            let y = crossPointList[i].split(",")[1];
            mapInstance.addPointForMsg('yuejieId' + i, x, y, "yuejie", '', '');
            this.data.yuejiePointId.push('yuejieId' + i);
        }
    },
    addFuhuiPoint(crossPointList, mapInstance) {
        for (let i = 0; i < crossPointList.length; i++) {
            let x = crossPointList[i].split(",")[0];
            let y = crossPointList[i].split(",")[1];
            mapInstance.addPointForMsg('fuhuiId' + i, x, y, "fuhui", '', '');
            this.data.fuhuiPointId.push('fuhuiId' + i);
        }
    },
    addJinjingPoint(crossPointList, mapInstance) {
        for (let i = 0; i < crossPointList.length; i++) {
            let x = crossPointList[i].split(",")[0];
            let y = crossPointList[i].split(",")[1];
            mapInstance.addPointForMsg('jinjingId' + i, x, y, "jinjing", '', '');
            this.data.jinjingPointId.push('jinjingId' + i);
        }
    },
    clearYuejiePoint(mapInstance) {
        this.data.yuejiePointId.forEach((id, i) => {

            mapInstance.removePoints(id);
        })
        this.data.yuejiePointId = [];
    },
    clearFuhuiPoint(mapInstance) {
        this.data.fuhuiPointId.forEach((id, i) => {

            mapInstance.removePoints(id);
        })
        this.data.fuhuiPointId = [];
    },
    clearJinjingPoint(mapInstance) {
        this.data.jinjingPointId.forEach((id, i) => {

            mapInstance.removePoints(id);
        })
        this.data.jinjingPointId = [];
    },

    //重点人员轨迹撒点
    addKeypersonPoint(keypersonArr, mapInstance, index) {
        let msg = "";
        if (keypersonArr.sjbh === "2") {//网吧
            msg = '<div class="bl-card-gis" style="height:15rem;">' +
                '<div class="bl-inner-gis">' +
                '<div class="bl-h-gis">上网</div>' +
                '<div class="bl-c-gis">' +
                '<div class="bl-content-gis">' +
                '<div class="innl-gis">' +
                '<div class="prh">' +
                '<label>姓名：</label><span>' + keypersonArr.swry_xm + '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>身份证号：</label><span>' + keypersonArr.gmsfhm +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>网吧名称：</label><span>' + keypersonArr.yycsmc +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>座位号：</label><span>' + keypersonArr.swzdh +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>行政区划：</label><span>' + keypersonArr.xzqh +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>上网时间：</label><span>' + keypersonArr.swkssj +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>下网时间：</label><span>' + keypersonArr.xwsj +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        } else if (keypersonArr.sjbh === "3") {//旅店
            msg = '<div class="bl-card-gis" style="height:15rem;">' +
                '<div class="bl-inner-gis">' +
                '<div class="bl-h-gis">旅店</div>' +
                '<div class="bl-c-gis">' +
                '<div class="bl-content-gis">' +
                '<div class="innl-gis">' +
                '<div class="prh">' +
                '<label>姓名：</label><span>' + keypersonArr.xm + '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>身份证号：</label><span>' + keypersonArr.gmsfhm +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>旅店名称：</label><span>' + keypersonArr.ldmc +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>房间号：</label><span>' + keypersonArr.rzfh +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>行政区划：</label><span>' + keypersonArr.xzqh +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>入住时间：</label><span>' + keypersonArr.rzsj +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>退房时间：</label><span>' + keypersonArr.tfrqsj +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        } else if (keypersonArr.sjbh === "1") {
            msg = '<div class="bl-card-gis" style="height:15rem;">' +
                '<div class="bl-inner-gis">' +
                '<div class="bl-h-gis">车辆卡口</div>' +
                '<div class="bl-c-gis">' +
                '<div class="bl-content-gis">' +
                '<div class="innl-gis">' +
                '<div class="prh">' +
                '<label>车牌号：</label><span>' + keypersonArr.cthphm +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>车牌颜色：</label><span>' + keypersonArr.hpys +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>卡口名称：</label><span>' + keypersonArr.kkmc +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>通过方向：</label><span>' + keypersonArr.fxmc +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>时间：</label><span>' + keypersonArr.gcsj +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        } else if (keypersonArr.sjbh === "4") {
            msg = '<div class="bl-card-gis" style="height:15rem;">' +
                '<div class="bl-inner-gis">' +
                '<div class="bl-h-gis">民航进港</div>' +
                '<div class="bl-c-gis">' +
                '<div class="bl-content-gis">' +
                '<div class="innl-gis">' +
                '<div class="prh">' +
                '<label>姓名：</label><span>' + keypersonArr.psr_chnname + '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>身份证号：</label><span>' + keypersonArr.cert_no +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>航班号：</label><span>' + keypersonArr.flt_airlcode + keypersonArr.flt_number +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>出发地：</label><span>' + keypersonArr.start +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>到达地：</label><span>' + keypersonArr.end +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>出发时间：</label><span>' + keypersonArr.sta_depttm +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        } else if (keypersonArr.sjbh === "7") {
            msg = '<div class="bl-card-gis" style="height:15rem;">' +
                '<div class="bl-inner-gis">' +
                '<div class="bl-h-gis">火车站进站</div>' +
                '<div class="bl-c-gis">' +
                '<div class="bl-content-gis">' +
                '<div class="innl-gis">' +
                '<div class="prh">' +
                '<label>姓名：</label><span>' + keypersonArr.xm + '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>身份证号：</label><span>' + keypersonArr.sfzh +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>进站站名：</label><span>' + keypersonArr.hczmc +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>卡口名称：</label><span>' + keypersonArr.tgkkmc +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>进站时间：</label><span>' + keypersonArr.tgsj +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        } else if (keypersonArr.sjbh === "8") {
            msg = '<div class="bl-card-gis" style="height:15rem;">' +
                '<div class="bl-inner-gis">' +
                '<div class="bl-h-gis">火车订票</div>' +
                '<div class="bl-c-gis">' +
                '<div class="bl-content-gis">' +
                '<div class="innl-gis">' +
                '<div class="prh">' +
                '<label>姓名：</label><span>' + keypersonArr.ccr_xm + '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>身份证号：</label><span>' + keypersonArr.ccr_zjhm +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>出发站：</label><span>' + keypersonArr.fz +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>到达站：</label><span>' + keypersonArr.dz +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>发车时间：</label><span>' + keypersonArr.ccrq +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        } else if (keypersonArr.sjbh === "9") {
            msg = '<div class="bl-card-gis" style="height:15rem;">' +
                '<div class="bl-inner-gis">' +
                '<div class="bl-h-gis">民航订票</div>' +
                '<div class="bl-c-gis">' +
                '<div class="bl-content-gis">' +
                '<div class="innl-gis">' +
                '<div class="prh">' +
                '<label>姓名：</label><span>' + keypersonArr.pas_chn_nm + '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>身份证号：</label><span>' + keypersonArr.pas_id_nbr +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>航班号：</label><span>' + keypersonArr.air_seg_flt_nbr +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>出发地：</label><span>' + keypersonArr.start +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>到达地：</label><span>' + keypersonArr.end +
                '</span>' +
                '</div>' +
                '<div class="prh">' +
                '<label>出发日期：</label><span>' + keypersonArr.air_seg_dpt_dt_lcl +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        mapInstance.addPointForMsg('keypersonId' + index, keypersonArr.x, keypersonArr.y, "person", msg, '', "");
        this.data.keypersonPointId.push('keypersonId' + index);
    },
    clearKeypersonPoint(mapInstance) {
        this.data.keypersonPointId.forEach((id, i) => {

            mapInstance.removePoints(id);
        })
        this.data.keypersonPointId = [];
    },
    getWBGISByNum(mapInstance, number, callback) {
        let queryType = "FQ";   //查询类型：全文检索
        let method = "FULL";    //查询方法：全文查询
        let scope = "_FULLTEXT"; //查询范围：所有字段  group
        let group = "C_DWCS_ST";
        let where = number;
        let parameter = "group=" + group + "&type=" + queryType + "&method=" + method + "&scope=" + scope + "&filterCustom=" + where + "&pageIndex=0&pageSize=10";
        mapInstance.EzPOISearch(parameter, function (results) {
            if (typeof callback == 'function') {
                if (results.groups && results.groups[0] && results.groups[0].pois) {
                    callback(results.groups[0].pois[0]);
                } else {
                    console.error("GIS查询不到：" + where);
                    callback("");
                }

            }
        })
    }
}
