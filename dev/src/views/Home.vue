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
    <div class="home-search">
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
          <div class="close-wrap">
            <div class="close-inner flex-c-c" v-show="item.key === hoveredItem" @click="deleteItem($event, item)">
              <i class="iconfont iconclose"></i>
            </div>
          </div>
        </div>
      </vue-search-panel>
    </div>
  </div>
</template>

<script>
import { parseTime, removeFromArray, isInArray } from '@/utils/util.js'
const cryptoRandomString = require('crypto-random-string')

export default {
  name: 'Home',
  data () {
    return {
      value: '',
      devData: [],
      queryList: [],
      selected: { value: '' },
      hoveredItem: ''
    }
  },
  watch: {
    queryList (q) {
      this.checkHovered()
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      for (let i = 0; i < 24; i++) {
        let value = cryptoRandomString({ length: 32 })
        this.devData.push({
          value: value,
          time: parseTime(new Date(new Date().getTime() - Math.random() * 10000000)),
          key: `${i}-${value}`
        })
      }
    },
    show () {
      this.$refs.searchPanel.show()
    },
    onMouseenter (item) {
      this.$nextTick(() => {
        this.hoveredItem = item.key
      })
    },
    onMouseleave (item) {
      if (this.hoveredItem === item.key) {
        this.hoveredItem = ''
      }
    },
    onClosed () {
      this.$refs.home.focus()
      this.hoveredItem = ''
    },
    onSelect (item) {
      console.log('onSelect: ', item)
      this.selected = item
    },
    querySearch (query, cb) {
      if (query) {
        this.queryList = this.devData.filter(item => {
          return item.value.toLowerCase().includes(query.toLowerCase())
        })
      } else {
        this.queryList = this.devData
      }
      cb(this.queryList)
    },
    deleteItem (event, item) {
      event.stopPropagation()
      removeFromArray(this.queryList, 'key', item)
      removeFromArray(this.devData, 'key', item)
      this.$refs.searchPanel.focusInput()
    },
    checkHovered () {
      if (this.hoveredItem && !isInArray(this.queryList, 'key', { key: this.hoveredItem })) {
        this.hoveredItem = ''
      }
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

.home-search{
  margin: 20px;
  width: 600px;
}

.home-search-item{
  margin: 0;
  height: 32px;
  padding: 0 12px;
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
  height: 100%;
  width: 18px;
}
.close-inner{
  height: 100%;
  width: 100%;
}
</style>
