// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Goods from './components/goods/goods'
import Ratings from './components/ratings/ratings'
import Seller from './components/seller/seller'

/* eslint-disable no-new */
Vue.use(VueRouter)
/*坑爹，注意component不要加s*/
const routes = [
	{ path: '', component: Goods },
	{ path: '/goods', component: Goods },
	{ path: '/ratings', component: Ratings },
	{ path: '/seller', component: Seller }
]

const router = new VueRouter({
	routes
})

const app = new Vue({
	el: '#app',
	router: router,
	render: h => h(App)
})
