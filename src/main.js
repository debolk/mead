import Vue from 'vue';
import App from './App.vue';
import { display, link } from './helpers/PhoneNumber';

Vue.filter('phoneNumber', display);
Vue.filter('phoneLink', link);

new Vue({
  el: '#app',
  render: h => h(App)
})
