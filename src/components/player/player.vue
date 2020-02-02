<template>
  <div class="player" v-show="playList.length">
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
        <div
          class="middle"
          @touchstart="middleTouchstart"
          @touchmove="middleTouchmove"
          @touchend="middleTouchend"
        >
          <div class="middle-l" ref="middleL">
            <!-- 固定位置 -->
            <div class="cd-wrapper" ref="cdWrapper">
              <!-- 控制显示范围 -->
              <div class="cd">
                <img class="image" :class="cdCls" :src="currentSong.image" alt />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{'current': currentLineNum === $index}"
                  v-for="(line,$index) in currentLyric.lines"
                  :key="$index"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time i-left">{{format(currentTime)}}</span>
            <progress-bar
              ref="progress-bar"
              @percentChange="onProgressBarChange"
              class="progress"
              :percent="percent"
            ></progress-bar>
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
              <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
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
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <playlist ref="playlist"></playlist>

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
import { mapGetters, mapMutations, mapActions } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "common/js/dom";
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import { playMode } from "common/js/config";
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";
import Playlist from "components/playlist/playlist";
import { playerMixin } from "common/js/mixin";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  mixins: [playerMixin],
  name: "player",
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: ""
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

    ...mapGetters(["playing", "fullScreen", "playList", "currentIndex"])
  },

  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) return;
      if (newSong.id === oldSong.id) return;

      this.songReady = false;
      // 清空原先播放歌词内的定时器
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      // src数据来了，要等audio标签准备好
      this.$nextTick(() => {
        this.$refs.audio.play();
        this.getLyric();
      });
    },

    playing(newPlaying) {
      if (!this.songReady) return;

      const audio = this.$refs["audio"];
      newPlaying ? audio.play() : audio.pause();
      // this.$nextTick(() => {
      // });
    },

    fullScreen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs["progress-bar"].setProgressOffset(this.percent);
        });
      }
    }
  },

  created() {
    this.radius = 30;
    this.touch = {};
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
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
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
      if (!this.playing) {
        this.togglePlaying();
      }
    },

    ready() {
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
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
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
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
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },

    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },

    handleLyric({ lineNum, txt }) {
      if (!this.$refs["lyricLine"]) return;

      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        const line = this.$refs["lyricLine"][lineNum - 5];
        this.$refs["lyricList"].scrollToElement(line, 1000);
      } else {
        this.$refs["lyricList"].scrollTo(0, 0, 1000);
      }

      this.playingLyric = txt;
    },

    middleTouchstart(e) {
      const touch = e.touches[0];
      this.touch.x = touch.pageX;
      this.touch.y = touch.pageY;
    },
    middleTouchmove(e) {
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.x;
      const deltaY = touch.pageY - this.touch.y;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      // 初始化的偏移位置
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      // 最终偏移量
      const offsetWidth = Math.min(0, Math.max(left + deltaX, -window.innerWidth));
      this.touch.percent = Math.abs(offsetWidth) / window.innerWidth;

      this.$refs["lyricList"].$el.style[transform] = `translate3d(${offsetWidth}px, 0 , 0)`;
      this.$refs["lyricList"].$el.style[transitionDuration] = 0;

      this.$refs["middleL"].style.opacity = 1 - this.touch.percent;
      this.$refs["middleL"].style[transitionDuration] = 0;
    },
    middleTouchend() {
      let offsetWidth, opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          opacity = 1;
          offsetWidth = 0;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          opacity = 1;
          this.currentShow = "cd";
        } else {
          opacity = 0;
          offsetWidth = -window.innerWidth;
        }
      }
      let time = 300;
      this.$refs["lyricList"].$el.style[transform] = `translate3d(${offsetWidth}px, 0 , 0)`;
      this.$refs["lyricList"].$el.style[transitionDuration] = `${time}ms`;

      this.$refs["middleL"].style.opacity = opacity;
      this.$refs["middleL"].style[transitionDuration] = `${time}ms`;
    },

    showPlaylist() {
      this.$refs["playlist"].show();
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

      const maxWidth = window.innerWidth * 0.8;
      const maxPaddingTop = 80;
      const maxX = window.innerWidth / 2;
      const maxY = -(window.innerHeight - maxPaddingTop - maxWidth / 2);
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
      setPlayingState: types.SET_PLAYING_STATE
    }),
    ...mapActions(["savePlayHistory"])
  },
  components: { ProgressBar, ProgressCircle, Scroll, Playlist }
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
      bottom: 170px;
      left: 0;
      width: 100%;
      font-size: 0;
      white-space: nowrap;
      .middle-l {
        top: 0;
        width: 100%;
        height: 0;
        padding-top: 80%;
        position: relative;
        display: inline-block;
        vertical-align: top;
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
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
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
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0;
          text-align: center;
          .playing-lyric {
            font-size: @font-size-medium;
            line-height: 20px;
            height: 20px;
            color: @color-text-l;
            .no-wrap();
          }
        }
      }
      .middle-r {
        width: 100%;
        height: 100%;
        display: inline-block;
        vertical-align: top;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          text-align: center;
          .text {
            line-height: 32px;
            font-size: @font-size-medium;
            color: @color-text-l;
            &.current {
              color: @color-text;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        font-size: 0;
        text-align: center;
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: @color-text-l;
          margin: 0 4px;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: @color-text-ll;
          }
        }
      }
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
          .icon-favorite {
            color: @color-sub-theme;
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
