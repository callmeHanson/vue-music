<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, $index)"
        class="item"
        v-for="(song, $index) in songs"
        :key="$index"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankCls($index)" v-text="getRankText($index)"></span>
        </div>
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
    },
    rank: {
      type: Boolean,
      default: false
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
    },

    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },

    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
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
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: contain;
        background-repeat: no-repeat;
        &.icon0 {
          .bg-image("first");
        }
        &.icon1 {
          .bg-image("second");
        }
        &.icon2 {
          .bg-image("third");
        }
      }
      .text {
        color: @color-theme;
        font-size: @font-size-large;
      }
    }
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