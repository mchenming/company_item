<template>

  <div style="margin-top:15px;background-color:#fff;padding-bottom:30px">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0 15px;background-color:#4b78cd;height:34px">
      <span style="color:#fff;font-weight:700;font-size:18px;">用户访问量统计</span>
      <span class="fa fa-close fa-2x" style="color:#fff;cursor:pointer;" @click="$router.push('/log')"></span>
    </div>
    <div style="padding:0 15px;">
      <div style="height:50px;margin-top:10px;display:flex;align-items:center;">
        <span style="margin-right:10px">时间范围</span>
        <el-date-picker
          v-model="changeTime"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :unlink-panels="true"
          @change="timeChangepro" ref="timeSelect">
        </el-date-picker>
      </div>
      <div style="display:flex;margin-top:20px;">
        <div style="width:200px;height:100px;border:1px solid #ccc;margin-right:80px;display:flex;margin-left:70px;">
          <div style="width:60px;height:100%;background-color:#4b78cd;color:#fff;display:flex;justify-content:center;align-items:center;" class="fa fa-asterisk fa-2x"></div>
          <div style="text-align:center;flex:1;">
            <div style="font-weight:700;font-size:20px;width:100%;margin:10px 0;">UV</div>
            <div style="font-weight:700;font-size:28px;width:100%;margin:10px 0;">{{uvnum}}</div>
          </div>
        </div>
        <div style="width:200px;height:100px;border:1px solid #ccc;margin-right:80px;display:flex">
          <div style="width:60px;height:100%;background-color:rgba(255,102,102,.6);color:#fff;display:flex;justify-content:center;align-items:center;" class="fa fa-coffee fa-2x"></div>
          <div style="text-align:center;flex:1;">
            <div style="font-weight:700;font-size:20px;width:100%;margin:10px 0;">DAU总计</div>
            <div style="font-weight:700;font-size:28px;width:100%;margin:10px 0;">{{daunum}}</div>
          </div>
        </div>
        <div style="width:200px;height:100px;border:1px solid #ccc;margin-right:80px;display:flex">
          <div style="width:60px;height:100%;background-color:#70d2db;color:#fff;display:flex;justify-content:center;align-items:center;" class="fa fa-cloud fa-2x"></div>
          <div style="text-align:center;flex:1;">
            <div style="font-weight:700;font-size:20px;width:100%;margin:10px 0;">PV</div>
            <div style="font-weight:700;font-size:28px;width:100%;margin:10px 0;">{{pvnum}}</div>
          </div>
        </div>
      </div>
      <div style="display:flex;margin-top:20px;">
        <div style="flex:1;">
          <p style="font-size:16px;font-weight:700;margin:0;padding-left:15px;">UV趋势图</p>
          <div style="width:100%;height:220px" ref="Uvchart" id="Uvchart"></div>
        </div>
        <div style="flex:1;">
          <p style="font-size:16px;font-weight:700;margin:0;padding-left:15px;">模块访问量-Top10</p>
          <div style="width:100%;height:220px" ref="Topchart" id="Topchart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import {systemlogStatis} from '@/api/modules/all'
import {operationLogStatis, pvStatis} from '@/api/modules/log'
export default {
  data () {
    return {
      changeTime: [],
      uvnum: 0,
      daunum: 0,
      pvnum: 0
    }
  },
  created () {  
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '系统日志',
      token: this.$cookie.get('token')
    }
    // console.log(this.$route.path)
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
    var s = this.getTimeByDate(start)
    var e = this.getTimeByDate(end)
    this.changeTime = [s, e]
    this.getChartData()
  },
  methods: {
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
    getChartData () {
      const obj = {
        statisType: 'UV',
        dateBegin: this.changeTime[0],
        dateEnd: this.changeTime[1]
      }
      const DauObj = {
        statisType: 'DAU',
        dateBegin: this.changeTime[0],
        dateEnd: this.changeTime[1]
      }
      operationLogStatis(obj).then(res => {
        // console.log(res)
        let obj = {}
        obj.xAxisData = []
        obj.seriesData = []
        if (res.data.hasOwnProperty('total')) {
          this.uvnum = res.data.total
        //   console.log(res.data.data)
          res.data.data.forEach(item => {
            obj.xAxisData.push(item.ymd)
            obj.seriesData.push(item.cnt)
          })
        }
        this.$nextTick(() => {
          this.getchart('Uvchart', obj)
        //   this.getchartbar('Topchart', obj)
        })
      })
      operationLogStatis(DauObj).then(res => {
        // console.log(res)
        if (res.data.hasOwnProperty('total')) {
          this.daunum = res.data.total
        }
      })
      let objpv = {
        dateBegin: this.changeTime[0],
        dateEnd: this.changeTime[1],
        token: this.$cookie.get('token')
      }
      pvStatis(objpv).then(res => {
        // console.log(res)
        // if (res.data.total) {
        this.pvnum = res.data.total
        let obj = {
          xAxisData: [],
          seriesData: []
        }
        if (res.data.data) {
          res.data.data.forEach((item, index) => {
            if (index < 10) {
              obj.xAxisData.push(item.module_name)
              obj.seriesData.push(item.cnt)
            }
          })
        }
        this.getchartbar('Topchart', obj)
        // }
      })
    },
    timeChangepro () {
      this.getChartData()
    },
    getchart (id, graphData, type) {
      // console.log(graphData)
      // graphData.seriesData.
      var max = graphData.seriesData[0]
      var min = graphData.seriesData[0]
      let arr = graphData.seriesData
      var indexMax = 0
      var indexMin = 0
      var indexLast = arr.length - 1
      for (var i = 0; i < arr.length; i++) {
        if (max < arr[i]) {
          max = arr[i]
          indexMax = i
        }
        if (min > arr[i]) {
          min = arr[i]
          indexMin = i
        }
      }
    //   console.log(max, indexMax)
    //   console.log(min, indexMin)
    //   console.log(indexLast)
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#Ccc'
            }
          }
        },
        // legend: {
        //   x: 'center',
        //   y: '-4px',
        //   data: ['总计']
        // },
        grid: {
          top: '15%',
          left: '6%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: graphData.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '总计',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#4B78CD', // 改变折线点的颜色
                lineStyle: {
                  color: '#4B78CD' // 改变折线颜色
                },
                label: {
                  show: true,
                  color: '#4b78cd',
                  formatter: function (params) {
                    // console.log(params)
                    let a = ''
                    params.dataIndex === indexMin || params.dataIndex === indexMax || params.dataIndex === indexLast ? a = params.value : a = ''
                    return a
                  }
                }
              }
            },
            showAllSymbol: true,
            // areaStyle: {
            //   normal: {color: '#4B78CD'} // 改变区域颜色
            // },
            data: graphData.seriesData
          }
        ]
      }, true)
    },
    getchartbar (id, graphData) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#Ccc'
            }
          }
        },
        // legend: {
        //   x: 'center',
        //   y: '-4px',
        //   data: ['总计']
        // },
        grid: {
          top: '15%',
          left: '6%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: graphData.xAxisData,
            axisLabel: {
              formatter: function (params) {
                let str = params
                if (params === 'undefined') {
                  params = ''
                  str = ''
                }
                params.length > 4 ? params = params.substr(0, 4) + '\n' + params.substr(4) : params = str
                return params
              },
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: function (value) {
              let a = 0
              if (graphData.xAxisData.length === 0) {
                a = 5
              } else {
                a = Math.ceil(value.max / 10) * 10
              }
              return a
            }
          }
        ],
        series: [
          {
            name: '总计',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#4B78CD', // 改变折线点的颜色
                lineStyle: {
                  color: '#4B78CD' // 改变折线颜色
                },
                label: {
                  show: true
                }
              }
            },
            barMaxWidth: 40,
            areaStyle: {
              normal: {color: '#4B78CD'} // 改变区域颜色
            },
            data: graphData.seriesData
          }
        ]
      }, true)
    }
  }
}
</script>