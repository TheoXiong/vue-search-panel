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
      if (event && event.keyCode === 80 && event.shiftKey) {
        // Shift + P
        this.show({ theme: 'light', action: 'help' })
      } else if (event && event.keyCode === 83 && event.shiftKey) {
        // Shift + S
        this.show({ theme: 'light', action: 'search' })
      } else if (event && event.keyCode === 67 && event.shiftKey) {
        // Shift + C
        this.show({ theme: 'light', action: 'command' })
      } else if (event && event.keyCode === 82 && event.shiftKey) {
        // Shift + R
        this.show({ theme: 'light', action: 'recently' })
      } else if (event && event.keyCode === 70 && event.shiftKey) {
        // Shift + F
        this.show({ theme: 'light', action: 'favorite' })
      } else if (event && event.keyCode === 68 && event.shiftKey) {
        // Shift + D
        this.show({ theme: 'dark', action: 'help' })
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
