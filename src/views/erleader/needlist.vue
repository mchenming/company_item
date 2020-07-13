<template>
    <div class="erneed">
        <div class="saltitle">
            <h2 v-if="this.demandinfo==='oa'">业务需求列表</h2>
            <h2 v-else-if="this.demandinfo==='2'">需求列表</h2>
            <h2 v-else>全部需求列表</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="slidebox">
          <el-row style="margin-top: 10px;">
            <el-col :span="12">
              <div class="item">
                <span style="margin-left:20px;margin-right:30px;">项目</span>
                <el-select v-model="listQuery.project_id" placeholder="全部" @change='projectChange'  style="width: 80%;" multiple>
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
            <el-col :span="8">
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
                  @change="timeChange"
                  style="margin-left:15px"
                  :clearable="false">
                </el-date-picker>
            </div>
            </el-col>
            <el-col :span="4">
              <div class="mouth">
                <span  style="width: 30%;">需求来源</span>
                <el-select v-model="demandinfo" placeholder="请选择" @change='projectChange'  style="width: 60%;">
                  <el-option
                    v-for="item in demand"
                    :key="item.id"
                    :label="item.text"
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
                  @change="statusIdChange">
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
                <el-col :span="3" class="titinfo" style="margin-left:100px;" v-loading='isloading'>
                    <p>业务需求</p>
                    <h2>{{reqtotal.oanum}}</h2>
                    <span>占比{{reqtotal.oaMix}}%</span>
                </el-col>
                <el-col :span="3" class="titinfo" v-loading='isloading'>
                    
                    <p>内部需求</p>
                    <h2>{{reqtotal.nbnum}}</h2>
                    <span>占比{{reqtotal.nbMix}}%</span>
                </el-col>
                <el-col :span="3" class="titinfo" v-loading='isloading'>
                    
                    <p>延期需求</p>
                    <h2>{{reqtotal.yqcont}}</h2>
                    <!-- <span>占比80%</span> -->
                </el-col>
                <el-col :span="3" class="titinfo" v-loading='isloading'>
                    
                    <p>需求平均完成事件</p>
                    <h2>{{reqtotal.aveDays}}天</h2>
                    <!-- <span>占比80%</span> -->
                </el-col>
            </el-row>
        </div>
        <el-row>
          <el-col :span="24">
            <div class="selectdownbox">
              <el-select v-model="value" placeholder="请选择" size="mini" style="width:6%;" @change="versionChange">
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
          <!-- <el-collapse value="aboutarr"> -->
            <div v-if="this.demandinfo!=='oa'" v-loading='tabload'>
            <div v-for="(item, index) in tableList" :key="index" style="width:100%;height:100px;border:1px solid #eee">
              <!-- <template slot="title"> -->
                <div style="margin-top:25px;">
                <span style="color:#409EFF;border:1px solid #b3d8ff;background-color:#ecf5ff;padding:3px 10px;border-radius:5px;display:inline-block;width:100px;text-align:center">{{usestatusgetinfo(item.status_id)}}</span>
                <span style="color:#409EFF;display:inline-block;width:70%;margin-left:20px;">{{item.need_name}}</span>
                <span style="display:inline-block;width:15%;text-align:center">{{useidgetproject(Number(item.project_id))}}</span>
                </div>
                <div style="margin-top:25px;" class="bboxsty">
                  <span style="margin-left:115px;">需求发起日期:&nbsp;&nbsp;{{item.created_on.split(' ')[0]}}</span>
                  <span style="margin-left:50px;">预计上线日期:&nbsp;&nbsp;{{item.version_plan_date}}</span>
                  <span style="margin-left:50px;">实际上线日期:&nbsp;&nbsp;{{item.real_date}}</span>
                  <el-tooltip class="item" effect="light" content="需求在OA评审通过后至上线所消耗的时间" placement="top" style="display:inline-block;width:10%;margin-left:50px;">
                    <!-- <el-button>上边</el-button> -->
                    <span>累计耗时:&nbsp;&nbsp;&nbsp;&nbsp;{{item.days_num}}天</span>
                  </el-tooltip>
                  
                  <span style="margin-left:30px;">指派给:&nbsp;&nbsp;&nbsp;&nbsp;{{getusername(Number(item.assigned_to_id))}}</span>
                  <span style="margin-left:40px;">优先级:&nbsp;&nbsp;
                    <span v-if="item.priority_id === '3'" style="color: #67c23a;text-align: center;">高</span>
                    <span v-else-if="item.priority_id === '4'" style="color: #e6a23c;text-align: center;">紧急</span>
                    <span v-else-if="item.priority_id === '5'" style="color: #f56c6c;text-align: center;">立刻</span>
                    <span v-else-if="item.priority_id === '2'" style="color: #409eff;text-align: center;">普通</span>
                    <span v-else style="color: #409eff;text-align: center;">低</span>
                  </span>
                  <span style="margin-left:40px;">ITSM单号:&nbsp;&nbsp;{{item.chg_no}}</span>
                </div>
              <!-- </template> -->
            </div>
            </div>


            <el-collapse value="aboutarr" v-if="this.demandinfo==='oa'">
              <el-collapse-item v-for="(item, index) in tableList" :key="index" :name='index' v-loading='isloading' :disabled='true'>
                <template slot="title">
                  <div>
                  <span style="color:#409EFF;border:1px solid #b3d8ff;background-color:#ecf5ff;padding:3px 10px;border-radius:5px;" v-if="item.redmine[0].status_id">{{usestatusgetinfo(item.redmine[0].status_id)}}</span>
                  <span style="color:#409EFF;border:1px solid #b3d8ff;background-color:#ecf5ff;padding:3px 10px;border-radius:5px;" v-else>{{usestatusgetinfo(item.status_id)}}</span>
                  <span style="color:#409EFF;display:inline-block;width:70%;margin-left:20px;">{{item.need_name}}</span>
                  <span style="display:inline-block;width:15%;text-align:center">{{useidgetproject(item.project_id)}}</span>
                  <a href="javascript:;">详情</a>
                  </div>
                  <div class="needbox">
                    <span style="margin-left:115px;">发起人:&nbsp;&nbsp;&nbsp;&nbsp;{{item.handle_author}}</span>
                    <span style="margin-left:50px;">预沟通人:&nbsp;&nbsp;&nbsp;&nbsp;{{item.it_branch_liaison}}</span>
                    <span style="margin-left:50px;">受理部门:&nbsp;&nbsp;&nbsp;&nbsp;{{item.it_branch_liaison}}</span>
                    <span style="margin-left:50px;">优先级:&nbsp;&nbsp;&nbsp;&nbsp;
                      <span v-if="item.priority_id === '3'" style="color: #67c23a;text-align: center;">高</span>
                      <span v-else-if="item.priority_id === '4'" style="color: #e6a23c;text-align: center;">紧急</span>
                      <span v-else-if="item.priority_id === '5'" style="color: #f56c6c;text-align: center;">立刻</span>
                      <span v-else-if="item.priority_id === '2'" style="color: #409eff;text-align: center;">普通</span>
                      <span v-else style="color: #409eff;text-align: center;">低</span>
                    </span>
                    <span style="margin-left:50px;">需求发起日期:&nbsp;&nbsp;{{item.created_on}}</span>
                    <span style="margin-left:50px;">预计上线日期:&nbsp;&nbsp;{{item.plan_date}}</span>
                    <el-tooltip class="item" effect="light" content="需求在OA评审通过后至上线所消耗的时间" placement="top" style="margin-left:50px;">
                      <!-- <el-button>上边</el-button> -->
                      <span>累计耗时:&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red">{{item.days_num}}天</span></span>
                    </el-tooltip>
                  </div>
                </template>

                <el-table :data="item.redmine" style="width: 60%" class="about">
                  <el-table-column label="项目" width="180" align="center">
                    <template slot-scope="scope">
                      <div>{{useidgetproject(item.project_id)}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="Redmine主题" align="center">
                  </el-table-column>
                  <el-table-column label="最新状态" width="180" align="center">
                    <template slot-scope="scope">
                      <div>{{usestatusgetinfo(scope.row.status_id)}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="chg_no" label="ITSM单号" align="center" width="180">
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          <!-- </el-collapse> -->
        </div>
        <div class="pagenumchoose">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="listQuery.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="listQuery.pageSize"
            :total="total"
            layout="total,sizes, prev, pager, next"
            class="pagenum">
          </el-pagination>
        </div>
    </div>
</template>

<script>
import {getProjectByUser, getuserdict} from '@/api/xyzqPort/erneed'
import {getAllReqList, listByMap, getReqTotal, liststatus} from '@/api/xyzqPort/yewuneed'
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
      searchText: '',
      versionOptions: [],
      projectOptions: [],
      valueitem: '',
      valueversion: '',
      valueinfo: '',
      userId: '',
      listQuery: {
        userId: '',
        project_id: [],
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
        value: 'priority_id',
        label: '优先级'
      }, {
        value: 'assigned_to_id',
        label: '发起人'
      }, {
        value: 'project_id',
        label: '项目'
      }, {
        value: 'chg_no',
        label: 'ITSM单号'
      }, {
        value: 'days_num',
        label: '累计耗时天数'
      }, {
        value: 'created_on',
        label: '需求发起日期'
      }, {
        value: 'real_date',
        label: '预计上线日期'
      }, {
        value: 'real_date',
        label: '实际上线日期'
      }],
      value: 'days_num',
      demand: [{text: '全部', id: ''}, {text: 'OA', id: 'oa'}, {text: '内部', id: '2'}],
      demandinfo: '',
      order: false,
      aboutarr: [],
      changeTime: [], // 选中事件
      tableList: [],  // table数据
      allstatus: [],  // 所有的状态
      reqtotal: {},  // 顶部需求参数
      isloading: true,
      tabload: true,
      statusinfo: []
    }
  },
  created () {
    // this.status = Number(this.$route.query.status)
    this.changeTime[0] = this.$route.query.stime
    this.changeTime[1] = this.$route.query.etime
    this.demandinfo = this.$route.query.type
  },
  mounted () {
    if (typeof (this.$route.query.project_id) !== 'undefined' && this.$route.query.project_id !== '') {
      this.listQuery.project_id = this.$route.query.project_id.split(',')
    }
    // console.log(this.$route.query)
    this.statusIds = []
    // 获取权限项目
    this.getproject()
    // 获取所有的用户名称
    this.getUserOptions()
    // 获取表格数据
    this.getalldata()
    this.getallreqtotal()

    this.getstautsinfo()
  },
  methods: {
    // 升序降序排列
    changeorder () {
      this.order = !this.order
      this.tabload = true
      if (this.order === true) {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.getalldata()
    },
    getss () {
      this.searchText = ''
    },
    getUserOptions () {
      const row = {
        project_id: ''
      }
      getuserdict(row).then(res => {
        this.userOptions = res.data.data
        // console.log(this.userOptions) // 对应的人员id 和对应的人员text名字
      })
    },
    // 根据用户id获取用户的名称
    getusername (id) {
      var username = ''
      this.userOptions.forEach(item => {
        if (item.id === id) {
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
    getstautsinfo () {
      liststatus().then(res => {
        // console.log(res)
        this.statusinfo = res.data.rows
      })
    },
    usestatusgetinfo (id) {
      var info = ''
      this.statusinfo.forEach(item => {
        if (Number(item.id) === Number(id)) {
          info = item.needsStatus
        }
      })
      return info
    },
    // 切换当前页显示的条数
    sizeChangeHandle (val) {
      this.tabload = true
      this.listQuery.pageSize = val
      this.getalldata()
    },
    // // 切换当前页码
    currentChangeHandle (val) {
      this.tabload = true
      this.listQuery.pageIndex = val
      this.getalldata()
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
    //   this.getalldata()
    // },
    searchList () {
      this.tabload = true
      this.listQuery.pageIndex = 1
      this.getalldata()
      this.getallreqtotal()
    },
    versionChange () {
      this.tabload = true
      this.listQuery.pageIndex = 1
      this.getalldata()
    },
    exit () {
      const row = {
        activeName: this.$route.query.activeName,
        stime: this.changeTime[0],
        etime: this.changeTime[1],
        proid: this.listQuery.project_id
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
    timeChange () {
      this.isloading = true
      this.tabload = true
      this.getallreqtotal()
      this.getalldata()
    },
    projectChange () {
      for (let i = 0; i < this.listQuery.project_id.length; i++) {
        if (this.listQuery.project_id[i] === '') {
          this.listQuery.project_id = []
          // console.log(123)
        }
      }
      // console.log(this.listQuery.project_id)
      this.isloading = true
      this.tabload = true
      this.statusIds = []
      // this.projectOptions = this.itemallname
      // this.statusIds = []
      // this.listQuery.status_id = ''
      this.getallreqtotal()
      this.getalldata()
    },
    // 获取所有的版本id
    // getversion () {
    //   var obj = {
    //     project_id: this.listQuery.project_id
    //   }
    //   getversiondict(obj).then(res => {
    //     // console.log(res.data)
    //     this.versionOptions = res.data
    //     this.versionOptions.unshift({
    //       id: '',
    //       text: '全部'
    //     })
    //     getNewVersionByProject(this.listQuery).then(res => {
    //       this.listQuery.version_id = ''
    //       if (res.data.list.length > 0) {
    //         if (res.data.list[0].version_id !== null && res.data.list[0].version_id !== '') {
    //           this.listQuery.version_id = Number(res.data.list[0].version_id)
    //         }
    //       }
    //       // 获取所选项目的最新版本需求的信息
    //       this.searchList()
    //     })
    //   })
    // },
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
      this.getallstatus()
    },
    // 获取所有的状态
    getallstatus () {
      listByMap().then(res => {
        this.allstatus = res.data.rows
      })
    },
    // 获取所有需求参数的接口
    getallreqtotal () {
      this.listQuery.status_id = this.statusIds.join(',')
      var rows = {
        status_ids: this.listQuery.status_id,
        project_ids: this.listQuery.project_id.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1]
      }
      this.reqtotal = {}
      getReqTotal(rows).then(res => {
        // console.log(res)
        this.isloading = false
        if (res.data.result === 'success') {
          this.reqtotal = res.data
        }
      })
    },
    // 选中状态查询
    statusIdChange () {
      this.listQuery.status_id = this.statusIds.join(',')
      this.searchList()
    },
    // 获取所有的表格数据
    getalldata () {
      var row = {
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        project_ids: this.listQuery.project_id.join(','),
        token: this.$cookie.get('token'),
        page: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        tracker_id: this.demandinfo,
        orderType: this.listQuery.orderType,
        status_ids: this.statusIds.join(','),
        TrackerId: this.demandinfo,
        orderFiled: this.value
      }
      // console.log(row)
      getAllReqList(row).then(res => {
        this.tabload = false
        console.log(res.data.rows)
        console.log(res.data.total)
        this.tableList = res.data.rows
        this.total = res.data.total
      })
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
    span{
      font-size: 13px !important;
    }
     @media screen and (max-width: 1280px) {
         .bboxsty{
           span{
             margin-left: 20px !important;
           }
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
      margin-right:-1px !important;
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