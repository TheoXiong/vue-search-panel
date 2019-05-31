<template>
  <div class="nav-menu flex-c-c" :class="{'is-not-overbanner': !overBanner}">
    <div class="nav-menu-wrap flex-c-b">
      <div class="nav-log flex-c">
        <img :src="logoImg" class="nav-logo-img">
        <span class="nav-logo-text">{{ logoText }}</span>
      </div>
      <div class="nav-content flex-c">
        <div class="nav-content-item"
          v-for="item in value"
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
      logoText: 'Vue Image Text'
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    overBanner: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClick (item) {
      this.$emit('click', item)
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
}
.is-not-overbanner{
  background-color: rgba(68, 209, 209, 0.75);
} 

.nav-menu-wrap{
  height: 100%;
  width: 1320px;
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
  color: #fff;
  cursor: pointer;
}
.nav-content-item:hover{
  color: #e0d5d5;
}
</style>