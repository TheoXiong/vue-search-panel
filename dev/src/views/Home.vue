<template>
  <div id="home">
    <nav-menu></nav-menu>
    <demo ref="demo"></demo>
  </div>
</template>

<script>
import NavMenu from '@/views/NavMenu.vue'
import Demo from '@/views/Demo.vue'

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  mounted () {
    document.addEventListener('keydown', event => {
      if (event && event.keyCode === 68 && event.shiftKey) {
        this.show({ theme: 'dark' })
      } else if (event && event.keyCode === 76 && event.shiftKey) {
        this.show({ theme: 'light' })
      } else if (event && event.keyCode === 67 && event.shiftKey) {
        this.show({ theme: 'light', panel: 'command' })
      } else if (event && event.keyCode === 82 && event.shiftKey) {
        this.show({ theme: 'light', panel: 'recently' })
      }
    })
  },
  methods: {
    show (info) {
      if (this.$refs && this.$refs.demo) {
        this.$refs.demo.show(info)
      }
    }
  },
  components: { NavMenu, Demo }
}
</script>

<style scoped>
#home{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0px;
  min-width: 1360px;
}
</style>
