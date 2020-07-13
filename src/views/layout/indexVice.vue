<template>
  <!-- <div class="site-wrapper"
    :class="siteWarpperClasses"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading"> -->
      <div>
        <topbar></topbar>
        <sidebar></sidebar>
        <div class="site-content__wrapper" :style="siteContentWarpperStyles">
          <router-view></router-view>
        </div>
      </div>
    <!-- </template>
  </div> -->
</template>

<script>
  import Topbar from './topbar'
  import Sidebar from './sidebar'
  import ContentTabs from './content-tabs'
  import API from '@/api'
  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
        loading: true
      }
    },
    components: {
      Topbar,
      Sidebar,
      ContentTabs
    },
    computed: {
      siteWarpperClasses () {
        return [
          { 'site-sidebar--collapse': this.$store.state.sidebarCollapse }
        ]
      },
      siteContentWarpperStyles () {
        return [
          { 'minHeight': this.$store.state.documentClientHeight + 'px' }
        ]
      }
    },
    created () {
      this.getUserInfo()
    },
    mounted () {
      this.resetDocumentClientHeight()
      window.onresize = () => {
        this.resetDocumentClientHeight()
      }
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.UPDATE_DOCUMENT_CLIENT_HEIGHT({ height: document.documentElement['clientHeight'] })
      },
      // 获取当前管理员信息
      getUserInfo () {
        API.user.info().then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.DELETE_CONTENT_TABS([])
            this.UPDATE_USER_ID({ id: data.user.userId })
            this.UPDATE_USER_NAME({ name: data.user.username })
            this.UPDATE_IMAGE_PATH({ imagePath: data.user.imagePath })
          }
        })
      },
      ...mapMutations(['UPDATE_DOCUMENT_CLIENT_HEIGHT', 'UPDATE_USER_ID', 'UPDATE_USER_NAME', 'UPDATE_IMAGE_PATH', 'DELETE_CONTENT_TABS'])
    }
  }
</script>
<style>
.el-message-box__btns button{
      float: right;
    margin-left: 10px;
}
</style>
