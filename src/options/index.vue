<template>
  <div>options</div>
</template>

<script>
/*
@TODO: Support managing `sfcc setup` via web interface
*/

import bus from '../shared/bus'

export default {
  data: () => ({}),
  computed: {},
  created () {
    this.bindEvents()
  },
  mounted () {
    bus.initOptions()
  },
  methods: {
    bindEvents () {
      bus.$off('INIT_OPTIONS')
      bus.$on('INIT_OPTIONS', (data) => {
        console.log('RECEIVED_INIT_OPTIONS', data)
      })
    }
  }
}
</script>

<style>
div {
  color: blue
}
</style>
