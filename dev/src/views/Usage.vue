<template>
  <div class="flex-c usage">
    <div class="title"><span>Usage</span></div>
    <div class="container"></div>
  </div>
</template>

<script>
export default {
  name: 'Usage'    
}
</script>

<style scoped>
.usage{
  flex-direction: column;
  background-color: #f9f9f9;;
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