import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './script/store/index'
import Toast from './components/toast'
import VueElementLoading from 'vue-element-loading'
import vConsole from '@/assets/js/vconsole.js'

Vue.config.productionTip = false
Vue.use(Toast)
Vue.use(vConsole)

Vue.component('VueElementLoading', VueElementLoading)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
