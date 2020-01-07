<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :probeType="3" :click="true" :data="dictList">
      <div>
        <div class="recommend-content">
          <slider v-if="recommendList.length > 0">
            <div v-for="item in recommendList" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @onload="handleImageLoad" alt />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="list-item" v-for="(item,index) in dictList" :key="index">
              <img v-lazy="item.imgurl" alt class="icon" />
              <div class="text-wrap">
                <div class="name">{{item.creator.name}}</div>
                <div class="desc">{{item.dissname}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="dictList.length === 0">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import { _getRecommend, _getDictList } from "@/api/recommend";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";

export default {
  name: "recommend",
  components: { Slider, Scroll, Loading },
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
          this.dictList = resp.data.list;
        }
      });
    },
    handleImageLoad() {
      if (!this.imageChecked) {
        this.$refs.scroll.refresh();
        this.imageChecked = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.recommend {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .recommend-list {
      .list-title {
        height: 65%;
        line-height: 65px;
        color: @color-theme;
        font-size: @font-size-medium;
        text-align: center;
      }
      .list-item {
        padding: 0 20px 20px 20px;
        display: flex;
        align-items: center;
        .icon {
          width: 60px;
          flex: 0 0 60px;
          padding-right: 20px;
        }
        .text-wrap {
          flex: 1;
          font-size: @font-size-medium;
          .name {
            color: @color-text;
            margin-bottom: 10px;
          }
          .desc {
            color: @color-text-d;
          }
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>