<template>
    <div class="esal">
        <div class="saltitle">
            <h2>接口详情</h2>
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
        <div class="all">
          <div id="esaallbl" v-loading='loading1'></div>
          <div id="esaalltime" v-loading='loading2'></div>
        </div>
        <div class="esalogin">
          <div id="esaPercentage" v-loading='loading3'></div>
          <div id="esarestime" v-loading='loading4'></div>
        </div>
        <div class="esastatu">
          <div id="esastatubl" v-loading='loading5'></div>
          <div id="esastatutime" v-loading='loading6'></div>
        </div>
        <div class="esadingwei">
          <div id="esadingweibl" v-loading='loading7'></div>
          <div id="esadingweitime" v-loading='loading8'></div>
        </div>
        <div class="esajiekou">
          <div id="esajiekoubl" v-loading='loading9'></div>
          <div id="esajiekoutime" v-loading='loading10'></div>
        </div>
        <div class="esawork">
          <div id="esaworkbl" v-loading='loading11'></div>
          <div id="esaworktime" v-loading='loading12'></div>
        </div>
        <div class="esamail">
          <div id="esamailbl" v-loading='loading13'></div>
          <div id="esamailtime" v-loading='loading14'></div>
        </div>
        <div class="close"> <el-button @click="exit">关闭</el-button></div>
    </div>
</template>
<script>
import echarts from 'echarts'
import {systemlogStatis} from '@/api/modules/all'

import { getinterfacesladata, getinterfacetimedata, getallsummarydata, getallsummarydatano, getinterfacesladatano, getinterfacetimedatano } from '@/api/newEhomeJS/eserversla'
export default {
  data () {
    return {
      changeTime: ['2019-07-30 19:00', '2019-07-31 19:00'],
      isKey: false,
      defarr: [],
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
      loading5: true,
      loading6: true,
      loading7: true,
      loading8: true,
      loading9: true,
      loading10: true,
      loading11: true,
      loading12: true,
      loading13: true,
      loading14: true,
      allHourtime: []
    }
  },
  created () {
    var HH = new Date().getHours() + ':00:00'
    // console.log(HH)
    var defaultarr = [HH, HH]
    this.defarr = defaultarr
    var arr = localStorage.getItem('timedate')
    this.changeTime = [arr.split(',')[0], arr.split(',')[1]]
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
    var isKey = localStorage.getItem('iskey')
    // this.isKey = isKey
    if (isKey === 'true') {
      this.isKey = true
    } else {
      this.isKey = false
    }
    var arr = localStorage.getItem('timedate')
    var obj = {
      stime: arr.split(',')[0],
      etime: arr.split(',')[1]
    }
    // console.log(this.isKey)
    if (this.isKey === true) {
      this.hxrenderpage(obj)
    } else {
      this.renderpage(obj)
    }
  },
  methods: {
    searchData () {
      // console.log(this.isKey)
      var obj = {
        stime: this.changeTime[0],
        etime: this.changeTime[1]
      }
      if (this.isKey === true) {
        this.hxrenderpage(obj)
      } else {
        this.renderpage(obj)
      }
    },
    exit () {
      // const row = {
      //   stime: localStorage.getItem('timedate').split(',')[0],
      //   etime: localStorage.getItem('timedate').split(',')[1],
      //   isKey: localStorage.getItem('iskey')
      // }
      const row = {
        stime: this.$route.query.stime,
        etime: this.$route.query.etime,
        isKey: this.$route.query.isKey
      }
      this.$router.push({path: '/newEhome', query: row})
    },
    getallHour (stime, etime) {
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
      this.allHourtime = arr
      // this.allHourtime.shift()
      // console.log(this.allHourtime)
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const HH = (date.getHours()).toString().padStart(2, 0)
      // const mm = (date.getMinutes()).toString().padStart(2, 0)
      // const ss = (date.getSeconds()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD} ${HH}:00:00`
      return time
    },
    getTimeCheck (val) {
      var obj = {
        stime: val[0],
        etime: val[1]
      }
      this.getallHour(val[0], val[1])
      this.loading1 = true
      this.loading2 = true
      this.loading3 = true
      this.loading4 = true
      this.loading5 = true
      this.loading6 = true
      this.loading7 = true
      this.loading8 = true
      this.loading9 = true
      this.loading10 = true
      this.loading11 = true
      this.loading12 = true
      this.loading13 = true
      this.loading14 = true
      if (this.isKey === true) {
        this.hxrenderpage(obj)
      } else {
        this.renderpage(obj)
      }
    },
    getbuchongTime (loginobj) {
      var rowsArr = []
      var reqArr = []
      // if (loginobj.timeList.length > 0) {
      for (var i = 0; i < this.allHourtime.length; i++) {
        var index = loginobj.timeList.findIndex((value, index, arr) => {
          return value === this.allHourtime[i]
        })
        if (index === -1) {
          rowsArr.push('1')
          reqArr.push(0)
        } else {
          rowsArr.push(loginobj.dataList[index])
          reqArr.push(loginobj.requestList[index])
        }
      }
      // }
      loginobj.timeList = this.allHourtime
      loginobj.dataList = rowsArr
      loginobj.requestList = reqArr
    },
    getbuchongright (timeobj) {
      var rowsArr = []
      var reqArr = []
      // if (timeobj.timeList.length > 0) {
      for (var i = 0; i < this.allHourtime.length; i++) {
        var index = timeobj.timeList.findIndex((value, index, arr) => {
          return value === this.allHourtime[i]
        })
        if (index === -1) {
          rowsArr.push('0')
          reqArr.push(0)
        } else {
          rowsArr.push(timeobj.dataList[index])
          reqArr.push(timeobj.requestList[index])
        }
      }
      // }
      timeobj.timeList = this.allHourtime
      timeobj.dataList = rowsArr
      timeobj.requestList = reqArr
    },
    renderpage (obj) {
      this.getallHour(this.changeTime[0], this.changeTime[1])
      // this.changeTime = [obj.stime, obj.etime]
      var objlogin = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'auth'
      }
      var objall = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'all'
      }
      var objstatu = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'ischeck'
      }
      var objdingwei = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'checkrange'
      }
      var objjiekou = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'workcheck'
      }
      var objwork = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'QueryPtUserModuleAction'
      }
      var objmail = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'QueryOaaddressbookAction'
      }
      // 获取标题需要显示的数据
      getallsummarydatano(objlogin).then(response => {
        // 所有接口成功率
        var titleobj = response.data.data
        if (Number(titleobj.all.summary_sla.value) === 0) {
          titleobj.all.summary_sla.value = 1
        }
        if (Number(titleobj.auth.summary_sla.value) === 0) {
          titleobj.auth.summary_sla.value = 1
        }
        if (Number(titleobj.ischeck.summary_sla.value) === 0) {
          titleobj.ischeck.summary_sla.value = 1
        }
        if (Number(titleobj.checkrange.summary_sla.value) === 0) {
          titleobj.checkrange.summary_sla.value = 1
        }
        if (Number(titleobj.workcheck.summary_sla.value) === 0) {
          titleobj.workcheck.summary_sla.value = 1
        }
        if (Number(titleobj.QueryPtUserModuleAction.summary_sla.value) === 0) {
          titleobj.QueryPtUserModuleAction.summary_sla.value = 1
        }
        if (Number(titleobj.QueryOaaddressbookAction.summary_sla.value) === 0) {
          titleobj.QueryOaaddressbookAction.summary_sla.value = 1
        }
        // if (response.data === null) {
        //   titleobj.all.summary_sla.value = 0
        //   titleobj.all.avg_time_cost.value = 0
        //   titleobj.auth.summary_sla.value = 0
        //   titleobj.auth.avg_time_cost.value = 0
        //   titleobj.ischeck.summary_sla.value = 0
        //   titleobj.ischeck.avg_time_cost.value = 0
        //   titleobj.checkrange.summary_sla.value = 0
        //   titleobj.checkrange.avg_time_cost.value = 0
        //   titleobj.workcheck.summary_sla.value = 0
        //   titleobj.workcheck.avg_time_cost.value = 0
        //   titleobj.QueryPtUserModuleAction.summary_sla.value = 0
        //   titleobj.QueryPtUserModuleAction.avg_time_cost.value = 0
        //   titleobj.QueryOaaddressbookAction.summary_sla.value = 0
        //   titleobj.QueryOaaddressbookAction.avg_time_cost.value = 0
        // }
        // console.log(titleobj)
        getinterfacesladatano(objall).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading1 = false
          var loginobj = res.data.data
          // 补充的时间
          // var rowsArr = []
          // var reqArr = []
          // for (var i = 0; i < this.allHourtime.length; i++) {
          //   var index = loginobj.timeList.findIndex((value, index, arr) => {
          //     return value === this.allHourtime[i]
          //   })
          //   if (index === -1) {
          //     rowsArr.push('1')
          //     reqArr.push(0)
          //   } else {
          //     rowsArr.push(loginobj.dataList[index])
          //     reqArr.push(loginobj.requestList[index])
          //   }
          // }
          // loginobj.timeList = this.allHourtime
          // loginobj.dataList = rowsArr
          this.getbuchongTime(loginobj)
          // 补充的时间
          loginobj.titledata = (Number(titleobj.all.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '所有接口(统计)成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          // console.log(rowsArr)
          this.echartslogin('esaallbl', loginobj)
        })
        // 所有接口平均响应时间
        getinterfacetimedatano(objall).then(res => {
          // console.log(res)
          this.loading2 = false
          var timeobj = res.data.data
          this.getbuchongright(timeobj)
          // var rowsArr = []
          // var reqArr = []
          // for (var i = 0; i < this.allHourtime.length; i++) {
          //   var index = timeobj.timeList.findIndex((value, index, arr) => {
          //     return value === this.allHourtime[i]
          //   })
          //   if (index === -1) {
          //     rowsArr.push('0')
          //     reqArr.push(0)
          //   } else {
          //     rowsArr.push(timeobj.dataList[index])
          //     reqArr.push(timeobj.requestList[index])
          //   }
          // }
          // timeobj.timeList = this.allHourtime
          // timeobj.dataList = rowsArr
          // 。。。
          timeobj.titledata = Number(titleobj.all.avg_time_cost.value).toFixed(2) + 'ms'
          timeobj.title = '所有接口(统计)响应时间'
          if (Number(timeobj.titledata.split('m')[0]) > 200) {
            timeobj.titlecolor = 'red'
          } else {
            timeobj.titlecolor = 'black'
          }
          timeobj.markLine = 200
          this.echartsrestime('esaalltime', timeobj)
          // console.log(timeobj)
        })
        getinterfacesladatano(objlogin).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading3 = false
          var loginobj = res.data.data
          this.getbuchongTime(loginobj)
          loginobj.titledata = (Number(titleobj.auth.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '登陆接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esaPercentage', loginobj)
        })
        // 登陆接口平均响应时间
        getinterfacetimedatano(objlogin).then(res => {
          // console.log(res)
          var timeobj = res.data.data
          this.loading4 = false

          this.getbuchongright(timeobj)

          timeobj.titledata = Number(titleobj.auth.avg_time_cost.value).toFixed(2) + 'ms'
          timeobj.title = '登陆接口响应时间'
          if (Number(timeobj.titledata.split('m')[0]) > 200) {
            timeobj.titlecolor = 'red'
          } else {
            timeobj.titlecolor = 'black'
          }
          timeobj.markLine = 200
          this.echartsrestime('esarestime', timeobj)
          // console.log(timeobj)
        })
        // 打卡状态接口成功率
        getinterfacesladatano(objstatu).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading5 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)
          loginobj.titledata = (Number(titleobj.ischeck.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '打卡状态成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esastatubl', loginobj)
        })
        // 打卡接口响应时间
        getinterfacetimedatano(objstatu).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading6 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)

          loginobj.titledata = Number(titleobj.ischeck.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '打卡状态接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 70) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 70
          this.echartsrestime('esastatutime', loginobj)
        })
        // 打卡定位接口成功率
        getinterfacesladatano(objdingwei).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading7 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)
          loginobj.titledata = (Number(titleobj.checkrange.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '打卡定位接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esadingweibl', loginobj)
        })
        // 打卡定位接口响应时间
        getinterfacetimedatano(objdingwei).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading8 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)
          
          loginobj.titledata = Number(titleobj.checkrange.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '打卡定位接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 70) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 70
          this.echartsrestime('esadingweitime', loginobj)
        })
        // 打卡接口成功率
        getinterfacesladatano(objjiekou).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading9 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)
          loginobj.titledata = (Number(titleobj.workcheck.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '打卡接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esajiekoubl', loginobj)
        })
        // 打卡接口响应时间
        getinterfacetimedatano(objjiekou).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading10 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)
          
          loginobj.titledata = Number(titleobj.workcheck.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '打卡接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 100) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 100
          this.echartsrestime('esajiekoutime', loginobj)
        })
        // 工作台图标接口成功率
        getinterfacesladatano(objwork).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading11 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)
          loginobj.titledata = (Number(titleobj.QueryPtUserModuleAction.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '工作台图标接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esaworkbl', loginobj)
        })
        // 工作台图标接口响应时间
        getinterfacetimedatano(objwork).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading12 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)

          loginobj.titledata = Number(titleobj.QueryPtUserModuleAction.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '工作台图标接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 200) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 200
          this.echartsrestime('esaworktime', loginobj)
        })
        // 通讯录接口成功率
        getinterfacesladatano(objmail).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading13 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)
          loginobj.titledata = (Number(titleobj.QueryOaaddressbookAction.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '通讯录接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esamailbl', loginobj)
        })
        // 通讯录接口响应时间
        getinterfacetimedatano(objmail).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading14 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)

          loginobj.titledata = Number(titleobj.QueryOaaddressbookAction.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '通讯录接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 500) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 500
          // loginobj.dataList = ['8552', '328.85714285714283', '1293.1612903225807']
          this.echartsrestime('esamailtime', loginobj)
        })
      })
    },
    // 核心用户的数据显示
    hxrenderpage (obj) {
      // this.changeTime = [obj.stime, obj.etime]
      this.getallHour(this.changeTime[0], this.changeTime[1])
      var objlogin = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'auth'
      }
      var objall = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'all'
      }
      var objstatu = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'ischeck'
      }
      var objdingwei = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'checkrange'
      }
      var objjiekou = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'workcheck'
      }
      var objwork = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'QueryPtUserModuleAction'
      }
      var objmail = {
        start_time: obj.stime,
        end_time: obj.etime,
        api_name: 'QueryOaaddressbookAction'
      }
      // 获取标题需要显示的数据
      getallsummarydata(objlogin).then(response => {
        // 登陆接口成功率
        var titleobj = response.data.data
        // if (response.data === null) {
        //   titleobj.all.summary_sla.value = 0
        //   titleobj.all.avg_time_cost.value = 0
        //   titleobj.auth.summary_sla.value = 0
        //   titleobj.auth.avg_time_cost.value = 0
        //   titleobj.ischeck.summary_sla.value = 0
        //   titleobj.ischeck.avg_time_cost.value = 0
        //   titleobj.checkrange.summary_sla.value = 0
        //   titleobj.checkrange.avg_time_cost.value = 0
        //   titleobj.workcheck.summary_sla.value = 0
        //   titleobj.workcheck.avg_time_cost.value = 0
        //   titleobj.QueryPtUserModuleAction.summary_sla.value = 0
        //   titleobj.QueryPtUserModuleAction.avg_time_cost.value = 0
        //   titleobj.QueryOaaddressbookAction.summary_sla.value = 0
        //   titleobj.QueryOaaddressbookAction.avg_time_cost.value = 0
        // }
        if (Number(titleobj.all.summary_sla.value) === 0) {
          titleobj.all.summary_sla.value = 1
        }
        if (Number(titleobj.auth.summary_sla.value) === 0) {
          titleobj.auth.summary_sla.value = 1
        }
        if (Number(titleobj.ischeck.summary_sla.value) === 0) {
          titleobj.ischeck.summary_sla.value = 1
        }
        if (Number(titleobj.checkrange.summary_sla.value) === 0) {
          titleobj.checkrange.summary_sla.value = 1
        }
        if (Number(titleobj.workcheck.summary_sla.value) === 0) {
          titleobj.workcheck.summary_sla.value = 1
        }
        if (Number(titleobj.QueryPtUserModuleAction.summary_sla.value) === 0) {
          titleobj.QueryPtUserModuleAction.summary_sla.value = 1
        }
        if (Number(titleobj.QueryOaaddressbookAction.summary_sla.value) === 0) {
          titleobj.QueryOaaddressbookAction.summary_sla.value = 1
        }
        // console.log(response)
        getinterfacesladata(objall).then(res => {
          // console.log(res)
          this.loading1 = false
          var loginobj = res.data.data
          this.getbuchongTime(loginobj)
          // var rowsArr = []
          // var reqArr = []
          // // if (loginobj.timeList.length > 0) {
          // console.log(this.allHourtime)
          // for (var i = 0; i < this.allHourtime.length; i++) {
          //   var index = loginobj.timeList.findIndex((value, index, arr) => {
          //     return value === this.allHourtime[i]
          //   })
          //   if (index === -1) {
          //     rowsArr.push('1')
          //     reqArr.push(0)
          //   } else {
          //     rowsArr.push(loginobj.dataList[index])
          //     reqArr.push(loginobj.requestList[index])
          //   }
          // }
          // // }
          // loginobj.timeList = this.allHourtime
          // loginobj.dataList = rowsArr
          // loginobj.requestList = reqArr

          loginobj.titledata = (Number(titleobj.all.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '所有接口(统计)成功率'
          loginobj.titlecolor = 'black'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
            // console.log()
          } else {
            loginobj.titlecolor = 'black'
          }
          // console.log(12)
          this.echartslogin('esaallbl', loginobj)
        })
        // 所有接口平均响应时间
        getinterfacetimedata(objall).then(res => {
          // console.log(res)
          this.loading2 = false
          var timeobj = res.data.data
          this.getbuchongright(timeobj)

          timeobj.titledata = Number(titleobj.all.avg_time_cost.value).toFixed(2) + 'ms'
          timeobj.title = '所有接口(统计)响应时间'
          if (Number(timeobj.titledata.split('m')[0]) > 200) {
            timeobj.titlecolor = 'red'
          } else {
            timeobj.titlecolor = 'black'
          }
          timeobj.markLine = 200
          this.echartsrestime('esaalltime', timeobj)
          // console.log(timeobj)
        })
        getinterfacesladata(objlogin).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading3 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)

          loginobj.titledata = (Number(titleobj.auth.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '登陆接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esaPercentage', loginobj)
        })
        // 登陆接口平均响应时间
        getinterfacetimedata(objlogin).then(res => {
          // console.log(res)
          this.loading4 = false

          var timeobj = res.data.data
          this.getbuchongright(timeobj)

          timeobj.titledata = Number(titleobj.auth.avg_time_cost.value).toFixed(2) + 'ms'
          timeobj.title = '登陆接口响应时间'
          if (Number(timeobj.titledata.split('m')[0]) > 200) {
            timeobj.titlecolor = 'red'
          } else {
            timeobj.titlecolor = 'black'
          }
          timeobj.markLine = 200
          this.echartsrestime('esarestime', timeobj)
        })
        // 打卡状态接口成功率
        getinterfacesladata(objstatu).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading5 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)

          loginobj.titledata = (Number(titleobj.ischeck.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '打卡状态成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esastatubl', loginobj)
        })
        // 打卡接口响应时间
        getinterfacetimedata(objstatu).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading6 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)

          loginobj.titledata = Number(titleobj.ischeck.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '打卡状态接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 70) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 70
          this.echartsrestime('esastatutime', loginobj)
        })
        // 打卡定位接口成功率
        getinterfacesladata(objdingwei).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading7 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)

          loginobj.titledata = (Number(titleobj.checkrange.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '打卡定位接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esadingweibl', loginobj)
        })
        // 打卡定位接口响应时间
        getinterfacetimedata(objdingwei).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading8 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)

          loginobj.titledata = Number(titleobj.checkrange.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '打卡定位接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 70) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 70
          this.echartsrestime('esadingweitime', loginobj)
        })
        // 打卡接口成功率
        getinterfacesladata(objjiekou).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading9 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)

          loginobj.titledata = (Number(titleobj.workcheck.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '打卡接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esajiekoubl', loginobj)
        })
        // 打卡接口响应时间
        getinterfacetimedata(objjiekou).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading10 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)

          loginobj.titledata = Number(titleobj.workcheck.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '打卡接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 100) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 100
          this.echartsrestime('esajiekoutime', loginobj)
        })
        // 工作台图标接口成功率
        getinterfacesladata(objwork).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading11 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)

          loginobj.titledata = (Number(titleobj.QueryPtUserModuleAction.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '工作台图标接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esaworkbl', loginobj)
        })
        // 工作台图标接口响应时间
        getinterfacetimedata(objwork).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading12 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)

          loginobj.titledata = Number(titleobj.QueryPtUserModuleAction.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '工作台图标接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 200) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 200
          this.echartsrestime('esaworktime', loginobj)
        })
        // 通讯录接口成功率
        getinterfacesladata(objmail).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading13 = false

          var loginobj = res.data.data
          this.getbuchongTime(loginobj)

          loginobj.titledata = (Number(titleobj.QueryOaaddressbookAction.summary_sla.value) * 100).toFixed(2) + '%'
          loginobj.title = '通讯录接口成功率'
          if (Number(loginobj.titledata.split('%')[0]) < 99) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          this.echartslogin('esamailbl', loginobj)
        })
        // 通讯录接口响应时间
        getinterfacetimedata(objmail).then(res => {
          // console.log(titleobj)
          // console.log(res)
          this.loading14 = false

          var loginobj = res.data.data
          this.getbuchongright(loginobj)

          loginobj.titledata = Number(titleobj.QueryOaaddressbookAction.avg_time_cost.value).toFixed(2) + 'ms'
          loginobj.title = '通讯录接口响应时间'
          if (Number(loginobj.titledata.split('m')[0]) > 500) {
            loginobj.titlecolor = 'red'
          } else {
            loginobj.titlecolor = 'black'
          }
          loginobj.markLine = 500
          this.echartsrestime('esamailtime', loginobj)
          // console.log(loginobj)
        })
      })
    },
    echartslogin (id, obj) {
      // console.log(obj)
      for (let i = 0; i < obj.dataList.length; i++) {
        obj.dataList[i] = Number(obj.dataList[i] * 100).toFixed(2)
      }
      obj.color = 'transparent'
      for (var i = 0; i < obj.dataList.length; i++) {
        if (Number(obj.dataList[i]) < 99) {
          obj.color = 'red'
          break
        } else {
          obj.color = 'transparent'
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
      // console.log(obj)
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
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              // interval: 4,
              interval: Math.floor((obj.timeList.length) / 6),
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
                yAxis: 99
              }],
              itemStyle: {
                normal: {
                  color: obj.color
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
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: false,
                  position: 'top'
                }
              }
            },
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
            // data: [23, 20, 55, 15, 12, 30, 9, 17, 25, 2]
          }
        ]
      }, true)
    },
    echartsrestime (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      // console.log(obj)
      for (let i = 0; i < obj.dataList.length; i++) {
        let responsetime = Number(obj.dataList[i])
        obj.dataList[i] = responsetime.toFixed(2)
      }
      obj.markLinecolor = 'transparent'
      for (var i = 0; i < obj.dataList.length; i++) {
        if (Number(obj.dataList[i]) > obj.markLine) {
          obj.markLinecolor = 'red'
          break
        } else {
          obj.markLinecolor = 'transparent'
        }
      }
      var max = Number(obj.dataList[0])
      for (var j = 0; j < obj.dataList.length; j++) {
        if (max < Number(obj.dataList[j])) {
          max = Number(obj.dataList[j])
        }
      }
      // console.log(max)
      var ymax = 0
      var kd = 0
      if (max < 100) {
        ymax = 100
        kd = 1
      } else if (max < 200) {
        ymax = 200
        kd = 2
      } else if (max < 300) {
        ymax = 300
        kd = 3
      } else if (max < 500) {
        ymax = 500
        kd = 4
      } else if (max < 1000) {
        ymax = 1000
        kd = 5
      } else {
        // Math.ceil(max/1000)
        ymax = Math.ceil(max / 1000) * 1000
        kd = 6
      }
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
          left: '13%', // 组件离容器左侧的距离
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
            },
            max: ymax,
            min: 0,
            splitNumber: kd
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .esal{
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
    .all{
      width: 100%;
      height: 270px;
      background-color: #fff;
      margin: 30px 0;
      display: flex;
      #esaallbl{
        flex: 1;
        height: 270px;
        margin-right: 30px;
      }
      #esaalltime{
        flex: 1;
        height: 270px;
      }
    }
    .esalogin{
      width: 100%;
      height: 270px;
      background-color: #fff;
      display: flex;
      #esaPercentage{
        flex: 1;
        height: 270px;
        margin-right: 30px;
      }
      #esarestime{
        flex: 1;
        height: 270px;
      }
    }
    .esastatu{
      margin-top: 30px;
      width: 100%;
      height: 270px;
      background-color: #fff;
      display: flex;
      #esastatubl{
        flex: 1;
        height: 270px;
        margin-right: 30px;
      }
      #esastatutime{
        flex: 1;
        height: 270px;
      }
    }
    .esadingwei{
      margin-top: 30px;
      width: 100%;
      height: 270px;
      background-color: #fff;
      display: flex;
      #esadingweibl{
        flex: 1;
        height: 270px;
        margin-right: 30px;
      }
      #esadingweitime{
        flex: 1;
        height: 270px;
      }
    }
    .esajiekou{
      margin-top: 30px;
      width: 100%;
      height: 270px;
      background-color: #fff;
      display: flex;
      #esajiekoubl{
        flex: 1;
        height: 270px;
        margin-right: 30px;
      }
      #esajiekoutime{
        flex: 1;
        height: 270px;
      }
    }
    .esawork{
      margin-top: 30px;
      width: 100%;
      height: 270px;
      background-color: #fff;
      display: flex;
      #esaworkbl{
        flex: 1;
        height: 270px;
        margin-right: 30px;
      }
      #esaworktime{
        flex: 1;
        height: 270px;
      }
    }
    .esamail{
      margin-top: 30px;
      width: 100%;
      height: 270px;
      background-color: #fff;
      display: flex;
      #esamailbl{
        flex: 1;
        height: 270px;
        margin-right: 30px;
      }
      #esamailtime{
        flex: 1;
        height: 270px;
      }
    }
    .close{
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 50px;
      // margin-bottom: 20px;
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