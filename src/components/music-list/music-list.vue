<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div ref="playBtn" class="play-wrapper" v-show="songs.length > 0">
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      @scroll="scroll"
      :data="songs"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
import { prefixStyle } from "common/js/dom";
import Loading from "base/loading/loading";

const RESERVED_HEIGHT = 40;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  name: "music-list",
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    bgImage: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      probeType: 3,
      listenScroll: true,
      scrollY: 0
    };
  },

  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`;
    }
  },

  watch: {
    scrollY: {
      handler(val, old) {
        // 向上滚动的判断
        const diff = this.imageHeight - RESERVED_HEIGHT;
        let translateY = Math.max(-diff, val);
        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;

        let scale = 1;
        let zIndex = 0;
        let blur = 0;

        const percent = Math.abs(val / this.imageHeight);
        if (val > 0) {
          scale += percent;
          zIndex = 10;
        } else {
          blur = Math.min(20 * percent, 20);
        }

        // 高斯模糊
        this.$refs.bgImage.style[backdrop] = `blur(${blur}px)`;

        if (val < -diff) {
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = "40px";
          this.$refs["playBtn"].style.display = "none";
          zIndex = 1;
        } else {
          this.$refs.bgImage.style.paddingTop = "70%";
          this.$refs.bgImage.style.height = 0;
          this.$refs["playBtn"].style.display = "block";
        }

        this.$refs.bgImage.style.zIndex = zIndex;
        this.$refs.bgImage.style[transform] = `scale(${scale})`;
      }
    }
  },

  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.$refs["list"].$el.style.top = `${this.imageHeight}px`;
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    scroll(pos) {
      let { y } = pos;
      this.scrollY = y;
    }
  },

  components: { SongList, Scroll, Loading }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.music-list {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: @color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: @font-size-large-x;
    }
  }
  .title {
    position: absolute;
    left: 10%;
    z-index: 40;
    width: 80%;
    line-height: 40px;
    font-size: @font-size-large;
    color: @color-text;
    text-align: center;
    .no-wrap();
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    background-size: cover;
    background-repeat: no-repeat;
    transform-origin: top;
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      width: 100%;
      z-index: 1;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        margin: 0 auto;
        padding: 7px 0;
        border-radius: 100px;
        border: 1px solid @color-theme;
        font-size: 0;
        text-align: center;
        .icon-play {
          font-size: @font-size-medium-x;
          vertical-align: middle;
          margin-right: 6px;
        }
        .text {
          font-size: @font-size-small;
          vertical-align: middle;
        }
      }
    }
    .filter {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: @color-background;
  }
  .list {
    position: absolute;
    width: 100%;
    top: 0;
    // right: 0;
    bottom: 0;
    // left: 0;
    background: @color-background;
    // overflow-x: hidden;
    // overflow-y: auto;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translate3d(0, -50%, 0)
    }
  }
}
</style>