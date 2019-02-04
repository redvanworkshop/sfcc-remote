<template>
  <div>options {{ config }}</div>
</template>

<script>
/*
@TODO: Support managing `sfcc setup` via web interface
*/

import bus from '../shared/bus'

export default {
  data: () => ({
    config: null
  }),
  computed: {},
  created () {
    this.bindEvents()
  },
  mounted () {
    bus.initOptions()
    this.config = bus.getConfig()
    console.log('this.config', this.config)
  },
  methods: {
    bindEvents () {
      bus.$off('INIT_OPTIONS')
      bus.$on('INIT_OPTIONS', (data) => {
        console.log('RECEIVED_INIT_OPTIONS', data)
      })

      bus.$on('REMOTE_SET_CONFIG', (data) => {
        console.log('REMOTE_SET_CONFIG', data)
        this.config = data
      })
    }
  }
}
</script>

<style lang="scss">
@import '../shared/app';

div {
  color: blue
}
</style>
