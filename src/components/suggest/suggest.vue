<template>
  <scroll
    class="suggest"
    ref="suggest"
    :data="suggestList"
    :pullup="pullup"
    @scrollToEnd="searchMore"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in suggestList" :key="index">
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
import { createSong } from "common/js/song";
import Loading from "base/loading/loading";
import NoResult from "base/no-result/no-result";

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
      suggestList: []
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
    _search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs["suggest"].scrollTo(0, 0);
      search(this.query, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          this.suggestList = this._getResult(res.data);
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
      const songs = this._normalizeSong(song.list);
      ret = ret.concat(songs);
      return ret;
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
    }
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