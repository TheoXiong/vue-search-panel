<template>
  <div id="home">
    <nav-menu ></nav-menu>
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
        this.show()
      }
    })
  },
  methods: {
    show () {
      if (this.$refs && this.$refs.demo) {
        this.$refs.demo.show()
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
