<template>
	<span class="icon" :class="iconType"></span>
</template>

<script>
	export default {
		props: {
			type: {
				type: Number
			},
			index: {
				type: Number
			}
		},
		computed: {
			iconType() {
				return `${this.classMap[this.index]}-${this.type}`
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee']
		}
	}
</script>

<style lang="scss">
	@import '../../common/scss/index.scss';
	@import '../../common/scss/mixin.scss';

	.icon {
		display: inline-block;
		vertical-align: top;
		@include data-dpr('width',16px);
		@include data-dpr('height',16px);
		background-size: 100%;
		background-repeat: no-repeat;
		&.decrease-1 {
			@include bg-image('decrease_1');
		}
		&.decrease-2 {
			@include bg-image('decrease_2');
		}
		&.decrease-3 {
			@include bg-image('decrease_3');
		}
		&.decrease-4 {
			@include bg-image('decrease_4');
		}
		
		&.discount-1 {
			@include bg-image('discount_1');
		}
		&.discount-2 {
			@include bg-image('discount_2');
		}
		&.discount-3 {
			@include bg-image('discount_3');
		}
		&.discount-4 {
			@include bg-image('discount_4');
		}

		&.guarantee-1 {
			@include bg-image('guarantee_1');
		}
		&.guarantee-2 {
			@include bg-image('guarantee_2');
		}
		&.guarantee-3 {
			@include bg-image('guarantee_3');
		}
		&.guarantee-4 {
			@include bg-image('guarantee_4');
		}

		&.invoice-1 {
			@include bg-image('invoice_1');
		}
		&.invoice-2 {
			@include bg-image('invoice_2');
		}
		&.invoice-3 {
			@include bg-image('invoice_3');
		}
		&.invoice-4 {
			@include bg-image('invoice_4');
		}

		&.special-1 {
			@include bg-image('special_1');
		}
		&.special-2 {
			@include bg-image('special_2');
		}
		&.special-3 {
			@include bg-image('special_3');
		}
		&.special-4 {
			@include bg-image('special_4');
		}
	}
</style>