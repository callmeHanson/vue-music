<template>
  <div class="tab">
    <router-link class="tab-item" tag="div" to="/recommend">
      <span>推荐</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/singer">
      <span>歌手</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/rank">
      <span>排行</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/search">
      <span>搜索</span>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "tab",
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
@import "~@/common/less/variable";

.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: @font-size-medium;
  .tab-item {
    flex: 1;
    text-align: center;
    > span {
      padding-bottom: 5px;
      border-bottom: 2px solid transparent;
      color: @color-text-l;
    }
    &.router-link-active {
      span {
        border-bottom-color: @color-theme;
        color: @color-theme;
      }
    }
  }
}
</style>