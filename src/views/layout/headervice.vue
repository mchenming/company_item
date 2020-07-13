<template>
  <header class="site-topbar">
    <!-- <el-row>
      <img src="~@/assets/img/banner1.jpg" style="width:100%;height:140px">
    </el-row> -->
    <div class="site-topbar__header" style="height:50px">
      <h1 class="site-logo" @click="$router.push({ name: 'qualityBoard' })" style="background: #c31a1e;">
        <a class="site-logo__lg">测试管理平台</a>
        <a class="site-logo__mini" href="javascript:;">测试</a>
      </h1>
    </div>
    <div class="site-topbar__body clearfix" >
      <!-- <el-menu
        class="site-topbar__menu"
        background-color='#c31a1e'
        style="position: absolute;left: 0;"
        mode="horizontal">
        <el-menu-item class="site-topbar__switch" index="1-1" @click="switchSidebarCollapseHandle()">
          <icon-svg name="zhedie" style="color: white"></icon-svg>
        </el-menu-item>
      </el-menu> -->
      <div class="menuNar" style="">
        <div class="menuWrap" v-on:mouseover="menu1 = true"  v-on:mouseout="menu1 = false">
          <div class="menuTitle" @click="goQualityBoard">质量看板</div>
          <div class="menuList" v-if="menu1 === true">
            <div class="menuListItem" @click="goBoard(1)">测试计划看板</div>
            <div class="menuListItem" @click="goBoard(2)">测试问题看板</div>
            <div class="menuListItem" @click="goBoard(3)">测试需求看板</div>
            <div class="menuListItem" @click="goBoard(4)">测试用例看板</div>
            <div class="menuListItem" @click="goengineer">工程师看板</div>
          </div>
        </div>
        <div class="menuWrap" v-on:mouseover="menu2 = true"  v-on:mouseout="menu2 = false">
          <div class="menuTitle">管理中心</div>
          <div class="menuList2"  v-if="menu2 === true">
            <!-- <div class="menuItemWarp"  v-if="list.list.length > 0" v-for="list in lists">
              <div class="menuItemTitle">{{list.name}}</div>
              <div class="menuListItem" @click="goroute(item)" v-for="item in list.list">{{item.name}}</div>
            </div> -->
          </div>
        </div>
      </div>
      <!-- <el-menu
        background-color='#c31a1e' style="float:right"
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
      </el-menu> -->
      <div class="iconWarp headervice">
        <i class="fa-lg fa fa-search" @click="iconClick"  style="margin:0 0 0 13px;font-size:16px"></i>
        <i class="fa-lg fa fa-envelope-o"  style="margin:0 0 0 13px;font-size:16px"></i>
        <i class="fa-lg fa fa-th-list"  style="margin:0 0 0 13px;font-size:16px"></i>
        <el-dropdown placement="bottom" :hide-on-click="false">
          <i class="fa-lg fa fa-user-circle-o el-dropdown-link"  style="margin:0 0 0 10px;font-size:16px"></i>
          <el-dropdown-menu slot="dropdown" style="">
            <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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
        updatePassowrdVisible: true,
        menu1: false,
        menu2: false,
        lists: [],
        sysList: []
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    beforeRouteLeave (to, from, next) {
      console.log(to)
      console.log(from)
      // to.meta.keepAlive = false
      // next()
    },
    components: {
      UpdatePassword
    },
    created () {
      this.getMenuNavList()
      // console.log(this.$store.state.contentTabs)
    },
    methods: {
      routeHandle (to, from) {
        console.log(to)
        console.log(from)
      },
      iconClick () {
        this.$router.push({path: '/searchCenter'})
      },
      goBoard (index) {
        if (index === 1) {
          this.$router.push({path: '/planEcharts'})
        } else if (index === 2) {
          this.$router.push({path: '/bugEcharts'})
        } else if (index === 3) {
          this.$router.push({path: '/demandEcharts'})
        } else if (index === 4) {
          this.$router.push({path: '/caseEcharts'})
        }
      },
      goQualityBoard () {
        this.$router.push({path: '/qualityBoard'})
        // console.log(1)
      },
      goengineer () {
        this.$router.push({path: '/engineerBoard'})
      },
      goroute (item) {
        // console.log(item.url)
        if (item.url === null) {
          var urlUse = item.list[0].url
          // console.log(urlUse)
          // console.log(urlUse.split('.')[0].split('/')[urlUse.split('.')[0].split('/').length - 1])
          this.$router.push({path: 'n/' + urlUse.split('.')[0].split('/')[urlUse.split('.')[0].split('/').length - 1]})
        } else {
          this.$router.push({path: 'n/' + item.url.split('.')[0].split('/')[item.url.split('.')[0].split('/').length - 1]})
          // this.$router.push({path: item.url.split('.')[0]})
        }
        this.menu2 = false
      },
      // 获取菜单导航列表 / 权限
      getMenuNavList () {
        return API.menu.nav().then(({data}) => {
          if (data && data.code === 0) {
            // console.log(data.menuList)
            this.lists = data.menuList
          }
        })
      },
      // 切换侧边栏, 水平折叠收起状态
      switchSidebarCollapseHandle () {
        // this.SWITCH_SIDEBAR_COLLAPSE({ collapse: !this.$store.state.sidebarCollapse })
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
      ...mapMutations(['DELETE_CONTENT_TABS'])
    }
  }
</script>

<style scoped>
.menuNar{
  float:left;
  line-height: 50px;
  height: 50px;
  color: white;
  display: flex;
  cursor: pointer;
}
.menuWrap{
  position: relative;
  padding: 0 27px;
  background-color: #c31a1e;
  margin-right:20px;
}
.menuTitle:hover{
  opacity: 0.9;
}
.menuList{
  position: absolute;
  left:0;
  top: 50px;
  width: 110px;
  height: auto;
  background-color: white;
  box-shadow: 2px 2px 5px #333333
}
.menuList2{
  position: absolute;
  left:0;
  top: 50px;
  width: max-content;
  height: auto;
  background-color: white;
  box-shadow: 4px 4px 8px rgba(0,0,0,0.5);
  border-radius: 2px;
}
.menuListItem:hover{
  opacity: 1;
  /* background-color:black; */
  color:black
}
.menuListItem{
  color:#868686;
  line-height: 25px;
  padding: 3px 10px
}
.menuItemWarp{
  float:left;
}
.menuItemTitle{
  text-align: center;
  color:black;
  font-weight: bold;
}
.iconWarp{
  color:white;
  float: right;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
}
</style>

<style>
  .headervice .el-dropdown{
    color:white
  }
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

