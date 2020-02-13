/**
 *
 *
 *
 */
import store from '../store'
import {Message} from 'element-ui'


export default {
  requestCount:0,
  curTimer:0,
  miniTime:0,
  //开启进度
  start(){
    this.timerRestCount();
    if(this.requestCount == 0){
      this.miniTime = setTimeout(()=>{
        store.commit('isShowLoading', true);
      },600);
    }
    this.requestCount++;
  },
  done(){
    this.requestCount>0 && this.requestCount--;
    if(this.requestCount == 0){
      clearTimeout(this.miniTime);
      clearTimeout(this.curTimer);
      store.commit('isShowLoading', false);
    }
  },
  /**
   * 终结所有
   */
  setAllDone(){
    clearTimeout(this.curTimer);
    this.requestCount = 0;
    store.commit('isShowLoading', false);
    Message.warning('接口请求超时15秒');
  },

  /**
   * 超过15s终结当前遮罩
   */
  timerRestCount(){
    clearTimeout(this.curTimer);
    this.curTimer = setTimeout(()=>{
      this.setAllDone();
    },15000);
  }



}
