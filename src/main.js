import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

axios.defaults.baseURL = 'https://aavak-app.firebaseio.com/';

Vue.config.productionTip = false;

Vue.mixin({
	methods: {
		isEmptyObject(object) {
			for (let key in object) {
				return false;
			}
			return true;
		},

		titleCase(str) {
			let splitStr = str.toLowerCase().split(' ');
			for (let i = 0; i < splitStr.length; i++) {
				splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
			}
			return splitStr.join(' '); 
		}
	}
});

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app');
