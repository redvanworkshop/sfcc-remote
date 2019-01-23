<template>
  <div class="pane column-main" id="center">
    <header>
      <button class="toolbar-icon left-menu" @click="togglePanel('left')" :aria-label="showLeftColumn ? 'Hide Left Sidebar' : 'Show Left Sidebar'" aria-pressed="false">
        <i class="devtools-icon" :class="showLeftColumn ? 'collpase-left' : 'expand-right'"></i>
      </button>

      <div class="center-icons">
        <button class="toolbar-icon" @click="clearLog" aria-label="Clear log" aria-pressed="false" :disabled="logger.length === 0">
          <i class="devtools-icon clear"></i>
        </button>

        <button class="toolbar-icon" @click="filterLog" aria-label="Filter log" aria-pressed="false" :disabled="logger.length === 0">
          <i class="devtools-icon filter" :class="(showFilter || filtersApplied) ? 'active' : ''"></i>
        </button>

        <div class="divider"></div>

        <span>View:</span>

        <button class="toolbar-icon" @click="toggleListSize" :aria-label="largeList ? 'Use small rows' : 'Use large rows'" aria-pressed="false" :disabled="logger.length === 0">
          <i class="devtools-icon list-large" :class="largeList ? 'active' : ''"></i>
        </button>

        <button class="toolbar-icon" @click="toggleOverview" :aria-label="showDetail ? 'Hide details' : 'Show details'" aria-pressed="false" :disabled="logger.length === 0">
          <i class="devtools-icon waterfall" :class="showDetail ? 'active' : ''"></i>
        </button>
      </div>

      <button class="toolbar-icon right-menu" @click="togglePanel('right')" :aria-label="showRightColumn ? 'Hide Right Sidebar' : 'Show Right Sidebar'" aria-pressed="false">
        <i class="devtools-icon" :class="showRightColumn ? 'collpase-right' : 'expand-left'"></i>
      </button>
    </header>

    <main>
      <div class="filter-bar bb" v-if="showFilter">
        <button class="toolbar-icon clear-filters" @click="clearFilters" :disabled="!filtersApplied" aria-label="Clear filters" aria-pressed="false">
          <i class="devtools-icon clear"></i>
        </button>

        <div class="divider"></div>

        <div class="filter-option" :class="{ 'active': filter.type !== 'all' }">
          <label for="filter-type">Type:</label>
          <select class="toolbar-select" name="type" id="filter-type" v-model="filter.type" role="button" aria-label="Filter by type" aria-pressed="false">
            <option value="all">All</option>
            <option value="error">Error</option>
            <option value="log">Log</option>
            <option value="upload">Upload</option>
            <option value="watch">Watch</option>
          </select>
        </div>

        <div class="divider"></div>

        <div class="filter-option" :class="{ 'active': filter.client !== 'all' }">
          <label for="filter-request">Client:</label>
          <select class="toolbar-select" name="request" id="filter-request" v-model="filter.client" role="button" aria-label="Filter by request" aria-pressed="false">
            <option value="all">All</option>
            <option value="image">Image</option>
            <option value="ping">Ping</option>
          </select>
        </div>

        <div class="divider"></div>

        <div class="filter-option" :class="{ 'active': filter.instance !== 'all' }">
          <label for="filter-instance">Instance:</label>
          <select class="toolbar-select" name="instance" id="filter-instance" v-model="filter.instance" role="button" aria-label="Filter by instance" aria-pressed="false">
            <option value="all">All</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>

        <div class="divider"></div>

        <input name="search" type="search" v-model="filter.search" placeholder="Search"  />

        <input type="checkbox" value="yes" v-model="filter.regexp" id="isRegExp" class="checkbox" :class="{ 'invalid': !validRegExp }" />
        <label for="isRegExp" :class="{ 'invalid': !validRegExp }">RegExp</label>

      </div>

      <div class="content-log" :class="{ 'large-list': largeList, 'small-list': !largeList, 'show-details': showDetail }">
        <div v-if="logger.length === 0">No Entry</div>
        <ul v-if="logger.length > 0">
          <li class="bb-muted list-row"
            v-for="(log, index) in logger"
            :key="index"
            :class="{ 'active': index === selected, [log.type]: true }"
            :data-type="log.type"
            :data-client="log.client"
            :data-instance="log.instance"
            v-if="filteredLogs(log)"
            @click="showDetails(index)"
          >
            <div>
              <span class="type" :class="log.type">
                {{ log.type }}
              </span>

              <span class="client" v-if="showDetail">
                {{ log.client }}
              </span>

              <span class="instance" v-if="showDetail">
                {{ log.instance }}
              </span>

              <span class="message">
                {{ log.message }}
              </span>

              <span class="timestamp" :title="new Date(log.timestamp) | moment('dddd, MMMM Do YYYY, h:mm:ss A')" v-if="showDetail">
                {{ new Date(log.timestamp) | moment('MMM Do, h:mm:ss A') }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import browser from 'webextension-polyfill'

import bus from '../../shared/bus'

export default {
  name: 'ColumnMain',
  props: {
    showLeftColumn: {
      type: Boolean,
      default: false
    },
    showRightColumn: {
      type: Boolean,
      default: false
    },
    logger: {
      type: Array,
      default: false
    }
  },
  data: () => ({
    selected: null,
    largeList: false,
    showDetail: true,
    showSearch: false,
    showFilter: false,
    validRegExp: true,
    filter: {
      type: 'all',
      client: 'all',
      instance: 'all',
      search: '',
      regexp: false
    },
    config: {
      type: Object,
      default: () => {}
    }
  }),
  mounted () {
    bus.$on('TRACK_REQUEST', (request) => {
      this.logger.unshift(request)
    })
  },
  computed: {
    getThemeName () {
      return browser.devtools.panels.themeName
    },
    filtersApplied () {
      return (this.filter.type !== 'all' || this.filter.client !== 'all' || this.filter.instance !== 'all' || this.filter.search !== '')
    }
  },
  methods: {
    togglePanel (col) {
      this.$emit('togglePanel', col)
    },
    toggleListSize () {
      this.largeList = !this.largeList

      if (this.largeList) {
        this.$emit('listSizeChanged', 'large')
      } else {
        this.$emit('listSizeChanged', 'small')
      }
    },
    toggleOverview () {
      this.showDetail = !this.showDetail

      if (this.showDetail) {
        this.$emit('showDetail')
      } else {
        this.$emit('hideDetail')
      }
    },
    clearLog () {
      this.$emit('clearLog')
      this.logger = []
    },
    filterLog () {
      this.showFilter = !this.showFilter
      this.showSearch = false

      if (this.showFilter) {
        this.$emit('showFilter')
      } else {
        this.$emit('hideFilter')
      }
    },
    searchLog () {
      this.showSearch = !this.showSearch
      this.showFilter = false

      if (this.showSearch) {
        this.$emit('showSearch')
      } else {
        this.$emit('hideSearch')
      }
    },
    showDetails (id) {
      this.selected = (this.selected === id) ? null : id
    },
    filteredLogs (log) {
      let showResult = true

      if (this.filter.type !== 'all' && log.type !== this.filter.type) {
        showResult = false
      }

      if (this.filter.client !== 'all' && log.type !== this.filter.client) {
        showResult = false
      }

      if (this.filter.instance !== 'all' && log.instance !== this.filter.instance) {
        showResult = false
      }

      if (this.filter.search !== '') {
        let foundMatch = true
        let record = ''
        let search = this.filter.search

        record = record.concat(log.type)
          .concat(' ')
          .concat(log.client)
          .concat(' ')
          .concat(log.instance)
          .concat(' ')
          .concat(log.message)
          .concat(' ')
          .concat(log.timestamp)

        if (this.filter.regexp) {
          let regex
          try {
            if (search.charAt(0) !== '/' && (search.charAt(search.length - 1) !== '/' || search.charAt(search.length - 2) !== '/' || search.charAt(search.length - 3) !== '/')) {
              search = `/${search}/`
            }
            // eslint-disable-next-line
            regex = Function('"use strict"; return ' + search.toString())()
          } catch (error) {
            if (error) {
              this.validRegExp = false
            }
          }

          if (typeof regex !== 'undefined' && regex.constructor === RegExp) {
            foundMatch = regex.test(record)
            this.validRegExp = true
          } else {
            this.validRegExp = false
          }
        } else {
          this.validRegExp = true
          const keyword = this.filter.search.toLowerCase().trim().split(' ')
          record = record.toLowerCase()
          for (let i = 0; i < keyword.length; i++) {
            if (!record.includes(keyword[i])) {
              foundMatch = false
            }
          }
        }

        if (!foundMatch) {
          showResult = false
        }
      }

      return showResult
    },
    clearFilters () {
      this.filter.type = 'all'
      this.filter.client = 'all'
      this.filter.instance = 'all'
      this.filter.search = ''
      this.filter.regexp = false
      this.validRegExp = true
    }
  }
}
</script>

<style lang="scss">
@import '../../shared/app';

.column-main {
  header {
    text-align: center;

    .left-menu {
      float: left;
      position: relative;
      top: 1px;
    }

    .right-menu {
      float: right;
      position: relative;
      top: 1px;
    }

    .center-icons {
      width: 50%;
      display: inline-block;
      font-size: 0;
      line-height: 0;
      white-space: nowrap;
      margin: 0 auto;

      span {
        font-size: 12px;
        line-height: 12px;
        font-weight: 400;
        position: relative;
        top: 8px;
        vertical-align: top;
        display: inline-block;
        margin-left: 8px;
        margin-right: 4px;
      }

      button {
        display: inline-block;
        font-size: 0;
        position: relative;
        top: -1px;

        &:disabled {
          pointer-events: none;
          opacity: 0.25;
        }
      }
    }
  }

  .filter-bar {
    height: 26px;
    display: block;
    position: relative;

    .divider {
      float: left;
      opacity: 0.5;
    }

    .clear-filters {
      float: left;

      &:disabled {
        cursor: none;
        pointer-events: none;
        opacity: 0.25;
      }
    }

    .checkbox {
      width: 22px;
    }

    label.invalid {
      color: #DB4437;
    }

    input {
      border: 1px solid transparent;
      margin: 4px 0 0 4px;
      line-height: 16px;
      padding: 0 4px;
      width: 180px;

      &:focus, &:active {
        outline: none;
      }
    }
  }

  .filter-option {
    line-height: 26px;
    padding: 0 6px;
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    float: left;

    .active {
      font-weight: 700;

      select {
        font-weight: 700;
      }
    }
  }

  .content-log {
    font-weight: 500;

    &.large-list {
      li {
        height: 51px;
        line-height: 50px;

        div {
          margin: 0 14px;

          .type {
            top: 10px;
          }
        }
      }
    }
    &.small-list {
      li {
        height: 31px;
        line-height: 30px;

        div {
          margin: 0 6px;

          .type {
            top: 5px;
          }
        }
      }
    }
    &.show-details {
      .message {
        width: calc(100% - 340px);
      }
    }

    .type, .instance, .type {
      font-size: 10px;
      text-transform: uppercase;
      text-align: left;
      display: inline-block;
      letter-spacing: 0.5px;
      vertical-align: top;
    }

    .client, .instance {
      font-size: 10px;
      text-transform: uppercase;
      text-align: left;
      display: inline-block;
      letter-spacing: 0.5px;
      margin-left: 5px;
      width: 60px;
      vertical-align: top;
      overflow: hidden;
    }

    .message {
      display: inline-block;
      width: calc(100% - 80px);
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .type {
      width: 100px;
      text-align: center;
      height: 20px;
      line-height: 20px;
      color: #FFF;
      border-radius: 2px;
      position: relative;

      &.log {
        background-color: rgba(100,100,100,.25);
      }

      &.upload {
        background-color: #37a655;
      }

      &.watch {
        background-color: #4285f0;
      }

      &.error {
        background-color: #DB4437;
      }
    }

    .type {
      width: 60px;
      margin: 0 5px;
    }

    .timestamp {
      display: inline-block;
      float: right;
      opacity: 0.35;
      width: 125px;
      text-align: right;
    }

    & > li:hover {
      .timestamp {
        opacity: 1;
      }
    }
  }
}
</style>
