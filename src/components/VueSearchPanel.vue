<template>
  <transition :name="transitionName" @after-enter="afterEnter" @after-leave="afterLeave">
    <div
      class="search-panel"
      :class="{
        'is-fixed': !!fixed,
        'is-in-top': fixed && (placement === 'top'),
        'is-in-bottom': fixed && (placement === 'bottom'),
        'is-in-left': fixed && (placement === 'left'),
        'is-in-right': fixed && (placement === 'right'),
      }"
      :style="style"
      v-show="isShow"
      @keyup.esc="onEsc"
      tabindex="0"
      ref="searchPanel"
    >
      <vue-input
        v-bind="$attrs"
        :value="value"
        :type="type"
        :placeholder="placeholder"
        :placeholderEffect="placeholderEffect"
        :inputColor="inputColor"
        :inputBackground="inputBackground"
        :inputBorderColor="inputBorderColor"
        :inputBorderColorHovering="inputBorderColorHovering"
        :inputBorderColorFocused="inputBorderColorFocused"
        @input="onChange"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
        @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
        @keydown.enter.native="onKeyEnter"
        ref="input"
      >
      </vue-input>
      <div
        class="vue-panel"
        :class="{ 'is-loading': loading }"
        @mouseleave="hoveredIndex = -1"
        ref="vuePanel"
      >
        <vuescroll :ops="scrollBarOpts" ref="vuescroll">
          <div
            class="vue-panel-item"
            v-for="(item, index) in suggestions"
            :key="item.key || index"
            :style="{
              backgroundColor: getBackgroundColor(index)
            }"
            @mouseenter="onMouseenter(index)"
            @mouseleave="onMouseleave(index)"
            @click="onSelect(item)"
          >
            <slot :item="item">
              <div
                class="vue-panel-item-value"
                :style="{
                  color: valueColor
                }"
              >
                {{ item[valueKey] }}
              </div>
            </slot>
          </div>
        </vuescroll>
      </div>
    </div>
  </transition>
</template>

<script>
import ClickOutside from '../utils/clickoutside.js'
import Debounce from '../utils/debounce.js'
import VueInput from './VueInput.vue'
import vuescroll from 'vuescroll'

export default {
  name: 'VueSearchPanel',
  data () {
    return {
      isShow: false,
      clickOutside: false,
      debouncedGetData: null,
      suggestions: [],
      highlightedIndex: -1,
      hoveredIndex: -1,
      loading: false,
      scrollBarOpts: { bar: {} }
    }
  },
  props: {
    fixed: { type: Boolean, default: true },
    valueKey: { type: String, default: 'value' },
    fetchSuggestions: Function,
    placement: {
      type: String,
      default: 'top',
      validator: value => ['top', 'bottom', 'left', 'right'].indexOf(value) > -1
    },
    width: { type: String, default: '' },
    height: { type: String, default: '' },
    top: { type: String, default: '0px' },
    bottom: { type: String, default: '0px' },
    left: { type: String, default: '0px' },
    right: { type: String, default: '0px' },
    closeOnPressEscape: { type: Boolean, default: true },
    closeOnSelect: { type: Boolean, default: true },
    clearOnClose: { type: Boolean, default: true },
    selectWhenUnmatched: { type: Boolean, default: false },
    triggerOnFocus: { type: Boolean, default: true },
    highlightFirstItem: { type: Boolean, default: true },
    valueColor: { type: String, default: '#606266' },
    scrollBarColor: { type: String, default: '#DFDFDF' },
    scrollBarOpacity: { type: Number, default: 0.8 },
    panelBackground: { type: String, default: '#FFFFFF' },
    panelBorderRadius: { type: String, default: '0px' },
    panelBoxShadow: { type: String, default: 'rgba(0, 0, 0, 0.3)' },
    highlightedColor: { type: String, default: '#F5F7FA' },
    hoveredColor: { type: String, default: '#C5C7CA' },
    value: [String, Number],
    type: { type: String, default: 'text' },
    placeholder: String,
    placeholderEffect: { type: String, default: 'light' },
    inputColor: { type: String, default: '#606266' },
    inputBackground: { type: String, default: '#FFFFFF' },
    inputBorderColor: { type: String, default: '#DCDFE6' },
    inputBorderColorHovering: { type: String, default: '#B0B3BB' },
    inputBorderColorFocused: { type: String, default: '#575F96' }
  },
  computed: {
    transitionName () {
      if (!this.fixed) return ''
      const names = ['top-top', 'bottom-bottom', 'left-left', 'right-right']
      return names[['top', 'bottom', 'left', 'right'].indexOf(this.placement)]
    },
    style () {
      let style = {}
      this.width ? style.width = this.width : ''
      this.height ? style.height = this.height : ''
      this.top ? style.marginTop = this.top : ''
      this.bottom ? style.marginBottom = this.bottom : ''
      this.left ? style.marginLeft = this.left : ''
      this.right ? style.marginRight = this.right : ''

      this.panelBackground ? style.backgroundColor = this.panelBackground : ''
      this.panelBorderRadius ? style.borderRadius = this.panelBorderRadius : ''
      this.panelBoxShadow ? style.boxShadow = `0px 1px 3px ${this.panelBoxShadow}` : ''
      return style
    }
  },
  watch: {
    scrollBarColor: {
      handler (value) {
        value ? this.scrollBarOpts.bar.background = value : ''
      },
      immediate: true
    },
    scrollBarOpacity: {
      handler (value) {
        value ? this.scrollBarOpts.bar.opacity = value : ''
      },
      immediate: true
    }
  },
  mounted () {
    let selfEle = this.$refs.searchPanel
    this.clickOutside = new ClickOutside([selfEle], document, this.close)
    this.clickOutside.bind()
    this.debouncedGetData = new Debounce(200)
    this.getData(this.value)
  },
  beforeDestroy () {
    (this.clickOutside && this.clickOutside.unbind) ? this.clickOutside.unbind() : ''
    this.debouncedGetData = null
    this.clearSuggestions()
  },
  methods: {
    show () {
      this.getData(this.value)
      this.$emit('open')
      this.isShow = true
    },
    close () {
      this.$emit('close')
      this.isShow = false
    },
    focusInput () {
      if (this.$refs && this.$refs.input && this.$refs.input.focus) {
        this.$refs.input.focus()
      }
    },
    clearInput () {
      this.$nextTick(() => {
        this.$emit('input', '')
      })
    },
    getInputElement () {
      if (this.$refs && this.$refs.input) {
        return this.$refs.input.getInput()
      } else {
        return null
      }
    },
    clearSuggestions () {
      this.$nextTick(() => {
        this.suggestions = []
        this.highlightedIndex = -1
        this.hoveredIndex = -1
      })
    },
    onMouseenter (index) {
      this.$nextTick(() => {
        this.hoveredIndex = index
      })
    },
    onMouseleave (index) {
      if (this.hoveredIndex === index) {
        this.hoveredIndex = -1
      }
    },
    onEsc () {
      if (!this.closeOnPressEscape) return
      this.close()
    },
    onChange (value) {
      this.$emit('input', value)
      if (!this.triggerOnFocus && !value) {
        this.suggestions = []
        return
      }
      this.debouncedGetData.do(this.getData, value)
    },
    onFocus (event) {
      this.$emit('focus', event)
      if (this.triggerOnFocus) {
        this.debouncedGetData.do(this.getData, this.value)
      }
    },
    onBlur (event) {
      this.$emit('blur', event)
    },
    onSelect (item) {
      this.$emit('input', item[this.valueKey])
      this.$emit('select', item)
      this.clearSuggestions()
      this.closeOnSelect ? this.$nextTick(this.close) : ''
    },
    onKeyEnter (e) {
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        e.preventDefault()
        this.onSelect(this.suggestions[this.highlightedIndex])
      } else if (this.selectWhenUnmatched) {
        this.$emit('select', { value: this.value })
        this.clearSuggestions()
      }
    },
    highlight (index) {
      if (this.loading) { return }
      if (index < 0) {
        this.highlightedIndex = -1
        return
      }
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1
      }

      const panel = this.$refs.vuePanel
      const items = panel.querySelectorAll('.vue-panel-item')

      let highlightItem = items[index]
      let scrollTop = this.getScrollTop()
      let offsetTop = highlightItem.offsetTop

      if (offsetTop + highlightItem.scrollHeight > (scrollTop + panel.clientHeight)) {
        this.$refs.vuescroll.scrollBy({ dy: highlightItem.scrollHeight }, 50)
      }
      if (offsetTop < scrollTop) {
        this.$refs.vuescroll.scrollBy({ dy: -highlightItem.scrollHeight }, 50)
      }
      this.highlightedIndex = index
    },
    getScrollTop () {
      if (!(this.$refs && this.$refs.vuescroll)) {
        console.error(new Error('[ VueSearchPanel ] Invalid vuescroll.'))
        return 0
      }
      if (typeof this.$refs.vuescroll.getPosition === 'function') {
        let pos = this.$refs.vuescroll.getPosition()
        if (pos && typeof pos.scrollTop === 'number') {
          return pos.scrollTop
        }
      }
      if (this.$refs.vuescroll.$el && this.$refs.vuescroll.$el.querySelector('.__panel')) {
        return this.$refs.vuescroll.$el.querySelector('.__panel').scrollTop
      }
      console.error(new Error('[ VueSearchPanel ] Failed to get scrollTop.'))
      return 0
    },
    getData (query) {
      this.loading = true
      this.fetchSuggestions(query, (suggestions) => {
        this.loading = false
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions
          this.highlightedIndex = this.highlightFirstItem ? 0 : -1
          this.hoveredIndex > suggestions.length ? this.hoveredIndex = -1 : ''
        } else {
          console.error('[ VueSearchPanel ] The suggestions must be an array.')
        }
      })
    },
    afterEnter () {
      this.$emit('opened')
      this.focusInput()
    },
    afterLeave () {
      this.$emit('closed')
      if (this.clearOnClose) {
        this.clearInput()
        this.clearSuggestions()
      }
    },
    getBackgroundColor (index) {
      if (index === this.highlightedIndex) {
        return this.highlightedColor
      } else if (index === this.hoveredIndex) {
        return this.hoveredColor
      } else {
        return 'transparent'
      }
    }
  },
  components: { VueInput, vuescroll }
}
</script>

<style scoped>
.search-panel{
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  z-index: 9999;
  box-sizing: border-box;
  transition: transform 300ms ease-in-out, opacity 300ms ease-in-out;
  height: 300px;
}
.is-fixed{
  position: fixed !important;
  width: 50%;
}

.search-panel:focus,
.search-panel:hover{
  outline: none
}
.vue-panel{
  box-sizing: border-box;
  position: absolute;
  top: 40px;
  bottom: 0px;
  left: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
  /* overflow: hidden; */
}
.vue-panel-item{
  cursor: pointer;
}

.vue-panel-item-value{
  margin: 0;
  padding: 8px 16px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.is-in-top{
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.top-top-enter,
.top-top-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}

.is-in-bottom{
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.bottom-bottom-enter,
.bottom-bottom-leave-to {
  opacity: 0;
  transform: translate(-50%, 100%);
}
.is-in-left{
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.left-left-enter,
.left-left-leave-to {
  opacity: 0;
  transform: translate(-100%, -50%);
}
.is-in-right{
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.right-right-enter,
.right-right-leave-to {
  opacity: 0;
  transform: translate(100%, -50%);
}
</style>
