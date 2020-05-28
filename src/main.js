import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式，要不整没有高度
import './assets/css/public.css'

import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
