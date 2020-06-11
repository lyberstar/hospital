import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './script/store/index'
import Toast from './components/toast'

Vue.config.productionTip = false
Vue.use(Toast)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
