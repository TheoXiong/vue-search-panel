<template>
  <div>
    <transition :name="transitionName">
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
        ref="searchPanel"
      >
        <vue-input 
          v-bind="$attrs"
          :value="value"
          @input="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        >
        </vue-input>
        <div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ClickOutside from '../utils/clickoutside.js'
import VueInput from './VueInput.vue'

export default {
  name: 'VueSearchPanel',
  data() {
    return {
      isShow: false,
      clickOutside: false
    }
  },
  props: {
    placement: {
      type: String,
      default: 'top',
      validator: value => ['top', 'bottom', 'left', 'right'].indexOf(value) > -1
    },
    width: { type: String, default: '' },
    top: { type: String, default: '0px' },
    bottom: { type: String, default: '0px' },
    left: { type: String, default: '0px' },
    right: { type: String, default: '0px' },
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
  },
  beforeDestroy () {
    (this.clickOutside && this.clickOutside.unbind) ? this.clickOutside.unbind() : ''
  },
  methods: {
    showSearchPanel () {
      this.isShow = true
    },
    close () {
      this.isShow = false
    },
    handleChange (value) {
      this.$emit('input', value)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.$emit('blur', event)
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