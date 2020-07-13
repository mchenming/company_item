<template>
    <div class="planEcharts">
      <div style="display:flex;align-items:center;background: white;height:50px;">
        <div style="margin-left:30px">时间范围</div>
          <!-- <el-date-picker
            v-model="queryTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="getTimeCheck"
            value-format="yyyy-MM-dd">
          </el-date-picker> -->
          <el-date-picker
            v-model="queryTime"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['08:00:00', '08:00:00']"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTimeCheck"
            :picker-options="pickerOptions"
            style="margin-left:15px"
            :clearable="false">
          </el-date-picker>
          <div style="margin-left:30px">核心用户</div>
          <el-switch
            v-model="isKey"
            active-color="#4b78cd"
            inactive-color="#eacece"
            style="margin-left:15px"
            @change="searchData()">
          </el-switch>
      </div>
      <div style="margin-top:10px;">
        <el-row>
          <el-col :span="6" id="thchange">
              <el-table class="el-table_header"  ref="multipleTable" :data="listData" v-loading="listLoading" element-loading-text="加载中。。。"
                tooltip-effect="dark" style="width: 100%;margin-left:0px;height:240px;font-size: 11px;text-align:center; "
                :row-style="{height:'39px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background: '#a7d2f9', color: '#fff'}" @cell-mouse-enter='errletsh'>
                <el-table-column  align="center" label="指标" min-width="30px">
                  <template slot-scope='scope'>
                    <span>{{scope.row.indtype}}</span>
                  </template>
                </el-table-column>
                <el-table-column  align="center" label="异常数量" min-width="25%">
                  <template slot-scope='scope'>
                      <el-tooltip class="item" effect="dark" :content="scope.row.erroMess" placement="right-end" v-if="tips">
                        <div  @mouseenter="errshow(scope.row)" @mouseleave="errhide">
                          <!-- <span v-if="scope.row.erroMess !== ''" style="color: red;">{{scope.row.erroNum}}</span> -->
                          <span>{{scope.row.erroNum}}</span>
                          <!-- {{scope.row}} -->
                        </div>
                      </el-tooltip>
                      <div  @mouseenter="errshow(scope.row)" @mouseleave="errhide" v-if="erroshow">
                        <!-- <span v-if="scope.row.erroMess !== ''" style="color: red;">{{scope.row.erroNum}}</span> -->
                        <span>{{scope.row.erroNum}}</span>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="稳定数量" min-width="25%">
                  <template slot-scope='scope'>
                    <span>{{scope.row.successNum}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="状态" min-width="25%" >
                  <template slot-scope="scope" >
                    <div v-if="scope.row.status === '稳定'" style="width: 50px;height: 25px;background-color: #42b165;text-aline:center;line-height:25px;border-radius:5px;margin:auto">
                      <span style="color: #ffffff">{{scope.row.status}}</span>
                    </div>
                    <div v-if="scope.row.status === '异常'" style="width: 50px;height: 25px;background-color: #f56c6c;text-aline:center;line-height:25px;border-radius:5px;margin:auto">
                      <span style="color: #ffffff">{{scope.row.status}}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
          </el-col>
          <el-col :span="3"  class="progresscss" style="position:relative;">
            <h2>服务SLA</h2>
              <div class="progresspart" tag="div" @click="savetime">
                <div class="passTextCss">
                  <p style="margin:0">成功率</p>
                  <span style="color:#000" v-if="slaPassrate>99">{{slaPassrate}}%</span>
                  <span style="color:red" v-if="slaPassrate<99">{{slaPassrate}}%</span>
                  <p style="margin:0">响应时间</p>
                  <span v-if="listData[0].erroNum!==0" style="color:red">{{slatime}}</span>
                  <span v-if="listData[0].erroNum===0" style="color:#000">{{slatime}}</span>
                </div>
                <el-progress type="circle" class="slacss" :stroke-width=strokeWidth :width=progressWidth :percentage='slaPassrate' :show-text='false'></el-progress>
                <div class="xd">
                  <div class="boxshow">
                    <div class="zx" style="background:#fbdb5a"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>
                    <div class="zxx" style="background:#fbdb5a"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>       
                  </div>
                </div>
              </div>
          </el-col>
          <el-col :span="3"  class="progresscss">
            <h2>业务场景</h2>
              <div class="progresspart" @click="business">
                <div class="passTextCss">
                  <span>成功率</span>
                  <!-- <span>{{this.listData.erronum}}</span> -->
                  <span v-if="listData[1].erroNum!=0" style="color:red">{{bussPassrate}}%</span>
                  <span v-if="listData[1].erroNum==0" style="color:#000">{{bussPassrate}}%</span>
                </div>
                <el-progress type="circle" class="busscss" :stroke-width=strokeWidth :width=progressWidth :percentage='bussPassrate' :show-text='false'>成功率</el-progress>
                <div class="xd">
                  <div class="boxshow">
                    <div class="zx" style="background:#4b78cd"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>
                    <div class="zxx" style="background:#4b78cd"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>       
                  </div>
                </div>
              </div>
          </el-col>
          <el-col :span="3"  class="progresscss">
            <h2>生产问题</h2>
              <div class="progresspart" @click="eproblem">
                <div class="passTextCss">
                  <p style="margin:0;">待解决</p>
                  <span>{{productionPassrate}}</span>
                </div>
                <el-progress type="circle" class="productioncss" :stroke-width=strokeWidth :width=progressWidth percentage=100 :show-text='false'>成功率</el-progress>
                <div class="xd">
                  <div class="boxshow">
                    <div class="zx" style="background:#4cca73"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>
                    <div class="zxx" style="background:#4cca73"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>       
                  </div>
                </div>
              </div>
          </el-col>
          <el-col :span="3"  class="progresscss">
            <h2>节点异常</h2>
              <div class="progresspart" @click="errnode">
                <div class="passTextCss">
                  <span>超过1s比例</span>
                  <span v-if="machinePassrate>0.4" style="color:red">{{machinePassrate}}%</span>
                  <span v-if="machinePassrate<0.4" style="color:#000">{{machinePassrate}}%</span><br/>
                  <span>错误率</span><br/>
                  <span v-if="erroRateAvg>6" style="color:red">{{erroRateAvg}}%</span>
                  <span v-if="erroRateAvg<6" style="color:#000">{{erroRateAvg}}%</span>
                </div>
                <el-progress type="circle" class="machinecss" :stroke-width=strokeWidth :width=progressWidth percentage=100 :show-text='false'>成功率</el-progress>
                <div class="xd">
                  <div class="boxshow">
                    <div class="zx" style="background:#ff9933"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>
                    <div class="zxx" style="background:#ff9933"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>       
                  </div>
                </div>
              </div>
          </el-col>
          <el-col :span="3"  class="progresscss">
            <h2>Crash数据</h2>
              <div class="progresspart" @click="crashdata">
                <div class="passTextCss">
                  <span>Crash率</span>
                  <span v-if='crashPassrate>0.05' style="color:red">{{crashPassrate}}%</span><br/>
                  <span v-if="crashPassrate<0.05" style="color:#000">{{crashPassrate}}%</span><br/>
                  <span>影响人数</span>
                  <p style="margin:0;" v-if="crashAuthor<20">{{crashAuthor}}</p>
                  <p style="margin:0;color:red" v-if="crashAuthor>20">{{crashAuthor}}</p>
                </div>
                <el-progress type="circle" class="crashcss" :stroke-width=strokeWidth :width=progressWidth :percentage='crashPassrateP' :show-text='false'></el-progress>
                <div class="xd">
                  <div class="boxshow">
                    <div class="zx" style="background:#9cf"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>
                    <div class="zxx" style="background:#9cf"><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div><img src="./_脉搏,脉冲,心跳,心电,pulse.png" alt=""><div class="heng"></div></div>       
                  </div>
                </div>
              </div>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col :span="6" style="margin-right:12px;">
            <div style="height: 30px;background-color: white;width: 100%;">
              <div style="height: 13px;background-color: white;width: 100%;"></div>
              <b style="margin-left: 15px;font-size: 16px;">业务场景</b>
            </div>
            <div style="background-color: white;width:100%;height:240px;position:relative">
              <div id='bussScenario' ref="bussScenario" style="width:105%;position:absolute;left:-5px;top:-10px;"></div>
            </div>
          </el-col>
          <el-col :span="9">
            <div style="height: 30px;background-color: white;width: 98%;cursor:pointer;" @click="jumptopage">
              <div style="height: 13px;background-color: white;width: 100%;"></div>
              <b style="margin-left: 15px;font-size: 16px;">核心指标Top5</b>
            </div>
            <div style="background-color: white;width:98%;height:240px;">
              <div id='indexTop5' ref="indexTop5" style="cursor:pointer;width:98%;height:240px;"></div>
            </div>
          </el-col>
          <el-col :span="9">
            <div style="height: 30px;background-color: white;width: 100%;">
              <div style="height: 13px;background-color: white;width: 100%;"></div>
              <b style="margin-left: 15px;font-size: 16px;">节点监控</b>
            </div>
            <el-table ref="multipleTable" :data="nodeDataList" v-loading="listLoading" element-loading-text="加载中。。。"
              tooltip-effect="dark" style="width: 100%;margin-left:0px;height: 240px;text-align:center;"
              :row-style="{height:'60px'}" :cell-style="{padding:'0px'}">
              <el-table-column align="center" width=105 label="节点" type="index">
                <template slot-scope='scope'>
                  <span>{{scope.row.node_id}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="70"  label="请求数">
                <template slot-scope='scope'>
                  <span>{{scope.row.request_num}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="62" label="错误率">
                <template slot-scope='scope'>
                  <div v-if="erroratet === true" style="width: 60px;height: 28px;line-height:28px;background-color: #ecf5ff;margin:auto;border-radius:5px;">
                    <span style="color: red;">{{scope.row.request_error_rate}}</span>
                  </div>
                  <div v-else style="width: 60px;height: 28px;line-height:28px;background-color: #ecf5ff;margin:auto;border-radius:5px;">
                    <span style="color: #409eff">{{scope.row.request_error_rate}}</span>
                  </div>
                  <!-- <div v-if="scope.row.request_error_rate === '异常'" style="width: 31px;height: 25px;background-color: #fef1f1">
                    <span style="color: #f56c6c">{{scope.row.request_error_rate}}</span>
                  </div> -->
                </template>
              </el-table-column>
              <el-table-column align="center" min-width=76  label="平均时间">
                <template slot-scope='scope'>
                  <span>{{scope.row.request_time}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="64"  label="超过1s">
                <template slot-scope='scope'>
                  <span>{{scope.row.low_request_num}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width=68  label="占比">
                <template slot-scope='scope'>
                  <div>
                    <span v-if="(parseFloat(scope.row.low_request_num/scope.row.request_num)*100)>0.4" style="color: red">{{(parseFloat(scope.row.low_request_num/scope.row.request_num)*100).toFixed(3)}}%</span>
                    <span v-else style="color: #409eff">{{(parseFloat(scope.row.low_request_num/scope.row.request_num)*100).toFixed(3)}}%</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col :span="6" style="margin-right:12px;">
            <div style="height: 30px;background-color: white;width: 100%;">
              <div style="height: 13px;background-color: white;width: 100%;"></div>
              <b style="margin-left: 15px;font-size: 16px;">Crash概况</b>
            </div>
            <div style="background-color: white;width:100%;height:240px;">
              <div id='crashInfo' ref="crashInfo"></div>
            </div>
          </el-col>
          <el-col :span="9">
            <div style="height: 30px;background-color: white;width: 98%;">
              <div style="height: 13px;background-color: white;width: 100%;"></div>
              <b style="margin-left: 15px;font-size: 16px;">PV&UV</b>
            </div>
            <div style="background-color: white;width:98%;height:240px;">
              <div id='pvuv' ref="pvuv"></div>
            </div>
          </el-col>
          <el-col :span="9" id="changeColor">
            <div class="waitres">待解决&nbsp;&nbsp;&nbsp;{{productionPassrate}}</div>
            <div class="waitres1">本月新增&nbsp;&nbsp;&nbsp;{{byxz}}</div>
            <el-table ref="multipleTable" :data="productionFeedbackList" height="270" v-loading="listLoading" element-loading-text="加载中。。。"
              tooltip-effect="dark" style="width: 100%;margin-left:0px;height: 270px;overflow-y:auto" 
              :row-style="{height:'45px'}" :cell-style="{padding:'0px'}" :row-class-name="tableRowClassName" class="problems">
              <el-table-column align="left" width=80 label="生产问题" type="index">
                <template slot-scope='scope'>
                  <div style="text-align:left" v-html="scope.row[1]"></div>
                </template>
              </el-table-column>
              <el-table-column align="left" min-width=120 label="问题简述">
                <template slot-scope='scope'>
                  <div style="text-align:left;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{scope.row[2]}}</div>
                  <!-- <div>{{scope.row[2]}}</div> -->
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
import { getallsummarydata, getallsummaryscenedata, getindexItemdata, getnodeaccesssummary, getcrashnumsummary, getcrashuvsummary, getdausummarydata, getindexallsummarydata,
getnewcrashnumsummary, getfeedbackdatalistv2, getfeedbackstaticlistv2, getdauitemdata, getdomainallsummarydata} from '@/api/xyzqPort/eHomePort'
// import { drawGraph } from '@/api/drawGraph'
import Dprogress from '@/components/dprogress'
import echarts from 'echarts'
export default {
  name: 'index',
  data () {
    return {
      tips: false,
      erroshow: true,
      crashAuthor: 0,
      strokeWidth: 12,
      progressWidth: 130,
      isKey: false,
      listLoading: false,
      listQuery: {
        start_time: '',
        end_time: ''
      },
      slatime: '',
      sladata: {},
      listData: [
        {indtype: '核心接口', erroNum: '0', successNum: '0', status: '稳定'},
        {indtype: '业务场景', erroNum: '0', successNum: '0', status: '稳定'},
        {indtype: '核心指标', erroNum: '0', successNum: '0', status: '稳定'},
        {indtype: '节点监控', erroNum: '0', successNum: '0', status: '异常'},
        {indtype: 'crash情况', erroNum: '0', successNum: '0', status: '稳定'}
      ],
      nodeDataList: [],
      productionFeedbackList: [],
      slaPassrate: 99.87,
      bussPassrate: 100,
      productionPassrate: 100,
      byxz: 0,
      machinePassrate: 100,
      erroRateAvg: 0,
      crashPassrate: 0,
      crashPassrateP: 100,
      graphData: {
        id: 'bussScenario',
        xAxisData: [11, 30, 40],
        yAxisData: [11, 30, 40],
        legendData: [11, 30, 40],
        seriesData: [11, 30, 40],
        titleText: '柱形图',
        graphType: 10
      },
      overrate: false,
      erroratet: false,
      queryTime: [],
      sadtime: {
        stime: '123',
        etime: '456'
      },
      pickerOptions: {
        shortcuts: [{
          text: '全部',
          onClick (picker) {
            picker.$emit('pick', ['', ''])
          }
        }, {
          text: '最近一月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 182)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本年度',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            const lastDay = new Date()
            lastDay.setMonth(0)
            lastDay.setDate(1)
            var days = (start - lastDay) / (3600 * 1000 * 24)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上年度',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            const lastDay = new Date()
            lastDay.setMonth(0)
            lastDay.setDate(1)
            var days = (start - lastDay) / (3600 * 1000 * 24) + 1
            end.setTime(end.getTime() - 3600 * 1000 * 24 * days)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (days + 364))
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  components: {
    Dprogress
  },
  created () {
    if (this.$route.query.stime || this.$route.query.etime) {
      const s = this.$route.query.stime
      const e = this.$route.query.etime
      this.queryTime = [s, e]
      this.listQuery.start_time = s
      this.listQuery.end_time = e
    } else {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      var s = this.getTimeByDate(start)
      var e = this.getTimeByDate(end)
      this.queryTime = [s, e]
      this.listQuery.start_time = s
      this.listQuery.end_time = e
    }
    this.searchData()
    this.getPvuvData('1')
  },
  mounted () {
    this.$nextTick(function () {
    })
  },
  activated () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24)
    var s = this.getTimeByDate(start)
    var e = this.getTimeByDate(end)
    this.queryTime = [s, e]
    this.listQuery.start_time = s
    this.listQuery.end_time = e
    this.searchData()
    this.getPvuvData('1')
  },
  methods: {
    jumptopage () {
      const row = {
        stime: this.queryTime[0],
        etime: this.queryTime[1],
        core: this.isKey,
        index_name: 'all_index'
      }
      this.$router.push({path: '/etopfive', query: row})
      // console.log(row)
    },
    crashdata () {
      const row = {
        stime: this.queryTime[0],
        etime: this.queryTime[1]
      }
      this.$router.push({path: '/crashdata', query: row})
    },
    errnode () {
      // localStorage.setItem('business', this.queryTime)
      // localStorage.setItem('biskey', this.isKey)
      const row = {
        stime: this.queryTime[0],
        etime: this.queryTime[1],
        iskey: this.iskey
      }
      this.$router.push({path: '/errnode', query: row})
    },
    eproblem () {
      localStorage.setItem('business', this.queryTime)
      localStorage.setItem('biskey', this.isKey)
      this.$router.push('/eproblem')
    },
    business () {
      localStorage.setItem('business', this.queryTime)
      localStorage.setItem('biskey', this.isKey)
      this.$router.push('/ebusiness')
    },
    savetime () {
      // console.log(this.queryTime)
      // this.$eventBus.$emit('changetime', this.queryTime)
      localStorage.setItem('timedate', this.queryTime)
      localStorage.setItem('iskey', this.isKey)
      this.$router.push('/esal')
    },
    errletsh (row) {
      if (row.erroNum !== 0) {
        this.tips = true
        this.erroshow = false
      }
    },
    errhide () {
      this.tips = false
      this.erroshow = true
    },
    errshow (data) {
      if (Number(data.erroNum) !== 0) {
        this.tips = true
        this.erroshow = false
      } else if (Number(data.erroNum) === 0) {
        this.tips = false
        this.erroshow = true
      }
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      }
    },
    getPvuvData (type) {
      var row = {
        start_time: '',
        end_time: '',
        index_name: 'uv_index'
      }
      if (type !== '1') {
        row = {
          start_time: this.listQuery.start_time + '',
          end_time: this.listQuery.end_time + '',
          index_name: 'uv_index'
        }
      } else {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 5)
        var s = this.getTimeByDate(start)
        var e = this.getTimeByDate(end)
        row = {
          start_time: s + '',
          end_time: e + '',
          index_name: 'uv_index'
        }
      }
      const purow = {
        xAxisData: [],
        androidPv: [],
        androidUv: [],
        iosPv: [],
        iosUv: []
      }
      getdauitemdata(row).then(response => {
        // console.log(response.data.data)
        if (response.data.data !== null) {
          var newarr = response.data.data.timeList
          var nn = Math.round(newarr.length / 4)
          var arr = []
          arr[0] = newarr[0]
          arr[1] = newarr[nn]
          arr[2] = newarr[2 * nn]
          arr[3] = newarr[3 * nn]
          arr[4] = newarr[newarr.length - 1]
          purow.xAxisData = arr
          purow.androidUv = response.data.data.dataList.安卓机器
          purow.iosUv = response.data.data.dataList.苹果机器
          // 对后端返回的时间格式进行操作
          for (var i = 0; i < purow.xAxisData.length; i++) {
            purow.xAxisData[i] = purow.xAxisData[i].split(' ')[0]
          }
        }
        row.index_name = 'pv_index'
        getdauitemdata(row).then(response => {
          // console.log(response.data.data)
          if (response.data.data !== null) {
            purow.androidPv = response.data.data.dataList.安卓机器
            purow.iosPv = response.data.data.dataList.苹果机器
          }
          this.drawBaseLine('pvuv', purow)
        })
      })
    },
    getfeedbackdatalist (projectId, month, ftype) {
      const productionRow = {}
      productionRow.project_id = projectId
      productionRow.static_month = month
      productionRow.feedback_type = ftype
      getfeedbackdatalistv2(productionRow).then(response => {
        // console.log(response.data.data)
        // console.log(productionRow)
        if (response.data.data.length > 0) {
          for (let i = 0; i < response.data.data.length; i++) {
            this.productionFeedbackList.push(response.data.data[i])
          }
        }
        // this.paly()
      })
    },
    getPassrateData () {
      getindexallsummarydata(this.listQuery, this.isKey).then(response => {
        console.log(response)
        if (response.data.data !== null) {
          this.listData[2].successNum = response.data.data.all_index.pv
          this.listData[2].erroMess = ''
        }
      })
      getallsummarydata(this.listQuery, this.isKey).then(response => {
        console.log(response)
        this.sladata = response.data.data
        getallsummaryscenedata(this.listQuery, this.isKey).then(response => {
          const bussData = response.data.data
          console.log(response)
          var HRExamine = 95
          var claimExamine = 85
          var examineLogin = 90
          var punchWork = 93
          var summarySla = 94
          if (bussData !== null) {
            HRExamine = bussData.HRExamine.value.substring(0, bussData.HRExamine.value.lastIndexOf('%')) - 0
            claimExamine = bussData.claimExamine.value.substring(0, bussData.claimExamine.value.lastIndexOf('%')) - 0
            examineLogin = bussData.examineLogin.value.substring(0, bussData.examineLogin.value.lastIndexOf('%')) - 0
            punchWork = bussData.punchWork.value.substring(0, bussData.punchWork.value.lastIndexOf('%')) - 0
            summarySla = this.sladata.QueryTokenInfoAction.summary_sla.value.replace('%', '') - 0
            var arr = [HRExamine, claimExamine, examineLogin, punchWork, summarySla]
            this.bussPassrate = Math.min.apply(null, arr)
            let erroNum = 0
            var boo = false
            var erroMess = ''
            if (!this.isKey) {
              if (examineLogin < 99) {
                erroNum++
                boo = true
                erroMess += '审批中心单点登录成功率低于99%，\n'
              }
              if (summarySla < 95) {
                erroNum++
                boo = true
                erroMess += '协同单点登录成功率低于95%，\n'
              }
            }
            if (punchWork < 99) {
              erroNum++
              boo = true
              erroMess += '考勤操作一次完成成功率低于99%，\n'
            }
            if (HRExamine < 95) {
              erroNum++
              boo = true
              erroMess += 'HR审批一次通过成功率低于95%，\n'
            }
            if (claimExamine < 95) {
              erroNum++
              boo = true
              erroMess += '网报审批一次通过成功率低于95%，\n'
            }
            var status = '稳定'
            if (boo) {
              status = '异常'
            }
            this.listData[1].status = status
            this.listData[1].erroMess = erroMess.substring(0, erroMess.length)
            this.listData[1].erroNum = erroNum
            var tot = 5
            if (this.isKey) {
              tot = 3
            }
            this.listData[1].successNum = tot - erroNum
          }
          if (!this.isKey) {
            const row = {
              titleText: '业务场景',
              seriesData: [punchWork, HRExamine, claimExamine, examineLogin, summarySla]
            }
            this.drawVBar('bussScenario', row)
          } else {
            const row = {
              titleText: '业务场景',
              seriesData: [punchWork, HRExamine, claimExamine]
            }
            this.drawVBar('bussScenario', row)
          }
        })
        var slaPassrate = this.sladata.all.summary_sla.value
        this.slatime = this.sladata.all.avg_time_cost.value
        this.slaPassrate = slaPassrate.substring(0, slaPassrate.lastIndexOf('%')) - 0
        let erroNum = 0
        var erroMess = ''
        var boo = false
        if (this.sladata.QueryOaaddressbookAction.avg_time_cost.value.replace('ms', '') > 500 || this.sladata.QueryOaaddressbookAction.summary_sla.value.replace('%', '') < 99) {
          erroNum++
          boo = true
          if (this.sladata.QueryOaaddressbookAction.avg_time_cost.value.replace('ms', '') > 500) {
            erroMess += '通讯录平均响应时间高于500ms，\n'
          } else if (this.sladata.QueryOaaddressbookAction.avg_time_cost.value.replace('ms', '') > 500 && this.sladata.QueryOaaddressbookAction.summary_sla.value.replace('%', '') < 99) {
            erroMess += '通讯录平均响应时间高于500ms且接口成功率低于99%，\n'
          } else {
            erroMess += '通讯录接口成功率低于99%，\n'
          }
        }
        if (this.sladata.QueryPtUserModuleAction.avg_time_cost.value.replace('ms', '') > 200 || this.sladata.QueryPtUserModuleAction.summary_sla.value.replace('%', '') < 99) {
          erroNum++
          boo = true
          if (this.sladata.QueryPtUserModuleAction.avg_time_cost.value.replace('ms', '') > 200) {
            erroMess += '工作台图标接口平均响应时间高于200ms，\n'
          } else if (this.sladata.QueryPtUserModuleAction.avg_time_cost.value.replace('ms', '') > 200 && this.sladata.QueryPtUserModuleAction.summary_sla.value.replace('%', '') < 99) {
            erroMess += '工作台图标接口平均响应时间高于200ms且接口成功率低于99%，\n'
          } else {
            erroMess += '工作台图标接口接口成功率低于99%，\n'
          }
        }
        if (this.sladata.QueryTokenInfoAction.avg_time_cost.value.replace('ms', '') > 50 || this.sladata.QueryTokenInfoAction.summary_sla.value.replace('%', '') < 99) {
          erroNum++
          boo = true
          if (this.sladata.QueryTokenInfoAction.avg_time_cost.value.replace('ms', '') > 50) {
            erroMess += '协同单点登录服务平均响应时间高于50ms，\n'
          } else if (this.sladata.QueryTokenInfoAction.avg_time_cost.value.replace('ms', '') > 50 && this.sladata.QueryTokenInfoAction.summary_sla.value.replace('%', '') < 99) {
            erroMess += '协同单点登录服务平均响应时间高于50ms且接口成功率低于99%，\n'
          } else {
            erroMess += '协同单点登录服务接口成功率低于99%，\n'
          }
        }
        if (this.sladata.auth.avg_time_cost.value.replace('ms', '') > 200 || this.sladata.auth.summary_sla.value.replace('%', '') < 99) {
          erroNum++
          boo = true
          if (this.sladata.auth.avg_time_cost.value.replace('ms', '') > 200) {
            erroMess += '登录接口平均响应时间高于200ms，\n'
          } else if (this.sladata.auth.avg_time_cost.value.replace('ms', '') > 200 && this.sladata.auth.summary_sla.value.replace('%', '') < 99) {
            erroMess += '登录接口平均响应时间高于200ms且接口成功率低于99%，\n'
          } else {
            erroMess += '登录接口接口成功率低于99%，\n'
          }
        }
        if (this.sladata.checkrange.avg_time_cost.value.replace('ms', '') > 50 || this.sladata.checkrange.summary_sla.value.replace('%', '') < 99) {
          erroNum++
          boo = true
          if (this.sladata.checkrange.avg_time_cost.value.replace('ms', '') > 50) {
            erroMess += '打卡定位接口平均响应时间高于50ms，\n'
          } else if (this.sladata.checkrange.avg_time_cost.value.replace('ms', '') > 50 && this.sladata.checkrange.summary_sla.value.replace('%', '') < 99) {
            erroMess += '打卡定位接口平均响应时间高于50ms且接口成功率低于99%，\n'
          } else {
            erroMess += '打卡定位接口接口成功率低于99%，\n'
          }
        }
        if (this.sladata.ischeck.avg_time_cost.value.replace('ms', '') > 50 || this.sladata.ischeck.summary_sla.value.replace('%', '') < 99) {
          erroNum++
          boo = true
          if (this.sladata.ischeck.avg_time_cost.value.replace('ms', '') > 50) {
            erroMess += '打卡状态接口平均响应时间高于50ms，\n'
          } else if (this.sladata.ischeck.avg_time_cost.value.replace('ms', '') > 50 && this.sladata.ischeck.summary_sla.value.replace('%', '') < 99) {
            erroMess += '打卡状态接口平均响应时间高于50ms且接口成功率低于99%，\n'
          } else {
            erroMess += '打卡状态接口成功率低于99%，\n'
          }
        }
        if (this.sladata.workcheck.avg_time_cost.value.replace('ms', '') > 50 || this.sladata.workcheck.summary_sla.value.replace('%', '') < 99) {
          erroNum++
          boo = true
          if (this.sladata.workcheck.avg_time_cost.value.replace('ms', '') > 50) {
            erroMess += '打卡接口平均响应时间高于50ms，\n'
          } else if (this.sladata.workcheck.avg_time_cost.value.replace('ms', '') > 50 && this.sladata.workcheck.summary_sla.value.replace('%', '') < 99) {
            erroMess += '打卡接口平均响应时间高于50ms且接口成功率低于99%，\n'
          } else {
            erroMess += '打卡接口成功率低于99%，\n'
          }
        }
        if (this.sladata.all.avg_time_cost.value.replace('ms', '') > 100 || this.sladata.all.summary_sla.value.replace('%', '') < 99) {
          erroNum++
          boo = true
          if (this.sladata.all.avg_time_cost.value.replace('ms', '') > 100) {
            erroMess += '所有接口（统计）平均响应时间超过100ms，\n'
          } else {
            erroMess += '所有接口（统计）成功率小于99%， \n'
          }
        }
        var status = '稳定'
        if (boo) {
          status = '异常'
        }
        this.listData[0].status = status
        this.listData[0].erroMess = erroMess.substring(0, erroMess.length)
        this.listData[0].erroNum = erroNum
        this.listData[0].successNum = 7 - erroNum
      })
      const productionRow = {}
      productionRow.project_id = '26'
      productionRow.static_month = '0'
      getfeedbackstaticlistv2(productionRow).then(response => {
        // var productionPassrate = 0
        // console.log(response.data.data)
        var djj1 = 0
        var djj2 = 0
        var byxz1 = 0
        var byxz2 = 0
        if (response.data.data.length > 0) {
          this.productionFeedbackList = []
          var date = response.data.data[0][9].substring(response.data.data[0][9].lastIndexOf('('), response.data.data[0][9].lastIndexOf(')'))
          var d = date.split("','")[1].split("',")
          djj1 = response.data.data[0][9].split(' ')[4]
          byxz1 = response.data.data[0][3].split(' ')[4]
          this.getfeedbackdatalist(productionRow.project_id, d[0], d[1])
        }
        productionRow.project_id = '27'
        getfeedbackstaticlistv2(productionRow).then(response => {
          if (response.data.data.length > 0) {
            var date1 = response.data.data[0][9].substring(response.data.data[0][9].lastIndexOf('('), response.data.data[0][9].lastIndexOf(')'))
            var d1 = date1.split("','")[1].split("',")
            djj2 = response.data.data[0][9].split(' ')[4]
            byxz2 = response.data.data[0][3].split(' ')[4]
            this.getfeedbackdatalist(productionRow.project_id, d1[0], d1[1])
          }
          this.productionPassrate = (djj1 - 0) + (djj2 - 0)
          this.byxz = (byxz1 - 0) + (byxz2 - 0)
        })
      })
      const indexRow = {
        start_time: this.listQuery.start_time,
        end_time: this.listQuery.end_time,
        index_name: 'all_index'
      }
      getindexItemdata(indexRow, this.isKey).then(response => {
        var respondentNum = ['2331', '2111', '1123', '1112', '890'] // 人数
        var interviewsNum = ['5432', '5321', '4321', '3321', '3111'] // 次数
        var xAxisData = ['领导驾驶舱', '投研平台', '会议管理', '设备情况', '企业邮箱']
        // console.log(response.data.data)
        if (response.data.data !== null) {
          respondentNum = [] // 人数
          interviewsNum = [] // 次数
          xAxisData = []
          const pageList = response.data.data.pageList
          const pvList = response.data.data.pvList
          const uvList = response.data.data.uvList
          for (let i = uvList.length - 1; i >= 0; i--) {
            if (i > uvList.length - 7) {
              var uv = uvList[i]
              var pv = pvList[i]
              var page = pageList[i]
              if (page !== '后台日志') {
                xAxisData.push(page)
                interviewsNum.push(pv)
                respondentNum.push(uv)
              }
            }
          }
        }
        const row = {
          titleText: '核心指标Top5',
          xAxisData: xAxisData,
          respondentNum: respondentNum,
          interviewsNum: interviewsNum
        }
        this.drawVBarTwo('indexTop5', row)
      })
    },
    getCrashData () {
      const androidData = ['8', '7', '3']
      const iosData = ['5', '5', '1']
      const yAxisData = ['CRASH数', 'CRASH影响用户数', '新增崩溃类型数']
      var boo = false
      var erroNum = 0
      var erroMess = ''
      getcrashnumsummary(this.listQuery).then(response => { // 获取crash数
        const data = response.data.data
        if (data !== null) {
          androidData[0] = data.android - 0
          iosData[0] = data.ios - 0
          erroNum = (data.android - 0) + (data.ios - 0)
          if ((data.android - 0) + (data.ios - 0) > 30) {
            erroMess += ',大于30'
            boo = true
          }
          getdomainallsummarydata(this.listQuery).then(res => {
            console.log(res.data.data)
            if (res.data.data !== null) {
              if ((res.data.data.request_num - 0) !== 0) {
                let and = data.android - 0
                let ios = data.ios - 0
                let total = res.data.data.request_num.replace(/,/g, '') - 0
                let rate = ((and + ios) * 1000 / total).toFixed(2)
                this.crashPassrate = rate
                this.crashPassrateP = 100 - this.crashPassrate
                if (rate > 0.05) {
                  boo = true
                  erroMess += ',crash率大于0.05%'
                }
              }
            }
          })
        }
        getcrashuvsummary(this.listQuery).then(response => { // 获取CRASH影响用户数
          const data = response.data.data
          // console.log(data)
          var erroMess1 = ''
          if (data !== null) {
            androidData[1] = data.android
            iosData[1] = data.ios
            this.crashAuthor = (data.android - 0) + (data.ios - 0)
            if (((data.android - 0) + (data.ios - 0)) > 20) {
              boo = true
              erroMess1 = ',大于20'
            }
          }
          this.listData[4].erroNum = erroNum + '/' + this.crashAuthor
          this.listData[4].erroMess = 'crash总数：' + erroNum + erroMess + '\ncrash影响用户数：' + this.crashAuthor + erroMess1
          var status = '稳定'
          if (boo) {
            status = '异常'
          }
          this.listData[4].status = status
          getdausummarydata(this.listQuery).then(res => {
            // console.log(res.data.data)
            if (res.data.data !== null) {
              this.listData[4].successNum = (res.data.data.android_pv - 0) + (res.data.data.iphone_pv - 0)
            }
          })
          getnewcrashnumsummary(this.listQuery).then(response => { // 获取新增崩溃类型数
            // console.log(response.data.data)
            const data = response.data.data
            if (data !== null) {
              androidData[2] = data.android
              iosData[2] = data.ios
            }
            const row = {
              titleText: 'Crash概况',
              yAxisData: yAxisData,
              androidData: androidData,
              iosData: iosData
            }
            this.drawHBar('crashInfo', row)
          })
        })
      })
    },
    getcrashRate () {
      // getcrashratesummary(this.listQuery).then(response => {
      //   if (response.data.data !== null) {
      //     var andRate = response.data.data.android_crash_rate.replace('%', '') - 0
      //     var iosRate = response.data.data.ios_crash_rate.replace('%', '') - 0
      //     if (andRate > iosRate) {
      //       this.crashPassrate = andRate
      //     } else {
      //       this.crashPassrate = iosRate
      //     }
      //     this.crashPassrateP = 100 - this.crashPassrate
      //   }
      // })
    },
    change () {
      // change、paly表格数据动态滚动
      this.productionFeedbackList.push(this.productionFeedbackList[0])// 把第一条数据插入数组最有一条
      this.productionFeedbackList.shift()// 删除数组中第一条数据
    },
    paly () {
      // setInterval(this.change(), 2000)// 每两秒执行一次插入删除操作
      window.setInterval(() => {
        setTimeout(this.change(), 0)
      }, 5000)
    },
    getListData () {
      this.listLoading = true
      this.nodeDataList = []
      getnodeaccesssummary(this.listQuery).then(response => {
        console.log(response.data.data)
        if (response.data.data !== null) {
          let erroNum = 0
          var boo = false
          let reqtotal = 0
          let lowreqtotal = 0
          let erroRateNum = 0
          var erroMess = ''
          for (let i = 0; i < response.data.data.length; i++) {
            const element = response.data.data[i]
            lowreqtotal += element.low_request_num - 0
            reqtotal += element.request_num - 0
            erroRateNum += (element.request_error_rate.replace('%', '') - 0) * (element.request_num - 0) / 100
            let rate = (element.low_request_num - 0) * 100 / (element.request_num - 0)
            this.overrate = false
            this.erroratet = false
            if ((element.request_error_rate.replace('%', '') - 0) > 6 || rate > 0.4) {
              erroNum++
              boo = true
              if ((element.request_error_rate.replace('%', '') - 0) > 6) {
                erroMess += element.node_id + '错误清理率高于6%，'
                this.erroratet = true
              } else if ((element.request_error_rate.replace('%', '') - 0) > 6 && rate > 0.4) {
                erroMess += element.node_id + '错误清理率高于6%且超时1s请求占比高于0.4%，'
                this.overrate = true
                this.erroratet = true
              } else {
                erroMess += element.node_id + '超时1s请求占比高于0.4%，'
                this.overrate = true
              }
            }
            this.nodeDataList.push(element)
          }
          this.machinePassrate = parseFloat((lowreqtotal * 100 / reqtotal).toFixed(2))
          console.log(erroRateNum)
          console.log(reqtotal)
          this.erroRateAvg = parseFloat((erroRateNum * 100 / reqtotal).toFixed(2))
          var status = '稳定'
          if (boo) {
            status = '异常'
          }
          this.listData[3].status = status
          this.listData[3].erroMess = erroMess.substring(0, erroMess.length)
          this.listData[3].erroNum = erroNum
          this.listData[3].successNum = 3 - erroNum
        }
      })
      this.listLoading = false
    },
    getday (date) {
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (day >= 1 && day <= 9) {
        day = '0' + day
      }
      return year + '-' + month + '-' + day
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
      var self = this
      var now = new Date()
      var dt1 = new Date()
      var dt2 = new Date()
      var dt3 = new Date()
      dt1.setTime(dt1.getTime() - 3600 * 1000 * 24 * 30)
      dt2.setTime(dt2.getTime() - 3600 * 1000 * 24 * 90)
      dt3.setTime(dt3.getTime() - 3600 * 1000 * 24 * 182)
      var year = now.getFullYear()
      var thisY = year + '-01-01'
      var preYs = year - 1 + '-01-01'
      var preYe = year - 1 + '-12-31'
      if (this.queryTime === null || (this.queryTime[0] === '' && this.queryTime[1] === '')) {
        self.time = '不限'
      } else if (this.getday(dt1) === this.queryTime[0] && this.getday(now) === this.queryTime[1]) {
        self.time = '最近一月'
      } else if (this.getday(dt2) === this.queryTime[0] && this.getday(now) === this.queryTime[1]) {
        self.time = '最近三月'
      } else if (this.getday(dt3) === this.queryTime[0] && this.getday(now) === this.queryTime[1]) {
        self.time = '最近半年'
      } else if (thisY === this.queryTime[0] && this.getday(now) === this.queryTime[1]) {
        self.time = '本年度'
      } else if (preYs === this.queryTime[0] && preYe === this.queryTime[1]) {
        self.time = '上年度'
      } else {
        self.time = this.queryTime[0] + '至' + this.queryTime[1]
      }
      this.listQuery.start_time = ''
      this.listQuery.end_time = ''
      if (this.queryTime != null && this.queryTime !== '') {
        this.listQuery.start_time = this.queryTime[0]
        this.listQuery.end_time = this.queryTime[1]
      }
      this.searchData()
      this.getPvuvData('0')
    },
    searchData () {
      this.listQuery.start_time = ''
      this.listQuery.end_time = ''
      if (this.queryTime != null && this.queryTime !== '') {
        this.listQuery.start_time = this.queryTime[0]
        this.listQuery.end_time = this.queryTime[1]
      }
      this.getListData()
      this.getPassrateData()
      this.getCrashData()
      this.getcrashRate()
    },
    // 双柱状图
    drawVBarTwo (id, graphData) {
      var bussScenario = document.getElementById(id)
      // bussScenario.style.cursor = 'pointer'
      // bussScenario.style.cursor = 'pointer'
      // document.getElementById(id)[0].firstChild.style.zIndex = -1
      var myChart = echarts.init(bussScenario)
      myChart.setOption({
        color: ['#4b78cd', '#4cca73'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          x: 'center',
          data: ['受访人数', '受访次数']
        },
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        grid: {
          top: '13%',
          left: '3%',
          right: 0,
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: graphData.xAxisData,
            axisLabel: {
              interval: 0,
              rotate: 20
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
            // name: '受访次数'
          }
        ],
        series: [
          {
            name: '受访人数',
            type: 'bar',
            label: { normal: { show: true } },
            barMaxWidth: 30,
            // yAxisIndex: 0,
            barGap: 0,
            data: graphData.respondentNum
          },
          {
            name: '受访次数',
            type: 'bar',
            label: { normal: { show: true } },
            // yAxisIndex: 1,
            barMaxWidth: 30,
            data: graphData.interviewsNum
          }
        ]
      }, true)
      myChart.getZr().on('click', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          var info = op.xAxis[0].data[xIndex]
          const row = {
            stime: this.queryTime[0],
            etime: this.queryTime[1],
            core: this.iskey,
            index_name: info
          }
          this.$router.push({path: '/etopfive', query: row})
        }
      })
    },
    // 雷达图
    drawVBar (id, graphData) {
      var bussScenario = document.getElementById(id)
      var myChart = echarts.init(bussScenario)
      var dataArr = []
      if (graphData.seriesData.length === 3) {
        dataArr = [
            {name: '考勤完成' + '\n' + graphData.seriesData[0] + '%', max: 100},
            {name: 'HR审批' + '\n' + graphData.seriesData[1] + '%', max: 100},
            {name: '网报审批' + '\n' + '\n' + graphData.seriesData[2] + '%', max: 100}
        ]
      } else {
        dataArr = [
            {name: '考勤完成' + '\n' + graphData.seriesData[0] + '%', max: 100},
            {name: 'HR审批' + '\n' + graphData.seriesData[1] + '%', max: 100},
            {name: '网报审批' + '\n' + graphData.seriesData[2] + '%', max: 100},
            {name: '审批中心\nSSO' + '\n' + graphData.seriesData[3] + '%', max: 100},
            {name: '协同\nSSO' + '\n' + graphData.seriesData[4] + '%', max: 100}
        ]
      }
      // var xAxisData = ['考勤完成', 'HR审批', '网报审批', '审批中心SSO', '协同SSO']
      myChart.setOption({
        radar: {
        // shape: 'circle',
          name: {
            textStyle: {
              color: 'black',
              fontSize: 11,
              // position: 'TOP',
              // backgroundColor: 'red',
              width: '80px'
              // padding: '0 12px'
            }
          },
          indicator: dataArr,
          nameGap: 5
        },
        series: [{
          type: 'radar',
          symbol: 'none',
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)', // 图表中各个图区域的边框线拐点颜色
              lineStyle: {
                color: '#ccc' // 图表中各个图区域的边框线颜色
              },
              areaStyle: {
                type: 'default'
              }
            }
          },
          data: [
            {
              value: graphData.seriesData,
              // name: '预算分配',
              itemStyle: {
                normal: {
                  areaStyle: {
                    type: 'default',
                    opacity: 0.6, // 图表中各个图区域的透明度
                    color: '#4b78cd' // 图表中各个图区域的颜色
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  formatter: function (params) {
                    return params.value
                  }
                }
              }
            }
          ]
        }]
      }, true)
      // 修改后的代码
      // myChart.setOption({
      //   grid: {
      //     position: 'center'
      //   },
      //   tooltip: {},
      //   radar: {
      //     shape: 'circle',
      //     name: {
      //       textStyle: {
      //         color: 'black',
      //         fontsize: '20px'
      //       }
      //     },
      //     indicator: dataArr
      //   },
      //   series: [{
      //     type: 'radar',
      //     symbol: 'none',
      //     data: [{
      //       value: graphData.seriesData,
      //       itemStyle: {
      //         normal: {
      //           color: 'pink',
      //           lineStyle: {
      //             color: '#ccc'
      //           }
      //         }
      //       },
      //       label: {
      //         normal: {
      //           show: true,
      //           formatter: function (params) {
      //             return params.data
      //           }
      //         }
      //       }
      //     }]
      //   }]
      // })
    },
    // 条形图
    drawHBar (id, graphData) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          x: 'right',
          data: ['Android', 'IOS']
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: [ 'CRASH\n数', '影响\n用户数', '新增\n崩溃' ]
        },
        series: [
          {
            name: 'Android',
            type: 'bar',
            stack: '总量',
            itemStyle: { normal: { color: '#4b78cd' } },
            label: {
              normal: {
                show: true
              }
            },
            barMaxWidth: 30,
            data: graphData.androidData
          },
          {
            name: 'IOS',
            type: 'bar',
            stack: '总量',
            itemStyle: { normal: { color: '#31bd73' } },
            label: {
              normal: {
                show: true
              }
            },
            barMaxWidth: 30,
            data: graphData.iosData
          }
        ]
      }, true)
    },
    // 基础线图
    drawBaseLine (id, graphData) {
      // graphData.seriesData[0]['itemStyle'] = {normal: {label: {show: true}}}
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['android_pv', 'android_uv', 'ios_pv', 'ios_uv'],
          // orient: 'vertical',  // 垂直显示
          y: 'top',    // 延Y轴居中
          x: 'right'
        },
        grid: {
          top: '15%',
          left: '8%',
          right: 0,
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: graphData.xAxisData,
          axisLabel: {
            interval: 0,
            rotate: 20
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'android_pv',
            type: 'line',
            data: graphData.androidPv
          },
          {
            name: 'android_uv',
            type: 'line',
            data: graphData.androidUv
          },
          {
            name: 'ios_pv',
            type: 'line',
            data: graphData.iosPv
          },
          {
            name: 'ios_uv',
            type: 'line',
            data: graphData.iosUv
          }
        ]
      }, true)
    }
  }
}
</script>

<style scoped>
.planEcharts .el-date-editor .el-range-separator{
  width: 8%;
}
.planEcharts{
  width: auto;
  height: auto;
  position: relative;
  /* margin-top: 44px; */
}
#bussScenario{
  width: 95%;
  height:270px
}
#indexTop5{
  width: 95%;
  height:270px;
  /* z-index: 3000; */
  cursor: pointer !important;
}
#crashInfo{
  width: 95%;
  height:270px
}
#pvuv{
  width: 95%;
  height:240px
}
.progresscss{
  background-color: white;
  margin-left: 12px;
  height: 240px;
  width: 13.9%;
  align-content: center;
  position: relative;
}
.passTextCss{
  text-align: center;
  width: 80px;
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-60%);
}
.progresspart{
  margin-left: 10%;
  margin-top: 28%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
.slacss >>> path:last-child {
  stroke: #fbdb5a;
}
.busscss >>> path:last-child {
  stroke: #4b78cd;
}
.productioncss >>> path:last-child {
  stroke: #4cca73;
}
.machinecss >>> path:last-child {
  stroke: #ff9933;
}
.crashcss >>> path:last-child {
  stroke: #9cf;
}
.el-table_header tr,
  .el-table_header th {
    padding: 0;
    height: 30px;
    text-align: center;
}
</style>

<style >
.el-progress--circle,.el-progress-circle{width: 110px;
    height: 110px;
}
.el-row{
  display:flex;
}
.headWarp[data-v-64ca2e58]{
  background-color: #4B78CD;
}
/* .quality {
  background-color: white;
} */


/* 导航盒子 */
.headWarp{
  background-color: #4B78CD !important;
  height: 43px !important;
}
/* ul导航 */
.el-menu {
  background-color: #4B78CD !important;
  height:44px !important;
}

/* 导航li */
.el-menu-item{
  background-color: #4B78CD !important;
  height: 100% !important;
  line-height: 44px !important;
}

.progresscss{
  flex: 1;
   display: flex;
  align-items: center;
  margin-right: 0 !important;
}
.progresspart{
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.passTextCss{
  margin: 0 !important;
}
.el-progress-circle{
  width: 100% !important;
}
/* .resize-triggers{
  flex: 2;
  display: flex;
}
.expand-trigger{
  flex: 1;
} */
.el-table__header{
  width: 100% !important;
}
.has-gutter{
  width: 100% !important;
  /* position: absolute; */
  /* top: 0;
  left: 0;
  height: 50px !important;
  z-index: 100; */
}
table{
  width: 100% !important;
}
thead{
  width: 100% !important;
}
/* .el-table--scrollable-x .el-table__body-wrapper{
  overflow-x:hidden;
} */
#changeColor .changeColor,
#changeColor .el-table th,
#thchange .el-table th{
  background-color: #4B78CD !important;
  width: 100% !important;
  color: #fff;
  font-family: "微软雅黑"
}
#thchange .el-table__header{
  width: 100% !important;
}
.el-table_header::-webkit-scrollbar {/*滚动条整体样式*/

        width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/

        height: 1px;
        display: none;

    }

.el-table_header::-webkit-scrollbar-thumb {/*滚动条里面小方块*/

        border-radius: 10px;

        /* -webkit-box-shadow: inset 0 0 5px rgba(65, 63, 63, 0.2); */

        background: #cfcfcf;

    }

.el-table_header::-webkit-scrollbar-track {/*滚动条里面轨道*/

        /* -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); */

        border-radius: 10px;

        background: #EDEDED;

}
.problems::-webkit-scrollbar {/*滚动条整体样式*/

        width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/

        height: 1px;
        display: none;

    }

.problems::-webkit-scrollbar-thumb {/*滚动条里面小方块*/

        border-radius: 10px;

        /* -webkit-box-shadow: inset 0 0 5px rgba(65, 63, 63, 0.2); */

        background: #cfcfcf;

    }

.problems::-webkit-scrollbar-track {/*滚动条里面轨道*/

        /* -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); */

        border-radius: 10px;

        background: #EDEDED;

}
.el-table .warning-row {
    background: #e1f0ff;
  }
.el-progress--circle, .el-progress-circle {
    width: 65%;
    /* min-height: 52%; */
    margin-bottom: 15%;
}
.progresscss h2{
  margin: 0;
  padding: 0;
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 16px;
}
#changeColor{
  position: relative;
}
.waitres{
  position: absolute;
  top: 0;
  right: 30%;
  z-index: 1000;
  color: #fff;
  height: 48px;
  line-height: 48px;
  font-weight: 700;
}
.waitres1{
  position: absolute;
  top: 0;
  right: 10%;
  z-index: 1000;
  color: #fff;
  height: 48px;
  line-height: 48px;
  font-weight: 700;
}
.el-col-6{
  width: 24%;
}

/* 心电图 */
.xd{
      position: absolute;
      bottom: 0;
      left: 0;
        width: 100%;
        margin: auto;
        height: 32px;
        overflow: hidden;
    }
    .boxshow{
        width: 100%;
        height: 32px;
        /* margin: auto; */
        /* overflow: hidden; */
        position: relative;
        animation: xds 2s infinite linear;
    }
    .zx{
        /* display: inline-block; */
        position: absolute;
        left: 0;
        top:0;
    }
    .zxx{
        position: absolute;
        right: 100%;
        top: 0;
    }
    @keyframes xds{
        0%{
            transform: translate(0)
        }
        100%{
            transform: translate(100%)
        }
    }
    .zx,
    .zxx{
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        background-color: #fbdb5a;
        justify-content: center;
        overflow: hidden;
    }
    .heng{
        width: 60px;
        height: 2px;
        border-bottom: 2px solid #fff;
        margin-top: 2px;
    }
</style>
<style>
    /* .el-tooltip__popper {
      max-width: 240px;
    } */
    .el-table th.gutter{
      height: 46px !important;
    }
    /* .el-table td, .el-table th.is-leaf{
      border-bottom: none;
    } */
</style>
