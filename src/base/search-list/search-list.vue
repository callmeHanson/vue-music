<template>
  <div class="search-list">
    <transition-group tag="ul" name="list">
      <li
        @click="selectItem(item)"
        class="search-item"
        v-for="item in searches"
        :key="item"
      >
        <span class="text" v-text="item"></span>
        <span @click.stop="deleteOne(item)" class="delete">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>
<script>
export default {
  name: "search-list",
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    deleteOne(item) {
      this.$emit("delete", item);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.search-list {
  .search-item {
    display: flex;
    height: 40px;
    align-items: center;
    &.list-enter-active,&.list-leave-active {
      transition: all 0.1s;
    }
    &.list-enter,&.list-leave-to {
      height: 0;
    }
    .text {
      flex: 1;
      font-size: @font-size-medium;
      color: @color-text-l;
    }
    .delete {
      font-size: 0;
      .extend-click();
      .icon-delete {
        font-size: @font-size-small;
        color: @color-text-d;
      }
    }
  }
}
</style>