<template>
  <div id="all">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab__item">
        <router-link class="item__link" to="/goods">商品</router-link>
      </div>
      <div class="tab__item">
        <router-link class="item__link" to="/ratings">评价</router-link>
      </div>
      <div class="tab__item">
        <router-link class="item__link" to="/seller">商家</router-link>
      </div>
    </div>
    <!-- <div class="content">
      i am comtent!
    </div> -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import header from 'components/header/myHeader';
import {urlParse} from 'common/js/util';
// console.log(this.$store.state);
const ERR_OK = 0;

export default {
  data() {
    return {
      seller: {
        id:(()=>{
          let queryParam=urlParse();
          // console.log(queryParam);
          return queryParam.id;
        })()
      }
    };
  },
  created() {
    // console.log(this.$store.state);
    //若不用assign，seller.id只在这里生效，this.seller = response.data;这里就被覆盖
    // this.$http.get('/api/seller?id='+this.seller.id).then((response) => {
    //   response = response.body;
    //   // console.log(response);
    //   if (response.errno === ERR_OK) {
    //     // console.log('errno===0');
    //     // this.seller = response.data;
    //     this.seller=Object.assign({},this.seller,response.data)
    //     console.log(this.seller.id);
    //   }
    // });
    let appData = require('../data.json');
    // console.log(appData.seller);
    this.seller=Object.assign({},this.seller,appData.seller);
  },
  components: {
    'v-header': header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/index.styl"
  #all
    .tab
      display:flex
      width : 100%
      height : 40px
      line-height : 40px
      // border-bottom : 1px solid #000
      border-1px(rgba(7,17,27,0.1))
      .tab__item
        flex : 1
        text-align : center
        .item__link
          display : block
          font-size : 14px
          color : rgb(77,85,93)
          // 这里的active对应着路由设置里的linkActiveClass: 'active'
          &.active
            color : rgb(240,20,20)
</style>
