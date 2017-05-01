<template>
	<transition name="move">
		<div v-show="showFlag" class="food" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image">
					<div class="back" @click="hide">
						<i></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">¥{{food.price}}</span>
     					<span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol @cartadd="_drop" :food="food"></cartcontrol>
					</div>
					<div @click.stop="addFood($event)" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
				</div>
				<split></split>
				<div v-show="food.info" class="info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split v-show="food.info"></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect 
						:selectType="selectType" 
						:onlyContent="onlyContent" 
						:desc="desc" 
						:ratings="food.ratings" 
						@select="selectRating"
						@toggle="toggleContent">
					</ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="item">
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img class="avatar" :src="rating.avatar">
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>	
			</div>
		</div>
	</transition>	
</template>

<script>
    import BScroll from 'better-scroll'
    import cartcontrol from 'components/cartcontrol/cartcontrol'
    import Vue from 'vue'
    import split from 'components/split/split'
    import ratingselect from 'components/ratingselect/ratingselect'
    import {formatDate} from '../../common/js/date'

    const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;

	export default {
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: false,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			}
		},
		methods: {
			_drop(target) {
				this.$emit('cartadd', target)
			},
 			show() {
				this.showFlag = true
				this.selectType = ALL
				this.onlyContent = false
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, {
							click: true
						})
					} else {
						this.scroll.refresh()
					}
				})
			},
			hide() {
				this.showFlag = false
			},
			addFood($event) {
				if(!event._constructed){
					return
				}
				this.$emit('cartadd',event.target)
				Vue.set(this.food, 'count', 1)
			},
			selectRating(type) {
				this.selectType = type
				this.$nextTick(() => {
					this.scroll.refresh()
				})
			},
			toggleContent() {
				this.onlyContent = !this.onlyContent
				this.$nextTick(() => {
					this.scroll.refresh()
				})
			},
			needShow(type, text) {
				if(this.onlyContent && !text) {
					return false;
				}
				if(this.selectType === ALL){
					return true;
				} else {
					return type === this.selectType;
				}
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time)
				return formatDate(date, 'yyyy-MM-dd hh:mm')
			}
		},
		components: {
			cartcontrol,split,ratingselect
		}
	}	
</script>

<style lang="scss">
	@import "../../common/scss/index.scss";
	@import "../../common/scss/icon.css";
	
	.food {
		position: fixed;
		left: 0;
		top: 0;
		bottom: size(85);
		z-index: 30;
		width: 100%;
		background: #fff;
		&.move-enter {
			transform: translate3d(100%,0,0)
		}
		&.move-enter-active,&.move-leave-active {
			transition: all 0.3s linear
		}
		&.move-leave-active {
			opacity: 0;
			transform: translate3d(-100%,0,0)
		}
		.image-header {
			position: relative;
			width: 100%;
			height: 0;
			padding-top: 100%;
			img {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			.back {
				position: absolute;
				top: size(40);
				left: 0;
				i {
					display: block;
					margin: size(20);
					width: size(40);
					height: size(40);
					background: url(./arrow_lift.svg) no-repeat;
				}
			}
		}
		.content {
			position: relative;
			padding: size(36);
			.title {
				line-height: size(28);
				margin-bottom: size(16);
				@include font-size(14px);
				font-weight: 700;
				color: rgb(7,17,27);
			}
			.detail {
				margin-bottom: size(36);
				line-height: size(20);
				.sell-count,.rating {
					@include font-size(12px);
					color: rgb(147,153,159)
				}
				.sell-count {
					margin-right: size(14);
				}
			}
			.price {
				margin-top: size(12);
				font-weight: 700;
				.now {
					margin-right: size(16);
					@include font-size(14px);
					color: rgb(240,20,20)
				}
				.old {
					text-decoration: line-through;
					@include font-size(12px);
					color: rgb(147,153,159);
				}
			}
			.cartcontrol-wrapper {
				position: absolute;
				right: size(36);
				bottom: size(36);
			}
			.buy {
				position: absolute;
				right: size(36);
				bottom: size(36);
				z-index: 10;
				line-height: size(48);
				padding: 0 size(24);
				box-sizing: border-box;
				border-radius: size(24);
				@include font-size(12px);
				color: #fff;
				background: rgb(0,160,220);
			}
		}
		.info {
			padding: size(36);
			.title {
				line-height: size(28);
				margin-bottom: size(12);
				@include font-size(14px);
				color: rgb(7,17,27);
				font-weight: 700;
			}
			.text {
				line-height: size(48);
				padding: 0 size(16);
				@include font-size(12px);
				color: rgb(77,85,93);
			}
		}
		.rating {
			padding-top: size(36);
			.title {
				line-height: size(28);
				margin-left: size(36);
				@include font-size(14px);
				color: rgb(7,17,27);
				font-weight: 700;
			}
			.rating-wrapper {
				padding: 0 size(36);
				.item {
					position: relative;
					padding: size(32) 0;
					border-bottom: size(1) solid rgba(7,17,27,0.1);
					.user {
						position: absolute;
						right: 0;
						top: size(32);
						line-height: size(24);
						font-size: 0;
						.avatar {
							width: size(24);
							height: size(24);
							border-radius: 50%;
						}
						.name {
							display: inline-block;
							margin-right: size(12);
							vertical-align: top;
							@include font-size(12px);
							color: rgb(147, 153, 159);
						}
					}
					.time {
						margin-bottom: size(12);
						line-height: size(24);
						@include font-size(10px);
						color: rgb(147, 153, 159);
					}
					.text {
						line-height: size(32);
						@include font-size(12px);
						color: rgb(7,17,27);
						.icon-thumb_up,.icon-thumb_down {
							display: inline-block;
							line-height: size(32);
							margin-right: size(8);
							@include font-size(12px);
						}
						.icon-thumb_up {
							color: rgb(0, 160, 220);
						}
						.icon-thumb_down {
							color: rgb(147, 153, 159);
						}
					}
				}
				.no-rating {
					padding: size(32) 0;
					@include font-size(12px);
					color: rgb(147, 153, 159)
				}
			}
		}
	}
</style>