<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="loadRouter && $route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="loadRouter && !$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      loadRouter: true,
      isRouterAlive: true
    }
  },
  provide () {                                       
    return {
        reload: this.reload                                              
    }
  },
  components: {
  },
  mounded () {},
  methods: {
    handleReload () {
      this.loadRouter = false
      this.$nextTick(() => {
        this.loadRouter = true
      })
    },
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      }) 
    }
  },
  watch: {
    '$route' (to, from) {
      console.log('to:', to)
      console.log('from:', from)
      if (to.path === from.path) {
        // 相同路由，不同参数，跳转时，重载页面
        this.handleReload()
      }
    }
  }
}
</script>

<style lang="scss">
@import "./assets/css/reset.scss";
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
