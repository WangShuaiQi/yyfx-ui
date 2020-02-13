import * as d3 from 'd3';
import _ccd3 from './ccd3.js'; 
import util from './_util.js'; //公共方法
let savedJsons=[];

export default function() {
	d3.select('#stopAnm').on('click.stopforce',()=>{
		_ccd3.fixNodes();
	});
	d3.select('#forceLayout').on('click.forceLayout',()=>{
		_ccd3.forceNodes();
	});
	d3.select('#save').on('click',()=>{
		_ccd3.fixNodes();
		var newJson=JSON.parse(JSON.stringify(_ccd3.json));//重要：使用复制的JSON对象，不要能引用
		console.log('newJson',newJson);
		for(var l in newJson.links){  //重要：将线条数据恢复到原始状态，否则数据中带有绑定的节点数据，然后就不能被引力了...
			newJson.links[l].source=newJson.links[l].source.id;
			newJson.links[l].target=newJson.links[l].target.id;
		}
		savedJsons.push(newJson);
		var opshtml='';
		for(var i in savedJsons){
			opshtml+='<option value="'+i+'">'+i+'</option>'
		}
		$('#savedSel').html(opshtml);
	});
	$('#savedSel').change(()=>{
		_ccd3.json=JSON.parse(JSON.stringify(savedJsons[$('#savedSel').val()]));//重要：使用复制的JSON对象，否则被引用后数据会被更改
		_ccd3.update();
		_ccd3.force.alphaTarget(0.3).restart();
	});

	//侦听ccd3组件的事件

	//节点单击
	_ccd3.options.nodes.click=(d)=>{
		console.log('节点：',d);
		$('#attrBox').html(jsonToHTML(d.data)+`
			<div class="form-group">
          <div class="col-sm-offset-4 col-sm-8">
            <button type="button" class="btn btn-default">更新</button>
          </div>
      </div>
		`);
		return true;//返回true，否则就没有选择效果了
	}

	//画布单击
	_ccd3.options.vis.click=(d)=>{
		let nodeFileds=_.keys(_ccd3.json.nodes[0]);
		let nodeFiledsHtml='';
		for(var i in nodeFileds){
			nodeFiledsHtml+=`
				<div class="form-group ">
					<label class="col-sm-9 control-label">
						${nodeFileds[i]}
					</label>
					<div class="col-sm-3">
						<button>配置</button>
					</div>
				</div>
			`;
		}
		console.log('节点：',d);
		$('#attrBox').html(`
			<div class="form-group">
				<label class="col-sm-4 control-label">
					节点数
				</label>
				<div class="col-sm-8">
					<span class="form-control">${_ccd3.json.nodes.length}</span>
				</div>
			</div>
			<div class="form-group ">
				<label class="col-sm-4 control-label">
					关系数
				</label>
				<div class="col-sm-8">
					<span class="form-control">${_ccd3.json.links.length}</span>
				</div>
			</div>
			<hr>
			<h4>节点字段列表</h4>
			${nodeFiledsHtml}
		`);
		return true;//返回true，否则就没有选择效果了
	}

	//多选开关
	$('#multipleSelectBtn').click(function(){
		if($(this).find('span').text()=='多选模式'){
			$(this).find('span').text('单选模式');
			_ccd3.options.nodes.multipleSelect=true;
		}else{
			$(this).find('span').text('多选模式');
			_ccd3.options.nodes.multipleSelect=false;
		}
	});

	//根据ID查找节点
	$('#findIpt').change(function(){
		let searchTxt=$(this).val();
		console.log('searchTxt',searchTxt);
		d3.selectAll('.node').classed('highligthAni',function(n){
      return n.id == searchTxt;
    });
	});

	//写了个方法来拼装对象属性页内容
	function jsonToHTML(json){
		let html='';
		_.forEach(json,function(v,k){
			html+='<div class="form-group"><label class="col-sm-4 control-label">'+k+'</label><div class="col-sm-8"><input type="text" value="'+v+'" class="form-control"></div></div>';
		});
		return html;
	}

	//通过数据来加节点
    $('#addANode').click(function(){
        _ccd3.addNode({
            id:"testNode",
            level:"",
            Label:"",
            Eccentricity:"",
            closnesscentrality:"",
            harmonicclosnesscentrality:"",
            betweenesscentrality:"",
            pageranks:"",
            indegree:"",
            outdegree:"",
            Degree:"",
            fx:100,
            fy:100,
            x:0,
            y:0
        });
    });

    //点一次加一个节点
    $('#onOffAddNodeModel').click(function(){
        //这里可以优化下，进入添加节点模式最好屏蔽掉其他操作，否则容易出错
        _ccd3.onAddNodeModel((d)=>{
            util.tip('这里可以弹个窗让用户先输入节点的信息，能用RxJS的方法最好');
            console.log('这个过程可以包装和处理新增的节点，该模式下点击事件传回来的参数：',d);
             _ccd3.offAddNodeModel();//关闭添加节点模式（这样就点一次加一个）
            return {
                id:new Date(),
                level:"",
                Label:"",
                Eccentricity:"",
                closnesscentrality:"",
                harmonicclosnesscentrality:"",
                betweenesscentrality:"",
                pageranks:"",
                indegree:"",
                outdegree:"",
                Degree:""
            };
        });
    });


    //点一次画一根线
    $('#onOffAddEdgeModel').click(function(){
        _ccd3.options.edges.addEdgeOnce=true;
        _ccd3.onAddEdgeModel((d)=>{
            //这个过程可以包装和处理新增的线条
            console.log('添加的连接线：',d);
            return d;
        });
    });

    //开启连线模式
    $('#onAddEdgeModel').click(function(){
        _ccd3.options.edges.addEdgeOnce=false;
        _ccd3.onAddEdgeModel((d)=>{
            //这个过程可以包装和处理新增的线条
            console.log('添加的连接线：',d);
            return d;
        });
    });

    //关闭连线模式
    $('#offAddEdgeModel').click(function(){
        _ccd3.offAddEdgeModel();
    });

    //开启加节点模式
    $('#onAddNodeModel').click(function(){
        _ccd3.onAddNodeModel((d)=>{
            console.log('这个过程可以包装和处理新增的节点，该模式下点击事件传回来的参数：',d);
            return {
                id:new Date(),
                level:"",
                Label:"",
                Eccentricity:"",
                closnesscentrality:"",
                harmonicclosnesscentrality:"",
                betweenesscentrality:"",
                pageranks:"",
                indegree:"",
                outdegree:"",
                Degree:""
            };
        });
    });
    //关闭加节点模式
    $('#offAddNodeModel').click(function(){
      _ccd3.offAddNodeModel();
    });

    $('#autoZoom').click(function(){
    	util.autoZoom(_ccd3.json); //自动缩放
    })

}
