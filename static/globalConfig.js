/**
 * 前端页面系统统一配置，windows
 */
(function (w,d) {
  w.hostConfig = {
    hostIndexUrl:location.origin,   //系统服务主页地址
    pgisMapUrl:"http://80.2.33.136:8090",    // 地图服务地址
    pgisTileUrl:"http://80.2.33.138:9090",    // 地图瓦片服务地址
  };
}(window,document))
