<template>
  <transition name="list-fade">
    <div @click="hide" class="playlist" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <div class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text" v-text="modeText"></span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </div>
        </div>
        <scroll :refreshDelay="refreshDelay" ref="listContent" :data="sequenceList" class="list-content">
          <transition-group tag="ul" name="list">
            <li
              @click="selectItem(item,index)"
              class="list-item"
              ref="listItem"
              v-for="(item, index) in sequenceList"
              :key="item.id"
            >
              <i class="icon" :class="getCurrentIcon(item)"></i>
              <span class="text" v-text="item.name"></span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="confirmClear"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>
<script>
import Scroll from "base/scroll/scroll";
import { mapGetters, mapMutations, mapActions } from "vuex";
import * as types from "store/mutation-types";
import { playMode } from "common/js/config";
import Confirm from "base/confirm/confirm";
import { playerMixin } from "common/js/mixin";
import AddSong from "components/add-song/add-song";

export default {
  mixins: [playerMixin],
  name: "playlist",
  data() {
    return {
      showFlag: false
    };
  },
  computed: {
    modeText() {
      switch (this.mode) {
        case playMode.sequence:
          return "顺序播放";
        case playMode.loop:
          return "循环播放";
        case playMode.random:
          return "随机播放";
        default:
          return "";
      }
    },
    ...mapGetters(["playList"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) return;

      this.scrollToCurrent(newSong);
    }
  },
  created() {
    this.refreshDelay = 100
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        // 列表更新了，但是dom未显示，没有办法调用refresh
        this.$refs["listContent"].refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "icon-play";
      }
      return "";
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex(song => song.id === item.id);
      }
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => song.id === current.id);
      this.$refs["listContent"].scrollToElement(this.$refs["listItem"][index], 300);
    },
    deleteOne(item) {
      this.deleteSong(item);
    },
    showConfirm() {
      this.$refs["confirm"].show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    addSong() {
      this.$refs["addSong"].show()
    },

    ...mapMutations({
      setCurrentIndex: types.SET_CURRENT_INDEX,
      setPlayingState: types.SET_PLAYING_STATE
    }),
    ...mapActions(["deleteSong", "deleteSongList"])
  },
  components: { Scroll, Confirm, AddSong }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.playlist {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: @color-background-d;
  z-index: 200;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    background: @color-highlight-background;
    .list-header {
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          font-size: 30px;
          margin-right: 10px;
        }
        .text {
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
        .clear {
          font-size: 0;
          .extend-click();
          [class^="icon-"] {
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .list-item {
        height: 40px;
        padding: 0 30px 0 20px;
        display: flex;
        align-items: center;
        overflow: hidden;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s linear;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
        .icon {
          font-size: @font-size-small;
          color: @color-theme-d;
          width: 20px;
        }
        .text {
          font-size: @font-size-medium;
          color: @color-text-d;
          flex: 1;
          .no-wrap();
        }
        .like {
          font-size: @font-size-small;
          margin-right: 15px;
          .icon-favorite {
            color: @color-sub-theme;
          }
        }
        .delete {
          font-size: @font-size-small;
        }
      }
    }
    .list-operate {
      width: 140px;
      margin: 20px auto 30px;
      .add {
        padding: 8px 16px;
        border: 1px solid @color-text-l;
        border-radius: 100px;
        display: flex;
        align-items: center;
        color: @color-text-l;
        [class^="icon-"] {
          font-size: 10px;
          margin-right: 5px;
        }
        .text {
          font-size: @font-size-small;
        }
      }
    }
    .list-close {
      font-size: @font-size-medium-x;
      color: @color-text-l;
      background: @color-background;
      line-height: 50px;
      text-align: center;
    }
  }
}
</style>