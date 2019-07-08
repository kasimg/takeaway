<template>
  <section class="seller" ref="sellerWrapper">
    <figure class="seller-wrapper">
      <div class="seller__overview">
        <h1 class="overview__title">{{seller.name}}</h1>
        <div class="overview__desc border-1px">
          <star class="desc__star" :size="36" :score="seller.score"></star>
          <span class="desc__text">({{seller.ratingCount}})</span>
          <span class="desc__text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="overview__delivery-info">
          <li class="delivery-info__block">
            <h2>起送价</h2>
            <div class="block__text">
              <span class="text">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="delivery-info__block">
            <h2>商家配送</h2>
            <div class="block__text">
              <span class="text">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="delivery-info__block">
            <h2>平均配送时间</h2>
            <div class="block__text">
              <span class="text">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="overview__favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorred}"></span>
          <span class="favorite__text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="seller__bulletin">
        <h1 class="bulletin__title">公告与活动</h1>
        <div class="bulletin__content-wrapper border-1px">
          <p class="bulletin__content">{{seller.bulletin}}</p>
        </div>
        <!-- 优惠信息列表 -->
        <ul class="bulletin__supports" v-if="seller.supports">
          <li class="support__item border-1px" v-for="item in seller.supports" :key="item.type">
            <span class="item__icon" :class="classMap[item.type]"></span>
            <span class="item__text">{{item.description}}</span>
          </li>
        </ul>
        <!-- 优惠信息列表 -->
      </div>
      <split></split>
      <div class="seller__pics">
        <h1 class="pics__title">商家实景</h1>
        <div class="pics__picList-wrapper" ref="picWrapper">
          <ul class="pics__pic-list" ref="picList">
            <li class="pic__item" v-for="pic in seller.pics" :key="pic">
              <img :src="pic" height="90" width="120" />
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller__info">
        <h1 class="info__title border-1px">商家信息</h1>
        <ul class="info__content">
          <li class="content__item border-1px" v-for="info in seller.infos" :key="info">{{info}}</li>
        </ul>
      </div>
    </figure>
  </section>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
import split from "components/split/split";
import star from "components/star/star";
import BScroll from "better-scroll";
import { saveToLocal, loadFromLocal } from "common/js/store";
const PIC_WIDTH = 120;
const PIC_MARGIN_RIGHT = 6;
export default {
  components: {
    star,
    split
  },

  props: {
    seller: {
      type: Object
    }
    // test:{
    // 	type:Number
    // }
  },

  data() {
    return {
      // seller:{},
      favorred: (() => {
        return loadFromLocal(this.seller.id, "favorite", false);
      })()
    };
  },

  computed: {
    favoriteText() {
      return this.favorred ? "已收藏" : "收藏";
    }
  },

  methods: {
    toggleFavorite() {
      this.favorred = !this.favorred;
      saveToLocal(this.seller.id, "favorite", this.favorred);
    }
  },
  // created函数中无法获取seller.pics因为时机尚早所以无法获取宽度；
  created() {
    // console.log('created');
    this.classMap = ["decrease", "discount", "guarantee", "invoice", "special"];
    this.$nextTick(() => {
      // console.log(this.seller);
      this.scroll = new BScroll(this.$refs.sellerWrapper, {
        click: true
      });
      this.picScroll = new BScroll(this.$refs.picWrapper, {
        scrollX: true, //表示横向滚动
        eventPassthrough: "vertical" //横向滚动时忽略竖直方向的滚动
      });
    });
    // 获取数据,保证创建时数据已经更新，并能够获取横向滚动容器的正确宽度，所以这里用get方法获取，如果传参的话不能实时更新
    // this.$http.get('/api/seller').then((response)=>{
    // 	console.log('get');
    // 		response=response.body;
    // 		this.seller=response.data;
    // 		if(!this.picScroll){
    // 	this.$nextTick(()=>{
    // 		this.picScroll=new BScroll(this.$refs.picWrapper,{
    // 			scrollX:true, //表示横向滚动
    // 			eventPassthrough:'vertical' //横向滚动时忽略竖直方向的滚动
    // 		});
    // 	});
    // 		let width=(PIC_WIDTH+PIC_MARGIN_RIGHT)*this.seller.pics.length-PIC_MARGIN_RIGHT;
    // 	this.$refs.picList.style.width=width+'px';
    // 	console.log('picScroll not existed');
    // }
    // 	});
    // console.log(this.seller.pics);
    // console.log(this.$refs.picList);
    // if(this.seller.pics){
    // 	// console.log('in created');
    // 	let width=(PIC_WIDTH+PIC_MARGIN_RIGHT)*this.seller.pics.length-PIC_MARGIN_RIGHT;
    // 	this.$refs.picList.style.width=width+'px';
    // }
  },
  // mounted函数中可以获取到seller.pics但是mounted在直接刷新页面时不触发，所以只能用于路由（）间切换
  mounted() {
    // console.log('mounted');
    if (this.seller.pics) {
      // console.log('in mounted');
      let width =
        (PIC_WIDTH + PIC_MARGIN_RIGHT) * this.seller.pics.length -
        PIC_MARGIN_RIGHT;
      this.$refs.picList.style.width = width + "px";
    }
  },
  updated() {
    console.log("in update");
    let width =
      (PIC_WIDTH + PIC_MARGIN_RIGHT) * this.seller.pics.length -
      PIC_MARGIN_RIGHT;
    this.$refs.picList.style.width = width + "px";
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin';

.seller {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  .seller__overview {
    padding: 18px;
    position: relative;

    .overview__title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .overview__desc {
      padding-bottom: 18px;
      // line-height : 18px
      border-1px(rgba(7, 17, 27, 0.1));
      font-size: 0;

      .desc__star {
        display: inline-block;
        margin-right: 8px;
        vertical-align: top;
      }

      .desc__text {
        display: inline-block;
        margin-right: 12px;
        line-height: 18px;
        vertical-align: top;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }

    .overview__delivery-info {
      display: flex;
      padding-top: 18px;

      .delivery-info__block {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, 0.1);

        &:last-child {
          border: none;
        }

        h2 {
          margin-bottom: 4px;
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .block__text {
          line-height: 24px;
          font-size: 10px;
          color: rgb(7, 17, 27);

          .text {
            font-size: 24px;
          }
        }
      }
    }

    .overview__favorite {
      position: absolute;
      width: 50px;
      right: 11px;
      top: 18px;
      text-align: center;

      .icon-favorite {
        display: block;
        margin-bottom: 4px;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;
        transition: all 0.2s;

        &.active {
          color: rgb(240, 20, 20);
        }
      }

      .favorite__text {
        line-height: 10px;
        font-size: 10px;
        color: rgb(77, 85, 93);
        transition: all 1s;
      }
    }
  }

  .seller__bulletin {
    padding: 18px 18px 0 18px;

    .bulletin__title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .bulletin__content-wrapper {
      padding: 0 12px 16px 12px;
      border-1px(rgba(7, 17, 27, 0.1));

      .bulletin__content {
        line-height: 24px;
        font-size: 12px;
        color: rgb(240, 20, 20);
      }
    }

    .bulletin__supports {
      .support__item {
        padding: 16px 12px;
        border-1px(rgba(7, 17, 27, 0.1));

        &:last-child {
          border-none();
        }

        font-size: 0;

        .item__icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          vertical-align: top;
          margin-right: 6px;
          background-size: contain;
          background-repeat: no-repeat;

          &.decrease {
            bg-image('decrease_4');
          }

          &.discount {
            bg-image('discount_4');
          }

          &.guarantee {
            bg-image('guarantee_4');
          }

          &.invoice {
            bg-image('invoice_4');
          }

          &.special {
            bg-image('special_4');
          }
        }

        .item__text {
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
      }
    }
  }

  .seller__pics {
    padding: 18px;

    // 和over的title一致
    .pics__title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .pics__picList-wrapper {
      // width : 100%
      // position : absolute
      // width : 0
      overflow: hidden;
      white-space: nowrap;

      .pics__pic-list {
        font-size: 0;

        .pic__item {
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;

          &:last-child {
            margin: 0;
          }
        }
      }
    }
  }

  .seller__info {
    padding: 18px 18px 0 18px;
    color: rgb(7, 17, 27);

    .info__title {
      padding-bottom: 8px;
      line-height: 14px;
      border-1px(rgba(7, 17, 27, 0.1));
      font-size: 14px;
    }

    .info__content {
      .content__item {
        padding: 16px 12px;
        line-height: 16px;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;

        &:last-child {
          border-none();
        }
      }
    }
  }
}
</style>
