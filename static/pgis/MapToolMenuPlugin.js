(function (window, location) {
    /**
     * 地图上点工具js文件
     * 使用：var menu = new MapToolMenuPlugin($或者axios, mapInstance)
     *      menu.addPoints(types)
     *      menu.removePoints(type)
     *      menu.addCustomePoints(type, points, icon)
     *      具体类型参见 menu.overlayType
     * 功能：
     *      1.多类型同时上图
     *      2.按照提供的范围上图
     *      3.渲染成功回调（无参）
     *      4.自定义类型上图
     *      5.默认点聚合功能
     *      6.自定义范围上图
     */
    var td_host = window.hostConfig.hostIndexUrl+"/td";
    //卡点详情
    var pointDetail = td_host + "/examinePoint/pointDetail";
    //通道上图
    var addPoint = td_host + "/examinePoint/examinePointMap";
    //关注人员列表
    var focusedPeople = td_host + "/focusedPeople/focusedPeopleList";
    //群体重点人员
    var qtPerson = (window.pgisCurUrl || window.hostConfig.hostIndexUrl) + '/qt/bs/track/peoples';
    //重点车辆
    var getFocusedCar = td_host + "/focusedPeople/focusedCarList";
    //通道上图
    var channelMap = td_host + "/examinePoint/chunnelMap";
    //警力
    var pliceForces = window.hostConfig.JzGzHostUrl+"/pgis/getPkg"
    //感知源
    var wifi = window.hostConfig.JzGzHostUrl+"/wifi/getList"
    //人脸卡口
    var faceKakou = window.hostConfig.JzGzHostUrl+"/kakou/getYtKakouList";

    var pgisCurUrl = window.pgisCurUrl || window.hostConfig.hostIndexUrl;

    var detail = pgisCurUrl + "/static/img/tunnel/detail.png"

    var loading = window.hostConfig.hostIndexUrl+"/static/img/tunnel/loading.gif"

    var defaultImg = window.hostConfig.hostIndexUrl+"/static/img/tunnel/img-default.png"
    //警力详情
    var policeDetail = window.hostConfig.anbaoHostUrl+"/jlbb/getBBInfo"
    var allDrawPoints = [];

    var proxyHost = (window.pgisCurUrl ? window.pgisCurUrl + '/pgis-sc' : null) || window.hostConfig.hostIndexUrl+'/pgis-sc';

    //////////////////////////////////////聚合功能/////////////////////////////////////////////

    function Cluster(points, icon, callback, level, ajax, mapInstance, cb, isCluster) {
        this.icon = icon;
        this.ajax = ajax;
        this.level = level;
        this.mapInstance = mapInstance;
        this.callback = callback;
        this.pointsOnMap = [];
        this.points = points;
        this.cb = cb;
        this.samePoints = [];
        this.rectRadius = 0.005;
        this.pointsInWindow = [];
        this.clusterPoints = [];
        this.isCluster = isCluster;
        this.startCluster(this.points);
    }
    Cluster.prototype = {
        drawRealPoints: function () {
            for (var i = 0; i < this.pointsInWindow.length; i++) {
                this.pointsOnMap.push(this.pointsInWindow[i].lon + '' + this.pointsInWindow[i].lat)
                this.callback(this.pointsInWindow[i].lon, this.pointsInWindow[i].lat, this.icon, this.pointsInWindow[i])
            }
        },
        removePoints: function () {
            for (var i = 0; i < this.pointsOnMap.length; i++) {
                this.mapInstance.appMap.removeOverlayPoint(this.pointsOnMap[i]);
            }
            this.pointsOnMap = [];
        },
        drawPoints: function () {
            if(this.isCluster){
                for (var i = 0; i < this.clusterPoints.length; i++) {
                    this.pointsOnMap.push(this.clusterPoints[i].lon + '' + this.clusterPoints[i].lat)
                    if (this.clusterPoints[i].size == 1) {
                        this.callback(this.clusterPoints[i].lon, this.clusterPoints[i].lat, this.icon, this.clusterPoints[i].point)
                    } else {
                        this.callback(this.clusterPoints[i].lon, this.clusterPoints[i].lat, this.icon, "", this.clusterPoints[i].size)
                    }
                }
            }else{
                for (var i = 0; i < this.points.length; i++) {
                    this.pointsOnMap.push(this.points[i].lon + '' + this.points[i].lat)
                    this.callback(this.points[i].lon, this.points[i].lat, this.icon, this.points[i])
                }
            }

        },
        getClusterPoints: function () {
            for (var i = 0; i < this.pointsInWindow.length; i++) {
                if (this.clusterPoints.length == 0) {
                    this.clusterPoints.push({
                        size: 1,
                        points: [this.pointsInWindow[i]],
                        lon: this.pointsInWindow[i].lon,
                        lat: this.pointsInWindow[i].lat,
                        point: this.pointsInWindow[i]
                    });
                } else {
                    var index = this.getMinDistanceClusterPoint(this.pointsInWindow[i]);
                    if (this.isCoverEachOther(this.clusterPoints[index], this.pointsInWindow[i])) {
                        this.clusterPoints[index].size++;
                        if (this.mapInstance.appMap.map.getZoomLevel() > 17) {
                            this.clusterPoints[index].points.push(this.pointsInWindow[i])
                        }
                    } else {
                        this.clusterPoints.push({
                            size: 1,
                            points: [this.pointsInWindow[i]],
                            lon: this.pointsInWindow[i].lon,
                            lat: this.pointsInWindow[i].lat,
                            point: this.pointsInWindow[i]
                        });
                    }
                }
            }
        },
        getMinDistanceClusterPoint: function (point) {
            var distance = 0;
            var index = 0;
            for (var i = 0; i < this.clusterPoints.length; i++) {
                var xx = (this.clusterPoints[i].lon - point.lon) * (this.clusterPoints[i].lon - point.lon);
                var yy = (this.clusterPoints[i].lat - point.lat) * (this.clusterPoints[i].lat - point.lat);
                var dist = xx + yy;
                if (i == 0) {
                    distance = dist;
                } else {
                    if (dist < distance) {
                        distance = dist;
                        index = i;
                    }
                }
            }
            return index;
        },
        isCoverEachOther: function (point1, point2) {
            if (point1.lon - this.rectRadius > point2.lon + this.rectRadius || point2.lon - this.rectRadius > point1.lon + this.rectRadius || point1.lat - this.rectRadius > point2.lat + this.rectRadius || point2.lat - this.rectRadius > point1.lat + this.rectRadius) {
                return false;
            }
            return true;
        },
        startCluster: function (points) {
            points && (this.points = points)
            this.pointsInWindow = [];
            this.clusterPoints = [];
            this.removePoints();
            this.samePoints = [];
            var bounds = this.mapInstance.appMap.map.getBoundsLatLng();
            // if (this.mapInstance.appMap.map.getZoomLevel() >= level) {
            //     this.getPointsInWindow(bounds._northEast.lng, bounds._southWest.lng, bounds._northEast.lat, bounds._southWest.lat);
            //     this.drawRealPoints();
            //     return;
            // }
            this.rectRadius = (bounds._northEast.lng - bounds._southWest.lng) / 60;
            if (this.mapInstance.appMap.map.getZoomLevel() > 17) {
                this.rectRadius = (bounds._northEast.lng - bounds._southWest.lng) / 150;
            }
            this.getPointsInWindow(bounds._northEast.lng, bounds._southWest.lng, bounds._northEast.lat, bounds._southWest.lat);
            this.getClusterPoints();
            this.drawPoints();
        },
        getPointsInWindow: function (maxLon, minLon, maxLat, minLat) {
            for (var i = 0; i < this.points.length; i++) {
                if (this.points[i].lon <= maxLon && this.points[i].lon >= minLon && this.points[i].lat > minLat && this.points[i].lat < maxLat) {
                    this.pointsInWindow.push(this.points[i])
                }
            }
        }
    }
    /////////////////////////////////点的详情////////////////////////////////////////
    //pgis点
    function getPgisHtml(obj) {
        var btn = ""
        if (obj.layer == 'PGIS_JCSS_TXJKZY_PT') {
            var type = 0;
            var types = {
                zjdh: 1, zgdx: 3, lykj: 4, dfwl: 5, hkws: 6, zjys: 8, zxdz: 9
            }
            type = types[obj.customs.SPCSBS];
            var location = ("foundervideo://{'isSingle':false,'isInsert':false,'ptzEnabled':true,'historyEnabled':true,'showList':false,'videoType':'" + type
                + "','videoIp':'" + obj.customs.IPDZ + "','videoPort':'" + obj.customs.PORT + "','userName':'" + obj.customs.USERNAME + "','password':'" +
                obj.customs.PASSWORD + "','videoList':[{'spmc':'" + obj.customs.MC + "','spbh':'" + obj.customs.FLDM + "','tdbh':'" + obj.customs.TDBH + "'}]}")
            btn = '<li style="opacity:0;height:0"><span>视频：</span><a href=' + location + ' id=' + obj.id + '>观看</a></li>';
        }
        var html =
            "<div class='tunnel-card'>" +
            "<div class='card-header'>" + obj.name + '</div>' +
            '<div class="card-body">' +
            '<img src=' + detail + '>' +
            '<ul>' +
            '<li><span>地址：</span>' + (obj.address || obj.customs.GXDWMC && obj.customs.GXDWMC + obj.customs.MC || "") + '</li>' +
            '<li><span>坐标：</span>' + (obj.x || "") + '，' + (obj.y || "") + '</li>' +
            '<li><span>标识 ：</span>' + (obj.id || "") + '</li>' +
            '<li><span>类型：</span>' + (obj.customs.LX || "") + '</li>' +
            '<li><span>联系电话：</span>' + (obj.customs.LXDH || "") + '</li>' +
            '<li><span>负责单位：</span>' + (obj.customs.CJDWMC || "") + '</li>' + btn +
            '</ul></div></div>';
        return html;
    }
    //通道，卡点
    function getHtml(obj, level) {
        var title = level == 1 ? "通道" : level == 2 ? "卡点" : "卡口";
        var html =
            "<div class='tunnel-card'>" +
            "<div class='card-header'>" + title + "信息</div>" +
            "<div class='card-body'>" +
            "<img src=" + detail + ">" +
            "<ul>" +
            "<li><span>" + title + "名称：</span>" + (obj.pointName || "") + "</li>" +
            "<li><span>" + title + "类别：</span>" + (obj.pointType || "") + "</li>" +
            "<li><span>联系人：</span>" + (obj.linkMan || "") + "</li>" +
            "<li><span>联系电话：</span>" + (obj.linkPhone || "") + "</li>" +
            "<li><span>负责单位：</span>" + (obj.controlOrganization || "") + "</li>" +
            "<li><span>坐标：</span>" + obj.lon + '，' + obj.lat + "</li>" +
            "<li><span>ID：</span>" + obj.id + "</li></ul></div></div>"
        return html;
    }
    //警力详情
    function getPoliceHtml(obj) {
        var policeTypes = {
            '1':'交警',
            '2':'反恐',
            '3':'警车',
            '4':'开道车',
            '5':'巡逻车',
            '6':'巡逻摩托车',
            '7':'运钞车',
            '8':'消防车',
            '11':'快反',
            '0':'其他',
            '10':'社会车辆',
            '20':'直升机',
            '12':'单兵',
            '13':'对讲机',
            '30':'120急救',
            '31':'通讯抢险',
            '32':'电力抢险',
            '33':'燃气抢险',
            '34':'社会力量',
            '35':'出租车',
            '36':'图传设备',
            '37':'敞篷巡逻车',
            '38':'防弹运兵车',
            '39':'轻型巡逻车',
            '21':'危化品车'
        }
        var subhtml = '';
        if(obj.bxxkfs && obj.bxxkfs[0] && obj.bxxkfs[0].bxfzrs && obj.bxxkfs[0].bxfzrs[0]){
            subhtml += "<li><span>步巡负责人：</span>" + (obj.bxxkfs[0].bxfzrs[0].bxfzrxm || "无") + "</li>" +
            "<li><span>步巡负责人电话：</span>" + (obj.bxxkfs[0].bxfzrs[0].bxfzrdh || "无") + "</li>" +
            "<li><span>步巡民警数量：</span>" + (obj.bxxkfs[0].bxmjsl || "无") + "</li>" +
            "<li><span>步巡协警数量：</span>" + (obj.bxxkfs[0].bxxjsl || "无") + "</li>"
        }
        if(obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].clfzrs && obj.clxkfs[0].clfzrs[0]){
            subhtml += "<li><span>车牌号：</span>" + (obj.clxkfs[0].cph || "无") + "</li>" +
            "<li><span>车辆负责人：</span>" + (obj.clxkfs[0].clfzrs[0].clfzrxm || "无") + "</li>" +
            "<li><span>车辆负责人电话：</span>" + (obj.clxkfs[0].clfzrs[0].clfzrdh || "无") + "</li>" +
            "<li><span>车辆民警数量：</span>" + (obj.clxkfs[0].clmjsl || "无") + "</li>" +
            "<li><span>车辆协警数量：</span>" + (obj.clxkfs[0].clxjsl || "无") + "</li>"
        }
        var html =
            "<div class='tunnel-card police-card'>" +
            "<div class='card-header'>警力信息<a id='jingli' style='float:right;text-decoration:underline;margin-right:30px'>更多信息</a></div>" +
            "<div class='card-body'>" +
            "<img src=" + detail + ">" +
            "<ul style='min-width:200px'>" +
            "<li><span>巡区类别名称：</span>" + (obj.xqlxmc || "无") + "</li>" +
            "<li><span>巡区名称：</span>" + (obj.xqmc || "无") + "</li>" +
            "<li><span>报备设备类别：</span>" + (obj.gpsStyleId || "无") + "</li>" + subhtml +
            "<li><span>是否报备警力：</span>" + (obj.bRegister == 0 ? "未报备" : "已报备") + "</li>" +
            "<li><span>经纬度：</span>" + (obj.lon + '，' + obj.lat) + "</li>" +
            "<li style='display:inherit'><span>标识：</span>" + (obj.id) + "</li>" +
            "<li><span>警力类型：</span>" + (policeTypes[obj.policetypeid]) + "</li></ul>" +
            '<div class="button btn-inline" id="zhili">发布指令</div>' +
            "</div></div>"
        return html;
    }
    //人脸卡口
    function getFaceKakou(obj) {
        var html =
            "<div class='tunnel-card police-card'>" +
            "<div class='card-header'>人脸卡口</div>" +
            "<div class='card-body'>" +
            "<img src=" + detail + ">" +
            "<ul style='min-width:200px'>" +
            "<li><span>设备名称：</span>" + (obj.devicename || "无") + "</li>" +
            "<li><span>设备编号：</span>" + (obj.deviceid || "无") + "</li>" +
            "<li><span>经纬度：</span>" + (obj.lon + '，' + obj.lat) + "</li>" +
            "</ul>" +
            "</div></div>"
        return html;
    }
    //WIFI详情
    function getWifiHtml(obj) {
        var type = obj.wifilx == "01" ? "特种WIFI" : "普通WIFI";
        var html =
            "<div class='tunnel-card'>" +
            "<div class='card-header'>WIFI详情</div>" +
            '<div class="card-body">' +
            '<img src=' + detail + '>' +
            '<ul>' +
            '<li><span>名称：</span>' + (obj.title || "无") + '</li>' +
            '<li><span>类型：</span>' + type + '</li>' +
            '<li><span>坐标：</span>' + obj.lon + '，' + obj.lat + '</li>' +
            '<li><span>ID：</span>' + obj.csbm + '</li></ul></div></div>';
        return html;
    }
    //群体重点人员
    function getQtPerson(obj) {
        var fields = {
            xm: "姓名",
            swry_xm: "姓名",
            ldmc: "旅店名称",
            ldbm: "旅店编号",
            rzfh: "入住房号",
            rzsj: "入住时间",
            tfrqsj: "退房时间",
            yycsmc: "网吧名称",
            swkssj: "上网开始时间",
            swzdh: "座位号",
            xwsj: "下网时间",
            dz: "到达站",
            dpck: "入库时间",
            fz: "出发站",
            ccr_xm: "姓名",
            ccr_zjhm: "身份证",
            ccrq: "发车时间",
            cc: "车次",
            sfzh: "身份证号",
            tgkkmc: "通过卡口名称",
            tgkkdm: "通过卡口代码",
            tgsj: "通过时间",
            mz: "民族",
            xzsj: "新增时间",
            hczmc: "火车站名称",
            pas_chn_nm: '姓名',
            pas_id_nbr: '身份证号码',
            air_seg_fli_nbr: '航班号',
            air_seg_dpt_dt_lcl: '出发日期',
            air_seg_dpt_tm_lcl: '出发时间',
            air_seg_arrv_tm_lcl: '到达时间',
            air_seg_arrv_dt_lcl: '到达日期',
            air_seg_dpt_airpt_cd: '出发地',
            air_seg_arrv_airpt_cd: '到达地',
            pnr_cr_dt: '创建时间',
            pnr_ref: '记录编号',
            psr_chnname: '姓名',
            cert_no: '证件号',
            sta_depttm: '离港时间',
            sta_arvetm: '进港时间',
            flt_airlcode: '航空公司代码',
            flt_number: '航班号',
            seg_dept_code: '出发地',
            seg_dest_code: '到达地',
            psr_seatnbr: '座位号',
            cthphm: '车牌',
            kkbh: '卡口编号',
            kkmc: '卡口名称',
            fxmc: '方向名称',
            gcsj: '过车时间',
            hpys: '号牌颜色',
            kkjd: '卡口经纬',
            kkwd: '卡口纬度',
            gmsfhm: '身份证',
            sbbh: '设备编号',
            csdm: "场所代码",
            lon: "经度",
            lat: "纬度",
            xzqh: "行政区划",
            start: "起始地",
            end: "目的地"
        }
        var titles = ["", "车辆卡口", "上网", "旅店", "民航进港", "", "", "火车站进站", "火车订票", "民航订坐"];
        var items = ""
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (fields[key]) {
                    if (fields[key].indexOf('证') >= 0) {
                        items += '<li><span style="min-width:90px">身份证号：</span><span data-zjhm="' + (obj[key] || "") + '" onclick="mapToolToPersonInfo(this)"  style="cursor:pointer;margin: 0;color: #5FB3D2;text-decoration: underline;" class="idcard">' + (obj[key] || "") + '</span></li>'
                    } else {
                        items += '<li><span style="min-width:90px">' + fields[key] + '：</span>' + (obj[key] || "") + '</li>'
                    }
                }
            }
        }
        var html = "<div class='tunnel-card'>" +
            "<div class='card-header'>群体重点人员信息 ( " + titles[parseInt(obj.sjbh)] + " )</div>" +
            '<div class="card-body">' +
            '<img style="cursor:pointer;background:url(' + loading + ') center center no-repeat" src="' + pgisCurUrl + '/people/' + (obj.gmsfhm || obj.cert_no || obj.pas_id_nbr || obj.sfzh || obj.ccr_zjhm) + '/getHeadImg"}" id="smImg">' +
            '<ul>' + items + '</ul></div>'
        return html;
    }
    //重点人员
    function getKeyPersonHtml(obj) {
        console.log(obj);
        var time1, time2;
        if (obj.ksCssj && obj.ksCssj.length == 14) {
            time1 = _transformDate(obj.ksCssj);
        }
        if (obj.jsCssj && obj.jsCssj.length == 14) {
            time2 = _transformDate(obj.jsCssj);
        }
        var numstr = obj.xsly == '02' ? '座位号' : obj.xsly == '03' ? '房号' : '其他';
        var type = obj.xsly == '02' ? '上网' : obj.xsly == '03' ? '住店' : '其他';
        var html = "<div class='tunnel-card'>" +
            "<div class='card-header'>重点人员信息 ( " + type + " )</div>" +
            '<div class="card-body">' +
            '<img style="cursor:pointer;background:url(' + loading + ') center center no-repeat" src="' + pgisCurUrl + '/people/' + obj.sfzhm + '/getHeadImg"}" id="smImg">' +
            '<ul>' +
            '<li><span>人员姓名：</span>' + (obj.xm || "") + '</li>' +
            '<li><span>身份证号：</span><span data-zjhm="' + (obj.sfzhm || "") + '" onclick="mapToolToPersonInfo(this)"  style="cursor:pointer;margin: 0;color: #5FB3D2;text-decoration: underline;" class="idcard">' + (obj.sfzhm || "") + '</span></li>' +
            '<li><span>感知识别码：</span>' + (obj.zjhm || "") + '</li>' +

            '<li><span>人员位置：</span>' + (obj.ksCsmc || "") + '</li>' +
            '<li><span>起始时间：</span>' + (time1 || "") + '</li>' +
            '<li><span>结束时间：</span>' + (time2 || "") + '</li>' +
            '<li><span>' + numstr + '：</span>' + (obj.ksWz || "") + '</li>' +
            '<li><span>坐标：</span>' + obj.lon + '，' + obj.lat + '</li>' +
            '</ul></div>'
        return html;
    }
    //获取相近经纬度的点列表
    function getListHtml(points, type) {
        if (type == 'police' || type == 'police1') {
            var ths = ['索引', '巡区类别名称', '巡区名称', '报备设备类别', '车牌号', '车辆负责人', '车辆负责人电话', '车辆民警数量', '是否报备警力', '经纬度', '标识', '更多'];
            var head = '<tr>';
            ths.forEach(function (item) {
                head += '<td>' + item + '</td>'
            })
            head += '</tr>'
            var body = "";
            var index = 1;
            points.forEach(function (obj) {
                body += '<tr><td>' + index++ + '</td>';
                body += '<td>' + (obj.xqlxmc || "无") + '</td>';
                body += '<td>' + (obj.xqmc || "无") + '</td>';
                body += '<td>' + (obj.gpsStyleId || "无") + '</td>';
                body += '<td>' + (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].cph || obj.title || "无") + '</td>';
                body += '<td>' + (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].clfzrs && obj.clxkfs[0].clfzrs[0] && obj.clxkfs[0].clfzrs[0].clfzrxm || "无") + '</td>';
                body += '<td>' + (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].clfzrs && obj.clxkfs[0].clfzrs[0] && obj.clxkfs[0].clfzrs[0].clfzrdh || "无") + '</td>';
                body += '<td>' + (obj.clxkfs && obj.clxkfs[0] ? obj.clxkfs[0].clmjsl : "无") + '</td>';
                body += '<td>' + (obj.bRegister == 0 ? "未报备" : "已报备") + '</td>';
                body += '<td>' + (obj.lon + '，' + obj.lat) + '</td>';
                body += '<td>' + obj.id + '</td>';
                body += '<td>' + '<a id=jingli' + (index - 1) + ' href="javascript:;">更多信息</a>' + '</td></tr>';
            })
            var html = "<div class='tunnel-card list-card'><div class='card-header'></div><div class=card-body><table>" + head + body + '</table></div></div>'
            return html;
        }
        var fields = {
            aindex: "序号",
            xm: "姓名",
            swry_xm: "姓名",
            ccr_xm: "姓名",
            psr_chnname: '姓名',
            pas_chn_nm: '姓名',
            mz: "民族",
            ksDz: "照片",
            csbm: "ID",
            time1: "起始时间",
            time2: "结束时间",
            sfzhm: "证件号码",
            ccr_zjhm: "证件号码",
            zjhm:"对象信息",
            gmsfhm: '身份证',
            cert_no: '证件号',
            sfzh: "身份证号",
            pas_id_nbr: '身份证号码',
            ksCsmc: "位置",
            xsjssj: "创建时间",
            ksWz: "座位号/房间号",
            type: "活动类型",
            ldmc: "旅店名称",
            ldbm: "旅店编号",
            rzfh: "入住房号",
            rzsj: "入住时间",
            tfrqsj: "退房时间",
            yycsmc: "网吧名称",
            swkssj: "上网开始时间",
            swzdh: "座位号",
            xwsj: "下网时间",
            dz: "到达站",
            dpck: "入库时间",
            fz: "出发站",
            ccrq: "发车时间",
            cc: "车次",
            tgkkmc: "通过卡口名称",
            tgkkdm: "通过卡口代码",
            tgsj: "通过时间",
            xzsj: "新增时间",
            hczmc: "火车站名称",
            air_seg_fli_nbr: '航班号',
            air_seg_dpt_dt_lcl: '出发日期',
            air_seg_dpt_tm_lcl: '出发时间',
            air_seg_arrv_tm_lcl: '到达时间',
            air_seg_arrv_dt_lcl: '到达日期',
            air_seg_dpt_airpt_cd: '出发地',
            air_seg_arrv_airpt_cd: '到达地',
            pnr_cr_dt: '创建时间',
            pnr_ref: '记录编号',
            sta_depttm: '离港时间',
            sta_arvetm: '进港时间',
            flt_airlcode: '航空公司代码',
            flt_number: '航班号',
            seg_dept_code: '出发地',
            seg_dest_code: '到达地',
            psr_seatnbr: '座位号',
            cthphm: '车牌',
            kkbh: '卡口编号',
            kkmc: '卡口名称',
            fxmc: '方向名称',
            gcsj: '过车时间',
            hpys: '号牌颜色',
            kkjd: '卡口经纬',
            kkwd: '卡口纬度',
            sbbh: '设备编号',
            csdm: "场所代码",
            lon: "经度",
            lat: "纬度",
            xzqh: "行政区划",
            start: "起始地",
            end: "目的地",
            ksCssj: "起始时间",
            jsCssj: "结束时间",
            idcard:'识别号',
            detail:'详情'
        }
        if (points[0].sjbh) {
            var groups = {};
            var titles = ["", "车辆卡口", "上网", "旅店", "民航进港", "", "", "火车站进站", "火车订票", "民航订坐"];
            points.forEach(function (item) {
                if (!Array.isArray(groups[item.sjbh])) {
                    groups[item.sjbh] = []
                    groups[item.sjbh].push(item)
                } else {
                    groups[item.sjbh].push(item)
                }
            })
            var html = ""
            for (var key1 in groups) {//循环不同类型的点对象
                if (groups.hasOwnProperty(key1)) {
                    html += '<strong style="margin:5px 0">' + titles[parseInt(key1)] + '：</strong><table><tr>';
                    var index = 1;
                    groups[key1].forEach(function (item) {
                        var objstr = JSON.stringify(item)
                        objstr = objstr.replace(/"/g, "'")
                        item.aindex = index++;
                        if (index == 2) {
                            for (var key2 in fields) {//循环第0个的字段
                                if (fields.hasOwnProperty(key2) && groups[key1][0][key2]) {
                                    html += '<td>' + fields[key2] + '</td>'
                                }
                            }
                        }
                        html += '</tr><tr>';
                        for (var key3 in fields) {
                            if (fields.hasOwnProperty(key3) && item[key3]) {
                                if (fields[key3].indexOf('证') >= 0) {
                                    html += '<td><span data-zjhm="' + (item[key3] || "") + '" onclick="mapToolToPersonInfo(this,'+ objstr +')"  style="cursor:pointer;margin: 0;color: #5FB3D2;text-decoration: underline;" class="idcard">' + (item[key3] || "") + '</span></td>'
                                } else {
                                    html += '<td>' + item[key3] + '</td>'
                                }
                            }
                        }
                        html += '</tr>';
                    })
                    html += '</table>'
                }
            }
            var result =
                "<div class='tunnel-card list-card'>" +
                "<div class='card-header'></div>" +
                '<div class="card-body">' + html + '</div></div>';
            return result;
        }
        var pgis = {
            aindex: "序号",
            name: "名称",
            video: "视频",
            id: "标识",
            // address:"地址",
            GXDWMC: "地址",
            MC: "地址",
            LX: "类型",
            LXDH: "联系电话",
            CJDWMC: "负责单位",
            x: "经度",
            y: "纬度",
            mc:"名称",
            lon:"经度",
            lat:"纬度"
        }
        var wifi = {
            aindex: "序号",
            title: "名称",
            type: "类型",
            csbm: "ID",
            lon: "经度",
            lat: "纬度"
        }
        if (type == 'pgis') {
            fields = pgis;
        }
        if (type == 'wifi') {
            fields = wifi;
        }
        if(type == 'car'){
            fields = {
                aindex: "序号",
                xm: "姓名",
                sfzhm: "证件号码",
                zjhm:"车牌号",
                ksCsmc: "位置",
                ksCssj: "过车时间",
                lon: "经度",
                lat: "纬度",
            }
        }
        var keys = [];
        var index = 1;
        points.forEach(function (item) {
            item.aindex = index++;
            if (item.wifilx) {
                item.type = (item.wifilx == "01" ? "特种WIFI" : "普通WIFI")
            }
            if (typeof item.customs == 'object') {
                item.customs.GXDWMC && (item.GXDWMC = item.customs.GXDWMC);
                item.customs.MC && (item.MC = item.customs.MC);
                item.LX = item.customs.LX || "";
                item.LXDH = item.customs.LXDH || "";
                item.CJDWMC = item.customs.CJDWMC || "";
            }
        })
        if (keys.indexOf(Object.keys(points[0]).join(",")) < 0){
            keys.push(Object.keys(points[0]).join(","))
        }

        var tds = "", ths = "", trs = "";
        keys.forEach(function (item) {
            ths += '<tr>'
            var items = item.split(',');
            for (var key in fields) {
                if (fields.hasOwnProperty(key)) {
                    if (items.indexOf(key) >= 0) {
                        ths += '<td>' + fields[key] + '</td>'
                    }
                }
            }
            ths += '</tr>'
        })
        points.forEach(function (item) {
            var objstr = JSON.stringify(item)
            var objstr = objstr.replace(/"/g, "'")
            tds = "";
            if (item.ksCssj && item.ksCssj.length == 14) {
                item.ksCssj = _transformDate(item.ksCssj);
            }
            if (item.jsCssj && item.jsCssj.length == 14) {
                item.jsCssj = _transformDate(item.jsCssj);
            }
            if (item.xsjssj && item.xsjssj.length == 14) {
                item.xsjssj = _transformDate(item.xsjssj);
            }
            item.xsly && (item.xsly = item.xsly == '02' ? '上网' : item.xsly == '03' ? '住店' : '其他');
            for (var key in fields) {
                //if(item[key] == null){continue}
                if (item.hasOwnProperty(key) && fields.hasOwnProperty(key)) {
                    if (fields[key].indexOf('证') >= 0) {
                        tds += '<td><span data-zjhm="' + (item[key] || "") + '" onclick="mapToolToPersonInfo(this,'+ objstr +')"  style="cursor:pointer;margin: 0;color: #5FB3D2;text-decoration: underline;" class="idcard">' + (item[key] || "") + '</span></td>'
                    } else if (key == 'ksDz' && item.sfzhm && item.sfzhm.length > 10) {
                        tds += '<td><img style="cursor:pointer;background:url(' + loading + ') center center no-repeat" src="' + pgisCurUrl + '/people/' + item.sfzhm + '/getHeadImg"}" class="list-img"></td>'
                    } else if (key == 'ksDz' && item.ksDz && item.ksDz.length < 10) {
                        tds += '<td><img style="cursor:pointer;background:url(' + loading + ') center center no-repeat" src="' + (item.ksDz || defaultImg) + '" class="list-img"></td>'
                    } else if(item.types == 'warning-point' && key == 'detail'){
                        tds += '<td onclick=getWarningDetail("'+ item.id +'") style="cursor:pointer">' + '查看' + '</td>'
                    } else {
                        tds += '<td>' + item[key] + '</td>'
                    }

                }
            }
            trs += '<tr>' + tds + '</tr>'
        })
        var html =
            "<div class='tunnel-card list-card'>" +
            "<div class='card-header'></div>" +
            '<div class="card-body">' +
            '<table>' + ths + trs + '</table>'
            + '</div></div>';
        return html;
    }
    //重点车辆
    function getKeyCarHtml(obj) {
        var objstr = JSON.stringify(obj).replace(/"/g, "'")
        var time;
        if (obj.ksCssj && obj.ksCssj.length == 14) {
            time = _transformDate(obj.ksCssj);
        }
        //位置
        var html = "<div class='tunnel-card'>" +
            "<div class='card-header'>重点车辆信息</div>" +
            '<div class="card-body">' +
            '<img style="cursor:pointer;background:url(' + loading + ') center center no-repeat" src="' + (obj.ksDz || defaultImg) + '" id="smImg">' +
            "<ul>" +
            "<li><span>姓名：</span>" + (obj.xm || "") + "</li>" +
            "<li><span>证件号码：</span><span data-zjhm=\""+obj.sfzhm+"\" onclick=\"mapToolToPersonInfo(this,"+objstr+")\"  style=\"cursor:pointer;margin: 0;color: #5FB3D2;text-decoration: underline;\">"+(obj.sfzhm || "") +"</span></li>" +
            "<li><span>车牌号：</span>" + (obj.zjhm || "") + "</li>" +
            "<li><span>过车时间：</span>" + (time || "") + "</li>" +
            "<li><span>位置：</span>" + (obj.ksCsmc || "") + "</li>" +
            "<li><span>坐标：</span>" + obj.lon + '，' + obj.lat + "</li>" ;
        return html;
    }
    //加载中
    function getLoadingHtml() {
        var html = "<div class='tunnel-card police-card'>" +
            "<div class='card-header'>警力信息</div>" +
            '<div class="card-body" style="height:260px;width:300px;text-align:center;line-height:100px;">加载中...' +
            '</div>'
        return html;
    }
    //日期转换
    function _transformDate(str) {
        var arr = str.split("");
        arr.splice(4, 0, "-");
        arr.splice(7, 0, "-");
        arr.splice(10, 0, "  ");
        arr.splice(13, 0, ":");
        arr.splice(16, 0, ":");
        return arr.join("");
    }
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    //根据场所代码获取经纬度
    function getWBGISByNum(mapInstance, number, callback) {
        var queryType = "FQ";   //查询类型：全文检索
        var method = "FULL";    //查询方法：全文查询
        var scope = "_FULLTEXT"; //查询范围：所有字段  group
        var group = "C_DWCS_ST";
        var where = number;
        var parameter = "group=" + group + "&type=" + queryType + "&method=" + method + "&scope=" + scope + "&filterCustom=" + where + "&pageIndex=0&pageSize=10";
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
    function addImgListener() {
        //图片放大
        $("#smImg, .list-img").on("click", function () {
            var arr = createElement();
            arr[1].setAttribute('src', $(this).attr('src'));
            arr[0].style.zIndex = '100000';
            arr[0].style.opacity = 1;
            $(arr[0]).on('click', function () {
                arr[0].style.zIndex = '-1000';
                arr[0].style.opacity = 0;
            })
        });
    }
    function addJinLiListener(obj, marker, map, ajax, index) {
        if (index) {
            $('#jingli' + index).on('click', function () {
                ajax.get(policeDetail + '?gpsid=' + obj.id).then(function (data) {
                    var bounds = map.appMap.map.getBoundsLatLng();
                    var divide = (bounds._northEast.lat - bounds._southWest.lat) / 2.5;
                    map.appMap.setMapCenter(obj.lon, obj.lat + divide);
                    Object.assign(data.data, obj)
                    marker.openInfoWindowHtml(getJinLiDetailHtml(data.data));
                })
            })
            return;
        }
        $("#jingli").on('click', function () {
            var bounds = map.appMap.map.getBoundsLatLng();
            var divide = (bounds._northEast.lat - bounds._southWest.lat) / 3;
            map.appMap.setMapCenter(obj.lon, obj.lat + divide);
            marker.openInfoWindowHtml(getJinLiDetailHtml(obj))
        })
    }
    function getJinLiDetailHtml(obj) {
        var minjing = "";
        var zhuangbei = "";
        var xiejin = "";
        var buxunminjing = "";
        var buxunxiejin = "";
        if (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].clmjs && obj.clxkfs[0].clmjs[0]) {
            for (var i = 0; i < obj.clxkfs[0].clmjs.length; i++) {
                minjing += '<tr><td>' + obj.clxkfs[0].clmjs[i].clmjxm + '</td><td>' + obj.clxkfs[0].clmjs[i].clmjbh + '</td><td>' + obj.clxkfs[0].clmjs[i].clmjdh + '</td></tr>'
            }
        }
        if (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].clxjs && obj.clxkfs[0].clxjs[0]) {
            for (var i = 0; i < obj.clxkfs[0].clxjs.length; i++) {
                xiejin += '<tr><td>' + obj.clxkfs[0].clxjs[i].clxjxm + '</td><td>' + obj.clxkfs[0].clxjs[i].clxjbh + '</td><td>' + obj.clxkfs[0].clxjs[i].clxjdh + '</td></tr>'
            }
        }
        if (obj.bxxkfs && obj.bxxkfs[0] && obj.bxxkfs[0].bxxjs && obj.bxxkfs[0].bxxjs[0]) {
            for (var i = 0; i < obj.bxxkfs[0].bxxjs.length; i++) {
                buxunxiejin += '<tr><td>' + obj.bxxkfs[0].bxxjs[i].bxxjxm + '</td><td>' + obj.bxxkfs[0].bxxjs[i].bxxjbh + '</td><td>' + obj.bxxkfs[0].bxxjs[i].bxxjdh + '</td></tr>'
            }
        }
        if (obj.bxxkfs && obj.bxxkfs[0] && obj.bxxkfs[0].bxmjs && obj.bxxkfs[0].bxmjs[0]) {
            for (var i = 0; i < obj.bxxkfs[0].bxmjs.length; i++) {
                buxunminjing += '<tr><td>' + obj.bxxkfs[0].bxmjs[i].bxmjxm + '</td><td>' + obj.bxxkfs[0].bxmjs[i].bxmjbh + '</td><td>' + obj.bxxkfs[0].bxmjs[i].bxmjdh + '</td></tr>'
            }
        }
        if (Array.isArray(obj.zbbbs)) {
            for (var i = 0; i < obj.zbbbs.length; i++) {
                zhuangbei += '<tr><td>' + obj.zbbbs[i].zblx + '</td><td>' + obj.zbbbs[i].zblxmc + '</td><td>' + obj.zbbbs[i].zbsl + '</td></tr>'
            }
        }
        var html = '<div class="tunnel-card jingli-card">' +
            '<div class="card-header">警力报备详情</div>' +
            '<div class="card-body" style="height:500px;overflow-y:scroll">' +
            '<div class="msg">' +
            '<div class="line">' +
            '<span>报备时间：</span><span>' + (obj.bcsj || "") + '</span>' +
            '<span>报备类别名称：</span><span>' + (obj.bblxmc || "") + '</span>' +
            '</div>' +
            '<div class="line">' +
            '<span>巡区类别名称：</span><span>' + (obj.xqlbmc || "") + '</span>' +
            '<span>巡区名称：</span><span>' + (obj.xqmc || "") + '</span>' +
            '</div>' +
            '<div class="line">' +
            '<span>报备设备类型：</span><span>' + (obj.gpsStyleId) + '</span>' +
            '<span>是否报备警力：</span><span>' + (obj.bRegister == 0 ? "未报备" : "已报备") + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="msg">' +
            '<div class="line">' +
            '<span>车牌号：</span><span>' + (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].cph || "") + '</span>' +
            '<span>车辆负责人：</span><span>' + (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].clfzrs && obj.clxkfs[0].clfzrs[0] && obj.clxkfs[0].clfzrs[0].clfzrxm || "") + '</span>' +
            '</div>' +
            '<div class="line">' +
            '<span>车辆负责人电话：</span><span>' + (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].clfzrs && obj.clxkfs[0].clfzrs[0] && obj.clxkfs[0].clfzrs[0].clfzrdh || "") + '</span>' +
            '<span>车辆民警数量：</span><span>' + (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].clmjsl || "") + '</span>' +
            '</div>' +
            '<table><tr><td>姓名</td><td>编号</td><td>电话</td></tr>' +
            minjing +
            '</table>' +
            '</div>' +
            '<div class="msg">' +
            '<p>装备列表：</p>' +
            '<table><tr><td>装备类型</td><td>装备类型名称</td><td>数量</td></tr>' +
            zhuangbei +
            '</table>' +
            '</div>' +
            '<div class="msg">' +
            '<p>车辆协警人数：' + (obj.clxkfs && obj.clxkfs[0] && obj.clxkfs[0].clxjsl || 0) + ' 人</p>' +
            '<table><tr><td>姓名</td><td>编号</td><td>电话</td></tr>' +
            xiejin +
            '</table>' +
            '</div>' +
            '<div class="msg">' +
            '<div class="line">' +
            '<span>步巡人员负责人：</span><span>' + (obj.bxxkfs && obj.bxxkfs[0] && obj.bxxkfs[0].bxfzrs && obj.bxxkfs[0].bxfzrs[0] && obj.bxxkfs[0].bxfzrs[0].bxfzrxm || "") + '</span>' +
            '<span>步巡人员负责人电话：</span><span>' + (obj.bxxkfs && obj.bxxkfs[0] && obj.bxxkfs[0].bxfzrs && obj.bxxkfs[0].bxfzrs[0] && obj.bxxkfs[0].bxfzrs[0].bxfzrdh || "") + '</span>' +
            '</div>' +
            '<div class="line">' +
            '<span>步巡民警数量：</span><span>' + (obj.bxxkfs && obj.bxxkfs[0] && obj.bxxkfs[0].bxmjsl || 0) + ' 人</span>' +
            '<span></span><span></span>' +
            '</div>' +
            '<table><tr><td>姓名</td><td>编号</td><td>电话</td></tr>' +
            buxunminjing +
            '</table>' +
            '</div>' +
            '<div class="msg">' +
            '<p>步巡协警数量：' + (obj.bxxkfs && obj.bxxkfs[0] && obj.bxxkfs[0].bxxjsl || 0) + ' 人</p>' +
            '<table><tr><td>姓名</td><td>编号</td><td>电话</td></tr>' +
            buxunxiejin +
            '</table>' +
            '</div>' +
            '</div>' +
            '</div>'
        return html;
    }
    function createElement() {
        if (document.getElementById('IMGBOX')) {
            return [document.getElementById('IMGBOX'), document.getElementById('BIGIMG')]
        }
        var div = document.createElement('div');
        var img = document.createElement('img');
        div.id = "IMGBOX";
        img.id = "BIGIMG";
        div.style.width = '100%';
        div.style.position = 'fixed';
        div.style.top = 0;
        div.style.left = 0;
        div.style.height = "100%";
        div.style.opacity = 0;
        div.style.transition = "all .4s";
        div.style.background = "rgba(0,0,0,.7)";
        div.style.zIndex = '-1000';
        img.style.maxHeight = '99%';
        img.style.margin = "auto";
        img.style.position = "absolute";
        img.style.top = 0;
        img.style.left = 0;
        img.style.bottom = 0;
        img.style.right = 0;
        div.appendChild(img);
        document.body.appendChild(div);
        return [div, img];
    }
    /////////////////////////////////MapToolMenuPlugin/////////////////////////////////////////////
    /**
     *
     * @param {*} ajax $/Jquery/axios
     * @param {*} mapInstance init.js实例
     * @param {*} qs npm qs包
     */
    function MapToolMenuPlugin(ajax, mapInstance, qs, cb) {
        this.ajax = ajax ? ajax : window.jQuery;
        if (!this.ajax.ajax) {
            //axios
            this.ajax.ajax = this.ajax;
        } else {
            if (this.ajax.getJSON) {
                //this.ajax.get = this.ajax.getJSON
            }
        }
        if (!qs) {
            console.error("请传入qs模块（github qs包）")
            return;
        }
        this.isCluster = {};
        this.allPoint = {};
        this.clusterType = {};
        this.lineTunnels = [];
        createElement();
        this.tolls = [];
        this.lineOverlays = [];
        this.mapInstance = mapInstance;
        this.pgisPoints = {
            hotel: {
                name: 'JWZH_ZAGL_LD_PT',
                show: false,
                img: 'hotel'
            },
            safe: {
                name: "PGIS_ZHZX_GQ_PT",
                show: false,
                img: 'kd'
            },
            netbar: {
                name: 'JWZH_ZAGL_WB_PT',
                show: false,
                img: 'netbar'
            },
            hospital: {
                name: 'JWZH_FKFB_YLJZDW_PT',
                show: false,
                img: 'hospital'
            },
            school: {
                name: 'JWZH_DWXX_JY_PT',
                show: false,
                img: 'school'
            },
            gv: {
                name: 'JWZH_DWXX_DZJG_PT',
                show: false,
                img: 'government'
            },
            trafficPolice: {
                name: "PGIS_JTGL_JKKK_PT",
                show: false,
                img: 'kakou'
            }
        }
        //工具插件功能类型
        this.overlayType = {
            wifi: { type: "wifi", name: "普通WIFI" },
            police: { type: "police", name: "已报备警力" },
            police1: { type: "police1", name: "未报备警力" },
            person: { type: "person", name: "重点人员" },
            camera: { type: "camera", name: "天网" },
            qtPerson: { type: "qtPerson", name: "群体重点人员" },
            car: { type: "car", name: "重点车辆" },
            circle: { type: "circle", name: "圆形" },
            rect: { type: "rect", name: "矩形" },
            poly: { type: "poly", name: "多边形" },
            line: { type: "line", name: "画线" },
            area: { type: "area", name: "测面积" },
            faceKakou: { type: "faceKakou", name: "人脸卡口" },
            tunnel: {
                chuan: { type: "chuan", name: "环川" },
                zang: { type: "zang", name: "涉藏" },
                rong: { type: "rong", name: "环蓉" },
                train: { type: "train", name: "火车站" },
                airport: { type: "airport", name: "机场" },
                dock: { type: "dock", name: "码头" },
                toll: { type: "toll", name: "收费站" },
                other: { type: "other", name: "其他" },
                firstClass: { type: "firstClass", name: "一级" },
                secondClass: { type: "secondClass", name: "二级" },
                thirdClass: { type: "thirdClass", name: "三级" },
                automobile: { type: "automobile", name: "汽车站" },
                highWay: { type: "highWay", name: "高速路" },
            },
            pgisPoint: {
                netbar: { type: "netbar", name: "网吧" },
                hotel: { type: "hotel", name: "旅店" },
                safe: { type: "safe", name: "治安" },
                hospital: { type: "hospital", name: "医院" },
                school: { type: "school", name: "学校" },
                gv: { type: "gv", name: "政府" },
                trafficPolice: { type: "trafficPolice", name: "交警" },
            },
            distance: { type: "distance", name: "测距" },
            specialWifi: { type: "specialWifi", name: "特种WIFI" },
            lineTunnel: { type: "lineTunnel", name: "线通道" },
        }
        this.qs = qs;
        this.cb = cb;
    }
    MapToolMenuPlugin.prototype = {
        // 1.多类型同时上图，2.按照提供的范围上图，3.渲染成功回调（无参），4.自定义上图点击事件回掉（点信息）
        /**
         * types: string/array,例如： ['netbar', 'hotel']或者 'netbar'
         * range: 多边形,不传是参数为空 如： '103.51318359375,31.453857421875,102.7880859375,29.190673828125,105.40283203125,28.861083984375,105.479736328125,31.102294921875'
         * cb: 指定回调,
         * cluster: 是否聚合
         * clickCb 点击事件回掉
         */
        addPoints: function (types, range, cluster, cb) {
            var that = this;
            if (Array.isArray(types)) {
                types.forEach(function (item) {
                    that.addPoint(item, range, cb, cluster)
                })
            } else {
                that.addPoint(types, range, cb, cluster)
            }
        },
        //添加自定义点
        /**
         * type :自定义参数类型,名字自取
         * points: 自定义点集合，经纬度字段必须为lon,lat
         * icon: 地图上图图标名称
         * range: 地图范围经纬度集合字符串，可以不给， 给了就按照指定区域上图
         * cb: 回调
         */
        addCustomePoints: function (type, points, icon, range, cluster, cb) {
            var that = this,poly;
            var appMap = this.mapInstance.appMap;
            if(cluster == undefined){
                cluster = true;
            }
            if (this.overlayType[type] || this.overlayType.pgisPoint[type] || this.overlayType.tunnel[type]) {
                this.addPoint(type);
                return;
            }
            this.allPoint[type] = points;
            this.isCluster[type] = true;
            if(range){
                that.allPoint[type] = that.getCustomeRangePoints(range, that.allPoint[type]);
            }
            // else if (appMap.preGraph) {
            //     if (!poly) {
            //         poly = that.getPoly(appMap);
            //     }
            //     that.allPoint[type] = that.getPointsInRange(poly, appMap.preGraph.type, that.allPoint[type]);
            // }
            if (!that.clusterType[type]) {
                that.clusterType[type] = new Cluster(that.allPoint[type], icon, that.addPointWithEvent, '', that.ajax, that.mapInstance, that.cb, cluster);
                that.addMapEventListener(type, type);
            } else {
                that.clusterType[type].startCluster(that.allPoint[type]);
            }
            setTimeout(function(){typeof cb == 'function' && cb();},100);
        },
        addPoint: function (type, range, cb, cluster) {
            if(cluster == undefined){
                cluster = true;
            }
            var that = this;
            var ajax = this.ajax;
            var appMap = this.mapInstance.appMap;
            var mapInstance = this.mapInstance;
            this.isCluster[type] = true;
            var borders;
            var poly;
            if (appMap.preGraph) {
                if (appMap.preGraph.type == 'rect') {
                    var arr = appMap.preGraph.coordString.split(",");
                    poly = { maxLon: arr[4], minLon: arr[0], maxLat: arr[3], minLat: arr[1] };
                } else if (appMap.preGraph.type == 'circle') {
                    poly = { lon: appMap.preGraph._latlng.lng, lat: appMap.preGraph._latlng.lat, radius: appMap.preGraph._mRadius }
                } else if (appMap.preGraph.type == 'poly') {
                    var arr = appMap.preGraph.coordString.split(',');
                    borders = appMap.preGraph.coordString + ',' + arr[0] + ',' + arr[1]
                    poly = [];
                    for (var i = 0; i < arr.length; i += 2) {
                        poly.push({ lon: parseFloat(arr[i]), lat: parseFloat(arr[i + 1]) })
                    }
                    poly.push(poly[0])
                } else if (appMap.preGraph.type == 'line') {
                    poly = appMap.preGraph.coordString;
                }
            }
            if (this.clusterType[type] && type != 'lineTunnel' && type != 'police' && type != 'police1' && this.overlayType[type]) {
                if (range) {
                    this.addCustomeRangePoints(range);
                    var arr = range.split(',');
                    var borders = range + ',' + arr[0] + ',' + arr[1];
                    this.getPgisPointsInRange(type, borders, 'poly', cb, cluster);
                    return;
                }
                if (appMap.preGraph) {
                    if (appMap.preGraph.type == 'line') {
                        that.getPointsBesideLine(poly, that.allPoint);
                    } else {
                        that.getAllInsidePoints(poly, appMap.preGraph.type);
                    }
                    if(typeof cb == 'function') cb();
                    return;
                }
                this.clusterType[type].show = true;
                this.clusterType[type].startCluster(this.allPoint[type]);
                return;
            } else if (this.allPoint[type] && !this.clusterType[type]) {
                if (type.indexOf('wifi') > -1) {
                    var img = type == "wifi" ? "wifi" : "special_wifi";
                    if(range){
                        this.allPoint[type] = this.getCustomeRangePoints(range, this.allPoint[type]);
                    }
                    else if (appMap.preGraph) {
                        if (!poly) {
                            poly = this.getPoly(appMap);
                        }
                        this.allPoint[type] = this.getPointsInRange(poly, appMap.preGraph.type, this.allPoint[type]);
                    }
                    this.clusterType[type] = new Cluster(this.allPoint[type], img, this.addPointWithEvent, 17, this.ajax, mapInstance, this.cb, cluster);
                    this.addMapEventListener(type, type);

                    this.clusterType[type].show = true;
                    setTimeout(function(){typeof cb == 'function' && cb();},100);
                    return;
                }
            }
            if (this.overlayType.tunnel[type] && type != 'lineTunnel') {
                ajax.get(addPoint + "/" + this.overlayType.tunnel[type].name)
                    .then(function (data) {
                        var tunnelType1 = {
                            name: ['环川','环蓉'],
                            type:['chuan','rong']
                        }
                        var tunnelType2 = {
                            name: ['一级','二级','三级']
                        }
                        data.data.forEach(function (item) {
                            for(var s = 0; s < tunnelType1.name.length; s++){
                                var index1 = item.chunnelTag && item.chunnelTag.indexOf(tunnelType1.name[s]);
                                if(index1 > -1){
                                    item.img = tunnelType1.type[s]
                                }
                            }
                            if(item.img){
                               for(var j = 0; j < tunnelType2.name.length; j++){
                                    var index2 = item.chunnelLevel && item.chunnelLevel.indexOf(tunnelType2.name[j]);
                                    if(index2 > -1){
                                        item.img += ('-' + (j + 1))
                                        item.mutiType = item.img
                                    }
                                }
                            }else{
                                item.img = type
                            }
                            item.lon = item.longitude;
                            item.lat = item.latitude;
                        })
                        that.allPoint[type] = JSON.parse(JSON.stringify(data.data));

                        if(range){
                            that.allPoint[type] = that.getCustomeRangePoints(range, that.allPoint[type]);
                        }
                        else if (appMap.preGraph) {
                            if (!poly) {
                                poly = that.getPoly(appMap);
                            }
                            that.allPoint[type] = that.getPointsInRange(poly, appMap.preGraph.type, that.allPoint[type]);
                        }
                        if (!that.clusterType[type]) {
                            that.clusterType[type] = new Cluster(that.allPoint[type], type, that.addPointWithEvent, 17, that.ajax, mapInstance, that.cb, cluster);
                            that.addMapEventListener(type, type);
                        } else {
                            that.clusterType[type].startCluster(that.allPoint[type]);
                        }
                        that.clusterType[type].show = true;
                        setTimeout(function(){typeof cb == 'function' && cb();},100);
                    })
            } else if (this.overlayType.pgisPoint[type]) {
                this.pgisPoints[type].show = true;
                if (range) {
                    var arr = range.split(',');
                    var borders = range + ',' + arr[0] + ',' + arr[1];
                    this.getPgisPointsInRange(type, borders, 'poly', cb, cluster);
                    return;
                }
                if (appMap.preGraph) {
                    this.getPgisPointsInRange(type, borders || poly, appMap.preGraph.type, cb, cluster);
                    return;
                }
                var pgisimg = this.pgisPoints[type].img;
                var pgistype = this.pgisPoints[type].name;
                var pgisname = this.overlayType.pgisPoint[type].name;
                this.dataServiceLayer({ DZMC: "地址", LX: "卡点类型", SHIJXZQH: "所在市州", XIANJXZQH: "所在区县" }, 51, pgisimg, pgistype, pgisname, mapInstance);
            } else if (type == "wifi" || type == "specialWifi") {
                var img = type == "wifi" ? "wifi" : "special_wifi";
                if (appMap.preGraph || range) {
                    var paramData ={};
                    if(appMap.preGraph && appMap.preGraph.coordString || range){
                        paramData={
                            polygon: (appMap.preGraph && appMap.preGraph.coordString) || range,
                            type:'1'
                        }
                    }else{
                        paramData={
                            type:2,
                            circle:{ lng: appMap.preGraph._latlng.lng, lat: appMap.preGraph._latlng.lat, radius: appMap.preGraph._mRadius }
                        }
                    }
                    ajax.ajax({
                        method: 'post',
                        type: "post",
                        url: window.hostConfig.JzGzHostUrl+'/wifi/getListByQueryParam',
                        data: JSON.stringify(paramData),
                        dataType: "json",
                        withCredentials: true,
                        contentType: 'application/json',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function(res){
                        that.allPoint['wifi'] = [];
                        that.allPoint['specialWifi'] = [];
                        res.data.forEach(function (item) {
                            item.img = item.wifilx == "01" ? "special_wifi" : "wifi";
                            item.lon = parseFloat(item.lng)
                            item.lat = parseFloat(item.lat)
                            if (item.wifilx == "01") {
                                that.allPoint['specialWifi'].push(item);
                            } else {
                                that.allPoint['wifi'].push(item);
                            }
                        })
                        that.clusterType[type] = new Cluster(that.allPoint[type], img, that.addPointWithEvent, 17, that.ajax, mapInstance, that.cb, cluster);
                        that.addMapEventListener(type, type)
                        // range && that.addCustomeRangePoints(range);

                        setTimeout(function(){typeof cb == 'function' && cb();},100);
                    })
                    return;
                }
                ajax.get(wifi).then(function (data) {
                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }
                    that.allPoint['wifi'] = [];
                    that.allPoint['specialWifi'] = [];
                    data.forEach(function (item) {
                        item.img = item.wifilx == "01" ? "special_wifi" : "wifi";
                        item.lon = parseFloat(item.lng)
                        item.lat = parseFloat(item.lat)
                        if (item.wifilx == "01") {
                            that.allPoint['specialWifi'].push(item);
                        } else {
                            that.allPoint['wifi'].push(item);
                        }
                    })
                    that.clusterType[type] = new Cluster(that.allPoint[type], img, that.addPointWithEvent, 17, that.ajax, mapInstance, that.cb, cluster);
                    that.addMapEventListener(type, type)
                    setTimeout(function(){typeof cb == 'function' && cb();},100);
                })
            } else if (type == "police" || type == "police1") {
                var img = type == 'police' ? 'mj' : 'mj';
                that.allPoint['police'] = [];
                that.allPoint['police1'] = [];
                ajax.get(pliceForces).then(function (data) {
                    if (typeof data == 'string') {
                        data = JSON.parse(data)
                    }
                    data.forEach(function (item) {
                        item.img = 'mj';
                        item.lon = item.lng;
                        item.lat = item.lat;
                        if (item.bRegister == 0) {
                            that.allPoint['police1'].push(item)//未报备
                        } else {
                            that.allPoint['police'].push(item)//已报备
                        }
                    })

                    if(range){
                        that.allPoint[type] = that.getCustomeRangePoints(range, that.allPoint[type]);
                    }
                    else if (appMap.preGraph) {
                        if (!poly) {
                            poly = that.getPoly(appMap);
                        }
                        that.allPoint[type] = that.getPointsInRange(poly, appMap.preGraph.type, that.allPoint[type]);
                    }
                    if (!that.clusterType[type]) {
                        that.clusterType[type] = new Cluster(that.allPoint[type], img, that.addPointWithEvent, "", that.ajax, mapInstance, that.cb, cluster);
                        that.addMapEventListener(type, type);
                    } else {
                        that.clusterType[type].startCluster(that.allPoint[type]);
                    }
                    that.clusterType[type].show = true;
                    //range && that.addCustomeRangePoints(range)
                    setTimeout(function(){typeof cb == 'function' && cb();},100);
                })
                this['timer' + type] = setTimeout(function () {
                    if ($(".police-card").length > 0 || $(".jingli-card").length > 0 || $('.list-card').length > 0) return;
                    that.addPoint(type, range, cb, cluster)
                }, 8000000)
            } else if (type == "faceKakou") {
                ajax.get(faceKakou).then(function (data) {
                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }
                    that.allPoint[type] = JSON.parse(JSON.stringify(data.data));
                    that.allPoint[type].forEach(function (item) {
                        item.img = type;
                        item.lon = parseFloat(item.longitude)
                        item.lat = parseFloat(item.latitude)
                    })
                    if(range){
                        that.allPoint[type] = that.getCustomeRangePoints(range, that.allPoint[type]);
                    }
                    else if (appMap.preGraph) {
                        if (!poly) {
                            poly = that.getPoly(appMap);
                        }
                        that.allPoint[type] = that.getPointsInRange(poly, appMap.preGraph.type, that.allPoint[type]);
                    }
                    if (!that.clusterType[type]) {
                        that.clusterType[type] = new Cluster(that.allPoint[type], 'faceKakou', that.addPointWithEvent, '', that.ajax, mapInstance, that.cb, cluster);
                        that.addMapEventListener(type, type);
                    } else {
                        that.clusterType[type].startCluster(that.allPoint[type]);
                    }
                    typeof cb == 'function' && cb()
                })
            } else if (type == "person") {
                ajax.get(focusedPeople + "/" + getNowFormatDate()).then(function (data) {
                    that.allPoint[type] = JSON.parse(JSON.stringify(data.data));
                    that.allPoint[type].forEach(function (item) {
                        item.img = type;
                        item.lon = parseFloat(item.ksJd)
                        item.lat = parseFloat(item.ksWd)
                    })
                    if(range){
                        that.allPoint[type] = that.getCustomeRangePoints(range, that.allPoint[type]);
                    }
                    else if (appMap.preGraph) {
                        if (!poly) {
                            poly = that.getPoly(appMap);
                        }
                        that.allPoint[type] = that.getPointsInRange(poly, appMap.preGraph.type, that.allPoint[type]);
                    }
                    if (!that.clusterType[type]) {
                        that.clusterType[type] = new Cluster(that.allPoint[type], 'tongdao_person', that.addPointWithEvent, '', that.ajax, mapInstance, that.cb, cluster);
                        that.addMapEventListener(type, type);
                    } else {
                        that.clusterType[type].startCluster(that.allPoint[type]);
                    }
                    setTimeout(function(){typeof cb == 'function' && cb();},100);
                });
            } else if (type == 'qtPerson') {
                ajax.get(qtPerson).then(function (data) {
                    that.allPoint[type] = JSON.parse(JSON.stringify(data.data));
                    that.allPoint[type].forEach(function (item) {
                        item.img = 'person';
                        if (!item.lon && !item.lat && item.csdm) {
                            getWBGISByNum(that.mapInstance, item.csdm, function (data) {
                                if (data) {
                                    item.lon = parseFloat(data.x)
                                    item.lat = parseFloat(data.y)
                                } else {
                                    item.lon = 0
                                    item.lat = 0
                                }
                            })
                        } else {
                            item.lon = parseFloat(item.lon)
                            item.lat = parseFloat(item.lat)
                        }
                    })
                    if(range){
                        that.allPoint[type] = that.getCustomeRangePoints(range, that.allPoint[type]);
                    }
                    else if (appMap.preGraph) {
                        if (!poly) {
                            poly = that.getPoly(appMap);
                        }
                        that.allPoint[type] = that.getPointsInRange(poly, appMap.preGraph.type, that.allPoint[type]);
                    }
                    if (!that.clusterType[type]) {
                        that.clusterType[type] = new Cluster(that.allPoint[type], 'tongdao_person', that.addPointWithEvent, '', that.ajax, mapInstance, that.cb, cluster);
                        that.addMapEventListener(type, type);
                    } else {
                        that.clusterType[type].startCluster(that.allPoint[type]);
                    }
                    setTimeout(function(){typeof cb == 'function' && cb();},100);
                })
            } else if (type == "car") {
                ajax.get(getFocusedCar + "/" + getNowFormatDate()).then(function (data) {
                    that.allPoint[type] = JSON.parse(JSON.stringify(data.data));
                    that.allPoint[type].forEach(function (item) {
                        item.img = type;
                        item.lon = parseFloat(item.ksJd)
                        item.lat = parseFloat(item.ksWd)
                    })
                    if(range){
                        that.allPoint[type] = that.getCustomeRangePoints(range, that.allPoint[type]);
                    }
                    else if (appMap.preGraph) {
                        if (!poly) {
                            poly = that.getPoly(appMap);
                        }
                        that.allPoint[type] = that.getPointsInRange(poly, appMap.preGraph.type, that.allPoint[type]);
                    }
                    if (!that.clusterType[type]) {
                        that.clusterType[type] = new Cluster(that.allPoint[type], 'car', that.addPointWithEvent, '', that.ajax, mapInstance, that.cb, cluster);
                        that.addMapEventListener(type, type);
                    } else {
                        that.clusterType[type].startCluster(that.allPoint[type]);
                    }
                    setTimeout(function(){typeof cb == 'function' && cb();},100);
                })
            } else if (type == "circle") {
                that.mapInstance.appMap.map.uMap.off('mousedown mousemove mouseup')
                appMap.drawCircle(function (res) {
                    that._removeAllDrawPoints();
                    var arr = res.split(",");
                    var circle = { lon: arr[0], lat: arr[1], radius: arr[2] };
                    that.getAllInsidePoints(circle, 'circle');
                    that.getPgisPointsInRange(type, circle, 'circle', cb, cluster);
                });
            } else if (type == "rect") {
                that.mapInstance.appMap.map.uMap.off('mousedown mousemove mouseup')
                appMap.drawRectangle(function (res) {
                    that._removeAllDrawPoints();
                    var arr = res.split(",");
                    var rect = { maxLon: arr[4], minLon: arr[0], maxLat: arr[3], minLat: arr[1] };
                    that.getAllInsidePoints(rect, 'rect');
                    that.getPgisPointsInRange(type, rect, 'rect', cb, cluster);
                });
            } else if (type == "poly") {
                that.mapInstance.appMap.map.uMap.off('mousedown mousemove mouseup')
                appMap.drawPolygon(function (obj) {
                    that._removeAllDrawPoints();
                    var arr = obj.coordString.split(',');
                    var borders = obj.coordString + ',' + arr[0] + ',' + arr[1]
                    var lonlats = [];
                    for (var i = 0; i < arr.length; i += 2) {
                        lonlats.push({ lon: parseFloat(arr[i]), lat: parseFloat(arr[i + 1]) })
                    }
                    lonlats.push(lonlats[0])
                    that.getAllInsidePoints(lonlats, 'poly');
                    that.getPgisPointsInRange(type, borders, 'poly', cb, cluster);
                }, { shapeOptions: { opacity: 0.4 } });
            } else if (type == "line") {
                that.mapInstance.appMap.map.uMap.off('mousedown mousemove mouseup')
                //画线
                appMap.drawPolyline(function (obj) {
                    that.getPointsBesideLine(obj, that.allPoint);
                    that.getPgisPointsInRange(type, obj, 'line', cb, cluster);
                })
            } else if (type == "distance") {
                that.mapInstance.appMap.map.uMap.off('mousedown mousemove mouseup')
                appMap.measureLength()
            } else if (type == "area") {
                that.mapInstance.appMap.map.uMap.off('mousedown mousemove mouseup')
                appMap.measureArea()
            } else if (type == "lineTunnel") {
                ajax.get(channelMap).then(function (data) {
                    that.lineTunnels = data.data || [];
                    that.allPoint[type] = [];
                    var kakou = [];
                    that.lineOverlays = [];
                    that.tolls = [];
                    for (var i = 0; i < data.data.length; i++) {
                        var path = [];
                        data.data[i].pointList.push(data.data[i].pointList[1]);
                        data.data[i].pointList.splice(1, 1);
                        for (var j = 0; j < data.data[i].pointList.length; j++) {
                            var img = data.data[i].pointList[j].level == 0 ? "kakou" : "toll";
                            data.data[i].pointList[j].img = img;
                            if (data.data[i].pointList[j].level == 0) {
                                kakou.push(data.data[i].pointList[j]);
                            } else {
                                that.allPoint[type].push(data.data[i].pointList[j]);
                                that.tolls.push(data.data[i].pointList[j].lon + '' + data.data[i].pointList[j].lat)
                                that.addPointWithEvent(
                                    data.data[i].pointList[j].lon,
                                    data.data[i].pointList[j].lat,
                                    img,
                                    data.data[i].pointList[j]
                                );
                            }
                            path.push(
                                data.data[i].pointList[j].lon +
                                "," +
                                data.data[i].pointList[j].lat
                            );
                        }
                        // 1是通道
                        that.addLineWithEvent(path, data.data[i].pointId, i, 1);
                    };
                    that.allPoint.kakou = JSON.parse(JSON.stringify(kakou));
                    if (!that.clusterType[type]) {
                        that.clusterType[type] = new Cluster(kakou, 'kakou', that.addPointWithEvent, "", that.ajax, mapInstance, that.cb, cluster);
                        that.addMapEventListener(type, type);
                    } else {
                        that.clusterType[type].startCluster(kakou);
                    }
                    that.clusterType[type].show = true;
                    setTimeout(function(){typeof cb == 'function' && cb();},100);
                });
            } else if(type == 'camera'){
                if (appMap.preGraph || range) {
                    if(appMap.preGraph && appMap.preGraph.coordString || range){
                        paramData={
                            polygon: (appMap.preGraph && appMap.preGraph.coordString) || range,
                            type:'1'
                        }
                    }else {
                        paramData={
                            type:2,
                            circle:{ lng: appMap.preGraph._latlng.lng, lat: appMap.preGraph._latlng.lat, radius: appMap.preGraph._mRadius }
                        }
                    }
                    ajax.ajax({
                        method: 'post',
                        type: "post",
                        url: window.hostConfig.JzGzHostUrl+'/jcss/getListByQueryParam',
                        data: JSON.stringify(paramData),
                        dataType: "json",
                        withCredentials: true,
                        contentType: 'application/json',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function(res){
                        res.data.forEach(function (item) {
                            item.lon = item.lng;
                            item.type = 'camera'
                        })
                        that.allPoint[type] = res.data;
                        that.clusterType[type] = new Cluster(that.allPoint[type], 'camera', that.addPointWithEvent, '', that.ajax, mapInstance, that.cb, cluster);
                        that.addMapEventListener(type, type)
                        setTimeout(function(){typeof cb == 'function' && cb();},100);
                    })
                    return;
                }
                ajax.get(window.hostConfig.JzGzHostUrl+'/jcss/getTwList?pageNum=1&pageSize=120000').then(function(data){
                    that.allPoint[type] = [];
                    if(data.code == 200){
                        data.data.rows.forEach(function(item){
                            item.lon = item.lng;
                            item.type = 'camera'
                        })
                        that.allPoint[type] = data.data.rows;
                        that.clusterType[type] = new Cluster(that.allPoint[type], 'camera', that.addPointWithEvent, "", that.ajax, mapInstance, that.cb, cluster);
                        that.addMapEventListener(type, type);
                        that.clusterType[type].show = true;
                        setTimeout(function(){typeof cb == 'function' && cb();},100);
                    }
                })
            }
            // if (typeof cb == "function") {
            //     cb("OK")
            // }
        },
        //自定义范围上图
        addCustomeRangePoints: function (range) {
            this._removeAllDrawPoints();
            var arr = range.split(',');
            var lonlats = [];
            for (var i = 0; i < arr.length; i += 2) {
                lonlats.push({ lon: parseFloat(arr[i]), lat: parseFloat(arr[i + 1]) })
            }
            lonlats.push(lonlats[0])
            this.getAllInsidePoints(lonlats, 'poly');
        },
        //自定义范围上图
        getCustomeRangePoints: function (range, points) {
            var arr = range.split(',');
            var lonlats = [];
            for (var i = 0; i < arr.length; i += 2) {
                lonlats.push({ lon: parseFloat(arr[i]), lat: parseFloat(arr[i + 1]) })
            }
            lonlats.push(lonlats[0]);
            return this.getPointsInRange(lonlats, 'poly', points);
        },
        /**
         * 添加某种类型的热力图
         * @param {*} points 点集合， 经纬度字段必须为 lng ,lat 数字类型
         * @param {*required object} config like: {container: document.querySelector('#map'), backgroundColor: rgba(,,,), gradient:{'.5:'blue','.8':'red','.95':'white'}
         * @param {*} type 点类型 如：'car', 'police'
         */
        addHeatMap: function (points, config, type) {
            if (Array.isArray(points)) {
                points.forEach(function (item) {
                    item.count = 1;
                })
                that.mapInstance.appMap.addHotCoordChart(20, points, config);
                return;
            }
            var that = this;
            var url;
            if (this.overlayType.tunnel[type]) {
                url = addPoint + "/" + this.overlayType.tunnel[type].name
            } else if (type == 'wifi') {
                url = wifi;
            } else if (type == 'police' || type == "police1") {
                url = pliceForces;
            } else if (type == 'person') {
                url = focusedPeople + "/" + getNowFormatDate();
            } else if (type == 'car') {
                url = getFocusedCar + "/" + getNowFormatDate();
            } else {
                return;
            }
            this.ajax.get(url).then(function (data) {
                var res;
                if (typeof data == 'string') {
                    res = JSON.parse(data);
                } else if (Array.isArray(data)) {
                    res = data;
                } else if (data && Array.isArray(data.data)) {
                    res = data.data;
                }
                res.forEach(function (item) {
                    item.lng = item.longitude || (item.ksJd && parseFloat(item.ksJd)) || (item.lng && parseFloat(item.lng));
                    item.lat = item.latitude || (item.ksWd && parseFloat(item.ksWd)) || (item.lat && parseFloat(item.lat));
                    item.count = 1;
                })
                that.mapInstance.appMap.addHotCoordChart(20, res, { container: container });
            })
        },
        removeHeatMap: function () {
            if (this.mapInstance.appMap.heatmapOverlay) {
                this.mapInstance.appMap.map.removeOverlay(this.mapInstance.appMap.heatmapOverlay)
            }
        },
        getPoly: function (appMap) {
            var poly;
            if (appMap.preGraph) {
                if (appMap.preGraph.type == 'rect') {
                    var arr = appMap.preGraph.coordString.split(",");
                    poly = { maxLon: arr[4], minLon: arr[0], maxLat: arr[3], minLat: arr[1] };
                } else if (appMap.preGraph.type == 'circle') {
                    poly = { lon: appMap.preGraph._latlng.lng, lat: appMap.preGraph._latlng.lat, radius: appMap.preGraph._mRadius }
                } else if (appMap.preGraph.type == 'poly') {
                    var arr = appMap.preGraph.coordString.split(',');
                    borders = appMap.preGraph.coordString + ',' + arr[0] + ',' + arr[1]
                    poly = [];
                    for (var i = 0; i < arr.length; i += 2) {
                        poly.push({ lon: parseFloat(arr[i]), lat: parseFloat(arr[i + 1]) })
                    }
                    poly.push(poly[0])
                } else if (appMap.preGraph.type == 'line') {
                    poly = appMap.preGraph.coordString;
                }
            }
            return poly;
        },
        removePoints: function (type) {
            var appMap = this.mapInstance.appMap;
            var poly = ['circle', 'rect', 'poly'];
            if (poly.indexOf(type) >= 0) {
                if (appMap.preGraph) {
                    appMap.map.removeOverlay(appMap.preGraph);
                    appMap.preGraph = "";
                }
            }
            if(type == 'lineTunnel' || !type){
                //移除线通道
                this.lineOverlays.forEach(function (item) {
                    appMap.removeOverlayLine(item);
                })
                //移除收费站
                this.tolls.forEach(function(item){
                    appMap.removeOverlayPoint(item)
                })
                this.tolls = [];
            }
            if (!type) {
                for (var key in this.isCluster) {
                    this.isCluster[key] = false;
                    this.clusterType[key] && (this.clusterType[key].show = false);
                    delete this.clusterType[key];
                }
                for (var key in this.pgisPoints) {
                    if (this.pgisPoints.hasOwnProperty(key)) {
                        this.pgisPoints[key].show = false;
                    }
                }
                //清除画笔画的覆盖物
                if (appMap.preGraph) {
                    this.mapInstance.appMap.map.removeOverlay(appMap.preGraph);
                    appMap.preGraph = "";
                }
                //清除所有pgis点
                appMap.clearHotSpot();
                this._removeAllDrawPoints();
                //清除定时任务；
                this['timerpolice'] && clearInterval(this['timerpolice']);
                this['timerpolice1'] && clearInterval(this['timerpolice1']);
                return;
            }

            this.isCluster[type] = false;
            this.pgisPoints[type] && (this.pgisPoints[type].show = false);

            if (this.clusterType[type]) {
                this.clusterType[type].show = false;
                this.clusterType[type].removePoints();
                if (type == "lineTunnel") {
                    for (var i = 0; i < this.lineTunnels.length; i++) {
                        appMap.removeOverlayLine("mytunnel" + i);
                        for (var j = 0; j < this.lineTunnels[i].pointList.length; j++) {
                            appMap.removeOverlayPoint(this.lineTunnels[i].pointList[j].lon + '' + this.lineTunnels[i].pointList[j].lat + this.lineTunnels[i].pointList[j].img);
                        }
                    }
                }
                this.clusterType[type]="";
                this.allPoint[type] = "";
            }
            if (this.overlayType.pgisPoint[type]) {
                appMap.clearHotSpot(this.pgisPoints[type].name);
                this.clusterType[type] = "";
                this.allPoint[type] = "";
            }
            if (['circle', 'rect', 'poly', 'line'].indexOf(type) >= 0) {
                var flag = false;
                for (var key in this.isCluster) {
                    if (this.isCluster[key] && key != 'circle' && key != 'rect' && key != 'poly' && key != 'line') flag = true;
                }
                if (!flag) {
                    appMap.preGraph && appMap.getSelf && appMap.map.removeOverlay(appMap.preGraph);
                    appMap.preGraph = "";
                }
            }
            if (type == 'police' || type == "police1") {
                this['timer' + type] && clearInterval(this['timer' + type]);
            }
        },
        _removeAllDrawPoints: function () {
            var that = this;
            allDrawPoints.forEach(function (item) {
                that.mapInstance.appMap.removeOverlayPoint(item);
            })
        },
        addMapEventListener: function (cluster, pointType, points) {
            var appMap = this.mapInstance.appMap
            var that = this;
            appMap.map.uMap.on('zoomend dragend', function () {
                if (that.overlayType.pgisPoint[cluster] && !appMap.preGraph && !that.clusterType[cluster]) return;
                if (!that.isCluster[cluster] || !that.clusterType[cluster]) return;
                that.clusterType[cluster].startCluster(points);
                that.clusterType[cluster].show = true;
            })
        },
        //添加带有点击事件的线到地图
        addLineWithEvent: function (path, id, i, level) {
            this.lineOverlays.push("mytunnel" + i)
            var that = this;
            var line = this.mapInstance.appMap.addOverlayLine(
                "mytunnel" + i,
                path.join(","),
                "#e9ab18",
                5,
                "",
                true
            );
            line.addListener("click", function () {
                that.ajax(pointDetail + "/" + id + "/" + getNowFormatDate())
                    .then(function (data) {
                        line.openInfoWindowHtml(getHtml(data.data, level));
                    });
            });
        },
        //添加带有点击事件的点到地图
        addPointWithEvent: function (lon, lat, img, obj, size) {
            //警力
            if (img == 'mj' && obj && typeof size != 'number') {
                var imgs = {
                    '1': 'mj',
                    '2': 'terrist',
                    '3': 'police-car',
                    '4': 'police-kaidao',
                    '5': 'police-xunluo',
                    '6': 'police-moto',
                    '7': 'cash-car',
                    '8': 'police-xiaofang',
                    '0': 'police-other',
                    '10': 'social-car',
                    '11': 'police-kuaifan',
                    '20': 'police-helicopter',
                    '12': 'solider',
                    '13': 'duijiangji',
                    '30': '120',
                    '31': 'tongxun',
                    '32': 'electronic',
                    '33': 'gas',
                    '34': 'social-force',
                    '35': 'taxi',
                    '36': 'image-device',
                    '37': 'changpeng',
                    '38': 'soliders',
                    '39': 'light-car',
                    '21': 'dangerous-chemistry-car'
                }
                img = imgs[obj.policetypeid]
            }
            var pgis = ['hotel', 'kd', 'netbar', 'hospital', 'school', 'government', 'kakou']
            var that = this;
            allDrawPoints.push(lon + '' + lat);
            if(!lon || !lat) return;
            // if(obj && obj.mutiType){
            //     img = obj.img;
            // }
            var marker = this.mapInstance.appMap.addOverlayPoint(lon + '' + lat, lon, lat, img, "", size, false);
            var level = this.mapInstance.appMap.map.getZoomLevel();
            if (typeof size == 'number' && level < 18) {
                marker.addListener("click", function () {
                    var nextLevel = level + 3 <= 18 ? level + 3 : 18;
                    that.mapInstance.appMap.setMapCenter(lon, lat, nextLevel);
                })
                return;
            };
            that.flag = false;
            //右键
            marker.addListener('contextmenu', function (e) {
                setTimeout(function () {
                    that.flag = false;
                }, 200)
                if (that.flag == true) {
                    return;
                }
                that.flag = true;
                that.samePoints = [];
                if (that.clusterPoints) {
                    that.clusterPoints.forEach(function (item) {
                        if (item.lon == lon && item.lat == lat) {
                            that.samePoints = JSON.parse(JSON.stringify(item.points))
                        }
                    })
                }
                if (that.samePoints.length > 1) {
                    that.cb && that.cb(that.samePoints, 'contextmenu', e);
                } else {
                    that.cb && that.cb(obj, 'contextmenu', e);
                }
            })
            marker.addListener("click", function () {
                setTimeout(function () {
                    that.flag = false;
                }, 200)
                if (that.flag == true) {
                    return;
                }
                that.flag = true;
                that.samePoints = [];
                var isSync=false;  //是否异步加载方式
                if (that.clusterPoints) {
                    that.clusterPoints.forEach(function (item) {
                        if (item.lon == lon && item.lat == lat) {
                            that.samePoints = JSON.parse(JSON.stringify(item.points))
                        }
                    })
                }
                var bounds = that.mapInstance.appMap.map.getBoundsLatLng();
                if (that.samePoints.length < 2) {
                    var divide = (bounds._northEast.lat - bounds._southWest.lat) / 5;
                    that.mapInstance.appMap.setMapCenter(lon, lat + divide);
                }
                if (that.samePoints.length > 1) {
                    if(img == 'camera'){
                        isSync=true;
                        for(var key = 0; key < that.samePoints.length; key++){
                            (function(item){
                                that.ajax.get(window.hostConfig.hostIndexUrl+'/jz-gz/jcss/getSpdw?id=' + item.objectid).then(function(data){
                                    data = (typeof data == 'string') ? JSON.parse(data) :data;
                                    var location = ("foundervideo://{'isSingle':false,'isInsert':false,'ptzEnabled':true,'historyEnabled':true,'showList':false,'videoType':'" + data.videoType
                                    + "','videoIp':'" + data.videoIp + "','videoPort':'" + data.videoPort + "','userName':'" + data.userName + "','password':'" +
                                    data.password + "','videoList':[{'spmc':'" + item.mc + "','spbh':'" + data.spbh + "','tdbh':'" + data.tdbh + "'}]}")
                                    item.video = '<a href=' + location + '>观看</a>';
                                    if(key == that.samePoints.length){
                                        marker.openInfoWindowHtml(getListHtml(that.samePoints, 'pgis'));
                                    }
                                })
                            })(that.samePoints[key])
                        }
                        setTimeout(function(){that.cb && that.cb(obj);},100)
                        return;
                    }
                    var divide = (bounds._northEast.lat - bounds._southWest.lat) / 3.5;
                    that.mapInstance.appMap.setMapCenter(lon, lat + divide);
                    if (pgis.indexOf(img) >= 0) {
                        marker.openInfoWindowHtml(getListHtml(that.samePoints, 'pgis'));
                    } else if (img.indexOf('wifi') >= 0) {
                        marker.openInfoWindowHtml(getListHtml(that.samePoints, 'wifi'));
                    } else if (img.indexOf('mj') >= 0) {
                        marker.openInfoWindowHtml(getListHtml(that.samePoints, 'police'));
                        var index = 0;
                        that.samePoints.forEach(function (item) {
                            ++index;
                            addJinLiListener(item, marker, that.mapInstance, that.ajax, index)
                        })
                    } else if(img.indexOf('car') >= 0){
                        marker.openInfoWindowHtml(getListHtml(that.samePoints, 'car'));
                    } else {
                        marker.openInfoWindowHtml(getListHtml(that.samePoints));
                    }
                    addImgListener();
                    return;
                }
                //告警详情
                if(obj && obj.types == 'warning-point'){
                    getWarningDetail(obj.id)
                }
                if (obj && obj.type == 'camera') {
                    isSync=true;
                    var camera = document.querySelector('body>a[type = camera]');
                    if (camera) {
                        document.body.removeChild(camera);
                    }
                    that.ajax.get(window.hostConfig.JzGzHostUrl+'/jcss/getSpdw?id=' + obj.objectid).then(function(data){
                        data = (typeof data == 'string') ? JSON.parse(data) :data;
                        var a = document.createElement('a');
                        a.href = ("foundervideo://{'isSingle':false,'isInsert':false,'ptzEnabled':true,'historyEnabled':true,'showList':false,'videoType':'" + data.videoType
                            + "','videoIp':'" + data.videoIp + "','videoPort':'" + data.videoPort + "','userName':'" + data.userName + "','password':'" +
                            data.password + "','videoList':[{'spmc':'" + obj.mc + "','spbh':'" + data.spbh + "','tdbh':'" + data.tdbh + "'}]}")
                        a.id = obj.objectid;
                        a.type = 'camera'
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(function(){that.cb && that.cb(obj);},100)
                    })
                    return;
                } else if (obj && obj.customs && obj.layer != 'PGIS_JCSS_TXJKZY_PT') {
                    marker.openInfoWindowHtml(getPgisHtml(obj));
                }
                //卡口点击事件
                if (img == "kakou") {
                    marker.openInfoWindowHtml("<div class='tunnel-card'><div class='card-header'>" + obj.cardMouthName + "(" + obj.direction + ")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div></div>");
                } else if (obj.level == 1 || obj.level == 2 || obj.level == 0) {
                    isSync=true;
                    //卡点点击事件
                    that.ajax.get(pointDetail + "/" + obj.id + "/" + getNowFormatDate())
                        .then(function (data) {
                            data.data.lon = obj.lon;
                            data.data.lat = obj.lat;
                            data.data.id = obj.id;
                            marker.openInfoWindowHtml(getHtml(data.data, obj.level));
                            setTimeout(function(){that.cb && that.cb(obj, 'tunnel');},100)
                        });
                } else if (img == "tongdao_person") {
                    marker.openInfoWindowHtml(getKeyPersonHtml(obj, that.samePoints));
                    addImgListener()
                } else if (img == "car") {
                    marker.openInfoWindowHtml(getKeyCarHtml(obj, that.samePoints));
                    addImgListener()
                } else if (obj && obj.policetypeid) {
                    isSync=true;
                    // var bounds = that.mapInstance.appMap.map.getBoundsLatLng();
                    // var divide = (bounds._northEast.lat - bounds._southWest.lat) / 8;
                    // that.mapInstance.appMap.setMapCenter(obj.lon, obj.lat + divide);
                    marker.openInfoWindowHtml(getLoadingHtml());
                    that.ajax.get(policeDetail + '?gpsid=' + obj.id).then(function (data) {
                        Object.assign(data.data, obj)
                        marker.openInfoWindowHtml(getPoliceHtml(data.data, that.samePoints));
                        addJinLiListener(data.data, marker, that.mapInstance);
                        setTimeout(function(){that.cb && that.cb(obj)},100);
                    })
                } else if (img == "special_wifi" || img == "wifi") {
                    marker.openInfoWindowHtml(getWifiHtml(obj, that.samePoints));
                } else if (img == 'person') {
                    marker.openInfoWindowHtml(getQtPerson(obj, that.samePoints));
                    addImgListener()
                } else if (img == 'faceKakou') {
                    marker.openInfoWindowHtml(getFaceKakou(obj, that.samePoints));
                }
                if(!isSync){  //当开启以后，不执行代码
                    setTimeout(function(){that.cb && that.cb(obj);},100)
                }
            });
        },
        //获取当前地图上在画的圆内的所有点
        getAllInsidePoints: function (poly, type) {
            var points = {};
            for (var key in this.allPoint) {
                if (!this.isCluster[key]) continue;
                if (key == 'lineTunnel') continue;
                for (var i = 0; i < this.allPoint[key].length; i++) {
                    points[key] = points[key] ? points[key] : [];
                    if (this.isInside(this.allPoint[key][i], poly, type)) {
                        points[key].push(this.allPoint[key][i]);
                    }
                }
            }
            for (var key in points) {
                this.clusterType[key] && (this.clusterType[key].show = true);
                this.clusterType[key] && this.clusterType[key].startCluster(points[key]);
            }
        },
        //获取范围内的所有点
        getPointsInRange: function (poly, type, points) {
            var resPoints = [];
            for (var i = 0; i < points.length; i++) {
                if (this.isInside(points[i], poly, type)) {
                    resPoints.push(points[i]);
                }
            }
            return resPoints;
        },
        getPointsBesideLine: function (lines, allPoint) {
            var selectedPoints = {};
            var besidePoints = {};
            var lines = lines.split(',');
            for (var i = 0; i < lines.length; i++) {
                lines[i] = parseFloat(lines[i])
            }
            for (var key in allPoint) {
                if (!this.isCluster[key]) continue;
                selectedPoints[key] = allPoint[key];
            }

            for (var key in selectedPoints) {
                besidePoints[key] = besidePoints[key] ? besidePoints[key] : [];
                for (var i = 0; i < selectedPoints[key].length; i++) {
                    for (var j = 0; j < lines.length; j += 2) {
                        //一公里半径内的点
                        var circle = { lon: lines[j], lat: lines[j + 1], radius: 1000 }
                        if (this.isInside(selectedPoints[key][i], circle, 'circle')) {
                            if (besidePoints[key].indexOf(selectedPoints[key][i]) < 0) {
                                besidePoints[key].push(selectedPoints[key][i]);
                            }
                        }
                    }
                    for (var j = 0; j < lines.length - 3; j += 2) {
                        if (lines[j] > lines[j + 2] && (selectedPoints[key][i].lon > (lines[j] + 0.000001) || selectedPoints[key][i].lon < (lines[j + 2] - 0.000001))) {
                            continue;
                        }
                        if (lines[j + 2] > lines[j] && (selectedPoints[key][i].lon > (lines[j + 2] + 0.000001) || selectedPoints[key][i].lon < (lines[j] - 0.000001))) {
                            continue;
                        }
                        if (lines[j + 1] > lines[j + 3] && (selectedPoints[key][i].lat > (lines[j + 1] + 0.000001) || selectedPoints[key][i].lat < (lines[j + 3] - 0.000001))) {
                            continue;
                        }
                        if (lines[j + 3] > lines[j + 1] && (selectedPoints[key][i].lat > (lines[j + 3] + 0.000001) || selectedPoints[key][i].lat < (lines[j + 1] - 0.000001))) {
                            continue;
                        }
                        if (this._isPointNearLine({ lon: lines[j], lat: lines[j + 1] }, { lon: lines[j + 2], lat: lines[j + 3] }, selectedPoints[key][i])) {
                            if (besidePoints[key].indexOf(selectedPoints[key][i]) < 0) {
                                besidePoints[key].push(selectedPoints[key][i]);
                            }
                        }
                    }
                }
            }
            for (var key in besidePoints) {
                this.clusterType[key].show = true;
                this.clusterType[key] && this.clusterType[key].startCluster(besidePoints[key]);
            }
        },
        //点是否在一条线段的指定距离内
        _isPointNearLine: function (point1, point2, point3) {
            //点斜式计算两条互相垂直线的交点
            var k1 = (point2.lat - point1.lat) / (point2.lon - point1.lon);
            var k2 = (point1.lat - point2.lat) / (point2.lon - point1.lon);
            var b1 = point1.lat - k1 * point1.lon;
            var b2 = point3.lat - k2 * point3.lon;
            var crosspoint = {}
            crosspoint.lon = (b2 - b1) / (k1 - k2);
            crosspoint.lat = k1 * crosspoint.lon + b1;
            var R = 6378137;
            var lat1 = crosspoint.lat * Math.PI / 180.0;
            var lat2 = point3.lat * Math.PI / 180.0;
            var a = lat1 - lat2;
            var b = (crosspoint.lon - point3.lon) * Math.PI / 180.0;
            var d, sa2, sb2;
            sa2 = Math.sin(a / 2.0);
            sb2 = Math.sin(b / 2.0);
            d = 2 * R * Math.asin(Math.sqrt(sa2 * sa2 + Math.cos(lat1) * Math.cos(lat2) * sb2 * sb2));
            if (d < 1000) {
                return true;
            } else {
                return false;
            }
        },
        dataServiceLayer: function (dataObjects, gxdwdm, icon, layerName, titleDefault) {
            var template = '<table class="zebra"><tbody>';
            for (var key in dataObjects) {
                template += '<tr><td>' + dataObjects[key] + '</td><td>' + key + '</td></tr>';
            }
            template += '</tbody></table>';
            var paramTwo = {
                hotSpotClick: function (pop) {
                    var obj = pop.contentData;
                    if (obj.TYPE == 'PGIS_JCSS_TXJKZY_PT') {
                        var camera = document.querySelector('body>a[type = camera]');
                        if (camera) {
                            document.body.removeChild(camera);
                        }
                        //点击单个天网，不显示详情
                        // marker.openInfoWindowHtml(getPgisHtml(obj));
                        var types = {
                            zjdh: 1, zgdx: 3, lykj: 4, dfwl: 5, hkws: 6, zjys: 8, zxdz: 9
                        }
                        var type = types[obj.customs.SPCSBS];
                        var a = document.createElement('a');
                        a.href = ("foundervideo://{'isSingle':false,'isInsert':false,'ptzEnabled':true,'historyEnabled':true,'showList':false,'videoType':'" + type
                            + "','videoIp':'" + obj.customs.IPDZ + "','videoPort':'" + obj.customs.PORT + "','userName':'" + obj.customs.USERNAME + "','password':'" +
                            obj.customs.PASSWORD + "','videoList':[{'spmc':'" + obj.customs.MC + "','spbh':'" + obj.customs.FLDM + "','tdbh':'" + obj.customs.TDBH + "'}]}")
                        a.id = obj.id;
                        a.type = 'camera'
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(function () {
                            document.querySelector('.leaflet-popup-close-button').style.opacity = 0;
                        }, 10)
                    } else {
                        var data = pop.contentData.customs;
                        var title = data.MC ? data.MC : titleDefault;
                        var showInfoFormat = dataObjects;
                        $(".leafvar-popup-content").css("width", "330px !important");
                        $(".leafvar-popup-content").css("height", "200px !important");
                        $(".leafvar-popup-content").attr("white-space", "nowrap");
                        var html = "<div class='KKItem' style='width: 300px;background: #0d283c;border:0px solid #ddd;position:relative;padding-bottom:10px;'>" +
                            "<div class='infoMessDiv' title='" + title + "' style='cursor:default;width:100%;height: 30px;background: #09385a;line-height: 30px;border-bottom: #D0D0D0;padding-left: 10px;font-size: 14px;color: #fff;'>" +
                            title +
                            "</div>";
                        for (key in showInfoFormat) {
                            if (data[key])
                                html += "<div class='infoMessDiv' style='padding-top: 3px; padding-bottom:3px;'><span style='margin-left: 10px;font-size:13px;color:#fff'>" + showInfoFormat[key] + "</span>：<span style='font-size:13px;color:#fff' title='" + showInfoFormat[key] + "'>" + data[key] + "</span></div>";
                        }

                        html += "</div>";
                        pop.setContent(html);
                    }
                },
                colums: icon == 'camera' ? '' : dataObjects,
                template: icon == 'camera' ? null : template,
                where: icon == 'camera' ? " AND GXDWDM:*" + gxdwdm + "*" : " AND XIANJXZQHDM:*" + gxdwdm + "*",
                icon: icon,
            };
            this.mapInstance.appMap.addHotSpot(layerName, icon, paramTwo);
        },
        //判断一个点是否在多边形内
        isInside: function (point, poly, type) {
            var lat1 = parseFloat(point.lat || point.ksWd || point.latitude);
            var lng1 = parseFloat(point.lon || point.lng || point.ksJd || point.longitude);
            if (type == 'rect') {
                return poly.minLon <= lng1 && lng1 <= poly.maxLon && poly.minLat <= lat1 && lat1 <= poly.maxLat;
            } else if (type == 'poly') {
                var crosspoints = [];
                for (var i = 0; i < poly.length; i++) {
                    //计算 y = lat1 与多边形各个边的交点
                    if (i + 1 == poly.length) break;
                    if (poly[i].lat > poly[i + 1].lat) {
                        if (poly[i].lat > lat1 && poly[i + 1].lat < lat1) {
                            var x = (lat1 - poly[i].lat) * (poly[i + 1].lon - poly[i].lon) / (poly[i + 1].lat - poly[i].lat) + poly[i].lon
                            crosspoints.push(x);
                        }
                    } else {
                        if (poly[i].lat < lat1 && poly[i + 1].lat > lat1) {
                            var x = (lat1 - poly[i].lat) * (poly[i + 1].lon - poly[i].lon) / (poly[i + 1].lat - poly[i].lat) + poly[i].lon
                            crosspoints.push(x);
                        }
                    }
                }
                var left = 0,
                    right = 0;
                crosspoints.forEach(function (item) {
                    if (item < lng1) left++;
                    else right++;
                })
                if (left % 2 != 0 && right % 2 != 0) {
                    return true;
                } else {
                    return false;
                }
            } else if (type == "circle") {
                var PI = 3.14159;
                var EARTH_RADIUS = 6378137.0;
                var lat2 = parseFloat(poly.lat);
                var lng2 = parseFloat(poly.lon);
                var radLat1 = lat1 * PI / 180.0;
                var radLat2 = lat2 * PI / 180.0;
                var a = radLat1 - radLat2;
                var b = lng1 * PI / 180.0 - lng2 * PI / 180.0;
                var s =
                    2 *
                    Math.asin(
                        Math.sqrt(
                            Math.pow(Math.sin(a / 2), 2) +
                            Math.cos(radLat1) *
                            Math.cos(radLat2) *
                            Math.pow(Math.sin(b / 2), 2)
                        )
                    );
                s = s * EARTH_RADIUS;
                s = Math.round(s * 10000) / 10000.0;
                return s < parseFloat(poly.radius);
            }
        },
        getPgisPointsInRange: function (type, arr, polyType, cb, cluster) {
            var that = this;
            var appMap = this.mapInstance.appMap;
            for (var key in that.pgisPoints) {
                if (that.pgisPoints[key].show) {
                    (function (key, that) {
                        if (polyType == 'circle') {
                            var form = {
                                buffer: arr.radius,
                                filterCustom: 'LAYERNAME:(' + that.pgisPoints[key].name + ')',
                                keywords: "",
                                location: arr.lon + ',' + arr.lat,
                                maxFetchCount: 5000,
                                pageIndex: 0,
                                pageSize: 5000,
                                scope: "_NAMES",
                                sortBy: "_DIST",
                                timespan: new Date().getTime(),
                                type: "FQ",
                                url: 'http://www.pgis.sc/EzPOISearch/PoiSearchV1REST'
                            }
                        } else if (polyType == "rect") {
                            var form = {
                                bounds: arr.minLon + ',' + arr.minLat + ',' + arr.maxLon + ',' + arr.maxLat,
                                filterCustom: 'LAYERNAME:(' + that.pgisPoints[key].name + ')',
                                keywords: "",
                                maxFetchCount: 5000,
                                pageIndex: 0,
                                pageSize: 5000,
                                scope: '_NAMES',
                                timespan: new Date().getTime(),
                                type: 'FQ',
                                url: 'http://www.pgis.sc/EzPOISearch/PoiSearchV1REST',
                            }
                        } else if (polyType == 'poly') {
                            var form = {
                                polygon: arr,
                                buffer: 0,
                                filterCustom: 'LAYERNAME:(' + that.pgisPoints[key].name + ')',
                                keywords: "",
                                maxFetchCount: 5000,
                                pageIndex: 0,
                                pageSize: 5000,
                                scope: '_NAMES',
                                sortBy: '_DIST',
                                timespan: new Date().getTime(),
                                type: 'FQ',
                                url: 'http://www.pgis.sc/EzPOISearch/PoiSearchV1REST'
                            }
                        } else if (polyType == 'line') {
                            var form = {
                                type: 'FQ',
                                polyline: arr,
                                buffer: 5000,
                                sortBy: '_DIST',
                                scope: '_NAMES',
                                filterCustom: 'LAYERNAME:(' + that.pgisPoints[key].name + ')',
                                pageIndex: 0,
                                pageSize: 5000,
                                keywords: "",
                                timespan: new Date().getTime(),
                                maxFetchCount: 5000,
                                url: 'http://www.pgis.sc/EzPOISearch/PoiSearchV1REST'
                            }
                        }
                        that.ajax.ajax({
                            method: 'post',
                            type: "post",
                            url: proxyHost + '/PGISMap/ProxyServlet?time=' + new Date().getTime(),
                            data: that.qs.stringify(form),
                            dataType: "json",
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then(function (data) {
                            if (data.groups && data.groups[0]) {
                                data.groups[0].pois.forEach(function (item) {
                                    item.lon = item.x;
                                    item.lat = item.y;
                                })
                                that.allPoint[key] = data.groups[0].pois;
                                if (that.clusterType[key]) {
                                    that.clusterType[key].startCluster(that.allPoint[key]);
                                } else {
                                    that.clusterType[key] = new Cluster(that.allPoint[key], that.pgisPoints[key].img, that.addPointWithEvent, 17, that.ajax, that.mapInstance, that.cb, cluster);
                                    that.addMapEventListener(key, key)
                                }
                                that.clusterType[key].show = true;
                                appMap.clearClusterHotSpot({
                                    imgId: that.pgisPoints[key].img,
                                    layerName: that.pgisPoints[key].name
                                });
                                setTimeout(function(){typeof cb == 'function' && cb();},100);
                            }
                        })
                    })(key, that)
                }
            }
        }
    }

    if (typeof define === "function" && define.amd) {
        define('MapToolMenuPlugin', MapToolMenuPlugin);
    }
    if (typeof exports === "object") {
        module.exports = MapToolMenuPlugin;
    }
    window.MapToolMenuPlugin = MapToolMenuPlugin;
})(window, location)

function mapToolToPersonInfo(e) {
    var zjhm = $(e).data('zjhm');
    var wuweiddModal = {
        flg: true,
        data: { idCardNo: zjhm }
    }
    window.Vuesal && window.Vuesal.$store.commit('wuweiddModal', wuweiddModal)
}
window.mapToolToPersonInfo = mapToolToPersonInfo;

function getWarningDetail(id){
    var warningDetailModal = {
        flg: true,
        data: id
    }
    window.Vuesal && window.Vuesal.$store.commit('warningDetailModal', warningDetailModal)
}
window.getWarningDetail = getWarningDetail;
