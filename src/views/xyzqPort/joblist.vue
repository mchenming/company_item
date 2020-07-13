<template>
  <div class="joblist">
    <div class="jobhead">
      <el-row>
        <el-col :span="5">
          <span>项目</span>
          <el-select v-model="listQuery.project_id" placeholder="请选择" @change="changeitem">
            <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:200px" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <span>版本</span>
          <el-select v-model="listQuery.version_id" placeholder="请选择">
            <el-option
              v-for="item in versionOptions"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="12" style="line-height:50px;">
            <span style="margin-left:20px;">时间范围</span>
            <el-date-picker
              v-model="changeTime"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="jobtimechange"
              style="margin-left:15px"
              :clearable="false">
            </el-date-picker>
        </el-col>
      </el-row>
    </div>
    <div class="jobcon">
        <el-row>
            <el-col :span="9" style="background:white;height:325px;margin-right:10px">
                <p>开发任务数量top5</p>
                <div id="jobkfecharts" ref="jobkfecharts" style="width:100%;height:290px"></div>
            </el-col>
            <el-col :span="9" style="background:white;height:325px;margin-right:10px">
                <p>测试任务数量top5</p>
                <div id="jobcsecharts" ref="jobcsecharts" style="width:100%;height:290px"></div>
            </el-col>
            <el-col :span="6" style="height:325px" class="rightinfo">
                <div class="infobox" style="background:rgba(75, 120, 205, 1)">
                    <p>任务总数</p>
                    <div>{{boxdata.tasknum}}</div>
                </div>
                <div class="infobox" style="background:rgba(103, 194, 58, 1)">
                    <p>完成总数</p>
                    <div>{{boxdata.completenum}}</div>
                </div>
                <div class="infobox" style="background:rgba(255, 153, 0, 1)">
                    <p>用例总数</p>
                    <div>{{boxdata.usenum}}</div>
                </div>
                <div class="infobox" style="background:rgba(165, 188, 230, 1)">
                    <p>执行用例</p>
                    <div>{{boxdata.implementnum}}</div>
                </div>
                <div class="infobox" style="background:rgba(245, 108, 108, 1);">
                    <p>缺陷总数</p>
                    <div>{{boxdata.defectnum}}</div>
                </div>
                <div class="infobox" style="background:rgba(179, 225, 157, 1)">
                    <p>修复bug</p>
                    <div>{{boxdata.repairenum}}</div>
                </div>
            </el-col>
        </el-row>
    </div>
    <div class="jobcreates">
        <el-row>
            <el-col :span="15" style="background:#fff;margin-right:10px;">
                <p>创建用例TOP10</p>
                <div id="createsecharts" ref="createsecharts" style="width:100%;height:290px"></div>
            </el-col>
            <el-col :span="9" style="background:#fff;">
                <p>创建用例TOP5</p>
                <el-table :data="createtop" style="width: 100%" class="createtable" @sort-change="createOrder">
                  <el-table-column label="序号" width="100" align="center" type="index">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" width="100" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="create" label="创建用例" width="100" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop=zx label="执行用例" width="100" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="buglv" label="用例发现bug率" width="140" align="center" sortable="custom">
                  </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
    <div class="jobsubmit">
        <el-row>
            <el-col :span="15" style="background:#fff;margin-right:10px;">
                <p>提交缺陷TOP10</p>
                <div id="submitecharts" ref="submitecharts" style="width:100%;height:290px"></div>
            </el-col>
            <el-col :span="9" style="background:#fff;">
                <p>提交缺陷TOP5</p>
                <el-table :data="submittop" style="width: 100%" class="createtable" @sort-change="submitOrder">
                  <el-table-column label="序号" width="100" align="center" type="index">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" width="100" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="create" label="创建用例" width="100" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="zx" label="执行用例" width="100" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="buglv" label="用例发现bug率" width="140" align="center" sortable="custom">
                  </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
    
    <div class="jobrepaire">
        <el-row>
            <el-col :span="15" style="background:#fff;margin-right:10px;">
                <p>缺陷修复TOP10</p>
                <div id="repaireecharts" ref="repaireecharts" style="width:100%;height:290px"></div>
            </el-col>
            <el-col :span="9" style="background:#fff;">
                <p>缺陷修复TOP5</p>
                <el-table :data="repairetop" style="width: 100%" class="createtable el-table__header" @sort-change="repaireOrder">
                  <el-table-column label="序号" width="100" align="center" type="index">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" width="100" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="create" label="创建用例" width="100" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="zx" label="执行用例" width="100" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="buglv" label="用例发现bug率" width="140" align="center" sortable="custom">
                  </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import API from '@/api'
import {getversiondict, getProjectByUser, getNewVersionByProject} from '@/api/xyzqPort/erneed'
import {getboxdata, getkftaskdata, getcstaskdata, getcreatedata, getcreatetabledata, getsubmitDefectdata, getsubmitDefecttabledata, getrepaireDefectdata, getrepaireDefecttabledata} from '@/api/xyzqPort/joblist'
export default {
  data () {
    return {
      // 默认选中时间
      changeTime: [],
      projectOptions: [],
      listQuery: {
        project_id: '',
        version_id: '',
        stime: '',
        etime: '',
        orderkey: '',
        orderType: ''
      },
      // 所有的版本id和text
      versionOptions: [],
      itemallname: [],
      searchText: '',
      // 当前用户的全部项目id 字符串
      Allproject_id: '',
      // 默认近一个月的时间数组
      defaultTime: [],
      boxdata: {},
      // 表格数据
      createtop: [],
      submittop: [],
      repairetop: []
    }
  },
  created () {
    // 获取最近一个月的时间
    this.getnowtime()
    // 获取所有的项目和id
    this.getproject()
  },
  mounted () {
  },
  methods: {
    createOrder (column, prop, order) {
      this.listQuery.orderkey = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.getcreatetop5()
    },
    submitOrder (column, prop, order) {
      this.listQuery.orderkey = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.getsubmittop5()
    },
    repaireOrder (column, prop, order) {
      this.listQuery.orderkey = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.getrepairetop5()
    },
    // 搜索框失去焦点时
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
    // 切换项目时
    changeitem (val) {
      this.listQuery.project_id = val
      this.getversion()
    },
    // 获取距离当前时间最近一天的时间范围
    getnowtime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      var s = this.getTimeByDate(start)
      var e = this.getTimeByDate(end)
      this.changeTime = [s, e]
      this.defaultTime = [s, e]
      // console.log(this.changeTime)
    },
    // 时间处理函数
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      // const HH = (date.getHours()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    jobtimechange (val) {
      // console.log(val)
      this.listQuery.stime = val[0]
      this.listQuery.etime = val[1]
      this.getjobdata()
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
            var arr = []
            res.data.list.forEach(item => {
              if (item.id !== '') {
                arr.push(item.id)
              }
            })
            this.Allproject_id = arr.join(',')
            this.projectOptions.unshift({
              id: this.Allproject_id,
              name: '全部'
            })
            this.itemallname = this.projectOptions
            // console.log(this.listQuery.project_id)
            this.listQuery.stime = this.changeTime[0]
            this.listQuery.etime = this.changeTime[1]
            this.getjobdata()
          })
        }
      })
    },
    getjobdata () {
      if (this.listQuery.project_id === '') {
        this.listQuery.project_id = this.Allproject_id
      }
      // console.log(this.listQuery)
      // 获取右边颜色盒子的数据
      getboxdata(this.listQuery).then(res => {
        this.boxdata = res.data.data
        this.boxdata = {
          tasknum: 11,
          completenum: 20,
          usenum: 5,
          implementnum: 10,
          defectnum: 7,
          repairenum: 5
        }
      })
      // 获取开发任务的echartsTop5数据
      getkftaskdata(this.listQuery).then(res => {
        // res.data.data
        // const obj = {
        //   wc: res.data.wc,
        //   mwc: res.data.mwc,
        //   name: res.data.name
        // }
        const obj = {
          wc: [11, 10, 5, 18, 13],
          mwc: [2, 5, 4, 11, 6],
          name: ['zs', 'wd', 'ppq', 'xxx', 'gdragon']
        }
        this.kfecharts(obj)
      })
      // 获取测试任务的echartsTop5数据
      getcstaskdata(this.listQuery).then(res => {
        // res.data.data
        // const obj = {
        //   wc: res.data.wc,
        //   mwc: res.data.mwc,
        //   name: res.data.name
        // }
        const obj = {
          wc: [11, 14, 5, 18, 13],
          mwc: [2, 5, 11, 5, 6],
          name: ['zs', 'wd', 'ppq', 'xxx', 'gdragon']
        }
        this.csecharts(obj)
      })
      // 获取创建用例echartsTop10数据
      getcreatedata(this.listQuery).then(res => {
        // res.data.data
        // const obj = {
        //   create: res.data.create,
        //   daycreate: res.data.daycreate,
        //   use: res.data.use,
        //   dayuse: res.data.dayuse,
        //   name: res.data.name
        // }
        const obj = {
          create: [11, 14, 5, 18, 13],
          daycreate: [2, 5, 11, 5, 6],
          use: [9, 4, 15, 21, 6],
          dayuse: [19, 16, 5, 1, 6],
          name: ['zs', 'wd', 'ppq', 'xxx', 'gdragon']
        }
        this.createsecharts(obj)
      })
      // 获取提交缺陷echartsTop10数据
      getsubmitDefectdata(this.listQuery).then(res => {
        // res.data.data
        // const obj = {
        //   submit: res.data.submit,
        //   daysubmit: res.data.daysubmit,
        //   check: res.data.check,
        //   daycheck: res.data.daycheck,
        //   name: res.data.name
        // }
        const obj = {
          submit: [11, 14, 25, 18, 13],
          daysubmit: [12, 15, 11, 12, 16],
          check: [9, 24, 10, 21, 6],
          daycheck: [11, 6, 15, 11, 14],
          name: ['zs', 'wd', 'ppq', 'xxx', 'gdragon']
        }
        this.submitecharts(obj)
      })
      // 获取修复缺陷echartsTop10数据
      getrepaireDefectdata(this.listQuery).then(res => {
        // res.data.data
        // const obj = {
        //   repaire: res.data.repaire,
        //   norepaire: res.data.norepaire,
        //   dayrepaire: res.data.dayrepaire,
        //   name: res.data.name
        // }
        const obj = {
          repaire: [11, 14, 25, 18, 13],
          norepaire: [12, 15, 11, 12, 16],
          dayrepaire: [11, 6, 15, 11, 14],
          name: ['zs', 'wd', 'ppq', 'xxx', 'gdragon']
        }
        this.repaireecharts(obj)
      })
      // 获取创建用例top5表格数据
      this.getcreatetop5()
      this.getsubmittop5()
      this.getrepairetop5()
    },
    // 创建用例TOP5表格数据
    getcreatetop5 () {
      getcreatetabledata(this.listQuery).then(res => {
        this.createtop = res.data.data
        var arr = []
        for (let i = 0; i < 5; i++) {
          arr.push({name: '吴彦祖', create: 5, zx: 10, buglv: '19%'})
        }
        this.createtop = arr
      })
    },
    // 提交缺陷TOP5表格数据
    getsubmittop5 () {
      getsubmitDefecttabledata(this.listQuery).then(res => {
        this.submittop = res.data.data
        var arr = []
        for (let i = 0; i < 5; i++) {
          arr.push({name: '卢本伟', create: 15, zx: 10, buglv: '99%'})
        }
        this.submittop = arr
      })
    },
    // 修复缺陷top5表格数据
    getrepairetop5 () {
      getrepaireDefecttabledata(this.listQuery).then(res => {
        this.repairetop = res.data.data
        var arr = []
        for (let i = 0; i < 5; i++) {
          arr.push({name: '张学友', create: 5, zx: 1, buglv: '1%'})
        }
        this.repairetop = arr
      })
    },
    // 点击切换项目查询最新的版本
    getversion () {
      // debugger
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
          // console.log(res.data)
          this.listQuery.version_id = ''
          if (res.data.list.length === 1) {
            if (res.data.list[0].version_id !== null && res.data.list[0].version_id !== '') {
              this.listQuery.version_id = res.data.list[0].version_id
            }
          }
          // 获取所选项目的最新版本需求的信息
          // console.log(this.listQuery)
          // 切换项目时时间默认我最近一个月的
          this.listQuery.stime = this.defaultTime[0]
          this.listQuery.etime = this.defaultTime[1]
          this.getjobdata()
        })
      })
    },
    // 开发echarts
    kfecharts (obj) {
      var myChart = echarts.init(this.$refs.jobkfecharts)
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
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE'],
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
            name: '已完成',
            type: 'bar',
            stack: '堆叠',
            barGap: 0,
            barMaxWidth: '30px',
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.wc
            // data: [23, 20, 18, 15, 12]
          },
          {
            name: '未完成',
            type: 'bar',
            stack: '堆叠',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(165, 188, 230, 1)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.mwc
            // data: [2, 20, 14, 25, 12]
          }
        ]
      }, true)
    },
    // 测试echarts
    csecharts (obj) {
      var myChart = echarts.init(this.$refs.jobcsecharts)
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
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE'],
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
            name: '已完成',
            type: 'bar',
            stack: '堆叠',
            barGap: 0,
            barMaxWidth: '30px',
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.wc
            // data: [23, 20, 18, 15, 12]
          },
          {
            name: '未完成',
            type: 'bar',
            stack: '堆叠',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(165, 188, 230, 1)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.mwc
            // data: [2, 20, 14, 25, 12]
          }
        ]
      }, true)
    },
    // 创建用例echarts
    createsecharts (obj) {
      var myChart = echarts.init(this.$refs.createsecharts)
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
          data: ['创建用例', '当日创建用例', '执行用例', '当日执行用例']
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
            name: '创建用例',
            type: 'bar',
            stack: '堆叠',
            barGap: 0,
            barMaxWidth: '30px',
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.create
            // data: [23, 20, 18, 15, 12]
          },
          {
            name: '当日创建用例',
            type: 'bar',
            stack: '堆叠',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(165, 188, 230, 1)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.daycreate
            // data: [2, 20, 14, 25, 12]
          },
          {
            name: '执行用例',
            type: 'bar',
            stack: '堆叠a',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(103, 194, 58, 1)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.use
            // data: [2, 20, 14, 25, 12]
          },
          {
            name: '当日执行用例',
            type: 'bar',
            stack: '堆叠a',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(103, 194, 58, 0.5)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.dayuse
            // data: [2, 12, 10, 21, 2]
          }
        ]
      }, true)
    },
    // 提交缺陷echarts
    submitecharts (obj) {
      var myChart = echarts.init(this.$refs.submitecharts)
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
          data: ['提交缺陷', '当日提交缺陷', '验证缺陷', '当日验证缺陷']
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
            name: '提交缺陷',
            type: 'bar',
            stack: '堆叠',
            barGap: 0,
            barMaxWidth: '30px',
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.submit
            // data: [23, 20, 18, 15, 12]
          },
          {
            name: '当日提交缺陷',
            type: 'bar',
            stack: '堆叠',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(165, 188, 230, 1)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.daysubmit
            // data: [2, 20, 14, 25, 12]
          },
          {
            name: '验证缺陷',
            type: 'bar',
            stack: '堆叠a',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(103, 194, 58, 1)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.check
            // data: [2, 20, 14, 25, 12]
          },
          {
            name: '当日验证缺陷',
            type: 'bar',
            stack: '堆叠a',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(103, 194, 58, 0.5)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.daycheck
            // data: [2, 12, 10, 21, 2]
          }
        ]
      }, true)
    },
    repaireecharts (obj) {
      var myChart = echarts.init(this.$refs.repaireecharts)
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
          data: ['已修复', '未修复', '当日修复']
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
            name: '已修复',
            type: 'bar',
            stack: '堆叠',
            barGap: 0,
            barMaxWidth: '30px',
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.repaire
            // data: [23, 20, 18, 15, 12]
          },
          {
            name: '未修复',
            type: 'bar',
            stack: '堆叠',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(165, 188, 230, 1)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.norepaire
            // data: [2, 20, 14, 25, 12]
          },
          {
            name: '当日修复',
            type: 'bar',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(103, 194, 58, 1)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            data: obj.dayrepaire
            // data: [2, 20, 14, 25, 12]
          }
        ]
      }, true)
    }
  }
}
</script>

<style lang="scss" scoped>
.joblist{
  // margin-top: 44px;
  .jobhead {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    span{
      margin: 0 15px;
    }
  }
  .jobcon {
      margin-top: 10px;
      width: 100%;
      .el-row{
    //   box-sizing: border-box;
          display: flex;
          p{
              font-size: 15px;
              font-weight: 700;
              margin: 0;
              padding: 10px 0 0 15px;
          }
          .rightinfo{
              display: flex;
              flex-flow: wrap;
              justify-content: space-between;
              align-content: space-between;
              .infobox{
                  width: 48.5%;
                  height: 31%;
                  background-color: #fff;
                  border-radius: 10px;
                  p{
                      color: #fff;
                      padding-left: 30px;
                      font-weight: 500;
                  }
                  div{
                    width: 100%;
                    text-align: center;
                    font-size: 40px;
                    color: #fff;
                    // font-weight: 700;
                    margin-top: 12px;
                  }
              }
          }
      }
  }
  .jobcreates{
      margin-top: 10px;
      .el-row{
          display: flex;
          height: 326px;
          P{
            margin: 0;
            padding: 10px  0 0 15px;
            font-size: 15px;
            font-weight: 700;
          }
          // .createtable{
          //     margin-top: 5px;
          // }
      }
  }
  .jobsubmit{
      margin-top: 10px;
        .el-row{
          display: flex;
          height: 326px;
          P{
            margin: 0;
            padding: 10px  0 0 15px;
            font-size: 15px;
            font-weight: 700;
          }
          // .createtable{
          //     margin-top: 5px;
          // }
      }
  }
  .jobrepaire{
      margin-top: 10px;
        .el-row{
          display: flex;
          height: 326px;
          P{
            margin: 0;
            padding: 10px  0 0 15px;
            font-size: 15px;
            font-weight: 700;
          }
          // .createtable{
          //     margin-top: 5px;
          // }
      }
  }
}
</style>

<style lang="scss">
    .el-select-dropdown__wrap,.el-scrollbar__wrap{
        margin-bottom: -4px !important;
    }
    // .el-table__header tr,
    // .el-table__header th {
    //   // padding: 0;
    //   height: 40px;
    // }
</style>