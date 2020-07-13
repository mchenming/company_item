<template>
  <div class="newleader">
    <div class="topleader" style="width:100%">
      <el-row style="height:65px;line-height:65px;background-color:white;margin-bottom:10px;">
        <el-col :span="8"  v-if="this.activeName === 'second'">
          <span style="margin-left:20px;">时间范围:</span>
          <el-date-picker
            v-model="publicdata.changeTime"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['08:00:00', '08:00:00']"
            value-format="yyyy-MM-dd"
            @change="choosetimechange"
            style="margin-left:15px;width:70%;height:50px;"
            :clearable="false"
            >
          </el-date-picker>
        </el-col>
        <el-col :span="14">
          <span style="margin-left:20px;">项目:</span>
          <el-select v-model="publicdata.projectid" placeholder="请选择" @change='changeproject' multiple style='width:80%'>
              <!-- <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:200px" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input> -->
              <el-option
                v-for="item in proabout"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="leaderrep">
            <el-tab-pane label="按最新版本统计" name="first">
              <el-row style="margin-top:15px;" class="etit">
                <el-col :span="4" class="elog">
                    <div class="titlogbox" style="display:flex;cursor:pointer" @click="changeversionpage">
                        <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                          <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">9</p>
                        </div>
                        <div class="right" style="flex:1">
                          <span class="fa fa-bank (alias) fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                        </div>
                    </div>
                          <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">进行中版本</p>
                </el-col>
                <el-col :span="4" class="elog">
                    <div class="titlogbox" style="display:flex;cursor:pointer" @click="changeneedpage">
                        <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                          <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;"></p>
                        </div>
                        <div class="right" style="flex:1">
                          <span class="fa fa-bell fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                        </div>
                    </div>
                          <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">需求&nbsp;&nbsp;(总计)</p>
                </el-col>

                <el-col :span="4" class="elog">
                    <div class="titlogbox" style="display:flex;cursor:pointer" @click="needlist">
                        <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                          <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;"></p>
                        </div>
                        <div class="right" style="flex:1">
                          <span class="fa fa-puzzle-piece fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                        </div>
                    </div>
                          <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">内部需求&nbsp;&nbsp;(总计)</p>
                </el-col>

                <el-col :span="4" class="elog">
                    <div class="titlogbox" style="display:flex;cursor:pointer" @click="changedefect">
                        <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                          <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{(projectListData[3].totalNum)-projectListData[3].unfinishedNum}}/{{projectListData[3].totalNum}}</p>
                        </div>
                        <div class="right" style="flex:1">
                          <span class="fa fa-bug fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                        </div>
                    </div>
                          <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">缺陷&nbsp;&nbsp;(关闭/总计)</p>
                </el-col>
                <el-col :span="4" class="elog">
                    <div class="titlogbox" style="display:flex;cursor:pointer" @click="changeproline">
                        <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                          <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">210</p>
                        </div>
                        <div class="right" style="flex:1">
                          <span class="fa fa-question-circle fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                        </div>
                    </div>
                          <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">产线问题(关闭/新增)</p>
                </el-col>
                <el-col :span="4" class="elog">
                    <div class="titlogbox" style="display:flex;cursor:pointer" @click="changetask">
                        <div class="left" style="flex:2;display:flex;justify-content: center;align-center: center;flex-flow:wrap;">
                          <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{projectListData[2].totalNum}}/{{projectListData[1].totalNum}}</p>
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
                          <p style="margin:0;padding:0;width:100%;text-align:center;line-height:80px;height:70px;font-size:25px;">{{projectListData[5].totalNum}}</p>
                        </div>
                        <div class="right" style="flex:1">
                          <span class="fa fa-times-circle fa-4x" style="color:#4b78cd;line-height:70px;"></span>
                        </div>
                    </div>
                          <p style="margin:0;padding:0 0 0 13px;width:100%;height:30px;line-height:30px;">Redmine不规范</p>
                </el-col>
              </el-row>
              <div class="itemport" v-loading="projectlistLoading">
                <p>未关闭需求</p>
                <div id="leaderdemand" style="width:100%;height:240px;margin:auto;"></div>
              </div>
              <div class="leaderheader">
                <div class="leaderdemand" v-loading="projectlistLoading">
                  <p style="float: left">产线问题</p>
                  <div id="itemport" style="width:100%;height:230px;"></div>
                </div>
                <div class="redminitem" v-loading="redmineLoading">
                  <p>Redmine不规范--项目</p>
                  <div id="redminitem" style="width:100%;height:220px;"></div>
                </div>
              </div>
              <div class="leaderfooter" v-loading="projectlistLoading">
                  <div class="leaderregst" style="position:relative;">
                    <p>项目进度</p>
                    <div class="ballbox" style="display:flex;width:100%;padding-right:30px;">
                      <div class="bleftbox" style="width:147px;"></div>
                      <div class="askitem">
                        <div class="titleitemname" v-if="!Isshow">
                          <span>总进度</span><br>
                          <span style="font-size:12px">(已完成&nbsp;/&nbsp;任务总数)</span>
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
                          <span style="font-size:12px">(关闭&nbsp;/&nbsp;总计)</span>                                  
                        </div>
                        <div class="titleitemname">
                          <span>Redmine不规范</span><br>
                          <span style="font-size:12px">(违规&nbsp;/&nbsp;issue总计)</span>                                  
                        </div>
                      </div>
                    </div>
                    <div id="leaderregst" style="width:100%;margin-top:0px;overflow-y:auto" v-if="jzrate === true" ref="slidebox">
                      <div class="item" style="margin-right:30px;" v-for="(item, index) in proinfo" :key="item.id">
                        <div class="infobox" style="width:100%;height:20px;display:flex;">
                          <div class="leftbox" style="width:147px;height:1px;"></div>
                          <!-- 盒子上面注释x/x -->
                          <div class="rightbox" style="width:90%;display:flex">
                            <div class="allinfo" v-if="!Isshow">{{item.zjdinfo}}</div>
                            <div class="allinfo">{{item.xqinfo}}</div>
                            <div class="allinfo">{{item.kfinfo}}</div>
                            <div class="allinfo">{{item.csinfo}}</div>
                            <!-- sss -->
                            <div class="allinfo">{{item.buginfo}}</div>
                            <div class="allinfo">{{item.buginfo}}</div>
                            <div class="allinfo">{{item.buginfo}}</div>
                          </div>
                        </div>
                        <div class="forbox">
                          <div class="iteminfo">
                            <div @click="goQualityPort(item)" class="itemname" v-if="item.color === 'red'" style="color:red"><div style="width:90%;cursor:pointer">{{item.name}}</div></div>
                            <div @click="goQualityPort(item)" class="itemname" v-else><div style="width:90%;cursor:pointer">{{item.name}}</div></div>
                            <div class="itemversion">
                              <!-- 需要传递盒子遍历出来的项目名字和版本信息再根据版本传递版本id -->
                              <el-select v-model="item.versionid" placeholder="请选择" @change="changeitem(item.id, item.versionid, index)">  
                                <el-option v-for="ver in item.version" :key="ver.id" :label="ver.text" :value="ver.id">
                                </el-option>
                              </el-select>
                            </div>
                          </div>
                          <div @click="goQualityPort(item)" style="display: flex;justify-content: flex-end;width:90%;height:100%;align-items: flex-start;cursor:pointer">
                            
                            <div class="box" v-if="item.ztype === 'wu'" style="flex:1;height:30px;color:#fff;background:#606061;border-radius:30px;" v-show="!Isshow">无任务</div>
                            <el-progress v-else :percentage='item.zjdname' :stroke-width="30" :text-inside='true' class="first" v-show="!Isshow"></el-progress>
                            
                            
                            <div class="box" v-if="item.xqtype === 'wu'" style="flex:1;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                            <el-progress v-else :percentage='item.xqjdname' :stroke-width="30" :text-inside='true' class="second"></el-progress>
                    
                            <div class="box" v-if="item.kftype === 'wu'" style="flex:1;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                            <el-progress v-else :percentage='item.kfjdname' :stroke-width="30" :text-inside='true' class="first"></el-progress>
      
                            <div class="box" v-if="item.cstype === 'wu'" style="flex:1;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                            <el-progress v-else :percentage='item.csjdname' :stroke-width="30" :text-inside='true' class="second"></el-progress>
      
                            <div class="box" v-if="item.bugtype === 'wu'" style="flex:1;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                            <el-progress v-else :percentage='item.bugjd' :stroke-width="30" :text-inside='true' class="first"></el-progress>
                            <!-- 假数据布局 -->
                            <div class="box" v-if="item.bugtype === 'wu'" style="flex:1;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                            <el-progress v-else :percentage='item.bugjd' :stroke-width="30" :text-inside='true' class="second"></el-progress>
                            <div class="box" v-if="item.bugtype === 'wu'" style="flex:1;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                            <el-progress v-else :percentage='item.bugjd' :stroke-width="30" :text-inside='true' class="first"></el-progress>
                          </div>
                        </div>
                      </div>
                    </div> 
                  </div>
              </div>
            </el-tab-pane>
            <!-- 按时间tabs -->
            <el-tab-pane label="按时间统计" name="second">
              <timepage :senddata='publicdata'></timepage>
            </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    
        

        <div class="leader" v-loading="projectlistLoading" element-loading-text="加载中。。。">
          <!-- 底部公共的表格部分 -->
          <div class="ranking">
            <div class="rleft" style="margin-right:20px;">
              <div class="tabletitle" style="height:36px;line-height:36px;width:100%;display:flex;justify-content: center;color:#fff;background:#4b78cd;font-size:18px;">活跃排行榜(近七天)</div>
                <el-row>
                  <el-col :span="8">
                    <el-table :data="prodesctableData" style="width: 100%;" v-loading="projectlistLoading" :row-class-name="tableRowClassName" border 
                      :header-cell-style="{background:'rgb(134,164,218)',color:'#fff'}"  class="ltab"
                      :default-sort="{prop: '', order: ''}" tooltip-effect="dark" 
                      @sort-change="prodescchangeOrder">
                        <!-- <el-table-column type="index" label="排名" align="center" width='50'></el-table-column> -->
                        <el-table-column  label="项目" align="center"  show-overflow-tooltip height='36'>
                          <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.prodescname" placement="top"> -->
                              <span>{{maxText(scope.row.prodescname)}}</span>
                            <!-- </el-tooltip> -->
                          </template>
                        </el-table-column>
                        <el-table-column prop="prodescnum" label="issue数" sortable="custom" align="center" width='100'></el-table-column>
                      </el-table>
                  </el-col>
                  <el-col :span="8">
                    <el-table :data="authordesctableData" style="width: 97%;margin-left: 3%;" v-loading="projectlistLoading" :row-class-name="tableRowClassName" border 
                      :header-cell-style="{background:'rgb(134,164,218)',color:'#fff'}"  class="ltab"
                      :default-sort="{prop: '', order: ''}"
                      @sort-change="autdescchangeOrder">
                        <el-table-column prop="authordescname" label="人员" align="center" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <span>{{maxText(scope.row.authordescname)}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="authordescnum" label="issue数" sortable="custom" align="center" width='100'></el-table-column>
                      </el-table>
                  </el-col>
                  <el-col :span="8">
                    <el-table :data="lcdesctableData" style="width: 97%;margin-left: 3%;" v-loading="projectlistLoading" :row-class-name="tableRowClassName" border 
                      :header-cell-style="{background:'rgb(134,164,218)',color:'#fff'}"  class="ltab"
                      :default-sort="{prop: '', order: ''}" tooltip-effect="dark"
                      @sort-change="lcdescchangeOrder">
                        <el-table-column prop="lcdescname" label="流程" align="center" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <span>{{maxText(scope.row.lcdescname)}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="lcdescnum" label="issue数" sortable="custom" align="center" width='100'></el-table-column>
                      </el-table>
                  </el-col>
                </el-row>
            </div>
            <div class="rright">
              <div class="tabletitle" style="height:36px;line-height:36px;width:100%;display:flex;justify-content: center;color:#fff;background:rgba(245, 108, 108, 1);font-size:18px;">不活跃排行榜</div>
              <el-row>
                <el-col :span="8">
                  <el-table :data="proasctableData" v-loading="projectlistLoading" style="width: 100%;" :row-class-name="tableRow" border :header-cell-style="{background:'rgb(244,134,134)',color:'#fff'}"
                    :default-sort="{prop: '', order: ''}" tooltip-effect="dark"
                    @sort-change="proascchangeOrder">
                      <el-table-column prop="proascname" label="项目" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span>{{maxText(scope.row.proascname)}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="proascnum" label="不活跃天数" sortable="custom" align="center" width='120'></el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="8">
                  <el-table :data="autasctableData" v-loading="projectlistLoading" style="width: 97%;margin-left: 3%;" :row-class-name="tableRow" border :header-cell-style="{background:'rgb(244,134,134)',color:'#fff'}"
                    :default-sort="{prop: '', order: ''}"
                    @sort-change="autascchangeOrder">
                      <el-table-column prop="authorascname" label="人员" align="center" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <span>{{maxText(scope.row.authorascname)}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column prop="authorascnum" label="不活跃天数" sortable="custom" align="center" width='120'></el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="8">
                  <el-table :data="lcasctableData" v-loading="projectlistLoading" style="width: 97%;margin-left: 3%;" :row-class-name="tableRow" border :header-cell-style="{background:'rgb(244,134,134)',color:'#fff'}"
                    :default-sort="{prop: '', order: ''}" tooltip-effect="dark"
                    @sort-change="lcascchangeOrder">
                      <el-table-column prop="lcascname" label="流程" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span>{{maxText(scope.row.lcascname)}}</span>                        
                        </template>
                      </el-table-column>
                      <el-table-column prop="lcascnum" label="不活跃天数" sortable="custom" align="center" width='120'></el-table-column>
                    </el-table>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
  </div>
</template>

<script src="http://echarts.baidu.com/build/dist/echarts.js"></script>

<script>
import {reqchecklist, mouthadd, getqualitydatav2, getprojectdatav2, getProjectRateByUser, getActiveData, getBugByTIme} from '@/api/xyzqPort/leaderReport'
import echarts from 'echarts'
import API from '@/api'
import { getUUID } from '@/utils'
import {getxqdatav2, getchecklist, getkfdata, getcsdata, getplantime, getbugdatav2, getillegalnumlist} from '@/api/xyzqPort/qualityPort'
import timepage from '../templates/newtemplate.vue'
export default {
  data () {
    return {
      bugTimeType: 0,
      tcbugTimeType: 0,
      xfbugTimeType: 0,
      userId: '',
      jzrate: false,
      projectlistLoading: false,
      redmineLoading: true,
      taskListDatass: [],
      taskIds: [],
      xqIds: '',
      listQuery: {
        project_id: '',
        version_id: ''
      },
      customColor: '#000000',
      projectOptions: [],
      projectListData: [],
      prooptions: [],
      value: '',
      version: [],
      proobj: {
        project_id: 27,
        version_id: 980
      },
      proinfo: [],
      val: [],
      list: [],
      list2: [],
      nowmouth: [],
      lastmouth: [],
      nowsolve: [],
      lastsolve: [],
      bugIds: '',
      byxz: 0,
      syxz: 0,
      bylj: 0,
      sylj: 0,
      xfbuglist: [],
      prodesctableData: [],
      authordesctableData: [],
      lcdesctableData: [],
      proasctableData: [],
      autasctableData: [],
      lcasctableData: [],
      authorsarr: [],
      allitems: [],
      activeName: 'first',
      publicdata: {
        changeTime: [],
        projectid: '',
        iteminfo: [],
        allitem: []
      },
      Isshow: true,
      proabout: []
    }
  },
  created () {
    this.getnowtime()
    this.getUserProject()
    this.getActiveData()
  },
  mounted () {
    if (this.$route.query.activeName) {
      // console.log('我是')
      this.activeName = this.$route.query.activeName
    }
    if (this.$route.query.stime) {
      this.publicdata.changeTime[0] = this.$route.query.stime
      this.publicdata.changeTime[1] = this.$route.query.etime
      this.publicdata.projectid = this.$route.query.proid
      // console.log(123132)
    }
  },
  components: {
    timepage
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab)
      if (this.activeName === 'first') {
        this.Isshow = true
        // console.log(this.Isshow)
      } else if (this.activeName === 'second') {
        this.Isshow = false
        // console.log(this.Isshow)
      }
    },
    // 跳转到需求二级页面
    changeneedpage () {
      const row = {
        project_id: '',
        type: '1',
        status: 0
      }
      this.$router.push({path: '/yewuneed', query: row})
    },
    needlist () {
      const row = {
        project_id: '',
        type: '1',
        status: 0,
        stime: this.publicdata.changeTime[0],
        etime: this.publicdata.changeTime[1]
      }
      this.$router.push({path: '/needlist', query: row})
    },
    // 跳转到上线版本的二级页面
    changeversionpage () {
      this.$router.push('/eronlineversion')
    },
    changedefect () {
      this.$router.push('/newdefect')
    },
    changeproline () {
      const row = {
        mouthValue: '本月',
        type: '累积待解决'
      }
      this.$router.push({path: '/newerprob', query: row})
    },
    changetask () {
      this.$router.push('/newtask')
    },
    changeredmine () {
      localStorage.removeItem('trackerId')
      localStorage.removeItem('name')
      localStorage.removeItem('itemname')
      this.$router.push('/newRedmine')
    },
    goesubmission () {
      this.$router.push('/esubmission')
    },
    goQualityPort (row) {
      localStorage.setItem('tabIndex', '454')
      var cs = ''
      if (typeof (row.versionid) !== 'undefined' && row.versionid !== null) {
        cs = '&version_id=' + row.versionid
      }
      var urlHost = 'http://' + window.location.host + '/port/#/qualityPort?project_id=' + row.id + cs
      window.open(urlHost)
      // this.$router.push({path: '/qualityPort', query: data})
      // this.$router.push('/qualityPort?project_id=' + row.id + '&version_id=' + row.versionid)
    },
    erstandard () {
      this.$router.push('/erstantard')
    },
    changeproject (val) {
      for (let i = 0; i < this.publicdata.projectid.length; i++) {
        if (this.publicdata.projectid[i] === '0') {
          this.publicdata.projectid = []
          console.log(123)
        }
      }
      // console.log(val)
      // console.log(this.projectListData)
    },
    // 事件处理函数
    getnowtime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      var s = this.getTimeByDate(start)
      var e = this.getTimeByDate(end)
      // console.log(s)
      this.publicdata.changeTime[0] = s
      this.publicdata.changeTime[1] = e
    },
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
    choosetimechange (val) {
      // console.log(val)
    },
    // 处理方法和排序
    maxText (descText) {
      if (descText != null && descText !== '' && descText.length > 10) {
        return descText.substr(0, 10) + '...'
      } else {
        return descText
      }
    },
    resText (descText) {
      if (descText != null && descText !== '' && descText.length > 8) {
        return descText.substr(0, 8) + '\n' + descText.substr(9)
      } else {
        return descText
      }
    },
    prodescchangeOrder (column, prop, order) {
      var key = column.prop
      this.prodesctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    autdescchangeOrder (column, prop, order) {
      var key = column.prop
      this.authordesctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    lcdescchangeOrder (column, prop, order) {
      var key = column.prop
      this.lcdesctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    proascchangeOrder (column, prop, order) {
      var key = column.prop
      this.proasctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    autascchangeOrder (column, prop, order) {
      var key = column.prop
      this.autasctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    lcascchangeOrder (column, prop, order) {
      var key = column.prop
      this.lcasctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    //       -------
    getActiveData () {
      getActiveData().then(response => {
        this.prodesctableData = response.data.prodesc
        this.authordesctableData = response.data.authordesc
        this.lcdesctableData = response.data.lcdesc
        this.proasctableData = response.data.proasc
        this.autasctableData = response.data.authorasc
        this.lcasctableData = response.data.lcasc
      })
    },
    // 下面表格的隔行变色方法
    tableRow ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'pink-row'
      } else if (rowIndex % 2 === 0) {
        return 'success-row'
      }
      return ''
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else if (rowIndex % 2 === 0) {
        return 'success-row'
      }
      return ''
    },
    changeitem (proid, vsid, index) {
      // var obj1 = {
      //   project_id: proid,
      //   version_id: vsid,
      //   complete_flag: 1
      // }
      // var obj2 = {
      //   project_id: proid,
      //   version_id: vsid,
      //   complete_flag: 0
      // }
      // this.getproname(obj1, obj2, index)
      var row = {
        project_id: proid,
        version_id: vsid,
        userId: this.userId
      }
      this.getRateByVersion(row, index)
      this.$forceUpdate()
    },
    getRateByVersion (row, index) {
      getProjectRateByUser(row).then(response => {
        var data = response.data.result
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            const ele = data[i]
            // console.log(ele)
            if (i < data.length - 1) {
              const item = {}
              var xqtype = ''
              var xqclose = Number(typeof (ele.reqclose) === 'undefined' || ele.reqclose === null ? 0 : ele.reqclose)
              var xqtotal = Number(typeof (ele.reqTotal) === 'undefined' || ele.reqTotal === null ? 0 : ele.reqTotal)
              var xqjd = xqclose / xqtotal
              if (xqtotal === 0) {
                xqtype = 'wu'
              }
              if (Number.isNaN(xqjd)) {
                xqjd = 0
              } else if (xqjd !== 100 && xqjd !== 0) {
                xqjd = (xqjd * 100).toFixed(2)
              }
              var kftype = ''
              var kfclose = Number(typeof (ele.kfclose) === 'undefined' || ele.kfclose === null ? 0 : ele.kfclose)
              var kftotal = Number(typeof (ele.kfTotal) === 'undefined' || ele.kfTotal === null ? 0 : ele.kfTotal)
              var kfjd = kfclose / kftotal
              if (kftotal === 0) {
                kftype = 'wu'
              }
              if (Number.isNaN(kfjd)) {
                kfjd = 0
              } else if (kfjd !== 100 && kfjd !== 0) {
                kfjd = (kfjd * 100).toFixed(2)
              }
              var csclose = Number(typeof (ele.csclose) === 'undefined' || ele.csclose === null ? 0 : ele.csclose)
              var cstotal = Number(typeof (ele.csTotal) === 'undefined' || ele.csTotal === null ? 0 : ele.csTotal)
              var csjd = csclose / cstotal
              var cstype = ''
              if (cstotal === 0) {
                cstype = 'wu'
              }
              if (Number.isNaN(csjd)) {
                csjd = 0
              } else if (csjd !== 100 && csjd !== 0) {
                csjd = (csjd * 100).toFixed(2)
              }
              var zjd = (kfclose + csclose + xqclose) / (kftotal + cstotal + xqtotal)
              var ztype = ''
              if ((kftotal + cstotal + xqtotal) === 0) {
                ztype = 'wu'
                // item.zjdname = 0
              }
              if (Number.isNaN(zjd)) {
                zjd = 0
              } else if (zjd !== 100 && zjd !== 0) {
                zjd = (zjd * 100).toFixed(2) - 0
              }
              var bugjd = Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose) / Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              var bugtype = ''
              if (Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal) === 0) {
                bugtype = 'wu'
              }
              if (Number.isNaN(bugjd)) {
                bugjd = 0
              } else if (bugjd !== 100 && bugjd !== 0) {
                bugjd = (bugjd * 100).toFixed(2)
              }
              item.xqjdname = xqjd - 0
              item.xqtype = xqtype
              item.xqinfo = xqclose + '/' + xqtotal
              item.kfinfo = kfclose + '/' + kftotal
              item.zjdinfo = (kfclose + csclose + xqclose) + '/' + (kftotal + cstotal + xqtotal)
              item.csinfo = csclose + '/' + cstotal
              item.buginfo = Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose) + '/' + Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              item.bugjd = bugjd - 0
              item.kfjdname = kfjd - 0
              item.csjdname = csjd - 0
              item.zjdname = zjd
              item.taskTotal = kftotal + cstotal
              item.kftype = kftype
              item.cstype = cstype
              item.ztype = ztype
              item.bugtype = bugtype
              item.versionid = row.version_id
              item.name = ele.project_name
              item.version = ele.version
              item.id = ele.project_id
              this.proinfo[index] = item
              this.$forceUpdate()
            }
          }
        } else {
          this.proinfo[index].xqjdname = 0
          this.proinfo[index].xqtype = 'wu'
          this.proinfo[index].xqinfo = '0/0'
          this.proinfo[index].kfinfo = '0/0'
          this.proinfo[index].zjdinfo = '0/0'
          this.proinfo[index].csinfo = '0/0'
          this.proinfo[index].buginfo = '0/0'
          this.proinfo[index].bugjd = 0
          this.proinfo[index].kfjdname = 0
          this.proinfo[index].csjdname = 0
          this.proinfo[index].zjdname = 0
          this.proinfo[index].taskTotal = 0
          this.proinfo[index].kftype = 'wu'
          this.proinfo[index].cstype = 'wu'
          this.proinfo[index].ztype = 'wu'
          this.proinfo[index].bugtype = 'wu'
        }
      })
    },
    getUserProject () {
      this.projectlistLoading = true
      this.userId = ''
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            serNo: getUUID()
          }
          this.userId = data.user.userId
          this.getProjectRate(row)
          this.getBugByAuthor('all')
          this.getBugByTImeVal()
          // this.getProductData(row)
        }
      })
    },
    // getProductData (row) {
    //   getProductData(row).then(response => {
    //     var resdata = {
    //       arr1: response.data.by,
    //       arr2: response.data.sy
    //     }
    //     this.echartsproline('leaderline', resdata)
    //   })
    // },
    getBugByAuthor (type) {
      this.authorsarr = []
      const end = new Date()
      const start = new Date()
      var tcEnd = this.getTimeByDate(end)
      var tcStart = ''
      if (this.tcbugTimeType === 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        tcStart = this.getTimeByDate(start)
      } else if (this.tcbugTimeType === 2) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        tcStart = this.getTimeByDate(start)
      } else if (this.tcbugTimeType === 3) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        tcStart = this.getTimeByDate(start)
      } else {
        tcStart = ''
        tcEnd = ''
      }
      const xfend = new Date()
      const xfstart = new Date()
      var xfEnd = ''
      var xfStart = ''
      xfEnd = this.getTimeByDate(xfend)
      if (this.xfbugTimeType === 1) {
        xfstart.setTime(xfstart.getTime() - 3600 * 1000 * 24 * 6)
        xfStart = this.getTimeByDate(xfstart)
      } else if (this.xfbugTimeType === 2) {
        xfstart.setTime(xfstart.getTime() - 3600 * 1000 * 24 * 30)
        xfStart = this.getTimeByDate(xfstart)
      } else if (this.xfbugTimeType === 3) {
        xfstart.setTime(xfstart.getTime() - 3600 * 1000 * 24 * 90)
        xfStart = this.getTimeByDate(xfstart)
      } else {
        xfEnd = ''
        xfStart = ''
      }
      // const row = {
      //   userId: this.userId,
      //   tcstart: tcStart,
      //   tcend: tcEnd,
      //   xfstart: xfStart,
      //   xfend: xfEnd,
      //   serNo: getUUID(),
      //   type: type
      // }
      // getBugByAuthor(row).then(response => {
      //   // console.log(response.data)
      //   this.authorsarr = response.data.tc
      //   if (type === 'tj' || type === 'all') {
      //     var newarr2 = []
      //     var name2 = []
      //     var obj2 = {
      //       name: name2,
      //       count: newarr2
      //     }
      //     // 提交缺陷数排在前十的数组对象
      //     if (response.data.tc.length > 0) {
      //       response.data.tc.forEach(item => {
      //         if (newarr2.length < 10) {
      //           newarr2.push(item.totalnum)
      //           name2.push(item.firstname)
      //         }
      //       })
      //       obj2.name = name2
      //       obj2.count = newarr2
      //     }
      //     // console.log(obj2)
      //     // this.echartssubmitline('leadersubmit', obj2)
      //   }
      //   if (type === 'xf' || type === 'all') {
      //     var newarr = []
      //     var name = []
      //     var obj = {
      //       name: name,
      //       count: newarr
      //     }
      //     // 修复缺陷数排在前十的数组对象
      //     if (response.data.xf.length > 0) {
      //       response.data.xf.forEach(item => {
      //         if (newarr.length < 10) {
      //           newarr.push(item.totalnum)
      //           name.push(item.firstname)
      //         }
      //       })
      //       obj.name = name
      //       obj.count = newarr
      //     }
      //     // this.echartsrepaireline('leaderRepair', obj)
      //   }
      // })
    },
    getProjectRate (row) {
      this.projectListData = [
        {indtype: '需求任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '开发任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '测试任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '缺陷', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: 'up'},
        {indtype: '任务总数', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: 'Redmine不规范', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: ''}
      ]
      this.jzrate = false
      getProjectRateByUser(row).then(response => {
        var data = response.data.result
        // console.log(data)
        var proabout = []
        data.forEach(item => {
          proabout.push({id: item.project_id, name: item.project_name})
        })
        proabout.unshift({id: '0', name: '全部'})
        this.proabout = proabout
        this.publicdata.allitem = proabout
        if (data[data.length - 1].unreq.length > 0) {
          this.proinfo = []
          // this.xqdata.newadd = 0
          // this.xqdata.complete = 0
          // this.bugdata.newadd = 0
          // this.bugdata.close = 0
          var proIds = []
          // var pbrow = []
          for (let i = 0; i < data.length; i++) {
            const ele = data[i]
            // console.log(ele)
            if (i < data.length - 1) {
              this.projectListData[0].totalNum += Number(typeof (ele.reqTotal) === 'undefined' || ele.reqTotal === null ? 0 : ele.reqTotal)
              this.projectListData[0].unfinishedNum += Number(typeof (ele.reqTotal) === 'undefined' || ele.reqTotal === null ? 0 : ele.reqTotal) - Number(typeof (ele.reqclose) === 'undefined' || ele.reqclose === null ? 0 : ele.reqclose)
              this.projectListData[0].todayFinish += Number(typeof (ele.reqtodayfinish) === 'undefined' || ele.reqtodayfinish === null ? 0 : ele.reqtodayfinish)
              this.projectListData[1].totalNum += Number(typeof (ele.kfTotal) === 'undefined' || ele.kfTotal === null ? 0 : ele.kfTotal)
              this.projectListData[1].unfinishedNum += Number(typeof (ele.kfTotal) === 'undefined' || ele.kfTotal === null ? 0 : ele.kfTotal) - Number(typeof (ele.kfclose) === 'undefined' || ele.kfclose === null ? 0 : ele.kfclose)
              this.projectListData[1].todayFinish += Number(typeof (ele.kftodayfinish) === 'undefined' || ele.kftodayfinish === null ? 0 : ele.kftodayfinish)
              this.projectListData[2].totalNum += Number(typeof (ele.csTotal) === 'undefined' || ele.csTotal === null ? 0 : ele.csTotal)
              this.projectListData[2].unfinishedNum += Number(typeof (ele.csTotal) === 'undefined' || ele.csTotal === null ? 0 : ele.csTotal) - Number(typeof (ele.csclose) === 'undefined' || ele.csclose === null ? 0 : ele.csclose)
              this.projectListData[2].todayFinish += Number(typeof (ele.cstodayfinish) === 'undefined' || ele.cstodayfinish === null ? 0 : ele.cstodayfinish)
              this.projectListData[3].totalNum += Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              this.projectListData[3].unfinishedNum += Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal) - Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose)
              this.projectListData[3].todayFinish += Number(typeof (ele.bugtodayfinish) === 'undefined' || ele.bugtodayfinish === null ? 0 : ele.bugtodayfinish)
              // const pb = {
              //   proname: ele.project_name,
              //   probug: Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal),
              //   scfknum: Number(typeof (ele.scfknum) === 'undefined' || ele.scfknum === null ? 0 : ele.scfknum)
              // }
              // pbrow.push(pb)
              const item = {}
              var xqtype = ''
              var xqclose = Number(typeof (ele.reqclose) === 'undefined' || ele.reqclose === null ? 0 : ele.reqclose)
              var xqtotal = Number(typeof (ele.reqTotal) === 'undefined' || ele.reqTotal === null ? 0 : ele.reqTotal)
              // this.xqdata.complete += (xqclose)
              // this.xqdata.newadd += Number(typeof (ele.reqnew) === 'undefined' || ele.reqnew === null ? 0 : ele.reqnew)
              var xqjd = xqclose / xqtotal
              if (xqtotal === 0) {
                xqtype = 'wu'
              }
              if (Number.isNaN(xqjd)) {
                xqjd = 0
              } else if (xqjd !== 100 && xqjd !== 0) {
                xqjd = (xqjd * 100).toFixed(2)
              }
              var kftype = ''
              var kfclose = Number(typeof (ele.kfclose) === 'undefined' || ele.kfclose === null ? 0 : ele.kfclose)
              var kftotal = Number(typeof (ele.kfTotal) === 'undefined' || ele.kfTotal === null ? 0 : ele.kfTotal)
              var kfjd = kfclose / kftotal
              if (kftotal === 0) {
                kftype = 'wu'
              }
              if (Number.isNaN(kfjd)) {
                kfjd = 0
              } else if (kfjd !== 100 && kfjd !== 0) {
                kfjd = (kfjd * 100).toFixed(2)
              }
              var csclose = Number(typeof (ele.csclose) === 'undefined' || ele.csclose === null ? 0 : ele.csclose)
              var cstotal = Number(typeof (ele.csTotal) === 'undefined' || ele.csTotal === null ? 0 : ele.csTotal)
              var csjd = csclose / cstotal
              var cstype = ''
              if (cstotal === 0) {
                cstype = 'wu'
              }
              if (Number.isNaN(csjd)) {
                csjd = 0
              } else if (csjd !== 100 && csjd !== 0) {
                csjd = (csjd * 100).toFixed(2)
              }
              var zjd = (kfclose + csclose + xqclose) / (kftotal + cstotal + xqtotal)
              // var zjd = (kfclose + csclose) / (kftotal + cstotal)
              var ztype = ''
              if ((kftotal + cstotal + xqtotal) === 0) {
                ztype = 'wu'
                // item.zjdname = 0
              }
              if (Number.isNaN(zjd)) {
                zjd = 0
              } else if (zjd !== 100 && zjd !== 0) {
                zjd = (zjd * 100).toFixed(2) - 0
              }
              var bugjd = Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose) / Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              var bugtype = ''
              if (Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal) === 0) {
                bugtype = 'wu'
              }
              if (Number.isNaN(bugjd)) {
                bugjd = 0
              } else if (bugjd !== 100 && bugjd !== 0) {
                bugjd = (bugjd * 100).toFixed(2)
              }
              // this.bugdata.newadd += Number(typeof (ele.bugnew) === 'undefined' || ele.bugnew === null ? 0 : ele.bugnew)
              // this.bugdata.close += Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose)
              item.xqjdname = xqjd - 0
              item.xqtype = xqtype
              item.xqinfo = xqclose + '/' + xqtotal
              item.kfinfo = kfclose + '/' + kftotal
              item.zjdinfo = (kfclose + csclose + xqclose) + '/' + (kftotal + cstotal + xqtotal)
              item.csinfo = csclose + '/' + cstotal
              item.buginfo = Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose) + '/' + Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              item.bugjd = bugjd - 0
              item.kfjdname = kfjd - 0
              item.csjdname = csjd - 0
              item.zjdname = zjd
              item.kftype = kftype
              item.cstype = cstype
              item.ztype = ztype
              item.bugtype = bugtype
              if (typeof (ele.version_id) !== 'undefined' && ele.version_id !== null) {
                item.versionid = ele.version_id
              }
              item.name = ele.project_name
              item.version = ele.version
              item.id = ele.project_id
              if (!item.versionid) {
                item.color = 'red'
              }
              proIds.push(ele.project_id)
              this.proinfo.push(item)
              // console.log(this.proinfo)
              // 查询redmine总计数据
              const startdate = new Date()
              const enddate = new Date()
              startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * 1)
              var end = this.getTimeByDate(enddate)
              var start = this.getTimeByDate(startdate)
              const numrow = {
                project_id: ele.project_id,
                start_date: start,
                end_date: end
              }
              getillegalnumlist(numrow).then(response => {
                if (response.data.data !== null) {
                  for (let val in response.data.data) {
                    for (let value in response.data.data[val]) {
                      this.projectListData[5].totalNum += response.data.data[val][value]
                    }
                  }
                }
              })
            } else if (i === data.length - 1) {
              var req = ele.unreq
              // console.log(req)
              req.sort(this.compare('count', false))
              // console.log(req)
              var newarr = []
              var name = []
              var obj = {}
              req.forEach(item => {
                if (newarr.length < 5 && item.name !== '') {
                  newarr.push(item.count)
                  name.push(item.name)
                }
              })
              obj.name = name
              obj.count = newarr
              this.echartsdemandline('leaderdemand', obj)
            }
          }

          this.publicdata.iteminfo = this.proinfo
          if (this.proinfo.length > 0) {
            this.proinfo.sort(function (obj1, obj2) {
              let val1 = 0
              let val2 = 0
              // val1 = obj1.taskTotal
              // val2 = obj2.taskTotal
              val1 = obj1.zjdinfo.split('/')[1] - 0
              val2 = obj2.zjdinfo.split('/')[1] - 0
              return val2 - val1
            })
          }
          // pbrow.sort(this.compare('probug', false))
          // var proname = []
          // var probug = []
          // var scfknum = []
          // pbrow.forEach(item => {
          //   if (proname.length < 11 && item.proname !== '') {
          //     probug.push(item.probug)
          //     proname.push(item.proname)
          //     scfknum.push(item.scfknum)
          //   }
          // })
          // const row = {
          //   proname: proname,
          //   probug: probug,
          //   scfknum: scfknum
          // }
          // this.echartsitemport('itemport', row)
          // console.log(this.proinfo)
          if (proIds.length > 0) {
            // 查询redmine总计数据
            // const startdate = new Date()
            // const enddate = new Date()
            // startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * 1)
            // var end1 = this.getTimeByDate(enddate)
            // var start1 = this.getTimeByDate(startdate)
            var redminarr = {
              project_id: proIds.join(',')
            }
            // const numrow = {
            //   project_id: proIds.join(','),
            //   start_date: start1,
            //   end_date: end1
            // }
            // getillegalnumlist(redminarr).then(response => {
            //   if (response.data.data !== null) {
            //     for (let val in response.data.data) {
            //       for (let value in response.data.data[val]) {
            //         this.projectListData[5].totalNum += response.data.data[val][value]
            //       }
            //     }
            //   }
            // })
            this.getchecklist(redminarr)
          }
          this.jzrate = true
          this.$forceUpdate()
          this.projectlistLoading = false
          this.projectListData[4].totalNum = this.projectListData[0].totalNum + this.projectListData[1].totalNum + this.projectListData[2].totalNum
          this.projectListData[4].unfinishedNum += this.projectListData[0].unfinishedNum + this.projectListData[1].unfinishedNum + this.projectListData[2].unfinishedNum
          this.projectListData[4].todayFinish += this.projectListData[0].todayFinish + this.projectListData[1].todayFinish + this.projectListData[2].todayFinish
        } else {
          this.jzrate = true
          this.projectlistLoading = false
          this.$message({ title: '失败', message: '暂无权限，请联系管理员！', type: 'error', duration: 3000 })
        }
      })
    },
    getBugByTImeVal () {
      const end = new Date()
      const start = new Date()
      var End = this.getTimeByDate(end)
      var Start = ''
      if (this.bugTimeType === 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        Start = this.getTimeByDate(start)
      } else if (this.bugTimeType === 2) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        Start = this.getTimeByDate(start)
      } else if (this.bugTimeType === 3) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        Start = this.getTimeByDate(start)
      } else {
        Start = ''
        End = ''
      }
      const row = {
        userId: this.userId,
        start: Start,
        end: End
      }
      getBugByTIme(row).then(response => {
        var pbrow = response.data.list
        // console.log(pbrow)
        this.allitems = pbrow
        pbrow.sort(this.compare('scfknum', false))
        // req.sort(this.compare('count', false))
        var proname = []
        var probug = []
        var scfknum = []
        // console.log(pbrow)
        pbrow.forEach(item => {
          if (proname.length < 11 && item.proname !== '') {
            probug.push(item.probug)
            proname.push(item.proname)
            scfknum.push(item.scfknum)
          }
        })
        const row = {
          proname: proname,
          probug: probug,
          scfknum: scfknum
        }
        // console.log(row)
        this.echartsitemport('itemport', row)
      })
    },
    getvpdata (index, params) {
      getprojectdatav2(params).then(response => {
        var rateData = response.data.data
        if (rateData.length > 0) {
          var arr = []
          var date1 = new Date()
          date1 = this.getTimeByDate(date1)
          var boo = true
          for (let i = 0; i < rateData.length; i++) {
            var ele = rateData[i]
            var date = ele[3]
            var vid = ele[6].split(',')[1].split(')')[0].replace(/'/g, '')
            var pid = ele[6].split(',')[0].split('(')[2].replace(/'/g, '')
            var cc = {
              ver: vid,
              xqid: ele[5],
              pid: pid,
              date: ''
            }
            if (date !== null && date !== '') {
              cc.date = date.replace(/-/g, '') - 0
              if (date === date1) {
                boo = false
              }
            }
            arr.push(cc)
          }
          if (boo) {
            var c = {
              ver: '',
              xqid: '',
              date: date1.replace(/-/g, '') - 0
            }
            arr.push(c)
          }
          arr.sort(function (a, b) {
            if (a.date < b.date) {
              return 1
            } else if (a.date > b.date) {
              return -1
            }
          })
          let ind = 0
          for (let j = 0; j < arr.length; j++) {
            var elee = arr[j]
            if ((date1.replace(/-/g, '') - 0) === elee.date) {
              if (boo) {
                ind = arr.indexOf(elee) - 1
              } else {
                ind = arr.indexOf(elee)
              }
            }
          }
          if (ind < 0) {
            ind = 0
            if (arr.length > 1) {
              ind = 1
            }
          }
          const row = {
            project_id: arr[ind].pid,
            version_id: arr[ind].ver
          }
          this.prooptions.push(row)
          var xqid = arr[ind].xqid
          var ids = xqid.substring(xqid.lastIndexOf('(') + 1, xqid.lastIndexOf(')'))
          this.xqIds += ids.split("','")[0].substring(1) + ','
          if (index === this.projectOptions.length - 1) {
            this.getversiondict()
            this.jzrate = false
            var redarr = []
            this.prooptions.forEach((item, index) => {
              redarr.push(Number(item.project_id))
            })
            var redminarr = {
              project_id: redarr.join(',')
            }
            this.getchecklist(redminarr)
          }
        }
      })
    },
    getversiondict () {
      this.projectListData = [
        {indtype: '需求', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '开发', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '测试', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '缺陷', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: 'up'},
        {indtype: '工作量', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: 'Redmine不规范', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: ''}
      ]
      this.bugIds = ''
      var data = []
      this.jzrate = false
      for (let i = 0; i < this.prooptions.length; i++) {
        const ele = this.prooptions[i]
        this.getAddmouth(ele.project_id, i)
        const proquery = {
          project_id: ele.project_id,
          tracker_id: '',
          status_id: '',
          user_id: ''
        }
        getchecklist(proquery).then(response => {
          this.projectListData[5].unfinishedNum += response.data.data.length
        })
        const startdate = new Date()
        const enddate = new Date()
        startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * 1)
        var end = this.getTimeByDate(enddate)
        var start = this.getTimeByDate(startdate)
        const numrow = {
          project_id: ele.project_id,
          start_date: start,
          end_date: end
        }
        getillegalnumlist(numrow).then(response => {
          if (response.data.data !== null) {
            for (let val in response.data.data) {
              for (let value in response.data.data[val]) {
                this.projectListData[5].totalNum += response.data.data[val][value]
              }
            }
          }
        })
        const row1 = {
          project_id: ele.project_id,
          version_id: ele.version_id,
          complete_flag: '1' // 已完成开发任务
        }
        const row2 = {
          project_id: ele.project_id,
          version_id: ele.version_id,
          complete_flag: '0' // 已完成开发任务
        }
        this.getproname(row1, row2, data, i)
        this.$forceUpdate()
      }
    },
    getreqTaskListData () {
      getplantime(this.taskIds).then(response => {
        var kfratetotal = 0
        var csratetotal = 0
        var kftotalNum = 0
        var kffinishedNum = 0
        var cstotalNum = 0
        var csfinishedNum = 0
        var kfrate = 0
        var csrate = 0
        var kfid = ''
        var csid = ''
        var kftotal = 0
        var cstotal = 0
        for (let j = 0; j < this.taskListDatass.length; j++) {
          const element = this.taskListDatass[j]
          for (let k = 0; k < element.data.length; k++) {
            const data = element.data[k]
            var id = data[1].split(' ')[4].replace('#', '')
            var reqid = response.data.data[id].parent_id + ''
            data[14] = reqid
            if (element.type === 'kf') {
              kftotal += 1
              kfid = id
              if (data[4] === '已关闭') {
                kfrate += 1
              }
            }
            if (element.type === 'cs') {
              cstotal += 1
              csid = id
              if (data[4] === '已关闭') {
                csrate += 1
              }
            }
            var kftime = '--'
            var cstime = '--'
            for (let value in response.data.data) {
              if (kfid === value) {
                const ele = response.data.data[value]
                kftime = ele.start_date
              } else if (csid === value) {
                const ele = response.data.data[value]
                cstime = ele.start_date
              }
            }
            const date = new Date()
            var time = this.getTimeByDate(date)
            if (kftime === time) {
              kfratetotal += 1
            } else if (cstime === time) {
              csratetotal += 1
            }
          }
        }
        kftotalNum += kftotal
        kffinishedNum += kfrate
        cstotalNum += cstotal
        csfinishedNum += csrate
        this.projectListData[1].todayFinish += kfratetotal
        this.projectListData[2].todayFinish += csratetotal
        this.projectListData[1].totalNum += kftotalNum
        this.projectListData[2].totalNum += cstotalNum
        this.projectListData[1].unfinishedNum += kftotalNum - kffinishedNum
        this.projectListData[2].unfinishedNum += cstotalNum - csfinishedNum
        this.projectListData[4].totalNum += kftotalNum + cstotalNum
        this.projectListData[4].unfinishedNum += kftotalNum - kffinishedNum + cstotalNum - csfinishedNum
        this.projectListData[4].todayFinish += kfratetotal + csratetotal
        let finish = this.projectListData[5].totalNum - this.projectListData[5].unfinishedNum
        this.projectListData[5].todayFinish = finish
        var type = ''
        if (finish > 0) {
          type = 'down'
        } else if (finish < 0) {
          type = 'up'
        }
        this.projectListData[5].type = type
        this.projectlistLoading = false
      })
    },
    getReqDataList () {
      this.listLoading = true
      this.reqListData = []
      this.reqListDatas = []
      this.reqTaskListData = []
      this.taskIds = []
      let xqfinish = 0
      getplantime(this.xqIds).then(response => {
        let reqTodayFinish = 0
        if (response.data !== null) {
          for (let key in response.data.data) {
            var data = response.data.data[key]
            const dtt = new Date()
            var today = this.getTimeByDate(dtt)
            var date = ''
            if (typeof (data.design_time) !== 'undefined' && data.design_time !== null) {
              date = data.design_time.split(' ')[0]
            }
            if (date === today) {
              reqTodayFinish++
            }
          }
        }
        this.projectListData[0].todayFinish += reqTodayFinish
        this.projectListData[4].todayFinish += reqTodayFinish
      })
      getxqdatav2(this.xqIds).then(response => {
        if (response.data.data.length > 0) {
          var reqdatas = response.data.data
          for (let i = 0; i < reqdatas.length; i++) {
            var ele = reqdatas[i]
            if (ele[4] !== '新建') {
              xqfinish += 1
            }
          }
          this.projectListData[0].totalNum += response.data.data.length
          this.projectListData[0].unfinishedNum += response.data.data.length - xqfinish
          this.projectListData[4].totalNum += response.data.data.length
          this.projectListData[4].unfinishedNum += response.data.data.length - xqfinish
          for (let j = 0; j < this.taskListDatass.length; j++) {
            const element = this.taskListDatass[j].data
            for (let i = 0; i < element.length; i++) {
              const ele = element[i]
              var t = ele[1]
              var tid = ''
              tid = t.split(' ')[4].replace('#', '')
              this.taskIds.push(tid)
            }
          }
          this.getreqTaskListData()
        } else {
          this.projectListData[0].totalNum = 0
          this.projectListData[0].unfinishedNum = 0
          this.getreqTaskListData()
        }
      })
    },
    getBugDataList () {
      // 获取问题列表数据
      let bugTodayFinish = 0
      getbugdatav2(this.bugIds).then(response => {
        if (response.data.data.length > 0) {
          let unfinbug = 0
          for (let i = 0; i < response.data.data.length; i++) {
            const ele = response.data.data[i]
            if (ele[3] === '已关闭') {
            } else {
              unfinbug++
            }
          }
          this.projectListData[3].totalNum += response.data.data.length
          this.projectListData[3].unfinishedNum += unfinbug
        }
      })
      getplantime(this.bugIds).then(response => {
        if (response.data !== null) {
          for (let key in response.data.data) {
            var data = response.data.data[key]
            const dtt = new Date()
            var today = this.getTimeByDate(dtt)
            var date = ''
            if (typeof (data.end_date) !== 'undefined' && data.end_date !== null) {
              date = data.end_date.split(' ')[0]
            }
            if (date === today) {
              bugTodayFinish++
            }
          }
        }
        this.projectListData[3].todayFinish += bugTodayFinish
      })
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    // 根据获取的权限获取的所有的项目权限
    // getversion (id) {
    //   // 当我点击不同的项目的时候因该获取的所有版本信息id
    //   var obj = {
    //     project_id: id
    //   }
    // },
    // 获取所有的项目数据信息
    getproname (wcobj, nowcobj, index) {
      // 当用户点击切换版本的时候传递一个obj发送后端issue
      var datarow = {proid: wcobj.project_id, verid: wcobj.version_id, kfwc: 0, unkfwc: 0, cswc: 0, uncswc: 0, unbugwc: 0, bugtotal: 0}
      getkfdata(wcobj).then(response => {
        if (response.data.data.length > 0) {
          const kfFinishdata = {
            type: 'kf',
            data: response.data.data
          }
          response.data.data.forEach(item => {
            if (item[4] === '已关闭') {
              datarow.kfwc++
            } else {
              datarow.unkfwc++
            }
          })
          this.taskListDatass = this.taskListDatass.concat(kfFinishdata)
        }
      })
      getcsdata(wcobj).then(response => {
        if (response.data.data.length > 0) {
          const kfFinishdata = {
            type: 'cs',
            data: response.data.data
          }
          response.data.data.forEach(item => {
            if (item[4] === '已关闭') {
              datarow.cswc++
            } else {
              datarow.uncswc++
            }
          })
          this.taskListDatass = this.taskListDatass.concat(kfFinishdata)
        }
      })
      getkfdata(nowcobj).then(response => {
        if (response.data.data.length > 0) {
          const csFinishdata = {
            type: 'kf',
            data: response.data.data
          }
          datarow.unkfwc += response.data.data.length
          this.taskListDatass = this.taskListDatass.concat(csFinishdata)
        }
      })
      getcsdata(nowcobj).then(response => {
        if (response.data.data.length > 0) {
          const csFinishdata = {
            type: 'cs',
            data: response.data.data
          }
          datarow.uncswc += response.data.data.length
          this.taskListDatass = this.taskListDatass.concat(csFinishdata)
        }
        var ele = {
          project_id: wcobj.project_id,
          version_id: wcobj.version_id
        }
        getqualitydatav2(ele).then(res => {
          var caseData = res.data.data
          if (caseData.length > 0) {
            for (let i = 0; i < caseData.length; i++) {
              const element = caseData[i]
              datarow.bugtotal += element[10].split(' ')[4] - 0
              datarow.unbugwc += (element[11].split(' ')[4] - 0) + (element[12].split(' ')[4] - 0) + (element[13].split(' ')[4] - 0) + (element[14].split(' ')[4] - 0)
            }
          }
          var kftype = ''
          var kfjd = datarow.kfwc / (datarow.kfwc + datarow.unkfwc)
          if ((datarow.kfwc + datarow.unkfwc) === 0) {
            kftype = 'wu'
          }
          if (Number.isNaN(kfjd)) {
            kfjd = 0
          } else if (kfjd !== 100 && kfjd !== 0) {
            kfjd = (kfjd * 100).toFixed(2)
          }
          var csjd = datarow.cswc / (datarow.cswc + datarow.uncswc)
          var cstype = ''
          if ((datarow.cswc + datarow.uncswc) === 0) {
            cstype = 'wu'
          }
          if (Number.isNaN(csjd)) {
            csjd = 0
          } else if (csjd !== 100 && csjd !== 0) {
            csjd = (csjd * 100).toFixed(2)
          }
          var zjd = (datarow.kfwc + datarow.cswc) / (datarow.kfwc + datarow.cswc + datarow.unkfwc + datarow.uncswc)
          var ztype = ''
          if ((datarow.kfwc + datarow.cswc + datarow.unkfwc + datarow.uncswc) === 0) {
            ztype = 'wu'
          }
          if (Number.isNaN(zjd)) {
            zjd = 0
          } else if (zjd !== 100 && zjd !== 0) {
            zjd = (zjd * 100).toFixed(2) - 0
          }
          var bugjd = (datarow.bugtotal - datarow.unbugwc) / datarow.bugtotal
          var bugtype = ''
          if (datarow.bugtotal === 0) {
            bugtype = 'wu'
          }
          if (Number.isNaN(bugjd)) {
            bugjd = 0
          } else if (bugjd !== 100 && bugjd !== 0) {
            bugjd = (bugjd * 100).toFixed(2)
          }
          this.proinfo[index].buginfo = (datarow.bugtotal - datarow.unbugwc) + '/' + datarow.bugtotal
          this.proinfo[index].csinfo = datarow.cswc + '/' + (datarow.cswc + datarow.uncswc)
          this.proinfo[index].kfinfo = datarow.kfwc + '/' + (datarow.kfwc + datarow.unkfwc)
          this.proinfo[index].zjdinfo = (datarow.kfwc + datarow.cswc) + '/' + (datarow.kfwc + datarow.cswc + datarow.unkfwc + datarow.uncswc)
          this.proinfo[index].bugjd = bugjd - 0
          this.proinfo[index].kfjdname = kfjd - 0
          this.proinfo[index].csjdname = csjd - 0
          this.proinfo[index].zjdname = zjd
          this.proinfo[index].kftype = kftype
          this.proinfo[index].cstype = cstype
          this.proinfo[index].ztype = ztype
          this.proinfo[index].bugtype = bugtype
          this.proinfo[index].versionid = datarow.verid - 0
          this.$forceUpdate()
          this.jzrate = true
        })
      })
    },
    // 向后端掉数据redmine规范这一块的数据
    // 像后端掉数据redmine规范这一块的数据
    getchecklist (obj) {
      // redmine的后端数据
      // var obj = {
      //   project_id: '28, 77, 30, 31, 32, 78, 378'
      // }
      reqchecklist(obj).then(response => {
        this.redmineLoading = true
        var checkdist = response.data.data
        this.projectListData[5].unfinishedNum = response.data.data.length
        if (response.data.data.length > 0) {
          var itemarr = this.demandarrCheck(checkdist, 1).sort(this.compare('count'), false)
          var demandarr = this.demandarrCheck(checkdist, 2).sort(this.compare('count'), false)
          var newarr = []
          var name = []
          var obj = {}
          demandarr.forEach(item => {
            if (newarr.length < 10) {
              newarr.push(item.count)
              name.push(item.name)
            }
          })
          var itemdata = {}
          var itemcount = []
          var itemname = []
          itemarr.forEach(item => {
            if (itemname.length < 10) {
              itemcount.push(item.count)
              itemname.push(item.name)
            }
          })
          for (let i = 0; i < this.proinfo.length; i++) {
            const pro = this.proinfo[i]
            if (itemname.indexOf(pro.name) < 0) {
              itemname.push(pro.name)
              itemcount.push(0)
            }
          }
          itemdata.name = itemname
          itemdata.count = itemcount
          obj.name = name
          obj.count = newarr
          //  渲染redmin规范人员和项目
          this.echartsredminitem('redminitem', itemdata)
        //   this.echartsredminper('redminper', obj)
        }
        var checkarr = this.arrCheck(checkdist).sort(this.compare('count', false))
        var newarr1 = []
        var name1 = []
        var obj1 = {}
        checkarr.forEach(item => {
          if (newarr1.length < 10 && item.name !== null && item.name !== '') {
            newarr1.push(item.count)
            name1.push(item.name)
          }
        })
        obj1.name = name1
        obj1.count = newarr1
        // this.echartsstandline('leaderstand', obj1)
        let finish = this.projectListData[5].totalNum - this.projectListData[5].unfinishedNum
        this.projectListData[5].todayFinish = finish
        var type = ''
        if (finish > 0) {
          type = 'down'
        } else if (finish < 0) {
          type = 'up'
        }
        this.projectListData[5].type = type
        this.projectlistLoading = false
        this.redmineLoading = false
      })
    },
    arrayCnt (arr, type) {
      var newArr = []
      // 使用set进行数组去重
      newArr = [...new Set(arr)]
      if (type === 'name') {
        return newArr
      } else {
        var newarr2 = new Array(newArr.length)
        for (var t = 0; t < newarr2.length; t++) {
          newarr2[t] = 0
        }
        for (var p = 0; p < newArr.length; p++) {
          for (var j = 0; j < arr.length; j++) {
            if (newArr[p] === arr[j]) {
              newarr2[p]++
            }
          }
        }
        var rowlist = []
        for (var m = 0; m < newArr.length; m++) {
          const row = {
            name: newArr[m],
            num: newarr2[m]
          }
          rowlist.push(row)
        }
        return rowlist
      }
    },
    getredmindata () {
      reqchecklist().then(res => {
        // console.log(res)
        var demand = res.data.data
        // console.log(demand[0][1])
        var itemarr = this.demandarrCheck(demand, 1).sort(this.compare('count'), false)
        var demandarr = this.demandarrCheck(demand, 2).sort(this.compare('count'), false)
        // console.log(demandarr)
        var newarr = []
        var name = []
        var obj = {}
        demandarr.forEach(item => {
          if (newarr.length < 10) {
            newarr.push(item.count)
            name.push(item.name)
          }
        })
        var itemdata = {}
        var itemcount = []
        var itemname = []
        itemarr.forEach(item => {
          if (itemname.length < 10) {
            itemcount.push(item.count)
            itemname.push(item.name)
          }
        })
        itemdata.name = itemname
        itemdata.count = itemcount
        obj.name = name
        obj.count = newarr
        //  渲染redmin规范人员和项目
        this.echartsredminitem('redminitem', itemdata)
        this.echartsredminper('redminper', obj)
        var quexian = this.demandarrCheck(demand, 3).sort(this.compare('count'), false)
        // console.log(quexian)
      })
    },
    getqualitydatav2 () {
      // this.list.sort(this.compare('count', false))
      // var newarr = []
      // var name = []
      // var obj = {}
      // this.list.forEach(item => {
      //   if (newarr.length < 5 && item.proname !== '') {
      //     newarr.push(item.count)
      //     name.push(item.proname)
      //   }
      // })
      // obj.name = name
      // obj.count = newarr
      // this.echartsdemandline('leaderdemand', obj)
      // 提交缺陷分布 bug数发现
      this.quChong(this.list2)
      this.list2.sort(this.compare('count', false))
      var newarr2 = []
      var name2 = []
      var obj2 = {}
      // 缺陷数排在前十的数组对象
      this.list2.forEach(item => {
        if (newarr2.length < 10) {
          newarr2.push(item.count)
          name2.push(item.name)
        }
      })
      obj2.name = name2
      obj2.count = newarr2
      this.echartssubmitline('leadersubmit', obj2)
    },
    getdevjobstaticList () {
      this.xfbuglist.sort(this.compare('count', false))
      var newarr = []
      var name = []
      var obj = {}
      // 缺陷数排在前十的数组对象
      this.xfbuglist.forEach(item => {
        if (newarr.length < 10) {
          newarr.push(item.count)
          name.push(item.name)
        }
      })
      obj.name = name
      obj.count = newarr
      this.echartsrepaireline('leaderRepair', obj)
    },
    getAddmouth (id, index) {
      // 本月新增的数据获取
      // 调接口需要传递的本月的数据对象
      var obj = {
        project_id: id,
        static_month: 0
      }
      // 调接口需要传递的上月的数据对象
      // var obj2 = {
      //   project_id: itemid,
      //   static_month: 0
      // }
      mouthadd(obj).then(response => {
        var arr = response.data.data
        if (arr.length > 0) {
          this.byxz = this.byxz + Number(arr[0][3].split(' ')[4])
          this.syxz = this.syxz + Number(arr[1][3].split(' ')[4])
          this.bylj = this.bylj + Number(arr[0][9].split(' ')[4])
          this.sylj = this.sylj + Number(arr[1][9].split(' ')[4])
        }
        if (index === this.prooptions.length - 1) {
          var a = this.byxz
          var b = this.syxz
          var c = this.bylj
          var d = this.sylj
          var resdata = {
            arr1: [a, c],
            arr2: [b, d]
          }
          this.echartsproline('leaderline', resdata)
        }
      })
    },
    getTimeByDate02 () {
      const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    getTimeByDate01 () {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 90)
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const time = `${YY}-${MM}-01`
      return time
    },
    // 获取数组中重复的name数组
    quChong (arr) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i].name
        var count = 0
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].name === temp) {
            count++
          }
          if (j !== arr.length - 1) {
            newArr.push({name: temp, count: count})
          }
        }
      }
      return newArr
    },
    arrCheck (arr) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i][7]
        var count = 0
        for (var j = 0; j < arr.length; j++) {
          if (arr[j][7] === temp) {
            count++
            arr[j][7] = -1
          }
        }
        if (temp !== -1) {
          newArr.push({name: temp, count: count})
        }
      }
      return newArr
    },
    demandarrCheck (arr, index) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i][index]
        var count = 0
        for (var j = 0; j < arr.length; j++) {
          if (arr[j][index] === temp) {
            count++
            arr[j][index] = -1
          }
        }
        if (temp !== -1) {
          newArr.push({name: temp, count: count})
        }
      }
      return newArr
    },
    // 排序
    compare (property, desc) {
      // console.log(property)
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        if (desc === true) {
            // 升序排列
          return value1 - value2
        } else {
            // 降序排列
          return value2 - value1
        }
      }
    },
    // 未关闭需求的echarts
    echartsdemandline (id, obj) {
      var width1 = window.screen.width
      // console.log(width1)
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
          right: '10%',
          bottom: '5%',
          containLabel: true
        },
        legend: {
          x: 'center',
          data: ['全部', '延迟', '进行中']
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
            data: obj.name,
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
                color: '#333'  // 设置刻度地下字体颜色
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#333'
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
              show: false
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: '全部',
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
            data: obj.count
          }, {
            name: '延迟',
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
            data: [11, 10, 3, 5, 0]
          }, {
            name: '进行中',
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
            data: [2, 0, 2, 0, 1]
          }
        ]
      }, true)
      myChart.resize()
      myChart.getZr().on('click', (params) => {
        // console.log(params)
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[1]
          var op = myChart.getOption()
          var checkname = op.yAxis[0].data[xIndex]
          // console.log(checkname)
          const row = {
            project_id: '',
            type: '1'
          }
          for (let i = 0; i < this.proinfo.length; i++) {
            const element = this.proinfo[i]
            if (element.name === checkname) {
              row.project_id = element.id
            }
          }
          this.$router.push({path: '/erneed', query: row})
        }
      })
    },
    // redmin规范--项目
    echartsredminitem (id, obj) {
      // console.log(obj)
      var width1 = window.screen.width
      // console.log(width1)
      if (width1 > 1280) {
        document.getElementById(id).style.width = 700 + 'px'
      } else {
        document.getElementById(id).style.width = 590 + 'px'
      }
      if (obj.count.length > 10) {
        obj.count = obj.count.slice(0, 10)
        obj.name = obj.name.slice(0, 10)
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
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF'],
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              // rotate: 15,
              formatter: function (value) {
                // if (value.length > 8) {
                //   return value.split('/')[0] + '\n' + value.split('/')[1]
                // } else if (value.length > 6) {
                //   return value.substring(0, value.length / 2) + '\n' + value.substring(value.length / 2)
                // } else {
                //   return value
                // }
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
              show: false
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
            // data: youdata.error_num_list
            // data: [2, 3, 4, 5, 6, 7]
            data: obj.count
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
          this.proinfo.forEach(item => {
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
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF'],
            data: obj.proname,
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
              show: false
            }
          }
        ],
        series: [
          // {
          //   name: '缺陷',
          //   type: 'bar',
          //   barGap: 0,
          //   itemStyle: {
          //     normal: {
          //       color: '#4B78CD',
          //       label: {
          //         show: true,
          //         position: 'top'
          //       }
          //     }
          //   },
          //   barMaxWidth: 50,
          //   data: obj.probug
          //   // data: [2, 3, 4, 5, 6, 7]
          //   // data: obj.count
          // },
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
            data: obj.scfknum
            // data: [2, 3, 4, 5, 6, 7]
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
          // console.log(params.offsetX % 88)
          // console.log(pointInPixel)
          // var bs = window.innerWidth / 1920
          // if (bs < 0.9) {
          //   bs = 0.82
          // }
          // console.log(window.innerWidth / 1920)
          var checkname = op.xAxis[0].data[xIndex]
          // var a = 73 + (1396 * bs - 73) / 20 + xIndex * ((1396 * bs - 73) / 10)
          // console.log(a)
          // let userdata = {
          //   proid: '',
          //   bugTimeType: this.bugTimeType
          // }
          let typedata = {
            proid: '',
            type: '累积待解决',
            bugTimeType: this.bugTimeType
          }
          this.allitems.forEach(item => {
            if (item.proname === checkname) {
              // userdata.proid = item.project_id
              typedata.proid = item.project_id
            }
          })
          // if (params.offsetX > a) {
            // 传生产反馈
          this.$router.push({path: '/erprob', query: typedata})
          // } else {
          //   // 传缺陷
          //   this.$router.push({path: '/esubmission', query: userdata})
          // }
          // this.$router.push({path: '/erprob', query: row})
          // console.log(params)
          console.log(params.offsetX)
        }
      })
    }
  }
}
</script>

<style scoped>
.leader{
    width: 100%;
    margin:15px auto ;
    /* height: 2000px; */
    /* background-color: red; */
}
.leaderheader{
    width: 100%;
    display: flex;
    margin-top: 15px;
}
.leadertable,
.leaderline,
.leaderdemand,
.leaderstandard{
    flex: 1;
    height: 285px;
    background-color: #fff;
}
.leadertable,
.leaderline,
.leaderdemand{
    margin-right:15px;
}
.leaderline p,
.leaderdemand p,
.leaderstandard p,
.leadersubmit p,
.leaderRepair p,
.leaderregst p{
    margin: 0;
    padding: 15px 0 0 15px;
    font-size: 16px;
    font-weight: 700;
    width: 100%;
}

.leaderfooter{
    width: 100%;
    margin-top: 15px;
    height: 660px;
    display: flex;
}
.leaderregst{
    /* flex: 5; */
    width: 100%;
    background-color: #fff;
    height: 100%;
    /* margin-right: 15px; */
    height: 660px;
}
.leaderdefect{
    /* flex: 3; */
    width: 34%;
    height: 100%;
    display: flex;
    flex-flow: wrap;
}
.leadersubmit{
    width: 100%;
    margin-bottom: 15px;
    height: 320px;
    background-color: #fff;
    display: flex;
    flex-flow: wrap;
}
.leaderRepair{
    width: 100%;
    height: 320px;
    background-color: #fff;
    /* display: flex; */
    /* justify-content: center; */
}
#leaderregst{
  height: 586px;
  /* background-color: red; */
}
.slidebox{
  display: flex;
  flex-flow: wrap;
  width:150px;
  height:360px;
  /* background:pink; */
  position:absolute;
  top:150px;
  left:44px;
}
.slide{
  width: 100%;
  padding-right: 15px;
  height: 46px;
  line-height: 45px;
  /* background-color: yellow; */
  text-align: right;
}
</style>
<style scoped>
  .el-select {
    border: none;
  }
  .el-input--suffix{
    height: 20px;
  }
  .el-input__inner{
    height: 20px;
    text-align: right;
    border: none;
    font-size: 12px;
  }
  .el-select-dropdown__item{
    font-size: 12px;
    /* padding: 0; */
    width: 100%;
    /* text-align: center; */
    height: 30px;
    line-height: 30px;
  }
  .el-select-dropdown__list{
    padding: 0;
    width: 100px;
  }
  .el-select-dropdown__wrap .el-scrollbar__wrap{
    margin-bottom: 0px !important;
  }
  .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    width: 100px;
  }
  .el-select-dropdown__wrap{
    margin-bottom: 0px !important;    
    width: 100px;
  }
  .el-scrollbar{
    width: 100px;
  }
  .el-popper{
    min-width: 100px !important;
    left: 308px !important;
  }
  .item {
    display: flex;
    align-items: center;
    flex-flow: wrap;
    height: 72px;
  }
  .forbox{
    width: 100%;
    height:52px;
    display: flex;
    align-items: center;
  }
  .el-progress,.box{
    flex: 1;
    margin-left: 20px;
  }
  .box{
    font-size: 14px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .iteminfo{
    width: 147px;
    height: 52px;
    text-align: right;
    margin-bottom: 19px;
  }
  .el-progress-bar__outer{
    height: 35px !important;
  }
  .el-progress-bar{
    height: 35px !important;
  }
  .addviews{
    width: 100%;
    height: 250px;
    /* background-color: #fff; */
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
  }
  .redminper{
    flex: 1;
    margin-right: 15px;
    background-color: #fff;
  }
  .redminper p,
  .redminitem p,
  .itemport p{
    margin: 0;
    padding: 15px 0 0 15px;
    font-size: 16px;
    font-weight: 700;
  }
  .redminitem{
    flex: 1;
    background-color: #fff;
  }
  .itemport{
    margin-top: 15px;
    width: 100%;
    background-color: #fff;
    height:262px;
    position: relative;
  }
  .rleft{
    /* width: 49%; */
    flex: 1;
    margin-right: 15px;
  }
  .rright{
    /* width: 49%; */
    flex: 1;
  }
  .boxradios{
    /* margin: auto; */
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: 15px;
  /* margin-left: 200px; */
  }
  .ranking{
    width:100%;
    margin-top:15px;
    display:flex;
    padding-bottom:50px;
  }
  .allinfo{
    flex: 1;
    margin-left: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .titlogbox{
    background:#fff;
    height:70px;
    margin-right:15px;
    border-radius: 5px;
  }
  .etit{
    display: flex;
  }
  .elog{
    flex: 1;
    height: 100px;
    margin-right: 15px;
    background-color: #fff;
    /* width: 14.2%; */
  }
</style>

<style>
  #leaderline>div>canvas:hover{
    cursor: pointer;
  }
  #leaderdemand>div>canvas:hover{
    cursor: pointer;
  }
  #leaderstand>div>canvas:hover{
    cursor: pointer;
  }
  #leadersubmit>div>canvas:hover{
    cursor: pointer;
  }
  #leaderRepair>div>canvas:hover{
    cursor: default;
  }
  #itemport>div>canvas:hover{
    cursor: pointer;
  }
  #redminper>div>canvas:hover{
    cursor: pointer;
  }
  #redminitem>div>canvas:hover{
    cursor: pointer;
  }
  .itemversion .el-select {
    border: none;
  }
  .itemversion .el-input--suffix{
    height: 20px;
  }
  .itemversion .el-input__inner{
    height: 20px;
    text-align: right;
    border: none;
    font-size: 12px;
  }
  .itemversion .el-select-dropdown__item{
    font-size: 12px;
    padding: 0;
    width: 140px;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  .itemversion .el-select-dropdown__list{
    padding: 0;
    width: 150px;
  }
  .itemversion .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    width: 100px;
  }
  .itemversion .el-select-dropdown__wrap{
    margin-bottom: 0px !important;    
    width: 100px;
  }
  
  .itemversion >>> .el-scrollbar{
    width: 100px;
  }
  .iteminfo >>> .el-popper{
    min-width: 100px !important;
  }
  .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-bottom: 0 !important;
  }
  .itemversion >>> .el-select-dropdown,.el-popper{
    min-width: 130px !important;
    left: 280px !important;
  }
  .el-select-dropdown .popper__arrow{
    left: 70px !important;
  }
  .askitem{
    display: flex;
    width: 90%;
    /* flex: 1; */
    height: 40px;
  }
  .titleitemname{
    width: 25%;
    /* float: 1; */
    text-align: center;
    margin-left: 20px;
  }
  .itemname{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    font-size: 14px;
    text-align: center;
  }
  .itemname div{
    font-size: 14px;
  }
  .first .el-progress-bar__inner{
    background-color: #4b78cd;
  }
  .second .el-progress-bar__inner{
    background-color: rgb(94,189,124);
  }
  .el-progress-bar__inner{
    text-align: center;
  }
  .el-table .warning-row {
    background: rgba(204, 225, 245, 1);
  }
  .el-table .success-row {
    background: #ffffff;
  }
  .el-table .pink-row{
    background-color: rgba(243, 216, 216, 1);
  }
.el-table .sort-caret.ascending{
  border-bottom-color:#ccc;
}
.el-table .sort-caret.descending{
  border-top-color:#ccc;
}
.el-progress-bar__outer{
  background-color: #606061;
}
#leaderregst::-webkit-scrollbar {
  display: block
}
.raibox{
  display: flex;
  width: 100%;
  height: 36px;
}
.el-radio+.el-radio{
  margin-left: 10px;
}
.leaderrep .el-tabs__header{
  background-color: #fff;
  padding: 0 15px 30px;
  margin:0;
}
.el-tabs__item:focus.is-active.is-focus:not(:active) {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.el-input__inner[data-v-229194da]{
  height:40px;
  border: 1px solid #ccc;
}
/* .el-select-dropdown__item[data-v-229194da]{
  width: 100%;
  padding: 0 15px;
} */
</style>
