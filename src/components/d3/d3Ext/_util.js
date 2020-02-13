import * as d3 from 'd3';
import { downloadExl } from './_exportExcel.js'; //导出excel模块

export default {
    //自动缩放
    autoZoom: function (json) {
        //debugger
        //zoomTimeout && clearTimeout(zoomTimeout);
        clearTimeout(zoomTimeout)
        var zoomTimeout = setTimeout(function () {
            let yMin = +Infinity,
                yMax = -Infinity,
                defaultScale = 1;
            json.nodes.forEach(function (d) {
                if (d["y"] < yMin) yMin = d["y"];
                if (d["y"] > yMax) yMax = d["y"];
            });
            let graphOffsetHeight = +yMax - +yMin,
                graphClientHeight = $(".graph-area").height();
            let scale = 1 / (graphOffsetHeight / graphClientHeight);
            zoomInterval && clearInterval(zoomInterval);
            console.log('zoomTimeout',scale,defaultScale);
            //clearInterval(zoomInterval);
            var zoomInterval = setInterval(function () {
                console.log('zoomTimeout',scale,defaultScale);
                if (defaultScale > scale+0.1) {
                    defaultScale -= 0.05;
                    d3.zoom().scaleTo(d3.select("#J_SvgView"), defaultScale)
                }else{
                    console.log('clearInterval');
                    clearInterval(zoomInterval);
                }
            })
        }, 700);
    },
    //导出excel
    exportExcel: function (json) {
        if (json["links"].length) {
            let convertData = JSON.parse(JSON.stringify(json["links"]));
            let convertDataExtract = [];
            convertData.forEach(function (d, i) {
                convertDataExtract[i] = {};
                convertDataExtract[i]["源点"] = d["source"]["id"];
                convertDataExtract[i]["目标"] = d["target"]["id"];
            });
            downloadExl(convertDataExtract);
        } else {
            this.tip("没有连接线数据可导出！");
        }
    },
    //消息提示
    tip: function (msg) {
        dTimer && clearTimeout(dTimer);
        let d = dialog({content: msg}).show();
        let dTimer = setTimeout(() => {
            d.close().remove()
        }, 2000);
    },
    //获取transform
    getTranslateAndScale() {
        let transform = $(".all").attr("transform");
        let matchArr = transform && /translate/.test(transform) && /scale/.test(transform) && transform.match(/translate\(([^\)]+)\)\s?scale\(([^\)]+)/);
        let translate = matchArr && matchArr[1].split(",") || [0, 0];
        let scale = matchArr && matchArr[2] || 1;
        return {translate, scale}
    },
    //动画设置
    initAnimate: function (endCordinates,force) {
        let circleLayoutTimer;
        d3.selectAll(".node").each(function (nodeItem, nodeIdx) {
            d3.select(this).transition().duration(700).ease(d3.easeCircleInOut).attr("transform", `translate(${endCordinates['x' + nodeIdx]},${endCordinates['y' + nodeIdx]})`)
        });
        d3.selectAll(".link").each(function (nodeItem, nodeIdx) {
            d3.select(this).transition().duration(700).ease(d3.easeCircleInOut)
                .attr('x1', endCordinates['x' + nodeItem["source"]["index"]])
                .attr('y1', endCordinates['y' + nodeItem["source"]["index"]])
                .attr('x2', endCordinates['x' + nodeItem["target"]["index"]])
                .attr('y2', endCordinates['y' + nodeItem["target"]["index"]]);
        });
        circleLayoutTimer && clearTimeout(circleLayoutTimer);
        circleLayoutTimer = setTimeout(function () {
            force.stop();
            d3.selectAll(".node").each(function (nodeItem, nodeIdx) {
                if(nodeItem.ox == null ){
                    nodeItem.ox= JSON.parse(JSON.stringify(nodeItem.x));
                    nodeItem.oy= JSON.parse(JSON.stringify(nodeItem.y))
                }
                nodeItem.fx = endCordinates['x' + nodeIdx];
                nodeItem.fy = endCordinates['y' + nodeIdx];
                
            });
        }, 350);
    },
    //设置圆形布局
    circleLayout(json,force){
        json['mode'] = 'circle';
        if (json["nodes"].length) {
            let centerPoint = [$('.graph-area').width() / 2, $('.graph-area').height() / 2];
            let radian = 360 / json.nodes.length * Math.PI / 180;
            let radius = json["nodes"].length * 7.5;
            let endCordinates = {};
            json.nodes.forEach(function (nodeItem, nodeIdx) {
                endCordinates['x' + nodeIdx] = radius * Math.cos(radian * nodeIdx) + centerPoint[0];
                endCordinates['y' + nodeIdx] = radius * Math.sin(radian * nodeIdx) + centerPoint[1];
            });
            this.initAnimate(endCordinates,force);

        }
    },
    //设置矩形布局
    rectLayout(json,force){
        json.mode = 'rect';
        if (json["nodes"].length) {
            let endCordinates = {};
            let sqr = Math.floor(Math.sqrt(json["nodes"].length));
            let count4row = 0;
            let row = 0;
            d3.selectAll('.node').each(function (d, i) {
                endCordinates['x' + i] = $('.graph-area').width() * 1 / 5 + count4row * ($('.graph-area').width() * 4 / 5 / (sqr));
                endCordinates['y' + i] = $('.graph-area').height() * 1 / 6 + row * ($('.graph-area').height() * 5 / 6 / (sqr + 2));
                if (count4row < sqr - 1) {
                    count4row++;
                } else {
                    count4row = 0;
                    row++;
                }
            });
            this.initAnimate(endCordinates,force);
        }
    },
    //力导向图
    relateLayout(json,update,force,node,link, _tick,linetext){
    json.mode = 'force';
    if (json["nodes"].length) {
        force.stop();
        d3.selectAll(".node").each(function (nodeItem, nodeIdx) {
            nodeItem.x = nodeItem.ox;
            nodeItem.y = nodeItem.oy;
            nodeItem.fx = null;
            nodeItem.fy = null;
        });
        // force.alphaTarget(.01);//alpha是动画的冷却系数，运动过程中会不断减小，直到小于0.005为止，此时动画会停止。
        force.restart();
    }
    },
    //按分类隐藏
    hideByGroup(g,json,update){
        let hideGroups = [];
        d3.selectAll('.node').classed('inactive',function(n){
            if(n.group.indexOf(g) == -1){
                hideGroups.push(n.id)
            }
          return n.group.indexOf(g) == -1
        });
        d3.selectAll('line').classed('inactive',function(l){
          return hideGroups.indexOf(l.source.id) != -1 || hideGroups.indexOf(l.target.id) != -1
        });
    },
    //点击保存时保存当前坐标
    savePosition(json){
        if(json.mode == 'force'){
        d3.selectAll('.node').each(function (d, i) {
            d.ox = d.x;
            d.oy = d.y
        });
        toastr.success("ok,保存成功")
        }else{
            toastr.warning("sorry,不支持保存当前布局")
        }
    }
}  