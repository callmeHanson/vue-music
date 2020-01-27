<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist" :data="topList">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item in topList" :key="item.topId">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" alt />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import { getTopList } from "api/rank";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { playlistMixin } from "common/js/mixin";
import TopList from "components/top-list/top-list";
import * as types from "store/mutation-types";
import { mapMutations } from "vuex";

export default {
  name: "rank",
  mixins: [playlistMixin],
  components: { Scroll, Loading, TopList },
  data() {
    return {
      topList: []
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs["rank"].style.bottom = bottom;
      this.$refs["toplist"].refresh();
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setTopList(item)
    },
    _getTopList() {
      getTopList().then(res => {
        this.topList = res.data.topList;
      });
    },

    ...mapMutations({
      setTopList: types.SET_TOP_LIST
    })
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist {
    position: relative;
    height: 100%;
    overflow: hidden;
    .item {
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      display: flex;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        background: @color-highlight-background;
        color: @color-text-d;
        font-size: @font-size-small;
        overflow: hidden;
        .song {
          line-height: 26px;
          .no-wrap();
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>