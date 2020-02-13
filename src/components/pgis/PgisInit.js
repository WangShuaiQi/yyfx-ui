import pgisExt from './PgisExtend'
import jquery from 'jquery'

let loadingPromise;
export default {
  loadScript(){
    window.pgisCurUrl = "//" + location.host;
    if (loadingPromise == null) {
      loadingPromise = new Promise((r,j)=>{
        let curDateT = new Date().getTime() / 1000 / 60;
        jquery.getScript("/static/pgis/init.js?_=" + curDateT).done(() => {
          pgisExt.protoTypeDemoApp();
          PgisMapApp.onLoad(() => {
            r("OK");
          });
        });
      });
    }
    return loadingPromise;
  },
}
