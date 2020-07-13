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
        <div class="ebuskq">
            <div id="ebuskq"></div>
            <div id="ebushr"></div>
        </div>
        <div class="ebuswb">
            <div id="ebuswb"></div>
            <div id="ebuszx" v-show="isKey===false"></div>
        </div>
        <div class="ebusxt" v-show="isKey===false" >
            <div id="ebusxt"></div>
            <div id="ebusno"></div>
        </div>
        <div class="close"> <el-button @click="exit">关闭</el-button></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import {systemlogStatis} from '@/api/modules/all'

import {getallsummaryscenedata, getscenedata, getallsummaryscenedatano, getscenedatano, getinterfacesladatano, getallsummarydatano} from '@/api/newEhomeJS/ebusiness'
export default {
  data () {
    return {
      changeTime: [],
      isKey: false,
      defarr: [],
      loading1: true,
      loading2: true,
      loading3: true,
      allHourtime: []
    }
  },
  created () {
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '兴证E家',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    // var date = new Date()
    var HH = new Date().getHours() + ':00:00'
    // console.log(HH)
    var defaultarr = [HH, HH]
    this.defarr = defaultarr
    var date = localStorage.getItem('business')
    var iskey = localStorage.getItem('biskey')
    this.changeTime = [date.split(',')[0], date.split(',')[1]]
    this.getallHour(this.changeTime[0], this.changeTime[1])
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
      // const row = {
      //   stime: localStorage.getItem('business').split(',')[0],
      //   etime: localStorage.getItem('business').split(',')[1],
      //   isKey: localStorage.getItem('biskey')
      // }
      const row = {
        stime: this.$route.query.stime,
        etime: this.$route.query.etime,
        isKey: this.$route.query.isKey
      }
      this.$router.push({path: '/newEhome', query: row})
    },
    getallHour (stime, etime) {
      // var date1 = stime
      // var date2 = etime
      // var d = new Date(date1.replace(/[- ]/g, ','))
      // var d2 = new Date(date2.replace(/[- ]/g, ','))
      var date1 = stime
      var date2 = etime
      date1 = date1.replace(new RegExp(/-/gm), '/')
      date2 = date2.replace(new RegExp(/-/gm), '/')
      var d = new Date(date1)
      var d2 = new Date(date2)
      var arr = []
      while (d <= d2) {
        arr.push([d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-') + ' ' + [('0' + d.getHours()).slice(-2), ('0' + d.getMinutes()).slice(-2), ('0' + d.getSeconds()).slice(-2)].join(':'))
        d.setHours(d.getHours() + 1)
      }
      // console.log(arr)
      this.allHourtime = arr
    },
    getTimeCheck (val) {
      var obj = {
        start_time: val[0],
        end_time: val[1]
      }
      this.getallHour(val[0], val[1])
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
    getbuchongTime (loginobj, aa) {
      var rowsArr = []
      // if (loginobj.timeList.length > 0) {
      for (var i = 0; i < this.allHourtime.length; i++) {
        var index = loginobj.timeList.findIndex((value, index, arr) => {
          return value === this.allHourtime[i]
        })
        if (index === -1) {
          if (aa) {
            rowsArr.push('1')
          } else {
            rowsArr.push('100')
          }
        } else {
          rowsArr.push(loginobj.dataList[index])
        }
      }
      // console.log(rowsArr)
      // }
      loginobj.timeList = this.allHourtime
      loginobj.dataList = rowsArr
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
        // console.log(response)
        var titext = response.data.data.QueryTokenInfoAction.summary_sla.value
        if (titext === '0') {
          titext = 1
        }
        titext = Number(titext * 100).toFixed(2) + '%'
        // console.log(titext)
        getallsummaryscenedatano(obj).then(res => {
          // console.log(res)
          var titledatas = res.data.data
          // 考勤操作一次完成率
          getscenedatano(ywobj).then(ywres => {
            // console.log(ywres)
            var data = ywres.data.data
            this.getbuchongTime(data)
            data.title = '考勤操作一次通过成功率:'
            data.titledata = titledatas.punchWork.value
            if (Number(data.titledata.split('%')[0]) < 99) {
              data.titlecolor = 'red'
            } else {
              data.titlecolor = 'black'
            }
            data.markLine = 99
            // console.log(data)
            this.echartsyw('ebuskq', data)
            // console.log(data)
          })
          // hr审批一次通过
          getscenedatano(hrobj).then(ywres => {
            // console.log(ywres)
            this.loading1 = false
            var data = ywres.data.data
            this.getbuchongTime(data)

            data.title = 'HR审批一次通过成功率:'
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
            this.getbuchongTime(data)

            data.title = '网报审批一次通过成功率:'
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
            this.getbuchongTime(data)

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
            this.getbuchongTime(data, 'xt')

            for (let i = 0; i < data.dataList.length; i++) {
              data.dataList[i] = (data.dataList[i] * 100).toFixed(2)
            }
            // console.log(data)
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
          this.getbuchongTime(data)
          data.title = '考勤操作一次通过成功率:'
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
          this.getbuchongTime(data)
          data.title = 'HR审批一次通过成功率:'
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
          this.getbuchongTime(data)

          data.title = '网报审批一次通过成功率:'
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
      obj.markLinecolor = 'transparent'
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
        obj.dataList[j] = Number(obj.dataList[j]).toFixed(2)
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
          left: '70%',
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