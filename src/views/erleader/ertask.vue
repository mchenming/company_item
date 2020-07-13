<template>
    <div class="erneed">
        <div class="saltitle">
            <h2>任务</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="slidebox">
          <el-row style="margin-top: 10px;">
            <el-col :span="11">
              <div class="item">
                <span style="width: 30%;">请选择项目</span>
                <el-select v-model="listQuery.project_id" placeholder="请选择" @change='projectChange'  style="width: 70%;">
                <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:90%" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                  <el-option
                    v-for="item in projectOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            </el-col>
            <el-col :span="11">
              <div class="mouth">
                <span  style="width: 30%;">请选择版本</span>
                <el-select v-model="listQuery.version_id" placeholder="请选择" @change='versionChange'  style="width: 70%;">
                  <el-option
                    v-for="item in versionOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <div class="info" style="width:100%">
              <span  style="width: 30%;text-align: center;margin-right: 46px;">状   态</span>
                <el-select
                  v-model="statusIds"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择状态" 
                  style="width:77%;"
                  @change="statusIdChange">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
          </el-row> 
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tabls">
          <el-tab-pane label="开发任务" name="first">
            <div class="itemtable">
             <el-table :data="tableData" style="width: 100%" :default-sort="{prop: '', order: ''}"
            @sort-change="changeOrder" v-loading="listLoading" element-loading-text="加载中。。。">
              <el-table-column prop="id" label="任务ID" width="100" align="center" sortable="custom">
                  <template slot-scope="scope">
                      <el-button type="text" @click="goRedmine(scope.row)">{{scope.row.id}}</el-button>
                  </template>
              </el-table-column>
              <el-table-column prop="priority_id" label="优先级" width="120" align="center" sortable="custom">
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

              
              <el-table-column prop="project_id" label="项目" sortable="custom" align="center" width="200">
                  <template slot-scope="scope">
                    <div style="text-align:center">{{checkitem(scope.row.project_id)}}</div>
                  </template>
              </el-table-column>

              <el-table-column prop="subject" label="主题" align="center" sortable="custom">
                  <template slot-scope="scope">
                      <div style="text-align:left">{{scope.row.subject}}</div>
                  </template>
              </el-table-column>
              
              <el-table-column prop="status_id" label="状态" width="130" align="center" sortable="custom">
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

              <el-table-column prop="assigned_to_id" label="指派给" width="130" align="center" sortable="custom">
                <template slot-scope="scope">
                  <!-- <div v-for="(item,index) in userOptions" :key="index">
                      <span v-if="item.id === Number(scope.row.assigned_to_id)">{{item.text}}</span>
                    </div> -->
                    {{scope.row.assigned_name}}
                </template>
              </el-table-column>
              <el-table-column prop="created_on" label="创建时间"  width="120" align="center" sortable="custom">
                <template slot-scope="scope">
                  <span>{{scope.row.created_on.split(' ')[0]}}</span>
                </template>
              </el-table-column>

              <el-table-column prop="closed_on" label="关闭时间"  width="120" align="center" sortable="custom">
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
          </el-tab-pane>

          <el-tab-pane label="测试任务" name="second">
            <div class="itemtable">
             <el-table :data="tableData" style="width: 100%" :default-sort="{prop: '', order: ''}"
            @sort-change="changeOrder" v-loading="listLoading" element-loading-text="加载中。。。">
              <el-table-column prop="id" label="任务ID" width="100" align="center" sortable="custom">
                  <template slot-scope="scope">
                      <el-button type="text" @click="goRedmine(scope.row)">{{scope.row.id}}</el-button>
                  </template>
              </el-table-column>
              <el-table-column prop="priority_id" label="优先级" width="120" align="center" sortable="custom">
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

              <el-table-column prop="project_id" label="项目" sortable="custom" align="center" width="200">
                  <template slot-scope="scope">
                    <div style="text-align:center">{{checkitem(scope.row.project_id)}}</div>
                  </template>
              </el-table-column>

              <el-table-column prop="subject" label="主题" align="center" sortable="custom">
                  <template slot-scope="scope">
                      <div style="text-align:left">{{scope.row.subject}}</div>
                  </template>
              </el-table-column>
              
              <el-table-column prop="status_id" label="状态" width="130" align="center" sortable="custom">
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

              <el-table-column prop="assigned_to_id" label="指派给" width="130" align="center" sortable="custom">
                <template slot-scope="scope">
                  <!-- <div v-for="(item,index) in userOptions" :key="index">
                      <span v-if="item.id === Number(scope.row.assigned_to_id)">{{item.text}}</span>
                    </div> -->
                    {{scope.row.assigned_name}}
                </template>
              </el-table-column>
              <el-table-column prop="created_on" label="创建时间"  width="120" align="center" sortable="custom">
                <template slot-scope="scope">
                  <span>{{scope.row.created_on.split(' ')[0]}}</span>
                </template>
              </el-table-column>
              
              <el-table-column prop="closed_on" label="关闭时间"  width="120" align="center" sortable="custom">
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
          </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {getversiondict, getProjectByUser, getAllStatusData, getuserdict, getNewVersionByProject} from '@/api/xyzqPort/erneed'
import {getTaskListByParams} from '@/api/xyzqPort/ertask'
// import API from '@/api'
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
      searchText: '',
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
        tracker_id: ''
      },
      statusIds: [],
      userOptions: [],
      itemallname: [],
      activeName: 'second'
    }
  },
  created () {
    if (this.$route.query.type === '开发任务') {
      this.activeName = 'first'
      this.listQuery.tracker_id = 5
    } else {
      this.activeName = 'second'
      this.listQuery.tracker_id = 7
      // document.querySelector('.el-tabs__active-bar,.is-top').style.transform = 'translateX(10px)'
    }
  },
  mounted () {
    if (typeof (this.$route.query.project_id) !== 'undefined' && this.$route.query.project_id !== '') {
      this.listQuery.project_id = this.$route.query.project_id
    }
    let allObj = {
      url: this.$route.path,
      moduleName: '项目驾驶舱',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    this.listQuery.userId = localStorage.getItem('userId')
    this.statusIds = []
    this.getproject()
    this.getUserOptions()
    this.getStatusOptions()
  },
  methods: {
    // 显示table的项目名称
    checkitem (itemid) {
      // console.log(this.projectOptions)
      let proname = ''
      this.projectOptions.forEach(item => {
        if (item.id === itemid) {
          proname = item.name
        }
      })
      return proname
    },
    // 点击不同的分页传递不同的参数  获取不同的数据
    handleClick (tab, event) {
      // this.listQuery.version_id
      if (tab.index === '0') {
        this.listQuery.tracker_id = 5
        this.getListData()
      } else if (tab.index === '1') {
        this.listQuery.tracker_id = 7
        this.getListData()
      }
      // this.getStatusOptions()
    },
    goRedmine (row) {
      window.open('http://192.25.97.80/redmine/issues/' + row.id)
    },
    getUserOptions () {
      const row = {
        project_id: ''
      }
      getuserdict(row).then(res => {
        this.userOptions = res.data.data
      })
    },
    getStatusOptions () {
      getAllStatusData(this.listQuery).then(res => {
        this.statusOptions = res.data.list
        if (typeof (this.$route.query.type) !== 'undefined' && this.$route.query.type === '1') {
          for (let i = 0; i < res.data.list.length; i++) {
            const ele = res.data.list[i]
            if (ele.text !== '已关闭') {
              this.statusIds.push(ele.id)
            }
          }
        }
        this.listQuery.status_id = this.statusIds.join(',')
        this.getversion()
      })
    },
    sizeChangeHandle (val) {
      // console.log(val)
      this.listQuery.pageSize = val
      this.getListData()
    },
    // // 当前页
    currentChangeHandle (val) {
      // debugger
      // console.log(val)
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
    versionChange () {
      this.statusIds = []
      this.listQuery.status_id = this.statusIds.join(',')
      this.searchList()
    },
    exit () {
      this.$router.go(-1)
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
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
    projectChange () {
      this.statusIds = []
      this.listQuery.status_id = ''
      this.getversion()
    },
    // 获取所有的版本id
    getversion () {
      var obj = {
        projectId: this.listQuery.project_id
      }
      getversiondict(obj).then(res => {
        // console.log(res.data)
        this.versionOptions = res.data.rows
        this.versionOptions.unshift({
          id: '',
          name: '全部'
        })
        getNewVersionByProject(this.listQuery).then(res => {
          this.listQuery.version_id = ''
          if (res.data.list.length > 0) {
            if (res.data.list[0].version_id !== null && res.data.list[0].version_id !== '') {
              this.listQuery.version_id = res.data.list[0].version_id
            }
          }
          // 获取所选项目的最新版本需求的信息
          // console.log(Object.prototype.toString.call(this.listQuery.version_id))
          // console.log(res.data)
          if (this.listQuery.version_id !== '' || this.listQuery.project_id === '') {
            this.searchList()
          } else {
            this.tableData = []
            this.total = 0
          }
        })
      })
    },
    // 获取所有的项目
    getproject () {
      const row = {
        userId: localStorage.getItem('userId'),
        serNo: getUUID(),
        roleName: '管理人员'
      }
      // this.getListData()
      getProjectByUser(row).then(res => {
        this.projectOptions = res.data.list
        this.projectOptions.unshift({
          id: '',
          name: '全部'
        })
        this.itemallname = this.projectOptions
      })
    },
    getListData () {
      this.listLoading = true
      // this.tableData = []
      // this.total = 0
      // console.log(this.listQuery)
      getTaskListByParams(this.listQuery).then(response => {
        // console.log(response)
        this.tableData = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
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
        height: 110px;
        width: 100%;
        background-color: #fff;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        .item{
          margin-right: 20px;
          margin-top: 10px;
          span{
              margin-right: 10px;
              margin-top: 10px;
          }
        }
        .mouth{
          margin-right: 20px;
          margin-top: 10px;
          span{
              margin-right: 10px;
              margin-top: 10px;
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
    .tabls,.el-tabs{
        background-color: #fff;
        // padding-left: 30px;
    }
    .tabls .el-tabs__nav-wrap{
        padding-left: 20px;
    }
    // #tab-first{
    //     padding: 0;
    // }
    // #tab-second{
    //     padding: 0;
    //     margin-left: 15px;
    // }
</style>