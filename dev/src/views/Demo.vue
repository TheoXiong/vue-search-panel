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
            <div v-else-if="currPanel === 'search'">
              <div class="panel-item-search flex-c">
                <span><i class="iconfont icontags"></i></span>
                <div class="search-value">{{ item.value }}</div>
                <div class="search-time flex-c-e">{{ item.time }}</div>
              </div>
            </div>
            <div v-else-if="currPanel === 'recently'">
              <div class="panel-item-recently flex-c">
                <div class="recently-action">{{ item.action }}</div>
                <div class="recently-value">{{ item.value }}</div>
                <div class="recently-time flex-c-e">{{ item.time }}</div>
              </div>
            </div>
            <div v-else-if="currPanel === 'command'">
              <div class="panel-item-command flex-c">
                <span class="command-value">{{ item.value }}</span>
              </div>
            </div>
            <div v-else-if="currPanel === 'favorite'">
              <div class="panel-item-favorite flex-c">
                <span><i class="iconfont iconlink"></i></span>
                <span class="favorite-alter">{{ item.alter }}</span>
                <span class="favorite-value flex-c-e">{{ item.value }}</span>
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
          Press <span class="demo-key">Shift+P</span> to open the help panel
        </span>
        <span class="demo-tip-text">
          Press <span class="demo-key">Shift+S</span> to open the search panel
        </span>
        <span class="demo-tip-text">
          Press <span class="demo-key">Shift+R</span> to open the recently panel
        </span>
        <span class="demo-tip-text">
          Press <span class="demo-key">Shift+C</span> to open the command panel
        </span>
        <span class="demo-tip-text">
          Press <span class="demo-key">Shift+F</span> to open the favorite panel
        </span>
        <span class="demo-tip-text">
          Press <span class="demo-key">Shift+D</span> to open the panel with <span style="color:#111;font-size:20px;">{{ tip2 }}</span>
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
import { parseTime, truncateText } from '@/utils/util.js'
import { panelSignMap, helpList, commandList, favoriteList } from '@/utils/config.js'
import { takeFromCache, saveToCache, SEARCH_PATH, RECENTLY_PATH } from '@/utils/cache.js'
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
        this.saveActionToCache('Open', `the ${info.action} panel`)
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
        } else if (inputData.charAt(0) === panelSignMap.favorite) {
          result = this.getFavoriteData(inputData)
          this.currPanel = 'favorite'
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
          this.showUponItem('Recently Events')
          if (inputData.length === 1) {
            return caches
          } else {
            let query = inputData.slice(1).toLowerCase()
            return caches.filter(item => {
              return item.value.toLowerCase().includes(query)
            })
          }
        } else {
          this.showUponItem('No recently events')
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
    getFavoriteData (inputData) {
      if (inputData.length === 1) {
        return favoriteList
      } else if (inputData.length > 1) {
        let query = inputData.slice(1).toLowerCase()
        return favoriteList.filter(item => {
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
      if (this.currPanel === 'search') {
        this.handleSearch(item)
      } else if (this.currPanel === 'recently') {
        this.handleRecently(item)
      } else if (this.currPanel === 'command') {
        this.handleCommand(item)
      } else if (this.currPanel === 'favorite') {
        this.handleFavorite(item)
      }
    },
    onOpened () {
    },
    onClosed () {
      this.updateEvent('[ close ] Has closed.')
      this.saveActionToCache('Close', 'the panel')
    },
    handleSearch (item) {
      if (item && item.key && item.value) {
        saveToCache(SEARCH_PATH, item)
      }
      this.updateEvent(`[ search ] Has selected, value is ${item.value}`)
      let tmpVal = truncateText(item.value, 9)
      this.saveActionToCache('Select', `the searching value (${tmpVal})`)
    },
    handleRecently (item) {
      this.updateEvent(`[ recently ] Has selected, value is ${item.value}`)
      this.saveActionToCache('Select', 'the recently value')
    },
    handleCommand (item) {
      if (!(item && item.key)) return
      if (item.key === 'reload-window') {
        window.location.reload()
      } else if (item.key === 'go-new') {
        window.open(window.location.href)
      } else if (item.key === 'alert-info') {
        window.alert('some info')
      }
      this.updateEvent(`[ command ] Has selected, value is ${item.value}`)
      this.saveActionToCache('Select', `the command (${item.value})`)
    },
    handleFavorite (item) {
      if (item && item.value) {
        window.open(item.value)
        this.updateEvent(`[ favorite ] Has selected, value is ${item.value}`)
        this.saveActionToCache('Select', `the favorite (${item.value})`)
      } else {
        console.error('[ handleFavorite ] invalid value', item)
      }
    },
    saveActionToCache (action, value) {
      let d = new Date()
      saveToCache(RECENTLY_PATH, {
        key: d.getTime(),
        action: action,
        value: value,
        time: parseTime(d)
      })
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
  margin: 90px 0 30px;
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
  height: 240px;
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
  top: 240px;
  height: 48px;
  width: 640px;
}

.demo-result{
  top: 280px;
  height: 230px;
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

.panel-item-help,
.help-item-wrap,
.panel-item-unmatch,
.panel-item-search,
.panel-item-recently,
.panel-item-command,
.panel-item-favorite{
  height: 30px;
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
.unmatch-value, .command-value{
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

.search-value, .recently-value{
  font-size: 14px;
  flex: 0 0 340px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 8px;
  color: #606266;
}
.recently-value{
  margin-left: 0px;
}
.search-time, .recently-time{
  font-size: 12px;
  margin: 0 8px 0 16px;
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #909399;
}
.panel-item-search .icontags,
.panel-item-favorite .iconlink{
  font-size: 16px;
  color: purple;
}
.recently-action{
  color: purple;
  width: 50px;
  margin-right: 10px;
}
.favorite-alter{
  font-size: 14px;
  flex: 0 0 200px;
  color: #606266;
  margin-left: 8px;
}
.favorite-value{
  font-size: 12px;
  margin: 0 8px 0 16px;
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #909399;
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
