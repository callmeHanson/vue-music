<template>
  <ul class="switches">
    <li
      @click="switchItem(index)"
      class="switch-item"
      :class="{'active': currentIndex === index}"
      v-for="(item,index) in switches"
      :key="index"
      v-text="item.name"
    ></li>
  </ul>
</template>
<script>
export default {
  name: "switches",
  props: {
    switches: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    switchItem(index) {
      this.$emit("switch", index);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.switches {
  width: 240px;
  margin: 0 auto;
  border: 1px solid @color-highlight-background;
  border-radius: 5px;
  display: flex;
  align-items: center;
  .switch-item {
    flex: 1;
    padding: 8px;
    color: @color-text-d;
    font-size: @font-size-medium;
    text-align: center;
    &.active {
      background: @color-highlight-background;
      color: @color-text;
    }
  }
}
</style>