# vue-search-panel

[vue-search-panel](https://github.com/TheoXiong/vue-search-panel) 是一个带输入建议的搜索组件

## 目录
- [特性](#特性)
- [演示](#演示)
   - [线上demo](#线上demo)
   - [默认UI](#默认UI)
   - [定制化UI](#定制化UI)
- [安装](#安装)
- [使用](#使用)
   - [引入模块](#引入模块)
   - [注册](#注册)
   - [基础用法](#基础用法)
   - [自定义建议项](#自定义建议项)
   - [自定义UI](#自定义UI)
   - [配置panel位置](#配置panel位置)
   - [扩展功能](#扩展功能)
- [API](#API)
   - [属性](#属性)
   - [方法](#方法)
   - [事件](#事件)
   - [插槽](#插槽)
- [参考](#参考)

## 特性
- 可根据输入内容过滤建议项，可自定义过滤规则
- 可通过slot自定义建议项内容
- 支持自定义UI, 可灵活配置样式
- 可配置panel呈现位置，（相对浏览器）top/bottom/left/right 或位于父级元素内部
- 可扩展功能

## 演示

### 线上demo
链接： [https://theoxiong.github.io/vue-search-panel/](https://theoxiong.github.io/vue-search-panel/) 

### 默认UI
![DefaultUI](./defaultUI.png)

### 自定义UI
![CustomizeUI](./customizeUI.png)

## 安装
``` 
$   npm install vue-search-panel --save
```

## 使用

### 引入模块
```
import VueSearchPanel from 'vue-search-panel'
```

### 注册
#### 全局注册
```
Vue.use(VueSearchPanel)
```
#### 组件内注册
```
<script>
export default {
  components: { VueSearchPanel }
}
</script>
```

### 基础用法
通过调用组件的show方法打开search panel，点击panel外部或按ESC键关闭      
        
示例代码：
```
<template>
  <div class="demo-comp">
    <button @click="onOpen">Open Panel</button>
    <div>Selected: {{ selected }}</div>
    <vue-search-panel
      v-model="value"
      :fetch-suggestions="getSuggestions"
      @select="onSelect"
      ref="searchPanel"
    >
    </vue-search-panel>
  </div>
</template>

<script>
import VueSearchPanel from 'vue-search-panel'
const testData = [
  { key: 'test-data-1', value: 'test data 1' },
  { key: 'test-data-2', value: 'test data 2' },
  { key: 'test-data-3', value: 'test data 3' }
]

export default {
  name: 'DemoComp',
  data () {
    return {
      value: '',
      selected: ''
    }
  },
  methods: {
    onOpen () {
      this.$refs.searchPanel.show()
    },
    onSelect (item) {
      this.selected = item.value
    },
    getSuggestions (query, cb) {
      cb(query ? testData.filter(item => { return item.value.includes(query) }) : testData)
    }
  },
  components: { VueSearchPanel }
}
</script>
```

### 自定义建议项
使用scoped slot自定义输入建议的内容，item为当前建议项数据对象          
        
示例代码：
```
<template>
  <div class="demo-comp">
    <button @click="onOpen">Open Panel</button>
    <div>Selected: {{ selected }}</div>
    <vue-search-panel
      v-model="value"
      :fetch-suggestions="getSuggestions"
      @select="onSelect"
      ref="searchPanel"
    >
      <div class="demo-search-item" slot-scope="{ item }">
        <span class="search-item-value">{{ item.value }}</span>
        <span class="search-item-time">{{ item.time }}</span>
      </div>
    </vue-search-panel>
  </div>
</template>

<script>
import VueSearchPanel from 'vue-search-panel'

export default {
  name: 'DemoComp',
  data () {
    return {
      value: '',
      selected: '',
      testData: []
    }
  },
  mounted () {
    for (let i = 0; i < 20; i++) {
      this.testData.push({
        key: `data-${i}`,
        value: `Test data ${i + 1}`,
        time: new Date(Math.random() * 1000000000000).toLocaleDateString()
      })
    }
  },
  methods: {
    onOpen () {
      this.$refs.searchPanel.show()
    },
    onSelect (item) {
      this.selected = item.value
    },
    getSuggestions (query, cb) {
      cb(query ? this.testData.filter(item => { return item.value.includes(query) }) : this.testData)
    }
  },
  components: { VueSearchPanel }
}
</script>

<style scoped>
.demo-search-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 20px;
}
.search-item-value{
  font-size: 14px;
  color: #555;
}
.search-item-time{
  font-size: 12px;
  color: #aaa;
  width: 80px;
}

</style>
```

### 自定义UI
通过props参数自定义UI，可配置颜色、宽度、高度，参数说明可查看API文档         
        
示例代码：
```
<template>
  <div class="demo-comp">
    <button @click="onOpen">Open Panel</button>
    <div>Selected: {{ selected }}</div>
    <vue-search-panel
      v-model="value"
      width="640px"
      height="400px"
      scrollBarColor="#aaaaaa"
      inputColor="#cccccc"
      inputBackground="#555555"
      inputBorderColor="#666666"
      inputBorderColorHovering="#999999"
      inputBorderColorFocused="#bbbbbb"
      placeholderEffect="dark"
      panelBackground="#333333"
      panelBoxShadow="rgba(0, 0, 0, 0.6)"
      highlightedColor="#444444"
      hoveredColor="#666666"
      :fetch-suggestions="getSuggestions"
      @select="onSelect"
      ref="searchPanel"
    >
      <div class="demo-search-item" slot-scope="{ item }">
        <span class="search-item-value">{{ item.value }}</span>
        <span class="search-item-time">{{ item.time }}</span>
      </div>
    </vue-search-panel>
  </div>
</template>

<script>
import VueSearchPanel from 'vue-search-panel'

export default {
  name: 'DemoComp',
  data () {
    return {
      value: '',
      selected: '',
      testData: []
    }
  },
  mounted () {
    for (let i = 0; i < 20; i++) {
      this.testData.push({
        key: `data-${i}`,
        value: `Test data ${i + 1}`,
        time: new Date(Math.random() * 1000000000000).toLocaleDateString()
      })
    }
  },
  methods: {
    onOpen () {
      this.$refs.searchPanel.show()
    },
    onSelect (item) {
      this.selected = item.value
    },
    getSuggestions (query, cb) {
      cb(query ? this.testData.filter(item => { return item.value.includes(query) }) : this.testData)
    }
  },
  components: { VueSearchPanel }
}
</script>

<style scoped>
.demo-search-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 20px;
}
.search-item-value{
  font-size: 14px;
  color: #999;
}
.search-item-time{
  font-size: 12px;
  color: #777;
  width: 80px;
}

</style>
```

### 配置panel位置
通过fixed参数使panel相对于浏览器窗口或父级元素定位
通过placement参数配置panel位于 top/bottom/left/right(相对于浏览器窗口)
> 当fixed为false时，placement参数无效       
         
示例代码：         
```
<template>
  <div class="demo-comp">
    <button @click="onOpen('top')" :disabled="disabled" :class="{'is-disabled': disabled}">Open at top</button>
    <button @click="onOpen('bottom')" :disabled="disabled" :class="{'is-disabled': disabled}">Open at bottom</button>
    <button @click="onOpen('left')" :disabled="disabled" :class="{'is-disabled': disabled}">Open at left</button>
    <button @click="onOpen('right')" :disabled="disabled" :class="{'is-disabled': disabled}">Open at right</button>
    <button @click="onOpen('inner')" :disabled="disabled" :class="{'is-disabled': disabled}">Open at inner</button>
    <div>Selected: {{ selected }}</div>
    <vue-search-panel
      v-model="value"
      :placement="placement"
      :fixed="fixed"
      :fetch-suggestions="getSuggestions"
      @open="onPanelOpen"
      @closed="onPanelClosed"
      @select="onSelect"
      ref="searchPanel"
    >
    </vue-search-panel>
  </div>
</template>

<script>
import VueSearchPanel from 'vue-search-panel'
const testData = [
  { key: 'test-data-1', value: 'test data 1' },
  { key: 'test-data-2', value: 'test data 2' },
  { key: 'test-data-3', value: 'test data 3' }
]

export default {
  name: 'DemoComp',
  data () {
    return {
      value: '',
      selected: '',
      placement: 'top',
      fixed: true,
      disabled: false
    }
  },
  methods: {
    onOpen (position) {
      if (position === 'inner') {
        this.fixed = false
      } else {
        this.fixed = true
        this.placement = position
      }
      this.$refs.searchPanel.show()
    },
    onPanelOpen () {
      this.disabled = true
    },
    onPanelClosed () {
      this.disabled = false
    },
    onSelect (item) {
      this.selected = item.value
    },
    getSuggestions (query, cb) {
      cb(query ? testData.filter(item => { return item.value.includes(query) }) : testData)
    }
  },
  components: { VueSearchPanel }
}
</script>

<style scoped>
.demo-comp{
  margin: 20px;
  width: 600px;
}
.is-disabled,
.is-disabled:active,
.is-disabled:focus,
.is-disabled:hover{
  cursor:not-allowed;
  background-color:#e4e4ee;
}
</style>
```

### 扩展功能

可扩展为 搜索面板/历史纪录面板/命令面板/收藏面板 等       
这是一个简单的示例：[https://theoxiong.github.io/vue-search-panel/](https://theoxiong.github.io/vue-search-panel/)        
               
组件内也提供了调试代码，运行方式：
```
npm install
npm run dev
```

## API

### 属性

参数 | 说明 | 类型 | 可选值 | 默认值
-|-|-|-|-|
value / v-model      | 输入绑定值         | String | — | —
placeholder          | 输入框占位文本      | String | — | —
width                | panel的宽度        | String | — | 50%
height               | panel的高度        | String | — | 300px
top                  | panel相对顶部偏移量 | String | — | 0px
bottom               | panel相对底部偏移量 | String | — | 0px
left                 | panel相对左边偏移量 | String | — | 0px
right                | panel相对右边偏移量 | String | — | 0px
fixed                | 是否相对浏览器定位  | Boolean | — | true
placement            | panel弹出位置（fixed为false时无效）| String | top/bottom/left/right | top
fetchSuggestions     | 返回输入建议的方法，通过调用 cb(data:[]) 来返回它 | Function(queryString, cb) | — | —
closeOnPressEscape   | 按下ESC键时是否关闭panel  | Boolean | — | true
closeOnSelect        | 选择后是否关闭panel  | Boolean | — | true
clearOnClose         | 关闭后是否清空input  | Boolean | — | true
selectWhenUnmatched  | 无匹配建议时，按Enter是否触发select | Boolean | — | false
triggerOnFocus       | 是否在输入框focus时显示建议列表 | Boolean | — | true
highlightFirstItem   | 是否默认突出显示建议中的第一项 | Boolean | — | true
valueColor           | 建议项文本颜色（无scoped slot时）| String | — | #606266
scrollBarColor       | 滚动条颜色 | String | — | #DFDFDF
scrollBarOpacity     | 滚动条透明度 | Number | — | 0.8
panelBackground      | panel背景颜色 | String | — | #FFFFFF
panelBorderRadius    | panel边框圆角 | String | — | 0px
panelBoxShadow       | panel阴影颜色 | String | — | rgba(0, 0, 0, 0.3)
highlightedColor     | 建议项突出显示时的背景颜色 | String | — | #F5F7FA
hoveredColor         | 建议项鼠标悬停时的背景颜色 | String | — | #C5C7CA
placeholderEffect    | 输入框占位文本颜色 | String | light/dark | light
inputColor           | 输入框文本颜色 | String | — | #606266
inputBackground      | 输入框背景颜色 | String | — | #FFFFFF
inputBorderColor      | 输入框边框颜色 | String | — | #DCDFE6
inputBorderColorHovering | 输入框鼠标悬停时的边框颜色 | String | — | #B0B3BB
inputBorderColorFocused  | 输入框focus时的边框颜色 | String | — | #575F96

### 方法

方法名 | 说明 | 参数
-|-|-|
show               |  打开panel | —
close              |  关闭panel | —
focusInput         |  使input获取焦点 | —
getInputElement    |  获取input元素 | —

### 事件

事件名 | 说明 | 回调参数
-|-|-|
open   | panel打开的回调 | —
opened | panel打开动画结束时的回调 | —
close  | panel关闭的回调 | —
closed | panel关闭动画结束时的回调 | —
focus  | input获取焦点时的回调 | —
blur   | input失去焦点时的回调 | —
select | 点击选中建议项时触发 | —

### 插槽

#### 作用域插槽

自定义输入建议，参数为 { item }     
参考：[自定义建议项](#自定义建议项)

#### 具名插槽

name | 说明 
-|-|
upon-item  |  建议项顶部内容


## 参考
- VS Code
- Element UI



