<template>
  <div>
    <el-tabs v-model="tabsmodel" type='border-card' @tab-click='handleClick'>
        <el-tab-pane v-for="(list,index) in Lists" :label="list.name" :name="list.menuId + ''" :key='index'></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { getRouteNameByUrl } from '@/utils'
  export default {
    name: 'table-tree-column',
    props: {
      prop: {
        type: String
      }
    },
    data () {
      return {
        Lists: [],
        tabsmodel: '',
        isshow: false
      }
    },
    created () {
      this.getLists()
    },
    watch: {
      $route: 'routeHandle'
    },
    methods: {
      routeHandle () {
        this.getLists()
      },
      getLists () {
        var self = this
        this.Lists = []
        var list = JSON.parse(localStorage.getItem('menuobj')).list
        // this.Lists = JSON.parse(localStorage.getItem('menuobj')).list
        console.log(JSON.parse(localStorage.getItem('menuobj')))
        if (JSON.parse(localStorage.getItem('menuobj')).list !== null) {
          this.Lists = JSON.parse(localStorage.getItem('menuobj')).list
          for (var i = 0; i < list.length; i++) {
            if (self.$route.name === list[i].url.split('/')[list[i].url.split('/').length - 1].split('.')[0]) {
              self.tabsmodel = list[i].menuId + ''
            }
          }
          this.isshow = true
        } else {
          this.Lists.push(JSON.parse(localStorage.getItem('menuobj')))
          self.tabsmodel = JSON.parse(localStorage.getItem('menuobj')).menuId + ''
          this.isshow = false
        }
        console.log(self.tabsmodel)
      },
      handleClick (tab, event) {
        var name = this.Lists[tab.index].url
        var url = name.split('/')[name.split('/').length - 1].split('.')[0]
        this.$router.push({ name: url })
      },
      getMenuNavByRouteName (name, menuNavList) {
        var temp = []
        for (var i = 0; i < menuNavList.length; i++) {
          if (menuNavList[i].list && menuNavList[i].list.length >= 1) {
            temp = temp.concat(menuNavList[i].list)
          } else if (getRouteNameByUrl(menuNavList[i].url) === name) {
            return menuNavList[i]
          }
        }
        return temp.length >= 1 ? this.getMenuNavByRouteName(name, temp) : []
      },
      ...mapMutations(['UPDATE_MENU_NAV_LIST'])
    }
  }
</script>
