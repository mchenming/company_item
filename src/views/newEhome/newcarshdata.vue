<template>
    <div class="crashdata">
        <div class="saltitle">
            <h3>Crash数据</h3>
            <i class="fa fa-close fa-2x" @click='exit' style="color:#fff;margin-right:15px;"></i>
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
            popper-class="noselect"
            @change="getTimeCheck"
            style="margin-left:15px"
            :clearable="false">
          </el-date-picker>
          <el-switch
            v-model="corekeys"
            active-color="#4b78cd"
            inactive-color="#eacece"
            style="margin-left:15px"
            @change="searchData()">
          </el-switch>
        </div>
        <el-row>
          <el-col :span="24" style="padding:0 15px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane :label="corekeys ? 'Crash概况(核心用户)' : 'Crash概况'" name="first">
                <p style="margin:0;margin-bottom:10px;color:#409eff;" v-if="corekeys">核心用户包含：集团公司领导，党委办公室领导</p>
                <h3 style="margin:0">Crash情况</h3>
                <el-row style="margin-bottom:20px">
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;" class="crash">
                      Crash率
                      <span v-if="crashbl===null" class="crashchild1">0<span>0</span></span>
                      <span v-else-if="Number(crashbl.android_crash_rate)+Number(crashbl.ios_crash_rate) > 0.05" style="color:red" class="crashchild1">{{crashbl.android_crash_rate}}%<span>{{crashbl.ios_crash_rate}}%</span></span>
                      <span v-else class="crashchild1">{{crashbl.android_crash_rate}}%<span>{{crashbl.ios_crash_rate}}%</span></span>
                    </h3>
                    <div ref="crashlv" id="crashlv" style="width:100%;height:230px;" v-loading = 'crashlvloading'></div>
                  </el-col>
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;"  class="crash">Crash数
                      <span v-if="crashnum===null" class="crashchild">0<span>0</span></span>
                      <span v-else-if='Number(crashnum.android)+Number(crashnum.ios)>30' style="color:red" class="crashchild">
                        <span v-if="crashnum.hasOwnProperty('android')">{{crashnum.android}}</span>
                        <span v-else-if="!('android' in crashnum)  ">0</span>
                        <span v-if="crashnum.hasOwnProperty('ios')">{{crashnum.ios}}</span>
                        <span v-else-if="!('ios' in crashnum)  ">0</span>
                        <!-- <span>{{crashnum.ios}}</span> -->
                      </span>
                      <span v-else class="crashchild">
                        <span v-if="crashnum.hasOwnProperty('android')">{{crashnum.android}}</span>
                        <span v-else-if="!('android' in crashnum)  ">0</span>
                        <span v-if="crashnum.hasOwnProperty('ios')">{{crashnum.ios}}</span>
                        <span v-else-if="!('ios' in crashnum)  ">0</span>
                      </span>
                    </h3>
                    <div ref="crashnum" id="crashnum" style="width:100%;height:230px;" v-loading ='crashnumloading'></div>
                  </el-col>
                </el-row>
                <h3 style="margin:5px 0;">影响用户数:
                  <span v-if="Number(Influencenum.android)+Number(Influencenum.ios) > 30" style="color:red">{{ Number(Influencenum.android)+Number(Influencenum.ios)}}</span>
                  <span v-else style="color:black">{{ Number(Influencenum.android)+Number(Influencenum.ios)}}</span>
                </h3>
                
                <el-row style="margin-bottom:20px;" :style="{'margin-bottom': (corekeys? 20 + 'px' : 40+ 'px')}">
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;">Android影响用户:
                      <span v-if="!Influencenum.android">0</span>
                      <span v-else-if="Number(Influencenum.android)+Number(Influencenum.ios) > 30" style="color:red">{{Influencenum.android}}</span>
                      <span v-else style="color:black">{{Influencenum.android}}</span>
                    </h3>
                    <div style="background-color: white;width:100%;height:330px; overflow-y:auto;" class="renwu" v-loading='infand'> 
                      <div id="androidinfluence" style="width:100%;height:330px"></div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;">iOS影响用户:
                      <span v-if="!Influencenum.ios">0</span>
                      <span v-else-if="Number(Influencenum.android)+Number(Influencenum.ios) > 30" style="color:red">{{Influencenum.ios}}</span>
                      <span v-else style="color:black">{{Influencenum.ios}}</span>
                    </h3>
                    <div style="background-color: white;width:100%;height:330px; overflow-y:auto;" class="renwu" v-loading='infios'> 
                      <div id="iosinfluence" style="width:100%;height:330px;"></div>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane :label="corekeys ? '崩溃类型(核心用户)' : '崩溃类型'" name="second">
                <p style="margin:0;margin-bottom:10px;color:#409eff;" v-if="corekeys">核心用户包含：集团公司领导，党委办公室领导</p>
                <h3 style="margin:0;">新增崩溃数</h3>
                <el-checkbox-group v-model="checkList" @change='datalist' style="margin-bottom:15px;margin-top:10px;">
                  <el-checkbox label="android">Android:&nbsp;&nbsp;{{collapse.android}}</el-checkbox>
                  <el-checkbox label="ios">iOS:&nbsp;&nbsp;{{collapse.ios}}</el-checkbox>
                </el-checkbox-group>
                <el-row>
                  <el-col :span='24'>
                     <el-table :data="tableData.slice((pageIndex-1)*pageSize,pageIndex*pageSize)" border style="width: 100%;margin-bottom:30px;"
                     @sort-change="changeOrder">
                      <el-table-column type="index" label="序号" width="100" align="center" sortable="custom">
                      </el-table-column>
                      <el-table-column prop="1" label="终端型号" width="180" align="center">
                      </el-table-column>
                      <el-table-column prop="6" label="crashID" width="150" align="center">
                      </el-table-column>
                      <el-table-column prop="2" label="系统版本" align="center" width="150">
                      </el-table-column>
                      <el-table-column prop="3" label="App版本" align="center" width="150">
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
              <el-tab-pane label="Crash概况(关注用户)" name="third" v-if="corekeys">
                <p style="margin:0;margin-bottom:10px;color:#409eff;" v-if="corekeys">关注用户包含：集团公司领导，党委办公室领导，总部一级部门正职领导，分公司正职领导</p>
                <h3 style="margin:0">Crash情况</h3>
                <el-row style="margin-bottom:20px">
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;width:100%;" class="crashthird">
                      Crash率
                      <span v-if="crashbl===null" class="crashchild1">0<span>0</span></span>
                      <span v-else-if="Number(crashbl.android_crash_rate)+Number(crashbl.ios_crash_rate) > 0.05" style="color:red" class="crashchild1">{{crashbl.android_crash_rate}}%<span>{{crashbl.ios_crash_rate}}%</span></span>
                      <span v-else class="crashchild1">{{crashbl.android_crash_rate}}%<span>{{crashbl.ios_crash_rate}}%</span></span>
                    </h3>
                    <div ref="crashlvimport" id="crashlvimport" style="width:100%;height:230px;" v-loading = 'crashlvloading'></div>
                  </el-col>
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;width:100%;"  class="crashthird">Crash数
                      <span v-if="crashnum===null" class="crashchild">0<span>0</span></span>
                      <span v-else-if='Number(crashnum.android)+Number(crashnum.ios)>30' style="color:red" class="crashchild">
                        <span v-if="crashnum.hasOwnProperty('android')">{{crashnum.android}}</span>
                        <span v-else-if="!('android' in crashnum)  ">0</span>
                        <span v-if="crashnum.hasOwnProperty('ios')">{{crashnum.ios}}</span>
                        <span v-else-if="!('ios' in crashnum)  ">0</span>
                        <!-- <span>{{crashnum.ios}}</span> -->
                      </span>
                      <span v-else class="crashchild">
                        <span v-if="crashnum.hasOwnProperty('android')">{{crashnum.android}}</span>
                        <span v-else-if="!('android' in crashnum)  ">0</span>
                        <span v-if="crashnum.hasOwnProperty('ios')">{{crashnum.ios}}</span>
                        <span v-else-if="!('ios' in crashnum)  ">0</span>
                      </span>
                    </h3>
                    <div ref="crashnumthird" id="crashnumthird" style="width:100%;height:230px;" v-loading ='crashnumloading'></div>
                  </el-col>
                </el-row>
                <h3 style="margin:5px 0;">影响用户数:
                  <span v-if="Number(Influencenum.android)+Number(Influencenum.ios) > 30" style="color:red">{{ Number(Influencenum.android)+Number(Influencenum.ios)}}</span>
                  <span v-else style="color:black">{{ Number(Influencenum.android)+Number(Influencenum.ios)}}</span>
                </h3>
                <el-row style="margin-bottom:20px;">
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;">Android影响用户:
                      <span v-if="!Influencenum.android">0</span>
                      <span v-else-if="Number(Influencenum.android)+Number(Influencenum.ios) > 30" style="color:red">{{Influencenum.android}}</span>
                      <span v-else style="color:black">{{Influencenum.android}}</span>
                    </h3>
                    <div style="background-color: white;width:100%;height:330px; overflow-y:auto;" class="renwu" v-loading='infand'> 
                      <div id="androidinfluencethird" style="width:100%;height:330px"></div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <h3 style="margin:0;padding:0;text-align:center;margin-bottom:15px;">iOS影响用户:
                      <span v-if="!Influencenum.ios">0</span>
                      <span v-else-if="Number(Influencenum.android)+Number(Influencenum.ios) > 30" style="color:red">{{Influencenum.ios}}</span>
                      <span v-else style="color:black">{{Influencenum.ios}}</span>
                    </h3>
                    <div style="background-color: white;width:100%;height:330px; overflow-y:auto;" class="renwu" v-loading='infios'> 
                      <div id="iosinfluencethird" style="width:100%;height:330px;"></div>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="崩溃类型(关注用户)" name="four" v-if="corekeys">
                <p style="margin:0;margin-bottom:10px;color:#409eff;" v-if="corekeys">关注用户包含：集团公司领导，党委办公室领导，总部一级部门正职领导，分公司正职领导</p>
                <h3 style="margin:0;">新增崩溃数</h3>
                <el-checkbox-group v-model="checkList" @change='datalist' style="margin-bottom:15px;margin-top:10px;">
                  <el-checkbox label="android">Android:&nbsp;&nbsp;{{collapse.android}}</el-checkbox>
                  <el-checkbox label="ios">iOS:&nbsp;&nbsp;{{collapse.ios}}</el-checkbox>
                </el-checkbox-group>
                <el-row>
                  <el-col :span='24'>
                     <el-table :data="tableData.slice((pageIndex-1)*pageSize,pageIndex*pageSize)" border style="width: 100%;margin-bottom:30px;"
                     @sort-change="changeOrder">
                      <el-table-column type="index" label="序号" width="100" align="center" sortable="custom">
                      </el-table-column>
                      <el-table-column prop="1" label="终端型号" width="180" align="center">
                      </el-table-column>
                      <el-table-column prop="6" label="crashID" width="150" align="center">
                      </el-table-column>
                      <el-table-column prop="2" label="系统版本" align="center" width="150">
                      </el-table-column>
                      <el-table-column prop="3" label="App版本" align="center" width="150">
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
        <!-- <el-row style="text-align:center;margin-top:50px;display:flex;justify-content: center;">
          <el-button style="color:#fff;background-color:#4b78cd;border:none;margin-bottom:30px;" @click="exit">关闭</el-button>
        </el-row> -->
    </div>
</template>

<script>
import echarts from 'echarts'
import {systemlogStatis} from '@/api/modules/all'

import {getcrashnumsummary, getcrashratesummary, getcrashuvsummary, getnewcrashnumsummary, getcrashnumdetail, getcrashratedetail, getandroiduvitemdata, getiosuvitemdata, getnewcrashdetail} from '@/api/newEhomeJS/crashdata'
export default {
  data () {
    return {
      changeTime: [],
      defarr: [],
      activeName: 'first',
      Influencenum: {
        android: 0,
        ios: 0
      },
      checkList: ['android', 'ios'],
      tableData: [],
      // 崩溃数
      collapse: {},
      pageSize: 10,
      pageIndex: 1,
      crashbl: {
        ios_crash_rate: 0,
        android_crash_rate: 0
      },
      crashnum: {},
      crashlvloading: true,
      crashnumloading: true,
      infand: true,
      infios: true,
      allHourtime: [],
      core: '0',
      corekeys: false
    }
  },
  created () {
    this.changeTime = [this.$route.query.stime, this.$route.query.etime]
    let HH = new Date().getHours() + ':00:00'
    // console.log(HH)
    this.getallHour(this.changeTime[0], this.changeTime[1])

    let defaultarr = [HH, HH]
    this.defarr = defaultarr
    if (this.$route.query.isKey === true || this.$route.query.isKey === 'true') {
      // console.log(111)
      this.core = '1'
      this.corekeys = true
    }
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
    if (this.activeName === 'first' || this.activeName === 'third') {
      this.getcrashdata()
    } else {
      this.getbkdata()
    }
  },
  // watch: {
  //   corekeys: function (val) {
  //     console.log(val)
  //   }
  // },
  methods: {
    searchData () {
      if (this.corekeys === true) {
        this.core = '1'
      } else if (this.corekeys === false) {
        this.core = '0'
      }
      this.crashbl.ios_crash_rate = 0
      this.crashbl.android_crash_rate = 0
      this.activeName = 'first'
      if (this.activeName === 'first' || this.activeName === 'third') {
        this.getcrashdata()
      } else {
        this.getbkdata()
      }
    },
    exit () {
      const row = {
        stime: this.$route.query.stime,
        etime: this.$route.query.etime,
        isKey: this.$route.query.isKey
      }
      this.$router.push({path: '/newEhome', query: row})
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      // this.getbkdata()
    },
    // // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      // this.getbkdata()
    },
    // 切换时间
    getTimeCheck (val) {
      // console.log(val)
      this.changeTime = val
      this.getallHour(val[0], val[1])
      if (this.activeName === 'first' || this.activeName === 'third') {
        this.getcrashdata()
      } else {
        this.getbkdata()
      }
    },
    datalist (val) {
      // console.log(val)
      this.getbkdata()
    },
    handleClick (tab, event) {
      // console.log(this.activeName)
      this.pageSize = 10
      this.pageIndex = 1
      if (this.activeName === 'first' || this.activeName === 'third') {
        this.getcrashdata()
      } else {
        this.getbkdata()
      }
    },
    getallHour (stime, etime) {
      let date1 = stime
      let date2 = etime
      date1 = date1.replace(new RegExp(/-/gm), '/')
      date2 = date2.replace(new RegExp(/-/gm), '/')
      let d = new Date(date1)
      let d2 = new Date(date2)
      let arr = []
      while (d <= d2) {
        arr.push([d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-'))
        d.setHours(d.getHours() + 1)
      }
      // console.log(date1)
      // console.log(date2)
      Array.from(new Set()) // 利用es6特性去重方法
      // [...new Set(arr)]
      this.allHourtime = [...new Set(arr)]
      // this.allHourtime.pop()
      // console.log(this.allHourtime)
    },
    getbuchongTime (loginobj) {
      let rowsArr = []
      let reqArr = []
      // if (loginobj.timeList.length > 0) {
      // console.log(this.allHourtime)
      for (let i = 0; i < this.allHourtime.length; i++) {
        let index = loginobj.time.findIndex((value, index, arr) => {
          return value.includes(this.allHourtime[i])
        })
        if (index === -1) {
          rowsArr.push(0)
          reqArr.push(0)
        } else {
          rowsArr.push(loginobj.num[index])
          reqArr.push(loginobj.crashnum[index])
        }
      }
      // }
      loginobj.time = this.allHourtime
      loginobj.num = rowsArr
      loginobj.crashnum = reqArr
    },
    getcrashdata () {
      this.tableData = []
      this.Influencenum = {}
      let obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1],
        api_name: 'android',
        core: this.core,
        activeName: this.activeName
      }
      // crash数
      getcrashnumsummary(obj).then(res => {
        // console.log(res.data.data)
        let alldata = {}
        if (alldata === null) {
          this.crashnum = {}
        } else {
          this.crashnum = res.data.data
          // console.log(111)
        }
      })
      // console.log(obj)

      // crash率
      obj.api_name = 'andriod'
      this.crashbl = {}
      // getcrashratesummary(obj).then(res => {
        // console.log(res.data.data)
        // this.crashbl = res.data.data
        // if (this.crashbl.android_crash_rate === 'Infinity' || this.crashbl.android_crash_rate === 'Infinity') {
        //   this.crashbl.android_crash_rate = 0
        //   this.crashbl.ios_crash_rate = 0
        // }
        // if (this.crashbl.hasOwnProperty('ios') && this.crashbl.hasOwnProperty('iosPv')) {
        //   this.crashbl.ios_crash_rate = Number(this.crashbl.ios * 100 / this.crashbl.iosPv).toFixed(2)
        // } else {
        //   this.crashbl.ios_crash_rate = 0
        // }
        // if (this.crashbl.hasOwnProperty('android') && this.crashbl.hasOwnProperty('andPv')) {
        //   this.crashbl.android_crash_rate = Number(this.crashbl.android * 100 / this.crashbl.andPv).toFixed(2)
        // } else {
        //   this.crashbl.android_crash_rate = 0
        // }
      // })
      // crash数率
      obj.api_name = 'ios'
      getcrashratedetail(obj).then(resios => {
        this.crashbl.ios_crash_rate = 0
        let iosList = {}
        if (resios.data === null) {
          iosList.dataList = [0]
          this.crashbl.ios_crash_rate = 0
        } else {
          iosList = resios.data.data
          this.getbuchongTime(iosList)
          // console.log(iosList)
          let timeArr = iosList.time
          let numArr = iosList.num
          let crashnumArr = iosList.crashnum
          let blArr = []
          let acrashRen = 0
          let acrashPv = 0
          for (let i = 0; i < timeArr.length; i++) {
            let num = Number(numArr[i])
            let crashmum = Number(crashnumArr[i])
            acrashRen = acrashRen + crashmum
            acrashPv = acrashPv + num
            if (num !== 0) {
              let bl = ((crashmum / num) * 100).toFixed(3) - 0
              blArr.push(bl)
            } else {
              blArr.push(0)
            }
          }
          if (acrashRen === 0 || acrashPv === 0) {
            this.$set(this.crashbl, 'ios_crash_rate', 0)
          } else {
            // if (numArr.length > 1) {
            //   acrashPv = acrashPv - numArr[numArr.length - 1]
            // }
            let blAll = Number(acrashRen * 100 / acrashPv).toFixed(3) - 0
            this.$set(this.crashbl, 'ios_crash_rate', blAll)
            // console.log(this.crashbl.ios_crash_rate)
          }
          iosList.dataList = blArr
        }
        obj.api_name = 'android'
        getcrashratedetail(obj).then(resandroid => {
          this.crashlvloading = false

          // console.log(resandroid.data)
          let androidList = {}
          let acrashRen = 0
          let acrashPv = 0
          if (resandroid.data === null) {
            // console.log(12123)
            androidList.dataList = [0]
            this.$set(this.crashbl, 'android_crash_rate', 0)
            androidList.timeList[0] = this.changeTime[0]
          } else {
            androidList = resandroid.data.data
            this.getbuchongTime(androidList)
            // console.log(androidList)
            let timeArr = androidList.time
            let numArr = androidList.num
            let crashnumArr = androidList.crashnum
            let blArr = []
            for (let i = 0; i < timeArr.length; i++) {
              let num = Number(numArr[i])
              let crashmum = Number(crashnumArr[i])
              acrashRen = acrashRen + crashmum
              acrashPv = acrashPv + num
              if (num !== 0) {
                let bl = ((crashmum / num) * 100).toFixed(3) - 0
                blArr.push(bl)
              } else {
                blArr.push(0)
              }
            }
            if (acrashRen === 0 || acrashPv === 0) {
              this.$set(this.crashbl, 'android_crash_rate', 0)
            } else {
              // if (numArr.length > 1) {
              //   acrashPv = acrashPv - numArr[numArr.length - 1]
              // }
              let bllast = Number(acrashRen * 100 / acrashPv).toFixed(3) - 0
              this.$set(this.crashbl, 'android_crash_rate', bllast)
            }
            androidList.dataList = blArr
            androidList.timeList = timeArr
          }
          // let androidList = resandroid.data.data
          let data = {
            iosList: iosList.dataList,
            androidList: androidList.dataList,
            timeList: androidList.timeList,
            markLine: 0.05
          }
          // console
          if (this.activeName === 'first') {
            this.echartcrashbl('crashlv', data)
          } else {
            this.echartcrashbl('crashlvimport', data)
          }
        })
      })
      // 影响用户数
      getcrashuvsummary(obj).then(res => {
        // console.log(res)
        if (res.data.data !== null) {
          this.Influencenum = res.data.data
          if (!this.Influencenum.hasOwnProperty('ios')) {
            this.Influencenum.ios = 0
          }
          if (!this.Influencenum.hasOwnProperty('android')) {
            this.Influencenum.android = 0
          }
        }
      })
      // 影响安卓用户数
      getandroiduvitemdata(obj).then(res => {
        // console.log(res.data.data)
        res.data.data.info = 'Android'
        this.infand = false
        if (this.activeName === 'first') {
          this.drawHBar('androidinfluence', res.data.data)
        } else {
          this.drawHBar('androidinfluencethird', res.data.data)
        }
      })
      // 影响IOS用户数
      getiosuvitemdata(obj).then(res => {
        // console.log(res.data.data)
        res.data.data.info = 'IOS'
        this.infios = false
        if (this.activeName === 'first') {
          this.drawHBar('iosinfluence', res.data.data)
        } else {
          this.drawHBar('iosinfluencethird', res.data.data)
        }
      })
      // this.getbkdata()
      this.getcrashnumdata()
    },
    // 切换安卓和ios的表格数据
    getbkdata () {
      let obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1],
        core: this.core,
        activeName: this.activeName
      }
      getnewcrashnumsummary(obj).then(res => {
        // console.log(res.data.data)
        this.collapse = res.data.data
        if (!this.collapse.hasOwnProperty('ios')) {
          this.collapse.ios = 0
        }
        if (!this.collapse.hasOwnProperty('android')) {
          this.collapse.android = 0
        }
      })
      if (this.checkList.length === 2) {
        obj.device = 'ios'
        getnewcrashdetail(obj).then(res => {
          let iosdata = res.data.data
          // console.log(iosdata)
          obj.device = 'android'
          getnewcrashdetail(obj).then(res => {
            let androiddata = res.data.data
            // console.log(androiddata)
            let tabledata = [...iosdata, ...androiddata]
            // console.log(tabledata)
            this.tableData = tabledata
          })
        })
      } else if (this.checkList.length === 1) {
        obj.device = this.checkList[0]
        getnewcrashdetail(obj).then(res => {
          let data = res.data.data
          this.tableData = data
        })
      } else if (this.checkList.length === 0) {
        this.tableData = []
      }
    },
    // crash数的数据
    getcrashnumdata () {
      let obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1],
        api_name: 'android',
        core: this.core,
        activeName: this.activeName
      }
      getcrashnumdetail(obj).then(responsean => {
        // console.log(responsean.data.data)
        let android = responsean.data.data
        if (responsean.data.data.dataList.length === 0) {
          responsean.data.data.dataList = [0]
          responsean.data.data.timeList[0] = this.changeTime[0]
        }
        // console.log(responsean)
        // this.getbuchongTime(android)
        obj.api_name = 'ios'
        getcrashnumdetail(obj).then(responseios => {
          // console.log(responseios.data.data)
          this.crashnumloading = false
          if (responseios.data.data.dataList.length === 0) {
            responseios.data.data.dataList = [0]
            responseios.data.data.timeList[0] = this.changeTime[0]
          }
          let ios = responseios.data.data
          // this.getbuchongTime(ios)
          let time = []
          if (android.timeList.length > ios.timeList.length) {
            time = android.timeList
          } else {
            time = ios.timeList
          }

          let data = {
            iosList: ios.dataList,
            androidList: android.dataList,
            timeList: time,
            markLine: 30
            // annum: alldata.android,
            // iosnum: alldata.ios
          }
          // console.log(data)
          if (this.activeName === 'first') {
            this.echartcrashnum('crashnum', data)
          } else {
            this.echartcrashnum('crashnumthird', data)
          }
        })
      })
    },
    echartcrashnum (id, obj) {
      document.getElementById(id).style.width = (document.querySelector('.esaltime').offsetWidth) / 2 + 'px'
      let myChart = echarts.init(document.getElementById(id))
      // console.log(obj.timeList.length)
      for (let i = 0; i < obj.timeList.length; i++) {
        obj.timeList[i] = obj.timeList[i].substr(0, 19)
      }
      if (obj.markLine) {
        for (let i = 0; i < obj.androidList.length; i++) {
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
          x: '38%',
          data: ['Android:            ', 'iOS:         ']
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
            name: 'iOS:         ',
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
      myChart.resize()
    },
    echartcrashbl (id, obj) {
      document.getElementById(id).style.width = (document.querySelector('.esaltime').offsetWidth) / 2 + 'px'
      let myChart = echarts.init(document.getElementById(id))
      // console.log(obj)
      obj.markLinecolor = 'transparent'
      if (obj.markLine) {
        // console.log(obj.markLine)
        for (let i = 0; i < obj.iosList.length; i++) {
          if (Number(obj.iosList[i]) > obj.markLine) {
            // console.log(Number(obj.iosList[i]))
            obj.markLinecolor = 'red'
          }
        }
        for (let j = 0; j < obj.androidList.length; j++) {
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
          data: ['Android:                 ', 'iOS:          ']
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
              // interval: Math.floor((obj.timeList.length) / 6),
              interval: 'auto',
              // interval: obj.dataList.length / 6,
              // interval: 4
              // rotate: 10
              formatter: function (value) {
                return value.split(' ')[0] + '\n' + '00:00:00'
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
                color: 'rgba(75, 120, 205, 1)',
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
            name: 'iOS:          ',
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
      myChart.resize()
    },
    drawHBar (id, obj) {
      // console.log(obj)
      // let zommFlag = false
      // let aa = 100
      // if (obj.hasOwnProperty('userList') && obj.userList.length > 10) {
      //   zommFlag = true
      //   aa = 10 / obj.userList.length * 100
      // }
      for (let i = 0; i < obj.userList.length; i++) {
        if (obj.userList[i] === 'None' || obj.userList[i] === 'none') {
          obj.userList[i] = '未登录用户'
        }
      }
      // document.getElementById(id).style.height = 0 + 'px'
      document.getElementById(id).style.width = (document.querySelector('.esaltime').offsetWidth) / 2 - 25 + 'px'

      if (obj.userList.length >= 20) {
        document.getElementById(id).style.height = (obj.userList.length * 30) + 'px'
      } else if (obj.userList.length >= 15) {
        document.getElementById(id).style.height = (obj.userList.length * 30) + 'px'
      } else {
        document.getElementById(id).style.height = 330 + 'px'
      }
      let myChart = echarts.init(document.getElementById(id))
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
          right: '8%',
          bottom: '1%',
          containLabel: true
        },
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     show: zommFlag,
        //     yAxisIndex: [0],
        //     start: 0,
        //     end: aa
        //   },
        //   {
        //     type: 'inside',
        //     yAxisIndex: [0]
        //   }
        // ],
        xAxis: {
          type: 'value',
          minInterval: 1
        },
        yAxis: {
          type: 'category',
          data: obj.userList,
          axisLabel: {
            interval: 0
          }
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
            barWidth: 20,
            // barMaxWidth: 30,
            data: obj.crashCountList
          }
        ]
      }, true)
      myChart.resize()
    },
    changeOrder (column, prop, order) {
      let key = column.prop - 0
      // let oo = column.order
      // console.log(key)
      // console.log(oo)
      if (key !== 0) {
        this.tableData.sort(function (obj1, obj2) {
          let val1 = 0
          let val2 = 0
          if (obj1[key] !== null && obj2[key] !== null) {
            if (key === 2) {
              if (obj1[key].replace(' ', '').split(',')[0] === 'iOS') {
                obj1[key].split(',')[0] = 10
                let a = obj1[key].replace(' ', '').split(',')[1]
                let b = a.split('.').join('')
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
        // margin-top: 44px;
      .saltitle{
        height: 34px;
        background-color: #4b78cd;
        margin: 10px 0;
        line-height: 34px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      h3{
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
          left:36%;
          span{
            margin-left: 120px;
          }
        }
        .crashchild1{
          position: absolute;
          bottom:-32px;
          left:46%;
          span{
            margin-left: 100px;
          }
        }
      }

      .crashthird{
        position: relative;
        .crashchild{
          position: absolute;
          bottom:-32px;
          left:36%;
          span{
            margin-left: 120px;
          }
        }
        .crashchild1{
          position: absolute;
          bottom:-32px;
          left:46%;
          span{
            margin-left: 100px;
          }
        }
      }
</style>

<style>
.renwu::-webkit-scrollbar {
  display: block;
}
.crashdata .el-table td{
  padding: 0;
}
</style>

<style lang="scss">
  .crashdata .el-tabs__item{
    width: 150px;
  }
  .crashdata .el-tabs__item.is-active{
    border-bottom: 2px solid #409EFF;
  }
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .noselect .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-top: 0px !important;
  }
  .abc{
    margin-bottom:40px;
  }
</style>