<template>
	<div class="cartcontrol">
		<transition name="move">
			<span v-show="food.count>0"
			  @click="decrease($event)"
			>
				<i class="inner cart-decrease"></i>
			</span>
		</transition>
		
		<span class="cart-count"
			  v-show="food.count"
		>
			{{food.count}}
		</span>
		<span @click="add($event)"><i class="cart-add"></i></span>
	</div>
</template>

<script>
import Vue from 'vue'
import {bus} from '../../bus.js'
	
	export default {
		props: {
			food: {
				type: Object
			}
		},
		created() {

		},
		methods: {
			add(event) {
				if(!event._constructed) {
					return
				}
				//添加count属性
				if(!this.food.count) {
					Vue.set(this.food,'count',1)
				} else {
					this.food.count++
				}
				//用于下落小球
				this.$emit('cartadd',event.target)
				//用于详情页的下落小球，bus为中央事件总线
				bus.$emit('cartadd',event.target)
			},
			decrease(event) {
				if(!event._constructed) {
					return
				}
				if(this.food.count > 0) {
					this.food.count--
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/index.scss";

	.move-enter,.move-leave-active {
		opacity: 0;
		transform: translate3d(70px,0,0) rotate(180deg);
	}

	.move-enter-active,.move-leave-active {
		transition: all 0.3s linear;
	}

	.cartcontrol {
		background: #fff;
		font-size: 0;
		position: relative;
		span {
			padding: 0 size(12);
		}
		span,.cart-decrease,.cart-count,.cart-add {
			display: inline-block
		}
		.cart-decrease {
			width: size(44);
			height: size(44);		
			background: url(./remove_circle_outline.svg);
			background-size: 100%;
		}
		.cart-add {
			width: size(42);
			height: size(42);
			color: #fff;
			background: url(./add_circle.svg);
			background-size: 100%;
		}
		.cart-count {
			@include font-size(12px);
			vertical-align: top;
			margin-top: size(10);
			padding: size(5);
			color: rgb(147,153,159);
		}
	}
</style>