window.ezMap = {
    /**
     *参数说明：[]表示图层组,数组中[0]表示图层名,[1]表示图层的URL.具体图层的坐标系统配置方法,参考地图服务配置信息
     *参数类型：
     *取值范围：无限制
     *默认值：无3857
     *http://a.tile.openstreetmap.org/{z}/{x}/{y}.png
     */
    MapSrcURL: [
        ["矢量地图-蓝色", window.hostConfig.pgisTileUrl+"/pgis-img/PGIS_S_TileMapServer/Maps/QSLST/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3", {
            //["矢量地图","http://80.2.21.33/PGIS_S_TileMapServer/Maps/SL/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3",{
            //["矢量地图","http://10.64.1.172:3534/PGIS_S_TileMapServer/Maps/SL/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3",{
            crs: "4326",
            isTDT: true,
            isEzMap: false,
            print: true,
            layers: "SL",
            maxZoom: 20,
            minZoom: 1,
            is7: true
        }],
        //["矢量地图-白色","http://10.64.1.170:3534/PGIS_S_TileMapServer/Maps/QSLST/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3",{
        ["矢量地图-白色", window.hostConfig.pgisTileUrl+"/pgis-white/PGIS_S_TileMapServer/Maps/SL/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3", {
            //["矢量地图","http://10.64.1.172:3534/PGIS_S_TileMapServer/Maps/SL/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3",{
            crs: "4326",
            isTDT: true,
            isEzMap: false,
            print: true,
            layers: "SL",
            maxZoom: 20,
            minZoom: 1,
            is7: true
        }],
        ["矢影地图", "http://www.pgis.sc/PGIS_S_TileMapServer/Maps/DJ/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3", {
            crs: "4326",
            isTDT: true,
            isEzMap: false,
            print: true,
            layers: "PGIS_JCSS_TXJKZY_PT",
            maxZoom: 20,
            minZoom: 1,
            is7: true
        }],
        ["影像地图", "http://www.pgis.sc/PGIS_S_TileMapServer/Maps/YX/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3", {
            crs: "4326",
            isTDT: true,
            isEzMap: false,
            print: true,
            layers: "YX",
            maxZoom: 20,
            minZoom: 1,
            is7: true
        }],
        ["天地图矢量", "http://www.pgis.sc/PGIS_S_TileMapServer/Maps/TDTSL/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3", {
            crs: "4326",
            isTDT: true,
            isEzMap: false,
            print: true,
            layers: "TDTDLG",
            maxZoom: 20,
            minZoom: 1,
            is7: true
        }],
        ["天地图影像", "http://www.pgis.sc/PGIS_S_TileMapServer/Maps/TDTYX/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3", {
            crs: "4326",
            isTDT: true,
            isEzMap: false,
            print: true,
            layers: "TDTDLGDOM",
            maxZoom: 20,
            minZoom: 1,
            is7: true
        }],
        ["天地图矢影", "http://www.pgis.sc/PGIS_S_TileMapServer/Maps/TDTDJ/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3", {
            crs: "4326",
            isTDT: true,
            isEzMap: false,
            print: true,
            layers: "TDTDOM",
            maxZoom: 20,
            minZoom: 1,
            is7: true
        }]
    ],
    /**
     * 参数说明：webgl图层参数配置
     * 参数类型：terrainProvider 地形图层
     *          imageProvider 影像图层支持多个顺序执行
     *          S3MTilesLayer 模型图层支持多个顺序执行
     */
    Layer3D: {
        realspaceUrl: "http://10.70.60.41:8090/iserver/services/3D-ganzixian/rest/realspace",
        terrainProvider: {
            url: "http://10.70.60.41:8090/iserver/services/3D-ganzixian/rest/realspace/datas/GZXdem_WGS84@ganzi",
            isSct: true//是否允许跨域
        },
        imageProvider: [{
            url: "http://10.70.60.41:8090/iserver/services/3D-ganzixian/rest/realspace/datas/%E7%94%98%E5%AD%9C%E5%8E%BF%E5%9F%8E84@ganzi",
            isFly: true
        }],
        S3MTilesLayer: [{
            //url:"http://10.70.60.41:8090/iserver/services/3D-ganzixian/rest/realspace/datas/%E7%94%98%E5%AD%9C%E5%8E%BF%E9%81%93%E8%B7%AF@ganzi/config",
            url: "http://10.70.60.41:8090/iserver/services/3D-ganzixian/rest/realspace/datas/%E7%94%98%E5%AD%9C%E5%8E%BF%E5%8C%BA%E5%88%92%E8%BE%B9%E7%95%8C%E7%BA%BF@ganzi/config",
            name: "ganzixian"
        }]
    },
    /**
     *参数说明：图层组控制方式，EzServerClient提供两种控制方式，一种是弹出框Radio（1）；一种是按钮组（2）
     *参数类型：int
     *取值范围：无限制
     *默认值：无
     */
    layersControlStyle: 1,

    /**
     *参数说明：设置地图初始化中心位置
     *参数类型：{[2]Float} 长度为2的Float类型数组
     *取值范围：无限制
     *默认值：无
     *参数举例：如下所示
     */
    //CenterPoint:[104.08105,30.66747],
    //CenterPoint:[117.26855,31.83496],
    CenterPoint: [103.350634765625, 30.3419921875],
    /**
     *参数说明：设置全图显示时地图显示范围
     *参数类型：{[2][[2]Float]} 长度为2的坐标类型数据
     *取值范围：无限制
     *默认值：无
     *参数举例：如下所示
     */
    MapFullExtent: [
        [45.87890625, 0.8074951171875142],
        [178.59375, 83.42468261718751]
    ],

    /**
     *参数说明：设置地图初始显示级别
     *参数类型：{int}
     *取值范围：无限制
     *默认值：无
     *参数举例：如下所示
     */
    MapInitLevel: 6,

    /**
     *参数说明：设置地图显示的最大级别
     *参数类型：{int}
     *取值范围：[0,22]
     *默认值：无
     *参数举例：如下所示
     */
    MapMaxLevel: 18,

    /**
     *参数说明：设置地图显示的最小级别
     *参数类型：{int}
     *取值范围：[0,22]
     *默认值：无
     *参数举例：如下所示
     */
    MapMinLevel: 7,

    /**
     *参数说明：设置瓦片地图起始锚点，目前，标准锚点为左上角为原点（false），改参数用于支持EzServer老版本地图切片，锚点坐标为[0,0]（true）
     *参数类型：bool
     *取值范围：{无限制}
     *默认值：true EzServer地图
     *参数举例：如下所示
     */
    TileAnchorPoint: false,

    /**
     *参数说明：设置地图坐标系类型：经纬度坐标系为1；地方坐标时为114699
     *参数类型：{Int}
     *取值范围：无限制
     *默认值：无
     *参数举例：如下所示
     */
    MapCoordinateType: 1,
    EzMapServiceURL: "http://172.25.16.129:7001/EzMapServiceV7.4.6_FlexPGIS2.0"
};

window.MapConfig = {
    //全文检索服务地址
    SearchServerUrl: "http://www.pgis.sc/EzPOISearch",
    //SearchServerUrl: "http://10.64.1.174:3850/EzPOISearch",
    //SearchServerUrl: "http://www.pgis.sc/EzPOISearch/",
    //地图客户端
    EzMapClientUrl: "http://www.pgis.sc/EzServerClientV7_gs/",
    //代理地址
    ProxyUrl: "http://www.pgis.sc/PiService-Proxy",
    //图标控制
    MulSerch: "http://www.pgis.sc/PGIS_FW_SERVICE",
    //图层配置
    LayerName: {
        TXJKZY: "PGIS_JCSS_TXJKZY_PT",  //视频
        XFZY: "PGIS_XFGL_XFJCSS_PT",  //消防基础设施
        ZAFKX: "ZAGL_ZAFKX_PL"   //治安防控线
    },
    YWConfig: {
        RLL: [
        ]
    }
}


//图片对象
MapImage = function (id, url, w, h) {
    this.imgId = null;
    this.imgUrl = null;
    this.width = 32;
    this.height = 32;
    if (id) this.imgId = id;
    if (url) this.imgUrl = url;
    if (w) this.width = w;
    if (h) this.height = h;
}
//图片列表对象
MapImageList = function (u) {
    this.url = u;
    this.imgList = new Array();
    this.init();
}
MapImageList.prototype =
    {
        init: function () {
            var str = window.hostConfig.pgisMapUrl+"/pgisMap";
            
            var url = (window.pgisCurUrl ? window.pgisCurUrl + '/static/map/icon/marks' : null) || window.hostConfig.hostIndexUrl+'/static/map/icon/marks/'
            this.imgList.push(new MapImage("RLTCKD", str + "/examples/themes/image/tl2.png", 14, 14));
            this.imgList.push(new MapImage("RLTGMD", str + "/examples/themes/image/tl.png", 38, 38));
            this.imgList.push(new MapImage("red", str + "/examples/themes/image/red.gif", 38, 38));
            this.imgList.push(new MapImage("redMin", str + "/examples/themes/image/red.gif", 14, 14));
            this.imgList.push(new MapImage("point", str + "/examples/themes/image/point.png", 5, 5));
            this.imgList.push(new MapImage("Police", str + "/examples/themes/image/kzz.png", 30, 30));
            this.imgList.push(new MapImage("mj", str + "/examples/themes/image/mj.png", 30, 30));
            this.imgList.push(new MapImage("video", str + "/examples/themes/image/video.png", 30, 30));
            this.imgList.push(new MapImage("tunnel", str + "/examples/themes/image/tunnel.png", 25, 25));
            this.imgList.push(new MapImage("person", str + "/examples/themes/image/person1.png", 20, 25));
            this.imgList.push(new MapImage("kd", str + "/examples/themes/image/kadian.png", 30, 30));
            this.imgList.push(new MapImage("kakou", str + "/examples/themes/image/mapicon3.png", 30, 30));
            this.imgList.push(new MapImage("wangba", str + "/examples/themes/image/wangba.png", 35, 30));
            this.imgList.push(new MapImage("lvdian", str + "/examples/themes/image/lvdian.png", 35, 30));
            this.imgList.push(new MapImage("policeTwo", str + "/examples/themes/image/tj.png", 30, 30));
            this.imgList.push(new MapImage("test", str + "/examples/themes/image/kzz.gif", 60, 60));

            this.imgList.push(new MapImage("zdryOne", str + "/examples/themes/image/one.gif", 40, 40));
            this.imgList.push(new MapImage("zdryTwo", str + "/examples/themes/image/two.gif", 35, 35));
            this.imgList.push(new MapImage("zdryThree", str + "/examples/themes/image/three.gif", 30, 30));

            this.imgList.push(new MapImage("yellow", str + "/examples/themes/image/temple/yellow.png", 40, 40));
            this.imgList.push(new MapImage("flower", str + "/examples/themes/image/temple/flower.png", 35, 35));
            this.imgList.push(new MapImage("white", str + "/examples/themes/image/temple/white.png", 30, 30));
            this.imgList.push(new MapImage("black", str + "/examples/themes/image/temple/black.png", 40, 40));
            this.imgList.push(new MapImage("hot", str + "/examples/themes/image/temple/red.png", 35, 35));

            this.imgList.push(new MapImage("gjRed", str + "/examples/themes/image/red.png", 35, 35));
            this.imgList.push(new MapImage("gjBlue", str + "/examples/themes/image/blue.png", 35, 35));
            this.imgList.push(new MapImage("exit3", str + "/examples/themes/image/barrier.png", 22, 22));
            this.imgList.push(new MapImage("exit2", str + "/examples/themes/image/barrier.png", 18, 18));
            this.imgList.push(new MapImage("exit1", str + "/examples/themes/image/barrier.png", 20, 20));
            this.imgList.push(new MapImage("exit4", str + "/examples/themes/image/barrier.png", 22, 22));

            //聚集点
            this.imgList.push(new MapImage("fuhui", str + "/examples/themes/image/fuhui.gif", 80, 80));
            this.imgList.push(new MapImage("jinjing", str + "/examples/themes/image/jinjing.gif", 80, 80));
            this.imgList.push(new MapImage("juji", str + "/examples/themes/image/juji.gif", 80, 80));
            this.imgList.push(new MapImage("yuejie", str + "/examples/themes/image/yuejie.gif", 80, 80));
            //jintang
            this.imgList.push(new MapImage("pinfan", str + "/examples/themes/image/pinfan.png", 30, 30));
            this.imgList.push(new MapImage("goback", str + "/examples/themes/image/person1.png", 25, 33));
            this.imgList.push(new MapImage("jintang_juji", str + "/examples/themes/image/jintang_juji.gif", 80, 80));
            this.imgList.push(new MapImage("juji-more", str + "/examples/themes/image/juji-more.gif", 80, 80));
            this.imgList.push(new MapImage("dxPorint", str + "/examples/themes/image/tl2.png", 1, 1));

            //通道
            this.imgList.push(new MapImage("exit", str + "/examples/themes/image/barrier.png", 25, 25));
            this.imgList.push(new MapImage("location", str + "/examples/themes/image/location.png", 30, 30));
            this.imgList.push(new MapImage("firstClass", str + "/examples/themes/image/firstClass.png", 35, 35));
            this.imgList.push(new MapImage("secondClass", str + "/examples/themes/image/secondClass.png", 35, 35));
            this.imgList.push(new MapImage("thirdClass", str + "/examples/themes/image/thirdClass.png", 35, 35));
            this.imgList.push(new MapImage("rong", str + "/examples/themes/image/rong.png", 35, 35));
            this.imgList.push(new MapImage("other", str + "/examples/themes/image/other.png", 35, 35));
            this.imgList.push(new MapImage("lineTunnel", str + "/examples/themes/image/lineTunnel.png", 35, 35));
            this.imgList.push(new MapImage("chuan", str + "/examples/themes/image/chuan.png", 35, 35));
            this.imgList.push(new MapImage("automobile", str + "/examples/themes/image/automobile.png", 31, 31));
            this.imgList.push(new MapImage("trafficPolice", str + "/examples/themes/image/trafficPolice.png", 34, 34));
            this.imgList.push(new MapImage("safe", str + "/examples/themes/image/safe.png", 34, 34));
            this.imgList.push(new MapImage("danger", url + "danger.png", 26, 26));
            this.imgList.push(new MapImage("police", url + "menu/police1-selected.png", 22, 22));
            this.imgList.push(new MapImage("police1", url + "menu/police1.png", 22, 22));
            this.imgList.push(new MapImage("map", url + "menu/police1.png", 22, 22));
            this.imgList.push(new MapImage("airport", url + "/airport.png", 30, 30));
            this.imgList.push(new MapImage("tunnel-airport", url + "/tunnel-airport.png", 33, 33));
            this.imgList.push(new MapImage("toll", url + "/tunnel-toll.png", 33, 33));
            this.imgList.push(new MapImage("dock", url + "/tunnel-dock.png", 33, 33));
            this.imgList.push(new MapImage("school", url + "/school.png", 33, 33));
            this.imgList.push(new MapImage("hospital", url + "/hospital.png", 33, 33));
            this.imgList.push(new MapImage("government", url + "/gv.png", 33, 33));
            this.imgList.push(new MapImage("hotel", url + "/hotel.png", 33, 33));
            this.imgList.push(new MapImage("netbar", url + "/netbar.png", 33, 33));
            this.imgList.push(new MapImage("special_wifi", url + "special_wifi.png", 33, 33));
            this.imgList.push(new MapImage("wifi", url + "wifi.png", 33, 33));
            this.imgList.push(new MapImage("camera", url + "/camera.png", 30, 30));
            this.imgList.push(new MapImage("faceKakou", url + "/faceKakou.png", 33, 33));
            this.imgList.push(new MapImage("train", url + "/tunnel-train.png", 30, 30));
            this.imgList.push(new MapImage("car", url + "/car.png", 33, 33));
            this.imgList.push(new MapImage("chuan-1", url + "/chuan-1.png", 30, 30));
            this.imgList.push(new MapImage("chuan-2", url + "/chuan-2.png", 30, 30));
            this.imgList.push(new MapImage("chuan-3", url + "/chuan-3.png", 30, 30));
            this.imgList.push(new MapImage("rong-1", url + "/rong-1.png", 30, 30));
            this.imgList.push(new MapImage("rong-2", url + "/rong-2.png", 30, 30));
            this.imgList.push(new MapImage("rong-3", url + "/rong-3.png", 30, 30));
            this.imgList.push(new MapImage("tongdao_person", url + "/name.png", 33, 33));
            this.imgList.push(new MapImage("kakou-warning", url + "/focus-person.gif", 30, 30));
            this.imgList.push(new MapImage("zang", url + "/zang.png", 33, 33));
            this.imgList.push(new MapImage("highWay", url + "/tunnel-toll.png", 30, 30));

            this.imgList.push(new MapImage("police-kaidao", url + "/police-kaidao.png", 40, 40));
            this.imgList.push(new MapImage("police-xunluo", url + "/police-xunluo.png", 40, 40));
            this.imgList.push(new MapImage("police-moto", url + "/police-moto.png", 40, 40));
            this.imgList.push(new MapImage("police-xiaofang", url + "/police-xiaofang.png", 40, 40));
            this.imgList.push(new MapImage("police-other", url + "/police-other.png", 40, 40));
            this.imgList.push(new MapImage("police-kuaifan", url + "/police-kuaifan.png", 40, 40));
            this.imgList.push(new MapImage("police-helicopter", url + "/police-helicopter", 40, 40));
            this.imgList.push(new MapImage("terrist", url + "/terrist.png", 40, 30));
            this.imgList.push(new MapImage("police-car", url + "/police-car.png", 40, 20));
            this.imgList.push(new MapImage("cash-car", url + "/cash-car.png", 40, 20));
            this.imgList.push(new MapImage("social-car", url + "social-car.png", 40, 20));
            this.imgList.push(new MapImage("solider", url + "/solider.png", 30, 30));
            this.imgList.push(new MapImage("duijiangji", url + "/duijiangji.png", 40, 30));
            this.imgList.push(new MapImage("120", url + "/120", 40, 30));
            this.imgList.push(new MapImage("tongxun", url + "/tongxun.png", 40, 30));
            this.imgList.push(new MapImage("electronic", url + "/electronic", 40, 30));
            this.imgList.push(new MapImage("gas", url + "/gas.png", 40, 30));
            this.imgList.push(new MapImage("social-force", url + "/social-force", 40, 30));
            this.imgList.push(new MapImage("taxi", url + "/taxi", 40, 30));
            this.imgList.push(new MapImage("image-device", url + "/image-device", 40, 30));
            this.imgList.push(new MapImage("changpeng", url + "/changpeng", 40, 30));
            this.imgList.push(new MapImage("soliders", url + "/soliders", 30, 30));
            this.imgList.push(new MapImage("light-car", url + "/light-car", 40, 30));
            this.imgList.push(new MapImage("dangerous-chemistry-car", url + "/dangerous-chemistry-car", 40, 30));

            //安保
            this.imgList.push(new MapImage("start", url + "/startPoint.png", 23, 30));
            this.imgList.push(new MapImage("end", url + "/endPoint.png", 23, 30));
            this.imgList.push(new MapImage("important", url + "/importantPoint.png", 23, 30));
            this.imgList.push(new MapImage("cross", url + "/crossPoint.png", 23, 30));
            this.imgList.push(new MapImage("entry", url + "/entryPoint.png", 20, 20));
            this.imgList.push(new MapImage("tunPolice", url + "/police_other.png", 25, 30));
            this.imgList.push(new MapImage("sentryPost", url + "/sentryPost.png", 25, 30));
            this.imgList.push(new MapImage("highPoint", url + "/high_point.png", 25, 30));
            this.imgList.push(new MapImage("trafficControlPoint", url + "/traffic_control_point.png", 25, 30));
            this.imgList.push(new MapImage("parkingLot", url + "/parking_lot.png", 25, 30));
            this.imgList.push(new MapImage("otherPoint", url + "/other_point.png", 25, 30));

            //甘孜
            this.imgList.push(new MapImage("folks1", str + "/examples/themes/image/folks1.png", 87, 44));
            this.imgList.push(new MapImage("folks2", str + "/examples/themes/image/folks2.png", 87, 44));
            this.imgList.push(new MapImage("gz-juji", str + "/examples/themes/image/gz-juji.png", 68, 68));
            this.imgList.push(new MapImage("huodong", str + "/examples/themes/image/huodong.png", 112, 44));
            this.imgList.push(new MapImage("huodongL", str + "/examples/themes/image/huodong-L.png", 67, 68));
            this.imgList.push(new MapImage("locationGz", str + "/examples/themes/image/location-gz.png", 112, 44));
            this.imgList.push(new MapImage("man", str + "/examples/themes/image/man.png", 87, 44));
            this.imgList.push(new MapImage("manL", str + "/examples/themes/image/man-L.png", 67, 68));
            this.imgList.push(new MapImage("redSpot", str + "/examples/themes/image/red-spot.png", 20, 20));
            this.imgList.push(new MapImage("templeBlack", str + "/examples/themes/image/temple-black.png", 58, 58));
            this.imgList.push(new MapImage("templeHua", str + "/examples/themes/image/temple-hua.png", 58, 58));
            this.imgList.push(new MapImage("templeRed", str + "/examples/themes/image/temple-red.png", 58, 58));
            this.imgList.push(new MapImage("templeWhite", str + "/examples/themes/image/temple-white.png", 58, 58));
            this.imgList.push(new MapImage("templeYellow", str + "/examples/themes/image/temple-yellow.png", 58, 58));
            this.imgList.push(new MapImage("templeNot", str + "/examples/themes/image/temple/templeNot.png", 58, 58));
            this.imgList.push(new MapImage("templateStatics", str + "/examples/themes/image/template-statics.png", 87, 44));

            this.imgList.push(new MapImage("videoGz", str + "/examples/themes/image/videoGz.png", 25, 20));
            this.imgList.push(new MapImage("jlGz", str + "/examples/themes/image/jlGz.png", 20, 20));

            this.imgList.push(new MapImage("activityss", str + "/examples/themes/image/temple/activityss.png", 58, 58));
            this.imgList.push(new MapImage("lvdianGz", str + "/examples/themes/image/temple/lvdian.png", 45, 50));
            this.imgList.push(new MapImage("phoneGz", str + "/examples/themes/image/temple/phone.png", 45, 50));
            this.imgList.push(new MapImage("planeGz", str + "/examples/themes/image/temple/plane.png", 45, 50));
            this.imgList.push(new MapImage("subwayGz", str + "/examples/themes/image/temple/subway.png", 45, 50));
            this.imgList.push(new MapImage("wangbaGz", str + "/examples/themes/image/temple/wangba.png", 45, 50));

            this.imgList.push(new MapImage("kp1", str + "/examples/themes/image/keyPersonPosition1.png", 28, 35));
            this.imgList.push(new MapImage("kp2", str + "/examples/themes/image/keyPersonPosition2.png", 28, 35));
        },
        getImage: function (imgId) {
            for (var i = 0; i < this.imgList.length; i++) {
                if (this.imgList[i].imgId == imgId) { return this.imgList[i]; }
            }
        },
        getImageUrl: function (imgId) {
            for (var i = 0; i < this.imgList.length; i++) {
                if (this.imgList[i].imgId == imgId) { return this.imgList[i].imagUrl; }
            }
        },
        addImage: function (id, url, w, h) {
            this.imgList.push(new MapImage(id, url, w, h));
        }
    }







