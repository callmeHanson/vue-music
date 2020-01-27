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
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    listenScroll: {
      type: Boolean,
      default: false
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
      }, 20);
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