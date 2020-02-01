<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="title" v-text="text"></p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left" v-text="cancelBtnText"></div>
            <div @click="confirm" class="operate-btn" v-text="confirmBtnText"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "confirm",
  props: {
    text: {
      type: String,
      default: ""
    },
    confirmBtnText: {
      type: String,
      default: "确定"
    },
    cancelBtnText: {
      type: String,
      default: "取消"
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    confirm() {
      this.hide();
      this.$emit("confirm");
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.confirm {
  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;
    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }
  &.confirm-fade-enter,
  &.confirm-fade-leave-to {
  }
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: @color-background-d;
  .confirm-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: @color-highlight-background;
      .title {
        font-size: @font-size-large;
        color: @color-text-l;
        padding: 20px 15px;
        text-align: center;
      }
      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        color: @color-text-d;
        font-size: @font-size-large;
        line-height: 22px;
        .operate-btn {
          flex: 1;
          padding: 10px 0;
          border-top: 1px solid @color-background-d;
          &.left {
            border-right: 1px solid @color-background-d;
          }
        }
      }
    }
  }
  @keyframes confirm-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes confirm-zoom {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>