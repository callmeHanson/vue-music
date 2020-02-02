<template>
  <div class="top-list">
    <transition appear name="slide">
      <music-list :rank="rank" :songs="songs" :bg-image="bgImage" :title="title"></music-list>
    </transition>
  </div>
</template>
<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getMusicList } from "api/rank";
import { ERR_OK } from "api/config";
import { createSong, processSongsUrl } from "common/js/song";

export default {
  name: "top-list",
  components: { MusicList },
  data() {
    return {
      songs: []
    };
  },
  computed: {
    bgImage() {
      return this.top.picUrl;
    },
    title() {
      return this.top.topTitle;
    },

    ...mapGetters(["top"])
  },
  created() {
    this.rank = true;
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.top.id) {
        this.$router.push({
          path: "/rank"
        });
        return;
      }
      getMusicList(this.top.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSong(res.songlist)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeMusicList(list) {
      let ret = [];
      list.forEach(item => {
        const { data } = item;
        if (data.songid && data.albumid) {
          ret.push(createSong(data));
        }
      });
      return ret;
    }
  }
};
</script>
<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>