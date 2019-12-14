<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item,index) in dots"
        :key="index"
        :class="{active: index === currentPageIndex}"
      ></span>
    </div>
  </div>
</template>
<script>
import { addClass, hasClass } from "common/js/dom";
import BetterScroll from "better-scroll";

export default {
  name: "slider",
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interVal: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      slider: null,
      dots: [],
      currentPageIndex: 0,
      timer: null
    };
  },
  mounted() {
    // 浏览器的刷新频率是17ms(保证可以正确拿到dom渲染后的宽高)
    setTimeout(() => {
      this._initSliderWidth();
      this._initDots();
      this._initSlider();
      if (this.autoPlay) this._play();
    }, 17);

    window.addEventListener('resize', () => {
      if (!this.slider) return
      this._initSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _initSliderWidth(isResize) {
      const slider = this.$refs.slider;
      const sliderWidth = slider.clientWidth;
      const sliderGroup = this.$refs.sliderGroup;
      this.children = sliderGroup.children;
      let width = 0;

      for (let i = 0; i < this.children.length; i++) {
        if (!hasClass(this.children[i], "slider-item")) {
          addClass(this.children[i], "slider-item");
        }
        this.children[i].style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      sliderGroup.style.width = width + "px";
    },

    _initDots() {
      this.dots = new Array(this.children.length);
    },

    _initSlider() {
      this.slider = new BetterScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momenutum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        // 支持点击事件（slider监听了点击事件，但是未做派发）
        click: true
      });
      this.slider.on("scrollEnd", () => {
        this.currentPageIndex = this.slider.getCurrentPage().pageX;
        if (this.autoPlay) this._play();
      });
    },

    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interVal);
    }
  },
  destroyed() {
    // 清除定时器
    clearTimeout(this.timer)
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.slider {
  overflow: hidden;
  position: relative;
  .slider-group {
    overflow: hidden;
    .slider-item {
      float: left;
      a {
        display: block;
        width: 100%;
        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
  .dots {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    // display: flex;
    // justify-content: center;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 4px;
      border-radius: 50%;
      background-color: @color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background-color: @color-text-ll;
      }
    }
  }
}
</style>