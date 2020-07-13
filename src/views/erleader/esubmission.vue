<template>
    <div class="erneed">
        <div class="saltitle">
            <h2>缺陷列表</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="slidebox">
            <div class="item">
                <span>项目</span>
                <el-select v-model="listQuery.project_id" placeholder="请选择" @change='versionchange' popper-class="onmouthFix">
                <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                  <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:200px" v-model='searchTextitem' @input="searchInfo" @focus='leaveinp' @blur="getss"></el-input>
                </div>
                  <el-option
                    v-for="item in projectOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            <div class="mouth">
                <span>版本</span>
                <el-select v-model="listQuery.version_id" placeholder="请选择" @change='versionChange' popper-class="mouthFix">
                  <el-option
                    v-for="item in versionOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            <div class="username">
                <span>作者</span>
                <el-select v-model="listQuery.author_id" placeholder="请选择" @change='userChange' ref="scrolluser" popper-class="onmouthFix">
              <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:200px" v-model='searchText' @input="searchInfouser" @focus='leaveinpuser' @blur="getdd"></el-input>
              </div>
                  <el-option
                    v-for="item in userOptions"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            <div class="checkcondition">
                <span>查询时间</span>
                <el-select v-model="checkcond" placeholder="请选择" @change='getcheckcondition' popper-class="mouthFix">
                  <el-option
                    v-for="item in checkcondition"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            <div class="info">
              <span>状态</span>
                <el-select
                  v-model="statusIds"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择标签" 
                  style="width:1025px;"
                  @change="statusIdChange"
                  popper-class="mouthFix">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
        </div>
        <div class="itemtable">
             <el-table :data="tableData" style="width: 100%" :default-sort="{}"
            @sort-change="changeOrder" v-loading="listLoading" element-loading-text="加载中。。。">
              <el-table-column prop="id" label="缺陷ID" width="90" align="center" sortable="custom">
                  <template slot-scope="scope">
                      <el-button type="text" @click="goRedmine(scope.row.id)">{{scope.row.id}}</el-button>
                  </template>
              </el-table-column>
              <el-table-column prop="priority_id" label="优先级" width="90" align="center" sortable="custom">
                  <template slot-scope="scope">
                    <div v-if="scope.row.priority_id === '3'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;text-align: center;">
                      <span style="color: #67c23a;text-align: center;">高</span></div>
                    <div v-else-if="scope.row.priority_id === '4'" style="width: 50px;height: 30px;background-color: #fdf6ec;line-height: 30px;margin:auto;text-align: center;">
                      <span style="color: #e6a23c;text-align: center;">紧急</span></div>
                    <div v-else-if="scope.row.priority_id === '5'" style="width: 50px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;text-align: center;">
                      <span style="color: #f56c6c;text-align: center;">立刻</span></div>
                    <div v-else-if="scope.row.priority_id === '2'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;text-align: center;">
                      <span style="color: #409eff;text-align: center;">普通</span></div>
                      <div v-else style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;text-align: center;">
                      <span style="color: #409eff;text-align: center;">低</span></div>
                  </template>
              </el-table-column>

              <el-table-column prop="project_id" label="项目" sortable="custom" align="center" width="135">
                  <template slot-scope="scope">
                    <div style="text-align:center">{{checkitem(scope.row.project_id)}}</div>
                  </template>
              </el-table-column>

              <el-table-column prop="subject" label="主题" align="center" sortable="custom">
                  <template slot-scope="scope">
                      <div style="text-align:left">{{scope.row.subject}}</div>
                  </template>
              </el-table-column>
              
              <el-table-column prop="parent_id" label="需求ID" width="90" align="center" sortable="custom">
                  <template slot-scope="scope">
                      <el-button type="text" @click="goRedmine(scope.row.parent_id)">{{scope.row.parent_id}}</el-button>
                  </template>
              </el-table-column>
              
              <el-table-column prop="status_id" label="状态" width="120" align="center" sortable="custom">
                  <template slot-scope="scope">
                    <div v-for="(item,index) in statusOptions" :key="index">
                      <div v-if="item.id === scope.row.status_id">
                        <el-tag v-if="scope.row.status_id === '5'" type="success">{{item.text}}</el-tag>
                        <el-tag v-else-if="scope.row.status_id === '27'" type="danger">{{item.text}}</el-tag>
                        <el-tag v-else>{{item.text}}</el-tag>
                      </div>
                    </div>
                  </template>
              </el-table-column>

              <el-table-column prop="severity_level" label="严重级别" width="120" align="center" sortable="custom">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.severity_level==='2-严重' || scope.row.severity_level==='1-致命'" type="danger">{{scope.row.severity_level}}</el-tag>
                    <el-tag v-else-if="scope.row.severity_level==='3-一般'">{{scope.row.severity_level}}</el-tag>
                    <div v-else-if="scope.row.severity_level===null"></div>
                    <el-tag v-else type="success">{{scope.row.severity_level}}</el-tag>
                  </template>
              </el-table-column>

              <el-table-column prop="assigned_to_id" label="指派给" width="100" align="center" sortable="custom">
                <template slot-scope="scope">
                  {{scope.row.assigned_name}}
                </template>
              </el-table-column>
              <el-table-column prop="author_id" label="作者" width="100" align="center" sortable="custom">
                <template slot-scope="scope">
                  {{scope.row.author_name}}
                </template>
              </el-table-column>
              
              <el-table-column prop="created_on" label="创建时间" sortable="custom" align="center" width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.created_on.split(' ')[0]}}</span>                    
                </template>
              </el-table-column>
              <el-table-column prop="closed_on" label="关闭时间" sortable="custom" align="center" width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.closed_on!==null">{{scope.row.closed_on.split(' ')[0]}}</span>                    
                </template>
              </el-table-column>
            </el-table>
        </div>
        <div class="pagenumchoose">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="listQuery.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="listQuery.pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next"
            class="pagenum">
          </el-pagination>
        </div>
    </div>
</template>

<script>
import {getversiondict, getProjectByUser, getAllStatusData, getuserdict, getNewVersionByProject} from '@/api/xyzqPort/erneed'
import {getBugListByParams} from '@/api/xyzqPort/esubmission'
import API from '@/api'
import {systemlogStatis} from '@/api/modules/all'
import { getUUID } from '@/utils'
export default {
  data () {
    return {
      listLoading: false,
      total: 0,
      tableData: [],
      statusOptions: [],
      optionsinfo: [{
        value: 'HTML',
        label: 'HTML'
      }, {
        value: 'CSS',
        label: 'CSS'
      }, {
        value: 'JavaScript',
        label: 'JavaScript'
      }],
      priorityOptions: [
        {id: '1', text: '低'},
        {id: '2', text: '普通'},
        {id: '3', text: '高'},
        {id: '4', text: '紧急'},
        {id: '5', text: '立刻'}
      ],
      checkcondition: [
        {id: 0, text: '全部'},
        {id: 1, text: '近一周'},
        {id: 2, text: '近一月'},
        {id: 3, text: '近三月'}
      ],
      checkcond: '',
      searchText: '',
      searchTextitem: '',
      versionOptions: [],
      projectOptions: [],
      valueitem: '',
      valueversion: '',
      valueinfo: '',
      userId: '',
      listQuery: {
        userId: '',
        project_id: '',
        version_id: '',
        status_id: '',
        pageIndex: 1,
        pageSize: 10,
        serNo: getUUID(),
        orderkey: '',
        orderType: '',
        author_id: '',
        author_name: '',
        tcstart: '',
        tcend: ''
      },
      statusIds: [],
      userOptions: [],
      itemallname: [],
      allbugarr: [],
      alluserdata: []
    }
  },
  created () {
    // this.listQuery.author_name = this.$route.query.name
    if (this.$route.query.id) {
      this.listQuery.author_id = this.$route.query.id + ''
    }
    if (this.$route.query.tcbugTimeType) {
      this.checktime(this.$route.query.tcbugTimeType)
      this.checkcond = Number(this.$route.query.tcbugTimeType)
    }
    if (this.$route.query.bugTimeType) {
      this.checktime(this.$route.query.bugTimeType)
      this.checkcond = Number(this.$route.query.bugTimeType)
    }
    if (this.$route.query.proid) {
      this.listQuery.project_id = this.$route.query.proid
      this.getversion()
    }
    this.listQuery.orderkey = 'id'
    this.listQuery.orderType = 'desc'
    this.getproject()
    this.getUserOptions()
    this.getStatusOptions()
    // console.log(this.listQuery.author_id)
    // this.allbugarr = JSON.parse(localStorage.getItem('authorsarr'))
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.scrolluser.scrollTop = 0 + 'px'
    })
    let allObj = {
      url: this.$route.path,
      moduleName: '项目驾驶舱',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    checkitem (itemid) {
      // console.log(this.projectOptions)
      let proname = ''
      this.itemallname.forEach(item => {
        if (item.id === itemid) {
          proname = item.name
        }
      })
      return proname
    },
    checktime (check) {
      // console.log(check)
      const end = new Date()
      const start = new Date()
      var tcEnd = this.getTimeByDate(end)
      var tcStart = ''
      if (Number(check) === 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        tcStart = this.getTimeByDate(start)
      } else if (Number(check) === 2) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        tcStart = this.getTimeByDate(start)
      } else if (Number(check) === 3) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        tcStart = this.getTimeByDate(start)
      } else {
        tcStart = ''
        tcEnd = ''
      }
      this.listQuery.tcstart = tcStart
      this.listQuery.tcend = tcEnd
      // console.log(this.listQuery)
    },
    // 处理时间的函数
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    getcheckcondition () {
      this.checktime(this.checkcond)
      this.getListData()
    },
    userChange (val) {
      // console.log(val)
      this.tableData = []
      this.total = 0
      this.listQuery.author_id = val
      this.getListData()
    },
    goRedmine (id) {
      window.open('http://192.25.97.80/redmine/issues/' + id)
    },
    getUserOptions () {
      const row = {
        project_id: ''
      }
      getuserdict(row).then(res => {
        this.userOptions = res.data.data
        // console.log(this.userOptions)
        // this.userOptions.sort(function compareFunction (param1, param2) {
        //   var ord = 0
        //   // if (column.order === 'ascending') {
        //   ord = param1.text.localeCompare(param2.text, 'zh-Hans-CN', {sensitivity: 'accent'})
        //   // }
        //   return ord
        // })
        this.userOptions.unshift({id: '', text: '全部'})
        this.alluserdata = this.userOptions
      })
    },
    // 获取所有的状态信息
    getStatusOptions () {
      const row = {
        tracker_id: '1'
      }
      getAllStatusData(row).then(res => {
        this.statusOptions = res.data.list
        // console.log(this.statusOptions)
      })
    },
    sizeChangeHandle (val) {
      this.listQuery.pageSize = val
      this.getListData()
    },
    // // 根据当前页接受数据
    currentChangeHandle (val) {
      this.listQuery.pageIndex = val
      this.getListData()
    },
    // 排序
    changeOrder (column, prop, order) {
      this.listQuery.orderkey = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.getListData()
    },
    searchList () {
      this.listQuery.pageIndex = 1
      this.getListData()
    },
    // 切换版本
    versionChange () {
      // 当切换版本的时候状态值因该为空的
      // this.statusIds = []
      // this.listQuery.author_id = ''
      // this.listQuery.status_id = this.statusIds.join(',')
      this.searchList()
    },
    // 退出
    exit () {
      const row = {
        type: '',
        tval: ''
      }
      if (this.$route.query.tcbugTimeType) {
        row.type = 'tcbugTimeType'
        row.tval = Number(this.$route.query.tcbugTimeType)
      }
      if (this.$route.query.bugTimeType) {
        row.type = 'bugTimeType'
        row.tval = Number(this.$route.query.bugTimeType)
      }
      this.$router.push({path: '/leaderReport', query: row})
      // this.$router.go(-1)
    },
    getss () {
      this.searchTextitem = ''
      // this.projectOptions = this.itemallname
    },
    getdd () {
      this.searchText = ''
    },
    // 鼠标离开搜索光标
    leaveinp () {
      // console.log(this.itemallname)
      this.searchInfo()
      this.searchText = ''
      this.projectOptions = this.itemallname
    },
    leaveinpuser () {
      this.searchText = ''
      this.userOptions = this.alluserdata
      this.searchInfouser()
    },
    // this.alluserdata = this.userOptions
    // 根据用户名排序
    searchInfouser () {
      var newVal = this.searchText
      var allList = []
      if (newVal.length > 0) {
        this.alluserdata.forEach((item) => {
          if (item.text.toLowerCase().includes(newVal.toLowerCase()) === true) {
            allList.push(item)
          }
        })
        if (allList.length === 0) {
          this.userOptions = [{text: '暂无数据', id: '', disabled: true}]
        } else {
          this.userOptions = allList
        }
      } else {
        this.userOptions = this.alluserdata
      }
    },
    // 根据搜索输入内容提示搜索文本
    searchInfo () {
      var newVal = this.searchTextitem
      var allList = []
      // console.log(newVal)
      if (newVal.length > 0) {
        setTimeout(() => {
          this.itemallname.forEach((item) => {
            if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
              // console.log(123)
              allList.push(item)
            }
          })
          if (allList.length === 0) {
            this.projectOptions = [{name: '暂无数据', id: '', disabled: true}]
          } else {
            // console.log(allList)
            this.projectOptions = allList
          }
        }, 0)
      } else {
        this.projectOptions = this.itemallname
      }
    },
    versionchange () {
      this.searchText = ''
      this.projectOptions = this.itemallname
      // this.statusIds = []
      // this.listQuery.status_id = ''
      // this.listQuery.author_id = ''
      // this.listQuery.tcstart = ''
      // this.listQuery.tcend = ''
      this.checkcond = 0
      this.getversion()
    },
    // 获取所有的版本id
    getversion () {
      // debugger
      var obj = {
        projectId: this.listQuery.project_id
      }
      getversiondict(obj).then(res => {
        console.log(res.data)
        this.versionOptions = res.data.rows
        this.versionOptions.unshift({
          id: '',
          name: '全部'
        })
        // 不等于0没有最新版本查全部 等于0显示默认最新版本
        if (Number(this.checkcond) !== 0) {
          this.listQuery.version_id = ''
          this.searchList()
        } else {
          getNewVersionByProject(this.listQuery).then(res => {
            // console.log(res.data.list[0])
            this.listQuery.version_id = ''
            if (res.data.list.length > 0) {
              if (res.data.list[0].version_id !== null && res.data.list[0].version_id !== '') {
                this.listQuery.version_id = res.data.list[0].version_id
              }
            } else {
              this.tableData = []
              this.total = 0
              // return
            }
            // 获取所选项目的最新版本需求的信息
            this.searchList()
          })
        }
      })
    },
    // 获取所有的项目
    getproject () {
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            serNo: getUUID(),
            roleName: '管理人员'
          }
          // this.allbugarr = []
          // getBugByAuthor(row).then(res => {
          //   this.allbugarr = res.data.tc
          //   this.allbugarr.forEach(item => {
          //     if (item.firstname === this.$route.query.name) {
          //       this.listQuery.author_id = item.author_id
          //     }
          //   })
          //   // console.log(this.listQuery)
          // })
          this.listQuery.userId = data.user.userId
          if (!this.$route.query.proid) {
            this.getListData()
          }
          getProjectByUser(row).then(res => {
            this.projectOptions = res.data.list
            this.projectOptions.unshift({
              id: '',
              name: '全部'
            })
            // console.log(this.projectOptions)
            this.itemallname = this.projectOptions
          })
        }
      })
    },
    // 获取当前页的table信息
    getListData () {
      this.listLoading = true
      // this.tableData = []
      // this.total = 0
      // console.log(this.listQuery)
      getBugListByParams(this.listQuery).then(response => {
        // console.log(response.data.list)
        this.tableData = response.data.list
        this.total = response.data.total
        // console.log(this.tableData)
        this.listLoading = false
      })
    },
    // 当点击选中状态时根据状态数组的id值发送请求
    statusIdChange () {
      this.listQuery.status_id = this.statusIds.join(',')
      this.searchList()
    }
  }
}
</script>

<style lang="scss" scoped>
    .erneed{
      margin-top: 0px;;
      .saltitle{
        height: 34px;
        background-color: #4b78cd;
        margin: 10px 0;
        line-height: 34px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        h2{
          font-size: 15px;
          color: #fff;
          margin: 0;
          padding: 0;
          padding: 0 0 0 30px;
        }
      }
      .slidebox{
        height: 100px;
        width: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        flex-flow: wrap;
        .item{
          margin-right: 20px;
          span{
              margin-right: 10px;
          }
        }
        .mouth{
          margin-right: 20px;
          span{
              margin-right: 10px;
          }
        }
        .username{
          span{
            margin-right: 10px;
          }
        }
        .checkcondition{
          margin-left: 30px;
          span{
            margin-right: 10px;
          }
        }
        .info{
          width: 100%;
          span{
            margin-right: 10px;
          }
        }
      }
      .pagenumchoose{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
        background-color: #fff;
      }
    }
</style>

<style lang="scss">
    .saltitle [class*=" el-icon-"], [class^=el-icon-]{
      font-size: 26px;
      color: #fff;
      font-weight: 700;
      margin-right: 20px;
      cursor: pointer;
    }
    .el-select-dropdown__wrap,.el-scrollbar__wrap{
      margin-bottom: -3px !important;
    }
    .el-tag{
        min-width: 60px;
        padding: 0 6px;
    }
</style>


<style>
  .mouthFix .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .onmouthFix .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-right: 0px !important;
    margin-top: 50px !important; 
  }
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .mouthFix .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-top: 0px !important;
  }
</style>
