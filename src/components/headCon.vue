<template>
<div class="header" style="position:relative">
  
  <div class="headWarp" :class="{fixed:flag == true}" ref="myscroll">
      <div class="box" style="color:#fff;height:44px;line-height:44px;display:flex;width:220px;margin-left:3%;">质量控制平台&nbsp;&nbsp;&nbsp;&nbsp;V2.7.1</div>
      <el-row type="flex" class="headcontent">
        <!-- <el-col :span="1" class="title" >
        </el-col> -->
        <el-col :span="22" style="height:44px;display:flex;justify-content:center;">
          <el-menu
            :default-active="activeIndex2"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#4B78CD"
            text-color="#fff"
            active-text-color="#ffd04b"
            >
            <div v-for="item in menuList" :key="item.menuId" style="float:left;" class="wbox">
              <el-menu-item v-if="item.list===null" :index='item.menuId.toString()' @click="goLink(item, item.menuId)" class="tacfont">{{item.name}}</el-menu-item>
              <el-submenu v-else-if="item.list!==null" :index='item.menuId.toString()' :key='item.menuId' class="masswall" >
                <template slot="title">{{item.name}}</template>
                <el-menu-item v-for="child in item.list" :key="child.menuId" :index='child.parentId.toString()' @click="goLink(child, child.parentId)" style="width:50px;color:#fff;">{{child.name}}</el-menu-item>
              </el-submenu>
            </div>
            <!-- <el-menu-item @click="goKnow()" class="tacfont">知识库</el-menu-item> -->
          </el-menu>
        </el-col>
      </el-row>
  </div>
  <div style="z-index:30000;position:fixed;right:70px;top:0;" class="lastexit" ref="lastexit">
    <el-row>
        <el-col :span="24">
          <el-menu
            style="width: 180px;display:flex;"
            mode="horizontal"
            @select="handleSelect"
            background-color="#4B78CD"
            text-color="#fff"
            active-text-color="#ffd04b"
            >
            <span style="line-height: 44px;color:#fff;width:100px;display:flex;justify-content:center;">{{chinesename}}</span>
            <el-menu-item @click="logOut()" style=" display:flex;justify-content: center;z-index:30000;" class="exit" :index='exitlog'>退出</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
  </div>
  <div class="footcont" style="height:44px;width:100%"></div>
</div>
</template>

<script>
import API from '@/api'
import { mapMutations } from 'vuex'
import Vue from 'vue'
export default {
  name: 'headCon',
  data () {
    return {
      index: '2',
      activeIndex2: '1',
      isDropHover: 2,
      activeDrop: {},
      dropList: [
        {name: '手机证券', id: '1-4'},
        {name: 'PB业务系统', id: '1-1'},
        {name: '网上交易系统', id: '1-2'},
        {name: '做市商系统', id: '1-3'}
      ],
      searchVal: '',
      menuList: [],
      flag: false,
      chinesename: '',
      exitlog: '22'
    }
  },
  watch: {
    $route: 'routeHandle'
  },
  // beforeRouteLeave (to, from, next) {
  //   console.log(1)
  //   to.meta.keepAlive = false
  //   next()
  // },
  created () {
    // this.getDictionary()
    // this.routeHandle()
    if (localStorage.getItem('tabIndex')) {
      this.activeIndex2 = localStorage.getItem('tabIndex')
      // console.log(this.activeIndex2)
    }
    // console.log(this.$route.path)
    if (this.$route.path === '/leaderReport') {
      this.activeIndex2 = '460'
    } else if (this.$route.path === '/qualityPort') {
      this.activeIndex2 = '454'
    } else if (this.$route.path === '/ReqPort') {
      this.activeIndex2 = '468'
    } else if (this.$route.path === '/OaPort') {
      this.activeIndex2 = '468'
    }
    this.getUserInfo()
    this.getMenuList()
  },
  mounted () {
    // window.addEventListener('scroll', this.handleScroll)
  },
  activated () {
    if (localStorage.getItem('tabIndex')) {
      this.activeIndex2 = localStorage.getItem('tabIndex')
    }
    this.activeIndex2 = localStorage.getItem('tabIndex')
  },
  methods: {
    // handleScroll () {
    //   let scrollTop =
    //   window.pageYOffset ||
    //   document.documentElement.scrollTop ||
    //   document.body.scrollTop
    //   console.log(scrollTop)
    //   this.$refs.lastexit.style.top = scrollTop + 'px'
    //   // scrollTop > 44 ? (this.flag = true) : (this.flag = false)
    //   if (scrollTop > 44) {
    //     this.flag = true
    //     this.$refs.myscroll.style.top = scrollTop + 'px'
    //     // this.$refs.myscroll.style.transition = 'all 0.4s'
    //   } else {
    //     this.flag = false
    //     this.$refs.myscroll.style.top = 0 + 'px'
    //     // this.$refs.myscroll.style.transition = 'all 1s'
    //   }
    // },
    logOut () {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'conStyle',
        type: 'warning'
      }).then(() => {
        API.common.logout().then(({data}) => {
          if (data && data.code === 0) {
            Vue.cookie.delete('user_token')
            this.DELETE_CONTENT_TABS([])
            this.$cookie.delete('token')
            this.$cookie.delete('projectId')
            this.$cookie.delete('versionId')
            // let url = location.search
            // url = url.replace('token', 'oldToken')
            // alert(url)
            // 横版菜单localStorage配置
            localStorage.removeItem('tabIndex')
            // 横版菜单localStorage配置
            localStorage.removeItem('navId')
            localStorage.removeItem('nextRoute')
            // 横竖版localStorage配置
            localStorage.removeItem('relationVersion')
            // window.event.returnValue = false
            // window.location.href = window.location.pathname + '#/login'
            // this.$router.push(path: '/login')
            // this.$router.path('/login')
            // if (window.event.preventDefault) window.event.preventDefault()
            this.$router.replace({ name: 'login' })
          }
        })
      })
    },
    // 获取当前管理员信息
    getUserInfo () {
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          this.loading = false
          this.chinesename = data.user.chinesename
          localStorage.setItem('userId', data.user.userId)
          this.DELETE_CONTENT_TABS([])
          this.UPDATE_USER_ID({ id: data.user.userId })
          this.UPDATE_USER_NAME({ name: data.user.username })
          // this.Redmine({ name: data.user.userMark })
          // this.UPDATE_IMAGE_PATH({ imagePath: data.user.imagePath })
        }
      })
      // this.DELETE_CONTENT_TABS([])
      // this.UPDATE_USER_ID({ id: this.$store.state.user.id })
      // this.UPDATE_USER_NAME({ name: this.$store.state.user.name })
    },
    ...mapMutations(['UPDATE_DOCUMENT_CLIENT_HEIGHT', 'UPDATE_USER_ID', 'UPDATE_USER_NAME', 'UPDATE_IMAGE_PATH', 'DELETE_CONTENT_TABS']),
    getMenuList () {
      // 登陆成功后，获取用户权限 2019/04/17 HGR
      API.menu.nav().then(({data}) => {
        this.menuList = data.menuList
        // console.log(this.menuList)
      })
    },
    goKnow () {
      window.open('http://192.25.105.195:9999/xwiki/bin/view/Main/')
    },
    goxnTest () {
      window.open('http://192.25.103.126:8089/')
    },
    goydTest () {
      window.open('http://quail.lab.tb/')
    },
    routeHandle (to, from) {
      // console.log(to.path.split('/')[1])
      var uname = to.path.split('/')[1]
      if (uname === 'index') {
        this.activeIndex2 = '1'
        localStorage.setItem('navId', '1')
      } else if (uname === 'processMGT') {
        this.activeIndex2 = '2'
        localStorage.setItem('navId', '2')
      } else if (uname === 'port') {
        this.activeIndex2 = '3'
        localStorage.setItem('navId', '3')
      } else if (uname === 'model') {
        this.activeIndex2 = '4'
        localStorage.setItem('navId', '4')
      } else if (uname === 'report') {
        this.activeIndex2 = '5'
        localStorage.setItem('navId', '5')
      } else if (uname === 'mgtCenter') {
        this.activeIndex2 = '7'
        localStorage.setItem('navId', '7')
      }
    },
    goLink (row, index) {
      // localStorage.setItem('modelRe', '')
      // localStorage.setItem('portRe', '')
      // // console.log(1)
      localStorage.setItem('tabIndex', index)
      // sessionStorage.setItem('active', index)
      // this.activeIndex2 = index
      // sessionStorage.setItem('active', row.url)
      // this.activeIndex2 = row.url
      if (row.url === '/knowlage') {
        this.goKnow()
      } else if (row.url === '/xnTest') {
        this.goxnTest()
      } else if (row.url === '/ydTest') {
        this.goydTest()
      } else {
        this.$router.push(row.url)
      }
    },
    dropHover (num) {
      this.isDropHover = num - 0
    },
    dropClick (item, index) {
      this.dropList.push(this.activeDrop)
      this.dropList.splice(index, 1)
      this.activeDrop = item
      this.isDropHover = 2
      localStorage.setItem('sysId', item.dictionaryValueCode)
      this.$router.push('/processMGT')
    },
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
    },
    searchClick () {
      // console.log(1)
    }
  }
}
</script>


<style scoped>
  .headWarp{
    height: 60px;
    width: 100%;
    background: rgb(64, 158, 255, 1);
    position: relative;
    display: flex;
    z-index: 19000;
    position: fixed;
    top: 0;
    left: 0;
    /* margin-bottom: 44px; */
    /* margin-top: 44px; */
    /* padding-bottom: 44px; */
  }

  .headcontent{
    width: 1024px;
    height: 44px;
    position: absolute;
    left: 53%;
    margin-left: -514px;
    line-height: 60px;
    color: white;
  }
  .title{
    font-size: 24px;
    cursor: pointer;
  }
  .skDropWarp{
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    padding: 0 20px;
    position: relative;
    z-index: 99;
  }
  /*.skDropWarp:hover{*/
    /*background: rgba(151,151,151,1);*/
    /*transition: all 0.5s;*/
  /*}*/
  .skDropCon{
    position: absolute;
    left: 0;
    top: 60px;
    height: auto;
    width: 110px;
    background: rgb(64, 158, 255, 1);
    color:white;
    text-indent:8px
  }
  .skDropItem:hover{
    background: rgba(151,151,151,1);
    transition: all 0.5s;
  }
  .searchWarp{
    width: 100%;
    height: 60px;
    position: absolute;
    left: 0;
    top: 60px;
    line-height: 60px;
    color: white;
    background: #232940;
  }
  .searchCon{
    width: 1024px;
    height: 60px;
    position: absolute;
    left: 50%;
    margin-left: -514px;
    line-height: 60px;
    color: white;
  }
.headWarp{
  min-width: 1170px;
  background-color: #4B78CD !important;
  height: 44px !important;
  /* box-sizing: border-box; */
}
/* ul导航 */
.el-menu {
  background-color: #4B78CD !important;
  height:44px !important;
}

/* 导航li */
.el-menu-item{
  background-color: #4B78CD !important;
  height: 100% !important;
  line-height: 44px !important;
  /* padding: 0 !important; */
}
.el-submenu {
  height: 44px;
}
.el-submenu__title{
  height: 44px !important;
  line-height: 44 !important;
}
.el-menu--horizontal>.el-submenu .el-submenu__title{
  height: 44px !important;
  line-height: 44 !important;
}
.el-submenu__title{
  height: 44px;
  line-height: 44px;
}
.headcontent .el-row .el-row--flex{
  height: 44px !important;
}
.masswall :nth-of-type(1){
  height: 44px;
  line-height: 44px;
  background-color: transparent !important;
}
 /* .el-tooltip__popper {
    max-width: 30% ;
    line-height: 130%;
  } */
  .el-menu-item{
    /* text-align: center; */
    width: 110px;
    margin: auto;
    line-height: 44px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    }
    .el-menu .el-menu-demo .el-menu--horizontal{
      width: 1000px !important;
    }
</style>
<style>
  .el-menu--horizontal>.el-menu-item:hover,.el-menu--horizontal>.el-submenu .el-submenu__title:hover{
    background: rgba(151,151,151,1)!important;
  }
  .el-menu--horizontal>.el-menu-item:hover{
    background: rgba(151,151,151,1)!important;
  }
  .el-menu-item {
    width: 110px !important;
  }
  .el-menu--popup{
    min-width: 110px;
    min-height: 30px;
    padding: 0 0;
    border-radius: 0;
    text-align: center;
    border: none;
    z-index: 10009;
  }
  .el-menu--popup-bottom-start {
    margin-top: 0px;
  }
  .el-menu--popup .el-menu-item{
    height: 30px;
    display: flex;
    justify-content: center;
    border: none;
    z-index: 10000;
  }
  .tacfont{
    display: flex;
    justify-content: center;
    /* height: 44px; */
  }
  .el-submenu__title{
    display: flex;
    align-items: center;
  }
  .el-submenu__title{
    width: 110px;
  }
  .el-submenu{
    border: none;
  }
  .wbox{
    padding: 0 5 !important;
  }
  .el-menu-item {
    z-index: 9999 !important;
    padding: 0;
  }
  .el-submenu__title{
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .el-submenu__icon-arrow,.el-icon-arrow-down{
    margin: -20px;
    /* right: 8px; */
  }
  .wbox:hover{
    background-color: rgba(151,151,151,1)!important;
  }
  .tacfont:hover{
    background-color: rgba(151,151,151,1)!important;
  }
  .exit{
    position: absolute;
    right: 0%;
    width: 80px !important;
  }
  .headcontent{
    position: relative;
  }
  .box{
    font-weight: 700;
    font-size: 17px;
  }
  .fixed{
    position: fixed;
    /* top: 200px; */
    z-index: 999;
  }
  ul{
    border-bottom: none !important;
    /* height: 44px; */
  }
  li{
    border-bottom: none !important;
  }
  .el-menu--popup{
    border-bottom: none !important;
  }
</style>

<style>
  .el-message-box__wrapper{
    z-index: 32000 !important;
  }
  .conStyle{
    color: #fff !important;
    background-color: #4b78cd !important;
    border: none !important;
  }
  /* .el-menu-item,.exit{
    width: 80px;
  } */
  /* .el-message-box__btns button:nth-child(2) {
    background-color: #4b78cd;
    border: none;
    color: #fff;
  } */
</style>