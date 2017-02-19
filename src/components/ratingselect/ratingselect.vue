<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span @click="select(2,$event)" 
				  class="block positive" 
				  :class="{'active':selectType===2}"
			>
				{{desc.all}}
				<span class="count">{{ratings.length}}</span>
			</span>
			<span @click="select(0,$event)" 
				  class="block positive" 
				  :class="{'active':selectType===0}"
			>
				{{desc.positive}}
				<span class="count">{{positives.length}}</span>
			</span>
			<span 
				@click="select(1,$event)"
				class="block negative"
				:class="{'active':selectType===1}"
			>
				{{desc.negative}}
				<span class="count">{{negatives.length}}</span>
			</span>
		</div>
		<div  @click="toggle($event)" class="switch">
			<span class="icon-check" 
				  :class="{'on':onlyContent}" 
				  >
			</span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2; 

	export default {
		props: {
			ratings: {
				type: Array,
				default() {
					return []
				}
			},
			selectType: {
				type: Number,
				default: 2
			},
			onlyContent: {
				type: Boolean,
				default: false
			},
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			}
		},
		computed: {
			positives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === POSITIVE
				})
			},
			negatives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === NEGATIVE
				})
			}
		},
		methods: {
			select(type, event) {
				if (!event._constructed) {
					return
				} 
				//子组件不要修改父组件
				this.$emit('select', type)
			},
			toggle(event) {
				if (!event._constructed) {
					return
				}
				this.$emit('toggle') 
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/index.scss";

	.ratingselect {
		.rating-type {
			margin:0 size(36);
			padding: size(36) 0;
			border-bottom: size(1) solid rgba(7,17,27,0.1);
			font-size: 0;
			.block {
				display: inline-block;
				padding: size(16) size(24);
				margin-right: size(16);
				@include font-size(12px);
				border-radius: size(2);
				color: rgb(77,85,93);
				&.active {
					color: #fff;
				}
				.count {
					@include font-size(8px);
					margin-left: size(4);
				}				
				&.positive {
					background: rgba(0,160,220,0.2);
					&.active {
						background: rgb(0,160,220)
					}
				}
				&.negative {
					background: rgba(77,85,93,0.2);
					&.active {
						background: rgb(77,85,93)
					}
				} 
			}
		}
		.switch {
			padding: size(24) size(36);
			line-height: size(48);
			border-bottom: 1px solid rgba(7,17,27,0.1);
			color: rgb(147,153,159);
			.icon-check {
				display: inline-block;	
				vertical-align: top;	
				@include data-dpr('width',26px);
				@include data-dpr('height',26px);
				background: url(./check_circle.svg) no-repeat;
				background-size: 100%;
				&.on {
					background: url(./check_circle_active.svg) no-repeat;
					background-size: 100%;
				}
			}
			.text {
				display: inline-block;
				vertical-align: top;
				@include font-size(12px);
			}
		}
	}
</style>