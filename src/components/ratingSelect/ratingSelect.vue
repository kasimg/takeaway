<template>
	<div class="ratingSelect">
		<div class="rating__type border-1px">
			<!-- 根据不同的类别确定对应的class，不同类别，不同样式 -->
			<span class="btn-type positive" :class="{'active':selectedType===ALL}" @click="toggleType(ALL)">{{desc.all}}
				<span class="type__count">{{ratings.length}}</span>
			</span>
			<span class="btn-type positive" :class="{'active':selectedType===POSITIVE}" @click="toggleType(POSITIVE)">{{desc.positive}}
				<span class="type__count">{{positiveCount}}</span>
			</span>
			<span class="btn-type negative" :class="{'active':selectedType===NEGATIVE}" @click="toggleType(NEGATIVE)">{{desc.negative}}
				<span class="type__count">{{negativeCount}}</span>
			</span>
		</div>
		<div class="rating__switch" :class="{'on':onlyShowContent}" @click="toggleContent">
			<span class="icon-check_circle"></span>
			<span class="switch__text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	const POSITIVE=0;
	const NEGATIVE=1;
	const ALL=2;
	export default {
  	props:{
  		ratings:{
  			type:Array,
  			default(){
  				return []
  			}
  		},

  		// selectedType:{
  		// 	type:Number,
  		// 	default:ALL
  		// },

  		// onlyContent:{
  		// 	type:Boolean,
  		// 	default:false
  		// },

  		desc:{
  			type:Object,
  			default(){
  				return {
  					all:'全部',
  					positive:'满意',
  					negative:'不满意'
  				}
  			}
  		}
  	},

  	data(){
  		return {
  			POSITIVE,
  			NEGATIVE,
  			ALL,
  			selectedType:ALL,
  			onlyShowContent:false
  		}
  	},

  	computed:{
  		allCount(){
  			return this.ratings.length;
  		},

  		positiveCount(){
  			return this.ratings.filter((rating)=>{
  				return rating.rateType===POSITIVE
  			}).length;
  		},

  		negativeCount(){
  			return this.ratings.length-this.positiveCount;
  		}
  	},

  	methods:{
  		toggleType(type){
  			// console.log(this.type);
  			this.selectedType=type;
  			this.$emit('toggleType',type);
  		},

  		toggleContent(){
  			this.onlyShowContent=!this.onlyShowContent;
  			this.$emit('toggleContent',this.onlyShowContent);
  		}
  	},

  	created(){
  		// this.selectedType=this.selectedType;
  		// this.onlyShowContent=this.onlyContent;
  	},
	};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import "../../common/stylus/mixin"
	.ratingSelect
		.rating__type
			padding : 18px 0
			margin : 0 18px
			border-1px(rgba(7,17,27,0.1))
			font-size : 0
			.btn-type
				display : inline-block
				padding : 8px 12px
				margin-right : 8px
				border-radius : 1px
				color : rgb(77,85,93)
				font-size : 12px
				&.active
					color : #fff
				.type__count
					font-size : 8px
					margin-left : 2px
					// line-height : value
				&.positive
					background : rgba(0,160,220,0.2)
					&.active
						background : rgb(0,160,220)
				&.negative
					background : rgba(77,85,93,0.2)
					&.active
						background : rgb(77,85,93)
		.rating__switch
			padding : 12px 18px
			line-height : 24px
			border-bottom : 1px solid rgba(7,17,27,0.1)
			color : rgb(147,153,159)
			&.on
				.icon-check_circle
					color : #00c850
			.icon-check_circle,.switch__text
				display : inline-block
				vertical-align : top
			.icon-check_circle
				margin-right : 4px
				font-size : 24px
			.switch__text
				font-size : 12px
</style>
