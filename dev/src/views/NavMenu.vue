<template>
  <div class="nav-menu flex-c-c">
    <div class="nav-menu-wrap flex-c-b">
      <div class="nav-log flex-c">
        <img :src="logoImg" class="nav-logo-img">
        <span class="nav-logo-text">{{ logoText }}</span>
      </div>
      <div class="nav-content flex-c">
        <div class="nav-content-item"
          v-for="item in menus"
          :key="item.key"
          @click="onClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logoImg from '@/assets/image/logo.png'

export default {
  name: 'NavMenu',
  data () {
    return {
      logoImg,
      logoText: 'Vue Search Panel',
      menus: [{
        key: 'github',
        name: 'GitHub',
      }]
    }
  },
  methods: {
    onClick (item) {
      if (item.key === 'github') {
        window.open('https://github.com/TheoXiong/vue-search-panel', '_blank')
      }
    }
  }
}
</script>

<style scoped>
.nav-menu{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 70px;
  transition: all 0.4s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-drag: none;
  background-color: #333333;
  box-sizing: border-box;
  padding: 0 20px;
} 

.nav-menu-wrap{
  height: 100%;
  width: 1280px;
}

.nav-logo-img{
  width: 26px;
  height: 26px;
}
.nav-logo-text{
  margin-left: 14px;
  font-size: 20px;
  color: #fff;
  font-weight: 600;
}
.nav-content-item{
  margin: 0 12px;
  font-size: 14px;
  letter-spacing: 1px;
  color: #fff;
  cursor: pointer;
}
.nav-content-item:hover{
  color: #e0d5d5;
}
</style>