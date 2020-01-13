<template>
  <scroll
    @scroll="scroll"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    :data="data"
    class="listview"
    ref="listview"
  >
    <ul>
      <li class="list-group" v-for="(group,$index) in data" :key="$index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items" :key="item.id">
            <img v-lazy="item.avatar" alt class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item,$index) in shortcutList"
          :data-index="$index"
          :key="$index"
          class="item"
          :class="{'current': $index === currentIndex}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </scroll>
</template>
<script>
import Scroll from "base/scroll/scroll";
import { getData } from "common/js/dom";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  name: "listview",
  components: { Scroll },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },

  computed: {
    shortcutList() {
      return this.data.map(item => item.title.substr(0, 1));
    },

    fixedTitle() {
      if (this.scrollY > 0) return "";
      const data = this.data[this.currentIndex];
      return data ? data.title : "";
    }
  },

  watch: {
    data: {
      handler(val, old) {
        setTimeout(() => {
          this._calculateHeight();
        }, 20);
      }
    },
    scrollY: {
      handler(val, old) {
        const listHeight = this.listHeight;
        // 滚动到上边缘以上
        if (val > 0) {
          this.currentIndex = 0;
          return;
        }
        // 滚动中间区域
        for (let i = 0; i < listHeight.length - 1; i++) {
          const height1 = listHeight[i];
          const height2 = listHeight[i + 1];
          if (-val >= height1 && -val < height2) {
            this.currentIndex = i;
            this.diff = height2 + val;
            return;
          }
        }
        // 滚动到下边缘以下
        this.currentIndex = listHeight.length - 2;
      }
    },

    diff: {
      handler(val, old) {
        let fixedTop = val > 0 && val < TITLE_HEIGHT ? val - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) return;
        this.fixedTop = fixedTop;
        // 开启GPU加速，没有意义的DOM操作需要限制频率
        this.$refs["fixed"].style.transform = `translate3d(0, ${fixedTop}px, 0)`;
      }
    }
  },

  created() {
    this.probeType = 3;
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
  },

  methods: {
    onShortcutTouchStart(e) {
      const firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      const anchorIndex = getData(e.target, "index");
      this.touch.anchorIndex = anchorIndex;

      this._scrollTo(anchorIndex);
    },

    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY;
      const delta = parseInt((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT);
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;

      this._scrollTo(anchorIndex);
    },

    scroll(pos) {
      const { y } = pos;
      this.scrollY = y;
    },

    selectItem(item) {
      this.$emit('select', item)
    },

    _scrollTo(index) {
      if (index === null) return;

      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }

      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },

    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs["listGroup"];
      let height = 0;
      this.listHeight.push(0);
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .list-group {
    color: @color-text-l;
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      background-color: @color-highlight-background;
      font-size: @font-size-small;
    }
    .list-group-item {
      padding: 20px 0 0 30px;
      display: flex;
      align-items: center;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        flex: 0 0 50px;
      }
      .name {
        margin-left: 20px;
        font-size: @font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    background-color: @color-background-d;
    text-align: center;
    font-size: @font-size-small;
    color: @color-text-l;
    .item {
      &.current {
        color: @color-theme;
      }
      padding: 3px;
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background-color: @color-highlight-background;
    }
  }
}
</style>