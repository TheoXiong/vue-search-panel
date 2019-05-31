<template>
  <div class="banner">
    <div class="banner-main">
      <h1 class="banner-title">{{ title }}</h1>
      <h2 class="banner-desc">{{ desc }}</h2>
      <div class="banner-btns flex-c-c">
        <div class="btn-github flex-c-b" @click="toGithub">
          <span class="btn-icon"><i class="iconfont icongithub-fill"></i></span>
          <span>GitHub</span>
        </div>
      </div>
    </div>
    <div class="flex-c-c banner-quickstart">
      <span>/** Quick Start With NPM **/</span>
      <span>npm install vue-image-text --save</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  data() {
    return {
      title: 'Vue Image Text',
      desc: 'A vue component of adding text to image'
    }
  },
  methods: {
    toGithub () {
      window.open('https://github.com/TheoXiong/vue-image-text', '_blank')
    }
  }
}
</script>

<style scoped>
.banner{
  position: relative;
  top: 0;
  height: 500px;
  width: 100%;
  min-width: 1400px;
  line-height: 1.5;
  background-color: #44D1D1;
}
.banner-main{
  padding-top: 175px;
  color: #fff;
  text-align: center;
}
.banner-title{
  font-size: 64px;
  width: 600px;
  margin: 0 auto;
  text-align: center;
}
.banner-desc{
  font-size: 22px;
  font-weight: 300;
  line-height: 0.7;
}
.banner-btns{
  margin-top: 32px;
  font-size: 16px;
}
.btn-github{
  display: inline-block;
  padding: 8px 20px;
  background-color: #409EFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}
.btn-github:hover{
  background-color: rgb(35, 143, 250);
}
.btn-icon{
  margin-right: 5px;
}

.banner-quickstart{
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 360px;
  height: 80px;
  border: none;
  background-color: rgb(16, 187, 187);
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  flex-direction: column;
  font-family: monospace;
  color: #606266;
}
</style>