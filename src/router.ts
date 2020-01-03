import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Weather from './views/Weather/index.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'weather',
      component: Weather,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    { path: '/browser', component: () => import('./views/Browser.vue') },
    { path: '/weather', component: () => import('./views/Weather/index.vue') },
    { path: '/history', component: () => import('./views/WeatherHistory.vue') },
  ],
});
