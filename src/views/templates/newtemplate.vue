<template>
    <div class="tempstyle">
      <!-- <div>{{senddata.projectid}}</div> -->
        <el-row style="margin-top:15px;" class="etit">
          <el-col :span="4" class="elog">
              <div class="titlogbox" style="display:flex;cursor:pointer" @click="changeversionpage">
                  <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                    <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{titlog.clover}}</p>
                  </div>
                  <div class="right" style="flex:1">
                    <span class="fa fa-bank (alias) fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                  </div>
              </div>
                <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">已上线版本</p>
          </el-col>
          <el-col :span="4" class="elog">
              <div class="titlogbox" style="display:flex;cursor:pointer" @click="changeneedpage">
                  <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                    <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{titlog.allreq}}</p>
                  </div>
                  <div class="right" style="flex:1">
                    <span class="fa fa-bell fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                  </div>
              </div>
                    <p style="margin:0;padding:0 0 0 13px;width:100%;;height:30px;line-height:30px;">需求(总计)</p>
          </el-col>
          <el-col :span="4" class="elog">
              <div class="titlogbox" style="display:flex;cursor:pointer" @click="needlist">
                  <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                    <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{titlog.nbreq}}</p>
                  </div>
                  <div class="right" style="flex:1">
                    <span class="fa fa-puzzle-piece fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                  </div>
              </div>
                <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">内部需求(总计)</p>
          </el-col>
          <el-col :span="4" class="elog">
              <div class="titlogbox" style="display:flex;cursor:pointer" @click="changedefect">
                  <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                    <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{titlog.bug}}</p>
                  </div>
                  <div class="right" style="flex:1">
                    <span class="fa fa-bug fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                  </div>
              </div>
                    <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">缺陷(关闭/总计)</p>
          </el-col>
          <el-col :span="4" class="elog">
              <div class="titlogbox" style="display:flex;cursor:pointer" @click="changeproline">
                  <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                    <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{titlog.scfk}}</p>
                  </div>
                  <div class="right" style="flex:1">
                    <span class="fa fa-question-circle fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                  </div>
              </div>
                    <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;font-size:12px;">产线问题(关闭/新增)</p>
          </el-col>
          <el-col :span="4" class="elog">
              <div class="titlogbox" style="display:flex;cursor:pointer" @click="changetask">
                  <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                    <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{titlog.task}}</p>
                  </div>
                  <div class="right" style="flex:1">
                    <span class="fa fa-tasks fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                  </div>
              </div>
                    <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">任务&nbsp;&nbsp;(测试/开发)</p>
          </el-col>
          <el-col :span="4" class="elog">
              <div class="titlogbox" style="display:flex;cursor:pointer" @click="changeredmine">
                  <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                    <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{titlog.wg}}</p>
                  </div>
                  <div class="right" style="flex:1">
                    <span class="fa fa-times-circle fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                  </div>
              </div>
                    <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">Redmine不规范</p>
          </el-col>
        </el-row>

        <div class="nocloseneed">
            <p>未提测需求</p>
            <div id="nocloseneed" ref="nocloseneed" style="width:100%;height:220px;margin:auto;"></div>
        </div>

        <div class="proabout">
            <div class="left">
                <p>产线问题</p>
                <div id="proline" ref="proline" style="width:100%;height:220px;margin:auto;"></div>
            </div>
            <div class="right">
                <p>Redmine不规范--项目</p>
                <div id="redmine" ref="redmine" style="width:100%;height:220px;margin:auto;"></div>
            </div>
        </div>

        <div class="itemjd">
            <p style="margin:0;padding:13px 0 0 15px;font-size:16px;font-weight:700;">项目进度</p>
            <div class="itemhead">
                <div class="left"></div>
                <div class="right">
                    <div class="titleitemname">
                      <span>版本进度</span><br>
                      <span style="font-size:12px">(上线&nbsp;/&nbsp;总数)</span>
                    </div>
                    <div class="titleitemname">
                      <span>需求进度</span><br>
                      <span style="font-size:12px">(完成&nbsp;/&nbsp;总数)</span>                                  
                    </div>
                    <div class="titleitemname">
                      <span>开发进度</span><br>
                      <span style="font-size:12px">(完成&nbsp;/&nbsp;总数)</span>                  
                    </div>
                    <div class="titleitemname">
                      <span>测试进度</span><br>
                      <span style="font-size:12px">(完成&nbsp;/&nbsp;总数)</span>                  
                    </div>
                    <div class="titleitemname">
                      <span>Bug修复率</span><br>
                      <span style="font-size:12px">(修复&nbsp;/&nbsp;总数)</span>                                  
                    </div>
                    <div class="titleitemname">
                      <span>产线问题</span><br>
                      <span style="font-size:12px">(关闭&nbsp;/&nbsp;新增)</span>                                  
                    </div>
                    <div class="titleitemname">
                      <span>Redmine不规范</span><br>
                      <span style="font-size:12px">(违规&nbsp;/&nbsp;违规总计)</span>                                  
                    </div>
                </div>
            </div>
            <div class="scrollcont">
                <div class="itemcontent" v-for="(item, index) in itemrate" :key="index">
                    <div class="leftcontent" @click="goQualityPort(item)">{{item.projectName}}</div>
                    <div class="rightcontent">
                        <div class="itemintro">
                            <div class="iteminfo">{{item.closeVersion}}/{{item.allVersion}}</div>
                            <div class="iteminfo">{{item.reqclose}}/{{item.reqTotal}}</div>
                            <div class="iteminfo">{{item.kfclose}}/{{item.kfTotal}}</div>
                            <div class="iteminfo">{{item.csclose}}/{{item.csTotal}}</div>
                            <div class="iteminfo">{{item.bugclose}}/{{item.bugTotal}}</div>
                            <div class="iteminfo">{{item.scfkclose}}/{{item.scfkTotal}}</div>
                            <div class="iteminfo">{{item.wgNum}}/{{item.allNum}}</div>
                        </div>
                        <div class="itemlog" @click="goQualityPort(item)">
                            <!-- <div class="itembox"> -->
                                <div class="box" v-if="item.versioninfo === 'wu'">无任务</div>
                                <el-progress v-else :percentage='item.versioninfo-0' :stroke-width="30" :text-inside='true' class="first"></el-progress>
                                <div class="box" v-if="item.reqinfo === 'wu'">无任务</div>
                                <el-progress v-else :percentage='item.reqinfo-0' :stroke-width="30" :text-inside='true' class="second"></el-progress>
                                <div class="box" v-if="item.kfinfo === 'wu'">无任务</div>
                                <el-progress v-else :percentage='item.kfinfo-0' :stroke-width="30" :text-inside='true' class="first"></el-progress>
                                <div class="box" v-if="item.csinfo === 'wu'">无任务</div>
                                <el-progress v-else :percentage='item.csinfo-0' :stroke-width="30" :text-inside='true' class="second"></el-progress>
                                <div class="box" v-if="item.buginfo === 'wu'">无任务</div>
                                <el-progress v-else :percentage='item.buginfo-0' :stroke-width="30" :text-inside='true' class="first"></el-progress>
                                <!-- 假数据布局 -->
                                <div class="box" v-if="item.scfkinfo === 'wu'">无任务</div>
                                <el-progress v-else :percentage='item.scfkinfo-0' :stroke-width="30" :text-inside='true' class="second"></el-progress>
                                <div class="box" v-if="item.redmininfo === 'wu'">无任务</div>
                                <el-progress v-else :percentage='item.redmininfo-0' :stroke-width="30" :text-inside='true' class="first"></el-progress>
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import {getTotalMessage, getProjectRate, getUnTcReq, getScfkEchartsDatas, getStandardForProject} from '@/api/xyzqPort/template.js'

export default {
  data () {
    return {
      // 顶部log数据
      titlog: {},
      // 项目进度数据
      itemrate: []
    }
  },
  props: {
    senddata: {
      changeTime: [],
      projectid: [],
      iteminfo: [],
      allitem: []
    }
  },
  mounted () {
    this.getdata()
    // this.echartsdemandline('nocloseneed')
    // this.echartsitemport('proline')
    // this.echartsredminitem('redmine')
  },
  methods: {
    // 获取标题的数据
    // 跳转到需求二级页面
    changeneedpage () {
      var proid = this.senddata.projectid.join(',')
      const row = {
        project_id: proid,
        type: '',
        stime: this.senddata.changeTime[0],
        etime: this.senddata.changeTime[1],
        status: 0,
        activeName: 'second'
      }
      this.$router.push({path: '/needlist', query: row})
    },
    needlist () {
      var proid = this.senddata.projectid.join(',')
      const row = {
        project_id: proid,
        type: '2',
        activeName: 'second',
        stime: this.senddata.changeTime[0],
        etime: this.senddata.changeTime[1]
      }
      console.log(row)
      this.$router.push({path: '/needlist', query: row})
    },
    // 跳转到上线版本的二级页面
    changeversionpage () {
      var proid = this.senddata.projectid.join(',')
      const row = {
        project_id: proid,
        activeName: 'second',
        stime: this.senddata.changeTime[0],
        etime: this.senddata.changeTime[1]
      }
      this.$router.push({path: '/eronlineversion', query: row})
    },
    changedefect () {
      var proid = this.senddata.projectid.join(',')
      const row = {
        project_id: proid,
        activeName: 'second',
        stime: this.senddata.changeTime[0],
        etime: this.senddata.changeTime[1]
      }
      this.$router.push({path: '/newdefect', query: row})
      // this.$router.push('/newdefect')
    },
    changeproline () {
      var proid = this.senddata.projectid.join(',')
      const row = {
        project_id: proid,
        activeName: 'second',
        stime: this.senddata.changeTime[0],
        etime: this.senddata.changeTime[1]
      }
      this.$router.push({path: '/newerprob', query: row})
    },
    changetask () {
      var proid = this.senddata.projectid.join(',')
      const row = {
        project_id: proid,
        activeName: 'second',
        stime: this.senddata.changeTime[0],
        etime: this.senddata.changeTime[1]
      }
      this.$router.push({path: '/task', query: row})
    },
    changeredmine () {
      // localStorage.removeItem('trackerId')
      // localStorage.removeItem('name')
      // localStorage.removeItem('itemname')
      var proid = this.senddata.projectid.join(',')
      const row = {
        stime: this.senddata.changeTime[0],
        etime: this.senddata.changeTime[1],
        project_id: proid,
        activeName: 'second'
      }
      this.$router.push({path: '/newRedmine', query: row})
    },
    goQualityPort (row) {
      localStorage.setItem('tabIndex', '454')
      var cs = ''
      if (typeof (row.versionid) !== 'undefined' && row.versionid !== null) {
        cs = '&version_id=' + row.versionid
      }
      var urlHost = 'http://' + window.location.host + '/port/#/qualityPort?project_id=' + row.project_id + cs
      window.open(urlHost)
      // this.$router.push({path: '/qualityPort', query: data})
      // this.$router.push('/qualityPort?project_id=' + row.id + '&version_id=' + row.versionid)
    },
    // 未提测需求的echarts
    echartsdemandline (id, obj) {
      var width1 = window.screen.width
      if (width1 > 1280) {
        document.getElementById(id).style.width = 1400 + 'px'
      } else {
        document.getElementById(id).style.width = 1180 + 'px'
      }
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        grid: {
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        legend: {
          x: 'center',
          data: ['新建', '评审完成', '开发中']
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
        xAxis: [
          {
            type: 'category',
            data: obj.projectName,
            // data: ['dsss', 'ggd', 'bbgc', 'xyzq', 'xybd'],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                if (value.length > 4) {
                  return value.substring(0, 4) + '\n' + value.substring(4)
                } else {
                  return value
                }
              }
              // rotate: 15
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'  // 设置刻度地下字体颜色
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
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: '新建',
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
            barMaxWidth: 30,
            data: obj.newReqs
          }, {
            name: '评审完成',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgb(94,189,124)',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 30,
            data: obj.pswcReqs
          }, {
            name: '开发中',
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
            barMaxWidth: 30,
            data: obj.kfReqs
          }
        ]
      }, true)
      myChart.resize()
      // 点击事件
      myChart.getZr().on('click', (params) => {
        // console.log(params)
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          // var checkname = op.yAxis[0].data[xIndex]
          var checkname = op.xAxis[0].data[xIndex]
          console.log(op)
          console.log(xIndex)
          const row = {
            project_id: '',
            activeName: 'second',
            stime: this.senddata.changeTime[0],
            etime: this.senddata.changeTime[1]
          }
          for (let i = 0; i < this.senddata.allitem.length; i++) {
            const element = this.senddata.allitem[i]
            if (element.name === checkname) {
              row.project_id = element.id
            }
          }
          this.$router.push({path: '/needlist', query: row})
        }
      })
    },
    // 产线问题的echarts
    echartsitemport (id, obj) {
      // obj.probug.length <= 5
      // if (obj.probug.length > 10) {
      //   obj.probug = obj.probug.slice(0, 10)
      //   obj.proname = obj.proname.slice(0, 10)
      //   obj.scfknum = obj.scfknum.slice(0, 10)
      // }
      // console.log(obj)
      var width1 = window.screen.width
      // console.log(width1)
      if (width1 > 1280) {
        document.getElementById(id).style.width = 700 + 'px'
      } else {
        document.getElementById(id).style.width = 590 + 'px'
      }
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
        // legend: {
        //   // x: '70%',
        //   y: '10px',
        //   data: ['缺陷', '生产反馈累积待解决']
        //   // selectedMode: true
        // },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '4%',
          top: '20%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            data: obj.projectName,
            // data: obj.proname,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                if (value.length > 5) {
                  return value.substring(0, 5) + '\n' + '...'
                } else {
                  return value
                }
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
                type: 'dashed'
                // width: 20
              }
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
            name: '生产反馈累积待解决',
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
            barMaxWidth: 30,
            // data: obj.scfknum
            data: obj.scfkNums
            // data: obj.count
          }
        ]
      }, true)
      myChart.resize()
      myChart.getZr().on('click', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          var checkname = op.xAxis[0].data[xIndex]
          let typedata = {
            proid: '',
            activeName: 'second'
          }
          this.senddata.allitem.forEach(item => {
            if (item.name === checkname) {
              typedata.proid = item.id
            }
          })
          this.$router.push({path: '/newerprob', query: typedata})
          // console.log(typedata)
        }
      })
    },
    //  redmine---规范的echarts
    echartsredminitem (id, obj) {
      var width1 = window.screen.width
      if (width1 > 1280) {
        document.getElementById(id).style.width = 700 + 'px'
      } else {
        document.getElementById(id).style.width = 590 + 'px'
      }
    //   if (obj.count.length > 10) {
    //     obj.count = obj.count.slice(0, 10)
    //     obj.name = obj.name.slice(0, 10)
    //   }
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
          right: '0%',
          top: '10%',
          bottom: '0%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            data: obj.projectName,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              // rotate: 15,
              formatter: function (value) {
                if (value.length > 4) {
                  return value.substring(0, 4) + '\n' + '...'
                } else {
                  return value
                }
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
            barMaxWidth: 30,
            data: obj.wgs
          }
        ]
      }, true)
      myChart.resize()
      myChart.getZr().on('click', (params) => {
        // console.log(params)
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          var itemname = op.xAxis[0].data[xIndex]
          // console.log(itemname)
          var itemid = ''
          // console.log(this.proinfo)
          this.senddata.allitem.forEach(item => {
            if (item.name === itemname) {
              itemid = item.id
            }
          })
          localStorage.setItem('itemname', itemid)
          localStorage.removeItem('trackerId')
          localStorage.removeItem('name')
          this.$router.push('/erstantard')
        }
      })
    },
    getdata () {
      // console.log(this.senddata)
      // console.log(this.$cookie.get('token'))
      var obj = {
        start_date: this.senddata.changeTime[0],
        end_date: this.senddata.changeTime[1],
        project_ids: this.senddata.projectid.join(','),
        token: this.$cookie.get('token')
      }
      // console.log(obj)
      // 顶部info数据
      getTotalMessage(obj).then(res => {
        // console.log(res.data)
        this.titlog = {}
        if (res.data.result === 'success') {
          this.titlog = res.data
        }
      })
      // 项目进度的e数据
      getProjectRate(obj).then(res => {
        // console.log(res.data.data)
        this.itemrate = []
        if (res.data.result === 'success') {
          this.itemrate = res.data.data
        //   this.itemrate.forEach((item, index) => {
        //   // console.log(this.itemrate)
        // })
          this.itemrate.forEach((item, index) => {
            if (!item.hasOwnProperty('allVersion') || Number(item.allVersion) === 0) {
              item.versioninfo = 'wu'
            } else if (Number(item.closeVersion) === 0) {
              item.versioninfo = 0
            } else {
              item.versioninfo = (Number((Number(item.closeVersion) / Number(item.allVersion)) * 100).toFixed(2))
            }
            if (!item.hasOwnProperty('reqTotal') || Number(item.reqTotal) === 0) {
              item.reqinfo = 'wu'
            } else if (Number(item.reqclose) === 0) {
              item.reqinfo = 0
            } else {
              item.reqinfo = (Number((Number(item.reqclose) / Number(item.reqTotal)) * 100).toFixed(2))
            }
            if (!item.hasOwnProperty('kfTotal') || Number(item.kfTotal) === 0) {
              item.kfinfo = 'wu'
            } else if (Number(item.kfclose) === 0) {
              item.kfinfo = 0
            } else {
              item.kfinfo = (Number((Number(item.kfclose) / Number(item.kfTotal)) * 100).toFixed(2))
            }
            if (!item.hasOwnProperty('csTotal') || Number(item.csTotal) === 0) {
              item.csinfo = 'wu'
            } else if (Number(item.csclose) === 0) {
              item.csinfo = 0
            } else {
              item.csinfo = (Number((Number(item.csclose) / Number(item.csTotal)) * 100).toFixed(2))
            }
            if (!item.hasOwnProperty('bugTotal') || Number(item.bugTotal) === 0) {
              item.buginfo = 'wu'
            } else if (Number(item.bugclose) === 0) {
              item.buginfo = 0
            } else {
              item.buginfo = (Number((Number(item.bugclose) / Number(item.bugTotal)) * 100).toFixed(2))
            }
            if (!item.hasOwnProperty('scfkTotal') || Number(item.scfkTotal) === 0) {
              item.scfkinfo = 'wu'
            } else if (Number(item.scfkclose) === 0) {
              item.scfkinfo = 0
            } else {
              item.scfkinfo = (Number((Number(item.scfkclose) / Number(item.scfkTotal)) * 100).toFixed(2))
            }
            if (!item.hasOwnProperty('allNum') || Number(item.allNum) === 0) {
              item.redmininfo = 'wu'
            } else if (Number(item.wgNum) === 0) {
              item.redmininfo = 0
            } else {
              item.redmininfo = (Number((Number(item.wgNum) / Number(item.allNum)) * 100).toFixed(2))
            }

            if (!item.hasOwnProperty('closeVersion') || item.closeVersion === null) {
              item.closeVersion = 0
            }
            if (!item.hasOwnProperty('allVersion') || item.allVersion === null) {
              item.allVersion = 0
            }
            if (!item.hasOwnProperty('reqTotal') || item.reqTotal === null) {
              item.reqTotal = 0
            }
            if (!item.hasOwnProperty('reqclose') || item.reqclose === null) {
              item.reqclose = 0
            }
            if (!item.hasOwnProperty('kfTotal') || item.kfTotal === null) {
              item.kfTotal = 0
            }
            if (!item.hasOwnProperty('kfclose') || item.kfclose === null) {
              item.kfclose = 0
            }
            if (!item.hasOwnProperty('csclose') || item.csclose === null) {
              item.csclose = 0
            }
            if (!item.hasOwnProperty('csTotal') || item.csTotal === null) {
              item.csTotal = 0
            }
            if (!item.hasOwnProperty('bugclose') || item.bugclose === null) {
              item.bugclose = 0
            }
            if (!item.hasOwnProperty('bugTotal') || item.bugTotal === null) {
              item.bugTotal = 0
            }
            if (!item.hasOwnProperty('scfkclose') || item.scfkclose === null) {
              item.scfkclose = 0
            }
            if (!item.hasOwnProperty('scfkTotal') || item.scfkTotal === null) {
              item.scfkTotal = 0
            }
            if (!item.hasOwnProperty('allNum') || item.allNum === null) {
              item.allNum = 0
            }
            if (!item.hasOwnProperty('wgNum') || item.wgNum === null) {
              item.wgNum = 0
            }
          })
        }
      })
      // redmine规范--项目的接口
      getUnTcReq(obj).then(res => {
        var obj = {}
        if (res.data.result === 'success') {
          obj = res.data
        }
        this.echartsdemandline('nocloseneed', obj)
        // console.log(res.data)
      })
      getScfkEchartsDatas(obj).then(res => {
        // console.log(res)
        var obj = {}
        if (res.data.result === 'success') {
          obj = res.data
        }
        this.echartsitemport('proline', obj)
      })
      getStandardForProject(obj).then(res => {
        console.log(res)
        var obj = {}
        if (res.data.result === 'success') {
          obj = res.data
        }
        this.echartsredminitem('redmine', obj)
      })
    }
  },
  watch: {
    'senddata.changeTime': function (newval, val) {
      console.log(newval)
      console.log(this.senddata)
      this.getdata()
    },
    'senddata.projectid': function (newval, val) {
      console.log(newval)
      this.getdata()
    }
  }
}
</script>

<style lang="scss" scoped>
.tempstyle{
  // margin-top: 44px;
  .etit{
    display: flex;
  }
  .elog{
    flex: 1;
    height: 100px;
    background-color: #fff;
    margin-right: 15px;
    /* width: 14.2%; */
  }
  .titlogbox{
    background:#fff;
    height:70px;
    margin-right:15px;
    border-radius: 5px;
  }
  .nocloseneed{
    background-color: #fff;
    margin-top: 15px;
    p{
     margin: 0;
     padding: 13px 0 0 15px;
     font-size: 16px;
     font-weight: 700;
    }
  }
  .proabout{
      overflow: hidden;
      margin-top: 15px;
      .left{
        width: 49.5%;
        float: left;
        background-color: #fff;
      }
      .right{
        width: 49.5%;
        float: right;
        background-color: #fff;
      }
      .left p,
      .right p {
        margin: 0;
        padding: 13px 0 0 15px;
        font-size: 16px;
        font-weight: 700;
      }
  }
  .itemjd{
    margin-top: 15px;
    background-color: #fff;
    // padding-right:30px;
    .scrollcont{
        height: 530px;
        overflow-y: auto;
        padding-right: 30px;
    }
    .itemhead{
      display: flex;
      .left{
        width: 147px;
        height: 40px;
      }
      .right{
        flex: 1;
        display: flex;
        padding-right: 38px;
        .titleitemname{
            flex: 1;
            margin-left: 20px;
        }
      }
    }
    .itemcontent{
      height: 50px;
      display: flex;
      margin-top: 15px;
      .leftcontent{
        width: 147px !important;
        line-height: 75px;
        text-align: center;
        height: 50px;
        overflow: hidden;    
 	    text-overflow: ellipsis;      //超出部分以省略号显示
 	    white-space: nowrap;
         text-align: right;
      }
      .rightcontent{
        flex: 1;
        display: flex;
        flex-flow: wrap;
        .itemintro{
            width: 100%;
            display: flex;
            // margin-left: 20px;
            height: 20px;
            .iteminfo{
                flex: 1;
                margin-left: 20px;
                text-align: center;
            }
        }
        .itemlog{
            width: 100%;
            display: flex;
            height: 30px;
            // margin-left: 20px;
            cursor: pointer;
            .box{
                flex: 1;
                margin-left: 20px;
                height:30px;
                color:#fff;
                background:#606061;
                border-radius:30px;
                line-height: 30px;
                text-align: center;
                font-size: 16px;
            }
            .first,
            .second{
                flex: 1;
                margin-left: 20px;
            }
        }
      }
    }
  }
}
</style>

<style lang="scss">
    
.scrollcont::-webkit-scrollbar {
  display: block
}
</style>