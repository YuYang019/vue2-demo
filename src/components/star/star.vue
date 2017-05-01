<template>
	<div class="star" :class="starType">
		<span class="star-item" 
			  v-for="itemClass in itemClasses" 
			  :class="itemClass"
		></span>
	</div>
</template>

<script>
	const LENGTH = 5;
	const CLS_ON = 'on'; //全星
	const CLS_HALF = 'half'; //半星
	const CLS_OFF = 'off'; //灰色星

	export default {
		props: {
			size: {
				type: Number
			},
			score: {
				type: Number
			}
		},
		computed: {
			starType() {
				return 'star-' + this.size
			},
			itemClasses() {
				let result = []
				//3.1 => 3 , 3.2 => 3 , 3.5 => 3.5 , 3.6 =>3.5 , 3.8 =>  3.5 , 4=> 4
				let score = Math.floor(this.score * 2) / 2
				let hasDecimal = score % 1 !== 0 //是否有半颗星
				let intger = Math.floor(score) //完整的星的数目
				for (let i = 0; i < intger; i++) {
					result.push(CLS_ON)
				}
				if (hasDecimal) {
					result.push(CLS_HALF)
				}
				while (result.length < LENGTH) {
					result.push(CLS_OFF)
				}
				return result
			}
		}
	}
</script>

<style lang="scss">
	@import '../../common/scss/mixin.scss';

	.star {
		font-size: 0;
		.star-item {
			display: inline-block;
		}
		&.star-48 {
			.star-item {
				@include data-dpr('width',20px);
				@include data-dpr('height',20px);
				@include data-dpr('margin-right',22px);
				background-size: 100%;
				background-repeat: no-repeat;
				&:last-child {
					margin-right: 0;
				}
				&.on {
					@include bg-image('star48_on');
				}
				&.half {
					@include bg-image('star48_half');
				}
				&.off {
					@include bg-image('star48_off');
				}
			}
			
		}
		&.star-36 {
			.star-item {
				@include data-dpr('width',15px);
				@include data-dpr('height',15px);
				@include data-dpr('margin-right',6px);
				background-repeat: no-repeat;
				background-size: 100%;
				&:last-child {
					margin-right: 0;
				}
				&.on {
					@include bg-image('star36_on');
				}
				&.half {
					@include bg-image('star36_half');
				}
				&.off {
					@include bg-image('star36_off');
				}
			}
			
		}
		&.star-24 {
			.star-item {
				@include data-dpr('width',10px);
				@include data-dpr('height',10px);
				@include data-dpr('margin-right',3px);
				background-size: 100%;
				background-repeat: no-repeat;
				&:last-child {
					margin-right: 0;
				}
				&.on {
					@include bg-image('star24_on');
				}
				&.half {
					@include bg-image('star24_half');
				}
				&.off {
					@include bg-image('star24_off');
				}
			}
			
		}
		
	}
</style>