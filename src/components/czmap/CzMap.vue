<template>
  <div class="czmap">
    <template v-if="mapSettings">
      <div :id="mapSettings.id" style="height: 100%;width: 100%;"></div>
    </template>
    <template v-if="!mapSettings">
      在引用地图组件时请先在代码中创建配置对象，并绑定至地图组件。
    </template>
  </div>
</template>
<script>
  import Cesium from 'cesium/Cesium'
  export default {
    name: "CzMap",
    props: ['mapSettings'],
    data() {
      return {};
    },
    created(){
      console.log('map created!!');
    },
    mounted() {
      this.loadMapViewer();
    },
    methods: {
      test(){
        console.log('地图组件加载正常',this.mapSettings);
      },
      loadMapViewer(){
        if(!this.mapSettings){
          return;
        }
        let _th=this;
        this.viewer = new Cesium.Viewer(this.mapSettings.id, {
           imageryProvider: new Cesium.SingleTileImageryProvider({
             url:'/static/map/world2.jpg'
           }),
          // imageryProvider111 : new window.Cesium.ArcGisMapServerImageryProvider({
          //     url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
          // }),
          //terrainProvider:new Cesium.CesiumTerrainProvider({url:"http://80.2.22.40:8082/510000A/dem"}),
          baseLayerPicker : false,
          homeButton: false,
          navigationHelpButton: false,
          timeline: false,
          animation: false,
          sceneModePicker: false,
          geocoder: false,
          fullscreenButton: false,
          navigationInstructionsInitiallyVisible: false,
          shouldAnimate: true,
          selectionIndicator:false,
          infoBox:false,
          clampToGround:true
        });
        this.viewer.scene.globe.depthTestAgainsTerain=false;
        this.viewer.scene.debugShowFramesPerSecond=false;
        this.$nextTick(()=>{
          //设置map整体背景颜色
          this.viewer.scene.globe.baseColor = Cesium.Color.WHITE;
          let defaultMapLayerSettings={
            url:"/cached_gis/PGIS_S_TileMapServer/Maps/DJ/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={TileCol}&Row={TileRow}&Zoom={TileMatrix}&V=0.3",
            //--mapserve：甘肃省地图服务
            //url:"/mapserve?UserId=admin&AuthCode=abe419810f814c0b9bee279bdef84231&layernameString=gansuSL&Service=getImage&Type=RGB&ZoomOffset=0&Col={TileCol}&Row={TileRow}&Zoom={TileMatrix}&V=0.3",
            // url:"/cached_gis/PGIS_S_TileMapServer/Maps/YX/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={TileCol}&Row={TileRow}&Zoom={TileMatrix}&V=0.3",
            // url: "/cached_gis/PGIS_S_TileMapServer/Maps/QSLST/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={TileCol}&Row={TileRow}&Zoom={TileMatrix}&V=0.3",
            // url: "/cached_gis/PGIS_S_TileMapServer/Maps/SL/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={TileCol}&Row={TileRow}&Zoom={TileMatrix}&V=0.3",
            layer: "tdtBasicLayer",
            style: "default",
            format: "image/jpeg",
            tilingScheme:new Cesium.GeographicTilingScheme(),
            tileMatrixSetID: "PGISMapsCompatible",
            tileMatrixLabels:Array.from({length:22}).map((o,i)=>i+1+""), //配置请求地图的level配置
            maximumScreenSpaceError:2,
            //maximumNumberOfLoadedTiles:1000,
            show: false,
            tileWidth:256,
            tileHeight:256,
            crs:'4326',
            //rectangle:new Cesium.Rectangle(-Math.PI,-Math.PI/2,Math.PI,Math.PI/2),
            rectangle:new Cesium.Rectangle(0.9,0.0,2.8,1.0),  //仅显示有图的区域
            maximumLevel: 21,
            //minimumLevel:1,
            ellipsoid:Cesium.Ellipsoid.WGS84,
            credit: 'pgis地图'
          }

          /**
           * 地图底图图层的配置放到数组中，便于后期做底图切换
           * 地图图层配置和切换方法扩展到viewer对象中，便于组件外部调用
           */
          this.viewer.ext_baseLayers=[
            Cesium.clone(defaultMapLayerSettings),
            Cesium.clone(defaultMapLayerSettings),
            Cesium.clone(defaultMapLayerSettings)
          ]
          // 深蓝色底图地图
          this.viewer.ext_baseLayers[1].url='/cached_gis/PGIS_S_TileMapServer/Maps/QSLST/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={TileCol}&Row={TileRow}&Zoom={TileMatrix}&V=0.3';
          // 矢量地图
          this.viewer.ext_baseLayers[2].url='/cached_gis/PGIS_S_TileMapServer/Maps/SL/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={TileCol}&Row={TileRow}&Zoom={TileMatrix}&V=0.3';

          let pgisLayer=this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(this.viewer.ext_baseLayers[0]),1);
          this.viewer._cesiumWidget._creditContainer.style.display = "none";
          this.viewer.scene.postProcessStages.fxaa.enabled=false;
          //pgisLayer.rectangle=new Cesium.Rectangle(-Math.PI,-Math.PI/2,Math.PI,Math.PI/2);
          //this.viewer.imageryLayers.get(1).alpha=0.5;
          //pgisLayer.colorToAlpha=new Cesium.Color(1,1,1,1); //无效
          //pgisLayer.colorToAlphaThreshold=0.5;  //无效
          //pgisLayer.show=false;
          //pgisLayer.maximumTerrainLevel=5;//无效
          //pgisLayer.minimumTerrainLevel=5;//无效
          //console.log('this.viewer.imageryLayers',pgisLayer)
          //console.log('this.viewer.imageryLayers',pgisLayer.getViewableRectangle())

          this.viewer.ext_changeMapBaseLayer=function(n){
            this.imageryLayers.remove(this.imageryLayers.get(1));
            this.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(this.ext_baseLayers[n]),1);
          }

         });
        this.camera=this.viewer.camera;

        /*this.camera.flyTo({
          destination:window.Cesium.Cartesian3.fromDegrees(this.mapSettings.camera.lon,this.mapSettings.camera.lat,this.mapSettings.camera.height),
          orientation:{
            heading:window.Cesium.Math.toRadians(this.mapSettings.camera.rotate),//旋转角度
            pitch:window.Cesium.Math.toRadians(this.mapSettings.camera.up),//倾斜角度
            roll:0.0
          }
        });*/


      },

      getMapViewer(){
        return this.viewer;
      },
      getMapScene(){
        return this.viewer.scene;
      },
      /**
       *  向地图对象上添加路径
       * @param roadData
       * @param cscolor 颜色
       * @returns {Entity}
       */
      addRoad(roadData,cscolor,cswidth){
        return this.viewer.entities.add({
            id: roadData.id,
            polyline:{
              id:roadData.id,
              positions:new Cesium.Cartesian3.fromDegreesArray(roadData.path),
              width:cswidth,
              material:cscolor
            },
            data:{
              id:roadData.id,
              description:''
            }
          }
        );
      },
      // formartImgMarkData:function(data){
      //   return {
      //       id:data.id ? data.id : 'test',
      //       lon:data.lon ? data.lon : 101,
      //       lat:data.lat ? data.lat : 30,
      //       high:data.high ? data.high : 0,
      //       imgUrl:data.imgUrl ? data.imgUrl : '/map/icon/marks/wifi.png',
      //       imgW:data.imgW ? data.imgW : 20,
      //       imgH:data.imgH ? data.imgH : 20
      //     }
      // },
      // addImgMark:function(data){
      //   //data必须是formartImgMarkData中的JSON格式
      //   if(!data){
      //     data=this.formartImgMarkData();
      //   }
      //   return this.mapViewer1.entities.add({
      //       name: data.id,
      //       position: new window.Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.high),
      //       billboard : {
      //           image : data.imgUrl,
      //           width : data.imgW,
      //           height : data.imgH
      //       },
      //       data:data //存储与绘图无关的数据
      //     })
      // }
    },
    beforeDestroy() {
      // this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      // //清空事件
      // this.viewer.camera.moveEnd._listeners.forEach(f=>this.viewer.camera.moveEnd.removeEventListener(f));
      // this.viewer.scene.postRender._listeners.forEach(f=>this.viewer.scene.postRender.removeEventListener(f));
      // this.viewer && !this.viewer.isDestroyed() && this.viewer.destroy() ;


    }
  };
</script>
<style lang="scss" scoped>
  .czmap{
    height: 100%;
    width: 100%;
  }

  .baseLayerChangeClass {
    width: 50px;
  }

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height: 100%;
  }

</style>
