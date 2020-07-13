<template>
    <div class="ConfigChild" v-loading='isLoading'>
        <div style="display:flex;justify-content:space-between;align-items:center;background-color:#4b78cd;height:34px;">
            <div style="font-weight:700;font-size:18px;color:#fff;padding-left:15px">项目关系配置</div>
            <div @click="returnItemConfig"><span class="fa fa-close" style="color:#fff;font-size:25px;padding-right:15px;cursor:pointer;"></span></div>
        </div>
        <div style="display:flex;margin-top:35px;align-items:center;">
            <div style="width:120px;text-align:right;margin-right:15px;">OA系统</div>
            <el-select v-model="listQuery.itoaProjectName" placeholder="请输入项目名称搜索" style="width:400px" @visible-change='contralSelect("oa")' popper-class="caseFix" clearable>
              <div style="position:absolute;top:5px;left:0px;width:100%">
                <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchTextOa' @input="searchInfoOa"></el-input>
              </div>
              <el-option
                v-for="(item,index) in OaOptions"
                :key="index"
                :label="item.project"
                :value="item.project">
              </el-option>
            </el-select>
        </div>
        <div style="display:flex;margin-top:35px;align-items:center;">
            <div style="width:120px;text-align:right;margin-right:15px;">Redmine系统</div>
            <el-select v-model="listQuery.redProjectName" placeholder="请输入项目名称搜索" style="width:400px" @visible-change='contralSelect("redmine")' popper-class="caseFix" clearable>
              <div style="position:absolute;top:5px;left:0px;width:100%">
                <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchTextRedmine' @input="searchInfoRedmine"></el-input>
              </div>
              <el-option
                v-for="(item,index) in RedmineOptions"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
        </div>
        <div style="display:flex;margin-top:35px;align-items:center;">
            <div style="width:120px;text-align:right;margin-right:15px;">ITSM系统</div>
            <el-select v-model="listQuery.itsmProjectName" placeholder="请输入项目名称搜索" style="width:400px" @visible-change='contralSelect("itsm")' popper-class="caseFix" clearable>
              <div style="position:absolute;top:5px;left:0px;width:100%">
                <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchTextItsm' @input="searchInfoItsm"></el-input>
              </div>
              <el-option
                v-for="(item,index) in ItsmOptions"
                :key="index"
                :label="item.projectName"
                :value="item.projectName">
              </el-option>
            </el-select>
        </div>
        <div style="text-align:center;padding:35px 0;">
            <el-button style="border:none;background-color:#4b78cd;color:#fff;" @click="saveNews">保存</el-button>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import {systemlogStatis} from '@/api/modules/all'
import {oalistByParam, getRedmineProjectList, itsmlistByParam, addQxBaseProjectRule, updateQxBaseProjectRule} from '@/api/xyzqPort/itConfig'
export default {
  data () {
    return {
      isLoading: false,
      searchTextOa: '',
      searchTextRedmine: '',
      searchTextItsm: '',
      OaOptions: [],
      OaOptionsAll: [],
      RedmineOptions: [],
      RedmineOptionsAll: [],
      ItsmOptions: [],
      ItsmOptionsAll: [],
      listQuery: {
        redProjectName: '',
        itoaProjectName: '',
        itsmProjectName: ''
      },
      pageObj: {
        page: 1,
        pageSize: 10000
      }
    }
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '项目关系配置',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    // 获取oa itsm redmine 对应的项目
    this.getOaOptions()
    this.getRedmineOptions()
    this.getItsmOptions()
    // end
    if (typeof (this.$route.query.type) !== 'undefined' && this.$route.query.type === 'edit') {
      // this.ItemType = this.$route.params.ItemType
      // 编辑
      this.listQuery.redProjectName = this.$route.query.redProjectName
      this.listQuery.itoaProjectName = this.$route.query.itoaProjectName
      this.listQuery.itsmProjectName = this.$route.query.itsmProjectName
    }
  },
  methods: {
    // 返回父页面
    returnItemConfig () {
      const row = {
        projectName: this.$route.query.projectName,
        ItemType: this.$route.query.ItemType,
        page: this.$route.query.page,
        pageSize: this.$route.query.pageSize,
        activeName: this.$route.query.activeName
      }
      this.$router.push({name: 'ItemConfig', params: row})
    },
    // 关闭下拉框后的回调
    contralSelect (type) {
      if (type === 'oa') {
        this.searchTextOa = ''
        this.OaOptions = this.OaOptionsAll
      } else if (type === 'redmine') {
        this.searchTextRedmine = ''
        this.RedmineOptions = this.RedmineOptionsAll
      } else if (type === 'itsm') {
        this.searchTextItsm = ''
        this.ItsmOptions = this.ItsmOptionsAll
      }
    },
    // 模糊查询的方法
    searchInfoOa () {
      var newVal = this.searchTextOa
      var allList = []
      this.OaOptionsAll.forEach((item) => {
        if (item.project.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.OaOptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.OaOptions = allList
      }
    },
    searchInfoRedmine () {
      var newVal = this.searchTextRedmine
      var allList = []
      this.RedmineOptionsAll.forEach((item) => {
        if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.RedmineOptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.RedmineOptions = allList
      }
    },
    searchInfoItsm () {
      var newVal = this.searchTextItsm
      var allList = []
      this.ItsmOptionsAll.forEach((item) => {
        if (item.projectName.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.ItsmOptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.ItsmOptions = allList
      }
    },
    // 获取项目
    getOaOptions () {
      oalistByParam(this.pageObj).then(res => {
        this.OaOptions = res.data.rows
        this.OaOptionsAll = [...this.OaOptions]
        // console.log(res)
      })
    },
    getRedmineOptions () {
      getRedmineProjectList(this.pageObj).then(res => {
        // console.log(res)
        this.RedmineOptions = res.data
        this.RedmineOptionsAll = [...this.RedmineOptions]
      })
    },
    getItsmOptions () {
      itsmlistByParam(this.pageObj).then(res => {
        // console.log(res)
        this.ItsmOptions = res.data.rows.filter(item => {
          return item.projectName !== null
        })
        this.ItsmOptionsAll = [...this.ItsmOptions]
      })
    },
    // end
    getRedId (name) {
      let id = ''
      this.RedmineOptionsAll.forEach(item => {
        if (item.name === name) {
          id = item.id
          return false
        }
      })
      return id
    },
    saveNews: _.throttle(function () {
      if (this.listQuery.redProjectName === '') {
        this.$message({type: 'error', message: 'Redmine系统必填'})
        return
      } else if (this.listQuery.itoaProjectName === '' && this.listQuery.itsmProjectName === '') {
        this.$message({type: 'error', message: 'OA系统 和ITSM系统 需任选一个'})
        return
      }
      this.isLoading = true
      if (typeof (this.$route.query.type) !== 'undefined' && this.$route.query.type === 'edit') {
        let obj = JSON.parse(JSON.stringify(this.listQuery))
        obj.id = this.$route.query.id
        obj.type = 'oa'
        obj.redProjectId = this.getRedId(obj.redProjectName)
        updateQxBaseProjectRule(obj).then(res => {
          this.isLoading = false
          if (res.data.result === 'success') {
            // 成功
            this.$message({type: 'success', message: '修改成功'})
            this.returnItemConfig()
          } else {
            // 失败
            // descript
            this.$message({type: 'error', message: res.data.result, duration: 5000})
          }
        })
        return
      }
      // 新建
      let rows = JSON.parse(JSON.stringify(this.listQuery))
      rows.id = ''
      rows.type = 'oa'
      rows.redProjectId = this.getRedId(rows.redProjectName)
      addQxBaseProjectRule(rows).then(res => {
        this.isLoading = false
        if (res.data.result === 'success') {
          // 成功
          this.$message({type: 'success', message: '新建成功'})
          this.returnItemConfig()
        } else {
          // 失败
          // descript
          this.$message({type: 'error', message: res.data.result})
        }
      })
    }, 2000, {
      leading: true,
      trailing: false
    })
  }
}
</script>

<style lang="scss" scoped>
    .ConfigChild{
        margin-top: 15px;
        // padding: 15px;
        background-color: #fff;
    }
</style>


<style>
  .caseFix .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
</style>