<template>
  <div class="player" v-if="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="sub-title" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <!-- 固定位置 -->
            <div class="cd-wrapper" ref="cdWrapper">
              <!-- 控制显示范围 -->
              <div class="cd">
                <img class="image" :class="cdCls" :src="currentSong.image" alt />
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time i-left">{{format(currentTime)}}</span>
            <progress-bar @percentChange="onProgressBarChange" class="progress" :percent="percent"></progress-bar>
            <span class="time i-right">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-right">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="iconPlay"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img
            class="mini-image"
            :class="cdCls"
            width="40px"
            height="40px"
            :src="currentSong.image"
            alt
          />
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniPlay"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <audio
      ref="audio"
      @canplay="ready"
      @error="error"
      @ended="end"
      @timeupdate="updateTime"
      :src="currentSong.url"
    ></audio>
  </div>
</template>
<script>
import * as types from "store/mutation-types";
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "common/js/dom";
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";

const transform = prefixStyle("transfrom");

export default {
  name: "player",
  data() {
    return {
      songReady: false,
      currentTime: 0
    };
  },
  computed: {
    iconPlay() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniPlay() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdCls() {
      return this.playing ? "play" : "pause";
    },
    disableCls() {
      return this.songReady ? "" : "disabled";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    iconMode() {
      switch (this.mode) {
        case playMode.sequence:
          return "icon-sequence";
        case playMode.loop:
          return "icon-loop";
        case playMode.random:
          return "icon-random";
      }
    },
    ...mapGetters([
      "playing",
      "mode",
      "fullScreen",
      "sequenceList",
      "playList",
      "currentIndex",
      "currentSong"
    ])
  },

  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) return;

      this.songReady = false;
      // src数据来了，要等audio标签准备好
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },

    playing(newPlaying) {
      if (!this.songReady) return;

      const audio = this.$refs["audio"];
      newPlaying ? audio.play() : audio.pause();
      // this.$nextTick(() => {
      // });
    }
  },

  created() {
    this.radius = 30;
  },

  mounted() {},

  methods: {
    back() {
      this.setFullScreen(false);
    },

    open() {
      this.setFullScreen(true);
    },

    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });

      animations.runAnimation(this.$refs["cdWrapper"], "move", done);
    },

    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs["cdWrapper"].style.animation = "";
    },

    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      this.$refs["cdWrapper"].style.transition = "all 0.4s";
      this.$refs["cdWrapper"].style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

      // transitionend事件可能不触发
      const timer = setTimeout(done, 400);
      this.$refs["cdWrapper"].addEventListener("transitionend", () => {
        clearTimeout(timer);
        done();
      });
    },

    afterLeave(el) {
      this.$refs["cdWrapper"].style.transition = "";
      this.$refs["cdWrapper"].style[transform] = "";
    },

    togglePlaying() {
      if (!this.songReady) return;

      this.setPlayingState(!this.playing);
    },

    prev() {
      if (!this.songReady) return;
      if (this.playList.length === 1) {
        this.loop();
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      this.songReady = false;
      if (!this.playing) {
        this.togglePlaying();
      }
    },

    next() {
      if (!this.songReady) return;
      if (this.playList.length === 1) {
        this.loop();
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playList.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      this.songReady = false;
      if (!this.playing) {
        this.togglePlaying();
      }
    },

    ready() {
      this.songReady = true;
    },

    error() {
      this.songReady = true;
    },

    end() {
      this.currentTime = 0;
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },

    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },

    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },

    format(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },

    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      this.$refs["audio"].currentTime = this.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
    },

    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setMode(mode);
      let list = [];
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }

      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },

    resetCurrentIndex(list) {
      const idx = list.findIndex(item => item.id === this.currentSong.id);
      this.setCurrentIndex(idx);
    },

    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },

    _getPosAndScale() {
      // 以左下角为原点
      const miniWidth = 40;
      const miniPaddingLeft = 20;
      const miniPaddingBottom = 10;
      const miniX = miniPaddingLeft + miniWidth / 2;
      const miniY = -(miniPaddingBottom + miniWidth / 2);

      const maxWidth = (window.innerWidth * 0.8) / 2;
      const maxPaddingTop = 80;
      const maxX = window.innerWidth / 2;
      const maxY = -(window.innerHeight - maxPaddingTop - maxWidth);
      const deltaX = miniX - maxX;
      const deltaY = miniY - maxY;
      const deltaScale = miniWidth / maxWidth;

      return {
        x: deltaX,
        y: deltaY,
        scale: deltaScale
      };
    },

    ...mapMutations({
      setFullScreen: types.SET_FULLSCREEN,
      setPlayingState: types.SET_PLAYING_STATE,
      setCurrentIndex: types.SET_CURRENT_INDEX,
      setMode: types.SET_MODE,
      setPlayList: types.SET_PLAYLIST
    })
  },
  components: { ProgressBar, ProgressCircle }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.player {
  .normal-player {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 150;
    background: @color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      filter: blur(20px);
      opacity: 0.6;
      z-index: -1;
    }
    .top {
      position: relative;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 10px;
          font-size: @font-size-large-x;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 80%;
        margin: 0 auto;
        line-height: 40px;
        font-size: @font-size-large;
        color: @color-text;
        text-align: center;
        .no-wrap();
      }
      .sub-title {
        line-height: 20px;
        font-size: @font-size-medium;
        color: @color-text;
        text-align: center;
        width: 100%;
        .no-wrap();
      }
    }
    .middle {
      position: fixed;
      top: 80px;
      left: 0;
      width: 100%;
      .middle-l {
        top: 0;
        width: 100%;
        height: 0;
        padding-top: 80%;
        position: relative;
        .cd-wrapper {
          position: absolute;
          height: 100%;
          top: 0;
          left: 10%;
          width: 80%;
          .image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: block;
            animation: rotate 20s linear infinite;
            &.play {
              animation-play-state: running;
            }
            &.pause {
              animation-play-state: paused;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .progress-wrapper {
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        display: flex;
        align-items: center;
        .time {
          flex: 0 0 30px;
          width: 30px;
          font-size: @font-size-small;
          line-height: 30px;
          color: @color-text;
          &.i-left {
            text-align: left;
          }
          &.i-right {
            text-align: right;
          }
        }
        .progress {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: @color-theme;
          font-size: 30px;
          .icon-play {
            font-size: 40px;
          }
          &.i-left {
            text-align: left;
          }
          &.i-right {
            text-align: right;
          }
          &.i-center {
            text-align: center;
            padding: 0 20px;
            i {
              font-size: 40px;
            }
          }
          &.disabled {
            color: @color-theme-d;
          }
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: @color-highlight-background;
    z-index: 160;
    display: flex;
    align-items: center;
    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      .mini-image {
        border-radius: 50%;
        animation: rotate 20s linear infinite;
        &.play {
          animation-play-state: running;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        font-size: @font-size-medium;
        color: @color-text;
        .no-wrap();
      }
      .desc {
        font-size: @font-size-small;
        color: @color-text-d;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-mini {
        font-size: 30px;
        position: absolute;
        left: 0;
        top: 0;
        color: @color-theme-d;
      }
      .icon-playlist {
        font-size: 30px;
      }
    }
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
