import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from "common/js/config";
import * as types from "store/mutation-types";
import { shuffle } from "common/js/util";

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

export const playerMixin = {
  computed: {
    iconMode() {
      switch (this.mode) {
        case playMode.sequence:
          return "icon-sequence";
        case playMode.loop:
          return "icon-loop";
        case playMode.random:
          return "icon-random";
      }
    },

    ...mapGetters(["mode", "sequenceList", "currentSong", "favoriteList"])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setMode(mode);
      let list = [];
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }

      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      const idx = list.findIndex(item => item.id === this.currentSong.id);
      this.setCurrentIndex(idx);
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return "icon-favorite"
      }
      return "icon-not-favorite"
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => item.id === song.id);
      return index > -1
    },

    ...mapMutations({
      setCurrentIndex: types.SET_CURRENT_INDEX,
      setMode: types.SET_MODE,
      setPlayList: types.SET_PLAYLIST
    }),
    ...mapActions(["saveFavoriteList", "deleteFavoriteList"])
  }
}

export const searchMixin = {
  data() {
    return {
      query: "",
      refreshDelay: 100
    }
  },
  methods: {
    onQueryChange(query) {
      this.query = query;
    },
    addQuery(query) {
      this.$refs["searchBox"].setQuery(query);
      this.query = query;
    },
    blurInput(pos) {
      this.$refs["searchBox"].blur();
    },
    saveSearch(item) {
      this.saveSearchHistory(this.query);
    },
    deleteSearch(item) {
      this.deleteSearchHistory(item)
    },

    ...mapActions(["saveSearchHistory", "deleteSearchHistory"])
  }
}