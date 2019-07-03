import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import echarts from 'echarts';
import './plugins/element.js';
import './plugins/antd.ts';
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
