import VueSearchPanel from './components/VueSearchPanel.vue'

VueSearchPanel.install = function (Vue, options) {
  Vue.component('VueSearchPanel', VueSearchPanel)
}

if (typeof window !== undefined && window.Vue) {
  window.Vue.use(VueSearchPanel)
}

export default VueSearchPanel