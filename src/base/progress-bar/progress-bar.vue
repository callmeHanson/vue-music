<template>
  <div class="progress-bar" ref="progress-bar">
    <div class="bar-inner" @click="progressClick">
      <div class="progress" ref="progress"></div>
      <div
        @touchstart.prevent="progressTouchstart"
        @touchmove.prevent="progressTouchmove"
        @touchend="progressTouchend"
        class="progress-btn-wrapper"
        ref="progress-btn"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { prefixStyle } from "common/js/dom";

const progressBtnWidth = 16;
const transform = prefixStyle("transform");

export default {
  name: "progress-bar",
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  watch: {
    percent(percent, old) {
      this.setProgressOffset(percent);
    }
  },

  created() {
    this.touch = {};
  },

  methods: {
    progressTouchstart(e) {
      this.touch.initiated = true;
      this.touch.left = this.$refs["progress"].clientWidth;
      this.touch.startX = e.touches[0].pageX;
    },

    progressTouchmove(e) {
      if (!this.touch.initiated) return;

      const delta = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        Math.max(0, this.touch.left + delta),
        this.$refs["progress-bar"].clientWidth - progressBtnWidth
      );

      this._offset(offsetWidth);
    },

    progressTouchend() {
      this._triggerPercent();
      this.touch.initiated = false;
    },

    progressClick(e) {
      const rect = this.$refs["progress"].getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;

      this._offset(offsetWidth);
      this._triggerPercent();
    },

    setProgressOffset(percent) {
      if (percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs["progress-bar"].clientWidth - progressBtnWidth;
        const offsetWidth = barWidth * percent;

        this._offset(offsetWidth);
      }
    },

    _triggerPercent() {
      this.$emit("percentChange", this._getPercent());
    },

    _getPercent() {
      const barWidth = this.$refs["progress-bar"].clientWidth - progressBtnWidth;
      return this.$refs["progress"].clientWidth / barWidth;
    },

    _offset(offsetWidth) {
      const progress = this.$refs["progress"];
      const progressBtn = this.$refs["progress-btn"];
      progress.style.width = `${offsetWidth}px`;
      progressBtn.style[transform] = `translate3d(${offsetWidth}px ,0, 0)`;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

@height-progress: 30px;
@height-progress-inner: 4px;
@width-bar: 16px;

.progress-bar {
  height: @height-progress;
  .bar-inner {
    position: relative;
    height: @height-progress-inner;
    top: 50%;
    transform: translateY(-50%);
    background: @color-background-d;
    .progress {
      position: absolute;
      height: 100%;
      width: 0;
      background: @color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      width: @height-progress;
      height: @height-progress;
      top: -(@height-progress - @height-progress-inner) / 2;
      left: -(@height-progress - @width-bar) / 2;
      .progress-btn {
        position: relative;
        width: @width-bar;
        height: @width-bar;
        box-sizing: border-box;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 3px solid @color-text;
        border-radius: 50%;
        background: @color-theme;
      }
    }
  }
}
</style>