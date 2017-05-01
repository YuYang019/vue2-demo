<template>
	<div class="seller" ref="seller">
      <div class="seller-content">
      	<div class="overview">
      		<h1 class="title">{{seller.name}}</h1>
      		<div class="desc">
      			<star :size="36" :score="seller.score"></star>
      			<span class="text">({{seller.ratingCount}})</span>
      			<span class="text">月售{{seller.sellCount}}单</span>
      		</div>
      		<ul class="remark">
      			<li class="block">
      				<h2>起送价</h2>
      				<div class="content">
      					<span class="stress">{{seller.minPrice}}</span>元
      				</div>
      			</li>
      			<li class="block">
      				<h2>商家配送</h2>
      				<div class="content">
      					<span class="stress">{{seller.deliveryPrice}}</span>元
      				</div>
      			</li>
      			<li class="block">
      				<h2>平均配送时间</h2>
      				<div class="content">
      					<span class="stress">{{seller.deliveryTime}}</span>分钟
      				</div>
      			</li>
      		</ul>
      		<div class="like" @click="toggleLike($event)">
      			<span class="icon-favorite" :class="{'active':like}"></span>
      			<span class="text">{{likeText}}</span>
      		</div>
      	</div>
      	<split></split>
      	<div class="bulletin">
      		<h1 class="title">公告与活动</h1>
      		<div class="content-wrapper">
      			<p class="content">
      				{{seller.bulletin}}
      			</p>
      		</div>
      		<ul class="supports"
      				v-if="seller.supports"
      			>
      				<li class="support-item" 
      					v-for="(item,index) in seller.supports"		
      				>
						<icon :index="index" :type="4"></icon>
						<span class="text">{{item.description}}</span>
      				</li>
      		</ul>
      	</div>
      	<split></split>
      	<div class="pics">
      		<h1 class="title">商家实景</h1>
      		<div class="pic-wrapper" ref="picWrapper">
      			<ul class="pic-list" ref="list">
      				<li  class="pic-item" v-for="pic in seller.pics">
      					<img class="pic" :src="pic">
      				</li>
      			</ul>
      		</div>
      	</div>
      	<split></split>
     	<div class="info">
      		<h1 class="title">商家信息</h1>
      		<ul>
      			<li class="info-item" v-for="info in seller.infos">{{info}}</li>
      		</ul>
      	</div>
      </div>
    </div>
</template>

<script>
	import {saveToLocal,getFromLocal} from '../../common/js/store'
	import BScroll from 'better-scroll'
	import star from 'components/star/star'
	import split from 'components/split/split'
	import icon from 'components/icon/icon'

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
		data() {
			return {
				like: (() => {
					return getFromLocal(this.seller.id , 'like', false)
				})()
			}
		},
		computed: {
			likeText() {
				return this.like ? '已收藏' : '收藏' 
			}
		},
		watch: {
			seller: function() {
				this.$nextTick(() => {
					this.initScroll()
					this.initPics()
				})			
			}
		},
		mounted() {
			this.initScroll()
			this.initPics()
		},
		methods: {
			toggleLike(event) {
				if(!event._constructed) return
				this.like = !this.like
				saveToLocal(this.seller.id, 'like', this.like)
			},
			initScroll() {
				if(!this.scroll) {
					this.scroll = new BScroll(this.$refs.seller, {
						click: true
					})
				} else {
					this.scroll.refresh()
				}		
			},
			initPics() {
				if(this.seller.pics) {
					let list = this.$refs.list
					let li = this.$refs.list.querySelector('.pic-item')
					let img = this.$refs.list.querySelector('.pic')
					
					let picWidth = Number(getComputedStyle(img).width.replace(/(px)/g,''))
					let margin = Number(getComputedStyle(li).marginRight.replace(/(px)/g,''))
					
					let width = (picWidth + margin) * this.seller.pics.length - margin

					console.log(width)

					list.style.width = width + 'px'
					
					this.$nextTick(() => {
						if(!this.picScroll) {
							this.picScroll = new BScroll(this.$refs.picWrapper, {
								scrollX: true,
								eventPassthrough: 'vertical'
							})
						} else {
							this.picScroll.refresh()
						}
						
					})
				}
			}
		},
		components: {
			star,split,icon
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/index.scss";
	@import "../../common/scss/icon.css";
	
	.seller {
		position: absolute;
		top: size(340);
		bottom: 0;
		width: 100%;
		left: 0;
		overflow: hidden;
		.overview {
			position: relative;
			padding: size(32);
			.title {
				margin-bottom: size(16);
				color: rgb(7, 17, 27);
				@include font-size(14px);
			}
			.desc {
				padding-bottom: size(24);
				line-height: size(32);
				font-size: 0;
				border-bottom: size(1) solid rgba(7,17,27,0.1);
				.star {
					display: inline-block;
					margin-right: size(16);
					vertical-align: top;
				}
				.text {
					margin-right: size(24);
					display: inline-block;
					vertical-align: top;
					@include font-size(10px);
					color: rgb(77, 85, 93);
				}
			}
			.remark {
				display: flex;
				padding-top: size(36);
				.block {
					flex: 1;
					text-align: center;
					border-right: size(1) solid rgba(7,17,27,0.1);
					&:last-child {
						border: none
					}
					h2 {
						margin-bottom: size(8);
						@include font-size(10px);
						color: rgb(147,153,159);
					}
					.content {
						@include font-size(10px);
						color: rgb(7,17,27);
						.stress {
							@include font-size(24px);
							font-weight: 200;
						}
					}
				}
			}
			.like {
				position: absolute;
				width: size(70);
				right: size(32);
				top: size(28);
				text-align: center;
				.icon-favorite {
					display: block;
					margin-bottom: size(8);
					@include font-size(26px);
					color: #d4d6d9;
					&.active {
						color: rgb(240,20,20)
					}
				}
				.text {
					@include font-size(10px);
					color: rgb(77,85,93);
				}
			}
		}
		.bulletin {
			padding: size(32) size(32) 0 size(32);
			.title {
				margin-bottom: size(16);
				@include font-size(14px);
				color: rgb(7,17,27);
			}
			.content-wrapper {
				padding: 0 size(24) size(32) size(24);
				border-bottom: size(1.5) solid rgba(7,17,27,0.1);
				.content {
					@include data-dpr('line-height',24px);
					@include font-size(12px);
					color: rgb(240,20,20);
				}
			}
			.supports {
				.support-item {
					padding: size(32) size(24);
					font-size: 0;
					line-height: size(32);
					border-bottom: size(1.5) solid rgba(7,17,27,0.1);
					.text {
						margin-left: size(12);
						vertical-align: top;
						@include font-size(12px);
					}
					&:last-child {
						border: none;
					}
				}
			}
		}
		.pics {
			padding: size(32);
			.title {
				margin-bottom: size(24);
				@include font-size(14px);
				color: rgb(7,17,27);
			}
			.pic-wrapper {
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				.pic-list {
					font-size: 0;
					.pic-item {
						display: inline-block;
						margin-right: size(12);
						&:last-child {
							margin: 0
						}
						.pic {
							width: size(240);
							height: size(180);
						}
					}					
				}
			}
		}
		.info {
				padding: size(32) size(32) 0 size(32);
				.title {
					padding-bottom: size(24);
					@include font-size(14px);
					color: rgb(7,17,27);
					border-bottom: size(1.5) solid rgba(7,17,27,0.1);
				}
				.info-item {
					padding: size(28) size(24);
					@include data-dpr('line-height', 18px);
					@include font-size(12px);
					border-bottom: size(1.5) solid rgba(7,17,27,0.1);
					&:last-child {
						border: none;
					}
				}
		}
	}
</style>