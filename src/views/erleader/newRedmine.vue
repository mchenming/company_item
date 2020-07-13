<template>
    <div class="erstandard">
        <div class="saltitle">
            <h2>Redmine不规范</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="slidechoose">
          <el-row style="margin-bottom:15px;">
            <el-col :span="24">
              <span style="margin-right:60px;">项目</span>
              <el-select v-model="sendserverdata.projectid" placeholder="请选择项目" @change="selectdata" class="itemchange" style="width:1000px;" multiple>
                <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:700px;" v-model='searchText' @input="searchInfo" @focus='leaveinp' @blur="getss"></el-input>
                <!-- <div class="box" style="width:100%;height:60px;"></div>               -->
                <el-option
                  v-for="item in proinfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

            <span>时间范围</span>
            <el-date-picker
            v-model="changeTime"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['08:00:00', '08:00:00']"
            value-format="yyyy-MM-dd"
            style="margin-left:15px"
            :clearable="false"
            @change="selectdata">
          </el-date-picker>
            <span style="margin-left:20px;">分配给</span>
            <el-select v-model="valuename" placeholder="请选择" @change="selectdata" class="itemchange">
              <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:200px" v-model='searchText' @input="searchUser" @blur='leaveinpUser' @focus="getuser"></el-input>
              <el-option
                v-for="(item, index) in allnamearr"
                :key="index"
                :label="item.text"
                :value="item.id">
              </el-option>
            </el-select>
            <span>流程</span>
            <el-select v-model="trackerId" multiple filterable allow-create default-first-option placeholder="请选择流程"  style="width:200px;" @change="selectdata">
              <el-option
                v-for="item in trackerdict"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </div>
        <div class="redminebox" style="margin-top:15px;padding:0 15px;">
          <el-row class="redmineinfo">
            <el-col :span='12' style="border:1px solid #eee;margin-right:15px;">
                <p style="margin:0;padding:10px 0 0 15px;font-weight:700;font-size:15px">Redmine不规范--流程</p>              
                <div id="redminitem" style="width:100%;height:240px;"></div>
            </el-col>
            <el-col :span='12' style="border:1px solid #eee;">
                <p style="margin:0;padding:10px 0 0 15px;font-weight:700;font-size:15px">Redmine不规范--人员</p>
                <div id="leaderstand" style="width:100%;height:240px"></div>
            </el-col>
          </el-row>
        </div>
        <div class="itemtable">
             <el-table :data="tableData" style="width: 100%"
              v-loading="listLoading" element-loading-text="加载中。。。"
              @sort-change="productchangeOrder">
              <el-table-column prop="id" label="规范问题ID" width="120" sortable="custom"  align="center">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goRedmine(scope.row)">{{scope.row.id}}</el-button>                    
                  </template>
              </el-table-column>
              <el-table-column label="流程" width="100" sortable="custom" align="center">
                  <template slot-scope="scope">
                      <div>{{usetrackeridgetname(scope.row.trackerId)}}</div>
                  </template>
              </el-table-column>
              
              <el-table-column prop="projectId" label="项目" sortable="custom" align="center" width="150">
                  <template slot-scope="scope">
                    <div style="text-align:center">{{useproidgetname(scope.row.projectId)}}</div>
                  </template>
              </el-table-column>

              <el-table-column prop="subject" label="标题" sortable="custom" align="center">
                  <template slot-scope="scope">
                    <div style="text-align:left">{{scope.row.subject}}</div>
                  </template>
              </el-table-column>
              <el-table-column prop="reason" label="错误原因" sortable="custom" align="center" width="200">
                  <template slot-scope="scope">
                    <div style="text-align:left">{{scope.row.reason}}</div>                   
                  </template>
              </el-table-column>
              <el-table-column prop="statusId" label="状态" sortable="custom" align="center" width="120">
                  <template slot-scope="scope">
                    <!-- <el-tag v-if="scope.row[3]==='延期' || scope.row[3]==='拒绝修复'" type="danger">{{scope.row[3]}}</el-tag>                    
                    <el-tag v-else-if="scope.row[3]==='已关闭'" type="success">{{scope.row[3]}}</el-tag>                    
                    <el-tag v-else>{{scope.row[3]}}</el-tag>                     -->
                    {{usestatusidgetname(scope.row.statusId)}}
                    <!-- <el-tag>修复中(进行中)</el-tag> -->
                  </template>
              </el-table-column>
              <el-table-column prop="assignedToId" label="分配给" sortable="custom" align="center" width="100">
                  <template slot-scope="scope">
                    <div>{{usepersonidgetname(scope.row.assignedToId)}}</div>
                  </template>
              </el-table-column>
              <el-table-column prop="createdOn" label="创建日期" sortable="custom" align="center" width="170">
              </el-table-column>
            </el-table>
        </div>
        <div class="pagenumchoose">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="sendserverdata.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="sendserverdata.pageSize"
            :total="sendserverdata.total"
            layout="total, sizes, prev, pager, next"
            class="pagenum">
          </el-pagination>
        </div>
        <div class="close"> <el-button @click="$router.go(-1)">关闭</el-button></div>
    </div>
</template>

<script>
import echarts from 'echarts'
// import {getRoleByUser, getProjectOptions} from '@/api/xyzqPort/leaderReport'
import API from '@/api'
import {getuserdict, gettrackerdict, getlistByTime, getEchartsByTime} from '@/api/xyzqPort/erstantard'
import {getProjectByUser} from '@/api/xyzqPort/erneed'
import {getAllStatusData} from '@/api/newEhomeJS/eproblem'

export default {
  data () {
    return {
      listLoading: false,
      options: [],
      tableData: [],
      sendserverdata: {
        projectid: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        orderType: 'desc',
        orderKey: 'id'
      },
      proinfo: [],
      allOptions: [],
      searchText: '',
      itemallname: [],
      fornameall: [],
      valuename: '',
      allnamearr: [],
      trackerdict: [],
      trackerId: [],
      changeTime: []
    }
  },
  created () {
    this.changeTime[0] = this.$route.query.stime
    this.changeTime[1] = this.$route.query.etime
    this.getUserProject()  // 获取所有的项目
    this.getnameid()       // 获取所有的非陪给人名
    this.gettrackerdict()  // 获取所有的流程list
    this.getlistdata()     // 获取list信息
    this.getechartsdata()  // 获取echarts信息

    this.getAllstatus() // 获取所有的状态信息
  },
  mounted () {
  },
  methods: {
    getAllstatus () {
      const row = {
        tracker_id: ''
      }
      getAllStatusData(row).then(res => {
        console.log(res)
        this.allOptions = res.data.list
      })
    },
    exit () {
      const row = {
        activeName: this.$route.query.activeName,
        stime: this.changeTime[0],
        etime: this.changeTime[1],
        proid: this.sendserverdata.projectid
      }
      this.$router.push({path: '/newleaderReport', query: row})
    },
    goRedmine (row) {
      window.open('http://192.25.97.80/redmine/issues/' + row.id)
    },
    // 排序
    productchangeOrder (column, prop, order) {
      this.sendserverdata.orderkey = column.prop
      this.sendserverdata.orderType = ''
      if (column.order === 'ascending') {
        this.sendserverdata.orderType = 'asc'
      } else {
        this.sendserverdata.orderType = 'desc'
      }
      this.getlistdata()
    },
    getlistdata () {
      const obj = {
        page: this.sendserverdata.pageIndex,
        pageSize: this.sendserverdata.pageSize,
        project_ids: this.sendserverdata.projectid.join(','),
        orderType: this.sendserverdata.orderType,
        orderKey: this.sendserverdata.orderKey,
        start_date: this.changeTime[0],
        end_date: this.changeTime[1]
      }
      getlistByTime(obj).then(res => {
        // console.log(res)
        this.listLoading = false
        this.tableData = res.data.rows
        this.sendserverdata.total = res.data.total
      })
    },
    getechartsdata () {
      const sendata = {
        project_ids: this.sendserverdata.projectid.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1]
      }
      var obj = {}
      var rows = {}
      getEchartsByTime(sendata).then(res => {
        console.log(res)
        if (res.data.result === 'success') {
          obj.name = res.data.lcname
          obj.num = res.data.lcnum
          rows.name = res.data.autname
          rows.num = res.data.autnum
          this.echartsredminitem('redminitem', obj)
          this.echartsstandline('leaderstand', rows)
        }
      })
    },
    gettrackerdict () {
        // 获取的流程
      gettrackerdict().then(res => {
        this.trackerdict = res.data.rows
      })
    },
    // 用trackid找对应的name
    usetrackeridgetname (id) {
      var name = ''
      this.trackerdict.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.text
        }
      })
      return name
    },
    // 用projectid找对应的name
    useproidgetname (id) {
      var name = ''
      this.proinfo.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.name
        }
      })
      return name
    },
    usestatusidgetname (id) {
      var name = ''
      this.allOptions.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.text
        }
      })
      return name
    },
    usepersonidgetname (id) {
      var name = ''
      this.allnamearr.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.text
        }
      })
      return name
    },
    // 切换项目时间分配人员时调用
    selectdata () {
      for (let i = 0; i < this.sendserverdata.projectid.length; i++) {
        if (this.sendserverdata.projectid[i] === '') {
          this.sendserverdata.projectid = []
          // console.log(123)
        }
      }
      this.getlistdata()
      this.getechartsdata()
    },
    // 获取用户的所有权限项目
    getUserProject () {
      this.listLoading = true
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const user = {
            userId: data.user.userId,
            roleName: '管理人员'
          }
          getProjectByUser(user).then(res => {
            this.proinfo = res.data.list
            this.proinfo.unshift({
              id: '',
              name: '全部'
            })
            this.itemallname = this.proinfo
          })
        }
      })
    },
    // 搜索功能
    getss () {
      this.searchText = ''
    },
    leaveinp () {
      this.searchInfo()
      this.searchText = ''
      this.proinfo = this.itemallname
    },
    leaveinpUser () {
      this.searchText = ''
    },
    getuser () {
      this.searchUser()
      this.searchText = ''
      this.allnamearr = this.allnamearrAll
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      if (newVal.length > 0) {
        this.itemallname.forEach((item) => {
          if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
            allList.push(item)
          }
        })
        if (allList.length === 0) {
          this.proinfo = [{name: '暂无数据', id: '', disabled: true}]
        } else {
          this.proinfo = allList
        }
      } else {
        this.proinfo = this.itemallname
      }
    },
    searchUser () {
      var newVal = this.searchText
      var allList = []
      if (newVal.length > 0) {
        this.allnamearrAll.forEach((item) => {
          if (item.text.toLowerCase().includes(newVal.toLowerCase()) === true) {
            allList.push(item)
          }
        })
        if (allList.length === 0) {
          this.allnamearr = [{text: '暂无数据', id: '', disabled: true}]
        } else {
          this.allnamearr = allList
        }
      } else {
        this.allnamearr = this.allnamearrAll
      }
    },
    // 获取所有的人名
    getnameid () {
      getuserdict().then(res => {
        // console.log(res.data)
        this.allnamearr = res.data.data
        this.allnamearr.sort(function compareFunction (param1, param2) {
          var ord = 0
          // if (column.order === 'ascending') {
          ord = param1.text.localeCompare(param2.text, 'zh-Hans-CN', {sensitivity: 'accent'})
          // }
          return ord
        })
        this.allnamearr.unshift({
          id: '',
          text: '全部'
        })
        this.allnamearrAll = this.allnamearr
      })
    },
    sizeChangeHandle (val) {
      this.sendserverdata.pageSize = val
      this.getlistdata()
    },
    // 当前页
    currentChangeHandle (val) {
      this.sendserverdata.pageIndex = val
      this.getlistdata()
    },
    // redmine规范流程的echarts
    echartsredminitem (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '0%',
          top: '10%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              // rotate: 15,
              formatter: function (value) {
                // if (value.length > 8) {
                //   return value.split('/')[0] + '\n' + value.split('/')[1]
                // } else if (value.length > 6) {
                //   return value.substring(0, value.length / 2) + '\n' + value.substring(value.length / 2)
                // } else {
                //   return value
                // }
                if (value.length > 4) {
                  return value.substring(0, 4) + '\n' + '...'
                } else {
                  return value
                }
              }
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
                // width: 20
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 30,
            data: obj.num
          }
        ]
      }, true)
    },
    echartsstandline (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        grid: {
          left: '5%', // 组件离容器左侧的距离
          right: '4%',
          top: '10%',
          bottom: '1%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
            // minInterval: 1,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
                // width: 20
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            },
            // max: 25,
            // splitNumber: 5
            minInterval: 1
          }
        ],
        series: [
          {
            name: '次数',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            areaStyle: {
              normal: {color: '#4b78cd'} // 改变区域颜色
            },
            barMaxWidth: 25,
            data: obj.num
            // data: [23, 20, 18, 15, 12, 10, 9, 7, 5, 2]
          }
        ]
      }, true)
    },
     // 排序
    compare (property, desc) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        if (desc === true) {
            // 升序排列
          return value1 - value2
        } else {
            // 降序排列
          return value2 - value1
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
    .erstandard{
        width: 100%;
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
        .close{
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 50px;
          padding-bottom: 40px;
          .el-button{
            background-color: #4B78CD;
            border-radius: 5px;
            color: #fff;
            border: none;
          }
        }
        .slidechoose{
            padding: 0 20px;
            span{
                margin-right: 20px;
            }
        }
        .pagenumchoose{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
        background-color: #fff;
        }
        .itemchange{
          margin-right: 50px;
        }
        .redmineinfo{
          display: flex;
          justify-content: space-between;
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
