var pgisMapUrl = window.hostConfig.pgisMapUrl+"/pgisMap/";
var Util = {};
var xg = null;

var MapApp = function () {
    this.isInit = false;
    this.map = null;
    this.imgList = null;
    this.proUrl = "";
    this.preGraph = "";
    //临时变量定义
    this.buffColor = "#517CB7";
    this.groupHotSpot = {};
    this.multiLayerHotSpot = {};
    //图层列表
    this.overlayPointList = new Array();     //点标记图层
    this.overlayPolylineList = new Array();  //线标记图层
    this.overlayPolygonList = new Array();   //面标记图层
    this.overlayYAList = new Array();       //预案标记
    this.overlayABList = new Array();       //安保标记
    this.overlayAJBZList = new Array();     //案件标注标记
    //回调函数定义
    //this.onMapLoad=null;              //地图加载完成
    this.onMapZoom = null;              //地图缩放事件回调	
    this.onMapPan = null;               //地图拖动事件回调	
    this.titleLayer = null;
    this.init();
    this.options = null;
    this.onTDMapLoad = null;
    this.heatmapOverlay = null;

}
MapApp.prototype = {
    getXmlHttp: function () {
        var xmlHttp = null;
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest()
        } else if (window.ActiveXObject) {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP")
            } catch (e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
        return xmlHttp
    }, getXmlDocument: function () {
        var xmlDoc = null;
        if (window.ActiveXObject) {
            try {
                xmlDoc = new ActiveXObject("Msxml2.DOMDocument")
            } catch (e) {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
            }
        } else if (document.implementation && document.implementation.createDocument) {
            xmlDoc = document.implementation.createDocument("", "", null)
        }
        return xmlDoc
    }
}
MapApp.prototype = {
    init: function () {
        this.proUrl = this.getContextPath();
        this.imgList = new MapImageList(this.proUrl);
    },
    //zoom改变监听并回调
    onZoomChange: function (cb) {
        if (typeof cb == 'function') {
            this.map.addMapEventListener(EzEvent.MAP_ZOOMEND, cb);
        }
    },
    //地图加载
    mapOnLoad: function (options, callback) {
        var changeEvent, delEntityEvent;
        if (this.map) {
            changeEvent = this.map.mapChangeEvent,
                delEntityEvent = this.map.delEntityEvent;
        }
        if (typeof EzMap == "undefined") {
            if (typeof (options.mapDivId) == "string") {
                var pEle = document.getElementById(options.mapDivId);
                pEle.innerHTML = "EzMap地图引擎为空类型，请检查地图引擎！";
            }
            window.setTimeout("this.mapOnLoad(" + options.mapDivId + ")", 10);
            return;
        }
        this.options = options;
        this.map = new EzMap(document.getElementById(options.mapDivId), options.is3DMap);
        xg = this.map;
        this.map.initialize2();

        if (!this.isInit && !this.map.is3DMap) {
            this.isInit = true;
            this.addLayerChangeView(options.mapDivId);
        }

        //鹰眼
        var pOverview = new OverView();
        pOverview.width = 200;
        pOverview.height = 200;
        pOverview.minLevel = 8;
        pOverview.maxLevel = 10;
        this.map.addOverView(pOverview);
        //缩放条
        this.map.showStandMapControl();
        //this.map.addMapEventListener(EzEvent.MAP_READY, function (e) { if (callback != null) { callback(); } });
        //this.map.addMapEventListener(EzEvent.MAP_READY,function(e){window.setTimeout(function(){if(_mapServer.onMapLoad!=null){_mapServer.onMapLoad();}},500);});

        this.map.addMapEventListener(EzEvent.MAP_MOUSEMOVE, function (e) {
            if (this.onMapZoom != null) {
                var level = this.map.getZoomLevel();
                this.onMapZoom(level);
                //如果地图到达15级,跳转到街景页面
                /*if(level>=15){
                    $("#mapDiv").html(StreetViewHtml);
                   var mbr= this.map.getBoundsLatLng();
                   var center=mbr.getCenter();
                    initStreeView(center);
                    $("#pano-return-btn").show();
                }*/
            }
        });
        this.map.addMapEventListener(EzEvent.MAP_PANEND, function (e) {
            if (this.onMapPan != null) {
                this.onMapPan();
            }
        });
        if (changeEvent &&
            typeof changeEvent === "function") {
            this.map.mapChangeEvent = changeEvent;
            changeEvent();
        }
        if (delEntityEvent &&
            typeof changeEvent === "function") {
            this.map.delEntityEvent = delEntityEvent;
        }


        if (callback != null) { callback(); }

        //this.addOverLayers(this.map.uMap, this.map.ezMapLayers["titleLayer"]);

    },
    /**
     * 服务器必须支持jsonp
     * @param url
     * @param callback
     */
    jsonp: function (url, callback) {
        $.getJSON(url + "&callback=?",
            function (data) {
                callback && callback(data);
            });
    },
    //地图上叠加图层
    addOverLayers: function (map, layer) {
        map.addLayer(layer);
    },
    //获取线的中心点
    getLineCenterPoint: function (linePoints) {
        if (!linePoints) { return; }
        var sx, sy, ex, ey;
        var a = linePoints.split(",");
        sx = parseFloat(a[0]);
        sy = parseFloat(a[1]);
        ex = parseFloat(a[a.length - 2]);
        ey = parseFloat(a[a.length - 1]);
        var intvx = (sx < ex) ? ex - sx : sx - ex;
        var intvy = (sy < ey) ? ey - sy : sy - ey;
        var x = (sx < ex) ? (sx + intvx / 2) : (ex + intvx / 2);
        var y = (sy < ey) ? (sy + intvx / 2) : (ey + intvy / 2);
        return [x, y];
    },
    //测距
    measureLength: function () {
        this.map.changeDragMode("measure2", function (data) { });
    },
    //测面
    measureArea: function () {
        var that = this;
        if (this.map.is3DMap) {
            this.map.changeDragMode("measureArea", function () {
            });
            return;
        }
        this.map.changeDragMode("drawPolygon", function (data) {
            var sum = that.map.measureArea(data).toString();
            sum = sum.substr(0, sum.lastIndexOf(".") + 2) + "<b>M<sup>2</sup></b>";
            that.toShowDataHandle(data, sum);
        });
    },
    //添加热力图
    addHotCoordChart: function (max, data, option) {
        /*var convertData = function (d) {
            var min=0;
            var max=0;
            var res = [];
            for (var i = 0; i < d.length; i++) {
                var geoCoord = p[d[i].name];
                if (geoCoord) {
                    min=Math.min(min,d[i].value);
                    max=Math.max(max,d[i].value);
                    res.push({
                        lng:geoCoord[0],
                        lat:geoCoord[1],
                        count:d[i].value
                    });
                }
            }
            return {max:max,min:min,data:res};
        };*/
        var inputdata = {
            max: max,
            min: 0,
            data: data
        }
        if (this.heatmapOverlay) {
            this.map.removeOverlay(this.heatmapOverlay);
        }
        this.heatmapOverlay = new HeatMapOverlay(this.map, option);
        this.map.addOverlay(this.heatmapOverlay);
        this.heatmapOverlay.setData(inputdata);
    },
    //画点
    drawPoint: function (callback) {
        if (!callback) {
            return;
        }
        this.map.changeDragMode('drawPoint', function (point) {
            //var point = new Point(parseFloat(pointStr.lng), parseFloat(pointStr.lat));
            //var marker = this.getGeometryPoint(point,imgId);
            //this.map.addOverlay(marker);
            if (!point) {
                return;
            }
            if (callback) { callback(point.lng, point.lat, point); }
        });
    },
    //画线
    drawPolyline: function (callback, drawColor, options) {
        var that = this;
        if (!callback) {
            return;
        }
        var key = "drawPolyline";
        if (this.map.is3DMap) {
            key += '2';
        }
        this.map.changeDragMode(key, function (path) {
            if (that.preGraph) {
                that.map.removeOverlay(that.preGraph);
            };
            that.preGraph = path;
            path.type = 'line';
            if (callback) { callback(path.coordString, path); }
        }, null, null, drawColor, options);
    },
    //画圆
    drawCircle: function (callback) {
        var that = this;
        this.map.changeDragMode('drawCircle', function (o) {
            // if (that.preGraph) {
            //     that.map.removeOverlay(that.preGraph);
            // };
            that.preGraph = o;
            o.type = 'circle';
            if (callback) { callback(o._latlng.lng + "," + o._latlng.lat + "," + o._mRadius); }
        });
    },
    //画矩形
    drawRectangle: function (callback) {
        var that = this;
        this.map.changeDragMode('drawRect', function (o) {
            if (that.preGraph) {
                that.map.removeOverlay(that.preGraph);
            };
            that.preGraph = o;
            o.type = 'rect';
            if (callback) { callback(o.coordString); }
        });
    },
    //画多边形
    drawPolygon: function (callback, options) {
        var that = this;
        this.map.changeDragMode('drawPolygon', function (o) {
            if (that.preGraph) {
                that.map.removeOverlay(that.preGraph);
            };
            that.preGraph = o;
            o.type = 'poly';
            if (callback) {
                callback(o);
            }
        }, false, null, null, options);
    },
    //获取屏幕范围
    getMapScreenScope: function (callback) {
        var mbr = this.map.getBoundsLatLng();
        if (callback) { callback(mbr.getWest(), mbr.getSouth(), mbr.getEast(), mbr.getNorth()); }
    },
    //设置地图中心
    setMapCenter: function (lon, lat, mapLevel) {
        var centerPoint = new Point(parseFloat(lon), parseFloat(lat));
        if (mapLevel) {
            if (typeof (mapLevel) != "number") { mapLevel = parseInt(mapLevel); }
            this.map.centerAndZoom(centerPoint, mapLevel);
        } else {
            this.map.centerAtLatLng(centerPoint);
        }
    },
    /**
     * 设置地图中心
     * @param id 唯一标示
     * @param bType 业务类型（YA：预案,AB:安保,AJ:案件）
     */
    setMapCenterById: function (id, bType) {
        var list = [];
        if (bType == "YA") { list = this.overlayYAList; }
        else if (bType == "AB") { list = this.overlayABList; }
        else if (bType == "AJ") { list = this.overlayAJBZList; }
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                switch (list[i].geoType) {
                    case "point": {
                        var centerPoint = (list[i].overlay).getPoint();
                        this.map.centerAtLatLng(centerPoint); break;
                    }
                    case "polyline":
                    case "polygon": {
                        var mbr = (list[i].overlay).getMBR();
                        this.map.centerAtLatLng(mbr.getCenter());
                        break;
                    }
                }
                return;
            }
        }
    },
    /**
     * 根据ID获取marker
     * @param id 唯一标示
     * @param bType 业务类型（YA：预案,AB:安保,AJ:案件）
     */
    getOverlayPoint: function (id, bType) {
        var list = [];
        if (bType == "YA") { list = this.overlayYAList; }
        else if (bType == "AB") { list = this.overlayABList; }
        else if (bType == "AJ") { list = this.overlayAJBZList; }
        else { list = this.overlayPointList; }
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return list[i].overlay;
            }
        }
    },
    //添加文本输入框
    addInputTextOverlay: function (callback, x, y, imgId) {
        var that = this;
        var uuid = Math.uuid();
        var html = '<div style="width: 200px;height:110px;outline:1px solid #838068;position:relative;background-color:white;">' +
            '  <div style="padding-left: 4px;padding-top: 5px;">' +
            '    <textarea id="txt' + uuid + '" style="width: 190px;height: 68px;"></textarea>' +
            '  </div>' +
            '  <div style="width:200px;height:40px;">' +
            '    <input id="btn' + uuid + '" type="button" value="确定" style="float:right;width:70px;height:25px;background-color:#2a9cdd;margin-right: 5px;color:white;margin-top: 5px;border:none;outline:none">' +
            '  </div>' +
            '</div>';
        var point = new Point(parseFloat(x), parseFloat(y));
        var marker = this.getGeometryPoint(point, imgId);
        this.map.addOverlay(marker);
        marker.openInfoWindowHtml(html);
        $("#btn" + uuid).bind("click", function () {
            var data = $("#txt" + uuid).val();
            marker.closeInfoWindowHtml();
            that.map.removeOverlay(marker);
            if (callback) { callback(data); }
        });
        return marker;
    },
    //添加文本信息
    addTextOverlay: function (id, x, y, title) {
        var point = new Point(parseFloat(x), parseFloat(y));
        var textMarker = this.getTitleMark(point, title, 0);
        this.map.addOverlay(textMarker);
        return textMarker;
    },
    //添加可换行的文本信息
    addHtmlOverlay: function (id, x, y, html, iconAnchor) {
        var point = new Point(parseFloat(x), parseFloat(y));
        var htmlMarker = new HTMLElementOverLay("", point, html, null, iconAnchor);
        this.map.addOverlay(htmlMarker);
        return htmlMarker;
    },

    /**
     * 添加点标记
     * @param id 点位的唯一标示
     * @param *lon 经度
     * @param *lat 纬度
     * @param imgId 图标ID
     * @param html 泡泡框显示
     * @param title 标题
     * @param 其他参数
     * @widthHeightObj 自定义宽高
     * @selfImgObj 自定义图片对象
     * @param ifDrag 点位是否可拖拽
     */
    addOverlayPoint: function (id, lon, lat, imgId, html, title, isAutoOpenHtml, offset, isHideBoder, callback,options,ifDrag,titleUniqueId, dataObject, widthHeightObj, selfImgObj) {
        var marker =null;
        if (id) {
            var isExist = false;
            for (var i = 0; i < this.overlayPointList.length; i++) {
                if (this.overlayPointList[i].id == id) {
                    marker=this.overlayPointList[i].overlay;
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                marker =this.addPoint(id, lon, lat, imgId, html, title, isAutoOpenHtml, offset, isHideBoder, callback,options,ifDrag,titleUniqueId, dataObject, widthHeightObj, selfImgObj);
                var obj = new Object(); obj.id = id; obj.overlay = marker;
                this.overlayPointList.push(obj);
            }
        }else{
            throw new Error("此MARKER已存在！");
        }
        return marker;
    },

    addPoint: function (id, lon, lat, imgId, html, title, isAutoOpenHtml, offset, isHideBoder, callback,options,ifDrag,titleUniqueId, dataObject, widthHeightObj, selfImgObj) {
        if(this.map.is3DMap){
            var marker = this.map.billboard({
                id:id,
                lon:lon,
                lat:lat,
                height:options&&options.height,
                imgId:imgId,
                imgUrl:this.imgList.getImage(imgId).imgUrl,
                title:title,
                callback:options&&options.callback,
                position:options&&options.position,
                description:html,
                fontSize:options&&options.fontSize||16,
                fontColor:options&&options.fontColor||"blue",
                isSelect:options&&options.isSelect||false,
                isClamapToGround:options&&options.isClamapToGround,
                labelBackgroundColor:options&&options.labelBackgroundColor,
				markerNum:options&&options.markerNum
            });
			
            callback&&callback();
            return marker;
        }
        var point = new Point(parseFloat(lon), parseFloat(lat));
        var marker = '';
        if (widthHeightObj) {
            marker = this.getGeometryPoint(point, imgId, widthHeightObj.width, widthHeightObj.height, selfImgObj);
        } else {
            marker = this.getGeometryPoint(point, imgId, "", "", selfImgObj);
        }
        if(ifDrag){
            marker.uMarker.options.draggable = true;
        }
        //添加html属性
        marker.id = id;
        marker.html = html;
		marker['dataObject']=dataObject;
        //点击事件
        marker.addListener("click", function () {
            if (marker.html) { marker.openInfoWindowHtml(marker.html); }
            if (callback) { callback(marker); }
        });
        var titleMarker = null;
        var titleMarkerNum = null;
        var h=marker.uMarker.options.icon.imgH;
        var w=marker.uMarker.options.icon.imgW;
		var classTitle = "";
		if(options){
			classTitle = options.classTitle;
		}else{
			classTitle = "markerTitle"; 
		}
        if (title) { 
			titleMarker = this.getTitleMark(point, title,h , offset, isHideBoder,classTitle,titleUniqueId); 
		}
        if (options && options.markerNum) { titleMarkerNum = this.getTitleMarkNum(point, options.markerNum,w,h); }
        marker.titleOverlay = titleMarker;
        marker.titleOverlayNum = titleMarkerNum;
        //上图
        this.map.addOverlay(marker);
        if (titleMarker) { this.map.addOverlay(titleMarker); }
        if (titleMarkerNum) {
            this.map.addOverlay(titleMarkerNum);
            titleMarkerNum.addListener("click", function () {
                if (marker.html) { marker.openInfoWindowHtml(marker.html); }
                if (callback) { callback(marker); }
            });
        }
        if (isAutoOpenHtml) {
            marker.openInfoWindowHtml(marker.html); }
        return marker;
    },

    getTitleMarkNum: function (point, title, imgW, imgH) {
        //文本框偏移到图片上方或按指定偏移量偏移
        var uuid = Math.uuid();
        var infoDiv = "<div class='markerTitleNum' style='width:" + imgW + "px' id='" + uuid + "'><span class='infoText'>" + title + "</span></div>";

        window.setTimeout(function () {
            var h = (parseInt(imgH) - document.getElementById(uuid).offsetHeight) / 2;
            document.getElementById(uuid).style.marginTop = -(parseInt(imgH) / 2 - h) + "px";
        }, 10);

        var w = parseInt(imgW) / 2;
        return new HTMLElementOverLay("", point, infoDiv, null, [w, 0]);
    },
    /**
     * 修改点标记
     * @param id 点位的唯一标示
     * @param *lon 经度
     * @param *lat 纬度
     * @param imgId 图标ID
     * @param html 泡泡框显示
     * @param title 标题（未实现）
     */
    updateOverlayPoint: function (id, lon, lat, imgId, html, title, options) {
        if (!id) { return; }
        var marker = null, nMarker = null;
        for (var i = 0; i < this.overlayPointList.length; i++) {
            var obj = this.overlayPointList[i];
            if (obj.id == id) {
                marker = obj.overlay;
                nMarker = this.updatePoint(marker, lon, lat, imgId, html, title, options);
                if (this.map.is3DMap) {
                    obj.overlay = nMarker;
                }
                break;
            }
        }
        if (nMarker) {
            return nMarker;
        }
        return marker;
    },
    updatePoint: function (marker, lon, lat, imgId, html, title, options) {
        if (this.map.is3DMap) {
            var imageUrl = null;
            if (!title) {
                title = marker._name;
            }
            if (imgId) {
                imageUrl = this.imgList.getImage(imgId).imgUrl
            }
            if (!imageUrl) {
                imageUrl = marker._billboard._image._value;
            }
            if (!lon && !lat) {
                lon = marker._lon;
                lat = marker._lat;
            }
            if (!html) {
                html = marker._des;
            }
            return this.map.updateBillboard(marker, {
                fontSize: options && options.fontSize || 16,
                fontColor: options && options.fontColor || "blue",
                lon: lon,
                lat: lat,
                imgUrl: imageUrl,
                title: title,
                description: html,
                labelBackgroundColor: options && options.labelBackgroundColor
            });
        }
        if (lon && lat) {
            var point = new Point(parseFloat(lon), parseFloat(lat));
            marker.setPoint(point);
        }
        if (imgId) {
            var icon = this.getMarkerIcon(imgId);
            marker.uMarker.setIcon(icon);
        }
        if (html) { marker.html = html; }
        if (title) {
            var offset = null;
            if (options && options.offset) {
                offset = options.offset;
            }
            this.map.removeOverlay(marker.titleOverlay);
            var point = marker.getPoint();
            var titleMark = this.getTitleMark(new Point(point.lng, point.lat), title, marker.uMarker.options.icon.imgH, offset, true);
            marker.titleOverlay = titleMark;
            this.map.addOverlay(titleMark);
            marker.showTitle();
        }
    },
    /**
     * 移除点标记
     * @param id 点位的唯一标示(无id则清空整个点图层)
     */
    removeOverlayPoint: function (id) {
        this.removeSingleOverlay(id, "point");
    },
    /**
     * 添加线标记
     * @param id 唯一标示
     * @param *points 坐标字符串x,y,x,y
     * @param color 线条颜色
     * @param width 宽度
     * @param opacity 透明度[0-1]
     */
    addOverlayLine: function (id, points, color, width, opacity, isShowDir, callback, options) {
        if (!isShowDir) isShowDir = false;
        var line;
        if (this.map.is3DMap) {
            line = this.map.addPolyline({
                id: id,
                name: options && options.name || '线',
                path: points,
                color: color,
                width: width,
                opacity: opacity,
                isArrow: isShowDir,
                description: options && options.description,
                isSelect: options && options.isSelect,
                callback: callback
            });
        } else {
            if (!width) width = 2;
            if (!opacity) opacity = 1;
            var colors = ["blue", "gray", "red", "yellow"];
            var num = parseInt(Math.random() * 3, 10);
            if (!color) color = colors[num];
            line = new Polyline(points, color, width, opacity, 1);
            line.clickCallBack = callback;
            line.addListener("click", function () { if (callback) { callback(line); } });
            this.map.addOverlay(line);
            if (isShowDir) { line.addArrowHead({ fill: color }); }
        }

        var isExist = false;
        for (var i = 0; i < this.overlayPolylineList.length; i++) { if (this.overlayPolylineList[i].id == id) { isExist = true; break; } }
        if (!isExist) {
            var obj = new Object(); obj.id = id; obj.overlay = line;
            this.overlayPolylineList.push(obj);
        }

        return line;
    },
    /**
     * 修改三维entity属性
     * @param entity
     * @param options
     */
    mergeEntity: function (entity, options) {
        if (options.description) {
            entity._description._value = options.description;
        }
    },
    /**
     * 根据ID获取entity对象
     * @param id
     * @returns {*}
     */
    getEntity: function (id) {
        if (id) {
            return this.map.viewer.entities.getById(id);
        }
    },
    /**
     * 修改线标记
     * @param id 唯一标示
     */
    updateOverlayLine: function (id, points, color, width, opacity, isShowDir) {
        if (!id) { return; }
        for (var i = 0; i < this.overlayPolylineList.length; i++) {
            if (this.overlayPolylineList[i].id == id) {
                var obj = this.overlayPolylineList[i];
                this.updateLine(obj, points, color, width, opacity, isShowDir);
                //以下代码也可以
                //if (points) {
                //    var pointStrArr = points.split(","); var pointArr = []; var j = 0;
                //    for (var i = 0; i < pointStrArr.length;) { pointArr[j] = EzServerClient.latLng(parseFloat(pointStrArr[i + 1]), parseFloat(pointStrArr[i])); i = i + 2; j++; }
                //    line.setPoints(pointArr);
                //}
                //if (color) { line.setColor(color); }
                //if (width) { line.setWidth(width); }
                //if (opacity) { line.setOpacity(opacity); }
                break;
            }
        }
    },
    updateLine: function (obj, points, color, width, opacity, isShowDir) {
        var line = obj.overlay;
        this.map.removeOverlay(line);
        if (!points) {
            var ps = line.getPoints();
            for (var j = 0; j < ps.length; j++) { points += ps[j].lng + "," + ps[j].lat + ","; }
            points = points.substr(0, points.length - 1);
        }
        if (!color) { color = line.getColor(); }
        if (!width) { width = line.getWidth(); }
        if (!opacity) { opacity = line.getOpacity(); }
        if (typeof isShowDir == "undefined" || isShowDir == null || isShowDir == "") { isShowDir = line.getArrowhead(); }
        var pLine = new Polyline(points, color, width, opacity);
        pLine.id = obj.id;
        pLine.clickCallBack = line.clickCallBack;
        pLine.addListener("click", function () { if (pLine.clickCallBack) { pLine.clickCallBack(pLine); } });
        this.map.addOverlay(pLine);
        obj.overlay = pLine;
        if (isShowDir) { pLine.addArrowHead({ fill: color }); }
    },
    /**
     * /删除线标记
     * @param id 唯一标示（无id则清空整个线标记图层）
     */
    removeOverlayLine: function (id) {
        this.removeSingleOverlay(id, "polyline");
    },
    /**
     * 添加面标记
     * @param id 唯一标示
     * @param *points 坐标字符串x,y,x,y
     * @param sideColor 边界颜色
     * @param innerColor 内部填充颜色
     * @param sideWidth 边界宽度
     * @param innerOpacity 内部透明度
     * @param callback 点击事件触发
     */
    addOverlayPolygon: function (id, points, sideColor, innerColor, sideWidth, innerOpacity, options) {
        if (!sideColor) sideColor = this.buffColor;
        if (!innerColor) innerColor = this.buffColor;
        if (!sideWidth) sideWidth = 2;
        if (!innerOpacity) innerOpacity = 0.8;
        var ploygon = null;


        if (!this.map.is3DMap &&
            points.split(",").length == 3) {
            ploygon = new Circle(points, sideColor, sideWidth, innerOpacity, innerColor);
            this.preGraph = ploygon.uCircle
            this.preGraph.type = 'circle'
        }
        else if (!this.map.is3DMap) {
            ploygon = new Polygon(points, sideColor, sideWidth, innerOpacity, innerColor);
        }


        if (ploygon) {
            ploygon.addListener("click", function () {
                options && options.callback && options.callback(ploygon);
            });
        }



        if (!id) {
            this.map.addOverlay(ploygon);
        }
        else {
            var isExist = false, nPolygon;
            for (var i = 0; i < this.overlayPolygonList.length; i++) {
                if (this.overlayPolygonList[i].id == id) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                nPolygon = this.map.addOverlay(ploygon, {
                    id: id,
                    name: options && options.name || id,
                    path: points,
                    type: "polygon",
                    sideColor: sideColor,
                    innerColor: innerColor,
                    sideWidth: sideWidth,
                    innerOpacity: innerOpacity,
                    color: sideColor,
                    //name:options&&options.name,
                    isSelect: options && options.isSelect,
                    description: options && options.description
                });
                var obj = new Object();
                obj.id = id;
                obj.overlay = ploygon;
                if (nPolygon) {
                    obj.overlay = nPolygon;
                }
                this.overlayPolygonList.push(obj);
            }
        }
        if (nPolygon) {
            return nPolygon;
        }

        return ploygon;
    },
    /**
     * 修改面标记
     * @param id 唯一标示
     */
    updateOverlayPolygon: function (id, points, sideColor, innerColor, sideWidth, innerOpacity) {
        if (!id) { return; }
        for (var i = 0; i < this.overlayPolygonList.length; i++) {
            if (this.overlayPolygonList[i].id == id) {
                var obj = this.overlayPolygonList[i];
                this.updatePolygon(obj, points, sideColor, innerColor, sideWidth, innerOpacity);
                break;
            }
        }
    },
    updatePolygon: function (obj, points, sideColor, innerColor, sideWidth, innerOpacity) {
        var polygon = obj.overlay;
        this.map.removeOverlay(polygon);
        if (!points) {
            var ps = polygon.getPoints();
            for (var j = 0; j < ps.length; j++) { points += ps[j].lng + "," + ps[j].lat + ","; }
            points = points.substr(0, points.length - 1);
        }
        if (!sideColor) { sideColor = polygon.getColor(); }
        if (!innerColor) { innerColor = polygon.getFillColor(); }
        if (!sideWidth) { sideWidth = polygon.getWeight(); }
        if (!innerOpacity) { innerOpacity = polygon.getFillOpacity(); }
        var p = new Polygon(points, sideColor, sideWidth, innerOpacity, innerColor);
        this.map.addOverlay(p);
        obj.overlay = p;
    },
    /**
     * /删除面标记
     * @param id 唯一标示（无id则清空整个线标记图层）
     */
    removeOverlayPolygon: function (id) {
        this.removeSingleOverlay(id, "polygon");
    },
    /**
     * 添加标记
     * @param *id 唯一标示
     * @param *geomeryType 几何类型
     * @param *bType 业务类型（YA：预案,AB:安保,AJ:案件）
     * @param param 几何类型初始参数，不同的几何类型参数不一样
     */
    addBusiOverlay: function (id, geomeryType, bType, param, callback) {
        if (!id) { return; }
        var list = [];
        if (bType == "YA") { list = this.overlayYAList; }
        else if (bType == "AB") { list = this.overlayABList; }
        else if (bType == "AJ") { list = this.overlayAJBZList; }
        var isExist = false;
        for (var i = 0; i < list.length; i++) { if (list[i].id == id) { isExist = true; break; } }
        if (!isExist) {
            var geometry = null;
            if (geomeryType == "point") {
                geometry = this.addOverlayPoint(id, param.x, param.y, param.imgId, param.html, param.title, param.isAutoOpenHtml, null, false, callback);  //返回mark对象
            } else if (geomeryType == "polyline") {
                geometry = this.addOverlayLine("", param.pointStr, param.color, param.width, param.opacity, param.isShowDir, callback);  //返回线对象
                geometry.id = id;
            } else if (geomeryType == "polygon") {
                geometry = this.addOverlayPolygon("", param.pointStr, param.sideColor, param.innerColor, param.sideWidth, param.innerOpacity);
                if (param.html) {
                    var centerpoint = geometry.getCenter();
                    if (!param.iconAnchor) { param.iconAnchor = [0, 0]; }
                    var title = this.addHtmlOverlay("", centerpoint[0], centerpoint[1], param.html, param.iconAnchor);
                    geometry.titleOverlay = title;
                }
                if (callback) { callback(geometry); }
            } else if (geomeryType == "text") {
                geometry = this.addTextOverlay("", param.x, param.y, param.title);
            } else if (geomeryType == "html") {
                geometry = this.addHtmlOverlay("", param.x, param.y, param.html, param.iconAnchor);
            }
            var obj = new Object(); obj.id = id; obj.geoType = geomeryType; obj.overlay = geometry;
            if (bType == "YA") { this.overlayYAList.push(obj); }
            else if (bType == "AB") { this.overlayABList.push(obj); }
            else if (bType == "AJ") { this.overlayAJBZList.push(obj); }
        }
    },
    /**
     * 修改标记
     */
    updateBusiOverlay: function (id, geomeryType, bType, param) {
        if (!id) { return; }
        var list = [];
        if (bType == "YA") { list = this.overlayYAList; }
        else if (bType == "AB") { list = this.overlayABList; }
        else if (bType == "AJ") { list = this.overlayAJBZList; }
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                var geometry = list[i].overlay;
                if (geomeryType == "point") {
                    this.updatePoint(geometry, param.x, param.y, param.imgId, param.html, param.title);
                } else if (geomeryType == "polyline") {
                    this.updateLine(list[i], param.pointStr, param.color, param.width, param.opacity, param.isShowDir);
                } else if (geomeryType == "polygon") {
                    this.updatePolygon(list[i], param.pointStr, param.sideColor, param.innerColor, param.sideWidth, param.innerOpacity);
                }
                break;
            }
        }
    },
    /**
     * 移除标记
     * @param id 唯一标示(id为空则清空整个对应的业务图层)
     * @param *bType 业务类型（YA：预案,AB:安保,AJ:案件）
     */
    removeBusiOverlay: function (id, bType) {
        if (!bType) { return; }
        this.removeSingleOverlay(id, bType);
    },
    //移除所有
    removeAllOverlay: function () {
        this.map.clear();
        this.overlayPointList = [];
        this.overlayPolylineList = [];
        this.overlayPolygonList = [];
        this.overlayYAList = [];
        this.overlayABList = [];
        this.overlayAJBZList = [];
        this.heatmapOverlay = null;
    },
    /**
     * 添加三维热点图
     * @param options
     */
    add3DHotSpot: function (options) {
        if (!options.filterCustom) options.filterCustom = "";
        var hotBase = MapConfig.SearchServerUrl +
            "/PoiWMTSV1?layer=" + options.layerName + "&filterCustom=" +
            options.filterCustom + "&group=" + options.group +
            encodeURI(encodeURI("&keywords=" + options.keywords || "")) +
            "&style=default&tilematrixset=d&Service=WMTS&Request=GetTile&Version=1.0.0&" +
            "Format=jsonv2&TileMatrix={z}&TileCol={x}&TileRow={y}",
            hotUrl;
        hotBase += "&callback=?";


        var imageryProvider = new Cesium.TileCoordinatesImageryProvider();
        var hotEntityCollection = this.map.viewer.entities;
        var template = options.template,
            description, reg,
            showInfoFormat = options.colums;
        if (!showInfoFormat) {
            showInfoFormat = { OBJECTID: "OBJECTID", NAME: "名称", DZMC: "地址", XZQHMC: "行政区划", GXDWMC: "管辖单位", XZQHMC: "行政区划", GXSJ: "更新时间", X: "经度", Y: "纬度", LXDH: "联系电话", LXR: "联系人" };
            showInfoFormat = { PID: "编号", MC: "名称" };
        }

        if (!template) {
            template = '<table class="zebra"><tbody>';
            template += "<tr><td>编号</td><td>{PID}</td></tr>";
            template += "<tr><td>名称</td><td>{MC}</td></tr>";
            template += "</tbody></table>"
        }
        //重写TileCoordinatesImageryProvider requestImage方法
        imageryProvider.requestImage = function (x, y, level) {
            loadHotPoint(x, y, level);
            var canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            var context = canvas.getContext('2d');

            var cssColor = this._color.toCssColorString();

            context.strokeStyle = cssColor;
            context.lineWidth = 2;
            context.strokeRect(1, 1, 255, 255);

            var label = 'L' + level + 'X' + x + 'Y' + y;
            context.font = 'bold 25px Arial';
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText(label, 127, 127);
            context.fillStyle = cssColor;
            context.fillText(label, 124, 124);

            return canvas;
        }

        var layer = this.map.viewer.imageryLayers.addImageryProvider(imageryProvider);
        layer.alpha = 0;
        layer._entitiesCache = {};


        function loadHotPoint(x, y, level) {
            level = level + 1;
            hotUrl = hotBase.replace("{x}", x).replace("{y}", y).replace("{z}", level);
            try {
                $.getJSON(hotUrl,
                    function (data) {
                        if (data && data.length > 0) {
                            addBillboard(data, level);
                        }
                    });
            } catch (e) {
                throw new Error(e);
            }
        }

        function addBillboard(data, level) {
            var item, marker;
            for (var i = 0; i < data.length; i++) {
                item = data[i];
                if (hotEntityCollection.getById(item.id)) {
                    return;
                }
                layer._entitiesCache[item.id] = true;
                marker = this.map.billboard({
                    id: item.id,
                    lon: item.x,
                    lat: item.y,
                    imgUrl: options.imgUrl,
                    title: item.name,
                    description: createDescription(item),
                    fontSize: options.fontSize || 16,
                    fontColor: options.fontColor || "blue",
                    isNotLabel: true
                });
            }

            /**
             * 创建description
             * @param item
             */
            function createDescription(item) {
                if (item) {
                    description = template;
                    for (var key in showInfoFormat) {
                        reg = new RegExp("\{" + key + "\}", "g");
                        description = description.replace(reg, item.customs[key]);
                    }
                    return description;
                }
                return null;
            }
        }
        return layer;
    },
    /**
     * 清除三维热点图层
     * @param layer 热点图对象
     */
    clear3DHotSpot: function (layer) {
        if (layer._entitiesCache) {
            for (var key in layer._entitiesCache) {
                this.map.viewer.entities.removeById(key);
            }
        }
        this.map.viewer.imageryLayers.remove(layer);
    },
    /**
     * 聚合类默认参数设置
     */
    clusterDefaultOptions: {
        markers: new Array(),
        markerTemplate: '<a class="hotmark" style="width:{width}px;height:{width}px;">' +
            '<span class="hotmarkbg"></span><b style="border-color:{color};">' +
            '<span class="spaninbg" style="background:{color};opacity:0.7;">' +
            '<span class="spantext">{orgname}</span>{total}</span></b>' +
            '<ul class="markul">{layerstatic}</ul></a>',
        markerInfoTemplate: '<li style="background:{color};"><span class="{setclass}"></span><span>{value}:{{name}}</span></li>',
        infoOptions: [
            { name: "syrknum", value: "人口", color: "#50B432", setclass: "glyphicon glyphicon-user" },
            { name: "sydwnum", value: "单位", color: "#058DC7", setclass: "icomoon iconJB-location2" },
            { name: "syfwnum", value: "房屋", color: "#64E572", setclass: "icomoon iconJB-office" },
            { name: "bzdznum", value: "地址", color: "#FF9655", setclass: "icomoon iconJB-home" }
        ],
        clusterProviders: [{
            //省级
            url: "examples/themes/data/clusterExample.json",
            options: {
                llevel: 1
            },
            style: [{
                count: 1000000,
                color: "red",
                width: 80
            }],
            maxLevel: 11,
            minLevel: 10
        }, {
            //市级
            url: "examples/themes/data/clusterExample.json",
            options: {
                llevel: 2
            },
            style: [{ count: 3000000, color: "green", width: 60 },
            { count: 5000000, color: "blue", width: 65 },
            { count: 8000000, color: "orange", width: 70 },
            { count: 1000000, color: "red", width: 75 }
            ],
            maxLevel: 12,
            minLevel: 12
        }, {
            //县级
            url: "examples/themes/data/clusterExample.json",
            options: {
                llevel: 3
            },
            style: [{ count: 200000, color: "green", width: 60 },
            { count: 500000, color: "blue", width: 65 },
            { count: 800000, color: "orange", width: 70 },
            { count: 1000000, color: "red", width: 75 }],
            maxLevel: 13,
            minLevel: 13
        }, {
            //派出所
            url: "examples/themes/data/clusterExample.json",
            options: {

            },
            addOptions: function () {
                var extent = this.map.uMap.getBounds(),
                    minx = extent._southWest.lng,
                    maxx = extent._northEast.lng,
                    miny = extent._southWest.lat,
                    maxy = extent._northEast.lat;
                return {
                    minx: minx,
                    maxx: maxx,
                    miny: miny,
                    maxy: maxy
                }
            },
            style: [{ count: 10000, color: "green", width: 60 },
            { count: 50000, color: "blue", width: 65 },
            { count: 80000, color: "orange", width: 70 },
            { count: 100000, color: "red", width: 75 }],
            maxLevel: 14,
            minLevel: 14
        }],
        hotSpotProvider: {
            layerName: "PGIS_JCSS_TXJKZY_PT",
            imgId: "clusterHotSpot",
            maxLevel: 20,
            minLevel: 15,
            group: "",
            keywords: "",
            where: ""
        }
    },
    /**
     * 聚合热点图
     * @param options
     */
    clusterHotSpot: function (options) {
        options = Util.extend(this.clusterDefaultOptions, options);
        this._registerEventer(options.clusterProviders);
        this.addHotSpot(options.layerName,
            options.imgId,
            options.hotSpotProvider);
    },
    /**
     * 清除聚合热点图
     * @param options
     */
    clearClusterHotSpot: function (options) {
        var list = this.clusterDefaultOptions.markers;
        for (var i = 0; list && i < list.length; i++) {
            this.map.removeOverlay(list[i]);
        }
        this.clearHotSpot(options.layerName, this.map.hotSpotLayer);
        this.clusterDefaultOptions.markers = new Array();
    },
    /**
     * 聚合注册事件
     * @param dataProviders
     * @private
     */
    _registerEventer: function (dataProviders) {
        if (this.map.is3DMap) {
            return this._register3DEventer(dataProviders);
        }

        var provider;
        this.map.uMap.on("zoomend", function () {
            var markers = this.clusterDefaultOptions.markers;
            markers = this._clearClusterMarkers(markers);
            for (var i = 0; i < dataProviders.length; i++) {
                provider = dataProviders[i];
                if (this._checkIsRequest(provider)) {
                    if (provider.addOptions) {
                        provider.options = Util.extend(provider.options,
                            provider.addOptions());
                    }
                    provider.options.markers = markers;
                    this._clusterRequest(provider.url,
                        provider.options,
                        this._clusterMarker)
                }

            }
        });

    },
    /**
     * 加载聚合数据
     * @param provider
     * @private
     */
    _loadClusterMarker: function (provider) {
        if (provider.addOptions) {
            provider.options = Util.extend(provider.options,
                provider.addOptions());
        }
        provider.options.markers = markers;
        if (this._checkIsRequest(provider)) {
            this._clusterRequest(provider.url,
                provider.options,
                this._clusterMarker)
        }
    },
    /**
     * 聚合3D注册事件
     * @param dataProviders
     * @private
     */
    _register3DEventer: function (dataProviders) {

    },
    /**
     * 如果接口支持jsonp,url中带上返回标识
     * @param url
     * @param param
     * @private
     */
    _clusterRequest: function (url, param, callback) {
        if (url.indexOf("http") < 0) {
            url = this.proUrl + url;
        }
        $.getJSON(url, param, function (result) {
            callback && callback(result, param);
        });
    },
    /**
     * 检查是否触发聚合请求
     * @param options
     * @private
     */
    _checkIsRequest: function (options) {
        var level = this.map.getZoomLevel();
        if (level > options.maxLevel) {
            return false;
        }
        if (level < options.minLevel) {
            return false;
        }
        return true;
    },
    /**
     * 根据单个数据集，获取总数
     * @param item
     * @returns {*}
     * @private
     */
    _calculateMarkerValue: function (item) {
        var total = 0,
            array = this.clusterDefaultOptions.
                infoOptions;
        for (var j = 0; j < array.length; j++) {
            total += parseInt(item[array[j].name]);
        }
        return total;
    },
    /**
     * 根据展示数据计算marker样式
     * @param num
     * @private
     */
    _calculateMarkerStyle: function (styleArray, num) {
        for (var i = 0; i < styleArray.length; i++) {
            if (num <= styleArray[i].count) {
                return styleArray[i];
            }
        }
        return {
            color: "red",
            width: 80
        }
    },
    /**
     * 初始话聚合marker
     * @param result
     */
    _clusterMarker: function (result, options) {
        var markerTemplate = "", markerInfo, marker, markerStyle, item, total, markerIcon;

        for (var j = 0; j < this.clusterDefaultOptions.infoOptions.length; j++) {
            markerTemplate += this._fillTemplate(this.clusterDefaultOptions.markerInfoTemplate,
                this.clusterDefaultOptions.infoOptions[j]);
        }

        for (var i = 0; result && i < result.length; i++) {
            item = result[i];
            total = this._calculateMarkerValue(item);
            markerStyle = this._calculateMarkerStyle(item,
                total);
            markerInfo = this._fillTemplate(markerTemplate, item);
            markerStyle.total = total;
            markerStyle.layerstatic = markerInfo;

            item.x = item.zbx;
            item.y = item.zby;

            marker = this._fillTemplate(this.clusterDefaultOptions.markerTemplate, markerStyle);
            marker = this._fillTemplate(marker, item);
            markerIcon = new HTMLElementOverLay("",
                new Point([item.x, item.y]), marker, [0, 0], [-(markerStyle.width / 2) * (-1),
                -(markerStyle.width / 2) * (-1)]);

            this.clusterDefaultOptions.markers.push(markerIcon);
            this.map.addOverlay(markerIcon);
        }
    },
    /**
     * 清除聚合图层数据
     * @private
     */
    _clearClusterMarkers: function (markers) {
        for (var i = 0; markers && i < markers.length - 1; i++) {
            this.map.removeOverlay(markers[i]);
        }
        return markers = new Array();
    },
    /**
     * 填充模板
     * @param template
     * @param options
     * @returns {XML|void|string|*}
     * @private
     */
    _fillTemplate: function (template, options) {
        return template.replace(/\{(\w+)\}/gi, function (w, property) {
            var attribute = options[property];
            if (typeof attribute == 'function')
                return attribute();
            if (!attribute) {
                return "{" + property + "}";
            }
            return attribute;
        });
    },
    /**
     * 添加一个热点图
     * @param layerName 图层名称
     * @param imgId 图标ID
     */
    addHotSpot: function (layerName, imgId, options) {
        var iconUrl;
        iconUrl = this.imgList.getImage(imgId).imgUrl;
        var iconUrl3D = iconUrl;
        if (options && options.icon) {
            iconUrl3D = this.imgList.getImage(options.icon).imgUrl || options.imgUrl;
        }
        layerName = layerName.toUpperCase();
        if (!this.groupHotSpot) { this.groupHotSpot = {}; }
        var group = "";
        var keywords = "";
        var filterCustom = "LAYERNAME:" + layerName.toUpperCase();
        if (options && options.where) {
            filterCustom = filterCustom + options.where;
        }
        if (this.map.is3DMap) {
            return this.add3DHotSpot({
                imgUrl: iconUrl3D,
                layerName: layerName,
                group: group,
                keywords: keywords,
                filterCustom: filterCustom,
                template: options && options.template || null,
                colums: options && options.colums || null
            });
        }
        var p = {
            name: layerName,
            isMulti: true,
            hot: MapConfig.SearchServerUrl + "/PoiWMTSV1?layer=" + layerName + "&filterCustom=" + filterCustom + "&group=" + group + encodeURI(encodeURI("&keywords=" + keywords)) + "&style=default&tilematrixset=d&Service=WMTS&Request=GetTile&Version=1.0.0&Format=jsonv2&TileMatrix={z}&TileCol={x}&TileRow={y}",
            tile: MapConfig.SearchServerUrl + "/PoiWMTSV1?layer=" + layerName + "&filterCustom=" + filterCustom + "&group=" + group + "&keywords=" + keywords + "&style=default&tilematrixset=d&Service=WMTS&Request=GetTile&Version=1.0.0&Format=scalemarker&TileMatrix={z}&TileCol={x}&TileRow={y}",
            icon: EzServerClient.icon({
                iconUrl: iconUrl,
                popupAnchor: [0, 0],
                iconAnchor: [13, 13],
                iconSize: [25, 30]
            }),
            minZoom: options.minLevel || 0,
            maxZoom: options.maxLevel || 20
        };
        this.groupHotSpot[layerName] = new EzServerClient.TileLayer.HotSpot2("", p);
        var ezHtml5Map = this.map.getLMap();
        this.groupHotSpot[layerName].addTo(ezHtml5Map);
        if (this.multiLayerHotSpot[layerName]) {
            this.multiLayerHotSpot[layerName].addHotSpotLayer(this.groupHotSpot[layerName])
        }
        else {
            this.multiLayerHotSpot[layerName] = new EzServerClient.MultiHotSpot(ezHtml5Map, this.mulHotSpotClick_callback(options), this.groupHotSpot[layerName]);
        }
    },
    //清除热点图
    clearHotSpot: function (layerName, layer) {
        if (this.map.is3DMap) {
            this.clear3DHotSpot(layer);
            return;
        }
        var ezmap = this.map.getLMap();
        if (!$.isEmptyObject(this.groupHotSpot)) {
            if (layerName) {
                layerName = layerName.toUpperCase();
                var hotlayer = this.groupHotSpot[layerName];
                if (hotlayer) {
                    this.multiLayerHotSpot[layerName].removeHotSpotLayer(hotlayer);
                    ezmap.removeLayer(hotlayer);
                    this.groupHotSpot[layerName] = "";
                }
                //去掉图层         
                var t = $(".mul_searchDiv .mul_content .mul_params dd span a.on");
                for (var i = 0; i < t.length; i++) {
                    if ($(t[i]).attr("layername") == layerName) {
                        $(t[i]).removeClass("on");
                    }
                }
            } else {
                for (var layer in this.groupHotSpot) {
                    var hotlayer = this.groupHotSpot[layer];
                    if (hotlayer) {
                        this.multiLayerHotSpot[layer].removeHotSpotLayer(hotlayer);
                        ezmap.removeLayer(hotlayer);
                    }
                }
                //去掉图层         
                $(".mul_searchDiv .mul_content .mul_params dd span a.on").removeClass("on");
                this.groupHotSpot = {};
                this.multiLayerHotSpot = {};
            }
        }
    },
    /**
     * 空间查询
     * @param *type 类型（D:点周边,X:线周边,PR:拉框,PC:画圆,PP:画多边形,P:传入面坐标查询(PR/PC/PP不绘图查询),R:传入矩形坐标查询(参数与P不同,P类型矩形面为5个点坐标构成的字符串,该类型参数只有两个点),Q:条件查询）
     * @param radius 半径（类型为D与X时有效且必填，其他类型可为任意值）
     * @param pointString 坐标串（格式D:"x,y"、X/PR/PC/PP/P:"x,y,x,y...."、R:"minX,minY,maxX,maxY"且必填、Q:该参数无效可为任意值；除R外其他类型该参数均可为""；
     * @param *layerName 图层名
     * @param strWhere 其他自定义条件（可为""，如：AND GXDWDM:5101*，其含义为查询GXDWDM以5101开头的数据）
     * @param keywords 关键字（可为""，如：成都）
     * @param sortBy 按查询出来的字段排序（距离排序_DIST,分数排序_SCORE,或者其他字段列表，""为不排序）
     * @param query_callback
     * @param isShowDraw 传坐标查询,是否绘图，默认为false不绘制
     * @return
     */
    queryFQ: function (type, radius, pointString, layerName, strWhere, keywords, sortBy, query_callback, isShowDraw) {
        if ((type == "R" || type == "P") && !pointString) { query_callback({ success: false, message: "R/P类型,坐标序列不可为空!" }); return; }
        if (type == "Q" || pointString) {
            if (type.length == 2) { type = type.subString(0, 1); }
            if (isShowDraw) {
                var geometry;
                if (type == "D") {
                    this.drawShapeOrBuff(5, "point", pointString, radius);
                }
                else if (type == "X") {
                    geometry = this.getPolyline(pointString);
                    this.addSymbolToMap(geometry);
                    this.drawBuff(geometry, radius);
                }
                else if (type == "P") {
                    geometry = this.getPolygon(pointString);
                    this.addSymbolToMap(geometry);
                }
                else if (type == "R") {
                    var arr = pointString.split(",");
                    geometry = new Extent(parseFloat(arr[0]), parseFloat(arr[1]), parseFloat(arr[2]), parseFloat(arr[3]), this.spatialReference);
                    this.addSymbolToMap(geometry);
                }
            }
            this.spaceQueryFQ(type, radius, pointString, layerName, strWhere, keywords, sortBy, query_callback);
        }
        else {
            switch (type) {
                case "D":
                    this.map.changeDragMode('drawPoint', function (o) {
                        var s = o.lng + "," + o.lat;
                        var p = this.getGeometryPoint(s);
                        this.map.addOverlay(p);
                        this.drawBuff("point", s, radius);
                        this.spaceQueryFQ(type, radius, s, layerName, strWhere, keywords, sortBy, query_callback);
                    }); break;
                case "X":
                    this.map.changeDragMode('drawPolyline', function (o) {
                        var pointStr = o.coordString;
                        this.drawBuff("polyline", pointStr, radius);
                        this.spaceQueryFQ(type, radius, pointStr, layerName, strWhere, keywords, sortBy, query_callback);
                    }); break;
                case "PR":
                    this.map.changeDragMode('drawRect', function (o) {
                        this.map.removeOverlay(o);
                        var pointStr = o.coordString;
                        var temp = pointStr.split(",");
                        pointStr = pointStr + "," + temp[0] + "," + temp[1];
                        this.spaceQueryFQ("P", radius, pointStr, layerName, strWhere, keywords, sortBy, query_callback);
                    }); break
                case "PC":
                    this.map.changeDragMode('drawCircle', function (o) {
                        this.map.removeOverlay(o);
                        var pointStr = o._latlng.lng + "," + o._latlng.lat + "," + o._mRadius;
                        this.spaceQueryFQ(type, radius, pointStr, layerName, strWhere, keywords, sortBy, query_callback);
                    }); break
                case "PP":
                    this.map.changeDragMode('drawPolygon', function (o) {
                        this.map.removeOverlay(o);
                        var pointStr = o.coordString;
                        this.spaceQueryFQ(type, radius, pointStr, layerName, strWhere, keywords, sortBy, query_callback);
                    }); break
            }
        }
    },
    /**
     * 三维居中
     * @param x
     * @param y
     * @param height高度
     */
    setView: function (x, y, options) {
        var viewer = this.map.viewer;
        if (options && options.isShowOrientation) {
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            //设置鼠标左键单击回调事件
            handler.setInputAction(function (e) {
                //console.log("heading:"+viewer.camera.heading);
                //console.log("pitch:"+viewer.camera.pitch);
                //console.log("roll:"+viewer.camera.roll);
                //console.log("height:"+viewer.camera.height);
                //console.log(viewer.camera);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
        if (!options || !options.heading) {
            options.heading = 6.120109328535477;//上下
            options.heading = 0.21660464446364447;
            options.pitch = -1.7546845429719355;//左右
            options.pitch = -0.8618787187436467;
            options.roll = 8.15211412;//视角
            options.roll = 0;
        }
        if (!options || !options.height) {
            options.height = 0;
        }
        this.map.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(x, y, options.height),
            orientation: options
        });

    },
    /**
     * 飞行至指定位置
     * @param x
     * @param y
     * @param h 高度
     * @param isReference 是否贴地
     * @param isOrientation是否设置视角
     */
    flyTo: function (x, y, h, isReference, orientation) {
        var point = {};
        if (!orientation) {
            /* orientation={
              heading:5.016404901020872,
              pitch:-1.5062512749199906,
              roll:8.235564230574255e-20
             };*/
            /* orientation={
                 direction : new Cesium.Cartesian3(0.13289670682472454,-3.8413791583901944,0.5238507202837003),
                 up : new Cesium.Cartesian3(-0.0880972932047474, 0.516419030768377, 0.8517923758699927)
             };*/
        }
        this.map.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(x, y, h || 0)
        });
    },
    //===========================内部方法==================================
    getTableColumns: function (tableName, callBack, async) {
        tableName = tableName.toUpperCase();
        var URL = self.managerUrl + "/api/getFieldProperties";
        var t = [{ stdcode: "1", enname: tableName }];
        if (!async)
            async = false;//默认同步        
        //发送查询        
        $.ajax({
            async: async,
            url: self.urlPatten + "/ProxyServlet",
            type: "post",
            data: { url: URL, content: "params=" + encodeURI(JSON.stringify(t)) },
            dataType: "json",
            success: function (data) {
                var lColumn = null;
                if (data && data.resultData && data.resultData.rows.length > 0) {
                    lColumn = {};
                    var row = data.resultData.rows[0].data;
                    for (var i = 0; i < row.length; i++) {
                        var item = row[i];
                        if (item["dispLevel"] < 10 || item["isPrimary"] == "1" || item["mainObjfield"] == "1") {
                            lColumn[item["fieldName"]] = item["aliasName"];
                        }
                    }
                }
                self.initParams.layerColumns[tableName] = lColumn;
                self.config.layerColumn[tableName] = lColumn;
                if (self.arround && arroundSearch) {//启用周边查询联合        
                    arroundSearch.tableColumns[tableName] = lColumn;
                }
                if (self.getTableColumnsCallBack)
                    self.getTableColumnsCallBack(tableName, lColumn);
            },
            error: function (e) {
                throw new Error(e);
            }
        });
    },
    mulHotSpotClick_callback: function (options) {
        return function (pop) {
            if (pop && options && options.hotSpotClick) {
                pop.colums = options.colums;
                options.hotSpotClick(pop);
                return;
            }
            var data = pop.contentData;
            var title = data.LABEL || data.name;
            var pointLayerName = data.TYPE.toUpperCase();
            //视频图片传输数据
            if (pointLayerName == MapConfig.LayerName.TXJKZY) {

            }
            var showInfoFormat, hotSpotTemplate, re;
            if (options) {
                showInfoFormat = options.colums;
                hotSpotTemplate = options.hotSpotTemplate;
            }
            if (!showInfoFormat) {
                showInfoFormat = { OBJECTID: "OBJECTID", MC: "名称", DZMC: "地址", XZQHMC: "行政区划", GXDWMC: "管辖单位", XZQHMC: "行政区划", GXSJ: "更新时间", X: "经度", Y: "纬度", LXDH: "联系电话", LXR: "联系人" };
            }

            if (!hotSpotTemplate) {

                hotSpotTemplate = "<div><div class='mul_marker_desc1'><p title='{mc}'>{i}.{mc}</p>";
                hotSpotTemplate += "<p class='mul_hide' style='display:none'><span>名称：</span><span>{mc}</span></p>" +
                    "</div></div>";

            }

            //聚合，需要进行查询
            if (data.WEIGHT > 1) {
                var c = "filterCustom=LAYERNAME:" + pointLayerName + "&bounds=" + data.BBOX + "&pageSize=999";
                var data_ = {
                    url: MapConfig.SearchServerUrl + "/PoiSearchV1REST?" + encodeURI(c)
                };
                var html = "<div class='mul_marker_title' style='padding:0 10px'><p title='" + title + ",共" + data.WEIGHT + "条'>" + title + ",共聚合" + data.WEIGHT + "条记录</p></div>"
                    + "<div id='mul_marker_content' style='margin: 0 5px 0 10px;height: 200px; overflow-y: auto;overflow-x: hidden; width: 310px; padding-right: 10px;'>"
                    + "    <div><img alt='' src='img/map/mulIcon/loading.gif'/></div>"
                    + "</div>";
                pop.setContent(html);//热点图点击事件
                $.ajax({
                    xhrFields: { withCredentials: true },
                    crossDomain: true,
                    url: MapConfig.ProxyUrl,
                    type: "post",
                    data: data_,
                    dataType: "json",
                    success: function (json) {
                        var groups = json.groups;
                        if (groups) {
                            //切换样式
                            $(".leaflet-popup-content").css("width", "334px !important");
                            $(".leaflet-popup-content").css("height", "255px !important");
                            $(".leaflet-popup-content").attr("white-space", "normal");
                            //组装html
                            var re_ = groups[0].pois;//结果列表
                            var html;
                            for (var i = 0; i < re_.length; i++) {
                                for (key in showInfoFormat) {
                                    if (re_[i].customs[key]) {
                                        re = new RegExp("/{" + key + "}/");
                                        html = hotSpotTemplate.replace(re, re_[i].customs[key]);
                                    }
                                }
                            }
                            $("#mul_marker_content").html(html);

                        }
                        $(".mul_marker_desc1").click(function () {
                            if ($(this).find('.mul_hide').css('display') == "block") {
                                $(this).find('.mul_hide').css('display', 'none');
                            } else {
                                $(this).find('.mul_hide').css('display', 'block');
                            }
                        });
                    },
                    error: function (e) {
                        throw new Error(e);
                    }
                });

            } else {
                $(".leaflet-popup-content").css("width", "330px !important");
                $(".leaflet-popup-content").css("height", "200px !important");
                $(".leaflet-popup-content").attr("white-space", "nowrap");
                var html = "<div class='KKItem' style='width: 300px;background: #f8f8f8;border:1px solid #ddd;position:relative'>" +
                    "<div class='infoMessDiv' title='" + title + "' style='cursor:default;width:100%;height: 30px;background: #e2dfdf;line-height: 30px;border-bottom: #D0D0D0;padding-left: 10px;font-size: 14px;color: #2d2727;'>" +
                    title +
                    "</div>";
                for (key in showInfoFormat) {
                    if (data.customs[key])
                        html += "<div class='infoMessDiv' style='padding-top: 2px'><span style='margin-left: 10px;font-size:13px;color:#2d2727'>" + showInfoFormat[key] + "</span>：<span style='font-size:13px;color:#636167' title='" + data.customs[key] + "'>" + data.customs[key] + "</span></div>";
                }
                if (options) {
                    if (options.ybss && data.customs["XTBH"]) {
                        html += "<div class='infoMessDiv' style='padding-top: 2px'><span style='margin-left: 10px;font-size:13px;color:#2d2727'>一标三实信息</span>：<a href='" + MapConfig.YBSSServerUrlhttp + data.customs["XTBH"] + "' target='_blank'>查看层户结构</a></div>";
                    }
                }
                html += "</div>";


                pop.setContent(html);//热点图点击事件
            }
        }
    },
    spaceQueryFQ: function (type, radius, pointStr, layerName, strWhere, keywords, sortBy, query_callback) {
        var queryType = "FQ";   //查询类型：全文检索
        var method = "FULL";    //查询方法：全文查询
        var scope = "_FULLTEXT"; //查询范围：所有字段
        var spaceQueryStr = "";
        switch (type) {
            case "D":
                var corr = "";
                if (typeof (pointStr) == "string") {
                    corr = pointStr;
                } else {
                    corr = pointStr.x + "," + pointStr.y;
                }
                spaceQueryStr = "&location=" + corr + "&buffer=" + radius; break;
            case "X":
                spaceQueryStr = "&polyline=" + pointStr + "&buffer=" + radius; break;
            case "P":
                spaceQueryStr = "&polygon=" + pointStr; break;
            case "R":
                spaceQueryStr = "&bounds=" + pointStr; break;
            case "Q":
                break;
        }
        //条件处理
        var where = "LAYERNAME:" + layerName.toUpperCase() + " AND GXDWDM:5113*";
        if (strWhere) {
            if (strWhere.indexOf("=") > -1) { strWhere = strWhere.replace("=", ":"); }
            where += " " + strWhere;
        }
        //准备参数开始检索
        var parameter = "type=" + queryType + "&method=" + method + "&scope=" + scope + "&keywords=" + keywords + "&filterCustom=" + where + "&pageIndex=0&pageSize=300" + spaceQueryStr + "&sortBy=" + sortBy;
        var _data = { url: MapConfig.SearchServerUrl + "/PoiSearchV1REST?" + encodeURI(parameter) };
        //jQuery.support.cors=true;
        $.ajax({
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: "post",
            url: MapConfig.ProxyUrl,
            data: _data,
            async: true,
            dataType: 'json',
            success: query_callback
        });
    },
    drawBuff: function (geoType, pointStr, radius) {
        var bufferShape = null;
        if (geoType == "point") {
            var corr = pointStr + "," + radius;
            bufferShape = new Circle(corr, 0, 2, 0.4, this.buffColor);
        } else if (geoType == "polyline") {
            this.map.clearMapChangeListener(changeBufferWidth);
            var width = getBufferWidth();
            bufferShape = new Polyline(pointStr, this.buffColor, width, 0.4);
            this.map.addMapEventListener(EzEvent.MAP_ZOOMEND, changeBufferWidth);
        }
        if (bufferShape) { this.map.addOverlay(bufferShape); }
        function getBufferWidth() {
            var ca = pointStr.split(",");
            var dRadius = this.map.getDegree(new Point(parseFloat(ca[0]), parseFloat(ca[1])), radius);
            var pntX = parseFloat(ca[0]);
            var pntY = parseFloat(ca[1]);
            var pDivLeftTopPoint = this.map.mapCoord2Container(EzServerClient.latLng(pntY + dRadius, pntX - dRadius));
            var pDivRigtBottomPoint = this.map.mapCoord2Container(EzServerClient.latLng(pntY - dRadius, pntX + dRadius));
            var iWidth = Math.ceil(pDivRigtBottomPoint.x - pDivLeftTopPoint.x);
            return iWidth;
        }
        function changeBufferWidth() {
            if (bufferShape) {
                var width = getBufferWidth();
                bufferShape.setWidth(width);
            }
        }
    },
    //暂时没用
    drawShapeOrBuff: function (drawType, geoType, pointStr, radius) {
        var shape = null;
        var bufferShape = null;
        this.removeAllOverlay();
        this.map.clearMapChangeListener(changeBufferWidth);
        if (drawType == 2) {//拉框查询
            shape = new Rectangle(pointStr, this.buffBoderColor, 1, 0.4, this.buffColor);
        } else if (drawType == 3) {//圆查询
            shape = new Circle(pointStr, this.buffBoderColor, 1, 0.4, this.buffColor);
        } else if (drawType == 4) {//多边形查询
            shape = new Polygon(pointStr, this.buffBoderColor, 1, 0.3, this.buffColor);
        } else if (drawType == 5) {
            if (geoType == "point") {//点周边查询
                shape = this.getGeometryPoint(pointStr);
                var corr = pointStr + "," + radius;
                bufferShape = new Circle(corr, this.buffBoderColor, 2, 0.4, this.buffColor);
            } else if (geoType == "polyline") {//线周边查询
                //获取线周边缓冲区
                var width = getBufferWidth();
                bufferShape = new Polyline(pointStr, this.buffColor, width, 0.4);
                this.map.addMapEventListener(EzEvent.MAP_ZOOMEND, changeBufferWidth);
                shape = new Polyline(pointStr, "#C9EBFA", 1, 1, 0);
            }
        } else {
            shape = null;
            bufferShape = null;
        }
        if (shape) { this.map.addOverlay(shape); }
        if (bufferShape) { this.map.addOverlay(bufferShape); }
        //获得当前级别Buffer的宽度
        function getBufferWidth() {
            var ca = pointStr.split(",");
            var dRadius = this.map.getDegree(new Point(parseFloat(ca[0]), parseFloat(ca[1])), radius);
            var pntX = parseFloat(ca[0]);
            var pntY = parseFloat(ca[1]);
            var pDivLeftTopPoint = this.map.mapCoord2Container(EzServerClient.latLng(pntY + dRadius, pntX - dRadius));
            var pDivRigtBottomPoint = this.map.mapCoord2Container(EzServerClient.latLng(pntY - dRadius, pntX + dRadius));
            var iWidth = Math.ceil(pDivRigtBottomPoint.x - pDivLeftTopPoint.x);
            return iWidth;
        }
        function changeBufferWidth() {
            if (bufferShape) {
                var width = getBufferWidth();
                bufferShape.setWidth(width);
            }
        }
    },
    getGeometryPoint: function (point, imgId, w, h, selfImgObj) {
        var p;
        if (typeof (point) == "string") {
            var arr = point.split(",");
            p = new Point(parseFloat(arr[0]), parseFloat(arr[1]));
        } else { p = point; }
        var iconObj = this.getMarkerIcon(imgId, w, h, selfImgObj);
        return new Marker(p, iconObj);
    },
    getMarkerIcon: function (imgId, w, h, selfImgObj) {
        var iconObj = null;
        if (selfImgObj) {
            iconObj = EzServerClient.icon({
                iconUrl: selfImgObj.imgUrl,
                popupAnchor: [0, -selfImgObj.height / 2],
                iconAnchor: [selfImgObj.width / 2, selfImgObj.height / 2],
                iconSize: [selfImgObj.width, selfImgObj.height]
            });
            iconObj.imgW = selfImgObj.width;
            iconObj.imgH = selfImgObj.height;
        } else if (imgId) {
            var imgObj = this.imgList.getImage(imgId, w, h);
            if (imgObj) {
                iconObj = EzServerClient.icon({
                    iconUrl: imgObj.imgUrl,
                    popupAnchor: [0, -imgObj.height / 2],
                    iconAnchor: [imgObj.width / 2, imgObj.height / 2],
                    iconSize: [imgObj.width, imgObj.height]
                });
                iconObj.imgW = imgObj.width;
                iconObj.imgH = imgObj.height;
            }
            else { iconObj = getDefaultIcon(); }
        }
        else {
            iconObj = getDefaultIcon();
        }
        return iconObj;
        function getDefaultIcon() {
            var icon = EzServerClient.icon({
                iconUrl: this.proUrl + "examples/themes/image/getMapPoint.png",
                popupAnchor: [0, -24],//泡泡偏移
                iconAnchor: [10, 24], //icon偏移
                iconSize: [28, 24]
            });
            icon.imgW = 28; icon.imgH = 24;
            return icon;
        }
    },
    getTitleMark: function (point, title, imgh, offset, isHideBoder) {
        //文本框偏移到图片上方或按指定偏移量偏移
        var uuid = Math.uuid();
        var infoDiv = "";
        if (isHideBoder) {
            infoDiv = "<div id='" + uuid + "' class='markerTitle'><span class='infoText'>" + title + "</span></div>";
        }
        else {
            infoDiv = "<div id='" + uuid + "' class='markerTitle'><span class='infoText'>" + title + "</span></div>";
        }

        var w = (Util.calculateMarkText({
            title: title
        }).width / 2);
        if ((typeof imgh == "undefined" || imgh == null || imgh == "") && imgh != 0) { imgh = 24; }  //默认图片的高度
        if (typeof imgh != "number") { imgh = parseInt(imgh); }
        var h = -imgh / 2;
        if (offset) { w = offset[0]; h = offset[1]; }
        return new HTMLElementOverLay("", point, infoDiv, null, [w, h]);
    },
    removeSingleOverlay: function (id, type) {

        var list = [];
        if (type == "point") { list = this.overlayPointList; }
        else if (type == "polyline") { list = this.overlayPolylineList; }
        else if (type == "polygon") { list = this.overlayPolygonList; }
        else if (type == "YA") { list = this.overlayYAList; }
        else if (type == "AB") { list = this.overlayABList; }
        else if (type == "AJ") { list = this.overlayAJBZList; }
        if (id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    if (list[i].overlay.titleOverlay) {
                        this.map.removeOverlay(list[i].overlay.titleOverlay)
                    }
                    if (list[i].overlay.titleOverlayNum) {
                        this.map.removeOverlay(list[i].overlay.titleOverlayNum)
                    }
                    this.map.removeOverlay(list[i].overlay, type == "polyline");
                    if (type == "point") {
                        this.overlayPointList.splice(i, 1);
                    }
                    else if (type == "polyline") {
                        this.overlayPolylineList.splice(i, 1);
                    }
                    else if (type == "polygon") {
                        this.overlayPolygonList.splice(i, 1);
                    }
                    else if (type == "YA") {
                        this.overlayYAList.splice(i, 1);
                    }
                    else if (type == "AB") {
                        this.overlayABList.splice(i, 1);
                    }
                    else if (type == "AJ") {
                        this.overlayAJBZList.splice(i, 1);
                    }
                    break;
                }
            }
        } else {
            for (var i = 0; i < list.length; i++) {
                if (list[i].overlay.titleOverlay) { this.map.removeOverlay(list[i].overlay.titleOverlay); }
                this.map.removeOverlay(list[i].overlay);
            }
            if (type == "point") { this.overlayPointList = []; }
            else if (type == "polyline") { this.overlayPolylineList = []; }
            else if (type == "polygon") { this.overlayPolygonList = []; }
            else if (type == "YA") { this.overlayYAList = []; }
            else if (type == "AB") { this.overlayABList = []; }
            else if (type == "AJ") { this.overlayAJBZList = []; }
        }
    },
    addLayerChangeView: function (contair) {
        if (ezMap.MapSrcURL.length < 2) { return; }
        var customAPI = this.map.customLayersAPI;
        var layerList = customAPI.getTileLayersId();
        var layerhtml = "";
        var layerInfo = "";
        //配置HTML5地图图层图片,此处路径需更改
        var mapLayerImg = [{ cname: "矢量地图", icon: pgisMapUrl + "resource/Pgis/image/sldt.png" },
        { cname: "影像地图", icon: pgisMapUrl + "resource/Pgis/image/yxdt.png" },
        { cname: "矢影地图", icon: pgisMapUrl + "resource/Pgis/image/sydt.png" },
        { cname: "天地图矢量", icon: pgisMapUrl + "resource/Pgis/image/tdtsl.png" },
        { cname: "天地图影像", icon: pgisMapUrl + "resource/Pgis/image/tdtyx.png" },
        { cname: "天地图矢影", icon: pgisMapUrl + "resource/Pgis/image/tdtsy.png" },
        { cname: "三维地图", icon: pgisMapUrl + "resource/Pgis/image/yxdt.png" },
        { cname: "夜景地图", icon: pgisMapUrl + "resource/Pgis/image/yxdt.png" }
        ];

        if ($("#layersListBtnBox").length < 1) {
            $("#" + contair).parent().append("<div id='layersListBtnBox' class='layersListBtnBox' style='z-index: 18;position: absolute;top: 40px;height: 59px;'></div>");
        }

        for (var i = 0; i < layerList.length; i++) {
            for (var j = 0; j < mapLayerImg.length; j++) {
                if (mapLayerImg[j].cname == layerList[i].name) {
                    layerInfo = mapLayerImg[j]; break;
                } else { layerInfo = ""; }
            }
            if (layerInfo) {
                layerhtml += "<div class='layerlistbtn' style='font-size: 12px;'>"
                    + "<img alt='" + layerInfo.cname + "' title='" + layerInfo.cname + "' layerid='" + layerList[i].id + "' src='" + layerInfo.icon + "'/>"
                    + "<div class='Layername' title='" + layerInfo.cname + "'>" + layerInfo.cname + "</div></div>";
            } else {
                continue;
            }
        }
        $("#layersListBtnBox").attr("layerid", layerList[0].id);
        //if(layerInfo==""){
        //	alert("门户运维配置错误，请联系管理员，请配置地图图层图片！");
        //}
        $("#layersListBtnBox").html(layerhtml);
        $("#layersListBtnBox").bind("mouseover", function (e) {
            e.stopPropagation();
            $(this).css("height", "auto");
        });
        $("#layersListBtnBox .layerlistbtn").bind("mouseover", function (e) {
            $(this).find(".Layername").addClass("layerlistbtnHover");
        });
        $("#layersListBtnBox").bind("mouseout", function (e) {
            $(this).css("height", "60px");
            e.stopPropagation();
        });
        $("#layersListBtnBox .layerlistbtn").bind("mouseleave", function () {
            $(this).find(".Layername").removeClass("layerlistbtnHover");
        });

        $("#layersListBtnBox .layerlistbtn").bind("click", function () {
            //图层选择
            var layerid = $(this).find("img").attr("layerid");
            var title = $(this).find("img").attr("title");
            var thisLayerId = $("#layersListBtnBox").attr("layerid");
            var isNeedChangeMap = (title == "三维地图" && !this.options.is3DMap) || (title != "三维地图" && this.options.is3DMap),
                is3DMap = (title == "三维地图"),
                isChangeSelector = this.options.is3DMap;

            if (layerid == thisLayerId) {
                return;
            }
            var thislayer = $($("#layersListBtnBox").children()[0]).html();
            var checklayer = $(this).html();
            $(this).html(thislayer);
            $($("#layersListBtnBox").children()[0]).html(checklayer);
            if (isNeedChangeMap) {
                this.options.is3DMap = is3DMap;
            }
            if (!is3DMap) {
                this.map = new EzMap(document.getElementById(this.options.mapDivId), this.options.is3DMap);
                $("#cesiumContainer").css("display", "none");
                //$("#cesiumContainer").css("height","0");
                $("#" + this.options.mapDivId).css("display", "block");
                //$("#"+this.options.mapDivId).css("height","750px");
                var customAPI = this.map.customLayersAPI;
                if (!customAPI) {
                    customAPI = this.map.customLayersAPI;
                }
                /* if(isChangeSelector){
                     layerid=changeLayerSelector(customAPI._layers);
                 }*/
                customAPI.changeToLayer(layerid);
                if (this.onTDMapLoad != null) { this.onTDMapLoad(); }
            } else {

                this.map = new EzMap(document.getElementById(this.options.mapDivId), this.options.is3DMap);

                $("#" + this.options.mapDivId).css("display", "none");
                //$("#"+this.options.mapDivId).css("height","0");
                $("#cesiumContainer").css("display", "block");
                //$("#cesiumContainer").css("height","750px");

            }


            $("#layersListBtnBox .layerlistbtn").find(".Layername").removeClass("layerlistbtnHover");
            $("#layersListBtnBox").attr("layerid", layerid);
        });
    },
    changeMapView: function (layerid) {
        var customAPI = this.map.customLayersAPI;
        if (!customAPI) {
            customAPI = this.map.customLayersAPI;
        }
        customAPI.changeToLayer(layerid);
    },
    toShowDataHandle: function (data, sum) {
        var that = this;
        var uuid = Math.uuid();
        var infoDiv = "<div id='" + uuid + "' class='floatInfoBox'><a class='closebtn'></a><span class='infoText'>" + sum + "</span></div>";
        var point = data._latlngs[data._latlngs.length - 1];
        var marker = new HTMLElementOverLay("", new Point(point.lng + "," + point.lat), infoDiv);
        this.map.addOverlay(marker);
        $("#" + uuid).bind("click", function () {
            that.map.getLMap().removeLayer(data);
            that.map.removeOverlay(marker);
        });
    },
    getContextPath: function () {
        var location = document.location.toString();
        var contextPath = "";
        if (location.indexOf("://") != -1) {
            contextPath += location.substring(0, location.indexOf("//") + 2);
            location = location.substring(location.indexOf("//") + 2, location.length);
        }
        var index = location.indexOf("/");
        contextPath += location.substring(0, index + 1);
        location = location.substring(index + 1);
        index = location.indexOf("/");
        contextPath += location.substring(0, index + 1);
        return contextPath;
    },
    chageLayerSelectorId: function () {
        var customAPI = this.map.customLayersAPI;

    },
    reload: function (options, callback) {
        if (typeof EzMap == "undefined") {
            if (typeof (options.mapDivId) == "string") {
                var pEle = document.getElementById(options.mapDivId);
                pEle.innerHTML = "EzMap地图引擎为空类型，请检查地图引擎！";
            }
            window.setTimeout("this.mapOnLoad(" + options.mapDivId + ")", 10);
            return;
        }
        this.options = options;
        this.map = new EzMap(document.getElementById(options.mapDivId), options.is3DMap);
        this.map.initialize2();
        //鹰眼
        var pOverview = new OverView();
        pOverview.width = 200;
        pOverview.height = 200;
        pOverview.minLevel = 8;
        pOverview.maxLevel = 10;
        this.map.addOverView(pOverview);
        //缩放条
        this.map.showStandMapControl();
        this.map.addMapEventListener(EzEvent.MAP_ZOOMEND, function (e) { if (this.onMapZoom != null) { var level = this.map.getZoomLevel(); this.onMapZoom(level); } });
        this.map.addMapEventListener(EzEvent.MAP_PANEND, function (e) { if (this.onMapPan != null) { this.onMapPan(); } });
        if (callback != null) { callback(); }
    },
    closeInfoBox: function () {
        $("#entities").next().click();
    },
    /**
     * 退出绘画状态
     */
    exitDrawing: function () {
        $(".leaflet-draw-tooltip").remove();

        if (this.map.uMap) {
            this.map.uMap.getContainer().style.cursor = '';

            this.map.uMap.off("click");

            if (this.map.uMap.disableMeasureLength) {
                this.map.uMap.disableMeasureLength();
            }
            if (this.map.uMap.disableMeasureArea) {
                this.map.uMap.disableMeasureArea();
            }
        } else {
            this.map.viewer._element.style.cursor = "";
            if (this.map.drawPointHandler) {
                this.map.drawPointHandler.deactivate();
            }
            if (this.map.polylineHandler) {
                this.map.polylineHandler.deactivate();
            }
            if (this.map.polygonHandler) {
                this.map.polygonHandler.deactivate();
            }
        }
    }

}

/**
 * 计算marker 信息框文本长度
 * @param options
 * @returns {{height:px, width: px}}
 */
Util.calculateMarkText = function (options) {

    if ($("#clusterContair").length == 0) {
        $("body").append('<div class="leaflet-marker-icon leaflet-zoom-animated leaflet-clickable"' +
            ' id="clusterContair" style="font-size: 12px;display: none"></div>');
        $("#clusterContair").css("font-family", "Helvetica Neue, Arial, Helvetica, sans-serif");
    }
    var template = '<div  class="markerTitle"><span class="infoText">' + options.title + '</span></div>';
    $("#clusterContair").html(template);
    return {
        height: $("#clusterContair").height() + 2,
        width: $("#clusterContair").width()
    }
}
/**
 * jquery object extend
 * @param parent
 * @param child
 */
Util.extend = function (parent, child) {
    return $.extend(parent, child);
}












// Private array of chars to use
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
var NAME = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
};
Math.uuname = function (len, radix) {
    var chars = NAME, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
};
// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
// by minimizing calls to random()
Math.uuidFast = function () {
    var chars = CHARS, uuid = new Array(36), rnd = 0, r;
    for (var i = 0; i < 36; i++) {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
            uuid[i] = '-';
        } else if (i == 14) {
            uuid[i] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join('');
};

// A more compact, but less performant, RFC4122v4 solution:
Math.uuidCompact = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};



function changeLayerSelector(array) {
    var layers = {},
        title, layerid;
    for (var i in array) {
        layers[array[i].name] = i;
    }
    $(".layerlistbtn").find("img").each(function () {
        title = $(this).attr("title");
        if (!layerid) {
            layerid = layers[title];
        }
        $(this).attr("layerid", layers[title]);
    });
    return layerid;
}

window.MapApp = MapApp;





