<template>
  <section class="ratings" ref="scrollWrapper">
    <figure class="ratings-wrapper">
      <div class="ratings__overview">
        <div class="overview__left">
          <h1 class="left__compreScore">{{seller.score}}</h1>
          <div class="left__compreScore-title">综合评分</div>
          <div class="left__rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview__right">
          <div class="right__serviceScore-wrapper">
            <span class="serviceScore__title">服务态度</span>
            <star :size="36" :score="seller.serviceScore" class="serviceScore__star"></star>
            <span class="serviceScore__point">{{seller.serviceScore}}</span>
          </div>
          <div class="right__foodScore-wrapper">
            <span class="foodScore__title">商品评分</span>
            <star :size="36" :score="seller.serviceScore" class="foodScore__star"></star>
            <span class="foodScore__point">{{seller.foodScore}}</span>
          </div>
          <div class="right__delivery-wrapper">
            <span class="delivery__title">送达时间</span>
            <span class="delivery__time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating-select :ratings="ratings" @toggleType="toggleType" @toggleContent="toggleContent"></rating-select>
      <div class="ratings__content">
        <ul>
          <li
            v-for="rating in ratings"
            class="content__unit"
            v-show="showThisRating(rating)"
            :key="rating.rateType"
          >
            <div class="unit__avatar">
              <img :src="rating.avatar" width="24" height="24" class="avatar__pic" />
            </div>
            <div class="unit__user">
              <div class="user__name">{{rating.username}}</div>
              <div class="user__stars-wrapper">
                <star :size="24" :score="rating.score" class="stars"></star>
                <span
                  class="stars__delivery"
                  v-show="rating.deliveryTime"
                >{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="user__text">{{rating.text}}</p>
              <div class="user__recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="text in rating.recommend" :key="text" class="recommend__item">{{text}}</span>
              </div>
              <div class="user__time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </figure>
  </section>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
import BScroll from "better-scroll";
import star from "components/star/star";
import split from "components/split/split";
import ratingSelect from "components/ratingSelect/ratingSelect";
import { formatDate } from "common/js/date.js";

const ALL = 2;
const ERR_OK = 0;

export default {
  components: {
    star,
    ratingSelect,
    split
  },

  props: {
    seller: {
      type: Object
    }
  },

  data() {
    return {
      ratings: [],
      selectedType: ALL,
      onlyShowContent: false
    };
  },

  methods: {
    // 响应子组件传来的切换评论标签事件
    toggleType(type) {
      // 因为事先定义了selectedType变量，所以能够监听，若不事先定义则需要用nextTick
      this.selectedType = type;
      // this.scroll.scrollTo(100,200);
    },

    // 响应是否显示无文本描述的评论
    toggleContent(onlyShowContent) {
      this.onlyShowContent = onlyShowContent;
    },

    //根据选项确定是否显示评论
    showThisRating(rating) {
      // 只有这种情况才会因为onlyShowContent而不显示（需求只显示有文本的评论，而某评论又没有内容）
      if (this.onlyShowContent && !rating.text) return false;
      // 经过onlyShowContent的筛选，这里如果选择ALL的话就全部都显示
      if (this.selectedType === ALL) return true;
      // 否则根据类别是否匹配决定是否显示
      return rating.rateType === this.selectedType;
    }
  },

  filters: {
    formatDate(time) {
      let date = new Date(time);
      // console.log(date);
      // 自定义函数formatDate，详见common/js/date.js
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },

  created() {
    // this.$http.get('/api/ratings').then((response)=>{
    // response=response.body;
    // if(response.errno===ERR_OK){
    // this.ratings=response.data;
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        click: true
      });
    });
    // }
    // });

    let appData = require("../../../data.json");
    this.ratings = appData.ratings;
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin';

.ratings {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  .ratings__overview {
    display: flex;
    padding: 18px;

    .overview__left {
      flex: 0 0 137px;
      padding: 6px 0;
      width: 137px;
      border-right: 1px solid rgba(7, 17, 27, 0.1);
      text-align: center;

      @media only screen and (max-width: 400px) {
        flex: 0 0 120px;
        width: 120px;
      }

      .left__compreScore {
        margin-bottom: 6px;
        line-height: 28px;
        font-size: 24px;
        color: rgb(255, 153, 0);
      }

      .left__compreScore-title {
        margin-bottom: 8px;
        line-height: 12px;
        font-size: 12px;
        color: rgb(7, 17, 27);
      }

      .left__rank {
        // padding-bottom : 6px
        line-height: 10px;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }

    .overview__right {
      flex: 1;
      padding: 6px 0 6px 24px;

      @media only screen and (max-width: 400px) {
        padding-left: 6px;
      }

      .right__serviceScore-wrapper, .right__foodScore-wrapper {
        margin-bottom: 8px;
        // line-height : 18px
        font-size: 0;

        .serviceScore__title, .serviceScore__star, .serviceScore__point, .foodScore__title, .foodScore__star, .foodScore__point {
          display: inline-block;
          vertical-align: top;
        }

        .serviceScore__title, .foodScore__title {
          font-size: 12px;
          color: rgb(7, 17, 27);
          line-height: 18px;
        }

        .serviceScore__star, .foodScore__star {
          margin: 0 12px;
        }

        .serviceScore__point, .foodScore__point {
          font-size: 12px;
          color: rgb(255, 153, 0);
          line-height: 18px;
        }
      }

      .right__delivery-wrapper {
        font-size: 0;

        .delivery__title {
          line-height: 18px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }

        .delivery__time {
          margin-left: 12px;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }

  .ratings__content {
    padding: 0 18px;

    .content__unit {
      display: flex;
      padding: 18px 0;
      border-1px(rgba(7, 17, 27, 0.1));

      .unit__avatar {
        flex: 0 0 28px;
        width: 28px;
        margin-right: 12px;

        .avatar__pic {
          border-radius: 50%;
        }
      }

      .unit__user {
        position: relative;
        flex: 1;

        .user__name {
          margin-bottom: 4px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(7, 17, 27);
        }

        .user__stars-wrapper {
          margin-bottom: 6px;
          font-size: 0;

          .stars {
            display: inline-block;
            margin-right: 6px;
            vertical-align: top;
          }

          .stars__delivery {
            display: inline-block;
            vertical-align: top;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }

        .user__text {
          margin-bottom: 8px;
          line-height: 18px;
          color: rgb(7, 17, 27);
          font-size: 12px;
        }

        .user__recommend {
          line-height: 16px;
          font-size: 0;

          .icon-thumb_up, .recommend__item {
            display: inline-block;
            margin: 0 8px 4px 0;
            font-size: 9px;
          }

          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }

          .recommend__item {
            padding: 0 6px;
            border: 1px solid rgba(7, 17, 27, 0.1);
            border-radius: 1px;
            color: rgb(147, 153, 159);
            background: #fff;
          }
        }

        .user__time {
          position: absolute;
          top: 0;
          right: 0;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
}
</style>
