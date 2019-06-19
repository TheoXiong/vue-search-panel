import Vue from 'vue'
import App from './App.vue'

import '@/assets/css/global.css'
import '@/assets/css/transition.css'
import '@/assets/iconfont/iconfont.css'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import VueSearchPanel from '../../src/index.js'
// import VueSearchPanel from '../../dist/index.min.js'

Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.use(VueSearchPanel)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App)
})
