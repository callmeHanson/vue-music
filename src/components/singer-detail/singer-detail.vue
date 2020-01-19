<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { _getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong, processSongsUrl } from "common/js/song";
import MusicList from "components/music-list/music-list";

export default {
  name: "singer-detail",
  data() {
    return {
      songs: []
    };
  },

  computed: {
    title() {
      return this.singer.name;
    },

    bgImage() {
      return this.singer.avatar;
    },

    ...mapGetters(["singer"])
  },

  created() {
    console.log(this.singer);
    this.getSingerDetail();
  },

  methods: {
    async getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push({ path: "/singer" });
        return;
      }
      const resp = await _getSingerDetail(this.singer.id);
      if (resp.code === ERR_OK) {
        // const list = resp.data.list;
        // this.songs = this._normalizeSong(list);

        processSongsUrl(this._normalizeSong(resp.data.list)).then(songs => {
          this.songs = songs;
          console.log(this.songs);
        });
      }
    },

    _normalizeSong(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },

  components: { MusicList }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable.less";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>