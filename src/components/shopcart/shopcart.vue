<template>
	<!-- 组件总体 -->
	<figure class="shopcart">
		<!-- 静态呈现的内容（hightlight加在外层标签控制内部样式，主要是左边购物车图标和价格样式，减少css中写hight样式的次数，也更加清晰明了，整个内容部分绑定了点击事件控制列表的呈现与隐藏） -->
		<div class="shopcart__content" :class="{'highlight':totalCount>0}" @click="toggleList">
			<!-- 左边的部分（包括购物车图标、总价、配送费信息等） -->
			<div class="content__left">
				<!-- 购物车图标 -->
				<div class="left__logo-wrapper">
					<div class="logo">
						<i class="icon-shopping_cart"></i>
					</div>
					<!-- 上面的小图标只有在totalCount>0时才显示 -->
					<div class="count" v-show="totalCount>0">{{totalCount}}</div><!-- 上面的小图标只有在totalCount>0时才显示 -->
				</div><!-- 购物车图标 -->
				<!-- 总价 -->
				<div class="left__price">￥{{totalPrice}}</div><!-- 总价 -->
				<!-- 配送费信息 -->
				<div class="left__desc">另需配送费￥{{deliveryPrice}}元</div><!-- 配送费信息 -->
			</div><!-- 左边的部分 -->
			<!-- 右边的部分（包括是否满足起送费的信息） -->
			<div class="content__right">
				<!-- 满足起送费则改变样式（蓝底白字）并将文字改成“去结算”，详情可见payDesc变量，绑定点击事件，即结算事件，并取消冒泡和默认行为，防止点击去结算按钮依然弹出购物车列表 -->
				<div class="right__min-price" :class="{'enough':totalPrice>=minPrice}" @click.stop.prevent="pay">
					{{payDesc}}
				</div>
			</div><!-- 右边的部分 -->
			<!-- 小球抛物线动画容器 -->
			<div class="content__ball-container">
				<!-- 因为小球起始下落位置和+-按钮组件位置有关，所以不能在css中写死，于是用js钩子函数监听过渡过程，在js中动态规定小球下落初始位置 -->
				<transition-group tag="div" name="drop" @before-enter="beforeEnter"
																								@enter="enter"
																								@after-enter="afterEnter">
					<!-- 因为抛物线两个方向的速度不一样，必须要两个transition控制，所以外层容器负责一个方向的变化，内层负责另一个方向变化。这里外层负责y方向，因为y方向位移是不固定的，里层负责x方向，x方向位移固定 -->
					<div v-for="ball in balls" v-show="ball.show" :key="ball.id" class="ball-wrapper">
							<div class="ball"></div>
					</div>
				</transition-group>
			</div><!-- 小球抛物线动画容器 -->
		</div><!-- 静态呈现的内容 -->
		<!-- 购物车列表 -->
		<transition name="moveUp">
			<!-- 列表容器（fold控制显示与隐藏） -->
			<div class="shopcart__list" v-show="!fold">
				<!-- 列表头部（包括购物车文字和清空按钮） -->
				<div class="list__header">
					<h1 class="header__title">购物车</h1>
					<!-- 清空按钮，处理清空购物车事件（将所有selectedFoods中的food元素的count属性置为0） -->
					<span class="header__btn-clear" @click="clearList">清空</span>
				</div><!-- 列表头部 -->
				<!-- 列表项容器 -->
				<div class="list__text" ref="listContent">
					<ul>
						<!-- 列表项 -->
						<transition-group name="itemLeave">
							<!-- 绑定了列表项离开时的动画 -->
							<li class="text__food border-1px" v-for="food in selectedFoods" :key="food.name">
								<span class="food__name">{{food.name}}</span>
								<div class="food__price">
									<span>￥{{food.price*food.count}}</span>
								</div>
								<!-- +-按钮组件容器 -->
								<div class="food__cartControl-wrapper">
									<cart-control :food="food"></cart-control>
								</div><!-- +-按钮组件容器 -->
							</li>
						</transition-group><!-- 列表项 -->
					</ul>
				</div><!-- 列表项容器 -->
			</div><!-- 列表容器 -->
		</transition><!-- 购物车列表 -->
		<transition name="fade">
			<div class="shopcart__list-mask" v-show="!fold" @click="hideList"></div>
		</transition>
	</figure><!-- 组件总体 -->
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
// 引入+-按钮组件和滚动js组件
import cartControl from 'components/cartControl/cartControl';
import BScroll from 'better-scroll';

// const BALL_NUM = 5;
export default {
	components: {
		// 注册+-按钮组件
		cartControl
	},

	props: {
		// 配送价格，由父组件传入
		deliveryPrice: {
			type: Number,
			default: 0
		},
		// 起送价
		minPrice: {
			type: Number,
			default: 0
		},
		// 渲染购物车列表时用到，根据父组件goods中被点击的+-组件对应的food对象生成
		selectedFoods: {
			type: Array,
			default () {
				return [{
					price: 25,
					count: 1
				}];
			}
		}

	},

	computed: {
		// 根据被选中的所有food的总价生成
		totalPrice() {
			let total = 0;
			this.selectedFoods.forEach((food) => {
				total += food.price * food.count;
			});
			return total;
		},
		// 被选中的food的总量
		totalCount() {
			let count = 0;
			this.selectedFoods.forEach((food) => {
				count += food.count;
			});
			if (count===0){
				this.fold=true;
			}
			return count;
		},
		// 控制右侧文字（起送信息）
		payDesc() {
			if (this.totalPrice === 0) {
				return `￥${this.minPrice}元起送`;
			} else if (this.totalPrice < this.minPrice) {
				let diff = this.minPrice - this.totalPrice;
				return `还差￥${diff}元起送`;
			} else {
				return '去结算';
			}
		},
		// 控制列表的显示与隐藏，这里要注意，只有当fold为false（表示列表处于非折叠状态）
		// listShow(){
		// 	if(!this.totalCount){
		// 		this.fold=true;
		// 		return false;
		// 	}
		// 	return !this.fold;
		// }
	},

	created() {
		// 用nextTick防止滚动组件获取dom高度时dom还没有成功渲染，所以在下一次dom发生变化的时候再初始化
		this.$nextTick(() => {
			// console.log(this.$refs);
			this.scroll = new BScroll(this.$refs.listContent, {
				click: true
			});
		});
	},

	data() {
		return {
			balls: [{
				show: false,
				id: 0
			}, {
				show: false,
				id: 1
			}, {
				show: false,
				id: 2
			}, {
				show: false,
				id: 3
			}, {
				show: false,
				id: 4
			}],

			droppedBalls: [],

			fold: true,
		};
	},

	methods: {
		drop(target) {
			// console.log(target);
			// 找一个show属性为false的ball
			for (let i = 0; i < this.balls.length; i++) {
				let ball = this.balls[i];
				// 点击一次，找一个能用的ball
				if (!ball.show) {
					ball.show = true;
					ball.el = target;
					// 动画播放玩之后要将用完的ball的show属性重新置为false以复用，droppedBalls的意义在于存放用过的ball，让动画播放完的钩子函数能够准确知道要重置哪一个ball，如果在钩子函数中遍历balls并重置show属性为true的ball，由于正在下落的ball的show也是true所以它们也被强制置为false就直接消失了。综上需要让ball动画播放完之后再重置，所以用一个容器（队列）将它们装起来，用完出队列，重置属性
					this.droppedBalls.push(ball);
					return;
				}
			}
		},

		//定义动画钩子函数
		beforeEnter(el) {
			// console.log(el);
			// 参数el是当前的渲染小球的dom元素，ball.el是cartControl组件dom，不一样
			let count = this.droppedBalls.length;
			while (count--) {
				let ball = this.droppedBalls[count];
				if (ball.show) {
					// 获取元素相当于视口的位置
					let rect = ball.el.getBoundingClientRect();
					// 计算偏移量
					let x = rect.left - 24;
					let y = -(window.innerHeight - rect.top - 50);
					// 设置进入的起始位置
					el.style.webkitTransform = `translate3d(0,${y}px,0)`;
					el.style.transform = `translate3d(0,${y}px,0)`;
					let innerBall = el.getElementsByClassName('ball')[0];
					innerBall.style.webkitTransform = `translate3d(${x}px,0,0)`;
					innerBall.style.transform = `translate3d(${x}px,0,0)`;
					return; //必须用return，否则el.style总是被索引为0的ball的属性覆盖
				}
			}
		},
		enter(el) {
			/*eslint-disable no-unused-vars*/
			// 触发重绘，去掉好像也没有区别
			let rf = el.offestHeight;
			// 异步更新style状态，否则transform属性会瞬间变成下面的值，没有动画效果
			this.$nextTick(() => {
				el.style.webkitTransform = 'translate3d(0,0,0)';
				el.style.transform = 'translate3d(0,0,0)';
				let innerBall = el.getElementsByClassName('ball')[0];
				innerBall.style.webkitTransform = `translate3d(0,0,0)`;
				innerBall.style.transform = `translate3d(0,0,0)`;
			});
		},
		afterEnter(el) {
			// ball用完后出队列，并重置属性
			let ball = this.droppedBalls.shift();
			if (ball) {
				ball.show = false;
			}
		},
		// 点击左侧内容区域弹出购物车列表
		toggleList() {
			// 如果没选中任何商品，那么购物车为空，就无法显示
			if (!this.totalCount) {
				return;
			}
			// 若选择了商品，则可以显示
			this.fold = !this.fold;
			// 显示后刷新滚动状态，若不刷新则会停留在上一次滚动的位置而不是开头
			if (!this.fold) {
				this.scroll.refresh();
			}
		},
		// 清空列表
		clearList() {
			// 将所有选中的food对象的count置为0，通过动态绑定清空列表（没有列表项被渲染）
			this.selectedFoods.forEach((food) => {
				food.count = 0;
			});
			this.fold=true;
		},
		// 点击购物车上方黑色背景折叠购物车列表
		hideList() {
			this.fold = true;
		},

		//点击去支付触发
		pay() {
			if (this.totalPrice < this.minPrice) {
				return;
			}
			// 暂时先弹出弹窗，后续实现具体逻辑
			window.alert(`支付${this.totalPrice}元`);
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import "../../common/stylus/mixin.styl";
	.shopcart
		position : fixed
		left : 0
		bottom : 0
		z-index : 10
		width : 100%
		height : 48px
		// background : #000
		.shopcart__content
			display : flex
			z-index : 0
			background : #141d27
			font-size : 0
			color : rgba(255,255,255,0.4)
			&.highlight
				.logo
					background : rgb(0,160,220) !important
				.icon-shopping_cart
					color : #fff
				.left__price
					color : #fff
			.content__left
				flex : 1
				.left__logo-wrapper,.left__price,.left__desc
					display : inline-block
					vertical-align : top
				.left__logo-wrapper
					position : relative
					top : -10px
					margin : 0 12px
					padding : 6px
					width : 56px
					height : 56px
					box-sizing : border-box
					border-radius : 50%
					background : #141d27
					// transition : all 0.3s
					.logo
						text-align : center
						width : 100%
						height : 100%
						border-radius : 50%
						background : #2b343c
						transition : all 0.3s
						.icon-shopping_cart
							line-height : 44px
							font-size : 24px
					.count
						position : absolute
						top : 0
						right : 0
						height : 16px
						width : 24px
						line-height : 16px
						text-align : center
						border-radius : 16px
						font-size : 9px
						font-weight : 700
						color : #fff
						background : rgb(240,20,20)
						box-shadow : 0 4px 8px 0 rgba(0,0,0,0.4)
						// transition : all 0.3s
				.left__price
					margin-top : 12px
					line-height : 24px
					padding-right : 12px
					box-sizing : border-box
					border-right : 1px solid rgba(255,255,255,0.1)
					font-size : 16px
					font-weight : 700
					// &.highlight
					// 	color : #fff
				.left__desc
					line-height : 24px
					margin : 12px 0 0 12px
					font-size : 10px
			.content__right
				flex : 0 0 105px
				width : 105px
				.right__min-price
					height : 48px
					line-height : 48px
					text-align : center
					font-size : 12px
					font-weight : 700
					background : #2b333b
					&.enough
						background : #00b43c
						color : #fff
			.content__ball-container
				.ball-wrapper
					position : fixed
					left : 32px
					bottom : 22px
					z-index : 200
					height : 20px
					width : 20px
					// border-radius : 50%
					&.drop-enter-active
						transition : all .8s cubic-bezier(.42,-0.31,1,.46)
						// .ball
						// 	transition : all .8s
					.ball
						width : 100%
						height : 100%
						background : rgb(0,160,220)
						border-radius : 50%
						transition : all .8s linear
		.shopcart__list
			position : absolute
			left : 0
			bottom : 48px
			z-index : -1
			// top : 0
			width : 100%
			// padding-bottom : 40px
			// transition : all .8s
			.list__header
				height : 40px
				line-height : 40px
				padding : 0 18px
				background : #f3f5f7
				border-bottom : 1px solid rgba(7,17,27,.1)
				transition : all .8s
				.header__title
					float : left
					font-size : 14px
					color : rgb(7,17,27)
				.header__btn-clear
					float : right
					font-size : 12px
					color : rgb(0,160,220)
			.list__text
				padding : 0 18px
				max-height : 217px
				overflow : hidden
				background : #fff
				font-size : 12px
				color : #000
				// padding-bottom : 20px
				.text__food
					position : relative
					padding : 12px 0
					box-sizing : border-box
					border-1px(rgba(7,17,27,.1))
					transition : all 1s
					// 添加过渡效果
					&.itemLeave-leave-active
						position : absolute
					&.itemLeave-enter,&.itemLeave-leave-to
						transform : translate3d(500px,0,0)
						opacity : 0
					.food__name
						line-height : 24px
						font-size : 14px
						color : rgb(7,17,27)
					.food__price
						position : absolute
						right : 90px
						bottom : 12px
						line-height : 24px
						font-size : 14px
						font-weight : 700
						color : rgb(240,20,20)
					.food__cartControl-wrapper
						position : absolute
						right : 0
						bottom : 6px
			// 定义过渡
			&.moveUp-enter-active,&.moveUp-leave-active
				transition : all .8s
				// .list__header
				// 	position : absolute
			&.moveUp-enter,&.moveUp-leave-to
				transform : translate3d(0,257px,0)
				// opacity : 0
		.shopcart__list-mask
			position : fixed
			top : 0
			left : 0
			width : 100%
			height : 100%
			z-index : -2
			background : rgba(7,17,27,.6)
			backdrop-filter:blur(5px)
			// opacity : 0.8
			&.fade-enter-active,&.fade-leave-active
				transition : all .8s
			&.fade-enter,&.fade-leave-to
				backdrop-filter:blur(0)
				background : rgba(0,0,0,0)
			
</style>
