<template>
	<!-- 头部 -->
	<div class="header">
		<!-- 头部内容容器 -->
		<div class="content-wrapper">
			<!-- 图片 -->
			<div class="avatar">
				<img :src="seller.avatar" class="img" alt="">
			</div><!-- 图片 -->
			<!-- 内容 -->
			<div class="content">
				<div class="content__title">
					<span class="title__brand"></span>
					<span class="title__name">{{seller.name}}</span>
				</div>
				<!-- 标题 -->
				<div class="content__description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div><!-- 标题 -->
				<!-- 描述 -->
				<div class="content__support" v-if="seller.supports">
					<span class="support__icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="support__text">{{seller.supports[0].description}}</span>
				</div><!-- 描述 -->
			</div><!-- 内容 -->
			<!-- 个数 -->
			<div class="count" v-if="seller.supports" @click="showDetail">
				<span class="count__text">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div><!-- 个数 -->
		</div><!-- 头部内容容器 -->
		<!-- 公告条 -->
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin__title"></span><span class="bulletin__text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div><!-- 公告条 -->
		<!-- 头部背景 -->
		<div class="background">
			<img :src="seller.avatar" class="background__avatar">
		</div><!-- 头部背景 -->
		<!-- 弹出层（细节部分） -->
		<transition name="fade">
			<!-- 细节部分总容器 -->
			<div class="detail__wrapper" v-show="detailShown">
				<!-- 细节部分主体内容 -->
				<div class="detail__content clearfix">
					<!-- 主体内容 -->
					<div class="content__main">
						<!-- 商家名称 -->
						<h1 class="main__title">{{seller.name}}</h1><!-- 商家名称 -->
						<!-- 星级评分容器 -->
						<div class="main__star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div><!-- 星级评分容器 -->
						<!-- 优惠信息 -->
						<div class="main__discount-info">
							<div class="info__line"></div>
							<div class="info__text">优惠信息</div>
							<div class="info__line"></div>
						</div><!-- 优惠信息 -->
						<!-- 优惠信息列表 -->
						<ul class="main__supports" v-if="seller.supports">
							<li class="support__item" v-for="item in seller.supports">
								<span class="item__icon" :class="classMap[item.type]"></span>
								<span class="item__text">{{item.description}}</span>
							</li>
						</ul><!-- 优惠信息列表 -->
						<!-- 商家公告 -->
						<div class="main__discount-info">
							<div class="info__line"></div>
							<div class="info__text">商家公告</div>
							<div class="info__line"></div>
						</div><!-- 商家公告 -->
						<!-- 公告内容 -->
						<div class="main__bulletin">
							<div class="bulletin__content">{{seller.bulletin}}</div>
							<div class="bulletin__content">{{seller.bulletin}}</div>
							<div class="bulletin__content">{{seller.bulletin}}</div>
							<div class="bulletin__content">{{seller.bulletin}}</div>
						</div><!-- 公告内容 -->
					</div><!-- 主体内容 -->
				</div><!-- 细节部分主体内容 -->
				<!-- X按钮 -->
				<div class="detail__close" @click="hideDetail">
					<i class="icon-close"></i>
				</div><!-- X按钮 -->
			</div><!-- 细节部分总容器 -->
		</transition><!-- 弹出层（细节部分） -->
	</div><!-- 头部 -->
</template>

<script type="text/ecmascript-6">
import star from 'components/star/star';
export default {
	props: {
		seller: {
			type: Object
		}
	},

	created() {
		this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
	},

	name: 'myHeader',

	data() {
		return {
			detailShown: false
		};
	},

	methods: {
		showDetail() {
			this.detailShown = true;
		},
		hideDetail() {
			// console.log('hide');
			this.detailShown = false;
		}
	},

	components: {
		star
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import "../../common/stylus/mixin"
		// background-color : rgba(7,17,27,0.8)
	.header
		// z-index : -20
		position : relative
		overflow : hidden
		background : rgba(7,17,27,0.5)
		color : #fff
		.content-wrapper
			position : relative
			padding : 24px 12px 18px 24px
			font-size : 0
			.avatar
				display : inline-block
				vertical-align : top
				.img
					width : 64px
					height : 64px
					border-radius : 2px
			.content
				display : inline-block
				// font-size : 14px
				margin-left : 16px
				.content__title
					margin : 2px 0 8px 0
					.title__brand
						vertical-align : top
						display : inline-block
						width : 30px
						height : 18px
						bg-image('brand')
						background-size : contain
					.title__name
						margin-left : 6px
						font-size : 16px
						line-height : 18px
						font-weight : bold
				.content__description
					margin-bottom : 10px
					line-height : 12px
					font-size : 12px
				.content__support
					//待抽象成组件
					.support__icon
						display : inline-block
						// vertical-align : top
						width : 12px
						height : 12px
						margin-right : 4px
						background-size : 12px 12px
						background-repeat : no-repeat
						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.guarantee
							bg-image('guarantee_1')
						&.invoice
							bg-image('invoice_1')
						&.special
							bg-image('special_1')
					.support__text
						vertical-align : top
						line-height : 12px
						font-size : 10px
			.count
				position : absolute
				right : 12px
				bottom : 14px
				padding : 0 8px
				height : 24px
				line-height : 24px
				border-radius : 14px
				background-color : rgba(0,0,0,0.2)
				text-align : center
				font-size : 10px
				.count__text
					vertical-align : top
				.icon-keyboard_arrow_right
					line-height : 20px
					margin-left : 2px
		.bulletin-wrapper
			position : relative
			height : 28px
			line-height : 28px
			padding : 0 22px 0 12px
			white-space : nowrap
			overflow : hidden
			text-overflow : ellipsis
			background-color : rgba(7,17,7,0.2)
			// font-size : 0
			.bulletin__title
				display : inline-block
				vertical-align : top
				margin-top : 8px
				width : 22px
				height : 12px
				bg-image('bulletin')
				background-size : contain
			.bulletin__text
				vertical-align : top
				margin : 0 4px
				font-size : 10px
			.icon-keyboard_arrow_right
				position : absolute
				font-size : 10px
				right : 12px
				top : 8px
		.background
			position : absolute
			// overflow : hidden
			top : 0
			left : 0
			width : 100%
			height : 100%
			z-index : -1
			filter : blur(10px)
			.background__avatar
				width:100%
				height : 100%
		.detail__wrapper
			position : fixed
			z-index : 2
			top : 0
			left : 0
			width : 100%
			height : 100%
			overflow : auto
			background-color : rgba(7,17,27,0.8)
			backdrop-filter:blur(10px)
			&.fade-enter-active, &.fade-leave-active
				transition : opacity .5s
			&.fade-enter, &.fade-leave-to
				opacity : 0
			.detail__content
				width : 100%
				min-height : 100%
				.content__main
					margin-top : 64px
					padding-bottom : 64px
					// margin-bottom : 64px
					.main__title
						line-height : 16px
						text-align : center
						font-size : 16px
						font-weight : 700
					.main__star-wrapper
						margin-top : 18px
						padding : 2px 0
						text-align : center
					.main__discount-info
						display : flex
						width : 80%
						margin : 28px auto 24px auto
						.info__line
							flex : 1
							position : relative
							top : -6px
							border-bottom : 1px solid rgba(255,255,255,0.2)
						.info__text
							padding : 0 12px
							font-size : 14px
							font-weight : 700
					.main__supports
						width : 80%
						margin : 0 auto
						.support__item
							padding : 0 12px
							margin-bottom : 12px
							font-size : 0
							&:last-child
								margin-bottom : 0
							.item__icon
								display : inline-block
								width : 16px
								height : 16px
								vertical-align : top
								margin-right : 6px
								background-size : contain
								background-repeat : no-repeat
								&.decrease
									bg-image('decrease_2')
								&.discount
									bg-image('discount_2')
								&.guarantee
									bg-image('guarantee_2')
								&.invoice
									bg-image('invoice_2')
								&.special
									bg-image('special_2')
							.item__text
								// vertical-align : top
								line-height : 16px
								font-size : 12px
					.main__bulletin
						width : 80%
						margin : 0 auto
						.bulletin__content
							padding : 0 12px
							line-height : 24px
							font-size : 12px
			.detail__close
				position : relative
				width : 32px
				height : 32px
				margin : -64px auto 0 auto
				clear : both
				font-size : 32px
</style>
