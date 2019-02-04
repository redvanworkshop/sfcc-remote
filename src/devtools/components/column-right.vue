<template>
  <transition name="slide-fade">
    <div class="pane" id="right" v-show="showColumn">
      <header>
        <button class="toolbar-icon" @click="clearDetails" aria-label="Clear log" aria-pressed="false" :disabled="!details">
          <i class="devtools-icon clear"></i>
        </button>

        <button class="toolbar-icon" @click="openOptionsPage" aria-label="Settings" aria-pressed="false" vi-if="showOptionsButton">
          <i class="devtools-icon gear"></i>
        </button>
      </header>

      <main>
        <div v-if="details">
          <header>Client / Instance</header>
          <div class="text">{{ details.client }} / {{ details.instance }}</div>

          <header>Timestamp</header>
          <div class="text">{{ new Date(details.timestamp) | moment('MMM Do, h:mm:ss A') }}</div>

          <header>Message</header>
          <div class="text" v-html="details.message"></div>
        </div>
      </main>
    </div>
  </transition>
</template>

<script>
import browser from 'webextension-polyfill'

import bus from '../../shared/bus'

export default {
  name: 'ColumnRight',
  props: {
    showColumn: {
      type: Boolean,
      default: false
    },
    remoteEnabled: {
      type: Boolean,
      default: false
    },
    socketConnected: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    details: null,
    showOptionsButton: (browser.runtime && (typeof browser.runtime.openOptionsPage !== 'undefined' || typeof browser.runtime.getURL !== 'undefined'))
  }),
  created () {
    this.bindEvents()
  },
  methods: {
    bindEvents () {
      bus.$off('showDetails')
      bus.$on('showDetails', (data) => {
        this.details = data
      })
    },
    clearDetails () {
      this.details = null
    },
    openOptionsPage () {
      if (browser.runtime.openOptionsPage) {
        browser.runtime.openOptionsPage()
      } else {
        window.open(browser.runtime.getURL('options.html'))
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../shared/app';

#right {
  header {
    padding-left: 2px;

    button {
      position: relative;
      display: inline-block;
      margin: 0;
      float: left;
      position: relative;
      top: 1px;

      &:disabled {
        pointer-events: none;
        opacity: 0.25;
      }
    }
  }

  .text {
    padding: 12px;
    white-space: normal;
    word-break: break-word;
    user-select: text;
    cursor: text;
    line-height: 16px;
  }
}
</style>
