/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import Vuex from 'vuex';
import App from './App';
import router from './router/router';
import VueResource from 'vue-resource';
// import VueRouter from "vue-router";
// import goods from 'components/goods/goods';
// 预加载
import 'common/stylus/index.styl';
// import 'common/css/font-awesome.min.css'
Vue.config.productionTip = false;

// 注册组件
Vue.use(VueResource);
// Vue.use(Vuex);

// const store=new Vuex.Store({
// 	state:{
// 		cartEl:{},
// 		// name:0
// 	},

// 	mutations:{
// 		addCart(state,para){
// 			// this._drop
// 			// console.log(para);
// 			state.cartEl=para;
// 			// console.log(this);
// 		}
// 	}
// });

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	// template: '<App/>'
});
