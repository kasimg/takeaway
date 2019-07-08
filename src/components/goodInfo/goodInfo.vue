<template>
	<transition name="moveIn">
		<figure class="good-info" ref="scollWrapper" v-show="shown">
			<!-- 商品信息总体内容 -->
			<div class="good__content">
				<!-- 总体内容头部，包括图片、返回按钮 -->
				<div class="content__header">
					<img :src="food.image" class="header__avatar">
					<!-- 用于定位 -->
					<div class="header__btn-back" @click="$emit('hideInfo')">
						<i class="icon-arrow_lift"></i>
					</div><!-- 用于定位 -->
				</div><!-- 总体内容头部 -->
				<!-- 总体内容简介，包括商品名称、销量、好评率、价格-->
				<div class="content__overview">
					<h1 class="overview__title">{{food.name}}</h1>
					<div class="overview__detail">
						<span class="detail__sell-count">月售{{food.sellCounr}}份</span>
						<span class="detail__rating">好评率{{food.rating}}%</span>
					</div>
					<div class="overview__price">
						<!-- 待抽象成组件，因为在goods中也用到了 -->
						<span class="price__current">￥{{food.price}}</span><span class="price__old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<transition name="afterFirstAdd">
						<div class="overview__cartControl-wrapper" v-show="!firstShown">
							<!-- 这里放一个钩子，使得点一次点击时也传入+-按钮组件的位置作为参数播放动画 -->
							<cart-control :food="food" @addCart="_drop" ref="cartControl"></cart-control>
						</div>
					</transition>
					<transition name="firstAdd">
						<!-- 如果将这个dom传入进行动画，因为它会瞬间消失，导致无法获取正确的高度，会从默认位置左上角开始播放动画，加上动画也能解决 -->
						<div class="overview__btn-buy" v-show="firstShown" @click.stop.prevent="addFirst">加入购物车</div>
					</transition>
				</div><!-- 总体内容简介 -->
				<split v-show="food.info"></split><!-- 分割线 -->
				<!-- 商品介绍 -->
				<div class="content__introduction" v-show="food.info">
					<h1 class="introdunction__title">商品信息</h1>
					<p class="introdunction__text">{{food.info}}</p>
				</div><!-- 商品介绍 -->
				<split></split>
				<!-- 商品评价 -->
				<div class="content__rating">
					<h1 class="rating__title">商品评价</h1>
					<!-- 这里监听了两个子组件中的事件toggleType,toggleContent，用于获取筛选评论区域的参数,desc用于渲染按钮上的文字，ratings控制评论的数量显示 -->
					<rating-select :desc="desc" :ratings="food.ratings" @toggleType="toggleType" @toggleContent="toggleContent"></rating-select>
					<!-- 评论列表容器 -->
					<div class="rating__body-wrapper">
						<ul v-show="RatingsShown">
							<!-- 这里的showThisRating没有用计算属性，而是用函数，因为计算属性引用时不能带参数，而这里必须要获得局部变量rating的值，所以用普通方法代替 -->
							<li v-for="(rating,index) in food.ratings" :key="index" class="body__item border-1px" v-show="showThisRating(rating)">
								<div class="item__user">
									<span class="user__name">{{rating.username}}</span>
									<img class="user__avatar" :src="rating.avatar" width="12" height="12">
								</div>
								<div class="item__time">{{rating.rateTime | formatDate}}</div>
								<p class="item__text">
									<!-- 这里计算属性代替不了表达式，因为要获取局部变量 -->
									<span :class="{'icon-thumb_up':rating.rateType===THUMB_UP,'icon-thumb_down':rating.rateType===THUMB_DOWN}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="body__no-rating" v-show="!RatingsShown">暂无评价</div>
					</div><!-- 评论列表容器 -->
				</div><!-- 商品评价 -->
			</div><!-- 商品信息总体内容 -->
		</figure>
	</transition>
</template>

<script type="overview/ecmascript-6">
/* eslint-disable */
	import BScroll from 'better-scroll';
	import cartControl from 'components/cartControl/cartControl';
	import split from 'components/split/split';
	import ratingSelect from 'components/ratingSelect/ratingSelect';
	import Vue from 'vue';
	// 导出的函数不是default，所以要加花括号
	import {formatDate} from 'common/js/date.js';
	const POSITIVE=0;
	const NEGATIVE=1;
	const ALL=2;

	export default {
		components: {
			cartControl,
			split,
			// 控制评论区内容
			ratingSelect
		},

		props: {
			food: {
				type: Object
			},
			// 控制此组件的显示或隐藏，在内部定义此变量的原因是因为此组件左上角有返回按钮，点击后需改变display的值，如果只在父组件上绑定一个表达式的话就要让父组件监听此组件，很麻烦
			shown: {
				type: Boolean
			}
		},

		data(){
			return {
				// 控制评论区按钮上的内容
				desc:{
					all:'全部',
					positive:'推荐',
					negative:'吐槽'
				},
				// 定义常量表示赞或者踩，更加语义化
				THUMB_UP:0,
				THUMB_DOWN:1,
				// 存储当前选中的评论类别
				selectedType:ALL,
				// 判断是否只显示有文字内容的评论
				onlyShowContent:false
			}
		},

		computed: {
			// 区别初始样式（加入购物车字样）和点击其之后的样式（+-按钮）
			firstShown() {
				// this.$emit('addCart',this.refs);
				return !this.food.count || this.food.count === 0;
			},
			// 控制整个列表的显示与隐藏，若没有评论信息或评论信息数量为0，那么就返回flase，显示“暂无评论字样”
			RatingsShown(){
				if(this.food.ratings && this.food.ratings.length){
					return true;
				}
				return false;
			},
		},

		methods: {
			// 向外(父组件)暴露刷新滚动的接口
			refreshScoll() {
				// console.log('refresh');
				this.scroll.refresh();
			},
			// 第一次点击（加入购物车字样）
			addFirst(event) {
				// 设置可以监听的属性count
				Vue.set(this.food, 'count', 1);
				// 手动触发事件，让监听这个事件的父元素获取信息（参数）
				this.$emit('addCart', this.$refs.cartControl.$el);
				// this.$emit('addCart',event.target);
			},
			// 后续点击事件，播放小球抛物线动画
			_drop() {
				this.$emit('addCart', event.target);
			},

			// 响应子组件传来的切换评论标签事件
			toggleType(type){
				// 因为事先定义了selectedType变量，所以能够监听，若不事先定义则需要用nextTick
				this.selectedType=type;
				// this.scroll.scrollTo(100,200);
			},

			// 响应是否显示无文本描述的评论
			toggleContent(onlyShowContent){
				this.onlyShowContent=onlyShowContent;
			},

			//根据选项确定是否显示评论
			showThisRating(rating){
				// 只有这种情况才会因为onlyShowContent而不显示（需求只显示有文本的评论，而某评论又没有内容）
				if (this.onlyShowContent && !rating.text) return false;
				// 经过onlyShowContent的筛选，这里如果选择ALL的话就全部都显示
				if (this.selectedType===ALL) return true;
				// 否则根据类别是否匹配决定是否显示
				return rating.rateType===this.selectedType;
			}
		},

		filters:{
			formatDate(time){
				let date=new Date(time);
				// console.log(date);
				// 自定义函数formatDate，详见common/js/date.js
				return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},

		created() {
			// this.onlyContent=true;
			this.$nextTick(() => {
				this.scroll = new BScroll(this.$refs.scollWrapper, {
					click: true
				});
				// console.log(this.scroll);
				// this.scroll.scrollToElement(this.$refs.a1.$el, 600);
			});
			//初始化要显示的评论，默认显示全部
			this.ratingsToBeShown=this.food.ratings;
		},
	};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import "../../common/stylus/mixin"
	.good-info
		position : fixed
		left : 0
		top : 0
		bottom : 48px
		z-index : 0
		width : 100%
		// height : 0
		background : #fff
		// overflow : hidden
		// max-height : 500px
		&.moveIn-enter-active,&.moveIn-leave-active
			transition : all .8s
		&.moveIn-enter
			transform : translate3d(500px,0,0) rotate(60deg) scale(0)
			// opacity : 0
		&.moveIn-leave-to
			transform : translate3d(-500px,0,0) rotate(-60deg)
			opacity : 0
		.good__content
			// position : relative
			// width : 100%
			// height : 0
			// padding设置百分比，百分比按照宽度计算
			// padding-top : 100%
			// transition : height 1s
			.content__header
				position : relative
				width : 100%
				padding-top : 100%
				height : 0
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
			.content__overview
				position : relative
				padding : 18px
				.overview__title
					line-height : 14px
					margin-bottom : 8px
					font-size : 14px
					font-weight : 700
					color : rgb(7,17,27)
				.overview__detail
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
				.overview__price
					font-weight : 700
					line-height : 24px
					.price__current
						margin-right : 18px
						font-size : 14px
						color : rgb(240,20,20)
					.price__old
						overview-decoration : line-through
						font-size : 10px
						color : rgb(147,153,159)
				.overview__cartControl-wrapper
					position : absolute
					right : 12px
					bottom : 12px
					z-index : 0
					&.afterFirstAdd-enter-active,&.afterFirstAdd-leave-active
						transition : all .5s
					&.afterFirstAdd-enter,&.afterFirstAdd-leave-to
						transform : scale(0)
						opacity : 0
				.overview__btn-buy
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
			.content__introduction
				padding : 18px
				.introdunction__title
					line-height : 14px
					margin-bottom : 6px
					font-size : 14px
					color : rgb(7,17,27)
				.introdunction__text
					line-height : 24px
					padding : 0 8px
					font-size : 12px
					color : rgb(77,85,93)
			.content__rating
				padding-top : 18px
				.rating__title
					line-height : 14px
					margin-bottom : 6px
					margin-left : 18px
					font-size : 14px
					color : rgb(7,17,27)
				.rating__body-wrapper
					padding : 0 18px
					.body__item
						position : relative
						padding : 16px 0
						border-1px(rgba(7,17,27,0.1))
						// transition : all 1s
						// &.move-enter-active,&.move-leave-active
						// 	transition : all 1s
						// 	// position : absolute
						// &.move-leave-to,&.move-enter
						// 	opacity : 0
							// transform : translate3d(-400px,0,0)
						// &.move-enter
						// 	transform : translate3d(400px,0,0)
						// &.move-enter-to
						// 	transform : translate3d(0,0,0)
						.item__user
							position : absolute
							right : 0
							top : 16px
							line-height : 12px
							font-size : 0
							.user__name
								display : inline-block
								margin-right : 6px
								vertical-align : top
								font-size : 10px
								color : rgb(147,153,159)
							.user__avatar
								border-radius : 50%
						.item__time
							margin-bottom : 6px
							line-height : 12px
							font-size : 10px
							color : rgb(147,153,159)
						.item__text
							line-height : 16px
							font-size : 12px
							color : rgb(7,17,27)
							.icon-thumb_up,.icon-thumb_up
								margin-right : 4px
								line-height : 16px
								font-size : 12px
							.icon-thumb_up
								color : rgb(0,160,220)
							.icon-thumb_down
								color : rgb(147,153,159)
					.body__no-rating
						padding : 16px 0
						font-size : 12px
						color : rgb(147,153,159)
</style>
