<template>
  <transition name="drop">
    <div @click.stop="hide" class="top-tip" v-show="showFlag">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
export default {
  name: "top-tip",
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hide();
        this.timer = null;
      }, 2000);
    },
    hide() {
      this.showFlag = false;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.top-tip {
  position: fixed;
  left: 0;
  width: 100%;
  top: 0;
  z-index: 500;
  background: @color-dialog-background;
  &.drop-enter-active,
  &.drop-leave-active {
    transition: all 0.3s;
  }
  &.drop-enter,
  &.drop-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>