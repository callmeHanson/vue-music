import { mapGetters } from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters(["playList"])
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  methods: {
    handlePlaylist() {
      throw new Error("component must implement handlePlaylist method")
    }
  }
}