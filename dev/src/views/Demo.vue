<template>
  <div class="flex-c demo">
    <div class="title"><span>Live Demo</span></div>
    <div class="container">
      <div class="demo-search">
        <vue-search-panel
          v-model="value"
          width="640px"
          height="400px"
          placement="top"
          top="180px"
          :placeholder="placeholder"
          :selectWhenUnmatched="true"
          :closeOnSelect="closeOnSelect"
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
          <div slot-scope="{ item }">
            <div v-if="currPanel === 'help'">
              <div class="panel-item-help flex-c-b">
                <div class="help-item-wrap flex-c">
                  <span class="help-value">{{ item.value }}</span>
                  <span class="help-tip">{{ item.tip }}</span>
                </div>
                <span class="panel-shortcut">{{ item.shortcut }}</span>
              </div>
            </div>
            <div v-else-if="currPanel === 'unmatch'">
              <div class="panel-item-unmatch flex-c">
                <span class="unmatch-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
          <div slot="upon-item">
            <div class="panel-upon-item flex-c" v-if="!!isShowUponItem">
              <span>{{ uponItemText }}</span>
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
import { parseTime } from '@/utils/util.js'
import { panelSignMap, helpList, commandList } from '@/utils/config.js'
import { takeFromCache, SEARCH_PATH, RECENTLY_PATH } from '@/utils/cache.js'
import vuescroll from 'vuescroll'
const cryptoRandomString = require('crypto-random-string')

export default {
  name: 'Demo',
  data () {
    return {
      value: '',
      currPanel: '',
      closeOnSelect: true,
      isShowUponItem: false,
      uponItemText: '',
      placeholder: '',
      devData: [],
      selected: { value: '' },
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
    currPanel (p) {
      if (p === 'help') {
        this.placeholder = 'Take one action from below'
        this.closeOnSelect = false
      } else {
        this.placeholder = ''
        this.closeOnSelect = true
      }
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
      if (!(this.$refs && this.$refs.searchPanel)) return
      this.value = panelSignMap[info.action] || ''
      this.adjustTheme(info.theme)
      this.$nextTick(() => {
        this.$refs.searchPanel.show()
        this.updateEvent(`[ open ] Has opened, theme is ${info.theme}`)
      })
    },
    showUponItem (text) {
      this.uponItemText = text || ''
      this.isShowUponItem = true
    },
    closeUponItem () {
      this.uponItemText = ''
      this.isShowUponItem = false
    },
    querySearch (inputData, cb) {
      this.closeUponItem()
      let result = []
      if (inputData) {
        if (inputData.charAt(0) === panelSignMap.search) {
          result = this.getSearchData(inputData)
          this.currPanel = 'search'
        } else if (inputData.charAt(0) === panelSignMap.recently) {
          result = this.getRecentlyData(inputData)
          this.currPanel = 'recently'
        } else if (inputData.charAt(0) === panelSignMap.command) {
          result = this.getCommandData(inputData)
          this.currPanel = 'command'
        } else if (inputData.charAt(0) === panelSignMap.help) {
          result = helpList
          this.currPanel = 'help'
        } else {
          result = this.getNoMatchData()
          this.currPanel = 'unmatch'
        }
      } else {
        result = helpList
        this.currPanel = 'help'
      }
      cb(result)
    },
    getSearchData (inputData) {
      if (inputData.length === 1) {
        let caches = takeFromCache(SEARCH_PATH)
        if (caches && caches.length > 0) {
          this.showUponItem('Recently Searches')
        } else {
          this.showUponItem('Input your word to search')
        }
        return caches
      } else if (inputData.length > 1) {
        let query = inputData.slice(1).toLowerCase()
        return this.devData.filter(item => {
          return item.value.toLowerCase().includes(query)
        })
      } else {
        return []
      }
    },
    getRecentlyData (inputData) {
      if (inputData.length >= 1) {
        let caches = takeFromCache(RECENTLY_PATH)
        if (caches && caches.length > 0) {
          this.showUponItem('Recently Actions')
          if (inputData.length === 1) {
            return caches
          } else {
            let query = inputData.slice(1).toLowerCase()
            return caches.filter(item => {
              return item.value.toLowerCase().includes(query)
            })
          }
        } else {
          this.showUponItem('No recently actions')
          return []
        }
      } else {
        return []
      }
    },
    getCommandData (inputData) {
      if (inputData.length === 1) {
        return commandList
      } else if (inputData.length > 1) {
        let query = inputData.slice(1).toLowerCase()
        return commandList.filter(item => {
          return item.value.toLocaleLowerCase().includes(query)
        })
      } else {
        return []
      }
    },
    getNoMatchData () {
      return [{ key: 'noMatch', value: 'No results matching' }]
    },
    onSelect (item) {
      this.updateEvent(`[ select ] Has selected, value is ${item.value}`)
      this.selected = item
    },
    onOpened () {
    },
    onClosed () {
      this.updateEvent('[ close ] Has closed.')
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
  height: 260px;
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

.panel-item-help,
.help-item-wrap,
.panel-item-unmatch{
  height: 28px;
  padding: 0 16px;
  font-size: 14px;
  box-sizing: border-box;
}

.help-item-wrap{
  padding: 0;
}
.help-value{
  color: #a810d6;
  font-size: 14px;
  font-weight: 600;
  width: 20px;
  margin-right: 8px;
}
.help-tip{
  font-size: 12px;
  color: #909399;
}
.unmatch-value{
  color: #909399;
}
.panel-shortcut{
  font-size: 11px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 4px;
  border-radius: 4px;
  background-color: #dadada;
  color: #303133;
}
.panel-upon-item{
  height: 20px;
  padding: 0 16px;
  font-size: 13px;
  box-sizing: border-box;
  font-weight: 400;
  background-color: rgba(255, 187, 120, 0.4);
  color: #909399;
  font-family: Arial, Helvetica, sans-serif;
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
