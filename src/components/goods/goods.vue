<template>
	<!-- 商品页面总览 -->
	<section class="goods">
		<!-- 左侧分类导航栏容器 -->
		<aside class="menu-wrapper" ref="menuWrapper">
			<!-- 渲染导航列表 -->
			<ul>
				<!-- 绑定classcurrent，判断当前列表项是否被选中，点击事件用于和右侧商品栏绑定位置，点击后右侧滚动到相应位置 -->
				<li v-for="(goodsClassification, index) in goods" class="menu__item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
					<span class="item__text border-1px">
						<!-- 事先定义类名数组classMap，对应类别的type值，再绑定，动态变化图标的类；另外，type>0表示有特殊图标，这时才显示 -->
						<span class="item__icon" :class="classMap[goodsClassification.type]" v-if="goodsClassification.type>0"></span>{{goodsClassification.name}}
					</span>
				</li>
			</ul><!-- 渲染导航列表 -->
		</aside><!-- 左侧分类导航栏容器 -->
		<!-- 右侧商品栏容器 -->
		<figure class="goods-wrapper" ref="foodsWrapper">
			<!-- 列表渲染 -->
			<ul>
				<!-- 遍历所有类别，每个类别作为第一层列表元素 -->
				<li v-for="goodsClassification in goods" class="goods-item goods-item-hook">
					<!-- 类别名称 -->
					<h1 class="goods__title">{{goodsClassification.name}}</h1><!-- 类别名称 -->
					<ul>
						<!-- 遍历每个类别中的所有商品，每个商品作为第二层列表 -->
						<li v-for="foodItem in goodsClassification.foods" class="food-item border-1px" @click="showInfo(foodItem,$event)">
							<!-- 商品图标 -->
							<div class="food__icon">
								<img :src="foodItem.icon" width="57px" height="57px">
							</div><!-- 商品图标 -->
							<!-- 商品内容区域 -->
							<div class="food__content">
								<!-- 商品名称 -->
								<h2 class="content__name">{{foodItem.name}}</h2><!-- 商品名称 -->
								<!-- 商品描述 -->
								<p class="content__desc">{{foodItem.description}}</p><!-- 商品描述 -->
								<!-- 月销量以及好评数 -->
								<div class="content__extral">
									<span class="extral__count">月售{{foodItem.sellCount}}份</span><span>好评率{{foodItem.rating}}%</span>
								</div><!-- 月销量以及好评数 -->
								<!-- 价格 -->
								<div class="content__price">
									<span class="price__current">￥{{foodItem.price}}</span><span class="price__old" v-if="foodItem.oldPrice">￥{{foodItem.oldPrice}}</span>
								</div><!-- 价格 -->
								<!-- 控制加减数量，并将改变反映到food对象本身 -->
								<div class="cartControl-wrapper">
									<!-- 绑定点击事件，监听子组件（这里是+-按钮组件）触发的addCart事件 ，并执行_drop事件作为回应。点击+-按钮后，将按钮组件传入goods，再在goods中调用子组件shopcart中的方法，完成两个子组件的联动，最终实现了在goods中点击+-按钮小球落入shopcart组件的效果-->
									<cart-control :food="foodItem" @addCart="_drop"></cart-control>
								</div><!-- 控制加减数量，并将改变反映到food对象本身 -->
							</div><!-- 商品内容区域 -->
						</li><!-- 遍历每个类别中的所有商品，每个商品作为第二层列表 -->
					</ul>
				</li><!-- 遍历所有类别，每个类别作为第一层列表元素 -->
			</ul><!-- 列表渲染 -->
		</figure><!-- 右侧商品栏容器 -->
		<shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectedFoods="selectedFoods" ref="shopcart"></shopcart>
		<good-info :shown="infoShown" :food="clickedFood" @hideInfo="hideInfo" ref="goodInfoWrapper" @addCart="_drop"></good-info>
	</section><!-- 商品页面总览 -->
</template>

<script>
import BScroll from 'better-scroll';
import shopcart from 'components/shopcart/shopcart';
import cartControl from 'components/cartControl/cartControl';
import goodInfo from 'components/goodInfo/goodInfo';
import Vue from 'vue';

const ERR_OK = 0;
export default {

	props: {
		// 商家信息对象
		seller: {
			type: Object
		}
	},

	data() {
		return {
			// 在这里先定义，确保能被动态监听，之后再created函数中被初始化
			goods: [],
			// 存放商品列表项距离容器顶部的高度信息
			listHeight: [],
			// 表示可视区域顶部距离容器顶部的距离（滚动距离）
			scrollY: 0,
			// 控制商品详情页的显示与隐藏
			infoShown:false,
			//传入商品详情页的food对象
			clickedFood:{}
		};
	},

	computed: {
		//返回当前视区对应的索引
		currentIndex() {
			for (let i = 0; i < this.listHeight.length; i++) {
				// top表示当前商品列表项顶部距离容器顶部的距离
				let top = this.listHeight[i];
				// bottom表示下一个列表顶部距离容器顶部的距离，也就是当前列表项底部距离容器顶部的距离
				let bottom = this.listHeight[i + 1];
				//若视区（滚动距离）落在当前列表项范围就返回当前额索引
				if (!bottom || (this.scrollY >= top && this.scrollY < bottom)) {
					return i;
				}
			}
			// return 0;
		},
		// 返回被选中的food对象
		selectedFoods() {
			let foods = [];
			// 遍历每个类别
			this.goods.forEach((good) => {
				// 遍历每个类别中的商品
				good.foods.forEach((food) => {
					// 要是有count属性，说明其对应的+-按钮组件被点击了，那么也说明它被选中了，就把他加入到selectedFoods中传递到购物车子组件中
					if (food.count) {
						foods.push(food);
					}
				});
			});
			return foods;
		}
	},

	created() {
		// 定义图表类和type值的映射数组
		this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
		//获取货物信息
		// this.$http.get('/api/goods').then((response) => {
			// console.log(response);
			// response = response.body;
			// if (response.errno === ERR_OK) {
				// 给事先定义的goods赋值
				// this.goods = response.data;
				this.$nextTick(() => {
					// 待到下次dom更新时，再调用这里的内容，否则滚动插件获取的dom高度是渲染之前的，会出问题
					this._initScroll(); //初始化滚动插件
					this._calculateHeight();
				});
			// }
		// });

		let appData = require('../../../data.json');
		this.goods=appData.goods;
		// console.log('appData\n');
		// console.log(appData);
	},

	methods: {
		//判断用户设备
		isPC() {
			var userAgentInfo = navigator.userAgent;
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
			var flag = true;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		},

		_initScroll() {
			//根据不同平台做相应处理
			if (this.isPC()) {
				console.log('pc');
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					// probeType: 3 //设置探针，滚动时获取滚动的位置,设置了这个参数才能监听滚动
				});
			} else {
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {
					click: true //在移动端，better-scorll初始化时阻止了一些默认行为，要另外设置参数解除阻止
					//而在pc端，加上这句话反而点击无效，去掉点击生效
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					probeType: 3, //设置探针，滚动时获取滚动的位置,设置了这个参数才能监听滚动
					click: true
				});
			}
			// 监听滚动事件，将滚动距离取整后赋值给scrollY变量
			this.foodsScroll.on('scroll', (pos) => {
				this.scrollY = Math.abs(Math.round(pos.y));
			});
		},
		// 计算每个列表项顶部距离容器顶部的距离
		_calculateHeight() {
			// 首先获取事先标记好的dom元素，也就是列表项dom元素
			let foodList = this.$refs.foodsWrapper.getElementsByClassName('goods-item-hook');
			// 第一个列表项和容器顶部重合，距离为0
			let height = 0;
			// 将距离信息存入数组
			this.listHeight.push(height);
			for (let i = 0; i < foodList.length; i++) {
				let item = foodList[i];
				// 距离容器顶部的距离通过累加各个列表项的高度来获取
				height += item.clientHeight;
				this.listHeight.push(height);
			}
		},
		// 点击左侧商品类别后触发滚动事件
		selectMenu(index, event) {
			// 想要滚动到某一个dom（商品列表项）的位置，先动过index获取这个dom
			let foodList = this.$refs.foodsWrapper.getElementsByClassName('goods-item-hook');
			let el = foodList[index];
			// 滚动到该位置，这里应该是将滚动距离置为该dom距离容器顶部的距离，滚动时间为600ms
			this.foodsScroll.scrollToElement(el, 600);
		},

		//调用shopcart中的drop方法
		_drop(target) {
			// 异步执行下落动画，优化体验
			this.$nextTick(() => {
				this.$refs.shopcart.drop(target);
			});
		},

		showInfo(foodItem,event){
			// 给选定的商品赋值，因为是绑定在详情页标签页上，所以也当做参数传入
			this.clickedFood=foodItem;
			this.infoShown=true;
			this.$refs.goodInfoWrapper.refreshScoll();
			//初始化滚动条的函数可以抽象出来
			// this.$nextTick(()=>{
			// 	if(!this.goodInfoScoll){
			// 		// console.log(this.$refs.goodInfoWrapper);
			// 		this.goodInfoScoll=new BScroll(this.$refs.goodInfoWrapper.$el,{
			// 			click:true
			// 		});
			// 	}else{
			// 		this.goodInfoScoll.refresh();
			// 	}
			// });
		},

		hideInfo(){
			this.infoShown=false;
		}
	},

	components: {
		shopcart,
		cartControl,
		goodInfo
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import "../../common/stylus/mixin"
	.goods
		display : flex
		position : absolute
		top : 174px
		bottom : 46px
		width : 100%
		overflow : hidden
		.menu-wrapper
			flex : 0 0 80px
			width : 80px
			background : #f3f5f7
			.menu__item
				display : table
				// text-align : center
				padding : 0 12px
				height : 54px
				width : 56px
				line-height : 14px
				&.current
					position : relative
					z-index : 10
					margin-top : -1px
					background : #fff
					font-weight : 700
					.item__text
						border-none()
				.item__icon
					// 多处复用，待抽象成组件
					display : inline-block
					vertical-align : top
					width : 12px
					height : 12px
					margin-right : 2px
					background-size : 12px 12px
					background-repeat : no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.item__text
					display : table-cell
					// text-align : center
					width : 56px
					vertical-align : middle
					border-1px(rgba(7,17,27,0.1))
					font-size : 12px
		.goods-wrapper
			flex : 1
			.goods-item
				.goods__title
					padding-left : 14px
					height : 26px
					line-height : 26px
					border : 2px solid #d9dde1
					font-size : 12px
					color : rgb(147,153,159)
					background : #f3f5f7
				.food-item
					display : flex
					margin : 18px
					padding-bottom : 18px
					border-1px(rgba(7,17,27,0.1))
					&:last-child
						border-none()
						margin-bottom : 0
					.food__icon
						flex : 0 0 57px
						margin-right : 10px
						// height : 57px
						// width : 57px
					.food__content
						flex : 1
						.content__name
							margin : 2px 0 8px 0
							height : 14px
							line-height : 14px
							font-size : 14px
							color : rgb(7,17,27)
						.content__desc,.content__extral
							line-height : 10px
							font-size : 10px
							color : rgb(147,153,159)
						.content__desc
							line-height : 12px
							margin-bottom : 8px
						.content__extral
							.extral__count
								margin-right : 12px
						.content__price
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
						.cartControl-wrapper
							position : absolute
							right : 0
							bottom : 12px
</style>
