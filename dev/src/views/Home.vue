<template>
  <div 
    id="home" 
    ref="home"
    @keyup.space="show" 
    tabindex="0"
  >
    <button @click="show">Show</button>
    <div>value: {{ value }}</div>
    <div>selected: {{ selected.value }}</div>
    <vue-search-panel
      v-model="value"
      placeholder="Input your word"
      width="560px"
      height="400px"
      placement="top"
      top="10px"
      :fetch-suggestions="querySearch"
      @closed="onClosed"
      @select="onSelect"
      ref="searchPanel"
    >
      <div 
        class="home-search-item flex-c" 
        slot-scope="{ item }" 
        @mouseenter="onMouseenter(item)" 
        @mouseleave="onMouseleave(item)"
      >
        <span><i class="iconfont icontags"></i></span>
        <div class="home-search-item-value">{{ item.value }}</div>
        <div class="home-search-item-time flex-c-e">{{ item.time }}</div>
        <span class="close-wrap">
          <i v-show="item.isHover" class="iconfont iconclose" @click="deleteItem($event, item)"></i>
        </span>
      </div>
    </vue-search-panel>
  </div>
</template>

<script>
import { parseTime } from '@/utils/util.js'
const cryptoRandomString = require('crypto-random-string')

export default {
  name: 'Home',
  data() {
    return {
      value: '',
      selected: { value: '' },
      devData: []
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      for (let i = 0; i < 30; i++) {
        this.devData.push({
          value: cryptoRandomString({ length: 32 }),
          time: parseTime(new Date(new Date().getTime() - Math.random() * 10000000)),
          isHover: false
        })
      }
    },
    show () {
      this.$refs.searchPanel.show()
    },
    onMouseenter (item) {
      item.isHover = true
    },
    onMouseleave (item) {
      item.isHover = false
    },
    onClosed () {
      this.$refs.home.focus()
    },
    onSelect (item) {
      console.log('onSelect: ', item)
      this.selected = item
    },
    querySearch (query, cb) {
      if (query) {
        cb(this.devData.filter(item => {
          return item.value.toLowerCase().includes(query.toLowerCase())
        }))
      } else {
        cb(this.devData)
      }
    },
    deleteItem (event, item) {
      event.stopPropagation()
      let index = this.devData.findIndex(d => {
        return d.value === item.value
      })
      index >= 0 ? this.devData.splice(index, 1) : ''
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
  outline: none;
  overflow: auto;
}
#home:focus,
#home:hover{
  outline: none;
}

.home-search-item{
  margin: 0;
  padding: 8px 12px;
}
.home-search-item-value{
  color: #606266;
  font-size: 14px;
  flex: 0 0 340px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 8px;
}
.home-search-item-time{
  color: #909399;
  font-size: 12px;
  margin: 0 8px 0 16px;
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-search-item .icontags{
  font-size: 16px;
  color: purple;
}
.home-search-item .iconclose{
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}

.close-wrap{
  width: 14px;
}
</style>