<template>
    <div class="crashdata">
        <div class="saltitle">
            <h2>Crash数据</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="esaltime">
            <span style="margin-left:20px;">时间范围:</span>
            <el-date-picker
            v-model="changeTime"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="defarr"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTimeCheck"
            style="margin-left:15px"
            :clearable="false">
          </el-date-picker>
        </div>
        <el-row>
          <el-col :span="24" style="padding:0 15px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="Crash概况" name="first">
                <h2>Crash情况</h2>
                <el-row style="margin-bottom:20px">
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;" class="crash">
                      Crash率
                      <span v-if="crashbl===null" class="crashchild">0<span>0</span></span>
                      <span v-else-if="Number(crashbl.android_crash_rate)+Number(crashbl.ios_crash_rate) > 0.05" style="color:red" class="crashchild">{{crashbl.android_crash_rate}}%<span>{{crashbl.ios_crash_rate}}%</span></span>
                      <span v-else class="crashchild">{{crashbl.android_crash_rate}}%<span>{{crashbl.ios_crash_rate}}%</span></span>
                      <!-- <span v-else-if="Number(crashbl.android_crash_rate)+Number(crashbl.ios) > 0.05" style="color:red">{{crashbl.ios_crash_rate}}</span> -->
                    </h3>
                    <div ref="crashlv" id="crashlv" style="width:100%;height:250px;" v-loading = 'crashlvloading'></div>
                  </el-col>
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;"  class="crash">Crash数
                      <span v-if="crashnum===null" class="crashchild">0<span>0</span></span>
                      <span v-else-if='Number(crashnum.android)+Number(crashnum.ios)>30' style="color:red" class="crashchild">{{crashnum.android}}<span>{{crashnum.ios}}</span></span>
                      <span v-else class="crashchild">{{crashnum.android}}<span>{{crashnum.ios}}</span></span>
                    </h3>
                    <div ref="crashnum" id="crashnum" style="width:100%;height:250px;" v-loading ='crashnumloading'></div>
                  </el-col>
                </el-row>
                <h2>影响用户数:
                  <span v-if="!Influencenum.android || !Influencenum.ios">0</span>
                  <span v-else-if="Influencenum.length === 0 ">0</span>
                  <span v-else-if="Influencenum.android+Influencenum.ios > 30" style="color:red">{{Influencenum.android+Influencenum.ios}}</span>
                  <span v-else style="color:black">{{Influencenum.android+Influencenum.ios}}</span>
                </h2>
                <el-row>
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;">Android影响用户:
                      <span v-if="Influencenum.length === 0 ">0</span>
                      <span v-else-if="Influencenum.android+Influencenum.ios > 30" style="color:red">{{Influencenum.android}}</span>
                      <span v-else style="color:black">{{Influencenum.android}}</span>
                    </h3>
                    <div style="background-color: white;width:100%;height:450px; overflow-y:auto" class="renwu" v-loading='infand'> 
                      <div id="androidinfluence" style="width:100%;height:450px"></div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;">IOS影响用户:
                      <span v-if="Influencenum.length === 0 ">0</span>
                      <span v-else-if="Influencenum.android+Influencenum.ios > 30" style="color:red">{{Influencenum.ios}}</span>
                      <span v-else style="color:black">{{Influencenum.ios}}</span>
                    </h3>
                    <div style="background-color: white;width:100%;height:450px; overflow-y:auto" class="renwu" v-loading='infios'> 
                      <div id="iosinfluence" style="width:100%;height:450px;"></div>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="崩溃类型" name="second">
                <h2>新增崩溃数</h2>
                <el-checkbox-group v-model="checkList" @change='datalist' style="margin-bottom:15px;">
                  <el-checkbox label="android">Android:&nbsp;&nbsp;{{collapse.android}}</el-checkbox>
                  <el-checkbox label="ios">IOS:&nbsp;&nbsp;{{collapse.ios}}</el-checkbox>
                </el-checkbox-group>
                <el-row>
                  <el-col :span='24'>
                     <el-table :data="tableData.slice((pageIndex-1)*pageSize,pageIndex*pageSize)" border style="width: 100%;margin-bottom:30px;"
                     @sort-change="changeOrder">
                      <el-table-column type="index" label="序号" width="100" align="center" sortable="custom">
                      </el-table-column>
                      <el-table-column prop="1" label="终端型号" width="150" align="center">
                      </el-table-column>
                      <el-table-column prop="2" label="系统版本" align="center" width="150" sortable="custom">
                      </el-table-column>
                      <el-table-column prop="3" label="App版本" align="center" width="150" sortable="custom">
                      </el-table-column>
                      <el-table-column prop="4" label="崩溃时间" align="center" width="180" sortable="custom">
                      </el-table-column>
                      <el-table-column prop="5" label="崩溃信息" align="center">
                        <template slot-scope="scope">
                          <div style="width:100%;text-align:left">{{scope.row[5]}}</div>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="pagenumchoose">
                      <el-pagination
                        @size-change="sizeChangeHandle"
                        @current-change="currentChangeHandle"
                        :current-page="pageIndex"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        :total="tableData.length"
                        layout="total, sizes, prev, pager, next"
                        class="pagenum">
                      </el-pagination>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row style="text-align:center;margin-top:50px;display:flex;justify-content: center;">
          <el-button style="color:#fff;background-color:#4b78cd;border:none;margin-bottom:30px;" @click="exit">关闭</el-button>
        </el-row>
    </div>
</template>

<script>
import echarts from 'echarts'
import {getcrashnumsummary, getcrashratesummary, getcrashuvsummary, getnewcrashnumsummary, getcrashnumdetail, getcrashratedetail, getandroiduvitemdata, getiosuvitemdata, getnewcrashdetail, gettestdata} from '@/api/xyzqPort/crashdata'
export default {
  data () {
    return {
      changeTime: [],
      defarr: [],
      activeName: 'first',
      Influencenum: {},
      checkList: ['android', 'ios'],
      tableData: [],
      // 崩溃数
      collapse: {},
      pageSize: 10,
      pageIndex: 1,
      crashbl: {},
      crashnum: {},
      crashlvloading: true,
      crashnumloading: true,
      infand: true,
      infios: true
    }
  },
  created () {
    this.changeTime = [this.$route.query.stime, this.$route.query.etime]
    var HH = new Date().getHours() + ':00:00'
    // console.log(HH)
    var defaultarr = [HH, HH]
    this.defarr = defaultarr
  },
  mounted () {
    this.getcrashdata()
    this.testdata()
  },
  methods: {
    exit () {
      const row = {
        stime: this.changeTime[0],
        etime: this.changeTime[1]
      }
      this.$router.push({path: '/eHomePort', query: row})
    },
    sizeChangeHandle (val) {
      this.pageSize = val
    },
    // // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
    },
    // 切换时间
    getTimeCheck (val) {
      // console.log(val)
      this.changeTime = val
      this.getcrashdata()
      // this.testdata()
    },
    datalist (val) {
      // console.log(val)
      this.getbkdata()
    },
    handleClick (tab, event) {
      // console.log(tab)
    },
    testdata () {
      var obj = {
        start_time: '2019-11-05 11:00:00',
        end_time: '2019-11-07 11:00:00',
        api_name: 'HRExamine'
      }
      gettestdata(obj).then(res => {
        console.log(res)
        // var timeArr = res.data.data.time
        // var numArr = res.data.data.num
        // var crashnumArr = res.data.data.crashnum
        // var blArr = []
        // for (var i = 0; i < timeArr.length; i++) {
        //   var num = Number(numArr[i])
        //   var crashmum = Number(crashnumArr[i])
        //   if (num !== 0) {
        //     var bl = ((crashmum / num) * 100).toFixed(2) - 0
        //     blArr.push(bl)
        //   } else {
        //     blArr.push(0)
        //   }
        // }
      })
    },
    getcrashdata () {
      this.tableData = []
      this.Influencenum = {}
      var obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1],
        api_name: 'android'
      }
      // crash数
      getcrashnumsummary(obj).then(res => {
        // console.log(res.data.data)
        var alldata = {}
        if (alldata === null) {
          this.crashnum = {}
        } else {
          this.crashnum = res.data.data
          // console.log(111)
        }
      })
      // console.log(obj)

      // crash数率
      getcrashratesummary(obj).then(res => {
        // console.log(res.data.data)
        // console.log(res)
        var alldata = {}
        if (alldata === null) {
          this.crashbl = {}
        } else {
          this.crashbl = res.data.data
          if (Number(this.crashbl.android_crash_rate) !== 0 || Number(this.crashbl.android_crash_rate) !== 0) {
            this.crashbl.android_crash_rate = this.crashbl.android_crash_rate.split('%')[0]
            this.crashbl.ios_crash_rate = this.crashbl.ios_crash_rate.split('%')[0]
          }
          // console.log(111)
        }
        // console.log(this.crashbl)
      })
      // crash数率
      obj.api_name = 'ios'
      getcrashratedetail(obj).then(resios => {
        // console.log(resios.data)
        var iosList = {}
        if (resios.data === null) {
          // console.log(12123)
          iosList.dataList = [0]
        } else {
          iosList = resios.data.data
        }
        obj.api_name = 'android'
        getcrashratedetail(obj).then(resandroid => {
          // console.log(resandroid)
          // console.log(resandroid.data.data)
          var androidList = {}
          if (resandroid.data === null) {
            // console.log(12123)
            androidList.dataList = [0]
            androidList.timeList = [0]
          } else {
            androidList = resios.data.data
          }
          // var androidList = resandroid.data.data
          let data = {
            iosList: iosList.dataList,
            androidList: androidList.dataList,
            timeList: androidList.timeList,
            // annum: alldata.android_crash_rate,
            // iosnum: alldata.ios_crash_rate,
            markLine: 0.05
          }
          // console
          this.echartcrashbl('crashlv', data)
        })
      })
      // 影响用户数
      getcrashuvsummary(obj).then(res => {
        // console.log(res)
        if (res.data.data !== null) {
          this.Influencenum = res.data.data
        }
      })
      // 影响安卓用户数
      getandroiduvitemdata(obj).then(res => {
        // console.log(res.data.data)
        res.data.data.info = 'Android'
        this.infand = false
        this.drawHBar('androidinfluence', res.data.data)
      })
      // 影响IOS用户数
      getiosuvitemdata(obj).then(res => {
        // console.log(res.data.data)
        res.data.data.info = 'IOS'
        this.infios = false
        this.drawHBar('iosinfluence', res.data.data)
      })
      getnewcrashnumsummary(obj).then(res => {
        // console.log(res.data.data)
        this.collapse = res.data.data
      })
      this.getbkdata()
      this.getcrashnumdata()
    },
    // 切换安卓和ios的表格数据
    getbkdata () {
      var obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1]
      }
      if (this.checkList.length === 2) {
        obj.device = 'ios'
        getnewcrashdetail(obj).then(res => {
          var iosdata = res.data.data
          // console.log(iosdata)
          obj.device = 'android'
          getnewcrashdetail(obj).then(res => {
            var androiddata = res.data.data
            // console.log(androiddata)
            var tabledata = [...iosdata, ...androiddata]
            // console.log(tabledata)
            this.tableData = tabledata
          })
        })
      } else if (this.checkList.length === 1) {
        obj.device = this.checkList[0]
        getnewcrashdetail(obj).then(res => {
          var data = res.data.data
          this.tableData = data
        })
      } else if (this.checkList.length === 0) {
        this.tableData = []
      }
    },
    // crash数的数据
    getcrashnumdata () {
      var obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1],
        api_name: 'android'
      }
      getcrashnumdetail(obj).then(responsean => {
        // console.log(responsean.data.data)
        var android = responsean.data.data
        obj.api_name = 'ios'
        getcrashnumdetail(obj).then(responseios => {
          // console.log(responseios.data.data)
          var ios = responseios.data.data
          let data = {
            iosList: ios.dataList,
            androidList: android.dataList,
            timeList: ios.timeList,
            markLine: 30
            // annum: alldata.android,
            // iosnum: alldata.ios
          }
          // console.log(data)
          this.echartcrashnum('crashnum', data)
        })
      })
    },
    echartcrashnum (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      // console.log(obj)
      if (obj.markLine) {
        for (var i = 0; i < obj.androidList.length; i++) {
          if (Number(obj.androidList[i]) > obj.markLine) {
            obj.markLinecolor = 'red'
            break
          } else {
            obj.markLinecolor = 'transparent'
          }
        }
      }
      if ((Number(obj.iosnum) + Number(obj.annum)) > 30) {
        obj.titlecolor = 'red'
      } else {
        obj.titlecolor = 'black'
      }
      // var max = Number(obj.dataList[0])
      // for (var j = 0; j < obj.dataList.length; j++) {
      //   if (max < Number(obj.dataList[j])) {
      //     max = Number(obj.dataList[j])
      //   }
      // }
      // console.log(max)
      // var ymax = 0
      // var kd = 0
      // if (max < 100) {
      //   ymax = 100
      //   kd = 1
      // } else if (max < 200) {
      //   ymax = 200
      //   kd = 2
      // } else if (max < 300) {
      //   ymax = 300
      //   kd = 3
      // } else if (max < 500) {
      //   ymax = 500
      //   kd = 4
      // } else if (max < 1000) {
      //   ymax = 1000
      //   kd = 5
      // } else {
      //   ymax = 1500
      //   kd = 6
      // }
      myChart.setOption({
        // title: [{
        //   text: obj.annum,
        //   left: '48%',
        //   top: '-5px',
        //   textStyle: {
        //     color: obj.titlecolor
        //   }
        // }, {
        //   text: obj.iosnum,
        //   left: '62%',
        //   top: '-5px',
        //   textStyle: {
        //     color: obj.titlecolor
        //   }
        // }],
        legend: {
          x: 'center',
          data: ['Android:            ', 'ios            ']
        },
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
          right: '8%',
          top: '27%',
          bottom: '1%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            data: obj.timeList,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: Math.floor((obj.timeList.length) / 6),
              // interval: obj.dataList.length / 6,
              // interval: 4
              // rotate: 10
              formatter: function (value) {
                return value.split(' ')[0] + '\n' + value.split(' ')[1]
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
            axisLabel: {
              show: true,
              interval: 'auto'
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'none'
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
            // max: ymax,
            // min: 0,
            // splitNumber: kd
          }
        ],
        series: [
          {
            name: 'Android:            ',
            type: 'line',
            barGap: 0,
            markPoint: {
              data: [{
                name: '最小值',
                type: 'min'
              }, {
                name: '最大值',
                type: 'max'
              }, {
                coord: [obj.androidList.length - 1, Number(obj.androidList[obj.androidList.length - 1])]
              }]
            },
            // symbolSize: 0,
            itemStyle: {
              normal: {
                color: 'rgba(75, 120, 205)',
                label: {
                  show: false,
                  position: 'top'
                }
              }
            },
            areaStyle: {
              normal: {color: 'rgba(75, 120, 205, .5)'} // 改变区域颜色
            },
            barMaxWidth: 25,
            data: obj.androidList
            // data: [23, 20, 55, 15, 12, 30, 9, 17, 25, 2]
          },
          {
            name: 'ios            ',
            type: 'line',
            barGap: 0,
            markLine: {
              data: [{
                yAxis: obj.markLine
              }],
              itemStyle: {
                normal: {
                  color: obj.markLinecolor
                }
              }
            },
            markPoint: {
              data: [{
                name: '最小值',
                type: 'min'
              }, {
                name: '最大值',
                type: 'max'
              }, {
                coord: [obj.iosList.length - 1, Number(obj.iosList[obj.iosList.length - 1])]
              }]
            },
            itemStyle: {
              normal: {
                color: '#5ebd7c',
                // color: 'rgb(94,189,124,.7)',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            areaStyle: {
              normal: {color: 'rgb(94,189,124,.4)'} // 改变区域颜色
            },
            barMaxWidth: 25,
            data: obj.iosList
          }
        ]
      }, true)
      // myChart.resize()
    },
    echartcrashbl (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      // console.log(obj)
      obj.markLinecolor = 'transparent'
      if (obj.markLine) {
        // console.log(obj.markLine)
        for (var i = 0; i < obj.iosList.length; i++) {
          if (Number(obj.iosList[i]) > obj.markLine) {
            // console.log(Number(obj.iosList[i]))
            obj.markLinecolor = 'red'
          }
        }
        for (var j = 0; j < obj.androidList.length; j++) {
          if (Number(obj.androidList[j]) > obj.markLine) {
            // console.log(Number(obj.androidList[j]))
            obj.markLinecolor = 'red'
          }
        }
      }
      // console.log(obj)
      if (obj.iosnum > 0 || obj.annum > 0) {
        if ((Number(obj.iosnum.split('%')[0]) + Number(obj.annum.split('%')[0])) > 0.05) {
          obj.titlecolor = 'red'
        } else {
          obj.titlecolor = '#000'
        }
      } else {
        obj.titlecolor = '#000'
      }
      // var max = Number(obj.dataList[0])
      // for (var j = 0; j < obj.dataList.length; j++) {
      //   if (max < Number(obj.dataList[j])) {
      //     max = Number(obj.dataList[j])
      //   }
      // }
      // console.log(max)
      // var ymax = 0
      // var kd = 0
      // if (max < 100) {
      //   ymax = 100
      //   kd = 1
      // } else if (max < 200) {
      //   ymax = 200
      //   kd = 2
      // } else if (max < 300) {
      //   ymax = 300
      //   kd = 3
      // } else if (max < 500) {
      //   ymax = 500
      //   kd = 4
      // } else if (max < 1000) {
      //   ymax = 1000
      //   kd = 5
      // } else {
      //   ymax = 1500
      //   kd = 6
      // }
      myChart.setOption({
        // title: [{
        //   text: obj.annum,
        //   left: '46%',
        //   top: '-5px',
        //   textStyle: {
        //     color: obj.titlecolor
        //   }
        // }, {
        //   text: obj.iosnum,
        //   left: '62%',
        //   top: '-5px',
        //   textStyle: {
        //     color: obj.titlecolor
        //   }
        // }],
        legend: {
          x: 'center',
          data: ['Android:                 ', 'ios          ']
        },
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
          right: '8%',
          top: '27%',
          bottom: '1%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            data: obj.timeList,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: Math.floor((obj.timeList.length) / 6),
              // interval: obj.dataList.length / 6,
              // interval: 4
              // rotate: 10
              formatter: function (value) {
                return value.split(' ')[0] + '\n' + value.split(' ')[1]
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
            axisLabel: {
              show: true,
              interval: 'auto'
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'none'
                // width: 20
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
            // minInterval: 1
            // max: ymax,
            // min: 0,
            // splitNumber: kd
          }
        ],
        series: [
          {
            name: 'Android:                 ',
            type: 'line',
            barGap: 0,
            markLine: {
              data: [{
                yAxis: obj.markLine
              }],
              itemStyle: {
                normal: {
                  color: obj.markLinecolor
                }
              }
            },
            markPoint: {
              data: [{
                name: '最小值',
                type: 'min'
              }, {
                name: '最大值',
                type: 'max'
              }, {
                coord: [obj.androidList.length - 1, Number(obj.androidList[obj.androidList.length - 1])]
              }]
            },
            // symbolSize: 0,
            itemStyle: {
              normal: {
                color: 'rgba(75, 120, 205, .5)',
                label: {
                  show: false,
                  position: 'top'
                }
              }
            },
            // areaStyle: {
            //   normal: {color: 'rgba(75, 120, 205, .5)'} // 改变区域颜色
            // },
            barMaxWidth: 25,
            data: obj.androidList
            // data: [23, 20, 55, 15, 12, 30, 9, 17, 25, 2]
          },
          {
            name: 'ios          ',
            type: 'line',
            barGap: 0,
            markPoint: {
              data: [{
                name: '最小值',
                type: 'min'
              }, {
                name: '最大值',
                type: 'max'
              }, {
                coord: [obj.iosList.length - 1, Number(obj.iosList[obj.iosList.length - 1])]
              }]
            },
            itemStyle: {
              normal: {
                color: '#5ebd7c',
                label: {
                  show: false,
                  position: 'top'
                }
              }
            },
            // areaStyle: {
            //   normal: {color: 'rgb(94,189,124,.4)'} // 改变区域颜色
            // },
            barMaxWidth: 25,
            data: obj.iosList
          }
        ]
      }, true)
    },
    drawHBar (id, obj) {
      // console.log(obj)
      document.getElementById(id).style.height = 0 + 'px'
      if (obj.userList.length >= 20) {
        document.getElementById(id).style.height = (obj.userList.length * 35) + 'px'
        // document.querySelector(id > 'div').style.height = (obj.userList.length * 35) + 'px'
      } else if (obj.userList.length >= 15) {
        document.getElementById(id).style.height = (obj.userList.length * 30) + 'px'
      } else {
        document.getElementById(id).style.height = 450 + 'px'
      }
      // else if (graphData.seriesData.length < 20) {
      //   document.getElementById(id).style.height = (seriesData.length * 25) + 'px'
      // } else {
      //   document.getElementById(id).style.height = (seriesData.length * 20) + 'px'
      // }
      var myChart = echarts.init(document.getElementById(id))
      myChart.resize()
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '0%',
          left: '4%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          minInterval: 1
        },
        yAxis: {
          type: 'category',
          data: obj.userList
        },
        series: [
          {
            name: obj.info,
            type: 'bar',
            itemStyle: { normal: { color: '#4b78cd' } },
            label: {
              normal: {
                show: true
              }
            },
            barWidth: 25,
            // barMaxWidth: 30,
            data: obj.crashCountList
          }
        ]
      }, true)
    },
    changeOrder (column, prop, order) {
      var key = column.prop - 0
      // var oo = column.order
      // console.log(key)
      // console.log(oo)
      if (key !== 0) {
        this.tableData.sort(function (obj1, obj2) {
          var val1 = 0
          var val2 = 0
          if (obj1[key] !== null && obj2[key] !== null) {
            if (key === 2) {
              if (obj1[key].replace(' ', '').split(',')[0] === 'iOS') {
                obj1[key].split(',')[0] = 10
                var a = obj1[key].replace(' ', '').split(',')[1]
                var b = a.split('.').join('')
                val1 = (10 + b) - 0
                val2 = (10 + b) - 0
                // console.log(val1)
                // console.log(b)
              } else {
                val1 = obj1[key] - 0
                val2 = obj1[key] - 0
              }
            } else if (key === 3) {
              val1 = obj1[key].length
              val2 = obj2[key].length
            } else if (key === 4) {
              val1 = obj1[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
              val2 = obj2[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
            }
          }
          if (column.order === 'ascending') {
            return val1 - val2
          } else {
            return val2 - val1
          }
        })
      }
      // this.sizeChangeHandle(10)
    }
  }
}
</script>

<style lang="scss" scoped>
    .crashdata{
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
          color: #fff;
          margin: 0;
          padding: 0;
          padding: 0 0 0 30px;
      }
    }
      .esaltime{
        height: 50px;
        display: flex;
        align-items: center;
      }
    }
      .pagenumchoose{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
        background-color: #fff;
      }
      .crash{
        position: relative;
        .crashchild{
          position: absolute;
          bottom:-32px;
          left:46%;
          span{
            margin-left: 120px;
          }
        }
      }
</style>

<style>
.saltitle [class*=" el-icon-"], [class^=el-icon-]{
  font-size: 26px;
  color: #fff;
  font-weight: 700;
  margin-right: 20px;
  cursor: pointer;
}

.renwu::-webkit-scrollbar {
  display: block;
}
</style>