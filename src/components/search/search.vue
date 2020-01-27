<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hotKey">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="item in hotKey" :key="item.n">
              <span v-text="item.k"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchBox from "base/search-box/search-box";
import { getHotKey } from "api/search";
import { ERR_OK } from "api/config";

export default {
  name: "search",
  components: { SearchBox },
  data() {
    return {
      hotKey: []
    };
  },
  created() {
    this._getHotKey();
  },
  methods: {
    addQuery(query) {
      this.$refs["searchBox"].setQuery(query)
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

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
    }
  }
}
</style>