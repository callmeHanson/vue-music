<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      version="1.1"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- <circle class="progress-background" cx="50" cy="50" r="46" fill="transparent" /> -->
      <circle
        class="progress-bar"
        cx="50"
        cy="50"
        r="46"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="strokeOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "progress-circle",
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  computed: {
    strokeOffset() {
      return (1 - this.percent) * this.dashArray;
    }
  },
  created() {
    this.dashArray = Math.PI * 100;
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.progress-circle {
  position: relative;
  font-size: 0;
  circle {
    stroke-width: 4px;
    transform-origin: center center 0;
    &.progress-background {
      stroke: @color-theme-d;
    }
    &.progress-bar {
      stroke: @color-theme;
      transform: rotate(-90deg);
      position: absolute;
      // 层级需要高于slot(svg内的图案默认层级最高、、、好像是这样)
      z-index: 1;
    }
  }
}
</style>