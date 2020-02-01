<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" ref="shortcut" :data="shortcut" class="shortcut">
        <div>
          <div class="hotKey">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey" :key="item.n">
                <span v-text="item.k"></span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="suggestWrapper" class="suggest-wrapper" v-show="query">
      <suggest
        ref="suggest"
        :query="query"
        :showSinger="showSinger"
        @listenScroll="blurInput"
        @select="saveSearch"
      ></suggest>
    </div>
    <confirm
      ref="confirm"
      :text="text"
      :confirmBtnText="confirmBtnText"
      :cancelBtnText="cancelBtnText"
      @confirm="clearSearchHistory"
    ></confirm>
    <router-view></router-view>
  </div>
</template>
<script>
import SearchBox from "base/search-box/search-box";
import { getHotKey } from "api/search";
import { ERR_OK } from "api/config";
import Suggest from "components/suggest/suggest";
import { playlistMixin, searchMixin } from "common/js/mixin";
import { mapGetters, mapActions } from "vuex";
import SearchList from "base/search-list/search-list";
import Confirm from "base/confirm/confirm";
import Scroll from "base/scroll/scroll";

export default {
  mixins: [playlistMixin, searchMixin],
  name: "search",
  components: { SearchBox, Suggest, SearchList, Confirm, Scroll },
  data() {
    return {
      hotKey: []
    };
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    },
    ...mapGetters(["searchHistory"])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs["shortcut"].refresh();
        }, 20);
      }
    }
  },
  created() {
    this.showSinger = true;
    this.text = "是否清空所有搜索历史";
    this.confirmBtnText = "清空";
    this.cancelBtnText = "取消";
    this._getHotKey();
  },
  methods: {
    addQuery(query) {
      this.$refs["searchBox"].setQuery(query);
      this.query = query;
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs["suggestWrapper"].style.bottom = bottom;
      this.$refs["suggest"]._refresh();

      this.$refs["shortcutWrapper"].style.bottom = bottom;
      this.$refs["shortcut"].refresh();
    },
    deleteAll() {
      this.clearSearchHistory();
    },
    showConfirm() {
      this.$refs["confirm"].show();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },

    ...mapActions(["saveSearchHistory", "deleteSearchHistory", "clearSearchHistory"])
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.search {
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hotKey {
        margin: 0 20px 20px;
        font-size: @font-size-medium;
        .title {
          color: @color-text-l;
          margin-bottom: 20px;
        }
        .item {
          display: inline-block;
          margin: 0 20px 10px 0;
          background: @color-highlight-background;
          color: @color-text-d;
          border-radius: 6px;
          padding: 5px 10px;
        }
      }
      .search-history {
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          .text {
            flex: 1;
            color: @color-text-l;
            font-size: @font-size-medium;
          }
          .clear {
            font-size: 0;
            .extend-click();
            [class^="icon-"] {
              color: @color-text-d;
              font-size: @font-size-medium;
            }
          }
        }
      }
    }
  }
  .suggest-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    background: @color-background;
  }
}
</style>