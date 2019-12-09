<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">Music</div>
    <div class="user">
      <i class="icon-mine"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "m-header",
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
@import "~@/common/less/mixin";

.m-header {
  text-align: center;
  position: relative;
  .icon {
    display: inline-block;
    width: 30px;
    height: 32px;
    margin-top: 6px;
    margin-right: 9px;
    vertical-align: top;
    .bg-image("logo");
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    line-height: 44px;
  }
  .user {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20px;
    .icon-mine {
      display: block;
      padding: 12px;
    }
  }
}
</style>