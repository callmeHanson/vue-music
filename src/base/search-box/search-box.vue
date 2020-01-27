<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input v-model="query" class="box" type="text" :placeholder="placeholder">
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>
<script>
export default {
  name: "search-box",
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  created() {
    this.$watch("query", (newQuery) => {
      this.$emit("query", newQuery)
    })
  },
  methods: {
    clear() {
      this.query = ""
    },
    setQuery(query) {
      this.query = query
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.search-box {
  background: @color-highlight-background;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: @color-background;
  }
  .box {
    flex: 1;
    line-height: 18px;
    margin: 0 5px;
    background: @color-highlight-background;
    outline: 0;
    font-size: @font-size-medium;
    color: @color-text;
  }
  .icon-dismiss {
    font-size: @font-size-medium-x;
    color: @color-background;
  }
}
</style>