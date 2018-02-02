<template>
	<transition name="moveIn">
		<figure class="good-info" ref="scollWrapper" v-show="shown">
			<div class="good__content">
				<div class="content__header">
					<img :src="food.image" class="header__avatar">
					<!-- 用于定位 -->
					<div class="header__btn-back" @click="$emit('hideInfo')">
						<i class="icon-arrow_lift"></i>
					</div><!-- 用于定位 -->
				</div>
				<div class="content__text">
					<h1 class="text__title">{{food.name}}</h1>
					<div class="text__detail">
						<span class="detail__sell-count">月售{{food.sellCounr}}份</span>
						<span class="detail__rating">好评率{{food.rating}}%</span>
					</div>
					<div class="text__price">
						<!-- 待抽象成组件，因为在goods中也用到了 -->
						<span class="price__current">￥{{food.price}}</span><span class="price__old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<div class="text__cartControl-wrapper">
						<!-- 这里放一个钩子，使得点一次点击时也传入+-按钮组件的位置作为参数播放动画 -->
						<cart-control :food="food" @addCart="_drop" ref="cartControl"></cart-control>
					</div>
					<transition name="firstAdd">
						<!-- 如果将这个dom传入进行动画，因为它会瞬间消失，导致无法获取正确的高度，会从默认位置左上角开始播放动画，加上动画也能解决 -->
						<div class="text__btn-buy" v-show="firstShown" @click.stop.prevent="addFirst">加入购物车</div>
					</transition>
				</div>
			</div>
		</figure>
	</transition>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import cartControl from 'components/cartControl/cartControl';
	import Vue from 'vue';
	export default {
		components:{
			cartControl
		},

		props: {
			food: {
				type: Object
			},

			shown:{
				type: Boolean
			}
		},

		computed:{
			firstShown(){
				// this.$emit('addCart',this.refs);
				return !this.food.count || this.food.count===0;
			}
		},

		created() {
			this.$nextTick(() => {
				if (!this.scroll) {
					// console.log(this.$refs.goodInfoWrapper);
					this.scroll = new BScroll(this.$refs.scollWrapper, {
						click: true
					});
				} else {
					this.scroll.refresh();
				}
			});
		},

		methods:{
			// 向外(父组件)暴露刷新滚动的接口
			refreshScoll(){
				// console.log('refresh');
				this.scroll.refresh();
			},

			addFirst(event){
				Vue.set(this.food,'count',1);
				this.$emit('addCart',this.$refs.cartControl.$el);
				// this.$emit('addCart',event.target);
			},

			_drop(){
				this.$emit('addCart',event.target);
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.good-info
		position : fixed
		left : 0
		top : 0
		bottom : 48px
		z-index : 0
		width : 100%
		background : #fff
		&.moveIn-enter-active,&.moveIn-leave-active
			transition : all .8s
		&.moveIn-enter
			transform : translate3d(500px,0,0) rotate(60deg) scale(0)
			// opacity : 0
		&.moveIn-leave-to
			transform : translate3d(-500px,0,0) rotate(-60deg)
			opacity : 0
		.good__content
			position : relative
			width : 100%
			height : 0
			// padding设置百分比，百分比按照宽度计算
			padding-top : 100%
			.content__header
				.header__avatar
					position : absolute
					top : 0
					left : 0
					width : 100%
					height : 100%
				.header__btn-back
					position : absolute
					top : 10px
					left : 0
				.icon-arrow_lift
					display : block
					// 增加可点击区域
					padding : 10px
					font-size : 20px
					color : #fff
			.content__text
				position : relative
				padding : 18px
				.text__title
					line-height : 14px
					margin-bottom : 8px
					font-size : 14px
					font-weight : 700
					color : rgb(7,17,27)
				.text__detail
					margin-bottom : 18px
					line-height : 10px
					height : 10px
					// 子元素时inline-block布局，所以这里设置字号为0
					font-size : 0
					.detail__sell-count,.detail__rating
						font-size : 10px
						color : rgb(147,153,159)
					.detail__sell-count
						margin-right : 12px
				// 样式也和goods中一样，所以可以抽象成组件
				.text__price
					font-weight : 700
					line-height : 24px
					.price__current
						margin-right : 18px
						font-size : 14px
						color : rgb(240,20,20)
					.price__old
						text-decoration : line-through
						font-size : 10px
						color : rgb(147,153,159)
				.text__cartControl-wrapper
					position : absolute
					right : 12px
					bottom : 12px
					z-index : 0
				.text__btn-buy
					position : absolute
					right : 18px
					bottom : 18px
					z-index : 1
					height : 24px
					line-height : 24px
					padding : 0 12px
					box-sizing : border-box
					border-radius : 12px
					font-size : 10px
					color : #fff
					background : rgb(0,160,220)
					&.firstAdd-enter-active,&.firstAdd-leave-active
						transition : all .5s
					&.firstAdd-enter,&.firstAdd-leave-to
						transform : scale(0)
						opacity : 0
</style>
