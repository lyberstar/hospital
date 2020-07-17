import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/index'
import Phone from '@/pages/phone/index'
import Code from '@/pages/code/index'
import Main from '@/pages/main/index'
import Recommend from '@/pages/recommend/index'
import Success from '@/pages/success/index'
import Myself from '@/pages/myself/index'
import Confirm from '@/pages/confirm/index'
import Cancel from '@/pages/cancel/index'
import LoginMain from '@/pages/login-main/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: '/home'
    }, {
      name: 'home',
      path: '/home',
      component: Home,
      meta: {
        keepAlive: true,
        isBack: false
      }
    }, {
      name: 'phone',
      path: '/phone',
      component: Phone,
      meta: {
        keepAlive: true,
        isBack: false
      }
    }, {
      name: 'code',
      path: '/code',
      component: Code,
      meta: {
        keepAlive: true,
        isBack: false
      }
    }, {
      name: 'main',
      path: '/main',
      component: Main,
      meta: {
        keepAlive: true,
        isBack: false
      }
    }, {
      name: 'recommend',
      path: '/recommend',
      component: Recommend
    }, {
      name: 'success',
      path: '/success',
      component: Success
    }, {
      name: 'myself',
      path: '/myself',
      component: Myself,
      meta: {
        keepAlive: true,
        isBack: false
      }
    }, {
      name: 'confirm',
      path: '/confirm',
      component: Confirm,
      meta: {
        keepAlive: true,
        isBack: false
      }
    }, {
      name: 'cancel',
      path: '/cancel',
      component: Cancel
    }, {
      name: 'login-main',
      path: '/login-main',
      component: LoginMain,
      meta: {
        keepAlive: true,
        isBack: false
      }
    }
  ]
})
