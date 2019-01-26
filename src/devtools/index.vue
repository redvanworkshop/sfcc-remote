<template>
  <div class="vertical-panes sfcc-remote">
    <column-left
      :remoteEnabled="remoteEnabled"
      :showColumn="showLeft"
      :counts="counts"
      :config="config"
    />
    <column-main
      :showLeftColumn="showLeft"
      :showRightColumn="showRight"
      :config="config"
      :logger="logger"
      @togglePanel="togglePanel"
      @clearLog="clearLog"
    />
    <column-right
      :showColumn="showRight"
      :config="config"
    />
  </div>
</template>

<script>
/*
@TODO: Add detection for when Socket is on/off and sync to remote
@TODO: Add detection for when Socket is dropped via terminated CLI
@TODO: Show details in right column for log entries selected in Main column
@TODO: Remove debug log statements
*/

import Split from 'split.js'

import bus from '../shared/bus'

import ColumnLeft from './components/column-left.vue'
import ColumnMain from './components/column-main.vue'
import ColumnRight from './components/column-right.vue'

export default {
  name: 'DevTools',
  components: {
    ColumnLeft,
    ColumnMain,
    ColumnRight
  },
  data: () => ({
    remoteEnabled: true,
    instance: null,
    showLeft: true,
    showRight: true,
    timeout: null,
    columns: [],
    counts: {},
    config: {},
    logger: []
  }),
  created () {
    this.bindEvents()
  },
  mounted () {
    bus.initPanel()
    this.setColumns()
  },
  methods: {
    bindEvents () {
      bus.$off('INIT_PANEL')
      bus.$on('INIT_PANEL', (data) => {
        // console.log('RECEIVED_INIT_PANEL', data)
      })

      bus.$off('ADP_NAV_START')
      bus.$on('ADP_NAV_START', (request) => {
        // console.log('ADP_NAV_START', request)
      })

      bus.$off('ADP_NAV_COMPLETE')
      bus.$on('ADP_NAV_COMPLETE', (request) => {
        // console.log('ADP_NAV_COMPLETE', request)
      })

      bus.$off('ADP_WEB_REQUEST')
      bus.$on('ADP_WEB_REQUEST', (request) => {
        // console.log('ADP_WEB_REQUEST', request)
        bus.handleRequest(request)
      })

      bus.$off('ADP_PANEL_MESSAGE')
      bus.$on('ADP_PANEL_MESSAGE', (message) => {
        // console.log('ADP_PANEL_MESSAGE', message)
      })

      // bus.$off('REMOTE_TOGGLE')
      bus.$on('REMOTE_TOGGLE', (enabled) => {
        this.remoteEnabled = enabled
        console.log('REMOTE_TOGGLE', enabled)
      })

      bus.$off('REMOTE_SET_CONFIG')
      bus.$on('REMOTE_SET_CONFIG', (config) => {
        this.config = config
      })

      bus.$off('LOG_MESSAGE')
      bus.$on('LOG_MESSAGE', (message) => {
        this.logger.push(message)
      })
    },
    togglePanel (col) {
      if (col === 'left') {
        this.showLeft = !this.showLeft
      } else if (col === 'right') {
        this.showRight = !this.showRight
      }

      // hide gutters for closed side panels
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        document.querySelectorAll('.gutter')[0].style.display = (document.querySelector('#left').clientWidth > 0) ? 'block' : 'none'
        document.querySelectorAll('.gutter')[1].style.display = (document.querySelector('#right').clientWidth > 0) ? 'block' : 'none'
      }, 100)
    },
    clearLog () {
      this.logger = []
    },
    setColumns () {
      var self = this
      this.instance = Split(['#left', '#center', '#right'], {
        gutterSize: 9,
        minSize: 0,
        sizes: [10, 80, 10], // @TODO: Pull size from memory
        elementStyle: function (dimension, size, gutterSize) {
          const width = document.querySelector('.sfcc-remote').clientWidth
          let panelWidth = Math.round(width * (size / 100))

          if (panelWidth < 200) {
            panelWidth = 200
          }

          return {
            'flex-basis': panelWidth + 'px'
          }
        },
        gutterStyle: function (dimension, gutterSize) {
          return {
            'flex-basis': gutterSize + 'px'
          }
        },
        onDragEnd: function () {
          self.columns = self.instance.getSizes()
          // @TODO: Store Columns in Memory
        }
      })

      this.columns = this.instance.getSizes()
    }
  }
}
</script>

<style lang="scss">
@import '../shared/app';

html {
  box-sizing: border-box;
}

/* CSS RESET */
*, :after, :before {
  box-sizing: inherit;
  padding: 0;
  margin: 0;
}

#sfcc-remote, body, html {
  padding: 0;
  margin: 0;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a, button {
  cursor: pointer;
}

.sfcc-remote {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  button {
    background: none;
    border: none;
  }

  .gutter {
    cursor: ew-resize;
    width: 9px;
    margin: 0 -4px;
  }

  .pane {
    height: 100%;
    opacity: 1;
  }

  .toolbar-icon {
    width: 28px;
    height: 24px;

    &:active, &:focus {
      outline: none;
    }
  }

  #left, #right {
    min-width: 100px;
    max-width: 400px;
    flex-basis: 200px;
  }

  #center {
    flex-grow: 1;
    flex-basis: unset !important;
  }

  header {
    text-align: center;
    line-height: 27px;
    height: 27px;
    font-weight: 600;
    position: relative;
  }

  main {
    background-color: transparent;
    color: #999;
    height: calc(100% - 26px);
    overflow: auto;
  }
}

.slide-fade-enter-active {
  transition: flex-basis .025s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-leave-to {
  transition: flex-basis .025s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
  flex-basis: 0 !important;
}
</style>
