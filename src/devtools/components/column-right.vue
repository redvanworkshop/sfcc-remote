<template>
  <transition name="slide-fade">
    <div class="pane" id="right" v-show="showColumn">
      <header>
        <button class="toolbar-icon" aria-label="Download" aria-pressed="false">
          <i class="devtools-icon download"></i>
        </button>

        <button class="toolbar-icon" aria-label="Settings" aria-pressed="false">
          <i class="devtools-icon gear"></i>
        </button>
      </header>

      <main>
        <!-- @TODO: Add Inspector -->
      </main>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ColumnRight',
  props: {
    showColumn: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
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
    }
  }
}
</style>
