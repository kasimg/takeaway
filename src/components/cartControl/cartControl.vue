<template>
	<section class="cart-control">
		<transition name="move">
			<figure class="cart__substract icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="substractCart">
				<!-- <i class="substract__inner icon-remove_circle_outline"></i> -->
			</figure>
		</transition>
		<figure class="cart__count"  v-show="food.count>0">{{food.count}}</figure>
		<figure class="cart__add icon-add_circle" @click.stop.prevent="addCart"></figure>
	</section>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';
	export default {
		props: {
			food: {
				type: Object
			}
		},

		methods: {
			addCart() {
				// console.log('click');
				if (!this.food.count) {
					// console.log('no count');
					// 直接设置属性不能动态观测，要使用这种方法才行
					Vue.set(this.food, 'count', 1);
				} else {
					// 这里的food.count也会影响父组件中的food.count，因为传入的参数是引用（地址）
					this.food.count++;
					// console.log('数量+1');
				}

				this.$emit('addCart', event.target);
			},

			substractCart() {
				// 因为count大于0时标签才显示，所以无需判断count是否存在
				this.food.count--;
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.cart-control
		font-size : 0
		.cart__substract,.cart__count,.cart__add
			display : inline-block
		.cart__substract,.cart__add
			padding : 6px
			line-height : 24px
			font-size : 24px
			color : rgb(0,160,220)
		.cart__substract
			&.move-enter-active, &.move-leave-active
				transition : all .5s
			&.move-enter, &.move-leave-to
				transform : translate3D(36px,0,0) rotate(240deg)
				opacity : 0
			// &.move-enter-to,&.move-leave
			// 	transform : translate3D(0,0,0)
		.cart__count
			vertical-align : top
			width : 12px
			padding-top : 6px
			line-height : 24px
			text-align : center
			font-size : 10px
			color : rgb(147,153,159)
</style>
