import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入设置基准值
import 'amfe-flexible'

// 导入vant组件库
import vant from 'vant'
import 'vant/lib/index.less'

// 需要在vant样式之后引入全局样式
import '@/styles/index.less'
Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
