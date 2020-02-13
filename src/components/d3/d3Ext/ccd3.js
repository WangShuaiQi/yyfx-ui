import * as d3 from "d3";
import util from "./_util.js"; //公共方法
import _ from 'lodash';
import contextmenuInit from "./_contextmenu.js";//右键菜单
export default {
  /*
  ccd3的目标：将可配置项集中配置，并重写原框架中的方法，使其支持配置
      参考Vis、Echarts等组件配置及使用方式对D3关系图进行简单封状
      该对象中的所有方法均及对象可在使用前重定义，便于扩展
      请勿直接修改该文件中的代码，如需要修改请在外部使用时重定义
*/
  vis: null,//存储画布对象
  node: null,//存储所有节点的SVG对象
  link: null,//存储所有连接线的SVG对象
  linetext: null,//存储所有线上的标签的SVG对象
  json: null,//存储JSON数据
  selectStr: null,//存储画布对象选择器（字符串或html element），便于动态获取画布对象
  contextmenu: contextmenuInit(),
  multipleSelected: [],
  tickTimes: 0,
  zoom: null,
  zoomTimer:0,
  forceOff: false,
  creatVis: function(selectStr) {

    //创建画布对象，并存储到ccd3对象中
    //let [width, height] = [$(selectStr).width(), $(selectStr).height()];
    let width = "100%";
    let height = "100%";
    let me = this;
    this.selectStr = selectStr;
    //d3.select('.graph-area').select("*").remove();
    let ccd3 =  this;

    this.zoom = d3.zoom().scaleExtent([0.1, 10]).on("zoom", function() {
      // if (!this.options.vis.onZoom(d3.event.transform)) {
      //   return;
      // }
      // clearTimeout(this.zoomTimer);

      let transform =  d3.event.transform;
      vis.attr("transform", transform );
      // this.zoomTimer = setTimeout(()=>{
      //
      //   },10);
    });
    let vis = d3.select(selectStr)
      .append("svg:svg")
      .attr("id", "J_SvgView")
      .attr("width", width)
      .attr("height", height)
      .call(this.zoom)
      .on("dblclick.zoom", function(d) {
        if (!me.options.vis.dblclick) {
          return;
        } else {
          if (!me.options.vis.dblclick({
            data: d,
            subject: this
          })) {
            return;
          }
        }
        console.log("dblclick.zoom");
      }).on("click.zoom", function(d) {

        //if(!me.options.nodes.multipleSelect){      //根据是否为多选模式判断执行过程 (实际上多先模式下点画布也需要清除选中，所以去掉这个判断)
        d3.selectAll("line").classed("inactive", false);
        d3.selectAll(".node").classed("inactive", false);
        d3.selectAll(".node").classed("active", false);
        d3.selectAll(".group").classed("active", false);
        d3.selectAll("line").classed("active", false);
        d3.selectAll("line").classed("highlight", false);
        //}

        if (!me.options.vis.click) {
          return;
        } else {
          if (!me.options.vis.click({
            data: d,
            subject: this
          })) {
            return;
          }
        }
      })
      .on("contextmenu", function(d) {
        if (!me.options.vis.rightClick) {
          return;
        } else {
          if (!me.options.vis.rightClick({
            data: d,
            subject: this
          })) {
            return;
          }
        }
      })
      .append("svg:g")
      .attr("class", "all")
      .attr("data-width", width)
      .attr("data-height", height);

    let defs = vis.append("svg:defs");
    let arrow = defs.selectAll("marker");

    arrow.data(["start-arrow"]).enter().append("svg:marker")
      .attr("id", d => d)
      .attr("class", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", -7)
      .attr("refY", 0)
      .attr("markerWidth", 10)
      .attr("markerHeight", 16)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,0L10,5L10,-5")
      .attr("fill", "#666");

    arrow.data(["end-arrow"]).enter().append("svg:marker")
      .attr("id", d => d)
      .attr("class", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30)
      .attr("refY", 0)
      .attr("markerWidth", 10)
      .attr("markerHeight", 16)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#666");

    //定义发光效果
    let light = defs.append("filter")
      .attr("id", "light")
      .attr("x", "0")
      .attr("y", "0")
      .attr("height", "150%")
      .attr("width", "150%");
    light.append("feOffset")
      .attr("result", "offOut")
      .attr("in", "SourceGraphic")
      .attr("dx", "0")
      .attr("dy", "0");
    light.append("feGaussianBlur")
      .attr("result", "blurOut")
      .attr("in", "offOut")
      .attr("stdDeviation", "1");
    light.append("feBlend")
      .attr("in2", "blurOut")
      .attr("in", "SourceGraphic")
      .attr("mode", "normal");

    this.vis = vis;
    this.tickTimes = 0;
    return vis;
  },
  force: d3.forceSimulation([])
  //创建并存储一个force对象，在使用时可随时更改属性及调用其方法
    .alphaDecay(0.005) //设置 alpha 衰减率.迭代150，默认0.0228
    .alphaMin(0.005) //需要在 [0, 1] 之间。如果没有指定 min 则返回当前的最小 alpha 值，默认为 0.001. 在仿真内部，会不断的减小 alpha 值直到 alpha 值小于 最小 alpha。
    .velocityDecay(0.5) //默认为 0.4,较低的衰减系数可以使得迭代次数更多，其布局结果也会更理性，但是可能会引起数值不稳定从而导致震荡。
    .force("link", d3.forceLink([]).id((d) => (d.id)).distance(150))
    .force("charge", d3.forceManyBody().strength(-1000))
    ////charge 作用力应用在所用的节点之间，当strength为正的时候可以模拟重力，当为负的时候可以模拟电荷力。
    //  .force("center", d3.forceCenter( $('.graph-area').width() / 2,  $('.graph-area').height() / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("collide", d3.forceLink()
      .strength(1)
      .iterations(1)
    )
  ////strength则将碰撞强度设置为指定的数值，强度范围为 [0, 1]。并返回当前碰撞力模型,默认0.7
  //iterations 则将每次应用碰撞检测力模型时候的迭代次数设置为指定的数值。
  //如果没有指定 iterations 则返回当前的迭代次数，默认为 1。迭代次数越大，最终的布局越优，但是会增加程序运行上的消耗。)
  ,

  /**
   * 设置
   * @param json   {nodes:[],links:[]}
   */
  forceJsonData: function(json) {
    if (json) {
      this.json = json;
    }else{
      throw  'error args';
    }
    this.force.nodes(this.json["nodes"]);
    this.force.force("link").links(this.json["links"]);
    this.force.on("tick", () => (this.tick()));

    this.tickTimes = 0;
    this.force.restart();
  },
  /**
   *
   * @param callback
   */
  renderD3Svg: function(callback) {
    this.packNodes();
    this.packEdges();
    this.lineText();
    // this.force.on("tick", () => (this.tick()));
    d3.select(this.selectStr).style("cursor", "auto");
    this.node.style("cursor", "auto");
    this.contextmenu = contextmenuInit();
    this.bindNodeEvent();
    // this.bindEdgeEvent();
    // this.bindContextmenuEvent();
    if (this.options.updateCallback) {
      this.options.updateCallback();
    }
    if (callback) {
      callback();
    }
  },
  finishLayout: function() {
    this.link && this.link.attr("x1", (d) => (d["source"]["x"]))
      .attr("y1", (d) => (d["source"]["y"]))
      .attr("x2", (d) => (d["target"]["x"]))
      .attr("y2", (d) => (d["target"]["y"]));
    //关系文字显示的位置
    this.linetext && this.linetext.attr("x", (d) => ((d["source"]["x"] + d["target"]["x"]) / 2)).attr("y", (d) => ((d["source"]["y"] + d["target"]["y"]) / 2));
    //节点显示的位置
    this.node && this.node.attr("transform", (d) =>("translate(" + d.x + "," + d.y + ")"));
  },
  tick: function() {
    //力导向步进过程
    this.tickTimes++;
    clearTimeout(this.tickTimer);
    let tickMod = Math.floor(this.json.nodes.length / 100) +1;
    if (this.tickTimes >= 20 && this.tickTimes%tickMod == 0) {
      // console.debug("fixNodes");
      this.finishLayout()
      return
      // if (this.json["nodes"].length > 1000) this.fixNodes();
    }
    // console.log(this.tickTimes,Date.now());
    this.tickTimer = setTimeout(()=>(this.finishLayout()),100);


    //console.log(this.tickTimes);
    //console.log('this.tickTimes',this.tickTimes);
    //节点数量过多时，减少Dom操作防止浏览器崩溃
    if (this.json["nodes"].length > 50 & !this.forceOff) {
      if (this.json["nodes"].length > 50 && this.json["nodes"].length <= 100) {
        if (this.tickTimes % parseInt(this.json["nodes"].length / 10) != 0) {
          return;
        }
      }
      if (this.json["nodes"].length > 100 && this.json["nodes"].length <= 200) {
        if (this.tickTimes % parseInt(this.json["nodes"].length / 20) != 0) {
          return;
        }
      }
      if (this.json["nodes"].length > 200 && this.json["nodes"].length <= 300) {
        if (this.tickTimes % parseInt(this.json["nodes"].length / 40) != 0) {
          return;
        }
      }
      if (this.json["nodes"].length > 300 && this.json["nodes"].length <= 500) {
        if (this.tickTimes % parseInt(this.json["nodes"].length / 60) != 0) {
          return;
        }
      }
      if (this.json["nodes"].length > 500 && this.json["nodes"].length <= 800) {
        if (this.tickTimes % parseInt(this.json["nodes"].length / 80) != 0) {
          return;
        }
      }
      if (this.json["nodes"].length > 800 && this.json["nodes"].length <= 1000) {
        if (this.tickTimes % parseInt(this.json["nodes"].length / 100) != 0) {
          return;
        }
      }
      if (this.json["nodes"].length > 1000 && this.json["nodes"].length <= 1500) {
        if (this.tickTimes % parseInt(this.json["nodes"].length / 150) != 0) {
          return;
        }
      }

    }
    // //console.log(this.force.alpha());
    // this.link.attr("x1", (d) => (d["source"]["x"]))
    // .attr("y1", (d) => (d["source"]["y"]))
    // .attr("x2", (d) => (d["target"]["x"]))
    // .attr("y2", (d) => (d["target"]["y"]));
    // //关系文字显示的位置
    // this.linetext.attr("x", (d) => ((d["source"]["x"]+d["target"]["x"])/2))
    // .attr("y", (d) => ((d["source"]["y"]+d["target"]["y"])/2));

    // //节点显示的位置
    // this.node.attr("transform", (d) => ("translate(" + d.x + "," + d.y + ")"));
    if (this.tickTimes >= 10000) {
      this.tickTimes = 0;
    }
  },
  fixNodes: function() {
    //固定所有节点位置
    this.forceOff = true;
    console.log("fixNodes", d3.selectAll(".node"))
    d3.select(this.selectStr).selectAll(".node").each((v, k) => {
      v.fx = v.x;
      v.fy = v.y;
    });
    this.force.stop();
  },
  forceNodes: function() {
    //恢复力导向自动布局方式
    this.forceOff = false;
    d3.select(this.selectStr).selectAll(".node").each((v, k) => {
      v.fx = null;
      v.fy = null;
    });
    this.force.alphaTarget(0.3).restart();
  },
  packNodes: function() {
    //初始化Node对象，并将Node对象保存到this.node中
    let node = this.vis.selectAll("g.node");
    node = node.data(this.json["nodes"], d => (d["id"]));
    node.exit().remove();
    node = node.enter()
      .append("svg:g")
      .attr("class", d => (d["isNew"] ? "node new-node" : "node"))
      .attr("id", d => ("node-" + d["id"]))
      .merge(node);
    if (this.options.nodes.nodeHtml) {
      node = this.options.nodes.nodeHtml(node);
    } else {
      node = this.addNodeSvg(node, 1);
    }

    this.node = node;
    return node;
  },
  addNodeSvg: function(node, type) {
    //定义节点的样式，如果有新样式可重定义该过程产生新节点样式，甚至根据不同数据使用不同样式

    node.html("");
    node.append("svg:circle")
      .attr("class", "node-bg")
      .attr("r", (d) => {
        if (this.options.nodes.sizecondition) {
          return this.options.nodes.sizecondition(d);
        } else {
          return 10;
        }
      })
      .attr("fill", d => {
        if (this.options.nodes.colorcondition) {
          d.color = this.options.nodes.colorcondition(d);
        } else {
          d.color = "#00dd7e";
        }
        return d.color;
      })
      .attr("stroke-width", d => 3)
      .attr("stroke", d => d3.color(d.color).darker(1.2));
    node.append("svg:text")
      .attr("class", "node-name")
      .attr("dy", "25px")
      .attr("text-anchor", "middle")
      .attr("fill", "#5bc0de")
      .text(d => (d["id"]));
    node.append("svg:text")
      .attr("class", "node-group")
      .attr("dy", d => (d["id"] ? "40px" : "25px"))
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#286090");
    return node;
  },
  packEdges: function() {
    //初始化连接线对象及样式
    let  _th = this;
    let link = this.vis.selectAll("line.link");
    link = link.data(this.json["links"], d => (`${d["source"]["id"]}_${d["target"]["id"]}`));
    link.exit().remove();
    link = link.enter()
      .html("")
      .append("svg:line")
      .lower()
      .attr("class", "link")
      .merge(link)
      .attr("id", (d) => (`link-${d["source"]["index"]}_${d["target"]["index"]}`))
      .attr("stroke", this.options.edges.colorcondition)
      .attr("stroke-width", this.options.edges.sizecondition);
      // .attr("stroke-width", 2);
    /**  箭头实现代码保留
      .attr("marker-start", d => d.source.index === d.target.index ? false : (d["isTwoWay"] ? "url(#start-arrow)" : ""))
      .attr("marker-end", d => {
        _th.vis.select('#end-arrow').clone(true)
          .attr('id', `end-arrow-${d["target"]["index"]}`)
          .attr("refX", d["target"]._r+11);
        return d.source.index === d.target.index ? false : `url(#end-arrow-${d["target"]["index"]})`
      });
      link.append('end',);
    */
    this.link = link;
    return link;
  },
  lineText: function() {
    //初始化连接线上的文字对象
    let linetext = this.vis.selectAll(".linetext");
    linetext = linetext.data(this.json.links);
    linetext.exit().remove();
    linetext = linetext.enter()
      .html("")
      .append("text")
      .attr("class", "linetext")
      .merge(linetext)
      /*    linetext.selectAll('textPath').remove();
          linetext.append('svg:textPath')*/
      .attr("startOffset", "50%")
      .attr("text-anchor", "middle")
      .attr("xlink:href", (d) => (d.source.index === d.target.index ? false : `#link-${d.source.index}_${d.target.index}`))
      .text((d) => d.label)
      .attr("fill", this.options.edges.colorcondition);
    this.linetext = linetext;
    return linetext;
  },
  delNode: function(selNode) {
    //删除选中的节点
    let needDelLinks = new Set();
    let json = this.json;
    selNode = selNode || d3.selectAll(".node.active").data();
    if (selNode.length == 1) {
      json.nodes.forEach(function(d, i) {
        if (d["id"] == selNode[0].id) {
          json.nodes.splice(i, 1);
        }
      });
      for (let linkIdx = 0; linkIdx < json.links.length; linkIdx++) {
        if (json.links[linkIdx]["source"]["id"] == selNode[0]["id"] || json.links[linkIdx]["target"]["id"] == selNode[0]["id"]) {
          json.links.splice(linkIdx, 1);
          linkIdx--;
        }
      }
      this.update(this.json);
    } else {
      util.tip("请选择一个节点！");
    }
  },
  delLink: function(selLink) {
    //删除选中的线条
    let json = this.json;
    selLink = selLink || d3.selectAll(".link.active").data();
    if (selLink.length == 1) {
      json.links.forEach(function(d, i) {
        if (d["source"]["id"] == selLink[0]["source"]["id"] && d["target"]["id"] == selLink[0]["target"]["id"]) {
          json.links.splice(i, 1);
        }
      });
      this.update(json);
    } else {
      util.tip("请选择一条连线！");
    }
  },
  addNode: function(node) {
    //使用数据添加一个节点
    this.json.nodes.push(node);
    this.update(this.json);
  },
  addEdge: function(edge) {
    //使用数据添加一个连接
    this.json.edges.push(edge);
    this.update(this.json);
  },
  nodeDrag: function() {
    //调用该方法使用节点可拖拽（如需要启用请在“options.updateCallback”中进行配置）
    let dragstart = () => {
      // console.log("dragstart", d3.event);
      // this.force.stop();
      this.force.alphaTarget(.3).restart();
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
      dragActiveNodes();
    };
    let dragmove = () => {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
      dragActiveNodes();
    };

    let dragend = () => {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
      dragActiveNodes();
      // console.log("dragend", d3.event);
      //this.force.stop();    //不用停止force的tick过程
    };
    let dragActiveNodes = () => {
      let offsetX = d3.event.x - d3.event.subject.x;
      let offsetY = d3.event.y - d3.event.subject.y;
      d3.selectAll(".node.active").each((d) => {
        d.x = d.x + offsetX;
        d.y = d.y + offsetY;
        d.fx = d.x;
        d.fy = d.y;
      });

      this.finishLayout();
    };

    return this.node.call(d3.drag().on("start", dragstart).on("drag", dragmove).on("end", dragend));
  },
  onAddEdgeModel: function(callback) {
    //调用该方法开启一次连线模式；
    //callback参数为可选，定义一个function可接收连接线数据，并可对其进行加工处理；
    let edgeData = {};
    this.node.style("cursor", "crosshair"); //修改鼠标样式为"+"
    let json = this.json;
    let mousedownNode = null, mouseupNode = null;
    this.node.on("mousedown.drag", null);
    this.node.on("mousedown.add-link", null)
      .on("mouseup.add-link", null);
    this.vis.on("mousedown.add-link", null)
      .on("mousemove.add-link", null)
      .on("mouseup.add-link", null);

    let dragLine = this.vis.append("line").attr("class", "drag-line");
    this.node.on("mousedown.add-link", (d) => {
      mousedownNode = d;
      console.log(d);
      dragLine.attr("class", "drag-line")
        .lower()
        .attr("x1", d["x"])
        .attr("y1", d["y"])
        .attr("x2", d["x"])
        .attr("y2", d["y"]);
      d3.event.stopPropagation();
    })
      .on("mouseup.add-link", (d) => {

        dragLine.attr("class", "drag-line-hidden");
        if (mousedownNode) {
          mouseupNode = d;
          if (mouseupNode == mousedownNode) {
            mousedownNode = null;
            mouseupNode = null;
            return;
          }
          let link = { source: mousedownNode, target: mouseupNode };
          let hasLink = json.links.findIndex((linkItem) => {
            return linkItem.source.id == mousedownNode.id && linkItem.target.id == mouseupNode.id;
          }) > -1;
          let hasOppositeLink = json.links.findIndex((linkItem) => {
            return linkItem.source.id == mouseupNode.id && linkItem.target.id == mousedownNode.id;
          }) > -1;
          if (!hasLink) {
            //如果是反向边 则合并为一条双向边
            if (hasOppositeLink) {
              json.links.forEach((linkItem) => {
                linkItem.source.id == mouseupNode.id && linkItem.target.id == mousedownNode.id && (linkItem["isTwoWay"] = true);
              });
            } else {
              if (callback) {
                edgeData = callback(link);
              } else {
                edgeData = link;
              }
              json.links.push(edgeData);
            }

          } else {
            util.tip("已经有连线了，不能重复添加！");
          }
        }


        this.offAddEdgeModel();
        this.update(json, (d) => {

          if (!this.options.edges.addEdgeOnce) {
            this.onAddEdgeModel(callback);
            this.force.restart();
          }

        });
      });
    d3.select(this.selectStr).on("mousedown.add-link", function() {
      if (!mousedownNode) return;
    })
      .on("mousemove.add-link", function() {
        if (!mousedownNode) return;
        let { translate, scale } = util.getTranslateAndScale();
        let [x, y] = d3.mouse(this);
        dragLine.attr("x1", mousedownNode["x"])
          .attr("y1", mousedownNode["y"])
          .attr("x2", `${x / scale - +translate[0] / scale}`)
          .attr("y2", `${y / scale - +translate[1] / scale}`);
        d3.event.preventDefault();
      })
      .on("mouseup.add-link", function() {
        if (mousedownNode) {
          dragLine.attr("class", "drag-line-hidden");
        }
        mousedownNode = null;
        mouseupNode = null;
        this.offAddEdgeModel();
      });
  },

  offAddEdgeModel: function() {
    this.node.on("mousedown.drag", null);
    this.node.on("mousedown.add-link", null)
      .on("mouseup.add-link", null);
    d3.select(this.selectStr).on("mousedown.add-link", null)
      .on("mousemove.add-link", null)
      .on("mouseup.add-link", null);
    this.node.style("cursor", "auto"); //修改鼠标样式
    this.update(this.json);
  },
  onAddNodeModel: function(callback) {
    //调用该方法开启添加模式；
    //callback参数为可选，定义一个function可接收点击画布返回的数据，用于加工处理节点；
    let nodeData = {};
    let me = this;
    let _callback = callback;
    let g = d3.select(this.selectStr);
    g.on("click.add-node-ev", null);
    console.log("onAddNodeModel", this.vis);
    g.style("cursor", "crosshair"); //修改鼠标样式为"+"
    g.on("click.add-node-ev", function() {
      let { translate, scale } = util.getTranslateAndScale();
      let [x, y] = d3.mouse(this);
      let newNodeId = +new Date();
      //let newNode = { "id": newNodeId, "group": [], isNew: true };
      if (_callback) {
        nodeData = _callback({
          translate: translate,
          scale: scale,
          x: x,
          y: y
        });
      }
      nodeData.id = newNodeId;
      nodeData.isNew = true;
      me.json.nodes.push(nodeData);
      me.update(me.json);
      let [tx, ty] = [x / scale - +translate[0] / scale, y / scale - +translate[1] / scale];
      d3.select("g#node-" + newNodeId).attr("transform", `translate(${tx},${ty})`)
        .datum(Object.assign(d3.select("g#node-" + newNodeId).data()[0], { "x": tx, "y": ty, "fx": tx, "fy": ty }));
    });
  },
  offAddNodeModel: function() {
    let g = d3.select(this.selectStr);
    g.style("cursor", "auto");
    g.on("click.add-node-ev", null);
  },
  bindNodeEvent: function() {
    let me = this;
    this.node.on("contextmenu", function(d) {
      //右键单击事件
      //执行options中定义的事件过程
      if (!me.options.nodes.rightClick) {
        return;
      } else {
        if (!me.options.nodes.rightClick({
          data: d,
          subject: this
        })) {
          return;
        }
      }
      //配置及弹出右键菜单
      d.contextmenuData = {
        "title": "操作当前节点",
        "list": [
          { "class": "node-del", "text": "删除节点" }
        ]
      };
      me.contextmenu.showContextMenu(d);
      //绑定右键删除节点
      d3.select(".node-del").on("click", function() {
        me.delNode([d]);
        setTimeout(() => {
          me.contextmenu.showContextMenu(null);
        });
      });
      d3.event.preventDefault();
      d3.event.stopPropagation();
    })
      .on("mouseover", (d) => {
        //鼠标移入时
        me.node.mouseoutTimeout && clearTimeout(me.node.mouseoutTimeout);
        me.node.mouseoutTimeout = null;
        // console.log(d3.select(this).classed);
      })
      .on("mouseout", function(d) {
        //鼠标移出时
        me.node.mouseoutTimeout && clearTimeout(me.node.mouseoutTimeout);
        me.node.mouseoutTimeout = setTimeout(() => {
          me.contextmenu.showContextMenu(null);
        }, 100);
      })
      .on("click", function(d) {
        //单击
        //执行options中定义的事件过程
        if (!me.options.nodes.click) {
          return;
        } else {
          if (!me.options.nodes.click({
            data: d,
            subject: this
          })) {
            return;
          }
        }

        //根据是否为多选模式判断执行过程
        if (me.options.nodes.multipleSelect) {
          //选中或取消当前
          d3.select(this).classed("active", !d3.select(this).classed("active"));
        } else {
          //取消其他节点被选中的class
          d3.selectAll(".node.active").classed("active", false);
          //选中当前
          d3.select(this).classed("active", true);

        }
        me.hideByNode(d);

        d3.event.stopPropagation();//阻止传播到父级
      })
      .on("dblclick", function(d) {
        //执行options中定义的事件过程
        if (!me.options.nodes.dblclick) {
          return;
        } else {
          if (!me.options.nodes.dblclick({
            data: d,
            subject: this
          })) {
            return;
          }
        }

        d3.event.stopPropagation();//阻止传播到父级
      });
  },
  bindEdgeEvent: function() {
    let me = this;
    this.link.on("contextmenu", function(d) {
      //执行options中定义的事件过程
      if (!me.options.edges.rightClick) {
        return;
      } else {
        if (!me.options.edges.rightClick({
          data: d,
          subject: this
        })) {
          return;
        }
      }
      //配置及弹出右键菜单
      d.contextmenuData = {
        "title": "操作当前连线",
        "list": [
          { "class": "link-del", "text": "删除连线" }
        ]
      };
      me.contextmenu.showContextMenu(d);
      //绑定右键删除连线
      d3.select(".link-del").on("click", function() {
        me.delLink([d]);
        setTimeout(() => {
          me.contextmenu.showContextMenu(null);
        });
      });
      d3.event.preventDefault();
      d3.event.stopPropagation();
    })
      .on("click", function(d) {
        //执行options中定义的事件过程
        if (!me.options.edges.click) {
          return;
        } else {
          if (!me.options.edges.click({
            data: d,
            subject: this
          })) {
            return;
          }
        }
        //选择与取消选择
        if ($(this).hasClass("active")) {
          d3.select(this).classed("active", false);
        } else {
          d3.select(this).classed("active", true);
        }
        d3.event.stopPropagation();//阻止传播到父级
      })
      .on("dblclick", function(d) {
        //执行options中定义的事件过程
        if (!me.options.edges.dblclick) {
          return;
        } else {
          if (!me.options.edges.dblclick({
            data: d,
            subject: this
          })) {
            return;
          }
        }

        d3.event.stopPropagation();//阻止传播到父级
      });
  },
  bindContextmenuEvent: function() {
    let me = this;
    this.contextmenu.contextmenu.on("mouseover", function() {
      me.node.mouseoutTimeout && clearTimeout(me.node.mouseoutTimeout);
    }).on("mouseout", function() {
      me.node.mouseoutTimeout && clearTimeout(me.node.mouseoutTimeout);
      me.node.mouseoutTimeout = setTimeout(() => {
        me.contextmenu.showContextMenu(null);
      }, 100);
    });
  },
  hideByNode: function(d) {
    let relNodesID = [];

    if (!this.options.nodes.multipleSelect) {
      //找出所有连线，没有连接当前节点的加上inactive,灰灰的。并且把线的另一头的节点id记下来
      d3.selectAll("line").classed("inactive", function(l) {
        if (l) {
          if (d.id == l.source.id) {
            relNodesID.push(l.target.id);
          } else if (d.id == l.target.id) {
            relNodesID.push(l.source.id);
          }
          return (d.id !== l.source.id && d.id !== l.target.id);
        }
      });
      //线关联的线加上高亮的样式
      d3.selectAll("line").classed("highlight", function(l) {
        if (l) {
          if (d.id == l.source.id) {
            relNodesID.push(l.target.id);
          } else if (d.id == l.target.id) {
            relNodesID.push(l.source.id);
          }
          return (d.id == l.source.id || d.id == l.target.id);
        }
      });
      _.uniq(relNodesID);
    }
    d3.selectAll(".node").classed("inactive", function(n) {

      return n.id !== d.id && relNodesID.indexOf(n.id) == -1;
    });
    d3.selectAll(".node.active").classed("inactive", false);
  },
  autoZoom: function() {
    //debugger
    //zoomTimeout && clearTimeout(zoomTimeout);
    let _this = this;
    clearTimeout(zoomTimeout);
    let zoomTimeout = setTimeout(function() {
      let yMin = +Infinity,
        yMax = -Infinity,
        defaultScale = 1;
      _this.json.nodes.forEach(function(d) {
        if (d["y"] < yMin) yMin = d["y"];
        if (d["y"] > yMax) yMax = d["y"];
      });
      let graphOffsetHeight = +yMax - +yMin,
        graphClientHeight = $(_this.selectStr).height();
      let scale = 1 / (graphOffsetHeight / graphClientHeight);
      zoomInterval && clearInterval(zoomInterval);
      let zoomInterval = setInterval(function() {
        if (defaultScale > scale + 0.1) {
          defaultScale -=  (defaultScale-scale)/3;
          _this.zoom.scaleTo(d3.select("#J_SvgView"), defaultScale);
        } else {
          clearInterval(zoomInterval);
        }
      });
    }, 100);
  },
  options: {
    //配置信息，修改配置后调用update方法生效
    vis: {
      click: (d) => {
        // $(".people-detail").hide();
        console.log("画布上单击可得到：", d);
        return true;
      },
      rightClick: (d) => {
        console.log("画布上点右键可得到：", d);
        return true;//返回false可阻止自定义的右键菜单
      },
      dblclick: (d) => {
        console.log("画布上双击可得到：", d);
        return true;
      },
      onZoom: (d) => {
        //console.log('缩放：',d); //参数d为D3的transform对象，可以用来做一些判断
        //d3.select('.graph-area .all').attr("transform", ()=>{ return d}) //这样可以手动控制绽放哦

        return true;    //false时可阻止组件的缩放动作
      }
    },
    nodes: {
      sizecondition: (d) => {
        //可自定义一个节点大小判断的过程
        return 10;
      },
      colorcondition: (d) => {
        //可自定义一个节点颜色配置的过程
        if (d.Eccentricity >= 3) {
          return "#ff9933";
        } else {
          return "#33ff99";
        }
      },
      click: (d, event) => {
        console.log("节点上单击可得到：", d, event);
        // $(".people-detail").css({top:d3.event.pageY,left:d3.event.pageX,display:'block'})
        return true;
      },
      rightClick: (d) => {
        console.log("节点上点右键可得到：", d);
        return true;//返回false可阻止自定义的右键菜单
      },
      dblclick: (d) => {
        console.log("节点上双击可得到：", d);
        return true;
      },
      /*这是自定义节点样式的方法
      nodeHtml:(node)=>{
          node.html('');
          node.append('svg:circle')
          .attr('id',(d)=>{
              return 'node-circle-'+d.id;
          })
          .attr('class',(d)=>{
              return 'node_bg'
          })
          .attr("r", (d)=>{
              d._r=10;
              return d._r;
          })
          .attr("fill",d=>{
              d.color='#00dd7e';
              return d.color;
          })
          .attr("stroke-width",d=>3)
          .attr("stroke",d=>d3.color(d.color).darker(1.2));
          node.append("svg:text")
              .attr("class", "node-name")
              .attr("dy", "25px")
              .attr("text-anchor", "middle")
              .attr("fill", "#5bc0de")
              .text(d => (d["id"]));

          node.append('clipPath')
          .attr('id', d => `clip-${d.id}`)
          .append('use')
          .attr('xlink:href', d => `#node-circle-${d.id}`);

          node.filter(d =>{
              return d.Eccentricity>=3;
          })
          .append('image')
          .attr('clip-path', d => `url(#clip-${d.id})`)
          .attr('xlink:href',d=>{
              return 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1114585158,1026985006&fm=27&gp=0.jpg';
          })
          .attr('x', d => -d._r)
          .attr('y', d => -d._r)
          .attr('height', d => d._r * 2)
          .attr('width', d => d._r * 2);

          return node;
      },
      */
      multipleSelect: false    //是否为多选模式
    },
    edges: {
      colorcondition: (d) => {
        //可自定义一个线条颜色判断的过程
        let r = Math.random();
        let color = '';
        if(r < 0.3){
          color = '#ff221e';
        }else if(r > 0.6){
          color = '#d9b957';
        }else{
          color = '#5599ff';
        }
        return color
      },
      sizecondition: (d) => {
        //可自定义一个线条粗细判断的过程
        return 2;
      },
      label: (d) => {
        //可定义一个线条上文字标签添加的过程
        return d["weight"];
      },
      click: (d) => {
        console.log("线条上单击可得到：", d);
        return true;
      },
      rightClick: (d) => {
        console.log("线条上点右键可得到：", d);
        return true;
      },
      dblclick: (d) => {
        console.log("线条上双击可得到：", d);
        return true;
      },
      addEdgeOnce: true
    },
    updateCallback: function() {

    }
  },
  //过滤脏数据
  filterJsonData: function(links, nodes) {
    return _.filter(links, m => {
      let hasTarget = _.find(nodes, n => {
        return n.id == m.target;
      });
      let hasSource = _.find(nodes, n => {
        return n.id == m.source;
      });
      return hasTarget && hasSource;
    });
  },

  dispose(){
    //把本对象初始化;
    this.force.stop();
    this.force.on('tick',null);
    this.vis.selectAll('*').remove();

    _.assign(this, {vis: null,//存储画布对象
      node: null,//存储所有节点的SVG对象
      link: null,//存储所有连接线的SVG对象
      linetext: null,//存储所有线上的标签的SVG对象
      json: null,//存储JSON数据
      selectStr: null,//存储画布对象选择器（字符串），便于动态获取画布对象
      contextmenu: contextmenuInit(),
      multipleSelected: [],
      tickTimes: 0,
      zoom: null,
      zoomTimer:0,
      forceOff: false,
    })

  }
};
