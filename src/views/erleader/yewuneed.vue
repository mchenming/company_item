<template>
    <div class="erneed">
        <div class="saltitle">
            <h2>业务需求列表</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="slidebox">
          <el-row style="margin-top: 10px;">
            <el-col :span="11">
              <div class="item">
                <span style="width: 30%;">请选择项目</span>
                <el-select v-model="listQuery.project_id" placeholder="请选择" @change='projectChange'  style="width: 70%;">
                <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:90%" v-model='searchText' @input="searchInfo" @focus='leaveinp' @blur="getss"></el-input>
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
                <span  style="width: 30%;">时间</span>
                <!-- <el-select v-model="listQuery.version_id" placeholder="请选择" @change='versionChange'  style="width: 70%;">
                  <el-option
                    v-for="item in versionOptions"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                  </el-option>
                </el-select> -->
                <el-date-picker
                  v-model="changeTime"
                  type="daterange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['08:00:00', '08:00:00']"
                  value-format="yyyy-MM-dd"
                  style="margin-left:15px"
                  @change="projectChange"
                  :clearable="false">
                </el-date-picker>
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
                  @change="projectChange">
                  <el-option
                    v-for="item in allstatus"
                    :key="item.needsStatus"
                    :label="item.needsStatus"
                    :value="item.needsStatus">
                  </el-option>
                </el-select>
            </div>
          </el-row> 
        </div>
        <div class="itemtable">
            <el-row>
                <el-col :span="3" class="titinfo" style="margin-left:100px;">
                    <p>业务需求</p>
                    <h2>8</h2>
                    <span>占比80%</span>
                </el-col>
                <el-col :span="3" class="titinfo">
                    
                    <p>内部需求</p>
                    <h2>2</h2>
                    <span>占比20%</span>
                </el-col>
                <el-col :span="3" class="titinfo">
                    
                    <p>延期需求</p>
                    <h2>0</h2>
                    <!-- <span>占比80%</span> -->
                </el-col>
                <el-col :span="3" class="titinfo">
                    
                    <p>需求平均完成事件</p>
                    <h2>38天</h2>
                    <!-- <span>占比80%</span> -->
                </el-col>
            </el-row>
        </div>
        <el-row>
          <el-col :span="24">
            <div class="selectdownbox">
              <el-select v-model="value" placeholder="请选择" size="mini" style="width:6%;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button size="mini" class="orderby" @click="changeorder" v-if="order===true">
                <div class="fa fa-sort-asc ordlog"></div>
                升序
              </el-button>
              <el-button size="mini" class="orderby" @click="changeorder" v-else>
                <span class="fa fa-sort-desc"></span>
                降序
              </el-button>
            </div>
          </el-col>
        </el-row>
        <div class="info" style="padding:0 15px;margin-top:20px;">
          <el-collapse value="aboutarr">
            <el-collapse-item v-for="(item, index) in allList" :key="index" :name='index' v-loading='isloading' :disabled='true'>
              <template slot="title">
                <div>
                <span style="color:#409EFF;border:1px solid #b3d8ff;background-color:#ecf5ff;padding:3px 10px;border-radius:5px;">{{item.status_id}}</span>
                <span style="color:#409EFF;display:inline-block;width:70%;margin-left:20px;">{{item.need_name}}</span>
                <span style="display:inline-block;width:15%;text-align:center">{{useidgetproject(item.project_id)}}</span>
                <a href="javascript:;">详情</a>
                </div>
                <div class="needbox">
                  <span style="margin-left:115px;">发起人:&nbsp;&nbsp;&nbsp;&nbsp;{{getusername(item.assigned_to_id)}}</span>
                  <span style="margin-left:50px;">预沟通人:&nbsp;&nbsp;&nbsp;&nbsp;张雪</span>
                  <span style="margin-left:50px;">受理部门:&nbsp;&nbsp;&nbsp;&nbsp;需求研发处</span>
                  <span style="margin-left:50px;">优先级:&nbsp;&nbsp;&nbsp;&nbsp;
                    <span v-if="item.priority_id === '3'" style="color: #67c23a;text-align: center;">高</span>
                    <span v-else-if="item.priority_id === '4'" style="color: #e6a23c;text-align: center;">紧急</span>
                    <span v-else-if="item.priority_id === '5'" style="color: #f56c6c;text-align: center;">立刻</span>
                    <span v-else-if="item.priority_id === '2'" style="color: #409eff;text-align: center;">普通</span>
                    <span v-else style="color: #409eff;text-align: center;">低</span>
                  </span>
                  <span style="margin-left:50px;">需求发起日期:&nbsp;&nbsp;{{item.created_on}}</span>
                  <span style="margin-left:50px;">预计上线日期:&nbsp;&nbsp;{{item.version_plan_date}}</span>
                  <el-tooltip class="item" effect="light" content="Top Center 提示文字" placement="top" style="margin-left:50px;">
                    <!-- <el-button>上边</el-button> -->
                    <span>累计耗时:&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red">{{item.days_num}}天</span></span>
                  </el-tooltip>
                </div>
              </template>
              
              <el-table :data="tableData" style="width: 60%" class="about">
                <el-table-column prop="date" label="项目" width="180" align="center">
                </el-table-column>
                <el-table-column prop="name" label="Redmine主题" align="center">
                </el-table-column>
                <el-table-column prop="name" label="最新状态" width="180" align="center">
                </el-table-column>
                <el-table-column prop="address" label="ITSM单号" align="center" width="180">
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="pagenumchoose">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="listQuery.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="listQuery.pageSize"
            :total="total"
            layout="total, sizes,prev, pager, next"
            class="pagenum">
          </el-pagination>
        </div>
    </div>
</template>

<script>
import {getversiondict, getProjectByUser, getReqListByParams, getAllStatusData, getuserdict, getNewVersionByProject} from '@/api/xyzqPort/erneed'
import {getAllReqList, listByMap} from '@/api/xyzqPort/yewuneed'
// import API from '@/api'
import { getUUID } from '@/utils'
export default {
  data () {
    return {
      listLoading: false,
      total: 0,
      tableData: [],
      statusOptions: [],
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
        orderType: 'desc'
      },
      statusIds: [],
      userOptions: [],
      itemallname: [],
      status: '',
      options: [{
        value: 'status_id',
        label: '状态'
      }, {
        value: 'real_date',
        label: '预计上线日期'
      }, {
        value: 'created_on',
        label: '需求发起日期'
      }, {
        value: 'priority_id',
        label: '优先级'
      }, {
        value: 'assigned_to_id',
        label: '发起人'
      }, {
        value: 'project_id',
        label: '项目'
      }],
      value: '',
      order: true,
      aboutarr: [],
      changeTime: [], // 默认时间
      allList: [],  // 盒子参数
      allstatus: [], // 所有状态
      isloading: true
    }
  },
  created () {
    this.status = Number(this.$route.query.status)
    this.changeTime[0] = this.$route.query.stime
    this.changeTime[1] = this.$route.query.etime
  },
  mounted () {
    if (typeof (this.$route.query.project_id) !== 'undefined' && this.$route.query.project_id !== '') {
      this.listQuery.project_id = this.$route.query.project_id
    }
    this.statusIds = []
    this.getproject()
    // this.getStatusOptions()

    this.getUserOptions()
    // 获取页面数据
    this.getdataList()
    // 获取所有的状态码
    this.getstatusdata()
  },
  methods: {
    changeorder () {
      this.order = !this.order
      if (this.order === true) {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
    },
    getss () {
      this.searchText = ''
      // this.projectOptions = this.itemallname
    },
    getUserOptions () {
      const row = {
        project_id: ''
      }
      getuserdict(row).then(res => {
        // console.log(res.data)
        this.userOptions = res.data.data
      })
    },
    // getStatusOptions () {
    //   const row = {
    //     tracker_id: '2'
    //   }
    //   getAllStatusData(row).then(res => {
    //     this.statusIds = []
    //     this.statusOptions = res.data.list
    //     if (this.status === 0) {
    //       // var arr = []
    //       // for (let i = 0; i < res.data.list.length; i++) {
    //       //   const ele = res.data.list[i]
    //       //   arr.push(ele.id)
    //       // }
    //       this.statusIds = []
    //     } else if (typeof (this.$route.query.type) !== 'undefined' && this.$route.query.type === '1') {
    //       for (let i = 0; i < res.data.list.length; i++) {
    //         const ele = res.data.list[i]
    //         if (ele.text !== '已关闭') {
    //           this.statusIds.push(ele.id)
    //         }
    //       }
    //     }
    //     this.listQuery.status_id = this.statusIds.join(',')
    //     this.listQuery.orderkey = 'id'
    //     this.listQuery.orderType = 'desc'
    //     this.getversion()
    //   })
    // },
    sizeChangeHandle (val) {
      this.listQuery.pageSize = val
      this.getdataList()
    },
    // // 当前页
    currentChangeHandle (val) {
      this.listQuery.pageIndex = val
      this.getdataList()
    },
    // 根据用户id获取用户的名称
    getusername (id) {
      var username = ''
      this.userOptions.forEach(item => {
        if (Number(item.id) === Number(id)) {
          username = item.text
        }
      })
      return username
    },
    // 根据id找名字
    useidgetproject (id) {
      var projectname = ''
      this.itemallname.forEach(item => {
        if (Number(item.id) === Number(id)) {
          projectname = item.name
        }
      })
      return projectname
    },
    useidgetstatus (id) {
      var status = ''
      this.allstatus.forEach(item => {
        if (Number(item.id) === Number(id)) {
          status = item.needsStatus
        }
      })
      return status
    },
    getstatusdata () {
      listByMap().then(res => {
        console.log(res)
        this.allstatus = res.data.rows
      })
    },
    // 排序
    // changeOrder (column, prop, order) {
    //   this.listQuery.orderkey = column.prop
    //   this.listQuery.orderType = ''
    //   if (column.order === 'ascending') {
    //     this.listQuery.orderType = 'asc'
    //   } else {
    //     this.listQuery.orderType = 'desc'
    //   }
    //   this.getdataList()
    // },
    getdataList () {
      var obj = {
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        project_ids: this.listQuery.project_id,
        token: this.$cookie.get('token'),
        page: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        orderType: this.listQuery.orderkey,
        tracker_id: 'oa',
        needsStatus: this.statusIds.join(',')
      }
      getAllReqList(obj).then(res => {
        console.log(res)
        this.isloading = false
        this.allList = res.data.rows
        this.total = res.data.total
      })
    },
    searchList () {
      this.listQuery.pageIndex = 1
      this.getdataList()
    },
    versionChange () {
      this.statusIds = []
      this.listQuery.status_id = this.statusIds.join(',')
      this.searchList()
    },
    exit () {
      const row = {
        activeName: this.$route.query.activeName
      }
      this.$router.push({path: '/newleaderReport', query: row})
    },
    leaveinp () {
      this.searchInfo()
      this.searchText = ''
      this.projectOptions = this.itemallname
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
    //   console.log(newVal)
      if (newVal.length > 0) {
        setTimeout(() => {
          this.itemallname.forEach((item) => {
            if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
            //   console.log(123)
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
      this.getdataList()
    },
    // 获取所有的版本id
    getversion () {
      var obj = {
        projectId: this.listQuery.project_id
      }
      getversiondict(obj).then(res => {
        // console.log(res.data)
        this.versionOptions = res.data
        this.versionOptions.unshift({
          id: '',
          text: '全部'
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
    // 获取所有的项目
    getproject () {
      const row = {
        userId: localStorage.getItem('userId'),
        serNo: getUUID(),
        roleName: '管理人员'
      }
      this.listQuery.userId = localStorage.getItem('userId')
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
    statusIdChange () {
      this.listQuery.status_id = this.statusIds.join(',')
      this.searchList()
    }
  }
}
</script>

<style lang="scss" scoped>
    .erneed{
      background-color: #fff;
      // margin-top: 44px;
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
        height: 150px;
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
      .titinfo{
          height: 80px;
          background-color: #4b78cd;
          border-radius: 8px;
          color: #fff;
          margin-right: 50px;
          +:nth-of-type(2){
            background-color: rgba(103, 194, 58, 1);
          }
          +:nth-of-type(3){
            background-color: rgba(245, 108, 108, 1);
          }
          +:nth-of-type(4){
            background-color: rgba(255, 153, 0, 1);
          }
        p{
          margin: 0;
          padding: 10px 0 0 10px;
        }
        h2{
          margin: 0;
          padding: 0;
          text-align: center;
          font-size: 30px;
          font-weight: normal;
        }
        span{
          display: block;
          padding: 0 10px 10px 0;
          text-align: right;
        }
      }
      .orderby:hover,
      .orderby:active{
        background-color: #fff;
        border-color: rgb(220, 223, 230);
        color: rgb(90, 88, 88);
      }
      .orderby{
        margin-left: 10px;
      }
      .selectdownbox{
        display: flex;
        justify-content: flex-end;
        padding: 0 30px 0 0;
      }
    }
    @media screen and (max-width: 1280px) {
         .needbox{
           span{
             margin-left: 37px !important;
           }
         }
      }
      span{
        font-size: 12px !important;
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
    .el-button:focus{
      background-color: #fff;
      border-color: rgb(220, 223, 230);
      color: #000;
    }
    .el-collapse-item__header{
      height: 100px;
    }
</style>