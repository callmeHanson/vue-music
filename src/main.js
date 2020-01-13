import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/common/less/index.less'
// 去除 移动端300ms检测双击的 延迟
import Fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

Fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/images/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
