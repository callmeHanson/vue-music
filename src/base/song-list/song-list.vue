<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, $index)"
        class="item"
        v-for="(song, $index) in songs"
        :key="$index"
      >
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "song-list",
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },

  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },

    selectItem(song, $index) {
      this.$emit("select", song, $index);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.song-list {
  .item {
    height: 64px;
    display: flex;
    align-items: center;
    font-size: @font-size-medium;
    .content {
      flex: 1;
      overflow: hidden;
    }
    .name {
      line-height: 20px;
      color: @color-text;
      .no-wrap();
    }
    .desc {
      margin-top: 4px;
      line-height: 20px;
      color: @color-text-d;
      .no-wrap();
    }
  }
}
</style>