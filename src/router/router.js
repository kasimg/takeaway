import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

Vue.use(Router);
const routes = [{
	path: '/',
	redirect: '/goods'
}, {
	path: '/goods',
	component: goods
}, {
	path: '/ratings',
	component: ratings
}, {
	path: '/seller',
	component: seller
}];

export default new Router({
	// 当前active的标签增加的类名
	linkActiveClass: 'active',
	routes
});
