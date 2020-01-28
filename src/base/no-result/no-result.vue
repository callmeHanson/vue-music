<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <div class="no-result-text" v-text="title"></div>
  </div>
</template>
<script>
export default {
  name: "no-result",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
    };
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.no-result {
  text-align: center;
  .no-result-icon {
    width: 86px;
    height: 90px;
    margin: 0 auto;
    background-size: contain;
    background-repeat: no-repeat;
    .bg-image("no-result");
  }
  .no-result-text {
    margin-top: 30px;
    font-size: @font-size-medium;
    color: @color-text-d;
  }
}
</style>