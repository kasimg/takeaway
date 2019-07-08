<template>
  <div class="star__wrapper" :class="starType">
    <span v-for="item in items" :class="item" class="star__item" :key="item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
const LENGTH = 5;
const FULL_STAR = "on";
const HALF_STAR = "half";
const EMPTY_STAR = "off";
export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },

  computed: {
    starType() {
      return "star-" + this.size;
    },
    items() {
      let result = [];
      let score = Math.floor(this.score * 2) / 2;
      let hasDecimal = score % 1 !== 0;
      let integer = Math.floor(score);
      for (let i = 0; i < integer; i++) {
        result.push(FULL_STAR);
      }
      if (hasDecimal) {
        result.push(HALF_STAR);
      }
      while (result.length < LENGTH) {
        result.push(EMPTY_STAR);
      }
      return result;
    }
  },
  name: "star",

  data() {
    return {};
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin';

.star__wrapper {
  font-size: 0;

  .star__item {
    // background-color : #fff
    display: inline-block;
    background-repeat: no-repeat;
    background-size: contain;
  }

  &.star-48 {
    .star__item {
      width: 20px;
      height: 20px;
      margin-right: 22px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        bg-image('star48_on');
      }

      &.half {
        bg-image('star48_half');
      }

      &.off {
        bg-image('star48_off');
      }
    }
  }

  &.star-36 {
    .star__item {
      width: 15px;
      height: 15px;
      margin-right: 6px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        bg-image('star36_on');
      }

      &.half {
        bg-image('star36_half');
      }

      &.off {
        bg-image('star36_off');
      }
    }
  }

  &.star-24 {
    .star__item {
      width: 10px;
      height: 10px;
      margin-right: 3px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        bg-image('star24_on');
      }

      &.half {
        bg-image('star24_half');
      }

      &.off {
        bg-image('star24_off');
      }
    }
  }
}
</style>
