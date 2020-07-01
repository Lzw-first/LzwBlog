import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式，要不整没有高度
import './assets/css/public.css'
// 导入icoMoon图标库  忘了怎么用，回头查查看
// import './assets/icomoon/style.css'

import './plugins/element.js'

// 导入 axios
import axios from 'axios'
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 时间格式处理函数
Vue.filter('dateFormat', time => {
  const dt = new Date(time)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + 1 + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`
})

// 处理天气的时间  20200604170000
Vue.filter('timeFormat', time => {
  const hh = time.substr(8, 2)
  const mm = time.substr(10, 2)
  return hh + ':' + mm
})
// 处理学习时间
Vue.filter('studyTime', time => {
  return (Math.floor(time) + '').padStart(2, '0')
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
