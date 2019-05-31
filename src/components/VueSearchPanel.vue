<template>
  <div>
    <transition :name="transitionName" @after-enter="afterEnter" @after-leave="afterLeave">
      <div 
        class="search-panel"
        :style="style"
        :class="{
          'is-in-top': placement === 'top',
          'is-in-bottom': placement === 'bottom',
          'is-in-left': placement === 'left',
          'is-in-right': placement === 'right',
        }"
        v-show="isShow"
        @keyup.esc="onEsc"
        tabindex="0"
        ref="searchPanel"
      >
        <vue-input 
          v-bind="$attrs"
          :value="value"
          :placeholder="placeholder"
          @input="onChange"
          @focus="onFocus"
          @blur="onBlur"
          @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
          @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
          @keydown.enter.native="onKeyEnter"
          ref="input"
        >
        </vue-input>
        <div class="vue-panel">
          <div
            class="vue-panel-item"
            v-for="(item, index) in suggestions"
            :key="index"
            :class="{'highlighted': highlightedIndex === index}"
            @click="onSelect(item)"
          >
            <slot :item="item">
              {{ item[valueKey] }}
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ClickOutside from '../utils/clickoutside.js'
import Lazy from '../utils/debounce.js'
import VueInput from './VueInput.vue'

export default {
  name: 'VueSearchPanel',
  data() {
    return {
      isShow: false,
      clickOutside: false,
      lazy: null,
      suggestions: [],
      highlightedIndex: -1
    }
  },
  props: {
    valueKey: { type: String, default: 'value' },
    placeholder: String,
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
    value: String
  },
  computed: {
    transitionName () {
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
      return style
    }
  },
  mounted () {
    let selfEle = this.$refs.searchPanel
    this.clickOutside = new ClickOutside([selfEle], document, this.close)
    this.clickOutside.bind()
    this.lazy = new Lazy(200)
  },
  beforeDestroy () {
    (this.clickOutside && this.clickOutside.unbind) ? this.clickOutside.unbind() : ''
    this.lazy = null
  },
  methods: {
    show () {
      this.isShow = true
    },
    close () {
      this.isShow = false
    },
    onEsc () {
      if (!this.closeOnPressEscape) return
      this.close()
    },
    onChange (value) {
      this.$emit('input', value)
      this.lazy.listening(this.getData, value)
    },
    onFocus(event) {
      this.$emit('focus', event)
    },
    onBlur(event) {
      this.$emit('blur', event)
    },
    onSelect (item) {
      this.$emit('input', item[this.valueKey])
      this.$emit('select', item)
      this.$nextTick(() => {
        this.suggestions = []
        this.highlightedIndex = -1
      })
    },
    onKeyEnter () {
      
    },
    getData () {

    },
    highlight (index) {

    },
    afterEnter () {
      this.$emit('opened')
      if (this.$refs && this.$refs.input && this.$refs.input.focus) {
        this.$refs.input.focus()
      }
    },
    afterLeave () {
      this.$emit('closed')
    }
  },
  components: { VueInput }
}
</script>

<style scoped>
.search-panel{
  margin: 0;
  padding: 0;
  position: fixed;
  overflow: hidden;
  z-index: 9999;
  box-sizing: border-box;
  transition: transform 300ms ease-in-out, opacity 300ms ease-in-out;
  width: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  background: #fff;
  height: 300px;
}
.search-panel:focus,
.search-panel:hover{
  outline: none
}
.vue-panel{
  box-sizing: border-box;
  position: absolute;
  top: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.vue-panel-item.highlighted,
.vue-panel-item:hover{
  background-color: #F5F7FA
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