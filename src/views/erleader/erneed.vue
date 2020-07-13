<template>
    <div class="erneed">
        <div class="saltitle">
            <h2>需求</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="slidebox">
          <el-row style="margin-top: 10px;">
            <el-col :span="11">
              <div class="item">
                <span style="width: 30%;">请选择项目</span>
                <el-select v-model="listQuery.project_id" placeholder="请选择" @change='projectChange'  style="width: 70%;" popper-class="onmouthFix">
                <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                  <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:90%" v-model='searchText' @input="searchInfo" @focus='leaveinp' @blur="getss"></el-input>
                </div>
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
                <el-select v-model="listQuery.version_id" placeholder="请选择" @change='versionChange'  style="width: 70%;" popper-class="mouthFix">
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
            <div class="info" style="width:100%;height:70px;">
              <span  style="width: 30%;text-align: center;margin-right: 30px;margin-left: 20px;">状态</span>
                <el-select
                  v-model="statusIds"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择状态" 
                  style="width:77%;"
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
          </el-row> 
        </div>
        <div class="itemtable">
             <el-table :data="tableData" style="width: 100%" :default-sort="{}"
            @sort-change="changeOrder" v-loading="listLoading" element-loading-text="加载中。。。">
              <el-table-column prop="id" label="需求ID" width="100" align="center" sortable="custom">
                  <template slot-scope="scope">
                      <el-button type="text" @click="goRedmine(scope.row)">{{scope.row.id}}</el-button>
                  </template>
              </el-table-column>
              <el-table-column prop="priority_id" label="优先级" width="100" align="center" sortable="custom">
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
                    <div style="text-align:center">{{useridGetProname(scope.row.project_id)}}</div>
                  </template>
              </el-table-column>

              <el-table-column prop="subject" label="主题" align="center" sortable="custom">
                  <template slot-scope="scope">
                      <div style="text-align:left">{{scope.row.subject}}</div>
                  </template>
              </el-table-column>
              
              <el-table-column prop="status_id" label="状态" width="100" align="center" sortable="custom">
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

              <el-table-column prop="assignedname" label="指派给" width="100" align="center" sortable="custom">
                <template slot-scope="scope">
                  {{scope.row.assignedname}}
                </template>
              </el-table-column>
              <el-table-column prop="authorname" label="作者" width="100" align="center" sortable="custom">
                <template slot-scope="scope">
                  {{scope.row.authorname}}
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
              <el-table-column prop="avgdays" label="耗时（天）"  width="120" align="center" sortable="custom">
                <template slot-scope="scope">
                  <span>{{scope.row.avgdays}}</span>
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
import {getversiondict, getProjectByUser, getReqListByParams, getAllStatusData, getuserdict, getNewVersionByProject} from '@/api/xyzqPort/erneed'
import {systemlogStatis} from '@/api/modules/all'
// import API from '@/api'
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
        orderkey: 'avgdays',
        orderType: 'desc',
        avgdays: 0
      },
      statusIds: [],
      userOptions: [],
      itemallname: [],
      status: ''
    }
  },
  created () {
    this.status = Number(this.$route.query.status)
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '项目驾驶舱',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    if (typeof (this.$route.query.project_id) !== 'undefined' && this.$route.query.project_id !== '') {
      this.listQuery.project_id = this.$route.query.project_id
    }
    if (typeof (this.$route.query.avgdays) !== 'undefined' && this.$route.query.avgdays !== '') {
      this.listQuery.avgdays = this.$route.query.avgdays
    }
    this.statusIds = []
    this.getproject()
    this.getUserOptions()
    this.getStatusOptions()
  },
  methods: {
    getss () {
      this.searchText = ''
      // this.projectOptions = this.itemallname
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
      const row = {
        tracker_id: '2'
      }
      getAllStatusData(row).then(res => {
        this.statusIds = []
        this.statusOptions = res.data.list
        if (this.status === 0) {
          // var arr = []
          // for (let i = 0; i < res.data.list.length; i++) {
          //   const ele = res.data.list[i]
          //   arr.push(ele.id)
          // }
          this.statusIds = []
        } else if (typeof (this.$route.query.type) !== 'undefined' && this.$route.query.type === '1') {
          for (let i = 0; i < res.data.list.length; i++) {
            const ele = res.data.list[i]
            if (ele.text !== '已关闭') {
              this.statusIds.push(ele.id)
            }
          }
        }
        this.listQuery.status_id = this.statusIds.join(',')
        this.listQuery.orderkey = 'avgdays'
        this.listQuery.orderType = 'desc'
        this.getversion()
      })
    },
    sizeChangeHandle (val) {
      this.listQuery.pageSize = val
      this.getListData()
    },
    // // 当前页
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
      // console.log(column.prop)
      // console.log(this.listQuery.orderkey)
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
      this.searchInfo()
      this.searchText = ''
      this.projectOptions = this.itemallname
    },
    searchInfo () {
      var newVal = this.searchText
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
    projectChange () {
      this.projectOptions = this.itemallname
      this.statusIds = []
      this.listQuery.status_id = ''
      this.status = 1
      // this.getversion()
      this.getStatusOptions()
    },
    // 获取所有的版本id
    getversion () {
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
        getNewVersionByProject(this.listQuery).then(res => {
          this.listQuery.version_id = ''
          if (res.data.list.length > 0) {
            if (res.data.list[0].version_id !== null && res.data.list[0].version_id !== '') {
              this.listQuery.version_id = res.data.list[0].version_id
            }
          }
          // 获取所选项目的最新版本需求的信息
          this.searchList()
        })
      })
    },
    useridGetProname (id) {
      var proname = ''
      this.itemallname.forEach(item => {
        if (Number(item.id) === Number(id)) {
          proname = item.name
        }
      })
      return proname
    },
    // 获取所有的项目
    getproject () {
      const row = {
        userId: localStorage.getItem('userId'),
        serNo: getUUID(),
        roleName: '管理人员'
      }
      this.listQuery.userId = localStorage.getItem('userId')
      // this.getListData()
      getProjectByUser(row).then(res => {
        this.projectOptions = res.data.list
        this.projectOptions.unshift({
          id: '',
          name: '全部'
        })
        this.itemallname = this.projectOptions
      })
      // API.user.info().then(({data}) => {
      //   if (data && data.code === 0) {
      //   }
      // })
    },
    getListData () {
      this.listLoading = true
      getReqListByParams(this.listQuery).then(response => {
        this.tableData = response.data.list
        this.total = response.data.total
        this.listLoading = false
        // console.log(this.tableData)
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
        // height: 150px;
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
    .el-select__tags{
      .el-select__input{
        height: 0px;
      }
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