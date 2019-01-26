<template>
  <transition name="slide-fade">
    <div class="pane" id="left" v-show="showColumn">
      <header>
        <button class="toolbar-icon" @click="toggleRecord" :aria-label="remoteEnabled ? 'Remote is On' : 'Remote is Off'" aria-pressed="false">
          <i class="devtools-icon" :class="remoteEnabled ? 'recording' : 'record'"></i>
        </button>

        <button class="toolbar-icon" @click="toggleFilter" aria-label="Filter" aria-pressed="false">
          <i class="devtools-icon filter" :class="filtering ? 'active' : ''"></i>
        </button>
      </header>
      <main>
        <ul class="options" role="tree">
          <li v-for="(client, key) in config" class="option bb-muted" role="treeitem" :key="key" :class="{ 'filtering' : filtering }">
            <div>
              <label>
                <input type="checkbox" v-show="filtering" :value="key" :checked="isSelected(key)">
                {{ titleCase(key) }}
              </label>

              <span class="badge accent-a-bg" v-if=" Object.keys(client).length > 1">{{  Object.keys(client).length }}</span>
            </div>

            <ul v-if="filtering && Object.keys(client).length > 0" class="services">
              <li v-for="(instance, inst) in client" class="service">
                <div>
                  <label>
                    <input type="checkbox" :value="index" :checked="isSelected(index)">
                    {{ titleCase(inst) }}
                  </label>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </main>
    </div>
  </transition>
</template>

<script>
/*
@TODO: Support Enabling/Disabling Client & Instance Logs from Left Column
@TODO: Show counter for logged message for client
*/

import browser from 'webextension-polyfill'
import bus from '../../shared/bus'

export default {
  name: 'ColumnLeft',
  props: {
    remoteEnabled: {
      type: Boolean,
      default: false
    },
    showColumn: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    filters: [],
    recording: this.remoteEnabled,
    filtering: false
  }),
  mounted () {
    this.filters = Object.keys(this.config)
  },
  methods: {
    isSelected (index) {
      return this.filters.indexOf(index) > -1
    },
    toggleRecord () {
      bus.$emit('REMOTE_TOGGLE', !this.remoteEnabled)
      browser.runtime.sendMessage({ type: 'sfcc-remote', enabled: !this.remoteEnabled }).then(console.log, console.error)
    },
    toggleFilter () {
      this.filtering = !this.filtering

      if (this.filtering) {
        this.$emit('startFiltering')
      } else {
        this.$emit('stopFiltering')
      }
    },
    titleCase (str) {
      str = str.toLowerCase().split('-')
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
      }
      return str.join(' ')
    }
  }
}
</script>

<style lang="scss">
@import '../../shared/app';

#left {
  header {
    padding-left: 2px;

    button {
      position: relative;
      display: inline-block;
      margin: 0;
      float: left;
      position: relative;
      top: 1px;
    }
  }
  main {
    ul.options {
      width: 100%;
      list-style: none;

      li.option {
        width: 100%;

        &.inactive {
          pointer-events: none;
          opacity: 0.35;
        }

        & > div {
          position: relative;
          text-indent: 16px;
          height: 50px;
          line-height: 50px;

          label {
            width: 100%;
            display: block;
          }

          input {
            position: absolute;
            top: 18px;
            left: 10px;
          }

          span.badge {
            color: #FFF;
            border-radius: 50%;
            position: absolute;
            top: 15px;
            right: 10px;
            width: 20px;
            height: 20px;
            text-align: center;
            font-size: 10px;
            padding: 0;
            margin: 0;
            line-height: 20px;
            text-indent: 0;
            font-weight: 600;
          }
        }

        &.filtering > div {
          text-indent: 30px;

          label:hover {
            color: #FFF;
          }
        }
      }
    }

    ul.services {
      width: 100%;
      list-style: none;
      margin-bottom: 10px;

      li.service {
        width: 100%;

        & > div {
          position: relative;
          text-indent: 50px;
          height: 30px;
          line-height: 30px;

          label {
            width: 100%;
            display: block;

            &:hover {
              color: #FFF;
            }
          }

          input {
            position: absolute;
            top: 8px;
            left: 30px;
          }
        }
      }
    }
  }
}
</style>
