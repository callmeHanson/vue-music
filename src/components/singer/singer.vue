<template>
  <div class="singer">
    <listview :data="singerList" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>
<script>
import { _getSingerList } from "api/singer";
import Singer from "common/js/singer";
import Listview from "base/listview/listview";
import { mapMutations } from "vuex";
import * as types from "@/store/mutation-types";

const HOT_LEN = 10;
const HOT_NAME = "热门";
export default {
  name: "singer",
  components: { Listview },
  data() {
    return {
      singerList: []
    };
  },
  created() {
    this.getSingerList();
  },
  methods: {
    selectSinger(singer) {
      this.setSinger(singer)
      this.$router.push({ path: `/singer/${singer.id}` });
    },

    getSingerList() {
      _getSingerList().then(resp => {
        if (resp.code === 0) {
          this.singerList = this.normalize(resp.data.list);
          // this.singerList = resp.data.list;
        }
      });
    },
    normalize(list = []) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_LEN) {
          map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name));
        }
        if (!map.hasOwnProperty(item.Findex)) {
          map[item.Findex] = {
            title: item.Findex,
            items: []
          };
        }
        map[item.Findex].items.push(
          new Singer(item.Fsinger_mid, item.Fsinger_name)
        );
      });
      // 筛选出 热门 和a-zA-Z
      let hot = [];
      let res = [];
      for (let key in map) {
        const val = map[key];
        if (val.title === HOT_NAME) {
          hot.push(map[key]);
        } else if (val.title.match(/[a-zA-Z]/)) {
          res.push(val);
        }
      }
      res.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(res);
    },
    ...mapMutations({
      setSinger: types.SET_SINGER
    })
  }
};
</script>
<style lang="less" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>