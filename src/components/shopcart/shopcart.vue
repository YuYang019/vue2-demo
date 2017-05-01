<template>
<div>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo"
						 :class="{'highlight':totalCount>0}"
					>
						<span class="shopping_cart"
							  :class="{'active':totalCount>0}"
						></span>
					</div>
					<div class="num"
						 v-show="totalCount>0"
					>{{totalCount}}</div>	
				</div>
				<div class="price"
					 :class="{'highlight':totalPrice>0}"
				>¥
				{{totalPrice}}</div>
				<div class="desc">另需配送费¥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click.stop="pay">
				<p class="pay"
				   :class="payClass"
				>
					{{payDesc}}
				</p>
			</div>
		</div>
		<div class="ball-container">
			<div v-for="ball in balls">
				<transition 
					name="drop"
					@before-enter="beforeEnter"
  					@enter="enter"
  					@after-enter="afterEnter"
				>
					<div class="ball" 		 
					 	v-show="ball.show"
					>
						<div class="inner"></div>	
					</div>
				</transition>
			</div>
				
				
		</div>
		<transition name="fold">
			<div class="shopcart-list" v-show="listShow">
			<div class="list-header">
				<h1 class="title">购物车</h1>
				<span class="empty" @click="empty">清空</span>
			</div>
			<div class="list-content" ref="listContent">
				<ul>
					<li class="food" v-for="food in selectFoods">
						<span class="name">{{food.name}}</span>
						<span class="price">¥{{food.price*food.count}}</span>
						<div class="cartcontrol-wrapper">
							<cartcontrol :food="food" @cartadd="_drop"></cartcontrol>
						</div>
					</li>
				</ul>
			</div>
			</div>
		</transition>			
	</div>
	<transition name="fade">
		<div class="list-mask" v-show="listShow" @click="hideList"></div>
	</transition>
</div>
	
</template>

<script>
	import BScroll from 'better-scroll'
	import cartcontrol from 'components/cartcontrol/cartcontrol'
	
	export default {
		props: {
			selectFoods:{
				type: Array,
				default() {
					return []
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls: [],
				fold: true
			}
		},
		computed: {
			totalPrice() {
				let total = 0
				this.selectFoods.forEach((food) => {
					total += food.price * food.count
				})
				return total
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count
				})
				return count
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return `¥${this.minPrice}元起送`
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice
					return `还差${diff}元起送`
				} else {
					return '去结算'
				}
			},
			payClass() {
				if (this.totalPrice >= this.minPrice) {
					return 'enough'
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true
					return false
				}
				let show = !this.fold
				if (show) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent,{
								click: true
							})
						} else {
							this.scroll.refresh()
						}
					})
				}
				return show
			}
		},
		methods: {
			//本身列表的下落小球
			_drop(el) {
				this.drop(el)
			},
			//变更小球的属性
			drop(el) {
				for (let i=0; i<this.balls.length; i++) {
					var ball = this.balls[i]
					if (!ball.show) {
						ball.show = true
						ball.el = el
						this.dropBalls.push(ball)
						//跳出循环
						return
					}
				}
			},
			beforeEnter: function (el) {
			 	let count = this.balls.length
			 	//遍历balls，给show＝true的小球设置下落时的初始位置
			 	while(count--) {
			 		let ball = this.balls[count]
			 		if (ball.show) {
			 			let rect = ball.el.getBoundingClientRect() //
			 			let x = rect.left - 64
			 			let y = -(window.innerHeight - rect.top - 44)
			 			el.style.display = 'block'
			 			el.style.webKitTransfrom = `translate3d(0,${y}px,0)`
			 			el.style.transform = `translate3d(0,${y}px,0)`
			 			let inner = el.getElementsByClassName('inner')[0]
			 			inner.style.webKitTransfrom = `translate3d(${x}px,0,0)`
			 			inner.style.transform = `translate3d(${x}px,0,0)`
			 		}
			 	}
  			},
  			enter: function (el, done) {
  				//触发重绘，防止小球堆积在左下角
  				let refresh = el.offsetHeight
  				this.$nextTick(() => {
  					el.style.webKitTransfrom = 'translate3d(0,0,0)'
			 		el.style.transform = 'translate3d(0,0,0)'
			 		let inner = el.getElementsByClassName('inner')[0]
			 		inner.style.webKitTransfrom = `translate3d(0,0,0)`
			 		inner.style.transform = `translate3d(0,0,0)`
			 		//有done才能触发afterEnter
  					el.addEventListener('transitionend', done)
  				})
  				
  			},
  			afterEnter: function (el) {
  				//下落之后，把小球的属性初始化
  				let ball = this.dropBalls.shift()
  				if(ball) {
  					ball.show = false
  					el.style.display = 'none'
  				}
  			},
  			toggleList() {
  				if (!this.totalCount) {
  					return
  				}
  				this.fold = !this.fold
  			},
  			empty() {
  				console.log(this.selectFoods)
  				this.selectFoods.forEach((food) => {
  					food.count = 0;
  				})
  			},
  			hideList() {
  				this.fold = true
  			},
  			pay() {
  				if(this.totalPrice < this.minPrice) {
  					return
  				} else {
  					window.alert(`支付${this.totalPrice}元`)
  				}
  			}
		},
		components: {
			cartcontrol
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/index.scss";

	.shopcart {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 50;
		width: 100%;
		height: size(85);
		.content {
			display: flex;
			background: #141d27;
			color: rgba(255,255,255,0.4);
			.content-left {
				flex: 1;
				.logo-wrapper,.price,.desc {
					display: inline-block;
				}
				.logo-wrapper {
					position: relative;
					top: size(-20);
					margin: 0 size(18) 0 size(18);
					padding: size(10);
					width: size(100);
					height: size(100);
					box-sizing: border-box;
					border-radius: 50%;
					background: #141d27;
					.logo {
						width: 100%;
						height: 100%;
						line-height: size(100);
						border-radius: 50%;
						text-align: center;
						background: #2b343c;
						&.highlight {
							background: rgb(0,160,220)
						}
						.shopping_cart {
							display: inline-block;			
							@include data-dpr('width',24px);
							@include data-dpr('height',24px);
							background: url(./shopping_cart.svg) no-repeat;
							background-size: 100%;
							&.active {
								background: url(./shopping_cart_active.svg) no-repeat;
								background-size: 100%;
							}
						}
					}
					.num {
						position: absolute;
						top: 0;
						right: 0;
						width: size(43);
						height: size(28);
						line-height: size(28);
						text-align: center;
						border-radius: size(32);
						@include font-size(10px);
						font-weight: 700;
						color: #fff;
						background: rgb(240,20,20);
						box-shadow: 0 size(8) size(16) 0 rgba(0,0,0,0.4)
					}
				}
				.price {
					vertical-align: top;
					margin-top: size(18);
					padding-right: size(24);
					line-height: size(48);
					border-right: 1px solid rgba(255,255,255,0.1);
					@include font-size(16px);
					font-weight: bold;
					&.highlight {
						color: #fff;
					}
				}
				.desc {
					vertical-align: top;
					padding-left: size(20);
					line-height: size(85);
					@include font-size(12px);
				} 
			}
			.content-right {
				flex: 0 0 size(180);
				width: size(190);
				.pay {
					line-height: size(85);
					text-align:center;
					background: #2b333b;
					@include font-size(12px);
					font-weight: 700;
					&.enough {
						background: #00b43c;
						color: #fff;
					}
				}
			}
		}
		.ball-container {
			.ball {
				position: fixed;
				left: 64px;
				bottom: 44px;
				z-index: 200;
				.inner {
					width: size(30);
					height: size(30);
					border-radius: 50%;
					background: rgb(0,160,220);
					transition: all 0.3s linear
				}
			}				
		}
		.drop-enter-active {
			transition: all 0.3s cubic-bezier(0.49,-0.29,0.75,0.41);
		}
		.shopcart-list {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			transform: translate3d(0,-100%,0);
			&.fold-enter-active,&.fold-leave-active {
				transition: all 0.5s;
			}
			&.fold-enter,&.fold-leave-active{
				transform: translate3d(0,0,0)
			}
			.list-header {
				height: size(80);
				line-height: size(80);
				padding: 0 size(36);
				background: #f3f5f7;
				border-bottom: 1px solid rgba(7,17,27,0.1);
				.title {
					float: left;
					@include font-size(14px);
					color: rgb(7,17,27)
				}
				.empty {
					float: right;
					@include font-size(12px);
					color: rgb(0,160,220)
				}
			}
			.list-content {
				padding: 0 size(34);
				max-height: size(434);
				overflow: hidden;
				background: #fff;
				.food {
					display: flex;
					position: relative;
					padding: size(24) 0;
					box-sizing: border-box;
					@include border-1px(rgba(7,17,27,0.1));
					.name {
						line-height: size(46);
						@include font-size(14px);
						color: rgb(7,17,27)
					}
					.price {
						position: absolute;
						right: size(180);
						line-height: size(46);
						@include font-size(14px);
						font-weight: 700;
						color: rgb(240,20,20)
					}
					.cartcontrol-wrapper {
						position: absolute;
						right: 0;
						
					}
				}
			}
		} 
		
	}
	.list-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 40;
		opacity: 1;
		background: rgba(7,17,27,0.6);
		backdrop-filter: blur(10px); 
		&.fade-enter,&.fade-leave-active {
			opacity: 0;
		}
		&.fade-enter-active,&.fade-leave-active {
			transition: all 0.5s
		}
	}
</style>










