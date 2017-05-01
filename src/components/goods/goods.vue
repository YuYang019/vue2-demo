<template>
   <div class="goods-wrapper">
	<div class="goods">	
      <div class="menu-wrapper" ref="menuWrapper">
      	<ul>
      		<li class="menu-item"
      			v-for="(item,index) in goods"
      			:class="{'current':currentIndex===index}"
      			@click="selectMenu(index,$event)"
      		>
      			<span class="text border-1px">
      				<span class="icon" 
      					  v-show="hasIcon(item.type)"
      					  :class="classMap[item.type]"
      				></span>{{item.name}}
      			</span>
      		</li>
      	</ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
      	<ul>
      		<li class="food-list food-list-hook" v-for="item in goods">
      			<h1 class="title">{{item.name}}</h1>
      			<ul>
      				<li class="food-item border-1px"
      					v-for="food in item.foods"
      					@click="chooseFood(food,$event)"
     				>
     					<img class="icon" :src="food.icon">
     					<div class="content">
     						<h2 class="name">{{food.name}}</h2>
     						<p class="desc">{{food.description}}</p>
     						<div class="extra">
     							<span class="count">月售{{food.sellCount}}</span>
     							<span>好评率{{food.rating}}%</span>
     						</div>
     						<div class="price">
     							<span class="now">¥{{food.price}}</span>
     							<span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
     						</div>
     						<div class="cartcontrol-wrapper" @click.stop>
     							<cartcontrol :food="food" @cartadd="_drop"></cartcontrol>	
     						</div>
     					</div>
      				</li>
      			</ul>
      		</li>
      	</ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>  
    </div>
    <food :food="foodDetail" @cartadd="_drop" ref="food"></food>
   </div>
</template>

<script>
	import axios from 'axios'
	import BScroll from 'better-scroll'
	import shopcart from 'components/shopcart/shopcart'
	import cartcontrol from 'components/cartcontrol/cartcontrol'
	import food from 'components/food/food'

	const ERR_OK = 0

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		components: {
			shopcart,cartcontrol,food
		},
		data() {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				foodDetail: {}
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee']
			
			axios.get('/api/goods')
      		  .then(response => {
       		  console.log(response.data)
       		  if (response.data.errno === ERR_OK) {
        	    this.goods = response.data.data
        	    
        	    //等待dom更新之后调用
        	    this.$nextTick(() => {
        	    	this.initScroll()
					this.caculateHeight()
        	    }) 	
       		  }
     		})
		},
		computed: {
			//currentIndex()会根据this.scrollY的变化而自动触发
			currentIndex() {
				for(let i=0; i<this.listHeight.length; i++){
					let height1 = this.listHeight[i]
					let height2 = this.listHeight[i + 1]
					if (!height2 || (this.scrollY >= height1 && this.scrollY <height2)) {
						return i
					}
				}
				return 0;
			},
			selectFoods() {
				let foods = []
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							foods.push(food)
							//console.log(foods)
						} 
					})
				})
				return foods
			}
		},
		methods: {
			hasIcon: type => {
				return type > 0
			},
			initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper,{
					click: true
				})

				this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
					//监听
					probeType: 3,
					click: true
				})

				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y))
					//console.log(this.scrollY)
				})
			},
			caculateHeight() {
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
				let height = 0
				this.listHeight.push(height)
				for (let i=0; i<foodList.length; i++) {
					let item = foodList[i]
					height += item.clientHeight
					this.listHeight.push(height)
				}
				console.log(this.listHeight)	
			},
			selectMenu(index,event) {
				//触摸点击会有_constructed属性
				if(!event._constructed){
					return
				}
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
				let el = foodList[index]
				this.foodsScroll.scrollToElement(el, 300) //bscroll的api，跳到指定节点
			},
			_drop: function(target) {
				this.$refs.shopcart.drop(target)
			},
			chooseFood(food,event){
				if(!event._constructed){
					return
				}
				this.foodDetail = food
				this.$refs.food.show()
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/index.scss";

	.goods {
		display: flex;
		position: absolute;
		top: size(340);
		bottom: size(85);
		width: 100%;
		overflow: hidden;
		.menu-wrapper {
			flex: 0 0 size(140);
			width: size(140);
			background: #f3f5f7;
			.menu-item {
				display: table;
				padding: 0 size(24);
				height: size(100);
				width: size(100);
				@include data-dpr('line-height',14px);
				.icon {
					display: inline-block;
					vertical-align: top;
					margin-right: 4px;
					@include data-dpr('width',12px);
					@include data-dpr('height',12px);
					background-size: 100%;
					background-repeat: no-repeat;
					&.decrease {
						background-image: url(decrease_3@3x.png)
					}
					&.discount {
						background-image: url(discount_3@3x.png)
					}
					&.guarantee {
						background-image: url(guarantee_3@3x.png)
					}
					&.invoice {
						background-image: url(invoice_3@3x.png)
					}
					&.special {
						background-image: url(special_3@3x.png)
					}
				}
				.text {
					display: table-cell;
					width: size(112);
					vertical-align: middle;
					@include font-size(12px);
					@include border-1px(rgba(7,17,27,0.1));
				}
				&.current {
					background: #fff;
				}
			}
		}
		.foods-wrapper {
			flex: 1;
			.food-list {
				.title {
					padding-left: size(24);
					height: size(52);
					line-height: size(52);
					border-left: size(4) solid #d9dde1;
					@include font-size(14px);
					color: rgb(147,153,159);
					background: #f3f5f7;
				}
				.food-item {
					display: flex;
					margin: size(36);
					padding-bottom: size(36);
					@include border-1px(rgba(7,17,27,0.1));
					&:last-child {
						margin-bottom: 0;
						&:after {
							display: none;
						}
					}
					.icon {
						width: size(105);
						height: size(105);
						margin-right: size(20);
					}
					.content {
						flex: 1;
						position: relative;
						.name {
							margin: size(4) 0 size(12) 0;
							@include font-size(14px);
							color: rgb(7,17,27);
						}
						.desc,.extra {
							@include font-size(12px);
							color: rgb(147,153,159);
						}
						.desc {
							margin-bottom: size(12)
						}
						.extra {
							.count {
								margin-right: size(12)
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
							right: size(-12);
							bottom: size(-10);
						}
					}
				}
			}
		}
	}
</style>