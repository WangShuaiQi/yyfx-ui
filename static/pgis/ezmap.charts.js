/**
 * echarteasy构造函数
 * @param lineColor 轨道线条颜色
 * @param gdzs 轨道总数
 * @returns
 */
var Ez_function=function(lineColor,gdzs,map) {
    var _ezmap =map;

	//轨迹
	var ez_charts = {
		mapExt : null,
		option : null,
		line : null,
		myChart : null,
		gjMarker : null,
		gjTimer : null,
		kd_height : null,
		kd_top : null,
		kd_num : 0,
		kd_e_num : 0,
		step_time:1000,//步长2s
		init : function(a){
			var that=this;
			//加载
			require.config({
		        paths: {
		            echarts:'libs/echarts/echarts'
		        }
		    });
			require(
			    [
			        'echarts',
			        'echarts/chart/map'
			    ],
			    function (echarts) {
			    	//var gdzs=gdzs||1;//定义轨道总数，默认值为1
			    	//初始化轨迹类
			        that.mapExt = new EzMapExt(_ezmap, echarts, gdzs);
					
			        var container = that.mapExt.getEchartsContainer();
			        that.myChart = that.mapExt.initECharts(container);
			    	//初始化数据结构
			        that.initOption();
			        that.clearOverlay();
			        if(a.l_list){
				        if(a.l_list.point) {//数据已完备无需解析
				        	 that.setOption(a.l_list);
				        	 that.list=a.l_list;//保存输入数据
				        }else{
				        	 var obj=that.parseData(a.l_list);
				        	 that.setOption(obj);
				        }
			        }
			    }
			);
			
			return that;
		},
		parseData:function(value) {
			var obj = {point:[], line:[]};
		    var data = value;
				
		    for(var i = 0; i < data.length; i++){
				obj.point.push({name:data[i].code,re:i/2, code : data[i].code, shape : data[i].startPoint,trackType:"lg",id:data[i].id});
				obj.point.push({name:data[i].code+" ",re:i+data[i].number, code : data[i].code, shape : data[i].endPoint,trackType:"lg",id:data[i].id});
				
				obj.line.push([{name: data[i].code,re:i/2,code : data[i].code,id:data[i].id,color:data[i].color},
								 {name:data[i].code+" ",re:i+data[i].number,code : data[i].code,id:data[i].id},
								 ]);
		    }
			return obj;
		},
		initOption : function(){
			//var map = this.mapExt.getMap();
	        this.option = {
	    		color: ['gold','aqua','lime'],
	            tooltip : {
	                trigger: 'item',
	                formatter: function (v) {
	                    return v[1];
	                }
	            },
	            series : []
	        };
		},
		setOption: function(data){
			var that=this;
			that.initPlayList(data.line);
	    	//加载
			var geoCoord = that.setGeoCoord(data.point);
			var point = that.setPoint(data.point,data.line);
			//返回[]
			var line = that.setLine(data.line);
			that.option.series = new Array();
			that.option.series.push(geoCoord);
			for(var i=0;i<point.length;i++){
				that.option.series.push(point[i]);
			}
			if(line instanceof Array){
				//console.log(line);
				for(var i=0;i<line.length;i++){
					that.option.series.push(line[i]);
				}
			}
			that.showEcharts();
			//图例
			//that.createEchartsLegend();
		},
		setGeoCoord : function(pointdata){
			var data = new Object();
			var track={};
			for(var i=0;i<pointdata.length;i++){
				data[pointdata[i].name] = pointdata[i].shape.split(",");
				track[pointdata[i].name] = pointdata[i].trackType;
			}
			var geoCoord =  {
	            name:'point',
	            type:'map',
	            mapType: 'none',
	            data:[],
	            geoCoord:data,
	            track:track
	        };
			return geoCoord;
		},
		setPoint : function(pointdata,line){
			var points = new Array();
			if(pointdata==null|| pointdata.length==0)return points;
			//头
			if(pointdata.length>0){
				var point =  {
		            name:'point',
		            type:'map',
		            mapType: 'none',
		            data:[],
		            markPoint : {
		              //  symbol:'emptyCircle',
		                symbolSize : 3, 
		                effect : {show: true,shadowBlur : 0,symbol:"none"},
		                itemStyle:{normal:{color:'#6A00FB',label:{show:false}},emphasis: {label:{position:'top'}}},
		                data : [{name:pointdata[0].name,value:pointdata[0].code,id:pointdata[0].id}]
		            }
		        }; 
				points.push(point);
			}
			//中间
			if(pointdata.length>2){
				var data = new Array();
				for(var i=1;i<pointdata.length-1;i++){
					data.push({name:pointdata[i].name,value:pointdata[i].code,id:pointdata[i].id});
				}
				var point =  {
		            name:'point',
		            type:'map',
		            mapType: 'none',
		            data:[],
		            markPoint : {
		              //  symbol:'emptyCircle',
		                symbolSize :3, 
		                effect : {show: true,shadowBlur : 0,symbol:"none"},
		                itemStyle:{normal:{color:'#FE1800',label:{show:false}},emphasis: {label:{position:'top'}}},
		                data : data
		            }
		        };
				points.push(point);
			}
			//尾
			if(pointdata.length>1){
				var name = line[line.length-1][1].name;
				var name1 = pointdata[pointdata.length-1].name;
				if(name!=name1){
					//非最后一点
					var point =  {
			            name:'point',
			            type:'map',
			            mapType: 'none',
			            data:[],
			            markPoint : {
			          //      symbol:'emptyCircle',
			                symbolSize : 3, 
			                effect : {show: true,shadowBlur : 0,symbol:"none"},
			                itemStyle:{normal:{color:'#FE1800',label:{show:false}},emphasis: {label:{position:'top'}}},
			                data : [{name:name1,value:pointdata[pointdata.length-1].code,id:pointdata[pointdata.length-1].id}]
			            }
			        };
					points.push(point);
				}
				var point =  {
		            name:'point',
		            type:'map',
		            mapType: 'none',
		            data:[],
		            markPoint : {
		           //     symbol:'emptyCircle',
		                symbolSize : 3, 
		                effect : {show: true,shadowBlur : 0,symbol:"none"},
		                itemStyle:{normal:{color:'#035503',label:{show:false}},emphasis: {label:{position:'top'}}},
		                data : [{name:name}]
		            }
		        };
				points.push(point);
			}
			
			return points;
		},
		setLine : function(linedata){
			//[{name:'重庆', smoothness:0.1}, {name:'万州'}],
			var _linedata = new Array();
			var _lineMap = new Object();
			var _colorLine ={};
			var _arrayLineFlag = true;
			for(var i=0,name,value,data;i<linedata.length;i++){
				data = linedata[i];
				//点相同去除
				//if(data[0].name==data[1].name)continue;
				var d1 = {name:data[0].name,smoothness:0.2,value:data[0].code,id:data[0].id};
				var d2 = {name:data[1].name};
				//路线相同，设置幅度
				//name = data[0].name+"_"+data[1].name;
				//设置幅度
				d1.smoothness = 4*0.05 + (data[0].re-1)*0.02;
				_lineMap[name] = 4;
				
				_linedata.push([d1,d2]);
				if(_arrayLineFlag){
					if( !_colorLine[data[0]['color']]){
						_colorLine[data[0]['color']]=[];
					}
					if(!data[0]['color']){
						_arrayLineFlag = false;
					}
					_colorLine[data[0]['color']].push([d1,d2]);
				}
			}
			
			if(!_arrayLineFlag){
				_colorLine[lineColor]=[];
				_colorLine[lineColor] = _linedata;
			}
			
			var lines = [];
			for(var key in _colorLine){
				var line =  {
	            name: 'line', 
	            type: 'map',
	            mapType: 'none',
				code:"id",
	            data:[],
				markLine : {
	        		//曲线
	                smooth:true, 
	          //    symbol:"emptyTriangle",
	         //       symbolSize : 15,
	                effect : {show: true,scaleSize: 2,period: 40,color: 'yellow',shadowBlur: 10,symbol:"arrow"},
	                itemStyle : {normal: {color: key,borderWidth:1,lineStyle: {type: 'solid',shadowBlur: 10}}},
	                data : _colorLine[key]
	            }
			    };
				lines.push(line);
			}
			return lines;
		},
		showEcharts : function(){
	        //window.onresize = myChart.onresize;
	        this.mapExt.setOption(this.option, true);
	//		 this.mapExt._bindEvent("click",function(params){
								 
		//					 })
			this.mapExt.refresh();
		},
		//轨迹刷新
		refresh:function() {
			this.mapExt.refresh();
			return this;
		},
		//轨迹列表
		initPlayList : function(line){
			//是否存在轨迹回放
			if(line.length<1){//只有一条轨迹的时候，不存在轨迹回放，和时间轴
				//$(".dowebok_gj").hide();
				return this;
			}else{
				//$(".dowebok_gj").show();
			}
			//高度计算
			var kd_height = this.kd_height;
			var div_height = kd_height/(line.length+2)-1;
			
			//$("#play_gj_list").empty().append(html);
			
			//轨迹
			var _linedata = new Array();
			var _lineMap = new Object();
			for(var i=0,name,value,data;i<line.length;i++){
				data = line[i];
				var d1 = {name:data[0].name,smoothness:0.2};
				var d2 = {name:data[1].name};
				if(data[0].name==data[1].name){
					_linedata.push([d1,d2]);
				}else{
					//路线相同，设置幅度
					name = data[0].name+"_"+data[1].name;
					if(_lineMap[name]!=null){
						var num = _lineMap[name];
						num = num+1;
						//data[0].smoothness = num*0.05;
						d1.smoothness = num*0.05;
						_lineMap[name] = num;
					}else{
						//data[0].smoothness = 4*0.05;
						d1.smoothness = 4*0.05;
						_lineMap[name] = 4;
					}
					_linedata.push([d1,d2]);
				}
			}
			this.line = _linedata;
		},
		//停止轨迹回放
		overPlayList : function(){
			var that=this;
			//隐藏标签
	    	if(this.gjMarker!=null){
	    	    window.PMap.removeOverlay(this.gjMarker);
				this.gjMarker=null;
			}
	    	//隐藏刻度
	    	//$("#play_gj_list").hide();
			// MapApp.showOverView();
	    	//按钮
			that.gjTimer = new Date().getTime();
			that.state="init";//状态复原
//	 		$("#gj_tsk").hide();
//	 		$("#gjhf").parent().show();
//	 		$("#gj_a_ks").parent().hide();
		},
		
		
		jumpGjMark : function(){
			$("#gj_markdiv").animate({
				top:"-48px"
			}, "400","",function(){
				$("#gj_markdiv").animate({
					top:"-32px"
				}, "400","",function(){
					
				});
			});
		},
		centerAndZoom : function(name1,name2){
			//地图放大
			var pointstr = new Array();
			if(name1==name2){
				pointstr.push(this.getShapte(name1).join(","));
			}else{
				pointstr.push(this.getShapte(name1).join(","));
				pointstr.push(this.getShapte(name2).join(","));
			}
			if(pointstr.length > 1){
	        	this.getExtent(pointstr);
	    	}else if(pointstr.length == 1){
	    		var point = pointstr[0].split(",");
                window.PMap.centerAndZoom(new Point(point[0], point[1]), 14);
	    	}
		},
		moveGJMark : function(name){
			var shape = this.getShapte(name);
			//var _latlng = EzServerClient.latLng(shape[1], shape[0]);
			var _latlng=new Point(shape[0],shape[1]);
			this.gjMarker.setPoint(_latlng);
			//this.gjMarker.getSelf().setLatLng(_latlng);
		},
		createGjMark : function(name){
			if(this.gjMarker!=null){
                window.PMap.removeOverlay(this.gjMarker);
			}
			var shape = this.getShapte(name);
			var trackType=this.getTrackName(name);
			//var point = new Point(shape[0], shape[1]);
			var point=new Point(shape[0]+","+shape[1]);//新版本地图客户端所用的点，纬度在前，经度在后
			//MapApp.centerAndZoom(point, 8);//居中对齐
		//	infoHtml = "<div class='gj_topdiv' style='position:absolute;top:-32px;left:-16px;z-index:99990' id='gj_markdiv'>"; 
		//	infoHtml += "<img style=\"position:absolute;top:35px;\" src='default/img/";
			switch(trackType) { 
				case 'lg':
					infoHtml +="holte_s.png'/></div>"; 
					break;
				case 'wb':
					infoHtml +="webwb_s.png'/></div>"; 
					break;	
				case 'hc':
					infoHtml +="train_s.png'/></div>"; 
					break;
				case 'mhcg':
					infoHtml +="airplane_s.png'/></div>"; 
					break;
				case 'jzrksyrkjzgj':
					infoHtml +="house_s.png'/>"; 
					break;
				case 'jjkkxx':
					infoHtml +="kakou_s.png'/>"; 
					break;
			}
			infoHtml += "<span style=\"width:"+name.length*10+"px;border-radius:4px;position:absolute;z-index:500;display:inline-block;color:white;background-color:black;font-size:15px;font-weight:400\">"+name+"</span>"; 
			infoHtml += "</div>";
			this.gjMarker = new HTMLElementOverLay("", point, infoHtml, -0, -0);
			if(this.gdlx=="duogui") {
				//居中定位and调整地图级别
				//MapApp.centerAndZoom(point, MapApp.getZoomLevel());//居中定位
			}
			//增加marker
            _ezmap.addOverlay(this.gjMarker);
		},
		getShapte : function(name){
			var shape = this.option.series[0].geoCoord[name];
			return shape;
		},
		getTrackName:function(name) {
			return this.option.series[0].track[name];
		},
		clear : function(){
      var $ecDiv = $(this.mapExt.getEchartsContainer());
			if( this.mapExt!=null){
				 this.mapExt.clear();
				 this.mapExt.getECharts().dispose();
				 this.mapExt = null;
			}
      $ecDiv.remove();
			this.closeEchartsLegend();

		},
		clear2:function() {
			//先回归正常状态
			this.showEcharts();
 			this.overPlayList();
			this.clear();
			$("#"+this.gjhf_id+"").unbind("click",this.gjhf_id_fun); 
			$("#"+this.gjzt_id+"").unbind("click",this.gjzt_id_fun); 
			$("#"+this.gjtz_id+"").unbind("click",this.gjtz_id_fun); 
		},
	    clearOverlay : function(){
			if(this.mapExt){
				this.mapExt.clearOverlay();
			}
			//this.overPlayList();
			this.closeEchartsLegend();
	    },
		createEchartsLegend : function(){
	    	var self = this;
	    	if($("#heatlegend_2").length == 0){
	    		var heatLegendHtml = "<div id='heatlegend_2' style='position:absolute;bottom:20px;left:0px;padding:3px 3px 0 3px;" +
	     		"background:#F4F4E5;height:28px;line-height:28px;'><span style='margin-right:8px;'>轨迹说明</span>" +
	     		"<a class='heatlegendcol' style='background:#6A00FB;border:1px solid #6A00FB;color:white;' id='gj_qd'>起点" +
	     		"<div class='heatlegend_div'>轨迹起点<span class='heatlegend_span'></span></div></a>" +
	     		"<a class='heatlegendcol' style='background:#FE1800;border:1px solid #FE1800;color:white;' id='gj_gc'>过程" +
	     		"<div class='heatlegend_div'>轨迹途径点<span class='heatlegend_span'></span></div></a>" +
	     		"<a class='heatlegendcol' style='background:#035503;border:1px solid #035503;color:white;' id='gj_zd'>终点</a>" +
	     		"</div>" +
	     		"";	
	     		$(heatLegendHtml).appendTo($("#ezmap"));
	     		$("#heatlegend_2").find(".heatlegendcol").hover(function(){
	     			$(this).find(".heatlegend_div").toggle();
	     		},function(){
	     			$(this).find(".heatlegend_div").toggle();
	     		});  
	     		//起点
	     		$("#gj_qd").click(function(){ 
	     			var name = self.line[0][0].name;
	     			self.centerAndZoom(name,name);
	     		});
	     		//终点
	     		$("#gj_zd").click(function(){
	     			var name = self.line[self.line.length-1][1].name;
	     			self.centerAndZoom(name,name);
	     		});
	    	}else{
	    		$("#heatlegend_2").css("display", "block");
	    	}
	    },
	    closeEchartsLegend : function(){
			this.overPlayList();
			//$(".dowebok_gj").hide();
	    	//$("#heatlegend_2").css("display", "none");
	    },
		getExtent : function(polylinePoints){
			var xmax = 0, xmin = 0, ymax = 0, ymin = 0;
			for ( var i = 0; i < polylinePoints.length; i++) {
				var geometry = polylinePoints[i];
				var x = null;
				var y = null;
				if(typeof geometry == "string"){
					coords = geometry.split(",");
					x = coords[0];
					y = coords[1];
				}else{
					x = geometry.x;
					y = geometry.y;
				}
				if (xmax == 0) {
					xmax = x, xmin = x, ymin = y, ymax = y;
				}
				if (xmax < x) {
					xmax = x;
				}
				if (ymax < y) {
					ymax = y;
				}
				if (xmin > x) {
					xmin = x;
				}
				if (ymin > y) {
					ymin = y;
				}
			}
			if(xmin == xmax && ymin == ymax){
                _ezmap.centerAndZoom(new Point(xmin, ymin), 14);
			}else{
                _ezmap.centerAtMBR(xmin, ymin, xmax, ymax);
			}
		}
	};
	return ez_charts;
};
