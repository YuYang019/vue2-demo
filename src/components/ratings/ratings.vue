<template>
	<div class="ratings" ref="ratings">
      <div class="ratings-content">
      	<div class="overview">
      		<div class="overview-left">
      			<h1 class="score">{{seller.score}}</h1>
      			<p class="title">综合评分</p>
      			<p class="rank">高于周边商家{{seller.rankRate}}</p>
      		</div>
      		<div class="overview-right">
      			<div class="score-wrapper">
      				<span class="title">服务态度</span>
      				<star :size="36" :score="seller.serviceScore"></star>
      				<span class="score">{{seller.serviceScore}}</span>
      			</div>
      			<div class="score-wrapper">
      				<span class="title">商品评分</span>
      				<star :size="36" :score="seller.foodScore"></star>
      				<span class="score">{{seller.foodScore}}</span>
      			</div>
      			<div class="score-wrapper">
      				<span class="title">送达时间</span>
      				<span class="delivery">{{seller.deliveryTime}}分钟</span>
      			</div>
      		</div>
      	</div>
      	<split></split>
      	<ratingselect :selectType="selectType" 
					  :onlyContent="onlyContent"  
					  :ratings="ratings"
					  @select="selectRating"
					  @toggle="toggleContent"
		></ratingselect>
		<div class="rating-wrapper">
			<ul>
				<li v-show="needShow(rating.rateType, rating.text)" 
					v-for="rating in ratings" 
					class="rating-item"
				>
					<div class="avatar">
						<img :src="rating.avatar">
					</div>
					<div class="content">
						<h1 class="name">{{rating.username}}</h1>
						<div class="star-wrapper">
							<star :size="24" :score="rating.score"></star>
							<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>	
						</div>
						<p class="text">{{rating.text}}</p>
						<div class="recommend" v-show="rating.recommend && rating.recommend.length">
							<span class="icon-thumb_up"></span>
							<span class="item" v-for="item in rating.recommend">{{item}}</span>
						</div>
						<p class="time">{{rating.rateTime | formatDate}}</p>
					</div>				
				</li>
			</ul>
		</div>
      </div>
    </div>
</template>

<script>
	import axios from 'axios'
	import BScroll from 'better-scroll'
	import star from 'components/star/star'
	import split from 'components/split/split'
	import {formatDate} from '../../common/js/date'
    import ratingselect from 'components/ratingselect/ratingselect'

    const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	const ERR_OK = 0;

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		created() {
			axios.get('/api/ratings')
      		  .then(response => {
       		  console.log(response.data)
       		  if (response.data.errno === ERR_OK) {
        	    this.ratings = response.data.data
        	    
        	    //等待dom更新之后调用
        	    this.$nextTick(() => {
        	    	this.initScroll()
        	    }) 	
       		  }
     		})
		},
		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: true
			}
		},
		methods: {
			initScroll() {
				this.scroll = new BScroll(this.$refs.ratings, {
					click: true
				})
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
				//this.scroll.refresh()
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time)
				return formatDate(date, 'yyyy-MM-dd hh:mm')
			}
		},
		components: {
			star,split,ratingselect
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/index.scss";
	@import "../../common/scss/icon.css";
	
	.ratings {
		position: absolute;
		top: size(340);
		bottom: 0;
		width: 100%;
		left: 0;
		overflow: hidden;
		.overview {
			display: flex;
			padding: size(36) 0;
			.overview-left {
				flex: 0 0 size(230);
				padding: size(12) 0;
				width: size(230);
				border-right: size(1) solid rgba(7,17,27,0.1);
				text-align:center;
				@media only screen and (max-width: 640px) {
					flex: 0 0 size(200);
					width: size(200);
				}
				.score {
					@include font-size(24px);
					line-height: size(56);
					color: rgb(255,153,0)
				}
				.title {
					margin-bottom: size(12);
					line-height: size(24);
					@include font-size(12px);
					color: rgb(7,17,27);
				}
				.rank {
					@include font-size(10px);
					color: rgb(147,153,159);
				}
			}
			.overview-right {
				flex: 1;
				padding-top: size(12);
				padding-left: size(36);
				padding-bottom: size(12);
				@media only screen and (max-width: 640px) {
					padding-left: size(24);
				}
				.score-wrapper {
					margin-bottom: size(8);
					.title {
						@include data-dpr('line-height',18px);
						@include font-size(12px);
						display: inline-block;
						color: rgb(7,17,27);
					}
					.star {
						display: inline-block;
						vertical-align: top;
						margin: 0 size(24);
					}
					.score {
						@include data-dpr('line-height',18px);
						display: inline-block;
						color: rgb(255,153,0);
						@include font-size(12px);
					}
					.delivery {
						color: rgb(147,153,159);
						@include font-size(12px);
						margin-left: size(24);
					}
					&:nth-child(3) {
						margin-bottom: 0;
					}
				}
			}
		}
		.rating-wrapper {
			padding: 0 size(36);
			.rating-item {
				display: flex;
				padding: size(32) 0;
				border-bottom: size(1) solid rgba(7,17,27,0.1);
				.avatar {
					flex: 0 0 size(56);
					width: size(56);
					margin-right: size(24);
					img {
						width: size(56);
						height: size(56);
						border-radius: 50%;
					}
				}
				.content {
					flex: 1;
					position: relative;
					.name {
						margin-bottom: size(8);
						@include font-size(10px);
						line-height: size(24);
						color: rgb(7,17,27);
					}
					.star-wrapper {
						margin-bottom: size(8);
						font-size: 0;
						.star {
							display: inline-block;
							vertical-align: top;
							margin-right: size(12);
						}
						.delivery {
							display: inline-block;
							vertical-align: top;
							@include font-size(10px);
							line-height: size(24);
							color: rgb(147,153,159)
						}
					}
					.text {
						margin-bottom: size(16);
						@include font-size(12px);
						line-height: size(36);
						color: rgb(7,17,27);
					}
					.recommend {
						line-height: size(32);
						font-size: 0;
						.icon-thumb_up,.item {
							display: inline-block;
							margin: 0 size(16) size(8) 0;
							@include font-size(10px);
						}
						.icon-thumb_up {
							color: rgb(0,160,220);
						}
						.item {
							padding: 0 size(12);
							border: size(1) solid rgba(7,17,27,0.1);
							border-radius: 2px;
							color: rgb(147,153,159);
							background: #fff;
						}
					}
					.time {
						position: absolute;
						top: size(5);
						right: 0;
						line-height: size(12);
						@include font-size(10px);
						color:  rgb(147,153,159)
					}
				}
			}
		}
	}
</style>