<template>
  <scroll
    class="suggest"
    ref="suggest"
    :data="suggestList"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listenScroll"
  >
    <ul class="suggest-list">
      <loading v-show="loading" title></loading>
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item,index) in suggestList"
        :key="index"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-text="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !suggestList.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script>
import { search } from "api/search";
import { ERR_OK } from "api/config";
import Scroll from "base/scroll/scroll";
import { createSong, processSongsUrl } from "common/js/song";
import Loading from "base/loading/loading";
import NoResult from "base/no-result/no-result";
import { mapMutations, mapActions } from "vuex";
import * as types from "store/mutation-types";
import Singer from "common/js/singer";

const TYPE_SINGER = 2;
const PER_PAGE = 20;

export default {
  name: "suggest",
  components: { Scroll, Loading, NoResult },
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      suggestList: [],
      loading: false
    };
  },
  watch: {
    query(newQuery, query) {
      this._search();
    }
  },
  created() {
    this.hasMore = true;
    this.page = 1;
    this.pullup = true;
    this.pulldown = true;
    this.beforeScroll = true;
  },
  methods: {
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    searchMore(pos) {
      if (!this.hasMore) return;

      this.page++;
      search(this.query, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          this.suggestList = this.suggestList.concat(this._getResult(res.data));
          this._checkMore(res.data);
        }
      });
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit("select", item);
    },
    reSearch(pos) {
      this.page = 1;
      this.loading = true;
      this.$refs["suggest"].scrollTo(0, 0);
      search(this.query, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          this.loading = false;
          this.suggestList = this._getResult(res.data);
          this._checkMore(res.data);
        }
      });
    },
    listenScroll(pos) {
      this.$emit("listenScroll", pos);
    },
    _search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs["suggest"].scrollTo(0, 0);
      search(this.query, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          this._getResult(res.data).then(songs => {
            this.suggestList = songs;
          });
          this._checkMore(res.data);
        }
      });
    },
    _getResult(data) {
      let ret = [];
      const { song, zhida } = data;
      if (zhida && zhida.singerid && this.page === 1) {
        ret.push(zhida);
      }
      return processSongsUrl(this._normalizeSong(song.list)).then(songs => {
        ret = ret.concat(songs);
        return ret;
      });
    },
    _normalizeSong(list) {
      let ret = [];
      list.forEach(item => {
        ret.push(createSong(item));
      });
      return ret;
    },
    _checkMore(data) {
      const { song } = data;
      if (song.list.length === 0 || song.curnum + (song.curpage - 1) * PER_PAGE >= song.totalnum) {
        this.hasMore = false;
      }
    },
    _refresh() {
      this.$refs["suggest"].refresh();
    },

    ...mapMutations({
      setSinger: types.SET_SINGER
    }),
    ...mapActions(["insertSong"])
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.suggest {
  height: 100%;
  overflow: hidden;
  position: relative;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      padding-bottom: 20px;
      align-items: center;
      font-size: @font-size-medium;
      color: @color-text-d;
      .icon {
        width: 30px;
        flex: 0 0 30px;
        [class^="icon-"] {
        }
      }
      .name {
        flex: 1;
        overflow: hidden;
        .text {
          .no-wrap();
        }
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