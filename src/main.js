import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

axios.defaults.baseURL = 'https://aavak-app.firebaseio.com/';

Vue.config.productionTip = false;

new Vue({
  router,
  // store,
  render: function (h) { return h(App) }
}).$mount('#app');
