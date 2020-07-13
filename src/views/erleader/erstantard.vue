<template>
    <div class="erstandard">
        <div class="saltitle">
            <h2>Redmine不规范</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="slidechoose">
            <span>项目</span>
            <el-select v-model="peojectid" placeholder="请选择项目" @change="selectdata" class="itemchange" style="position:relative"  popper-class="onmouthFix">
            <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
              <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:200px;" v-model='searchText' @input="searchInfo" @focus='leaveinp' @blur="getss"></el-input>          
            </div>
              <el-option
                v-for="item in proinfo"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span>分配给</span>
            <el-select v-model="valuename" placeholder="请选择" @change="selectdata" class="itemchange"  popper-class="onmouthFix">
            <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
              <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:200px" v-model='searchText' @input="searchUser" @blur='leaveinpUser' @focus="getuser"></el-input>
            </div>
              <el-option
                v-for="(item, index) in allnamearr"
                :key="index"
                :label="item.text"
                :value="Number(item.id)">
              </el-option>
            </el-select>
            <span>流程</span>
            <el-select v-model="trackerId" multiple filterable allow-create default-first-option placeholder="请选择流程"  style="width:500px;" @change="selectdata"  popper-class="mouthFix">
              <el-option
                v-for="item in trackerdict"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </div>
        <!-- <div class="redminebox" style="margin-top:15px;padding:0 15px;">
          <el-row class="redmineinfo">
            <el-col :span='12' style="border:1px solid #eee;margin-right:15px;">
                <p style="margin:0;padding:10px 0 0 15px;font-weight:700;font-size:15px">Redmine规范--流程</p>              
                <div id="redminitem" style="width:100%;height:240px;"></div>
            </el-col>
            <el-col :span='12' style="border:1px solid #eee;">
                <p style="margin:0;padding:10px 0 0 15px;font-weight:700;font-size:15px">Redmine规范--人员</p>
                <div id="leaderstand" style="width:100%;height:240px"></div>
            </el-col>
          </el-row>
        </div> -->
        <!-- .slice((pageIndex-1)*pageSize,pageIndex*pageSize) -->
        <div class="itemtable">
             <el-table :data="tableData" style="width: 100%"
             :default-sort="{}" v-loading="listLoading" element-loading-text="加载中。。。"
            @sort-change="productchangeOrder">
              <el-table-column prop="id" label="不规范问题ID" width="130" sortable="custom"  align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.id}}</div>
                  </template>
              </el-table-column>
              <el-table-column label="流程" width="100" sortable="custom" align="center" prop="tracker_id">
                  <template slot-scope="scope">
                    <!-- <el-tag v-if="scope.row[2]==='缺陷'" type="danger">{{scope.row[2]}}</el-tag>
                    <el-tag v-else-if="scope.row[2]==='生产反馈'" type="success">{{scope.row[2]}}</el-tag>
                    <el-tag v-else>{{scope.row[2]}}</el-tag> -->
                    <!-- {{scope.row}} -->
                    {{useidgetLiucheng(scope.row.trackerId)}}
                  </template>
              </el-table-column>
              
              <el-table-column prop="project_id" label="项目" sortable="custom" align="center" width="150">
                  <template slot-scope="scope">
                    <div style="text-align:center">{{useidGetproname(scope.row.projectId)}}</div>
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
              <el-table-column prop="status_id" label="状态" sortable="custom" align="center" width="120">
                  <template slot-scope="scope">
                    <!-- <el-tag v-if="scope.row[3]==='延期' || scope.row[3]==='拒绝修复'" type="danger">{{scope.row[3]}}</el-tag>                    
                    <el-tag v-else-if="scope.row[3]==='已关闭'" type="success">{{scope.row[3]}}</el-tag>                    
                    <el-tag v-else>{{scope.row[3]}}</el-tag>                     -->
                    {{useidgetStatus(scope.row.statusId)}}
                    <!-- <el-tag>修复中(进行中)</el-tag> -->
                  </template>
              </el-table-column>
              <el-table-column prop="assigned_to_id" label="分配给" sortable="custom" align="center" width="100">
                  <template slot-scope="scope">
                    {{useidGetname(scope.row.assignedToId)}}
                  </template>
              </el-table-column>
              <el-table-column prop="created_on" label="创建日期" sortable="custom" align="center" width="150">
                <template slot-scope="scope">
                  
                  <div v-if="scope.row.createdOn">{{scope.row.createdOn.split(' ')[0]}}</div>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <div class="pagenumchoose">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
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
import {getchecklist, getuserdict, gettrackerdict} from '@/api/xyzqPort/erstantard'
import {getProjectByUser} from '@/api/xyzqPort/erneed'
import {listByMap} from '@/api/xyzqPort/yewuneed'  // 获取所有的状态码
import {getAllStatusData} from '@/api/newEhomeJS/eproblem'
import {systemlogStatis} from '@/api/modules/all'
export default {
  data () {
    return {
      listLoading: false,
      options: [],
      tableData: [],
      peojectid: '',
      proinfo: [],
      pageIndex: 1,
      pageSize: 10,
      orderType: 'desc',
      orderFiled: '',
      allOptions: [],
      searchText: '',
      itemallname: [],
      fornameall: [],
      valuename: '',
      allnamearr: [],
      trackerdict: [],
      trackerId: [],
      projectIds: '',
      total: 0,
      allstatus: []
    }
  },
  created () {
    // debugger
    this.getallstatus()
    if (localStorage.getItem('name') !== null) {
      this.valuename = Number(localStorage.getItem('name'))
    } else {
      this.valuename = ''
    }
    if (localStorage.getItem('itemname') !== null) {
      this.peojectid = localStorage.getItem('itemname')
    } else {
      this.peojectid = ''
    }
    if (localStorage.getItem('trackerId') !== null) {
      // this.trackerId = localStorage.getItem('trackerId')
      this.trackerId.push(Number(localStorage.getItem('trackerId')))
    }
    // // var trackername = localStorage.getItem('trackerId')
    this.fornameall = JSON.parse(localStorage.getItem('namearr'))
    this.getnameid()
    this.gettrackerdict()
    this.getAllstatus() // 获取所有的状态数据
  },
  mounted () {
    this.getUserProject()
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
    getAllstatus () {
      const row = {
        tracker_id: ''
      }
      getAllStatusData(row).then(res => {
        // console.log(res)
        this.allOptions = res.data.list
      })
    },
    getallstatus () {
      listByMap().then(res => {
        this.allstatus = res.data.rows
        // console.log(this.allstatus)
      })
    },
    useidgetStatus (id) {
      var statusname = ''
      this.allOptions.forEach(item => {
        if (Number(item.id) === Number(id)) {
          statusname = item.text
        }
      })
      return statusname
    },
    useidgetLiucheng (id) {
      var liucheng = ''
      this.trackerdict.forEach(item => {
        if (Number(id) === Number(item.id)) {
          liucheng = item.name
        }
      })
      return liucheng
    },
    exit () {
      this.$router.go(-1)
    },
    gettrackerdict () {
      gettrackerdict().then(res => {
        // console.log(res)
        this.trackerdict = res.data.rows
      })
    },
    selectdata () {
      this.pageIndex = 1
      this.pageSize = 10
      this.proinfo = this.itemallname
      this.allnamearr = this.allnamearrAll
      var str = this.peojectid
      var name = this.valuename
      var trackerId = this.trackerId.join(',')
      // console.log(str, name)
      // console.log(trackerId[0])
      if (this.peojectid === '' || this.peojectid === null) {
        // var arr = []
        // this.proinfo.forEach(item => {
        //   arr.push(item.id)
        // })
        str = this.projectIds
      }
      this.getlistdata(str, name, trackerId)
    },
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
            if (localStorage.getItem('itemname') !== null) {
              this.peojectid = localStorage.getItem('itemname')
            } else {
              this.peojectid = ''
            }
            var arr = []
            this.proinfo.forEach(item => {
              arr.push(item.id)
            })
            var str = ''
            // console.log(this.valuename)
            if (localStorage.getItem('itemname')) {
              str = localStorage.getItem('itemname')
            } else {
              str = arr.join(',')
              this.projectIds = arr.join(',')
            }
            // console.log(str, this.valuename, this.trackerId)
            this.getlistdata(str, this.valuename, localStorage.getItem('trackerId'))
            this.proinfo.unshift({
              id: '',
              name: '全部'
            })
            this.itemallname = this.proinfo
          })
        }
      })
    },
    useidGetproname (id) {
      var proname = ''
      this.itemallname.forEach(item => {
        if (Number(id) === Number(item.id)) {
          proname = item.name
        }
      })
      return proname
    },
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
    getnameid () {
      getuserdict().then(res => {
        this.allnamearr = res.data.data
        this.allnamearr.unshift({
          id: '',
          text: '全部'
        })
        this.allnamearrAll = [...this.allnamearr]
      })
    },
    useidGetname (id) {
      var name = ''
      this.allnamearrAll.forEach(item => {
        if (Number(id) === Number(item.id)) {
          name = item.text
        }
      })
      return name
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    getlistdata (id, name, trackerId) {
      const startdate = new Date()
      const enddate = new Date()
      startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * 1)
      var end = this.getTimeByDate(enddate)
      var start = this.getTimeByDate(startdate)
      // console.log(end)
      // console.log(start)
      var obj = {
        project_ids: id,
        tracker_id: trackerId,
        assignedToId: name,
        page: this.pageIndex,
        token: this.$cookie.get('token'),
        pageSize: this.pageSize,
        orderFiled: this.orderFiled,
        orderType: this.orderType,
        end_date: end
      }
      this.listLoading = true
      // console.log(obj)
      // alert(123)
      getchecklist(obj).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        // debugger
        // console.log(res)
        this.listLoading = false
      })
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.getlistdata(this.peojectid, this.valuename, this.trackerId.join(','))
    },
    // // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getlistdata(this.peojectid, this.valuename, this.trackerId.join(','))
    },
    // 排序
    productchangeOrder (column, prop, order) {
      // console.log(column.prop)
      this.orderFiled = column.prop
      this.orderType = ''
      if (column.order === 'ascending') {
        this.orderType = 'asc'
      } else {
        this.orderType = 'desc'
      }
      this.getlistdata(this.peojectid, this.valuename, this.trackerId.join(','))
    },
    demandarrCheck (arr, index) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i][index]
        var count = 0
        for (var j = 0; j < arr.length; j++) {
          if (arr[j][index] === temp) {
            count++
            arr[j][index] = -1
          }
        }
        if (temp !== -1) {
          newArr.push({name: temp, count: count})
          arr[i][index] = temp
        }
      }
      return newArr
    },
    // redmine规范流程的echarts
    echartsredminitem (id, obj) {
      // console.log(obj)
      if (obj.count.length > 10) {
        obj.count = obj.count.slice(0, 10)
        obj.name = obj.name.slice(0, 10)
      }
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
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF'],
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
            // data: youdata.error_num_list
            // data: [2, 3, 4, 5, 6, 7]
            data: obj.count
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
              interval: 0,
              rotate: 30
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
            data: obj.count
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
          margin-right: 20px;
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

<style>
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .onmouthFix .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-right: 0px !important;
    margin-top: 50px !important; 
  }
  .mouthFix .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-top: 0px !important;
  }
</style>
