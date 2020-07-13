<template>
  <transition name="fade">
  <router-view v-if="isRouterAlive"></router-view>
    <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
  </transition>
</template>

<script>
  export default {
    provide () {
      return {
        reload: this.reload
      }
    },
    data () {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>
