<template>
  <transition name="slide">
    <div class="user-center" ref="userCenter">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="selectSwitch"></switches>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" v-show="!noResult">
        <scroll
          ref="favoriteList"
          v-show="currentIndex === 0"
          class="list-scroll"
          :data="favoriteList"
        >
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" v-show="currentIndex === 1" class="list-scroll" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>
<script>
import Switches from "base/switches/switches";
import NoResult from "base/no-result/no-result";
import { mapGetters, mapActions } from "vuex";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import Song from "common/js/song";
import { playlistMixin } from "common/js/mixin";

export default {
  mixins: [playlistMixin],
  name: "user-center",
  data() {
    return {
      currentIndex: 0
    };
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return "暂无收藏歌曲";
      } else {
        return "您还没有听过歌曲";
      }
    },

    ...mapGetters(["favoriteList", "playHistory"])
  },
  created() {
    this.switches = [{ name: "我喜欢的" }, { name: "最近听的" }];
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    selectSwitch(index) {
      this.currentIndex = index;
    },
    selectSong(song) {
      this.insertSong(new Song(song));
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      if (!list.length) return;

      list = list.map(song => new Song(song));
      this.randomPlay({
        list
      });
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs["userCenter"].style.bottom = bottom;
      // bs 视口DOM发生变化，需要重新计算
      if (this.currentIndex === 0) {
        this.$refs["favoriteList"].refresh();
      } else {
        this.$refs["playList"].refresh();
      }
    },

    ...mapActions(["insertSong", "randomPlay"])
  },
  components: {
    Switches,
    NoResult,
    Scroll,
    SongList
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  background: @color-background;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .back {
    position: absolute;
    left: 6px;
    top: 0;
    [class^="icon-"] {
      display: block;
      padding: 10px;
      font-size: @font-size-large-x;
    }
  }
  .switches-wrapper {
    margin: 10px auto 30px;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    margin: 0 auto;
    padding: 7px 0;
    border-radius: 100px;
    border: 1px solid @color-text-l;
    color: @color-text-l;
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
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    left: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>