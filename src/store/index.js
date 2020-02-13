/**
 * Created by Administrator on 2019/9/6.
 * action
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state={
  isShowLoading:false,//框架基础功能需要,数据加载遮罩效果
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
