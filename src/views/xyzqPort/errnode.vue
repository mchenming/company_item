<template>
    <div class="errnode">
        <div class="saltitle">
            <h2>节点异常</h2>
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
        <div class="nodeone" style="margin-bottom:20px;" v-loading='loading1'>
            <h3>节点192.168.3.55</h3>
            <div class="reqnumber">
              <div id="reqnumberleft"></div>
              <div id="reqnumberright"></div>
            </div>
            <div class="reqbl" style="margin-top:15px;">
              <div id="reqblleft"></div>
              <div id="reqblright"></div>
            </div>
        </div>
        <div class="nodeone" style="margin-bottom:20px;" v-loading='loading2'>
            <h3>节点192.168.3.57</h3>
            <div class="reqnumber">
              <div id="twotopleft"></div>
              <div id="twotopright"></div>
            </div>
            <div class="reqbl" style="margin-top:15px;">
              <div id="twofootleft"></div>
              <div id="twofootright"></div>
            </div>
        </div>
        <div class="nodeone" style="margin-bottom:20px;" v-loading='loading3'>
            <h3>节点192.168.3.59</h3>
            <div class="reqnumber">
              <div id="threetopleft"></div>
              <div id="threetopright"></div>
            </div>
            <div class="reqbl" style="margin-top:15px;">
              <div id="threefootleft"></div>
              <div id="threefootright"></div>
            </div>
        </div>
        <el-row>
          <el-col :span="24" style="text-align:center;margin-top:30px;margin-bottom:30px;">
            <el-button style="background-color:#4B78CD;color:#fff;border:none;" @click="exit">退出</el-button>
          </el-col>
        </el-row>
    </div>
</template>

<script>
import echarts from 'echarts'
import { getonlinedata, getnodeaccessrequestnumdetail, getnodeaccesserrorratedetail, getnodeaccessrequesttimedetail, getnodeaccesslowrequestnumdetail } from '@/api/xyzqPort/errnode'
export default {
  data () {
    return {
      changeTime: [],
      isKey: false,
      nodedata: [],
      defarr: [],
      loading1: true,
      loading2: true,
      loading3: true
    }
  },
  mounted () {
    this.changeTime = [this.$route.query.stime, this.$route.query.etime]
    this.getechartdata()
    var date = new Date()
    var HH = date.getHours() + ':00:00'
    // console.log(HH)
    var defaultarr = [HH, HH]
    this.defarr = defaultarr
  },
  methods: {
    exit () {
      const row = {
        stime: this.changeTime[0],
        etime: this.changeTime[1]
      }
      this.$router.push({path: '/eHomePort', query: row})
    },
    getTimeCheck (val) {
      // console.log(val)
      this.loading1 = true
      this.loading2 = true
      this.loading3 = true
      this.changeTime = val
      this.getechartdata()
    },
    getechartdata () {
      var obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1]
      }
      getonlinedata(obj).then(res => {
        this.nodedata = res.data.data
        console.log(res.data.data)
        var Arrdata = res.data.data
        let obj = {
          start_time: this.changeTime[0],
          end_time: this.changeTime[1],
          api_name: Arrdata[0].node_id
        }
        let obj1 = {
          start_time: this.changeTime[0],
          end_time: this.changeTime[1],
          api_name: Arrdata[1].node_id
        }
        let obj2 = {
          start_time: this.changeTime[0],
          end_time: this.changeTime[1],
          api_name: Arrdata[2].node_id
        }
        // -------------------53----------------------
        getnodeaccessrequestnumdetail(obj).then(res => {
          this.loading1 = false
          // console.log(res)
          let reqdata = res.data.data
          reqdata.title = '请求数量:'
          reqdata.titledata = Arrdata[0].request_num
          reqdata.titlecolor = 'black'
          // reqdata.markLine = 100
          // console.log(res.data.data)
          this.echartsreqnumberleft('reqnumberleft', reqdata)
        })
        getnodeaccesserrorratedetail(obj).then(res => {
          let errate = res.data.data
          // console.log(res)
          errate.title = '请求错误率:'
          errate.titledata = Arrdata[0].request_error_rate
          if (Number(errate.titledata.split('%')[0]) > 6) {
            errate.titlecolor = 'red'
          } else {
            errate.titlecolor = 'black'
          }
          errate.markLine = 6
          this.echartserrateleft('reqblleft', errate)
        })
        getnodeaccessrequesttimedetail(obj).then(res => {
          let resdata = res.data.data
          // console.log(res)
          resdata.title = '平均响应时间:'
          resdata.titledata = Arrdata[0].request_time
          if (Number(resdata.titledata.split('ms')[0]) > 50) {
            resdata.titlecolor = 'red'
          } else {
            resdata.titlecolor = 'black'
          }
          resdata.markLine = 50
          this.echartsresponsetime('reqnumberright', resdata)
        })
        getnodeaccesslowrequestnumdetail(obj).then(res => {
          let resdata = res.data.data
          // console.log(res)
          resdata.title = '超过1s响应数量:'
          resdata.titledata = Arrdata[0].low_request_num
          // if (Number(resdata.titledata.split('ms')[0]) > 50) {
          //   resdata.titlecolor = 'red'
          // } else {
          //   resdata.titlecolor = 'black'
          // }
          // resdata.markLine = 50
          resdata.titlecolor = 'black'
          this.echartsexceednum('reqblright', resdata)
        })
        // -------------------------57--------------------
        getnodeaccessrequestnumdetail(obj1).then(res => {
          this.loading2 = false
          let reqdata = res.data.data
          reqdata.title = '请求数量:'
          reqdata.titledata = Arrdata[1].request_num
          reqdata.titlecolor = 'black'
          // reqdata.markLine = 100
          // console.log(res.data.data)
          this.echartsreqnumberleft('twotopleft', reqdata)
        })
        getnodeaccesserrorratedetail(obj1).then(res => {
          let errate = res.data.data
          // console.log(errate)
          errate.title = '请求错误率:'
          errate.titledata = Arrdata[1].request_error_rate
          if (Number(errate.titledata.split('%')[0]) > 6) {
            errate.titlecolor = 'red'
          } else {
            errate.titlecolor = 'black'
          }
          errate.markLine = 6
          this.echartserrateleft('twofootleft', errate)
        })
        getnodeaccessrequesttimedetail(obj1).then(res => {
          let resdata = res.data.data
          // console.log(resdata)
          resdata.title = '平均响应时间:'
          resdata.titledata = Arrdata[1].request_time
          if (Number(resdata.titledata.split('ms')[0]) > 50) {
            resdata.titlecolor = 'red'
          } else {
            resdata.titlecolor = 'black'
          }
          resdata.markLine = 50
          this.echartsresponsetime('twotopright', resdata)
        })
        getnodeaccesslowrequestnumdetail(obj1).then(res => {
          let resdata = res.data.data
          // console.log(resdata)
          resdata.title = '超过1s响应数量:'
          resdata.titledata = Arrdata[1].low_request_num
          // if (Number(resdata.titledata.split('ms')[0]) > 50) {
          //   resdata.titlecolor = 'red'
          // } else {
          //   resdata.titlecolor = 'black'
          // }
          // resdata.markLine = 50
          resdata.titlecolor = 'black'
          this.echartsexceednum('twofootright', resdata)
        })
        // -----------------------59----------------------------
        getnodeaccessrequestnumdetail(obj2).then(res => {
          this.loading3 = false
          let reqdata = res.data.data
          reqdata.title = '请求数量:'
          reqdata.titledata = Arrdata[2].request_num
          reqdata.titlecolor = 'black'
          // reqdata.markLine = 100
          // console.log(res.data.data)
          this.echartsreqnumberleft('threetopleft', reqdata)
        })
        getnodeaccesserrorratedetail(obj2).then(res => {
          let errate = res.data.data
          // console.log(errate)
          errate.title = '请求错误率:'
          errate.titledata = Arrdata[2].request_error_rate
          if (Number(errate.titledata.split('%')[0]) > 6) {
            errate.titlecolor = 'red'
          } else {
            errate.titlecolor = 'black'
          }
          errate.markLine = 6
          this.echartserrateleft('threefootleft', errate)
        })
        getnodeaccessrequesttimedetail(obj2).then(res => {
          let resdata = res.data.data
          // console.log(resdata)
          resdata.title = '平均响应时间:'
          resdata.titledata = Arrdata[2].request_time
          if (Number(resdata.titledata.split('ms')[0]) > 50) {
            resdata.titlecolor = 'red'
          } else {
            resdata.titlecolor = 'black'
          }
          resdata.markLine = 50
          this.echartsresponsetime('threetopright', resdata)
        })
        getnodeaccesslowrequestnumdetail(obj2).then(res => {
          let resdata = res.data.data
          // console.log(resdata)
          resdata.title = '超过1s响应数量:'
          resdata.titledata = Arrdata[2].low_request_num
          // if (Number(resdata.titledata.split('ms')[0]) > 50) {
          //   resdata.titlecolor = 'red'
          // } else {
          //   resdata.titlecolor = 'black'
          // }
          // resdata.markLine = 50
          resdata.titlecolor = 'black'
          this.echartsexceednum('threefootright', resdata)
        })
      })
    },
    echartsreqnumberleft (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      // console.log(obj)
      if (obj.markLine) {
        for (var i = 0; i < obj.dataList.length; i++) {
          if (Number(obj.dataList[i]) > obj.markLine) {
            obj.markLinecolor = 'red'
            break
          } else {
            obj.markLinecolor = 'transparent'
          }
        }
      }
      var max = Number(obj.dataList[0])
      for (var j = 0; j < obj.dataList.length; j++) {
        if (max < Number(obj.dataList[j])) {
          max = Number(obj.dataList[j])
        }
      }
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
        title: [{
          text: obj.title,
          left: 'center'
        }, {
          text: obj.titledata,
          left: '60%',
          textStyle: {
            color: obj.titlecolor
          }
        }],
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
          top: '30%',
          bottom: '1%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
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
            // max: ymax,
            // min: 0,
            // splitNumber: kd
          }
        ],
        series: [
          {
            name: obj.title,
            type: 'line',
            barGap: 0,
            // markLine: {
            //   data: [{
            //     yAxis: obj.markLine
            //   }],
            //   itemStyle: {
            //     normal: {
            //       color: obj.markLinecolor
            //     }
            //   }
            // },
            markPoint: {
              data: [{
                name: '最小值',
                type: 'min'
              }, {
                name: '最大值',
                type: 'max'
              }, {
                coord: [obj.dataList.length - 1, Number(obj.dataList[obj.dataList.length - 1])]
              }]
            },
            // symbolSize: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: false,
                  position: 'top'
                }
              }
            },
            // areaStyle: {
            //   normal: {color: 'rgba(75, 120, 205, .4)'} // 改变区域颜色
            // },
            barMaxWidth: 25,
            data: obj.dataList
            // data: [23, 20, 55, 15, 12, 30, 9, 17, 25, 2]
          },
          {
            name: '请求数',
            type: 'line',
            barGap: 0,
            // symbolSize: 0,
            itemStyle: {
              normal: {
                color: 'transparent',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25,
            data: obj.requestList
          }
        ]
      }, true)
    },
    echartserrateleft (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      // console.log(obj)
      if (obj.markLine) {
        for (var i = 0; i < obj.dataList.length; i++) {
          if (Number(obj.dataList[i]) > obj.markLine) {
            obj.markLinecolor = 'red'
            break
          } else {
            obj.markLinecolor = 'transparent'
          }
        }
      }
      var max = Number(obj.dataList[0])
      for (var j = 0; j < obj.dataList.length; j++) {
        if (max < Number(obj.dataList[j])) {
          max = Number(obj.dataList[j])
        }
      }
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
        title: [{
          text: obj.title,
          left: 'center'
        }, {
          text: obj.titledata,
          left: '60%',
          textStyle: {
            color: obj.titlecolor
          }
        }],
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
          top: '30%',
          bottom: '1%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
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
              interval: 'auto',
              formatter: '{value} %'
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
            // max: ymax,
            // min: 0,
            // splitNumber: kd
          }
        ],
        series: [
          {
            name: obj.title,
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
                coord: [obj.dataList.length - 1, Number(obj.dataList[obj.dataList.length - 1])]
              }]
            },
            // symbolSize: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: false,
                  position: 'top'
                }
              }
            },
            // areaStyle: {
            //   normal: {color: 'rgba(75, 120, 205, .4)'} // 改变区域颜色
            // },
            barMaxWidth: 25,
            data: obj.dataList
            // data: [23, 20, 55, 15, 12, 30, 9, 17, 25, 2]
          },
          {
            name: '请求数',
            type: 'line',
            barGap: 0,
            // symbolSize: 0,
            itemStyle: {
              normal: {
                color: 'transparent',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25,
            data: obj.requestList
          }
        ]
      }, true)
    },
    echartsresponsetime (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      // console.log(obj)
      if (obj.markLine) {
        for (var i = 0; i < obj.dataList.length; i++) {
          if (Number(obj.dataList[i]) > obj.markLine) {
            obj.markLinecolor = 'red'
            break
          } else {
            obj.markLinecolor = 'transparent'
          }
        }
      }
      var max = Number(obj.dataList[0])
      for (var j = 0; j < obj.dataList.length; j++) {
        if (max < Number(obj.dataList[j])) {
          max = Number(obj.dataList[j])
        }
      }
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
        title: [{
          text: obj.title,
          left: 'center'
        }, {
          text: obj.titledata,
          left: '60%',
          textStyle: {
            color: obj.titlecolor
          }
        }],
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
          top: '30%',
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
              interval: 'auto',
              formatter: '{value} ms'
            },
            'splitLine': {     // 网格线
              'show': false,
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
            // max: ymax,
            // min: 0,
            // splitNumber: kd
          }
        ],
        series: [
          {
            name: obj.title,
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
                coord: [obj.dataList.length - 1, Number(obj.dataList[obj.dataList.length - 1])]
              }]
            },
            // symbolSize: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: false,
                  position: 'top'
                }
              }
            },
            areaStyle: {
              normal: {color: 'rgba(75, 120, 205, .4)'} // 改变区域颜色
            },
            barMaxWidth: 25,
            data: obj.dataList
          }
        ]
      }, true)
    },
    echartsexceednum (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      // console.log(obj)
      if (obj.markLine) {
        for (var i = 0; i < obj.dataList.length; i++) {
          if (Number(obj.dataList[i]) > obj.markLine) {
            obj.markLinecolor = 'red'
            break
          } else {
            obj.markLinecolor = 'transparent'
          }
        }
      }
      var max = Number(obj.dataList[0])
      for (var j = 0; j < obj.dataList.length; j++) {
        if (max < Number(obj.dataList[j])) {
          max = Number(obj.dataList[j])
        }
      }
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
        title: [{
          text: obj.title,
          left: 'center'
        }, {
          text: obj.titledata,
          left: '60%',
          textStyle: {
            color: obj.titlecolor
          }
        }],
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
          top: '30%',
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
              // formatter: '{value} %'
            },
            'splitLine': {     // 网格线
              'show': false,
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
            // max: ymax,
            // min: 0,
            // splitNumber: kd
          }
        ],
        series: [
          {
            name: obj.title,
            type: 'line',
            barGap: 0,
            // markLine: {
            //   data: [{
            //     yAxis: obj.markLine
            //   }],
            //   itemStyle: {
            //     normal: {
            //       color: obj.markLinecolor
            //     }
            //   }
            // },
            markPoint: {
              data: [{
                name: '最小值',
                type: 'min'
              }, {
                name: '最大值',
                type: 'max'
              }, {
                coord: [obj.dataList.length - 1, Number(obj.dataList[obj.dataList.length - 1])]
              }]
            },
            // symbolSize: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: false,
                  position: 'top'
                }
              }
            },
            areaStyle: {
              normal: {color: 'rgba(75, 120, 205, .4)'} // 改变区域颜色
            },
            barMaxWidth: 25,
            data: obj.dataList
          }
        ]
      }, true)
    }
  }
}
</script>


<style lang="scss" scoped>
.errnode{
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
    .nodeone{
      h3{
        width: 100%;
        text-align: center;
        font-size: 25px;
      }
      .reqnumber{
        width: 100%;
        height: 240px;
        display: flex;
        #reqnumberleft,#twotopleft,#threetopleft{
          width: 49%;
          height: 100%;
          margin-right: 15px;
        }
        #reqnumberright,#twotopright,#threetopright{
          width: 49%;
          height: 100%;
        }
      }
      .reqbl{
        width: 100%;
        height: 240px;
        display: flex;
        #reqblleft,#twofootleft,#threefootleft{
          width: 49%;
          height: 100%;
          margin-right: 15px;
        }
        #reqblright,#twofootright,#threefootright{
          width: 49%;
          height: 100%;
        }
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
</style>