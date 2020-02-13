import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'

import {znbkRouter } from './znbkRouter'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: _.concat([],znbkRouter)
})
