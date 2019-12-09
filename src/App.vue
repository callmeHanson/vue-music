<template>
  <div id="app">
    <m-header></m-header>
  </div>
</template>

<script>
import MHeader from '@/components/m-header/m-header';

export default {
  name: 'App',
  components: { MHeader }
};
</script>

<style lang="less">
@import "~@/common/less/variable.less";

#app {
  color: @color-theme;
}
</style>
