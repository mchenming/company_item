<template>
    <div class="tj">
        <div class="tjhead">
          <el-row>
            <el-col :span="6" class="itemchoose">
                <span>项目:</span>
                <el-select v-model="projectid" placeholder="请选择" @change='changeproject'>
                    <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:200px" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                    <el-option
                      v-for="item in projectOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="12" style="line-height:50px;">
              <span style="margin-left:20px;">时间范围:</span>
              <el-date-picker
                v-model="changeTime"
                type="daterange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['08:00:00', '08:00:00']"
                value-format="yyyy-MM-dd"
                @change="choosetimechange"
                style="margin-left:15px"
                :clearable="false">
              </el-date-picker>
              <!-- <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker> -->
            </el-col>
          </el-row>
        </div>
        <div class="tjlog">
            <el-row>
              <el-col :span="4" class="logbox" style="background-color:rgba(75, 120, 205, 1)">
                  <p>已上线版本</p>
                  <div class="numcont">{{allnumberdata.sx}}</div>
              </el-col>
              <el-col :span="4" class="logbox" style="background-color:rgba(103, 194, 58, 1)">
                  <p>需求(已完成/未完成)</p>
                  <div class="numcont">{{allnumberdata.needwc}}/{{allnumberdata.needmwc}}</div>
              </el-col>
              <el-col :span="4" class="logbox" style="background-color:rgba(153, 102, 255, 1)">
                  <p>产线问题(已关闭/新增问题)</p>
                  <div class="numcont">{{allnumberdata.proclose}}/{{allnumberdata.proadd}}</div>
              </el-col>
              <el-col :span="4" class="logbox" style="background-color:rgba(255, 153, 0, 1)">
                  <p>产线问题(当前累积待解决)</p>
                  <div class="numcont">{{allnumberdata.prowaitsolve}}</div>
              </el-col>
              <el-col :span="4" class="logbox" style="background-color:rgba(0, 153, 255, 1)">
                  <p>任务(开发/测试)</p>
                  <div class="numcont">{{allnumberdata.taskkf}}/{{allnumberdata.taskcs}}</div>
              </el-col>
              <!-- <el-col :span="4" class="logbox"></el-col> -->
            </el-row>
        </div>
        <div class="tjecharts">
          <div class="need">
            <p>需求趋势</p>
            <div id="needecharts" ref="needecharts" style="width:100%;height:220px;"></div>
          </div>
          <div class="itemneed">
            <p>项目需求</p>
            <div id="itemneedecharts" ref="itemneedecharts" style="width:100%;height:220px;"></div>
          </div>
          <div class="proline">
            <p>产线问题分布</p>
            <div id="proecharts" ref="proecharts" style="width:100%;height:220px;"></div>
          </div>
          <div class="itemproline">
            <p>项目产线问题</p>
            <div id="prolineitemecharts" ref="prolineitemecharts" style="width:100%;height:220px;"></div>
          </div>
        </div>
        <div class="tjfooter">
           <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 版本 -->
            <el-tab-pane label="版本" name="first">
              <p>版本列表</p>
              <el-table :data="versionlist.slice((listQuery.pageIndex-1)*listQuery.pageSize,listQuery.pageIndex*listQuery.pageSize)" style="width: 100%"
              :default-sort="{}"
              @sort-change="changeOrder">
                <el-table-column prop="id" label="ID" align="center" sortable="custom">

                </el-table-column>
                <el-table-column prop="project" label="项目" align="center" sortable="custom">

                </el-table-column>
                <el-table-column prop="version" label="版本名称" align="center" sortable="custom">

                </el-table-column>

                <el-table-column prop="createtime" label="创建时间" align="center" sortable="custom">

                </el-table-column>
                
                <el-table-column prop="endtime" label="计划完成时间" align="center" sortable="custom">

                </el-table-column>
                
                <el-table-column prop="state" label="状态" align="center" sortable="custom">

                </el-table-column>
                
                <el-table-column prop="neednum" label="需求数量" align="center" sortable="custom">

                </el-table-column>
                
                <el-table-column prop="kftask" label="开发任务" align="center" sortable="custom">

                </el-table-column>
                
                <el-table-column prop="cstask" label="测试任务" align="center" sortable="custom">

                </el-table-column>
                
                <el-table-column prop="bug" label="BUG数" align="center" sortable="custom">

                </el-table-column>
                
                <el-table-column prop="noclosebug" label="未关闭bug数" align="center" sortable="custom">

                </el-table-column>
                
              </el-table>
              <!-- <div class="pagenumchoose">
                <el-pagination
                  @size-change="sizeChangeHandle"
                  @current-change="currentChangeHandle"
                  :current-page="listQuery.pageIndex"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="listQuery.pageSize"
                  :total="versionlist.length"
                  layout="total, sizes, prev, pager, next"
                  class="pagenum">
                </el-pagination>
              </div> -->
            </el-tab-pane>
            <!-- 需求 -->
            <el-tab-pane label="需求" name="second">
              <p>需求列表</p>
              <el-table :data="needlist.slice((listQuery.pageIndex-1)*listQuery.pageSize,listQuery.pageIndex*listQuery.pageSize)" style="width: 100%"
              :default-sort="{}"
              @sort-change="changeOrder">
                <el-table-column prop="id" label="需求ID" align="center" sortable="custom" width="100">

                </el-table-column>
                <el-table-column prop="level" label="优先级" align="center" sortable="custom" width="100">

                </el-table-column>
                <el-table-column prop="version" label="版本" align="center" sortable="custom" width="150">

                </el-table-column>

                <el-table-column prop="theme" label="主题" align="center" sortable="custom">

                </el-table-column>
                
                <el-table-column prop="state" label="状态" align="center" sortable="custom" width="100">

                </el-table-column>
                
                <el-table-column prop="bug" label="BUG数" align="center" sortable="custom" width="100">

                </el-table-column>
                
                <el-table-column prop="noclosebug" label="未关闭BUG数" align="center" sortable="custom" width="150">

                </el-table-column>
                
                <el-table-column prop="usenum" label="用例数" align="center" sortable="custom" width="100">

                </el-table-column>
                
                <el-table-column prop="solvePerson" label="解决人" align="center" sortable="custom" width="150">

                </el-table-column>
                
                <el-table-column prop="endtime" label="关闭时间" align="center" sortable="custom" width="150">

                </el-table-column>
                
                <el-table-column prop="createtime" label="创建时间" align="center" sortable="custom" width="150">

                </el-table-column>
                
              </el-table>
              <!-- <div class="pagenumchoose">
                <el-pagination
                  @size-change="sizeChangeHandle"
                  @current-change="currentChangeHandle"
                  :current-page="listQuery.pageIndex"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="listQuery.pageSize"
                  :total="needlist.length"
                  layout="total, sizes, prev, pager, next"
                  class="pagenum">
                </el-pagination>
              </div> -->
            </el-tab-pane>
            <!-- 产线 -->
            <el-tab-pane label="产线" name="third">
              <p>产线列表</p>
              <el-table :data="prolinelist.slice((listQuery.pageIndex-1)*listQuery.pageSize,listQuery.pageIndex*listQuery.pageSize)" style="width: 100%"
              :default-sort="{}"
              @sort-change="changeOrder">
                <el-table-column prop="id" label="缺陷ID" align="center" sortable="custom" width="100">

                </el-table-column>
                <el-table-column prop="level" label="优先级" align="center" sortable="custom" width="120">

                </el-table-column>
                <el-table-column prop="theme" label="主题" align="center" sortable="custom">

                </el-table-column>

                <el-table-column prop="createtime" label="创建时间" align="center" sortable="custom" width="150">

                </el-table-column>
                
                <el-table-column prop="state" label="状态" align="center" sortable="custom" width="120">

                </el-table-column>
                
                <el-table-column prop="assign" label="指派给" align="center" sortable="custom" width="120">

                </el-table-column>
                
                <el-table-column prop="feedbacks" label="反馈者" align="center" sortable="custom" width="120">

                </el-table-column>
                
                <el-table-column prop="author" label="作者" align="center" sortable="custom" width="120">

                </el-table-column>
              </el-table>
              <!-- <div class="pagenumchoose">
                <el-pagination
                  @size-change="sizeChangeHandle"
                  @current-change="currentChangeHandle"
                  :current-page="listQuery.pageIndex"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="listQuery.pageSize"
                  :total="prolinelist.length"
                  layout="total, sizes, prev, pager, next"
                  class="pagenum">
                </el-pagination>
              </div> -->
            </el-tab-pane>
            <!-- 任务 -->
            <el-tab-pane label="任务" name="fourth">
              <p>任务列表</p>
              <el-table :data="tasklist.slice((listQuery.pageIndex-1)*listQuery.pageSize,listQuery.pageIndex*listQuery.pageSize)" style="width: 100%"
              :default-sort="{}"
              @sort-change="changeOrder">
                <el-table-column prop="id" label="任务ID" align="center" sortable="custom" width="100">

                </el-table-column>
                <el-table-column prop="level" label="优先级" align="center" sortable="custom" width="120">

                </el-table-column>
                <el-table-column prop="theme" label="主题" align="center" sortable="custom">

                </el-table-column>

                <el-table-column prop="needid" label="需求ID" align="center" sortable="custom" width="100">

                </el-table-column>
                
                <el-table-column prop="state" label="状态" align="center" sortable="custom" width="120">

                </el-table-column>
                
                <el-table-column prop="assign" label="指派给" align="center" sortable="custom" width="120">

                </el-table-column>
                
                <el-table-column prop="endtime" label="计划完成时间" align="center" sortable="custom" width="150">

                </el-table-column>
              </el-table>
              <!-- <div class="pagenumchoose">
                <el-pagination
                  @size-change="sizeChangeHandle"
                  @current-change="currentChangeHandle"
                  :current-page="listQuery.pageIndex"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="listQuery.pageSize"
                  :total="tasklist.length"
                  layout="total, sizes, prev, pager, next"
                  class="pagenum">
                </el-pagination>
              </div> -->
            </el-tab-pane>
            <!-- 人员 -->
            <el-tab-pane label="人员" name="fiveth">
              <p>人员列表</p>
              <el-table :data="personlist.slice((listQuery.pageIndex-1)*listQuery.pageSize,listQuery.pageIndex*listQuery.pageSize)" style="width: 100%"
              :default-sort="{}"
              @sort-change="changeOrder">
                <el-table-column prop="id" label="ID" align="center" sortable="custom" width="100">

                </el-table-column>
                <el-table-column prop="name" label="姓名" align="center" sortable="custom" width="120">

                </el-table-column>
                <el-table-column prop="joinprojects" label="参与项目" align="center" sortable="custom" >

                </el-table-column>

                <el-table-column prop="project" label="项目" align="center" sortable="custom" width="150">

                </el-table-column>
                
                <el-table-column prop="version" label="版本" align="center" sortable="custom" width="150">

                </el-table-column>
                
                <el-table-column prop="need" label="需求" align="center" sortable="custom" >

                </el-table-column>
                
                <el-table-column prop="task" label="任务" align="center" sortable="custom">

                </el-table-column>
              </el-table>
            </el-tab-pane>
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
          </el-tabs>
        </div>
    </div>
</template>

<script src="http://echarts.baidu.com/build/dist/echarts.js"></script>

<script>
import echarts from 'echarts'
// 根据个人的用户id获取对饮的项目
import API from '@/api'
import {getProjectByUser} from '@/api/xyzqPort/erneed'
import {getallnumdata, getneedtrend, getitemneed, getproline, getitemline, getversionlist, getneedlist, getprolinelist, gettasklist, getpersonlist} from '@/api/xyzqPort/StatisticsPort'
export default {
  data () {
    return {
      // 项目id
      projectid: '',
      changeTime: [],
      activeName: 'first',
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        project_id: '',
        stime: '',
        etime: '',
        orderType: '',
        orderkey: ''
      },
      searchText: '',
      itemallname: [],
      // 多有的项目信息id name
      projectOptions: [],
      // 所有的头部信息
      allnumberdata: {},
      total: 0,
      // 版本 ,需求, 产线, 任务,人员的table数据
      versionlist: [],
      needlist: [],
      prolinelist: [],
      tasklist: [],
      personlist: [],
      // 点击切换项目默认显示最近一个月的时间
      defaultTime: []
    }
  },
  created () {
    // 获取就离当前最近的一个月时间
    this.getnowtime()
    // 根据用户的id获取对应的版本信息
    this.getproject()
  },
  mounted () {
  },
  methods: {
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    // 根据搜索输入内容提示搜索文本
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
    // 点击tab切换分页的时候重置每页的排序信息
    handleClick (tab, event) {
      // console.log(tab, event)
      this.listQuery.pageIndex = 1
      this.listQuery.pageSize = 10
      this.listQuery.orderType = 'desc'
      this.listQuery.orderkey = 'id'
      this.getListData(tab.index)
    },
    // 切换时间显示不同的数据
    choosetimechange (val) {
      // console.log(val)
      this.listQuery.stime = val[0]
      this.listQuery.etime = val[1]
      this.listQuery.project_id = this.projectid
      // console.log(this.listQuery)
      this.changeproject()
    },
    // 时间处理函数
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      // const HH = (date.getHours()).toString().padStart(2, 0)
      // const time = `${YY}-${MM}-${DD} ${HH}:00:00`
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    // 需求趋势的echarts
    echartsneed (obj) {
      var myChart = echarts.init(this.$refs.needecharts)
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
          data: ['已完成', '未完成']
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
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
              // rotate: 30
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
            name: '已完成',
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
            data: obj.wc
            // data: [23, 20, 18, 15, 12, 10, 9, 7, 5, 2]
          },
          {
            name: '未完成',
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
            data: obj.mwc
            // data: [2, 20, 14, 25, 12, 19, 9, 7, 15, 32]
          }
        ]
      }, true)
    },
    // 项目需求的echarts
    echartsitemneed (obj) {
      var myChart = echarts.init(this.$refs.itemneedecharts)
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
          y: -5,
          data: ['关闭', '新增']
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
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
              // rotate: 30
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
            name: '关闭',
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
            data: obj.close
            // data: [23, 20, 18, 15, 12, 10, 9, 7, 5, 2]
          },
          {
            name: '新增',
            type: 'bar',
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
            data: obj.add
            // data: [2, 20, 14, 25, 12, 19, 9, 7, 15, 32]
          }
        ]
      }, true)
    },
    // 产线问题分布
    proecharts (obj) {
      var myChart = echarts.init(this.$refs.proecharts)
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
          y: -5,
          data: ['新增问题', '修复率', '本月已解决']
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
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
              // rotate: 30
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
                type: 'dashed',
                color: 'transparent'
                // width: 20
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            },
            // max: ,
            // splitNumber: 5
            minInterval: 1
          }, {
            type: 'value',
            name: '修复率',
            axisLabel: {
              formatter: '{value}%'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        series: [
          {
            name: '本月已解决',
            type: 'line',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgb(255,153,102)',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            data: obj.solve
            // data: [23, 20, 18, 15, 12, 10, 9, 7, 5, 2]
          },
          {
            name: '修复率',
            type: 'line',
            yAxisIndex: 1,
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
            data: obj.repaire
            // data: [99, 90, 68, 85, 92, 49, 79, 87, 95, 88]
          },
          {
            name: '新增问题',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD'
                // label: {
                //   show: true,
                //   position: 'top'
                // }
              }
            },
            barMaxWidth: 30,
            data: obj.add
            // data: [2, 20, 14, 25, 12, 19, 9, 7, 15, 32]
          }
        ]
      }, true)
    },
    // 项目产线问题
    prolineitemecharts (obj) {
      var myChart = echarts.init(this.$refs.prolineitemecharts)
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
          y: -5,
          data: ['关闭', '新增']
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
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
              // rotate: 30
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
            name: '关闭',
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
            data: obj.close
            // data: [23, 20, 18, 15, 12, 10, 9, 7, 5, 2]
          },
          {
            name: '新增',
            type: 'bar',
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
            data: obj.add
            // data: [2, 20, 14, 25, 12, 19, 9, 7, 15, 32]
          }
        ]
      }, true)
    },
    // 当点击分页的时候和每页数据信息量的时候重新渲染请求
    sizeChangeHandle (val) {
      this.listQuery.pageSize = val
      this.getListData()
    },
    currentChangeHandle (val) {
      // console.log(val)
      this.listQuery.pageIndex = val
      // console.log(this.listQuery.pageIndex)
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
    // 获取距离当前时间最近的时间
    getnowtime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      var s = this.getTimeByDate(start)
      var e = this.getTimeByDate(end)
      // console.log(s)
      // console.log(e)
      this.listQuery.stime = s
      this.listQuery.etime = e
      this.changeTime = [s, e]
      this.defaultTime = [s, e]
    },
    // 当切换项目时返回的数据
    changeproject (val) {
      // console.log(val)
      if (val) {
        this.listQuery.project_id = val
      }
      this.listQuery.stime = this.defaultTime[0]
      this.listQuery.etime = this.defaultTime[1]
      // console.log(this.listQuery.project_id)
      // 项目id 和默认事件发请求
      // 请求所有的头部numberdata数据
      getallnumdata(this.listQuery).then(res => {
        // console.log(res.data.data)
        // this.allnumberdata = res.data.data
        var obj = {
          sx: 12,
          needwc: 18,
          needmwc: 5,
          proclose: 12,
          proadd: 11,
          prowaitsolve: 20,
          taskkf: 11,
          taskcs: 5
        }
        this.allnumberdata = obj
      })
      // 请求需求趋势的echarts数据
      getneedtrend(this.listQuery).then(res => {
        var obj = {}
        // echarts已完成和未完成的数据
        // obj.wc = res.data.wc
        // obj.mwc = res.data.mwc
        // obj.name = res.data.name
        obj.wc = [11, 12, 18, 6, 22, 16]
        obj.mwc = [11, 14, 21, 11, 20, 10]
        obj.name = ['zs', 'ls', 'ww', 'as', 'ds', 'jj']
        this.echartsneed(obj)
      })
      // 项目需求的echarts的数据
      getitemneed(this.listQuery).then(res => {
        let obj = {}
        // obj.close = res.data.close
        // obj.add = res.data.add
        // obj.name = res.data.name
        obj.close = [11, 12, 18, 6, 22, 16]
        obj.add = [11, 14, 21, 11, 20, 10]
        obj.name = ['zs', 'ls', 'ww', 'as', 'ds', 'jj']
        this.echartsitemneed(obj)
      })
      // 产线问题的echarts数据
      getproline(this.listQuery).then(res => {
        let obj = {}
        // obj.add = res.data.add
        // obj.repaire = res.data.repaire
        // obj.solve = res.data.solve
        // obj.name = res.data.name
        obj.repaire = [11, 12, 18, 6, 22, 16]
        obj.add = [11, 14, 21, 11, 20, 10]
        obj.solve = [11, 14, 21, 11, 20, 10]
        obj.name = ['zs', 'ls', 'ww', 'as', 'ds', 'jj']
        this.proecharts(obj)
      })
      // 项目产线问题echarts数据
      getitemline(this.listQuery).then(res => {
        let obj = {}
        // obj.close = res.data.close
        // obj.add = res.data.add
        // obj.name = res.data.name
        obj.close = [11, 12, 18, 6, 22, 16]
        obj.add = [11, 14, 21, 11, 20, 10]
        obj.name = ['zs', 'ls', 'ww', 'as', 'ds', 'jj']
        this.prolineitemecharts(obj)
      })
      // 获取所有表格listdata数据
      this.listQuery.orderkey = 'id'
      this.listQuery.orderType = 'desc'
      this.getListData('0')
    },
    // 获取所有的表格信息
    getListData (n) {
      // n 是根据分页所在的index判断total的值
      // console.log(n)
      // 获取所有的版本列表信息
      // console.log(this.listQuery.pageIndex)
      getversionlist(this.listQuery).then(res => {
        this.versionlist = res.data.data
        var arr = []
        for (let i = 0; i < 15; i++) {
          arr.push({id: 3, project: '质量控制平台', version: '1.9.4', createtime: '2019-9-22', endtime: '2019-9-27', state: '完成', neednum: 5, kftask: 22, cstask: 11, bug: 5, noclosebug: 6})
        }
        this.versionlist = arr
        if (n === '0') {
          this.total = this.versionlist.length
        }
      })
      // 获取所有的需求列表信息
      getneedlist(this.listQuery).then(res => {
        this.needlist = res.data.data
        var arr = []
        for (let i = 0; i < 22; i++) {
          arr.push({id: 3, level: '中', version: '1.9.4', theme: '将根据最新版本查询和时间查询合为一个页面了', createtime: '2019-9-22', endtime: '2019-9-27', state: '完成', bug: 5, noclosebug: 6, usenum: 11, solvePerson: '张三'})
        }
        this.needlist = arr
        if (n === '1') {
          this.total = this.needlist.length
        }
      })
      // 获取所有的产线列表信息
      getprolinelist(this.listQuery).then(res => {
        this.prolinelist = res.data.data
        var arr = []
        for (let i = 0; i < 12; i++) {
          arr.push({id: 3, level: '中', theme: '将根据最新版本查询和时间查询合为一个页面了', createtime: '2019-9-22', state: '完成', bug: 5, author: '张三', feedbacks: '李四', assign: '王五'})
        }
        this.prolinelist = arr
        if (n === '2') {
          this.total = this.prolinelist.length
        }
      })
      // 获取所有的任务列表信息
      gettasklist(this.listQuery).then(res => {
        this.tasklist = res.data
        var arr = []
        for (let i = 0; i < 16; i++) {
          arr.push({id: 3, level: '中', theme: '将根据最新版本查询和时间查询合为一个页面了', needid: 12, state: '完成', assign: '王五', endtime: '2019-9-27'})
        }
        this.tasklist = arr
        if (n === '3') {
          this.total = this.tasklist.length
        }
      })
      // 获取所有的人员列表信息
      getpersonlist(this.listQuery).then(res => {
        this.personlist = res.data
        var arr = []
        for (let i = 0; i < 33; i++) {
          arr.push({id: 3, name: '李易峰', joinprojects: '质量控制平台质量控制平台质量控制平台质量控制平台质量控制平台', project: '质量控制平台', version: 'v1.9.4', need: '国庆国庆', task: '完成mock数据'})
        }
        this.personlist = arr
        if (n === '4') {
          this.total = this.personlist.length
        }
      })
    },
    // 获取所有的项目和id
    getproject () {
      // this.listLoading = true
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId
          }
          // this.userId = data.user.userId
          getProjectByUser(row).then(res => {
            this.projectOptions = res.data.list
            // 搜索使用到
            // this.projectOptionsAll = res.data.list
            this.projectOptions.unshift({
              id: '',
              name: '全部'
            })
            this.itemallname = this.projectOptions
            var arr = []
            res.data.list.forEach(item => {
              if (item.id !== '') {
                arr.push(item.id)
              }
            })
            this.listQuery.project_id = arr.join(',')
            // console.log(this.listQuery.project_id)
            // this.allProjectIds = arr.join(',')
            this.changeproject()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tj{
    // margin-top: 44px;
    // background-color: #fff;
    .tjhead{
      height:50px;
      background-color: #fff;
      .itemchoose{
        line-height: 50px;
        margin-left: 30px;
        span{
          margin-right: 15px;
        }
      }
    }
    .tjlog{
      margin:15px 0;
      padding:15px 0 15px 30px;
      background-color: #fff;      
      .logbox{
          margin-right: 30px;
          height: 105px;
          border-radius: 5px;
          p{
            margin: 0;
            padding: 10px 0 0 20px;
            color: #fff;
            font-size: 14px;
          }
          .numcont{
              margin-top: 20px;
              text-align: center;
              font-size: 30px;
              color: #fff;
          }
      }
    }
    .tjfooter{
      background-color: #fff;
      padding: 0 15px;
      .pagenumchoose{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
        background-color: #fff;
      }
    }
    .tjecharts{
        display: flex;
        width: 100%;
        flex-flow: wrap;
        justify-content: space-between;
        margin-bottom: 15px;
        .need,
        .itemneed,
        .proline,
        .itemproline{
            width: 49.4%;
            height: 250px;
            margin-top: 20px;
            background-color: #fff;
            p{
              margin: 0;
              padding: 10px 0 0 15px;
              font-size: 15x;
              font-weight: 700;
            }
        }
        .need,
        .itemneed{
            margin-top: 0px;
        }
    }
    .el-tab-pane p {
      font-size: 15px;
      font-weight: 700;
    }
  }
</style>

<style>
.el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-bottom: -2px !important;
}    
</style>