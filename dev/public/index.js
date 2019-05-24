import Vue from 'vue'
import VueSearchPanel from '../../src/index.js'
import './index.css'

Vue.use(VueSearchPanel)

const vm = new Vue({
  el: '#app',
  data: {
    value: ''
  },
  mounted: function() {
  },
  computed: {
  },
  methods: {
    show () {
      this.$nextTick(() => {
        this.$refs.vSearchPanel.showSearchPanel()
      })
    }
  }
})