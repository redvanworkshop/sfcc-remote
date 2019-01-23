import Vue from 'vue'

const bus = new Vue({
  methods: {
    initPopup () {
      console.log('INIT_POPUP')
      this.$emit('INIT_POPUP', { abc: 123 })
    },
    initPanel () {
      console.log('INIT_PANEL')
      this.$emit('INIT_PANEL', { abc: 123 })
    },
    initOptions () {
      console.log('INIT_OPTIONS')
      this.$emit('INIT_OPTIONS', { abc: 123 })
    },
    initTab () {
      console.log('INIT_TAB')
      this.$emit('INIT_TAB', { abc: 123 })
    },
    handleRequest (request) {
      console.log('HANDLE_REQUEST')
      this.$emit('REQUEST', {
        url: request.url,
        get: request.get_params,
        post: request.post_params
      })
    }
  }
})

export default bus
