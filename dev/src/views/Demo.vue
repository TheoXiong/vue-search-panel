<template>
  <div class="flex-c demo">
    <div class="title"><span>Live Demo</span></div>
    <div class="container">
      <div class="demo-search">
        <vue-search-panel
          v-model="value"
          placeholder="Input your word"
          width="640px"
          height="400px"
          placement="top"
          top="180px"
          :scrollBarColor="scrollBarColor"
          :inputColor="inputColor"
          :inputBackground="inputBackground"
          :inputBorderColor="inputBorderColor"
          :inputBorderColorHovering="inputBorderColorHovering"
          :inputBorderColorFocused="inputBorderColorFocused"
          :placeholderEffect="placeholderEffect"
          :panelBackground="panelBackground"
          :highlightedColor="highlightedColor"
          :hoveredColor="hoveredColor"
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
            <div class="demo-search-item-value" :style="{ color: itemValueColor }">
              {{ item.value }}
            </div>
            <div class="demo-search-item-time flex-c-e" :style="{ color: itemTimeColor }">
              {{ item.time }}
            </div>
            <div class="close-wrap">
              <div class="close-inner flex-c-c" v-show="item.key === hoveredItem" @click="deleteItem($event, item)">
                <i class="iconfont iconclose" :style="{ color: iconcloseColor }"></i>
              </div>
            </div>
          </div>
        </vue-search-panel>
      </div>
      <div class="demo-tip">
        <span class="demo-tip-text">
          Press <span class="demo-key">Shift+L</span> to open search panel with <span style="color:#eee;font-size:20px;">{{ tip1 }}</span>
        </span>
        <span class="demo-tip-text">
          Press <span class="demo-key">Shift+D</span> to open search panel with <span style="color:#111;font-size:20px;">{{ tip2 }}</span>
        </span>
        <span class="demo-tip-text">
          Press <span class="demo-key">Shift+C</span> to open command panel
        </span>
        <span class="demo-tip-text">
          Press <span class="demo-key">Shift+R</span> to open recently panel
        </span>
        <span class="demo-tip-text">
          Press <span class="demo-key">ESC</span> or Click outside to close
        </span>
      </div>
      <div class="demo-divider" v-if="eventList && eventList.length > 0">
        <el-divider>Event Logs</el-divider>
      </div>
      <transition name="toggle-result">
        <div class="demo-result" v-if="eventList && eventList.length > 0">
          <vuescroll :ops="opts" ref="vuescroll">
            <div v-for="(item, index) in eventList" :key="index" class="demo-result-item">
              <span class="demo-result-time">{{ item.time }}:</span>
              <span class="demo-result-data">{{ item.data }}</span>
            </div>
          </vuescroll>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { parseTime, removeFromArray, isInArray } from '@/utils/util.js'
import vuescroll from 'vuescroll'
const cryptoRandomString = require('crypto-random-string')

const commandList = [
  { key: 'command1', value: 'Command 1' },
  { key: 'command2', value: 'Command 2' },
  { key: 'command3', value: 'Command 3' }
]

const recentlyList = [
  { key: 'recently1', value: 'Recently 1' },
  { key: 'recently2', value: 'Recently 2' },
  { key: 'recently3', value: 'Recently 3' }
]

export default {
  name: 'Demo',
  data () {
    return {
      value: '',
      devData: [],
      queryList: [],
      selected: { value: '' },
      hoveredItem: '',
      eventList: [],
      tip1: 'light color',
      tip2: 'dark color',
      opts: {
        bar: { background: '#DFDFDF', opacity: 0.8 }
      },
      scrollBarColor: '',
      inputColor: '',
      inputBackground: '',
      inputBorderColor: '',
      inputBorderColorHovering: '',
      inputBorderColorFocused: '',
      placeholderEffect: '',
      panelBackground: '',
      highlightedColor: '',
      hoveredColor: '',
      iconcloseColor: '',
      itemValueColor: '',
      itemTimeColor: ''
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
    adjustTheme (theme) {
      if (theme === 'light') {
        this.scrollBarColor = '#DFDFDF'
        this.inputColor = '#606266'
        this.inputBackground = '#FFFFFF'
        this.inputBorderColor = '#DCDFE6'
        this.inputBorderColorHovering = '#B0B3BB'
        this.inputBorderColorFocused = '#575F96'
        this.placeholderEffect = 'light'
        this.panelBackground = '#FFFFFF'
        this.highlightedColor = '#F5F7FA'
        this.hoveredColor = '#C5C7CA'

        this.iconcloseColor = '#606266'
        this.itemValueColor = '#606266'
        this.itemTimeColor = '#909399'
      } else if (theme === 'dark') {
        this.scrollBarColor = '#909399'
        this.inputColor = '#CCCCCC'
        this.inputBackground = '#555555'
        this.inputBorderColor = '#666666'
        this.inputBorderColorHovering = '#999999'
        this.inputBorderColorFocused = '#BBBBBB'
        this.placeholderEffect = 'dark'
        this.panelBackground = '#333333'
        this.highlightedColor = '#444444'
        this.hoveredColor = '#666666'

        this.iconcloseColor = '#CCCCCC'
        this.itemValueColor = '#909399'
        this.itemTimeColor = '#606266'
      }
    },
    show (info) {
      if (info.panel === 'command') {
        this.value = '>'
      } else if (info.panel === 'recently') {
        this.value = '#'
      }
      this.adjustTheme(info.theme)
      this.$nextTick(() => {
        this.$refs.searchPanel.show()
        this.updateEvent(`[ open ] Has opened, theme is ${info.theme}`)
      })
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
    },
    onClosed () {
      this.hoveredItem = ''
      this.updateEvent('[ close ] Has closed.')
    },
    onSelect (item) {
      this.updateEvent(`[ select ] Has selected, value is ${item.value}`)
      this.selected = item
    },
    querySearch (query, cb) {
      if (query) {
        if (query.charAt(0) === '>') {
          if (query.length === 1) {
            this.queryList = commandList
          } else if (query.length > 1) {
            this.queryList = commandList.filter(item => {
              return item.value.toLowerCase().includes(query.slice(1).toLowerCase())
            })
          }
        } else if (query.charAt(0) === '#') {
          if (query.length === 1) {
            this.queryList = recentlyList
          } else if (query.length > 1) {
            this.queryList = recentlyList.filter(item => {
              return item.value.toLowerCase().includes(query.slice(1).toLowerCase())
            })
          }
        } else {
          this.queryList = this.devData.filter(item => {
            return item.value.toLowerCase().includes(query.toLowerCase())
          })
        }
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
    },
    updateEvent (info) {
      if (this.eventList.length > 300) {
        this.eventList.splice(0, this.eventList.length)
      }
      this.eventList.unshift({
        data: info,
        time: parseTime(new Date().getTime())
      })
    }
  },
  components: { vuescroll }
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
  margin: 90px 0 40px;
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

.demo-tip,
.demo-divider,
.demo-result{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  box-sizing: border-box;
}
.demo-tip{
  top: 2px;
  width: 640px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 18px;
  font-family: monospace, Arial;
  font-weight: 600;
  color: rgba(48, 49, 51, 0.7);
  letter-spacing: 1px;
  background-color: #d5d5d5;
  border: 1px solid #cacaca;
  border-radius: 4px;
}
.demo-key{
  color: rgb(8, 202, 144);
}
.demo-tip-text{
  padding: 5px 40px;
}

.demo-divider{
  top: 210px;
  height: 48px;
  width: 640px;
}

.demo-result{
  top: 250px;
  height: 300px;
  width: 640px;
}
.demo-result-item{
  margin: 6px 10px;
  font-size: 12px;
  color: #606266;
}
.demo-result-time{
  margin-right: 6px;
  color: rgb(8, 202, 144);
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
  font-size: 14px;
  flex: 0 0 340px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 8px;
}
.demo-search-item-time{
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
}

.close-wrap{
  height: 100%;
  width: 18px;
}
.close-inner{
  height: 100%;
  width: 100%;
}

.toggle-result-enter-active,
.toggle-result-leave-active {
  transition: all 0.6s ease-in-out;
  -webkit-transition: all 0.6s ease-in-out;
  -moz-transition: all 0.6s ease-in-out;
  -o-transition: all 0.6s ease-in-out;
  opacity: 1;
}
.toggle-result-enter,
.toggle-result-leave-to{
  opacity: 0;
  transform: translate(-50%, 100%);
  -webkit-transform: translate(-50%, 100%);
  -moz-transform: translate(-50%, 100%);
  -ms-transform: translate(-50%, 100%);
  -o-transform: translate(-50%, 100%);
}
</style>
