<template>
  <div class="flex-c demo">
    <div class="title"><span>Live Demo</span></div>
    <div class="container">
      <!-- <button @click="show">Show</button>
      <div>value: {{ value }}</div>
      <div>selected: {{ selected.value }}</div> -->
      <div class="demo-search">
        <vue-search-panel
          v-model="value"
          placeholder="Input your word"
          width="560px"
          height="400px"
          placement="top"
          top="200px"
          :fetch-suggestions="querySearch"
          @opened="onOpened"
          @closed="onClosed"
          @select="onSelect"
          ref="searchPanel"
        >
          <div
            class="demo-search-item flex-c"
            slot-scope="{ item }"
            @mouseenter="onMouseenter(item)"
            @mouseleave="onMouseleave(item)"
          >
            <span><i class="iconfont icontags"></i></span>
            <div class="demo-search-item-value">{{ item.value }}</div>
            <div class="demo-search-item-time flex-c-e">{{ item.time }}</div>
            <div class="close-wrap">
              <div class="close-inner flex-c-c" v-show="item.key === hoveredItem" @click="deleteItem($event, item)">
                <i class="iconfont iconclose"></i>
              </div>
            </div>
          </div>
        </vue-search-panel>
      </div>
      <div class="demo-tip"><span>{{ tip }}</span></div>
      <transition name="left-left">
        <div class="demo-control" v-show="isShow"></div>
      </transition>
      <transition name="right-right">
        <div class="demo-result" v-show="isShow"></div>
      </transition>
    </div>
  </div>
</template>

<script>
import { parseTime, removeFromArray, isInArray } from '@/utils/util.js'
const cryptoRandomString = require('crypto-random-string')

export default {
  name: 'Demo',
  data () {
    return {
      value: '',
      devData: [],
      queryList: [],
      selected: { value: '' },
      hoveredItem: '',
      tip: 'Press Shift+D to open search panel',
      isShow: false
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
    onOpened () {
      this.isShow = true
    },
    onClosed () {
      this.hoveredItem = ''
      this.isShow = false
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
.demo{
  position: relative;
  flex-direction: column;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.title{
  margin: 100px 0 40px;
  padding: 10px 0;
  font-size: 24px;
  color: #303133;
  font-weight: 600;
  border-bottom: 2px solid #303133;
}
.container{
  position: relative;
  width: 600px;
  box-sizing: border-box;
  padding: 10px 0 40px;
}
.demo-tip{
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 460px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-family: monospace, Arial;
  font-weight: 600;
  color: rgba(48, 49, 51, 0.7);
  letter-spacing: 1px;
  background-color: #ebebeb;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
}
.demo-control{
  position: absolute;
  top: 0;
  left: -340px;
  height: 600px;
  width: 320px;
  border: 1px solid #e5e5e5;
  background-color: rgb(241, 247, 244);
}
.demo-result{
  position: absolute;
  top: 0;
  right: -340px;
  height: 600px;
  width: 320px;
  border: 1px solid #e5e5e5;
  background-color: rgb(240, 242, 243);
}



.demo-search{
  width: 100%;
}

.demo-search-item{
  margin: 0;
  height: 32px;
  padding: 0 12px;
}
.demo-search-item-value{
  color: #606266;
  font-size: 14px;
  flex: 0 0 340px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 8px;
}
.demo-search-item-time{
  color: #909399;
  font-size: 12px;
  margin: 0 8px 0 16px;
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.demo-search-item .icontags{
  font-size: 16px;
  color: purple;
}
.demo-search-item .iconclose{
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
