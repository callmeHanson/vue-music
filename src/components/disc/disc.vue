<template>
  <div class="disc">
    <transition appear name="slide">
      <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
    </transition>
  </div>
</template>
<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { _getSongList } from "api/recommend";
import { ERR_OK } from "api/config";
import { createSong, processSongsUrl } from "common/js/song";

export default {
  name: "disc",
  components: { MusicList },
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"])
  },

  created() {
    this.getSongList();
  },

  methods: {
    getSongList() {
      if (!this.disc.dissid) {
        this.$router.push({ path: "/recommend" });
        return;
      }
      _getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSong(res.cdlist[0].songlist)).then(songs => {
            this.songs = songs;
            console.log(this.songs);
          });
        }
      });
    },

    _normalizeSong(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
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