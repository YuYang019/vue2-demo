<template>
	<div class="header">
      <div class="content-wrapper">
      	<img class="avatar" :src="seller.avatar">
      	<div class="content">
      		<p class="title">
      			<span class="brand"></span>
      			<span class="name">{{seller.name}}</span>
      		</p>
      		<p class="description">
      			{{seller.description}}/{{seller.deliveryTime}}分钟送达
      		</p>
      		<p class="support" 
      		   v-if="seller.supports"
      		>
      			<span class="icon" 
      				  :class="classMap[seller.supports[0].type]"
      			>
      			</span>
      			<span class="text">{{seller.supports[0].description}}</span>
      		</p>
      		<div class="support-count"
      			  v-if="seller.supports"
      			  @click="showDetail"
      		>
				<span class="count">{{seller.supports.length}}个</span>
				<i>></i>
      		</div>
      	</div>
      </div>
      <div class="bulletin-wrapper"
		   @click="showDetail"
      >
      	<span class="bulletin-icon"></span>
      	<span class="bulletin-text">{{seller.bulletin}}</span>
      	<i>></i>
      </div>
      <div class="background">
      	<img :src="seller.avatar">
      </div>
      <transition name="fade">
      <div class="detail"
		   v-show="detailShow"
      >
      	<div class="detail-wrapper clearfix">
      		<div class="detail-main">
      			<h1 class="name">{{seller.name}}</h1>
      			<div class="star-wrapper">
      				<star :size="48" :score="seller.score"></star>
      			</div>
      			<div class="title">
      				<span class="line"></span>
      				<p>优惠信息</p>
      				<span class="line"></span>
      			</div>
      			<ul class="supports"
      				v-if="seller.supports"
      			>
      				<li class="support-item" 
      					v-for="(item,index) in seller.supports"		
      				>
						<icon :index="index" :type="1"></icon>
						<span class="text">{{item.description}}</span>
      				</li>
      			</ul>
      			<div class="title">
      				<span class="line"></span>
      				<p>商家公告</p>
      				<span class="line"></span>
      			</div>
      			<div class="bulletin">
      				<p>{{seller.bulletin}}</p>
      			</div>
      		</div>
      	</div>
      	<div class="detail-close" @click="hideDetail">X</div>
      </div>
      </transition>
    </div>
</template>

<script>
	import icon from 'components/icon/icon'
	import star from '../star/star'

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				detailShow: false
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee']
		},
		methods: {
			showDetail() {
				this.detailShow = true
			},
			hideDetail() {
				this.detailShow = false
			}
		},
		components: {
			star,icon
		}	
	}
</script>

<style lang="scss">
@import '../../common/scss/index.scss';

.header {
	position: relative;
	overflow: hidden;
	color: #fff;
	background: rgba(7,17,27,0.5);
	.content-wrapper {
		position: relative;
		padding: size(48) size(24) size(36) size(48);
		font-size: 0;
		.avatar {
			display: inline-block;
			width: size(128);
			height: size(128);
			border-radius: 2px;
		}
		.content {
			display: inline-block;
			margin-left: size(32);
			vertical-align: top;
			@include font-size(14px);
			.title {
				margin: size(8) 0 size(16) 0;
				.brand {
					display: inline-block;
					vertical-align: top;
					@include data-dpr('width',30px);
					@include data-dpr('height',18px);
					background-image: url(brand@2x.png);
					background-size: 100%;
					background-repeat: no-repeat;
				}
				.name {
					margin-left: size(6);
					@include font-size(16px);
				}
			}
			.description {
				@include font-size(12px);
				margin-bottom: size(20);
			}
			.support {
				@include font-size(12px);
				.icon {
					display: inline-block;
					vertical-align: top;
					@include data-dpr('width',12px);
					@include data-dpr('height',12px);
					background-size: 100%;
					background-repeat: no-repeat;
					&.decrease {
						background-image: url(decrease_1@2x.png)
					}
					&.discount {
						background-image: url(discount_1@2x.png)
					}
					&.guarantee {
						background-image: url(guarantee_1@3x.png)
					}
					&.invoice {
						background-image: url(invoice_1@2x.png)
					}
					&.special {
						background-image: url(special_1@2x.png)
					}
				}
				.text {
					@include data-dpr('line-height',12px)
				}
			}
			.support-count {
				position: absolute;
				right: size(24);
				bottom: size(28);
				padding: 0 size(16);
				height: size(48);
				line-height: size(48);
				border-radius: size(22);
				background: rgba(0,0,0,0.2);
				text-align: center;
				@include font-size(12px);
				i {
					@include font-size(10px);
					margin-left: size(8);
				}
			}
		}
	}
	.bulletin-wrapper {
		position: relative;
		height: size(48);
		line-height: size(48);
		padding: 0 size(44) 0 size(24);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		background: rgba(7,17,27,0.2);
		.bulletin-icon {
			display: inline-block;
			vertical-align: middle;
			margin-right: size(4);
			@include data-dpr('width', 22px);
			@include data-dpr('height',12px);
			background-size: 100%;
			backgrond-repeat: no-repeat;
			background-image: url(bulletin@3x.png);
		}
		i {
			position: absolute;
			@include font-size(10px);
			right: size(22);
			top: size(3);
		}
	}
	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		filter: blur(10px);
		img {
			width: 100%;
			height: 100%;
		}
	}
	.fade-enter, .fade-leave-active {
		opacity: 0
	}
	.fade-enter-active, .fade-leave-active{
		transition: all .3s linear;
	}
	.detail {
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		width:100%;
		height: 100%;
		overflow: auto;
		background: rgba(7,17,27,0.8);
		backdrop-filter: blur(10px);
		.detail-wrapper {
			width: 100%;
			min-height: 100%;
			.detail-main {
				margin-top: size(128);
				padding-bottom: size(110);
				.name {
					@include font-size(16px);
					font-weight:700;
					text-align: center;
				}
				.star-wrapper {
					margin-top: size(36);
					padding: size(4) 0;
					text-align: center;
				}
				.title {
					display: flex;
					margin: size(48) auto size(48);
					width: 80%;
					.line {
						position: relative;
						top: size(-12);
						flex: 1;
						border-bottom: 1px solid rgba(255,255,255,0.5);
					}
					p {
						margin: 0 size(24);
						@include font-size(14px);
					}
				}
				.supports {
					margin: 0 auto;
					width: 80%;
					.support-item {
						padding: 0 size(24);
						margin-bottom: size(24);
						line-height: size(32);
						font-size: 0;
						&:last-child {
							margin-bottom: 0;
						}						
						.text {
							margin-left: size(12);
							@include font-size(12px);
							vertical-align: top;
						}
					}
					
				}
				.bulletin {
					position: relative;
					top: size(-12);
					margin: 0 auto;
					width: 80%;
					@include font-size(12px);
					p {
						padding: 0 size(24);
					}
				}
			}
		}
		.detail-close {
			position: relative;
			margin: size(-110) auto 0;
			width: size(64);
			height: size(64);
			line-height: size(64);
			color: #fff;
			@include font-size(24px);
			text-align: center;
		}
	}
}



</style>