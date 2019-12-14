<template>
  <div class="recommend">
    <div class="recommend-content">
      <slider v-if="recommendList.length > 0">
        <div v-for="item in recommendList" :key="item.id">
          <a :href="item.linkUrl">
            <img :src="item.picUrl" alt />
          </a>
        </div>
      </slider>
    </div>
    <div class="recommend-list"></div>
  </div>
</template>
<script>
import { _getRecommend, _getDictList } from "@/api/recommend";
import Slider from "base/slider/slider";

export default {
  name: "recommend",
  components: { Slider },
  data() {
    return {
      recommendList: [],
      dictList: []
    };
  },
  created() {
    this.getRecommend();
    this.getDictList();
  },
  methods: {
    getRecommend() {
      _getRecommend().then(resp => {
        if (resp.code === 0) {
          this.recommendList = resp.data.slider;
        }
      });
    },
    getDictList() {
      _getDictList().then(resp => {
        if (resp.code === 0) {
          this.dictList = resp.data.list
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>