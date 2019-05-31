<template>
  <div class="flex-c feature">
    <div class="title"><span>Features</span></div>
    <div class="container"></div>
  </div>
</template>

<script>
export default {
  name: 'Feature'
}
</script>

<style scoped>
.feature{
  flex-direction: column;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
  padding: 10px;
  box-sizing: border-box;
}
.title{
  margin: 64px 0px;
  padding: 10px 0;
  font-size: 24px;
  color: #303133;
  font-weight: 600;
  border-bottom: 2px solid #303133;
}
.container{
  width: 1000px;
  min-height: 320px;
}
</style>