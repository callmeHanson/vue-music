<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">Music</div>
    <router-link to="/user" class="user" tag="div">
      <i class="icon-mine"></i>
    </router-link>
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
@import "~@/common/less/variable";

.m-header {
  text-align: center;
  position: relative;
  font-size: 0;
  color: @color-theme;
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
    font-size: @font-size-large;
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