<template>
    <div class="defect">
        <!-- 12333 -->
        <div class="saltitle">
            <h2>缺陷列表</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="defectheader">
            <el-row>
                <el-col :span="24">
                  <span style="margin-right:60px;">项目</span>
                  <el-select v-model="listQuery.project_id" placeholder="请选择" @change="changeitem" multiple style="width:80%">
                    <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:80%" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                    <el-option
                      v-for="item in projectOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                  <span>选择时间</span>
                  <el-date-picker
                  v-model="changeTime"
                  type="daterange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['08:00:00', '08:00:00']"
                  value-format="yyyy-MM-dd"
                  @change="changeSelectitem"
                  style="margin-left:15px"
                  :clearable="false">
                </el-date-picker>
                </el-col>
                <el-col :span="14">
                    <div class="info" style="width:100%">
                      <span  style="width: 30%;text-align: center;margin-right: 30px;margin-left: 20px;">状态</span>
                        <el-select
                          v-model="listQuery.statusIds"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                          placeholder="请选择状态" 
                          style="width:80%;"
                          @change="changeSelectitem">
                          <el-option
                            v-for="item in statusOptions"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                          </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-row class="defectmidd">
            <el-col :span="11" class="leadersubmit">
                <!-- <div class="raibox"> -->
                <p style="margin-bottom:5px;margin-right:10px;" class="quexian">提交缺陷分布</p>
                <!-- </div> -->
                <div id="leadersubmit" style="width:100%;height:220px"></div>
            </el-col>
            <el-col :span="11" class="leaderRepair">
                <!-- <div class="raibox"> -->
                <p style="margin-bottom:5px;margin-right:10px;">修复缺陷分布</p>
                <!-- </div> -->
                <div id="leaderRepair" style="width:100%;height:220px"></div>
            </el-col>
        </el-row>
        <el-row class="defectbug">
            <el-col :span="22" class="defectcont">
                <p>Bug趋势</p>
                <div id="defectbug" ref="defectbug"></div>
            </el-col>
        </el-row>

        <div class="defectfoot">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="缺陷" name="first">
                  <el-table :data="tableData" style="width: 100%" @sort-change="defectOrder" v-loading='projectlistLoading'>
                  <el-table-column prop="id" label="缺陷ID" width="100" align="center"  sortable="custom">
                    <template slot-scope="scope">
                      <el-button type="text" @click="goRedmine(scope.row)">{{scope.row.id}}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="优先级" width="120" align="center"  sortable="custom">
                    <template slot-scope="scope">
                      <span v-if="scope.row.priority_id === '3'" style="color: #67c23a;text-align: center;">高</span>
                      <span v-else-if="scope.row.priority_id === '4'" style="color: #e6a23c;text-align: center;">紧急</span>
                      <span v-else-if="scope.row.priority_id === '5'" style="color: #f56c6c;text-align: center;">立刻</span>
                      <span v-else-if="scope.row.priority_id === '2'" style="color: #409eff;text-align: center;">普通</span>
                      <span v-else style="color: #409eff;text-align: center;">低</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="项目" align="center" width="150"  sortable="custom">
                    <template slot-scope="scope">
                      {{useidgetproname(scope.row.project_id)}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="subject" label="主题" width="" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="需求ID" width="100" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="状态" width="120" align="center"  sortable="custom">
                    <template slot-scope="scope">
                      {{usestatusidgetname(scope.row.status_id)}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="严重级别" width="120" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="指派给" width="120" align="center"  sortable="custom">
                    <template slot-scope="scope">
                      {{usepersonidforname(scope.row.assigned_to_id)}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="作者" width="120" align="center"  sortable="custom">
                    <template slot-scope="scope">
                      {{usepersonidforname(scope.row.author_id)}}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="测试人员" name="second">
                  <el-table :data="tableData" style="width: 100%" @sort-change="defectOrder">
                  <el-table-column prop="date" label="人员ID" width="100" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="address" label="项目" align="center" width="150"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" width="" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="提交缺陷" width="" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="严重缺陷" width="" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="一般缺陷" width="" align="center"  sortable="custom">
                  </el-table-column>
                  
                  <el-table-column prop="name" label="验证缺陷" width="" align="center"  sortable="custom">
                  </el-table-column>
                  
                  <el-table-column prop="name" label="已拒绝缺陷" width="" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="验证周期" width="" align="center"  sortable="custom">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="开发人员" name="third">
                  <el-table :data="tableData" style="width: 100%" @sort-change="defectOrder">
                  <el-table-column prop="date" label="人员ID" width="100" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="address" label="项目" align="center" width="150"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" width="" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="修复缺陷" width="" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="严重缺陷" width="" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="一般缺陷" width="" align="center"  sortable="custom">
                  </el-table-column>
                  
                  <el-table-column prop="name" label="一次通过率" width="" align="center"  sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="修复周期" width="" align="center"  sortable="custom">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
            <el-row>
              <el-col :span="24">
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
              </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'

import API from '@/api'
import {getuserdict} from '@/api/xyzqPort/erstantard'
import {getProjectByUser, getAllStatusData} from '@/api/xyzqPort/erneed'
import {getTjBugEcharts, getBugQsEcharts, getBugListByTime} from '@/api/xyzqPort/newdefect'
export default {
  data () {
    return {
      userId: '',
      versionOptions: [],
      projectOptions: [],
      itemallname: [],
      statusOptions: [],
      listQuery: {
        project_id: [],
        statusIds: [],
        orderkey: '',
        orderType: 'desc',
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      changeTime: [],
      projectlistLoading: true,
      authorsarr: [],
      activeName: 'first',
      tableData: [],
      searchText: '',
      allnamearr: []
    }
  },
  created () {
      // 获取所有的项目
    this.changeTime[0] = this.$route.query.stime
    this.changeTime[1] = this.$route.query.etime
    if (typeof (this.$route.query.project_id) !== 'undefined' && this.$route.query.project_id !== '') {
      this.listQuery.project_id = this.$route.query.project_id.split(',')
    }
    this.getproject()
  },
  mounted () {
    // this.echartsdefectbug()
    this.getechartsdata()
    this.getlistData()
    // 获取所有的状态码
    this.getStatusOptions()
    this.getnameid()
  },
  methods: {
    // 退出
    goRedmine (row) {
      window.open('http://192.25.97.80/redmine/issues/' + row.id)
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
    // 获取用户名
    getnameid () {
      getuserdict().then(res => {
        this.allnamearr = res.data.data
      })
    },
    //   点击切换tanp
    handleClick (tab, event) {
      // console.log(tab, event)
      this.listQuery.orderkey = 'id'
      this.listQuery.orderType = 'desc'
      this.listQuery.pageSize = 10
      this.listQuery.pageIndex = 1
    },
    sizeChangeHandle (val) {
      this.projectlistLoading = true
      this.listQuery.pageSize = val
    //   this.searchData()
      this.getlistData()
    },
    // // 当前页
    currentChangeHandle (val) {
      this.projectlistLoading = true
      this.listQuery.pageIndex = val
      this.getlistData()
    //   this.searchData()
    },
    // 切换选中状态时
    statusIdChange () {

    },
    // 获取所有的状态码
    getStatusOptions () {
      const row = {
        tracker_id: '1'
      }
      getAllStatusData(row).then(res => {
        this.statusOptions = res.data.list
        // console.log(this.statusOptions)
      })
    },
    usestatusidgetname (id) {
      var name = ''
      this.statusOptions.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.text
        }
      })
      return name
    },
    useidgetproname (id) {
      var name = ''
      this.itemallname.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.name
        }
      })
      return name
    },
    usepersonidforname (id) {
      var name = ''
      this.allnamearr.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.text
        }
      })
      return name
    },
    // 获取所有echarts的数据
    getechartsdata () {
      var obj = {
        project_ids: this.listQuery.project_id.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1]
      }
      var Tjobj = {
        name: [],
        num: []
      }
      var BugQs = {
        all: [],
        date: [],
        close: [],
        unclose: []
      }
      getTjBugEcharts(obj).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          Tjobj.name = res.data.name
          Tjobj.num = res.data.num
          this.echartssubmitline('leadersubmit', Tjobj)
        }
      })
      getBugQsEcharts(obj).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          BugQs.all = res.data.all
          BugQs.close = res.data.close
          BugQs.date = res.data.date
          BugQs.unclose = res.data.unclose
          this.echartsdefectbug(BugQs)
        }
      })
    },
    getlistData () {
      var obj = {
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        project_ids: this.listQuery.project_id.join(','),
        page: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        orderType: this.listQuery.orderType,
        status_ids: this.listQuery.statusIds.join(',')
      }
      getBugListByTime(obj).then(res => {
        console.log(res)
        this.projectlistLoading = false
        this.tableData = res.data.rows
        this.total = res.data.total
      })
    },
    // 获取所有的项目
    getproject () {
      // this.listLoading = true
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            roleName: '管理人员'
          }
          this.userId = row.userId
          // this.userId = data.user.userId
          getProjectByUser(row).then(res => {
            this.projectOptions = res.data.list
            // 搜索使用到
            // this.projectOptionsAll = res.data.list
            var arr = []
            res.data.list.forEach(item => {
              if (item.id !== '') {
                arr.push(item.id)
              }
            })
            this.Allproject_id = arr.join(',')
            this.projectOptions.unshift({
              id: '',
              name: '全部'
            })
            this.itemallname = this.projectOptions
          })
        }
      })
    },
    // 点击切换项目查询最新的版本
    changeitem () {
      this.projectlistLoading = true
      this.listQuery.statusIds = []
      for (let i = 0; i < this.listQuery.project_id.length; i++) {
        if (this.listQuery.project_id[i] === '') {
          this.listQuery.project_id = []
        }
      }
      this.getechartsdata()
      this.getlistData()
    },
    changeSelectitem () {
      this.projectlistLoading = true
      this.getechartsdata()
      this.getlistData()
    },
    // 排序
    defectOrder (column, prop, order) {
      this.listQuery.orderkey = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.projectlistLoading = true
      this.getlistData()
    },
    echartssubmitline (id, obj) {
      // console.log(obj)
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
          right: '4%',
          top: '10%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            data: obj.name,
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
              show: false
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
            barMaxWidth: 25,
            data: obj.num
          }
        ]
      }, true)
    },
    echartsrepaireline (id, obj) {
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
          right: '4%',
          top: '10%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
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
              show: false
            },
            // max: 25,
            // splitNumber: 5
            minInterval: 1
          }
        ],
        series: [
          {
            name: '数量',
            type: 'line',
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
            // areaStyle: {
            //   normal: {color: '#'} // 改变区域颜色
            // },
            barMaxWidth: 25,
            data: obj.count
            // data: [23, 20, 18, 15, 12, 10, 9, 7, 5, 2]
          }
        ]
      }, true)
    },
    echartsdefectbug (obj) {
      var myChart = echarts.init(this.$refs.defectbug)
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
        legend: {
          x: 'center',
          // y: -5,
          data: ['未关闭', '全部']
        },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '4%',
          top: '15%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE'],
            data: obj.date,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
            //   rotate: 30
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
              show: false
            },
            // max: 25,
            // splitNumber: 5
            minInterval: 1
          }
        ],
        series: [
          {
            name: '未关闭',
            type: 'line',
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
            // areaStyle: {
            //   normal: {color: '#'} // 改变区域颜色
            // },
            barMaxWidth: 25,
            // data: obj.count
            data: obj.unclose
          }, {
            name: '全部',
            type: 'line',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#42b165',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            // areaStyle: {
            //   normal: {color: '#'} // 改变区域颜色
            // },
            barMaxWidth: 25,
            // data: obj.count
            data: obj.all
          }
        ]
      }, true)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.defect{
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
    .defectheader {
      width: 100%;
      height: 100px;
      line-height: 50px;
      background-color: #fff;
      span{
        margin: 0 15px;
      }
    }
    .defectmidd{
        margin-top: 15px;
        width: 100%;
        height: 250px;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        .leadersubmit p,
        .leaderRepair p{
            margin: 0;
            padding: 10px 0 0 15px;
            font-size: 16px;
            font-weight: 700;
            width: 100%;
        }
        .leadersubmit,
        .leaderRepair{
            border: 1px solid #eee;
            box-shadow: 1px 1px 1px rgba(119, 118, 117, 0.2);
        }
    }
    .defectbug{
        margin-top: 15px;
        width: 100%;
        height: 280px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        .defectcont{
            width: 94%;
            border: 1px solid #eee;
            box-shadow: 1px 1px 1px rgba(119, 118, 117, 0.2);
            p{
                margin: 0;
                padding: 10px 0 0 15px;
                font-size: 16px;
                font-weight: 700;
                width: 100%;
            }
            #defectbug{
                height: 250px;
            }
        }
    }
    .defectfoot{
        width: 94%;
        margin: auto;
        padding-bottom: 20px;
        margin-top: 15px;
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