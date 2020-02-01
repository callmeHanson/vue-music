<template>
  <transition name="slide">
    <div class="add-song" @click.stop v-show="showFlag">
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <span class="close" @click="hide">
          <i class="icon-close"></i>
        </span>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll
            v-show="currentIndex === 0"
            ref="songList"
            class="list-scroll"
            :data="playHistory"
          >
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll
            ref="searchList"
            v-show="currentIndex === 1"
            class="list-scroll"
            :data="searchHistory"
            :refreshDelay="refreshDelay"
          >
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectItem"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌已添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>
<script>
import SearchBox from "base/search-box/search-box";
import Switches from "base/switches/switches";
import Suggest from "components/suggest/suggest";
import { searchMixin } from "common/js/mixin";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import { mapGetters, mapActions } from "vuex";
import Song from "common/js/song";
import SearchList from "base/search-list/search-list";
import TopTip from "base/top-tip/top-tip";

export default {
  mixins: [searchMixin],
  name: "add-song",
  data() {
    return {
      showFlag: false,
      currentIndex: 0
    };
  },
  computed: {
    ...mapGetters(["playHistory", "searchHistory"])
  },
  created() {
    this.showSinger = false;
    this.switches = [{ name: "最近播放" }, { name: "搜索历史" }];
  },
  methods: {
    show() {
      this.showFlag = true;
      this.refreshList();
    },
    refreshList() {
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs["songList"].refresh();
        } else {
          this.$refs["searchList"].refresh();
        }
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    selectItem() {
      this.saveSearch(this.query);
      this.$refs["topTip"].show();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(item) {
      this.insertSong(new Song(item));
      this.$refs["topTip"].show();
    },

    ...mapActions(["insertSong"])
  },
  components: {
    SearchBox,
    Switches,
    Suggest,
    Scroll,
    SongList,
    SearchList,
    TopTip
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.add-song {
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
  // z-index: 200;
  .header {
    position: relative;
    .title {
      line-height: 44px;
      font-size: @font-size-large;
      color: @color-text;
      text-align: center;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      [class^="icon-"] {
        display: block;
        font-size: 20px;
        padding: 12px;
      }
    }
  }
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut {
    .list-wrapper {
      position: fixed;
      bottom: 0;
      top: 165px;
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
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .top-tip {
    padding: 18px 0;
    text-align: center;
    font-size: 0;
    [class^="icon-"] {
      color: @color-theme;
      font-size: @font-size-medium;
      margin-right: 4px;
    }
    .text {
      color: @color-text;
      font-size: @font-size-medium;
    }
  }
}
</style>