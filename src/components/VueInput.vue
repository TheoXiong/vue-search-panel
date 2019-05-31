<template>
  <div class="vue-input-wrap" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <input 
      class="vue-input"
      ref="input"
      v-bind="$attrs"
      :placeholder="placeholder"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    >
  </div>
</template>

<script>
export default {
  name: 'VueInput',
  data() {
    return {
      isComposing: false,
      hovering: false,
      focused: false
    }
  },
  props: {
    value: [String, Number],
    placeholder: String
  },
  computed: {
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    }
  },
  watch: {
    nativeInputValue() {
      this.setNativeInputValue()
    }
  },
  mounted () {
    this.setNativeInputValue()
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    },
    handleCompositionStart() {
      this.isComposing = true
    },
    handleCompositionEnd(event) {
      this.isComposing = false
      this.handleInput(event)
    },
    handleInput(event) {
      if (this.isComposing) return
      if (event.target.value === this.nativeInputValue) return
      this.$emit('input', event.target.value)
      this.$nextTick(this.setNativeInputValue)
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.focused = false
      this.$emit('blur', event)
    },
    handleChange(event) {
      this.$emit('change', event.target.value)
    },
    setNativeInputValue() {
      const input = this.$refs.input
      if (!input) return
      if (input.value === this.nativeInputValue) return
      input.value = this.nativeInputValue
    }
  }
}
</script>

<style scoped>
.vue-input-wrap{
  box-sizing: border-box;
  margin: 6px;
  font-size: 12px;
  font-family: inherit;
}
.vue-input{
  -webkit-appearance: none;
  background-color: transparent;
  background-image: none;
  border-radius: 2px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 28px;
  line-height: 28px;
  outline: 0;
  padding: 0px 15px;
  transition: border-color .2s ease;
  width: 100%;
}
.vue-input:hover{
  border-color: #c0c4cc;
}

.vue-input:focus, .vue-input:active{
  outline: 0;
  border-color: #575F96;
}

/* .vue-input::placeholder{
  color: #d0d5e0;
}
.vue-input::-ms-clear {
  display: none;
  width: 0;
  height: 0;
} */
</style>