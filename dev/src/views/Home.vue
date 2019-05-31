<template>
  <div id="home" ref="home">
    <button @click="onClick">Show</button>
    <vue-search-panel
      v-model="value"
      placeholder="Input your word"
      ref="searchPanel"
    >
    </vue-search-panel>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      value: ''
    }
  },
  mounted () {
  },
  methods: {
    onClick () {
      this.$refs.searchPanel.show()
    }
  }
}
</script>

<style scoped>
#home{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  overflow: auto;
}
</style>