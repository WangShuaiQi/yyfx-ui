<template>
  <div class="main-box-area wrapper" v-loading="isLoading" data-mu-loading-color="#44b9e2" data-mu-loading-overlay-color="rgba(0, 0, 0, .7)" data-mu-loading-text="加载中...">
    <div ref="d3GraphArea" class="d3-graph-area" style="user-select:none;"></div>
  </div>
</template>
<script>
import * as d3 from 'd3';
import _ccd3 from './d3Ext/ccd3.js';      //封装好的力导图组件
import _ from 'lodash'

import d3Data from './d3_data';

export default {
  name: 'd3Draw-components',
  props:{
    /**
     * nodes:[{
        "id": "group-2019-09-08_19934174295",
        "label": "根戈仁真", //显示标签
        "tel": "19934174295",
        "image":"/dfa/asdfa/ag",
        "weight": "29", //比重控制 配合最大比重 控制半径大小
        "strokeColor":"#ffffff", //边框填充色
        "fillColor":"#ffffff"  // 整体填充色
        "fx":1,  //预下轮移动位置
        "fy":1,  //预下轮移动位置
        "x":1,   //移动坐标位置
        "y":1    //移动坐标位置
        }]
     * links:[{
         "id": "group-2019-09-08_19113858291_13154411013",
         "lable":"ttttt",   //线条上文字展示
        "source": "group-2019-09-08_19113858291", //node 源节点ID
        "target": "group-2019-09-08_13154411013", //node 目标节点ID
        "weight": "29",
     * }]
     */
    jsonData:{
      default:()=>({links:[],nodes:[]}),
      type:Object
    },
    //节点最大半径
    maxNodeRadius:{
      default:50,
      type:Number
    },
    //节点最小半径
    minNodeRadius:{
      default:20,
      type:Number
    },
    /**
     * 最大节点比重值,进行控制节点大小，
     */
    maxNodeWeight:{
      default:100,
      type:Number
    },
    /**
     * 节点边框宽度设置
     */
    nodeStrokeWidth:{
      default:5,
      type:Number
    },
    defaultNodeImg:{
      default:'/static/img/people.png',
      type:String
    },
    lineColor:{
      default:'#bcbcbc',
      type:String
    },
    lineWidth:{
      default:2,
      type:Number
    }
  },
  data() {
    return {
      isLoading:false,
      json:{
        nodes:[],
        links:[]
      },
      tstate:{
      }
    };
  },
  mounted() {
    let _th = this;
    setTimeout(()=>{
      if(_th.jsonData ==null || _th.jsonData.node ==null || _th.jsonData.nodes.length === 0){
        _th.initDefaultD3();
      }
    },3000);

    // $('.d3GraphArea .image').error(function(){
    //   $(this).attr('href',()=>{
    //     return '/static/img/people.png';
    //   })
    // })
  },
  methods: {
    //启动测试d3代码
    initDefaultD3(){
      let d3JsonData = JSON.parse(JSON.stringify(this.jsonData));
      //绘图数据获取
      // 过滤数据
      // d3JsonData.nodes =  d3JsonData.nodes.slice(0,50);
      d3JsonData.nodes.forEach((o,index)=>{
        o.weight = 1;
        // if(index%5 === 0){
        //   o.weight = 50;
        // }
      })
      d3JsonData.links = _ccd3.filterJsonData(d3JsonData.links, d3JsonData.nodes);
      // d3JsonData.links = [];
      this.json = d3JsonData;
      window.d3 = d3;
      window._ccd3 = _ccd3;
      this.ccd3ForceInit();

      setTimeout(()=>{
        let updateJson  = _.cloneDeep(d3JsonData.nodes.slice(1,5)).map(o=>{
          o.weight = 60;
          o.image = '/static/wxj/img/projectsManage/logo.png';
          // _.merge(o,
          //   {"fx":1,  //预下轮移动位置
          //   "fy":1,  //预下轮移动位置
          //   "x":1,   //移动坐标位置
          //   "y":1    //移动坐标位置
          //   })
          return o;
        });
        this.updateJsonNodes(updateJson);
      },6000);

      setTimeout(()=>{
        let updateJson  = _.cloneDeep(d3JsonData.nodes.slice(1,5)).map(o=>{
          o.weight = 60;
          o.image = '/static/wxj/img/specialItemSpace/gridModeClick.png';
          return o;
        });
        this.updateJsonNodes(updateJson);
      },12000);


      setTimeout(()=>{
        let updateJson  = _.cloneDeep(d3JsonData.nodes.slice(1,5)).map(o=>{
          o.weight = 1;
          o.image = null;
          return o;
        });
        this.updateJsonNodes(updateJson);
      },18000);

    },

    /**
     * 初始力向d3 效果
     */
    async ccd3ForceInit(){
      let _this = this;
      this.isLoading = true;
      d3.select(this.$refs.d3GraphArea).selectAll("*").remove();
      _ccd3.creatVis(this.$refs.d3GraphArea);

      //给闪烁点加点击详情
      _ccd3.options.nodes.click = function(d){
        _this.tstate.outControlInfo = d.data;
        _this.tstate.showOutControlInfo = true;
        return true;
      }
      //画布点击事件
      _ccd3.options.vis.click = function(d){
        if (_this.tstate.showOutControlInfo) {
          _this.tstate.outControlInfo = '';
          _this.tstate.showOutControlInfo = false;
        }
        return true;
      }
      _ccd3.forceJsonData(JSON.parse(JSON.stringify(this.json)));
      await this.tickTimesLoading();
      //设置节点和线的样式
      this.setLayoutStyle();
      _ccd3.renderD3Svg(()=>{
        //更新后的回调，可为空
        //本次更新需要执行的放这里哦
        this.isLoading = false;
        _ccd3.finishLayout();
        _ccd3.autoZoom();
      });
      this.forceCenterPosition($(_ccd3.selectStr).width() / 2, $(_ccd3.selectStr).height() / 2);
      _ccd3.force.alphaTarget(0.3).restart();
    },
    /**
     * 加载load tick时候,进行刷新加载
     * @returns {Promise}
     */
    tickTimesLoading(){
      return new Promise((r,j)=>{
        let tickTimer = setInterval(()=>{
          if (_ccd3.tickTimes >= 20) {
            clearInterval(tickTimer);
            r('OK');
          }
        },50)
      })
    },
    setLayoutStyle(){
      this.setNodeStyle();  //根据数据设置节点样式
      this.setEdgeStyle();  //根据数据设置线条样式
      // 去掉右键菜单
      _ccd3.options.vis.rightClick = function(){
        return false;
      }
      _ccd3.options.nodes.rightClick = function(){
        return false;
      }
      _ccd3.options.edges.rightClick = function(){
        return false;
      }
      _ccd3.options.updateCallback=function(){
        //这个配置用于定义一个方法，在update执行后回调
        //图像重绘后需要重新绑定节点、线条乖画面中的对象的事件
        //每次更新都要执行的放这里哦
        //注意：update操作不会清除vis上绑定的事件
        _ccd3.nodeDrag();//开起节点拖拽
      }
    },
    setEdgeStyle(){
      /**
       线条样式定义
       **/
      let _th = this;
      _ccd3.options.edges.colorcondition=function(d){
        let r = Math.random();
        let color = '';
        if(r < 0.3){
          color = '#ff221e';
        }else if(r > 0.6){
          color = '#d9b957';
        }else{
          color = '#5599ff';
        }
        if(_th.lineColor){
          color = _th.lineColor;
        }
        return color
      }

      _ccd3.options.edges.sizecondition=(d)=>{
        //可自定义一个线条粗细判断的过程，当前统一使用2像素的线条
        return _th.lineWidth;
      }
      _ccd3.options.edges.label=(d)=>{
        //可定义一个线条上文字标签添加的过程
        return '';//线条不上要标签
      }
    },
    /**
     * 节点样式设置

     ---需求---
     僧尼：黄色 【姓名】
     重点人员：红色  【姓名】
     境外：黄色 + 国旗 【电话号】
     **/
    setNodeStyle(){
      let _th = this;
      _ccd3.options.nodes.nodeHtml=(node)=>{
        node.html('');
        node.append('svg:circle').attr('id',(d)=>{
          return 'node-circle-'+d.id;
        }).attr('class',(d)=>{
          return 'node-bg'
        }).attr("r", (d)=>{
          //根据条件设置节点大小
          if( d.weight && d.weight>0){
            d._r = (_th.minNodeRadius+d.weight / _th.maxNodeWeight *(_th.maxNodeRadius-_th.minNodeRadius));
          }else{
            d._r = _th.minNodeRadius;
          }
          return d._r;
        }).attr("fill",d=>{
          //根据条件设置节点颜色,默认进行随机颜色
          let r = Math.random();
          if(r < 0.3){
            d.color='#ff221e';
          }else if(r > 0.6){
            d.color='#d9b957';
          }else{
            d.color='#5599ff';
          }
          if(d.fillColor){
            d.color = d.fillColor;
          }
          return d.color;
        }).attr("stroke-width",d=>_th.nodeStrokeWidth)
          .attr("stroke",d=>{
            if(d.strokeColor){
              return d3.color(d.strokeColor).darker(1.2)
            }
            return d3.color(d.color).darker(1.2)
          });
        node.append('clipPath')
          .attr('id', d => `clip-${d.id}`)
          .append('use')
          .attr('xlink:href', d => `#node-circle-${d.id}`);

        node.filter(d =>d.image !=null)
          .append('image')
          .attr('id',d=>`node-image-${d.id}`)
          .attr('clip-path', d => `url(#clip-${d.id})`)
          .attr('xlink:href',d=>d['image'])
          .attr('x', d => -d._r*1.5)
          .attr('y', d => -d._r*1.5)
          .attr('height', d => d._r * 3)
          .attr('width', d => d._r * 3);

        node.append("svg:text")
          .attr("style",d=>{
            return 'font-size:'+(d._r)+'px';
          })
          .attr("class", "node-name")
          .attr("class", (d)=>{
            if(!(d.core>0 && d.core<15)){
              return 'node-name-small'
            }
          })
          .attr("dy", 5)
          .attr("x", d=>{
            return d._r+10;
          })
          .attr("text-anchor", "left")
          .attr("fill", "#111111")
          .text(d => d.label); // 设置节点文字
        return node;
      }


    },

    /**
     * jsonNodes  []  数组对象
     *
     */
    updateJsonNodes(jsonNodes){
      let _th = this;
      jsonNodes.forEach(j=>{

        let g = _ccd3.vis.select(`#node-${j.id}`).datum(d=>_.merge(d,j));

        g.select(`#node-circle-${j.id}`)
          .datum(d=>_.merge(d,j))
          .attr("r", (d)=>{
            //根据条件设置节点大小
            if( d.weight && d.weight>0){
              d._r = (_th.minNodeRadius+d.weight / _th.maxNodeWeight *(_th.maxNodeRadius-_th.minNodeRadius));
            }else{
              d._r = _th.minNodeRadius;
            }
            return d._r;
          }).attr("fill",d=>{
            //根据条件设置节点颜色,默认进行随机颜色
            let r = Math.random();
            if(r < 0.3){
              d.color='#ff221e';
            }else if(r > 0.6){
              d.color='#d9b957';
            }else{
              d.color='#5599ff';
            }
            if(d.fillColor){
              d.color = d.fillColor;
            }
            return d.color;
          })
          .attr("stroke-width",d=>_th.nodeStrokeWidth)
          .attr("stroke",d=>{
            if(d.strokeColor){
              return d3.color(d.strokeColor).darker(1.2)
            }
            return d3.color(d.color).darker(1.2)
          });

        //初始化图像
        if(j.image != null){
          let image = g.select(`#node-image-${j.id}`);
          if(image.node() == null){
            g.append('image')
              .attr('id',`node-image-${j.id}`)
              .attr('clip-path', d => `url(#clip-${d.id})`)
              .attr('xlink:href',d=>d['image'])
              .attr('x', d => -d._r*1.5)
              .attr('y', d => -d._r*1.5)
              .attr('height', d => d._r * 3)
              .attr('width', d => d._r * 3);
          }else{
            g.select(`#node-image-${j.id}`).attr('xlink:href',d=>d['image'])
              .attr('x', d => -d._r*1.5)
              .attr('y', d => -d._r*1.5)
              .attr('height', d => d._r * 3)
              .attr('width', d => d._r * 3);
          }
        }else{
          g.select(`#node-image-${j.id}`).remove();
        }

        //更改文字大小
        g.select("text")
          .attr("style",d=>'font-size:'+(d._r)+'px')
          .attr("class", "node-name")
          .attr("class", (d)=>{
            if(!(d.core>0 && d.core<15)){
              return 'node-name-small'
            }
          })
          .attr("dy", 5)
          .attr("x", d=>{
            return d._r+10;
          })
          .attr("text-anchor", "left")
          .attr("fill", "#111111")
          .text(d => d.label);
        // _th.renderNodeData(g.select(`#node-circle-${j.id}`).datum(d=>_.merge(d,j)));
        // _th.renderNodeImageData(g);
      });
      console.log("end")
    },

    /**
     * 刷新node节点的json，改变显示
     *
     */
    renderNodeData(gNode){
      let _th = this;

      gNode.select(`#node-circle-${j.id}`)
      node.attr("r", (d)=>{
        //根据条件设置节点大小
        if( d.weight && d.weight>0){
          d._r = (_th.minNodeRadius+d.weight / _th.maxNodeWeight *(_th.maxNodeRadius-_th.minNodeRadius));
        }else{
          d._r = _th.minNodeRadius;
        }
        return d._r;
      }).attr("fill",d=>{
        //根据条件设置节点颜色,默认进行随机颜色
        let r = Math.random();
        if(r < 0.3){
          d.color='#ff221e';
        }else if(r > 0.6){
          d.color='#d9b957';
        }else{
          d.color='#5599ff';
        }
        if(d.fillColor){
          d.color = d.fillColor;
        }
        return d.color;
      }).attr("stroke-width",d=>_th.nodeStrokeWidth)
        .attr("stroke",d=>{
          if(d.strokeColor){
            return d3.color(d.strokeColor).darker(1.2)
          }
          return d3.color(d.color).darker(1.2)
        });
    },
    renderNodeImageData(gNode){
      let j = gNode.datum()
      let image = gNode.select(`#node-circle-${j.id}`);
      debugger
      if(image){

        debugger
        imageNode
          .attr('xlink:href',d=>d['image'])
          .attr('x', d => -d._r*1.5)
          .attr('y', d => -d._r*1.5)
          .attr('height', d => d._r * 3)
          .attr('width', d => d._r * 3);

        gNode.filter(d =>d.image !=null)
          .append('image')
          .attr('id',`node-image-${d.id}`)
          .attr('clip-path', d => `url(#clip-${d.id})`)
          .attr('xlink:href',d=>d['image'])
          .attr('x', d => -d._r*1.5)
          .attr('y', d => -d._r*1.5)
          .attr('height', d => d._r * 3)
          .attr('width', d => d._r * 3);
      }else{
        image.remove();
      }

    },

    /**
     * 控制d3组件位置和动效
     */
    svgPositionEffects(btnType){
      if(btnType===1){
      }else if(btnType===3){//静止
        _ccd3.fixNodes();
      }else if(btnType===4){//恢复力向动态
        _ccd3.forceNodes();
      }else if(btnType===5){//居中
        this.forceCenter();
        _ccd3.autoZoom();
      }else if(btnType===6){
        alert('敬请期待')
      }else if(btnType===7){
        alert('敬请期待')
      }else if(btnType===8){
        alert('敬请期待')
      }else if(btnType===9){
      }else{
        alert('无操作')
      }
    },
    forceCenter(){
      _ccd3.force.force("center", d3.forceCenter( $(_ccd3.selectStr).width() / 2,  $(_ccd3.selectStr).height() / 2));//设置力导向图中心位置
      _ccd3.force.alphaTarget(0.3).restart();
    },
    forceCenterPosition(x,y){
      _ccd3.force.force("center", d3.forceCenter( x, y));//设置力导向图中心位置
      _ccd3.force.alphaTarget(0.3).restart();
    },
    /**
     * 自动缩放到最佳状态
     */
    autoZoom(){
      _ccd3.autoZoom();
    },
    /**
     * 获取d3上图所有节点
     * @returns {null}
     */
    getD3Nodes(){
      return _ccd3.node;
    },
    /**
     * 获取D3上图所有连线对象
     * @returns {null}
     */
    getD3Links(){
      return _ccd3.link;
    },
    /**
     * 获取D3力导向图对象
     * @return {}
     */
    getD3Force() {
      return _ccd3.force;
    }
  },
  watch:{
    jsonData(val){
      this.json = val;
      this.initDefaultD3();
    }
  },
  beforeDestroy:function(){
    window.d3 = null;
    window._ccd3 = null;
    _ccd3.dispose();
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">

  .main-box-area{
    width: 100%;
    height: 100%;
    .d3-graph-area{
      width: 100%;
      height: 100%;
      padding: 0.1rem;
      /*border: 1px solid #eeeeee;*/
    }
  }

  .d3-graph-area{
    &/deep/ .node.active{
    }
    &/deep/ .node.inactive{
      opacity: 0.2;
    }
  }

.mu-loading-process-bar {
    width: 80px;
    height: 10px;
    border-radius: 5px;
    background-color: #464545;
    position: relative;
    margin-top: 10px;
}
.mu-loading-process-bar-i {
    height: 10px;
    border-radius: 5px;
    background-color: rgb(68, 185, 226);
    position: relative;
}
.mu-loading-process-bar-i::after{
    content: attr(prec);
    color: rgb(68, 185, 226);
    position: absolute;
    right: -45px;
    bottom: -4px;
}
</style>
