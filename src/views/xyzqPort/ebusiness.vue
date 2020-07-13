<template>
    <div class="ebusiness">
        <div class="saltitle">
            <h2>业务场景</h2>
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
          <div style="margin-left:30px">核心用户</div>
          <el-switch
            v-model="isKey"
            active-color="#4b78cd"
            inactive-color="#eacece"
            style="margin-left:15px;"
            @change="searchData()">
          </el-switch>
        </div>
        <div class="ebuskq" v-loading='loading1'>
            <div id="ebuskq"></div>
            <div id="ebushr"></div>
        </div>
        <div class="ebuswb" v-loading='loading2'>
            <div id="ebuswb"></div>
            <div id="ebuszx" v-show="isKey===false"></div>
        </div>
        <div class="ebusxt" v-show="isKey===false" v-loading='loading3'>
            <div id="ebusxt"></div>
            <div id="ebusno"></div>
        </div>
        <div class="close"> <el-button @click="$router.go(-1)">关闭</el-button></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import {getallsummaryscenedata, getscenedata, getallsummaryscenedatano, getscenedatano, getinterfacesladatano, getallsummarydatano} from '@/api/xyzqPort/ebusiness'
export default {
  data () {
    return {
      changeTime: [],
      isKey: false,
      defarr: [],
      loading1: true,
      loading2: true,
      loading3: true
    }
  },
  created () {
  },
  mounted () {
    // var date = new Date()
    var HH = new Date().getHours() + ':00:00'
    // console.log(HH)
    var defaultarr = [HH, HH]
    this.defarr = defaultarr
    var date = localStorage.getItem('business')
    var iskey = localStorage.getItem('biskey')
    this.changeTime = [date.split(',')[0], date.split(',')[1]]
    var obj = {
      start_time: this.changeTime[0],
      end_time: this.changeTime[1]
    }
    if (iskey === 'true') {
      this.isKey = true
      this.hxrenderywpage(obj)
    } else {
      this.isKey = false
      this.renderywpage(obj)
    }
    // this.renderywpage(obj)
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
      var obj = {
        start_time: val[0],
        end_time: val[1]
      }
      if (this.isKey === true) {
        this.hxrenderywpage(obj)
      } else {
        this.renderywpage(obj)
      }
    },
    searchData () {
      var obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1]
      }
      if (this.isKey === true) {
        this.hxrenderywpage(obj)
      } else {
        this.renderywpage(obj)
      }
    },
    // 普通用户渲染的
    renderywpage (data) {
      var obj = {
        start_time: data.start_time,
        end_time: data.end_time
      }
      var ywobj = {
        start_time: data.start_time,
        end_time: data.end_time,
        api_name: 'punchClock'
      }
      var hrobj = {
        start_time: data.start_time,
        end_time: data.end_time,
        api_name: 'HRExamine'
      }
      var wbobj = {
        start_time: data.start_time,
        end_time: data.end_time,
        api_name: 'claimExamine'
      }
      var spobj = {
        start_time: data.start_time,
        end_time: data.end_time,
        api_name: 'examineLogin'
      }
      var xtobj = {
        start_time: data.start_time,
        end_time: data.end_time,
        api_name: 'QueryTokenInfoAction'
      }
      getallsummarydatano(obj).then(response => {
        var titext = response.data.data.QueryTokenInfoAction.summary_sla.value
        getallsummaryscenedatano(obj).then(res => {
        //   console.log(res)
          var titledatas = res.data.data
          // 考勤操作一次完成率
          getscenedatano(ywobj).then(ywres => {
            console.log(ywres)
            var data = ywres.data.data
            data.title = '考勤操作一次通过:'
            data.titledata = titledatas.punchWork.value
            if (Number(data.titledata.split('%')[0]) < 99) {
              data.titlecolor = 'red'
            } else {
              data.titlecolor = 'black'
            }
            data.markLine = 99
            this.echartsyw('ebuskq', data)
            // console.log(data)
          })
          // hr审批一次通过
          getscenedatano(hrobj).then(ywres => {
            // console.log(ywres)
            this.loading1 = false
            var data = ywres.data.data
            data.title = 'HR审批一次通过:'
            data.titledata = titledatas.HRExamine.value
            if (Number(data.titledata.split('%')[0]) < 95) {
              data.titlecolor = 'red'
            } else {
              data.titlecolor = 'black'
            }
            data.markLine = 95
            this.echartsyw('ebushr', data)
          })
          // 网报审批一次通过
          getscenedatano(wbobj).then(ywres => {
            // console.log(ywres)
            var data = ywres.data.data
            data.title = '网报审批一次通过:'
            data.titledata = titledatas.claimExamine.value
            if (Number(data.titledata.split('%')[0]) < 95) {
              data.titlecolor = 'red'
            } else {
              data.titlecolor = 'black'
            }
            data.markLine = 95
            this.echartsyw('ebuswb', data)
          })
          getscenedatano(spobj).then(ywres => {
            // console.log(ywres)
            this.loading2 = false
            var data = ywres.data.data
            data.title = '审批中心协同单点登录成功率:'
            data.titledata = titledatas.examineLogin.value
            if (Number(data.titledata.split('%')[0]) < 99) {
              data.titlecolor = 'red'
            } else {
              data.titlecolor = 'black'
            }
            data.markLine = 99
            this.echartsyw('ebuszx', data)
          })
          getinterfacesladatano(xtobj).then(ywres => {
            this.loading3 = false
            var data = ywres.data.data
            data.title = '协同单点登录服务成功率:'
            data.titledata = titext
            if (Number(data.titledata.split('%')[0]) < 95) {
              data.titlecolor = 'red'
            } else {
              data.titlecolor = 'black'
            }
            data.markLine = 95
            this.echartsyw('ebusxt', data)
          })
        })
      })
    },
    // 点击核心用户渲染的页面函数
    hxrenderywpage (data) {
      var obj = {
        start_time: data.start_time,
        end_time: data.end_time
      }
      var ywobj = {
        start_time: data.start_time,
        end_time: data.end_time,
        api_name: 'punchClock'
      }
      var hrobj = {
        start_time: data.start_time,
        end_time: data.end_time,
        api_name: 'HRExamine'
      }
      var wbobj = {
        start_time: data.start_time,
        end_time: data.end_time,
        api_name: 'claimExamine'
      }
      getallsummaryscenedata(obj).then(res => {
        // console.log(res)
        var titledatas = res.data.data
        // 考勤操作一次完成率
        getscenedata(ywobj).then(ywres => {
          // console.log(ywres)
          var data = ywres.data.data
          data.title = '考勤操作一次通过:'
          data.titledata = titledatas.punchWork.value
        //   console.log(Number(data.titledata.split('%')[0]))
          if (Number(data.titledata.split('%')[0]) < 99) {
            data.titlecolor = 'red'
          } else {
            data.titlecolor = 'black'
          }
          data.markLine = 99
          this.echartsyw('ebuskq', data)
        })
        // hr审批一次通过
        getscenedata(hrobj).then(ywres => {
          // console.log(ywres)
          var data = ywres.data.data
          data.title = 'HR审批一次通过:'
          data.titledata = titledatas.HRExamine.value
          if (Number(data.titledata.split('%')[0]) < 95) {
            data.titlecolor = 'red'
          } else {
            data.titlecolor = 'black'
          }
          data.markLine = 95
          this.echartsyw('ebushr', data)
        })
        // 网报审批一次通过
        getscenedata(wbobj).then(ywres => {
          // console.log(ywres)
          var data = ywres.data.data
          data.title = '网报审批一次通过:'
          data.titledata = titledatas.claimExamine.value
          if (Number(data.titledata.split('%')[0]) < 95) {
            data.titlecolor = 'red'
          } else {
            data.titlecolor = 'black'
          }
          data.markLine = 95
          this.echartsyw('ebuswb', data)
        })
      })
    },
    echartsyw (id, obj) {
      for (var i = 0; i < obj.dataList.length; i++) {
        if (Number(obj.dataList[i]) < obj.markLine) {
          obj.markLinecolor = 'red'
          break
        } else {
          obj.markLinecolor = 'transparent'
        }
      }

      var min = Number(obj.dataList[0])
      for (var j = 0; j < obj.dataList.length; j++) {
        if (min > Number(obj.dataList[j])) {
          min = Number(obj.dataList[j])
        }
      }
      // console.log(min)
      var ymin = 0
      var kd = 0
      if (min > 95) {
        ymin = 95
        kd = 1
      } else if (min > 90) {
        ymin = 90
        kd = 2
      } else if (min > 85) {
        ymin = 85
        kd = 3
      } else if (min > 80) {
        ymin = 80
        kd = 4
      } else if (min > 70) {
        ymin = 70
        kd = 5
      } else if (min > 50) {
        ymin = 50
        kd = 5
      } else if (min > 20) {
        ymin = 20
        kd = 5
      } else if (min > 0) {
        ymin = 0
        kd = 5
      }
      // var ymin = parseInt(min / 10) * 10
      // console.log(obj.dataList)
      // console.log(ymin)
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        title: [{
          text: obj.title,
          left: 'center'
        }, {
          text: obj.titledata,
          left: '68%',
          textStyle: {
            color: obj.titlecolor
          }
        }
        ],
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
          left: '13%', // 组件离容器左侧的距离
          right: '8%',
          top: '30%',
          bottom: '1%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            data: obj.timeList,
            // data: [1, 2, 3, 4, 5, 6, 7, 8],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              // interval: 4,
              interval: Math.floor((obj.timeList.length) / 6) + 1,
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
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'solid'
                // width: 20
              }
            },
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            },
            max: 100,
            min: ymin,
            splitNumber: kd
          }
        ],
        series: [
          {
            name: obj.title,
            type: 'line',
            barGap: 0,
            // symbolSize: 0,
            markLine: {
              data: [{
                yAxis: obj.markLine
              }],
              itemStyle: {
                normal: {
                  color: obj.markLinecolor
                }
              },
              lineStyle: {
                width: 2
              }
            },
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: false,
                  position: 'top'
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
    .ebusiness{
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
    .esaltime{
      height: 50px;
      display: flex;
      align-items: center;
    }
    .ebuskq{
      margin-top: 30px;
      width: 100%;
      height: 270px;
      background-color: #fff;
      display: flex;
      #ebuskq{
        flex: 1;
        height: 270px;
        margin-right: 30px;
      }
      #ebushr{
        flex: 1;
        height: 270px;
      }
    }
    .ebuswb{
      margin-top: 30px;
      width: 100%;
      height: 270px;
      background-color: #fff;
      display: flex;
      #ebuswb{
        // flex: 1;
        width: 49%;
        height: 270px;
        margin-right: 30px;
      }
      #ebuszx{
        // flex: 1;
        width: 49%;
        height: 270px;
      }
    }
    .ebusxt{
      margin-top: 30px;
      width: 100%;
      height: 270px;
      background-color: #fff;
      display: flex;
      #ebusxt{
        flex: 1;
        height: 270px;
        margin-right: 30px;
      }
      #ebusno{
        flex: 1;
        height: 270px;
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