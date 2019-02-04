import browser from 'webextension-polyfill'
import Vue from 'vue'
import VueMoment from 'vue-moment'

import DevTools from './index.vue'

import bus from '../shared/bus'

Vue.config.productionTip = false

// Add Chrome Theme to Body
if (browser.devtools.panels) {
  document.body.classList.add(browser.devtools.panels.themeName)
}

// Use Moment
Vue.use(VueMoment)

// Listen for Chrome Events & Pass to Vue
browser.runtime.onMessage.addListener(async (request) => {
  if (request.type === 'sfcc-remote-web-request') {
    bus.$emit('ADP_WEB_REQUEST', request.request)
  } else if (request.type === 'sfcc-remote-web-nav-start') {
    bus.$emit('ADP_NAV_START', request.request)
  } else if (request.type === 'sfcc-remote-web-nav-complete') {
    bus.$emit('ADP_NAV_COMPLETE', request.request)
  } else if (request.type === 'sfcc-remote-panel-message') {
    bus.$emit('ADP_PANEL_MESSAGE', request.message)
  } else if (request.type === 'sfcc-remote-toggle') {
    if (typeof io !== 'undefined') {
      bus.$emit('REMOTE_TOGGLE', request.enabled)
    } else {
      bus.$emit('REMOTE_TOGGLE', false)
      browser.runtime.sendMessage({ type: 'sfcc-remote', enabled: false }).then(console.log, console.error)
    }
  }
})

browser.storage.local.get().then(store => {
  if (typeof io !== 'undefined') {
    bus.$emit('REMOTE_TOGGLE', store['sfcc-remote-enabled'])
  }
})

var socket = null
var connected = false

if (typeof io !== 'undefined') {
  try {
    socket = io('https://localhost:8443')
  } catch (err) {
    console.log('SFCC-CLI: NOT CONNECTED', err)
  }

  bus.$on('REMOTE_TOGGLE', (enabled) => {
    if (socket && !connected && enabled) {
      socket.connect()
    } else if (socket && connected && !enabled) {
      socket.disconnect()
    } else if (!socket) {
      bus.$emit('SOCKET_DISCONNECTED')
      browser.runtime.sendMessage({ type: 'sfcc-remote', enabled: false }).then(console.log, console.error)
    }
  })

  /* Handle Socket Messages */
  socket.on('connect', () => {
    console.log('SFCC-CLI: CONNECTED')
    socket.emit('get-config')
    bus.$emit('SOCKET_CONNECTED')
    browser.runtime.sendMessage({ type: 'sfcc-remote', enabled: true }).then(console.log, console.error)
    connected = true
  })

  socket.on('disconnect', () => {
    console.log('SFCC-CLI: DISCONNECTED')
    bus.$emit('SOCKET_DISCONNECTED')
    browser.runtime.sendMessage({ type: 'sfcc-remote', enabled: false }).then(console.log, console.error)
    connected = false
  })

  socket.on('error', error => {
    console.error('SFCC-CLI:', error)
  })

  socket.on('connect_error', error => {
    console.error('SFCC-CLI:', error)
    bus.$emit('REMOTE_TOGGLE', false)
  })

  socket.on('message', message => {
    console.log('SFCC-CLI:', message)
  })

  socket.on('set-config', config => {
    console.log('SFCC-CLI: CONFIG ', config)
    bus.$emit('REMOTE_SET_CONFIG', config)
    bus.setConfig(config)
  })

  socket.on('watch', data => {
    console.log('SFCC-CLI: WATCH', data)
    bus.$emit('LOG_MESSAGE', data)
  })

  socket.on('log', data => {
    console.log('SFCC-CLI: LOG', data)
    bus.$emit('LOG_MESSAGE', data)
  })

  /* --live-reload */
  socket.on('refresh', updated => {
    if (updated) {
      console.log('SFCC-CLI: Reloading ...')
      window.location.reload(true)
    }
  })
} else {
  bus.$emit('SOCKET_DISCONNECTED')
  browser.runtime.sendMessage({ type: 'sfcc-remote', enabled: false }).then(console.log, console.error)

  bus.$on('REMOTE_TOGGLE', (enabled) => {
    if (!socket) {
      bus.$emit('SOCKET_DISCONNECTED')
      browser.runtime.sendMessage({ type: 'sfcc-remote', enabled: false }).then(console.log, console.error)
    }
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#sfcc-remote',
  render: h => h(DevTools)
})
