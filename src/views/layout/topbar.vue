<template>
  <header class="site-topbar">
    <!-- <el-row>
      <img src="~@/assets/img/banner1.jpg" style="width:100%;height:140px">
    </el-row> -->
    <div class="site-topbar__header">
      <h1 class="site-logo" @click="$router.push({ name: 'qualityBoard' })" style="background: #c31a1e;">
        <a class="site-logo__lg">测试管理平台</a>
        <a class="site-logo__mini" href="javascript:;">测试</a>
      </h1>
    </div>
    <div class="site-topbar__body clearfix">
      <el-menu
        class="site-topbar__menu"
        background-color='#c31a1e'
        style="position: absolute;left: 0;"
        mode="horizontal">
        <el-menu-item class="site-topbar__switch" index="1-1" @click="switchSidebarCollapseHandle()">
          <icon-svg name="zhedie" style="color: white"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        background-color='#c31a1e'
        class="site-topbar__menu site-topbar__menu--right"
        mode="horizontal">
        <el-menu-item class="site-topbar__avatar" index="1-2">
          <el-dropdown placement="bottom" :hide-on-click="false">
            <span class="el-dropdown-link" style="color: white">
              <img v-if="$store.state.user.imagePath !== null&&$store.state.user.imagePath !== ''" :src="'/uploadfile' + $store.state.user.imagePath" :alt="$store.state.user.name">
              <img v-else src="~@/assets/img/avatar.png" :alt="$store.state.user.name">
              {{ $store.state.user.name }}
            </span>
            <el-dropdown-menu slot="dropdown" style="">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </header>
</template>

<script>
  import UpdatePassword from './update-password'
  import API from '@/api'
  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
        updatePassowrdVisible: false
      }
    },
    components: {
      UpdatePassword
    },
    created () {
      console.log(this.$store.state.user)
    },
    methods: {
      // 切换侧边栏, 水平折叠收起状态
      switchSidebarCollapseHandle () {
        this.SWITCH_SIDEBAR_COLLAPSE({ collapse: !this.$store.state.sidebarCollapse })
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.common.logout().then(({data}) => {
            if (data && data.code === 0) {
              this.DELETE_CONTENT_TABS([])
              this.$cookie.delete('token')
              this.$router.replace({ name: 'login' })
            }
          })
        })
      },
      ...mapMutations(['SWITCH_SIDEBAR_COLLAPSE', 'DELETE_CONTENT_TABS'])
    }
  }
</script>

<style>
  .el-dropdown-menu,.el-popper{
    z-index:10000!important
  }
  .w-e-menu{
    z-index:1800!important
  }
  .w-e-text-container{
    z-index:1799!important
  }
  /* .w-e-toolbar .w-e-droplist{
    z-index:10002!important
  } */
  .el-message{
    z-index: 100000!important;
  }
</style>

