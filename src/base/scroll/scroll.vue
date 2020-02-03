<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from "better-scroll";

export default {
  name: "scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => []
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    pulldown: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      scroll: null
    };
  },
  watch: {
    // 异步加载、异步更新不需要手动调用refresh()重新计算父子元素的宽高了
    data(val, old) {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.scroll) return;

      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.click
      });

      if (this.listenScroll) {
        const me = this;
        this.scroll.on("scroll", pos => {
          me.$emit("scroll", pos);
        });
      }

      if (this.pullup) {
        const me = this;
        this.scroll.on("scrollEnd", pos => {
          if (me.scroll.y <= me.scroll.maxScrollY + 50) {
            me.$emit("scrollToEnd", pos);
          }
        });
      }

      if (this.pulldown) {
        const me = this;
        this.scroll.on("scrollEnd", pos => {
          if (me.scroll.y >= 0) {
            me.$emit("scrollToTop", pos);
          }
        });
      }

      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", pos => {
          this.$emit("beforeScroll", pos);
        });
      }
    },

    enabel() {
      this.scroll && this.scroll.enabel();
    },

    disable() {
      this.scroll && this.scroll.disable();
    },

    refresh() {
      this.scroll && this.scroll.refresh();
    },

    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },

    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    }
  }
};
</script>
<style lang="less">
</style>